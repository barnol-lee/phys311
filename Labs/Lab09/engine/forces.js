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
    for (const b of world.bodies) U += b.m * this.g * b.pos.y;
    return U;
  }
}

export class Drag {
  constructor(c = 0.1) { this.c = c; }
  apply(world) {
    for (const b of world.bodies) {
      const speed = b.vel.length();
      if (speed > 0) b.force.addScaled(b.vel, -this.c * speed);
    }
  }
}

export class NewtonGravity {
  constructor(G = 1, softening = 0.01) { this.G = G; this.eps = softening; }
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
}

export class Spring {
  constructor(body, anchor, k, restLength = 0) {
    this.body = body; 
    this.anchor = anchor;
    this.k = k; 
    this.restLength = restLength;
  }

  apply(world) {
    if (!this.body || !this.anchor) return;

    const anchorPos = this.anchor.pos || this.anchor;
    if (anchorPos.x === undefined) return;
    const d = this.body.pos.sub(anchorPos); 

    const L = d.length();
    if (L === 0) return;   

    const stretch = L - this.restLength;
    const forceVec = d.mul(-this.k * stretch / L);

    const bodyIsStatic = this.body.isStatic;
    const anchorIsStatic = this.anchor.isStatic || (this.anchor.x !== undefined && this.anchor.y !== undefined);

    if (bodyIsStatic && anchorIsStatic) {
        return;
    }
    if (!bodyIsStatic && anchorIsStatic) {
        this.body.force.addTo(forceVec);
        if (world && world.boundsMomentum) {
            world.boundsMomentum.addScaled(forceVec, -world.dt); 
        }
    } 
    else if (bodyIsStatic && !anchorIsStatic) {
        if (this.anchor.force) {
            this.anchor.force.addScaled(forceVec, -1);
            if (world && world.boundsMomentum) {
                world.boundsMomentum.addScaled(forceVec, world.dt);
            }
        }
    }
    else {
        this.body.force.addTo(forceVec);
        if (this.anchor.force) {
            this.anchor.force.addScaled(forceVec, -1);
        }
    }
  }

  potentialEnergy() {
    if (!this.body || !this.anchor) return 0;
    const anchorPos = this.anchor.pos || this.anchor;
    if (anchorPos.x === undefined) return 0;
    const s = this.body.pos.sub(anchorPos).length() - this.restLength;
    return 0.5 * this.k * s * s;
  }
}

