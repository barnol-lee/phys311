import { Vec2 } from './engine/vec2.js';
import { Body } from './engine/body.js';
import { World } from './engine/world.js';
import { EulerCromer, VelocityVerlet } from './engine/integrators.js';
import { Gravity, NewtonGravity, Drag, Spring } from './engine/forces.js';
import { resolvePair, gridPairs, resolveBoundary, resolveCollisions } from './engine/collisions.js';
import { Camera } from './render/camera.js';
import { drawHUD } from './render/hud.js';
import { Renderer } from './render/renderer.js';

const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");
const camera = new Camera(canvas, 15, -25, -5);
const render = new Renderer(canvas, camera);

const world = new World({
    //bounds: {xMin: 0, yMin: 0, xMax: 30, yMax: 30},
    restitution: 0.99
    //integrator: new VelocityVerlet()
})

world.add(new Body({
    isStatic: true,
    pos: new Vec2(1,1),
    radius: 0.75,
    color: "#000000"
}))

for (let i = 0; i < 20; i++) {
    world.add(new Body({
        m: Math.random()*10,
        pos: new Vec2(Math.random()*25,Math.random()*25),
        vel: new Vec2((Math.random()*2-1)*10,(Math.random()*2-1)*10),
        radius: 0.5,
        color: `hsl(${Math.random() * 360}, 85%, 55%)`
        
}))
}

world.add(new Body({
    isStatic: true,
    pos: new Vec2(29,29),
    radius: 0.75,
    color: "#000000"
}))

for (let i = 0; i <= 20; i++) {
    const currentBody = world.bodies[i];
    const nextBody = world.bodies[i + 1];
    const springK = 1.0; 
    const restLength = 1.0; 
    world.addForce(new Spring(currentBody, nextBody, springK, restLength));
}

//Accumulator
const DT = world.dt;       
const MAX_FRAME = 0.25;   

const E0 = world.totalEnergy();
const p0 = world.totalMomentum();

let lastTime = 0;
let accumulator = 0;

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  let frameTime = (timestamp - lastTime) / 1000; 
  lastTime = timestamp;

  if (frameTime > MAX_FRAME) frameTime = MAX_FRAME; 
  accumulator += frameTime;

  const fps = frameTime > 0 ? 1 / frameTime : 0;

  const t0 = performance.now();
  while (accumulator >= DT) {
    world.step(DT);        
    accumulator -= DT;
  }
  const tPhysics = performance.now() - t0;

  const t1 = performance.now();
  render.draw(world);     
  const tRender = performance.now() - t1;

  drawHUD(ctx, world, E0, p0, fps, tPhysics, tRender);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);