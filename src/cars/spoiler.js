import * as THREE from 'three';

// Bolt-on rear spoilers for any car's exterior model (garage, online friends, drone replay).
// The parts are built in code, so every car, also one added later, gets them without new
// model files: the mount is measured on the model itself the first time a spoiler is fitted.
// Types, prices and their effect on the car live in src/progression/config.js → SPOILERS.

const STEP = 0.03; // m between the height samples that look for the boot lid's trailing edge
const SCAN_DEPTH = 1.1; // m forward from the rear bumper that is searched at the centre
const SIDE_STEP = 0.08; // m between the measured points of the edge across the car
// Blade centre ahead of the lid's edge: the wing stands on the lid. A steep lid (911) is short
// before it meets the roof, so the wing moves back towards the edge there.
const wingOffset = (pitch) => -0.3 + 0.4 * Math.abs(pitch);

// Mounts measured per model file: the showroom, friends and the replay share one measurement
const mountCache = new Map();

let carbonMat = null;
function carbon() {
  carbonMat ??= new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.42, metalness: 0.35 });
  return carbonMat;
}

// Profile in the car's side view (u = backwards, v = up) extruded across the car
function extrudeProfile(points, width) {
  const shape = new THREE.Shape(points.map(([u, v]) => new THREE.Vector2(u, v)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
  geo.rotateY(-Math.PI / 2); // profile u → +Z (backwards), extrusion → -X
  geo.translate(width / 2, 0, 0);
  return geo;
}

// Lip and ducktail lie on the lid: tilted with its slope, and bent to its trailing edge, which
// curves forward and drops towards the corners on most cars. They taper off towards the ends
// like moulded parts do, instead of ending in a flat cut.
function fitToLid(geo, m) {
  const pos = geo.attributes.position;
  const half = m.width / 2;
  for (let i = 0; i < pos.count; i++) {
    const taper = 1 - 0.85 * THREE.MathUtils.smoothstep(Math.abs(pos.getX(i)) / half, 0.6, 1);
    pos.setY(i, pos.getY(i) * taper);
    if (pos.getZ(i) > 0) pos.setZ(i, pos.getZ(i) * taper); // nor overhangs the lid there
  }
  geo.rotateX(m.pitch);
  for (let i = 0; i < pos.count; i++) {
    const edge = m.edgeAt(pos.getX(i));
    pos.setY(i, pos.getY(i) + edge.h - m.y);
    pos.setZ(i, pos.getZ(i) + edge.z - m.z);
  }
  geo.computeVertexNormals();
  return geo;
}

const BUILDERS = {
  // Thin lip on the lid's trailing edge
  lip(m, paint) {
    const geo = extrudeProfile([[-0.1, -0.012], [0.02, -0.012], [0.03, 0.035], [-0.1, 0.004]], m.width);
    return [new THREE.Mesh(fitToLid(geo, m), paint)];
  },
  // Kicked-up ducktail, 911 style
  ducktail(m, paint) {
    const geo = extrudeProfile(
      [[-0.22, -0.012], [0.025, -0.012], [0.06, 0.085], [0.03, 0.09], [-0.22, 0.004]],
      m.width
    );
    return [new THREE.Mesh(fitToLid(geo, m), paint)];
  },
  // Level GT wing on two stands that stand on the lid, with endplates
  wing(m) {
    const span = m.wing.span;
    const bladeY = m.wing.base + THREE.MathUtils.clamp(m.carHeight * 0.17, 0.2, 0.26);
    const blade = extrudeProfile(
      [[-0.17, 0.0], [-0.14, 0.022], [0.0, 0.034], [0.13, 0.018], [0.15, 0.002], [0.0, -0.006]],
      span
    );
    blade.rotateX(0.1); // nose down: the wing pushes the tail onto the road
    blade.translate(0, bladeY, m.wing.z);

    const parts = [blade];
    for (const side of [-1, 1]) {
      const plate = new THREE.BoxGeometry(0.012, 0.11, 0.36);
      plate.translate(side * (span / 2 + 0.006), bladeY + 0.01, m.wing.z);
      parts.push(plate);

      // Stand from the lid surface (sunk in a little) up into the blade
      const bottom = m.wing.base - 0.02;
      const standH = bladeY + 0.01 - bottom;
      const stand = new THREE.BoxGeometry(0.018, standH, 0.12);
      stand.translate(side * m.wing.standX, bottom + standH / 2, m.wing.z - 0.01);
      parts.push(stand);
    }
    return parts.map((g) => new THREE.Mesh(g, carbon()));
  },
};

export const SPOILER_TYPES = Object.keys(BUILDERS);

// Fits spoilers onto one loaded exterior. `dims` are the normalised model's half length/width
// and height, `override` comes from car.js → exterior.spoiler ({ z, y, width } in model metres)
// for a model whose lid the measurement does not find. `cacheKey` (the model's url) shares the
// measurement between every copy of the same model.
export function createSpoilerMount(group, model, dims, override, paintMat, cacheKey) {
  let fitted = null;
  let fittedId = 'none';
  let field = null;

  // Height field of the back of the car in the group's own space: the upward-facing triangles
  // of the big panels (badges, lamps and other small parts would read as the lid), bucketed on
  // a grid over x/z so a height lookup only tests the few triangles under that point
  const CELL = 0.05;
  function buildField() {
    const toGroup = new THREE.Matrix4().copy(group.matrixWorld).invert();
    const minZ = dims.halfLength - SCAN_DEPTH - 0.6;
    const tris = [];
    const cells = new Map();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const n = new THREE.Vector3();
    const e = new THREE.Vector3();
    const box = new THREE.Box3();
    const size = new THREE.Vector3();
    model.traverse((o) => {
      if (!o.isMesh || !o.geometry?.attributes.position) return;
      const m = new THREE.Matrix4().multiplyMatrices(toGroup, o.matrixWorld);
      o.geometry.computeBoundingBox();
      box.copy(o.geometry.boundingBox).applyMatrix4(m).getSize(size);
      if (Math.max(size.x, size.y, size.z) < 0.45) return;
      const pos = o.geometry.attributes.position;
      const index = o.geometry.index;
      const count = index ? index.count : pos.count;
      for (let i = 0; i < count; i += 3) {
        a.fromBufferAttribute(pos, index ? index.getX(i) : i).applyMatrix4(m);
        b.fromBufferAttribute(pos, index ? index.getX(i + 1) : i + 1).applyMatrix4(m);
        c.fromBufferAttribute(pos, index ? index.getX(i + 2) : i + 2).applyMatrix4(m);
        if (Math.max(a.z, b.z, c.z) < minZ) continue;
        n.subVectors(b, a).cross(e.subVectors(c, a));
        if (Math.abs(n.y) < 0.05 * n.length()) continue; // vertical faces hold no height
        const t = tris.length;
        tris.push([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]);
        const x0 = Math.floor(Math.min(a.x, b.x, c.x) / CELL);
        const x1 = Math.floor(Math.max(a.x, b.x, c.x) / CELL);
        const z0 = Math.floor(Math.min(a.z, b.z, c.z) / CELL);
        const z1 = Math.floor(Math.max(a.z, b.z, c.z) / CELL);
        for (let ix = x0; ix <= x1; ix++) {
          for (let iz = z0; iz <= z1; iz++) {
            const key = ix * 100000 + iz;
            if (!cells.has(key)) cells.set(key, []);
            cells.get(key).push(t);
          }
        }
      }
    });
    return { tris, cells };
  }

  // Height of the car's top surface at (x, z) in the group's own space, or null
  function surface(x, z) {
    const list = field.cells.get(Math.floor(x / CELL) * 100000 + Math.floor(z / CELL));
    if (!list) return null;
    let top = null;
    for (const t of list) {
      const [ax, ay, az, bx, by, bz, cx, cy, cz] = field.tris[t];
      const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
      if (Math.abs(d) < 1e-12) continue;
      const u = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d;
      const v = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d;
      if (u < -1e-6 || v < -1e-6 || u + v > 1 + 1e-6) continue;
      const y = u * ay + v * by + (1 - u - v) * cy;
      if (top === null || y > top) top = y;
    }
    return top;
  }

  // Centre of the lid's trailing edge: the biggest step up while scanning forward from the
  // rear bumper; the height is read a little ahead of the step, on the lid itself
  function scanCentre() {
    const rearZ = dims.halfLength;
    let prev = null;
    let best = null;
    for (let z = rearZ - 0.01; z >= rearZ - SCAN_DEPTH; z -= STEP) {
      const h = surface(0, z);
      if (h !== null && prev !== null && h - prev > (best?.jump ?? 0)) best = { z, jump: h - prev };
      if (h !== null) prev = h;
    }
    if (!best) return null;
    const h = surface(0, best.z - 0.04);
    return h === null ? null : { z: best.z - 0.01, h };
  }

  // Edge at x: scanning forward, the first point that reaches the lid's height (within a few
  // cm of the neighbouring edge point) and stays there
  function scanSide(x, near) {
    for (let z = near.z + 0.15; z >= near.z - 0.4; z -= 0.01) {
      const h = surface(x, z);
      const h2 = surface(x, z - 0.04);
      if (h !== null && h2 !== null && h > near.h - 0.05 && h2 > near.h - 0.05) {
        return { z: z - 0.01, h: Math.min(near.h + 0.03, h2) };
      }
    }
    return null;
  }

  function measure() {
    group.updateWorldMatrix(true, true);
    field = buildField();

    const centre = (override?.z !== undefined
      ? { z: override.z, h: surface(0, override.z) }
      : scanCentre()) ?? { z: dims.halfLength - 0.25, h: dims.height * 0.7 };
    if (override?.y !== undefined || centre.h === null) centre.h = override?.y ?? dims.height * 0.7;

    // Edge points from the centre outwards, until the lid ends
    const points = [[0, centre.z, centre.h]];
    let halfWidth = override?.width ? override.width / 2 : null;
    let near = centre;
    for (let x = SIDE_STEP; x <= (halfWidth ?? dims.halfWidth); x += SIDE_STEP) {
      const e = scanSide(x, near);
      if (!e || near.z - e.z > 0.08) break; // the edge bending sharply forward runs onto the fender
      points.push([x, e.z, e.h]);
      near = e;
    }
    halfWidth ??= Math.max(0.3, points[points.length - 1][0]);
    // The centre scan reads the edge a step coarser than the sides: line it up with them
    if (points.length > 1) points[0][1] = Math.min(points[0][1], points[1][1] + 0.01);
    centre.z = points[0][1];

    // Edge (z, height) at any x, between the measured points
    const edgeAt = (x) => {
      const ax = Math.min(Math.abs(x), points[points.length - 1][0]);
      for (let i = 1; i < points.length; i++) {
        if (points[i][0] >= ax) {
          const [x0, z0, h0] = points[i - 1];
          const [x1, z1, h1] = points[i];
          const t = (ax - x0) / (x1 - x0);
          return { z: z0 + (z1 - z0) * t, h: h0 + (h1 - h0) * t };
        }
      }
      return { z: points[0][1], h: points[0][2] };
    };

    // Slope of the lid along the car, just ahead of the edge
    const ahead = surface(0, centre.z - 0.18);
    const pitch = ahead === null ? 0 : THREE.MathUtils.clamp(Math.atan2(ahead - centre.h, 0.18), -0.35, 0.35);

    // The wing's stands stand on the lid, a little in from the sides
    const width = halfWidth * 2;
    const standX = width * 0.3;
    const wingZ = wingOffset(pitch);
    const standBase = surface(standX, centre.z + wingZ);
    const wing = { span: width, standX, z: wingZ, base: (standBase ?? centre.h) - centre.h };

    field = null;
    return { z: centre.z, y: centre.h, pitch, width, edgeAt, wing, carHeight: dims.height };
  }

  return {
    get id() {
      return fittedId;
    },
    set(id) {
      if (!Object.hasOwn(BUILDERS, id)) id = 'none';
      if (id === fittedId) return;
      fittedId = id;
      if (fitted) {
        group.remove(fitted);
        fitted.traverse((o) => o.geometry?.dispose());
        fitted = null;
      }
      if (id === 'none') return;
      let mount = mountCache.get(cacheKey);
      if (!mount) {
        mount = measure();
        if (cacheKey) mountCache.set(cacheKey, mount);
      }
      fitted = new THREE.Group();
      fitted.name = `spoiler_${id}`;
      fitted.add(...BUILDERS[id](mount, paintMat));
      fitted.position.set(0, mount.y, mount.z);
      group.add(fitted);
    },
  };
}
