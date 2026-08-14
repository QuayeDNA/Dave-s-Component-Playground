import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ── PLAYGROUND BG — construction sheet ────────────────────────────────────────
// Clean + precise: hairline grid, feathered corner glows, numeral signature.
// No canvas, no blur filters — motion is transform/opacity only.
const PLAYGROUND_NUMERALS = ['01', '02', '03', '04', '05', '06', '07'];

export const PlaygroundBg: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Hairline construction grid */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="pg-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(78,143,200,0.07)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pg-grid)" />
      </svg>

      {/* Feathered corner glows (static — no filter blur needed) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%', left: '-10%', width: '70%', height: '70%',
          background: 'radial-gradient(circle, rgba(77,143,200,0.16) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-26%', right: '-14%', width: '58%', height: '58%',
          background: 'radial-gradient(circle, rgba(126,184,232,0.08) 0%, transparent 65%)',
        }}
      />

      {/* Numeral signature — echoes the numbered sections of the pages it links to */}
      <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3.5">
        {PLAYGROUND_NUMERALS.map((n) => (
          <span
            key={n}
            className="text-[11px] leading-none tabular-nums"
            style={{ fontFamily: '"Space Mono", monospace', color: 'rgba(126,184,232,0.2)' }}
          >
            {n}
          </span>
        ))}
      </div>

      {/* Motion — a slow light sheen across the grid + a drifting glow (transform-only) */}
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: '-30%', height: '160%', width: '55%', left: '0%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(126,184,232,0.045) 45%, rgba(126,184,232,0.085) 50%, rgba(126,184,232,0.045) 55%, transparent 100%)',
              willChange: 'transform',
            }}
            animate={{ x: ['-130%', '330%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '48%', height: '46%', top: '-12%', left: '30%',
              background: 'radial-gradient(circle, rgba(77,143,200,0.1) 0%, transparent 65%)',
            }}
            animate={{ x: [0, 34, 0], y: [0, 26, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
    </div>
  );
};

// ── GAMES BG — three worlds, design bible ─────────────────────────────────────
// Material + textured: grain, tricolor hairline (one per world), faint embers.
// The ember canvas is the single living element — DPR-clamped, paused when
// hidden/off-screen, frozen under reduced-motion.
const WORLD_COLORS = ['#7eb8e8', '#7ec87e', '#c9962b'];
const EMBER_RGBS = ['201,150,43', '224,146,43', '188,128,48'];

const GRAIN_URI = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const GamesBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Ember {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      size: number; rgb: string;
    }

    const embers: Ember[] = [];
    let w = 0, h = 0;
    let raf = 0;
    let paused = false;
    let frame = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = (): Ember => ({
      x: Math.random(),
      y: 1.05,
      vx: (Math.random() - 0.5) * 0.55,
      vy: -(0.4 + Math.random() * 0.75),
      life: 0,
      maxLife: 120 + Math.random() * 180,
      size: 1.1 + Math.random() * 2.3,
      rgb: EMBER_RGBS[(Math.random() * EMBER_RGBS.length) | 0],
    });

    for (let i = 0; i < 24; i++) {
      const e = spawn();
      e.y = Math.random();
      e.life = Math.random() * e.maxLife * 0.65;
      embers.push(e);
    }

    const render = () => {
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        const t = e.life / e.maxLife;
        const a = (t < 0.1 ? t / 0.1 : t > 0.6 ? (1 - t) / 0.4 : 1) * 0.5;
        ctx.beginPath();
        ctx.arc(e.x * w, e.y * h, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${e.rgb},${a.toFixed(3)})`;
        ctx.fill();
      }
    };

    const step = () => {
      if (w === 0 || h === 0) return;
      frame++;
      if (frame % 6 === 0 && embers.length < 26) embers.push(spawn());
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx / w;
        e.y += e.vy / h;
        e.vx += (Math.random() - 0.5) * (0.09 / w);
        e.life++;
        if (e.life > e.maxLife || e.y < -0.02) embers.splice(i, 1);
      }
      render();
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (paused || document.hidden) return;
      step();
    };

    if (reduceMotion) {
      render();
    } else {
      tick();
    }

    const io = new IntersectionObserver(([entry]) => { paused = !entry.isIntersecting; }, { threshold: 0.05 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Feathered amber corner glows (static) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-22%', right: '-16%', width: '60%', height: '56%',
          background: 'radial-gradient(circle, rgba(201,150,43,0.16) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-16%', left: '-8%', width: '50%', height: '46%',
          background: 'radial-gradient(circle, rgba(232,148,43,0.1) 0%, transparent 65%)',
        }}
      />

      {/* Ember canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Dossier grain */}
      <div
        className="absolute inset-0"
        style={{ opacity: 0.03, backgroundImage: GRAIN_URI, backgroundSize: '200px 200px' }}
      />

      {/* Tricolor hairline — one segment per world */}
      <div className="absolute bottom-3 left-6 right-6 flex h-px" style={{ opacity: 0.5 }}>
        {WORLD_COLORS.map((c) => (
          <div key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      {/* Numeral signature — one per world, in that world's accent */}
      <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3.5">
        {WORLD_COLORS.map((c, i) => (
          <span
            key={c}
            className="text-[11px] leading-none tabular-nums"
            style={{ fontFamily: '"Space Mono", monospace', color: c, opacity: 0.32 }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Motion — slow amber drift (transform-only) */}
      {!reduceMotion && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '46%', height: '42%', bottom: '-14%', left: '24%',
            background: 'radial-gradient(circle, rgba(201,150,43,0.08) 0%, transparent 65%)',
          }}
          animate={{ x: [0, 26, 0], y: [0, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};
