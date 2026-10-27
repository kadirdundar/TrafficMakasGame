import { CAR_LIST } from '../cars/index.js';
import { MAX_UPGRADE_LEVEL, PARTS, UPGRADES } from './config.js';
import { carStats, partCost, statBars } from './performance.js';
import { carPrice } from './profile.js';

// Garage side of the new version (the menu's garage screen): the switch, the wallet, prices on
// the car cards, and per car three tabs — stats (and buying the car), upgrades, and parts.
// Nothing is bought on the first tap: a part goes on the turntable car to try, an upgrade shows
// what it changes, and the purchase bar asks for a yes. While the switch is off only the paint
// (static markup in index.html) shows, so the classic garage stays as it was.

const fmt = (n) => Math.round(n).toLocaleString('tr-TR');

const STAT_ROWS = [
  { key: 'topSpeed', label: 'Son Hız', text: (s) => `${fmt(s.value)} km/sa` },
  { key: 'accel', label: '0-100', text: (s) => `${s.value.toFixed(1).replace('.', ',')} sn` },
  { key: 'handling', label: 'Manevra', text: (s) => fmt(s.bar * 100) },
  { key: 'braking', label: 'Fren', text: (s) => fmt(s.bar * 100) },
];

const PART_HEADINGS = { spoiler: 'Spoyler', rim: 'Jant Rengi' };
const PART_NAMES = { spoiler: 'spoyler', rim: 'jant' };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// "Son Hız 250 → 256 km/sa · 0-100 3,8 → 3,7 sn": the stats that differ between two stat sets
function statChanges(before, after) {
  const a = statBars(before);
  const b = statBars(after);
  return STAT_ROWS.filter((row) => row.text(a[row.key]) !== row.text(b[row.key]))
    .map((row) => `${row.label} ${row.text(a[row.key])} → ${row.text(b[row.key])}`)
    .join(' · ');
}

export class GarageProgressUI {
  // onToggle(on): the switch was flipped. onPurchase({ type }): a car, an upgrade or a part was
  // bought or fitted. onPreview(parts | null): parts to try on the garage car (null: the fitted ones).
  constructor({ profile, enabled, onToggle, onPurchase, onPreview }) {
    this.profile = profile;
    this.enabled = enabled;
    this.onPurchase = onPurchase;
    this.onPreview = onPreview;
    this.car = null;
    this.runCoins = 0;
    this.tab = 'look';
    this.pending = null; // { type: 'car' } | { type: 'upgrade', upgrade } | { type: 'part', kind, part }

    this.switchEl = document.getElementById('newver-switch');
    this.walletEl = document.getElementById('garage-wallet');
    this.hudCard = document.getElementById('hud-coins-card');
    this.tabsEl = document.getElementById('garage-tabs');
    this.perfEl = document.getElementById('garage-perf');
    this.upgradesEl = document.getElementById('garage-upgrades');
    this.partsEl = document.getElementById('garage-parts');
    this.confirmEl = document.getElementById('garage-confirm');
    this.footerEl = document.getElementById('garage-footer');

    if (this.switchEl) {
      this.switchEl.checked = enabled;
      this.switchEl.addEventListener('change', () => onToggle(this.switchEl.checked));
    }
    this.tabsEl?.querySelectorAll('[data-garage-tab]').forEach((tab) => {
      tab.addEventListener('click', () => this.showTab(tab.dataset.garageTab));
    });
    document.getElementById('btn-confirm-cancel')?.addEventListener('click', () => this.cancelPending());
    document.getElementById('btn-confirm-buy')?.addEventListener('click', () => this.confirmPending());
    profile.onChange(() => {
      this.renderWallet();
      this.renderConfirm();
    });
  }

  // Takes effect with the next render()
  setEnabled(on) {
    this.enabled = on;
    this.cancelPending();
    if (this.switchEl) this.switchEl.checked = on;
  }

  // Coins earned in the drive that just ended, shown beside the wallet while the menu is open
  setRunCoins(coins) {
    this.runCoins = coins;
    this.renderWallet();
  }

  render(car) {
    if (car !== this.car) {
      this.cancelPending();
      // A car not bought yet opens on its stats and the buy button
      if (car && this.enabled && !this.profile.owns(car)) this.tab = 'perf';
    }
    this.car = car;
    const on = this.enabled;
    if (this.walletEl) this.walletEl.hidden = !on;
    this.hudCard?.classList.toggle('hidden', !on);
    if (this.tabsEl) this.tabsEl.hidden = !on;
    if (this.partsEl) this.partsEl.hidden = !on;
    this.renderWallet();
    this.renderCarCards();
    if (on && car) this.renderPages();
    this.showTab(on ? this.tab : 'look', { scroll: false });
    this.renderConfirm();
    this.renderDriveButton();
  }

  renderPages() {
    this.renderPerf(this.car);
    this.renderUpgrades(this.car);
    this.renderParts(this.car);
  }

  showTab(name, { scroll = true } = {}) {
    this.tab = name;
    this.tabsEl?.querySelectorAll('[data-garage-tab]').forEach((tab) => {
      const on = tab.dataset.garageTab === name;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('[data-garage-page]').forEach((page) => {
      page.hidden = page.dataset.garagePage !== name;
    });
    if (scroll) {
      const body = document.getElementById('garage-body');
      if (body) body.scrollTop = 0;
    }
  }

  renderWallet() {
    if (!this.walletEl || !this.enabled) return;
    this.walletEl.querySelector('#menu-coins').textContent = fmt(this.profile.coins);
    const run = this.walletEl.querySelector('#menu-run-coins');
    run.hidden = this.runCoins <= 0;
    run.textContent = `+${fmt(this.runCoins)}`;
  }

  // Price tag on the cards of cars not bought yet
  renderCarCards() {
    for (const car of CAR_LIST) {
      const card = document.querySelector(`#garage-car-select [data-car="${CSS.escape(car.id)}"]`);
      const tag = card?.querySelector('.car-card-price');
      if (!tag) continue;
      const locked = this.enabled && !this.profile.owns(car);
      card.classList.toggle('locked', locked);
      tag.hidden = !locked;
      tag.textContent = locked ? `🔒 ${fmt(carPrice(car))}` : '';
    }
  }

  // Stats with the levels and parts the car has; a pending upgrade or part adds its change in green
  statsBlock(car) {
    const levels = this.profile.levels(car.id);
    const parts = this.profile.parts(car.id);
    const base = statBars(carStats(car));
    const now = statBars(carStats(car, levels, parts));
    const next = this.pendingStats(car);
    const preview = next ? statBars(next) : now;

    const stats = el('div', 'perf-stats');
    for (const row of STAT_ROWS) {
      const line = el('div', 'perf-row');
      const bar = el('span', 'perf-bar');
      const baseFill = el('i', 'perf-fill');
      baseFill.style.inlineSize = `${Math.min(now[row.key].bar, base[row.key].bar) * 100}%`;
      const upFill = el('i', 'perf-fill up');
      upFill.style.inlineSize = `${Math.max(0, now[row.key].bar - base[row.key].bar) * 100}%`;
      const nextFill = el('i', 'perf-fill next');
      nextFill.style.inlineSize = `${Math.max(0, preview[row.key].bar - now[row.key].bar) * 100}%`;
      bar.append(baseFill, upFill, nextFill);

      const value = el('span', 'perf-value', row.text(preview[row.key]));
      if (row.text(preview[row.key]) !== row.text(now[row.key])) {
        value.classList.add(preview[row.key].bar > now[row.key].bar ? 'better' : 'worse');
      }
      line.append(el('span', 'perf-label', row.label), bar, value);
      stats.append(line);
    }
    return stats;
  }

  // Stats the car would have with the pending upgrade or part, or null
  pendingStats(car) {
    const p = this.pending;
    if (!p || p.type === 'car') return null;
    const levels = this.profile.levels(car.id);
    const parts = this.profile.parts(car.id);
    if (p.type === 'upgrade') levels[p.upgrade.id] = this.profile.level(car.id, p.upgrade.id) + 1;
    else parts[p.kind] = p.part.id;
    return carStats(car, levels, parts);
  }

  renderPerf(car) {
    const children = [this.statsBlock(car)];
    if (!this.profile.owns(car)) children.push(this.buyCarButton(car, 'btn-buy-car'));
    this.perfEl.replaceChildren(...children);
  }

  buyCarButton(car, id) {
    const btn = el('button', 'cta-btn buy-car-btn');
    btn.type = 'button';
    if (id) btn.id = id;
    btn.textContent = `SATIN AL · ${fmt(carPrice(car))} PARA`;
    btn.addEventListener('click', () => this.setPending({ type: 'car' }));
    return btn;
  }

  lockedNote(car, text) {
    const box = el('div', 'locked-note');
    box.append(el('p', 'panel-note', text), this.buyCarButton(car));
    return box;
  }

  renderUpgrades(car) {
    if (!this.profile.owns(car)) {
      this.upgradesEl.replaceChildren(this.lockedNote(car, 'Yükseltmek için önce aracı satın al.'));
      return;
    }
    const list = el('div', 'upgrade-list');
    for (const upgrade of UPGRADES) {
      const level = this.profile.level(car.id, upgrade.id);
      const cost = this.profile.nextUpgradeCost(car, upgrade.id);
      const pending = this.pending?.type === 'upgrade' && this.pending.upgrade.id === upgrade.id;

      const row = el('div', pending ? 'upgrade-row pending' : 'upgrade-row');
      const copy = el('span', 'upgrade-copy');
      copy.append(el('strong', '', upgrade.label), el('small', '', upgrade.detail));

      const pips = el('span', 'upgrade-pips');
      pips.setAttribute('aria-label', `Seviye ${level} / ${MAX_UPGRADE_LEVEL}`);
      for (let i = 0; i < MAX_UPGRADE_LEVEL; i++) {
        pips.append(el('i', i < level ? 'on' : i === level && pending ? 'next' : ''));
      }

      const btn = el('button', 'upgrade-btn');
      btn.type = 'button';
      if (cost === null) {
        btn.textContent = 'MAKS';
        btn.disabled = true;
      } else {
        // Tapping shows what the level changes; the purchase bar buys it
        btn.textContent = `▲ ${fmt(cost)}`;
        btn.classList.toggle('short', cost > this.profile.coins);
        btn.setAttribute('aria-pressed', String(pending));
        btn.title = `${upgrade.label} seviye ${level + 1}: ${fmt(cost)} para`;
        btn.addEventListener('click', () =>
          pending ? this.cancelPending() : this.setPending({ type: 'upgrade', upgrade })
        );
      }
      row.append(copy, pips, btn);
      list.append(row);
    }
    this.upgradesEl.replaceChildren(list);
  }

  renderParts(car) {
    if (!this.profile.owns(car)) {
      this.partsEl.replaceChildren(this.lockedNote(car, 'Spoyler ve jant rengi için önce aracı satın al.'));
      return;
    }
    const sections = Object.keys(PARTS).map((kind) => {
      const section = el('div', 'panel-section');
      section.append(el('h3', '', PART_HEADINGS[kind] ?? kind), this.buildParts(car, kind));
      return section;
    });
    this.partsEl.replaceChildren(...sections);
  }

  // One card per part of a kind. A part bought is fitted for free; one not bought yet goes on
  // the garage car to try and waits in the purchase bar. Rim colours get a swatch and a tighter grid.
  buildParts(car, kind) {
    const isRim = kind === 'rim';
    const grid = el('div', isRim ? 'spoiler-grid rim-grid' : 'spoiler-grid');
    const fitted = this.profile.fitted(kind, car.id);
    for (const part of PARTS[kind].list) {
      const owned = this.profile.ownsPart(car, kind, part.id);
      const trying = this.pending?.type === 'part' && this.pending.kind === kind && this.pending.part.id === part.id;
      const cost = partCost(car, part);
      const btn = el('button', trying ? 'spoiler-card trying' : 'spoiler-card');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(trying || (!this.pending && part.id === fitted)));
      const state = trying ? 'DENENİYOR' : part.id === fitted ? 'TAKILI' : owned ? 'TAK' : fmt(cost);
      const title = el('strong', '', part.label);
      if (isRim) {
        const dot = el('i', 'rim-swatch');
        dot.style.setProperty('--rim', part.hex === null ? '' : `#${part.hex.toString(16).padStart(6, '0')}`);
        dot.classList.toggle('factory', part.hex === null);
        title.prepend(dot);
      }
      btn.append(title);
      if (part.detail) btn.append(el('small', '', part.detail));
      btn.append(el('span', owned || trying ? 'spoiler-state' : 'spoiler-state price', state));
      btn.addEventListener('click', () => {
        if (trying) return;
        if (owned) {
          this.cancelPending();
          if (part.id !== fitted && this.profile.fitPart(car, kind, part.id)) this.onPurchase({ type: kind, car, part });
          return;
        }
        this.setPending({ type: 'part', kind, part });
      });
      grid.append(btn);
    }
    return grid;
  }

  setPending(pending) {
    if (!this.car) return;
    const wasPart = this.pending?.type === 'part';
    this.pending = pending;
    if (pending.type === 'part') {
      this.onPreview?.({ ...this.profile.parts(this.car.id), [pending.kind]: pending.part.id }, pending.kind);
    } else if (wasPart) {
      this.onPreview?.(null);
    }
    this.renderPages();
    this.renderConfirm();
  }

  cancelPending() {
    if (!this.pending) return;
    const wasPart = this.pending.type === 'part';
    this.pending = null;
    if (wasPart) this.onPreview?.(null);
    if (this.car && this.enabled) this.renderPages();
    this.renderConfirm();
  }

  pendingCost() {
    const p = this.pending;
    if (!p || !this.car) return null;
    if (p.type === 'car') return carPrice(this.car);
    if (p.type === 'upgrade') return this.profile.nextUpgradeCost(this.car, p.upgrade.id);
    return partCost(this.car, p.part);
  }

  renderConfirm() {
    const p = this.pending;
    if (this.confirmEl) this.confirmEl.hidden = !p;
    if (this.footerEl) this.footerEl.hidden = Boolean(p);
    if (!p || !this.car) return;

    const car = this.car;
    const cost = this.pendingCost() ?? 0;
    const short = cost - this.profile.coins;
    let title;
    let detail;
    if (p.type === 'car') {
      title = `${car.label} satın al`;
      detail = short > 0 ? `Fiyatı ${fmt(cost)} para` : `Alınca ${fmt(this.profile.coins - cost)} paran kalır`;
    } else if (p.type === 'upgrade') {
      const level = this.profile.level(car.id, p.upgrade.id) + 1;
      title = `${p.upgrade.label} · Seviye ${level}/${MAX_UPGRADE_LEVEL}`;
      detail = statChanges(carStats(car, this.profile.levels(car.id), this.profile.parts(car.id)), this.pendingStats(car));
    } else {
      title = `${p.part.label} ${PART_NAMES[p.kind] ?? ''}`.trim();
      detail =
        statChanges(carStats(car, this.profile.levels(car.id), this.profile.parts(car.id)), this.pendingStats(car)) ||
        'Yalnızca görünüm · arabada deniyorsun';
    }
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-detail').textContent = detail;
    const buy = document.getElementById('btn-confirm-buy');
    buy.disabled = short > 0;
    buy.textContent = short > 0 ? `${fmt(short)} PARA EKSİK` : `SATIN AL · ${fmt(cost)}`;
  }

  confirmPending() {
    const p = this.pending;
    const car = this.car;
    if (!p || !car) return;
    let ok = false;
    if (p.type === 'car') ok = this.profile.buyCar(car);
    else if (p.type === 'upgrade') ok = this.profile.buyUpgrade(car, p.upgrade.id);
    else ok = this.profile.fitPart(car, p.kind, p.part.id);
    if (!ok) {
      this.shake(document.getElementById('btn-confirm-buy'));
      return;
    }
    this.pending = null;
    const purchase = p.type === 'part' ? { type: p.kind, car, part: p.part } : { ...p, car };
    this.onPurchase(purchase);
  }

  // What the drive button says for a car that can be driven (main.js: drive, or drive on)
  setDriveLabel(text) {
    this.driveLabel = text;
    this.renderDriveButton();
  }

  // Main button of the garage: drive this car, or buy it first
  renderDriveButton() {
    const locked = this.enabled && this.car && !this.profile.owns(this.car);
    const btn = document.getElementById('btn-garage-drive');
    btn?.classList.toggle('locked', Boolean(locked));
    const label = document.getElementById('garage-drive-label');
    if (label) label.textContent = locked ? 'ÖNCE ARACI SATIN AL' : (this.driveLabel ?? 'BU ARAÇLA SÜR');
  }

  // The selected car is not bought yet and the player tried to drive it: point at the buy button
  flashLocked() {
    this.showTab('perf');
    this.shake(document.getElementById('btn-buy-car'));
  }

  shake(btn) {
    if (!btn) return;
    btn.classList.remove('shake');
    void btn.offsetWidth;
    btn.classList.add('shake');
    btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}
