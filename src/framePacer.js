// Battery saver for high refresh rate screens. The browser calls requestAnimationFrame at the
// screen's own rate, so on a 120 Hz phone the game drew 120 frames a second: twice the GPU work,
// heat and battery of 60 Hz for a difference that is hard to see from the driver's seat.
// While enabled, a frame is drawn on every n-th refresh, n = refresh rate / 60 rounded down
// (120 Hz → 60 FPS, 144 Hz → 72, 165 Hz → 82, 240 Hz → 60). 60 and 90 Hz screens still draw
// every refresh: skipping there would make the frame pacing uneven.

const SAMPLES = 32;

export class FramePacer {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.intervals = new Float32Array(SAMPLES);
    this.sorted = new Float32Array(SAMPLES);
    this.samples = 0;
    this.last = null;
    this.tick = 0;
    this.divisor = 1;
  }

  // Called at the start of every requestAnimationFrame callback, with its timestamp.
  // True: skip this refresh (draw nothing, run nothing).
  skip(timestamp) {
    if (this.last !== null) {
      const interval = timestamp - this.last;
      // Ignore background-tab gaps; a skipped refresh costs nothing, so the intervals stay
      // the screen's own even while frames are being skipped
      if (interval > 1 && interval < 50) {
        this.intervals[this.samples % SAMPLES] = interval;
        this.samples += 1;
        if (this.samples % SAMPLES === 0) this.divisor = this.measureDivisor();
      }
    }
    this.last = timestamp;
    if (!this.enabled || this.divisor <= 1) return false;
    this.tick += 1;
    return this.tick % this.divisor !== 0;
  }

  // The 25th percentile interval is the refresh period (late frames only make intervals longer)
  measureDivisor() {
    this.sorted.set(this.intervals);
    this.sorted.sort();
    const refreshHz = 1000 / this.sorted[Math.floor(SAMPLES / 4)];
    return Math.max(1, Math.floor(refreshHz / 60 + 0.1));
  }
}
