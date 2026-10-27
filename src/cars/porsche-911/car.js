import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// 2021 Porsche 911 Targa 4S (992). Model built by src/cars/porsche-911/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'porsche-911',
  order: 5,
  label: 'Porsche 911',
  make: 'PORSCHE',
  model: '911 TARGA 4S',
  variant: '992 · Twin-Turbo',
  aliases: ['porsche', '911', 'targa'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // All-wheel drive launch and the sharpest turn-in
  price: 30000,
  performance: { topSpeed: 295, power: 1.04, traction: 1.08, handling: 1.16, braking: 1.12, upgradeCost: 1.5 },
  credit: {
    title: '2021 Porsche 911 Targa 4S',
    url: 'https://sketchfab.com/3d-models/2021-porsche-911-targa-4s-616ebc4356c74a3b8554c396eb3bd34c',
    author: 'DisneyCars',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(116 bin üçgenden 59 bin üçgene optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    // Rim colour (src/cars/rims.js): the spokes share a textured material with the calipers
    // behind them, and 'rim' also holds the tyre: paint the outer face, inside the rim's radius
    rims: { materials: ['caliper', 'rim'], reach: 0.82, outer: 0.07 },
    url: `${BASE}models/porsche-911.glb`,
    length: 4.52,
    envMapIntensity: 0.25,
    metalness: 0.18,
    roughness: 0.68,
    clearcoat: 0.04,
    clearcoatRoughness: 0.65,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, box: 'head' },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
    ],
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [0.95, 0.48], from: 'head', inset: 0.23, offset: 0.06 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.85, size: [0.85, 0.35], from: 'tail', inset: 0.15, offset: 0.05 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/porsche-911-cockpit.glb`,
    cluster: 'porsche',
    scale: 1,
    defaultEye: [-0.345, 1.01, 0.42],
    wheelRadius: 0.18,
    steerSign: -1,
    softMaterials: new Set(['INTERIOR_12', 'PLASTI_NEGRO_3', 'modelSM_SoftTop_000.001SG3_11']),
    paintMaterials: new Set(['PAINT_COLOR_4']),
    screens: {
      cluster: {
        tl: [-0.485, 0.905, -0.470],
        tr: [-0.195, 0.905, -0.470],
        bl: [-0.485, 0.805, -0.435],
        br: [-0.195, 0.805, -0.435],
        n: [0, 0.33, 0.94],
        logical: [240, 92],
        px: [1024, 392],
      },
    },
    ledPaths: [
      [[-0.72, 0.78, -0.1], [-0.73, 0.78, 0.15], [-0.73, 0.78, 0.4]],
      [[0.72, 0.78, -0.1], [0.73, 0.78, 0.15], [0.73, 0.78, 0.4]],
    ],
    glassOut: new THREE.Vector3(0, 0.85, -0.52).normalize(),
    glassUp: new THREE.Vector3(0, 0.52, 0.85).normalize(),
    wiperPivots: [[-0.34, 0.86, -0.45], [0.12, 0.86, -0.45]],
    wiperLen: 0.55,
    floor: { w: 2.0, h: 4.0, y: 0.22, z: -0.6 },
    occlusion: { y0: 0.2, y1: 0.85, min: 0.35 },
  },
};
