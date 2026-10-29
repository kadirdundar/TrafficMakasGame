// MenuMusicPlayer — High-performance background music for the garage/home menu
//
// Streams royalty-free electronic synthwave theme ("Neon Laser Horizon" by Kevin MacLeod, CC BY 4.0)
// on a dedicated HTML5 Audio thread with zero WebGL/FPS impact.
// Seamlessly plays in the menu, fades out when driving starts, and resumes when returning to the menu.

export class MenuMusicPlayer {
  constructor(options = {}) {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.loop = true;

    this.volume = options.volume ?? 0.7; // default 70%
    this.masterVolume = options.masterVolume ?? 1.0;
    this.muted = Boolean(options.muted);
    this.isPlaying = false;
    this.isFadeActive = false;
    this.fadeInterval = null;
    this.shouldBePlaying = false;
    this.unlocked = false;

    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    this.audio.src = `${cleanBase}music/menu-theme.mp3`;

    this.applyVolume(this.calculateTargetVolume());

    // Listen to user interaction to unlock autoplay if browser blocks initial play()
    this.setupUnlockListener();
  }

  calculateTargetVolume() {
    if (this.muted) return 0;
    // Normalized so 100% slider gives a pleasant background level (approx max 0.45 system gain)
    return Math.max(0, Math.min(1, this.volume * this.masterVolume * 0.45));
  }

  applyVolume(vol) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, vol));
    }
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1.5, Number(v) || 0));
    if (!this.isFadeActive) {
      this.applyVolume(this.calculateTargetVolume());
    }
  }

  setMasterVolume(mv) {
    this.masterVolume = Math.max(0, Math.min(1.5, Number(mv) || 0));
    if (!this.isFadeActive) {
      this.applyVolume(this.calculateTargetVolume());
    }
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (!this.isFadeActive) {
      this.applyVolume(this.calculateTargetVolume());
    }
  }

  setupUnlockListener() {
    const unlock = () => {
      this.unlocked = true;
      if (this.shouldBePlaying && !this.isPlaying) {
        this.play();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  play() {
    this.shouldBePlaying = true;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.isFadeActive = false;
    this.applyVolume(this.calculateTargetVolume());

    const promise = this.audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          this.isPlaying = true;
        })
        .catch(() => {
          // Blocked by browser autoplay policy until user gesture
          this.isPlaying = false;
        });
    }
  }

  pause() {
    this.shouldBePlaying = false;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.isFadeActive = false;
    this.audio.pause();
    this.isPlaying = false;
  }

  fadeOut(durationSec = 0.45) {
    this.shouldBePlaying = false;
    if (!this.isPlaying) {
      this.audio.pause();
      return;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    this.isFadeActive = true;
    const startVol = this.audio.volume;
    const steps = 12;
    const stepTime = (durationSec * 1000) / steps;
    let step = 0;

    this.fadeInterval = setInterval(() => {
      step++;
      const current = startVol * (1 - step / steps);
      this.applyVolume(Math.max(0, current));
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        this.isFadeActive = false;
        this.audio.pause();
        this.isPlaying = false;
      }
    }, stepTime);
  }

  fadeIn(durationSec = 0.7) {
    this.shouldBePlaying = true;
    const targetVol = this.calculateTargetVolume();
    if (targetVol <= 0) {
      this.applyVolume(0);
      this.play();
      return;
    }

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    this.isFadeActive = true;
    this.applyVolume(0);

    const promise = this.audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          this.isPlaying = true;
          const steps = 14;
          const stepTime = (durationSec * 1000) / steps;
          let step = 0;
          this.fadeInterval = setInterval(() => {
            step++;
            const current = (targetVol * step) / steps;
            this.applyVolume(Math.min(targetVol, current));
            if (step >= steps) {
              clearInterval(this.fadeInterval);
              this.fadeInterval = null;
              this.isFadeActive = false;
              this.applyVolume(targetVol);
            }
          }, stepTime);
        })
        .catch(() => {
          this.isFadeActive = false;
          this.isPlaying = false;
        });
    }
  }
}
