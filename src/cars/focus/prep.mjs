// Pre-pass before convert.mjs: the source tyres carry a deep tread (18.5k triangles each).
// convert.mjs simplifies every part with one error, so the tread kept ~34k of the exterior's
// 60k triangles and the body was left with 3.7k. This flattens the tread here first.
//   node src/cars/focus/prep.mjs   → model-kaynak/ford_focus_sedan.prep.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const SOURCE = 'model-kaynak/ford_focus_sedan.glb';
const OUT = 'model-kaynak/ford_focus_sedan.prep.glb';
const TYRES = /^wheel(\.00\d)?_black\.0_0$/;
const TYRE_ERROR = 0.006; // source units (≈ m): the tread grooves go, the tyre's outline stays

await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SOURCE);
await doc.transform(weld());

for (const node of doc.getRoot().listNodes()) {
  if (!TYRES.test(node.getName()) || !node.getMesh()) continue;
  for (const prim of node.getMesh().listPrimitives()) {
    const idx = new Uint32Array(prim.getIndices().getArray());
    const pos = new Float32Array(prim.getAttribute('POSITION').getArray());
    const [out] = MeshoptSimplifier.simplify(idx, pos, 3, 0, TYRE_ERROR, ['ErrorAbsolute', 'Permissive', 'Prune']);
    prim.getIndices().setArray(out);
    console.log(`${node.getName()}: ${idx.length / 3} → ${out.length / 3} üçgen`);
  }
}

await io.write(OUT, doc);
console.log(`Kaydedildi: ${OUT}`);
