import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, WARN, PALE, SURF, BORD, BG } from '@/data/abode/theme';
import { PERSONNEL, STAT_LABELS } from '@/data/abode/characters';

const ScratchBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div className="abar-track" style={{ marginTop: 4, marginBottom: 8 }}>
    <motion.div className="abar-fill" style={{ background: color, width: `${value}%` }}
      initial={{ width: 0 }} whileInView={{ width: `${value}%` }}
      viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut' }}/>
  </div>
);

export const PersonnelComparison: React.FC = () => {
  const [activeId, setActiveId] = useState('KM-001');
  const person = PERSONNEL.find(p => p.id === activeId)!;

  return (
    <div>
      {/* Tab row — personnel file tabs */}
      <div className="flex gap-1 flex-wrap mb-6 overflow-x-auto" style={{ borderBottom: `1px dashed ${BORD}`, paddingBottom: '0.75rem' }}>
        {PERSONNEL.map(p => (
          <button key={p.id} onClick={() => setActiveId(p.id)}
            className="am px-3 py-1.5 transition-all duration-200 shrink-0"
            style={{
              fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: activeId === p.id ? BG : p.statusColor,
              background: activeId === p.id ? p.statusColor : `${p.statusColor}10`,
              border: `1px solid ${activeId === p.id ? p.statusColor : `${p.statusColor}30`}`,
            }}>
            {p.id}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={person.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left — identity card */}
          <div style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${person.statusColor}`, padding: '1.5rem' }}>
            <div className="am mb-1" style={{ color: G, fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.5 }}>{person.id} · {person.role.toUpperCase()}</div>
            <h3 className="at mb-1" style={{ color: PALE, fontSize: '1.5rem' }}>{person.name}</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="am" style={{ color: PALE, fontSize: '0.7rem', opacity: 0.4 }}>AGE: {person.age}</div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: person.statusColor }}/>
                <span className="am" style={{ color: person.statusColor, fontSize: '0.7rem', letterSpacing: '0.2em', opacity: 0.8 }}>{person.status}</span>
              </div>
            </div>
            <div style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
              <div className="am mb-2" style={{ color: G, fontSize: '0.7rem', letterSpacing: '0.25em', opacity: 0.5 }}>FIELD NOTES</div>
              {person.notes.map((n, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <span className="am" style={{ color: WARN, opacity: 0.5, fontSize: '0.8rem', flexShrink: 0 }}>{'>'}</span>
                  <span className="ab" style={{ color: PALE, opacity: 0.72, fontSize: '0.92rem', lineHeight: 1.6 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — capability form */}
          <div style={{ background: `${SURF}88`, border: `1px dashed ${BORD}`, padding: '1.5rem' }}>
            <div className="am mb-4" style={{ color: G, fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.5 }}>CAPABILITY ASSESSMENT FORM</div>
            {Object.entries(person.stats).map(([key, val]) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="am" style={{ color: PALE, fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.5 }}>{STAT_LABELS[key]}</span>
                  <span className="am" style={{ color: person.statusColor, fontSize: '0.75rem', opacity: 0.7 }}>{val}/100</span>
                </div>
                <ScratchBar value={val} color={person.statusColor}/>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
