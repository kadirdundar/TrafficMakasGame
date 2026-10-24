// How tools/convert-car.mjs builds amg-gt's GLBs.   npm run car:convert -- amg-gt
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/mercedes_amg_gt_roadster.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=amg-gt
export default {
  source: 'model-kaynak/mercedes_amg_gt_roadster.glb',
  // Kaynak boyutu: x 81.148, y 48.610, z 179.321 (birim)
  // Burun -Z yönüne bakmalı (lab sayfasında kontrol et; tersse rotateY: 180)
  transform: { rotateY: 180, length: 4.54 }, // AMG GT Roadster: 4.546 m,
  dropNodes: [/^Plane\./], // Sketchfab arka plan düzlemleri

  exterior: {
    out: 'public/models/amg-gt.glb',
    renameMaterials: [
      [/^body$/, 'paint'],
      [/^lights$/, 'headLight'], // LED headlight inserts
      [/^r_lights$/, 'tailLight1'], // main tail lamps
      [/^material_21$/, 'tailLens'], // lamp interiors and the lower rear light strip
    ],
    // Roadster: the cabin is visible from outside, so the interior stays (simplified)
    dropNodes: [],
    // Draw calls: dark trims that look alike from outside share one material each, and the
    // cabin's small textured parts (gauges, console) become plain gloss black
    mergeMaterials: [
      [/^(black|material|tex1|tex2|tex3|tex6|tex7)$/, 'black_shiny'],
      [/^(int_red|interior|interior_bump)$/, 'black_matt'],
      [/^chrome\.001$/, 'chrome'],
      [/^r_glass$/, 'glass'],
    ],
    // The source's "black" trims are mid grey (0.14 linear) and very metallic, so the cabin
    // and trims read light grey; real ones are black leather / gloss black
    materials: [
      [/^black_matt$/, { color: [0.03, 0.03, 0.03], metallic: 0.1, roughness: 0.7 }],
      [/^black_shiny$/, { color: [0.02, 0.02, 0.02], metallic: 0.3, roughness: 0.3 }],
      // Glass was 89% metallic: a milky mirror instead of a clear windshield
      [/^glass$/, { metallic: 0, roughness: 0.05 }],
      // Windshield and side glass: rough 80%-opaque dark grey read as frosted; make it clear tint
      [/^d_glass$/, { alpha: 0.35, roughness: 0.05 }],
    ],
    cleanAttributes: true,
    // Same absolute error everywhere; the 60k-triangle budget picks the smallest error
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/amg-gt-cockpit.glb',
    // Nodes the driver can see from the three seat presets (lab page → "Gözden görünen
    // parçalar"); the windshield is transparent and left out so the view stays clear
    keepNodes: [
      'Object_638', 'Object_641', 'Object_629', 'Object_650', 'Object_49', 'Object_644', 'Object_668', 'Object_608',
      'Object_611', 'Object_623', 'Object_632', 'Object_656', 'Object_635', 'Object_331', 'Object_653', 'Object_127',
      'Object_389', 'Object_662', 'Object_671', 'Object_605', 'Object_626', 'Object_214', 'Object_491', 'Object_130',
      'Object_94', 'Object_386', 'Object_713', 'Object_401', 'Object_383', 'Object_428', 'Object_422', 'Object_743',
      'Object_325', 'Object_85', 'Object_740', 'Object_749', 'Object_404', 'Object_61', 'Object_346', 'Object_337',
      'Object_226', 'Object_446', 'Object_334', 'Object_100', 'Object_734', 'Object_737', 'Object_746', 'Object_322',
      'Object_647', 'Object_407', 'Object_124', 'Object_76', 'Object_416', 'Object_452', 'Object_659', 'Object_328',
      'Object_34', 'Object_220', 'Object_31', 'Object_88', 'Object_707', 'Object_109', 'Object_67', 'Object_410',
      'Object_431', 'Object_223', 'Object_437', 'Object_458', 'Object_413', 'Object_563', 'Object_118', 'Object_229',
      'Object_425', 'Object_566', 'Object_103', 'Object_710', 'Object_343', 'Object_73', 'Object_106', 'Object_217',
      'Object_620', 'Object_617', 'Object_256', 'Object_172', 'Object_91', 'Object_614', 'Object_449', 'Object_121',
      'Object_115', 'Object_419', 'Object_443', 'Object_82', 'Object_37', 'Object_205', 'Object_557', 'Object_665',
      'Object_347', 'Object_40', 'Object_524', 'Object_434', 'Object_64',
    ],
    // 0.52 m behind and 0.26 m above the hub (recipe §5.1)
    eye: [-0.416, 1.03, 0.6],
    steering: {
      node: 'Object_635', // the whole wheel is one piece; there is no separate column in it
      pivot: [-0.416, 0.77, 0.078],
      axis: [0, 0.28, 0.96],
      radius: 0.18,
    },
    // Spoke chrome, hub, AMG button panels (tex1/tex2) and a small trim inside the wheel disc
    wheelTrim: { from: ['Object_422', 'Object_127', 'Object_37', 'Object_734', 'Object_737'], radius: 0.21, axial: [-0.15, 0.03] },
    mirrors: [
      { name: 'mirror_left', from: 'Object_401', x: [-2, 0] }, // chrome glass, both doors in one node
      { name: 'mirror_right', from: 'Object_401', x: [0, 2] },
      { name: 'mirror_center', from: 'Object_124', facing: [0, 0.25, 1] }, // face towards the driver
    ],
    materials: [
      [/^black_matt$/, { color: [0.03, 0.03, 0.03], metallic: 0.1, roughness: 0.7 }],
      [/^black_shiny$/, { color: [0.02, 0.02, 0.02], metallic: 0.3, roughness: 0.3 }],
      // Black leather: the source's 0.09 grey reads light grey in the open-top sun
      [/^interior$/, { color: [0.028, 0.028, 0.03], metallic: 0.05, roughness: 0.6 }],
    ],
    // Small look-alike trims share materials; then everything static is joined (≤ 30 draw calls)
    mergeMaterials: [
      [/^black$/, 'black_shiny'],
      [/^(int_red|interior_bump)$/, 'interior'],
    ],
    join: true,
    cleanAttributes: true,
    simplify: { targetTris: 65000, maxError: 0.006 },
    maxTextureSize: 1024,
    webpQuality: 90,
    compress: true,
  },
};
