(() => {
  const root = document.getElementById('hs-root');
  const hero = document.getElementById('hs-hero');
  const svg = document.getElementById('hs-svg');
  const grad = document.getElementById('hsRef');
  if (!root || !hero || !svg || !grad) return;

  const VIEW_W = 403.95;
  const VIEW_H = 89.84;

  const t = { x: 0.5, y: 0.45, g: 0 };
  const c = { x: 0.5, y: 0.45, g: 0 };
  let active = false;
  let idleTimer = null;
  const t0 = performance.now();

  function setTarget(clientX, clientY) {
    const r = hero.getBoundingClientRect();
    active = true;
    t.x = (clientX - r.left) / r.width;
    t.y = (clientY - r.top) / r.height;
    t.g = 1;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { active = false; }, 2600);
  }

  function onPointerMove(ev) {
    setTarget(ev.clientX, ev.clientY);
  }

  function onTouchStart(ev) {
    const touch = ev.touches && ev.touches[0];
    if (!touch) return;
    setTarget(touch.clientX, touch.clientY);
  }

  function onLeave() {
    active = false;
  }

  hero.addEventListener('pointermove', onPointerMove);
  hero.addEventListener('pointerleave', onLeave);
  hero.addEventListener('touchstart', onTouchStart, { passive: true });
  hero.addEventListener('touchmove', onTouchStart, { passive: true });

  function loop() {
    const now = (performance.now() - t0) / 1000;

    if (!active) {
      t.x = 0.5 + Math.sin(now * 0.19) * 0.22;
      t.y = 0.5 + Math.cos(now * 0.13) * 0.38;
      t.g = 0;
    }

    const ease = 0.055;
    c.x += (t.x - c.x) * ease;
    c.y += (t.y - c.y) * ease;
    c.g += (t.g - c.g) * 0.02;

    root.style.setProperty('--mx', (c.x * 100).toFixed(2) + '%');
    root.style.setProperty('--my', (c.y * 100).toFixed(2) + '%');
    root.style.setProperty('--par', (c.x - 0.5).toFixed(3));

    const pulse = 0.5 + 0.5 * Math.sin(now * 1.15);
    const beat = 0.5 + 0.5 * Math.sin(now * 2.3 + 1.1);
    const glow = Math.min(1, c.g * (0.72 + pulse * 0.28) + pulse * 0.16 + beat * 0.05);
    root.style.setProperty('--glow', glow.toFixed(3));
    root.style.setProperty('--ang', (72 + (c.x - 0.5) * 120 + (c.y - 0.5) * 40).toFixed(1) + 'deg');

    const hr = hero.getBoundingClientRect();
    const sr = svg.getBoundingClientRect();
    if (sr.width && sr.height) {
      const px = hr.left + c.x * hr.width;
      const py = hr.top + c.y * hr.height;
      const sx = ((px - sr.left) / sr.width) * VIEW_W;
      const sy = ((py - sr.top) / sr.height) * VIEW_H;
      grad.setAttribute('cx', sx.toFixed(1));
      grad.setAttribute('cy', sy.toFixed(1));
      grad.setAttribute('r', (150 + pulse * 55 - c.g * 40).toFixed(1));
      grad.setAttribute(
        'gradientTransform',
        'translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ') scale(1 ' + (0.55 + pulse * 0.2).toFixed(2) + ') translate(' + (-sx).toFixed(1) + ' ' + (-sy).toFixed(1) + ')'
      );
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
