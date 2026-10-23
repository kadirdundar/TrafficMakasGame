import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createGlowMaterial } from './vehicleModels.js';

// Online friend's car / Showroom model: BMW M4 CS (G82 VR46 Edition) glTF.
// Normalized: 4.80 m length, facing -Z, wheels on y = 0.
const MODEL_URL = `${import.meta.env.BASE_URL}models/bmw-m4.glb`;
const TARGET_LENGTH = 4.80;

const HEAD = { day: 0.5, night: 1.8, highBeam: 3.5 };
const TAIL = { day: 0.35, night: 1.2, brake: 3.2 };

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

  // Normalize: length along Z = 4.80 m, wheels on the ground, centred
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const s = TARGET_LENGTH / (size.z || TARGET_LENGTH);
  model.scale.setScalar(s);
  model.position.set(
    (-(box.min.x + box.max.x) / 2) * s,
    -box.min.y * s,
    (-(box.min.z + box.max.z) / 2) * s
  );
  const group = new THREE.Group();
  group.add(model);
  group.updateMatrixWorld(true);

  // BMW M body paint material
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: paintHex,
    metalness: 0.82,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.25,
  });

  const headMats = [];
  const tailMats = [];

  model.traverse((o) => {
    if (!o.isMesh) return;
    const name = o.material?.name || '';
    if (name === 'paint') {
      o.material = bodyMat;
    } else if (name === 'emissive') {
      // Split or configure emissive material
      o.material.emissive.set(0xffffff);
      o.material.emissiveIntensity = 0.5;
      headMats.push(o.material);
    }
  });

  // Halo quads at the real lamp positions:
  // BMW M4 laser headlights: X = ±0.68, Y = 0.65, Z = -2.25
  // BMW M4 laser taillights: X = ±0.68, Y = 0.72, Z = +2.25
  const hx = 0.68;
  const hy = 0.65;
  const hz = -2.25;
  const tx = 0.68;
  const ty = 0.72;
  const tz = 2.25;

  const glowFrontMat = createGlowMaterial(0xffea70, 0.95); // BMW M CS distinctive yellow DRL halo!
  const glowRearMat = createGlowMaterial(0xff182c, 0.85); // M laser OLED red taillight halo
  const flareMat = createGlowMaterial(0xfff4c0, 0.95);

  const frontGlow = glowQuads([[-hx, hy, hz - 0.05], [hx, hy, hz - 0.05]], 0.95, 0.45, true, glowFrontMat);
  const flare = glowQuads([[-hx, hy, hz - 0.08], [hx, hy, hz - 0.08]], 2.4, 1.3, true, flareMat);
  const rearGlow = glowQuads([[-tx, ty, tz + 0.05], [tx, ty, tz + 0.05]], 0.85, 0.45, false, glowRearMat);
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
