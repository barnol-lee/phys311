export function drawHUD(ctx, world, E0, p0, fps, tPhysics, tRender) {
  const E = world.totalEnergy();
  const KE = world.getKE();
  const PE = world.getPE();
  const p = world.totalMomentum();
  let Bp = world.bodyMomentum;
  let imp = world.impulse;
  let Lp = world.boundsLoss;
  const dE = E0 === 0 ? 0 : (E - E0) / Math.abs(E0);
  const dp = p0 === 0 ? 0 : ((p.sub(p0)).length()) / p0.length();

  const lines = [
    `t        = ${world.time.toFixed(2)} s`,
    `bodies   = ${world.bodies.length}`,
    `E        = ${E.toFixed(4)} J`,
    `dE/E0    = ${(dE * 100).toFixed(3)} %`,
    `KE       = ${KE.toFixed(4)} J`,
    `PE       = ${PE.toFixed(4)} J`,
    `|p|      = ${p.length().toFixed(4)}`,
    `|dp|/|p0|= ${(dp * 100).toFixed(4)} %`,
    `|p_body| = ${Bp.length().toFixed(4)}`,
    `Impulse  = ${imp.length().toFixed(4)}`,
    `|p_bound|= ${Lp.length().toFixed(4)}`,
    `FPS      = ${Math.round(fps)}`,
    `tPhysics = ${tPhysics.toFixed(3)} ms`,
    `tRender  = ${tRender.toFixed(3)} ms`
  ];

  const paddingX = 14;
  const paddingY = 14;
  const startX = 10;
  const startY = 10;
  const lineHeight = 17;
  const totalTextHeight = lines.length * lineHeight;
  const boxWidth = 210;
  const boxHeight = totalTextHeight + (paddingY * 2) - 6;

  ctx.save();

  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;

  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(startX, startY, boxWidth, boxHeight, 6);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(startX, startY, boxWidth, boxHeight);
  }
  ctx.font = "13px monospace";
  ctx.textBaseline = "top";

  lines.forEach((line, i) => {
    if (Math.abs(dE) > 0.01) {
      ctx.fillStyle = "#f87171";
    } else {
      ctx.fillStyle = "#e2e8f0";
    }
    ctx.fillText(line, startX + paddingX, startY + paddingY + (i * lineHeight));
  });
  ctx.restore();
}
