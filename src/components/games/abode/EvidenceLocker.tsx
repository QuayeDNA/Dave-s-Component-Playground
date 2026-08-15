import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { G, WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';
import { ASSETS } from '@/data/abode/assets';
import { StatusChip } from './ui';

const CATEGORIES = ['ALL', 'Concept Art', 'Character', 'UI', 'Audio', 'Map', 'Reference'];

export const EvidenceLocker: React.FC = () => {
  const [category, setCategory] = useState('ALL');
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  const filtered = ASSETS.filter(a => category === 'ALL' || a.category === category);

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-6">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className="am px-2 py-1 transition-all"
            style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: category === c ? BG : G, background: category === c ? G : `${G}10`, border: `1px solid ${category === c ? G : `${G}30`}` }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((a, i) => {
          const showFile = Boolean(a.src && !missing[a.id]);
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              style={{ background: SURF, border: `1px solid ${BORD}` }}>
              <div className="relative aspect-video flex items-center justify-center overflow-hidden" style={{ background: BG, borderBottom: `1px solid ${BORD}` }}>
                {showFile ? (
                  a.category === 'Audio' ? (
                    <audio controls src={a.src} className="w-full px-3" onError={() => setMissing(m => ({ ...m, [a.id]: true }))} />
                  ) : (
                    <img src={a.src} alt={a.name} className="w-full h-full object-cover" onError={() => setMissing(m => ({ ...m, [a.id]: true }))} />
                  )
                ) : (
                  <span className="am" style={{ color: WARN, fontSize: '0.6rem', letterSpacing: '0.22em', opacity: 0.55 }}>ASSET PENDING CLEARANCE</span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="am" style={{ color: G, fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.5 }}>{a.category.toUpperCase()}</span>
                  <StatusChip status={a.status} />
                </div>
                <div className="at" style={{ color: PALE, fontSize: '0.9rem' }}>{a.name}</div>
                <div className="am mt-1" style={{ color: PALE, fontSize: '0.58rem', opacity: 0.35, lineHeight: 1.6 }}>{a.source}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
