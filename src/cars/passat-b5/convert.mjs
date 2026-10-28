// How tools/convert-car.mjs builds passat-b5's GLBs.   npm run car:convert -- passat-b5
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/volkswagen_passat_b5.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=passat-b5
export default {
  source: 'model-kaynak/volkswagen_passat_b5.glb',
  // Passat B5 sedan length: 4.70 m. The source faces +Z: rotateY 180 points the nose to -Z.
  transform: { rotateY: 180, length: 4.7 },
  // Collision box and a stray lamp mesh spanning half the car (would skew the length scale)
  dropNodes: [/^Plane\./, 'COLIDER__0', /^FaraBackLeftMesh/],

  exterior: {
    out: 'public/models/passat-b5.glb',
    // Lamp glass and tyres share materials with the cabin / body: give those nodes their own
    assignNodeMaterials: [
      { node: /^GlassFaraFront(Left|Right)\d_front_0$/, materialName: 'headLight' },
      { node: /^(FL_black_0|FR_black\.004_0|RL_black\.002_0|RR_black\.003_0)$/, materialName: 'tire' },
    ],
    renameMaterials: [
      [/^primary$/, 'paint'],
      [/^window$/, 'glass'],
      [/^brake$/, 'tailLight'],
      [/^body2(\.00\d)?$/, 'rim'],
      [/^(left|right|reverse)$/, 'reverse'], // rear indicators and reverse lamps (not lit)
      [/^(left|right)\.001$/, 'indicator'],
      [/^zerkalo[LR]$/, 'mirror'],
    ],
    // Cabin, engine bay, cluster digits and the 1–2 triangle fragments on the windows
    dropNodes: [
      /^EngineMesh_/, /^SteeringWheel_/, /^steeringwheel2_/, /^FaraFrontLeftMesh1_/,
      /_dsp_min2\.0_0$/, /^(arrow|lamp)[A-Z]\w*_dashboard/, /^(petrolok|temperature)_/,
      /^Door\w+Mesh_(interior\.\d|front|door_lr_ok\.\d|chassis\.0)_0$/,
    ],
    // ≤ 15 draw calls: look-alike dark trims, silver trims, lamp lenses and mirror glass
    mergeMaterials: [
      [/^tire$/, 'tire'],
      [/^chassis\.0(03|09|10|11)$/, 'tire'],
      [/^rim$/, 'rim'],
      [/^(chrome\.00\d|chassis\.[18])$/, 'chrome'],
      [/^(chassis\.[4-7]|BlackPlastic|primary\.001|MaterialColors)$/, 'black'],
      [/^reverse$/, 'reverse'],
      [/^indicator$/, 'indicator'],
      [/^mirror$/, 'mirror'],
    ],
    materials: [
      [/^glass$/, { color: [0.02, 0.025, 0.03], alpha: 0.55, metallic: 0, roughness: 0.05 }],
      [/^tire$/, { color: [0.03, 0.03, 0.03], metallic: 0, roughness: 0.9 }],
      [/^rim$/, { color: [0.6, 0.62, 0.62], metallic: 0.85, roughness: 0.3 }],
      [/^chrome$/, { color: [0.7, 0.7, 0.7], metallic: 0.9, roughness: 0.15 }],
      // Same rear-lamp texture as the brake light: a differing factor keeps dedup from merging
      // the reverse lamps and indicators into tailLight (they would light up red)
      [/^reverse$/, { roughness: 0.1 }],
      [/^mirror$/, { color: [0.8, 0.82, 0.85], metallic: 1, roughness: 0.05 }],
    ],
    cleanAttributes: true,
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/passat-b5-cockpit.glb',
    // Seen from the driver's seat (lab → "Gözden görünen parçalar"); the source's own cluster
    // digits, needles and warning lamps are left out: the live cluster screen replaces them
    keepNodes: [
      'EngineMesh_interior.4_0', // dashboard, headliner, pillars
      'EngineMesh_interior.5_0', // seats
      'EngineMesh_interior.7_0', // floor, console, door sills
      'EngineMesh_interior.6_0',
      'EngineMesh_interior.10_0',
      'EngineMesh_chassis.2_0', // cabin shell
      'EngineMesh_chassis.7_0',
      'EngineMesh_chrome_0',
      'EngineMesh_front_0', // cluster glass and dials
      'BodyMesh_chassis.2_0', // body shell around the cabin
      'BodyMesh_primary_0', // painted body seen through the glass
      'BodyMesh_chassis.4_0',
      'BodyMesh_BlackPlastic_0', // cowl
      'HoodMesh_primary_0',
      'FaraFrontLeftMesh1_black_0',
      'FaraFrontLeftMesh1_black.001_0',
      'steeringwheel2_BlackPlastic_0',
      'steeringwheel2_chrome_0',
      'SteeringWheel_interior3_0',
      'DoorFrontLeftMesh_interior.7_0', 'DoorFrontLeftMesh_interior.5_0', 'DoorFrontLeftMesh_chassis.2_0',
      'DoorFrontLeftMesh_chrome_0', 'DoorFrontLeftMesh_primary_0', 'DoorFrontLeftMesh_front_0',
      'DoorFrontRightMesh_interior.7_0', 'DoorFrontRightMesh_interior.5_0', 'DoorFrontRightMesh_chassis.2_0',
      'DoorFrontRightMesh_chrome_0', 'DoorFrontRightMesh_primary_0',
      'DoorBackLeftMesh_interior.7_0', 'DoorBackLeftMesh_interior.5_0', 'DoorBackLeftMesh_chassis.2_0',
      'DoorBackRightMesh_interior.7_0', 'DoorBackRightMesh_interior.5_0', 'DoorBackRightMesh_chassis.2_0',
      'MirrorLeftMesh_zerkaloL_0', 'MirrorLeftMesh_primary_0', 'MirrorLeftMesh_chassis.2_0',
      'MirrorRightMesh_zerkaloR_0', 'MirrorRightMesh_primary_0', 'MirrorRightMesh_chassis.2_0',
    ],
    eye: [-0.37, 0.367, 0.057],
    steering: { node: 'steeringwheel2_BlackPlastic_0', pivot: [-0.37, 0.107, -0.493], axis: [0, 0.372, 0.928], radius: 0.18, maxPieceDistance: 0.2 },
    wheelTrim: { from: '*', radius: 0.2, axial: [-0.1, 0.08] },
    mirrors: [
      { name: 'mirror_left', from: 'MirrorLeftMesh_zerkaloL_0' },
      { name: 'mirror_right', from: 'MirrorRightMesh_zerkaloR_0' },
      { name: 'mirror_center', from: 'EngineMesh_chrome_0', x: [-0.2, 0.2], y: [0.4, 0.53], z: [-0.6, -0.45], facing: [0, -0.1, 1] },
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
