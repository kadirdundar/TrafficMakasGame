// İstanbul Park driving model: a car on four tyres (two axles: the "bicycle" model), driven in
// the road's own frame. Nothing here decides that the car should slide: each axle's tyres make
// as much side force as their slip angle and their load allow, and what the engine or the brakes
// take from a tyre is not there for cornering (the friction circle). Slides follow from that:
//
//  - too fast into a corner: the front tyres are past their peak, the car runs wide (understeer)
//  - lifting off or braking in a corner: the weight goes forward, the rear goes light and steps out
//  - power in a corner: driven rear tyres give up side grip (the tail comes round), driven front
//    tyres push the nose wide
//  - handbrake: locked rear tyres only drag, the tail swings round the front
//  - a quick change of direction: the tail arrives late and overshoots
//
// Everything is per unit of mass (accelerations in m/s²), so the car's weight drops out.
// Signs follow the game: x and the slide to the right are +, yaw and heading to the right are +,
// curvature of a right-hand bend is +.

const G = 9.81;
const WHEELBASE = 2.8;
const STEER_LOCK = 0.56; // rad at the front wheels, parking speed
// Tyre curve (Pacejka's "magic formula", peak 1): side force over slip angle. It peaks at
// PEAK_SLIP and falls to ~95 % for a tyre that is fully sliding, so a slide builds up and can be
// caught instead of snapping round.
const TYRE_C = 1.2;
const PEAK_SLIP = 0.13; // rad (~7.5°)
const TYRE_B = Math.tan(Math.PI / (2 * TYRE_C)) / PEAK_SLIP;
const LOAD_SENSITIVITY = 0.15; // a tyre loaded 10 % more grips 1.5 % less per kilo
// The most of a tyre's grip the ABS lets the brakes use: nearly all of it in a straight line,
// less with the wheel turned (so the car still steers), and less again at the rear (so the tail,
// light under braking, steps out gently instead of overtaking the nose)
const ABS_SHARE = 0.92;
const ABS_TURNING_FRONT = 0.72;
const ABS_TURNING_REAR = 0.5;
const SPIN_SHARE = 0.95; // ... and the engine, flat out in a low gear
// Traction control: as a driven axle nears its peak slip angle the engine is trimmed until it
// uses no more than this share of the grip there. The pedal is a key - all or nothing - so
// without it every corner exit would be a spin; with it full power still eases the tail out
// of a rear-driven car and the nose wide of a front-driven one.
const TRACTION_SHARE = 0.55;
const LOCKED_GRIP = 0.8; // a locked (handbrake) tyre against one that rolls
const MIN_ROLL_SPEED = 3; // m/s: below this the slip angles are taken as if rolling this fast
const SUBSTEP = 1 / 240;

// What the driver's hands do without being asked (the game is steered with keys or a thumb):
// Full input asks for the lock that takes the front tyres just past their peak at this speed
const LOCK_PAST_PEAK = 0.11; // rad
// Once the rear tyres slide (past CATCH_FROM of slip angle) the hands turn into the slide by
// this share of it, as a wheel let slip through the fingers does by itself
const CATCH_FROM = 0.1; // rad
const CATCH = 0.9;
// Stability control: a rear axle that slides is steadied with the brakes, by at most this much
// yaw (rad/s²) - about a third of what the tyres can do, so a slide that the pedals keep
// feeding still wins. Off while the handbrake is on.
const STABILITY_GAIN = 20;
const STABILITY_MAX = 2;
// Hands off, the car is lined up with the road again, with at most this much cornering
const STRAIGHTEN_G = 0.22;
const STRAIGHTEN_GAIN = 1.4;
// Stopped or crawling after a spin, the car is turned back the way the track runs
const RIGHTING_BELOW = 6; // m/s
const RIGHTING_RATE = 3; // per second

// Weight on the front axle, share of the drive that goes to it, and each axle's grip against
// the car's own: every layout pushes its nose a little at the limit until the pedals upset it
const LAYOUTS = {
  fwd: { front: 0.61, drive: 1, gripF: 0.9, gripR: 1.02 },
  awd: { front: 0.55, drive: 0.4, gripF: 0.9, gripR: 1.02 },
  rwd: { front: 0.5, drive: 0, gripF: 0.9, gripR: 1.02 },
};

export function createTrackCar() {
  return {
    vx: 0, // m/s along the car
    vy: 0, // m/s across it (+ = sliding to its right)
    yawRate: 0, // rad/s
    heading: 0, // rad, against the road's direction
    accel: 0, // m/s², smoothed: moves the weight between the axles
    // Read by the game after a step:
    speed: 0, // m/s over the ground
    progress: 0, // m/s along the track
    dx: 0, // m moved across the track in the last step
    slip: 0, // rad: how far the car points away from where it is going (the drift angle)
    course: 0, // rad: where it is going, against the road's direction
    lateralG: 0,
    longG: 0,
    frontSlide: 0, // 0..1: how far past their peak the front tyres are
    rearSlide: 0,
    wheelspin: 0, // 0..1
  };
}

export function resetTrackCar(car) {
  for (const key of Object.keys(car)) car[key] = 0;
}

// Sets how fast the car goes without changing where it goes (the game takes speed off in a
// crash or in the gravel)
export function setTrackCarSpeed(car, speedMs) {
  const v = Math.hypot(car.vx, car.vy);
  if (v > 0.01) {
    car.vx *= speedMs / v;
    car.vy *= speedMs / v;
  } else {
    car.vx = speedMs;
    car.vy = 0;
  }
}

// Thrown back off the barrier: the speed across the track is turned round and mostly lost, and
// the car is pulled most of the way into line
export function bounceTrackCar(car, restitution = 0.35) {
  const cos = Math.cos(car.heading);
  const sin = Math.sin(car.heading);
  const along = car.vx * cos - car.vy * sin;
  const across = -(car.vx * sin + car.vy * cos) * restitution;
  car.heading *= 0.25;
  const c2 = Math.cos(car.heading);
  const s2 = Math.sin(car.heading);
  car.vx = along * c2 + across * s2;
  car.vy = -along * s2 + across * c2;
  car.yawRate = 0;
}

function tyreCurve(slip) {
  return Math.sin(TYRE_C * Math.atan(TYRE_B * slip));
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// One frame. `input`:
//   steer -1..1, handsOff (no steering input at all), handbrake (bool)
//   drive: m/s² the engine puts through the driven tyres (negative: engine braking)
//   brake: m/s² the brake pedal asks for
//   drag: m/s² of air and rolling resistance
//   curvature: of the road here (1/m)
//   grip: the tyres' friction on this surface (1.6 = slicks on a dry track)
//   maxSpeed: m/s
// `setup`: { layout: 'fwd' | 'awd' | 'rwd', cgHeight: m }
export function stepTrackCar(car, dt, input, setup) {
  const layout = LAYOUTS[setup.layout] ?? LAYOUTS.awd;
  const a = WHEELBASE * (1 - layout.front); // centre of gravity to the front axle
  const b = WHEELBASE - a;
  const inertia = a * b; // yaw radius of gyration², a good guess for a road car
  const staticF = (G * b) / WHEELBASE;
  const staticR = (G * a) / WHEELBASE;
  const h = setup.cgHeight ?? 0.38;

  const steps = Math.max(1, Math.ceil(dt / SUBSTEP));
  const step = dt / steps;
  let dx = 0;
  let ds = 0;
  let latSum = 0;
  let longSum = 0;
  let slipF = 0;
  let slipR = 0;
  let spin = 0;

  for (let i = 0; i < steps; i++) {
    const { vx, vy, yawRate } = car;
    const v = Math.hypot(vx, vy);
    const forward = vx >= 0 ? 1 : -1;
    const roll = Math.max(Math.abs(vx), MIN_ROLL_SPEED);
    const frontVy = vy + a * yawRate;
    const rearVy = vy - b * yawRate;

    // Front wheel angle
    const lockNow = Math.min(STEER_LOCK, (WHEELBASE * input.grip * G) / Math.max(1, v * v) + LOCK_PAST_PEAK);
    let delta = input.steer * lockNow;
    if (vx > MIN_ROLL_SPEED) {
      const rearSlip = Math.atan2(rearVy, roll);
      delta += CATCH * Math.sign(rearSlip) * Math.max(0, Math.abs(rearSlip) - CATCH_FROM);
      if (input.handsOff && Math.abs(car.heading) < 1.2) {
        const course = car.heading + Math.atan2(vy, vx);
        const most = (STRAIGHTEN_G * G * WHEELBASE) / (v * v);
        delta += clamp(-STRAIGHTEN_GAIN * course - 0.25 * (yawRate - input.curvature * v), -most, most);
      }
    }
    delta = clamp(delta, -STEER_LOCK, STEER_LOCK);

    // Load on each axle: accelerating moves it back, braking forward
    const shift = (car.accel * h) / WHEELBASE;
    const loadF = Math.max(0.1 * G, staticF - shift);
    const loadR = Math.max(0.1 * G, staticR + shift);
    const gripF = input.grip * layout.gripF * (1 - LOAD_SENSITIVITY * (loadF / staticF - 1)) * loadF;
    const gripR = input.grip * layout.gripR * (1 - LOAD_SENSITIVITY * (loadR / staticR - 1)) * loadR;

    // Along the tyres: engine and brakes. The brakes are shared out by load and held just short
    // of locking; they work against the way the car rolls and fade out as it stops.
    const rolling = clamp(vx / 0.5, -1, 1);
    const drive = input.drive >= 0 ? input.drive : input.drive * Math.max(0, rolling);
    const turned = Math.min(1, Math.abs(input.steer));
    const brakeF = Math.min((input.brake * loadF) / G, (ABS_SHARE + (ABS_TURNING_FRONT - ABS_SHARE) * turned) * gripF);
    const brakeR = Math.min((input.brake * loadR) / G, (ABS_SHARE + (ABS_TURNING_REAR - ABS_SHARE) * turned) * gripR);
    const alphaF = Math.atan2(frontVy, roll) - delta * forward;
    const alphaR = Math.atan2(rearVy, roll);
    let driveF = drive * layout.drive;
    let driveR = drive * (1 - layout.drive);
    if (drive > 0) {
      const busyF = clamp(Math.abs(alphaF) / PEAK_SLIP - 0.4, 0, 1);
      const busyR = clamp(Math.abs(alphaR) / PEAK_SLIP - 0.4, 0, 1);
      driveF = Math.min(driveF, (SPIN_SHARE + (TRACTION_SHARE - SPIN_SHARE) * busyF) * gripF);
      driveR = Math.min(driveR, (SPIN_SHARE + (TRACTION_SHARE - SPIN_SHARE) * busyR) * gripR);
    }
    let fxF = driveF - brakeF * rolling;
    let fxR = driveR - brakeR * rolling;
    const usedF = Math.min(SPIN_SHARE, Math.abs(fxF) / gripF);
    const usedR = Math.min(SPIN_SHARE, Math.abs(fxR) / gripR);

    // Across the tyres: what is left of the friction circle, by slip angle
    const fyF = -gripF * Math.sqrt(1 - usedF * usedF) * tyreCurve(alphaF);
    let fyR = -gripR * Math.sqrt(1 - usedR * usedR) * tyreCurve(alphaR);
    if (input.handbrake) {
      // Locked rear tyres: plain friction against the way they slide over the road
      const rearV = Math.hypot(vx, rearVy);
      const drag = (LOCKED_GRIP * gripR * Math.min(1, rearV / 1)) / Math.max(0.001, rearV);
      fxR = -drag * vx;
      fyR = -drag * rearVy;
    }

    // Onto the car
    const cos = Math.cos(delta);
    const sin = Math.sin(delta);
    const air = input.drag * Math.min(1, v / 0.5);
    const frontX = fxF * cos - fyF * sin;
    const frontY = fxF * sin + fyF * cos;
    const ax = frontX + fxR - (air * vx) / Math.max(0.001, v);
    const ay = frontY + fyR - (air * vy) / Math.max(0.001, v);
    let yawAccel = (a * frontY - b * fyR) / inertia;
    if (!input.handbrake) {
      const sliding = Math.sign(alphaR) * Math.max(0, Math.abs(alphaR) - CATCH_FROM);
      yawAccel += clamp(STABILITY_GAIN * sliding, -STABILITY_MAX, STABILITY_MAX) * Math.min(1, v / 15);
    }

    car.vx += (ax + yawRate * vy) * step;
    car.vy += (ay - yawRate * vx) * step;
    car.yawRate += yawAccel * step;
    car.accel += (ax - car.accel) * Math.min(1, step * 8);

    const vNow = Math.hypot(car.vx, car.vy);
    if (vNow > input.maxSpeed) {
      car.vx *= input.maxSpeed / vNow;
      car.vy *= input.maxSpeed / vNow;
    }

    // Over the track. It never runs backwards under the car: one that has spun round slides on
    // tail first, and is turned back once it has all but stopped.
    const hc = Math.cos(car.heading);
    const hs = Math.sin(car.heading);
    const along = Math.max(0, car.vx * hc - car.vy * hs);
    const across = car.vx * hs + car.vy * hc;
    car.heading += (car.yawRate - input.curvature * along) * step;
    if (vNow < RIGHTING_BELOW) {
      const pull = Math.min(1, step * RIGHTING_RATE * (1 - vNow / RIGHTING_BELOW));
      car.heading -= car.heading * pull;
      car.yawRate -= car.yawRate * pull;
      car.vy -= car.vy * pull;
    }
    if (car.heading > Math.PI) car.heading -= 2 * Math.PI;
    else if (car.heading < -Math.PI) car.heading += 2 * Math.PI;

    dx += across * step;
    ds += along * step;
    latSum += ay;
    longSum += ax;
    slipF = Math.max(slipF, Math.abs(alphaF));
    slipR = Math.max(slipR, input.handbrake && v > 3 ? 1 : Math.abs(alphaR));
    if (input.drive > 0) spin = Math.max(spin, layout.drive > 0 ? usedF : 0, layout.drive < 1 ? usedR : 0);
  }

  const speed = Math.hypot(car.vx, car.vy);
  const moving = Math.min(1, speed / 4);
  car.speed = speed;
  car.progress = ds / dt;
  car.dx = dx;
  car.slip = speed > 0.5 ? Math.atan2(car.vy, car.vx) * moving : 0;
  car.course = Math.atan2(Math.sin(car.heading + car.slip), Math.cos(car.heading + car.slip));
  car.lateralG = latSum / steps / G;
  car.longG = longSum / steps / G;
  car.frontSlide = clamp((slipF / PEAK_SLIP - 0.7) / 1.3, 0, 1) * moving;
  car.rearSlide = clamp((slipR / PEAK_SLIP - 0.7) / 1.3, 0, 1) * moving;
  car.wheelspin = spin;
  return car;
}
