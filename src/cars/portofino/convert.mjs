// How tools/convert-car.mjs builds portofino's GLBs.   npm run car:convert -- portofino
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- model-kaynak/2018_ferrari_portofino.glb
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=portofino
export default {
  source: 'model-kaynak/2018_ferrari_portofino.prep.glb', // node src/cars/portofino/prep.mjs (raw: 2018_ferrari_portofino.glb)
  // Ferrari Portofino (2018): 4.586 m. The source faces +Z.
  transform: { rotateY: 180, length: 4.586 },
  dropNodes: [/^Plane\./], // Sketchfab backdrop planes

  exterior: {
    out: 'public/models/portofino.glb',
    renameMaterials: [
      [/Paint_Material$/, 'paint'],
      [/Window_Material$/, 'glass'],
      [/^RED_GLASS$/, 'tailLens'],
      [/Wheel1A_Material$/, 'wheel'], // rim and tyre share one atlas
      [/CalliperGloss_Material$/, 'caliper'],
      [/(Coloured|Base|Carbon2|SeatBelt|InteriorTillingColourZoneA)_Material$/, 'black_matt'],
      [/Grille\dA_Material$/, 'grille'],
      [/BadgeA_Material$/, 'badge'],
    ],
    // Engine block under the bonnet and the chassis plate under the car; prep.mjs's
    // cockpit-only copies of the cabin, trims and paint
    dropNodes: ['Object_55', 'Object_19', /^Object_(34|58|70)c(_\w+)?$/],
    mergeMaterials: [
      [/^black_matt$/, 'black_matt'],
      [/^grille$/, 'grille'],
    ],
    materials: [
      [/^glass$/, { color: [0.02, 0.025, 0.03], alpha: 0.5, metallic: 0, roughness: 0.05 }],
      [/^tailLens$/, { color: [0.55, 0.01, 0.01], alpha: 0.6, metallic: 0, roughness: 0.05 }],
      [/^black_matt$/, { color: [0.025, 0.025, 0.027], metallic: 0.1, roughness: 0.6 }],
      // prep.mjs clones one lamp material into front and rear copies: a differing factor keeps
      // dedup from merging them back (the headlamps would light up red)
      [/^headLight$/, { roughness: 0.2 }],
    ],
    cleanAttributes: true,
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/portofino-cockpit.glb',
    // Seen from the eye (lab.html → "Gözden görünen parçalar"); glass and the engine left out
    // prep.mjs's cockpit copies (…c): the cabin with its light floor-level metal split off, the
    // leather zone with its floor split off as carpet, the paint above the beltline only
    keepNodes: [
      'Object_34c', // the whole cabin: dash, wheel, seats, door cards, headliner
      'Object_34c_metal', // footrest, pedals and sill plates
      'Object_58c', // leather colour zone (dash, pillars, console, seats), mirror glass
      'Object_58c_floor', // carpet
      'Object_34c_vents', // air vent chrome rings
      'Object_58c_vents', // air vent vanes and barrels
      'Object_61', // carbon: wheel rim top, console, door inserts
      'Object_28', // tinted trims (colour zone)
      'Object_31', // perforated leather on the wheel and seats
      'Object_49', // vent grilles
      'Object_64', // black base trims
      'Object_67', // badges (wheel crest)
      'Object_70c', // bonnet, wings and mirror housings through the glass
      // The steering wheel, cut out of the meshes above by prep.mjs
      'Object_34_wheel', 'Object_31_wheel', 'Object_61_wheel', 'Object_67_wheel', 'Object_58_wheel', 'Object_28_wheel',
    ],
    // Hub from three rim points (left, right, top; the rim is flat-topped) and the disc's tilt;
    // the eye 0.52 m behind and 0.26 m above the hub (recipe §5.1)
    eye: [-0.369, 1.06, 0.494],
    // prep.mjs cuts the wheel (welded to the dash in the source) into the *_wheel nodes
    steering: { node: 'Object_34_wheel', pivot: [-0.369, 0.802, -0.026], axis: [0, 0.214, 0.977], radius: 0.17 },
    wheelTrim: { from: ['Object_31_wheel', 'Object_61_wheel', 'Object_67_wheel', 'Object_58_wheel', 'Object_28_wheel'], radius: 0.21, axial: [-0.13, 0.07] },
    // Mirror glass: the rearward-facing triangles of the dark trim mesh inside each housing
    mirrors: [
      { name: 'mirror_left', from: 'Object_58c', x: [-1.0, -0.8], y: [0.9, 1.06], z: [-0.25, -0.05], facing: [0.41, -0.07, 0.91] },
      { name: 'mirror_right', from: 'Object_58c', x: [0.8, 1.0], y: [0.9, 1.06], z: [-0.25, -0.05], facing: [-0.41, -0.07, 0.91] },
      { name: 'mirror_center', from: 'Object_58c', x: [-0.3, 0.3], y: [1.1, 1.25], z: [-0.06, 0.03], facing: [-0.26, 0.05, 0.96] },
    ],
    materials: [
      // Black leather: the source's 0.07 grey at roughness 0.23 mirrored the sky (the mats and
      // console read light grey); car.js → finishes sets the leather sheen
      [/Coloured_Material$/, { color: [0.03, 0.03, 0.032] }],
    ],
    ao: { rays: 32, distance: 0.12, strength: 0.75, min: 0.4, skip: [/^MirrorMaterial$/] },
    join: true,
    cleanAttributes: true,
    simplify: { targetTris: 65000, maxError: 0.006, excludeNodes: ['steering_wheel'] },
    maxTextureSize: 1024,
    // The cabin atlas, upscaled and sharpened by prep.mjs: every symbol on the dash sits in it
    textureSizes: [[/InteriorA_Material/, 2048, ['baseColor']]],
    webpQuality: 90,
    compress: true,
  },
};
