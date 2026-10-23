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

  const headMats = [];
  const tailMats = [];

  model.traverse((o) => {
    if (!o.isMesh) return;
    const mat = o.material;
    const name = mat.name || '';
    if (['bmwcar_body1', 'bmwcar_hood1', 'bmwcar_bodykit1', 'CarP_2'].includes(name)) {
      o.material = bodyMat;
    } else if (name.includes('glass1') || name === 'D_glass') {
      o.material = windowMat;
    } else if (name === 'glass_light') {
      mat.transparent = true;
      mat.opacity = 0.8;
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0xffffff);
      headMats.push(mat);
    } else if (name === 'bmwcar_emissive1') {
      mat.color.setHex(0xd0e8ff);
      mat.emissive.setHex(0xe8f4ff);
      headMats.push(mat);
    } else if (name === 'red_glass') {
      mat.color.setHex(0x550000);
      mat.emissive.setHex(0xff1428);
      tailMats.push(mat);
    }
  });

  // Halo quads at the real lamp positions (night / brake / high-beam)
  const hy = 0.72;
  const hx = 0.72;
  const frontZ = -2.35;
  const ty = 0.84;
  const tx = 0.72;
  const rearZ = 2.33;

  const glowFrontMat = createGlowMaterial(0xe4eeff, 0.95);
  const glowRearMat = createGlowMaterial(0xff2032, 0.7);
  const flareMat = createGlowMaterial(0x9cc4ff, 0.95);
  const frontGlow = glowQuads([[-hx, hy, frontZ], [hx, hy, frontZ]], 1.1, 0.55, true, glowFrontMat);
  const flare = glowQuads([[-hx, hy, frontZ - 0.05], [hx, hy, frontZ - 0.05]], 2.4, 1.3, true, flareMat);
  const rearGlow = glowQuads([[-tx, ty, rearZ], [tx, ty, rearZ]], 0.85, 0.46, false, glowRearMat);
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
