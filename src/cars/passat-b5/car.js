import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// Volkswagen Passat B5 (sedan). Model built by src/cars/passat-b5/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'passat-b5',
  order: 9,
  label: 'VW Passat B5',
  make: 'VOLKSWAGEN',
  model: 'PASSAT B5',
  variant: '1.9 TDI',
  aliases: ['b5'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // The cheapest car: a slow diesel with soft handling and modest brakes
  price: 2500,
  performance: { topSpeed: 200, power: 0.62, traction: 0.7, handling: 0.82, braking: 0.78, upgradeCost: 0.6 },
  // 1.8 T, 5-speed manual, front-wheel drive: long gears, a thin bulkhead and soft springs
  drivetrain: { gears: [3.5, 1.94, 1.3, 0.97, 0.8], finalDrive: 3.89, wheelCircumference: 1.99, idleRpm: 850, redline: 6200, cruiseShiftRpm: 2500, shiftSec: 0.6, cylinders: 4, insulation: 0.5, turbo: 1.5 },
  chassis: { layout: 'fwd', mass: 1350, roll: 1.3, pitch: 1.25 },
  credit: {
    title: 'Volkswagen Passat B5',
    url: 'https://sketchfab.com/3d-models/volkswagen-passat-b5-4c3c05da2a3e46539cf324e756cc5e32',
    author: 'romanian_guy_0069',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(157 bin üçgenden 60 bin üçgene optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    // Number plates (src/cars/plate.js): heights in m above the ground
    plate: { front: { y: 0.5 }, rear: { y: 0.78 } },
    url: `${BASE}models/passat-b5.glb`,
    length: 4.7,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, emissiveFromMap: true, box: 'head' },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
    ],
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [0.9, 0.45], from: 'head', inset: 0.2, offset: 0.06 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.75, size: [0.8, 0.4], from: 'tail', inset: 0.2, offset: 0.05 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/passat-b5-cockpit.glb`,
    cluster: 'vw',
    scale: 1,
    defaultEye: [-0.37, 0.367, 0.057],
    wheelRadius: 0.18,
    steerSign: -1,
    softMaterials: new Set(['interior.4', 'interior.5', 'interior.7', 'BlackPlastic']),
    paintMaterials: new Set(['primary']),
    screens: {
      cluster: {
        tl: [-0.52, 0.215, -0.735],
        tr: [-0.22, 0.215, -0.735],
        bl: [-0.52, 0.075, -0.735],
        br: [-0.22, 0.075, -0.735],
        n: [0, 0, 1],
        logical: [240, 112],
        px: [1024, 478],
      },
    },
    ledPaths: [],
    glassOut: new THREE.Vector3(0, 0.875, -0.483).normalize(),
    glassUp: new THREE.Vector3(0, 0.483, 0.875).normalize(),
    wiperPivots: [[-0.42, 0.225, -1.08], [0.14, 0.225, -1.08]],
    wiperLen: 0.55,
    floor: null,
  },
};
