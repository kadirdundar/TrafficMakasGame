// Balance sheet of the new version: what a drive pays, what cars and upgrades cost and what each
// upgrade level adds. Every number that tunes the economy lives here, so balancing it before the
// App Store release means editing only this file. Car stats and prices are in each car's car.js.

// Pacing the prices below are set against (a new player starts with nothing): a beginner earns
// ~4,000 coins an hour of driving, a good player (~90,000-point, 3-minute runs) ~10,000, and the
// daily login reward and missions add ~2,000-3,500 a day. Half an hour a day buys a first upgrade
// on day one, the cheapest car on day two, an M4 in about three weeks and the Portofino in about
// two months; every car fully upgraded is a few months.
//
// Coins a drive pays: a share of the points scored plus a little per kilometre. A crash ends the
// drive, so the kilometres are what keeps a careful (or new) player's runs worth something:
// 200 km/h pays ~27 coins a minute on its own. A ~90,000-point drive pays ~500 coins.
export const COINS_PER_POINT = 1 / 200;
export const COINS_PER_KM = 8;

// Online: coins for winning a match (first to MATCH_TARGET_POINTS rounds). Rounds pay nothing on
// their own, so two phones trading deliberate crashes earn less than driving alone.
export const MATCH_WIN_COINS = 250;

// Coins a fresh profile starts with: none, the first coins come from the first drive and the
// first day's login reward
export const STARTING_COINS = 0;

// For testers only: opened with ?test in the address, the game uses a separate save topped up to
// at least this many coins, so every car, upgrade and part can be tried (src/progression/profile.js).
// The real save and the live game never see these coins.
export const TEST_MIN_COINS = 1000000;

// Daily login reward (src/progression/daily.js): coins for the 1st..7th day in a row it is taken;
// from the 7th day on, the last one every day. A day missed starts the streak over.
export const STREAK_REWARDS = [250, 350, 500, 650, 800, 1000, 1500];

// Daily missions: MISSIONS_PER_DAY picked each day from the pool below (the same ones for every
// player on that date), each on a different stat, at one of its goals. A mission pays its reward
// the moment it is done; finishing all of the day's pays MISSIONS_BONUS on top.
// Stats (counted in main.js): km driven, makas, razor (perfect or double makas), sollama
// (overtakes on the two-way road), fastSec (seconds above 200 km/h), laps (İstanbul Park), and
// the best single drive's score and combo.
export const MISSIONS_PER_DAY = 3;
export const MISSIONS_BONUS = 500;
export const MISSIONS = [
  { stat: 'km', text: (g) => `${g} km yol yap`, goals: [[10, 300], [20, 500], [30, 700]] },
  { stat: 'makas', text: (g) => `${g} makas at`, goals: [[20, 300], [40, 500]] },
  { stat: 'razor', text: (g) => `${g} kusursuz makas at`, goals: [[5, 350], [12, 600]] },
  { stat: 'sollama', text: (g) => `Gidiş-Geliş'te ${g} sollama yap`, goals: [[8, 400], [15, 600]] },
  { stat: 'fastSec', text: (g) => `${g / 60} dakika 200 km/s üstünde sür`, goals: [[60, 350], [180, 600]] },
  { stat: 'laps', text: (g) => `İstanbul Park'ta ${g} tur at`, goals: [[1, 300], [3, 600]] },
  { stat: 'score', best: true, text: (g) => `Tek sürüşte ${g.toLocaleString('tr-TR')} puan topla`, goals: [[30000, 400], [60000, 600], [100000, 900]] },
  { stat: 'combo', best: true, text: (g) => `Tek sürüşte ${g}x komboya ulaş`, goals: [[5, 400], [8, 700]] },
];

// Price of a car whose car.js has no `price` (a newly added car is never free by accident).
// `price: 0` marks a starter car that every profile owns.
export const DEFAULT_CAR_PRICE = 80000;

// Price of each upgrade level: baseCost × LEVEL_COST[level] × the car's `performance.upgradeCost`,
// rounded to 50. The length of LEVEL_COST is the number of levels. Every track maxed costs
// 16.8 × 3,250 = ~54,600 on the A8, a little under the price of the first sports car.
export const LEVEL_COST = [1, 1.8, 3, 4.5, 6.5];

// Upgrade tracks. `per` is what one level adds to the car's stats (see performance.js):
// power/traction/handling/braking are multipliers (+0.05 = +5 %), topSpeed is km/h.
export const UPGRADES = [
  {
    id: 'engine',
    label: 'Motor',
    detail: 'Turbo & yazılım',
    baseCost: 1000,
    per: { power: 0.05, traction: 0.03 },
  },
  {
    id: 'topSpeed',
    label: 'Son Hız',
    detail: 'Aero & şanzıman',
    baseCost: 900,
    per: { topSpeed: 6 },
  },
  {
    id: 'handling',
    label: 'Manevra',
    detail: 'Süspansiyon & lastik',
    baseCost: 750,
    per: { handling: 0.04 },
  },
  {
    id: 'brakes',
    label: 'Fren',
    detail: 'Seramik diskler',
    baseCost: 600,
    per: { braking: 0.06 },
  },
];

export const MAX_UPGRADE_LEVEL = LEVEL_COST.length;

// Rear spoilers (parts in src/cars/spoiler.js). Bought once per car, then fitted or swapped
// for free. Price × the car's `performance.upgradeCost`, rounded to 50. `per` works like an
// upgrade level: more downforce turns in sharper but costs a little top speed.
export const SPOILERS = [
  { id: 'none', label: 'Yok', detail: 'Fabrika arka kaput', price: 0, per: {} },
  { id: 'lip', label: 'Dudak', detail: 'İnce kaput dudağı', price: 2000, per: { handling: 0.015 } },
  { id: 'ducktail', label: 'Ördek Kuyruk', detail: 'Kalkık kuyruk spoyleri', price: 4000, per: { handling: 0.03, topSpeed: -2 } },
  { id: 'wing', label: 'GT Kanat', detail: 'Karbon kanat, ayaklı', price: 8000, per: { handling: 0.06, topSpeed: -6 } },
];

// Rim colours (painted by src/cars/rims.js). Bought once per car like spoilers; looks only.
// `hex: null` is the model's own factory finish.
export const RIM_COLORS = [
  { id: 'factory', label: 'Fabrika', hex: null, price: 0, per: {} },
  { id: 'black', label: 'Parlak Siyah', hex: 0x101114, price: 1200, per: {} },
  { id: 'gunmetal', label: 'Antrasit', hex: 0x3b4047, price: 1200, per: {} },
  { id: 'silver', label: 'Gümüş', hex: 0xc4c8ce, price: 1200, per: {} },
  { id: 'white', label: 'Beyaz', hex: 0xe8e9eb, price: 1800, per: {} },
  { id: 'bronze', label: 'Bronz', hex: 0x8a6a3c, price: 1800, per: {} },
  { id: 'red', label: 'Kırmızı', hex: 0xb3121f, price: 1800, per: {} },
  { id: 'gold', label: 'Altın', hex: 0xc9a227, price: 2400, per: {} },
];

// Custom number plate (src/progression/plate.js): what a car wears before one is bought, and
// the price of each new plate, the same for every car. Looks only.
export const DEFAULT_PLATE = '34 MKS 34';
export const PLATE_PRICE = 4000;

// Paint finishes (src/cars/finish.js): how the body paint takes the light, in whatever colour
// it is painted. Bought once per car like spoilers; looks only.
export const PAINT_FINISHES = [
  { id: 'factory', label: 'Fabrika', detail: 'Parlak cila', price: 0, per: {} },
  { id: 'metallic', label: 'Metalik', detail: 'Pul pul parlar', price: 5000, per: {} },
  { id: 'matte', label: 'Mat', detail: 'Saten, yansımasız', price: 6000, per: {} },
  { id: 'pearl', label: 'Sedef', detail: 'Açıya göre renk atar', price: 9000, per: {} },
];

// Carbon fibre bonnet and mirror caps (src/cars/carbon.js). The lighter bonnet turns in a
// touch sharper.
export const HOODS = [
  { id: 'paint', label: 'Boyalı', detail: 'Fabrika kaput', price: 0, per: {} },
  { id: 'carbon', label: 'Karbon', detail: 'Hafif, örgülü karbon', price: 6000, per: { handling: 0.01 } },
];
export const MIRROR_CAPS = [
  { id: 'paint', label: 'Boyalı', detail: 'Fabrika ayna kapağı', price: 0, per: {} },
  { id: 'carbon', label: 'Karbon', detail: 'Örgülü karbon kapak', price: 2000, per: {} },
];

// Window film (src/cars/tint.js): `shade` 0-1 is how much light it holds back. Looks only.
export const WINDOW_TINTS = [
  { id: 'none', label: 'Yok', detail: 'Fabrika cam', shade: 0, price: 0, per: {} },
  { id: 'light', label: 'Açık', detail: '%35 film', shade: 0.35, price: 1000, per: {} },
  { id: 'dark', label: 'Koyu', detail: '%60 film', shade: 0.6, price: 1600, per: {} },
  { id: 'limo', label: 'Limuzin', detail: '%85 film', shade: 0.85, price: 2400, per: {} },
];

// Neon underglow (src/cars/neon.js): a light strip under the car that lights the road round it,
// strongest at night. `hex: null` is none. Looks only.
export const NEON_COLORS = [
  { id: 'none', label: 'Yok', hex: null, price: 0, per: {} },
  { id: 'cyan', label: 'Turkuaz', hex: 0x00e5ff, price: 3600, per: {} },
  { id: 'blue', label: 'Mavi', hex: 0x2f6bff, price: 3600, per: {} },
  { id: 'purple', label: 'Mor', hex: 0xb040ff, price: 3600, per: {} },
  { id: 'pink', label: 'Pembe', hex: 0xff3fb4, price: 3600, per: {} },
  { id: 'red', label: 'Kırmızı', hex: 0xff2638, price: 3600, per: {} },
  { id: 'green', label: 'Yeşil', hex: 0x2bff72, price: 3600, per: {} },
  { id: 'white', label: 'Beyaz', hex: 0xf2f6ff, price: 4400, per: {} },
];

// Visual parts a car can be fitted with: where the profile keeps them, the catalogue, and what
// a car has before anything is bought. A new kind of part is one more entry here.
export const PARTS = {
  finish: { key: 'finishes', list: PAINT_FINISHES, none: 'factory' },
  spoiler: { key: 'spoilers', list: SPOILERS, none: 'none' },
  rim: { key: 'rims', list: RIM_COLORS, none: 'factory' },
  hood: { key: 'hoods', list: HOODS, none: 'paint' },
  mirrors: { key: 'mirrorCaps', list: MIRROR_CAPS, none: 'paint' },
  tint: { key: 'tints', list: WINDOW_TINTS, none: 'none' },
  neon: { key: 'neons', list: NEON_COLORS, none: 'none' },
};

// A part id of a kind as fitted, or that kind's `none` for an id that is not in the catalogue
// (a save or a friend from another version)
export function partOrNone(kind, id) {
  const { list, none } = PARTS[kind];
  return list.some((p) => p.id === id) ? id : none;
}

export function rimColorHex(id) {
  return RIM_COLORS.find((c) => c.id === id)?.hex ?? null;
}

export function neonColorHex(id) {
  return NEON_COLORS.find((c) => c.id === id)?.hex ?? null;
}

export function tintShade(id) {
  return WINDOW_TINTS.find((t) => t.id === id)?.shade ?? 0;
}
