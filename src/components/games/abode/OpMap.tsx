import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, WARN, PALE, SURF, BORD } from '@/data/abode/theme';
import { ZONES, Zone } from '@/data/abode/zones';
import { IntelCard } from './ui';
import opMapRaw from '@/assets/svgs/abode/opMap.svg?raw';
import markerPin from '@/assets/svgs/abode/markerPin.svg';

const OP_MAP_SVG = opMapRaw
  .replace('viewbox="0 0 1000 1000"', 'viewBox="0 0 1000 1000"')
  .replace('<svg', '<svg style="display:block;width:100%;height:100%"')
  .replace('width="1000"', '')
  .replace('height="1000"', '');

const GROUP_TO_ZONE: Record<string, string> = {
  g3: 'tema',
  g2: 'coast',
  g4: 'kumasi',
  g5: 'north',
};

export const OpMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [hoverZone, setHoverZone] = useState<Zone | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const groupId = (e.target as Element)?.closest('g[id]')?.id ?? '';
    const zoneId = GROUP_TO_ZONE[groupId];
    if (!zoneId) return;
    const zone = ZONES.find(z => z.id === zoneId);
    if (zone) setActiveZone(activeZone?.id === zone.id ? null : zone);
  };

  return (
    <div>
      <div className="relative" style={{ border: `1px solid ${BORD}`, background: `${SURF}66`, padding: '1rem' }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="am" style={{ color: G, fontSize: '0.62rem', letterSpacing: '0.25em', opacity: 0.6 }}>FIELD MAP · GHANA — HAND-ANNOTATED</span>
          <span className="am" style={{ color: WARN, fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.4 }}>DISTORTED FOR ILLUSTRATION</span>
        </div>

        <div className="w-full relative" id="opmap" onClick={handleMapClick}
          style={{ aspectRatio: '1 / 1', maxWidth: 440, maxHeight: 440, margin: '0 auto' }}>
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: OP_MAP_SVG }} />
          {ZONES.map(z => (
            <div key={z.id} className="opin-wrap" style={{ left: `${z.coords.x}%`, top: `${z.coords.y}%` }}
              onMouseEnter={() => setHoverZone(z)} onMouseLeave={() => setHoverZone(null)}>
              <img src={markerPin} alt={z.label} className="opin" />
              {hoverZone?.id === z.id && (
                <div className="opin-tip">
                  <span className="am" style={{ color: G, fontSize: '0.62rem', letterSpacing: '0.15em' }}>{z.label}</span>
                  <span className="am" style={{ color: PALE, fontSize: '0.58rem', letterSpacing: '0.2em', opacity: 0.7 }}>{z.act}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <style>{`
          #opmap #g4, #opmap #g5, #opmap #g3, #opmap #g2 { transform-box: fill-box; transform-origin: center; transition: transform .25s ease; cursor: pointer; }
          #opmap #g4:hover { transform: scale(1.03); }
          #opmap #g5:hover { transform: scale(1.03); }
          #opmap #g3:hover { transform: scale(1.03); }
          #opmap #g2:hover { transform: scale(1.03); }
          #opmap .opin-wrap { position: absolute; width: 26px; transform: translate(-50%, -87.5%); cursor: default; }
          #opmap .opin { width: 100%; display: block; transition: transform .2s ease; filter: drop-shadow(0 1px 2px rgba(0,0,0,.8)); }
          #opmap .opin-wrap:hover .opin { transform: scale(1.2); }
          #opmap .opin-tip { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: ${SURF}; border: 1px solid ${BORD}; padding: 4px 8px; white-space: nowrap; display: flex; flex-direction: column; align-items: center; gap: 1px; box-shadow: 0 2px 8px rgba(0,0,0,.5); pointer-events: none; }
        `}</style>

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
