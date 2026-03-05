import React, { useState, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';
import {
  RotateCcw, Shuffle,
  ArrowRight, AlignJustify, Grid3X3,
} from 'lucide-react';

// ── Shared wrappers (match the playground design system) ──────────────────────

interface CardProps {
  title: string;
  description: string;
  useCase: string;
  children: React.ReactNode;
}
const ShowcaseCard: React.FC<CardProps> = ({ title, description, useCase, children }) => (
  <div
    className="rounded-xl flex flex-col"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div
      className="mx-5 my-3 rounded-lg flex items-center justify-center overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.3)', minHeight: 148, padding: '1.75rem 1rem' }}
    >
      {children}
    </div>
    <div className="px-5 pb-4 flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.16)' }}>use case</span>
      <span className="text-[11px]" style={{ color: '#7eb8e8', opacity: 0.75 }}>— {useCase}</span>
    </div>
  </div>
);

interface SectionHeaderProps { number: string; title: string; subtitle: string; accent: string; }
const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, subtitle, accent }) => (
  <div className="flex items-start gap-4 mb-7">
    <span className="text-[11px] font-black tabular-nums mt-1 shrink-0" style={{ color: accent, fontFamily: 'monospace', opacity: 0.55 }}>{number}</span>
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h2>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>{subtitle}</p>
    </div>
  </div>
);

/** Replay button — small trigger for demos that need a restart */
const ReplayBtn: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = 'Replay' }) => (
  <motion.button
    type="button" onClick={onClick}
    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
    className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
    style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
    }}
  >
    <RotateCcw size={11} /> {label}
  </motion.button>
);

// ═══════════════════════════════════════════════════════
// SECTION 1 — ENTRANCE & EXIT
// ═══════════════════════════════════════════════════════

// 1 · Director's Cut — switch between 6 entrance variants live
const ENTRANCE_VARIANTS = [
  { key: 'slide',   label: 'Slide',    initial: { x: -80, opacity: 0 },    animate: { x: 0, opacity: 1 },     exit: { x: 80, opacity: 0 },     transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  { key: 'drop',    label: 'Drop',     initial: { y: -60, opacity: 0 },    animate: { y: 0, opacity: 1 },     exit: { y: 60, opacity: 0 },     transition: { type: 'spring', stiffness: 340, damping: 22 } },
  { key: 'pop',     label: 'Pop',      initial: { scale: 0, opacity: 0 },  animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 },  transition: { type: 'spring', stiffness: 420, damping: 20 } },
  { key: 'flip',    label: 'Flip',     initial: { rotateX: -90, opacity: 0 }, animate: { rotateX: 0, opacity: 1 }, exit: { rotateX: 90, opacity: 0 }, transition: { duration: 0.45 } },
  { key: 'blur',    label: 'Blur',     initial: { opacity: 0, filter: 'blur(14px)', scale: 0.88 }, animate: { opacity: 1, filter: 'blur(0px)', scale: 1 }, exit: { opacity: 0, filter: 'blur(14px)', scale: 0.88 }, transition: { duration: 0.38 } },
  { key: 'skew',    label: 'Skew',     initial: { skewX: -18, opacity: 0, x: -40 }, animate: { skewX: 0, opacity: 1, x: 0 }, exit: { skewX: 18, opacity: 0, x: 40 }, transition: { duration: 0.35, ease: 'easeOut' } },
] as const;

const EntranceDirector: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const [key, setKey] = useState(0);

  const cycle = useCallback((idx: number) => { setActive(idx); setKey(k => k + 1); }, []);

  const v = ENTRANCE_VARIANTS[active];
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center justify-center" style={{ perspective: 600, height: 80 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={v.transition}
            className="px-7 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#4d8fc8,#7eb8e8)', boxShadow: '0 4px 20px rgba(77,143,200,0.45)' }}
          >
            {v.label}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {ENTRANCE_VARIANTS.map((variant, i) => (
          <button
            key={variant.key} type="button"
            onClick={() => cycle(i)}
            className="text-[11px] font-semibold px-3 py-1 rounded-full transition-all"
            style={{
              background: active === i ? 'rgba(77,143,200,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${active === i ? 'rgba(77,143,200,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: active === i ? '#7eb8e8' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
            }}
          >{variant.label}</button>
        ))}
      </div>
    </div>
  );
};

// 2 · Crossfade swap — two panels fade-swap on click
const words = ['Creativity', 'Motion', 'Delight', 'Precision', 'Flow', 'Energy'];
const CrossfadeText: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const colors = ['#4d8fc8', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#facc15'];
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="relative flex items-center justify-center" style={{ height: 56 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute font-black text-2xl tracking-tight"
            style={{ color: colors[idx % colors.length] }}
          >
            {words[idx % words.length]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        type="button" onClick={() => setIdx(i => i + 1)}
        className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
      >
        Next <ArrowRight size={12} />
      </button>
    </div>
  );
};

// 3 · Presence List — add / remove items with layout animation
const PresenceList: React.FC = () => {
  const [items, setItems] = useState(['Alpha', 'Beta', 'Gamma']);
  const names = ['Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
  const nameRef = useRef(0);
  const add = () => {
    const n = names[nameRef.current % names.length];
    nameRef.current++;
    setItems(p => [n, ...p]);
  };
  const remove = (v: string) => setItems(p => p.filter(x => x !== v));

  return (
    <div className="flex flex-col gap-3 w-full max-w-[220px]">
      <motion.ul layout className="flex flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.li
              key={item} layout
              initial={{ opacity: 0, scale: 0.85, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 60 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(77,143,200,0.1)', border: '1px solid rgba(77,143,200,0.2)', color: 'rgba(255,255,255,0.75)' }}
            >
              {item}
              <button type="button" onClick={() => remove(item)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', lineHeight:1, padding:0 }}
              >✕</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      <button type="button" onClick={add}
        className="text-xs font-semibold py-1.5 rounded-lg"
        style={{ background: 'rgba(77,143,200,0.15)', border: '1px solid rgba(77,143,200,0.3)', color: '#7eb8e8', cursor: 'pointer' }}
      >+ Add item</button>
    </div>
  );
};

// 4 · Staggered Reveal — a grid of dots that cascades in on replay
const DotGrid: React.FC = () => {
  const [key, setKey] = useState(0);
  const SIZE = 5;
  const dots = Array.from({ length: SIZE * SIZE }, (_, i) => i);
  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        <motion.div key={key} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {dots.map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: (Math.floor(i / SIZE) + (i % SIZE)) * 0.04,
                type: 'spring', stiffness: 420, damping: 18,
              }}
              className="w-6 h-6 rounded-full"
              style={{ background: `hsl(${200 + i * 4},70%,60%)` }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      <ReplayBtn onClick={() => setKey(k => k + 1)} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 2 — PHYSICS & SPRING
// ═══════════════════════════════════════════════════════

// 5 · Draggable with elastic boundary
const ElasticDrag: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return (
    <div className="relative flex items-center justify-center" style={{ width: '100%', height: 130 }}>
      <p className="absolute text-[10px] font-semibold tracking-widest" style={{ color: 'rgba(255,255,255,0.15)', bottom: 4, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
        DRAG ANYWHERE
      </p>
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -40, bottom: 40 }}
        dragElastic={0.3}
        style={{ x, y, background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', boxShadow: '0 8px 24px rgba(124,58,237,0.5)' }}
        whileDrag={{ scale: 1.15 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xs cursor-grab active:cursor-grabbing select-none"
      >
        DRAG
      </motion.div>
    </div>
  );
};

// 6 · Spring chain — balls cascade drop with softening spring per link
const CHAIN_COUNT = 5;
const SpringChain: React.FC = () => {
  const [dropKey, setDropKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-3" style={{ height: 88 }}>
        {Array.from({ length: CHAIN_COUNT }).map((_, i) => (
          <motion.div
            key={`${dropKey}-${i}`}
            initial={{ y: -70, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.11,
              type: 'spring',
              stiffness: 340 - i * 50,
              damping: 7 + i * 1.5,
              mass: 0.7 + i * 0.15,
            }}
            className="rounded-full"
            style={{
              width: 36 - i * 3,
              height: 36 - i * 3,
              background: `hsl(${240 + i * 22},70%,${55 + i * 4}%)`,
              boxShadow: `0 4px 12px hsla(${240 + i * 22},70%,55%,0.45)`,
            }}
          />
        ))}
      </div>
      <ReplayBtn onClick={() => setDropKey(k => k + 1)} />
    </div>
  );
};

// 7 · Momentum flick — toss a puck with inertia
const InertiaPuck: React.FC = () => {
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 40, damping: 18 });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 48 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} />
        <motion.div
          drag="x"
          dragConstraints={{ left: -75, right: 75 }}
          dragElastic={0.08}
          style={{ x: springX, background: 'radial-gradient(circle at 35% 35%, #7eb8e8, #2563eb)', boxShadow: '0 4px 16px rgba(37,99,235,0.55)', zIndex: 1 }}
          className="w-10 h-10 rounded-full cursor-grab active:cursor-grabbing"
          whileDrag={{ scale: 1.1 }}
        />
      </div>
      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Flick left / right</p>
    </div>
  );
};

// 8 · Gravity ball — balls fall with variable spring stiffness
const GravityBalls: React.FC = () => {
  const [stiffness, setStiffness] = useState(200);
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-end justify-center gap-5" style={{ height: 80 }}>
        {[0.6, 0.8, 1, 0.9, 0.7].map((s, i) => (
          <motion.div
            key={`${key}-${i}`}
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness, damping: 12 }}
            className="rounded-full"
            style={{
              width: 28 * s, height: 28 * s,
              background: `hsl(${200 + i * 30},70%,60%)`,
              boxShadow: `0 2px 12px hsla(${200 + i * 30},70%,60%,0.5)`,
            }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 w-full max-w-[180px]">
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Stiffness: {stiffness}</span>
        <input type="range" min={60} max={500} value={stiffness}
          onChange={e => { setStiffness(Number(e.target.value)); setKey(k => k + 1); }}
          className="w-full cursor-pointer" style={{ accentColor: '#4d8fc8', height: 3 }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 3 — KEYFRAME CHOREOGRAPHY
// ═══════════════════════════════════════════════════════

// 9 · Path morph loader — cycling spinner shapes
const MorphLoader: React.FC = () => {
  const [running, setRunning] = useState(true);
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={running ? {
          rotate: [0, 360],
          borderRadius: ['50%', '10%', '30%', '50%'],
          scale: [1, 0.85, 1.1, 1],
          background: [
            'linear-gradient(135deg,#4d8fc8,#7eb8e8)',
            'linear-gradient(135deg,#a78bfa,#f472b6)',
            'linear-gradient(135deg,#34d399,#06b6d4)',
            'linear-gradient(135deg,#4d8fc8,#7eb8e8)',
          ],
        } : { rotate: 0 }}
        transition={{
          duration: 2.4,
          repeat: running ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{ width: 56, height: 56, boxShadow: '0 4px 24px rgba(77,143,200,0.45)' }}
      />
      <button type="button" onClick={() => setRunning(r => !r)}
        className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
      >
        {running ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
};

// 10 · Heartbeat waveform — animates to flatline on toggle
const HB_PATH = 'M0,30 L30,30 L45,8 L60,52 L75,8 L90,52 L105,30 L180,30';
const FL_PATH = 'M0,30 L30,30 L45,30 L60,30 L75,30 L90,30 L105,30 L180,30';

const HeartbeatWave: React.FC = () => {
  const [flatline, setFlatline] = useState(false);
  const hbRef = useRef<SVGPathElement>(null);
  const flRef = useRef<SVGPathElement>(null);

  // Running heartbeat scan
  React.useEffect(() => {
    if (!hbRef.current || flatline) return;
    const path = hbRef.current;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    const ctrl = animate(path, { strokeDashoffset: [len, 0] }, {
      duration: 1.4, repeat: Infinity, ease: 'linear',
    });
    return () => ctrl.stop();
  }, [flatline]);

  // Flatline draw-in
  React.useEffect(() => {
    if (!flRef.current || !flatline) return;
    const path = flRef.current;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    animate(path, { strokeDashoffset: [len, 0] }, { duration: 1.0, ease: 'easeInOut' });
  }, [flatline]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 180, height: 60 }}>
        <svg width="180" height="60" viewBox="0 0 180 60" className="absolute inset-0">
          {/* Ghost trace */}
          <path d={HB_PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          {/* Heartbeat path — fades out on flatline */}
          <path
            ref={hbRef}
            d={HB_PATH}
            fill="none" stroke="#4d8fc8" strokeWidth="2.5" strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 4px #4d8fc8)',
              opacity: flatline ? 0 : 1,
              transition: 'opacity 0.35s ease',
            }}
          />
          {/* Flatline path — draws in on flatline */}
          <path
            ref={flRef}
            d={FL_PATH}
            fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 6px #ef4444)',
              opacity: flatline ? 1 : 0,
              transition: 'opacity 0.25s ease 0.1s',
            }}
          />
        </svg>
      </div>
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {flatline && (
            <motion.span
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: [0, 1, 0.5, 1] }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, opacity: { repeat: Infinity, duration: 0.9 } }}
              className="text-[10px] font-black tracking-[0.2em]"
              style={{ color: '#ef4444', fontFamily: 'monospace' }}
            >FLATLINE</motion.span>
          )}
        </AnimatePresence>
        <button type="button" onClick={() => setFlatline(f => !f)}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
        >
          {flatline ? '▶ Restore' : '⏸ Flatline'}
        </button>
      </div>
    </div>
  );
};

// 11 · Colour wave — bars that ripple colour like a equalizer
const EqBars: React.FC = () => {
  const [playing, setPlaying] = useState(true);
  const BAR_COUNT = 18;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-1" style={{ height: 56 }}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            animate={playing ? {
              scaleY: [0.15, 0.5 + Math.sin(i) * 0.4, 1, 0.3 + Math.cos(i) * 0.3, 0.15],
            } : { scaleY: 0.15 }}
            transition={{ duration: 0.8 + Math.random() * 0.6, delay: i * 0.04, repeat: playing ? Infinity : 0, repeatType: 'mirror', ease: 'easeInOut' }}
            className="rounded-sm"
            style={{
              width: 7, height: 56, originY: 1,
              background: `hsl(${195 + i * 8},75%,55%)`,
            }}
          />
        ))}
      </div>
      <button type="button" onClick={() => setPlaying(p => !p)}
        className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
      >
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
};

// 12 · Counter — animated number tick
const AnimatedCounter: React.FC = () => {
  const [target, setTarget] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v).toLocaleString());

  const runTo = (n: number) => {
    animate(count, n, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    setTarget(n);
  };

  const targets = [0, 1337, 42000, 1000000];
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.span className="font-black tabular-nums" style={{ fontSize: 38, color: '#7eb8e8', lineHeight: 1, fontFamily: 'monospace' }}>
        {rounded}
      </motion.span>
      <div className="flex gap-2 flex-wrap justify-center">
        {targets.map(n => (
          <button key={n} type="button" onClick={() => runTo(n)}
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{
              background: target === n ? 'rgba(77,143,200,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${target === n ? 'rgba(77,143,200,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: target === n ? '#7eb8e8' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
            }}
          >{n.toLocaleString()}</button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 4 — ORCHESTRATION & STAGGER
// ═══════════════════════════════════════════════════════

// 13 · Word by word reveal
const SENTENCES = [
  'Motion creates meaning.',
  'Every frame tells a story.',
  'Spring physics feel alive.',
  'Delight lives in the details.',
];
const WordReveal: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);
  const advance = () => { setIdx(i => (i + 1) % SENTENCES.length); setKey(k => k + 1); };
  const words = SENTENCES[idx].split(' ');
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 min-h-[2.5rem]">
        {words.map((word, i) => (
          <motion.span
            key={`${key}-${i}`}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: i * 0.09, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold text-lg"
            style={{ color: `hsl(${200 + i * 18},75%,${65 + i * 2}%)` }}
          >{word}</motion.span>
        ))}
      </div>
      <button type="button" onClick={advance}
        className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
      >Next sentence <ArrowRight size={11} /></button>
    </div>
  );
};

// 14 · Card stack deal — cards fan out from a deck
const CARD_COLORS = ['#4d8fc8', '#a78bfa', '#34d399', '#fb923c', '#f472b6'];
const CardDeal: React.FC = () => {
  const [dealt, setDealt] = useState(false);
  const [key, setKey] = useState(0);
  const deal = () => { setDealt(false); setKey(k => k + 1); setTimeout(() => setDealt(true), 30); };
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: 140, height: 88 }}>
        {CARD_COLORS.map((color, i) => (
          <motion.div
            key={`${key}-${i}`}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0.2, scale: 0.9 }}
            animate={dealt ? {
              x: (i - 2) * 32,
              y: -Math.abs(i - 2) * 8,
              rotate: (i - 2) * 8,
              opacity: 1,
              scale: 1,
            } : { x: 0, y: 0, rotate: 0, opacity: 0.2, scale: 0.9 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 320, damping: 22 }}
            className="absolute inset-0 rounded-xl"
            style={{ background: color, boxShadow: `0 4px 18px ${color}55`, top: 0, left: 0 }}
          />
        ))}
      </div>
      <button type="button" onClick={deal}
        className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
      >
        <Shuffle size={11} /> Deal cards
      </button>
    </div>
  );
};

// 15 · Layout transition grid ↔ list
type ViewMode = 'grid' | 'list';
const items15 = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon'];
const LayoutSwitch: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('grid');
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-end">
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          {(['grid', 'list'] as ViewMode[]).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className="flex items-center justify-center p-1.5"
              style={{ background: mode === m ? 'rgba(77,143,200,0.22)' : 'transparent', cursor: 'pointer', border: 'none' }}
            >
              {m === 'grid' ? <Grid3X3 size={13} color={mode === m ? '#7eb8e8' : 'rgba(255,255,255,0.3)'} />
                : <AlignJustify size={13} color={mode === m ? '#7eb8e8' : 'rgba(255,255,255,0.3)'} />}
            </button>
          ))}
        </div>
      </div>
      <motion.div layout className={mode === 'grid' ? 'grid grid-cols-3 gap-1.5' : 'flex flex-col gap-1.5'}>
        {items15.map(item => (
          <motion.div
            key={item} layout
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="rounded-lg font-semibold text-[11px] flex items-center justify-center"
            style={{
              background: 'rgba(77,143,200,0.1)',
              border: '1px solid rgba(77,143,200,0.18)',
              color: 'rgba(255,255,255,0.6)',
              height: mode === 'grid' ? 38 : 28,
              padding: mode === 'list' ? '0 12px' : 0,
              justifyContent: mode === 'list' ? 'flex-start' : 'center',
            }}
          >{item}</motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// 16 · Live gesture trail — multiple trail style modes
type TrailStyle = 'dots' | 'sparkles' | 'stars' | 'comet';
const TRAIL_LEN = 16;

const GestureTrail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [trailStyle, setTrailStyle] = useState<TrailStyle>('dots');
  const trailId = useRef(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: ++trailId.current };
    setTrail(t => [...t.slice(-(TRAIL_LEN - 1)), pt]);
  };
  const onLeave = () => setTrail([]);

  const renderParticle = (pt: { x: number; y: number; id: number }, i: number) => {
    const op = (i + 1) / TRAIL_LEN;
    const color = `hsl(${195 + i * 9},80%,62%)`;
    const sz = 5 + i * 0.9;
    if (trailStyle === 'dots') return (
      <motion.div key={pt.id}
        initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 1, opacity: op }} exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{ position:'absolute', left: pt.x - sz/2, top: pt.y - sz/2, width: sz, height: sz,
          borderRadius:'50%', background: color, filter:'blur(0.8px)', pointerEvents:'none' }}
      />
    );
    if (trailStyle === 'sparkles') return (
      <motion.div key={pt.id}
        initial={{ scale: 0, opacity: 1, rotate: -30 }} animate={{ scale: 1, opacity: op, rotate: i * 15 }} exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{ position:'absolute', left: pt.x - 9, top: pt.y - 9, fontSize: 8 + i * 0.8,
          color, pointerEvents:'none', lineHeight: 1,
          filter: `drop-shadow(0 0 3px ${color})` }}
      >✦</motion.div>
    );
    if (trailStyle === 'stars') return (
      <motion.div key={pt.id}
        initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1, opacity: op }} exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        style={{ position:'absolute', left: pt.x - 9, top: pt.y - 9, fontSize: 8 + i * 0.9,
          color, pointerEvents:'none', lineHeight: 1,
          filter: `drop-shadow(0 0 4px ${color})` }}
      >★</motion.div>
    );
    if (trailStyle === 'comet') return (
      <motion.div key={pt.id}
        initial={{ scaleX: 0.1, opacity: 0.9 }} animate={{ scaleX: 1, opacity: op }} exit={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{ position:'absolute', left: pt.x - sz * 1.8, top: pt.y - 4,
          width: sz * 3.6, height: 8, borderRadius: '0 50% 50% 0', pointerEvents:'none',
          background: `linear-gradient(to right, transparent, ${color})`,
          filter: `drop-shadow(0 0 3px ${color})` }}
      />
    );
    return null;
  };

  const TRAIL_TABS: { id: TrailStyle; label: string }[] = [
    { id: 'dots',     label: '● Dots'     },
    { id: 'sparkles', label: '✦ Sparkle'  },
    { id: 'stars',    label: '★ Stars'    },
    { id: 'comet',    label: '— Comet'    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-1 justify-center flex-wrap">
        {TRAIL_TABS.map(tab => (
          <button key={tab.id} type="button" onClick={() => setTrailStyle(tab.id)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: trailStyle === tab.id ? 'rgba(77,143,200,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${trailStyle === tab.id ? 'rgba(77,143,200,0.45)' : 'rgba(255,255,255,0.07)'}`,
              color: trailStyle === tab.id ? '#7eb8e8' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
            }}
          >{tab.label}</button>
        ))}
      </div>
      <div
        ref={containerRef}
        onMouseMove={onMove} onMouseLeave={onLeave}
        className="relative w-full rounded-lg overflow-hidden select-none"
        style={{ height: 88, background: 'rgba(0,0,0,0.22)', cursor: 'crosshair', border: '1px dashed rgba(255,255,255,0.07)' }}
      >
        <p className="absolute text-[10px] font-semibold tracking-widest pointer-events-none" style={{ color: 'rgba(255,255,255,0.11)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap' }}>
          MOVE CURSOR
        </p>
        <AnimatePresence>
          {trail.map((pt, i) => renderParticle(pt, i))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// PAGE DATA
// ═══════════════════════════════════════════════════════

const SECTIONS = [
  {
    number: '01', title: 'Entrance & Exit', accent: '#4d8fc8',
    subtitle: 'How elements arrive and leave — the first impression and final word of every UI moment.',
    items: [
      { title: 'Entrance Director',  description: 'Six named entrance variants — slide, drop, pop, flip, blur-in and skew. Click any preset to swap the active transition live with AnimatePresence mode="wait".',              useCase: 'Page transitions / modals',       C: EntranceDirector },
      { title: 'Crossfade Text',     description: 'Words swap with a blur-fade crossfade. Each cycle picks a new colour. The outgoing word exits upward while the incoming one enters from below.',                         useCase: 'Hero headlines / taglines',       C: CrossfadeText    },
      { title: 'Presence List',      description: 'Items enter with a spring pop from above and exit with a rightward scale-slide. The list reflows with layout animation between adds and removes.',                       useCase: 'Task lists / notifications',      C: PresenceList     },
      { title: 'Staggered Dot Grid', description: '25 dots cascade diagonally using summed row+col index for delay. Each dot springs in with scale from zero. Hit replay to re-trigger the entrance.',                     useCase: 'Loading screens / data grids',    C: DotGrid          },
    ],
  },
  {
    number: '02', title: 'Physics & Spring', accent: '#a78bfa',
    subtitle: 'Stiffness, damping, inertia — real-world feel through spring simulation.',
    items: [
      { title: 'Elastic Drag',   description: 'A constrained draggable box with 0.3 elasticity. It stretches past its boundary and snaps back with spring physics. Try tossing it hard.',                              useCase: 'Cards / drawers / sliders',     C: ElasticDrag   },
      { title: 'Spring Chain',   description: 'Five balls drop in sequence, each with progressively lower stiffness. The trail softens toward the tail, mimicking a weighted chain.',                                    useCase: 'Chained list animations',       C: SpringChain   },
      { title: 'Inertia Puck',   description: 'A physics puck constrained to a track. Flick it by dragging fast — it carries momentum and settles back to rest via spring damping.',                                    useCase: 'Sliders / carousels',           C: InertiaPuck   },
      { title: 'Spring Gravity', description: 'Balls fall from above with shared spring damping but adjustable stiffness. Drag the slider to see how higher stiffness creates a sharper, bouncier landing.',             useCase: 'Introductory animations',       C: GravityBalls  },
    ],
  },
  {
    number: '03', title: 'Keyframe Choreography', accent: '#34d399',
    subtitle: 'Multi-step sequences — colour, shape, and rhythm composited into one continuous motion.',
    items: [
      { title: 'Shape Morph Loader', description: 'A single div cycles through borderRadius, rotation, scale, and gradient simultaneously using a 4-keyframe loop. Shape, colour, and spin all choreographed together.',  useCase: 'Loading states / brand moments', C: MorphLoader       },
      { title: 'Heartbeat Wave',     description: 'An SVG stroke dashoffset animation draws a heartbeat ECG line end-to-end on repeat. Pause to flatline. Uses Framer animate() for imperative control.',                useCase: 'Health / monitoring dashboards', C: HeartbeatWave     },
      { title: 'EQ Bars',            description: '18 bars animate scaleY with phase-shifted delays and durations, producing a flowing equaliser effect. Each bar gets a unique hue from a hsl progression.',            useCase: 'Audio players / data viz',       C: EqBars            },
      { title: 'Animated Counter',   description: 'A numeric value interpolates smoothly to any target using a custom ease curve. useTransform rounds a motion value for display. Tap any target number.',               useCase: 'Dashboards / stats widgets',     C: AnimatedCounter   },
    ],
  },
  {
    number: '04', title: 'Orchestration & Layout', accent: '#fb923c',
    subtitle: 'Coordinating multiple elements — stagger, layout morphing, and gesture-driven composition.',
    items: [
      { title: 'Word Reveal',    description: 'A sentence splits into tokens, each fading and rising with a 90ms stagger and blur-fade. New sentences swap in with a new key, resetting the entire cascade.',          useCase: 'Onboarding copy / hero sections', C: WordReveal    },
      { title: 'Card Deal',      description: 'Five stacked cards fan outward from a single pile using spring-staggered x/y/rotate animation. Hit Deal to collapse and re-deal the spread.',                           useCase: 'Game UI / galleries / portfolios', C: CardDeal      },
      { title: 'Layout Switch',  description: 'Grid and list views share the same elements — Framer\'s layout prop morphs positions and dimensions between the two configurations with spring physics.',                 useCase: 'Collection views / file browsers', C: LayoutSwitch  },
      { title: 'Gesture Trail',  description: 'Mouse movement leaves a particle trail in 4 switchable styles — dots, sparkles (✦), stars (★), and comets. Switch mode to see the same cursor path rendered differently.',     useCase: 'Creative tools / drawing UIs',     C: GestureTrail  },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

const TwoDAnimations: React.FC = () => (
  <div className="min-h-screen" style={{ background: '#06080f', color: '#e4eaf0' }}>

    {/* Hero */}
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 0% 0%, rgba(77,143,200,0.1) 0%, transparent 65%)' }}
      />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>
            Playground / Animations
          </p>
          <h1 className="mb-3 leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            2D Animations
          </h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.36)' }}>
            16 fully interactive animation demos across entrance/exit timing, real spring physics, keyframe choreography, and multi-element orchestration. Built with Framer Motion — everything is live.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-2 mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}
        >
          {['4 categories', '16 demos', 'Framer Motion', 'All interactive', 'Spring physics'].map(tag => (
            <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.4)' }}
            >{tag}</span>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Sections */}
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-16">
      {SECTIONS.map(section => (
        <motion.div key={section.number}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader number={section.number} title={section.title} subtitle={section.subtitle} accent={section.accent} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.items.map(item => (
              <ShowcaseCard key={item.title} title={item.title} description={item.description} useCase={item.useCase}>
                <item.C />
              </ShowcaseCard>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default TwoDAnimations;
