// How tools/convert-car.mjs builds linea's GLBs.   npm run car:convert -- linea
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/fiat_linea.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=linea
export default {
  source: 'model-kaynak/fiat_linea.glb',
  // 2013 Fiat Linea (facelift) sedan: 4.56 m. The source already faces -Z.
  transform: { rotateY: 0, length: 4.56 },
  dropNodes: [/^Plane\./], // Sketchfab backdrop planes

  exterior: {
    out: 'public/models/linea.glb',
    // The tyres share the dark textured trim material with the window frames and underbody
    assignNodeMaterials: [
      { node: /^wheel(\.00\d)?_hidrovacuo\.1_0$/, materialName: 'tire' },
    ],
    renameMaterials: [
      [/^primary$/, 'paint'],
      [/^glass\.002$/, 'glass'],
      [/^glass$/, 'headLens'], // headlamp cover
      [/^(right|left)_front_light$/, 'headLight'], // headlamps and fog lamps
      [/^right_rear_light(\.001)?$/, 'tailLight'], // reflectors inside the rear lamps
      [/^bump_rear_ok\.5$/, 'tailLens'], // red lamp lenses
      [/^hidrovacuo\.0$/, 'chrome'],
      [/^hidrovacuo\.1$/, 'black_matt'],
      [/^wheel\.[234]$/, 'rim'],
      [/^material_14$/, 'cabin'], // door cards, floor and pillar trims
    ],
    // Engine bay, underbody, belts and the small cabin bits nobody sees through the glass
    dropNodes: [
      /^(motor1|motor2|motor2\.001|caixa1|caixa2|bloco1|bloco2|carter|hidrovacuo|suspensao|emniyetkemeri)_/,
      /^(engine|ped_frontseat|ped_backseat|ped_arm)_exhaust/,
      /^i_(right front light|hidrovacuo\.0|motor2\.1|i\.5|i\.8|i\.9|i\.10|i\.11|\.0)_/,
      // Seats, dash and wheel: the dark cabin shell behind the tinted glass is enough
      /^(koltuk1|koltuk2|volante)_/,
      /^plaka /, // the model's own front plate ("34 CEM 34"); the game fits its own plates
    ],
    mergeMaterials: [
      [/^rim$/, 'rim'],
      [/^(material_1|material_3|bump_rear_ok\.3|bump_rear_ok\.4|wing_lf_ok\.9|motor2\.2|motor2\.3)$/, 'black_matt'],
      [/^(material|boot_ok\.5|exhaust\.0|material_2|wing_lf_ok\.7)$/, 'chrome'],
      [/^(cabin|material_13|interior)$/, 'cabin'],
    ],
    materials: [
      [/^glass$/, { color: [0.02, 0.025, 0.03], alpha: 0.55, metallic: 0, roughness: 0.05 }],
      [/^headLens$/, { color: [0.9, 0.9, 0.9], alpha: 0.18, metallic: 0, roughness: 0.05 }],
      [/^tailLens$/, { color: [0.6, 0.01, 0.01], alpha: 0.85, metallic: 0, roughness: 0.08 }],
      [/^tire$/, { color: [0.03, 0.03, 0.03], metallic: 0, roughness: 0.9 }],
      [/^cabin$/, { color: [0.025, 0.025, 0.027], metallic: 0, roughness: 0.9 }],
      [/^black_matt$/, { color: [0.03, 0.03, 0.03], metallic: 0.1, roughness: 0.8 }],
      [/^chrome$/, { color: [0.72, 0.72, 0.73], metallic: 0.9, roughness: 0.18 }],
      [/^rim$/, { color: [0.62, 0.63, 0.64], metallic: 0.85, roughness: 0.28 }],
    ],
    cleanAttributes: true,
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/linea-cockpit.glb',
    // Seen from the eye (lab.html → "Gözden görünen parçalar"); windshield and side glass left out
    keepNodes: [
      'wing_rf_ok_i.6_0', // pillar trims, headliner edge, door shuts
      'wing_rf_ok_i.7_0', // floor and lower cabin shell
      'wing_rf_ok_hidrovacuo.1_0', // window frames
      'wing_rf_ok_hidrovacuo.0_0',
      'wing_rf_ok_primary_0', // roof and body seen through the side glass
      'i_interior_0', // headliner
      'i_i.11_0', // dashboard
      'i_i.5_0', // cluster hood, cluster glass, centre console
      'i_i.6_0',
      'i_i.7_0',
      'i_i.8_0',
      'i_hidrovacuo.1_0',
      'i_motor2.1_0',
      'i_.0_0', // rear-view mirror glass
      'koltuk1_i.5_0', // seats
      'koltuk2_i.5_0',
      'emniyetkemeri_emniyetkemeri.0_0', // belts
      'emniyetkemeri_emniyetkemeri.1_0',
      'volante_i.11_0', // steering wheel rim and spokes
      'volante_volante.2_0',
      'volante_hidrovacuo.0_0',
      'volante_hidrovacuo.1_0',
      'door_lf_ok_i.6_0', 'door_lf_ok_i.7_0', 'door_lf_ok_primary_0', 'door_lf_ok_hidrovacuo.0_0',
      'door_rf_ok_i.6_0', 'door_rf_ok_i.7_0', 'door_rf_ok_primary_0', 'door_rf_ok_hidrovacuo.0_0',
      'door_rr_ok_i.6_0', 'door_rr_ok_i.7_0', 'door_rr_ok_primary_0', 'door_rr_ok_hidrovacuo.1_0',
      'door_lr_ok_i.7_0', 'door_lr_ok_primary_0',
    ],
    // Hub and column axis from the rim's vertices (best-fit plane, volante_i.11 bounds);
    // the eye 0.52 m behind and 0.26 m above the hub (recipe §5.1)
    eye: [-0.396, 0.554, -0.072],
    steering: { node: 'volante_i.11_0', pivot: [-0.396, 0.294, -0.592], axis: [0, 0.265, 0.964], radius: 0.19, columnBeyondZ: -0.76 },
    // The flat cluster glass sits 0.13-0.16 m in front of the hub, inside the disc radius:
    // keep the axial window short so it stays put
    wheelTrim: { from: '*', radius: 0.22, axial: [-0.11, 0.06] }, // the horn pad stands 4 cm proud of the rim
    // Wing-mirror glass: the rearward-facing chrome triangles at the outer end of each door's
    // chrome mesh; the rear-view mirror is its own little mesh
    mirrors: [
      { name: 'mirror_left', from: 'door_lf_ok_hidrovacuo.0_0', x: [-1.02, -0.84], y: [0.33, 0.48], facing: [0.45, 0, 1] },
      { name: 'mirror_right', from: 'door_rf_ok_hidrovacuo.0_0', x: [0.84, 1.02], y: [0.33, 0.48], facing: [-0.45, 0, 1] },
      { name: 'mirror_center', from: 'i_.0_0', facing: [0, -0.2, 1] },
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
