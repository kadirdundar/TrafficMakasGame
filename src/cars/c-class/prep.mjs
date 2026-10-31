// Pre-pass before convert.mjs: the textured C220 source is the base; the second download of the
// same BeamNG W206 (every variant stacked, no textures) supplies the "C200" boot lettering, which
// replaces the C220 one at the same spot.
//   node src/cars/c-class/prep.mjs   → model-kaynak/mercedes_w206_c200.prep.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { copyToDocument, prune, unpartition } from '@gltf-transform/functions';

const SOURCE = 'model-kaynak/mercedes-_benz_w206_c220.glb';
const DONOR = 'model-kaynak/mercedes_benz_w206.glb';
const OUT = 'model-kaynak/mercedes_w206_c200.prep.glb';
// [node in the source to remove, node in the donor to bring in its place]
const SWAPS = [['w206_c220_w206_lettering_0', 'w206_c200_w206_lettering_0']];

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SOURCE);
const donor = await io.read(DONOR);
const root = doc.getRoot();
const scene = root.listScenes()[0];
const findNode = (d, name) => d.getRoot().listNodes().find((n) => n.getName() === name);

for (const [oldName, newName] of SWAPS) {
  const old = findNode(doc, oldName);
  const src = findNode(donor, newName);
  if (!old || !src) throw new Error(`Düğüm yok: ${old ? newName : oldName}`);
  // Same material names in both files: use the source's (textured, tuned) material
  const materials = new Map(root.listMaterials().map((m) => [m.getName(), m]));
  const map = copyToDocument(doc, donor, [src.getMesh()]);
  const mesh = map.get(src.getMesh());
  for (const prim of mesh.listPrimitives()) {
    const own = materials.get(prim.getMaterial()?.getName());
    if (own) prim.setMaterial(own);
  }
  // Donor world matrix at the scene root = the same place as in the donor file
  scene.addChild(doc.createNode(newName).setMesh(mesh).setMatrix(src.getWorldMatrix()));
  old.detach();
  old.dispose();
  console.log(`${oldName} → ${newName}`);
}

await doc.transform(prune(), unpartition()); // the copy brings its own buffer; a GLB holds one
await io.write(OUT, doc);
console.log(`Kaydedildi: ${OUT}`);
