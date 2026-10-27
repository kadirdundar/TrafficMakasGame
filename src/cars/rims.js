import * as THREE from 'three';

// Rim colour for any car's exterior model (garage, online friends, drone replay). Rims rarely
// have a material of their own: the A8's share 'chrome' with the window trim, the M4's tyres and
// rims are one textured material. So the wheels are located first (from the tyres, or from the
// rim material itself), and only the triangles inside a wheel are moved into a mesh of their own
// with a copy of the material, which is then repainted: a solid metallic colour in place of the
// model's texture (factory black rims would stay black under a tint), all restored for 'factory'.
// Colours and prices live in src/progression/config.js → RIM_COLORS.

const DEFAULT_RIMS = { materials: [/rim|wheel|jant/i], tyres: [/tire|tyre|lastik/i] };

const matches = (patterns, name) => patterns.some((p) => (p instanceof RegExp ? p.test(name) : p === name));

// Triangles of the meshes whose material matches, in the model's space
function collectTriangles(model, patterns) {
  const out = [];
  model.traverse((o) => {
    if (!o.isMesh || !matches(patterns, o.material?.name || '')) return;
    out.push(o);
  });
  return out;
}

// One wheel per corner: bounding box of the given meshes' vertices in that quadrant, in the
// car's normalised space (the exterior group sits at the origin while it loads)
function locateWheels(meshes) {
  const boxes = new Map();
  const v = new THREE.Vector3();
  for (const mesh of meshes) {
    const pos = mesh.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      const key = `${Math.sign(v.x)}${Math.sign(v.z)}`;
      if (!boxes.has(key)) boxes.set(key, new THREE.Box3());
      boxes.get(key).expandByPoint(v);
    }
  }
  return [...boxes.values()]
    .filter((b) => !b.isEmpty())
    .map((b) => {
      const c = b.getCenter(new THREE.Vector3());
      return { x0: b.min.x - 0.02, x1: b.max.x + 0.02, y: c.y, z: c.z, r: (b.max.y - b.min.y) / 2 };
    });
}

// Splits `mesh` into the triangles inside a wheel (returned as a new mesh with its own copy of
// the material) and the rest (left in `mesh`). Returns null when no triangle is inside a wheel.
// `reach` is the share of the wheel's radius that is rim; `outer` (m), when set, keeps only the
// outer face of the wheel, for a material that also holds the brake caliper behind the spokes.
function splitRims(mesh, wheels, reach, outer) {
  const geo = mesh.geometry;
  const pos = geo.attributes.position;
  const index = geo.index;
  const count = index ? index.count : pos.count;
  const keep = [];
  const rim = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < count; i += 3) {
    const ia = index ? index.getX(i) : i;
    const ib = index ? index.getX(i + 1) : i + 1;
    const ic = index ? index.getX(i + 2) : i + 2;
    a.fromBufferAttribute(pos, ia).applyMatrix4(mesh.matrixWorld);
    b.fromBufferAttribute(pos, ib).applyMatrix4(mesh.matrixWorld);
    c.fromBufferAttribute(pos, ic).applyMatrix4(mesh.matrixWorld);
    const x = (a.x + b.x + c.x) / 3;
    const y = (a.y + b.y + c.y) / 3;
    const z = (a.z + b.z + c.z) / 3;
    const inWheel = wheels.some(
      (w) =>
        x >= w.x0 &&
        x <= w.x1 &&
        Math.hypot(y - w.y, z - w.z) < w.r * reach &&
        (!outer || Math.abs(x) >= Math.max(Math.abs(w.x0), Math.abs(w.x1)) - outer)
    );
    (inWheel ? rim : keep).push(ia, ib, ic);
  }
  if (!rim.length) return null;

  const rimGeo = geo.clone();
  rimGeo.setIndex(rim);
  geo.setIndex(keep);
  const rimMesh = new THREE.Mesh(rimGeo, mesh.material.clone());
  rimMesh.name = `${mesh.name}_rims`;
  rimMesh.position.copy(mesh.position);
  rimMesh.quaternion.copy(mesh.quaternion);
  rimMesh.scale.copy(mesh.scale);
  return rimMesh;
}

// Prepares the model's rims once (at load) and returns setColor(hex | null); null is the factory
// finish. `cfg` is car.js → exterior.rims ({ materials, tyres, reach, outer }) or the defaults.
export function createRimPaint(model, cfg = {}) {
  const materials = cfg.materials ?? DEFAULT_RIMS.materials;
  const tyres = cfg.tyres ?? DEFAULT_RIMS.tyres;
  model.updateWorldMatrix(true, true);

  const rimMeshes = collectTriangles(model, materials).filter((m) => m.geometry?.attributes.position);
  if (!rimMeshes.length) return () => {};

  // Wheels from the tyres when the model has them as a material, else from the rims themselves
  const tyreMeshes = collectTriangles(model, tyres).filter((m) => m.geometry?.attributes.position);
  const tyreTris = tyreMeshes.reduce((n, m) => n + (m.geometry.index?.count ?? m.geometry.attributes.position.count) / 3, 0);
  const wheels = locateWheels(tyreTris > 100 ? tyreMeshes : rimMeshes);
  const reach = cfg.reach ?? 0.9; // inside the tyre's inner edge: arch trim and tyre stay out

  const painted = [];
  for (const mesh of rimMeshes) {
    const rims = splitRims(mesh, wheels, reach, cfg.outer);
    if (!rims) continue;
    mesh.parent.add(rims);
    const mat = rims.material;
    painted.push({
      mat,
      factory: { color: mat.color.clone(), map: mat.map, metalness: mat.metalness, roughness: mat.roughness },
    });
  }

  // Called every frame by the drone replay: only a change touches the materials
  let current = null;
  return (hex) => {
    const isFactory = hex === null || hex === undefined;
    const key = isFactory ? 'factory' : hex;
    if (key === current) return;
    current = key;
    for (const { mat, factory } of painted) {
      mat.color.copy(isFactory ? factory.color : new THREE.Color(hex));
      mat.map = isFactory ? factory.map : null;
      mat.metalness = isFactory ? factory.metalness : 0.55;
      mat.roughness = isFactory ? factory.roughness : 0.38;
      mat.needsUpdate = true;
    }
  };
}
