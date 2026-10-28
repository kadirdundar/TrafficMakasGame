import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// 2014 Toyota Corolla E180 (EU sedan). Model built by src/cars/corolla/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'corolla',
  order: 6,
  label: 'Toyota Corolla',
  make: 'TOYOTA',
  model: 'COROLLA',
  variant: 'E180 · 1.6 Valvematic',
  aliases: ['toyota', 'corolla'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // Everyday 1.6 sedan: slow to pull, soft but honest handling
  price: 5000,
  performance: { topSpeed: 200, power: 0.64, traction: 0.72, handling: 0.86, braking: 0.8, upgradeCost: 0.6 },
  credit: {
    title: '2014 Toyota Corolla E180 EU (with interior)',
    url: 'https://sketchfab.com/3d-models/2014-toyota-corolla-e180-eu-with-interior-36f95efb0585464cae43a25a3b3392e8',
    author: 'Armored Wave',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(84 bin üçgenden 27 bin üçgene optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    url: `${BASE}models/corolla.glb`,
    length: 4.62,
    envMapIntensity: 1.2,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 0.9, brake: 2.2 }, // brighter washes the red lamps out to salmon
    // Rim colour (src/cars/rims.js): the rims share the chrome material with the trim
    rims: { materials: ['chrome'] },
    // The lid rolls round into the chrome bar, which the edge scan reads as the lid's edge
    spoiler: { z: 2.12 },
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, box: 'head' },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
    ],
    // Measured on the lamps: the chrome reflectors run into the grille and the tail-lamp
    // material also covers the bumper reflectors, so the boxes would put the halos too far in / low
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [0.9, 0.45], at: [0.62, 0.77, -2.06], offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.7, size: [0.75, 0.32], at: [0.64, 0.92, 2.17], offset: 0.06 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/corolla-cockpit.glb`,
    cluster: 'toyota',
    scale: 1,
    defaultEye: [-0.382, 1.152, -0.066],
    wheelRadius: 0.21,
    steerSign: -1,
    softMaterials: new Set(['fabric_high', 'seat_fabric', 'leather', 'dark_plastic_grainy', 'car_plastic_grainy_gray', 'carpet.002', 'M_dashboard', 'M_Steering_wheel']),
    paintMaterials: new Set(['main_paint.001']),
    screens: {
      // The model's dial face (M_dashboard.001), 5 mm in front of it
      cluster: {
        tl: [-0.535, 1.002, -0.876],
        tr: [-0.229, 1.002, -0.876],
        bl: [-0.535, 0.898, -0.862],
        br: [-0.229, 0.898, -0.862],
        n: [0, 0.13, 0.99],
        logical: [240, 82],
        px: [1024, 352],
      },
    },
    ledPaths: [],
    glassOut: new THREE.Vector3(0, 0.925, -0.379).normalize(),
    glassUp: new THREE.Vector3(0, 0.379, 0.925).normalize(),
    wiperPivots: [[-0.36, 0.985, -1.26], [0.1, 0.985, -1.27]],
    wiperLen: 0.62,
    floor: null,
    occlusion: { y0: 0.25, y1: 0.95, min: 0.35 },
    cabinNightGlow: 0.14, // the light grey pillars and headliner glow too much at 0.22
  },
};
