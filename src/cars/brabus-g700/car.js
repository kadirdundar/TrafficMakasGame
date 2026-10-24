import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// Mercedes-Benz G 700 Brabus Widestar (W463A). Models built by src/cars/brabus-g700/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'brabus-g700',
  order: 4,
  label: 'Brabus G700',
  make: 'MERCEDES-BENZ',
  model: 'G 700',
  variant: 'W463A · Brabus Widestar',
  aliases: ['brabus', 'g700', 'g63', 'g-class', 'gwagon', 'g-wagon', 'mercedes-brabus'],
  credit: {
    title: 'Mercedes Brabus G700 NS',
    url: 'https://sketchfab.com/3d-models/mercedes-brabus-g700-ns-ae10963953e34eda977d3114efdeea45',
    author: 'Mixmamo.studio',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(235 binden 60 bin üçgene sadeleştirildi, kokpit ayrıldı)',
  },

  exterior: {
    url: `${BASE}models/brabus-g700.glb`,
    length: 4.87,
    // Stealth matte finish: low reflection, diffuse matte surface without harsh mirror glares
    envMapIntensity: 0.35,
    metalness: 0.15,
    roughness: 0.70,
    clearcoat: 0.05,
    clearcoatRoughness: 0.6,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    // Material names set by convert.mjs → exterior.renameMaterials
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, box: 'head' },
      { match: /^headLightRoof$/, role: 'head', emissive: 0xffffff },
      { match: /^tailLens$/, role: 'tail', emissive: 0x80000c },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, box: 'tail' },
      { match: /^tailLightRoof$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428 },
    ],
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [0.85, 0.85], from: 'head', inset: 0.05, offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.2, 1.2], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.75, size: [0.65, 0.35], from: 'tail', inset: 0.05, offset: 0.06 },
    },
  },

  // Built by convert.mjs → cockpit; points measured on model
  cockpit: {
    modelUrl: `${BASE}models/brabus-g700-cockpit.glb`,
    cluster: 'brabus', // two dials + BRABUS lettering (src/cockpit.js → drawVirtualCockpitScreen)
    scale: 1,
    defaultEye: [-0.842, 1.31, 3.48],
    wheelRadius: 0.19,
    steerSign: -1,
    softMaterials: new Set([
      '2020_Mercedes-AMG_G63_Brabus_G700_LeatherWhite',
      '2020_Mercedes-AMG_G63_Brabus_G700_DarkLeather',
      '2020_Mercedes-AMG_G63_Brabus_G700_Carpet',
    ]),
    // Hood and A-pillars seen from the seat: dark metallic body paint
    paintMaterials: new Set(['Vehicle_Exterior_mm_ext', 'CarPaint', 'paint']),
    screens: {
      cluster: {
        tl: [-0.972, 1.175, 2.671],
        tr: [-0.681, 1.175, 2.671],
        bl: [-0.972, 1.068, 2.702],
        br: [-0.681, 1.068, 2.702],
        n: [0, 0.271, 0.963],
        logical: [240, 92],
        px: [1024, 392],
      },
    },
    ledPaths: [
      [[-1.17, 0.92, 2.70], [-1.17, 0.92, 2.95], [-1.17, 0.92, 3.20], [-1.17, 0.92, 3.45]],
      [[0.34, 0.92, 2.70], [0.34, 0.92, 2.95], [0.34, 0.92, 3.20], [0.34, 0.92, 3.45]],
      [[-1.05, 1.05, 2.72], [-0.85, 1.05, 2.72], [-0.42, 1.05, 2.72], [0.0, 1.05, 2.72], [0.22, 1.05, 2.72]],
    ],
    glassOut: new THREE.Vector3(0, 0.68, -0.73).normalize(),
    glassUp: new THREE.Vector3(0, 0.73, 0.68).normalize(),
    wiperPivots: [[-0.75, 1.08, 2.44], [-0.10, 1.08, 2.44]],
    wiperLen: 0.55,
    floor: null,
    cabinNightGlow: 0.18,
    occlusion: { y0: 0.3, y1: 1.1, min: 0.35 },
  },
};
