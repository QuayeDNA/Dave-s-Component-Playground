import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface SectionProps {
  label: string;
  children: ReactNode;
  accentColor: string;
}

export const Section: React.FC<SectionProps> = ({ label, children, accentColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="mb-20"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="h-[1px] w-8 opacity-40" style={{ background: accentColor }} />
      <span
        className="text-xs tracking-[0.3em] uppercase"
        style={{ fontFamily: '"Space Mono", monospace', color: accentColor, opacity: 0.7 }}
      >
        {label}
      </span>
      <div className="h-[1px] flex-1 opacity-10" style={{ background: accentColor }} />
    </div>
    {children}
  </motion.div>
);

interface InfoGridProps {
  items: { label: string; value: string }[];
  accentColor: string;
}

export const InfoGrid: React.FC<InfoGridProps> = ({ items, accentColor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
    {items.map((item) => (
      <div
        key={item.label}
        className="p-5"
        style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}18` }}
      >
        <div
          className="text-xs tracking-[0.25em] uppercase mb-2 opacity-50"
          style={{ fontFamily: '"Space Mono", monospace', color: accentColor }}
        >
          {item.label}
        </div>
        <div
          className="text-sm leading-relaxed opacity-80"
          style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8', fontSize: '1rem' }}
        >
          {item.value}
        </div>
      </div>
    ))}
  </div>
);

interface CharacterCardProps {
  name: string;
  role: string;
  description: string;
  accentColor: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ name, role, description, accentColor }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="p-6 mb-4"
    style={{ background: `${accentColor}06`, border: `1px solid ${accentColor}18`, borderLeft: `3px solid ${accentColor}` }}
  >
    <h3
      className="leading-none mb-1 tracking-wide"
      style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.8rem', color: accentColor, letterSpacing: '0.05em' }}
    >
      {name}
    </h3>
    <p
      className="text-xs tracking-[0.25em] uppercase mb-3 opacity-45"
      style={{ fontFamily: '"Space Mono", monospace', color: '#f5f0e8' }}
    >
      {role}
    </p>
    <p
      className="leading-relaxed opacity-80 text-base"
      style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
    >
      {description}
    </p>
  </motion.div>
);

interface MechanicItemProps {
  title: string;
  description: string;
  accentColor: string;
  index: number;
}

export const MechanicItem: React.FC<MechanicItemProps> = ({ title, description, accentColor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    className="flex gap-5 mb-6 group"
  >
    <div
      className="text-xs mt-1 font-mono flex-shrink-0 opacity-40 group-hover:opacity-80 transition-opacity"
      style={{ color: accentColor, paddingTop: '0.2rem' }}
    >
      →
    </div>
    <div>
      <span
        className="font-semibold"
        style={{ color: '#f5f0e8', fontFamily: '"Crimson Pro", Georgia, serif', fontSize: '1.05rem' }}
      >
        {title}:{' '}
      </span>
      <span
        className="opacity-75 leading-relaxed"
        style={{ color: '#f5f0e8', fontFamily: '"Crimson Pro", Georgia, serif', fontSize: '1.05rem' }}
      >
        {description}
      </span>
    </div>
  </motion.div>
);

interface ActProps {
  number: string;
  title: string;
  description: string;
  accentColor: string;
}

export const ActBlock: React.FC<ActProps> = ({ number, title, description, accentColor }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="grid gap-4 mb-6"
    style={{ gridTemplateColumns: '60px 1fr' }}
  >
    <div
      className="text-right leading-none opacity-15 font-black"
      style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '3.5rem', color: accentColor }}
    >
      {number}
    </div>
    <div className="pt-1">
      <h4
        className="tracking-wider mb-2 opacity-90"
        style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', color: '#f5f0e8', letterSpacing: '0.08em' }}
      >
        {title}
      </h4>
      <p
        className="opacity-70 leading-relaxed text-base"
        style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
      >
        {description}
      </p>
    </div>
  </motion.div>
);

interface CalloutProps {
  label: string;
  text: string;
  accentColor: string;
}

export const Callout: React.FC<CalloutProps> = ({ label, text, accentColor }) => (
  <div
    className="p-6 my-8"
    style={{ borderTop: `2px solid ${accentColor}`, background: `${accentColor}07` }}
  >
    <span
      className="text-xs tracking-[0.25em] uppercase font-semibold"
      style={{ fontFamily: '"Space Mono", monospace', color: accentColor }}
    >
      {label}:{' '}
    </span>
    <span
      className="italic text-base opacity-85"
      style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
    >
      {text}
    </span>
  </div>
);

interface GamePageShellProps {
  // Hero
  gameNumber: string;
  title: string;
  titleLine2?: string;
  subtitle: string;
  hook: string;
  genre: string;
  accentColor: string;
  bgFrom: string;
  bgTo: string;
  children: ReactNode;
}

export const GamePageShell: React.FC<GamePageShellProps> = ({
  gameNumber,
  title,
  titleLine2,
  subtitle,
  hook,
  genre,
  accentColor,
  bgFrom,
  bgTo,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ background: bgFrom, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity"
          style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.25em', color: '#f5f0e8' }}
        >
          <ArrowLeft size={12} />
          BACK TO ALL GAMES
        </motion.button>
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden pt-12 pb-20 px-6"
        style={{
          background: `linear-gradient(160deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        }}
      >
        {/* Giant bg number */}
        <div
          className="absolute right-0 top-0 select-none pointer-events-none leading-none font-black"
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(12rem, 35vw, 28rem)',
            color: `${accentColor}05`,
            right: '-0.05em',
            top: '-0.1em',
          }}
        >
          {gameNumber}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xs tracking-[0.3em] uppercase px-3 py-1 border"
                style={{ fontFamily: '"Space Mono", monospace', color: accentColor, borderColor: `${accentColor}44` }}
              >
                {genre}
              </span>
            </div>

            <h1
              className="leading-none mb-3"
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                color: accentColor,
                letterSpacing: '0.02em',
              }}
            >
              {title}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h1>

            <p
              className="text-base mb-8 opacity-50 italic"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: '#f5f0e8' }}
            >
              {subtitle}
            </p>

            <div
              className="text-xl leading-relaxed max-w-2xl italic opacity-80"
              style={{
                fontFamily: '"Crimson Pro", Georgia, serif',
                color: '#f5f0e8',
                borderLeft: `3px solid ${accentColor}`,
                paddingLeft: '1.5rem',
              }}
            >
              {hook}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {children}
      </div>

      {/* Footer */}
      <div
        className="text-center pb-12 opacity-20"
        style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: '#f5f0e8' }}
      >
        DESIGN BIBLE · DRAFT 1 · {title.toUpperCase()}
      </div>
    </div>
  );
};