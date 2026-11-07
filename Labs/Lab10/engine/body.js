import { Vec2 } from './vec2.js'

let nextId = 0;
export class Body {
  constructor({ m = 1, pos = new Vec2(), vel = new Vec2(), radius = 0.25,
                color = "#ff8200", isStatic = false } = {}) {
    this.m = m;
    this.invM = isStatic ? 0 : 1 / m;
    this.pos = pos.clone();
    this.vel = vel.clone();
    this.acc = new Vec2();
    this.force = new Vec2();
    this.radius = radius;
    this.color = color;
    this.isStatic = isStatic;
    this.trail = [];
    this.maxTrailLength=100;
    this.id = ++nextId;
    };

    clearForce() {
      this.force.zero(); 
      return this;
    }
    
    apply(force) {
      this.force.addTo(force);
      return this;
    }

    kineticEnergy() {
    return 0.5 * this.m * this.vel.lengthSq();
    };

    updateTrail() {
    this.trail.push(this.pos.clone());

    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift(); 
      }
    }
}