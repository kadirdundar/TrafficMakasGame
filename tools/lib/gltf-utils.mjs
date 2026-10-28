// Shared glTF-Transform helpers for the car conversion tools (tools/convert-car.mjs).
import * as THREE from 'three';
import sharp from 'sharp';

// Re-encodes every texture as WebP, optionally downscaling to `maxSize` (longest side).
// `sizes` ([pattern, px]) gives the textures of matching materials their own limit, e.g. small
// tiling grain maps; a texture shared with an unmatched material keeps the larger limit.
export async function compressTextures(doc, { quality = 90, maxSize = null, sizes = [] } = {}) {
  const textures = doc.getRoot().listTextures();
  console.log(`  ${textures.length} doku WebP'ye çevriliyor (kalite ${quality}${maxSize ? `, en fazla ${maxSize}px` : ''})`);
  for (const tex of textures) {
    const img = tex.getImage();
    if (!img) continue;
    const limits = tex
      .listParents()
      .filter((p) => p.propertyType === 'Material')
      .map((m) => sizes.find(([pattern]) => pattern.test(m.getName() || ''))?.[1] ?? maxSize);
    const size = limits.length && !limits.includes(null) ? Math.max(...limits) : maxSize;
    try {
      let pipeline = sharp(img);
      if (size) pipeline = pipeline.resize(size, size, { fit: 'inside', withoutEnlargement: true });
      tex.setImage(await pipeline.webp({ quality, effort: 4 }).toBuffer());
      tex.setMimeType('image/webp');
    } catch (err) {
      console.warn('  Doku sıkıştırılamadı:', err.message);
    }
  }
}

// Flat quad primitive; corners: [bl, br, tr, tl]
export function createQuadMesh(doc, name, mat, corners) {
  const positions = new Float32Array(corners.flat());
  const [v0, v1, v2] = corners.slice(0, 3).map((c) => new THREE.Vector3(...c));
  const n = new THREE.Vector3().crossVectors(v1.sub(v0), v2.sub(v0)).normalize();
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(positions))
    .setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array([...n.toArray(), ...n.toArray(), ...n.toArray(), ...n.toArray()])))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint16Array([0, 1, 2, 0, 2, 3])));
  if (mat) prim.setMaterial(mat);
  return doc.createMesh(name).addPrimitive(prim);
}

// Moves the triangles of `prim` for which keep(a, b, c) returns true into a new primitive
// (same material, only the used vertices). The source primitive keeps the rest.
export function splitTriangles(doc, prim, keep) {
  const idxAcc = prim.getIndices();
  const idx = idxAcc.getArray();
  const stay = [];
  const moved = [];
  for (let t = 0; t < idx.length; t += 3) {
    (keep(idx[t], idx[t + 1], idx[t + 2]) ? moved : stay).push(idx[t], idx[t + 1], idx[t + 2]);
  }
  if (!moved.length) return null;
  idxAcc.setArray(new Uint32Array(stay));

  const remap = new Map();
  for (const i of moved) if (!remap.has(i)) remap.set(i, remap.size);
  const out = doc.createPrimitive().setMaterial(prim.getMaterial());
  for (const semantic of prim.listSemantics()) {
    const src = prim.getAttribute(semantic);
    const size = src.getElementSize();
    const arr = new Float32Array(remap.size * size);
    const el = [];
    for (const [oldI, newI] of remap) {
      src.getElement(oldI, el);
      for (let k = 0; k < size; k++) arr[newI * size + k] = el[k];
    }
    out.setAttribute(semantic, doc.createAccessor().setType(src.getType()).setArray(arr));
  }
  out.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(moved.map((i) => remap.get(i)))));
  return out;
}

// Connected pieces of a triangle list: vertices closer than 1/precision m are welded first.
// positionOf(i) -> [x, y, z]. Returns find(i) -> piece id.
export function connectedPieces(count, positionOf, idx, precision) {
  const parent = new Int32Array(count).map((_, i) => i);
  const find = (a) => {
    while (parent[a] !== a) a = parent[a] = parent[parent[a]];
    return a;
  };
  const union = (a, b) => {
    a = find(a);
    b = find(b);
    if (a !== b) parent[a] = b;
  };
  const key = new Map();
  for (let i = 0; i < count; i++) {
    const k = positionOf(i).map((c) => Math.round(c * precision)).join(',');
    if (key.has(k)) union(i, key.get(k));
    else key.set(k, i);
  }
  for (let t = 0; t < idx.length; t += 3) {
    union(idx[t], idx[t + 1]);
    union(idx[t], idx[t + 2]);
  }
  return find;
}

// Returns (u, v) => [r, g, b] for a texture, sampling with repeat wrapping.
export async function textureSampler(tex) {
  const { data, info } = await sharp(Buffer.from(tex.getImage())).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return (u, v) => {
    const x = Math.min(info.width - 1, Math.floor((u - Math.floor(u)) * info.width));
    const y = Math.min(info.height - 1, Math.floor((v - Math.floor(v)) * info.height));
    const i = (y * info.width + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };
}

// Name matcher: RegExp, exact string, or a list of them
export function matches(pattern, name) {
  if (Array.isArray(pattern)) return pattern.some((p) => matches(p, name));
  return pattern instanceof RegExp ? pattern.test(name) : pattern === name;
}
