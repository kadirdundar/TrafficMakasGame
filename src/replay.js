import * as THREE from 'three';
import { createLuxurySedan } from './vehicleModels.js';
import { getCar, loadCarExterior } from './cars/index.js';
import { SLOT_STYLES } from './multiplayer.js';

// Maximum replay window: 10 seconds at up to 60 Hz = 600 frames
const MAX_DURATION_SEC = 10.0;
const BUFFER_SIZE = 620;

export const DRONE_ANGLES = [
  { key: 'fpv', label: '🚁 FPV Takip Drone' },
  { key: 'heli', label: '🦅 Helikopter (Kuşbakışı)' },
  { key: 'cinematic', label: '🎬 Sinematik Dinamik' },
];

export class DroneReplayManager {
  constructor(scene, renderer, world, traffic, multiplayer, sound, callbacks = {}) {
    this.scene = scene;
    this.renderer = renderer;
    this.world = world;
    this.traffic = traffic;
    this.multiplayer = multiplayer;
    this.sound = sound;
    this.callbacks = callbacks;

    // 1. Pre-allocated Ring Buffer (Zero GC pressure during live gameplay!)
    const maxTraffic = Math.max(24, this.traffic.vehicles.length);
    const maxPeers = 3;
    this.maxTraffic = maxTraffic;
    this.maxPeers = maxPeers;

    this.ring = new Array(BUFFER_SIZE);
    for (let i = 0; i < BUFFER_SIZE; i++) {
      this.ring[i] = {
        time: 0,
        dt: 0.016,
        worldDistM: 0,
        scrollOffset: 0,
        roadMode: 'highway',
        weatherKey: 'night',
        // Local player state
        px: 0,
        speedKmh: 0,
        rpm: 1000,
        gear: 3,
        throttle: 0,
        headingAngle: 0,
        bodyRoll: 0,
        bodyPitch: 0,
        highBeam: false,
        braking: false,
        carId: 'audi-a8',
        paintSlot: 0,
        parts: {},
        score: 0,
        combo: 1.0,
        // Traffic flat typed arrays: [x, z, yaw, active(0/1), braking(0/1), blinker(-1/0/1), colorHex]
        tX: new Float32Array(maxTraffic),
        tZ: new Float32Array(maxTraffic),
        tYaw: new Float32Array(maxTraffic),
        tFlags: new Int8Array(maxTraffic), // bit 0: active, bit 1: braking, bits 2-3: blinker (-1,0,1)
        tColor: new Int32Array(maxTraffic),
        // Online peers (only close tandem/chase peers recorded)
        peerCount: 0,
        peers: Array.from({ length: maxPeers }, () => ({
          id: '',
          name: '',
          slot: 1,
          carModel: 'audi-a8',
          parts: {},
          x: 0,
          relZ: 0,
          speedKmh: 0,
          headingAngle: 0,
          bodyRoll: 0,
          highBeam: false,
          braking: false,
          combo: 1.0,
        })),
        // Event popup triggered on this frame (if any)
        eventText: '',
        eventStyle: '',
      };
    }

    this.writeIdx = 0;
    this.frameCount = 0;
    this.simClock = 0;

    // SavedClips:
    // - bestClip: Automatically locked 10s highlight when an awesome Makas or Online Tandem Chase occurs
    // - latestClip: Built on-demand from the live ring buffer if the user pauses and wants to watch the last 10s
    this.bestClip = null;
    this.pendingCapture = null; // { countdownSec, rating, title, subtitle, isTandem, eventTime }
    this.tandemStreakSec = 0;
    this.lastEventBanner = { text: '', style: '', until: 0 };

    // Playback state
    this.active = false;
    this.playing = false;
    this.currentClip = null;
    this.playTime = 0;
    this.angleIndex = 0;
    this.lastAppliedIdx = -1;

    // Dedicated Drone Perspective Camera
    this.droneCamera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.2,
      420
    );
    this.camPos = new THREE.Vector3(0, 7, 14);
    this.camLook = new THREE.Vector3(0, 0.8, -12);

    // Local Player Exterior 3D Car Mesh (shown only during Drone Replay)
    this.playerCarGroup = new THREE.Group();
    this.playerCarGroup.visible = false;
    this.scene.add(this.playerCarGroup);
    this.playerFallback = createLuxurySedan({ paintHex: SLOT_STYLES[0].paint });
    this.playerCarGroup.add(this.playerFallback.group);
    this.playerActiveModel = this.playerFallback;
    this.loadedCarId = null;
    this.loadedPaintHex = SLOT_STYLES[0].paint;

    // Replay-only Peer Meshes (in case a peer left or we need standalone meshes during replay)
    this.replayPeers = Array.from({ length: maxPeers }, (_, i) => {
      const style = SLOT_STYLES[(i + 1) % SLOT_STYLES.length];
      const group = new THREE.Group();
      group.visible = false;
      const fallback = createLuxurySedan({ paintHex: style.paint });
      group.add(fallback.group);
      this.scene.add(group);
      return {
        group,
        fallback,
        activeModel: fallback,
        loadedCarId: null,
        paintHex: style.paint,
      };
    });

    // Video Recording State (MediaRecorder)
    this.isRecordingVideo = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  // Pre-warm or switch the local player's exterior 3D car model
  ensurePlayerExteriorModel(carId, paintSlot = 0, parts = {}) {
    const cleanId = getCar(carId).id;
    const paintHex = SLOT_STYLES[paintSlot % SLOT_STYLES.length]?.paint ?? SLOT_STYLES[0].paint;
    this.playerParts = parts;

    if (this.loadedCarId === cleanId) {
      this.playerActiveModel?.setParts?.(parts);
      if (this.loadedPaintHex !== paintHex && this.playerActiveModel?.bodyMat) {
        this.playerActiveModel.bodyMat.color.setHex(paintHex);
        this.loadedPaintHex = paintHex;
      }
      return;
    }

    this.loadedCarId = cleanId;
    this.loadedPaintHex = paintHex;
    loadCarExterior(cleanId, { paintHex })
      .then((model) => {
        if (this.loadedCarId !== cleanId) return;
        if (this.playerActiveModel && this.playerActiveModel !== this.playerFallback) {
          this.playerCarGroup.remove(this.playerActiveModel.group);
        }
        this.playerFallback.group.visible = false;
        this.playerCarGroup.add(model.group);
        this.playerActiveModel = model;
        model.setParts(this.playerParts);
      })
      .catch(() => {
        this.playerFallback.group.visible = true;
        this.playerActiveModel = this.playerFallback;
      });
  }

  ensureReplayPeerModel(slotIdx, carId, paintSlot, parts = {}) {
    const peerSlot = this.replayPeers[slotIdx];
    if (!peerSlot) return;
    const cleanId = getCar(carId).id;
    const paintHex = SLOT_STYLES[paintSlot % SLOT_STYLES.length]?.paint ?? SLOT_STYLES[1].paint;
    peerSlot.parts = parts;

    if (peerSlot.loadedCarId === cleanId) {
      peerSlot.activeModel?.setParts?.(parts);
      if (peerSlot.paintHex !== paintHex && peerSlot.activeModel?.bodyMat) {
        peerSlot.activeModel.bodyMat.color.setHex(paintHex);
        peerSlot.paintHex = paintHex;
      }
      return;
    }

    peerSlot.loadedCarId = cleanId;
    peerSlot.paintHex = paintHex;
    loadCarExterior(cleanId, { paintHex })
      .then((model) => {
        if (peerSlot.loadedCarId !== cleanId) return;
        if (peerSlot.activeModel && peerSlot.activeModel !== peerSlot.fallback) {
          peerSlot.group.remove(peerSlot.activeModel.group);
        }
        peerSlot.fallback.group.visible = false;
        peerSlot.group.add(model.group);
        peerSlot.activeModel = model;
        model.setParts(peerSlot.parts);
      })
      .catch(() => {
        peerSlot.fallback.group.visible = true;
        peerSlot.activeModel = peerSlot.fallback;
      });
  }

  // Called every physics step during live driving: O(1) typed-array copy, ~0.01ms CPU, 0 GC
  recordFrame(dt, state) {
    if (this.active) return;

    this.simClock += dt;
    const f = this.ring[this.writeIdx];
    f.time = this.simClock;
    f.dt = dt;
    f.worldDistM = this.world.worldDistM;
    f.scrollOffset = this.world.scrollOffset;
    f.roadMode = this.traffic.roadMode;
    f.weatherKey = this.world.weatherKey;

    f.px = state.playerX;
    f.speedKmh = state.speedKmh;
    f.rpm = state.rpm;
    f.gear = state.gear;
    f.throttle = state.throttle;
    f.headingAngle = state.headingAngle;
    f.bodyRoll = state.bodyRoll;
    f.bodyPitch = state.bodyPitch;
    f.highBeam = Boolean(state.highBeam);
    f.braking = Boolean(state.braking);
    f.carId = state.carId;
    f.paintSlot = state.paintSlot || 0;
    f.parts = state.parts || {};
    f.score = state.score;
    f.combo = state.combo;

    if (this.simClock < this.lastEventBanner.until) {
      f.eventText = this.lastEventBanner.text;
      f.eventStyle = this.lastEventBanner.style;
    } else {
      f.eventText = '';
      f.eventStyle = '';
    }

    // Copy traffic vehicle coordinates into pre-allocated typed arrays
    const vehicles = this.traffic.vehicles;
    const vLen = Math.min(this.maxTraffic, vehicles.length);
    for (let i = 0; i < vLen; i++) {
      const v = vehicles[i];
      f.tX[i] = v.x;
      f.tZ[i] = v.z;
      f.tYaw[i] = v.mesh.rotation.y;
      let flags = v.active ? 1 : 0;
      if (v.isBraking) flags |= 2;
      if (v.blinkerDir === -1) flags |= 4;
      else if (v.blinkerDir === 1) flags |= 8;
      f.tFlags[i] = flags;
      f.tColor[i] = v.bodyMat?.color?.getHex?.() ?? 0xffffff;
    }

    // Online Tandem / Chase detection:
    // Record peers that are driving close to the local player (tandem/peş peşe within 26 meters)
    let closePeerCount = 0;
    let bestTandemPeer = null;
    if (this.multiplayer?.connected) {
      const peers = this.multiplayer.getRemotePlayers();
      for (let i = 0; i < peers.length && closePeerCount < this.maxPeers; i++) {
        const p = peers[i];
        // Include peers within visual drone range (-45m ahead to +35m behind)
        if (Math.abs(p.relZ) <= 42) {
          const dst = f.peers[closePeerCount++];
          dst.id = p.id;
          dst.name = p.name;
          dst.slot = p.slot;
          dst.carModel = p.carModel;
          dst.parts = p.parts || {};
          dst.x = p.x;
          dst.relZ = p.relZ;
          dst.speedKmh = p.speedKmh;
          dst.headingAngle = p.headingAngle;
          dst.bodyRoll = p.bodyRoll;
          dst.highBeam = p.highBeam;
          dst.braking = p.braking;
          dst.combo = p.combo;

          // Check if two cars are driving closely one after another or side-by-side at speed ("peş peşe / tandem")
          if (
            state.speedKmh >= 100 &&
            (p.speedKmh || 0) >= 90 &&
            Math.abs(p.relZ) <= 22 &&
            Math.abs(p.x - state.playerX) <= 5.5
          ) {
            bestTandemPeer = p;
          }
        }
      }
    }
    f.peerCount = closePeerCount;

    this.writeIdx = (this.writeIdx + 1) % BUFFER_SIZE;
    if (this.frameCount < BUFFER_SIZE) this.frameCount++;

    // Track continuous online tandem / peş peşe driving to auto-trigger a highlight
    if (bestTandemPeer) {
      this.tandemStreakSec += dt;
      if (this.tandemStreakSec >= 1.2) {
        this.notifyHighlightEvent({
          kind: 'tandem',
          peerName: bestTandemPeer.name,
          speedKmh: state.speedKmh,
          combo: state.combo,
        });
        this.tandemStreakSec = 0;
      }
    } else {
      this.tandemStreakSec = Math.max(0, this.tandemStreakSec - dt * 0.5);
    }

    // Countdown for pending highlight capture (so the clip includes ~3.5s AFTER the makas too!)
    if (this.pendingCapture) {
      this.pendingCapture.countdownSec -= dt;
      if (this.pendingCapture.countdownSec <= 0) {
        this.commitPendingCapture();
      }
    }
  }

  // Triggered when a Makas, Sollama, or Online Tandem occurs
  notifyHighlightEvent(info) {
    if (this.active) return;

    const {
      kind,
      lateralGap = 0.8,
      speedKmh = 140,
      isRazorClose = false,
      isDoubleMakas = false,
      peerName = '',
      combo = 1.0,
    } = info;

    // Check if an online friend is currently right behind/ahead of us ("peş peşe")
    let hasTandemPeer = kind === 'tandem';
    let closePeerName = peerName;
    if (!hasTandemPeer && this.multiplayer?.connected) {
      const peers = this.multiplayer.getRemotePlayers();
      const closePeer = peers.find((p) => Math.abs(p.relZ) <= 24);
      if (closePeer) {
        hasTandemPeer = true;
        closePeerName = closePeer.name;
      }
    }

    // In online mode, only capture highlights when two cars are driving close together ("peş peşe / tandem")
    if (this.multiplayer?.connected && !hasTandemPeer) {
      return;
    }

    // Score the excitement of this moment
    let rating = (speedKmh / 100) * (1 + combo * 0.15);
    let title = '🚁 MAKAS ANLARI';
    let subtitle = `${Math.round(speedKmh)} KM/S`;

    if (isDoubleMakas) {
      rating *= 3.2;
      title = '🔥 ÇİFT MAKAS (İĞNE DELİĞİ)';
      subtitle = `${Math.round(lateralGap * 100)} CM • ${Math.round(speedKmh)} KM/S`;
    } else if (isRazorClose) {
      rating *= 2.2;
      title = `⚡ KUSURSUZ MAKAS (${Math.round(lateralGap * 100)} CM)`;
      subtitle = `${Math.round(speedKmh)} KM/S • ${combo.toFixed(1)}x KOMBO`;
    } else if (kind === 'karsi' || kind === 'sollama') {
      rating *= 2.0;
      title = kind === 'karsi' ? `😱 KARŞIDAN SIYIRMA (${Math.round(lateralGap * 100)} CM)` : '⚡ KIL PAYI SOLLAMA';
      subtitle = `${Math.round(speedKmh)} KM/S • ${combo.toFixed(1)}x KOMBO`;
    } else {
      rating *= Math.max(1.0, (1.7 - lateralGap) * 1.4);
      title = `⚡ YAKIN MAKAS (${Math.round(lateralGap * 100)} CM)`;
      subtitle = `${Math.round(speedKmh)} KM/S • ${combo.toFixed(1)}x KOMBO`;
    }

    if (hasTandemPeer) {
      rating *= 1.85; // Prioritize dual-car tandem clips in online mode
      title = isDoubleMakas
        ? `🏁 ${closePeerName} İLE ÇİFT MAKAS!`
        : `🤝 ${closePeerName} İLE PEŞ PEŞE MAKAS!`;
      subtitle = `İKİLİ DRONE ÇEKİMİ • ${Math.round(speedKmh)} KM/S`;
    }

    this.lastEventBanner = {
      text: title,
      style: isDoubleMakas || isRazorClose || hasTandemPeer ? 'gold' : 'normal',
      until: this.simClock + 2.4,
    };

    // If a capture is already pending or we beat the best clip rating (or bestClip is older/weaker), queue capture
    const currentBestRating = this.bestClip ? this.bestClip.rating * 0.88 : 0; // slight decay so fresh great makas can update it
    if (rating >= currentBestRating || !this.bestClip) {
      if (!this.pendingCapture || rating >= this.pendingCapture.rating) {
        this.pendingCapture = {
          countdownSec: 3.2, // Record 6.8s before + 3.2s after = 10.0s total clip!
          rating,
          title,
          subtitle,
          isTandem: hasTandemPeer,
          peakTime: this.simClock,
        };
      }
    }
  }

  // If the player pauses or crashes while a highlight is still in its 3.2s post-roll, commit immediately!
  flushPendingCapture() {
    if (this.pendingCapture) {
      this.commitPendingCapture();
    }
  }

  commitPendingCapture() {
    const cap = this.pendingCapture;
    this.pendingCapture = null;
    if (!cap || this.frameCount < 30) return;

    const frames = this.extractRecentFrames(MAX_DURATION_SEC);
    if (frames.length < 20) return;

    // In online mode, if the user specifically wants dual-car chase moments, verify the clip has tandem frames
    const duration = frames[frames.length - 1].time - frames[0].time;
    this.bestClip = {
      frames,
      duration: Math.max(0.5, duration),
      rating: cap.rating,
      title: cap.title,
      subtitle: cap.subtitle,
      isTandem: cap.isTandem,
      peakOffsetSec: Math.max(0, cap.peakTime - frames[0].time),
      createdAt: Date.now(),
    };
    this.callbacks.onClipAvailable?.(this.bestClip);
  }

  extractRecentFrames(maxSeconds = MAX_DURATION_SEC) {
    if (this.frameCount === 0) return [];
    const newestIdx = (this.writeIdx - 1 + BUFFER_SIZE) % BUFFER_SIZE;
    const endTime = this.ring[newestIdx].time;
    const minTime = endTime - maxSeconds;

    const temp = [];
    for (let i = 0; i < this.frameCount; i++) {
      const idx = (newestIdx - i + BUFFER_SIZE) % BUFFER_SIZE;
      const src = this.ring[idx];
      if (src.time < minTime) break;
      temp.push(this.cloneFrame(src));
    }
    temp.reverse();
    return temp;
  }

  cloneFrame(src) {
    return {
      time: src.time,
      dt: src.dt,
      worldDistM: src.worldDistM,
      scrollOffset: src.scrollOffset,
      roadMode: src.roadMode,
      weatherKey: src.weatherKey,
      px: src.px,
      speedKmh: src.speedKmh,
      rpm: src.rpm,
      gear: src.gear,
      throttle: src.throttle,
      headingAngle: src.headingAngle,
      bodyRoll: src.bodyRoll,
      bodyPitch: src.bodyPitch,
      highBeam: src.highBeam,
      braking: src.braking,
      carId: src.carId,
      paintSlot: src.paintSlot,
      parts: src.parts,
      score: src.score,
      combo: src.combo,
      tX: new Float32Array(src.tX),
      tZ: new Float32Array(src.tZ),
      tYaw: new Float32Array(src.tYaw),
      tFlags: new Int8Array(src.tFlags),
      tColor: new Int32Array(src.tColor),
      peerCount: src.peerCount,
      peers: src.peers.slice(0, src.peerCount).map((p) => ({ ...p })),
      eventText: src.eventText,
      eventStyle: src.eventStyle,
    };
  }

  // Returns true if there is a playable 10s clip (either a saved highlight or enough driving history)
  hasPlayableClip() {
    this.flushPendingCapture();
    if (this.multiplayer?.connected) {
      if (this.bestClip?.isTandem && this.bestClip.frames.length >= 20) return true;
      return this.hasRecentTandemFrames();
    }
    if (this.bestClip && this.bestClip.frames.length >= 20) return true;
    return this.frameCount >= 45;
  }

  hasRecentTandemFrames() {
    if (this.bestClip?.isTandem) return true;
    const newestIdx = (this.writeIdx - 1 + BUFFER_SIZE) % BUFFER_SIZE;
    let tandemCount = 0;
    const checkCount = Math.min(this.frameCount, BUFFER_SIZE);
    for (let i = 0; i < checkCount; i++) {
      const f = this.ring[(newestIdx - i + BUFFER_SIZE) % BUFFER_SIZE];
      if (f.peerCount > 0 && f.peers.some((p) => Math.abs(p.relZ) <= 24)) {
        tandemCount++;
        if (tandemCount >= 20) return true;
      }
    }
    return false;
  }

  getActiveClipMeta() {
    this.flushPendingCapture();
    if (this.multiplayer?.connected) {
      if (this.bestClip?.isTandem) return this.bestClip;
      if (this.hasRecentTandemFrames()) {
        return {
          title: '🤝 PEŞ PEŞE İKİLİ DRONE ÇEKİMİ (10 SN)',
          subtitle: 'İKİ ARAÇ YAKIN TAKİP KESİTİ HAZIR',
          isTandem: true,
        };
      }
      return null;
    }
    if (this.bestClip) return this.bestClip;
    if (this.frameCount >= 45) {
      return {
        title: '🚁 SON 10 SANİYE DRONE TEKRARI',
        subtitle: 'SÜRÜŞ KAYDI HAZIR',
        isTandem: false,
      };
    }
    return null;
  }

  // Starts the interactive 3D Drone Replay while the game is paused
  startReplay(cockpit) {
    this.flushPendingCapture();

    let clip = this.bestClip;
    if (this.multiplayer?.connected && clip && !clip.isTandem) {
      clip = null; // In online mode, only show clips where two cars were driving close together ("peş peşe")
    }
    if (!clip || clip.frames.length < 20) {
      const frames = this.extractRecentFrames(MAX_DURATION_SEC);
      if (frames.length < 15) return false;
      const hasPeer = frames.some((f) => f.peerCount > 0 && f.peers.some((p) => Math.abs(p.relZ) <= 24));
      if (this.multiplayer?.connected && !hasPeer) return false;
      const last = frames[frames.length - 1];
      clip = {
        frames,
        duration: Math.max(0.5, last.time - frames[0].time),
        rating: 1,
        title: hasPeer ? '🤝 PEŞ PEŞE İKİLİ SÜRÜŞ' : '🚁 SON 10 SANİYE SÜRÜŞÜ',
        subtitle: `${Math.round(last.speedKmh)} KM/S • DRONE KAMERASI`,
        isTandem: hasPeer,
        peakOffsetSec: Math.max(0, (last.time - frames[0].time) * 0.6),
      };
    }

    this.currentClip = clip;
    this.active = true;
    this.playing = true;
    this.playTime = 0;
    this.lastAppliedIdx = -1;
    this.cockpitRef = cockpit;

    // Save current live world & traffic state so we can restore it seamlessly when closing replay
    this.savedLiveState = {
      worldDistM: this.world.worldDistM,
      scrollOffset: this.world.scrollOffset,
      sceneryZ: this.world.sceneryItems.map((s) => s.position.z),
      cockpitVisible: cockpit?.group ? cockpit.group.visible : true,
      trafficState: this.traffic.vehicles.map((v) => ({
        x: v.x,
        z: v.z,
        yaw: v.mesh.rotation.y,
        active: v.active,
        visible: v.mesh.visible,
        braking: v.isBraking,
        leftBlinker: v.leftBlinker.visible,
        rightBlinker: v.rightBlinker.visible,
        colorHex: v.bodyMat?.color?.getHex?.() ?? 0xffffff,
      })),
      livePeersVisible: this.multiplayer
        ? this.multiplayer.getRemotePlayers().map((p) => ({ p, vis: p.car.group.visible }))
        : [],
    };

    // Hide first-person cockpit and live multiplayer meshes (replay drives its own synced meshes)
    if (cockpit?.group) cockpit.group.visible = false;
    const cockpitCanvas = document.getElementById('cockpit-canvas');
    if (cockpitCanvas) cockpitCanvas.classList.add('hidden');
    for (const item of this.savedLiveState.livePeersVisible) {
      item.p.car.group.visible = false;
    }

    // Prepare player exterior car model
    const firstFrame = clip.frames[0];
    this.ensurePlayerExteriorModel(firstFrame.carId, firstFrame.paintSlot, firstFrame.parts);
    this.playerCarGroup.visible = true;

    // Reset camera smoothing positions
    this.camPos.set(firstFrame.px, 6.5, 13.5);
    this.camLook.set(firstFrame.px, 0.9, -12);

    this.applyFrameAtTime(0, 0.016, true);
    return true;
  }

  stopReplay() {
    if (!this.active) return;
    if (this.isRecordingVideo) {
      this.stopVideoRecording();
    }

    this.active = false;
    this.playing = false;
    this.playerCarGroup.visible = false;
    for (const rp of this.replayPeers) {
      rp.group.visible = false;
    }

    // Restore live world, cockpit & traffic state
    const saved = this.savedLiveState;
    if (saved) {
      if (this.cockpitRef?.group) this.cockpitRef.group.visible = saved.cockpitVisible;
      const cockpitCanvas = document.getElementById('cockpit-canvas');
      if (cockpitCanvas) cockpitCanvas.classList.remove('hidden');

      this.world.scrollOffset = saved.scrollOffset;
      saved.sceneryZ.forEach((z, idx) => {
        if (this.world.sceneryItems[idx]) this.world.sceneryItems[idx].position.z = z;
      });
      this.world.update(0, 0, 0, false, saved.worldDistM);

      saved.trafficState.forEach((st, idx) => {
        const v = this.traffic.vehicles[idx];
        if (!v) return;
        v.x = st.x;
        v.z = st.z;
        v.active = st.active;
        v.mesh.visible = st.visible;
        v.mesh.position.set(st.x + this.world.getCurveOffsetAtZ(st.z), 0, st.z);
        v.mesh.rotation.y = st.yaw;
        v.visual.setBraking(st.braking);
        v.leftBlinker.visible = st.leftBlinker;
        v.rightBlinker.visible = st.rightBlinker;
        if (v.bodyMat?.color) v.bodyMat.color.setHex(st.colorHex);
      });

      for (const item of saved.livePeersVisible) {
        item.p.car.group.visible = item.vis;
      }
      this.savedLiveState = null;
    }

    this.sound?.updateEngine(900, 0, 0, true);
  }

  cycleAngle() {
    this.angleIndex = (this.angleIndex + 1) % DRONE_ANGLES.length;
    return DRONE_ANGLES[this.angleIndex];
  }

  setAngle(index) {
    this.angleIndex = ((index % DRONE_ANGLES.length) + DRONE_ANGLES.length) % DRONE_ANGLES.length;
    return DRONE_ANGLES[this.angleIndex];
  }

  togglePlay() {
    this.playing = !this.playing;
    if (!this.playing) {
      this.sound?.updateEngine(900, 0, 0, true);
    }
    return this.playing;
  }

  seekToRatio(ratio) {
    if (!this.currentClip) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    this.playTime = clamped * this.currentClip.duration;
    this.applyFrameAtTime(this.playTime, 0.016, true);
  }

  updateAndRender(dt) {
    if (!this.active || !this.currentClip) return;

    if (this.playing) {
      this.playTime += dt;
      if (this.playTime >= this.currentClip.duration) {
        if (this.isRecordingVideo) {
          // Automatically finish and download the video when the 10s clip finishes!
          this.stopVideoRecording();
        }
        this.playTime = 0;
        this.lastAppliedIdx = -1;
      }
    }

    this.applyFrameAtTime(this.playTime, dt, false);

    this.droneCamera.aspect = window.innerWidth / window.innerHeight;
    this.droneCamera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.droneCamera);
  }

  applyFrameAtTime(timeSec, dt, snapCamera = false) {
    const frames = this.currentClip.frames;
    if (!frames || frames.length === 0) return;

    const startTime = frames[0].time;
    const targetAbsTime = startTime + timeSec;

    // Binary search for frame pair [f0, f1]
    let lo = 0;
    let hi = frames.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (frames[mid].time <= targetAbsTime) lo = mid;
      else hi = mid;
    }

    const f0 = frames[lo];
    const f1 = frames[hi];
    const span = Math.max(0.0001, f1.time - f0.time);
    const alpha = Math.max(0, Math.min(1, (targetAbsTime - f0.time) / span));

    const worldDistM = THREE.MathUtils.lerp(f0.worldDistM, f1.worldDistM, alpha);
    const px = THREE.MathUtils.lerp(f0.px, f1.px, alpha);
    const speedKmh = THREE.MathUtils.lerp(f0.speedKmh, f1.speedKmh, alpha);
    const rpm = THREE.MathUtils.lerp(f0.rpm, f1.rpm, alpha);
    const headingAngle = THREE.MathUtils.lerp(f0.headingAngle, f1.headingAngle, alpha);
    const bodyRoll = THREE.MathUtils.lerp(f0.bodyRoll, f1.bodyRoll, alpha);
    const bodyPitch = THREE.MathUtils.lerp(f0.bodyPitch, f1.bodyPitch, alpha);

    // 1. Update Highway World Road Geometry & Scenery to match exact recorded meter
    const prevWorldDist = this.world.worldDistM;
    let deltaDist = worldDistM - prevWorldDist;
    if (snapCamera || Math.abs(deltaDist) > 60) {
      // Snap scenery segments cleanly into the [-315..45] window
      const spacing = 20;
      const totalSpan = this.world.sceneryItems.length * spacing;
      const modOffset = ((worldDistM % spacing) + spacing) % spacing;
      for (let i = 0; i < this.world.sceneryItems.length; i++) {
        let z = 40 - i * spacing + modOffset;
        if (z > 45) z -= totalSpan;
        this.world.sceneryItems[i].position.z = z;
      }
      deltaDist = 0;
    }

    this.world.scrollOffset = THREE.MathUtils.lerp(f0.scrollOffset, f1.scrollOffset, alpha);
    this.world.update(0.016, deltaDist / 0.016, px, f0.highBeam, worldDistM);

    // 2. Position Local Player Exterior 3D Car
    this.ensurePlayerExteriorModel(f0.carId, f0.paintSlot, f0.parts);
    const playerCurveX = this.world.getCurveOffsetAtZ(0);
    const playerCurveYaw = this.world.getCurveYawAtZ(0);
    this.playerCarGroup.position.set(px + playerCurveX, 0, 0);
    this.playerCarGroup.rotation.set(bodyPitch, -headingAngle + playerCurveYaw, bodyRoll);

    const night = Boolean(this.world.weatherKey !== 'day');
    this.playerActiveModel?.setLights?.({
      night,
      braking: f0.braking,
      highBeam: f0.highBeam,
    });

    // 3. Position All Traffic Vehicles
    const blinkState = Math.floor(timeSec * 4) % 2 === 0;
    const vLen = Math.min(this.traffic.vehicles.length, f0.tX.length);
    for (let i = 0; i < vLen; i++) {
      const car = this.traffic.vehicles[i];
      const flags = f0.tFlags[i];
      const isActive = (flags & 1) !== 0;
      car.mesh.visible = isActive;
      if (!isActive) continue;

      // Interpolate X & Z unless the vehicle respawned across a huge Z jump between frames
      const z0 = f0.tZ[i];
      const z1 = f1.tZ[i];
      const jump = Math.abs(z1 - z0) > 25;
      const cz = jump ? z0 : THREE.MathUtils.lerp(z0, z1, alpha);
      const cx = jump ? f0.tX[i] : THREE.MathUtils.lerp(f0.tX[i], f1.tX[i], alpha);
      const cyaw = jump ? f0.tYaw[i] : THREE.MathUtils.lerp(f0.tYaw[i], f1.tYaw[i], alpha);

      const curveX = this.world.getCurveOffsetAtZ(cz);
      const curveY = this.world.getElevationOffsetAtZ ? this.world.getElevationOffsetAtZ(cz) : 0;
      car.mesh.position.set(cx + curveX, curveY, cz);
      car.mesh.rotation.y = cyaw;

      const isBraking = (flags & 2) !== 0;
      const blinkLeft = (flags & 4) !== 0;
      const blinkRight = (flags & 8) !== 0;
      car.visual.setBraking(isBraking);
      car.leftBlinker.visible = blinkLeft && blinkState;
      car.rightBlinker.visible = blinkRight && blinkState;
      if (car.bodyMat?.color) {
        car.bodyMat.color.setHex(f0.tColor[i]);
      }

      // Trigger subtle whoosh sound when passing close to a car during replay
      if (this.playing && this.lastAppliedIdx !== lo && f0.tZ[i] <= 0.6 && f1.tZ[i] > 0.6) {
        const latGap = Math.abs(cx - px) - (car.spec.width / 2 + 0.86);
        if (latGap < 1.8) {
          this.sound?.playMakasWhoosh(f0.combo, latGap < 0.6, speedKmh, latGap < 0.7);
        }
      }
    }
    this.lastAppliedIdx = lo;

    // 4. Position Online Tandem Peer Cars (and compute bounding box for Dual-Car Drone Framing!)
    let minCarZ = 0;
    let maxCarZ = 0;
    let avgCarX = px;
    let carCount = 1;

    for (let i = 0; i < this.maxPeers; i++) {
      const rp = this.replayPeers[i];
      if (i >= f0.peerCount) {
        rp.group.visible = false;
        continue;
      }
      const p0 = f0.peers[i];
      const p1 = f1.peers.find((p) => p.id === p0.id) || p0;
      const peerX = THREE.MathUtils.lerp(p0.x, p1.x, alpha);
      const peerZ = THREE.MathUtils.lerp(p0.relZ, p1.relZ, alpha);
      const peerHeading = THREE.MathUtils.lerp(p0.headingAngle, p1.headingAngle, alpha);
      const peerRoll = THREE.MathUtils.lerp(p0.bodyRoll, p1.bodyRoll, alpha);

      this.ensureReplayPeerModel(i, p0.carModel, p0.slot, p0.parts);
      const cX = this.world.getCurveOffsetAtZ(peerZ);
      const cY = this.world.getElevationOffsetAtZ ? this.world.getElevationOffsetAtZ(peerZ) : 0;
      const cYaw = this.world.getCurveYawAtZ(peerZ);
      const cPitch = this.world.getElevationPitchAtZ ? this.world.getElevationPitchAtZ(peerZ) : 0;
      rp.group.visible = true;
      rp.group.position.set(peerX + cX, cY, peerZ);
      rp.group.rotation.set(cPitch, -peerHeading + cYaw, peerRoll);
      rp.activeModel?.setLights?.({
        night,
        braking: p0.braking,
        highBeam: p0.highBeam,
      });

      // Include peer in drone dual-car framing if within 28m
      if (Math.abs(peerZ) <= 28) {
        minCarZ = Math.min(minCarZ, peerZ);
        maxCarZ = Math.max(maxCarZ, peerZ);
        avgCarX += peerX;
        carCount++;
      }
    }
    avgCarX /= carCount;

    // 5. Compute Aerial Drone Camera Trajectory
    this.updateDroneCamera(timeSec, dt, {
      px,
      avgCarX,
      minCarZ,
      maxCarZ,
      hasTandem: carCount > 1,
      speedKmh,
      headingAngle,
      snapCamera,
    });

    // 6. Update Engine Audio & Replay UI Telemetry
    if (this.playing) {
      this.sound?.updateEngine(rpm, f0.throttle, speedKmh, false, 0);
    }

    this.callbacks.onFrameUpdate?.({
      playTime: timeSec,
      duration: this.currentClip.duration,
      speedKmh: Math.round(speedKmh),
      gear: f0.gear,
      combo: f0.combo,
      score: Math.floor(f0.score),
      eventText: f0.eventText,
      eventStyle: f0.eventStyle,
      isTandem: carCount > 1,
    });
  }

  updateDroneCamera(timeSec, dt, info) {
    const { px, avgCarX, minCarZ, maxCarZ, hasTandem, speedKmh, headingAngle, snapCamera } = info;
    const mode = DRONE_ANGLES[this.angleIndex]?.key || 'fpv';

    // Center Z between local player (z=0) and tandem peer (if online peş peşe)
    const centerZ = hasTandem ? (minCarZ + maxCarZ) * 0.5 : 0;
    const spreadZ = hasTandem ? Math.max(0, maxCarZ - minCarZ) : 0;
    const focusX = hasTandem ? THREE.MathUtils.lerp(px, avgCarX, 0.55) : px;
    const focusCurveX = this.world.getCurveOffsetAtZ(centerZ);

    // Subtle organic drone hover & banking
    const swayX = Math.sin(timeSec * 1.7) * 1.15 + Math.cos(timeSec * 0.85) * 0.45;
    const bobY = Math.sin(timeSec * 2.3) * 0.28;

    let targetPos = new THREE.Vector3();
    let targetLook = new THREE.Vector3();
    let targetRoll = 0;
    let targetFov = 52;

    if (mode === 'heli') {
      // High Helicopter Overhead Bird's-Eye View: crystal clear view of tight gaps between cars!
      const height = 16.5 + spreadZ * 0.45 + bobY;
      const backZ = Math.max(centerZ + 9.5, maxCarZ + 8.0);
      const camCurveX = this.world.getCurveOffsetAtZ(backZ);
      targetPos.set(focusX * 0.75 + camCurveX + swayX * 0.8, height, backZ);
      targetLook.set(
        focusX + this.world.getCurveOffsetAtZ(centerZ - 10),
        0.5,
        centerZ - 10
      );
      targetRoll = -headingAngle * 0.25 + Math.cos(timeSec * 1.4) * 0.025;
      targetFov = 48;
    } else if (mode === 'cinematic') {
      // Sweeping Diagonal Action Drone (orbits gently from side-rear to overhead)
      const orbit = Math.sin(timeSec * 0.65) * 4.2;
      const height = 6.2 + Math.cos(timeSec * 0.9) * 1.4 + spreadZ * 0.22;
      const backZ = Math.max(centerZ + 11.5, maxCarZ + 7.5);
      const camCurveX = this.world.getCurveOffsetAtZ(backZ);
      targetPos.set(focusX + orbit + camCurveX, height, backZ);
      targetLook.set(
        focusX + this.world.getCurveOffsetAtZ(minCarZ - 14),
        0.85,
        minCarZ - 14
      );
      targetRoll = -orbit * 0.022 - headingAngle * 0.35;
      targetFov = 50 + Math.min(8, Math.max(0, (speedKmh - 120) / 20));
    } else {
      // Default 'fpv': FPV Chase Drone following above & behind, framing both cars if online tandem
      const height = 5.4 + spreadZ * 0.25 + bobY;
      const backZ = Math.max(centerZ + 10.8, maxCarZ + 7.2);
      const camCurveX = this.world.getCurveOffsetAtZ(backZ);
      targetPos.set(focusX * 0.9 + camCurveX + swayX, height, backZ);
      targetLook.set(
        focusX + focusCurveX + Math.sin(headingAngle) * 3.5,
        0.95,
        minCarZ - 16
      );
      targetRoll = -headingAngle * 0.45 - Math.cos(timeSec * 1.7) * 0.035;
      targetFov = 54 + Math.min(7, Math.max(0, (speedKmh - 130) / 22));
    }

    if (snapCamera) {
      this.camPos.copy(targetPos);
      this.camLook.copy(targetLook);
    } else {
      const lerpRate = Math.min(1, dt * 8.5);
      this.camPos.lerp(targetPos, lerpRate);
      this.camLook.lerp(targetLook, lerpRate);
    }

    this.droneCamera.position.copy(this.camPos);
    this.droneCamera.up.set(Math.sin(targetRoll), Math.cos(targetRoll), 0);
    this.droneCamera.lookAt(this.camLook);
    this.droneCamera.fov = THREE.MathUtils.lerp(this.droneCamera.fov, targetFov, Math.min(1, dt * 6));
  }

  // =============================================================================================
  // Video Export / Download (Zero-overhead during driving; records directly from WebGL canvas)
  // =============================================================================================
  startVideoRecording() {
    if (this.isRecordingVideo || !this.active || !this.currentClip) return false;
    const canvas = this.renderer?.domElement;
    if (!canvas || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
      this.callbacks.onVideoStatus?.({
        recording: false,
        error: 'Tarayıcınız video kaydını desteklemiyor.',
      });
      return false;
    }

    try {
      // Restart clip from 0:00 so the downloaded video captures the full 10-second highlight cleanly
      this.playTime = 0;
      this.lastAppliedIdx = -1;
      this.playing = true;

      const stream = canvas.captureStream(60);
      const mimeTypes = [
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
      ];
      const mimeType = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      this.recordedChunks = [];
      this.mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
        : new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.isRecordingVideo = false;
        if (this.recordedChunks.length === 0) {
          this.callbacks.onVideoStatus?.({ recording: false });
          return;
        }
        const finalMime = this.mediaRecorder?.mimeType || mimeType || 'video/webm';
        const ext = finalMime.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(this.recordedChunks, { type: finalMime });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const stamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
        a.download = `otoban-makas-drone-${stamp}.${ext}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          a.remove();
          URL.revokeObjectURL(url);
        }, 4000);

        this.callbacks.onVideoStatus?.({
          recording: false,
          completed: true,
        });
      };

      this.mediaRecorder.start(200);
      this.isRecordingVideo = true;
      this.callbacks.onVideoStatus?.({ recording: true });
      return true;
    } catch (err) {
      console.warn('Drone video kaydı başlatılamadı:', err);
      this.isRecordingVideo = false;
      this.callbacks.onVideoStatus?.({
        recording: false,
        error: 'Video kaydı başlatılamadı.',
      });
      return false;
    }
  }

  stopVideoRecording() {
    if (!this.isRecordingVideo || !this.mediaRecorder) return;
    try {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    } catch (_) {}
    this.isRecordingVideo = false;
  }
}
