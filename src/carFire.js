import * as THREE from 'three';

// A burning engine bay: flames licking up from the bonnet.
// Plain sprites (one material each, so every particle fades on its own) with no light source: a
// new light would make every material in the scene recompile its shader mid-drive. Counts and sizes are kept low because the sprites sit
// right in front of the camera, and big overlapping ones cost a phone's GPU a lot of fill.

const FLAME_COUNT = 20;

// A soft core for the flame tongues
let texture = null;
function getTexture() {
  if (texture) return texture;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.25)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
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
    this.intensity = 0; // 0..1, ramps up when lit and down when put out
    this.particles = [];

    for (let i = 0; i < FLAME_COUNT; i++) {
      const mat = new THREE.SpriteMaterial({
        map: getTexture(),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: FLAME_HOT.clone(),
        opacity: 0,
        fog: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.visible = false;
      sprite.renderOrder = 6;
      this.group.add(sprite);
      this.particles.push({ sprite, mat, age: 0, life: 0, vx: 0, vy: 0, vz: 0, size: 0 });
    }
    this.group.visible = false;
  }

  ignite() {
    this.active = true;
    this.group.visible = true;
    for (const p of this.particles) {
      // Stagger the first particles so the fire builds up instead of popping in as one puff
      this.respawn(p);
      p.age = -Math.random() * 0.5;
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
    p.life = 0.45 + Math.random() * 0.45;
    p.vy = (1.6 + Math.random() * 1.4) * s;
    p.size = (0.4 + Math.random() * 0.35) * s;
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

      // Hot yellow at the base, orange, then dark red as the tongue thins out at the top
      if (t < 0.4) p.mat.color.copy(FLAME_HOT).lerp(FLAME_MID, t / 0.4);
      else p.mat.color.copy(FLAME_MID).lerp(FLAME_COOL, (t - 0.4) / 0.6);
      const size = p.size * (1 - t * 0.65) * (0.85 + Math.sin(p.age * 40) * 0.15);
      p.sprite.scale.set(size, size * 1.5, 1);
      p.mat.opacity = (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85) * 0.75 * this.intensity;
    }
  }

  dispose() {
    for (const p of this.particles) p.mat.dispose();
    this.group.removeFromParent();
  }
}
