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

// Convert all textures in the document to WebP
async function compressTexturesToWebP(doc) {
  const textures = doc.getRoot().listTextures();
  console.log(`Compressing ${textures.length} textures to WebP...`);
  for (const tex of textures) {
    const img = tex.getImage();
    if (!img) continue;
    try {
      const webpBuf = await sharp(img).webp({ quality: 85, effort: 4 }).toBuffer();
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

  const COCKPIT_NODES = new Set([
    'Object_35',  // steering wheel
    'Object_62',  // interior seats, dashboard, console, floor, pedals
    'Object_154', // carbon interior details
    'Object_86',  // driver door inner card
    'Object_93',  // passenger door inner card
    'Object_88',  // driver door window frame & mirror
    'Object_95',  // passenger door window frame & mirror
    'Object_82',  // driver door outer skin
    'Object_91',  // passenger door outer skin
    'Object_64',  // dashboard structure, cowl, pillar casing
    'Object_56',  // glass
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

  // Bake world transforms into mesh geometries
  let swMesh = null;
  let swNode = null;

  root.listNodes().forEach((n) => {
    const nodeName = n.getName();
    const mesh = n.getMesh();
    if (!mesh) return;

    const m = matrices.get(nodeName);
    if (!m) return;

    if (nodeName === 'Object_35') {
      swMesh = mesh;
      swNode = n;
      transformMesh(mesh, Array.from(m.elements));
    } else {
      transformMesh(mesh, Array.from(m.elements));
      n.setTranslation([0, 0, 0]);
      n.setRotation([0, 0, 0, 1]);
      n.setScale([1, 1, 1]);
    }
  });

  // Calculate steering wheel hub center in world coordinates
  if (swMesh && swNode) {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    swMesh.listPrimitives().forEach((p) => {
      const pos = p.getAttribute('POSITION');
      const pmin = pos.getMin([]);
      const pmax = pos.getMax([]);
      for (let i = 0; i < 3; i++) {
        if (pmin[i] < min[i]) min[i] = pmin[i];
        if (pmax[i] > max[i]) max[i] = pmax[i];
      }
    });

    const pivot = [
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2,
    ];

    console.log('Steering wheel pivot point:', pivot.map((v) => v.toFixed(4)));

    // Shift steering wheel mesh vertices so pivot is at local (0, 0, 0)
    const shiftMat = new THREE.Matrix4().makeTranslation(-pivot[0], -pivot[1], -pivot[2]);
    transformMesh(swMesh, Array.from(shiftMat.elements));

    // Place swNode at pivot
    swNode.setName('steering_wheel');
    swNode.setTranslation(pivot);
    swNode.setRotation([0, 0, 0, 1]);
    swNode.setScale([1, 1, 1]);
    swNode.setExtras({
      pivot,
      axis: [0, 0.42, -0.91], // steering column vector sloping toward driver (+Y, -Z)
      radius: 0.18,
    });
  }

  // Create clean flat scene root
  const defaultScene = root.listScenes()[0] || doc.createScene();
  const cockpitRoot = doc.createNode('CockpitRoot');
  defaultScene.addChild(cockpitRoot);

  // Store driver eye in scene extras
  // Driver eye is ~0.52m behind wheel hub (-0.503 -> 0.02m) and ~0.36m above (0.815 -> 1.18m)
  defaultScene.setExtras({
    eye: [-0.434, 1.18, 0.02],
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

  // Interior rearview mirror quad
  const centerMirrorMesh = createQuadMesh(doc, 'MirrorCenterMesh', mirrorMat, [
    [-0.11, 1.23, -0.38],
    [0.11, 1.23, -0.38],
    [0.11, 1.30, -0.38],
    [-0.11, 1.30, -0.38],
  ]);
  const centerMirrorNode = doc.createNode('mirror_center').setMesh(centerMirrorMesh);
  cockpitRoot.addChild(centerMirrorNode);

  // Close the footwell with a floor plane so the road never shows through
  const floorMat = doc.createMaterial('FootwellFloor')
    .setBaseColorFactor([0.06, 0.07, 0.08, 1])
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

  // WebP compression on textures
  await compressTexturesToWebP(doc);

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
  await compressTexturesToWebP(doc);

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
