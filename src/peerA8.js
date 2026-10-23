import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createGlowMaterial } from './vehicleModels.js';

// Online friend's car: optimized Audi A8 (D5) glTF.
// Source: "Audi A8 Custom 2018" by everhard (Sketchfab, CC BY 4.0) — interior removed,
// simplified 774k -> 57k triangles, 13 draw calls, meshopt-compressed (~0.55 MB).
// This module is dynamically imported by the start-menu garage and by multiplayer sessions, so
// the loader + model stay out of the initial bundle.

const MODEL_URL = `${import.meta.env.BASE_URL}models/audi-a8.glb`;
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

export async function loadA8PeerCar({ paintHex = 0x0c0e12 } = {}) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(MODEL_URL);
  const model = gltf.scene;

  // Normalize: length along Z = 4.85 m, wheels on the ground, centred (front stays at -Z)
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
    metalness: 0.86,
    roughness: 0.17,
    clearcoat: 1.0,
    clearcoatRoughness: 0.035,
    envMapIntensity: 1.35,
  });

  const headMats = [];
  const tailMats = [];
  const headBox = new THREE.Box3();
  const tailBox = new THREE.Box3();
  model.traverse((o) => {
    if (!o.isMesh) return;
    const mat = o.material;
    const name = mat.name || '';
    if (name === 'paint') {
      o.material = bodyMat;
    } else if (name === 'chrome' || name === 'badge') {
      mat.metalness = 0.98;
      mat.roughness = 0.12;
      mat.envMapIntensity = 1.4;
    } else if (name === 'glass') {
      mat.roughness = 0.06;
      mat.metalness = 0.1;
      mat.envMapIntensity = 1.5;
    } else if (name.startsWith('head')) {
      mat.emissive.set(0xffffff);
      mat.emissiveMap = mat.map;
      headMats.push(mat);
      headBox.expandByObject(o);
    } else if (name === 'tailLens') {
      // Red outer lens (also covers the bumper reflectors): glows at half strength
      mat.emissive.set(0x80000c);
      tailMats.push(mat);
    } else if (name.startsWith('tail')) {
      // Lamp bodies: the source texture mixes amber/white parts -> force a clean LED red
      mat.map = null;
      mat.color.set(0x3a0006);
      mat.emissive.set(0xff1428);
      mat.needsUpdate = true;
      tailMats.push(mat);
      if (name === 'tailLight2') tailBox.expandByObject(o); // main full-width lamp band
    }
  });

  // Halo quads at the real lamp positions (night / brake / high-beam)
  const hy = (headBox.min.y + headBox.max.y) / 2;
  const hx = headBox.max.x - 0.2;
  const ty = (tailBox.min.y + tailBox.max.y) / 2;
  const tx = tailBox.max.x - 0.25;
  const glowFrontMat = createGlowMaterial(0xe4eeff, 0.95);
  const glowRearMat = createGlowMaterial(0xff2032, 0.7);
  const flareMat = createGlowMaterial(0x9cc4ff, 0.95);
  const frontGlow = glowQuads([[-hx, hy, headBox.min.z - 0.07], [hx, hy, headBox.min.z - 0.07]], 1.1, 0.55, true, glowFrontMat);
  const flare = glowQuads([[-hx, hy, headBox.min.z - 0.1], [hx, hy, headBox.min.z - 0.1]], 2.4, 1.3, true, flareMat);
  const rearGlow = glowQuads([[-tx, ty, tailBox.max.z + 0.06], [tx, ty, tailBox.max.z + 0.06]], 0.85, 0.46, false, glowRearMat);
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
