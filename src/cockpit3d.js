import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// 3D Audi A8 (D5) cockpit (beta), alternative to the photo cockpit.
// Source: "Audi A8 Custom 2018" by everhard (Sketchfab, CC BY 4.0). Only the front cabin plus
// what is visible through the glass (hood, A-pillars, wing mirrors) is kept: 324k -> 64k
// triangles, ~20 draw calls, ~1.1 MB. The steering wheel is a separate node whose pivot/axis
// are stored in its glTF extras; the mirror glass nodes get the live rear-view render target.
// Dynamically imported only when the player switches to the 3D cockpit.

const MODEL_URL = `${import.meta.env.BASE_URL}models/a8-cockpit.glb`;
// The source model is ~92% of a real A8 (4.78 m vs 5.17 m); scale it back to real size
const MODEL_SCALE = 1.0816;
const WHEEL_RADIUS = 0.155;
// Night: let the cabin textures glow slightly so the dashboard stays readable
const CABIN_NIGHT_GLOW = 0.22;

// Carpet (a8texture3), seats (a8texture5), leather dash/doors/wheel rim (a8texture7), headliner/pillars (a8texture10)
const SOFT_MATERIALS = new Set(['a8texture3', 'a8texture5', 'a8texture7', 'a8texture10']);

// --- Geometry measured on the source model (model space, metres) by raycasting from the eye ---

// Display surfaces: live canvases are drawn on quads 2 mm in front of them. `logical` is the
// size the 2D painters lay out in (close to the photo cockpit's on-screen size), so their
// fixed-pixel details keep the same proportions; `px` is the texture resolution.
const SCREENS = {
  cluster: {
    tl: [-0.4689, 0.1873, -0.7588], tr: [-0.196, 0.1873, -0.7588],
    bl: [-0.4689, 0.0827, -0.7473], br: [-0.196, 0.0827, -0.7473],
    n: [0, 0.11, 0.994], logical: [200, 77], px: [512, 196],
  },
};
const SCREEN_REPAINT_MS = 80; // ~12 Hz is plenty for gauges and keeps texture uploads cheap

// Ambient contour lighting along the door trims
const LED_PATHS = [
  [[-0.648, 0.098, -0.64], [-0.656, 0.092, -0.3], [-0.652, 0.096, -0.04], [-0.639, 0.105, 0.05]],
  [[0.648, 0.098, -0.64], [0.656, 0.092, -0.3], [0.652, 0.096, -0.04], [0.639, 0.105, 0.05]],
];

// Windshield (glass itself is not rendered): outward normal, "up the glass" direction, and the
// two wiper pivots just below the visible bottom edge (hidden behind the dashboard top)
const GLASS_OUT = new THREE.Vector3(0, 0.86, -0.51).normalize();
const GLASS_UP = new THREE.Vector3(-0.093, 0.46, 0.884).normalize();
const WIPER_PIVOTS = [[-0.335, 0.2, -1.053], [0.125, 0.19, -1.097]];
const WIPER_LEN = 0.62;
const WIPER_REST = THREE.MathUtils.degToRad(22); // from "pointing left" toward "up the glass"
const WIPER_SWEEP = THREE.MathUtils.degToRad(79);

// Portrait phones: slide the seat back/up a little so the wheel does not fill the screen
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

function createLedStrips() {
  const core = [];
  const glow = [];
  for (const path of LED_PATHS) {
    const curve = new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3().fromArray(p)));
    const segs = Math.max(4, path.length * 6);
    core.push(new THREE.TubeGeometry(curve, segs, 0.0018, 5, false));
    glow.push(new THREE.TubeGeometry(curve, segs, 0.006, 6, false));
  }
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, toneMapped: false });
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const coreMesh = new THREE.Mesh(mergeGeometries(core), coreMat);
  const glowMesh = new THREE.Mesh(mergeGeometries(glow), glowMat);
  glowMesh.renderOrder = 2;
  return { coreMesh, glowMesh, coreMat, glowMat };
}

function createWiper(pivotPos) {
  const arm = new THREE.BoxGeometry(WIPER_LEN, 0.012, 0.008).translate(WIPER_LEN / 2, 0, 0);
  const blade = new THREE.BoxGeometry(WIPER_LEN * 0.72, 0.02, 0.012).translate(WIPER_LEN * 0.62, -0.006, 0.006);
  const mesh = new THREE.Mesh(
    mergeGeometries([arm, blade]),
    new THREE.MeshStandardMaterial({ color: 0x0b0c0f, roughness: 0.55, metalness: 0.3 })
  );
  mesh.position.fromArray(pivotPos).addScaledVector(GLASS_OUT, 0.015);
  mesh.visible = false;
  return mesh;
}

// Planar UVs over the mirror glass; u is flipped (mirror image) and squeezed into [u0, u1]
// so each wing mirror shows its own side of the single rear-view render.
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

export async function loadCockpit3D({ eyeAnchor, mirrorTexture, paintScreen }) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(MODEL_URL);
  const model = gltf.scene;

  // Put the model's driver eye point exactly on the camera's preset position
  const eye = new THREE.Vector3().fromArray(model.userData.eye || [-0.36, 0.33, -0.02]);
  model.scale.setScalar(MODEL_SCALE);
  model.position.copy(eyeAnchor).addScaledVector(eye, -MODEL_SCALE);
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

  // Live mirrors (all three share the rear-view camera render target)
  const mirror = (name, u0, u1) => {
    const obj = model.getObjectByName(name);
    if (obj) applyMirror(obj, mirrorTexture, u0, u1);
  };
  mirror('mirror_center', 0, 1);
  mirror('mirror_left', 0.55, 1);
  mirror('mirror_right', 0, 0.45);

  // The source model has no cabin floor (only the underbody shell, which faces down):
  // close the footwell with a dark carpet plane so the road never shows through
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.5).rotateX(-Math.PI / 2).translate(0, -0.4, -0.45),
    new THREE.MeshStandardMaterial({ color: 0x101113, roughness: 1, metalness: 0 })
  );
  model.add(floor);

  // Live virtual cockpit (the center MMI screens keep the model's own artwork)
  const screens = Object.entries(SCREENS).map(([name, def]) => {
    const screen = createScreen(def);
    screen.name = name;
    model.add(screen.mesh);
    return screen;
  });
  let lastPaint = -Infinity;

  // Ambient LED contour strips (core + additive glow, 2 draw calls in total)
  const leds = createLedStrips();
  model.add(leds.coreMesh, leds.glowMesh);
  const ledColor = new THREE.Color();
  let lastLedKey = '';

  // Windshield wipers: rotate inside the glass plane around their pivots
  const restDir = new THREE.Vector3(-1, 0, 0).addScaledVector(GLASS_OUT, GLASS_OUT.x).normalize();
  const upDir = GLASS_UP.clone().addScaledVector(restDir, -GLASS_UP.dot(restDir)).normalize();
  const wipers = WIPER_PIVOTS.map(createWiper);
  model.add(...wipers);

  const cabinMats = new Set();
  model.traverse((o) => {
    if (!o.isMesh || o.material.isMeshBasicMaterial) return;
    // Source exports carpet/leather/trim with metalness ~0.9-1.0 (they mirror the sky like
    // chrome); make the soft materials dielectric
    if (SOFT_MATERIALS.has(o.material.name)) {
      o.material.metalness = 0.05;
      o.material.roughness = 0.78;
      if (o.material.name === 'a8texture3') o.material.color.setScalar(0.4); // darker carpet
    }
    if (o.material.map) {
      o.material.emissive.set(0xffffff);
      o.material.emissiveMap = o.material.map;
      o.material.emissiveIntensity = 0;
      cabinMats.add(o.material);
    }
  });

  let lastNight = null;
  let lastAngle = NaN;
  let lastAspect = NaN;
  return {
    group: model,
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
        _y.crossVectors(GLASS_OUT, _x);
        w.quaternion.setFromRotationMatrix(_m.makeBasis(_x, _y, GLASS_OUT));
      }

      if (steerAngle !== lastAngle) {
        lastAngle = steerAngle;
        // Positive steer = clockwise as seen by the driver = negative turn about the column axis
        pivot.quaternion.copy(baseQuat).multiply(_spin.setFromAxisAngle(Z_AXIS, -steerAngle));
      }
      if (night !== lastNight) {
        lastNight = night;
        cabinMats.forEach((m) => (m.emissiveIntensity = night ? CABIN_NIGHT_GLOW : 0));
      }
    },
    // Screen-space circle of the wheel rim (CSS px) for mouse/touch steering
    getWheelScreenBounds(camera) {
      pivot.updateWorldMatrix(true, false);
      _v.setFromMatrixPosition(pivot.matrixWorld).project(camera);
      _w.set(WHEEL_RADIUS, 0, 0).applyMatrix4(pivot.matrixWorld).project(camera);
      const cx = (_v.x * 0.5 + 0.5) * window.innerWidth;
      const cy = (-_v.y * 0.5 + 0.5) * window.innerHeight;
      const rx = (_w.x * 0.5 + 0.5) * window.innerWidth;
      const ry = (-_w.y * 0.5 + 0.5) * window.innerHeight;
      return { cx, cy, r: Math.hypot(rx - cx, ry - cy) };
    },
  };
}
