import React from 'react';
import { motion } from 'framer-motion';
import { WARN, PALE, BORD } from '@/data/abode/theme';

export const ASection: React.FC<{ id?: string; label: string; stamp?: string; children: React.ReactNode }> = ({ id, label, stamp, children }) => (
  <motion.div id={id} className="mb-20 scroll-mt-20"
    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}>
    {/* Document section header — left accent bar + warm tint */}
    <div className="flex items-stretch mb-8">
      <div style={{ width: 4, background: `${WARN}55`, flexShrink: 0 }} />
      <div className="flex items-center flex-1 px-5 py-3"
        style={{ background: `${WARN}07`, borderTop: `1px solid ${BORD}`, borderBottom: `1px solid ${BORD}` }}>
        <span className="at" style={{ color: PALE, fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.82 }}>
          {label}
        </span>
      </div>
      {stamp && (
        <div className="flex items-center px-5" style={{
          borderTop: `1px solid ${BORD}`, borderBottom: `1px solid ${BORD}`,
          borderRight: `1px solid ${BORD}`, flexShrink: 0,
        }}>
          <span className="astamp" style={{ fontSize: '0.62rem', opacity: 0.52 }}>{stamp}</span>
        </div>
      )}
    </div>
    {children}
  </motion.div>
);
