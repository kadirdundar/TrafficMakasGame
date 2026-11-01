// Balance sheet of the new version: what a drive pays, what cars and upgrades cost and what each
// upgrade level adds. Every number that tunes the economy lives here, so balancing it before the
// App Store release means editing only this file. Car stats and prices are in each car's car.js.

// Pacing the prices below are set against: a beginner earns ~8,000 coins an hour, a good player
// (~90,000-point, 3-minute runs) ~20,000. That is a first upgrade after one run, an M4 in about
// 1.5 hours and the Porsche in about 3; every car fully upgraded is a few dozen hours.
//
// Coins a drive pays: a share of the points scored plus a little per kilometre. A crash ends the
// drive, so the kilometres are what keeps a careful (or new) player's runs worth something:
// 200 km/h pays ~50 coins a minute on its own. A ~90,000-point drive pays ~1,000 coins.
export const COINS_PER_POINT = 1 / 100;
export const COINS_PER_KM = 15;

// Online: coins for winning a match (first to MATCH_TARGET_POINTS rounds). Rounds pay nothing on
// their own, so two phones trading deliberate crashes earn less than driving alone.
export const MATCH_WIN_COINS = 400;

// Coins a fresh profile starts with (enough for two first-level upgrades)
export const STARTING_COINS = 1500;

// TEMPORARY, for testers: every profile is topped up to at least this many coins when the game
// loads, so all cars, upgrades and spoilers can be tried. Set to 0 before the App Store release.
export const TEST_MIN_COINS = 1000000;

// Price of a car whose car.js has no `price` (a newly added car is never free by accident).
// `price: 0` marks a starter car that every profile owns.
export const DEFAULT_CAR_PRICE = 30000;

// Price of each upgrade level: baseCost × LEVEL_COST[level] × the car's `performance.upgradeCost`,
// rounded to 50. The length of LEVEL_COST is the number of levels. Every track maxed costs
// 13 × 2,200 = ~28,600 on the A8, a little under the price of a sports car of the same pace.
export const LEVEL_COST = [1, 1.6, 2.4, 3.4, 4.6];

// Upgrade tracks. `per` is what one level adds to the car's stats (see performance.js):
// power/traction/handling/braking are multipliers (+0.05 = +5 %), topSpeed is km/h.
export const UPGRADES = [
  {
    id: 'engine',
    label: 'Motor',
    detail: 'Turbo & yazılım',
    baseCost: 700,
    per: { power: 0.05, traction: 0.03 },
  },
  {
    id: 'topSpeed',
    label: 'Son Hız',
    detail: 'Aero & şanzıman',
    baseCost: 600,
    per: { topSpeed: 6 },
  },
  {
    id: 'handling',
    label: 'Manevra',
    detail: 'Süspansiyon & lastik',
    baseCost: 500,
    per: { handling: 0.04 },
  },
  {
    id: 'brakes',
    label: 'Fren',
    detail: 'Seramik diskler',
    baseCost: 400,
    per: { braking: 0.06 },
  },
];

export const MAX_UPGRADE_LEVEL = LEVEL_COST.length;

// Rear spoilers (parts in src/cars/spoiler.js). Bought once per car, then fitted or swapped
// for free. Price × the car's `performance.upgradeCost`, rounded to 50. `per` works like an
// upgrade level: more downforce turns in sharper but costs a little top speed.
export const SPOILERS = [
  { id: 'none', label: 'Yok', detail: 'Fabrika arka kaput', price: 0, per: {} },
  { id: 'lip', label: 'Dudak', detail: 'İnce kaput dudağı', price: 1000, per: { handling: 0.015 } },
  { id: 'ducktail', label: 'Ördek Kuyruk', detail: 'Kalkık kuyruk spoyleri', price: 2000, per: { handling: 0.03, topSpeed: -2 } },
  { id: 'wing', label: 'GT Kanat', detail: 'Karbon kanat, ayaklı', price: 4000, per: { handling: 0.06, topSpeed: -6 } },
];

// Rim colours (painted by src/cars/rims.js). Bought once per car like spoilers; looks only.
// `hex: null` is the model's own factory finish.
export const RIM_COLORS = [
  { id: 'factory', label: 'Fabrika', hex: null, price: 0, per: {} },
  { id: 'black', label: 'Parlak Siyah', hex: 0x101114, price: 600, per: {} },
  { id: 'gunmetal', label: 'Antrasit', hex: 0x3b4047, price: 600, per: {} },
  { id: 'silver', label: 'Gümüş', hex: 0xc4c8ce, price: 600, per: {} },
  { id: 'white', label: 'Beyaz', hex: 0xe8e9eb, price: 900, per: {} },
  { id: 'bronze', label: 'Bronz', hex: 0x8a6a3c, price: 900, per: {} },
  { id: 'red', label: 'Kırmızı', hex: 0xb3121f, price: 900, per: {} },
  { id: 'gold', label: 'Altın', hex: 0xc9a227, price: 1200, per: {} },
];

// Custom number plate (src/progression/plate.js): what a car wears before one is bought, and
// the price of each new plate, the same for every car. Looks only.
export const DEFAULT_PLATE = '34 MKS 34';
export const PLATE_PRICE = 2000;

// Paint finishes (src/cars/finish.js): how the body paint takes the light, in whatever colour
// it is painted. Bought once per car like spoilers; looks only.
export const PAINT_FINISHES = [
  { id: 'factory', label: 'Fabrika', detail: 'Parlak cila', price: 0, per: {} },
  { id: 'metallic', label: 'Metalik', detail: 'Pul pul parlar', price: 2500, per: {} },
  { id: 'matte', label: 'Mat', detail: 'Saten, yansımasız', price: 3000, per: {} },
  { id: 'pearl', label: 'Sedef', detail: 'Açıya göre renk atar', price: 4500, per: {} },
];

// Carbon fibre bonnet and mirror caps (src/cars/carbon.js). The lighter bonnet turns in a
// touch sharper.
export const HOODS = [
  { id: 'paint', label: 'Boyalı', detail: 'Fabrika kaput', price: 0, per: {} },
  { id: 'carbon', label: 'Karbon', detail: 'Hafif, örgülü karbon', price: 3000, per: { handling: 0.01 } },
];
export const MIRROR_CAPS = [
  { id: 'paint', label: 'Boyalı', detail: 'Fabrika ayna kapağı', price: 0, per: {} },
  { id: 'carbon', label: 'Karbon', detail: 'Örgülü karbon kapak', price: 1000, per: {} },
];

// Window film (src/cars/tint.js): `shade` 0-1 is how much light it holds back. Looks only.
export const WINDOW_TINTS = [
  { id: 'none', label: 'Yok', detail: 'Fabrika cam', shade: 0, price: 0, per: {} },
  { id: 'light', label: 'Açık', detail: '%35 film', shade: 0.35, price: 500, per: {} },
  { id: 'dark', label: 'Koyu', detail: '%60 film', shade: 0.6, price: 800, per: {} },
  { id: 'limo', label: 'Limuzin', detail: '%85 film', shade: 0.85, price: 1200, per: {} },
];

// Neon underglow (src/cars/neon.js): a light strip under the car that lights the road round it,
// strongest at night. `hex: null` is none. Looks only.
export const NEON_COLORS = [
  { id: 'none', label: 'Yok', hex: null, price: 0, per: {} },
  { id: 'cyan', label: 'Turkuaz', hex: 0x00e5ff, price: 1800, per: {} },
  { id: 'blue', label: 'Mavi', hex: 0x2f6bff, price: 1800, per: {} },
  { id: 'purple', label: 'Mor', hex: 0xb040ff, price: 1800, per: {} },
  { id: 'pink', label: 'Pembe', hex: 0xff3fb4, price: 1800, per: {} },
  { id: 'red', label: 'Kırmızı', hex: 0xff2638, price: 1800, per: {} },
  { id: 'green', label: 'Yeşil', hex: 0x2bff72, price: 1800, per: {} },
  { id: 'white', label: 'Beyaz', hex: 0xf2f6ff, price: 2200, per: {} },
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
