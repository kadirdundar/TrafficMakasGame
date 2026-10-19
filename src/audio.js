// Procedural Web Audio Synthesizer for Engine, Turbo, Horn, Makas Whoosh & Rain

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.running = false;

    this.osc1 = null;
    this.osc2 = null;
    this.subOsc = null;
    this.turboOsc = null;
    this.engineGain = null;
    this.turboGain = null;
    this.filter = null;

    this.hornOsc1 = null;
    this.hornOsc2 = null;
    this.hornGain = null;

    this.rainGain = null;
    this.isRaining = false;
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

    // Master filter & gain for engine
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 320;
    this.filter.Q.value = 3.5;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0.0;

    // 3 oscillators for a throaty inline-6 / V8 sport exhaust note
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.value = 55;

    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.value = 110;

    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.value = 27.5;

    // Turbocharger high-pitched spool whine
    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.value = 1400;

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.value = 0.0;

    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);
    this.subOsc.connect(this.filter);
    this.filter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.turboOsc.connect(this.turboGain);
    this.turboGain.connect(this.ctx.destination);

    this.osc1.start();
    this.osc2.start();
    this.subOsc.start();
    this.turboOsc.start();

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
    this.hornGain.connect(this.ctx.destination);
    this.hornOsc1.start();
    this.hornOsc2.start();

    // Setup subtle rain ambience noise
    this.setupRainNoise();

    this.running = true;
  }

  setupRainNoise() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 1100;
    rainFilter.Q.value = 0.7;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0.0;

    noise.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);

    // Tire cornering load / asphalt scrub filter sharing the continuous noise source
    this.tireFilter = this.ctx.createBiquadFilter();
    this.tireFilter.type = 'bandpass';
    this.tireFilter.frequency.value = 920;
    this.tireFilter.Q.value = 4.5;

    this.tireGain = this.ctx.createGain();
    this.tireGain.gain.value = 0.0;

    noise.connect(this.tireFilter);
    this.tireFilter.connect(this.tireGain);
    this.tireGain.connect(this.ctx.destination);

    noise.start();
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

    if (paused || this.muted) {
      this.engineGain.gain.setTargetAtTime(0, now, 0.08);
      this.turboGain.gain.setTargetAtTime(0, now, 0.08);
      this.tireGain?.gain.setTargetAtTime(0, now, 0.08);
      return;
    }

    // Normalize RPM (850 idle -> 7800 redline)
    const normRpm = Math.max(0, Math.min(1, (rpm - 800) / 7000));
    const baseFreq = 36 + normRpm * 145;

    // Slight redline flutter when > 7300 RPM
    const flutter = rpm > 7300 ? Math.sin(now * 95) * 8 : 0;

    this.osc1.frequency.setTargetAtTime(baseFreq + flutter, now, 0.03);
    this.osc2.frequency.setTargetAtTime((baseFreq + flutter) * 1.5, now, 0.03);
    this.subOsc.frequency.setTargetAtTime((baseFreq + flutter) * 0.5, now, 0.03);

    const filterFreq = 180 + normRpm * 950 + throttle * 380;
    this.filter.frequency.setTargetAtTime(filterFreq, now, 0.04);

    const targetGain = 0.055 + normRpm * 0.065 + throttle * 0.035;
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.05);

    // Turbo whistle
    const turboFreq = 1600 + normRpm * 2900;
    const turboVol = throttle > 0.2 ? normRpm * 0.018 : 0.002;
    this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.06);
    this.turboGain.gain.setTargetAtTime(turboVol, now, 0.08);

    // Tire cornering load / scrub sound when weaving hard at speed
    if (this.tireGain && this.tireFilter) {
      const absG = Math.abs(lateralG);
      const speedFactor = Math.min(1, speedKmh / 120);
      const scrubVol = absG > 0.42 ? Math.min(0.055, (absG - 0.42) * 0.075 * speedFactor) : 0.0;
      this.tireFilter.frequency.setTargetAtTime(780 + absG * 340, now, 0.05);
      this.tireGain.gain.setTargetAtTime(scrubVol, now, 0.05);
    }
  }

  triggerGearShift(isUpShift = true) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    // Turbo blow-off hiss ("psshhh") on upshift or exhaust pop on downshift
    const duration = isUpShift ? 0.18 : 0.12;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = isUpShift ? 3600 : 280;
    filter.Q.value = isUpShift ? 2.5 : 4.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isUpShift ? 0.07 : 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
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
    gain.connect(this.ctx.destination);
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
    whooshGain.connect(this.ctx.destination);
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
    chimeGain.connect(this.ctx.destination);
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
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.ctx) {
      this.engineGain?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.turboGain?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.rainGain?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    } else {
      this.setRainAmbience(this.isRaining);
    }
    return this.muted;
  }
}
