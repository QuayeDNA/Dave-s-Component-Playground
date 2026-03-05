import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Heart, Bookmark, Star, ArrowRight, MessageSquare,
  Clock, Eye, CheckCircle2, MoreHorizontal, Zap,
  TrendingUp, Users, Check, ChevronDown,
} from 'lucide-react';

// ── Shared chrome ──────────────────────────────────────

interface CardProps { title: string; description: string; useCase: string; children: React.ReactNode; }
const ShowcaseCard: React.FC<CardProps> = ({ title, description, useCase, children }) => (
  <div className="rounded-xl flex flex-col" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div className="mx-5 my-3 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)', minHeight: 180, padding: '2rem 1.5rem' }}>
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
// SECTION 1 — MOTION & PERSPECTIVE
// ═══════════════════════════════════════════════════════

// 1 · 3D Tilt Card
const TiltCard: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-1, 1], [12, -12]), { stiffness: 200, damping: 22 });
  const ry = useSpring(useTransform(x, [-1, 1], [-12, 12]), { stiffness: 200, damping: 22 });
  const glare = useMotionValue(0);
  const glareOpacity = useSpring(glare, { stiffness: 200, damping: 22 });

  const move = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    glare.set(0.18);
  }, [x, y, glare]);
  const reset = () => { x.set(0); y.set(0); glare.set(0); };

  return (
    <div style={{ perspective: 800 }} onMouseMove={move} onMouseLeave={reset} ref={ref}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative rounded-2xl overflow-hidden w-52"
        whileHover={{ scale: 1.02 }}>
        <div style={{ background: 'linear-gradient(135deg,#1a2e4a 0%,#0e1e32 100%)', padding: '20px', borderRadius: 16, border: '1px solid rgba(77,143,200,0.2)' }}>
          <div className="flex justify-between items-start mb-4">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#4d8fc8,#7eb8e8)' }} />
            <Zap size={16} style={{ color: '#7eb8e8', opacity: 0.7 }} />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">3D Tilt Card</h4>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Move mouse over me</p>
          <div className="mt-4 flex gap-1.5">
            {['React', 'Framer'].map(t => (
              <span key={t} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(77,143,200,0.15)', color: '#7eb8e8' }}>{t}</span>
            ))}
          </div>
        </div>
        {/* Glare overlay */}
        <motion.div style={{ opacity: glareOpacity, position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.15), transparent 70%)', borderRadius: 16, pointerEvents: 'none' }} />
      </motion.div>
    </div>
  );
};

// 2 · Flip Card
const FlipCard: React.FC = () => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: 900, cursor: 'pointer' }} onClick={() => setFlipped(f => !f)}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: 180, height: 160, position: 'relative', transformStyle: 'preserve-3d' }}>
        {/* Front */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#1e3a5f,#0f2640)', borderRadius: 16, padding: 16, border: '1px solid rgba(77,143,200,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(77,143,200,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={18} style={{ color: '#7eb8e8' }} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Featured Project</p>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Click to reveal details →</p>
          </div>
        </div>
        {/* Back */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#2a1f5e,#1a1240)', borderRadius: 16, padding: 16, border: '1px solid rgba(167,139,250,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p className="text-[10px] font-semibold" style={{ color: '#a78bfa' }}>PROJECT DETAILS</p>
          <div className="space-y-1">
            {['12.4k stars', '340 forks', 'MIT license'].map(s => (
              <div key={s} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Check size={9} style={{ color: '#a78bfa' }} /> {s}
              </div>
            ))}
          </div>
          <motion.button type="button" whileTap={{ scale: 0.95 }}
            className="w-full py-1.5 rounded-lg text-[10px] font-bold text-white"
            style={{ background: '#a78bfa', border: 'none', cursor: 'pointer' }}>View Repo</motion.button>
        </div>
      </motion.div>
      <p className="text-[10px] text-center mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Click to flip</p>
    </div>
  );
};

// 3 · Spotlight / Cursor Glow Card
const SpotlightCard: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const move = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div ref={ref} onMouseMove={move} className="relative rounded-2xl overflow-hidden w-52 cursor-default select-none"
      style={{ background: '#0d1520', border: '1px solid rgba(255,255,255,0.07)', padding: 20 }}>
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ background: `radial-gradient(circle 100px at ${pos.x}% ${pos.y}%, rgba(77,143,200,0.18) 0%, transparent 70%)`, borderRadius: 16 }} />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#4d8fc8', opacity: 0.6 }}>Analytics</p>
          <TrendingUp size={14} style={{ color: '#34d399' }} />
        </div>
        <p className="text-2xl font-black text-white mb-0.5">8,421</p>
        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Monthly visitors</p>
        <div className="mt-4 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full" style={{ width: '68%', background: 'linear-gradient(90deg,#4d8fc8,#34d399)' }} />
        </div>
        <div className="mt-2 flex justify-between text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <span>0</span><span>+23% MoM</span>
        </div>
      </div>
      <p className="text-[9px] text-center mt-3" style={{ color: 'rgba(255,255,255,0.15)', position: 'relative', zIndex: 10 }}>Move cursor over card</p>
    </div>
  );
};

// 4 · Magnetic Spring Card
const MagneticCard: React.FC = () => {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 14 });
  const springY = useSpring(y, { stiffness: 120, damping: 14 });
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.18);
    y.set((e.clientY - r.top - r.height / 2) * 0.18);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={reset} style={{ cursor: 'default' }}>
      <motion.div style={{ x: springX, y: springY }}
        className="rounded-2xl overflow-hidden" whileHover={{ scale: 1.04 }}
        transition={{ scale: { type: 'spring', stiffness: 200, damping: 20 } }}>
        <div style={{ background: 'linear-gradient(135deg,#1a3320,#0d1f14)', padding: '18px 20px', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 16, width: 200 }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={14} style={{ color: '#34d399' }} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Team Pulse</p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Live status</p>
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: `hsl(${150 + i * 20}, 60%, ${45 + i * 5}%)`, border: '1.5px solid #0d1f14', marginLeft: i > 0 ? -6 : 0, position: 'relative', zIndex: 5 - i }} />
            ))}
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '1.5px solid rgba(52,211,153,0.3)', marginLeft: -6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-[8px] font-bold" style={{ color: '#34d399' }}>+9</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>14 active now</p>
          </div>
        </div>
      </motion.div>
      <p className="text-[9px] text-center mt-2" style={{ color: 'rgba(255,255,255,0.15)' }}>Magnetically follows cursor</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 2 — CONTENT PATTERNS
// ═══════════════════════════════════════════════════════

// 5 · Article Card
const ArticleCard: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="rounded-2xl overflow-hidden cursor-pointer" style={{ background: '#0e1823', border: '1px solid rgba(255,255,255,0.07)', width: 220 }}>
      {/* Image placeholder */}
      <div style={{ height: 80, background: 'linear-gradient(135deg,#1a3a5c 0%,#4d8fc8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-2xl">🌊</span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(77,143,200,0.15)', color: '#7eb8e8' }}>Design</span>
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>· 4 min read</span>
        </div>
        <p className="text-xs font-bold leading-snug text-white mb-2">Building fluid motion systems with Framer</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#4d8fc8,#7eb8e8)' }} />
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Dave</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button type="button" whileTap={{ scale: 0.8 }} onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Heart size={13} fill={liked ? '#f87171' : 'none'} style={{ color: liked ? '#f87171' : 'rgba(255,255,255,0.25)' }} />
            </motion.button>
            <motion.button type="button" whileTap={{ scale: 0.8 }} onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Bookmark size={13} fill={saved ? '#7eb8e8' : 'none'} style={{ color: saved ? '#7eb8e8' : 'rgba(255,255,255,0.25)' }} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 6 · Profile Card
const ProfileCard: React.FC = () => {
  const [following, setFollowing] = useState(false);
  const stats = [{ label: 'Posts', value: '142' }, { label: 'Followers', value: '8.2k' }, { label: 'Following', value: '311' }];

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="rounded-2xl overflow-hidden text-center" style={{ background: '#0e1823', border: '1px solid rgba(255,255,255,0.07)', width: 200, padding: '20px 16px' }}>
      <div className="relative inline-block mb-3">
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#4d8fc8,#34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto' }}>
          👩‍💻
        </div>
        <span style={{ position: 'absolute', bottom: 2, right: 2, width: 11, height: 11, borderRadius: '50%', background: '#34d399', border: '2px solid #0e1823' }} />
      </div>
      <p className="text-sm font-bold text-white">Sarah Chen</p>
      <p className="text-[10px] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>@sarahdev · Design Engineer</p>
      <div className="flex justify-around mb-4">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-black text-white">{s.value}</p>
            <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
          </div>
        ))}
      </div>
      <motion.button type="button" onClick={() => setFollowing(f => !f)} whileTap={{ scale: 0.94 }}
        animate={{ backgroundColor: following ? 'rgba(77,143,200,0.12)' : '#4d8fc8' }}
        className="w-full py-1.5 rounded-full text-xs font-bold"
        style={{ border: following ? '1px solid rgba(77,143,200,0.4)' : 'none', color: following ? '#7eb8e8' : '#fff', cursor: 'pointer' }}>
        {following ? 'Following ✓' : 'Follow'}
      </motion.button>
    </motion.div>
  );
};

// 7 · Testimonial with expand
const TestimonialCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const short = '"The animation system completely changed how I think about micro-interactions."';
  const full = '"The animation system completely changed how I think about micro-interactions. Every detail, from the spring physics to the stagger timing, feels intentional. This is the best component library I\'ve ever used."';

  return (
    <motion.div className="rounded-2xl" style={{ background: '#0e1823', border: '1px solid rgba(255,255,255,0.07)', padding: '18px', width: 220 }}>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
      </div>
      <AnimatePresence initial={false}>
        <motion.p className="text-[11px] leading-relaxed italic mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}
          animate={{ height: expanded ? 'auto' : 'auto' }}>
          {expanded ? full : short}
        </motion.p>
      </AnimatePresence>
      <button type="button" onClick={() => setExpanded(e => !e)}
        className="text-[9px] font-semibold mb-3 flex items-center gap-0.5"
        style={{ color: '#7eb8e8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        {expanded ? 'Show less' : 'Read more'} <ChevronDown size={9} style={{ transform: expanded ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
      </button>
      <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#a78bfa,#4d8fc8)' }} />
        <div>
          <p className="text-[11px] font-bold text-white">Alex R.</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Senior Engineer, Vercel</p>
        </div>
      </div>
    </motion.div>
  );
};

// 8 · Horizontal Media Card
const HorizontalMediaCard: React.FC = () => (
  <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    className="flex gap-3 rounded-2xl overflow-hidden cursor-pointer" style={{ background: '#0e1823', border: '1px solid rgba(255,255,255,0.07)', padding: 12, width: 280, maxWidth: '100%' }}>
    <div style={{ width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(135deg,#2a1f5e,#4d2070)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
      🎨
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-white truncate">Design Systems Deep Dive</p>
      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>A comprehensive guide to building scalable token systems</p>
      <div className="flex items-center gap-3 mt-2">
        <span className="flex items-center gap-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}><Eye size={9} />2.1k</span>
        <span className="flex items-center gap-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}><MessageSquare size={9} />47</span>
        <span className="flex items-center gap-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}><Clock size={9} />6m</span>
      </div>
    </div>
    <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.15)', alignSelf: 'center', flexShrink: 0 }} />
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// SECTION 3 — DATA & DASHBOARD
// ═══════════════════════════════════════════════════════

// 9 · Animated stat counter
const AnimatedStat: React.FC<{ to: number; label: string; prefix?: string; suffix?: string; color: string }> = ({ to, label, prefix = '', suffix = '', color }) => {
  const [val, setVal] = useState(0);
  const inView = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !inView.current) {
        inView.current = true;
        const dur = 1200; const start = Date.now();
        const tick = () => {
          const t = Math.min((Date.now() - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(ease * to));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-xl font-black tabular-nums" style={{ color, fontFamily: 'monospace' }}>{prefix}{val.toLocaleString()}{suffix}</p>
      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
    </div>
  );
};

const StatsCard: React.FC = () => (
  <div className="rounded-2xl p-5" style={{ background: '#0e1823', border: '1px solid rgba(255,255,255,0.07)', width: 260, maxWidth: '100%' }}>
    <div className="flex items-center justify-between mb-4">
      <p className="text-xs font-bold text-white">Revenue Overview</p>
      <TrendingUp size={14} style={{ color: '#34d399' }} />
    </div>
    <div className="grid grid-cols-3 gap-2 mb-4">
      <AnimatedStat to={84200} label="Revenue" prefix="$" color="#34d399" />
      <AnimatedStat to={3241}  label="Orders"              color="#7eb8e8" />
      <AnimatedStat to={98}    label="Satisfied" suffix="%" color="#a78bfa" />
    </div>
    <div className="flex gap-1 mt-1">
      {[40, 60, 50, 75, 55, 80, 70, 90, 65, 85, 72, 95].map((h, i) => (
        <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h * 0.46}px` }} viewport={{ once: true }}
          transition={{ delay: i * 0.035, type: 'spring', stiffness: 260, damping: 22 }}
          style={{ flex: 1, background: `rgba(52,211,153,${0.25 + (h / 100) * 0.55})`, borderRadius: 2, minWidth: 0 }} />
      ))}
    </div>
  </div>
);

// 10 · Kanban Task Card
const KanbanCard: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Design token audit', done: true },
    { id: 2, label: 'Build component API', done: true },
    { id: 3, label: 'Write documentation', done: false },
    { id: 4, label: 'Publish to registry', done: false },
  ]);
  const done = tasks.filter(t => t.done).length;
  const pct = (done / tasks.length) * 100;

  return (
    <div className="rounded-2xl p-4" style={{ background: '#0e1823', border: '1px solid rgba(255,255,255,0.07)', width: 230 }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>In Progress</span>
        <MoreHorizontal size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
      </div>
      <p className="text-sm font-bold text-white mb-4">Component Library v2</p>
      <div className="space-y-1.5 mb-3">
        {tasks.map(task => (
          <motion.div key={task.id} layout className="flex items-center gap-2 cursor-pointer group" onClick={() => setTasks(ts => ts.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}>
            <motion.div animate={{ backgroundColor: task.done ? '#34d399' : 'transparent', borderColor: task.done ? '#34d399' : 'rgba(255,255,255,0.2)' }}
              className="w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0">
              {task.done && <Check size={7} style={{ color: '#0d1f14' }} />}
            </motion.div>
            <span className="text-[11px] transition-colors" style={{ color: task.done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.65)', textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.label}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#34d399' : '#7eb8e8' }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>
        <span className="text-[10px] tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>{done}/{tasks.length}</span>
      </div>
    </div>
  );
};

// 11 · Pricing Card
const PricingCard: React.FC = () => {
  const [annual, setAnnual] = useState(true);
  const price = annual ? 12 : 18;

  return (
    <div className="rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#1a2e4a 0%,#0d1a2e 100%)', border: '1px solid rgba(77,143,200,0.25)', width: 210, padding: '18px 16px' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(77,143,200,0.08)', pointerEvents: 'none' }} />
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold" style={{ color: '#7eb8e8' }}>Pro Plan</span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'linear-gradient(90deg,#4d8fc8,#7eb8e8)', color: '#fff' }}>Popular</span>
      </div>
      <div className="flex items-baseline gap-1 my-3">
        <AnimatePresence mode="wait">
          <motion.span key={price} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
            className="text-3xl font-black text-white" style={{ fontFamily: 'monospace' }}>${price}</motion.span>
        </AnimatePresence>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>/mo</span>
      </div>
      <div className="space-y-1.5 mb-4">
        {['Unlimited projects', 'Priority support', 'Custom domains', 'Analytics'].map(f => (
          <div key={f} className="flex items-center gap-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <CheckCircle2 size={10} style={{ color: '#34d399' }} /> {f}
          </div>
        ))}
      </div>
      <motion.button type="button" whileTap={{ scale: 0.96 }}
        className="w-full py-2 rounded-xl text-xs font-bold text-white mb-3"
        style={{ background: 'linear-gradient(90deg,#4d8fc8,#7eb8e8)', border: 'none', cursor: 'pointer' }}>
        Get Started
      </motion.button>
      <div className="flex items-center justify-center gap-2 text-[9px]">
        <span style={{ color: annual ? '#fff' : 'rgba(255,255,255,0.3)' }}>Annual</span>
        <motion.div onClick={() => setAnnual(a => !a)} animate={{ backgroundColor: annual ? '#4d8fc8' : 'rgba(255,255,255,0.1)' }}
          className="relative rounded-full cursor-pointer" style={{ width: 28, height: 16, border: 'none' }}>
          <motion.div animate={{ x: annual ? 2 : 14 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            style={{ position: 'absolute', top: 2, width: 12, height: 12, borderRadius: '50%', background: '#fff' }} />
        </motion.div>
        <span style={{ color: !annual ? '#fff' : 'rgba(255,255,255,0.3)' }}>Monthly</span>
      </div>
    </div>
  );
};

// 12 · Activity/Streak Calendar
const ActivityCard: React.FC = () => {
  const weeks = 13; const days = 7;
  const data = Array.from({ length: weeks * days }, () => Math.random());
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="rounded-2xl p-4" style={{ background: '#0e1823', border: '1px solid rgba(255,255,255,0.07)', width: 260, maxWidth: '100%' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-white">Contribution Graph</p>
        <span className="text-[10px] font-semibold" style={{ color: '#34d399' }}>↑ 18% this week</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: weeks }).map((_, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, di) => {
              const idx = wi * days + di;
              const v = data[idx];
              const bg = v < 0.2 ? 'rgba(255,255,255,0.04)' : v < 0.5 ? 'rgba(52,211,153,0.25)' : v < 0.8 ? 'rgba(52,211,153,0.55)' : '#34d399';
              return (
                <motion.div key={di} onHoverStart={() => setHovered(idx)} onHoverEnd={() => setHovered(null)}
                  animate={{ scale: hovered === idx ? 1.4 : 1 }}
                  style={{ width: 10, height: 10, borderRadius: 2, background: bg, cursor: 'default' }} />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-[9px] mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>Last 91 days · 1,204 contributions</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 4 — STYLE LAB
// ═══════════════════════════════════════════════════════

// 13 · Glass / Frosted
const GlassCard: React.FC = () => (
  <div className="relative rounded-2xl overflow-visible" style={{ width: 220, height: 130 }}>
    {/* Blobs behind */}
    <div style={{ position: 'absolute', top: -10, left: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(77,143,200,0.35)', filter: 'blur(20px)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: -10, right: -10, width: 70, height: 70, borderRadius: '50%', background: 'rgba(167,139,250,0.3)', filter: 'blur(22px)', pointerEvents: 'none' }} />
    {/* Glass panel */}
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.14)', padding: '16px 18px' }}>
      <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Aurora Glass</p>
      <p className="text-base font-bold text-white">Frosted Panel</p>
      <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>backdrop-filter: blur(14px)</p>
      <div className="flex gap-1.5 mt-3">
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.14)' }}>
          <div style={{ width: '65%', height: '100%', borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>
    </div>
  </div>
);

// 14 · Gradient Border Shimmer
const GradientBorderCard: React.FC = () => {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAngle(a => (a + 1) % 360), 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', borderRadius: 18, padding: 2, background: `conic-gradient(from ${angle}deg, #4d8fc8, #a78bfa, #34d399, #fb923c, #4d8fc8)`, width: 220 }}>
      <div style={{ borderRadius: 16, background: '#0e1823', padding: '18px 16px' }}>
        <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Gradient Border</p>
        <p className="text-sm font-bold text-white mb-1">Animated Conic</p>
        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>conic-gradient rotates every frame via setInterval.</p>
        <div className="flex gap-2 mt-4 text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <span style={{ color: '#4d8fc8' }}>blue</span>·<span style={{ color: '#a78bfa' }}>purple</span>·<span style={{ color: '#34d399' }}>green</span>·<span style={{ color: '#fb923c' }}>orange</span>
        </div>
      </div>
    </div>
  );
};

// 15 · Neon Glow Card
const NeonCard: React.FC = () => {
  const [on, setOn] = useState(true);
  return (
    <motion.div onClick={() => setOn(o => !o)}
      animate={{ boxShadow: on ? '0 0 0 1px #ff2d78, 0 0 20px rgba(255,45,120,0.35), 0 0 60px rgba(255,45,120,0.12)' : '0 0 0 1px rgba(255,255,255,0.07)' }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl cursor-pointer" style={{ background: '#0a0010', padding: '18px 16px', width: 220, border: 'none' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: on ? '#ff2d78' : 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>NEON ACTIVE</span>
        <motion.div animate={{ backgroundColor: on ? '#ff2d78' : 'rgba(255,255,255,0.1)', boxShadow: on ? '0 0 8px #ff2d78' : 'none' }}
          style={{ width: 8, height: 8, borderRadius: '50%' }} />
      </div>
      <p className="text-lg font-black" style={{ color: on ? '#fff' : 'rgba(255,255,255,0.3)', textShadow: on ? '0 0 20px rgba(255,45,120,0.5)' : 'none', transition: 'all 0.3s' }}>
        NEON UI
      </p>
      <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Click to toggle glow</p>
      <div className="mt-4 flex gap-1">
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} animate={{ height: on ? 16 + Math.sin(i) * 8 : 4, backgroundColor: on ? '#ff2d78' : 'rgba(255,255,255,0.08)' }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            style={{ flex: 1, borderRadius: 2 }} />
        ))}
      </div>
    </motion.div>
  );
};

// 16 · Stacked depth card
const StackedCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const cards = ['#fb923c', '#a78bfa', '#4d8fc8'];
  return (
    <div className="relative" style={{ width: 200, height: 110 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {cards.map((color, i) => (
        <motion.div key={i} animate={{ y: hovered ? i * -14 : i * -5, x: i * 3, scale: 1 - i * 0.04, opacity: 1 - i * 0.15, zIndex: cards.length - i }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{ position: 'absolute', inset: 0, borderRadius: 14, background: i === 0 ? '#0e1823' : `${color}18`, border: `1px solid ${color}33`, padding: 14 }}>
          {i === 0 && (
            <>
              <p className="text-[10px] font-semibold" style={{ color, opacity: 0.7 }}>Stacked Cards</p>
              <p className="text-sm font-bold text-white mt-1">Depth Effect</p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Hover to fan out</p>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

const SECTIONS = [
  {
    number: '01', title: 'Motion & Perspective', accent: '#4d8fc8',
    subtitle: 'Cards with depth — 3D tilt, flipping, magnetic attraction, and cursor-tracked lighting.',
    items: [
      { title: '3D Tilt Card',       description: 'Cursor position drives rotateX/rotateY transforms via useMotionValue + useSpring. A subtle glare overlay shifts based on mouse angle.',                        useCase: 'Product cards, hero features',  Component: TiltCard      },
      { title: 'Flip Card',          description: 'Click to rotate 180° on the Y-axis with preserve-3d. Front shows a teaser; back reveals detailed information with a CTA.',                                  useCase: 'Flashcards, feature reveals',   Component: FlipCard      },
      { title: 'Spotlight / Glow',   description: 'Radial gradient spotlight tracks cursor position. The light bleeds through a dark card surface revealing hidden depth.',                                     useCase: 'Dashboard widgets, data cards', Component: SpotlightCard },
      { title: 'Magnetic Spring',    description: 'Spring physics make the whole card subtly follow the cursor. Combines useMotionValue + useSpring + layout motion for a satisfying pull effect.',             useCase: 'Team cards, call-to-action',    Component: MagneticCard  },
    ],
  },
  {
    number: '02', title: 'Content Patterns', accent: '#a78bfa',
    subtitle: 'Standard card layouts with interactive polish — hover lifts, like/save toggles, expanding text.',
    items: [
      { title: 'Article Card',         description: 'Vertical card with a hero image area, category pill, read-time, and like/bookmark icon buttons. Lifts off the page on hover with a spring.',               useCase: 'Blogs, news feeds',               Component: ArticleCard       },
      { title: 'Profile Card',         description: 'Social profile with a live-status avatar, three stat counters, and a Follow button that morphs between states with animated background change.',           useCase: 'User directories, social apps',   Component: ProfileCard       },
      { title: 'Testimonial Card',     description: 'Star rating, expandable quote with Chevron, and author attribution. Truncates long text with a "Read more" toggle.',                                      useCase: 'Landing pages, reviews',          Component: TestimonialCard   },
      { title: 'Horizontal Media',     description: 'Image left + content right layout with icon metadata row. Slides right on hover. Good for dense list views with rich thumbnail context.',                 useCase: 'Search results, playlists',       Component: HorizontalMediaCard },
    ],
  },
  {
    number: '03', title: 'Data & Dashboard', accent: '#34d399',
    subtitle: 'Information-dense cards — count-up stats, bar charts, kanban tasks, pricing, and contribution graphs.',
    items: [
      { title: 'Stats Card',        description: 'Three animated count-up metrics driven by IntersectionObserver — numbers ease in when the card enters view. Mini bar chart with spring-height bars.',        useCase: 'Analytics dashboards',         Component: StatsCard     },
      { title: 'Kanban Task Card',  description: 'Clickable subtask checklist with layout-animated checkmarks. Progress bar fills as tasks are completed. Transitions to green when all done.',              useCase: 'Project management UIs',       Component: KanbanCard    },
      { title: 'Pricing Card',      description: 'Annual/monthly toggle with AnimatePresence price morph. Popular badge, feature checklist with green checkmarks, gradient CTA button.',                    useCase: 'SaaS pricing pages',           Component: PricingCard   },
      { title: 'Contribution Graph','description': 'GitHub-style calendar grid with four intensity levels. Each cell scales up on hover. Summary stats shown below.',                                         useCase: 'Developer profiles, streaks',  Component: ActivityCard  },
    ],
  },
  {
    number: '04', title: 'Style Lab', accent: '#fb923c',
    subtitle: 'Visual effect cards — glassmorphism, rotating gradient borders, neon glow, and layered depth.',
    items: [
      { title: 'Aurora Glass Card',  description: 'Blurred colour blobs sit behind a frosted panel with backdrop-filter. Simulates the iOS-style glass morphism effect.',                                      useCase: 'Overlays, modals, HUDs',      Component: GlassCard          },
      { title: 'Gradient Border',    description: 'A conic-gradient wrapper rotates 360° in a requestAnimationFrame loop. The inner card stays dark, making the border appear to spin.',                   useCase: 'Featured items, promotions',  Component: GradientBorderCard },
      { title: 'Neon Glow Card',     description: 'Click to toggle a hot-pink neon box-shadow + text-shadow. EQ bars animate in when the card is "on". Inspired by cyberpunk UI.',                         useCase: 'Gaming UIs, dark dashboards', Component: NeonCard           },
      { title: 'Stacked Depth',      description: 'Three layered cards fanned out on hover with spring physics. Each layer has a different accent colour and decreased opacity for a depth sense.',          useCase: 'Collections, deck metaphors', Component: StackedCard        },
    ],
  },
];

const Cards: React.FC = () => (
  <div className="min-h-screen" style={{ background: '#06080f', color: '#e4eaf0' }}>
    {/* Hero */}
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 60% at 0% 0%, rgba(77,143,200,0.1) 0%, transparent 65%)' }} />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>Playground / UI Components</p>
          <h1 className="mb-3 leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Card Showcase</h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.36)' }}>16 card designs across four categories — 3D perspective, rich content layouts, data dashboards, and visual effects. All interactive, all built with Framer Motion.</p>
        </motion.div>
        <motion.div className="flex flex-wrap gap-2 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {['4 categories', '16 designs', 'Spring physics', 'Hover effects'].map(tag => (
            <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.4)' }}>{tag}</span>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Sections */}
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-16">
      {SECTIONS.map(section => (
        <motion.div key={section.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
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

export default Cards;
