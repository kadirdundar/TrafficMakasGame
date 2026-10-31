import * as THREE from 'three';

// Window film for any car's exterior model: the window glass is darkened by the film's `shade`
// (0-1, src/progression/config.js → WINDOW_TINTS). The glass is the materials named in car.js →
// exterior.tint.materials, or by default the ones whose name says glass or window (lamp lenses
// are left alone).

const BLACK = new THREE.Color(0x05070a);
const isWindow = (name) => /glass|window|cam/i.test(name) && !/lens|lamp|light|head|tail|mirror/i.test(name);

// Returns set(shade) for one loaded model
export function createWindowTint(model, cfg) {
  const glass = new Map(); // material → its own colour and opacity
  model.traverse((o) => {
    if (!o.isMesh) return;
    for (const mat of Array.isArray(o.material) ? o.material : [o.material]) {
      const name = mat?.name || '';
      if (glass.has(mat) || !(cfg?.materials ? cfg.materials.includes(name) : isWindow(name))) continue;
      glass.set(mat, { color: mat.color.clone(), opacity: mat.opacity });
    }
  });
  let current = 0;
  return function set(shade = 0) {
    if (shade === current) return;
    current = shade;
    for (const [mat, own] of glass) {
      mat.color.copy(own.color).lerp(BLACK, shade);
      // See-through glass also lets less through: the film makes it more opaque
      if (mat.transparent) mat.opacity = own.opacity + (1 - own.opacity) * shade * 0.85;
    }
  };
}
