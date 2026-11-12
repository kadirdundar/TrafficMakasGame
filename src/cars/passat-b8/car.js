import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// Volkswagen Passat B8. Model built by src/cars/passat-b8/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'passat-b8',
  order: 8,
  label: 'VW Passat B8',
  make: 'VOLKSWAGEN',
  model: 'PASSAT B8',
  variant: '1.5 TSI · DSG',
  aliases: ['passat', 'b8'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // Family sedan: gentle launch, soft brakes, lower top speed
  price: 6500,
  performance: { topSpeed: 220, power: 0.7, traction: 0.76, handling: 0.9, braking: 0.86, upgradeCost: 0.75 },
  // 1.5 TSI, 7-speed DSG (its two final drives folded into the ratios), front-wheel drive
  drivetrain: { gears: [3.77, 2.27, 1.53, 1.12, 0.86, 0.69, 0.58], finalDrive: 4.44, wheelCircumference: 2.0, idleRpm: 750, redline: 6200, cruiseShiftRpm: 2000, shiftSec: 0.3, cylinders: 4, insulation: 0.75, turbo: 1.2 },
  chassis: { layout: 'fwd', mass: 1500, roll: 1.05, pitch: 1.05 },
  credit: {
    title: 'Volkswagen Passat B8',
    url: 'https://sketchfab.com/3d-models/volkswagen-passat-b8-98c3a29331834026838439c38e5a97e4',
    author: 'romanian_guy_0069',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(200 bin üçgenden 59 bin üçgene optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    // Number plates (src/cars/plate.js): heights in m above the ground
    plate: { front: { y: 0.42 }, rear: { y: 0.72 } },
    url: `${BASE}models/passat-b8.glb`,
    length: 4.77,
    // The chrome strip on the boot lid's edge reads as the edge and sinks the spoilers into it
    spoiler: { z: 2.25 },
    rims: { materials: ['rim'], tyres: ['tire'] },
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff },
      { match: /^headLightDrl$/, role: 'head', emissive: 0xffffff },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true },
    ],
    // Measured on the model (the lamp materials also hold the fog lamps and the third brake
    // light, so their bounding boxes miss the lamp centres)
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [0.95, 0.45], at: [0.68, 0.64, -2.135], offset: 0.06 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.8, size: [0.8, 0.38], at: [0.68, 0.825, 2.285], offset: 0.05 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/passat-b8-cockpit.glb`,
    cluster: 'vw',
    scale: 1,
    defaultEye: [-0.376, 0.524, 0.065],
    wheelRadius: 0.187,
    steerSign: -1,
    softMaterials: new Set(['interior', 'negru']),
    paintMaterials: new Set(['primary']),
    screens: {
      // The model's analog dials (interior.002) sit on a plane tilted back; the quad covers
      // them 17 mm in front (the dials stand up to 15 mm off that plane)
      cluster: {
        tl: [-0.522, 0.345, -0.75],
        tr: [-0.241, 0.345, -0.75],
        bl: [-0.522, 0.241, -0.718],
        br: [-0.241, 0.241, -0.718],
        n: [0, 0.296, 0.955],
        logical: [240, 93],
        px: [1024, 397],
      },
    },
    // Door cards, just above the chrome trim line; measured by raycast 6 mm off the surface
    ledPaths: [
      [[-0.728, 0.25, -0.55], [-0.718, 0.25, -0.3], [-0.715, 0.25, -0.05]],
      [[0.723, 0.25, -0.55], [0.713, 0.25, -0.3], [0.709, 0.25, -0.05]],
    ],
    // Windshield runs from y 0.33 / z -1.17 up to y 0.74 / z -0.33
    glassOut: new THREE.Vector3(0, 0.9, -0.44).normalize(),
    glassUp: new THREE.Vector3(0, 0.44, 0.9).normalize(),
    wiperPivots: [[-0.36, 0.33, -1.15], [0.1, 0.33, -1.16]],
    wiperLen: 0.6,
    floor: null,
    occlusion: { y0: -0.29, y1: 0.36, min: 0.35 },
  },
};
