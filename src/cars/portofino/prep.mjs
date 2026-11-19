// Pre-pass before convert.mjs: the source keeps every lamp of the car (headlamps, indicators,
// tail lamps) in one lamp-body mesh, so the game would light the tail lamps white and the
// headlamps red (recipe §3, "önü ve arkası tek mesh'te olan lamba parçalarını ayır"). This
// splits it at the car's middle into headLight / tailLight. The source also lays a black,
// emissive-only copy of the same mesh over the lamps (it z-fights with them): its emissive
// texture (which parts of the lamp glow) goes onto the lamp bodies and the copy is dropped.
// It also cuts the steering wheel out of the cabin meshes, makes the cockpit-only copies (carpet,
// floor-level metal, paint above the beltline) and sharpens the 512 px cabin atlas (see below).
//   node src/cars/portofino/prep.mjs   → model-kaynak/2018_ferrari_portofino.prep.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import sharp from 'sharp';
import { splitTriangles, textureSampler } from '../../../tools/lib/gltf-utils.mjs';

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

// Cockpit-only copies (convert.mjs → exterior drops them, so the outside model is unchanged):
//  - Object_34c: the cabin atlas mesh, minus the light-grey parts low in the cabin (footrest,
//    pedals, sill plates) that read as white stripes beside the mats; those go to
//    Object_34c_metal in a dark satin metal
//  - Object_58c: the leather colour zone, minus the floor, which becomes carpet (Object_58c_floor)
//  - Object_70c: the paint above the beltline only (bonnet, wings, mirror housings): the rest is
//    never seen from the seat and took a fifth of the triangle budget
//  - none of them keeps what lies behind the driver (REAR_CUT_Z)
const REAR_CUT_Z = 0.75;
const gameY = (world, pos, i) => transform(world, pos.getElement(i, []))[1] * SCALE;
const cockpitCopy = (name) => {
  const node = root.listNodes().find((n) => n.getName() === name);
  const prim = node.getMesh().listPrimitives()[0];
  const copy = prim.clone().setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(prim.getIndices().getArray())));
  const copyNode = doc.createNode(`${name}c`).setMesh(doc.createMesh(`${name}c`).addPrimitive(copy));
  copyNode.setMatrix(node.getMatrix());
  (node.getParentNode() || root.listScenes()[0]).addChild(copyNode);
  const world = node.getWorldMatrix();
  const pos = prim.getAttribute('POSITION');
  const centreY = (a, b, c) => (gameY(world, pos, a) + gameY(world, pos, b) + gameY(world, pos, c)) / 3;
  // Everything well behind the driver's eye (z 0.49): the rear seats, the rear deck and floor.
  // Never seen from the seat (the mirrors draw the scene without the cabin), it was a third of
  // the triangle budget, which now goes to the vents, the binnacle and the console instead
  const gameZ = (i) => -transform(world, pos.getElement(i, []))[2] * SCALE;
  const behind = splitTriangles(doc, copy, (a, b, c) => (gameZ(a) + gameZ(b) + gameZ(c)) / 3 > REAR_CUT_Z);
  console.log(`${name}c: ${behind ? behind.getIndices().getCount() / 3 : 0} üçgen sürücünün arkasında atıldı`);
  const centre = (a, b, c) => {
    const sum = [0, 0, 0];
    for (const i of [a, b, c]) transform(world, pos.getElement(i, [])).forEach((v, k) => (sum[k] += v / 3));
    return [-sum[0] * SCALE, sum[1] * SCALE, -sum[2] * SCALE];
  };
  return { node: copyNode, prim: copy, centreY, centre };
};
const addPart = (from, name, prim, mat) => {
  prim.setMaterial(mat);
  const node = doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(prim));
  node.setMatrix(from.node.getMatrix());
  (from.node.getParentNode() || root.listScenes()[0]).addChild(node);
  console.log(`${name}: ${prim.getIndices().getCount() / 3} üçgen`);
};

const cabin = cockpitCopy('Object_34');
const atlas = await textureSampler(cabin.prim.getMaterial().getBaseColorTexture());
const uv = cabin.prim.getAttribute('TEXCOORD_0');
const lum = (...ids) => {
  let u = 0;
  let v = 0;
  for (const i of ids) {
    const e = uv.getElement(i, []);
    u += e[0] / 3;
    v += e[1] / 3;
  }
  const [r, g, b] = atlas(u, v);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
const metal = splitTriangles(doc, cabin.prim, (a, b, c) => cabin.centreY(a, b, c) < 0.62 && lum(a, b, c) > 0.3);
const metalMat = cabin.prim.getMaterial().clone().setName(`${cabin.prim.getMaterial().getName()}Metal`);
metalMat.setBaseColorFactor([0.22, 0.22, 0.23, 1]).setMetallicFactor(0.35).setRoughnessFactor(0.45);
if (metal) addPart(cabin, 'Object_34c_metal', metal, metalMat);

// Air vents (centres measured in game coordinates): the source makes the vanes and barrels of the
// leather colour zone (they took its grain) and maps the chrome rings onto stray atlas symbols.
// Vanes and barrels become satin black plastic, the bright ring parts plain satin chrome.
const VENTS = [[-0.646, 0.853, -0.207], [-0.097, 0.867, -0.185], [0.11, 0.871, -0.179], [0.637, 0.849, -0.21]];
const inVent = (p, r) => VENTS.some((v) => Math.hypot(p[0] - v[0], p[1] - v[1], p[2] - v[2]) < r);
const chrome = splitTriangles(doc, cabin.prim, (a, b, c) => inVent(cabin.centre(a, b, c), 0.06) && lum(a, b, c) > 0.3);
const chromeMat = doc.createMaterial('VentChrome').setBaseColorFactor([0.55, 0.56, 0.58, 1]).setMetallicFactor(0.5).setRoughnessFactor(0.35);
if (chrome) addPart(cabin, 'Object_34c_vents', chrome, chromeMat);

const trim = cockpitCopy('Object_58');
const vanes = splitTriangles(doc, trim.prim, (a, b, c) => inVent(trim.centre(a, b, c), 0.042));
const vaneMat = doc.createMaterial('VentPlastic').setBaseColorFactor([0.018, 0.018, 0.02, 1]).setMetallicFactor(0.2).setRoughnessFactor(0.45);
if (vanes) addPart(trim, 'Object_58c_vents', vanes, vaneMat);
const floor = splitTriangles(doc, trim.prim, (a, b, c) => trim.centreY(a, b, c) < 0.3);
const carpet = doc.createMaterial('Carpet').setBaseColorFactor([0.022, 0.022, 0.024, 1]).setMetallicFactor(0).setRoughnessFactor(0.95);
if (floor) addPart(trim, 'Object_58c_floor', floor, carpet);

const body = cockpitCopy('Object_70');
const below = splitTriangles(doc, body.prim, (a, b, c) => body.centreY(a, b, c) < 0.6);
console.log(`Object_70c: ${below ? below.getIndices().getCount() / 3 : 0} üçgen bel çizgisinin altında atıldı`);

// The cabin atlas is 512 px for the whole interior: every button symbol and dial is a few dozen
// pixels and reads blurred from the seat. Upscaled 4x, then every edge (where the brightness
// changes over about one source pixel) is steepened, so symbols, lettering and dial marks come out
// crisp; flat and gently shaded areas (range under ~6%) are left alone.
const atlasTex = cabin.prim.getMaterial().getBaseColorTexture();
atlasTex.setImage(await sharpenAtlas(Buffer.from(atlasTex.getImage()), 4)).setMimeType('image/png');

async function sharpenAtlas(png, F) {
  const src = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = src.info.width * F;
  const H = src.info.height * F;
  const { data } = await sharp(src.data, { raw: src.info }).resize(W, H, { kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
  const L = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) L[i] = (0.2126 * data[i * 3] + 0.7152 * data[i * 3 + 1] + 0.0722 * data[i * 3 + 2]) / 255;
  // Local brightness range over a (2R+1)² window: separable min/max
  const R = Math.round(F * 0.75);
  const pass = (input, horizontal, pick) => {
    const out = new Float32Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let m = input[y * W + x];
        for (let k = -R; k <= R; k++) {
          const xx = horizontal ? Math.min(W - 1, Math.max(0, x + k)) : x;
          const yy = horizontal ? y : Math.min(H - 1, Math.max(0, y + k));
          m = pick(m, input[yy * W + xx]);
        }
        out[y * W + x] = m;
      }
    }
    return out;
  };
  const lo = pass(pass(L, true, Math.min), false, Math.min);
  const hi = pass(pass(L, true, Math.max), false, Math.max);
  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const out = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    const range = hi[i] - lo[i];
    const w = smooth(0.06, 0.16, range);
    let delta = 0;
    if (w > 0) {
      const t = (L[i] - lo[i]) / range;
      const steep = Math.min(1, Math.max(0, 0.5 + (t - 0.5) * 2.4));
      delta = (lo[i] + steep * range - L[i]) * w * 255;
    }
    for (let k = 0; k < 3; k++) out[i * 3 + k] = Math.min(255, Math.max(0, Math.round(data[i * 3 + k] + delta)));
  }
  return sharp(out, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 9 }).toBuffer();
}

await doc.transform(prune());
await io.write(OUT, doc);
console.log(`Kaydedildi: ${OUT}`);
