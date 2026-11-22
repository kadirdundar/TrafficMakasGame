import { MISSIONS_BONUS } from './config.js';
import { missionProgressText, missionText } from './daily.js';

// Menu side of the daily goals (src/progression/daily.js): the missions block on the home screen
// and the login reward card that comes up once a day when the menu opens.

const fmt = (n) => Math.round(n).toLocaleString('tr-TR');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Time until the missions change, at local midnight: "5 sa 12 dk"
function untilMidnight(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const min = Math.max(1, Math.round((next - now) / 60000));
  const h = Math.floor(min / 60);
  return h > 0 ? `${h} sa ${min % 60} dk` : `${min} dk`;
}

export class DailyGoalsUI {
  // onClaim(coins): the login reward was just taken
  constructor(daily, { onClaim } = {}) {
    this.daily = daily;
    this.onClaim = onClaim;
    this.listEl = document.getElementById('daily-missions');
    this.metaEl = document.getElementById('daily-meta');
    this.footEl = document.getElementById('daily-foot');
    this.overlay = document.getElementById('daily-reward-overlay');
    document.getElementById('btn-daily-claim')?.addEventListener('click', () => this.claim());
  }

  render() {
    this.daily.refresh();
    const missions = this.daily.missions();
    const done = this.daily.doneCount();
    const { claimable, day } = this.daily.streak();
    const streak = claimable ? day - 1 : day;
    if (this.metaEl) {
      this.metaEl.textContent = `${done}/${missions.length}${streak > 1 ? ` · 🔥 ${streak} gün` : ''}`;
    }
    this.listEl?.replaceChildren(
      ...missions.map((m) => {
        const row = el('li', `daily-mission${m.done ? ' done' : ''}`);
        row.style.setProperty('--p', String(Math.min(1, m.progress / m.goal)));
        const copy = el('span', 'daily-copy');
        copy.append(el('strong', '', missionText(m)), el('small', '', m.done ? 'Tamamlandı' : missionProgressText(m)));
        row.append(el('span', 'daily-check', m.done ? '✓' : ''), copy, el('span', 'daily-reward', `+${fmt(m.reward)}`));
        return row;
      })
    );
    if (this.footEl) {
      this.footEl.textContent =
        done === missions.length
          ? `Bugünkü görevler bitti · yenileri ${untilMidnight()} sonra`
          : `Hepsini bitirene +${fmt(MISSIONS_BONUS)} bonus · yenileri ${untilMidnight()} sonra`;
    }
  }

  // The login reward card, when today's reward has not been taken yet
  maybeShowReward() {
    const s = this.daily.streak();
    if (!s.claimable || !this.overlay) return false;
    this.setText('daily-reward-sub', s.day > 1 ? `${s.day}. gün üst üste` : 'İlk gün · her gün daha fazlası');
    const days = document.getElementById('streak-days');
    const today = Math.min(s.day, s.rewards.length);
    days?.replaceChildren(
      ...s.rewards.map((reward, i) => {
        const n = i + 1;
        const state = n < today ? ' taken' : n === today ? ' today' : '';
        const item = el('li', `streak-day${state}`);
        item.append(el('small', '', `${n}. gün`), el('b', '', fmt(reward)));
        return item;
      })
    );
    this.setText('daily-claim-label', `TOPLA +${fmt(s.reward)}`);
    this.overlay.classList.remove('hidden');
    return true;
  }

  claim() {
    const coins = this.daily.claimStreak();
    this.overlay?.classList.add('hidden');
    this.render();
    if (coins > 0) this.onClaim?.(coins);
  }

  setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }
}
