import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

// 2021 Porsche 911 Targa 4S (992). Model built by src/cars/porsche-911/convert.mjs.
// Field reference: src/cars/README.md
export default {
  id: 'porsche-911',
  order: 5,
  label: 'Porsche 911',
  make: 'PORSCHE',
  model: '911 TARGA 4S',
  variant: '992 · Twin-Turbo',
  aliases: ['porsche', '911', 'targa'],
  credit: {
    title: '2021 Porsche 911 Targa 4S',
    url: 'https://sketchfab.com/3d-models/2021-porsche-911-targa-4s-616ebc4356c74a3b8554c396eb3bd34c',
    author: 'DisneyCars',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    note: '(116 bin üçgenden 59 bin üçgene optimize edildi)',
  },

  exterior: {
    url: `${BASE}models/porsche-911.glb`,
    length: 4.52,
    envMapIntensity: 1.2,
    head: { day: 0.5, night: 1.6, highBeam: 3.2 },
    tail: { day: 0.35, night: 1.1, brake: 3.0 },
    lamps: [
      { match: /^headLight$/, role: 'head', emissive: 0xffffff, box: 'head' },
      { match: /^tailLight$/, role: 'tail', color: 0x3a0006, emissive: 0xff1428, removeMap: true, box: 'tail' },
    ],
    glow: {
      front: { color: 0xe4eeff, opacity: 0.95, size: [0.95, 0.48], from: 'head', inset: 0.23, offset: 0.06 },
      flare: { color: 0x9cc4ff, opacity: 0.95, size: [2.4, 1.3], offset: 0.1 },
      rear: { color: 0xff2032, opacity: 0.85, size: [0.85, 0.35], from: 'tail', inset: 0.15, offset: 0.05 },
    },
  },
};
