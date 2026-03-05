import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface GameCardProps {
  index: string;
  title: string;
  subtitle: string;
  tagline: string;
  genre: string;
  route: string;
  accentColor: string;
  bgGradient: string;
  fontStyle?: string;
  delay: number;
}

const GameCard: React.FC<GameCardProps> = ({
  index,
  title,
  subtitle,
  tagline,
  genre,
  route,
  accentColor,
  bgGradient,
  delay,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(route)}
      className="relative group cursor-pointer overflow-hidden"
      style={{
        background: bgGradient,
        border: `1px solid ${accentColor}22`,
      }}
    >
      {/* Large background number */}
      <div
        className="absolute top-0 right-0 font-black leading-none select-none pointer-events-none"
        style={{
          fontSize: 'clamp(8rem, 20vw, 18rem)',
          color: `${accentColor}08`,
          fontFamily: '"Bebas Neue", sans-serif',
          lineHeight: 0.85,
          right: '-0.05em',
          top: '-0.05em',
        }}
      >
        {index}
      </div>

      <div className="relative z-10 p-8 md:p-12 min-h-[380px] flex flex-col justify-between">
        {/* Top meta */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs tracking-[0.25em] uppercase font-mono px-3 py-1 border"
            style={{ color: accentColor, borderColor: `${accentColor}44` }}
          >
            {genre}
          </span>
          <span
            className="text-xs tracking-[0.2em] uppercase font-mono opacity-40"
            style={{ color: accentColor }}
          >
            Game {index}
          </span>
        </div>

        {/* Main content */}
        <div>
          <h2
            className="font-black leading-none mb-2 tracking-tight"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              color: accentColor,
              letterSpacing: '0.02em',
            }}
          >
            {title}
          </h2>
          <p
            className="text-base mb-4 opacity-50 italic"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
          >
            {subtitle}
          </p>
          <p
            className="text-lg leading-relaxed max-w-lg opacity-80"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
          >
            {tagline}
          </p>
        </div>

        {/* CTA */}
        <motion.div
          className="flex items-center gap-2 mt-6 group/btn w-fit"
          whileHover={{ x: 6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <span
            className="text-sm tracking-[0.2em] uppercase font-mono"
            style={{ color: accentColor }}
          >
            Read the Design Doc
          </span>
          <ArrowRight size={14} style={{ color: accentColor }} />
        </motion.div>
      </div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ background: `radial-gradient(ellipse at 30% 70%, ${accentColor}12, transparent 60%)` }}
      />

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out group-hover:w-full"
        style={{ background: accentColor, width: '0%' }}
      />
      <div
        className="absolute bottom-0 left-0 h-[2px] opacity-20 w-full"
        style={{ background: accentColor }}
      />
    </motion.div>
  );
};

const GamesIndex: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c0b09]">
      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-4 opacity-40"
            style={{ fontFamily: '"Space Mono", monospace', color: '#f5f0e8' }}
          >
            Game Design Journey
          </p>
          <h1
            className="leading-none mb-4"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              color: '#f5f0e8',
              letterSpacing: '0.03em',
            }}
          >
            Three Worlds
          </h1>
          <div className="w-16 h-[2px] bg-[#f5f0e8] opacity-20 mb-6" />
          <p
            className="text-lg max-w-xl opacity-60 leading-relaxed"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
          >
            Original 2D game concepts — each a different world, a different visual language,
            a different emotional core. This is the design bible in progress.
          </p>
        </motion.div>
      </div>

      {/* Game cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 gap-4">
        <GameCard
          index="01"
          title="Irregular"
          subtitle="A world of perfect shapes. An invasion of chaos."
          tagline="A metroidvania where identity is your weapon — and the ability to become something else might be the only way to find your family."
          genre="Metroidvania · Puzzle · Exploration"
          route="/games/irregular"
          accentColor="#7eb8e8"
          bgGradient="linear-gradient(135deg, #0d1520 0%, #0a1018 50%, #081525 100%)"
          delay={0.15}
        />
        <GameCard
          index="02"
          title="Abɔde"
          subtitle="Homeland. A Ghanaian zombie survival story."
          tagline="A retired colonel, a collapsed country, and two children somewhere in the wreckage. Survival was never the mission — family was."
          genre="Survival · Action · Narrative"
          route="/games/abode"
          accentColor="#7ec87e"
          bgGradient="linear-gradient(135deg, #0d1a0d 0%, #0a150a 50%, #0d1a0d 100%)"
          delay={0.3}
        />
        <GameCard
          index="03"
          title="Gold & Iron"
          subtitle="Colonial Gold Coast. A warrior. A legacy."
          tagline="He was betrayed, enslaved, and broken — and still came back with fire in his hands. A three-part saga where the power doesn't die with the man."
          genre="Historical · Action · Mythology"
          route="/games/gold-and-iron"
          accentColor="#c9962b"
          bgGradient="linear-gradient(135deg, #1a1200 0%, #120e00 50%, #1a1400 100%)"
          delay={0.45}
        />
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