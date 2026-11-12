export class drawHUD {
  constructor(el) { this.el = el; this.fps = 60; this._last = null; }

  tick(now) {
    if (this._last !== null) {
      const inst = 1000 / Math.max(1e-6, now - this._last);
      this.fps = this.fps * 0.9 + inst * 0.1;
    }
    this._last = now;
  }

  update(world, { substeps = 0, paused = false } = {}) {
    const dE = world.driftE();
    const dP = world.driftP();
    const bad = Math.abs(dE) > 0.01;
    const expectP = world.momentumConserved && !(world.pointer && world.pointer.active);
    const badP = expectP && dP > 1e-6;

    const timeStr   = (world.time ?? 0).toFixed(2);
    const stepsStr  = world.steps ?? 0;
    const bodiesStr = world.bodies?.length ?? 0;
    const keStr     = (typeof world.getKE === 'function' ? (world.getKE() ?? 0) : 0).toFixed(3);
    const mechStr   = (typeof world.mechE === 'function' ? (world.mechE() ?? 0) : 0).toFixed(3);
    const inelastic = world.inelastic ?? 0;
    const dissipated = world.dissipated ?? 0;
    const lostStr   = (inelastic + dissipated).toFixed(3);
    const dEStr     = (dE * 100).toFixed(3);
    const dPStr     = dP.toExponential(2);
    const fpsStr    = (this.fps ?? 0).toFixed(0);

    this.el.innerHTML = `
    <span class="k">t</span><span class="v">${timeStr} s</span>
    <span class="k">steps</span><span class="v">${stepsStr}</span>
    <span class="k">bodies</span><span class="v">${bodiesStr}</span>
    <span class="k">KE</span><span class="v">${keStr} J</span>
    <span class="k">E mech</span><span class="v">${mechStr} J</span>
    <span class="k">E lost</span><span class="v">${lostStr} J</span>
    <span class="k">&Delta;E/E₀</span>
    <span class="v ${bad ? 'bad' : 'ok'}">${dEStr} %</span>
    <span class="k">&Delta;p/p₀</span>
    <span class="v ${badP ? 'bad' : (expectP ? 'ok' : 'na')}">${dPStr}${expectP ? '' : ' n/a'}</span>
    <span class="k">fps</span><span class="v">${fpsStr}</span>
    <span class="k">sub/frame</span><span class="v">${substeps}${paused ? ' (paused)' : ''}</span>`;
    
    this.el.setAttribute('aria-label',
    `time ${timeStr} seconds, energy drift ${dEStr} percent`);
    }
}