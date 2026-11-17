// Recorded engine sounds (src/audio.js plays them): each set is one WAV in public/audio/engines/
// holding a loop per engine speed. A car uses a set through car.js → drivetrain.engineSound; a
// car without one keeps the synthesised engine alone.
//
// The loops were cut from the recordings below (Freesound previews): at each speed a stretch of a
// slow rev-up was resampled to hold one pitch, trimmed to whole engine cycles and joined
// end to start, so each one plays as a steady engine at `rpm`. `start` / `length` are in samples
// of the file (`rate`). The file is mono 16-bit.

export const ENGINE_SAMPLES = {
  // Cross-plane V8: the idle of one American V8 and a slow rev-up of another (a 350 cu in Chevy,
  // heard from the engine bay)
  v8: {
    file: 'v8.wav',
    rate: 22050,
    loops: [
      { rpm: 735, start: 662, length: 25381 },
      { rpm: 1500, start: 27367, length: 24446 },
      { rpm: 2000, start: 53137, length: 23988 },
      { rpm: 2500, start: 78449, length: 24790 },
      { rpm: 3000, start: 104563, length: 25154 },
      { rpm: 3500, start: 131041, length: 24493 },
      { rpm: 4000, start: 156858, length: 25330 },
      { rpm: 4500, start: 183512, length: 23354 },
      { rpm: 5000, start: 208190, length: 23696 },
      { rpm: 5500, start: 233210, length: 23645 },
    ],
    credits: [
      {
        title: 'Eight-cylinder engine idling',
        author: 'Lumamorph',
        url: 'https://freesound.org/people/Lumamorph/sounds/636066/',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        title: '1953 Studebaker Idle up to 6000rpm',
        author: 'lonemonk',
        url: 'https://freesound.org/people/lonemonk/sounds/238847/',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
    ],
  },
};

// Decoded sets, shared by every car that uses them (a promise per set and audio context)
const decoded = new WeakMap();

export function loadEngineSamples(ctx, id) {
  const set = ENGINE_SAMPLES[id];
  if (!set) return Promise.resolve(null);
  let perCtx = decoded.get(ctx);
  if (!perCtx) decoded.set(ctx, (perCtx = new Map()));
  if (!perCtx.has(id)) {
    const url = `${import.meta.env.BASE_URL}audio/engines/${set.file}`;
    perCtx.set(
      id,
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`${url}: ${r.status}`);
          return r.arrayBuffer();
        })
        .then((data) => ctx.decodeAudioData(data))
        .then((buffer) => ({ id, buffer, set }))
        .catch((err) => {
          perCtx.delete(id); // try again next time
          throw err;
        })
    );
  }
  return perCtx.get(id);
}
