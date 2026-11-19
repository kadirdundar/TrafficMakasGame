import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LANE_CENTERS, ROAD_HALF_WIDTH, getZoneAt } from './world.js';
import { addWheelSpin, createTrafficVehicle } from './vehicleModels.js';

// Lane closures on the motorway: road works (one or two lanes coned off for half a kilometre,
// with signs, a flashing arrow board and a work lorry) or a broken-down car standing in the
// outside lane with its hazards on. They are rare on purpose: the first one comes 6-7 km into
// a drive, then one every 80 km.
//
// Positions are world distances along the road (s, m) and lane coordinates (x, m from the road
// centre, as traffic.js and the player use). The scene is drawn around the player at z = 0 with
// the road ahead at z < 0, so a point at s is at z = worldDistM - s.
//
// The traffic asks laneClosedAt / distanceToShut / speedCapAt (src/traffic.js), the game asks
// playerHit and takeWarning (src/main.js). Offline only: online the host's traffic is shared and
// a closure would have to be too.

const FIRST_MIN_M = 6000;
const FIRST_MAX_M = 7000;
const PERIOD_M = 80000;
// A closure is built this far ahead of the player (well out of sight in the fog)
const BUILD_AHEAD_M = 1500;
// Shown this far before its first cone
const WARN_AHEAD_M = { works: 700, breakdown: 420 };
// Traffic in a closed lane starts moving over this far before the closure
export const MERGE_LEAD_M = 260;
const WORKS_SPEED_CAP_KMH = 90;
const LANE_WIDTH = 3.6;
const PLAYER_HALF_WIDTH = 0.86;
const CONE_RADIUS = 0.2;
const VISIBLE_AHEAD_M = 1200;
const VISIBLE_BEHIND_M = 90;
const MAX_CONES = 160;

// Parked vehicles keep their wheels still (traffic cars share one turning angle)
const STILL_WHEELS = { value: 0 };
function parkWheels(group, disposables) {
  group.traverse((o) => {
    if (o.material?.customProgramCacheKey?.() !== 'wheelSpin') return;
    o.material = addWheelSpin(o.material.clone(), STILL_WHEELS);
    disposables.push(o.material);
  });
}

const rand = (a, b) => a + Math.random() * (b - a);
const lerp = (a, b, t) => a + (b - a) * t;

function canvasTexture(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Temporary works sign: yellow board, warning triangle, "YOL ÇALIŞMASI", the distance and the
// four lanes with the shut ones crossed out
function worksSignTexture(distanceText, closedLanes) {
  return canvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = '#f5c400';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#111';
    g.lineWidth = 16;
    g.strokeRect(10, 10, w - 20, h - 20);

    // Warning triangle with a digging worker's spade reduced to a bold "!"
    g.beginPath();
    g.moveTo(w / 2, 40);
    g.lineTo(w / 2 + 92, 196);
    g.lineTo(w / 2 - 92, 196);
    g.closePath();
    g.fillStyle = '#fff';
    g.fill();
    g.lineWidth = 16;
    g.strokeStyle = '#d0121b';
    g.lineJoin = 'round';
    g.stroke();
    g.fillStyle = '#111';
    g.font = 'bold 96px Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('!', w / 2, 140);

    g.font = 'bold 54px Arial, sans-serif';
    g.fillText('YOL ÇALIŞMASI', w / 2, 248);

    // Lanes: an up arrow for an open one, a red cross for a shut one
    const laneW = 92;
    const x0 = w / 2 - laneW * 2;
    for (let i = 0; i < 4; i++) {
      const cx = x0 + laneW * (i + 0.5);
      if (closedLanes.includes(i)) {
        g.strokeStyle = '#d0121b';
        g.lineWidth = 14;
        g.beginPath();
        g.moveTo(cx - 26, 300);
        g.lineTo(cx + 26, 360);
        g.moveTo(cx + 26, 300);
        g.lineTo(cx - 26, 360);
        g.stroke();
      } else {
        g.fillStyle = '#111';
        g.beginPath();
        g.moveTo(cx, 292);
        g.lineTo(cx + 24, 322);
        g.lineTo(cx + 9, 322);
        g.lineTo(cx + 9, 368);
        g.lineTo(cx - 9, 368);
        g.lineTo(cx - 9, 322);
        g.lineTo(cx - 24, 322);
        g.closePath();
        g.fill();
      }
    }
    g.fillStyle = '#111';
    g.font = 'bold 88px Arial, sans-serif';
    g.fillText(distanceText, w / 2, 440);
  });
}

// Arrow board: amber chevrons on black pointing to the side that is still open
function arrowBoardTexture(pointLeft) {
  return canvasTexture(256, 128, (g, w, h) => {
    g.fillStyle = '#0b0b0b';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#ffb21a';
    g.lineWidth = 16;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (let i = 0; i < 3; i++) {
      const x = 70 + i * 58;
      const dir = pointLeft ? -1 : 1;
      g.beginPath();
      g.moveTo(x - dir * 18, 30);
      g.lineTo(x + dir * 18, h / 2);
      g.lineTo(x - dir * 18, h - 30);
      g.stroke();
    }
  });
}

// Red and white striped barricade board
function stripeTexture() {
  const tex = canvasTexture(256, 64, (g, w, h) => {
    for (let i = -2; i < 10; i++) {
      g.fillStyle = i % 2 ? '#f4f4f4' : '#d0121b';
      g.beginPath();
      g.moveTo(i * 32, h);
      g.lineTo(i * 32 + 32, h);
      g.lineTo(i * 32 + 64, 0);
      g.lineTo(i * 32 + 32, 0);
      g.closePath();
      g.fill();
    }
  });
  return tex;
}

function warningTriangleGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.26, 0);
  shape.lineTo(0.26, 0);
  shape.lineTo(0, 0.45);
  shape.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-0.17, 0.05);
  hole.lineTo(0, 0.34);
  hole.lineTo(0.17, 0.05);
  hole.closePath();
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false });
  geo.translate(0, 0.03, 0);
  return geo;
}

// Shared materials and geometries (built on first use)
let ASSETS = null;
function assets() {
  if (ASSETS) return ASSETS;
  const coneBody = new THREE.CylinderGeometry(0.035, CONE_RADIUS, 0.68, 14, 1, true);
  coneBody.translate(0, 0.38, 0);
  const coneTop = new THREE.CylinderGeometry(0.03, 0.035, 0.02, 10);
  coneTop.translate(0, 0.73, 0);
  const band = new THREE.CylinderGeometry(0.105, 0.135, 0.16, 14, 1, true);
  band.translate(0, 0.44, 0);
  const base = new THREE.BoxGeometry(0.46, 0.04, 0.46);
  base.translate(0, 0.02, 0);
  ASSETS = {
    cone: mergeGeometries([coneBody, coneTop]),
    band,
    base,
    orange: new THREE.MeshStandardMaterial({ color: 0xff5a14, roughness: 0.55, emissive: 0xff3d00, emissiveIntensity: 0.12 }),
    white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, emissive: 0xffffff, emissiveIntensity: 0.15 }),
    black: new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 }),
    post: new THREE.MeshStandardMaterial({ color: 0x8a9096, roughness: 0.6, metalness: 0.5 }),
    amber: new THREE.MeshBasicMaterial({ color: 0xffa31a }),
    amberOff: new THREE.MeshBasicMaterial({ color: 0x3a2405 }),
    stripes: new THREE.MeshStandardMaterial({ map: stripeTexture(), roughness: 0.5, emissive: 0xffffff, emissiveIntensity: 0.1 }),
    triangle: warningTriangleGeometry(),
    red: new THREE.MeshStandardMaterial({ color: 0xe0141e, roughness: 0.4, emissive: 0xc00010, emissiveIntensity: 0.35 }),
  };
  ASSETS.stripes.emissiveMap = ASSETS.stripes.map;
  return ASSETS;
}

export class RoadClosures {
  constructor(scene) {
    this.scene = scene;
    this.worldDistM = 0;
    this.tripM = 0;
    this.nextAtTripM = Infinity;
    this.closure = null;
    this.enabled = false;
    this.night = false;
  }

  // A new drive: the first closure is FIRST_MIN_M-FIRST_MAX_M into it
  reset() {
    this.clear();
    this.tripM = 0;
    this.nextAtTripM = rand(FIRST_MIN_M, FIRST_MAX_M);
  }

  clear() {
    if (!this.closure) return;
    this.scene.remove(this.closure.group);
    this.closure.dispose();
    this.closure = null;
  }

  // tripM: metres driven this drive; enabled: on the motorway and offline
  update(dt, { worldDistM, tripM, enabled, night, nowSec }) {
    // The road's distance jumped (a new road, an online room): what was built is no longer there
    if (Math.abs(worldDistM - this.worldDistM) > 400) this.clear();
    this.worldDistM = worldDistM;
    this.tripM = tripM;
    this.enabled = enabled;
    if (!enabled) {
      this.clear();
      return;
    }

    if (!this.closure && tripM >= this.nextAtTripM - BUILD_AHEAD_M) this.build();

    const c = this.closure;
    if (!c) return;
    if (worldDistM > c.s3 + VISIBLE_BEHIND_M + 40) {
      this.clear();
      return;
    }
    if (night !== this.night) this.night = night;
    c.place(worldDistM, this.world, nowSec, night, dt);
  }

  setWorld(world) {
    this.world = world;
  }

  build() {
    const startS = this.worldDistM + (this.nextAtTripM - this.tripM);
    const kind = Math.random() < 0.6 ? 'works' : 'breakdown';
    const plan = kind === 'works' ? planWorks(startS) : planBreakdown(startS);
    // Not in a tunnel or on the bridge: move it past them
    const from = plan.s0 - WARN_AHEAD_M[kind] - 100;
    for (let s = from; s <= plan.s3 + 60; s += 40) {
      if (getZoneAt(s, 'highway') !== 'highway') {
        this.nextAtTripM += 600;
        return;
      }
    }
    this.nextAtTripM += PERIOD_M;
    this.closure = kind === 'works' ? new WorksClosure(plan) : new BreakdownClosure(plan);
    this.scene.add(this.closure.group);
  }

  // Lane `lane` at scene z is shut (from `leadM` before the closure to its end)
  laneClosedAt(lane, z, leadM = 0) {
    const c = this.closure;
    if (!c || !c.lanes.includes(lane)) return false;
    const s = this.worldDistM - z;
    return s >= c.s0 - leadM && s <= c.s3;
  }

  // Metres from a car at scene z in `lane` to where its lane is shut (0 inside), or null when
  // it is not shut within MERGE_LEAD_M ahead
  distanceToShut(lane, z) {
    const c = this.closure;
    if (!c || !c.lanes.includes(lane)) return null;
    const s = this.worldDistM - z;
    if (s > c.s3 || s < c.s0 - MERGE_LEAD_M) return null;
    return Math.max(0, c.s0 - s);
  }

  // Speed limit through road works (none elsewhere)
  speedCapAt(z) {
    const c = this.closure;
    if (!c || c.kind !== 'works') return Infinity;
    const s = this.worldDistM - z;
    return s >= c.s0 - 200 && s <= c.s3 ? WORKS_SPEED_CAP_KMH : Infinity;
  }

  // The player (at s = worldDistM, lane x = playerX) runs into the cones or the broken-down car:
  // { side, edgeX, message, severe } with edgeX the nearest x the car can keep to, or null
  playerHit(playerX, speedKmh) {
    const c = this.closure;
    if (!c) return null;
    const edge = c.edgeAt(this.worldDistM);
    if (edge === null) return null;
    const reach = c.side > 0 ? playerX + PLAYER_HALF_WIDTH : -(playerX - PLAYER_HALF_WIDTH);
    if (reach <= edge * c.side) return null;
    if (speedKmh > 8) c.knockCones(this.worldDistM, playerX, speedKmh);
    return {
      side: c.side,
      edgeX: edge - c.side * (PLAYER_HALF_WIDTH + 0.12),
      message: c.kind === 'works' ? '🚧 YOL ÇALIŞMASINA DALDIN!' : '🚨 ARIZALI ARACA ÇARPTIN!',
      severe: c.kind === 'breakdown', // a standing car stops you like a head-on knock
    };
  }

  // A one-off heads-up as the closure comes up: the text, or null
  takeWarning() {
    const c = this.closure;
    if (!c || c.warned) return null;
    const ahead = c.s0 - this.worldDistM;
    if (ahead > WARN_AHEAD_M[c.kind] || ahead < 0) return null;
    c.warned = true;
    const sideText = c.side > 0 ? 'SAĞ' : 'SOL';
    const lanesText = c.lanes.length > 1 ? `${sideText} ${c.lanes.length} ŞERİT` : `${sideText} ŞERİT`;
    const meters = Math.round(ahead / 50) * 50;
    return c.kind === 'works'
      ? `🚧 ${meters} m İLERİDE YOL ÇALIŞMASI • ${lanesText} KAPALI`
      : `⚠️ ${meters} m İLERİDE ARIZALI ARAÇ • ${lanesText} KAPALI`;
  }

  // For the radar and tests: the closure in scene coordinates, or null
  get active() {
    const c = this.closure;
    if (!c) return null;
    return { kind: c.kind, side: c.side, lanes: c.lanes, startZ: this.worldDistM - c.s0, endZ: this.worldDistM - c.s3 };
  }
}

// Road works: `count` lanes on one side (mostly the right) shut for 450-650 m behind a 90 m
// taper of cones, with signs at 500 m and 250 m
function planWorks(s0) {
  const side = Math.random() < 0.7 ? 1 : -1;
  const count = Math.random() < 0.55 ? 1 : 2;
  const lanes = side > 0 ? [3, 2].slice(0, count) : [0, 1].slice(0, count);
  const lineX = side * (LANE_WIDTH * 2 - LANE_WIDTH * count); // lane line the cones keep to
  const taper = 90;
  const length = rand(450, 650);
  return {
    kind: 'works',
    side,
    lanes,
    s0,
    s1: s0 + taper,
    s2: s0 + taper + length,
    s3: s0 + taper + length + 45,
    innerX: lineX + side * 0.35,
    outerX: side * (ROAD_HALF_WIDTH - 0.5),
  };
}

// Broken-down car: half on the hard shoulder, half in the outside lane, hazards on, warning
// triangle 60 m behind it. Only the car itself is in the way.
function planBreakdown(s0) {
  const side = Math.random() < 0.8 ? 1 : -1;
  const lanes = side > 0 ? [3] : [0];
  const carX = side * 6.25;
  const width = 1.86;
  const length = 4.5;
  const triangleS = s0 - 60;
  return {
    kind: 'breakdown',
    side,
    lanes,
    s0: triangleS, // traffic moves over from the triangle on
    s1: s0,
    s2: s0 + length,
    s3: s0 + length,
    carS: s0 + length / 2,
    carX,
    innerX: carX - side * (width / 2),
    outerX: carX - side * (width / 2),
    width,
    length,
  };
}

// Common to both: a group in the scene and a set of instanced cones that can be knocked flying
class Closure {
  constructor(plan) {
    Object.assign(this, plan);
    this.group = new THREE.Group();
    this.items = []; // { object, s, x, yaw, y }
    this.cones = []; // { s, x, knocked, ox, oy, oz, vx, vy, vz, spin, tilt, rest }
    this.warned = false;
    this.ownDisposables = [];
  }

  addItem(object, s, x, yaw = 0, y = 0) {
    this.group.add(object);
    this.items.push({ object, s, x, yaw, y });
    return object;
  }

  addCone(s, x) {
    if (this.cones.length < MAX_CONES) {
      this.cones.push({ s, x, knocked: false, ox: 0, oy: 0, oz: 0, vx: 0, vy: 0, vz: 0, spin: 0, tilt: 0, tiltVel: 0, rest: false });
    }
  }

  buildConeMeshes() {
    const a = assets();
    const n = this.cones.length;
    this.coneMeshes = [new THREE.InstancedMesh(a.cone, a.orange, n), new THREE.InstancedMesh(a.band, a.white, n), new THREE.InstancedMesh(a.base, a.black, n)];
    for (const mesh of this.coneMeshes) {
      mesh.frustumCulled = false; // instances spread over a kilometre
      this.group.add(mesh);
    }
  }

  // Cone line x at road distance s (where the open lanes end), or null outside the closure
  edgeAt(s) {
    if (s < this.s1 && s >= this.s0 && this.kind === 'works') {
      return lerp(this.outerX, this.innerX, (s - this.s0) / (this.s1 - this.s0));
    }
    if (s >= this.s1 && s <= this.s2) return this.innerX;
    if (s > this.s2 && s <= this.s3 && this.s3 > this.s2) {
      return lerp(this.innerX, this.outerX, (s - this.s2) / (this.s3 - this.s2));
    }
    return null;
  }

  // Cones the car runs through fly off ahead of it and land in the closed lane
  knockCones(playerS, playerX, speedKmh) {
    const speed = speedKmh / 3.6;
    for (const cone of this.cones) {
      if (cone.knocked || Math.abs(cone.s - playerS) > 3.2 || Math.abs(cone.x - playerX) > 1.6) continue;
      cone.knocked = true;
      cone.vz = -speed * rand(0.55, 0.8); // forward is -z
      cone.vy = rand(2.5, 4.5);
      cone.vx = this.side * rand(1, 3);
      cone.spin = rand(-9, 9);
      cone.tiltVel = rand(6, 12);
    }
  }

  place(worldDistM, world, nowSec, night, dt) {
    const curveX = (z) => (world ? world.getCurveOffsetAtZ(z) : 0);
    const curveYaw = (z) => (world ? world.getCurveYawAtZ(z) : 0);
    const nearS = worldDistM - VISIBLE_BEHIND_M;
    const farS = worldDistM + VISIBLE_AHEAD_M;
    this.group.visible = this.s3 + 20 >= nearS && this.s0 - 700 <= farS;
    if (!this.group.visible) return;

    for (const item of this.items) {
      const z = worldDistM - item.s;
      const visible = item.s >= nearS && item.s <= farS;
      item.object.visible = visible;
      if (!visible) continue;
      item.object.position.set(item.x + curveX(z), item.y, z);
      item.object.rotation.y = item.yaw + curveYaw(z);
    }

    const a = assets();
    a.white.emissiveIntensity = night ? 0.55 : 0.15;
    a.orange.emissiveIntensity = night ? 0.3 : 0.12;
    a.stripes.emissiveIntensity = night ? 0.45 : 0.1;

    if (!this.coneMeshes) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const one = new THREE.Vector3(1, 1, 1);
    let shown = 0;
    for (const cone of this.cones) {
      if (cone.knocked && !cone.rest) {
        cone.vy -= 9.8 * dt;
        cone.vz *= Math.exp(-dt * 1.6);
        cone.vx *= Math.exp(-dt * 1.6);
        cone.ox += cone.vx * dt;
        cone.oy += cone.vy * dt;
        cone.oz += cone.vz * dt;
        cone.yawSpin = (cone.yawSpin || 0) + cone.spin * dt;
        cone.tilt = Math.min(Math.PI / 2, cone.tilt + cone.tiltVel * dt);
        if (cone.oy <= 0 && cone.vy < 0) {
          cone.oy = 0;
          cone.vy *= -0.25;
          if (Math.abs(cone.vy) < 0.6) {
            cone.rest = true;
            cone.tilt = Math.PI / 2;
          }
        }
      }
      const s = cone.s - cone.oz;
      if (s < nearS || s > farS) continue;
      const z = worldDistM - s;
      p.set(cone.x + cone.ox + curveX(z), cone.oy + (cone.tilt > 0 ? 0.12 : 0), z);
      e.set(0, curveYaw(z) + (cone.yawSpin || 0), cone.tilt, 'YXZ');
      q.setFromEuler(e);
      m.compose(p, q, one);
      for (const mesh of this.coneMeshes) mesh.setMatrixAt(shown, m);
      shown++;
    }
    for (const mesh of this.coneMeshes) {
      mesh.count = shown;
      mesh.instanceMatrix.needsUpdate = true;
    }

    this.animate(nowSec, night);
  }

  animate() {}

  dispose() {
    this.coneMeshes?.forEach((mesh) => mesh.dispose());
    for (const d of this.ownDisposables) d.dispose();
  }
}

class WorksClosure extends Closure {
  constructor(plan) {
    super(plan);
    const a = assets();
    const side = this.side;

    // Cones: along the taper every 6 m, along the closure every 12 m, back out every 9 m
    for (let s = this.s0; s < this.s1; s += 6) this.addCone(s, this.edgeAt(s) + side * CONE_RADIUS);
    for (let s = this.s1; s <= this.s2; s += 12) this.addCone(s, this.innerX + side * CONE_RADIUS);
    for (let s = this.s2 + 9; s <= this.s3; s += 9) this.addCone(s, this.edgeAt(s) + side * CONE_RADIUS);
    // A second row across the closed lanes where the taper ends
    const outer = side * (ROAD_HALF_WIDTH - 0.6);
    for (let x = this.innerX + side * 1.2; side * x < side * outer; x += side * 1.4) this.addCone(this.s1 + 4, x);
    this.buildConeMeshes();

    // Signs on the side being shut, behind the barrier: 500 m and 250 m before the taper
    const closedLanes = this.lanes;
    const signX = side * (ROAD_HALF_WIDTH + 1.5);
    for (const [distance, label] of [[500, '500 m'], [250, '250 m']]) {
      const tex = worksSignTexture(label, closedLanes);
      this.ownDisposables.push(tex);
      const sign = this.buildSign(tex);
      this.addItem(sign, this.s0 - distance, signX);
    }

    // Barricade boards and the arrow board trailer across the closed lanes, just past the taper
    const closedMid = (this.innerX + side * (ROAD_HALF_WIDTH - 0.4)) / 2;
    const closedWidth = Math.abs(side * (ROAD_HALF_WIDTH - 0.4) - this.innerX);
    this.addItem(this.buildBarricade(Math.min(closedWidth - 0.6, 6.4)), this.s1 + 10, closedMid);
    const arrowTex = arrowBoardTexture(side > 0);
    this.ownDisposables.push(arrowTex);
    this.arrowMat = new THREE.MeshBasicMaterial({ map: arrowTex });
    this.ownDisposables.push(this.arrowMat);
    this.addItem(this.buildArrowBoard(this.arrowMat), this.s1 + 16, LANE_CENTERS[this.lanes[0]]);

    // A works lorry (yellow, beacon on the cab) parked in the closed lane, hazards on
    const truck = createTrafficVehicle(
      { type: 'truck', width: 2.38, height: 3.15, length: 8.6 },
      7,
      0,
      0xf2b400
    );
    truck.setNight(false);
    parkWheels(truck.group, this.ownDisposables);
    this.truck = truck;
    this.beacon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), a.amberOff);
    this.beacon.position.set(0, 3.32, -3.6);
    truck.body.add(this.beacon);
    this.ownDisposables.push(this.beacon.geometry);
    this.addItem(truck.group, lerp(this.s1, this.s2, 0.45), LANE_CENTERS[this.lanes[0]]);
  }

  buildSign(texture) {
    const a = assets();
    const g = new THREE.Group();
    const boardMat = new THREE.MeshStandardMaterial({ map: texture, emissiveMap: texture, emissive: 0xffffff, emissiveIntensity: 0.25, roughness: 0.6 });
    this.ownDisposables.push(boardMat);
    this.signMats = [...(this.signMats || []), boardMat];
    const board = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), boardMat);
    board.position.y = 2.6;
    const back = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), a.post);
    back.position.set(0, 2.6, -0.01);
    back.rotation.y = Math.PI;
    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8);
    postGeo.translate(0, 1.3, -0.03);
    this.ownDisposables.push(board.geometry, back.geometry, postGeo);
    const left = new THREE.Mesh(postGeo, a.post);
    left.position.x = -0.8;
    const right = new THREE.Mesh(postGeo, a.post);
    right.position.x = 0.8;
    g.add(board, back, left, right);
    return g;
  }

  buildBarricade(width) {
    const a = assets();
    const g = new THREE.Group();
    const boardGeo = new THREE.BoxGeometry(width, 0.3, 0.05);
    const legGeo = new THREE.BoxGeometry(0.08, 1.15, 0.5);
    const lampGeo = new THREE.SphereGeometry(0.09, 10, 6);
    this.ownDisposables.push(boardGeo, legGeo, lampGeo);
    const stripes = a.stripes.clone();
    stripes.map = a.stripes.map.clone();
    stripes.map.repeat.set(width / 1.2, 1);
    stripes.map.wrapS = THREE.RepeatWrapping;
    stripes.map.needsUpdate = true;
    stripes.emissiveMap = stripes.map;
    this.ownDisposables.push(stripes, stripes.map);
    this.stripeMat = stripes;
    for (const y of [0.65, 1.05]) {
      const board = new THREE.Mesh(boardGeo, stripes);
      board.position.y = y;
      g.add(board);
    }
    this.barricadeLamps = [];
    for (const x of [-width / 2 + 0.1, width / 2 - 0.1]) {
      const leg = new THREE.Mesh(legGeo, a.black);
      leg.position.set(x, 0.575, 0);
      const lamp = new THREE.Mesh(lampGeo, a.amberOff);
      lamp.position.set(x, 1.3, 0);
      g.add(leg, lamp);
      this.barricadeLamps.push(lamp);
    }
    return g;
  }

  buildArrowBoard(material) {
    const a = assets();
    const g = new THREE.Group();
    const trailerGeo = new THREE.BoxGeometry(1.7, 0.5, 2.4);
    trailerGeo.translate(0, 0.55, 0);
    const mastGeo = new THREE.BoxGeometry(0.12, 1.6, 0.12);
    mastGeo.translate(0, 1.4, 0.3);
    const frameGeo = new THREE.BoxGeometry(2.3, 1.25, 0.12);
    frameGeo.translate(0, 2.65, 0.32);
    const faceGeo = new THREE.PlaneGeometry(2.1, 1.05);
    faceGeo.translate(0, 2.65, 0.39);
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 14);
    wheelGeo.rotateZ(Math.PI / 2);
    wheelGeo.translate(0, 0.3, 0.2);
    this.ownDisposables.push(trailerGeo, mastGeo, frameGeo, faceGeo, wheelGeo);
    const trailer = new THREE.Mesh(trailerGeo, a.stripes);
    const mast = new THREE.Mesh(mastGeo, a.black);
    const frame = new THREE.Mesh(frameGeo, a.black);
    const face = new THREE.Mesh(faceGeo, material);
    const wl = new THREE.Mesh(wheelGeo, a.black);
    wl.position.x = -0.95;
    const wr = new THREE.Mesh(wheelGeo, a.black);
    wr.position.x = 0.95;
    g.add(trailer, mast, frame, face, wl, wr);
    return g;
  }

  animate(nowSec, night) {
    const flash = Math.floor(nowSec * 1.6) % 2 === 0;
    this.arrowMat.color.setScalar(flash ? 1 : 0.12);
    const beacon = Math.floor(nowSec * 3) % 2 === 0;
    this.beacon.material = beacon ? assets().amber : assets().amberOff;
    for (const lamp of this.barricadeLamps) lamp.material = flash ? assets().amber : assets().amberOff;
    const hazard = Math.floor(nowSec * 3.5) % 2 === 0;
    this.truck.leftBlinker.visible = hazard;
    this.truck.rightBlinker.visible = hazard;
    if (this.truckNight !== night) {
      this.truckNight = night;
      this.truck.setNight(night);
    }
    for (const mat of this.signMats) mat.emissiveIntensity = night ? 0.7 : 0.25;
    if (this.stripeMat) this.stripeMat.emissiveIntensity = night ? 0.45 : 0.1;
  }

  dispose() {
    super.dispose();
    this.truck.bodyMat.dispose();
  }
}

class BreakdownClosure extends Closure {
  constructor(plan) {
    super(plan);
    const a = assets();
    const car = createTrafficVehicle({ type: 'sedan', width: this.width, height: 1.42, length: this.length }, 5, 1, 0x9aa1a8);
    car.setNight(false);
    car.setBraking(false);
    parkWheels(car.group, this.ownDisposables);
    this.car = car;
    // Stopped a little askew, nose towards the barrier
    this.addItem(car.group, this.carS, this.carX, this.side * 0.06);

    // Warning triangle on the road 60 m behind it, facing the oncoming traffic
    const triangle = new THREE.Mesh(a.triangle, a.red);
    triangle.rotation.x = -0.18;
    const holder = new THREE.Group();
    holder.add(triangle);
    this.addItem(holder, this.s0, LANE_CENTERS[this.lanes[0]] + this.side * 0.6);
    // and its driver's cones: three at an angle off the car's tail
    for (let i = 0; i < 3; i++) this.addCone(this.s1 - 14 + i * 4.5, this.carX - this.side * (1.6 - i * 0.45));
    this.buildConeMeshes();
  }

  // Only the car is in the way: from its tail to its nose
  edgeAt(s) {
    if (s < this.s1 || s > this.s2) return null;
    return this.innerX;
  }

  animate(nowSec, night) {
    const hazard = Math.floor(nowSec * 3.5) % 2 === 0;
    this.car.leftBlinker.visible = hazard;
    this.car.rightBlinker.visible = hazard;
    if (this.carNight !== night) {
      this.carNight = night;
      this.car.setNight(night);
    }
  }

  dispose() {
    super.dispose();
    this.car.bodyMat.dispose();
  }
}
