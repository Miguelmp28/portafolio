/**
 * faith-bg.js — Particulas de fe
 * Particulas ambar oscuras que rondan por toda la pantalla.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
    pointerEvents: "none",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let W, H;

  /* ── Particle factory ── */
  const N = 80;
  let particles = [];

  function newParticle(forceRandom) {
    // On init, spread across whole screen. On respawn, enter from edges.
    let x, y;
    if (forceRandom) {
      x = Math.random() * W;
      y = Math.random() * H;
    } else {
      // Enter from a random edge
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { x = Math.random() * W; y = -10; }
      else if (edge === 1) { x = W + 10; y = Math.random() * H; }
      else if (edge === 2) { x = Math.random() * W; y = H + 10; }
      else  { x = -10; y = Math.random() * H; }
    }

    // Random drift direction
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.18 + Math.random() * 0.32;

    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      // Gentle wander — angle drifts slowly over time
      angle,
      wander: (Math.random() - 0.5) * 0.012,
      r:       1.2 + Math.random() * 2.2,
      // Darker amber: deep ochre tones
      h:       28 + Math.random() * 18,   // hue 28–46 (deep amber/ochre)
      s:       60 + Math.random() * 25,   // saturation
      l:       32 + Math.random() * 18,   // lightness 32–50 (darker)
      baseA:   0.28 + Math.random() * 0.32,
      phase:   Math.random() * Math.PI * 2,
      pulseSpd: 0.4 + Math.random() * 0.8,
      life:    0,
      maxLife: 400 + Math.random() * 600,
    };
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    // Re-seed all particles across the new size
    particles = Array.from({ length: N }, () => newParticle(true));
  }

  window.addEventListener("resize", resize);
  resize();

  /* ── Render loop ── */
  let last = performance.now();

  function frame(now) {
    const dt = Math.min(now - last, 50); // cap delta to avoid jumps
    last = now;
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.life += dt * 0.05;

      // Wander: slowly rotate velocity direction
      p.angle += p.wander;
      p.vx = Math.cos(p.angle) * (0.18 + 0.32 * 0.5); // maintain approx speed
      p.vy = Math.sin(p.angle) * (0.18 + 0.32 * 0.5);

      p.x += p.vx;
      p.y += p.vy;

      // Respawn if out of bounds or lifetime exceeded
      const margin = 40;
      if (
        p.life >= p.maxLife ||
        p.x < -margin || p.x > W + margin ||
        p.y < -margin || p.y > H + margin
      ) {
        particles[i] = newParticle(false);
        return;
      }

      // Fade in/out over lifetime
      const lr   = p.life / p.maxLife;
      const fade = lr < 0.15 ? lr / 0.15 : lr > 0.75 ? 1 - (lr - 0.75) / 0.25 : 1;
      // Gentle pulse
      const pulse = 0.7 + 0.3 * Math.sin(now * 0.001 * p.pulseSpd + p.phase);
      const alpha = p.baseA * fade * pulse;

      ctx.save();
      ctx.globalAlpha = alpha;
      // Soft glow
      ctx.shadowBlur  = 8;
      ctx.shadowColor = `hsla(${p.h},${p.s}%,${p.l + 10}%,0.5)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.h},${p.s}%,${p.l}%)`;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
