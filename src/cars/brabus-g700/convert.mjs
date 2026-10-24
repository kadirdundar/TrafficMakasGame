// How tools/convert-car.mjs builds brabus-g700's GLBs.   npm run car:convert -- brabus-g700
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/mercedes_brabus_g700_ns.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=brabus-g700
export default {
  source: 'model-kaynak/mercedes_brabus_g700_ns.glb',
  // Kaynak boyutu: x 4.010, y 1.528, z 1.858 (birim). Araç X ekseninde uzanıyor, burun -X'e bakıyor.
  // rotateY -90 ile burun -Z'ye, tavan +Y'ye, sürücü tarafı sol (-X)'e oturur.
  transform: { rotateY: -90, length: 4.87 },
  dropNodes: [/^Plane\./], // Sketchfab arka plan düzlemleri

  exterior: {
    out: 'public/models/brabus-g700.glb',
    renameMaterials: [
      [/^(Vehicle_Exterior_mm_ext|CarPaint)$/, 'paint'],
      [/^(Vehicle_Exterior_mm_windows|2020_Mercedes-AMG_G63_Brabus_G700_Windows|2020_Mercedes-AMG_G63_Brabus_G700_HeadLights_Glass)$/, 'glass'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_HeadLights$/, 'headLight'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_DRLs$/, 'headLightRoof'],
      [/^(2020_Mercedes-AMG_G63_Brabus_G700_BrakeLights|2020_Mercedes-AMG_G63_Brabus_G700_BrakeLights1|2020_Mercedes-AMG_G63_Brabus_G700_BrakeLights2)$/, 'tailLight'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_BrakeLights3$/, 'tailLightRoof'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_BrakeLights_Glass$/, 'tailLens'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_BlackTrim$/, 'black_matt'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_PianoBlack$/, 'black_shiny'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_ChromeSilver$/, 'chrome'],
      [/^Tyre_Side$/, 'tire'],
      [/^MT_15$/, 'rim'],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_Carbon$/, 'carbon'],
    ],
    // İç mekân ve motor parçalarını dış modelden çıkar (performans bütçesi):
    dropNodes: [
      'Object_24', 'Object_36', 'Object_38', 'Object_40', 'Object_42', 'Object_44', 'Object_46', 'Object_64',
      'Object_66', 'Object_68', 'Object_70', 'Object_72', 'Object_74', 'Object_88', 'Object_94', 'Object_108',
      'Object_152', 'Object_174', 'Object_210', 'Object_229', 'Object_241', 'Object_249', 'Object_251', 'Object_253',
      'Object_259', 'Object_271', 'Object_273', 'Object_275', 'Object_285', 'Object_287', 'Object_333', 'Object_335',
      'Object_337', 'Object_339', 'Object_343', 'Object_345', 'Object_347', 'Object_349', 'Object_351', 'Object_353',
      'Object_359', 'Object_361', 'Object_369', 'Object_373', 'Object_379', 'Object_765', 'Object_767', 'Object_769',
      'Object_771', 'Object_773', 'Object_775', 'Object_779', 'Object_781', 'Object_783', 'Object_785', 'Object_787',
      'Object_789', 'Object_791', 'Object_793', 'Object_795', 'Object_797', 'Object_801', 'Object_803', 'Object_805',
      'Object_807',
    ],
    // Dışarıdan benzer görünen malzemeleri birleştir (draw call ≤ 15):
    mergeMaterials: [
      [/^(2020_Mercedes-AMG_G63_Brabus_G700_Black1|2020_Mercedes-AMG_G63_Brabus_G700_Black2|2020_Mercedes-AMG_G63_Brabus_G700_lambert1|2020_Mercedes-AMG_G63_Brabus_G700_UnderCarrier|2020_Mercedes-AMG_G63_Brabus_G700_Wipers|2020_Mercedes-AMG_G63_Brabus_G700_HeadLights2)$/, 'black_matt'],
      [/^(2020_Mercedes-AMG_G63_Brabus_G700_Grille|2020_Mercedes-AMG_G63_Brabus_G700_Rear_Grille)$/, 'black_shiny'],
      [/^(2020_Mercedes-AMG_G63_Brabus_G700_Chrome|2020_Mercedes-AMG_G63_Brabus_G700_Chrome1|2020_Mercedes-AMG_G63_Brabus_G700_Exhausts|2020_Mercedes-AMG_G63_Brabus_G700_SilverSkid|2020_Mercedes-AMG_G63_Brabus_G700_Badges1|2020_Mercedes-AMG_G63_Brabus_G700_Badges2|2020_Mercedes-AMG_G63_Brabus_G700_Keyhole|Color_M03)$/, 'chrome'],
      [/^(Profiel02|pirelli_pzero_255_35_r20_sidewall_2|ADVAN_Neova_AD08-2)$/, 'tire'],
      [/^(MT_151|MT_152|MT_153|MT_154|MT_155|MT_156|2021_Lamborghini_Essenza_SCV12_CSR2_Wheel1A_Rotor|2021_Lamborghini_Essenza_SCV12_CSR2_Calliper_Color)$/, 'rim'],
    ],
    materials: [
      [/^black_matt$/, { color: [0.03, 0.03, 0.03], metallic: 0.05, roughness: 0.85 }],
      [/^black_shiny$/, { color: [0.02, 0.02, 0.02], metallic: 0.15, roughness: 0.65 }],
      [/^chrome$/, { color: [0.70, 0.70, 0.70], metallic: 0.6, roughness: 0.45 }],
      [/^tire$/, { color: [0.04, 0.04, 0.04], metallic: 0.0, roughness: 0.9 }],
      [/^rim$/, { color: [0.03, 0.03, 0.03], metallic: 0.2, roughness: 0.65 }],
      [/^glass$/, { metallic: 0, roughness: 0.1, alpha: 0.35 }],
    ],
    cleanAttributes: true,
    // Bütçe: ≤ 60k üçgen, ~1 MB (tarif §3)
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/brabus-g700-cockpit.glb',
    // Sürücü koltuğundan görünen düğümler
    keepNodes: [
      'Object_24', 'Object_42', 'Object_46', 'Object_72', 'Object_88', 'Object_94', 'Object_108',
      'Object_144', 'Object_152', 'Object_174', 'Object_196', 'Object_210', 'Object_218', 'Object_223',
      'Object_233', 'Object_239', 'Object_241', 'Object_249', 'Object_251', 'Object_255', 'Object_257',
      'Object_259', 'Object_261', 'Object_263', 'Object_269', 'Object_271', 'Object_273', 'Object_277',
      'Object_279', 'Object_281', 'Object_283', 'Object_285', 'Object_287', 'Object_289', 'Object_295',
      'Object_297', 'Object_301', 'Object_307', 'Object_309', 'Object_311', 'Object_313', 'Object_321',
      'Object_323', 'Object_325', 'Object_329', 'Object_331', 'Object_333', 'Object_335', 'Object_337',
      'Object_339', 'Object_341', 'Object_343', 'Object_345', 'Object_347', 'Object_349', 'Object_351',
      'Object_353', 'Object_359', 'Object_361', 'Object_369', 'Object_373', 'Object_377', 'Object_379',
      'Object_385', 'Object_823', 'Object_825', 'Object_827', 'Object_829', 'Object_831', 'Object_833',
      'Object_837', 'Object_839', 'Object_841', 'Object_845', 'Object_847', 'Object_849', 'Object_853',
    ],
    eye: [-0.842, 1.31, 3.48],
    steering: {
      node: 'Object_285',
      pivot: [-0.842, 1.037, 2.965],
      axis: [0, 0.260, 0.965],
      radius: 0.19,
    },
    wheelTrim: { from: '*', radius: 0.22, axial: [-0.17, 0.04] },
    mirrors: [
      { name: 'mirror_left', from: 'Object_325' },
      { name: 'mirror_right', from: 'Object_323' },
      { name: 'mirror_center', from: 'Object_263' },
    ],
    materials: [
      [/^2020_Mercedes-AMG_G63_Brabus_G700_DarkLeather$/, { color: [0.03, 0.03, 0.03], metallic: 0.05, roughness: 0.7 }],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_Carpet$/, { color: [0.02, 0.02, 0.02], metallic: 0.0, roughness: 0.9 }],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_PianoBlack$/, { color: [0.02, 0.02, 0.02], metallic: 0.2, roughness: 0.45 }],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_BlackTrim$/, { color: [0.03, 0.03, 0.03], metallic: 0.05, roughness: 0.85 }],
      [/^2020_Mercedes-AMG_G63_Brabus_G700_ChromeSilver$/, { color: [0.70, 0.70, 0.70], metallic: 0.7, roughness: 0.4 }],
    ],
    mergeMaterials: [
      [/^(2020_Mercedes-AMG_G63_Brabus_G700_Black1|2020_Mercedes-AMG_G63_Brabus_G700_Black2|2020_Mercedes-AMG_G63_Brabus_G700_lambert1)$/, '2020_Mercedes-AMG_G63_Brabus_G700_BlackTrim'],
      [/^(2020_Mercedes-AMG_G63_Brabus_G700_Chrome|2020_Mercedes-AMG_G63_Brabus_G700_Chrome1)$/, '2020_Mercedes-AMG_G63_Brabus_G700_ChromeSilver'],
    ],
    join: true, // statik parçaları malzemeye göre birleştir (≤ 30 draw call)
    cleanAttributes: true,
    simplify: { targetTris: 65000, maxError: 0.006 },
    maxTextureSize: 1024,
    webpQuality: 90,
    compress: true,
  },
};
