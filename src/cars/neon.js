import * as THREE from 'three';

// Neon underglow: the light a strip under the car throws on the road round it. It is a soft
// glow laid on the ground (no real light, so no shader changes and no cost per lit object):
// full strength under the car, fading out over `margin` metres past its sides. Exterior models
// carry one (garage, online friends, drone replay); the driven car's lies on the road under
// the cockpit view (main.js). Colours: src/progression/config.js → NEON_COLORS.

const DAY_OPACITY = 0.32; // in daylight the glow is only a hint on the tarmac
const NIGHT_OPACITY = 0.95;

const textures = new Map();

// Glow for a car of `width` × `length` m with `margin` m of light round it: 1 under the car,
// falling off with the distance from its outline
function glowTexture(width, length, margin) {
  const key = `${width.toFixed(2)}|${length.toFixed(2)}|${margin}`;
  if (textures.has(key)) return textures.get(key);
  const W = 64;
  const H = Math.round((W * (length + 2 * margin)) / (width + 2 * margin));
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(W, H);
  const mPerPx = (width + 2 * margin) / W;
  const halfW = width / 2 - 0.15; // the strip sits a little in from the sills
  const halfL = length / 2 - 0.3;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = Math.abs((x + 0.5) * mPerPx - (width / 2 + margin));
      const pz = Math.abs((y + 0.5) * mPerPx - (length / 2 + margin));
      const d = Math.hypot(Math.max(0, px - halfW), Math.max(0, pz - halfL));
      const a = Math.exp(-2.6 * (d / margin) ** 1.4);
      const i = (y * W + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textures.set(key, tex);
  return tex;
}

// Soft pool of light ahead of the front bumper, `reach` m long: the glow spilling out from under
// the car onto the road ahead, the part of it a driver sees over the bonnet at night
function spillTexture() {
  if (textures.has('spill')) return textures.get('spill');
  const W = 32;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const along = (y + 0.5) / H; // 1 at the bumper (bottom row: the plane's near end), 0 far ahead
    for (let x = 0; x < W; x++) {
      const across = Math.abs((x + 0.5) / W - 0.5) * 2;
      const a = along ** 1.3 * Math.max(0, 1 - across ** 2);
      const i = (y * W + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textures.set('spill', tex);
  return tex;
}

// A flat glow lying on the ground; set its colour (null: off) and day / night strength
function groundGlow(map, width, length, dayOpacity, nightOpacity) {
  const material = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length).rotateX(-Math.PI / 2), material);
  mesh.position.y = 0.02;
  mesh.renderOrder = 1;
  mesh.visible = false;
  let hex = null;
  let night = false;
  const apply = () => {
    mesh.visible = hex !== null;
    if (hex === null) return;
    material.color.setHex(hex);
    material.opacity = night ? nightOpacity : dayOpacity;
  };
  return {
    mesh,
    setColor(next) {
      hex = next ?? null;
      apply();
    },
    setNight(on) {
      if (on === night) return;
      night = on;
      apply();
    },
  };
}

// A glow on the ground under a car of `width` × `length` m; setColor(hex | null), setNight(on)
export function createNeonGlow(width, length, margin = 0.9) {
  return groundGlow(
    glowTexture(width, length, margin),
    width + 2 * margin,
    length + 2 * margin,
    DAY_OPACITY,
    NIGHT_OPACITY
  );
}

// The driven car's light on the road ahead (see spillTexture), from its front bumper at
// z = -length / 2 forward; same setColor / setNight
export function createNeonSpill(length, reach = 15) {
  const glow = groundGlow(spillTexture(), 4, reach, DAY_OPACITY * 0.25, NIGHT_OPACITY * 0.65);
  glow.mesh.position.z = -length / 2 - reach / 2 + 0.6;
  return glow;
}
