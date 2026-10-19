import * as THREE from 'three';
import { LANE_CENTERS } from './world.js';

const VEHICLE_PALETTE = [
  0xe2e8f0, // Pearl White
  0x1e293b, // Metallic Anthracite
  0x0f172a, // Obsidian Black
  0xdc2626, // Crimson Red
  0x2563eb, // Electric Blue
  0x94a3b8, // Silver Metallic
  0xf59e0b, // Taxi / Sport Yellow
  0x10b981, // Emerald Green
];

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

    // Track recent makas timestamp to detect "ÇİFT MAKAS / İĞNE DELİĞİ" (threading the needle between 2 cars)
    this.lastMakasTime = 0;
    this.lastMakasCarId = -1;

    this.initPool(24);
  }

  setDensity(mode) {
    this.densityMode = mode;
    if (mode === 'normal') this.maxVehicles = 12;
    else if (mode === 'heavy') this.maxVehicles = 18;
    else this.maxVehicles = 24;
  }

  createLicensePlateTexture() {
    if (this._plateTex) return this._plateTex;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 60);

    // Turkish EU Blue Strip on Left ("TR")
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(4, 4, 30, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TR', 19, 50);

    // Plate Number
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 34px ui-monospace, monospace';
    ctx.fillText('34 IST 34', 142, 45);

    this._plateTex = new THREE.CanvasTexture(canvas);
    this._plateTex.colorSpace = THREE.SRGBColorSpace;
    return this._plateTex;
  }

  createVehicleMesh(spec, paintHex) {
    const group = new THREE.Group();

    // High-gloss metallic automotive clearcoat-like paint
    const bodyMat = new THREE.MeshStandardMaterial({
      color: paintHex,
      roughness: 0.16,
      metalness: 0.82,
    });

    // Tinted automotive glass
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      roughness: 0.06,
      metalness: 0.94,
    });

    // Dark carbon/diffuser trim
    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x11141c,
      roughness: 0.65,
      metalness: 0.25,
    });

    // Chrome / Alloy wheel material
    const alloyMat = new THREE.MeshStandardMaterial({
      color: 0xdce4f0,
      roughness: 0.18,
      metalness: 0.92,
    });

    const lowerH = spec.type === 'truck' ? 1.05 : spec.height * 0.48;

    // 1. Main Sculpted Lower Body Beltline
    const lowerGeo = new THREE.BoxGeometry(spec.width * 0.96, lowerH, spec.length * 0.94);
    const lowerMesh = new THREE.Mesh(lowerGeo, bodyMat);
    lowerMesh.position.y = lowerH / 2 + 0.24;
    group.add(lowerMesh);

    // Wide Fender Flares / Side Shoulder Bulges (Gives cars an aggressive wide stance)
    const flareGeo = new THREE.BoxGeometry(spec.width * 1.01, lowerH * 0.62, spec.length * 0.86);
    const flareMesh = new THREE.Mesh(flareGeo, bodyMat);
    flareMesh.position.y = lowerH * 0.36 + 0.23;
    group.add(flareMesh);

    // Lower Black Side Skirts & Front/Rear Bumpers
    const skirtGeo = new THREE.BoxGeometry(spec.width * 0.99, 0.1, spec.length * 0.97);
    const skirtMesh = new THREE.Mesh(skirtGeo, darkTrimMat);
    skirtMesh.position.y = 0.23;
    group.add(skirtMesh);

    // 2. Cabin / Greenhouse (Aerodynamic Sloped Windshield & Fastback Rear Window)
    if (spec.type === 'truck') {
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.45,
        metalness: 0.25,
      });
      const cargoGeo = new THREE.BoxGeometry(spec.width, spec.height - 0.8, spec.length * 0.74);
      const cargoMesh = new THREE.Mesh(cargoGeo, boxMat);
      cargoMesh.position.set(0, (spec.height - 0.8) / 2 + 0.78, spec.length * 0.11);
      group.add(cargoMesh);

      // Aerodynamic Wind Deflector on Truck Cab Roof
      const cabGeo = new THREE.BoxGeometry(spec.width * 0.94, spec.height * 0.64, spec.length * 0.22);
      const cabMesh = new THREE.Mesh(cabGeo, bodyMat);
      cabMesh.position.set(0, spec.height * 0.34 + 0.52, -spec.length * 0.38);
      group.add(cabMesh);

      const windGlass = new THREE.Mesh(
        new THREE.BoxGeometry(spec.width * 0.88, 0.72, 0.08),
        glassMat
      );
      windGlass.position.set(0, 1.9, -spec.length * 0.49);
      windGlass.rotation.x = 0.15;
      group.add(windGlass);
    } else {
      const cabinH = spec.height * 0.44;
      const cabinW = spec.width * 0.82;
      const cabinL = spec.type === 'van' || spec.type === 'suv' ? spec.length * 0.62 : spec.length * 0.46;
      const cabinZ = spec.type === 'sport' ? 0.14 : 0.06;
      const cabinBaseY = lowerH + 0.2;

      // Central Tinted Glass Cabin Core
      const cabinCore = new THREE.Mesh(
        new THREE.BoxGeometry(cabinW, cabinH * 0.94, cabinL * 0.76),
        glassMat
      );
      cabinCore.position.set(0, cabinBaseY + cabinH * 0.47, cabinZ);
      group.add(cabinCore);

      // Sloped Front Windshield (Angled back at ~32 degrees)
      const frontWindshield = new THREE.Mesh(
        new THREE.BoxGeometry(cabinW * 0.96, cabinH * 1.05, 0.08),
        glassMat
      );
      frontWindshield.position.set(0, cabinBaseY + cabinH * 0.44, cabinZ - cabinL * 0.44);
      frontWindshield.rotation.x = 0.56;
      group.add(frontWindshield);

      // Sloped Rear Fastback Window (Angled forward)
      const rearSlopeAngle = spec.type === 'suv' || spec.type === 'van' ? -0.32 : -0.64;
      const rearWindow = new THREE.Mesh(
        new THREE.BoxGeometry(cabinW * 0.95, cabinH * 1.08, 0.08),
        glassMat
      );
      rearWindow.position.set(0, cabinBaseY + cabinH * 0.44, cabinZ + cabinL * 0.44);
      rearWindow.rotation.x = rearSlopeAngle;
      group.add(rearWindow);

      // Sloped Front Hood Nose Wedge
      const hoodWedge = new THREE.Mesh(
        new THREE.BoxGeometry(spec.width * 0.92, 0.14, spec.length * 0.32),
        bodyMat
      );
      hoodWedge.position.set(0, lowerH + 0.16, -spec.length * 0.31);
      hoodWedge.rotation.x = 0.09;
      group.add(hoodWedge);

      // Painted Roof Panel with Panoramic Black Glass Center & Shark-Fin Antenna
      const roofPanel = new THREE.Mesh(
        new THREE.BoxGeometry(cabinW * 0.94, 0.055, cabinL * 0.74),
        bodyMat
      );
      roofPanel.position.set(0, cabinBaseY + cabinH - 0.01, cabinZ);
      group.add(roofPanel);

      const sunroof = new THREE.Mesh(
        new THREE.BoxGeometry(cabinW * 0.72, 0.06, cabinL * 0.42),
        glassMat
      );
      sunroof.position.set(0, cabinBaseY + cabinH - 0.005, cabinZ - 0.05);
      group.add(sunroof);

      // Shark-Fin Roof Antenna
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.09, 0.18), bodyMat);
      fin.position.set(0, cabinBaseY + cabinH + 0.04, cabinZ + cabinL * 0.28);
      fin.rotation.x = -0.25;
      group.add(fin);

      // Side Wing Mirrors (Left & Right)
      [-1, 1].forEach((side) => {
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.11), bodyMat);
        mirror.position.set(side * (spec.width * 0.53), cabinBaseY + 0.08, cabinZ - cabinL * 0.34);
        group.add(mirror);
      });

      // Sport Rear Lip Spoiler (for Sport & Sedan)
      if (spec.type === 'sport' || spec.type === 'sedan') {
        const spoiler = new THREE.Mesh(
          new THREE.BoxGeometry(spec.width * 0.84, 0.045, 0.14),
          spec.type === 'sport' ? darkTrimMat : bodyMat
        );
        spoiler.position.set(0, lowerH + 0.25, spec.length * 0.44);
        spoiler.rotation.x = 0.18;
        group.add(spoiler);
      }
    }

    // 3. Detailed 5-Spoke Alloy Wheels & Tires
    const tireRadius = spec.type === 'truck' ? 0.44 : 0.35;
    const tireWidth = spec.type === 'truck' ? 0.28 : 0.25;
    const tireGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 20);
    tireGeo.rotateZ(Math.PI / 2);

    const rimGeo = new THREE.CylinderGeometry(tireRadius * 0.68, tireRadius * 0.68, tireWidth + 0.015, 16);
    rimGeo.rotateZ(Math.PI / 2);

    const hubCapGeo = new THREE.CylinderGeometry(tireRadius * 0.22, tireRadius * 0.22, tireWidth + 0.025, 12);
    hubCapGeo.rotateZ(Math.PI / 2);

    const wheelX = spec.width / 2 - 0.06;
    const wheelZ = spec.length * 0.32;
    [
      [-wheelX, wheelZ],
      [wheelX, wheelZ],
      [-wheelX, -wheelZ],
      [wheelX, -wheelZ],
    ].forEach(([wx, wz]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, tireRadius, wz);

      const tire = new THREE.Mesh(tireGeo, darkTrimMat);
      wheelGroup.add(tire);

      const rim = new THREE.Mesh(rimGeo, alloyMat);
      wheelGroup.add(rim);

      const cap = new THREE.Mesh(hubCapGeo, darkTrimMat);
      wheelGroup.add(cap);

      group.add(wheelGroup);
    });

    // 4. MODERN MATRIX LED TAIL LIGHTS & FULL-WIDTH LIGHTBAR (Rear face at +Z)
    const rearZ = spec.length * 0.47;
    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff112b });

    // Left & Right Sculpted LED Tail Light Clusters
    const tailClusterGeo = new THREE.BoxGeometry(spec.width * 0.28, 0.13, 0.06);
    const leftTail = new THREE.Mesh(tailClusterGeo, tailLightMat);
    leftTail.position.set(-spec.width * 0.31, lowerH * 0.8 + 0.22, rearZ);
    group.add(leftTail);

    const rightTail = new THREE.Mesh(tailClusterGeo, tailLightMat);
    rightTail.position.set(spec.width * 0.31, lowerH * 0.8 + 0.22, rearZ);
    group.add(rightTail);

    // Continuous Full-Width LED Lightbar connecting left & right tail lights (Audi/Porsche style!)
    const lightBar = new THREE.Mesh(
      new THREE.BoxGeometry(spec.width * 0.86, 0.036, 0.055),
      tailLightMat
    );
    lightBar.position.set(0, lowerH * 0.84 + 0.22, rearZ + 0.004);
    group.add(lightBar);

    // High-Mount Third Brake Strip at top of rear window
    const highBrake = new THREE.Mesh(
      new THREE.BoxGeometry(spec.width * 0.44, 0.028, 0.04),
      tailLightMat
    );
    highBrake.position.set(0, spec.height * 0.86, spec.length * 0.25);
    group.add(highBrake);

    // Rear Diffuser & Dual Chrome Exhaust Pipes
    const exhaustGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 12);
    exhaustGeo.rotateX(Math.PI / 2);
    [-spec.width * 0.3, spec.width * 0.3].forEach((ex) => {
      const pipe = new THREE.Mesh(exhaustGeo, alloyMat);
      pipe.position.set(ex, 0.24, rearZ + 0.02);
      group.add(pipe);
    });

    // Turkish License Plate ("34 IST 34")
    const plateMat = new THREE.MeshBasicMaterial({ map: this.createLicensePlateTexture() });
    const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.13), plateMat);
    plateMesh.position.set(0, 0.46, rearZ + 0.032);
    group.add(plateMesh);

    // 5. FRONT SINGLEFRAME GRILLE & MATRIX LED HEADLIGHTS (At -Z, visible in Rear-View Mirror!)
    const frontZ = -spec.length * 0.47;
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(spec.width * 0.48, lowerH * 0.56, 0.05),
      darkTrimMat
    );
    grille.position.set(0, lowerH * 0.48 + 0.2, frontZ);
    group.add(grille);

    const grilleChrome = new THREE.Mesh(
      new THREE.BoxGeometry(spec.width * 0.51, lowerH * 0.6, 0.04),
      alloyMat
    );
    grilleChrome.position.set(0, lowerH * 0.48 + 0.2, frontZ + 0.005);
    group.add(grilleChrome);

    const headLightMat = new THREE.MeshBasicMaterial({ color: 0xe8f4ff });
    const headGeo = new THREE.BoxGeometry(spec.width * 0.22, 0.11, 0.06);
    const leftHead = new THREE.Mesh(headGeo, headLightMat);
    leftHead.position.set(-spec.width * 0.34, lowerH * 0.72 + 0.2, frontZ);
    group.add(leftHead);

    const rightHead = new THREE.Mesh(headGeo, headLightMat);
    rightHead.position.set(spec.width * 0.34, lowerH * 0.72 + 0.2, frontZ);
    group.add(rightHead);

    // 6. Left & Right Amber Turn Signal Indicators (Blinkers)
    const leftBlinkerMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
    const rightBlinkerMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
    const blinkerGeo = new THREE.BoxGeometry(0.18, 0.065, 0.068);

    const leftBlinker = new THREE.Mesh(blinkerGeo, leftBlinkerMat);
    leftBlinker.position.set(-spec.width * 0.36, lowerH * 0.7 + 0.22, rearZ + 0.01);
    leftBlinker.visible = false;
    group.add(leftBlinker);

    const rightBlinker = new THREE.Mesh(blinkerGeo, rightBlinkerMat);
    rightBlinker.position.set(spec.width * 0.36, lowerH * 0.7 + 0.22, rearZ + 0.01);
    rightBlinker.visible = false;
    group.add(rightBlinker);

    return {
      group,
      bodyMat,
      tailLightMat,
      leftBlinker,
      rightBlinker,
    };
  }

  initPool(count) {
    for (let i = 0; i < count; i++) {
      const spec = VEHICLE_TYPES[i % VEHICLE_TYPES.length];
      const paint = VEHICLE_PALETTE[i % VEHICLE_PALETTE.length];
      const built = this.createVehicleMesh(spec, paint);

      const car = {
        id: i + 1,
        spec,
        mesh: built.group,
        bodyMat: built.bodyMat,
        tailLightMat: built.tailLightMat,
        leftBlinker: built.leftBlinker,
        rightBlinker: built.rightBlinker,
        lane: i % 4,
        targetLane: i % 4,
        x: LANE_CENTERS[i % 4],
        z: -45 - i * 22,
        syncWorldDistM: 45 + i * 22,
        hasSynced: false,
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
    const paint = VEHICLE_PALETTE[Math.floor(Math.random() * VEHICLE_PALETTE.length)];
    car.bodyMat.color.setHex(paint);

    car.mesh.position.set(car.x, 0, car.z);
    car.mesh.rotation.y = 0;
  }

  isLaneClear(car, candidateLane, marginZ = 15, playerX = null, peerState = null) {
    if (candidateLane < 0 || candidateLane > 3) return false;
    const candidateX = LANE_CENTERS[candidateLane];

    // Never swerve into the lane if the local player car is nearby in or near that lane
    if (playerX !== null && Math.abs(car.z) < 16) {
      if (Math.abs(candidateX - playerX) < 2.8) {
        return false;
      }
    }

    // Never swerve into the lane if the 2P friend's car is nearby in or near that lane
    if (peerState?.connected && Math.abs(car.z - peerState.relZ) < 16) {
      if (Math.abs(candidateX - peerState.x) < 2.8) {
        return false;
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
    car.z = hostWorldDistM - newCarWorldDistM;
    car.speedKmh = newSpeedKmh;
  }

  update(dt, playerSpeedKmh, playerX, callbacks, world = null, mpContext = null) {
    const nowSec = performance.now() / 1000;
    const blinkState = Math.floor(nowSec * 3.5) % 2 === 0;
    const isConnected = Boolean(mpContext?.connected);
    const activeTargetCount = isConnected
      ? Math.min(this.vehicles.length, this.maxVehicles + 4)
      : this.maxVehicles;

    const frontMostZ = isConnected ? Math.min(0, mpContext.peerRelZ || 0) : 0;
    const rearMostZ = isConnected ? Math.max(0, mpContext.peerRelZ || 0) : 0;

    for (let i = 0; i < this.vehicles.length; i++) {
      const car = this.vehicles[i];
      if (!this.isRemoteControlled) {
        car.active = i < activeTargetCount;
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
        car.tailLightMat.color.setHex(car.isBraking ? 0xff4455 : 0xd90429);
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

        // CRITICAL PROTECTION FOR GUEST: If this car is behind Guest (car.z > peerRelZ), do not rear-end Guest!
        if (
          isConnected &&
          car.z > mpContext.peerRelZ &&
          car.z < mpContext.peerRelZ + 30 &&
          Math.abs(car.x - mpContext.peerX) < 2.8
        ) {
          const maxPeerRearSpeed = Math.max(40, (mpContext.peerSpeedKmh || 90) - 14);
          if (car.speedKmh > maxPeerRearSpeed) {
            car.speedKmh = maxPeerRearSpeed;
            isBraking = true;
          }
        }

        car.isBraking = isBraking;
        car.tailLightMat.color.setHex(isBraking ? 0xff4455 : 0xd90429);

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

      // Follow 3D highway curve offset & tangent angle
      const curveX = world ? world.getCurveOffsetAtZ(car.z) : 0;
      const curveYaw = world ? world.getCurveYawAtZ(car.z) : 0;
      car.mesh.position.set(car.x + curveX, 0, car.z);
      car.mesh.rotation.y = laneChangeYaw + curveYaw;

      // 4. COLLISION & MAKAS (NEAR-MISS) DETECTION around Z = 0
      const absZ = Math.abs(car.z);
      const absX = Math.abs(car.x - playerX);

      // Check collision overlap (Only if car was ahead of or beside player, never from behind!)
      if (prevZ < 1.2 && absZ < halfL - 0.4 && absX < halfW - 0.16) {
        // Collision! Push traffic car ahead and trigger crash callback
        car.z = -halfL - 1.2;
        car.speedKmh = Math.max(50, playerSpeedKmh * 0.7);
        if (this.isRemoteControlled && mpContext) {
          car.syncWorldDistM = mpContext.localWorldDistM - car.z;
        }
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

      // 5. Respawn vehicle on Host only when it falls >42m behind BOTH players,
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
        car.bodyMat.color.setHex(s.colorHex);
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
