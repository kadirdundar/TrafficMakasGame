import * as THREE from 'three';
import { makePlateTexture } from '../vehicleModels.js';

// Number plates for any car's exterior model (garage, online friends, drone replay). The models
// come without plates, so they are built in code: each plate sits at a height from car.js →
// exterior.plate and is pushed out to the outermost point of the bumper there, measured on the
// model the first time a plate is shown. The text is the player's (src/progression/plate.js).

const PLATE_W = 0.52; // m, Turkish plate 520 × 110 mm
const PLATE_H = 0.11;
const GAP = 0.006; // m in front of the bumper
// Plate heights (m above the ground) for a car whose car.js gives none
const DEFAULT_HEIGHTS = { front: 0.36, rear: 0.55 };

// Bumper depths measured per model file and height: the showroom, friends and the replay share them
const depthCache = new Map();
// One sharp texture per plate text, shared by every car that wears it
const textures = new Map();

function plateTexture(text) {
  if (!textures.has(text)) textures.set(text, makePlateTexture(text, 2));
  return textures.get(text);
}

let frameMat = null;
function frame() {
  frameMat ??= new THREE.MeshStandardMaterial({ color: 0x0b0c0f, roughness: 0.6 });
  return frameMat;
}

// Outermost point of the car across the plate's area at height `y`, in the group's own space:
// the smallest z at the front, the largest at the back. Rays that run through a grille gap into
// the car simply lose to the ones that hit the bumper.
function measureDepth(group, model, y, front, halfLength) {
  group.updateWorldMatrix(true, true);
  const toGroup = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const hitLocal = new THREE.Vector3();
  let outer = null;
  for (const x of [-PLATE_W * 0.45, 0, PLATE_W * 0.45]) {
    for (const dy of [-PLATE_H * 0.4, 0, PLATE_H * 0.4]) {
      origin.set(x, y + dy, front ? -halfLength - 1 : halfLength + 1).applyMatrix4(group.matrixWorld);
      dir.set(0, 0, front ? 1 : -1).transformDirection(group.matrixWorld);
      raycaster.set(origin, dir);
      const hit = raycaster.intersectObject(model, true)[0];
      if (!hit) continue;
      const z = hitLocal.copy(hit.point).applyMatrix4(toGroup).z;
      outer = outer === null ? z : front ? Math.min(outer, z) : Math.max(outer, z);
    }
  }
  return outer ?? (front ? -halfLength : halfLength);
}

// The model's own plates (meshes of material `name`): hidden, and where each one sat — centre
// and lean, from a straight line z = a + b·y through its points — so ours takes its place
function replaceModelPlates(group, model, name) {
  group.updateWorldMatrix(true, true);
  const toGroup = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const sums = { front: [0, 0, 0, 0, 0, 0], rear: [0, 0, 0, 0, 0, 0] }; // n, Σx, Σy, Σz, Σy², Σyz
  const v = new THREE.Vector3();
  model.traverse((o) => {
    if (!o.isMesh || o.material?.name !== name) return;
    o.visible = false;
    const m = new THREE.Matrix4().multiplyMatrices(toGroup, o.matrixWorld);
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m);
      const s = sums[v.z < 0 ? 'front' : 'rear'];
      s[0] += 1;
      s[1] += v.x;
      s[2] += v.y;
      s[3] += v.z;
      s[4] += v.y * v.y;
      s[5] += v.y * v.z;
    }
  });
  const spots = {};
  for (const [side, [n, sx, sy, sz, syy, syz]] of Object.entries(sums)) {
    if (!n) continue;
    const varY = syy / n - (sy / n) ** 2;
    const slope = varY > 1e-6 ? (syz / n - (sy / n) * (sz / n)) / varY : 0;
    spots[side] = { x: sx / n, y: sy / n, z: sz / n, lean: Math.atan(slope) };
  }
  return spots;
}

// Fits plates onto one loaded exterior. `cfg` is car.js → exterior.plate:
// { front: { y }, rear: { y } } in metres above the ground, `front: false` for a car without a
// front plate, or { replace: '<material>' } for a model that has plates of its own. `cacheKey`
// (the model's url) shares the measurement between copies.
export function createPlateMount(group, model, halfLength, cfg, cacheKey) {
  let meshes = null; // { front, rear } plate meshes, built the first time a plate is set
  let current = null;

  // Where a side's plate goes: { x, y, z, lean } in the group's own space, or null
  function spot(side, modelPlates) {
    if (cfg?.[side] === false) return null;
    if (modelPlates) return modelPlates[side] ?? null;
    const isFront = side === 'front';
    const y = cfg?.[side]?.y ?? DEFAULT_HEIGHTS[side];
    const key = `${cacheKey}|${side}|${y}`;
    if (!depthCache.has(key)) depthCache.set(key, measureDepth(group, model, y, isFront, halfLength));
    return { x: 0, y, z: depthCache.get(key), lean: 0 };
  }

  function build() {
    meshes = {};
    const modelPlates = cfg?.replace ? replaceModelPlates(group, model, cfg.replace) : null;
    for (const side of ['front', 'rear']) {
      const at = spot(side, modelPlates);
      if (!at) continue;
      const isFront = side === 'front';
      const holder = new THREE.Group();
      holder.position.set(at.x, at.y, at.z + (isFront ? -GAP : GAP));
      if (isFront) holder.rotation.y = Math.PI; // planes face +Z (backwards): turn the front one round
      holder.rotation.x = at.lean;
      const backing = new THREE.Mesh(new THREE.PlaneGeometry(PLATE_W + 0.016, PLATE_H + 0.016), frame());
      backing.position.z = -0.002;
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(PLATE_W, PLATE_H),
        new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, envMapIntensity: 0.35 })
      );
      holder.add(backing, plate);
      group.add(holder);
      meshes[side] = plate;
    }
  }

  return {
    set(text) {
      if (!text || text === current) return;
      current = text;
      if (!meshes) build();
      const map = plateTexture(text);
      for (const mesh of Object.values(meshes)) {
        mesh.material.map = map;
        mesh.material.needsUpdate = true;
      }
    },
  };
}
