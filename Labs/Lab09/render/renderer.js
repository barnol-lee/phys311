export class Renderer {
  constructor(canvas, camera) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.camera = camera;

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }
   resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    }

  draw(world) {
    const { ctx, canvas, camera } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (world.forces) {
      for (const f of world.forces) {
        if (!f.body || !f.anchor) continue;

        const startWorld = f.body.pos;
        const endWorld = f.anchor.pos || f.anchor;
        const startScreen = camera.toScreen(startWorld);
        const endScreen = camera.toScreen(endWorld);

        ctx.beginPath();
        ctx.moveTo(startScreen.x, startScreen.y);
        ctx.lineTo(endScreen.x, endScreen.y);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

    for (const b of world.bodies) {
      const p = camera.toScreen(b.pos);
      ctx.fillStyle = b.color ?? "#ff8200";
      ctx.beginPath();
      ctx.arc(p.x, p.y, b.radius * camera.scale, 0, 2 * Math.PI);
      ctx.fill();
        }
    }
  }
}