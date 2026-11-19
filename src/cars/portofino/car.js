import * as THREE from 'three';
import { paintFerrariCenter, paintFerrariCluster } from './screens.js';

const BASE = import.meta.env.BASE_URL;
const SRC = 'Ferrari_PortofinoRewardRecycled_2018'; // source material names

// 2018 Ferrari Portofino. Model built by src/cars/portofino/prep.mjs + convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'portofino',
  order: 11,
  label: 'Ferrari Portofino',
  make: 'FERRARI',
  model: 'PORTOFINO',
  variant: '3.9 V8 Twin-Turbo · 600 CV',
  aliases: ['ferrari', 'portofino'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  // The garage's fastest car (320 km/h) and the dearest; rear-drive, so it leaves the line a
  // touch behind the four-wheel-drive M4, and it turns less sharply than the 911
  price: 60000,
  performance: { topSpeed: 320, power: 1.12, traction: 0.98, handling: 1.06, braking: 1.08, upgradeCost: 1.55 },
  // F154 3.9 twin-turbo V8 (flat-plane crank), 7-speed dual-clutch, rear-wheel drive, 285/35 R20
  drivetrain: { gears: [3.08, 2.19, 1.63, 1.29, 1.03, 0.84, 0.69], finalDrive: 3.9, wheelCircumference: 2.12, idleRpm: 750, redline: 7500, cruiseShiftRpm: 2300, shiftSec: 0.2, cylinders: 8, insulation: 0.4, turbo: 1.6, crackle: 0.7, brakeShiftRpm: 3000, engineSound: 'v8' },
  chassis: { layout: 'rwd', mass: 1664, roll: 0.6, pitch: 0.6 },
  // The upload we have ("007", labelled CC BY) re-posts Ddiaz Design's model triangle for
  // triangle; the original is CC BY-NC-SA, so that is what we credit and abide by
  credit: {
    title: '2018 Ferrari Portofino',
    url: 'https://sketchfab.com/3d-models/2018-ferrari-portofino-4c71e8ff9c5a437c8e414bd71395d38b',
    author: 'Ddiaz Design',
    license: 'CC BY-NC-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    note: '(239 bin üçgenden 60 bine optimize edildi, 3D kokpit ayrıldı)',
  },

  exterior: {
    url: `${BASE}models/portofino.glb`,
    length: 4.586,
    // Number plates (src/cars/plate.js), metres above the ground: the rear bumper's recess
    // (ray-measured 0.50-0.67) and the plate mount under the grille
    plate: { front: { y: 0.36 }, rear: { y: 0.58 } },
    // The glow mask lights the thin LED strip at full strength: dimmer than the default so the
    // strip reads as a lamp, not a white line
    head: { day: 0.22, night: 0.6, highBeam: 1.6 },
    tail: { day: 0.35, night: 0.9, brake: 2.2 },
    rims: { materials: ['wheel'], tyres: ['wheel'], reach: 0.77 }, // rim and tyre share one material: stop at the rim's lip
    // Lamp bodies keep their texture; the emissive mask from the source's glow layer
    // (prep.mjs) lights only the LED strips and bulbs
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, box: 'head' },
      { match: /^tailLight$/, role: 'tail', emissive: 0xff1428, box: 'tail' },
      { match: /^tailLens$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, box: 'tail' },
    ],
    glow: {
      // The headLight box runs back along the wings (side repeaters) and put the halo off the
      // car's corner; ray-measured lamp face: x 0.46-0.80, 0.58-0.76 m up
      front: { color: 0xe4eeff, opacity: 0.6, size: [0.6, 0.3], at: [0.64, 0.65, -1.95], offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.7, size: [1.8, 1.0], offset: 0.1 },
      // The tail material also covers the bumper reflectors; ray-measured round lamp: x 0.68-0.84,
      // 0.76-0.90 m up
      rear: { color: 0xff2032, opacity: 0.7, size: [0.4, 0.3], at: [0.76, 0.83, 2.05], offset: 0.06 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/portofino-cockpit.glb`,
    cluster: 'ferrari',
    scale: 1,
    defaultEye: [-0.369, 1.06, 0.494],
    wheelRadius: 0.17,
    steerSign: -1,
    softMaterials: new Set([]),
    // Black leather over the dash, pillars, console and seats; carpet on the floor (prep.mjs); the
    // footrest, pedals and sill plates in dark satin metal
    finishes: {
      [`${SRC}Coloured_Material`]: 'leather',
      [`${SRC}InteriorTillingA_Material`]: 'leather', // perforated inserts
      [`${SRC}InteriorTillingColourZoneA_Material`]: 'plastic',
      [`${SRC}Base_Material`]: 'plastic',
      [`${SRC}InteriorA_Material`]: { roughness: 0.6 },
      [`${SRC}InteriorA_MaterialMetal`]: { roughness: 0.45, metalness: 0.35 },
      [`${SRC}Carbon2_Material`]: { roughness: 0.3 },
      Carpet: 'fabric',
      VentChrome: 'satin',
      VentPlastic: { roughness: 0.45, metalness: 0.2 },
    },
    paintMaterials: new Set(['Ferrari_PortofinoRewardRecycled_2018Paint_Material']), // bonnet and wings through the glass
    screens: {
      // The whole binnacle face (two side screens round the centre dial), 4 mm in front of its
      // front-most edges; ray-measured with the wheel hidden. It reaches up to 0.93 so it covers
      // the model's own static dial inside the carbon ring (the wheel rim hides the top edge)
      cluster: {
        tl: [-0.547, 0.93, -0.3372],
        tr: [-0.195, 0.93, -0.3372],
        bl: [-0.547, 0.812, -0.319],
        br: [-0.195, 0.812, -0.319],
        n: [0, 0.152, 0.988],
        logical: [240, 80],
        px: [1024, 341],
      },
      // The dash touchscreen: the glass triangles of the cabin atlas (u > 0.95) on its plane,
      // 3 mm in front
      center: {
        tl: [-0.138, 0.803, -0.179],
        tr: [0.168, 0.807, -0.164],
        bl: [-0.138, 0.679, -0.148],
        br: [0.168, 0.683, -0.134],
        n: [-0.05, 0.24, 0.97],
        logical: [240, 100],
        px: [1024, 427],
      },
    },
    // Ferrari's own displays (screens.js): yellow rev counter in the ring, map and radio
    screenPainters: { cluster: paintFerrariCluster, center: paintFerrariCenter },
    ledPaths: [],
    // Windshield slope measured on the source glass (base y 0.90 / z -0.62, top y 1.19 / z 0.02);
    // pivots just under its base
    glassOut: new THREE.Vector3(0, 0.91, -0.414).normalize(),
    glassUp: new THREE.Vector3(0, 0.414, 0.91).normalize(),
    wiperPivots: [[-0.45, 0.885, -0.64], [0.05, 0.885, -0.66]],
    wiperLen: 0.55,
    floor: null,
    // The model is lit without shadows: darken the footwell and lower door cards by height
    occlusion: { y0: 0.2, y1: 0.85, min: 0.35 },
  },
};
