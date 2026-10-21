import * as THREE from 'three';
import { LANE_CENTERS } from './world.js';
import { createAmbulance, AMBULANCE_SPEC } from './vehicleModels.js';

// 112 ambulance event. Every couple of minutes of driving an ambulance comes up from behind with
// its siren on, in the lane of the player it reaches first. Traffic ahead of it makes way the same
// way it does for a Selektör flash. A player who keeps it stuck behind them loses points, one who
// makes way gets a bonus as it goes past. The host (or the single player) drives it and sends it
// along with the traffic snapshot; every device scores its own player.

const FIRST_CALL_SEC = [45, 75]; // seconds of driving before the first call
const NEXT_CALL_SEC = [100, 170]; // and between later calls
const MIN_CALL_SPEED_KMH = 60; // only dispatched while the players are actually on the move
const SPAWN_BEHIND_M = 140;
const CLOSE_IN_KMH = 34; // drives this much faster than the fastest player
const MIN_SPEED_KMH = 150;
const MAX_SPEED_KMH = 280;
const BRAKE_ZONE_M = 32; // starts matching the speed of whatever is in its way from here...
const FOLLOW_GAP_M = 9; // ...and keeps this much space to it
const STUCK_GAP_M = 22;
const YIELD_CALL_SEC = 0.5; // how often the traffic ahead of it is asked to make way
const GO_AROUND_SEC = 4.0; // held up this long: changes lane to get past
const LANE_CHANGE_MS = 3.2;
const DESPAWN_M = 240;

// The local player's part of a call
const WARN_AFTER_SEC = 0.8;
const PENALTY_AFTER_SEC = 3.0;
const BLOCK_RANGE_M = 24;
export const AMBULANCE_YIELD_BONUS = 1500;
export const AMBULANCE_BLOCK_PENALTY = 1000;

const HALF_W = AMBULANCE_SPEC.width / 2;
const HALF_L = AMBULANCE_SPEC.length / 2;
const PLAYER_HALF_W = 0.86;
const PLAYER_HALF_L = 1.85;

const randIn = ([lo, hi]) => lo + Math.random() * (hi - lo);
const clampLane = (lane) => Math.max(0, Math.min(3, Math.round(Number(lane) || 0)));

function nearestLane(x) {
  let best = 0;
  for (let l = 1; l < 4; l++) {
    if (Math.abs(LANE_CENTERS[l] - x) < Math.abs(LANE_CENTERS[best] - x)) best = l;
  }
  return best;
}

export class Ambulance {
  constructor(scene, traffic) {
    this.traffic = traffic;
    this.visual = createAmbulance();
    this.mesh = this.visual.group;
    this.mesh.visible = false;
    scene.add(this.mesh);

    this.active = false;
    this.x = LANE_CENTERS[0];
    this.lane = 0;
    this.targetLane = 0;
    this.z = 0; // relative to the local player, + is behind
    this.speedKmh = 0;
    this.worldDistM = 0; // guests dead-reckon from the host's synced distance
    this.isBraking = false;
    this.blinkerDir = 0;
    this.laneYaw = 0;
    this.urgent = false; // held up: the siren switches to the fast yelp
    this.stuckSec = 0;
    this.yieldCallIn = 0;
    this.beaconHalf = 0; // 0 = red half of the flash cycle, 1 = blue half

    this.firstCallSec = FIRST_CALL_SEC;
    this.drivingSec = 0;
    this.nextCallSec = randIn(this.firstCallSec);
    this.local = null; // this device's player during a call (see updateLocalPlayer)
  }

  // ?ambulans in the URL: the first call comes right away (for trying it out)
  setFirstCallDelay(sec) {
    this.firstCallSec = [sec, sec];
    this.nextCallSec = sec;
  }

  reset() {
    this.deactivate();
    this.drivingSec = 0;
    this.nextCallSec = randIn(this.firstCallSec);
  }

  activate() {
    this.active = true;
    this.mesh.visible = true;
    this.stuckSec = 0;
    this.yieldCallIn = 0;
    this.local = {
      announced: false,
      blockingSec: 0,
      warned: false,
      penalized: false,
      hit: false,
      passed: this.z < 0,
      noCollideUntil: 0,
      prevZ: this.z,
      prevDx: Infinity,
    };
  }

  deactivate() {
    this.active = false;
    this.mesh.visible = false;
    this.local = null;
    this.urgent = false;
    this.blinkerDir = 0;
    this.visual.setBeacons(false, false);
  }

  // Is it in (or moving into) the lane from aheadM in front of z to behindM behind it?
  // Traffic checks this before changing lanes.
  occupiesLane(lane, z, aheadM, behindM) {
    if (!this.active || (this.lane !== lane && this.targetLane !== lane)) return false;
    const dz = this.z - z;
    return dz > -aheadM && dz < behindM;
  }

  // ctx: { playerSpeedKmh, playerX, peers, mpContext, nowSec, blinkState, callbacks, world }
  update(dt, ctx) {
    const remote = this.traffic.isRemoteControlled;
    if (!remote && !this.active) this.dispatch(dt, ctx);
    if (!this.active) return; // off the road: nothing else runs

    if (remote) {
      // GUEST: dead-reckon toward the host's state, like the traffic cars
      this.worldDistM += (this.speedKmh / 3.6) * dt;
      const desiredZ = (ctx.mpContext?.localWorldDistM ?? 0) - this.worldDistM;
      this.z =
        Math.abs(this.z - desiredZ) > 22
          ? desiredZ
          : THREE.MathUtils.lerp(this.z, desiredZ, Math.min(1, dt * 18));
    } else {
      this.drive(dt, ctx);
      if (!this.active) return;
    }

    // Lane changes (same on every device)
    const targetX = LANE_CENTERS[this.targetLane];
    const dx = targetX - this.x;
    this.laneYaw = 0;
    if (Math.abs(dx) > 0.04) {
      this.x += Math.sign(dx) * Math.min(Math.abs(dx), dt * LANE_CHANGE_MS);
      this.laneYaw = -Math.sign(dx) * 0.06;
    } else {
      this.x = targetX;
      if (this.lane !== this.targetLane && !remote) {
        this.lane = this.targetLane;
        this.blinkerDir = 0;
      }
    }

    const world = ctx.world;
    this.mesh.position.set(this.x + (world ? world.getCurveOffsetAtZ(this.z) : 0), 0, this.z);
    this.mesh.rotation.y = this.laneYaw + (world ? world.getCurveYawAtZ(this.z) : 0);

    // Red half then blue half of every second, each a quick double flash
    const t = ctx.nowSec % 1;
    const k = t % 0.5;
    const lit = k < 0.1 || (k >= 0.18 && k < 0.28);
    this.beaconHalf = t < 0.5 ? 0 : 1;
    this.visual.setBeacons(lit && t < 0.5, lit && t >= 0.5);
    this.visual.setBraking(this.isBraking);
    this.visual.leftBlinker.visible = this.blinkerDir === -1 && ctx.blinkState;
    this.visual.rightBlinker.visible = this.blinkerDir === 1 && ctx.blinkState;

    this.updateLocalPlayer(dt, ctx);
  }

  // HOST: counts driving time and sends one in behind the player it will reach first
  dispatch(dt, { playerSpeedKmh, playerX, peers }) {
    let fastest = playerSpeedKmh;
    let rearX = playerX;
    let rearZ = 0;
    for (const p of peers) {
      fastest = Math.max(fastest, Number(p.speedKmh) || 0);
      if (p.relZ > rearZ) {
        rearZ = p.relZ;
        rearX = p.x;
      }
    }
    if (fastest < MIN_CALL_SPEED_KMH) return;
    this.drivingSec += dt;
    if (this.drivingSec < this.nextCallSec) return;

    this.drivingSec = 0;
    this.nextCallSec = randIn(NEXT_CALL_SEC);
    this.lane = this.targetLane = nearestLane(rearX);
    this.x = LANE_CENTERS[this.lane];
    this.z = rearZ + SPAWN_BEHIND_M;
    this.speedKmh = THREE.MathUtils.clamp(fastest + CLOSE_IN_KMH, MIN_SPEED_KMH, MAX_SPEED_KMH);
    this.blinkerDir = 0;
    this.isBraking = false;
    this.activate();
  }

  // HOST: drives faster than every player, slows down behind whatever is in its way (traffic is
  // asked to make way, players are expected to), and goes around if it stays held up
  drive(dt, ctx) {
    const players = [{ x: ctx.playerX, z: 0, speedKmh: ctx.playerSpeedKmh }];
    for (const p of ctx.peers) players.push({ x: p.x, z: p.relZ, speedKmh: Number(p.speedKmh) || 0 });
    let fastest = 0;
    let frontMostZ = 0;
    let rearMostZ = 0;
    for (const p of players) {
      fastest = Math.max(fastest, p.speedKmh);
      frontMostZ = Math.min(frontMostZ, p.z);
      rearMostZ = Math.max(rearMostZ, p.z);
    }
    let desiredKmh = THREE.MathUtils.clamp(fastest + CLOSE_IN_KMH, MIN_SPEED_KMH, MAX_SPEED_KMH);

    // Closest thing ahead of it in its path (traffic car or player)
    let gap = Infinity;
    let blockerZ = 0;
    let blockerHalfL = 0;
    let blockerKmh = 0;
    const consider = (x, z, halfW, halfL, kmh) => {
      if (Math.abs(x - this.x) > HALF_W + halfW + 0.2) return;
      const g = this.z - HALF_L - (z + halfL);
      if (g < -1 || g >= gap) return; // alongside or behind it
      gap = g;
      blockerZ = z;
      blockerHalfL = halfL;
      blockerKmh = kmh;
    };
    for (const car of this.traffic.vehicles) {
      if (car.active) consider(car.x, car.z, car.spec.width / 2, car.spec.length / 2, car.speedKmh);
    }
    for (const p of players) consider(p.x, p.z, PLAYER_HALF_W, PLAYER_HALF_L, p.speedKmh);

    if (gap < BRAKE_ZONE_M) {
      const t = THREE.MathUtils.clamp((gap - FOLLOW_GAP_M) / (BRAKE_ZONE_M - FOLLOW_GAP_M), 0, 1);
      desiredKmh = Math.min(desiredKmh, blockerKmh + (desiredKmh - blockerKmh) * t);
      if (gap < FOLLOW_GAP_M) desiredKmh = Math.min(desiredKmh, blockerKmh - 8 * (1 - gap / FOLLOW_GAP_M));
    }

    const rate = desiredKmh < this.speedKmh ? 5 : 1.2;
    this.speedKmh = Math.max(0, this.speedKmh + (desiredKmh - this.speedKmh) * Math.min(1, dt * rate));
    this.isBraking = desiredKmh < this.speedKmh - 3;
    this.z += ((ctx.playerSpeedKmh - this.speedKmh) / 3.6) * dt;

    // Never runs into what it follows, even if that brakes hard
    if (gap < Infinity) {
      const minZ = blockerZ + blockerHalfL + HALF_L + 1.0;
      if (this.z < minZ) {
        this.z = minZ;
        this.speedKmh = Math.min(this.speedKmh, blockerKmh);
      }
    }

    this.stuckSec = gap < STUCK_GAP_M ? this.stuckSec + dt : 0;
    this.urgent = this.stuckSec > 0.6;

    this.yieldCallIn -= dt;
    if (this.yieldCallIn <= 0) {
      this.yieldCallIn = YIELD_CALL_SEC;
      this.traffic.notifyHighBeamFlash(this.x, this.z, ctx.playerX, ctx.mpContext);
    }

    if (this.stuckSec > GO_AROUND_SEC && this.lane === this.targetLane) {
      for (const lane of [this.lane - 1, this.lane + 1]) {
        if (lane < 0 || lane > 3 || !this.laneIsFree(lane, players)) continue;
        this.targetLane = lane;
        this.blinkerDir = lane < this.lane ? -1 : 1;
        this.stuckSec = 0;
        break;
      }
    }

    if (this.z < frontMostZ - DESPAWN_M || this.z > rearMostZ + DESPAWN_M) this.deactivate();
  }

  laneIsFree(lane, players) {
    const laneX = LANE_CENTERS[lane];
    const inWindow = (z) => z > this.z - 30 && z < this.z + 12;
    for (const car of this.traffic.vehicles) {
      if (!car.active || (car.lane !== lane && car.targetLane !== lane)) continue;
      if (inWindow(car.z)) return false;
    }
    for (const p of players) {
      if (Math.abs(p.x - laneX) < 2.4 && inWindow(p.z)) return false;
    }
    return true;
  }

  // EVERY DEVICE: announce it, then warn / penalise while the local player holds it up, score the
  // bonus once it has gone past, and register the player driving into it
  updateLocalPlayer(dt, { playerX, nowSec, callbacks }) {
    const L = this.local;
    if (!L) return;
    const emit = (type) => callbacks?.onAmbulance?.({ type });

    if (!L.announced) {
      L.announced = true;
      if (!L.passed) emit('approach');
    }

    const dx = Math.abs(this.x - playerX);
    const inOurLane = dx < HALF_W + PLAYER_HALF_W - 0.25;
    const gapBehind = this.z - HALF_L - PLAYER_HALF_L; // between our rear bumper and its nose
    const blocking = !L.passed && inOurLane && gapBehind > -1 && gapBehind < BLOCK_RANGE_M;
    L.blockingSec = blocking ? L.blockingSec + dt : Math.max(0, L.blockingSec - dt * 2);
    if (!L.warned && L.blockingSec > WARN_AFTER_SEC) {
      L.warned = true;
      emit('warn');
    }
    if (!L.penalized && L.blockingSec > PENALTY_AFTER_SEC) {
      L.penalized = true;
      emit('blocked');
    }

    // A hit counts when we steer into its side or run into its back, not when it is the one
    // closing in from behind (that only happens on a guest, from network lag)
    const overlapL = HALF_L + PLAYER_HALF_L - 0.4;
    const overlapW = HALF_W + PLAYER_HALF_W - 0.16;
    if (
      nowSec > L.noCollideUntil &&
      Math.abs(this.z) < overlapL &&
      dx < overlapW &&
      (L.prevDx >= overlapW || L.prevZ < 0)
    ) {
      L.noCollideUntil = nowSec + 1.2;
      L.hit = true;
      emit('hit');
    }
    L.prevZ = this.z;
    L.prevDx = dx;

    if (!L.passed && this.z < -(HALF_L + PLAYER_HALF_L)) {
      L.passed = true;
      if (!L.penalized && !L.hit) emit('yielded');
    }
  }

  exportState(hostWorldDistM) {
    if (!this.active) return null;
    return {
      x: Number(this.x.toFixed(2)),
      lane: this.lane,
      targetLane: this.targetLane,
      worldDistM: Number((hostWorldDistM - this.z).toFixed(2)),
      speedKmh: Math.round(this.speedKmh),
      braking: this.isBraking ? 1 : 0,
      blinkerDir: this.blinkerDir,
      urgent: this.urgent ? 1 : 0,
    };
  }

  applyState(s, guestWorldDistM) {
    if (!s) {
      if (this.active) this.deactivate();
      return;
    }
    this.lane = clampLane(s.lane);
    this.targetLane = clampLane(s.targetLane);
    this.speedKmh = Number(s.speedKmh) || 0;
    this.isBraking = Boolean(s.braking);
    this.blinkerDir = Math.sign(Number(s.blinkerDir) || 0);
    this.urgent = Boolean(s.urgent);
    this.worldDistM = Number(s.worldDistM) || 0;
    const x = Number(s.x) || LANE_CENTERS[this.targetLane];
    const targetZ = guestWorldDistM - this.worldDistM;
    if (!this.active || Math.abs(this.z - targetZ) > 16) {
      this.z = targetZ;
      this.x = x;
      if (!this.active) this.activate();
    } else if (Math.abs(this.x - x) > 0.9) {
      this.x = THREE.MathUtils.lerp(this.x, x, 0.5);
    }
  }

  // For the proximity warning & MMI radar
  radarEntry(playerX) {
    return { x: this.x, relX: this.x - playerX, relZ: this.z };
  }
}
