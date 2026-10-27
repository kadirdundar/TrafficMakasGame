import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// Audi A8 (D5). Field reference: src/cars/README.md
export default {
  id: 'a8',
  order: 1,
  label: 'Audi A8',
  make: 'AUDI',
  model: 'A8',
  variant: 'D5 · quattro',
  aliases: ['audi'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // Starter car: every profile owns it
  price: 0,
  performance: { topSpeed: 250, power: 0.84, traction: 0.86, handling: 0.9, braking: 0.92, upgradeCost: 1 },
  credit: {
    title: 'Audi A8 Custom 2018',
    url: 'https://sketchfab.com/3d-models/audi-a8-custom-2018-cd094d03f7684809900a929a9c88c8db',
    author: 'everhard',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '(iç mekân çıkarıldı, sadeleştirildi)',
  },

  exterior: {
    // Rim colour (src/cars/rims.js): the rims share 'chrome' with the window trim
    rims: { materials: ['chrome'] },
    url: `${BASE}models/audi-a8.glb`,
    length: 4.85,
    envMapIntensity: 0.25,
    metalness: 0.18,
    roughness: 0.68,
    clearcoat: 0.04,
    clearcoatRoughness: 0.65,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    // First matching rule wins (material names in the GLB)
    lamps: [
      { match: /^head/, role: 'head', emissive: 0xffffff, emissiveFromMap: true, box: 'head' },
      // Red outer lens (also covers the bumper reflectors): glows at half strength
      { match: /^tailLens$/, role: 'tail', emissive: 0x80000c },
      // Lamp bodies: the source texture mixes amber/white parts -> force a clean LED red.
      // tailLight2 is the main full-width band and positions the rear halo.
      { match: /^tailLight2$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
      { match: /^tail/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true },
    ],
    // Halo quads; `from` a lamp box (x inset from its outer edge) or a fixed `at` point
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [1.1, 0.55], from: 'head', inset: 0.2, offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.7, size: [0.85, 0.46], from: 'tail', inset: 0.25, offset: 0.06 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/a8-cockpit.glb`,
    cluster: 'audi',
    scale: 1.0816,
    defaultEye: [-0.36, 0.33, -0.02],
    wheelRadius: 0.155,
    steerSign: -1,
    softMaterials: new Set(['a8texture3', 'a8texture5', 'a8texture7', 'a8texture10']),
    tints: { a8texture3: 0.4 },
    screens: {
      cluster: {
        tl: [-0.4689, 0.1873, -0.7588],
        tr: [-0.196, 0.1873, -0.7588],
        bl: [-0.4689, 0.0827, -0.7473],
        br: [-0.196, 0.0827, -0.7473],
        n: [0, 0.11, 0.994],
        logical: [200, 77],
        px: [512, 196],
      },
    },
    ledPaths: [
      [[-0.648, 0.098, -0.64], [-0.656, 0.092, -0.3], [-0.652, 0.096, -0.04], [-0.639, 0.105, 0.05]],
      [[0.648, 0.098, -0.64], [0.656, 0.092, -0.3], [0.652, 0.096, -0.04], [0.639, 0.105, 0.05]],
    ],
    glassOut: new THREE.Vector3(0, 0.86, -0.51).normalize(),
    glassUp: new THREE.Vector3(-0.093, 0.46, 0.884).normalize(),
    wiperPivots: [[-0.335, 0.2, -1.053], [0.125, 0.19, -1.097]],
    wiperLen: 0.62,
    floor: { w: 1.7, h: 1.5, y: -0.4, z: -0.45 },
  },
};
