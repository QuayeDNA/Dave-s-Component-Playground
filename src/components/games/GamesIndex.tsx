import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ─── UI Showcase Card ────────────────────────────────────────
const STYLE_ACCENTS = ['#7eb8e8', '#7ec87e', '#c9962b', '#00f5ff', '#e05c2a', '#ffe866'];

const GameUICard: React.FC<{ delay: number }> = ({ delay }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate('/games/ui')}
      className="relative group cursor-pointer overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0c0c14 0%, #0a0a12 50%, #0c0c14 100%)',
        border: '1px solid rgba(160,128,208,0.2)',
      }}
    >
      {/* Six-accent bar at top */}
      <div className="flex h-[3px] absolute top-0 left-0 right-0">
        {STYLE_ACCENTS.map((c, i) => (
          <div key={i} className="flex-1 transition-opacity duration-300 group-hover:opacity-100" style={{ background: c, opacity: 0.7 }} />
        ))}
      </div>

      {/* Background — multi-style hint */}
      <div className="absolute inset-0 pointer-events-none select-none" style={{ overflow: 'hidden' }}>
        {/* terminal grid fragment */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(160,128,208,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(160,128,208,0.025) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Pixel art dots */}
        {[0,1,2,3,4].map(i => (
          <div key={i} className="absolute" style={{ width: 6, height: 6, background: STYLE_ACCENTS[i % 6] + '28',
            right: `${8 + i * 14}%`, top: `${20 + (i % 3) * 18}%`, imageRendering: 'pixelated' }} />
        ))}
        {/* Neon glow blob */}
        <div className="absolute" style={{ right: '-5%', bottom: '-10%', width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 p-5 sm:p-8 md:p-12 min-h-[260px] sm:min-h-[320px] flex flex-col justify-between">
        {/* Top meta */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1.5">
            {STYLE_ACCENTS.map((c, i) => (
              <div key={i} className="w-3 h-3" style={{ background: c + '60', border: `1px solid ${c}` }} />
            ))}
          </div>
          <span className="text-[9px] tracking-[0.25em] uppercase opacity-30"
            style={{ fontFamily: '"Space Mono", monospace', color: '#a080d0' }}>UI_SYSTEMS_04</span>
        </div>

        {/* Main content */}
        <div className="mt-6 sm:mt-0">
          <h2 className="leading-none mb-2"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(2.4rem, 7vw, 5rem)',
              color: '#c8c0e8', letterSpacing: '0.04em' }}>
            UI Systems
          </h2>
          <p className="mb-3 opacity-40"
            style={{ fontFamily: '"Space Mono", monospace', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
              color: '#a080d0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            // Six style directions · Nine interactive elements
          </p>
          <p className="leading-relaxed max-w-lg opacity-70"
            style={{ fontFamily: '"Space Mono", monospace', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
              color: '#c8c0e8', lineHeight: 1.8 }}>
            HUD bars, inventory grids, achievement toasts, dialogue systems, screen templates — all rendered
            in six distinct visual languages from pixel-art to neon void.
          </p>
        </div>

        {/* CTA */}
        <motion.div className="flex items-center gap-2 mt-5 w-fit" whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: '"Space Mono", monospace', color: '#a080d0' }}>EXPLORE UI ELEMENTS</span>
          <ArrowRight size={12} style={{ color: '#a080d0' }} />
        </motion.div>
      </div>

      {/* Hover glow */}
      <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
        style={{ background: 'radial-gradient(ellipse at 20% 75%, rgba(160,128,208,0.08), transparent 55%)' }} />

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out group-hover:w-full"
        style={{ background: '#a080d0', width: '0%' }} />
    </motion.div>
  );
};

// ─── IRREGULAR — Sci-fi geometric terminal ────────────────────
const IrregularCard: React.FC<{ delay: number }> = ({ delay }) => {
  const navigate = useNavigate();
  const ACCENT = '#7eb8e8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate('/games/irregular')}
      className="relative group cursor-pointer overflow-hidden irr-card"
      style={{
        background: 'linear-gradient(135deg, #07101a 0%, #0a1420 50%, #07101a 100%)',
        border: `1px solid ${ACCENT}20`,
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 irr-grid pointer-events-none" />

      {/* Background hexagon watermark */}
      <div className="absolute right-0 top-0 pointer-events-none select-none" style={{ right: '-2%', top: '-5%' }}>
        <svg
          width="clamp(180px, 45vw, 420px)"
          height="clamp(180px, 45vw, 420px)"
          viewBox="0 0 420 420"
          style={{ opacity: 0.045 }}
        >
          <polygon
            points="210,20 370,110 370,290 210,380 50,290 50,110"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
          />
          <polygon
            points="210,60 340,130 340,270 210,340 80,270 80,130"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
          />
          <polygon
            points="210,100 310,155 310,255 210,305 110,255 110,155"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        </svg>
      </div>

      {/* Small geometric corner accents */}
      <div className="absolute top-4 left-4 pointer-events-none select-none opacity-20">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <polygon points="14,3 25,9.5 25,22.5 14,29 3,22.5 3,9.5" fill="none" stroke={ACCENT} strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none select-none opacity-10">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="3" y="3" width="10" height="10" fill="none" stroke={ACCENT} strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 p-5 sm:p-8 md:p-12 min-h-[300px] sm:min-h-[380px] flex flex-col justify-between">
        {/* Top meta */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase px-2 sm:px-3 py-1 border"
            style={{
              fontFamily: '"Space Mono", monospace',
              color: ACCENT,
              borderColor: `${ACCENT}44`,
              borderStyle: 'solid',
            }}
          >
            METROIDVANIA · PUZZLE · EXPLORATION
          </span>
          <span
            className="text-[10px] sm:text-xs tracking-[0.2em] uppercase opacity-35"
            style={{ fontFamily: '"Space Mono", monospace', color: ACCENT }}
          >
            GAME_01
          </span>
        </div>

        {/* Main content */}
        <div className="mt-6 sm:mt-0">
          <h2
            className="leading-none mb-2"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: ACCENT,
              letterSpacing: '0.05em',
            }}
          >
            IRREGULAR
          </h2>
          <p
            className="mb-3 sm:mb-4 opacity-45"
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
              color: ACCENT,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            // A world of perfect shapes. An invasion of chaos.
          </p>
          <p
            className="leading-relaxed max-w-lg opacity-75"
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)',
              color: '#c8e4f8',
              lineHeight: 1.8,
            }}
          >
            A metroidvania where identity is your weapon — and the ability to become
            something else might be the only way to find your family.
          </p>
        </div>

        {/* CTA */}
        <motion.div
          className="flex items-center gap-2 mt-5 w-fit"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <span
            className="text-[10px] sm:text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: '"Space Mono", monospace', color: ACCENT }}
          >
            READ DESIGN DOC
          </span>
          <ArrowRight size={12} style={{ color: ACCENT }} />
        </motion.div>
      </div>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ background: `radial-gradient(ellipse at 15% 80%, ${ACCENT}10, transparent 55%)` }}
      />

      {/* Bottom bars */}
      <div className="absolute bottom-0 left-0 h-[2px] opacity-15 w-full" style={{ background: ACCENT }} />
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out group-hover:w-full"
        style={{ background: ACCENT, width: '0%' }}
      />
    </motion.div>
  );
};


// ─── ABƆDE — Military field dossier ──────────────────────────
const AbodeCard: React.FC<{ delay: number }> = ({ delay }) => {
  const navigate = useNavigate();
  const G    = '#7ec87e';
  const WARN = '#c8522a';
  const PALE = '#c8b89a';
  const BORD = '#3d3020';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate('/games/abode')}
      className="relative group cursor-pointer overflow-hidden abode-grain"
      style={{
        background: 'linear-gradient(135deg, #0f0d0a 0%, #141008 50%, #0f0d0a 100%)',
        border: `1px dashed ${BORD}`,
      }}
    >
      {/* Typewriter background number */}
      <div
        className="absolute right-0 top-0 pointer-events-none select-none leading-none"
        style={{
          fontFamily: '"VT323", monospace',
          fontSize: 'clamp(9rem, 22vw, 20rem)',
          color: `${G}05`,
          right: '-0.02em',
          top: '-0.05em',
          lineHeight: 0.85,
        }}
      >
        02
      </div>

      {/* Dossier corner marks */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l pointer-events-none" style={{ borderColor: `${BORD}` }} />
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r pointer-events-none" style={{ borderColor: `${BORD}` }} />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l pointer-events-none" style={{ borderColor: `${BORD}` }} />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r pointer-events-none" style={{ borderColor: `${BORD}` }} />

      <div className="relative z-10 p-5 sm:p-8 md:p-12 min-h-[300px] sm:min-h-[380px] flex flex-col justify-between">
        {/* Top meta — dossier header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div
              className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-1 opacity-45"
              style={{ fontFamily: '"VT323", monospace', color: G, fontSize: '0.85rem' }}
            >
              [SURVIVAL · ACTION · NARRATIVE]
            </div>
            <div
              className="text-[10px] sm:text-xs tracking-[0.15em] uppercase opacity-30"
              style={{ fontFamily: '"Special Elite", cursive', color: PALE }}
            >
              FIELD REPORT — DOCUMENT 02
            </div>
          </div>
          {/* Stamp */}
          <div
            className="shrink-0 border-2 px-2 py-1 opacity-55"
            style={{
              fontFamily: '"Special Elite", cursive',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: WARN,
              borderColor: WARN,
              transform: 'rotate(-3deg)',
            }}
          >
            CLASSIFIED
          </div>
        </div>

        {/* Main content */}
        <div className="mt-5 sm:mt-0">
          <h2
            className="leading-none mb-3"
            style={{
              fontFamily: '"Special Elite", cursive',
              fontSize: 'clamp(2.6rem, 7vw, 5rem)',
              color: PALE,
              letterSpacing: '0.02em',
            }}
          >
            Abɔde
          </h2>
          <p
            className="mb-3 sm:mb-4"
            style={{
              fontFamily: '"Special Elite", cursive',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
              color: G,
              opacity: 0.6,
              letterSpacing: '0.08em',
            }}
          >
            Homeland. A Ghanaian zombie survival story.
          </p>
          {/* Dashed separator */}
          <div className="mb-3" style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
            <p
              className="leading-relaxed max-w-lg"
              style={{
                fontFamily: '"Source Serif 4", Georgia, serif',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                color: PALE,
                opacity: 0.75,
                lineHeight: 1.85,
              }}
            >
              A retired colonel, a collapsed country, and two children somewhere in the wreckage.
              Survival was never the mission — family was.
            </p>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="flex items-center gap-2 mt-5 w-fit"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <span
            className="text-[10px] sm:text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: '"Special Elite", cursive', color: G }}
          >
            Read the Design Doc
          </span>
          <ArrowRight size={12} style={{ color: G }} />
        </motion.div>
      </div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ background: `radial-gradient(ellipse at 30% 70%, ${G}0a, transparent 60%)` }}
      />

      {/* Bottom dashed accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `repeating-linear-gradient(90deg, ${G}40 0px, ${G}40 6px, transparent 6px, transparent 12px)` }} />
    </motion.div>
  );
};


// ─── GOLD & IRON — Illuminated codex ─────────────────────────
const GoldIronCard: React.FC<{ delay: number }> = ({ delay }) => {
  const navigate = useNavigate();
  const GOLD      = '#c9962b';
  const PARCHMENT = '#e8d8b0';
  const BORDER    = '#3d2e00';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate('/games/gold-and-iron')}
      className="relative group cursor-pointer overflow-hidden gi-card"
      style={{
        background: 'linear-gradient(160deg, #1a1200 0%, #100c00 50%, #1a1400 100%)',
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* Warm firelight ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 100% 50% at 50% 110%, ${GOLD}08, transparent 65%)` }}
      />

      {/* Background Roman numeral in codex style */}
      <div
        className="absolute right-0 top-0 pointer-events-none select-none leading-none"
        style={{
          fontFamily: '"Cinzel Decorative", serif',
          fontSize: 'clamp(6rem, 16vw, 14rem)',
          color: `${GOLD}06`,
          right: '0.1em',
          top: '-0.05em',
          lineHeight: 0.85,
        }}
      >
        III
      </div>

      {/* Corner diamond ornaments */}
      <div className="absolute top-3 left-3 pointer-events-none select-none">
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ opacity: 0.25 }}>
          <polygon points="10,2 18,10 10,18 2,10" fill="none" stroke={GOLD} strokeWidth="1" />
          <polygon points="10,5 15,10 10,15 5,10" fill={GOLD} opacity="0.3" />
        </svg>
      </div>
      <div className="absolute top-3 right-3 pointer-events-none select-none">
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ opacity: 0.25 }}>
          <polygon points="10,2 18,10 10,18 2,10" fill="none" stroke={GOLD} strokeWidth="1" />
          <polygon points="10,5 15,10 10,15 5,10" fill={GOLD} opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 p-5 sm:p-8 md:p-12 min-h-[300px] sm:min-h-[380px] flex flex-col justify-between">
        {/* Top meta — codex header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase px-2 sm:px-3 py-1"
            style={{
              fontFamily: '"Cinzel", serif',
              color: GOLD,
              border: `1px solid ${GOLD}44`,
              position: 'relative',
            }}
          >
            Historical · Action · Mythology
          </span>
          <span
            className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase opacity-30"
            style={{ fontFamily: '"Cinzel", serif', color: GOLD }}
          >
            Codex III
          </span>
        </div>

        {/* Main content */}
        <div className="mt-5 sm:mt-0">
          {/* Kente mini-divider */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-[1px] flex-1" style={{ background: `${GOLD}25` }} />
            <svg width="50" height="10" viewBox="0 0 50 10" style={{ opacity: 0.5 }}>
              <rect x="0"  y="3" width="5"  height="4" fill={GOLD} opacity="0.4"/>
              <rect x="7"  y="1" width="3"  height="8" fill={GOLD} opacity="0.6"/>
              <rect x="12" y="3" width="5"  height="4" fill={GOLD} opacity="0.4"/>
              <polygon points="20,5 23,2 26,5 23,8" fill={GOLD} opacity="0.7"/>
              <rect x="29" y="3" width="3"  height="4" fill={GOLD} opacity="0.9"/>
              <polygon points="34,5 37,2 40,5 37,8" fill={GOLD} opacity="0.7"/>
              <rect x="43" y="3" width="5"  height="4" fill={GOLD} opacity="0.4"/>
            </svg>
            <div className="h-[1px] flex-1" style={{ background: `${GOLD}25` }} />
          </div>

          <h2
            className="leading-none mb-2 sm:mb-3"
            style={{
              fontFamily: '"Cinzel Decorative", serif',
              fontSize: 'clamp(1.8rem, 5.5vw, 4.5rem)',
              color: GOLD,
              letterSpacing: '0.04em',
            }}
          >
            Gold & Iron
          </h2>
          <p
            className="mb-3 sm:mb-4 italic"
            style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              color: PARCHMENT,
              opacity: 0.55,
              letterSpacing: '0.03em',
            }}
          >
            Colonial Gold Coast. A warrior. A legacy.
          </p>
          <p
            className="leading-relaxed max-w-lg"
            style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
              color: PARCHMENT,
              opacity: 0.8,
              lineHeight: 1.85,
            }}
          >
            He was betrayed, enslaved, and broken — and still came back with fire in his hands.
            A three-part saga where the power doesn't die with the man.
          </p>
        </div>

        {/* CTA */}
        <motion.div
          className="flex items-center gap-2 mt-5 w-fit"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <span
            className="text-[10px] sm:text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: '"Cinzel", serif', color: GOLD }}
          >
            Read the Chronicle
          </span>
          <ArrowRight size={12} style={{ color: GOLD }} />
        </motion.div>
      </div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ background: `radial-gradient(ellipse at 30% 70%, ${GOLD}12, transparent 60%)` }}
      />

      {/* Bottom ornamental bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center" style={{ height: '3px' }}>
        <div className="h-[1px] flex-1 opacity-20" style={{ background: GOLD }} />
        <div
          className="h-[3px] transition-all duration-500 ease-out group-hover:flex-1"
          style={{ background: GOLD, width: '0%', minWidth: 0, flex: '0 0 0%' }}
        />
        <div className="h-[1px] flex-1 opacity-20" style={{ background: GOLD }} />
      </div>
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out group-hover:w-full"
        style={{ background: GOLD, width: '0%' }}
      />
    </motion.div>
  );
};


const GamesIndex: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c0b09]">
      {/* Load all three font stacks */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&family=Special+Elite&family=Source+Serif+4:ital,wght@0,300;0,400;1,300;1,400&family=VT323&family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');

        .irr-grid {
          background-image:
            linear-gradient(rgba(126,184,232,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(126,184,232,0.035) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .abode-grain::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
      `}</style>

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-4 opacity-40"
            style={{ fontFamily: '"Space Mono", monospace', color: '#f5f0e8' }}
          >
            Game Design Journey
          </p>
          <h1
            className="leading-none mb-4"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              color: '#f5f0e8',
              letterSpacing: '0.03em',
            }}
          >
            Three Worlds
          </h1>
          <div className="w-16 h-[2px] bg-[#f5f0e8] opacity-20 mb-6" />
          <p
            className="text-base sm:text-lg max-w-xl opacity-60 leading-relaxed"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
          >
            Original 2D game concepts — each a different world, a different visual language,
            a different emotional core. This is the design bible in progress.
          </p>
        </motion.div>
      </div>

      {/* Game cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-1 gap-3 sm:gap-4">
        <IrregularCard delay={0.15} />
        <AbodeCard delay={0.3} />
        <GoldIronCard delay={0.45} />
        <GameUICard delay={0.6} />
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center pb-12"
        style={{ fontFamily: '"Space Mono", monospace', color: '#f5f0e8', fontSize: '0.6rem', letterSpacing: '0.3em', opacity: 0.25 }}
      >
        DESIGN BIBLE · DRAFT 1 · MORE SECTIONS COMING
      </motion.div>
    </div>
  );
};

export default GamesIndex;