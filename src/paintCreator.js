// Garage paint creator: the player mixes their own body colour (hue, saturation, brightness or a
// hex code) and picks its finish (gloss, metallic, matte, pearl: the finish cards garageUI.js
// renders in here). The colour is kept in localStorage and goes online as a custom paint slot
// (multiplayer.js → CUSTOM_PAINT). Dragging previews on the turntable car; letting go applies it.

const STORAGE_KEY = 'otoban_custom_paint';
const DEFAULT_HEX = 0x2f7d4f; // a British-racing-style green to start from

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function hsvToHex(h, s, v) {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const to = (x) => Math.round(clamp(x, 0, 1) * 255);
  return (to(f(5)) << 16) | (to(f(3)) << 8) | to(f(1));
}

function hexToHsv(hex) {
  const r = ((hex >> 16) & 255) / 255;
  const g = ((hex >> 8) & 255) / 255;
  const b = (hex & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return { h: (h + 360) % 360, s: max ? d / max : 0, v: max };
}

export const hexCss = (hex) => `#${hex.toString(16).padStart(6, '0')}`;

export function loadCustomPaint() {
  try {
    const n = parseInt(localStorage.getItem(STORAGE_KEY) ?? '', 16);
    if (Number.isFinite(n) && n >= 0 && n <= 0xffffff) return n;
  } catch (_) {}
  return DEFAULT_HEX;
}

export class PaintCreator {
  // onPreview(hex): while dragging (turntable only). onApply(hex): the colour is set.
  constructor({ onPreview, onApply }) {
    this.onPreview = onPreview;
    this.onApply = onApply;
    this.root = document.getElementById('paint-creator');
    this.swatch = document.querySelector('#garage-paint-group .paint-swatch-custom');
    this.preview = document.getElementById('paint-creator-preview');
    this.hexInput = document.getElementById('paint-hex');
    this.sliders = {
      h: document.getElementById('paint-h'),
      s: document.getElementById('paint-s'),
      v: document.getElementById('paint-v'),
    };
    if (!this.root) return;
    this.hex = loadCustomPaint();
    this.hsv = hexToHsv(this.hex);

    for (const input of Object.values(this.sliders)) {
      input.addEventListener('input', () => this.fromSliders(false));
      input.addEventListener('change', () => this.fromSliders(true));
    }
    this.hexInput.addEventListener('input', () => {
      const clean = this.hexInput.value.replace(/[^0-9a-f]/gi, '').slice(0, 6);
      if (clean !== this.hexInput.value) this.hexInput.value = clean;
      if (clean.length === 6) this.setHex(parseInt(clean, 16), { apply: true, fromHex: true });
    });
    this.hexInput.addEventListener('blur', () => this.render());
    this.render();
  }

  get color() {
    return this.hex;
  }

  open(on = true) {
    if (this.root) this.root.hidden = !on;
  }

  fromSliders(apply) {
    const { h, s, v } = this.sliders;
    this.hsv = { h: Number(h.value), s: Number(s.value) / 100, v: Number(v.value) / 100 };
    this.setHex(hsvToHex(this.hsv.h, this.hsv.s, this.hsv.v), { apply, fromSliders: true });
  }

  setHex(hex, { apply = true, fromSliders = false, fromHex = false } = {}) {
    this.hex = hex;
    if (!fromSliders) {
      const hsv = hexToHsv(hex);
      // A grey has no hue of its own: keep the slider where it was
      this.hsv = { ...hsv, h: hsv.s > 0 ? hsv.h : this.hsv.h };
    }
    this.render({ keepHexField: fromHex });
    if (apply) {
      try {
        localStorage.setItem(STORAGE_KEY, hex.toString(16).padStart(6, '0'));
      } catch (_) {}
      this.onApply?.(hex);
    } else {
      this.onPreview?.(hex);
    }
  }

  render({ keepHexField = false } = {}) {
    if (!this.root) return;
    const { h, s, v } = this.hsv;
    this.sliders.h.value = String(Math.round(h));
    this.sliders.s.value = String(Math.round(s * 100));
    this.sliders.v.value = String(Math.round(v * 100));
    const css = hexCss(this.hex);
    if (!keepHexField) this.hexInput.value = css.slice(1).toUpperCase();
    this.preview.style.setProperty('--sw-color', css);
    this.swatch?.style.setProperty('--sw-color', css);
    // Slider tracks show where each slider takes the colour
    const full = hexCss(hsvToHex(h, 1, 1));
    this.root.style.setProperty('--sat-from', hexCss(hsvToHex(h, 0, v)));
    this.root.style.setProperty('--sat-to', hexCss(hsvToHex(h, 1, v)));
    this.root.style.setProperty('--val-to', hexCss(hsvToHex(h, s, 1)));
    this.root.style.setProperty('--hue-full', full);
  }
}
