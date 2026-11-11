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
// 'track': Intercity İstanbul Park racing circuit (14 turns, 3D elevation, Esses, Hairpins & 4-apex Turn 8!)
export const ROAD_MODES = ['highway', 'twoway', 'track'];
export const ROAD_HALF_WIDTHS = { highway: ROAD_HALF_WIDTH, twoway: 4.6, track: 9.2 };

export const ZONE_CYCLE_LENGTH = 15000;

// Intercity İstanbul Park Grand Prix Circuit: 4800m Full 14-Turn Counter-Clockwise Layout
// Curvature kappa (1/m): negative = Left turn (8 lefts), positive = Right turn (6 rights)
export const TRACK_LAP_LENGTH = 4800.0;
export const TRACK_SECTIONS = [
  { name: 'Ana Düzlük (Start/Finish)', code: 'MAIN', start: 0, len: 480, kappa: 0, deltaC: 0, turnDir: 0 },
  { name: '1. Viraj (Türk Tirbüşonu • Sert Sola İniş)', code: 'T1', start: 480, len: 220, kappa: -0.0125, deltaC: -85, turnDir: -1 },
  { name: '2. Viraj (Sağa Yokuş Çıkışı)', code: 'T2', start: 700, len: 200, kappa: 0.0088, deltaC: 60, turnDir: 1 },
  { name: '3. Viraj Yaklaşımı (Tırmanış)', code: 'STR1', start: 900, len: 140, kappa: 0, deltaC: 0, turnDir: 0 },
  { name: '3. Viraj (Tepe Noktası Sert Sol)', code: 'T3', start: 1040, len: 200, kappa: -0.0115, deltaC: -75, turnDir: -1 },
  { name: '4. Viraj (S-Viraj Sağa İniş)', code: 'T4', start: 1240, len: 190, kappa: 0.0105, deltaC: 70, turnDir: 1 },
  { name: '5. Viraj (S-Viraj Teknik Sol)', code: 'T5', start: 1430, len: 190, kappa: -0.0102, deltaC: -68, turnDir: -1 },
  { name: '6. Viraj (Çıkış Hızlı Sol)', code: 'T6', start: 1620, len: 160, kappa: -0.0072, deltaC: -45, turnDir: -1 },
  { name: '7. Viraj Yaklaşımı', code: 'STR2', start: 1780, len: 160, kappa: 0, deltaC: 0, turnDir: 0 },
  { name: '7. Viraj (Geniş Sağ U-Viraj)', code: 'T7', start: 1940, len: 240, kappa: 0.0115, deltaC: 82, turnDir: 1 },
  { name: '8. Viraj Giriş Düzlüğü', code: 'STR3', start: 2180, len: 120, kappa: 0, deltaC: 0, turnDir: 0 },
  { name: 'Efsanevi 8. Viraj (Diabolica • 4 Apeks)', code: 'T8', start: 2300, len: 680, kappa: -0.0085, kappaPulse: -0.0048, apexes: 4, deltaC: -120, turnDir: -1 },
  { name: '9. Viraj Yaklaşımı (Vadi İnişi)', code: 'STR4', start: 2980, len: 200, kappa: 0, deltaC: 0, turnDir: 0 },
  { name: '9. Viraj (Vadi Girişi Sert Sol Şikan)', code: 'T9', start: 3180, len: 170, kappa: -0.0122, deltaC: -78, turnDir: -1 },
  { name: '10. Viraj (Arka Düzlüğe Sağ Çıkış)', code: 'T10', start: 3350, len: 170, kappa: 0.0095, deltaC: 62, turnDir: 1 },
  { name: 'Arka Düzlük (DRS Bölgesi • Tırmanış)', code: 'BACK', start: 3520, len: 260, kappa: 0, deltaC: 0, turnDir: 0 },
  { name: '11. Viraj (Hızlı Sağ Kink)', code: 'T11', start: 3780, len: 180, kappa: 0.0062, deltaC: 40, turnDir: 1 },
  { name: '12. Viraj Ağır Frenleme Bölgesi', code: 'STR5', start: 3960, len: 200, kappa: 0, deltaC: 0, turnDir: 0 },
  { name: '12. Viraj (Sert Sol Saç Tokası)', code: 'T12', start: 4160, len: 200, kappa: -0.0135, deltaC: -95, turnDir: -1 },
  { name: '13. Viraj (Stadyum Teknik Sağ)', code: 'T13', start: 4360, len: 170, kappa: 0.0110, deltaC: 72, turnDir: 1 },
  { name: '14. Son Viraj (Sert Sol • Ana Düzlük Çıkışı)', code: 'T14', start: 4530, len: 270, kappa: -0.0112, deltaC: -80, turnDir: -1 },
];

// Precompute exact C2-continuous analytical integral constants (thetaStart, cStart) across the lap
let _runningTrackTheta = 0;
let _runningTrackC = 0;
for (let i = 0; i < TRACK_SECTIONS.length; i++) {
  const sec = TRACK_SECTIONS[i];
  sec.thetaStart = _runningTrackTheta;
  sec.cStart = _runningTrackC;
  const kTotal = (sec.kappa || 0) + (sec.kappaPulse || 0);
  const L = sec.len;
  _runningTrackC += _runningTrackTheta * L + 0.25 * kTotal * L * L;
  _runningTrackTheta += 0.5 * kTotal * L;
}
const TRACK_LAP_TOTAL_THETA = _runningTrackTheta;
const TRACK_LAP_TOTAL_C = _runningTrackC;

// Authentic 3D Topography / Elevation Profile of Intercity İstanbul Park (meters)
const TRACK_ELEV_POINTS = [
  { s: 0, y: 0.0 },      // Main Straight Start/Finish
  { s: 480, y: 2.8 },    // Turn 1 Braking Crest (blind entry)
  { s: 780, y: -11.5 },  // Turn 1-2 "Turkish Corkscrew" Steep Downhill Dip
  { s: 1120, y: 4.8 },   // Turn 3 Steep Uphill Crest
  { s: 1680, y: -8.2 },  // Turns 4-5-6 Downhill Esses Valley
  { s: 2140, y: -1.2 },  // Turn 7 Cambered Climb
  { s: 2640, y: -5.8 },  // Turn 8 ("Diabolica") 4-Apex Bowl
  { s: 3250, y: -13.5 }, // Turn 9-10 Valley Floor (Lowest Point)
  { s: 4080, y: 3.8 },   // Back Straight & Turn 11 Uphill Crest before Turn 12
  { s: 4530, y: -1.0 },  // Turn 12-13 Stadium Complex
  { s: 4800, y: 0.0 },   // Turn 14 Exit onto Main Straight
];

// Braking zones before major corners: cornerStart, outside side (+1 right for left turns, -1 left for right turns)
const TRACK_BRAKE_ZONES = [
  { cornerStart: 480, side: 1 },   // T1 (Left) -> boards on Right
  { cornerStart: 1040, side: 1 },  // T3 (Left) -> boards on Right
  { cornerStart: 1940, side: -1 }, // T7 (Right) -> boards on Left
  { cornerStart: 2300, side: 1 },  // T8 (Left) -> boards on Right
  { cornerStart: 3180, side: 1 },  // T9 (Left) -> boards on Right
  { cornerStart: 4160, side: 1 },  // T12 (Left) -> boards on Right
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

  // Turkish Red & White racing border
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 1014, 246);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, 996, 228);

  // Checkered endcaps
  for (let y = 18; y < 238; y += 28) {
    for (let x = 18; x < 102; x += 28) {
      ctx.fillStyle = (((y / 28) | 0) + ((x / 28) | 0)) % 2 === 0 ? '#ffffff' : '#0f172a';
      ctx.fillRect(x, y, 28, 28);
    }
    for (let x = 922; x < 1006; x += 28) {
      ctx.fillStyle = (((y / 28) | 0) + ((x / 28) | 0)) % 2 === 0 ? '#ffffff' : '#0f172a';
      ctx.fillRect(x, y, 28, 28);
    }
  }

  // Top Turkish GP header bar
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(116, 18, 792, 36);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🇹🇷  INTERCITY İSTANBUL PARK  •  FORMULA 1 TURKISH GRAND PRIX  🏁', 512, 43);

  // Main text: START / FINISH
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 58px system-ui, sans-serif';
  ctx.fillText('İSTANBUL PARK CIRCUIT', 512, 112);

  // 5 Twin-Pod FIA Formula 1 Red Starting Lights
  const startX = 292;
  for (let i = 0; i < 5; i++) {
    const lx = startX + i * 110;
    // Pod housing
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.fillRect(lx - 34, 134, 68, 96);
    ctx.strokeRect(lx - 34, 134, 68, 96);

    // Upper dim red lamp
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.arc(lx, 158, 16, 0, Math.PI * 2);
    ctx.fill();

    // Lower glowing red FIA start lamp
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(lx, 200, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fecaca';
    ctx.beginPath();
    ctx.arc(lx - 5, 195, 6, 0, Math.PI * 2);
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

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 256, 256);

  // Red FIA top header band
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 256, 48);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('METRE', 128, 25);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 244, 244);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 108px system-ui, sans-serif';
  ctx.fillText(String(meters), 128, 150);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTrackChevronTexture(dir = -1) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  // High-contrast dark racing backing
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 192);

  // Draw 4 bold Red & White racing chevrons pointing in turn direction (dir < 0: left, dir > 0: right)
  const chevW = 115;
  for (let i = -1; i < 5; i++) {
    const x0 = i * chevW;
    ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f8fafc';
    ctx.beginPath();
    if (dir < 0) {
      ctx.moveTo(x0 + chevW, 0);
      ctx.lineTo(x0 + chevW * 0.45, 96);
      ctx.lineTo(x0 + chevW, 192);
      ctx.lineTo(x0 + chevW * 0.45, 192);
      ctx.lineTo(x0 - chevW * 0.1, 96);
      ctx.lineTo(x0 + chevW * 0.45, 0);
    } else {
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0 + chevW * 0.55, 96);
      ctx.lineTo(x0, 192);
      ctx.lineTo(x0 + chevW * 0.55, 192);
      ctx.lineTo(x0 + chevW * 1.1, 96);
      ctx.lineTo(x0 + chevW * 0.55, 0);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 184);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTrackBridgeBannerTexture(variant = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  const themes = [
    {
      bg1: '#991b1b',
      bg2: '#dc2626',
      border: '#fde047',
      top: '🇹🇷  INTERCITY İSTANBUL PARK  •  FIA GRADE 1 CIRCUIT  🇹🇷',
      main: 'TURKISH GRAND PRIX  •  TURN 1 CORKSCREW',
    },
    {
      bg1: '#0f172a',
      bg2: '#0e7490',
      border: '#38bdf8',
      top: '⚡  İSTANBUL PARK EFSANESİ  •  4 APEKSLİ HIZLI SOL VİRAJ  ⚡',
      main: 'TURN 8  •  DIABOLICA  •  FULL THROTTLE',
    },
    {
      bg1: '#090d16',
      bg2: '#1e293b',
      border: '#e11d48',
      top: '🏁  TOSFED  •  ARKA DÜZLÜK YÜKSEK HIZ BÖLGESİ  🏁',
      main: 'DRS ZONE  •  TURN 11 FLAT-OUT  •  260+ KM/S',
    },
  ];
  const th = themes[variant % themes.length];

  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, th.bg1);
  grad.addColorStop(0.5, th.bg2);
  grad.addColorStop(1, th.bg1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 192);

  // Diagonal Turkish GP accent stripes on sides
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 32, 0);
    ctx.lineTo(50 + i * 32, 0);
    ctx.lineTo(20 + i * 32, 192);
    ctx.lineTo(-10 + i * 32, 192);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1004 - i * 32, 0);
    ctx.lineTo(974 - i * 32, 0);
    ctx.lineTo(1004 - i * 32, 192);
    ctx.lineTo(1034 - i * 32, 192);
    ctx.fill();
  }

  ctx.strokeStyle = th.border;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 1012, 180);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.fillText(th.top, 512, 48);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px system-ui, sans-serif';
  ctx.fillText(th.main, 512, 130);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTrackRunoffTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Asphalt run-off base
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(0, 0, 512, 512);

  // Fine asphalt grain
  for (let i = 0; i < 4000; i++) {
    const v = 24 + ((Math.random() * 16) | 0);
    ctx.fillStyle = `rgb(${v},${v + 3},${v + 7})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  // Green FIA Astroturf strip on inner side (0..130)
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 130, 512);
  ctx.fillStyle = '#166534';
  for (let y = 0; y < 512; y += 32) {
    ctx.fillRect(0, y, 130, 16);
  }

  // White boundary line separating astroturf from painted asphalt apron
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(130, 0, 10, 512);

  // Iconic Turkish GP Red, White & Turquoise diagonal run-off stripes (140..512)
  ctx.save();
  ctx.beginPath();
  ctx.rect(140, 0, 372, 512);
  ctx.clip();
  const colors = ['#dc2626', '#1e2430', '#f8fafc', '#1e2430', '#0891b2', '#1e2430'];
  for (let k = -8; k < 16; k++) {
    ctx.fillStyle = colors[((k % colors.length) + colors.length) % colors.length];
    ctx.beginPath();
    const y0 = k * 48;
    ctx.moveTo(140, y0);
    ctx.lineTo(512, y0 + 96);
    ctx.lineTo(512, y0 + 124);
    ctx.lineTo(140, y0 + 28);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
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
    this._zElevCache = new Map();
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

  // Intercity İstanbul Park Racing Circuit C2-Continuous Analytical Curve Evaluation
  // Uses true sustained corner curvature kappa(t) (and 4-apex harmonic in Turn 8)
  evalTrackProfile(s) {
    const lapIdx = Math.floor(s / TRACK_LAP_LENGTH);
    const u = s - lapIdx * TRACK_LAP_LENGTH;
    const { sec, t } = getTrackSectionAt(u);

    const k1 = sec.kappa || 0;
    const k2 = sec.kappaPulse || 0;
    let d2 = 0.0;
    let dTheta = 0.0;
    let dC = 0.0;

    if (k1 !== 0 || k2 !== 0) {
      const L = sec.len;
      const w1 = (Math.PI * 2.0) / L;
      const phi1 = w1 * t;
      const cos1 = Math.cos(phi1);
      const sin1 = Math.sin(phi1);
      d2 = 0.5 * k1 * (1.0 - cos1);
      dTheta = 0.5 * k1 * (t - sin1 / w1);
      dC = 0.5 * k1 * (0.5 * t * t - (1.0 - cos1) / (w1 * w1));

      if (k2 !== 0) {
        const nApex = sec.apexes || 4;
        const w2 = (Math.PI * 2.0 * nApex) / L;
        const phi2 = w2 * t;
        const cos2 = Math.cos(phi2);
        const sin2 = Math.sin(phi2);
        d2 += 0.5 * k2 * (1.0 - cos2);
        dTheta += 0.5 * k2 * (t - sin2 / w2);
        dC += 0.5 * k2 * (0.5 * t * t - (1.0 - cos2) / (w2 * w2));
      }
    }

    const d1Lap = sec.thetaStart + dTheta;
    const cLap = sec.cStart + sec.thetaStart * t + dC;

    _reusableProfile.d2 = d2;
    _reusableProfile.d1 = lapIdx * TRACK_LAP_TOTAL_THETA + d1Lap;
    _reusableProfile.c =
      lapIdx * TRACK_LAP_TOTAL_C +
      TRACK_LAP_TOTAL_THETA * TRACK_LAP_LENGTH * (lapIdx * (lapIdx - 1) * 0.5) +
      lapIdx * TRACK_LAP_TOTAL_THETA * u +
      cLap;
    return _reusableProfile;
  }

  evalTrackCenterX(s) {
    return this.evalTrackProfile(s).c;
  }

  evalTrackDeriv1(s) {
    return this.evalTrackProfile(s).d1;
  }

  evalTrackDeriv2(s) {
    return this.evalTrackProfile(s).d2;
  }

  // Intercity İstanbul Park 3D Elevation Profile Y(s) and Slope Y'(s)
  evalTrackElevation(s) {
    const u = ((s % TRACK_LAP_LENGTH) + TRACK_LAP_LENGTH) % TRACK_LAP_LENGTH;
    for (let i = 0; i < TRACK_ELEV_POINTS.length - 1; i++) {
      const p0 = TRACK_ELEV_POINTS[i];
      const p1 = TRACK_ELEV_POINTS[i + 1];
      if (u >= p0.s && u <= p1.s) {
        const L = p1.s - p0.s;
        const t = u - p0.s;
        const dy = p1.y - p0.y;
        return p0.y + dy * (t / L - Math.sin((Math.PI * 2.0 * t) / L) / (Math.PI * 2.0));
      }
    }
    return 0.0;
  }

  evalTrackElevDeriv1(s) {
    const u = ((s % TRACK_LAP_LENGTH) + TRACK_LAP_LENGTH) % TRACK_LAP_LENGTH;
    for (let i = 0; i < TRACK_ELEV_POINTS.length - 1; i++) {
      const p0 = TRACK_ELEV_POINTS[i];
      const p1 = TRACK_ELEV_POINTS[i + 1];
      if (u >= p0.s && u <= p1.s) {
        const L = p1.s - p0.s;
        const t = u - p0.s;
        const dy = p1.y - p0.y;
        return (dy / L) * (1.0 - Math.cos((Math.PI * 2.0 * t) / L));
      }
    }
    return 0.0;
  }

  getElevationOffsetAtZ(z) {
    if (this.roadMode !== 'track') return 0.0;
    const s0 = this.worldDistM;
    const y0 = this.evalTrackElevation(s0);
    const dy0 = this.evalTrackElevDeriv1(s0);
    return this.evalTrackElevation(s0 - z) - y0 + z * dy0;
  }

  getElevationSlopeAtZ(z) {
    if (this.roadMode !== 'track') return 0.0;
    const s0 = this.worldDistM;
    const dy0 = this.evalTrackElevDeriv1(s0);
    return -this.evalTrackElevDeriv1(s0 - z) + dy0;
  }

  getElevationPitchAtZ(z) {
    if (this.roadMode !== 'track') return 0.0;
    return Math.atan(-this.getElevationSlopeAtZ(z));
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
    const baseY = new Float32Array(count);
    const baseZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      baseX[i] = pos.getX(i);
      baseY[i] = pos.getY(i);
      baseZ[i] = pos.getZ(i);
    }
    const item = { geo, baseX, baseY, baseZ, originalX: baseX.slice() };
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
    // 1. High-grip FIA Grade 1 Tilke racing asphalt base
    ctx.fillStyle = '#1b1f2a';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle longitudinal asphalt paver seams
    ctx.fillStyle = 'rgba(12, 15, 22, 0.35)';
    ctx.fillRect(340, 0, 3, 1024);
    ctx.fillRect(512, 0, 3, 1024);
    ctx.fillRect(684, 0, 3, 1024);

    // 2. Mineral aggregate micro-texture & off-line tire rubber marbles
    for (let i = 0; i < 22000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const v = 20 + Math.floor(Math.random() * 20);
      ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
      ctx.fillRect(x, y, 2, 3);
    }
    // Dark tire marbles near outer edges of the track
    ctx.fillStyle = '#0c0e14';
    for (let i = 0; i < 1600; i++) {
      const side = i % 2 === 0;
      const x = side ? 95 + Math.random() * 110 : 819 + Math.random() * 110;
      const y = Math.random() * 1024;
      ctx.fillRect(x, y, 3, 4);
    }

    // 3. Heavy rubbered-in racing groove (ideal racing line sheen)
    const gradCenter = ctx.createLinearGradient(230, 0, 794, 0);
    gradCenter.addColorStop(0.0, 'rgba(10, 12, 18, 0)');
    gradCenter.addColorStop(0.22, 'rgba(9, 11, 16, 0.42)');
    gradCenter.addColorStop(0.5, 'rgba(14, 17, 24, 0.25)');
    gradCenter.addColorStop(0.78, 'rgba(9, 11, 16, 0.42)');
    gradCenter.addColorStop(1.0, 'rgba(10, 12, 18, 0)');
    ctx.fillStyle = gradCenter;
    ctx.fillRect(230, 0, 564, 1024);

    // 4. Outer FIA Green Astroturf Verge (0..22 and 1002..1024)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, 22, 1024);
    ctx.fillRect(1002, 0, 22, 1024);

    // 5. Red & White FIA Serrated Vibrating Kerbs (Kerbler: 22..78 and 946..1002)
    const curbStartL = 22;
    const curbW = 56;
    const curbStartR = 1024 - curbStartL - curbW;
    for (let y = 0; y < 1024; y += 64) {
      const isRed = (y / 64) % 2 === 0;
      const mainCol = isRed ? '#dc2626' : '#f8fafc';
      const bevelCol = isRed ? '#ef4444' : '#ffffff';
      const shadeCol = isRed ? '#991b1b' : '#cbd5e1';

      // Left Kerb Stone + 3D bevel highlight & rumble groove
      ctx.fillStyle = mainCol;
      ctx.fillRect(curbStartL, y, curbW, 64);
      ctx.fillStyle = bevelCol;
      ctx.fillRect(curbStartL + curbW - 14, y, 10, 60);
      ctx.fillStyle = shadeCol;
      ctx.fillRect(curbStartL, y, 10, 60);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(curbStartL, y + 59, curbW, 5);

      // Right Kerb Stone + 3D bevel highlight & rumble groove
      ctx.fillStyle = mainCol;
      ctx.fillRect(curbStartR, y, curbW, 64);
      ctx.fillStyle = bevelCol;
      ctx.fillRect(curbStartR + 4, y, 10, 60);
      ctx.fillStyle = shadeCol;
      ctx.fillRect(curbStartR + curbW - 10, y, 10, 60);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(curbStartR, y + 59, curbW, 5);
    }

    // Yellow/Red FIA Sausage Kerb ridge along outer kerb boundary
    for (let y = 0; y < 1024; y += 128) {
      ctx.fillStyle = (y / 128) % 2 === 0 ? '#facc15' : '#dc2626';
      ctx.fillRect(curbStartL - 4, y + 8, 8, 112);
      ctx.fillRect(curbStartR + curbW - 4, y + 8, 8, 112);
    }

    // 6. Crisp Solid White FIA Track Limit Boundary Lines (inside kerbs)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(curbStartL + curbW, 0, 14, 1024); // Left white line
    ctx.fillRect(curbStartR - 14, 0, 14, 1024); // Right white line
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

    // Outer Ground Plane (Dark terrain alongside highway, lush turf in track mode)
    const groundGeo = new THREE.PlaneGeometry(360, roadLength, 1, 55);
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

  updateGroundAndTrackColors() {
    const isTrack = this.roadMode === 'track';
    const w = this.weatherKey;
    if (this.groundMesh) {
      if (!isTrack) {
        this.groundMesh.material.color.setHex(0x090d14);
      } else if (w === 'day') {
        this.groundMesh.material.color.setHex(0x1f4d23);
      } else if (w === 'sunset') {
        this.groundMesh.material.color.setHex(0x233b1d);
      } else {
        this.groundMesh.material.color.setHex(0x0f2414);
      }
      this.groundMesh.material.needsUpdate = true;
    }
    if (this.trackHillMat) {
      this.trackHillMat.color.setHex(w === 'day' ? 0x19421e : w === 'sunset' ? 0x1c3219 : 0x0b1c10);
    }
    if (this.trackTreeMat) {
      this.trackTreeMat.color.setHex(w === 'day' ? 0x0f2e15 : w === 'sunset' ? 0x122411 : 0x07130a);
    }
  }

  // Switches between the motorway, two-way road, and İstanbul Park track: redraws the markings,
  // scales the road surface, hides motorway Jersey barriers on the circuit, and rebuilds roadside scenery.
  setRoadLayout(mode) {
    if (!ROAD_MODES.includes(mode) || mode === this.roadMode) return;
    this.roadMode = mode;
    this.roadHalfWidth = ROAD_HALF_WIDTHS[mode];

    this.drawRoadMarkings(this.roadTexture.image.getContext('2d'), mode);
    this.roadTexture.needsUpdate = true;

    const widthScale = (this.roadHalfWidth + 0.8) / (ROAD_HALF_WIDTH + 0.8);
    const road = this.roadCurvable;
    for (let i = 0; i < road.baseX.length; i++) road.baseX[i] = road.originalX[i] * widthScale;
    for (const b of this.barriers) {
      const shift = b.side * (this.roadHalfWidth - ROAD_HALF_WIDTH);
      for (let i = 0; i < b.curvable.baseX.length; i++) b.curvable.baseX[i] = b.curvable.originalX[i] + shift;
      b.mesh.scale.y = mode === 'twoway' ? 0.75 : 1; // a lower roadside barrier
      // Hide concrete motorway barriers on the race track so run-off areas, kerbs & gravel traps are open!
      b.mesh.visible = mode !== 'track';
    }

    // Reset Y deformation when switching modes and force vertex buffer upload
    for (let j = 0; j < this.curvableGeometries.length; j++) {
      const item = this.curvableGeometries[j];
      const arr = item.geo.attributes.position.array;
      const baseY = item.baseY;
      for (let i = 0; i < item.geo.attributes.position.count; i++) {
        arr[i * 3 + 1] = baseY[i];
      }
      item.geo.attributes.position.needsUpdate = true;
    }
    this._prevMaxCurveOffset = 1;

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
    this.applyWeather(this.weatherKey); // lamp & terrain colours for the new fixtures
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

    // Shared track materials (Intercity İstanbul Park Grand Prix Circuit)
    const trackArmcoMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.8,
    });
    const trackMarshalOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.5,
      metalness: 0.3,
    });
    const trackCatchFenceMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.7,
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide,
    });
    const trackRunoffTex = createTrackRunoffTexture();
    trackRunoffTex.repeat.set(1, 2);
    const trackRunoffMat = new THREE.MeshStandardMaterial({
      map: trackRunoffTex,
      roughness: 0.65,
      metalness: 0.1,
    });
    const trackGravelMat = new THREE.MeshStandardMaterial({
      color: 0xc2a878,
      roughness: 0.96,
      metalness: 0.02,
    });
    const trackTurfMat = new THREE.MeshStandardMaterial({
      color: 0x16381d,
      roughness: 0.9,
    });
    const trackHillMat = new THREE.MeshStandardMaterial({
      color: 0x19421e,
      roughness: 0.95,
    });
    const trackTreeMat = new THREE.MeshStandardMaterial({
      color: 0x0f2e15,
      roughness: 0.9,
    });
    this.trackHillMat = trackHillMat;
    this.trackTreeMat = trackTreeMat;

    const trackFinishLineMat = new THREE.MeshBasicMaterial({
      map: createTrackFinishLineTexture(),
    });
    const trackGridLineMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
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
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.3,
    });
    const trackPitGlassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.85,
    });
    const trackPitLightMat = new THREE.MeshBasicMaterial({
      color: 0xfffbeb,
    });
    const trackGrandstandSeatRedMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.6,
    });
    const trackGrandstandSeatWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6,
    });
    const trackGrandstandSeatBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.6,
    });
    const trackGrandstandRoofMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.25,
      side: THREE.DoubleSide,
    });
    const trackTireRedMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.88,
    });
    const trackTireWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.85,
    });
    const trackTireBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      roughness: 0.88,
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
    const trackLedFlagMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
    });
    const trackTurkishFlagMat = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      side: THREE.DoubleSide,
    });
    const trackBrake150Mat = new THREE.MeshBasicMaterial({ map: createTrackBrakeBoardTexture(150) });
    const trackBrake100Mat = new THREE.MeshBasicMaterial({ map: createTrackBrakeBoardTexture(100) });
    const trackBrake50Mat = new THREE.MeshBasicMaterial({ map: createTrackBrakeBoardTexture(50) });
    this.trackBrakeMats = { 150: trackBrake150Mat, 100: trackBrake100Mat, 50: trackBrake50Mat };

    const trackChevronLeftMat = new THREE.MeshBasicMaterial({ map: createTrackChevronTexture(-1) });
    const trackChevronRightMat = new THREE.MeshBasicMaterial({ map: createTrackChevronTexture(1) });
    this.trackBridgeBannerMats = [
      new THREE.MeshBasicMaterial({ map: createTrackBridgeBannerTexture(0) }),
      new THREE.MeshBasicMaterial({ map: createTrackBridgeBannerTexture(1) }),
      new THREE.MeshBasicMaterial({ map: createTrackBridgeBannerTexture(2) }),
    ];

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
      segGroup.rotation.order = 'YXZ';
      segGroup.position.z = z;

      // 1. Reflective Cat-Eye Posts on top of Jersey Barriers (Hidden in track mode)
      const leftRef = new THREE.Mesh(
        placed(new THREE.BoxGeometry(0.12, 0.22, 0.08), -half - 0.55, twoWay ? 0.8 : 1.05, 0),
        redReflectorMat
      );
      segGroup.add(leftRef);
      segGroup.leftRef = leftRef;

      const rightRef = new THREE.Mesh(
        placed(new THREE.BoxGeometry(0.12, 0.22, 0.08), half + 0.55, twoWay ? 0.8 : 1.05, 0),
        whiteReflectorMat
      );
      segGroup.add(rightRef);
      segGroup.rightRef = rightRef;

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

      // --- D. TRACK GROUP (Intercity İstanbul Park Grand Prix Circuit) ---
      const trackGroup = new THREE.Group();
      const trackArmcoParts = [];
      const trackMarshalParts = [];
      const trackFenceParts = [];
      const trackRunoffParts = [];
      const trackHillParts = [];
      const trackTreeParts = [];

      // 1. Wide FIA Green Astroturf + Turkish GP Red/White/Turquoise Painted Asphalt Run-Off Aprons
      const runoffWidth = 6.2;
      [-1, 1].forEach((side) => {
        const rx = side * (half + 0.5 + runoffWidth * 0.5);
        const rGeo = new THREE.PlaneGeometry(runoffWidth, spacing);
        rGeo.rotateX(-Math.PI / 2);
        if (side < 0) rGeo.rotateY(Math.PI);
        rGeo.translate(rx, 0.012, 0);
        trackRunoffParts.push(rGeo);
      });
      trackGroup.add(new THREE.Mesh(mergeGeometries(trackRunoffParts), trackRunoffMat));
      trackRunoffParts.forEach((g) => g.dispose());

      // 2. Set-Back Steel Triple-Wave Armco Guardrails & Tall FIA Debris Catch Fencing
      const barrierX = half + 6.7;
      [-1, 1].forEach((side) => {
        const bx = side * barrierX;
        // Triple W-beam steel rails
        trackArmcoParts.push(placed(new THREE.BoxGeometry(0.18, 0.28, spacing), bx, 0.32, 0));
        trackArmcoParts.push(placed(new THREE.BoxGeometry(0.18, 0.28, spacing), bx, 0.68, 0));
        trackArmcoParts.push(placed(new THREE.BoxGeometry(0.18, 0.28, spacing), bx, 1.04, 0));
        // Orange Marshal Safety Posts at segment ends every 3rd segment
        if (i % 3 === 0) {
          trackMarshalParts.push(placed(new THREE.BoxGeometry(0.22, 1.15, 1.8), bx - side * 0.03, 0.6, -7.5));
        }
        // Tall FIA Catch Fence posts & overhanging top cantilevers
        for (let k = -2; k <= 2; k++) {
          const pz = k * 4.5;
          trackArmcoParts.push(placed(new THREE.BoxGeometry(0.14, 4.2, 0.14), bx + side * 0.12, 2.1, pz));
          trackArmcoParts.push(
            placed(new THREE.BoxGeometry(0.95, 0.1, 0.1), bx - side * 0.28, 4.35, pz, 0, 0, side * 0.35)
          );
        }
        // Semi-transparent FIA Wire Mesh Catch Fence Panel above Armco
        trackFenceParts.push(placed(new THREE.PlaneGeometry(spacing, 3.0), bx + side * 0.05, 2.7, 0, 0, Math.PI / 2, 0));
      });
      trackGroup.add(new THREE.Mesh(mergeGeometries(trackArmcoParts), trackArmcoMat));
      trackArmcoParts.forEach((g) => g.dispose());
      if (trackMarshalParts.length > 0) {
        trackGroup.add(new THREE.Mesh(mergeGeometries(trackMarshalParts), trackMarshalOrangeMat));
        trackMarshalParts.forEach((g) => g.dispose());
      }
      trackGroup.add(new THREE.Mesh(mergeGeometries(trackFenceParts), trackCatchFenceMat));
      trackFenceParts.forEach((g) => g.dispose());

      // 3. Natural Rolling Akfırat / Tepeören Anatolian Hills & Pine/Cypress Trees (Background Silhouette)
      [-1, 1].forEach((side) => {
        const hDist = 36 + ((i * 5 + (side > 0 ? 2 : 0)) % 3) * 9;
        const hHeight = 9 + ((i * 7 + (side > 0 ? 4 : 1)) % 14);
        const hWidth = 24 + (i % 3) * 8;
        trackHillParts.push(
          placed(new THREE.ConeGeometry(hWidth * 0.65, hHeight, 6), side * hDist, hHeight * 0.42 - 0.5, 0)
        );
        // Cluster of Mediterranean Cypress / Pine trees on the hillside slopes
        for (let tIdx = 0; tIdx < 2; tIdx++) {
          const tx = side * (20 + ((i * 3 + tIdx * 7) % 16));
          const tz = (tIdx - 0.5) * 9;
          const th = 4.8 + ((i + tIdx) % 3) * 1.6;
          trackTreeParts.push(placed(new THREE.ConeGeometry(1.45, th, 6), tx, th * 0.5, tz));
        }
      });
      const hillsMesh = new THREE.Mesh(mergeGeometries(trackHillParts), trackHillMat);
      hillsMesh.layers.set(MIRROR_SKIP_LAYER);
      trackGroup.add(hillsMesh);
      const treesMesh = new THREE.Mesh(mergeGeometries(trackTreeParts), trackTreeMat);
      treesMesh.layers.set(MIRROR_SKIP_LAYER);
      trackGroup.add(treesMesh);
      trackHillParts.forEach((g) => g.dispose());
      trackTreeParts.forEach((g) => g.dispose());

      // 4. Checkered Start/Finish Line Mesh on the road plane
      const trackFinishLine = new THREE.Mesh(
        new THREE.PlaneGeometry(half * 2 + 1.2, 3.2),
        trackFinishLineMat
      );
      trackFinishLine.rotation.x = -Math.PI / 2;
      trackFinishLine.position.set(0, 0.025, 0);
      trackFinishLine.visible = false;
      trackGroup.add(trackFinishLine);
      segGroup.trackFinishLine = trackFinishLine;

      // 5. Formula 1 Staggered Starting Grid Boxes on the Main Straight
      const gridGroup = new THREE.Group();
      const gridParts = [];
      [-3.2, 3.2].forEach((gx, gIdx) => {
        const gz = gIdx === 0 ? -3.5 : 3.5;
        // Front line + left/right bracket wings of F1 grid box
        gridParts.push(placed(new THREE.PlaneGeometry(2.5, 0.18), gx, 0.02, gz - 2.1, -Math.PI / 2, 0, 0));
        gridParts.push(placed(new THREE.PlaneGeometry(0.16, 1.8), gx - 1.17, 0.02, gz - 1.2, -Math.PI / 2, 0, 0));
        gridParts.push(placed(new THREE.PlaneGeometry(0.16, 1.8), gx + 1.17, 0.02, gz - 1.2, -Math.PI / 2, 0, 0));
      });
      gridGroup.add(new THREE.Mesh(mergeGeometries(gridParts), trackGridLineMat));
      gridParts.forEach((g) => g.dispose());
      gridGroup.visible = false;
      trackGroup.add(gridGroup);
      segGroup.trackGridBoxes = gridGroup;

      // 6. Start/Finish Overhead FIA Light Gantry Bridge
      const gantryGroup = new THREE.Group();
      const gantryFrameParts = [];
      const spanW = (half + 2.8) * 2;
      gantryFrameParts.push(placed(new THREE.BoxGeometry(0.55, 9.8, 0.55), -half - 2.6, 4.9, 0));
      gantryFrameParts.push(placed(new THREE.BoxGeometry(0.55, 9.8, 0.55), half + 2.6, 4.9, 0));
      gantryFrameParts.push(placed(new THREE.BoxGeometry(spanW, 0.5, 0.5), 0, 9.4, 0));
      gantryFrameParts.push(placed(new THREE.BoxGeometry(spanW, 0.35, 0.35), 0, 7.6, 0));
      gantryGroup.add(new THREE.Mesh(mergeGeometries(gantryFrameParts), trackGantryFrameMat));
      gantryFrameParts.forEach((g) => g.dispose());

      const gantrySign = new THREE.Mesh(
        new THREE.BoxGeometry(half * 2 + 2.4, 2.5, 0.18),
        trackGantryMat
      );
      gantrySign.position.set(0, 8.7, 0.28);
      gantryGroup.add(gantrySign);
      gantryGroup.visible = false;
      trackGroup.add(gantryGroup);
      segGroup.trackGantry = gantryGroup;

      // 7. Overhead Track Sponsor & VIP Pedestrian Bridge (Turn 1, Turn 8 Approach, Back Straight DRS)
      const ovBridgeGroup = new THREE.Group();
      const ovFrameParts = [];
      const ovSpan = (barrierX + 1.5) * 2;
      ovFrameParts.push(placed(new THREE.BoxGeometry(1.4, 9.2, 2.2), -barrierX - 1.2, 4.6, 0));
      ovFrameParts.push(placed(new THREE.BoxGeometry(1.4, 9.2, 2.2), barrierX + 1.2, 4.6, 0));
      ovFrameParts.push(placed(new THREE.BoxGeometry(ovSpan, 0.8, 2.4), 0, 8.4, 0));
      ovBridgeGroup.add(new THREE.Mesh(mergeGeometries(ovFrameParts), trackGantryFrameMat));
      ovFrameParts.forEach((g) => g.dispose());

      const ovBannerMesh = new THREE.Mesh(
        new THREE.BoxGeometry(ovSpan - 1.2, 1.9, 0.16),
        this.trackBridgeBannerMats[0]
      );
      ovBannerMesh.position.set(0, 8.6, 1.25);
      ovBridgeGroup.add(ovBannerMesh);
      ovBridgeGroup.visible = false;
      trackGroup.add(ovBridgeGroup);
      segGroup.trackOverheadBridge = ovBridgeGroup;
      segGroup.trackBridgeBanner = ovBannerMesh;

      // 8. Right Side Pit Wall, F1 Team Garages & Paddock Club Building (Main Straight)
      const pitGroup = new THREE.Group();
      const pitBodyParts = [];
      const pitGlassParts = [];
      const pitRoofParts = [];
      const pitLightParts = [];
      const pitTeamRedParts = [];
      // Concrete Pit Wall + Engineer Timing Perch on trackside right
      pitBodyParts.push(placed(new THREE.BoxGeometry(0.55, 1.35, spacing), half + 1.8, 0.68, 0));
      pitGlassParts.push(placed(new THREE.BoxGeometry(1.1, 1.2, 3.8), half + 1.9, 1.95, 0));
      // Two-story F1 Pit Building & Paddock Club (set back across pit lane at half + 11.5)
      const pitX = half + 12.0;
      pitBodyParts.push(placed(new THREE.BoxGeometry(9.0, 8.2, spacing - 0.3), pitX, 4.1, 0));
      // Garage bay dividers & glowing interior lights
      for (let gBay = -1; gBay <= 1; gBay += 2) {
        pitLightParts.push(placed(new THREE.BoxGeometry(0.25, 2.8, 6.5), pitX - 4.45, 1.5, gBay * 4.8));
      }
      // Red/Turkish GP Team Fascia band above garage doors
      pitTeamRedParts.push(placed(new THREE.BoxGeometry(0.35, 0.85, spacing - 0.2), pitX - 4.45, 3.55, 0));
      // Upper floor Paddock Club panoramic blue glass facade
      pitGlassParts.push(placed(new THREE.BoxGeometry(0.3, 2.6, spacing - 0.6), pitX - 4.42, 5.8, 0));
      // Cantilevered white Paddock Club roof overhang
      pitRoofParts.push(placed(new THREE.BoxGeometry(11.4, 0.45, spacing), pitX - 0.8, 8.35, 0));

      pitGroup.add(new THREE.Mesh(mergeGeometries(pitBodyParts), trackPitGarageMat));
      pitGroup.add(new THREE.Mesh(mergeGeometries(pitGlassParts), trackPitGlassMat));
      pitGroup.add(new THREE.Mesh(mergeGeometries(pitRoofParts), trackGrandstandRoofMat));
      pitGroup.add(new THREE.Mesh(mergeGeometries(pitLightParts), trackPitLightMat));
      pitGroup.add(new THREE.Mesh(mergeGeometries(pitTeamRedParts), trackTireRedMat));
      [...pitBodyParts, ...pitGlassParts, ...pitRoofParts, ...pitLightParts, ...pitTeamRedParts].forEach((g) =>
        g.dispose()
      );
      pitGroup.visible = false;
      trackGroup.add(pitGroup);
      segGroup.trackPit = pitGroup;

      // 9. Iconic Intercity İstanbul Park Octagonal VIP & Race Control Tower (Main Straight Right)
      const towerGroup = new THREE.Group();
      const towerStructParts = [];
      const towerGlassParts = [];
      const txTower = half + 18.5;
      // Central core + flared observation crown at 26m height
      towerStructParts.push(placed(new THREE.CylinderGeometry(2.6, 3.2, 24.0, 8), txTower, 12.0, 0));
      towerGlassParts.push(placed(new THREE.CylinderGeometry(4.8, 3.0, 5.2, 8), txTower, 24.5, 0));
      towerStructParts.push(placed(new THREE.CylinderGeometry(5.4, 4.9, 1.1, 8), txTower, 27.6, 0));
      towerStructParts.push(placed(new THREE.CylinderGeometry(0.18, 0.18, 6.0, 6), txTower, 31.0, 0));
      towerGroup.add(new THREE.Mesh(mergeGeometries(towerStructParts), trackGrandstandRoofMat));
      towerGroup.add(new THREE.Mesh(mergeGeometries(towerGlassParts), trackPitGlassMat));
      towerStructParts.forEach((g) => g.dispose());
      towerGlassParts.forEach((g) => g.dispose());
      towerGroup.visible = false;
      trackGroup.add(towerGroup);
      segGroup.trackControlTower = towerGroup;

      // 10. Iconic İstanbul Park Wing-Roof Grandstand (Multi-color seats + Suspended Tent Wing Roof & Masts)
      const grandstandGroup = new THREE.Group();
      const seatRedParts = [];
      const seatWhiteParts = [];
      const seatBlueParts = [];
      const roofWingParts = [];
      const mastParts = [];
      const gsBaseX = -barrierX - 2.2;
      for (let tier = 0; tier < 5; tier++) {
        const tH = 0.8 + tier * 0.85;
        const sGeo = placed(
          new THREE.BoxGeometry(1.85, tH, spacing - 0.2),
          gsBaseX - tier * 1.85,
          tH * 0.5,
          0
        );
        if ((tier + i) % 3 === 0) seatRedParts.push(sGeo);
        else if ((tier + i) % 3 === 1) seatWhiteParts.push(sGeo);
        else seatBlueParts.push(sGeo);
      }
      // Iconic white cantilevered wing roof & peaked tent ridge
      roofWingParts.push(
        placed(new THREE.BoxGeometry(11.8, 0.24, spacing - 0.1), gsBaseX - 3.6, 7.6, 0, 0, 0, -0.14)
      );
      roofWingParts.push(
        placed(new THREE.ConeGeometry(4.2, 2.2, 4), gsBaseX - 3.6, 8.7, 0, 0, Math.PI / 4, 0)
      );
      // Tall angled steel suspension mast & rear columns behind the grandstand
      mastParts.push(
        placed(new THREE.CylinderGeometry(0.18, 0.28, 13.5, 8), gsBaseX - 8.8, 6.75, 0, 0, 0, -0.1)
      );
      mastParts.push(
        placed(new THREE.CylinderGeometry(0.05, 0.05, 7.2, 6), gsBaseX - 5.2, 10.2, 0, 0, 0, 0.72)
      );

      if (seatRedParts.length) grandstandGroup.add(new THREE.Mesh(mergeGeometries(seatRedParts), trackGrandstandSeatRedMat));
      if (seatWhiteParts.length) grandstandGroup.add(new THREE.Mesh(mergeGeometries(seatWhiteParts), trackGrandstandSeatWhiteMat));
      if (seatBlueParts.length) grandstandGroup.add(new THREE.Mesh(mergeGeometries(seatBlueParts), trackGrandstandSeatBlueMat));
      grandstandGroup.add(new THREE.Mesh(mergeGeometries(roofWingParts), trackGrandstandRoofMat));
      grandstandGroup.add(new THREE.Mesh(mergeGeometries(mastParts), trackFloodlightPoleMat));
      [...seatRedParts, ...seatWhiteParts, ...seatBlueParts, ...roofWingParts, ...mastParts].forEach((g) =>
        g.dispose()
      );
      grandstandGroup.visible = false;
      trackGroup.add(grandstandGroup);
      segGroup.trackGrandstand = grandstandGroup;

      // 11. Corner Outside Safety Zones: Gravel Trap + Red/White/Turquoise Tire Stacks + Corner Chevron Boards
      const buildCornerOutsideSide = (side, chevronMat) => {
        const cGroup = new THREE.Group();
        const tRed = [];
        const tWhite = [];
        const tBlue = [];

        // Sandy-beige FIA Gravel Trap bed in the run-off zone
        const gravGeo = new THREE.PlaneGeometry(4.2, spacing);
        gravGeo.rotateX(-Math.PI / 2);
        gravGeo.translate(side * (half + 4.3), 0.022, 0);
        cGroup.add(new THREE.Mesh(gravGeo, trackGravelMat));

        // 3-row Tire Barrier Stack in front of the Armco barrier
        const tireX = side * (barrierX - 0.55);
        for (let row = 0; row < 3; row++) {
          for (let col = -4; col <= 4; col++) {
            const tGeo = placed(
              new THREE.CylinderGeometry(0.42, 0.42, 0.36, 8),
              tireX,
              0.2 + row * 0.36,
              col * 2.1,
              0,
              0,
              Math.PI / 2
            );
            const mod = Math.abs(row + col + i) % 3;
            if (mod === 0) tRed.push(tGeo);
            else if (mod === 1) tWhite.push(tGeo);
            else tBlue.push(tGeo);
          }
        }
        if (tRed.length) cGroup.add(new THREE.Mesh(mergeGeometries(tRed), trackTireRedMat));
        if (tWhite.length) cGroup.add(new THREE.Mesh(mergeGeometries(tWhite), trackTireWhiteMat));
        if (tBlue.length) cGroup.add(new THREE.Mesh(mergeGeometries(tBlue), trackTireBlueMat));
        [...tRed, ...tWhite, ...tBlue].forEach((g) => g.dispose());

        // High-visibility Corner Direction Chevron Board mounted above Tire Barrier
        const chevBoard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.15, 0.1), chevronMat);
        chevBoard.position.set(side * (barrierX - 0.25), 1.85, 0);
        chevBoard.rotation.y = -side * 0.28;
        cGroup.add(chevBoard);

        cGroup.visible = false;
        return cGroup;
      };

      // Left corners throw cars to the RIGHT (+1) outside; Right corners throw cars to the LEFT (-1) outside
      const cornerOutsideRight = buildCornerOutsideSide(1, trackChevronLeftMat);
      const cornerOutsideLeft = buildCornerOutsideSide(-1, trackChevronRightMat);
      trackGroup.add(cornerOutsideRight);
      trackGroup.add(cornerOutsideLeft);
      segGroup.trackCornerRight = cornerOutsideRight;
      segGroup.trackCornerLeft = cornerOutsideLeft;

      // 12. Stadium Floodlight Tower & Turkish / Racing Flagpoles
      const floodlightGroup = new THREE.Group();
      const lightPoleParts = [];
      const lightLampParts = [];
      const flSide = i % 2 === 0 ? -1 : 1;
      const flX = flSide * (barrierX + 1.6);
      lightPoleParts.push(placed(new THREE.CylinderGeometry(0.22, 0.36, 17.0, 8), flX, 8.5, 0));
      lightPoleParts.push(placed(new THREE.BoxGeometry(3.4, 0.22, 0.8), flX, 16.7, 0));
      for (let k = -1; k <= 1; k++) {
        lightLampParts.push(
          placed(new THREE.BoxGeometry(0.85, 0.52, 0.4), flX + k * 1.05, 16.9, 0.3, 0.25, 0, 0)
        );
      }
      floodlightGroup.add(new THREE.Mesh(mergeGeometries(lightPoleParts), trackFloodlightPoleMat));
      floodlightGroup.add(new THREE.Mesh(mergeGeometries(lightLampParts), trackFloodlightGlowMat));
      lightPoleParts.forEach((g) => g.dispose());
      lightLampParts.forEach((g) => g.dispose());
      floodlightGroup.visible = false;
      trackGroup.add(floodlightGroup);
      segGroup.trackFloodlight = floodlightGroup;

      // Trackside Flagpoles & FIA Digital LED Flag Panel (every 2nd segment)
      if (i % 2 === 0) {
        const flagSide = i % 4 === 0 ? 1 : -1;
        const fx = flagSide * (barrierX + 0.9);
        const poleMesh = new THREE.Mesh(
          placed(new THREE.CylinderGeometry(0.06, 0.08, 7.5, 6), fx, 3.75, -5),
          trackFloodlightPoleMat
        );
        const flagCloth = new THREE.Mesh(
          placed(new THREE.PlaneGeometry(1.9, 1.15), fx - flagSide * 0.95, 6.8, -5, 0, 0.2, 0),
          trackTurkishFlagMat
        );
        trackGroup.add(poleMesh);
        trackGroup.add(flagCloth);
      }
      if (i % 4 === 1) {
        const ledPanel = new THREE.Mesh(
          placed(new THREE.BoxGeometry(1.1, 0.85, 0.12), barrierX - 0.2, 2.2, 4),
          trackLedFlagMat
        );
        trackGroup.add(ledPanel);
      }

      // 13. Sequential Brake Marker Boards (150m, 100m, 50m - dynamically placed on Left or Right verge)
      const brakeBoardGroup = new THREE.Group();
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.35, 0.08), trackBrake150Mat);
      bMesh.position.set(0, 1.45, 0);
      const bPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.45, 6), trackArmcoMat);
      bPole.position.set(0, 0.72, 0);
      brakeBoardGroup.add(bMesh);
      brakeBoardGroup.add(bPole);
      brakeBoardGroup.visible = false;
      trackGroup.add(brakeBoardGroup);
      segGroup.trackBrakeBoards = brakeBoardGroup;
      segGroup.trackBrakeMesh = bMesh;

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

    this.updateGroundAndTrackColors();

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

    // Deform subdivided road, ground, and concrete Jersey barriers along the 3D curve & track elevation
    const isTrack = this.roadMode === 'track';
    const s0 = this.worldDistM;
    const c0 = this.evalRoadCenterX(s0);
    const d0 = this.evalRoadDeriv1(s0);
    const y0 = isTrack ? this.evalTrackElevation(s0) : 0;
    const dy0 = isTrack ? this.evalTrackElevDeriv1(s0) : 0;
    const zCache = this._zOffsetCache;
    const yCache = this._zElevCache;
    zCache.clear();
    yCache.clear();

    let maxAbsOffset = 0;
    for (let j = 0; j < this.curvableGeometries.length; j++) {
      const item = this.curvableGeometries[j];
      const pos = item.geo.attributes.position;
      const arr = pos.array;
      const baseX = item.baseX;
      const baseY = item.baseY;
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

        if (isTrack) {
          let offY = yCache.get(z);
          if (offY === undefined) {
            offY = this.evalTrackElevation(s0 - z) - y0 + z * dy0;
            yCache.set(z, offY);
            const absY = Math.abs(offY);
            if (absY > maxAbsOffset) maxAbsOffset = absY;
          }
          arr[i * 3 + 1] = baseY[i] + offY;
        }
      }
    }

    // Only upload vertex buffers to GPU if the road is actually curved/sloped or just returned to straight
    const isCurved = maxAbsOffset > 0.0001;
    if (isCurved || this._prevMaxCurveOffset > 0.0001) {
      for (let j = 0; j < this.curvableGeometries.length; j++) {
        this.curvableGeometries[j].geo.attributes.position.needsUpdate = true;
      }
    }
    this._prevMaxCurveOffset = maxAbsOffset;

    // Move roadside poles, barriers, buildings & overhead signs toward player (+Z) and follow the 3D curve
    const totalSpan = this.sceneryItems.length * 20; // 360m loop
    const half = this.roadHalfWidth;
    for (const seg of this.sceneryItems) {
      seg.position.z += speedMs * dt;
      if (seg.position.z > 45) {
        seg.position.z -= totalSpan;
      }
      seg.position.x = this.getCurveOffsetAtZ(seg.position.z);
      seg.position.y = isTrack ? this.getElevationOffsetAtZ(seg.position.z) : 0;
      seg.rotation.y = this.getCurveYawAtZ(seg.position.z);
      seg.rotation.x = isTrack ? this.getElevationPitchAtZ(seg.position.z) : 0;

      if (seg.leftRef) seg.leftRef.visible = !isTrack;
      if (seg.rightRef) seg.rightRef.visible = !isTrack;

      // Zone visibility per segment
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
          const { sec, u } = getTrackSectionAt(trackS);
          const isFinish = u < 20 || u > TRACK_LAP_LENGTH - 20;
          if (seg.trackFinishLine) seg.trackFinishLine.visible = isFinish;
          if (seg.trackGantry) seg.trackGantry.visible = isFinish;
          if (seg.trackGridBoxes) seg.trackGridBoxes.visible = (u >= 22 && u < 220) || u >= TRACK_LAP_LENGTH - 180;
          if (seg.trackPit) seg.trackPit.visible = u >= 15 && u < 445;
          if (seg.trackControlTower) seg.trackControlTower.visible = u >= 75 && u < 105;
          if (seg.trackGrandstand) {
            seg.trackGrandstand.visible =
              (u >= 15 && u < 445) || (u >= 2320 && u < 2940) || (u >= 4160 && u < 4680);
          }

          // Overhead Track Bridges (Turn 1 approach, Turn 7-8 approach, Back Straight DRS zone)
          if (seg.trackOverheadBridge) {
            let bridgeIdx = -1;
            if (u >= 335 && u < 358) bridgeIdx = 0;
            else if (u >= 1815 && u < 1838) bridgeIdx = 1;
            else if (u >= 3640 && u < 3663) bridgeIdx = 2;
            seg.trackOverheadBridge.visible = bridgeIdx >= 0;
            if (bridgeIdx >= 0 && seg.trackBridgeBanner && this.trackBridgeBannerMats) {
              seg.trackBridgeBanner.material = this.trackBridgeBannerMats[bridgeIdx];
            }
          }

          // Outside Corner Gravel Traps, Tire Stacks & Chevron Direction Boards
          if (seg.trackCornerRight) seg.trackCornerRight.visible = sec.turnDir < 0;
          if (seg.trackCornerLeft) seg.trackCornerLeft.visible = sec.turnDir > 0;

          // Sequential 150m -> 100m -> 50m Brake Marker Boards before major corners
          if (seg.trackBrakeBoards) {
            let bMeters = 0;
            let bSide = 1;
            for (let bIdx = 0; bIdx < TRACK_BRAKE_ZONES.length; bIdx++) {
              const bz = TRACK_BRAKE_ZONES[bIdx];
              const distToTurn = bz.cornerStart - u;
              if (distToTurn >= 38 && distToTurn <= 162) {
                bSide = bz.side;
                if (distToTurn >= 135 && distToTurn < 160) bMeters = 150;
                else if (distToTurn >= 88 && distToTurn < 113) bMeters = 100;
                else if (distToTurn >= 40 && distToTurn < 65) bMeters = 50;
                break;
              }
            }
            seg.trackBrakeBoards.visible = bMeters > 0;
            if (bMeters > 0 && seg.trackBrakeMesh && this.trackBrakeMats) {
              seg.trackBrakeBoards.position.x = bSide * (half + 2.2);
              seg.trackBrakeMesh.material = this.trackBrakeMats[bMeters];
            }
          }

          if (seg.trackFloodlight) seg.trackFloodlight.visible = seg.segIndex % 3 === 0;
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
    this.lowBeamTarget.position.y = isTrack ? this.getElevationOffsetAtZ(-55) * 0.6 : 0.0;
    this.highBeamTarget.position.x = this.getCurveOffsetAtZ(-115) * 0.7;
    this.highBeamTarget.position.y = isTrack ? 0.5 + this.getElevationOffsetAtZ(-115) * 0.6 : 0.5;
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
