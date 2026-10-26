import { Vec2 } from './vec2.js';

/*\\VECTOR OPERATIONS TEST
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

