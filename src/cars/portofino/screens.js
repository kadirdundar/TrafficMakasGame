// Ferrari Portofino displays, drawn into the 3D cockpit's screen canvases (car.js →
// cockpit.screenPainters; src/cockpit.js → paint3DScreen calls them in logical units).
//
// cluster: the binnacle face, 240 x 80 — a yellow rev counter behind the carbon ring in the
//   middle (it fills the ring, so the model's own static dial is covered), speed on the left
//   screen, the radio and drive mode on the right one
// center: the dash touchscreen, 240 x 100 — a static navigation map, the radio and climate

// Rev counter centre and radius in the cluster's logical units (ring measured on the model:
// x -0.375, y 0.875, inner radius ~0.062 m, 682 units per metre)
const TACH = { cx: 117.5, cy: 37.5, r: 43 };
const TACH_MAX = 10; // x1000 rpm
const DIAL_START = Math.PI * 0.75;
const DIAL_SWEEP = Math.PI * 1.5;
const FONT = 'system-ui, sans-serif';

const cache = new Map();
// Static layers are drawn once per size into an offscreen canvas at the screen's resolution
function cached(key, w, h, scale, draw) {
  const id = `${key}|${w}x${h}@${scale.toFixed(2)}`;
  let canvas = cache.get(id);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = Math.ceil(w * scale);
    canvas.height = Math.ceil(h * scale);
    const c = canvas.getContext('2d');
    c.scale(scale, scale);
    draw(c);
    cache.set(id, canvas);
  }
  return canvas;
}

const clock = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

function panel(c, x, y, w, h, r = 3) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

// ---------------------------------------------------------------- Cluster

function drawTachFace(c, redline) {
  const { cx, cy, r } = TACH;
  const angleOf = (v) => DIAL_START + DIAL_SWEEP * (v / TACH_MAX);
  const face = c.createRadialGradient(cx, cy - r * 0.2, r * 0.1, cx, cy, r);
  face.addColorStop(0, '#ffd84a');
  face.addColorStop(1, '#e8a800');
  c.fillStyle = face;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fill();

  // Red zone from the redline
  c.strokeStyle = '#d0021b';
  c.lineWidth = r * 0.08;
  c.beginPath();
  c.arc(cx, cy, r * 0.86, angleOf(redline / 1000), angleOf(TACH_MAX));
  c.stroke();

  c.lineCap = 'butt';
  for (let v = 0; v <= TACH_MAX + 1e-6; v += 0.5) {
    const major = Number.isInteger(v);
    const a = angleOf(v);
    const r0 = r * (major ? 0.74 : 0.8);
    c.strokeStyle = '#111';
    c.lineWidth = r * (major ? 0.04 : 0.022);
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    c.lineTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9);
    c.stroke();
  }
  c.fillStyle = '#111';
  c.font = `700 ${r * 0.17}px ${FONT}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  for (let v = 0; v <= TACH_MAX; v++) {
    const a = angleOf(v);
    c.fillText(String(v), cx + Math.cos(a) * r * 0.58, cy + Math.sin(a) * r * 0.58);
  }
  c.font = `600 ${r * 0.09}px ${FONT}`;
  c.fillText('RPM x 1000', cx, cy + r * 0.34);
}

function drawSideScreens(c, w, h) {
  const bg = '#0a0d12';
  c.fillStyle = '#05070c';
  c.fillRect(0, 0, w, h);
  for (const x of [3, 168]) {
    const g = c.createLinearGradient(0, 8, 0, h);
    g.addColorStop(0, '#121823');
    g.addColorStop(1, bg);
    c.fillStyle = g;
    panel(c, x, 8, 69, h - 12, 4);
    c.fill();
  }
  c.fillStyle = '#64748b';
  c.font = `600 4.6px ${FONT}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText('km/h', 46, 52);
}

export function paintFerrariCluster(ctx, w, h, s) {
  const scale = Math.max(1, ctx.getTransform().a);
  ctx.drawImage(cached('ferrari-sides', w, h, scale, (c) => drawSideScreens(c, w, h)), 0, 0, w, h);
  ctx.drawImage(cached(`ferrari-tach-${s.redline}`, w, h, scale, (c) => drawTachFace(c, s.redline)), 0, 0, w, h);

  const { cx, cy, r } = TACH;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Gear in the middle of the dial
  ctx.fillStyle = '#111';
  ctx.font = `800 ${r * 0.34}px ${FONT}`;
  ctx.fillText(String(s.gear), cx, cy + r * 0.62);

  // Needle
  const a = DIAL_START + DIAL_SWEEP * Math.min(1, Math.max(0, s.rpm / 1000 / TACH_MAX));
  ctx.lineCap = 'round';
  ctx.strokeStyle = s.rpm > s.redline - 250 ? '#ff1a1a' : '#d0021b';
  ctx.lineWidth = r * 0.05;
  ctx.beginPath();
  ctx.moveTo(cx - Math.cos(a) * r * 0.15, cy - Math.sin(a) * r * 0.15);
  ctx.lineTo(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86);
  ctx.stroke();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.09, 0, Math.PI * 2);
  ctx.fill();

  // Left screen (its upper outer corner is behind the wheel rim, so the content sits low and
  // towards the dial): speed, a speed bar and the odometer
  const L = 46;
  ctx.fillStyle = '#f8fafc';
  ctx.font = `800 17px ${FONT}`;
  ctx.fillText(String(Math.round(s.speedKmh)), L, 41);
  ctx.fillStyle = '#1e293b';
  panel(ctx, L - 22, 59, 44, 2.2, 1.1);
  ctx.fill();
  ctx.fillStyle = s.accent;
  panel(ctx, L - 22, 59, 44 * Math.min(1, s.speedKmh / (s.speedoMax || 320)), 2.2, 1.1);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 4.4px ${FONT}`;
  ctx.fillText(`${Math.floor(s.odometerKm)} km`, L, 68);
  if (s.highBeam) {
    ctx.fillStyle = '#3b82f6';
    ctx.font = `800 6px ${FONT}`;
    ctx.fillText('≡D', L + 22, 30);
  }

  // Right screen, likewise low and inwards: the radio and the drive mode
  const R = 190;
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 4.2px ${FONT}`;
  ctx.fillText('RADYO', R, 37);
  ctx.fillStyle = s.radio?.active ? '#f8fafc' : '#64748b';
  ctx.font = `700 5.4px ${FONT}`;
  const title = s.radio?.active ? s.radio.title || 'Çalıyor' : 'Kapalı';
  ctx.fillText(title.length > 16 ? `${title.slice(0, 15)}…` : title, R, 45);
  ctx.fillStyle = '#facc15';
  ctx.font = `800 5.4px ${FONT}`;
  ctx.fillText('SPORT', R, 60);
  ctx.fillStyle = '#334155';
  panel(ctx, R - 16, 64, 32, 1.6, 0.8);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  panel(ctx, R + 2, 64, 8, 1.6, 0.8);
  ctx.fill();
}

// ---------------------------------------------------------------- Centre screen

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Map, cards and labels that never change
function drawCenterBase(c, w, h) {
  c.fillStyle = '#07090c';
  c.fillRect(0, 0, w, h);

  // Navigation map (left 60%)
  const mx = 3;
  const my = 12;
  const mw = 140;
  const mh = h - 15;
  c.save();
  panel(c, mx, my, mw, mh, 4);
  c.clip();
  c.fillStyle = '#1a1f27';
  c.fillRect(mx, my, mw, mh);
  const rand = mulberry32(7);
  // City blocks and a river
  c.fillStyle = '#20262f';
  for (let i = 0; i < 26; i++) c.fillRect(mx + rand() * mw, my + rand() * mh, 8 + rand() * 16, 6 + rand() * 12);
  c.strokeStyle = '#1d3a52';
  c.lineWidth = 7;
  c.beginPath();
  c.moveTo(mx - 5, my + mh * 0.25);
  c.bezierCurveTo(mx + mw * 0.3, my + mh * 0.05, mx + mw * 0.55, my + mh * 0.5, mx + mw + 5, my + mh * 0.3);
  c.stroke();
  // Streets
  c.strokeStyle = '#3a414c';
  c.lineWidth = 1.2;
  for (let i = 0; i < 14; i++) {
    c.beginPath();
    const vertical = i % 2 === 0;
    const p = rand();
    if (vertical) {
      c.moveTo(mx + p * mw, my);
      c.lineTo(mx + p * mw + (rand() - 0.5) * 30, my + mh);
    } else {
      c.moveTo(mx, my + p * mh);
      c.lineTo(mx + mw, my + p * mh + (rand() - 0.5) * 20);
    }
    c.stroke();
  }
  // Motorway and the route along it
  c.strokeStyle = '#6b7280';
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(mx + mw * 0.5, my + mh + 2);
  c.bezierCurveTo(mx + mw * 0.48, my + mh * 0.55, mx + mw * 0.62, my + mh * 0.35, mx + mw * 0.7, my - 2);
  c.stroke();
  c.strokeStyle = '#3b9cff';
  c.lineWidth = 2.4;
  c.stroke();
  // Car arrow
  const ax = mx + mw * 0.5;
  const ay = my + mh * 0.8;
  c.fillStyle = '#f8fafc';
  c.beginPath();
  c.moveTo(ax, ay - 5);
  c.lineTo(ax + 3.6, ay + 3.5);
  c.lineTo(ax, ay + 1.8);
  c.lineTo(ax - 3.6, ay + 3.5);
  c.closePath();
  c.fill();
  // Next manoeuvre
  c.fillStyle = 'rgba(7, 9, 12, 0.88)';
  panel(c, mx + 4, my + 4, 46, 17, 3);
  c.fill();
  c.strokeStyle = '#f8fafc';
  c.lineWidth = 1.6;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(mx + 11, my + 18);
  c.lineTo(mx + 11, my + 10);
  c.lineTo(mx + 15, my + 7.5);
  c.stroke();
  c.fillStyle = '#f8fafc';
  c.font = `700 6px ${FONT}`;
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  c.fillText('1,2 km', mx + 19, my + 10);
  c.fillStyle = '#94a3b8';
  c.font = `500 4.2px ${FONT}`;
  c.fillText('Otoyol devam', mx + 19, my + 16.5);
  c.restore();

  // Status bar
  c.fillStyle = '#e2e8f0';
  c.font = `italic 800 5.2px ${FONT}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText('FERRARI', w / 2, 6);
  c.fillStyle = '#94a3b8';
  c.font = `600 4.6px ${FONT}`;
  c.textAlign = 'right';
  c.fillText('21°C', w - 4, 6);

  // Media card
  const cx = 147;
  const cw = w - cx - 3;
  c.fillStyle = '#11151c';
  panel(c, cx, 12, cw, 50, 4);
  c.fill();
  const art = c.createLinearGradient(cx + 5, 17, cx + 25, 37);
  art.addColorStop(0, '#d0021b');
  art.addColorStop(1, '#5c0010');
  c.fillStyle = art;
  panel(c, cx + 5, 17, 20, 20, 2);
  c.fill();
  c.fillStyle = '#ffd84a';
  c.font = `800 9px ${FONT}`;
  c.textAlign = 'center';
  c.fillText('FM', cx + 15, 27.5);
  c.fillStyle = '#64748b';
  c.font = `600 4.2px ${FONT}`;
  c.textAlign = 'left';
  c.fillText('RADYO', cx + 29, 20);
  // Controls
  c.fillStyle = '#cbd5e1';
  const by = 52;
  for (const [dx, dir] of [[-14, -1], [14, 1]]) {
    const x = cx + cw / 2 + dx;
    c.beginPath();
    c.moveTo(x + dir * 3, by);
    c.lineTo(x - dir * 1, by - 3);
    c.lineTo(x - dir * 1, by + 3);
    c.closePath();
    c.fill();
    c.fillRect(x + dir * 3 - (dir > 0 ? 0 : 1), by - 3, 1, 6);
  }

  // Climate card
  c.fillStyle = '#11151c';
  panel(c, cx, 65, cw, h - 68, 4);
  c.fill();
  c.fillStyle = '#e2e8f0';
  c.font = `700 7px ${FONT}`;
  c.textAlign = 'left';
  c.fillText('22.0°', cx + 5, 76);
  c.textAlign = 'right';
  c.fillText('22.0°', cx + cw - 5, 76);
  c.fillStyle = '#3b9cff';
  c.font = `700 4.6px ${FONT}`;
  c.textAlign = 'center';
  c.fillText('AUTO', cx + cw / 2, 76);
  c.fillStyle = '#64748b';
  c.font = `600 4px ${FONT}`;
  c.fillText('KLİMA', cx + cw / 2, 89);
}

export function paintFerrariCenter(ctx, w, h, s) {
  const scale = Math.max(1, ctx.getTransform().a);
  ctx.drawImage(cached('ferrari-center', w, h, scale, (c) => drawCenterBase(c, w, h)), 0, 0, w, h);

  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = `700 4.8px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText(clock(), 4, 6);

  // Radio: what is playing, with a moving level bar while it plays
  const cx = 147;
  const playing = Boolean(s.radio?.active);
  const title = playing ? s.radio.title || 'Çalıyor' : 'Kapalı';
  ctx.fillStyle = playing ? '#f8fafc' : '#64748b';
  ctx.font = `700 5.6px ${FONT}`;
  ctx.fillText(title.length > 16 ? `${title.slice(0, 15)}…` : title, cx + 29, 28);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx + 29, 33, 56, 1.4);
  if (playing) {
    ctx.fillStyle = '#d0021b';
    ctx.fillRect(cx + 29, 33, 56 * ((performance.now() / 60000) % 1), 1.4);
  }
  // Play / pause between the skip buttons
  const px = cx + (240 - cx - 3) / 2;
  ctx.fillStyle = '#f8fafc';
  if (playing) {
    ctx.fillRect(px - 2.4, 49, 1.6, 6);
    ctx.fillRect(px + 0.8, 49, 1.6, 6);
  } else {
    ctx.beginPath();
    ctx.moveTo(px - 2, 49);
    ctx.lineTo(px + 3, 52);
    ctx.lineTo(px - 2, 55);
    ctx.closePath();
    ctx.fill();
  }

  // Speed on the map
  ctx.fillStyle = 'rgba(7, 9, 12, 0.88)';
  panel(ctx, 118, 81, 22, 13, 3);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = `800 6px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(String(Math.round(s.speedKmh)), 129, 86);
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 3.4px ${FONT}`;
  ctx.fillText('km/h', 129, 91);
}
