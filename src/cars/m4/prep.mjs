// Pre-pass before convert.mjs: the two VR46 cabin badges (Material.002 / .004) sample a
// 8192x4096 texture that is black except for the ~410x135 px logo they use. On the GPU that one
// texture costs ~170 MB with mipmaps. This crops it to the used UV box (same pixels, so the badge
// looks the same) and rescales the badges' UVs onto the crop.
//   node src/cars/m4/prep.mjs   → model-kaynak/2025_bmw_m4_cs_vr46_edition.prep.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';

const SOURCE = 'model-kaynak/2025_bmw_m4_cs_vr46_edition.glb';
const OUT = 'model-kaynak/2025_bmw_m4_cs_vr46_edition.prep.glb';
const BADGES = /^Material\.00[24]$/;
const MARGIN = 8; // px kept around the used box, for filtering

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SOURCE);
const root = doc.getRoot();

for (const mat of root.listMaterials().filter((m) => BADGES.test(m.getName()))) {
  const tex = mat.getBaseColorTexture();
  const prims = root.listMeshes().flatMap((m) => m.listPrimitives()).filter((p) => p.getMaterial() === mat);
  const e = [];
  let [u0, u1, v0, v1] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const p of prims) {
    const uv = p.getAttribute('TEXCOORD_0');
    for (let i = 0; i < uv.getCount(); i++) {
      uv.getElement(i, e);
      [u0, u1, v0, v1] = [Math.min(u0, e[0]), Math.max(u1, e[0]), Math.min(v0, e[1]), Math.max(v1, e[1])];
    }
  }
  const [W, H] = tex.getSize();
  const left = Math.max(0, Math.floor(u0 * W) - MARGIN);
  const top = Math.max(0, Math.floor(v0 * H) - MARGIN);
  const width = Math.min(W - left, Math.ceil(u1 * W) + MARGIN - left);
  const height = Math.min(H - top, Math.ceil(v1 * H) + MARGIN - top);
  const png = await sharp(Buffer.from(tex.getImage())).extract({ left, top, width, height }).png().toBuffer();
  const crop = doc.createTexture(`${mat.getName()}_crop`).setImage(png).setMimeType('image/png');
  mat.setBaseColorTexture(crop);
  for (const p of prims) {
    const uv = p.getAttribute('TEXCOORD_0').clone();
    for (let i = 0; i < uv.getCount(); i++) {
      uv.getElement(i, e);
      uv.setElement(i, [(e[0] * W - left) / width, (e[1] * H - top) / height]);
    }
    p.setAttribute('TEXCOORD_0', uv);
  }
  console.log(`${mat.getName()}: ${W}x${H} → ${width}x${height}`);
}

const { prune } = await import('@gltf-transform/functions');
await doc.transform(prune());
await io.write(OUT, doc);
console.log(`Kaydedildi: ${OUT}`);
