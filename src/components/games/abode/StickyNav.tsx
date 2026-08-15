import React from 'react';
import { motion } from 'framer-motion';
import { WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';
import { SECTIONS } from '@/data/abode/sections';

export const StickyNav: React.FC<{ activeId: string }> = ({ activeId }) => (
  <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col" style={{ gap: 0 }}>
    {SECTIONS.map((s, i) => {
      const isActive = activeId === s.id;
      const num = String(i + 1).padStart(2, '0');
      return (
        <motion.button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          animate={{ x: isActive ? 5 : 0 }}
          transition={{ duration: 0.18 }}
          title={s.label}
          style={{
            width: 28, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isActive ? WARN : SURF,
            borderRight: `2px solid ${isActive ? WARN : BORD}`,
            borderBottom: `1px solid ${BORD}44`,
            cursor: 'pointer',
            transition: 'background 0.18s',
          }}
        >
          <span className="am" style={{
            fontSize: '0.48rem', letterSpacing: '0.04em',
            color: isActive ? BG : PALE, opacity: isActive ? 1 : 0.32,
          }}>{num}</span>
        </motion.button>
      );
    })}
  </nav>
);
