// Procedural Web Audio Synthesizer for Engine, Turbo, Horn, Makas Whoosh & Rain
//
// The engine is an Audi A8 4.0 TFSI V8 (twin-turbo, cross-plane crank) as heard from inside its
// insulated cabin: a firing-order tone that follows the real RPM, the V8's uneven "burble",
// a little growl under load, and road & wind noise that take over at motorway speeds.

const CYLINDERS = 8;
const IDLE_RPM = 700;
const MAX_RPM = 6500;

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.running = false;

    this.master = null;
    this.masterGain = null;
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
    this.acousticZone = 'highway';

    // Kullanıcıya özel ses seviyeleri (0.0 - 1.5 arası, varsayılan 1.0; localStorage üzerinde saklanır)
    this.volumes = {
      master: 1.0,
      engine: 1.0,
      tire: 1.0,
      wind: 1.0,
    };
    this.loadSavedVolumes();

    // Smoothed engine load / turbo boost and gear-change envelope (see updateEngine)
    this.load = 0;
    this.boost = 0;
    this.lastEngineUpdate = 0;
    this.shiftDipUntil = 0;
    this.shiftDipLevel = 1;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
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
    this.masterGain.connect(this.ctx.destination);

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
    this.hornGain.connect(this.master);
    this.hornOsc1.start();
    this.hornOsc2.start();

    this.running = true;
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

    this.lopeGain.connect(this.driveGain);
    this.driveGain.connect(shaper);
    shaper.connect(bodyEq);
    bodyEq.connect(this.cabinFilter);
    this.cabinFilter.connect(this.engineGain);
    this.engineGain.connect(this.master);
  }

  // Turbo breath, tyre roar, wind and rain, all shaped from the shared noise source
  setupRoadNoise() {
    const ctx = this.ctx;
    const band = (type, freq, q, gainNode) => {
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      this.noise.connect(f);
      f.connect(gainNode);
      gainNode.connect(this.master);
      return f;
    };
    const silent = () => {
      const g = ctx.createGain();
      g.gain.value = 0;
      return g;
    };

    // Twin-scroll turbos are barely audible in an A8: a soft rising whoosh, no whistle
    this.turboGain = silent();
    this.turboFilter = band('bandpass', 1500, 1.2, this.turboGain);

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

    // Ana kompresöre ve tünel yankısına bağla
    this.tireGain.connect(this.master);
    if (this.tunnelDelay) {
      this.tireGain.connect(this.tunnelDelay);
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

    if (this.cabinFilter) {
      this.cabinFilter.connect(this.tunnelDelay);
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

  updateEngine(rpm, throttle, speedKmh, paused, lateralG = 0) {
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

    const r = Math.max(IDLE_RPM * 0.9, Math.min(MAX_RPM * 1.03, rpm));
    const rpmNorm = clamp01((r - IDLE_RPM) / (MAX_RPM - IDLE_RPM));
    const speedNorm = clamp01(speedKmh / 260);

    // Load follows the pedal with a little lag; boost builds more slowly (turbo spool)
    this.load += (throttle - this.load) * Math.min(1, dt * 4);
    const boostTarget = throttle * clamp01((r - 1600) / 2400);
    this.boost += (boostTarget - this.boost) * Math.min(1, dt * (boostTarget > this.boost ? 2 : 5));

    // Firing frequency: a four-stroke V8 fires 4 times per crank revolution
    const firingHz = (r / 60) * (CYLINDERS / 2);
    this.firingA.o.frequency.setTargetAtTime(firingHz, now, 0.025);
    this.firingB.o.frequency.setTargetAtTime(firingHz, now, 0.025);
    this.halfOrder.o.frequency.setTargetAtTime(firingHz / 2, now, 0.025);
    this.crankOrder.o.frequency.setTargetAtTime(firingHz / 4, now, 0.025);
    this.lopeLfo.frequency.setTargetAtTime(firingHz / 8, now, 0.025);
    this.lopeDepth.gain.setTargetAtTime(0.025 + (1 - rpmNorm) * 0.04, now, 0.1);

    // Audi A8 acoustic isolation: subdued, creamy, whisper-quiet background hum
    // Under full throttle, the engine gently opens up to a warm, deep, insulated V8 baritone
    this.driveGain.gain.setTargetAtTime(0.24 + this.load * 0.08, now, 0.06);
    this.cabinFilter.frequency.setTargetAtTime(145 + rpmNorm * 115 + this.load * 135, now, 0.08);

    // Executive cabin sound volume: quiet, calming, and never loud or raspy
    const shiftLevel = now < this.shiftDipUntil ? this.shiftDipLevel : 1;
    const engineVol = (0.016 + rpmNorm * 0.022 + this.load * 0.026) * shiftLevel * this.volumes.engine;
    this.engineGain.gain.setTargetAtTime(engineVol, now, 0.06);

    // Muted turbo breath (heavily insulated Hot-V turbos, no boy-racer whistle)
    this.turboFilter.frequency.setTargetAtTime(1100 + this.boost * 1200, now, 0.15);
    this.turboGain.gain.setTargetAtTime(this.boost * 0.0025 * this.volumes.engine, now, 0.15);

    // Tyre roar and laminar wind create a peaceful, serene highway cruiser ambience
    this.roadFilter.frequency.setTargetAtTime(160 + speedNorm * 320, now, 0.2);
    this.roadGain.gain.setTargetAtTime((0.010 + Math.pow(speedNorm, 1.6) * 0.045) * this.volumes.wind, now, 0.2);
    this.windFilter.frequency.setTargetAtTime(600 + speedNorm * 800, now, 0.2);
    this.windGain.gain.setTargetAtTime(Math.pow(speedNorm, 2.5) * 0.0045 * this.volumes.wind, now, 0.2);

    // Gerçekçi lastik sesi: Hızlı ve sert sağ-sol manevralarda kauçuğun asfaltta kayma & ötüş hissi
    if (this.tireGain) {
      const absG = Math.abs(lateralG);
      // Düşük hızlarda (< 30 km/s) lastik sürtünmesi/kayması duyulmaz
      const speedFactor = clamp01((speedKmh - 30) / 45);
      // Normal şerit değiştirmede sessizdir; yanal G 0.30G üzerine çıktığında lastik asfaltta kaymaya başlar
      const slipExcess = Math.max(0, absG - 0.30);
      // Non-lineer kauçuk kayma tepkisi (sert manevrada belirginleşir)
      const slipIntensity = Math.min(1.0, Math.pow(slipExcess / 0.60, 1.3));
      // Kullanıcının ayarladığı lastik sesi çarpanı ile ölçeklenir
      const scrubVol = (paused || this.muted) ? 0.0 : Math.min(0.042, slipIntensity * 0.045 * speedFactor) * this.volumes.tire;

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

  // Smooth torque-converter ZF 8-speed tiptronic shifts (seamless luxury gear transitions)
  triggerGearShift(isUpShift = true) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    this.shiftDipLevel = isUpShift ? 0.78 : 1.12;
    this.shiftDipUntil = now + (isUpShift ? 0.10 : 0.12);
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
    gain.connect(this.master);
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
    gain.gain.linearRampToValueAtTime(0.032 * (this.volumes?.tire ?? 1), now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    source.connect(f1);
    f1.connect(gain);
    gain.connect(this.master);

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

    // Ana Rüzgar Kazanç Zarfı (Kullanıcı ses ayarı çarpanı ile ölçeklenir)
    const whooshGain = this.ctx.createGain();
    const peakGain = (isDouble ? 0.085 : isRazor ? 0.075 : 0.06) * speedRatio * (this.volumes?.wind ?? 1);
    whooshGain.gain.setValueAtTime(0.001, now);
    whooshGain.gain.linearRampToValueAtTime(peakGain, now + dur * 0.25);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noiseSource.connect(lowFilter);
    noiseSource.connect(shearFilter);
    lowFilter.connect(whooshGain);
    shearFilter.connect(whooshGain);
    whooshGain.connect(this.master);

    // Tünelde ise tünel duvarı yankısını ekle
    if (this.acousticZone === 'tunnel' && this.tunnelDelay) {
      whooshGain.connect(this.tunnelDelay);
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
    gain.connect(this.master);
    noise.start(now);
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
    if (!this.volumes || this.volumes[category] === undefined) return;
    this.volumes[category] = Math.max(0, Math.min(1.5, Number(value) || 0));
    this.saveVolumes();

    if (this.ctx && this.running) {
      const now = this.ctx.currentTime;
      if (category === 'master' && this.masterGain) {
        const target = this.muted ? 0.0 : this.volumes.master;
        this.masterGain.gain.setTargetAtTime(target, now, 0.03);
      }
    }
  }

  loadSavedVolumes() {
    try {
      const raw = localStorage.getItem('otoban_audio_volumes');
      if (raw) {
        const d = JSON.parse(raw);
        if (typeof d.master === 'number') this.volumes.master = Math.max(0, Math.min(1.5, d.master));
        if (typeof d.engine === 'number') this.volumes.engine = Math.max(0, Math.min(1.5, d.engine));
        if (typeof d.tire === 'number') this.volumes.tire = Math.max(0, Math.min(1.5, d.tire));
        if (typeof d.wind === 'number') this.volumes.wind = Math.max(0, Math.min(1.5, d.wind));
      }
    } catch (_) {}
  }

  saveVolumes() {
    try {
      localStorage.setItem('otoban_audio_volumes', JSON.stringify(this.volumes));
    } catch (_) {}
  }
}
