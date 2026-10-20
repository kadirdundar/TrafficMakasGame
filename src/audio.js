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

    // Firing-order tone: warm low harmonics falling off smoothly (no raw sawtooth buzz), with
    // the 2nd and 4th orders lifted the way a V8 exhaust note is
    const N = 32;
    const real = new Float32Array(N);
    const imag = new Float32Array(N);
    for (let n = 1; n < N; n++) {
      imag[n] = (n === 2 ? 1.3 : n === 4 ? 0.9 : 1) / Math.pow(n, 1.35);
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
    // Two banks, very slightly apart, plus the cross-plane half-order burble and crank boom
    this.firingA = osc('firing', 0.55);
    this.firingB = osc('firing', 0.35);
    this.firingB.o.detune.value = 7;
    this.halfOrder = osc('triangle', 0.32);
    this.crankOrder = osc('sine', 0.28);

    // V8 lope: the level swells and dips once per engine cycle (two crank turns); strongest
    // at low revs, smoothing out as the revs rise
    this.lopeGain = ctx.createGain();
    this.lopeGain.gain.value = 1;
    this.lopeLfo = ctx.createOscillator();
    this.lopeLfo.type = 'sine';
    this.lopeDepth = ctx.createGain();
    this.lopeDepth.gain.value = 0.2;
    this.lopeLfo.connect(this.lopeDepth);
    this.lopeDepth.connect(this.lopeGain.gain);
    this.lopeLfo.start();
    for (const v of [this.firingA, this.firingB, this.halfOrder, this.crankOrder]) v.g.connect(this.lopeGain);

    // Load-dependent growl: soft saturation driven harder when the throttle is open
    this.driveGain = ctx.createGain();
    this.driveGain.gain.value = 0.35;
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(2.5 * x) / Math.tanh(2.5);
    }
    shaper.curve = curve;
    shaper.oversample = '2x';

    // Body boom, then the cabin: double glazing and insulation let mostly the low end through
    const bodyEq = ctx.createBiquadFilter();
    bodyEq.type = 'peaking';
    bodyEq.frequency.value = 120;
    bodyEq.Q.value = 0.9;
    bodyEq.gain.value = 5;

    this.cabinFilter = ctx.createBiquadFilter();
    this.cabinFilter.type = 'lowpass';
    this.cabinFilter.frequency.value = 400;
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
    const target = enabled && !this.muted ? 0.035 : 0.0;
    this.rainGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.3);
  }

  updateEngine(rpm, throttle, speedKmh, paused, lateralG = 0) {
    if (!this.ctx || !this.running) return;
    const now = this.ctx.currentTime;
    const dt = Math.min(0.1, Math.max(0, now - this.lastEngineUpdate));
    this.lastEngineUpdate = now;

    if (paused || this.muted) {
      for (const g of [this.engineGain, this.turboGain, this.roadGain, this.windGain, this.tireGain]) {
        g?.gain.setTargetAtTime(0, now, 0.08);
      }
      return;
    }

    const r = Math.max(IDLE_RPM * 0.9, Math.min(MAX_RPM * 1.03, rpm));
    const rpmNorm = clamp01((r - IDLE_RPM) / (MAX_RPM - IDLE_RPM));
    const speedNorm = clamp01(speedKmh / 240);

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
    this.lopeDepth.gain.setTargetAtTime(0.1 + (1 - rpmNorm) * 0.3, now, 0.1);

    // Quiet, muffled hum when cruising; the cabin "opens up" and the V8 growls under load
    this.driveGain.gain.setTargetAtTime(0.32 + this.load * 0.42 + rpmNorm * 0.12, now, 0.06);
    this.cabinFilter.frequency.setTargetAtTime(230 + rpmNorm * 520 + this.load * 650, now, 0.06);

    // Gear changes: a short torque dip on upshifts, a small blip on kickdowns (see triggerGearShift)
    const shiftLevel = now < this.shiftDipUntil ? this.shiftDipLevel : 1;
    const engineVol = (0.05 + rpmNorm * 0.06 + this.load * 0.07) * shiftLevel;
    this.engineGain.gain.setTargetAtTime(engineVol, now, 0.045);

    this.turboFilter.frequency.setTargetAtTime(1300 + this.boost * 2200, now, 0.1);
    this.turboGain.gain.setTargetAtTime(this.boost * 0.012, now, 0.12);

    // Tyre roar and wind grow with speed and dominate over the engine at motorway pace
    this.roadFilter.frequency.setTargetAtTime(180 + speedNorm * 380, now, 0.2);
    this.roadGain.gain.setTargetAtTime(0.012 + Math.pow(speedNorm, 1.5) * 0.06, now, 0.2);
    this.windFilter.frequency.setTargetAtTime(650 + speedNorm * 1000, now, 0.2);
    this.windGain.gain.setTargetAtTime(Math.pow(speedNorm, 2.4) * 0.012, now, 0.2);

    // Tire cornering load / scrub sound when weaving hard at speed
    if (this.tireGain && this.tireFilter) {
      const absG = Math.abs(lateralG);
      const speedFactor = Math.min(1, speedKmh / 120);
      const scrubVol = absG > 0.42 ? Math.min(0.055, (absG - 0.42) * 0.075 * speedFactor) : 0.0;
      this.tireFilter.frequency.setTargetAtTime(780 + absG * 340, now, 0.05);
      this.tireGain.gain.setTargetAtTime(scrubVol, now, 0.05);
    }
  }

  // ZF 8-speed shifts are smooth: no blow-off hiss or exhaust pop, just the engine note
  // dipping for a moment on an upshift and swelling briefly on a kickdown
  triggerGearShift(isUpShift = true) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    this.shiftDipLevel = isUpShift ? 0.6 : 1.2;
    this.shiftDipUntil = now + (isUpShift ? 0.12 : 0.15);
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
      for (const g of [this.engineGain, this.turboGain, this.roadGain, this.windGain, this.tireGain, this.rainGain]) {
        g?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
    } else {
      this.setRainAmbience(this.isRaining);
    }
    return this.muted;
  }
}
