// Procedural Web Audio Synthesizer for Audi A8 4.0 TFSI V8
//
// Features authentic cross-plane biturbo V8 acoustic characteristics:
// - Cross-plane cylinder firing pulse wave with asymmetric combustion harmonics
// - Dual-path active exhaust system: luxury cabin foundation + dynamic sport exhaust flaps
// - Deep sub-bass crank fundamental rumble (40-100 Hz) that gives physical cabin weight
// - Twin-turbo Hot-V spool whistle & high-pressure induction air rush under boost
// - ZF 8HP tiptronic upshift exhaust burp / ignition pop under load
// - Electronic Vmax Speed Limiter (Kesici at 260 km/h) with rapid machine-gun spark cuts & pops
// - Tunnel slapback reverberation, Doppler makas whoosh, horn, crash and rain ambience.

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
    this.noise = null;

    // Engine Oscillators & Gains
    this.firingA = null;
    this.firingB = null;
    this.halfOrder = null;
    this.crankOrder = null;
    this.camOrder = null;
    this.subBass = null;
    this.subBassGain = null;
    this.subBassFilter = null;

    this.lopeGain = null;
    this.lopeLfo = null;
    this.lopeDepth = null;

    this.driveGain = null;
    this.luxuryFilter = null;
    this.luxuryGain = null;
    this.sportFilter = null;
    this.sportGain = null;
    this.exhaustResonator1 = null;
    this.exhaustResonator2 = null;

    this.engineOutput = null;
    this.limiterGain = null;
    this.engineGain = null;
    this.cabinFilter = null; // compatibility alias for tunnel acoustics

    // Turbo whistle & noise
    this.turboGain = null;
    this.turboFilter = null;
    this.turboWhistle = null;
    this.turboWhistleGain = null;
    this.turboHissFilter = null;
    this.turboHissGain = null;

    // Environment & Ambience
    this.roadGain = null;
    this.roadFilter = null;
    this.windGain = null;
    this.windFilter = null;
    this.tireGain = null;
    this.tireFilter = null;

    this.hornOsc1 = null;
    this.hornOsc2 = null;
    this.hornGain = null;

    this.rainGain = null;
    this.isRaining = false;

    this.tunnelGain = null;
    this.tunnelDelay = null;
    this.acousticZone = 'highway';

    // State
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

    // High-headroom master compressor to prevent clipping on mobile speakers & headphones
    this.master = this.ctx.createDynamicsCompressor();
    this.master.threshold.value = -12;
    this.master.knee.value = 12;
    this.master.ratio.value = 3.5;
    this.master.attack.value = 0.003;
    this.master.release.value = 0.18;
    this.master.connect(this.ctx.destination);

    // One looping noise source feeds rain, tyres, road, wind and the turbo hiss
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

    // Dual-tone F4 + A4 automotive horn
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

    // 1. Firing-order periodic wave for Audi 4.0 TFSI biturbo V8:
    // Rich harmonic spectrum with prominent 1st, 2nd, 3rd, 4th, 6th and 8th orders
    // capturing the uneven crossplane exhaust pulse texture and metallic bark
    const N = 48;
    const real = new Float32Array(N);
    const imag = new Float32Array(N);
    for (let n = 1; n < N; n++) {
      let weight = 1.0;
      if (n === 1) weight = 1.0;
      else if (n === 2) weight = 0.88;
      else if (n === 3) weight = 0.65;
      else if (n === 4) weight = 0.72;
      else if (n === 5) weight = 0.38;
      else if (n === 6) weight = 0.52;
      else if (n === 7) weight = 0.28;
      else if (n === 8) weight = 0.44;
      else weight = (n % 2 === 0 ? 0.32 : 0.18) / Math.pow(n / 8, 0.7);

      imag[n] = weight / Math.pow(n, 0.68);
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

    // Bank A (Primary) and Bank B (crossplane detuned bank +7 cents)
    this.firingA = osc('firing', 0.52);
    this.firingB = osc('firing', 0.40);
    this.firingB.o.detune.value = 7;
    // Cross-plane 2nd order (bank exhaust manifold imbalance)
    this.halfOrder = osc('triangle', 0.36);
    // Crankshaft 1st order rotation tone
    this.crankOrder = osc('sine', 0.30);
    // Camshaft 0.5 order rhythmic pulse
    this.camOrder = osc('triangle', 0.24);

    // V8 crossplane idle lope LFO
    this.lopeGain = ctx.createGain();
    this.lopeGain.gain.value = 1.0;
    this.lopeLfo = ctx.createOscillator();
    this.lopeLfo.type = 'sine';
    this.lopeDepth = ctx.createGain();
    this.lopeDepth.gain.value = 0.22;
    this.lopeLfo.connect(this.lopeDepth);
    this.lopeDepth.connect(this.lopeGain.gain);
    this.lopeLfo.start();

    for (const v of [this.firingA, this.firingB, this.halfOrder, this.crankOrder, this.camOrder]) {
      v.g.connect(this.lopeGain);
    }

    // Master Engine Output summing node
    this.engineOutput = ctx.createGain();
    this.engineOutput.gain.value = 1.0;

    // Sub-Bass fundamental: creates that deep, heavy Audi V8 rumble you feel in your chest
    this.subBass = ctx.createOscillator();
    this.subBass.type = 'sine';
    this.subBassFilter = ctx.createBiquadFilter();
    this.subBassFilter.type = 'peaking';
    this.subBassFilter.frequency.value = 65;
    this.subBassFilter.Q.value = 1.2;
    this.subBassFilter.gain.value = 7.0;
    this.subBassGain = ctx.createGain();
    this.subBassGain.gain.value = 0.28;
    this.subBass.connect(this.subBassFilter);
    this.subBassFilter.connect(this.subBassGain);
    this.subBassGain.connect(this.engineOutput);
    this.subBass.start();

    // Channel 1: Cabin Luxury Foundation (Deep, refined lowpass)
    this.luxuryFilter = ctx.createBiquadFilter();
    this.luxuryFilter.type = 'lowpass';
    this.luxuryFilter.frequency.value = 320;
    this.luxuryFilter.Q.value = 0.7;

    const luxuryBass = ctx.createBiquadFilter();
    luxuryBass.type = 'peaking';
    luxuryBass.frequency.value = 85;
    luxuryBass.Q.value = 1.0;
    luxuryBass.gain.value = 5.0;

    this.luxuryGain = ctx.createGain();
    this.luxuryGain.gain.value = 0.45;

    this.lopeGain.connect(this.luxuryFilter);
    this.luxuryFilter.connect(luxuryBass);
    luxuryBass.connect(this.luxuryGain);
    this.luxuryGain.connect(this.engineOutput);

    // Cabin filter alias for tunnel acoustics
    this.cabinFilter = this.luxuryFilter;

    // Channel 2: Dynamic Sport Exhaust Flap (Active Roar & Growl)
    this.driveGain = ctx.createGain();
    this.driveGain.gain.value = 0.40;

    // Asymmetric wave shaper creates rich even & odd harmonics under load
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      if (x >= 0) {
        curve[i] = Math.tanh(3.0 * x) / Math.tanh(3.0);
      } else {
        curve[i] = (Math.tanh(2.0 * x) * 0.85) / Math.tanh(2.0);
      }
    }
    shaper.curve = curve;
    shaper.oversample = '2x';

    // Exhaust cavity body resonance (340 Hz)
    this.exhaustResonator1 = ctx.createBiquadFilter();
    this.exhaustResonator1.type = 'peaking';
    this.exhaustResonator1.frequency.value = 340;
    this.exhaustResonator1.Q.value = 1.6;
    this.exhaustResonator1.gain.value = 5.5;

    // Tailpipe rasp & bark resonance (920 Hz)
    this.exhaustResonator2 = ctx.createBiquadFilter();
    this.exhaustResonator2.type = 'peaking';
    this.exhaustResonator2.frequency.value = 920;
    this.exhaustResonator2.Q.value = 2.0;
    this.exhaustResonator2.gain.value = 7.0;

    // Dynamic high-frequency sport filter
    this.sportFilter = ctx.createBiquadFilter();
    this.sportFilter.type = 'lowpass';
    this.sportFilter.frequency.value = 1100;
    this.sportFilter.Q.value = 0.85;

    this.sportGain = ctx.createGain();
    this.sportGain.gain.value = 0.12; // closed at idle, opens wide under throttle

    this.lopeGain.connect(this.driveGain);
    this.driveGain.connect(shaper);
    shaper.connect(this.exhaustResonator1);
    this.exhaustResonator1.connect(this.exhaustResonator2);
    this.exhaustResonator2.connect(this.sportFilter);
    this.sportFilter.connect(this.sportGain);
    this.sportGain.connect(this.engineOutput);

    // Twin-Turbo Hot-V Whistle & Induction
    this.turboWhistle = ctx.createOscillator();
    this.turboWhistle.type = 'sine';
    this.turboWhistleGain = ctx.createGain();
    this.turboWhistleGain.gain.value = 0.0;
    const turboWhistleFilter = ctx.createBiquadFilter();
    turboWhistleFilter.type = 'bandpass';
    turboWhistleFilter.frequency.value = 2100;
    turboWhistleFilter.Q.value = 3.0;
    this.turboWhistle.connect(turboWhistleFilter);
    turboWhistleFilter.connect(this.turboWhistleGain);
    this.turboWhistleGain.connect(this.master);
    this.turboWhistle.start();

    this.turboHissGain = ctx.createGain();
    this.turboHissGain.gain.value = 0.0;
    this.turboHissFilter = ctx.createBiquadFilter();
    this.turboHissFilter.type = 'bandpass';
    this.turboHissFilter.frequency.value = 2200;
    this.turboHissFilter.Q.value = 2.4;
    this.noise.connect(this.turboHissFilter);
    this.turboHissFilter.connect(this.turboHissGain);
    this.turboHissGain.connect(this.master);

    // Speed Limiter (Kesici at 260 km/h) gate node
    this.limiterGain = ctx.createGain();
    this.limiterGain.gain.value = 1.0;

    // Master Engine Volume Gain
    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0.0;

    this.engineOutput.connect(this.limiterGain);
    this.limiterGain.connect(this.engineGain);
    this.engineGain.connect(this.master);
  }

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

    if (this.engineOutput) {
      this.engineOutput.connect(this.tunnelDelay);
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

  updateEngine(rpm, throttle, speedKmh, paused, lateralG = 0, limiterActive = false, limiterCut = false) {
    if (!this.ctx || !this.running) return;
    const now = this.ctx.currentTime;
    const dt = Math.min(0.1, Math.max(0, now - this.lastEngineUpdate));
    this.lastEngineUpdate = now;

    if (paused || this.muted) {
      for (const g of [
        this.engineGain,
        this.turboGain,
        this.roadGain,
        this.windGain,
        this.tireGain,
        this.tunnelGain,
        this.turboWhistleGain,
        this.turboHissGain,
      ]) {
        g?.gain.setTargetAtTime(0, now, 0.08);
      }
      return;
    }

    const r = Math.max(IDLE_RPM * 0.9, Math.min(MAX_RPM * 1.05, rpm));
    const rpmNorm = clamp01((r - IDLE_RPM) / (MAX_RPM - IDLE_RPM));
    const speedNorm = clamp01(speedKmh / 260);

    // Throttle response & boost spool
    this.load += (throttle - this.load) * Math.min(1, dt * 5);
    const boostTarget = throttle * clamp01((r - 1700) / 2200);
    this.boost += (boostTarget - this.boost) * Math.min(1, dt * (boostTarget > this.boost ? 2.5 : 6));

    // V8 firing frequencies (4 fires per crank turn)
    const firingHz = (r / 60) * (CYLINDERS / 2);
    this.firingA.o.frequency.setTargetAtTime(firingHz, now, 0.02);
    this.firingB.o.frequency.setTargetAtTime(firingHz, now, 0.02);
    this.halfOrder.o.frequency.setTargetAtTime(firingHz / 2, now, 0.02);
    this.crankOrder.o.frequency.setTargetAtTime(firingHz / 4, now, 0.02);
    this.camOrder.o.frequency.setTargetAtTime(firingHz / 8, now, 0.02);

    // Sub-bass fundamental (40-100 Hz punch)
    const subHz = Math.max(24, Math.min(120, firingHz / 4));
    this.subBass.frequency.setTargetAtTime(subHz, now, 0.02);
    this.subBassGain.gain.setTargetAtTime(0.24 + (1 - rpmNorm * 0.5) * 0.16 + this.load * 0.14, now, 0.05);

    // V8 idle lope: pronounced at low RPM, smooth at high RPM
    this.lopeLfo.frequency.setTargetAtTime(firingHz / 8, now, 0.02);
    this.lopeDepth.gain.setTargetAtTime(0.08 + (1 - rpmNorm) * 0.32, now, 0.08);

    // Active Exhaust Flap system:
    // When throttle opens (>0.25) or RPM > 2800, active exhaust flaps open wide!
    const flapOpen = clamp01((this.load - 0.20) / 0.45) * 0.65 + clamp01((r - 2800) / 2200) * 0.35;
    const sportVol = 0.08 + flapOpen * 0.62;
    const luxuryVol = 0.42 + (1.0 - flapOpen * 0.35) * 0.22;
    this.sportGain.gain.setTargetAtTime(sportVol, now, 0.035);
    this.luxuryGain.gain.setTargetAtTime(luxuryVol, now, 0.035);

    // Filter cutoffs follow load and revs
    this.luxuryFilter.frequency.setTargetAtTime(220 + rpmNorm * 360 + this.load * 160, now, 0.05);
    this.sportFilter.frequency.setTargetAtTime(700 + rpmNorm * 900 + this.load * 1250, now, 0.05);
    this.exhaustResonator1.frequency.setTargetAtTime(320 + rpmNorm * 110, now, 0.05);
    this.exhaustResonator2.frequency.setTargetAtTime(880 + rpmNorm * 320, now, 0.05);

    // Growl drive saturation
    this.driveGain.gain.setTargetAtTime(0.42 + this.load * 0.58 + rpmNorm * 0.22, now, 0.04);

    // Twin-Turbo whistle & air hiss
    this.turboWhistle.frequency.setTargetAtTime(1300 + this.boost * 1900, now, 0.08);
    this.turboWhistleGain.gain.setTargetAtTime(this.boost * 0.028, now, 0.08);
    this.turboHissGain.gain.setTargetAtTime(this.boost * 0.022, now, 0.08);

    // Speed Limiter (Kesici at 260 km/h) gate & detune
    if (limiterActive) {
      if (limiterCut) {
        // Ignition cut: sharp volume drop + detune
        this.limiterGain.gain.setValueAtTime(0.12, now);
        this.firingA.o.detune.setValueAtTime(-180, now);
        this.firingB.o.detune.setValueAtTime(-173, now);
      } else {
        // Ignition fire return: full volume + snap back
        this.limiterGain.gain.setValueAtTime(1.0, now);
        this.firingA.o.detune.setValueAtTime(0, now);
        this.firingB.o.detune.setValueAtTime(7, now);
      }
    } else {
      this.limiterGain.gain.setTargetAtTime(1.0, now, 0.02);
      this.firingA.o.detune.setTargetAtTime(0, now, 0.02);
      this.firingB.o.detune.setTargetAtTime(7, now, 0.02);
    }

    // Engine volume: powerful, clear presence throughout all speeds
    const shiftLevel = now < this.shiftDipUntil ? this.shiftDipLevel : 1;
    const engineVol = (0.22 + rpmNorm * 0.16 + this.load * 0.18) * shiftLevel;
    this.engineGain.gain.setTargetAtTime(engineVol, now, 0.035);

    // Road & wind noise: balanced so V8 engine is not masked
    this.roadFilter.frequency.setTargetAtTime(160 + speedNorm * 320, now, 0.2);
    this.roadGain.gain.setTargetAtTime(0.010 + Math.pow(speedNorm, 1.5) * 0.045, now, 0.2);
    this.windFilter.frequency.setTargetAtTime(600 + speedNorm * 800, now, 0.2);
    this.windGain.gain.setTargetAtTime(Math.pow(speedNorm, 2.2) * 0.0055, now, 0.2);

    // Tire scrub
    if (this.tireGain && this.tireFilter) {
      const absG = Math.abs(lateralG);
      const speedFactor = Math.min(1, speedKmh / 120);
      const scrubVol = absG > 0.42 ? Math.min(0.055, (absG - 0.42) * 0.075 * speedFactor) : 0.0;
      this.tireFilter.frequency.setTargetAtTime(780 + absG * 340, now, 0.05);
      this.tireGain.gain.setTargetAtTime(scrubVol, now, 0.05);
    }
  }

  // ZF 8HP tiptronic gear shifts
  triggerGearShift(isUpShift = true, throttle = 0) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    this.shiftDipLevel = isUpShift ? 0.45 : 1.25;
    this.shiftDipUntil = now + (isUpShift ? 0.12 : 0.15);
    if (isUpShift && throttle > 0.45) {
      this.playShiftPop();
    }
  }

  // Punchy ZF8 / DSG upshift exhaust burp under load
  playShiftPop() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const dur = 0.07;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, now);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    // Sub-kick transient
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + dur);
    oscGain.gain.setValueAtTime(0.22, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    osc.connect(oscGain);
    oscGain.connect(this.master);

    noise.start(now);
    osc.start(now);
    osc.stop(now + dur + 0.01);
  }

  // Machine-gun ignition cut exhaust pop during 260 km/h speed limiter (kesici)
  playLimiterPop() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const dur = 0.045;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(580, now);
    filter.Q.value = 2.4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    // Sub thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + dur);
    oscGain.gain.setValueAtTime(0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    osc.connect(oscGain);
    oscGain.connect(this.master);

    noise.start(now);
    osc.start(now);
    osc.stop(now + dur + 0.01);
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
      for (const g of [
        this.engineGain,
        this.turboGain,
        this.roadGain,
        this.windGain,
        this.tireGain,
        this.rainGain,
        this.tunnelGain,
        this.turboWhistleGain,
        this.turboHissGain,
      ]) {
        g?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
    } else {
      this.setRainAmbience(this.isRaining);
    }
    return this.muted;
  }
}
