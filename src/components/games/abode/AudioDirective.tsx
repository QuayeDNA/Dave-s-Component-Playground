import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, PALE, SURF, BORD } from '@/data/abode/theme';
import { AUDIO_ZONES, SOUND_DESIGN } from '@/data/abode/audio';
import { MissionBrief } from './ui';

export const AudioDirective: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <div className="am mb-4" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.3em', opacity: 0.55 }}>[ZONE AUDIO BRIEF]</div>
        <MissionBrief label="Overall Philosophy" text="Abɔde's sound design should make Ghana audible even in collapse. The music doesn't abandon its roots when the world falls apart. Highlife rhythms decay into something haunted. The collapse sounds like Ghana breaking — not like a generic Western zombie soundtrack." />
        <div className="space-y-1 mt-6">
          {AUDIO_ZONES.map(z => (
            <div key={z.zone}>
              <button className="w-full text-left p-4 flex items-center justify-between transition-all"
                style={{ background: expanded === z.zone ? `${z.color}10` : SURF, border: `1px solid ${expanded === z.zone ? `${z.color}40` : BORD}` }}
                onClick={() => setExpanded(expanded === z.zone ? null : z.zone)}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: z.color }}/>
                  <span className="at" style={{ color: PALE, fontSize: '1rem' }}>{z.zone}</span>
                  <span className="am hidden sm:block" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.35 }}>{z.act} · {z.instruments.split(',')[0]}</span>
                </div>
                <span className="am" style={{ color: G, opacity: 0.4, fontSize: '0.7rem' }}>{expanded === z.zone ? '▲' : '▼'}</span>
              </button>
              <AnimatePresence>
                {expanded === z.zone && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ background: `${z.color}07`, borderLeft: `3px solid ${z.color}40` }}>
                      {[
                        { label: 'Instruments', val: z.instruments },
                        { label: 'Tempo', val: z.tempo },
                        { label: 'Mood', val: z.mood, full: true },
                        { label: 'Under Threat', val: z.threat, full: true },
                        { label: 'Reference Tracks', val: z.ref },
                        { label: 'Director Note', val: z.notes, full: true },
                      ].map(item => (
                        <div key={item.label} className={item.full ? 'sm:col-span-2' : ''}>
                          <div className="am mb-1" style={{ color: z.color, fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.5 }}>{item.label}</div>
                          <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '0.9rem' }}>{item.val}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="am mb-4" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.3em', opacity: 0.55 }}>[SOUND DESIGN NOTES]</div>
        <div className="space-y-3">
          {SOUND_DESIGN.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex gap-4 p-4" style={{ background: SURF, border: `1px solid ${BORD}` }}>
              <span className="am flex-shrink-0 pt-1" style={{ color: G, fontSize: '0.8rem', opacity: 0.4 }}>♪</span>
              <div>
                <div className="at mb-1" style={{ color: G, fontSize: '1rem' }}>{s.label}</div>
                <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '0.95rem' }}>{s.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
