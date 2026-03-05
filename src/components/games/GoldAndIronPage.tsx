import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// GOLD & IRON — Visual identity: ancient war chronicle / illuminated codex.
// Cinzel Decorative headers, EB Garamond body, kente ornamental dividers,
// warm firelight background, corner-ornamented character entries.
// ─────────────────────────────────────────────────────────────

const GOLD      = '#c9962b';
const IRON      = '#8a9aaa';
const PARCHMENT = '#e8d8b0';
const BG        = '#100c00';
const SURFACE   = '#1a1400';
const BORDER    = '#3d2e00';
const SPIRIT    = '#a0c8a0';
const HOLY      = '#c8c0e8';
const BLOOD     = '#8b1a1a';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');`;

const BASE_CSS = `
  .gi-title-display{font-family:'Cinzel Decorative',serif;}
  .gi-title{font-family:'Cinzel',serif;}
  .gi-body{font-family:'EB Garamond',Georgia,serif;font-size:1.1rem;line-height:1.9;}
  .gi-small{font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;}
  .gi-bg-warm::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(ellipse 120% 60% at 50% 110%,${GOLD}07,transparent 60%);}
  .gi-seal{display:inline-flex;align-items:center;justify-content:center;
    font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;
    color:${GOLD};border:1px solid ${GOLD}55;padding:.35rem 1rem;position:relative;}
  .gi-seal::before,.gi-seal::after{content:'◆';position:absolute;font-size:.4rem;color:${GOLD};opacity:.6;}
  .gi-seal::before{left:.4rem;} .gi-seal::after{right:.4rem;}
`;

// ── PRIMITIVES ────────────────────────────────────────────────

const KenteDivider: React.FC<{ color?: string }> = ({ color = GOLD }) => (
  <div className="flex items-center gap-3 my-10">
    <div className="h-[1px] flex-1" style={{ background: `${color}30` }} />
    <svg width={80} height={16} viewBox="0 0 80 16">
      <rect x={0}  y={6} width={8}  height={4} fill={color} opacity={0.3}/>
      <rect x={10} y={4} width={4}  height={8} fill={color} opacity={0.5}/>
      <rect x={16} y={6} width={8}  height={4} fill={color} opacity={0.3}/>
      <polygon points="28,8 32,4 36,8 32,12" fill={color} opacity={0.6}/>
      <rect x={38} y={6} width={4}  height={4} fill={color} opacity={0.8}/>
      <polygon points="44,8 48,4 52,8 48,12" fill={color} opacity={0.6}/>
      <rect x={56} y={6} width={8}  height={4} fill={color} opacity={0.3}/>
      <rect x={66} y={4} width={4}  height={8} fill={color} opacity={0.5}/>
      <rect x={72} y={6} width={8}  height={4} fill={color} opacity={0.3}/>
    </svg>
    <div className="h-[1px] flex-1" style={{ background: `${color}30` }} />
  </div>
);

const ChapterHeading: React.FC<{ roman: string; title: string; color?: string }> = ({ roman, title, color = GOLD }) => (
  <motion.div className="text-center mb-10"
    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}>
    <div className="gi-small mb-2" style={{ color, opacity: 0.5 }}>{roman}</div>
    <h2 className="gi-title-display" style={{ color, fontSize: 'clamp(1.4rem,4vw,2.2rem)', letterSpacing: '0.04em' }}>{title}</h2>
    <div className="flex items-center justify-center gap-3 mt-4">
      <div className="h-[1px] w-16" style={{ background: `${color}30` }} />
      <svg width={16} height={16} viewBox="0 0 16 16">
        <polygon points="8,2 10,6 14,6 11,9 12,13 8,10 4,13 5,9 2,6 6,6" fill={color} opacity={0.5}/>
      </svg>
      <div className="h-[1px] w-16" style={{ background: `${color}30` }} />
    </div>
  </motion.div>
);

const CodexSection: React.FC<{ roman: string; title: string; children: React.ReactNode; color?: string }> = ({ roman, title, children, color = GOLD }) => (
  <motion.div className="mb-24" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}>
    <KenteDivider color={color} />
    <ChapterHeading roman={roman} title={title} color={color} />
    {children}
  </motion.div>
);

const Chronicle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="gi-body max-w-2xl mx-auto" style={{ color: PARCHMENT, opacity: 0.82 }}>{children}</div>
);

const PullQuote: React.FC<{ text: string; attribution?: string; color?: string }> = ({ text, attribution, color = GOLD }) => (
  <motion.div className="my-12 text-center px-4 md:px-16"
    initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }} transition={{ duration: 0.6 }}>
    <div className="gi-small mb-4" style={{ color, opacity: 0.4 }}>◆ ◆ ◆</div>
    <blockquote className="gi-body italic" style={{ color: PARCHMENT, fontSize: '1.25rem', lineHeight: 1.7, opacity: 0.88 }}>"{text}"</blockquote>
    {attribution && <div className="gi-small mt-4" style={{ color, opacity: 0.5 }}>{attribution}</div>}
  </motion.div>
);

const WarriorEntry: React.FC<{ name: string; title: string; allegiance: string; epitaphs: string[]; description: string; arc: string; accentColor: string }> = ({ name, title, allegiance, epitaphs, description, arc, accentColor }) => (
  <motion.div className="mb-8 relative" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
    style={{ background: `${accentColor}06`, border: `1px solid ${accentColor}30`, padding: '2rem' }}>
    {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos, i) => (
      <div key={i} className={`absolute ${pos} w-3 h-3`} style={{ border: `1px solid ${accentColor}50`, transform: 'translate(-1px,-1px)' }}/>
    ))}
    <div className="gi-small mb-1" style={{ color: accentColor, opacity: 0.5 }}>{allegiance}</div>
    <h3 className="gi-title-display mb-1" style={{ color: accentColor, fontSize: 'clamp(1.4rem,4vw,2rem)', letterSpacing: '0.03em', lineHeight: 1.1 }}>{name}</h3>
    <div className="gi-small mb-6" style={{ color: PARCHMENT, opacity: 0.4 }}>{title}</div>
    <p className="gi-body mb-6 leading-relaxed" style={{ color: PARCHMENT, opacity: 0.78, fontSize: '1rem' }}>{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="gi-small mb-3" style={{ color: accentColor, opacity: 0.5 }}>Known For</div>
        {epitaphs.map((e, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <span style={{ color: accentColor, opacity: 0.4, fontSize: '0.6rem', marginTop: '0.45rem' }}>◆</span>
            <span className="gi-body" style={{ color: PARCHMENT, opacity: 0.68, fontSize: '0.95rem' }}>{e}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="gi-small mb-3" style={{ color: accentColor, opacity: 0.5 }}>Arc of the Story</div>
        <div className="gi-body italic" style={{ color: PARCHMENT, opacity: 0.68, fontSize: '0.95rem', lineHeight: 1.7 }}>{arc}</div>
      </div>
    </div>
  </motion.div>
);

const BattleRecord: React.FC<{ phase: string; title: string; theatre: string; description: string; accentColor?: string }> = ({ phase, title, theatre, description, accentColor = GOLD }) => (
  <motion.div className="mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
    style={{ borderLeft: `2px solid ${accentColor}40`, paddingLeft: '1.5rem' }}>
    <div className="flex items-baseline gap-4 mb-2 flex-wrap">
      <span className="gi-title-display" style={{ color: accentColor, fontSize: '2rem', opacity: 0.25, lineHeight: 1 }}>{phase}</span>
      <span className="gi-title" style={{ color: PARCHMENT, fontSize: '1.1rem', letterSpacing: '0.05em', opacity: 0.85 }}>{title}</span>
      <span className="gi-small ml-auto" style={{ color: PARCHMENT, opacity: 0.3 }}>{theatre}</span>
    </div>
    <p className="gi-body leading-relaxed" style={{ color: PARCHMENT, opacity: 0.7, fontSize: '1rem' }}>{description}</p>
  </motion.div>
);

const ScrollEntry: React.FC<{ art: string; description: string; index: number; color?: string }> = ({ art, description, index, color = GOLD }) => (
  <motion.div className="mb-6 flex gap-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.4 }}>
    <div className="gi-title flex-shrink-0" style={{ color, opacity: 0.2, fontSize: '1.8rem', lineHeight: 1, width: 32, textAlign: 'right' }}>
      {(index + 1).toString().padStart(2, '0')}
    </div>
    <div>
      <div className="gi-title mb-1" style={{ color, fontSize: '1rem', letterSpacing: '0.06em' }}>{art}</div>
      <div className="gi-body leading-relaxed" style={{ color: PARCHMENT, opacity: 0.72, fontSize: '1rem' }}>{description}</div>
    </div>
  </motion.div>
);

const CodexCard: React.FC<{ label: string; content: string; color?: string }> = ({ label, content, color = GOLD }) => (
  <div style={{ background: `${color}06`, border: `1px solid ${color}20`, padding: '1.25rem' }}>
    <div className="gi-small mb-2" style={{ color, opacity: 0.5 }}>{label}</div>
    <div className="gi-body" style={{ color: PARCHMENT, opacity: 0.78, fontSize: '0.95rem', lineHeight: 1.7 }}>{content}</div>
  </div>
);

const PartSeal: React.FC<{ label: string; color?: string }> = ({ label, color = GOLD }) => (
  <div className="flex justify-center mb-8">
    <span className="gi-seal" style={{ background: `${color}08` }}>{label}</span>
  </div>
);

const PART_COLORS = { 1: GOLD, 2: SPIRIT, 3: HOLY };
const PART_LABELS: Record<number, string> = { 1: 'Part One — The Warrior', 2: 'Part Two — The Inheritance', 3: 'Part Three — The Seed' };

const PartToggle: React.FC<{ active: number; onSelect: (n: number) => void }> = ({ active, onSelect }) => (
  <div className="flex justify-center gap-3 flex-wrap mb-12">
    {([1, 2, 3] as const).map(n => {
      const color = PART_COLORS[n];
      return (
        <button key={n} onClick={() => onSelect(n)} className="gi-seal transition-all duration-300"
          style={{ color: active === n ? BG : color, background: active === n ? color : `${color}10`, borderColor: `${color}55` }}>
          {PART_LABELS[n]}
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// VI — WORLD MAPS
// Two maps toggled by part. Both styled as hand-illustrated
// parchment maps — SVG paths with aged feel, not clean UI pins.
// Gold Coast map: lush, organic, wide. New World: enclosed, grid-like, foreign.
// ─────────────────────────────────────────────────────────────

const GC_ZONES = [
  { id:'village', label:'The Village', x:52, y:28, color:GOLD, act:'Act I', threat:'None — the world before the raid', desc:"Kofi's home. A village of the Ashanti interior — compound houses, shared ceremony grounds, the forge where akrafena swords are made. The opening level takes place here during a celebration. It ends in fire.", significance:"The world Kofi is fighting to return to. Everything the game's action is in service of began here." },
  { id:'forest', label:'Forest Pursuit', x:38, y:42, color:SPIRIT, act:'Act I', threat:'Rival tribesmen, wildlife, disorientation', desc:"The first zone of the chase. Dense canopy, poor sightlines, the sound of the caravan always ahead. Kofi's ancestral connection is at its weakest here — he is newly escaped, wounded, and terrified. The forest teaches him to listen.", significance:"First zone where ancestral power begins to reassert. The forest ancestors are old and patient." },
  { id:'savanna', label:'The Savanna', x:58, y:55, color:GOLD, act:'Act II', threat:'Open ground, colonial patrols, wildlife bosses', desc:"The caravan crosses open savanna. No cover. Kofi must shadow it from distance, intercept supply lines, liberate the first freed villagers who become allies. The lion encounter is the first wildlife boss — a territorial guardian that, once defeated with respect, becomes a spiritual ally.", significance:"Where Kofi's ancestral power fully awakens. The ancestors of the open plain respond to a warrior in motion." },
  { id:'fort', label:'Cape Coast Fort', x:28, y:72, color:IRON, act:'Act II–III', threat:'Colonial fortification, muskets, organized military', desc:"A European coastal fort — the architecture of the slave trade made stone. Kofi must infiltrate to find where his family is held before the ship departs. The fort is the game's most mechanically complex zone: guards on rotation, architecture that rewards patience, and the first moment Kofi faces firearms at scale.", significance:"The meeting point of two worlds. Where Kofi's traditional power confronts institutional colonial violence." },
  { id:'ship', label:'The Slave Ship', x:18, y:85, color:BLOOD, act:'Act III', threat:'Colonial crew, confined spaces, the sea', desc:"The final zone. Every level prior was preparation for this. Kofi fights room by room — hold to deck to bridge. Claustrophobic, morally harrowing, room by room. The final boss is the colonial commander: not a monster, but a man doing his job, which is what makes defeating him essential.", significance:"Where the power transfers. Where Kofi dies. Where the saga begins." },
];

const NW_ZONES = [
  { id:'docks', label:'The Harbour', x:22, y:72, color:IRON, act:'Arrival', threat:'Unfamiliar — the new world is vast and illegible', desc:"The ship docks. Years have passed. Akosua and a young Abena step into a colonial harbour — the first time the visual language shifts entirely. Warm Gold Coast ochre is gone. Grey stone, ordered streets, church towers. Everything feels enclosed.", significance:"The visual tonal shift. The parchment itself should feel colder on this map." },
  { id:'hartfield', label:'Hartfield Mission', x:42, y:55, color:HOLY, act:'Act I', threat:'Social threat — the wrong kind of kindness', desc:"The missionary compound that takes in Akosua and Abena. Genuine warmth living inside genuine blindness. The Hartfields love Abena and cannot see that what they're asking her to be is a diminishment. Elias grows up alongside Abena here — their friendship is the emotional foundation of Part Two.", significance:"The place where two powers first live alongside each other without understanding what the other is." },
  { id:'settlement', label:'Colonial Settlement', x:62, y:42, color:IRON, act:'Act II', threat:'Political/social threat, inquisition-style authority', desc:"The wider colonial settlement — the world the Hartfields operate within. Colonial authority is watching Abena. A girl with powers that don't fit any theological category is a problem to be solved, not a gift to be protected. The antagonist's sphere of influence begins here.", significance:"Where the cultural tension becomes active threat. Elias and Abena stop being sheltered and start being hunted." },
  { id:'wilderness', label:'The Outer Wilderness', x:75, y:28, color:SPIRIT, act:'Act II–III', threat:'Supernatural — the thing that followed from the Gold Coast', desc:"Beyond the settlement boundary. Wild land that the colonists haven't ordered yet. Abena's ancestral power works differently here — stronger, stranger, less controllable. The Part Two antagonist (or entity) is most powerful in this space.", significance:"Where the two power systems first combine effectively. The wilderness doesn't belong to either culture — so both powers work freely." },
  { id:'reckoning', label:'The Reckoning Place', x:48, y:18, color:HOLY, act:'Act III', threat:'Final confrontation', desc:"Where the final battle of Part Two takes place — a location that will be defined more precisely when the Part Two antagonist is finalised. Should feel like neutral ground: neither the colonial order nor the wilderness, but something between them, forged by the conflict itself.", significance:"Where the combined power first achieves its full expression. The ending of Part Two and the seed of Part Three." },
];

const WorldMaps: React.FC = () => {
  const [activePart, setActivePart] = useState<1 | 2>(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const zones = activePart === 1 ? GC_ZONES : NW_ZONES;
  const zone = zones.find(z => z.id === selectedZone);

  return (
    <div>
      {/* Part selector */}
      <div className="flex justify-center gap-3 mb-8">
        {([1, 2] as const).map(p => {
          const color = p === 1 ? GOLD : HOLY;
          const label = p === 1 ? 'Part One — Gold Coast' : 'Part Two — The New World';
          return (
            <button key={p} onClick={() => { setActivePart(p); setSelectedZone(null); }}
              className="gi-seal transition-all duration-300"
              style={{ color: activePart === p ? BG : color, background: activePart === p ? color : `${color}10`, borderColor: `${color}55` }}>
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Map canvas */}
        <div className="lg:col-span-3 relative" style={{ background: `${GOLD}04`, border: `1px solid ${BORDER}`, minHeight: 420, overflow: 'hidden' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Parchment grid lines */}
            {[20,40,60,80].map(v => (
              <g key={v}>
                <line x1={v} y1={0} x2={v} y2={100} stroke={GOLD} strokeWidth={0.2} strokeDasharray="3 4" opacity={0.2}/>
                <line x1={0} y1={v} x2={100} y2={v} stroke={GOLD} strokeWidth={0.2} strokeDasharray="3 4" opacity={0.2}/>
              </g>
            ))}

            <AnimatePresence mode="wait">
              {activePart === 1 ? (
                // Gold Coast — organic landmass, coast bottom-left
                <motion.g key="gc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  {/* Landmass blob */}
                  <path d="M15,95 Q10,80 14,68 Q12,55 18,44 Q22,34 30,26 Q40,18 52,16 Q64,14 72,22 Q80,28 82,40 Q86,52 80,62 Q76,72 70,80 Q62,90 50,94 Q36,98 24,96 Z"
                    fill={`${SPIRIT}08`} stroke={`${GOLD}20`} strokeWidth={0.4}/>
                  {/* Forest canopy texture */}
                  {[{x:30,y:35},{x:42,y:30},{x:36,y:45},{x:25,y:48}].map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={4} fill={`${SPIRIT}12`} stroke={`${SPIRIT}20`} strokeWidth={0.3}/>
                  ))}
                  {/* Coastline indicator */}
                  <path d="M15,85 Q20,82 28,84 Q32,86 35,88 Q38,90 38,94" fill="none" stroke={`${IRON}30`} strokeWidth={0.5} strokeDasharray="2 1"/>
                  {/* Route between zones */}
                  {GC_ZONES.slice(0, -1).map((z, i) => {
                    const next = GC_ZONES[i + 1];
                    return <line key={i} x1={z.x} y1={z.y} x2={next.x} y2={next.y} stroke={`${GOLD}25`} strokeWidth={0.5} strokeDasharray="3 2"/>;
                  })}
                </motion.g>
              ) : (
                // New World — ordered grid, enclosed feeling
                <motion.g key="nw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  {/* Grid streets — colonial planning */}
                  {[25,35,45,55,65].map(v => (
                    <g key={v}>
                      <line x1={v} y1={30} x2={v} y2={90} stroke={`${IRON}18`} strokeWidth={0.4}/>
                      <line x1={15} y1={v-5} x2={85} y2={v-5} stroke={`${IRON}18`} strokeWidth={0.4}/>
                    </g>
                  ))}
                  {/* Settlement boundary */}
                  <rect x={20} y={35} width={55} height={50} fill="none" stroke={`${IRON}20`} strokeWidth={0.4} strokeDasharray="4 2"/>
                  {/* Wilderness — beyond boundary */}
                  <path d="M75,35 Q82,28 78,22 Q72,16 65,20 Q60,14 55,18 Q50,10 48,18" fill="none" stroke={`${SPIRIT}20`} strokeWidth={0.4}/>
                  {/* Route */}
                  {NW_ZONES.slice(0, -1).map((z, i) => {
                    const next = NW_ZONES[i + 1];
                    return <line key={i} x1={z.x} y1={z.y} x2={next.x} y2={next.y} stroke={`${HOLY}20`} strokeWidth={0.5} strokeDasharray="3 2"/>;
                  })}
                </motion.g>
              )}
            </AnimatePresence>

            {/* Zone markers — consistent across both maps */}
            {zones.map(z => (
              <g key={z.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedZone(selectedZone === z.id ? null : z.id)}>
                {selectedZone === z.id && (
                  <circle cx={z.x} cy={z.y} r={5} fill="none" stroke={z.color} strokeWidth={0.5} opacity={0.4}/>
                )}
                {/* Diamond marker — heraldic feel */}
                <polygon
                  points={`${z.x},${z.y-2.5} ${z.x+2.5},${z.y} ${z.x},${z.y+2.5} ${z.x-2.5},${z.y}`}
                  fill={selectedZone === z.id ? z.color : SURFACE}
                  stroke={z.color} strokeWidth={0.6}
                  opacity={selectedZone && selectedZone !== z.id ? 0.3 : 1}/>
                <text x={z.x + 3.5} y={z.y - 1.5} fontSize="2.2" fill={PARCHMENT}
                  opacity={selectedZone && selectedZone !== z.id ? 0.2 : 0.65}
                  style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>{z.label}</text>
                <text x={z.x + 3.5} y={z.y + 2} fontSize="1.7" fill={z.color}
                  opacity={selectedZone && selectedZone !== z.id ? 0.15 : 0.45}
                  style={{ fontFamily: 'Cinzel, serif' }}>{z.act}</text>
              </g>
            ))}
          </svg>

          <div className="absolute bottom-3 left-3 gi-small" style={{ color: GOLD, opacity: 0.3, fontSize: '0.5rem' }}>
            {activePart === 1 ? 'GOLD COAST · ASHANTI INTERIOR & COAST' : 'THE NEW WORLD · COLONIAL SETTLEMENT & WILDERNESS'}
          </div>
          <div className="absolute top-3 right-3 gi-small" style={{ color: PARCHMENT, opacity: 0.2, fontSize: '0.5rem' }}>CLICK ZONE ◆</div>
        </div>

        {/* Zone detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {zone ? (
              <motion.div key={zone.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="h-full p-5 flex flex-col gap-4 relative"
                style={{ background: `${zone.color}07`, border: `1px solid ${zone.color}25`, minHeight: 420 }}>
                {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-2 h-2`} style={{ border: `1px solid ${zone.color}40`, transform: 'translate(-1px,-1px)' }}/>
                ))}
                <div>
                  <div className="gi-small mb-1" style={{ color: zone.color, opacity: 0.6 }}>{zone.act}</div>
                  <h3 className="gi-title-display mb-4" style={{ color: zone.color, fontSize: '1.4rem', lineHeight: 1.1 }}>{zone.label}</h3>
                  <p className="gi-body leading-relaxed mb-4" style={{ color: PARCHMENT, opacity: 0.78, fontSize: '0.95rem' }}>{zone.desc}</p>
                </div>
                <div className="mt-auto space-y-3">
                  <div style={{ borderTop: `1px solid ${zone.color}20`, paddingTop: '0.75rem' }}>
                    <div className="gi-small mb-1" style={{ color: zone.color, opacity: 0.5 }}>Threat Landscape</div>
                    <div className="gi-body" style={{ color: PARCHMENT, opacity: 0.65, fontSize: '0.9rem' }}>{zone.threat}</div>
                  </div>
                  <div style={{ borderTop: `1px solid ${zone.color}20`, paddingTop: '0.75rem' }}>
                    <div className="gi-small mb-1" style={{ color: zone.color, opacity: 0.5 }}>Significance</div>
                    <div className="gi-body italic" style={{ color: PARCHMENT, opacity: 0.65, fontSize: '0.9rem' }}>{zone.significance}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
                className="flex items-center justify-center" style={{ border: `1px solid ${BORDER}`, minHeight: 420 }}>
                <div className="text-center">
                  <div className="gi-small mb-2" style={{ color: GOLD }}>Select a Location</div>
                  <div className="gi-small" style={{ color: PARCHMENT, opacity: 0.4, fontSize: '0.5rem' }}>Click a diamond marker on the map</div>
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
// VII — VISUAL DOCTRINE (ART DIRECTION)
// Full art direction: palette, design principles, zone visual
// identity per part, character motion language, UI doctrine.
// ─────────────────────────────────────────────────────────────

const PALETTE_DATA = [
  { name: 'Ancestral Gold',  hex: GOLD,      use: 'Power / Heritage / The through-line of the saga' },
  { name: 'Colonial Iron',   hex: IRON,      use: 'Enemy armor / foreign steel / the cold against the warm' },
  { name: 'Parchment',       hex: PARCHMENT, use: 'Body text / scroll surfaces / warm light' },
  { name: 'Spirit Green',    hex: SPIRIT,    use: "Abena's power / ancestral nature / living things" },
  { name: 'Holy Violet',     hex: HOLY,      use: "Elias's power / divine light / faith made visible" },
  { name: 'Blood Red',       hex: BLOOD,     use: 'Sacrifice / war / the cost of freedom' },
  { name: 'Warm Black',      hex: BG,        use: 'Page background / deepest shadow / sealed wood' },
  { name: 'Aged Bronze',     hex: BORDER,    use: 'Borders / aged materials / the passage of time' },
  { name: 'Forest Shadow',   hex: '#2a3a1a', use: 'Forest zone darkness / canopy depth' },
  { name: 'Savanna Ochre',   hex: '#c8882a', use: 'Open plain ground / midday light' },
  { name: 'Ship Timber',     hex: '#4a2a0a', use: 'Slave ship interior / aged wood hull' },
  { name: 'Colonial Stone',  hex: '#8a8878', use: 'Fort architecture / settlement buildings' },
];

const DESIGN_PRINCIPLES = [
  { n:'01', color: GOLD, title: 'Two Visual Languages, One World', body: "Part One's visual language is organic, warm, dense — Ashanti architecture, forest canopy, laterite earth. Part Two's visual language is ordered, cold, geometric — colonial grid streets, grey stone, structured light. The contrast is the story. The player should feel the difference in their bones." },
  { n:'02', color: GOLD, title: 'Gold as Power, Iron as System', body: "Kofi's ancestral power glows warm gold. Colonial steel is the blue-grey of iron. When Kofi uses a colonizer's weapon, its color bleeds into his hands. When Abena and Elias combine their powers, the gold and violet briefly become something neither color — a visual signal that something new is being forged." },
  { n:'03', color: SPIRIT, title: 'Kente as UI Language', body: "The UI grid system is derived from kente weave geometry — health bars, ability icons, and section borders all use the same interlocking pattern. In Part Two, colonial typography begins to appear alongside it. The UI reflects the cultural collision of the narrative. By Part Three, both systems should feel integrated, not competing." },
  { n:'04', color: SPIRIT, title: 'The Ship is the World Inverted', body: "The slave ship interior in Part One must feel like the inverse of every other zone. Outside: wide, open, directional. Inside the ship: low ceilings, confined corridors, no horizon. The game has been building toward this claustrophobia. Every zone before it should feel open in retrospect." },
  { n:'05', color: HOLY, title: 'Character Motion as Identity', body: "Kofi moves with controlled weight — a warrior's economy of motion, nothing wasted. Abena moves as if she's partially elsewhere — her evasions feel like slipping between states rather than dodging. Elias moves with the slight hesitation of someone whose power still surprises him. Each character's animation language communicates their relationship to their own ability." },
  { n:'06', color: HOLY, title: 'Historical Architecture as Level Design', body: "Every Part One level must reference real Gold Coast architecture: the compound house, the akrafena forge, the coastal fort structure at Cape Coast or Elmina. Part Two references Caribbean or American colonial architecture with equal specificity. No generic fantasy setting. The buildings should be recognizable to anyone who has studied this history." },
];

const ZONE_VISUALS = [
  { zone: "The Village", part: 1, palette: "Warm ochre compounds, deep green canopy, firelight", feel: "Safety and ceremony. The visual baseline of everything the game will take from you. Remember this. You will not see it again until the final image." },
  { zone: "Forest Interior", part: 1, palette: "Deep shadow green, filtered gold light shafts, humid haze", feel: "Disorienting and alive. The forest is not hostile — it is indifferent. That is its own kind of danger." },
  { zone: "The Savanna", part: 1, palette: "Burnt amber ground, pale blue sky, grass moving in wind", feel: "Exposed and urgent. The caravan is visible in the distance. Kofi has never felt so visible." },
  { zone: "Cape Coast Fort", part: 1, palette: "Grey-white colonial stone, iron fittings, the sea behind", feel: "The architecture of the slave trade. Cold, deliberate, geometric. Wrong in a way that isn't about aesthetics." },
  { zone: "The Ship", part: 1, palette: "Dark timber, single lantern pools, the smell of the hold implied by color — deep brown-black with no warmth", feel: "The world inverted. No horizon. No sky. Only the ship, and the people in it, and Kofi." },
  { zone: "Colonial Settlement", part: 2, palette: "Grey stone, white-painted timber, ordered green lawns, church spire", feel: "Legible but foreign. Everything is organized in ways that exclude. The beauty of it is part of the problem." },
  { zone: "Wilderness", part: 2, palette: "Wild green, ancient trees, no fences, Abena's power visible in the air", feel: "The only place in Part Two where both characters breathe. The wilderness belongs to neither world — which means both powers work freely." },
];

const ArtDoctrine: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeVPart, setActiveVPart] = useState<1 | 2>(1);

  return (
    <div className="space-y-12">
      {/* Palette */}
      <div>
        <div className="gi-small text-center mb-6" style={{ color: GOLD, opacity: 0.4 }}>The Color Chronicle</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PALETTE_DATA.map(p => (
            <div key={p.hex} onMouseEnter={() => setHovered(p.hex)} onMouseLeave={() => setHovered(null)}>
              <motion.div style={{ background: p.hex, border: `1px solid ${BORDER}`, marginBottom: '0.4rem' }}
                animate={{ height: hovered === p.hex ? 72 : 48 }} transition={{ duration: 0.2 }}/>
              <div className="gi-small" style={{ color: PARCHMENT, opacity: 0.6, fontSize: '0.5rem' }}>{p.name}</div>
              <AnimatePresence>
                {hovered === p.hex && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="gi-body mt-1" style={{ color: PARCHMENT, opacity: 0.55, fontSize: '0.8rem' }}>
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
        <div className="gi-small text-center mb-6" style={{ color: GOLD, opacity: 0.4 }}>The Visual Doctrine</div>
        <div className="space-y-3">
          {DESIGN_PRINCIPLES.map((p, i) => (
            <motion.div key={p.n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex gap-5 p-5" style={{ background: `${p.color}06`, border: `1px solid ${p.color}20` }}>
              <div className="gi-title-display flex-shrink-0" style={{ color: p.color, opacity: 0.2, fontSize: '1.6rem', lineHeight: 1, width: 28, textAlign: 'right' }}>{p.n}</div>
              <div>
                <div className="gi-title mb-2" style={{ color: p.color, fontSize: '1rem', letterSpacing: '0.05em' }}>{p.title}</div>
                <div className="gi-body leading-relaxed" style={{ color: PARCHMENT, opacity: 0.72, fontSize: '0.98rem' }}>{p.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zone visual identity by part */}
      <div>
        <div className="gi-small text-center mb-6" style={{ color: GOLD, opacity: 0.4 }}>Zone Visual Identity</div>
        <div className="flex justify-center gap-3 mb-6">
          {([1, 2] as const).map(p => {
            const color = p === 1 ? GOLD : HOLY;
            return (
              <button key={p} onClick={() => setActiveVPart(p)} className="gi-seal transition-all duration-200"
                style={{ color: activeVPart === p ? BG : color, background: activeVPart === p ? color : `${color}10`, borderColor: `${color}55` }}>
                {p === 1 ? 'Part One' : 'Part Two'}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ZONE_VISUALS.filter(z => z.part === activeVPart).map(z => (
            <motion.div key={z.zone} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
              className="p-4" style={{ background: `${GOLD}05`, border: `1px solid ${BORDER}` }}>
              <div className="gi-title mb-1" style={{ color: activeVPart === 1 ? GOLD : HOLY, fontSize: '1rem', letterSpacing: '0.04em' }}>{z.zone}</div>
              <div className="gi-body mb-2" style={{ color: PARCHMENT, opacity: 0.55, fontSize: '0.85rem' }}>
                <span style={{ color: activeVPart === 1 ? GOLD : HOLY, opacity: 0.7 }}>Palette: </span>{z.palette}
              </div>
              <div className="gi-body italic" style={{ color: PARCHMENT, opacity: 0.72, fontSize: '0.92rem' }}>{z.feel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// VIII — THE SOUND OF THE SAGA
// Zone audio accordion (same structure as Irregular's audio
// section but styled as manuscript entries, not tech docs).
// Per-part audio identity + sound design notes.
// ─────────────────────────────────────────────────────────────

const AUDIO_ZONES = [
  { zone: 'The Village (Opening)', part: 1, color: GOLD, instruments: 'Atenteben flute, fontomfrom drums, talking drum, mbira', tempo: 'Celebratory, moderate — the rhythm of a living community', mood: "Joy and belonging. The player needs to feel what's about to be lost. The music must be beautiful enough to break the heart when it stops.", battle: "When the raid begins: the celebration rhythm shatters. Fontomfrom war drums surge. The mbira melody is ripped away mid-note — silence — then chaos.", ref: 'Ebo Taylor — Afrobeat, Ghanaian highlife. Nana Amponsah — kpanlogo rhythms.' },
  { zone: 'Forest Interior', part: 1, color: SPIRIT, instruments: 'Sparse talking drum, deep bass resonance, insect ambience, silence', tempo: 'Irregular — follows Kofi\'s heartbeat, not a musical pulse', mood: "Hunted. Kofi's power is suppressed here — the music should feel like it's also suppressed, barely present, reaching for something it can't quite find.", battle: "When combat triggers: a sudden, raw percussion burst. Ancestors trying to reach through.", ref: 'Rokia Traoré — sparse, intimate. Nils Frahm — minimalist piano fragments.' },
  { zone: 'The Savanna', part: 1, color: '#c8882a', instruments: 'Full talking drum ensemble, kora, open-air resonance, wind', tempo: 'Driving — the caravan is always moving forward. The music mirrors that urgency.', mood: "Power fully awakening. The ancestors of the open plain answer a warrior in motion. The music becomes fully present here for the first time.", battle: "Combat music is the most fully realized of Part One — the talking drums build to a war cadence, the kora drops to a single repeating phrase.", ref: 'Youssou N\'Dour — full ensemble. Salif Keita — epic West African voice.' },
  { zone: 'Cape Coast Fort', part: 1, color: IRON, instruments: 'European fife and drum, colonial military march, low drone underneath', tempo: 'Rigid, precise — colonial time signature deliberately different from African rhythms', mood: "Dissonance. Kofi moves through a world whose sonic language is designed to exclude him. The African rhythmic base is present but suppressed beneath colonial sound.", battle: "The colonial march becomes chaotic in combat — Kofi's power disrupts even its sound design.", ref: 'Ennio Morricone — historical tension. Ben Frost — dread.' },
  { zone: 'The Slave Ship', part: 1, color: BLOOD, instruments: 'Near silence. Ship timbers. Breathing. Footsteps on wood. One ancestral tone.', tempo: 'No tempo. Time is suspended.', mood: "The game has spent every act preparing for this. The silence is earned. The single ancestral tone that sounds when Kofi enters the hold is the most important musical moment in the game.", battle: "Combat aboard the ship is almost silent — only the ship's structure, bodies, and Kofi's breathing. The final boss encounter has one returning theme: the village melody, fragmented.", ref: 'Arvo Pärt — Spiegel im Spiegel. Ólafur Arnalds — disappearance.' },
  { zone: 'Colonial Settlement', part: 2, color: IRON, instruments: 'Church organ (distant), hymn fragments, constrained string quartet', tempo: 'Formal, controlled — European harmonic structure imposed on the landscape', mood: "Beautiful and suffocating. The music represents a worldview that cannot accommodate Abena. The organ is genuinely lovely and genuinely wrong.", battle: "When Abena's power activates in the settlement, her ancestral tone cuts through the organ like light through a window. The two musical systems don't blend — they coexist uneasily.", ref: 'Johann Sebastian Bach — chorale structures. Dustin O\'Halloran — piano and strings.' },
  { zone: 'The Wilderness', part: 2, color: SPIRIT, instruments: "Abena's ancestral tones, Elias's holy harmonic, nature sounds, freedom", tempo: 'Organic — for the first time in Part Two, the music breathes', mood: "Relief. This is the only place both characters are fully themselves. The score should reflect that — both themes present, not competing.", battle: "Combined power in combat: the two musical systems resolve into a third thing — a hybrid that neither character could produce alone. This sound exists nowhere else in the game.", ref: 'Max Richter — On the Nature of Daylight. Ludovico Einaudi — open textures.' },
];

const SOUND_DESIGN_NOTES = [
  { label: "Kofi's Ancestral Voice", body: "When Kofi's ancestral power activates, the score gains a layer — a low choral hum that is not quite human voices and not quite instruments. Specific ancestors have distinct tones: the warrior ancestor is deep brass, the healer ancestor is a high sustained note, the hunter ancestor is a sharp percussive burst." },
  { label: "The Power Transfer — Silence and Breath", body: "Kofi's death scene and the power transfer to Abena: after he wins, there should be at least 20 seconds of near-silence. The ship creaking. Voices of the freed. Then his breathing slowing. Then the ancestral chorus — all the ancestors at once, briefly, then narrowing to one note passing into Abena. Then she breathes. The music does not return until the ship reaches open sea." },
  { label: "Abena & Elias — Two Themes, One Resolution", body: "Abena's theme is rooted in the village melody from Part One's opening — evolved, grown, but traceable. Elias's theme is a chorale fragment — simple, earnest, not grandiose. When they fight together, the two themes interlock in counterpoint. The combined power sequence is the only time they fully resolve into a single melody." },
  { label: "Colonial Audio as Antagonist", body: "In Part Two, European musical conventions (equal temperament, harmonic structure, church acoustics) are treated as a form of sonic colonialism. They are beautiful, but they crowd out Abena's ancestral tones when she is in the settlement. Her power sounds diminished there. In the wilderness it returns to full strength. The player should feel this without being told." },
  { label: "The Final Image — Village, Peaceful, Unbroken", body: "The game's final visual echoes Part One's opening. The final sound must also echo it — the village melody, complete and unbroken, played for the first time since the raid interrupted it. The circle closes not with triumph but with return. The music should be quiet. It has earned that." },
];

const SoundOfTheSaga: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [audioPartFilter, setAudioPartFilter] = useState<'all' | 1 | 2>('all');
  const filtered = AUDIO_ZONES.filter(z => audioPartFilter === 'all' || z.part === audioPartFilter);

  return (
    <div className="space-y-10">
      <PullQuote
        text="The talking drums do not stop when the world ends. They change their message."
        attribution="Design Philosophy · Gold & Iron Audio"
        color={GOLD}
      />

      <div>
        <div className="gi-small text-center mb-4" style={{ color: GOLD, opacity: 0.4 }}>Zone Audio Identity</div>
        <div className="flex justify-center gap-3 mb-6">
          {(['all', 1, 2] as const).map(p => {
            const color = p === 'all' ? GOLD : p === 1 ? GOLD : HOLY;
            const label = p === 'all' ? 'All Parts' : p === 1 ? 'Part One' : 'Part Two';
            return (
              <button key={String(p)} onClick={() => setAudioPartFilter(p)} className="gi-seal transition-all duration-200"
                style={{ color: audioPartFilter === p ? BG : color, background: audioPartFilter === p ? color : `${color}10`, borderColor: `${color}55` }}>
                {label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          {filtered.map(z => (
            <div key={z.zone}>
              <button className="w-full text-left p-4 flex items-center justify-between transition-all"
                style={{ background: expanded === z.zone ? `${z.color}0c` : `${GOLD}04`, border: `1px solid ${expanded === z.zone ? `${z.color}35` : BORDER}` }}
                onClick={() => setExpanded(expanded === z.zone ? null : z.zone)}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2" style={{ background: z.color, transform: 'rotate(45deg)', flexShrink: 0 }}/>
                  <span className="gi-title" style={{ color: PARCHMENT, fontSize: '0.95rem', letterSpacing: '0.04em' }}>{z.zone}</span>
                  <span className="gi-small hidden sm:block" style={{ color: PARCHMENT, opacity: 0.3, fontSize: '0.5rem' }}>{z.instruments.split(',')[0]}</span>
                </div>
                <span className="gi-small" style={{ color: GOLD, opacity: 0.35 }}>{expanded === z.zone ? '▲' : '▼'}</span>
              </button>
              <AnimatePresence>
                {expanded === z.zone && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ background: `${z.color}06`, borderLeft: `2px solid ${z.color}40` }}>
                      {[
                        { label: 'Instruments', val: z.instruments },
                        { label: 'Tempo & Pulse', val: z.tempo },
                        { label: 'Mood', val: z.mood, full: true },
                        { label: 'In Combat', val: z.battle, full: true },
                        { label: 'Reference Tracks', val: z.ref },
                      ].map(item => (
                        <div key={item.label} className={(item as any).full ? 'sm:col-span-2' : ''}>
                          <div className="gi-small mb-1" style={{ color: z.color, opacity: 0.5, fontSize: '0.55rem' }}>{item.label}</div>
                          <div className="gi-body leading-relaxed" style={{ color: PARCHMENT, opacity: 0.78, fontSize: '0.95rem' }}>{item.val}</div>
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
        <div className="gi-small text-center mb-6" style={{ color: GOLD, opacity: 0.4 }}>Sound Design Notes</div>
        <div className="space-y-3">
          {SOUND_DESIGN_NOTES.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex gap-5 p-5" style={{ background: `${GOLD}05`, border: `1px solid ${BORDER}` }}>
              <span className="gi-title flex-shrink-0 pt-1" style={{ color: GOLD, opacity: 0.3, fontSize: '1rem' }}>♪</span>
              <div>
                <div className="gi-title mb-2" style={{ color: GOLD, fontSize: '0.95rem', letterSpacing: '0.05em' }}>{s.label}</div>
                <div className="gi-body leading-relaxed" style={{ color: PARCHMENT, opacity: 0.72, fontSize: '0.98rem' }}>{s.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// IX — HISTORICAL RECORD
// Interactive research / lore panel. 14 entries across 5 categories.
// Styled as a library catalogue / production bible research section.
// ─────────────────────────────────────────────────────────────

type HistoryCat = 'Akan History' | 'Spiritual Tradition' | 'Slave Trade' | 'New World Diaspora' | 'Accuracy Charter';

const HISTORY_ENTRIES: { id: string; category: HistoryCat; title: string; era?: string; content: string }[] = [
  { id:'h1', category:'Akan History', era:'1700s', title:'The Ashanti Confederacy', content:"The Ashanti Confederacy (Asanteman) was established in the late 17th century and became one of the most powerful states in West Africa, reaching its peak in the 18th–19th centuries. Founded by Osei Tutu I with the spiritual authority of the Okyeame (linguist) Okomfo Anokye, it was organized around the Golden Stool (Sika Dwa), the spiritual seat of Ashanti nationhood. The Confederacy was militarily sophisticated, economically powerful, and politically complex — not a static 'tribal' society but a dynamic state navigating relationships with European traders, rival kingdoms, and internal factions simultaneously. This complexity must be present in the game." },
  { id:'h2', category:'Akan History', era:'1700s', title:'The Slave Trade — Ashanti Involvement', content:"The history of the slave trade in the Gold Coast is not simple. The Ashanti Confederacy was both a victim and, at points, a participant — selling war captives and enemies to European traders in exchange for firearms that maintained their own power. This complexity is essential to the game's honesty. Commander Osei's betrayal operates within this real historical context: selling one's own people was not unheard of, and the moral weight of it was understood at the time. The game must not simplify this into a story of pure African victimhood and pure European evil — the complicity is part of the horror." },
  { id:'h3', category:'Akan History', era:'1700s', title:'Gold Coast Architecture', content:"Gold Coast villages of Kofi's era would have been built around compound houses (odan) — clusters of rectangular rooms around a central courtyard, typically with packed mud walls and thatch or early corrugated iron roofs. The forge was a significant social space. Ceremony grounds were communal. Coastal forts — built by Dutch, Portuguese, British, and Danish interests — were substantial stone structures, some of which still stand: Elmina Castle and Cape Coast Castle are the most significant. These are real places. The game should treat them with the gravity their history demands." },
  { id:'h4', category:'Spiritual Tradition', title:'Akan Ancestral Veneration', content:"In Akan spiritual tradition, the dead (nsamanfo) do not disappear — they become ancestors who maintain connection with the living. Ancestors are consulted, appeased, and called upon for guidance and protection. The relationship is reciprocal: the living maintain the ancestors through libation and ritual; the ancestors protect and guide the living. Kofi's ability to hear his ancestors as instinct is a heightened version of a real spiritual belief, not a fantasy invention. This grounding is important — the power must feel earned by its cultural roots, not borrowed for spectacle." },
  { id:'h5', category:'Spiritual Tradition', title:'The Sunsum — Soul and Power', content:"The sunsum is the Akan concept of the individual soul/spirit — the animating force of a person's character and capability. It is distinct from the okra (the divine spark, the life force given by God) and the mogya (blood, matrilineal inheritance). When Kofi transfers his power to Abena, it is most accurately understood as a transfer of sunsum — his accumulated warrior spirit, shaped by all the ancestors who answered him, passing into his daughter. This is not a magical invention; it is a spiritually coherent act within Akan belief. The death scene should reflect this theology." },
  { id:'h6', category:'Spiritual Tradition', title:'Adinkra Symbols as Design Language', content:"Adinkra symbols are visual symbols representing concepts or aphorisms used in Akan culture. They appear on textiles, ceramics, and architecture. Key symbols for the game: Gye Nyame (except God — omnipotence), Sankofa (learn from the past — a bird looking backward), Dwennimmen (strength and humility — ram's horns), Nyame Dua (altar of God — protection). These symbols should appear in the environment design, UI elements, and Kofi's visual identity. They are not decoration — each one is a statement about the values the game is built on." },
  { id:'h7', category:'Slave Trade', title:'How the Trade Operated', content:"Enslaved people were typically moved in coffle — groups chained or roped together — from interior regions to the coast over journeys of weeks or months. The coastal forts held captured people in dungeons (sometimes called 'the door of no return') before transfer to ships. The Middle Passage — the Atlantic crossing — lasted 6–8 weeks under conditions of extreme cruelty and deprivation. Mortality rates were high. This history must be handled with complete gravity. The ship level in Part One cannot be a typical game 'dungeon'. It must feel like what it was." },
  { id:'h8', category:'Slave Trade', title:'The Door of No Return', content:"Cape Coast Castle and Elmina Castle in present-day Ghana both contain actual 'doors of no return' — doors through which enslaved people passed directly to waiting ships. These have become sites of pilgrimage and memorial. The fort level in Part One should engage with this history directly, not abstractly. Kofi's infiltration of the fort is not an adventure — it is a rescue operation through a site of industrial evil. The architecture communicates this. The player should not feel heroic in that space. They should feel the weight of it." },
  { id:'h9', category:'New World Diaspora', title:'African Diaspora in the Caribbean and Americas', content:"Enslaved Africans brought to the Americas and Caribbean did not lose their cultures — they transformed them. Akan spiritual traditions, music, language fragments, social structures, and medicinal knowledge survived in new forms. Obeah (Caribbean), Candomblé (Brazil), and various Vodou traditions all contain African spiritual elements. Akosua's herbalism and ritual knowledge would have been adapted, not abandoned, in Part Two's setting. The Hartfield family's missionary concern about Abena's powers is a concern about something that is, in fact, real — and that has roots in resistance." },
  { id:'h10', category:'New World Diaspora', title:'Missionary Culture in Colonial Settings', content:"European missionaries in the colonial Americas genuinely believed in their work. The Hartfield family should not be villains — they should be people whose faith is real, whose love for Abena is real, and whose blindness is also real. The harm they can do is not the harm of evil people; it is the harm of good people operating within an evil system without seeing it clearly. This is harder to write than a villain. It is also more honest, and more interesting." },
  { id:'h11', category:'New World Diaspora', title:'Abena\'s Double Inheritance', content:"Abena inherits two things from her father: the ancestral power of the Asante line, and the experience of survival in a world designed to erase her. In the New World, these two inheritances combine. The ancestral power gives her spiritual agency. The survival experience gives her political intelligence. Together they make her not just a warrior but a founder — someone whose actions will outlast the colonial era she was born into. Part Two should make both inheritances visible." },
  { id:'h12', category:'Accuracy Charter', title:'Cultural Consultant Requirement', content:"Gold & Iron engages with two of the most morally significant periods in African and Atlantic history: the height of the slave trade, and the survival and resistance of the African diaspora. This cannot be approached without direct collaboration with historians and cultural practitioners who carry these histories. Required consultation: Akan history and spiritual tradition (at least one Ghanaian cultural historian), Atlantic slave trade historiography, Caribbean and American African diaspora culture, and a review of all dialogue before any localization begins. This is non-negotiable and must be budgeted for from the start." },
  { id:'h13', category:'Accuracy Charter', title:'Creative Liberties Log', content:"Where the game departs from historical record for story purposes, this must be documented transparently. The game is historical fiction, not historical simulation — but the departures should be intentional and acknowledged. Kofi's ancestral power is the clearest departure: the spiritual belief system is real; the specific power manifestation is fictional. The emotional logic of the departure should always be defensible in terms of the game's thematic intent. Every creative liberty is a decision that should be made consciously, not by default." },
  { id:'h14', category:'Accuracy Charter', title:'Research Reference List', content:"Key resources for the development team: (1) 'The Akan Peoples of Ghana' — foundational cultural and historical reference. (2) Osei Kwame's historiography of the Ashanti Confederacy. (3) Marcus Rediker, 'The Slave Ship: A Human History' — for the ship sequence. (4) Stephanie Smallwood, 'Saltwater Slavery' — for the Atlantic crossing experience. (5) Saidiya Hartman, 'Lose Your Mother' — for the emotional and cultural weight of this history. (6) Robert Farris Thompson, 'Flash of the Spirit' — for African cultural continuity in the diaspora. This list will expand significantly during production." },
];

const HistoricalRecord: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<HistoryCat | 'all'>('all');
  const [activeEntry, setActiveEntry] = useState<string | null>(null);

  const categories: (HistoryCat | 'all')[] = ['all', 'Akan History', 'Spiritual Tradition', 'Slave Trade', 'New World Diaspora', 'Accuracy Charter'];
  const filtered = HISTORY_ENTRIES.filter(e => activeCategory === 'all' || e.category === activeCategory);
  const entry = HISTORY_ENTRIES.find(e => e.id === activeEntry);

  const catColors: Record<string, string> = {
    'Akan History': GOLD, 'Spiritual Tradition': SPIRIT, 'Slave Trade': BLOOD,
    'New World Diaspora': HOLY, 'Accuracy Charter': IRON,
  };

  return (
    <div>
      <PullQuote
        text="To tell this story well, we must first understand it truly. History is not a backdrop. It is the foundation."
        attribution="Research Commitment · Gold & Iron"
        color={GOLD}
      />

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(c => {
          const color = c === 'all' ? GOLD : catColors[c];
          return (
            <button key={c} onClick={() => { setActiveCategory(c); setActiveEntry(null); }}
              className="gi-seal transition-all duration-200"
              style={{ fontSize: '0.52rem', color: activeCategory === c ? BG : color, background: activeCategory === c ? color : `${color}10`, borderColor: `${color}55` }}>
              {c === 'all' ? 'All Records' : c}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Entry list */}
        <div className="md:col-span-2 space-y-1">
          {filtered.map(e => {
            const color = catColors[e.category];
            return (
              <button key={e.id} onClick={() => setActiveEntry(activeEntry === e.id ? null : e.id)}
                className="w-full text-left p-3 transition-all"
                style={{ background: activeEntry === e.id ? `${color}0c` : 'transparent', border: `1px solid ${activeEntry === e.id ? `${color}25` : 'transparent'}`, borderLeft: `2px solid ${activeEntry === e.id ? color : `${color}30`}` }}>
                <div className="gi-small mb-0.5" style={{ color, opacity: 0.5, fontSize: '0.5rem' }}>{e.category}{e.era ? ` · ${e.era}` : ''}</div>
                <div className="gi-title" style={{ color: PARCHMENT, fontSize: '0.9rem', opacity: activeEntry === e.id ? 1 : 0.72 }}>{e.title}</div>
              </button>
            );
          })}
        </div>

        {/* Entry content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {entry ? (
              <motion.div key={entry.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="p-6 relative" style={{ background: `${catColors[entry.category]}06`, border: `1px solid ${catColors[entry.category]}25`, minHeight: 320 }}>
                {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-2 h-2`} style={{ border: `1px solid ${catColors[entry.category]}35`, transform: 'translate(-1px,-1px)' }}/>
                ))}
                <div className="gi-small mb-1" style={{ color: catColors[entry.category], opacity: 0.5 }}>{entry.category}{entry.era ? ` · ${entry.era}` : ''}</div>
                <h3 className="gi-title-display mb-5" style={{ color: catColors[entry.category], fontSize: '1.3rem', letterSpacing: '0.03em', lineHeight: 1.2 }}>{entry.title}</h3>
                <p className="gi-body leading-relaxed" style={{ color: PARCHMENT, opacity: 0.82, fontSize: '1rem', lineHeight: 1.9 }}>{entry.content}</p>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
                className="flex flex-col items-center justify-center gap-3" style={{ border: `1px solid ${BORDER}`, minHeight: 320 }}>
                <svg width={24} height={24} viewBox="0 0 24 24">
                  <polygon points="12,2 14,9 22,9 16,14 18,21 12,16 6,21 8,14 2,9 10,9" fill={GOLD} opacity={0.3}/>
                </svg>
                <div className="gi-small text-center" style={{ color: GOLD, opacity: 0.5 }}>Select a Record<br/><span style={{ fontSize: '0.5rem', opacity: 0.6 }}>to read the historical notes</span></div>
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
const GoldAndIronPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePart, setActivePart] = useState(1);

  return (
    <div className="gi-bg-warm" style={{ background: BG, minHeight: '100vh', position: 'relative' }}>
      <style>{FONTS + BASE_CSS}</style>

      {/* ── BACK NAV ── */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '1rem 1.5rem' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/games')}
            className="flex items-center gap-2" style={{ color: GOLD, opacity: 0.4 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}>
            <ArrowLeft size={12} />
            <span className="gi-small">Return to the Index</span>
          </motion.button>
          <div className="gi-small" style={{ color: PARCHMENT, opacity: 0.2 }}>Codex III of III</div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden px-6 pt-16 pb-20"
        style={{ background: `radial-gradient(ellipse 100% 80% at 50% 120%,${GOLD}0a,transparent 55%),${BG}` }}>
        <div className="absolute right-0 top-0 gi-title-display select-none pointer-events-none leading-none"
          style={{ fontSize: 'clamp(12rem,35vw,26rem)', color: `${GOLD}04`, right: '-0.05em', top: '-0.1em' }}>III</div>

        {/* Top kente bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <svg width="100%" height={20} viewBox="0 0 800 20" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 40 }).map((_, i) => (
              <g key={i} transform={`translate(${i * 20}, 0)`}>
                <rect x={0} y={8} width={8} height={4} fill={GOLD} opacity={0.15}/>
                <rect x={10} y={6} width={4} height={8} fill={GOLD} opacity={0.25}/>
                {i % 3 === 0 && <polygon points="0,10 4,6 8,10 4,14" fill={GOLD} opacity={0.2}/>}
              </g>
            ))}
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="gi-small mb-6" style={{ color: GOLD, opacity: 0.45 }}>Historical · Action · Mythology · A Three-Part Saga</div>
            <h1 className="gi-title-display leading-none mb-2" style={{ color: GOLD, fontSize: 'clamp(4rem,14vw,9rem)', letterSpacing: '0.04em' }}>Gold &</h1>
            <h1 className="gi-title-display leading-none mb-6" style={{ color: GOLD, fontSize: 'clamp(4rem,14vw,9rem)', letterSpacing: '0.04em' }}>Iron</h1>
            <div className="gi-small mb-8" style={{ color: PARCHMENT, opacity: 0.35 }}>COLONIAL GOLD COAST · 1700s–1800s · GAME 03 OF 03</div>
            <div className="max-w-2xl mx-auto gi-body italic" style={{ color: PARCHMENT, fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.8 }}>
              He was a warrior betrayed before the fight began. A husband and father taken in chains. He broke free — not to survive, but to burn a path back to everyone he loved. And when he died, he made sure the fire didn't go out.
            </div>
            <div className="mt-10 flex items-center justify-center gap-3">
              <div className="h-[1px] w-24" style={{ background: `${GOLD}30` }}/>
              <svg width={24} height={24} viewBox="0 0 24 24">
                <polygon points="12,2 14,9 22,9 16,14 18,21 12,16 6,21 8,14 2,9 10,9" fill={GOLD} opacity={0.4}/>
              </svg>
              <div className="h-[1px] w-24" style={{ background: `${GOLD}30` }}/>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">

        {/* ── I. THE RECORD ── */}
        <CodexSection roman="Chapter the First" title="The Record">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {[
              { label:'Form', content:"2D Historical Action Adventure / Beat 'em up with RPG progression — three-part saga structure spanning generations." },
              { label:'Tone', content:'Epic and tragic. Grounded in real history but elevated by ancestral magic. Visceral, proud, and deeply human.' },
              { label:'Historical Setting', content:'Gold Coast, approx. 1700–1800s. Ashanti Confederacy, European trading posts, inter-tribal warfare, slave trade routes, coastal forts.' },
              { label:'Visual Language', content:'Rich earth tones — ochre, deep green, terracotta, dark ebony. Kente patterns as UI motifs. Colonial white contrasted against ancestral gold.' },
            ].map(item => <CodexCard key={item.label} label={item.label} content={item.content}/>)}
          </div>
        </CodexSection>

        {/* ── II. THE CHRONICLE ── */}
        <CodexSection roman="Chapter the Second" title="The Chronicle">
          <PartToggle active={activePart} onSelect={setActivePart} />
          <AnimatePresence mode="wait">
            {activePart === 1 && (
              <motion.div key="p1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                <PartSeal label="Part One — The Warrior" color={GOLD}/>
                <Chronicle>
                  <p style={{ marginBottom: '1.2rem' }}>Kofi Asante is a veteran warrior of his village — not a chief, not nobility, but deeply respected. His connection to his ancestors is unusual: he <em>hears</em> them. Not as visions but as instinct — a whisper that sharpens his aim, steadies his nerves before battle, and warns him of ambush.</p>
                  <p style={{ marginBottom: '1.2rem' }}>Commander Osei sells the village to a rival tribe. The raid happens mid-ceremony — a deliberate cultural desecration. Kofi is captured and enslaved. His power is completely suppressed until the moment he decides to <em>escape</em> rather than survive. The ancestors are not quiet. They are furious.</p>
                  <p>What follows is the chase — across forest, savanna, river, coast, and finally a slave ship. Kofi fights room by room to reach his family. He wins. He frees his people. The wounds are fatal. He does not hide this from himself. In his final moments, he places his hand on his daughter Abena's forehead. The light of his ancestors passes through him into her. She is eight years old.</p>
                </Chronicle>
                <PullQuote text="He does not die in failure. He dies in triumph — surrounded by freed people, the ship moving toward open sea. His death is not a tragedy. It is a transfer." attribution="Design Note · The Death Scene" color={GOLD}/>
              </motion.div>
            )}
            {activePart === 2 && (
              <motion.div key="p2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                <PartSeal label="Part Two — The Inheritance" color={SPIRIT}/>
                <Chronicle>
                  <p style={{ marginBottom: '1.2rem' }}>The ship reaches a colonial settlement in the Americas or Caribbean. Kofi's wife Akosua and daughter Abena — now a young woman — are taken in by the Hartfield missionary family. The relationship is genuine but complicated: kindness operating within a system of colonial paternalism, and a faith that sees Abena's ancestral power as something to be converted rather than understood.</p>
                  <p style={{ marginBottom: '1.2rem' }}>Two protagonists. <span style={{ color: SPIRIT, fontFamily: "'Cinzel', serif" }}>Abena</span> wields her father's ancestral gifts — evolved into something more spiritual than martial. She communes with dead ancestors in full visions, calls on natural forces, spirit-walks to perceive hidden truths. <span style={{ color: HOLY, fontFamily: "'Cinzel', serif" }}>Elias Hartfield</span>, son of the missionaries, wields holy magic — protection-oriented, light-based, devastating when righteous conviction is unambiguous.</p>
                  <p>Their powers are not opposed. They are complementary. Used together, ancestral and holy magic create effects neither can achieve alone. The game refuses to declare which power system is right. Both respond to love, sacrifice, and justice. The question is whether two people from different worlds can fight as one.</p>
                </Chronicle>
                <PullQuote text="Two faiths, two inheritances, one common enemy. The question is not which belief is true, but whether two people from different worlds can fight as one." attribution="Design Note · Thematic Core of Part Two" color={SPIRIT}/>
              </motion.div>
            )}
            {activePart === 3 && (
              <motion.div key="p3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                <PartSeal label="Part Three — The Seed [In Development]" color={HOLY}/>
                <Chronicle>
                  <p style={{ marginBottom: '1.2rem' }}>Part Three is the most open direction. Two paths are under consideration.</p>
                  <p style={{ marginBottom: '1.2rem' }}><span style={{ color: HOLY, fontFamily: "'Cinzel', serif" }}>Option A — Next Generation:</span> A time jump to Abena's own child, who inherits a now-evolved power blending both ancestral and holy lineages into something entirely new. The trilogy becomes a chronicle of a power-bearing bloodline across history — each generation carrying more than the last.</p>
                  <p style={{ marginBottom: '1.2rem' }}><span style={{ color: HOLY, fontFamily: "'Cinzel', serif" }}>Option B — The Empire:</span> Abena and Elias, older and battle-forged, move into the heart of the colonial power structure that began everything in Part One. A reckoning that closes the loop on Kofi's death.</p>
                  <p>Regardless of path, the trilogy ends not in victory over a single enemy, but in the founding of something — a free settlement, a cultural tradition, a line of power-bearers — that outlasts the colonial era. The final image echoes the opening of Part One: a village, peaceful, unbroken.</p>
                </Chronicle>
              </motion.div>
            )}
          </AnimatePresence>
        </CodexSection>

        {/* ── III. THE ROSTER ── */}
        <CodexSection roman="Chapter the Third" title="The Roster of Warriors">

          <div className="gi-small text-center mb-8" style={{ color: GOLD, opacity: 0.35 }}>Part One</div>

          <WarriorEntry name="Kofi Asante" title="Village Warrior · Husband · Father · Ancestral Power Bearer" allegiance="Protagonist — Part One" accentColor={GOLD}
            epitaphs={['Hears his ancestors as instinct, not visions','Fights with traditional weapons — spear, akrafena, bow','Power fully awakens only after betrayal and captivity','Colonial weapons weaken his ancestral connection — a deliberate cost']}
            description="A veteran warrior respected for ability, not rank. His power is a gift he didn't ask for and never fully understood — until everything was taken from him. He fights not from rage but from love, and that distinction shapes every choice the player makes through him."
            arc="Respected warrior → Captive → Escaped → Relentless pursuer → Sacrificial father. His fire does not die with him."/>

          <WarriorEntry name="Akosua Asante" title="Herbalist · Survivor · Elder · Living Bridge" allegiance="Supporting — Parts One & Two" accentColor={GOLD}
            epitaphs={['Carries traditional knowledge — herbalism, oral history, spiritual ritual','Fuels Abena\'s upgrade paths in Part Two','Her survival has mechanical stakes, not just emotional ones','Losing her permanently locks some of Abena\'s abilities']}
            description="Not a combat character — a living bridge between the old world and the new. Her knowledge is the inheritance Kofi couldn't carry. She is the reason Abena can fully hear the ancestors. As long as Akosua lives, the line holds."
            arc="Captive survivor → Reluctant settler → Cultural anchor → Mentor whose loss is irreversible"/>

          <WarriorEntry name="Commander Osei" title="Ashanti Commander · Traitor · Inciting Force" allegiance="Antagonist — Part One" accentColor={BLOOD}
            epitaphs={['Sells the village to rival tribe — the inciting act of the entire saga','His justification is real even if his choice is unforgivable','Represents complicity within the slave trade, not only European evil','May reappear in Part Two or Three — decision pending']}
            description="The man who sells Kofi's village. Not a cartoon villain — a person who made a calculated decision within a real historical system where such decisions were made. He wanted firearms, territory, protection from a rival confederation. He got them. The moral weight of this must be present without exculpation. He is Akan. That is part of the horror."
            arc="Commander → Traitor → Haunting question: what does Kofi do if he finds him?"/>

          <WarriorEntry name="The Colonial Commander" title="Ship Commander · Final Boss · The System Made Personal" allegiance="Antagonist — Part One (Final)" accentColor={IRON}
            epitaphs={['He is doing his job — which is what makes him essential to defeat','Represents institutional evil, not personal malice','The fight with him is necessary even though he is not monstrous','His death does not end the system. Kofi knows this.']}
            description="The final boss of Part One. He does not enjoy cruelty — he performs a function within a system that requires it. He is more frightening than a sadist because he is ordinary. Defeating him is morally necessary and morally insufficient. Kofi wins this fight and dies knowing the ship he stood on was one of hundreds."
            arc="Anonymous functionary → Named enemy → Embodiment of a system that outlives him"/>

          <div className="gi-small text-center mb-8 mt-12" style={{ color: SPIRIT, opacity: 0.35 }}>Part Two</div>

          <WarriorEntry name="Abena Asante" title="Kofi's Daughter · Ancestral Power Bearer · Co-Protagonist" allegiance="Protagonist — Part Two" accentColor={SPIRIT}
            epitaphs={['Communes with dead ancestors in full visions','Calls on natural forces — storms, animals, earth','Spirit-walks to perceive hidden truths in the environment','Combat style: evasive and mystical — bends around attacks']}
            description="She wields her father's gifts but they manifest differently — more spiritual, less martial. She didn't choose this power; it was pressed into her forehead by a dying man she barely knew as a father. Learning to carry it is her arc. Learning to want it is her victory."
            arc="Child who received power she couldn't understand → Young woman learning to inhabit it → Warrior who chooses to keep the fire burning"/>

          <WarriorEntry name="Elias Hartfield" title="Son of Missionaries · Holy Power Bearer · Co-Protagonist" allegiance="Protagonist — Part Two" accentColor={HOLY}
            epitaphs={['Holy power responds to genuine conviction, not doctrine','Protection-oriented: shielding, light attacks, healing','Divine wrath activates only when the cause is unambiguous','Support character by nature — devastating in the right circumstances']}
            description="He doesn't experience religion as a set of rules — he experiences it as something alive that responds to love and sacrifice. His power makes him uncomfortable: it arrived uninvited and demands things he's not sure he can give. He and Abena understand each other for this reason."
            arc="Reluctant inheritor → Uneasy fighter → Someone who chooses the harder path"/>

          <WarriorEntry name="The Hartfield Parents" title="Missionaries · Abena's Guardians · The Blindness of Kindness" allegiance="Supporting — Part Two" accentColor={IRON}
            epitaphs={['Their faith is genuine — this must be legible to the player','Their blindness is genuine — this must also be legible','They love Abena and do not understand what they ask of her','They are not villains. They are people inside a system they can\'t fully see.']}
            description="The hardest characters in the game to write. They are genuinely good people. They genuinely care for Abena and Akosua. They are also, without understanding it, asking Abena to be a version of herself that serves their worldview rather than her own. The complexity is the point. The game should not let the player hate them simply."
            arc="Rescuers → Guardians → People whose love is real and whose limits are real → Characters who must be left behind for Abena to become fully herself"/>

        </CodexSection>

        {/* ── IV. THE ARTS OF WAR ── */}
        <CodexSection roman="Chapter the Fourth" title="The Arts of War">

          <div className="gi-small text-center mb-6" style={{ color: GOLD, opacity: 0.35 }}>Part One — Kofi</div>

          {[
            { art: 'The Ancestral Rage', description: "Power builds through combat. At full capacity, Kofi enters an Ancestral State — spirit-light surrounds him, movements become fluid. Different ancestor-granted techniques unlock as the saga progresses: a bone-shattering slam from a warrior ancestor (Nana Kofi — the great-grandfather, died defending the village in an earlier generation), a hunter's precision trapping ability (Afua — a grandmother, the family's greatest tactician), a healer's brief invincibility (Kweku — an infant who died before he lived, the smallest and most fierce). Each ancestor has a distinct visual and audio signature." },
            { art: 'Weapon Mastery & The Price of Iron', description: "Traditional weapons — spear, akrafena sword, bow, shields — each with unique combo trees developed through the upgrade system. Colonizer weapons (muskets, iron blades) can be taken and used but degrade quickly. Using them too much weakens Kofi's ancestral connection — the HUD desaturates slightly, the ancestor chorus dims. A deliberate mechanical metaphor: the tools of the oppressor cost something, and the cost is paid in what makes Kofi who he is." },
            { art: 'The Enemy Diverse', description: "Three distinct enemy types requiring different responses. Rival tribesmen: fast, coordinated, use the same weapons Kofi uses — tests skill, not strategy. Wildlife: unpredictable zone hazards, some hostile, some neutral until triggered — tests environmental awareness. Colonial soldiers: armored, firearms, formation-based — requires patience, cover, and disruption before engagement. No single combat approach works for all three. The caravan uses all three as layered protection." },
            { art: 'The Caravan Chase', description: "The structural spine of Part One — following the slave caravan across terrain zones. Each zone introduces new enemy configurations and freed captives who provide intel, temporary aid, or permanent companions. The caravan is always moving. Kofi is always behind, always catching up. The pacing communicates his urgency in every mechanic: resources are scarce, time passes, each delay has a cost." },
            { art: 'Boss Design — Four Confrontations', description: "Act I end: the rival tribal commander — tests basic mastery of Kofi's core moveset. Act II mid: a territorial lion on the savanna — not an enemy but a guardian; the encounter ends in alliance, not death, if the player reads it correctly. Act II end: optional confrontation with Commander Osei — a moral choice. Killing him closes one story thread; letting him go opens another. Act III: the Colonial Commander on the ship — the most mechanically complex fight, designed to feel earned by everything that came before it." },
          ].map((m, i) => <ScrollEntry key={m.art} art={m.art} description={m.description} index={i}/>)}

          <KenteDivider color={SPIRIT}/>
          <div className="gi-small text-center mb-6" style={{ color: SPIRIT, opacity: 0.35 }}>Part Two — Abena & Elias</div>

          {[
            { art: 'The Dual Path', description: "Players switch between Abena and Elias at designated points — or in co-op, which is designed into the system from the start. Their powers synergize: ancestral and holy magic combine on enemies or environmental puzzles to create effects neither can achieve alone. A barrier that resists Abena's nature-forces dissolves when Elias holds it with holy light long enough for Abena to find its root.", color: SPIRIT },
            { art: 'The Spirit-Walk', description: "Abena's defining ability — she steps partially into the ancestral plane and perceives what is hidden from the living. In spirit-walk: the world desaturates, ancestor residue is visible on objects and places, enemy weak points glow, environmental solutions become apparent. It is real-time, costs a spiritual resource that depletes and regenerates through combat and rest. She cannot interact with physical objects while walking — she can only see. The intelligence must be applied when she returns.", color: SPIRIT },
            { art: 'The Cultural Tension System', description: "Decisions affect how colonial NPC factions perceive each character. Colonial settlers fear Abena's powers; they revere Elias's. This creates tactical narrative choices — who leads the approach, whose power is appropriate in a given context. The game never resolves this tension cleanly. By the end of Part Two, the player should understand that Abena's powers are not accepted; they are tolerated when useful. That difference matters.", color: SPIRIT },
            { art: "Akosua's Living Knowledge", description: "Kofi's wife is a non-combat mentor whose traditional knowledge — herbalism, oral history, ritual — powers Abena's upgrade paths. Her survival is mechanically significant: losing her permanently closes upgrade branches that cannot be recovered. This means protecting her is a gameplay priority with real consequences, not just emotional ones. The player who loses Akosua will feel it in their capability for the rest of Part Two.", color: SPIRIT },
            { art: 'The Combined Power — A Third Thing', description: "When Abena and Elias use their powers in sync, the visual and audio language shifts: neither gold nor violet but something that has no name yet. The combined power defeats enemies neither could affect alone and solves puzzles neither could read. Mechanically: certain enemy types are invulnerable to solo power and require the combined state. The game uses this sparingly so it retains weight when it appears. The first time it works fully should feel like a revelation.", color: HOLY },
          ].map((m, i) => <ScrollEntry key={m.art} art={m.art} description={m.description} index={i} color={m.color}/>)}

        </CodexSection>

        {/* ── V. THE CAMPAIGN ── */}
        <CodexSection roman="Chapter the Fifth" title="The Campaign Record">

          <div className="gi-small text-center mb-6" style={{ color: GOLD, opacity: 0.35 }}>Part One</div>
          <BattleRecord phase="I" title="The Betrayal" theatre="The Village" accentColor={GOLD}
            description="Commander Osei sells the village. The raid happens mid-ceremony — a deliberate cultural desecration. Kofi is captured, witnesses atrocities, is brought to a coastal fort. His power is completely suppressed until the moment he decides to escape rather than merely endure. The tutorial is his reawakening."/>
          <BattleRecord phase="II" title="The Chase" theatre="Forest · Savanna · Coast" accentColor={GOLD}
            description="Kofi escapes and begins tracking the caravan across terrain zones. Each zone has a dominant enemy type, wildlife hazards, and freed villagers who join the cause. His ancestral power grows with each confrontation as different ancestors answer his need. The caravan is always ahead. The optional Osei confrontation happens here."/>
          <BattleRecord phase="III" title="The Ship" theatre="Open Sea · Slave Ship Interior" accentColor={GOLD}
            description="The climax. A slave ship level — claustrophobic, morally harrowing, room by room. Kofi fights toward his family on the deck. Final boss: the colonial commander. The fight is brutal and necessary. Kofi wins. The ship is freed. He does not survive his wounds. He knew he wouldn't. The power transfers. The saga continues."/>

          <KenteDivider color={SPIRIT}/>
          <div className="gi-small text-center mb-6" style={{ color: SPIRIT, opacity: 0.35 }}>Part Two</div>
          <BattleRecord phase="I" title="New Land" theatre="Colonial Settlement — The Harbour" accentColor={SPIRIT}
            description="Arrival. Akosua and Abena taken in by the Hartfields. Years pass. Abena and Elias are young adults. A new threat emerges — something that neither ancestral nor holy powers can address alone. They must learn to fight together before they understand why their powers are complementary."/>
          <BattleRecord phase="II" title="The Coalition" theatre="Settlement Interior · First Contact with Wilderness" accentColor={SPIRIT}
            description="Abena and Elias navigate colonial society, spiritual threats, and their own complicated bond. Akosua's knowledge tree opens. The antagonist's true nature is revealed — something that predates both African and Christian power systems. The Cultural Tension system reaches its most complex expression."/>
          <BattleRecord phase="III" title="The Reckoning" theatre="The Reckoning Place" accentColor={SPIRIT}
            description="Abena and Elias face the final threat together. The combined power achieves its full expression for the first time. The ending plants the seed of Part Three — whatever form that takes. The final image: something built, something that will last. An echo of the village from Part One's opening."/>

        </CodexSection>

        {/* ── VI. THE MAPS ── */}
        <CodexSection roman="Chapter the Sixth" title="The Maps">
          <div className="gi-small text-center mb-6" style={{ color: GOLD, opacity: 0.35 }}>Click a zone marker to read its field entry ◆</div>
          <WorldMaps/>
        </CodexSection>

        {/* ── VII. THE VISUAL DOCTRINE ── */}
        <CodexSection roman="Chapter the Seventh" title="The Visual Doctrine">
          <ArtDoctrine/>
        </CodexSection>

        {/* ── VIII. THE SOUND OF THE SAGA ── */}
        <CodexSection roman="Chapter the Eighth" title="The Sound of the Saga">
          <SoundOfTheSaga/>
        </CodexSection>

        {/* ── IX. THE HISTORICAL RECORD ── */}
        <CodexSection roman="Chapter the Ninth" title="The Historical Record">
          <HistoricalRecord/>
        </CodexSection>

      </div>

      {/* ── FOOTER ── */}
      <KenteDivider/>
      <div className="text-center pb-16 px-6">
        <svg width={32} height={32} viewBox="0 0 32 32" className="mx-auto mb-4">
          <polygon points="16,2 18,11 28,11 20,17 23,27 16,21 9,27 12,17 4,11 14,11" fill={GOLD} opacity={0.25}/>
        </svg>
        <div className="gi-small" style={{ color: PARCHMENT, opacity: 0.2 }}>
          Gold & Iron · Design Bible · Codex III · All Nine Chapters Complete
        </div>
      </div>
    </div>
  );
};

export default GoldAndIronPage;