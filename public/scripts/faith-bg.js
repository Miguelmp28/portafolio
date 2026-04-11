/**
 * faith-bg.js — Fondos animados de fe
 * Selecciona entre 5 animaciones. Preferencia guardada en localStorage.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const STORAGE_KEY = "faith_bg_anim";
  const ANIMATIONS = [
    { key: "rayos",      label: "Rayos de Luz",  icon: "✦" },
    { key: "estrellas",  label: "Estrellas",      icon: "★" },
    { key: "ondas",      label: "Ondas Vivas",    icon: "◎" },
    { key: "particulas", label: "Particulas",     icon: "·" },
    { key: "ninguna",    label: "Sin fondo",      icon: "○" },
  ];

  let currentKey = localStorage.getItem(STORAGE_KEY) || "rayos";
  let canvas, ctx, W, H, animFrame;

  /* ── Canvas ── */
  function createCanvas() {
    canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "fixed", top: "0", left: "0",
      zIndex: "0", pointerEvents: "none",
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    onResize();
    window.addEventListener("resize", onResize);
  }

  function onResize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    activate(currentKey);
  }

  function stopLoop() {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (ctx) ctx.clearRect(0, 0, W, H);
  }

  /* ── Activate ── */
  function activate(key) {
    stopLoop();
    currentKey = key;
    localStorage.setItem(STORAGE_KEY, key);
    updatePanelActive();
    if (key === "ninguna") return;
    const fn = { rayos, estrellas, ondas, particulas }[key];
    if (fn) fn();
  }

  /* ─────────────────── RAYOS DE LUZ ─────────────────── */
  function rayos() {
    const N = 8;
    const beams = Array.from({ length: N }, (_, i) => ({
      baseAngle: ((i / (N - 1)) - 0.5) * 1.35,
      phase:     Math.random() * Math.PI * 2,
      speed:     0.4  + Math.random() * 0.5,
      topW:      3    + Math.random() * 5,
      botW:      90   + Math.random() * 130,
      maxAlpha:  0.055 + Math.random() * 0.06,
    }));
    let t = 0, last = performance.now();

    function frame(now) {
      t += (now - last) * 0.001; last = now;
      ctx.clearRect(0, 0, W, H);

      const srcX = W / 2, srcY = -H * 0.04;

      ctx.save();
      ctx.filter = "blur(26px)";

      beams.forEach(b => {
        const wobble = Math.sin(t * b.speed * 2.5 + b.phase) * 0.028;
        const angle  = b.baseAngle + wobble;
        const pulse  = 0.55 + 0.45 * Math.sin(t * b.speed * 1.8 + b.phase);
        const alpha  = b.maxAlpha * pulse;
        const dist   = H * 2.1;
        const endX   = srcX + Math.sin(angle) * dist;
        const endY   = srcY + Math.cos(angle) * dist;
        const px = Math.cos(angle), py = -Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(srcX - px * b.topW * 3, srcY - py * b.topW * 3);
        ctx.lineTo(srcX + px * b.topW * 3, srcY + py * b.topW * 3);
        ctx.lineTo(endX + px * b.botW * 2.2, endY + py * b.botW * 2.2);
        ctx.lineTo(endX - px * b.botW * 2.2, endY - py * b.botW * 2.2);
        ctx.closePath();
        ctx.fillStyle = `rgba(212,165,32,${alpha * 0.35})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(srcX - px * b.topW, srcY - py * b.topW);
        ctx.lineTo(srcX + px * b.topW, srcY + py * b.topW);
        ctx.lineTo(endX + px * b.botW, endY + py * b.botW);
        ctx.lineTo(endX - px * b.botW, endY - py * b.botW);
        ctx.closePath();
        ctx.fillStyle = `rgba(232,184,48,${alpha})`;
        ctx.fill();
      });

      /* Halo */
      const hp = 0.75 + 0.25 * Math.sin(t * 0.6);
      const hr = 160 * hp;
      const g  = ctx.createRadialGradient(srcX, srcY, 0, srcX, srcY, hr);
      g.addColorStop(0,    `rgba(255,232,122,${0.28 * hp})`);
      g.addColorStop(0.45, `rgba(245,200,66,${0.18 * hp})`);
      g.addColorStop(1,    "rgba(245,200,66,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(srcX, srcY, hr, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
      animFrame = requestAnimationFrame(frame);
    }
    animFrame = requestAnimationFrame(frame);
  }

  /* ─────────────────── ESTRELLAS ─────────────────── */
  function estrellas() {
    const stars = Array.from({ length: 130 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      spd:   0.3 + Math.random() * 0.7,
      vx:    (Math.random() - 0.5) * 0.1,
      vy:    (Math.random() - 0.5) * 0.1,
    }));

    /* Cross constellation — top-right quadrant */
    const cx = W * 0.72, cy = H * 0.22, cs = Math.min(W, H) * 0.08;
    const cross = [
      { x: cx,      y: cy - cs },
      { x: cx,      y: cy      },
      { x: cx,      y: cy + cs },
      { x: cx - cs, y: cy      },
      { x: cx + cs, y: cy      },
    ];

    let t = 0, last = performance.now();

    function frame(now) {
      t += (now - last) * 0.001; last = now;
      ctx.clearRect(0, 0, W, H);

      stars.forEach(s => {
        s.x = (s.x + s.vx + W) % W;
        s.y = (s.y + s.vy + H) % H;
        const a = (0.25 + 0.35 * Math.sin(t * s.spd + s.phase)) * 0.65;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,70,${a})`;
        ctx.fill();
      });

      const ca = 0.16 + 0.07 * Math.sin(t * 0.45);
      ctx.strokeStyle = `rgba(255,200,60,${ca})`;
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 6]);
      for (let i = 0; i < cross.length - 1; i++) {
        for (let j = i + 1; j < cross.length; j++) {
          ctx.beginPath();
          ctx.moveTo(cross[i].x, cross[i].y);
          ctx.lineTo(cross[j].x, cross[j].y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
      cross.forEach(s => {
        const a2 = 0.5 + 0.3 * Math.sin(t * 0.8);
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,120,${a2})`; ctx.fill();
      });

      animFrame = requestAnimationFrame(frame);
    }
    animFrame = requestAnimationFrame(frame);
  }

  /* ─────────────────── ONDAS VIVAS ─────────────────── */
  function ondas() {
    const NUM  = 7;
    const maxR = Math.sqrt(W * W + H * H);
    const srcX = W / 2, srcY = 0;
    let t = 0, last = performance.now();

    function frame(now) {
      t += (now - last) * 0.001; last = now;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < NUM; i++) {
        const phase = (i / NUM) * maxR;
        const r     = ((t * 68 + phase) % maxR);
        const frac  = r / maxR;
        const alpha = (0.13 - frac * 0.13) * (0.65 + 0.35 * Math.sin(t * 0.4 + i));
        if (alpha <= 0) continue;
        ctx.beginPath();
        ctx.arc(srcX, srcY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,165,32,${alpha})`;
        ctx.lineWidth   = 1.8;
        ctx.stroke();
      }

      animFrame = requestAnimationFrame(frame);
    }
    animFrame = requestAnimationFrame(frame);
  }

  /* ─────────────────── PARTICULAS ─────────────────── */
  function particulas() {
    const N   = 65;
    function newParticle() {
      return {
        x:       Math.random() * W,
        y:       H + Math.random() * 80,
        vy:      -(0.35 + Math.random() * 0.8),
        vx:      (Math.random() - 0.5) * 0.35,
        r:       1 + Math.random() * 2,
        baseA:   0.35 + Math.random() * 0.4,
        life:    0,
        maxLife: 200 + Math.random() * 320,
      };
    }
    const pts = Array.from({ length: N }, newParticle);
    let last = performance.now();

    function frame(now) {
      const dt = (now - last) * 0.06; last = now;
      ctx.clearRect(0, 0, W, H);

      pts.forEach((p, i) => {
        p.life += dt;
        p.x    += p.vx;
        p.y    += p.vy;
        const lr = p.life / p.maxLife;
        if (lr >= 1) { pts[i] = newParticle(); return; }
        const fade = lr < 0.2 ? lr / 0.2 : lr > 0.7 ? 1 - (lr - 0.7) / 0.3 : 1;
        const a = p.baseA * fade * 0.75;
        ctx.save();
        ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(255,200,40,${a * 0.5})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,218,72,${a})`; ctx.fill();
        ctx.restore();
      });

      animFrame = requestAnimationFrame(frame);
    }
    animFrame = requestAnimationFrame(frame);
  }

  /* ─────────────────── SELECTOR UI ─────────────────── */
  let panelEl = null;

  function isDark() {
    return document.documentElement.classList.contains("dark");
  }

  function panelStyles() {
    const dark = isDark();
    return {
      bg:      dark ? "rgba(24,24,27,0.93)"   : "rgba(255,255,255,0.93)",
      border:  dark ? "rgba(80,80,100,0.4)"   : "rgba(160,160,160,0.25)",
      btnBg:   dark ? "rgba(39,39,42,0.88)"   : "rgba(255,255,255,0.88)",
      btnBdr:  dark ? "rgba(100,100,120,0.4)" : "rgba(160,160,160,0.3)",
      btnClr:  dark ? "#a1a1aa"               : "#52525b",
      optClr:  dark ? "#d4d4d8"               : "#3f3f46",
      activeBg: dark ? "rgba(180,130,10,0.22)" : "rgba(245,200,66,0.16)",
      activeBdr: dark ? "rgba(180,130,10,0.45)" : "rgba(212,165,32,0.45)",
    };
  }

  function buildSelector() {
    /* Toggle button */
    const btn = document.createElement("button");
    btn.id   = "faithBgBtn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Cambiar fondo animado");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

    const s = btn.style;
    s.position      = "fixed";
    s.bottom        = "1rem";
    s.left          = "1rem";
    s.zIndex        = "60";
    s.width         = "40px";
    s.height        = "40px";
    s.borderRadius  = "50%";
    s.border        = "1px solid";
    s.cursor        = "pointer";
    s.display       = "flex";
    s.alignItems    = "center";
    s.justifyContent = "center";
    s.boxShadow     = "0 2px 8px rgba(0,0,0,0.14)";
    s.backdropFilter = "blur(8px)";
    s.transition    = "background 0.25s, color 0.25s";

    /* Options panel */
    const panel = document.createElement("div");
    panel.id = "faithBgPanel";
    const ps = panel.style;
    ps.position      = "fixed";
    ps.bottom        = "3.8rem";
    ps.left          = "1rem";
    ps.zIndex        = "60";
    ps.borderRadius  = "16px";
    ps.border        = "1px solid";
    ps.padding       = "8px";
    ps.display       = "none";
    ps.flexDirection = "column";
    ps.gap           = "4px";
    ps.boxShadow     = "0 6px 24px rgba(0,0,0,0.18)";
    ps.backdropFilter = "blur(14px)";
    ps.minWidth      = "168px";

    ANIMATIONS.forEach(({ key, label, icon }) => {
      const ob = document.createElement("button");
      ob.type           = "button";
      ob.dataset.animKey = key;
      ob.innerHTML      = `<span style="font-size:13px;width:22px;text-align:center;flex-shrink:0">${icon}</span><span style="font-size:12px;font-weight:600">${label}</span>`;
      const os = ob.style;
      os.display    = "flex";
      os.alignItems = "center";
      os.gap        = "8px";
      os.padding    = "7px 10px";
      os.borderRadius = "10px";
      os.border     = "1px solid transparent";
      os.cursor     = "pointer";
      os.width      = "100%";
      os.textAlign  = "left";
      os.fontFamily = "inherit";
      os.transition = "background 0.15s";
      ob.addEventListener("click", () => {
        activate(key);
        panel.style.display = "none";
      });
      panel.appendChild(ob);
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = panel.style.display === "flex";
      panel.style.display = open ? "none" : "flex";
      if (!open) applyPanelTheme();
    });

    document.addEventListener("click", () => { panel.style.display = "none"; });

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    panelEl = panel;

    applyPanelTheme();

    /* Watch dark mode changes */
    new MutationObserver(applyPanelTheme)
      .observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }

  function applyPanelTheme() {
    const t = panelStyles();
    const btn   = document.getElementById("faithBgBtn");
    const panel = document.getElementById("faithBgPanel");
    if (!btn || !panel) return;

    btn.style.background   = t.btnBg;
    btn.style.borderColor  = t.btnBdr;
    btn.style.color        = t.btnClr;
    panel.style.background = t.bg;
    panel.style.borderColor = t.border;

    panel.querySelectorAll("button[data-anim-key]").forEach(ob => {
      const active = ob.dataset.animKey === currentKey;
      ob.style.background   = active ? t.activeBg  : "transparent";
      ob.style.borderColor  = active ? t.activeBdr : "transparent";
      ob.style.color        = t.optClr;
      ob.style.fontWeight   = active ? "700" : "600";
    });
  }

  function updatePanelActive() {
    applyPanelTheme();
  }

  /* ── Init ── */
  createCanvas();
  buildSelector();
  activate(currentKey);
})();
