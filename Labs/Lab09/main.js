import { Vec2 } from './engine/vec2.js';
import { Body } from './engine/body.js';
import { World } from './engine/world.js';
import { EulerCromer, VelocityVerlet } from './engine/integrators';
import { Gravity, NewtonGravity, Drag } from './engine/forces.js';
import { resolvePair, gridPairs } from './engine/collisions.js';
import { Camera } from './render/camera.js';
import { drawHUD } from './render/hud.js';
import { Renderer } from './render/renderer.js';

const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");





















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

  while (accumulator >= DT) {
    world.step(DT);        
    accumulator -= DT;
  }

  render(world);           
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);