import { INTEGRATORS } from './integrators.js';
import { resolveCollisions } from './collisions.js';
import { Vec2 } from './vec2.js';
import { PointerSpring } from './forces.js';

export class World {
  constructor({ integrator = 'cromer', bounds = null, restitution = 0.99, dt = 1/165, cellSize = 50, useHash = false} = {}) {
    this.bodies = [];
    this.forces = [];
    this.integrator = INTEGRATORS[integrator];
    this.bounds = bounds;       
    this.time = 0;
    this.restitution = restitution;
    this.dt = dt;
    this.steps = 0;
    this.acc = 0;
    this.cellSize = cellSize;
    this.useHash = useHash;

    this.boundsLoss = new Vec2(0, 0);
    this.impulse = new Vec2(0, 0);
    this.bodyMomentum = new Vec2(0, 0);
    this.dissipated = 0.0;
    this.inelastic = 0.0;
    this.point = 0.0;
  }

  setIntegrator(n) {
    this.integrator = INTEGRATORS[n] || this.integrator;
  }

  add(body)       { this.bodies.push(body); return body; }
  addForce(force) { this.forces.push(force); return force; }

  clearForces() {
    for (const b of this.bodies) {
      b.clearForce(); 
    }
    return this;
  }

  applyForces() {
    for (const f of this.forces) {
      f.apply(this);
    }
  }

  getMomentum() {
    const q = new Vec2(0, 0);
    for (const b of this.bodies) {
      if (b.isStatic) continue;
      q.addScaled(b.vel, b.m ?? 1);
    }
    return q;
  }

  getImpulse() {
    const Imp = new Vec2(0, 0);
    for (const b of this.bodies) {
      Imp.addScaled(b.force, this.dt);
    }
    return Imp;
  }

  getPoint() {
    let poi = 0;
    for (const f of this.forces) {
      if (f instanceof PointerSpring) {
        poi += f.pointerEnergy();
      }
    }
    return poi;
  }

  getKE() {
    let KE = 0;
    for (const b of this.bodies) {
      if (b.isStatic) continue;
      KE += b.kineticEnergy();
    }
    return KE;
  }

  getPE() {
    let PE = 0;
    for (const f of this.forces) {
      PE += f.potentialEnergy?.(this) ?? 0;
    }
    return PE;
  }

  mechE() {
    return this.getKE() + this.getPE();
  }

  getDissipation() {
    let d = 0;
    for (const f of this.forces) {
      d += f.dissipation?.(this) ?? 0;
    }
    return d * this.dt;
  }

  advance(frameSeconds, maxSteps = 8) {
    this.acc += Math.min(frameSeconds, maxSteps * this.dt);
    let n = 0;
    while (this.acc >= this.dt && n < maxSteps) {
      this.step(this.dt);
      this.acc -= this.dt;
      n++;
    }
    return { substeps: n, alpha: this.acc / this.dt };
  }

  step(dt) {    
    this.clearForces();      
    this.applyForces();
    
    this.point += this.getPoint();
    this.dissipated += this.getDissipation();
    this.impulse.addTo(this.getImpulse());

    this.integrator.step(this, dt);

    const E_0 = this.getKE() + this.getPE();

    resolveCollisions(this);

    this.inelastic += E_0 - (this.getKE() + this.getPE());
    
    this.time += dt;   
    this.steps += 1;                               
  }

  stepOnce() { this.step(this.dt); return 1; }

  totalEnergy() {
    let E = 0;
    E += this.getKE() + this.getPE() + this.dissipated + this.inelastic;
    return E;
  }

  totalMomentum() {
    this.bodyMomentum = this.getMomentum();
    let p = new Vec2(0, 0);
    p.addTo(this.bodyMomentum.sub(this.impulse).addTo(this.boundsLoss));
    return p;
  }

  markReference() { this._E0 = this.totalEnergy(); this._p0 = this.totalMomentum(); }
  get E0() { return this._E0 ?? 0; }
  get p0() { return this._p0 || Vec2.zero(); }

  driftE() {
    const E0 = Math.abs(this.E0);
    if (this._E0 == null || E0 < 1e-12) return 0;
    return (this.totalEnergy() - this.E0) / E0;
  }
  driftP() {
    const p0 = this.p0.length();
    if (p0 < 1e-12) return this.totalMomentum().length();
    return this.totalMomentum().sub(this.p0).length() / p0;
  }

  pick(x, y, slack = 0.0) {
    let best = null, bestD = Infinity;
    for (const b of this.bodies) {
      const d = Math.hypot(b.pos.x - x, b.pos.y - y);
      if (d <= b.radius + slack && d < bestD) { best = b; bestD = d; }
    }
    return best;
  }
}