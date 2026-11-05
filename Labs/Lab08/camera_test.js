import { Camera } from './main.js';

const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");
const camera = new Camera(canvas, 18, -3, -3);

//PART A, 2
//CAMERA TEST
//Line
ctx.beginPath();
ctx.strokeStyle = "#4ade80";
ctx.lineWidth = 2;

const lstart = camera.toScreen({ x: -100, y: 0 });
const lend = camera.toScreen({ x: 100, y: 0 });

ctx.moveTo(lstart.x, lstart.y);
ctx.lineTo(lend.x, lend.y);
ctx.stroke();

//Circle
const centerWorld = { x: 2, y: 3 };
const radiusWorld = 0.3;

const centerScreen = camera.toScreen(centerWorld);
const radiusScreen = radiusWorld * camera.scale;

ctx.beginPath();
ctx.arc(centerScreen.x, centerScreen.y, radiusScreen, 0, 2 * Math.PI);
ctx.fillStyle = "#3b82f6";
ctx.fill();
ctx.strokeStyle = "#3b82f6";
ctx.lineWidth = 2;
ctx.stroke();

//Tick Marks
ctx.fillStyle = "#64748b";

const worldLeft = camera.toWorld(0, 0).x;
const worldRight = camera.toWorld(camera.canvas.width, 0).x;
const worldBottom = camera.toWorld(0, camera.canvas.height).y;
const worldTop = camera.toWorld(0, 0).y;

for (let x = Math.floor(worldLeft); x <= Math.ceil(worldRight); x++) {
const xTick = camera.toScreen({ x: x, y: 0 });
ctx.fillText(`|${x}m`, xTick.x - 3, xTick.y + 3);
}
for (let y = Math.floor(worldBottom); y <= Math.ceil(worldTop); y++) {
    const yTick = camera.toScreen({ x: 0, y: y });
    ctx.fillText(`— ${y}m`, yTick.x - 4, yTick.y + 4);
}
render();
//To run, go to index.html and change "src="main.js"" to "src="camera_test.js"".