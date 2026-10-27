// First-drive hints: three short steps (gas, steering, the first makas) shown in a bubble next
// to the control they are about. Each step ends when the player has done it, so a player who
// already knows the game is through in a few seconds. Shown once; Ayarlar can bring it back.

const STORAGE_KEY = 'otoban_coach_done';
const DONE_MESSAGE_MS = 2600;
// The third step ends on its own if no makas comes (empty road, slow driving)
const SCORE_STEP_TIMEOUT_S = 30;

const STEER_TEXT = {
  wheel: 'Sol başparmağını ekranda sağa sola kaydır, şerit değiştir',
  buttons: '◀ ▶ tuşlarına basılı tutarak şerit değiştir',
  tilt: 'Telefonu direksiyon gibi sağa sola eğ, şerit değiştir',
  keys: 'A / D ya da ← → ile şerit değiştir',
};

const SCORE_TEXT = {
  highway: '100+ km/sa hızla bir aracın yanından sıyırarak geç: MAKAS!',
  twoway: 'Karşı şeride çık, öndeki aracı solla ve şeridine dön!',
  track: 'Viraja yüksek hızda gir ve apex\'i yakala!',
};

export function coachDone() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch (_) {
    return true;
  }
}

export function resetCoach() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

export class FirstDriveCoach {
  constructor() {
    this.el = document.getElementById('coach');
    this.stepEl = document.getElementById('coach-step');
    this.textEl = document.getElementById('coach-text');
    this.swipeEl = document.getElementById('coach-swipe');
    this.steps = [];
    this.index = -1;
    this.target = null;
    this.doneTimer = null;
    document.getElementById('coach-skip')?.addEventListener('click', () => this.finish(false));
  }

  get active() {
    return this.index >= 0;
  }

  // touch: touch controls are in use; steerMode: 'wheel' | 'buttons' | 'tilt'; roadMode: the drive's road
  start({ touch, steerMode, roadMode }) {
    // A drive that starts again mid-hints (restart, a new road) puts the car back on its line:
    // that jump is not steering
    this.lastX = null;
    if (this.active || coachDone()) return;
    this.steps = [
      {
        text: touch ? 'Sağdaki pedalı yukarı it, gaz ver' : 'W ya da ↑ ile gaz ver',
        at: touch ? 'pedal' : 'center',
        target: touch ? 'touch-gas' : null,
        done: (s) => s.speedKmh >= 60,
      },
      {
        text: touch ? STEER_TEXT[steerMode] ?? STEER_TEXT.wheel : STEER_TEXT.keys,
        at: touch && steerMode !== 'tilt' ? 'steer' : 'center',
        target: touch && steerMode === 'buttons' ? 'button-steer-zone' : null,
        swipe: touch && steerMode === 'wheel',
        done: (s) => s.steered >= 3,
      },
      {
        text: SCORE_TEXT[roadMode] ?? SCORE_TEXT.highway,
        at: 'center',
        done: (s) => s.scored || s.stepTime >= SCORE_STEP_TIMEOUT_S,
      },
    ];
    this.lastX = null;
    this.show(0);
  }

  show(index) {
    this.index = index;
    this.stepTime = 0;
    this.steered = 0;
    this.scored = false;
    const step = this.steps[index];
    this.setTarget(step.target);
    this.stepEl.hidden = false;
    this.stepEl.textContent = `${index + 1}/${this.steps.length}`;
    this.textEl.textContent = step.text;
    this.el.dataset.at = step.at;
    this.el.classList.remove('hidden', 'done');
    this.swipeEl?.classList.toggle('hidden', !step.swipe);
    // Restart the entry animation for every step
    this.el.classList.remove('enter');
    void this.el.offsetWidth;
    this.el.classList.add('enter');
  }

  // Every drive frame: speed and how far the car has moved sideways (metres)
  update(dt, { speedKmh, playerX }) {
    if (!this.active) return;
    if (this.lastX !== null) this.steered += Math.abs(playerX - this.lastX);
    this.lastX = playerX;
    this.stepTime += dt;
    const step = this.steps[this.index];
    if (step.done({ speedKmh, steered: this.steered, scored: this.scored, stepTime: this.stepTime })) {
      if (this.index + 1 < this.steps.length) this.show(this.index + 1);
      else this.finish(true);
    }
  }

  // A makas, overtake or apex scored
  notifyScore() {
    if (this.active) this.scored = true;
  }

  finish(celebrate) {
    if (!this.active) return;
    this.index = -1;
    this.setTarget(null);
    this.swipeEl?.classList.add('hidden');
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (_) {}
    clearTimeout(this.doneTimer);
    if (!celebrate) {
      this.el.classList.add('hidden');
      return;
    }
    this.stepEl.hidden = true;
    this.textEl.textContent = 'Harika! Artık hazırsın, iyi sürüşler 🏁';
    this.el.dataset.at = 'center';
    this.el.classList.add('done');
    this.doneTimer = setTimeout(() => this.el.classList.add('hidden'), DONE_MESSAGE_MS);
  }

  setTarget(id) {
    this.target?.classList.remove('coach-target');
    this.target = id ? document.getElementById(id) : null;
    this.target?.classList.add('coach-target');
  }
}
