import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createGlowMaterial } from '../vehicleModels.js';
import { createSpoilerMount } from './spoiler.js';
import { createRimPaint } from './rims.js';
import { rimColorHex } from '../progression/config.js';

// Exterior car model for the garage turntable and online friends, driven by a car's `exterior`
// config (src/cars/<id>/car.js, fields in src/cars/README.md). Returns
// { group, bodyMat, setLights({ night, braking, highBeam }), setParts({ spoiler, rim }) }; the garage
// recolours bodyMat. setSpoiler(id) and setRimColor(hex) fit one part directly (preview pages).

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

// Halo centre for one side: from a lamp bounding box (x inset from the outer edge, z just in
// front of / behind the lamp) or from a fixed point measured on the model.
function haloAnchor(def, boxes, front) {
  if (!def.at && boxes[def.from].isEmpty()) return null;
  if (def.at) {
    const [x, y, z] = def.at;
    return [x, y, z + (front ? -def.offset : def.offset)];
  }
  const box = boxes[def.from];
  return [
    box.max.x - def.inset,
    (box.min.y + box.max.y) / 2,
    front ? box.min.z - def.offset : box.max.z + def.offset,
  ];
}

export async function loadExterior(cfg, { paintHex = 0xd6182c } = {}) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(cfg.url);
  const model = gltf.scene;

  // Normalize: length along Z, wheels on the ground, centred (front stays at -Z)
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const s = cfg.length / (size.z || cfg.length);
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
    metalness: cfg.metalness ?? 0.18,
    roughness: cfg.roughness ?? 0.68,
    clearcoat: cfg.clearcoat ?? 0.04,
    clearcoatRoughness: cfg.clearcoatRoughness ?? 0.65,
    envMapIntensity: cfg.envMapIntensity ?? 0.25,
    side: THREE.DoubleSide,
  });
  const paintName = cfg.paintMaterial || 'paint';

  const lampMats = { head: [], tail: [] };
  const boxes = { head: new THREE.Box3(), tail: new THREE.Box3() };
  model.traverse((o) => {
    if (!o.isMesh) return;
    const mat = o.material;
    const name = mat?.name || '';
    if (name === paintName) {
      // Baked ambient occlusion (vertex colours, convert.mjs → exterior.ao) carries over to the paint
      if (o.geometry.attributes.color) bodyMat.vertexColors = true;
      o.material = bodyMat;
      return;
    }
    const rule = cfg.lamps?.find((r) => r.match.test(name));
    if (rule) {
      if (rule.removeMap) mat.map = null;
      if (rule.color !== undefined) mat.color.set(rule.color);
      if (rule.emissive !== undefined) mat.emissive.set(rule.emissive);
      if (rule.emissiveFromMap) mat.emissiveMap = mat.map;
      if (rule.intensity !== undefined) mat.emissiveIntensity = rule.intensity;
      if ('roughness' in mat) mat.roughness = Math.max(mat.roughness ?? 0.5, 0.5);
      if ('metalness' in mat) mat.metalness = Math.min(mat.metalness ?? 0.2, 0.25);
      if ('envMapIntensity' in mat) mat.envMapIntensity = 0.2;
      if (rule.removeMap) mat.needsUpdate = true;
      lampMats[rule.role].push(mat);
      if (rule.box) boxes[rule.box].expandByObject(o);
      return;
    }
    // Tame mirror reflections across all secondary exterior materials (trim, glass, rims, bodykit, etc.).
    // `keepFinish` names materials whose converted PBR values are tuned and kept as they are.
    if (mat && cfg.keepFinish?.includes(name)) {
      if ('envMapIntensity' in mat) mat.envMapIntensity = cfg.keepFinishEnv ?? 0.6;
      return;
    }
    if (mat) {
      const isGlass = /glass|lens|window/i.test(name) || mat.transparent;
      if ('roughness' in mat) {
        mat.roughness = Math.max(mat.roughness ?? 0.6, isGlass ? 0.42 : 0.62);
      }
      if ('metalness' in mat) {
        mat.metalness = Math.min(mat.metalness ?? 0.25, isGlass ? 0.15 : 0.3);
      }
      if ('clearcoat' in mat) {
        mat.clearcoat = Math.min(mat.clearcoat || 0, 0.04);
        mat.clearcoatRoughness = Math.max(mat.clearcoatRoughness || 0.6, 0.6);
      }
      if ('envMapIntensity' in mat) {
        mat.envMapIntensity = Math.min(mat.envMapIntensity ?? 0.25, 0.25);
      }
      mat.needsUpdate = true;
    }
  });

  const { front, flare: flareDef, rear } = cfg.glow;
  const glowFrontMat = createGlowMaterial(front.color, front.opacity);
  const glowRearMat = createGlowMaterial(rear.color, rear.opacity);
  const flareMat = createGlowMaterial(flareDef.color, flareDef.opacity);
  // A car whose lamp materials are not set up yet gets no halo instead of a broken one
  const headAt = haloAnchor(front, boxes, true);
  const tailAt = haloAnchor(rear, boxes, false);
  if (!headAt || !tailAt) console.warn(`${cfg.url}: far/stop malzemesi bulunamadı; car.js → exterior.lamps veya glow.*.at`);
  const none = new THREE.Group();
  let frontGlow = none;
  let flare = none;
  let rearGlow = none;
  if (headAt) {
    const [hx, hy, hz] = headAt;
    // The high-beam flare sits on the headlight halo, a little further forward
    const fz = hz + front.offset - flareDef.offset;
    frontGlow = glowQuads([[-hx, hy, hz], [hx, hy, hz]], ...front.size, true, glowFrontMat);
    flare = glowQuads([[-hx, hy, fz], [hx, hy, fz]], ...flareDef.size, true, flareMat);
    group.add(frontGlow, flare);
  }
  if (tailAt) {
    const [tx, ty, tz] = tailAt;
    rearGlow = glowQuads([[-tx, ty, tz], [tx, ty, tz]], ...rear.size, false, glowRearMat);
    group.add(rearGlow);
  }

  // Rim colour (src/cars/rims.js): the rims are split off their shared material once, here
  const setRimColor = createRimPaint(model, cfg.rims);

  // Rear spoiler (src/cars/spoiler.js): measured on the model the first time one is fitted
  const spoilerMount = createSpoilerMount(
    group,
    model,
    { halfLength: cfg.length / 2, halfWidth: (size.x * s) / 2, height: size.y * s },
    cfg.spoiler,
    bodyMat,
    cfg.url
  );

  const { head: HEAD, tail: TAIL } = cfg;
  let lastKey = '';
  return {
    group,
    bodyMat,
    setSpoiler: spoilerMount.set,
    setRimColor,
    // Parts the player fitted in the garage (ids from src/progression/config.js → PARTS)
    setParts({ spoiler = 'none', rim = 'factory' } = {}) {
      spoilerMount.set(spoiler);
      setRimColor(rimColorHex(rim));
    },
    setLights({ night = false, braking = false, highBeam = false }) {
      const key = `${night ? 1 : 0}${braking ? 1 : 0}${highBeam ? 1 : 0}`;
      if (key === lastKey) return;
      lastKey = key;
      const head = highBeam ? HEAD.highBeam : night ? HEAD.night : HEAD.day;
      const tail = braking ? TAIL.brake : night ? TAIL.night : TAIL.day;
      lampMats.head.forEach((m) => (m.emissiveIntensity = head));
      lampMats.tail.forEach((m) => (m.emissiveIntensity = tail));
      glowRearMat.opacity = braking ? 1.0 : 0.7;
      frontGlow.visible = night || highBeam;
      rearGlow.visible = night || braking;
      flare.visible = highBeam;
    },
  };
}
