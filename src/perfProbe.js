// Performance probe for measuring the game on real phones (iPhone / TestFlight testers).
// Armed by tapping the home screen logo 5 times (or ?perf in the URL). It then records 60 s of
// driving — paused time does not count — and shows a one-line JSON summary to copy and paste
// into docs/performans-olcum.md. Nothing runs per frame while it is not armed.

const DURATION_SEC = 60;
// The first seconds of a drive compile shaders and fill caches: measured separately as `startHitch`
const WARMUP_SEC = 3;
const MAX_SAMPLES = 60 * 150; // room for 150 Hz over the whole run
const SECRET_TAPS = 5;
const SECRET_WINDOW_MS = 2500;

export class PerfProbe {
  // renderer: the main THREE.WebGLRenderer (its info counts both the mirror and main passes).
  // describe(): what is being driven (car, road, weather, ...), stored with the result.
  // onDone(): called when the 60 s are up (the game pauses so the card can be read).
  constructor({ renderer, describe, onDone }) {
    this.renderer = renderer;
    this.describe = describe;
    this.onDone = onDone;
    this.state = 'off'; // 'off' | 'armed' | 'recording' | 'done'
    this.frameMs = new Float32Array(MAX_SAMPLES);
    this.workMs = new Float32Array(MAX_SAMPLES);
    this.badge = null;
    this.card = null;
    this.lastBadgeSec = -1;
  }

  // Five quick taps on `el` arm the probe (a hidden gesture, so testers do not find it by accident)
  bindSecretTap(el) {
    if (!el) return;
    let taps = [];
    el.addEventListener('click', () => {
      const now = performance.now();
      taps = taps.filter((t) => now - t < SECRET_WINDOW_MS);
      taps.push(now);
      if (taps.length >= SECRET_TAPS) {
        taps = [];
        this.arm();
      }
    });
  }

  arm() {
    this.closeCard();
    this.state = 'armed';
    this.n = 0;
    this.drivenSec = 0;
    this.warmMaxMs = 0;
    this.calls = { sum: 0, max: 0 };
    this.tris = { sum: 0, max: 0 };
    this.ratio = { start: null, min: Infinity, end: null, drops: 0, last: null };
    this.lastBadgeSec = -1;
    this.showBadge('⏱ Ölçüm hazır · bir sürüş başlat');
  }

  // Called once per driven frame, after both render passes. frameSec: time since the previous
  // frame; workMs: JS time spent on this frame (physics + submitting draw calls; the GPU runs
  // after it, so a frame can be slow while workMs is small — that means the GPU is the limit).
  frame(frameSec, workMs, pixelRatio) {
    if (this.state !== 'armed' && this.state !== 'recording') return;
    if (frameSec > 1) return; // app was in the background
    if (this.state === 'armed') {
      this.state = 'recording';
      this.startedAt = new Date().toISOString();
    }

    this.drivenSec += frameSec;
    if (this.drivenSec <= WARMUP_SEC) {
      this.warmMaxMs = Math.max(this.warmMaxMs, frameSec * 1000);
      this.updateBadge();
      return;
    }

    if (this.n < MAX_SAMPLES) {
      this.frameMs[this.n] = frameSec * 1000;
      this.workMs[this.n] = workMs;
      this.n += 1;
    }
    const info = this.renderer.info.render;
    this.calls.sum += info.calls;
    this.calls.max = Math.max(this.calls.max, info.calls);
    this.tris.sum += info.triangles;
    this.tris.max = Math.max(this.tris.max, info.triangles);

    const r = this.ratio;
    if (r.start === null) r.start = pixelRatio;
    if (r.last !== null && pixelRatio < r.last) r.drops += 1;
    r.last = pixelRatio;
    r.min = Math.min(r.min, pixelRatio);
    r.end = pixelRatio;

    this.updateBadge();
    if (this.drivenSec >= DURATION_SEC + WARMUP_SEC) this.finish();
  }

  updateBadge() {
    const left = Math.max(0, Math.ceil(DURATION_SEC + WARMUP_SEC - this.drivenSec));
    if (left === this.lastBadgeSec) return;
    this.lastBadgeSec = left;
    this.showBadge(`⏱ Ölçülüyor · ${left} sn`);
  }

  finish() {
    this.state = 'done';
    this.hideBadge();
    this.result = this.summarize();
    console.info('[perf]', JSON.stringify(this.result));
    this.onDone?.();
    this.showCard(this.result);
  }

  summarize() {
    const n = this.n;
    const frames = Array.from(this.frameMs.subarray(0, n)).sort((a, b) => a - b);
    const work = Array.from(this.workMs.subarray(0, n)).sort((a, b) => a - b);
    const pct = (arr, p) => (arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * p))] : 0);
    const sum = (arr) => arr.reduce((s, v) => s + v, 0);
    const r1 = (v) => Math.round(v * 10) / 10;
    const totalMs = sum(frames);

    // Average FPS per third of the run: a falling trend points at the phone heating up
    const thirds = [0, 1, 2].map((i) => {
      const part = this.frameMs.subarray(Math.floor((n * i) / 3), Math.floor((n * (i + 1)) / 3));
      const ms = sum(part);
      return ms > 0 ? r1((part.length * 1000) / ms) : 0;
    });

    const memory = this.renderer.info.memory;
    const heap = performance.memory?.usedJSHeapSize;
    const ua = navigator.userAgent;
    const ios = ua.match(/OS (\d+)_(\d+)/);

    return {
      v: 1,
      at: this.startedAt,
      os: ios ? `iOS ${ios[1]}.${ios[2]}` : navigator.platform || '?',
      app: window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches ? 'pwa' : 'tarayici',
      screen: `${screen.width}x${screen.height}@${window.devicePixelRatio || 1}`,
      gpu: gpuName(this.renderer),
      ...this.describe?.(),
      sec: Math.round(totalMs / 1000),
      fps: { avg: r1((n * 1000) / (totalMs || 1)), low1: r1(1000 / (pct(frames, 0.99) || 1)), thirds },
      frameMs: { p50: r1(pct(frames, 0.5)), p95: r1(pct(frames, 0.95)), p99: r1(pct(frames, 0.99)), max: r1(frames[n - 1] || 0) },
      workMs: { avg: r1(sum(work) / (n || 1)), p95: r1(pct(work, 0.95)) },
      hitches: {
        over33: frames.filter((f) => f > 33.4).length,
        over50: frames.filter((f) => f > 50).length,
        over100: frames.filter((f) => f > 100).length,
        startMax: r1(this.warmMaxMs),
      },
      pixelRatio: { start: this.ratio.start, min: this.ratio.min, end: this.ratio.end, drops: this.ratio.drops },
      draws: { avg: Math.round(this.calls.sum / (n || 1)), max: this.calls.max },
      tris: { avg: Math.round(this.tris.sum / (n || 1)), max: this.tris.max },
      mem: {
        geometries: memory.geometries,
        textures: memory.textures,
        programs: this.renderer.info.programs?.length ?? null,
        heapMB: heap ? Math.round(heap / 1048576) : null,
      },
    };
  }

  showBadge(text) {
    if (!this.badge) {
      this.badge = document.createElement('div');
      this.badge.className = 'perf-probe-badge';
      document.body.appendChild(this.badge);
    }
    this.badge.textContent = text;
  }

  hideBadge() {
    this.badge?.remove();
    this.badge = null;
  }

  showCard(result) {
    this.closeCard();
    const json = JSON.stringify(result);
    const card = document.createElement('div');
    card.className = 'perf-probe-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Performans ölçümü sonucu');

    const rows = [
      ['Ortalama FPS', result.fps.avg],
      ['En kötü %1 FPS', result.fps.low1],
      ['FPS (ilk / orta / son üçte bir)', result.fps.thirds.join(' / ')],
      ['Kare süresi p95 / maks (ms)', `${result.frameMs.p95} / ${result.frameMs.max}`],
      ['JS iş süresi ort / p95 (ms)', `${result.workMs.avg} / ${result.workMs.p95}`],
      ['Takılma >33 / >50 / >100 ms', `${result.hitches.over33} / ${result.hitches.over50} / ${result.hitches.over100}`],
      ['Çözünürlük (başta → en düşük)', `${result.pixelRatio.start}x → ${result.pixelRatio.min}x (${result.pixelRatio.drops} düşüş)`],
      ['Çizim çağrısı ort / maks', `${result.draws.avg} / ${result.draws.max}`],
      ['Üçgen ort', result.tris.avg.toLocaleString('tr-TR')],
    ];

    const title = document.createElement('h2');
    title.textContent = 'Performans ölçümü';
    const list = document.createElement('dl');
    for (const [k, v] of rows) {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = String(v);
      list.append(dt, dd);
    }
    const text = document.createElement('textarea');
    text.readOnly = true;
    text.value = json;
    text.rows = 3;

    const actions = document.createElement('div');
    actions.className = 'perf-probe-actions';
    const copy = button('Kopyala', async () => {
      try {
        await navigator.clipboard.writeText(json);
      } catch {
        text.select();
        document.execCommand('copy');
      }
      copy.textContent = 'Kopyalandı ✓';
    });
    const again = button('Tekrar ölç', () => this.arm());
    const close = button('Kapat', () => this.closeCard());
    actions.append(copy, again, close);

    card.append(title, list, text, actions);
    document.body.appendChild(card);
    this.card = card;
  }

  closeCard() {
    this.card?.remove();
    this.card = null;
  }
}

function button(label, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

// The GPU's name where the browser shares it (Safari says only "Apple GPU")
function gpuName(renderer) {
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER);
  } catch {
    return null;
  }
}
