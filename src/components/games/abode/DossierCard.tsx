import React from 'react';
import { motion } from 'framer-motion';
import { G, PALE, SURF, BORD } from '@/data/abode/theme';

export const DossierCard: React.FC<{ id: string; name: string; role: string; status: string; description: string; details: string[] }> = ({ id, name, role, status, description, details }) => (
  <motion.div className="mb-4 relative" initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}
    style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${G}`, padding: '1.5rem' }}>
    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
      <div>
        <div className="am" style={{ color: G, fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.3em' }}>ID-{id} · {role.toUpperCase()}</div>
        <h3 className="at leading-none mt-1" style={{ color: PALE, fontSize: '1.6rem', letterSpacing: '0.02em' }}>{name}</h3>
      </div>
      <span className="astamp" style={{ fontSize: '0.65rem' }}>{status}</span>
    </div>
    <p className="ab mb-4 leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '1rem' }}>{description}</p>
    {details.length > 0 && (
      <div style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
        {details.map((d, i) => (
          <div key={i} className="flex gap-3 mb-1">
            <span className="am" style={{ color: G, opacity: 0.45, fontSize: '0.8rem' }}>{'>'}</span>
            <span className="ab" style={{ color: PALE, opacity: 0.65, fontSize: '0.9rem' }}>{d}</span>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);
