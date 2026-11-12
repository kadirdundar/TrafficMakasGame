import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { createModelGeometry } from './vehicleModels.js';

// Real car models in the traffic. The garage cars (src/cars/) are converted into light copies by
// tools/convert-traffic.mjs (public/models/traffic/<id>.glb, ~10,000 triangles in six parts) and
// drawn by the same code and in the same few draw calls as the procedural cars.
//
// Which model a traffic car gets: its type (src/traffic.js → VEHICLE_TYPES) and its variant, the
// same on every device, so online everyone sees the same cars. `null` keeps the procedural body
// style for that variant; vans and trucks are always procedural.
const MODELS_BY_TYPE = {
  sedan: ['corolla', 'passat-b8', 'focus', 'c-class', 'passat-b5'],
  sport: ['porsche-911', null, 'amg-gt'],
};

const models = new Map(); // id → geometry for createTrafficVehicle
let loading = null;

// A mesh of the model as plain geometry in the car's space. The files are quantised (integer
// positions scaled by their node), so the node's transform is applied here once.
function bake(mesh) {
  mesh.updateWorldMatrix(true, false);
  const src = mesh.geometry;
  const pos = src.attributes.position;
  const nrm = src.attributes.normal;
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  const positions = new Float32Array(pos.count * 3);
  const normals = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld).toArray(positions, i * 3);
    v.fromBufferAttribute(nrm, i).applyMatrix3(normalMatrix).normalize().toArray(normals, i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  const col = src.attributes.color;
  if (col) {
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) v.fromBufferAttribute(col, i).toArray(colors, i * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }
  geo.setIndex(src.index);
  geo.computeBoundingSphere();
  return geo;
}

async function loadModel(loader, id) {
  const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}models/traffic/${id}.glb`);
  const parts = {};
  gltf.scene.traverse((o) => {
    if (o.isMesh) parts[o.name] = bake(o);
  });
  models.set(id, createModelGeometry(parts, gltf.scene.userData));
}

// Loads every traffic model once; a model that fails to load is skipped (its cars stay procedural)
export function loadTrafficModels() {
  if (!loading) {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const ids = [...new Set(Object.values(MODELS_BY_TYPE).flat())].filter(Boolean);
    loading = Promise.all(
      ids.map((id) => loadModel(loader, id).catch((err) => console.warn(`Trafik modeli yüklenemedi: ${id}`, err)))
    );
  }
  return loading;
}

// Geometry for a traffic car of this type and variant, or null for a procedural one
export function trafficModelFor(type, variant) {
  const list = MODELS_BY_TYPE[type];
  if (!list) return null;
  return models.get(list[variant % list.length]) || null;
}

export function trafficModel(id) {
  return models.get(id) || null;
}
