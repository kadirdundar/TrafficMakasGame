import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createGlowMaterial } from './vehicleModels.js';

// Online player / Garage showcase car: optimized BMW 5-Series / 520 glTF.
// Simplified, draw calls preserved for dynamic paint and lighting, meshopt-compressed (~0.92 MB).
// Dynamically imported when BMW is selected or when a friend drives one in multiplayer.

const MODEL_URL = `${import.meta.env.BASE_URL}models/bmw-520.glb`;
const TARGET_LENGTH = 4.85;

const HEAD = { day: 0.5, night: 1.6, highBeam: 3.2 };
const TAIL = { day: 0.35, night: 1.1, brake: 3.0 };

function glowQuads(points, w, h, facingFront, material) {
  const geos = points.map(([x, y, z]) => {
    const g = new THREE.PlaneGeometry(w, h);
    if (facingFront) g.rotateY(Math.PI);
    g.translate(x, y, z);
    return g;
  });
  const mesh = new THREE.Mesh(mergeGeometries(geos), material);
  mesh.visible = false;
  mesh.renderOrder = 2;
  return mesh;
}

// The simplified body panels carry bumpy vertex normals that show up as wobbly reflections in
// the clearcoat. A few rounds of neighbour averaging (welded across UV seams, never across
// edges sharper than creaseDeg) iron them out while keeping the character lines crisp.
function smoothNormals(geometry, creaseDeg = 30, iterations = 10) {
  const pos = geometry.attributes.position;
  const src = geometry.attributes.normal;
  const n = pos.count;
  const N = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    N[i * 3] = src.getX(i);
    N[i * 3 + 1] = src.getY(i);
    N[i * 3 + 2] = src.getZ(i);
  }

  const adj = Array.from({ length: n }, () => new Set());
  const index = geometry.index;
  const corners = index ? index.count : n;
  for (let t = 0; t < corners; t += 3) {
    const a = index ? index.getX(t) : t;
    const b = index ? index.getX(t + 1) : t + 1;
    const c = index ? index.getX(t + 2) : t + 2;
    adj[a].add(b).add(c);
    adj[b].add(a).add(c);
    adj[c].add(a).add(b);
  }
  geometry.computeBoundingBox();
  const q = geometry.boundingBox.getSize(new THREE.Vector3()).length() * 1e-4;
  const welded = new Map();
  for (let i = 0; i < n; i++) {
    const key = `${Math.round(pos.getX(i) / q)},${Math.round(pos.getY(i) / q)},${Math.round(pos.getZ(i) / q)}`;
    const list = welded.get(key);
    if (list) list.push(i);
    else welded.set(key, [i]);
  }
  for (const list of welded.values()) {
    if (list.length < 2) continue;
    for (const a of list) for (const b of list) if (a !== b) for (const x of adj[b]) adj[a].add(x);
  }
  const neighbours = adj.map((set) => [...set]);

  const cos = Math.cos(THREE.MathUtils.degToRad(creaseDeg));
  const next = new Float32Array(n * 3);
  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < n; i++) {
      const x0 = N[i * 3];
      const y0 = N[i * 3 + 1];
      const z0 = N[i * 3 + 2];
      let x = x0;
      let y = y0;
      let z = z0;
      for (const j of neighbours[i]) {
        if (x0 * N[j * 3] + y0 * N[j * 3 + 1] + z0 * N[j * 3 + 2] < cos) continue;
        x += N[j * 3];
        y += N[j * 3 + 1];
        z += N[j * 3 + 2];
      }
      const l = Math.hypot(x, y, z) || 1;
      next[i * 3] = x / l;
      next[i * 3 + 1] = y / l;
      next[i * 3 + 2] = z / l;
    }
    N.set(next);
  }
  geometry.setAttribute('normal', new THREE.BufferAttribute(N, 3));
}

// Some lamp meshes cover both ends of the car (DRL + tail light graphic in one texture). Split
// them by triangle so the front half can glow white and the rear half red (front = -Z).
function splitFrontRear(mesh) {
  const geo = mesh.geometry;
  const pos = geo.attributes.position;
  const index = geo.index;
  const corners = index ? index.count : pos.count;
  const front = [];
  const rear = [];
  const v = new THREE.Vector3();
  for (let t = 0; t < corners; t += 3) {
    let z = 0;
    const ids = [];
    for (let k = 0; k < 3; k++) {
      const id = index ? index.getX(t + k) : t + k;
      ids.push(id);
      z += v.fromBufferAttribute(pos, id).applyMatrix4(mesh.matrixWorld).z;
    }
    (z < 0 ? front : rear).push(...ids);
  }
  const part = (ids) => {
    const g = geo.clone();
    g.setIndex(ids);
    const m = new THREE.Mesh(g, mesh.material.clone());
    m.position.copy(mesh.position);
    m.quaternion.copy(mesh.quaternion);
    m.scale.copy(mesh.scale);
    mesh.parent.add(m);
    m.updateMatrixWorld(true);
    return m;
  };
  const parts = { front: part(front), rear: part(rear) };
  mesh.removeFromParent();
  return parts;
}

// Centre of the right-hand lamp cluster (x > 0) of the given meshes, in car space
function lampCenter(meshes) {
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  for (const m of meshes) {
    const pos = m.geometry.attributes.position;
    const index = m.geometry.index;
    const count = index ? index.count : pos.count;
    for (let k = 0; k < count; k++) {
      v.fromBufferAttribute(pos, index ? index.getX(k) : k).applyMatrix4(m.matrixWorld);
      if (v.x > 0.15) box.expandByPoint(v);
    }
  }
  return box;
}

export async function loadBmwPeerCar({ paintHex = 0x0e6f9c } = {}) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(MODEL_URL);
  const model = gltf.scene;

  // The BMW source model is oriented +Z forward; rotate 180 deg so -Z is forward (matching game standard)
  model.rotation.y = Math.PI;
  model.updateMatrixWorld(true);

  // Normalize: length along Z = 4.85 m, wheels on the ground, centred
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const s = TARGET_LENGTH / size.z;
  model.scale.setScalar(s);
  model.position.set(
    (-(box.min.x + box.max.x) / 2) * s,
    -box.min.y * s,
    (-(box.min.z + box.max.z) / 2) * s
  );
  const group = new THREE.Group();
  group.add(model);
  group.updateMatrixWorld(true);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: paintHex,
    metalness: 0.85,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.2,
  });

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x111622,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.75,
  });

  const PAINT = ['bmwcar_body1', 'bmwcar_hood1', 'bmwcar_bodykit1', 'CarP_2'];
  const headMats = [];
  const tailMats = [];
  const headMeshes = [];
  const tailMeshes = [];
  const meshes = [];
  model.traverse((o) => o.isMesh && meshes.push(o));

  for (const o of meshes) {
    const mat = o.material;
    const name = mat.name || '';
    if (PAINT.includes(name)) {
      if (name !== 'CarP_2') smoothNormals(o.geometry);
      o.material = bodyMat;
    } else if (name.includes('glass1') || name === 'D_glass') {
      o.material = windowMat;
    } else if (name === 'glass_light') {
      // Clear outer lens: lit in front (the headlight), a smoked red cover at the back
      const { front, rear } = splitFrontRear(o);
      front.material.transparent = true;
      front.material.opacity = 0.8;
      front.material.color.setHex(0xffffff);
      front.material.emissive.setHex(0xffffff);
      headMats.push(front.material);
      headMeshes.push(front);
      rear.material.color.setHex(0x2a0306);
      rear.material.opacity = 0.35;
      rear.material.emissive.setHex(0x000000);
    } else if (name === 'bmwcar_emissive1') {
      // One texture holds the white DRL graphic and the red tail light graphic
      const { front, rear } = splitFrontRear(o);
      front.material.color.setHex(0xd0e8ff);
      front.material.emissive.setHex(0xe8f4ff);
      headMats.push(front.material);
      rear.material.color.setHex(0x3a0006);
      rear.material.emissive.setHex(0xff2a2a);
      tailMats.push(rear.material);
      tailMeshes.push(rear);
    } else if (name === 'red_glass') {
      mat.color.setHex(0x550000);
      mat.emissive.setHex(0xff1428);
      tailMats.push(mat);
      tailMeshes.push(o);
    }
  }

  // Halo quads at the real lamp positions (night / brake / high-beam)
  const headBox = lampCenter(headMeshes);
  const tailBox = lampCenter(tailMeshes);
  const hx = (headBox.min.x + headBox.max.x) / 2;
  const hy = (headBox.min.y + headBox.max.y) / 2;
  const frontZ = headBox.min.z - 0.05;
  const tx = (tailBox.min.x + tailBox.max.x) / 2;
  const ty = (tailBox.min.y + tailBox.max.y) / 2;
  const rearZ = tailBox.max.z + 0.05;

  const glowFrontMat = createGlowMaterial(0xe4eeff, 0.95);
  const glowRearMat = createGlowMaterial(0xff2032, 0.7);
  const flareMat = createGlowMaterial(0x9cc4ff, 0.95);
  const frontGlow = glowQuads([[-hx, hy, frontZ], [hx, hy, frontZ]], 0.9, 0.42, true, glowFrontMat);
  const flare = glowQuads([[-hx, hy, frontZ - 0.05], [hx, hy, frontZ - 0.05]], 2.2, 1.1, true, flareMat);
  const rearGlow = glowQuads([[-tx, ty, rearZ], [tx, ty, rearZ]], 0.75, 0.36, false, glowRearMat);
  group.add(frontGlow, flare, rearGlow);

  let lastKey = '';
  return {
    group,
    bodyMat,
    setLights({ night = false, braking = false, highBeam = false }) {
      const key = `${night ? 1 : 0}${braking ? 1 : 0}${highBeam ? 1 : 0}`;
      if (key === lastKey) return;
      lastKey = key;
      const head = highBeam ? HEAD.highBeam : night ? HEAD.night : HEAD.day;
      const tail = braking ? TAIL.brake : night ? TAIL.night : TAIL.day;
      headMats.forEach((m) => (m.emissiveIntensity = head));
      tailMats.forEach((m) => (m.emissiveIntensity = tail));
      glowRearMat.opacity = braking ? 1.0 : 0.7;
      frontGlow.visible = night || highBeam;
      rearGlow.visible = night || braking;
      flare.visible = highBeam;
    },
  };
}
