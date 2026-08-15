import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';
import { ZONES, Zone } from '@/data/abode/zones';
import { IntelCard } from './ui';

const GHANA_PATH = 'M 20 22 L 78 22 C 81 30 84 40 82 50 C 81 58 78 60 72 62 L 62 72 C 56 74 50 76 46 74 L 30 70 C 24 68 20 64 20 58 L 18 44 C 16 36 17 28 20 22 Z';

export const OpMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  return (
    <div>
      <div className="relative" style={{ border: `1px solid ${BORD}`, background: `${SURF}66`, padding: '1rem' }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="am" style={{ color: G, fontSize: '0.62rem', letterSpacing: '0.25em', opacity: 0.6 }}>FIELD MAP · GHANA — HAND-ANNOTATED</span>
          <span className="am" style={{ color: WARN, fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.4 }}>DISTORTED FOR ILLUSTRATION</span>
        </div>

        <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: 440 }}>
          <defs>
            <pattern id="mapgrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke={BORD} strokeOpacity="0.35" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#mapgrid)"/>
          <path d={GHANA_PATH} fill={`${SURF}88`} stroke={BORD} strokeWidth="0.8" strokeDasharray="2 1.4" />
          {ZONES.map(z => {
            const selected = activeZone?.id === z.id;
            return (
              <g key={z.id} onClick={() => setActiveZone(selected ? null : z)} style={{ cursor: 'pointer' }}>
                <circle cx={z.coords.x} cy={z.coords.y} r={selected ? 3.4 : 2.2}
                  fill={z.statusColor} fillOpacity={selected ? 0.95 : 0.7} stroke={BG} strokeWidth="0.4" />
                <line x1={z.coords.x - 6} y1={z.coords.y} x2={z.coords.x + 6} y2={z.coords.y} stroke={z.statusColor} strokeWidth="0.5" opacity="0.6"/>
                <line x1={z.coords.x} y1={z.coords.y - 6} x2={z.coords.x} y2={z.coords.y + 6} stroke={z.statusColor} strokeWidth="0.5" opacity="0.6"/>
                <text x={z.coords.x + 5} y={z.coords.y - 4} fill={PALE} fontSize="3" fontFamily="VT323, monospace" opacity="0.75" letterSpacing="0.3">
                  {z.label.split(' / ')[0]} · {z.act}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex flex-wrap gap-4 mt-3 pt-3" style={{ borderTop: `1px dashed ${BORD}` }}>
          {ZONES.map(z => (
            <button key={z.id} onClick={() => setActiveZone(activeZone?.id === z.id ? null : z)}
              className="am" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: z.statusColor, opacity: activeZone?.id === z.id ? 1 : 0.6 }}>
              ● {z.label} — {z.status}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeZone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="mt-4 p-5" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${activeZone.statusColor}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="am" style={{ color: activeZone.statusColor, fontSize: '0.7rem', letterSpacing: '0.25em' }}>{activeZone.label} · {activeZone.act}</span>
              <span className="am" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.35 }}>STATUS: {activeZone.status}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <IntelCard category="Threat" content={activeZone.threat} />
              <IntelCard category="Resources" content={activeZone.resources} />
            </div>
            <div className="mt-3">
              <div className="am mb-1" style={{ color: G, fontSize: '0.65rem', letterSpacing: '0.25em', opacity: 0.5 }}>INTEL</div>
              <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '0.95rem' }}>{activeZone.intel}</p>
            </div>
            <div className="mt-3 space-y-1" style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
              {activeZone.locations.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="am" style={{ color: WARN, opacity: 0.45, fontSize: '0.7rem' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="ab" style={{ color: PALE, opacity: 0.65, fontSize: '0.9rem' }}>{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
