// Lists mesh nodes of a GLB with material, triangle count and world-space bounding box.
//   node tools/inspect-glb.mjs <file.glb> [scale] [rotY180=1]
import { NodeIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
const [file, scale = '1', rot = '0'] = process.argv.slice(2);
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(file);
const post = new THREE.Matrix4().makeRotationY(rot === '1' ? Math.PI : 0).scale(new THREE.Vector3(+scale, +scale, +scale));
const v = new THREE.Vector3();
for (const n of doc.getRoot().listNodes()) {
  const mesh = n.getMesh(); if (!mesh) continue;
  const m = post.clone().multiply(new THREE.Matrix4().fromArray(n.getWorldMatrix()));
  for (const p of mesh.listPrimitives()) {
    const pos = p.getAttribute('POSITION'); const bb = new THREE.Box3();
    for (let i = 0; i < pos.getCount(); i++) bb.expandByPoint(v.fromArray(pos.getElement(i, [])).applyMatrix4(m));
    const tris = (p.getIndices()?.getCount() ?? pos.getCount()) / 3;
    const f = (a) => a.toArray().map((x) => x.toFixed(2)).join(',');
    console.log(`${n.getName().padEnd(22)} ${(p.getMaterial()?.getName() || '-').padEnd(48)} tris=${String(tris).padStart(6)} min=[${f(bb.min)}] max=[${f(bb.max)}]`);
  }
}
