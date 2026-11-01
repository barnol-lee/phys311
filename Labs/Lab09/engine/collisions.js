export function resolvePair(a, b, e = 0.9) {
  const d = b.pos.sub(a.pos);
  const distSq = d.lengthSq();
  const rSum = a.radius + b.radius;
  if (distSq >= rSum * rSum || distSq === 0) return false;   

  const dist = Math.sqrt(distSq);
  const n = d.mul(1 / dist);            

  const overlap = rSum - dist;
  const invA = a.isStatic ? 0 : 1 / a.m;
  const invB = b.isStatic ? 0 : 1 / b.m;
  const invSum = invA + invB;
  if (invSum === 0) return false;         
  a.pos.addScaled(n, -overlap * (invA / invSum));
  b.pos.addScaled(n,  overlap * (invB / invSum));


  const relVel = b.vel.sub(a.vel);
  const vn = relVel.dot(n);
  if (vn > 0) return true;               

  const J = -(1 + e) * vn / invSum;      
  a.vel.addScaled(n, -J * invA);
  b.vel.addScaled(n,  J * invB);
  return true;
}

function resolveBoundary(world) {
  if (!world.bounds) return;

  const xMin = world.bounds.xMin ?? 0;
  const yMin = world.bounds.yMin ?? 0;
  const xMax = world.bounds.xMax ?? world.bounds.width;
  const yMax = world.bounds.yMax ?? world.bounds.height;
  
  const res = world.restitution;

  for (const b of world.bodies) {
    if (b.isStatic) continue; 
    const r = b.radius ?? 0;

    if (b.pos.x - r < xMin) {
      b.pos.x = xMin + r;          
      b.vel.x = -b.vel.x * res;
    } else if (b.pos.x + r > xMax) {
      b.pos.x = xMax - r;          
      b.vel.x = -b.vel.x * res; 
    }

    if (b.pos.y - r < yMin) {
      b.pos.y = yMin + r;          
      b.vel.y = -b.vel.y * res; 
    } else if (b.pos.y + r > yMax) {
      b.pos.y = yMax - r;          
      b.vel.y = -b.vel.y * res;
    }
  }
} export { resolveBoundary }

export function gridPairs(bodies, cellSize) {
  const cells = new Map();
  const key = (i, j) => `${i},${j}`;

  for (const b of bodies) {
    const i = Math.floor(b.pos.x / cellSize);
    const j = Math.floor(b.pos.y / cellSize);
    const k = key(i, j);
    if (!cells.has(k)) cells.set(k, []);
    cells.get(k).push(b);
    b._ci = i; b._cj = j;
  }

  const pairs = [];
  for (const b of bodies) {
    for (let di = -1; di <= 1; di++)
      for (let dj = -1; dj <= 1; dj++) {
        const bucket = cells.get(key(b._ci + di, b._cj + dj));
        if (!bucket) continue;
        for (const o of bucket) if (b !== o && b.id < o.id) pairs.push([b, o]);
      }
  }
  return pairs;
}

function resolveCollisions(world) {
  const cellSize = 50; 
  const pairs = gridPairs(world.bodies, cellSize);
  
  for (const [a, b] of pairs) {
    resolvePair(a, b, world.restitution);
  }

  resolveBoundary(world);
} export { resolveCollisions }