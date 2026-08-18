import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, PALE, SURF, BORD, BG } from '@/data/abode/theme';
import { RESEARCH_ENTRIES, RESEARCH_CATEGORIES, RESEARCH_CATEGORY_COLORS } from '@/data/abode/research';
import type { ResearchCat } from '@/data/abode/types';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';

const useIsMobile = () => {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
};

export const ResearchPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ResearchCat | 'all'>('all');
  const [activeEntry, setActiveEntry] = useState<string | null>(null);
  const [dialogEntry, setDialogEntry] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const categories = RESEARCH_CATEGORIES;
  const filtered = RESEARCH_ENTRIES.filter(e => activeCategory === 'all' || e.category === activeCategory);
  const entry = RESEARCH_ENTRIES.find(e => e.id === activeEntry);
  const dialogItem = RESEARCH_ENTRIES.find(e => e.id === dialogEntry);

  const catColors = RESEARCH_CATEGORY_COLORS;

  const handleEntryClick = (id: string) => {
    if (isMobile) {
      setDialogEntry(id);
    } else {
      setActiveEntry(activeEntry === id ? null : id);
    }
  };

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
              <button key={e.id} onClick={() => handleEntryClick(e.id)}
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

      {/* Mobile dialog for entries */}
      <Dialog open={dialogItem != null} onOpenChange={(open) => { if (!open) setDialogEntry(null); }}>
        <DialogContent
          className="w-full max-w-2xl p-0 gap-0 rounded-none sm:rounded-none bg-[#1a1610] border border-[#3d3020] [&>button]:hidden"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          <div className="flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
              style={{ background: dialogItem ? `${catColors[dialogItem.category] || G}10` : 'transparent', borderBottom: `1px solid ${BORD}` }}>
              <span className="am" style={{ color: dialogItem ? catColors[dialogItem.category] || G : PALE, fontSize: '0.6rem', letterSpacing: '0.25em', opacity: 0.75 }}>
                {dialogItem ? `${dialogItem.category.toUpperCase()} · RESEARCH NOTE` : ''}
              </span>
              <DialogClose asChild>
                <button aria-label="Close research note"
                  className="am transition-all"
                  style={{ color: PALE, fontSize: '0.7rem', letterSpacing: '0.15em', border: `1px solid ${BORD}`, padding: '0.15rem 0.6rem' }}>
                  [ X ] CLOSE
                </button>
              </DialogClose>
            </div>
            {dialogItem && (
              <div className="p-5 sm:p-6 overflow-y-auto">
                <DialogTitle className="at mb-4" style={{ color: PALE, fontSize: '1.2rem', letterSpacing: '0.03em' }}>{dialogItem.title}</DialogTitle>
                <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.8, fontSize: '1rem', lineHeight: 1.85 }}>{dialogItem.content}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
