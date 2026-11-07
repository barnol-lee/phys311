canvas.addEventListener("pointerdown", (event) => {
  console.log("clicked at", event.clientX, event.clientY);
});

function eventToWorld(event, canvas, camera) {
  const rect = canvas.getBoundingClientRect();

  // 1. viewport → canvas pixels (the ratio handles CSS scaling)
  const px = (event.clientX - rect.left) * (canvas.width  / rect.width);
  const py = (event.clientY - rect.top ) * (canvas.height / rect.height);

  // 2. canvas pixels → physics meters (this is your Lab 8 camera, inverted)
  return camera.toWorld(px, py);
}

const keys = new Set();
window.addEventListener("keydown", e => {
  keys.add(e.code);
  if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
});
window.addEventListener("keyup", e => keys.delete(e.code));

// Inside world.step() — a Force like any other
class ThrustForce {
  constructor(body, keys, magnitude) { /* ... */ }
  apply(world) {
    if (this.keys.has("ArrowUp"))    this.body.force.y += this.mag;
    if (this.keys.has("ArrowLeft"))  this.body.force.x -= this.mag;
    if (this.keys.has("ArrowRight")) this.body.force.x += this.mag;
  }
}

function bodyAt(world, worldPos) {
  for (let i = world.bodies.length - 1; i >= 0; i--) {   // topmost first
    const b = world.bodies[i];
    const pick = Math.max(b.radius, 0.25);   // generous target for touch
    if (b.pos.sub(worldPos).lengthSq() <= pick * pick) return b;
  }
  return null;
}

class MouseSpring {
  constructor() { this.body = null; this.target = null; this.k = 200; this.c = 20; }

  apply(world) {
    if (!this.body || !this.target) return;
    const d = this.target.sub(this.body.pos);
    this.body.force.addScaled(d, this.k * this.body.m);        // spring
    this.body.force.addScaled(this.body.vel, -this.c * this.body.m); // damping
  }
}

let aimStart = null;

canvas.addEventListener("pointerdown", e => { aimStart = eventToWorld(e, canvas, camera); });
canvas.addEventListener("pointerup", e => {
  if (!aimStart) return;
  const end = eventToWorld(e, canvas, camera);
  const v = aimStart.sub(end).mul(2.0);       // pull back = launch forward
  world.add(new Body({ pos: aimStart, vel: v, m: 1, radius: 0.2 }));
  aimStart = null;
});

function predictPath(pos, vel, g, steps = 60, dt = 1/30) {
  const path = [];
  let p = pos.clone(), v = vel.clone();
  for (let i = 0; i < steps; i++) {
    v.y -= g * dt;  p.addScaled(v, dt);        // Euler-Cromer, on a copy
    path.push(p.clone());
  }
  return path;
}