import * as THREE from 'three';

// Rain on the windscreen of the 3D cockpit (cockpit3d.js): drops land on the glass, the airflow
// pushes them up and out at speed, and the wiper blades clear what they sweep over.
//
// The drops lie in the plane of the car's windscreen, just outside it: through the wiper pivots,
// facing cfg.glassOut (the same frame the wipers turn in). Wherever the cabin is between the eye
// and that plane (roof, pillars, dashboard) it hides them, so they only show through the glass.
// All of them are one instanced quad: one draw call.
//
// Lengths below are in the cockpit model's units, which are about metres.

const MAX_DROPS = 300;
const HALF_WIDTH = 0.8; // the windscreen reaches this far either side of the car's centre line
const HEIGHT = 0.85; // and this far up the glass from the wiper pivots
const DRIVER_OFFSET = 0.37; // the driver sits this far left of the centre line
// Drops landing per second: a few standing still, many more at speed
const LAND_RATE_BASE = 55;
const LAND_RATE_PER_KMH = 1.1;
// Airflow: above this speed the drops creep up the glass, faster the bigger they are
const AIRFLOW_FROM_KMH = 45;
const AIRFLOW_M_PER_S_PER_KMH = 0.0042;
// The blade wipes from this share of the arm's length to its tip (createWiper in cockpit3d.js)
const BLADE_FROM = 0.24;
const BLADE_TO = 1.0;

// A drop of water seen against the road: a clear body with a dark refracted rim, the sky caught
// as a bright spot near its top and a faint lit crescent underneath
function createDropTexture() {
  const S = 64;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  const c = S / 2;
  const body = ctx.createRadialGradient(c, c, 0, c, c, c);
  body.addColorStop(0, 'rgba(200,214,232,0.34)');
  body.addColorStop(0.6, 'rgba(140,155,180,0.42)');
  body.addColorStop(0.84, 'rgba(10,14,22,0.8)');
  body.addColorStop(1, 'rgba(10,14,22,0)');
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, S, S);

  const spot = ctx.createRadialGradient(c * 0.76, c * 0.6, 0, c * 0.76, c * 0.6, c * 0.34);
  spot.addColorStop(0, 'rgba(255,255,255,1)');
  spot.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = 'rgba(220,232,250,0.55)';
  ctx.lineWidth = S * 0.07;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.66, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// `cfg` is the car's resolved cockpit config, `eye` the driver's eye in model space.
// Returns null for a cockpit without wipers (there is no glass plane to put the drops on).
export function createWindscreenRain(cfg, eye) {
  if (!cfg.wiperPivots?.length) return null;

  // The wipers' frame (cockpit3d.js): blades turn from restDir (to the left) towards upDir
  const restDir = new THREE.Vector3(-1, 0, 0).addScaledVector(cfg.glassOut, cfg.glassOut.x).normalize();
  const upDir = cfg.glassUp.clone().addScaledVector(restDir, -cfg.glassUp.dot(restDir)).normalize();
  const U = restDir.clone().negate(); // across the glass, to the right
  const V = upDir; // up the glass
  const N = new THREE.Vector3().crossVectors(U, V).normalize();

  const pivots = cfg.wiperPivots.map((p) => new THREE.Vector3().fromArray(p));
  const origin = pivots
    .reduce((sum, p) => sum.add(p), new THREE.Vector3())
    .divideScalar(pivots.length)
    .addScaledVector(cfg.glassOut, 0.004);
  const toPlane = (p) => {
    const d = p.clone().sub(origin);
    return { u: d.dot(U), v: d.dot(V) };
  };
  const wiperPivots = pivots.map(toPlane);
  const centreU = toPlane(new THREE.Vector3(eye.x + DRIVER_OFFSET, origin.y, origin.z)).u;
  const vMin = Math.min(...wiperPivots.map((p) => p.v)) - 0.03;
  const vMax = vMin + HEIGHT;
  const armLen = cfg.wiperLen;

  const material = new THREE.MeshBasicMaterial({
    map: createDropTexture(),
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    fog: false,
  });
  const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), material, MAX_DROPS);
  mesh.matrixAutoUpdate = false;
  mesh.matrix.makeBasis(U, V, N).setPosition(origin);
  mesh.frustumCulled = false;
  mesh.count = 0;
  mesh.renderOrder = 3;

  // Drops in the glass plane: position (u, v), radius r
  const drops = [];
  let toLand = 0;
  let lastAngle = null;
  const _m = new THREE.Matrix4();

  // Is the drop under the part of the blade that swept from angle a0 to a1 this frame?
  const wiped = (d, a0, a1) => {
    for (const p of wiperPivots) {
      const du = d.u - p.u;
      const dv = d.v - p.v;
      const r = Math.hypot(du, dv);
      if (r < BLADE_FROM * armLen || r > BLADE_TO * armLen) continue;
      const a = Math.atan2(dv, -du);
      const margin = (0.012 + d.r) / r; // the blade's own width
      if (a >= Math.min(a0, a1) - margin && a <= Math.max(a0, a1) + margin) return true;
    }
    return false;
  };

  return {
    mesh,
    // `raining`: rain is falling on the glass now (not in a tunnel); `wiperAngle`: where the
    // blades are (the angle the wiper meshes are turned to), or null while they are parked
    // and hidden; `night` dims the drops, which show the dark road through them
    update({ dt, raining, speedKmh, wiperAngle, night }) {
      if (!raining && drops.length === 0) {
        mesh.count = 0;
        lastAngle = wiperAngle;
        return;
      }
      const step = Math.min(dt, 0.05);

      if (raining) {
        toLand += (LAND_RATE_BASE + speedKmh * LAND_RATE_PER_KMH) * step;
        while (toLand >= 1) {
          toLand -= 1;
          if (drops.length >= MAX_DROPS) drops.shift(); // the oldest one runs off
          const big = Math.random();
          drops.push({
            u: centreU + (Math.random() * 2 - 1) * HALF_WIDTH,
            v: vMin + Math.random() * HEIGHT,
            r: 0.0035 + big * big * 0.0065,
          });
        }
      }

      // The airflow over the glass drives them up and out to the sides; slow, they run down
      const airflow = Math.max(0, speedKmh - AIRFLOW_FROM_KMH) * AIRFLOW_M_PER_S_PER_KMH;
      const sweeping = wiperAngle !== null && lastAngle !== null && wiperAngle !== lastAngle;
      let n = 0;
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        const size = d.r / 0.005;
        d.vel = airflow > 0 ? airflow * size : -0.012 * size * size;
        d.v += d.vel * step;
        d.u += (d.u - centreU) * airflow * 0.25 * step;
        const gone =
          d.v > vMax || d.v < vMin - 0.05 || Math.abs(d.u - centreU) > HALF_WIDTH + 0.05 || (sweeping && wiped(d, lastAngle, wiperAngle));
        if (!gone) drops[n++] = d;
      }
      drops.length = n;
      lastAngle = wiperAngle;

      // A moving drop is drawn out along its path
      for (let i = 0; i < n; i++) {
        const d = drops[i];
        const stretch = 1 + Math.min(2.5, Math.abs(d.vel) * 4);
        _m.makeScale(d.r * 2, d.r * 2 * stretch, 1).setPosition(d.u, d.v, 0);
        mesh.setMatrixAt(i, _m);
      }
      mesh.count = n;
      mesh.instanceMatrix.needsUpdate = true;
      material.color.setScalar(night ? 0.8 : 1);
    },
  };
}
