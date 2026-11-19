// Pre-pass before convert.mjs: the source keeps every lamp of the car (headlamps, indicators,
// tail lamps) in one lamp-body mesh, so the game would light the tail lamps white and the
// headlamps red (recipe §3, "önü ve arkası tek mesh'te olan lamba parçalarını ayır"). This
// splits it at the car's middle into headLight / tailLight. The source also lays a black,
// emissive-only copy of the same mesh over the lamps (it z-fights with them): its emissive
// texture (which parts of the lamp glow) goes onto the lamp bodies and the copy is dropped.
//   node src/cars/portofino/prep.mjs   → model-kaynak/2018_ferrari_portofino.prep.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { splitTriangles } from '../../../tools/lib/gltf-utils.mjs';

const SOURCE = 'model-kaynak/2018_ferrari_portofino.glb';
const OUT = 'model-kaynak/2018_ferrari_portofino.prep.glb';
// The source faces +Z: the front lamps are the triangles with a positive world z
const LAMPS = [[/LightA_Material$/, 'headLight', 'tailLight']];
const OVERLAY = /LightEmissiveA_Material$/;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SOURCE);
const root = doc.getRoot();

// Same mesh, same UVs: the overlay's glow mask becomes the lamp bodies' emissive texture
const overlayMat = root.listMaterials().find((m) => OVERLAY.test(m.getName()));
const lampMat = root.listMaterials().find((m) => LAMPS[0][0].test(m.getName()));
lampMat.setEmissiveTexture(overlayMat.getEmissiveTexture()).setEmissiveFactor([0, 0, 0]);
for (const node of root.listNodes()) {
  if (node.getMesh()?.listPrimitives().some((p) => p.getMaterial() === overlayMat)) node.dispose();
}

const transform = (m, [x, y, z]) => [
  m[0] * x + m[4] * y + m[8] * z + m[12],
  m[1] * x + m[5] * y + m[9] * z + m[13],
  m[2] * x + m[6] * y + m[10] * z + m[14],
];

for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  for (const prim of mesh.listPrimitives()) {
    const rule = LAMPS.find(([pattern]) => pattern.test(prim.getMaterial()?.getName() || ''));
    if (!rule) continue;
    const world = node.getWorldMatrix();
    const pos = prim.getAttribute('POSITION');
    const z = (i) => transform(world, pos.getElement(i, []))[2];
    const front = splitTriangles(doc, prim, (a, b, c) => z(a) + z(b) + z(c) > 0);
    const source = prim.getMaterial();
    prim.setMaterial(source.clone().setName(rule[2]));
    if (!front) continue;
    front.setMaterial(source.clone().setName(rule[1]));
    const frontNode = doc.createNode(`${node.getName()}_front`).setMesh(doc.createMesh(`${mesh.getName()}_front`).addPrimitive(front));
    frontNode.setMatrix(node.getMatrix());
    (node.getParentNode() || root.listScenes()[0]).addChild(frontNode);
    console.log(`${node.getName()}: ${front.getIndices().getCount() / 3} ön (${rule[1]}), ${prim.getIndices().getCount() / 3} arka (${rule[2]})`);
  }
}

// Steering wheel: the source welds it to the column and the dash in one cabin mesh (and its
// leather, carbon and crest in others), so no connected piece is "the wheel". Every triangle
// lying wholly inside the wheel's disc (a short cylinder round the column axis) goes to its own
// `<node>_wheel` node, which convert.mjs turns. Measured in game coordinates (lab.html): the
// source faces +Z at 1/100 scale, so game = (-x, y, -z) · SCALE.
const SCALE = 100.004;
const WHEEL = { pivot: [-0.369, 0.802, -0.026], axis: [0, 0.214, 0.977], radius: 0.2, axial: [-0.12, 0.06] };
const WHEEL_NODES = ['Object_34', 'Object_31', 'Object_61', 'Object_67', 'Object_58', 'Object_28'];
const len = Math.hypot(...WHEEL.axis);
const axis = WHEEL.axis.map((v) => v / len);
const inDisc = ([x, y, z]) => {
  const d = [-x * SCALE - WHEEL.pivot[0], y * SCALE - WHEEL.pivot[1], -z * SCALE - WHEEL.pivot[2]];
  const along = d[0] * axis[0] + d[1] * axis[1] + d[2] * axis[2];
  const radial = Math.hypot(d[0] - along * axis[0], d[1] - along * axis[1], d[2] - along * axis[2]);
  return along > WHEEL.axial[0] && along < WHEEL.axial[1] && radial < WHEEL.radius;
};
for (const name of WHEEL_NODES) {
  const node = root.listNodes().find((n) => n.getName() === name);
  const prim = node?.getMesh()?.listPrimitives()[0];
  if (!prim) continue;
  const world = node.getWorldMatrix();
  const pos = prim.getAttribute('POSITION');
  const at = (i) => transform(world, pos.getElement(i, []));
  const wheel = splitTriangles(doc, prim, (a, b, c) => inDisc(at(a)) && inDisc(at(b)) && inDisc(at(c)));
  if (!wheel) continue;
  const wheelNode = doc.createNode(`${name}_wheel`).setMesh(doc.createMesh(`${name}_wheel`).addPrimitive(wheel));
  wheelNode.setMatrix(node.getMatrix());
  (node.getParentNode() || root.listScenes()[0]).addChild(wheelNode);
  console.log(`${name}: ${wheel.getIndices().getCount() / 3} üçgen direksiyona (${name}_wheel)`);
}

await doc.transform(prune());
await io.write(OUT, doc);
console.log(`Kaydedildi: ${OUT}`);
