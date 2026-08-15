import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { G, WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';
import { ASSETS } from '@/data/abode/assets';
import type { AssetItem } from '@/data/abode/assets';
import { StatusChip } from './ui';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

const CATEGORIES = ['ALL', 'Concept Art', 'Character', 'UI', 'Audio', 'Map', 'Reference'];

export const EvidenceLocker: React.FC = () => {
  const [category, setCategory] = useState('ALL');
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<AssetItem | null>(null);

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
              <div className="relative aspect-video flex items-center justify-center overflow-hidden"
                style={{ background: BG, borderBottom: `1px solid ${BORD}`, cursor: showFile && a.category !== 'Audio' ? 'zoom-in' : 'default' }}
                onClick={() => { if (showFile && a.category !== 'Audio') setSelected(a); }}>
                {showFile ? (
                  a.category === 'Audio' ? (
                    <audio controls src={a.src} className="w-full px-3" onError={() => setMissing(m => ({ ...m, [a.id]: true }))} />
                  ) : (
                    <img src={a.src} alt={a.name} className="w-full h-full object-cover transition-transform duration-500"
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      onError={() => setMissing(m => ({ ...m, [a.id]: true }))} />
                  )
                ) : (
                  <span className="am" style={{ color: WARN, fontSize: '0.6rem', letterSpacing: '0.22em', opacity: 0.55 }}>ASSET PENDING CLEARANCE</span>
                )}
                {showFile && a.category !== 'Audio' && (
                  <span className="am absolute bottom-1.5 right-2" style={{ color: PALE, fontSize: '0.55rem', letterSpacing: '0.18em', opacity: 0.5 }}>CLICK TO ENLARGE</span>
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

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent
          className="w-full max-w-4xl max-h-[90vh] p-0 gap-0 rounded-none sm:rounded-none bg-[#1a1610] border border-[#3d3020] grid [&>button]:hidden"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          <div className="flex flex-col min-h-0 max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
              style={{ background: `${WARN}12`, borderBottom: `1px solid ${WARN}28` }}>
              <span className="am" style={{ color: WARN, fontSize: '0.6rem', letterSpacing: '0.25em', opacity: 0.75 }}>
                EVIDENCE FILE · {selected?.id.toUpperCase()}
              </span>
              <DialogClose asChild>
                <button
                  aria-label="Close preview"
                  className="am transition-all"
                  style={{ color: PALE, fontSize: '0.7rem', letterSpacing: '0.15em', border: `1px solid ${BORD}`, padding: '0.15rem 0.6rem', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.color = BG; e.currentTarget.style.background = WARN; }}
                  onMouseLeave={e => { e.currentTarget.style.color = PALE; e.currentTarget.style.background = 'transparent'; }}>
                  [ X ] CLOSE
                </button>
              </DialogClose>
            </div>

            {selected && (
              <div className="relative flex-1 min-h-0 flex items-center justify-center" style={{ background: BG }}>
                <img src={selected.src} alt={selected.name} className="max-w-full max-h-full object-contain" />
                <span className="am absolute bottom-2 right-3" style={{ color: PALE, fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.4 }}>
                  REF · {selected.id.toUpperCase()} / LARGE PREVIEW
                </span>
              </div>
            )}

            <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${BORD}` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="at" style={{ color: PALE, fontSize: '1.15rem', letterSpacing: '0.03em' }}>{selected?.name}</DialogTitle>
                  <div className="am mt-1.5" style={{ color: G, fontSize: '0.62rem', letterSpacing: '0.16em', opacity: 0.7 }}>
                    {selected?.category.toUpperCase()} · SOURCE DATA
                  </div>
                  <DialogDescription className="am mt-1" style={{ color: PALE, fontSize: '0.66rem', opacity: 0.55, lineHeight: 1.7 }}>
                    {selected?.source}
                  </DialogDescription>
                </div>
                {selected && <StatusChip status={selected.status} />}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
