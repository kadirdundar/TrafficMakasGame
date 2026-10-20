import * as THREE from 'three';
import { Peer } from 'peerjs';
import { WEATHER_PRESETS } from './world.js';
import { createLuxurySedan } from './vehicleModels.js';

const PEER_PREFIX = 'otoban-makas-v1-room-';

// Host-centred room: every guest connects only to the host. The host owns the traffic, relays
// everyone's car state to everyone else in one 'states' packet, and admits up to 3 guests.
export const MAX_PLAYERS = 4;
const HOST_ID = 'host';

// Heartbeat timeouts. A closed tab or killed app often never fires a WebRTC 'close' (and
// BroadcastChannel has none), so silence is what removes a player: the host drops a guest after
// 10 s (it is re-admitted automatically on its next packet, e.g. after returning to the app),
// and a guest leaves a host that has been silent for 20 s instead of driving in frozen traffic.
const GUEST_TIMEOUT_MS = 10000;
const HOST_TIMEOUT_MS = 20000;
// A frame gap this long means this tab itself was suspended: don't blame the others for it
const SUSPEND_GAP_MS = 5000;

// Per-slot paint & nameplate colour so every friend is recognisable (slot 0 = host)
export const SLOT_STYLES = [
  { paint: 0x0e6f9c, tag: '#10b981' },
  { paint: 0x8f1020, tag: '#f59e0b' },
  { paint: 0xe4e8ec, tag: '#38bdf8' },
  { paint: 0x17191f, tag: '#e879f9' },
];

// Everyone launches side by side, one lane each
export const SLOT_START_X = [-1.8, 1.8, -5.4, 5.4];

const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
    ],
  },
};

const cleanName = (name, fallback) => String(name || '').trim().slice(0, 14) || fallback;
const num = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

export class MultiplayerManager {
  constructor(scene, traffic, callbacks = {}) {
    this.scene = scene;
    this.traffic = traffic;
    this.callbacks = callbacks;

    this.role = null; // 'host' | 'guest' | null
    this.roomCode = null;
    this.connected = false; // host: at least one guest in the room; guest: welcomed by the host
    this.playerName = localStorage.getItem('otoban_player_name') || 'OYUNCU';
    this.localId = null;
    this.localSlot = 0;

    this.peer = null;
    this.hostConn = null; // guest's link to the host (host keeps one conn per player)
    this.bc = null; // BroadcastChannel for instant local multi-tab testing

    // Other players in the room, keyed by id (host side: guests; guest side: host + other guests)
    this.players = new Map();

    // Local & Remote Highway Progress (in meters from room sync)
    this.localWorldDistM = 0;
    this.sendAccum = 0;
    this.trafficSyncAccum = 0;
  }

  setPlayerName(name) {
    const clean = cleanName(name, 'OYUNCU');
    this.playerName = clean;
    localStorage.setItem('otoban_player_name', clean);
  }

  get playerCount() {
    return this.role ? this.players.size + 1 : 0;
  }

  getRemotePlayers() {
    return [...this.players.values()];
  }

  // ---------------------------------------------------------------------------------------------
  // Remote player cars
  // ---------------------------------------------------------------------------------------------

  drawNameplate(player) {
    const { ctx, texture } = player.badge;
    ctx.clearRect(0, 0, 512, 128);

    // Pill background
    ctx.fillStyle = 'rgba(6, 12, 24, 0.85)';
    ctx.strokeStyle = player.style.tag;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(16, 14, 480, 100, 26);
    ctx.fill();
    ctx.stroke();

    // Player Name
    ctx.fillStyle = player.style.tag;
    ctx.font = '900 34px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏁 ${player.name.toUpperCase()}`, 256, 56);

    // Speed & Combo
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 28px ui-monospace, monospace';
    ctx.fillText(`${Math.round(player.speedKmh)} KM/S  •  ${player.combo.toFixed(1)}x KOMBO`, 256, 96);

    texture.needsUpdate = true;
  }

  createPeerCarMesh(style) {
    // Procedural A8-style saloon is shown immediately; the real A8 glTF replaces it once
    // loaded (see loadA8Model), so a slow or failed download never leaves a friend invisible.
    const group = new THREE.Group();
    const fallback = createLuxurySedan({ paintHex: style.paint });
    group.add(fallback.group);

    // Floating Overhead Nameplate Sprite (one canvas per player)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
    const badgeSprite = new THREE.Sprite(spriteMat);
    badgeSprite.position.set(0, 2.35, 0);
    badgeSprite.scale.set(3.2, 0.8, 1);
    badgeSprite.renderOrder = 10;
    group.add(badgeSprite);

    const peerCar = {
      group,
      badge: { canvas, ctx: canvas.getContext('2d'), texture, spriteMat },
      active: fallback,
      lights: { night: false, braking: false, highBeam: false },
      setLights(lights) {
        peerCar.lights = lights;
        peerCar.active.setLights(lights);
      },
      swapModel(model) {
        fallback.group.visible = false;
        group.add(model.group);
        peerCar.active = model;
        model.setLights(peerCar.lights);
      },
    };
    return peerCar;
  }

  // Each friend gets their own optimized A8 (separate chunk + ~0.55 MB glb, fetched once and
  // then served from the HTTP cache); single-player never downloads it.
  loadA8Model(player) {
    import('./peerA8.js')
      .then((m) => m.loadA8PeerCar({ paintHex: player.style.paint }))
      .then((model) => {
        if (!player.removed) player.car.swapModel(model);
      })
      .catch((err) => {
        console.warn('A8 modeli yüklenemedi, yedek model kullanılıyor:', err);
      });
  }

  addRemotePlayer(id, name, slot) {
    const style = SLOT_STYLES[slot % SLOT_STYLES.length];
    const car = this.createPeerCarMesh(style);
    car.group.visible = false;
    this.scene.add(car.group);

    const player = {
      id,
      name: cleanName(name, `OYUNCU ${slot + 1}`),
      slot,
      style,
      conn: null,
      lastRecvTime: performance.now(),
      x: SLOT_START_X[slot] ?? 0,
      targetX: SLOT_START_X[slot] ?? 0,
      worldDistM: this.localWorldDistM,
      targetWorldDistM: this.localWorldDistM,
      speedKmh: 95,
      headingAngle: 0,
      bodyRoll: 0,
      highBeam: false,
      horn: false,
      braking: false,
      score: 0,
      combo: 1.0,
      relZ: 0,
      car,
      badge: car.badge,
      lastBadgeUpdate: 0,
      removed: false,
    };
    this.players.set(id, player);
    this.drawNameplate(player);
    this.loadA8Model(player);
    return player;
  }

  removeRemotePlayer(id, { notify = true } = {}) {
    const player = this.players.get(id);
    if (!player) return;
    player.removed = true;
    this.players.delete(id);
    this.scene.remove(player.car.group);
    player.badge.texture.dispose();
    player.badge.spriteMat.dispose();
    if (notify) this.callbacks.onPlayerLeft?.({ name: player.name });
  }

  removeAllPlayers() {
    for (const id of [...this.players.keys()]) this.removeRemotePlayer(id, { notify: false });
  }

  // ---------------------------------------------------------------------------------------------
  // Transport
  // ---------------------------------------------------------------------------------------------

  // Host: every guest link (+ BroadcastChannel). Guest: the host link (+ BroadcastChannel).
  broadcast(payload) {
    const packet = { ...payload, from: this.localId, senderRole: this.role };
    const conns = this.role === 'host' ? this.getRemotePlayers().map((p) => p.conn) : [this.hostConn];
    for (const conn of conns) {
      if (conn && conn.open) {
        try {
          conn.send(packet);
        } catch (_) {}
      }
    }
    if (this.bc) {
      try {
        this.bc.postMessage(packet);
      } catch (_) {}
    }
  }

  // Host -> one guest: over its WebRTC link if known, and over BroadcastChannel addressed by `to`
  sendTo(conn, toId, payload) {
    const packet = { ...payload, to: toId, from: this.localId, senderRole: this.role };
    if (conn && conn.open) {
      try {
        conn.send(packet);
      } catch (_) {}
    }
    if (this.bc) {
      try {
        this.bc.postMessage(packet);
      } catch (_) {}
    }
  }

  emitStatus(message, extra = {}) {
    this.callbacks.onStatusChange?.({
      connected: this.connected,
      connecting: Boolean(this.role) && !this.connected,
      role: this.role,
      roomCode: this.roomCode,
      playerCount: this.playerCount,
      maxPlayers: MAX_PLAYERS,
      message,
      ...extra,
    });
  }

  setupBroadcastChannel(code) {
    if (typeof BroadcastChannel === 'undefined') return;
    this.bc = new BroadcastChannel(`${PEER_PREFIX}${code}`);
    this.bc.onmessage = (ev) => this.handlePacket(ev.data, null);
  }

  disconnect({ silent = false } = {}) {
    // Tell the others first: a closing WebRTC link is noticed anyway, BroadcastChannel tabs are not
    if (this.role === 'host' && this.players.size > 0) this.broadcast({ type: 'room_closed' });
    if (this.role === 'guest' && this.connected) this.broadcast({ type: 'leave' });

    if (this._helloInterval) {
      clearInterval(this._helloInterval);
      this._helloInterval = null;
    }
    for (const conn of [this.hostConn, ...this.getRemotePlayers().map((p) => p.conn)]) {
      try {
        conn?.close();
      } catch (_) {}
    }
    this.hostConn = null;
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (_) {}
      this.peer = null;
    }
    if (this.bc) {
      try {
        this.bc.close();
      } catch (_) {}
      this.bc = null;
    }
    this.removeAllPlayers();
    this.connected = false;
    this.role = null;
    this.roomCode = null;
    this.localId = null;
    this.traffic.isRemoteControlled = false;
    if (!silent) this.emitStatus('Bağlantı kesildi.');
  }

  hostRoom(playerName) {
    this.disconnect({ silent: true });
    this.setPlayerName(playerName);
    this.role = 'host';
    this.localId = HOST_ID;
    this.localSlot = 0;
    this.roomCode = String(Math.floor(1000 + Math.random() * 9000));
    this.localWorldDistM = 0;
    this._matchStarted = false;

    // 1. Instant BroadcastChannel (works immediately when testing several tabs on one device)
    this.setupBroadcastChannel(this.roomCode);

    this.emitStatus(
      `⏳ Oda Kodu: ${this.roomCode} — Arkadaşların kodu girince oyun otomatik başlar (en fazla ${MAX_PLAYERS} kişi)!`
    );

    // 2. PeerJS WebRTC P2P for cross-device / mobile-to-PC / internet play
    try {
      this.peer = new Peer(`${PEER_PREFIX}${this.roomCode}`, PEER_CONFIG);

      this.peer.on('open', () => {
        if (!this.connected) {
          this.emitStatus(
            `✅ Oda Hazır! Kod: ${this.roomCode} — ${MAX_PLAYERS} kişiye kadar arkadaşın katılabilir.`
          );
        }
      });

      // The guest identifies itself with join_hello over this link; until then it is anonymous
      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => this.handlePacket(data, conn));
        conn.on('close', () => {
          const player = this.getRemotePlayers().find((p) => p.conn === conn);
          if (player) this.onGuestGone(player.id);
        });
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS Host Uyarısı:', err);
        if (err.type === 'unavailable-id') {
          // Retry with a fresh 4-digit code
          this.hostRoom(this.playerName);
        }
      });
    } catch (e) {
      console.warn('PeerJS başlatılamadı, yerel kanal aktif:', e);
    }

    return this.roomCode;
  }

  joinRoom(codeInput, playerName) {
    const cleanCode = String(codeInput || '').replace(/\D/g, '').slice(0, 4);
    if (cleanCode.length !== 4) {
      this.emitStatus('⚠️ Lütfen 4 haneli oda kodunu girin (Örn: 4829).');
      return false;
    }

    this.disconnect({ silent: true });
    this.setPlayerName(playerName);
    this.role = 'guest';
    this.localId = `g-${Math.random().toString(36).slice(2, 10)}`;
    this.roomCode = cleanCode;
    this.localWorldDistM = 0;
    this._matchStarted = false;
    this._welcomeReceived = false;

    this.emitStatus(`⏳ ${cleanCode} numaralı odaya bağlanılıyor, lütfen bekleyin...`);

    // 1. BroadcastChannel (instant if the host is another tab on this device)
    this.setupBroadcastChannel(cleanCode);

    // Say hello every 450 ms over whatever is up until the host welcomes us
    const sayHello = () => {
      if (this._welcomeReceived || this.role !== 'guest') {
        clearInterval(this._helloInterval);
        this._helloInterval = null;
        return;
      }
      this.broadcast({ type: 'join_hello', name: this.playerName });
    };
    sayHello();
    this._helloInterval = setInterval(sayHello, 450);

    // 2. PeerJS WebRTC connection (cross-device / internet / Wi-Fi)
    try {
      this.peer = new Peer(PEER_CONFIG);
      this.peer.on('open', () => {
        const conn = this.peer.connect(`${PEER_PREFIX}${cleanCode}`, { serialization: 'json' });
        this.hostConn = conn;
        conn.on('data', (data) => this.handlePacket(data, conn));
        conn.on('open', sayHello);
        conn.on('close', () => {
          if (this.hostConn === conn) this.onHostGone('⚠️ Oda kurucusu ayrıldı, bağlantı kapandı.');
        });
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS Join Uyarısı:', err);
        if (!this.connected && this.role === 'guest') {
          this.emitStatus(`❌ Oda (${cleanCode}) bulunamadı veya bağlantı hatası. Kodu kontrol edin.`, {
            connecting: false,
          });
        }
      });
    } catch (e) {
      console.warn('PeerJS bağlantı hatası:', e);
    }

    return true;
  }

  // ---------------------------------------------------------------------------------------------
  // Packets
  // ---------------------------------------------------------------------------------------------

  handlePacket(data, conn) {
    if (!data || typeof data !== 'object' || !this.role) return;
    if (data.from === this.localId) return; // our own BroadcastChannel echo
    if (data.to && data.to !== this.localId) return; // addressed to another tab

    if (this.role === 'host') {
      if (data.senderRole === 'guest' && typeof data.from === 'string') this.handleGuestPacket(data, conn);
    } else if (data.senderRole === 'host') {
      this.handleHostPacket(data);
    }
  }

  nextFreeSlot() {
    const used = new Set(this.getRemotePlayers().map((p) => p.slot));
    for (let s = 1; s < MAX_PLAYERS; s++) if (!used.has(s)) return s;
    return -1;
  }

  roster() {
    return [
      { id: HOST_ID, name: this.playerName, slot: 0 },
      ...this.getRemotePlayers().map((p) => ({ id: p.id, name: p.name, slot: p.slot })),
    ];
  }

  // ---- Host side ----

  handleGuestPacket(data, conn) {
    let player = this.players.get(data.from);

    // A state from an unknown guest is one that was timed out (e.g. its app was in the
    // background): treat it as a hello so it rejoins without any action from the player
    const isHello = data.type === 'join_hello';
    if (isHello || (!player && data.type === 'state')) {
      const isNew = !player;
      if (isNew) {
        const slot = this.nextFreeSlot();
        if (slot < 0) {
          this.sendTo(conn, data.from, { type: 'room_full', maxPlayers: MAX_PLAYERS });
          if (conn) setTimeout(() => conn.close(), 600);
          return;
        }
        if (!this._matchStarted) {
          // First friend: both start fresh from meter 0 with a new traffic field
          this.localWorldDistM = 0;
          this.traffic.resetTraffic();
        }
        player = this.addRemotePlayer(data.from, data.name, slot);
      }
      if (conn) player.conn = conn;
      player.lastRecvTime = performance.now();

      this.sendTo(player.conn, player.id, {
        type: 'host_welcome',
        hostDistM: this.localWorldDistM,
        name: this.playerName,
        slot: player.slot,
        roster: this.roster(),
        trafficSnapshot: this.traffic.exportSyncState(this.localWorldDistM),
      });

      if (isNew) {
        this.connected = true;
        this.broadcast({ type: 'roster', players: this.roster() });
        this.emitStatus(`🟢 Odada ${this.playerCount}/${MAX_PLAYERS} oyuncu — Kod: ${this.roomCode}`);
        if (!this._matchStarted) {
          this._matchStarted = true;
          this.callbacks.onMatchReady?.({ role: 'host', remoteName: player.name, slot: 0 });
        } else {
          this.callbacks.onPlayerJoined?.({ name: player.name });
        }
      }
      if (isHello) return;
    }

    if (!player) return;
    player.lastRecvTime = performance.now();
    if (conn && !player.conn) player.conn = conn;

    if (data.type === 'state') {
      const prevHighBeam = player.highBeam;
      this.applyState(player, data);
      // A guest just flashed Selektör: the host's authoritative traffic yields to them too
      if (player.highBeam && !prevHighBeam) this.yieldTrafficTo(data.x, data.worldDistM);
    } else if (data.type === 'peer_selektor') {
      this.yieldTrafficTo(data.x, data.worldDistM);
    } else if (data.type === 'peer_car_hit') {
      this.traffic.applyPeerCarHit(
        data.carId,
        this.localWorldDistM,
        num(data.carWorldDistM),
        num(data.speedKmh, 90)
      );
      this.trafficSyncAccum = 1.0;
    } else if (data.type === 'leave') {
      this.onGuestGone(player.id);
    }
  }

  yieldTrafficTo(x, worldDistM) {
    const relZ = this.localWorldDistM - num(worldDistM, this.localWorldDistM);
    if (this.traffic.notifyHighBeamFlash(num(x), relZ)) {
      this.trafficSyncAccum = 1.0; // Force immediate traffic sync broadcast
    }
  }

  onGuestGone(id) {
    if (!this.players.has(id)) return;
    this.removeRemotePlayer(id);
    this.connected = this.players.size > 0;
    this.broadcast({ type: 'roster', players: this.roster() });
    this.emitStatus(
      this.connected
        ? `🟢 Odada ${this.playerCount}/${MAX_PLAYERS} oyuncu — Kod: ${this.roomCode}`
        : `⏳ Herkes ayrıldı. Oda Kodu: ${this.roomCode} — yeni arkadaşlar katılabilir.`
    );
  }

  // ---- Guest side ----

  handleHostPacket(data) {
    this.hostLastRecv = performance.now();
    if (data.type === 'host_welcome') {
      if (this._welcomeReceived) return; // duplicate (same welcome over WebRTC + BroadcastChannel)
      this._welcomeReceived = true;
      this.localSlot = num(data.slot, 1);
      this.localWorldDistM = num(data.hostDistM); // Start side-by-side with the host at the exact same meter
      this.syncRoster(data.roster, { announce: false });
      if (data.trafficSnapshot) {
        this.traffic.applySyncState(data.trafficSnapshot, this.localWorldDistM);
        if (data.trafficSnapshot.weatherKey) {
          this.callbacks.onWeatherSync?.(data.trafficSnapshot.weatherKey);
        }
      }
      this.connected = true;
      this.emitStatus(`🟢 Bağlandı! Odada ${this.playerCount}/${MAX_PLAYERS} oyuncu — Oda: ${this.roomCode}`);
      if (!this._matchStarted) {
        this._matchStarted = true;
        this.callbacks.onMatchReady?.({
          role: 'guest',
          remoteName: cleanName(data.name, 'ODA KURUCUSU'),
          slot: this.localSlot,
        });
      }
      return;
    }

    if (data.type === 'room_full') {
      const code = this.roomCode;
      this.disconnect({ silent: true });
      this.emitStatus(`⛔ ${code} numaralı oda dolu (${num(data.maxPlayers, MAX_PLAYERS)}/${MAX_PLAYERS}).`);
      return;
    }

    if (!this._welcomeReceived) return;

    if (data.type === 'roster') {
      this.syncRoster(data.players, { announce: true });
      this.emitStatus(`🟢 Odada ${this.playerCount}/${MAX_PLAYERS} oyuncu — Oda: ${this.roomCode}`);
    } else if (data.type === 'states' && Array.isArray(data.players)) {
      for (const s of data.players) {
        if (!s || s.id === this.localId) continue;
        const player = this.players.get(s.id);
        if (player) this.applyState(player, s);
      }
    } else if (data.type === 'traffic') {
      this.traffic.applySyncState(data.snapshot, this.localWorldDistM);
      if (data.snapshot?.weatherKey) {
        this.callbacks.onWeatherSync?.(data.snapshot.weatherKey);
      }
    } else if (data.type === 'room_closed') {
      this.onHostGone('⚠️ Oda kurucusu odayı kapattı.');
    }
  }

  syncRoster(list, { announce }) {
    if (!Array.isArray(list)) return;
    const ids = new Set();
    for (const entry of list.slice(0, MAX_PLAYERS)) {
      if (!entry || typeof entry.id !== 'string' || entry.id === this.localId) continue;
      ids.add(entry.id);
      const existing = this.players.get(entry.id);
      if (existing) {
        existing.name = cleanName(entry.name, existing.name);
      } else {
        const player = this.addRemotePlayer(entry.id, entry.name, num(entry.slot, 1));
        if (announce) this.callbacks.onPlayerJoined?.({ name: player.name });
      }
    }
    for (const id of [...this.players.keys()]) {
      if (!ids.has(id)) this.removeRemotePlayer(id, { notify: announce });
    }
  }

  // End the whole guest session: 'room_closed' over one transport can overtake a packet still
  // in flight on the other, so nothing from this room may be processed afterwards
  onHostGone(message) {
    if (this.role !== 'guest') return;
    this.disconnect({ silent: true });
    this.emitStatus(message);
  }

  // ---- Shared ----

  applyState(player, d) {
    if (d.name) player.name = cleanName(d.name, player.name);
    player.targetX = num(d.x, player.targetX);
    player.targetWorldDistM = num(d.worldDistM, player.targetWorldDistM);
    player.speedKmh = num(d.speedKmh, player.speedKmh);
    player.headingAngle = num(d.headingAngle);
    player.bodyRoll = num(d.bodyRoll);
    player.highBeam = Boolean(d.highBeam);
    player.braking = Boolean(d.braking);
    player.score = num(d.score);
    player.combo = num(d.combo, 1.0);
    if (d.horn && !player.horn) this.callbacks.onPeerHorn?.({ name: player.name });
    player.horn = Boolean(d.horn);
  }

  notifyLocalSelektor(playerX) {
    if (!this.connected || this.role !== 'guest') return;
    this.broadcast({
      type: 'peer_selektor',
      x: Number(playerX.toFixed(2)),
      worldDistM: Number(this.localWorldDistM.toFixed(2)),
    });
  }

  notifyLocalCarHit(car) {
    if (!this.connected || this.role !== 'guest' || !car) return;
    this.broadcast({
      type: 'peer_car_hit',
      carId: car.id,
      carWorldDistM: Number((this.localWorldDistM - car.z).toFixed(2)),
      speedKmh: Math.round(car.speedKmh),
    });
  }

  getTrafficContext() {
    return {
      connected: this.connected,
      role: this.role,
      localWorldDistM: this.localWorldDistM,
      peers: this.getRemotePlayers().map((p) => ({ x: p.x, relZ: p.relZ, speedKmh: p.speedKmh })),
    };
  }

  // Teleport right behind the nearest friend if separated by a big gap; returns their name
  catchUpToPeer() {
    if (!this.connected) return null;
    let nearest = null;
    for (const p of this.players.values()) {
      if (!nearest || Math.abs(p.relZ) < Math.abs(nearest.relZ)) nearest = p;
    }
    if (!nearest || Math.abs(nearest.relZ) <= 12) return null;
    this.localWorldDistM = nearest.targetWorldDistM - 10; // Place 10m behind friend
    nearest.worldDistM = nearest.targetWorldDistM;
    return nearest.name;
  }

  localStatePacket(localState) {
    return {
      name: this.playerName,
      x: Number(localState.playerX.toFixed(2)),
      worldDistM: Number(this.localWorldDistM.toFixed(2)),
      speedKmh: Math.round(localState.speedKmh),
      headingAngle: Number(localState.headingAngle.toFixed(3)),
      bodyRoll: Number(localState.bodyRoll.toFixed(3)),
      highBeam: localState.highBeam,
      braking: localState.braking,
      horn: localState.horn,
      score: Math.floor(localState.score),
      combo: Number(localState.combo.toFixed(1)),
    };
  }

  update(dt, localState, world = null) {
    const speedMs = localState.speedKmh / 3.6;
    this.localWorldDistM += speedMs * dt;

    if (!this.role) return;

    // Heartbeat timeouts (see GUEST_TIMEOUT_MS / HOST_TIMEOUT_MS)
    const nowMs = performance.now();
    const wasSuspended = this._lastUpdateAt && nowMs - this._lastUpdateAt > SUSPEND_GAP_MS;
    this._lastUpdateAt = nowMs;
    if (this.role === 'host') {
      for (const p of this.getRemotePlayers()) {
        if (wasSuspended) p.lastRecvTime = nowMs;
        else if (nowMs - p.lastRecvTime > GUEST_TIMEOUT_MS) this.onGuestGone(p.id);
      }
    } else if (this.connected) {
      if (wasSuspended) this.hostLastRecv = nowMs;
      else if (nowMs - this.hostLastRecv > HOST_TIMEOUT_MS) {
        this.onHostGone(`⚠️ Oda kurucusundan (${this.roomCode}) 20 sn'dir veri gelmiyor, bağlantı kapandı.`);
        return;
      }
    }

    if (!this.connected) return;

    // 1. Send state at ~25 Hz. A guest sends its own car to the host; the host relays everyone's
    //    latest state (its own + every guest's) to all guests in a single packet.
    this.sendAccum += dt;
    if (this.sendAccum >= 0.04) {
      this.sendAccum = 0;
      if (this.role === 'guest') {
        this.broadcast({ type: 'state', ...this.localStatePacket(localState) });
      } else {
        const players = [{ id: HOST_ID, slot: 0, ...this.localStatePacket(localState) }];
        for (const p of this.players.values()) {
          players.push({
            id: p.id,
            slot: p.slot,
            name: p.name,
            x: p.targetX,
            worldDistM: Number(p.targetWorldDistM.toFixed(2)),
            speedKmh: p.speedKmh,
            headingAngle: p.headingAngle,
            bodyRoll: p.bodyRoll,
            highBeam: p.highBeam,
            braking: p.braking,
            horn: p.horn,
            score: p.score,
            combo: p.combo,
          });
        }
        this.broadcast({ type: 'states', players });
      }
    }

    // 2. Host broadcasts the authoritative traffic snapshot at ~20 Hz so everyone weaves
    //    through identical cars
    if (this.role === 'host') {
      this.trafficSyncAccum += dt;
      if (this.trafficSyncAccum >= 0.05) {
        this.trafficSyncAccum = 0;
        this.broadcast({
          type: 'traffic',
          snapshot: this.traffic.exportSyncState(this.localWorldDistM, world?.weatherKey),
        });
      }
    }

    // 3. Dead-reckon & interpolate every remote car
    const night = Boolean(WEATHER_PRESETS[world?.weatherKey]?.streetlightsOn);
    const now = performance.now();
    let packDistSum = this.localWorldDistM;
    for (const p of this.players.values()) {
      p.targetWorldDistM += ((p.speedKmh || 90) / 3.6) * dt;
      p.x = THREE.MathUtils.lerp(p.x, p.targetX, Math.min(1, dt * 14));
      if (Math.abs(p.worldDistM - p.targetWorldDistM) > 35) {
        p.worldDistM = p.targetWorldDistM;
      } else {
        p.worldDistM = THREE.MathUtils.lerp(p.worldDistM, p.targetWorldDistM, Math.min(1, dt * 10));
      }
      packDistSum += p.worldDistM;
    }

    // Soft rubber-banding toward the middle of the pack: anyone more than 165 m from it after a
    // crash is gently pulled back, so all cars stay within visual highway range
    const packCenterM = packDistSum / (this.players.size + 1);
    const gapToPackM = packCenterM - this.localWorldDistM; // + means the pack is ahead
    if (Math.abs(gapToPackM) > 165) {
      this.localWorldDistM += (Math.abs(gapToPackM) - 165) * 0.35 * Math.sign(gapToPackM) * dt;
    }

    for (const p of this.players.values()) {
      // Relative Z in the local scene (-Z is ahead of the local player, +Z is behind)
      const relZ = this.localWorldDistM - p.worldDistM;
      p.relZ = relZ;

      const curveX = world ? world.getCurveOffsetAtZ(relZ) : 0;
      const curveYaw = world ? world.getCurveYawAtZ(relZ) : 0;
      const group = p.car.group;
      group.visible = relZ > -290 && relZ < 65;
      group.position.set(p.x + curveX, 0, relZ);
      group.rotation.y = -p.headingAngle + curveYaw;
      group.rotation.z = p.bodyRoll;

      // Brake lights & High-Beam Selektör visuals
      p.car.setLights({ night, braking: p.braking, highBeam: p.highBeam });

      // Refresh the overhead nameplate every ~150 ms (only while it can be seen)
      if (group.visible && now - p.lastBadgeUpdate > 150) {
        p.lastBadgeUpdate = now;
        this.drawNameplate(p);
      }
    }
  }
}
