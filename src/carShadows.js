import * as THREE from 'three';

// Shadows of the cars on the road, without a shadow map: every car gets a soft dark patch under
// its body (the contact shadow that makes it sit on the road) and, while the sun is out, a second,
// lighter one stretched away from the sun. Each kind is one instanced mesh, so all the cars'
// shadows cost two draw calls however many cars are on the road.

const LIFT_M = 0.03; // above the asphalt
const CONTACT_OPACITY = 0.8;

// Soft-edged rounded rectangle: opaque in the middle, fading out towards the edge
function patchTexture() {
  const w = 64;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const radius = 0.55; // corner radius, in half-widths
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Distance to the edge of a rounded box, in half-widths (the patch is twice as long as wide)
      const px = Math.abs(((x + 0.5) / w) * 2 - 1);
      const py = Math.abs(((y + 0.5) / h) * 2 - 1) * 2;
      const qx = Math.max(px - (1 - radius), 0);
      const qy = Math.max(py - (2 - radius), 0);
      const inside = radius - Math.hypot(qx, qy); // 0 at the edge, grows inwards
      const t = Math.min(1, Math.max(0, inside / 0.45));
      img.data[(y * w + x) * 4 + 3] = Math.round(255 * t * t * (3 - 2 * t));
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

// Black patch that the fog thins out instead of tinting: far away the road is mostly fog, so a
// shadow there has to fade, not turn into a fog-coloured blot
function patchMaterial(map, opacity) {
  const mat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    map, // only its alpha is used: the patch is black
    transparent: true,
    opacity,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <fog_fragment>',
      `#ifdef USE_FOG
        gl_FragColor.a *= exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
      #endif`
    );
  };
  return mat;
}

export class CarShadows {
  // `eachCar(visit)` calls visit(group, spec) for every car that may be on the road: `group` is
  // the object placed on the road (its position, yaw and pitch are used, and its visibility),
  // `spec` gives the car's width, length and height in metres.
  constructor(scene, eachCar, capacity = 64) {
    this.eachCar = eachCar;
    this.capacity = capacity;
    this.dirty = true;
    // Shadow thrown per metre of car height, on the road plane; null = no sun (see setSun)
    this.sun = null;

    const geometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    const map = patchTexture();
    const make = (opacity) => {
      const mesh = new THREE.InstancedMesh(geometry, patchMaterial(map, opacity), capacity);
      mesh.count = 0;
      mesh.frustumCulled = false; // the instances are spread along the whole road
      mesh.renderOrder = 1; // under the cars' light pools and glows (2)
      mesh.matrixAutoUpdate = false;
      scene.add(mesh);
      return mesh;
    };
    this.contact = make(CONTACT_OPACITY);
    this.cast = make(0.3);
    this.cast.visible = false;

    // Placed right before each view is drawn, once the cars of this frame are where they will
    // be shown; the mirror, the main view and the replay camera all draw the same patches
    const previous = scene.onBeforeRender;
    scene.onBeforeRender = (...args) => {
      previous?.apply(scene, args);
      if (this.dirty) this.place();
    };

    this._pos = new THREE.Vector3();
    this._quat = new THREE.Quaternion();
    this._euler = new THREE.Euler();
    this._scale = new THREE.Vector3();
    this._matrix = new THREE.Matrix4();
    this._visit = (group, spec) => this.addCar(group, spec);
  }

  // `x`, `z`: how far the shadow of a point 1 m above the road falls from it (scene axes: +x is
  // right, +z is towards the back). `opacity` 0 or no arguments: no sun.
  setSun(x = 0, z = 0, opacity = 0) {
    this.sun = opacity > 0 ? { x, z } : null;
    this.cast.visible = Boolean(this.sun);
    if (this.sun) this.cast.material.opacity = opacity;
  }

  // Call once per frame, before anything is drawn
  frame() {
    this.dirty = true;
  }

  place() {
    this.dirty = false;
    this.count = 0;
    this.eachCar(this._visit);
    for (const mesh of [this.contact, this.cast]) {
      mesh.count = this.count;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  addCar(group, spec) {
    if (!group.visible || this.count >= this.capacity) return;
    const i = this.count++;
    const rot = group.rotation;
    // Yaw and the road's slope; the body's own roll would dip one side of the patch under the road
    this._quat.setFromEuler(this._euler.set(rot.x, rot.y, 0, rot.order));

    // Contact shadow: a little larger than the car, so its soft edge shows around the body
    this._pos.set(0, LIFT_M, 0).applyQuaternion(this._quat).add(group.position);
    this._scale.set(spec.width * 1.3, 1, spec.length * 1.14);
    this.contact.setMatrixAt(i, this._matrix.compose(this._pos, this._quat, this._scale));

    if (!this.sun) return;
    // Sun shadow: the footprint swept from the car to where its roof's shadow lands, in the
    // car's own axes (the roof is narrower than the body, hence less than the full height)
    const reach = spec.height * 0.8;
    const sin = Math.sin(rot.y);
    const cos = Math.cos(rot.y);
    const offX = (this.sun.x * cos - this.sun.z * sin) * reach;
    const offZ = (this.sun.x * sin + this.sun.z * cos) * reach;
    this._pos.set(offX / 2, LIFT_M * 0.8, offZ / 2).applyQuaternion(this._quat).add(group.position);
    this._scale.set((spec.width + Math.abs(offX)) * 1.12, 1, (spec.length + Math.abs(offZ)) * 1.06);
    this.cast.setMatrixAt(i, this._matrix.compose(this._pos, this._quat, this._scale));
  }
}
