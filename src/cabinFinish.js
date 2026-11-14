import * as THREE from 'three';

// Surface finishes of the cabin: what a material is made of (car.js → cockpit.finishes).
//
// Most cabin models come with flat, single-colour materials and no surface texture, and the
// loader made everything matte. A finish gives a material the gloss of the real thing (piano
// black and trim metal reflect the road and the sky, leather and plastic do not) and, for leather,
// plastic and fabric, a fine grain: one small tiling relief map per kind, shared by every car.
//
// The grain needs no UVs (many of these models have none worth using: a single colour swatch):
// it is projected along the surface's dominant axis in the mesh's own space, in metres, so it
// stays put on the steering wheel as it turns and has the same size on every car.

// `grain`: which relief; `tile`: its size on the surface (m); `depth`: how high it stands (m)
export const FINISHES = {
  leather: { roughness: 0.6, metalness: 0, grain: 'leather', tile: 0.03, depth: 0.00034 },
  plastic: { roughness: 0.66, metalness: 0, grain: 'plastic', tile: 0.026, depth: 0.0002 },
  fabric: { roughness: 0.95, metalness: 0, grain: 'fabric', tile: 0.028, depth: 0.00026 },
  gloss: { roughness: 0.16, metalness: 0.5 }, // piano black
  // Trim metal. Only half metallic: a full metal shows nothing but its reflections, which here
  // is the sky by day (the trim turned blue) and nothing at night (it turned black)
  satin: { roughness: 0.4, metalness: 0.5, color: 0xb4b9c0 }, // brushed aluminium / matt chrome
  chrome: { roughness: 0.2, metalness: 0.75 },
};

// A finish is a name from FINISHES, or { finish: name, ...overrides }, or just overrides
// (e.g. { roughness: 0.3 } on a material whose textures are fine as they are)
export function resolveFinish(value) {
  if (!value) return null;
  if (typeof value === 'string') return FINISHES[value] || null;
  return { ...(FINISHES[value.finish] || {}), ...value };
}

const GRAIN_PX = 256;
const grainMaps = new Map();

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Distances to the nearest and second nearest of `cells` x `cells` jittered points, wrapping at
// the edges so the map tiles (in cell units)
function cellNoise(cells, seed) {
  const rand = mulberry32(seed);
  const pts = new Float32Array(cells * cells * 2);
  for (let i = 0; i < pts.length; i++) pts[i] = 0.15 + rand() * 0.7;
  return (u, v) => {
    const x = u * cells;
    const y = v * cells;
    const cx = Math.floor(x);
    const cy = Math.floor(y);
    let f1 = 9;
    let f2 = 9;
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const gx = cx + i;
        const gy = cy + j;
        const k = ((((gy % cells) + cells) % cells) * cells + (((gx % cells) + cells) % cells)) * 2;
        const d = Math.hypot(gx + pts[k] - x, gy + pts[k + 1] - y);
        if (d < f1) {
          f2 = f1;
          f1 = d;
        } else if (d < f2) f2 = d;
      }
    }
    return [f1, f2];
  };
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Height (0..1) at (u, v) of each grain
const GRAINS = {
  // Pebbles with creases between them, a few larger folds running through
  leather: () => {
    const pebble = cellNoise(11, 7);
    const fold = cellNoise(4, 19);
    return (u, v) => {
      const [f1, f2] = pebble(u, v);
      const [g1, g2] = fold(u, v);
      return smooth(0, 0.42, f2 - f1) * (0.78 + 0.22 * smooth(0, 0.3, g2 - g1));
    };
  },
  // Soft-touch plastic: small rounded bumps
  plastic: () => {
    const bump = cellNoise(14, 31);
    return (u, v) => 1 - smooth(0.1, 0.75, bump(u, v)[0]);
  },
  // Woven cloth: threads crossing over and under
  fabric: () => {
    const n = 14;
    return (u, v) => {
      const a = Math.sin(u * n * Math.PI * 2);
      const b = Math.sin(v * n * Math.PI * 2);
      return 0.5 + 0.25 * (a * a - b * b) + 0.25 * Math.abs(a * b);
    };
  },
};

// The grain as a texture of slopes: how fast the height changes along u and along v (red and
// green, 0.5 = level). One read gives the tilt of the surface; smaller mip levels average the
// slopes out, so the grain flattens by itself where it gets too fine to see.
// Returns { texture, slope }: `slope` is the height change per tile that a full-scale texel stands for.
function grainMap(kind) {
  let map = grainMaps.get(kind);
  if (map) return map;
  const N = GRAIN_PX;
  const height = GRAINS[kind]();
  const h = new Float32Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) h[y * N + x] = height((x + 0.5) / N, (y + 0.5) / N);
  const at = (x, y) => h[((y + N) % N) * N + ((x + N) % N)];
  const du = new Float32Array(N * N);
  const dv = new Float32Array(N * N);
  let slope = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      du[i] = (at(x + 1, y) - at(x - 1, y)) * 0.5 * N;
      dv[i] = (at(x, y + 1) - at(x, y - 1)) * 0.5 * N;
      slope = Math.max(slope, Math.abs(du[i]), Math.abs(dv[i]));
    }
  }
  const data = new Uint8Array(N * N * 2);
  for (let i = 0; i < N * N; i++) {
    data[i * 2] = Math.round(127.5 + (127.5 * du[i]) / slope);
    data[i * 2 + 1] = Math.round(127.5 + (127.5 * dv[i]) / slope);
  }
  const texture = new THREE.DataTexture(data, N, N, THREE.RGFormat, THREE.UnsignedByteType);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  map = { texture, slope };
  grainMaps.set(kind, map);
  return map;
}

// ?nograin in the address leaves the grain out (the gloss stays): to compare on a device
const GRAIN_ON = typeof location === 'undefined' || !new URLSearchParams(location.search).has('nograin');

// Sets `material` up as `finish` (resolveFinish). Returns the grain uniforms for patchCabinMaterial
// when the finish has a grain and the material has no normal map of its own, else null.
export function applyFinish(material, finish) {
  if (finish.roughness !== undefined) material.roughness = finish.roughness;
  if (finish.metalness !== undefined) material.metalness = finish.metalness;
  if (finish.color !== undefined) material.color.set(finish.color);
  if (!GRAIN_ON || !finish.grain || material.normalMap) return null;
  const map = grainMap(finish.grain);
  return {
    grainMap: { value: map.texture },
    grainTile: { value: 1 / finish.tile },
    // Metres of height per tile for a full-scale texel (the texel is 0..1 around 0.5)
    grainSlope: { value: 2 * map.slope * finish.depth },
  };
}

const GRAIN_PARS = /* glsl */ `
  uniform sampler2D grainMap;
  uniform float grainTile;
  uniform float grainSlope;
  varying vec3 vGrainPos;
  // The view-space normal tilted by the grain's relief at this point
  vec3 cabinGrain( vec3 n ) {
    vec3 dpx = dFdx( vGrainPos );
    vec3 dpy = dFdy( vGrainPos );
    // Project along the axis the face looks down most (the same for a whole triangle)
    vec3 a = abs( cross( dpx, dpy ) );
    vec2 uv; vec2 dx; vec2 dy;
    if ( a.x > a.y && a.x > a.z ) { uv = vGrainPos.zy; dx = dpx.zy; dy = dpy.zy; }
    else if ( a.y > a.z ) { uv = vGrainPos.xz; dx = dpx.xz; dy = dpy.xz; }
    else { uv = vGrainPos.xy; dx = dpx.xy; dy = dpy.xy; }
    uv *= grainTile; dx *= grainTile; dy *= grainTile;
    // Where a pixel covers a whole pebble or more (far away, or seen edge-on) there is nothing
    // to show: the surface is left smooth and the texture read is skipped. The grain fades in
    // as the surface comes closer.
    float foot = max( dot( dx, dx ), dot( dy, dy ) );
    if ( foot > 0.012 ) return n;
    vec2 slope = ( textureGrad( grainMap, uv, dx, dy ).rg - 0.5 ) * grainSlope;
    // Height change one pixel across and one pixel down
    float hx = dot( slope, dx );
    float hy = dot( slope, dy );
    // ... over the distance on the surface that pixel covers: the tilt of the normal
    vec3 sx = dFdx( - vViewPosition );
    vec3 sy = dFdy( - vViewPosition );
    vec3 r1 = cross( sy, n );
    vec3 r2 = cross( n, sx );
    float det = dot( sx, r1 );
    if ( abs( det ) < 1e-14 ) return n;
    float fade = 1.0 - smoothstep( 0.004, 0.012, foot );
    return normalize( n - ( hx * r1 + hy * r2 ) * ( fade / det ) );
  }
`;

// Adds to a lit cabin material, in one shader patch:
//   occlusion  { cabinInverse, cabinOcclusion } uniforms: darkens by height in cockpit space
//   grain      uniforms from applyFinish: fine surface relief
export function patchCabinMaterial(material, { occlusion = null, grain = null } = {}) {
  if (!occlusion && !grain) return;
  material.onBeforeCompile = (shader) => {
    if (occlusion) {
      Object.assign(shader.uniforms, occlusion);
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
    }
    if (grain) {
      Object.assign(shader.uniforms, grain);
      // Mesh space in metres (the models are quantised: integer positions scaled by their node)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vGrainPos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGrainPos = position * length( modelMatrix[ 0 ].xyz );');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${GRAIN_PARS}`)
        .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal = cabinGrain( normal );');
    }
  };
  material.customProgramCacheKey = () => `cabin${occlusion ? '-occlusion' : ''}${grain ? '-grain' : ''}`;
}
