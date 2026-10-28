// How tools/convert-car.mjs builds passat-b8's GLBs.   npm run car:convert -- passat-b8
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/volkswagen_passat_b8.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=passat-b8
export default {
  source: 'model-kaynak/volkswagen_passat_b8.glb',
  // VW Passat B8 length: 4.77 m. The source faces +Z: rotateY 180 points the nose to -Z.
  transform: { rotateY: 180, length: 4.77 },
  dropNodes: [/^COLIDER/], // collision box of the source game

  exterior: {
    out: 'public/models/passat-b8.glb',
    // Tyres share the black 'negru' with the body trim: give them their own material first
    assignNodeMaterials: [
      { node: /^(FL|FR|RL|RR)_negru_0$/, materialName: 'tire' },
    ],
    renameMaterials: [
      [/^primary$/, 'paint'],
      [/^glass$/, 'glass'],
      [/^chrome$/, 'chrome'],
      [/^negru$/, 'black'],
      [/^front$/, 'headLight'], // projector lenses + fog lamps
      [/^(left|right)$/, 'headLightDrl'], // LED strips under the headlights, mirror repeaters
      [/^back$/, 'tailLight'],
      [/^oglinzi$/, 'mirrorGlass'],
      [/^rims$/, 'rim'],
    ],
    // Cabin (dashboard, seats, steering wheel) stays out of the exterior; the tinted glass hides it
    dropNodes: [/^passatb8\.(005|010|015)/],
    materials: [
      [/^black$/, { color: [0.02, 0.02, 0.022], metallic: 0.1, roughness: 0.5 }],
      [/^tire$/, { color: [0.03, 0.03, 0.03], metallic: 0.0, roughness: 0.9 }],
      [/^chrome$/, { color: [0.8, 0.8, 0.82], metallic: 0.9, roughness: 0.15 }],
      [/^rim$/, { color: [0.62, 0.63, 0.65], metallic: 0.85, roughness: 0.28 }],
      [/^glass$/, { color: [0.0, 0.0, 0.0], alpha: 0.62, metallic: 0.0, roughness: 0.05 }],
      [/^headLight$/, { color: [0.9, 0.92, 0.95], metallic: 0.1, roughness: 0.1 }],
      [/^headLightDrl$/, { color: [0.9, 0.9, 0.9], metallic: 0.1, roughness: 0.2 }],
      [/^tailLight$/, { color: [0.45, 0.01, 0.01], metallic: 0.1, roughness: 0.15 }],
      [/^mirrorGlass$/, { color: [0.6, 0.62, 0.65], metallic: 0.9, roughness: 0.05 }],
    ],
    cleanAttributes: true,
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/passat-b8-cockpit.glb',
    keepNodes: [
      'passatb8.005_interior_0', // dashboard, console, seats, door cards
      'passatb8.006_negru_0', // black trim: headliner, pillars, dash top, mirror housings
      'passatb8.003_primary_0', // painted body: hood, door frames, roof
      'passatb8.004_chrome_0', // chrome trims
      'passatb8.010_interior.002_0', // textured details
      'passatb8.011_oglinzi_0', // mirror glasses
      'passatb8.015_interior_0', // steering wheel
      'passatb8.015_chrome_0', // steering wheel chrome and badge
    ],
    eye: [-0.376, 0.524, 0.065],
    steering: { node: 'passatb8.015_interior_0', pivot: [-0.376, 0.264, -0.455], axis: [0, 0.408, 0.913], radius: 0.187 },
    wheelTrim: { from: ['passatb8.015_chrome_0'], radius: 0.2, axial: [-0.13, 0.04] },
    mirrors: [
      { name: 'mirror_left', from: 'passatb8.011_oglinzi_0', x: [-1.1, -0.8] },
      { name: 'mirror_right', from: 'passatb8.011_oglinzi_0', x: [0.8, 1.1] },
      { name: 'mirror_center', from: 'passatb8.011_oglinzi_0', x: [-0.2, 0.2] },
    ],
    materials: [],
    join: true,
    cleanAttributes: true,
    simplify: { targetTris: 65000, maxError: 0.006, excludeNodes: ['steering_wheel'] },
    maxTextureSize: 1024,
    webpQuality: 90,
    compress: true,
  },
};
