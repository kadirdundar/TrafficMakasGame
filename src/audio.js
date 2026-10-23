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
    this.master.connect(this.ctx.destination);

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

    // Tire cornering load / asphalt scrub
    this.tireGain = silent();
    this.tireFilter = band('bandpass', 920, 4.5, this.tireGain);
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
    const engineVol = (0.016 + rpmNorm * 0.022 + this.load * 0.026) * shiftLevel;
    this.engineGain.gain.setTargetAtTime(engineVol, now, 0.06);

    // Muted turbo breath (heavily insulated Hot-V turbos, no boy-racer whistle)
    this.turboFilter.frequency.setTargetAtTime(1100 + this.boost * 1200, now, 0.15);
    this.turboGain.gain.setTargetAtTime(this.boost * 0.0025, now, 0.15);

    // Tyre roar and laminar wind create a peaceful, serene highway cruiser ambience
    this.roadFilter.frequency.setTargetAtTime(160 + speedNorm * 320, now, 0.2);
    this.roadGain.gain.setTargetAtTime(0.010 + Math.pow(speedNorm, 1.6) * 0.045, now, 0.2);
    this.windFilter.frequency.setTargetAtTime(600 + speedNorm * 800, now, 0.2);
    this.windGain.gain.setTargetAtTime(Math.pow(speedNorm, 2.5) * 0.0045, now, 0.2);

    // Tire cornering load / scrub sound when weaving hard at speed
    if (this.tireGain && this.tireFilter) {
      const absG = Math.abs(lateralG);
      const speedFactor = Math.min(1, speedKmh / 120);
      const scrubVol = absG > 0.42 ? Math.min(0.055, (absG - 0.42) * 0.075 * speedFactor) : 0.0;
      this.tireFilter.frequency.setTargetAtTime(780 + absG * 340, now, 0.05);
      this.tireGain.gain.setTargetAtTime(scrubVol, now, 0.05);
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

  playMakasWhoosh(comboLevel = 1, isDouble = false) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    // 1. Aerodynamic Doppler Whoosh as you slice past the car
    const dur = 0.28;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const env = Math.sin((i / bufSize) * Math.PI);
      d[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.0;
    filter.frequency.setValueAtTime(950, now);
    filter.frequency.exponentialRampToValueAtTime(240, now + dur);

    const whooshGain = this.ctx.createGain();
    whooshGain.gain.setValueAtTime(0.18, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.01, now + dur);

    noise.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(this.master);
    noise.start(now);

    // 2. Stylish Combo Chime (pitch scales with combo!)
    const chimeOsc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chimeOsc.type = 'sine';
    const baseNote = 520 + Math.min(comboLevel, 10) * 65;
    chimeOsc.frequency.setValueAtTime(baseNote, now);
    if (isDouble) {
      chimeOsc.frequency.setValueAtTime(baseNote * 1.25, now + 0.07);
      chimeOsc.frequency.setValueAtTime(baseNote * 1.5, now + 0.14);
    } else {
      chimeOsc.frequency.exponentialRampToValueAtTime(baseNote * 1.25, now + 0.12);
    }

    chimeGain.gain.setValueAtTime(0.08, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + (isDouble ? 0.28 : 0.18));

    chimeOsc.connect(chimeGain);
    chimeGain.connect(this.master);
    chimeOsc.start(now);
    chimeOsc.stop(now + (isDouble ? 0.3 : 0.2));
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
    if (this.muted && this.ctx) {
      for (const g of [this.engineGain, this.turboGain, this.roadGain, this.windGain, this.tireGain, this.rainGain, this.tunnelGain]) {
        g?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
    } else {
      this.setRainAmbience(this.isRaining);
    }
    return this.muted;
  }
}
