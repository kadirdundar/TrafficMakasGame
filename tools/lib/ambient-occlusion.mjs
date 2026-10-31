// Baked ambient occlusion: how much of the hemisphere above each vertex nearby geometry hides,
// stored as a vertex colour (COLOR_0) that multiplies the material colour. Recesses, panel gaps,
// footwells and wheel arches darken without any lighting cost in the game.
//   opts: { rays = 32, distance = 0.25 (m), strength = 0.85, min = 0.35, skip?: material pattern }
// Runs on the final geometry (after simplify and join), so the colours follow the kept vertices.
// Transparent (BLEND) primitives neither cast nor receive.
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { matches } from './gltf-utils.mjs';

export function bakeAmbientOcclusion(doc, opts) {
  if (!opts) return;
  const { rays = 32, distance = 0.25, strength = 0.85, min = 0.35, skip = [] } = opts;
  const occluders = [];
  const receivers = [];
  const v = new THREE.Vector3();
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const world = new THREE.Matrix4().fromArray(node.getWorldMatrix());
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(world);
    for (const prim of mesh.listPrimitives()) {
      const name = prim.getMaterial()?.getName() || '';
      if (prim.getMode() !== 4 || !prim.getIndices() || prim.getMaterial()?.getAlphaMode() === 'BLEND') continue;
      const pos = prim.getAttribute('POSITION');
      const nrm = prim.getAttribute('NORMAL');
      const P = new Float32Array(pos.getCount() * 3);
      for (let i = 0; i < pos.getCount(); i++) v.fromArray(pos.getElement(i, [])).applyMatrix4(world).toArray(P, i * 3);
      const idx = prim.getIndices().getArray();
      for (let t = 0; t < idx.length; t++) occluders.push(P[idx[t] * 3], P[idx[t] * 3 + 1], P[idx[t] * 3 + 2]);
      if (!nrm || matches(skip, name)) continue;
      const N = new Float32Array(pos.getCount() * 3);
      for (let i = 0; i < pos.getCount(); i++) v.fromArray(nrm.getElement(i, [])).applyMatrix3(normalMatrix).normalize().toArray(N, i * 3);
      receivers.push({ prim, P, N });
    }
  }
  const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(occluders, 3));
  const bvh = new MeshBVH(geometry);

  // Cosine-weighted directions around +Z (Fibonacci spiral), turned onto each vertex normal
  const dirs = Array.from({ length: rays }, (_, i) => {
    const r = Math.sqrt((i + 0.5) / rays);
    const a = i * 2.39996323;
    return new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), Math.sqrt(1 - r * r));
  });
  const ray = new THREE.Ray();
  const n = new THREE.Vector3();
  const t1 = new THREE.Vector3();
  const t2 = new THREE.Vector3();
  const d = new THREE.Vector3();
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let vertices = 0;
  let total = 0;
  for (const { prim, P, N } of receivers) {
    const count = P.length / 3;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      n.fromArray(N, i * 3);
      // Tangent frame, spun by a random angle per vertex so the fixed ray set does not band
      t1.set(Math.abs(n.x) < 0.9 ? 1 : 0, Math.abs(n.x) < 0.9 ? 0 : 1, 0).cross(n).normalize();
      t2.crossVectors(n, t1);
      const spin = rnd() * Math.PI * 2;
      const cs = Math.cos(spin);
      const sn = Math.sin(spin);
      ray.origin.fromArray(P, i * 3).addScaledVector(n, 0.0015);
      let occlusion = 0;
      for (const dir of dirs) {
        const x = dir.x * cs - dir.y * sn;
        const y = dir.x * sn + dir.y * cs;
        d.copy(t1).multiplyScalar(x).addScaledVector(t2, y).addScaledVector(n, dir.z);
        ray.direction.copy(d);
        const hit = bvh.raycastFirst(ray, THREE.DoubleSide, 0, distance);
        if (hit) occlusion += 1 - hit.distance / distance; // near geometry hides more
      }
      const ao = Math.max(min, 1 - strength * (occlusion / rays));
      colors.fill(ao, i * 3, i * 3 + 3);
      total += ao;
    }
    vertices += count;
    prim.setAttribute('COLOR_0', doc.createAccessor().setType('VEC3').setArray(colors));
  }
  console.log(`  Ortam gölgesi: ${vertices} köşe, ${rays} ışın, ortalama ${(total / Math.max(1, vertices)).toFixed(2)}`);
}
