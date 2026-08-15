import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, PALE, SURF, BORD, BG } from '@/data/abode/theme';
import { RESEARCH_ENTRIES, RESEARCH_CATEGORIES, RESEARCH_CATEGORY_COLORS } from '@/data/abode/research';
import type { ResearchCat } from '@/data/abode/types';

export const ResearchPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ResearchCat | 'all'>('all');
  const [activeEntry, setActiveEntry] = useState<string | null>(null);

  const categories = RESEARCH_CATEGORIES;
  const filtered = RESEARCH_ENTRIES.filter(e => activeCategory === 'all' || e.category === activeCategory);
  const entry = RESEARCH_ENTRIES.find(e => e.id === activeEntry);

  const catColors = RESEARCH_CATEGORY_COLORS;

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {categories.map(c => {
          const color = c === 'all' ? G : catColors[c] || G;
          return (
            <button key={c} onClick={() => { setActiveCategory(c); setActiveEntry(null); }}
              className="am px-2 py-1 transition-all text-left"
              style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: activeCategory === c ? BG : color, background: activeCategory === c ? color : `${color}10`, border: `1px solid ${activeCategory === c ? color : `${color}30`}` }}>
              {c === 'all' ? 'ALL' : c}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Entry list */}
        <div className="md:col-span-2 space-y-1">
          {filtered.map(e => {
            const color = catColors[e.category] || G;
            return (
              <button key={e.id} onClick={() => setActiveEntry(activeEntry === e.id ? null : e.id)}
                className="w-full text-left p-3 transition-all"
                style={{ background: activeEntry === e.id ? `${color}10` : 'transparent', border: `1px solid ${activeEntry === e.id ? `${color}30` : 'transparent'}`, borderLeft: `2px solid ${activeEntry === e.id ? color : `${color}30`}` }}>
                <div className="am mb-0.5" style={{ color, fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.6 }}>{e.category}</div>
                <div className="at" style={{ color: PALE, fontSize: '0.95rem', opacity: activeEntry === e.id ? 1 : 0.75 }}>{e.title}</div>
              </button>
            );
          })}
        </div>

        {/* Entry content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {entry ? (
              <motion.div key={entry.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                className="p-5" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${catColors[entry.category] || G}`, minHeight: 280 }}>
                <div className="am mb-1" style={{ color: catColors[entry.category] || G, fontSize: '0.65rem', letterSpacing: '0.25em', opacity: 0.6 }}>{entry.category}</div>
                <h3 className="at mb-4" style={{ color: PALE, fontSize: '1.2rem' }}>{entry.title}</h3>
                <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.8, fontSize: '1rem', lineHeight: 1.85 }}>{entry.content}</p>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
                className="flex items-center justify-center" style={{ border: `1px dashed ${BORD}`, minHeight: 280 }}>
                <div className="am text-center" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.25em' }}>
                  SELECT AN ENTRY<br/><span style={{ opacity: 0.5, fontSize: '0.65rem' }}>TO READ RESEARCH NOTES</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
