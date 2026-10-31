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

// Small symbols elsewhere in the cabin (w206_simbs without UVs): white glyphs only, the rest of
// each quad is cut away (alphaTest), as the source's transparent symbol texture did. Slot boxes
// [u0, v0, u1, v1] on each group's projected unit square, measured from c-class-cockpit.glb.
export const CABIN_SYMBOLS = {
  windows: [
    ['dot', [0.422, 0.000, 0.443, 0.022]],
    ['mirrorL', [0.387, 0.166, 0.443, 0.222]],
    ['mirrorR', [0.461, 0.166, 0.517, 0.222]],
    ['mirrorFold', [0.538, 0.166, 0.594, 0.222]],
    ['window', [0.387, 0.413, 0.466, 0.471]],
    ['window', [0.534, 0.413, 0.613, 0.471]],
    ['window', [0.387, 0.735, 0.467, 0.795]],
    ['window', [0.534, 0.735, 0.613, 0.795]],
    ['childLock', [0.388, 0.941, 0.468, 1.000]],
    ['windowLock', [0.522, 0.941, 0.600, 1.000]],
  ],
  doorDriver: [
    ['seat', [0.082, 0.302, 0.239, 0.461]],
    ['seatHeat', [0.377, 0.280, 0.534, 0.441]],
    ['seatVent', [0.682, 0.257, 0.839, 0.419]],
    ['M', [0.000, 0.565, 0.174, 0.743]],
    ['1', [0.280, 0.545, 0.454, 0.722]],
    ['2', [0.554, 0.528, 0.728, 0.705]],
    ['3', [0.826, 0.507, 1.000, 0.685]],
  ],
  locks: [
    ['lock', [0.085, 0.000, 0.416, 0.343]],
    ['unlock', [0.494, 0.550, 0.915, 1.000]],
  ],
  lights: [
    ['AUTO', [0.389, 0.000, 0.685, 0.094]],
    ['parking', [0.139, 0.144, 0.289, 0.290]],
    ['fogRear', [0.770, 0.117, 0.916, 0.264]],
    ['beamRange', [0.084, 0.343, 0.230, 0.493]],
    ['lowBeam', [0.477, 0.355, 0.717, 0.596]],
    ['highBeam', [0.424, 0.762, 0.664, 1.000]],
  ],
  start: [
    ['START STOP', [0.022, 0.000, 0.978, 0.443]],
    ['power', [0.360, 0.709, 0.656, 1.000]],
  ],
  centre: [
    ['bar', [0.000, 0.493, 0.106, 0.515]],
    ['camera', [0.158, 0.485, 0.195, 0.522]],
    ['P', [0.238, 0.485, 0.275, 0.522]],
    ['eco', [0.311, 0.484, 0.348, 0.521]],
    ['hazard', [0.450, 0.478, 0.494, 0.522]],
    ['vbar', [0.560, 0.479, 0.570, 0.523]],
    ['vbar', [0.642, 0.477, 0.652, 0.521]],
    ['mute', [0.702, 0.482, 0.739, 0.519]],
    ['dynamic', [0.823, 0.481, 0.860, 0.517]],
    ['fan', [0.913, 0.480, 1.000, 0.517]],
  ],
  overhead: [
    ['readL', [0.000, 0.292, 0.083, 0.340]],
    ['interior', [0.235, 0.286, 0.318, 0.336]],
    ['sunroof', [0.458, 0.273, 0.542, 0.347]],
    ['interiorOff', [0.682, 0.290, 0.765, 0.338]],
    ['readR', [0.917, 0.281, 1.000, 0.347]],
    ['SOS', [0.387, 0.636, 0.587, 0.727]],
  ],
  doorPassenger: [
    ['seat', [0.161, 0.258, 0.318, 0.418]],
    ['seatHeat', [0.761, 0.302, 0.918, 0.461]],
    ['M', [0.000, 0.508, 0.174, 0.685]],
    ['1', [0.272, 0.528, 0.446, 0.705]],
    ['2', [0.546, 0.545, 0.720, 0.722]],
    ['3', [0.826, 0.565, 1.000, 0.742]],
  ],
};

// Glyphs drawn around (0, 0) in a box of width w and height h (canvas pixels)
const lamp = (ctx, s, x = -0.1) => {
  ctx.beginPath();
  ctx.moveTo(x * s, -0.26 * s);
  ctx.quadraticCurveTo((x - 0.34) * s, 0, x * s, 0.26 * s);
  ctx.closePath();
  ctx.fill();
};
const rays = (ctx, s, slope, x0 = 0.02, len = 0.32) => {
  ctx.beginPath();
  for (const y of [-0.18, 0, 0.18]) {
    ctx.moveTo(x0 * s, y * s);
    ctx.lineTo((x0 + len) * s, (y + slope * len) * s);
  }
  ctx.stroke();
};
const seat = (ctx, s, x = 0) => {
  ctx.beginPath();
  ctx.moveTo((x - 0.08) * s, -0.4 * s);
  ctx.lineTo((x - 0.16) * s, 0.12 * s);
  ctx.lineTo((x + 0.24) * s, 0.12 * s);
  ctx.lineTo((x + 0.3) * s, 0.36 * s);
  ctx.stroke();
};
const mirror = (ctx, s) => {
  ctx.beginPath();
  ctx.roundRect(-0.36 * s, -0.22 * s, 0.6 * s, 0.4 * s, 0.14 * s);
  ctx.stroke();
};
const windowPane = (ctx, s) => {
  ctx.beginPath();
  ctx.moveTo(-0.38 * s, 0.3 * s);
  ctx.lineTo(-0.38 * s, -0.05 * s);
  ctx.lineTo(-0.1 * s, -0.32 * s);
  ctx.lineTo(0.38 * s, -0.32 * s);
  ctx.lineTo(0.38 * s, 0.3 * s);
  ctx.closePath();
  ctx.stroke();
};
const padlock = (ctx, s, open) => {
  ctx.fillRect(-0.26 * s, -0.04 * s, 0.52 * s, 0.38 * s);
  ctx.beginPath();
  ctx.arc(0, -0.08 * s, 0.17 * s, Math.PI, open ? Math.PI * 1.7 : Math.PI * 2);
  if (!open) ctx.lineTo(0.17 * s, -0.04 * s);
  ctx.moveTo(-0.17 * s, -0.08 * s);
  ctx.lineTo(-0.17 * s, -0.04 * s);
  ctx.stroke();
};
const bulb = (ctx, s, dx = 0) => {
  ctx.beginPath();
  ctx.arc(dx * s, -0.06 * s, 0.2 * s, Math.PI * 0.75, Math.PI * 2.25);
  ctx.lineTo((dx + 0.08) * s, 0.26 * s);
  ctx.lineTo((dx - 0.08) * s, 0.26 * s);
  ctx.closePath();
  ctx.stroke();
};
const slash = (ctx, s) => {
  ctx.beginPath();
  ctx.moveTo(-0.36 * s, 0.36 * s);
  ctx.lineTo(0.36 * s, -0.36 * s);
  ctx.stroke();
};

const GLYPHS = {
  dot: (ctx, s) => {
    ctx.beginPath();
    ctx.arc(0, 0, 0.3 * s, 0, Math.PI * 2);
    ctx.fill();
  },
  bar: (ctx, s, w, h) => ctx.fillRect(-w * 0.45, -h * 0.25, w * 0.9, h * 0.5),
  vbar: (ctx, s, w, h) => ctx.fillRect(-w * 0.3, -h * 0.4, w * 0.6, h * 0.8),
  mirrorL: (ctx, s) => {
    mirror(ctx, s);
    GLYPHS.text(ctx, s * 0.55, 'L', 0.05, 0);
  },
  mirrorR: (ctx, s) => {
    mirror(ctx, s);
    GLYPHS.text(ctx, s * 0.55, 'R', 0.05, 0);
  },
  mirrorFold: (ctx, s) => {
    mirror(ctx, s);
    ctx.beginPath();
    ctx.moveTo(0.18 * s, 0.34 * s);
    ctx.lineTo(-0.2 * s, 0.34 * s);
    ctx.lineTo(-0.08 * s, 0.24 * s);
    ctx.stroke();
  },
  window: (ctx, s) => {
    windowPane(ctx, s);
    ctx.beginPath();
    ctx.moveTo(0.1 * s, 0.18 * s);
    ctx.lineTo(0.1 * s, -0.16 * s);
    ctx.moveTo(-0.02 * s, -0.04 * s);
    ctx.lineTo(0.1 * s, -0.16 * s);
    ctx.lineTo(0.22 * s, -0.04 * s);
    ctx.stroke();
  },
  childLock: (ctx, s) => {
    windowPane(ctx, s);
    slash(ctx, s);
  },
  windowLock: (ctx, s) => {
    windowPane(ctx, s);
    padlock(ctx, s * 0.5, false);
  },
  seat: (ctx, s) => seat(ctx, s),
  seatHeat: (ctx, s) => {
    seat(ctx, s, -0.12);
    for (const x of [0.12, 0.26]) {
      ctx.beginPath();
      ctx.moveTo(x * s, -0.36 * s);
      ctx.bezierCurveTo((x + 0.08) * s, -0.24 * s, (x - 0.08) * s, -0.14 * s, x * s, -0.02 * s);
      ctx.stroke();
    }
  },
  seatVent: (ctx, s) => {
    seat(ctx, s, -0.12);
    for (const y of [-0.3, -0.16, -0.02]) {
      ctx.beginPath();
      ctx.moveTo(0.12 * s, y * s);
      ctx.lineTo(0.34 * s, y * s);
      ctx.stroke();
    }
  },
  lock: (ctx, s) => padlock(ctx, s, false),
  unlock: (ctx, s) => padlock(ctx, s, true),
  parking: (ctx, s) => {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.beginPath();
      ctx.arc(0.08 * s, 0, 0.14 * s, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      for (const y of [-0.12, 0, 0.12]) {
        ctx.moveTo(0.28 * s, y * s);
        ctx.lineTo(0.42 * s, y * 1.3 * s);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  fogRear: (ctx, s) => {
    ctx.save();
    ctx.scale(-1, 1);
    lamp(ctx, s, 0.1);
    ctx.restore();
    rays(ctx, s, 0, -0.42, 0.26);
    ctx.beginPath();
    ctx.moveTo(-0.3 * s, -0.3 * s);
    ctx.bezierCurveTo(-0.24 * s, -0.1 * s, -0.36 * s, 0.1 * s, -0.3 * s, 0.3 * s);
    ctx.stroke();
  },
  beamRange: (ctx, s) => {
    lamp(ctx, s);
    rays(ctx, s, 0.5);
  },
  lowBeam: (ctx, s) => {
    lamp(ctx, s);
    rays(ctx, s, 0.55);
  },
  highBeam: (ctx, s) => {
    lamp(ctx, s);
    rays(ctx, s, 0);
  },
  power: (ctx, s) => {
    ctx.beginPath();
    ctx.arc(0, 0.04 * s, 0.3 * s, -Math.PI * 0.32, Math.PI * 1.32);
    ctx.moveTo(0, -0.38 * s);
    ctx.lineTo(0, 0.02 * s);
    ctx.stroke();
  },
  camera: (ctx, s) => {
    ctx.beginPath();
    ctx.roundRect(-0.36 * s, -0.2 * s, 0.72 * s, 0.46 * s, 0.06 * s);
    ctx.moveTo(0.16 * s, 0.03 * s);
    ctx.arc(0, 0.03 * s, 0.16 * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillRect(-0.16 * s, -0.3 * s, 0.22 * s, 0.1 * s);
  },
  eco: (ctx, s) => {
    ctx.beginPath();
    ctx.arc(0, 0, 0.34 * s, -Math.PI * 0.35, Math.PI * 1.45);
    ctx.stroke();
    GLYPHS.text(ctx, s * 0.5, 'A', 0, 0.02);
  },
  hazard: (ctx, s) => {
    ctx.save();
    ctx.strokeStyle = '#ff3b30';
    for (const r of [0.4, 0.2]) {
      ctx.beginPath();
      ctx.moveTo(0, -r * s);
      ctx.lineTo(r * 0.92 * s, r * 0.62 * s);
      ctx.lineTo(-r * 0.92 * s, r * 0.62 * s);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  },
  mute: (ctx, s) => ICONS.mute(ctx, s),
  // DYNAMIC SELECT: a dial
  dynamic: (ctx, s) => {
    ctx.beginPath();
    ctx.arc(0, 0.1 * s, 0.32 * s, Math.PI * 0.95, Math.PI * 2.05);
    ctx.moveTo(0, 0.1 * s);
    ctx.lineTo(-0.16 * s, -0.12 * s);
    ctx.stroke();
  },
  fan: (ctx, s) => {
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.ellipse(0, -0.2 * s, 0.09 * s, 0.18 * s, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
  readL: (ctx, s) => bulb(ctx, s, 0.06),
  readR: (ctx, s) => bulb(ctx, s, -0.06),
  interior: (ctx, s) => {
    bulb(ctx, s);
    ctx.beginPath();
    for (const a of [-0.9, -0.5, -0.1]) {
      ctx.moveTo(Math.cos(a * Math.PI) * 0.3 * s, Math.sin(a * Math.PI) * 0.3 * s - 0.06 * s);
      ctx.lineTo(Math.cos(a * Math.PI) * 0.42 * s, Math.sin(a * Math.PI) * 0.42 * s - 0.06 * s);
    }
    ctx.stroke();
  },
  interiorOff: (ctx, s) => {
    bulb(ctx, s);
    slash(ctx, s);
  },
  sunroof: (ctx, s) => {
    ctx.beginPath();
    ctx.rect(-0.34 * s, -0.24 * s, 0.68 * s, 0.48 * s);
    ctx.moveTo(-0.16 * s, 0);
    ctx.lineTo(0.18 * s, 0);
    ctx.moveTo(0.06 * s, -0.1 * s);
    ctx.lineTo(0.18 * s, 0);
    ctx.lineTo(0.06 * s, 0.1 * s);
    ctx.stroke();
  },
  text(ctx, s, str, dx = 0, dy = 0, w = s) {
    const size = Math.min(s * 0.85, (w / Math.max(1, str.length)) * 1.6);
    ctx.font = `700 ${size}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, dx * s, dy * s + size * 0.04, w);
  },
};

// Painter for one CABIN_SYMBOLS group: transparent canvas, light glyphs in each slot box
export function cabinSymbolPainter(group) {
  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (const [name, [u0, v0, u1, v1]] of CABIN_SYMBOLS[group]) {
      const bw = (u1 - u0) * w;
      const bh = (v1 - v0) * h;
      const s = Math.min(bw, bh);
      ctx.save();
      ctx.translate(((u0 + u1) / 2) * w, ((v0 + v1) / 2) * h);
      ctx.strokeStyle = '#e4e7ec';
      ctx.fillStyle = '#e4e7ec';
      ctx.lineWidth = Math.max(1.5, s * 0.09);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (GLYPHS[name]) GLYPHS[name](ctx, s, bw, bh);
      else GLYPHS.text(ctx, bh, name, 0, 0, bw * 0.92);
      ctx.restore();
    }
  };
}
