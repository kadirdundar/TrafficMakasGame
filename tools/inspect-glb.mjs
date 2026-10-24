// Summarises a GLB: model credit, size and facing, then every mesh node with its material,
// triangle count and bounding box (after the optional turn and scale, i.e. in game coordinates).
//
//   npm run car:inspect -- <file.glb> [--rotate 180] [--scale 2.8 | --length 4.8] [--min-tris 40]
import { NodeIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback);
const file = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!file) {
  console.error('Kullanım: npm run car:inspect -- <dosya.glb> [--rotate 180] [--scale 2.8 | --length 4.8] [--min-tris 40]');
  process.exit(1);
}

await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(file);
const root = doc.getRoot();
const turn = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(+opt('rotate', 0)));
const minTris = +opt('min-tris', 0);
const v = new THREE.Vector3();

const rows = [];
const total = new THREE.Box3();
for (const n of root.listNodes()) {
  const mesh = n.getMesh();
  if (!mesh) continue;
  const m = turn.clone().multiply(new THREE.Matrix4().fromArray(n.getWorldMatrix()));
  for (const p of mesh.listPrimitives()) {
    const pos = p.getAttribute('POSITION');
    const bb = new THREE.Box3();
    for (let i = 0; i < pos.getCount(); i++) bb.expandByPoint(v.fromArray(pos.getElement(i, [])).applyMatrix4(m));
    const tris = (p.getIndices()?.getCount() ?? pos.getCount()) / 3;
    if (!n.getName().startsWith('Plane.')) total.union(bb);
    rows.push({ name: n.getName(), mat: p.getMaterial()?.getName() || '-', tris, bb });
  }
}

const size = total.getSize(new THREE.Vector3());
const scale = +opt('scale', 0) || (opt('length') ? +opt('length') / size.z : 1);
const extras = root.getAsset().extras || {};
const fmt = (b) => b.toArray().map((x) => (x * scale).toFixed(2)).join(',');

console.log(`\n${file}`);
if (extras.title) console.log(`  Model:   "${extras.title}" — ${extras.author || '?'}  [${extras.license || 'lisans yok'}]\n  Kaynak:  ${extras.source || '-'}`);
console.log(`  Boyut:   x ${(size.x * scale).toFixed(3)}  y ${(size.y * scale).toFixed(3)}  z ${(size.z * scale).toFixed(3)} m (ölçek ${scale.toFixed(4)})`);
if (size.x > size.z) console.log('  ! Araç X ekseninde uzanıyor: --rotate 90 veya -90 dene (burun -Z yönüne bakmalı).');
console.log(`  Toplam:  ${rows.reduce((n, r) => n + r.tris, 0)} üçgen, ${rows.length} parça, ${root.listMaterials().length} malzeme, ${root.listTextures().length} doku`);
const texSizes = root.listTextures().map((t) => t.getSize()?.join('x')).filter(Boolean);
if (texSizes.length) console.log(`  Dokular: ${[...new Set(texSizes)].join(', ')}`);
console.log('');
for (const r of rows) {
  if (r.tris < minTris) continue;
  console.log(`${r.name.padEnd(24)} ${r.mat.slice(0, 46).padEnd(46)} ${String(r.tris).padStart(7)}  min=[${fmt(r.bb.min)}] max=[${fmt(r.bb.max)}]`);
}
