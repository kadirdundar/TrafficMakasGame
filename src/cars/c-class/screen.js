// Mercedes W206 centre display (the tall MBUX touchscreen on the console), drawn into the 3D
// cockpit's screen canvas (car.js → cockpit.screenPainters.center; src/cockpit.js →
// paint3DScreen calls it in logical units, 200 x 221).
//
// A home screen as the car shows it on the move: clock and outside temperature on top, the
// navigation map with the route and our speed, what the radio plays, three app tiles and the
// climate bar. Highlights take the cabin's ambient colour (s.accent).

const FONT = 'system-ui, sans-serif';
const W = 200;
const H = 221;

const cache = new Map();
// Static layers are drawn once per size into an offscreen canvas at the screen's resolution
function cached(key, scale, draw) {
  const id = `${key}@${scale.toFixed(2)}`;
  let canvas = cache.get(id);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = Math.ceil(W * scale);
    canvas.height = Math.ceil(H * scale);
    const c = canvas.getContext('2d');
    c.scale(scale, scale);
    draw(c);
    cache.set(id, canvas);
  }
  return canvas;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function box(c, x, y, w, h, r = 4) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

const clock = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// Map, cards and tile frames: everything that does not change from frame to frame
const MAP = { x: 6, y: 18, w: 188, h: 104 };

function drawBase(c) {
  const bg = c.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0b0f17');
  bg.addColorStop(1, '#05070b');
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);

  // Navigation map
  const { x, y, w, h } = MAP;
  c.save();
  box(c, x, y, w, h, 6);
  c.clip();
  c.fillStyle = '#1b212b';
  c.fillRect(x, y, w, h);
  const rand = mulberry32(206);
  c.fillStyle = '#222935';
  for (let i = 0; i < 34; i++) c.fillRect(x + rand() * w, y + rand() * h, 8 + rand() * 18, 6 + rand() * 12);
  // A park and a lake
  c.fillStyle = '#1d3326';
  box(c, x + 18, y + 60, 34, 26, 6);
  c.fill();
  c.fillStyle = '#1b3550';
  c.beginPath();
  c.ellipse(x + 150, y + 22, 26, 13, -0.3, 0, Math.PI * 2);
  c.fill();
  // Streets
  c.strokeStyle = '#363e4b';
  c.lineWidth = 1.3;
  for (let i = 0; i < 16; i++) {
    const p = rand();
    c.beginPath();
    if (i % 2 === 0) {
      c.moveTo(x + p * w, y);
      c.lineTo(x + p * w + (rand() - 0.5) * 34, y + h);
    } else {
      c.moveTo(x, y + p * h);
      c.lineTo(x + w, y + p * h + (rand() - 0.5) * 24);
    }
    c.stroke();
  }
  // Motorway, and the route along it (Mercedes draws it in light blue)
  c.lineCap = 'round';
  c.strokeStyle = '#6b7280';
  c.lineWidth = 6;
  c.beginPath();
  c.moveTo(x + w * 0.5, y + h + 3);
  c.bezierCurveTo(x + w * 0.46, y + h * 0.55, x + w * 0.66, y + h * 0.42, x + w * 0.74, y - 3);
  c.stroke();
  c.strokeStyle = '#4aa8ff';
  c.lineWidth = 3.4;
  c.stroke();
  c.restore();

  // Next turn card on the map
  c.fillStyle = 'rgba(8, 11, 16, 0.9)';
  box(c, x + 6, y + 6, 74, 20, 4);
  c.fill();
  c.strokeStyle = '#f8fafc';
  c.lineWidth = 1.6;
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(x + 14, y + 22);
  c.lineTo(x + 14, y + 13);
  c.lineTo(x + 21, y + 13);
  c.stroke();
  c.beginPath();
  c.moveTo(x + 18.5, y + 10);
  c.lineTo(x + 22, y + 13);
  c.lineTo(x + 18.5, y + 16);
  c.stroke();
  c.textBaseline = 'middle';
  c.fillStyle = '#f8fafc';
  c.font = `700 6px ${FONT}`;
  c.fillText('2,4 km', x + 27, y + 12.5);
  c.fillStyle = '#94a3b8';
  c.font = `500 4.4px ${FONT}`;
  c.fillText('O-3 Otoyolu', x + 27, y + 20);

  // Our car on the route
  const ax = x + w * 0.5;
  const ay = y + h * 0.78;
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.moveTo(ax, ay - 6);
  c.lineTo(ax + 4.5, ay + 5);
  c.lineTo(ax, ay + 2.5);
  c.lineTo(ax - 4.5, ay + 5);
  c.closePath();
  c.fill();

  // Media card frame
  c.fillStyle = '#121822';
  box(c, 6, 127, 188, 34, 6);
  c.fill();
  // Album art: a soft gradient square
  const art = c.createLinearGradient(12, 132, 36, 156);
  art.addColorStop(0, '#2b3445');
  art.addColorStop(1, '#141a24');
  c.fillStyle = art;
  box(c, 12, 132, 24, 24, 4);
  c.fill();

  // App tiles
  const tiles = ['Navigasyon', 'Telefon', 'Araç'];
  tiles.forEach((label, i) => {
    const tx = 6 + i * 64;
    c.fillStyle = '#121822';
    box(c, tx, 166, 60, 30, 6);
    c.fill();
    c.fillStyle = '#cbd5e1';
    c.font = `600 4.6px ${FONT}`;
    c.textAlign = 'center';
    c.fillText(label, tx + 30, 189.5);
  });
  c.textAlign = 'left';

  // Climate bar
  c.fillStyle = '#0d1118';
  c.fillRect(0, 201, W, 20);
  c.strokeStyle = '#1e2633';
  c.lineWidth = 0.6;
  c.beginPath();
  c.moveTo(0, 201);
  c.lineTo(W, 201);
  c.stroke();
  c.fillStyle = '#f1f5f9';
  c.font = `700 7px ${FONT}`;
  c.fillText('21,5°', 8, 211.5);
  c.textAlign = 'right';
  c.fillText('21,5°', W - 8, 211.5);
  c.textAlign = 'center';
  c.fillStyle = '#94a3b8';
  c.font = `600 4.4px ${FONT}`;
  c.fillText('AUTO', W / 2, 211.5);
  c.textAlign = 'left';
}

// App tile icons in the accent colour
function drawTileIcons(ctx, accent) {
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Navigation: a pin
  ctx.beginPath();
  ctx.arc(36, 176, 3.6, Math.PI * 0.85, Math.PI * 0.15);
  ctx.lineTo(36, 183);
  ctx.closePath();
  ctx.stroke();
  // Phone: a handset
  ctx.beginPath();
  ctx.moveTo(95, 173.5);
  ctx.quadraticCurveTo(94, 180, 101, 183.5);
  ctx.stroke();
  ctx.fillRect(94, 172, 3, 3);
  ctx.fillRect(100.5, 181.5, 3, 3);
  // Car: a side outline
  ctx.beginPath();
  ctx.moveTo(156, 181);
  ctx.lineTo(156, 178);
  ctx.lineTo(160, 177);
  ctx.lineTo(163, 174);
  ctx.lineTo(170, 174);
  ctx.lineTo(173, 177);
  ctx.lineTo(176, 178);
  ctx.lineTo(176, 181);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(160.5, 181.5, 1.6, 0, Math.PI * 2);
  ctx.arc(171.5, 181.5, 1.6, 0, Math.PI * 2);
  ctx.fill();
}

export function paintMercedesCenter(ctx, w, h, s) {
  const scale = Math.max(1, ctx.getTransform().a);
  ctx.drawImage(cached('w206-center', scale, drawBase), 0, 0, w, h);
  const accent = s.accent || '#ff1e42';

  // Status bar: clock, the star, outside temperature
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = `700 6px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText(clock(), 8, 9);
  ctx.textAlign = 'right';
  ctx.fillText('18°C', w - 8, 9);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 4.6px ${FONT}`;
  ctx.fillText('MBUX', w / 2, 9);

  // Speed on the map
  ctx.fillStyle = 'rgba(8, 11, 16, 0.9)';
  box(ctx, MAP.x + 6, MAP.y + MAP.h - 26, 30, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = `800 8px ${FONT}`;
  ctx.fillText(String(Math.round(s.speedKmh || 0)), MAP.x + 21, MAP.y + MAP.h - 18.5);
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 3.8px ${FONT}`;
  ctx.fillText('km/h', MAP.x + 21, MAP.y + MAP.h - 11);

  // Radio: what is playing, with a moving progress bar while it plays
  const playing = Boolean(s.radio?.active);
  const title = playing ? s.radio.title || 'Çalıyor' : 'Radyo kapalı';
  ctx.textAlign = 'left';
  ctx.fillStyle = playing ? '#f8fafc' : '#64748b';
  ctx.font = `700 6px ${FONT}`;
  ctx.fillText(title.length > 24 ? `${title.slice(0, 23)}…` : title, 42, 139);
  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 4.4px ${FONT}`;
  ctx.fillText(playing ? 'Radyo' : 'Medya', 42, 147);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(42, 153, 120, 1.6);
  if (playing) {
    ctx.fillStyle = accent;
    ctx.fillRect(42, 153, 120 * ((performance.now() / 60000) % 1), 1.6);
  }
  // Play / pause
  ctx.fillStyle = '#f8fafc';
  const px = 178;
  if (playing) {
    ctx.fillRect(px - 3, 139, 2, 8);
    ctx.fillRect(px + 1, 139, 2, 8);
  } else {
    ctx.beginPath();
    ctx.moveTo(px - 2.5, 139);
    ctx.lineTo(px + 4, 143);
    ctx.lineTo(px - 2.5, 147);
    ctx.closePath();
    ctx.fill();
  }

  drawTileIcons(ctx, accent);

  // Fan level in the climate bar
  ctx.fillStyle = accent;
  for (let i = 0; i < 5; i++) ctx.fillRect(w / 2 - 22 + i * 4, 216, 2.6, 1.6);
  ctx.textAlign = 'left';
}
