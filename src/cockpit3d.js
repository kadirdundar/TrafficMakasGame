import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { applyAtlasPatch, applyPieceMaterial } from './cockpitDecals.js';
import { getCar } from './cars/index.js';

// 3D cockpit: interactive steering wheel, live instrument cluster screens, rear-view mirrors and
// ambient cabin lighting, driven by a car's `cockpit` config (src/cars/<id>/car.js, fields in
// src/cars/README.md). Lightweight enough for 60 FPS on phones.

// Optional cockpit fields (src/cars/README.md) fall back to these
const COCKPIT_DEFAULTS = {
  scale: 1,
  wheelRadius: 0.18,
  steerSign: -1,
  softMaterials: new Set(),
  screens: {},
  ledPaths: [],
  glassOut: new THREE.Vector3(0, 0.82, -0.57).normalize(),
  glassUp: new THREE.Vector3(0, 0.57, 0.82).normalize(),
  wiperPivots: [],
  wiperLen: 0.6,
  floor: null,
};

const CABIN_NIGHT_GLOW = 0.22;
const SCREEN_REPAINT_MS = 80;

const WIPER_REST = THREE.MathUtils.degToRad(22);
const WIPER_SWEEP = THREE.MathUtils.degToRad(79);

const PORTRAIT_SEAT_BACK = 0.17;
const PORTRAIT_SEAT_UP = 0.05;

const Z_AXIS = new THREE.Vector3(0, 0, 1);
const _spin = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _w = new THREE.Vector3();
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _m = new THREE.Matrix4();

function createScreen(def) {
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = def.px;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const n = new THREE.Vector3().fromArray(def.n).normalize();
  const corner = (c) => new THREE.Vector3().fromArray(c).addScaledVector(n, 0.002);
  const geo = new THREE.BufferGeometry().setFromPoints([corner(def.bl), corner(def.br), corner(def.tr), corner(def.tl)]);
  geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  geo.setIndex([0, 1, 2, 0, 2, 3]);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  return { mesh, canvas, ctx: canvas.getContext('2d'), texture, logical: def.logical };
}

function createLedStrips(paths) {
  const core = [];
  const glow = [];
  for (const path of paths) {
    const curve = new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3().fromArray(p)));
    const segs = Math.max(4, path.length * 6);
    core.push(new THREE.TubeGeometry(curve, segs, 0.0025, 5, false));
    glow.push(new THREE.TubeGeometry(curve, segs, 0.008, 6, false));
  }
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, toneMapped: false });
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const merged = (geos) => (geos.length ? mergeGeometries(geos) : new THREE.BufferGeometry());
  const coreMesh = new THREE.Mesh(merged(core), coreMat);
  const glowMesh = new THREE.Mesh(merged(glow), glowMat);
  glowMesh.renderOrder = 2;
  return { coreMesh, glowMesh, coreMat, glowMat };
}

function createWiper(pivotPos, glassOut, wiperLen) {
  const arm = new THREE.BoxGeometry(wiperLen, 0.012, 0.008).translate(wiperLen / 2, 0, 0);
  const blade = new THREE.BoxGeometry(wiperLen * 0.72, 0.02, 0.012).translate(wiperLen * 0.62, -0.006, 0.006);
  const mesh = new THREE.Mesh(
    mergeGeometries([arm, blade]),
    new THREE.MeshStandardMaterial({ color: 0x0b0c0f, roughness: 0.55, metalness: 0.3 })
  );
  mesh.position.fromArray(pivotPos).addScaledVector(glassOut, 0.015);
  mesh.visible = false;
  return mesh;
}

function applyMirror(obj, texture, u0, u1) {
  const mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xd5dbe2, side: THREE.DoubleSide });
  obj.traverse((m) => {
    if (!m.isMesh) return;
    const g = m.geometry;
    g.computeBoundingBox();
    const bb = g.boundingBox;
    const pos = g.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    const w = bb.max.x - bb.min.x || 1;
    const h = bb.max.y - bb.min.y || 1;
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = u0 + (u1 - u0) * ((bb.max.x - pos.getX(i)) / w);
      uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / h;
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    m.material = mat;
  });
}

// Model-provided LED strips keep the brightness falloff painted in the atlas (its blue channel)
// but take the ambient colour from the shared LED material.
function createAtlasLedMaterial(coreMat, map) {
  const mat = coreMat.clone();
  mat.map = map;
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      'diffuseColor.rgb *= smoothstep(0.08, 0.45, texture2D(map, vMapUv).b);'
    );
  };
  return mat;
}

// Multiplies a lit material's output by a height-based occlusion term in cockpit space.
function addCabinOcclusion(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform mat4 cabinInverse;\nvarying float vCabinY;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvCabinY = (cabinInverse * modelMatrix * vec4(transformed, 1.0)).y;'
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 cabinOcclusion;\nvarying float vCabinY;')
      .replace(
        '#include <opaque_fragment>',
        'outgoingLight *= mix(cabinOcclusion.z, 1.0, smoothstep(cabinOcclusion.x, cabinOcclusion.y, vCabinY));\n#include <opaque_fragment>'
      );
  };
  material.customProgramCacheKey = () => 'cabin-occlusion';
}

export async function loadCockpit3D({ carType, eyeAnchor, mirrorTexture, paintScreen }) {
  const car = getCar(carType);
  const key = car.id;
  if (!car.cockpit) throw new Error(`${key}: car.js içinde cockpit ayarı yok`);
  const cfg = { ...COCKPIT_DEFAULTS, ...car.cockpit };

  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(cfg.modelUrl);
  const model = gltf.scene;

  // Put the model's driver eye point exactly on the camera's preset position
  const eye = new THREE.Vector3().fromArray(model.userData.eye || cfg.defaultEye);
  model.scale.setScalar(cfg.scale);
  model.position.copy(eyeAnchor).addScaledVector(eye, -cfg.scale);
  model.updateMatrixWorld(true);
  const basePosition = model.position.clone();

  // Steering wheel: re-parent under a pivot on the column axis
  const wheel = model.getObjectByName('steering_wheel');
  const pivot = new THREE.Group();
  const baseQuat = new THREE.Quaternion();
  if (wheel) {
    const { pivot: p = [0, 0, 0], axis = [0, 0, 1] } = wheel.userData;
    pivot.position.fromArray(p);
    baseQuat.setFromUnitVectors(Z_AXIS, new THREE.Vector3().fromArray(axis).normalize());
    pivot.quaternion.copy(baseQuat);
    model.add(pivot);
    model.updateMatrixWorld(true);
    pivot.attach(wheel);
  }

  for (const patch of cfg.atlasPatches || []) applyAtlasPatch(model, patch);
  const satin = new THREE.MeshStandardMaterial({ color: 0xb4bac2, metalness: 1, roughness: 0.3 });
  for (const [name, point] of cfg.satinPieces || []) applyPieceMaterial(model, name, point, satin);

  // Live mirrors
  const mirror = (name, u0, u1) => {
    const obj = model.getObjectByName(name);
    if (obj) applyMirror(obj, mirrorTexture, u0, u1);
  };
  mirror('mirror_center', 0, 1);
  mirror('mirror_left', 0.55, 1);
  mirror('mirror_right', 0, 0.45);

  // Optional footwell floor plane for models without floor
  if (cfg.floor) {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(cfg.floor.w, cfg.floor.h).rotateX(-Math.PI / 2).translate(0, cfg.floor.y, cfg.floor.z),
      new THREE.MeshStandardMaterial({ color: 0x101113, roughness: 1, metalness: 0, side: THREE.DoubleSide })
    );
    model.add(floor);
  }

  // Live virtual cockpit instrument cluster screens
  const screens = Object.entries(cfg.screens).map(([name, def]) => {
    const screen = createScreen(def);
    screen.name = name;
    model.add(screen.mesh);
    return screen;
  });
  let lastPaint = -Infinity;

  // Ambient LED contour strips
  const leds = createLedStrips(cfg.ledPaths);
  model.add(leds.coreMesh, leds.glowMesh);
  // Strips that come with the model (split out of its atlas offline) share the LED colour
  const atlasLedMats = [];
  model.getObjectByName('ambient_led')?.traverse((m) => {
    if (!m.isMesh) return;
    m.material = m.material.map ? createAtlasLedMaterial(leds.coreMat, m.material.map) : leds.coreMat;
    if (m.material !== leds.coreMat) atlasLedMats.push(m.material);
  });
  const ledColor = new THREE.Color();
  let lastLedKey = '';

  // Windshield wipers
  const restDir = new THREE.Vector3(-1, 0, 0).addScaledVector(cfg.glassOut, cfg.glassOut.x).normalize();
  const upDir = cfg.glassUp.clone().addScaledVector(restDir, -cfg.glassUp.dot(restDir)).normalize();
  const wipers = cfg.wiperPivots.map((p) => createWiper(p, cfg.glassOut, cfg.wiperLen));
  model.add(...wipers);

  // Cabin interior fill light for day & night clarity
  const cabinLight = new THREE.PointLight(0xfff5ea, 1.3, 2.5, 0.8);
  cabinLight.position.set(-0.35, 1.15, -0.15);
  model.add(cabinLight);

  const paintMat = new THREE.MeshPhysicalMaterial({
    color: 0x16191e,
    metalness: 0.85,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    side: THREE.DoubleSide,
  });
  const occlusion = cfg.occlusion && {
    cabinInverse: { value: new THREE.Matrix4() },
    cabinOcclusion: { value: new THREE.Vector3(cfg.occlusion.y0, cfg.occlusion.y1, cfg.occlusion.min) },
  };
  const cabinMats = new Set();
  model.traverse((o) => {
    if (!o.isMesh || o.material.isMeshBasicMaterial) return;
    o.material.side = THREE.DoubleSide;
    if (cfg.paintMaterials?.has(o.material.name)) {
      o.material = paintMat;
      return;
    }
    if (o.material.map) {
      o.material.map.anisotropy = 16;
      o.material.map.generateMipmaps = true;
      o.material.map.minFilter = THREE.LinearMipmapLinearFilter;
      o.material.map.magFilter = THREE.LinearFilter;
      o.material.map.needsUpdate = true;
    }
    if (cfg.softMaterials.has(o.material.name)) {
      o.material.metalness = 0.05;
      o.material.roughness = 0.78;
      const tint = cfg.tints?.[o.material.name];
      if (tint !== undefined) o.material.color.setScalar(tint);
    }
    if (occlusion) addCabinOcclusion(o.material, occlusion);
    if (o.material.map) {
      o.material.emissive.set(0xffffff);
      o.material.emissiveMap = o.material.map;
      o.material.emissiveIntensity = 0.05;
      cabinMats.add(o.material);
    }
  });

  let lastNight = null;
  let lastAngle = NaN;
  let lastAspect = NaN;
  return {
    group: model,
    carType: key,
    update({
      steerAngle = 0,
      night = false,
      aspect = 16 / 9,
      ambientHex = 0x00f0ff,
      flash = 0,
      wiperSweep = 0,
      wipersVisible = false,
    }) {
      if (aspect !== lastAspect) {
        lastAspect = aspect;
        const t = THREE.MathUtils.clamp((1 - aspect) / 0.55, 0, 1);
        model.position.set(basePosition.x, basePosition.y - PORTRAIT_SEAT_UP * t, basePosition.z - PORTRAIT_SEAT_BACK * t);
      }

      const now = performance.now();
      if (paintScreen && now - lastPaint >= SCREEN_REPAINT_MS) {
        lastPaint = now;
        for (const s of screens) {
          const k = s.canvas.width / s.logical[0];
          s.ctx.setTransform(1, 0, 0, 1, 0, 0);
          s.ctx.fillStyle = '#05070c';
          s.ctx.fillRect(0, 0, s.canvas.width, s.canvas.height);
          s.ctx.setTransform(k, 0, 0, k, 0, 0);
          paintScreen(s.name, s.ctx, s.logical[0], s.logical[1]);
          s.texture.needsUpdate = true;
        }
      }

      const ledKey = `${ambientHex}|${flash.toFixed(2)}|${night ? 1 : 0}`;
      if (ledKey !== lastLedKey) {
        lastLedKey = ledKey;
        ledColor.setHex(ambientHex);
        leds.coreMat.color.copy(ledColor).multiplyScalar(1 + flash * 0.8);
        leds.glowMat.color.copy(ledColor);
        atlasLedMats.forEach((m) => m.color.copy(leds.coreMat.color));
        leds.glowMat.opacity = (night ? 0.38 : 0.2) + flash * 0.4;
      }

      const angle = WIPER_REST + wiperSweep * WIPER_SWEEP;
      for (const w of wipers) {
        w.visible = wipersVisible;
        if (!wipersVisible) continue;
        _x.copy(restDir).multiplyScalar(Math.cos(angle)).addScaledVector(upDir, Math.sin(angle));
        _y.crossVectors(cfg.glassOut, _x);
        w.quaternion.setFromRotationMatrix(_m.makeBasis(_x, _y, cfg.glassOut));
      }

      if (occlusion) occlusion.cabinInverse.value.copy(model.matrixWorld).invert();

      if (steerAngle !== lastAngle) {
        lastAngle = steerAngle;
        pivot.quaternion.copy(baseQuat).multiply(_spin.setFromAxisAngle(Z_AXIS, cfg.steerSign * steerAngle));
      }
      if (night !== lastNight) {
        lastNight = night;
        cabinLight.intensity = night ? 0.15 : 1.3;
        cabinMats.forEach((m) => (m.emissiveIntensity = night ? cfg.cabinNightGlow ?? CABIN_NIGHT_GLOW : 0.05));
      }
    },
    // Screen-space circle of the wheel rim (CSS px) for mouse/touch steering
    getWheelScreenBounds(camera) {
      pivot.updateWorldMatrix(true, false);
      _v.setFromMatrixPosition(pivot.matrixWorld).project(camera);
      _w.set(cfg.wheelRadius, 0, 0).applyMatrix4(pivot.matrixWorld).project(camera);
      const cx = (_v.x * 0.5 + 0.5) * window.innerWidth;
      const cy = (-_v.y * 0.5 + 0.5) * window.innerHeight;
      const rx = (_w.x * 0.5 + 0.5) * window.innerWidth;
      const ry = (-_w.y * 0.5 + 0.5) * window.innerHeight;
      return { cx, cy, r: Math.hypot(rx - cx, ry - cy) };
    },
  };
}
