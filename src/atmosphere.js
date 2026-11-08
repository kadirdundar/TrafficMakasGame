import * as THREE from 'three';

// Sky, haze and colour grade for the driving scene, built to cost next to nothing per frame:
// - The sky is one analytic shader on a dome drawn last among the opaque objects, so the GPU
//   only shades the pixels where it shows (no sky texture, no extra pass).
// - Distant objects fade into the same sky colour they stand against (sun glow included), and
//   are fully faded before the far plane, so nothing pops in at the end of the view.
// - Car paint, chrome and glass reflect that sky: it is baked into the environment map once per
//   weather change (PMREM), not every frame.
// - The colour grade (white balance, contrast, saturation) runs inside the tone mapping every
//   material already does, so it needs no post-processing pass either.
//
// The per-weather values are shared by every material through four uniforms whose values are
// Float32Arrays: three.js clones a material's built-in uniforms but keeps typed arrays by
// reference, so changing the weather is a few array writes, with no shader rebuilt.

const shared = {
  atmoFog: new Float32Array(4), // rgb: haze colour at the horizon (linear), a: far fade start (m)
  atmoGlow: new Float32Array(4), // rgb: haze glow towards the sun / moon (linear), a: far fade end (m)
  atmoSun: new Float32Array([0, 1, 0, 8]), // xyz: direction to the sun / moon, w: glow tightness
  atmoGrade: new Float32Array(4), // x: red balance - 1, y: blue balance - 1, z: contrast - 1, w: saturation - 1
};

// Far fade: from this view depth objects start dissolving into the haze, fully gone at the end.
// The main camera draws to 360 m; the mirror (150 m) and drone camera (420 m) use the same fade.
const FADE_START = 215;
const FADE_END = 345;

// Sky colours are display colours (what the screen shows for the horizon), like the old flat
// background colours. sunDir points from the scene towards the sun / moon; it only places the
// sky's disc and glow: the scene's directional light keeps the direction the cabin was tuned with.
// envFill / envBand ([colour, strength]) only go into the reflections: an even fill over the
// upper sky and a bright band along the horizon (city and streetlight glow). At night the sky
// alone is too dark to light the cabin and the asphalt sheen the way they were tuned.
const LOOKS = {
  night: {
    zenith: 0x03060f,
    horizon: 0x18213a,
    ground: 0x0b101b,
    sunDir: [-0.42, 0.3, -0.86],
    disc: 0xdde6ff,
    discSize: 1.5, // degrees
    discGlow: 0.18,
    glow: 0x2b3c66,
    glowPower: 18,
    stars: 1,
    lampRow: 0xffc27a,
    lampRowIntensity: 3.2,
    envFill: [0x5a74a0, 0.65],
    envBand: [0xc4d0e4, 1.5],
    envIntensity: 0.85,
    grade: { red: 0.985, blue: 1.035, contrast: 1.06, saturation: 1.06 },
  },
  rain: {
    zenith: 0x080d17,
    horizon: 0x1b2333,
    ground: 0x0a0e16,
    sunDir: [-0.3, 0.8, -0.5],
    disc: 0x000000,
    discSize: 0,
    discGlow: 0,
    glow: 0x000000,
    glowPower: 8,
    stars: 0,
    lampRow: 0xffc27a,
    lampRowIntensity: 3.6,
    envFill: [0x5a74a0, 0.55],
    envBand: [0xc4d0e4, 0.75],
    envIntensity: 0.85,
    grade: { red: 0.975, blue: 1.03, contrast: 1.04, saturation: 0.92 },
  },
  sunset: {
    zenith: 0x22285a,
    horizon: 0xd47d5c,
    ground: 0x2b1b20,
    sunDir: [-0.42, 0.075, -0.9],
    disc: 0xffe2b0,
    discSize: 1.6,
    discGlow: 0.5,
    glow: 0xff8a40,
    glowPower: 7,
    stars: 0,
    lampRow: 0xffb066,
    lampRowIntensity: 1.2,
    envFill: [0x707a98, 1.0],
    envBand: [0xd0d4e0, 1.0],
    envIntensity: 0.7,
    grade: { red: 1.0, blue: 0.99, contrast: 1.06, saturation: 1.0 },
  },
  day: {
    zenith: 0x2d6ccc,
    horizon: 0xb5cfea,
    ground: 0x4f5764,
    sunDir: [-0.33, 0.77, -0.55],
    disc: 0xfffbea,
    discSize: 1.1,
    discGlow: 0.35,
    glow: 0xfff0d0,
    glowPower: 10,
    stars: 0,
    lampRow: 0x000000,
    lampRowIntensity: 0,
    envFill: [0x000000, 0],
    envBand: [0x000000, 0],
    envIntensity: 1.0,
    grade: { red: 1.01, blue: 0.99, contrast: 1.06, saturation: 1.05 },
  },
};

// --- Shader chunks -------------------------------------------------------------------------

const FOG_PARS_VERTEX = /* glsl */ `
#ifdef USE_FOG
	varying float vFogDepth;
	varying vec3 vFogView;
#endif`;

const FOG_VERTEX = /* glsl */ `
#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
	vFogView = mvPosition.xyz;
#endif`;

const FOG_PARS_FRAGMENT = /* glsl */ `
#ifdef USE_FOG
	uniform vec3 fogColor;
	uniform vec4 atmoFog;
	uniform vec4 atmoGlow;
	uniform vec4 atmoSun;
	varying float vFogDepth;
	varying vec3 vFogView;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`;

// Same haze as the sky dome draws at the horizon: horizon colour plus the glow around the sun,
// in linear, then encoded like the fragment it is mixed into (screen: sRGB, mirror: linear)
const FOG_FRAGMENT = /* glsl */ `
#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	vec3 fogTint = fogColor;
	if ( atmoGlow.a > atmoFog.a ) fogFactor = max( fogFactor, smoothstep( atmoFog.a, atmoGlow.a, vFogDepth ) );
	// The cabin and the near road (most of the screen) have next to no haze: skip its colour
	if ( atmoGlow.a > atmoFog.a && fogFactor > 0.004 ) {
		vec3 fogDir = normalize( ( vec4( vFogView, 0.0 ) * viewMatrix ).xyz );
		float fogSun = pow( max( dot( fogDir, atmoSun.xyz ), 0.0 ), atmoSun.w );
		fogTint = linearToOutputTexel( vec4( atmoFog.rgb + atmoGlow.rgb * fogSun, 1.0 ) ).rgb;
	}
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogTint, fogFactor );
#endif`;

// Scene-linear grade, then the same ACES fit three.js uses. Contrast pivots around middle grey
// on luminance (RGB scaled together, so hues do not shift). All-zero uniforms = plain ACES.
const CUSTOM_TONE_MAPPING = /* glsl */ `
uniform vec4 atmoGrade;
vec3 CustomToneMapping( vec3 color ) {
	color *= toneMappingExposure * vec3( 1.0 + atmoGrade.x, 1.0, 1.0 + atmoGrade.y );
	float gradeLuma = dot( color, vec3( 0.2126, 0.7152, 0.0722 ) );
	color *= pow( max( gradeLuma, 1e-4 ) / 0.18, atmoGrade.z );
	float gradeGray = dot( color, vec3( 0.2126, 0.7152, 0.0722 ) );
	color = max( mix( vec3( gradeGray ), color, 1.0 + atmoGrade.w ), 0.0 );
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ), vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3( 1.60475, -0.10208, -0.00327 ), vec3( -0.53108, 1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605, 1.07602 )
	);
	color = ACESInputMat * ( color / 0.6 );
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}`;

let installed = false;

// Patches three.js' fog and custom tone mapping chunks and gives every built-in material the
// shared uniforms. Must run before the first material is compiled (on import of this module).
function installShaderChunks() {
  if (installed) return;
  installed = true;

  const chunk = THREE.ShaderChunk;
  const stockCustom = 'vec3 CustomToneMapping( vec3 color ) { return color; }';
  if (!chunk.tonemapping_pars_fragment.includes(stockCustom)) {
    console.warn('atmosphere: tone mapping chunk changed, colour grade disabled');
  } else {
    chunk.tonemapping_pars_fragment = chunk.tonemapping_pars_fragment.replace(stockCustom, CUSTOM_TONE_MAPPING);
  }
  chunk.fog_pars_vertex = FOG_PARS_VERTEX;
  chunk.fog_vertex = FOG_VERTEX;
  chunk.fog_pars_fragment = FOG_PARS_FRAGMENT;
  chunk.fog_fragment = FOG_FRAGMENT;

  for (const lib of Object.values(THREE.ShaderLib)) {
    for (const [name, value] of Object.entries(shared)) lib.uniforms[name] = { value };
  }
}

installShaderChunks();

// --- Sky dome ------------------------------------------------------------------------------

// The gradient and the glow change slowly across the sky, so they are worked out per vertex of
// a finely divided dome and interpolated: per pixel, the sky costs a texture-free colour lookup
// plus the sun / moon disc and the stars where they are. Encoded to the output colour space in
// the vertex shader (sRGB on screen, linear in the mirror and the environment bake).
const SKY_UNIFORMS = /* glsl */ `
uniform vec3 skyZenith;
uniform vec3 skyGround;
uniform vec4 skyDisc; // rgb: sun / moon colour, a: cosine of its angular radius
uniform vec4 skyLamps; // rgb: streetlight colour baked into the reflections, a: intensity
uniform vec3 skyEnvFill;
uniform vec3 skyEnvBand;
uniform float skyStars;
uniform float skyDiscGlow;
uniform float skyEnvBake; // 1 while baking the environment map
uniform float skyEncode; // 1 when drawing to the screen (sRGB)
uniform vec4 atmoFog;
uniform vec4 atmoGlow;
uniform vec4 atmoSun;
varying vec3 vSkyDir;
varying vec3 vSkyColor;
`;

const SKY_VERTEX = /* glsl */ `
${SKY_UNIFORMS}
vec3 skySRGB( vec3 c ) {
	return mix( pow( c, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), c * 12.92, vec3( lessThanEqual( c, vec3( 0.0031308 ) ) ) );
}
void main() {
	vec3 dir = normalize( position );
	float y = dir.y;
	vec3 col = mix( atmoFog.rgb, skyZenith, pow( clamp( y, 0.0, 1.0 ), 0.55 ) );
	col = mix( col, skyGround, smoothstep( 0.0, -0.12, y ) );
	// Same glow as the haze (fog_fragment), so the horizon meets distant objects seamlessly
	col += atmoGlow.rgb * pow( max( dot( dir, atmoSun.xyz ), 0.0 ), atmoSun.w );
	vSkyColor = skyEncode > 0.5 ? skySRGB( max( col, 0.0 ) ) : col;
	vSkyDir = position;
	// Rotation only: the sky stays put however far the camera moves; drawn at the far plane
	vec4 clip = projectionMatrix * vec4( ( viewMatrix * vec4( position, 0.0 ) ).xyz, 1.0 );
	gl_Position = clip.xyww;
}`;

const SKY_FRAGMENT = /* glsl */ `
${SKY_UNIFORMS}
float skyHash( vec3 p ) {
	p = fract( p * 0.3183099 + 0.1 );
	p *= 17.0;
	return fract( p.x * p.y * p.z * ( p.x + p.y + p.z ) );
}

void main() {
	vec3 col = vSkyColor;
	vec3 dir = normalize( vSkyDir );
	float y = dir.y;

	if ( skyEnvBake < 0.5 ) {
		// Sun / moon disc with a tight halo, only near it
		float mu = dot( dir, atmoSun.xyz );
		if ( mu > 0.99 ) {
			float edge = 1.0 - skyDisc.a;
			col += skyDisc.rgb * smoothstep( skyDisc.a - edge * 0.25, skyDisc.a + edge * 0.1, mu );
			col += skyDisc.rgb * skyDiscGlow * pow( mu, 900.0 );
		}

		// Stars: one in a few hundred cells of a grid around the camera, fading near the horizon
		if ( skyStars > 0.0 && y > 0.04 ) {
			vec3 p = dir * 150.0;
			vec3 cell = floor( p );
			float h = skyHash( cell );
			if ( h > 0.992 ) {
				vec3 centre = cell + 0.5 + ( vec3( skyHash( cell + 7.1 ), skyHash( cell + 3.7 ), skyHash( cell + 1.3 ) ) - 0.5 ) * 0.5;
				float star = smoothstep( 0.24, 0.0, length( p - centre ) ) * ( h - 0.992 ) * 125.0;
				col += vec3( 0.75, 0.82, 1.0 ) * star * skyStars * smoothstep( 0.04, 0.3, y );
			}
		}
	} else {
		// Reflections only (linear): fill, horizon glow and a row of streetlights along both sides
		col += skyEnvFill * smoothstep( -0.1, 0.3, y );
		float band = ( y - 0.03 ) / 0.1;
		col += skyEnvBand * exp( - band * band );
		float lamps = pow( abs( dir.x ), 6.0 ) * pow( 0.5 + 0.5 * cos( dir.z * 40.0 ), 24.0 );
		col += skyLamps.rgb * skyLamps.a * lamps * smoothstep( 0.05, 0.0, abs( y - 0.2 ) );
	}

	gl_FragColor = vec4( col, 1.0 );
}`;

// Tells the sky shader whether this draw goes to the screen (encode to sRGB) or to a render
// target (mirror, environment bake: linear)
function skyBeforeRender(renderer) {
  this.material.uniforms.skyEncode.value =
    renderer.getRenderTarget() === null && renderer.outputColorSpace === THREE.SRGBColorSpace ? 1 : 0;
}

const _c = new THREE.Color();
const _v = new THREE.Vector3();

function setLinear(arr, offset, hex, scale = 1) {
  _c.setHex(hex); // THREE.Color stores the linear working colour of an sRGB hex
  arr[offset] = _c.r * scale;
  arr[offset + 1] = _c.g * scale;
  arr[offset + 2] = _c.b * scale;
}

export class Atmosphere {
  constructor(scene, renderer = null) {
    this.scene = scene;
    this.renderer = renderer;
    this.look = null;

    const geometry = new THREE.SphereGeometry(1, 96, 48);
    this.uniforms = {
      skyZenith: { value: new THREE.Color() },
      skyGround: { value: new THREE.Color() },
      skyDisc: { value: new THREE.Vector4() },
      skyLamps: { value: new THREE.Vector4() },
      skyStars: { value: 0 },
      skyDiscGlow: { value: 0 },
      skyEnvBake: { value: 0 },
      skyEncode: { value: 1 },
      skyEnvFill: { value: new THREE.Color() },
      skyEnvBand: { value: new THREE.Color() },
      atmoFog: { value: shared.atmoFog },
      atmoGlow: { value: shared.atmoGlow },
      atmoSun: { value: shared.atmoSun },
    };
    this.material = new THREE.ShaderMaterial({
      name: 'AtmosphereSky',
      uniforms: this.uniforms,
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      toneMapped: false, // display colours, like the haze it meets at the horizon
    });

    this.dome = new THREE.Mesh(geometry, this.material);
    this.dome.name = 'sky';
    this.dome.frustumCulled = false;
    this.dome.renderOrder = 1000; // after every other opaque object: only visible sky is shaded
    this.dome.matrixAutoUpdate = false;
    this.dome.onBeforeRender = skyBeforeRender;
    scene.add(this.dome);

    if (renderer) {
      // Environment map bake: the same dome, alone in its scene, into a small cube map
      this.envScene = new THREE.Scene();
      const envDome = new THREE.Mesh(geometry, this.material);
      envDome.frustumCulled = false;
      envDome.onBeforeRender = skyBeforeRender;
      this.envScene.add(envDome);
      this.cubeTarget = new THREE.WebGLCubeRenderTarget(64, { type: THREE.HalfFloatType });
      this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.cubeTarget);
      this.envScene.add(this.cubeCamera);
      this.pmrem = new THREE.PMREMGenerator(renderer);
      this.envTarget = null;
    }
  }

  // Applies a weather's sky, haze and grade. fogDensity keeps the preset's near haze.
  apply(key) {
    const look = LOOKS[key] || LOOKS.night;
    this.look = look;

    setLinear(shared.atmoFog, 0, look.horizon);
    shared.atmoFog[3] = FADE_START;
    setLinear(shared.atmoGlow, 0, look.glow, 0.6);
    shared.atmoGlow[3] = FADE_END;
    _v.fromArray(look.sunDir).normalize();
    shared.atmoSun[0] = _v.x;
    shared.atmoSun[1] = _v.y;
    shared.atmoSun[2] = _v.z;
    shared.atmoSun[3] = look.glowPower;

    const g = look.grade;
    shared.atmoGrade[0] = g.red - 1;
    shared.atmoGrade[1] = g.blue - 1;
    shared.atmoGrade[2] = g.contrast - 1;
    shared.atmoGrade[3] = g.saturation - 1;

    const u = this.uniforms;
    u.skyZenith.value.setHex(look.zenith);
    u.skyGround.value.setHex(look.ground);
    _c.setHex(look.disc);
    // No disc (overcast): black, with a valid radius so the shader's smoothstep stays defined
    const discCos = Math.cos(THREE.MathUtils.degToRad(look.discSize || 1) * 0.5);
    const discScale = look.discSize > 0 ? 4 : 0;
    u.skyDisc.value.set(_c.r * discScale, _c.g * discScale, _c.b * discScale, discCos);
    u.skyDiscGlow.value = look.discGlow;
    u.skyStars.value = look.stars;
    _c.setHex(look.lampRow);
    u.skyLamps.value.set(_c.r, _c.g, _c.b, look.lampRowIntensity);
    u.skyEnvFill.value.setHex(look.envFill[0]).multiplyScalar(look.envFill[1]);
    u.skyEnvBand.value.setHex(look.envBand[0]).multiplyScalar(look.envBand[1]);

    // Clear colour = horizon, for any frame or render target the dome does not cover
    if (this.renderer) {
      this.renderer.setClearColor(look.horizon);
      this.bakeEnvironment();
    }
    this.scene.background = null;
    this.scene.environmentIntensity = look.envIntensity;
    return look;
  }

  // Sky (without sun disc and stars, with the streetlight row) into scene.environment.
  // Runs on a weather change only: a 64 px cube and its prefiltered mips, a few ms of GPU.
  bakeEnvironment() {
    if (!this.pmrem) return;
    this.uniforms.skyEnvBake.value = 1;
    this.cubeCamera.update(this.renderer, this.envScene);
    this.uniforms.skyEnvBake.value = 0;
    this.envTarget = this.pmrem.fromCubemap(this.cubeTarget.texture, this.envTarget);
    this.scene.environment = this.envTarget.texture;
  }
}
