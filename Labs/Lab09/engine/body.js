import { Vec2 } from './vec2.js'

let nextId = 0;
export class Body {
  constructor({ mass = 1, pos = new Vec2(), vel = new Vec2(), radius = 0.25,
                color = "#ff8200", isStatic = false } = {}) {
    this.m = mass;
    this.invM = isStatic ? 0 : 1 / mass;
    this.pos = pos.clone();
    this.vel = vel.clone();
    this.acc = new Vec2();
    this.force = new Vec2();
    this.radius = radius;
    this.color = color;
    this.isStatic = isStatic;
    this.trail = [];
    this.id = ++nextId;
  }
}