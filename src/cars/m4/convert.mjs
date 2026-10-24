// How tools/convert-car.mjs builds the M4's GLBs from the raw Sketchfab model.
//   npm run car:convert -- m4
// Fields: src/cars/README.md → "convert.mjs". Node names come from: npm run car:inspect -- <source>
export default {
  source: 'model-kaynak/2025_bmw_m4_cs_vr46_edition.glb',
  // Source faces +Z and is 1.712 m long; 2.80 gives the real 4.79 m
  transform: { rotateY: 180, scale: 2.8 },
  dropNodes: [/^Plane\./], // Sketchfab backdrop planes

  exterior: {
    out: 'public/models/bmw-m4.glb',
    renameMaterials: [
      [/m4car_body1|BLACK_PAINT/, 'paint'],
      [/m4car_glass1/, 'glass'],
      [/m4car_emissive1/, 'emissive'],
    ],
    webpQuality: 85,
  },

  cockpit: {
    out: 'public/models/bmw-m4-cockpit.glb',
    // The windshield glass (Object_56) is left out so the view through it stays clear
    keepNodes: [
      'Object_35', // steering wheel & column
      'Object_62', // seats, dashboard, console, pedals, displays
      'Object_154', // carbon interior details, seat backs, console trim
      'Object_86', // driver door card
      'Object_93', // passenger door card
      'Object_88', // driver door window frame & mirror
      'Object_95', // passenger door window frame & mirror
      'Object_82', // driver door outer skin
      'Object_91', // passenger door outer skin
      'Object_64', // dashboard structure, cowl, vents
      'Object_52', // body roof, A-pillars
      'Object_60', // hood seen through the windshield
      'Object_148', // carbon roof
      'Object_8', // black stripes
      'Object_20', // black stripes
      'Object_14', // red accents
      'Object_169', // red accents
      'Object_175', // red accents
    ],
    // On the wheel centre line, 0.52 m behind and 0.26 m above the hub (recipe §5.1)
    eye: [-0.375, 1.14, 0.185],
    steering: {
      node: 'Object_35',
      pivot: [-0.3745, 0.88, -0.335], // hub centre
      axis: [0.005, 0.368, 0.93], // column axis, towards the driver
      radius: 0.185,
      columnBeyondZ: -0.5, // pieces reaching forward of this are the static column
    },
    // Carbon spokes and paddles (Object_148), roundel and spoke insert (Object_62)
    wheelTrim: { from: ['Object_62', 'Object_148'], radius: 0.2, axial: [-0.1, 0.02] },
    mirrors: [
      { name: 'mirror_left', from: 'Object_88', uv: [0.05, 0.14, 0.77, 0.83] },
      { name: 'mirror_right', from: 'Object_95', uv: [0.05, 0.14, 0.77, 0.83] },
      { name: 'mirror_center', from: 'Object_62', uv: [0.68, 0.71, 0.235, 0.255] },
    ],
    ambientLed: { from: ['Object_62', 'Object_86', 'Object_93'] },
    floor: { y: 0.32, x: [-0.85, 0.85], z: [-1.2, -0.2] },
    materials: [
      [/interior1\.00[78]/, { metallic: 0.04, roughness: 0.72 }],
      [/plast1\.005/, { metallic: 0.05, roughness: 0.8 }],
      [/InteriorA/, { metallic: 0.05, roughness: 0.6 }],
      [/Carbon1M/, { metallic: 0.25, roughness: 0.22 }],
      [/hood1|body1|PAINT/, { metallic: 0.85, roughness: 0.22 }],
    ],
    webpQuality: 90,
  },
};
