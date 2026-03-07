import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Flame, Snowflake } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// GAME UI SHOWCASE — Six complete style directions
// ─────────────────────────────────────────────────────────────────────────────

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Special+Elite&family=VT323&family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Orbitron:wght@400;700;900&family=Chakra+Petch:wght@400;600;700&family=Oswald:wght@400;600;700&family=Press+Start+2P&display=swap');

/* Base overrides */
.gui-root { -webkit-font-smoothing: antialiased; }

/* Style A — Terminal grid background */
.gui-grid {
  background-image:
    linear-gradient(rgba(126,184,232,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(126,184,232,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* Style B — Film grain overlay */
.gui-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  z-index: 0;
}

/* Style D — CRT scanlines */
.gui-scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.08) 2px,
    rgba(0,0,0,0.08) 4px
  );
  z-index: 1;
}

/* Style D — Neon perspective grid floor */
.gui-neon-grid {
  background-image:
    linear-gradient(rgba(0,245,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,245,255,0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(400px) rotateX(50deg);
  height: 200px;
  transform-origin: bottom center;
}

/* Style F — Pixel rendering */
.gui-pixel { image-rendering: pixelated; image-rendering: crisp-edges; }

/* Keyframes */
@keyframes gui-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes gui-ember {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.35) saturate(1.2); }
}
@keyframes gui-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes gui-float {
  0% { transform: translateY(0px); opacity: 1; }
  100% { transform: translateY(-60px); opacity: 0; }
}
@keyframes gui-neon-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes gui-damage {
  0% { background: rgba(180,0,0,0.38); }
  100% { background: transparent; }
}
@keyframes gui-levelup {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.35); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0; }
}
@keyframes gui-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}
`;

// ─── Theme System ─────────────────────────────────────────────────────────────

type SID = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface Th {
  id: SID;
  tag: string;
  a: string;   // primary accent
  b: string;   // secondary accent
  bg: string;
  surf: string;
  bord: string;
  text: string;
  muted: string;
  font: string;   // body/ui font
  disp: string;   // display/title font
  name: string;
}

const T: Record<SID, Th> = {
  A: {
    id: 'A', tag: 'SCI-FI', name: 'Geometric Terminal',
    a: '#7eb8e8', b: '#4d8fc8',
    bg: '#07101a', surf: '#0c1a28', bord: '#7eb8e820',
    text: '#c8e4f8', muted: '#7eb8e866',
    font: '"Space Mono", monospace', disp: '"Bebas Neue", sans-serif',
  },
  B: {
    id: 'B', tag: 'TS//SCI', name: 'Intelligence Dossier',
    a: '#7ec87e', b: '#c8522a',
    bg: '#0f0d0a', surf: '#181410', bord: '#3d3020',
    text: '#c8b89a', muted: '#7ec87e66',
    font: '"Special Elite", cursive', disp: '"VT323", monospace',
  },
  C: {
    id: 'C', tag: 'CODEX III', name: 'Illuminated Chronicle',
    a: '#c9962b', b: '#e8d8b0',
    bg: '#100c00', surf: '#1a1400', bord: '#3d2e00',
    text: '#e8d8b0', muted: '#c9962b66',
    font: '"EB Garamond", Georgia, serif', disp: '"Cinzel Decorative", serif',
  },
  D: {
    id: 'D', tag: 'ARCADE', name: 'Neon Void',
    a: '#00f5ff', b: '#ff2d78',
    bg: '#06000e', surf: '#0e0018', bord: '#00f5ff20',
    text: '#e0f0ff', muted: '#00f5ff55',
    font: '"Chakra Petch", sans-serif', disp: '"Orbitron", sans-serif',
  },
  E: {
    id: 'E', tag: 'SOULSLIKE', name: 'Stone & Ember',
    a: '#e05c2a', b: '#b8a880',
    bg: '#100e0a', surf: '#1c1810', bord: '#3a2e1e',
    text: '#c8b898', muted: '#e05c2a55',
    font: '"Oswald", sans-serif', disp: '"Oswald", sans-serif',
  },
  F: {
    id: 'F', tag: '8-BIT', name: 'Pixel Art',
    a: '#ffe866', b: '#44aaff',
    bg: '#08080e', surf: '#101020', bord: '#ffe86640',
    text: '#e0e0f0', muted: '#ffe86666',
    font: '"Press Start 2P", monospace', disp: '"Press Start 2P", monospace',
  },
};

const STYLE_IDS: SID[] = ['A', 'B', 'C', 'D', 'E', 'F'];

// ─── Shared Primitives ────────────────────────────────────────────────────────

const FV: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const SectionHead: React.FC<{ title: string; sub?: string; t: Th }> = ({ title, sub, t }) => (
  <FV className="mb-8">
    <div className="flex items-center gap-4">
      <div className="h-[1px] w-6" style={{ background: t.a, opacity: 0.5 }} />
      <div>
        <div className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: t.a, opacity: 0.55, fontFamily: t.font }}>{sub || 'element'}</div>
        <h3 className="text-lg font-semibold tracking-wide" style={{ color: t.text, fontFamily: t.disp, letterSpacing: '0.05em' }}>{title}</h3>
      </div>
      <div className="h-[1px] flex-1" style={{ background: t.bord }} />
    </div>
  </FV>
);

// ─── Style Picker ─────────────────────────────────────────────────────────────

const StylePicker: React.FC<{ active: SID; onChange: (s: SID) => void }> = ({ active, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
    {STYLE_IDS.map((id) => {
      const th = T[id];
      const isActive = active === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          className="shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 transition-all duration-200"
          style={{
            background: isActive ? `${th.a}18` : 'transparent',
            border: `1px solid ${isActive ? th.a : 'rgba(255,255,255,0.1)'}`,
            minWidth: 72,
          }}
        >
          <span className="text-[18px] font-bold" style={{ fontFamily: th.disp, color: isActive ? th.a : 'rgba(255,255,255,0.35)', lineHeight: 1 }}>{id}</span>
          <span className="text-[7px] tracking-[0.2em] uppercase whitespace-nowrap" style={{ color: isActive ? th.a : 'rgba(255,255,255,0.25)', fontFamily: '"Space Mono", monospace' }}>{th.tag}</span>
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAT BARS
// ─────────────────────────────────────────────────────────────────────────────

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  t: Th;
  flash?: boolean;
}

const StatBarA: React.FC<StatBarProps> = ({ label, value, max, color, flash }) => {
  const pct = Math.max(0, value / max);
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1" style={{ fontFamily: '"Space Mono", monospace' }}>
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color }}>{label}</span>
        <span className="text-[10px]" style={{ color, opacity: 0.6 }}>{value}/{max}</span>
      </div>
      <div className="relative h-[10px] overflow-hidden" style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
        {/* Scan-line sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="h-full w-1/4 absolute left-0" style={{ background: `linear-gradient(90deg, transparent, ${color}18, transparent)`, animation: 'gui-scan 2.8s linear infinite' }} />
        </div>
        {/* Fill */}
        <motion.div className="h-full relative" animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }} />
        {/* Damage flash */}
        {flash && <div className="absolute inset-0" style={{ animation: 'gui-damage 0.3s ease-out forwards' }} />}
      </div>
    </div>
  );
};

const StatBarB: React.FC<StatBarProps> = ({ label, value, max, color, flash }) => {
  const pct = Math.max(0, value / max);
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span style={{ fontFamily: '"VT323", monospace', color, fontSize: '1.1rem', letterSpacing: '0.1em' }}>{label.toUpperCase()}</span>
        <span style={{ fontFamily: '"VT323", monospace', color, fontSize: '1.1rem', opacity: 0.6 }}>[{value}/{max}]</span>
      </div>
      <div className="relative h-[8px]" style={{ border: `1px dashed ${color}60`, background: `repeating-linear-gradient(90deg, ${color}08 0px, ${color}08 4px, transparent 4px, transparent 8px)` }}>
        <motion.div className="h-full" animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ background: `repeating-linear-gradient(90deg, ${color}cc 0px, ${color}cc 6px, ${color}88 6px, ${color}88 8px)` }} />
        {flash && <div className="absolute inset-0" style={{ animation: 'gui-damage 0.3s ease-out forwards' }} />}
      </div>
    </div>
  );
};

const StatBarC: React.FC<StatBarProps> = ({ label, value, max, color, flash }) => {
  const pct = Math.max(0, value / max);
  return (
    <div className="mb-5 relative px-4 py-3" style={{ border: `1px solid ${color}20` }}>
      {/* Corner ornaments */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((c, i) => (
        <div key={i} className={`absolute ${c} w-2 h-2`} style={{ border: `1px solid ${color}50`, transform: 'translate(-1px,-1px)' }} />
      ))}
      <div className="flex justify-between mb-2">
        <span style={{ fontFamily: '"Cinzel", serif', color, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: '"Cinzel", serif', color, fontSize: '0.62rem', opacity: 0.55 }}>{value} / {max}</span>
      </div>
      <div className="relative h-[6px]" style={{ background: `${color}14` }}>
        <motion.div className="h-full" animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ background: `linear-gradient(90deg, ${color}60, ${color}ee)` }} />
        {flash && <div className="absolute inset-0" style={{ animation: 'gui-damage 0.3s ease-out forwards' }} />}
      </div>
    </div>
  );
};

const StatBarD: React.FC<StatBarProps> = ({ label, value, max, color, flash }) => {
  const pct = Math.max(0, value / max);
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span style={{ fontFamily: '"Chakra Petch", sans-serif', color, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: '"Orbitron", sans-serif', color, fontSize: '0.6rem', opacity: 0.7 }}>{value}</span>
      </div>
      <div className="relative h-[12px] overflow-hidden rounded-sm" style={{ background: `${color}10`, boxShadow: `inset 0 0 8px ${color}20` }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="h-full w-1/3 absolute left-0" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)`, animation: 'gui-scan 2.2s linear infinite' }} />
        </div>
        <motion.div className="h-full relative rounded-sm" animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60, 0 0 40px ${color}25` }}/>
        {flash && <div className="absolute inset-0" style={{ animation: 'gui-damage 0.3s ease-out forwards' }} />}
      </div>
    </div>
  );
};

const StatBarE: React.FC<StatBarProps> = ({ label, value, max, color, flash }) => {
  const pct = Math.max(0, value / max);
  const isLow = pct <= 0.25;
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span style={{ fontFamily: '"Oswald", sans-serif', color, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: '"Oswald", sans-serif', color, fontSize: '0.72rem', opacity: 0.6 }}>{value}/{max}</span>
      </div>
      <div className="relative" style={{ height: 14, background: `${color}14`, clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
        <motion.div className="h-full" animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))', animation: isLow ? 'gui-ember 1.2s ease-in-out infinite' : 'none' }}/>
        {flash && <div className="absolute inset-0" style={{ animation: 'gui-damage 0.3s ease-out forwards' }} />}
      </div>
    </div>
  );
};

const StatBarF: React.FC<StatBarProps> = ({ label, value, max, color, flash }) => {
  const blocks = 12;
  const filled = Math.round((value / max) * blocks);
  return (
    <div className="mb-5 gui-pixel">
      <div className="flex justify-between mb-2">
        <span style={{ fontFamily: '"Press Start 2P", monospace', color, fontSize: '0.45rem', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontFamily: '"Press Start 2P", monospace', color, fontSize: '0.45rem', opacity: 0.65 }}>{value}/{max}</span>
      </div>
      <div className="flex gap-[2px] relative">
        {Array.from({ length: blocks }).map((_, i) => (
          <div key={i} className="flex-1 h-[12px]"
            style={{ background: i < filled ? color : `${color}20`, border: `2px solid ${i < filled ? color : color + '40'}`, imageRendering: 'pixelated' }} />
        ))}
        {flash && <div className="absolute inset-0" style={{ animation: 'gui-damage 0.3s ease-out forwards' }} />}
      </div>
    </div>
  );
};

const StatBar: React.FC<StatBarProps> = (props) => {
  const { t } = props;
  if (t.id === 'A') return <StatBarA {...props} />;
  if (t.id === 'B') return <StatBarB {...props} />;
  if (t.id === 'C') return <StatBarC {...props} />;
  if (t.id === 'D') return <StatBarD {...props} />;
  if (t.id === 'E') return <StatBarE {...props} />;
  return <StatBarF {...props} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// XP RING
// ─────────────────────────────────────────────────────────────────────────────

const XPRing: React.FC<{ xp: number; level: number; t: Th; burst: boolean }> = ({ xp, level, t, burst }) => {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - xp / 100);

  // ── A: Geometric Terminal ── Hexagonal targeting reticle, XP traces the hex edges
  if (t.id === 'A') {
    // Hex vertices (flat-top, center 50,50, radius 42)
    const hexPts: [number,number][] = [
      [50, 8], [88, 29], [88, 71], [50, 92], [12, 71], [12, 29],
    ];
    // Total perimeter length
    const hexPerim = hexPts.reduce((sum, p, i) => {
      const next = hexPts[(i + 1) % hexPts.length];
      return sum + Math.hypot(next[0] - p[0], next[1] - p[1]);
    }, 0);
    const hexOffset = hexPerim * (1 - xp / 100);
    // Tip dot position along the perimeter
    const tipFrac = xp / 100;
    let tipDist = tipFrac * hexPerim;
    let tipX = hexPts[0][0], tipY = hexPts[0][1];
    for (let i = 0; i < hexPts.length; i++) {
      const a = hexPts[i], b = hexPts[(i + 1) % hexPts.length];
      const segLen = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (tipDist <= segLen) {
        tipX = a[0] + (b[0] - a[0]) * (tipDist / segLen);
        tipY = a[1] + (b[1] - a[1]) * (tipDist / segLen);
        break;
      }
      tipDist -= segLen;
    }
    const hexPointsStr = hexPts.map(([x, y]) => `${x},${y}`).join(' ');
    return (
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
        <AnimatePresence>
          {burst && (
            <motion.div className="absolute inset-0" initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.9, opacity: 0 }} exit={{}} transition={{ duration: 0.55 }}
              style={{ clipPath: 'polygon(50% 0%,88% 29%,88% 71%,50% 92%,12% 71%,12% 29%)', background: `${t.a}30` }} />
          )}
        </AnimatePresence>
        <svg width={100} height={100}>
          {/* Hex track (faint) */}
          <polygon points={hexPointsStr} fill="none" stroke={`${t.a}20`} strokeWidth={4} strokeLinejoin="miter" />
          {/* Hex XP progress — traces the hex path */}
          <motion.polygon
            points={hexPointsStr}
            fill="none"
            stroke={t.a}
            strokeWidth={4}
            strokeLinejoin="miter"
            strokeDasharray={hexPerim}
            animate={{ strokeDashoffset: hexOffset }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Corner node dots */}
          {hexPts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2.5} fill={`${t.a}60`} />
          ))}
          {/* Glowing tip dot that moves along the hex edge */}
          <motion.circle
            cx={tipX} cy={tipY} r={4}
            fill={t.a}
            animate={{ cx: tipX, cy: tipY }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 5px ${t.a})` }}
          />
          {/* Horizontal scan line */}
          <motion.line x1={18} y1={50} x2={82} y2={50} stroke={`${t.a}40`} strokeWidth={0.5}
            animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontFamily: t.font, color: t.a, fontSize: '0.5rem', opacity: 0.55, letterSpacing: '0.15em' }}>LVL</span>
          <span style={{ fontFamily: t.disp, color: t.a, fontSize: '1.15rem', lineHeight: 1 }}>{level}</span>
        </div>
      </div>
    );
  }

  // ── B: Intelligence Dossier ── Classified stamp + horizontal bar, no circle
  if (t.id === 'B') {
    return (
      <div className="relative flex flex-col items-center justify-center gap-1.5" style={{ width: 110, height: 100 }}>
        <AnimatePresence>
          {burst && (
            <motion.div className="absolute inset-0" initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{}}
              transition={{ duration: 0.5 }} style={{ border: `2px solid ${t.a}`, background: `${t.a}10` }} />
          )}
        </AnimatePresence>
        {/* Stamp badge */}
        <div style={{ position: 'relative', padding: '4px 10px', border: `2px solid ${t.a}80` }}>
          {/* Corner brackets */}
          {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
            <div key={`${v}${h}`} style={{
              position: 'absolute', [v]: -2, [h]: -2, width: 7, height: 7,
              borderTop: v === 'top' ? `2px solid ${t.a}` : undefined,
              borderBottom: v === 'bottom' ? `2px solid ${t.a}` : undefined,
              borderLeft: h === 'left' ? `2px solid ${t.a}` : undefined,
              borderRight: h === 'right' ? `2px solid ${t.a}` : undefined,
            }} />
          ))}
          <div style={{ fontFamily: '"VT323", monospace', color: t.a, fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.6, textAlign: 'center' }}>CLEARANCE</div>
          <div style={{ fontFamily: '"Special Elite", cursive', color: t.a, fontSize: '1.5rem', lineHeight: 1, textAlign: 'center', letterSpacing: '0.05em' }}>LV.{level}</div>
        </div>
        {/* XP fill bar */}
        <div style={{ width: 90, height: 6, background: `${t.a}18`, border: `1px solid ${t.a}40`, position: 'relative', overflow: 'hidden' }}>
          <motion.div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: t.a }}
            animate={{ width: `${xp}%` }} transition={{ duration: 0.6 }} />
        </div>
        <div style={{ fontFamily: '"VT323", monospace', color: t.muted, fontSize: '0.58rem', letterSpacing: '0.1em' }}>XP {xp}/100</div>
      </div>
    );
  }

  // ── C: Illuminated Chronicle ── Circle with ornate corner diamonds + rotated diamond badge
  if (t.id === 'C') {
    const roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
    return (
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
        <AnimatePresence>
          {burst && (
            <motion.div className="absolute" initial={{ scale: 1, opacity: 0.6, rotate: 0 }}
              animate={{ scale: 1.8, opacity: 0, rotate: 45 }} exit={{}} transition={{ duration: 0.65 }}
              style={{ width: 60, height: 60, border: `2px solid ${t.a}` }} />
          )}
        </AnimatePresence>
        <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
          {/* Cardinal diamond ornaments */}
          <polygon points="50,3 53,7 50,11 47,7"  fill={t.a} opacity={0.55} />
          <polygon points="50,89 53,93 50,97 47,93" fill={t.a} opacity={0.55} />
          <polygon points="3,50 7,47 11,50 7,53"  fill={t.a} opacity={0.55} />
          <polygon points="89,50 93,47 97,50 93,53" fill={t.a} opacity={0.55} />
          {/* Dashed track */}
          <circle cx={50} cy={50} r={r} fill="none" stroke={`${t.a}25`} strokeWidth={4} strokeDasharray="3 6" />
          {/* Fill arc */}
          <motion.circle cx={50} cy={50} r={r} fill="none" stroke={t.a} strokeWidth={4}
            strokeLinecap="butt" strokeDasharray={circ}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }} />
          {/* Moving tip diamond */}
          <motion.polygon points="50,10 52.5,12.5 50,15 47.5,12.5" fill={t.a}
            animate={{ rotate: (xp / 100) * 360 }} transition={{ duration: 0.6 }}
            style={{ transformOrigin: '50px 50px' }} />
        </svg>
        {/* Rotated diamond badge center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ width: 42, height: 42, border: `1.5px solid ${t.a}70`, transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${t.a}08` }}>
            <div style={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cinzel Decorative", serif', color: t.a, fontSize: '0.38rem', opacity: 0.55, letterSpacing: '0.06em' }}>LEVEL</div>
              <div style={{ fontFamily: '"Cinzel", serif', color: t.a, fontSize: '0.95rem', lineHeight: 1 }}>{roman[Math.min(level - 1, 9)]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── D: Neon Void ── Double ring: outer rotating dashes + inner neon-glow fill
  if (t.id === 'D') {
    const rOuter = 44;
    const circOuter = 2 * Math.PI * rOuter;
    const offsetOuter = circOuter * (1 - xp / 100);
    return (
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
        <AnimatePresence>
          {burst && (
            <motion.div className="absolute inset-0 rounded-full" initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.3, opacity: 0 }} exit={{}} transition={{ duration: 0.45 }}
              style={{ border: `2px solid ${t.a}`, borderRadius: '50%', boxShadow: `0 0 16px ${t.a}` }} />
          )}
        </AnimatePresence>
        <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
          {/* Outer ring — rotates forever */}
          <motion.circle cx={50} cy={50} r={rOuter} fill="none" stroke={`${t.a}22`} strokeWidth={1}
            strokeDasharray="5 10"
            animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }} />
          {/* Outer XP arc (faint secondary) */}
          <motion.circle cx={50} cy={50} r={rOuter} fill="none" stroke={`${t.a}35`} strokeWidth={1.5}
            strokeLinecap="butt" strokeDasharray={circOuter}
            animate={{ strokeDashoffset: offsetOuter }}
            transition={{ duration: 0.6 }} />
          {/* Inner track */}
          <circle cx={50} cy={50} r={r} fill="none" stroke={`${t.a}12`} strokeWidth={7} />
          {/* Inner neon fill */}
          <motion.circle cx={50} cy={50} r={r} fill="none" stroke={t.a} strokeWidth={7}
            strokeLinecap="butt" strokeDasharray={circ}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
            style={{ filter: `drop-shadow(0 0 4px ${t.a}) drop-shadow(0 0 10px ${t.a}) drop-shadow(0 0 22px ${t.a}88)` }} />
          {/* Glowing tip dot */}
          <motion.circle cx={50} cy={50 - r} r={4.5} fill={t.a}
            animate={{ rotate: (xp / 100) * 360 }} transition={{ duration: 0.6 }}
            style={{ transformOrigin: '50px 50px', filter: `drop-shadow(0 0 8px ${t.a})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div style={{ fontFamily: '"Orbitron", sans-serif', color: `${t.a}70`, fontSize: '0.44rem', letterSpacing: '0.22em' }}>LVL</div>
          <div style={{ fontFamily: '"Orbitron", sans-serif', color: t.a, fontSize: '1.25rem', fontWeight: 900,
            textShadow: `0 0 8px ${t.a}, 0 0 20px ${t.a}88` }}>{level}</div>
        </div>
      </div>
    );
  }

  // ── E: Stone & Ember ── Shield shape, ember fills from the bottom via gradient mask
  if (t.id === 'E') {
    const shieldPath = 'M50,6 L84,20 L84,58 Q84,80 50,95 Q16,80 16,58 L16,20 Z';
    // Fill level: 0% xp → gradient stop at y=100% (empty), 100% xp → stop at y=0% (full)
    // We drive the gradient stop position so it's pure SVG attribute with no transform issues
    const fillStop = `${100 - xp}%`;
    const glowStop = `${Math.max(0, 98 - xp)}%`;
    const uid = 'e-shield'; // stable id, only one instance visible at a time
    return (
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
        <AnimatePresence>
          {burst && (
            <motion.svg width={100} height={100} className="absolute inset-0 pointer-events-none"
              initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 1.5, opacity: 0 }} exit={{}}
              transition={{ duration: 0.55 }}>
              <path d={shieldPath} fill="none" stroke={t.a} strokeWidth={2} />
            </motion.svg>
          )}
        </AnimatePresence>
        <svg width={100} height={100}>
          <defs>
            {/* Gradient that acts as the fill level — stop moves up as xp rises */}
            <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor={t.a} stopOpacity={0} />
              <stop offset={glowStop} stopColor={t.a} stopOpacity={0} />
              {/* Glow edge */}
              <motion.stop offset={glowStop} stopColor={t.a} stopOpacity={0.9}
                animate={{ offset: glowStop }} transition={{ duration: 0.65 }} />
              <motion.stop offset={fillStop} stopColor={t.a} stopOpacity={0.55}
                animate={{ offset: fillStop }} transition={{ duration: 0.65 }} />
              <stop offset="100%" stopColor={t.a} stopOpacity={0.55} />
            </linearGradient>
            <clipPath id={`${uid}-clip`}>
              <path d={shieldPath} />
            </clipPath>
          </defs>
          {/* Shield base fill (very faint) */}
          <path d={shieldPath} fill={`${t.a}08`} clipPath={`url(#${uid}-clip)`} />
          {/* Ember fill via gradient */}
          <rect x={0} y={0} width={100} height={100}
            fill={`url(#${uid}-grad)`}
            clipPath={`url(#${uid}-clip)`} />
          {/* Shield outline */}
          <path d={shieldPath} fill="none" stroke={`${t.a}70`} strokeWidth={2.5} />
          {/* Boss notch at top center */}
          <circle cx={50} cy={20} r={4} fill="none" stroke={`${t.a}60`} strokeWidth={1.5} />
          <circle cx={50} cy={20} r={1.5} fill={`${t.a}80`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center" style={{ paddingTop: 26 }}>
          <div style={{ fontFamily: '"Oswald", sans-serif', color: `${t.a}70`, fontSize: '0.48rem', letterSpacing: '0.18em' }}>LVL</div>
          <div style={{ fontFamily: '"Oswald", sans-serif', color: t.a, fontSize: '1.35rem', fontWeight: 700, lineHeight: 1,
            textShadow: `0 1px 6px ${t.a}66` }}>{level}</div>
        </div>
      </div>
    );
  }

  // ── F: Pixel Art ── Pixel badge + pixel XP block row, no circle at all
  const pixelBlocks = 10;
  const pixelFilled = Math.round((xp / 100) * pixelBlocks);
  return (
    <div className="relative flex flex-col items-center justify-center gap-1.5" style={{ width: 100, height: 100 }}>
      <AnimatePresence>
        {burst && (
          <motion.div className="absolute inset-0 gui-pixel" initial={{ opacity: 0.7 }} animate={{ opacity: 0 }} exit={{}}
            transition={{ duration: 0.35 }} style={{ border: `3px solid ${t.a}`, background: `${t.a}20` }} />
        )}
      </AnimatePresence>
      {/* Pixel badge */}
      <div style={{ border: `2px solid ${t.a}`, padding: '3px 8px', background: `${t.a}12`, imageRendering: 'pixelated' }}>
        <div style={{ fontFamily: '"Press Start 2P", monospace', color: t.a, fontSize: '0.32rem', opacity: 0.6, marginBottom: 2, textAlign: 'center', letterSpacing: '0.05em' }}>PLAYER</div>
        <div style={{ fontFamily: '"Press Start 2P", monospace', color: t.a, fontSize: '0.9rem', lineHeight: 1, textAlign: 'center' }}>LV{level}</div>
      </div>
      {/* Pixel XP blocks */}
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: pixelBlocks }).map((_, i) => (
          <motion.div key={i}
            animate={{
              background: i < pixelFilled ? t.a : `${t.a}22`,
              boxShadow: i < pixelFilled ? `0 0 4px ${t.a}` : 'none',
            }}
            transition={{ duration: 0.08, delay: i * 0.025 }}
            style={{ width: 7, height: 7, imageRendering: 'pixelated' }}
          />
        ))}
      </div>
      <div style={{ fontFamily: '"Press Start 2P", monospace', color: `${t.a}70`, fontSize: '0.28rem', letterSpacing: '0.04em' }}>XP {xp}/100</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILL HOTBAR
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_ICONS = ['⚔', '🛡', '🔥', '❄', '⚡', '💀', '🌀', '✨'];
const SKILL_KEYS  = ['1','2','3','4','5','6','7','8'];

interface SkillState { cooldown: number; maxCd: number; active: boolean }

const SkillHotbar: React.FC<{ t: Th }> = ({ t }) => {
  const [skills, setSkills] = useState<SkillState[]>([
    { cooldown: 0, maxCd: 8, active: true },
    { cooldown: 0, maxCd: 5, active: false },
    { cooldown: 5, maxCd: 8, active: false },
    { cooldown: 0, maxCd: 12, active: false },
    { cooldown: 3, maxCd: 6, active: false },
    { cooldown: 0, maxCd: 10, active: false },
    { cooldown: 0, maxCd: 7, active: false },
    { cooldown: 0, maxCd: 15, active: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSkills(prev => prev.map(s => ({ ...s, cooldown: Math.max(0, s.cooldown - 0.25) })));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const activate = (i: number) => {
    setSkills(prev => prev.map((s, idx) => {
      if (idx !== i || s.cooldown > 0) return s;
      return { ...s, cooldown: s.maxCd, active: true };
    }));
  };

  const slotSize = t.id === 'F' ? 40 : 48;

  const getClipPath = () => {
    if (t.id === 'A') return 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
    if (t.id === 'C') return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    if (t.id === 'E') return 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))';
    return undefined;
  };

  return (
    <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-start">
      {skills.map((skill, i) => {
        const onCd = skill.cooldown > 0;
        const cdPct = onCd ? (skill.cooldown / skill.maxCd) : 0;
        const clip = getClipPath();

        return (
          <motion.button
            key={i}
            onClick={() => activate(i)}
            whileTap={!onCd ? { scale: 0.9 } : undefined}
            className="relative flex items-center justify-center select-none"
            style={{
              width: slotSize, height: slotSize,
              background: skill.active && !onCd ? `${t.a}28` : `${t.surf}`,
              border: t.id === 'B' ? `1px dashed ${t.a}${onCd ? '40' : '80'}` :
                      t.id === 'F' ? `2px solid ${t.a}${onCd ? '50' : 'cc'}` :
                      `1px solid ${t.a}${onCd ? '25' : '55'}`,
              clipPath: clip,
              cursor: onCd ? 'not-allowed' : 'pointer',
              ...(t.id === 'D' && !onCd ? { boxShadow: `0 0 8px ${t.a}60, inset 0 0 8px ${t.a}18` } : {}),
              imageRendering: t.id === 'F' ? 'pixelated' : undefined,
            } as React.CSSProperties}
          >
            {/* Cooldown radial overlay */}
            {onCd && (
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: clip, borderRadius: 0 }}>
                <div className="absolute inset-0" style={{
                  background: `conic-gradient(transparent ${(1 - cdPct) * 360}deg, rgba(0,0,0,0.65) ${(1 - cdPct) * 360}deg)`,
                }} />
              </div>
            )}
            <span className="text-base" style={{ opacity: onCd ? 0.3 : 1, lineHeight: 1 }}>{SKILL_ICONS[i]}</span>
            {/* Key label */}
            <span className="absolute text-[7px]"
              style={{ bottom: t.id === 'C' ? '22%' : 3, right: t.id === 'C' ? '22%' : 3, fontFamily: '"Space Mono", monospace', color: t.a, opacity: 0.5, lineHeight: 1, fontSize: t.id === 'F' ? '5px' : '7px' }}>
              {SKILL_KEYS[i]}
            </span>
            {/* B: cooldown text */}
            {t.id === 'B' && onCd && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px]"
                style={{ fontFamily: '"VT323", monospace', color: t.b, opacity: 0.9 }}>
                {Math.ceil(skill.cooldown)}s
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENT TOAST
// ─────────────────────────────────────────────────────────────────────────────

type Rarity = 'common' | 'rare' | 'legendary';
const RARITY_COLORS: Record<Rarity, string> = { common: '#aaaaaa', rare: '#4488ff', legendary: '#ffaa00' };
const RARITY_LABELS: Record<Rarity, string> = { common: 'COMMON', rare: 'RARE', legendary: 'LEGENDARY' };

const AchievementToast: React.FC<{ t: Th }> = ({ t }) => {
  const [showing, setShowing] = useState(false);
  const [rarity, setRarity] = useState<Rarity>('rare');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowing(true);
    timerRef.current = setTimeout(() => setShowing(false), 3200);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const rc = RARITY_COLORS[rarity];

  return (
    <div className="relative">
      {/* Controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['common', 'rare', 'legendary'] as Rarity[]).map(r => (
          <button key={r} onClick={() => setRarity(r)}
            className="text-[9px] px-3 py-1.5 tracking-[0.15em] transition-all"
            style={{ fontFamily: '"Space Mono", monospace', border: `1px solid ${rarity === r ? RARITY_COLORS[r] : 'rgba(255,255,255,0.12)'}`, color: rarity === r ? RARITY_COLORS[r] : 'rgba(255,255,255,0.35)' }}>
            {r.toUpperCase()}
          </button>
        ))}
        <button onClick={trigger}
          className="text-[9px] px-4 py-1.5 tracking-[0.2em] ml-auto"
          style={{ background: `${t.a}22`, border: `1px solid ${t.a}`, color: t.a, fontFamily: t.font, cursor: 'pointer' }}>
          TRIGGER
        </button>
      </div>

      {/* Preview area */}
      <div className="relative h-[80px] rounded overflow-hidden" style={{ background: `${t.surf}88` }}>
        <span className="absolute inset-0 flex items-center justify-center text-xs opacity-20" style={{ color: t.muted, fontFamily: t.font }}>achievement fires to bottom-right →</span>
      </div>

      {/* Fixed toast portal-equivalent — rendered at page level via portal trick */}
      <AnimatePresence>
        {showing && (
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-[999] pointer-events-none"
            style={{ bottom: 24, right: 20, maxWidth: 320, width: 'calc(100vw - 40px)' }}
          >
            {/* Style A */}
            {t.id === 'A' && (
              <div className="gui-grid overflow-hidden" style={{ background: '#0c1a28', border: `1px solid ${rc}60` }}>
                <div className="h-[2px]" style={{ background: rc }} />
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center text-xl" style={{ background: `${rc}18`, border: `1px solid ${rc}55` }}>🏆</div>
                    <div>
                      <div className="text-[8px] tracking-[0.25em] uppercase mb-0.5" style={{ fontFamily: '"Space Mono", monospace', color: rc }}>ACHIEVEMENT_UNLOCKED // {RARITY_LABELS[rarity]}</div>
                      <div className="text-[13px]" style={{ fontFamily: '"Bebas Neue", sans-serif', color: '#c8e4f8', letterSpacing: '0.05em' }}>First Blood</div>
                      <div className="text-[8px] opacity-55 mt-0.5" style={{ fontFamily: '"Space Mono", monospace', color: '#7eb8e8' }}>// Defeat your first enemy</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Style B */}
            {t.id === 'B' && (
              <div className="gui-grain relative overflow-hidden" style={{ background: '#181410', border: `1px dashed ${rc}60` }}>
                <div className="p-3 relative z-[1]">
                  <div className="absolute top-2 right-3 text-[9px] rotate-[-4deg]" style={{ fontFamily: '"Special Elite", cursive', color: rc, border: `1px solid ${rc}`, padding: '1px 6px', opacity: 0.8 }}>CLEARED</div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="text-[10px] mb-0.5 opacity-50" style={{ fontFamily: '"Special Elite", cursive', color: t.text }}>[{RARITY_LABELS[rarity]}] FIELD CITATION</div>
                      <div style={{ fontFamily: '"Special Elite", cursive', color: rc, fontSize: '1.05rem' }}>First Blood</div>
                      <div className="text-[10px] italic mt-0.5 opacity-60" style={{ fontFamily: '"Special Elite", cursive', color: t.text }}>Eliminated hostile contact.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Style C */}
            {t.id === 'C' && (
              <div className="relative" style={{ background: '#1a1400', border: `1px solid ${rc}40` }}>
                <div className="h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${rc}, transparent)` }} />
                {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((c, i) => (
                  <div key={i} className={`absolute ${c} w-2 h-2`} style={{ border: `1px solid ${rc}60`, transform: 'translate(-1px,-1px)' }} />
                ))}
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="text-[7px] tracking-[0.2em] uppercase mb-0.5 opacity-50" style={{ fontFamily: '"Cinzel", serif', color: rc }}>{RARITY_LABELS[rarity]} CITATION</div>
                      <div style={{ fontFamily: '"Cinzel Decorative", serif', color: rc, fontSize: '0.95rem' }}>First Blood</div>
                      <div className="text-[10px] italic mt-0.5 opacity-55" style={{ fontFamily: '"EB Garamond", serif', color: t.text }}>Thy blade found its mark.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Style D */}
            {t.id === 'D' && (
              <div className="gui-scanlines relative overflow-hidden" style={{ background: '#0e0018', border: `1px solid ${rc}`, boxShadow: `0 0 20px ${rc}40, 0 0 40px ${rc}18` }}>
                <div className="p-3 relative z-[1]">
                  <div className="h-[1px] mb-2" style={{ background: `linear-gradient(90deg, transparent, ${rc}, transparent)` }} />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center text-xl"
                      style={{ background: `${rc}18`, border: `1px solid ${rc}`, boxShadow: `0 0 8px ${rc}60` }}>🏆</div>
                    <div>
                      <div className="text-[7px] tracking-[0.25em] uppercase mb-0.5" style={{ fontFamily: '"Orbitron", sans-serif', color: rc, textShadow: `0 0 6px ${rc}` }}>ACHIEVEMENT // {RARITY_LABELS[rarity]}</div>
                      <div style={{ fontFamily: '"Orbitron", sans-serif', color: rc, fontSize: '0.85rem', fontWeight: 700, textShadow: `0 0 10px ${rc}` }}>FIRST BLOOD</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Style E */}
            {t.id === 'E' && (
              <div style={{ background: '#1c1810', border: `2px solid ${rc}60`, clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                <div className="h-[3px]" style={{ background: rc, animation: 'gui-ember 1.5s ease infinite' }} />
                <div className="p-3 flex items-center gap-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="text-[8px] mb-0.5 opacity-50" style={{ fontFamily: '"Oswald", sans-serif', color: rc, letterSpacing: '0.15em' }}>{RARITY_LABELS[rarity]}</div>
                    <div style={{ fontFamily: '"Oswald", sans-serif', color: rc, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em' }}>FIRST BLOOD</div>
                  </div>
                </div>
              </div>
            )}
            {/* Style F */}
            {t.id === 'F' && (
              <div className="gui-pixel" style={{ background: '#101020', border: `2px solid ${rc}`, imageRendering: 'pixelated' }}>
                <div className="h-[4px]" style={{ background: rc }} />
                <div className="p-3 flex items-center gap-3">
                  <div className="text-2xl gui-pixel">🏆</div>
                  <div>
                    <div style={{ fontFamily: '"Press Start 2P", monospace', color: rc, fontSize: '0.42rem', lineHeight: 1.6 }}>{RARITY_LABELS[rarity]}</div>
                    <div style={{ fontFamily: '"Press Start 2P", monospace', color: rc, fontSize: '0.55rem', lineHeight: 1.8 }}>FIRST BLOOD</div>
                    <div style={{ fontFamily: '"Press Start 2P", monospace', color: t.text, fontSize: '0.38rem', opacity: 0.55, lineHeight: 1.6 }}>+50 XP EARNED</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING DAMAGE NUMBERS
// ─────────────────────────────────────────────────────────────────────────────

type DmgType = 'physical' | 'crit' | 'heal' | 'magic';
const DMG_COLORS: Record<DmgType, string> = { physical: '#e0e0e0', crit: '#ffe866', heal: '#66ee88', magic: '#cc88ff' };
const DMG_LABELS: Record<DmgType, string> = { physical: 'PHYSICAL', crit: 'CRITICAL', heal: 'HEAL', magic: 'MAGIC' };

let _dmgId = 0;
interface DmgNum { id: number; val: number; type: DmgType; x: number }

const FloatingNumbers: React.FC<{ t: Th }> = ({ t }) => {
  const [nums, setNums] = useState<DmgNum[]>([]);
  const [dmgType, setDmgType] = useState<DmgType>('physical');

  const fire = useCallback(() => {
    const id = ++_dmgId;
    const val = dmgType === 'heal' ? Math.round(Math.random() * 40 + 10) : Math.round(Math.random() * 70 + 15);
    // x as a percentage (10–80%) so numbers always stay inside the container
    const x = Math.round(Math.random() * 70 + 10);
    setNums(prev => [...prev.slice(-6), { id, val, type: dmgType, x }]);
    setTimeout(() => setNums(prev => prev.filter(n => n.id !== id)), 1300);
  }, [dmgType]);

  const getLabel = (n: DmgNum) => {
    if (t.id === 'A') return n.type === 'heal' ? `+${n.val}` : `-${n.val}`;
    if (t.id === 'B') return n.type === 'heal' ? `+${n.val} HP` : `−${n.val} HP`;
    if (t.id === 'C') return n.type === 'heal' ? `+${n.val}` : `—${n.val}`;
    if (t.id === 'D') return n.type === 'crit' ? `✦${n.val}!` : n.type === 'heal' ? `+${n.val}` : `${n.val}`;
    if (t.id === 'E') return `${n.val}`;
    return n.type === 'crit' ? `OUCH!` : `${n.val}`;
  };

  const getSize = (n: DmgNum) => {
    if (t.id === 'F') return n.type === 'crit' ? '0.55rem' : '0.45rem';
    if (n.type === 'crit') return t.id === 'D' ? '2rem' : '1.6rem';
    return t.id === 'D' ? '1.4rem' : '1.2rem';
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['physical', 'crit', 'heal', 'magic'] as DmgType[]).map(type => (
          <button key={type} onClick={() => setDmgType(type)}
            className="text-[9px] px-3 py-1.5 tracking-[0.12em] transition-all"
            style={{ fontFamily: '"Space Mono", monospace', border: `1px solid ${dmgType === type ? DMG_COLORS[type] : 'rgba(255,255,255,0.12)'}`, color: dmgType === type ? DMG_COLORS[type] : 'rgba(255,255,255,0.35)' }}>
            {DMG_LABELS[type]}
          </button>
        ))}
        <button onClick={fire}
          className="ml-auto text-[9px] px-4 py-1.5 tracking-[0.2em] transition-all"
          style={{ background: `${t.a}22`, border: `1px solid ${t.a}`, color: t.a, fontFamily: t.font, cursor: 'pointer' }}>
          FIRE
        </button>
      </div>
      {/* Arena */}
      <div className="relative h-[140px] overflow-hidden" style={{ background: `${t.surf}66`, border: `1px solid ${t.bord}` }}>
        <span className="absolute inset-0 flex items-end justify-center pb-2 text-[9px] opacity-15 select-none pointer-events-none" style={{ color: t.muted, fontFamily: t.font }}>click FIRE to spawn damage numbers</span>
        <AnimatePresence>
          {nums.map(n => {
            const color = DMG_COLORS[n.type];
            return (
              <motion.div key={n.id}
                initial={{ y: 0, opacity: 1, scale: n.type === 'crit' ? 1.25 : 1 }}
                animate={{ y: -110, opacity: 0 }}
                exit={{}}
                transition={{ duration: 1.2, ease: [0.2, 0.8, 0.4, 1] }}
                className="absolute pointer-events-none font-bold select-none"
                style={{
                  left: `${n.x}%`, bottom: 16,
                  fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' :
                              t.id === 'D' ? '"Orbitron", sans-serif' :
                              t.id === 'B' ? '"VT323", monospace' :
                              t.id === 'C' ? '"EB Garamond", serif' :
                              '"Oswald", sans-serif',
                  fontSize: getSize(n),
                  color,
                  textShadow: t.id === 'D' ? `0 0 8px ${color}, 0 0 16px ${color}88` : undefined,
                  lineHeight: 1,
                  imageRendering: t.id === 'F' ? 'pixelated' : undefined,
                } as React.CSSProperties}>
                {getLabel(n)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

interface StatusEffect { id: string; icon: React.ReactNode; name: string; duration: number; maxDur: number; isDebuff: boolean }

const StatusEffects: React.FC<{ t: Th }> = ({ t }) => {
  const [effects, setEffects] = useState<StatusEffect[]>([
    { id: 'poison', icon: <Snowflake size={14} />, name: 'Frost', duration: 8, maxDur: 10, isDebuff: true },
    { id: 'rage',   icon: <Flame size={14} />,     name: 'Rage',  duration: 6, maxDur: 8,  isDebuff: false },
    { id: 'shield', icon: <Shield size={14} />,    name: 'Ward',  duration: 4, maxDur: 12, isDebuff: false },
    { id: 'dot',    icon: <Zap size={14} />,       name: 'Shock', duration: 9, maxDur: 10, isDebuff: true },
  ]);

  useEffect(() => {
    const iv = setInterval(() => {
      setEffects(prev => prev.map(e => ({ ...e, duration: Math.max(0, e.duration - 0.2) })));
    }, 200);
    return () => clearInterval(iv);
  }, []);

  const remove = (id: string) => setEffects(prev => prev.filter(e => e.id !== id));

  const reset = () => setEffects([
    { id: 'poison', icon: <Snowflake size={14} />, name: 'Frost', duration: 10, maxDur: 10, isDebuff: true },
    { id: 'rage',   icon: <Flame size={14} />,     name: 'Rage',  duration: 8,  maxDur: 8,  isDebuff: false },
    { id: 'shield', icon: <Shield size={14} />,    name: 'Ward',  duration: 12, maxDur: 12, isDebuff: false },
    { id: 'dot',    icon: <Zap size={14} />,       name: 'Shock', duration: 10, maxDur: 10, isDebuff: true },
  ]);

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center flex-wrap">
        <span className="text-[9px] opacity-40" style={{ fontFamily: t.font, color: t.text }}>Click to remove effect</span>
        <button onClick={reset} className="ml-auto text-[9px] px-3 py-1" style={{ fontFamily: t.font, border: `1px solid ${t.bord}`, color: t.muted, cursor: 'pointer' }}>RESET</button>
      </div>
      <div className="flex gap-3 flex-wrap">
        <AnimatePresence>
          {effects.map(eff => {
            const pct = eff.duration / eff.maxDur;
            const r = 18; const circ = 2 * Math.PI * r;
            const color = eff.isDebuff ? t.b : t.a;

            return (
              <motion.button
                key={eff.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => remove(eff.id)}
                className="relative flex flex-col items-center gap-1"
                title={`${eff.name} — click to remove`}
              >
                <div className="relative" style={{ width: 44, height: 44 }}>
                  <svg width={44} height={44} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                    <circle cx={22} cy={22} r={r} fill="none" stroke={`${color}22`} strokeWidth={3} />
                    <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={3}
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={circ * (1 - pct)}
                      style={t.id === 'D' ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ color, background: `${color}14`, border: `1px solid ${color}30`,
                             clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' : undefined,
                             imageRendering: t.id === 'F' ? 'pixelated' : undefined,
                             boxShadow: t.id === 'D' ? `0 0 6px ${color}60` : undefined }}>
                    {eff.icon}
                  </div>
                </div>
                <span className="text-[7px] text-center"
                  style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color, opacity: 0.7, fontSize: t.id === 'F' ? '5px' : '7px' }}>
                  {eff.name}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN PREVIEWS
// ─────────────────────────────────────────────────────────────────────────────

type ScreenTab = 'menu' | 'gameover' | 'victory';

const MENU_ITEMS = ['CONTINUE', 'NEW GAME', 'SETTINGS', 'ACHIEVEMENTS', 'QUIT'];

const MainMenuPreview: React.FC<{ t: Th }> = ({ t }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative h-full overflow-hidden flex flex-col items-center justify-center px-8"
      style={{ background: t.bg }}>
      {/* Per-style background decoration */}
      {t.id === 'A' && <div className="absolute inset-0 gui-grid opacity-60 pointer-events-none" />}
      {t.id === 'B' && <div className="absolute inset-0 gui-grain pointer-events-none" />}
      {t.id === 'D' && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '50%', overflow: 'hidden' }}>
          <div className="gui-neon-grid w-full absolute bottom-0" />
        </div>
      )}
      {t.id === 'D' && <div className="absolute inset-0 gui-scanlines pointer-events-none" />}

      {/* Title */}
      <motion.div className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {t.id === 'A' && <div className="text-[8px] tracking-[0.35em] mb-2 opacity-40" style={{ fontFamily: '"Space Mono", monospace', color: t.a }}>// GAME PAUSED — SELECT OPTION</div>}
        {t.id === 'B' && <div className="text-xs mb-2 opacity-30 border px-3 py-0.5 inline-block" style={{ fontFamily: '"VT323", monospace', color: t.b, borderColor: `${t.b}50`, transform: 'rotate(-1deg)' }}>CLASSIFIED MAIN SCREEN</div>}
        {t.id === 'C' && (
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12" style={{ background: `${t.a}40` }} />
            <div style={{ color: t.a, fontSize: '0.5rem', fontFamily: '"Cinzel", serif', letterSpacing: '0.3em', opacity: 0.5 }}>◆</div>
            <div className="h-[1px] w-12" style={{ background: `${t.a}40` }} />
          </div>
        )}
        <div style={{ fontFamily: t.disp, color: t.a, fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', letterSpacing: '0.06em',
          textShadow: t.id === 'D' ? `0 0 20px ${t.a}, 0 0 40px ${t.a}60` : undefined,
          animation: t.id === 'D' ? 'gui-neon-pulse 2s ease infinite' : undefined }}>
          {t.id === 'A' ? 'IRREGULAR' : t.id === 'B' ? 'Abɔde' : t.id === 'C' ? 'Gold & Iron' : t.id === 'D' ? 'VOID.EXE' : t.id === 'E' ? 'ASHEN KEEP' : 'HERO QUEST'}
        </div>
      </motion.div>

      {/* Menu items */}
      <div className="relative z-10 w-full max-w-[200px]">
        {MENU_ITEMS.map((item, i) => {
          const isH = hovered === i;
          const dimmed = hovered !== null && !isH;

          // ── Per-style hover styles ──
          const itemStyle: React.CSSProperties = (() => {
            const base: React.CSSProperties = {
              fontFamily: t.font,
              color: isH ? t.a : t.text,
              opacity: dimmed ? 0.28 : 1,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            };
            if (t.id === 'A') return {
              ...base,
              padding: '6px 12px',
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              borderLeft: isH ? `2px solid ${t.a}` : '2px solid transparent',
              background: isH ? `${t.a}12` : 'transparent',
              textShadow: isH ? `0 0 8px ${t.a}cc` : undefined,
              paddingLeft: isH ? 18 : 12,
            };
            if (t.id === 'B') return {
              ...base,
              padding: '5px 12px',
              fontSize: '1.1rem',
              fontFamily: '"Special Elite", cursive',
              letterSpacing: '0.04em',
              borderBottom: isH ? `1px dashed ${t.a}70` : '1px dashed transparent',
              background: isH ? `${t.a}0d` : 'transparent',
              color: isH ? t.a : t.text,
            };
            if (t.id === 'C') return {
              ...base,
              padding: '7px 12px 7px 20px',
              fontSize: '0.72rem',
              fontFamily: '"Cinzel", serif',
              letterSpacing: '0.14em',
              fontStyle: isH ? 'italic' : 'normal',
              color: isH ? t.a : t.text,
              borderBottom: isH ? `1px solid ${t.a}35` : '1px solid transparent',
              background: 'transparent',
            };
            if (t.id === 'D') return {
              ...base,
              padding: '6px 12px',
              fontSize: '0.66rem',
              letterSpacing: '0.2em',
              fontFamily: '"Orbitron", sans-serif',
              border: isH ? `1px solid ${t.a}` : '1px solid transparent',
              background: isH ? `${t.a}10` : 'transparent',
              textShadow: isH ? `0 0 10px ${t.a}, 0 0 22px ${t.a}88` : undefined,
              boxShadow: isH ? `inset 0 0 12px ${t.a}18, 0 0 10px ${t.a}40` : undefined,
              marginBottom: 2,
            };
            if (t.id === 'E') return {
              ...base,
              padding: '6px 14px 6px 12px',
              fontSize: '0.72rem',
              fontFamily: '"Oswald", sans-serif',
              letterSpacing: '0.12em',
              fontWeight: isH ? 700 : 400,
              clipPath: isH ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' : undefined,
              background: isH ? `${t.a}20` : 'transparent',
              color: isH ? t.a : t.text,
              textShadow: isH ? `0 0 6px ${t.a}88` : undefined,
            };
            // F
            return {
              ...base,
              padding: '5px 10px',
              fontSize: '0.4rem',
              fontFamily: '"Press Start 2P", monospace',
              lineHeight: 2.0,
              border: isH ? `2px solid ${t.a}` : '2px solid transparent',
              background: isH ? `${t.a}18` : 'transparent',
              imageRendering: 'pixelated',
            };
          })();

          const label = (() => {
            if (t.id === 'A') return isH ? `> ${item}_` : `> ${item}`;
            if (t.id === 'B') return `[${item}]`;
            if (t.id === 'C') return isH ? `◆ ${item}` : `  ${item}`;
            if (t.id === 'D') return item;
            if (t.id === 'E') return isH ? `» ${item}` : item;
            return item; // F
          })();

          return (
            <motion.div key={item}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={itemStyle}>
              {label}
              {t.id === 'F' && isH && <span style={{ animation: 'gui-blink 0.8s step-end infinite', marginLeft: 6, color: t.a }}>█</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const GameOverPreview: React.FC<{ t: Th }> = ({ t }) => {
  const [showing, setShowing] = useState(false);
  useEffect(() => { const tm = setTimeout(() => setShowing(true), 300); return () => clearTimeout(tm); }, []);

  const stats = [{ l: 'Enemies Slain', v: '14' }, { l: 'Distance', v: '2.4km' }, { l: 'Time', v: '08:32' }, { l: 'Damage Dealt', v: '1,840' }];

  return (
    <div className="relative h-full overflow-hidden flex flex-col items-center justify-center px-6"
      style={{ background: t.id === 'D' ? '#06000e' : t.id === 'F' ? '#08080e' : '#0a0500' }}>
      {t.id === 'A' && <div className="absolute inset-0 gui-grid pointer-events-none" />}
      {t.id === 'D' && <div className="absolute inset-0 gui-scanlines pointer-events-none" />}
      <AnimatePresence>
        {showing && (
          <motion.div className="text-center w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <motion.div initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: 'spring' }}
              style={{ fontFamily: t.disp, color: t.b, fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', letterSpacing: '0.08em',
                textShadow: t.id === 'D' ? `0 0 20px ${t.b}, 0 0 40px ${t.b}60` : undefined }}>
              {t.id === 'F' ? 'GAME OVER' : t.id === 'A' ? 'HERO_DEAD' : t.id === 'B' ? 'KIA — FIELD REPORT' : t.id === 'C' ? 'Fallen' : t.id === 'E' ? 'YOU DIED' : 'GAME OVER'}
            </motion.div>
            <div className="mt-4 mb-4 grid grid-cols-2 gap-x-6 gap-y-1 max-w-[260px] mx-auto">
              {stats.map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex justify-between gap-2">
                  <span style={{ fontFamily: t.font, color: t.muted, fontSize: t.id === 'F' ? '0.38rem' : '0.6rem' }}>{s.l}</span>
                  <span style={{ fontFamily: t.font, color: t.text, fontSize: t.id === 'F' ? '0.38rem' : '0.6rem' }}>{s.v}</span>
                </motion.div>
              ))}
            </div>
            <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="px-6 py-2 transition-all hover:opacity-80" style={{
                fontFamily: t.font, color: t.bg, background: t.a.replace(/#/, '#'),
                fontSize: t.id === 'F' ? '0.42rem' : '0.65rem', letterSpacing: '0.2em',
                border: 'none', cursor: 'pointer',
                clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' : undefined,
                boxShadow: t.id === 'D' ? `0 0 16px ${t.a}80` : undefined,
              }}>
              {t.id === 'B' ? '[RETRY MISSION]' : t.id === 'F' ? 'TRY AGAIN?' : 'RETRY'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VictoryPreview: React.FC<{ t: Th }> = ({ t }) => {
  const [xp, setXp] = useState(0);
  const loot = [{ name: 'Ancient Blade', rarity: 'legendary', icon: '⚔' }, { name: 'Shadow Cloak', rarity: 'rare', icon: '🧥' }, { name: 'Gold Coins ×120', rarity: 'common', icon: '💰' }];
  const rarityColors: Record<string, string> = { common: '#aaa', rare: '#4488ff', legendary: '#ffaa00' };

  useEffect(() => {
    const tm = setTimeout(() => {
      let v = 0;
      const iv = setInterval(() => {
        v = Math.min(100, v + 2.5);
        setXp(v);
        if (v >= 100) clearInterval(iv);
      }, 40);
      return () => clearInterval(iv);
    }, 600);
    return () => clearTimeout(tm);
  }, []);

  return (
    <div className="relative h-full overflow-hidden flex flex-col items-center justify-center px-6 gap-3"
      style={{ background: t.bg }}>
      {t.id === 'A' && <div className="absolute inset-0 gui-grid pointer-events-none" />}
      {t.id === 'D' && <div className="absolute inset-0 gui-scanlines pointer-events-none" />}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ fontFamily: t.disp, color: t.a, fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.08em', textAlign: 'center',
          textShadow: t.id === 'D' ? `0 0 20px ${t.a}` : undefined }}>
        {t.id === 'F' ? 'VICTORY!!' : t.id === 'A' ? 'MISSION_COMPLETE' : t.id === 'B' ? 'OPERATION CLEARED' : t.id === 'C' ? 'Victory' : t.id === 'E' ? 'VANQUISHED' : 'VICTORY'}
      </motion.div>
      {/* Loot cascade */}
      <div className="flex gap-2 justify-center">
        {loot.map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
            className="flex flex-col items-center gap-1 p-2"
            style={{ border: `1px solid ${rarityColors[item.rarity]}60`, background: `${rarityColors[item.rarity]}10`,
              minWidth: 60, fontSize: '1.2rem', textAlign: 'center',
              clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' : undefined,
              boxShadow: t.id === 'D' ? `0 0 8px ${rarityColors[item.rarity]}60` : undefined,
              imageRendering: t.id === 'F' ? 'pixelated' : undefined }}>
            <span>{item.icon}</span>
            <span style={{ fontFamily: t.font, color: rarityColors[item.rarity], fontSize: t.id === 'F' ? '0.35rem' : '0.52rem', textAlign: 'center', lineHeight: 1.4, maxWidth: 70 }}>{item.name}</span>
          </motion.div>
        ))}
      </div>
      {/* XP Bar */}
      <div className="w-full max-w-[240px]">
        <div className="flex justify-between mb-1">
          <span style={{ fontFamily: t.font, color: t.a, fontSize: t.id === 'F' ? '0.38rem' : '0.52rem', opacity: 0.7 }}>XP GAINED</span>
          <span style={{ fontFamily: t.font, color: t.a, fontSize: t.id === 'F' ? '0.38rem' : '0.52rem', opacity: 0.7 }}>+1240</span>
        </div>
        <div className="relative h-[8px] overflow-hidden" style={{ background: `${t.a}18`, border: `1px solid ${t.a}30` }}>
          <motion.div className="h-full" animate={{ width: `${xp}%` }} transition={{ duration: 0.1, ease: 'linear' }}
            style={{ background: t.a, boxShadow: t.id === 'D' ? `0 0 8px ${t.a}` : undefined }} />
        </div>
      </div>
    </div>
  );
};

const ScreenPreviews: React.FC<{ t: Th }> = ({ t }) => {
  const [tab, setTab] = useState<ScreenTab>('menu');
  const tabs: { id: ScreenTab; label: string }[] = [
    { id: 'menu', label: 'MAIN MENU' },
    { id: 'gameover', label: 'GAME OVER' },
    { id: 'victory', label: 'VICTORY' },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-4 flex-wrap">
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className="text-[9px] px-4 py-2 tracking-[0.2em] transition-all"
            style={{ fontFamily: '"Space Mono", monospace', border: `1px solid ${tab === tb.id ? t.a : 'rgba(255,255,255,0.1)'}`, color: tab === tb.id ? t.a : 'rgba(255,255,255,0.3)', background: tab === tb.id ? `${t.a}12` : 'transparent', cursor: 'pointer' }}>
            {tb.label}
          </button>
        ))}
      </div>
      <div className="relative overflow-hidden" style={{ height: 340, border: `1px solid ${t.bord}` }}>
        <AnimatePresence mode="wait">
          <motion.div key={`${tab}-${t.id}`} className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {tab === 'menu' && <MainMenuPreview t={t} />}
            {tab === 'gameover' && <GameOverPreview t={t} />}
            {tab === 'victory' && <VictoryPreview t={t} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY GRID
// ─────────────────────────────────────────────────────────────────────────────

type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
interface Item { id: number; icon: string; name: string; rarity: ItemRarity; stat: string; desc: string }

const ITEM_RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#aaaaaa', uncommon: '#55cc66', rare: '#4488ff', epic: '#aa44ff', legendary: '#ffaa00',
};

const ITEMS: Item[] = [
  { id: 1,  icon: '⚔', name: 'Iron Sword',    rarity: 'common',    stat: 'ATK +12',      desc: 'A basic iron blade.' },
  { id: 2,  icon: '🛡', name: 'Oak Shield',    rarity: 'uncommon',  stat: 'DEF +18',      desc: 'Sturdy wood and iron.' },
  { id: 3,  icon: '🏹', name: 'Swift Bow',     rarity: 'rare',      stat: 'ATK +22, SPD +5', desc: 'Shoots twice as fast.' },
  { id: 4,  icon: '🧪', name: 'Health Vial',   rarity: 'common',    stat: 'HP +80',       desc: 'Restore 80 HP.' },
  { id: 5,  icon: '💍', name: 'Ring of Ward',  rarity: 'epic',      stat: 'MR +30',       desc: 'Resists arcane damage.' },
  { id: 6,  icon: '🗡', name: 'Shadow Blade',  rarity: 'legendary', stat: 'ATK +45, CRT +15%', desc: 'Forged in the Void.' },
  { id: 7,  icon: '🧥', name: 'Rogue Cloak',   rarity: 'rare',      stat: 'DEF +10, EVD +12', desc: 'Silent and swift.' },
  { id: 8,  icon: '📜', name: 'Fire Scroll',   rarity: 'uncommon',  stat: 'MAG +28',      desc: 'Single-use fire spell.' },
  { id: 9,  icon: '💀', name: 'Skull Amulet',  rarity: 'epic',      stat: 'CRT +20%, HP -10', desc: 'Power at a cost.' },
  { id: 10, icon: '🥾', name: 'Swift Boots',   rarity: 'uncommon',  stat: 'SPD +20',      desc: 'Light as air.' },
  { id: 11, icon: '🔮', name: 'Chaos Orb',     rarity: 'legendary', stat: 'ALL +15',      desc: 'Radiates raw power.' },
  { id: 12, icon: '🍎', name: 'Golden Apple',  rarity: 'common',    stat: 'HP +30',       desc: 'A bit magical.' },
];

const ItemTooltip: React.FC<{ item: Item; t: Th }> = ({ item, t }) => {
  const rc = ITEM_RARITY_COLORS[item.rarity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full mb-2 left-1/2 pointer-events-none z-50"
      style={{ transform: 'translateX(-50%)', minWidth: 160, maxWidth: 200,
        background: t.surf, border: `1px solid ${rc}60`,
        clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' : undefined,
        boxShadow: t.id === 'D' ? `0 0 16px ${rc}60` : '0 4px 20px rgba(0,0,0,0.6)' }}>
      <div className="h-[2px]" style={{ background: rc }} />
      <div className="p-2.5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-lg">{item.icon}</span>
          <div>
            <div style={{ fontFamily: t.font, color: rc, fontSize: t.id === 'F' ? '0.38rem' : '0.68rem', fontWeight: 600, lineHeight: 1.3 }}>{item.name}</div>
            <div style={{ fontFamily: '"Space Mono", monospace', color: rc, fontSize: '0.55rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.rarity}</div>
          </div>
        </div>
        <div style={{ fontFamily: t.font, color: t.a, fontSize: t.id === 'F' ? '0.35rem' : '0.62rem', marginBottom: '0.25rem' }}>{item.stat}</div>
        <div style={{ fontFamily: t.id === 'C' ? '"EB Garamond", serif' : t.font, color: t.text, fontSize: t.id === 'F' ? '0.32rem' : '0.58rem', opacity: 0.65, fontStyle: t.id === 'C' ? 'italic' : 'normal' }}>{item.desc}</div>
      </div>
    </motion.div>
  );
};

const InventoryGrid: React.FC<{ t: Th }> = ({ t }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const COLS = 6;
  const ROWS = 4;
  const TOTAL = COLS * ROWS;

  const getSlotStyle = (item: Item | null, isHovered: boolean): React.CSSProperties => {
    const rc = item ? ITEM_RARITY_COLORS[item.rarity] : undefined;

    if (t.id === 'A') return {
      background: isHovered && item ? `${t.a}14` : t.surf,
      border: item ? `1px solid ${isHovered ? t.a : `${rc}55`}` : `1px solid ${t.bord}`,
      outline: isHovered && item ? `1px solid ${t.a}40` : undefined,
      outlineOffset: isHovered && item ? '2px' : undefined,
      boxShadow: isHovered && item ? `inset 0 0 8px ${t.a}18` : undefined,
      cursor: item ? 'pointer' : 'default', transition: 'all 0.1s ease',
    };
    if (t.id === 'B') return {
      background: isHovered && item ? `${rc}10` : t.surf,
      border: item ? `1px dashed ${isHovered ? rc : `${rc}50`}` : `1px dashed ${t.bord}`,
      cursor: item ? 'pointer' : 'default', transition: 'all 0.12s ease',
    };
    if (t.id === 'C') return {
      background: isHovered && item ? `${rc}14` : t.surf,
      border: item ? `1px solid ${isHovered ? rc : `${rc}45`}` : `1px solid ${t.bord}`,
      boxShadow: isHovered && item ? `inset 0 0 6px ${rc}30` : undefined,
      cursor: item ? 'pointer' : 'default', transition: 'all 0.12s ease',
    };
    if (t.id === 'D') return {
      background: isHovered && item ? `${rc}18` : t.surf,
      border: item ? `1px solid ${isHovered ? rc : `${rc}45`}` : `1px solid ${t.bord}`,
      boxShadow: isHovered && item ? `0 0 12px ${rc}80, inset 0 0 10px ${rc}18` : undefined,
      cursor: item ? 'pointer' : 'default', transition: 'all 0.08s ease',
    };
    if (t.id === 'E') return {
      background: isHovered && item ? `${rc}1a` : t.surf,
      border: 'none',
      clipPath: item ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' : undefined,
      outline: isHovered && item ? `1px solid ${rc}80` : undefined,
      outlineOffset: '2px',
      boxShadow: isHovered && item ? `0 0 6px ${rc}60` : undefined,
      cursor: item ? 'pointer' : 'default', transition: 'all 0.12s ease',
    };
    // F
    return {
      background: isHovered && item ? `${rc}22` : t.surf,
      border: item ? `2px solid ${isHovered ? rc : `${rc}70`}` : `2px solid ${t.bord}`,
      boxShadow: isHovered && item ? `0 0 0 2px ${rc}60` : undefined,
      imageRendering: 'pixelated', cursor: item ? 'pointer' : 'default', transition: 'all 0.06s step-end',
    } as React.CSSProperties;
  };

  return (
    <div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: TOTAL }).map((_, idx) => {
          const item = ITEMS[idx] ?? null;
          const iH = hovered === idx;
          return (
            <div key={idx} className="relative aspect-square flex items-center justify-center min-h-[44px]"
              style={getSlotStyle(item, iH)}
              onMouseEnter={() => item && setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => item && setHovered(idx)}
              onBlur={() => setHovered(null)}
              tabIndex={item ? 0 : -1}
              role={item ? 'button' : undefined}
              aria-label={item ? item.name : undefined}>
              {item && (
                <>
                  <span className="text-xl leading-none select-none" style={{ imageRendering: t.id === 'F' ? 'pixelated' : undefined }}>{item.icon}</span>
                  <AnimatePresence>
                    {iH && <ItemTooltip item={item} t={t} />}
                  </AnimatePresence>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as ItemRarity[]).map(r => (
          <div key={r} className="flex items-center gap-1.5">
            <div className="w-2 h-2" style={{ background: ITEM_RARITY_COLORS[r], borderRadius: t.id === 'F' ? 0 : '50%' }} />
            <span style={{ fontFamily: '"Space Mono", monospace', color: ITEM_RARITY_COLORS[r], fontSize: '0.52rem', opacity: 0.7, textTransform: 'capitalize' }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIALOGUE BOX
// ─────────────────────────────────────────────────────────────────────────────

const DIALOGUES = [
  { speaker: 'Stranger', portrait: '#7eb8e8', text: 'The old kingdom fell silent three moons ago. We do not know what crossed the mountains, only that it came at night.', choices: ['Ask about survivors', 'Ask about the dark'] },
  { speaker: 'Stranger', portrait: '#7eb8e8', text: 'Survivors? A handful. They speak of shapes that move wrong — like puppets remembering how to walk.', choices: ['Offer to help', 'Stay silent'] },
  { speaker: 'Elder Nana', portrait: '#c9962b', text: 'You carry the iron of your father in your hands. But iron alone does not hold a line. What else do you bring?', choices: ['Courage', 'Nothing. Only a name.'] },
  { speaker: 'System', portrait: '#aaaaaa', text: '[End of demo sequence. In a full build, choices branch into separate narrative threads and NPC state.]', choices: ['Restart', 'Exit'] },
];

// Small stateful wrapper so each choice button can track its own hover independently
const ChoiceButton: React.FC<{ label: string; onChoose: () => void; getStyle: (hov: boolean) => React.CSSProperties }> = ({ label, onChoose, getStyle }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onChoose}
      style={getStyle(hov)}>
      {label}
    </button>
  );
};

const DialogueBox: React.FC<{ t: Th }> = ({ t }) => {
  const [step, setStep] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const d = DIALOGUES[step];
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    timeoutRef.current = setInterval(() => {
      i++;
      setDisplayed(d.text.slice(0, i));
      if (i >= d.text.length) {
        clearInterval(timeoutRef.current!);
        setDone(true);
      }
    }, 22);
    return () => { if (timeoutRef.current) clearInterval(timeoutRef.current); };
  }, [step, d.text]);

  const choose = (choiceIdx: number) => {
    void choiceIdx; // both choices advance for the demo
    setStep(prev => (prev + 1) % DIALOGUES.length);
  };

  const skip = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    setDisplayed(d.text);
    setDone(true);
  };

  return (
    <div>
      <div className="relative p-0 overflow-hidden" style={{
        background: t.surf,
        border: t.id === 'B' ? `1px dashed ${t.bord}` : t.id === 'F' ? `2px solid ${t.a}` : `1px solid ${t.bord}`,
        clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' : undefined,
        boxShadow: t.id === 'D' ? `0 0 20px ${t.a}30` : undefined,
      }}>
        {/* Header bar */}
        <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: `1px solid ${t.bord}`, background: `${t.a}08` }}>
          {/* Portrait */}
          <div className="w-9 h-9 shrink-0 flex items-center justify-center font-bold"
            style={{ background: `${d.portrait}22`, border: `1px solid ${d.portrait}60`, color: d.portrait,
              fontFamily: t.disp, fontSize: '0.85rem',
              clipPath: t.id === 'A' ? 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' :
                        t.id === 'C' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                        t.id === 'E' ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' : undefined,
              imageRendering: t.id === 'F' ? 'pixelated' : undefined,
            }}>
            {d.speaker[0]}
          </div>
          <div style={{ fontFamily: t.font !== t.disp ? t.font : t.font, color: t.a, fontSize: t.id === 'F' ? '0.42rem' : '0.8rem', fontWeight: 600, letterSpacing: '0.06em' }}>{d.speaker}</div>
          {t.id === 'A' && <div className="ml-auto text-[8px] opacity-30" style={{ fontFamily: '"Space Mono", monospace', color: t.a }}>STEP {step + 1}/4</div>}
          {t.id === 'B' && <div className="ml-auto text-[9px]" style={{ fontFamily: '"VT323", monospace', color: t.a, opacity: 0.5 }}>TRANSCRIPT {step + 1}</div>}
        </div>

        {/* Text body */}
        <div className="px-4 py-3 cursor-pointer min-h-[80px]" onClick={!done ? skip : undefined}>
          <p style={{ fontFamily: t.id === 'C' ? '"EB Garamond", serif' : t.font, color: t.text,
            fontSize: t.id === 'F' ? '0.4rem' : t.id === 'D' ? '0.72rem' : '0.88rem',
            lineHeight: t.id === 'F' ? 2.0 : 1.7, fontStyle: t.id === 'C' ? 'italic' : 'normal' }}>
            {displayed}
            {!done && <span style={{ animation: 'gui-blink 0.7s step-end infinite', fontFamily: '"Press Start 2P", monospace', fontSize: '0.6rem', color: t.a }}>█</span>}
          </p>
        </div>

        {/* Choices */}
        {done && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            className="px-4 pb-4 flex flex-col gap-2">
            {d.choices.map((c, i) => {
              const getChoiceStyle = (isHov: boolean): React.CSSProperties => {
                if (t.id === 'A') return {
                  fontFamily: '"Space Mono", monospace', fontSize: '0.62rem', letterSpacing: '0.12em',
                  color: isHov ? t.bg : t.a, background: isHov ? t.a : 'transparent',
                  border: `1px solid ${t.a}`, padding: '6px 12px',
                  textShadow: isHov ? undefined : `0 0 6px ${t.a}88`,
                  cursor: 'pointer', transition: 'all 0.12s ease',
                };
                if (t.id === 'B') return {
                  fontFamily: '"Special Elite", cursive', fontSize: '0.85rem', letterSpacing: '0.05em',
                  color: isHov ? t.bg : t.a, background: isHov ? t.a : 'transparent',
                  border: `1px dashed ${t.a}80`, padding: '5px 12px',
                  cursor: 'pointer', transition: 'all 0.12s ease',
                };
                if (t.id === 'C') return {
                  fontFamily: '"Cinzel", serif', fontSize: '0.68rem', letterSpacing: '0.1em',
                  color: isHov ? t.bg : t.text, background: isHov ? t.a : `${t.a}12`,
                  border: `1px solid ${t.a}50`, padding: '6px 14px',
                  fontStyle: 'italic', cursor: 'pointer', transition: 'all 0.12s ease',
                };
                if (t.id === 'D') return {
                  fontFamily: '"Orbitron", sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em',
                  color: isHov ? t.bg : t.a, background: isHov ? t.a : 'transparent',
                  border: `1px solid ${t.a}`, padding: '6px 12px',
                  boxShadow: isHov ? `0 0 16px ${t.a}80` : `0 0 8px ${t.a}40`,
                  textShadow: isHov ? undefined : `0 0 8px ${t.a}`,
                  cursor: 'pointer', transition: 'all 0.1s ease',
                };
                if (t.id === 'E') return {
                  fontFamily: '"Oswald", sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600,
                  color: isHov ? t.bg : t.a, background: isHov ? t.a : `${t.a}15`,
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  border: 'none', padding: '7px 14px',
                  textShadow: isHov ? undefined : `0 0 4px ${t.a}66`,
                  cursor: 'pointer', transition: 'all 0.12s ease',
                };
                // F
                return {
                  fontFamily: '"Press Start 2P", monospace', fontSize: '0.38rem',
                  color: isHov ? t.bg : t.a, background: isHov ? t.a : `${t.a}18`,
                  border: `2px solid ${t.a}`, padding: '5px 10px', lineHeight: 2.0,
                  imageRendering: 'pixelated' as const, cursor: 'pointer', transition: 'all 0.08s step-end',
                };
              };
              return (
                <ChoiceButton key={i} label={
                  t.id === 'A' ? `> ${c}` : t.id === 'B' ? `[${c}]` : t.id === 'F' ? `» ${c}` : c
                } onChoose={() => choose(i)} getStyle={getChoiceStyle} />
              );
            })}
          </motion.div>
        )}
      </div>
      <div className="mt-2 text-right">
        <span className="text-[8px] opacity-30" style={{ fontFamily: '"Space Mono", monospace', color: t.text }}>click text to skip typewriter · choices auto-advance demo</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HUD DEMO — combines stat bars + XP ring + hotbar together
// ─────────────────────────────────────────────────────────────────────────────

const HudDemo: React.FC<{ t: Th }> = ({ t }) => {
  const [hp, setHp] = useState(78);
  const [mp, setMp] = useState(55);
  const [sp, setSp] = useState(90);
  const [xp, setXp] = useState(67);
  const [level, setLevel] = useState(5);
  const [flash, setFlash] = useState(false);
  const [burst, setBurst] = useState(false);

  const takeDamage = () => {
    setFlash(true);
    const dmg = Math.round(Math.random() * 16 + 5);
    setHp(prev => Math.max(0, prev - dmg));
    setTimeout(() => setFlash(false), 350);
  };

  const gainXP = () => {
    setXp(prev => {
      if (prev >= 100) {
        setBurst(true);
        setTimeout(() => setBurst(false), 700);
        setLevel(l => l + 1);
        return 15;
      }
      return Math.min(100, prev + 22);
    });
  };

  const heal = () => {
    setHp(prev => Math.min(100, prev + 20));
    setMp(prev => Math.min(100, prev + 15));
    setSp(100);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stat bars + XP ring */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 w-full">
          <StatBar label="HP" value={hp} max={100} color={t.id === 'F' ? '#ff4444' : t.id === 'B' ? t.b : t.id === 'E' ? t.a : '#e05050'} t={t} flash={flash} />
          <StatBar label="MP" value={mp} max={100} color={t.id === 'F' ? '#4488ff' : t.id === 'D' ? t.b : t.id === 'C' ? t.b : '#6060e0'} t={t} />
          <StatBar label="SP" value={sp} max={100} color={t.a} t={t} />
        </div>
        <div className="flex items-center gap-4">
          <XPRing xp={xp} level={level} t={t} burst={burst} />
        </div>
      </div>

      {/* Hotbar */}
      <SkillHotbar t={t} />

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={takeDamage} className="text-[9px] px-4 py-2 tracking-[0.15em] transition-all hover:opacity-80"
          style={{ background: '#8b1a1a44', border: '1px solid #8b1a1a88', color: '#ff8888', fontFamily: '"Space Mono", monospace', cursor: 'pointer' }}>
          TAKE DAMAGE
        </button>
        <button onClick={gainXP} className="text-[9px] px-4 py-2 tracking-[0.15em] transition-all hover:opacity-80"
          style={{ background: `${t.a}22`, border: `1px solid ${t.a}88`, color: t.a, fontFamily: '"Space Mono", monospace', cursor: 'pointer' }}>
          GAIN XP
        </button>
        <button onClick={heal} className="text-[9px] px-4 py-2 tracking-[0.15em] transition-all hover:opacity-80"
          style={{ background: '#1a4a1a44', border: '1px solid #44aa4488', color: '#88ee88', fontFamily: '"Space Mono", monospace', cursor: 'pointer' }}>
          HEAL
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAP
// ─────────────────────────────────────────────────────────────────────────────

type RoomShape = { x: number; y: number; w: number; h: number; visited: boolean; current?: boolean; type: 'normal' | 'boss' | 'item' | 'save' };

const ROOMS: RoomShape[] = [
  { x: 44, y: 30, w: 12, h: 10, visited: true,  current: true, type: 'normal' },
  { x: 56, y: 30, w: 12, h: 10, visited: true,  type: 'normal' },
  { x: 68, y: 30, w: 10, h: 10, visited: true,  type: 'item' },
  { x: 44, y: 40, w: 12, h: 10, visited: true,  type: 'normal' },
  { x: 44, y: 20, w: 12, h: 10, visited: true,  type: 'save' },
  { x: 32, y: 30, w: 12, h: 10, visited: false, type: 'normal' },
  { x: 20, y: 30, w: 12, h: 10, visited: false, type: 'normal' },
  { x: 56, y: 40, w: 12, h: 10, visited: true,  type: 'normal' },
  { x: 56, y: 50, w: 12, h: 10, visited: false, type: 'boss' },
  { x: 20, y: 20, w: 12, h: 10, visited: false, type: 'normal' },
  { x: 68, y: 40, w: 10, h: 10, visited: false, type: 'normal' },
];

const MiniMap: React.FC<{ t: Th }> = ({ t }) => {
  const [playerPos, setPlayerPos] = useState(0); // room index for player
  const [fog, setFog] = useState(false);

  const roomColor = (r: RoomShape, i: number): string => {
    if (i === playerPos) return t.a;
    if (!r.visited && fog) return 'transparent';
    if (!r.visited) return `${t.a}18`;
    if (r.type === 'boss') return t.id === 'E' ? '#c0392b' : t.id === 'D' ? '#ff2d78' : '#c0392b';
    if (r.type === 'item') return t.id === 'D' ? '#00f5ff' : t.id === 'C' ? '#c9962b' : t.id === 'F' ? '#44aaff' : '#7ec87e';
    if (r.type === 'save') return t.id === 'D' ? '#a000ff' : '#888';
    return `${t.a}55`;
  };

  // ── A: Hex-grid radar overlay
  if (t.id === 'A') {
    const hexR = 8;
    const hexH = hexR * Math.sqrt(3);
    const cols = 8, rows = 5;
    const hexes: { cx: number; cy: number; lit: boolean }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = 14 + col * (hexR * 1.5) + (row % 2 === 1 ? hexR * 0.75 : 0);
        const cy = 8 + row * (hexH * 0.5);
        const lit = Math.random() > 0.55;
        hexes.push({ cx, cy, lit });
      }
    }
    const hexPt = (cx: number, cy: number) =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 180) * (60 * i);
        return `${cx + hexR * Math.cos(a)},${cy + hexR * Math.sin(a)}`;
      }).join(' ');

    return (
      <div style={{ border: `1px solid ${t.a}30`, background: `${t.bg}dd`, padding: 12 }}>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: t.font, color: t.a, fontSize: '0.6rem', opacity: 0.6, letterSpacing: '0.2em' }}>// AREA MAP</span>
          <button onClick={() => setFog(f => !f)} style={{ fontFamily: t.font, color: fog ? t.a : `${t.a}55`, fontSize: '0.55rem', letterSpacing: '0.12em', background: 'none', border: `1px solid ${fog ? t.a : `${t.a}30`}`, padding: '2px 6px', cursor: 'pointer' }}>
            FOG {fog ? 'ON' : 'OFF'}
          </button>
        </div>
        <svg width="100%" viewBox="0 0 110 52" style={{ display: 'block' }}>
          {/* Hex grid */}
          {hexes.map((h, i) => (
            <polygon key={i} points={hexPt(h.cx, h.cy)}
              fill={h.lit ? `${t.a}12` : 'none'}
              stroke={`${t.a}${h.lit ? '35' : '12'}`} strokeWidth={0.4} />
          ))}
          {/* Rooms */}
          {ROOMS.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h}
              fill={fog && !r.visited && i !== playerPos ? 'transparent' : roomColor(r, i)}
              stroke={i === playerPos ? t.a : `${t.a}50`}
              strokeWidth={i === playerPos ? 1 : 0.5}
              style={{ filter: i === playerPos ? `drop-shadow(0 0 3px ${t.a})` : undefined }} />
          ))}
          {/* Player crosshair */}
          <g transform={`translate(${ROOMS[playerPos].x + ROOMS[playerPos].w / 2},${ROOMS[playerPos].y + ROOMS[playerPos].h / 2})`}>
            <motion.circle r={3} fill="none" stroke={t.a} strokeWidth={0.8}
              animate={{ r: [2.5, 4.5, 2.5], opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <line x1={-5} y1={0} x2={5} y2={0} stroke={t.a} strokeWidth={0.7} />
            <line x1={0} y1={-5} x2={0} y2={5} stroke={t.a} strokeWidth={0.7} />
          </g>
          {/* Scan line */}
          <motion.line x1={0} y1={0} x2={0} y2={52} stroke={`${t.a}40`} strokeWidth={0.5}
            animate={{ x1: [0, 110, 0], x2: [0, 110, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
        </svg>
        <div className="flex gap-2 mt-2 flex-wrap">
          {ROOMS.map((_, i) => (
            <button key={i} onClick={() => setPlayerPos(i)}
              style={{ fontFamily: t.font, color: i === playerPos ? t.bg : `${t.a}70`, background: i === playerPos ? t.a : 'transparent', border: `1px solid ${t.a}40`, padding: '1px 5px', fontSize: '0.48rem', cursor: 'pointer', letterSpacing: '0.1em' }}>
              {i.toString().padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── B: Dossier grid map with stamped zone labels
  if (t.id === 'B') {
    return (
      <div style={{ border: `1px dashed ${t.bord}`, background: t.bg, padding: 12 }}>
        <div className="gui-grain" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25 }} />
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: '"VT323", monospace', color: t.a, fontSize: '0.85rem', letterSpacing: '0.25em' }}>FIELD MAP — TS//SCI</span>
          <button onClick={() => setFog(f => !f)} style={{ fontFamily: '"Special Elite", cursive', color: fog ? t.b : `${t.a}70`, fontSize: '0.6rem', background: 'none', border: `1px dashed ${fog ? t.b : `${t.a}40`}`, padding: '2px 6px', cursor: 'pointer' }}>
            {fog ? 'FOGWAR:ON' : 'FOGWAR:OFF'}
          </button>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" viewBox="0 0 110 68" style={{ display: 'block' }}>
            {/* Grid lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 10} y1={0} x2={i * 10} y2={68} stroke={`${t.a}15`} strokeWidth={0.5} strokeDasharray="2 4" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 10} x2={110} y2={i * 10} stroke={`${t.a}15`} strokeWidth={0.5} strokeDasharray="2 4" />
            ))}
            {/* Rooms */}
            {ROOMS.map((r, i) => {
              const hidden = fog && !r.visited && i !== playerPos;
              return (
                <g key={i}>
                  <rect x={r.x} y={r.y} width={r.w} height={r.h}
                    fill={hidden ? 'none' : i === playerPos ? `${t.a}30` : r.visited ? `${t.a}12` : `${t.a}05`}
                    stroke={hidden ? 'none' : i === playerPos ? t.a : `${t.a}50`}
                    strokeWidth={i === playerPos ? 1 : 0.5} strokeDasharray={r.visited ? undefined : '2 2'} />
                  {!hidden && r.type !== 'normal' && (
                    <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 1.5} textAnchor="middle"
                      style={{ fontFamily: 'monospace', fontSize: '4px', fill: roomColor(r, i), opacity: 0.9 }}>
                      {r.type === 'boss' ? '☠' : r.type === 'item' ? '◈' : r.type === 'save' ? '◉' : ''}
                    </text>
                  )}
                </g>
              );
            })}
            {/* Player marker */}
            <text x={ROOMS[playerPos].x + ROOMS[playerPos].w / 2}
              y={ROOMS[playerPos].y + ROOMS[playerPos].h / 2 + 1.5}
              textAnchor="middle" style={{ fontFamily: 'monospace', fontSize: '5px', fill: t.a }}>▲</text>
          </svg>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <span style={{ fontFamily: '"VT323", monospace', color: `${t.a}60`, fontSize: '0.62rem', letterSpacing: '0.1em' }}>MOVE TO:</span>
          {ROOMS.map((_r, i) => (
            <button key={i} onClick={() => setPlayerPos(i)} style={{
              fontFamily: '"VT323", monospace', color: i === playerPos ? t.bg : `${t.a}80`,
              background: i === playerPos ? t.a : 'transparent',
              border: `1px dashed ${t.a}50`, padding: '0px 4px', fontSize: '0.65rem', cursor: 'pointer',
            }}>{String.fromCharCode(65 + i)}</button>
          ))}
        </div>
      </div>
    );
  }

  // ── C: Chronicle — parchment-toned scroll map with ornate borders
  if (t.id === 'C') {
    const zoneLabels = ['The Hold', 'East Passage', 'Relic Chamber', 'South Gate', 'Shrine', 'Dark Road', 'Outer Reach', 'Lower Hall', 'Dragon Lair', 'Ruins', 'East Wing'];
    return (
      <div style={{ border: `1px solid ${t.a}50`, background: `${t.bg}ee`, padding: '10px 12px', position: 'relative' }}>
        {/* Corner ornaments */}
        {['0,0', '100%,0', '0,100%', '100%,100%'].map((_pos, i) => (
          <div key={i} style={{ position: 'absolute', [i < 2 ? 'top' : 'bottom']: 2, [i % 2 === 0 ? 'left' : 'right']: 2,
            width: 10, height: 10, borderTop: i < 2 ? `1.5px solid ${t.a}80` : undefined,
            borderBottom: i >= 2 ? `1.5px solid ${t.a}80` : undefined,
            borderLeft: i % 2 === 0 ? `1.5px solid ${t.a}80` : undefined,
            borderRight: i % 2 === 1 ? `1.5px solid ${t.a}80` : undefined }} />
        ))}
        <div className="text-center mb-2" style={{ fontFamily: '"Cinzel Decorative", serif', color: t.a, fontSize: '0.52rem', letterSpacing: '0.25em', opacity: 0.7 }}>
          ◆ REALM MAP ◆
        </div>
        <svg width="100%" viewBox="0 0 110 60" style={{ display: 'block' }}>
          {/* Organic connectors */}
          <path d="M50,35 L62,35 L74,35 M50,35 L50,25 M50,35 L50,45 M50,25 L50,15 M38,35 L50,35 M26,35 L38,35 M62,45 L62,55 M74,35 L74,45 M26,25 L26,35"
            fill="none" stroke={`${t.a}35`} strokeWidth={1} strokeDasharray="3 2" />
          {/* Rooms */}
          {ROOMS.map((r, i) => {
            const hidden = fog && !r.visited && i !== playerPos;
            return (
              <g key={i}>
                {hidden ? (
                  <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke={`${t.a}15`} strokeWidth={0.5} strokeDasharray="2 3" />
                ) : (
                  <>
                    <rect x={r.x} y={r.y} width={r.w} height={r.h}
                      fill={i === playerPos ? `${t.a}30` : r.type === 'boss' ? '#8b000022' : `${t.a}10`}
                      stroke={i === playerPos ? t.a : `${t.a}60`} strokeWidth={i === playerPos ? 1.2 : 0.7} />
                    {r.type !== 'normal' && (
                      <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 1.5} textAnchor="middle"
                        style={{ fontFamily: 'serif', fontSize: '4.5px', fill: roomColor(r, i) }}>
                        {r.type === 'boss' ? '⚔' : r.type === 'item' ? '◈' : '⊕'}
                      </text>
                    )}
                    {i === playerPos && (
                      <motion.polygon points={`${r.x + r.w / 2},${r.y + 1.5} ${r.x + r.w / 2 + 2},${r.y + r.h / 2} ${r.x + r.w / 2},${r.y + r.h - 1.5} ${r.x + r.w / 2 - 2},${r.y + r.h / 2}`}
                        fill={t.a} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
        <div className="flex items-center gap-2 mt-2">
          <span style={{ fontFamily: '"Cinzel", serif', color: t.a, fontSize: '0.52rem', opacity: 0.6 }}>Location:</span>
          <span style={{ fontFamily: '"EB Garamond", serif', color: t.text, fontSize: '0.65rem', fontStyle: 'italic' }}>{zoneLabels[playerPos]}</span>
        </div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {ROOMS.map((_, i) => (
            <button key={i} onClick={() => setPlayerPos(i)} style={{
              fontFamily: '"Cinzel", serif', color: i === playerPos ? t.bg : `${t.a}80`,
              background: i === playerPos ? t.a : 'transparent',
              border: `1px solid ${t.a}40`, padding: '1px 5px', fontSize: '0.45rem',
              letterSpacing: '0.06em', cursor: 'pointer',
            }}>{zoneLabels[i].split(' ')[0]}</button>
          ))}
        </div>
      </div>
    );
  }

  // ── D: Neon Void — radar sweep with glowing room nodes
  if (t.id === 'D') {
    return (
      <div style={{ border: `1px solid ${t.a}25`, background: '#06000e', padding: '10px 12px', boxShadow: `inset 0 0 30px ${t.a}08` }}>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: '"Orbitron", sans-serif', color: t.a, fontSize: '0.48rem', letterSpacing: '0.25em', textShadow: `0 0 8px ${t.a}` }}>RADAR // SECTOR MAP</span>
          <button onClick={() => setFog(f => !f)} style={{ fontFamily: '"Orbitron", sans-serif', color: fog ? t.b : `${t.a}60`, fontSize: '0.42rem', letterSpacing: '0.1em', background: 'none', border: `1px solid ${fog ? t.b : `${t.a}30`}`, padding: '2px 6px', cursor: 'pointer', boxShadow: fog ? `0 0 6px ${t.b}` : undefined }}>
            [{fog ? 'FOG:1' : 'FOG:0'}]
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <svg width="100%" viewBox="0 0 110 60" style={{ display: 'block' }}>
            {/* Radar rings */}
            {[20, 35, 50].map(r => (
              <circle key={r} cx={55} cy={30} r={r} fill="none" stroke={`${t.a}10`} strokeWidth={0.5} />
            ))}
            {/* Cardinal lines */}
            <line x1={55} y1={0} x2={55} y2={60} stroke={`${t.a}10`} strokeWidth={0.4} />
            <line x1={5} y1={30} x2={105} y2={30} stroke={`${t.a}10`} strokeWidth={0.4} />
            {/* Radar sweep */}
            <motion.line x1={55} y1={30} x2={55} y2={5} stroke={`${t.a}50`} strokeWidth={1}
              style={{ transformOrigin: '55px 30px', filter: `drop-shadow(0 0 3px ${t.a})` }}
              animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
            {/* Rooms */}
            {ROOMS.map((r, i) => {
              const hidden = fog && !r.visited && i !== playerPos;
              const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
              return hidden ? null : (
                <g key={i}>
                  <motion.circle cx={cx} cy={cy} r={i === playerPos ? 4.5 : r.type === 'boss' ? 4 : 3}
                    fill={roomColor(r, i)}
                    stroke={i === playerPos ? t.a : 'none'}
                    strokeWidth={1.5}
                    style={{ filter: `drop-shadow(0 0 ${i === playerPos ? 6 : 3}px ${roomColor(r, i)})` }}
                    animate={i === playerPos ? { r: [4, 5.5, 4] } : undefined}
                    transition={{ duration: 1.2, repeat: Infinity }} />
                  {r.type !== 'normal' && (
                    <text x={cx + 5} y={cy + 1.5} style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '4px', fill: roomColor(r, i) }}>
                      {r.type === 'boss' ? 'BOSS' : r.type === 'item' ? 'ITEM' : r.type === 'save' ? 'SAVE' : ''}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap items-center">
          <span style={{ fontFamily: '"Orbitron", sans-serif', color: `${t.a}50`, fontSize: '0.4rem', letterSpacing: '0.15em' }}>WARP:</span>
          {ROOMS.map((_, i) => (
            <button key={i} onClick={() => setPlayerPos(i)} style={{
              fontFamily: '"Orbitron", sans-serif', color: i === playerPos ? t.bg : `${t.a}70`,
              background: i === playerPos ? t.a : 'transparent',
              border: `1px solid ${t.a}40`, padding: '1px 4px', fontSize: '0.4rem', cursor: 'pointer',
              boxShadow: i === playerPos ? `0 0 8px ${t.a}` : undefined,
            }}>{i.toString().padStart(2, '0')}</button>
          ))}
        </div>
      </div>
    );
  }

  // ── E: Stone & Ember — dungeon parchment floor plan with clip-path rooms
  if (t.id === 'E') {
    return (
      <div style={{ border: 'none', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))', background: `${t.surf}`, padding: '10px 12px' }}>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: '"Oswald", sans-serif', color: t.a, fontSize: '0.62rem', letterSpacing: '0.2em', fontWeight: 700 }}>DUNGEON LEVEL I</span>
          <button onClick={() => setFog(f => !f)} style={{ fontFamily: '"Oswald", sans-serif', color: fog ? t.a : `${t.a}55`, fontSize: '0.55rem', letterSpacing: '0.1em', background: 'none', border: `1px solid ${fog ? t.a : `${t.a}30`}`, padding: '2px 6px', cursor: 'pointer', clipPath: 'polygon(0 0, calc(100%-4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100%-4px))' }}>
            REVEAL {fog ? '✓' : ''}
          </button>
        </div>
        <svg width="100%" viewBox="0 0 110 62" style={{ display: 'block' }}>
          {/* Stone texture dots */}
          {Array.from({ length: 60 }).map((_, i) => (
            <circle key={i} cx={Math.sin(i * 7.3) * 50 + 55} cy={Math.cos(i * 5.1) * 28 + 31} r={0.5}
              fill={`${t.a}18`} />
          ))}
          {/* Corridors */}
          <path d="M50,35 L62,35 M62,35 L74,35 M50,35 L50,25 M50,35 L50,45 M50,25 L50,15 M38,35 L50,35 M26,35 L38,35 M62,45 L62,55 M74,35 L74,45"
            fill="none" stroke={`${t.a}40`} strokeWidth={3} strokeLinecap="square" />
          {ROOMS.map((r, i) => {
            const hidden = fog && !r.visited && i !== playerPos;
            return hidden ? (
              <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="#1a1408" stroke={`${t.a}20`} strokeWidth={0.5} />
            ) : (
              <g key={i}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h}
                  fill={i === playerPos ? `${t.a}25` : r.type === 'boss' ? '#3a100800' : `${t.a}10`}
                  stroke={i === playerPos ? t.a : `${t.a}60`}
                  strokeWidth={i === playerPos ? 1.5 : 0.8}
                  style={{ filter: i === playerPos ? `drop-shadow(0 0 4px ${t.a}88)` : undefined }} />
                {r.type !== 'normal' && (
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 2} textAnchor="middle"
                    style={{ fontSize: '5px', fill: roomColor(r, i) }}>
                    {r.type === 'boss' ? '⚔' : r.type === 'item' ? '◈' : '⊕'}
                  </text>
                )}
                {i === playerPos && (
                  <polygon points={`${r.x + r.w / 2 - 2},${r.y + r.h / 2 + 2} ${r.x + r.w / 2 + 2},${r.y + r.h / 2 + 2} ${r.x + r.w / 2},${r.y + r.h / 2 - 2}`} fill={t.a} />
                )}
              </g>
            );
          })}
        </svg>
        <div className="flex gap-1.5 mt-2 flex-wrap items-center">
          <span style={{ fontFamily: '"Oswald", sans-serif', color: `${t.a}60`, fontSize: '0.5rem', letterSpacing: '0.1em' }}>MOVE:</span>
          {ROOMS.map((_, i) => (
            <button key={i} onClick={() => setPlayerPos(i)} style={{
              fontFamily: '"Oswald", sans-serif', color: i === playerPos ? t.bg : `${t.a}80`,
              background: i === playerPos ? t.a : 'transparent',
              border: `1px solid ${t.a}40`, padding: '1px 4px', fontSize: '0.5rem', cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))',
            }}>{i + 1}</button>
          ))}
        </div>
      </div>
    );
  }

  // ── F: Pixel Art — tile-based map with pixel rooms
  return (
    <div style={{ border: `2px solid ${t.a}`, background: t.bg, padding: '8px 10px', imageRendering: 'pixelated' }}>
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: '"Press Start 2P", monospace', color: t.a, fontSize: '0.38rem', letterSpacing: '0.08em' }}>MAP</span>
        <button onClick={() => setFog(f => !f)} style={{ fontFamily: '"Press Start 2P", monospace', color: fog ? t.a : `${t.a}55`, fontSize: '0.32rem', background: 'none', border: `2px solid ${fog ? t.a : `${t.a}40`}`, padding: '2px 4px', cursor: 'pointer', imageRendering: 'pixelated' }}>
          {fog ? 'FOG:ON' : 'FOG:OFF'}
        </button>
      </div>
      <svg width="100%" viewBox="0 0 110 62" style={{ display: 'block', imageRendering: 'pixelated' }}>
        {/* Background fill */}
        <rect x={0} y={0} width={110} height={62} fill="#08080e" />
        {/* Pixel corridors */}
        <rect x={50} y={34} width={24} height={2} fill={`${t.a}40`} />
        <rect x={50} y={25} width={2} height={10} fill={`${t.a}40`} />
        <rect x={50} y={45} width={2} height={6} fill={`${t.a}40`} />
        <rect x={50} y={16} width={2} height={9} fill={`${t.a}40`} />
        <rect x={38} y={34} width={12} height={2} fill={`${t.a}40`} />
        <rect x={26} y={34} width={12} height={2} fill={`${t.a}40`} />
        <rect x={62} y={45} width={2} height={6} fill={`${t.a}40`} />
        <rect x={74} y={35} width={2} height={10} fill={`${t.a}40`} />
        {ROOMS.map((r, i) => {
          const hidden = fog && !r.visited && i !== playerPos;
          const fc = i === playerPos ? t.a : roomColor(r, i);
          return hidden ? (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="#0a0a12" stroke={`${t.a}20`} strokeWidth={1} />
          ) : (
            <g key={i}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={`${fc}22`} stroke={fc} strokeWidth={1} />
              {r.type !== 'normal' && (
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 2} textAnchor="middle"
                  style={{ fontFamily: 'monospace', fontSize: '5px', fill: fc, imageRendering: 'pixelated' }}>
                  {r.type === 'boss' ? 'B' : r.type === 'item' ? 'I' : 'S'}
                </text>
              )}
              {i === playerPos && (
                <motion.rect x={r.x + r.w / 2 - 2} y={r.y + r.h / 2 - 2} width={4} height={4}
                  fill={t.a} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex gap-1 mt-1.5 flex-wrap items-center">
        {ROOMS.map((_, i) => (
          <button key={i} onClick={() => setPlayerPos(i)} style={{
            fontFamily: '"Press Start 2P", monospace', color: i === playerPos ? t.bg : `${t.a}70`,
            background: i === playerPos ? t.a : `${t.a}18`,
            border: `1px solid ${t.a}60`, padding: '1px 3px', fontSize: '0.3rem', cursor: 'pointer', imageRendering: 'pixelated',
          }}>{i.toString().padStart(2, '0')}</button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMBAT LOG
// ─────────────────────────────────────────────────────────────────────────────

interface LogEntry { id: number; time: string; text: string; type: 'dmg' | 'heal' | 'crit' | 'event' | 'sys'; }
let _logId = 0;

const LOG_TEMPLATES: { type: LogEntry['type']; msgs: string[] }[] = [
  { type: 'dmg',   msgs: ['Skeleton strikes for 24 dmg', 'Orc Warrior hits you for 38 dmg', 'Poison deals 7 dmg/sec', 'Fire trap deals 52 dmg'] },
  { type: 'heal',  msgs: ['Health Potion restores 45 HP', 'Shrine heals 80 HP', 'Regeneration restores 12 HP'] },
  { type: 'crit',  msgs: ['CRITICAL HIT — 144 dmg!', 'BACKSTAB — 88 dmg!', 'CRIT — Skeleton slain!'] },
  { type: 'event', msgs: ['Chest opened — Rare sword found', 'Door unlocked', 'Quest updated: Find the Archives', 'New area discovered'] },
  { type: 'sys',   msgs: ['Level Up! Now Level 5', 'Skill unlocked: Shadow Step', 'Achievement: First Blood'] },
];

const CombatLog: React.FC<{ t: Th }> = ({ t }) => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ts = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
  };

  const addEntry = useCallback(() => {
    const cat = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
    const msg = cat.msgs[Math.floor(Math.random() * cat.msgs.length)];
    setEntries(prev => [...prev.slice(-30), { id: ++_logId, time: ts(), text: msg, type: cat.type }]);
  }, []);

  const clearEntries = useCallback(() => setEntries([]), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(addEntry, 1800);
    return () => clearInterval(id);
  }, [paused, addEntry]);

  // Scroll to bottom after React has painted — requestAnimationFrame
  // ensures layout is complete before measuring scrollHeight.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => cancelAnimationFrame(raf);
  }, [entries]);

  const entryColor = (type: LogEntry['type']) => {
    if (type === 'crit')  return t.id === 'D' ? '#ff2d78' : '#ff4444';
    if (type === 'heal')  return t.id === 'D' ? '#00f5ff' : '#7ec87e';
    if (type === 'event') return t.a;
    if (type === 'sys')   return t.id === 'C' ? '#c9962b' : t.id === 'F' ? '#44aaff' : t.a;
    return t.text; // dmg
  };

  const prefix = (type: LogEntry['type']) => {
    if (t.id === 'A') return { crit: '!! ', dmg: '>> ', heal: '+> ', event: '// ', sys: '## ' }[type];
    if (t.id === 'B') return { crit: '[KIA] ', dmg: '[HIT] ', heal: '[MED] ', event: '[EVT] ', sys: '[SYS] ' }[type];
    if (t.id === 'C') return { crit: '⚔ ', dmg: '• ', heal: '✦ ', event: '◈ ', sys: '★ ' }[type];
    if (t.id === 'D') return { crit: '!! ', dmg: '> ', heal: '+ ', event: '◉ ', sys: '★ ' }[type];
    if (t.id === 'E') return { crit: '⚔ ', dmg: '• ', heal: '✦ ', event: '» ', sys: '⊕ ' }[type];
    return { crit: '!! ', dmg: '>> ', heal: '++ ', event: '-- ', sys: '** ' }[type]; // F
  };

  const containerStyle: React.CSSProperties = {
    border: t.id === 'B' ? `1px dashed ${t.bord}` : t.id === 'F' ? `2px solid ${t.a}` : t.id === 'E' ? 'none' : `1px solid ${t.bord}`,
    clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' : undefined,
    background: t.surf,
    boxShadow: t.id === 'D' ? `0 0 20px ${t.a}15, inset 0 0 20px ${t.a}08` : undefined,
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${t.bord}`, background: `${t.a}08` }}>
        <span style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color: t.a, fontSize: t.id === 'F' ? '0.38rem' : '0.62rem', letterSpacing: '0.18em',
          textShadow: t.id === 'D' ? `0 0 8px ${t.a}` : undefined }}>
          {t.id === 'B' ? 'FIELD REPORT LOG' : t.id === 'C' ? 'Chronicle of Events' : t.id === 'E' ? 'BATTLE RECORD' : 'COMBAT LOG'}
        </span>
        <div className="flex items-center gap-2">
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: paused ? `${t.a}40` : t.a, boxShadow: paused ? undefined : `0 0 6px ${t.a}` }}
            animate={paused ? {} : { opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <button onClick={() => setPaused(p => !p)} style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color: `${t.a}80`, fontSize: t.id === 'F' ? '0.3rem' : '0.52rem', letterSpacing: '0.12em', background: 'none', border: `1px solid ${t.a}30`, padding: '1px 6px', cursor: 'pointer' }}>
            {paused ? (t.id === 'F' ? 'PLAY' : 'RESUME') : (t.id === 'F' ? 'STOP' : 'PAUSE')}
          </button>
          <button onClick={addEntry} style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color: `${t.a}80`, fontSize: t.id === 'F' ? '0.3rem' : '0.52rem', letterSpacing: '0.12em', background: 'none', border: `1px solid ${t.a}30`, padding: '1px 6px', cursor: 'pointer' }}>
            +
          </button>
          <button onClick={clearEntries} style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color: `${t.a}50`, fontSize: t.id === 'F' ? '0.3rem' : '0.52rem', letterSpacing: '0.12em', background: 'none', border: `1px solid ${t.a}20`, padding: '1px 6px', cursor: 'pointer' }}>
            {t.id === 'F' ? 'CLR' : 'CLEAR'}
          </button>
        </div>
      </div>
      {/* Log entries */}
      <div style={{ height: 160, overflowY: 'auto', padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {entries.length === 0 && (
          <div style={{ fontFamily: t.font, color: `${t.text}40`, fontSize: t.id === 'F' ? '0.35rem' : '0.65rem', textAlign: 'center', marginTop: 50, fontStyle: t.id === 'C' ? 'italic' : 'normal' }}>
            {t.id === 'B' ? '— Awaiting field events —' : t.id === 'C' ? 'The chronicle awaits…' : 'No events yet…'}
          </div>
        )}
        <AnimatePresence initial={false}>
          {entries.map(e => (
            <motion.div key={e.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexShrink: 0 }}>
              <span style={{ fontFamily: '"Space Mono", monospace', color: `${t.text}35`, fontSize: '0.48rem', flexShrink: 0, whiteSpace: 'nowrap' }}>{e.time}</span>
              <span style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.id === 'C' ? '"EB Garamond", serif' : t.font,
                color: entryColor(e.type), fontSize: t.id === 'F' ? '0.32rem' : t.id === 'C' ? '0.78rem' : '0.62rem',
                textShadow: t.id === 'D' && e.type !== 'dmg' ? `0 0 6px ${entryColor(e.type)}` : undefined,
                lineHeight: t.id === 'F' ? 2.0 : 1.5, fontStyle: t.id === 'C' && e.type === 'event' ? 'italic' : 'normal',
              }}>
                {prefix(e.type)}{e.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Scroll anchor — always stays at the bottom of the list */}
        <div ref={bottomRef} style={{ flexShrink: 0, height: 1 }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PANEL
// ─────────────────────────────────────────────────────────────────────────────

interface KeyBind { action: string; key: string }
const DEFAULT_KEYBINDS: KeyBind[] = [
  { action: 'Attack', key: 'LMB' },
  { action: 'Dodge', key: 'Space' },
  { action: 'Interact', key: 'E' },
  { action: 'Map', key: 'M' },
  { action: 'Inventory', key: 'I' },
];

const SettingsPanel: React.FC<{ t: Th }> = ({ t }) => {
  const [tab, setTab] = useState<'controls' | 'audio' | 'display'>('controls');
  const [bindingIdx, setBindingIdx] = useState<number | null>(null);
  const [keybinds, setKeybinds] = useState<KeyBind[]>(DEFAULT_KEYBINDS);
  const [volume, setVolume] = useState({ master: 80, music: 60, sfx: 75 });
  const [toggles, setToggles] = useState({ subtitles: true, hud: true, vignette: false, motionBlur: true });

  useEffect(() => {
    if (bindingIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeybinds(prev => prev.map((b, i) => i === bindingIdx ? { ...b, key: e.key === ' ' ? 'Space' : e.key.toUpperCase() } : b));
      setBindingIdx(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bindingIdx]);

  const tabs = ['controls', 'audio', 'display'] as const;
  const tabLabel = (tb: typeof tab) => {
    if (t.id === 'F') return { controls: 'CTRLS', audio: 'AUDIO', display: 'DISP' }[tb];
    if (t.id === 'B') return { controls: 'CONTROLS', audio: 'AUDIO', display: 'DISPLAY' }[tb];
    if (t.id === 'C') return { controls: 'Controls', audio: 'Audio', display: 'Display' }[tb];
    return { controls: 'Controls', audio: 'Audio', display: 'Display' }[tb];
  };

  const containerStyle: React.CSSProperties = {
    border: t.id === 'B' ? `1px dashed ${t.bord}` : t.id === 'F' ? `2px solid ${t.a}` : t.id === 'E' ? 'none' : `1px solid ${t.bord}`,
    clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' : undefined,
    background: t.surf,
    boxShadow: t.id === 'D' ? `0 0 20px ${t.a}15, inset 0 0 20px ${t.a}08` : undefined,
    overflow: 'hidden',
  };

  const TabBtn: React.FC<{ id: typeof tab }> = ({ id }) => {
    const isActive = tab === id;
    const base: React.CSSProperties = {
      fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.id === 'C' ? '"Cinzel", serif' : t.id === 'D' ? '"Orbitron", sans-serif' : t.font,
      fontSize: t.id === 'F' ? '0.32rem' : t.id === 'D' ? '0.5rem' : '0.62rem',
      letterSpacing: t.id === 'D' ? '0.15em' : '0.1em',
      color: isActive ? (t.id === 'A' || t.id === 'E' ? t.bg : t.bg) : `${t.a}70`,
      background: isActive ? t.a : 'transparent',
      border: t.id === 'F' ? `2px solid ${t.a}` : `1px solid ${isActive ? t.a : `${t.a}30`}`,
      padding: t.id === 'F' ? '4px 8px' : '3px 12px',
      cursor: 'pointer',
      clipPath: t.id === 'E' ? 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' : undefined,
      boxShadow: isActive && t.id === 'D' ? `0 0 10px ${t.a}80` : undefined,
      textShadow: isActive && t.id === 'D' ? undefined : t.id === 'D' && !isActive ? undefined : undefined,
      transition: 'all 0.12s ease',
    };
    return <button style={base} onClick={() => setTab(id)}>{tabLabel(id)}</button>;
  };

  const SliderRow: React.FC<{ label: string; val: number; onChange: (v: number) => void }> = ({ label, val, onChange }) => (
    <div className="flex items-center gap-3 py-1.5">
      <span style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color: t.text, fontSize: t.id === 'F' ? '0.32rem' : '0.62rem', opacity: 0.7, minWidth: 56 }}>{label}</span>
      <div className="relative flex-1 h-1.5" style={{ background: `${t.a}20`, border: t.id === 'F' ? `1px solid ${t.a}50` : undefined }}>
        <motion.div className="absolute top-0 left-0 h-full" style={{ width: `${val}%`, background: t.a, boxShadow: t.id === 'D' ? `0 0 4px ${t.a}` : undefined }} animate={{ width: `${val}%` }} transition={{ duration: 0.15 }} />
        <input type="range" min={0} max={100} value={val} onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
      <span style={{ fontFamily: '"Space Mono", monospace', color: `${t.a}80`, fontSize: '0.52rem', minWidth: 28, textAlign: 'right' }}>{val}</span>
    </div>
  );

  const ToggleRow: React.FC<{ label: string; val: boolean; onChange: (v: boolean) => void }> = ({ label, val, onChange }) => (
    <div className="flex items-center justify-between py-1.5">
      <span style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color: t.text, fontSize: t.id === 'F' ? '0.32rem' : '0.62rem', opacity: 0.7 }}>{label}</span>
      <button onClick={() => onChange(!val)} style={{
        width: t.id === 'F' ? 28 : 36, height: t.id === 'F' ? 12 : 18, position: 'relative',
        background: val ? t.a : `${t.a}20`,
        border: t.id === 'F' ? `2px solid ${t.a}` : `1px solid ${val ? t.a : `${t.a}40`}`,
        cursor: 'pointer', transition: 'all 0.15s ease',
        boxShadow: val && t.id === 'D' ? `0 0 8px ${t.a}80` : undefined,
        imageRendering: t.id === 'F' ? 'pixelated' : undefined,
      }}>
        <motion.div animate={{ x: val ? (t.id === 'F' ? 16 : 18) : 2 }} transition={{ duration: 0.12 }}
          style={{ position: 'absolute', top: 2, width: t.id === 'F' ? 6 : 10, height: t.id === 'F' ? 6 : 10, background: val ? t.bg : `${t.a}60` }} />
      </button>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${t.bord}`, background: `${t.a}08` }}>
        <span style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.id === 'D' ? '"Orbitron", sans-serif' : t.font, color: t.a, fontSize: t.id === 'F' ? '0.38rem' : '0.65rem', letterSpacing: '0.2em', textShadow: t.id === 'D' ? `0 0 8px ${t.a}` : undefined }}>
          {t.id === 'B' ? 'SYSTEM SETTINGS' : t.id === 'C' ? 'Options & Bindings' : 'SETTINGS'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-3 pt-3 pb-2">
        {tabs.map(tb => <TabBtn key={tb} id={tb} />)}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
          className="px-3 pb-3">
          {tab === 'controls' && (
            <div className="mt-1">
              {keybinds.map((bind, i) => (
                <div key={bind.action} className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${t.bord}40` }}>
                  <span style={{ fontFamily: t.id === 'F' ? '"Press Start 2P", monospace' : t.font, color: t.text, fontSize: t.id === 'F' ? '0.32rem' : '0.62rem', opacity: 0.7 }}>{bind.action}</span>
                  <button onClick={() => setBindingIdx(bindingIdx === i ? null : i)} style={{
                    fontFamily: '"Space Mono", monospace', color: bindingIdx === i ? t.bg : t.a,
                    background: bindingIdx === i ? t.a : `${t.a}18`,
                    border: `1px solid ${bindingIdx === i ? t.a : `${t.a}50`}`,
                    padding: '2px 10px', fontSize: '0.55rem', cursor: 'pointer', minWidth: 52, textAlign: 'center',
                    boxShadow: bindingIdx === i && t.id === 'D' ? `0 0 8px ${t.a}` : undefined,
                    animation: bindingIdx === i ? 'gui-blink 0.6s step-end infinite' : undefined,
                  }}>
                    {bindingIdx === i ? '…' : bind.key}
                  </button>
                </div>
              ))}
              <div className="mt-2 text-right">
                <span style={{ fontFamily: '"Space Mono", monospace', color: `${t.text}30`, fontSize: '0.46rem' }}>click a key then press new key to rebind</span>
              </div>
            </div>
          )}
          {tab === 'audio' && (
            <div className="mt-1">
              <SliderRow label="Master" val={volume.master} onChange={v => setVolume(p => ({ ...p, master: v }))} />
              <SliderRow label="Music"  val={volume.music}  onChange={v => setVolume(p => ({ ...p, music: v }))} />
              <SliderRow label="SFX"    val={volume.sfx}    onChange={v => setVolume(p => ({ ...p, sfx: v }))} />
            </div>
          )}
          {tab === 'display' && (
            <div className="mt-1">
              <ToggleRow label="Subtitles"   val={toggles.subtitles}   onChange={v => setToggles(p => ({ ...p, subtitles: v }))} />
              <ToggleRow label="Show HUD"    val={toggles.hud}         onChange={v => setToggles(p => ({ ...p, hud: v }))} />
              <ToggleRow label="Vignette"    val={toggles.vignette}    onChange={v => setToggles(p => ({ ...p, vignette: v }))} />
              <ToggleRow label="Motion Blur" val={toggles.motionBlur}  onChange={v => setToggles(p => ({ ...p, motionBlur: v }))} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

const GameUIPage: React.FC = () => {
  const navigate = useNavigate();
  const [sid, setSid] = useState<SID>('D');
  const t = T[sid];

  const sections = [
    { id: 'hud',       label: 'HUD System',          sub: 'resource bars + xp + hotbar' },
    { id: 'feedback',  label: 'Combat Feedback',       sub: 'achievements + floating numbers + statuses' },
    { id: 'screens',   label: 'Game Screens',          sub: 'menu + game over + victory' },
    { id: 'inventory', label: 'Inventory System',      sub: 'item grid + tooltips' },
    { id: 'dialogue',  label: 'Dialogue System',       sub: 'typewriter + choices' },
    { id: 'minimap',   label: 'Minimap',               sub: 'dungeon map · 6 style variants' },
    { id: 'combatlog', label: 'Combat Log',             sub: 'live event feed · auto-scroll · pause' },
    { id: 'settings',  label: 'Settings Panel',         sub: 'keybinds · audio · display toggles' },
  ];

  return (
    <div className="gui-root min-h-screen" style={{ background: t.bg, transition: 'background 0.4s ease' }}>
      <style>{FONTS_CSS}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        {/* Back nav */}
        <FV>
          <button onClick={() => navigate('/games')}
            className="flex items-center gap-2 mb-8 text-xs tracking-[0.2em] uppercase opacity-40 hover:opacity-70 transition-opacity"
            style={{ fontFamily: '"Space Mono", monospace', color: t.text, background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={13} />
            Games
          </button>
        </FV>

        {/* Page header */}
        <FV>
          <p className="text-[9px] tracking-[0.35em] uppercase mb-3 opacity-40" style={{ fontFamily: '"Space Mono", monospace', color: t.a }}>
            Design System · UI Elements
          </p>
          <h1 style={{ fontFamily: t.disp, color: t.a, fontSize: 'clamp(2rem, 7vw, 3.8rem)', letterSpacing: '0.04em', lineHeight: 1.05,
            textShadow: t.id === 'D' ? `0 0 30px ${t.a}60` : undefined }}>
            Game UI Showcase
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed opacity-65" style={{ fontFamily: t.font, color: t.text, fontSize: t.id === 'F' ? '0.5rem' : '0.9rem' }}>
            Six complete style directions. Each element adapts its visual language to match the active theme — from pixel art to neon void to illuminated medieval chronicle.
          </p>
        </FV>

        {/* Style picker */}
        <FV delay={0.1} className="mt-8 mb-2">
          <div className="text-[9px] tracking-[0.35em] uppercase mb-3 opacity-40" style={{ fontFamily: '"Space Mono", monospace', color: t.text }}>
            Active Style Direction
          </div>
          <StylePicker active={sid} onChange={setSid} />
          <div className="mt-3 text-sm opacity-60" style={{ fontFamily: t.font, color: t.a, fontSize: t.id === 'F' ? '0.45rem' : '0.8rem' }}>
            {t.name}
          </div>
        </FV>

        {/* Divider */}
        <FV delay={0.15} className="my-10">
          <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, ${t.a}40, transparent)` }} />
        </FV>

        {/* ── Section 1: HUD ─────────────────────────────────────────── */}
        <div id="hud">
          <SectionHead title={sections[0].label} sub={sections[0].sub} t={t} />
          <FV><HudDemo t={t} /></FV>
        </div>

        <FV className="my-12"><div className="h-[1px] w-full opacity-20" style={{ background: t.a }} /></FV>

        {/* ── Section 2: Combat Feedback ─────────────────────────────── */}
        <div id="feedback">
          <SectionHead title={sections[1].label} sub={sections[1].sub} t={t} />
          <FV delay={0.05}>
            <div className="mb-2 text-[9px] tracking-[0.25em] uppercase opacity-40" style={{ fontFamily: '"Space Mono", monospace', color: t.text }}>Achievement Toast</div>
            <AchievementToast t={t} />
          </FV>
          <FV delay={0.1} className="mt-10">
            <div className="mb-2 text-[9px] tracking-[0.25em] uppercase opacity-40" style={{ fontFamily: '"Space Mono", monospace', color: t.text }}>Floating Numbers</div>
            <FloatingNumbers t={t} />
          </FV>
          <FV delay={0.15} className="mt-10">
            <div className="mb-2 text-[9px] tracking-[0.25em] uppercase opacity-40" style={{ fontFamily: '"Space Mono", monospace', color: t.text }}>Status Effects — Countdown Rings</div>
            <StatusEffects t={t} />
          </FV>
        </div>

        <FV className="my-12"><div className="h-[1px] w-full opacity-20" style={{ background: t.a }} /></FV>

        {/* ── Section 3: Screens ─────────────────────────────────────── */}
        <div id="screens">
          <SectionHead title={sections[2].label} sub={sections[2].sub} t={t} />
          <FV><ScreenPreviews t={t} /></FV>
        </div>

        <FV className="my-12"><div className="h-[1px] w-full opacity-20" style={{ background: t.a }} /></FV>

        {/* ── Section 4: Inventory ───────────────────────────────────── */}
        <div id="inventory">
          <SectionHead title={sections[3].label} sub={sections[3].sub} t={t} />
          <FV><InventoryGrid t={t} /></FV>
        </div>

        <FV className="my-12"><div className="h-[1px] w-full opacity-20" style={{ background: t.a }} /></FV>

        {/* ── Section 5: Dialogue ────────────────────────────────────── */}
        <div id="dialogue">
          <SectionHead title={sections[4].label} sub={sections[4].sub} t={t} />
          <FV><DialogueBox t={t} /></FV>
        </div>

        <FV className="my-12"><div className="h-[1px] w-full opacity-20" style={{ background: t.a }} /></FV>

        {/* ── Section 6: Minimap ────────────────────────────────────── */}
        <div id="minimap">
          <SectionHead title={sections[5].label} sub={sections[5].sub} t={t} />
          <FV><MiniMap t={t} /></FV>
        </div>

        <FV className="my-12"><div className="h-[1px] w-full opacity-20" style={{ background: t.a }} /></FV>

        {/* ── Section 7: Combat Log ─────────────────────────────────── */}
        <div id="combatlog">
          <SectionHead title={sections[6].label} sub={sections[6].sub} t={t} />
          <FV><CombatLog t={t} /></FV>
        </div>

        <FV className="my-12"><div className="h-[1px] w-full opacity-20" style={{ background: t.a }} /></FV>

        {/* ── Section 8: Settings ───────────────────────────────────── */}
        <div id="settings">
          <SectionHead title={sections[7].label} sub={sections[7].sub} t={t} />
          <FV><SettingsPanel t={t} /></FV>
        </div>

        {/* Footer */}
        <FV className="mt-20 text-center">
          <div className="text-[8px] tracking-[0.3em] uppercase opacity-20" style={{ fontFamily: '"Space Mono", monospace', color: t.text }}>
            Game UI Showcase · Six Style Directions · {Object.keys(T).length} Themes · 12 Interactive Elements
          </div>
          <div className="flex justify-center gap-3 mt-3">
            {STYLE_IDS.map(id => (
              <div key={id} className="w-2 h-2" style={{ background: id === sid ? T[id].a : `${T[id].a}30`, borderRadius: '50%', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </FV>
      </div>
    </div>
  );
};

export default GameUIPage;
