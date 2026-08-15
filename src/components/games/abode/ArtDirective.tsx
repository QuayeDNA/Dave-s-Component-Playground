import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, WARN, PALE, SURF, BORD } from '@/data/abode/theme';
import { PALETTE_DATA, DESIGN_PRINCIPLES } from '@/data/abode/art';
import { ZONE_VISUALS } from '@/data/abode/zones';

export const ArtDirective: React.FC = () => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {/* Color palette */}
      <div>
        <div className="am mb-4" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.3em', opacity: 0.55 }}>[COLOR BRIEF]</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PALETTE_DATA.map(p => (
            <div key={p.hex} onMouseEnter={() => setHoveredColor(p.hex)} onMouseLeave={() => setHoveredColor(null)}>
              <motion.div style={{ background: p.hex, border: `1px solid ${BORD}`, marginBottom: '0.4rem' }}
                animate={{ height: hoveredColor === p.hex ? 72 : 48 }} transition={{ duration: 0.2 }}/>
              <div className="am" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.65, letterSpacing: '0.1em' }}>{p.name}</div>
              <div className="am" style={{ color: PALE, fontSize: '0.52rem', opacity: 0.3 }}>{p.hex}</div>
              <AnimatePresence>
                {hoveredColor === p.hex && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="ab" style={{ color: PALE, opacity: 0.55, fontSize: '0.78rem', marginTop: '0.25rem' }}>
                    {p.use}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Design principles */}
      <div>
        <div className="am mb-4" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.3em', opacity: 0.55 }}>[DESIGN PRINCIPLES]</div>
        <div className="space-y-3">
          {DESIGN_PRINCIPLES.map((p, i) => (
            <motion.div key={p.n} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex gap-4 p-4" style={{ background: SURF, border: `1px solid ${BORD}` }}>
              <div className="am flex-shrink-0" style={{ color: G, fontSize: '0.9rem', opacity: 0.3, width: 24 }}>{p.n}</div>
              <div>
                <div className="at mb-1" style={{ color: G, fontSize: '1rem' }}>{p.title}</div>
                <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '0.95rem' }}>{p.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zone visual identity */}
      <div>
        <div className="am mb-4" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.3em', opacity: 0.55 }}>[ZONE VISUAL IDENTITY]</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ZONE_VISUALS.map(z => (
            <div key={z.zone} className="p-4" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${WARN}` }}>
              <div className="at mb-1" style={{ color: PALE, fontSize: '1rem' }}>{z.zone}</div>
              <div className="am mb-2" style={{ color: WARN, fontSize: '0.65rem', opacity: 0.6, letterSpacing: '0.2em' }}>TIME: {z.time}</div>
              <div className="ab mb-2" style={{ color: PALE, opacity: 0.55, fontSize: '0.85rem' }}><span style={{ color: G, opacity: 0.7 }}>Palette: </span>{z.palette}</div>
              <div className="ab italic" style={{ color: PALE, opacity: 0.72, fontSize: '0.9rem' }}>{z.feel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
