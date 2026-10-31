// Fine surface relief (leather grain, plastic stipple) as tangent-space normal maps, so flat cabin
// materials catch the light like the real thing. Costs one small texture per material.
//   rule: { materials, from: 'base' | 'leather' | 'plastic', strength = 1, repeat = 30, size = 256 }
//   'base'    the material's own base colour texture is read as a height map (same UVs)
//   'leather' / 'plastic'  a tileable procedural grain; parts without UVs get box-projected UVs
//             (`repeat` tiles per metre, along the two axes facing away from the vertex normal)
import sharp from 'sharp';
import { KHRTextureTransform } from '@gltf-transform/extensions';
import { matches } from './gltf-utils.mjs';

// Generated UVs cover ±BOX metres as [0, 1] (so meshopt can quantize them); the texture transform
// scales them back up to `repeat` tiles per metre. An integer repeat keeps the offset seamless.
const BOX = 3;

export async function addDetailNormals(doc, rules = []) {
  const root = doc.getRoot();
  for (const rule of rules) {
    for (const mat of root.listMaterials().filter((m) => matches(rule.materials, m.getName()))) {
      let height;
      if (rule.from === 'base') {
        const tex = mat.getBaseColorTexture();
        if (!tex) continue;
        const max = rule.size ?? 256; // relief only: a 512 px source adds file size, not visible grain
        const { data, info } = await sharp(Buffer.from(tex.getImage()))
          .resize(max, max, { fit: 'inside', withoutEnlargement: true })
          .greyscale()
          .raw()
          .toBuffer({ resolveWithObject: true });
        height = { w: info.width, h: info.height, v: normalise(Float32Array.from(data)) };
      } else {
        const size = rule.size ?? 256;
        height = { w: size, h: size, v: normalise(rule.from === 'leather' ? leatherGrain(size) : plasticStipple(size)) };
        const prims = root.listMeshes().flatMap((m) => m.listPrimitives()).filter((p) => p.getMaterial() === mat);
        prims.forEach((p) => boxUVs(doc, p));
      }
      const png = await normalPng(height);
      const tex = doc.createTexture(`${mat.getName()}_detail_n`).setImage(png).setMimeType('image/png');
      mat.setNormalTexture(tex).setNormalScale(rule.strength ?? 1);
      if (rule.from !== 'base') {
        const repeat = Math.round(rule.repeat ?? 30) * 2 * BOX;
        const transform = doc.createExtension(KHRTextureTransform).createTransform().setScale([repeat, repeat]);
        mat.getNormalTextureInfo().setExtension('KHR_texture_transform', transform);
      }
      console.log(`  Yüzey dokusu: ${mat.getName()} (${rule.from})`);
    }
  }
}

// Zero mean, unit spread, clamped: low-contrast dark textures give the same relief as bright ones
function normalise(v) {
  const n = v.length;
  let mean = 0;
  for (let i = 0; i < n; i++) mean += v[i] / n;
  let sd = 0;
  for (let i = 0; i < n; i++) sd += (v[i] - mean) ** 2 / n;
  sd = Math.sqrt(sd) || 1;
  return v.map((x) => Math.max(-2.5, Math.min(2.5, (x - mean) / sd)));
}

// Central differences with wrap-around (the textures tile)
async function normalPng({ w, h, v }) {
  const out = Buffer.alloc(w * h * 3);
  const at = (x, y) => v[((y + h) % h) * w + ((x + w) % w)];
  const k = 0.35;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = -(at(x + 1, y) - at(x - 1, y)) * k;
      const ny = (at(x, y + 1) - at(x, y - 1)) * k;
      const len = Math.hypot(nx, ny, 1);
      const i = (y * w + x) * 3;
      out[i] = Math.round((nx / len * 0.5 + 0.5) * 255);
      out[i + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
      out[i + 2] = Math.round((1 / len * 0.5 + 0.5) * 255);
    }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
}

function random(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Pebbled leather: rounded cells (distance to the nearest cell border, F2 - F1), plus fine noise
function leatherGrain(size, cells = 22) {
  const rnd = random(7);
  const pts = Array.from({ length: cells * cells }, (_, i) => [(i % cells) + rnd(), Math.floor(i / cells) + rnd()]);
  const v = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = (x / size) * cells;
      const py = (y / size) * cells;
      let f1 = Infinity;
      let f2 = Infinity;
      const cx = Math.floor(px);
      const cy = Math.floor(py);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const gx = (cx + dx + cells) % cells;
          const gy = (cy + dy + cells) % cells;
          const [qx, qy] = pts[gy * cells + gx];
          const d = Math.hypot(px - (qx - gx + cx + dx), py - (qy - gy + cy + dy));
          if (d < f1) [f1, f2] = [d, f1];
          else if (d < f2) f2 = d;
        }
      }
      v[y * size + x] = Math.min(1, (f2 - f1) * 2.2) + rnd() * 0.15;
    }
  }
  return v;
}

// Fine moulded-plastic stipple: two octaves of tileable value noise
function plasticStipple(size) {
  const v = new Float32Array(size * size);
  for (const [grid, amp, seed] of [[64, 1, 3], [128, 0.5, 5]]) {
    const rnd = random(seed);
    const g = Float32Array.from({ length: grid * grid }, () => rnd());
    const val = (x, y) => g[((y + grid) % grid) * grid + ((x + grid) % grid)];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const fx = (x / size) * grid;
        const fy = (y / size) * grid;
        const ix = Math.floor(fx);
        const iy = Math.floor(fy);
        const tx = (fx - ix) ** 2 * (3 - 2 * (fx - ix));
        const ty = (fy - iy) ** 2 * (3 - 2 * (fy - iy));
        const top = val(ix, iy) * (1 - tx) + val(ix + 1, iy) * tx;
        const bottom = val(ix, iy + 1) * (1 - tx) + val(ix + 1, iy + 1) * tx;
        v[y * size + x] += (top * (1 - ty) + bottom * ty) * amp;
      }
    }
  }
  return v;
}

// UVs from the world position, projected along the vertex normal's dominant axis
function boxUVs(doc, prim) {
  if (prim.getAttribute('TEXCOORD_0')) return;
  const pos = prim.getAttribute('POSITION');
  const nrm = prim.getAttribute('NORMAL');
  if (!pos || !nrm) return;
  const uv = new Float32Array(pos.getCount() * 2);
  const p = [];
  const n = [];
  for (let i = 0; i < pos.getCount(); i++) {
    pos.getElement(i, p);
    nrm.getElement(i, n);
    const ax = Math.abs(n[0]);
    const ay = Math.abs(n[1]);
    const az = Math.abs(n[2]);
    const [a, b] = ax >= ay && ax >= az ? [p[2], p[1]] : ay >= az ? [p[0], p[2]] : [p[0], p[1]];
    uv[i * 2] = (a + BOX) / (2 * BOX);
    uv[i * 2 + 1] = (b + BOX) / (2 * BOX);
  }
  prim.setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(uv));
}
