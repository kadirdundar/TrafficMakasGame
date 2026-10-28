// How tools/convert-car.mjs builds focus's GLBs.   npm run car:convert -- focus
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/ford_focus_sedan.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=focus
export default {
  source: 'model-kaynak/ford_focus_sedan.prep.glb', // node src/cars/focus/prep.mjs (raw: ford_focus_sedan.glb)
  transform: { rotateY: 0, length: 4.48 }, // Ford Focus II sedan: 4.48 m; nose already at -Z
  dropNodes: [/^Plane_/], // Sketchfab arka plan düzlemi

  exterior: {
    out: 'public/models/focus.glb',
    // Mirror turn signals share the headlight material: keep them out of the headlights
    assignNodeMaterials: [
      { node: /^Object\.00[24]_right front light_0$/, materialName: 'mirrorSignal' },
      // Tyres share black.0 with the trims; their own material lets the rim paint find the wheels
      { node: /^wheel(\.00\d)?_black\.0_0$/, materialName: 'tire' },
    ],
    renameMaterials: [
      [/^primary$/, 'paint'],
      [/^glass$/, 'glass'],
      [/^right_front_light$/, 'headLight'],
      [/^right_rear_light$/, 'tailLight'],
      [/^zad_far\.1$/, 'tailLightInner'],
      [/^material$/, 'tailLens'],
      [/^Salon\.0$/, 'chrome'],
      [/^black\.0$/, 'black_matt'],
      [/^wheel\.1$/, 'rim'],
    ],
    // Cabin, steering wheel and door cards: the tinted glass hides them from outside
    dropNodes: [
      /^Salon_/,
      /^dno_(Salon|interior)/,
      /^Object\.00[2-5]_(interior|Salon\.5)/,
    ],
    materials: [
      [/^black_matt$/, { color: [0.03, 0.03, 0.03], metallic: 0.1, roughness: 0.8 }],
      [/^chrome$/, { color: [0.75, 0.75, 0.77], metallic: 0.9, roughness: 0.2 }],
      [/^tire$/, { color: [0.025, 0.025, 0.025], metallic: 0.0, roughness: 0.9 }],
      [/^rim$/, { color: [0.3, 0.31, 0.33], metallic: 0.85, roughness: 0.32 }],
      // Same atlas as the headlights: a tint keeps dedup from merging the two lamp materials
      [/^tailLight$/, { color: [0.6, 0.05, 0.05] }],
      [/^glass$/, { color: [0.01, 0.012, 0.015], alpha: 0.72, roughness: 0.05, metallic: 0.0 }],
      [/^mirrorSignal$/, { color: [0.9, 0.35, 0.02], roughness: 0.2, metallic: 0.1 }],
    ],
    cleanAttributes: true,
    // Bütçe: ≤ 60k üçgen, ~1 MB (tarif §3). Hata her yerde aynı (metre); en küçüğü aranır.
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/focus-cockpit.glb',
    // Seen from the driver's seat (lab → "Gözden görünen parçalar", eye below), plus the hood
    keepNodes: [
      'Salon_Salon.6_0', // headliner, seats, upper dashboard
      'Salon_Salon.5_0', // dashboard and console trim
      'Salon_interior.001_0', // dashboard, console, pillars (textured)
      'Salon_interior_0', // instrument cluster and centre stack
      'Salon_Salon.0_0', // rear-view mirror
      'Salon_Salon.2_0', // cluster dials
      'Salon_Salon.3_0',
      'dno_Salon.6_0', // steering wheel rim
      'dno_interior.001_0', // steering wheel hub and spokes
      'dno_Salon.5_0', // steering wheel trim
      'dno_black.0_0', // floor pan
      'Object.002_primary_0', // front doors: shell, card, trim, frame, mirror
      'Object.002_interior.001_0',
      'Object.002_Salon.5_0',
      'Object.002_black.0_0',
      'Object.002_Salon.0_0',
      'Object.004_primary_0',
      'Object.004_interior.001_0',
      'Object.004_Salon.5_0',
      'Object.004_black.0_0',
      'Object.004_Salon.0_0',
      'Object.005_interior.001_0', // rear doors (seen over the shoulder)
      'Object.005_Salon.5_0',
      'Object.005_black.0_0',
      'black_black.0_0', // window frames and seals
      'pered det_black.0_0', // cowl under the windshield
      'Object_primary_0', // hood
    ],
    eye: [-0.377, 1.16, 0.04], // 0.53 m behind and 0.29 m above the hub: the rim stays under the dials
    steering: { node: 'dno_Salon.6_0', pivot: [-0.377, 0.871, -0.487], axis: [0, 0.392, 0.92], radius: 0.198, columnBeyondZ: -0.66 },
    // Hub, horn pad and the silver spokes sit in other nodes (the spokes in the dashboard's
    // Salon_interior.001_0): every piece inside the disc turns with the rim
    wheelTrim: { from: '*', radius: 0.21, axial: [-0.12, 0.03] },
    mirrors: [
      { name: 'mirror_left', from: 'Object.002_Salon.0_0', facing: [0.3, 0, 0.95] },
      { name: 'mirror_right', from: 'Object.004_Salon.0_0', facing: [-0.3, 0, 0.95] },
      { name: 'mirror_center', from: 'Salon_Salon.0_0', facing: [0, 0, 1] },
    ],
    materials: [],
    join: true, // statik parçaları malzemeye göre birleştir (≤ 30 draw call)
    cleanAttributes: true,
    simplify: { targetTris: 65000, maxError: 0.006, excludeNodes: ['steering_wheel'] },
    maxTextureSize: 1024,
    webpQuality: 90,
    compress: true,
  },
};
