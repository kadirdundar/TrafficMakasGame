import * as THREE from 'three';

// Smoke off the rear tyres while the car drifts: a small pool of soft round puffs drawn as one
// set of points (one draw call). The road scrolls under the car, so a puff left on the road
// streams backwards at the car's speed, rising and thinning as it goes.

const COUNT = 64;
const LIFE_SEC = 1.1;
const REAR_AXLE_Z = 1.35; // m behind the car's centre
const HALF_TRACK = 0.8; // m from the centre line to a rear wheel

export class TyreSmoke {
  constructor(scene) {
    this.pos = new Float32Array(COUNT * 3);
    this.alpha = new Float32Array(COUNT);
    this.size = new Float32Array(COUNT);
    this.age = new Float32Array(COUNT).fill(LIFE_SEC);
    this.vel = new Float32Array(COUNT * 3);
    this.next = 0;
    this.owed = 0; // puffs still to emit (fractions carry over between frames)
    this.live = 0;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: { uHalfHeight: { value: 400 }, uColor: { value: new THREE.Color(0.86, 0.87, 0.9) } },
      vertexShader: /* glsl */ `
        attribute float aAlpha;
        attribute float aSize;
        uniform float uHalfHeight;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4( position, 1.0 );
          vAlpha = aAlpha;
          gl_Position = projectionMatrix * mv;
          // aSize is the puff's diameter in metres
          gl_PointSize = aAlpha > 0.0 ? aSize * projectionMatrix[ 1 ][ 1 ] * uHalfHeight / max( 0.1, - mv.z ) : 0.0;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length( gl_PointCoord - 0.5 );
          float a = smoothstep( 0.5, 0.12, d ) * vAlpha;
          if ( a < 0.004 ) discard;
          gl_FragColor = vec4( uColor, a );
        }`,
      transparent: true,
      depthWrite: false,
    });
    this.points = new THREE.Points(geo, material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 3;
    this.points.visible = false;
    // Point sizes are in pixels of whatever is being drawn into (the screen, or the mirror's texture)
    this.points.onBeforeRender = (renderer) => {
      const target = renderer.getRenderTarget();
      material.uniforms.uHalfHeight.value = (target ? target.height : renderer.domElement.height) / 2;
    };
    scene.add(this.points);
  }

  // amount 0..1: how hard the tyres are sliding. x: the car's place across the road, yaw: its
  // rotation about Y (as on its model), speedMs: how fast the road goes by.
  update(dt, { amount, x, yaw, speedMs, night = false }) {
    this.owed += amount > 0.15 ? amount * 70 * dt : 0;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    while (this.owed >= 1) {
      this.owed -= 1;
      const i = this.next;
      this.next = (this.next + 1) % COUNT;
      const side = i % 2 ? 1 : -1;
      const lx = side * HALF_TRACK;
      this.pos[i * 3] = x + lx * cos + REAR_AXLE_Z * sin + (Math.random() - 0.5) * 0.2;
      this.pos[i * 3 + 1] = 0.12;
      this.pos[i * 3 + 2] = -lx * sin + REAR_AXLE_Z * cos;
      this.vel[i * 3] = (Math.random() - 0.5) * 1.2;
      this.vel[i * 3 + 1] = 0.5 + Math.random() * 0.7;
      this.vel[i * 3 + 2] = speedMs * (0.82 + Math.random() * 0.12);
      this.age[i] = 0;
    }
    let live = 0;
    for (let i = 0; i < COUNT; i++) {
      if (this.age[i] >= LIFE_SEC) {
        this.alpha[i] = 0;
        continue;
      }
      this.age[i] += dt;
      const t = this.age[i] / LIFE_SEC;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.vel[i * 3 + 2] *= Math.exp(-dt * 0.8); // the air slows it
      this.size[i] = 0.5 + t * 2.4;
      this.alpha[i] = t >= 1 ? 0 : (night ? 0.2 : 0.34) * (1 - t) * Math.min(1, t * 12);
      live++;
    }
    if (live === 0 && this.live === 0) {
      this.points.visible = false;
      return;
    }
    this.live = live;
    this.points.visible = true;
    const attrs = this.points.geometry.attributes;
    attrs.position.needsUpdate = true;
    attrs.aAlpha.needsUpdate = true;
    attrs.aSize.needsUpdate = true;
  }

  reset() {
    this.age.fill(LIFE_SEC);
    this.alpha.fill(0);
    this.owed = 0;
    this.live = 0;
    this.points.visible = false;
  }
}
