import * as THREE from 'three';
import { Peer } from 'peerjs';
import { WEATHER_PRESETS } from './world.js';
import { createLuxurySedan } from './vehicleModels.js';
import { DEFAULT_CAR_ID, getCar, loadCarExterior } from './cars/index.js';
import { DEFAULT_PLATE, PARTS, partOrNone } from './progression/config.js';
import { cleanPlate } from './progression/plate.js';
import { CarFire } from './carFire.js';

const PEER_PREFIX = 'otoban-makas-v1-room-';

// A car's parts as the flat fields of a state packet, each one checked against the catalogue
function remoteParts(d) {
  const parts = Object.fromEntries(Object.keys(PARTS).map((kind) => [kind, partOrNone(kind, d[kind])]));
  parts.plate = cleanPlate(d.plate) ?? DEFAULT_PLATE;
  return parts;
}

// Host-centred room: every guest connects only to the host. The host owns the traffic, relays
// everyone's car state to everyone else in one 'states' packet, and admits up to 3 guests.
// If the host goes away, the guest with the lowest slot takes over (see startMigration).
export const MAX_PLAYERS = 4;

// Heartbeat timeouts. A closed tab or killed app often never fires a WebRTC 'close' (and
// BroadcastChannel has none), so silence is what removes a player: the host drops a guest after
// 10 s (it is re-admitted automatically on its next packet, e.g. after returning to the app),
// and guests hand the room to a new host once the host has been silent for 8 s.
const GUEST_TIMEOUT_MS = 10000;
const MIGRATE_SILENCE_MS = 8000;
// A frame gap this long means this tab itself stalled or was suspended: restart the heartbeat
// clocks instead of blaming the others for the silence (never used to decide anything else)
const SUSPEND_GAP_MS = 5000;

// Host hand-over: give up on an elected host that has not answered after 12 s and elect the
// next one; guests get 6 s on top of the heartbeat timeout to reconnect to a new host
const MIGRATION_TIMEOUT_MS = 12000;
const HANDOVER_GRACE_MS = 6000;
// Joining by code tries host ids for epochs 0..5 (each host hand-over bumps the epoch)
const MAX_EPOCH_SCAN = 5;
const CONNECT_TIMEOUT_MS = 4000;

// Online match: a round is won by whoever is still driving when a rival crashes (and burns), or by
// pulling ROUND_GAP_M ahead of the next car. The first to MATCH_TARGET_POINTS wins the match.
// The host referees; everyone else follows the match state it sends with every 'states' packet.
export const MATCH_TARGET_POINTS = 5;
export const ROUND_GAP_M = 200;
const ROUND_BREAK_MS = 3800; // the round's result on screen before the next one starts
const MATCH_OVER_MS = 8000; // the winner on screen before a new match starts
const ROUND_GRACE_MS = 4000; // 3-2-1 and the first packets of the new round before anything counts
const ROUND_START_AHEAD_M = 250; // each round starts on fresh road, past the leader
const MATCH_PHASES = ['race', 'break', 'over'];

// Per-slot paint & nameplate colour so every friend is recognisable (slot 0 = host)
export const SLOT_STYLES = [
  { paint: 0xd6182c, tag: '#ff4d5e' }, // Tango Kırmızısı (Varsayılan)
  { paint: 0x0e6f9c, tag: '#38bdf8' }, // Navarra Mavisi
  { paint: 0xe4e8ec, tag: '#f8fafc' }, // Buzul Beyazı
  { paint: 0x17191f, tag: '#a855f7' }, // Mitos Siyahı
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

// The match state from the host, field by field (null when there is none)
function sanitizeMatch(m) {
  if (!m || typeof m !== 'object') return null;
  const scores = {};
  if (m.scores && typeof m.scores === 'object') {
    for (const [id, pts] of Object.entries(m.scores)) {
      if (Number.isFinite(Number(pts))) scores[id] = Math.max(0, Math.floor(Number(pts)));
    }
  }
  const idOrNull = (v) => (typeof v === 'string' ? v : null);
  return {
    seq: num(m.seq),
    round: num(m.round),
    phase: MATCH_PHASES.includes(m.phase) ? m.phase : 'race',
    scores,
    winnerId: idOrNull(m.winnerId),
    loserId: idOrNull(m.loserId),
    reason: m.reason === 'gap' || m.reason === 'crash' ? m.reason : null,
    startDistM: num(m.startDistM),
  };
}

const cleanName = (name, fallback) => String(name || '').trim().slice(0, 14) || fallback;
const num = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
const newPlayerId = () => `p-${Math.random().toString(36).slice(2, 10)}`;

export class MultiplayerManager {
  constructor(scene, traffic, callbacks = {}) {
    this.scene = scene;
    this.traffic = traffic;
    this.callbacks = callbacks;

    this.role = null; // 'host' | 'guest' | null
    this.roomCode = null;
    this.connected = false; // host: at least one guest in the room; guest: welcomed by the host
    this.playerName = localStorage.getItem('otoban_player_name') || 'OYUNCU';
    this.localCarModel = getCar(localStorage.getItem('otoban_selected_car')).id;
    const savedPaint = Number(localStorage.getItem('otoban_selected_paint') ?? 0);
    this.localPaintSlot = (Number.isFinite(savedPaint) && savedPaint >= 0 && savedPaint < SLOT_STYLES.length)
      ? savedPaint
      : 0;
    this.localParts = {}; // spoiler, rim colour and plate of our car (src/progression/profile.js → parts), sent with the state
    this.localId = null;
    this.localSlot = 0;
    this.hostId = null; // who hosts the room right now (changes on a hand-over)
    this.epoch = 0; // bumped on every host hand-over; packets from an older epoch are ignored

    this.peer = null;
    this.hostConn = null; // guest's link to the host (host keeps one conn per player)
    this.bc = null; // BroadcastChannel for instant local multi-tab testing

    // Other players in the room, keyed by id (host side: guests; guest side: host + other guests)
    this.players = new Map();

    // Rounds and points of the online match (see MATCH_TARGET_POINTS); null outside a room
    this.match = null;

    // Local & Remote Highway Progress (in meters from room sync)
    this.localWorldDistM = 0;
    this.sendAccum = 0;
    this.trafficSyncAccum = 0;

    // Page lifecycle: a hidden or frozen tab (app in the background) neither sends nor checks
    // timeouts, so the room may have changed hosts in the meantime (see onWake)
    this._asleepSince = null;
    this._lastWake = null;
    const sleep = () => {
      if (this._asleepSince !== null) return;
      this._asleepSince = performance.now();
      // Remembered now: on waking, link-closed events may empty the room before we look
      this._guestsAtSleep = this.role === 'host' ? this.players.size : 0;
    };
    const wake = () => {
      if (this._asleepSince === null) return;
      const sleptMs = performance.now() - this._asleepSince;
      this._asleepSince = null;
      this._lastWake = { at: performance.now(), sleptMs };
      this.onWake(sleptMs);
    };
    document.addEventListener('visibilitychange', () => (document.hidden ? sleep() : wake()));
    document.addEventListener('freeze', sleep);
    document.addEventListener('resume', wake);
  }

  // Back from the background after longer than the guests wait before handing the room over:
  // a host most likely lost its room, so it joins it again (as a guest of the new host)
  onWake(sleptMs) {
    if (sleptMs > MIGRATE_SILENCE_MS && this.role === 'host' && this._guestsAtSleep > 0) this.rejoinRoom();
  }

  justWokeFromLongSleep() {
    const w = this._lastWake;
    return Boolean(w) && performance.now() - w.at < 3000 && w.sleptMs > MIGRATE_SILENCE_MS;
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
    // Procedural saloon is shown immediately; the friend's real car model replaces it once
    // loaded (see loadPeerModel), so a slow or failed download never leaves a friend invisible.
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
      paintHex: style.paint,
      badge: { canvas, ctx: canvas.getContext('2d'), texture, spriteMat },
      active: fallback,
      lights: { night: false, braking: false, highBeam: false },
      parts: {},
      setLights(lights) {
        peerCar.lights = lights;
        peerCar.active.setLights(lights);
      },
      swapModel(model) {
        fallback.group.visible = false;
        group.add(model.group);
        peerCar.active = model;
        model.setLights(peerCar.lights);
        model.setParts?.(peerCar.parts);
        if (model.bodyMat && Number.isFinite(peerCar.paintHex)) {
          model.bodyMat.color.setHex(peerCar.paintHex);
        }
      },
      setParts(parts) {
        peerCar.parts = parts;
        peerCar.active.setParts?.(parts);
      },
      setPaint(paintHex) {
        peerCar.paintHex = paintHex;
        if (fallback.bodyMat) fallback.bodyMat.color.setHex(paintHex);
        if (peerCar.active && peerCar.active !== fallback && peerCar.active.bodyMat) {
          peerCar.active.bodyMat.color.setHex(paintHex);
        }
      },
    };
    return peerCar;
  }

  // Each friend gets their own optimized car model (separate chunk + glb, fetched once and
  // then served from the HTTP cache); single-player never downloads it.
  loadPeerModel(player) {
    const paintHex = player.style?.paint ?? SLOT_STYLES[player.paintSlot % SLOT_STYLES.length]?.paint;
    loadCarExterior(player.carModel, { paintHex })
      .then((model) => {
        if (!player.removed) {
          player.car.swapModel(model);
          if (model.bodyMat && Number.isFinite(paintHex)) {
            model.bodyMat.color.setHex(paintHex);
          }
        }
      })
      .catch((err) => {
        console.warn('Araç modeli yüklenemedi, yedek model kullanılıyor:', err);
      });
  }

  addRemotePlayer(id, name, slot, carModel = DEFAULT_CAR_ID, paintSlot = null) {
    const assignedPaintSlot = (paintSlot !== null && Number.isFinite(Number(paintSlot)))
      ? (Number(paintSlot) % SLOT_STYLES.length)
      : (slot % SLOT_STYLES.length);
    const slotStyle = SLOT_STYLES[slot % SLOT_STYLES.length];
    const paintHex = SLOT_STYLES[assignedPaintSlot].paint;
    const style = { paint: paintHex, tag: slotStyle.tag };
    const car = this.createPeerCarMesh(style);
    car.group.visible = false;
    this.scene.add(car.group);

    const player = {
      id,
      name: cleanName(name, `OYUNCU ${slot + 1}`),
      slot,
      paintSlot: assignedPaintSlot,
      carModel,
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
      burning: false,
      round: 0, // the match round its last state was sent in
      fire: null, // CarFire on its bonnet while it burns
      relZ: 0,
      car,
      badge: car.badge,
      lastBadgeUpdate: 0,
      removed: false,
    };
    this.players.set(id, player);
    this.drawNameplate(player);
    this.loadPeerModel(player);
    return player;
  }

  removeRemotePlayer(id, { notify = true } = {}) {
    const player = this.players.get(id);
    if (!player) return;
    player.removed = true;
    this.players.delete(id);
    this.scene.remove(player.car.group);
    player.fire?.dispose();
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
    const packet = { ...payload, from: this.localId, senderRole: this.role, epoch: this.epoch };
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
    const packet = { ...payload, to: toId, from: this.localId, senderRole: this.role, epoch: this.epoch };
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

  // The host's PeerJS id. Every host hand-over bumps the epoch, so a new host never has to wait
  // for the old (possibly still registered) id to be released. Epoch 0 is the plain room code.
  hostPeerId(code, epoch) {
    return `${PEER_PREFIX}${code}${epoch > 0 ? `-e${epoch}` : ''}`;
  }

  closeLink(conn) {
    try {
      conn?.close();
    } catch (_) {}
  }

  stopTimers() {
    clearInterval(this._helloInterval);
    clearTimeout(this._connectTimer);
    this._helloInterval = null;
    this._connectTimer = null;
  }

  disconnect({ silent = false, notifyOthers = true } = {}) {
    // Tell the others first: a closing WebRTC link is noticed anyway, BroadcastChannel tabs are not
    if (notifyOthers && this.role === 'host' && this.players.size > 0) this.broadcast({ type: 'host_left' });
    if (notifyOthers && this.role === 'guest' && this.connected) this.broadcast({ type: 'leave' });

    this.stopTimers();
    for (const conn of [this.hostConn, ...this.getRemotePlayers().map((p) => p.conn)]) this.closeLink(conn);
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
    this.hostId = null;
    this.epoch = 0;
    this._migrating = false;
    this._welcomeReceived = false;
    this.match = null;
    this.traffic.isRemoteControlled = false;
    if (!silent) this.emitStatus('Bağlantı kesildi.');
  }

  hostRoom(playerName) {
    this.disconnect({ silent: true });
    this.setPlayerName(playerName);
    this.role = 'host';
    this.localId = newPlayerId();
    this.hostId = this.localId;
    this.localSlot = 0;
    this.epoch = 0;
    this.roomCode = String(Math.floor(1000 + Math.random() * 9000));
    this.localWorldDistM = 0;
    this._matchStarted = false;

    // 1. Instant BroadcastChannel (works immediately when testing several tabs on one device)
    this.setupBroadcastChannel(this.roomCode);

    this.emitStatus(
      `⏳ Oda Kodu: ${this.roomCode} — Arkadaşların kodu girince oyun otomatik başlar (en fazla ${MAX_PLAYERS} kişi)!`
    );

    // 2. PeerJS WebRTC P2P for cross-device / mobile-to-PC / internet play
    this.openHostPeer({
      readyMessage: `✅ Oda Hazır! Kod: ${this.roomCode} — ${MAX_PLAYERS} kişiye kadar arkadaşın katılabilir.`,
      onTaken: () => this.hostRoom(this.playerName), // code in use: retry with a fresh one
    });

    return this.roomCode;
  }

  // Registers this device on the PeerJS server as the room's host for the current epoch
  openHostPeer({ readyMessage = null, onTaken }) {
    try {
      const peer = new Peer(this.hostPeerId(this.roomCode, this.epoch), PEER_CONFIG);
      this.peer = peer;

      peer.on('open', () => {
        if (readyMessage && this.peer === peer && !this.connected) this.emitStatus(readyMessage);
      });

      // The guest identifies itself with join_hello over this link; until then it is anonymous
      peer.on('connection', (conn) => {
        conn.on('data', (data) => this.handlePacket(data, conn));
        conn.on('close', () => {
          const player = this.getRemotePlayers().find((p) => p.conn === conn);
          if (player) this.onGuestGone(player.id);
        });
      });

      peer.on('error', (err) => {
        console.warn('PeerJS Host Uyarısı:', err);
        if (err.type === 'unavailable-id' && this.peer === peer) onTaken();
      });
    } catch (e) {
      console.warn('PeerJS başlatılamadı, yerel kanal aktif:', e);
    }
  }

  joinRoom(codeInput, playerName, { scanRounds = 1 } = {}) {
    const cleanCode = String(codeInput || '').replace(/\D/g, '').slice(0, 4);
    if (cleanCode.length !== 4) {
      this.emitStatus('⚠️ Lütfen 4 haneli oda kodunu girin (Örn: 4829).');
      return false;
    }

    this.disconnect({ silent: true });
    this.setPlayerName(playerName);
    this.role = 'guest';
    this.localId = newPlayerId();
    this.hostId = null;
    this.epoch = 0;
    this.roomCode = cleanCode;
    this.localWorldDistM = 0;
    this._matchStarted = false;
    this._welcomeReceived = false;
    this._scanEpoch = 0;
    this._scanRoundsLeft = scanRounds;

    this.emitStatus(`⏳ ${cleanCode} numaralı odaya bağlanılıyor, lütfen bekleyin...`);

    // 1. BroadcastChannel (instant if the host is another tab on this device)
    this.setupBroadcastChannel(cleanCode);
    this.startHello();

    // 2. PeerJS WebRTC connection (cross-device / internet / Wi-Fi). The room may have changed
    //    hosts since the code was shared, so its host id is looked up epoch by epoch.
    try {
      this.peer = new Peer(PEER_CONFIG);
      this.peer.on('open', () => this.connectToHost(this.hostPeerId(cleanCode, 0)));
      this.peer.on('error', (err) => this.onGuestPeerError(err));
    } catch (e) {
      console.warn('PeerJS bağlantı hatası:', e);
    }

    return true;
  }

  // Say hello every 450 ms over whatever is up until the host welcomes us
  startHello() {
    clearInterval(this._helloInterval);
    const sayHello = () => {
      if (this._welcomeReceived || this.role !== 'guest') {
        clearInterval(this._helloInterval);
        this._helloInterval = null;
        return;
      }
      this.broadcast({ type: 'join_hello', name: this.playerName, carModel: this.localCarModel, paintSlot: this.localPaintSlot });
    };
    sayHello();
    this._helloInterval = setInterval(sayHello, 450);
  }

  // Opens the WebRTC link to a host id. A link that has not opened after CONNECT_TIMEOUT_MS
  // (e.g. a host that is gone but still registered never answers) counts as a failed attempt.
  connectToHost(peerId) {
    if (!this.peer || this.role !== 'guest') return;
    this.closeLink(this.hostConn);
    clearTimeout(this._connectTimer);
    const conn = this.peer.connect(peerId, { serialization: 'json' });
    this.hostConn = conn;
    conn.on('data', (data) => this.handlePacket(data, conn));
    conn.on('open', () => {
      clearTimeout(this._connectTimer);
      this.broadcast({ type: 'join_hello', name: this.playerName, carModel: this.localCarModel, paintSlot: this.localPaintSlot });
    });
    conn.on('close', () => {
      if (this.hostConn !== conn) return;
      this.hostConn = null;
      if (this._welcomeReceived) this.startMigration();
    });
    this._connectTimer = setTimeout(() => {
      if (this.hostConn === conn && !conn.open) this.onConnectFailed();
    }, CONNECT_TIMEOUT_MS);
  }

  onGuestPeerError(err) {
    console.warn('PeerJS Join Uyarısı:', err);
    if (this.role !== 'guest') return;
    if (err.type === 'peer-unavailable') {
      this.onConnectFailed();
    } else if (!this.connected) {
      this.emitStatus(`❌ Oda (${this.roomCode}) bağlantı hatası. Tekrar deneyin.`, { connecting: false });
    }
  }

  onConnectFailed() {
    clearTimeout(this._connectTimer);
    if (this.role !== 'guest' || this.hostConn?.open) return;

    if (this._migrating) {
      // The new host may still be registering: keep knocking until the hand-over deadline
      this._connectTimer = setTimeout(() => {
        if (this._migrating && this.role === 'guest') {
          this.connectToHost(this.hostPeerId(this.roomCode, this.epoch));
        }
      }, 1000);
      return;
    }
    if (this._welcomeReceived) return; // already in (welcomed over BroadcastChannel)

    // Joining: try the next epoch; after the last one, start another round or give up
    let delay = 0;
    this._scanEpoch += 1;
    if (this._scanEpoch > MAX_EPOCH_SCAN) {
      this._scanEpoch = 0;
      this._scanRoundsLeft -= 1;
      delay = 1500;
      if (this._scanRoundsLeft <= 0) {
        this.emitStatus(`❌ Oda (${this.roomCode}) bulunamadı veya bağlantı hatası. Kodu kontrol edin.`, {
          connecting: false,
        });
        return;
      }
    }
    this._connectTimer = setTimeout(() => {
      if (this.role === 'guest' && !this._welcomeReceived) {
        this.connectToHost(this.hostPeerId(this.roomCode, this._scanEpoch));
      }
    }, delay);
  }

  // ---------------------------------------------------------------------------------------------
  // Host hand-over
  // ---------------------------------------------------------------------------------------------

  // The host is gone (left, link closed or silent): the remaining player with the lowest slot
  // takes the room over under the next epoch and everyone else reconnects to it. Positions,
  // scores and the traffic field carry over, so the drive simply continues.
  startMigration() {
    if (this.role !== 'guest' || !this._welcomeReceived || this._migrating) return;
    // If this device itself was asleep, the room may have moved on without us: find it again
    if (this.justWokeFromLongSleep()) {
      this.rejoinRoom();
      return;
    }
    this.removeRemotePlayer(this.hostId);
    this._migrating = true;
    this._welcomeReceived = false;
    this.closeLink(this.hostConn);
    this.hostConn = null;
    this.electNextHost();
  }

  electNextHost() {
    this.epoch += 1;
    this._migrationDeadline = performance.now() + MIGRATION_TIMEOUT_MS;
    let next = { id: this.localId, slot: this.localSlot, name: this.playerName };
    for (const p of this.players.values()) if (p.slot < next.slot) next = p;
    this.hostId = next.id;

    if (next.id === this.localId) {
      this.becomeHost();
    } else {
      this.emitStatus(`🔁 Oda kurucusu ayrıldı, yeni kurucu ${next.name} — bağlanılıyor...`);
      this.startHello();
      this.connectToHost(this.hostPeerId(this.roomCode, this.epoch));
    }
  }

  becomeHost() {
    const guestPeer = this.peer;
    this.stopTimers();
    this.closeLink(this.hostConn);
    this.hostConn = null;
    this._migrating = false;
    this.role = 'host';
    this.hostId = this.localId;
    this._matchStarted = true;
    this.traffic.isRemoteControlled = false; // this device now drives the traffic it was mirroring

    // Everyone gets a few extra seconds to reconnect before the heartbeat timeout applies
    const graceUntil = performance.now() + HANDOVER_GRACE_MS;
    for (const p of this.players.values()) {
      p.conn = null;
      p.lastRecvTime = graceUntil;
    }
    this.connected = this.players.size > 0;
    // The match goes on under this device's refereeing, on its own clock
    this._phaseUntil = performance.now() + 2000;
    this._raceGraceUntil = performance.now() + 2000;
    if (!this.match) this.startMatch();

    try {
      guestPeer?.destroy();
    } catch (_) {}
    this.peer = null;
    // Someone else already hosts this epoch (they elected differently): join them instead
    this.openHostPeer({ onTaken: () => this.rejoinRoom() });

    this.broadcast({ type: 'roster', players: this.roster() });
    this.emitStatus(`👑 Oda kurucusu ayrıldı, artık oda kurucusu sensin — Kod: ${this.roomCode}`);
    this.callbacks.onHostChanged?.({ name: this.playerName, isMe: true });
  }

  // Quietly leave and join the same room again by code (its host changed while we were away)
  rejoinRoom() {
    const code = this.roomCode;
    const name = this.playerName;
    this.disconnect({ silent: true, notifyOthers: false });
    this.joinRoom(code, name, { scanRounds: 3 });
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
    const used = new Set([this.localSlot, ...this.getRemotePlayers().map((p) => p.slot)]);
    for (let s = 0; s < MAX_PLAYERS; s++) if (!used.has(s)) return s;
    return -1;
  }

  roster() {
    return [
      { id: this.localId, name: this.playerName, slot: this.localSlot, carModel: this.localCarModel, paintSlot: this.localPaintSlot },
      ...this.getRemotePlayers().map((p) => ({ id: p.id, name: p.name, slot: p.slot, carModel: p.carModel, paintSlot: p.paintSlot })),
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
        if (!this.match) this.startMatch();
        player = this.addRemotePlayer(data.from, data.name, slot, data.carModel || DEFAULT_CAR_ID, data.paintSlot);
      }
      if (conn) player.conn = conn;
      player.lastRecvTime = Math.max(player.lastRecvTime, performance.now());

      this.sendTo(player.conn, player.id, {
        type: 'host_welcome',
        hostDistM: this.localWorldDistM,
        name: this.playerName,
        slot: player.slot,
        roster: this.roster(),
        match: this.match,
        trafficSnapshot: this.traffic.exportSyncState(this.localWorldDistM),
      });

      if (isNew) {
        this.connected = true;
        this.broadcast({ type: 'roster', players: this.roster() });
        this.emitStatus(`🟢 Odada ${this.playerCount}/${MAX_PLAYERS} oyuncu — Kod: ${this.roomCode}`);
        if (!this._matchStarted) {
          this._matchStarted = true;
          this.callbacks.onMatchReady?.({ role: 'host', remoteName: player.name, slot: this.localSlot });
        } else {
          this.callbacks.onPlayerJoined?.({ name: player.name });
        }
      }
      if (isHello) return;
    }

    if (!player) return;
    player.lastRecvTime = Math.max(player.lastRecvTime, performance.now());
    if (conn && !player.conn) player.conn = conn;

    if (data.carModel && player.carModel !== data.carModel) {
      player.carModel = data.carModel;
      this.loadPeerModel(player);
    }
    if (data.paintSlot !== undefined) {
      const pSlot = Number(data.paintSlot) % SLOT_STYLES.length;
      if (player.paintSlot !== pSlot) {
        player.paintSlot = pSlot;
        const newPaintHex = SLOT_STYLES[pSlot].paint;
        player.style.paint = newPaintHex;
        player.car.setPaint(newPaintHex);
      }
    }

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
    } else if (data.type === 'paint_changed') {
      if (data.paintSlot !== undefined) {
        const pSlot = Number(data.paintSlot) % SLOT_STYLES.length;
        player.paintSlot = pSlot;
        const newPaintHex = SLOT_STYLES[pSlot].paint;
        player.style.paint = newPaintHex;
        player.car.setPaint(newPaintHex);
        this.broadcast({ type: 'roster', players: this.roster() });
      }
    } else if (data.type === 'car_changed') {
      if (data.carModel && player.carModel !== data.carModel) {
        player.carModel = data.carModel;
        this.loadPeerModel(player);
      }
      if (data.paintSlot !== undefined) {
        const pSlot = Number(data.paintSlot) % SLOT_STYLES.length;
        player.paintSlot = pSlot;
        const newPaintHex = SLOT_STYLES[pSlot].paint;
        player.style.paint = newPaintHex;
        player.car.setPaint(newPaintHex);
      }
      this.broadcast({ type: 'roster', players: this.roster() });
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
    const epoch = num(data.epoch);

    if (data.type === 'host_welcome') {
      if (this._welcomeReceived) return; // duplicate (same welcome over WebRTC + BroadcastChannel)
      if (epoch < this.epoch) return; // from a host this room has already left behind
      this._welcomeReceived = true;
      this.hostId = data.from;
      this.epoch = epoch;
      this.hostLastRecv = performance.now();
      const handover = this._migrating;
      if (!handover) {
        this.localSlot = num(data.slot, 1);
        this.localWorldDistM = num(data.hostDistM); // Start side-by-side with the host at the exact same meter
      }
      this.syncRoster(data.roster, { announce: false });
      // Joining (or re-joining after a hand-over) mid-match: take the match as it stands
      this.match = sanitizeMatch(data.match) ?? this.match;
      if (data.trafficSnapshot) {
        // The road layout first, so the cars land on the right road
        if (data.trafficSnapshot.roadMode) this.callbacks.onRoadModeSync?.(data.trafficSnapshot.roadMode);
        this.traffic.applySyncState(data.trafficSnapshot, this.localWorldDistM);
        if (data.trafficSnapshot.weatherKey) {
          this.callbacks.onWeatherSync?.(data.trafficSnapshot.weatherKey);
        }
      }
      this.connected = true;

      if (handover) {
        // Hand-over: same highway, same meters, same slot; only the host changed
        this._migrating = false;
        const hostName = cleanName(data.name, 'ODA KURUCUSU');
        this.emitStatus(`🟢 Yeni oda kurucusu: ${hostName} — Odada ${this.playerCount}/${MAX_PLAYERS} oyuncu`);
        this.callbacks.onHostChanged?.({ name: hostName, isMe: false });
        return;
      }

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
    if (data.from !== this.hostId || epoch !== this.epoch) return; // a host the room has left behind
    this.hostLastRecv = performance.now();

    if (data.type === 'roster') {
      this.syncRoster(data.players, { announce: true });
      this.emitStatus(`🟢 Odada ${this.playerCount}/${MAX_PLAYERS} oyuncu — Oda: ${this.roomCode}`);
    } else if (data.type === 'states' && Array.isArray(data.players)) {
      this.syncMatch(data.match);
      for (const s of data.players) {
        if (!s || s.id === this.localId) continue;
        const player = this.players.get(s.id);
        if (player) this.applyState(player, s);
      }
    } else if (data.type === 'traffic') {
      if (data.snapshot?.roadMode) this.callbacks.onRoadModeSync?.(data.snapshot.roadMode);
      this.traffic.applySyncState(data.snapshot, this.localWorldDistM);
      if (data.snapshot?.weatherKey) {
        this.callbacks.onWeatherSync?.(data.snapshot.weatherKey);
      }
    } else if (data.type === 'host_left') {
      this.startMigration();
    } else if (data.type === 'car_changed') {
      const p = this.players.get(data.from);
      if (p) {
        if (data.carModel && p.carModel !== data.carModel) {
          p.carModel = data.carModel;
          this.loadPeerModel(p);
        }
        if (data.paintSlot !== undefined) {
          const pSlot = Number(data.paintSlot) % SLOT_STYLES.length;
          p.paintSlot = pSlot;
          const newPaintHex = SLOT_STYLES[pSlot].paint;
          p.style.paint = newPaintHex;
          p.car.setPaint(newPaintHex);
        }
      }
    } else if (data.type === 'paint_changed') {
      const p = this.players.get(data.from);
      if (p && data.paintSlot !== undefined) {
        const pSlot = Number(data.paintSlot) % SLOT_STYLES.length;
        p.paintSlot = pSlot;
        const newPaintHex = SLOT_STYLES[pSlot].paint;
        p.style.paint = newPaintHex;
        p.car.setPaint(newPaintHex);
      }
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
        if (entry.carModel && existing.carModel !== entry.carModel) {
          existing.carModel = entry.carModel;
          this.loadPeerModel(existing);
        }
        if (entry.paintSlot !== undefined) {
          const pSlot = Number(entry.paintSlot) % SLOT_STYLES.length;
          if (existing.paintSlot !== pSlot) {
            existing.paintSlot = pSlot;
            const newPaintHex = SLOT_STYLES[pSlot].paint;
            existing.style.paint = newPaintHex;
            existing.car.setPaint(newPaintHex);
          }
        }
      } else {
        const player = this.addRemotePlayer(entry.id, entry.name, num(entry.slot, 1), entry.carModel || DEFAULT_CAR_ID, entry.paintSlot);
        if (announce) this.callbacks.onPlayerJoined?.({ name: player.name });
      }
    }
    for (const id of [...this.players.keys()]) {
      if (!ids.has(id)) this.removeRemotePlayer(id, { notify: announce });
    }
  }

  // ---- Shared ----

  applyState(player, d) {
    if (d.name) player.name = cleanName(d.name, player.name);
    if (d.carModel && player.carModel !== d.carModel) {
      player.carModel = d.carModel;
      this.loadPeerModel(player);
    }
    if (d.paintSlot !== undefined) {
      const pSlot = Number(d.paintSlot) % SLOT_STYLES.length;
      if (player.paintSlot !== pSlot) {
        player.paintSlot = pSlot;
        const newPaintHex = SLOT_STYLES[pSlot].paint;
        player.style.paint = newPaintHex;
        player.car.setPaint(newPaintHex);
      }
    }
    // Parts come as flat fields (spoiler, rim, finish, ...); a part an older version does not
    // send is that kind's `none`, its plate the one every car comes with
    const parts = remoteParts(d);
    const key = JSON.stringify(parts);
    if (player.partsKey !== key) {
      player.partsKey = key;
      player.parts = parts;
      player.car.setParts(parts);
    }
    player.targetX = num(d.x, player.targetX);
    player.targetWorldDistM = num(d.worldDistM, player.targetWorldDistM);
    player.speedKmh = num(d.speedKmh, player.speedKmh);
    player.headingAngle = num(d.headingAngle);
    player.bodyRoll = num(d.bodyRoll);
    player.highBeam = Boolean(d.highBeam);
    player.braking = Boolean(d.braking);
    player.score = num(d.score);
    player.combo = num(d.combo, 1.0);
    player.burning = Boolean(d.burning);
    player.round = num(d.round);
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
      // Where the shove ends, not where the car is mid-slide
      carWorldDistM: Number((this.localWorldDistM - car.z - car.pushRemainingZ).toFixed(2)),
      speedKmh: Math.round(car.speedKmh),
    });
  }

  // ---------------------------------------------------------------------------------------------
  // Match: rounds and points
  // ---------------------------------------------------------------------------------------------

  // Host: a new match, its first round starting where everyone already is
  startMatch() {
    this.match = { seq: 0, round: 0, phase: 'race', scores: {}, winnerId: null, loserId: null, reason: null, startDistM: 0 };
    this.startRound(this.localWorldDistM, { announce: false });
  }

  // Host: the next round, everyone side by side again at startDistM
  startRound(startDistM, { announce = true } = {}) {
    const m = this.match;
    m.round += 1;
    m.seq += 1;
    m.phase = 'race';
    m.winnerId = null;
    m.loserId = null;
    m.reason = null;
    m.startDistM = Math.round(startDistM);
    this._raceGraceUntil = performance.now() + ROUND_GRACE_MS;
    this.placeAtRoundStart(m.startDistM);
    if (!announce) return;
    this.traffic.resetTraffic(); // fresh traffic around the new start line
    this.trafficSyncAccum = 1.0;
    this.callbacks.onRoundStart?.(this.matchInfo());
  }

  // Host: someone won the round (winnerId null: everyone crashed at once, nobody scores)
  endRound(winnerId, loserId, reason) {
    const m = this.match;
    if (winnerId) m.scores[winnerId] = (m.scores[winnerId] ?? 0) + 1;
    m.winnerId = winnerId;
    m.loserId = loserId;
    m.reason = reason;
    m.seq += 1;
    const champion = Boolean(winnerId) && m.scores[winnerId] >= MATCH_TARGET_POINTS;
    m.phase = champion ? 'over' : 'break';
    this._phaseUntil = performance.now() + (champion ? MATCH_OVER_MS : ROUND_BREAK_MS);
    this.callbacks.onRoundEnd?.(this.matchInfo());
  }

  // Host, every frame: ends the round on a crash or a ROUND_GAP_M lead, and starts the next one
  // (or a new match) once the result has been on screen long enough
  refereeMatch(localState) {
    const m = this.match;
    if (!m) return;
    const now = performance.now();
    if (m.phase !== 'race') {
      if (now < this._phaseUntil) return;
      if (m.phase === 'over') {
        m.scores = {};
        m.round = 0;
      }
      let leadM = this.localWorldDistM;
      for (const p of this.players.values()) leadM = Math.max(leadM, p.targetWorldDistM);
      this.startRound(leadM + ROUND_START_AHEAD_M);
      return;
    }
    if (now < this._raceGraceUntil) return;

    // Only players already driving this round count (a state sent before the restart does not)
    const field = [{ id: this.localId, distM: this.localWorldDistM, burning: Boolean(localState.burning) }];
    for (const p of this.players.values()) {
      if (p.round === m.round) field.push({ id: p.id, distM: p.targetWorldDistM, burning: p.burning });
    }
    if (field.length < 2) return;
    field.sort((a, b) => b.distM - a.distM);

    const crashed = field.find((f) => f.burning);
    if (crashed) {
      // The point goes to the leader among those still driving
      this.endRound(field.find((f) => !f.burning)?.id ?? null, crashed.id, 'crash');
    } else if (field[0].distM - field[1].distM >= ROUND_GAP_M) {
      this.endRound(field[0].id, field[1].id, 'gap');
    }
  }

  // Guest: the match state that came with the host's 'states' packet
  syncMatch(raw) {
    const m = sanitizeMatch(raw);
    if (!m) return;
    const prev = this.match;
    this.match = m;
    if (!prev || prev.seq === m.seq) return;
    if (m.phase === 'race') {
      this.placeAtRoundStart(m.startDistM);
      this.callbacks.onRoundStart?.(this.matchInfo());
    } else {
      this.callbacks.onRoundEnd?.(this.matchInfo());
    }
  }

  placeAtRoundStart(startDistM) {
    this.localWorldDistM = startDistM;
    for (const p of this.players.values()) {
      p.worldDistM = startDistM;
      p.targetWorldDistM = startDistM;
      p.speedKmh = 0;
    }
  }

  pointsOf(id) {
    return this.match?.scores[id] ?? 0;
  }

  // The match as the screen shows it: names instead of ids, standings best first
  matchInfo() {
    const m = this.match;
    if (!m) return null;
    const who = (id) => {
      if (!id) return null;
      if (id === this.localId) return { name: this.playerName, isMe: true };
      const p = this.players.get(id);
      return { name: p?.name ?? 'RAKİP', isMe: false };
    };
    const standings = [
      { id: this.localId, name: this.playerName, isMe: true, tag: SLOT_STYLES[this.localSlot % SLOT_STYLES.length].tag },
      ...this.getRemotePlayers().map((p) => ({ id: p.id, name: p.name, isMe: false, tag: p.style.tag })),
    ]
      .map((s) => ({ ...s, points: this.pointsOf(s.id) }))
      .sort((a, b) => b.points - a.points);
    return {
      round: m.round,
      phase: m.phase,
      reason: m.reason,
      target: MATCH_TARGET_POINTS,
      gapM: ROUND_GAP_M,
      winner: who(m.winnerId),
      loser: who(m.loserId),
      standings,
    };
  }

  getTrafficContext() {
    return {
      connected: this.connected,
      role: this.role,
      localWorldDistM: this.localWorldDistM,
      peers: this.getRemotePlayers().map((p) => ({ x: p.x, relZ: p.relZ, speedKmh: p.speedKmh })),
    };
  }

  setLocalCarModel(carModel) {
    this.localCarModel = carModel;
    if (this.connected) {
      this.broadcast({ type: 'car_changed', carModel, paintSlot: this.localPaintSlot });
    }
  }

  setLocalParts(parts) {
    this.localParts = parts;
  }

  setLocalPaintSlot(paintSlot) {
    const slot = Number(paintSlot) % SLOT_STYLES.length;
    this.localPaintSlot = (Number.isFinite(slot) && slot >= 0) ? slot : 0;
    if (this.connected) {
      this.broadcast({ type: 'paint_changed', paintSlot: this.localPaintSlot });
    }
  }

  localStatePacket(localState) {
    return {
      name: this.playerName,
      carModel: this.localCarModel,
      paintSlot: this.localPaintSlot,
      ...remoteParts(this.localParts),
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
      burning: Boolean(localState.burning),
      round: this.match?.round ?? 0,
    };
  }

  update(dt, localState, world = null) {
    const speedMs = localState.speedKmh / 3.6;
    this.localWorldDistM += speedMs * dt;

    if (!this.role) return;

    // Heartbeat timeouts (see GUEST_TIMEOUT_MS / MIGRATE_SILENCE_MS)
    const nowMs = performance.now();
    const frameGapMs = this._lastUpdateAt ? nowMs - this._lastUpdateAt : 0;
    const wasSuspended = frameGapMs > SUSPEND_GAP_MS;
    this._lastUpdateAt = nowMs;
    if (this.role === 'host') {
      for (const p of this.getRemotePlayers()) {
        if (wasSuspended) p.lastRecvTime = nowMs;
        else if (nowMs - p.lastRecvTime > GUEST_TIMEOUT_MS) this.onGuestGone(p.id);
      }
    } else if (this._migrating) {
      if (wasSuspended) {
        this._migrationDeadline = nowMs + MIGRATION_TIMEOUT_MS;
      } else if (nowMs > this._migrationDeadline) {
        // The elected host never showed up: count it as gone and elect the next one
        this.removeRemotePlayer(this.hostId);
        this.electNextHost();
      }
    } else if (this._welcomeReceived) {
      if (wasSuspended) this.hostLastRecv = nowMs;
      else if (nowMs - this.hostLastRecv > MIGRATE_SILENCE_MS) this.startMigration();
    }

    if (!this.connected) return;

    if (this.role === 'host') this.refereeMatch(localState);

    // 1. Send state at ~25 Hz. A guest sends its own car to the host; the host relays everyone's
    //    latest state (its own + every guest's) to all guests in a single packet.
    this.sendAccum += dt;
    if (this.sendAccum >= 0.04) {
      this.sendAccum = 0;
      if (this.role === 'guest') {
        this.broadcast({ type: 'state', ...this.localStatePacket(localState) });
      } else {
        const players = [{ id: this.localId, slot: this.localSlot, ...this.localStatePacket(localState) }];
        for (const p of this.players.values()) {
          players.push({
            id: p.id,
            slot: p.slot,
            name: p.name,
            carModel: p.carModel,
            paintSlot: p.paintSlot,
            ...remoteParts(p.parts ?? {}),
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
            burning: p.burning,
            round: p.round,
          });
        }
        this.broadcast({ type: 'states', players, match: this.match });
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
    for (const p of this.players.values()) {
      p.targetWorldDistM += ((p.speedKmh || 90) / 3.6) * dt;
      p.x = THREE.MathUtils.lerp(p.x, p.targetX, Math.min(1, dt * 14));
      if (Math.abs(p.worldDistM - p.targetWorldDistM) > 35) {
        p.worldDistM = p.targetWorldDistM;
      } else {
        p.worldDistM = THREE.MathUtils.lerp(p.worldDistM, p.targetWorldDistM, Math.min(1, dt * 10));
      }
    }

    for (const p of this.players.values()) {
      // Relative Z in the local scene (-Z is ahead of the local player, +Z is behind)
      const relZ = this.localWorldDistM - p.worldDistM;
      p.relZ = relZ;

      const curveX = world ? world.getCurveOffsetAtZ(relZ) : 0;
      const curveY = world?.getElevationOffsetAtZ ? world.getElevationOffsetAtZ(relZ) : 0;
      const curveYaw = world ? world.getCurveYawAtZ(relZ) : 0;
      const curvePitch = world?.getElevationPitchAtZ ? world.getElevationPitchAtZ(relZ) : 0;
      const group = p.car.group;
      if (world !== null) {
        group.visible = relZ > -290 && relZ < 65;
        group.position.set(p.x + curveX, curveY, relZ);
        group.rotation.x = curvePitch;
        group.rotation.y = -p.headingAngle + curveYaw;
        group.rotation.z = p.bodyRoll;
      }

      // Brake lights & High-Beam Selektör visuals
      p.car.setLights({ night, braking: p.braking, highBeam: p.highBeam });

      // A friend who crashed burns on the road for everyone to see
      if (p.burning && !p.fire) {
        p.fire = new CarFire({ width: 1.3 });
        p.fire.group.position.set(0, 0.85, -1.45);
        group.add(p.fire.group);
      }
      if (p.fire) {
        if (p.burning && !p.fire.active) p.fire.ignite();
        else if (!p.burning && p.fire.active) p.fire.extinguish();
        p.fire.update(dt);
      }

      // Refresh the overhead nameplate every ~150 ms (only while it can be seen)
      if (group.visible && now - p.lastBadgeUpdate > 150) {
        p.lastBadgeUpdate = now;
        this.drawNameplate(p);
      }
    }
  }
}
