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

    // Rear-view mirror 3D render target & camera (160x80 fast readback for real-time 2D mirror compositing)
    this.mirrorW = 160;
    this.mirrorH = 80;
    this.mirrorRenderTarget = new THREE.WebGLRenderTarget(this.mirrorW, this.mirrorH, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    this.mirrorPixels = new Uint8Array(this.mirrorW * this.mirrorH * 4);
    this.mirrorCanvas = document.createElement('canvas');
    this.mirrorCanvas.width = this.mirrorW;
    this.mirrorCanvas.height = this.mirrorH;
    this.mirrorCtx = this.mirrorCanvas.getContext('2d');
    this.mirrorImgData = this.mirrorCtx.createImageData(this.mirrorW, this.mirrorH);

    this.mirrorCamera = new THREE.PerspectiveCamera(52, 2.0, 0.5, 220);
    this.group.add(this.mirrorCamera);
    this.mirrorCamera.position.set(0, 1.35, 1.8);
    this.mirrorCamera.rotation.set(0, Math.PI, 0);

    // Processed Photorealistic Layers from /audi_cockpit.png
    this.imageLoaded = false;
    this.dashCanvas = document.createElement('canvas');
    this.dashCanvas.width = SRC_W;
    this.dashCanvas.height = SRC_H;

    this.wheelCanvas = document.createElement('canvas');
    this.wheelSize = Math.ceil(WHEEL_R * 2 + 8);
    this.wheelCanvas.width = this.wheelSize;
    this.wheelCanvas.height = this.wheelSize;

    this.loadPhotorealisticCockpit();
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
    // 1. Read raw 600x338 pixels
    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = SRC_W;
    rawCanvas.height = SRC_H;
    const rawCtx = rawCanvas.getContext('2d');
    rawCtx.drawImage(img, 0, 0, SRC_W, SRC_H);
    const rawData = rawCtx.getImageData(0, 0, SRC_W, SRC_H);
    const px = rawData.data;

    // 2. Flood-fill studio background in Windshield & Left/Right Side Windows
    const windowMask = new Uint8Array(SRC_W * SRC_H);
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
        // Protect Center Rear-View Mirror Glass (x: 256..344, y: 19..46)
        if (nx >= 256 && nx <= 344 && ny >= 19 && ny <= 46) continue;
        // Protect Left & Right Exterior Mirror Glass (x: 0..41, y: 80..115 and x: 559..600, y: 80..115)
        if ((nx <= 41 || nx >= 559) && ny >= 80 && ny <= 115) continue;

        const npos = ny * SRC_W + nx;
        if (windowMask[npos]) continue;
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

    // 3. Extract Photorealistic Rotating Audi Steering Wheel into this.wheelCanvas
    const wCtx = this.wheelCanvas.getContext('2d');
    const wImgData = wCtx.createImageData(this.wheelSize, this.wheelSize);
    const wPx = wImgData.data;
    const halfW = this.wheelSize / 2;

    for (let wy = 0; wy < this.wheelSize; wy++) {
      for (let wx = 0; wx < this.wheelSize; wx++) {
        const dx = wx - halfW;
        const dy = wy - halfW;
        const r = Math.hypot(dx, dy);
        if (r > WHEEL_R) continue;

        const sx = Math.round(WHEEL_CX + dx);
        const sy = Math.round(WHEEL_CY + dy);
        if (sx < 0 || sx >= SRC_W || sy < 0 || sy >= SRC_H) continue;

        // Determine if pixel belongs to the solid Steering Wheel (rim, center 4-ring hub, horizontal spokes, or lower V-spokes)
        const isOuterRim = r >= 48.0 && r <= WHEEL_R;
        const isCenterHub = Math.abs(dx) <= 26 && dy >= -15 && dy <= 28 && r <= 31;
        const isHorizSpoke = dy >= -13 && dy <= 14 && r < 49.5;
        const isLowerVSpoke =
          dy > 10 &&
          r < 49.5 &&
          Math.abs(dx) <= 29 - (dy - 10) * 0.18 &&
          !(Math.abs(dx) <= 6 && dy > 29 && dy < 44);

        if (isOuterRim || isCenterHub || isHorizSpoke || isLowerVSpoke) {
          const si = (sy * SRC_W + sx) * 4;
          const di = (wy * this.wheelSize + wx) * 4;
          wPx[di] = px[si];
          wPx[di + 1] = px[si + 1];
          wPx[di + 2] = px[si + 2];
          // Smooth anti-aliased outer edge
          let alpha = 255;
          if (r > WHEEL_R - 1.5) {
            alpha = Math.round(Math.max(0, (WHEEL_R - r) / 1.5) * 255);
          }
          wPx[di + 3] = alpha;
        }
      }
    }
    wCtx.putImageData(wImgData, 0, 0);

    // 4. Build Stationary Dashboard Canvas (with transparent windows & clean dashboard behind the rotating wheel)
    const dCtx = this.dashCanvas.getContext('2d');
    const dashData = dCtx.createImageData(SRC_W, SRC_H);
    const dPx = dashData.data;

    for (let y = 0; y < SRC_H; y++) {
      for (let x = 0; x < SRC_W; x++) {
        const pos = y * SRC_W + x;
        const i = pos * 4;

        if (windowMask[pos]) {
          // Transparent windshield & side windows!
          dPx[i + 3] = 0;
          continue;
        }

        // Feather 1px border next to transparent window for smooth anti-aliasing
        let neighborWindowCount = 0;
        if (x > 0 && windowMask[pos - 1]) neighborWindowCount++;
        if (x < SRC_W - 1 && windowMask[pos + 1]) neighborWindowCount++;
        if (y > 0 && windowMask[pos - SRC_W]) neighborWindowCount++;
        if (y < SRC_H - 1 && windowMask[pos + SRC_W]) neighborWindowCount++;

        dPx[i] = px[i];
        dPx[i + 1] = px[i + 1];
        dPx[i + 2] = px[i + 2];
        dPx[i + 3] = neighborWindowCount > 0 ? 205 : 255;
      }
    }
    dCtx.putImageData(dashData, 0, 0);

    // Cleanly reconstruct the stationary dashboard behind the steering wheel rim (r <= WHEEL_R)
    // so when the wheel turns left/right, no static wheel rim ghost appears behind it!
    dCtx.save();
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

  renderRearMirror(scene) {
    if (!this.renderer) return;
    const prevTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.mirrorRenderTarget);
    this.renderer.clear();
    this.renderer.render(scene, this.mirrorCamera);
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
    const dst = this.mirrorImgData.data;
    const w = this.mirrorW;
    const h = this.mirrorH;
    for (let y = 0; y < h; y++) {
      const srcRow = (h - 1 - y) * w;
      const dstRow = y * w;
      for (let x = 0; x < w; x++) {
        const si = (srcRow + (w - 1 - x)) * 4;
        const di = (dstRow + x) * 4;
        dst[di] = this.mirrorPixels[si];
        dst[di + 1] = this.mirrorPixels[si + 1];
        dst[di + 2] = this.mirrorPixels[si + 2];
        dst[di + 3] = 255;
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
    ctx.drawImage(
      this.dashCanvas,
      cropX,
      0,
      cropW,
      DASH_SPLIT_Y,
      0,
      0,
      cssW,
      splitScreenY + 1
    );

    // Bottom Zone (srcY: DASH_SPLIT_Y..SRC_H -> dstY: splitScreenY..cssH)
    ctx.drawImage(
      this.dashCanvas,
      cropX,
      DASH_SPLIT_Y,
      cropW,
      SRC_H - DASH_SPLIT_Y,
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
