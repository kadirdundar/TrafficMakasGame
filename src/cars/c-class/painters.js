// Mercedes W206 steering wheel controls redrawn sharp (see applyAtlasPatch in cockpitDecals.js).
// The export lost the button symbol texture, so the 16 button faces (w206_simbs) were plain black.
// The patch maps them planarly onto the wheel face; the slots below are their corners on that
// unit square (u to the driver's right, v down), measured from c-class-cockpit.glb.

const SLOTS = [
  // Left spoke, top row: back, touch control, home (instrument cluster)
  { icon: 'back', poly: [[0.04, 0.432], [0.062, 0.43], [0.039, 0.405], [0.059, 0.402]] },
  { icon: 'touch', poly: [[0.082, 0.424], [0.115, 0.419], [0.125, 0.397], [0.093, 0.401], [0.13, 0.388], [0.098, 0.392]] },
  { icon: 'home', poly: [[0.177, 0.414], [0.172, 0.386], [0.145, 0.418], [0.141, 0.391]] },
  // Left spoke, bottom: cruise control and DISTRONIC
  { icon: 'lim', poly: [[0, 0.594], [0.001, 0.614], [0.041, 0.588], [0.043, 0.608]] },
  { icon: 'distance', poly: [[0.025, 0.562], [0.048, 0.559], [0.021, 0.542], [0.044, 0.539]] },
  { icon: 'plusMinus', poly: [[0.119, 0.572], [0.083, 0.577], [0.075, 0.6], [0.112, 0.595], [0.095, 0.533], [0.13, 0.529]] },
  { icon: 'res', poly: [[0.163, 0.513], [0.168, 0.548], [0.199, 0.508], [0.203, 0.543]] },
  { icon: 'cruise', poly: [[0.174, 0.598], [0.205, 0.594], [0.171, 0.564], [0.199, 0.56]] },
  // Right spoke, top row: home, touch control, back (central display)
  { icon: 'home', poly: [[0.828, 0.386], [0.823, 0.414], [0.855, 0.418], [0.859, 0.391]] },
  { icon: 'touch', poly: [[0.918, 0.424], [0.875, 0.397], [0.885, 0.419], [0.907, 0.401], [0.87, 0.388], [0.902, 0.392]] },
  { icon: 'back', poly: [[0.941, 0.402], [0.937, 0.43], [0.961, 0.405], [0.96, 0.432]] },
  // Right spoke, bottom: phone, voice, volume, favourite, mute
  { icon: 'phone', poly: [[0.796, 0.543], [0.832, 0.548], [0.801, 0.508], [0.837, 0.513]] },
  { icon: 'voice', poly: [[0.801, 0.56], [0.795, 0.594], [0.829, 0.564], [0.826, 0.598]] },
  { icon: 'plusMinus', poly: [[0.881, 0.572], [0.925, 0.6], [0.917, 0.577], [0.888, 0.595], [0.905, 0.533], [0.87, 0.529]] },
  { icon: 'star', poly: [[0.956, 0.539], [0.952, 0.559], [0.978, 0.542], [0.975, 0.562]] },
  { icon: 'mute', poly: [[0.957, 0.608], [0.999, 0.614], [0.959, 0.588], [1, 0.594]] },
];

// Convex outline of a slot's corners (the source corners come unordered)
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => {
    const out = [];
    for (const q of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return [...half(p), ...half([...p].reverse())];
}

const ICONS = {
  back(ctx, s) {
    ctx.beginPath();
    ctx.arc(0.05 * s, 0.05 * s, 0.3 * s, Math.PI * 1.05, Math.PI * 0.35, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-0.42 * s, -0.12 * s);
    ctx.lineTo(-0.25 * s, 0.08 * s);
    ctx.lineTo(-0.07 * s, -0.1 * s);
    ctx.stroke();
  },
  home(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-0.36 * s, 0);
    ctx.lineTo(0, -0.34 * s);
    ctx.lineTo(0.36 * s, 0);
    ctx.moveTo(-0.24 * s, -0.08 * s);
    ctx.lineTo(-0.24 * s, 0.3 * s);
    ctx.lineTo(0.24 * s, 0.3 * s);
    ctx.lineTo(0.24 * s, -0.08 * s);
    ctx.stroke();
  },
  // Capacitive pad: a glossy field with a thin silver ring, no symbol
  touch(ctx, s) {
    ctx.save();
    ctx.lineWidth *= 0.7;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(0, 0, 0.42 * s, 0.3 * s, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
  plusMinus(ctx, s) {
    const l = 0.16 * s;
    ctx.beginPath();
    ctx.moveTo(-l, -0.22 * s);
    ctx.lineTo(l, -0.22 * s);
    ctx.moveTo(0, -0.22 * s - l);
    ctx.lineTo(0, -0.22 * s + l);
    ctx.moveTo(-l, 0.24 * s);
    ctx.lineTo(l, 0.24 * s);
    ctx.stroke();
  },
  res(ctx, s) {
    ctx.font = `600 ${0.42 * s}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RES', 0, 0.02 * s);
  },
  lim(ctx, s) {
    ctx.font = `600 ${0.4 * s}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LIM', 0, 0.02 * s);
  },
  // Speedometer with a needle (cruise control on/off)
  cruise(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0.1 * s, 0.32 * s, Math.PI * 0.95, Math.PI * 2.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0.1 * s);
    ctx.lineTo(0.2 * s, -0.12 * s);
    ctx.stroke();
  },
  // DISTRONIC distance: a car above stacked bars
  distance(ctx, s) {
    ctx.beginPath();
    ctx.roundRect(-0.2 * s, -0.36 * s, 0.4 * s, 0.2 * s, 0.05 * s);
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const y = (-0.02 + i * 0.14) * s;
      const w = (0.18 + i * 0.07) * s;
      ctx.beginPath();
      ctx.moveTo(-w, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  },
  phone(ctx, s) {
    ctx.save();
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.roundRect(-0.38 * s, -0.1 * s, 0.76 * s, 0.2 * s, 0.08 * s);
    ctx.fill();
    ctx.fillRect(-0.4 * s, -0.02 * s, 0.16 * s, 0.22 * s);
    ctx.fillRect(0.24 * s, -0.02 * s, 0.16 * s, 0.22 * s);
    ctx.restore();
  },
  // Talking head (voice control)
  voice(ctx, s) {
    ctx.beginPath();
    ctx.arc(-0.1 * s, -0.08 * s, 0.17 * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-0.1 * s, 0.4 * s, 0.26 * s, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    for (const r of [0.12, 0.22]) {
      ctx.beginPath();
      ctx.arc(0.12 * s, -0.08 * s, r * s, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
    }
  },
  star(ctx, s) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = (i % 2 ? 0.15 : 0.36) * s;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.stroke();
  },
  mute(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-0.34 * s, -0.1 * s);
    ctx.lineTo(-0.2 * s, -0.1 * s);
    ctx.lineTo(0, -0.28 * s);
    ctx.lineTo(0, 0.28 * s);
    ctx.lineTo(-0.2 * s, 0.1 * s);
    ctx.lineTo(-0.34 * s, 0.1 * s);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0.1 * s, -0.12 * s);
    ctx.lineTo(0.32 * s, 0.12 * s);
    ctx.moveTo(0.32 * s, -0.12 * s);
    ctx.lineTo(0.1 * s, 0.12 * s);
    ctx.stroke();
  },
};

// Gloss black button faces with white symbols, each fitted into its slot
export function paintMercedesWheelButtons(ctx, w, h) {
  for (const { icon, poly } of SLOTS) {
    const pts = hull(poly).map(([u, v]) => [u * w, v * h]);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    // Slanted pads: the symbol fits the narrower side
    const s = Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 0.9;

    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    const face = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys));
    face.addColorStop(0, '#2a2c31');
    face.addColorStop(0.45, '#0c0d10');
    face.addColorStop(1, '#16171b');
    ctx.fillStyle = face;
    ctx.fill();
    ctx.strokeStyle = 'rgba(150,156,166,0.55)';
    ctx.lineWidth = Math.max(1, s * 0.05);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = '#eceef2';
    ctx.fillStyle = '#eceef2';
    ctx.lineWidth = Math.max(1.5, s * 0.085);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ICONS[icon](ctx, s);
    ctx.restore();
  }
}
