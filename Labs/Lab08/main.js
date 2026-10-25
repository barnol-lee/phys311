import { Vec2 } from './vec2.js';

const x = new Vec2(10,5);
const y = new Vec2(-5,2);
const z = new Vec2(1,-1);

console.log("Starting Vectors:", x, y, z);

x.add(y);
console.log(x);
y.sub(z);
console.log(y)
z.mul(7);
console.log(z);
y.dot(z);
console.log(y);
x.addTo(x);
console.log(x);

console.log("Ending Vectors:", x, y, z);

