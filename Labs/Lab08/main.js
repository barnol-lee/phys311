const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");

import { Vec2 } from './vec2.js';

/*
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

class Camera {
  constructor(canvas, scale = 50, originX = 0, originY = 0) {
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
const camera = new Camera(canvas, 50, -3, -3);

/*
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

//ENGINE

//BODY
class Body {
  constructor(x, y, vx, vy, m = 1, radius = 10) {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(vx, vy);
    this.acc = new Vec2(0, 0);
    this.force = new Vec2(0, 0);
    this.m = m;
    this.radius = radius;
  }

  kineticEnergy() {
    return 0.5 * this.m * this.vel.lengthSq();
  }

  clearForce() {
    this.force.set(0, 0);
  }
}

//INTEGRATORS
class EulerCromer {
    constructor() {
        this.name = "Euler Cromer";
    }

    step(bodies, dt, computeForces) {
        for (const b of bodies) {
            b.clearForce();
        }
        computeForces(bodies);
        
        for (const b of bodies) {
            const inv_m = 1.0 / b.m;
            
            b.vel.addScaled(b.force, inv_m * dt);
            b.pos.addScaled(b.vel, dt);
        }
    }
}

class Euler {
    constructor() {
        this.name = "Euler";
    }

    step(bodies, dt, computeForces) {
        for (const b of bodies) {
            b.clearForce();
        }
        computeForces(bodies);
        
        for (const b of bodies) {
            const inv_m = 1.0 / b.m;
            
            b.pos.addScaled(b.vel, dt);
            b.vel.addScaled(b.force, inv_m * dt);
        }
    }
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
    world.step(DT);        
    accumulator -= DT;
  }

  render(world);           
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);