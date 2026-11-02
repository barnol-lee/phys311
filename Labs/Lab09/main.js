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
const camera = new Camera(canvas, 20, 0, 0);
const render = new Renderer(canvas, camera);

const world = new World({
    bounds: {xMin: 0, yMin: 0, xMax: 10, yMax: 10}
});

const b0 = world.add(new Body({
    pos: new Vec2(1,1),
    vel: new Vec2(1,0.5)
}));
const b1 = world.add(new Body({
    pos: new Vec2(9,9),
    vel: new Vec2(-1,-0.5),
    color: "#2e27e8fb"
}));
const b2 = world.add(new Body({
    pos: new Vec2(5,5),
    isStatic: true,
    color:"#000000"
}));



















//Accumulator
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

  const t0 = performance.now();
  while (accumulator >= DT) {
    world.step(DT);        
    accumulator -= DT;
  }
  const tPhysics = performance.now() - t0;

  const t1 = performance.now();
  render.draw(world);     
  const tRender = performance.now() - t1;

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
