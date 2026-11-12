import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createGlowMaterial } from '../vehicleModels.js';
import { createSpoilerMount } from './spoiler.js';
import { createRimPaint } from './rims.js';
import { createPlateMount } from './plate.js';
import { createPaintFinish } from './finish.js';
import { createWindowTint } from './tint.js';
import { createCarbonParts } from './carbon.js';
import { createNeonGlow } from './neon.js';
import { DEFAULT_PLATE, neonColorHex, rimColorHex, tintShade } from '../progression/config.js';

// Exterior car model for the garage turntable and online friends, driven by a car's `exterior`
// config (src/cars/<id>/car.js, fields in src/cars/README.md). Returns
// { group, bodyMat, setLights({ night, braking, highBeam }), setParts(parts),
// rollWheels(distM) } with parts as in
// src/progression/profile.js → parts(); the garage recolours bodyMat. setSpoiler(id),
// setRimColor(hex), setPlate(text), setFinish(id), setCarbon({ hood, mirrors }), setTint(shade)
// and setNeon(hex) fit one part directly (preview pages).

// Finish of the materials whose name says what they are (tools/convert-car.mjs standardises the
// names): the limits their converted values are held to, and how strongly they reflect. Glass
// and chrome stay as glossy as they are; everything unnamed is treated as matte plastic, since
// the source models' own values are often arbitrary (plastics exported as mirror chrome).
const SURFACE_FINISH = [
  [/glass|window|lens|klosz/i, { minRoughness: 0.04, maxMetalness: 0.3, env: 1.0 }],
  [/chrome|mirror|miror/i, { minRoughness: 0.1, maxMetalness: 1, env: 0.9 }],
  [/rim|wheel|jant|silver/i, { minRoughness: 0.24, maxMetalness: 0.9, env: 0.75 }],
  [/gloss|shiny/i, { minRoughness: 0.16, maxMetalness: 0.5, env: 0.6 }],
];
const MATTE_FINISH = { minRoughness: 0.62, maxMetalness: 0.3, env: 0.25 };

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

  // Factory paint: a solid colour under a glossy clear coat (the garage's metallic, matte and
  // pearl finishes are set over it, src/cars/finish.js)
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: paintHex,
    metalness: cfg.metalness ?? 0.15,
    roughness: cfg.roughness ?? 0.48,
    clearcoat: cfg.clearcoat ?? 0.8,
    clearcoatRoughness: cfg.clearcoatRoughness ?? 0.1,
    envMapIntensity: cfg.envMapIntensity ?? 0.8,
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
    // `keepFinish` names materials whose converted PBR values are tuned and kept as they are.
    if (mat && cfg.keepFinish?.includes(name)) {
      if ('envMapIntensity' in mat) mat.envMapIntensity = cfg.keepFinishEnv ?? 0.6;
      return;
    }
    if (mat) {
      const finish = SURFACE_FINISH.find(([pattern]) => pattern.test(name))?.[1] ?? MATTE_FINISH;
      if ('roughness' in mat) mat.roughness = Math.max(mat.roughness ?? 0.6, finish.minRoughness);
      if ('metalness' in mat) mat.metalness = Math.min(mat.metalness ?? 0.25, finish.maxMetalness);
      if ('clearcoat' in mat) {
        mat.clearcoat = Math.min(mat.clearcoat || 0, 0.04);
        mat.clearcoatRoughness = Math.max(mat.clearcoatRoughness || 0.6, 0.6);
      }
      if ('envMapIntensity' in mat) mat.envMapIntensity = finish.env;
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

  // Number plates (src/cars/plate.js): placed on the bumpers the first time one is set
  const plateMount = createPlateMount(group, model, cfg.length / 2, cfg.plate, cfg.url);

  // Paint finish, window film, carbon bonnet / mirror caps and neon underglow
  const setFinish = createPaintFinish(bodyMat);
  const setTint = createWindowTint(model, cfg.tint);
  const carbon = createCarbonParts(
    group,
    model,
    bodyMat,
    { halfLength: cfg.length / 2, halfWidth: (size.x * s) / 2, height: size.y * s },
    cfg.carbon
  );
  const neon = createNeonGlow(size.x * s, cfg.length);
  group.add(neon.mesh);

  const { head: HEAD, tail: TAIL } = cfg;
  let lastKey = '';
  return {
    group,
    bodyMat,
    setSpoiler: spoilerMount.set,
    setRimColor,
    setPlate: plateMount.set,
    setFinish,
    setCarbon: carbon.set,
    setTint,
    setNeon: neon.setColor,
    // Turns the wheels by the distance driven (m along the road)
    rollWheels: setRimColor.rollWheels,
    // Parts the player fitted in the garage (ids from src/progression/config.js → PARTS) and
    // the plate's text
    setParts({
      spoiler = 'none',
      rim = 'factory',
      finish = 'factory',
      hood = 'paint',
      mirrors = 'paint',
      tint = 'none',
      neon: neonId = 'none',
      plate = DEFAULT_PLATE,
    } = {}) {
      spoilerMount.set(spoiler);
      setRimColor(rimColorHex(rim));
      setFinish(finish);
      carbon.set({ hood: hood === 'carbon', mirrors: mirrors === 'carbon' });
      setTint(tintShade(tint));
      neon.setColor(neonColorHex(neonId));
      plateMount.set(plate);
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
      neon.setNight(night);
      frontGlow.visible = night || highBeam;
      rearGlow.visible = night || braking;
      flare.visible = highBeam;
    },
  };
}
