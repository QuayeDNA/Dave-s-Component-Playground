import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { G, WARN, PALE, BG, SURF, BORD, FONTS, CSS, TITLE } from '@/data/abode/theme';
import { MILESTONES, SYSTEM_STATUS, BEAT_STATUS } from '@/data/abode/development';
import { SYSTEMS } from '@/data/abode/systems';
import { BEATS } from '@/data/abode/beats';
import { ASSETS } from '@/data/abode/assets';
import { FEATURE_WEIGHTS, STORY_WEIGHTS, ASSET_WEIGHTS, MILESTONE_WEIGHTS, pct } from '@/data/abode/types';
import { StatusChip, ProgressBar, MissionBrief } from './ui';

type Tab = 'roadmap' | 'systems' | 'narrative' | 'assets';

const TABS: { id: Tab; label: string }[] = [
  { id: 'roadmap', label: 'ROADMAP & MILESTONES' },
  { id: 'systems', label: 'SYSTEMS' },
  { id: 'narrative', label: 'NARRATIVE' },
  { id: 'assets', label: 'ASSET PIPELINE' },
];

const AbodeTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('roadmap');
  const [filter, setFilter] = useState<string>('ALL');

  const systemsPct = pct(SYSTEMS.map(s => FEATURE_WEIGHTS[SYSTEM_STATUS[s.id].status]));
  const narrativePct = pct(BEATS.map(b => STORY_WEIGHTS[BEAT_STATUS[b.id].status]));
  const assetsPct = pct(ASSETS.map(a => ASSET_WEIGHTS[a.status]));
  const milestonesPct = pct(MILESTONES.map(m => MILESTONE_WEIGHTS[m.status]));
  const overall = Math.round((systemsPct + narrativePct + assetsPct + milestonesPct) / 4);

  const filterOptions: Record<Tab, string[]> = {
    roadmap: ['ALL', 'active', 'planned', 'completed'],
    systems: ['ALL', 'concept', 'inProgress', 'built', 'tested', 'shipped'],
    narrative: ['ALL', 'draft', 'finalized', 'locked'],
    assets: ['ALL', 'concept', 'inProduction', 'final', 'integrated'],
  };

  const summary = [
    { label: 'SYSTEMS', pct: systemsPct, color: G },
    { label: 'NARRATIVE', pct: narrativePct, color: WARN },
    { label: 'ASSETS', pct: assetsPct, color: '#8ab0b8' },
    { label: 'MILESTONES', pct: milestonesPct, color: '#e8c84a' },
  ];

  const statusOf = (id: string) => SYSTEM_STATUS[id]?.status;

  return (
    <div className="ag ascan" style={{ background: BG, minHeight: '100vh', color: PALE }}>
      <style>{FONTS + CSS}</style>

      {/* Classification strip */}
      <div style={{ borderBottom: `1px solid ${WARN}20`, background: `${WARN}08` }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => navigate('/games/abode')}
            className="flex items-center gap-2"
            style={{ color: WARN, opacity: 0.42 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.42')}>
            <ArrowLeft size={10} />
            <span className="am" style={{ fontSize: '0.58rem', letterSpacing: '0.3em' }}>RETURN TO BIBLE</span>
          </motion.button>
          <div className="am hidden md:block" style={{ color: WARN, fontSize: '0.52rem', letterSpacing: '0.35em', opacity: 0.38 }}>
            TOP SECRET // SCI // NOFORN · PRODUCTION CHANNEL
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="am mb-3" style={{ color: WARN, fontSize: '0.62rem', letterSpacing: '0.4em', opacity: 0.5 }}>
            {TITLE.romanised} · PRODUCTION TRACKER · DRAFT {TITLE.draft}
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <h1 className="at" style={{ color: PALE, fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '0.08em', lineHeight: 1 }}>{TITLE.name}</h1>
            <div className="am" style={{ color: G, fontSize: '1.4rem', letterSpacing: '0.2em' }}>{overall}%</div>
          </div>
          <ProgressBar value={overall} color={WARN} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {summary.map(s => (
              <div key={s.label} className="p-3" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <div className="am mb-1" style={{ color: s.color, fontSize: '0.6rem', letterSpacing: '0.22em', opacity: 0.7 }}>{s.label}</div>
                <div className="am" style={{ color: PALE, fontSize: '1.1rem', opacity: 0.9 }}>{s.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap mb-6" style={{ borderBottom: `1px dashed ${BORD}`, paddingBottom: '0.75rem' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setFilter('ALL'); }}
              className="am px-3 py-1.5 transition-all"
              style={{
                fontSize: '0.68rem', letterSpacing: '0.2em',
                color: tab === t.id ? BG : G,
                background: tab === t.id ? G : `${G}10`,
                border: `1px solid ${tab === t.id ? G : `${G}30`}`,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-1 mb-6">
          {filterOptions[tab].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="am px-2 py-1 transition-all"
              style={{
                fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: filter === f ? BG : PALE,
                background: filter === f ? PALE : 'transparent',
                border: `1px solid ${filter === f ? PALE : `${PALE}30`}`,
              }}>
              {f === 'ALL' ? 'ALL' : f.replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {tab === 'roadmap' && (
              <div className="space-y-3">
                {MILESTONES.filter(m => filter === 'ALL' || m.status === filter).map(m => (
                  <div key={m.id} className="p-4" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${m.status === 'completed' ? G : m.status === 'active' ? '#e8c84a' : WARN}` }}>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="at" style={{ color: PALE, fontSize: '1.05rem' }}>{m.title}</span>
                      <StatusChip status={m.status} />
                    </div>
                    <p className="ab leading-relaxed mb-2" style={{ color: PALE, opacity: 0.72, fontSize: '0.95rem' }}>{m.summary}</p>
                    {m.notes && <p className="am mb-3" style={{ color: WARN, fontSize: '0.65rem', opacity: 0.6, letterSpacing: '0.08em' }}>{m.notes}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1" style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.6rem' }}>
                      {m.checklist.map((c, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="am" style={{ color: m.status === 'completed' ? G : PALE, opacity: 0.5, fontSize: '0.8rem' }}>{m.status === 'completed' ? '■' : '□'}</span>
                          <span className="ab" style={{ color: PALE, opacity: 0.65, fontSize: '0.85rem' }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'systems' && (
              <div className="space-y-3">
                {SYSTEMS.filter(s => filter === 'ALL' || statusOf(s.id) === filter).map(s => {
                  const st = SYSTEM_STATUS[s.id];
                  return (
                    <div key={s.id} className="p-4" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${G}` }}>
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="at" style={{ color: PALE, fontSize: '1rem' }}>{s.number} — {s.title}</span>
                        <StatusChip status={st.status} />
                      </div>
                      <p className="ab leading-relaxed mb-2" style={{ color: PALE, opacity: 0.72, fontSize: '0.95rem' }}>{s.body}</p>
                      <p className="am" style={{ color: WARN, fontSize: '0.65rem', opacity: 0.6, letterSpacing: '0.08em' }}>{st.notes}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'narrative' && (
              <div className="space-y-2">
                {BEATS.filter(b => filter === 'ALL' || BEAT_STATUS[b.id].status === filter).map(b => {
                  const st = BEAT_STATUS[b.id];
                  return (
                    <div key={b.id} className="p-3" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${b.track === 'kwame' ? G : WARN}55` }}>
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <span className="am" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.5, color: b.track === 'kwame' ? G : WARN }}>{b.track.toUpperCase()} · ACT {b.act}</span>
                        <div className="flex items-center gap-2">
                          {!b.known && <span className="am" style={{ fontSize: '0.55rem', letterSpacing: '0.18em', color: WARN, opacity: 0.6 }}>UNKNOWN TO KWAME</span>}
                          <StatusChip status={st.status} />
                        </div>
                      </div>
                      <div className="at" style={{ color: PALE, fontSize: '0.95rem' }}>{b.label}</div>
                      <div className="am" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.35 }}>{b.location}</div>
                      {st.notes && <div className="am mt-1" style={{ color: WARN, fontSize: '0.6rem', opacity: 0.6 }}>{st.notes}</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'assets' && (
              <div className="space-y-3">
                {[...new Set(ASSETS.map(a => a.category))].map(cat => {
                  const items = ASSETS.filter(a => a.category === cat && (filter === 'ALL' || a.status === filter));
                  if (items.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="am mb-2" style={{ color: G, fontSize: '0.6rem', letterSpacing: '0.25em', opacity: 0.5 }}>[{cat.toUpperCase()}]</div>
                      <div className="space-y-2">
                        {items.map(a => (
                          <div key={a.id} className="p-3" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="at" style={{ color: PALE, fontSize: '0.95rem' }}>{a.name}</span>
                              <StatusChip status={a.status} />
                            </div>
                            <div className="am mt-1" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.35 }}>{a.source}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <MissionBrief label="Tracking Philosophy" text="Statuses live in src/data/abode/development.ts and assets.ts. Update a status there and this page, the bible sections, and the Evidence Locker reflect it immediately. No hardcoded percentages." />

        <div style={{ borderTop: `1px dashed ${BORD}`, padding: '1.5rem', textAlign: 'center' }}>
          <div className="am" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.25, letterSpacing: '0.3em' }}>
            {TITLE.romanised} · PRODUCTION TRACKER · DRAFT {TITLE.draft}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbodeTrackerPage;
