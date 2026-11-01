import { Vec2 } from './engine/vec2.js';

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
} export{ Camera }