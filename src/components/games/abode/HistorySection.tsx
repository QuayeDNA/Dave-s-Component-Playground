import React from 'react';
import { motion } from 'framer-motion';
import { WARN, PALE, SURF, BORD, G } from '@/data/abode/theme';
import { HISTORY_ENTRIES } from '@/data/abode/history';

const ERA_COLORS: Record<string, string> = {
  'BEFORE': '#8ab0b8',
  'DAYS 1–3': '#e8c84a',
  'D-DAY': WARN,
  'ONGOING': G,
  'ACT III': '#c8a8e8',
  'BOTH': G,
};

export const HistorySection: React.FC = () => (
  <div>
    <motion.div className="ab italic leading-loose mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      style={{ color: PALE, opacity: 0.6, fontSize: '1rem', borderLeft: `2px solid ${WARN}30`, paddingLeft: '1rem' }}>
      Chronology of the fall — the events that moved the country from standing to broken, from first report to the Ark.
      Read before the situation report. The road south was already closing while Accra still held.
    </motion.div>

    {HISTORY_ENTRIES.map((e, i) => {
      const color = ERA_COLORS[e.era] || WARN;
      return (
        <motion.div key={e.id} className="mb-4 flex gap-4"
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.03 }}>
          <div className="am flex-shrink-0 pt-4" style={{ color, fontSize: '0.7rem', letterSpacing: '0.2em', width: 86, textAlign: 'right', opacity: 0.85 }}>
            {e.era}
          </div>
          <div style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${color}`, padding: '1.15rem 1.35rem', flex: 1 }}>
            <h4 className="at mb-1.5" style={{ color: PALE, fontSize: '1.15rem', letterSpacing: '0.04em' }}>{e.title}</h4>
            <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '0.98rem' }}>{e.body}</p>
          </div>
        </motion.div>
      );
    })}
  </div>
);
