import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ── Hero tag ──────────────────────────────────────────────────────────────────
const HeroTag: React.FC<{ label: string }> = ({ label }) => (
  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}>
    {label}
  </span>
);

// ── Showcase card ─────────────────────────────────────────────────────────────
interface CardProps { title: string; description: string; useCase: string; children: React.ReactNode; }
const ShowcaseCard: React.FC<CardProps> = ({ title, description, useCase, children }) => (
  <div className="rounded-xl flex flex-col"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div className="mx-5 my-3 rounded-lg overflow-hidden" style={{ height: 220, background: '#06080f' }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
    <div className="px-5 pb-4 flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.16)' }}>use case</span>
      <span className="text-[11px]" style={{ color: '#7eb8e8', opacity: 0.75 }}>— {useCase}</span>
    </div>
  </div>
);

// ── Section header ────────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ number: string; title: string; subtitle: string; accent: string }> = ({ number, title, subtitle, accent }) => (
  <div className="flex items-start gap-4 mb-7">
    <span className="text-[11px] font-black tabular-nums mt-1 shrink-0"
      style={{ color: accent, fontFamily: 'monospace', opacity: 0.55 }}>{number}</span>
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h2>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>{subtitle}</p>
    </div>
  </div>
);

// ── Demo: Basic Tween ─────────────────────────────────────────────────────────
const BasicTween: React.FC = () => (
  <motion.div
    animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
    transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
    style={{ width: 60, height: 60, background: '#f97316', borderRadius: 8 }}
  />
);

// ── Demo: Multi-property ──────────────────────────────────────────────────────
const MultiProperty: React.FC = () => (
  <motion.div
    animate={{ x: [-60, 60, -60], y: [-30, 30, -30], backgroundColor: ['#06b6d4', '#ec4899', '#8b5cf6'] }}
    transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
    style={{ width: 50, height: 50, borderRadius: '50%' }}
  />
);

// ── Demo: Easing showcase ─────────────────────────────────────────────────────
const EasingShowcase: React.FC = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <motion.div animate={{ y: [-40, 40, -40] }} transition={{ duration: 1.5, ease: 'easeIn', repeat: Infinity }}
      style={{ width: 12, height: 12, background: '#fbbf24', borderRadius: '50%' }} />
    <motion.div animate={{ y: [-40, 40, -40] }} transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
      style={{ width: 12, height: 12, background: '#34d399', borderRadius: '50%' }} />
    <motion.div animate={{ y: [-40, 40, -40] }} transition={{ duration: 1.5, ease: 'easeOut', repeat: Infinity }}
      style={{ width: 12, height: 12, background: '#60a5fa', borderRadius: '50%' }} />
    <motion.div animate={{ y: [-40, 40, -40] }} transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
      style={{ width: 12, height: 12, background: '#f472b6', borderRadius: '50%' }} />
  </div>
);

// ── Demo: Staggered sequence ──────────────────────────────────────────────────
const StaggeredSequence: React.FC = () => (
  <div style={{ display: 'flex', gap: 6 }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div key={i}
        animate={{ scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 16, height: 16, background: `hsl(${i * 60}, 70%, 60%)`, borderRadius: 4 }}
      />
    ))}
  </div>
);

// ── Demo: Path motion ─────────────────────────────────────────────────────────
const PathMotion: React.FC = () => (
  <motion.div
    animate={{ x: [-50, 50, -50], y: [-30, 30, -30], rotate: [0, 360, 0] }}
    transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
    style={{ width: 40, height: 40, background: '#a78bfa', borderRadius: '50%' }}
  />
);

// ── Demo: Spring physics ──────────────────────────────────────────────────────
const SpringPhysics: React.FC = () => (
  <motion.div
    animate={{ scale: 1, opacity: 1 }}
    initial={{ scale: 0, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0 }}
    onAnimationComplete={() => {}}
    style={{ width: 55, height: 55, background: '#34d399', borderRadius: '50%' }}
  />
);

// ── Demo: Bounce effect ───────────────────────────────────────────────────────
const BounceEffect: React.FC = () => (
  <motion.div
    animate={{ y: [-50, 0, -50] }}
    transition={{ duration: 1.5, ease: 'easeOut', repeat: Infinity }}
    style={{ width: 48, height: 48, background: '#fb923c', borderRadius: 6 }}
  />
);

// ── Demo: Color morph ─────────────────────────────────────────────────────────
const ColorMorph: React.FC = () => (
  <motion.div
    animate={{ backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6', '#3b82f6'] }}
    transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
    style={{ width: 60, height: 60, borderRadius: '50%' }}
  />
);

// ── Demo: Rotation morph ──────────────────────────────────────────────────────
const RotationMorph: React.FC = () => (
  <motion.div
    animate={{ rotate: [0, 90, 180, 270, 360] }}
    transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
    style={{ width: 50, height: 50, background: 'linear-gradient(135deg, #f97316, #fbbf24)', borderRadius: 8 }}
  />
);

// ── Demo: Interactive hover ───────────────────────────────────────────────────
const InteractiveHover: React.FC = () => (
  <motion.div
    whileHover={{ scale: 1.2, rotate: 180 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    style={{ width: 50, height: 50, background: '#06b6d4', borderRadius: '50%', cursor: 'pointer' }}
  />
);

// ── Section config ─────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'basics',
    accent: '#f97316',
    number: '01',
    title: 'Basic Tweens',
    subtitle: 'Foundation animations with scale, rotation, and simple property changes.',
    demos: [
      {
        title: 'Scale & Rotate',
        description: 'Element scales up 30% and rotates 360° over 2 seconds with easeInOut timing.',
        useCase: 'UI emphasis, attention-grabbing, subtle feedback',
        component: <BasicTween />,
      },
      {
        title: 'Multi-property Change',
        description: 'Simultaneous position, color, and opacity transitions create smooth visual flow.',
        useCase: 'element movement, color gradients, layered transitions',
        component: <MultiProperty />,
      },
    ],
  },
  {
    id: 'easing',
    accent: '#fbbf24',
    number: '02',
    title: 'Easing Functions',
    subtitle: 'Explore different timing curves: linear, easeIn, easeOut, easeInOut, and more.',
    demos: [
      {
        title: 'Easing Comparison',
        description: '4 balls drop with different easing functions (easeIn, linear, easeOut, easeInOut) side-by-side.',
        useCase: 'timing control, feel & polish, motion design',
        component: <EasingShowcase />,
      },
      {
        title: 'Staggered Sequence',
        description: '6 blocks scale in sequence with 0.1s delays, creating a wave-like cascade effect.',
        useCase: 'list animations, entrance effects, choreographed sequences',
        component: <StaggeredSequence />,
      },
    ],
  },
  {
    id: 'complex',
    accent: '#8b5cf6',
    number: '03',
    title: 'Complex Animations',
    subtitle: 'Multi-axis motion paths, spring physics, and advanced property interpolation.',
    demos: [
      {
        title: 'Path Motion',
        description: 'Element follows a complex x/y path while rotating, creating organic movement.',
        useCase: 'interactive elements, attention-drawing, UI tours',
        component: <PathMotion />,
      },
      {
        title: 'Spring Physics',
        description: 'Bounce effect using spring transition with stiffness & damping for natural feel.',
        useCase: 'physics-based UI, snappy interactions, playful motion',
        component: <SpringPhysics />,
      },
    ],
  },
  {
    id: 'transitions',
    accent: '#34d399',
    number: '04',
    title: 'Transitions & Effects',
    subtitle: 'Color morphing, rotation cycles, bounce effects, and color interpolation.',
    demos: [
      {
        title: 'Bounce Effect',
        description: 'Element bounces vertically with easeOut timing, simulating gravity and elasticity.',
        useCase: 'loading states, success feedback, playful animations',
        component: <BounceEffect />,
      },
      {
        title: 'Color Morph',
        description: 'Smooth color transition through blue → pink → purple → blue cycle.',
        useCase: 'status indicators, decorative elements, mood setting',
        component: <ColorMorph />,
      },
    ],
  },
  {
    id: 'interactive',
    accent: '#06b6d4',
    number: '05',
    title: 'Interactive Animations',
    subtitle: 'Hover states, tap feedback, and gesture-driven animations with spring physics.',
    demos: [
      {
        title: 'Rotation Cycle',
        description: 'Element continuously rotates through 5 keyframes with linear easing.',
        useCase: 'loading spinners, attention-grabbing, infinite loops',
        component: <RotationMorph />,
      },
      {
        title: 'Hover & Tap',
        description: 'Click or hover to trigger scale-up and rotation with spring physics feedback.',
        useCase: 'buttons, interactive elements, gesture feedback',
        component: <InteractiveHover />,
      },
    ],
  },
] as const;

// ── Main component ────────────────────────────────────────────────────────────
const TweenAnimations: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-20">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="space-y-5">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <span>Components</span><span>›</span><span>Animations</span><span>›</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>Tween</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>Tween Animations</h1>
          <p className="text-base max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Comprehensive tween-based animations showcasing easing functions, spring physics, and interactive transitions.
            From basic property tweens to complex multi-axis motion paths—explore the full spectrum of framer-motion capabilities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['easing functions', 'spring physics', 'stagger delays', 'keyframes', 'gesture-driven', 'color interpolation', 'motion paths', 'timing curves'].map(t => (
            <HeroTag key={t} label={t} />
          ))}
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          {[{ value: '5', label: 'animation sections' }, { value: '12', label: 'demo components' }, { value: '∞', label: 'customization options' }, { value: '60', label: 'fps target' }].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-black tabular-nums" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.value}</div>
              <div className="text-[10px] mt-0.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sections */}
      {SECTIONS.map((sec) => (
        <motion.section key={sec.id}
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}>
          <SectionHeader number={sec.number} title={sec.title} subtitle={sec.subtitle} accent={sec.accent} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sec.demos.map((demo, di) => (
              <motion.div key={demo.title}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: di * 0.07, ease: 'easeOut' }}>
                <ShowcaseCard title={demo.title} description={demo.description} useCase={demo.useCase}>
                  {demo.component}
                </ShowcaseCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
};

export default TweenAnimations;