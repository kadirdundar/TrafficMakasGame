import * as THREE from 'three';

// Roadside buildings with windows drawn by their shader (no texture): glass that reflects the
// sky by day, a share of lit rooms at dusk and at night. The window grid comes from a `facade`
// attribute in window units, so every wall has whole windows whatever its size.

const WINDOW_W = 3.2; // m per window column
const FLOOR_H = 3.5; // m per floor

// Per weather: wall colour, glass colour, how many rooms are lit and how bright (0 = none)
const FACADE_LOOKS = {
  night: { wall: 0x0d1320, glass: 0x0a0f18, lights: 1.0 },
  rain: { wall: 0x10161f, glass: 0x0b1019, lights: 0.85 },
  sunset: { wall: 0x4a4550, glass: 0x1a2030, lights: 0.4 },
  day: { wall: 0x6c727c, glass: 0x1d2a3a, lights: 0 },
};

// BoxGeometry face order: +x, -x, +y, -y, +z, -z (4 vertices each with one segment).
// Roofs and floors get -1 (no windows).
export function addFacadeCoords(geo, width, height, depth, seed = 0) {
  const uv = geo.attributes.uv;
  const out = new Float32Array(uv.count * 2);
  const faces = [[depth, height], [depth, height], null, null, [width, height], [width, height]];
  for (let f = 0; f < 6; f++) {
    const size = faces[f];
    const cols = size ? Math.max(1, Math.round(size[0] / WINDOW_W)) : 0;
    const rows = size ? Math.max(1, Math.round(size[1] / FLOOR_H)) : 0;
    // Whole-window offset so walls do not all share the same lit pattern
    const offset = ((seed * 37 + f * 11) % 89) + 1;
    for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      out[i * 2] = size ? uv.getX(i) * cols + offset : -1;
      out[i * 2 + 1] = size ? uv.getY(i) * rows : -1;
    }
  }
  geo.setAttribute('facade', new THREE.BufferAttribute(out, 2));
  return geo;
}

export function createFacadeMaterial() {
  const uniforms = {
    facadeGlass: { value: new THREE.Color(FACADE_LOOKS.night.glass) },
    facadeLights: { value: FACADE_LOOKS.night.lights },
  };
  const material = new THREE.MeshStandardMaterial({
    color: FACADE_LOOKS.night.wall,
    roughness: 0.85,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 facade;\nvarying vec2 vFacade;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvFacade = facade;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec2 vFacade;
uniform vec3 facadeGlass;
uniform float facadeLights;
float facadeHash( vec2 p ) {
	return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
}`
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
	float facadeWall = step( 0.0, vFacade.x );
	vec2 facadeCell = floor( vFacade );
	vec2 facadeF = fract( vFacade );
	vec2 facadeAA = fwidth( vFacade );
	vec2 facadeLo = smoothstep( vec2( 0.2, 0.3 ) - facadeAA, vec2( 0.2, 0.3 ) + facadeAA, facadeF );
	vec2 facadeHi = 1.0 - smoothstep( vec2( 0.8, 0.8 ) - facadeAA, vec2( 0.8, 0.8 ) + facadeAA, facadeF );
	float facadeWin = facadeLo.x * facadeLo.y * facadeHi.x * facadeHi.y;
	// Where a window shrinks to a pixel or two, use the grid's average instead of shimmering
	float facadeFar = smoothstep( 0.3, 0.6, max( facadeAA.x, facadeAA.y ) );
	facadeWin = mix( facadeWin, 0.3, facadeFar ) * facadeWall;
	diffuseColor.rgb = mix( diffuseColor.rgb, facadeGlass, facadeWin );`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
	roughnessFactor = mix( roughnessFactor, 0.08, facadeWin );`
      )
      .replace(
        '#include <metalnessmap_fragment>',
        `#include <metalnessmap_fragment>
	metalnessFactor = mix( metalnessFactor, 0.2, facadeWin );`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
	if ( facadeLights > 0.0 ) {
		// About a third of the rooms lit, whole floors dark now and then, warm and cool lamps
		float facadeShare = 0.38 * facadeLights * step( 0.18, facadeHash( vec2( facadeCell.y, floor( facadeCell.x / 7.0 ) ) + 9.7 ) );
		float facadeOn = mix( step( 1.0 - facadeShare, facadeHash( facadeCell ) ), 0.34 * facadeLights, facadeFar );
		vec3 facadeTone = mix( vec3( 1.0, 0.55, 0.22 ), vec3( 0.6, 0.78, 1.0 ), step( 0.72, facadeHash( facadeCell + 17.3 ) ) );
		float facadeLevel = 0.35 + 0.65 * facadeHash( facadeCell + 5.1 );
		totalEmissiveRadiance += facadeTone * facadeLevel * facadeOn * facadeWin * 0.6;
	}`
      );
  };

  return {
    material,
    apply(key) {
      const look = FACADE_LOOKS[key] || FACADE_LOOKS.night;
      material.color.setHex(look.wall);
      uniforms.facadeGlass.value.setHex(look.glass);
      uniforms.facadeLights.value = look.lights;
    },
  };
}
