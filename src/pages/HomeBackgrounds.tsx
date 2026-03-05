import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ── PLAYGROUND BG — node network + tech overlays ──────────────────────────────
export const PlaygroundBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    interface Pt { x: number; y: number; vx: number; vy: number; r: number; phase: number; ps: number; }
    const pts: Pt[] = Array.from({ length: 38 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00016,
      vy: (Math.random() - 0.5) * 0.00016,
      r: 1.6 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      ps: 0.009 + Math.random() * 0.011,
    }));

    let raf: number;
    const N = pts.length;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy; p.phase += p.ps;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.24) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x * w, pts[i].y * h);
            ctx.lineTo(pts[j].x * w, pts[j].y * h);
            ctx.strokeStyle = `rgba(77,143,200,${(1 - d / 0.24) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const g = 0.5 + 0.5 * Math.sin(p.phase);
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * (0.9 + g * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77,143,200,${0.28 + g * 0.32})`;
        ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Canvas: drifting node network */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '55%', height: '55%', top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(77,143,200,0.28) 0%, transparent 65%)',
          filter: 'blur(52px)',
        }}
        animate={{ x: [0, 45, 0], y: [0, 32, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '44%', height: '44%', bottom: '-14%', right: '-10%',
          background: 'radial-gradient(circle, rgba(77,143,200,0.2) 0%, transparent 65%)',
          filter: 'blur(44px)',
        }}
        animate={{ x: [0, -32, 0], y: [0, -26, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Horizontal scanner line */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(77,143,200,0.55) 25%, rgba(126,184,232,0.95) 50%, rgba(77,143,200,0.55) 75%, transparent 100%)',
          boxShadow: '0 0 16px 3px rgba(77,143,200,0.55), 0 0 4px rgba(255,255,255,0.35)',
        }}
        initial={{ top: '-2%' }}
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />

      {/* Concentric pulsing rings */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {[38, 54, 70].map((r, i) => (
          <motion.circle
            key={i}
            cx="100" cy="100" r={r}
            fill="none"
            stroke="rgba(77,143,200,1)"
            strokeWidth="0.45"
            animate={{ opacity: [0.12, 0.42, 0.12] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 1.35 }}
          />
        ))}
      </svg>
    </div>
  );
};

// ── GAMES BG — embers + rotating diamonds + amber atmosphere ──────────────────
export const GamesBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    interface Ember { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; }
    const embers: Ember[] = [];
    const spawn = (): Ember => ({
      x: canvas.width * (0.05 + Math.random() * 0.9),
      y: canvas.height + 8,
      vx: (Math.random() - 0.5) * 0.65,
      vy: -(0.5 + Math.random() * 0.8),
      life: 0,
      maxLife: 100 + Math.random() * 160,
      size: 1.2 + Math.random() * 3.0,
    });

    for (let i = 0; i < 30; i++) {
      const e = spawn();
      e.y = Math.random() * canvas.height;
      e.life = Math.random() * e.maxLife * 0.65;
      embers.push(e);
    }

    let frame = 0, raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame++;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (frame % 5 === 0 && embers.length < 65) embers.push(spawn());

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx; e.y += e.vy; e.life++;
        e.vx += (Math.random() - 0.5) * 0.09;
        if (e.life > e.maxLife || e.y < -15) { embers.splice(i, 1); continue; }
        const t = e.life / e.maxLife;
        const a = (t < 0.1 ? t / 0.1 : t > 0.6 ? (1 - t) / 0.4 : 1) * 0.55;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,150,43,${a})`;
        ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const DIAMONDS = [
    { left: '15%', top: '18%', size: 100, duration: 16, delay: 0, opacity: 0.25 },
    { left: '60%', top: '52%', size: 72, duration: 22, delay: 2.5, opacity: 0.2 },
    { left: '44%', top: '5%', size: 50, duration: 12, delay: 1, opacity: 0.3 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Amber atmosphere orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '60%', height: '56%', top: '-22%', right: '-16%',
          background: 'radial-gradient(circle, rgba(201,150,43,0.26) 0%, transparent 65%)',
          filter: 'blur(58px)',
        }}
        animate={{ x: [0, -38, 0], y: [0, 32, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '50%', height: '46%', bottom: '-16%', left: '-8%',
          background: 'radial-gradient(circle, rgba(232,148,43,0.2) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, 28, 0], y: [0, -24, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Slowly rotating diamond outlines */}
      {DIAMONDS.map((d, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', left: d.left, top: d.top }}
          animate={{ rotate: 360 }}
          transition={{ duration: d.duration, repeat: Infinity, ease: 'linear', delay: d.delay }}
        >
          <svg width={d.size} height={d.size} viewBox="0 0 100 100">
            <polygon
              points="50,4 92,50 50,96 8,50"
              fill="none"
              stroke={`rgba(201,150,43,${d.opacity})`}
              strokeWidth="1.8"
            />
          </svg>
        </motion.div>
      ))}

      {/* Bottom heat haze gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, rgba(180,80,10,0.12) 0%, transparent 100%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};
