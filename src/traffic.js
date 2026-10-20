import * as THREE from 'three';
import { LANE_CENTERS, WEATHER_PRESETS } from './world.js';
import {
  createTrafficVehicle,
  applyPaint,
  paintForIndex,
  pickRandomPaint,
  setVehicleLightsNightMode,
} from './vehicleModels.js';

const VEHICLE_TYPES = [
  { type: 'sedan', width: 1.86, height: 1.42, length: 4.5, baseSpeedKmh: 105 },
  { type: 'sport', width: 1.92, height: 1.28, length: 4.4, baseSpeedKmh: 122 },
  { type: 'suv', width: 2.02, height: 1.72, length: 4.75, baseSpeedKmh: 98 },
  { type: 'van', width: 2.05, height: 2.08, length: 5.1, baseSpeedKmh: 88 },
  { type: 'truck', width: 2.38, height: 3.15, length: 8.6, baseSpeedKmh: 76 },
];

export class TrafficManager {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
    this.densityMode = 'heavy'; // 'normal' | 'heavy' | 'extreme'
    this.maxVehicles = 18;
    this.isRemoteControlled = false;
    this.nightLights = null; // Synced from world.weatherKey in update()

    // Track recent makas timestamp to detect "ÇİFT MAKAS / İĞNE DELİĞİ" (threading the needle between 2 cars)
    this.lastMakasTime = 0;
    this.lastMakasCarId = -1;

    this.initPool(24);
  }

  setNightLights(night) {
    this.nightLights = night;
    setVehicleLightsNightMode(night);
    for (const car of this.vehicles) car.visual.setNight(night);
  }

  setDensity(mode) {
    this.densityMode = mode;
    if (mode === 'normal') this.maxVehicles = 12;
    else if (mode === 'heavy') this.maxVehicles = 18;
    else this.maxVehicles = 24;
  }

  initPool(count) {
    for (let i = 0; i < count; i++) {
      const spec = VEHICLE_TYPES[i % VEHICLE_TYPES.length];
      const variant = Math.floor(i / VEHICLE_TYPES.length);
      const built = createTrafficVehicle(spec, i, variant, paintForIndex(i));

      const car = {
        id: i + 1,
        spec,
        mesh: built.group,
        bodyMat: built.bodyMat,
        visual: built,
        leftBlinker: built.leftBlinker,
        rightBlinker: built.rightBlinker,
        lane: i % 4,
        targetLane: i % 4,
        x: LANE_CENTERS[i % 4],
        z: -45 - i * 22,
        syncWorldDistM: 45 + i * 22,
        hasSynced: false,
        noCollideUntil: 0,
        pushRemainingZ: 0,
        localOverrideUntil: 0,
        isBraking: false,
        speedKmh: spec.baseSpeedKmh,
        targetSpeedKmh: spec.baseSpeedKmh,
        changingLaneTimer: 0,
        blinkerDir: 0, // -1 left, +1 right, 0 off
        overtaken: false,
        active: true,
      };

      car.mesh.position.set(car.x, 0, car.z);
      this.scene.add(car.mesh);
      this.vehicles.push(car);
    }

    this.resetTraffic();
  }

  resetTraffic() {
    this.isRemoteControlled = false;
    for (let i = 0; i < this.vehicles.length; i++) {
      const car = this.vehicles[i];
      car.active = i < this.maxVehicles;
      car.mesh.visible = car.active;
      car.hasSynced = false;
      this.respawnVehicle(car, -42 - i * 18);
    }
  }

  getLaneTargetSpeed(lane, spec) {
    // Lane 0 (Far Left Fast Lane): ~136 - 156 km/h
    // Lane 1 (Left-Center Lane):   ~112 - 128 km/h
    // Lane 2 (Right-Center Lane):  ~92 - 106 km/h
    // Lane 3 (Far Right Slow Lane): ~72 - 86 km/h
    const laneBaseSpeeds = [144, 118, 98, 78];
    const base = laneBaseSpeeds[lane] ?? 100;
    const typeOffset = spec.type === 'sport' ? 8 : spec.type === 'truck' ? -6 : 0;
    return base + typeOffset + (Math.random() * 10 - 5);
  }

  respawnVehicle(car, customZ = null, frontAnchorZ = 0) {
    // Trucks & vans stay in right lanes (2 or 3); sport/sedans prefer left lanes (0, 1, 2)
    let lane = Math.floor(Math.random() * 4);
    if (car.spec.type === 'truck') {
      lane = Math.random() < 0.8 ? 3 : 2;
    } else if (car.spec.type === 'van') {
      lane = Math.random() < 0.6 ? 3 : 2;
    } else if (car.spec.type === 'sport') {
      lane = Math.random() < 0.72 ? 0 : 1;
    } else if (car.spec.type === 'sedan') {
      lane = Math.random() < 0.45 ? 0 : Math.random() < 0.75 ? 1 : 2;
    }

    // Choose a Z position ahead of the leading player (-165m to -300m ahead of frontAnchorZ)
    let z = customZ !== null ? customZ : frontAnchorZ - 165 - Math.random() * 135;

    for (let attempt = 0; attempt < 10; attempt++) {
      const conflict = this.vehicles.some(
        (other) =>
          other !== car &&
          other.active &&
          other.targetLane === lane &&
          Math.abs(other.z - z) < 18
      );
      if (!conflict) break;
      // Keep trucks/vans in right lanes (2 or 3) when resolving spawn conflicts
      if (car.spec.type === 'truck' || car.spec.type === 'van') {
        lane = lane === 3 ? 2 : 3;
      } else {
        lane = (lane + 1) % 4;
      }
      z -= 15;
    }

    // Prevent all 4 lanes from being blocked at the exact same Z band (always leave a makas corridor!)
    const occupiedLanesAtZ = new Set(
      this.vehicles
        .filter((other) => other !== car && other.active && Math.abs(other.z - z) < 15)
        .map((other) => other.targetLane)
    );
    if (occupiedLanesAtZ.size >= 3 && occupiedLanesAtZ.has(lane)) {
      z -= 24;
    }

    car.lane = lane;
    car.targetLane = lane;
    car.x = LANE_CENTERS[lane];
    car.z = z;

    car.targetSpeedKmh = this.getLaneTargetSpeed(lane, car.spec);
    car.speedKmh = car.targetSpeedKmh;
    car.blinkerDir = 0;
    car.changingLaneTimer = 0;
    car.isBraking = false;
    car.overtaken = false;

    // Fresh random paint color for variety
    applyPaint(car.bodyMat, pickRandomPaint());

    car.mesh.position.set(car.x, 0, car.z);
    car.mesh.rotation.y = 0;
  }

  isLaneClear(car, candidateLane, marginZ = 15, playerX = null, mpContext = null) {
    if (candidateLane < 0 || candidateLane > 3) return false;
    const candidateX = LANE_CENTERS[candidateLane];

    // Never swerve into the lane if the local player car is nearby in or near that lane
    if (playerX !== null && Math.abs(car.z) < 16) {
      if (Math.abs(candidateX - playerX) < 2.8) {
        return false;
      }
    }

    // Never swerve into the lane if any friend's car is nearby in or near that lane
    if (mpContext?.connected) {
      for (const peer of mpContext.peers) {
        if (Math.abs(car.z - peer.relZ) < 16 && Math.abs(candidateX - peer.x) < 2.8) {
          return false;
        }
      }
    }

    return !this.vehicles.some(
      (other) =>
        other !== car &&
        other.active &&
        (other.lane === candidateLane || other.targetLane === candidateLane) &&
        Math.abs(other.z - car.z) < marginZ
    );
  }

  // Triggered when a player (Host or Guest) flashes Selektör (High-beam)!
  // Vehicles ahead of flasherZ (-85m to -8m) in the same lane signal and yield to an adjacent lane!
  notifyHighBeamFlash(flasherX, flasherZ = 0) {
    let anyYielded = false;
    for (const car of this.vehicles) {
      if (!car.active) continue;
      const relZToFlasher = car.z - flasherZ; // Negative means ahead of the flashing player
      if (relZToFlasher < -8 && relZToFlasher > -85 && Math.abs(car.x - flasherX) < 2.2) {
        const rightLane = car.targetLane + 1;
        if (rightLane <= 3 && this.isLaneClear(car, rightLane, 14, flasherX)) {
          car.targetLane = rightLane;
          car.targetSpeedKmh = this.getLaneTargetSpeed(rightLane, car.spec);
          car.blinkerDir = 1;
          car.changingLaneTimer = 1.6;
          anyYielded = true;
        } else if (car.targetLane > 0 && this.isLaneClear(car, car.targetLane - 1, 14, flasherX)) {
          car.targetLane = car.targetLane - 1;
          car.targetSpeedKmh = this.getLaneTargetSpeed(car.targetLane, car.spec);
          car.blinkerDir = -1;
          car.changingLaneTimer = 1.6;
          anyYielded = true;
        }
      }
    }
    return anyYielded;
  }

  // Apply collision impulse reported by Guest on Host's authoritative vehicle
  applyPeerCarHit(carId, hostWorldDistM, newCarWorldDistM, newSpeedKmh) {
    const car = this.vehicles.find((c) => c.id === carId);
    if (!car) return;
    // Slide it to where the guest shoved it instead of jumping there
    car.pushRemainingZ = hostWorldDistM - newCarWorldDistM - car.z;
    car.speedKmh = newSpeedKmh;
    car.noCollideUntil = performance.now() / 1000 + 1.2;
  }

  update(dt, playerSpeedKmh, playerX, callbacks, world = null, mpContext = null) {
    const nowSec = performance.now() / 1000;
    const blinkState = Math.floor(nowSec * 3.5) % 2 === 0;
    const isConnected = Boolean(mpContext?.connected);
    const activeTargetCount = isConnected
      ? Math.min(this.vehicles.length, this.maxVehicles + 4)
      : this.maxVehicles;

    // Night / dusk / rain: brighter LEDs + glow halos on every traffic car
    if (world) {
      const night = Boolean(WEATHER_PRESETS[world.weatherKey]?.streetlightsOn);
      if (night !== this.nightLights) this.setNightLights(night);
    }

    // Traffic has to cover the whole pack: from the leading player to the trailing one
    const peers = isConnected ? mpContext.peers : [];
    const frontMostZ = Math.min(0, ...peers.map((p) => p.relZ));
    const rearMostZ = Math.max(0, ...peers.map((p) => p.relZ));

    for (let i = 0; i < this.vehicles.length; i++) {
      const car = this.vehicles[i];
      if (!this.isRemoteControlled) {
        const shouldBeActive = i < activeTargetCount;
        // A car brought back into play (someone joined, density raised) starts far ahead of
        // the pack instead of reappearing wherever it was parked
        if (shouldBeActive && !car.active) this.respawnVehicle(car, null, frontMostZ);
        car.active = shouldBeActive;
        car.mesh.visible = car.active;
      }
      if (!car.active) continue;

      const prevZ = car.z;

      if (this.isRemoteControlled) {
        // GUEST MODE: Smooth 60 FPS dead-reckoning from Host's synchronized traffic state!
        car.syncWorldDistM += (car.speedKmh / 3.6) * dt;
        const guestWorldDistM = mpContext?.localWorldDistM ?? 0;
        const desiredZ = guestWorldDistM - car.syncWorldDistM;

        if (!car.hasSynced || Math.abs(car.z - desiredZ) > 22) {
          car.z = desiredZ;
          car.hasSynced = true;
          car.overtaken = car.z > 0.5;
        } else {
          car.z = THREE.MathUtils.lerp(car.z, desiredZ, Math.min(1, dt * 18));
        }

        // Smoothly interpolate speed toward targetSpeedKmh between packets
        car.speedKmh = THREE.MathUtils.lerp(car.speedKmh, car.targetSpeedKmh, dt * 1.5);
        car.visual.setBraking(car.isBraking);
      } else {
        // HOST / SINGLE-PLAYER AUTHORITATIVE SIMULATION:
        // 1. Check if there is a slower AI car directly ahead in the same lane
        let carAhead = null;
        let minDistAhead = 999;
        for (const other of this.vehicles) {
          if (other === car || !other.active) continue;
          if (other.targetLane === car.targetLane && other.z < car.z) {
            const dist = car.z - other.z;
            if (dist < minDistAhead) {
              minDistAhead = dist;
              carAhead = other;
            }
          }
        }

        let isBraking = false;
        if (carAhead && minDistAhead < 18) {
          // Either change lane with blinker or match speed and brake (only when well ahead of players)
          if (car.z < frontMostZ - 16 && car.lane === car.targetLane && Math.random() < 0.02) {
            const tryLeft = car.lane - 1;
            const tryRight = car.lane + 1;
            if (this.isLaneClear(car, tryLeft, 16, playerX, mpContext)) {
              car.targetLane = tryLeft;
              car.blinkerDir = -1;
              car.changingLaneTimer = 1.8;
            } else if (this.isLaneClear(car, tryRight, 16, playerX, mpContext)) {
              car.targetLane = tryRight;
              car.blinkerDir = 1;
              car.changingLaneTimer = 1.8;
            }
          }
          car.speedKmh = THREE.MathUtils.lerp(car.speedKmh, carAhead.speedKmh * 0.92, dt * 4);
          isBraking = true;
        } else {
          car.speedKmh = THREE.MathUtils.lerp(car.speedKmh, car.targetSpeedKmh, dt * 1.5);
        }

        // CRITICAL PROTECTION FOR HOST: If this car is behind Host (car.z > 0), do not rear-end Host!
        if (car.z > 0 && car.z < 30 && Math.abs(car.x - playerX) < 2.8) {
          const maxRearSpeed = Math.max(40, playerSpeedKmh - 14);
          if (car.speedKmh > maxRearSpeed) {
            car.speedKmh = maxRearSpeed;
            isBraking = true;
          }
        }

        // CRITICAL PROTECTION FOR GUESTS: a car right behind any guest must not rear-end them
        for (const peer of peers) {
          if (car.z > peer.relZ && car.z < peer.relZ + 30 && Math.abs(car.x - peer.x) < 2.8) {
            const maxPeerRearSpeed = Math.max(40, (peer.speedKmh || 90) - 14);
            if (car.speedKmh > maxPeerRearSpeed) {
              car.speedKmh = maxPeerRearSpeed;
              isBraking = true;
            }
          }
        }

        car.isBraking = isBraking;
        car.visual.setBraking(isBraking);

        // Relative longitudinal movement along Z (Host is at Z = 0)
        const relSpeedMs = (playerSpeedKmh - car.speedKmh) / 3.6;
        car.z += relSpeedMs * dt;
      }

      // 2. Smooth lateral lane changing & blinker lights (runs identically on Host & Guest!)
      const targetX = LANE_CENTERS[car.targetLane];
      const dx = targetX - car.x;
      let laneChangeYaw = 0;
      if (Math.abs(dx) > 0.04) {
        const moveStep = Math.sign(dx) * Math.min(Math.abs(dx), dt * 3.4);
        car.x += moveStep;
        laneChangeYaw = -Math.sign(dx) * 0.065;
      } else {
        car.x = targetX;
        car.lane = car.targetLane;
      }

      if (car.changingLaneTimer > 0) {
        car.changingLaneTimer -= dt;
        if (car.changingLaneTimer <= 0) car.blinkerDir = 0;
      }

      car.leftBlinker.visible = car.blinkerDir === -1 && blinkState;
      car.rightBlinker.visible = car.blinkerDir === 1 && blinkState;

      const halfL = car.spec.length / 2 + 1.85; // Player car half-length ~ 1.85m
      const halfW = car.spec.width / 2 + 0.86; // Player car half-width ~ 0.86m

      // Ensure a car that was already behind the local player (prevZ >= 1.2) never creeps forward into the player's rear bumper
      if (prevZ >= 1.2 && car.z < halfL + 1.5 && Math.abs(car.x - playerX) < halfW + 0.5) {
        car.z = halfL + 1.5;
        car.speedKmh = Math.max(35, playerSpeedKmh - 18);
        if (this.isRemoteControlled && mpContext) {
          car.syncWorldDistM = mpContext.localWorldDistM - car.z;
        }
      }

      // Collision shove: slide the remaining distance in ~0.25 s
      if (car.pushRemainingZ) {
        const step = car.pushRemainingZ * Math.min(1, dt * 12);
        car.pushRemainingZ = Math.abs(car.pushRemainingZ - step) < 0.05 ? 0 : car.pushRemainingZ - step;
        car.z += step;
        if (this.isRemoteControlled) car.syncWorldDistM -= step;
      }

      // Follow 3D highway curve offset & tangent angle
      const curveX = world ? world.getCurveOffsetAtZ(car.z) : 0;
      const curveYaw = world ? world.getCurveYawAtZ(car.z) : 0;
      car.mesh.position.set(car.x + curveX, 0, car.z);
      car.mesh.rotation.y = laneChangeYaw + curveYaw;

      // 4. COLLISION & MAKAS (NEAR-MISS) DETECTION around Z = 0
      const absZ = Math.abs(car.z);
      const absX = Math.abs(car.x - playerX);

      // Check collision overlap (Only if car was ahead of or beside player, never from behind!)
      if (nowSec > car.noCollideUntil && prevZ < 1.2 && absZ < halfL - 0.4 && absX < halfW - 0.16) {
        // Collision! The hit car is shoved ahead over a few frames (not teleported), can't count as
        // a new crash right away, and on a guest keeps its local position until the host has it too
        car.noCollideUntil = nowSec + 1.2;
        car.pushRemainingZ = -halfL - 1.2 - car.z;
        car.speedKmh = Math.max(50, playerSpeedKmh * 0.7);
        if (this.isRemoteControlled) car.localOverrideUntil = nowSec + 0.8;
        callbacks?.onCollision?.(car);
        car.overtaken = true;
      }

      // Check Makas (Near-Miss Overtake) when car crosses from ahead (z <= 0) to behind (z > 0)
      if (!car.overtaken && prevZ <= 0.5 && car.z > 0.5 && playerSpeedKmh >= 95) {
        car.overtaken = true;
        const lateralGap = absX - halfW; // Clear distance between mirrors

        // Makas threshold: passing within 1.65 meters of the vehicle!
        if (lateralGap >= -0.15 && lateralGap < 1.65) {
          const isRazorClose = lateralGap < 0.68 && playerSpeedKmh >= 135;
          const timeSinceLast = nowSec - this.lastMakasTime;
          const isDoubleMakas =
            timeSinceLast < 0.42 && this.lastMakasCarId !== car.id;

          this.lastMakasTime = nowSec;
          this.lastMakasCarId = car.id;

          callbacks?.onMakas?.({
            car,
            lateralGap: Math.max(0.08, lateralGap),
            speedKmh: playerSpeedKmh,
            isRazorClose,
            isDoubleMakas,
          });
        }
      }

      // 5. Respawn vehicle on Host only when it falls >42m behind EVERY player,
      // or gets >320m ahead of the leading player!
      if (!this.isRemoteControlled) {
        if (car.z > rearMostZ + 42) {
          this.respawnVehicle(car, null, frontMostZ);
        } else if (car.z < frontMostZ - 320) {
          this.respawnVehicle(car, frontMostZ - 160, frontMostZ);
        }
      }
    }
  }

  exportSyncState(hostWorldDistM, weatherKey = null) {
    const activeCount = Math.min(this.vehicles.length, this.maxVehicles + 4);
    return {
      densityMode: this.densityMode,
      weatherKey,
      cars: this.vehicles.slice(0, activeCount).map((c) => ({
        id: c.id,
        active: c.active,
        lane: c.lane,
        targetLane: c.targetLane,
        x: Number(c.x.toFixed(2)),
        worldDistM: Number((hostWorldDistM - c.z).toFixed(2)),
        speedKmh: Math.round(c.speedKmh),
        targetSpeedKmh: Math.round(c.targetSpeedKmh),
        blinkerDir: c.blinkerDir,
        braking: c.isBraking ? 1 : 0,
        colorHex: c.bodyMat.color.getHex(),
      })),
    };
  }

  applySyncState(snapshot, guestWorldDistM) {
    if (!snapshot || !Array.isArray(snapshot.cars)) return;
    const nowSec = performance.now() / 1000;
    this.isRemoteControlled = true;
    if (snapshot.densityMode && snapshot.densityMode !== this.densityMode) {
      this.setDensity(snapshot.densityMode);
    }

    for (let i = 0; i < this.vehicles.length; i++) {
      const s = snapshot.cars[i];
      const car = this.vehicles[i];
      if (!s || s.active === false) {
        car.active = false;
        car.mesh.visible = false;
        continue;
      }
      // Just shoved by our own crash: keep our position until the host's state includes it
      if (nowSec < car.localOverrideUntil) continue;

      car.active = true;
      car.mesh.visible = true;
      car.lane = s.lane;
      car.targetLane = s.targetLane;
      car.speedKmh = s.speedKmh;
      car.targetSpeedKmh = s.targetSpeedKmh;
      car.blinkerDir = s.blinkerDir;
      car.isBraking = Boolean(s.braking);
      if (s.blinkerDir !== 0 && car.changingLaneTimer <= 0) {
        car.changingLaneTimer = 1.0;
      }
      if (typeof s.colorHex === 'number') {
        applyPaint(car.bodyMat, s.colorHex);
      }

      car.syncWorldDistM = s.worldDistM;
      const targetZ = guestWorldDistM - s.worldDistM;

      // If car just respawned far ahead or this is the initial sync packet, snap immediately;
      // otherwise let 60 FPS update() smoothly track syncWorldDistM!
      if (!car.hasSynced || Math.abs(car.z - targetZ) > 16) {
        car.z = targetZ;
        car.x = s.x;
        car.overtaken = car.z > 0.5;
        car.hasSynced = true;
      } else if (Math.abs(car.x - s.x) > 0.9) {
        car.x = THREE.MathUtils.lerp(car.x, s.x, 0.5);
      }
    }
  }

  getRadarSnapshot(playerX) {
    const list = this.vehicles
      .filter((v) => v.active)
      .map((v) => ({
        x: v.x,
        relX: v.x - playerX,
        relZ: v.z,
      }));
    list.playerX = playerX;
    return list;
  }
}
