// How tools/convert-car.mjs builds porsche-911's GLBs.   npm run car:convert -- porsche-911
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/porsche-911/source/2021_porsche_911_targa_4s.glb
export default {
  source: 'model-kaynak/porsche-911/source/2021_porsche_911_targa_4s.glb',
  // 2021 Porsche 911 Targa 4S length: 4.52 m. rotateY: 180 points nose to -Z. center: true centers the offset model.
  transform: { rotateY: 180, length: 4.52, center: true },
  dropNodes: [/^Plane\./], // Sketchfab backdrop planes

  exterior: {
    out: 'public/models/porsche-911.glb',
    assignNodeMaterials: [
      { node: /^Object_53$/, materialName: 'tailLight' },
    ],
    renameMaterials: [
      [/^PAINT_COLOR_4$/, 'paint'],
      [/^GLASS_7$/, 'glass'],
      [/^LIGHTS_5$/, 'headLight'],
      [/^tailLight$/, 'tailLight'],
      [/^CHROME_13$/, 'chrome'],
      [/^BADGE_6$/, 'chrome'],
      [/^PLASTI_NEGRO_3$/, 'black_matt'],
      [/^CHASSIS_9$/, 'black_matt'],
      [/^GIRD_1_8$/, 'black_matt'],
      [/^modelSM_SoftTop_000.001SG1_10$/, 'black_matt'],
      [/^modelSM_SoftTop_000.001SG3_11$/, 'glass'],
      [/^CALIPE_COL_15$/, 'caliper'],
      [/^Porsche_911Targa4SRewardRecycled_2021_Wheel1A_3D_3DWheel1B_Material_0$/, 'rim'],
      [/^BL_RIM_1$/, 'tire'],
    ],
    dropNodes: [],
    mergeMaterials: [
      [/^(CHASSIS_9|GIRD_1_8|modelSM_SoftTop_000.001SG1_10|modelSM_RearKit_0000.001SG11_14|modelSM_Root_911_Targa4s.001SG1_2)$/, 'black_matt'],
      [/^BADGE_6$/, 'chrome'],
      [/^modelSM_SoftTop_000.001SG3_11$/, 'glass'],
    ],
    materials: [
      [/^black_matt$/, { color: [0.03, 0.03, 0.03], metallic: 0.1, roughness: 0.8 }],
      [/^chrome$/, { color: [0.85, 0.85, 0.85], metallic: 0.9, roughness: 0.15 }],
      [/^caliper$/, { color: [0.85, 0.05, 0.05], metallic: 0.2, roughness: 0.35 }],
      [/^rim$/, { color: [0.8, 0.8, 0.82], metallic: 0.85, roughness: 0.25 }],
      [/^tire$/, { color: [0.03, 0.03, 0.03], metallic: 0.0, roughness: 0.9 }],
      [/^glass$/, { alpha: 0.38, roughness: 0.05, metallic: 0.0 }],
      [/^headLight$/, { color: [0.95, 0.95, 1.0], roughness: 0.1, metallic: 0.1 }],
      [/^tailLight$/, { color: [0.6, 0.02, 0.02], roughness: 0.15, metallic: 0.1 }],
    ],
    cleanAttributes: true,
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/porsche-911-cockpit.glb',
    keepNodes: [
      'Object_13', // cowl / wiper trough / front inner fenders
      'Object_15', // front fenders & body panels (seals gaps beside hood)
      'Object_28', // roof / targa arch / mirror housings
      'Object_30', // door frames & lower A-pillar
      'Object_37', // roof rail, Targa soft top frame & upper door pillar header
      'Object_40', // dashboard, steering wheel, console, door cards, pedals
      'Object_44', // badges & steering crest
      'Object_46', // leather sports seats
      'Object_49', // A-pillar interior trim & pillar lining
      'Object_51', // A-pillar painted body pillar & roof frame
      'Object_55', // chrome trim
      'Object_64', // center hood lid
      'Object_66', // hood crest
    ],
    eye: [-0.345, 1.01, 0.42],
    steering: {
      node: 'Object_40',
      pivot: [-0.340, 0.789, -0.266],
      axis: [0, 0.32, 0.95],
      radius: 0.18,
      maxPieceDistance: 0.18,
      bezel: {
        center: [-0.340, 0.778, -0.224],
        offset: 0.001,
        radius: 0.0385,
        tubeRadius: 0.0012,
        radialSegments: 64,
        tubularSegments: 12,
        material: 'CHROME_13',
      },
    },
    wheelTrim: {
      from: ['Object_44', 'Object_46'],
      radius: 0.19,
      axial: [-0.08, 0.05],
      shiftUV: { Object_44: [0, 0.428] },
    },
    mirrors: [
      { name: 'mirror_left', from: 'Object_28', uv: [0.95, 1.0, 0.82, 0.86], x: [-1.05, -0.75], y: [0.80, 1.00], z: [-0.40, -0.20], facing: [0.28, -0.15, 0.94] },
      { name: 'mirror_right', from: 'Object_28', uv: [0.95, 1.0, 0.82, 0.86], x: [0.75, 1.05], y: [0.80, 1.00], z: [-0.40, -0.20], facing: [-0.28, -0.15, 0.94] },
      { name: 'mirror_center', from: 'Object_40', x: [-0.15, 0.15], y: [1.08, 1.22], z: [-0.35, -0.20], facing: [-0.18, -0.17, 0.96] },
    ],
    materials: [
      [/^PLASTI_NEGRO_3$/, { color: [0.035, 0.035, 0.038], metallic: 0.1, roughness: 0.75 }],
      [/^INTERIOR_12$/, { color: [0.08, 0.08, 0.085], metallic: 0.05, roughness: 0.65 }],
      [/^BADGE_6$/, { color: [1.0, 1.0, 1.0], metallic: 0.7, roughness: 0.2 }],
      [/^CHROME_13$/, { color: [0.85, 0.85, 0.85], metallic: 0.9, roughness: 0.15 }],
      [/^PAINT_COLOR_4$/, { color: [0.05, 0.05, 0.05], metallic: 0.8, roughness: 0.3 }],
      [/^modelSM_SoftTop_000.001SG3_11$/, { color: [0.035, 0.035, 0.038], metallic: 0.1, roughness: 0.75 }],
    ],
    join: true,
    cleanAttributes: true,
    simplify: { targetTris: 60000, maxError: 0.008, excludeNodes: ['steering_wheel'] },
    maxTextureSize: 1024,
    webpQuality: 90,
    compress: true,
  },
};
