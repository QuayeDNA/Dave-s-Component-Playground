import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Zap, Box, Map, FileText, LayoutDashboard, Cpu } from 'lucide-react';
import { PlaygroundBg, GamesBg } from './HomeBackgrounds';

type World = 'playground' | 'games' | null;

const PLAYGROUND_LINKS = [
  { label: 'Components', sub: 'Buttons, forms, cards', path: '/components/buttons', Icon: Layers },
  { label: 'Animations', sub: '2D, 3D, physics & more', path: '/animations/2d', Icon: Zap },
  { label: '3D Interactive', sub: 'WebGL & Three.js', path: '/3d-interactive', Icon: Box },
  { label: 'Zones', sub: 'Management system', path: '/zones', Icon: Map },
  { label: 'Sticky Notes', sub: 'Editor experiment', path: '/sticky-notes', Icon: FileText },
  { label: 'Model Redesign', sub: 'GPT UI concept', path: '/model-redesign', Icon: Cpu },
  { label: 'Overview', sub: 'Start here', path: '/overview', Icon: LayoutDashboard },
];

const GAME_LINKS = [
  { label: 'Irregular', sub: 'Metroidvania · Shapeshifting · Identity', path: '/games/irregular', color: 'var(--t-accent-b)', num: '01' },
  { label: 'Abɔde', sub: 'Survival · Ghana · Family', path: '/games/abode', color: 'var(--t-world-green)', num: '02' },
  { label: 'Gold & Iron', sub: 'Historical · Gold Coast · Saga', path: '/games/gold-and-iron', color: 'var(--t-gold)', num: '03' },
];

const stagger = { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } }, initial: {} };
const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } };

const HomePage: React.FC = () => {
  const [hovered, setHovered] = useState<World>(null);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--t-navy-800)', fontFamily: 'var(--font-sans)' }}
    >
      {/* ── Brand strip ───────────────────────────────────── */}
      <div
        className="flex-none flex items-center justify-between px-5 sm:px-8 h-11 shrink-0"
        style={{ borderBottom: '1px solid var(--t-line-soft)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 flex items-center justify-center text-[9px] font-black rounded-sm shrink-0"
            style={{ background: 'var(--t-accent)', color: 'var(--t-navy-800)' }}
          >
            CP
          </div>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: 'var(--t-ink-muted)' }}>
            Component Playground
          </span>
        </div>
        <span className="text-[10px] tabular-nums" style={{ color: 'var(--t-ink-dim)', fontFamily: 'var(--font-mono)' }}>
          2026
        </span>
      </div>

      {/* ── Two worlds ────────────────────────────────────── */}
      {/*
          Mobile:  stacked, each panel is auto-height, scrollable
          Desktop: side-by-side, full remaining viewport height, flex-grow animated
      */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">

        {/* ─── LEFT / TOP — The Playground ─── */}
        <motion.div
          className="relative flex flex-col overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(140deg, var(--t-panel-navy-top) 0%, var(--t-panel-navy-mid) 60%, var(--t-panel-navy-deep) 100%)',
            flexBasis: 0,
            minWidth: 0,
            minHeight: 0,
          }}
          animate={{ flexGrow: hovered === 'playground' ? 1.55 : hovered === 'games' ? 0.6 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onHoverStart={() => setHovered('playground')}
          onHoverEnd={() => setHovered(null)}
          onClick={() => navigate('/overview')}
        >
          {/* Desktop border */}
          <div
            className="absolute inset-y-0 right-0 w-px hidden lg:block"
            style={{ background: 'var(--t-line-soft)' }}
          />
          {/* Mobile border */}
          <div
            className="absolute inset-x-0 bottom-0 h-px lg:hidden"
            style={{ background: 'var(--t-line)' }}
          />

          <PlaygroundBg />

          <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col flex-1 justify-between overflow-y-auto">
            {/* Heading */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: 'var(--t-accent)', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>
                Design · Build · Explore
              </p>
              <h1
                className="leading-[0.88] text-white mb-3"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.025em' }}
              >
                The<br />Playground
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--t-ink-muted)', maxWidth: 280 }}>
                A growing library of experimental UI components, animations, and interactive systems.
              </p>
            </div>

            {/* Feature links — always visible on mobile, stagger on desktop hover */}
            <motion.ul
              className="mt-6 lg:mt-8 space-y-1"
              variants={stagger}
              animate={hovered === 'playground' ? 'animate' : 'initial'}
            >
              {PLAYGROUND_LINKS.map((link) => (
                <motion.li key={link.path} variants={fadeUp}>
                  <button
                    className="group flex items-center gap-3 w-full text-left py-1.5"
                    onClick={(e) => { e.stopPropagation(); navigate(link.path); }}
                  >
                    <link.Icon size={12} className="shrink-0" style={{ color: 'var(--t-accent)', opacity: 0.65 }} />
                    <div>
                      <div className="text-[13px] font-medium leading-tight group-hover:text-white transition-colors" style={{ color: 'var(--t-ink-strong)' }}>
                        {link.label}
                      </div>
                      <div className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--t-ink-faint)' }}>
                        {link.sub}
                      </div>
                    </div>
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA */}
            <div className="mt-6 lg:mt-8">
              <motion.div
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'var(--t-accent)' }}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              >
                Enter the Playground <ArrowRight size={13} />
              </motion.div>
            </div>
          </div>

          {/* Desktop accent sweep */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] hidden lg:block"
            style={{ background: 'linear-gradient(90deg, var(--t-accent), var(--t-accent-b))' }}
            animate={{ width: hovered === 'playground' ? '100%' : '0%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Mobile top accent line */}
          <div
            className="absolute top-0 left-0 w-full h-[2px] lg:hidden"
            style={{ background: 'linear-gradient(90deg, var(--t-accent) 0%, transparent 70%)' }}
          />
        </motion.div>

        {/* ─── RIGHT / BOTTOM — The Games ─── */}
        <motion.div
          className="relative flex flex-col overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(140deg, var(--t-panel-ember-top) 0%, var(--t-panel-ember-mid) 60%, var(--t-panel-ember-deep) 100%)',
            flexBasis: 0,
            minWidth: 0,
            minHeight: 0,
          }}
          animate={{ flexGrow: hovered === 'games' ? 1.55 : hovered === 'playground' ? 0.6 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onHoverStart={() => setHovered('games')}
          onHoverEnd={() => setHovered(null)}
          onClick={() => navigate('/games')}
        >
          <GamesBg />

          <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col flex-1 justify-between overflow-y-auto">
            {/* Heading */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: 'var(--t-gold)', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>
                Game Design · Narratives · Worlds
              </p>
              <h1
                className="leading-[0.88] mb-3"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--t-bone)' }}
              >
                Three<br />Worlds
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--t-bone-soft)', maxWidth: 280 }}>
                Original 2D game concepts — each a different world, visual language, and emotional core.
              </p>
            </div>

            {/* Game list */}
            <motion.ul
              className="mt-6 lg:mt-8 space-y-3"
              variants={stagger}
              animate={hovered === 'games' ? 'animate' : 'initial'}
            >
              {GAME_LINKS.map((game) => (
                <motion.li key={game.path} variants={fadeUp}>
                  <button
                    className="group flex items-start gap-4 w-full text-left py-1.5"
                    onClick={(e) => { e.stopPropagation(); navigate(game.path); }}
                  >
                    <span
                      className="text-[10px] mt-0.5 shrink-0 tabular-nums"
                      style={{ color: game.color, opacity: 0.4, fontFamily: 'var(--font-mono)', minWidth: '1.4rem' }}
                    >
                      {game.num}
                    </span>
                    <div>
                      <div
                        className="leading-tight group-hover:opacity-100 transition-opacity"
                        style={{
                          color: game.color,
                          opacity: 0.82,
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.05rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {game.label}
                      </div>
                      <div className="text-[11px] leading-tight mt-0.5" style={{ color: 'var(--t-bone-faint)' }}>
                        {game.sub}
                      </div>
                    </div>
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA */}
            <div className="mt-6 lg:mt-8">
              <motion.div
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'var(--t-gold)' }}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              >
                Explore the Worlds <ArrowRight size={13} />
              </motion.div>
            </div>
          </div>

          {/* Desktop accent sweep */}
          <motion.div
            className="absolute bottom-0 right-0 h-[2px] hidden lg:block"
            style={{ background: 'linear-gradient(270deg, var(--t-gold), var(--t-gold-b))' }}
            animate={{ width: hovered === 'games' ? '100%' : '0%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Mobile bottom accent */}
          <div
            className="absolute bottom-0 left-0 w-full h-[2px] lg:hidden"
            style={{ background: 'linear-gradient(90deg, var(--t-gold) 0%, transparent 70%)' }}
          />
        </motion.div>
      </div>

      {/* ── Footer hint — desktop only ─────────────────────── */}
      <AnimatePresence>
        {!hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-none h-7 items-center justify-center shrink-0 hidden lg:flex"
            style={{ borderTop: '1px solid var(--t-line-faint)' }}
          >
            <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--t-line-strong)' }}>
              hover to explore &middot; click to enter
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
