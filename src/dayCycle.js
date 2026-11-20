// Day and night follow the distance driven: night → dawn → day → dusk → night, each held for a
// stretch of road and faded slowly into the next over several kilometres. The drive starts at
// the weather the player picked; rain holds as it is (it was asked for), and so does an online
// race (the host's weather is shared).
import { WEATHER_PRESETS } from './world.js';

const PHASES = [
  { key: 'night', holdKm: 30 },
  { key: 'sunset', holdKm: 8 }, // dawn
  { key: 'day', holdKm: 30 },
  { key: 'sunset', holdKm: 8 }, // dusk
];
const FADE_KM = 6;
const CYCLE_KM = PHASES.reduce((sum, p) => sum + p.holdKm + FADE_KM, 0);

const smooth = (t) => t * t * (3 - 2 * t);

export class DayCycle {
  constructor(world) {
    this.world = world;
    this.anchor(world.weatherKey, 0);
  }

  // Start the cycle at the beginning of `key`'s phase at trip distance `km` (a picked sunset is
  // the evening one, which leads into the night)
  anchor(key, km) {
    this.startIndex = key === 'sunset' ? 3 : PHASES.findIndex((p) => p.key === key);
    this.anchorKm = km;
    this.fading = false;
    this.phase = this.startIndex;
  }

  // Returns the preset when the weather key changed (for the HUD), else null
  update(km, enabled) {
    if (!enabled || this.startIndex < 0) return null;
    const world = this.world;
    const before = world.weatherKey;
    const beforePhase = this.phase;
    let d = (((km - this.anchorKm) % CYCLE_KM) + CYCLE_KM) % CYCLE_KM;
    for (let n = 0; n < PHASES.length; n++) {
      const i = (this.startIndex + n) % PHASES.length;
      const phase = PHASES[i];
      if (d < phase.holdKm) {
        this.phase = i;
        if (this.fading || world.weatherKey !== phase.key) {
          this.fading = false;
          world.applyWeather(phase.key);
        }
        break;
      }
      d -= phase.holdKm;
      if (d < FADE_KM) {
        this.fading = true;
        this.phase = d < FADE_KM / 2 ? i : (i + 1) % PHASES.length;
        world.blendWeather(phase.key, PHASES[(i + 1) % PHASES.length].key, smooth(d / FADE_KM));
        break;
      }
      d -= FADE_KM;
    }
    if (world.weatherKey === before && this.phase === beforePhase) return null;
    const preset = WEATHER_PRESETS[world.weatherKey];
    // The morning shares the dusk's light, not its name
    return this.phase === 1 ? { ...preset, label: 'Gün Doğumu', icon: '🌅' } : preset;
  }
}
