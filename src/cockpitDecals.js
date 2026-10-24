import * as THREE from 'three';

// Sharp redraws of small atlas areas. Game-ripped interiors squeeze buttons, handles and badges
// into a few dozen texels, so they read as grey smudges from the driver's seat. A patch moves
// the triangles mapped to one UV box onto their own high-resolution canvas (same layout as the
// atlas, so the original UVs only need rescaling) and paints crisp artwork over it.

const ATLAS_SIZE = 1024;
const MAX_CANVAS = 2048;

// patch: { meshes: [names], material?: name, uv: [u0, u1, v0, v1] (selection box, by triangle
//          centroid; u is taken modulo 1), scale: canvas px per atlas texel,
//          background?: false | css filter, surface?: {roughness, metalness},
//          flipV?: true when the model maps this area upside down,
//          project?: {axis, up} to ignore the source UVs and map the selection planarly onto a
//          disc facing `axis` (for badges whose atlas mapping is scrambled), paint(ctx, w, h, at) }
export function applyAtlasPatch(root, patch) {
  const [su0, su1, sv0, sv1] = patch.uv;
  const picks = [];
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry.index || !o.geometry.attributes.uv) return;
    if (patch.material && o.material.name !== patch.material) return;
    let named = false;
    for (let p = o; p && !named; p = p.parent) named = patch.meshes.includes(p.name);
    if (named) picks.push(o);
  });

  // Select triangles and find the UV box they really cover
  const box = [Infinity, -Infinity, Infinity, -Infinity];
  const selections = picks.map((mesh) => {
    const { index, attributes } = mesh.geometry;
    const uv = attributes.uv;
    const tris = [];
    for (let t = 0; t < index.count; t += 3) {
      let cu = 0;
      let cv = 0;
      for (let k = 0; k < 3; k++) {
        cu += uv.getX(index.getX(t + k)) / 3;
        cv += uv.getY(index.getX(t + k)) / 3;
      }
      const shift = Math.floor(cu);
      if (cu - shift < su0 || cu - shift > su1 || cv < sv0 || cv > sv1) continue;
      tris.push(t, shift);
      for (let k = 0; k < 3; k++) {
        const i = index.getX(t + k);
        box[0] = Math.min(box[0], uv.getX(i) - shift);
        box[1] = Math.max(box[1], uv.getX(i) - shift);
        box[2] = Math.min(box[2], uv.getY(i));
        box[3] = Math.max(box[3], uv.getY(i));
      }
    }
    return { mesh, tris };
  });
  if (!selections.some((s) => s.tris.length)) return null;

  const [u0, u1, v0, v1] = box;
  const W = Math.min(MAX_CANVAS, Math.round((u1 - u0) * ATLAS_SIZE * patch.scale));
  const H = Math.min(MAX_CANVAS, Math.round((v1 - v0) * ATLAS_SIZE * patch.scale));
  const planar = patch.project && planarMapper(selections, patch.project);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const atlas = picks[0].material.map?.image;
  if (patch.background !== false && atlas) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (patch.background) ctx.filter = patch.background;
    const iw = atlas.width;
    const ih = atlas.height;
    ctx.drawImage(atlas, u0 * iw, v0 * ih, (u1 - u0) * iw, (v1 - v0) * ih, 0, 0, W, H);
    ctx.filter = 'none';
  }
  const at = (u, v) => [((u - u0) / (u1 - u0)) * W, ((v - v0) / (v1 - v0)) * H];
  ctx.save();
  if (patch.flipV) ctx.setTransform(1, 0, 0, -1, 0, H);
  patch.paint(ctx, W, H, at);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false; // glTF UV convention: v grows downwards in the image
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

  const created = [];
  for (const { mesh, tris } of selections) {
    if (!tris.length) continue;
    const geo = mesh.geometry;
    const { index } = geo;
    const pos = geo.attributes.position;
    const nrm = geo.attributes.normal;
    const uv = geo.attributes.uv;
    const n = tris.length / 2;
    const P = new Float32Array(n * 9);
    const N = new Float32Array(n * 9);
    const T = new Float32Array(n * 6);
    const taken = new Set();
    for (let s = 0; s < tris.length; s += 2) {
      const [t, shift] = [tris[s], tris[s + 1]];
      taken.add(t);
      for (let k = 0; k < 3; k++) {
        const i = index.getX(t + k);
        const o = (s / 2) * 3 + k;
        P.set([pos.getX(i), pos.getY(i), pos.getZ(i)], o * 3);
        if (nrm) N.set([nrm.getX(i), nrm.getY(i), nrm.getZ(i)], o * 3);
        T.set(
          planar ? planar(pos.getX(i), pos.getY(i), pos.getZ(i)) : [(uv.getX(i) - shift - u0) / (u1 - u0), (uv.getY(i) - v0) / (v1 - v0)],
          o * 2
        );
      }
    }
    const keep = [];
    for (let t = 0; t < index.count; t += 3) {
      if (!taken.has(t)) keep.push(index.getX(t), index.getX(t + 1), index.getX(t + 2));
    }
    geo.setIndex(keep);

    const patchGeo = new THREE.BufferGeometry();
    patchGeo.setAttribute('position', new THREE.BufferAttribute(P, 3));
    patchGeo.setAttribute('normal', new THREE.BufferAttribute(N, 3));
    patchGeo.setAttribute('uv', new THREE.BufferAttribute(T, 2));
    if (!nrm) patchGeo.computeVertexNormals();
    const mat = mesh.material.clone();
    mat.name = `${mesh.material.name}#patch`;
    mat.map = texture;
    mat.color.set(0xffffff);
    Object.assign(mat, patch.surface || {});
    const patchMesh = new THREE.Mesh(patchGeo, mat);
    patchMesh.name = `${mesh.name}#patch`;
    mesh.add(patchMesh); // child with identity transform: follows the wheel when it turns
    created.push(patchMesh);
  }
  return created;
}

// Maps positions onto the unit square of a disc facing `axis` (seen from the axis side), with
// `up` pointing to the top of the image.
function planarMapper(selections, { axis, up = [0, 1, 0] }) {
  const A = new THREE.Vector3().fromArray(axis).normalize();
  const U = new THREE.Vector3().fromArray(up);
  U.addScaledVector(A, -U.dot(A)).normalize();
  const R = new THREE.Vector3().crossVectors(U, A);
  const p = new THREE.Vector3();
  let [minX, maxX, minY, maxY] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const { mesh, tris } of selections) {
    const { index } = mesh.geometry;
    const pos = mesh.geometry.attributes.position;
    for (let s = 0; s < tris.length; s += 2) {
      for (let k = 0; k < 3; k++) {
        p.fromBufferAttribute(pos, index.getX(tris[s] + k));
        minX = Math.min(minX, p.dot(R));
        maxX = Math.max(maxX, p.dot(R));
        minY = Math.min(minY, p.dot(U));
        maxY = Math.max(maxY, p.dot(U));
      }
    }
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const r = Math.max(maxX - minX, maxY - minY) / 2;
  return (x, y, z) => {
    p.set(x, y, z);
    return [0.5 + (p.dot(R) - cx) / (2 * r), 0.5 - (p.dot(U) - cy) / (2 * r)];
  };
}

// Gives one connected piece of a mesh (the piece holding the triangle closest to `point`, in
// the mesh's own coordinates) its own material, e.g. a satin door opener lever.
export function applyPieceMaterial(root, meshName, point, material, maxTris = 400) {
  const mesh = root.getObjectByName(meshName);
  if (!mesh?.geometry.index) return null;
  const geo = mesh.geometry;
  const pos = geo.attributes.position;
  const index = geo.index;
  const N = pos.count;
  const parent = new Int32Array(N).map((_, i) => i);
  const find = (a) => {
    while (parent[a] !== a) a = parent[a] = parent[parent[a]];
    return a;
  };
  const key = new Map();
  for (let i = 0; i < N; i++) {
    const k = `${Math.round(pos.getX(i) * 4000)},${Math.round(pos.getY(i) * 4000)},${Math.round(pos.getZ(i) * 4000)}`;
    if (key.has(k)) parent[find(i)] = find(key.get(k));
    else key.set(k, i);
  }
  for (let t = 0; t < index.count; t += 3) {
    parent[find(index.getX(t + 1))] = find(index.getX(t));
    parent[find(index.getX(t + 2))] = find(index.getX(t));
  }
  const p = new THREE.Vector3().fromArray(point);
  const c = new THREE.Vector3();
  let best = -1;
  let bestD = Infinity;
  for (let t = 0; t < index.count; t += 3) {
    c.set(0, 0, 0);
    for (let k = 0; k < 3; k++) {
      const i = index.getX(t + k);
      c.x += pos.getX(i) / 3;
      c.y += pos.getY(i) / 3;
      c.z += pos.getZ(i) / 3;
    }
    const d = c.distanceToSquared(p);
    if (d < bestD) [best, bestD] = [t, d];
  }
  const root0 = find(index.getX(best));
  const piece = [];
  const keep = [];
  for (let t = 0; t < index.count; t += 3) {
    (find(index.getX(t)) === root0 ? piece : keep).push(index.getX(t), index.getX(t + 1), index.getX(t + 2));
  }
  if (piece.length / 3 > maxTris) return null;
  geo.setIndex(keep);
  const pieceGeo = new THREE.BufferGeometry();
  for (const [name, attr] of Object.entries(geo.attributes)) pieceGeo.setAttribute(name, attr);
  pieceGeo.setIndex(piece);
  const pieceMesh = new THREE.Mesh(pieceGeo, material);
  pieceMesh.name = `${meshName}#piece`;
  mesh.add(pieceMesh);
  return pieceMesh;
}
