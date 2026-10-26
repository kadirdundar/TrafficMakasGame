import * as THREE from 'three';
import { paintBmwClimateRow, paintBmwDoorLocks, paintBmwRoundel } from './painters.js';

const BASE = import.meta.env.BASE_URL;

// BMW M4 CS (G82, VR46 Edition). Models built by tools/convert-m4.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'm4',
  order: 2,
  label: 'BMW M4 CS',
  make: 'BMW',
  model: 'M4 CS',
  variant: 'G82 · VR46 Edition',
  aliases: ['bmw'],
  // New version only (garage price in coins, stats): src/cars/README.md → performance
  price: 15000,
  performance: { topSpeed: 290, power: 1.06, traction: 1.0, handling: 1.08, braking: 1.05, upgradeCost: 1.25 },
  credit: {
    title: '2025 BMW M4 CS VR46 Edition',
    url: 'https://sketchfab.com/3d-models/2025-bmw-m4-cs-vr46-edition-3d111a7ed0f544bc9215e3038db4c8dc',
    author: "BMW'S Lost Proxy",
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '(dış model ve kokpit olarak ayrıldı, sıkıştırıldı)',
  },

  exterior: {
    url: `${BASE}models/bmw-m4.glb`,
    length: 4.8,
    envMapIntensity: 0.25,
    metalness: 0.18,
    roughness: 0.68,
    clearcoat: 0.04,
    clearcoatRoughness: 0.65,
    head: { day: 0.5, night: 1.8, highBeam: 3.5 },
    tail: { day: 0.35, night: 1.2, brake: 3.2 },
    lamps: [{ match: /^emissive$/, role: 'head', emissive: 0xffffff, intensity: 0.5 }],
    // Lamp positions measured on the model (laser headlights / OLED taillights)
    glow: {
      front: { color: 0xffea70, opacity: 0.95, size: [0.95, 0.45], at: [0.68, 0.65, -2.25], offset: 0.05 },
      flare: { color: 0xfff4c0, opacity: 0.95, size: [2.4, 1.3], offset: 0.08 },
      rear: { color: 0xff182c, opacity: 0.85, size: [0.85, 0.45], at: [0.68, 0.72, 2.25], offset: 0.05 },
    },
  },

  cockpit: {
    modelUrl: `${BASE}models/bmw-m4-cockpit.glb`,
    cluster: 'bmw',
    scale: 1.0,
    defaultEye: [-0.375, 1.14, 0.185],
    wheelRadius: 0.185,
    steerSign: -1,
    softMaterials: new Set([
      'm4car_interior1.007',
      'm4car_interior1.008',
      'BMW_M4CSLRewardRecycled_2022InteriorA_Material.011',
      'm4car_plast1.005',
    ]),
    // Hood seen through the windshield: dark metallic paint instead of the pale livery atlas
    paintMaterials: new Set(['m4car_hood1.006']),
    screens: {
      // Measured on the model's own cluster glass (curved, so the quad sits just in front of it)
      cluster: {
        tl: [-0.524, 0.98, -0.588],
        tr: [-0.207, 0.98, -0.588],
        bl: [-0.524, 0.863, -0.561],
        br: [-0.207, 0.863, -0.561],
        n: [0, 0.19, 0.98],
        logical: [240, 90],
        px: [1024, 384],
      },
    },
    // The strips painted in the model's atlas are split into the 'ambient_led' mesh offline
    ledPaths: [],
    glassOut: new THREE.Vector3(0, 0.82, -0.57).normalize(),
    glassUp: new THREE.Vector3(0, 0.57, 0.82).normalize(),
    wiperPivots: [[-0.42, 0.78, -1.02], [0.15, 0.78, -1.05]],
    wiperLen: 0.65,
    floor: null,
    cabinNightGlow: 0.12,
    // Fake cabin occlusion: the model is lit without shadows, so the footwell and lower door
    // cards would be as bright as the dashboard top. Darken by model-space height instead.
    occlusion: { y0: 0.3, y1: 0.95, min: 0.3 },
    // Atlas areas too small to read from the seat, redrawn sharp (UV boxes measured on the atlas)
    atlasPatches: [
      {
        meshes: ['Object_62'],
        uv: [0.292, 0.389, 0.911, 0.932],
        scale: 10,
        background: false,
        flipV: true,
        surface: { roughness: 0.3, metalness: 0.25 },
        paint: paintBmwClimateRow,
      },
      {
        meshes: ['Object_86', 'Object_93'],
        uv: [0.19, 0.32, 0.185, 0.226],
        scale: 6,
        paint: paintBmwDoorLocks,
      },
      {
        meshes: ['steering_wheel'],
        material: 'm4car_interior1.008',
        uv: [0.905, 1, 0.122, 0.219],
        scale: 5.5,
        background: false,
        project: { axis: [0.005, 0.368, 0.93] },
        // Pulled forward in depth: the airbag cover is coplanar with the badge edge
        surface: { roughness: 0.25, metalness: 0.35, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 },
        paint: paintBmwRoundel,
      },
    ],
    // Door opener levers (one 131-triangle piece per door card), in satin aluminium
    satinPieces: [
      ['Object_86', [-0.7065, 0.855, -0.435]],
      ['Object_93', [0.7065, 0.855, -0.435]],
    ],
  },
};
