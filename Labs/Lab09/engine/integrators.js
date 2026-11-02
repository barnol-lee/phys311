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
  step(world, dt) {
    for (const b of world.bodies) {
      if (b.isStatic) continue;
      b.pos.x += b.vel.x * dt + 0.5 * b.acc.x * dt * dt;
      b.pos.y += b.vel.y * dt + 0.5 * b.acc.y * dt * dt;
    }
   
    world.clearForces();
    world.applyForces();

    for (const b of world.bodies) {
      if (b.isStatic) continue;
      const axN = b.force.x * b.invM, ayN = b.force.y * b.invM;
      b.vel.x += 0.5 * (b.acc.x + axN) * dt;
      b.vel.y += 0.5 * (b.acc.y + ayN) * dt;
      b.acc.set(axN, ayN);
    }
  }
}
