import * as THREE from 'three';
import { SoundEngine } from './audio.js';
import { CarCockpit, AMBIENT_COLORS } from './cockpit.js';
import { HighwayWorld, MIRROR_SKIP_LAYER, ROAD_HALF_WIDTH, WEATHER_PRESETS } from './world.js';
import { TrafficManager } from './traffic.js';
import { MultiplayerManager } from './multiplayer.js';

// v3: earlier versions could save the photo fallback after a failed 3D load; start everyone on 3D again
const COCKPIT_MODE_KEY = 'otoban_cockpit_mode_v3';

// Camera / Seat Presets aligned with the Photorealistic Audi A8 Windshield
const CAMERA_PRESETS = [
  { name: 'Standart', offset: new THREE.Vector3(0.0, 1.25, 0.2), baseFov: 58, horizonShiftY: 0.24 },
  { name: 'Tam Kabin', offset: new THREE.Vector3(0.0, 1.28, 0.35), baseFov: 62, horizonShiftY: 0.30 },
  { name: 'Yakın Sürüş', offset: new THREE.Vector3(0.0, 1.22, 0.05), baseFov: 54, horizonShiftY: 0.18 },
];

class OtobanMakasGame {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.sound = new SoundEngine();

    // Three.js Core Setup
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    // Adaptive render scale: starts at the device pixel ratio (max 2), steps down while the
    // frame rate is too low and back up once there is headroom again (see adaptRenderScale)
    this.maxPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.minPixelRatio = Math.min(1, this.maxPixelRatio);
    this.pixelRatio = this.maxPixelRatio;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.info.autoReset = false; // count draw calls of both passes (mirror + main)
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    this.cameraPresetIndex = 0;
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_PRESETS[0].baseFov,
      window.innerWidth / window.innerHeight,
      0.05,
      360
    );
    this.camera.layers.enable(MIRROR_SKIP_LAYER);

    // Subsystems
    this.world = new HighwayWorld(this.scene);
    this.cockpit = new CarCockpit(this.renderer);
    this.scene.add(this.cockpit.group);
    this.traffic = new TrafficManager(this.scene);
    this.multiplayer = new MultiplayerManager(this.scene, this.traffic, {
      onStatusChange: (status) => this.syncMultiplayerUI(status),
      onMatchReady: ({ role, remoteName }) => {
        // Automatically launch both players onto the highway side-by-side!
        this.playerX = role === 'host' ? -1.8 : 1.8;
        this.speedKmh = 95;
        this.lateralVel = 0;
        this.headingAngle = 0;
        this.sound.init();
        this.sound.setRainAmbience(this.world.weatherKey === 'rain');
        this.paused = false;
        document.getElementById('menu-overlay')?.classList.add('hidden');
        document.getElementById('btn-reset-car')?.classList.remove('hidden');
        const startBtnSpan = document.querySelector('#btn-start-game span');
        if (startBtnSpan) startBtnSpan.textContent = 'SÜRÜŞE DEVAM ET';
        this.showMakasNotification(
          `🏁 ${remoteName} BAĞLANDI! BERABER SÜRÜŞ BAŞLADI!`,
          0,
          'gold'
        );
      },
      onPeerHorn: () => {
        this.showMakasNotification(`📯 ${this.multiplayer.remote.name} KORNA ÇALDI!`, 50, 'normal');
      },
      onWeatherSync: (weatherKey) => {
        if (weatherKey && weatherKey !== this.world.weatherKey) {
          const preset = this.world.applyWeather(weatherKey);
          this.syncWeatherUI(preset);
        }
      },
    });
    this.lastTandemTime = 0;

    // Add camera to cockpit group so it moves laterally with the car
    this.cockpit.group.add(this.camera);
    this.cockpit.camera = this.camera;
    this.applyCameraPreset(0);

    // Game & Vehicle Physics State
    this.paused = true;
    this.score = 0;
    this.bestScore = Number(localStorage.getItem('otoban_makas_best') || 0);
    this.combo = 1.0;
    this.comboTimer = 0; // 0.0 to 1.0
    this.health = 100;
    this.odometerKm = 1428.4;

    this.playerX = -1.8; // Start in left-center fast lane
    this.lateralVel = 0;
    this.yawRate = 0; // rad/s chassis yaw angular velocity
    this.headingAngle = 0; // rad chassis slip/heading angle relative to highway
    this.bodyRoll = 0; // rad suspension roll angle (spring-damper)
    this.rollVel = 0;
    this.bodyPitch = 0; // rad suspension pitch angle (spring-damper)
    this.pitchVel = 0;
    this.speedKmh = 90;
    this.rpm = 2200;
    this.gear = 3;
    this.lateralG = 0;
    this.longitudinalG = 0;
    this.shakeIntensity = 0;

    // Input State
    this.keys = {
      gas: false,
      brake: false,
      left: false,
      right: false,
      highBeam: false,
      horn: false,
    };
    this.touchSteerValue = 0; // -1 to +1 from steering wheel drag or tilt
    this.steerMode = 'wheel'; // 'wheel' | 'buttons' | 'tilt'
    this.tiltBaseline = null;
    this.steerInput = 0;

    this.lastTime = performance.now();
    this.perf = { frames: 0, elapsed: 0, calls: 0, window: 0, goodWindows: 0, lastRaise: -10, settle: 0 };
    this.fpsMeter = null;
    if (new URLSearchParams(window.location.search).has('fps')) this.toggleFpsMeter();

    this.bindEvents();
    this.updateHUD();
    this.animate();
  }

  applyCameraPreset(index) {
    this.cameraPresetIndex = index % CAMERA_PRESETS.length;
    const preset = CAMERA_PRESETS[this.cameraPresetIndex];
    this.cockpit.setViewPreset(this.cameraPresetIndex);
    this.camera.position.copy(preset.offset);
    this.camera.fov = preset.baseFov;
    this.updateCameraProjection();

    const label = document.getElementById('camera-label');
    if (label) label.textContent = preset.name;
  }

  updateCameraProjection() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const preset = CAMERA_PRESETS[this.cameraPresetIndex];
    this.camera.aspect = w / h;
    // Shift optical center upward so the 3D highway horizon sits inside the Audi A8 windshield
    this.camera.setViewOffset(w, h, 0, Math.round(h * preset.horizonShiftY), w, h);
    this.camera.updateProjectionMatrix();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.updateCameraProjection();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.repeat) return;
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') this.keys.gas = true;
      if (code === 'KeyS' || code === 'ArrowDown') this.keys.brake = true;
      if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = true;
      if (code === 'KeyF' || code === 'Space') {
        this.setHighBeam(true);
      }
      if (code === 'KeyH') {
        this.keys.horn = true;
        this.sound.setHorn(true);
      }
      if (code === 'KeyR') {
        if (this.multiplayer.catchUpToPeer()) {
          this.showMakasNotification('🚀 ARKADAŞININ YANINA YETİŞTİN!', 0, 'normal');
        }
      }
      if (code === 'KeyV') {
        this.cockpit.toggleWipers();
        this.sound.playSelektorClick();
      }
      if (code === 'KeyL') {
        const info = this.cockpit.cycleAmbientColor();
        this.syncAmbientUI(this.cockpit.ambientKey, info.css);
      }
      if (code === 'KeyT') {
        const preset = this.world.cycleWeather();
        this.syncWeatherUI(preset);
      }
      if (code === 'KeyC') {
        this.applyCameraPreset(this.cameraPresetIndex + 1);
      }
      if (code === 'KeyK') {
        this.setCockpitMode(this.cockpit.mode === '3d' ? 'photo' : '3d');
      }
      if (code === 'KeyM') {
        this.toggleSound();
      }
      if (code === 'KeyP') {
        this.toggleFpsMeter();
      }
      if (code === 'Escape') {
        this.togglePauseMenu();
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') this.keys.gas = false;
      if (code === 'KeyS' || code === 'ArrowDown') this.keys.brake = false;
      if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = false;
      if (code === 'KeyF' || code === 'Space') {
        this.setHighBeam(false);
      }
      if (code === 'KeyH') {
        this.keys.horn = false;
        this.sound.setHorn(false);
      }
    });

    // Quick Top HUD Buttons
    document.getElementById('btn-mp-quick')?.addEventListener('click', () => {
      this.paused = true;
      document.getElementById('menu-overlay')?.classList.remove('hidden');
    });

    document.getElementById('btn-mp-catchup')?.addEventListener('click', () => {
      if (this.multiplayer.catchUpToPeer()) {
        this.showMakasNotification('🚀 ARKADAŞININ YANINA YETİŞTİN!', 0, 'normal');
      }
    });

    // 2-Player Multiplayer Lobby Buttons
    const nameInput = document.getElementById('mp-player-name');
    if (nameInput && localStorage.getItem('otoban_player_name')) {
      nameInput.value = localStorage.getItem('otoban_player_name');
    }

    document.getElementById('btn-mp-host')?.addEventListener('click', () => {
      const playerName = nameInput?.value || 'OYUNCU 1';
      this.multiplayer.hostRoom(playerName);
    });

    document.getElementById('btn-mp-join')?.addEventListener('click', () => {
      const playerName = nameInput?.value || 'OYUNCU 2';
      const codeVal = document.getElementById('mp-join-code')?.value || '';
      this.multiplayer.joinRoom(codeVal, playerName);
    });

    document.getElementById('btn-mp-leave')?.addEventListener('click', () => {
      this.multiplayer.disconnect();
    });

    document.getElementById('btn-weather')?.addEventListener('click', () => {
      const preset = this.world.cycleWeather();
      this.syncWeatherUI(preset);
    });

    document.getElementById('btn-ambient')?.addEventListener('click', () => {
      const info = this.cockpit.cycleAmbientColor();
      this.syncAmbientUI(this.cockpit.ambientKey, info.css);
    });

    document.getElementById('btn-wipers')?.addEventListener('click', () => {
      this.cockpit.toggleWipers();
      this.sound.playSelektorClick();
    });

    document.getElementById('btn-camera')?.addEventListener('click', () => {
      this.applyCameraPreset(this.cameraPresetIndex + 1);
    });

    document.getElementById('btn-sound')?.addEventListener('click', () => {
      this.toggleSound();
    });

    document.getElementById('btn-pause')?.addEventListener('click', () => {
      this.togglePauseMenu();
    });

    // Start / Resume & Reset Buttons in Modal
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
      if (nameInput?.value) {
        this.multiplayer.setPlayerName(nameInput.value);
      }
      if (this.multiplayer.connected) {
        this.multiplayer.catchUpToPeer();
      }
      this.sound.init();
      this.sound.setRainAmbience(this.world.weatherKey === 'rain');
      this.paused = false;
      document.getElementById('menu-overlay')?.classList.add('hidden');
      document.getElementById('btn-reset-car')?.classList.remove('hidden');
      const startBtnSpan = document.querySelector('#btn-start-game span');
      if (startBtnSpan) startBtnSpan.textContent = 'SÜRÜŞE DEVAM ET';
    });

    document.getElementById('btn-reset-car')?.addEventListener('click', () => {
      this.resetRun();
      this.paused = false;
      document.getElementById('menu-overlay')?.classList.add('hidden');
    });

    // Modal Settings Selectors
    document.querySelectorAll('#weather-select-group .opt-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-weather');
        const preset = this.world.applyWeather(key);
        this.syncWeatherUI(preset);
      });
    });

    document.querySelectorAll('#ambient-select-group .swatch').forEach((sw) => {
      sw.addEventListener('click', () => {
        const colorKey = sw.getAttribute('data-color');
        const info = this.cockpit.setAmbientColor(colorKey);
        this.syncAmbientUI(colorKey, info.css);
      });
    });

    document.querySelectorAll('#steer-mode-group .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#steer-mode-group .seg-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.steerMode = btn.getAttribute('data-steermode');
        this.updateSteerModeUI();
      });
    });

    document.querySelectorAll('#traffic-density-group .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#traffic-density-group .seg-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.traffic.setDensity(btn.getAttribute('data-density'));
      });
    });

    document.querySelectorAll('#cockpit-mode-group .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.setCockpitMode(btn.getAttribute('data-cockpit')));
    });
    // The 3D interior is the default; a saved "photo" choice is kept (v2 key so the new
    // default reaches players who had the old photo default stored)
    let savedCockpit = '3d';
    try {
      savedCockpit = localStorage.getItem(COCKPIT_MODE_KEY) || '3d';
    } catch (_) {}
    this.setCockpitMode(savedCockpit);

    document.querySelectorAll('#touch-vis-group .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#touch-vis-group .seg-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const vis = btn.getAttribute('data-touchvis');
        const tc = document.getElementById('touch-controls');
        if (tc) {
          tc.style.display = vis === 'hide' ? 'none' : 'flex';
        }
      });
    });

    this.setupTouchControls();
  }

  setupTouchControls() {
    // 1. Block iOS Safari pinch-to-zoom (gesturestart/gesturechange) and double-tap zoom
    const preventSafariZoom = (e) => {
      e.preventDefault();
    };
    document.addEventListener('gesturestart', preventSafariZoom, { passive: false });
    document.addEventListener('gesturechange', preventSafariZoom, { passive: false });
    document.addEventListener('gestureend', preventSafariZoom, { passive: false });
    document.addEventListener('dblclick', preventSafariZoom, { passive: false });
    document.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('#menu-overlay')) {
        e.preventDefault();
      }
    });

    // Block multi-finger pinch zoom and rapid double-tap zoom across the entire document
    let lastTouchEndTime = 0;
    document.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length > 1 && !e.target.closest('#menu-overlay')) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 1 || (e.scale !== undefined && e.scale !== 1) || !e.target.closest('#menu-overlay')) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.addEventListener(
      'touchend',
      (e) => {
        const now = performance.now();
        if (now - lastTouchEndTime <= 350 && !e.target.closest('#menu-overlay')) {
          e.preventDefault();
        }
        lastTouchEndTime = now;
      },
      { passive: false }
    );

    // 2. Pedals & Aux Hold Buttons (Multi-touch safe + Safari zoom proof)
    const bindHoldButton = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      let activePid = null;

      const start = (e) => {
        e.preventDefault();
        this.sound.init();
        activePid = e.pointerId;
        try {
          el.setPointerCapture(e.pointerId);
        } catch (_) {}
        el.classList.add('active');
        onDown();
      };
      const end = (e) => {
        if (activePid !== null && e.pointerId !== undefined && e.pointerId !== activePid) return;
        e.preventDefault();
        activePid = null;
        el.classList.remove('active');
        onUp();
      };

      el.addEventListener('pointerdown', start);
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
      el.addEventListener('lostpointercapture', end);
      // Prevent Safari native double-tap / pinch gestures directly on game buttons
      el.addEventListener('touchstart', preventSafariZoom, { passive: false });
      el.addEventListener('touchmove', preventSafariZoom, { passive: false });
      el.addEventListener('touchend', preventSafariZoom, { passive: false });
    };

    bindHoldButton(
      'touch-gas',
      () => { this.keys.gas = true; },
      () => { this.keys.gas = false; }
    );
    bindHoldButton(
      'touch-brake',
      () => { this.keys.brake = true; },
      () => { this.keys.brake = false; }
    );
    bindHoldButton(
      'touch-left-btn',
      () => { this.keys.left = true; },
      () => { this.keys.left = false; }
    );
    bindHoldButton(
      'touch-right-btn',
      () => { this.keys.right = true; },
      () => { this.keys.right = false; }
    );
    bindHoldButton(
      'touch-selektor',
      () => { this.setHighBeam(true); },
      () => { this.setHighBeam(false); }
    );
    bindHoldButton(
      'touch-horn',
      () => {
        this.keys.horn = true;
        this.sound.setHorn(true);
      },
      () => {
        this.keys.horn = false;
        this.sound.setHorn(false);
      }
    );

    // 3. Direct Interactive Drag on the Photorealistic Audi Steering Wheel (#cockpit-canvas)
    const cockpitCanvas = document.getElementById('cockpit-canvas');
    if (cockpitCanvas) {
      let activePointerId = null;
      let startX = 0;

      // Prevent Safari from treating steering drag + pedal hold as a two-finger pinch zoom
      cockpitCanvas.addEventListener('touchstart', preventSafariZoom, { passive: false });
      cockpitCanvas.addEventListener('touchmove', preventSafariZoom, { passive: false });
      cockpitCanvas.addEventListener('touchend', preventSafariZoom, { passive: false });

      const updateWheelFromPointer = (clientX) => {
        const bounds = this.cockpit.wheelScreenBounds || { cx: window.innerWidth * 0.3, r: 120 };
        const maxDrag = Math.max(85, bounds.r * 1.15);
        const raw = (clientX - startX) / maxDrag;
        this.touchSteerValue = Math.max(-1, Math.min(1, raw));
      };

      cockpitCanvas.addEventListener('pointerdown', (e) => {
        if (this.paused) return;
        e.preventDefault();
        this.sound.init();
        activePointerId = e.pointerId;
        const bounds = this.cockpit.wheelScreenBounds;
        // If clicked near the Audi steering wheel, anchor relative to wheel center; otherwise relative to touch down point
        if (bounds && Math.hypot(e.clientX - bounds.cx, e.clientY - bounds.cy) < bounds.r * 1.45) {
          startX = bounds.cx;
        } else {
          startX = e.clientX;
        }
        try {
          cockpitCanvas.setPointerCapture(e.pointerId);
        } catch (_) {}
        updateWheelFromPointer(e.clientX);
      });

      cockpitCanvas.addEventListener('pointermove', (e) => {
        if (e.pointerId !== activePointerId) return;
        e.preventDefault();
        updateWheelFromPointer(e.clientX);
      });

      const releaseWheel = (e) => {
        if (e.pointerId !== activePointerId) return;
        activePointerId = null;
        this.touchSteerValue = 0;
      };

      cockpitCanvas.addEventListener('pointerup', releaseWheel);
      cockpitCanvas.addEventListener('pointercancel', releaseWheel);
      cockpitCanvas.addEventListener('lostpointercapture', releaseWheel);
    }

    // 4. DeviceOrientation (Tilt / Gyroscope) Support for Mobile
    window.addEventListener('deviceorientation', (e) => {
      if (this.steerMode !== 'tilt' || this.paused) return;
      const isLandscape = window.innerWidth > window.innerHeight;
      const rawTilt = isLandscape ? (e.beta || 0) : (e.gamma || 0);
      this.touchSteerValue = Math.max(-1, Math.min(1, rawTilt / 26));
    });
  }

  updateSteerModeUI() {
    const btnZone = document.getElementById('button-steer-zone');
    if (this.steerMode === 'buttons') {
      btnZone?.classList.remove('hidden');
    } else {
      btnZone?.classList.add('hidden');
    }
  }

  setHighBeam(active) {
    if (active && !this.keys.highBeam) {
      this.sound.playSelektorClick();
      this.traffic.notifyHighBeamFlash(this.playerX, 0);
      this.multiplayer.notifyLocalSelektor(this.playerX);
    }
    this.keys.highBeam = active;
    const ind = document.getElementById('ind-highbeam');
    if (ind) ind.classList.toggle('active', active);
  }

  syncWeatherUI(preset) {
    const iconEl = document.getElementById('weather-icon');
    const labelEl = document.getElementById('weather-label');
    if (iconEl) iconEl.textContent = preset.icon;
    if (labelEl) labelEl.textContent = preset.label;

    document.querySelectorAll('#weather-select-group .opt-card').forEach((card) => {
      card.classList.toggle('active', card.getAttribute('data-weather') === preset.key);
    });

    // Automatically turn on wipers in Rainy weather
    this.cockpit.toggleWipers(preset.rain);
    this.sound.setRainAmbience(preset.rain);
  }

  async setCockpitMode(mode) {
    const applied = await this.cockpit.setMode(mode, CAMERA_PRESETS[0].offset);
    document.querySelectorAll('#cockpit-mode-group .seg-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-cockpit') === applied);
    });
    // Persist what was asked for, not the fallback: a one-off 3D load failure (slow network,
    // memory pressure) must not pin the player to the photo cockpit on every later visit
    try {
      localStorage.setItem(COCKPIT_MODE_KEY, mode === '3d' ? '3d' : 'photo');
    } catch (_) {}
  }

  syncAmbientUI(key, cssColor) {
    const dot = document.getElementById('ambient-dot');
    if (dot) {
      dot.style.background = cssColor;
      dot.style.boxShadow = `0 0 8px ${cssColor}`;
    }
    document.querySelectorAll('#ambient-select-group .swatch').forEach((sw) => {
      sw.classList.toggle('active', sw.getAttribute('data-color') === key);
    });
  }

  syncMultiplayerUI({ connected, connecting, role, roomCode, message }) {
    const statusText = document.getElementById('mp-status-text');
    const codeBadge = document.getElementById('mp-active-code-badge');
    const codeVal = document.getElementById('mp-room-code-val');
    const hostBtn = document.getElementById('btn-mp-host');
    const joinBtn = document.getElementById('btn-mp-join');
    const leaveBtn = document.getElementById('btn-mp-leave');
    const hudCard = document.getElementById('mp-hud-card');
    const quickBtn = document.getElementById('btn-mp-quick');
    const quickLabel = document.getElementById('mp-quick-label');

    if (statusText && message) statusText.textContent = message;
    if (codeBadge && codeVal) {
      if (roomCode) {
        codeBadge.classList.remove('hidden');
        codeVal.textContent = roomCode;
      } else {
        codeBadge.classList.add('hidden');
      }
    }
    if (hostBtn) {
      if (role === 'host' && connected) {
        hostBtn.textContent = `🟢 Oda Aktif (${roomCode})`;
      } else if (role === 'host' && connecting) {
        hostBtn.textContent = `⏳ Bekleniyor (${roomCode})...`;
      } else {
        hostBtn.textContent = '🏁 ODA KUR (KOD AL)';
      }
    }
    if (joinBtn) {
      if (role === 'guest' && connected) {
        joinBtn.textContent = '🟢 Bağlandı!';
      } else if (role === 'guest' && connecting) {
        joinBtn.textContent = '⏳ Bağlanıyor...';
      } else {
        joinBtn.textContent = '🔗 ODAYA KATIL';
      }
    }
    if (leaveBtn) {
      leaveBtn.classList.toggle('hidden', !role);
    }
    if (hudCard) {
      hudCard.classList.toggle('hidden', !connected);
    }
    if (quickBtn) {
      quickBtn.classList.toggle('connected', Boolean(connected));
    }
    if (quickLabel) {
      quickLabel.textContent = connected ? `Oda: ${roomCode}` : '2 Kişilik';
    }
  }

  toggleSound() {
    const muted = this.sound.toggleMute();
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
  }

  togglePauseMenu() {
    this.paused = !this.paused;
    const overlay = document.getElementById('menu-overlay');
    if (overlay) {
      overlay.classList.toggle('hidden', !this.paused);
    }
  }

  resetRun() {
    this.score = 0;
    this.combo = 1.0;
    this.comboTimer = 0;
    this.health = 100;
    this.speedKmh = 95;
    this.playerX = -1.8;
    this.lateralVel = 0;
    this.yawRate = 0;
    this.headingAngle = 0;
    this.bodyRoll = 0;
    this.rollVel = 0;
    this.bodyPitch = 0;
    this.pitchVel = 0;
    this.traffic.resetTraffic();
    this.updateHUD();
  }

  triggerScreenFlash(className) {
    const vig = document.getElementById('screen-vignette');
    if (!vig) return;
    vig.classList.remove('near-miss-flash', 'double-makas-flash', 'crash-flash');
    void vig.offsetWidth;
    vig.classList.add(className);
    setTimeout(() => {
      vig.classList.remove(className);
    }, 320);
  }

  showMakasNotification(title, points, style = 'normal') {
    const feed = document.getElementById('makas-feed');
    if (!feed) return;

    const LIFETIME_MS = 1600;
    const pts = Math.round(points);
    const scheduleExit = (el) => {
      clearTimeout(el._exitTimer);
      el._exitTimer = setTimeout(() => {
        el.classList.add('leaving');
        setTimeout(() => el.remove(), 260);
      }, LIFETIME_MS);
    };

    // Same event back-to-back (e.g. a chain of MAKAS!) → merge into the newest chip
    // instead of stacking a new one: bump a ×N counter and sum the points.
    const key = title.replace(/\s*\(.*?\)/g, '');
    const newest = feed.firstElementChild;
    if (newest && !newest.classList.contains('leaving') && newest.dataset.key === key) {
      newest._count += 1;
      newest._pts += pts;
      newest.querySelector('.makas-title').textContent = title;
      newest.querySelector('.makas-count').textContent = `×${newest._count}`;
      newest.querySelector('.makas-pts').textContent = newest._pts > 0 ? `+${newest._pts}` : '';
      newest.classList.remove('bump');
      void newest.offsetWidth;
      newest.classList.add('bump');
      scheduleExit(newest);
      return;
    }

    const item = document.createElement('div');
    item.className = `makas-popup ${style}`;
    item.dataset.key = key;
    item._count = 1;
    item._pts = pts;

    // textContent (not innerHTML): titles can contain the remote peer's name
    const titleEl = document.createElement('span');
    titleEl.className = 'makas-title';
    titleEl.textContent = title;
    const countEl = document.createElement('span');
    countEl.className = 'makas-count';
    const ptsEl = document.createElement('span');
    ptsEl.className = 'makas-pts';
    ptsEl.textContent = pts > 0 ? `+${pts}` : '';
    item.append(titleEl, countEl, ptsEl);

    // Newest on top, older chips fade/shrink via CSS
    feed.prepend(item);
    while (feed.children.length > 3) {
      feed.lastElementChild.remove();
    }
    scheduleExit(item);
  }

  handleMakas({ lateralGap, speedKmh, isRazorClose, isDoubleMakas }) {
    // Increase combo multiplier (up to 10.0x)
    const comboStep = isDoubleMakas ? 1.5 : isRazorClose ? 1.0 : 0.5;
    this.combo = Math.min(10.0, this.combo + comboStep);
    this.comboTimer = 1.0;

    // Base score scales with speed & closeness
    const closenessFactor = Math.max(1, (1.8 - lateralGap) * 1.6);
    const speedFactor = speedKmh / 100;
    let basePts = 250 * closenessFactor * speedFactor;

    let label = 'MAKAS!';
    let style = 'normal';

    if (isDoubleMakas) {
      basePts *= 2.4;
      label = '🔥 ÇİFT MAKAS (İĞNE DELİĞİ)!';
      style = 'gold';
      this.triggerScreenFlash('double-makas-flash');
    } else if (isRazorClose) {
      basePts *= 1.5;
      label = `⚡ KUSURSUZ MAKAS (${Math.round(lateralGap * 100)} CM)`;
      style = 'gold';
      this.triggerScreenFlash('near-miss-flash');
    } else {
      this.triggerScreenFlash('near-miss-flash');
    }

    const totalPts = basePts * this.combo;
    this.score += totalPts;
    if (this.score > this.bestScore) {
      this.bestScore = Math.floor(this.score);
      localStorage.setItem('otoban_makas_best', String(this.bestScore));
    }

    this.shakeIntensity = Math.min(0.45, this.shakeIntensity + (isDoubleMakas ? 0.32 : 0.16));
    this.cockpit.triggerMakasCockpitPulse();
    this.sound.playMakasWhoosh(this.combo, isDoubleMakas);
    this.showMakasNotification(label, totalPts, style);
  }

  handleCollision() {
    this.combo = 1.0;
    this.comboTimer = 0;
    this.speedKmh = Math.max(55, this.speedKmh * 0.58);
    this.health = Math.max(0, this.health - 18);
    this.shakeIntensity = 0.85;
    this.rollVel += (Math.random() - 0.5) * 0.6;
    this.pitchVel -= 0.25;

    this.sound.playCrash();
    this.triggerScreenFlash('crash-flash');
    this.showMakasNotification('💥 SÜRTME / KAZA! KOMBO SIFIRLANDI', 0, 'danger');

    // Auto-repair slowly or reset if health hits 0
    if (this.health <= 0) {
      this.health = 100;
      this.score = Math.max(0, this.score - 1000);
    }
  }

  updatePhysics(dt) {
    // 1. Determine throttle & brake input
    const throttle = this.keys.gas ? 1.0 : 0.0;
    const brake = this.keys.brake ? 1.0 : 0.0;

    // Determine steering input (-1 left, +1 right)
    let rawSteer = 0;
    if (this.keys.left) rawSteer -= 1;
    if (this.keys.right) rawSteer += 1;
    if (Math.abs(this.touchSteerValue) > 0.02) {
      rawSteer = this.touchSteerValue;
    }

    // Progressive Speed-Sensitive Power Steering (Audi Dynamic Steering):
    // - Counter-steering (reversing direction) is extra crisp so driver can catch slides
    // - Self-centering caster return scales with forward speed when keys are released
    const speedRatio = Math.min(1, Math.max(0, (this.speedKmh - 50) / 190));
    const isCentering = Math.abs(rawSteer) < 0.02;
    const isCounterSteer = rawSteer * this.steerInput < -0.04;

    let steerRate;
    if (isCentering) {
      steerRate = 8.5 + speedRatio * 5.0; // Natural caster self-aligning torque
    } else if (isCounterSteer) {
      steerRate = 13.5 - speedRatio * 2.5; // Quick counter-steer response during makas transitions
    } else {
      steerRate = 7.8 - speedRatio * 2.4; // Heavier, more progressive rack feel at 200+ km/h
    }
    this.steerInput = THREE.MathUtils.lerp(this.steerInput, rawSteer, Math.min(1, dt * steerRate));

    // 2. Longitudinal Speed (KM/H)
    // Top speed capped at 240 km/h; natural highway coasting minimum ~ 48 km/h
    const maxSpeed = 240;
    const minSpeed = 48;

    // Resistance grows with the square of speed (aero drag) plus a small rolling term,
    // so the car pulls hard in town but has to fight the air past ~200 km/h.
    const AERO_DRAG = 0.00036; // km/h/s per (km/h)^2
    const ROLLING_DRAG = 1.5;
    const resistance = AERO_DRAG * this.speedKmh * this.speedKmh + ROLLING_DRAG;

    let accelKmhPerSec = 0;
    if (throttle > 0) {
      // Constant-power engine: thrust ~ P / v, capped by tyre traction at low speed.
      // ~1.3 s 48→100, ~4 s 100→200, ~8 s 200→240 (power meets drag just above the limiter)
      const ENGINE_POWER = 5600;
      const TRACTION_LIMIT = 44;
      const thrust = Math.min(TRACTION_LIMIT, ENGINE_POWER / Math.max(1, this.speedKmh));
      accelKmhPerSec = thrust - resistance;
    } else if (brake > 0) {
      accelKmhPerSec = -115; // Strong Brembo sport brakes
    } else {
      // Off throttle: engine braking + drag (bleeds speed faster at 200+), gentle creep up to 85 km/h cruise
      accelKmhPerSec = this.speedKmh > 85 ? -(6 + resistance) : 12;
    }

    // Slight cornering scrub when carving aggressively at high G
    const corneringDrag = Math.abs(this.lateralG) * 4.2;
    accelKmhPerSec -= corneringDrag;

    const prevSpeed = this.speedKmh;
    this.speedKmh = Math.max(minSpeed, Math.min(maxSpeed, this.speedKmh + accelKmhPerSec * dt));
    this.longitudinalG = THREE.MathUtils.lerp(
      this.longitudinalG,
      (this.speedKmh - prevSpeed) / (Math.max(0.001, dt) * 90),
      Math.min(1, dt * 12)
    );

    // 3. 7-Speed Sport Automatic Transmission & RPM Calculation (Tuned for 240 km/h max)
    const gearMaxSpeeds = [0, 50, 82, 114, 146, 178, 210, 242];
    let targetGear = 1;
    for (let g = 1; g <= 7; g++) {
      if (this.speedKmh <= gearMaxSpeeds[g] || g === 7) {
        targetGear = g;
        break;
      }
    }

    if (targetGear !== this.gear) {
      this.sound.triggerGearShift(targetGear > this.gear);
      this.gear = targetGear;
    }

    const gearLow = gearMaxSpeeds[this.gear - 1] * 0.62;
    const gearHigh = gearMaxSpeeds[this.gear];
    const gearProgress = (this.speedKmh - gearLow) / Math.max(1, gearHigh - gearLow);
    const targetRpm = 1850 + Math.max(0, Math.min(1.05, gearProgress)) * 5850 + throttle * 250;
    this.rpm = THREE.MathUtils.lerp(this.rpm, targetRpm, Math.min(1, dt * 14));

    // 4. Realistic Lateral Vehicle Dynamics (Smooth Yaw, Tire Grip & Rock-Solid Straight-Line Stability)
    const speedMs = this.speedKmh / 3.6;
    const wetFactor = this.world.weatherKey === 'rain' ? 0.85 : 1.0;

    // Target chassis heading angle (narrows at high speed for stability)
    const maxHeadingAngle = 0.14 - speedRatio * 0.05; // ~8 deg at low speed, ~5 deg at 240 km/h
    const targetHeading = this.steerInput * maxHeadingAngle;

    // Critically damped yaw response (no oscillation/fishtailing when driving straight)
    const headingRate = isCentering ? 11.5 + speedRatio * 3.5 : (8.2 + speedRatio * 2.0) * wetFactor;
    this.headingAngle = THREE.MathUtils.lerp(
      this.headingAngle,
      targetHeading,
      Math.min(1, dt * headingRate)
    );
    if (isCentering && Math.abs(this.headingAngle) < 0.0008) {
      this.headingAngle = 0;
    }
    this.yawRate = (targetHeading - this.headingAngle) * headingRate;

    // Lateral velocity follows nose heading + front tire cornering force + highway curve centrifugal drift
    const curveKappa = this.world.getCurrentCurvature(); // + = right curve ahead, - = left curve ahead
    const centrifugalDriftVel = -curveKappa * speedMs * 21.0;

    const steerLatVel =
      Math.sin(this.headingAngle) * speedMs * 0.62 + this.steerInput * (3.4 + speedRatio * 1.6);
    const desiredLatVel = steerLatVel + centrifugalDriftVel;
    const prevLatVel = this.lateralVel;
    const tireCorneringStiffness = isCentering
      ? 12.5 * wetFactor
      : (9.2 - speedRatio * 1.4) * wetFactor;
    this.lateralVel = THREE.MathUtils.lerp(
      this.lateralVel,
      desiredLatVel,
      Math.min(1, dt * tireCorneringStiffness)
    );
    if (isCentering && Math.abs(curveKappa) < 0.0003 && Math.abs(this.lateralVel) < 0.01) {
      this.lateralVel = 0;
    }
    this.playerX += this.lateralVel * dt;

    // Smooth lateral G-force (includes steady cornering load inside highway curves, 0 on straightaways)
    const latAccelG = (this.lateralVel - prevLatVel) / (Math.max(0.001, dt) * 24.0);
    const rawLatG = (this.lateralVel - centrifugalDriftVel * 0.75) / 9.8 + latAccelG * 0.25;
    this.lateralG = THREE.MathUtils.lerp(this.lateralG, rawLatG, Math.min(1, dt * 12));
    if (isCentering && Math.abs(curveKappa) < 0.0003 && Math.abs(this.lateralG) < 0.005) {
      this.lateralG = 0;
    }

    // Keep car inside highway barriers (-7.35m to +7.35m)
    const maxLateralX = ROAD_HALF_WIDTH - 1.05;
    if (Math.abs(this.playerX) > maxLateralX) {
      this.playerX = Math.sign(this.playerX) * maxLateralX;
      this.lateralVel *= -0.3;
      this.headingAngle *= 0.3;
      this.rollVel += -Math.sign(this.playerX) * 0.2;
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.22);
      // Slight speed scrub on barrier scrape
      this.speedKmh = Math.max(60, this.speedKmh - 28 * dt);
    }

    // 5. Critically Damped Suspension Dynamics (Smooth Weight Transfer, Zero Straight-Line Bounce)
    const targetRoll = THREE.MathUtils.clamp(-this.lateralG * 0.028, -0.042, 0.042);
    const rollSpring = 110.0;
    const rollDamping = 24.0; // Critically damped (> 2*sqrt(110)) so it never oscillates when straight
    const rollAccel = (targetRoll - this.bodyRoll) * rollSpring - this.rollVel * rollDamping;
    this.rollVel += rollAccel * dt;
    this.bodyRoll += this.rollVel * dt;
    if (isCentering && Math.abs(this.bodyRoll) < 0.0004 && Math.abs(this.rollVel) < 0.002) {
      this.bodyRoll = 0;
      this.rollVel = 0;
    }

    // Only pitch during active throttle or braking; dead-flat when cruising straight
    const activeLongG = throttle > 0 || brake > 0 ? this.longitudinalG : 0;
    const targetPitch = THREE.MathUtils.clamp(activeLongG * 0.011, -0.022, 0.018);
    const pitchSpring = 95.0;
    const pitchDamping = 22.0; // Critically damped
    const pitchAccel = (targetPitch - this.bodyPitch) * pitchSpring - this.pitchVel * pitchDamping;
    this.pitchVel += pitchAccel * dt;
    this.bodyPitch += this.pitchVel * dt;

    // Move cockpit 3D group laterally (keep group rotation neutral so camera doesn't double-rotate)
    this.cockpit.group.position.x = this.playerX;
    this.cockpit.group.rotation.set(0, 0, 0);

    // 6. Driver Head Camera Movement (Rock-solid on straightaways, natural lean in turns)
    const preset = CAMERA_PRESETS[this.cameraPresetIndex];
    const shakeX = (Math.random() - 0.5) * 0.024 * this.shakeIntensity;
    const shakeY = (Math.random() - 0.5) * 0.024 * this.shakeIntensity;
    this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 2.8);

    this.camera.position.x = preset.offset.x - this.lateralG * 0.022 + shakeX;
    this.camera.position.y = preset.offset.y + shakeY;
    this.camera.position.z =
      preset.offset.z - Math.max(-0.35, Math.min(0.35, activeLongG)) * 0.018;

    // Camera yaw & roll reflect smooth vehicle nose heading and suspension lean
    this.camera.rotation.y = -this.headingAngle * 0.52;
    this.camera.rotation.z = this.bodyRoll * 0.75;
    this.camera.rotation.x = this.bodyPitch * 0.65;

    // Speed-based FOV warp for intense sense of speed above 140 km/h
    const speedFovBoost = Math.max(0, (this.speedKmh - 100) / 200) * 11;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, preset.baseFov + speedFovBoost, dt * 6);
    this.camera.updateProjectionMatrix();

    // 7. Continuous High-Speed Scoring & Combo Decay
    this.odometerKm += (speedMs * dt) / 1000;

    if (this.speedKmh > 120) {
      this.score += (this.speedKmh - 100) * 0.35 * this.combo * dt;
      if (this.score > this.bestScore) {
        this.bestScore = Math.floor(this.score);
      }
    }

    if (this.combo > 1.0) {
      this.comboTimer -= dt * 0.22; // ~4.5 seconds to chain the next Makas!
      if (this.comboTimer <= 0) {
        this.combo = 1.0;
        this.comboTimer = 0;
      }
    }

    // Slow passive health recovery when driving cleanly
    if (this.health < 100) {
      this.health = Math.min(100, this.health + dt * 2.5);
    }

    // 8. Update Multiplayer, World (synced with highway distance), Traffic, Cockpit & Sound
    this.multiplayer.update(
      dt,
      {
        playerX: this.playerX,
        speedKmh: this.speedKmh,
        headingAngle: this.headingAngle,
        bodyRoll: this.bodyRoll,
        highBeam: this.keys.highBeam,
        braking: brake > 0,
        horn: this.keys.horn,
        score: this.score,
        combo: this.combo,
      },
      this.world
    );

    this.world.update(
      dt,
      speedMs,
      this.playerX,
      this.keys.highBeam,
      this.multiplayer.localWorldDistM
    );

    this.traffic.update(
      dt,
      this.speedKmh,
      this.playerX,
      {
        onMakas: (data) => this.handleMakas(data),
        onCollision: (car) => {
          this.multiplayer.notifyLocalCarHit(car);
          this.handleCollision();
        },
      },
      this.world,
      this.multiplayer.getTrafficContext()
    );

    const radarCars = this.traffic.getRadarSnapshot(this.playerX);

    // If connected to a friend, add their car to the Audi MMI Radar & check for Tandem Makas!
    if (this.multiplayer.connected) {
      const peer = this.multiplayer.remote;
      radarCars.push({
        x: peer.x,
        relX: peer.x - this.playerX,
        relZ: peer.relZ,
        isPeer: true,
      });

      const nowSec = performance.now() / 1000;
      if (
        this.speedKmh >= 115 &&
        Math.abs(peer.relZ) < 2.8 &&
        Math.abs(peer.x - this.playerX) > 1.75 &&
        Math.abs(peer.x - this.playerX) < 3.6 &&
        nowSec - this.lastTandemTime > 3.5
      ) {
        this.lastTandemTime = nowSec;
        const tandemPts = 400 * this.combo;
        this.score += tandemPts;
        this.combo = Math.min(10.0, this.combo + 0.5);
        this.comboTimer = 1.0;
        this.sound.playMakasWhoosh(this.combo, true);
        this.showMakasNotification(
          `🤝 ${peer.name} İLE TANDEM MAKAS!`,
          tandemPts,
          'gold'
        );
      }
    }

    // Proximity warning indicator if closing fast on a car ahead
    const dangerAhead = radarCars.some(
      (c) => c.relZ < 0 && c.relZ > -22 && Math.abs(c.relX) < 1.75
    );
    const indDanger = document.getElementById('ind-danger');
    if (indDanger) indDanger.classList.toggle('active', dangerAhead);

    this.cockpit.update(
      dt,
      {
        speedKmh: this.speedKmh,
        rpm: this.rpm,
        gear: this.gear,
        steerInput: this.steerInput,
        throttle,
        highBeam: this.keys.highBeam,
        combo: this.combo,
        comboTimer: this.comboTimer,
        score: this.score,
        odometerKm: this.odometerKm,
        lateralG: this.lateralG,
        bodyRoll: this.bodyRoll,
        bodyPitch: this.bodyPitch,
        cabinNight: Boolean(WEATHER_PRESETS[this.world.weatherKey]?.streetlightsOn),
      },
      radarCars
    );

    this.sound.updateEngine(this.rpm, throttle, this.speedKmh, this.paused, this.lateralG);
    this.updateHUD();
  }

  // Writes to the DOM only when a value actually changed: the HUD is refreshed every frame,
  // and redundant textContent/style writes still force style recalculation
  setHudText(id, value) {
    const el = this.hudEls[id] ?? (this.hudEls[id] = document.getElementById(id));
    if (el && this.hudCache[id] !== value) {
      this.hudCache[id] = value;
      el.textContent = value;
    }
  }

  setHudStyle(id, prop, value) {
    const el = this.hudEls[id] ?? (this.hudEls[id] = document.getElementById(id));
    const key = `${id}.${prop}`;
    if (el && this.hudCache[key] !== value) {
      this.hudCache[key] = value;
      el.style[prop] = value;
    }
  }

  updateHUD() {
    this.hudEls ??= {};
    this.hudCache ??= {};

    this.setHudText('hud-score', Math.floor(this.score).toLocaleString('tr-TR'));
    this.setHudText('hud-best', Math.floor(this.bestScore).toLocaleString('tr-TR'));
    this.setHudText('hud-combo', `${this.combo.toFixed(1)}x`);
    this.setHudStyle(
      'hud-combo-bar',
      'width',
      `${Math.round(Math.max(0, Math.min(100, this.comboTimer * 100)))}%`
    );
    const hot = this.combo >= 4.0;
    if (this.hudCache.comboHot !== hot) {
      this.hudCache.comboHot = hot;
      document.getElementById('combo-card')?.classList.toggle('hot', hot);
    }

    this.setHudStyle('hud-health-bar', 'width', `${Math.round(this.health)}%`);
    this.setHudStyle(
      'hud-health-bar',
      'background',
      this.health > 50
        ? 'linear-gradient(90deg, #00ff88, #00d4ff)'
        : 'linear-gradient(90deg, #ff2a4b, #ffae00)'
    );

    this.setHudText('mini-speed', String(Math.round(this.speedKmh)));
    this.setHudText('mini-gear', `S${this.gear}`);

    // Update Live 2-Player HUD Card
    if (this.multiplayer && this.multiplayer.connected) {
      const peer = this.multiplayer.remote;
      this.setHudText('mp-peer-name', `🟢 ${peer.name.toUpperCase()}`);

      const distM = Math.round(Math.abs(peer.relZ));
      if (distM <= 4) {
        this.setHudText('mp-peer-dist', '🔥 YAN YANA!');
      } else if (peer.relZ < 0) {
        this.setHudText('mp-peer-dist', `ÖNÜNDE ${distM}m`);
      } else {
        this.setHudText('mp-peer-dist', `🪞 ARKANDA ${distM}m`);
      }
      this.setHudText(
        'mp-peer-stats',
        `${Math.round(peer.speedKmh)} KM/S • ${peer.combo.toFixed(1)}x • ${Math.floor(peer.score).toLocaleString('tr-TR')} P`
      );
    }
  }

  // Small on-screen FPS / render scale / draw-call readout (P key, or ?fps in the URL)
  toggleFpsMeter() {
    if (this.fpsMeter) {
      this.fpsMeter.remove();
      this.fpsMeter = null;
      return;
    }
    this.fpsMeter = document.createElement('div');
    this.fpsMeter.className = 'fps-meter';
    this.fpsMeter.textContent = '… FPS';
    document.body.appendChild(this.fpsMeter);
  }

  // Evaluated once per second of frames. Below ~48 FPS the render scale drops a step; after
  // 5 smooth seconds it climbs back a step. If a climb immediately causes a drop again, the
  // lower scale becomes the new ceiling so the resolution does not keep oscillating.
  adaptRenderScale(frameSec) {
    const p = this.perf;
    if (frameSec > 1) return; // tab was in the background: not a representative frame
    p.frames += 1;
    p.elapsed += frameSec;
    p.calls += this.renderer.info.render.calls;
    if (p.elapsed < 1) return;

    const fps = p.frames / p.elapsed;
    const calls = Math.round(p.calls / p.frames);
    p.window += 1;
    p.frames = 0;
    p.elapsed = 0;
    p.calls = 0;

    if (this.fpsMeter) {
      this.fpsMeter.textContent = `${Math.round(fps)} FPS · ${this.pixelRatio.toFixed(2)}x · ${calls} çizim`;
    }

    if (p.settle > 0) {
      p.settle -= 1; // let the resize hitch pass before judging the new scale
      return;
    }

    const STEP = 0.25;
    let next = this.pixelRatio;
    if (fps < 48 && this.pixelRatio > this.minPixelRatio) {
      if (p.window - p.lastRaise <= 3) {
        this.maxPixelRatio = Math.max(this.minPixelRatio, this.pixelRatio - STEP);
      }
      next = Math.max(this.minPixelRatio, this.pixelRatio - STEP);
      p.goodWindows = 0;
    } else if (fps >= 57) {
      p.goodWindows += 1;
      if (p.goodWindows >= 5 && this.pixelRatio < this.maxPixelRatio) {
        next = Math.min(this.maxPixelRatio, this.pixelRatio + STEP);
        p.lastRaise = p.window;
        p.goodWindows = 0;
      }
    } else {
      p.goodWindows = 0;
    }

    if (next !== this.pixelRatio) {
      this.pixelRatio = next;
      this.renderer.setPixelRatio(next);
      p.settle = 1;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const frameSec = (now - this.lastTime) / 1000;
    const dt = Math.min(0.05, frameSec);
    this.lastTime = now;
    this.adaptRenderScale(frameSec);
    this.renderer.info.reset();

    if (!this.paused) {
      this.updatePhysics(dt);
    } else {
      // Even when paused on the start menu, keep multiplayer synced and render an idle preview!
      this.multiplayer.update(
        dt,
        {
          playerX: this.playerX,
          speedKmh: 0,
          headingAngle: 0,
          bodyRoll: 0,
          highBeam: false,
          braking: false,
          horn: false,
          score: this.score,
          combo: this.combo,
        },
        this.world
      );
      this.world.update(dt * 0.35, 22, this.playerX, false, this.multiplayer.localWorldDistM);
      const radarCars = this.traffic.getRadarSnapshot(this.playerX);
      this.cockpit.update(
        dt,
        {
          speedKmh: 88,
          rpm: 2100 + Math.sin(now * 0.004) * 80,
          gear: 3,
          steerInput: Math.sin(now * 0.0012) * 0.08,
          throttle: 0.2,
          highBeam: false,
          combo: 1.0,
          comboTimer: 0,
          score: this.score,
          odometerKm: this.odometerKm,
          lateralG: 0,
          cabinNight: Boolean(WEATHER_PRESETS[this.world.weatherKey]?.streetlightsOn),
        },
        radarCars
      );
      this.sound.updateEngine(900, 0, 0, true);
      this.updateHUD();
    }

    // 1. Render real-time Rear-View & Wing Mirror texture
    this.cockpit.renderRearMirror(this.scene);

    // 2. Render main First-Person Cockpit Camera
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new OtobanMakasGame();
});
