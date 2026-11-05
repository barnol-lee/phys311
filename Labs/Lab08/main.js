import { Vec2 } from './vec2.js';
//ENGINE

//WORLD
class World {
  constructor(integrator) {
    this.bodies = []; this.forces = [];
    this.integrator = integrator;
    this.time = 0; this.steps = 0;
  }
  add(b)      { this.bodies.push(b); return b; }
  addForce(f) { this.forces.push(f); return f; }

  clearForces() { for (const b of this.bodies) b.force.zero(); }
  applyForces() { for (const f of this.forces) f.apply(this); }

  primeAccelerations() {
    this.clearForces(); this.applyForces();
    for (const b of this.bodies) {
      if (b.fixed) continue;
      b.acc.set(b.force.x * b.invMass, b.force.y * b.invMass);
    }
  }

  step(dt) {
    this.clearForces();
    this.applyForces();
    this.integrator.step(this, dt);
    this.time += dt;
    this.steps += 1;
  }

  kineticEnergy() {
    let K = 0;
    for (const b of this.bodies) if (!b.fixed) K += 0.5 * b.mass * b.vel.lengthSq();
    return K;
  }
  potentialEnergy() {
    let U = 0;
    for (const f of this.forces) if (f.potentialEnergy) U += f.potentialEnergy(this);
    return U;
  }
  totalEnergy() { return this.kineticEnergy() + this.potentialEnergy(); }
}

//BODY
class Body {
  constructor({ mass = 1, pos = new Vec2(), vel = new Vec2(), radius = 0.25,
                color = "#ff8200", fixed = false } = {}) {
    this.mass = mass;
    this.invMass = fixed ? 0 : 1 / mass;
    this.pos = pos.clone();
    this.vel = vel.clone();
    this.acc = new Vec2();
    this.force = new Vec2();
    this.radius = radius;
    this.color = color;
    this.fixed = fixed;
    this.trail = [];
  }
}

//INTEGRATORS
class Euler {
  step(world, dt) {
    for (const b of world.bodies) {
      if (b.fixed) continue;
      b.acc.set(b.force.x * b.invMass, b.force.y * b.invMass);
      b.pos.addScaled(b.vel, dt);
      b.vel.addScaled(b.acc, dt);
    }
  }
}

class EulerCromer {
  step(world, dt) {
    for (const b of world.bodies) {
      if (b.fixed) continue;
      b.acc.set(b.force.x * b.invMass, b.force.y * b.invMass);
      b.vel.addScaled(b.acc, dt);  
      b.pos.addScaled(b.vel, dt);
    }
  }
}

class VelocityVerlet {
  step(world, dt) {
   
    for (const b of world.bodies) {
      if (b.fixed) continue;
      b.pos.x += b.vel.x * dt + 0.5 * b.acc.x * dt * dt;
      b.pos.y += b.vel.y * dt + 0.5 * b.acc.y * dt * dt;
    }
    
    world.clearForces();
    world.applyForces();
  
    for (const b of world.bodies) {
      if (b.fixed) continue;
      const axN = b.force.x * b.invMass, ayN = b.force.y * b.invMass;
      b.vel.x += 0.5 * (b.acc.x + axN) * dt;
      b.vel.y += 0.5 * (b.acc.y + ayN) * dt;
      b.acc.set(axN, ayN);            
    }
  }
}

//GRAVITY
class Gravity {
  constructor(g = -9.81) {
    this.g = g;
  }
  apply(world) {
    for (const b of world.bodies) {
      if (b.fixed) continue;
      b.force.y += b.mass * this.g;
    }
  }
  potentialEnergy(world) {
    let U = 0;
    for (const b of world.bodies) {
      if (b.fixed) continue;
      U += b.mass * (-this.g) * b.pos.y;
    }
    return U;
  }
}

//CAMERA
class Camera {
  constructor(canvas, scale = 100, originX = 0, originY = 0) {
    this.canvas = canvas;
    this.scale = scale;  
    this.originX = originX;
    this.originY = originY;
  }
  toScreen(v) {
    return {
      x: (v.x - this.originX) * this.scale,
      y: this.canvas.height - (v.y - this.originY) * this.scale
    };
  }
  toWorld(px, py) {   
    return new Vec2(
      px / this.scale + this.originX,
      (this.canvas.height - py) / this.scale + this.originY
    );
  }
}
const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");
const camera = new Camera(canvas, 18, -3, -3);


//PART B: The Ported Integrator
//Projectile
const speed = 20;
const angleDegrees = 50;
const angleRadians = angleDegrees * (Math.PI / 180);
const vx = speed * Math.cos(angleRadians);
const vy = speed * Math.sin(angleRadians);

const world = new World(new EulerCromer());
world.addForce(new Gravity(-9.81));
const projectile = world.add(new Body({
  mass: 1,
  pos: new Vec2(0, 0),
  vel: new Vec2(vx, vy),
  radius: 0.25,
  color: "#ff8200"
}));

//PART C, 1 COMPUTAIION
console.log("COMPUTATION STARTED");
console.log("Time (s) | Pos X (m) | Pos Y (m) | |V| (m/s) | KE (J) | PE (J) | Total E (J)");
console.log("---------------------------------------------------------------------------------");

const hWorld = new World(new EulerCromer());
hWorld.addForce(new Gravity(-9.81));

const gProjectile = hWorld.add(new Body({
  mass: 1,
  pos: new Vec2(0, 0),
  vel: new Vec2(vx, vy)
}));

let hCounter = 0;
const hDT = 1 / 120;

while (hWorld.steps === 0 || gProjectile.pos.y > 0 || gProjectile.vel.y > 0) {
  hWorld.step(hDT);

  if (hCounter % 10 === 0) {
    const vMag = gProjectile.vel.length();
    console.log(
      hWorld.time.toFixed(3) + "s | " +
      gProjectile.pos.x.toFixed(3) + "m | " +
      gProjectile.pos.y.toFixed(3) + "m | " +
      vMag.toFixed(3) + "m/s | " +
      hWorld.kineticEnergy().toFixed(3) + "J | " +
      hWorld.potentialEnergy().toFixed(3) + "J | " +
      hWorld.totalEnergy().toFixed(3) + "J"
    );
  }
  hCounter++;
}
const finalX = gProjectile.pos.x;
const finalY = gProjectile.pos.y;
const finalVx = gProjectile.vel.x;
const finalVy = gProjectile.vel.y;
const finalEnergy = hWorld.totalEnergy();

console.log("---------------------------------------------------------------------------------");
console.log("TOUCHDOWN STATE VECTOR DETAILS:");
console.log("Final Flight Time   : " + hWorld.time.toFixed(3) + " s");
console.log("Final Pos X         : " + finalX.toFixed(3) + " m");
console.log("Final Pos Y         : " + finalY.toFixed(3) + " m");
console.log("Final Vel VX        : " + finalVx.toFixed(3) + " m/s");
console.log("Final Vel VY        : " + finalVy.toFixed(3) + " m/s");
console.log("Final Total Energy  : " + finalEnergy.toFixed(3) + " J");
console.log("COMPUTATION COMPLETED");


//RENDER
function render(world) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const groundLeft = camera.toScreen(new Vec2(-10, 0));
  const groundRight = camera.toScreen(new Vec2(100, 0));
  ctx.beginPath();
  ctx.moveTo(groundLeft.x, groundLeft.y);
  ctx.lineTo(groundRight.x, groundRight.y);
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (const b of world.bodies) {
    for (let i = 0; i < b.trail.length; i += 6) { 
      const oldPos = camera.toScreen(b.trail[i]);
      const oldRadius = b.radius * camera.scale;

      const snapshotAgeAlpha = 0.05 + (i / b.trail.length) * 0.30;

      ctx.beginPath();
      ctx.arc(oldPos.x, oldPos.y, oldRadius, 0, Math.PI * 2);
      
      ctx.fillStyle = "rgba(255, 130, 0, " + snapshotAgeAlpha + ")";
      ctx.fill();
      ctx.closePath();
    }

    const screenPos = camera.toScreen(b.pos);
    const screenRadius = b.radius * camera.scale; 

    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.closePath();
  }

  const p = projectile;
  const t = world.time.toFixed(3);
  const x = p.pos.x.toFixed(3);
  const y = p.pos.y.toFixed(3);
  const vMag = p.vel.length().toFixed(3);
  const ke = world.kineticEnergy().toFixed(3);
  const pe = world.potentialEnergy().toFixed(3);
  const eTotal = world.totalEnergy().toFixed(3);

  ctx.font = "bold 14px monospace";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";

  let lineY = 30;
  const lineHeight = 22;

  ctx.fillText("TIME     : " + t + " s", 20, lineY); lineY += lineHeight;
  ctx.fillText("POS X    : " + x + " m", 20, lineY); lineY += lineHeight;
  ctx.fillText("POS Y    : " + y + " m", 20, lineY); lineY += lineHeight;
  ctx.fillText("|V|      : " + vMag + " m/s", 20, lineY); lineY += lineHeight;
  ctx.fillStyle = "#000000";
  ctx.fillText("KE       : " + ke + " J", 20, lineY); lineY += lineHeight;
  ctx.fillStyle = "#000000";
  ctx.fillText("PE       : " + pe + " J", 20, lineY); lineY += lineHeight;
  ctx.fillStyle = "#000000";
  ctx.fillText("E_TOTAL  : " + eTotal + " J", 20, lineY);
}

//ACCUMULATOR LOOP

const DT = 1 / 120;        
const MAX_FRAME = 0.25;  


const USE_FIXED_TIMESTEP = true; 

let lastTime = 0;
let accumulator = 0;

function update(stepSize) {
  for (const b of world.bodies) {
    if (!b.hasLanded) {
      world.step(stepSize);        
    
      b.trail.push(b.pos.clone());
      if (b.trail.length > 200) {
        b.trail.shift();
      }

      if (b.pos.y < 0 && b.vel.y < 0) {
        b.pos.y = 0;
        b.hasLanded = true; 
      }
    }
  }
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  let frameTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (frameTime > MAX_FRAME) frameTime = MAX_FRAME;

  if (USE_FIXED_TIMESTEP) {
    accumulator += frameTime;

    while (accumulator >= DT) {
      update(DT);
      accumulator -= DT;
    }
  } else {
    accumulator = 0;
    update(frameTime);
  }

  render(world);           
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
