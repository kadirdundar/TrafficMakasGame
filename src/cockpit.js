import * as THREE from 'three';

export const AMBIENT_COLORS = {
  cyan: { hex: 0x00f0ff, css: '#00f0ff', name: 'Buz Mavisi' },
  purple: { hex: 0xb829ff, css: '#b829ff', name: 'Neon Mor' },
  red: { hex: 0xff1e42, css: '#ff1e42', name: 'Sport Kırmızı' },
  emerald: { hex: 0x00ff88, css: '#00ff88', name: 'Zümrüt Yeşili' },
  amber: { hex: 0xffaa00, css: '#ffaa00', name: 'Altın Kehribar' },
};

// Source reference image dimensions: 600 x 338
const SRC_W = 600;
const SRC_H = 338;
// Y coordinate in source image where windshield meets dashboard top
const DASH_SPLIT_Y = 86;
// Steering wheel center & radius in 600x338 source space
const WHEEL_CX = 174.5;
const WHEEL_CY = 154.5;
const WHEEL_R = 63.0;

// Window frame edges fitted to the reference photo (x as a function of y, 600x338 space)
const leftPillarInnerX = (y) => 46.53 + 1.01785 * y - 0.00051149 * y * y;
const rightPillarInnerX = (y) => 549.507 - 1.02696 * y + 0.000588647 * y * y;
const leftSealX = (y) => -46.017 + 2.05038 * y - 0.00534236 * y * y;
const rightSealX = (y) => 639.832 - 2.00603 * y + 0.00495744 * y * y;

// Overhead console, mirror stem and rear-view mirror housing (slightly inset from the measured edge)
const REAR_MIRROR_OUTLINE = [
  [244.5, -4], [355.5, -4], [354.9, 0], [353.2, 3], [351, 5.5], [348.8, 7.2], [337.5, 8.2],
  [331, 9.8], [329.4, 11.8], [328.2, 13.8], [325, 16], [321, 18.2], [317.6, 20.2], [322, 22.4],
  [334, 23], [341, 24.3], [343, 26.5], [342.6, 31], [341.4, 36], [340.4, 40], [338.5, 42.2],
  [335.5, 43.3], [328, 44], [300, 44.9], [272, 44.6], [264, 44.2], [259.5, 45.6], [257.8, 44],
  [257.6, 40], [256.4, 34], [255.6, 28], [256.5, 23.2], [262, 22.6], [276, 22], [280.5, 20.2],
  [278.5, 18.2], [274.8, 16], [272.2, 13.8], [270.6, 11.5], [268.5, 9.6], [264.5, 8.2],
  [250.5, 7.2], [248.4, 5.5], [246.2, 3], [244.8, 0],
];

// Wing-mirror housing tops (light silver, almost the studio background color), closed through
// the opaque housing interior
const LEFT_WING_MIRROR_OUTLINE = [
  [-4, 80.4], [0, 80], [4, 79.3], [8, 78.6], [12, 77.8], [16, 76.9], [20, 76.3], [28, 76],
  [36, 76.1], [42, 76.7], [48, 77.6], [53, 78.6], [57, 79.8], [59.5, 81.2], [62, 84.2], [64, 96],
  [-4, 96],
];
const RIGHT_WING_MIRROR_OUTLINE = [
  [604, 77.6], [598, 76.6], [592, 75.4], [586, 74.4], [580, 73.6], [574, 72.9], [568, 72.4],
  [562, 72.2], [557, 73.2], [552, 74.4], [547, 74.9], [543, 75.8], [540, 77.2], [537, 79],
  [534, 80.4], [530, 82.8], [526, 85.6], [524, 87.3], [526, 100], [604, 100],
];

// Studio-background matte thresholds (max channel difference from the local background)
const MATTE_LO = 9;
const MATTE_HI = 22;
// Light fringe pixels next to the opaque frame below this difference become glass
const MATTE_FRAME_CUT = 48;

// Parts of the photo that must stay opaque even where their color matches the studio
// background: both A-pillars (bright inner faces), the rear-view mirror housing and the
// wing-mirror glass (live mirror views are composited there).
function fillOpaqueFrame(ctx) {
  // Each shape is filled on its own so overlapping outlines never cancel by winding
  const fillShape = (trace) => {
    ctx.beginPath();
    trace();
    ctx.fill();
  };
  const fillOutline = (outline) =>
    fillShape(() => outline.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))));

  fillShape(() => {
    ctx.moveTo(-4, -4);
    for (let y = -4; y <= 104; y += 2) ctx.lineTo(leftPillarInnerX(y), y);
    for (let y = 104; y >= 22; y -= 2) ctx.lineTo(Math.max(-4, leftSealX(y)), y);
    ctx.lineTo(-4, 22);
  });
  fillShape(() => {
    ctx.moveTo(SRC_W + 4, -4);
    for (let y = -4; y <= 100; y += 2) ctx.lineTo(rightPillarInnerX(y), y);
    for (let y = 100; y >= 18; y -= 2) ctx.lineTo(Math.min(SRC_W + 4, rightSealX(y)), y);
    ctx.lineTo(SRC_W + 4, 18);
  });
  fillOutline(REAR_MIRROR_OUTLINE);
  fillOutline(LEFT_WING_MIRROR_OUTLINE);
  fillOutline(RIGHT_WING_MIRROR_OUTLINE);
  fillShape(() => ctx.roundRect(-4, 81.5, 44.5, 33, 4));
  fillShape(() => ctx.roundRect(559.5, 81.5, 44.5, 33, 4));
}

// Rasterizes the opaque frame at `scale` and returns per-pixel coverage (0..255)
function rasterizeOpaqueFrame(scale) {
  const canvas = document.createElement('canvas');
  canvas.width = SRC_W * scale;
  canvas.height = SRC_H * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = '#fff';
  fillOpaqueFrame(ctx);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const coverage = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0; i < coverage.length; i++) coverage[i] = data[i * 4 + 3];
  return coverage;
}

// Supersampling factor for the processed cockpit layers (reference px -> canvas px),
// sized so the photo is never stretched much beyond its upscaled resolution on screen.
function pickTextureScale() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const screenPx =
    Math.max(
      window.screen?.width || 0,
      window.screen?.height || 0,
      window.innerWidth,
      window.innerHeight
    ) * dpr;
  return Math.max(2, Math.min(4, Math.ceil(screenPx / SRC_W)));
}

// Catmull-Rom weights for fractional offset t, taps at -1, 0, +1, +2
function catmullRomWeights(t, out, o) {
  const t2 = t * t;
  const t3 = t2 * t;
  out[o] = (-t3 + 2 * t2 - t) * 0.5;
  out[o + 1] = (3 * t3 - 5 * t2 + 2) * 0.5;
  out[o + 2] = (-3 * t3 + 4 * t2 + t) * 0.5;
  out[o + 3] = (t3 - t2) * 0.5;
}

function buildUpscaleTaps(srcN, dstN) {
  const idx = new Int32Array(dstN * 4);
  const w = new Float32Array(dstN * 4);
  const ratio = srcN / dstN;
  for (let i = 0; i < dstN; i++) {
    const c = (i + 0.5) * ratio - 0.5;
    const i0 = Math.floor(c);
    catmullRomWeights(c - i0, w, i * 4);
    for (let k = 0; k < 4; k++) {
      idx[i * 4 + k] = Math.min(srcN - 1, Math.max(0, i0 - 1 + k));
    }
  }
  return { idx, w };
}

// Separable Catmull-Rom upscale of a 4-channel float image
function upscaleRGBA(src, sw, sh, dw, dh) {
  const xt = buildUpscaleTaps(sw, dw);
  const yt = buildUpscaleTaps(sh, dh);
  const tmp = new Float32Array(dw * sh * 4);
  for (let y = 0; y < sh; y++) {
    const srow = y * sw;
    const trow = y * dw;
    for (let x = 0; x < dw; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let k = 0; k < 4; k++) {
        const wk = xt.w[x * 4 + k];
        const si = (srow + xt.idx[x * 4 + k]) * 4;
        r += src[si] * wk;
        g += src[si + 1] * wk;
        b += src[si + 2] * wk;
        a += src[si + 3] * wk;
      }
      const ti = (trow + x) * 4;
      tmp[ti] = r;
      tmp[ti + 1] = g;
      tmp[ti + 2] = b;
      tmp[ti + 3] = a;
    }
  }
  const dst = new Float32Array(dw * dh * 4);
  for (let y = 0; y < dh; y++) {
    const i0 = yt.idx[y * 4], i1 = yt.idx[y * 4 + 1], i2 = yt.idx[y * 4 + 2], i3 = yt.idx[y * 4 + 3];
    const w0 = yt.w[y * 4], w1 = yt.w[y * 4 + 1], w2 = yt.w[y * 4 + 2], w3 = yt.w[y * 4 + 3];
    const r0 = i0 * dw * 4, r1 = i1 * dw * 4, r2 = i2 * dw * 4, r3 = i3 * dw * 4;
    const drow = y * dw * 4;
    for (let x = 0; x < dw * 4; x++) {
      dst[drow + x] = tmp[r0 + x] * w0 + tmp[r1 + x] * w1 + tmp[r2 + x] * w2 + tmp[r3 + x] * w3;
    }
  }
  return dst;
}

// Catmull-Rom sample of an 8-bit RGBA buffer at fractional pixel-index coords
const cubicWx = new Float32Array(4);
const cubicWy = new Float32Array(4);
function sampleCubicRGB(px, w, h, x, y, out) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const wx = cubicWx;
  const wy = cubicWy;
  catmullRomWeights(x - x0, wx, 0);
  catmullRomWeights(y - y0, wy, 0);
  let r = 0, g = 0, b = 0;
  for (let j = 0; j < 4; j++) {
    const sy = Math.min(h - 1, Math.max(0, y0 - 1 + j));
    for (let i = 0; i < 4; i++) {
      const sx = Math.min(w - 1, Math.max(0, x0 - 1 + i));
      const wgt = wx[i] * wy[j];
      const si = (sy * w + sx) * 4;
      r += px[si] * wgt;
      g += px[si + 1] * wgt;
      b += px[si + 2] * wgt;
    }
  }
  out[0] = r;
  out[1] = g;
  out[2] = b;
}

// 0..1 coverage of the solid steering wheel (rim, 4-ring hub, spokes) at offset (dx, dy) from its center
function wheelShapeWeight(dx, dy) {
  const r = Math.hypot(dx, dy);
  if (r > WHEEL_R) return 0;
  const isOuterRim = r >= 48.0;
  const isCenterHub = Math.abs(dx) <= 26 && dy >= -15 && dy <= 28 && r <= 31;
  const isHorizSpoke = dy >= -13 && dy <= 14 && r < 49.5;
  const isLowerVSpoke =
    dy > 10 &&
    r < 49.5 &&
    Math.abs(dx) <= 29 - (dy - 10) * 0.18 &&
    !(Math.abs(dx) <= 6 && dy > 29 && dy < 44);
  if (!(isOuterRim || isCenterHub || isHorizSpoke || isLowerVSpoke)) return 0;
  // Soft outer edge hides the studio-background halo around the rim
  return r > WHEEL_R - 1.5 ? (WHEEL_R - r) / 1.5 : 1;
}

export class CarCockpit {
  constructor(renderer) {
    this.renderer = renderer;
    this.group = new THREE.Group();

    this.overlayCanvas = document.getElementById('cockpit-canvas');
    this.overlayCtx = this.overlayCanvas ? this.overlayCanvas.getContext('2d') : null;

    this.ambientKey = 'cyan';
    this.makasFlashIntensity = 0;

    // Wipers state
    this.wipersEnabled = false;
    this.wiperPhase = 0;

    // Steering angle visual
    this.currentSteerVisual = 0;

    // Camera framing preset: 0 = Standart (Tam Audi Kabin + Geniş Ön Cam), 1 = Orijinal Fotoğraf Açısı, 2 = Yakın Sürüş
    this.viewPreset = 0;

    // Last rendered screen-space steering wheel bounds for direct mouse/touch dragging
    this.wheelScreenBounds = { cx: 300, cy: 500, r: 120 };

    // Rear-view mirror 3D render target & camera (MSAA, sized to the mirror's on-screen
    // footprint, fast readback for real-time 2D mirror compositing)
    this.mirrorW = 0;
    this.mirrorH = 0;
    this.mirrorRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      samples: 4,
    });
    this.mirrorCanvas = document.createElement('canvas');
    this.mirrorCtx = this.mirrorCanvas.getContext('2d');
    this.resizeMirror();

    this.mirrorCamera = new THREE.PerspectiveCamera(52, 2.0, 0.5, 220);
    this.group.add(this.mirrorCamera);
    this.mirrorCamera.position.set(0, 1.35, 1.8);
    this.mirrorCamera.rotation.set(0, Math.PI, 0);

    // Processed Photorealistic Layers from /audi_cockpit.png, supersampled by texScale
    this.imageLoaded = false;
    this.texScale = pickTextureScale();
    this.dashCanvas = document.createElement('canvas');
    this.dashCanvas.width = SRC_W * this.texScale;
    this.dashCanvas.height = SRC_H * this.texScale;

    // wheelSize is in reference (600x338) units; the canvas holds it at texScale
    this.wheelCanvas = document.createElement('canvas');
    this.wheelSize = Math.ceil(WHEEL_R * 2 + 8);
    this.wheelCanvas.width = this.wheelSize * this.texScale;
    this.wheelCanvas.height = this.wheelSize * this.texScale;

    // 'photo' = processed reference photo on the 2D overlay, '3d' = glTF interior (the game
    // switches to '3d' on startup; 'photo' stays the fallback while/if it fails to load)
    this.mode = 'photo';
    this.interior3d = null;
    this._interiorPromise = null;
    this._overlayCleared = false;
    this.camera = null; // set by the game; needed to project the 3D wheel for touch steering

    this.loadPhotorealisticCockpit();
  }

  get is3D() {
    return this.mode === '3d' && Boolean(this.interior3d);
  }

  // Switches between the photo cockpit and the 3D interior. The 3D module + model are only
  // downloaded the first time it is enabled; on failure we stay on the photo cockpit.
  async setMode(mode, eyeAnchor) {
    this.mode = mode === '3d' ? '3d' : 'photo';
    this._overlayCleared = false;
    if (this.mode === '3d' && !this.interior3d) {
      this._interiorPromise ??= import('./cockpit3d.js').then((m) =>
        m.loadCockpit3D({
          eyeAnchor,
          mirrorTexture: this.mirrorRenderTarget.texture,
          paintScreen: (name, ctx, w, h) => this.paint3DScreen(name, ctx, w, h),
        })
      );
      try {
        this.interior3d = await this._interiorPromise;
        this.group.add(this.interior3d.group);
      } catch (err) {
        console.warn('3D kokpit yüklenemedi, fotoğraf kokpite dönülüyor:', err);
        this._interiorPromise = null;
        this.mode = 'photo';
      }
    }
    if (this.interior3d) this.interior3d.group.visible = this.mode === '3d';
    return this.mode;
  }

  loadPhotorealisticCockpit() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.processCockpitImage(img);
      this.imageLoaded = true;
    };
    img.src = './audi_cockpit.png';
  }

  processCockpitImage(img) {
    const S = this.texScale;
    const N = SRC_W * SRC_H;

    // 1. Read raw 600x338 pixels
    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = SRC_W;
    rawCanvas.height = SRC_H;
    const rawCtx = rawCanvas.getContext('2d');
    rawCtx.drawImage(img, 0, 0, SRC_W, SRC_H);
    const rawData = rawCtx.getImageData(0, 0, SRC_W, SRC_H);
    const px = rawData.data;

    // 2. Flood-fill studio background in Windshield & Left/Right Side Windows.
    //    The opaque frame (A-pillars, mirrors) blocks the fill so it can't leak into the
    //    bright pillar faces, which are nearly the same color as the studio background.
    const frameRef = rasterizeOpaqueFrame(1);
    const windowMask = new Uint8Array(N);
    const seeds = [
      [180, 40],
      [420, 40],
      [300, 65],
      [15, 45],
      [585, 45],
      [82, 95],
      [518, 95],
    ];
    const queue = [];
    for (const [sx, sy] of seeds) {
      const idx = sy * SRC_W + sx;
      windowMask[idx] = 1;
      queue.push(idx);
    }

    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cx = curr % SRC_W;
      const cy = Math.floor(curr / SRC_W);
      const ci = curr * 4;
      const cr = px[ci];
      const cg = px[ci + 1];
      const cb = px[ci + 2];

      const neighbors = [
        [cx - 1, cy],
        [cx + 1, cy],
        [cx, cy - 1],
        [cx, cy + 1],
      ];
      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= SRC_W || ny < 0 || ny >= 135) continue;
        const npos = ny * SRC_W + nx;
        if (windowMask[npos] || frameRef[npos] >= 128) continue;
        const ni = npos * 4;
        const nr = px[ni];
        const ng = px[ni + 1];
        const nb = px[ni + 2];

        const diff = Math.abs(nr - cr) + Math.abs(ng - cg) + Math.abs(nb - cb);
        const sat = Math.max(nr, ng, nb) - Math.min(nr, ng, nb);
        if (diff <= 10 && sat <= 3 && nr >= 162) {
          windowMask[npos] = 1;
          queue.push(npos);
        }
      }
    }

    // 3. Soft matte: pixels near the filled glass are compared with the local studio
    //    background, so anti-aliased fringes get fractional alpha (no leftover speckles)
    //    and their color is decontaminated toward the neighbouring solid foreground.
    const W1 = SRC_W + 1;
    const bgSum = new Float64Array(W1 * (SRC_H + 1) * 4);
    const fgSum = new Float64Array(W1 * (SRC_H + 1) * 4);
    // Solid foreground = not glass and not touching glass (skips the blended fringe row)
    const solidFg = new Uint8Array(N);
    for (let y = 0; y < SRC_H; y++) {
      for (let x = 0; x < SRC_W; x++) {
        let touches = false;
        for (let j = Math.max(0, y - 1); j <= Math.min(SRC_H - 1, y + 1) && !touches; j++) {
          for (let i = Math.max(0, x - 1); i <= Math.min(SRC_W - 1, x + 1); i++) {
            if (windowMask[j * SRC_W + i]) {
              touches = true;
              break;
            }
          }
        }
        solidFg[y * SRC_W + x] = touches ? 0 : 1;
      }
    }
    // Summed-area tables of (r, g, b, count) for the glass background and the solid foreground
    for (let y = 0; y < SRC_H; y++) {
      for (let c = 0; c < 4; c++) {
        let rowBg = 0;
        let rowFg = 0;
        for (let x = 0; x < SRC_W; x++) {
          const pos = y * SRC_W + x;
          const v = c < 3 ? px[pos * 4 + c] : 1;
          if (windowMask[pos]) rowBg += v;
          if (solidFg[pos]) rowFg += v;
          const o = ((y + 1) * W1 + x + 1) * 4 + c;
          const above = (y * W1 + x + 1) * 4 + c;
          bgSum[o] = bgSum[above] + rowBg;
          fgSum[o] = fgSum[above] + rowFg;
        }
      }
    }
    const boxMean = (sum, x, y, r, out) => {
      const x0 = Math.max(0, x - r);
      const y0 = Math.max(0, y - r);
      const x1 = Math.min(SRC_W, x + r + 1);
      const y1 = Math.min(SRC_H, y + r + 1);
      const a = (y0 * W1 + x0) * 4;
      const b = (y0 * W1 + x1) * 4;
      const c = (y1 * W1 + x0) * 4;
      const d = (y1 * W1 + x1) * 4;
      const n = sum[d + 3] - sum[b + 3] - sum[c + 3] + sum[a + 3];
      if (n <= 0) return 0;
      for (let k = 0; k < 3; k++) out[k] = (sum[d + k] - sum[b + k] - sum[c + k] + sum[a + k]) / n;
      return n;
    };

    // Glass pixels within 2px of the opaque frame: light fringes there are cut so the
    // vector-rasterized frame edge alone defines the silhouette
    const nearFrame = new Uint8Array(N);
    for (let y = 0; y < SRC_H; y++) {
      for (let x = 0; x < SRC_W; x++) {
        if (frameRef[y * SRC_W + x] < 128) continue;
        for (let j = Math.max(0, y - 2); j <= Math.min(SRC_H - 1, y + 2); j++) {
          for (let i = Math.max(0, x - 2); i <= Math.min(SRC_W - 1, x + 2); i++) {
            nearFrame[j * SRC_W + i] = 1;
          }
        }
      }
    }

    // Float RGBA layer (rgb 0..255, alpha 0..255) at reference resolution
    const layer = new Float32Array(N * 4);
    const bg = [0, 0, 0];
    const fg = [0, 0, 0];
    for (let y = 0; y < SRC_H; y++) {
      for (let x = 0; x < SRC_W; x++) {
        const pos = y * SRC_W + x;
        const i = pos * 4;
        const cr = px[i];
        const cg = px[i + 1];
        const cb = px[i + 2];
        layer[i] = cr;
        layer[i + 1] = cg;
        layer[i + 2] = cb;
        layer[i + 3] = 255;

        if (windowMask[pos]) {
          layer[i + 3] = 0;
          continue;
        }
        if (frameRef[pos] >= 128 || boxMean(bgSum, x, y, 3, bg) === 0) continue;

        const dr = cr - bg[0];
        const dg = cg - bg[1];
        const db = cb - bg[2];
        const dMax = Math.max(Math.abs(dr), Math.abs(dg), Math.abs(db));
        if (dMax <= MATTE_LO || (nearFrame[pos] && dMax < MATTE_FRAME_CUT)) {
          layer[i + 3] = 0;
          continue;
        }

        let alpha;
        if (boxMean(fgSum, x, y, 2, fg) > 0) {
          const fr = fg[0] - bg[0];
          const fgG = fg[1] - bg[1];
          const fb = fg[2] - bg[2];
          const span = fr * fr + fgG * fgG + fb * fb;
          if (Math.max(Math.abs(fr), Math.abs(fgG), Math.abs(fb)) > MATTE_HI * 2) {
            alpha = Math.min(1, Math.max(0, (dr * fr + dg * fgG + db * fb) / span));
            if (alpha < 0.98) {
              layer[i] = fg[0];
              layer[i + 1] = fg[1];
              layer[i + 2] = fg[2];
            }
          }
        }
        if (alpha === undefined) {
          const t = Math.min(1, (dMax - MATTE_LO) / (MATTE_HI - MATTE_LO));
          alpha = t * t * (3 - 2 * t);
        }
        layer[i + 3] = alpha * 255;
      }
    }

    // Drop isolated weak specks in the glass (photo noise with no solid neighbour)
    const matteAlpha = new Float32Array(N);
    for (let p = 0; p < N; p++) matteAlpha[p] = layer[p * 4 + 3];
    for (let y = 0; y < 135; y++) {
      for (let x = 0; x < SRC_W; x++) {
        const pos = y * SRC_W + x;
        const a = matteAlpha[pos];
        if (a === 0 || a >= 230 || frameRef[pos] >= 128) continue;
        let support = 0;
        for (let j = Math.max(0, y - 2); j <= Math.min(SRC_H - 1, y + 2); j++) {
          for (let i = Math.max(0, x - 2); i <= Math.min(SRC_W - 1, x + 2); i++) {
            if (i !== x || j !== y) support = Math.max(support, matteAlpha[j * SRC_W + i]);
          }
        }
        if (support < 190) layer[pos * 4 + 3] = 0;
      }
    }

    // 4. Pad colors into the transparent glass so upscaling doesn't pull in studio white
    const assigned = new Uint8Array(N);
    for (let p = 0; p < N; p++) assigned[p] = layer[p * 4 + 3] > 0 ? 1 : 0;
    for (let iter = 0; iter < 4; iter++) {
      const newly = [];
      for (let y = 0; y < SRC_H; y++) {
        for (let x = 0; x < SRC_W; x++) {
          const pos = y * SRC_W + x;
          if (assigned[pos]) continue;
          let r = 0, g = 0, b = 0, n = 0;
          for (let j = Math.max(0, y - 1); j <= Math.min(SRC_H - 1, y + 1); j++) {
            for (let k = Math.max(0, x - 1); k <= Math.min(SRC_W - 1, x + 1); k++) {
              const q = j * SRC_W + k;
              if (!assigned[q]) continue;
              r += layer[q * 4];
              g += layer[q * 4 + 1];
              b += layer[q * 4 + 2];
              n++;
            }
          }
          if (n > 0) {
            layer[pos * 4] = r / n;
            layer[pos * 4 + 1] = g / n;
            layer[pos * 4 + 2] = b / n;
            newly.push(pos);
          }
        }
      }
      for (const pos of newly) assigned[pos] = 1;
    }

    // 5. Upscale the dashboard layer by S with Catmull-Rom, then sharpen the frame edges
    //    with the vector-rasterized opaque frame at the same resolution.
    const DW = SRC_W * S;
    const DH = SRC_H * S;
    const up = upscaleRGBA(layer, SRC_W, SRC_H, DW, DH);
    const frameHi = rasterizeOpaqueFrame(S);
    const dCtx = this.dashCanvas.getContext('2d');
    const dashData = dCtx.createImageData(DW, DH);
    const dPx = dashData.data;
    for (let p = 0, i = 0; p < DW * DH; p++, i += 4) {
      dPx[i] = up[i];
      dPx[i + 1] = up[i + 1];
      dPx[i + 2] = up[i + 2];
      dPx[i + 3] = Math.max(up[i + 3], frameHi[p]);
    }
    dCtx.putImageData(dashData, 0, 0);

    // 6. Extract Photorealistic Rotating Audi Steering Wheel into this.wheelCanvas at S,
    //    with bicubic color sampling and 3x3 supersampled anti-aliased edges
    const wSizePx = this.wheelSize * S;
    const wCtx = this.wheelCanvas.getContext('2d');
    const wImgData = wCtx.createImageData(wSizePx, wSizePx);
    const wPx = wImgData.data;
    const halfW = this.wheelSize / 2;
    const rgb = [0, 0, 0];
    const SS = 3;

    for (let wy = 0; wy < wSizePx; wy++) {
      for (let wx = 0; wx < wSizePx; wx++) {
        const dx = (wx + 0.5) / S - halfW;
        const dy = (wy + 0.5) / S - halfW;
        if (Math.hypot(dx, dy) > WHEEL_R + 1) continue;

        let cover = 0;
        for (let sj = 0; sj < SS; sj++) {
          for (let si = 0; si < SS; si++) {
            cover += wheelShapeWeight(
              (wx + (si + 0.5) / SS) / S - halfW,
              (wy + (sj + 0.5) / SS) / S - halfW
            );
          }
        }
        if (cover <= 0) continue;

        sampleCubicRGB(px, SRC_W, SRC_H, WHEEL_CX + dx - 0.5, WHEEL_CY + dy - 0.5, rgb);
        const di = (wy * wSizePx + wx) * 4;
        wPx[di] = rgb[0];
        wPx[di + 1] = rgb[1];
        wPx[di + 2] = rgb[2];
        wPx[di + 3] = (cover / (SS * SS)) * 255;
      }
    }
    wCtx.putImageData(wImgData, 0, 0);

    // 7. Cleanly reconstruct the stationary dashboard behind the steering wheel rim (r <= WHEEL_R)
    // so when the wheel turns left/right, no static wheel rim ghost appears behind it!
    dCtx.save();
    dCtx.scale(S, S);
    dCtx.beginPath();
    dCtx.arc(WHEEL_CX, WHEEL_CY, WHEEL_R + 1, 0, Math.PI * 2);
    dCtx.clip();

    // Clear top sliver of wheel rim that pokes above the dashboard arch (y < 91)
    dCtx.clearRect(110, 84, 135, 9);

    // Upper dark charcoal dashboard arch (y: 91..104)
    dCtx.fillStyle = '#3a3635';
    dCtx.fillRect(110, 91, 135, 14);

    // Recessed dark binnacle around Virtual Cockpit (y: 103..136)
    dCtx.fillStyle = '#0e1117';
    dCtx.fillRect(112, 103, 130, 33);

    // Wood & Silver trim + Piano Black band (y: 136..171)
    dCtx.fillStyle = '#2a2625';
    dCtx.fillRect(110, 136, 135, 10);
    dCtx.fillStyle = '#0a0c10';
    dCtx.fillRect(110, 146, 135, 24);
    dCtx.fillStyle = '#b8bec8';
    dCtx.fillRect(110, 135, 135, 2);
    dCtx.fillRect(110, 170, 135, 2);

    // Cream-Beige Valcona Leather lower dashboard behind bottom half of wheel (y: 172..220)
    const creamGrad = dCtx.createLinearGradient(0, 172, 0, 220);
    creamGrad.addColorStop(0, '#c8c2b6');
    creamGrad.addColorStop(0.3, '#dfd9ce');
    creamGrad.addColorStop(1, '#d5cfc4');
    dCtx.fillStyle = creamGrad;
    dCtx.fillRect(110, 172, 135, 50);

    // Dark steering column collar in the very center behind the hub
    dCtx.fillStyle = '#181617';
    dCtx.beginPath();
    dCtx.arc(WHEEL_CX, WHEEL_CY, 25, 0, Math.PI * 2);
    dCtx.fill();

    dCtx.restore();
  }

  // Same painters as the photo cockpit, drawn into the 3D display canvases (logical units)
  paint3DScreen(name, ctx, w, h) {
    const s = this._screenState;
    if (!s) return;
    if (name === 'cluster') {
      this.drawVirtualCockpitScreen(ctx, 0, 0, w, h, s.speedKmh, s.rpm, s.gear, s.highBeam, s.combo, s.comboTimer, s.odometerKm);
    }
  }

  setViewPreset(index) {
    this.viewPreset = index % 3;
  }

  setAmbientColor(key) {
    const info = AMBIENT_COLORS[key] || AMBIENT_COLORS.cyan;
    this.ambientKey = key;
    return info;
  }

  cycleAmbientColor() {
    const keys = Object.keys(AMBIENT_COLORS);
    const idx = keys.indexOf(this.ambientKey);
    const nextKey = keys[(idx + 1) % keys.length];
    return this.setAmbientColor(nextKey);
  }

  triggerMakasCockpitPulse() {
    this.makasFlashIntensity = 1.0;
  }

  toggleWipers(forceState) {
    if (typeof forceState === 'boolean') {
      this.wipersEnabled = forceState;
    } else {
      this.wipersEnabled = !this.wipersEnabled;
    }
    return this.wipersEnabled;
  }

  // The rear-view mirror covers ~14% of the screen width; match that in device pixels
  resizeMirror() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(160, Math.min(512, Math.round((window.innerWidth * dpr * 0.15) / 16) * 16));
    if (w === this.mirrorW) return;
    this.mirrorW = w;
    this.mirrorH = w / 2;
    this.mirrorRenderTarget.setSize(this.mirrorW, this.mirrorH);
    this.mirrorPixels = new Uint8Array(this.mirrorW * this.mirrorH * 4);
    this.mirrorPixels32 = new Uint32Array(this.mirrorPixels.buffer);
    this.mirrorCanvas.width = this.mirrorW;
    this.mirrorCanvas.height = this.mirrorH;
    this.mirrorImgData = this.mirrorCtx.createImageData(this.mirrorW, this.mirrorH);
    this.mirrorImgData32 = new Uint32Array(this.mirrorImgData.data.buffer);
  }

  renderRearMirror(scene) {
    if (!this.renderer) return;
    this.resizeMirror();
    const prevTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.mirrorRenderTarget);
    this.renderer.clear();
    this.renderer.render(scene, this.mirrorCamera);
    if (this.is3D) {
      // The 3D mirror glass samples the render target directly: no GPU->CPU readback
      this.renderer.setRenderTarget(prevTarget);
      return;
    }
    this.renderer.readRenderTargetPixels(
      this.mirrorRenderTarget,
      0,
      0,
      this.mirrorW,
      this.mirrorH,
      this.mirrorPixels
    );
    this.renderer.setRenderTarget(prevTarget);

    // Flip horizontally (mirror reflection) and vertically (WebGL bottom-up to Canvas top-down)
    // (32-bit copies; alpha is the high byte on little-endian platforms)
    const src = this.mirrorPixels32;
    const dst = this.mirrorImgData32;
    const w = this.mirrorW;
    const h = this.mirrorH;
    for (let y = 0; y < h; y++) {
      const srcRow = (h - 1 - y) * w + (w - 1);
      const dstRow = y * w;
      for (let x = 0; x < w; x++) {
        dst[dstRow + x] = src[srcRow - x] | 0xff000000;
      }
    }
    this.mirrorCtx.putImageData(this.mirrorImgData, 0, 0);
  }

  update(dt, state, nearbyCars = []) {
    const {
      speedKmh,
      rpm,
      gear,
      steerInput,
      throttle,
      highBeam,
      combo,
      comboTimer,
      score,
      odometerKm,
      lateralG,
      bodyRoll = 0,
      bodyPitch = 0,
    } = state;

    // Realistic highway steering wheel angle:
    // On a real highway (90-240 km/h), lane changes & makas maneuvers use ~25° to 38° (0.45 - 0.66 rad),
    // not full parking-lot lock. Angle also tightens slightly as speed increases.
    const speedFactor = Math.min(1, Math.max(0, ((speedKmh || 90) - 60) / 180));
    const maxWheelRad = 0.66 - speedFactor * 0.20; // ~38° at low speed, ~26° at 240 km/h
    const targetWheelAngle = steerInput * maxWheelRad;
    this.currentSteerVisual = THREE.MathUtils.lerp(
      this.currentSteerVisual,
      targetWheelAngle,
      Math.min(1, dt * 16)
    );

    // Animate wipers
    if (this.wipersEnabled || this.wiperPhase > 0.01) {
      this.wiperPhase += dt * 4.2;
      if (!this.wipersEnabled && this.wiperPhase >= Math.PI) {
        this.wiperPhase = 0;
      } else {
        this.wiperPhase %= Math.PI;
      }
    }

    if (this.makasFlashIntensity > 0) {
      this.makasFlashIntensity = Math.max(0, this.makasFlashIntensity - dt * 2.5);
    }

    if (this.is3D) {
      this._screenState = { ...state, nearbyCars };
      this.interior3d.update({
        steerAngle: this.currentSteerVisual,
        night: Boolean(state.cabinNight),
        aspect: window.innerWidth / window.innerHeight,
        ambientHex: AMBIENT_COLORS[this.ambientKey]?.hex ?? 0x00f0ff,
        flash: this.makasFlashIntensity,
        wiperSweep: Math.sin(this.wiperPhase),
        wipersVisible: this.wipersEnabled || this.wiperPhase > 0.01,
      });
      if (this.camera) this.wheelScreenBounds = this.interior3d.getWheelScreenBounds(this.camera);
      // The overlay canvas stays in place (it receives wheel drags) but draws nothing
      if (!this._overlayCleared && this.overlayCtx) {
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        this._overlayCleared = true;
      }
      return;
    }

    this.renderOverlayCanvas(
      speedKmh,
      rpm,
      gear,
      throttle,
      highBeam,
      combo,
      comboTimer,
      score,
      odometerKm,
      lateralG,
      bodyRoll,
      bodyPitch,
      nearbyCars
    );
  }

  renderOverlayCanvas(
    speedKmh,
    rpm,
    gear,
    throttle,
    highBeam,
    combo,
    comboTimer,
    score,
    odometerKm,
    lateralG,
    bodyRoll,
    bodyPitch,
    nearbyCars
  ) {
    if (!this.overlayCanvas || !this.overlayCtx || !this.imageLoaded) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);

    if (this.overlayCanvas.width !== targetW || this.overlayCanvas.height !== targetH) {
      this.overlayCanvas.width = targetW;
      this.overlayCanvas.height = targetH;
    }

    const ctx = this.overlayCtx;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    // Subtle, planted cabin inertia only during active cornering/braking (zero shake when going straight)
    const swayX = -(lateralG || 0) * 3.2;
    const pitchY = (bodyPitch || 0) * 42;

    ctx.translate(cssW / 2 + swayX, cssH / 2 + pitchY);
    ctx.rotate((bodyRoll || 0) * 0.22);
    ctx.scale(1.02, 1.02);
    ctx.translate(-cssW / 2, -cssH / 2);

    // Determine horizontal crop & vertical windshield split based on screen aspect & camera preset
    // Preset 0 (Standart): 44% top windshield, 56% Audi cabin
    // Preset 1 (Geniş Tam Kabin): 32% top windshield, 68% full Audi cabin (exact photo proportions)
    // Preset 2 (Yakın Sürüş): 54% top windshield, 46% dashboard focus
    const splitRatios = [0.44, 0.32, 0.54];
    const splitScreenY = cssH * splitRatios[this.viewPreset % 3];
    const dashScreenH = cssH - splitScreenY;

    // Horizontal mapping: on wide screens show full 0..600; on narrow portrait windows focus gently on driver + center console (x: 24..520)
    const aspect = cssW / cssH;
    let cropX = 0;
    let cropW = SRC_W;
    if (aspect < 1.15 && this.viewPreset !== 1) {
      const t = Math.max(0, Math.min(1, (1.15 - aspect) / 0.65));
      cropX = 36 * t;
      cropW = SRC_W - 110 * t;
    }

    const mapX = (sx) => ((sx - cropX) / cropW) * cssW;
    const scaleX = cssW / cropW;
    const mapY = (sy) => {
      if (sy <= DASH_SPLIT_Y) {
        return (sy / DASH_SPLIT_Y) * splitScreenY;
      }
      return splitScreenY + ((sy - DASH_SPLIT_Y) / (SRC_H - DASH_SPLIT_Y)) * dashScreenH;
    };
    const scaleYBottom = dashScreenH / (SRC_H - DASH_SPLIT_Y);

    // 1. Draw Animated Windshield Wipers BEHIND the A-pillars & Dashboard
    if (this.wipersEnabled || this.wiperPhase > 0.01) {
      this.drawWindshieldWipers(ctx, mapX, mapY, splitScreenY);
    }

    // 2. Draw Stationary Photorealistic Audi A8 Cockpit (Top Zone: A-pillars & Roof; Bottom Zone: Dash, Doors, Console, Seats)
    // Top Zone (srcY: 0..DASH_SPLIT_Y -> dstY: 0..splitScreenY)
    const T = this.texScale;
    ctx.drawImage(
      this.dashCanvas,
      cropX * T,
      0,
      cropW * T,
      DASH_SPLIT_Y * T,
      0,
      0,
      cssW,
      splitScreenY + 1
    );

    // Bottom Zone (srcY: DASH_SPLIT_Y..SRC_H -> dstY: splitScreenY..cssH)
    ctx.drawImage(
      this.dashCanvas,
      cropX * T,
      DASH_SPLIT_Y * T,
      cropW * T,
      (SRC_H - DASH_SPLIT_Y) * T,
      0,
      splitScreenY,
      cssW,
      dashScreenH
    );

    // 3. Draw Live 3D Rear-View Mirror & Left/Right Exterior Wing Mirrors
    this.drawLiveMirrors(ctx, mapX, mapY, nearbyCars);

    // 4. Draw Live High-DPI Audi Virtual Cockpit (Inside Binnacle at srcX: 136..234, srcY: 103..135)
    this.drawVirtualCockpitScreen(
      ctx,
      mapX(136),
      mapY(103),
      98 * scaleX,
      32 * scaleYBottom,
      speedKmh,
      rpm,
      gear,
      highBeam,
      combo,
      comboTimer,
      odometerKm
    );

    // 5. Draw Live High-DPI Upper MMI Touch Screen (srcX: 271..337, srcY: 139..166)
    this.drawUpperMmiScreen(
      ctx,
      mapX(271),
      mapY(139),
      66 * scaleX,
      27 * scaleYBottom,
      nearbyCars,
      speedKmh,
      combo,
      score,
      lateralG
    );

    // 6. Draw Live High-DPI Lower MMI Climate Screen (srcX: 271..332, srcY: 176..210)
    this.drawLowerMmiScreen(
      ctx,
      mapX(271),
      mapY(176),
      61 * scaleX,
      34 * scaleYBottom,
      gear
    );

    // 7. Draw Dynamic Ambient LED Contour Lighting along Dashboard & Doors
    this.drawAmbientLedStrips(ctx, mapX, mapY);

    // 8. Draw Rotating Photorealistic Audi 4-Ring Steering Wheel on top!
    const wheelScreenX = mapX(WHEEL_CX);
    const wheelScreenY = mapY(WHEEL_CY);
    const wheelDrawW = this.wheelSize * scaleX;
    const wheelDrawH = this.wheelSize * scaleYBottom;

    // Save screen-space wheel bounds so user can drag the wheel directly with mouse or touch
    this.wheelScreenBounds = {
      cx: wheelScreenX,
      cy: wheelScreenY,
      r: WHEEL_R * scaleX,
    };

    ctx.save();
    ctx.translate(wheelScreenX, wheelScreenY);
    // Scale to match current screen aspect before rotating in a circle
    ctx.scale(1, scaleYBottom / scaleX);
    ctx.rotate(this.currentSteerVisual);
    ctx.drawImage(
      this.wheelCanvas,
      -wheelDrawW / 2,
      -wheelDrawW / 2,
      wheelDrawW,
      wheelDrawW
    );
    ctx.restore();

    ctx.restore();
  }

  drawWindshieldWipers(ctx, mapX, mapY, splitScreenY) {
    const sweep = Math.sin(this.wiperPhase); // 0 to 1
    const angle = -Math.PI * 0.88 + sweep * (Math.PI * 0.44);
    const pivots = [175, 345];

    ctx.save();
    ctx.strokeStyle = '#14171f';
    ctx.lineCap = 'round';

    pivots.forEach((px) => {
      const sx = mapX(px);
      const sy = splitScreenY + 6;
      const len = splitScreenY * 0.82;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);

      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len, 0);
      ctx.stroke();

      ctx.lineWidth = 8;
      ctx.strokeStyle = '#090b10';
      ctx.beginPath();
      ctx.moveTo(len * 0.25, -2);
      ctx.lineTo(len, -2);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  drawLiveMirrors(ctx, mapX, mapY, nearbyCars) {
    // 1. Center Overhead Rear-View Mirror (Polygon: (258,22)->(342,22)->(339,45)->(261,45))
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(mapX(258), mapY(22));
    ctx.lineTo(mapX(342), mapY(22));
    ctx.lineTo(mapX(339), mapY(45));
    ctx.lineTo(mapX(261), mapY(45));
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      this.mirrorCanvas,
      mapX(257),
      mapY(21),
      mapX(343) - mapX(257),
      mapY(46) - mapY(21)
    );
    ctx.restore();

    // 2. Left Exterior Wing Mirror (x: 1..38, y: 82..114)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      mapX(1),
      mapY(82),
      mapX(38) - mapX(1),
      mapY(114) - mapY(82),
      6
    );
    ctx.clip();
    ctx.drawImage(
      this.mirrorCanvas,
      0,
      0,
      this.mirrorW * 0.55,
      this.mirrorH,
      mapX(1),
      mapY(82),
      mapX(38) - mapX(1),
      mapY(114) - mapY(82)
    );

    // Blind-Spot Warning Amber LED on Left Mirror
    const carOnLeft = nearbyCars.some(
      (c) => Math.abs(c.relZ) < 7.0 && c.relX < -1.1 && c.relX > -5.2
    );
    if (carOnLeft && Math.floor(performance.now() / 130) % 2 === 0) {
      ctx.fillStyle = '#ff9900';
      ctx.beginPath();
      ctx.arc(mapX(8), mapY(90), 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Right Exterior Wing Mirror (x: 562..599, y: 82..114)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      mapX(562),
      mapY(82),
      mapX(599) - mapX(562),
      mapY(114) - mapY(82),
      6
    );
    ctx.clip();
    ctx.drawImage(
      this.mirrorCanvas,
      this.mirrorW * 0.45,
      0,
      this.mirrorW * 0.55,
      this.mirrorH,
      mapX(562),
      mapY(82),
      mapX(599) - mapX(562),
      mapY(114) - mapY(82)
    );
    ctx.restore();
  }

  drawVirtualCockpitScreen(
    ctx,
    x,
    y,
    w,
    h,
    speedKmh,
    rpm,
    gear,
    highBeam,
    combo,
    comboTimer,
    odometerKm
  ) {
    const accent = AMBIENT_COLORS[this.ambientKey]?.css || '#00f0ff';

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h * 0.18);
    ctx.clip();

    // Deep Audi Virtual Cockpit Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x, y, w, h);

    const dialR = h * 0.42;
    const leftDialX = x + w * 0.22;
    const rightDialX = x + w * 0.78;
    const dialY = y + h * 0.52;

    // Left Tachometer Dial (0 - 8000 RPM)
    this.drawMiniAudiDial(ctx, leftDialX, dialY, dialR, Math.min(1, rpm / 8000), accent, true);
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.max(8, h * 0.2)}px ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`S${gear}`, leftDialX, dialY + dialR * 0.45);

    // Right Speedometer Dial (0 - 240 KM/H)
    this.drawMiniAudiDial(ctx, rightDialX, dialY, dialR, Math.min(1, speedKmh / 240), accent, false);
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.max(8, h * 0.2)}px ui-monospace, monospace`;
    ctx.fillText(`${Math.round(speedKmh)}`, rightDialX, dialY + dialR * 0.45);

    // Center Area: Audi 4 Rings + Digital Speed + Makas Combo
    const centerX = x + w * 0.5;
    const ringR = Math.max(2.5, h * 0.075);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = Math.max(1, h * 0.025);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(centerX + (i - 1.5) * ringR * 1.4, y + h * 0.26, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.max(10, h * 0.34)}px ui-monospace, monospace`;
    ctx.fillText(`${Math.round(speedKmh)}`, centerX, y + h * 0.64);

    if (highBeam) {
      ctx.fillStyle = '#3b82f6';
      ctx.font = `800 ${Math.max(7, h * 0.16)}px system-ui, sans-serif`;
      ctx.fillText('≡O UZUN FAR', centerX, y + h * 0.86);
    } else if (combo > 1.0) {
      ctx.fillStyle = combo >= 4 ? '#ffae00' : accent;
      ctx.font = `900 ${Math.max(7, h * 0.17)}px system-ui, sans-serif`;
      ctx.fillText(`MAKAS ${combo.toFixed(1)}x`, centerX, y + h * 0.86);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = `700 ${Math.max(6, h * 0.14)}px ui-monospace, monospace`;
      ctx.fillText(`${odometerKm.toFixed(0)} km`, centerX, y + h * 0.86);
    }

    ctx.restore();
  }

  drawMiniAudiDial(ctx, cx, cy, r, norm, accent, hasRedline) {
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const sweep = endAngle - startAngle;

    // Silver outer ring
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Active progress arc
    ctx.strokeStyle = hasRedline && norm > 0.8 ? '#ff2a4b' : accent;
    ctx.lineWidth = Math.max(2, r * 0.14);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.82, startAngle, startAngle + sweep * Math.max(0.02, norm));
    ctx.stroke();

    // Red needle
    const ang = startAngle + sweep * Math.max(0.01, norm);
    ctx.strokeStyle = '#ff2a4b';
    ctx.lineWidth = Math.max(1.5, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * (r * 0.85), cy + Math.sin(ang) * (r * 0.85));
    ctx.stroke();
  }

  drawUpperMmiScreen(ctx, x, y, w, h, nearbyCars, speedKmh, combo, score, lateralG) {
    const accent = AMBIENT_COLORS[this.ambientKey]?.css || '#00f0ff';

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 3);
    ctx.clip();

    ctx.fillStyle = '#060911';
    ctx.fillRect(x, y, w, h);

    // Left Half: Audi MMI Quick Tiles
    const leftW = w * 0.54;
    ctx.fillStyle = accent;
    ctx.font = `800 ${Math.max(7, h * 0.16)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('● AUDI MMI NAVIGATION', x + 5, y + h * 0.24);

    ctx.fillStyle = '#f8fafc';
    ctx.font = `900 ${Math.max(8, h * 0.22)}px ui-monospace, monospace`;
    ctx.fillText(`${Math.round(speedKmh)} KM/S`, x + 5, y + h * 0.56);

    ctx.fillStyle = combo > 1 ? '#ffae00' : '#94a3b8';
    ctx.font = `800 ${Math.max(7, h * 0.17)}px system-ui, sans-serif`;
    ctx.fillText(`KOMBO: ${combo.toFixed(1)}x`, x + 5, y + h * 0.84);

    // Right Half: Live 4-Lane Highway Radar
    const rx = x + leftW + 2;
    const ry = y + 3;
    const rw = w - leftW - 5;
    const rh = h - 6;

    ctx.fillStyle = '#0c1322';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeRect(rx, ry, rw, rh);

    // 4 lanes dashed dividers
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    for (let l = 1; l < 4; l++) {
      const lx = rx + (rw / 4) * l;
      ctx.beginPath();
      ctx.moveTo(lx, ry);
      ctx.lineTo(lx, ry + rh);
      ctx.stroke();
    }

    const playerScreenX = rx + rw / 2 + ((nearbyCars.playerX || 0) / 16) * rw;
    const playerScreenY = ry + rh * 0.74;

    nearbyCars.forEach((car) => {
      if (car.relZ < -90 || car.relZ > 30) return;
      const cx = rx + rw / 2 + (car.x / 16) * rw;
      const cy = playerScreenY + (car.relZ / 90) * (rh * 0.74);
      if (cy < ry + 2 || cy > ry + rh - 2) return;
      if (car.isPeer) {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(cx - 3.5, cy - 5, 7, 10);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 3.5, cy - 5, 7, 10);
      } else {
        const isClose = Math.abs(car.relZ) < 12 && Math.abs(car.relX) < 2.4;
        ctx.fillStyle = isClose ? '#ff2a4b' : '#f59e0b';
        ctx.fillRect(cx - 2.5, cy - 4, 5, 8);
      }
    });

    // Player car dot on radar
    ctx.fillStyle = accent;
    ctx.fillRect(playerScreenX - 3, playerScreenY - 4.5, 6, 9);

    ctx.restore();
  }

  drawLowerMmiScreen(ctx, x, y, w, h, gear) {
    const accent = AMBIENT_COLORS[this.ambientKey]?.css || '#00f0ff';

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 3);
    ctx.clip();

    ctx.fillStyle = '#070a12';
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#f8fafc';
    ctx.font = `800 ${Math.max(8, h * 0.24)}px ui-monospace, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText('21.5°', x + 6, y + h * 0.38);
    ctx.textAlign = 'right';
    ctx.fillText('22.0°', x + w - 6, y + h * 0.38);

    ctx.textAlign = 'center';
    ctx.fillStyle = accent;
    ctx.font = `800 ${Math.max(6, h * 0.17)}px system-ui, sans-serif`;
    ctx.fillText(`AUTO • S${gear}`, x + w / 2, y + h * 0.36);

    // Bottom drive select bar
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + 4, y + h * 0.58, w - 8, h * 0.32);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `700 ${Math.max(6, h * 0.16)}px system-ui, sans-serif`;
    ctx.fillText('drive select  •  ⚠️  •  ESP', x + w / 2, y + h * 0.8);

    ctx.restore();
  }

  drawAmbientLedStrips(ctx, mapX, mapY) {
    const accent = AMBIENT_COLORS[this.ambientKey]?.css || '#00f0ff';
    const alpha = 0.65 + this.makasFlashIntensity * 0.35;

    ctx.save();
    ctx.strokeStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 10 + this.makasFlashIntensity * 14;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2.5 + this.makasFlashIntensity * 2;
    ctx.lineCap = 'round';

    // 1. Dashboard Upper & Lower Contour Strips
    ctx.beginPath();
    ctx.moveTo(mapX(234), mapY(134));
    ctx.lineTo(mapX(476), mapY(135));
    ctx.moveTo(mapX(234), mapY(170));
    ctx.lineTo(mapX(462), mapY(169));
    ctx.stroke();

    // 2. Left & Right Door Contour Ambient Strips
    ctx.beginPath();
    ctx.moveTo(mapX(14), mapY(168));
    ctx.lineTo(mapX(110), mapY(136));
    ctx.moveTo(mapX(490), mapY(136));
    ctx.lineTo(mapX(586), mapY(168));
    ctx.stroke();

    ctx.restore();
  }
}
