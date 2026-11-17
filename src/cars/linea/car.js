import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// 2013 Fiat Linea (facelift sedan). Model built by src/cars/linea/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'linea',
  order: 11,
  label: 'Fiat Linea',
  make: 'FIAT',
  model: 'LINEA',
  variant: '1.4 T-Jet · 120 HP',
  aliases: ['fiat', 'linea'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // Turkey's everyday sedan: a small turbo pulls a little better than the Passat B5 mid-range,
  // tops out lower than the Corolla; a newer chassis than the B5 turns and stops a bit better
  price: 3000,
  performance: { topSpeed: 195, power: 0.63, traction: 0.7, handling: 0.85, braking: 0.8, upgradeCost: 0.55 },
  // 1.4 T-Jet turbo four-cylinder, 6-speed manual (C510), front-wheel drive, 205/55 R16
  drivetrain: { gears: [3.91, 2.24, 1.52, 1.16, 0.97, 0.82], finalDrive: 3.35, wheelCircumference: 1.99, idleRpm: 800, redline: 6500, cruiseShiftRpm: 2200, shiftSec: 0.55, cylinders: 4, insulation: 0.55, turbo: 0.8 },
  chassis: { layout: 'fwd', mass: 1290, roll: 1.3, pitch: 1.25 },
  credit: {
    title: 'Fiat Linea',
    url: 'https://sketchfab.com/3d-models/fiat-linea-340f01c616834cbda7f45c761cfb5e05',
    author: 'KOElkast1007',
    license: 'Sketchfab Free Standard',
    licenseUrl: 'https://sketchfab.com/licenses',
    note: '(112 bin üçgenden 60 bine optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    url: `${BASE}models/linea.glb`,
    length: 4.56,
    // Number plates (src/cars/plate.js), metres above the ground: the front bumper's plate
    // holder and the recess on the boot lid under the chrome strip (ray-measured, 0.60-0.74)
    plate: { front: { y: 0.48 }, rear: { y: 0.67 } },
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 0.9, brake: 2.2 }, // brighter washes the red lenses out to salmon
    rims: { materials: ['rim'], tyres: ['tire'] },
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, emissiveFromMap: true, box: 'head' },
      { match: /^tail(Light|Lens)$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
    ],
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [1.0, 0.5], from: 'head', inset: 0.2, offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      // The lens material also covers the bumper reflectors: the box would put the halo too low.
      // Ray-measured lamp body: x 0.45-0.78, 0.83-1.0 m up
      rear: { color: 0xff2032, opacity: 0.7, size: [0.7, 0.32], at: [0.6, 0.91, 2.13], offset: 0.06 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/linea-cockpit.glb`,
    cluster: 'fiat',
    scale: 1,
    defaultEye: [-0.396, 0.554, -0.072],
    wheelRadius: 0.19,
    steerSign: -1,
    // Trims, headliner, seats/console, floor, dash and belts: the model's light-grey cabin
    softMaterials: new Set(['material_13', 'interior', 'material_12', 'material_14', 'i.11', 'emniyetkemeri.0']),
    finishes: {
      'i.11': 'plastic',
      material_12: 'plastic',
      material_13: 'plastic',
      interior: 'fabric',
    },
    // The untextured pillar trims and headliner come out white: a grey cabin like the real car's
    tints: { material_13: 0.42, interior: 0.62, material_14: 0.3 },
    paintMaterials: new Set(['primary']), // roof and doors seen through the side glass
    screens: {
      // The flat glass over both dials (i_i.5 → material_12), 4 mm in front of it; ray-measured
      cluster: {
        tl: [-0.53, 0.39, -0.797],
        tr: [-0.25, 0.39, -0.797],
        bl: [-0.53, 0.314, -0.739],
        br: [-0.25, 0.314, -0.739],
        n: [0, 0.607, 0.795],
        logical: [240, 82],
        px: [1024, 352],
      },
    },
    ledPaths: [],
    // Windshield slope measured on the source glass (base y 0.40 / z -1.26, top y 0.77 / z -0.45);
    // pivots just under its base
    glassOut: new THREE.Vector3(0, 0.91, -0.414).normalize(),
    glassUp: new THREE.Vector3(0, 0.414, 0.91).normalize(),
    wiperPivots: [[-0.4, 0.385, -1.27], [0.06, 0.385, -1.29]],
    wiperLen: 0.55,
    floor: null,
    cabinNightGlow: 0.14, // the grey pillars and headliner glow too much at 0.22
  },
};
