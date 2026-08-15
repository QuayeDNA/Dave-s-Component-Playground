import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  G, WARN, PALE, BG, SURF, BORD, FONTS, CSS, TITLE,
} from '@/data/abode/theme';
import { PERSONNEL, STAT_LABELS } from '@/data/abode/characters';
import { ZONE_VISUALS } from '@/data/abode/zones';
import { BEATS, BEAT_COLORS, BEAT_TYPE_LABELS, BeatType } from '@/data/abode/beats';
import { SYSTEMS } from '@/data/abode/systems';
import { PALETTE_DATA, DESIGN_PRINCIPLES } from '@/data/abode/art';
import { AUDIO_ZONES, SOUND_DESIGN } from '@/data/abode/audio';
import { RESEARCH_ENTRIES, RESEARCH_CATEGORIES, RESEARCH_CATEGORY_COLORS } from '@/data/abode/research';
import { INCIDENTS } from '@/data/abode/incidents';
import type { ResearchCat } from '@/data/abode/types';
import { FieldNote, IntelCard, ManualEntry, MissionBrief } from './abode/ui';
import { OpMap } from './abode/OpMap';
import { EvidenceLocker } from './abode/EvidenceLocker';

// ── SECTION REGISTRY ──────────────────────────────────────────

const SECTIONS = [
  { id: 'overview',    label: 'OVERVIEW' },
  { id: 'situation',   label: 'SITUATION' },
  { id: 'personnel',   label: 'PERSONNEL' },
  { id: 'systems',     label: 'SYSTEMS' },
  { id: 'incidents',   label: 'INCIDENTS' },
  { id: 'opmap',       label: 'OP MAP' },
  { id: 'comparison',  label: 'COMPARISON' },
  { id: 'timeline',    label: 'TIMELINE' },
  { id: 'art',         label: 'ART BRIEF' },
  { id: 'audio',       label: 'AUDIO' },
  { id: 'research',    label: 'RESEARCH' },
  { id: 'locker',      label: 'EVIDENCE LOCKER' },
];

// ── HOOKS ─────────────────────────────────────────────────────

function useSectionObserver() {
  const [activeId, setActiveId] = useState<string>('');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return activeId;
}

// ── STICKY NAV ────────────────────────────────────────────────

const StickyNav: React.FC<{ activeId: string }> = ({ activeId }) => (
  <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col" style={{ gap: 0 }}>
    {SECTIONS.map((s, i) => {
      const isActive = activeId === s.id;
      const num = String(i + 1).padStart(2, '0');
      return (
        <motion.button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          animate={{ x: isActive ? 5 : 0 }}
          transition={{ duration: 0.18 }}
          title={s.label}
          style={{
            width: 28, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isActive ? WARN : SURF,
            borderRight: `2px solid ${isActive ? WARN : BORD}`,
            borderBottom: `1px solid ${BORD}44`,
            cursor: 'pointer',
            transition: 'background 0.18s',
          }}
        >
          <span className="am" style={{
            fontSize: '0.48rem', letterSpacing: '0.04em',
            color: isActive ? BG : PALE, opacity: isActive ? 1 : 0.32,
          }}>{num}</span>
        </motion.button>
      );
    })}
  </nav>
);

// ── PRIMITIVES ────────────────────────────────────────────────

const ASection: React.FC<{ id?: string; label: string; stamp?: string; children: React.ReactNode }> = ({ id, label, stamp, children }) => (
  <motion.div id={id} className="mb-20 scroll-mt-20"
    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}>
    {/* Document section header — left accent bar + warm tint */}
    <div className="flex items-stretch mb-8">
      <div style={{ width: 4, background: `${WARN}55`, flexShrink: 0 }} />
      <div className="flex items-center flex-1 px-5 py-3"
        style={{ background: `${WARN}07`, borderTop: `1px solid ${BORD}`, borderBottom: `1px solid ${BORD}` }}>
        <span className="at" style={{ color: PALE, fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.82 }}>
          {label}
        </span>
      </div>
      {stamp && (
        <div className="flex items-center px-5" style={{
          borderTop: `1px solid ${BORD}`, borderBottom: `1px solid ${BORD}`,
          borderRight: `1px solid ${BORD}`, flexShrink: 0,
        }}>
          <span className="astamp" style={{ fontSize: '0.62rem', opacity: 0.52 }}>{stamp}</span>
        </div>
      )}
    </div>
    {children}
  </motion.div>
);

const DossierCard: React.FC<{ id: string; name: string; role: string; status: string; description: string; details: string[] }> = ({ id, name, role, status, description, details }) => (
  <motion.div className="mb-4 relative" initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}
    style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${G}`, padding: '1.5rem' }}>
    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
      <div>
        <div className="am" style={{ color: G, fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.3em' }}>ID-{id} · {role.toUpperCase()}</div>
        <h3 className="at leading-none mt-1" style={{ color: PALE, fontSize: '1.6rem', letterSpacing: '0.02em' }}>{name}</h3>
      </div>
      <span className="astamp" style={{ fontSize: '0.65rem' }}>{status}</span>
    </div>
    <p className="ab mb-4 leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '1rem' }}>{description}</p>
    {details.length > 0 && (
      <div style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
        {details.map((d, i) => (
          <div key={i} className="flex gap-3 mb-1">
            <span className="am" style={{ color: G, opacity: 0.45, fontSize: '0.8rem' }}>{'>'}</span>
            <span className="ab" style={{ color: PALE, opacity: 0.65, fontSize: '0.9rem' }}>{d}</span>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

const IncidentBlock: React.FC<{ phase: string; title: string; location: string; body: string }> = ({ phase, title, location, body }) => (
  <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}
    style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `4px solid ${WARN}`, padding: '1.25rem 1.5rem' }}>
    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
      <div className="am" style={{ color: WARN, fontSize: '0.85rem', letterSpacing: '0.25em', opacity: 0.8 }}>PHASE {phase}</div>
      <div className="am" style={{ color: PALE, fontSize: '0.75rem', opacity: 0.35, letterSpacing: '0.2em' }}>LOCATION: {location.toUpperCase()}</div>
    </div>
    <h4 className="at mb-2" style={{ color: PALE, fontSize: '1.3rem', letterSpacing: '0.03em' }}>{title}</h4>
    <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '1rem' }}>{body}</p>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// 07 — PERSONNEL COMPARISON
// Side-by-side dossier comparison. Stats look hand-filled
// on a printed form — scratch-mark bars, typed numbers.
// ─────────────────────────────────────────────────────────────

const ScratchBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div className="abar-track" style={{ marginTop: 4, marginBottom: 8 }}>
    <motion.div className="abar-fill" style={{ background: color, width: `${value}%` }}
      initial={{ width: 0 }} whileInView={{ width: `${value}%` }}
      viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut' }}/>
  </div>
);

const PersonnelComparison: React.FC = () => {
  const [activeId, setActiveId] = useState('KM-001');
  const person = PERSONNEL.find(p => p.id === activeId)!;

  return (
    <div>
      {/* Tab row — personnel file tabs */}
      <div className="flex gap-1 flex-wrap mb-6 overflow-x-auto" style={{ borderBottom: `1px dashed ${BORD}`, paddingBottom: '0.75rem' }}>
        {PERSONNEL.map(p => (
          <button key={p.id} onClick={() => setActiveId(p.id)}
            className="am px-3 py-1.5 transition-all duration-200 flex-shrink-0"
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

// ─────────────────────────────────────────────────────────────
// 08 — DUAL-TRACK EVENT TIMELINE
// Two parallel tracks: Kwame's journey and Ama's unseen story.
// Gap between them = narrative uncertainty = emotional engine.
// ─────────────────────────────────────────────────────────────

const DualTimeline: React.FC = () => {
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
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="am" style={{ color: PALE, fontSize: '0.7rem', letterSpacing: '0.25em', opacity: 0.5 }}>▶ KWAME'S TRACK</div>
        <div className="am" style={{ color: WARN, fontSize: '0.7rem', letterSpacing: '0.25em', opacity: 0.5 }}>▶ AMA'S TRACK <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>[UNKNOWN TO KWAME UNTIL REUNION]</span></div>
      </div>

      {/* Dual track grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          <div className="flex-1 h-[1px]" style={{ background: G, opacity: 0.3 }}/>
          <div className="am" style={{ color: G, fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.7 }}>▲ TRACKS CONVERGE — REUNION</div>
          <div className="flex-1 h-[1px]" style={{ background: G, opacity: 0.3 }}/>
        </div>
      )}

      {/* Beat detail */}
      <AnimatePresence>
        {beat && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-5 mt-2"
            style={{ background: `${BEAT_COLORS[beat.type]}0a`, border: `1px solid ${BEAT_COLORS[beat.type]}30`, borderLeft: `3px solid ${BEAT_COLORS[beat.type]}` }}>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="am" style={{ color: BEAT_COLORS[beat.type], fontSize: '0.7rem', letterSpacing: '0.25em' }}>
                {beat.track === 'kwame' ? 'KWAME' : 'AMA'} · ACT {beat.act} · {BEAT_TYPE_LABELS[beat.type]}
              </span>
              {!beat.known && <span className="astamp" style={{ fontSize: '0.55rem' }}>UNKNOWN TO KWAME</span>}
            </div>
            <h4 className="at mb-1" style={{ color: PALE, fontSize: '1.2rem' }}>{beat.label}</h4>
            <div className="am mb-3" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.35 }}>{beat.location}</div>
            <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.8, fontSize: '1rem' }}>{beat.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 09 — VISUAL DIRECTIVE (ART DIRECTION)
// Color palette, design principles, zone visual identity.
// Styled as a director's visual brief — field-annotated.
// ─────────────────────────────────────────────────────────────

const ArtDirective: React.FC = () => {
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

// ─────────────────────────────────────────────────────────────
// 10 — AUDIO DIRECTIVE
// Zone accordion + sound design notes.
// Styled as a director's audio brief on a clipboard.
// ─────────────────────────────────────────────────────────────

const AudioDirective: React.FC = () => {
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

// ─────────────────────────────────────────────────────────────
// 11 — RESEARCH & CULTURAL NOTES
// Production bible research section — feels like a reference
// binder assembled for the dev team. Categories, entries,
// and an accuracy commitment charter.
// ─────────────────────────────────────────────────────────────

const ResearchPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ResearchCat | 'all'>('all');
  const [activeEntry, setActiveEntry] = useState<string | null>(null);

  const categories = RESEARCH_CATEGORIES;
  const filtered = RESEARCH_ENTRIES.filter(e => activeCategory === 'all' || e.category === activeCategory);
  const entry = RESEARCH_ENTRIES.find(e => e.id === activeEntry);

  const catColors = RESEARCH_CATEGORY_COLORS;

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {categories.map(c => {
          const color = c === 'all' ? G : catColors[c] || G;
          return (
            <button key={c} onClick={() => { setActiveCategory(c); setActiveEntry(null); }}
              className="am px-2 py-1 transition-all text-left"
              style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: activeCategory === c ? BG : color, background: activeCategory === c ? color : `${color}10`, border: `1px solid ${activeCategory === c ? color : `${color}30`}` }}>
              {c === 'all' ? 'ALL' : c}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Entry list */}
        <div className="md:col-span-2 space-y-1">
          {filtered.map(e => {
            const color = catColors[e.category] || G;
            return (
              <button key={e.id} onClick={() => setActiveEntry(activeEntry === e.id ? null : e.id)}
                className="w-full text-left p-3 transition-all"
                style={{ background: activeEntry === e.id ? `${color}10` : 'transparent', border: `1px solid ${activeEntry === e.id ? `${color}30` : 'transparent'}`, borderLeft: `2px solid ${activeEntry === e.id ? color : `${color}30`}` }}>
                <div className="am mb-0.5" style={{ color, fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.6 }}>{e.category}</div>
                <div className="at" style={{ color: PALE, fontSize: '0.95rem', opacity: activeEntry === e.id ? 1 : 0.75 }}>{e.title}</div>
              </button>
            );
          })}
        </div>

        {/* Entry content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {entry ? (
              <motion.div key={entry.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                className="p-5" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${catColors[entry.category] || G}`, minHeight: 280 }}>
                <div className="am mb-1" style={{ color: catColors[entry.category] || G, fontSize: '0.65rem', letterSpacing: '0.25em', opacity: 0.6 }}>{entry.category}</div>
                <h3 className="at mb-4" style={{ color: PALE, fontSize: '1.2rem' }}>{entry.title}</h3>
                <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.8, fontSize: '1rem', lineHeight: 1.85 }}>{entry.content}</p>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
                className="flex items-center justify-center" style={{ border: `1px dashed ${BORD}`, minHeight: 280 }}>
                <div className="am text-center" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.25em' }}>
                  SELECT AN ENTRY<br/><span style={{ opacity: 0.5, fontSize: '0.65rem' }}>TO READ RESEARCH NOTES</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
const AbodePage: React.FC = () => {
  const navigate = useNavigate();
  const activeSection = useSectionObserver();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <div className="ag ascan" style={{ background: BG, minHeight: '100vh', color: PALE }}>
      <style>{FONTS + CSS}</style>

      <StickyNav activeId={activeSection} />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative flex flex-col overflow-hidden" style={{ minHeight: '100vh' }}>

        {/* Warm ambient glow — centered */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 52% 52% at 50% 48%, ${WARN}0a, transparent 65%), ${BG}` }} />

        {/* Radar / sonar rings — pulsing outward from center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[300, 220, 148, 82].map((r, i) => (
            <motion.div key={`pulse-${i}`} className="absolute rounded-full"
              style={{ width: r * 2, height: r * 2, border: `1px solid ${WARN}`, opacity: 0 }}
              animate={{ opacity: [0, 0.055, 0], scale: [0.88, 1, 1.10] }}
              transition={{ duration: 5.5, delay: i * 1.4, repeat: Infinity, ease: 'easeOut' }} />
          ))}
          {[340, 265, 188, 116, 52].map((r, i) => (
            <div key={`ring-${i}`} className="absolute rounded-full"
              style={{ width: r * 2, height: r * 2, border: `1px solid ${BORD}`, opacity: 0.1 }} />
          ))}
          <div className="absolute inset-x-0" style={{ top: '50%', height: 1, background: BORD, opacity: 0.07 }} />
          <div className="absolute inset-y-0" style={{ left: '50%', width: 1, background: BORD, opacity: 0.07 }} />
        </div>

        {/* ── TOP CLASSIFICATION STRIP ── */}
        <div className="relative z-10 flex-shrink-0"
          style={{ borderBottom: `1px solid ${WARN}20`, background: `${WARN}08` }}>
          <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between">
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => navigate('/games')}
              className="flex items-center gap-2"
              style={{ color: WARN, opacity: 0.42 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.42')}>
              <ArrowLeft size={10} />
              <span className="am" style={{ fontSize: '0.58rem', letterSpacing: '0.3em' }}>RETURN TO GAME INDEX</span>
            </motion.button>
            <div className="flex items-center gap-6">
              <div className="am" style={{ color: WARN, fontSize: '0.52rem', letterSpacing: '0.35em', opacity: 0.38 }}>
                TOP SECRET // SCI // NOFORN · REF: GH-ZB-MENSAH-02
              </div>
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => navigate('/games/abode/dev-tracker')}
                style={{ color: G, opacity: 0.42 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.42')}>
                <span className="am" style={{ fontSize: '0.58rem', letterSpacing: '0.3em' }}>OPEN PRODUCTION TRACKER</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── HERO CONTENT — centered dossier cover ── */}
        <motion.div style={{ opacity: heroOpacity }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 0.1 }}
            className="am mb-5" style={{ color: WARN, fontSize: '0.62rem', letterSpacing: '0.48em' }}>
            {TITLE.operation}
          </motion.div>

          <motion.h1 className="at afl"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.2 }}
            style={{ fontSize: 'clamp(3.5rem, 13vw, 7rem)', color: PALE, letterSpacing: '0.12em', lineHeight: 1, marginBottom: '0.35rem' }}>
            {TITLE.name}
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.52 }} transition={{ delay: 0.38 }}
            className="am mb-8" style={{ color: G, fontSize: '0.68rem', letterSpacing: '0.45em' }}>
            [ {TITLE.translation} ]
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.52, duration: 0.55, ease: 'easeOut' }}
            style={{ width: 88, height: 1, background: `${WARN}45`, marginBottom: '2rem', transformOrigin: 'center' }} />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.72 }} transition={{ delay: 0.58, duration: 0.55 }}
            className="ab italic leading-loose max-w-lg mb-10"
            style={{ color: PALE, fontSize: '1.05rem' }}>
            The dead walk through Accra's streets. Colonel Kwame Mensah has survived wars he chose.
            This one chose him — and his children are somewhere in it.
          </motion.p>

          {/* Document metadata grid */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
            className="w-full max-w-md mb-10" style={{ border: `1px solid ${BORD}`, background: `${SURF}90` }}>
            <div className="grid grid-cols-3">
              {[
                { label: 'SUBJECT',  value: 'COL. K. MENSAH'  },
                { label: 'SETTING',  value: 'GHANA'            },
                { label: 'STATUS',   value: 'DESIGN PHASE'     },
              ].map((item, i) => (
                <div key={i} className="px-3 py-2.5"
                  style={{ borderRight: i < 2 ? `1px solid ${BORD}` : 'none' }}>
                  <div className="am" style={{ color: G, fontSize: '0.46rem', letterSpacing: '0.25em', opacity: 0.42, marginBottom: '3px' }}>{item.label}</div>
                  <div className="at" style={{ color: PALE, fontSize: '0.68rem', letterSpacing: '0.05em', opacity: 0.85 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2" style={{ borderTop: `1px solid ${BORD}`, background: `${BG}60` }}>
              <span className="am" style={{ color: PALE, fontSize: '0.46rem', letterSpacing: '0.18em', opacity: 0.2 }}>
                SURVIVAL NARRATIVE · NEAR-FUTURE GHANA · OUTBREAK / SEPARATION / RECOVERY
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 1.0 }}
            className="am flex items-center gap-2" style={{ color: G, fontSize: '0.6rem', letterSpacing: '0.38em' }}>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>|</motion.span>
            SCROLL TO READ FIELD REPORT
          </motion.div>
        </motion.div>

        {/* ── BOTTOM CLASSIFICATION STRIP ── */}
        <div className="relative z-10 flex-shrink-0" style={{ borderTop: `1px solid ${BORD}28` }}>
          <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between">
            <span className="am" style={{ color: WARN, fontSize: '0.48rem', letterSpacing: '0.3em', opacity: 0.28 }}>
              HANDLE VIA SI CHANNELS ONLY
            </span>
            <span className="am" style={{ color: PALE, fontSize: '0.48rem', letterSpacing: '0.2em', opacity: 0.16 }}>
              DRAFT {TITLE.draft} · ALL {SECTIONS.length} SECTIONS
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl xl:max-w-5xl mx-auto px-6 py-12 xl:pl-28">

        <ASection id="overview" label="01 — Intelligence Overview" stamp="VERIFIED">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { category: 'Classification', content: '2D Side-Scrolling Survival / Narrative Action — flat level design with resource management and scavenging loops.' },
              { category: 'Operational Tone', content: "Grim, grounded, and emotionally tethered. The Last of Us pacing inside Earth Taken's aesthetic — but set in Ghana." },
              { category: 'Influence Sources', content: "Earth Taken (art style, atmosphere), The Last Stand (level structure, resource loops), This War of Mine (civilian weight, moral decisions)." },
              { category: 'Visual Profile', content: "Muted earth tones: rust, clay, grey concrete. Recognizably Ghanaian architecture — kiosks, compounds, red laterite roads, market streets gone silent." },
            ].map(item => <IntelCard key={item.category} category={item.category} content={item.content} />)}
          </div>
        </ASection>

        <ASection id="situation" label="02 — Situation Report" stamp="SENSITIVE">
          <FieldNote>A near-future Ghana. The outbreak began in the north and spread south within weeks, overwhelming NADMO and the Ghana Armed Forces. By the time Accra fell, communications were down. The government broadcast a single evacuation order — <span style={{ color: WARN, fontFamily: "'Special Elite', cursive" }}>D-Day</span> — and the country tried to move.</FieldNote>
          <FieldNote>The game's world cycles through recognizable Ghanaian locations: Osu neighborhoods with collapsed bars and chop shops. Tema Industrial Area with warehouses. The Cape Coast highway strewn with abandoned vehicles. Kumasi's market district. Each zone feels culturally specific — not a generic grey city.</FieldNote>
          <FieldNote>The story is not about the outbreak. It's about a father who spent his career protecting strangers, now having to navigate a collapsed world to protect the two people who actually matter.</FieldNote>
          <MissionBrief label="Thematic Core" text="What does a soldier become when there's no mission — only family? Kwame's entire skill set was built for other people's wars. This one is personal, and that changes everything." />
        </ASection>

        <ASection id="personnel" label="03 — Personnel Files" stamp="RESTRICTED">
          {PERSONNEL.map(p => (
            <DossierCard key={p.id} id={p.id} name={p.name} role={p.role} status={p.status}
              description={p.description} details={p.details} />
          ))}
        </ASection>

        <ASection id="systems" label="04 — Systems Manual" stamp="OPERATIONAL">
          {SYSTEMS.map(s => (
            <ManualEntry key={s.id} number={s.number} title={s.title} body={s.body} />
          ))}
        </ASection>

        <ASection id="incidents" label="05 — Incident Log" stamp="CHRONOLOGICAL">
          {INCIDENTS.map(inc => (
            <IncidentBlock key={inc.phase} phase={inc.phase} title={inc.title} location={inc.location} body={inc.body} />
          ))}
        </ASection>

        <ASection id="opmap" label="06 — Operational Map" stamp="FIELD ANNOTATED">
          <OpMap />
        </ASection>

        <ASection id="comparison" label="07 — Personnel Comparison" stamp="ASSESSMENT">
          <div className="am mb-4" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.4, letterSpacing: '0.2em' }}>
            SELECT PERSONNEL FILE TO VIEW CAPABILITY ASSESSMENT →
          </div>
          <PersonnelComparison />
        </ASection>

        <ASection id="timeline" label="08 — Event Timeline" stamp="DUAL TRACK">
          <div className="ab italic mb-4"
            style={{ color: PALE, opacity: 0.55, fontSize: '0.95rem', borderLeft: `2px solid ${WARN}30`, paddingLeft: '1rem' }}>
            Two tracks: what Kwame experienced, and what Ama experienced while he was searching. The gap between the tracks — everything she did that he didn't see — is the emotional engine of Act II. Select a beat to expand.
          </div>
          <DualTimeline />
        </ASection>

        <ASection id="art" label="09 — Visual Directive" stamp="ART BRIEF">
          <ArtDirective />
        </ASection>

        <ASection id="audio" label="10 — Audio Directive" stamp="SOUND BRIEF">
          <AudioDirective />
        </ASection>

        <ASection id="research" label="11 — Research & Cultural Notes" stamp="REFERENCE">
          <MissionBrief label="Accuracy Commitment" text="This game is set in Ghana, made about Ghanaian people, and will be played by Ghanaian players. Every cultural detail — language, architecture, social dynamics, spiritual belief — must be treated with the same rigor as the gameplay systems. Cultural accuracy is not a polish step. It is foundational." />
          <ResearchPanel />
        </ASection>

        <ASection id="locker" label="12 — Evidence Locker" stamp="ASSET REGISTRY">
          <EvidenceLocker />
        </ASection>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px dashed ${BORD}`, padding: '1.5rem', textAlign: 'center' }}>
        <div className="am" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.25, letterSpacing: '0.3em' }}>
          {TITLE.romanised} · DESIGN BIBLE · DRAFT {TITLE.draft} · ALL {SECTIONS.length} SECTIONS COMPLETE
        </div>
      </div>
    </div>
  );
};

export default AbodePage;