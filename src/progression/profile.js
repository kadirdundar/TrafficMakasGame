import { DEFAULT_CAR_PRICE, MAX_UPGRADE_LEVEL, SPOILERS, STARTING_COINS, UPGRADES } from './config.js';
import { spoilerCost, upgradeCost } from './performance.js';

// The player's save in the new version: coins, cars bought, and per car the upgrade levels and
// the spoilers bought / fitted.
// Stored in localStorage under one versioned key; cars are referred to by their car.js id, so
// cars added later simply start out unowned and unupgraded.

const STORAGE_KEY = 'otoban_profile_v1';
const SAVE_DELAY_MS = 4000;

export function carPrice(car) {
  return car?.price ?? DEFAULT_CAR_PRICE;
}

function freshProfile() {
  return { coins: STARTING_COINS, totalEarned: 0, owned: [], upgrades: {}, spoilers: {} };
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshProfile();
    const data = JSON.parse(raw);
    return {
      coins: Math.max(0, Math.floor(Number(data.coins) || 0)),
      totalEarned: Math.max(0, Math.floor(Number(data.totalEarned) || 0)),
      owned: Array.isArray(data.owned) ? data.owned.filter((id) => typeof id === 'string') : [],
      upgrades: data.upgrades && typeof data.upgrades === 'object' ? data.upgrades : {},
      spoilers: data.spoilers && typeof data.spoilers === 'object' ? data.spoilers : {},
    };
  } catch (_) {
    return freshProfile();
  }
}

export class PlayerProfile {
  constructor() {
    this.data = readStored();
    this.saveTimer = null;
    this.listeners = new Set();
  }

  get coins() {
    return this.data.coins;
  }

  onChange(fn) {
    this.listeners.add(fn);
  }

  // Starter cars (price 0) are owned by everyone
  owns(car) {
    return carPrice(car) <= 0 || this.data.owned.includes(car.id);
  }

  levels(carId) {
    return { ...this.data.upgrades[carId] };
  }

  level(carId, upgradeId) {
    return Math.min(MAX_UPGRADE_LEVEL, this.data.upgrades[carId]?.[upgradeId] || 0);
  }

  // Coins from driving; saved a few seconds later in one write (see flush)
  earn(amount) {
    const coins = Math.floor(amount);
    if (coins <= 0) return;
    this.data.coins += coins;
    this.data.totalEarned += coins;
    this.scheduleSave();
    this.emit();
  }

  buyCar(car) {
    const price = carPrice(car);
    if (this.owns(car) || this.data.coins < price) return false;
    this.data.coins -= price;
    this.data.owned.push(car.id);
    this.flush();
    this.emit();
    return true;
  }

  nextUpgradeCost(car, upgradeId) {
    const upgrade = UPGRADES.find((u) => u.id === upgradeId);
    return upgrade ? upgradeCost(car, upgrade, this.level(car.id, upgradeId)) : null;
  }

  buyUpgrade(car, upgradeId) {
    const cost = this.nextUpgradeCost(car, upgradeId);
    if (cost === null || !this.owns(car) || this.data.coins < cost) return false;
    this.data.coins -= cost;
    const levels = (this.data.upgrades[car.id] ??= {});
    levels[upgradeId] = this.level(car.id, upgradeId) + 1;
    this.flush();
    this.emit();
    return true;
  }

  // Spoiler fitted on a car ('none' when there is none)
  spoiler(carId) {
    const fitted = this.data.spoilers[carId]?.fitted;
    return SPOILERS.some((sp) => sp.id === fitted) ? fitted : 'none';
  }

  ownsSpoiler(car, spoilerId) {
    const spoiler = SPOILERS.find((sp) => sp.id === spoilerId);
    return Boolean(spoiler) && (spoiler.price <= 0 || this.data.spoilers[car.id]?.owned?.includes(spoilerId));
  }

  // Buys the spoiler if needed and fits it; one bought stays the car's and swaps back for free
  fitSpoiler(car, spoilerId) {
    const spoiler = SPOILERS.find((sp) => sp.id === spoilerId);
    if (!spoiler || !this.owns(car)) return false;
    const entry = (this.data.spoilers[car.id] ??= { owned: [], fitted: 'none' });
    if (!this.ownsSpoiler(car, spoilerId)) {
      const cost = spoilerCost(car, spoiler);
      if (this.data.coins < cost) return false;
      this.data.coins -= cost;
      entry.owned = [...(entry.owned || []), spoilerId];
    }
    entry.fitted = spoilerId;
    this.flush();
    this.emit();
    return true;
  }

  scheduleSave() {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => this.flush(), SAVE_DELAY_MS);
  }

  flush() {
    clearTimeout(this.saveTimer);
    this.saveTimer = null;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (_) {}
  }

  emit() {
    for (const fn of this.listeners) fn(this);
  }
}
