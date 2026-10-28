// How tools/convert-car.mjs builds corolla's GLBs.   npm run car:convert -- corolla
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/2014_toyota_corolla_e180_eu_with_interior.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=corolla
export default {
  source: 'model-kaynak/2014_toyota_corolla_e180_eu_with_interior.glb',
  // 2014 Corolla E180 sedan (EU): 4.62 m. The source faces +Z.
  transform: { rotateY: 180, length: 4.62 },
  dropNodes: [/^Plane\./], // Sketchfab backdrop planes

  exterior: {
    out: 'public/models/corolla.glb',
    // The headlamp reflectors share the chrome material with the rims and trim
    assignNodeMaterials: [
      { node: 'corolla_e180_frontlights_main_paint_0', materialName: 'headLight' },
      { node: 'corolla_e180_frontlights_klosz_0', materialName: 'headLens' },
    ],
    renameMaterials: [
      [/^main_paint\.001$/, 'paint'],
      [/^main_paint$/, 'chrome'],
      [/^Material\.004$/, 'glass'],
      [/^Material\.005$/, 'tailLight'],
      [/^Material\.003$/, 'tailLens'],
      [/^(tyre_side|Material\.011)$/, 'tire'],
      [/^plastic1$/, 'black_matt'],
    ],
    // Cabin: dash, seats, wheel, headliner (the dark shell behind the windows stays)
    dropNodes: [
      /^corolla_e180_(interior1|furniture|interior_front|dashboard|steering_wheel)/,
      /^corolla_e180_body_(fabric_high|car_plastic_grainy_gray)_0$/,
    ],
    mergeMaterials: [
      [/^(Material\.008|Material\.013|invisible_dark)$/, 'black_matt'],
    ],
    materials: [
      [/^black_matt$/, { color: [0.02, 0.02, 0.02], metallic: 0.1, roughness: 0.8 }],
      [/^chrome$/, { color: [0.75, 0.75, 0.76], metallic: 0.9, roughness: 0.2 }],
      [/^headLens$/, { color: [0.9, 0.9, 0.9], alpha: 0.2, metallic: 0, roughness: 0.05 }],
      [/^klosz$/, { color: [0.6, 0.6, 0.6], alpha: 0.35, metallic: 0, roughness: 0.05 }],
      [/^headLight$/, { color: [0.95, 0.95, 1.0], metallic: 0.6, roughness: 0.15 }],
      [/^tailLight$/, { color: [0.5, 0.02, 0.02], metallic: 0.3, roughness: 0.15 }],
    ],
    cleanAttributes: true,
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/corolla-cockpit.glb',
    // Seen from the eye (lab.html → "Gözden görünen parçalar"); windshield left out
    keepNodes: [
      'corolla_e180_body_fabric_high_0', // headliner
      'corolla_e180_body_plastic1_0', // window frames, pillars outside
      'corolla_e180_body_car_plastic_grainy_gray_0', // pillar trims
      'corolla_e180_body_main_paint.001_0', // hood and fenders through the windshield
      'corolla_e180_body_miror_0', // wing mirror glass (both sides)
      'corolla_e180_interior1_dark_plastic_grainy_0',
      'corolla_e180_interior1_car_plastic_grainy_gray_0',
      'corolla_e180_interior1_carpet.002_0',
      'corolla_e180_interior1_main_paint_0',
      'corolla_e180_interior1_klosz_0', // dome light
      'corolla_e180_interior1_fabric_high_0',
      'corolla_e180_interior1_belts_0',
      'corolla_e180_interior1_miror_0', // rear-view mirror glass
      'corolla_e180_interior1_plastic1_0',
      'corolla_e180_furniture_leather_0',
      'corolla_e180_furniture_seat_fabric_0',
      'corolla_e180_furniture_dark_plastic_grainy_0',
      'corolla_e180_furniture_Material.019_0',
      'corolla_e180_furniture_main_paint_0',
      'corolla_e180_interior_front_dark_plastic_grainy_0',
      'corolla_e180_interior_front_main_paint_0',
      'corolla_e180_interior_front_speaker_0',
      'corolla_e180_dashboard_dark_plastic_grainy_0',
      'corolla_e180_dashboard_main_paint_0',
      'corolla_e180_dashboard_M_dashboard.001_0', // dial face behind the live cluster (needles and the small screen are left out)
      'corolla_e180_dashboard_speaker_0',
      'corolla_e180_dashboard_plastic1_0',
      'corolla_e180_dashboard_invisible_dark_0',
      'corolla_e180_dashboard.001_M_dashboard_0',
      'corolla_e180_dashboard.001_main_paint_0',
      'corolla_e180_dashboard.001_screen_0',
      'corolla_e180_dashboard.001_Material.021_0',
      'corolla_e180_dashboard.001_Material.026_0',
      'corolla_e180_dashboard.001_Material.020_0',
      'corolla_e180_steering_wheel_M_Steering_wheel_0',
      'corolla_e180_steering_wheel_main_paint_0',
      'corolla_e180_steering_wheel_plastic1_0',
    ],
    eye: [-0.382, 1.152, -0.066],
    // Hub and column axis from the rim's best-fit plane (lab.html)
    steering: { node: 'corolla_e180_steering_wheel_M_Steering_wheel_0', pivot: [-0.382, 0.892, -0.586], axis: [0, 0.229, 0.973], radius: 0.21, columnBeyondZ: -0.756 },
    wheelTrim: { from: '*', radius: 0.215, axial: [-0.08, 0.04] },
    mirrors: [
      { name: 'mirror_left', from: 'corolla_e180_body_miror_0', x: [-1.3, -0.5] },
      { name: 'mirror_right', from: 'corolla_e180_body_miror_0', x: [0.5, 1.3] },
      { name: 'mirror_center', from: 'corolla_e180_interior1_miror_0' },
    ],
    // The cabin chrome (door handles, vent rings) glares white at full brightness
    materials: [[/^main_paint$/, { color: [0.26, 0.26, 0.27], metallic: 0.8, roughness: 0.42 }]],
    join: true,
    cleanAttributes: true,
    simplify: { targetTris: 65000, maxError: 0.006, excludeNodes: ['steering_wheel'] },
    maxTextureSize: 1024,
    // Tiling grain / weave maps repeat many times over a panel: small copies look the same
    textureSizes: [[/^(fabric_high|carpet\.002|belts|car_plastic_grainy_gray|dark_plastic_grainy|speaker|leather)$/, 256], [/^seat_fabric$/, 512]],
    webpQuality: 90,
    compress: true,
  },
};
