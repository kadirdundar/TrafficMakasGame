import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// 3D Cockpit Module supporting Audi A8 and BMW M4 (G82 VR46 Edition).
// Lightweight, highly optimized, 60 FPS, with interactive steering, live digital gauge screens,
// dynamic rear-view mirrors, and ambient cabin contour illumination.

const COCKPIT_CONFIGS = {
  a8: {
    modelUrl: `${import.meta.env.BASE_URL}models/a8-cockpit.glb`,
    scale: 1.0816,
    defaultEye: [-0.36, 0.33, -0.02],
    wheelRadius: 0.155,
    steerSign: -1,
    softMaterials: new Set(['a8texture3', 'a8texture5', 'a8texture7', 'a8texture10']),
    screens: {
      cluster: {
        tl: [-0.4689, 0.1873, -0.7588],
        tr: [-0.196, 0.1873, -0.7588],
        bl: [-0.4689, 0.0827, -0.7473],
        br: [-0.196, 0.0827, -0.7473],
        n: [0, 0.11, 0.994],
        logical: [200, 77],
        px: [512, 196],
      },
    },
    ledPaths: [
      [[-0.648, 0.098, -0.64], [-0.656, 0.092, -0.3], [-0.652, 0.096, -0.04], [-0.639, 0.105, 0.05]],
      [[0.648, 0.098, -0.64], [0.656, 0.092, -0.3], [0.652, 0.096, -0.04], [0.639, 0.105, 0.05]],
    ],
    glassOut: new THREE.Vector3(0, 0.86, -0.51).normalize(),
    glassUp: new THREE.Vector3(-0.093, 0.46, 0.884).normalize(),
    wiperPivots: [[-0.335, 0.2, -1.053], [0.125, 0.19, -1.097]],
    wiperLen: 0.62,
    floor: { w: 1.7, h: 1.5, y: -0.4, z: -0.45 },
  },
  bmw: {
    modelUrl: `${import.meta.env.BASE_URL}models/bmw-m4-cockpit.glb`,
    scale: 1.0,
    defaultEye: [-0.375, 1.12, 0.12],
    wheelRadius: 0.185,
    steerSign: -1,
    softMaterials: new Set([
      'm4car_interior1.007',
      'm4car_interior1.008',
      'BMW_M4CSLRewardRecycled_2022InteriorA_Material.011',
      'm4car_plast1.005',
    ]),
    screens: {
      cluster: {
        tl: [-0.525, 0.985, -0.585],
        tr: [-0.185, 0.985, -0.575],
        bl: [-0.525, 0.852, -0.630],
        br: [-0.185, 0.852, -0.620],
        n: [0.02, 0.35, 0.93],
        logical: [240, 95],
        px: [1024, 400],
      },
    },
    ledPaths: [
      // Left and right door trims
      [[-0.73, 0.93, -0.25], [-0.73, 0.90, -0.05], [-0.73, 0.85, 0.15]],
      [[0.73, 0.93, -0.25], [0.73, 0.90, -0.05], [0.73, 0.85, 0.15]],
      // Dashboard ambient contour line
      [[-0.10, 0.88, -0.60], [0.22, 0.88, -0.60], [0.55, 0.88, -0.60]],
    ],
    glassOut: new THREE.Vector3(0, 0.82, -0.57).normalize(),
    glassUp: new THREE.Vector3(0, 0.57, 0.82).normalize(),
    wiperPivots: [[-0.42, 0.78, -1.02], [0.15, 0.78, -1.05]],
    wiperLen: 0.65,
    floor: null,
  },
};
COCKPIT_CONFIGS.m4 = COCKPIT_CONFIGS.bmw;

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
  const coreMesh = new THREE.Mesh(mergeGeometries(core), coreMat);
  const glowMesh = new THREE.Mesh(mergeGeometries(glow), glowMat);
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
  const mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xd5dbe2 });
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

export async function loadCockpit3D({ carType = 'a8', eyeAnchor, mirrorTexture, paintScreen }) {
  const key = (carType || 'a8').toLowerCase().includes('bmw') || (carType || '').toLowerCase().includes('m4') ? 'bmw' : 'a8';
  const cfg = COCKPIT_CONFIGS[key] || COCKPIT_CONFIGS.a8;

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
      new THREE.MeshStandardMaterial({ color: 0x101113, roughness: 1, metalness: 0 })
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

  const cabinMats = new Set();
  model.traverse((o) => {
    if (!o.isMesh || o.material.isMeshBasicMaterial) return;
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
      if (o.material.name === 'a8texture3') o.material.color.setScalar(0.4);
    }
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

      if (steerAngle !== lastAngle) {
        lastAngle = steerAngle;
        pivot.quaternion.copy(baseQuat).multiply(_spin.setFromAxisAngle(Z_AXIS, cfg.steerSign * steerAngle));
      }
      if (night !== lastNight) {
        lastNight = night;
        cabinLight.intensity = night ? 0.15 : 1.3;
        cabinMats.forEach((m) => (m.emissiveIntensity = night ? CABIN_NIGHT_GLOW : 0.05));
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
