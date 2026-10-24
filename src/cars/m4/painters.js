// BMW M4 artwork redrawn sharp over the cockpit atlas (see applyAtlasPatch in cockpitDecals.js)
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function wavyArrows(ctx, cx, top, bottom, spread, count = 3) {
  for (let i = 0; i < count; i++) {
    const x = cx + (i - (count - 1) / 2) * spread;
    ctx.beginPath();
    for (let y = bottom; y >= top + 4; y -= 1) {
      const px = x + Math.sin((y - bottom) * 0.35) * spread * 0.18;
      if (y === bottom) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
  }
}

// BMW-style climate/hazard button row below the centre vents (layout follows the atlas dots)
export function paintBmwClimateRow(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#16181c');
  bg.addColorStop(0.5, '#0a0b0d');
  bg.addColorStop(1, '#121417');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(190,198,210,0.55)';
  ctx.fillRect(0, h * 0.04, w, Math.max(1, h * 0.025));
  ctx.fillRect(0, h * 0.93, w, Math.max(1, h * 0.02));

  const bw = w * 0.1;
  const bh = h * 0.6;
  const by = (h - bh) / 2;
  const lw = Math.max(1.5, h * 0.035);
  const slots = [
    [0.28, 'rear'],
    [0.41, 'front'],
    [0.535, 'hazard'],
    [0.66, 'ac'],
    [0.78, 'fan'],
    [0.9, 'auto'],
  ];
  for (const [f, kind] of slots) {
    const cx = w * f;
    const x = cx - bw / 2;
    const face = ctx.createLinearGradient(0, by, 0, by + bh);
    face.addColorStop(0, '#2a2e35');
    face.addColorStop(1, '#0d0f12');
    roundRect(ctx, x, by, bw, bh, bh * 0.22);
    ctx.fillStyle = face;
    ctx.fill();
    ctx.strokeStyle = 'rgba(205,212,222,0.75)';
    ctx.lineWidth = Math.max(1, h * 0.018);
    ctx.stroke();

    ctx.strokeStyle = '#f1f4f8';
    ctx.fillStyle = '#f1f4f8';
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const iy = by + bh * 0.52;
    const s = bh * 0.3;
    if (kind === 'hazard') {
      ctx.strokeStyle = '#ff3b30';
      for (const k of [1, 0.5]) {
        ctx.beginPath();
        ctx.moveTo(cx, iy - s * k);
        ctx.lineTo(cx + s * 1.1 * k, iy + s * 0.75 * k);
        ctx.lineTo(cx - s * 1.1 * k, iy + s * 0.75 * k);
        ctx.closePath();
        ctx.stroke();
      }
    } else if (kind === 'rear') {
      ctx.strokeRect(cx - s * 1.1, iy - s * 0.15, s * 2.2, s * 0.9);
      ctx.lineWidth = lw * 0.8;
      wavyArrows(ctx, cx, iy - s * 0.95, iy - s * 0.25, s * 0.6);
    } else if (kind === 'front') {
      ctx.beginPath();
      ctx.moveTo(cx - s * 1.2, iy + s * 0.75);
      ctx.quadraticCurveTo(cx, iy - s * 0.1, cx + s * 1.2, iy + s * 0.75);
      ctx.stroke();
      ctx.lineWidth = lw * 0.8;
      wavyArrows(ctx, cx, iy - s * 0.95, iy + s * 0.25, s * 0.6);
    } else if (kind === 'ac') {
      ctx.font = `700 ${bh * 0.36}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('A/C', cx, iy + bh * 0.04);
    } else if (kind === 'auto') {
      ctx.font = `700 ${bh * 0.3}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AUTO', cx, iy + bh * 0.04);
    } else if (kind === 'fan') {
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 + 0.4;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(a) * s * 0.5, iy + Math.sin(a) * s * 0.5, s * 0.5, s * 0.22, a, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // Status LED (A/C and AUTO on)
    if (kind === 'ac' || kind === 'auto') {
      ctx.fillStyle = '#ffb547';
      ctx.fillRect(cx - bw * 0.14, by + bh * 0.1, bw * 0.28, Math.max(1.5, bh * 0.06));
    }
  }
}

// Door opener panel: crisp lock buttons over the smoothly upscaled atlas. Positions are the two
// lock dots read off the source texture.
export function paintBmwDoorLocks(ctx, w, h, at) {
  const r = at(0, 0.0032)[1] - at(0, 0)[1];
  for (const [u, v, locked] of [[0.2552, 0.1928, true], [0.2588, 0.1985, false]]) {
    const [cx, cy] = at(u, v);
    roundRect(ctx, cx - r, cy - r * 0.8, r * 2, r * 1.6, r * 0.35);
    ctx.fillStyle = '#1b1e23';
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,206,215,0.8)';
    ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.stroke();
    // Padlock glyph
    ctx.strokeStyle = '#f1f4f8';
    ctx.fillStyle = '#f1f4f8';
    ctx.lineWidth = Math.max(1, r * 0.13);
    ctx.fillRect(cx - r * 0.38, cy - r * 0.05, r * 0.76, r * 0.55);
    ctx.beginPath();
    if (locked) ctx.arc(cx, cy - r * 0.05, r * 0.27, Math.PI, 0);
    else ctx.arc(cx + r * 0.25, cy - r * 0.05, r * 0.27, Math.PI, -0.3);
    ctx.stroke();
  }
}

// Steering wheel roundel, drawn to fill the atlas circle it replaces
export function paintBmwRoundel(ctx, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0b0c0e';
  ctx.fillRect(0, 0, w, h);

  const chrome = (r0, r1) => {
    const g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    g.addColorStop(0, '#f4f6f8');
    g.addColorStop(0.5, '#8d949d');
    g.addColorStop(1, '#e3e7eb');
    ctx.beginPath();
    ctx.arc(cx, cy, r0, 0, Math.PI * 2);
    ctx.arc(cx, cy, r1, 0, Math.PI * 2, true);
    ctx.fillStyle = g;
    ctx.fill();
  };
  chrome(R * 0.99, R * 0.93);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.93, 0, Math.PI * 2);
  ctx.fillStyle = '#0d0e10';
  ctx.fill();

  // Letters on the black ring, centred on the top
  const letterR = R * 0.76;
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${R * 0.27}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  [['B', -0.68], ['M', 0], ['W', 0.68]].forEach(([ch, a]) => {
    ctx.save();
    ctx.translate(cx + Math.sin(a) * letterR, cy - Math.cos(a) * letterR);
    ctx.rotate(a);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  chrome(R * 0.6, R * 0.55);
  const r = R * 0.55;
  const quads = [
    [-Math.PI, -Math.PI / 2, '#1c69d4'],
    [-Math.PI / 2, 0, '#ffffff'],
    [0, Math.PI / 2, '#1c69d4'],
    [Math.PI / 2, Math.PI, '#ffffff'],
  ];
  for (const [a0, a1, col] of quads) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
  }
}
