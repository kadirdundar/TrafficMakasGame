import { LEVEL_COST, MAX_UPGRADE_LEVEL, UPGRADES } from './config.js';

// Car performance in the new version. Each car declares its stats in car.js → `performance`,
// bought upgrades add to them, and resolvePhysics() turns the result into the numbers
// updatePhysics() (src/main.js) drives with. The classic game uses CLASSIC_PHYSICS for every car.

// The tuned physics all cars share in the classic game: ~3.3 s 0→100, ~5.6 s 100→200,
// a slow 235→260 km/h climb to the limiter, 115 km/h/s braking
export const CLASSIC_PHYSICS = Object.freeze({
  maxSpeed: 260,
  climbFrom: 235,
  enginePower: 4200,
  tractionLimit: 33,
  aeroDrag: 0.00027,
  brakeDecel: 115,
  handling: 1,
});

// Stats of a car with no `performance` block yet (a newly added car before it is tuned):
// the classic car. power/traction/handling/braking are multipliers on CLASSIC_PHYSICS.
export const DEFAULT_PERFORMANCE = Object.freeze({
  topSpeed: 260,
  power: 1,
  traction: 1,
  handling: 1,
  braking: 1,
  upgradeCost: 1,
});

const ROLLING_DRAG = 1.5;
// Net full-throttle acceleration (km/h/s) at the start and end of the climb to the limiter
const CLIMB_START_ACCEL = 1.5;
const CLIMB_END_ACCEL = 0.38;

// Stats of a car with the given upgrade levels ({ engine: 2, brakes: 1, ... })
export function carStats(car, levels = {}) {
  const stats = { ...DEFAULT_PERFORMANCE, ...car?.performance };
  for (const upgrade of UPGRADES) {
    const level = Math.min(MAX_UPGRADE_LEVEL, Math.max(0, levels[upgrade.id] || 0));
    for (const [key, step] of Object.entries(upgrade.per)) {
      stats[key] += step * level;
    }
  }
  return stats;
}

// Physics numbers for the given stats. The air drag is solved per car so the full-throttle
// climb to its own limiter feels like the classic car's 235→260: a car with a higher top speed
// slips through the air more easily, a weaker engine meets its limit sooner.
export function resolvePhysics(stats) {
  const maxSpeed = stats.topSpeed;
  const climbFrom = maxSpeed - 25;
  const enginePower = CLASSIC_PHYSICS.enginePower * stats.power;
  const aeroDrag = Math.max(
    0.00008,
    (enginePower / climbFrom - ROLLING_DRAG - CLIMB_START_ACCEL) / (climbFrom * climbFrom)
  );
  return {
    maxSpeed,
    climbFrom,
    enginePower,
    tractionLimit: CLASSIC_PHYSICS.tractionLimit * stats.traction,
    aeroDrag,
    brakeDecel: CLASSIC_PHYSICS.brakeDecel * stats.braking,
    handling: stats.handling,
  };
}

// Longitudinal acceleration (km/h per second) before cornering scrub. Shared by the game and
// the garage's 0→100 figure, so the number shown is the number driven.
export function longitudinalAccel(phys, speedKmh, throttle, brake) {
  // Resistance grows with the square of speed (aero drag) plus a small rolling term,
  // so the car pulls hard in town but has to fight the air at the top of its range.
  const resistance = phys.aeroDrag * speedKmh * speedKmh + ROLLING_DRAG;

  if (throttle > 0) {
    // Constant-power engine: thrust ~ P / v, capped by tyre traction at low speed
    const thrust = Math.min(phys.tractionLimit, phys.enginePower / Math.max(1, speedKmh));

    let effectiveThrust;
    if (speedKmh < phys.climbFrom) {
      effectiveThrust = thrust;
    } else {
      // The last 25 km/h to the limiter: the air is immense there, so it takes ~29 seconds of
      // clean, wide-open throttle, tapering down smoothly to the limiter
      const span = phys.maxSpeed - phys.climbFrom;
      const progress = Math.min(1, Math.max(0, (speedKmh - phys.climbFrom) / span));
      const netFullThrottleAccel =
        CLIMB_START_ACCEL + (CLIMB_END_ACCEL - CLIMB_START_ACCEL) * Math.pow(progress, 0.75);
      effectiveThrust = resistance + netFullThrottleAccel;
    }

    // Part throttle settles at a cruising speed: ~125 km/h at 15%, ~185 km/h at 50%
    return effectiveThrust * throttle - resistance;
  }
  if (brake > 0) {
    return -phys.brakeDecel * brake; // Strong sport brakes
  }
  // Off throttle: engine braking + drag (bleeds speed faster at 200+), rolling to a stop
  return -(6 + resistance);
}

// Seconds from a standstill to `targetKmh` at full throttle
export function accelTime(phys, targetKmh) {
  const dt = 1 / 120;
  let speed = 0;
  let t = 0;
  while (speed < targetKmh && t < 60) {
    speed += longitudinalAccel(phys, speed, 1, 0) * dt;
    t += dt;
  }
  return t;
}

// Price of the next level of an upgrade track, or null once it is maxed out
export function upgradeCost(car, upgrade, currentLevel) {
  if (currentLevel >= MAX_UPGRADE_LEVEL) return null;
  const mult = car?.performance?.upgradeCost ?? DEFAULT_PERFORMANCE.upgradeCost;
  return Math.round((upgrade.baseCost * LEVEL_COST[currentLevel] * mult) / 50) * 50;
}

// Garage bars: each stat as 0..1 over the range the cars (and their upgrades) span
const BAR_RANGES = {
  topSpeed: [200, 340],
  accel: [5.0, 2.4], // 0→100 seconds: lower is better
  handling: [0.6, 1.4],
  braking: [0.6, 1.5],
};

export function statBars(stats) {
  const phys = resolvePhysics(stats);
  const norm = (key, value) => {
    const [lo, hi] = BAR_RANGES[key];
    return Math.min(1, Math.max(0.04, (value - lo) / (hi - lo)));
  };
  const zeroTo100 = accelTime(phys, 100);
  return {
    topSpeed: { value: stats.topSpeed, bar: norm('topSpeed', stats.topSpeed) },
    accel: { value: zeroTo100, bar: norm('accel', zeroTo100) },
    handling: { value: stats.handling, bar: norm('handling', stats.handling) },
    braking: { value: stats.braking, bar: norm('braking', stats.braking) },
  };
}
