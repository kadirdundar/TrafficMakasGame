import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Objects on this layer are drawn by the main camera but skipped by the rear-view mirror
export const MIRROR_SKIP_LAYER = 1;

export const WEATHER_PRESETS = {
  night: {
    key: 'night',
    label: 'Gece',
    icon: '🌙',
    skyColor: 0x0d1528,
    fogColor: 0x131e36,
    fogDensity: 0.0022,
    ambientIntensity: 1.25,
    ambientColor: 0x9bb4e8,
    hemiGroundColor: 0x2a364f,
    dirIntensity: 1.1,
    dirColor: 0xa5c4ff,
    roadRoughness: 0.42,
    roadMetalness: 0.2,
    streetlightsOn: true,
    rain: false,
  },
  rain: {
    key: 'rain',
    label: 'Yağmur',
    icon: '🌧️',
    skyColor: 0x0b1220,
    fogColor: 0x121c30,
    fogDensity: 0.0032,
    ambientIntensity: 1.05,
    ambientColor: 0x8aa4d6,
    hemiGroundColor: 0x222d42,
    dirIntensity: 0.9,
    dirColor: 0x8ab0ff,
    roadRoughness: 0.18, // Wet shiny asphalt
    roadMetalness: 0.48,
    streetlightsOn: true,
    rain: true,
  },
  sunset: {
    key: 'sunset',
    label: 'Gün Batımı',
    icon: '🌇',
    skyColor: 0x2c1630,
    fogColor: 0x662c40,
    fogDensity: 0.0025,
    ambientIntensity: 1.25,
    ambientColor: 0xffa07a,
    hemiGroundColor: 0x3d222e,
    dirIntensity: 1.65,
    dirColor: 0xff7744,
    roadRoughness: 0.36,
    roadMetalness: 0.25,
    streetlightsOn: true,
    rain: false,
  },
  day: {
    key: 'day',
    label: 'Gündüz',
    icon: '☀️',
    skyColor: 0x4a89dc,
    fogColor: 0x8bb8f0,
    fogDensity: 0.0018,
    ambientIntensity: 1.5,
    ambientColor: 0xffffff,
    hemiGroundColor: 0x475569,
    dirIntensity: 1.85,
    dirColor: 0xfff8e7,
    roadRoughness: 0.65,
    roadMetalness: 0.1,
    streetlightsOn: false,
    rain: false,
  },
};

for (const p of Object.values(WEATHER_PRESETS)) {
  p.ambientColorObj = new THREE.Color(p.ambientColor);
  p.dirColorObj = new THREE.Color(p.dirColor);
}

// 4 Highway Lanes: X centers at -5.4, -1.8, +1.8, +5.4 (each lane is 3.6m wide; total carriageway = 14.4m + shoulders = 17.6m)
export const LANE_CENTERS = [-5.4, -1.8, 1.8, 5.4];
export const ROAD_HALF_WIDTH = 8.4;

// Road layouts. 'highway': the 4-lane motorway. 'twoway': a 1+1 two-way road (devlet yolu).
// 'track': İstanbul Park racing circuit with technical corners, hairpins, Esses and the legendary Turn 8!
export const ROAD_MODES = ['highway', 'twoway', 'track'];
export const ROAD_HALF_WIDTHS = { highway: ROAD_HALF_WIDTH, twoway: 4.6, track: ROAD_HALF_WIDTH };

export const ZONE_CYCLE_LENGTH = 15000;

// İstanbul Park Grand Prix Circuit: 4000m Lap Definition with C2-continuous turns
export const TRACK_LAP_LENGTH = 4000.0;
export const TRACK_SECTIONS = [
  { name: 'Ana Düzlük (Start/Finish)', code: 'MAIN', start: 0, len: 600, cStart: 0, deltaC: 0 },
  { name: '1. Viraj (Sola İniş)', code: 'T1', start: 600, len: 450, deltaC: -40, cStart: 0 },
  { name: '2. Viraj (Sağa Çıkış)', code: 'T2', start: 1050, len: 400, deltaC: 30, cStart: -40 },
  { name: 'Ara Düzlük', code: 'STR1', start: 1450, len: 150, cStart: -10, deltaC: 0 },
  { name: '3. Viraj (Hızlı Sağ)', code: 'T3', start: 1600, len: 250, deltaC: 25, cStart: -10 },
  { name: '4. Viraj (S-Viraj Solu)', code: 'T4', start: 1850, len: 250, deltaC: -30, cStart: 15 },
  { name: '8. Viraj Yaklaşımı', code: 'STR2', start: 2100, len: 200, cStart: -15, deltaC: 0 },
  { name: 'Efsanevi 8. Viraj (4 Apeks)', code: 'T8', start: 2300, len: 750, deltaC: -40, cStart: -15 },
  { name: 'Arka Düzlük (DRS & 260 KM/S)', code: 'BACK', start: 3050, len: 350, deltaC: 0, cStart: -55 },
  { name: '12. Viraj (Şikan Frenajı)', code: 'T12', start: 3400, len: 200, deltaC: 35, cStart: -55 },
  { name: '13. Viraj (Şikan Çıkışı)', code: 'T13', start: 3600, len: 150, deltaC: -20, cStart: -20 },
  { name: '14. Son Viraj (Start-Finish Çıkışı)', code: 'T14', start: 3750, len: 250, deltaC: 40, cStart: -40 },
];

export function getTrackSectionAt(s) {
  const u = ((s % TRACK_LAP_LENGTH) + TRACK_LAP_LENGTH) % TRACK_LAP_LENGTH;
  for (let i = 0; i < TRACK_SECTIONS.length; i++) {
    const sec = TRACK_SECTIONS[i];
    if (u >= sec.start && u < sec.start + sec.len) {
      return { sec, u, t: u - sec.start };
    }
  }
  const last = TRACK_SECTIONS[TRACK_SECTIONS.length - 1];
  return { sec: last, u, t: u - last.start };
}

export function getZoneAt(trackDistM, roadMode = 'highway') {
  if (roadMode === 'track') return 'track';
  const s = ((trackDistM % ZONE_CYCLE_LENGTH) + ZONE_CYCLE_LENGTH) % ZONE_CYCLE_LENGTH;
  if (s >= 5500 && s < 6700) return 'tunnel';
  if (s >= 12500 && s < 14000) return 'bridge';
  return 'highway';
}

function createTunnelSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Highway blue background with cyan border
  ctx.fillStyle = '#0a2540';
  ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 1014, 246);

  // Ministry header
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('T.C. ULAŞTIRMA VE ALTYAPI BAKANLIĞI', 512, 38);

  // Main text: AVRASYA TÜNELİ
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 76px system-ui, sans-serif';
  ctx.fillText('AVRASYA TÜNELİ', 512, 118);

  // Subtext with speed limit badge and headlights warning
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('⚡ HIZ LİMİTİ 70 KM/S  •  FARLARINIZI YAKINIZ 💡', 512, 168);

  // 4 Green Lane Status Arrows (⬇ ⬇ ⬇ ⬇)
  ctx.fillStyle = '#22c55e';
  ctx.font = '900 44px system-ui, sans-serif';
  for (let i = 0; i < 4; i++) {
    const x = 160 + i * 235;
    ctx.fillText('⬇', x, 230);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBridgeSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Turkish Highway green background
  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 1014, 246);

  // Route number badge: O-1
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(40, 22, 90, 48);
  ctx.fillStyle = '#065f46';
  ctx.font = '900 32px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('O-1', 85, 57);

  // Main Bridge Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('15 TEMMUZ ŞEHİTLER KÖPRÜSÜ', 512, 120);

  // Subtitle
  ctx.fillStyle = '#a7f3d0';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText('ASYA ➔ AVRUPA  •  BOĞAZİÇİ  •  HOŞ GELDİNİZ', 512, 180);

  // Lane arrows
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 38px system-ui, sans-serif';
  for (let i = 0; i < 4; i++) {
    const x = 160 + i * 235;
    ctx.fillText('⬆', x, 232);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTunnelTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Off-white ceramic base
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 512, 512);

  // Lower darker base skirting band
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 410, 512, 102);

  // Blue & Orange decorative safety bands (Eurasia Tunnel styling)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 310, 512, 34);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 344, 512, 14);

  // Subtle ceramic tile grid
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 410);
    ctx.stroke();
  }
  for (let y = 0; y <= 410; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTrackFinishLineTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Checkered pattern: 32 columns x 4 rows
  const cols = 32;
  const rows = 4;
  const cw = 1024 / cols;
  const ch = 128 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#ffffff' : '#090d16';
      ctx.fillRect(c * cw, r * ch, cw, ch);
    }
  }

  // Thin red safety edges
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(0, 0, 1024, 6);
  ctx.fillRect(0, 122, 1024, 6);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTrackStartGantryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark carbon composite frame
  ctx.fillStyle = '#080c14';
  ctx.fillRect(0, 0, 1024, 256);

  // Red racing border
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 1014, 246);

  // Checkered endcaps
  for (let y = 10; y < 246; y += 30) {
    for (let x = 10; x < 96; x += 28) {
      ctx.fillStyle = (((y / 30) | 0) + ((x / 28) | 0)) % 2 === 0 ? '#ffffff' : '#1e293b';
      ctx.fillRect(x, y, 28, 30);
    }
    for (let x = 928; x < 1014; x += 28) {
      ctx.fillStyle = (((y / 30) | 0) + ((x / 28) | 0)) % 2 === 0 ? '#ffffff' : '#1e293b';
      ctx.fillRect(x, y, 28, 30);
    }
  }

  // Top header
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TOSFED  •  İSTANBUL PARK GRAND PRIX CIRCUIT', 512, 42);

  // Main text: START / FINISH
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px system-ui, sans-serif';
  ctx.fillText('🏁 START / FINISH 🏁', 512, 118);

  // 5 FIA Formula 1 Red Starting Lights
  const startX = 332;
  for (let i = 0; i < 5; i++) {
    const lx = startX + i * 90;
    // Outer black bezel
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(lx, 185, 26, 0, Math.PI * 2);
    ctx.fill();
    // Glowing red lamp
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(lx, 185, 20, 0, Math.PI * 2);
    ctx.fill();
    // Core glow highlight
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(lx - 5, 180, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTrackBrakeBoardTexture(meters) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 242, 242);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 110px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(meters), 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const _reusableProfile = { c: 0, d1: 0, d2: 0 };

export class HighwayWorld {
  constructor(scene) {
    this.scene = scene;
    this.weatherKey = 'night';
    this.roadMode = 'highway';
    this.roadHalfWidth = ROAD_HALF_WIDTH;
    this.currentZone = 'highway';

    this.tunnelAmbientColor = new THREE.Color(0xffcb99);
    this.tunnelHemiColor = new THREE.Color(0xffb066);

    this.roadTexture = null;
    this.roadMat = null;
    this.groundMesh = null;
    this.scrollOffset = 0;
    this.worldDistM = 0;
    this.curvableGeometries = [];
    this._zOffsetCache = new Map();
    this._prevMaxCurveOffset = 0;

    this.sceneryItems = [];
    this.lampFixtures = [];
    this.rainSystem = null;

    // Player Headlights & High-beam (Selektör) SpotLights
    this.headlightGroup = new THREE.Group();
    this.scene.add(this.headlightGroup);

    this.buildLights();
    this.buildRoad();
    this.buildRoadsideScenery();
    this.buildRainParticles();
    this.applyWeather('night');
  }

  // Istanbul Park Racing Circuit Curve Evaluation
  evalTrackProfile(s) {
    const { sec, t } = getTrackSectionAt(s);
    if (sec.deltaC === 0) {
      _reusableProfile.c = sec.cStart;
      _reusableProfile.d1 = 0.0;
      _reusableProfile.d2 = 0.0;
      return _reusableProfile;
    }
    const omega = (Math.PI * 2.0) / sec.len;
    const phi = omega * t;
    _reusableProfile.c = sec.cStart + sec.deltaC * (t / sec.len - Math.sin(phi) / (Math.PI * 2.0));
    _reusableProfile.d1 = (sec.deltaC / sec.len) * (1.0 - Math.cos(phi));
    _reusableProfile.d2 = ((sec.deltaC * omega) / sec.len) * Math.sin(phi);
    return _reusableProfile;
  }

  evalTrackCenterX(s) {
    const { sec, t } = getTrackSectionAt(s);
    if (sec.deltaC === 0) return sec.cStart;
    const omega = (Math.PI * 2.0) / sec.len;
    return sec.cStart + sec.deltaC * (t / sec.len - Math.sin(omega * t) / (Math.PI * 2.0));
  }

  evalTrackDeriv1(s) {
    const { sec, t } = getTrackSectionAt(s);
    if (sec.deltaC === 0) return 0.0;
    const omega = (Math.PI * 2.0) / sec.len;
    return (sec.deltaC / sec.len) * (1.0 - Math.cos(omega * t));
  }

  evalTrackDeriv2(s) {
    const { sec, t } = getTrackSectionAt(s);
    if (sec.deltaC === 0) return 0.0;
    const omega = (Math.PI * 2.0) / sec.len;
    return ((sec.deltaC * omega) / sec.len) * Math.sin(omega * t);
  }

  getTrackSectionAt(s) {
    return getTrackSectionAt(s);
  }

  // Sparse Highway Curve Profile:
  // Every 1500m segment consists of:
  // - 1050m of 100% DEAD-STRAIGHT highway (zero curvature, zero slope change)
  // - 450m of a smooth C2-continuous sweeping turn (alternating right on even segments, left on odd segments)
  evalRoadProfile(s) {
    if (this.roadMode === 'track') return this.evalTrackProfile(s);
    const segLen = 1500.0;
    const straightLen = 1050.0;
    const curveLen = 450.0; // segLen - straightLen
    const amp = 85.0; // lateral displacement across the 450m curve

    const segIdx = Math.floor(s / segLen);
    const u = s - segIdx * segLen; // 0 .. 1500
    const isEven = (segIdx & 1) === 0;
    const baseC = isEven ? 0.0 : amp;
    const dir = isEven ? 1.0 : -1.0;

    // On the 1050m straightaway: road is 100% straight!
    if (u <= straightLen) {
      _reusableProfile.c = baseC;
      _reusableProfile.d1 = 0.0;
      _reusableProfile.d2 = 0.0;
      return _reusableProfile;
    }

    // Inside the 450m smooth curve zone:
    const t = u - straightLen; // 0 .. curveLen
    const omega = (Math.PI * 2.0) / curveLen;
    const wt = omega * t;

    _reusableProfile.c = baseC + dir * amp * (t / curveLen - Math.sin(wt) / (Math.PI * 2.0));
    _reusableProfile.d1 = dir * (amp / curveLen) * (1.0 - Math.cos(wt));
    _reusableProfile.d2 = dir * ((amp * omega) / curveLen) * Math.sin(wt);
    return _reusableProfile;
  }

  evalRoadCenterX(s) {
    if (this.roadMode === 'track') return this.evalTrackCenterX(s);
    const segLen = 1500.0;
    const straightLen = 1050.0;
    const curveLen = 450.0;
    const amp = 85.0;

    const segIdx = Math.floor(s / segLen);
    const u = s - segIdx * segLen;
    const isEven = (segIdx & 1) === 0;
    const baseC = isEven ? 0.0 : amp;

    if (u <= straightLen) return baseC;

    const dir = isEven ? 1.0 : -1.0;
    const t = u - straightLen;
    const omega = (Math.PI * 2.0) / curveLen;
    const wt = omega * t;
    return baseC + dir * amp * (t / curveLen - Math.sin(wt) / (Math.PI * 2.0));
  }

  evalRoadDeriv1(s) {
    if (this.roadMode === 'track') return this.evalTrackDeriv1(s);
    const segLen = 1500.0;
    const straightLen = 1050.0;
    const curveLen = 450.0;
    const amp = 85.0;

    const segIdx = Math.floor(s / segLen);
    const u = s - segIdx * segLen;

    if (u <= straightLen) return 0.0;

    const dir = (segIdx & 1) === 0 ? 1.0 : -1.0;
    const t = u - straightLen;
    const omega = (Math.PI * 2.0) / curveLen;
    const wt = omega * t;
    return dir * (amp / curveLen) * (1.0 - Math.cos(wt));
  }

  evalRoadDeriv2(s) {
    if (this.roadMode === 'track') return this.evalTrackDeriv2(s);
    const segLen = 1500.0;
    const straightLen = 1050.0;
    const curveLen = 450.0;
    const amp = 85.0;

    const segIdx = Math.floor(s / segLen);
    const u = s - segIdx * segLen;

    if (u <= straightLen) return 0.0;

    const dir = (segIdx & 1) === 0 ? 1.0 : -1.0;
    const t = u - straightLen;
    const omega = (Math.PI * 2.0) / curveLen;
    const wt = omega * t;
    return dir * ((amp * omega) / curveLen) * Math.sin(wt);
  }

  // Lateral X offset of the highway centerline at scene coordinate z (z=0 is player, z<0 is ahead)
  getCurveOffsetAtZ(z) {
    const s0 = this.worldDistM;
    const c0 = this.evalRoadCenterX(s0);
    const d0 = this.evalRoadDeriv1(s0);
    return this.evalRoadCenterX(s0 - z) - c0 + z * d0;
  }

  // Derivative d(DeltaX)/dz at scene coordinate z
  getCurveSlopeAtZ(z) {
    const s0 = this.worldDistM;
    const d0 = this.evalRoadDeriv1(s0);
    return -this.evalRoadDeriv1(s0 - z) + d0;
  }

  // Yaw rotation (rotation.y in radians) of the highway at scene coordinate z
  getCurveYawAtZ(z) {
    return Math.atan(this.getCurveSlopeAtZ(z));
  }

  // Instantaneous highway curvature kappa (1/m) right at the player's position (z = 0)
  // Positive kappa = road curves to the right (+X ahead); Negative kappa = road curves to the left (-X ahead)
  getCurrentCurvature() {
    return this.evalRoadDeriv2(this.worldDistM);
  }

  registerCurvableGeometry(geo) {
    const pos = geo.attributes.position;
    const count = pos.count;
    const baseX = new Float32Array(count);
    const baseZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      baseX[i] = pos.getX(i);
      baseZ[i] = pos.getZ(i);
    }
    const item = { geo, baseX, baseZ, originalX: baseX.slice() };
    this.curvableGeometries.push(item);
    return item;
  }

  buildLights() {
    this.ambientLight = new THREE.AmbientLight(0x9bb4e8, 1.25);
    this.scene.add(this.ambientLight);

    // HemisphereLight ensures road surface, barriers & cars are well-lit from above and below
    this.hemiLight = new THREE.HemisphereLight(0xa5c4ff, 0x2a364f, 0.95);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xa5c4ff, 1.1);
    this.dirLight.position.set(-20, 55, -40);
    this.scene.add(this.dirLight);

    // Generate a realistic studio/highway reflection environment map for metallic car paint, chrome & piano black
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ectx = envCanvas.getContext('2d');
    const grad = ectx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, '#1e3a5f');
    grad.addColorStop(0.45, '#6488b8');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(0.55, '#1e293b');
    grad.addColorStop(1.0, '#0f172a');
    ectx.fillStyle = grad;
    ectx.fillRect(0, 0, 512, 256);

    // Add bright highway light streaks for specular highlights on car bodies and chrome
    ectx.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) {
      ectx.fillRect(30 + i * 60, 85, 28, 10);
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    this.scene.environment = envTex;
    this.scene.environmentIntensity = 0.85;

    // Player Low-Beam Headlight (Wider, brighter & longer throw for night highway visibility)
    this.lowBeamLight = new THREE.SpotLight(0xf4f9ff, 14.0, 165, Math.PI / 2.8, 0.35, 0.85);
    this.lowBeamLight.position.set(0, 0.9, -1.7);
    this.lowBeamTarget = new THREE.Object3D();
    this.lowBeamTarget.position.set(0, 0.0, -65);
    this.headlightGroup.add(this.lowBeamLight);
    this.headlightGroup.add(this.lowBeamTarget);
    this.lowBeamLight.target = this.lowBeamTarget;

    // Player High-Beam (Selektör) SpotLight
    this.highBeamLight = new THREE.SpotLight(0xd8ecff, 0, 230, Math.PI / 2.5, 0.22, 0.7);
    this.highBeamLight.position.set(0, 0.95, -1.7);
    this.highBeamTarget = new THREE.Object3D();
    this.highBeamTarget.position.set(0, 0.5, -140);
    this.headlightGroup.add(this.highBeamLight);
    this.headlightGroup.add(this.highBeamTarget);
    this.highBeamLight.target = this.highBeamTarget;
  }

  drawTrackMarkings(ctx) {
    // 1. Dark competition racing circuit asphalt
    ctx.fillStyle = '#181b24';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Asphalt texture & fine rubber noise
    for (let i = 0; i < 18000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const v = 20 + Math.floor(Math.random() * 18);
      ctx.fillStyle = `rgb(${v},${v + 2},${v + 5})`;
      ctx.fillRect(x, y, 2, 3);
    }

    // 3. Dark rubber racing groove tracks
    const gradL = ctx.createLinearGradient(280, 0, 430, 0);
    gradL.addColorStop(0, 'rgba(10, 12, 16, 0)');
    gradL.addColorStop(0.5, 'rgba(8, 10, 14, 0.45)');
    gradL.addColorStop(1, 'rgba(10, 12, 16, 0)');
    ctx.fillStyle = gradL;
    ctx.fillRect(280, 0, 150, 1024);

    const gradR = ctx.createLinearGradient(590, 0, 740, 0);
    gradR.addColorStop(0, 'rgba(10, 12, 16, 0)');
    gradR.addColorStop(0.5, 'rgba(8, 10, 14, 0.45)');
    gradR.addColorStop(1, 'rgba(10, 12, 16, 0)');
    ctx.fillStyle = gradR;
    ctx.fillRect(590, 0, 150, 1024);

    // 4. Red & White FIA Racing Apex Curbs (Kerbler) at left & right edges
    const curbW = 46;
    for (let y = 0; y < 1024; y += 64) {
      const isRed = (y / 64) % 2 === 0;

      // Left Curb
      ctx.fillStyle = isRed ? '#dc2626' : '#f8fafc';
      ctx.fillRect(0, y, curbW, 64);
      // Dark grooved shadow between curb stones
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, y + 61, curbW, 3);

      // Right Curb
      ctx.fillStyle = isRed ? '#dc2626' : '#f8fafc';
      ctx.fillRect(1024 - curbW, y, curbW, 64);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(1024 - curbW, y + 61, curbW, 3);
    }

    // 5. Solid White Track Edge Boundary Lines (inside curbs)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(curbW, 0, 12, 1024); // Left track limit
    ctx.fillRect(1024 - curbW - 12, 0, 12, 1024); // Right track limit

    // 6. Subtle White Dashed Lane Dividers (Guides for multi-car racing)
    ctx.fillStyle = 'rgba(241, 245, 249, 0.65)';
    const roadInnerStart = curbW + 12;
    const roadInnerWidth = 1024 - 2 * (curbW + 12);
    for (let lane = 1; lane <= 3; lane++) {
      const lx = roadInnerStart + (roadInnerWidth / 4) * lane - 5;
      ctx.fillRect(lx, 70, 10, 320);
      ctx.fillRect(lx, 580, 10, 320);
    }
  }

  // Asphalt, edge lines and lane markings for the current layout, drawn across the whole road plane
  // (ROAD_HALF_WIDTH * 2 + 1.6 m wide for either layout: the plane is scaled, see setRoadLayout)
  drawRoadMarkings(ctx, mode) {
    if (mode === 'track') {
      this.drawTrackMarkings(ctx);
      return;
    }

    // Clearer, brighter highway asphalt tone so road is clearly visible at night
    ctx.fillStyle = '#2d3442';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle asphalt grain noise & lighter tire wear tracks
    for (let i = 0; i < 16000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const v = 38 + Math.floor(Math.random() * 22);
      ctx.fillStyle = `rgb(${v},${v + 3},${v + 8})`;
      ctx.fillRect(x, y, 2, 3);
    }

    if (mode === 'twoway') {
      // Plane is 2 * 4.6 + 1.6 = 10.8 m wide: px per metre
      const half = ROAD_HALF_WIDTHS.twoway + 0.8;
      const px = (x) => ((x + half) / (half * 2)) * 1024;
      const pw = 1024 / (half * 2);
      // Gravel shoulder strips beyond the asphalt edge
      ctx.fillStyle = '#3b3a36';
      ctx.fillRect(0, 0, px(-ROAD_HALF_WIDTHS.twoway), 1024);
      ctx.fillRect(px(ROAD_HALF_WIDTHS.twoway), 0, 1024, 1024);
      // Solid white edge lines just outside both lanes
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(px(-3.75), 0, 0.15 * pw, 1024);
      ctx.fillRect(px(3.6), 0, 0.15 * pw, 1024);
      // Dashed white centre line: overtaking allowed
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px(-0.07), 60, 0.14 * pw, 330);
      ctx.fillRect(px(-0.07), 572, 0.14 * pw, 330);
      return;
    }

    // Left & Right Emergency Shoulder Solid Yellow/White Lines
    ctx.fillStyle = '#eab308';
    ctx.fillRect(58, 0, 14, 1024); // Left fast-lane edge yellow line
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(1024 - 72, 0, 14, 1024); // Right shoulder solid white line

    // Red/White Curb Rumble Strips at extreme edges
    for (let y = 0; y < 1024; y += 64) {
      ctx.fillStyle = (y / 64) % 2 === 0 ? '#dc2626' : '#f1f5f9';
      ctx.fillRect(12, y, 26, 64);
      ctx.fillRect(1024 - 38, y, 26, 64);
    }

    // 3 Dashed White Lane Dividers (separating the 4 highway lanes)
    ctx.fillStyle = '#f8fafc';
    const roadInnerStart = 72;
    const roadInnerWidth = 1024 - 144;
    for (let lane = 1; lane <= 3; lane++) {
      const lx = roadInnerStart + (roadInnerWidth / 4) * lane - 6;
      // Draw 2 dashes per texture tile
      ctx.fillRect(lx, 80, 12, 310);
      ctx.fillRect(lx, 590, 12, 310);
    }
  }

  createRoadCanvasTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    this.drawRoadMarkings(canvas.getContext('2d'), this.roadMode);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 22);
    texture.anisotropy = 8;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  buildRoad() {
    this.roadTexture = this.createRoadCanvasTexture();

    const roadLength = 440;
    const zSegments = 110;

    // Subdivided Highway Surface so it bends smoothly along 3D curves
    const roadGeo = new THREE.PlaneGeometry(ROAD_HALF_WIDTH * 2 + 1.6, roadLength, 1, zSegments);
    roadGeo.rotateX(-Math.PI / 2);
    roadGeo.translate(0, 0, -140);
    this.roadCurvable = this.registerCurvableGeometry(roadGeo);

    this.roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTexture,
      roughness: 0.38,
      metalness: 0.25,
    });

    const roadMesh = new THREE.Mesh(roadGeo, this.roadMat);
    this.scene.add(roadMesh);

    // Outer Ground Plane (Dark terrain alongside highway)
    const groundGeo = new THREE.PlaneGeometry(320, roadLength, 1, 40);
    groundGeo.rotateX(-Math.PI / 2);
    groundGeo.translate(0, -0.05, -140);
    this.registerCurvableGeometry(groundGeo);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.95,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh = groundMesh;
    this.scene.add(groundMesh);

    // Concrete Jersey Barriers on Left & Right Highway Edges (Subdivided along Z to follow curves)
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x333b48,
      roughness: 0.75,
      metalness: 0.15,
    });

    const leftBarrierGeo = new THREE.BoxGeometry(0.65, 0.95, roadLength, 1, 1, zSegments);
    leftBarrierGeo.translate(-ROAD_HALF_WIDTH - 0.55, 0.47, -140);
    const leftBarrier = new THREE.Mesh(leftBarrierGeo, barrierMat);
    this.scene.add(leftBarrier);

    const rightBarrierGeo = new THREE.BoxGeometry(0.65, 0.95, roadLength, 1, 1, zSegments);
    rightBarrierGeo.translate(ROAD_HALF_WIDTH + 0.55, 0.47, -140);
    const rightBarrier = new THREE.Mesh(rightBarrierGeo, barrierMat);
    this.scene.add(rightBarrier);
    this.barriers = [
      { mesh: leftBarrier, side: -1, curvable: this.registerCurvableGeometry(leftBarrierGeo) },
      { mesh: rightBarrier, side: 1, curvable: this.registerCurvableGeometry(rightBarrierGeo) },
    ];
  }

  // Switches between the motorway and the two-way road: redraws the markings, narrows or widens the
  // road surface, moves the barriers and rebuilds the roadside (poles, reflectors; no overhead
  // gantries on the two-way road). Only runs when the layout actually changes.
  setRoadLayout(mode) {
    if (!ROAD_MODES.includes(mode) || mode === this.roadMode) return;
    this.roadMode = mode;
    this.roadHalfWidth = ROAD_HALF_WIDTHS[mode];

    this.drawRoadMarkings(this.roadTexture.image.getContext('2d'), mode);
    this.roadTexture.needsUpdate = true;

    if (this.groundMesh) {
      this.groundMesh.material.color.setHex(mode === 'track' ? 0x142818 : 0x090d14);
      this.groundMesh.material.needsUpdate = true;
    }

    const widthScale = (this.roadHalfWidth + 0.8) / (ROAD_HALF_WIDTH + 0.8);
    const road = this.roadCurvable;
    for (let i = 0; i < road.baseX.length; i++) road.baseX[i] = road.originalX[i] * widthScale;
    for (const b of this.barriers) {
      const shift = b.side * (this.roadHalfWidth - ROAD_HALF_WIDTH);
      for (let i = 0; i < b.curvable.baseX.length; i++) b.curvable.baseX[i] = b.curvable.originalX[i] + shift;
      b.mesh.scale.y = mode === 'twoway' ? 0.75 : 1; // a lower roadside barrier
    }

    // Rebuild the roadside segments where the current ones are
    const zs = this.sceneryItems.map((seg) => seg.position.z);
    for (const seg of this.sceneryItems) {
      this.scene.remove(seg);
      seg.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          o.material.map?.dispose();
          o.material.dispose();
        }
      });
    }
    this.sceneryItems = [];
    this.lampFixtures = [];
    this.buildRoadsideScenery();
    this.sceneryItems.forEach((seg, i) => (seg.position.z = zs[i] ?? seg.position.z));
    this.applyWeather(this.weatherKey); // lamp colours for the new fixtures
  }

  createHighwayGantrySign(textMain, textSub) {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4,
      metalness: 0.8,
    });

    // Left & Right Support Truss Columns
    const leftCol = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 8.2, 12), poleMat);
    leftCol.position.set(-ROAD_HALF_WIDTH - 1.2, 4.1, 0);
    group.add(leftCol);

    const rightCol = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 8.2, 12), poleMat);
    rightCol.position.set(ROAD_HALF_WIDTH + 1.2, 4.1, 0);
    group.add(rightCol);

    // Overhead Crossbeam
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry((ROAD_HALF_WIDTH + 1.4) * 2, 0.38, 0.38),
      poleMat
    );
    beam.position.set(0, 7.8, 0);
    group.add(beam);

    // Green Turkish Otoyol Signboard Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#046a38'; // Official Highway Green
    ctx.fillRect(0, 0, 1024, 256);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(14, 14, 1024 - 28, 256 - 28);

    // O-4 Highway Shield Badge
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(48, 46, 130, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 40px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('O-4', 113, 92);

    ctx.font = '900 54px system-ui, sans-serif';
    ctx.fillText(textMain, 540, 106);

    ctx.fillStyle = '#fde047';
    ctx.font = '800 36px system-ui, sans-serif';
    ctx.fillText(textSub, 540, 174);

    // Downward lane arrows
    for (let i = 0; i < 4; i++) {
      const ax = 200 + i * 225;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('↓', ax, 228);
    }

    const signTex = new THREE.CanvasTexture(canvas);
    signTex.colorSpace = THREE.SRGBColorSpace;
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(11.8, 2.5, 0.16),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    signBoard.position.set(0, 7.6, 0.22);
    group.add(signBoard);

    return group;
  }

  buildRoadsideScenery() {
    const half = this.roadHalfWidth;
    const twoWay = this.roadMode === 'twoway';
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.75,
    });

    const lampGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffd27d,
    });
    this.lampFixtures.push(lampGlowMat);

    const redReflectorMat = new THREE.MeshBasicMaterial({ color: 0xff2233 });
    const whiteReflectorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Create 18 repeating roadside segments spanning Z from +40 to -320 (spacing = 20m)
    const numSegments = 18;
    const spacing = 20;

    const signTexts = [
      ['İSTANBUL MERKEZ  12 KM', '15 TEMMUZ ŞEHİTLER KÖPRÜSÜ  •  AVRASYA TÜNELİ'],
      ['ANKARA / KOCAELİ', 'SOL ŞERİT SÜREKLİ İŞGAL EDİLEMEZ'],
      ['FSM KÖPRÜSÜ  •  LEVENT', 'HIZ SINIRI 120 KM/S  •  RADAR KONTROL'],
    ];

    // Every building shares one material (they were identical per-building copies)
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0d1320,
      roughness: 0.85,
    });

    // Shared tunnel materials
    const tunnelTileTex = createTunnelTileTexture();
    const tunnelWallMat = new THREE.MeshStandardMaterial({
      map: tunnelTileTex,
      roughness: 0.45,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const tunnelCeilingMat = new THREE.MeshStandardMaterial({
      color: 0x1e2633,
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const tunnelLightMat = new THREE.MeshBasicMaterial({
      color: 0xffea92, // warm sodium yellow-amber
    });
    const tunnelPortalSignMat = new THREE.MeshBasicMaterial({
      map: createTunnelSignTexture(),
    });
    const tunnelFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.35,
    });

    // Shared bridge materials
    const bridgeTrussMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.38,
      metalness: 0.75,
    });
    const bridgeCableMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.3,
      metalness: 0.85,
    });
    const bridgeWaterMat = new THREE.MeshStandardMaterial({
      color: 0x051329,
      roughness: 0.12,
      metalness: 0.94,
    });
    const bridgeNeonRedMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e, // Turkish flag glowing red neon
    });
    const bridgeSignMat = new THREE.MeshBasicMaterial({
      map: createBridgeSignTexture(),
    });
    const bridgePylonMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.5,
      metalness: 0.35,
    });

    // Shared track materials (İstanbul Park Grand Prix Circuit)
    const trackArmcoMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.8,
    });
    const trackTurfMat = new THREE.MeshStandardMaterial({
      color: 0x16381d,
      roughness: 0.9,
    });
    const trackFinishLineMat = new THREE.MeshBasicMaterial({
      map: createTrackFinishLineTexture(),
    });
    const trackGantryMat = new THREE.MeshBasicMaterial({
      map: createTrackStartGantryTexture(),
    });
    const trackGantryFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.7,
    });
    const trackPitGarageMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.2,
    });
    const trackGrandstandSeatMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.65,
    });
    const trackGrandstandRoofMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.5,
    });
    const trackTireRedMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.9,
    });
    const trackTireWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.85,
    });
    const trackFloodlightPoleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.65,
    });
    const trackFloodlightGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    this.lampFixtures.push(trackFloodlightGlowMat);
    const trackBrake150Mat = new THREE.MeshBasicMaterial({ map: createTrackBrakeBoardTexture(150) });
    const trackBrake100Mat = new THREE.MeshBasicMaterial({ map: createTrackBrakeBoardTexture(100) });
    const trackBrake50Mat = new THREE.MeshBasicMaterial({ map: createTrackBrakeBoardTexture(50) });

    // Static pieces of a segment are baked into one geometry per material, so each segment
    // costs ~5 draw calls instead of ~10 (x18 segments, and again for the rear-view mirror)
    const _m = new THREE.Matrix4();
    const _q = new THREE.Quaternion();
    const _e = new THREE.Euler();
    const _p = new THREE.Vector3();
    const _s = new THREE.Vector3(1, 1, 1);
    const placed = (geo, x, y, z, rx = 0, ry = 0, rz = 0) => {
      _q.setFromEuler(_e.set(rx, ry, rz));
      return geo.applyMatrix4(_m.compose(_p.set(x, y, z), _q, _s));
    };

    for (let i = 0; i < numSegments; i++) {
      const z = 40 - i * spacing;
      const segGroup = new THREE.Group();
      segGroup.position.z = z;

      // 1. Reflective Cat-Eye Posts on top of Jersey Barriers (Always visible)
      const leftRef = new THREE.Mesh(
        placed(new THREE.BoxGeometry(0.12, 0.22, 0.08), -half - 0.55, twoWay ? 0.8 : 1.05, 0),
        redReflectorMat
      );
      segGroup.add(leftRef);

      const rightRef = new THREE.Mesh(
        placed(new THREE.BoxGeometry(0.12, 0.22, 0.08), half + 0.55, twoWay ? 0.8 : 1.05, 0),
        whiteReflectorMat
      );
      segGroup.add(rightRef);

      // --- A. HIGHWAY GROUP ---
      const highwayGroup = new THREE.Group();
      const poleParts = [];
      const bulbParts = [];
      const buildingParts = [];

      // Highway Streetlights (Left & Right tall curved poles)
      [-1, 1].forEach((side) => {
        const poleX = side * (half + 1.35);
        poleParts.push(placed(new THREE.CylinderGeometry(0.1, 0.14, 8.8, 8), poleX, 4.4, 0));
        poleParts.push(
          placed(new THREE.BoxGeometry(2.6, 0.1, 0.1), poleX - side * 1.2, 8.6, 0, 0, 0, side * 0.12)
        );
        bulbParts.push(placed(new THREE.BoxGeometry(0.75, 0.08, 0.32), poleX - side * 2.2, 8.45, 0));
      });

      // Distant City Buildings Silhouette
      [-1, 1].forEach((side) => {
        const bHeight = 14 + ((i * 7 + (side > 0 ? 3 : 0)) % 28);
        const bWidth = 8 + (i % 5) * 2;
        buildingParts.push(
          placed(
            new THREE.BoxGeometry(bWidth, bHeight, 10),
            side * (26 + (i % 4) * 7),
            bHeight / 2 - 0.5,
            0
          )
        );
      });

      highwayGroup.add(new THREE.Mesh(mergeGeometries(poleParts), poleMat));
      highwayGroup.add(new THREE.Mesh(mergeGeometries(bulbParts), lampGlowMat));
      const buildings = new THREE.Mesh(mergeGeometries(buildingParts), buildingMat);
      buildings.layers.set(MIRROR_SKIP_LAYER);
      highwayGroup.add(buildings);
      [...poleParts, ...bulbParts, ...buildingParts].forEach((g) => g.dispose());

      // Overhead Highway Gantry Sign every 6 segments
      if (i % 6 === 2 && !twoWay) {
        const [t1, t2] = signTexts[Math.floor(i / 6) % signTexts.length];
        const gantry = this.createHighwayGantrySign(t1, t2);
        highwayGroup.add(gantry);
      }
      segGroup.add(highwayGroup);
      segGroup.highwayGroup = highwayGroup;

      // --- B. TUNNEL GROUP ---
      const tunnelGroup = new THREE.Group();
      const tunnelConcreteParts = [];
      const tunnelLightParts = [];

      // Vaulted Ceiling Arch
      const archRadius = half + 1.8;
      const archGeo = new THREE.CylinderGeometry(archRadius, archRadius, spacing, 16, 1, true, 0, Math.PI);
      archGeo.rotateX(Math.PI / 2);
      archGeo.scale(1, 0.68, 1);
      archGeo.translate(0, 0.35, 0);
      tunnelGroup.add(new THREE.Mesh(archGeo, tunnelCeilingMat));

      // Lower Wall Panels and Curbs
      tunnelConcreteParts.push(placed(new THREE.BoxGeometry(0.35, 3.2, spacing), -half - 1.5, 1.6, 0));
      tunnelConcreteParts.push(placed(new THREE.BoxGeometry(0.35, 3.2, spacing), half + 1.5, 1.6, 0));
      tunnelConcreteParts.push(placed(new THREE.BoxGeometry(1.2, 0.45, spacing), -half - 0.7, 0.22, 0));
      tunnelConcreteParts.push(placed(new THREE.BoxGeometry(1.2, 0.45, spacing), half + 0.7, 0.22, 0));
      tunnelGroup.add(new THREE.Mesh(mergeGeometries(tunnelConcreteParts), tunnelWallMat));
      tunnelConcreteParts.forEach((g) => g.dispose());

      // Continuous ceiling light strips
      tunnelLightParts.push(placed(new THREE.BoxGeometry(0.25, 0.08, spacing), -5.8, 6.2, 0));
      tunnelLightParts.push(placed(new THREE.BoxGeometry(0.25, 0.08, spacing), 5.8, 6.2, 0));
      tunnelGroup.add(new THREE.Mesh(mergeGeometries(tunnelLightParts), tunnelLightMat));
      tunnelLightParts.forEach((g) => g.dispose());

      // Jet fans on every 3rd segment
      if (i % 3 === 0) {
        const jetParts = [];
        jetParts.push(placed(new THREE.CylinderGeometry(0.42, 0.42, 3.4, 12), -3.6, 6.1, 0, Math.PI / 2, 0, 0));
        jetParts.push(placed(new THREE.CylinderGeometry(0.42, 0.42, 3.4, 12), 3.6, 6.1, 0, Math.PI / 2, 0, 0));
        tunnelGroup.add(new THREE.Mesh(mergeGeometries(jetParts), bridgeTrussMat));
        jetParts.forEach((g) => g.dispose());
      }

      // Portal Group (Entrance / Exit portal frame and signboard)
      const portalGroup = new THREE.Group();
      const portalFrameParts = [];
      portalFrameParts.push(placed(new THREE.BoxGeometry(2.0, 9.4, 2.5), -half - 2.2, 4.7, 0));
      portalFrameParts.push(placed(new THREE.BoxGeometry(2.0, 9.4, 2.5), half + 2.2, 4.7, 0));
      portalFrameParts.push(placed(new THREE.BoxGeometry((half + 3.2) * 2, 2.4, 2.5), 0, 8.6, 0));
      portalGroup.add(new THREE.Mesh(mergeGeometries(portalFrameParts), tunnelFrameMat));
      portalFrameParts.forEach((g) => g.dispose());

      const portalSign = new THREE.Mesh(
        new THREE.BoxGeometry((half + 2.6) * 2, 2.0, 0.12),
        tunnelPortalSignMat
      );
      portalSign.position.set(0, 8.6, -1.32);
      portalGroup.add(portalSign);
      portalGroup.visible = false;
      tunnelGroup.add(portalGroup);

      tunnelGroup.visible = false;
      segGroup.add(tunnelGroup);
      segGroup.tunnelGroup = tunnelGroup;
      segGroup.portalGroup = portalGroup;

      // --- C. BRIDGE GROUP ---
      const bridgeGroup = new THREE.Group();
      const railingParts = [];
      const cableParts = [];

      // Steel Truss Railings on Left & Right
      [-1, 1].forEach((side) => {
        const rx = side * (half + 0.85);
        railingParts.push(placed(new THREE.BoxGeometry(0.16, 0.12, spacing), rx, 1.45, 0));
        railingParts.push(placed(new THREE.BoxGeometry(0.16, 0.12, spacing), rx, 0.35, 0));
        for (let k = -2; k <= 2; k++) {
          railingParts.push(placed(new THREE.BoxGeometry(0.12, 1.3, 0.12), rx, 0.9, k * 4));
        }
      });
      bridgeGroup.add(new THREE.Mesh(mergeGeometries(railingParts), bridgeTrussMat));
      railingParts.forEach((g) => g.dispose());

      // Main Cables & Suspenders
      [-1, 1].forEach((side) => {
        const cx = side * (half + 1.3);
        cableParts.push(placed(new THREE.CylinderGeometry(0.12, 0.12, spacing, 8), cx, 12, 0, Math.PI / 2, 0, 0));
        for (let k = -1.5; k <= 1.5; k++) {
          cableParts.push(placed(new THREE.CylinderGeometry(0.02, 0.02, 11, 6), cx, 6.5, k * 5));
        }
      });
      bridgeGroup.add(new THREE.Mesh(mergeGeometries(cableParts), bridgeCableMat));
      cableParts.forEach((g) => g.dispose());

      // Deep Water Plane beneath the bridge
      const waterGeo = new THREE.PlaneGeometry(260, spacing);
      waterGeo.rotateX(-Math.PI / 2);
      waterGeo.translate(0, -4.5, 0);
      bridgeGroup.add(new THREE.Mesh(waterGeo, bridgeWaterMat));

      // Bridge Pylon (Suspension Tower) Group
      const pylonGroup = new THREE.Group();
      const pylonParts = [];
      pylonParts.push(placed(new THREE.BoxGeometry(1.8, 48, 2.6), -half - 3.2, 21, 0));
      pylonParts.push(placed(new THREE.BoxGeometry(1.8, 48, 2.6), half + 3.2, 21, 0));
      pylonParts.push(placed(new THREE.BoxGeometry((half + 4.2) * 2, 1.8, 2.6), 0, 9.2, 0));
      pylonParts.push(placed(new THREE.BoxGeometry((half + 4.2) * 2, 1.4, 2.2), 0, 28, 0));
      pylonParts.push(placed(new THREE.BoxGeometry((half + 4.2) * 2, 1.6, 2.4), 0, 44, 0));
      pylonGroup.add(new THREE.Mesh(mergeGeometries(pylonParts), bridgePylonMat));
      pylonParts.forEach((g) => g.dispose());

      // Red LED Neon Strips on Tower Legs
      const neonParts = [];
      neonParts.push(placed(new THREE.BoxGeometry(0.18, 48, 0.18), -half - 4.15, 21, 0));
      neonParts.push(placed(new THREE.BoxGeometry(0.18, 48, 0.18), half + 4.15, 21, 0));
      pylonGroup.add(new THREE.Mesh(mergeGeometries(neonParts), bridgeNeonRedMat));
      neonParts.forEach((g) => g.dispose());

      // Bridge Gantry Sign
      const bridgeSign = new THREE.Mesh(new THREE.BoxGeometry(13.5, 2.2, 0.14), bridgeSignMat);
      bridgeSign.position.set(0, 9.2, -1.4);
      pylonGroup.add(bridgeSign);

      pylonGroup.visible = false;
      bridgeGroup.add(pylonGroup);

      bridgeGroup.visible = false;
      segGroup.add(bridgeGroup);
      segGroup.bridgeGroup = bridgeGroup;
      segGroup.pylonGroup = pylonGroup;

      // --- D. TRACK GROUP (İstanbul Park Grand Prix Circuit) ---
      const trackGroup = new THREE.Group();
      const trackArmcoParts = [];
      const trackTurfParts = [];

      // Steel Armco Guardrails on Left & Right
      [-1, 1].forEach((side) => {
        const bx = side * (half + 0.65);
        // Double W-beam steel rail
        trackArmcoParts.push(placed(new THREE.BoxGeometry(0.18, 0.35, spacing), bx, 0.42, 0));
        trackArmcoParts.push(placed(new THREE.BoxGeometry(0.18, 0.35, spacing), bx, 0.82, 0));
        // Steel I-beam posts
        for (let k = -2; k <= 2; k++) {
          trackArmcoParts.push(placed(new THREE.BoxGeometry(0.14, 1.05, 0.14), bx, 0.52, k * 4.5));
        }
      });
      trackGroup.add(new THREE.Mesh(mergeGeometries(trackArmcoParts), trackArmcoMat));
      trackArmcoParts.forEach((g) => g.dispose());

      // Astroturf Runoff Margin (Extends outside the road on both sides)
      [-1, 1].forEach((side) => {
        const tx = side * (half + 4.0);
        const turfGeo = new THREE.PlaneGeometry(6.5, spacing);
        turfGeo.rotateX(-Math.PI / 2);
        turfGeo.translate(tx, 0.01, 0);
        trackTurfParts.push(turfGeo);
      });
      trackGroup.add(new THREE.Mesh(mergeGeometries(trackTurfParts), trackTurfMat));
      trackTurfParts.forEach((g) => g.dispose());

      // 1. Checkered Finish Line Mesh on the road plane
      const trackFinishLine = new THREE.Mesh(
        new THREE.PlaneGeometry(half * 2 + 1.2, 2.8),
        trackFinishLineMat
      );
      trackFinishLine.rotation.x = -Math.PI / 2;
      trackFinishLine.position.set(0, 0.02, 0);
      trackFinishLine.visible = false;
      trackGroup.add(trackFinishLine);
      segGroup.trackFinishLine = trackFinishLine;

      // 2. Start/Finish Overhead Gantry Arch
      const gantryGroup = new THREE.Group();
      const gantryFrameParts = [];
      gantryFrameParts.push(placed(new THREE.BoxGeometry(0.45, 9.6, 0.45), -half - 1.8, 4.8, 0));
      gantryFrameParts.push(placed(new THREE.BoxGeometry(0.45, 9.6, 0.45), half + 1.8, 4.8, 0));
      gantryFrameParts.push(placed(new THREE.BoxGeometry((half + 2.0) * 2, 0.45, 0.45), 0, 9.2, 0));
      gantryGroup.add(new THREE.Mesh(mergeGeometries(gantryFrameParts), trackGantryFrameMat));
      gantryFrameParts.forEach((g) => g.dispose());

      const gantrySign = new THREE.Mesh(
        new THREE.BoxGeometry((half + 1.6) * 2, 2.4, 0.16),
        trackGantryMat
      );
      gantrySign.position.set(0, 8.8, 0.25);
      gantryGroup.add(gantrySign);
      gantryGroup.visible = false;
      trackGroup.add(gantryGroup);
      segGroup.trackGantry = gantryGroup;

      // 3. Pit Lane Wall & Team Garages (Right side)
      const pitGroup = new THREE.Group();
      const pitParts = [];
      pitParts.push(placed(new THREE.BoxGeometry(0.7, 1.2, spacing), half + 2.4, 0.6, 0));
      pitParts.push(placed(new THREE.BoxGeometry(8.5, 5.5, spacing), half + 7.5, 2.75, 0));
      pitGroup.add(new THREE.Mesh(mergeGeometries(pitParts), trackPitGarageMat));
      pitParts.forEach((g) => g.dispose());
      pitGroup.visible = false;
      trackGroup.add(pitGroup);
      segGroup.trackPit = pitGroup;

      // 4. Spectator Grandstand (Left side)
      const grandstandGroup = new THREE.Group();
      const seatParts = [];
      const roofParts = [];
      for (let tier = 0; tier < 4; tier++) {
        seatParts.push(
          placed(
            new THREE.BoxGeometry(2.0, 0.7 + tier * 0.7, spacing),
            -half - 6.5 - tier * 2.0,
            (0.7 + tier * 0.7) / 2,
            0
          )
        );
      }
      roofParts.push(
        placed(
          new THREE.BoxGeometry(10.5, 0.2, spacing),
          -half - 9.5,
          5.6,
          0,
          0,
          0,
          -0.12
        )
      );
      roofParts.push(placed(new THREE.BoxGeometry(0.3, 5.6, 0.3), -half - 14.5, 2.8, -6));
      roofParts.push(placed(new THREE.BoxGeometry(0.3, 5.6, 0.3), -half - 14.5, 2.8, 6));
      grandstandGroup.add(new THREE.Mesh(mergeGeometries(seatParts), trackGrandstandSeatMat));
      grandstandGroup.add(new THREE.Mesh(mergeGeometries(roofParts), trackGrandstandRoofMat));
      seatParts.forEach((g) => g.dispose());
      roofParts.forEach((g) => g.dispose());
      grandstandGroup.visible = false;
      trackGroup.add(grandstandGroup);
      segGroup.trackGrandstand = grandstandGroup;

      // 5. Stadium Floodlight Tower (every 3rd segment)
      const floodlightGroup = new THREE.Group();
      const lightPoleParts = [];
      const lightLampParts = [];
      lightPoleParts.push(placed(new THREE.CylinderGeometry(0.25, 0.38, 16.5, 8), -half - 3.8, 8.25, 0));
      lightPoleParts.push(placed(new THREE.BoxGeometry(3.2, 0.2, 0.8), -half - 3.8, 16.2, 0));
      for (let k = -1; k <= 1; k++) {
        lightLampParts.push(placed(new THREE.BoxGeometry(0.8, 0.5, 0.4), -half - 3.8 + k * 1.0, 16.4, 0.3, 0.25, 0, 0));
      }
      floodlightGroup.add(new THREE.Mesh(mergeGeometries(lightPoleParts), trackFloodlightPoleMat));
      floodlightGroup.add(new THREE.Mesh(mergeGeometries(lightLampParts), trackFloodlightGlowMat));
      lightPoleParts.forEach((g) => g.dispose());
      lightLampParts.forEach((g) => g.dispose());
      floodlightGroup.visible = false;
      trackGroup.add(floodlightGroup);
      segGroup.trackFloodlight = floodlightGroup;

      // 6. Brake Marker Boards (150m, 100m, 50m)
      const brakeBoardGroup = new THREE.Group();
      const bMat = i % 3 === 0 ? trackBrake150Mat : i % 3 === 1 ? trackBrake100Mat : trackBrake50Mat;
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.08), bMat);
      bMesh.position.set(-half - 2.2, 1.4, 0);
      const bPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), trackArmcoMat);
      bPole.position.set(-half - 2.2, 0.7, 0);
      brakeBoardGroup.add(bMesh);
      brakeBoardGroup.add(bPole);
      brakeBoardGroup.visible = false;
      trackGroup.add(brakeBoardGroup);
      segGroup.trackBrakeBoards = brakeBoardGroup;

      // 7. Red & White Tire Barrier Stacks
      const tireGroup = new THREE.Group();
      const tireRedParts = [];
      const tireWhiteParts = [];
      [-1, 1].forEach((side) => {
        const tx = side * (half + 0.95);
        for (let row = 0; row < 2; row++) {
          for (let col = -1; col <= 1; col++) {
            const isRedTire = (row + col + i) % 2 === 0;
            const tGeo = placed(
              new THREE.CylinderGeometry(0.42, 0.42, 0.38, 8),
              tx,
              0.22 + row * 0.38,
              col * 0.9,
              Math.PI / 2,
              0,
              0
            );
            if (isRedTire) tireRedParts.push(tGeo);
            else tireWhiteParts.push(tGeo);
          }
        }
      });
      tireGroup.add(new THREE.Mesh(mergeGeometries(tireRedParts), trackTireRedMat));
      tireGroup.add(new THREE.Mesh(mergeGeometries(tireWhiteParts), trackTireWhiteMat));
      tireRedParts.forEach((g) => g.dispose());
      tireWhiteParts.forEach((g) => g.dispose());
      tireGroup.visible = false;
      trackGroup.add(tireGroup);
      segGroup.trackTires = tireGroup;

      trackGroup.visible = false;
      segGroup.add(trackGroup);
      segGroup.trackGroup = trackGroup;
      segGroup.segIndex = i;

      this.scene.add(segGroup);
      this.sceneryItems.push(segGroup);
    }
  }

  buildRainParticles() {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = 10 - Math.random() * 140;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xa5d8ff,
      size: 0.14,
      transparent: true,
      opacity: 0.55,
    });

    this.rainSystem = new THREE.Points(geo, mat);
    this.rainSystem.visible = false;
    this.scene.add(this.rainSystem);
  }

  applyWeather(key) {
    const preset = WEATHER_PRESETS[key] || WEATHER_PRESETS.night;
    this.weatherKey = preset.key;

    this.scene.background = new THREE.Color(preset.skyColor);
    this.scene.fog = new THREE.FogExp2(preset.fogColor, preset.fogDensity);

    this.ambientLight.color.setHex(preset.ambientColor);
    this.ambientLight.intensity = preset.ambientIntensity;

    if (this.hemiLight) {
      this.hemiLight.color.setHex(preset.dirColor);
      this.hemiLight.groundColor.setHex(preset.hemiGroundColor || 0x2a364f);
      this.hemiLight.intensity = preset.ambientIntensity * 0.85;
    }

    this.dirLight.color.setHex(preset.dirColor);
    this.dirLight.intensity = preset.dirIntensity;

    if (this.roadMat) {
      this.roadMat.roughness = preset.roadRoughness;
      this.roadMat.metalness = preset.roadMetalness;
      this.roadMat.needsUpdate = true;
    }

    this.lampFixtures.forEach((mat) => {
      mat.color.setHex(preset.streetlightsOn ? 0xffdf99 : 0x64748b);
    });

    if (this.rainSystem) {
      this.rainSystem.visible = preset.rain;
    }

    // Adjust player low-beams based on day/night
    this.lowBeamLight.intensity = preset.streetlightsOn ? 14.0 : 2.5;

    return preset;
  }

  cycleWeather() {
    const keys = Object.keys(WEATHER_PRESETS);
    const idx = keys.indexOf(this.weatherKey);
    const nextKey = keys[(idx + 1) % keys.length];
    return this.applyWeather(nextKey);
  }

  update(dt, speedMs, playerX, highBeamActive, customWorldDistM = null) {
    if (customWorldDistM !== null) {
      this.worldDistM = customWorldDistM;
    } else {
      this.worldDistM += speedMs * dt;
    }

    // Scroll road texture UVs smoothly based on speed (m/s)
    // 1 texture repeat is ~20 meters
    this.scrollOffset += (speedMs * dt) / 20;
    if (this.roadTexture) {
      this.roadTexture.offset.y = this.scrollOffset;
    }

    // Deform subdivided road, ground, and concrete Jersey barriers along the 3D highway curve
    const s0 = this.worldDistM;
    const c0 = this.evalRoadCenterX(s0);
    const d0 = this.evalRoadDeriv1(s0);
    const zCache = this._zOffsetCache;
    zCache.clear();

    let maxAbsOffset = 0;
    for (let j = 0; j < this.curvableGeometries.length; j++) {
      const item = this.curvableGeometries[j];
      const pos = item.geo.attributes.position;
      const arr = pos.array;
      const baseX = item.baseX;
      const baseZ = item.baseZ;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const z = baseZ[i];
        let off = zCache.get(z);
        if (off === undefined) {
          off = this.evalRoadCenterX(s0 - z) - c0 + z * d0;
          zCache.set(z, off);
          const absOff = Math.abs(off);
          if (absOff > maxAbsOffset) maxAbsOffset = absOff;
        }
        arr[i * 3] = baseX[i] + off;
      }
    }

    // Only upload vertex buffers to GPU if the road is actually curved or just returned to straight
    const isCurved = maxAbsOffset > 0.0001;
    if (isCurved || this._prevMaxCurveOffset > 0.0001) {
      for (let j = 0; j < this.curvableGeometries.length; j++) {
        this.curvableGeometries[j].geo.attributes.position.needsUpdate = true;
      }
    }
    this._prevMaxCurveOffset = maxAbsOffset;

    // Move roadside poles, barriers, buildings & overhead signs toward player (+Z) and follow the curve
    const totalSpan = this.sceneryItems.length * 20; // 360m loop
    for (const seg of this.sceneryItems) {
      seg.position.z += speedMs * dt;
      if (seg.position.z > 45) {
        seg.position.z -= totalSpan;
      }
      seg.position.x = this.getCurveOffsetAtZ(seg.position.z);
      seg.rotation.y = this.getCurveYawAtZ(seg.position.z);

      // Zone visibility per segment
      const isTrack = this.roadMode === 'track';
      const trackS = this.worldDistM - seg.position.z;
      const s = ((trackS % ZONE_CYCLE_LENGTH) + ZONE_CYCLE_LENGTH) % ZONE_CYCLE_LENGTH;
      const zone = getZoneAt(trackS, this.roadMode);

      const isTunnel = zone === 'tunnel';
      const isBridge = zone === 'bridge';
      const isHighway = zone === 'highway';

      if (seg.highwayGroup) seg.highwayGroup.visible = !isTrack && isHighway;
      if (seg.tunnelGroup) seg.tunnelGroup.visible = !isTrack && isTunnel;
      if (seg.bridgeGroup) seg.bridgeGroup.visible = !isTrack && isBridge;
      if (seg.trackGroup) {
        seg.trackGroup.visible = isTrack;
        if (isTrack) {
          const u = ((trackS % TRACK_LAP_LENGTH) + TRACK_LAP_LENGTH) % TRACK_LAP_LENGTH;
          if (seg.trackFinishLine) seg.trackFinishLine.visible = u < 25 || u > 3975;
          if (seg.trackGantry) seg.trackGantry.visible = u < 25 || u > 3975;
          if (seg.trackPit) seg.trackPit.visible = u >= 25 && u < 450;
          if (seg.trackGrandstand) seg.trackGrandstand.visible = (u >= 25 && u < 450) || (u >= 1800 && u < 2500);
          if (seg.trackBrakeBoards) seg.trackBrakeBoards.visible = (u >= 350 && u < 490) || (u >= 3050 && u < 3190);
          if (seg.trackTires) seg.trackTires.visible = (u >= 500 && u < 850) || (u >= 1800 && u < 2600) || (u >= 3200 && u < 3450);
          if (seg.trackFloodlight) seg.trackFloodlight.visible = (seg.segIndex % 3 === 0);
        }
      }

      if (isTunnel) {
        const isPortal = (s >= 5500 && s < 5520) || (s >= 6680 && s < 6700);
        if (seg.portalGroup) seg.portalGroup.visible = isPortal;
      } else if (isBridge) {
        const isPylon = (s >= 12520 && s < 12540) || (s >= 13420 && s < 13440);
        if (seg.pylonGroup) seg.pylonGroup.visible = isPylon;
      }
    }

    // Update player zone environment & lighting transitions
    const playerZone = getZoneAt(this.worldDistM, this.roadMode);
    this.currentZone = playerZone;

    const preset = WEATHER_PRESETS[this.weatherKey] || WEATHER_PRESETS.night;

    if (playerZone === 'tunnel') {
      if (this.groundMesh) this.groundMesh.visible = false;
      if (this.rainSystem) this.rainSystem.visible = false;
      this.ambientLight.color.lerp(this.tunnelAmbientColor, dt * 3.5);
      this.ambientLight.intensity = THREE.MathUtils.lerp(this.ambientLight.intensity, 1.85, dt * 3.5);
      this.hemiLight.color.lerp(this.tunnelHemiColor, dt * 3.5);
      this.dirLight.intensity = THREE.MathUtils.lerp(this.dirLight.intensity, 0.2, dt * 3.5);
    } else if (playerZone === 'bridge') {
      if (this.groundMesh) this.groundMesh.visible = false;
      if (this.rainSystem) this.rainSystem.visible = Boolean(preset.rain);
      this.ambientLight.color.lerp(preset.ambientColorObj, dt * 3.5);
      this.ambientLight.intensity = THREE.MathUtils.lerp(this.ambientLight.intensity, preset.ambientIntensity, dt * 3.5);
      this.hemiLight.color.lerp(preset.dirColorObj, dt * 3.5);
      this.dirLight.intensity = THREE.MathUtils.lerp(this.dirLight.intensity, preset.dirIntensity, dt * 3.5);
    } else {
      if (this.groundMesh) this.groundMesh.visible = true;
      if (this.rainSystem) this.rainSystem.visible = Boolean(preset.rain);
      this.ambientLight.color.lerp(preset.ambientColorObj, dt * 3.5);
      this.ambientLight.intensity = THREE.MathUtils.lerp(this.ambientLight.intensity, preset.ambientIntensity, dt * 3.5);
      this.hemiLight.color.lerp(preset.dirColorObj, dt * 3.5);
      this.dirLight.intensity = THREE.MathUtils.lerp(this.dirLight.intensity, preset.dirIntensity, dt * 3.5);
    }

    // Update Headlight & Selektör position to follow player car X + Audi Matrix Adaptive Cornering light swivel
    this.headlightGroup.position.x = playerX;
    this.lowBeamTarget.position.x = this.getCurveOffsetAtZ(-55) * 0.7;
    this.highBeamTarget.position.x = this.getCurveOffsetAtZ(-115) * 0.7;
    this.highBeamLight.intensity = highBeamActive ? 28.0 : 0.0;

    // Update falling rain streaks if Rainy weather is active
    if (this.rainSystem && this.rainSystem.visible) {
      const pos = this.rainSystem.geometry.attributes.position;
      const arr = pos.array;
      const count = pos.count;
      const dy = 18 * dt;
      const dz = speedMs * dt * 0.85;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        let y = arr[idx + 1] - dy;
        let z = arr[idx + 2] + dz;
        if (y < 0) y = 14;
        if (z > 10) z -= 140;
        arr[idx + 1] = y;
        arr[idx + 2] = z;
      }
      pos.needsUpdate = true;
    }
  }

  getCurrentZone() {
    return getZoneAt(this.worldDistM, this.roadMode);
  }
}
