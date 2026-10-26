import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// Mercedes-AMG GT Roadster (R190). Models built by src/cars/amg-gt/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'amg-gt',
  order: 3,
  label: 'Mercedes-AMG GT',
  make: 'MERCEDES-AMG',
  model: 'GT',
  variant: 'R190 · Roadster',
  aliases: ['amg', 'mercedes'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  price: 22000,
  performance: { topSpeed: 300, power: 1.1, traction: 0.97, handling: 1.03, braking: 1.04, upgradeCost: 1.35 },
  credit: {
    title: 'Mercedes Amg GT roadster',
    url: 'https://sketchfab.com/3d-models/mercedes-amg-gt-roadster-30255e1d942a455e970e7c776998f695',
    author: 'RES1N',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(1,4 milyondan 60 bin üçgene sadeleştirildi, kokpit ayrıldı)',
  },

  exterior: {
    url: `${BASE}models/amg-gt.glb`,
    length: 4.54,
    envMapIntensity: 0.25,
    metalness: 0.18,
    roughness: 0.68,
    clearcoat: 0.04,
    clearcoatRoughness: 0.65,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    // Material names set by convert.mjs → exterior.renameMaterials
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, box: 'head' },
      // Lamp interiors and the lower strip glow at half strength, like the A8's outer lens
      { match: /^tailLens$/, role: 'tail', emissive: 0x80000c },
      { match: /^tailLight1$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, box: 'tail' },
    ],
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [1.0, 0.5], from: 'head', inset: 0.2, offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.7, size: [0.85, 0.45], from: 'tail', inset: 0.25, offset: 0.06 },
    },
  },

  // Built by convert.mjs → cockpit; points measured on /tools/model-preview/lab.html?car=amg-gt
  cockpit: {
    modelUrl: `${BASE}models/amg-gt-cockpit.glb`,
    cluster: 'mercedes', // two dials + AMG lettering (src/cockpit.js → drawVirtualCockpitScreen)
    scale: 1,
    defaultEye: [-0.416, 1.03, 0.6],
    wheelRadius: 0.18,
    steerSign: -1,
    softMaterials: new Set(['interior']),
    // Body panels seen from the seat (hood, door tops): dark metallic paint
    paintMaterials: new Set(['body']),
    screens: {
      // The cluster face (tex3) is an arched plane; the quad covers it 4 mm in front
      cluster: {
        tl: [-0.594, 0.904, -0.232],
        tr: [-0.243, 0.904, -0.232],
        bl: [-0.594, 0.686, -0.175],
        br: [-0.243, 0.686, -0.175],
        n: [0, 0.253, 0.967],
        logical: [240, 154],
        px: [1024, 657],
      },
    },
    // Door cards (Object_641) at hand height, measured by raycast 6 mm in front of the surface
    ledPaths: [
      [[-0.73, 0.8, -0.05], [-0.733, 0.8, 0.15], [-0.734, 0.8, 0.35], [-0.734, 0.8, 0.5]],
      [[0.73, 0.8, -0.05], [0.733, 0.8, 0.15], [0.734, 0.8, 0.35], [0.733, 0.8, 0.5]],
    ],
    // Windshield (d_glass) runs from y 0.82 / z -0.57 up to y 1.19 / z 0.12
    glassOut: new THREE.Vector3(0, 0.88, -0.47).normalize(),
    glassUp: new THREE.Vector3(0, 0.47, 0.88).normalize(),
    wiperPivots: [[-0.36, 0.84, -0.55], [0.1, 0.84, -0.56]],
    wiperLen: 0.58,
    floor: null,
    occlusion: { y0: 0.2, y1: 0.85, min: 0.35 },
  },
};
