// What makes one car drive and sound unlike another, beyond the stats in car.js → performance:
// its gearbox and engine (car.js → drivetrain) and how its body sits on the road (car.js →
// chassis). Fields are described in src/cars/README.md; a car that leaves a block out drives
// with the defaults below, the Audi A8 the game was first tuned on.

export const DEFAULT_DRIVETRAIN = Object.freeze({
  // Gear ratios from first up, final drive and the rolling circumference of the driven wheels (m)
  gears: [5.0, 3.2, 2.14, 1.72, 1.31, 1.0, 0.82, 0.64],
  finalDrive: 2.85,
  wheelCircumference: 2.23,
  idleRpm: 700,
  redline: 6500,
  // Revs the gearbox changes up at when cruising off the pedal; flat out it holds to the redline
  cruiseShiftRpm: 2100,
  // Seconds a gear change takes: no other change can follow sooner
  shiftSec: 0.4,
  cylinders: 8,
  // How much of the engine the cabin keeps out, 1 (limousine) to 0 (stripped sports car), and
  // how loud the turbos are over it (0 for an engine without one)
  insulation: 1,
  turbo: 1,
  // Pops and bangs from the exhaust when the gas is lifted at high revs (0: none, 1: loud)
  crackle: 0,
  // Sports cars only: lifting off sharply lets the turbo's blow-off and the exhaust pops be
  // heard; everyday cars stay quiet when the gas is lifted
  liftOffSound: false,
  // Under braking a sporty gearbox changes down early to keep the engine above these revs,
  // blipping the throttle on every change (0: it waits until the revs have fallen right off)
  brakeShiftRpm: 0,
  // Recorded engine sound set (src/engineSamples.js), or null for the synthesised engine alone
  engineSound: null,
});

export const DEFAULT_CHASSIS = Object.freeze({
  // Driven wheels: 'fwd' pushes wide under power, 'rwd' swings its tail, 'awd' does neither
  // and keeps its traction in the rain
  layout: 'awd',
  mass: 2100, // kg: what a knock from another car does to this one
  // Body lean in corners and dive / squat under the pedals, as multiples of the A8's
  roll: 1,
  pitch: 1,
});

export function resolveDrivetrain(car) {
  return { ...DEFAULT_DRIVETRAIN, ...car?.drivetrain };
}

export function resolveChassis(car) {
  return { ...DEFAULT_CHASSIS, ...car?.chassis };
}

// Engine revs at a road speed in a gear (1-based)
export function rpmInGear(drivetrain, speedKmh, gear) {
  const wheelRpm = (speedKmh / 3.6 / drivetrain.wheelCircumference) * 60;
  return wheelRpm * drivetrain.gears[gear - 1] * drivetrain.finalDrive;
}

// The gear an automatic box would be in next: one up past the shift point, or as many down as
// the pedal asks for (a kickdown may skip gears, as long as the lower gear is not itself past
// its shift point). Off the pedal it changes up early and cruises quietly; flat out it holds
// each gear to just under the redline. On the brakes a sporty box (brakeShiftRpm) changes down
// one gear at a time to keep the revs up, and does not change up again until the brake is off.
export function nextGear(drivetrain, speedKmh, gear, throttle, brake = 0) {
  const top = drivetrain.gears.length;
  const upshiftRpm = drivetrain.cruiseShiftRpm + throttle * (drivetrain.redline * 0.93 - drivetrain.cruiseShiftRpm);
  const braking = brake > 0.15 && drivetrain.brakeShiftRpm > 0;
  const kickdownRpm = 1150 + throttle * drivetrain.redline * 0.34;
  const downshiftRpm = braking ? Math.max(kickdownRpm, drivetrain.brakeShiftRpm) : kickdownRpm;
  // The lower gear must not land past this many revs
  const ceilingRpm = braking ? drivetrain.redline * 0.8 : upshiftRpm - 300;
  let target = Math.min(gear, top);
  if (!braking && target < top && rpmInGear(drivetrain, speedKmh, target) > upshiftRpm) return target + 1;
  while (
    target > 1 &&
    rpmInGear(drivetrain, speedKmh, target) < downshiftRpm &&
    rpmInGear(drivetrain, speedKmh, target - 1) < ceilingRpm
  ) {
    target -= 1;
    if (braking) break;
  }
  return target;
}

// Mass of the traffic the player can run into, by vehicle type (src/traffic.js → VEHICLE_TYPES)
export const TRAFFIC_MASS = { sedan: 1500, sport: 1500, suv: 2100, van: 2600, truck: 14000 };
