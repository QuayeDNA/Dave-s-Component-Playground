import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Zap, Box, Map, FileText, LayoutDashboard, Cpu } from 'lucide-react';

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
  { label: 'Irregular', sub: 'Metroidvania · Shapeshifting · Identity', path: '/games/irregular', color: '#7eb8e8', num: '01' },
  { label: 'Abɔde', sub: 'Survival · Ghana · Family', path: '/games/abode', color: '#7ec87e', num: '02' },
  { label: 'Gold & Iron', sub: 'Historical · Gold Coast · Saga', path: '/games/gold-and-iron', color: '#c9962b', num: '03' },
];

const stagger = { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } }, initial: {} };
const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } };

const GridOverlay: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="pg-grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(78,143,200,0.07)" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pg-grid)" />
  </svg>
);

const DiagonalOverlay: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="games-lines" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <line x1="0" y1="0" x2="0" y2="60" stroke="#c9962b" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#games-lines)" />
  </svg>
);

const HomePage: React.FC = () => {
  const [hovered, setHovered] = useState<World>(null);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#06080f', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Brand strip ───────────────────────────────────── */}
      <div
        className="flex-none flex items-center justify-between px-5 sm:px-8 h-11 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 flex items-center justify-center text-[9px] font-black rounded-sm shrink-0"
            style={{ background: '#4d8fc8', color: '#06080f' }}
          >
            CP
          </div>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Component Playground
          </span>
        </div>
        <span className="text-[10px] tabular-nums" style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'monospace' }}>
          2026
        </span>
      </div>

      {/* ── Two worlds ────────────────────────────────────── */}
      {/*
          Mobile:  stacked, each panel is auto-height, scrollable
          Desktop: side-by-side, full remaining viewport height, flex-grow animated
      */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ─── LEFT / TOP — The Playground ─── */}
        <motion.div
          className="relative flex flex-col overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(140deg, #071830 0%, #050d1c 60%, #030810 100%)',
            // Desktop: animated expand; Mobile: auto height
            ...(typeof window !== 'undefined' && window.innerWidth >= 1024
              ? {
                  flexGrow: hovered === 'playground' ? 1.55 : hovered === 'games' ? 0.6 : 1,
                  transition: 'flex-grow 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                }
              : {}),
          }}
          onHoverStart={() => setHovered('playground')}
          onHoverEnd={() => setHovered(null)}
          onClick={() => navigate('/overview')}
        >
          {/* Desktop border */}
          <div
            className="absolute inset-y-0 right-0 w-px hidden lg:block"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          {/* Mobile border */}
          <div
            className="absolute inset-x-0 bottom-0 h-px lg:hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />

          <GridOverlay />
          <div
            className="absolute pointer-events-none"
            style={{ top: '-20%', left: '-10%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(77,143,200,0.16) 0%, transparent 65%)' }}
          />

          <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col lg:justify-between lg:h-full lg:min-h-[calc(100vh-44px)]">
            {/* Heading */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>
                Design · Build · Explore
              </p>
              <h1
                className="leading-[0.88] text-white mb-3"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.025em' }}
              >
                The<br />Playground
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)', maxWidth: 280 }}>
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
                    <link.Icon size={12} className="shrink-0" style={{ color: '#4d8fc8', opacity: 0.65 }} />
                    <div>
                      <div className="text-[13px] font-medium leading-tight group-hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.68)' }}>
                        {link.label}
                      </div>
                      <div className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>
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
                style={{ color: '#4d8fc8' }}
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
            style={{ background: 'linear-gradient(90deg, #4d8fc8, #7eb8e8)' }}
            animate={{ width: hovered === 'playground' ? '100%' : '0%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Mobile top accent line */}
          <div
            className="absolute top-0 left-0 w-full h-[2px] lg:hidden"
            style={{ background: 'linear-gradient(90deg, #4d8fc8 0%, transparent 70%)' }}
          />
        </motion.div>

        {/* ─── RIGHT / BOTTOM — The Games ─── */}
        <motion.div
          className="relative flex flex-col overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(140deg, #130c00 0%, #0c0800 60%, #07050a 100%)',
            ...(typeof window !== 'undefined' && window.innerWidth >= 1024
              ? {
                  flexGrow: hovered === 'games' ? 1.55 : hovered === 'playground' ? 0.6 : 1,
                  transition: 'flex-grow 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                }
              : {}),
          }}
          onHoverStart={() => setHovered('games')}
          onHoverEnd={() => setHovered(null)}
          onClick={() => navigate('/games')}
        >
          <DiagonalOverlay />
          <div
            className="absolute pointer-events-none"
            style={{ top: '-15%', right: '-15%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(201,150,43,0.14) 0%, transparent 65%)' }}
          />

          <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col lg:justify-between lg:h-full lg:min-h-[calc(100vh-44px)]">
            {/* Heading */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: '#c99142', opacity: 0.6, fontFamily: 'monospace' }}>
                Game Design · Narratives · Worlds
              </p>
              <h1
                className="leading-[0.88] mb-3"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#f5f0e8' }}
              >
                Three<br />Worlds
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.3)', maxWidth: 280 }}>
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
                      style={{ color: game.color, opacity: 0.4, fontFamily: 'monospace', minWidth: '1.4rem' }}
                    >
                      {game.num}
                    </span>
                    <div>
                      <div
                        className="leading-tight group-hover:opacity-100 transition-opacity"
                        style={{
                          color: game.color,
                          opacity: 0.82,
                          fontFamily: '"Bebas Neue", sans-serif',
                          fontSize: '1.05rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {game.label}
                      </div>
                      <div className="text-[11px] leading-tight mt-0.5" style={{ color: 'rgba(245,240,232,0.26)' }}>
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
                style={{ color: '#c99142' }}
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
            style={{ background: 'linear-gradient(270deg, #c9962b, #e8b84b)' }}
            animate={{ width: hovered === 'games' ? '100%' : '0%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Mobile bottom accent */}
          <div
            className="absolute bottom-0 left-0 w-full h-[2px] lg:hidden"
            style={{ background: 'linear-gradient(90deg, #c9962b 0%, transparent 70%)' }}
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
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.1)' }}>
              hover to explore &middot; click to enter
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
