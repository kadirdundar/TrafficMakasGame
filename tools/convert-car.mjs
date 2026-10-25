// Builds a car's optimized exterior and cockpit GLBs from its raw source model, driven by
// src/cars/<id>/convert.mjs (fields: src/cars/README.md → "convert.mjs").
//
//   npm run car:convert -- <id> [--cockpit-only | --exterior-only] [--out <dir>]
//
// --out writes the files into another folder (e.g. to compare before replacing public/models).
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, reorder, transformMesh, join, weld, simplify, meshopt, compactPrimitive } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import {
  compressTextures,
  connectedPieces,
  createQuadMesh,
  matches,
  splitTriangles,
  textureSampler,
} from './lib/gltf-utils.mjs';

// GLTFLoader runs in Node with these globals
globalThis.self = globalThis;
globalThis.window = globalThis;

const args = process.argv.slice(2);
const carId = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--out');
const outDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
if (!carId) {
  console.error('Kullanım: npm run car:convert -- <arac-id> [--cockpit-only | --exterior-only] [--out <klasör>]');
  process.exit(1);
}
const configPath = path.resolve('src/cars', carId, 'convert.mjs');
if (!fs.existsSync(configPath)) {
  console.error(`${configPath} yok. Önce: npm run car:new -- ${carId} <kaynak.glb>`);
  process.exit(1);
}
const cfg = (await import(pathToFileURL(configPath).href)).default;
const outPath = (p) => (outDir ? path.join(outDir, path.basename(p)) : p);

// World matrix of every mesh node in cockpit/car coordinates: source transforms, then the
// configured turn (front to -Z) and scale. Keyed by node name.
async function sourceMatrices() {
  const buf = fs.readFileSync(cfg.source);
  const gltf = await new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.loadTexture = () => Promise.resolve(null);
    loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', resolve, reject);
  });
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);
  const turn = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(cfg.transform?.rotateY ?? 0));

  const box = new THREE.Box3();
  scene.traverse((o) => {
    if (!o.isMesh || matches(cfg.dropNodes || [], o.name)) return;
    box.union(new THREE.Box3().setFromObject(o).applyMatrix4(turn));
  });

  let scale = cfg.transform?.scale;
  if (!scale) {
    scale = cfg.transform.length / (box.max.z - box.min.z);
    console.log(`Ölçek: ${scale.toFixed(4)} (boy ${cfg.transform.length} m)`);
  }

  let post = turn.clone().scale(new THREE.Vector3(scale, scale, scale));
  if (cfg.transform?.center) {
    const dx = -((box.min.x + box.max.x) / 2) * scale;
    const dy = -box.min.y * scale;
    const dz = -((box.min.z + box.max.z) / 2) * scale;
    const centerShift = new THREE.Matrix4().makeTranslation(dx, dy, dz);
    post = centerShift.multiply(post);
  }

  const matrices = new Map();
  scene.traverse((o) => {
    if (o.isMesh) matrices.set(o.name, post.clone().multiply(o.matrixWorld));
  });
  return matrices;
}

async function readSource() {
  await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
  const doc = await io.read(cfg.source);
  return { io, doc, root: doc.getRoot() };
}

function dropNode(n) {
  n.detach();
  n.dispose();
}

async function save(io, doc, file) {
  const buf = await io.writeBinary(doc);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(buf));
  const tris = countTris(doc);
  console.log(`  Kaydedildi: ${file} (${(buf.byteLength / 1048576).toFixed(2)} MB, ${tris} üçgen, ${doc.getRoot().listMaterials().length} malzeme)`);
}

const countTris = (doc) =>
  doc
    .getRoot()
    .listMeshes()
    .flatMap((m) => m.listPrimitives())
    .reduce((n, p) => n + (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3, 0);

// Optional mesh simplification.
//   { targetTris, maxError = 0.01 }: world-space mode (geometry is already in metres). Every part
//     is simplified with the same absolute error, so small parts (badges, grilles) shrink as much
//     as big panels; the smallest error that reaches targetTris is searched, capped at maxError.
//     Normals steer the collapses, seams may be crossed, specks smaller than the error vanish.
//   { ratio, error }: per-mesh relative mode of glTF-Transform's simplify (borders locked).
async function simplifyDoc(doc, opts) {
  if (!opts) return;
  await MeshoptSimplifier.ready;
  await doc.transform(prune(), weld()); // only what is still in the scene counts
  const before = countTris(doc);
  if (!opts.targetTris) {
    await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: opts.ratio, error: opts.error ?? 0.0005, lockBorder: true }));
    console.log(`  Sadeleştirme: ${before} → ${countTris(doc)} üçgen`);
    return;
  }
  const excludedMeshes = new Set();
  if (opts.excludeNodes) {
    const nodeNames = new Set(opts.excludeNodes);
    for (const node of doc.getRoot().listNodes()) {
      if (nodeNames.has(node.getName()) && node.getMesh()) {
        excludedMeshes.add(node.getMesh());
      }
    }
  }
  const prims = doc
    .getRoot()
    .listMeshes()
    .filter((m) => !excludedMeshes.has(m))
    .flatMap((m) => m.listPrimitives())
    .filter((p) => p.getIndices() && p.getMode() === 4)
    .map((p) => ({
      p,
      idx: new Uint32Array(p.getIndices().getArray()),
      pos: new Float32Array(p.getAttribute('POSITION').getArray()),
      nrm: p.getAttribute('NORMAL') ? new Float32Array(p.getAttribute('NORMAL').getArray()) : null,
    }));
  const primsBefore = prims.reduce((sum, { idx }) => sum + idx.length / 3, 0);
  const excludedTris = before - primsBefore;
  const targetForPrims = Math.max(0, opts.targetTris - excludedTris);
  const flags = ['ErrorAbsolute', 'Permissive', 'Prune'];
  const run = (err, apply) => {
    let total = 0;
    for (const { p, idx, pos, nrm } of prims) {
      const [out] = nrm
        ? MeshoptSimplifier.simplifyWithAttributes(idx, pos, 3, nrm, 3, [0.25, 0.25, 0.25], null, 0, err, flags)
        : MeshoptSimplifier.simplify(idx, pos, 3, 0, err, flags);
      total += out.length / 3;
      if (apply) p.getIndices().setArray(out);
    }
    return total;
  };
  const maxError = opts.maxError ?? 0.01;
  let lo = 0.0001;
  let hi = maxError;
  if (run(hi, false) <= targetForPrims) {
    for (let i = 0; i < 10; i++) {
      const mid = Math.sqrt(lo * hi);
      if (run(mid, false) > targetForPrims) lo = mid;
      else hi = mid;
    }
  }
  const after = run(hi, true) + excludedTris;
  for (const { p } of prims) {
    if (p.getIndices().getCount() === 0) p.dispose();
    else compactPrimitive(p);
  }
  console.log(`  Sadeleştirme: ${before} → ${after} üçgen (hata ${(hi * 1000).toFixed(1)} mm${excludedTris ? `, ${excludedTris} üçgen korundu` : ''})` +
    (after > opts.targetTris ? ` — hedefe inmedi: maxError'ı büyüt ya da görünmeyen düğümleri dropNodes ile at` : ''));
}

// Final cleanup; `compress` adds meshopt geometry compression (the game decodes it)
async function finish(doc, opts) {
  await doc.transform(prune(), dedup(), reorder({ encoder: MeshoptEncoder }));
  if (opts.compress) await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
}

// Fewer draw calls: primitives whose material matches a rule take the named target material
// (look-alike dark trims, cabin details seen only from afar), so join() can merge them.
function mergeMaterials(root, rules) {
  if (!rules?.length) return;
  const byName = new Map(root.listMaterials().map((m) => [m.getName(), m]));
  let moved = 0;
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const rule = rules.find(([pattern]) => pattern.test(prim.getMaterial()?.getName() || ''));
      const target = rule && byName.get(rule[1]);
      if (!rule) continue;
      if (!target) throw new Error(`mergeMaterials: hedef malzeme yok: ${rule[1]}`);
      if (prim.getMaterial() !== target) {
        prim.setMaterial(target);
        moved++;
      }
    }
  }
  console.log(`  Malzeme birleştirme: ${moved} parça`);
}

// Untextured materials do not need UVs, tangents or vertex colours; dropping them shrinks the
// file and lets join() merge more primitives
function cleanAttributes(root) {
  let n = 0;
  for (const prim of root.listMeshes().flatMap((m) => m.listPrimitives())) {
    const mat = prim.getMaterial();
    const textured = mat && [mat.getBaseColorTexture(), mat.getNormalTexture(), mat.getEmissiveTexture(), mat.getOcclusionTexture(), mat.getMetallicRoughnessTexture()].some(Boolean);
    const normalMapped = Boolean(mat?.getNormalTexture());
    for (const semantic of prim.listSemantics()) {
      if ((!textured && semantic.startsWith('TEXCOORD')) || (!normalMapped && semantic === 'TANGENT') || semantic.startsWith('COLOR')) {
        prim.setAttribute(semantic, null);
        n++;
      }
    }
  }
  console.log(`  Gereksiz köşe verisi silindi: ${n}`);
}

// PBR fixes; first matching rule wins
function applyMaterialFixes(root, rules) {
  root.listMaterials().forEach((m) => {
    const rule = (rules || []).find(([pattern]) => pattern.test(m.getName() || ''));
    if (!rule) return;
    if (rule[1].metallic !== undefined) m.setMetallicFactor(rule[1].metallic);
    if (rule[1].roughness !== undefined) m.setRoughnessFactor(rule[1].roughness);
    const [r, g, b, a] = m.getBaseColorFactor();
    m.setBaseColorFactor([...(rule[1].color || [r, g, b]), rule[1].alpha ?? a]); // linear RGB
  });
}

// ---------------------------------------------------------------- Exterior

async function buildExterior(matrices) {
  const ex = cfg.exterior;
  console.log('\n--- Dış model ---');
  const { io, doc, root } = await readSource();

  root.listNodes().forEach((n) => {
    if (matches(cfg.dropNodes || [], n.getName()) || (n.getMesh() && matches(ex.dropNodes || [], n.getName()))) dropNode(n);
  });

  const scene = root.listScenes()[0] || doc.createScene();
  const carRoot = doc.createNode('CarRoot');
  scene.addChild(carRoot);
  root.listNodes().forEach((n) => {
    const mesh = n.getMesh();
    let m = mesh && matrices.get(n.getName());
    if (!m) return;
    if (ex.wheelOffset) {
      const matchNode = ex.wheelOffset.nodes && matches(ex.wheelOffset.nodes, n.getName());
      const matchMat =
        ex.wheelOffset.materials &&
        mesh.listPrimitives().some((p) => {
          const matName = p.getMaterial()?.getName() || '';
          return matches(ex.wheelOffset.materials, matName);
        });
      if ((matchNode || matchMat) && !n.getName().includes('Steering')) {
        const shift = new THREE.Matrix4().makeTranslation(...ex.wheelOffset.offset);
        m = shift.multiply(m.clone());
      }
    }
    transformMesh(mesh, Array.from(m.elements));
    if (m.determinant() < 0) {
      for (const prim of mesh.listPrimitives()) {
        const idxAcc = prim.getIndices();
        if (idxAcc) {
          const arr = idxAcc.getArray().slice();
          for (let i = 0; i < arr.length; i += 3) {
            const tmp = arr[i + 1];
            arr[i + 1] = arr[i + 2];
            arr[i + 2] = tmp;
          }
          idxAcc.setArray(arr);
        }
      }
    }
    n.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
    carRoot.addChild(n);
  });

  // Assign specific materials to named nodes before global rename (e.g. separate shared lights)
  if (ex.assignNodeMaterials) {
    for (const rule of ex.assignNodeMaterials) {
      for (const node of root.listNodes()) {
        if (!matches([rule.node], node.getName())) continue;
        const mesh = node.getMesh();
        if (!mesh) continue;
        for (const prim of mesh.listPrimitives()) {
          const oldMat = prim.getMaterial();
          if (!oldMat) continue;
          const newMat = oldMat.clone();
          newMat.setName(rule.materialName);
          prim.setMaterial(newMat);
        }
      }
    }
  }

  // Rename materials to what the game expects (paint, glass, head*, tail*, ...)
  root.listMaterials().forEach((mat) => {
    const rule = (ex.renameMaterials || []).find(([pattern]) => pattern.test(mat.getName() || ''));
    if (rule) mat.setName(rule[1]);
  });

  mergeMaterials(root, ex.mergeMaterials);
  applyMaterialFixes(root, ex.materials);
  if (ex.cleanAttributes) cleanAttributes(root);
  await simplifyDoc(doc, ex.simplify);
  if (ex.join !== false) await doc.transform(join());
  await compressTextures(doc, { quality: ex.webpQuality ?? 85, maxSize: ex.maxTextureSize });
  await finish(doc, ex);
  await save(io, doc, outPath(ex.out));
}

// ---------------------------------------------------------------- Cockpit

// Splits the steering wheel node into the turning wheel (vertices relative to the hub pivot)
// and the static column (pieces reaching further forward than `columnBeyondZ`).
function splitSteering(doc, root, matrices, st) {
  const node = root.listNodes().find((n) => n.getName() === st.node);
  if (!node?.getMesh()) {
    console.warn(`  Direksiyon düğümü yok: ${st.node}`);
    return {};
  }
  const wm = matrices.get(st.node);
  const prim = node.getMesh().listPrimitives()[0];
  const posAcc = prim.getAttribute('POSITION');
  const normAcc = prim.getAttribute('NORMAL');
  const uvAcc = prim.getAttribute('TEXCOORD_0');
  const idx = prim.getIndices().getArray();
  const mat = prim.getMaterial();
  const N = posAcc.getCount();

  const P = new Float32Array(N * 3);
  const Norms = new Float32Array(N * 3);
  const v = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(wm);
  for (let i = 0; i < N; i++) {
    v.fromArray(posAcc.getElement(i, [0, 0, 0])).applyMatrix4(wm).toArray(P, i * 3);
    if (normAcc) v.fromArray(normAcc.getElement(i, [0, 0, 0])).applyMatrix3(normalMatrix).normalize().toArray(Norms, i * 3);
  }

  const find = connectedPieces(N, (i) => [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]], idx, 2000);
  const pieceMinZ = new Map();
  const pieceCenters = new Map();
  const pieceCounts = new Map();
  for (let t = 0; t < idx.length; t += 3) {
    const r = find(idx[t]);
    let mz = pieceMinZ.get(r) ?? 999;
    let c = pieceCenters.get(r);
    if (!c) { c = [0, 0, 0]; pieceCenters.set(r, c); }
    for (let k = 0; k < 3; k++) {
      const z = P[idx[t + k] * 3 + 2];
      mz = Math.min(mz, z);
      c[0] += P[idx[t + k] * 3];
      c[1] += P[idx[t + k] * 3 + 1];
      c[2] += z;
    }
    pieceMinZ.set(r, mz);
    pieceCounts.set(r, (pieceCounts.get(r) || 0) + 3);
  }
  for (const [r, c] of pieceCenters.entries()) {
    const cnt = pieceCounts.get(r);
    c[0] /= cnt; c[1] /= cnt; c[2] /= cnt;
  }

  const wheelIdx = [];
  const columnIdx = [];
  for (let t = 0; t < idx.length; t += 3) {
    let isWheel = false;
    if (st.maxPieceDistance !== undefined) {
      const c = pieceCenters.get(find(idx[t]));
      const dist = Math.hypot(c[0] - st.pivot[0], c[1] - st.pivot[1], c[2] - st.pivot[2]);
      isWheel = dist <= st.maxPieceDistance;
    } else if (st.columnBeyondZ !== undefined) {
      isWheel = pieceMinZ.get(find(idx[t])) >= st.columnBeyondZ;
    } else {
      isWheel = true;
    }
    const target = isWheel ? wheelIdx : columnIdx;
    target.push(idx[t], idx[t + 1], idx[t + 2]);
  }

  const subPrim = (indices, shift) => {
    const oldToNew = new Map();
    const pos = [];
    const nrm = [];
    const uv = [];
    const out = [];
    for (const o of indices) {
      if (!oldToNew.has(o)) {
        oldToNew.set(o, pos.length / 3);
        pos.push(P[o * 3] - shift[0], P[o * 3 + 1] - shift[1], P[o * 3 + 2] - shift[2]);
        nrm.push(Norms[o * 3], Norms[o * 3 + 1], Norms[o * 3 + 2]);
        const u = uvAcc ? uvAcc.getElement(o, [0, 0]) : [0, 0];
        uv.push(u[0], u[1]);
      }
      out.push(oldToNew.get(o));
    }
    const p = doc
      .createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(pos)))
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(nrm)))
      .setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(new Float32Array(uv)))
      .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(out)));
    if (mat) p.setMaterial(mat);
    return p;
  };

  const wheelMesh = doc.createMesh('MeshSteeringWheel').addPrimitive(subPrim(wheelIdx, st.pivot));
  node.setName('steering_wheel').setMesh(wheelMesh).setTranslation(st.pivot).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
  node.setExtras({ pivot: st.pivot, axis: st.axis, radius: st.radius });
  let columnNode = null;
  if (columnIdx.length) {
    const columnMesh = doc.createMesh('MeshSteeringColumn').addPrimitive(subPrim(columnIdx, [0, 0, 0]));
    columnNode = doc.createNode('steering_column').setMesh(columnMesh).setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
  }
  console.log(`  Direksiyon: ${wheelIdx.length / 3} üçgen dönüyor, kolon ${columnIdx.length / 3} üçgen sabit`);
  return { wheelMesh, columnNode };
}

// Pieces of other meshes lying completely inside the wheel's disc turn with the wheel
function moveWheelTrim(doc, nodeByName, wheelMesh, st, trim) {
  const P = new THREE.Vector3().fromArray(st.pivot);
  const A = new THREE.Vector3().fromArray(st.axis).normalize();
  const v = new THREE.Vector3();
  const [a0, a1] = trim.axial ?? [-0.1, 0.02];
  const radius = trim.radius ?? st.radius + 0.015;
  const inDisc = (pos, i) => {
    v.fromArray(pos.getElement(i, [])).sub(P);
    const d = v.dot(A);
    return d > a0 && d < a1 && v.addScaledVector(A, -d).length() < radius;
  };
  // '*' scans every kept node (the safest choice: hand-picked lists tend to miss a trim piece)
  const sources = trim.from === '*' ? cfg.cockpit.keepNodes : trim.from;
  for (const src of sources) {
    const prim = nodeByName(src)?.getMesh()?.listPrimitives()[0];
    if (!prim?.getIndices()) continue;
    const pos = prim.getAttribute('POSITION');
    const idx = prim.getIndices().getArray();
    const find = connectedPieces(pos.getCount(), (i) => pos.getElement(i, []), idx, 4000);
    const outside = new Set();
    for (let i = 0; i < pos.getCount(); i++) if (!inDisc(pos, i)) outside.add(find(i));
    const piece = splitTriangles(doc, prim, (a) => !outside.has(find(a)));
    if (!piece) continue;
    const arr = piece.getAttribute('POSITION').getArray().slice();
    for (let i = 0; i < arr.length; i += 3) for (let k = 0; k < 3; k++) arr[i + k] -= st.pivot[k];
    piece.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(arr));

    const shiftUV = trim.shiftUV?.[src];
    if (shiftUV) {
      const uvAcc = piece.getAttribute('TEXCOORD_0');
      if (uvAcc) {
        const uvs = uvAcc.getArray().slice();
        for (let i = 0; i < uvs.length; i += 2) {
          uvs[i] += shiftUV[0] || 0;
          uvs[i + 1] += shiftUV[1] || 0;
        }
        piece.setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(uvs));
      }
    }

    wheelMesh.addPrimitive(piece);
    console.log(`  Direksiyona taşındı: ${piece.getIndices().getCount() / 3} üçgen (${src})`);
  }
}

function addSteeringBezel(doc, root, wheelMesh, st) {
  const b = st.bezel;
  if (!b) return;
  const A = new THREE.Vector3(...st.axis).normalize();
  const up = new THREE.Vector3(0, 1, 0).addScaledVector(A, -A.y).normalize();
  const right = new THREE.Vector3().crossVectors(up, A).normalize();

  const C = new THREE.Vector3(
    b.center[0] - st.pivot[0],
    b.center[1] - st.pivot[1],
    b.center[2] - st.pivot[2]
  );
  if (b.offset) C.addScaledVector(A, b.offset);

  const radSegs = b.radialSegments || 64;
  const tubSegs = b.tubularSegments || 12;
  const radius = b.radius || 0.0385;
  const tubeRadius = b.tubeRadius || 0.0012;

  const pos = [];
  const nrm = [];
  const idx = [];

  for (let i = 0; i <= radSegs; i++) {
    const phi = (i / radSegs) * Math.PI * 2;
    const cPt = C.clone()
      .addScaledVector(right, Math.cos(phi) * radius)
      .addScaledVector(up, Math.sin(phi) * radius);
    const radDir = cPt.clone().sub(C).addScaledVector(A, -cPt.clone().sub(C).dot(A)).normalize();

    for (let j = 0; j <= tubSegs; j++) {
      const psi = (j / tubSegs) * Math.PI * 2;
      const pt = cPt.clone()
        .addScaledVector(radDir, Math.cos(psi) * tubeRadius)
        .addScaledVector(A, Math.sin(psi) * tubeRadius);
      const n = pt.clone().sub(cPt).normalize();

      pos.push(pt.x, pt.y, pt.z);
      nrm.push(n.x, n.y, n.z);
    }
  }

  for (let i = 0; i < radSegs; i++) {
    for (let j = 0; j < tubSegs; j++) {
      const a = i * (tubSegs + 1) + j;
      const b = (i + 1) * (tubSegs + 1) + j;
      const c = (i + 1) * (tubSegs + 1) + (j + 1);
      const d = i * (tubSegs + 1) + (j + 1);
      idx.push(a, b, d);
      idx.push(b, c, d);
    }
  }

  const matName = b.material || 'chrome';
  const mat = root.listMaterials().find((m) => m.getName() === matName) ||
    doc.createMaterial(matName).setMetallicFactor(0.9).setRoughnessFactor(0.18).setBaseColorFactor([0.85, 0.85, 0.88, 1]);

  const prim = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(pos)))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(nrm)))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(idx)))
    .setMaterial(mat);

  wheelMesh.addPrimitive(prim);
  console.log(`  Direksiyon halkası eklendi: ${idx.length / 3} üçgen (${matName})`);
}

async function buildCockpit(matrices) {
  const ck = cfg.cockpit;
  console.log('\n--- Kokpit ---');
  const { io, doc, root } = await readSource();
  const keep = new Set(ck.keepNodes);

  root.listNodes().forEach((n) => {
    if ((n.getMesh() && !keep.has(n.getName())) || matches(cfg.dropNodes || [], n.getName())) dropNode(n);
  });

  const { wheelMesh, columnNode } = ck.steering ? splitSteering(doc, root, matrices, ck.steering) : {};

  // Bake world transforms into every other mesh
  root.listNodes().forEach((n) => {
    const name = n.getName();
    const m = n.getMesh() && name !== 'steering_wheel' && name !== 'steering_column' && matrices.get(name);
    if (!m) return;
    transformMesh(n.getMesh(), Array.from(m.elements));
    if (m.determinant() < 0) {
      for (const prim of n.getMesh().listPrimitives()) {
        const idxAcc = prim.getIndices();
        if (idxAcc) {
          const arr = idxAcc.getArray().slice();
          for (let i = 0; i < arr.length; i += 3) {
            const tmp = arr[i + 1];
            arr[i + 1] = arr[i + 2];
            arr[i + 2] = tmp;
          }
          idxAcc.setArray(arr);
        }
      }
    }
    n.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
  });

  const scene = root.listScenes()[0] || doc.createScene();
  const cockpitRoot = doc.createNode('CockpitRoot');
  scene.addChild(cockpitRoot);
  if (columnNode) cockpitRoot.addChild(columnNode);
  if (ck.eye) scene.setExtras({ eye: ck.eye });

  const nodeByName = (name) =>
    root.listNodes().find((n) => n.getName() === name) ||
    (columnNode && (name === 'steering_column' || name === ck.steering?.node) ? columnNode : null);
  if (wheelMesh && ck.wheelTrim) moveWheelTrim(doc, nodeByName, wheelMesh, ck.steering, ck.wheelTrim);
  if (wheelMesh && ck.steering?.bezel) addSteeringBezel(doc, root, wheelMesh, ck.steering);

  // Mirrors: the model's own glass triangles. Picked by UV island (u taken modulo 1) and/or by
  // the triangle centre's x/y/z ranges and facing (for untextured glass, or both mirrors in one node)
  const frac = (x) => x - Math.floor(x);
  if (ck.mirrors?.length) {
    const mirrorMat = doc.createMaterial('MirrorMaterial').setRoughnessFactor(0.0).setMetallicFactor(1.0);
    for (const { name, from, uv: box, x, y, z, facing } of ck.mirrors) {
      const prim = nodeByName(from)?.getMesh()?.listPrimitives()[0];
      const uv = prim?.getAttribute('TEXCOORD_0');
      const pos = prim?.getAttribute('POSITION');
      const e = [];
      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      const c = new THREE.Vector3();
      const face = facing && new THREE.Vector3().fromArray(facing).normalize();
      const within = (range, value) => !range || (value >= range[0] && value <= range[1]);
      const pick = (...ids) => {
        if (box && !ids.every((i) => {
          uv.getElement(i, e);
          return frac(e[0]) >= box[0] && frac(e[0]) <= box[1] && e[1] >= box[2] && e[1] <= box[3];
        })) return false;
        a.fromArray(pos.getElement(ids[0], []));
        b.fromArray(pos.getElement(ids[1], []));
        c.fromArray(pos.getElement(ids[2], []));
        const centre = a.clone().add(b).add(c).divideScalar(3);
        if (!within(x, centre.x) || !within(y, centre.y) || !within(z, centre.z)) return false;
        return !face || b.sub(a).cross(c.sub(a)).normalize().dot(face) > 0.5;
      };
      const glass = prim && splitTriangles(doc, prim, pick);
      if (!glass) {
        console.warn(`  Ayna camı bulunamadı: ${name}`);
        continue;
      }
      glass.setMaterial(mirrorMat);
      cockpitRoot.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(glass)));
      console.log(`  ${name}: ${glass.getIndices().getCount() / 3} üçgen (${from})`);
    }
  }

  // Ambient strips painted in the atlas become one 'ambient_led' mesh lit by the game
  if (ck.ambientLed) {
    const { from, minBlue = 90, overRed = 1.6, overGreen = 1.3 } = ck.ambientLed;
    const ledPrims = [];
    let ledTex = null;
    for (const src of from) {
      const prim = nodeByName(src)?.getMesh()?.listPrimitives()[0];
      const tex = prim?.getMaterial()?.getBaseColorTexture();
      if (!tex) continue;
      const sample = await textureSampler(tex);
      const uv = prim.getAttribute('TEXCOORD_0');
      const e = [];
      const led = splitTriangles(doc, prim, (...ids) => {
        let u = 0;
        let w = 0;
        for (const i of ids) {
          uv.getElement(i, e);
          u += e[0] / 3;
          w += e[1] / 3;
        }
        const [r, g, b] = sample(u, w);
        return b > minBlue && b > r * overRed && b > g * overGreen;
      });
      if (led) {
        ledPrims.push(led);
        ledTex = tex;
      }
    }
    if (ledPrims.length) {
      const ledMat = doc.createMaterial('AmbientLED').setBaseColorTexture(ledTex);
      const ledMesh = doc.createMesh('ambient_led');
      ledPrims.forEach((p) => ledMesh.addPrimitive(p.setMaterial(ledMat)));
      cockpitRoot.addChild(doc.createNode('ambient_led').setMesh(ledMesh));
      console.log(`  ambient_led: ${ledPrims.reduce((n, p) => n + p.getIndices().getCount() / 3, 0)} üçgen`);
    } else {
      console.warn('  Ambiyans şeridi bulunamadı (ambientLed eşiklerini kontrol et)');
    }
  }

  // Footwell floor for models without one
  if (ck.floor) {
    const { y, x: [x0, x1], z: [z0, z1], color = [0.018, 0.018, 0.02] } = ck.floor;
    const floorMat = doc.createMaterial('FootwellFloor').setBaseColorFactor([...color, 1]).setRoughnessFactor(1.0).setMetallicFactor(0.0);
    const floorMesh = createQuadMesh(doc, 'FloorMesh', floorMat, [[x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0]]);
    cockpitRoot.addChild(doc.createNode('cabin_floor').setMesh(floorMesh));
  }

  root.listNodes().forEach((n) => {
    if (keep.has(n.getName()) || n.getName() === 'steering_wheel') cockpitRoot.addChild(n);
  });

  mergeMaterials(root, ck.mergeMaterials);
  applyMaterialFixes(root, ck.materials);
  if (ck.cleanAttributes) cleanAttributes(root);

  await simplifyDoc(doc, ck.simplify);
  // Fewer draw calls: everything except the nodes the game looks up by name (wheel, mirrors,
  // LED strips, floor, and `keepSeparate` for atlasPatches / satinPieces) is joined by material
  if (ck.join) {
    const separate = new Set(['steering_wheel', 'steering_column', 'mirror_left', 'mirror_right', 'mirror_center', 'ambient_led', 'cabin_floor', ...(ck.keepSeparate || [])]);
    await doc.transform(join({ filter: (node) => !separate.has(node.getName()) }));
  }
  await compressTextures(doc, { quality: ck.webpQuality ?? 90, maxSize: ck.maxTextureSize });
  await finish(doc, ck);
  await save(io, doc, outPath(ck.out));
}

// ---------------------------------------------------------------- Main

console.log(`Araç: ${carId} — kaynak ${cfg.source}`);
const matrices = await sourceMatrices();
if (cfg.cockpit?.keepNodes?.length && !args.includes('--exterior-only')) await buildCockpit(matrices);
else if (cfg.cockpit && !args.includes('--exterior-only')) console.log('\nKokpit atlandı: cockpit.keepNodes boş.');
if (cfg.exterior && !args.includes('--cockpit-only')) await buildExterior(matrices);
console.log('\nBitti.');
