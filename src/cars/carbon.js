import * as THREE from 'three';

// Carbon fibre bonnet and mirror caps for any car's exterior model (garage, online friends,
// drone replay). The models have no separate parts for them, so they are found on the model the
// first time carbon is fitted:
// - bonnet: the upward-facing paint ahead of the windscreen. Where the bonnet is a panel of its
//   own (a separate piece of the mesh) the whole panel goes carbon; where it is one piece with
//   the body shell only that top surface does.
// - mirror caps: small pieces standing out at the car's sides, at the height and place of the
//   door mirrors (any material but glass).
// car.js → exterior.carbon overrides the search: { hood: { rearZ, halfWidth, minY, materials }
// | false, mirrors: false } (model metres; `materials`: a bonnet that is a material of its own,
// carbon whole; false: the car has no such part to dress).
// The triangles found are moved into geometry groups of their own, so fitting or removing
// carbon only swaps the material of a group. Catalogue: src/progression/config.js → HOODS.

const TILE_M = 0.07; // one repeat of the weave
const WELD = 2000; // vertices closer than 0.5 mm are the same point when finding pieces
// Never carbon: glass, lamps, the mirror's own reflecting glass and chrome trim
const isGlass = (name) => /glass|window|lens|lamp|light|head|tail|mirr|miror|chrome/i.test(name);

let weave = null;
const carbonMats = new Map(); // vertexColors → material

// 2×2 twill: the tows cross over two and under two, which gives the diagonal stripe
function weaveTexture() {
  if (weave) return weave;
  const N = 8;
  const C = 16;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = N * C;
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const across = (i + j) % 4 < 2;
      const x = i * C;
      const y = j * C;
      const g = across ? ctx.createLinearGradient(x, y, x, y + C) : ctx.createLinearGradient(x, y, x + C, y);
      g.addColorStop(0, '#16181c');
      g.addColorStop(0.5, across ? '#3b3f47' : '#2a2d33');
      g.addColorStop(1, '#16181c');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, C, C);
    }
  }
  weave = new THREE.CanvasTexture(canvas);
  weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
  weave.colorSpace = THREE.SRGBColorSpace;
  weave.anisotropy = 4;
  return weave;
}

function carbonMaterial(vertexColors) {
  if (!carbonMats.has(vertexColors)) {
    carbonMats.set(
      vertexColors,
      new THREE.MeshPhysicalMaterial({
        map: weaveTexture(),
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0.42,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 0.55,
        vertexColors,
        side: THREE.DoubleSide,
      })
    );
  }
  return carbonMats.get(vertexColors);
}

// Pieces of a mesh: triangles joined by shared (welded) corners. Returns per triangle its piece.
function pieces(pos, index, triCount) {
  const ids = new Map();
  const vid = new Int32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const k = `${Math.round(pos.getX(i) * WELD)},${Math.round(pos.getY(i) * WELD)},${Math.round(pos.getZ(i) * WELD)}`;
    if (!ids.has(k)) ids.set(k, ids.size);
    vid[i] = ids.get(k);
  }
  const parent = new Int32Array(ids.size).map((_, i) => i);
  const find = (a) => {
    while (parent[a] !== a) a = parent[a] = parent[parent[a]];
    return a;
  };
  const corner = (t, c) => vid[index ? index.getX(t * 3 + c) : t * 3 + c];
  for (let t = 0; t < triCount; t++) {
    const a = find(corner(t, 0));
    parent[find(corner(t, 1))] = a;
    parent[find(corner(t, 2))] = a;
  }
  const piece = new Int32Array(triCount);
  for (let t = 0; t < triCount; t++) piece[t] = find(corner(t, 0));
  return piece;
}

export function createCarbonParts(group, model, bodyMat, dims, cfg) {
  let parts = null; // [{ mesh, own }] meshes split into [own, hood, mirrors] groups
  const state = { hood: false, mirrors: false };

  // Front edge of the windscreen at the centre: the bonnet ends there
  function windscreenBase(toGroup) {
    const v = new THREE.Vector3();
    let base = null;
    model.traverse((o) => {
      if (!o.isMesh || !/glass|window/i.test(o.material?.name || '')) return;
      const m = new THREE.Matrix4().multiplyMatrices(toGroup, o.matrixWorld);
      const pos = o.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m);
        if (Math.abs(v.x) < 0.3 && v.z < 0 && v.y > dims.height * 0.45 && (!base || v.z < base.z)) base = v.clone();
      }
    });
    return base;
  }

  function prepare() {
    parts = [];
    group.updateWorldMatrix(true, true);
    const toGroup = new THREE.Matrix4().copy(group.matrixWorld).invert();
    const base = windscreenBase(toGroup);
    const hoodCfg = cfg?.hood;
    const rearZ = hoodCfg?.rearZ ?? (base ? base.z + 0.03 : -dims.halfLength * 0.3);
    const minY = hoodCfg?.minY ?? (base ? base.y - 0.32 : dims.height * 0.45);
    const halfWidth = hoodCfg?.halfWidth ?? dims.halfWidth * 0.8;
    const findHood = hoodCfg !== false;
    const findMirrors = cfg?.mirrors !== false;

    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const n = new THREE.Vector3();
    const e = new THREE.Vector3();
    const meshes = [];
    model.traverse((o) => o.isMesh && !Array.isArray(o.material) && meshes.push(o));
    for (const mesh of meshes) {
      const isPaint = mesh.material === bodyMat;
      if (hoodCfg?.materials?.includes(mesh.material?.name)) {
        const triCount = (mesh.geometry.index ? mesh.geometry.index.count : mesh.geometry.attributes.position.count) / 3;
        split(mesh, new Uint8Array(triCount).fill(1), new THREE.Matrix4().multiplyMatrices(toGroup, mesh.matrixWorld));
        parts.push({ mesh, own: mesh.material });
        mesh.material = [mesh.material, mesh.material, mesh.material];
        continue;
      }
      if (!isPaint && (!findMirrors || isGlass(mesh.material?.name || ''))) continue;
      const geo = mesh.geometry;
      const pos = geo.attributes.position;
      const index = geo.index;
      const triCount = (index ? index.count : pos.count) / 3;
      const m = new THREE.Matrix4().multiplyMatrices(toGroup, mesh.matrixWorld);
      const piece = pieces(pos, index, triCount);

      // Per piece: its box, and how much of its area is bonnet surface
      const info = new Map();
      const role = new Uint8Array(triCount); // 0 own, 1 bonnet, 2 mirror cap
      const vert = (t, k) => (index ? index.getX(t * 3 + k) : t * 3 + k);
      for (let t = 0; t < triCount; t++) {
        a.fromBufferAttribute(pos, vert(t, 0)).applyMatrix4(m);
        b.fromBufferAttribute(pos, vert(t, 1)).applyMatrix4(m);
        c.fromBufferAttribute(pos, vert(t, 2)).applyMatrix4(m);
        n.subVectors(b, a).cross(e.subVectors(c, a));
        const area = n.length() / 2;
        let p = info.get(piece[t]);
        if (!p) info.set(piece[t], (p = { box: new THREE.Box3(), area: 0, hoodArea: 0 }));
        p.box.expandByPoint(a).expandByPoint(b).expandByPoint(c);
        p.area += area;
        if (!isPaint || !findHood || area === 0) continue;
        const cx = (a.x + b.x + c.x) / 3;
        const cy = (a.y + b.y + c.y) / 3;
        const cz = (a.z + b.z + c.z) / 3;
        if (n.y / (2 * area) > 0.45 && cz < rearZ && cy > minY && Math.abs(cx) < halfWidth) {
          role[t] = 1;
          p.hoodArea += area;
        }
      }

      // A bonnet panel of its own goes carbon whole; the body shell (a piece as long as the
      // car) only where its surface is the bonnet; other panels not at all
      const size = new THREE.Vector3();
      const centre = new THREE.Vector3();
      for (const p of info.values()) {
        p.box.getSize(size);
        p.box.getCenter(centre);
        p.shell = size.z > dims.halfLength * 1.1;
        p.hood = !p.shell && p.hoodArea > p.area * 0.5;
        p.mirror =
          findMirrors &&
          size.x > 0.1 && size.y > 0.05 && size.z > 0.06 &&
          Math.max(size.x, size.y, size.z) < 0.36 &&
          Math.abs(centre.x) > dims.halfWidth - 0.28 &&
          centre.y > dims.height * 0.5 && centre.y < dims.height * 0.85 &&
          centre.z > -dims.halfLength * 0.6 && centre.z < dims.halfLength * 0.1;
      }
      let any = false;
      for (let t = 0; t < triCount; t++) {
        const p = info.get(piece[t]);
        if (p.mirror) role[t] = 2;
        else if (role[t] === 1 && !p.shell && !p.hood) role[t] = 0;
        else if (p.hood) role[t] = 1;
        if (role[t]) any = true;
      }
      if (!any) continue;
      split(mesh, role, m);
      parts.push({ mesh, own: mesh.material });
      mesh.material = [mesh.material, mesh.material, mesh.material];
    }
  }

  // Reorders the triangles into [own, bonnet, mirror caps] groups and gives the carbon ones a
  // flat weave mapping: bonnet seen from above, caps from their facing side
  function split(mesh, role, m) {
    const geo = mesh.geometry;
    const pos = geo.attributes.position;
    const old = geo.index ? Array.from(geo.index.array) : Array.from({ length: pos.count }, (_, i) => i);
    const order = [[], [], []];
    for (let t = 0; t < role.length; t++) order[role[t]].push(old[t * 3], old[t * 3 + 1], old[t * 3 + 2]);
    geo.setIndex([...order[0], ...order[1], ...order[2]]);
    geo.clearGroups();
    geo.addGroup(0, order[0].length, 0);
    geo.addGroup(order[0].length, order[1].length, 1);
    geo.addGroup(order[0].length + order[1].length, order[2].length, 2);

    // A fresh float copy: the model's own UVs may be quantized (normalized integers), which
    // cannot hold the weave's coordinates
    const own = geo.attributes.uv;
    const uv = new THREE.Float32BufferAttribute(new Float32Array(pos.count * 2), 2);
    if (own) for (let i = 0; i < pos.count; i++) uv.setXY(i, own.getX(i), own.getY(i));
    geo.setAttribute('uv', uv);
    const normal = geo.attributes.normal;
    const nm = new THREE.Matrix3().getNormalMatrix(m);
    const v = new THREE.Vector3();
    const nv = new THREE.Vector3();
    for (const r of [1, 2]) {
      for (const i of order[r]) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m);
        if (r === 1 || !normal) {
          uv.setXY(i, v.x / TILE_M, v.z / TILE_M);
          continue;
        }
        nv.fromBufferAttribute(normal, i).applyMatrix3(nm);
        const ax = Math.abs(nv.x);
        const ay = Math.abs(nv.y);
        const az = Math.abs(nv.z);
        if (ax >= ay && ax >= az) uv.setXY(i, v.z / TILE_M, v.y / TILE_M);
        else if (ay >= az) uv.setXY(i, v.x / TILE_M, v.z / TILE_M);
        else uv.setXY(i, v.x / TILE_M, v.y / TILE_M);
      }
    }
  }

  function apply() {
    for (const { mesh, own } of parts) {
      const carbon = carbonMaterial(Boolean(mesh.geometry.attributes.color) && own.vertexColors);
      mesh.material[1] = state.hood ? carbon : own;
      mesh.material[2] = state.mirrors ? carbon : own;
    }
  }

  return {
    set({ hood = false, mirrors = false } = {}) {
      if (hood === state.hood && mirrors === state.mirrors) return;
      state.hood = hood;
      state.mirrors = mirrors;
      if (!parts) prepare();
      apply();
    },
  };
}
