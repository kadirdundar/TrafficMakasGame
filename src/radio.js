// Hüzün Radyosu — Lightweight Streaming Audio Player for Otoban Makas
//
// Streams MP3 files via HTML5 Audio element on a separate OS audio thread:
// - Zero WebGL render loop impact (0 FPS loss)
// - Minimal memory footprint (~2MB stream buffer vs ~80MB raw PCM decode)
// - Lazy preload: no bandwidth or memory used until the player turns on the radio

export const HUZUN_PLAYLIST = [
  {
    id: 'duvardaki',
    title: 'Duvardaki',
    artist: 'Hüzün Radyosu',
    file: 'radio/duvardaki.mp3',
  },
  {
    id: 'kaybolan-ask',
    title: 'Kaybolan Aşk',
    artist: 'Hüzün Radyosu',
    file: 'radio/kaybolan-ask.mp3',
  },
  {
    id: 'kullenen-ask',
    title: 'Küllenen Aşk',
    artist: 'Hüzün Radyosu',
    file: 'radio/kullenen-ask.mp3',
  },
];

export class RadioPlayer {
  constructor(options = {}) {
    this.playlist = HUZUN_PLAYLIST;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.volume = 0.7;
    this.stationName = 'HÜZÜN RADYOSU';

    this.onTrackChange = options.onTrackChange || null;
    this.onStateChange = options.onStateChange || null;

    // HTML5 Audio runs streaming decoding on dedicated browser audio thread
    this.audio = new Audio();
    this.audio.preload = 'none';
    this.audio.volume = this.volume;

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('error', (err) => {
      console.warn('Radio audio error:', err);
    });
  }

  get currentTrack() {
    return this.playlist[this.currentIndex] || null;
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  play(index = null) {
    if (index !== null && index >= 0 && index < this.playlist.length) {
      this.currentIndex = index;
    }
    const track = this.currentTrack;
    if (!track) return;

    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    const src = `${cleanBase}${track.file}`;

    if (this.audio.src !== new URL(src, window.location.href).href) {
      this.audio.src = src;
    }

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.onStateChange?.(true);
        this.onTrackChange?.(track);
      })
      .catch((err) => {
        console.warn('Radio play prevented (user gesture needed or codec error):', err);
        this.isPlaying = false;
        this.onStateChange?.(false);
      });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.onStateChange?.(false);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.onTrackChange?.(this.currentTrack);
    }
    return this.currentTrack;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.onTrackChange?.(this.currentTrack);
    }
    return this.currentTrack;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audio.volume = this.volume;
  }

  setMuted(muted) {
    this.audio.muted = Boolean(muted);
  }
}
