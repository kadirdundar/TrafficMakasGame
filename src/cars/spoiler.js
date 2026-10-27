import * as THREE from 'three';

// Bolt-on rear spoilers for any car's exterior model (garage, online friends, drone replay).
// The parts are built in code, so every car, also one added later, gets them without new
// model files: the mount is measured on the model itself the first time a spoiler is fitted.
// Types, prices and their effect on the car live in src/progression/config.js → SPOILERS.

const STEP = 0.03; // m between the top-down rays that look for the boot lid's trailing edge
const SCAN_DEPTH = 1.1; // m forward from the rear bumper that is searched
const WING_Z = -0.17; // the wing stands on the lid, its blade ending over the lid's edge

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

// Lip and ducktail follow the lid's curve across the car (lower towards the sides)
function conform(geo, heightAt, centerY) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, pos.getY(i) + heightAt(pos.getX(i)) - centerY);
  }
  geo.computeVertexNormals();
}

const BUILDERS = {
  // Thin lip on the lid's trailing edge
  lip(m, paint) {
    const geo = extrudeProfile([[-0.1, -0.01], [0.025, -0.01], [0.035, 0.04], [-0.1, 0.006]], m.width);
    conform(geo, m.heightAt, m.y);
    return [new THREE.Mesh(geo, paint)];
  },
  // Kicked-up ducktail, 911 style
  ducktail(m, paint) {
    const geo = extrudeProfile(
      [[-0.24, -0.01], [0.03, -0.01], [0.075, 0.095], [0.04, 0.1], [-0.24, 0.008]],
      m.width * 0.96
    );
    conform(geo, m.heightAt, m.y);
    return [new THREE.Mesh(geo, paint)];
  },
  // GT wing on two stands, with endplates
  wing(m) {
    const span = m.width * 1.02;
    const lift = THREE.MathUtils.clamp(m.carHeight * 0.19, 0.22, 0.28);
    const blade = extrudeProfile(
      [[-0.17, 0.0], [-0.14, 0.022], [0.0, 0.034], [0.13, 0.018], [0.15, 0.002], [0.0, -0.006]],
      span
    );
    // Nose down against the road, whatever the slope of the lid the wing is mounted on
    blade.rotateX(0.12 - m.pitch);
    blade.translate(0, lift, WING_Z);

    const parts = [blade];
    for (const side of [-1, 1]) {
      const plate = new THREE.BoxGeometry(0.012, 0.11, 0.36);
      plate.rotateX(-m.pitch);
      plate.translate(side * (span / 2 + 0.006), lift + 0.01, WING_Z);
      parts.push(plate);

      // Stand from the lid surface up to the blade
      const sx = side * span * 0.3;
      const base = m.heightAt(sx) - m.y - 0.01;
      const standH = lift - base;
      const stand = new THREE.BoxGeometry(0.018, standH, 0.12);
      stand.translate(sx, base + standH / 2, WING_Z - 0.02);
      parts.push(stand);
    }
    return parts.map((g) => new THREE.Mesh(g, carbon()));
  },
};

export const SPOILER_TYPES = Object.keys(BUILDERS);

// Fits spoilers onto one loaded exterior. `dims` are the normalised model's half length/width
// and height, `override` comes from car.js → exterior.spoiler ({ z, y, width } in model metres)
// for a model whose lid the measurement does not find.
export function createSpoilerMount(group, model, dims, override, paintMat) {
  let mount = null;
  let fitted = null;
  let fittedId = 'none';
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // Height of the car's top surface at (x, z) in the group's own space, or null
  function surface(x, z) {
    group.updateWorldMatrix(true, false);
    origin.set(x, dims.height + 1, z).applyMatrix4(group.matrixWorld);
    dir.set(0, -1, 0).transformDirection(group.matrixWorld);
    raycaster.set(origin, dir);
    const hit = raycaster.intersectObject(model, true)[0];
    return hit ? group.worldToLocal(hit.point.clone()).y : null;
  }

  function measure() {
    model.updateWorldMatrix(true, true);
    const rearZ = dims.halfLength;

    // The lid's trailing edge: the biggest step up while scanning forward from the bumper
    let edgeZ = rearZ - 0.25;
    if (override?.z !== undefined) {
      edgeZ = override.z;
    } else {
      let prev = null;
      let bestJump = 0;
      for (let d = 0.02; d <= SCAN_DEPTH; d += STEP) {
        const h = surface(0, rearZ - d);
        if (h !== null && prev !== null && h - prev > bestJump) {
          bestJump = h - prev;
          edgeZ = rearZ - d - 0.02;
        }
        if (h !== null) prev = h;
      }
    }
    const z = edgeZ;
    const y = override?.y ?? surface(0, z - 0.04) ?? dims.height * 0.7;

    // Across the car: the lid ends where the surface falls away from its centre height
    let halfWidth = dims.halfWidth * 0.8;
    const samples = [];
    for (let x = 0; x <= dims.halfWidth; x += 0.04) {
      const h = surface(x, z - 0.04);
      if (h === null || h < y - 0.14) {
        halfWidth = Math.max(0.3, x - 0.04);
        break;
      }
      samples.push([x, h]);
    }
    if (override?.width) halfWidth = override.width / 2;
    const heightAt = (x) => {
      const ax = Math.abs(x);
      let h = samples[samples.length - 1]?.[1] ?? y;
      for (let i = 1; i < samples.length; i++) {
        if (samples[i][0] >= ax) {
          const [x0, h0] = samples[i - 1];
          const [x1, h1] = samples[i];
          h = h0 + ((h1 - h0) * (ax - x0)) / (x1 - x0);
          break;
        }
      }
      return override?.y !== undefined ? y : h;
    };

    // Follow the lid's slope along the car
    const ahead = surface(0, z - 0.2);
    const pitch = ahead === null ? 0 : THREE.MathUtils.clamp(Math.atan2(ahead - y, 0.16), -0.35, 0.35);

    return { z, y, pitch, width: halfWidth * 2 * 0.94, heightAt, carHeight: dims.height };
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
      mount ??= measure();
      fitted = new THREE.Group();
      fitted.name = `spoiler_${id}`;
      fitted.add(...BUILDERS[id](mount, paintMat));
      fitted.position.set(0, mount.y, mount.z);
      fitted.rotation.x = mount.pitch;
      group.add(fitted);
    },
  };
}
