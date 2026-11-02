export class EulerCromer {
  step(world, dt) {
    for (const b of world.bodies) {
      if (b.isStatic) continue;
      b.acc.set(b.force.x / b.m, b.force.y / b.m);
      b.vel.addScaled(b.acc, dt);      
      b.pos.addScaled(b.vel, dt);      
    }}
}

export class VelocityVerlet {
    step(world,dt) {
    for (const b of world.bodies) {
      if (b.isStatic) continue;
      b.acc.set(b.force.x / b.m, b.force.y / b.m);
      b.vel.addScaled(b.acc, 0.5 * dt);
      b.pos.addScaled(b.vel, dt);
    }
    for (const b of world.bodies) {
      if (b.isStatic) continue;
      b.acc.set(b.force.x / b.m, b.force.y / b.m);
      b.vel.addScaled(b.acc, 0.5 * dt);
    }
}}