import * as THREE from 'three';

// Light that lies on the road surface: the pools under the street lamps and, on a wet road, the
// long streaks every lamp, tail light and headlight throws towards the viewer.
//
// All of it is drawn additively on flat quads just above the asphalt. Additive light must not be
// tinted by the fog like a lit surface (that would add the fog colour and make far patches
// glow); it fades out into the fog instead (fadeInFog).

// Reflections on a wet road stretch from the light towards the eye: roughly this share of the
// distance between them (tail lights sit low, so theirs ends well before the viewer; a street
// lamp is high up and its reflection reaches much closer)
export const STREAK_REACH = { car: 0.75, lamp: 0.9 };

// An additive material that fades to nothing in the fog instead of turning fog-coloured
export function fadeInFog(material) {
  material.fog = true;
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <fog_fragment>',
      `#ifdef USE_FOG
        #ifdef FOG_EXP2
          float fogFade = exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
        #else
          float fogFade = 1.0 - smoothstep( fogNear, fogFar, vFogDepth );
        #endif
        gl_FragColor.rgb *= fogFade;
      #endif`
    );
  };
  material.customProgramCacheKey = () => 'fadeInFog';
  return material;
}

// A pool of lamp light: a broad, even glow under the lamp (no hot spot), fading softly to nothing
// at the edge
export function createLampPoolTexture() {
  const S = 128;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.72, 'rgba(255,255,255,0.16)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// One reflection streak. Across it (u) a narrow soft line; along it (v) it rises from 0, stays
// bright up to about half way and fades out towards 1, broken by the ripples of the water film
// so it shimmers rather than shining like a mirror.
function createStreakTexture() {
  const W = 32;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(W, H);
  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  for (let y = 0; y < H; y++) {
    const v = 1 - (y + 0.5) / H; // canvas rows run top-down, the texture's v bottom-up
    const along = smooth(0, 0.18, v) * (1 - smooth(0.42, 1, v));
    const ripple = 0.62 + 0.38 * Math.abs(Math.sin(v * 71 + 1.3) * Math.sin(v * 29 + 0.4));
    for (let x = 0; x < W; x++) {
      const u = (x + 0.5) / W - 0.5;
      // Wider where the ripples catch the light
      const across = Math.exp(-(u * u) / (2 * 0.16 * 0.16 * (0.8 + 0.4 * ripple)));
      const i = (y * W + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(255 * along * ripple * across);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

// Every streak on the road shares this material (coloured per vertex), so the drawBatcher draws
// the traffic's and the street lamps' streaks together in one call
let streakMaterial = null;
export function wetStreakMaterial() {
  if (!streakMaterial) {
    streakMaterial = fadeInFog(
      new THREE.MeshBasicMaterial({
        map: createStreakTexture(),
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      })
    );
  }
  return streakMaterial;
}

// Flat quads on the road, one per x in `xs`, `width` wide, from z = 0 to z = 1 (the mesh is
// scaled to the streak's length and turned towards the viewer). `vNear` / `vFar` are the
// texture's v at z = 0 and z = 1. All vertices carry `hex` × `k` as their colour.
export function roadQuads({ xs, width, hex = 0xffffff, k = 1, vNear = 0, vFar = 1, y = 0.03 }) {
  const c = new THREE.Color(hex).multiplyScalar(k);
  const position = [];
  const normal = [];
  const uv = [];
  const color = [];
  const index = [];
  xs.forEach((x, q) => {
    const x0 = x - width / 2;
    const x1 = x + width / 2;
    position.push(x0, y, 0, x1, y, 0, x1, y, 1, x0, y, 1);
    uv.push(0, vNear, 1, vNear, 1, vFar, 0, vFar);
    for (let i = 0; i < 4; i++) {
      normal.push(0, 1, 0);
      color.push(c.r, c.g, c.b);
    }
    const a = q * 4;
    // Wound to face up
    index.push(a, a + 2, a + 1, a, a + 3, a + 2);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
  geo.setIndex(index);
  return geo;
}

// Where on the road the eye looking at the reflections is: under the game camera (cockpit or
// chase view), set by the game every frame before the world and the traffic move. `stopZ` is
// the nose of the player's own car: the reflection of a light ahead ends there, as the car is
// in the way of whatever would lie under and behind it (seen from the chase camera).
const viewer = { x: 0, z: 0, stopZ: Infinity };
export function setStreakViewer(x, z, stopZ = Infinity) {
  viewer.x = x;
  viewer.z = z;
  viewer.stopZ = stopZ;
}

// Turns and stretches a streak mesh (built by roadQuads, its origin at the light's foot) so that
// it runs from the light towards the viewer, the way a reflection on wet asphalt does: a line
// standing straight up on the screen. `lightX` / `lightZ` are where the light stands in the
// world, `parentYaw` how far the mesh's parent is turned. Hidden once the light is nearly at the
// viewer, where its reflection is under the car.
export function aimStreak(mesh, lightX, lightZ, parentYaw, reach, maxLen) {
  const dx = viewer.x - lightX;
  const dz = viewer.z - lightZ;
  const dist = Math.hypot(dx, dz);
  let len = Math.min(maxLen, dist * reach);
  if (lightZ < viewer.stopZ && dz > 0) len = Math.min(len, ((viewer.stopZ - lightZ) * dist) / dz);
  if (dist < 4 || len < 1) {
    mesh.visible = false;
    return;
  }
  mesh.visible = true;
  mesh.rotation.y = Math.atan2(dx, dz) - parentYaw;
  mesh.scale.z = len;
}
