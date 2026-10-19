import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';
import { SECTIONS } from '@/data/abode/sections';
import { RedactionBar } from './RedactionBar';

export const StickyNav: React.FC<{ activeId: string }> = ({ activeId }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeIndex = SECTIONS.findIndex(s => s.id === activeId);

  return (
    <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col" style={{ gap: 0 }}>
      {SECTIONS.map((s, i) => {
        const isActive = i === activeIndex;
        const isRead = i < activeIndex;
        const showLabel = isActive || hoveredId === s.id;
        const num = String(i + 1).padStart(2, '0');

        return (
          <motion.button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
            animate={{ x: isActive ? 5 : 0 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
          >
            {/* number tile — declassifies top-to-bottom on mount */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
              style={{
                width: 28, height: 26, transformOrigin: 'top', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? WARN : SURF,
                borderRight: `2px solid ${isActive ? WARN : BORD}`,
                borderBottom: `1px solid ${BORD}44`,
              }}
            >
              <span className="am" style={{
                fontSize: '0.48rem', letterSpacing: '0.04em',
                color: isActive ? BG : PALE,
                opacity: isActive ? 1 : isRead ? 0.18 : 0.32,
              }}>{num}</span>
            </motion.div>

            {/* expandable label strip */}
            <AnimatePresence>
              {showLabel && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  style={{
                    overflow: 'hidden', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center',
                    background: SURF,
                    borderBottom: `1px solid ${BORD}44`,
                    borderRight: `1px solid ${BORD}`,
                  }}
                >
                  <div style={{ padding: '0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RedactionBar revealed={isActive || isRead} barColor="#0a0705">
                      <span className="am" style={{
                        fontSize: '0.56rem', letterSpacing: '0.12em',
                        color: PALE, opacity: isRead ? 0.4 : 0.85,
                      }}>{s.label}</span>
                    </RedactionBar>
                    {isActive && (
                      <span className="astamp" style={{ fontSize: '0.5rem', color: WARN, opacity: 0.75 }}>{s.stamp}</span>
                    )}
                    {isRead && (
                      <span className="astamp" style={{ fontSize: '0.5rem', color: PALE, opacity: 0.3 }}>{s.stamp}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </nav>
  );
};