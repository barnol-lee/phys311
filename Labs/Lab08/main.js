import { Vec2 } from './vec2.js';

/* //PART A, 1
//VECTOR OPERATIONS TEST
let x = new Vec2(10,5);
let y = new Vec2(-5,2);
let z = new Vec2(1,-1);

console.log("Starting Vectors:", x, y, z);

x=x.add(y);
console.log(x);
y=y.sub(z);
console.log(y)
z=z.mul(7);
console.log(z);
y=y.dot(z);
console.log(y);
x=x.addTo(x);
console.log(x);

console.log("Ending Vectors:", x, y, z);
*/


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
const metricsEl = document.getElementById("metrics");
const camera = new Camera(canvas, 18, -3, -3);

/* //PART A, 2
CAMERA TEST
//Line
ctx.beginPath();
ctx.strokeStyle = "#4ade80";
ctx.lineWidth = 2;

const lstart = camera.toScreen({ x: -100, y: 0 });
const lend = camera.toScreen({ x: 100, y: 0 });

ctx.moveTo(lstart.x, lstart.y);
ctx.lineTo(lend.x, lend.y);
ctx.stroke();

//Circle
const centerWorld = { x: 2, y: 3 };
const radiusWorld = 0.3;

const centerScreen = camera.toScreen(centerWorld);
const radiusScreen = radiusWorld * camera.scale;

ctx.beginPath();
ctx.arc(centerScreen.x, centerScreen.y, radiusScreen, 0, 2 * Math.PI);
ctx.fillStyle = "#3b82f6";
ctx.fill();
ctx.strokeStyle = "#3b82f6";
ctx.lineWidth = 2;
ctx.stroke();

//Tick Marks
ctx.fillStyle = "#64748b";

const worldLeft = camera.toWorld(0, 0).x;
const worldRight = camera.toWorld(camera.canvas.width, 0).x;
const worldBottom = camera.toWorld(0, camera.canvas.height).y;
const worldTop = camera.toWorld(0, 0).y;

for (let x = Math.floor(worldLeft); x <= Math.ceil(worldRight); x++) {
const xTick = camera.toScreen({ x: x, y: 0 });
ctx.fillText(`|${x}m`, xTick.x - 3, xTick.y + 3);
}
for (let y = Math.floor(worldBottom); y <= Math.ceil(worldTop); y++) {
    const yTick = camera.toScreen({ x: 0, y: y });
    ctx.fillText(`— ${y}m`, yTick.x - 4, yTick.y + 4);
}
render();
*/


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
  const vMag = p.vel.lengthSq().toFixed(3);
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

let lastTime = 0;
let accumulator = 0;

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  let frameTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (frameTime > MAX_FRAME) frameTime = MAX_FRAME;
  accumulator += frameTime;

  while (accumulator >= DT) {
    if (!projectile.hasLanded) {
      world.step(DT);        
      
      projectile.trail.push(projectile.pos.clone());
      if (projectile.trail.length > 200) {
        projectile.trail.shift();
      }

      if (projectile.pos.y <= 0 && projectile.vel.y < 0) {
        projectile.pos.y = 0;
        projectile.vel.set(0, 0);
        projectile.hasLanded = true; 
      }
    }
    
    accumulator -= DT;
  }

  render(world);           
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

