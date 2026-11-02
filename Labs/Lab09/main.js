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
const camera = new Camera(canvas, 60, 0, 0);
const render = new Renderer(canvas, camera);

const world = new World({
    bounds: {xMin: 0, yMin: 0, xMax: 10, yMax: 10},
    restitution: 1.0
});

world.addForce(new NewtonGravity())

const b0 = world.add(new Body({
    mass: 1000,
    pos: new Vec2(0.5,1),
    vel: new Vec2(10,0),
    radius: 0.25
}));
const b1 = world.add(new Body({
    mass: 1,
    pos: new Vec2(0.55,1),
    vel: new Vec2(-10,0),
    color: "#2e27e8fb",
    radius: 0.25
}));
const b2 = world.add(new Body({
    pos: new Vec2(9.5,1),
    isStatic: true,
    color:"#000000"
}));
const b3 = world.add(new Body({
    pos: new Vec2(9.9,1),
    vel: new Vec2(0,0),
    mass: 1000,
    color:"#5b0808",
    radius:0.1
}));







//Accumulator
const DT = 1 / 120;       
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
