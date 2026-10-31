// Paint finishes for any car's exterior model (garage, online friends, drone replay): how the
// body paint takes the light, in whatever colour it is painted. `factory` is the car's own
// tuning from car.js → exterior; the others are set over it. Catalogue and prices:
// src/progression/config.js → PAINT_FINISHES.

const FINISHES = {
  // Fine flake under a clear coat: sharper, brighter highlights
  metallic: {
    metalness: 0.62,
    roughness: 0.36,
    clearcoat: 0.6,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.75,
  },
  // Satin: soft, wide highlights and no reflections
  matte: {
    metalness: 0.08,
    roughness: 0.88,
    clearcoat: 0,
    clearcoatRoughness: 1,
    envMapIntensity: 0.18,
  },
  // Pearl: a thin-film shimmer that shifts colour with the viewing angle
  pearl: {
    metalness: 0.3,
    roughness: 0.3,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
    envMapIntensity: 0.7,
    iridescence: 0.75,
    iridescenceIOR: 1.45,
    iridescenceThicknessRange: [320, 620],
  },
};

const KEYS = ['metalness', 'roughness', 'clearcoat', 'clearcoatRoughness', 'envMapIntensity', 'iridescence', 'iridescenceIOR'];

// Returns set(id) for one car's body paint (a MeshPhysicalMaterial)
export function createPaintFinish(bodyMat) {
  const factory = Object.fromEntries(KEYS.map((k) => [k, bodyMat[k]]));
  factory.iridescenceThicknessRange = [...bodyMat.iridescenceThicknessRange];
  let current = 'factory';
  return function set(id = 'factory') {
    if (id === current) return;
    current = id;
    const finish = { ...factory, ...FINISHES[id] };
    for (const k of KEYS) bodyMat[k] = finish[k];
    bodyMat.iridescenceThicknessRange = finish.iridescenceThicknessRange;
  };
}
