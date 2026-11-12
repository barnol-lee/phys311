import { Vec2 } from './vec2.js';

export class Gravity {
  constructor(g = 9.81) { this.g = g; }
  apply(world) {
    for (const b of world.bodies) {
      if (b.isStatic) continue;
      b.force.y -= b.m * this.g;
    }
  }
  potentialEnergy(world) {
    let U = 0;
    for (const b of world.bodies) U += b.m * this.g * (b.pos.y - world.bounds.ymin);
    return U;
  }
}

export class Drag {
  constructor(c = 0.1, d = 1.0) { this.c = c; this.d = d; }
  apply(world) {
    for (const b of world.bodies) {
      if (b.isStatic) continue;
      const speed = b.vel.length();
      if (speed > 0) b.force.addScaled(b.vel, -this.c * (speed ** this.d));
    }
  }
  energy() { return 0; }
  dissipation(bodies) {
    let P = 0;
    if (!this.enabled || this.c === 0) return 0;
    for (const b of bodies) {
      if (b.isStatic) continue;
      const s = b.vel.length();
      P += (this.c * s) ** (this.d + 1);
    }
    return P;
  }
}

export class NewtonGravity {
  constructor({G = 1, softening = 0.01} = {}) { 
    this.G = G; 
    this.eps = softening; 
  }

  apply(world) {
    const bs = world.bodies;
    for (let i = 0; i < bs.length; i++) {
      for (let j = i + 1; j < bs.length; j++) {
        const d = bs[j].pos.sub(bs[i].pos);
        const r2 = d.lengthSq() + this.eps ** 2;
        const F = this.G * bs[i].m * bs[j].m / (r2 * Math.sqrt(r2));
        bs[i].force.addScaled(d,  F);
        bs[j].force.addScaled(d, -F);   
      }
    }
  }
  potentialEnergy(bodies) {
    if (!this.enabled) return 0;
    let U = 0;
    for (let i = 0; i < bodies.length; i++)
      for (let j = i + 1; j < bodies.length; j++) {
        const r = Math.sqrt(bodies[j].pos.sub(bodies[i].pos).len2() + this.soft ** 2);
        U -= this.G * bodies[i].mass * bodies[j].mass / r;
      }
    return U;
  }
}

export class Spring {
  constructor(body, anchor, k, restLength = 0) {
    this.body = body; 
    this.anchor = anchor;
    this.k = k; 
    this.restLength = restLength;
  }

  getAnchorPos() {
    return this.anchor?.pos || this.anchor;
  }

  apply(world) {
    if (!this.body || !this.anchor) return;

    const anchorPos = this.getAnchorPos();
    if (anchorPos?.x === undefined || anchorPos?.y === undefined) return;

    const d = this.body.pos.sub(anchorPos); 
    const L = d.length();
    if (L === 0) return;   

    const stretch = L - this.restLength;
    const forceVec = d.mul(-this.k * stretch / L);

    if (!this.body.isStatic) {
      this.body.force.addTo(forceVec);
    }

    if (this.anchor.force && !this.anchor.isStatic) {
      this.anchor.force.addScaled(forceVec, -1);
    }
  }

  potentialEnergy() {
    if (!this.body || !this.anchor) return 0;
    
    const anchorPos = this.getAnchorPos();
    if (anchorPos?.x === undefined || anchorPos?.y === undefined) return 0;
    
    const s = this.body.pos.sub(anchorPos).length() - this.restLength;
    return 0.5 * this.k * s * s;
  }
}

export class PointerSpring {
  constructor({ k = 120, damp = 8 } = {}) {
    this.k = k; this.damp = damp;
    this.grabbed = null;
    this.target  = new Vec2(0, 0);
    this.enabled = true;
  }
  grab(body, worldX, worldY) { this.grabbed = body; this.target.set(worldX, worldY); }
  moveTo(worldX, worldY)     { this.target.set(worldX, worldY); }
  release()                  { this.grabbed = null; }
  get active()               { return this.enabled && this.grabbed !== null; }

  apply() {
    if (!this.active) return;
    const b = this.grabbed;
    if (b.isStatic) return;
    const d = this.target.sub(b.pos);
    const F = d.mul(this.k).sub(b.vel.mul(this.damp));
    b.apply(F);
  }
  pointerEnergy() {
    if (!this.active) return 0;
    return 0.5 * this.k * this.target.sub(this.grabbed.pos).lengthSq();
  }
}