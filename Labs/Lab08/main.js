import { Vec2 } from './vec2.js';

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

