// Builds the light traffic copies of the car models: public/models/<car>.glb (the garage model,
// ~60,000 triangles and a dozen materials) → public/models/traffic/<id>.glb (~10,000 triangles
// in six parts). The traffic draws a car in the same few draw calls as a procedural one, so the
// model is regrouped by what the game does with each surface rather than by its materials:
//
//   body   the paint (the traffic gives every car its own colour)
//   glass  windows, drawn as dark tinted glass
//   trim   everything matte: plastics, tyres, arches, cabin shell (colours kept per vertex)
//   rim    everything metal: rims, chrome, mirror glass (colours kept per vertex)
//   head   headlamps      tail   tail lamps   (lit by the game, day / night / braking)
//
// Lens covers, badges and the model's own number plates are left out, and so is everything that
// cannot be seen from outside now that the windows are dark (cabin shell, engine bay): that is
// often half of the model. Wheel positions, lamp and plate anchors are measured here and stored
// in the scene's extras for src/trafficModels.js.
//
//   npm run car:traffic              all cars in CARS below
//   npm run car:traffic -- corolla   one car
//
// Check the result on /tools/model-preview/traffic.html?car=<id>
import fs from 'node:fs';
import path from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt, prune, reorder } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

// Triangles each part may keep, and the largest simplification error (m) allowed to get there
const BUDGET = { body: 4000, trim: 3600, rim: 3000, glass: 700, head: 400, tail: 400 };
const MAX_ERROR = { body: 0.02, glass: 0.02, trim: 0.05, rim: 0.03, head: 0.02, tail: 0.02 };
// The same parts once more for cars far away (`<part>_far`, ~2,500 triangles in all): the traffic
// swaps to them past FAR_DETAIL_M (src/vehicleModels.js), where this error is under a pixel
const FAR_BUDGET = { body: 900, trim: 650, rim: 450, glass: 220, head: 90, tail: 90 };
const FAR_ERROR = { body: 0.06, glass: 0.06, trim: 0.09, rim: 0.07, head: 0.05, tail: 0.05 };

// Which part a material goes to, by its name; the first match wins. Names are the ones
// tools/convert-car.mjs standardises (src/cars/<id>/convert.mjs → renameMaterials).
const DEFAULT_RULES = [
  [/^paint$/, 'body'],
  [/^headLight/i, 'head'],
  [/^tailLight/i, 'tail'],
  [/lens|klosz|badge|logo|^plate$|reverse|interior/i, 'drop'],
  [/mirror|miror/i, 'rim'],
  [/glass|window/i, 'glass'],
  [/chrome|^rim$|wheel|silver|^trim$/i, 'rim'],
  [/signal|indicator|blinker/i, 'trim', [0.75, 0.3, 0.02]],
  [/tire|tyre/i, 'trim', [0.02, 0.02, 0.022]],
];
// A textured material's colour is in its texture: such surfaces are painted this instead
const TEXTURED_TRIM = [0.035, 0.035, 0.04];
const TEXTURED_METAL = [0.6, 0.61, 0.63];

// `length` and `plate` as in src/cars/<id>/car.js → exterior; `rules` come before DEFAULT_RULES
// ([pattern, part, colour?]); `tyres` / `wheels` name the materials the wheels are located from.
const CARS = {
  corolla: {
    source: 'public/models/corolla.glb',
    length: 4.62,
    plate: { material: 'Material.010' },
    // The clear headlamp cover is what lights up; the reflector bowls behind it are chrome
    rules: [[/^tailLens$/, 'tail'], [/^headLens$/, 'head'], [/^headLight$/, 'rim'], [/^Material\.01[04]$/, 'drop']],
  },
  'passat-b8': { source: 'public/models/passat-b8.glb', length: 4.77, plate: { front: 0.42, rear: 0.72 } },
  'passat-b5': {
    source: 'public/models/passat-b5.glb',
    length: 4.7,
    plate: { front: 0.5, rear: 0.78 },
    rules: [[/^chassis\.2$/, 'trim', [0.03, 0.03, 0.035]]],
  },
  focus: { source: 'public/models/focus.glb', length: 4.48, plate: { front: 0.37, rear: 0.815 } },
  'c-class': {
    source: 'public/models/c-class.glb',
    length: 4.79,
    plate: { front: 0.36, rear: 0.52 },
    rules: [[/^trimGloss$/, 'trim', [0.012, 0.012, 0.014]]],
  },
  'porsche-911': {
    source: 'public/models/porsche-911.glb',
    length: 4.52,
    plate: { front: 0.38, rear: 0.58 },
    wheels: [/^rim$/],
    rules: [[/^caliper$/, 'trim', [0.1, 0.1, 0.11]], [/^tire$/, 'drop']],
  },
  'amg-gt': {
    source: 'public/models/amg-gt.glb',
    length: 4.54,
    plate: { material: 'plate' },
    tyres: [/^tire_mat4$/],
    rules: [
      [/^tailLens$/, 'tail'],
      [/^tire_mat4$/, 'trim', [0.02, 0.02, 0.022]],
      [/^brakes/, 'trim', [0.12, 0.12, 0.13]],
      [/^(carbon|tex4)$/, 'trim', [0.03, 0.03, 0.035]],
      [/^black_shiny$/, 'trim', [0.012, 0.012, 0.014]],
    ],
  },
};

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const ids = only.length ? only : Object.keys(CARS);
for (const id of ids) if (!CARS[id]) throw new Error(`Bilinmeyen araç: ${id} (${Object.keys(CARS).join(', ')})`);

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

const matches = (patterns, name) => patterns.some((p) => (p instanceof RegExp ? p.test(name) : p === name));

function applyMatrix(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

// Every triangle of the model in world space: { material, tris: [[x,y,z, nx,ny,nz] × 3] }
function readTriangles(doc) {
  const groups = [];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();
    // Normals turn with the matrix's rotation; the models carry no shear, and a uniform scale
    // drops out when they are normalised again
    const rot = [m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, 0, 0, 0, 1];
    for (const prim of mesh.listPrimitives()) {
      if (prim.getMode() !== 4) continue;
      const pos = prim.getAttribute('POSITION');
      const nrm = prim.getAttribute('NORMAL');
      const idx = prim.getIndices();
      const count = idx ? idx.getCount() : pos.getCount();
      const verts = [];
      const el = [];
      for (let i = 0; i < pos.getCount(); i++) {
        const p = applyMatrix(m, ...pos.getElement(i, el));
        let n = nrm ? applyMatrix(rot, ...nrm.getElement(i, el)) : [0, 1, 0];
        const len = Math.hypot(...n) || 1;
        n = n.map((v) => v / len);
        verts.push([...p, ...n]);
      }
      const tris = [];
      for (let i = 0; i < count; i += 3) {
        const a = idx ? idx.getScalar(i) : i;
        const b = idx ? idx.getScalar(i + 1) : i + 1;
        const c = idx ? idx.getScalar(i + 2) : i + 2;
        tris.push([verts[a].slice(), verts[b].slice(), verts[c].slice()]); // own copies: they are moved in place later
      }
      groups.push({ material: prim.getMaterial(), tris });
    }
  }
  return groups;
}

// Welds a triangle soup (vertices of [x,y,z, nx,ny,nz, r,g,b]) into an indexed mesh
function weldTriangles(tris) {
  const map = new Map();
  const verts = [];
  const indices = [];
  for (const tri of tris) {
    for (const v of tri) {
      const key = `${Math.round(v[0] * 2000)},${Math.round(v[1] * 2000)},${Math.round(v[2] * 2000)},${Math.round(v[3] * 8)},${Math.round(v[4] * 8)},${Math.round(v[5] * 8)},${Math.round(v[6] * 64)},${Math.round(v[7] * 64)},${Math.round(v[8] * 64)}`;
      let i = map.get(key);
      if (i === undefined) {
        i = verts.length;
        verts.push(v);
        map.set(key, i);
      }
      indices.push(i);
    }
  }
  return { verts, indices: new Uint32Array(indices) };
}

// Triangles that can be seen from somewhere outside the car: a ray from one of four points on
// the triangle reaches the open air in at least one of ~48 directions (from straight above down
// to just under the horizon, so the sills and wheel arches count but the floor's top side does
// not). `occluders` are all triangles that will be drawn.
function visibleTriangles(parts) {
  const occluders = [];
  for (const tris of Object.values(parts)) for (const tri of tris) for (const v of tri) occluders.push(v[0], v[1], v[2]);
  const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(occluders, 3));
  const bvh = new MeshBVH(geometry);
  const dirs = [];
  const N = 64;
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    if (y < -0.2) continue;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996323;
    dirs.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
  }
  const ray = new THREE.Ray();
  const seen = (tri) => {
    const c = [0, 1, 2].map((k) => (tri[0][k] + tri[1][k] + tri[2][k]) / 3);
    const points = [c, ...tri.map((v) => [0, 1, 2].map((k) => c[k] + (v[k] - c[k]) * 0.8))];
    for (const dir of dirs) {
      for (const p of points) {
        ray.origin.set(p[0], p[1], p[2]).addScaledVector(dir, 0.004);
        ray.direction.copy(dir);
        if (!bvh.raycastFirst(ray, THREE.DoubleSide)) return true;
      }
    }
    return false;
  };
  let hidden = 0;
  for (const [name, tris] of Object.entries(parts)) {
    // Lamps sit deep in their housings and are seen through a narrow opening: all are kept
    if (name === 'head' || name === 'tail') continue;
    const kept = tris.filter(seen);
    hidden += tris.length - kept.length;
    parts[name] = kept;
  }
  return hidden;
}

// Simplifies to at most `target` triangles (or as close as `maxError` allows) and drops the
// vertices no triangle uses any more
function simplifyMesh({ verts, indices }, target, maxError) {
  const pos = new Float32Array(verts.length * 3);
  const attrs = new Float32Array(verts.length * 6);
  verts.forEach((v, i) => {
    pos.set(v.slice(0, 3), i * 3);
    attrs.set(v.slice(3, 9), i * 6);
  });
  let out = indices;
  if (indices.length / 3 > target) {
    const flags = ['ErrorAbsolute', 'Permissive', 'Prune'];
    const weights = [0.25, 0.25, 0.25, 1, 1, 1]; // normals steer the collapses, colours hold their edges
    const run = (err) => MeshoptSimplifier.simplifyWithAttributes(indices, pos, 3, attrs, 6, weights, null, 0, err, flags)[0];
    let lo = 0.0001;
    let hi = maxError;
    if (run(hi).length / 3 <= target) {
      for (let i = 0; i < 10; i++) {
        const mid = Math.sqrt(lo * hi);
        if (run(mid).length / 3 > target) lo = mid;
        else hi = mid;
      }
    }
    out = run(hi);
  }
  const remap = new Map();
  const kept = [];
  const newIdx = new Uint32Array(out.length);
  out.forEach((old, i) => {
    let n = remap.get(old);
    if (n === undefined) {
      n = kept.length;
      kept.push(verts[old]);
      remap.set(old, n);
    }
    newIdx[i] = n;
  });
  return { verts: kept, indices: newIdx };
}

// One wheel per corner, from the bounding box of the given triangles in that quadrant
function locateWheels(tris) {
  const boxes = new Map();
  for (const tri of tris) {
    for (const [x, y, z] of tri) {
      const key = `${Math.sign(x)}${Math.sign(z)}`;
      const b = boxes.get(key) || { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
      [x, y, z].forEach((v, k) => {
        b.min[k] = Math.min(b.min[k], v);
        b.max[k] = Math.max(b.max[k], v);
      });
      boxes.set(key, b);
    }
  }
  return [...boxes.values()].map((b) => ({
    x0: +(b.min[0] - 0.02).toFixed(3),
    x1: +(b.max[0] + 0.02).toFixed(3),
    y: +((b.min[1] + b.max[1]) / 2).toFixed(3),
    z: +((b.min[2] + b.max[2]) / 2).toFixed(3),
    r: +((b.max[1] - b.min[1]) / 2).toFixed(3),
  }));
}

// Lamps of one side (x > 0): centre of the cluster and its outer end, where the blinker sits.
// `sign` is -1 for the front (the lamps' foremost z) and +1 for the rear.
function lampAnchors(tris, sign) {
  const pts = tris.flat().filter((v) => v[0] > 0.05);
  if (!pts.length) return null;
  const xs = pts.map((v) => v[0]);
  const ys = pts.map((v) => v[1]);
  const maxX = Math.max(...xs);
  const centre = [(Math.min(...xs) + maxX) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  const edge = (list) => (sign < 0 ? Math.min(...list.map((v) => v[2])) : Math.max(...list.map((v) => v[2])));
  const outer = pts.filter((v) => v[0] > maxX - 0.16);
  const outerY = outer.reduce((s, v) => s + v[1], 0) / outer.length;
  const round = (list) => list.map((v) => +v.toFixed(3));
  return { centre: round([...centre, edge(pts)]), outer: round([maxX - 0.08, outerY, edge(outer)]) };
}

async function convert(id) {
  const cfg = CARS[id];
  const doc = await io.read(cfg.source);
  const groups = readTriangles(doc);

  // Same normalisation as src/cars/loadExterior.js: scaled to the real length along Z, wheels on
  // the ground, centred
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const g of groups)
    for (const tri of g.tris)
      for (const v of tri)
        for (let k = 0; k < 3; k++) {
          min[k] = Math.min(min[k], v[k]);
          max[k] = Math.max(max[k], v[k]);
        }
  const s = cfg.length / (max[2] - min[2]);
  const offset = [-(min[0] + max[0]) / 2, -min[1], -(min[2] + max[2]) / 2];
  for (const g of groups)
    for (const tri of g.tris)
      for (const v of tri) for (let k = 0; k < 3; k++) v[k] = (v[k] + offset[k]) * s;

  const rules = [...(cfg.rules || []), ...DEFAULT_RULES];
  const parts = { body: [], glass: [], trim: [], rim: [], head: [], tail: [] };
  const all = [];
  const tyreTris = [];
  const wheelTris = [];
  const plateTris = [];
  const report = [];
  for (const { material, tris } of groups) {
    const name = material?.getName() || '';
    if (cfg.plate.material === name) plateTris.push(...tris);
    if (matches(cfg.tyres || [/tire|tyre/i], name)) tyreTris.push(...tris);
    if (matches(cfg.wheels || [/^rim$|wheel/i], name)) wheelTris.push(...tris);
    const rule = rules.find(([p]) => matches([p], name));
    let part = rule ? rule[1] : 'trim';
    // Clear covers over lamps and anything else see-through that is not a window
    if (!rule && material?.getAlphaMode() === 'BLEND') part = 'drop';
    report.push(`${name || '(adsız)'}→${part}`);
    if (part === 'drop') continue;
    const textured = Boolean(material?.getBaseColorTexture());
    const base = material ? material.getBaseColorFactor().slice(0, 3) : [0.5, 0.5, 0.5];
    const colour = rule?.[2] || (textured ? (part === 'rim' ? TEXTURED_METAL : TEXTURED_TRIM) : base);
    for (const tri of tris) {
      parts[part].push(tri.map((v) => [...v, ...colour]));
      all.push(tri);
    }
  }
  if (!parts.head.length || !parts.tail.length) throw new Error(`${id}: far ya da stop malzemesi bulunamadı (rules)`);

  // Clear lamp covers that share the windows' material would be drawn as dark glass over the
  // lamps: glass within a hand's width of a lamp is left out (windows are further away; the
  // third brake light, which sits on the rear window, does not count)
  const lampPoints = [...parts.head, ...parts.tail].flat().filter((v) => v[1] < 1.05);
  const nearLamp = (c) => lampPoints.some((v) => Math.hypot(v[0] - c[0], v[1] - c[1], v[2] - c[2]) < 0.11);
  const beforeCovers = parts.glass.length;
  parts.glass = parts.glass.filter((tri) => !nearLamp([0, 1, 2].map((k) => (tri[0][k] + tri[1][k] + tri[2][k]) / 3)));
  if (beforeCovers !== parts.glass.length) report.push(`(far camı: ${beforeCovers - parts.glass.length} üçgen atıldı)`);
  const drawn = Object.values(parts).reduce((n, tris) => n + tris.length, 0);
  const hidden = visibleTriangles(parts);

  const wheels = locateWheels(tyreTris.length > 100 ? tyreTris : wheelTris);
  if (wheels.length !== 4) throw new Error(`${id}: ${wheels.length} tekerlek bulundu (tyres / wheels)`);

  // Plates: where the model's own plates are, or on the bumper at the given heights
  const bumperZ = (y, sign) => {
    const zs = all.flat().filter((v) => Math.abs(v[0]) < 0.24 && Math.abs(v[1] - y) < 0.07).map((v) => v[2]);
    return sign < 0 ? Math.min(...zs) : Math.max(...zs);
  };
  const plateAt = (sign) => {
    if (cfg.plate.material) {
      const pts = plateTris.flat().filter((v) => Math.sign(v[2]) === sign);
      if (!pts.length) throw new Error(`${id}: ${cfg.plate.material} plakası bulunamadı`);
      const y = (Math.min(...pts.map((v) => v[1])) + Math.max(...pts.map((v) => v[1]))) / 2;
      const zs = pts.map((v) => v[2]);
      return [+y.toFixed(3), +(sign < 0 ? Math.min(...zs) : Math.max(...zs)).toFixed(3)];
    }
    const y = sign < 0 ? cfg.plate.front : cfg.plate.rear;
    return [y, +bumperZ(y, sign).toFixed(3)];
  };

  const info = {
    id,
    length: cfg.length,
    width: +((max[0] - min[0]) * s).toFixed(3),
    height: +((max[1] - min[1]) * s).toFixed(3),
    wheels,
    head: lampAnchors(parts.head, -1),
    tail: lampAnchors(parts.tail, 1),
    plateFront: plateAt(-1),
    plateRear: plateAt(1),
  };

  const out = new Document();
  const buffer = out.createBuffer();
  const scene = out.createScene(id);
  const material = out.createMaterial('traffic');
  let total = 0;
  const counts = [];
  let totalFar = 0;
  const addPart = (name, colours, mesh) => {
    const n = mesh.verts.length;
    const pos = new Float32Array(n * 3);
    const nrm = new Float32Array(n * 3);
    const col = new Uint8Array(n * 4);
    mesh.verts.forEach((v, i) => {
      pos.set(v.slice(0, 3), i * 3);
      const len = Math.hypot(v[3], v[4], v[5]) || 1;
      nrm.set([v[3] / len, v[4] / len, v[5] / len], i * 3);
      col.set([v[6] * 255, v[7] * 255, v[8] * 255, 255], i * 4);
    });
    const prim = out
      .createPrimitive()
      .setMaterial(material)
      .setIndices(out.createAccessor().setType('SCALAR').setArray(mesh.indices).setBuffer(buffer))
      .setAttribute('POSITION', out.createAccessor().setType('VEC3').setArray(pos).setBuffer(buffer))
      .setAttribute('NORMAL', out.createAccessor().setType('VEC3').setArray(nrm).setBuffer(buffer));
    if (colours) {
      prim.setAttribute('COLOR_0', out.createAccessor().setType('VEC4').setNormalized(true).setArray(col).setBuffer(buffer));
    }
    scene.addChild(out.createNode(name).setMesh(out.createMesh(name).addPrimitive(prim)));
  };
  for (const [name, tris] of Object.entries(parts)) {
    if (!tris.length) continue;
    const welded = weldTriangles(tris);
    const colours = name === 'trim' || name === 'rim';
    const mesh = simplifyMesh(welded, BUDGET[name], MAX_ERROR[name]);
    const far = simplifyMesh(welded, FAR_BUDGET[name], FAR_ERROR[name]);
    total += mesh.indices.length / 3;
    totalFar += far.indices.length / 3;
    counts.push(`${name} ${tris.length}→${mesh.indices.length / 3}/${far.indices.length / 3}`);
    addPart(name, colours, mesh);
    addPart(`${name}_far`, colours, far);
  }
  scene.setExtras(info);

  await out.transform(prune(), reorder({ encoder: MeshoptEncoder }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  const file = `public/models/traffic/${id}.glb`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const bin = await io.writeBinary(out);
  fs.writeFileSync(file, Buffer.from(bin));
  console.log(`${id}: ${file} (${(bin.byteLength / 1024).toFixed(0)} KB, ${total} üçgen, uzakta ${totalFar}; ${hidden} / ${drawn} üçgen dışarıdan görünmüyordu)`);
  console.log(`  ${counts.join(', ')}`);
  console.log(`  ${report.join('  ')}`);
}

for (const id of ids) await convert(id);
