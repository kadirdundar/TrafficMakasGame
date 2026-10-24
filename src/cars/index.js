// Car registry: every folder with a car.js under src/cars/ is a playable car. The garage buttons,
// model credits, garage turntable, multiplayer peers and the 3D cockpit all read from here, so
// adding a car means adding a folder (see src/cars/README.md) and its GLB files.

const modules = import.meta.glob('./*/car.js', { eager: true });
const ALL = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.id.localeCompare(b.id));

// Garage list: cars marked `draft: true` stay hidden there but still load by id (preview pages)
export const CAR_LIST = ALL.filter((car) => !car.draft);

export const CARS = Object.fromEntries(ALL.map((car) => [car.id, car]));

export const DEFAULT_CAR_ID = CAR_LIST[0].id;

// Resolves a car id, also from older or looser names ('bmw', 'BMW M4') that may still be in
// localStorage or arrive from a friend running an older version. Falls back to the default car.
export function getCar(id) {
  if (!id) return CARS[DEFAULT_CAR_ID];
  if (CARS[id]) return CARS[id];
  const name = String(id).toLowerCase();
  return (
    ALL.find((car) => [car.id, ...(car.aliases || [])].some((alias) => name.includes(alias))) ||
    CARS[DEFAULT_CAR_ID]
  );
}

// Exterior model of a car (garage, online friends). The loader is fetched on first use so
// GLTFLoader stays out of the initial bundle.
export async function loadCarExterior(id, options) {
  const { loadExterior } = await import('./loadExterior.js');
  return loadExterior(getCar(id).exterior, options);
}
