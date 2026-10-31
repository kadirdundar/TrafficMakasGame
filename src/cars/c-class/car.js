import * as THREE from 'three';
import { cabinSymbolPainter, paintMercedesWheelButtons } from './painters.js';

const BASE = import.meta.env.BASE_URL;

// Small cabin symbols (w206_simbs without UVs), picked by region in model coordinates
const symbolPatch = (group, region, project) => ({
  meshes: ['CockpitRoot'],
  material: 'w206_simbs',
  region,
  scale: 2,
  background: false,
  project,
  surface: { roughness: 0.5, metalness: 0.0, alphaTest: 0.4 },
  paint: cabinSymbolPainter(group),
});

// Mercedes-Benz C 200 (W206, AMG Line). Model built by src/cars/c-class/prep.mjs + convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'c-class',
  order: 10,
  label: 'Mercedes C 200',
  make: 'MERCEDES-BENZ',
  model: 'C 200',
  variant: 'W206 · AMG Line',
  aliases: ['c200', 'w206', 'mercedes-c'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // Premium sedan between the Passat B8 and the M4: 204 hp, 0-100 in 7.3 s, 246 km/h
  price: 12000,
  performance: { topSpeed: 246, power: 0.78, traction: 0.8, handling: 0.92, braking: 0.9, upgradeCost: 0.9 },
  credit: {
    title: 'Mercedes- Benz W206 C220',
    url: 'https://sketchfab.com/3d-models/mercedes-benz-w206-c220-c0ef31daf7cf4a8bada4b56005c19e83',
    author: 'KOElkast1007',
    license: 'Sketchfab Free Standard',
    licenseUrl: 'https://sketchfab.com/licenses',
    note: '(BeamNG.drive modundan; C 200 yazısı "Mercedes Benz W206" — ZapupaNekra, CC BY 4.0; 247 bin üçgenden 60 bine optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    url: `${BASE}models/c-class.glb`,
    length: 4.79,
    // Metallic paint under clearcoat (the defaults are a satin finish)
    envMapIntensity: 1.0,
    metalness: 0.5,
    roughness: 0.32,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    // Chrome, window trims, rims and glass keep their converted finish (convert.mjs → materials)
    keepFinish: ['chrome', 'trim', 'trimGloss', 'rim', 'glass', 'mirrorGlass'],
    rims: { materials: ['rim', 'chrome'], tyres: ['tire'] },
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    // convert.mjs malzemeleri headLight* / tailLight* olarak adlandırır
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, box: 'head' },
      { match: /^headLightDrl$/, role: 'head', emissive: 0xffffff },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428 },
      { match: /^tailLens$/, role: 'tail', emissive: 0x80000c },
    ],
    // The tail material also covers the bumper reflectors, so the rear halo sits at the lamp
    // centre measured on the model (lamp x 0.30-0.81, y 0.78-0.94, rear face z 2.27)
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [1.0, 0.5], from: 'head', inset: 0.2, offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.75, size: [0.75, 0.36], at: [0.6, 0.86, 2.24], offset: 0.05 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/c-class-cockpit.glb`,
    cluster: 'mercedes',
    scale: 1,
    defaultEye: [-0.385, 1.189, 0.262],
    wheelRadius: 0.19,
    steerSign: -1,
    softMaterials: new Set(['w206_leather_black', 'w206_leather_paintable', 'w206_leather_paintable_perf', 'w206_leather_black_paintable', 'w206_leather_perf']),
    paintMaterials: new Set(['w206_paint']),
    screens: {
      // The model's flat cluster plate (w206_gauges): x 0.219-0.527, y 0.879-0.98, z 0.431 (bottom)
      // to 0.458 (top) in the source; the quad sits 4 mm in front of it
      cluster: {
        tl: [-0.531, 0.987, -0.457],
        tr: [-0.221, 0.987, -0.457],
        bl: [-0.531, 0.885, -0.43],
        br: [-0.221, 0.885, -0.43],
        n: [0, 0.256, 0.967],
        logical: [240, 79],
        px: [1024, 337],
      },
    },
    // The model brings its own strips (ambient_led)
    ledPaths: [],
    // Windshield runs from y 0.93 / z -0.91 up to y 1.36 / z -0.07
    glassOut: new THREE.Vector3(0, 0.894, -0.448).normalize(),
    glassUp: new THREE.Vector3(0, 0.448, 0.894).normalize(),
    wiperPivots: [[-0.3, 0.9, -0.92], [0.15, 0.9, -0.94]],
    wiperLen: 0.6,
    floor: null,
    occlusion: { y0: 0.3, y1: 0.85, min: 0.35 },
    // Button symbols: the export lost their symbol texture (plain black faces)
    atlasPatches: [
      {
        meshes: ['steering_wheel'],
        material: 'w206_simbs',
        scale: 2,
        background: false,
        project: { axis: [0, 0.474, 0.88] },
        // Satin rather than gloss: upward-facing buttons would mirror the sky white
        surface: { roughness: 0.5, metalness: 0.0 },
        paint: paintMercedesWheelButtons,
      },
      // driver door top: mirror select/fold, windows, child lock
      symbolPatch('windows', [[-0.722, 0.718, -0.26], [-0.694, 0.736, -0.13]], { axis: [0.11, 0.99, 0], up: [0, 0, -1] }),
      // driver door: seat buttons, memory M/1/2/3
      symbolPatch('doorDriver', [[-0.7, 0.892, -0.295], [-0.678, 0.922, -0.23]], { axis: [0.98, -0.21, 0.05] }),
      // driver door: central locking
      symbolPatch('locks', [[-0.706, 0.878, -0.078], [-0.694, 0.902, -0.052]], { axis: [0.98, -0.13, 0.12] }),
      // light panel left of the wheel
      symbolPatch('lights', [[-0.606, 0.77, -0.385], [-0.574, 0.806, -0.37]], { axis: [0, 0.02, 1] }),
      // start/stop
      symbolPatch('start', [[-0.165, 0.858, -0.408], [-0.13, 0.882, -0.38]], { axis: [-0.02, 0.78, 0.62] }),
      // button row under the centre screen
      symbolPatch('centre', [[-0.1, 0.725, -0.256], [0.115, 0.745, -0.234]], { axis: [-0.05, 0.6, 0.8] }),
      // overhead console
      symbolPatch('overhead', [[-0.065, 1.28, 0.06], [0.065, 1.322, 0.118]], { axis: [0, -0.68, 0.74] }),
      // passenger door: seat buttons, memory
      symbolPatch('doorPassenger', [[0.678, 0.892, -0.295], [0.7, 0.922, -0.23]], { axis: [-0.98, -0.21, 0.05] }),
    ],
  },
};
