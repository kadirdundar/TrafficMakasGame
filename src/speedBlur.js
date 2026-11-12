import * as THREE from 'three';

// Radial ("zoom") blur of the road at speed: after the frame is drawn it is copied to a texture
// and the outer part of the picture is redrawn smeared towards the vanishing point. The middle of
// the view is left as it was drawn (the shader discards there). Costs one frame copy and one
// partial full-screen pass, and nothing at all below the speed where it starts.
//
// Only the world may streak past, so the cabin is kept out of that picture: its meshes live on
// their own layer and are drawn after the blur, on top of it (renderView). Below the blur speed
// the camera sees every layer and the frame is drawn in one pass as before.

export const CABIN_LAYER = 2;

// Moves the cabin's meshes to CABIN_LAYER and lets every light of the scene shine on that layer
// too (a camera only gathers the lights on its layers, and both passes must see the same lights:
// a different light count would be a different shader for every material).
export function separateCabin(cabin, scene) {
  cabin.traverse((obj) => {
    if (!obj.isLight && !obj.isCamera) obj.layers.set(CABIN_LAYER);
  });
  scene.traverse((obj) => {
    if (obj.isLight) obj.layers.enable(CABIN_LAYER);
  });
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// 8 taps from the pixel towards the vanishing point. The smear grows from nothing at INNER to
// its full length at OUTER (in screen heights from the vanishing point); each pixel starts its
// taps at a slightly different offset, which turns the banding of so few taps into fine grain.
const FRAGMENT = /* glsl */ `
  uniform sampler2D tFrame;
  uniform vec2 uCenter;
  uniform float uAspect;
  uniform float uStrength;
  varying vec2 vUv;
  const float INNER = 0.3;
  const float OUTER = 0.95;
  const int TAPS = 8;
  void main() {
    vec2 toPixel = vUv - uCenter;
    float r = length(toPixel * vec2(uAspect, 1.0));
    float amount = smoothstep(INNER, OUTER, r) * uStrength;
    if (amount < 0.002) discard;
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    vec2 stride = toPixel * amount / float(TAPS);
    vec3 sum = vec3(0.0);
    for (int i = 0; i < TAPS; i++) {
      sum += texture2D(tFrame, vUv - stride * (float(i) + grain)).rgb;
    }
    gl_FragColor = vec4(sum / float(TAPS), 1.0);
  }
`;

export class SpeedBlur {
  constructor(renderer) {
    this.renderer = renderer;
    this.size = new THREE.Vector2();
    this.frame = null;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tFrame: { value: null },
        uCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uAspect: { value: 1 },
        uStrength: { value: 0 },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    quad.frustumCulled = false;
    this.scene = new THREE.Scene();
    this.scene.add(quad);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  // Builds the shader ahead of the first fast run, so it does not stall a frame there
  compile() {
    this.renderer.compile(this.scene, this.camera);
  }

  // Draws the view of `camera`: in one pass when `strength` is 0, otherwise the world, the blur
  // over it and then the cabin. `strength` is the smear length at the screen edge as a share of
  // the distance to the vanishing point; `centerY` is the vanishing point's height on screen,
  // 0 at the bottom and 1 at the top.
  renderView(scene, camera, strength, centerY) {
    const renderer = this.renderer;
    if (strength <= 0) {
      renderer.render(scene, camera);
      return;
    }
    const layers = camera.layers.mask;
    camera.layers.disable(CABIN_LAYER);
    renderer.render(scene, camera);
    this.smear(strength, centerY);

    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    camera.layers.set(CABIN_LAYER);
    renderer.render(scene, camera);
    renderer.autoClear = autoClear;
    camera.layers.mask = layers;
  }

  smear(strength, centerY) {
    const renderer = this.renderer;
    renderer.getDrawingBufferSize(this.size);
    const w = Math.floor(this.size.x);
    const h = Math.floor(this.size.y);
    if (!this.frame || this.frame.image.width !== w || this.frame.image.height !== h) {
      this.frame?.dispose();
      this.frame = new THREE.FramebufferTexture(w, h);
      this.frame.minFilter = this.frame.magFilter = THREE.LinearFilter;
    }
    renderer.copyFramebufferToTexture(this.frame);

    const u = this.material.uniforms;
    u.tFrame.value = this.frame;
    u.uCenter.value.set(0.5, centerY);
    u.uAspect.value = w / h;
    u.uStrength.value = strength;

    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.render(this.scene, this.camera);
    renderer.autoClear = autoClear;
  }
}
