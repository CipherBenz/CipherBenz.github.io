/**
 * rain.js — Ambient Matrix Cyber Rain Background
 * Clean original styling, speed tuned to be smooth and comfortable.
 */

const GLYPHS = '0123456789ABCDEF!<>-_\\/[]{}=+*^?#λπΩΨ010101XYZSEC'.split('');
const SIZE = 16;

export function startRain(canvas, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drops = [];
  let cols = 0;
  let w = 0;
  let h = 0;
  let animId = null;
  const pointer = { x: -10000, y: -10000 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / SIZE);
    drops = Array.from({ length: cols }, () => ({
      y: Math.random() * -h,
      v: 0.35 + Math.random() * 0.65,
      char: GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }));
    ctx.fillStyle = '#03050b';
    ctx.fillRect(0, 0, w, h);
  }

  function onPointerMove(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }

  function onPointerLeave() {
    pointer.x = -10000;
    pointer.y = -10000;
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });

  resize();

  function draw() {
    ctx.fillStyle = 'rgba(3, 5, 11, 0.12)';
    ctx.fillRect(0, 0, w, h);
    ctx.font = `${SIZE - 2}px "JetBrains Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const d = drops[i];
      const x = i * SIZE;
      const near = Math.abs(x - pointer.x) < 90 && Math.abs(d.y - pointer.y) < 140;

      if (Math.random() < 0.025) {
        d.char = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }

      if (near) {
        ctx.fillStyle = '#ff2bd6';
        ctx.globalAlpha = 1.0;
      } else if (i % 6 === 0) {
        ctx.fillStyle = '#22e6ff';
        ctx.globalAlpha = 0.85;
      } else {
        ctx.fillStyle = '#3dff8a';
        ctx.globalAlpha = 0.75;
      }

      ctx.fillText(d.char, x, d.y);

      // Tuned speed: gently paced (5.5 instead of the original 14)
      d.y += d.v * 5.5 * (near ? 1.8 : 1.0);

      if (d.y > h + 30) {
        d.y = -20 - Math.random() * 80;
        d.v = 0.35 + Math.random() * 0.65;
      }
    }

    animId = requestAnimationFrame(draw);
  }

  animId = requestAnimationFrame(draw);

  return {
    stop() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    }
  };
}
