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
    const pivot = [-0.3745, 0.880, -0.335];
    const axis = [0.005, 0.368, 0.930];

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
  // Driver sits at X = -0.375 (directly behind wheel center -0.3745), Y = 1.12, Z = 0.12
  defaultScene.setExtras({
    eye: [-0.375, 1.12, 0.12],
  });

  // Mirror glass material (will be overridden by CarCockpit.applyMirror with render target)
  const mirrorMat = doc.createMaterial('MirrorMaterial')
    .setRoughnessFactor(0.0)
    .setMetallicFactor(1.0);

  // Left wing mirror quad (facing back towards driver)
  // bl, br, tr, tl
  const leftMirrorMesh = createQuadMesh(doc, 'MirrorLeftMesh', mirrorMat, [
    [-0.99, 0.89, -0.61],
    [-0.85, 0.89, -0.63],
    [-0.85, 0.99, -0.63],
    [-0.99, 0.99, -0.61],
  ]);
  const leftMirrorNode = doc.createNode('mirror_left').setMesh(leftMirrorMesh);
  cockpitRoot.addChild(leftMirrorNode);

  // Right wing mirror quad
  const rightMirrorMesh = createQuadMesh(doc, 'MirrorRightMesh', mirrorMat, [
    [0.85, 0.89, -0.63],
    [0.99, 0.89, -0.61],
    [0.99, 0.99, -0.61],
    [0.85, 0.99, -0.63],
  ]);
  const rightMirrorNode = doc.createNode('mirror_right').setMesh(rightMirrorMesh);
  cockpitRoot.addChild(rightMirrorNode);

  // Center rear-view mirror quad
  const centerMirrorMesh = createQuadMesh(doc, 'MirrorCenterMesh', mirrorMat, [
    [-0.13, 1.20, -0.38],
    [0.13, 1.20, -0.38],
    [0.13, 1.28, -0.38],
    [-0.13, 1.28, -0.38],
  ]);
  const centerMirrorNode = doc.createNode('mirror_center').setMesh(centerMirrorMesh);
  cockpitRoot.addChild(centerMirrorNode);

  // Footwell floor plane
  const floorMat = doc.createMaterial('FootwellFloor')
    .setBaseColorFactor([0.08, 0.08, 0.09, 1.0])
    .setRoughnessFactor(0.9)
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
  await buildExteriorModel(matrices);
  console.log('\nAll models generated successfully!');
}

main().catch(console.error);
