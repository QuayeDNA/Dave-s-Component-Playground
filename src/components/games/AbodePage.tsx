import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// ABƆDE — VISUAL IDENTITY
// Survival field report / classified military dossier.
// Typewriter fonts, grain texture, dashed borders, red stamps.
// ─────────────────────────────────────────────────────────────

const G     = '#7ec87e'; // survival green
const WARN  = '#c8522a'; // blood orange / danger
const PALE  = '#c8b89a'; // aged paper
const BG    = '#0f0d0a';
const SURF  = '#1a1610';
const BORD  = '#3d3020';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=VT323&display=swap');`;

const CSS = `
  .ag::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.035;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px 200px;}
  .at{font-family:'Special Elite',cursive;}
  .ab{font-family:'Source Serif 4',Georgia,serif;}
  .am{font-family:'VT323',monospace;}
  .astamp{font-family:'Special Elite',cursive;color:#8b3a1a;border:3px solid #8b3a1a;opacity:.6;
    transform:rotate(-4deg);display:inline-block;padding:.2rem .6rem;letter-spacing:.15em;
    text-transform:uppercase;font-size:.75rem;pointer-events:none;user-select:none;}
  @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.4}94%{opacity:1}96%{opacity:.6}97%{opacity:1}}
  .afl{animation:flicker 8s infinite;}
  .abar-track{background:${BORD};height:6px;width:100%;position:relative;overflow:hidden;}
  .abar-fill{height:100%;position:absolute;top:0;left:0;transition:width .8s ease;}
  /* Scratch marks on bars to look hand-filled */
  .abar-fill::after{content:'';position:absolute;inset:0;
    background:repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,.25) 6px,rgba(0,0,0,.25) 7px);}
`;

// ── PRIMITIVES ────────────────────────────────────────────────

const ASection: React.FC<{ label: string; stamp?: string; children: React.ReactNode }> = ({ label, stamp, children }) => (
  <motion.div className="mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.4 }}>
    <div className="flex items-center gap-4 mb-6" style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '1.5rem' }}>
      <span className="am" style={{ color: G, opacity: 0.7, fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{label}</span>
      {stamp && <span className="astamp ml-auto">{stamp}</span>}
    </div>
    {children}
  </motion.div>
);

const FieldNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ab leading-loose mb-4" style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem', lineHeight: 1.9 }}>{children}</div>
);

const IntelCard: React.FC<{ category: string; content: string }> = ({ category, content }) => (
  <div style={{ background: SURF, border: `1px solid ${BORD}`, padding: '1.25rem' }}>
    <div className="am mb-2" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.25em', opacity: 0.55 }}>[{category.toUpperCase()}]</div>
    <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '0.95rem' }}>{content}</div>
  </div>
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

const ManualEntry: React.FC<{ number: string; title: string; body: string }> = ({ number, title, body }) => (
  <motion.div className="mb-5 flex gap-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
    <div className="am flex-shrink-0" style={{ color: G, fontSize: '1.1rem', opacity: 0.35, width: 36, textAlign: 'right' }}>{number}</div>
    <div>
      <div className="at mb-1" style={{ color: G, fontSize: '1rem', letterSpacing: '0.05em' }}>{title}</div>
      <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '1rem' }}>{body}</div>
    </div>
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

const MissionBrief: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div className="my-8 p-5" style={{ background: `${WARN}0a`, border: `1px solid ${WARN}30`, borderLeft: `3px solid ${WARN}` }}>
    <div className="am mb-2" style={{ color: WARN, fontSize: '0.8rem', letterSpacing: '0.3em', opacity: 0.7 }}>!! {label.toUpperCase()} !!</div>
    <p className="ab italic leading-relaxed" style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem' }}>{text}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// 06 — OPERATIONAL MAP
// Hand-drawn SVG map of Ghana with clickable zone nodes.
// Aesthetic: annotated field map, not designed UI.
// ─────────────────────────────────────────────────────────────

const ZONES = [
  {
    id: 'tema',
    label: 'TEMA / ACCRA', act: 'ACT I',
    coords: { x: 38, y: 72 },
    status: 'FALLEN', statusColor: WARN,
    threat: 'HIGH — Active outbreak, collapsing infrastructure',
    resources: 'Military depot (looted), petrol station, pharmaceutical warehouse',
    intel: "Kwame's last known location of the school bus: Tema Industrial Area, near the GAF checkpoint on the N1. The checkpoint collapsed during D-Day panic. Bus found empty — Ama's notebook recovered from seat 14.",
    locations: ['Tema Industrial Area', 'Osu residential streets', 'Kotoka approach road', 'GAF Checkpoint Delta'],
  },
  {
    id: 'coast',
    label: 'CAPE COAST ROAD', act: 'ACT I–II',
    coords: { x: 24, y: 62 },
    status: 'CONTESTED', statusColor: '#e8c84a',
    threat: 'MODERATE — Abandoned vehicles, isolated threats, bandit activity',
    resources: 'Abandoned convoy supplies, fuel from stranded vehicles, roadside kiosks',
    intel: "Primary route west. Evidence of a large civilian convoy that moved through 4–6 days ago. Survivor accounts mention children being 'escorted north' by men in unmarked military vehicles near the Cape Coast junction.",
    locations: ['N1 highway westbound', 'Cape Coast junction', 'Abandoned fuel depot', 'Coastal fishing village (survivor camp)'],
  },
  {
    id: 'kumasi',
    label: 'KUMASI DISTRICT', act: 'ACT II',
    coords: { x: 42, y: 45 },
    status: 'OCCUPIED', statusColor: WARN,
    threat: 'HIGH — Human faction territory. Antagonist splinter group controls central market zone.',
    resources: 'Kumasi central market (contested), Komfo Anokye Teaching Hospital (partially operational), military barracks (hostile-held)',
    intel: "Ama was here. Found evidence — her jacket, a message scratched into a kiosk wall in Twi. She moved on approximately 2 days ago. The splinter faction is using the market as a processing hub. Something is being moved north.",
    locations: ['Kumasi Central Market', 'Komfo Anokye Hospital', 'Kejetia transport hub', 'Northern road junction'],
  },
  {
    id: 'north',
    label: 'NORTHERN INTERIOR', act: 'ACT III',
    coords: { x: 48, y: 22 },
    status: 'UNKNOWN', statusColor: '#888',
    threat: 'UNKNOWN — No reliable intelligence. Radio silence.',
    resources: 'Unknown. Possibly isolated community settlements.',
    intel: "[REDACTED — INTEL PENDING ACT III DESIGN] Last known direction of travel for both children points north of Tamale. The antagonist's base of operations is somewhere in this zone. Radio intercepts suggest a facility of some kind.",
    locations: ['[CLASSIFIED]', '[CLASSIFIED]', '[CLASSIFIED]', '[CLASSIFIED]'],
  },
];

const OperationalMap: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const zone = ZONES.find(z => z.id === selected);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* SVG map panel */}
      <div className="lg:col-span-3 relative" style={{ background: SURF, border: `1px dashed ${BORD}`, minHeight: 420, overflow: 'hidden' }}>
        {/* Map background — rough Ghana silhouette in SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines — hand-drawn feel */}
          {[20,40,60,80].map(v => (
            <g key={v}>
              <line x1={v} y1={0} x2={v} y2={100} stroke={BORD} strokeWidth={0.3} strokeDasharray="2 3" opacity={0.5}/>
              <line x1={0} y1={v} x2={100} y2={v} stroke={BORD} strokeWidth={0.3} strokeDasharray="2 3" opacity={0.5}/>
            </g>
          ))}

          {/* Rough Ghana coastline / landmass blob */}
          <path d="M25,90 Q20,80 22,70 Q18,60 22,50 Q20,40 25,32 Q28,24 35,20 Q42,16 50,18 Q58,16 65,20 Q72,22 74,30 Q78,38 76,48 Q80,56 76,64 Q74,72 70,80 Q65,88 58,92 Q50,96 42,94 Q33,92 25,90Z"
            fill={`${G}06`} stroke={`${G}18`} strokeWidth={0.5}/>

          {/* Route lines between zones */}
          {[
            [ZONES[0].coords, ZONES[1].coords],
            [ZONES[1].coords, ZONES[2].coords],
            [ZONES[2].coords, ZONES[3].coords],
          ].map(([a, b], i) => (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={i === 2 ? '#88888850' : `${G}40`} strokeWidth={0.6}
              strokeDasharray={i === 2 ? '1.5 2' : '3 2'}/>
          ))}

          {/* Route labels */}
          <text x="29" y="70" className="am" style={{ fontFamily: 'VT323, monospace' }} fontSize="2.2" fill={G} opacity={0.35}>CONFIRMED</text>
          <text x="30" y="56" className="am" style={{ fontFamily: 'VT323, monospace' }} fontSize="2.2" fill={G} opacity={0.35}>CONFIRMED</text>
          <text x="43" y="35" className="am" style={{ fontFamily: 'VT323, monospace' }} fontSize="2.2" fill="#888" opacity={0.35}>UNKNOWN</text>

          {/* Zone nodes */}
          {ZONES.map(z => (
            <g key={z.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(selected === z.id ? null : z.id)}>
              {/* Pulse ring on selected */}
              {selected === z.id && (
                <circle cx={z.coords.x} cy={z.coords.y} r={4} fill="none" stroke={z.statusColor} strokeWidth={0.5} opacity={0.4}/>
              )}
              {/* Military cross-hair marker */}
              <circle cx={z.coords.x} cy={z.coords.y} r={1.8}
                fill={selected === z.id ? z.statusColor : SURF}
                stroke={z.statusColor} strokeWidth={0.8} opacity={selected && selected !== z.id ? 0.3 : 1}/>
              <line x1={z.coords.x - 3} y1={z.coords.y} x2={z.coords.x + 3} y2={z.coords.y} stroke={z.statusColor} strokeWidth={0.4} opacity={selected && selected !== z.id ? 0.2 : 0.5}/>
              <line x1={z.coords.x} y1={z.coords.y - 3} x2={z.coords.x} y2={z.coords.y + 3} stroke={z.statusColor} strokeWidth={0.4} opacity={selected && selected !== z.id ? 0.2 : 0.5}/>
              {/* Zone label */}
              <text x={z.coords.x + 3} y={z.coords.y - 2} fontSize="2" fill={PALE} opacity={selected && selected !== z.id ? 0.2 : 0.6}
                style={{ fontFamily: 'VT323, monospace', letterSpacing: '0.05em' }}>{z.label}</text>
              <text x={z.coords.x + 3} y={z.coords.y + 1.5} fontSize="1.6" fill={z.statusColor} opacity={selected && selected !== z.id ? 0.15 : 0.5}
                style={{ fontFamily: 'VT323, monospace' }}>{z.act}</text>
            </g>
          ))}
        </svg>

        {/* Map label */}
        <div className="absolute bottom-3 left-3 am" style={{ color: G, fontSize: '0.7rem', opacity: 0.35, letterSpacing: '0.25em' }}>
          OPERATIONAL THEATRE — GHANA
        </div>
        <div className="absolute top-3 right-3 am" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.25, letterSpacing: '0.2em' }}>
          CLICK ZONE TO EXPAND
        </div>
      </div>

      {/* Zone detail panel */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {zone ? (
            <motion.div key={zone.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${zone.statusColor}`, padding: '1.25rem', minHeight: 420 }}>
              <div className="am mb-1" style={{ color: zone.statusColor, fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.7 }}>{zone.act} ZONE</div>
              <h3 className="at mb-1" style={{ color: PALE, fontSize: '1.3rem' }}>{zone.label}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: zone.statusColor }}/>
                <span className="am" style={{ color: zone.statusColor, fontSize: '0.75rem', letterSpacing: '0.2em', opacity: 0.8 }}>{zone.status}</span>
              </div>

              {[
                { label: 'THREAT LEVEL', val: zone.threat },
                { label: 'RESOURCES', val: zone.resources },
                { label: 'INTEL SUMMARY', val: zone.intel },
              ].map(item => (
                <div key={item.label} className="mb-4" style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
                  <div className="am mb-1" style={{ color: G, fontSize: '0.7rem', letterSpacing: '0.25em', opacity: 0.5 }}>{item.label}</div>
                  <div className="ab" style={{ color: PALE, opacity: 0.75, fontSize: '0.9rem', lineHeight: 1.7 }}>{item.val}</div>
                </div>
              ))}

              <div style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
                <div className="am mb-2" style={{ color: G, fontSize: '0.7rem', letterSpacing: '0.25em', opacity: 0.5 }}>KEY LOCATIONS</div>
                {zone.locations.map((loc, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <span className="am" style={{ color: WARN, opacity: 0.4, fontSize: '0.75rem' }}>{'>'}</span>
                    <span className="ab" style={{ color: PALE, opacity: 0.6, fontSize: '0.85rem' }}>{loc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
              className="flex items-center justify-center" style={{ border: `1px dashed ${BORD}`, minHeight: 420 }}>
              <div className="text-center">
                <div className="am" style={{ color: G, fontSize: '0.8rem', letterSpacing: '0.3em' }}>SELECT A ZONE</div>
                <div className="am mt-2" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.5, letterSpacing: '0.2em' }}>CLICK MARKER ON MAP</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 07 — PERSONNEL COMPARISON
// Side-by-side dossier comparison. Stats look hand-filled
// on a printed form — scratch-mark bars, typed numbers.
// ─────────────────────────────────────────────────────────────

const PERSONNEL = [
  {
    id: 'KM-001', name: 'COL. KWAME MENSAH', role: 'Protagonist', age: '62',
    status: 'Active', statusColor: G,
    stats: { fitness: 55, combat: 88, resilience: 92, fieldKnowledge: 95, culturalKnowledge: 80 },
    notes: ['Military discipline overrides physical limits — until it doesn\'t', 'Emotional blind spot: anything involving his children', 'Best asset: 40 years of reading terrain and people'],
  },
  {
    id: 'AM-002', name: 'AMA MENSAH', role: 'Kwame\'s Daughter', age: '17',
    status: 'Located', statusColor: G,
    stats: { fitness: 78, combat: 52, resilience: 85, fieldKnowledge: 48, culturalKnowledge: 72 },
    notes: ['Survived weeks alone — raw capability, no formal training', 'Knows things about the faction that Kwame doesn\'t', 'Dynamic with Kwame shifts: starts dependent, becomes partner'],
  },
  {
    id: 'KM-003', name: 'KOFI MENSAH', role: 'Kwame\'s Son', age: '12',
    status: 'Missing', statusColor: WARN,
    stats: { fitness: 42, combat: 12, resilience: 70, fieldKnowledge: 20, culturalKnowledge: 60 },
    notes: ['Survival method is Act III\'s central revelation', 'Resourcefulness is his only real asset', 'His condition when found defines the emotional climax'],
  },
  {
    id: 'TBD-004', name: 'THE ANTAGONIST', role: 'Former Colonel', age: '[REDACTED]',
    status: 'Hostile', statusColor: WARN,
    stats: { fitness: 60, combat: 85, resilience: 88, fieldKnowledge: 92, culturalKnowledge: 75 },
    notes: ['Mirror of Kwame — same training, opposite choices', 'Believes he is doing the only rational thing', 'Personal history with Kwame makes the final confrontation devastating'],
  },
  {
    id: 'NPC-005', name: 'NURSE AKOSUA [TEMP]', role: 'Recurring Survivor NPC', age: '34',
    status: 'Conditional', statusColor: '#e8c84a',
    stats: { fitness: 50, combat: 20, resilience: 80, fieldKnowledge: 65, culturalKnowledge: 90 },
    notes: ['Name to be finalised — placeholder', 'Medical knowledge is the rarest resource in the game', 'Her survival or loss has cascading effects on Kwame\'s injury system'],
  },
];

const STAT_LABELS: Record<string, string> = {
  fitness: 'PHYSICAL FITNESS',
  combat: 'COMBAT CAPABILITY',
  resilience: 'EMOTIONAL RESILIENCE',
  fieldKnowledge: 'FIELD KNOWLEDGE',
  culturalKnowledge: 'CULTURAL KNOWLEDGE',
};

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

type BeatType = 'incident' | 'intel' | 'contact' | 'objective' | 'personal';

interface Beat {
  id: string; track: 'kwame' | 'ama'; type: BeatType;
  label: string; location: string; description: string;
  act: 'I' | 'II' | 'III'; known: boolean;
}

const BEAT_COLORS: Record<BeatType, string> = {
  incident: WARN, intel: G, contact: '#e8c84a', objective: PALE, personal: '#a8c8e8',
};
const BEAT_TYPE_LABELS: Record<BeatType, string> = {
  incident: 'THREAT', intel: 'INTEL', contact: 'CONTACT', objective: 'OBJECTIVE', personal: 'PERSONAL',
};

const BEATS: Beat[] = [
  // ACT I — KWAME
  { id:'k1', track:'kwame', act:'I', type:'incident', known:true, label:'D-Day — Checkpoint Collapse', location:'Tema, N1 Highway', description:"The evacuation checkpoint on the N1 collapses under panic and pressure. Kwame is separated from his children in the crush. By the time he fights clear, the school bus is gone." },
  { id:'k2', track:'kwame', act:'I', type:'intel', known:true, label:'Ama\'s Notebook Found', location:'School Bus — Tema Industrial', description:"The bus is empty. No bodies. Seat 14: Ama's notebook. A note in her handwriting, clearly written in a hurry: 'Kofi is with me. We're going to [SMUDGED]. Don't look for us here.'" },
  { id:'k3', track:'kwame', act:'I', type:'contact', known:true, label:'First Survivor Contact', location:'Osu, Accra', description:"A former market trader holed up in his compound. He saw children being loaded into vehicles — unmarked, military-style. He thought it was evacuation. He's not sure anymore." },
  { id:'k4', track:'kwame', act:'I', type:'objective', known:true, label:'Cape Coast Route Confirmed', location:'Osu → Cape Coast Highway', description:"Piecing together accounts, Kwame traces the vehicles toward Cape Coast. The N1 westbound is the only viable route. He moves at night. He doesn't stop." },
  // ACT I — AMA (Kwame doesn't know this)
  { id:'a1', track:'ama', act:'I', type:'personal', known:false, label:'Separated — Ama Takes Control', location:'Tema, N1 Highway', description:"[Kwame does not know this yet] When the checkpoint collapsed, Ama grabbed Kofi and pulled him away from the crush. She found a group of survivors heading west. She didn't know where Kwame was. She made a decision." },
  { id:'a2', track:'ama', act:'I', type:'incident', known:false, label:'First Night — Alone', location:'Cape Coast Road (Unknown Point)', description:"[Kwame does not know this yet] Ama and Kofi slept in an abandoned vehicle. She gave him the last of her food. She didn't tell him they might not find their father." },
  // ACT II — KWAME
  { id:'k5', track:'kwame', act:'II', type:'contact', known:true, label:'Cape Coast Survivor Camp', location:'Coastal Fishing Village', description:"A fishing village functioning as an informal survivor camp. A woman remembers two children — a teenage girl with short hair, a younger boy. They were here. They left with a convoy heading to Kumasi. Three days ago." },
  { id:'k6', track:'kwame', act:'II', type:'incident', known:true, label:'Splinter Faction Encounter', location:'Cape Coast Highway, North Junction', description:"First contact with the antagonist's splinter group. Not zombies — men in mismatched military gear controlling the junction. They let Kwame pass. They're watching him. He knows them. One of the men looks away when Kwame's eyes meet his." },
  { id:'k7', track:'kwame', act:'II', type:'objective', known:true, label:'Kumasi Approached', location:'Kumasi Outskirts', description:"Kumasi is different from Accra. It held longer, fell harder. The market district is the faction's hub. Getting in means going through them or around them. Kwame chooses through." },
  { id:'k8', track:'kwame', act:'II', type:'intel', known:true, label:'Ama\'s Message Found', location:'Kumasi Central Market', description:"Scratched into the wooden frame of a kiosk in the old market: three words in Twi. It's Ama's handwriting. She knew someone might follow. She knew it might be him. She left him a direction." },
  // ACT II — AMA (Kwame learns this when they reunite)
  { id:'a3', track:'ama', act:'II', type:'incident', known:false, label:'Kumasi — Detained', location:'Kumasi Market Area', description:"[Revealed at reunion] The convoy was intercepted. Ama and Kofi were separated and held in the market area. Ama quickly assessed the faction — their structure, their weaknesses, who among them has doubts." },
  { id:'a4', track:'ama', act:'II', type:'personal', known:false, label:'Kofi Moved North', location:'Kumasi — Faction Holding Area', description:"[Revealed at reunion] Kofi was moved before Ama could act. She saw it happen. She couldn't stop it. She's been tracking the route since, waiting for an opportunity — or for backup." },
  { id:'a5', track:'ama', act:'II', type:'contact', known:false, label:'Ama Makes Allies', location:'Kumasi Market', description:"[Revealed at reunion] Ama identified three faction members who are there under duress. She's been building trust with them slowly. When Kwame arrives, these allies are available — but only if Kwame doesn't immediately blow it with his approach." },
  // ACT III — TOGETHER
  { id:'k9', track:'kwame', act:'III', type:'personal', known:true, label:'Reunion — Ama Found', location:'Kumasi Market District', description:"Not a rescue. Ama was waiting for the right moment. Kwame arriving is the moment. The reunion is not tearful — it's tense, quick, and immediately tactical. There is no time. She briefs him like a soldier. He realizes who his daughter has become." },
  { id:'k10', track:'kwame', act:'III', type:'intel', known:true, label:'Full Picture Assembled', location:'Kumasi → North Road', description:"Ama's intelligence combined with Kwame's trail. For the first time, they know exactly what's happening, who is responsible, and where Kofi is. The antagonist's name is confirmed. Kwame says nothing for a long moment." },
  { id:'k11', track:'kwame', act:'III', type:'objective', known:true, label:'North — Final Approach', location:'Northern Interior', description:"Father and daughter moving north together. The dynamic has shifted. Kwame follows Ama's route intel. She leads more than he does. He lets her." },
  { id:'k12', track:'kwame', act:'III', type:'incident', known:true, label:'Final Confrontation', location:'[CLASSIFIED — ACT III LOCATION]', description:"Kofi is found. He is alive. The antagonist is present. The confrontation happens. The ending is determined by choices Kwame has made across all three acts — not by a single decision at the end." },
];

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

const PALETTE_DATA = [
  { name: 'Laterite Red',   hex: '#c8522a', use: 'Soil / Danger / Wounds' },
  { name: 'Survival Green', hex: '#7ec87e', use: 'Radio / Night Vision / Hope' },
  { name: 'Aged Paper',     hex: '#c8b89a', use: 'UI Text / Warm Light Sources' },
  { name: 'Concrete Grey',  hex: '#6a6258', use: 'Urban Decay / Dead Zones' },
  { name: 'Deep Shadow',    hex: '#1a1610', use: 'Night / Interior Threat' },
  { name: 'Rust Orange',    hex: '#8b4a1a', use: 'Fire / Structural Decay' },
  { name: 'Pale Sky',       hex: '#8ab0b8', use: 'Daylight Outdoors / Safe Zones' },
  { name: 'Void Black',     hex: '#080604', use: 'Deepest Shadow / Cut Scenes' },
];

const DESIGN_PRINCIPLES = [
  { n: '01', title: 'Every Level is a Real Place', body: 'Each zone must be recognizable as a specific Ghanaian location. Tema\'s planned grid streets feel different from Osu\'s organic density. Kumasi\'s market architecture is distinct from coastal compounds. No generic city — this is Ghana.' },
  { n: '02', title: 'Zombies Look Like Neighbors', body: 'They\'re wearing everyday clothes: kente print shirts, office wear, school uniforms. The horror is recognition, not creature design. A child in a primary school uniform is the most disturbing enemy in the game. Don\'t flinch from it.' },
  { n: '03', title: 'Night is a Resource Constraint', body: 'Night levels: Kwame\'s flashlight, distant fires, phone screens glowing in dead hands. Darkness is not decorative — it limits the player\'s information and costs battery/fuel to fight. Stealth is rewarded over confrontation.' },
  { n: '04', title: 'Health is a Physical State, Not a Bar', body: 'Kwame\'s health shows in his performance. He breathes heavier, limps, moves slower. The screen doesn\'t go red — it desaturates. His hand shakes on the weapon. The UI reflects what his body is doing, not a number.' },
  { n: '05', title: 'The World Remembers What You Did', body: 'Survivor camps Kwame helped look different on a return pass. Bodies he left unretrieved become hazards. NPC factions remember his behavior. The world is not a backdrop — it\'s a record of Kwame\'s choices.' },
];

const ZONE_VISUALS = [
  { zone: 'Tema / Accra', time: 'Dusk → Night', palette: 'Red laterite dust, concrete grey, fire orange against dark sky', feel: 'Claustrophobic. The streets were built for cars, not refugees. Industrial scale makes survival feel small.' },
  { zone: 'Cape Coast Road', time: 'Dawn → Midday', palette: 'Pale sky blue overhead, green-brown roadside bush, bleached tarmac', feel: 'Exposed. The highway offers no cover. Distance is the only safety, and the road is very long.' },
  { zone: 'Kumasi District', time: 'Overcast / Midday', palette: 'Deep ochre market stalls, faded signage colors, concrete shadow', feel: 'Familiar turned wrong. A market full of life becomes a maze of threat. Memory makes it worse.' },
  { zone: 'Northern Interior', time: 'Night / Unknown', palette: 'Near-monochrome — dark greens, deep shadow, single light sources', feel: 'Alien. Kwame doesn\'t know this territory. His military instincts work but his cultural map doesn\'t.' },
];

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

const AUDIO_ZONES = [
  {
    zone: 'Tema / Accra', act: 'Act I', color: WARN,
    instruments: 'Distorted highlife guitar, industrial bass hum, broken percussion',
    tempo: 'Fast and chaotic — no consistent pulse. The world is falling apart.',
    mood: 'Chaos and muscle memory. Kwame acts before he thinks. The city\'s sonic identity is breaking down in real time.',
    threat: 'Industrial drone overtakes the highlife guitar. The music becomes noise. Then silence.',
    ref: 'Ebo Taylor — corrupted. Ben Frost — Trauma. Lustmord — infrastructure collapse.',
    notes: 'The opening sequence should be sonically overwhelming. Then abruptly quiet when Kwame realizes the bus is empty.',
  },
  {
    zone: 'Cape Coast Road', act: 'Act I–II', color: '#8ab0b8',
    instruments: 'Sparse acoustic guitar, wind through abandoned cars, distant birds',
    tempo: 'Slow and directional. Forward momentum without comfort.',
    mood: 'Desolation. The highway was built for movement — now it\'s just a very long, very exposed corridor.',
    threat: 'At night: only wind and distant shuffling. The absence of music is the threat.',
    ref: 'Nils Frahm — Says. Jóhann Jóhannsson — quiet walking themes.',
    notes: 'Dawn and dusk sound completely different on this road. Dawn: bird calls, distant cock crow — normalcy that makes the silence wrong. Dusk: the light failing means something entirely different now.',
  },
  {
    zone: 'Kumasi Market District', act: 'Act II', color: '#e8c84a',
    instruments: 'Found percussion on market stalls, echo of voices, bass resonance in empty halls',
    tempo: 'Syncopated — the rhythm keeps almost falling into something familiar, then doesn\'t.',
    mood: 'The memory of noise in a place that was built on sound. Kumasi central market at full capacity is deafening. Empty, it\'s its own kind of horror.',
    threat: 'When faction soldiers are near, the percussion becomes regimented. Military cadence bleeding into market rhythm.',
    ref: 'Tinariwen — sparse. Rokia Traoré — structural decay of melody.',
    notes: 'Ama\'s theme is first heard here — a light melodic fragment, unresolved, like something half-remembered. It signals her presence before Kwame finds her evidence.',
  },
  {
    zone: 'Northern Interior', act: 'Act III', color: '#c8a8e8',
    instruments: 'Talking drum (transformed — slower, heavier), low choir, long silences',
    tempo: 'Slow to the point of discomfort. Beats spaced far apart.',
    mood: 'The weight of everything that led to this. Kwame and Ama moving north together. This is the point of no return.',
    threat: 'Near the antagonist\'s location: the choir becomes dissonant. The drums stop. Only Kwame\'s breathing remains.',
    ref: 'Arvo Pärt — Spiegel im Spiegel. Jóhann Jóhannsson — The Sun\'s Gone Dim.',
    notes: 'The final confrontation should have no score. Just environmental sound. Then silence. The emotional weight of the music was spent getting here — the moment itself doesn\'t need it.',
  },
];

const SOUND_DESIGN = [
  { label: 'Kwame\'s Breathing', body: 'The primary health indicator. At full health: controlled, inaudible. As he tires or is injured: audible, labored. At critical: rasping. The player hears his age accumulating across the game. By Act III, even at full health, he breathes a little heavier than he did in Act I.' },
  { label: 'Zombie Audio Design', body: 'No roars, no classic horror sounds. Cloth rustling. Labored breathing. Familiar voices (occasionally) — a child, a woman calling a name. The uncanny horror is recognition. Stage 1: disoriented, vocalizing. Stage 2: quiet, focused. Stage 3: near-silent. The quieter they get, the more dangerous.' },
  { label: 'Twi Radio Fragments', body: 'Environmental storytelling. Fragments heard from car radios still running, phones with battery, distant buildings with generators. Some are official broadcasts. Some are personal. One, late in Act II, is a child\'s voice. It is not Kofi\'s — but the player won\'t know that immediately.' },
  { label: 'Silence as Design Element', body: 'After every significant combat encounter, there should be at least 8–12 seconds of near-silence. Wind. Kwame\'s breathing. The sound of him reloading or picking up a resource. This silence is mandatory — it prevents desensitization and makes the next threat feel real again.' },
  { label: 'The Antagonist\'s Audio Signature', body: 'He sounds like Kwame used to sound. Controlled breathing, deliberate movement, no panic. When the two finally meet, the similarity in how they carry themselves should be audible. Same training. Completely different destinations.' },
];

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

type ResearchCat = 'Geography' | 'Culture & Language' | 'Military & Emergency' | 'Ancestral Beliefs' | 'Accuracy Charter';

const RESEARCH_ENTRIES: { id: string; category: ResearchCat; title: string; content: string }[] = [
  {
    id:'r1', category:'Geography',
    title:'Tema — The Planned City',
    content:"Tema was deliberately designed in the 1950s-60s as an industrial port city — its grid layout and compound housing blocks are distinct from Accra's organic sprawl. The industrial area along the coast has large warehouse complexes, cold storage facilities, and shipping infrastructure. This makes it tactically interesting: clear sightlines, hard cover, recognizable landmark structures. The Tema-Accra motorway is the critical artery. When it fails, the city is functionally isolated.",
  },
  {
    id:'r2', category:'Geography',
    title:'Accra — Osu District',
    content:"Osu is one of Accra's oldest districts — a mix of historic compounds, modern commercial streets, and the shoreline. Oxford Street (the main commercial strip) is a reference point most Ghanaians recognize instantly. The density is high but human-scale. Kiosks, chop bars, small compounds with shared courtyards. For survival gameplay: the density creates ambush risk but also resource opportunity. The shoreline provides a navigation landmark.",
  },
  {
    id:'r3', category:'Geography',
    title:'Kumasi — The Garden City',
    content:"Kumasi has a distinct feel from coastal cities — more enclosed, more hierarchical, culturally more conservative. The central market (Kejetia) is one of the largest open-air markets in West Africa — a labyrinth of stalls, covered walkways, and crowd flow. As a gameplay zone it offers extraordinary tactical depth: narrow passages, elevated seller platforms, multiple exit routes, a clear central hub. Komfo Anokye Teaching Hospital is a genuine landmark recognizable to any Ghanaian player.",
  },
  {
    id:'r4', category:'Culture & Language',
    title:'Twi — Language Notes',
    content:"Twi (specifically Asante Twi) is the most widely spoken language in southern Ghana and is understood across much of the country. Key phrases for in-game use must be reviewed by a native speaker. Common expressions: 'Yɛbɛhyia bio' (we'll meet again), 'Gye nyame' (except God — the foundational Adinkra symbol), 'Wo ho te sɛn?' (how are you?). Crucially, pidgin English and code-switching between English and Twi is the natural mode of speech for most urban Ghanaians — NPCs should reflect this authentically.",
  },
  {
    id:'r5', category:'Culture & Language',
    title:'Compound Living — Social Architecture',
    content:"The compound house (odan) is a foundational unit of Ghanaian social life — a shared courtyard with multiple family units around it. In a survival scenario, compounds become natural fortification points. They also have strong social rules: who has authority, who is responsible for what, how decisions are made collectively. These dynamics should appear in rest phase NPC interactions. A compound of survivors is not just shelter — it's a micro-society with its own power structure.",
  },
  {
    id:'r6', category:'Culture & Language',
    title:'Naming Conventions',
    content:"Ghanaian naming traditions are rich and specific. Day names (Akosua = Sunday female, Kwame = Saturday male, Ama = Saturday female, Kofi = Friday male) are widely used alongside given names. Family names vary by region and ethnicity. Military titles (Colonel, Captain) interact with civilian naming in specific ways — a retired colonel would be addressed differently in military vs. civilian contexts. All character names in the game should be reviewed for cultural accuracy and regional appropriateness.",
  },
  {
    id:'r7', category:'Military & Emergency',
    title:'Ghana Armed Forces — Structure & Culture',
    content:"The Ghana Armed Forces (GAF) has a strong institutional culture shaped by ECOMOG peacekeeping service, UN deployments, and domestic civic roles. Officers of Kwame's generation would have served in Liberia and Sierra Leone — formative experiences that created a specific kind of soldier: experienced with asymmetric conflict, aware of civilian impact, accustomed to operating in collapsed state situations. The relationship between military and civilian institutions in Ghana is generally positive — Kwame's reluctance to trust the splinter faction is personal, not institutional.",
  },
  {
    id:'r8', category:'Military & Emergency',
    title:'NADMO — National Disaster Management',
    content:"The National Disaster Management Organisation (NADMO) is Ghana's primary emergency response body. In a genuine national crisis they would coordinate with the GAF, regional authorities, and civil society. Their capacity, resources, and geographic reach are real constraints that the game's fiction should respect. NADMO's collapse (or partial collapse) in Act I is plausible if the outbreak moved faster than any existing emergency protocol could handle — which is the premise.",
  },
  {
    id:'r9', category:'Ancestral Beliefs',
    title:'Akan Spiritual Tradition & the Dead',
    content:"In Akan spiritual tradition, the dead do not simply cease — they transition to the realm of ancestors (asamando) and maintain connection with the living. The concept of the sunsum (spirit/soul) surviving physical death is foundational. An outbreak of the dead refusing to transition — returning instead as something that doesn't speak, doesn't recognize, doesn't belong to either the living or ancestor world — is cosmologically horrifying in a way that Western zombie frameworks don't capture. Some in-game characters should express this: not just survival fear, but spiritual dread at what the dead have become.",
  },
  {
    id:'r10', category:'Ancestral Beliefs',
    title:'Traditional Explanation vs. Scientific Explanation',
    content:"As the outbreak spreads, two explanatory frameworks will emerge among survivors: scientific/medical (a pathogen, a virus, a weapon) and traditional/spiritual (a curse, a punishment, a rupture in the ancestor-living relationship). Neither should be confirmed or denied by the game. Kwame, as a military man, defaults to the scientific frame — but encounters that shake this are important story moments. An elderly survivor who reads the outbreak through traditional knowledge should not be made to look foolish. The two frameworks coexist. That tension is rich storytelling territory.",
  },
  {
    id:'r11', category:'Accuracy Charter',
    title:'Cultural Consultant Requirement',
    content:"The game must be reviewed by at least one Ghanaian cultural consultant — ideally one from Accra/Tema and one with knowledge of Asante Twi and Akan traditions — before any dialogue is finalized. This is non-negotiable. The goal is not to avoid offense (though that matters) but to make the world feel genuinely real to Ghanaian players. A Ghanaian player should be able to point to a location, hear a phrase, or recognize a social dynamic and feel it is accurately rendered.",
  },
  {
    id:'r12', category:'Accuracy Charter',
    title:'Research Reference List',
    content:"Key resources for the development team: (1) 'A History of Ghana' by Roger Gocking — historical foundation. (2) NADMO official documentation — emergency response structure. (3) Ghana Armed Forces institutional history — peacekeeping record. (4) 'The Akan of Ghana' by Kofi Asare Opoku — cultural and spiritual tradition. (5) Street-level documentation of Tema, Osu, Kumasi — architectural reference. (6) Ghanaian film and television — language, social dynamics, authentic contemporary portrayal. This list will expand as production progresses.",
  },
];

const ResearchPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ResearchCat | 'all'>('all');
  const [activeEntry, setActiveEntry] = useState<string | null>(null);

  const categories: (ResearchCat | 'all')[] = ['all', 'Geography', 'Culture & Language', 'Military & Emergency', 'Ancestral Beliefs', 'Accuracy Charter'];
  const filtered = RESEARCH_ENTRIES.filter(e => activeCategory === 'all' || e.category === activeCategory);
  const entry = RESEARCH_ENTRIES.find(e => e.id === activeEntry);

  const catColors: Record<string, string> = {
    'Geography': '#8ab0b8', 'Culture & Language': G, 'Military & Emergency': WARN,
    'Ancestral Beliefs': '#c8a8e8', 'Accuracy Charter': '#e8c84a',
  };

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

  return (
    <div className="ag" style={{ background: BG, minHeight: '100vh', color: PALE }}>
      <style>{FONTS + CSS}</style>

      {/* ── BACK NAV ── */}
      <div style={{ borderBottom: `1px dashed ${BORD}`, padding: '1rem 1.5rem' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/games')}
            className="flex items-center gap-2 afl" style={{ color: G, opacity: 0.5 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
            <ArrowLeft size={12} />
            <span className="am" style={{ fontSize: '0.8rem', letterSpacing: '0.3em' }}>← BACK / GAME INDEX</span>
          </motion.button>
          <div className="am" style={{ color: G, fontSize: '0.75rem', opacity: 0.3, letterSpacing: '0.25em' }}>FILE: ABODE_DESIGN_BIBLE_v0.2</div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative px-6 pt-12 pb-16 overflow-hidden"
        style={{ background: `radial-gradient(ellipse 80% 60% at 20% 100%, ${WARN}08, transparent 60%), ${BG}` }}>
        <div className="absolute right-0 top-0 at select-none pointer-events-none leading-none"
          style={{ fontSize: 'clamp(10rem, 30vw, 24rem)', color: `${G}04`, right: '-0.05em', top: '-0.05em' }}>02</div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-4 mb-8 flex-wrap" style={{ borderBottom: `1px solid ${BORD}`, paddingBottom: '1rem' }}>
              <div className="am" style={{ color: G, fontSize: '0.75rem', opacity: 0.45, letterSpacing: '0.3em' }}>GENRE: SURVIVAL · ACTION · NARRATIVE</div>
              <span className="astamp ml-auto">DRAFT</span>
            </div>
            <h1 className="at" style={{ fontSize: 'clamp(4rem, 14vw, 10rem)', color: G, letterSpacing: '0.01em', lineHeight: 0.9, marginBottom: '0.5rem' }}>Abɔde</h1>
            <div className="am mb-6" style={{ color: PALE, fontSize: '0.85rem', opacity: 0.4, letterSpacing: '0.3em' }}>[ TWARA: HOMELAND ] · GAME 02 OF 03</div>
            <div className="ab italic leading-loose max-w-2xl" style={{ color: PALE, fontSize: '1.15rem', opacity: 0.8, borderLeft: `2px solid ${WARN}`, paddingLeft: '1.5rem' }}>
              The dead walk through Accra's streets. Colonel Kwame Mensah has survived wars he chose. This one chose him — and his children are somewhere in it.
            </div>
            <div className="mt-6 am" style={{ color: PALE, fontSize: '0.75rem', opacity: 0.3, letterSpacing: '0.2em' }}>SETTING: NEAR-FUTURE GHANA · INCIDENT TYPE: OUTBREAK / SEPARATION / RECOVERY</div>
          </motion.div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-12">

        <ASection label="01 — Intelligence Overview" stamp="VERIFIED">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { category: 'Classification', content: '2D Side-Scrolling Survival / Narrative Action — flat level design with resource management and scavenging loops.' },
              { category: 'Operational Tone', content: "Grim, grounded, and emotionally tethered. The Last of Us pacing inside Earth Taken's aesthetic — but set in Ghana." },
              { category: 'Influence Sources', content: "Earth Taken (art style, atmosphere), The Last Stand (level structure, resource loops), This War of Mine (civilian weight, moral decisions)." },
              { category: 'Visual Profile', content: "Muted earth tones: rust, clay, grey concrete. Recognizably Ghanaian architecture — kiosks, compounds, red laterite roads, market streets gone silent." },
            ].map(item => <IntelCard key={item.category} category={item.category} content={item.content} />)}
          </div>
        </ASection>

        <ASection label="02 — Situation Report" stamp="SENSITIVE">
          <FieldNote>A near-future Ghana. The outbreak began in the north and spread south within weeks, overwhelming NADMO and the Ghana Armed Forces. By the time Accra fell, communications were down. The government broadcast a single evacuation order — <span style={{ color: WARN, fontFamily: "'Special Elite', cursive" }}>D-Day</span> — and the country tried to move.</FieldNote>
          <FieldNote>The game's world cycles through recognizable Ghanaian locations: Osu neighborhoods with collapsed bars and chop shops. Tema Industrial Area with warehouses. The Cape Coast highway strewn with abandoned vehicles. Kumasi's market district. Each zone feels culturally specific — not a generic grey city.</FieldNote>
          <FieldNote>The story is not about the outbreak. It's about a father who spent his career protecting strangers, now having to navigate a collapsed world to protect the two people who actually matter.</FieldNote>
          <MissionBrief label="Thematic Core" text="What does a soldier become when there's no mission — only family? Kwame's entire skill set was built for other people's wars. This one is personal, and that changes everything." />
        </ASection>

        <ASection label="03 — Personnel Files" stamp="RESTRICTED">
          <DossierCard id="KM-001" name="COL. KWAME MENSAH (RET.)" role="Protagonist" status="Active"
            description="62 years old. Served in ECOMOG, UN peacekeeping in DRC, and two domestic crises. Retired to Tema with his two children after their mother died. On D-Day, separated from them at a checkpoint collapse. He is not a superhero — he moves deliberately, tires realistically, and every fight costs him. But he knows how to survive, how to read terrain, and how to keep his head while everything falls apart."
            details={['Age is a mechanic — experienced but not tireless', 'Military training: infantry, close-quarters, field medicine', 'Emotional blind spot: anything involving his children']} />
          <DossierCard id="AM-002" name="AMA MENSAH" role="Kwame's Eldest Daughter — Missing" status="Located / Act II"
            description="17 years old. Found in Act II — she's been surviving on her own for weeks and has become capable and hardened. Their reunion is not a rescue. Ama doesn't need saving. She needs her father to acknowledge who she's become."
            details={["Knows things about the faction Kwame doesn't", 'Dynamic shifts: starts dependent, becomes partner', 'Her survival methods may have crossed moral lines Kwame struggles with']} />
          <DossierCard id="KM-003" name="KOFI MENSAH" role="Kwame's Son — Missing" status="Unlocated"
            description="12 years old. Location unknown at game start. Kofi's trail is the spine of the third act — and when he's found, the circumstances of his survival will reframe everything the player thought they knew."
            details={['Emotional anchor of the entire story', "His survival method is Act III's central revelation", 'His condition when found defines the emotional climax']} />
          <DossierCard id="TBD-004" name="THE ANTAGONIST [NAME PENDING]" role="Former Military Colleague — Faction Leader" status="Hostile"
            description="A former colleague of Kwame's who chose power over people when the outbreak hit. The children were not taken by accident. The final confrontation is personal — two men who once served the same mission, now representing opposite choices."
            details={['Mirror of Kwame — same training, opposite choices', 'Believes he is doing the only rational thing', 'TODO: Name, specific rank, and shared history to be decided']} />
        </ASection>

        <ASection label="04 — Systems Manual" stamp="OPERATIONAL">
          <ManualEntry number="1.0" title="INVENTORY & EQUIPMENT SYSTEM"
            body="Scavenged weapons (machetes, shotguns, repurposed tools), medical supplies, food, fuel. Weight limits force real decisions. Kwame can modify weapons using found parts. Local items: palm oil tins, dried fish (high calorie), kenkey wraps, sachet water." />
          <ManualEntry number="2.0" title="ENDURANCE & INJURY MODEL"
            body="Stamina and injury system that reflects Kwame's age. Wounds persist between levels unless treated. Running costs stamina. Every encounter has an accumulating cost — by Act III, Kwame carries the whole game in his body." />
          <ManualEntry number="3.0" title="BASE & REST PHASES"
            body="Between levels: a compound, a school, an abandoned petrol station. Resource management, crafting, survivor NPC encounters. Decisions here create narrative branches that affect what help is available in later levels." />
          <ManualEntry number="4.0" title="INTELLIGENCE GATHERING"
            body="Kwame tracks his children through clues: a schoolbag, a survivor's account, a radio message in Twi. Fragments update a hand-drawn map that drives progression. He's searching — not following a waypoint." />
          <ManualEntry number="5.0" title="CULTURAL TEXTURE"
            body="NPCs speak in a mix of English, Twi, and pidgin. Inventory includes local staples. Enemies include human factions — bandits, military splinter groups, cult survivors. The world feels specifically Ghanaian." />
          <ManualEntry number="6.0" title="ZOMBIE STAGE SYSTEM"
            body="Stage 1: Recently turned — fast, disoriented, responds to sound. Stage 2: Settled — slower, territorial, senses heat. Stage 3: Rooted — near-stationary, wide aggro radius, used as zone hazards. Stage 4: [CLASSIFIED — Act III reveal]." />
          <ManualEntry number="7.0" title="STEALTH & AVOIDANCE"
            body="Kwame is 62 with limited stamina. Stealth is rewarded more than combat. Crouching, distraction, route planning. Killing every threat is not sustainable — and the game's resource system ensures the player feels this." />
          <ManualEntry number="8.0" title="MORAL DECISION SYSTEM"
            body="Helping or ignoring survivors affects the world state. Camps Kwame aided are different on a return pass. NPCs remember behavior. The world is a record of choices — not a score, but a quiet, accumulating consequence." />
        </ASection>

        <ASection label="05 — Incident Log" stamp="CHRONOLOGICAL">
          <IncidentBlock phase="01" title="D-Day / The Separation" location="Tema Industrial Area, Accra"
            body="The separation. Tutorial-as-chaos. Kwame fights through collapsing Tema to reach the last known location of his children's school bus. He finds it empty — but finds the first clue: Ama's notebook with a handwritten note. The city is falling. He has to move before it fully goes dark." />
          <IncidentBlock phase="02" title="The Road North" location="Cape Coast Highway → Kumasi Outskirts"
            body="Following the trail through increasingly hostile territory. Alliances and betrayals with survivor groups. Ama is found — not saved, found. She's been managing. The truth slowly surfaces: someone is using the outbreak for control, and the children didn't end up where they are by accident." />
          <IncidentBlock phase="03" title="Reunion" location="Northern Interior [CLASSIFIED]"
            body="Kwame and Ama track Kofi together. The emotional weight of the full reunion is earned — each character has changed and the relationships have to be renegotiated, not just restored. The ending turns on a single choice: what Kwame does after the confrontation." />
        </ASection>

        <ASection label="06 — Operational Map" stamp="FIELD ANNOTATED">
          <div className="am mb-4" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.4, letterSpacing: '0.2em' }}>CLICK A ZONE MARKER TO EXPAND FIELD REPORT →</div>
          <OperationalMap />
        </ASection>

        <ASection label="07 — Personnel Comparison" stamp="ASSESSMENT">
          <div className="am mb-4" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.4, letterSpacing: '0.2em' }}>SELECT PERSONNEL FILE TO VIEW CAPABILITY ASSESSMENT →</div>
          <PersonnelComparison />
        </ASection>

        <ASection label="08 — Event Timeline" stamp="DUAL TRACK">
          <div className="ab italic mb-4" style={{ color: PALE, opacity: 0.55, fontSize: '0.95rem', borderLeft: `2px solid ${WARN}30`, paddingLeft: '1rem' }}>
            Two tracks: what Kwame experienced, and what Ama experienced while he was searching. The gap between the tracks — everything she did that he didn't see — is the emotional engine of Act II. Select a beat to expand.
          </div>
          <DualTimeline />
        </ASection>

        <ASection label="09 — Visual Directive" stamp="ART BRIEF">
          <ArtDirective />
        </ASection>

        <ASection label="10 — Audio Directive" stamp="SOUND BRIEF">
          <AudioDirective />
        </ASection>

        <ASection label="11 — Research & Cultural Notes" stamp="REFERENCE">
          <MissionBrief label="Accuracy Commitment" text="This game is set in Ghana, made about Ghanaian people, and will be played by Ghanaian players. Every cultural detail — language, architecture, social dynamics, spiritual belief — must be treated with the same rigor as the gameplay systems. Cultural accuracy is not a polish step. It is foundational." />
          <ResearchPanel />
        </ASection>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px dashed ${BORD}`, padding: '1.5rem', textAlign: 'center' }}>
        <div className="am" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.25, letterSpacing: '0.3em' }}>
          ABƆDE · DESIGN BIBLE · DRAFT 0.2 · ALL 11 SECTIONS COMPLETE
        </div>
      </div>
    </div>
  );
};

export default AbodePage;