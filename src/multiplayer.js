import * as THREE from 'three';
import { Peer } from 'peerjs';

const PEER_PREFIX = 'otoban-makas-v1-room-';

export class MultiplayerManager {
  constructor(scene, traffic, callbacks = {}) {
    this.scene = scene;
    this.traffic = traffic;
    this.callbacks = callbacks;

    this.role = null; // 'host' | 'guest' | null
    this.roomCode = null;
    this.connected = false;
    this.playerName = localStorage.getItem('otoban_player_name') || 'OYUNCU';

    this.peer = null;
    this.conn = null;
    this.bc = null; // BroadcastChannel for instant local multi-tab testing

    // Local & Remote Highway Progress (in meters from room sync)
    this.localWorldDistM = 0;
    this.sendAccum = 0;
    this.trafficSyncAccum = 0;
    this.lastRecvTime = 0;

    // Remote Player State (Interpolated)
    this.remote = {
      name: 'OYUNCU 2',
      x: 1.8,
      targetX: 1.8,
      worldDistM: 0,
      targetWorldDistM: 0,
      speedKmh: 95,
      headingAngle: 0,
      bodyRoll: 0,
      highBeam: false,
      horn: false,
      braking: false,
      score: 0,
      combo: 1.0,
      relZ: -12, // Negative = ahead of local player, Positive = behind local player
    };

    this.peerCar = this.createPeerCarMesh();
    this.peerCar.group.visible = false;
    this.scene.add(this.peerCar.group);
  }

  setPlayerName(name) {
    const clean = (name || '').trim().slice(0, 14) || 'OYUNCU';
    this.playerName = clean;
    localStorage.setItem('otoban_player_name', clean);
  }

  createNameplateTexture(nameText, speedKmh, combo) {
    if (!this._badgeCanvas) {
      this._badgeCanvas = document.createElement('canvas');
      this._badgeCanvas.width = 512;
      this._badgeCanvas.height = 128;
      this._badgeCtx = this._badgeCanvas.getContext('2d');
      this._badgeTex = new THREE.CanvasTexture(this._badgeCanvas);
      this._badgeTex.colorSpace = THREE.SRGBColorSpace;
    }

    const ctx = this._badgeCtx;
    ctx.clearRect(0, 0, 512, 128);

    // Pill background
    ctx.fillStyle = 'rgba(6, 12, 24, 0.85)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(16, 14, 480, 100, 26);
    ctx.fill();
    ctx.stroke();

    // Player Name
    ctx.fillStyle = '#10b981';
    ctx.font = '900 34px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏁 ${nameText.toUpperCase()}`, 256, 56);

    // Speed & Combo
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 28px ui-monospace, monospace';
    ctx.fillText(
      `${Math.round(speedKmh)} KM/S  •  ${combo.toFixed(1)}x KOMBO`,
      256,
      96
    );

    this._badgeTex.needsUpdate = true;
    return this._badgeTex;
  }

  createPeerCarMesh() {
    const group = new THREE.Group();

    // Distinctive Metallic Emerald-Cyan RS Paint
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.12,
      metalness: 0.86,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x050912,
      roughness: 0.05,
      metalness: 0.95,
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x11151f,
      roughness: 0.45,
      metalness: 0.35,
    });

    const w = 1.94;
    const h = 1.32;
    const l = 4.55;
    const lowerH = h * 0.48;

    // Lower sculpted body + wide RS fenders
    const lowerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.96, lowerH, l * 0.95),
      bodyMat
    );
    lowerMesh.position.y = lowerH / 2 + 0.24;
    group.add(lowerMesh);

    const flareMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w * 1.02, lowerH * 0.62, l * 0.88),
      bodyMat
    );
    flareMesh.position.y = lowerH * 0.36 + 0.23;
    group.add(flareMesh);

    // Carbon splitter & diffuser
    const skirtMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.99, 0.13, l * 0.98),
      carbonMat
    );
    skirtMesh.position.y = 0.2;
    group.add(skirtMesh);

    // Sloped Sport Fastback Cabin
    const roofW = w * 0.8;
    const roofH = h * 0.44;
    const roofL = l * 0.44;
    const cabinY = lowerH + roofH / 2 + 0.22;
    const cabinZ = -l * 0.04;

    const cabinMesh = new THREE.Mesh(
      new THREE.BoxGeometry(roofW, roofH, roofL),
      glassMat
    );
    cabinMesh.position.set(0, cabinY, cabinZ);
    group.add(cabinMesh);

    const roofCap = new THREE.Mesh(
      new THREE.BoxGeometry(roofW * 0.96, 0.06, roofL * 0.94),
      carbonMat
    );
    roofCap.position.set(0, cabinY + roofH / 2 + 0.01, cabinZ);
    group.add(roofCap);

    // Rear Carbon Spoiler Wing
    const rearZ = l * 0.47;
    const spoilerBlade = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.88, 0.05, 0.24),
      carbonMat
    );
    spoilerBlade.position.set(0, lowerH + 0.38, rearZ - 0.14);
    group.add(spoilerBlade);

    // Full-Width Audi RS LED Tail Lightbar
    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff1e38 });
    const tailBar = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.88, 0.085, 0.06),
      tailLightMat
    );
    tailBar.position.set(0, lowerH * 0.82 + 0.22, rearZ);
    group.add(tailBar);

    // Front Matrix LED Headlights (At -Z, clearly visible in Rear-View Mirror when friend is behind you!)
    const frontZ = -l * 0.47;
    const headLightMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const headGeo = new THREE.BoxGeometry(w * 0.25, 0.12, 0.07);

    const leftHead = new THREE.Mesh(headGeo, headLightMat);
    leftHead.position.set(-w * 0.34, lowerH * 0.72 + 0.2, frontZ);
    group.add(leftHead);

    const rightHead = new THREE.Mesh(headGeo, headLightMat);
    rightHead.position.set(w * 0.34, lowerH * 0.72 + 0.2, frontZ);
    group.add(rightHead);

    // High-Beam Selektör Flare Glare Spheres (Visible when friend flashes Selektör!)
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.92,
    });
    const flareGeo = new THREE.SphereGeometry(0.26, 12, 12);
    const leftFlare = new THREE.Mesh(flareGeo, flareMat);
    leftFlare.position.set(-w * 0.34, lowerH * 0.72 + 0.2, frontZ - 0.06);
    leftFlare.visible = false;
    group.add(leftFlare);

    const rightFlare = new THREE.Mesh(flareGeo, flareMat);
    rightFlare.position.set(w * 0.34, lowerH * 0.72 + 0.2, frontZ - 0.06);
    rightFlare.visible = false;
    group.add(rightFlare);

    // 4 Sport Alloy Wheels
    const wheelR = 0.35;
    const wheelW = 0.25;
    const tireGeo = new THREE.CylinderGeometry(wheelR, wheelR, wheelW, 16);
    tireGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(wheelR * 0.7, wheelR * 0.7, wheelW + 0.015, 12);
    rimGeo.rotateZ(Math.PI / 2);
    const alloyMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.92,
    });

    const wheelCoords = [
      [-w * 0.49, wheelR, -l * 0.32],
      [w * 0.49, wheelR, -l * 0.32],
      [-w * 0.49, wheelR, l * 0.32],
      [w * 0.49, wheelR, l * 0.32],
    ];
    for (const [wx, wy, wz] of wheelCoords) {
      const tire = new THREE.Mesh(tireGeo, carbonMat);
      tire.position.set(wx, wy, wz);
      group.add(tire);
      const rim = new THREE.Mesh(rimGeo, alloyMat);
      rim.position.set(wx, wy, wz);
      group.add(rim);
    }

    // Floating Overhead Nameplate Sprite
    const badgeTex = this.createNameplateTexture('OYUNCU 2', 100, 1.0);
    const spriteMat = new THREE.SpriteMaterial({
      map: badgeTex,
      depthTest: false,
      transparent: true,
    });
    const badgeSprite = new THREE.Sprite(spriteMat);
    badgeSprite.position.set(0, 2.35, 0);
    badgeSprite.scale.set(3.2, 0.8, 1);
    badgeSprite.renderOrder = 10;
    group.add(badgeSprite);

    return {
      group,
      tailLightMat,
      headLightMat,
      leftFlare,
      rightFlare,
      badgeSprite,
    };
  }

  disconnect() {
    if (this.conn) {
      try {
        this.conn.close();
      } catch (_) {}
      this.conn = null;
    }
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
    this.connected = false;
    this.role = null;
    this.roomCode = null;
    this.traffic.isRemoteControlled = false;
    this.peerCar.group.visible = false;
    this.callbacks.onStatusChange?.({
      connected: false,
      role: null,
      roomCode: null,
      message: 'Bağlantı kesildi.',
    });
  }

  setupBroadcastChannel(code) {
    if (typeof BroadcastChannel === 'undefined') return;
    if (this.bc) {
      try {
        this.bc.close();
      } catch (_) {}
    }
    this.bc = new BroadcastChannel(`${PEER_PREFIX}${code}`);
    this.bc.onmessage = (ev) => {
      const data = ev.data;
      if (!data || data.senderRole === this.role) return;

      if (data.type === 'join_hello' && this.role === 'host') {
        this.remote.name = data.name || 'OYUNCU 2';
        this.onPeerConnected('Yerel Sekme / Wi-Fi');
        this.sendPacket({
          type: 'host_welcome',
          hostDistM: this.localWorldDistM,
          name: this.playerName,
        });
        if (!this._matchStarted) {
          this._matchStarted = true;
          this.callbacks.onMatchReady?.({
            role: 'host',
            remoteName: this.remote.name,
          });
        }
      } else if (data.type === 'host_welcome' && this.role === 'guest') {
        this._welcomeReceived = true;
        this.localWorldDistM = data.hostDistM - 6; // Spawn 6m behind/beside Host!
        this.remote.worldDistM = data.hostDistM;
        this.remote.targetWorldDistM = data.hostDistM;
        this.remote.name = data.name || 'ODA KURUCUSU';
        this.onPeerConnected('Yerel Sekme / Wi-Fi');
        if (!this._matchStarted) {
          this._matchStarted = true;
          this.callbacks.onMatchReady?.({
            role: 'guest',
            remoteName: this.remote.name,
          });
        }
      } else {
        this.handleIncomingPacket(data);
      }
    };
  }

  hostRoom(playerName) {
    this.disconnect();
    this.setPlayerName(playerName);
    this.role = 'host';
    this.roomCode = String(Math.floor(1000 + Math.random() * 9000));
    this.localWorldDistM = 0;
    this._matchStarted = false;
    this._welcomeReceived = false;

    // 1. Setup instant BroadcastChannel (works immediately if testing 2 tabs on same device)
    this.setupBroadcastChannel(this.roomCode);

    this.callbacks.onStatusChange?.({
      connected: false,
      connecting: true,
      role: 'host',
      roomCode: this.roomCode,
      message: `⏳ Oda Kodu: ${this.roomCode} — Arkadaşın kodu girince oyun otomatik başlayacak!`,
    });

    // 2. Setup PeerJS WebRTC P2P for cross-device / mobile-to-PC / internet play
    const peerConfig = {
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

    try {
      this.peer = new Peer(`${PEER_PREFIX}${this.roomCode}`, peerConfig);

      this.peer.on('open', () => {
        this.callbacks.onStatusChange?.({
          connected: this.connected,
          connecting: !this.connected,
          role: 'host',
          roomCode: this.roomCode,
          message: `✅ Oda Hazır! Kod: ${this.roomCode} — Arkadaşın katıldığında yarış otomatik başlar!`,
        });
      });

      this.peer.on('connection', (conn) => {
        this.conn = conn;
        this.bindPeerConnection(conn);
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
      this.callbacks.onStatusChange?.({
        connected: false,
        connecting: false,
        role: null,
        roomCode: null,
        message: '⚠️ Lütfen 4 haneli oda kodunu girin (Örn: 4829).',
      });
      return false;
    }

    this.disconnect();
    this.setPlayerName(playerName);
    this.role = 'guest';
    this.roomCode = cleanCode;
    this.localWorldDistM = 0;
    this._matchStarted = false;
    this._welcomeReceived = false;

    this.callbacks.onStatusChange?.({
      connected: false,
      connecting: true,
      role: 'guest',
      roomCode: cleanCode,
      message: `⏳ ${cleanCode} numaralı odaya bağlanılıyor, lütfen bekleyin...`,
    });

    // 1. BroadcastChannel hello (instant if on same computer)
    this.setupBroadcastChannel(cleanCode);
    this.bc?.postMessage({
      type: 'join_hello',
      senderRole: 'guest',
      name: this.playerName,
    });

    // 2. PeerJS WebRTC connection (cross-device / internet / Wi-Fi)
    const peerConfig = {
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

    try {
      this.peer = new Peer(peerConfig);
      this.peer.on('open', () => {
        const conn = this.peer.connect(`${PEER_PREFIX}${cleanCode}`, {
          serialization: 'json',
        });
        this.conn = conn;
        this.bindPeerConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS Join Uyarısı:', err);
        if (!this.connected) {
          this.callbacks.onStatusChange?.({
            connected: false,
            connecting: false,
            role: 'guest',
            roomCode: cleanCode,
            message: `❌ Oda (${cleanCode}) bulunamadı veya bağlantı hatası. Kodu kontrol edin.`,
          });
        }
      });
    } catch (e) {
      console.warn('PeerJS bağlantı hatası:', e);
    }

    return true;
  }

  bindPeerConnection(conn) {
    // Attach data listener immediately even before 'open' fires so no early packet is missed
    conn.on('data', (data) => {
      if (!data) return;
      if (data.type === 'join_hello' && this.role === 'host') {
        this.remote.name = data.name || 'OYUNCU 2';
        this.onPeerConnected('WebRTC P2P');
        this.sendPacket({
          type: 'host_welcome',
          hostDistM: this.localWorldDistM,
          name: this.playerName,
        });
        if (!this._matchStarted) {
          this._matchStarted = true;
          this.callbacks.onMatchReady?.({
            role: 'host',
            remoteName: this.remote.name,
          });
        }
      } else if (data.type === 'host_welcome' && this.role === 'guest') {
        this._welcomeReceived = true;
        if (this._helloInterval) {
          clearInterval(this._helloInterval);
          this._helloInterval = null;
        }
        this.localWorldDistM = data.hostDistM - 6; // Start 6m behind/beside Host
        this.remote.worldDistM = data.hostDistM;
        this.remote.targetWorldDistM = data.hostDistM;
        this.remote.name = data.name || 'OYUNCU 1';
        this.onPeerConnected('WebRTC P2P');
        if (!this._matchStarted) {
          this._matchStarted = true;
          this.callbacks.onMatchReady?.({
            role: 'guest',
            remoteName: this.remote.name,
          });
        }
      } else {
        if (!this.connected) {
          this.onPeerConnected('WebRTC P2P');
        }
        this.handleIncomingPacket(data);
      }
    });

    conn.on('open', () => {
      this.onPeerConnected('WebRTC P2P');
      if (this.role === 'host') {
        this.sendPacket({
          type: 'host_welcome',
          hostDistM: this.localWorldDistM,
          name: this.playerName,
        });
      } else {
        this.sendPacket({
          type: 'join_hello',
          name: this.playerName,
        });
        // Keep sending join_hello every 450ms until host_welcome is confirmed
        if (this._helloInterval) clearInterval(this._helloInterval);
        this._helloInterval = setInterval(() => {
          if (this._welcomeReceived || !this.conn || !this.conn.open) {
            clearInterval(this._helloInterval);
            this._helloInterval = null;
            return;
          }
          this.sendPacket({
            type: 'join_hello',
            name: this.playerName,
          });
        }, 450);
      }
    });

    conn.on('close', () => {
      if (this._helloInterval) {
        clearInterval(this._helloInterval);
        this._helloInterval = null;
      }
      this.connected = false;
      this.traffic.isRemoteControlled = false;
      this.peerCar.group.visible = false;
      this.callbacks.onStatusChange?.({
        connected: false,
        connecting: false,
        role: this.role,
        roomCode: this.roomCode,
        message: '⚠️ Diğer oyuncu odadan ayrıldı.',
      });
    });
  }

  onPeerConnected(transportLabel) {
    if (this.connected) return;
    this.connected = true;
    this.peerCar.group.visible = true;
    this.lastRecvTime = performance.now();

    this.callbacks.onStatusChange?.({
      connected: true,
      connecting: false,
      role: this.role,
      roomCode: this.roomCode,
      message: `🟢 Bağlandı! (${transportLabel}) — Oda: ${this.roomCode}`,
    });
  }

  sendPacket(payload) {
    const packet = { ...payload, senderRole: this.role };
    if (this.conn && this.conn.open) {
      try {
        this.conn.send(packet);
      } catch (_) {}
    }
    if (this.bc) {
      try {
        this.bc.postMessage(packet);
      } catch (_) {}
    }
  }

  handleIncomingPacket(data) {
    this.lastRecvTime = performance.now();

    if (data.type === 'state') {
      if (data.name) this.remote.name = data.name;
      this.remote.targetX = data.x;
      this.remote.targetWorldDistM = data.worldDistM;
      this.remote.speedKmh = data.speedKmh;
      this.remote.headingAngle = data.headingAngle || 0;
      this.remote.bodyRoll = data.bodyRoll || 0;
      this.remote.highBeam = Boolean(data.highBeam);
      this.remote.braking = Boolean(data.braking);
      this.remote.score = data.score || 0;
      this.remote.combo = data.combo || 1.0;

      if (data.horn && !this.remote.horn) {
        this.callbacks.onPeerHorn?.();
      }
      this.remote.horn = Boolean(data.horn);
    } else if (data.type === 'traffic' && this.role === 'guest') {
      this.traffic.applySyncState(data.snapshot, this.localWorldDistM);
    }
  }

  // Teleport / Catch up right behind friend if separated by a big gap
  catchUpToPeer() {
    if (!this.connected) return false;
    if (Math.abs(this.remote.relZ) > 12) {
      this.localWorldDistM = this.remote.targetWorldDistM - 10; // Place 10m behind friend
      this.remote.worldDistM = this.remote.targetWorldDistM;
      return true;
    }
    return false;
  }

  update(dt, localState, world = null) {
    const speedMs = localState.speedKmh / 3.6;
    this.localWorldDistM += speedMs * dt;

    if (!this.connected) {
      this.peerCar.group.visible = false;
      return;
    }

    // 1. Send local player state at ~25 Hz
    this.sendAccum += dt;
    if (this.sendAccum >= 0.04) {
      this.sendAccum = 0;
      this.sendPacket({
        type: 'state',
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
      });
    }

    // 2. If Host, broadcast authoritative traffic snapshot at ~12 Hz so both weave through identical cars
    if (this.role === 'host') {
      this.trafficSyncAccum += dt;
      if (this.trafficSyncAccum >= 0.085) {
        this.trafficSyncAccum = 0;
        this.sendPacket({
          type: 'traffic',
          snapshot: this.traffic.exportSyncState(this.localWorldDistM),
        });
      }
    }

    // 3. Dead-reckon & interpolate remote player's highway position
    const remoteSpeedMs = (this.remote.speedKmh || 90) / 3.6;
    this.remote.targetWorldDistM += remoteSpeedMs * dt;

    // Smoothly interpolate X and longitudinal distance
    this.remote.x = THREE.MathUtils.lerp(
      this.remote.x,
      this.remote.targetX,
      Math.min(1, dt * 14)
    );
    if (Math.abs(this.remote.worldDistM - this.remote.targetWorldDistM) > 35) {
      this.remote.worldDistM = this.remote.targetWorldDistM;
    } else {
      this.remote.worldDistM = THREE.MathUtils.lerp(
        this.remote.worldDistM,
        this.remote.targetWorldDistM,
        Math.min(1, dt * 10)
      );
    }

    // Soft rubber-banding: if players get more than 165m apart after a crash, gently pull the trailing car closer
    // so they always stay within visual highway range!
    const rawGapM = this.remote.worldDistM - this.localWorldDistM; // + means friend is ahead
    if (Math.abs(rawGapM) > 165) {
      const pull = (Math.abs(rawGapM) - 165) * 0.35 * Math.sign(rawGapM);
      this.localWorldDistM += pull * dt;
    }

    // Compute relative Z in local Three.js scene (-Z is ahead of local player, +Z is behind local player)
    const relZ = this.localWorldDistM - this.remote.worldDistM;
    this.remote.relZ = relZ;

    // Update 3D Peer Car transform (following the 3D highway curve)
    const curveX = world ? world.getCurveOffsetAtZ(relZ) : 0;
    const curveYaw = world ? world.getCurveYawAtZ(relZ) : 0;
    this.peerCar.group.visible = relZ > -290 && relZ < 65;
    this.peerCar.group.position.set(this.remote.x + curveX, 0, relZ);
    this.peerCar.group.rotation.y = -this.remote.headingAngle + curveYaw;
    this.peerCar.group.rotation.z = this.remote.bodyRoll;

    // Brake lights & High-Beam Selektör visuals
    this.peerCar.tailLightMat.color.setHex(this.remote.braking ? 0xff4455 : 0xd90429);
    this.peerCar.headLightMat.color.setHex(this.remote.highBeam ? 0x93c5fd : 0xe0f2fe);
    this.peerCar.leftFlare.visible = this.remote.highBeam;
    this.peerCar.rightFlare.visible = this.remote.highBeam;

    // Refresh overhead floating nameplate every ~150ms
    if (!this._lastBadgeUpdate || performance.now() - this._lastBadgeUpdate > 150) {
      this._lastBadgeUpdate = performance.now();
      this.createNameplateTexture(
        this.remote.name,
        this.remote.speedKmh,
        this.remote.combo
      );
    }
  }
}
