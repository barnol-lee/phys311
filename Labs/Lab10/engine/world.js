import { EulerCromer } from './integrators.js';
import { resolveCollisions } from './collisions.js';
import { Vec2 } from './vec2.js';

export class World {
  constructor({ integrator = new EulerCromer(), bounds = null, restitution = 0.99, dt = 1/165, cellSize = 50} = {}) {
    this.bodies = [];
    this.forces = [];
    this.integrator = integrator;
    this.bounds = bounds;       
    this.time = 0;
    this.restitution = restitution;
    this.boundsLoss = new Vec2(0, 0);
    this.impulse = new Vec2(0, 0);
    this.bodyMomentum = new Vec2(0, 0);
    this.dt = dt;
    this.cellSize = cellSize;
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

  step(dt) {      
    this.clearForces();      
    this.applyForces(); 
    
    this.impulse.addTo(this.getImpulse());

    this.integrator.step(this, dt);

    resolveCollisions(this);
    
    this.time += dt;                                  
  }

  totalEnergy() {
    let E = 0;
    E += this.getKE();
    E += this.getPE();
    return E;
  }

  totalMomentum() {
    this.bodyMomentum = this.getMomentum();
    let p = new Vec2(0, 0);
    p.addTo(this.bodyMomentum.sub(this.impulse).addTo(this.boundsLoss));
    return p;
  }
}