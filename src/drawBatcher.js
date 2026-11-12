import * as THREE from 'three';

// Draws many small meshes that share a material in one draw call.
//
// The traffic and the roadside are built from hundreds of small meshes (a car is a body, glass,
// trim, rims, lamps, a plate ...; a stretch of road is posts, reflectors, lamp heads ...), and
// each one that is on screen costs a draw call of its own. Here every such mesh stays where it
// is in the scene, so all the code that moves, hides and re-lights it keeps working, but it is no
// longer drawn itself: a THREE.BatchedMesh per material draws all of them at once, with the same
// geometry, the same material and each mesh's own place, so the picture is the same.
//
// What is batched: plain meshes with one built-in material under the roots handed to `watch`.
// A mesh is left to draw itself when it would gain nothing (the only one with its material),
// when it is mirrored, or once its material or geometry is swapped for one the batch does not
// know (userData.batchGeometries lists the ones a mesh switches between).
// Meshes with userData.batchTint differ from each other only in colour (the cars' paint): they
// share a batch, each instance with its own colour.

const REFRESH_FRAMES = 120; // how often the roots are searched for new and removed meshes

const attributeSignature = (geometry) =>
  Object.keys(geometry.attributes).sort().join(',') + (geometry.index ? '|i' : '');

const tintSignature = (m) =>
  ['tint', m.type, m.metalness, m.roughness, m.clearcoat, m.clearcoatRoughness, m.envMapIntensity].join('/');

function batchable(mesh) {
  if (!mesh.isMesh || mesh.isInstancedMesh || mesh.isSkinnedMesh || mesh.isBatchedMesh) return false;
  if (mesh.userData.noBatch || Array.isArray(mesh.material)) return false;
  const m = mesh.material;
  if (!(m.isMeshBasicMaterial || m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial)) {
    return false;
  }
  const g = mesh.geometry;
  return Boolean(g?.attributes?.position) && Object.keys(g.morphAttributes).length === 0;
}

export class DrawBatcher {
  constructor(scene) {
    this.scene = scene;
    this.roots = [];
    this.proxies = new Map(); // mesh -> proxy
    this.excluded = new WeakSet(); // meshes that swapped material/geometry: they draw themselves
    this.batches = [];
    this.enabled = true;
    this.dirty = false;
    this.pending = true;
    this.frames = 0;
    this._color = new THREE.Color();

    // Runs right before each view is drawn, when every matrixWorld is up to date; the mirror,
    // the main view and the replay camera then draw the same batches
    const previous = scene.onBeforeRender;
    scene.onBeforeRender = (...args) => {
      previous?.apply(scene, args);
      if (this.pending) this.update();
    };
  }

  // `roots()` returns the objects whose meshes are to be batched (called again on every refresh,
  // so it may return different objects over time)
  watch(roots) {
    this.roots.push(roots);
    this.frames = 0;
  }

  // Call once per frame, before anything is drawn
  frame() {
    this.pending = true;
  }

  // Look for new and removed meshes now instead of at the next periodic refresh
  refresh() {
    this.frames = 0;
  }

  // Off: every mesh draws itself again, as if this class did not exist
  setEnabled(enabled) {
    if (enabled === this.enabled) return;
    this.enabled = enabled;
    if (!enabled) {
      this.clearBatches();
      for (const p of this.proxies.values()) p.mesh.layers.mask = p.layerMask;
      this.proxies.clear();
    }
    this.frames = 0;
  }

  update() {
    this.pending = false;
    if (!this.enabled) return;
    if (this.frames-- <= 0) {
      this.frames = REFRESH_FRAMES;
      this.collect();
    }
    if (this.dirty) this.build();

    for (const p of this.proxies.values()) {
      const batch = p.batch;
      if (!batch) continue;
      const mesh = p.mesh;
      if (mesh.material !== p.material) {
        this.exclude(p);
        continue;
      }
      if (mesh.geometry !== p.geometry) {
        const id = batch.geometryIds.get(mesh.geometry);
        if (id === undefined) {
          this.exclude(p);
          continue;
        }
        p.geometry = mesh.geometry;
        batch.mesh.setGeometryIdAt(p.id, id);
      }
      if (p.tint) {
        if (tintSignature(mesh.material) !== p.signature) {
          this.dirty = true; // another finish: it belongs in another batch
        } else if (!p.color.equals(mesh.material.color)) {
          p.color.copy(mesh.material.color);
          batch.mesh.setColorAt(p.id, p.color);
        }
      }
      let visible = true;
      for (let o = mesh; o !== this.scene; o = o.parent) {
        if (!o || !o.visible) {
          visible = false;
          break;
        }
      }
      if (visible !== p.visible) {
        p.visible = visible;
        batch.mesh.setVisibleAt(p.id, visible);
      }
      if (visible) batch.mesh.setMatrixAt(p.id, mesh.matrixWorld);
    }
  }

  // Brings the set of proxies in line with the meshes under the roots
  collect() {
    const seen = new Set();
    const visit = (obj) => {
      if (this.excluded.has(obj)) return;
      const known = this.proxies.get(obj);
      if (known) {
        seen.add(obj);
      } else if (batchable(obj)) {
        seen.add(obj);
        this.proxies.set(obj, { mesh: obj, layerMask: obj.layers.mask, batch: null });
        this.dirty = true;
      }
    };
    for (const roots of this.roots) for (const root of roots()) root?.traverse(visit);
    for (const [mesh, p] of this.proxies) {
      if (seen.has(mesh)) continue;
      mesh.layers.mask = p.layerMask;
      this.proxies.delete(mesh);
      this.dirty = true;
    }
  }

  // The mesh draws itself from now on
  exclude(p) {
    p.mesh.layers.mask = p.layerMask;
    if (p.batch) p.batch.mesh.setVisibleAt(p.id, false);
    this.proxies.delete(p.mesh);
    this.excluded.add(p.mesh);
  }

  clearBatches() {
    for (const batch of this.batches) {
      this.scene.remove(batch.mesh);
      batch.mesh.dispose();
      if (batch.ownMaterial) batch.mesh.material.dispose();
    }
    this.batches = [];
  }

  build() {
    this.dirty = false;
    this.clearBatches();

    // Meshes that can share a draw call: same material (or same paint finish), same layers and
    // draw order, and geometries with the same attributes
    const groups = new Map();
    for (const p of this.proxies.values()) {
      const mesh = p.mesh;
      mesh.layers.mask = p.layerMask;
      p.batch = null;
      p.material = mesh.material;
      p.geometry = mesh.geometry;
      p.tint = Boolean(mesh.userData.batchTint);
      p.signature = p.tint ? tintSignature(mesh.material) : mesh.material.uuid;
      if (mesh.matrixWorld.determinant() < 0) continue; // mirrored: its faces wind the other way
      const key = [p.signature, p.layerMask, mesh.renderOrder, attributeSignature(mesh.geometry)].join('|');
      let group = groups.get(key);
      if (!group) groups.set(key, (group = []));
      group.push(p);
    }

    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const first = group[0];
      const signature = attributeSignature(first.geometry);
      const geometries = new Set();
      for (const p of group) {
        geometries.add(p.geometry);
        for (const g of p.mesh.userData.batchGeometries || []) {
          if (g && attributeSignature(g) === signature) geometries.add(g);
        }
      }
      let vertices = 0;
      let indices = 0;
      for (const g of geometries) {
        vertices += g.attributes.position.count;
        indices += g.index ? g.index.count : 0;
      }

      let material = first.material;
      if (first.tint) {
        material = first.material.clone();
        material.color.set(0xffffff); // each instance brings its own colour
      }
      const mesh = new THREE.BatchedMesh(group.length, vertices, indices, material);
      mesh.layers.mask = first.layerMask;
      mesh.renderOrder = first.mesh.renderOrder;
      mesh.frustumCulled = false; // its instances are all over the road; they are culled one by one
      mesh.perObjectFrustumCulled = true;
      mesh.sortObjects = Boolean(material.transparent);
      mesh.matrixAutoUpdate = false;

      const batch = { mesh, geometryIds: new Map(), ownMaterial: first.tint };
      for (const g of geometries) batch.geometryIds.set(g, mesh.addGeometry(g));
      for (const p of group) {
        p.id = mesh.addInstance(batch.geometryIds.get(p.geometry));
        p.batch = batch;
        p.visible = true;
        p.mesh.layers.mask = 0; // drawn by the batch from here on
        if (p.tint) {
          p.color = p.mesh.material.color.clone();
          mesh.setColorAt(p.id, p.color);
        }
      }
      this.scene.add(mesh);
      this.batches.push(batch);
    }
  }
}
