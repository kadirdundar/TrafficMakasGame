import * as THREE from 'three';
import { SoundEngine } from './audio.js';
import { CarCockpit, AMBIENT_COLORS } from './cockpit.js';
import { HighwayWorld, MIRROR_SKIP_LAYER, ROAD_MODES, WEATHER_PRESETS } from './world.js';
import { TrafficManager } from './traffic.js';
import { MAX_PLAYERS, MultiplayerManager, SLOT_START_X, SLOT_STYLES } from './multiplayer.js';
import { A8Showroom } from './showroom.js';
import { RadioPlayer } from './radio.js';

// Two-way road start positions per room slot: our lane, or just inside the shoulder beside it
const TWO_WAY_START_X = [1.8, 3.0, 1.8, 3.0];
// İstanbul Park track grid starting positions per room slot
const TRACK_START_X = [-2.4, 2.4, -4.6, 4.6];

// Audi A8 drivetrain: ZF 8HP gear ratios, final drive and 20" wheel rolling circumference
const A8_GEAR_RATIOS = [0, 5.0, 3.2, 2.14, 1.72, 1.31, 1.0, 0.82, 0.64];
const A8_FINAL_DRIVE = 2.85;
const A8_WHEEL_CIRCUMFERENCE_M = 2.23;
const A8_IDLE_RPM = 700;

export const CAR_CONFIGS = {
  a8: {
    id: 'a8',
    make: 'AUDI',
    model: 'A8',
    variant: 'D5 · quattro',
  },
  bmw: {
    id: 'bmw',
    make: 'BMW',
    model: '520',
    variant: 'G30 · M Sport',
  },
};

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
    this.hudEls = {};
    this.hudCache = {};

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
    this.radio = new RadioPlayer({
      onTrackChange: (track) => {
        this.showMakasNotification(`📻 HÜZÜN RADYOSU: ${track.title}`, 0, 'gold');
        this.syncRadioUI();
      },
      onStateChange: (isPlaying) => {
        this.syncRadioUI();
        if (!isPlaying) {
          this.showMakasNotification('📻 RADYO KAPATILDI', 0, 'normal');
        }
      },
    });
    this.multiplayer = new MultiplayerManager(this.scene, this.traffic, {
      onStatusChange: (status) => this.syncMultiplayerUI(status),
      onMatchReady: ({ remoteName, slot }) => {
        // Automatically launch everyone onto the highway side-by-side, one lane per slot
        this.playerX = this.startX(slot);
        this.speedKmh = 0; // everyone starts from a standstill
        this.lateralVel = 0;
        this.headingAngle = 0;
        this.sound.init();
        this.sound.setRainAmbience(this.world.weatherKey === 'rain');
        this.setMenuOpen(false);
        this.showResumeButtons();
        this.showMakasNotification(
          `🏁 ${remoteName} BAĞLANDI! BERABER SÜRÜŞ BAŞLADI!`,
          0,
          'gold'
        );
      },
      onPlayerJoined: ({ name }) => {
        this.showMakasNotification(`🏁 ${name} ODAYA KATILDI!`, 0, 'gold');
      },
      onPlayerLeft: ({ name }) => {
        this.showMakasNotification(`👋 ${name} ODADAN AYRILDI`, 0, 'normal');
      },
      onHostChanged: ({ name, isMe }) => {
        this.showMakasNotification(
          isMe ? '👑 ODA KURUCUSU ARTIK SENSİN' : `👑 YENİ ODA KURUCUSU: ${name}`,
          0,
          'gold'
        );
      },
      onPeerHorn: ({ name }) => {
        this.showMakasNotification(`📯 ${name} KORNA ÇALDI!`, 50, 'normal');
      },
      onRoadModeSync: (mode) => this.setRoadMode(mode, { fromHost: true }),
      onWeatherSync: (weatherKey) => {
        if (weatherKey && weatherKey !== this.world.weatherKey) {
          const preset = this.world.applyWeather(weatherKey);
          this.syncWeatherUI(preset);
        }
      },
    });
    this.lastTandemTime = 0;

    // Start-menu garage with the rotatable car. Optional: the game runs without it if a second
    // WebGL context is not available.
    this.selectedCar = localStorage.getItem('otoban_selected_car') || 'a8';
    if (!CAR_CONFIGS[this.selectedCar]) this.selectedCar = 'a8';

    try {
      this.showroom = new A8Showroom(
        document.getElementById('garage-canvas'),
        document.getElementById('garage-stage'),
        {
          paintHex: SLOT_STYLES[0].paint,
          accent: AMBIENT_COLORS[this.cockpit.ambientKey]?.css,
          carType: this.selectedCar,
          onReady: (ok) => document.getElementById('garage-loader')?.classList.add(ok ? 'done' : 'failed'),
        }
      );
    } catch (err) {
      console.warn('Garaj başlatılamadı', err);
      this.showroom = null;
      document.getElementById('garage-loader')?.classList.add('failed');
    }
    this.syncedPaintSlot = null;
    this.lastCoveredRender = 0;

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

    this.playerX = -1.8; // Start in left-center fast lane (two-way road: see setRoadMode below)
    this.overtakeRun = null; // two-way road: an excursion into the oncoming lane (see updateOvertakeRun)
    this.lateralVel = 0;
    this.yawRate = 0; // rad/s chassis yaw angular velocity
    this.headingAngle = 0; // rad chassis slip/heading angle relative to highway
    this.bodyRoll = 0; // rad suspension roll angle (spring-damper)
    this.rollVel = 0;
    this.bodyPitch = 0; // rad suspension pitch angle (spring-damper)
    this.pitchVel = 0;
    this.speedKmh = 0; // the car waits at a standstill until the gas is pressed
    this.rpm = 2200;
    this.gear = 3;
    this.lastShiftAt = 0;
    this.lateralG = 0;
    this.longitudinalG = 0;
    this.accelFeel = 0; // felt acceleration that pushes the driver into the seat (see updatePhysics)
    this.shakeIntensity = 0;

    // Track Lap & Timing State (İstanbul Park)
    this.currentLap = 1;
    this.lapStartTime = performance.now();
    this.lastLapTime = 0;
    this.bestLapTime = Number(localStorage.getItem('otoban_track_best_lap') || 0);
    this.lastAnnouncedTurn = '';
    this.lastApexTurn = '';

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
    this.touchThrottle = 0; // 0 to 1 from the analog drive pedal (pushing up)
    this.touchBrake = 0; // 0 to 1 from the analog drive pedal (pulling down)
    this.steerMode = 'wheel'; // 'wheel' | 'buttons' | 'tilt'
    this.tiltBaseline = null;
    this.steerInput = 0;

    this.lastTime = performance.now();
    this.perf = { frames: 0, elapsed: 0, calls: 0, window: 0, goodWindows: 0, lastRaise: -10, settle: 0 };
    this.fpsMeter = null;
    this.lastZone = undefined;
    // Road layout chosen last time (motorway by default)
    let savedRoad = null;
    try {
      savedRoad = localStorage.getItem('otoban_makas_road');
    } catch (_) {}
    if (ROAD_MODES.includes(savedRoad)) this.setRoadMode(savedRoad);

    const params = new URLSearchParams(window.location.search);
    if (params.has('fps')) this.toggleFpsMeter();
    if (params.has('tunel')) this.multiplayer.localWorldDistM = 5440;
    if (params.has('kopru')) this.multiplayer.localWorldDistM = 12440;

    this.bindEvents();
    this.setupAppMode();
    this.updateHUD();
    this.setMenuOpen(true);
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
    document.querySelectorAll('#camera-preset-group .seg-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.camera) === this.cameraPresetIndex);
    });
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
        this.catchUpToFriend();
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
        this.toggleRadio();
      }
      if (code === 'KeyN') {
        this.nextRadioTrack();
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
      this.setMenuOpen(true, 'online');
    });

    document.getElementById('btn-mp-catchup')?.addEventListener('click', () => this.catchUpToFriend());

    // Multiplayer Lobby Buttons (up to MAX_PLAYERS in one room)
    const nameInput = document.getElementById('mp-player-name');
    if (nameInput && localStorage.getItem('otoban_player_name')) {
      nameInput.value = localStorage.getItem('otoban_player_name');
    }

    document.getElementById('btn-mp-host')?.addEventListener('click', () => {
      this.enterAppFullscreen();
      const playerName = nameInput?.value || 'OYUNCU 1';
      this.multiplayer.hostRoom(playerName);
    });

    document.getElementById('btn-mp-join')?.addEventListener('click', () => {
      this.enterAppFullscreen();
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

    document.getElementById('btn-radio')?.addEventListener('click', () => {
      this.toggleRadio();
    });

    document.getElementById('btn-sound')?.addEventListener('click', () => {
      this.toggleSound();
    });

    document.getElementById('btn-pause')?.addEventListener('click', () => {
      this.togglePauseMenu();
    });

    // Start / Resume & Reset Buttons in Modal
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
      this.enterAppFullscreen();
      if (nameInput?.value) {
        this.multiplayer.setPlayerName(nameInput.value);
      }
      if (this.multiplayer.connected) {
        this.multiplayer.catchUpToPeer();
      }
      this.sound.init();
      this.sound.setRainAmbience(this.world.weatherKey === 'rain');
      this.setMenuOpen(false);
      this.showResumeButtons();
    });

    document.getElementById('btn-reset-car')?.addEventListener('click', () => {
      this.resetRun();
      this.setMenuOpen(false);
    });

    // Menu tabs
    document.querySelectorAll('.panel-tab').forEach((tab) => {
      tab.addEventListener('click', () => this.showMenuTab(tab.dataset.tab));
    });

    // Garage: car model selection, camera angles, lights, turntable and the online paint preview
    document.querySelectorAll('#garage-car-select .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.setCar(btn.dataset.car);
      });
    });
    this.setCar(this.selectedCar, false);

    document.querySelectorAll('#garage-view-group .chip').forEach((chip) => {
      chip.addEventListener('click', () => this.showroom?.goToView(chip.dataset.view));
    });
    const bindToggleChip = (id, onToggle) => {
      const chip = document.getElementById(id);
      chip?.addEventListener('click', () => {
        const on = chip.getAttribute('aria-pressed') !== 'true';
        chip.setAttribute('aria-pressed', String(on));
        onToggle(on);
      });
    };
    // Reduced motion: the turntable stands still until switched on
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showroom?.setAutoRotate(false);
      document.getElementById('garage-spin')?.setAttribute('aria-pressed', 'false');
    }
    bindToggleChip('garage-lights', (on) => this.showroom?.setLights(on));
    bindToggleChip('garage-spin', (on) => this.showroom?.setAutoRotate(on));
    document.getElementById('garage-flash')?.addEventListener('click', () => this.showroom?.flashHighBeam());
    document.querySelectorAll('#garage-paint-group .paint-swatch').forEach((sw) => {
      sw.addEventListener('click', () => this.setGaragePaint(Number(sw.dataset.paint)));
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
        // iOS only delivers orientation events after an explicit permission prompt, which
        // must be triggered from a user gesture like this click
        if (this.steerMode === 'tilt' && typeof DeviceOrientationEvent?.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission().catch(() => {});
        }
      });
    });

    document.querySelectorAll('#camera-preset-group .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.applyCameraPreset(Number(btn.dataset.camera)));
    });

    document.querySelectorAll('#road-mode-group .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.setRoadMode(btn.dataset.road, { remember: true }));
    });

    document.querySelectorAll('#traffic-density-group .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#traffic-density-group .seg-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.traffic.setDensity(btn.getAttribute('data-density'));
      });
    });

    this.loadCockpit3D();

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

    this.bindAnalogGasPedal(preventSafariZoom);
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

    // 3. Floating thumb steering pad on the cockpit canvas (anywhere not covered by a button)
    // The anchor is wherever the thumb lands, so touching down never jerks the car; a short
    // horizontal swipe gives full lock, and dragging past full lock drags the anchor along so
    // swinging back counter-steers immediately (works in landscape with the left thumb).
    const cockpitCanvas = document.getElementById('cockpit-canvas');
    if (cockpitCanvas) {
      let activePointerId = null;
      let anchorX = 0;
      const padIndicator = document.createElement('div');
      padIndicator.className = 'steer-pad hidden';
      padIndicator.innerHTML = '<div class="steer-pad-knob"></div>';
      document.body.appendChild(padIndicator);
      const padKnob = padIndicator.firstElementChild;

      // Thumb travel for full lock: ~11% of the screen width, 70-120 px
      const fullLockPx = () => Math.max(70, Math.min(120, window.innerWidth * 0.11));

      // Prevent Safari from treating steering drag + pedal hold as a two-finger pinch zoom
      cockpitCanvas.addEventListener('touchstart', preventSafariZoom, { passive: false });
      cockpitCanvas.addEventListener('touchmove', preventSafariZoom, { passive: false });
      cockpitCanvas.addEventListener('touchend', preventSafariZoom, { passive: false });

      const updateSteerFromPointer = (clientX) => {
        const range = fullLockPx();
        if (clientX - anchorX > range) anchorX = clientX - range;
        if (clientX - anchorX < -range) anchorX = clientX + range;
        const value = (clientX - anchorX) / range;
        this.touchSteerValue = Math.max(-1, Math.min(1, value));
        padIndicator.style.left = `${anchorX}px`;
        padKnob.style.transform = `translateX(${this.touchSteerValue * (range / 2)}px)`;
      };

      cockpitCanvas.addEventListener('pointerdown', (e) => {
        if (this.paused || activePointerId !== null) return;
        e.preventDefault();
        this.sound.init();
        activePointerId = e.pointerId;
        anchorX = e.clientX;
        try {
          cockpitCanvas.setPointerCapture(e.pointerId);
        } catch (_) {}
        padIndicator.style.top = `${e.clientY}px`;
        padIndicator.style.setProperty('--pad-w', `${fullLockPx()}px`);
        padIndicator.classList.toggle('hidden', e.pointerType === 'mouse');
        updateSteerFromPointer(e.clientX);
      });

      cockpitCanvas.addEventListener('pointermove', (e) => {
        if (e.pointerId !== activePointerId) return;
        e.preventDefault();
        updateSteerFromPointer(e.clientX);
      });

      const releaseWheel = (e) => {
        if (e.pointerId !== activePointerId) return;
        activePointerId = null;
        this.touchSteerValue = 0;
        padIndicator.classList.add('hidden');
      };

      cockpitCanvas.addEventListener('pointerup', releaseWheel);
      cockpitCanvas.addEventListener('pointercancel', releaseWheel);
      cockpitCanvas.addEventListener('lostpointercapture', releaseWheel);
    }

    // 4. DeviceOrientation (Tilt / Gyroscope) Support for Mobile
    window.addEventListener('deviceorientation', (e) => {
      if (this.steerMode !== 'tilt' || this.paused) return;
      // In landscape the steering tilt is beta, whose sign flips between the two landscape
      // orientations (device top on the left at 90°, on the right at 270° / -90°)
      const angle = screen.orientation?.angle ?? window.orientation ?? 0;
      const isLandscape = window.innerWidth > window.innerHeight;
      const landscapeSign = angle === 270 || angle === -90 ? -1 : 1;
      const rawTilt = isLandscape ? (e.beta || 0) * landscapeSign : (e.gamma || 0);
      this.touchSteerValue = Math.max(-1, Math.min(1, rawTilt / 26));
    });
  }

  // App mode: installable to the home screen (fullscreen + landscape via the manifest),
  // fullscreen + landscape lock in the browser where allowed, and a paused game while the
  // phone is held upright (the rotate screen covers it then)
  setupAppMode() {
    // Installability needs a service worker; ours caches nothing (see public/sw.js)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
    }

    // Chrome / Android: keep the browser's install offer for our own button
    const installBtn = document.getElementById('btn-install-app');
    let installPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      installPrompt = e;
      installBtn?.classList.remove('hidden');
    });
    installBtn?.addEventListener('click', async () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      await installPrompt.userChoice.catch(() => null);
      installPrompt = null;
      installBtn.classList.add('hidden');
    });
    window.addEventListener('appinstalled', () => installBtn?.classList.add('hidden'));

    // iPhone / iPad Safari has no install prompt: tell how to add it to the home screen
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS && !this.isInstalledApp()) {
      document.getElementById('ios-install-hint')?.classList.remove('hidden');
    }

    const portrait = window.matchMedia('(orientation: portrait) and (pointer: coarse)');
    this.portraitPhone = portrait;
    portrait.addEventListener('change', () => {
      if (portrait.matches && !this.paused) this.togglePauseMenu();
      // The rotate screen covers the garage: no need to draw it meanwhile
      this.showroom?.setActive(this.paused && !portrait.matches);
    });

    // Where the browser can lock the orientation (Android Chrome), one tap on the rotate
    // screen switches straight to landscape fullscreen
    const rotateBtn = document.getElementById('btn-rotate-landscape');
    if (document.documentElement.requestFullscreen && screen.orientation?.lock) {
      rotateBtn?.classList.remove('hidden');
    }
    rotateBtn?.addEventListener('click', () => this.enterAppFullscreen());
  }

  isInstalledApp() {
    return (
      window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  // Browsers allow fullscreen and orientation lock only from a tap, so this runs from the
  // start / room buttons. iPhone Safari supports neither; there the home-screen app is the way.
  enterAppFullscreen() {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    const lockLandscape = () => screen.orientation?.lock?.('landscape').catch(() => {});
    const el = document.documentElement;
    if (this.isInstalledApp() || document.fullscreenElement || !el.requestFullscreen) {
      lockLandscape();
      return;
    }
    el.requestFullscreen({ navigationUI: 'hide' }).then(lockLandscape).catch(() => {});
  }

  // Unified Analog Drive Pedal: push upwards for throttle, pull downwards for brake.
  // Allows seamless acceleration and braking without ever lifting the finger.
  bindAnalogGasPedal(preventSafariZoom) {
    const el = document.getElementById('touch-gas');
    if (!el) return;
    const label = el.querySelector('.pedal-label');
    let activePid = null;

    const setLevel = (clientY) => {
      const rect = el.getBoundingClientRect();
      const H = rect.height;
      // Center neutral zone (middle 48% height)
      const centerY = rect.top + H * 0.48;
      const deadzone = H * 0.08;

      if (clientY < centerY - deadzone) {
        // Pushing UP: GAZ (0.15 to 1.0)
        const upDistance = (centerY - deadzone) - clientY;
        const maxUp = (centerY - deadzone) - rect.top;
        const norm = Math.min(1.0, upDistance / Math.max(1, maxUp));
        const gas = Math.max(0.15, Math.min(1.0, 0.15 + norm * 0.85));

        this.touchThrottle = gas;
        this.touchBrake = 0;

        el.classList.add('gas-active');
        el.classList.remove('brake-active');
        el.style.setProperty('--gas-level', gas.toFixed(2));
        el.style.setProperty('--brake-level', '0');
        if (label) label.textContent = `%${Math.round(gas * 100)}`;
      } else if (clientY > centerY + deadzone) {
        // Pulling DOWN: FREN (0.35 to 1.0)
        const downDistance = clientY - (centerY + deadzone);
        const maxDown = rect.bottom - (centerY + deadzone);
        const norm = Math.min(1.0, downDistance / Math.max(1, maxDown));
        const brake = Math.max(0.35, Math.min(1.0, 0.35 + norm * 0.65));

        this.touchThrottle = 0;
        this.touchBrake = brake;

        el.classList.add('brake-active');
        el.classList.remove('gas-active');
        el.style.setProperty('--gas-level', '0');
        el.style.setProperty('--brake-level', brake.toFixed(2));
        if (label) label.textContent = `FREN %${Math.round(brake * 100)}`;
      } else {
        // Neutral deadzone: Coasting (Süzülme)
        this.touchThrottle = 0;
        this.touchBrake = 0;
        el.classList.remove('gas-active', 'brake-active');
        el.style.setProperty('--gas-level', '0');
        el.style.setProperty('--brake-level', '0');
        if (label) label.textContent = 'BOŞTA';
      }
    };

    const end = (e) => {
      if (activePid === null || e.pointerId !== activePid) return;
      e.preventDefault();
      activePid = null;
      this.touchThrottle = 0;
      this.touchBrake = 0;
      el.classList.remove('active', 'gas-active', 'brake-active');
      el.style.setProperty('--gas-level', '0');
      el.style.setProperty('--brake-level', '0');
      if (label) label.textContent = 'GAZ / FREN';
    };

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.sound.init();
      activePid = e.pointerId;
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {}
      el.classList.add('active');
      setLevel(e.clientY);
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== activePid) return;
      e.preventDefault();
      setLevel(e.clientY);
    });
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);
    // Prevent Safari native double-tap / pinch gestures on the pedal
    el.addEventListener('touchstart', preventSafariZoom, { passive: false });
    el.addEventListener('touchmove', preventSafariZoom, { passive: false });
    el.addEventListener('touchend', preventSafariZoom, { passive: false });
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
    const overlay = document.getElementById('menu-overlay');
    if (overlay) overlay.dataset.weather = preset.key;

    // Automatically turn on wipers in Rainy weather
    this.cockpit.toggleWipers(preset.rain);
    this.sound.setRainAmbience(preset.rain);
  }

  // The 3D interior is the only cockpit. While its model downloads (or if every attempt
  // fails) the photo cockpit stays on screen as a fallback so the game remains playable.
  async loadCockpit3D(attempt = 1) {
    const applied = await this.cockpit.setMode('3d', CAMERA_PRESETS[0].offset);
    if (applied !== '3d' && attempt < 3) {
      setTimeout(() => this.loadCockpit3D(attempt + 1), attempt * 2000);
    }
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
    // The garage takes the cabin's ambient colour as its accent (turntable ring, buttons)
    document.getElementById('menu-overlay')?.style.setProperty('--accent', cssColor);
    this.showroom?.setAccent(cssColor);
  }

  // Garage car model selection
  setCar(carId, switchShowroom = true) {
    if (!CAR_CONFIGS[carId]) return;
    this.selectedCar = carId;
    localStorage.setItem('otoban_selected_car', carId);

    const config = CAR_CONFIGS[carId];
    this.setHudText('garage-car-make', config.make);
    const modelEl = document.getElementById('garage-car-model');
    if (modelEl) {
      modelEl.innerHTML = `${config.model} <small class="car-variant" id="garage-car-variant">${config.variant}</small>`;
    }
    document.querySelectorAll('#garage-car-select .seg-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.car === carId);
    });

    const loader = document.getElementById('garage-loader');
    if (loader) {
      loader.classList.remove('done', 'failed');
      const text = loader.querySelector('span:not(.loader-ring)');
      if (text) text.textContent = `${config.model} garaja çekiliyor…`;
    }

    if (switchShowroom) {
      this.showroom?.switchCar(carId);
    }

    if (this.multiplayer) {
      this.multiplayer.setLocalCarModel(carId);
    }
  }

  // Garage paint preview: the four colours friends see online, one per room slot
  setGaragePaint(slot) {
    this.showroom?.setPaint(SLOT_STYLES[slot % SLOT_STYLES.length].paint);
    document.querySelectorAll('#garage-paint-group .paint-swatch').forEach((sw) => {
      const on = Number(sw.dataset.paint) === slot;
      sw.classList.toggle('active', on);
      if (on) this.setHudText('garage-paint-name', sw.getAttribute('aria-label'));
    });
  }

  syncMultiplayerUI({ connected, connecting, role, roomCode, playerCount, message }) {
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
      quickLabel.textContent = connected ? `Oda ${roomCode} · ${playerCount}/${MAX_PLAYERS}` : `${MAX_PLAYERS} Kişilik`;
    }
    document.getElementById('tab-online-dot')?.classList.toggle('on', Boolean(connected));
    // In a room the garage shows the car in the colour the others see it in
    const slot = connected ? this.multiplayer.localSlot : null;
    if (slot !== this.syncedPaintSlot) {
      this.syncedPaintSlot = slot;
      if (slot !== null) this.setGaragePaint(slot);
    }
  }

  toggleSound() {
    const muted = this.sound.toggleMute();
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
    this.radio.setMuted(muted);
  }

  toggleRadio() {
    this.sound.init();
    const playing = this.radio.toggle();
    if (playing && this.radio.currentTrack) {
      this.showMakasNotification(`📻 HÜZÜN RADYOSU: ${this.radio.currentTrack.title}`, 0, 'gold');
    }
    this.syncRadioUI();
  }

  nextRadioTrack() {
    this.sound.init();
    const track = this.radio.next();
    if (track) {
      this.showMakasNotification(`📻 HÜZÜN RADYOSU: ${track.title}`, 0, 'gold');
    }
    this.syncRadioUI();
  }

  syncRadioUI() {
    const icon = document.getElementById('radio-icon');
    const label = document.getElementById('radio-label');
    const btn = document.getElementById('btn-radio');
    if (this.radio.isPlaying) {
      if (icon) icon.textContent = '🎵';
      if (label) label.textContent = this.radio.currentTrack ? this.radio.currentTrack.title : 'Çalıyor';
      btn?.classList.add('active');
    } else {
      if (icon) icon.textContent = '📻';
      if (label) label.textContent = 'Hüzün FM';
      btn?.classList.remove('active');
    }
  }

  togglePauseMenu() {
    this.setMenuOpen(!this.paused);
  }

  // The start / pause menu is the A8 garage: the game is paused exactly while it is open
  setMenuOpen(open, tab) {
    this.paused = open;
    document.getElementById('menu-overlay')?.classList.toggle('hidden', !open);
    if (tab) this.showMenuTab(tab);
    if (open) this.setHudText('menu-best', Math.floor(this.bestScore).toLocaleString('tr-TR'));
    this.showroom?.setActive(open && !this.portraitPhone?.matches);
  }

  // Once driving, the menu's main button resumes the drive and the road can be reset
  showResumeButtons() {
    document.getElementById('btn-reset-car')?.classList.remove('hidden');
    this.setHudText('start-label', 'SÜRÜŞE DEVAM ET');
    this.setHudText('start-sublabel', 'KALDIĞIN YERDEN');
  }

  showMenuTab(name) {
    document.querySelectorAll('.panel-tab').forEach((tab) => {
      const on = tab.dataset.tab === name;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.tab-page').forEach((page) => {
      page.hidden = page.id !== `page-${name}`;
    });
  }

  resetRun() {
    this.score = 0;
    this.combo = 1.0;
    this.comboTimer = 0;
    this.health = 100;
    this.speedKmh = 0;
    this.playerX = this.startX();
    this.lateralVel = 0;
    this.yawRate = 0;
    this.headingAngle = 0;
    this.bodyRoll = 0;
    this.rollVel = 0;
    this.bodyPitch = 0;
    this.pitchVel = 0;
    this.accelFeel = 0;
    this.traffic.resetTraffic();
    if (this.traffic.roadMode === 'track') {
      this.currentLap = 1;
      this.lapStartTime = performance.now();
      this.lastAnnouncedTurn = '';
      this.lastApexTurn = '';
    }
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

  // Where the car starts: one lane per room slot on the motorway, our lane on the two-way road, or grid on the track
  startX(slot = this.multiplayer.connected ? this.multiplayer.localSlot : 0) {
    if (this.traffic.roadMode === 'twoway') return TWO_WAY_START_X[slot] ?? 1.8;
    if (this.traffic.roadMode === 'track') return TRACK_START_X[slot] ?? -2.4;
    return SLOT_START_X[slot] ?? -1.8;
  }

  // Motorway, two-way road, or race track (the garage's "Yol Tipi"). Online the host's choice applies to the
  // whole room: a guest's own pick is replaced by the host's with the next traffic snapshot.
  setRoadMode(mode, { remember = false, fromHost = false } = {}) {
    if (!ROAD_MODES.includes(mode)) return;
    if (!fromHost && this.multiplayer.connected && this.multiplayer.role === 'guest') {
      this.showMakasNotification('YOL TİPİNİ ODA KURUCUSU SEÇER', 0, 'normal');
      mode = this.traffic.roadMode;
    }
    if (remember) {
      try {
        localStorage.setItem('otoban_makas_road', mode);
      } catch (_) {}
    }
    document.querySelectorAll('#road-mode-group .seg-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.road === mode);
    });
    if (mode === this.traffic.roadMode && mode === this.world.roadMode) return;

    this.world.setRoadLayout(mode);
    this.traffic.setRoadMode(mode);
    this.overtakeRun = null;
    this.playerX = this.startX();
    this.lateralVel = 0;
    this.headingAngle = 0;

    // Track mode state
    if (mode === 'track') {
      this.currentLap = 1;
      this.lapStartTime = performance.now();
      this.lastLapTime = 0;
      this.bestLapTime = Number(localStorage.getItem('otoban_track_best_lap') || 0);
      this.lastAnnouncedTurn = '';
      this.lastApexTurn = '';
      document.getElementById('hud-track-card')?.classList.remove('hidden');
    } else {
      document.getElementById('hud-track-card')?.classList.add('hidden');
    }
  }

  // Two-way road: one trip into the oncoming lane. Every car overtaken on it is a "sollama"; getting
  // back into our lane with an oncoming car close ahead scores a last-moment return.
  updateOvertakeRun() {
    if (this.traffic.roadMode !== 'twoway') return;
    if (this.playerX < -0.2) {
      this.overtakeRun ??= { passed: 0 };
      return;
    }
    if (!this.overtakeRun || this.playerX < 0.9) return;
    const run = this.overtakeRun;
    this.overtakeRun = null;
    const gap = this.traffic.nearestOncomingAheadM();
    if (run.passed > 0 && gap < 45) {
      const pts = 600 * (1 + (45 - gap) / 45) * this.combo;
      this.score += pts;
      this.combo = Math.min(10.0, this.combo + 1.0);
      this.comboTimer = 1.0;
      this.triggerScreenFlash('double-makas-flash');
      this.sound.playMakasWhoosh(this.combo, true);
      this.showMakasNotification(`⚡ SON ANDA DÖNÜŞ (${Math.round(gap)} M)`, pts, 'gold');
    }
  }

  formatLapTime(sec) {
    if (!Number.isFinite(sec) || sec <= 0) return '00:00.0';
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    const s = Math.floor(rem);
    const ms = Math.floor((rem - s) * 10);
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
  }

  updateTrackProgression() {
    if (this.traffic.roadMode !== 'track') return;

    const lapLen = 4000.0;
    const currentLapNumber = Math.max(1, Math.floor(this.worldDistM / lapLen) + 1);

    // Lap Completion
    if (currentLapNumber > this.currentLap) {
      const lapTimeSec = (performance.now() - this.lapStartTime) / 1000;
      this.lastLapTime = lapTimeSec;
      this.lapStartTime = performance.now();
      const completedLap = this.currentLap;
      this.currentLap = currentLapNumber;
      const timeStr = this.formatLapTime(lapTimeSec);

      let isNewRecord = false;
      if (!this.bestLapTime || lapTimeSec < this.bestLapTime) {
        this.bestLapTime = lapTimeSec;
        try {
          localStorage.setItem('otoban_track_best_lap', String(lapTimeSec));
        } catch (_) {}
        isNewRecord = true;
      }

      if (isNewRecord) {
        this.showMakasNotification(`⚡ YENİ PİST REKORU: ${timeStr}`, 1500, 'double');
        this.triggerScreenFlash('double-makas-flash');
        this.sound.playMakasWhoosh(5, true);
      } else {
        this.showMakasNotification(`🏁 TUR ${completedLap} TAMAMLANDI: ${timeStr}`, 800, 'combo');
        this.sound.playMakasWhoosh(2, false);
      }
    }

    // Turn notifications & apex scoring
    const turnInfo = this.world.getTrackSectionAt?.(this.worldDistM);
    if (turnInfo) {
      if (turnInfo.sec.code !== this.lastAnnouncedTurn && turnInfo.sec.deltaC !== 0) {
        this.lastAnnouncedTurn = turnInfo.sec.code;
        this.showMakasNotification(`🏁 ${turnInfo.sec.name.toUpperCase()}`, 0, 'normal');
      }

      // Apex Speed Reward: high speed cornering through the apex
      const isTurning = Math.abs(turnInfo.sec.deltaC) > 25;
      const nearApex = turnInfo.t > turnInfo.sec.len * 0.35 && turnInfo.t < turnInfo.sec.len * 0.8;
      if (isTurning && nearApex && this.speedKmh >= 130 && Math.abs(this.lateralG) >= 0.42) {
        if (this.lastApexTurn !== turnInfo.sec.code) {
          this.lastApexTurn = turnInfo.sec.code;
          const pts = Math.round(350 * this.combo);
          this.score += pts;
          this.combo = Math.min(10.0, this.combo + 0.5);
          this.comboTimer = 1.0;
          this.showMakasNotification(`🏎️ MÜKEMMEL APEX (+${pts})`, pts, 'combo');
          this.sound.playMakasWhoosh(this.combo, false);
        }
      }
    }

    // Update HUD Track Card
    const lapTimeSec = Math.max(0, (performance.now() - this.lapStartTime) / 1000);
    const hudTrackTurn = document.getElementById('hud-track-turn');
    const hudLapBadge = document.getElementById('hud-lap-badge');
    const hudLapTime = document.getElementById('hud-lap-time');
    const hudLapBest = document.getElementById('hud-lap-best');

    if (hudTrackTurn && turnInfo) hudTrackTurn.textContent = turnInfo.sec.name;
    if (hudLapBadge) hudLapBadge.textContent = `TUR ${this.currentLap}`;
    if (hudLapTime) hudLapTime.textContent = this.formatLapTime(lapTimeSec);
    if (hudLapBest) {
      hudLapBest.textContent = this.bestLapTime > 0
        ? `EN İYİ: ${this.formatLapTime(this.bestLapTime)}`
        : 'EN İYİ: --:--';
    }
  }

  handleTwoWayPass({ kind, speedKmh, lateralGap, oncomingGapM }) {
    const speedFactor = speedKmh / 100;
    let basePts;
    let label;
    let style = 'normal';
    if (kind === 'sollama') {
      // The closer the next oncoming car, the riskier (and better) the overtake
      const risk = Number.isFinite(oncomingGapM) ? Math.max(0, Math.min(1, (120 - oncomingGapM) / 120)) : 0;
      basePts = 300 * speedFactor * (1 + 2 * risk);
      this.combo = Math.min(10.0, this.combo + 0.5 + risk);
      if (this.overtakeRun) this.overtakeRun.passed += 1;
      const count = this.overtakeRun?.passed ?? 1;
      label = risk > 0.6 ? '⚡ KIL PAYI SOLLAMA!' : count > 1 ? `SOLLAMA ×${count}` : 'SOLLAMA!';
      if (risk > 0.6) style = 'gold';
      this.triggerScreenFlash(risk > 0.6 ? 'double-makas-flash' : 'near-miss-flash');
    } else {
      // Brushed past an oncoming car
      const closeness = Math.max(1, (1.2 - lateralGap) * 2.5);
      basePts = 350 * closeness * speedFactor;
      this.combo = Math.min(10.0, this.combo + 1.0);
      label = `😱 KARŞIDAN SIYIRDIN (${Math.round(lateralGap * 100)} CM)`;
      style = 'gold';
      this.triggerScreenFlash('near-miss-flash');
    }
    this.comboTimer = 1.0;
    const totalPts = basePts * this.combo;
    this.score += totalPts;
    if (this.score > this.bestScore) {
      this.bestScore = Math.floor(this.score);
      localStorage.setItem('otoban_makas_best', String(this.bestScore));
    }
    this.shakeIntensity = Math.min(0.45, this.shakeIntensity + 0.18);
    this.cockpit.triggerMakasCockpitPulse();
    this.sound.playMakasWhoosh(this.combo, style === 'gold');
    this.showMakasNotification(label, totalPts, style);
  }

  handleMakas(data) {
    if (data.kind) {
      this.handleTwoWayPass(data);
      return;
    }
    const { lateralGap, speedKmh, isRazorClose, isDoubleMakas } = data;
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

  handleCollision(message = '💥 SÜRTME / KAZA! KOMBO SIFIRLANDI', headOn = false) {
    this.combo = 1.0;
    this.comboTimer = 0;
    this.speedKmh *= headOn ? 0.25 : 0.58;
    this.health = Math.max(0, this.health - (headOn ? 45 : 18));
    this.shakeIntensity = headOn ? 1.0 : 0.85;
    this.rollVel += (Math.random() - 0.5) * 0.6;
    this.pitchVel -= 0.25;

    this.sound.playCrash();
    this.triggerScreenFlash('crash-flash');
    this.showMakasNotification(message, 0, 'danger');

    // Auto-repair slowly or reset if health hits 0
    if (this.health <= 0) {
      this.health = 100;
      this.score = Math.max(0, this.score - 1000);
    }
  }


  updatePhysics(dt) {
    // 1. Determine throttle & brake input
    const throttle = this.keys.gas ? 1.0 : this.touchThrottle;
    const brake = this.keys.brake ? 1.0 : this.touchBrake;

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
    const speedRatio = Math.min(1, Math.max(0, (this.speedKmh - 50) / 210));
    const isCentering = Math.abs(rawSteer) < 0.02;
    const isCounterSteer = rawSteer * this.steerInput < -0.04;

    let steerRate;
    if (isCentering) {
      steerRate = 8.5 + speedRatio * 5.0; // Natural caster self-aligning torque
    } else if (isCounterSteer) {
      steerRate = 13.5 - speedRatio * 2.5; // Quick counter-steer response during makas transitions
    } else {
      steerRate = 10.5 - speedRatio * 2.5; // Quick turn-in, still a little heavier at 200+ km/h
    }
    this.steerInput = THREE.MathUtils.lerp(this.steerInput, rawSteer, Math.min(1, dt * steerRate));

    // 2. Longitudinal Speed (KM/H)
    // Top speed capped at 260 km/h; the car can roll to a full stop
    const maxSpeed = 260;
    const minSpeed = 0;

    // Resistance grows with the square of speed (aero drag) plus a small rolling term,
    // so the car pulls hard in town but has to fight the air past ~200 km/h.
    const AERO_DRAG = 0.00027; // km/h/s per (km/h)^2
    const ROLLING_DRAG = 1.5;
    const resistance = AERO_DRAG * this.speedKmh * this.speedKmh + ROLLING_DRAG;

    let accelKmhPerSec = 0;
    if (throttle > 0) {
      // Constant-power engine: thrust ~ P / v, capped by tyre traction at low speed.
      // ~3.3 s 0→100, ~5.6 s 100→200, ~12.5 s 200→240
      const ENGINE_POWER = 4200;
      const TRACTION_LIMIT = 33;
      const thrust = Math.min(TRACTION_LIMIT, ENGINE_POWER / Math.max(1, this.speedKmh));

      let effectiveThrust;
      if (this.speedKmh < 235) {
        effectiveThrust = thrust;
      } else {
        // Extended 240-260 km/h top-speed climb:
        // Past 240 km/h, aerodynamic drag is immense. Climbing from 240 to 260 km/h takes
        // ~29 seconds of clean, wide-open throttle, tapering down smoothly to the 260 km/h limiter.
        const progress235To260 = Math.min(1, Math.max(0, (this.speedKmh - 235) / 25));
        const netFullThrottleAccel = 1.50 + (0.38 - 1.50) * Math.pow(progress235To260, 0.75);
        effectiveThrust = resistance + netFullThrottleAccel;
      }

      // Part throttle settles at a cruising speed: ~125 km/h at 15%, ~185 km/h at 50%
      accelKmhPerSec = effectiveThrust * throttle - resistance;
    } else if (brake > 0) {
      accelKmhPerSec = -115 * brake; // Strong Brembo sport brakes
    } else {
      // Off throttle: engine braking + drag (bleeds speed faster at 200+), rolling to a stop
      accelKmhPerSec = -(6 + resistance);
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

    // 3. Audi A8 8-speed tiptronic (ZF 8HP) & RPM from the real drivetrain ratios.
    //    Shift points follow the pedal: off the gas it short-shifts and cruises quietly
    //    (~1,700 rpm at 120 km/h in 8th); holding the gas kicks down and revs to ~6,000.
    const wheelRpm = (this.speedKmh / 3.6 / A8_WHEEL_CIRCUMFERENCE_M) * 60;
    const rpmInGear = (g) => wheelRpm * A8_GEAR_RATIOS[g] * A8_FINAL_DRIVE;
    const upshiftRpm = 2100 + throttle * 3900;
    const downshiftRpm = 1150 + throttle * 2200;
    const shiftClockSec = performance.now() / 1000;

    if (shiftClockSec - this.lastShiftAt > 0.4) {
      let targetGear = this.gear;
      if (targetGear < 8 && rpmInGear(targetGear) > upshiftRpm) {
        targetGear += 1;
      } else {
        // Kickdown may skip gears, as long as the lower gear is not past its own shift point
        while (
          targetGear > 1 &&
          rpmInGear(targetGear) < downshiftRpm &&
          rpmInGear(targetGear - 1) < upshiftRpm - 300
        ) {
          targetGear -= 1;
        }
      }
      if (targetGear !== this.gear) {
        this.sound.triggerGearShift(targetGear > this.gear);
        this.gear = targetGear;
        this.lastShiftAt = shiftClockSec;
      }
    }

    const targetRpm = Math.max(A8_IDLE_RPM, rpmInGear(this.gear));
    this.rpm = THREE.MathUtils.lerp(this.rpm, targetRpm, Math.min(1, dt * 10));

    // 4. Realistic Lateral Vehicle Dynamics (Smooth Yaw, Tire Grip & Rock-Solid Straight-Line Stability)
    const speedMs = this.speedKmh / 3.6;
    const wetFactor = this.world.weatherKey === 'rain' ? 0.85 : 1.0;

    // Target chassis heading angle (narrows at high speed for stability)
    const maxHeadingAngle = 0.19 - speedRatio * 0.06; // ~11 deg at low speed, ~7.5 deg at 260 km/h
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
    let centrifugalDriftVel;
    let steerPower;
    if (this.traffic.roadMode === 'track') {
      // In track mode: sharp corners push the car to the outside!
      // The car DOES NOT turn by itself; player MUST steer into the apex to stay on track!
      const driftMagnitude = -curveKappa * speedMs * 30.0;
      centrifugalDriftVel = Math.max(-5.8, Math.min(5.8, driftMagnitude));
      // Responsive racing steering authority to actively carve the turn and hit the apex
      steerPower = 5.8 + speedRatio * 2.8;
    } else {
      // Highway mode: gentle highway drift
      const maxDrift = 1.35;
      centrifugalDriftVel = Math.max(-maxDrift, Math.min(maxDrift, -curveKappa * speedMs * 21.0));
      steerPower = 4.6 + speedRatio * 2.0;
    }

    const steerLatVel =
      Math.sin(this.headingAngle) * speedMs * (this.traffic.roadMode === 'track' ? 0.95 : 0.62) +
      this.steerInput * steerPower * Math.min(1, this.speedKmh / 35); // no sideways creep when standing
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
    const maxLateralX = this.world.roadHalfWidth - 1.05;
    if (Math.abs(this.playerX) > maxLateralX) {
      this.playerX = Math.sign(this.playerX) * maxLateralX;
      this.lateralVel *= -0.3;
      this.headingAngle *= 0.3;
      this.rollVel += -Math.sign(this.playerX) * 0.2;
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.22);
      // Slight speed scrub on barrier scrape
      this.speedKmh = Math.max(0, this.speedKmh - 28 * dt);
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

    // Felt acceleration: the real G is small at motorway speeds (the car pulls realistically
    // there), so it is boosted as the speed rises. It builds up and eases off smoothly and drives
    // the seat push, the nose lift and the widening view below.
    const feltTarget = THREE.MathUtils.clamp(activeLongG * (1 + this.speedKmh / 120), -0.6, 0.6);
    this.accelFeel += (feltTarget - this.accelFeel) * Math.min(1, dt * (feltTarget > this.accelFeel ? 3 : 5));

    const targetPitch = THREE.MathUtils.clamp(this.accelFeel * 0.011, -0.022, 0.018);
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
    // Pushed back into the seat under acceleration, thrown forward under braking (+Z is backward)
    this.camera.position.z = preset.offset.z + this.accelFeel * 0.06;

    // Camera yaw & roll reflect smooth vehicle nose heading and suspension lean
    this.camera.rotation.y = -this.headingAngle * 0.52;
    this.camera.rotation.z = this.bodyRoll * 0.75;
    this.camera.rotation.x = this.bodyPitch * 0.65;

    // Speed-based FOV warp for intense sense of speed above 140 km/h, widening a little more
    // while the car pulls (and narrowing a little under braking)
    const speedFovBoost = Math.max(0, (this.speedKmh - 100) / 200) * 11;
    const accelFovKick = this.accelFeel * 5;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, preset.baseFov + speedFovBoost + accelFovKick, dt * 6);
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

    const playerZone = this.world.getCurrentZone();
    if (playerZone !== this.lastZone) {
      const prev = this.lastZone;
      this.lastZone = playerZone;
      this.sound.setAcousticZone(playerZone);
      if (prev !== undefined) {
        if (playerZone === 'tunnel') {
          this.showMakasNotification('🚇 AVRASYA TÜNELİ (HIZ LİMİTİ 70)', 0, 'gold');
        } else if (playerZone === 'bridge') {
          this.showMakasNotification('🌉 15 TEMMUZ ŞEHİTLER KÖPRÜSÜ', 0, 'bridge');
        } else if (playerZone === 'track') {
          this.showMakasNotification('🏁 İSTANBUL PARK YARIŞ PİSTİ', 0, 'gold');
        } else if (playerZone === 'highway') {
          this.showMakasNotification('🛣️ İSTANBUL ÇEVRE OTOYOLU', 0, 'normal');
        }
      }
    }

    this.traffic.update(
      dt,
      this.speedKmh,
      this.playerX,
      {
        onMakas: (data) => this.handleMakas(data),
        onCollision: (car) => {
          this.multiplayer.notifyLocalCarHit(car);
          if (car.dir < 0) this.handleCollision('💥 KAFA KAFAYA ÇARPIŞTIN!', true);
          else this.handleCollision();
        },
      },
      this.world,
      this.multiplayer.getTrafficContext()
    );
    this.updateOvertakeRun();
    this.updateTrackProgression();

    const radarCars = this.traffic.getRadarSnapshot(this.playerX);

    // Friends in the room show up on the Audi MMI Radar, and driving side by side with any of
    // them at speed scores a Tandem Makas
    const nowSec = performance.now() / 1000;
    this._peerRadarPool ??= [];
    let peerPoolIdx = 0;
    const remotePlayers = this.multiplayer.connected ? this.multiplayer.getRemotePlayers() : [];
    for (let i = 0; i < remotePlayers.length; i++) {
      const peer = remotePlayers[i];
      let pItem = this._peerRadarPool[peerPoolIdx];
      if (!pItem) {
        pItem = { x: 0, relX: 0, relZ: 0, isPeer: true, color: null };
        this._peerRadarPool[peerPoolIdx] = pItem;
      }
      peerPoolIdx++;
      pItem.x = peer.x;
      pItem.relX = peer.x - this.playerX;
      pItem.relZ = peer.relZ;
      pItem.isPeer = true;
      pItem.color = peer.style.tag;
      radarCars.push(pItem);

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
    let dangerAhead = false;
    for (let i = 0; i < radarCars.length; i++) {
      const c = radarCars[i];
      if (c.relZ < 0 && c.relZ > -22 && Math.abs(c.relX) < 1.75) {
        dangerAhead = true;
        break;
      }
    }
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
        radio: {
          active: this.radio.isPlaying,
          title: this.radio.currentTrack?.title || '',
        },
      },
      radarCars
    );

    this.sound.updateEngine(this.rpm, throttle, this.speedKmh, this.paused, this.lateralG);
    this.updateHUD();
  }

  // One row per friend in the room (name in their slot colour, gap, speed/combo/score).
  // Rows are created/removed as players come and go; text is only rewritten when it changes.
  updateMultiplayerHud() {
    const list = document.getElementById('mp-peer-list');
    if (!list) return;
    this.mpRows ??= new Map();
    const players = this.multiplayer.connected ? this.multiplayer.getRemotePlayers() : [];
    const ids = new Set(players.map((p) => p.id));

    for (const [id, row] of this.mpRows) {
      if (!ids.has(id)) {
        row.el.remove();
        this.mpRows.delete(id);
      }
    }

    for (const peer of players) {
      let row = this.mpRows.get(peer.id);
      if (!row) {
        const el = document.createElement('div');
        el.className = 'mp-peer-row';
        el.style.setProperty('--tag', SLOT_STYLES[peer.slot % SLOT_STYLES.length].tag);
        const name = document.createElement('span');
        name.className = 'mp-peer-name';
        const dist = document.createElement('span');
        dist.className = 'mp-peer-dist';
        const stats = document.createElement('span');
        stats.className = 'mp-peer-stats';
        el.append(name, dist, stats);
        list.appendChild(el);
        row = { el, name, dist, stats, text: {} };
        this.mpRows.set(peer.id, row);
      }

      const distM = Math.round(Math.abs(peer.relZ));
      const texts = {
        name: peer.name.toUpperCase(),
        dist: distM <= 4 ? '🔥 YAN YANA' : peer.relZ < 0 ? `▲ ${distM}m` : `▼ ${distM}m`,
        stats: `${Math.round(peer.speedKmh)} KM/S • ${peer.combo.toFixed(1)}x • ${Math.floor(peer.score).toLocaleString('tr-TR')} P`,
      };
      for (const key of ['name', 'dist', 'stats']) {
        if (row.text[key] !== texts[key]) {
          row.text[key] = texts[key];
          row[key].textContent = texts[key];
        }
      }
    }
  }

  catchUpToFriend() {
    const name = this.multiplayer.catchUpToPeer();
    if (name) this.showMakasNotification(`🚀 ${name} YANINA YETİŞTİN!`, 0, 'normal');
  }

  // Writes to the DOM only when a value actually changed: the HUD is refreshed every frame,
  // and redundant textContent/style writes still force style recalculation
  setHudText(id, value) {
    this.hudEls ??= {};
    this.hudCache ??= {};
    const el = this.hudEls[id] ?? (this.hudEls[id] = document.getElementById(id));
    if (el && this.hudCache[id] !== value) {
      this.hudCache[id] = value;
      el.textContent = value;
    }
  }

  setHudStyle(id, prop, value) {
    this.hudEls ??= {};
    this.hudCache ??= {};
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
    this.setHudText('mini-gear', `D${this.gear}`);

    this.updateMultiplayerHud();
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
    // Only judge the frame rate while the road is actually drawn every frame (not in the garage)
    if (!this.paused) this.adaptRenderScale(frameSec);
    this.renderer.info.reset();

    if (!this.paused && this.multiplayer.connected) {
      // Online everyone shares the host's clock: a hitch frame (notification, GC, ...) is caught up
      // in 50 ms steps. Dropping that time would put this car behind the synced traffic, and the
      // cars it had just passed would then jump back in front of it.
      let remaining = Math.min(0.5, frameSec);
      while (remaining > 0.001) {
        const step = Math.min(0.05, remaining);
        this.updatePhysics(step);
        remaining -= step;
      }
    } else if (!this.paused) {
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
          radio: {
            active: this.radio.isPlaying,
            title: this.radio.currentTrack?.title || '',
          },
        },
        radarCars
      );
      this.sound.updateEngine(900, 0, 0, true);
      this.updateHUD();
    }

    // While the garage covers the road, redraw it once a second: enough to keep its shaders,
    // textures and mirrors warm for the start without drawing two 3D scenes every frame
    if (this.paused && now - this.lastCoveredRender < 1000) return;
    this.lastCoveredRender = now;

    // 1. Render real-time Rear-View & Wing Mirror texture
    this.cockpit.renderRearMirror(this.scene);

    // 2. Render main First-Person Cockpit Camera
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new OtobanMakasGame();
});
