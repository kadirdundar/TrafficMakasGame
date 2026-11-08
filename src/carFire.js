import * as THREE from 'three';

// A burning engine bay: flames licking up from the bonnet and black smoke rising above them, or,
// one hit before that, just grey smoke (smoulder). Plain sprites (one material each, so every
// particle fades on its own) with no light source: a new light would make every material in the
// scene recompile its shader mid-drive. Counts and sizes are kept low because the sprites sit
// right in front of the camera, and big overlapping ones cost a phone's GPU a lot of fill.

const FLAME_COUNT = 20;
const SMOKE_COUNT = 12;
const SMOKE_BLACK = new THREE.Color(0x111113);
const SMOKE_GREY = new THREE.Color(0xc2c4ca);

// Soft round puff for smoke, a tighter core for the flame tongues
const textures = {};
function getTexture(kind) {
  if (textures[kind]) return textures[kind];
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  if (kind === 'flame') {
    g.addColorStop(0.25, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.25)');
  } else {
    g.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  }
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  textures[kind] = new THREE.CanvasTexture(canvas);
  textures[kind].colorSpace = THREE.SRGBColorSpace;
  return textures[kind];
}

const FLAME_HOT = new THREE.Color(0xffa63d);
const FLAME_MID = new THREE.Color(0xf05a12);
const FLAME_COOL = new THREE.Color(0x8a1606);

export class CarFire {
  // `width` is roughly the bonnet width the flames spread over
  constructor({ width = 1.2, scale = 1 } = {}) {
    this.group = new THREE.Group();
    this.width = width;
    this.scale = scale;
    this.active = false;
    this.flames = true; // false while it only smoulders
    this.intensity = 0; // 0..1, ramps up when lit and down when put out
    this.particles = [];

    for (let i = 0; i < SMOKE_COUNT + FLAME_COUNT; i++) {
      const flame = i >= SMOKE_COUNT; // smoke first, so flames draw over it
      const mat = new THREE.SpriteMaterial({
        map: getTexture(flame ? 'flame' : 'smoke'),
        transparent: true,
        depthWrite: false,
        blending: flame ? THREE.AdditiveBlending : THREE.NormalBlending,
        color: flame ? FLAME_HOT.clone() : SMOKE_BLACK.clone(),
        opacity: 0,
        fog: !flame,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.visible = false;
      sprite.renderOrder = flame ? 6 : 5;
      this.group.add(sprite);
      this.particles.push({ sprite, mat, flame, age: 0, life: 0, vx: 0, vy: 0, vz: 0, size: 0 });
    }
    this.group.visible = false;
  }

  ignite() {
    this.start(true);
  }

  // Grey smoke from the bonnet only: the car is one hit from burning
  smoulder() {
    this.start(false);
  }

  start(flames) {
    this.active = true;
    this.flames = flames;
    this.group.visible = true;
    for (const p of this.particles) {
      if (!p.flame) p.mat.color.copy(flames ? SMOKE_BLACK : SMOKE_GREY);
      // Stagger the first particles so the fire builds up instead of popping in as one puff
      if (p.flame && !flames) continue;
      this.respawn(p);
      p.age = -Math.random() * (p.flame ? 0.5 : 1.2);
    }
  }

  extinguish() {
    this.active = false;
  }

  reset() {
    this.active = false;
    this.intensity = 0;
    this.group.visible = false;
    for (const p of this.particles) p.sprite.visible = false;
  }

  respawn(p) {
    const s = this.scale;
    p.age = 0;
    p.sprite.position.set(
      (Math.random() - 0.5) * this.width * s,
      Math.random() * 0.1 * s,
      (Math.random() - 0.5) * 0.7 * s
    );
    if (p.flame) {
      p.life = 0.45 + Math.random() * 0.45;
      p.vy = (1.6 + Math.random() * 1.4) * s;
      p.size = (0.4 + Math.random() * 0.35) * s;
    } else if (this.flames) {
      p.life = 1.6 + Math.random() * 1.0;
      p.vy = (1.1 + Math.random() * 0.7) * s;
      p.size = (0.7 + Math.random() * 0.5) * s;
      p.sprite.position.y += 0.5 * s;
    } else {
      // Smouldering: slow wisps that hang low over the bonnet, where the driver sees them
      p.life = 1.4 + Math.random() * 0.8;
      p.vy = (0.25 + Math.random() * 0.3) * s;
      p.size = (0.55 + Math.random() * 0.4) * s;
    }
    p.vx = (Math.random() - 0.5) * 0.5 * s;
    p.vz = (0.2 + Math.random() * 0.5) * s; // drift back over the windscreen
  }

  update(dt) {
    if (!this.group.visible) return;
    this.intensity = THREE.MathUtils.clamp(this.intensity + (this.active ? dt * 2.5 : -dt * 0.8), 0, 1);
    if (!this.active && this.intensity <= 0) {
      this.reset();
      return;
    }

    for (const p of this.particles) {
      if (p.flame && !this.flames) {
        p.sprite.visible = false;
        continue;
      }
      p.age += dt;
      if (p.age < 0) {
        p.sprite.visible = false;
        continue;
      }
      if (p.age >= p.life) {
        if (!this.active) {
          p.sprite.visible = false;
          continue;
        }
        this.respawn(p);
      }
      const t = p.age / p.life;
      const pos = p.sprite.position;
      pos.x += p.vx * dt;
      pos.y += p.vy * dt;
      pos.z += p.vz * dt;
      p.sprite.visible = true;

      if (p.flame) {
        // Hot yellow at the base, orange, then dark red as the tongue thins out at the top
        if (t < 0.4) p.mat.color.copy(FLAME_HOT).lerp(FLAME_MID, t / 0.4);
        else p.mat.color.copy(FLAME_MID).lerp(FLAME_COOL, (t - 0.4) / 0.6);
        const size = p.size * (1 - t * 0.65) * (0.85 + Math.sin(p.age * 40) * 0.15);
        p.sprite.scale.set(size, size * 1.5, 1);
        p.mat.opacity = (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85) * 0.75 * this.intensity;
      } else {
        const size = p.size * (1 + t * 2);
        p.sprite.scale.set(size, size, 1);
        const peak = this.flames ? 0.8 : 0.7; // thin enough to see the road through
        p.mat.opacity = (t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8) * peak * this.intensity;
      }
    }
  }

  dispose() {
    for (const p of this.particles) p.mat.dispose();
    this.group.removeFromParent();
  }
}
