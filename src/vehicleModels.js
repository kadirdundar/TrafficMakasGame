import * as THREE from 'three';
import { mergeGeometries, toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Modern procedural traffic vehicles.
// Every body style is built ONCE (side-profile extrusions with rounded bevels, wheel arches,
// tumblehome greenhouse) and merged into one geometry per material. All cars of the same
// style share those geometries and almost all materials, so a car costs ~9 draw calls
// (+2 additive glow quads at night) instead of ~40 separate boxes.

// ---------------------------------------------------------------------------------------------
// Paints (hex is what multiplayer syncs; the finish is looked up from the hex on both peers)
// ---------------------------------------------------------------------------------------------
export const PAINTS = [
  { hex: 0xf1f3f5, metalness: 0.12, roughness: 0.34, weight: 3 }, // Glacier White (solid)
  { hex: 0xdfe3e8, metalness: 0.55, roughness: 0.24, weight: 3 }, // Pearl White
  { hex: 0x0c0e11, metalness: 0.7, roughness: 0.2, weight: 3 }, // Obsidian Black
  { hex: 0x2a2f37, metalness: 0.85, roughness: 0.26, weight: 3 }, // Graphite Grey
  { hex: 0x80868e, metalness: 0.08, roughness: 0.42, weight: 2 }, // Nardo Grey (solid)
  { hex: 0xb6bdc6, metalness: 0.95, roughness: 0.22, weight: 3 }, // Silver
  { hex: 0x9c0e1b, metalness: 0.7, roughness: 0.22, weight: 1.5 }, // Soul Red
  { hex: 0x16336d, metalness: 0.85, roughness: 0.24, weight: 1.2 }, // Navarra Blue
  { hex: 0x2c6bd4, metalness: 0.6, roughness: 0.25, weight: 1 }, // Electric Blue
  { hex: 0x1b3d31, metalness: 0.8, roughness: 0.28, weight: 0.8 }, // Racing Green
  { hex: 0x7c8876, metalness: 0.15, roughness: 0.4, weight: 0.7 }, // Sage Green
  { hex: 0x86705e, metalness: 0.9, roughness: 0.3, weight: 0.8 }, // Bronze
  { hex: 0xdfa023, metalness: 0.45, roughness: 0.26, weight: 0.5 }, // Sport Yellow
  { hex: 0xd2541b, metalness: 0.5, roughness: 0.26, weight: 0.5 }, // Lava Orange
];
const PAINT_FINISH = new Map(PAINTS.map((p) => [p.hex, p]));
const PAINT_WEIGHT_SUM = PAINTS.reduce((sum, p) => sum + p.weight, 0);

export function pickRandomPaint() {
  let roll = Math.random() * PAINT_WEIGHT_SUM;
  for (const p of PAINTS) {
    roll -= p.weight;
    if (roll <= 0) return p.hex;
  }
  return PAINTS[0].hex;
}

export function paintForIndex(index) {
  return PAINTS[(index * 5) % PAINTS.length].hex;
}

export function applyPaint(mat, hex) {
  const finish = PAINT_FINISH.get(hex);
  mat.color.setHex(hex);
  mat.metalness = finish ? finish.metalness : 0.6;
  mat.roughness = finish ? finish.roughness : 0.25;
}

// ---------------------------------------------------------------------------------------------
// Shared materials & textures
// ---------------------------------------------------------------------------------------------
const LIGHT_COLORS = {
  day: { head: 0xd4e2f4, tail: 0xb0081c, brake: 0xff2a40 },
  night: { head: 0xffffff, tail: 0xff1a2e, brake: 0xff5463 },
};

const PLATE_TEXTS = ['34 IST 34', '06 AB 1923', '35 KRZ 35', '16 BRS 160', '41 KCL 41', '07 AT 707'];

let SHARED = null;

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.22, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makePlateTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 252, 60);

  // Turkish EU blue strip ("TR")
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(4, 4, 30, 56);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TR', 19, 50);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 32px ui-monospace, monospace';
  const maxW = 206;
  const w = ctx.measureText(text).width;
  if (w > maxW) ctx.font = `900 ${Math.floor((32 * maxW) / w)}px ui-monospace, monospace`;
  ctx.fillText(text, 142, 44);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function shared() {
  if (SHARED) return SHARED;
  const led = (hex) => new THREE.MeshBasicMaterial({ color: hex, toneMapped: false });
  const glowTex = makeGlowTexture();
  const glow = (hex, opacity) =>
    new THREE.MeshBasicMaterial({
      color: hex,
      map: glowTex,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });

  SHARED = {
    // Dark tinted glass; also used for piano-black grilles, light housings & black roofs
    glass: new THREE.MeshStandardMaterial({
      color: 0x0b0f16,
      roughness: 0.07,
      metalness: 0.75,
      envMapIntensity: 1.3,
    }),
    // Matte black plastic trim + tyres
    trim: new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.8, metalness: 0.05 }),
    rims: [
      new THREE.MeshStandardMaterial({ color: 0xc9d0d9, roughness: 0.26, metalness: 1.0 }), // Silver
      new THREE.MeshStandardMaterial({ color: 0x3a3f47, roughness: 0.32, metalness: 0.85 }), // Graphite
      new THREE.MeshStandardMaterial({ color: 0x9a8258, roughness: 0.34, metalness: 1.0 }), // Satin Bronze
    ],
    cargo: [
      new THREE.MeshStandardMaterial({ color: 0xf1f4f7, roughness: 0.5, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0xc3c9d1, roughness: 0.35, metalness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.3 }),
    ],
    head: led(LIGHT_COLORS.day.head),
    tail: led(LIGHT_COLORS.day.tail),
    tailBrake: led(LIGHT_COLORS.day.brake),
    amber: led(0xff9a1f),
    glowFront: glow(0xe4eeff, 0.95),
    glowRear: glow(0xff2032, 0.7),
    glowBrake: glow(0xff3043, 1.0),
    plates: PLATE_TEXTS.map((t) => new THREE.MeshBasicMaterial({ map: makePlateTexture(t) })),
  };
  return SHARED;
}

// Additive halo material (shared soft-glow texture) for externally loaded models
export function createGlowMaterial(hex, opacity) {
  const mat = shared().glowFront.clone();
  mat.color.setHex(hex);
  mat.opacity = opacity;
  return mat;
}

export function setVehicleLightsNightMode(night) {
  const m = shared();
  const c = night ? LIGHT_COLORS.night : LIGHT_COLORS.day;
  m.head.color.setHex(c.head);
  m.tail.color.setHex(c.tail);
  m.tailBrake.color.setHex(c.brake);
}

// ---------------------------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------------------------
const lerp = THREE.MathUtils.lerp;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function prep(geo, keepUv) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (!keepUv && g.attributes.uv) g.deleteAttribute('uv');
  if (!g.attributes.normal) g.computeVertexNormals();
  return g;
}

function merge(list, keepUv = false) {
  if (!list.length) return null;
  const merged = mergeGeometries(list.map((g) => prep(g, keepUv)));
  merged.computeBoundingSphere();
  return merged;
}

function box(w, h, d, x, y, z, rx = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rx) g.rotateX(rx);
  g.translate(x, y, z);
  return g;
}

function rbox(w, h, d, x, y, z, radius = 0.03) {
  const r = Math.min(radius, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002);
  const g = new RoundedBoxGeometry(w, h, d, 2, r);
  g.translate(x, y, z);
  return g;
}

function cyl(radius, len, x, y, z, axis = 'x', segs = 12) {
  const g = new THREE.CylinderGeometry(radius, radius, len, segs);
  if (axis === 'x') g.rotateZ(Math.PI / 2);
  else if (axis === 'z') g.rotateX(Math.PI / 2);
  g.translate(x, y, z);
  return g;
}

function quad(w, h, x, y, z, facingFront = false) {
  const g = new THREE.PlaneGeometry(w, h);
  if (facingFront) g.rotateY(Math.PI);
  g.translate(x, y, z);
  return g;
}

// Extrude a side profile drawn in (u = longitudinal, v = height) coordinates across the car's
// width. u maps to world Z (front of the car is -Z), extrusion is centred on X.
function extrudeSide(draw, width, { bevel = 0.04, bevelSegs = 2, segs = 6 } = {}) {
  const shape = new THREE.Shape();
  draw(shape);
  const depth = Math.max(0.01, width - 2 * bevel);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    curveSegments: segs,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: bevelSegs,
  });
  g.translate(0, 0, -depth / 2);
  g.rotateY(-Math.PI / 2);
  return g;
}

// Non-uniform X scale per vertex (tumblehome, rounded nose in plan view, tucked sills...)
function deformX(geo, scaleFn) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setX(i, pos.getX(i) * scaleFn(pos.getY(i), pos.getZ(i)));
  }
  pos.needsUpdate = true;
  return geo;
}

// Smooth shading across curved panels while keeping sharp feature lines crisp
function smooth(geo, crease = 0.62) {
  if (geo.attributes.uv) geo.deleteAttribute('uv');
  geo.deleteAttribute('normal');
  return toCreasedNormals(geo, crease);
}

function polyPath(path, pts) {
  path.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) path.lineTo(pts[i][0], pts[i][1]);
  return path;
}

function arcPts(radius, a0, a1, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push([radius * Math.cos(a), radius * Math.sin(a)]);
  }
  return pts;
}

// ---------------------------------------------------------------------------------------------
// Wheels (low-profile tyres + machined alloy discs with spoke windows)
// ---------------------------------------------------------------------------------------------
const RIM_DESIGNS = {
  aero: { n: 5, inner: 0.36, outer: 0.84, fill: 0.6, skew: 0.28 },
  multi: { n: 10, inner: 0.42, outer: 0.88, fill: 0.48, skew: 0 },
  twin: { n: 6, inner: 0.34, outer: 0.86, fill: 0.68, skew: 0.12 },
};
const RIM_DESIGN_KEYS = Object.keys(RIM_DESIGNS);

const rimDiscCache = new Map();
function rimDisc(radius, designKey) {
  const key = `${radius.toFixed(3)}|${designKey}`;
  if (rimDiscCache.has(key)) return rimDiscCache.get(key);
  const d = RIM_DESIGNS[designKey];
  const outline = arcPts(radius, 0, Math.PI * 2, 24);
  outline.pop(); // no duplicated closing point
  const shape = polyPath(new THREE.Shape(), outline);
  const slot = (Math.PI * 2) / d.n;
  for (let k = 0; k < d.n; k++) {
    const a0 = k * slot + 0.3;
    const a1 = a0 + slot * d.fill;
    const outerArc = arcPts(radius * d.outer, a0 + d.skew, a1 + d.skew, 3);
    const innerArc = arcPts(radius * d.inner, a1, a0, 1);
    shape.holes.push(polyPath(new THREE.Path(), outerArc.concat(innerArc)));
  }
  // Flat machined face only (wheels are mostly seen from behind/at speed): ~100 triangles
  const g = new THREE.ShapeGeometry(shape);
  g.deleteAttribute('uv');
  rimDiscCache.set(key, g);
  return g;
}

function addWheels(parts, wheels, r, tw, designKey) {
  const rimR = r * 0.74;
  for (const [x, z] of wheels) {
    const sx = Math.sign(x);
    parts.trim.push(cyl(r, tw, x, r, z, 'x', 18));
    // Slightly rounded sidewall shoulder
    parts.trim.push(cyl(r * 0.93, tw + 0.025, x, r, z, 'x', 18));
    parts.rim.push(
      rimDisc(rimR, designKey)
        .clone()
        .rotateY((sx * Math.PI) / 2)
        .translate(x + sx * (tw / 2 + 0.016), r, z)
    );
    parts.rim.push(cyl(r * 0.11, 0.03, x + sx * (tw / 2 + 0.012), r, z, 'x', 10));
  }
}

// ---------------------------------------------------------------------------------------------
// Body style catalog (dimensions come from the gameplay spec, so hitboxes never change)
// u-values are fractions of the length, heights in metres.
// ---------------------------------------------------------------------------------------------
const STYLE_DEFS = {
  sedan: {
    axle: 0.31, r: 0.35, tw: 0.25, gc: 0.16, noseY: 0.7, beltY: 0.94, deckY: 0.95, lip: 0.035,
    aU: -0.2, rfU: -0.03, rrU: 0.16, cU: 0.33, cabinW: 0.84, tumble: 0.14, rearCurve: 0.35,
    grille: 'wide', frontBar: false, rearBar: true, exhaust: 'twin', twoTone: true,
  },
  fastback: {
    axle: 0.31, r: 0.35, tw: 0.25, gc: 0.15, noseY: 0.68, beltY: 0.93, deckY: 0.96, lip: 0.05,
    aU: -0.19, rfU: -0.02, rrU: 0.08, cU: 0.44, cabinW: 0.84, tumble: 0.15, rearCurve: 0.75,
    grille: 'closed', frontBar: true, rearBar: true, exhaust: null, twoTone: true,
  },
  coupe: {
    axle: 0.31, r: 0.34, tw: 0.27, gc: 0.13, noseY: 0.66, beltY: 0.86, deckY: 0.9, lip: 0.07,
    aU: -0.12, rfU: 0.03, rrU: 0.14, cU: 0.44, cabinW: 0.78, tumble: 0.18, rearCurve: 0.85,
    grille: 'sport', frontBar: false, rearBar: true, exhaust: 'quad', twoTone: true,
  },
  suv: {
    axle: 0.315, r: 0.38, tw: 0.27, gc: 0.22, noseY: 0.92, beltY: 1.08, deckY: 1.08, lip: 0.0,
    aU: -0.2, rfU: -0.08, rrU: 0.43, cU: 0.465, cabinW: 0.86, tumble: 0.1, rearCurve: 0.1,
    grille: 'wide', frontBar: false, rearBar: false, exhaust: 'twin', twoTone: true,
    rails: true, cladding: true, roofSpoiler: true,
  },
  crossover: {
    axle: 0.315, r: 0.37, tw: 0.26, gc: 0.2, noseY: 0.88, beltY: 1.05, deckY: 1.07, lip: 0.05,
    aU: -0.2, rfU: -0.07, rrU: 0.25, cU: 0.45, cabinW: 0.85, tumble: 0.12, rearCurve: 0.55,
    grille: 'closed', frontBar: true, rearBar: true, exhaust: null, twoTone: true, cladding: true,
  },
  van: {
    axle: 0.33, r: 0.37, tw: 0.26, gc: 0.2, noseY: 0.98, beltY: 1.12, deckY: 1.12, lip: 0.0,
    aU: -0.33, rfU: -0.2, rrU: 0.45, cU: 0.44, cabinW: 0.92, tumble: 0.05, rearCurve: 0,
    grille: 'wide', frontBar: false, rearBar: false, exhaust: null, twoTone: false, van: true,
  },
  truck: { truck: true, twoTone: false },
  // A8-style flagship saloon (online friend's car): long hood, Singleframe grille, chrome DLO,
  // OLED-style full-width rear bar. Only used by the multiplayer peer car.
  luxury: {
    axle: 0.29, r: 0.36, tw: 0.26, gc: 0.15, noseY: 0.76, beltY: 0.99, deckY: 1.0, lip: 0.03,
    aU: -0.17, rfU: -0.01, rrU: 0.19, cU: 0.345, cabinW: 0.84, tumble: 0.13, rearCurve: 0.3,
    grille: 'singleframe', frontBar: false, rearBar: true, exhaust: 'twin', twoTone: false,
    nose: 0.12, hx: 0.33, hw: 0.2, chrome: true, flare: true,
  },
};

export const LUXURY_SPEC = { type: 'luxury', length: 4.85, width: 1.94, height: 1.45 };

export const STYLE_VARIANTS = {
  sedan: ['sedan', 'fastback'],
  sport: ['coupe'],
  suv: ['suv', 'crossover'],
  van: ['van'],
  truck: ['truck'],
};

function newParts() {
  return {
    body: [], glass: [], trim: [], rim: [], cargo: [], head: [], tail: [],
    blinkL: [], blinkR: [], plate: [], glowF: [], glowR: [], flare: [],
  };
}

function buildCar(spec, S, blackRoof, rimDesign) {
  const P = newParts();
  const L = spec.length;
  const W = spec.width;
  const H = spec.height;
  const f = -L / 2;
  const b = L / 2;
  const { r, tw, gc, noseY, beltY, deckY } = S;
  const ar = r + 0.045;
  const fw = -L * S.axle;
  const rw = L * S.axle;
  const aU = S.aU * L;
  const rfU = S.rfU * L;
  const rrU = S.rrU * L;
  const cU = S.cU * L;
  const bodyW = W * 0.98;
  const gBase = beltY - 0.04;
  const glassW = W * S.cabinW;
  const topW = glassW * (1 - S.tumble);
  const roofParts = blackRoof ? P.glass : P.body;
  const nose = S.nose ?? 0.2;

  // 1. Lower body: one rounded extrusion with real wheel arches, sloped hood, trunk lip
  const lower = extrudeSide(
    (s) => {
      s.moveTo(f + 0.18, gc);
      s.lineTo(fw - ar, gc);
      s.absarc(fw, r, ar, Math.PI, 0, true);
      s.lineTo(fw + ar, gc);
      s.lineTo(rw - ar, gc);
      s.absarc(rw, r, ar, Math.PI, 0, true);
      s.lineTo(rw + ar, gc);
      s.lineTo(b - 0.16, gc);
      s.quadraticCurveTo(b, gc, b, gc + 0.16);
      if (S.van) {
        s.lineTo(b, deckY);
      } else {
        s.lineTo(b, deckY - 0.14);
        s.quadraticCurveTo(b + 0.005, deckY + 0.01, b - 0.14, deckY + S.lip);
      }
      s.lineTo(cU, beltY);
      s.lineTo(aU, beltY);
      s.quadraticCurveTo((aU + f) / 2, beltY - (beltY - noseY) * 0.25, f + nose * 1.1, noseY);
      s.quadraticCurveTo(f + 0.01, noseY - 0.02, f, noseY - nose);
      s.lineTo(f, gc + 0.14);
      s.quadraticCurveTo(f, gc, f + 0.18, gc);
    },
    bodyW,
    { bevel: 0.05 }
  );
  // Normals are taken from the untapered extrusion: the side panels are single large polygons,
  // so tapered normals would smear into dark diagonal wedges across the fenders.
  const lowerBody = smooth(lower);
  deformX(lowerBody, (y, z) => {
    const end = smoothstep(0.72, 1.0, Math.abs(z) / b);
    const plan = 1 - (z < 0 ? 0.09 : 0.06) * end;
    const shoulder = 1 - 0.05 * smoothstep(beltY - 0.16, beltY + 0.02, y);
    const tuck = 1 - 0.035 * (1 - smoothstep(gc, gc + 0.18, y));
    return plan * shoulder * tuck;
  });
  P.body.push(lowerBody);

  // 2. Greenhouse: continuous dark glass band (blacked-out pillars) with tumblehome
  const glassTaper = (base) => (y) => 1 - S.tumble * clamp01((y - base) / (H - base));
  const greenhouse = extrudeSide(
    (s) => {
      const a0 = aU - 0.03;
      const cEnd = cU + 0.03;
      s.moveTo(a0, gBase);
      s.quadraticCurveTo(lerp(a0, rfU, 0.6), lerp(gBase, H, 0.72), rfU, H - 0.015);
      s.quadraticCurveTo((rfU + rrU) / 2, H + 0.035, rrU, H - 0.015);
      const cx = lerp((rrU + cEnd) / 2, rrU + (cEnd - rrU) * 0.3, S.rearCurve);
      const cy = lerp((H + gBase) / 2, H - 0.01, S.rearCurve);
      s.quadraticCurveTo(cx, cy, cEnd, gBase);
    },
    glassW,
    { bevel: 0.035 }
  );
  P.glass.push(smooth(deformX(greenhouse, glassTaper(gBase))));

  // Floating roof panel (body colour, or gloss black on two-tone cars)
  const r0 = rfU + 0.05;
  const r1 = rrU - 0.02;
  const roofCap = extrudeSide(
    (s) => {
      s.moveTo(r0, H - 0.05);
      s.lineTo(r0, H);
      s.quadraticCurveTo((r0 + r1) / 2, H + 0.05, r1, H);
      s.lineTo(r1, H - 0.05);
    },
    topW + 0.03,
    { bevel: 0.02 }
  );
  roofParts.push(smooth(roofCap));

  if (S.van) {
    // Cargo-van upper body behind the front doors (glass only up front)
    const p0 = -0.02 * L;
    const panel = extrudeSide(
      (s) => {
        s.moveTo(p0, gBase);
        s.lineTo(b, gBase);
        s.lineTo(b, H - 0.12);
        s.quadraticCurveTo(b, H, b - 0.12, H);
        s.lineTo(p0, H);
      },
      glassW + 0.03,
      { bevel: 0.03 }
    );
    P.body.push(smooth(deformX(panel, glassTaper(gBase))));
  }

  // 3. Wheels, wheel-well liners, sills
  const wx = W / 2 - tw / 2 - 0.035;
  addWheels(
    P,
    [[-wx, fw], [wx, fw], [-wx, rw], [wx, rw]],
    r,
    tw,
    rimDesign
  );
  const linerW = 2 * (wx - tw / 2) - 0.02;
  [fw, rw].forEach((az) => {
    P.trim.push(box(linerW, ar + 0.05, ar * 1.9, 0, r - 0.05 + (ar + 0.05) / 2, az));
  });
  const sillLen = rw - fw - 2 * ar - 0.06;
  [-1, 1].forEach((sx) => {
    P.trim.push(box(0.03, 0.08, sillLen, sx * (bodyW * 0.965) / 2, gc + 0.04, 0));
  });

  if (S.cladding) {
    // Black SUV cladding: arch flares + lower door band + bumper skirts
    const flareRing = (cz) =>
      extrudeSide(
        (s) => {
          const outer = arcPts(ar + 0.07, Math.PI, 0, 10).map(([x, y]) => [cz + x, r + y]);
          const inner = arcPts(ar, 0, Math.PI, 10).map(([x, y]) => [cz + x, r + y]);
          polyPath(s, outer.concat(inner));
        },
        0.05,
        { bevel: 0.012, bevelSegs: 1 }
      );
    [-1, 1].forEach((sx) => {
      [fw, rw].forEach((cz) => {
        P.trim.push(flareRing(cz).translate(sx * (bodyW / 2 - 0.012), 0, 0));
      });
      P.trim.push(box(0.03, 0.14, sillLen + 0.02, sx * (bodyW * 0.965 / 2 + 0.006), gc + 0.12, 0));
    });
    P.trim.push(box(W * 0.9, 0.13, 0.08, 0, gc + 0.07, f + 0.05));
    P.trim.push(box(W * 0.9, 0.13, 0.08, 0, gc + 0.07, b - 0.05));
  }

  // 4. Side mirrors with LED repeaters
  const mx = glassW / 2 + 0.1;
  const my = beltY + 0.07;
  const mz = aU + 0.2;
  [-1, 1].forEach((sx) => {
    P.body.push(rbox(0.2, 0.1, 0.12, sx * mx, my, mz, 0.04));
    P.trim.push(box(0.12, 0.03, 0.05, sx * (glassW / 2 + 0.02), my - 0.03, mz + 0.02));
    (sx < 0 ? P.blinkL : P.blinkR).push(box(0.13, 0.014, 0.03, sx * (mx + 0.01), my - 0.045, mz - 0.04));
  });

  if (S.chrome) {
    // Chrome window-line (DLO) trim + flush door handles
    [-1, 1].forEach((sx) => {
      P.rim.push(box(0.012, 0.02, (cU - aU) * 0.92, sx * (glassW / 2 + 0.004), beltY + 0.012, (aU + cU) / 2));
      [-0.06 * L, 0.12 * L].forEach((hz) => {
        P.rim.push(box(0.015, 0.025, 0.16, sx * W * 0.478, beltY - 0.08, hz));
      });
    });
  }

  // 5. Roof details
  P.glass.push(rbox(0.055, 0.065, 0.17, 0, H + 0.04, rrU - 0.2, 0.025)); // shark-fin antenna
  if (S.rails) {
    [-1, 1].forEach((sx) => {
      P.trim.push(box(0.035, 0.035, (rrU - rfU) * 0.9, sx * (topW / 2 - 0.04), H + 0.035, (rfU + rrU) / 2));
    });
  }
  if (S.roofSpoiler || S.van) {
    roofParts.push(rbox(topW * 0.94, 0.04, 0.2, 0, H + 0.005, rrU + 0.04, 0.015));
  }

  // 6. FRONT (-Z): slim matrix-LED headlights, DRL signature, grille / closed EV nose
  const yH = noseY - 0.1;
  const hx = W * (S.hx ?? 0.3);
  const hw = W * (S.hw ?? 0.2);
  [-1, 1].forEach((sx) => {
    P.glass.push(box(hw + 0.04, 0.12, 0.06, sx * hx, yH - 0.03, f + 0.04));
    P.head.push(box(hw, 0.036, 0.07, sx * hx, yH, f + 0.02));
    P.head.push(box(0.03, 0.08, 0.07, sx * (hx + hw / 2 - 0.015), yH - 0.05, f + 0.025));
    (sx < 0 ? P.blinkL : P.blinkR).push(box(0.1, 0.028, 0.065, sx * (hx - hw / 2 + 0.06), yH - 0.065, f + 0.028));
    P.glowF.push(quad(1.1, 0.55, sx * hx, yH - 0.02, f - 0.07, true));
    if (S.flare) P.flare.push(quad(2.4, 1.3, sx * hx, yH - 0.02, f - 0.1, true));
    if (S.chrome) P.head.push(box(hw * 0.8, 0.014, 0.07, sx * hx, yH - 0.035, f + 0.022)); // matrix row
  });
  if (S.frontBar) {
    P.head.push(box(2 * hx - hw, 0.016, 0.07, 0, yH + 0.004, f + 0.025));
  }

  const faceBot = gc + 0.12;
  const faceTop = noseY - 0.14;
  const grilleY = lerp(faceBot, faceTop, 0.45);
  const grilleH = (faceTop - faceBot) * 0.55;
  if (S.grille === 'wide') {
    P.glass.push(rbox(W * 0.52, grilleH, 0.06, 0, grilleY, f + 0.01, 0.025));
    P.rim.push(box(W * 0.54, 0.012, 0.02, 0, grilleY + grilleH / 2 + 0.008, f - 0.012));
  } else if (S.grille === 'sport') {
    P.glass.push(rbox(W * 0.4, grilleH * 0.8, 0.06, 0, grilleY - 0.02, f + 0.01, 0.025));
    [-1, 1].forEach((sx) => {
      P.glass.push(rbox(W * 0.18, grilleH * 0.9, 0.06, sx * W * 0.34, grilleY - 0.03, f + 0.012, 0.025));
    });
  } else if (S.grille === 'singleframe') {
    // Octagonal Singleframe grille: piano-black mesh, chrome surround, vertical chrome slats
    const gTop = noseY - 0.08;
    const gBot = gc + 0.1;
    const gh = gTop - gBot;
    const outline = [
      [-0.21, 1], [0.21, 1], [0.28, 0.85], [0.31, 0.42], [0.26, 0.08],
      [0.21, 0], [-0.21, 0], [-0.26, 0.08], [-0.31, 0.42], [-0.28, 0.85],
    ];
    const grillePanel = (scale, depth, frontZ) => {
      const cy = gBot + gh / 2;
      const pts = outline.map(([x, t]) => [x * W * scale, cy + (gBot + t * gh - cy) * scale]);
      const g = new THREE.ExtrudeGeometry(polyPath(new THREE.Shape(), pts), {
        depth,
        steps: 1,
        bevelEnabled: false,
      });
      g.translate(0, 0, frontZ);
      return g;
    };
    P.glass.push(grillePanel(1, 0.08, f - 0.02));
    P.rim.push(grillePanel(1.07, 0.08, f - 0.012));
    for (let k = -4; k <= 4; k++) {
      P.rim.push(box(0.012, gh * 0.76, 0.012, k * W * 0.055, gBot + gh * 0.5, f - 0.026));
    }
    [-1, 1].forEach((sx) => {
      P.glass.push(rbox(W * 0.16, 0.1, 0.06, sx * W * 0.4, gc + 0.17, f + 0.012, 0.02));
    });
    P.rim.push(box(W * 0.62, 0.012, 0.02, 0, gc + 0.075, f + 0.02));
  } else {
    P.glass.push(rbox(W * 0.6, 0.09, 0.06, 0, faceBot + 0.04, f + 0.012, 0.02));
  }
  if (!S.cladding) {
    P.trim.push(box(W * 0.84, 0.05, 0.1, 0, gc + 0.03, f + 0.06)); // front splitter
  }
  const frontPlateY =
    S.grille === 'closed'
      ? faceBot + 0.14
      : S.grille === 'singleframe'
        ? gc + 0.1 + (noseY - 0.18 - gc) * 0.35
        : grilleY;
  P.plate.push(quad(0.52, 0.12, 0, frontPlateY, f - 0.036, true));

  // 7. REAR (+Z): full-width light bar, L-shaped LED clusters, smoked panel, diffuser
  if (S.van) {
    [-1, 1].forEach((sx) => {
      const lx = sx * W * 0.45;
      P.glass.push(box(0.1, 0.5, 0.04, lx, 0.95, b - 0.005));
      P.tail.push(box(0.07, 0.4, 0.05, lx, 1.0, b + 0.004));
      (sx < 0 ? P.blinkL : P.blinkR).push(box(0.07, 0.07, 0.05, lx, 0.74, b + 0.006));
      P.glass.push(box(W * 0.36, 0.42, 0.02, sx * W * 0.2, 1.62, b + 0.003));
      P.glowR.push(quad(0.6, 0.8, lx, 0.95, b + 0.06));
    });
    P.trim.push(box(0.02, 1.05, 0.012, 0, 1.28, b + 0.004));
    P.tail.push(box(0.36, 0.03, 0.03, 0, H - 0.06, b + 0.004));
    P.trim.push(box(W * 0.94, 0.14, 0.1, 0, gc + 0.06, b - 0.03));
    P.plate.push(quad(0.52, 0.12, 0, 0.55, b + 0.008));
    P.trim.push(box(0.56, 0.15, 0.01, 0, 0.55, b + 0.002));
  } else {
    const yT = deckY - 0.12;
    const tx = W * 0.33;
    const tw2 = W * 0.22;
    if (S.rearBar) {
      P.glass.push(box(W * 0.86, 0.085, 0.05, 0, yT, b - 0.008)); // smoked band behind the bar
      P.tail.push(box(2 * tx - tw2 + 0.02, 0.02, 0.05, 0, yT + 0.008, b + 0.003));
    }
    [-1, 1].forEach((sx) => {
      if (!S.rearBar) P.glass.push(box(tw2 + 0.05, 0.11, 0.05, sx * tx, yT - 0.01, b - 0.008));
      P.tail.push(box(tw2, 0.045, 0.05, sx * tx, yT + 0.008, b + 0.004));
      P.tail.push(box(0.035, 0.1, 0.05, sx * (tx + tw2 / 2 - 0.0175), yT - 0.03, b + 0.002));
      (sx < 0 ? P.blinkL : P.blinkR).push(box(0.1, 0.026, 0.05, sx * (tx - tw2 / 2 + 0.06), yT - 0.028, b + 0.006));
      P.glowR.push(quad(0.85, 0.46, sx * tx, yT, b + 0.06));
    });
    // Third brake light on top of the rear glass
    P.tail.push(box(topW * 0.32, 0.022, 0.035, 0, H - 0.025, rrU + 0.012));

    const plateY = lerp(gc + 0.16, deckY - 0.14, 0.35);
    P.plate.push(quad(0.52, 0.12, 0, plateY, b + 0.008));
    P.trim.push(box(0.56, 0.15, 0.01, 0, plateY, b + 0.002));
    P.trim.push(box(W * 0.8, 0.1, 0.12, 0, gc + 0.06, b - 0.04)); // diffuser

    if (S.chrome) P.rim.push(box(W * 0.66, 0.014, 0.02, 0, yT - 0.07, b + 0.006));

    if (S.exhaust === 'twin') {
      [-1, 1].forEach((sx) => P.rim.push(box(0.17, 0.05, 0.04, sx * W * 0.3, gc + 0.07, b + 0.01)));
    } else if (S.exhaust === 'quad') {
      [-0.36, -0.27, 0.27, 0.36].forEach((k) => P.rim.push(cyl(0.042, 0.08, k * W, gc + 0.07, b, 'z', 12)));
    }
  }

  return P;
}

function buildTruck(spec, rimDesign) {
  const P = newParts();
  const L = spec.length;
  const W = spec.width;
  const H = spec.height;
  const f = -L / 2;
  const b = L / 2;
  const r = 0.5;
  const tw = 0.32;
  const gc = 0.5;
  const ar = r + 0.06;
  const fw = f + 1.0;
  const cabRear = f + 2.1;
  const cabW = W * 0.96;
  const roofTaper = (y) => 1 - 0.05 * smoothstep(2.3, 2.66, y);

  // Modern cab-over tractor cab
  const cab = extrudeSide(
    (s) => {
      s.moveTo(f + 0.12, gc);
      s.lineTo(fw - ar, gc);
      s.absarc(fw, r, ar, Math.PI, 0, true);
      s.lineTo(cabRear, gc);
      s.lineTo(cabRear, 2.66);
      s.lineTo(f + 0.36, 2.66);
      s.quadraticCurveTo(f + 0.14, 2.65, f + 0.12, 2.42);
      s.lineTo(f + 0.02, 1.15);
      s.quadraticCurveTo(f, 1.0, f, 0.85);
      s.lineTo(f, gc + 0.12);
      s.quadraticCurveTo(f, gc, f + 0.12, gc);
    },
    cabW,
    { bevel: 0.07 }
  );
  P.body.push(smooth(deformX(cab, roofTaper)));

  // Wrap-around windscreen + side windows
  const glass = extrudeSide(
    (s) => {
      s.moveTo(f + 0.045, 1.6);
      s.lineTo(f + 0.105, 2.38);
      s.lineTo(cabRear - 0.62, 2.38);
      s.lineTo(cabRear - 0.62, 1.6);
    },
    cabW + 0.014,
    { bevel: 0 }
  );
  P.glass.push(deformX(glass, roofTaper));

  // Roof wind deflector up to the box height
  const deflector = extrudeSide(
    (s) => {
      s.moveTo(cabRear - 1.3, 2.6);
      s.quadraticCurveTo(cabRear - 0.45, 2.64, cabRear - 0.02, H - 0.03);
      s.lineTo(cabRear + 0.1, H - 0.03);
      s.lineTo(cabRear + 0.1, 2.6);
    },
    W * 0.9,
    { bevel: 0.04 }
  );
  P.body.push(smooth(deflector));

  // Cargo box with body-colour livery stripes
  const boxStart = cabRear + 0.15;
  const boxLen = b - boxStart;
  const boxZ = (b + boxStart) / 2;
  P.cargo.push(rbox(W, H - 1.1, boxLen, 0, (H + 1.1) / 2, boxZ, 0.06));
  P.body.push(box(W + 0.012, 0.2, boxLen - 0.3, 0, 1.38, boxZ));
  P.body.push(box(W + 0.012, 0.05, boxLen - 0.3, 0, 1.56, boxZ));

  // Chassis, side guards, aluminium tank
  P.trim.push(box(W * 0.72, 0.26, L - 0.9, 0, 0.78, 0.2));
  [-1, 1].forEach((sx) => P.trim.push(box(0.04, 0.16, 4.2, sx * (W / 2 - 0.08), 0.72, -0.48)));
  P.rim.push(cyl(0.28, 1.0, -(W / 2 - 0.38), 0.8, -1.6, 'z', 16));

  // Wheels: steering axle + tandem rear axle
  const wx = W / 2 - tw / 2 - 0.04;
  const rearA = b - 1.95;
  const rearB = b - 0.9;
  addWheels(
    P,
    [[-wx, fw], [wx, fw], [-wx, rearA], [wx, rearA], [-wx, rearB], [wx, rearB]],
    r,
    tw,
    rimDesign
  );

  // Front: grille with chrome slats, LED headlights, bumper, mirrors
  P.glass.push(rbox(W * 0.62, 0.42, 0.05, 0, 1.3, f + 0.01, 0.03));
  [1.17, 1.3, 1.43].forEach((y) => P.rim.push(box(W * 0.6, 0.025, 0.02, 0, y, f - 0.02)));
  P.trim.push(box(W * 0.97, 0.22, 0.12, 0, 0.62, f + 0.04));
  [-1, 1].forEach((sx) => {
    P.glass.push(box(0.42, 0.16, 0.05, sx * 0.8, 0.86, f + 0.01));
    P.head.push(box(0.36, 0.035, 0.05, sx * 0.8, 0.9, f - 0.005));
    P.head.push(box(0.03, 0.09, 0.05, sx * 0.995, 0.85, f - 0.004));
    (sx < 0 ? P.blinkL : P.blinkR).push(box(0.1, 0.05, 0.05, sx * 1.07, 0.82, f - 0.002));
    P.glowF.push(quad(1.3, 0.65, sx * 0.8, 0.88, f - 0.08, true));
    P.trim.push(box(0.25, 0.03, 0.03, sx * (cabW / 2 + 0.1), 2.05, f + 0.35));
    P.trim.push(rbox(0.07, 0.42, 0.2, sx * (cabW / 2 + 0.22), 1.95, f + 0.35, 0.025));
  });
  P.plate.push(quad(0.52, 0.12, 0, 0.62, f - 0.028, true));

  // Rear: doors, lock bars, light bracket, underrun bar, marker lamps
  P.trim.push(box(0.025, H - 1.25, 0.012, 0, (H + 1.1) / 2, b + 0.005));
  [-0.85, -0.3, 0.3, 0.85].forEach((x) => P.rim.push(box(0.03, H - 1.4, 0.03, x, (H + 1.1) / 2, b + 0.015)));
  P.trim.push(box(W * 0.92, 0.18, 0.06, 0, 0.92, b - 0.04));
  P.trim.push(box(W * 0.92, 0.12, 0.1, 0, 0.55, b - 0.05));
  [-1, 1].forEach((sx) => {
    P.tail.push(box(0.3, 0.07, 0.04, sx * 0.8, 0.94, b));
    (sx < 0 ? P.blinkL : P.blinkR).push(box(0.12, 0.07, 0.04, sx * 1.04, 0.94, b));
    P.tail.push(box(0.18, 0.035, 0.03, sx * (W / 2 - 0.15), H - 0.07, b + 0.01));
    P.glowR.push(quad(0.9, 0.45, sx * 0.8, 0.94, b + 0.06));
  });
  P.plate.push(quad(0.52, 0.12, 0, 0.72, b + 0.005));

  return P;
}

// Merged geometry per (style, roof, rim design) – shared by every car using that combination
const geometryCache = new Map();
function getStyleGeometry(spec, style, blackRoof, rimDesign) {
  const key = `${spec.type}|${style}|${blackRoof ? 1 : 0}|${rimDesign}`;
  if (geometryCache.has(key)) return geometryCache.get(key);
  const S = STYLE_DEFS[style];
  const P = S.truck ? buildTruck(spec, rimDesign) : buildCar(spec, S, blackRoof, rimDesign);
  const out = {};
  for (const k of Object.keys(P)) {
    out[k] = merge(P[k], k === 'plate' || k === 'glowF' || k === 'glowR' || k === 'flare');
  }
  geometryCache.set(key, out);
  return out;
}

// ---------------------------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------------------------
export function createTrafficVehicle(spec, index, variant, paintHex) {
  const m = shared();
  const styles = STYLE_VARIANTS[spec.type] || ['sedan'];
  const style = styles[variant % styles.length];
  const S = STYLE_DEFS[style];
  const blackRoof = Boolean(S.twoTone) && index % 3 === 1;
  const rimDesign = S.truck ? 'multi' : RIM_DESIGN_KEYS[(index + variant) % RIM_DESIGN_KEYS.length];
  const geo = getStyleGeometry(spec, style, blackRoof, rimDesign);

  // Per-car clear-coated paint (colour is synced in multiplayer)
  const bodyMat = new THREE.MeshPhysicalMaterial({
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.15,
  });
  applyPaint(bodyMat, paintHex);

  const group = new THREE.Group();
  const add = (g, mat) => {
    if (!g) return null;
    const mesh = new THREE.Mesh(g, mat);
    group.add(mesh);
    return mesh;
  };

  add(geo.body, bodyMat);
  add(geo.glass, m.glass);
  add(geo.trim, m.trim);
  add(geo.rim, S.truck ? m.rims[0] : m.rims[(index * 7 + variant) % m.rims.length]);
  add(geo.cargo, m.cargo[index % m.cargo.length]);
  add(geo.head, m.head);
  add(geo.plate, m.plates[index % m.plates.length]);
  const tailMesh = add(geo.tail, m.tail);
  const leftBlinker = add(geo.blinkL, m.amber);
  const rightBlinker = add(geo.blinkR, m.amber);
  const frontGlow = add(geo.glowF, m.glowFront);
  const rearGlow = add(geo.glowR, m.glowRear);
  leftBlinker.visible = false;
  rightBlinker.visible = false;
  frontGlow.visible = false;
  rearGlow.visible = false;
  frontGlow.renderOrder = 2;
  rearGlow.renderOrder = 2;

  let braking = false;
  return {
    group,
    style,
    bodyMat,
    leftBlinker,
    rightBlinker,
    setBraking(isBraking) {
      if (isBraking === braking) return;
      braking = isBraking;
      tailMesh.material = isBraking ? m.tailBrake : m.tail;
      rearGlow.material = isBraking ? m.glowBrake : m.glowRear;
    },
    setNight(night) {
      frontGlow.visible = night;
      rearGlow.visible = night;
    },
  };
}

// ---------------------------------------------------------------------------------------------
// Online friend's car: A8-style flagship saloon with its own light materials
// (braking / high-beam / night are driven by the peer's synced state)
// ---------------------------------------------------------------------------------------------
export function createLuxurySedan({ paintHex = 0x0e6f9c, metalness = 0.82, roughness = 0.2 } = {}) {
  const m = shared();
  const geo = getStyleGeometry(LUXURY_SPEC, 'luxury', false, 'multi');

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: paintHex,
    metalness,
    roughness,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.2,
  });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe6ebf1, roughness: 0.12, metalness: 1.0 });
  const headMat = m.head.clone();
  const tailMat = m.tail.clone();
  const glowFrontMat = m.glowFront.clone();
  const glowRearMat = m.glowRear.clone();
  const flareMat = m.glowFront.clone();
  flareMat.color.setHex(0x9cc4ff);

  const group = new THREE.Group();
  const add = (g, mat) => {
    const mesh = new THREE.Mesh(g, mat);
    group.add(mesh);
    return mesh;
  };
  add(geo.body, bodyMat);
  add(geo.glass, m.glass);
  add(geo.trim, m.trim);
  add(geo.rim, chromeMat);
  add(geo.head, headMat);
  add(geo.tail, tailMat);
  add(geo.plate, m.plates[0]);
  // Blinker state is not part of the peer packet, so the amber repeaters are not drawn
  const frontGlow = add(geo.glowF, glowFrontMat);
  const rearGlow = add(geo.glowR, glowRearMat);
  const flare = add(geo.flare, flareMat);
  [frontGlow, rearGlow, flare].forEach((mesh) => {
    mesh.visible = false;
    mesh.renderOrder = 2;
  });

  let lastKey = '';
  return {
    group,
    bodyMat,
    setLights({ night = false, braking = false, highBeam = false }) {
      const key = `${night ? 1 : 0}${braking ? 1 : 0}${highBeam ? 1 : 0}`;
      if (key === lastKey) return;
      lastKey = key;
      const c = night ? LIGHT_COLORS.night : LIGHT_COLORS.day;
      headMat.color.setHex(highBeam ? 0xcfe2ff : c.head);
      tailMat.color.setHex(braking ? c.brake : c.tail);
      glowRearMat.opacity = braking ? 1.0 : 0.7;
      frontGlow.visible = night || highBeam;
      rearGlow.visible = night || braking;
      flare.visible = highBeam;
    },
  };
}
