// Frame-rate cap for a requestAnimationFrame loop. A 90 or 120 Hz screen calls the loop up to
// 120 times a second; drawing every one of those doubles the GPU work (and the battery drain) for
// no gain a driver can see. ready() answers whether this callback should draw, keeping a budget
// of elapsed time so the cap holds on any refresh rate (60 FPS on 90 Hz draws two frames in three).

export class FrameCap {
  constructor(fps = 60) {
    this.last = 0;
    this.budget = 0;
    this.set(fps);
  }

  set(fps) {
    this.interval = 1000 / fps;
    this.budget = this.interval; // draw the next callback straight away
  }

  ready(now) {
    const since = this.last ? now - this.last : this.interval;
    this.last = now;
    // Never bank more than two frames: after a hitch, catch up once and carry on
    this.budget = Math.min(this.budget + since, this.interval * 2);
    // 1 ms of slack absorbs the jitter of the callback times
    if (this.budget < this.interval - 1) return false;
    this.budget -= this.interval;
    return true;
  }
}
