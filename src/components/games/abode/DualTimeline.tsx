import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { G, WARN, PALE, SURF, BORD, BG } from '@/data/abode/theme';
import { BEATS, BEAT_COLORS, BEAT_TYPE_LABELS, BeatType } from '@/data/abode/beats';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export const DualTimeline: React.FC = () => {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [filterAct, setFilterAct] = useState<'all' | 'I' | 'II' | 'III'>('all');
  const beat = BEATS.find(b => b.id === selectedBeat);

  const kwaBeats = BEATS.filter(b => b.track === 'kwame' && (filterAct === 'all' || b.act === filterAct));
  const amaBeats = BEATS.filter(b => b.track === 'ama' && (filterAct === 'all' || b.act === filterAct));

  return (
    <div>
      {/* Act filter + legend */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {(['all','I','II','III'] as const).map(a => (
          <button key={a} onClick={() => setFilterAct(a)}
            className="am px-3 py-1 transition-all"
            style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: filterAct === a ? BG : G, background: filterAct === a ? G : `${G}10`, border: `1px solid ${filterAct === a ? G : `${G}30`}` }}>
            {a === 'all' ? 'ALL ACTS' : `ACT ${a}`}
          </button>
        ))}
        <div className="ml-auto flex flex-wrap gap-3">
          {(Object.entries(BEAT_TYPE_LABELS) as [BeatType, string][]).map(([t, l]) => (
            <div key={t} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: BEAT_COLORS[t] }}/>
              <span className="am" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.45 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Track labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div className="am" style={{ color: PALE, fontSize: '0.7rem', letterSpacing: '0.25em', opacity: 0.5 }}>▶ KWAME'S TRACK</div>
        <div className="am" style={{ color: WARN, fontSize: '0.7rem', letterSpacing: '0.25em', opacity: 0.5 }}>▶ AMA'S TRACK <span className="hidden sm:inline" style={{ fontSize: '0.6rem', opacity: 0.6 }}>[UNKNOWN TO KWAME UNTIL REUNION]</span></div>
      </div>

      {/* Dual track grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Kwame track */}
        <div className="space-y-2">
          {kwaBeats.map((b, i) => (
            <motion.button key={b.id} onClick={() => setSelectedBeat(selectedBeat === b.id ? null : b.id)}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="w-full text-left p-3 transition-all"
              style={{ background: selectedBeat === b.id ? `${BEAT_COLORS[b.type]}18` : SURF, border: `1px solid ${selectedBeat === b.id ? BEAT_COLORS[b.type] : BORD}`, borderLeft: `3px solid ${BEAT_COLORS[b.type]}` }}>
              <div className="am mb-0.5" style={{ color: BEAT_COLORS[b.type], fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.7 }}>ACT {b.act} · {BEAT_TYPE_LABELS[b.type]}</div>
              <div className="at" style={{ color: PALE, fontSize: '0.9rem' }}>{b.label}</div>
              <div className="am mt-0.5" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.35 }}>{b.location}</div>
            </motion.button>
          ))}
        </div>

        {/* Ama track */}
        <div className="space-y-2">
          {amaBeats.map((b, i) => (
            <motion.button key={b.id} onClick={() => setSelectedBeat(selectedBeat === b.id ? null : b.id)}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="w-full text-left p-3 transition-all relative"
              style={{ background: selectedBeat === b.id ? `${BEAT_COLORS[b.type]}18` : `${SURF}88`, border: `1px dashed ${selectedBeat === b.id ? BEAT_COLORS[b.type] : BORD}`, borderLeft: `3px solid ${BEAT_COLORS[b.type]}55`, opacity: 0.75 }}>
              {/* Unknown overlay */}
              <div className="am mb-0.5 flex items-center gap-2">
                <span style={{ color: WARN, fontSize: '0.6rem', opacity: 0.5 }}>?</span>
                <span style={{ color: BEAT_COLORS[b.type], fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.6 }}>ACT {b.act} · {BEAT_TYPE_LABELS[b.type]}</span>
              </div>
              <div className="at" style={{ color: PALE, fontSize: '0.9rem', opacity: 0.7 }}>{b.label}</div>
              <div className="am mt-0.5" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.3 }}>{b.location}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Merge indicator */}
      {(filterAct === 'all' || filterAct === 'III') && (
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: G, opacity: 0.3 }}/>
          <div className="am" style={{ color: G, fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.7 }}>▲ TRACKS CONVERGE — REUNION</div>
          <div className="flex-1 h-px" style={{ background: G, opacity: 0.3 }}/>
        </div>
      )}

      {/* Beat detail dialog */}
      <Dialog open={beat != null} onOpenChange={(open) => { if (!open) setSelectedBeat(null); }}>
        <DialogContent
          className="w-full max-w-2xl p-0 gap-0 rounded-none sm:rounded-none bg-[#1a1610] border border-[#3d3020] [&>button]:hidden"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          <div className="flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
              style={{ background: beat ? `${BEAT_COLORS[beat.type]}10` : 'transparent', borderBottom: `1px solid ${BORD}` }}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="am" style={{ color: beat ? BEAT_COLORS[beat.type] : PALE, fontSize: '0.6rem', letterSpacing: '0.25em' }}>
                  {beat ? `${beat.track === 'kwame' ? 'KWAME' : 'AMA'} · ACT ${beat.act} · ${BEAT_TYPE_LABELS[beat.type]}` : ''}
                </span>
                {beat && !beat.known && <span className="astamp" style={{ fontSize: '0.55rem' }}>UNKNOWN TO KWAME</span>}
              </div>
              <DialogClose asChild>
                <button aria-label="Close beat detail"
                  className="am transition-all"
                  style={{ color: PALE, fontSize: '0.7rem', letterSpacing: '0.15em', border: `1px solid ${BORD}`, padding: '0.15rem 0.6rem' }}>
                  [ X ] CLOSE
                </button>
              </DialogClose>
            </div>
            {beat && (
              <div className="p-5 sm:p-6 overflow-y-auto">
                <DialogTitle className="at mb-1" style={{ color: PALE, fontSize: '1.25rem', letterSpacing: '0.03em' }}>{beat.label}</DialogTitle>
                <DialogDescription className="am mb-4" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.35 }}>
                  {beat.location}
                </DialogDescription>
                <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.8, fontSize: '1rem', lineHeight: 1.8 }}>{beat.description}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
