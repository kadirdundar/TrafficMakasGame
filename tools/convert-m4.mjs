import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { NodeIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, reorder, transformMesh, join } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';

// Polyfills for running loaders in Node.js
globalThis.self = globalThis;
globalThis.window = globalThis;

const INPUT_PATH = 'model-kaynak/2025_bmw_m4_cs_vr46_edition.glb';
const COCKPIT_OUT = 'public/models/bmw-m4-cockpit.glb';
const EXTERIOR_OUT = 'public/models/bmw-m4.glb';

// Normalization factor: original model length is ~1.712m, real M4 length is 4.794m
const SCALE = 2.80;

// Steering wheel hub centre and column axis (towards the driver), in cockpit coordinates
const WHEEL_PIVOT = [-0.3745, 0.880, -0.335];
const WHEEL_AXIS = [0.005, 0.368, 0.930];

async function loadSourceWorldMatrices() {
  const buf = fs.readFileSync(INPUT_PATH);
  const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.loadTexture = () => Promise.resolve(null);
    loader.parse(
      arrayBuf,
      '',
      (gltf) => {
        const scene = gltf.scene;
        scene.updateMatrixWorld(true);

        // M_post: rotate 180° around Y (front towards -Z) and scale by 2.80
        const mPost = new THREE.Matrix4()
          .makeRotationY(Math.PI)
          .scale(new THREE.Vector3(SCALE, SCALE, SCALE));

        const matrices = new Map();
        scene.traverse((o) => {
          if (o.isMesh) {
            const m = mPost.clone().multiply(o.matrixWorld);
            matrices.set(o.name, m);
          }
        });
        resolve({ scene, matrices, mPost });
      },
      reject
    );
  });
}

// Convert textures in the document to high-quality WebP
async function compressTexturesToWebP(doc, quality = 90) {
  const textures = doc.getRoot().listTextures();
  console.log(`Compressing ${textures.length} textures to WebP (quality ${quality})...`);
  for (const tex of textures) {
    const img = tex.getImage();
    if (!img) continue;
    try {
      const webpBuf = await sharp(img).webp({ quality, effort: 4 }).toBuffer();
      tex.setImage(webpBuf);
      tex.setMimeType('image/webp');
    } catch (err) {
      console.warn('Could not compress texture to webp:', err.message);
    }
  }
}

// Helper to create a flat quad mesh in glTF-Transform
function createQuadMesh(doc, name, mat, corners) {
  const mesh = doc.createMesh(name);
  const prim = doc.createPrimitive();

  // corners: [bl, br, tr, tl]
  const positions = new Float32Array([
    ...corners[0],
    ...corners[1],
    ...corners[2],
    ...corners[3],
  ]);
  const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

  // Compute normal from first 3 corners
  const v0 = new THREE.Vector3(...corners[0]);
  const v1 = new THREE.Vector3(...corners[1]);
  const v2 = new THREE.Vector3(...corners[2]);
  const n = new THREE.Vector3().crossVectors(v1.sub(v0), v2.sub(v0)).normalize();
  const normals = new Float32Array([
    n.x, n.y, n.z,
    n.x, n.y, n.z,
    n.x, n.y, n.z,
    n.x, n.y, n.z,
  ]);

  const posAcc = doc.createAccessor().setType('VEC3').setArray(positions);
  const uvAcc = doc.createAccessor().setType('VEC2').setArray(uvs);
  const normAcc = doc.createAccessor().setType('VEC3').setArray(normals);
  const idxAcc = doc.createAccessor().setType('SCALAR').setArray(indices);

  prim.setAttribute('POSITION', posAcc);
  prim.setAttribute('TEXCOORD_0', uvAcc);
  prim.setAttribute('NORMAL', normAcc);
  prim.setIndices(idxAcc);
  if (mat) prim.setMaterial(mat);

  mesh.addPrimitive(prim);
  return mesh;
}

// Moves the triangles of `prim` for which keep(a, b, c) returns true into a new primitive
// (same material, only the used vertices). The source primitive keeps the rest.
function splitTriangles(doc, prim, keep) {
  const idxAcc = prim.getIndices();
  const idx = idxAcc.getArray();
  const stay = [];
  const moved = [];
  for (let t = 0; t < idx.length; t += 3) {
    (keep(idx[t], idx[t + 1], idx[t + 2]) ? moved : stay).push(idx[t], idx[t + 1], idx[t + 2]);
  }
  if (!moved.length) return null;
  idxAcc.setArray(new Uint32Array(stay));

  const remap = new Map();
  for (const i of moved) if (!remap.has(i)) remap.set(i, remap.size);
  const out = doc.createPrimitive().setMaterial(prim.getMaterial());
  for (const semantic of prim.listSemantics()) {
    const src = prim.getAttribute(semantic);
    const size = src.getElementSize();
    const arr = new Float32Array(remap.size * size);
    const el = [];
    for (const [oldI, newI] of remap) {
      src.getElement(oldI, el);
      for (let k = 0; k < size; k++) arr[newI * size + k] = el[k];
    }
    out.setAttribute(semantic, doc.createAccessor().setType(src.getType()).setArray(arr));
  }
  out.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(moved.map((i) => remap.get(i)))));
  return out;
}

// Returns (u, v) => [r, g, b] for a texture, sampling with repeat wrapping.
async function textureSampler(tex) {
  const { data, info } = await sharp(Buffer.from(tex.getImage())).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return (u, v) => {
    const x = Math.min(info.width - 1, Math.floor((u - Math.floor(u)) * info.width));
    const y = Math.min(info.height - 1, Math.floor((v - Math.floor(v)) * info.height));
    const i = (y * info.width + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };
}

async function buildCockpitModel(matrices) {
  console.log('\n--- Building Cockpit Model ---');
  await MeshoptEncoder.ready;
  const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
  const doc = await io.read(INPUT_PATH);
  const root = doc.getRoot();

  // Retain only valid cockpit nodes.
  // Note: Object_56 (windshield/glass) is intentionally omitted so the windshield aperture
  // is crystal clear and unobstructed by dark tinted glass.
  const COCKPIT_NODES = new Set([
    'Object_35',  // steering wheel & steering column
    'Object_62',  // interior seats, dashboard, console, pedals, curved display
    'Object_154', // carbon fiber interior details, seatbacks, console trim
    'Object_86',  // driver door inner card
    'Object_93',  // passenger door inner card
    'Object_88',  // driver door window frame & mirror
    'Object_95',  // passenger door window frame & mirror
    'Object_82',  // driver door outer skin
    'Object_91',  // passenger door outer skin
    'Object_64',  // dashboard structure, cowl, vents
    'Object_52',  // body roof, A-pillars
    'Object_60',  // hood (power dome seen through windshield)
    'Object_148', // carbon roof
    'Object_8',   // black stripes
    'Object_20',  // black stripes
    'Object_14',  // red accents
    'Object_169', // red accents
    'Object_175', // red accents
  ]);

  // Keep only cockpit nodes
  root.listNodes().forEach((n) => {
    const m = n.getMesh();
    if (m && !COCKPIT_NODES.has(n.getName())) {
      n.detach();
      n.dispose();
    }
    if (n.getName().startsWith('Plane.')) {
      n.detach();
      n.dispose();
    }
  });

  // Split Object_35 into steering_wheel and steering_column
  let swMesh = null;
  let swNode = null;
  let columnMesh = null;
  let columnNode = null;

  const o35Node = root.listNodes().find((n) => n.getName() === 'Object_35');
  if (o35Node && o35Node.getMesh()) {
    const wm = matrices.get('Object_35');
    const prim = o35Node.getMesh().listPrimitives()[0];
    const posAcc = prim.getAttribute('POSITION');
    const normAcc = prim.getAttribute('NORMAL');
    const uvAcc = prim.getAttribute('TEXCOORD_0');
    const idx = prim.getIndices().getArray();
    const mat = prim.getMaterial();
    const N = posAcc.getCount();

    // Compute transformed vertex positions
    const P = new Float32Array(N * 3);
    const Norms = new Float32Array(N * 3);
    const v = new THREE.Vector3();
    const nv = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(wm);

    for (let i = 0; i < N; i++) {
      v.fromArray(posAcc.getElement(i, [0, 0, 0])).applyMatrix4(wm);
      P[i * 3] = v.x;
      P[i * 3 + 1] = v.y;
      P[i * 3 + 2] = v.z;

      if (normAcc) {
        nv.fromArray(normAcc.getElement(i, [0, 0, 0])).applyMatrix3(normalMatrix).normalize();
        Norms[i * 3] = nv.x;
        Norms[i * 3 + 1] = nv.y;
        Norms[i * 3 + 2] = nv.z;
      }
    }

    // Connected components to separate static steering column from rotating wheel
    const parent = new Int32Array(N).map((_, i) => i);
    const find = (a) => { while (parent[a] !== a) a = parent[a] = parent[parent[a]]; return a; };
    const uni = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[a] = b; };
    const key = new Map();
    for (let i = 0; i < N; i++) {
      const k = `${Math.round(P[i * 3] * 2000)},${Math.round(P[i * 3 + 1] * 2000)},${Math.round(P[i * 3 + 2] * 2000)}`;
      if (key.has(k)) uni(i, key.get(k)); else key.set(k, i);
    }
    for (let t = 0; t < idx.length; t += 3) { uni(idx[t], idx[t + 1]); uni(idx[t], idx[t + 2]); }

    const compMinZ = new Map();
    for (let t = 0; t < idx.length; t += 3) {
      const r = find(idx[t]);
      const cur = compMinZ.get(r) ?? 999;
      let mz = cur;
      for (let k = 0; k < 3; k++) mz = Math.min(mz, P[idx[t + k] * 3 + 2]);
      compMinZ.set(r, mz);
    }

    const wheelIndices = [];
    const columnIndices = [];
    for (let t = 0; t < idx.length; t += 3) {
      const r = find(idx[t]);
      if (compMinZ.get(r) < -0.50) {
        columnIndices.push(idx[t], idx[t + 1], idx[t + 2]);
      } else {
        wheelIndices.push(idx[t], idx[t + 1], idx[t + 2]);
      }
    }

    // Wheel pivot and column axis
    // Hub center: X = -0.3745, Y = 0.880, Z = -0.335
    // Column axis: normal pointing out of hub towards driver [0.005, 0.368, 0.930]
    const pivot = WHEEL_PIVOT;
    const axis = WHEEL_AXIS;

    // Helper to build a primitive from index array and vertex data
    function buildSubPrim(indices, shiftPivot = false) {
      const oldToNew = new Map();
      const newPos = [];
      const newNorm = [];
      const newUv = [];
      const newIndices = [];

      for (const oldIdx of indices) {
        if (!oldToNew.has(oldIdx)) {
          const nIdx = newPos.length / 3;
          oldToNew.set(oldIdx, nIdx);

          let px = P[oldIdx * 3];
          let py = P[oldIdx * 3 + 1];
          let pz = P[oldIdx * 3 + 2];
          if (shiftPivot) {
            px -= pivot[0];
            py -= pivot[1];
            pz -= pivot[2];
          }
          newPos.push(px, py, pz);
          newNorm.push(Norms[oldIdx * 3], Norms[oldIdx * 3 + 1], Norms[oldIdx * 3 + 2]);
          const u = uvAcc ? uvAcc.getElement(oldIdx, [0, 0]) : [0, 0];
          newUv.push(u[0], u[1]);
        }
        newIndices.push(oldToNew.get(oldIdx));
      }

      const p = doc.createPrimitive();
      p.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(newPos)));
      p.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(newNorm)));
      p.setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(new Float32Array(newUv)));
      p.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(newIndices)));
      if (mat) p.setMaterial(mat);
      return p;
    }

    // Create wheel mesh (vertices centered on pivot)
    swMesh = doc.createMesh('MeshSteeringWheel').addPrimitive(buildSubPrim(wheelIndices, true));
    swNode = o35Node;
    swNode.setName('steering_wheel');
    swNode.setMesh(swMesh);
    swNode.setTranslation(pivot);
    swNode.setRotation([0, 0, 0, 1]);
    swNode.setScale([1, 1, 1]);
    swNode.setExtras({
      pivot,
      axis,
      radius: 0.185,
    });

    // Create static column mesh (vertices in world space)
    columnMesh = doc.createMesh('MeshSteeringColumn').addPrimitive(buildSubPrim(columnIndices, false));
    columnNode = doc.createNode('steering_column');
    columnNode.setMesh(columnMesh);
    columnNode.setTranslation([0, 0, 0]);
    columnNode.setRotation([0, 0, 0, 1]);
    columnNode.setScale([1, 1, 1]);

    console.log(`Split Object_35 -> Wheel (${wheelIndices.length / 3} tris) at pivot [${pivot.join(', ')}] & Column (${columnIndices.length / 3} tris)`);
  }

  // Bake world transforms into all other meshes
  root.listNodes().forEach((n) => {
    const nodeName = n.getName();
    if (nodeName === 'steering_wheel' || nodeName === 'steering_column') return;
    const mesh = n.getMesh();
    if (!mesh) return;

    const m = matrices.get(nodeName);
    if (!m) return;

    transformMesh(mesh, Array.from(m.elements));
    n.setTranslation([0, 0, 0]);
    n.setRotation([0, 0, 0, 1]);
    n.setScale([1, 1, 1]);
  });

  // Create clean flat scene root
  const defaultScene = root.listScenes()[0] || doc.createScene();
  const cockpitRoot = doc.createNode('CockpitRoot');
  defaultScene.addChild(cockpitRoot);

  if (columnNode) cockpitRoot.addChild(columnNode);

  // Store driver eye in scene extras
  // Driver eye: on the wheel centre line, 0.52 m behind and 0.26 m above the hub (recipe §5.1)
  defaultScene.setExtras({
    eye: [-0.375, 1.14, 0.185],
  });

  const nodeByName = (name) => root.listNodes().find((n) => n.getName() === name);

  // Wheel trim that lives in other meshes (carbon spokes and shift paddles in the carbon mesh,
  // the BMW roundel and a spoke insert in the interior mesh) must turn with the wheel. Every
  // connected piece lying completely inside the wheel's disc is moved into the wheel node.
  // The turn-signal stalk sits further back (axial < -0.1 m) and stays put.
  if (swMesh) {
    const P = new THREE.Vector3().fromArray(WHEEL_PIVOT);
    const A = new THREE.Vector3().fromArray(WHEEL_AXIS).normalize();
    const v = new THREE.Vector3();
    const inDisc = (pos, i) => {
      v.fromArray(pos.getElement(i, [])).sub(P);
      const d = v.dot(A);
      return d > -0.1 && d < 0.02 && v.addScaledVector(A, -d).length() < 0.2;
    };
    for (const src of ['Object_62', 'Object_148']) {
      const prim = nodeByName(src)?.getMesh()?.listPrimitives()[0];
      if (!prim) continue;
      const pos = prim.getAttribute('POSITION');
      const idx = prim.getIndices().getArray();
      const N = pos.getCount();
      const parent = new Int32Array(N).map((_, i) => i);
      const find = (a) => { while (parent[a] !== a) a = parent[a] = parent[parent[a]]; return a; };
      const key = new Map();
      for (let i = 0; i < N; i++) {
        const k = pos.getElement(i, []).map((c) => Math.round(c * 4000)).join(',');
        if (key.has(k)) parent[find(i)] = find(key.get(k)); else key.set(k, i);
      }
      for (let t = 0; t < idx.length; t += 3) {
        parent[find(idx[t + 1])] = find(idx[t]);
        parent[find(idx[t + 2])] = find(idx[t]);
      }
      const outside = new Set();
      for (let i = 0; i < N; i++) if (!inDisc(pos, i)) outside.add(find(i));
      const trim = splitTriangles(doc, prim, (a) => !outside.has(find(a)));
      if (!trim) continue;
      const tp = trim.getAttribute('POSITION');
      const arr = tp.getArray().slice();
      for (let i = 0; i < arr.length; i += 3) for (let k = 0; k < 3; k++) arr[i + k] -= WHEEL_PIVOT[k];
      trim.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(arr));
      swMesh.addPrimitive(trim);
      console.log(`steering_wheel: +${trim.getIndices().getCount() / 3} tris from ${src}`);
    }
  }

  // Mirrors: the model's own mirror glass triangles become the live mirror surfaces
  // (CarCockpit.applyMirror puts the render target on them). Selected by UV island, since the
  // glass is mapped to a flat grey patch of the atlas; the right door mirror uses u + 1.
  const frac = (x) => x - Math.floor(x);
  const uvIn = (prim, box) => {
    const uv = prim.getAttribute('TEXCOORD_0');
    const e = [];
    return (...ids) => ids.every((i) => {
      uv.getElement(i, e);
      return frac(e[0]) >= box[0] && frac(e[0]) <= box[1] && e[1] >= box[2] && e[1] <= box[3];
    });
  };
  const MIRRORS = [
    ['mirror_left', 'Object_88', [0.05, 0.14, 0.77, 0.83]],
    ['mirror_right', 'Object_95', [0.05, 0.14, 0.77, 0.83]],
    ['mirror_center', 'Object_62', [0.68, 0.71, 0.235, 0.255]],
  ];
  const mirrorMat = doc.createMaterial('MirrorMaterial').setRoughnessFactor(0.0).setMetallicFactor(1.0);
  for (const [name, src, box] of MIRRORS) {
    const prim = nodeByName(src)?.getMesh()?.listPrimitives()[0];
    const glass = prim && splitTriangles(doc, prim, uvIn(prim, box));
    if (!glass) { console.warn('Mirror glass not found:', name); continue; }
    glass.setMaterial(mirrorMat);
    cockpitRoot.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(glass)));
    console.log(`${name}: ${glass.getIndices().getCount() / 3} tris from ${src}`);
  }

  // Ambient light strips: the door cards and the dashboard have thin strips painted blue in
  // the atlas. They are split into one 'ambient_led' mesh that the game lights in the chosen
  // ambient colour. The steering wheel is not scanned (its roundel is blue too).
  const ledPrims = [];
  let ledTex = null;
  for (const src of ['Object_62', 'Object_86', 'Object_93']) {
    const prim = nodeByName(src)?.getMesh()?.listPrimitives()[0];
    const tex = prim?.getMaterial()?.getBaseColorTexture();
    if (!tex) continue;
    const sample = await textureSampler(tex);
    const uv = prim.getAttribute('TEXCOORD_0');
    const e = [];
    const led = splitTriangles(doc, prim, (...ids) => {
      let u = 0;
      let v = 0;
      for (const i of ids) { uv.getElement(i, e); u += e[0] / 3; v += e[1] / 3; }
      const [r, g, b] = sample(u, v);
      return b > 90 && b > r * 1.6 && b > g * 1.3;
    });
    if (led) { ledPrims.push(led); ledTex = tex; }
  }
  if (ledPrims.length) {
    // Keeps the atlas so the game can reuse the painted brightness falloff as a mask
    const ledMat = doc.createMaterial('AmbientLED').setBaseColorTexture(ledTex);
    const ledMesh = doc.createMesh('ambient_led');
    ledPrims.forEach((p) => ledMesh.addPrimitive(p.setMaterial(ledMat)));
    cockpitRoot.addChild(doc.createNode('ambient_led').setMesh(ledMesh));
    console.log(`ambient_led: ${ledPrims.reduce((n, p) => n + p.getIndices().getCount() / 3, 0)} tris`);
  }

  // Footwell floor plane
  const floorMat = doc.createMaterial('FootwellFloor')
    .setBaseColorFactor([0.018, 0.018, 0.02, 1.0])
    .setRoughnessFactor(1.0)
    .setMetallicFactor(0.0);
  const floorMesh = createQuadMesh(doc, 'FloorMesh', floorMat, [
    [-0.85, 0.32, -0.2],
    [0.85, 0.32, -0.2],
    [0.85, 0.32, -1.2],
    [-0.85, 0.32, -1.2],
  ]);
  const floorNode = doc.createNode('cabin_floor').setMesh(floorMesh);
  cockpitRoot.addChild(floorNode);

  // Re-parent all kept nodes directly under cockpitRoot
  root.listNodes().forEach((n) => {
    if (COCKPIT_NODES.has(n.getName()) || n.getName() === 'steering_wheel') {
      cockpitRoot.addChild(n);
    }
  });

  // Fix PBR material properties directly in glTF so interior is clear, matte and realistic
  root.listMaterials().forEach((m) => {
    const name = m.getName() || '';
    if (name.includes('interior1.008') || name.includes('interior1.007')) {
      m.setMetallicFactor(0.04);
      m.setRoughnessFactor(0.72);
    } else if (name.includes('plast1.005')) {
      m.setMetallicFactor(0.05);
      m.setRoughnessFactor(0.80);
    } else if (name.includes('InteriorA')) {
      m.setMetallicFactor(0.05);
      m.setRoughnessFactor(0.60);
    } else if (name.includes('Carbon1M')) {
      m.setMetallicFactor(0.25);
      m.setRoughnessFactor(0.22);
    } else if (name.includes('hood1') || name.includes('body1') || name.includes('PAINT')) {
      m.setMetallicFactor(0.85);
      m.setRoughnessFactor(0.22);
    }
  });

  // WebP compression on textures with high quality
  await compressTexturesToWebP(doc, 90);

  await doc.transform(
    prune(),
    dedup(),
    reorder({ encoder: MeshoptEncoder })
  );

  const outBuf = await io.writeBinary(doc);
  fs.writeFileSync(COCKPIT_OUT, Buffer.from(outBuf));
  console.log('Saved', COCKPIT_OUT, `(${(outBuf.byteLength / 1024 / 1024).toFixed(2)} MB)`);
}

async function buildExteriorModel(matrices) {
  console.log('\n--- Building Exterior Model ---');
  await MeshoptEncoder.ready;
  const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
  const doc = await io.read(INPUT_PATH);
  const root = doc.getRoot();

  // Prune sketchfab background planes
  root.listNodes().forEach((n) => {
    if (n.getName().startsWith('Plane.')) {
      n.detach();
      n.dispose();
    }
  });

  const defaultScene = root.listScenes()[0] || doc.createScene();
  const carRoot = doc.createNode('CarRoot');
  defaultScene.addChild(carRoot);

  // Bake world transforms
  root.listNodes().forEach((n) => {
    const mesh = n.getMesh();
    if (!mesh) return;
    const m = matrices.get(n.getName());
    if (m) {
      transformMesh(mesh, Array.from(m.elements));
      n.setTranslation([0, 0, 0]);
      n.setRotation([0, 0, 0, 1]);
      n.setScale([1, 1, 1]);
      carRoot.addChild(n);
    }
  });

  // Material classification
  root.listMaterials().forEach((mat) => {
    const name = mat.getName() || '';
    if (name.includes('m4car_body1') || name.includes('BLACK_PAINT')) {
      mat.setName('paint');
    } else if (name.includes('m4car_glass1')) {
      mat.setName('glass');
    } else if (name.includes('m4car_emissive1')) {
      mat.setName('emissive');
    }
  });

  // Join wheel primitives and shared meshes to reduce draw calls
  await doc.transform(join());

  // WebP compression on textures
  await compressTexturesToWebP(doc, 85);

  await doc.transform(
    prune(),
    dedup(),
    reorder({ encoder: MeshoptEncoder })
  );

  const outBuf = await io.writeBinary(doc);
  fs.writeFileSync(EXTERIOR_OUT, Buffer.from(outBuf));
  console.log('Saved', EXTERIOR_OUT, `(${(outBuf.byteLength / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  console.log('Loading source model world matrices...');
  const { matrices } = await loadSourceWorldMatrices();
  await buildCockpitModel(matrices);
  if (!process.argv.includes('--cockpit-only')) await buildExteriorModel(matrices);
  console.log('\nAll models generated successfully!');
}

main().catch(console.error);
