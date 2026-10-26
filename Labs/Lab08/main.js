import { Vec2 } from './vec2.js';

/*//VECTOR OPERATIONS TEST
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

//Line
ctx.beginPath();
ctx.strokeStyle = "#4ade80";
ctx.lineWidth = 2;

const lstart = Camera.toScreen({ x: -100, y: 0 });
const lend = Camera.toScreen({ x: 100, y: 0 });

ctx.moveTo(lstart.x, lstart.y);
ctx.lineTo(lend.x, lend.y);
ctx.stroke();

//Circle
const centerWorld = { x: 2, y: 3 };
const radiusWorld = 0.3;

const centerScreen = Camera.toScreen(centerWorld);
const radiusScreen = radiusWorld * Camera.scale;

ctx.beginPath();
ctx.arc(centerScreen.x, centerScreen.y, radiusScreen, 0, 2 * Math.PI);
ctx.fillStyle = "#3b82f6";
ctx.fill();
ctx.strokeStyle = "#3b82f6";
ctx.lineWidth = 2;
ctx.stroke();

//Tick Marks
ctx.fillStyle = "#64748b";

const worldLeft = Camera.toWorld(0, 0).x;
const worldRight = Camera.toWorld(Camera.canvas.width, 0).x;
const worldBottom = Camera.toWorld(0, Camera.canvas.height).y;
const worldTop = Camera.toWorld(0, 0).y;

for (let x = Math.floor(worldLeft); x <= Math.ceil(worldRight); x++) {
const xTick = Camera.toScreen({ x: x, y: 0 });
ctx.fillText(`|${x}m`, xTick.x - 3, xTick.y + 3);
}
for (let y = Math.floor(worldBottom); y <= Math.ceil(worldTop); y++) {
    const yTick = Camera.toScreen({ x: 0, y: y });
    ctx.fillText(`— ${y}m`, yTick.x - 4, yTick.y + 4);
}

