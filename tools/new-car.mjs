// Creates src/cars/<id>/ (car.js + convert.mjs) for a raw source model, pre-filled with what can
// be read from the file: credit (Sketchfab metadata), size, facing and material-name guesses.
// The new car is a draft (hidden from the garage) until `draft: true` is removed.
//
//   npm run car:new -- <id> <model-kaynak/kaynak.glb>
import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';

const [id, source] = process.argv.slice(2);
if (!id || !source || !/^[a-z0-9-]+$/.test(id)) {
  console.error('Kullanım: npm run car:new -- <arac-id> <model-kaynak/kaynak.glb>   (id: küçük harf, rakam, tire)');
  process.exit(1);
}
const dir = path.join('src/cars', id);
if (fs.existsSync(dir)) {
  console.error(`${dir} zaten var.`);
  process.exit(1);
}

await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(source);
const root = doc.getRoot();
const extras = root.getAsset().extras || {};

// Size and facing of everything except Sketchfab backdrop planes
const box = new THREE.Box3();
const v = new THREE.Vector3();
for (const n of root.listNodes()) {
  if (!n.getMesh() || n.getName().startsWith('Plane.')) continue;
  const m = new THREE.Matrix4().fromArray(n.getWorldMatrix());
  for (const p of n.getMesh().listPrimitives()) {
    const pos = p.getAttribute('POSITION');
    for (let i = 0; i < pos.getCount(); i++) box.expandByPoint(v.fromArray(pos.getElement(i, [])).applyMatrix4(m));
  }
}
const size = box.getSize(new THREE.Vector3());
const sideways = size.x > size.z;
const LENGTH = 4.8;
const s = LENGTH / (sideways ? size.x : size.z);
const width = (sideways ? size.z : size.x) * s;
const height = size.y * s;

// Material-name guesses for the renames the game expects
const GUESSES = [
  [/paint|carpaint|body(?!kit)|exterior/i, 'paint'],
  [/glass|window|windshield/i, 'glass'],
  [/head.?l|front.?l|headlight|drl/i, 'headLight'],
  [/tail|rear.?light|brake.?light|stop.?light/i, 'tailLight'],
];
const materialNames = root.listMaterials().map((m) => m.getName() || '');
const renames = GUESSES.map(([re, to]) => [materialNames.filter((n) => re.test(n)), to]).filter(([names]) => names.length);
const esc = (n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const renameLines = renames.length
  ? renames.map(([names, to]) => `      [/^(${names.map(esc).join('|')})$/, '${to}'],`).join('\n')
  : "      // [/kaynak_boya_malzemesi/, 'paint'],";

// Interior-looking mesh nodes as cockpit candidates (listed, not kept, until checked)
const INTERIOR = /interior|seat|dash|steer|cockpit|door|console|gauge|cluster|mirror|pedal|roof|pillar/i;
const candidates = root
  .listNodes()
  .filter((n) => n.getMesh())
  .map((n) => ({ n: n.getName(), mat: n.getMesh().listPrimitives()[0]?.getMaterial()?.getName() || '' }))
  .filter(({ n, mat }) => INTERIOR.test(n) || INTERIOR.test(mat))
  .slice(0, 40);

const title = extras.title || id;
const license = (extras.license || '').split(' (')[0].replace('CC-BY-4.0', 'CC BY 4.0') || 'TODO';
const licenseUrl = (extras.license || '').match(/\((http[^)]+)\)/)?.[1] || 'TODO';
const author = (extras.author || 'TODO').split(' (')[0];
const r2 = (x) => Math.round(x * 100) / 100;

const carJs = `import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// ${title}. Field reference: src/cars/README.md
// Taslak: garajda görünmez. Önizleme: /tools/model-preview/car.html?car=${id}
export default {
  id: '${id}',
  draft: true, // hazır olunca sil
  order: 10,
  label: '${title.replace(/'/g, "\\'")}', // TODO: kısa garaj adı (ör. "Audi A8")
  make: 'TODO',
  model: 'TODO',
  variant: '',
  aliases: [],
  // Yeni sürüm: garaj fiyatı (para) ve performans. Alanlar: src/cars/README.md → performance
  price: 25000, // TODO
  performance: { topSpeed: 260, power: 1, traction: 1, handling: 1, braking: 1, upgradeCost: 1.3 }, // TODO
  credit: {
    title: '${title.replace(/'/g, "\\'")}',
    url: '${extras.source || 'TODO'}',
    author: '${author.replace(/'/g, "\\'")}',
    license: '${license}',
    licenseUrl: '${licenseUrl}',
    note: '(sadeleştirildi)',
  },

  exterior: {
    url: \`\${BASE}models/${id}.glb\`,
    length: ${LENGTH}, // TODO: gerçek araç boyu (m)
    envMapIntensity: 1.2,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    // convert.mjs malzemeleri headLight* / tailLight* olarak adlandırır
    lamps: [
      { match: /^head/, role: 'head', emissive: 0xffffff, emissiveFromMap: true, box: 'head' },
      { match: /^tail/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
    ],
    // Lamba malzemesi yoksa from yerine at: [x, y, z] ile ölçülmüş nokta ver
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [1.0, 0.5], from: 'head', inset: 0.2, offset: 0.07 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.7, size: [0.85, 0.45], from: 'tail', inset: 0.25, offset: 0.06 },
    },
  },

  // Kokpit: convert.mjs'te cockpit doldurulup model üretilince aç.
  // Değerleri ölçüm sayfasından al: /tools/model-preview/lab.html?car=${id}&model=cockpit
  // cockpit: {
  //   modelUrl: \`\${BASE}models/${id}-cockpit.glb\`,
  //   cluster: 'audi', // 'audi' | 'bmw'
  //   scale: 1,
  //   defaultEye: [x, y, z],
  //   wheelRadius: 0.18,
  //   steerSign: -1,
  //   softMaterials: new Set([]),
  //   screens: { cluster: { tl, tr, bl, br, n, logical: [240, 90], px: [1024, 384] } },
  //   ledPaths: [],
  //   glassOut: new THREE.Vector3(0, 0.82, -0.57).normalize(),
  //   glassUp: new THREE.Vector3(0, 0.57, 0.82).normalize(),
  //   wiperPivots: [],
  //   wiperLen: 0.6,
  //   floor: null,
  // },
};
`;

const convertJs = `// How tools/convert-car.mjs builds ${id}'s GLBs.   npm run car:convert -- ${id}
// Fields: src/cars/README.md → "convert.mjs". Node list: npm run car:inspect -- ${source}
// Measure points (wheel hub, mirrors, cluster) on: /tools/model-preview/lab.html?car=${id}
export default {
  source: '${source}',
  // Kaynak boyutu: x ${size.x.toFixed(3)}, y ${size.y.toFixed(3)}, z ${size.z.toFixed(3)} (birim)${sideways ? '\n  // ! Araç X ekseninde uzanıyor: rotateY 90 veya -90 olmalı' : ''}
  // Burun -Z yönüne bakmalı (lab sayfasında kontrol et; tersse rotateY: 180)
  transform: { rotateY: ${sideways ? 90 : 0}, length: ${LENGTH} },
  dropNodes: [/^Plane\\./], // Sketchfab arka plan düzlemleri

  exterior: {
    out: 'public/models/${id}.glb',
    // Tahmin edilen adlandırmalar; car:inspect çıktısıyla kontrol et
    renameMaterials: [
${renameLines}
    ],
    // İç mekânı dış modelden çıkar (garajda ve online'da görünmez):
    dropNodes: [],
    // Dışarıdan benzer görünen koyu malzemeleri birleştir (draw call ≤ 15):
    // mergeMaterials: [[/^(black|trim2)$/, 'black_matt']],
    // PBR düzeltmeleri (renk doğrusal RGB): materials: [[/^glass$/, { metallic: 0, roughness: 0.05 }]],
    cleanAttributes: true,
    // Bütçe: ≤ 60k üçgen, ~1 MB (tarif §3). Hata her yerde aynı (metre); en küçüğü aranır.
    simplify: { targetTris: 60000, maxError: 0.012 },
    maxTextureSize: 1024,
    webpQuality: 85,
    compress: true,
  },

  cockpit: {
    out: 'public/models/${id}-cockpit.glb',
    // Sürücü koltuğundan görünen düğümler. Aday iç mekân düğümleri (kontrol et):
${candidates.map((c) => `    //   '${c.n}'  ${c.mat}`).join('\n') || '    //   (ada göre aday bulunamadı; car:inspect listesine bak)'}
    // Lab sayfası → "Gözden görünen parçalar" bu listeyi çıkarır
    keepNodes: [],
    // eye: [x, y, z],
    // steering: { node: '...', pivot: [x, y, z], axis: [x, y, z], radius: 0.18, columnBeyondZ: -0.5 },
    // wheelTrim: { from: '*', radius: 0.21, axial: [-0.17, 0.03] }, // '*' = tüm keepNodes taranır
    // mirrors: [{ name: 'mirror_left', from: '...', uv: [u0, u1, v0, v1] }],  // veya x/y/z aralığı, facing
    // ambientLed: { from: ['...'] },
    // floor: { y: 0.3, x: [-0.85, 0.85], z: [-1.2, -0.2] },
    materials: [],
    join: true, // statik parçaları malzemeye göre birleştir (≤ 30 draw call)
    cleanAttributes: true,
    simplify: { targetTris: 65000, maxError: 0.006 },
    maxTextureSize: 1024,
    webpQuality: 90,
    compress: true,
  },
};
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'car.js'), carJs);
fs.writeFileSync(path.join(dir, 'convert.mjs'), convertJs);

console.log(`\n${dir}/car.js ve convert.mjs oluşturuldu (taslak).`);
console.log(`  Model:  "${title}" — ${author} [${license}]`);
console.log(`  Boyut:  x ${(size.x * s).toFixed(2)}, y ${height.toFixed(2)}, z ${(sideways ? size.z * s : LENGTH).toFixed(2)} m (boy ${LENGTH} m varsayıldı, genişlik ${r2(width)} m)${sideways ? '  ! yan duruyor' : ''}`);
console.log(`  Boya/cam/lamba tahmini: ${renames.map(([n, to]) => `${to}←${n.length}`).join(', ') || 'yok'}`);
console.log(`\nSıradaki adımlar:
  1. Yönü ve parçaları kontrol et:   /tools/model-preview/lab.html?car=${id}
  2. convert.mjs'i düzelt, sonra:    npm run car:convert -- ${id}
  3. Dış modele bak:                 /tools/model-preview/car.html?car=${id}&night=1&brake=1
  4. Kokpiti ölç ve car.js → cockpit'i doldur, sonra draft: true satırını sil.`);
