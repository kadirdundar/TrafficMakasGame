import * as THREE from 'three';
import { SoundEngine } from './audio.js';
import { CarCockpit, AMBIENT_COLORS } from './cockpit.js';
import { CarShadows } from './carShadows.js';
import { TyreSmoke } from './tyreSmoke.js';
import { DrawBatcher } from './drawBatcher.js';
import { LUXURY_SPEC } from './vehicleModels.js';
import { HighwayWorld, MIRROR_SKIP_LAYER, ROAD_MODES, TRACK_LAP_LENGTH, WEATHER_PRESETS } from './world.js';
import { TrafficManager } from './traffic.js';
import { RoadClosures } from './roadClosures.js';
import { DayCycle } from './dayCycle.js';
import { CUSTOM_PAINT, MATCH_TARGET_POINTS, MAX_PLAYERS, MultiplayerManager, SLOT_START_X, SLOT_STYLES, normPaintSlot, paintHexOf } from './multiplayer.js';
import { PaintCreator } from './paintCreator.js';
import { CarFire } from './carFire.js';
import { A8Showroom } from './showroom.js';
import { RadioPlayer } from './radio.js';
import { CAR_LIST, CARS, getCar } from './cars/index.js';
import { DroneReplayManager } from './replay.js';
import {
  CLASSIC_PHYSICS,
  ENGINE_BRAKING,
  KMH_PER_SEC_PER_G,
  carStats,
  longitudinalAccel,
  resolvePhysics,
  roadResistance,
} from './progression/performance.js';
import { bounceTrackCar, createTrackCar, resetTrackCar, setTrackCarSpeed, stepTrackCar } from './trackDynamics.js';
import { TRAFFIC_MASS, nextGear, resolveChassis, resolveDrivetrain, rpmInGear } from './progression/drivetrain.js';
import { PlayerProfile } from './progression/profile.js';
import { isNewVersionEnabled, setNewVersionEnabled } from './progression/flag.js';
import { COINS_PER_KM, COINS_PER_POINT, MATCH_WIN_COINS, neonColorHex } from './progression/config.js';
import { createNeonGlow, createNeonSpill } from './cars/neon.js';
import { GarageProgressUI } from './progression/garageUI.js';
import { FirstDriveCoach, coachDone, resetCoach } from './tutorial.js';
import { MenuMusicPlayer } from './menuMusic.js';
import { PerfProbe } from './perfProbe.js';
import { setStreakViewer } from './roadLight.js';

// Longest the traffic models and the 3D cockpit wait for the garage car to download first
const GARAGE_FIRST_MS = 4000;

// Two-way road start positions per room slot: our lane, or just inside the shoulder beside it
const TWO_WAY_START_X = [1.8, 3.0, 1.8, 3.0];
// İstanbul Park track grid starting positions per room slot
const TRACK_START_X = [-2.4, 2.4, -4.6, 4.6];

// Tyres on a wet road: what is left of the braking grip, and of the traction of a car driven
// through two wheels or all four
const WET_BRAKE_GRIP = 0.8;
const WET_TRACTION = { fwd: 0.78, rwd: 0.78, awd: 0.93 };
// Hard on the brakes the tyres have less left for turning: the share of the steering that
// remains at full pedal (ABS keeps the car steerable, it does not keep it agile)
const STEER_UNDER_BRAKING = 0.5;
// The ABS works from this much pedal, above walking pace
const ABS_PEDAL = 0.85;
// Road surface: expansion joints on the bridge and seams in the asphalt elsewhere (m apart),
// and the wheelbase the rear axle follows the front one over them with
const BRIDGE_JOINT_M = 30;
const ROAD_SEAM_M = 420;
const WHEELBASE_M = 2.9;
// Changing up under power the gearbox eases the engine's drive for a moment (for 30 % of the
// car's shiftSec): the nose dips a touch as the push softens and the car settles back when it
// returns. Kept light: a hint of the change, not a jolt. A quick dual-clutch box (shiftSec 0.25)
// keeps SHIFT_KEEP_QUICK of the drive, a slow automatic (0.6) SHIFT_KEEP_SLOW.
const SHIFT_CUT_SHARE = 0.3;
const SHIFT_KEEP_QUICK = 0.7;
const SHIFT_KEEP_SLOW = 0.85;
const SHIFT_NOD = 0.06; // pitch kick (rad/s) as the drive goes, at full throttle and a full cut
const SHIFT_SQUAT = 0.08; // and as it comes back
// Changing down, the gearbox blips the throttle: the revs flare this far past the new gear's and
// settle back in ~0.2 s
const REV_BLIP = 0.07;
// Tyre squeal on the road: from how fast the car's sideways speed changes (m/s², smoothed), so a
// lane change stays quiet and a flick or a makas (one way, then straight back) squeals. It
// starts above TYRE_STRAIN_FROM + TYRE_STRAIN_PER_KMH × speed and is at full strength
// TYRE_STRAIN_SPAN above that. (A full-lock lane change reaches ~17 at 100 km/h and ~23 at 180,
// a makas ~30 and ~36.)
const TYRE_STRAIN_FROM = 21;
const TYRE_STRAIN_PER_KMH = 0.04;
const TYRE_STRAIN_SPAN = 12;
// Where the player's car ends in front (the car is centred on z = 0, the chase view draws it so)
const OWN_NOSE_Z = -2.5;
// Body heave on the springs: ~1.1 Hz, damping ratio ~0.4 (a soft, floating ride)
const HEAVE_SPRING = 48;
const HEAVE_DAMPING = 5.5;
// İstanbul Park tyre grip (the friction of slicks on a dry track, for a car with handling 1) and
// what is left of it in the rain and on the gravel. The driving model is src/trackDynamics.js.
// Peak T1 (R≈80 m) is then ~125 km/h, the T11 kink (R≈160 m) ~175 km/h.
const TRACK_GRIP_G = 1.6;
const TRACK_WET_GRIP = 0.78;
const TRACK_GRAVEL_GRIP = 0.55;

// Camera / Seat Presets aligned with the Photorealistic Audi A8 Windshield
const CAMERA_PRESETS = [
  { name: 'Standart', offset: new THREE.Vector3(0.0, 1.25, 0.2), baseFov: 58, horizonShiftY: 0.24 },
  { name: 'Tam Kabin', offset: new THREE.Vector3(0.0, 1.28, 0.35), baseFov: 62, horizonShiftY: 0.30 },
  { name: 'Yakın Sürüş', offset: new THREE.Vector3(0.0, 1.22, 0.05), baseFov: 54, horizonShiftY: 0.18 },
  // Chase camera: behind and above the car, which is drawn from outside instead of its cabin
  // (updateChaseView). `lookDown` tilts it towards the car (rad).
  { name: 'Dış Kamera', chase: true, offset: new THREE.Vector3(0.0, 2.3, 6.4), baseFov: 60, horizonShiftY: 0.04, lookDown: 0.13 },
];

// Touch steering choices, in Ayarlar and in the picker before the first drive
const STEER_MODES = [
  {
    id: 'wheel',
    title: 'Kaydırarak',
    desc: 'Sol başparmağını ekranda sağa sola kaydır',
    badge: 'Önerilen',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2.2" /><path d="M3.8 11h6M14.2 11h6M12 14.2v6" /></svg>',
  },
  {
    id: 'buttons',
    title: 'Ok tuşları',
    desc: 'Sol alttaki ◀ ▶ tuşlarına basılı tut',
    icon: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6.5" width="8.5" height="11" rx="2" /><rect x="13" y="6.5" width="8.5" height="11" rx="2" /><path d="M8 9.5 5.5 12 8 14.5M16 9.5l2.5 2.5-2.5 2.5" /></svg>',
  },
  {
    id: 'tilt',
    title: 'Eğerek',
    desc: 'Telefonu direksiyon gibi sağa sola eğ',
    icon: '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="9" rx="2" transform="rotate(-14 12 12.5)" /><path d="M3 6.5a10 10 0 0 1 5-3M21 18.5a10 10 0 0 1-5 3" /></svg>',
  },
];
const STEER_MODE_KEY = 'otoban_steer_mode';

// Garage camera view that shows each part best (src/showroom.js → VIEWS)
const PART_VIEWS = {
  spoiler: 'rear34',
  rim: 'front34',
  finish: 'front34',
  hood: 'front34',
  mirrors: 'front34',
  tint: 'side',
  neon: 'side',
  plate: 'rear',
};

const ROAD_LABELS = { highway: 'Otoban', twoway: 'Gidiş-Geliş', track: 'İstanbul Park' };
// Each number of the 3-2-1 before a paused drive goes on
const COUNTDOWN_STEP_MS = 650;
// After a crash the car burns this long before the result card (single player) comes up
const BURN_BEFORE_RESULT_SEC = 2.2;

// Damage: the car takes MAX_HITS knocks (a head-on counts double) and burns on the last one. A
// knock shields the car for HIT_GRACE_SEC, so one pile-up costs one hit, and REPAIR_KM of clean
// driving mends one.
const MAX_HITS = 3;

// Head turn into bends: radians of yaw per unit of road curvature ahead, and the most it turns
// (~7°, reached in İstanbul Park's hairpins; motorway bends turn it a degree or two)
const HEAD_TURN_PER_CURVATURE = 9;
const HEAD_TURN_MAX = 0.12;

// Speed lines fade in from SPEED_LINES_FROM km/h and are at full strength SPEED_LINES_SPAN later
const SPEED_LINES_FROM = 180;
const SPEED_LINES_SPAN = 90;
// Speed vignette: the corners of the screen darken from SPEED_VIGNETTE_FROM km/h, up to full
// strength SPEED_VIGNETTE_SPAN later
const SPEED_VIGNETTE_FROM = 120;
const SPEED_VIGNETTE_SPAN = 140;
const SPEED_VIGNETTE_MAX = 0.6; // opacity of the dark corners at full strength
// Drift points (track only, updateDriftScore): a slide between these two angles (rad) between
// where the car points and where it goes runs up points; past the second it has spun
const DRIFT_SPIN_ANGLE = 1.2;
const DRIFT_SCORE_ANGLE = 0.2;
const DRIFT_POINTS = 1.6;
const DRIFT_MIN_PAYOUT = 40;
const HIT_GRACE_SEC = 1.5;
const REPAIR_KM = 2;

class OtobanMakasGame {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.sound = new SoundEngine();
    this.menuMusic = new MenuMusicPlayer({
      volume: this.sound.volumes.music,
      masterVolume: this.sound.volumes.master,
      muted: this.sound.muted,
    });
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
    // CSS keeps the canvas full-screen (style.css); only its drawing buffer follows the size
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
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
    // Flames on our own bonnet after a crash, in front of the windscreen
    this.carFire = new CarFire({ width: 1.5 });
    this.carFire.group.position.set(0, 0.8, -3.0);
    this.cockpit.group.add(this.carFire.group);
    this.burning = null; // { t } seconds since the crash while the car burns
    this.damage = 0; // hits taken, MAX_HITS sets the car on fire
    this.graceSec = 0; // time left in which another knock costs nothing
    this.repairKm = 0; // clean driving since the last hit or repair
    this.damageHudKey = '';
    this.headTurn = 0; // yaw the driver's head has turned into the bend ahead
    this.speedLinesLevel = -1;
    this.speedVignetteLevel = -1;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The menu's turntable car is the first thing on screen, so it downloads on its own: the
    // traffic models and the 3D cockpit (~2 MB together) wait until it is shown, a drive
    // starts, or GARAGE_FIRST_MS have passed, whichever comes first.
    let openGarageGate;
    this.garageFirst = new Promise((resolve) => (openGarageGate = resolve));
    this.openGarageGate = () => openGarageGate();
    setTimeout(this.openGarageGate, GARAGE_FIRST_MS);
    this.traffic = new TrafficManager(this.scene, { modelsAfter: this.garageFirst });
    // Road works or a broken-down car shutting lanes now and then on the motorway
    this.dayCycle = new DayCycle(this.world);
    this.chosenWeather = this.world.weatherKey;
    this.roadClosures = new RoadClosures(this.scene);
    this.roadClosures.setWorld(this.world);
    this.traffic.closures = this.roadClosures;
    this.radio = new RadioPlayer({
      volume: this.sound.volumes.radio,
      masterVolume: this.sound.volumes.master,
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
        resetTrackCar(this.trackCar);
        this.sound.init();
        this.sound.setRainAmbience(this.world.weatherKey === 'rain');
        this.beginDrive();
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
      onRoundStart: (info) => this.startRound(info),
      onRoundEnd: (info) => this.showRoundResult(info),
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
    // One of the four preset colours (0-3) or the player's own (CUSTOM_PAINT + hex)
    this.selectedPaintSlot = normPaintSlot(localStorage.getItem('otoban_selected_paint') ?? 0);

    // Zero-overhead 10-second Drone Replay & Video Exporter
    this.replay = new DroneReplayManager(
      this.scene,
      this.renderer,
      this.world,
      this.traffic,
      this.multiplayer,
      this.sound,
      {
        onClipAvailable: () => this.syncDroneReplayButton(),
        onFrameUpdate: (info) => this.updateDroneReplayHUD(info),
        onVideoStatus: (status) => this.syncDroneVideoStatus(status),
      }
    );

    // Shadows under every car on the road: the traffic, friends in the room and, in the drone
    // replay, the driven car and the recorded friends
    this.carShadows = new CarShadows(this.scene, (visit) => {
      for (const car of this.traffic.vehicles) if (car.active) visit(car.mesh, car.spec);
      for (const peer of this.multiplayer.players.values()) visit(peer.car.group, LUXURY_SPEC);
      visit(this.replay.playerCarGroup, LUXURY_SPEC);
      for (const peer of this.replay.replayPeers) visit(peer.group, LUXURY_SPEC);
    });
    this.shadowSunKey = '';
    this.tyreSmoke = new TyreSmoke(this.scene);

    // The traffic cars and the roadside segments are made of many small meshes: they are drawn
    // in a few batches instead of one draw call each (same picture, see drawBatcher.js)
    this.drawBatcher = new DrawBatcher(this.scene);
    this.drawBatcher.watch(() => this.traffic.vehicles.map((car) => car.mesh));
    this.drawBatcher.watch(() => this.world.sceneryItems);
    if (new URLSearchParams(location.search).has('nobatch')) this.drawBatcher.setEnabled(false);
    this.traffic.onModelsReady = () => this.drawBatcher.refresh(); // the cars were swapped for the real models

    // Start-menu garage with the rotatable car. Optional: the game runs without it if a second
    // WebGL context is not available.
    this.selectedCar = getCar(localStorage.getItem('otoban_selected_car')).id;

    // New version (per-car performance, coins from driving, cars and upgrades to buy) behind a
    // temporary switch in the garage. Off, every car drives with CLASSIC_PHYSICS as before.
    this.newVersion = isNewVersionEnabled();
    this.profile = new PlayerProfile();
    this.carPhysics = CLASSIC_PHYSICS;
    this.roadPhysics = { ...CLASSIC_PHYSICS }; // carPhysics on today's road (see updatePhysics)
    this.drivetrain = resolveDrivetrain(null);
    this.chassis = resolveChassis(null);
    this.coinScoreMark = 0; // score already paid out (see earnCoins)
    this.coinCarry = 0; // fraction of a coin not paid out yet
    this.runCoins = 0; // coins earned in the current drive
    this.garageUI = new GarageProgressUI({
      profile: this.profile,
      enabled: this.newVersion,
      onToggle: (on) => this.setNewVersion(on),
      onPurchase: (purchase) => this.onGaragePurchase(purchase),
      onPreview: (parts, kind) => this.previewParts(parts, kind),
    });

    try {
      this.showroom = new A8Showroom(
        document.getElementById('garage-canvas'),
        document.getElementById('garage-stage'),
        {
          paintHex: paintHexOf(this.selectedPaintSlot),
          accent: AMBIENT_COLORS[this.cockpit.ambientKey]?.css,
          carType: this.selectedCar,
          onReady: (ok) => {
            document.getElementById('garage-loader')?.classList.add(ok ? 'done' : 'failed');
            this.openGarageGate();
          },
        }
      );
    } catch (err) {
      console.warn('Garaj başlatılamadı', err);
      this.showroom = null;
      this.openGarageGate();
      document.getElementById('garage-loader')?.classList.add('failed');
    }
    this.syncedPaintSlot = null;
    this.lastCoveredRender = 0;

    // Add camera to cockpit group so it moves laterally with the car
    this.cockpit.group.add(this.camera);
    this.cockpit.camera = this.camera;
    // The view chosen last time (a seat position in the cabin or the chase camera)
    const savedCamera = Number(localStorage.getItem('otoban_camera'));
    this.applyCameraPreset(savedCamera > 0 && savedCamera < CAMERA_PRESETS.length ? savedCamera : 0);

    // Game & Vehicle Physics State
    this.paused = true;
    // What the screen shows: 'menu' (home / garage / online), 'pause' (the pause card over the
    // frozen road), 'countdown' (3-2-1 back into the drive) or 'drive'. Physics run only in 'drive'.
    this.uiState = 'menu';
    this.menuScreen = 'home';
    this.runActive = false; // a drive the pause card or the home screen can resume
    this.countdownTimers = [];
    this.settingsOpen = false;
    this.coach = new FirstDriveCoach();
    this.score = 0;
    this.bestScore = Number(localStorage.getItem('otoban_makas_best') || 0);
    // Best score per road, on the home screen's mode cards (the track's record is its best lap)
    this.modeBest = {};
    for (const mode of ['highway', 'twoway']) {
      this.modeBest[mode] = Number(localStorage.getItem(`otoban_best_${mode}`) || 0);
    }
    this.combo = 1.0;
    this.comboTimer = 0; // 0.0 to 1.0
    this.odometerKm = 1428.4;
    this.tripDistanceKm = 0;
    this.playTimeSec = 0;
    this.startTimeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    this.playerX = -1.8; // Start in left-center fast lane (two-way road: see setRoadMode below)
    this.overtakeRun = null; // two-way road: an excursion into the oncoming lane (see updateOvertakeRun)
    this.lateralVel = 0;
    this.yawRate = 0; // rad/s chassis yaw angular velocity
    this.headingAngle = 0; // rad chassis slip/heading angle relative to highway
    this.trackCar = createTrackCar(); // the car on İstanbul Park (src/trackDynamics.js)
    this.trackSetup = { layout: 'awd', cgHeight: 0.38 };
    this.tyreHowl = 0; // how hard the tyres are sliding, as the lateral g the squeal is driven with
    this.tyreStrain = 0; // road: how fast the sideways speed changes, smoothed (m/s², see TYRE_STRAIN_*)
    this.tyreSmokeAmount = 0;
    this.chaseYaw = 0; // rad: the direction the chase camera stands behind the car in
    this.driftPoints = 0; // points of the drift in progress
    this.driftIdleSec = 0;
    this.bodyRoll = 0; // rad suspension roll angle (spring-damper)
    this.rollVel = 0;
    this.bodyPitch = 0; // rad suspension pitch angle (spring-damper)
    this.pitchVel = 0;
    this.bodyHeave = 0; // m the body rides above/below its rest height (spring-damper)
    this.heaveVel = 0;
    this.speedKmh = 0; // the car waits at a standstill until the gas is pressed
    this.rpm = 2200;
    this.gear = 3;
    this.lastShiftAt = 0;
    this.shiftCutSec = 0; // s the engine's drive is still cut for an upshift (see updatePhysics)
    this.shiftCutKeep = 1; // share of the drive left during that cut
    this.shiftKick = 0; // how hard the drive comes back when the cut ends
    this.revBlip = 0; // 1 right after a downshift's throttle blip, dies away (see updatePhysics)
    this._viewerPos = new THREE.Vector3();
    this.knockVel = 0; // m/s sideways, from a knock by another car; dies away on its own
    this.steerLossSec = 0; // the wheel is jolted out of the driver's hands for this long
    this.roadJoint = -1; // last expansion joint / seam driven over
    this.roadZone = null;
    this.rearAxleIn = 0; // s until the rear axle crosses the joint the front one just hit
    this.rearAxleBump = 0;
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
    // 'wheel' | 'buttons' | 'tilt', remembered once the player has picked one (see startFromHome)
    let savedSteer = null;
    try {
      savedSteer = localStorage.getItem(STEER_MODE_KEY);
    } catch (_) {}
    this.steerModeChosen = STEER_MODES.some((mode) => mode.id === savedSteer);
    this.steerMode = this.steerModeChosen ? savedSteer : 'wheel';
    this.tiltBaseline = null;
    this.steerInput = 0;

    this.lastTime = performance.now();
    this.perf = { frames: 0, elapsed: 0, calls: 0, window: 0, goodWindows: 0, lastRaise: -10, settle: 0 };
    this.fpsMeter = null;
    // 60-second measurement for real phones: 5 taps on the home logo, or ?perf in the URL
    this.perfProbe = new PerfProbe({
      renderer: this.renderer,
      describe: () => ({
        car: this.selectedCar,
        road: this.traffic.roadMode,
        weather: this.world.weatherKey,
        density: this.traffic.densityMode,
        steer: this.steerMode,
        online: this.multiplayer.connected,
      }),
      onDone: () => this.openPause(),
    });
    this.lastZone = undefined;
    // Road layout chosen last time (motorway by default)
    let savedRoad = null;
    try {
      savedRoad = localStorage.getItem('otoban_makas_road');
    } catch (_) {}
    if (ROAD_MODES.includes(savedRoad)) this.setRoadMode(savedRoad);

    // Traffic density chosen last time
    let savedDensity = null;
    try {
      savedDensity = localStorage.getItem('otoban_traffic_density');
    } catch (_) {}
    if (savedDensity && ['normal', 'heavy', 'extreme'].includes(savedDensity)) {
      this.traffic.setDensity(savedDensity);
      document.querySelectorAll('#traffic-density-group [data-density]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-density') === savedDensity);
      });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('fps')) this.toggleFpsMeter();
    if (params.has('perf')) this.perfProbe.arm();
    this.perfProbe.bindSecretTap(document.querySelector('.garage-logo'));
    if (params.has('tunel')) this.multiplayer.localWorldDistM = 5440;
    if (params.has('kopru')) this.multiplayer.localWorldDistM = 12440;

    this.bindEvents();
    this.setupAppMode();
    this.updateHUD();
    this.openMenu('home');
    this.menuMusic.play();
    this.setupAudioUnlock();
    this.animate();
  }

  applyCameraPreset(index) {
    this.cameraPresetIndex = index % CAMERA_PRESETS.length;
    const preset = CAMERA_PRESETS[this.cameraPresetIndex];
    this.cockpit.setViewPreset(this.cameraPresetIndex);
    this.camera.position.copy(preset.offset);
    this.camera.fov = preset.baseFov;
    this.updateCameraProjection();
    // Outside view: no cabin and no mirrors, the car's own model and a speed readout instead
    const chase = Boolean(preset.chase);
    this.chaseView = chase;
    this.cockpit.setExteriorView(chase);
    document.body.dataset.view = chase ? 'chase' : 'cockpit';
    if (this.replay && !this.replay.active) this.replay.playerCarGroup.visible = false; // shown again each frame in chase view
    this.chaseX = this.playerX;
    localStorage.setItem('otoban_camera', String(this.cameraPresetIndex));

    const label = document.getElementById('camera-label');
    if (label) label.textContent = preset.name;
    document.querySelectorAll('#camera-select-group [data-camera]').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.camera) === this.cameraPresetIndex);
    });
  }

  // Size of the full-screen game view. Read from the laid-out container rather than
  // window.innerWidth/innerHeight, which mobile browsers can still report from the old
  // orientation when the resize event of a rotation fires.
  viewportSize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    return { w, h };
  }

  updateCameraProjection() {
    const { w, h } = this.viewportSize();
    const preset = CAMERA_PRESETS[this.cameraPresetIndex];
    this.camera.aspect = w / h;
    // Shift optical center upward so the 3D highway horizon sits inside the Audi A8 windshield
    this.camera.setViewOffset(w, h, 0, Math.round(h * preset.horizonShiftY), w, h);
    this.camera.updateProjectionMatrix();
  }

  bindEvents() {
    const resize = () => {
      const { w, h } = this.viewportSize();
      if (w === this._viewW && h === this._viewH) return;
      this._viewW = w;
      this._viewH = h;
      this.updateCameraProjection();
      this.renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    new ResizeObserver(resize).observe(this.container);
    // Some phones finish laying out a rotation well after its events: check again once it settles
    window.addEventListener('orientationchange', () => {
      for (const ms of [100, 350, 800]) setTimeout(resize, ms);
    });
    resize();

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.repeat) return;
      const code = e.code;

      if (this.replay?.active) {
        if (code === 'Escape') {
          this.closeDroneReplay();
        } else if (code === 'Space') {
          e.preventDefault();
          const playing = this.replay.togglePlay();
          this.setHudText('drone-play-icon', playing ? '⏸' : '▶');
          this.setHudText('drone-play-label', playing ? 'Duraklat' : 'Oynat');
        } else if (code === 'KeyC') {
          const angle = this.replay.cycleAngle();
          this.setHudText('drone-angle-label', angle.label);
        }
        return;
      }

      if (code === 'KeyW' || code === 'ArrowUp') this.keys.gas = true;
      if (code === 'KeyS' || code === 'ArrowDown') this.keys.brake = true;
      if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = true;
      if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyX') this.keys.handbrake = true;
      if (code === 'KeyF' || code === 'Space') {
        this.setHighBeam(true);
      }
      if (code === 'KeyH') {
        this.keys.horn = true;
        this.sound.setHorn(true);
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
        this.pickWeather(preset);
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
        this.handleEscape();
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') this.keys.gas = false;
      if (code === 'KeyS' || code === 'ArrowDown') this.keys.brake = false;
      if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = false;
      if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyX') this.keys.handbrake = false;
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
      this.openMenu('online');
    });

    // Result card after a crash (single player)
    document.getElementById('btn-gameover-retry')?.addEventListener('click', () => this.restartDrive());
    document.getElementById('btn-gameover-garage')?.addEventListener('click', () => {
      this.endDrive();
      this.setScreen('garage');
    });
    document.getElementById('btn-gameover-home')?.addEventListener('click', () => this.endDrive());

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
      this.openPause();
    });

    // Home: a mode card starts a drive on that road, the banner resumes the one in progress
    document.querySelectorAll('#road-mode-group [data-road]').forEach((card) => {
      card.addEventListener('click', () => this.startFromHome(card.dataset.road));
    });
    document.getElementById('btn-resume-drive')?.addEventListener('click', () => this.resumeDrive());
    document.getElementById('btn-open-garage')?.addEventListener('click', () => this.setScreen('garage'));
    document.getElementById('btn-open-online')?.addEventListener('click', () => this.setScreen('online'));
    document.getElementById('btn-open-settings')?.addEventListener('click', () => this.openSettings());
    document.querySelectorAll('[data-menu-back]').forEach((btn) => {
      btn.addEventListener('click', () => this.setScreen('home'));
    });
    document.getElementById('btn-garage-drive')?.addEventListener('click', () => {
      if (!this.canDriveSelectedCar()) {
        this.garageUI.flashLocked();
      } else if (this.runActive) {
        this.resumeDrive();
      } else {
        this.startFromHome(this.traffic.roadMode);
      }
    });

    // Pause card
    document.getElementById('btn-pause-resume')?.addEventListener('click', () => this.resumeDrive());
    document.getElementById('btn-pause-restart')?.addEventListener('click', () => this.restartDrive());
    document.getElementById('btn-pause-settings')?.addEventListener('click', () => this.openSettings());
    document.getElementById('btn-pause-garage')?.addEventListener('click', () => this.openMenu('garage'));
    document.getElementById('btn-pause-end')?.addEventListener('click', () => this.endDrive());

    // Settings sheet and the first-drive control picker
    document.getElementById('btn-settings-close')?.addEventListener('click', () => this.closeSettings());
    document.getElementById('settings-sheet')?.addEventListener('click', (e) => {
      if (e.target.id === 'settings-sheet') this.closeSettings();
    });
    document.querySelectorAll('[data-settings-tab]').forEach((tab) => {
      tab.addEventListener('click', () => this.showSettingsTab(tab.dataset.settingsTab));
    });
    document.getElementById('btn-picker-cancel')?.addEventListener('click', () => this.closeControlPicker());
    document.getElementById('sound-switch')?.addEventListener('change', (e) => {
      if (e.target.checked === this.sound.muted) this.toggleSound();
    });
    this.setupAudioSettings();
    const coachBtn = document.getElementById('btn-replay-coach');
    coachBtn?.addEventListener('click', () => {
      resetCoach();
      coachBtn.textContent = 'İpuçları bir sonraki sürüşte gösterilecek ✓';
      coachBtn.disabled = true;
    });

    // Drone Replay (from the pause card or the home screen) & its controls
    document.querySelectorAll('.js-drone-replay').forEach((btn) => {
      btn.addEventListener('click', () => this.openDroneReplay());
    });
    document.getElementById('btn-drone-close')?.addEventListener('click', () => {
      this.closeDroneReplay();
    });
    document.getElementById('btn-drone-playpause')?.addEventListener('click', () => {
      if (!this.replay?.active) return;
      const playing = this.replay.togglePlay();
      this.setHudText('drone-play-icon', playing ? '⏸' : '▶');
      this.setHudText('drone-play-label', playing ? 'Duraklat' : 'Oynat');
    });
    document.getElementById('btn-drone-angle')?.addEventListener('click', () => {
      if (!this.replay?.active) return;
      const angle = this.replay.cycleAngle();
      this.setHudText('drone-angle-label', angle.label);
    });
    document.getElementById('btn-drone-download')?.addEventListener('click', () => {
      if (!this.replay?.active) return;
      if (this.replay.isRecordingVideo) {
        this.replay.stopVideoRecording();
      } else {
        this.replay.startVideoRecording();
      }
    });
    const scrubber = document.getElementById('drone-scrubber');
    scrubber?.addEventListener('input', (e) => {
      if (!this.replay?.active) return;
      const ratio = Number(e.target.value) / 1000;
      this.replay.seekToRatio(ratio);
    });

    // Garage: the car strip, previous / next on the turntable, and the online paint preview
    this.buildCarSelect();
    document.querySelectorAll('#garage-car-select [data-car]').forEach((btn) => {
      btn.addEventListener('click', () => this.setCar(btn.dataset.car));
      // Pointing at a card starts that car's download, so it is often there by the click
      const preload = () => this.showroom?.preload(btn.dataset.car);
      btn.addEventListener('pointerenter', preload);
      btn.addEventListener('focus', preload);
    });
    document.getElementById('btn-car-prev')?.addEventListener('click', () => this.stepCar(-1));
    document.getElementById('btn-car-next')?.addEventListener('click', () => this.stepCar(1));
    this.setCar(this.selectedCar, false);

    // Reduced motion: the turntable stands still
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showroom?.setAutoRotate(false);
    }
    // The custom swatch opens the paint creator and wears the colour made there
    this.paintCreator = new PaintCreator({
      onPreview: (hex) => this.showroom?.setPaint(hex),
      onApply: (hex) => this.setGaragePaint(CUSTOM_PAINT + hex),
    });
    document.querySelectorAll('#garage-paint-group .paint-swatch').forEach((sw) => {
      sw.addEventListener('click', () => {
        if (sw.dataset.paint === 'custom') this.setGaragePaint(CUSTOM_PAINT + this.paintCreator.color);
        else this.setGaragePaint(Number(sw.dataset.paint));
      });
    });
    this.setGaragePaint(this.selectedPaintSlot);

    // Modal Settings Selectors
    document.querySelectorAll('#weather-select-group [data-weather]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-weather');
        const preset = this.world.applyWeather(key);
        this.pickWeather(preset);
      });
    });

    document.querySelectorAll('#ambient-select-group .swatch').forEach((sw) => {
      sw.addEventListener('click', () => {
        const colorKey = sw.getAttribute('data-color');
        const info = this.cockpit.setAmbientColor(colorKey);
        this.syncAmbientUI(colorKey, info.css);
      });
    });

    // Touch steering: the same three choices in Ayarlar and in the first-drive picker
    this.buildSteerOptions(document.getElementById('steer-mode-group'), (mode) => this.setSteerMode(mode));
    this.buildSteerOptions(document.getElementById('picker-steer-options'), (mode) => this.pickControl(mode));
    this.setSteerMode(this.steerMode, { remember: false });

    document.querySelectorAll('#camera-select-group [data-camera]').forEach((btn) => {
      btn.addEventListener('click', () => this.applyCameraPreset(Number(btn.dataset.camera)));
    });

    document.querySelectorAll('#traffic-density-group [data-density]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#traffic-density-group [data-density]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const density = btn.getAttribute('data-density');
        this.traffic.setDensity(density);
        try {
          localStorage.setItem('otoban_traffic_density', density);
        } catch (_) {}
        if (this.paused && !this.multiplayer.isRemoteControlled) {
          this.traffic.resetTraffic();
        }
      });
    });

    this.garageFirst.then(() => this.loadCockpit3D());
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

    // Allow scrolling, clicking and native slider interaction inside menus, settings sheets and modals
    const isInteractiveUI = (target) => {
      if (!target || !target.closest) return false;
      return Boolean(
        target.closest(
          '#menu-overlay, #settings-sheet, #first-drive-sheet, .sheet-overlay, .sheet-panel, .menu-modal, .pause-card, .picker-card, .game-dialog, input, select, textarea, button, label'
        )
      );
    };

    document.addEventListener('contextmenu', (e) => {
      if (!isInteractiveUI(e.target)) {
        e.preventDefault();
      }
    });

    // Block multi-finger pinch zoom and rapid double-tap zoom across the entire document
    let lastTouchEndTime = 0;
    document.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length > 1 && !isInteractiveUI(e.target)) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.addEventListener(
      'touchmove',
      (e) => {
        // Multi-touch pinch-zoom is blocked everywhere
        if (e.touches.length > 1 || (e.scale !== undefined && e.scale !== 1)) {
          e.preventDefault();
          return;
        }
        // Allow smooth native scrolling & slider interaction inside menus, settings sheet, and modals
        if (isInteractiveUI(e.target)) {
          return;
        }
        // In gameplay canvas, prevent pull-to-refresh and unwanted viewport rubber-banding
        e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener(
      'touchend',
      (e) => {
        const now = performance.now();
        if (now - lastTouchEndTime <= 350 && !isInteractiveUI(e.target)) {
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

    // Going to the background (a call, a notification, the app switcher) pauses the drive, and
    // saves the coins (otherwise written a few seconds after they are earned) and records at once
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.profile.flush();
        this.saveRecords();
        this.openPause();
        this.menuMusic?.pause();
      } else if (this.uiState === 'menu') {
        this.sound.init();
        this.menuMusic?.play();
      }
    });
    window.addEventListener('pagehide', () => {
      this.menuMusic?.pause();
      this.profile.flush();
      this.saveRecords();
    });

    const portrait = window.matchMedia('(orientation: portrait) and (pointer: coarse)');
    this.portraitPhone = portrait;
    portrait.addEventListener('change', () => {
      if (portrait.matches) this.openPause();
      // The rotate screen covers the garage: no need to draw it meanwhile
      this.showroom?.setActive(this.uiState === 'menu' && !portrait.matches && !this.replay?.active);
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

  // Ayarlar / first-drive picker: one button per steering mode
  buildSteerOptions(container, onPick) {
    if (!container) return;
    container.replaceChildren(
      ...STEER_MODES.map((mode) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'steer-option';
        btn.dataset.steermode = mode.id;
        btn.setAttribute('aria-pressed', 'false');
        const icon = document.createElement('span');
        icon.className = 'steer-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = mode.icon;
        const title = document.createElement('strong');
        title.textContent = mode.title;
        const desc = document.createElement('small');
        desc.textContent = mode.desc;
        btn.append(icon, title, desc);
        if (mode.badge) {
          const badge = document.createElement('em');
          badge.className = 'steer-badge';
          badge.textContent = mode.badge;
          btn.append(badge);
        }
        btn.addEventListener('click', () => onPick(mode.id));
        return btn;
      })
    );
  }

  setSteerMode(mode, { remember = true } = {}) {
    if (!STEER_MODES.some((m) => m.id === mode)) return;
    this.steerMode = mode;
    this.touchSteerValue = 0;
    if (remember) {
      this.steerModeChosen = true;
      try {
        localStorage.setItem(STEER_MODE_KEY, mode);
      } catch (_) {}
      this.requestTiltPermission();
    }
    document.querySelectorAll('.steer-option[data-steermode]').forEach((btn) => {
      const on = btn.dataset.steermode === mode;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    this.updateSteerModeUI();
  }

  // iOS only delivers orientation events after an explicit permission prompt, which must be
  // triggered from a user gesture (picking tilt, or the tap that starts or resumes the drive)
  requestTiltPermission() {
    if (this.steerMode === 'tilt' && typeof window.DeviceOrientationEvent?.requestPermission === 'function') {
      window.DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  }

  isTouch() {
    return window.matchMedia('(pointer: coarse)').matches;
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

  // The player picked the weather: the next drive starts in it, and the day/night cycle goes on
  // from it
  pickWeather(preset) {
    this.chosenWeather = preset.key;
    this.dayCycle?.anchor(preset.key, this.tripDistanceKm || 0);
    this.syncWeatherUI(preset);
  }

  syncWeatherUI(preset) {
    const iconEl = document.getElementById('weather-icon');
    const labelEl = document.getElementById('weather-label');
    if (iconEl) iconEl.textContent = preset.icon;
    if (labelEl) labelEl.textContent = preset.label;

    document.querySelectorAll('#weather-select-group [data-weather]').forEach((card) => {
      card.classList.toggle('active', card.getAttribute('data-weather') === preset.key);
    });
    this.setHudText('weather-current', preset.label);
    const overlay = document.getElementById('menu-overlay');
    if (overlay) overlay.dataset.weather = preset.key;

    // Automatically turn on wipers in Rainy weather
    this.cockpit.toggleWipers(preset.rain);
    this.sound.setRainAmbience(preset.rain);
    this.updateHomeSummary();
  }

  // Where the cabin is placed around the driver's eye: the current cockpit view's camera spot.
  // The chase view's camera is far behind the car, so a cabin loaded while it is on (the game
  // remembers the view) is placed for the first cockpit view instead.
  cabinEyeAnchor() {
    const preset = CAMERA_PRESETS[this.cameraPresetIndex || 0];
    return (preset.chase ? CAMERA_PRESETS[0] : preset).offset;
  }

  // The 3D interior is the only cockpit. While its model downloads (or if every attempt
  // fails) the photo cockpit stays on screen as a fallback so the game remains playable.
  async loadCockpit3D(attempt = 1) {
    const applied = await this.cockpit.setMode('3d', this.cabinEyeAnchor(), this.selectedCar);
    if (applied !== '3d' && attempt < 3) {
      setTimeout(() => this.loadCockpit3D(attempt + 1), attempt * 2000);
    }
  }

  // One garage card button per registered car (src/cars/)
  buildCarSelect() {
    const group = document.getElementById('garage-car-select');
    if (!group) return;
    group.replaceChildren(
      ...CAR_LIST.map((car) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'car-select-card';
        btn.dataset.car = car.id;
        btn.setAttribute('aria-pressed', 'false');

        const info = document.createElement('span');
        info.className = 'car-card-info';
        const make = document.createElement('small');
        make.className = 'car-card-make';
        make.textContent = car.make;
        const name = document.createElement('strong');
        name.className = 'car-card-name';
        name.textContent = car.model;
        info.append(make, name);

        const variant = document.createElement('span');
        variant.className = 'car-card-variant';
        variant.textContent = car.variant;

        // New version: price of a car not bought yet (src/progression/garageUI.js)
        const price = document.createElement('span');
        price.className = 'car-card-price';
        price.hidden = true;

        const check = document.createElement('span');
        check.className = 'car-card-check';
        check.setAttribute('aria-hidden', 'true');
        check.textContent = '✓';

        btn.append(info, variant, price, check);
        return btn;
      })
    );
  }

  // 3D model credits for every car, listed in the guide (CC BY needs source, author and licence)
  renderCarCredits() {
    const el = document.getElementById('model-credits');
    if (!el || el.childElementCount) return;
    const link = (href, text) => {
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = text;
      a.style.cssText = 'color: var(--accent-cyan); text-decoration: underline;';
      return a;
    };
    for (const car of CAR_LIST) {
      const c = car.credit;
      if (!c) continue;
      const row = document.createElement('div');
      row.append('🚗 ', link(c.url, `"${c.title}"`), ` · ${c.author} · `, link(c.licenseUrl, c.license));
      if (c.note) row.append(` · ${c.note}`);
      el.append(row);
    }
  }

  // Garage car model selection
  setCar(carId, switchShowroom = true) {
    if (!CARS[carId]) return;
    this.selectedCar = carId;
    localStorage.setItem('otoban_selected_car', carId);

    const config = CARS[carId];
    this.renderCarCredits();
    this.setHudText('garage-car-make', config.make);
    const modelEl = document.getElementById('garage-car-model');
    if (modelEl) {
      modelEl.innerHTML = `${config.model} <small class="car-variant" id="garage-car-variant">${config.variant}</small>`;
    }
    document.querySelectorAll('#garage-car-select [data-car]').forEach((btn) => {
      const on = btn.dataset.car === carId;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
      if (on && this.menuScreen === 'garage') btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    const loader = document.getElementById('garage-loader');
    if (loader) {
      loader.classList.remove('done', 'failed');
      const text = loader.querySelector('span:not(.loader-ring)');
      if (text) text.textContent = `${config.model} garaja çekiliyor…`;
    }

    const shown = switchShowroom ? this.showroom?.switchCar(carId) : null;

    if (this.cockpit) {
      // In the menu the turntable car downloads first; the interior is only needed for a drive
      // (beginDrive asks for it straight away if the player starts before it is in)
      const loadInterior = () => {
        if (this.selectedCar === carId) this.cockpit.setCarType(carId, this.cabinEyeAnchor());
      };
      if (shown && this.uiState === 'menu') shown.finally(loadInterior);
      else loadInterior();
    }

    if (this.multiplayer) {
      this.multiplayer.setLocalCarModel(carId);
    }
    this.applyCarPerformance(); // also loads the drone replay's exterior of this car
  }

  // Garage arrows beside the turntable: the previous / next car in the strip
  stepCar(step) {
    const index = CAR_LIST.findIndex((car) => car.id === this.selectedCar);
    const next = CAR_LIST[(index + step + CAR_LIST.length) % CAR_LIST.length];
    this.setCar(next.id);
  }

  // Physics of the selected car: its own stats and upgrades in the new version, the shared
  // classic tuning otherwise. The speedometer dial grows with cars faster than 260 km/h.
  applyCarPerformance() {
    const car = CARS[this.selectedCar];
    const parts = this.fittedParts();
    this.currentParts = parts; // recorded with every replay frame
    this.carPhysics = this.newVersion
      ? resolvePhysics(carStats(car, this.profile.levels(car.id), parts))
      : CLASSIC_PHYSICS;
    // Gearbox, engine sound and body of this car (src/progression/drivetrain.js)
    this.drivetrain = resolveDrivetrain(car);
    this.chassis = resolveChassis(car);
    this.gear = Math.min(this.gear, this.drivetrain.gears.length);
    this.sound.setEngineProfile(this.drivetrain);
    this.traffic.playerMass = this.chassis.mass;
    // Spoiler and rims show on the garage car, to online friends and in the drone replay
    this.showroom?.setParts(parts);
    this.multiplayer?.setLocalParts(parts);
    this.replay?.ensurePlayerExteriorModel(car.id, this.selectedPaintSlot || 0, parts);
    this.updateRoadNeon(car, parts);
    const top = this.carPhysics.maxSpeed;
    this.cockpit?.setSpeedoMax(top <= 260 ? 260 : top <= 320 ? 320 : 360);
    this.garageUI.render(car);
  }

  // Neon underglow of the driven car: its light on the road round the car (in the mirrors) and
  // the part of it that spills out ahead onto the road the driver sees over the bonnet. The car
  // itself is not drawn in the cockpit view.
  updateRoadNeon(car, parts) {
    if (!this.roadNeonGroup) {
      this.roadNeonGroup = new THREE.Group();
      this.scene.add(this.roadNeonGroup);
    }
    const length = car.exterior?.length ?? 4.8;
    if (this.roadNeonLength !== length) {
      this.roadNeonGroup.clear();
      this.roadNeon = [createNeonGlow(1.9, length, 1.6), createNeonSpill(length)];
      this.roadNeonGroup.add(...this.roadNeon.map((glow) => glow.mesh));
      this.roadNeonLength = length;
    }
    const hex = neonColorHex(parts.neon);
    this.roadNeon.forEach((glow) => glow.setColor(hex));
  }

  setNewVersion(on = true) {
    this.newVersion = true;
    setNewVersionEnabled(true);
    this.garageUI.setEnabled(true);
    this.coinScoreMark = this.score;
    this.coinCarry = 0;
    this.applyCarPerformance();
  }

  // Garage: parts tried on the turntable car before they are bought (null: back to the fitted ones)
  previewParts(parts, kind) {
    this.showroom?.setParts(parts ?? this.fittedParts());
    this.showPartView(kind);
  }

  // Turns the garage car round so a part just tried or bought is in view
  showPartView(kind) {
    const view = PART_VIEWS[kind];
    if (view) this.showroom?.goToView(view);
  }

  onGaragePurchase({ type }) {
    this.sound.init();
    this.sound.playSelektorClick();
    this.applyCarPerformance();
    this.showPartView(type);
  }

  // Parts on the selected car ({ spoiler, rim, plate }); none in the classic game
  fittedParts() {
    return this.newVersion ? this.profile.parts(this.selectedCar) : {};
  }

  // In the new version only cars bought (or the starter car) can be driven
  canDriveSelectedCar() {
    return !this.newVersion || this.profile.owns(CARS[this.selectedCar]);
  }

  // New version: a drive pays coins for the points scored (penalties take none back) and the
  // distance covered. Whole coins go straight into the profile, which saves them shortly after.
  earnCoins(distanceKm) {
    const gained = this.score - this.coinScoreMark;
    this.coinScoreMark = this.score;
    if (!this.newVersion) return;
    this.coinCarry += Math.max(0, gained) * COINS_PER_POINT + distanceKm * COINS_PER_KM;
    if (this.coinCarry >= 1) {
      const whole = Math.floor(this.coinCarry);
      this.coinCarry -= whole;
      this.runCoins += whole;
      this.profile.earn(whole);
    }
  }

  // Home screen: the mode cards (records, the road driven last) and the resume banner
  updateHomeSummary() {
    const road = this.traffic?.roadMode ?? 'highway';
    document.querySelectorAll('#road-mode-group [data-road]').forEach((card) => {
      card.classList.toggle('active', card.dataset.road === road);
    });
    for (const mode of ['highway', 'twoway']) {
      const best = this.modeBest?.[mode] ?? 0;
      this.setHudText(`record-${mode}`, best > 0 ? Math.floor(best).toLocaleString('tr-TR') : '—');
    }
    this.setHudText('record-track', this.bestLapTime > 0 ? this.formatLapTime(this.bestLapTime) : '—');

    document.getElementById('menu-overlay')?.classList.toggle('run-active', this.runActive);
    document.getElementById('btn-resume-drive')?.classList.toggle('hidden', !this.runActive);
    this.setHudText('mode-kicker', this.runActive ? 'Yeni sürüş başlat' : 'Sürüş modu');
    if (this.runActive) {
      const weather = WEATHER_PRESETS[this.world?.weatherKey]?.label || 'Gece';
      const score = Math.floor(this.score).toLocaleString('tr-TR');
      this.setHudText('resume-sub', `${ROAD_LABELS[road] ?? ''} · ${weather} · ${score} puan`);
    }
    this.garageUI?.setDriveLabel(this.runActive ? 'BU ARAÇLA DEVAM ET' : 'BU ARAÇLA SÜR');
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
    // The menus take the cabin's ambient colour as their accent (turntable ring, buttons)
    document.documentElement.style.setProperty('--accent', cssColor);
    this.showroom?.setAccent(cssColor);
  }

  // Garage paint: one of the four preset colours or the player's own from the paint creator;
  // friends online see the car in it
  setGaragePaint(slot) {
    this.selectedPaintSlot = normPaintSlot(slot);
    const custom = this.selectedPaintSlot >= CUSTOM_PAINT;
    try {
      localStorage.setItem('otoban_selected_paint', String(this.selectedPaintSlot));
    } catch (_) {}
    this.showroom?.setPaint(paintHexOf(this.selectedPaintSlot));
    this.paintCreator?.open(custom);
    document.querySelectorAll('#garage-paint-group .paint-swatch').forEach((sw) => {
      const on = custom ? sw.dataset.paint === 'custom' : Number(sw.dataset.paint) === this.selectedPaintSlot;
      sw.classList.toggle('active', on);
      if (on) this.setHudText('garage-paint-name', sw.getAttribute('aria-label'));
    });
    this.multiplayer?.setLocalPaintSlot(this.selectedPaintSlot);
    this.replay?.ensurePlayerExteriorModel(this.selectedCar, this.selectedPaintSlot, this.fittedParts());
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
      if (!connected) this.hideRoundBanner();
    }
    if (quickBtn) {
      quickBtn.classList.toggle('connected', Boolean(connected));
    }
    if (quickLabel) {
      quickLabel.textContent = connected ? `Oda ${roomCode} · ${playerCount}/${MAX_PLAYERS}` : `${MAX_PLAYERS} Kişilik`;
    }
    document.getElementById('tab-online-dot')?.classList.toggle('on', Boolean(connected));
  }

  toggleSound() {
    const muted = this.sound.toggleMute();
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
    const soundSwitch = document.getElementById('sound-switch');
    if (soundSwitch) soundSwitch.checked = !muted;
    this.radio.setMuted(muted);
    this.menuMusic?.setMuted(muted);
    document.getElementById('sound-sliders-group')?.classList.toggle('muted', muted);
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

  setUiState(state) {
    this.uiState = state;
    this.paused = state !== 'drive';
    document.body.dataset.ui = state;
    this.sound.setMuffled(state === 'pause' || state === 'gameover');
  }

  // The menu around the turntable car. A drive in progress waits underneath (the home screen
  // offers to resume it).
  openMenu(screen = 'home') {
    if (this.replay?.active) this.closeDroneReplay({ reopenMenu: false });
    this.cancelCountdown();
    this.closeSettings();
    this.closeControlPicker();
    this.releaseInputs();
    this.saveRecords();
    this.profile.flush();
    this.garageUI.setRunCoins(this.runCoins);
    this.setUiState('menu');
    document.getElementById('pause-overlay')?.classList.add('hidden');
    document.getElementById('menu-overlay')?.classList.remove('hidden');
    this.setHudText('menu-best', Math.floor(this.bestScore).toLocaleString('tr-TR'));
    this.setScreen(screen);
    this.syncDroneReplayButton();
    this.menuMusic?.fadeIn(0.7);
  }

  // Home, garage or online panel of the menu
  setScreen(screen) {
    if (this.menuScreen === 'garage' && screen !== 'garage') this.garageUI.cancelPending();
    this.menuScreen = screen;
    const overlay = document.getElementById('menu-overlay');
    if (overlay) overlay.dataset.screen = screen;
    document.querySelectorAll('[data-screen-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.screenPanel !== screen;
    });
    if (screen === 'home') this.updateHomeSummary();
    if (screen === 'garage') {
      document.querySelector('#garage-car-select .active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    this.showroom?.setActive(this.uiState === 'menu' && !this.portraitPhone?.matches && !this.replay?.active);
  }

  // Leaves every overlay and drives: a new drive, a resume, or an online match starting
  beginDrive() {
    if (this.replay?.active) this.closeDroneReplay({ reopenMenu: false });
    if (!this.canDriveSelectedCar()) {
      // An online match starting while a car not bought yet is selected: drive the first one that is
      this.setCar((CAR_LIST.find((car) => this.profile.owns(car)) ?? CAR_LIST[0]).id);
    }
    // Downloads held back for the turntable car start now, and the selected car's interior too
    this.openGarageGate();
    this.cockpit.setCarType(this.selectedCar, this.cabinEyeAnchor());
    this.cancelCountdown();
    this.closeSettings();
    this.closeControlPicker();
    document.getElementById('menu-overlay')?.classList.add('hidden');
    document.getElementById('pause-overlay')?.classList.add('hidden');
    this.showroom?.setActive(false);
    this.menuMusic?.fadeOut(0.4);
    this.sound.init();
    this.sound.setRainAmbience(this.world.weatherKey === 'rain');
    this.warmShaders();
    this.runActive = true;
    this.hasStartedDriving = true;
    this.setUiState('drive');
    if (!coachDone()) {
      this.coach.start({ touch: this.isTouch(), steerMode: this.steerMode, roadMode: this.traffic.roadMode });
    }
  }

  // Compiles every shader a drive can need before the car moves, for the screen and for the
  // rear-view mirror (a render target gets its own linear-output variant of each material).
  // Without it the first traffic car to enter the mirror stalls a frame for up to ~200 ms while
  // its paint and plate shaders compile. compile() also covers hidden objects (blinkers, night
  // glows, tunnel and track scenery); shaders already built are only looked up.
  warmShaders() {
    // The tunnel's reflections are prepared too (each environment is filtered the first time it
    // is drawn with), so driving into the first tunnel does not stall a frame
    const environment = this.scene.environment;
    this.scene.environment = this.world.environments.tunnel;
    this.renderer.compile(this.scene, this.camera);
    this.scene.environment = environment;
    this.cockpit.compileRearMirror(this.scene);
    this.renderer.compile(this.scene, this.camera);
  }

  // Home: a mode card. A new drive on that road (one in progress ends); touch screens first
  // pick how to steer, once.
  startFromHome(road) {
    if (!this.canDriveSelectedCar()) {
      this.setScreen('garage');
      this.garageUI.flashLocked();
      return;
    }
    if (this.isTouch() && !this.steerModeChosen) {
      this.showControlPicker(road);
      return;
    }
    this.enterAppFullscreen();
    this.requestTiltPermission();
    const nameInput = document.getElementById('mp-player-name');
    if (nameInput?.value) this.multiplayer.setPlayerName(nameInput.value);
    this.setRoadMode(road, { remember: true });
    this.resetRun();
    this.beginDrive();
  }

  // Pause card over the frozen road. Only from a drive (the button, Esc, the app going to the
  // background, the phone turned upright).
  openPause() {
    if (this.uiState !== 'drive' && this.uiState !== 'countdown') return;
    this.cancelCountdown();
    this.releaseInputs();
    this.saveRecords();
    this.profile.flush();
    this.setUiState('pause');
    this.setHudText('pause-score', Math.floor(this.score).toLocaleString('tr-TR'));
    this.setHudText('pause-time', this.formatPlayTime(this.playTimeSec));
    this.setHudText('pause-km', (this.tripDistanceKm || 0).toFixed(2));
    document.getElementById('pause-overlay')?.classList.remove('hidden');
    this.syncDroneReplayButton();
  }

  // Back into the drive in progress: 3-2-1 first while the car is moving. Online the others keep
  // driving, so the car catches up with them and goes on straight away.
  resumeDrive() {
    if (!this.runActive) return;
    if (!this.canDriveSelectedCar()) {
      this.openMenu('garage');
      this.garageUI.flashLocked();
      return;
    }
    this.enterAppFullscreen();
    this.requestTiltPermission();
    if (this.multiplayer.connected) {
      this.beginDrive();
    } else if (this.speedKmh < 5) {
      this.beginDrive();
    } else {
      this.startCountdown();
    }
  }

  startCountdown() {
    this.cancelCountdown();
    this.closeSettings();
    document.getElementById('menu-overlay')?.classList.add('hidden');
    document.getElementById('pause-overlay')?.classList.add('hidden');
    this.showroom?.setActive(false);
    this.menuMusic?.fadeOut(0.3);
    this.setUiState('countdown');
    this.sound.init();

    const box = document.getElementById('countdown');
    const num = document.getElementById('countdown-num');
    const show = (text, go) => {
      box.classList.remove('hidden');
      box.classList.toggle('go', go);
      num.textContent = text;
      num.classList.remove('tick');
      void num.offsetWidth;
      num.classList.add('tick');
      this.sound.playSelektorClick();
    };
    show('3', false);
    ['2', '1', 'HAYDİ!'].forEach((text, i) => {
      const go = i === 2;
      const timer = setTimeout(() => {
        if (go) {
          this.beginDrive(); // also hides the countdown: GO stays up a moment longer
          this.countdownTimers.push(setTimeout(() => box.classList.add('hidden'), COUNTDOWN_STEP_MS));
        }
        show(text, go);
      }, (i + 1) * COUNTDOWN_STEP_MS);
      this.countdownTimers.push(timer);
    });
  }

  cancelCountdown() {
    this.countdownTimers.forEach(clearTimeout);
    this.countdownTimers = [];
    document.getElementById('countdown')?.classList.add('hidden');
  }

  // Pause card: the same road again from a standstill
  restartDrive() {
    this.resetRun();
    this.beginDrive();
  }

  // Pause card: the drive ends and the home screen opens; the coins it earned stay beside the
  // wallet until the next drive
  endDrive() {
    this.openMenu('home');
    this.runActive = false;
    this.resetRun();
    this.updateHomeSummary();
  }

  handleEscape() {
    if (!document.getElementById('control-picker')?.classList.contains('hidden')) {
      this.closeControlPicker();
    } else if (this.settingsOpen) {
      this.closeSettings();
    } else if (this.uiState === 'gameover') {
      this.endDrive();
    } else if (this.uiState === 'drive' || this.uiState === 'countdown') {
      this.openPause();
    } else if (this.uiState === 'pause') {
      this.resumeDrive();
    } else if (this.menuScreen !== 'home') {
      this.setScreen('home');
    } else if (this.runActive) {
      this.resumeDrive();
    }
  }

  // Keys and pedals held when the drive stops would otherwise still be held when it goes on
  releaseInputs() {
    for (const key of Object.keys(this.keys)) this.keys[key] = false;
    this.sound.setHorn(false);
    this.touchThrottle = 0;
    this.touchBrake = 0;
  }

  // The music and the radio play through the game's AudioContext (see routeThroughGain), so it is
  // created on the first touch and resumed on later ones after iOS interrupts it in the background.
  setupAudioUnlock() {
    this.sound.onContextReady = (ctx) => {
      this.menuMusic.attachToContext(ctx);
      this.radio.attachToContext(ctx, this.sound.muffle);
    };
    const unlock = () => this.sound.init();
    for (const type of ['pointerdown', 'touchend', 'keydown']) {
      window.addEventListener(type, unlock, { passive: true });
    }
  }

  // Every slider in Ayarlar → Ses Seviyeleri carries its sound group in data-volume (index.html);
  // moving it changes that group at once and saves it (SoundEngine.setVolume → localStorage).
  // Letting go plays a short sample of the group, where it has one.
  setupAudioSettings() {
    const previews = {
      tire: () => this.sound.playTireChirp(120),
      wind: () => this.sound.playMakasWhoosh(1, false, 140, false),
      horn: () => {
        if (this.keys.horn) return; // the player is already on the horn
        this.sound.setHorn(true);
        clearTimeout(this.hornPreviewTimer);
        this.hornPreviewTimer = setTimeout(() => {
          if (!this.keys.horn) this.sound.setHorn(false);
        }, 220);
      },
      crash: () => this.sound.playCrash(),
      ui: () => this.sound.playSelektorClick(),
    };

    document.querySelectorAll('#sound-sliders-group [data-volume]').forEach((slider) => {
      const category = slider.dataset.volume;
      const valEl = document.getElementById(`val-${category}-volume`);

      const update = () => {
        const pct = parseInt(slider.value, 10) || 0;
        if (valEl) valEl.textContent = `${pct}%`;
        const val = pct / 100;
        this.sound.setVolume(category, val);
        if (category === 'master') {
          this.menuMusic?.setMasterVolume(val);
          this.radio.setMasterVolume(val);
        } else if (category === 'music') {
          this.menuMusic?.setVolume(val);
        } else if (category === 'radio') {
          this.radio.setVolume(val);
        }
      };

      slider.addEventListener('input', update);
      slider.addEventListener('change', () => {
        update();
        const preview = previews[category];
        if (preview && !this.sound.muted) {
          this.sound.init();
          preview();
        }
      });
    });

    this.syncAudioSliders();
  }

  syncAudioSliders() {
    document.querySelectorAll('#sound-sliders-group [data-volume]').forEach((slider) => {
      const category = slider.dataset.volume;
      const current = this.sound.volumes[category] ?? 1.0;
      slider.value = Math.round(current * 100);
      const valEl = document.getElementById(`val-${category}-volume`);
      if (valEl) valEl.textContent = `${slider.value}%`;
    });

    document.getElementById('sound-sliders-group')?.classList.toggle('muted', this.sound.muted);
    const soundSwitch = document.getElementById('sound-switch');
    if (soundSwitch) soundSwitch.checked = !this.sound.muted;
  }

  openSettings() {
    this.settingsOpen = true;
    this.syncAudioSliders();
    this.showSettingsTab('prefs');
    document.getElementById('settings-sheet')?.classList.remove('hidden');
  }

  closeSettings() {
    this.settingsOpen = false;
    document.getElementById('settings-sheet')?.classList.add('hidden');
  }

  showSettingsTab(name) {
    document.querySelectorAll('[data-settings-tab]').forEach((tab) => {
      const on = tab.dataset.settingsTab === name;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('[data-settings-page]').forEach((page) => {
      page.hidden = page.dataset.settingsPage !== name;
    });
  }

  showControlPicker(road) {
    this.pickerRoad = road;
    document.getElementById('control-picker')?.classList.remove('hidden');
  }

  closeControlPicker() {
    document.getElementById('control-picker')?.classList.add('hidden');
  }

  // First-drive picker: remember the choice and start the drive it was asked for
  pickControl(mode) {
    this.setSteerMode(mode);
    this.closeControlPicker();
    this.startFromHome(this.pickerRoad ?? this.traffic.roadMode);
  }

  // A higher score is a record of the whole game and of the road it was driven on. Kept in
  // memory while driving; saveRecords() writes them (at events, pauses and the end of a drive).
  noteScore({ save = false } = {}) {
    if (this.score > this.bestScore) this.bestScore = Math.floor(this.score);
    const mode = this.traffic.roadMode;
    if (mode in this.modeBest && this.score > this.modeBest[mode]) this.modeBest[mode] = Math.floor(this.score);
    if (save) this.saveRecords();
  }

  saveRecords() {
    try {
      localStorage.setItem('otoban_makas_best', String(Math.floor(this.bestScore)));
      for (const [mode, best] of Object.entries(this.modeBest)) {
        localStorage.setItem(`otoban_best_${mode}`, String(Math.floor(best)));
      }
    } catch (_) {}
  }

  syncDroneReplayButton() {
    if (!this.replay) return;
    const hasClip = this.hasStartedDriving && this.replay.hasPlayableClip();
    document.querySelectorAll('.js-drone-replay').forEach((btn) => btn.classList.toggle('hidden', !hasClip));
    const meta = hasClip ? this.replay.getActiveClipMeta() : null;
    if (meta) {
      document.querySelectorAll('.js-drone-sub').forEach((el) => {
        el.textContent = `${meta.title} • ${meta.subtitle}`;
      });
    }
  }

  openDroneReplay() {
    if (!this.replay || (this.uiState !== 'menu' && this.uiState !== 'pause')) return;
    const started = this.replay.startReplay(this.cockpit);
    if (!started) {
      this.showMakasNotification('⚠️ HENÜZ KAYDEDİLMİŞ BİR MAKAS YOK', 0, 'normal');
      return;
    }

    // Hide menu & HUD overlays so the 3D Drone camera has a clean fullscreen view; closing it
    // goes back to where it was opened from
    this.replayReturn = this.uiState;
    this.menuMusic?.fadeOut(0.3);
    document.getElementById('menu-overlay')?.classList.add('hidden');
    document.getElementById('pause-overlay')?.classList.add('hidden');
    document.getElementById('hud-top')?.classList.add('hidden');
    document.getElementById('hud-mini-cluster')?.classList.add('hidden');
    document.getElementById('desktop-hints')?.classList.add('hidden');
    document.getElementById('touch-controls')?.classList.add('hidden');
    document.getElementById('drone-replay-overlay')?.classList.remove('hidden');
    this.showroom?.setActive(false);

    const clip = this.replay.currentClip;
    if (clip) {
      this.setHudText('drone-clip-title', clip.title);
      this.setHudText('drone-clip-subtitle', clip.subtitle);
    }
    this.setHudText('drone-play-icon', '⏸');
    this.setHudText('drone-play-label', 'Duraklat');
  }

  closeDroneReplay({ reopenMenu = true } = {}) {
    if (!this.replay?.active) return;
    this.replay.stopReplay();
    this.updateCameraProjection();

    document.getElementById('drone-replay-overlay')?.classList.add('hidden');
    document.getElementById('hud-top')?.classList.remove('hidden');
    document.getElementById('hud-mini-cluster')?.classList.remove('hidden');
    document.getElementById('desktop-hints')?.classList.remove('hidden');
    document.getElementById('touch-controls')?.classList.remove('hidden');

    if (reopenMenu && this.paused) {
      if (this.replayReturn === 'pause') {
        document.getElementById('pause-overlay')?.classList.remove('hidden');
      } else {
        document.getElementById('menu-overlay')?.classList.remove('hidden');
        this.showroom?.setActive(!this.portraitPhone?.matches);
        this.menuMusic?.fadeIn(0.7);
      }
      this.syncDroneReplayButton();
    }
  }

  updateDroneReplayHUD(info) {
    this.setHudText('drone-stat-speed', `${info.speedKmh} KM/S`);
    this.setHudText('drone-stat-combo', `${info.combo.toFixed(1)}x`);
    this.setHudText('drone-time-cur', `${info.playTime.toFixed(1).padStart(4, '0')}s`);
    this.setHudText('drone-time-dur', `${info.duration.toFixed(1).padStart(4, '0')}s`);

    const scrubber = document.getElementById('drone-scrubber');
    if (scrubber && document.activeElement !== scrubber) {
      scrubber.value = String(Math.round((info.playTime / Math.max(0.1, info.duration)) * 1000));
    }

    const banner = document.getElementById('drone-event-banner');
    if (banner) {
      if (info.eventText) {
        banner.textContent = info.eventText;
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }
  }

  syncDroneVideoStatus({ recording, completed, error }) {
    const btn = document.getElementById('btn-drone-download');
    const dot = document.getElementById('drone-rec-dot');
    if (btn) btn.classList.toggle('recording', Boolean(recording));
    if (dot) dot.classList.toggle('recording', Boolean(recording));

    if (recording) {
      this.setHudText('drone-download-icon', '⏹');
      this.setHudText('drone-download-label', 'Kaydediliyor… (Bitir & İndir)');
      this.setHudText('drone-rec-label', '🔴 VİDEO KAYDEDİLİYOR (10 SN)…');
    } else {
      this.setHudText('drone-download-icon', '⬇️');
      this.setHudText('drone-download-label', 'Videoyu İndir (10 sn)');
      this.setHudText(
        'drone-rec-label',
        completed ? '✅ VİDEO İNDİRİLDİ • DRONE REPLAY' : error ? `⚠️ ${error}` : 'DRONE REPLAY • 1080P 60FPS'
      );
    }
  }

  // A new drive: score, damage, trip and coins from zero, the car at a standstill on its start line
  resetRun() {
    this.score = 0;
    this.combo = 1.0;
    this.comboTimer = 0;
    this.tripDistanceKm = 0;
    this.roadClosures?.reset();
    if (this.dayCycle && !this.multiplayer?.connected) {
      // A new drive starts in the picked weather, wherever the last one's day had got to
      if (this.world.weatherKey !== this.chosenWeather || this.world.lightTarget) {
        this.syncWeatherUI(this.world.applyWeather(this.chosenWeather));
      }
      this.dayCycle.anchor(this.chosenWeather, 0);
    }
    this.playTimeSec = 0;
    this.runCoins = 0;
    this.coinScoreMark = 0;
    this.coinCarry = 0;
    this.overtakeRun = null;
    this.shakeIntensity = 0;
    this.resetDamage();
    document.getElementById('gameover-overlay')?.classList.add('hidden');
    this.startTimeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    this.speedKmh = 0;
    this.playerX = this.startX();
    this.lateralVel = 0;
    this.knockVel = 0;
    this.steerLossSec = 0;
    this.rearAxleIn = 0;
    this.roadJoint = -1;
    this.roadZone = null;
    this.yawRate = 0;
    this.headingAngle = 0;
    resetTrackCar(this.trackCar);
    this.bodyRoll = 0;
    this.rollVel = 0;
    this.bodyPitch = 0;
    this.pitchVel = 0;
    this.bodyHeave = 0; // m the body rides above/below its rest height (spring-damper)
    this.heaveVel = 0;
    this.accelFeel = 0;
    this.shiftCutSec = 0;
    this.shiftKick = 0;
    this.revBlip = 0;
    this.tyreStrain = 0;
    // Online the room shares one traffic (the host's): it is not reset for one player
    if (!this.multiplayer.connected) this.traffic.resetTraffic();
    if (this.traffic.roadMode === 'track') {
      this.currentLap = 1;
      this.lapStartTime = performance.now();
      this.lastAnnouncedTurn = '';
      this.lastApexTurn = '';
      if (!this.multiplayer.connected) {
        this.world.worldDistM = 0;
        this.world.sceneryItems.forEach((seg, idx) => {
          seg.position.z = 40 - idx * 20;
        });
      }
    }
    this.updateHUD();
  }

  triggerScreenFlash(className) {
    const vig = document.getElementById('screen-vignette');
    if (!vig) return;
    vig.classList.remove('crash-flash');
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
    if (mode === this.traffic.roadMode && mode === this.world.roadMode) {
      this.updateHomeSummary();
      return;
    }

    this.world.setRoadLayout(mode);
    this.traffic.setRoadMode(mode);
    this.overtakeRun = null;
    this.playerX = this.startX();
    this.lateralVel = 0;
    this.headingAngle = 0;
    resetTrackCar(this.trackCar);

    // Track mode state
    if (mode === 'track') {
      this.currentLap = 1;
      this.lapStartTime = performance.now();
      this.lastLapTime = 0;
      this.bestLapTime = Number(localStorage.getItem('otoban_track_best_lap') || 0);
      this.lastAnnouncedTurn = '';
      this.lastApexTurn = '';
      if (!this.multiplayer.connected) {
        this.world.worldDistM = 0;
        this.world.sceneryItems.forEach((seg, idx) => {
          seg.position.z = 40 - idx * 20;
        });
      }
      document.getElementById('hud-track-card')?.classList.remove('hidden');
    } else {
      document.getElementById('hud-track-card')?.classList.add('hidden');
    }
    this.updateHomeSummary();
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
      this.sound.playMakasWhoosh(this.combo, true, this.speedKmh, true);
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

  formatPlayTime(sec) {
    const total = Math.max(0, Math.floor(sec || 0));
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  updateTrackProgression() {
    if (this.traffic.roadMode !== 'track') return;

    const lapLen = TRACK_LAP_LENGTH;
    const trackDistM = this.world?.worldDistM || 0;
    const currentLapNumber = Math.max(1, Math.floor(trackDistM / lapLen) + 1);

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
        this.sound.playMakasWhoosh(5, true, this.speedKmh, true);
      } else {
        this.showMakasNotification(`🏁 TUR ${completedLap} TAMAMLANDI: ${timeStr}`, 800, 'combo');
        this.sound.playMakasWhoosh(2, false, this.speedKmh, false);
      }
    }

    // Turn notifications & apex scoring (including Turn 8's 4 distinct apexes!)
    const turnInfo = this.world.getTrackSectionAt?.(trackDistM);
    let hudTurnText = 'İSTANBUL PARK';
    if (turnInfo) {
      const isT8 = turnInfo.sec.code === 'T8';
      const t8ApexIdx = isT8 ? Math.min(4, Math.floor((turnInfo.t / turnInfo.sec.len) * 4) + 1) : 1;
      hudTurnText = isT8 ? `8. Viraj • Diabolica (Apeks ${t8ApexIdx}/4)` : turnInfo.sec.name;

      if (turnInfo.sec.code !== this.lastAnnouncedTurn && turnInfo.sec.deltaC !== 0) {
        this.lastAnnouncedTurn = turnInfo.sec.code;
        this.showMakasNotification(`🏁 ${turnInfo.sec.name.toUpperCase()}`, 0, 'normal');
      }

      // Apex Speed Reward: high speed cornering through the apex
      const isTurning = Math.abs(turnInfo.sec.deltaC) > 25;
      const apexKey = isT8 ? `T8_A${t8ApexIdx}` : turnInfo.sec.code;
      const subProgress = isT8
        ? ((turnInfo.t / turnInfo.sec.len) * 4) % 1
        : turnInfo.t / turnInfo.sec.len;
      const nearApex = subProgress > 0.32 && subProgress < 0.78;

      if (isTurning && nearApex && this.speedKmh >= 130 && Math.abs(this.lateralG) >= 0.42) {
        if (this.lastApexTurn !== apexKey) {
          this.lastApexTurn = apexKey;
          const pts = Math.round((isT8 ? 420 : 350) * this.combo);
          this.score += pts;
          this.combo = Math.min(10.0, this.combo + 0.5);
          this.comboTimer = 1.0;
          this.noteScore();
          this.coach.notifyScore();
          const apexLabel = isT8 ? `🏎️ 8. VİRAJ APEKS ${t8ApexIdx}/4 (+${pts})` : `🏎️ MÜKEMMEL APEX (+${pts})`;
          this.showMakasNotification(apexLabel, pts, 'combo');
          this.sound.playTireChirp(this.speedKmh);
        }
      }
    }

    // Update HUD Track Card
    const lapTimeSec = Math.max(0, (performance.now() - this.lapStartTime) / 1000);
    const hudTrackTurn = document.getElementById('hud-track-turn');
    const hudLapBadge = document.getElementById('hud-lap-badge');
    const hudLapTime = document.getElementById('hud-lap-time');
    const hudLapBest = document.getElementById('hud-lap-best');

    if (hudTrackTurn) hudTrackTurn.textContent = hudTurnText;
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
    } else {
      // Brushed past an oncoming car
      const closeness = Math.max(1, (1.2 - lateralGap) * 2.5);
      basePts = 350 * closeness * speedFactor;
      this.combo = Math.min(10.0, this.combo + 1.0);
      label = `😱 KARŞIDAN SIYIRDIN (${Math.round(lateralGap * 100)} CM)`;
      style = 'gold';
    }
    this.comboTimer = 1.0;
    const totalPts = basePts * this.combo;
    this.score += totalPts;
    this.noteScore({ save: true });
    this.coach.notifyScore();
    this.shakeIntensity = Math.min(0.45, this.shakeIntensity + 0.18);
    this.cockpit.triggerMakasCockpitPulse();
    this.sound.playMakasWhoosh(this.combo, style === 'gold', speedKmh, true);
    this.showMakasNotification(label, totalPts, style);
    this.replay?.notifyHighlightEvent({
      kind,
      lateralGap,
      speedKmh,
      isRazorClose: style === 'gold',
      combo: this.combo,
    });
  }

  handleMakas(data) {
    if (this.burning) return;
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
    } else if (isRazorClose) {
      basePts *= 1.5;
      label = `⚡ KUSURSUZ MAKAS (${Math.round(lateralGap * 100)} CM)`;
      style = 'gold';
    }

    const totalPts = basePts * this.combo;
    this.score += totalPts;
    this.noteScore({ save: true });
    this.coach.notifyScore();

    this.shakeIntensity = Math.min(0.45, this.shakeIntensity + (isDoubleMakas ? 0.32 : 0.16));
    this.cockpit.triggerMakasCockpitPulse();
    this.sound.playMakasWhoosh(this.combo, isDoubleMakas, speedKmh, isRazorClose);
    this.showMakasNotification(label, totalPts, style);
    this.replay?.notifyHighlightEvent({
      lateralGap,
      speedKmh,
      isRazorClose,
      isDoubleMakas,
      combo: this.combo,
    });
  }

  // A knock costs one hit (a head-on two); the last one sets the car on fire. Alone that ends the
  // drive (see updateBurning); online the host sees it in our state and gives the round away.
  // What the road does to the car on a straight: a slow float over the road's long waves (returned
  // as a height offset for the driver's eye, in m), and a thump from each axle over the bridge's
  // expansion joints, the lip at either end of the tunnel and the odd seam in the asphalt.
  updateRoadFeel(dt, speedMs) {
    const speedKmh = this.speedKmh;
    const zone = this.world.currentZone;
    const dist = this.world.worldDistM || 0;
    const onBridge = zone === 'bridge';
    const joint = Math.floor(dist / (onBridge ? BRIDGE_JOINT_M : ROAD_SEAM_M)) + (onBridge ? 1e6 : 0);
    let bump = 0;
    if (this.roadZone !== null && zone !== this.roadZone && (zone === 'tunnel' || this.roadZone === 'tunnel')) bump = 1.3;
    else if (this.roadJoint >= 0 && joint !== this.roadJoint) bump = onBridge ? 1 : 0.55;
    this.roadZone = zone;
    this.roadJoint = joint;

    if (this.rearAxleIn > 0) {
      this.rearAxleIn -= dt;
      if (this.rearAxleIn <= 0) this.axleBump(this.rearAxleBump * 0.8, 1);
    }
    if (bump && speedKmh > 30 && this.traffic.roadMode !== 'track') {
      this.axleBump(bump, -1);
      this.rearAxleBump = bump;
      this.rearAxleIn = WHEELBASE_M / speedMs;
    }

    // The road is never dead flat: long, shallow waves (70-150 m) that the body floats over on
    // soft springs. They come by faster at speed but stay well under 1.5 Hz, so the car wafts
    // instead of trembling. The spring is under-damped on purpose: it settles in a slow swing or two.
    const speedShare = Math.min(1, speedKmh / 220);
    const wave = Math.sin(dist / 23) + 0.6 * Math.sin(dist / 11 + 1.3) + 0.35 * Math.sin(dist / 37 + 4.1);
    const target = wave * 0.0012 * speedShare * (onBridge ? 1.3 : 1) * this.chassis.pitch;
    const step = Math.min(dt, 0.05);
    const heaveAccel = (target - this.bodyHeave) * HEAVE_SPRING - this.heaveVel * HEAVE_DAMPING;
    this.heaveVel += heaveAccel * step;
    this.bodyHeave += this.heaveVel * step;
    return this.bodyHeave;
  }

  // One axle over a joint: the nose (-1) or the tail (+1) is kicked up, the body rises on its
  // springs and settles again, with a thud
  axleBump(strength, end) {
    const speedShare = Math.min(1, this.speedKmh / 140);
    this.pitchVel += end * -0.07 * strength * this.chassis.pitch;
    this.heaveVel += 0.01 * strength * this.chassis.pitch;
    this.sound.playRoadThump(strength * (0.5 + 0.5 * speedShare));
  }

  // `car` is the traffic car that was hit (none for a barrier): the knock then depends on where
  // it landed and on how heavy the two cars are.
  handleCollision(message = '💥 KAZA YAPTIN!', headOn = false, car = null) {
    if (this.burning || this.graceSec > 0) return;
    this.damage = Math.min(MAX_HITS, this.damage + (headOn ? 2 : 1));
    this.graceSec = HIT_GRACE_SEC;
    this.repairKm = 0;
    this.combo = 1.0;
    this.comboTimer = 0;
    this.pitchVel -= 0.25;
    // Speed left after the knock: with a car, the two meet at their common speed (a truck
    // barely notices, a small car is carried along) and bounce a little apart again
    let speedKept = headOn ? 0.35 : 0.6;
    if (car) {
      const mass = this.chassis.mass;
      const otherMass = TRAFFIC_MASS[car.spec.type] ?? 1500;
      const blow = Math.min(1.8, (2 * otherMass) / (mass + otherMass)) * (headOn ? 1.5 : 1);
      // 0 for a square hit, 1 for one that only just clipped a corner
      const offset = this.playerX - car.x;
      const side = Math.sign(offset) || (Math.random() < 0.5 ? -1 : 1);
      const glancing = Math.min(1, Math.abs(offset) / (car.spec.width / 2 + 0.86));
      // Thrown aside, away from the other car, the nose and body with it, and the wheel is
      // knocked out of the driver's hands for a moment
      this.knockVel = side * (1.1 + 3.0 * glancing) * blow;
      this.headingAngle += side * 0.045 * glancing * blow;
      this.rollVel -= side * 0.4 * blow;
      this.steerLossSec = Math.min(0.7, (0.22 + 0.33 * glancing) * blow);
      const otherSpeed = car.dir * (car.preHitSpeedKmh ?? car.speedKmh);
      const common = (mass * this.speedKmh + otherMass * otherSpeed) / (mass + otherMass);
      const after = common + (this.speedKmh - common) * 0.25;
      speedKept = THREE.MathUtils.clamp(after / Math.max(1, this.speedKmh), 0.15, 0.9);
    } else {
      this.rollVel += (Math.random() - 0.5) * 0.6;
    }
    this.sound.playCrash();
    this.sound.muffleHit(headOn || this.damage >= MAX_HITS);
    this.triggerScreenFlash('crash-flash');

    if (this.damage >= MAX_HITS) {
      this.burning = { t: 0 };
      this.speedKmh *= speedKept * 0.8;
      this.shakeIntensity = 1.0;
      this.sound.playIgnition();
      this.carFire.ignite();
      document.getElementById('screen-vignette')?.classList.add('burning');
      this.showMakasNotification(`${message} 🔥 YANDIN!`, 0, 'danger');
      this.saveRecords();
    } else {
      this.speedKmh *= speedKept;
      this.shakeIntensity = 0.8;
      const left = MAX_HITS - this.damage;
      this.showMakasNotification(
        left === 1 ? `${message} ⚠️ SON CAN! BİR DAHA ÇARPARSAN YANARSIN` : `${message} • ${left} CAN KALDI`,
        0,
        'danger'
      );
    }
    this.updateDamageVisuals();
  }

  // Driving into the cones of road works or into a broken-down car: a crash, and the car is put
  // back beside the cone line (the knock carries it on towards the open lanes)
  updateClosureHit() {
    const hit = this.roadClosures.playerHit(this.playerX, this.speedKmh);
    if (!hit) return;
    this.playerX = hit.edgeX;
    this.lateralVel = 0;
    this.knockVel = -hit.side * 2.2;
    this.headingAngle *= 0.3;
    this.shakeIntensity = Math.max(this.shakeIntensity, 0.5);
    this.handleCollision(hit.message, hit.severe);
  }

  // Clean driving mends one hit per REPAIR_KM; the shield after a knock runs down
  updateRepair(dt, distanceKm) {
    this.graceSec = Math.max(0, this.graceSec - dt);
    if (this.burning || this.damage === 0) return;
    this.repairKm += distanceKm;
    if (this.repairKm >= REPAIR_KM) {
      this.repairKm = 0;
      this.damage -= 1;
      this.showMakasNotification('🔧 ARAÇ TOPARLANDI • +1 CAN', 0, 'gold');
      this.updateDamageVisuals();
    } else {
      this.updateDamageHUD();
    }
  }

  // Streaks at the screen edges above SPEED_LINES_FROM; the CSS animates them, this only sets
  // their strength (in 5 % steps, so the style is written a few times per speed change)
  updateSpeedLines() {
    const t = THREE.MathUtils.clamp((this.speedKmh - SPEED_LINES_FROM) / SPEED_LINES_SPAN, 0, 1);
    const level = Math.round(t * 20) / 20;
    if (level === this.speedLinesLevel) return;
    this.speedLinesLevel = level;
    const el = document.getElementById('speed-lines');
    if (!el) return;
    el.style.opacity = String(level * 0.6);
    el.classList.toggle('on', level > 0);
  }

  // How dark the corners of the screen are for the current speed: a CSS layer, written in 5 %
  // steps like the speed lines
  updateSpeedVignette() {
    const t = THREE.MathUtils.clamp((this.speedKmh - SPEED_VIGNETTE_FROM) / SPEED_VIGNETTE_SPAN, 0, 1);
    const level = this.reducedMotion ? 0 : Math.round(t * t * (3 - 2 * t) * 20) / 20;
    if (level === this.speedVignetteLevel) return;
    this.speedVignetteLevel = level;
    const el = document.getElementById('speed-vignette');
    if (el) el.style.opacity = String(level * SPEED_VIGNETTE_MAX);
  }

  // Where the sun throws the cars' shadows: short ones at midday, long and fainter ones at
  // sunset, none under clouds, at night or in the tunnel (the contact shadows stay everywhere).
  // The sun stands ahead and to the left, like the scene's directional light.
  updateShadowSun() {
    const tunnel = this.world.currentZone === 'tunnel';
    const blend = !tunnel && this.world.sunBlend;
    const key = tunnel ? 'tunnel' : blend ? `${blend.from}>${blend.to}:${Math.round(blend.t * 50)}` : this.world.weatherKey;
    if (key === this.shadowSunKey) return;
    this.shadowSunKey = key;
    // Day and dusk throw a shadow (x, z per metre of height, opacity); through a fade the sun
    // swings and the shadow fades between the two
    const SUNS = { day: [0.36, 0.73, 0.45], sunset: [0.8, 1.6, 0.34] };
    const sun = (k) => SUNS[k] ?? null;
    let s = tunnel ? null : sun(this.world.weatherKey);
    if (blend) {
      const a = sun(blend.from);
      const b = sun(blend.to);
      const pa = a ?? [b?.[0] ?? 0, b?.[1] ?? 0, 0];
      const pb = b ?? [a?.[0] ?? 0, a?.[1] ?? 0, 0];
      s = pa.map((v, i) => v + (pb[i] - v) * blend.t);
    }
    if (s && s[2] > 0.01) this.carShadows.setSun(s[0], s[1], s[2]);
    else this.carShadows.setSun();
  }

  // Chase view: the driven car's outside model (the one the drone replay shows) stands where the
  // cabin is, leaning and diving on its suspension, wheels turning, lamps lit.
  updateChaseView() {
    if (!this.chaseView || !this.replay) return;
    const r = this.replay;
    r.ensurePlayerExteriorModel(this.selectedCar, this.selectedPaintSlot || 0, this.currentParts);
    r.playerCarGroup.visible = true;
    r.playerCarGroup.position.set(this.playerX, 0, 0);
    r.playerCarGroup.rotation.set(this.bodyPitch, -this.headingAngle, this.bodyRoll);
    r.playerActiveModel?.rollWheels?.(this.world.worldDistM || 0);
    r.playerActiveModel?.setLights?.({
      night: this.world.weatherKey !== 'day',
      braking: Boolean(this.keys.brake) || this.touchBrake > 0,
      highBeam: Boolean(this.keys.highBeam),
    });
  }

  // Drift points on the track: while the car travels at an angle to where it points (the slide
  // itself is the driving model's, src/trackDynamics.js) points run up; they are paid when the
  // slide ends and lost in a spin, off the track or in a crash.
  updateDriftScore(dt, isOffTrack) {
    const angle = Math.abs(this.trackCar.slip);
    const speed = this.speedKmh;
    if (isOffTrack || this.burning || angle > DRIFT_SPIN_ANGLE) {
      if (angle > DRIFT_SPIN_ANGLE && this.driftPoints > 0) this.showMakasNotification('🌀 SPİN ATTIN', 0, 'danger');
      this.driftPoints = 0;
    } else if (angle > DRIFT_SCORE_ANGLE && speed > 50) {
      this.driftPoints += angle * speed * DRIFT_POINTS * dt;
      this.driftIdleSec = 0;
    } else if (this.driftPoints > 0) {
      this.driftIdleSec += dt;
      if (this.driftIdleSec > 0.6) {
        if (this.driftPoints >= DRIFT_MIN_PAYOUT) {
          this.score += this.driftPoints;
          this.noteScore();
          this.showMakasNotification('🔥 DRIFT', this.driftPoints, 'combo');
        }
        this.driftPoints = 0;
      }
    }
    this.updateDriftMeter();
  }

  // İstanbul Park: the car is driven by its tyres (src/trackDynamics.js). This feeds the model
  // the pedals and the wheel, moves the car across the track by what comes out, and handles
  // the kerbs, the gravel and the barrier.
  updateTrackDriving(dt, { rawSteer, throttle, brake, phys, accelKmhPerSec, isWet }) {
    const car = this.trackCar;
    const edgeX = this.world.roadHalfWidth - 0.85; // white line / outer edge of the kerb
    const wallX = this.world.roadHalfWidth + 3.0; // tyre barrier / Armco
    const isOffTrack = Math.abs(this.playerX) > edgeX;

    // The speed may have been changed since the last frame (a crash, the gravel, a new start)
    setTrackCarSpeed(car, this.speedKmh / 3.6);
    const resist = roadResistance(phys, this.speedKmh);
    const drive = throttle > 0 ? accelKmhPerSec + resist : brake > 0 ? 0 : -ENGINE_BRAKING;
    this.trackSetup.layout = this.chassis.layout;
    this.trackSetup.cgHeight = 0.3 + 0.08 * this.chassis.roll; // a tall car shifts more weight
    stepTrackCar(
      car,
      dt,
      {
        steer: this.steerInput,
        handsOff: Math.abs(rawSteer) < 0.02,
        handbrake: Boolean(this.keys.handbrake) && !this.burning,
        drive: drive / 3.6,
        brake: throttle > 0 ? 0 : (phys.brakeDecel * brake) / 3.6,
        drag: resist / 3.6,
        curvature: this.world.getCurrentCurvature(),
        grip:
          TRACK_GRIP_G *
          (0.75 + 0.25 * phys.handling) *
          (isWet ? TRACK_WET_GRIP : 1) *
          (isOffTrack ? TRACK_GRAVEL_GRIP : 1),
        maxSpeed: phys.maxSpeed / 3.6,
      },
      this.trackSetup
    );

    this.speedKmh = car.speed * 3.6;
    this.headingAngle = car.heading;
    this.yawRate = car.yawRate;
    this.lateralVel = car.dx / Math.max(0.001, dt);
    this.longitudinalG = THREE.MathUtils.lerp(
      this.longitudinalG,
      (car.longG * KMH_PER_SEC_PER_G) / 90,
      Math.min(1, dt * 12)
    );
    this.lateralG = THREE.MathUtils.lerp(this.lateralG, car.lateralG, Math.min(1, dt * 12));
    this.playerX += car.dx + this.knockVel * dt;
    this.knockVel *= Math.exp(-dt * 3.5);
    if (Math.abs(this.knockVel) < 0.02) this.knockVel = 0;

    // Sliding tyres howl, smoke at the rear and shudder through the car
    const fast = THREE.MathUtils.clamp((this.speedKmh - 25) / 30, 0, 1);
    const sliding = Math.max(car.rearSlide, car.frontSlide * 0.7);
    this.tyreHowl = sliding > 0.02 ? 0.3 + 0.8 * sliding : 0;
    const spinning = car.wheelspin > 0.9 && this.speedKmh < 70 ? 0.5 : 0;
    this.tyreSmokeAmount = Math.max(car.rearSlide * fast, spinning * Math.min(1, this.speedKmh / 8));
    this.shakeIntensity = Math.max(this.shakeIntensity, 0.05 * sliding * fast);
    this.updateDriftScore(dt, isOffTrack);

    // The chase camera stands behind the way the car is going, not the way it points, so a
    // slide shows as the car turned in front of it
    const behind = THREE.MathUtils.clamp(car.course * 0.8 + car.heading * 0.1, -1.1, 1.1);
    this.chaseYaw += (behind - this.chaseYaw) * Math.min(1, dt * 4);

    const absX = Math.abs(this.playerX);
    // 1. Kerb rumble zone
    if (absX > edgeX - 1 && this.speedKmh > 35) {
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.09 * Math.min(1, this.speedKmh / 150));
    }

    // 2. Run-off / gravel trap: no invisible rail at the white line
    if (absX > edgeX) {
      const offTrackDepth = absX - edgeX;
      // Heavy gravel drag scrubs speed rapidly so you cannot wall-ride around corners (a car
      // that is already slow can still drive out)
      if (this.speedKmh > 38) this.speedKmh = Math.max(38, this.speedKmh - (78 + offTrackDepth * 38) * dt);
      this.shakeIntensity = Math.max(
        this.shakeIntensity,
        (0.18 + Math.min(0.24, offTrackDepth * 0.08)) * Math.min(1, this.speedKmh / 90)
      );
      if (this.combo > 1) {
        this.combo = 1;
        this.comboProgress = 0;
      }
      const nowMs = performance.now();
      if (this.speedKmh > 30 && (!this._lastOffTrackWarnMs || nowMs - this._lastOffTrackWarnMs > 2200)) {
        this._lastOffTrackWarnMs = nowMs;
        this.showMakasNotification('⚠️ PİST DIŞI! ÇAKIL HAVUZU (HIZ KAYBI)', 0, 'normal');
        this.sound.playTireChirp(this.speedKmh);
      }
    }

    // 3. Outer tyre barrier / Armco
    if (absX > wallX) {
      this.playerX = Math.sign(this.playerX) * (wallX - 0.35);
      bounceTrackCar(car);
      this.headingAngle = car.heading;
      this.rollVel += -Math.sign(this.playerX) * 0.3;
      if (this.speedKmh > 25) this.handleCollision('💥 BARİYERE ÇARPTIN! VİRAJA ÇOK HIZLI GİRDİN');
    }
  }

  // The points of the drift in progress, on screen while it lasts
  updateDriftMeter() {
    const el = this.hudEls['drift-meter'] ?? (this.hudEls['drift-meter'] = document.getElementById('drift-meter'));
    if (!el) return;
    const shown = this.driftPoints >= 10;
    if (shown !== this.driftMeterShown) {
      this.driftMeterShown = shown;
      el.classList.toggle('on', shown);
    }
    if (shown) this.setHudText('drift-points', Math.floor(this.driftPoints).toLocaleString('tr-TR'));
  }

  resetDamage() {
    this.burning = null;
    this.damage = 0;
    this.graceSec = 0;
    this.repairKm = 0;
    this.carFire.reset();
    document.getElementById('screen-vignette')?.classList.remove('burning');
    this.updateDamageVisuals();
  }

  updateDamageVisuals() {
    this.updateDamageHUD();
  }

  // One pip per hit the car can take; the next one to come back fills up as the car is driven
  // clean. Written only when something visible changes.
  updateDamageHUD() {
    const fill = this.damage > 0 && !this.burning ? Math.floor((this.repairKm / REPAIR_KM) * 20) / 20 : 0;
    const key = `${this.damage}|${fill}`;
    if (key === this.damageHudKey) return;
    this.damageHudKey = key;
    const card = document.getElementById('hud-damage-card');
    if (!card) return;
    const left = MAX_HITS - this.damage;
    card.classList.toggle('critical', left === 1);
    card.classList.toggle('dead', left <= 0);
    card.querySelectorAll('.damage-pips i').forEach((pip, i) => {
      const lost = i >= left;
      pip.classList.toggle('lost', lost);
      pip.style.setProperty('--fill', lost && i === left ? String(fill) : '0');
    });
  }

  // The burning car rolls to a stop; alone, the result card follows
  updateBurning(dt) {
    this.carFire.update(dt);
    if (!this.burning) return;
    this.burning.t += dt;
    this.speedKmh = Math.max(0, this.speedKmh - 70 * dt);
    if (!this.multiplayer.connected && this.burning.t >= BURN_BEFORE_RESULT_SEC && this.uiState === 'drive') {
      this.openGameOver();
    }
  }

  openGameOver() {
    this.releaseInputs();
    this.saveRecords();
    this.profile.flush();
    this.runActive = false; // nothing to resume: the next drive starts from zero
    this.setUiState('gameover');
    this.setHudText('gameover-score', Math.floor(this.score).toLocaleString('tr-TR'));
    this.setHudText('gameover-time', this.formatPlayTime(this.playTimeSec));
    this.setHudText('gameover-km', (this.tripDistanceKm || 0).toFixed(2));
    const record = Math.floor(this.score) > 0 && Math.floor(this.score) >= Math.floor(this.bestScore);
    this.setHudText(
      'gameover-best',
      record ? '🏆 YENİ REKOR!' : `En iyi skor: ${Math.floor(this.bestScore).toLocaleString('tr-TR')}`
    );
    document.getElementById('gameover-overlay')?.classList.remove('hidden');
  }

  // Online: a new round, everyone side by side again on fresh road after a 3-2-1
  startRound(info) {
    this.resetDamage();
    this.hideRoundBanner();
    this.combo = 1.0;
    this.comboTimer = 0;
    this.speedKmh = 0;
    this.playerX = this.startX();
    this.lateralVel = 0;
    this.yawRate = 0;
    this.headingAngle = 0;
    resetTrackCar(this.trackCar);
    this.overtakeRun = null;
    if (info.round > 1 || info.standings.some((s) => s.points > 0)) {
      this.showMakasNotification(`🏁 TUR ${info.round} — İLK ${info.target} PUAN KAZANIR`, 0, 'gold');
    }
    // A player in the garage or the menu stays there (and falls behind); everyone else lines up
    if (this.uiState === 'drive' || this.uiState === 'countdown' || this.uiState === 'pause') {
      this.startCountdown();
    }
  }

  // Online: the round (or the whole match) is over; the host starts the next one by itself
  showRoundResult(info) {
    const banner = document.getElementById('round-banner');
    if (!banner) return;
    const matchOver = info.phase === 'over';
    const { winner, loser } = info;
    let title;
    let sub;
    if (!winner) {
      title = 'BERABERE — PUAN YOK';
      sub = 'İkiniz de yandınız 🔥';
    } else {
      const winnerName = winner.isMe ? 'SEN' : winner.name.toUpperCase();
      title = matchOver
        ? `🏆 ${winner.isMe ? 'MAÇI KAZANDIN!' : `${winnerName} MAÇI KAZANDI`}`
        : `${winner.isMe ? 'PUANI KAZANDIN' : `${winnerName} PUANI KAZANDI`} +1`;
      if (info.reason === 'crash') {
        sub = loser?.isMe ? 'Araban 3. darbede yandı 🔥' : `${loser?.name ?? 'Rakip'} 3. darbede yandı 🔥`;
      } else {
        sub = winner.isMe ? `Rakibine ${info.gapM} m fark attın 🚀` : `${winner.name} ${info.gapM} m fark attı 🚀`;
      }
    }
    this.setHudText('round-banner-kicker', matchOver ? `MAÇ BİTTİ • ${info.target} PUAN` : `TUR ${info.round} BİTTİ`);
    this.setHudText('round-banner-title', title);
    if (matchOver && winner?.isMe && this.newVersion) {
      this.runCoins += MATCH_WIN_COINS;
      this.profile.earn(MATCH_WIN_COINS);
      sub = `${sub} • +${MATCH_WIN_COINS} PARA`;
    }
    this.setHudText('round-banner-sub', matchOver ? `${sub} — yeni maç birazdan başlıyor` : sub);

    const list = document.getElementById('round-banner-scores');
    list.replaceChildren(
      ...info.standings.map((s) => {
        const row = document.createElement('span');
        row.className = 'round-score';
        row.style.setProperty('--tag', s.tag);
        const name = document.createElement('b');
        name.textContent = s.isMe ? 'SEN' : s.name.toUpperCase();
        const pts = document.createElement('i');
        pts.textContent = String(s.points);
        row.append(name, pts);
        return row;
      })
    );
    banner.classList.toggle('win', Boolean(winner?.isMe));
    banner.classList.toggle('over', matchOver);
    banner.classList.remove('hidden');
    if (winner?.isMe) this.sound.playMakasWhoosh(4, true, 200, true);
  }

  hideRoundBanner() {
    document.getElementById('round-banner')?.classList.add('hidden');
  }

  // Sideways on the motorway and the two-way road: the car changes lanes on rails that lean
  // (smooth yaw, tyre response, a gentle push to the outside of the bends), tuned for weaving
  // through traffic.
  updateRoadDriving(dt, { throttle, steerShare, phys, speedRatio, isCentering, isWet }) {
    const speedMs = this.speedKmh / 3.6;
    const wetFactor = isWet ? 0.85 : 1.0;

    // Target chassis heading angle (narrows at high speed for stability)
    // How hard the driven wheels are working: full throttle while the car is still limited by
    // traction rather than power (to ~130 km/h, further on a wet road), nothing at speed
    const powerLoad = throttle * THREE.MathUtils.clamp((isWet ? 1.6 : 1.3) - this.speedKmh / 130, 0, 1);
    const layout = this.chassis.layout;

    const maxHeadingAngle = 0.19 - speedRatio * 0.06; // ~11 deg at low speed, ~7.5 deg at 260 km/h
    // Rear-wheel drive under power pushes its tail out: the nose turns in further than asked
    const targetHeading = this.steerInput * maxHeadingAngle * (layout === 'rwd' ? 1 + 0.35 * powerLoad : 1);

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
    const maxDrift = 1.35;
    const centrifugalDriftVel = Math.max(-maxDrift, Math.min(maxDrift, -curveKappa * speedMs * 21.0));

    // The car's handling (classic: 1) scales how far it moves sideways for a given steer, and
    // part of it how quickly the tyres take that up
    let steerPower = (4.6 + speedRatio * 2.0) * phys.handling * steerShare;
    // Front-wheel drive under power runs wide: the wheels that steer are busy pulling
    if (layout === 'fwd') steerPower *= 1 - 0.22 * powerLoad;
    const tireResponse = 0.6 + 0.4 * phys.handling;

    const desiredLatVel =
      Math.sin(this.headingAngle) * speedMs * 0.62 +
      this.steerInput * steerPower * Math.min(1, this.speedKmh / 35) + // no sideways creep when standing
      centrifugalDriftVel;

    const prevLatVel = this.lateralVel;
    const tireCorneringStiffness = isCentering
      ? 12.5 * wetFactor
      : (9.2 - speedRatio * 1.4) * wetFactor * tireResponse * steerShare;
    this.lateralVel = THREE.MathUtils.lerp(
      this.lateralVel,
      desiredLatVel,
      Math.min(1, dt * tireCorneringStiffness)
    );
    if (isCentering && Math.abs(curveKappa) < 0.0003 && Math.abs(this.lateralVel) < 0.01) {
      this.lateralVel = 0;
    }
    // A knock from another car slides this one sideways for a moment on top of its own steering
    this.playerX += (this.lateralVel + this.knockVel) * dt;
    this.knockVel *= Math.exp(-dt * 3.5);
    if (Math.abs(this.knockVel) < 0.02) this.knockVel = 0;

    // Smooth lateral G-force (includes steady cornering load inside highway curves, 0 on straightaways)
    const latAccelG = (this.lateralVel - prevLatVel) / (Math.max(0.001, dt) * 24.0);
    const rawLatG = (this.lateralVel - centrifugalDriftVel * 0.75) / 9.8 + latAccelG * 0.25;
    this.lateralG = THREE.MathUtils.lerp(this.lateralG, rawLatG, Math.min(1, dt * 12));
    this.tyreHowl = 0;
    const sideAccel = Math.abs(this.lateralVel - prevLatVel) / Math.max(0.001, dt);
    this.tyreStrain += (sideAccel - this.tyreStrain) * Math.min(1, dt * 5);
    if (isCentering && Math.abs(curveKappa) < 0.0003 && Math.abs(this.lateralG) < 0.005) {
      this.lateralG = 0;
    }

    // Keep the car between the barriers
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
  }

  updatePhysics(dt) {
    // 1. Determine throttle & brake input (a burning car no longer answers the controls)
    const burning = Boolean(this.burning);
    const throttle = burning ? 0 : this.keys.gas ? 1.0 : this.touchThrottle;
    const brake = burning ? 1.0 : this.keys.brake ? 1.0 : this.touchBrake;

    // Determine steering input (-1 left, +1 right)
    let rawSteer = 0;
    if (this.keys.left) rawSteer -= 1;
    if (this.keys.right) rawSteer += 1;
    if (Math.abs(this.touchSteerValue) > 0.02) {
      rawSteer = this.touchSteerValue;
    }
    if (burning) rawSteer = 0;
    // Right after a knock the wheel is not fully in the driver's hands
    if (this.steerLossSec > 0) {
      this.steerLossSec -= dt;
      rawSteer *= 0.3;
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
    // On the track full input is the grip limit, so the wheel is wound on more slowly the
    // faster the car goes (a tap on a key is a nudge, not a swerve); it comes off, and goes
    // on against a slide, as quickly as ever
    if (this.traffic.roadMode === 'track' && !isCentering && !isCounterSteer) {
      steerRate = 7.5 - speedRatio * 3.5;
    }
    this.steerInput = THREE.MathUtils.lerp(this.steerInput, rawSteer, Math.min(1, dt * steerRate));

    // 2. Longitudinal Speed (KM/H)
    // Engine, drag, brakes and the limiter come from the car's physics (classic: 260 km/h for
    // every car, see src/progression/performance.js); the car can roll to a full stop
    // On a wet road the tyres brake and pull away less well (all-wheel drive loses the least);
    // the track's surface and tyres hold as much under braking as they do in its corners
    const isTrackRoad = this.traffic.roadMode === 'track';
    const isWet = this.world.weatherKey === 'rain';
    const brakeGrip = (isTrackRoad ? TRACK_GRIP_G / 1.15 : 1) * (isWet ? WET_BRAKE_GRIP : 1);
    const phys = Object.assign(this.roadPhysics, this.carPhysics);
    phys.brakeDecel *= brakeGrip;
    if (isWet) phys.tractionLimit *= WET_TRACTION[this.chassis.layout] ?? WET_TRACTION.awd;
    // In the middle of an upshift only part of the engine's drive reaches the wheels; when the
    // next gear takes up the drive the car squats on its springs
    const driveThrottle = this.shiftCutSec > 0 ? throttle * this.shiftCutKeep : throttle;
    if (this.shiftCutSec > 0) {
      this.shiftCutSec -= dt;
      if (this.shiftCutSec <= 0) {
        this.shiftCutSec = 0;
        this.pitchVel += SHIFT_SQUAT * this.shiftKick * this.chassis.pitch;
      }
    }
    let accelKmhPerSec = longitudinalAccel(phys, this.speedKmh, driveThrottle, brake);

    // ABS: flat on the pedal the wheels are held at the edge of locking, which pulses through
    // the car (more on a wet road, where they let go sooner)
    const absActive = brake >= ABS_PEDAL && this.speedKmh > 12 && !burning;
    if (absActive) {
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.075);
      this.shakeIntensity = Math.max(this.shakeIntensity, (isWet ? 0.11 : 0.07) * pulse * Math.min(1, this.speedKmh / 80));
    }
    // What the tyres spend on braking is not there for turning
    const steerShare = 1 - (1 - STEER_UNDER_BRAKING) * brake * brake;

    // On the track the tyres move the car (updateTrackDriving, below); on the roads:
    if (!isTrackRoad) {
      // Slight cornering scrub when carving aggressively at high G
      const corneringDrag = Math.abs(this.lateralG) * 4.2;
      accelKmhPerSec -= corneringDrag;

      const prevSpeed = this.speedKmh;
      this.speedKmh = Math.max(0, Math.min(phys.maxSpeed, this.speedKmh + accelKmhPerSec * dt));
      this.longitudinalG = THREE.MathUtils.lerp(
        this.longitudinalG,
        (this.speedKmh - prevSpeed) / (Math.max(0.001, dt) * 90),
        Math.min(1, dt * 12)
      );
    }

    // 3. Gearbox & RPM from the car's own ratios (car.js → drivetrain). Shift points follow the
    //    pedal: off the gas it changes up early and cruises quietly (the A8 turns ~1,700 rpm at
    //    120 km/h in 8th); holding the gas kicks down and revs each gear out to the redline.
    const drivetrain = this.drivetrain;
    const shiftClockSec = performance.now() / 1000;
    if (shiftClockSec - this.lastShiftAt > drivetrain.shiftSec) {
      const targetGear = nextGear(drivetrain, this.speedKmh, this.gear, throttle, brake);
      if (targetGear !== this.gear) {
        const upshift = targetGear > this.gear;
        this.sound.triggerGearShift(upshift);
        if (upshift && throttle > 0.3 && this.speedKmh > 15 && !burning) {
          const slowBox = THREE.MathUtils.clamp((drivetrain.shiftSec - 0.25) / 0.35, 0, 1);
          this.shiftCutKeep = SHIFT_KEEP_QUICK + (SHIFT_KEEP_SLOW - SHIFT_KEEP_QUICK) * slowBox;
          this.shiftCutSec = drivetrain.shiftSec * SHIFT_CUT_SHARE;
          this.shiftKick = throttle * (1 - this.shiftCutKeep);
          this.pitchVel -= SHIFT_NOD * this.shiftKick * this.chassis.pitch;
        }
        if (!upshift && this.speedKmh > 15) this.revBlip = 1;
        this.gear = targetGear;
        this.lastShiftAt = shiftClockSec;
      }
    }

    this.revBlip = Math.max(0, this.revBlip - dt * 5);
    const targetRpm = THREE.MathUtils.clamp(
      rpmInGear(drivetrain, this.speedKmh, this.gear) * (1 + REV_BLIP * this.revBlip),
      drivetrain.idleRpm,
      drivetrain.redline
    );
    this.rpm = THREE.MathUtils.lerp(this.rpm, targetRpm, Math.min(1, dt * 10));

    // 4. Sideways: İstanbul Park has its own driving model, the roads keep their lane-change one
    let speedMs = this.speedKmh / 3.6; // along the road
    if (isTrackRoad) {
      this.updateTrackDriving(dt, { rawSteer, throttle, brake, phys, accelKmhPerSec, isWet });
      speedMs = this.trackCar.progress;
    } else {
      this.updateRoadDriving(dt, { throttle, steerShare, phys, speedRatio, isCentering, isWet });
    }
    this.tyreSmoke.update(dt, {
      amount: isTrackRoad ? this.tyreSmokeAmount : 0,
      x: this.playerX,
      yaw: -this.headingAngle,
      speedMs,
      night: this.world.weatherKey !== 'day',
    });

    // 5. Critically Damped Suspension Dynamics (Smooth Weight Transfer, Zero Straight-Line Bounce)
    //    How far the body leans and dives is the car's own (car.js → chassis): a tall, softly
    //    sprung car leans further and takes longer over it, a sports car hardly moves.
    const { roll: rollGain, pitch: pitchGain } = this.chassis;
    const targetRoll = THREE.MathUtils.clamp(-this.lateralG * 0.028 * rollGain, -0.042 * rollGain, 0.042 * rollGain);
    const rollSpring = 110.0 / Math.pow(rollGain, 0.6);
    const rollDamping = 2.29 * Math.sqrt(rollSpring); // Critically damped so it never oscillates when straight
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

    const targetPitch = THREE.MathUtils.clamp(this.accelFeel * 0.011 * pitchGain, -0.022 * pitchGain, 0.018 * pitchGain);
    const pitchSpring = 95.0 / Math.pow(pitchGain, 0.6);
    const pitchDamping = 2.26 * Math.sqrt(pitchSpring); // Critically damped
    const pitchAccel = (targetPitch - this.bodyPitch) * pitchSpring - this.pitchVel * pitchDamping;
    this.pitchVel += pitchAccel * dt;
    this.bodyPitch += this.pitchVel * dt;

    // Move cockpit 3D group laterally (keep group rotation neutral so camera doesn't double-rotate)
    this.cockpit.group.position.x = this.playerX;
    this.cockpit.group.rotation.set(0, 0, 0);
    // On the track the cabin turns with the car, all the way round in a spin, and the driver
    // inside it looks towards where the car is sliding to
    const cabinTurns = isTrackRoad && !CAMERA_PRESETS[this.cameraPresetIndex].chase;
    if (cabinTurns) this.cockpit.group.rotation.y = -this.headingAngle;

    // 6. Driver Head Camera Movement (Rock-solid on straightaways, natural lean in turns)
    const preset = CAMERA_PRESETS[this.cameraPresetIndex];
    const shakeX = (Math.random() - 0.5) * 0.024 * this.shakeIntensity;
    const shakeY = (Math.random() - 0.5) * 0.024 * this.shakeIntensity;
    this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 2.8);

    const heave = this.updateRoadFeel(dt, speedMs);
    this.camera.position.x = preset.offset.x - this.lateralG * 0.022 + shakeX;
    this.camera.position.y = preset.offset.y + shakeY + heave;
    // Pushed back into the seat under acceleration, thrown forward under braking (+Z is backward)
    this.camera.position.z = preset.offset.z + this.accelFeel * 0.06;
    if (preset.chase) {
      // The camera follows the car's sideways moves a moment late, so a lane change shows as the
      // car sliding across the picture; it drops back a little as the car pulls away and at speed
      if (!Number.isFinite(this.chaseX)) this.chaseX = this.playerX;
      this.chaseX += (this.playerX - this.chaseX) * Math.min(1, dt * 3.2);
      // On the track it stands behind the way the car is going (chaseYaw), so in a slide the
      // car is seen at an angle
      const behind = isTrackRoad ? this.chaseYaw : 0;
      const back = preset.offset.z + this.accelFeel * 0.7 + Math.min(1, this.speedKmh / 260) * 0.9;
      this.camera.position.x = (this.chaseX - this.playerX) * 0.65 + shakeX * 4 - Math.sin(behind) * back;
      this.camera.position.y = preset.offset.y + shakeY * 4;
      this.camera.position.z = Math.cos(behind) * back;
    }

    // The driver looks into the bend coming up: the road's curvature a speed-dependent distance
    // ahead turns the head a few degrees (+ curvature = right bend, + yaw = look left)
    const lookAheadM = 20 + speedMs * 1.1;
    const bendAhead = this.world.evalRoadDeriv2((this.world.worldDistM || 0) + lookAheadM);
    const lookTarget = THREE.MathUtils.clamp(-bendAhead * HEAD_TURN_PER_CURVATURE, -HEAD_TURN_MAX, HEAD_TURN_MAX);
    this.headTurn = THREE.MathUtils.lerp(this.headTurn, lookTarget, Math.min(1, dt * 2.5));

    // Camera yaw & roll reflect smooth vehicle nose heading and suspension lean
    this.camera.rotation.y = cabinTurns
      ? this.headTurn - THREE.MathUtils.clamp(this.trackCar.slip * 0.45, -0.45, 0.45)
      : -this.headingAngle * 0.52 + this.headTurn;
    this.camera.rotation.z = this.bodyRoll * 0.75;
    // The nose rides the same waves a little, so the horizon drifts gently with the body
    this.camera.rotation.x = this.bodyPitch * 0.65 + heave * 0.45;
    if (preset.chase) {
      // Looks down at the car and keeps turning towards it while it is off to one side; into a
      // bend it swings with the road, less than the driver's head does
      this.camera.rotation.set(
        -preset.lookDown,
        isTrackRoad
          ? -this.chaseYaw + this.headTurn * 0.6 + (this.chaseX - this.playerX) * 0.045
          : -this.headingAngle * 0.25 + this.headTurn * 0.6 + this.camera.position.x * 0.07,
        this.bodyRoll * 0.2
      );
    }
    this.updateChaseView();

    // Speed-based FOV warp for intense sense of speed above 140 km/h, widening a little more
    // while the car pulls (and narrowing a little under braking)
    const speedFovBoost = Math.max(0, (this.speedKmh - 100) / 200) * 11;
    const accelFovKick = this.accelFeel * 5;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, preset.baseFov + speedFovBoost + accelFovKick, dt * 6);
    this.camera.updateProjectionMatrix();
    this.updateSpeedLines();
    this.updateSpeedVignette();

    // 7. Continuous High-Speed Scoring, Odometer & Combo Decay
    const frameDistanceKm = (speedMs * dt) / 1000;
    this.odometerKm += frameDistanceKm;
    this.tripDistanceKm += frameDistanceKm;
    this.playTimeSec += dt;

    if (this.speedKmh > 120) {
      this.score += (this.speedKmh - 100) * 0.35 * this.combo * dt;
      this.noteScore();
    }
    this.earnCoins(frameDistanceKm);
    this.updateRepair(dt, frameDistanceKm);
    this.coach.update(dt, { speedKmh: this.speedKmh, playerX: this.playerX });

    if (this.combo > 1.0) {
      this.comboTimer -= dt * 0.22; // ~4.5 seconds to chain the next Makas!
      if (this.comboTimer <= 0) {
        this.combo = 1.0;
        this.comboTimer = 0;
      }
    }

    this.updateBurning(dt);

    // 8. Update Multiplayer, World (synced with highway distance), Traffic, Cockpit & Sound
    this.multiplayer.update(
      dt,
      {
        playerX: this.playerX,
        speedKmh: isTrackRoad ? speedMs * 3.6 : this.speedKmh, // what carries the car along the road
        headingAngle: this.headingAngle,
        bodyRoll: this.bodyRoll,
        highBeam: this.keys.highBeam,
        braking: brake > 0,
        horn: this.keys.horn,
        score: this.score,
        combo: this.combo,
        burning: Boolean(this.burning),
      },
      this.world
    );

    // Reflections on a wet road point at the camera (last frame's place is close enough) and
    // end at our own car's nose
    this.camera.getWorldPosition(this._viewerPos);
    setStreakViewer(this._viewerPos.x, this._viewerPos.z, OWN_NOSE_Z);
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

    // Road works / a broken-down car every so often on the motorway (offline: online the
    // host's traffic is shared and the closure would have to be too)
    // Night turns slowly to day and back as the kilometres go by
    const cycled = this.dayCycle.update(this.tripDistanceKm, !this.multiplayer.connected);
    if (cycled) this.syncWeatherUI(cycled);

    this.roadClosures.update(dt, {
      worldDistM: this.world.worldDistM || 0,
      tripM: this.tripDistanceKm * 1000,
      enabled: this.traffic.roadMode === 'highway' && !this.multiplayer.connected,
      night: Boolean(WEATHER_PRESETS[this.world.weatherKey]?.streetlightsOn),
      nowSec: performance.now() / 1000,
    });
    const closureNote = this.roadClosures.takeWarning();
    if (closureNote) this.showMakasNotification(closureNote, 0, 'gold');

    this.traffic.update(
      dt,
      this.speedKmh,
      this.playerX,
      {
        onMakas: (data) => this.handleMakas(data),
        onCollision: (car) => {
          this.multiplayer.notifyLocalCarHit(car);
          if (car.dir < 0) this.handleCollision('💥 KAFA KAFAYA ÇARPIŞTIN!', true, car);
          else this.handleCollision(undefined, false, car);
        },
      },
      this.world,
      this.multiplayer.getTrafficContext()
    );
    this.updateClosureHit();
    this.updateOvertakeRun();
    this.updateTrackProgression();

    const radarCars = this.traffic.getRadarSnapshot(this.playerX);
    if (this.traffic.roadMode === 'track') {
      const tDist = this.world?.worldDistM || 0;
      const tInfo = this.world?.getTrackSectionAt?.(tDist);
      radarCars.isTrack = true;
      radarCars.trackProgress = (((tDist % TRACK_LAP_LENGTH) + TRACK_LAP_LENGTH) % TRACK_LAP_LENGTH) / TRACK_LAP_LENGTH;
      radarCars.turnCode = tInfo?.sec?.code || 'MAIN';
      radarCars.lap = this.currentLap || 1;
    } else {
      radarCars.isTrack = false;
    }

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
        this.sound.playMakasWhoosh(this.combo, true, this.speedKmh, true);
        this.showMakasNotification(
          `🤝 ${peer.name} İLE TANDEM MAKAS!`,
          tandemPts,
          'gold'
        );
        this.replay?.notifyHighlightEvent({
          kind: 'tandem',
          peerName: peer.name,
          speedKmh: this.speedKmh,
          combo: this.combo,
        });
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
        redline: this.drivetrain.redline,
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
        cabinNight: this.world.nightLevel ?? (WEATHER_PRESETS[this.world.weatherKey]?.streetlightsOn ? 1 : 0),
        // Rain lands on the windscreen everywhere but in the tunnel
        rainOnGlass: Boolean(WEATHER_PRESETS[this.world.weatherKey]?.rain) && this.world.currentZone !== 'tunnel',
        radio: {
          active: this.radio.isPlaying,
          title: this.radio.currentTrack?.title || '',
        },
      },
      radarCars
    );

    if (this.roadNeonGroup) {
      // Laid on the road for the mirrors; in the chase view the car's model carries its own
      this.roadNeonGroup.visible = !this.chaseView;
      this.roadNeonGroup.position.set(this.playerX, 0, 0);
      this.roadNeonGroup.rotation.set(this.world.getElevationPitchAtZ?.(0) ?? 0, -this.headingAngle, 0);
      const night = Boolean(WEATHER_PRESETS[this.world.weatherKey]?.streetlightsOn);
      this.roadNeon.forEach((glow) => glow.setNight(night));
    }

    // The sound takes a lateral g: it is silent below 0.3 and at full strength at 0.9. On the track
    // the tyre model's own g drives it; on the road only a sharp change of direction does.
    const onTrack = this.traffic.roadMode === 'track';
    const roadSqueal = THREE.MathUtils.clamp(
      (this.tyreStrain - (TYRE_STRAIN_FROM + TYRE_STRAIN_PER_KMH * this.speedKmh)) / TYRE_STRAIN_SPAN,
      0,
      1
    );
    const squealG = Math.max(
      onTrack ? Math.abs(this.lateralG) : roadSqueal > 0 ? 0.3 + 0.6 * roadSqueal : 0,
      this.tyreHowl, // tyres sliding on the track
      absActive && this.speedKmh > 50 ? 0.42 : 0 // tyres chattering on the ABS
    );
    this.sound.updateEngine(this.rpm, driveThrottle, this.speedKmh, this.paused, squealG, throttle);
    this.updateHUD();

    // Zero-overhead 10s ring buffer recording (writes flat typed arrays only, ~0.01ms)
    this.replay?.recordFrame(dt, {
      playerX: this.playerX,
      speedKmh: this.speedKmh,
      rpm: this.rpm,
      gear: this.gear,
      throttle,
      headingAngle: this.headingAngle,
      bodyRoll: this.bodyRoll,
      bodyPitch: this.bodyPitch,
      highBeam: this.keys.highBeam,
      braking: brake > 0,
      carId: this.selectedCar,
      paintSlot: this.selectedPaintSlot || 0,
      parts: this.currentParts,
      score: this.score,
      combo: this.combo,
    });
  }

  // One row per friend in the room (name in their slot colour, gap, speed/combo/score).
  // Rows are created/removed as players come and go; text is only rewritten when it changes.
  updateMultiplayerHud() {
    const list = document.getElementById('mp-peer-list');
    if (!list) return;
    this.mpRows ??= new Map();
    const players = this.multiplayer.connected ? this.multiplayer.getRemotePlayers() : [];
    const ids = new Set(players.map((p) => p.id));
    const match = this.multiplayer.connected ? this.multiplayer.match : null;
    this.setHudText(
      'mp-match-line',
      match
        ? `TUR ${match.round} • SEN ${this.multiplayer.pointsOf(this.multiplayer.localId)} PUAN • İLK ${MATCH_TARGET_POINTS} KAZANIR`
        : ''
    );

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
        const pts = document.createElement('span');
        pts.className = 'mp-peer-pts';
        const dist = document.createElement('span');
        dist.className = 'mp-peer-dist';
        const stats = document.createElement('span');
        stats.className = 'mp-peer-stats';
        el.append(name, pts, dist, stats);
        list.appendChild(el);
        row = { el, name, pts, dist, stats, text: {} };
        this.mpRows.set(peer.id, row);
      }

      const distM = Math.round(Math.abs(peer.relZ));
      const texts = {
        name: peer.name.toUpperCase(),
        pts: `★${this.multiplayer.pointsOf(peer.id)}`,
        dist: peer.burning ? '🔥 YANDI' : distM <= 4 ? '🔥 YAN YANA' : peer.relZ < 0 ? `▲ ${distM}m` : `▼ ${distM}m`,
        stats: `${Math.round(peer.speedKmh)} KM/S • ${peer.combo.toFixed(1)}x • ${Math.floor(peer.score).toLocaleString('tr-TR')} P`,
      };
      for (const key of ['name', 'pts', 'dist', 'stats']) {
        if (row.text[key] !== texts[key]) {
          row.text[key] = texts[key];
          row[key].textContent = texts[key];
        }
      }
    }
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
    if (this.chaseView) {
      // No dashboard in sight: speed and gear on the screen instead
      this.setHudText('chase-speed', String(Math.round(this.speedKmh)));
      this.setHudText('chase-gear', `D${this.gear}`);
    }
    this.setHudText('hud-best', Math.floor(this.bestScore).toLocaleString('tr-TR'));

    // Sürüş / Oyun Süresi Sayacı (MM:SS)
    const playTimeStr = this.formatPlayTime(this.playTimeSec);
    this.setHudText('hud-play-time', playTimeStr);
    const timeCard = this.hudEls['time-card'] ?? (this.hudEls['time-card'] = document.getElementById('time-card'));
    if (timeCard && this.hudCache.timeTooltip !== playTimeStr) {
      this.hudCache.timeTooltip = playTimeStr;
      timeCard.title = `Başlangıç: ${this.startTimeStr || '--:--'} • Sürüş Süresi: ${playTimeStr}`;
    }

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

    this.setHudText('mini-speed', String(Math.round(this.speedKmh)));
    this.setHudText('mini-gear', `D${this.gear}`);

    if (this.newVersion) this.setHudText('hud-coins', `+${this.runCoins.toLocaleString('tr-TR')}`);

    const distStr = (this.tripDistanceKm || 0).toFixed(2);
    this.setHudText('hud-distance', distStr);
    this.setHudText('mini-distance', distStr);

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
    this.carShadows.frame();
    this.drawBatcher.frame();
    this.updateShadowSun();

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
    } else if (this.replay?.active) {
      // While watching the 10-second Drone Replay in the pause menu:
      // keep multiplayer heartbeats alive in the background, and render from the aerial drone camera!
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
          burning: Boolean(this.burning),
        },
        null
      );
      if (this.roadNeonGroup) this.roadNeonGroup.visible = false; // the replay's car has its own
      this.replay.updateAndRender(dt);
      return;
    } else if (this.uiState !== 'menu') {
      // Pause card or countdown: the road stands still under it while the room stays connected
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
          burning: Boolean(this.burning),
        },
        this.world
      );
      this.sound.updateEngine(900, 0, 0, true);
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
          burning: Boolean(this.burning),
        },
        this.world
      );
      this.world.update(dt * 0.35, 22, this.playerX, false, this.multiplayer.localWorldDistM);
      const radarCars = this.traffic.getRadarSnapshot(this.playerX);
    if (this.traffic.roadMode === 'track') {
      const tDist = this.world?.worldDistM || 0;
      const tInfo = this.world?.getTrackSectionAt?.(tDist);
      radarCars.isTrack = true;
      radarCars.trackProgress = (((tDist % TRACK_LAP_LENGTH) + TRACK_LAP_LENGTH) % TRACK_LAP_LENGTH) / TRACK_LAP_LENGTH;
      radarCars.turnCode = tInfo?.sec?.code || 'MAIN';
      radarCars.lap = this.currentLap || 1;
    } else {
      radarCars.isTrack = false;
    }
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

    // While the garage or the pause card covers the road, redraw it once a second: enough to keep
    // its shaders, textures and mirrors warm (and right after a resize) without drawing two 3D
    // scenes every frame
    if (this.paused && now - this.lastCoveredRender < 1000) return;
    this.lastCoveredRender = now;

    // 1. Render real-time Rear-View & Wing Mirror texture
    this.cockpit.renderRearMirror(this.scene);

    // 2. Render main First-Person Cockpit Camera
    this.renderer.render(this.scene, this.camera);

    if (!this.paused) this.perfProbe.frame(frameSec, performance.now() - now, this.pixelRatio);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new OtobanMakasGame();
  if (import.meta.env.DEV) window.__game = game; // for the dev console and automated checks
});
