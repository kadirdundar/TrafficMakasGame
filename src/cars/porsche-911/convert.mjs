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
};
