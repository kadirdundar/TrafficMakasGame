// Balance sheet of the new version: what a drive pays, what cars and upgrades cost and what each
// upgrade level adds. Every number that tunes the economy lives here, so balancing it before the
// App Store release means editing only this file. Car stats and prices are in each car's car.js.

// Coins a drive pays: a share of the points scored plus a little per kilometre, so a clean
// motorway cruise also earns something. A ~240,000-point drive pays ~2,500 coins.
export const COINS_PER_POINT = 1 / 100;
export const COINS_PER_KM = 4;

// Coins a fresh profile starts with (enough for a first upgrade)
export const STARTING_COINS = 2500;

// Price of a car whose car.js has no `price` (a newly added car is never free by accident).
// `price: 0` marks a starter car that every profile owns.
export const DEFAULT_CAR_PRICE = 25000;

// Price of each upgrade level: baseCost × LEVEL_COST[level] × the car's `performance.upgradeCost`,
// rounded to 50. The length of LEVEL_COST is the number of levels.
export const LEVEL_COST = [1, 1.8, 3, 4.6, 6.5];

// Upgrade tracks. `per` is what one level adds to the car's stats (see performance.js):
// power/traction/handling/braking are multipliers (+0.05 = +5 %), topSpeed is km/h.
export const UPGRADES = [
  {
    id: 'engine',
    label: 'Motor',
    detail: 'Turbo & yazılım',
    baseCost: 1200,
    per: { power: 0.05, traction: 0.03 },
  },
  {
    id: 'topSpeed',
    label: 'Son Hız',
    detail: 'Aero & şanzıman',
    baseCost: 1000,
    per: { topSpeed: 6 },
  },
  {
    id: 'handling',
    label: 'Manevra',
    detail: 'Süspansiyon & lastik',
    baseCost: 900,
    per: { handling: 0.04 },
  },
  {
    id: 'brakes',
    label: 'Fren',
    detail: 'Seramik diskler',
    baseCost: 700,
    per: { braking: 0.06 },
  },
];

export const MAX_UPGRADE_LEVEL = LEVEL_COST.length;

// Rear spoilers (parts in src/cars/spoiler.js). Bought once per car, then fitted or swapped
// for free. Price × the car's `performance.upgradeCost`, rounded to 50. `per` works like an
// upgrade level: more downforce turns in sharper but costs a little top speed.
export const SPOILERS = [
  { id: 'none', label: 'Yok', detail: 'Fabrika arka kaput', price: 0, per: {} },
  { id: 'lip', label: 'Dudak', detail: 'İnce kaput dudağı', price: 1500, per: { handling: 0.015 } },
  { id: 'ducktail', label: 'Ördek Kuyruk', detail: 'Kalkık kuyruk spoyleri', price: 3000, per: { handling: 0.03, topSpeed: -2 } },
  { id: 'wing', label: 'GT Kanat', detail: 'Karbon kanat, ayaklı', price: 6000, per: { handling: 0.06, topSpeed: -6 } },
];
