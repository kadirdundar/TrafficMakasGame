import { CAR_LIST } from '../cars/index.js';
import { MAX_UPGRADE_LEVEL, PARTS, UPGRADES } from './config.js';
import { carStats, partCost, statBars } from './performance.js';
import { carPrice } from './profile.js';

// Garage side of the new version (step 1 of the menu): the switch, the wallet, prices on the
// car cards, the selected car's stats, and buying cars, upgrades and parts. Everything here is hidden
// while the switch is off, so the classic garage looks exactly as before.

const fmt = (n) => Math.round(n).toLocaleString('tr-TR');

const STAT_ROWS = [
  { key: 'topSpeed', label: 'Son Hız', text: (s) => `${fmt(s.value)} km/s` },
  { key: 'accel', label: '0-100', text: (s) => `${s.value.toFixed(1).replace('.', ',')} sn` },
  { key: 'handling', label: 'Manevra', text: (s) => fmt(s.bar * 100) },
  { key: 'braking', label: 'Fren', text: (s) => fmt(s.bar * 100) },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export class GarageProgressUI {
  // onToggle(on): the switch was flipped. onPurchase(): a car or an upgrade was bought.
  constructor({ profile, enabled, onToggle, onPurchase }) {
    this.profile = profile;
    this.enabled = enabled;
    this.onPurchase = onPurchase;
    this.car = null;
    this.runCoins = 0;

    this.switchEl = document.getElementById('newver-switch');
    this.walletEl = document.getElementById('garage-wallet');
    this.panelEl = document.getElementById('garage-progress');
    this.hudCard = document.getElementById('hud-coins-card');

    if (this.switchEl) {
      this.switchEl.checked = enabled;
      this.switchEl.addEventListener('change', () => onToggle(this.switchEl.checked));
    }
    profile.onChange(() => this.renderWallet());
  }

  // Takes effect with the next render()
  setEnabled(on) {
    this.enabled = on;
    if (this.switchEl) this.switchEl.checked = on;
  }

  // Coins earned in the drive that just ended, shown beside the wallet while the menu is open
  setRunCoins(coins) {
    this.runCoins = coins;
    this.renderWallet();
  }

  render(car) {
    this.car = car;
    const on = this.enabled;
    if (this.walletEl) this.walletEl.hidden = !on;
    this.hudCard?.classList.toggle('hidden', !on);
    if (this.panelEl) this.panelEl.hidden = !on;
    this.renderWallet();
    this.renderCarCards();
    if (on && car) this.renderPanel(car);

    // Step 1's button says what is missing while the selected car is not bought
    const locked = on && car && !this.profile.owns(car);
    const next = document.getElementById('btn-step-1-next');
    next?.classList.toggle('locked', Boolean(locked));
    const label = next?.querySelector('.start-text span');
    if (label) label.textContent = locked ? 'ÖNCE ARACI SATIN AL' : 'ARACI SEÇ & DEVAM ET';
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

  renderPanel(car) {
    const owned = this.profile.owns(car);
    const base = statBars(carStats(car));
    const now = statBars(carStats(car, this.profile.levels(car.id), this.profile.parts(car.id)));

    const stats = el('div', 'perf-stats');
    for (const row of STAT_ROWS) {
      const line = el('div', 'perf-row');
      const bar = el('span', 'perf-bar');
      const baseFill = el('i', 'perf-fill');
      baseFill.style.inlineSize = `${Math.min(now[row.key].bar, base[row.key].bar) * 100}%`;
      const upFill = el('i', 'perf-fill up');
      upFill.style.inlineSize = `${Math.max(0, now[row.key].bar - base[row.key].bar) * 100}%`;
      bar.append(baseFill, upFill);
      line.append(el('span', 'perf-label', row.label), bar, el('span', 'perf-value', row.text(now[row.key])));
      stats.append(line);
    }

    const children = [el('h3', '', 'Performans'), stats];
    if (owned) {
      children.push(
        el('h3', 'upgrade-heading', 'Yükseltmeler'),
        this.buildUpgrades(car),
        el('h3', 'upgrade-heading', 'Spoyler'),
        this.buildParts(car, 'spoiler'),
        el('h3', 'upgrade-heading', 'Jant Rengi'),
        this.buildParts(car, 'rim')
      );
    } else {
      children.push(this.buildBuyButton(car));
    }
    this.panelEl.replaceChildren(...children);
  }

  buildBuyButton(car) {
    const price = carPrice(car);
    const short = price - this.profile.coins;
    const btn = el('button', 'cta-btn buy-car-btn');
    btn.type = 'button';
    btn.id = 'btn-buy-car';
    btn.disabled = short > 0;
    btn.textContent = short > 0
      ? `🔒 ${fmt(price)} · ${fmt(short)} PARA EKSİK`
      : `SATIN AL · ${fmt(price)} PARA`;
    btn.addEventListener('click', () => {
      if (this.profile.buyCar(car)) this.onPurchase({ type: 'car', car });
    });
    return btn;
  }

  buildUpgrades(car) {
    const list = el('div', 'upgrade-list');
    for (const upgrade of UPGRADES) {
      const level = this.profile.level(car.id, upgrade.id);
      const cost = this.profile.nextUpgradeCost(car, upgrade.id);

      const row = el('div', 'upgrade-row');
      const copy = el('span', 'upgrade-copy');
      copy.append(el('strong', '', upgrade.label), el('small', '', upgrade.detail));

      const pips = el('span', 'upgrade-pips');
      pips.setAttribute('aria-label', `Seviye ${level} / ${MAX_UPGRADE_LEVEL}`);
      for (let i = 0; i < MAX_UPGRADE_LEVEL; i++) {
        pips.append(el('i', i < level ? 'on' : ''));
      }

      const btn = el('button', 'upgrade-btn');
      btn.type = 'button';
      if (cost === null) {
        btn.textContent = 'MAKS';
        btn.disabled = true;
      } else {
        btn.textContent = `▲ ${fmt(cost)}`;
        btn.disabled = cost > this.profile.coins;
        btn.title = `${upgrade.label} seviye ${level + 1}: ${fmt(cost)} para`;
        btn.addEventListener('click', () => {
          if (this.profile.buyUpgrade(car, upgrade.id)) this.onPurchase({ type: 'upgrade', car, upgrade });
        });
      }
      row.append(copy, pips, btn);
      list.append(row);
    }
    return list;
  }

  // One card per part of a kind: price until bought, then fitted or swapped for free. Rim
  // colours get a swatch and a tighter grid.
  buildParts(car, kind) {
    const isRim = kind === 'rim';
    const grid = el('div', isRim ? 'spoiler-grid rim-grid' : 'spoiler-grid');
    const fitted = this.profile.fitted(kind, car.id);
    for (const part of PARTS[kind].list) {
      const owned = this.profile.ownsPart(car, kind, part.id);
      const cost = partCost(car, part);
      const btn = el('button', 'spoiler-card');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(part.id === fitted));
      btn.disabled = !owned && cost > this.profile.coins;
      const state = part.id === fitted ? 'TAKILI' : owned ? 'TAK' : `${fmt(cost)}`;
      const title = el('strong', '', part.label);
      if (isRim) {
        const dot = el('i', 'rim-swatch');
        dot.style.setProperty('--rim', part.hex === null ? '' : `#${part.hex.toString(16).padStart(6, '0')}`);
        dot.classList.toggle('factory', part.hex === null);
        title.prepend(dot);
      }
      btn.append(title);
      if (part.detail) btn.append(el('small', '', part.detail));
      btn.append(el('span', owned ? 'spoiler-state' : 'spoiler-state price', state));
      btn.addEventListener('click', () => {
        if (part.id === fitted) return;
        if (this.profile.fitPart(car, kind, part.id)) this.onPurchase({ type: kind, car, part });
      });
      grid.append(btn);
    }
    return grid;
  }

  // The selected car is not bought yet and the player tried to go on: point at the buy button
  flashLocked() {
    const btn = document.getElementById('btn-buy-car');
    if (!btn) return;
    btn.classList.remove('shake');
    void btn.offsetWidth;
    btn.classList.add('shake');
    btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}
