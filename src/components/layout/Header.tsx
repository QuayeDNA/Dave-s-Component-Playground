import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Layers, Zap, Box, Map, FileText, LayoutDashboard, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Navigation structure ──────────────────────────────────────────────────────

const PLAYGROUND_SECTIONS = [
  {
    label: 'Components',
    items: [
      { label: 'Overview', sub: 'Start here', path: '/overview', Icon: LayoutDashboard },
      { label: 'Buttons', sub: 'All button variants', path: '/components/buttons', Icon: Layers },
      { label: 'Forms', sub: 'Inputs & validation', path: '/components/forms', Icon: FileText },
      { label: 'Cards', sub: 'Card patterns', path: '/components/cards', Icon: Layers },
      { label: 'Notifications', sub: 'Toast & alerts', path: '/components/notification', Icon: Layers },
    ],
  },
  {
    label: 'Animations',
    items: [
      { label: '2D', sub: 'CSS & JS motion', path: '/animations/2d', Icon: Zap },
      { label: '3D Scenes', sub: 'Three.js scenes', path: '/animations/3d', Icon: Box },
      { label: 'Physics', sub: 'Simulated motion', path: '/animations/physics', Icon: Zap },
      { label: 'Tween', sub: 'Gsap tweens', path: '/animations/tween', Icon: Zap },
      { label: 'Interactive', sub: 'Mouse-driven', path: '/animations/interactive', Icon: Zap },
      { label: 'Morph', sub: 'SVG morphing', path: '/animations/morph', Icon: Zap },
    ],
  },
  {
    label: 'Systems',
    items: [
      { label: '3D Basics', sub: 'WebGL fundamentals', path: '/3d-interactive', Icon: Box },
      { label: 'Torus', sub: '3D torus demo', path: '/3d-interactive/torus', Icon: Box },
      { label: 'Zones', sub: 'Management system', path: '/zones', Icon: Map },
      { label: 'Sticky Notes', sub: 'Editor experiment', path: '/sticky-notes', Icon: FileText },
      { label: 'Model Redesign', sub: 'GPT UI concept', path: '/model-redesign', Icon: Cpu },
    ],
  },
];

const GAME_ITEMS = [
  { label: 'All Worlds', sub: 'Three game concepts', path: '/games', color: '#f5f0e8', num: '—' },
  { label: 'Irregular', sub: 'Metroidvania · Shapeshifting', path: '/games/irregular', color: '#7eb8e8', num: '01' },
  { label: 'Abɔde', sub: 'Survival · Ghana · Family', path: '/games/abode', color: '#7ec87e', num: '02' },
  { label: 'Gold & Iron', sub: 'Historical · Gold Coast', path: '/games/gold-and-iron', color: '#c9962b', num: '03' },
];

// ─── Playground mega-dropdown ──────────────────────────────────────────────────

const PlaygroundMega: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-full left-0 mt-1 z-50"
        style={{
          background: 'linear-gradient(160deg, #07101f 0%, #050c18 100%)',
          border: '1px solid rgba(77,143,200,0.14)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(77,143,200,0.04)',
          minWidth: '560px',
        }}
      >
        {/* Header strip */}
        <div
          className="flex items-center gap-2.5 px-5 py-3"
          style={{ borderBottom: '1px solid rgba(77,143,200,0.1)' }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#4d8fc8' }}
          />
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}
          >
            The Playground · UI Lab
          </span>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-3 gap-0 p-4">
          {PLAYGROUND_SECTIONS.map((section) => (
            <div key={section.label} className="px-2">
              <div
                className="text-[9px] tracking-[0.28em] uppercase mb-3 px-2"
                style={{ color: '#4d8fc8', opacity: 0.45, fontFamily: 'monospace' }}
              >
                {section.label}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-start gap-2.5 px-2 py-1.5 rounded-sm hover:bg-[#4d8fc8]/[0.07] transition-colors"
                >
                  <item.Icon
                    size={12}
                    className="mt-0.5 shrink-0 transition-colors group-hover:text-[#7eb8e8]"
                    style={{ color: 'rgba(77,143,200,0.4)' }}
                  />
                  <div>
                    <div
                      className="text-[12px] font-medium leading-tight transition-colors group-hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-[10px] leading-tight mt-0.5"
                      style={{ color: 'rgba(255,255,255,0.22)' }}
                    >
                      {item.sub}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Games dropdown ────────────────────────────────────────────────────────────

const GamesMega: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-full right-0 mt-1 z-50 w-[280px]"
        style={{
          background: 'linear-gradient(160deg, #130d00 0%, #0a0800 100%)',
          border: '1px solid rgba(201,150,43,0.14)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,150,43,0.04)',
        }}
      >
        {/* Header strip */}
        <div
          className="flex items-center gap-2.5 px-5 py-3"
          style={{ borderBottom: '1px solid rgba(201,150,43,0.1)' }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#c9962b' }}
          />
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: '#c99142', opacity: 0.6, fontFamily: 'monospace' }}
          >
            Three Worlds · Game Design
          </span>
        </div>

        {/* Game list */}
        <div className="p-3">
          {GAME_ITEMS.map((game, i) => (
            <Link
              key={game.path}
              to={game.path}
              className={cn(
                'group flex items-center gap-3.5 px-3 py-2.5 transition-colors',
                i === 0 ? 'mb-1' : '',
              )}
              style={{
                background: i === 0 ? 'rgba(201,150,43,0.04)' : 'transparent',
                borderBottom: i === 0 ? '1px solid rgba(201,150,43,0.08)' : 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${game.color}0e`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = i === 0 ? 'rgba(201,150,43,0.04)' : 'transparent';
              }}
            >
              <span
                className="text-[9px] tabular-nums shrink-0"
                style={{ color: game.color, opacity: 0.45, fontFamily: 'monospace', minWidth: '1.5rem' }}
              >
                {game.num}
              </span>
              <div>
                <div
                  className="text-[13px] font-medium leading-tight transition-opacity group-hover:opacity-100"
                  style={{
                    color: game.color,
                    opacity: 0.82,
                    fontFamily: i > 0 ? '"Bebas Neue", sans-serif' : 'inherit',
                    fontSize: i > 0 ? '1rem' : '0.8rem',
                    letterSpacing: i > 0 ? '0.04em' : 'normal',
                  }}
                >
                  {game.label}
                </div>
                <div
                  className="text-[10px] leading-tight mt-0.5"
                  style={{ color: 'rgba(245,240,232,0.28)' }}
                >
                  {game.sub}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Mobile accordion item ─────────────────────────────────────────────────────

const MobileSection: React.FC<{
  title: string;
  accent: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, accent, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <button
        className="w-full flex items-center justify-between px-5 py-3.5"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-[10px] tracking-[0.28em] uppercase font-semibold"
          style={{ color: accent, fontFamily: 'monospace' }}
        >
          {title}
        </span>
        <ChevronDown
          size={13}
          style={{ color: accent, opacity: 0.6 }}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Header ───────────────────────────────────────────────────────────────

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'playground' | 'games' | null>(null);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const isGamesRoute = location.pathname.startsWith('/games');
  const isPlaygroundRoute = !isGamesRoute && location.pathname !== '/';

  // Adaptive header colour blends between the two identities
  const headerBg = isGamesRoute
    ? 'rgba(12,8,0,0.94)'
    : 'rgba(6,8,15,0.94)';
  const headerBorder = isGamesRoute
    ? 'rgba(201,150,43,0.1)'
    : 'rgba(255,255,255,0.06)';
  const activeAccent = isGamesRoute ? '#c99142' : '#4d8fc8';

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const playgroundActive =
    isPlaygroundRoute &&
    PLAYGROUND_SECTIONS.some((s) => s.items.some((i) => location.pathname.startsWith(i.path)));
  const gamesActive = isGamesRoute;

  return (
    <header
      ref={headerRef}
      className="fixed top-0 inset-x-0 z-40 h-[60px] flex items-center"
      style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        backdropFilter: 'blur(14px)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div className="w-full max-w-screen-xl mx-auto px-5 flex items-center justify-between gap-4">
        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className="w-6 h-6 flex items-center justify-center text-[9px] font-black rounded-sm shrink-0 transition-all duration-300"
            style={{
              background: isGamesRoute
                ? 'linear-gradient(135deg, #c9962b, #e8b84b)'
                : '#4d8fc8',
              color: '#06080f',
            }}
          >
            CP
          </div>
          <span
            className="text-[12px] font-semibold tracking-wide transition-colors hidden sm:block"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {isGamesRoute ? 'Three Worlds' : 'Component Playground'}
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {/* Playground top-level */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('playground')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-sm transition-all duration-200',
                playgroundActive
                  ? 'text-white'
                  : 'text-slate-500 hover:text-white/80',
                activeDropdown === 'playground' && 'text-white/80',
              )}
              style={{
                background: activeDropdown === 'playground' ? 'rgba(77,143,200,0.08)' : 'transparent',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                style={{ background: playgroundActive || activeDropdown === 'playground' ? '#4d8fc8' : 'rgba(77,143,200,0.3)' }}
              />
              Playground
              <ChevronDown
                size={11}
                className={cn('opacity-60 transition-transform duration-200', activeDropdown === 'playground' && 'rotate-180')}
              />
            </button>
            <PlaygroundMega isOpen={activeDropdown === 'playground'} />
          </div>

          {/* Divider */}
          <div
            className="h-4 w-px mx-1"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />

          {/* Games top-level */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('games')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-sm transition-all duration-200',
                gamesActive
                  ? 'text-[#f5f0e8]'
                  : 'text-slate-500 hover:text-[#f5f0e8]/80',
                activeDropdown === 'games' && 'text-[#f5f0e8]/80',
              )}
              style={{
                background: activeDropdown === 'games' ? 'rgba(201,150,43,0.08)' : 'transparent',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                style={{ background: gamesActive || activeDropdown === 'games' ? '#c9962b' : 'rgba(201,150,43,0.3)' }}
              />
              Games
              <ChevronDown
                size={11}
                className={cn('opacity-60 transition-transform duration-200', activeDropdown === 'games' && 'rotate-180')}
              />
            </button>
            <GamesMega isOpen={activeDropdown === 'games'} />
          </div>
        </nav>

        {/* ── Active route pill (desktop) ── */}
        <div className="hidden lg:flex items-center ml-2">
          {location.pathname !== '/' && (
            <div
              className="text-[10px] px-2.5 py-1 rounded-full tabular-nums"
              style={{
                background: `${activeAccent}14`,
                color: activeAccent,
                border: `1px solid ${activeAccent}22`,
                fontFamily: 'monospace',
                maxWidth: 160,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {location.pathname}
            </div>
          )}
        </div>

        {/* ── Mobile trigger ── */}
        <button
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-sm transition-colors"
          style={{
            color: 'rgba(255,255,255,0.5)',
            background: mobileOpen ? `${activeAccent}18` : 'transparent',
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 overflow-y-auto max-h-[80vh] lg:hidden"
            style={{
              background: isGamesRoute
                ? 'linear-gradient(180deg, #100900 0%, #0a0700 100%)'
                : 'linear-gradient(180deg, #080f1f 0%, #050c18 100%)',
              borderBottom: `1px solid ${isGamesRoute ? 'rgba(201,150,43,0.12)' : 'rgba(77,143,200,0.1)'}`,
            }}
          >
            {/* Playground sections */}
            <MobileSection title="The Playground" accent="#4d8fc8" defaultOpen={isPlaygroundRoute}>
              {PLAYGROUND_SECTIONS.map((section) => (
                <div key={section.label} className="pb-2">
                  <div
                    className="px-6 pt-3 pb-1 text-[9px] tracking-[0.28em] uppercase"
                    style={{ color: '#4d8fc8', opacity: 0.45, fontFamily: 'monospace' }}
                  >
                    {section.label}
                  </div>
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 mx-4 px-3 py-2 rounded-sm text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'white';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(77,143,200,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <item.Icon size={12} style={{ color: 'rgba(77,143,200,0.5)' }} className="shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </MobileSection>

            {/* Games section */}
            <MobileSection title="Three Worlds · Games" accent="#c9962b" defaultOpen={isGamesRoute}>
              <div className="pb-3">
                {GAME_ITEMS.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    className="flex items-center gap-4 mx-4 px-3 py-2.5 rounded-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = game.color;
                      (e.currentTarget as HTMLElement).style.background = `${game.color}10`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span
                      className="text-[9px] tabular-nums shrink-0"
                      style={{ color: game.color, opacity: 0.5, fontFamily: 'monospace', minWidth: '1.5rem' }}
                    >
                      {game.num}
                    </span>
                    <span className="text-sm">{game.label}</span>
                  </Link>
                ))}
              </div>
            </MobileSection>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
