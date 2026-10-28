import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// Ford Focus II sedan (2008 facelift). Model built by src/cars/focus/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'focus',
  order: 7,
  label: 'Ford Focus',
  make: 'FORD',
  model: 'FOCUS',
  variant: 'Sedan · 1.6',
  aliases: ['ford'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // Budget sedan: slow to 100 and an early top speed, but light and easy to place
  price: 5000,
  performance: { topSpeed: 205, power: 0.66, traction: 0.72, handling: 0.94, braking: 0.82, upgradeCost: 0.65 },
  credit: {
    title: 'Ford Focus Sedan',
    url: 'https://sketchfab.com/3d-models/ford-focus-sedan-9bc5e9e5edd5487f97d8501a22c3c8b5',
    author: 'BHP3D',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(805 bin üçgenden 60 bin üçgene optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    url: `${BASE}models/focus.glb`,
    length: 4.48,
    envMapIntensity: 0.25,
    metalness: 0.18,
    roughness: 0.68,
    clearcoat: 0.04,
    clearcoatRoughness: 0.65,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    // The whole lamp cluster lights up (no separate brake section): a softer brake keeps it red
    tail: { day: 0.35, night: 1.1, brake: 2.0 },
    // First matching rule wins (material names in the GLB)
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, emissiveFromMap: true, box: 'head' },
      // Clear outer lens over the lamps: a faint red so the lamp bodies read through it
      { match: /^tailLens$/, role: 'tail', emissive: 0x80000c },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
      { match: /^tail/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true },
    ],
    // Halo quads; `from` a lamp box (x inset from its outer edge) or a fixed `at` point
    glow: {
      // headLight also holds the fog lamps low in the bumper: halo measured on the headlight
      front: { color: 0xe4eeff, opacity: 0.95, size: [1.0, 0.5], at: [0.6, 0.74, -1.88], offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.7, size: [0.85, 0.45], from: 'tail', inset: 0.25, offset: 0.06 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/focus-cockpit.glb`,
    cluster: 'ford',
    scale: 1,
    defaultEye: [-0.377, 1.16, 0.04],
    wheelRadius: 0.198,
    steerSign: -1,
    softMaterials: new Set(['Salon.6', 'Salon.5', 'interior.001', 'interior']),
    // The atlases' silver swatch (spokes, centre stack, door pulls) reads as white otherwise
    tints: { 'interior.001': 0.22, interior: 0.35 },
    paintMaterials: new Set(['primary']),
    screens: {
      // Both dials and the centre pod, 4 mm in front of the cluster glass (glass not kept)
      cluster: {
        tl: [-0.512, 0.97, -0.73],
        tr: [-0.245, 0.97, -0.73],
        bl: [-0.512, 0.866, -0.722],
        br: [-0.245, 0.866, -0.722],
        n: [0, 0.077, 0.997],
        logical: [240, 94],
        px: [1024, 401],
      },
    },
    ledPaths: [],
    // Windshield normal / slope measured on the source glass; pivots just under its base
    glassOut: new THREE.Vector3(0, 0.88, -0.47).normalize(),
    glassUp: new THREE.Vector3(0, 0.45, 0.89).normalize(),
    wiperPivots: [[-0.45, 0.96, -1.0], [0.1, 0.96, -1.02]],
    wiperLen: 0.6,
    floor: null,
    // The silver trims glow white at night at the default 0.22
    cabinNightGlow: 0.12,
  },
};
