import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Check, Copy, Heart, ShoppingCart, Download,
  Share2, Trash2, Loader2, X, Link, Send,
  ChevronRight, Sparkles, Zap,
} from 'lucide-react';

// ── Shared wrapper ────────────────────────────────────────────────

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
      className="mx-5 my-3 rounded-lg flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.3)', minHeight: 120, padding: '2rem 1rem' }}
    >
      {children}
    </div>
    <div className="px-5 pb-4 flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.16)' }}>use case</span>
      <span className="text-[11px]" style={{ color: '#4d8fc8', opacity: 0.75 }}>— {useCase}</span>
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

// ═══════════════════════════════════════════════════════
// SECTION 1 — STATE TRANSITIONS
// ═══════════════════════════════════════════════════════

// 1 · Morphing Submit
type SubmitState = 'idle' | 'loading' | 'success';
const MorphButton: React.FC = () => {
  const [state, setState] = useState<SubmitState>('idle');
  const handleClick = () => {
    if (state !== 'idle') return;
    setState('loading');
    setTimeout(() => { setState('success'); setTimeout(() => setState('idle'), 2200); }, 1800);
  };
  const cfg: Record<SubmitState, { bg: string; width: number }> = {
    idle:    { bg: '#4d8fc8', width: 152 },
    loading: { bg: '#3a7ab5', width: 52 },
    success: { bg: '#22c55e', width: 152 },
  };
  return (
    <motion.button
      type="button" onClick={handleClick}
      animate={{ width: cfg[state].width, backgroundColor: cfg[state].bg }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden flex items-center justify-center font-semibold text-sm text-white"
      style={{ height: 44, borderRadius: 999, border: 'none', cursor: state === 'idle' ? 'pointer' : 'default' }}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span key="i" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2 whitespace-nowrap">
            Submit Form <ChevronRight size={13} />
          </motion.span>
        )}
        {state === 'loading' && (
          <motion.span key="l" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Loader2 size={18} className="animate-spin" />
          </motion.span>
        )}
        {state === 'success' && (
          <motion.span key="s" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 whitespace-nowrap">
            <Check size={14} /> Submitted!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// 2 · Hold to Confirm
const HoldConfirmButton: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'holding' | 'done'>('idle');
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = useRef(false);

  const startHold = () => {
    if (done.current) return;
    setStatus('holding');
    ivRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(ivRef.current!);
          done.current = true;
          setStatus('done');
          setTimeout(() => { setProgress(0); setStatus('idle'); done.current = false; }, 2500);
          return 100;
        }
        return p + 3.5;
      });
    }, 50);
  };
  const stopHold = () => {
    if (done.current) return;
    clearInterval(ivRef.current!);
    setProgress(0);
    setStatus('idle');
  };

  return (
    <button
      type="button" onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
      onTouchStart={startHold} onTouchEnd={stopHold}
      className="relative overflow-hidden select-none text-sm font-semibold"
      style={{
        width: 180, height: 44, borderRadius: 8,
        background: status === 'done' ? '#ef4444' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${status === 'done' ? '#ef4444' : 'rgba(239,68,68,0.25)'}`,
        color: status === 'done' ? '#fff' : '#f87171',
        cursor: 'pointer',
      }}
    >
      <motion.div
        className="absolute left-0 top-0 h-full pointer-events-none"
        style={{ background: 'rgba(239,68,68,0.3)', originX: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
        {status === 'done' ? <><Check size={14} /> Deleted!</>
          : status === 'holding' ? <><Trash2 size={14} /> Hold… {Math.round(progress)}%</>
          : <><Trash2 size={14} /> Hold to Delete</>}
      </span>
    </button>
  );
};

// 3 · Like Counter
const LikeButton: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(142);
  const [burst, setBurst] = useState(false);

  const toggle = () => {
    const willLike = !liked;
    setLiked(willLike);
    setCount(c => willLike ? c + 1 : c - 1);
    if (willLike) { setBurst(true); setTimeout(() => setBurst(false), 600); }
  };

  return (
    <motion.button
      type="button" onClick={toggle} whileTap={{ scale: 0.85 }}
      className="relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
      style={{
        background: liked ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${liked ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.1)'}`,
        color: liked ? '#f87171' : 'rgba(255,255,255,0.55)', cursor: 'pointer',
      }}
    >
      <motion.span animate={{ scale: liked ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.3 }}>
        <Heart size={15} fill={liked ? '#f87171' : 'none'} stroke={liked ? '#f87171' : 'currentColor'} />
      </motion.span>
      <AnimatePresence mode="popLayout">
        <motion.span key={count}
          initial={{ y: liked ? -10 : 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={{ y: liked ? 10 : -10, opacity: 0 }} transition={{ duration: 0.18 }}
        >{count}</motion.span>
      </AnimatePresence>
      {burst && ([0, 60, 120, 180, 240, 300] as const).map((deg) => (
        <motion.span
          key={deg}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(deg * Math.PI / 180) * 22, y: Math.sin(deg * Math.PI / 180) * 22, opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: '#f87171', pointerEvents: 'none' }}
        />
      ))}
    </motion.button>
  );
};

// 4 · Download Progress
const DownloadButton: React.FC = () => {
  const [phase, setPhase] = useState<'idle' | 'prog' | 'done'>('idle');
  const [pct, setPct] = useState(0);

  const start = () => {
    if (phase !== 'idle') return;
    setPhase('prog');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) {
        clearInterval(iv); setPct(100); setPhase('done');
        setTimeout(() => { setPhase('idle'); setPct(0); }, 2500);
        return;
      }
      setPct(Math.min(p, 99));
    }, 120);
  };

  return (
    <motion.button
      type="button" onClick={start}
      whileHover={phase === 'idle' ? { borderColor: 'rgba(255,255,255,0.22)' } : {}}
      className="relative overflow-hidden font-semibold text-sm flex items-center justify-center"
      style={{
        width: 190, height: 44, borderRadius: 8,
        background: phase === 'done' ? '#22c55e' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${phase === 'done' ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
        color: phase === 'done' ? '#fff' : 'rgba(255,255,255,0.72)',
        cursor: phase === 'idle' ? 'pointer' : 'default',
      }}
    >
      {phase === 'prog' && (
        <motion.div
          className="absolute left-0 top-0 h-full pointer-events-none"
          style={{ background: 'rgba(77,143,200,0.28)', originX: 0 }}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.1 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {phase === 'idle' && <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Download size={14} /> Download File</motion.span>}
          {phase === 'prog' && <motion.span key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> {Math.round(pct)}%</motion.span>}
          {phase === 'done' && <motion.span key="d" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2"><Check size={14} /> Downloaded!</motion.span>}
        </AnimatePresence>
      </span>
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 2 — PHYSICS & MOTION
// ═══════════════════════════════════════════════════════

// 5 · Magnetic
const MagneticButton: React.FC = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 18 });
  const y = useSpring(my, { stiffness: 300, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.38);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.38);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.button
      ref={ref} type="button"
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
      className="px-7 py-3 font-semibold text-sm rounded-full text-white flex items-center gap-2"
      style={{ x, y, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', cursor: 'pointer', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
    >
      <Sparkles size={14} /> Magnetic Pull
    </motion.button>
  );
};

// 6 · Ripple
let _rid = 0;
const RippleButton: React.FC = () => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++_rid;
    setRipples(p => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples(p => p.filter(rr => rr.id !== id)), 700);
  };

  return (
    <button type="button" onClick={onClick}
      className="relative overflow-hidden px-8 py-3 font-semibold text-sm rounded-lg text-white"
      style={{ background: '#4d8fc8', border: 'none', cursor: 'pointer', minWidth: 160 }}
    >
      <span className="relative z-10">Click — Ripple</span>
      {ripples.map(r => (
        <motion.span key={r.id}
          initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{ position: 'absolute', left: r.x - 20, top: r.y - 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', pointerEvents: 'none' }}
        />
      ))}
    </button>
  );
};

// 7 · Spotlight
const SpotlightButton: React.FC = () => {
  const [pos, setPos] = useState({ x: '50%', y: '50%' });
  const [on, setOn] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
  };

  return (
    <button type="button"
      onMouseMove={onMove} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      className="relative overflow-hidden px-8 py-3 font-semibold text-sm rounded-lg text-white flex items-center gap-2"
      style={{
        background: on
          ? `radial-gradient(circle 90px at ${pos.x} ${pos.y}, rgba(255,255,255,0.11) 0%, transparent 75%), #0f1923`
          : '#0f1923',
        border: '1px solid rgba(255,255,255,0.09)',
        cursor: 'pointer', minWidth: 160, transition: 'background 0.04s',
      }}
    >
      <Zap size={13} style={{ opacity: 0.7 }} /> Spotlight
    </button>
  );
};

// 8 · Expand Actions
const ExpandButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const actions = [
    { Icon: Send,   color: '#4d8fc8', label: 'Send'  },
    { Icon: Copy,   color: '#a78bfa', label: 'Copy'  },
    { Icon: Share2, color: '#34d399', label: 'Share' },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ height: 56, width: 200 }}>
      <AnimatePresence>
        {open && actions.map((a, i) => (
          <motion.button
            key={a.label} type="button"
            initial={{ x: 0, opacity: 0, scale: 0.4 }}
            animate={{ x: (i - 1) * 60, opacity: 1, scale: 1 }}
            exit={{ x: 0, opacity: 0, scale: 0.4 }}
            transition={{ delay: i * 0.045, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(false)}
            className="absolute flex items-center justify-center rounded-full text-white"
            style={{ width: 44, height: 44, background: a.color, border: 'none', cursor: 'pointer', boxShadow: `0 4px 16px ${a.color}55` }}
          >
            <a.Icon size={14} />
          </motion.button>
        ))}
      </AnimatePresence>
      <motion.button
        type="button" onClick={() => setOpen(v => !v)}
        animate={{ rotate: open ? 45 : 0, backgroundColor: open ? '#ef4444' : '#4d8fc8' }}
        transition={{ duration: 0.22 }}
        className="relative z-10 flex items-center justify-center rounded-full text-white font-bold"
        style={{ width: 44, height: 44, border: 'none', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}
      >
        +
      </motion.button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 3 — STYLE LAB
// ═══════════════════════════════════════════════════════

// 9 · Neon Glow
const NeonButton: React.FC = () => (
  <motion.button
    type="button"
    animate={{ boxShadow: ['0 0 0 1px rgba(0,229,255,0.35), 0 0 12px rgba(0,229,255,0.22)', '0 0 0 1px rgba(0,229,255,0.7), 0 0 24px rgba(0,229,255,0.48)', '0 0 0 1px rgba(0,229,255,0.35), 0 0 12px rgba(0,229,255,0.22)'] }}
    whileHover={{ boxShadow: '0 0 0 2px #00e5ff, 0 0 36px rgba(0,229,255,0.6)' }}
    transition={{ boxShadow: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
    className="px-8 py-3 font-bold tracking-widest text-sm rounded-lg"
    style={{ background: 'transparent', border: '1px solid rgba(0,229,255,0.45)', color: '#00e5ff', cursor: 'pointer', letterSpacing: '0.15em', fontFamily: 'monospace' }}
  >
    ● ONLINE
  </motion.button>
);

// 10 · Liquid Fill
const LiquidFillButton: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      type="button"
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden px-8 py-3 font-semibold text-sm rounded-lg"
      style={{
        background: 'transparent', border: '1px solid rgba(77,143,200,0.35)',
        color: hovered ? '#fff' : '#4d8fc8',
        transition: 'color 0.15s 0.12s',
        cursor: 'pointer', minWidth: 160,
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: 'linear-gradient(180deg, #7eb8e8, #4d8fc8)', transformOrigin: 'bottom' }}
      />
      <span className="relative z-10">Hover to Fill</span>
    </motion.button>
  );
};

// 11 · 3D Press
const ThreeDButton: React.FC = () => (
  <motion.button
    type="button"
    whileHover={{ y: -2, boxShadow: '0 9px 0 #1e4f80, 0 11px 14px rgba(0,0,0,0.4)' }}
    whileTap={{ y: 6, boxShadow: '0 0px 0 #1e4f80, 0 2px 8px rgba(0,0,0,0.35)', transition: { duration: 0.07 } }}
    className="px-8 py-3 font-bold text-sm rounded-lg text-white select-none"
    style={{ background: 'linear-gradient(180deg, #5a9fd4 0%, #3a7eb8 100%)', boxShadow: '0 6px 0 #1e4f80, 0 8px 12px rgba(0,0,0,0.35)', border: 'none', cursor: 'pointer' }}
  >
    Press Me
  </motion.button>
);

// 12 · Glitch
const GlitchButton: React.FC = () => {
  const [on, setOn] = useState(false);
  const label = 'EXECUTE';
  const base = { position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.2em', fontSize: '0.875rem' };

  return (
    <button type="button"
      onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      className="relative overflow-hidden px-8 py-3 font-black text-sm select-none"
      style={{ background: 'transparent', border: '1px solid rgba(255,0,80,0.4)', color: '#ff0050', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.2em', minWidth: 160 }}
    >
      <span className="relative z-10">{label}</span>
      {on && (
        <>
          <motion.span
            animate={{ x: [-3, 4, -2, 3, 0], opacity: [0.85, 0.85, 0.85, 0.85, 0] }}
            transition={{ duration: 0.32, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 0.25 }}
            style={{ ...base, color: '#00ffff', clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
          >{label}</motion.span>
          <motion.span
            animate={{ x: [3, -4, 2, -3, 0], opacity: [0.85, 0.85, 0.85, 0.85, 0] }}
            transition={{ duration: 0.32, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 0.25, delay: 0.07 }}
            style={{ ...base, color: '#ff0050', clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
          >{label}</motion.span>
        </>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 4 — SEMANTIC PATTERNS
// ═══════════════════════════════════════════════════════

// 13 · Copy to Clipboard
const CopyButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const text = 'npm install @dcp/ui';

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg max-w-xs w-full"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <code className="text-xs text-green-400 font-mono flex-1 truncate">{text}</code>
      <motion.button
        type="button" onClick={handleCopy} whileTap={{ scale: 0.9 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold shrink-0"
        style={{
          background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
          color: copied ? '#22c55e' : 'rgba(255,255,255,0.55)',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <AnimatePresence mode="wait">
          {copied
            ? <motion.span key="ok" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }} className="flex items-center gap-1"><Check size={11} /> Copied</motion.span>
            : <motion.span key="cp" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }} className="flex items-center gap-1"><Copy size={11} /> Copy</motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

// 14 · Add to Cart
const AddToCartButton: React.FC = () => {
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(false);

  const add = () => {
    setCount(c => c + 1);
    setBump(true);
    setTimeout(() => setBump(false), 350);
  };

  if (count === 0) {
    return (
      <motion.button type="button" onClick={add}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white"
        style={{ background: '#4d8fc8', border: 'none', cursor: 'pointer' }}
      >
        <ShoppingCart size={14} /> Add to Cart
      </motion.button>
    );
  }

  return (
    <div className="flex items-center rounded-full overflow-hidden" style={{ background: '#4d8fc8' }}>
      <button type="button" onClick={() => setCount(c => Math.max(0, c - 1))}
        className="flex items-center justify-center text-white font-bold"
        style={{ width: 44, height: 44, background: 'rgba(0,0,0,0.14)', border: 'none', cursor: 'pointer', fontSize: 20 }}
      >−</button>
      <motion.span
        animate={{ scale: bump ? 1.38 : 1 }} transition={{ type: 'spring', stiffness: 480, damping: 14 }}
        className="text-white font-bold text-sm px-5 tabular-nums"
        style={{ minWidth: 44, textAlign: 'center' }}
      >{count}</motion.span>
      <button type="button" onClick={add}
        className="flex items-center justify-center text-white font-bold"
        style={{ width: 44, height: 44, background: 'rgba(0,0,0,0.14)', border: 'none', cursor: 'pointer', fontSize: 20 }}
      >+</button>
    </div>
  );
};

// 15 · Danger Double-Confirm
const DangerButton: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (step === 0) {
      setStep(1);
      timerRef.current = setTimeout(() => setStep(0), 3500);
    } else if (step === 1) {
      clearTimeout(timerRef.current!);
      setStep(2);
      setTimeout(() => setStep(0), 2500);
    }
  };

  const btnBase = { border: 'none', cursor: 'pointer', borderRadius: 8 };
  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.button key="a" type="button" onClick={handleClick}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-sm"
          style={{ ...btnBase, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
        >
          <Trash2 size={14} /> Delete Account
        </motion.button>
      )}
      {step === 1 && (
        <motion.button key="b" type="button" onClick={handleClick}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 font-bold text-sm"
          style={{ ...btnBase, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5' }}
        >
          <X size={14} /> Really delete?
        </motion.button>
      )}
      {step === 2 && (
        <motion.button key="c" type="button"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 font-bold text-sm cursor-default"
          style={{ ...btnBase, background: '#ef4444', color: '#fff' }}
        >
          <Check size={14} /> Account Deleted
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// 16 · Share Expand
const ShareButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const opts = [
    { label: 'Link',    color: '#a78bfa', Icon: Link   },
    { label: 'Message', color: '#34d399', Icon: Send   },
    { label: 'Post',    color: '#4d8fc8', Icon: Share2 },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        type="button" onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm"
        style={{
          background: open ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
          color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
        }}
      >
        <Share2 size={13} /> Share
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="flex gap-2 overflow-hidden"
          >
            {opts.map(({ label, color, Icon }, i) => (
              <motion.button key={label} type="button"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold"
                style={{ background: `${color}14`, border: `1px solid ${color}28`, color, cursor: 'pointer', minWidth: 66 }}
              >
                <Icon size={14} /> {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// PAGE DATA
// ═══════════════════════════════════════════════════════

const SECTIONS = [
  {
    number: '01', title: 'State Transitions', accent: '#4d8fc8',
    subtitle: 'Buttons that communicate what\'s happening — feedback at every step.',
    items: [
      { title: 'Morphing Submit',   description: 'Transitions through idle → loading → success with width and background morphing. The button becomes a spinner, then a confirmation.',            useCase: 'Form submission',          Component: MorphButton        },
      { title: 'Hold to Confirm',   description: 'Progress fills as you hold. Release early to cancel. Prevents accidental destructive actions with a visible commitment gesture.',               useCase: 'Irreversible actions',     Component: HoldConfirmButton  },
      { title: 'Like Counter',      description: 'Toggle with spring-animated count change and particle burst on activation. Each click animates the number in the direction of change.',        useCase: 'Social reactions',         Component: LikeButton         },
      { title: 'Download Progress', description: 'Simulates download with a live fill bar and percentage counter, then fades into a success confirmation. Resets automatically.',                useCase: 'File downloads',           Component: DownloadButton     },
    ],
  },
  {
    number: '02', title: 'Physics & Motion', accent: '#a78bfa',
    subtitle: 'Buttons that feel alive — spring physics, cursor tracking, and real-time interaction.',
    items: [
      { title: 'Magnetic Pull',   description: 'Tracks cursor proximity and pulls toward it with spring physics. The button sticks to your cursor, creating a satisfying hover destination.',    useCase: 'Hero CTAs',              Component: MagneticButton },
      { title: 'Ripple Click',    description: 'Emits a ripple wave emanating from the exact click point. Multiple ripples stack and dissipate independently via Framer Motion.',               useCase: 'Action confirmation',    Component: RippleButton   },
      { title: 'Cursor Spotlight','description': 'A hidden light source follows the cursor across the button surface in real-time, revealing a soft glow and implied depth beneath.',             useCase: 'Dark UI exploration',    Component: SpotlightButton },
      { title: 'Expand Actions',  description: 'A single + button fans out into a set of action buttons using spring-staggered animations. Hides complexity until the user opts in.',           useCase: 'Contextual menus',       Component: ExpandButton   },
    ],
  },
  {
    number: '03', title: 'Style Lab', accent: '#34d399',
    subtitle: 'Pure aesthetic experimentation — each with a distinct visual personality.',
    items: [
      { title: 'Neon Pulse',    description: 'A continuously pulsing outer glow with a cyan border. The ambient animation communicates "live" status without text.',                          useCase: 'Status / live indicators', Component: NeonButton      },
      { title: 'Liquid Fill',  description: 'Colored liquid rises from the bottom on hover with a smooth ease curve. The text color inverts as the fill passes through it.',                 useCase: 'Navigation / CTA',         Component: LiquidFillButton },
      { title: '3D Press',     description: 'Simulates a physical button with depth — a box-shadow bottom edge that compresses on press and springs back on release.',                       useCase: 'Game UI / tactile feel',   Component: ThreeDButton    },
      { title: 'Glitch Effect','description': 'Chromatic aberration effect — red/cyan clipped layers offset horizontally and loop on hover. A cyberpunk or hacker terminal aesthetic.',        useCase: 'Gaming / tech branding',   Component: GlitchButton    },
    ],
  },
  {
    number: '04', title: 'Semantic Patterns', accent: '#fb923c',
    subtitle: 'Purpose-built interactions — each solves a specific UX problem cleanly.',
    items: [
      { title: 'Copy to Clipboard', description: 'Displays a code snippet with an inline copy trigger. Icon morphs from Copy → Check with a green tint confirmation, then resets.',        useCase: 'Code snippets / tokens',        Component: CopyButton    },
      { title: 'Add to Cart',       description: 'Zero-state CTA transforms into a live quantity adjuster in one animation. No modal, no redirect — the cart context stays in view.',      useCase: 'E-commerce product pages',      Component: AddToCartButton },
      { title: 'Danger Confirm',    description: 'Two-step confirmation for destructive actions. Auto-resets if the second click is missed within 3.5 seconds.',                            useCase: 'Account deletion / data reset', Component: DangerButton  },
      { title: 'Share Expand',      description: 'A minimal share button that expands below into platform-specific options with per-service colour coding and stagger animation.',           useCase: 'Social / content sharing',      Component: ShareButton   },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

const Buttons: React.FC = () => (
  <div className="min-h-screen" style={{ background: '#06080f', color: '#e4eaf0' }}>

    {/* Hero */}
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 0% 0%, rgba(77,143,200,0.1) 0%, transparent 65%)' }}
      />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>
            Playground / UI Components
          </p>
          <h1 className="mb-3 leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Button Showcase
          </h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.36)' }}>
            16 unique interactive button designs across state transitions, physics, style experiments, and semantic UX patterns. All built with React + Framer Motion — try them out.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-2 mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}
        >
          {['4 categories', '16 buttons', 'Framer Motion', 'All interactive'].map(tag => (
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
                <item.Component />
              </ShowcaseCard>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Buttons;