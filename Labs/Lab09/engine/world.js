import { EulerCromer } from './integrators.js';
import { resolveCollisions } from './collisions.js';
import { Vec2 } from './vec2.js';

export class World {
  constructor({ integrator = new EulerCromer(), bounds = null, restitution = 0.99, dt = 1/165 } = {}) {
    this.bodies = [];
    this.forces = [];
    this.integrator = integrator;
    this.bounds = bounds;       
    this.time = 0;
    this.restitution = restitution;
    this.boundsMomentum = new Vec2(0,0);
    this.dt = dt
  }

  add(body)       { this.bodies.push(body); return body; }
  addForce(force) { this.forces.push(force); return force; }

  step(dt) {                        
  for (const b of this.bodies) b.clearForce();      
  for (const f of this.forces) f.apply(this);      
  this.integrator.step(this, dt);
  resolveCollisions(this);  
  this.time += dt;                                  
}


  totalEnergy() {
    let E = 0;
    for (const b of this.bodies) E += b.kineticEnergy();
    for (const f of this.forces) E += f.potentialEnergy?.(this) ?? 0;
    return E;
  }

  totalMomentum() {
    const ext = this.boundsMomentum.clone();
    const p = new Vec2();
    for (const b of this.bodies) p.addScaled(b.vel, b.m);
    p.addTo(ext)
    return p;
  }
}