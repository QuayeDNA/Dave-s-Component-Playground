import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WARN, PALE, SURF, BORD } from '@/data/abode/theme';

export const IncidentBlock: React.FC<{ phase: string; title: string; location: string; body: string }> = ({ phase, title, location, body }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}
      style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `4px solid ${WARN}` }}>
      <button className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer transition-all"
        style={{ background: expanded ? `${WARN}08` : 'transparent' }}
        onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="am" style={{ color: WARN, fontSize: '0.85rem', letterSpacing: '0.25em', opacity: 0.8 }}>PHASE {phase}</div>
            <div className="am" style={{ color: PALE, fontSize: '0.75rem', opacity: 0.35, letterSpacing: '0.2em' }}>LOCATION: {location.toUpperCase()}</div>
          </div>
          <h4 className="at" style={{ color: PALE, fontSize: '1.3rem', letterSpacing: '0.03em' }}>{title}</h4>
        </div>
        <span className="am flex-shrink-0 mt-1 transition-transform duration-200" style={{ color: WARN, fontSize: '0.8rem', opacity: 0.5, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0" style={{ borderTop: `1px dashed ${BORD}` }}>
              <p className="ab leading-relaxed pt-4" style={{ color: PALE, opacity: 0.72, fontSize: '1rem', lineHeight: 1.8 }}>{body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
