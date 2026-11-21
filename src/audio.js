import { loadEngineSamples } from './engineSamples.js';

// Procedural Web Audio Synthesizer for Engine, Turbo, Horn, Makas Whoosh & Rain
//
// The engine is heard from inside the cabin: a firing-order tone that follows the real RPM, an
// uneven "burble", a little growl under load, and road & wind noise that take over at motorway
// speeds. It was voiced on the Audi A8's 4.0 V8 behind double glazing; each car sets its own
// cylinders, rev range, cabin insulation and turbos over that (setEngineProfile).

// The A8, until a car is selected
const DEFAULT_ENGINE = { cylinders: 8, idleRpm: 700, redline: 6500, insulation: 1, turbo: 1, shiftSec: 0.4, crackle: 0 };

// Lifting off: the pedal counts as lifted below LIFT_PEDAL if it was past LIFT_FROM_PEDAL a moment
// before (a quick lift, not a slow ease off). Pops follow a lift above OVERRUN_FROM of the rev
// range, the turbo's blow-off one with at least BLOWOFF_FROM_BOOST of boost built up.
const LIFT_PEDAL = 0.12;
const LIFT_FROM_PEDAL = 0.6;
const OVERRUN_FROM = 0.4;
const BLOWOFF_FROM_BOOST = 0.35;

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Player volume per sound group (Ayarlar → Ses Seviyeleri), 0..MAX_VOLUME, saved in localStorage.
// The game's own sounds each play into their group's bus (a GainNode at that volume), so a slider
// changes them at once and 0 silences them; the menu music and the radio follow theirs in
// menuMusic.js / radio.js. `master` scales everything.
export const DEFAULT_VOLUMES = {
  master: 1.0,
  engine: 1.0, // engine tone, recorded loops, turbo, pops and blow-off
  tire: 1.0, // tyre squeal and chirps
  wind: 1.0, // wind, road roar, thumps over joints, rain and the whoosh past traffic
  horn: 1.0,
  crash: 1.0, // crashes and the engine bay catching fire
  ui: 1.0, // clicks of the flasher and the menus
  music: 0.7, // menu music
  radio: 1.0,
};
const SFX_GROUPS = ['engine', 'tire', 'wind', 'horn', 'crash', 'ui'];
const MAX_VOLUME = 1.5;
const VOLUMES_KEY = 'otoban_audio_volumes';
const clampVolume = (v) => Math.max(0, Math.min(MAX_VOLUME, v));

// Recorded engine (engineSamples.js): how loud its loops play into the cabin chain next to the
// synthesised tone (more through a thin cabin, as the tone itself gets harder there), and how
// much of the synthesised tone stays under them (its clean low end)
const SAMPLE_LEVEL = 1;
const SAMPLE_LEVEL_OPEN = 2;
const SYNTH_UNDER_SAMPLES = 0.35;

// Low-pass corner of the muffle filter: open (inaudible) and closed in ("underwater")
const OPEN_HZ = 20000;
const MUFFLED_HZ = 650;

// iOS Safari ignores writes to HTMLAudioElement.volume, so the menu music and the radio could not
// be turned down there. Routing the element through a GainNode makes its level settable everywhere.
export function routeThroughGain(audio, ctx, destination = ctx.destination) {
  const source = ctx.createMediaElementSource(audio);
  const gain = ctx.createGain();
  source.connect(gain);
  gain.connect(destination);
  audio.volume = 1;
  return gain;
}

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.running = false;

    this.master = null;
    this.masterGain = null;
    this.engine = { ...DEFAULT_ENGINE };
    this.engineGain = null;
    this.turboGain = null;
    this.roadGain = null;
    this.windGain = null;

    this.hornOsc1 = null;
    this.hornOsc2 = null;
    this.hornGain = null;

    this.rainGain = null;
    this.isRaining = false;

    this.tunnelGain = null;
    this.tunnelDelay = null;
    this.muffle = null;
    this.muffledHold = false; // paused: stays muffled until setMuffled(false)
    this.acousticZone = 'highway';

    // Kullanıcıya özel ses seviyeleri (0.0 - 1.5 arası; localStorage üzerinde saklanır)
    this.volumes = { ...DEFAULT_VOLUMES };
    this.loadSavedVolumes();
    this.buses = {}; // group → GainNode into the compressor (init)
    this.echoSends = {}; // group → GainNode into the tunnel echo (setupTunnelAcoustics)

    // Smoothed engine load / turbo boost and gear-change envelope (see updateEngine)
    this.load = 0;
    this.boost = 0;
    this.lastEngineUpdate = 0;
    this.shiftDipUntil = 0;
    this.shiftDipLevel = 1;
    // Downshift throttle blip, and what lifting off the gas sets going (see updateEngine)
    this.blipUntil = 0;
    this.recentPedal = 0; // the most pedal of the last ~0.4 s
    this.lifted = false;
    this.overrunUntil = 0;
    this.overrunLength = 1;
    // Recorded engine of the current car: one looping voice per loop (see useEngineSamples)
    this.sampleVoices = null;
    this.sampleSetId = null;
  }

  init() {
    if (this.ctx) {
      // iOS leaves the context 'interrupted' after a call or the app switcher, not just 'suspended'
      if (this.ctx.state !== 'running' && this.ctx.state !== 'closed') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();

    // Everything goes through a gentle compressor so stacked sounds never clip on phone speakers
    this.master = this.ctx.createDynamicsCompressor();
    this.master.threshold.value = -14;
    this.master.knee.value = 10;
    this.master.ratio.value = 3;
    this.master.attack.value = 0.005;
    this.master.release.value = 0.2;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0.0 : this.volumes.master;
    this.master.connect(this.masterGain);

    for (const group of SFX_GROUPS) {
      const bus = this.ctx.createGain();
      bus.gain.value = this.volumes[group];
      bus.connect(this.master);
      this.buses[group] = bus;
    }

    // Muffle: a low-pass that is wide open while driving and closes in for an "underwater" sound
    // after a crash and while the drive is paused (see muffleHit, setMuffled). The radio plays
    // through it too.
    this.muffle = this.ctx.createBiquadFilter();
    this.muffle.type = 'lowpass';
    this.muffle.frequency.value = this.muffledHold ? MUFFLED_HZ : OPEN_HZ;
    this.muffle.Q.value = 0.9;
    this.masterGain.connect(this.muffle);
    this.muffle.connect(this.ctx.destination);

    // One looping noise source feeds rain, tyres, road, wind and the turbo
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noise = this.ctx.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;
    this.noise.start();

    this.setupEngine();
    if (this.sampleSetId) {
      const id = this.sampleSetId;
      this.sampleSetId = null;
      this.useEngineSamples(id);
    }
    this.setupRoadNoise();
    this.setupTunnelAcoustics();
    this.setupTireSound();

    // Setup Horn Oscillators (Dual-tone F4 + A4 automotive horn)
    this.hornGain = this.ctx.createGain();
    this.hornGain.gain.value = 0.0;
    this.hornOsc1 = this.ctx.createOscillator();
    this.hornOsc2 = this.ctx.createOscillator();
    this.hornOsc1.type = 'sawtooth';
    this.hornOsc2.type = 'sawtooth';
    this.hornOsc1.frequency.value = 349.23;
    this.hornOsc2.frequency.value = 440.0;

    const hornFilter = this.ctx.createBiquadFilter();
    hornFilter.type = 'bandpass';
    hornFilter.frequency.value = 850;
    hornFilter.Q.value = 2.0;

    this.hornOsc1.connect(hornFilter);
    this.hornOsc2.connect(hornFilter);
    hornFilter.connect(this.hornGain);
    this.hornGain.connect(this.buses.horn);
    this.hornOsc1.start();
    this.hornOsc2.start();

    this.running = true;
    this.onContextReady?.(this.ctx);
  }

  setupEngine() {
    const ctx = this.ctx;

    // Firing-order tone for Audi A8 4.0 TFSI V8:
    // Pure, warm, velvety harmonics with steep natural rolloff.
    // Models an executive limousine cabin with double-glazed acoustic laminated glass:
    // zero metallic buzz, zero harsh sports car rasp.
    const N = 12;
    const real = new Float32Array(N);
    const imag = new Float32Array(N);
    for (let n = 1; n < N; n++) {
      const weight = n === 1 ? 1.0 : n === 2 ? 0.42 : n === 3 ? 0.12 : 0.03 / Math.pow(n, 2.4);
      imag[n] = weight;
    }
    const firingWave = ctx.createPeriodicWave(real, imag);

    const osc = (type, gain) => {
      const o = ctx.createOscillator();
      if (type === 'firing') o.setPeriodicWave(firingWave);
      else o.type = type;
      const g = ctx.createGain();
      g.gain.value = gain;
      o.connect(g);
      o.start();
      return { o, g };
    };
    // Balanced luxury cylinder banks plus deep, smooth sub-bass crank hum (zero harsh detuning)
    this.firingA = osc('firing', 0.32);
    this.firingB = osc('firing', 0.20);
    this.firingB.o.detune.value = 1.0;
    this.halfOrder = osc('sine', 0.18);
    this.crankOrder = osc('sine', 0.26);

    // Smooth executive idle: variable valve timing (Audi AVS) & active hydraulic mounts
    // keep the V8 idle buttery smooth with minimal lope
    this.lopeGain = ctx.createGain();
    this.lopeGain.gain.value = 1;
    this.lopeLfo = ctx.createOscillator();
    this.lopeLfo.type = 'sine';
    this.lopeDepth = ctx.createGain();
    this.lopeDepth.gain.value = 0.04;
    this.lopeLfo.connect(this.lopeDepth);
    this.lopeDepth.connect(this.lopeGain.gain);
    this.lopeLfo.start();
    for (const v of [this.firingA, this.firingB, this.halfOrder, this.crankOrder]) v.g.connect(this.lopeGain);

    // Linear luxury drive: clean, dignified power transfer without rasp or exhaust distortion
    this.driveGain = ctx.createGain();
    this.driveGain.gain.value = 0.26;
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(1.05 * x) / Math.tanh(1.05);
    }
    shaper.curve = curve;

    // Body warmth: subtle deep sub-bass foundation (75 Hz) without boomy sports drone
    const bodyEq = ctx.createBiquadFilter();
    bodyEq.type = 'peaking';
    bodyEq.frequency.value = 75;
    bodyEq.Q.value = 0.8;
    bodyEq.gain.value = 1.5;

    // Audi A8 Acoustic Glass & Bulkhead Insulation:
    // Heavy lowpass filtering that keeps all mid/high mechanical & exhaust rasp out of the cabin
    this.cabinFilter = ctx.createBiquadFilter();
    this.cabinFilter.type = 'lowpass';
    this.cabinFilter.frequency.value = 180;
    this.cabinFilter.Q.value = 0.6;

    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0.0;

    // How much of the synthesised tone plays (less under a recorded engine)
    this.synthLevel = ctx.createGain();
    this.synthLevel.gain.value = 1;
    // Recorded engine loops join after the tone's own shaping, into the cabin's filter
    this.sampleBus = ctx.createGain();
    this.sampleBus.gain.value = SAMPLE_LEVEL;
    this.sampleBus.connect(this.cabinFilter);

    this.lopeGain.connect(this.driveGain);
    this.driveGain.connect(shaper);
    shaper.connect(this.synthLevel);
    this.synthLevel.connect(bodyEq);
    bodyEq.connect(this.cabinFilter);
    this.cabinFilter.connect(this.engineGain);
    this.engineGain.connect(this.buses.engine);
  }

  // Turbo breath, tyre roar, wind and rain, all shaped from the shared noise source
  setupRoadNoise() {
    const ctx = this.ctx;
    const band = (type, freq, q, gainNode, group = 'wind') => {
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      this.noise.connect(f);
      f.connect(gainNode);
      gainNode.connect(this.buses[group]);
      return f;
    };
    const silent = () => {
      const g = ctx.createGain();
      g.gain.value = 0;
      return g;
    };

    // Twin-scroll turbos are barely audible in an A8: a soft rising whoosh, no whistle
    this.turboGain = silent();
    this.turboFilter = band('bandpass', 1500, 1.2, this.turboGain, 'engine');

    this.roadGain = silent();
    this.roadFilter = band('lowpass', 220, 0.7, this.roadGain);

    this.windGain = silent();
    this.windFilter = band('bandpass', 900, 0.6, this.windGain);

    this.rainGain = silent();
    band('bandpass', 1100, 0.7, this.rainGain);
  }

  // Gerçekçi lastik sürtünme & yol tutuş sınır sesi sentezleyicisi (Stochastic stick-slip rubber friction & asphalt aggregate skid)
  setupTireSound() {
    if (!this.ctx || !this.noise) return;
    const ctx = this.ctx;

    // Ana lastik sürtünme kazancı (Kabin içi yalıtımlı, kısık ve gerçekçi lastik kayma sesi)
    this.tireGain = ctx.createGain();
    this.tireGain.gain.value = 0.0;

    // 1. Birincil Kauçuk Ötüşü / Stick-Slip Formantı (~850 - 1100 Hz, çok dar/yüksek rezonans Q=7.5)
    // Asfalt pürüzleri üzerindeki diş bloklarının mikroskobik tutunup-kurtulma rezonansıdır
    this.tireSqueal1 = ctx.createBiquadFilter();
    this.tireSqueal1.type = 'bandpass';
    this.tireSqueal1.frequency.value = 860;
    this.tireSqueal1.Q.value = 7.5;
    const squeal1Gain = ctx.createGain();
    squeal1Gain.gain.value = 2.4;

    // 2. İkincil Üst Harmonik Rezonans (~1850 - 2350 Hz, Q=5.5)
    // Kauçuğun yırtılma ve sıyrılma hissini veren parlak ama organik üst katman
    this.tireSqueal2 = ctx.createBiquadFilter();
    this.tireSqueal2.type = 'bandpass';
    this.tireSqueal2.frequency.value = 1880;
    this.tireSqueal2.Q.value = 5.5;
    const squeal2Gain = ctx.createGain();
    squeal2Gain.gain.value = 1.25;

    // 3. Lastik Gövdesi ve Asfalt Kazıma / Scrub Katmanı (~480 - 640 Hz, Q=2.2)
    // Ağır karkas yükü ve asfalt temas yüzeyindeki sürtünme gövdesi
    this.tireScrub = ctx.createBiquadFilter();
    this.tireScrub.type = 'bandpass';
    this.tireScrub.frequency.value = 520;
    this.tireScrub.Q.value = 2.2;
    const scrubGain = ctx.createGain();
    scrubGain.gain.value = 1.1;

    // Formantları miksleyen toplayıcı
    const tireSumGain = ctx.createGain();
    tireSumGain.gain.value = 0.45;

    this.noise.connect(this.tireSqueal1);
    this.tireSqueal1.connect(squeal1Gain);
    squeal1Gain.connect(tireSumGain);

    this.noise.connect(this.tireSqueal2);
    this.tireSqueal2.connect(squeal2Gain);
    squeal2Gain.connect(tireSumGain);

    this.noise.connect(this.tireScrub);
    this.tireScrub.connect(scrubGain);
    scrubGain.connect(tireSumGain);

    // 4. Non-lineer Kauçuk Doyum Katmanı (WaveShaper - Soft Tanh Saturation)
    // Dijital gürültüyü gerçek kauçuk gibi birbirine bağlayan, toklaştıran non-lineer esneme
    this.tireShaper = ctx.createWaveShaper();
    const nSamples = 256;
    const curve = new Float32Array(nSamples);
    for (let i = 0; i < nSamples; i++) {
      const x = (i * 2) / (nSamples - 1) - 1;
      curve[i] = Math.tanh(x * 2.2);
    }
    this.tireShaper.curve = curve;
    this.tireShaper.oversample = '2x';

    // 5. Kabin İçi Akustik Yalıtım Filtresi (3200 Hz üstü sert tizleri sönümler, tok ve tok tutar)
    this.tireCabinDamp = ctx.createBiquadFilter();
    this.tireCabinDamp.type = 'lowpass';
    this.tireCabinDamp.frequency.value = 3200;
    this.tireCabinDamp.Q.value = 0.7;

    // Sinyal zinciri: miks -> doyum -> kabin sönümleme -> ana lastik kazancı
    tireSumGain.connect(this.tireShaper);
    this.tireShaper.connect(this.tireCabinDamp);
    this.tireCabinDamp.connect(this.tireGain);

    // Lastik kanalına ve tünel yankısına bağla
    this.tireGain.connect(this.buses.tire);
    if (this.echoSends.tire) {
      this.tireGain.connect(this.echoSends.tire);
    }
  }

  setRainAmbience(enabled) {
    this.isRaining = enabled;
    if (!this.ctx || !this.rainGain) return;
    const inTunnel = this.acousticZone === 'tunnel';
    const target = enabled && !inTunnel && !this.muted ? 0.035 : 0.0;
    this.rainGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.3);
  }

  setupTunnelAcoustics() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    this.tunnelDelay = ctx.createDelay();
    this.tunnelDelay.delayTime.value = 0.045; // 45ms slap-back echo

    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 820;
    filter.Q.value = 1.1;

    this.tunnelGain = ctx.createGain();
    this.tunnelGain.gain.value = 0.0;

    // What each group sends into the echo follows its volume too, so 0 silences its echo as well
    for (const group of ['engine', 'tire', 'wind']) {
      const send = ctx.createGain();
      send.gain.value = this.volumes[group];
      send.connect(this.tunnelDelay);
      this.echoSends[group] = send;
    }

    if (this.cabinFilter) {
      this.cabinFilter.connect(this.echoSends.engine);
      this.tunnelDelay.connect(filter);
      filter.connect(feedback);
      feedback.connect(this.tunnelDelay);
      filter.connect(this.tunnelGain);
      this.tunnelGain.connect(this.master);
    }
  }

  setAcousticZone(zone) {
    this.acousticZone = zone;
    if (!this.ctx || !this.running) return;
    const now = this.ctx.currentTime;
    const inTunnel = zone === 'tunnel';
    const inBridge = zone === 'bridge';

    if (this.tunnelGain) {
      const target = inTunnel && !this.muted ? 0.36 : 0.0;
      this.tunnelGain.gain.setTargetAtTime(target, now, 0.25);
    }

    if (this.rainGain) {
      const rainTarget = this.isRaining && !inTunnel && !this.muted ? 0.035 : 0.0;
      this.rainGain.gain.setTargetAtTime(rainTarget, now, 0.25);
    }

    if (this.windFilter) {
      const windFreq = inTunnel ? 520 : inBridge ? 1100 : 900;
      this.windFilter.frequency.setTargetAtTime(windFreq, now, 0.35);
    }
  }

  // Engine of the selected car (car.js → drivetrain): how many cylinders fire, the rev range the
  // tone runs over, how much of it the cabin lets in and how loud the turbos are
  setEngineProfile(drivetrain) {
    this.engine = { ...DEFAULT_ENGINE, ...drivetrain };
    this.useEngineSamples(this.engine.engineSound || null);
  }

  // Plays the car's recorded engine (engineSamples.js) in place of most of the synthesised tone,
  // once it has loaded; null goes back to the synthesised tone alone
  useEngineSamples(id) {
    if (id === this.sampleSetId && (this.sampleVoices || !id)) return;
    this.sampleSetId = id;
    if (!this.ctx) return; // set up in init()
    this.stopEngineSamples();
    if (!id) return;
    loadEngineSamples(this.ctx, id)
      .then((loaded) => {
        if (!loaded || this.sampleSetId !== id || this.sampleVoices) return;
        const now = this.ctx.currentTime;
        const { buffer, set } = loaded;
        this.sampleVoices = set.loops.map((loop) => {
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          src.loopStart = loop.start / set.rate;
          src.loopEnd = (loop.start + loop.length) / set.rate;
          const gain = this.ctx.createGain();
          gain.gain.value = 0;
          src.connect(gain);
          gain.connect(this.sampleBus);
          // Each voice starts at its own point in the loop, so they never line up
          src.start(now, src.loopStart + Math.random() * (src.loopEnd - src.loopStart));
          return { rpm: loop.rpm, src, gain };
        });
      })
      .catch((err) => console.warn('Motor sesi kaydı yüklenemedi, sentez sesi kullanılıyor:', err));
  }

  stopEngineSamples() {
    for (const v of this.sampleVoices || []) {
      v.src.stop();
      v.src.disconnect();
      v.gain.disconnect();
    }
    this.sampleVoices = null;
    this.synthLevel?.gain.setTargetAtTime(1, this.ctx.currentTime, 0.1);
  }

  // The two loops either side of the revs play, each sped up or slowed down to them, faded into
  // each other by how close the revs are to one or the other (equal power: they are unlike)
  updateEngineSamples(now, rpm, open) {
    const voices = this.sampleVoices;
    if (!voices?.length) return;
    this.sampleBus.gain.setTargetAtTime(SAMPLE_LEVEL * (1 + open * SAMPLE_LEVEL_OPEN), now, 0.1);
    let hi = voices.findIndex((v) => v.rpm >= rpm);
    if (hi === -1) hi = voices.length - 1;
    const lo = Math.max(0, hi - 1);
    let mix = 1;
    if (hi !== lo && rpm > voices[lo].rpm) {
      mix = Math.log(rpm / voices[lo].rpm) / Math.log(voices[hi].rpm / voices[lo].rpm);
    } else if (hi !== lo) {
      mix = 0;
    }
    voices.forEach((v, i) => {
      const level = i === lo && i === hi ? 1 : i === lo ? Math.cos((mix * Math.PI) / 2) : i === hi ? Math.sin((mix * Math.PI) / 2) : 0;
      v.gain.gain.setTargetAtTime(level, now, 0.03);
      v.src.playbackRate.setTargetAtTime(Math.max(0.5, Math.min(2, rpm / v.rpm)), now, 0.025);
    });
    this.synthLevel.gain.setTargetAtTime(SYNTH_UNDER_SAMPLES, now, 0.1);
  }

  // A wheel over an expansion joint or a seam: a short, low thud through the floor
  playRoadThump(strength = 1) {
    if (!this.ctx || !this.running || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(82, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.min(0.16, 0.085 * strength) + 0.0001, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    osc.connect(gain);
    gain.connect(this.buses.wind);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // `throttle` is the drive the engine gives (less during an upshift), `pedal` how far the
  // driver's foot is down
  updateEngine(rpm, throttle, speedKmh, paused, lateralG = 0, pedal = throttle) {
    if (!this.ctx || !this.running) return;
    const now = this.ctx.currentTime;
    const dt = Math.min(0.1, Math.max(0, now - this.lastEngineUpdate));
    this.lastEngineUpdate = now;

    if (paused || this.muted) {
      for (const g of [this.engineGain, this.turboGain, this.roadGain, this.windGain, this.tireGain, this.tunnelGain]) {
        g?.gain.setTargetAtTime(0, now, 0.08);
      }
      return;
    }

    const { cylinders, idleRpm, redline, turbo } = this.engine;
    // 0 behind the A8's double glazing, towards 1 as the cabin lets more of the engine in
    const open = 1 - this.engine.insulation;
    const r = Math.max(idleRpm * 0.9, Math.min(redline * 1.03, rpm));
    const rpmNorm = clamp01((r - idleRpm) / (redline - idleRpm));
    const speedNorm = clamp01(speedKmh / 260);

    // Load follows the pedal with a little lag (a downshift blip snaps it open for a moment);
    // boost builds more slowly (turbo spool)
    const blipping = now < this.blipUntil;
    const loadTarget = blipping ? Math.max(throttle, 0.9) : throttle;
    this.load += (loadTarget - this.load) * Math.min(1, dt * (blipping ? 30 : 4));
    const boostTarget = throttle * clamp01((r - 1600) / 2400);
    this.boost += (boostTarget - this.boost) * Math.min(1, dt * (boostTarget > this.boost ? 2 : 5));
    this.updateLiftOff(now, dt, pedal, rpmNorm, open);

    // Firing frequency: a four-stroke engine fires half its cylinders per crank revolution
    // (a V8 four times, a four-cylinder twice, which is why it sounds an octave lower)
    const firingHz = (r / 60) * (cylinders / 2);
    this.firingA.o.frequency.setTargetAtTime(firingHz, now, 0.025);
    this.firingB.o.frequency.setTargetAtTime(firingHz, now, 0.025);
    this.halfOrder.o.frequency.setTargetAtTime(firingHz / 2, now, 0.025);
    this.crankOrder.o.frequency.setTargetAtTime(r / 60, now, 0.025);
    this.lopeLfo.frequency.setTargetAtTime(firingHz / 8, now, 0.025);
    this.updateEngineSamples(now, r, open);
    this.lopeDepth.gain.setTargetAtTime(0.025 + (1 - rpmNorm) * 0.04, now, 0.1);

    // Audi A8 acoustic isolation: subdued, creamy, whisper-quiet background hum
    // Under full throttle, the engine gently opens up to a warm, deep, insulated V8 baritone
    // A less insulated cabin lets the harder edge of the exhaust through: the tone is driven
    // further into the shaper (more harmonics) and the cabin filter opens up with revs and load
    this.driveGain.gain.setTargetAtTime((0.24 + this.load * 0.08) * (1 + open * 2.2), now, 0.06);
    this.cabinFilter.frequency.setTargetAtTime(
      (145 + rpmNorm * 115 + this.load * 135) * (1 + open * (2 + rpmNorm * 5)),
      now,
      0.08
    );

    // Executive cabin sound volume: quiet, calming, and never loud or raspy
    const shiftLevel = now < this.shiftDipUntil ? this.shiftDipLevel : 1;
    const engineVol =
      (0.016 + rpmNorm * 0.022 + this.load * 0.026) * (1 + open * 1.3) * shiftLevel;
    this.engineGain.gain.setTargetAtTime(engineVol, now, 0.06);

    // Muted turbo breath (heavily insulated Hot-V turbos, no boy-racer whistle)
    this.turboFilter.frequency.setTargetAtTime(1100 + this.boost * 1200, now, 0.15);
    this.turboGain.gain.setTargetAtTime(this.boost * 0.0025 * turbo * (1 + open), now, 0.15);

    // Tyre roar and laminar wind create a peaceful, serene highway cruiser ambience
    this.roadFilter.frequency.setTargetAtTime(160 + speedNorm * 320, now, 0.2);
    this.roadGain.gain.setTargetAtTime((0.010 + Math.pow(speedNorm, 1.6) * 0.045), now, 0.2);
    this.windFilter.frequency.setTargetAtTime(600 + speedNorm * 800, now, 0.2);
    this.windGain.gain.setTargetAtTime(Math.pow(speedNorm, 2.5) * 0.0045, now, 0.2);

    // Gerçekçi lastik sesi: Hızlı ve sert sağ-sol manevralarda kauçuğun asfaltta kayma & ötüş hissi
    if (this.tireGain) {
      const absG = Math.abs(lateralG);
      // Düşük hızlarda (< 30 km/s) lastik sürtünmesi/kayması duyulmaz
      const speedFactor = clamp01((speedKmh - 30) / 45);
      // Normal şerit değiştirmede sessizdir; yanal G 0.30G üzerine çıktığında lastik asfaltta kaymaya başlar
      const slipExcess = Math.max(0, absG - 0.30);
      // Non-lineer kauçuk kayma tepkisi (sert manevrada belirginleşir)
      const slipIntensity = Math.min(1.0, Math.pow(slipExcess / 0.60, 1.3));
      // Kullanıcının ayarladığı lastik sesi seviyesi lastik kanalında (buses.tire) uygulanır
      const scrubVol = (paused || this.muted) ? 0.0 : Math.min(0.042, slipIntensity * 0.045 * speedFactor);

      // Yanal G ve hıza bağlı doğal kauçuk stick-slip formant frekans kayması
      const basePitch = 830 + Math.min(1.2, absG) * 220 + speedFactor * 50;

      if (this.tireSqueal1) {
        this.tireSqueal1.frequency.setTargetAtTime(basePitch, now, 0.025);
      }
      if (this.tireSqueal2) {
        this.tireSqueal2.frequency.setTargetAtTime(basePitch * 2.15, now, 0.025);
      }
      if (this.tireScrub) {
        this.tireScrub.frequency.setTargetAtTime(480 + Math.min(1.0, absG) * 160, now, 0.03);
      }
      this.tireGain.gain.setTargetAtTime(scrubVol, now, 0.03);
    }
  }

  // Gear change: the engine note dips on the way up. On the way down the box blips the throttle
  // to match the revs: the note swells and turns harder for a moment (the revs themselves flare
  // in main.js → REV_BLIP). A torque converter or dual clutch does it in a tenth of a second; a
  // manual box (a long shiftSec) lets the engine drop right off while the clutch is in.
  triggerGearShift(isUpShift = true) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const manual = this.engine.shiftSec >= 0.5;
    this.shiftDipLevel = isUpShift ? (manual ? 0.45 : 0.78) : 1.35;
    this.shiftDipUntil = now + (manual ? 0.26 : isUpShift ? 0.1 : 0.16);
    if (!isUpShift) this.blipUntil = now + 0.13;
  }

  // Lifting off the gas quickly: a turbo engine dumps its boost (blow-off) and a sporty exhaust
  // pops and bangs for a second or so while the revs are high (overrun)
  updateLiftOff(now, dt, pedal, rpmNorm, open) {
    this.recentPedal = Math.max(pedal, this.recentPedal - dt * 2.5);
    if (pedal > 0.4) {
      this.lifted = false;
      this.overrunUntil = 0; // back on the gas: the pops stop
    } else if (!this.lifted && pedal < LIFT_PEDAL && this.recentPedal > LIFT_FROM_PEDAL) {
      this.lifted = true;
      if (!this.engine.liftOffSound) return; // everyday cars: no blow-off, no pops
      if (this.engine.turbo > 0 && this.boost > BLOWOFF_FROM_BOOST) {
        this.playBlowOff(this.boost, open);
        this.boost *= 0.2;
      }
      if (this.engine.crackle > 0 && rpmNorm > OVERRUN_FROM) {
        this.overrunLength = 0.5 + rpmNorm * 1.0;
        this.overrunUntil = now + this.overrunLength;
      }
    }

    // Pops come thick at first and thin out as the revs and the unburnt fuel run down
    if (now < this.overrunUntil) {
      const left = (this.overrunUntil - now) / this.overrunLength;
      const perSecond = this.engine.crackle * (4 + 12 * rpmNorm) * left;
      if (Math.random() < perSecond * dt) this.playPop((0.5 + 0.5 * left) * (0.6 + 0.4 * Math.random()), open);
    }
  }

  // One pop on the overrun: a sharp crack of noise through the exhaust's resonance, over a short
  // low thud. Heard mostly through a thin cabin (insulation).
  playPop(strength, open) {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.005;
    const level = strength * this.engine.crackle * (0.25 + open);
    if (level < 0.01) return;
    const dur = 0.03 + Math.random() * 0.05;

    const src = ctx.createBufferSource();
    src.buffer = this.noise.buffer;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 240 + Math.random() * 520;
    band.Q.value = 1.4;
    const crack = ctx.createGain();
    crack.gain.setValueAtTime(0.0001, t);
    crack.gain.exponentialRampToValueAtTime(0.11 * level, t + 0.003);
    crack.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(band);
    band.connect(crack);
    crack.connect(this.buses.engine);
    src.start(t, Math.random() * (src.buffer.duration - 0.2), dur + 0.02);

    const thud = ctx.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(95 + Math.random() * 35, t);
    thud.frequency.exponentialRampToValueAtTime(48, t + dur);
    const body = ctx.createGain();
    body.gain.setValueAtTime(0.0001, t);
    body.gain.exponentialRampToValueAtTime(0.09 * level, t + 0.004);
    body.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.4);
    thud.connect(body);
    body.connect(this.buses.engine);
    thud.start(t);
    thud.stop(t + dur * 1.5);
  }

  // The turbo's blow-off valve venting the boost: a hiss of air falling in pitch. Strong turbos
  // (turbo ≥ 2) flutter a little as it dies away.
  playBlowOff(boost, open) {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.01;
    const { turbo } = this.engine;
    const level = boost * Math.min(1.5, turbo / 1.5) * (0.35 + open);
    if (level < 0.02) return;
    const dur = 0.32 + boost * 0.18;

    const src = ctx.createBufferSource();
    src.buffer = this.noise.buffer;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 2.2;
    band.frequency.setValueAtTime(3600, t);
    band.frequency.exponentialRampToValueAtTime(1300, t + dur);
    const hiss = ctx.createGain();
    hiss.gain.setValueAtTime(0.0001, t);
    hiss.gain.exponentialRampToValueAtTime(0.05 * level, t + 0.02);
    hiss.gain.setTargetAtTime(0.0001, t + 0.06, dur / 3.5);
    src.connect(band);
    band.connect(hiss);
    hiss.connect(this.buses.engine);
    src.start(t, Math.random() * (src.buffer.duration - dur - 0.1), dur + 0.1);

    if (turbo >= 2) {
      const flutter = ctx.createOscillator();
      flutter.frequency.setValueAtTime(26, t);
      flutter.frequency.linearRampToValueAtTime(17, t + dur);
      const depth = ctx.createGain();
      depth.gain.setValueAtTime(0.0001, t);
      depth.gain.linearRampToValueAtTime(0.02 * level, t + 0.08);
      depth.gain.linearRampToValueAtTime(0.0001, t + dur);
      flutter.connect(depth);
      depth.connect(hiss.gain);
      flutter.start(t);
      flutter.stop(t + dur + 0.05);
    }
  }

  setHorn(active) {
    if (!this.ctx || !this.hornGain) return;
    const now = this.ctx.currentTime;
    const target = active && !this.muted ? 0.09 : 0.0;
    this.hornGain.gain.setTargetAtTime(target, now, 0.015);
  }

  playSelektorClick() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.buses.ui);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  // Ani yön değiştirme veya apex viraj sınırında tatlı, kısık bir lastik ötüşü (chirp)
  playTireChirp(speedKmh = 140) {
    if (!this.ctx || this.muted || (this.volumes?.tire ?? 1) <= 0) return;
    const now = this.ctx.currentTime;
    const dur = 0.11;
    const sampleRate = this.ctx.sampleRate;
    const bufSize = Math.floor(sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buf;

    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    const baseFreq = 860 + Math.min(220, Math.max(0, (speedKmh - 80) * 1.2));
    f1.frequency.setValueAtTime(baseFreq, now);
    f1.frequency.exponentialRampToValueAtTime(baseFreq * 1.12, now + 0.035);
    f1.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, now + dur);
    f1.Q.value = 7.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.032, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    source.connect(f1);
    f1.connect(gain);
    gain.connect(this.buses.tire);

    source.start(now);
  }

  playMakasWhoosh(comboLevel = 1, isDouble = false, speedKmh = 140, isRazor = false) {
    if (!this.ctx || this.muted || (this.volumes?.wind ?? 1) <= 0) return;
    const now = this.ctx.currentTime;

    // Gerçekçi Aerodinamik Rüzgar Yarılması & Basınç Dalgası (Whoosh)
    // Aracın anlık hızına ve yakınlığına göre dinamik olarak şekillenir
    const speedRatio = Math.max(0.65, Math.min(1.5, (speedKmh || 140) / 130));
    const dur = isDouble ? 0.52 : 0.40;
    const sampleRate = this.ctx.sampleRate;
    const bufSize = Math.floor(sampleRate * dur);
    const buf = this.ctx.createBuffer(2, bufSize, sampleRate);
    const left = buf.getChannelData(0);
    const right = buf.getChannelData(1);

    // Organik rüzgar gövdesi için Brownian + Pink gürültü sentezi
    let bL = 0;
    let bR = 0;
    for (let i = 0; i < bufSize; i++) {
      const p = i / bufSize;
      let env;
      if (isDouble) {
        // Çift makas (iğne deliği): İki araç arasındaki çift hava girdabı dalgası
        const env1 = Math.pow(Math.sin(Math.min(1, p * 2.2) * Math.PI), 1.6);
        const env2 = p > 0.28 ? Math.pow(Math.sin(Math.min(1, (p - 0.28) * 1.9) * Math.PI), 1.6) * 0.92 : 0;
        env = Math.max(env1, env2);
      } else {
        // Tek araç makası: Aracın yanından geçerken hızla yükselen ve arkasında girdap bırakan rüzgar dalgası
        env = Math.pow(Math.sin(p * Math.PI), 1.5);
      }

      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      bL = (bL + 0.055 * whiteL) / 1.055;
      bR = (bR + 0.055 * whiteR) / 1.055;

      // %72 derin hava sürtünmesi (brown rumble) + %28 yüksek hız rüzgar tıslaması
      const sL = (bL * 3.2 * 0.72 + whiteL * 0.28) * env;
      const sR = (bR * 3.2 * 0.72 + whiteR * 0.28) * env;
      left[i] = Math.max(-1, Math.min(1, sL));
      right[i] = Math.max(-1, Math.min(1, sR));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buf;

    // Filtre 1: Düşük frekanslı hava kütlesi & yer değiştirme rüzgarı (80Hz - 260Hz)
    const lowFilter = this.ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    const startLowFreq = Math.min(380, 220 + speedRatio * 75);
    lowFilter.frequency.setValueAtTime(startLowFreq, now);
    lowFilter.frequency.exponentialRampToValueAtTime(85, now + dur);
    lowFilter.Q.value = 1.25;

    // Filtre 2: Yüksek hız aerodinamik rüzgar girdabı & Doppler kayması (300Hz - 1800Hz)
    const shearFilter = this.ctx.createBiquadFilter();
    shearFilter.type = 'bandpass';
    const startShearFreq = Math.min(2200, 1100 * speedRatio);
    shearFilter.frequency.setValueAtTime(startShearFreq, now);
    shearFilter.frequency.exponentialRampToValueAtTime(260, now + dur);
    shearFilter.Q.value = 1.6;

    // Ana Rüzgar Kazanç Zarfı (kullanıcı ses ayarı rüzgar kanalında uygulanır)
    const whooshGain = this.ctx.createGain();
    const peakGain = (isDouble ? 0.085 : isRazor ? 0.075 : 0.06) * speedRatio;
    whooshGain.gain.setValueAtTime(0.001, now);
    whooshGain.gain.linearRampToValueAtTime(peakGain, now + dur * 0.25);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noiseSource.connect(lowFilter);
    noiseSource.connect(shearFilter);
    lowFilter.connect(whooshGain);
    shearFilter.connect(whooshGain);
    whooshGain.connect(this.buses.wind);

    // Tünelde ise tünel duvarı yankısını ekle
    if (this.acousticZone === 'tunnel' && this.echoSends.wind) {
      whooshGain.connect(this.echoSends.wind);
    }

    noiseSource.start(now);
    noiseSource.stop(now + dur + 0.05);
  }

  playCrash() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const dur = 0.45;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.buses.crash);
    noise.start(now);
  }

  // The engine bay catching fire: a low "whoomp" swelling into a crackling roar that dies away
  playIgnition() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const dur = 2.6;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      // Random crackle pops on top of the roar
      const pop = Math.random() < 0.0015 ? 6 : 1;
      d[i] = (Math.random() * 2 - 1) * pop;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(700, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.002, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.buses.crash);
    noise.start(now);
  }

  // A knock: the impact itself is heard in full, then everything closes in for a moment and
  // opens up again. `heavy` (burning, head-on) holds it longer.
  muffleHit(heavy = false) {
    if (!this.ctx || !this.muffle) return;
    const f = this.muffle.frequency;
    const now = this.ctx.currentTime;
    f.cancelScheduledValues(now);
    f.setValueAtTime(f.value, now);
    f.exponentialRampToValueAtTime(heavy ? 420 : 900, now + 0.09);
    if (this.muffledHold) return;
    f.setValueAtTime(heavy ? 420 : 900, now + (heavy ? 0.55 : 0.25));
    f.exponentialRampToValueAtTime(OPEN_HZ, now + (heavy ? 1.6 : 0.9));
  }

  // Pause and the result card: muffled until the drive goes on
  setMuffled(on) {
    if (on === this.muffledHold) return;
    this.muffledHold = on;
    if (!this.ctx || !this.muffle) return;
    const f = this.muffle.frequency;
    const now = this.ctx.currentTime;
    f.cancelScheduledValues(now);
    f.setValueAtTime(f.value, now);
    f.exponentialRampToValueAtTime(on ? MUFFLED_HZ : OPEN_HZ, now + (on ? 0.25 : 0.4));
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(this.muted ? 0.0 : (this.volumes?.master ?? 1), now, 0.04);
      }
      if (this.muted) {
        for (const g of [this.engineGain, this.turboGain, this.roadGain, this.windGain, this.tireGain, this.rainGain, this.tunnelGain]) {
          g?.gain.setTargetAtTime(0, now, 0.05);
        }
      } else {
        this.setRainAmbience(this.isRaining);
      }
    }
    return this.muted;
  }

  setVolume(category, value) {
    if (!(category in DEFAULT_VOLUMES)) return;
    this.volumes[category] = clampVolume(Number(value) || 0);
    this.saveVolumes();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const v = this.volumes[category];
    if (category === 'master') {
      this.masterGain?.gain.setTargetAtTime(this.muted ? 0.0 : v, now, 0.03);
    }
    this.buses[category]?.gain.setTargetAtTime(v, now, 0.03);
    this.echoSends[category]?.gain.setTargetAtTime(v, now, 0.03);
  }

  loadSavedVolumes() {
    try {
      const d = JSON.parse(localStorage.getItem(VOLUMES_KEY) || 'null');
      if (!d || typeof d !== 'object') return;
      for (const key of Object.keys(DEFAULT_VOLUMES)) {
        if (typeof d[key] === 'number' && Number.isFinite(d[key])) this.volumes[key] = clampVolume(d[key]);
      }
    } catch (_) {}
  }

  saveVolumes() {
    try {
      localStorage.setItem(VOLUMES_KEY, JSON.stringify(this.volumes));
    } catch (_) {}
  }
}
