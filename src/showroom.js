import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Start-menu garage: the player's Audi A8 on a lit turntable that can be dragged around, zoomed
// and viewed from preset angles. It has its own small renderer on the menu canvas and only draws
// while the menu is open. The car is the same optimized glTF the online friends drive.

const TARGET = new THREE.Vector3(0, 0.62, 0);
// Half extents around TARGET that have to stay on screen: the car is 4.85 m long, its near corner
// looms larger in perspective, and seen from slightly above its length and height stack up
const FRAME_HALF_WIDTH = 3.1;
const FRAME_HALF_HEIGHT = 1.65;
const RING_RADIUS = 3.25;

// Camera angles: azimuth around the car (its nose points to -Z) and polar angle from straight up
const VIEWS = {
  front34: { azimuth: -2.3, polar: 1.3 },
  side: { azimuth: -Math.PI / 2, polar: 1.44 },
  rear34: { azimuth: 0.62, polar: 1.28 },
  front: { azimuth: Math.PI, polar: 1.42, zoom: 0.92 },
};

const AUTO_ROTATE_RESUME_MS = 4500;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function canvasTexture(size, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  draw(canvas.getContext('2d'), size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function radialTexture(stops) {
  return canvasTexture(256, (g, s) => {
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    stops.forEach(([at, color]) => grad.addColorStop(at, color));
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  });
}

// Dark studio with long softboxes (the clean highlight lines car photos are known for) and a
// low accent-coloured band that tints the sills and wheels in the turntable ring's colour
class StudioEnvironment {
  constructor(renderer) {
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.scene = this.build();
    this.texture = null;
  }

  build() {
    const env = new THREE.Scene();
    const room = new THREE.Mesh(
      new THREE.BoxGeometry(40, 16, 40),
      new THREE.MeshBasicMaterial({ color: 0x05070b, side: THREE.BackSide })
    );
    room.position.y = 7;
    env.add(room);

    const softbox = (w, h, intensity, position, rotation, tint = 0xffffff) => {
      const color = new THREE.Color(tint).multiplyScalar(intensity);
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
      );
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      env.add(mesh);
    };
    softbox(4, 22, 3.4, [0, 14.5, 0], [Math.PI / 2, 0, 0]);
    softbox(1.2, 22, 2.6, [-6, 13, 0], [Math.PI / 2, 0.35, 0]);
    softbox(1.2, 22, 2.6, [6, 13, 0], [Math.PI / 2, -0.35, 0]);
    softbox(26, 1.4, 2.0, [0, 4, -19.5], [0, 0, 0], 0xdfe9ff);
    softbox(26, 1.4, 1.4, [0, 4, 19.5], [0, Math.PI, 0], 0xfff1e0);
    softbox(1.6, 9, 1.6, [-19.5, 5, -6], [0, Math.PI / 2, 0]);
    softbox(1.6, 9, 1.6, [19.5, 5, 6], [0, -Math.PI / 2, 0]);

    this.accentMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 1.2, 48, 1, true), this.accentMat);
    band.position.y = -0.4;
    env.add(band);
    return env;
  }

  // Re-render the reflections with a new accent colour (a few ms, only on colour changes)
  update(accent) {
    this.accentMat.color.set(accent).multiplyScalar(1.6);
    const previous = this.texture;
    this.texture = this.pmrem.fromScene(this.scene, 0.035).texture;
    previous?.dispose();
    return this.texture;
  }
}

export class A8Showroom {
  // canvas: where the garage is drawn; stage: the empty layout box the car is framed into
  constructor(canvas, stage, { paintHex, accent = '#00f0ff', onReady } = {}) {
    this.canvas = canvas;
    this.stage = stage;
    this.onReady = onReady;
    this.active = false;
    this.raf = 0;
    this.car = null;
    this.paintHex = paintHex;
    this.lightsOn = false;
    this.autoRotate = true;
    this.resumeAt = 0;
    this.tween = null;
    this.fitDistance = 9;
    this.flashTimers = [];

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.studio = new StudioEnvironment(this.renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-4, 8, -3);
    this.scene.add(key, new THREE.HemisphereLight(0xbcd2ff, 0x0b0d12, 0.35));

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.copy(TARGET);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = 0.75;
    this.controls.zoomSpeed = 0.8;
    this.controls.minPolarAngle = 0.32;
    this.controls.maxPolarAngle = 1.5; // never below the floor
    this.controls.autoRotateSpeed = -0.9; // one slow turn per ~65 s
    this.controls.addEventListener('start', () => {
      this.tween = null;
      this.controls.autoRotate = false;
      this.resumeAt = Infinity;
      this.canvas.classList.add('dragging');
    });
    this.controls.addEventListener('end', () => {
      this.resumeAt = performance.now() + AUTO_ROTATE_RESUME_MS;
      this.canvas.classList.remove('dragging');
    });

    this.buildFloor();
    this.setAccent(accent);
    this.setCameraSpherical(VIEWS.front34.azimuth + 0.9, 1.38, this.fitDistance * 1.5);

    const resize = () => this.resize();
    window.addEventListener('resize', resize);
    new ResizeObserver(resize).observe(stage);
    this.resize();
    this.loadCar();
  }

  buildFloor() {
    // Glossy dark floor that fades into the page background at its edge
    const floorAlpha = radialTexture([
      [0, '#d6d6d6'],
      [0.42, '#bcbcbc'],
      [1, '#000'],
    ]);
    floorAlpha.colorSpace = THREE.NoColorSpace;
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(14, 72),
      new THREE.MeshStandardMaterial({
        color: 0x0b0e15,
        roughness: 0.34,
        metalness: 0.55,
        transparent: true,
        alphaMap: floorAlpha,
        depthWrite: false,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.001;
    this.scene.add(floor);

    // Turntable: crisp accent ring with a soft glow, a faint inner ring and lane markings
    const glowTex = canvasTexture(512, (g, s) => {
      const grad = g.createRadialGradient(s / 2, s / 2, s * 0.3, s / 2, s / 2, s / 2);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.62, 'rgba(255,255,255,0.0)');
      grad.addColorStop(0.79, 'rgba(255,255,255,0.55)');
      grad.addColorStop(0.86, 'rgba(255,255,255,0.08)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
    });
    const additive = (opts) =>
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, ...opts });
    this.ringMat = additive({ opacity: 0.95 });
    this.glowMat = additive({ map: glowTex, opacity: 0.7 });
    this.innerRingMat = additive({ opacity: 0.22 });

    const flat = (geometry, material, y) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = y;
      mesh.renderOrder = 2;
      this.scene.add(mesh);
      return mesh;
    };
    flat(new THREE.RingGeometry(RING_RADIUS - 0.025, RING_RADIUS + 0.025, 160), this.ringMat, 0.004);
    flat(new THREE.PlaneGeometry(RING_RADIUS * 2.53, RING_RADIUS * 2.53), this.glowMat, 0.003);
    flat(new THREE.RingGeometry(RING_RADIUS - 0.42, RING_RADIUS - 0.405, 160), this.innerRingMat, 0.004);

    // Dashed lane lines running off into the dark: the car is parked on the otoban
    const dashTex = canvasTexture(64, (g, s) => {
      const grad = g.createLinearGradient(0, 0, 0, s);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.3, 'rgba(255,255,255,1)');
      grad.addColorStop(0.7, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      for (let y = 0; y < s; y += 16) g.fillRect(0, y, s, 9);
    });
    dashTex.wrapT = THREE.RepeatWrapping;
    dashTex.repeat.set(1, 1);
    const laneMat = new THREE.MeshBasicMaterial({ map: dashTex, transparent: true, opacity: 0.16, depthWrite: false });
    [-1, 1].forEach((side) => flat(new THREE.PlaneGeometry(0.12, 26), laneMat, 0.002).position.setX(side * 2.15));

    // Soft contact shadow under the body
    const shadow = flat(
      new THREE.PlaneGeometry(2.6, 5.5),
      new THREE.MeshBasicMaterial({
        map: radialTexture([
          [0, 'rgba(0,0,0,0.85)'],
          [0.55, 'rgba(0,0,0,0.55)'],
          [1, 'rgba(0,0,0,0)'],
        ]),
        transparent: true,
        depthWrite: false,
      }),
      0.005
    );
    shadow.renderOrder = 3;
  }

  async loadCar() {
    try {
      const { loadA8PeerCar } = await import('./peerA8.js');
      const car = await loadA8PeerCar({ paintHex: this.paintHex });
      this.car = car;
      this.scene.add(car.group);

      // Mirror image under the semi-transparent floor gives the glossy-floor reflection
      const reflection = car.group.clone();
      reflection.scale.y = -1;
      this.scene.add(reflection);

      car.setLights({ night: this.lightsOn });
      this.goToView('front34', 1.8);
      this.onReady?.(true);
    } catch (err) {
      console.warn('Garaj modeli yüklenemedi', err);
      this.onReady?.(false);
    }
  }

  setActive(active) {
    if (active === this.active) return;
    this.active = active;
    cancelAnimationFrame(this.raf);
    if (!active) return;
    this.lastFrame = performance.now();
    this.resize();
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      this.frame();
    };
    loop();
  }

  // Frame the car into the stage box (the part of the screen the menu panels leave free)
  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    const canvasRect = this.canvas.getBoundingClientRect();
    const stageRect = this.stage.getBoundingClientRect();
    const free = stageRect.width > 40 && stageRect.height > 40 ? stageRect : canvasRect;
    const cx = free.left - canvasRect.left + free.width / 2;
    const cy = free.top - canvasRect.top + free.height / 2;

    this.camera.aspect = w / h;
    this.camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
    this.camera.updateProjectionMatrix();

    const tanHalf = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const fitV = FRAME_HALF_HEIGHT / (tanHalf * (free.height / h));
    const fitH = FRAME_HALF_WIDTH / (tanHalf * this.camera.aspect * (free.width / w));
    const fit = Math.max(fitV, fitH);
    const scale = fit / this.fitDistance;
    this.fitDistance = fit;
    this.controls.minDistance = fit * 0.5;
    this.controls.maxDistance = fit * 1.45;
    if (!this.tween) {
      const s = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(TARGET));
      this.setCameraSpherical(s.theta, s.phi, THREE.MathUtils.clamp(s.radius * scale, fit * 0.5, fit * 1.45));
    } else {
      this.tween.from.radius *= scale;
      this.tween.to.radius *= scale;
    }
    if (this.active) this.frame(0);
  }

  setCameraSpherical(theta, phi, radius) {
    this.camera.position.setFromSphericalCoords(radius, phi, theta).add(TARGET);
    this.camera.lookAt(TARGET);
  }

  goToView(key, duration = 1.1) {
    const view = VIEWS[key];
    if (!view) return;
    const from = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(TARGET));
    // Take the short way round
    const turn = THREE.MathUtils.euclideanModulo(view.azimuth - from.theta + Math.PI, Math.PI * 2) - Math.PI;
    this.tween = {
      start: performance.now(),
      duration: duration * 1000,
      from: { theta: from.theta, phi: from.phi, radius: from.radius },
      to: { theta: from.theta + turn, phi: view.polar, radius: this.fitDistance * (view.zoom ?? 1) },
    };
    this.controls.autoRotate = false;
    this.resumeAt = Infinity;
  }

  frame(forcedDt) {
    const now = performance.now();
    const dt = forcedDt ?? Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;

    if (this.tween) {
      const tw = this.tween;
      const t = Math.min(1, (now - tw.start) / tw.duration);
      const k = easeInOutCubic(t);
      const lerp = (a, b) => a + (b - a) * k;
      this.setCameraSpherical(lerp(tw.from.theta, tw.to.theta), lerp(tw.from.phi, tw.to.phi), lerp(tw.from.radius, tw.to.radius));
      if (t >= 1) {
        this.tween = null;
        this.resumeAt = now + AUTO_ROTATE_RESUME_MS;
      }
    } else {
      if (now >= this.resumeAt) {
        this.controls.autoRotate = this.autoRotate;
        this.resumeAt = Infinity;
      }
      this.controls.update(dt);
    }
    this.renderer.render(this.scene, this.camera);
  }

  setPaint(hex) {
    this.paintHex = hex;
    this.car?.bodyMat.color.setHex(hex);
  }

  setAccent(cssColor) {
    const color = new THREE.Color(cssColor);
    this.ringMat.color.copy(color);
    this.glowMat.color.copy(color);
    this.innerRingMat.color.copy(color);
    this.scene.environment = this.studio.update(color);
  }

  setLights(on) {
    this.lightsOn = on;
    this.car?.setLights({ night: on });
  }

  // Two quick high-beam flashes, like the selektör on the otoban
  flashHighBeam() {
    if (!this.car) return;
    this.flashTimers.forEach(clearTimeout);
    const set = (highBeam) => this.car.setLights({ night: this.lightsOn, highBeam });
    set(true);
    this.flashTimers = [
      setTimeout(() => set(false), 150),
      setTimeout(() => set(true), 280),
      setTimeout(() => set(false), 430),
    ];
  }

  setAutoRotate(on) {
    this.autoRotate = on;
    this.controls.autoRotate = false;
    if (!this.tween) this.resumeAt = on ? performance.now() : Infinity;
  }
}
