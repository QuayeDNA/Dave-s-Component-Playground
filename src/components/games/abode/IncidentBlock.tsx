import React from 'react';
import { motion } from 'framer-motion';
import { WARN, PALE, SURF, BORD } from '@/data/abode/theme';

export const IncidentBlock: React.FC<{ phase: string; title: string; location: string; body: string }> = ({ phase, title, location, body }) => (
  <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}
    style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `4px solid ${WARN}`, padding: '1.25rem 1.5rem' }}>
    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
      <div className="am" style={{ color: WARN, fontSize: '0.85rem', letterSpacing: '0.25em', opacity: 0.8 }}>PHASE {phase}</div>
      <div className="am" style={{ color: PALE, fontSize: '0.75rem', opacity: 0.35, letterSpacing: '0.2em' }}>LOCATION: {location.toUpperCase()}</div>
    </div>
    <h4 className="at mb-2" style={{ color: PALE, fontSize: '1.3rem', letterSpacing: '0.03em' }}>{title}</h4>
    <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '1rem' }}>{body}</p>
  </motion.div>
);
