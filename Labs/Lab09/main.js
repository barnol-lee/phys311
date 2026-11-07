import { Vec2 } from './engine/vec2.js';
import { Body } from './engine/body.js';
import { World } from './engine/world.js';
import { EulerCromer, VelocityVerlet } from './engine/integrators.js';
import { Gravity, NewtonGravity, Drag } from './engine/forces.js';
import { resolvePair, gridPairs, resolveBoundary, resolveCollisions } from './engine/collisions.js';
import { Camera } from './render/camera.js';
import { drawHUD } from './render/hud.js';
import { Renderer } from './render/renderer.js';

const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");
const camera = new Camera(canvas, 15, -45, -25);
const render = new Renderer(canvas, camera);

const world = new World({
    bounds: {xMin: -40, yMin: -20, xMax: 40, yMax: 20},
    restitution: 1.0,
    //integrator: new VelocityVerlet()

})

for (let i = 0; i < 5; i++) {
    world.add(new Body({
        m: Math.random()*100+0.01,
        pos: new Vec2((Math.random()*2-1)*40,(Math.random()*2-1)*20),
        vel: new Vec2((Math.random()*2-1)*10,(Math.random()*2-1)*10),
        radius: 0.5,
        color: `hsl(${Math.random() * 360}, 85%, 55%)`
}));
}

world.addForce(new Gravity(10));

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
