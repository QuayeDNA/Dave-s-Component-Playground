import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ACCENT = '#7eb8e8';
const A10 = `${ACCENT}1a`;
const A20 = `${ACCENT}33`;
const A05 = `${ACCENT}0d`;
const VOID  = '#07101a';
const CHAOS = '#f0a8c8';
const TEXT  = '#f5f0e8';

// ─── STYLES ────────────────────────────────────────────────
const IRREGULAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
  .irr-grid-bg {
    background-image:
      linear-gradient(rgba(126,184,232,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(126,184,232,0.022) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  @keyframes irr-cursor  { 0%,100%{opacity:1} 50%{opacity:0} }
  .irr-cursor::after { content:'_'; animation: irr-cursor 1.1s step-end infinite; }
  @keyframes irr-flicker { 0%,100%{opacity:1} 88%{opacity:1} 90%{opacity:0.5} 92%{opacity:1} 95%{opacity:0.72} 97%{opacity:1} }
  .irr-flicker { animation: irr-flicker 16s infinite; }
  .irr-glow:hover { box-shadow: 0 0 22px ${ACCENT}16, 0 0 44px ${ACCENT}08; }
  .irr-scroll-hide  { scrollbar-width: none; }
  .irr-scroll-hide::-webkit-scrollbar { display: none; }
`;

// ─── SECTION REGISTRY ─────────────────────────────────────
const SECTIONS = [
  { id: 'overview',   label: 'OVERVIEW',   num: '01' },
  { id: 'narrative',  label: 'NARRATIVE',  num: '02' },
  { id: 'world-map',  label: 'WORLD MAP',  num: '03' },
  { id: 'characters', label: 'CHARACTERS', num: '04' },
  { id: 'timeline',   label: 'TIMELINE',   num: '05' },
  { id: 'mechanics',  label: 'MECHANICS',  num: '06' },
  { id: 'acts',       label: 'ACT STRUCT', num: '07' },
  { id: 'art',        label: 'ART DIR',    num: '08' },
  { id: 'audio',      label: 'AUDIO',      num: '09' },
  { id: 'lore',       label: 'LORE',       num: '10' },
];

// ─── HOOKS ─────────────────────────────────────────────────
const useSectionObserver = () => {
  const [activeId, setActiveId] = useState('overview');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return activeId;
};

// ─────────────────────────────────────────────────────────────
// 1. INTERACTIVE WORLD MAP
// ─────────────────────────────────────────────────────────────
const ZONES = [
  {
    id: 'circle-plains',
    name: 'Circle Plains',
    shape: 'circle',
    ruler: 'The Circle Diplomat',
    status: 'Partially Corrupted',
    color: '#a8d8f0',
    x: 18, y: 55, size: 70,
    description: 'Vast rolling terrain of smooth loops and arcs. The first zone Hexa enters. Home to the Circle Diplomat whose trust must be earned before the Circle form is unlocked. Corruption zones appear as jagged cracks splitting smooth curves.',
    unlock: 'Circle Form — fast roll + tight tunnel access',
    enemies: 'Ripple Irregulars, Void Orbs',
    act: 'I',
  },
  {
    id: 'triangle-peaks',
    name: 'Triangle Peaks',
    shape: 'triangle',
    ruler: 'The Triangle General',
    status: 'Under Siege',
    color: '#f0b8a8',
    x: 62, y: 18, size: 60,
    description: "Vertical spike zones and razor ridges. The Triangle General views Hexa's shapeshifting as a threat to Triangle purity. Earning trust here requires proving worth through combat, not diplomacy.",
    unlock: 'Triangle Form — dash-attack + wall piercing',
    enemies: 'Spike Shards, Fracture Blades',
    act: 'II',
  },
  {
    id: 'square-citadel',
    name: 'Square Citadel',
    shape: 'square',
    ruler: 'The Square Architect',
    status: 'Locked Down',
    color: '#b8c8a8',
    x: 62, y: 60, size: 65,
    description: "A vast mechanical grid of pressure plates, weight puzzles, and interlocking chambers. The Square Architect has sealed the Citadel — getting inside requires demonstrating patience and precision Hexa hasn't needed before.",
    unlock: 'Square Form — anchor + weight puzzles',
    enemies: 'Grid Walkers, Pressure Wraiths',
    act: 'II',
  },
  {
    id: 'hexagon-archive',
    name: 'Hexagon Archive',
    shape: 'hexagon',
    ruler: 'The Hexagon Archivist',
    status: 'Information Blackout',
    color: '#c8b8f0',
    x: 20, y: 20, size: 58,
    description: "Hexa's homeland. Lore-heavy, terminal-driven — a vast library of geometric history. The Archivist knows more about the Irregular leader than anyone, but has gone into hiding. This zone reveals why the Irregular war truly began.",
    unlock: 'Hexagon Upgrade — extended NPC dialogue + archive terminals',
    enemies: 'Data Phantoms, Archive Keepers (corrupted)',
    act: 'II',
  },
  {
    id: 'void-core',
    name: 'The Void Core',
    shape: 'irregular',
    ruler: 'The Irregular Leader',
    status: 'Fully Corrupted',
    color: '#f0a8c8',
    x: 40, y: 40, size: 75,
    description: "The Irregular stronghold at the centre of Geometria — geometry has fully collapsed here. No shape rules apply. Platforms phase in and out. Enemies shift form mid-fight. Hexa must use all forms fluidly and begin using absorbed chaos-forms.",
    unlock: 'Chaos Forms — absorbed from defeated Irregular bosses',
    enemies: 'All types + The Irregular Leader (final boss)',
    act: 'III',
  },
];

// ─── DECORATIVE SHAPE OUTLINE (atmospheric, not interactive) ─
const GeomShape: React.FC<{ type: string; size: number; opacity?: number }> = ({ type, size, opacity = 0.07 }) => {
  const r = size / 2;
  if (type === 'hexagon') {
    const outer = Array.from({length:6}, (_,i) => { const a=(Math.PI/3)*i-Math.PI/6; return `${r+r*0.9*Math.cos(a)},${r+r*0.9*Math.sin(a)}`; }).join(' ');
    const inner = Array.from({length:6}, (_,i) => { const a=(Math.PI/3)*i-Math.PI/6; return `${r+r*0.6*Math.cos(a)},${r+r*0.6*Math.sin(a)}`; }).join(' ');
    return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:'visible'}}><polygon points={outer} fill="none" stroke={ACCENT} strokeWidth="1" opacity={opacity} /><polygon points={inner} fill="none" stroke={ACCENT} strokeWidth="0.5" opacity={opacity*0.5} strokeDasharray="2 3" /></svg>);
  }
  if (type === 'triangle') {
    return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><polygon points={`${r},${r*0.12} ${size-r*0.08},${size-r*0.12} ${r*0.08},${size-r*0.12}`} fill="none" stroke={ACCENT} strokeWidth="1" opacity={opacity} /></svg>);
  }
  if (type === 'square') {
    const p = size * 0.1;
    return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><rect x={p} y={p} width={size-p*2} height={size-p*2} fill="none" stroke={ACCENT} strokeWidth="1" opacity={opacity} /></svg>);
  }
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><circle cx={r} cy={r} r={r*0.88} fill="none" stroke={ACCENT} strokeWidth="1" opacity={opacity} /></svg>);
};

// ─── SECTION WRAPPER ──────────────────────────────────────
const IrrSection: React.FC<{ id: string; num: string; label: string; children: React.ReactNode }> = ({ id, num, label, children }) => (
  <section id={id} className="mb-28 scroll-mt-16">
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 mb-10">
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.52rem', color: ACCENT, opacity: 0.28, letterSpacing: '0.15em' }}>{num}</span>
        <span style={{ color: ACCENT, opacity: 0.2, fontFamily: '"Space Mono", monospace', fontSize: '0.6rem' }}>//──</span>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.58rem', color: ACCENT, opacity: 0.52, letterSpacing: '0.3em', textTransform: 'uppercase' }}>{label}</span>
        <div className="flex-1 h-[1px]" style={{ background: `${ACCENT}0e` }} />
        <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: ACCENT, opacity: 0.22 }} />
      </div>
      {children}
    </motion.div>
  </section>
);

// ─── STICKY SIDE NAV ──────────────────────────────────────
const StickyNav: React.FC<{ activeId: string }> = ({ activeId }) => (
  <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3.5">
    {SECTIONS.map(s => {
      const active = activeId === s.id;
      return (
        <motion.button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="flex items-center gap-2"
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <motion.div
            animate={{ width: active ? 20 : 8, opacity: active ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}
            style={{ height: 1, background: ACCENT, flexShrink: 0 }}
          />
          <motion.span
            animate={{ opacity: active ? 0.82 : 0.22 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.46rem', color: ACCENT, letterSpacing: '0.2em', whiteSpace: 'nowrap' }}
          >
            {active ? s.label : s.num}
          </motion.span>
        </motion.button>
      );
    })}
  </nav>
);

// ─── TODO PLACEHOLDER ─────────────────────────────────────
const TodoPlaceholder: React.FC<{ title: string; description: string; module: string; notes?: string[] }> = ({ title, description, module, notes = [] }) => (
  <div
    className="relative min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center text-center p-6 sm:p-10"
    style={{ background: A05, border: `1px dashed ${ACCENT}22` }}
  >
    <div
      className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-2.5"
      style={{ borderBottom: `1px solid ${ACCENT}10`, background: `${ACCENT}04` }}
    >
      <div className="w-2 h-2 rounded-full" style={{ background: '#f0b8a8', opacity: 0.5 }} />
      <div className="w-2 h-2 rounded-full" style={{ background: '#f0e898', opacity: 0.5 }} />
      <div className="w-2 h-2 rounded-full" style={{ background: '#a8e8c8', opacity: 0.5 }} />
      <span className="ml-2" style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.5rem', color: ACCENT, opacity: 0.32, letterSpacing: '0.15em' }}>{module}</span>
    </div>
    <motion.div
      className="mb-4 mt-6"
      animate={{ rotate: 360 }}
      transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
    >
      <svg width="62" height="62" viewBox="0 0 62 62" style={{ opacity: 0.11 }}>
        <polygon points="31,4 57,17.5 57,44.5 31,58 5,44.5 5,17.5" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="31,13 49,23 49,39 31,49 13,39 13,23" fill="none" stroke={ACCENT} strokeWidth="0.75" />
        <circle cx="31" cy="31" r="7" fill="none" stroke={ACCENT} strokeWidth="0.75" />
      </svg>
    </motion.div>
    <div className="mb-1" style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.52rem', color: ACCENT, opacity: 0.38, letterSpacing: '0.3em' }}>STATUS: PENDING</div>
    <h3 className="mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(1.2rem,3.5vw,1.65rem)', color: ACCENT, letterSpacing: '0.06em' }}>{title}</h3>
    <p className="max-w-sm" style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, opacity: 0.4, fontSize: '0.95rem', lineHeight: 1.74 }}>{description}</p>
    {notes.length > 0 && (
      <div className="text-left w-full max-w-sm mt-5 space-y-1.5">
        {notes.map((note, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span style={{ color: ACCENT, fontFamily: '"Space Mono", monospace', fontSize: '0.48rem', opacity: 0.28, flexShrink: 0, paddingTop: '0.28rem' }}>// </span>
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.5rem', color: TEXT, opacity: 0.26, letterSpacing: '0.04em', lineHeight: 1.8 }}>{note}</span>
          </div>
        ))}
      </div>
    )}
    <div
      className="absolute bottom-3.5 right-4 flex items-center gap-1.5 px-2.5 py-1"
      style={{ background: `${CHAOS}12`, border: `1px solid ${CHAOS}28` }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: CHAOS }} />
      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.48rem', color: CHAOS, letterSpacing: '0.2em' }}>TODO</span>
    </div>
  </div>
);



// ─────────────────────────────────────────────────────────────
// 2. CHARACTER ROSTER VIEWER
// ─────────────────────────────────────────────────────────────
const CHARACTERS = [
  {
    id:'hexa', name:'HEXA', role:'Protagonist', type:'Hero',
    description:"A mid-tier Hexagon — not a warrior, not royalty. Hexa was a cartographer, mapping the edges of Geometria. Their power is empathy through transformation: studying and absorbing the geometry of other shapes to solve problems no single shape could handle.",
    traits:['Empathetic','Resourceful','Undefined','Determined'],
    powerType:'Form Shifting', arc:'Civilian → Multi-form survivor → Identity crisis → Chosen guardian',
    stats:{combat:40,mobility:75,puzzle:90,empathy:95}, shape:'hexagon', color:'#c8b8f0',
  },
  {
    id:'unnamed', name:'THE UNNAMED', role:'Primary Antagonist', type:'Antagonist',
    description:"Not a villain born from malice — a shape that was outcast and mutated over decades of rejection. They want the dissolution of geometric law entirely. Wrong in their methods, not wrong in their grievance.",
    traits:['Bitter','Visionary','Unpredictable','Tragic'],
    powerType:'Chaos Manipulation', arc:'Outcast shape → Mutation → Revolutionary → Mirror to Hexa',
    stats:{combat:95,mobility:85,puzzle:60,empathy:30}, shape:'irregular', color:'#f0a8c8',
  },
  {
    id:'orbis', name:'ORBIS', role:'Circle Diplomat · Zone Ruler', type:'Ally (earned)',
    description:"Smooth, adaptable, and politically cautious. Orbis is reluctant to commit the Circle civilization to any cause — they've survived by negotiation, not by picking sides.",
    traits:['Diplomatic','Cautious','Adaptable','Calculating'],
    powerType:'Sphere of Influence', arc:'Neutral → Skeptical ally → Committed council member',
    stats:{combat:30,mobility:80,puzzle:65,empathy:70}, shape:'circle', color:'#a8d8f0',
  },
  {
    id:'apex', name:'APEX', role:'Triangle General · Zone Ruler', type:'Ally (earned)',
    description:"Sharp, directional, and deeply suspicious of Hexa's shapeshifting. Apex sees it as deception — a shapeshifter has no loyalties. Once trust is earned through combat, Apex becomes the most valuable military ally.",
    traits:['Proud','Martial','Suspicious','Loyal once proven'],
    powerType:'Precision Strike', arc:'Hostile → Grudging respect → Fierce ally',
    stats:{combat:90,mobility:70,puzzle:40,empathy:45}, shape:'triangle', color:'#f0b8a8',
  },
  {
    id:'quad', name:'QUAD', role:'Square Architect · Zone Ruler', type:'Ally (earned)',
    description:"Methodical, patient, and entirely uninterested in anything that can't be measured. Once inside the sealed Citadel, Quad becomes scientifically fascinated by Hexa — a shape that shouldn't work, but does.",
    traits:['Analytical','Patient','Rigid','Quietly curious'],
    powerType:'Structural Engineering', arc:'Sealed away → Reluctant → Scientifically invested',
    stats:{combat:45,mobility:30,puzzle:95,empathy:55}, shape:'square', color:'#b8c8a8',
  },
];

const StatBar: React.FC<{label:string;value:number;color:string}> = ({label,value,color}) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span className="text-xs uppercase tracking-widest" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8',opacity:0.4}}>{label}</span>
      <span className="text-xs" style={{fontFamily:'"Space Mono",monospace',color,opacity:0.7}}>{value}</span>
    </div>
    <div className="h-[2px] w-full" style={{background:`${color}18`}}>
      <motion.div className="h-full" style={{background:color}} initial={{width:0}} animate={{width:`${value}%`}} transition={{duration:0.7,ease:'easeOut'}}/>
    </div>
  </div>
);

const CharacterRoster: React.FC = () => {
  const [active, setActive] = useState('hexa');
  const char = CHARACTERS.find(c=>c.id===active)!;
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {CHARACTERS.map(c=>(
          <button key={c.id} onClick={()=>setActive(c.id)}
            className="text-xs tracking-[0.18em] uppercase px-3 py-2 transition-all duration-200"
            style={{fontFamily:'"Space Mono",monospace',color:active===c.id?'#0a0f18':c.color,background:active===c.id?c.color:`${c.color}12`,border:`1px solid ${active===c.id?c.color:`${c.color}30`}`}}>
            {c.name.split(' ')[0]}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={char.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.3}}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6" style={{background:`${char.color}08`,border:`1px solid ${char.color}22`,borderLeft:`3px solid ${char.color}`}}>
            <div className="text-xs tracking-[0.25em] uppercase mb-1" style={{fontFamily:'"Space Mono",monospace',color:char.color,opacity:0.55}}>{char.type}</div>
            <h3 className="leading-none mb-1" style={{fontFamily:'"Bebas Neue",sans-serif',fontSize:'2.2rem',color:char.color,letterSpacing:'0.04em'}}>{char.name}</h3>
            <div className="text-xs mb-4 opacity-40" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8'}}>{char.role}</div>
            <p className="text-sm leading-relaxed mb-4" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.78,fontSize:'1rem'}}>{char.description}</p>
            <div className="flex flex-wrap gap-2">
              {char.traits.map(t=>(
                <span key={t} className="text-xs px-2 py-1" style={{fontFamily:'"Space Mono",monospace',color:char.color,background:`${char.color}14`,border:`1px solid ${char.color}25`}}>{t}</span>
              ))}
            </div>
          </div>
          <div className="p-6 flex flex-col gap-5" style={{background:A05,border:`1px solid ${A20}`}}>
            <div>
              <div className="text-xs tracking-[0.25em] uppercase mb-3" style={{fontFamily:'"Space Mono",monospace',color:ACCENT,opacity:0.5}}>Capability Profile</div>
              <StatBar label="Combat" value={char.stats.combat} color={char.color}/>
              <StatBar label="Mobility" value={char.stats.mobility} color={char.color}/>
              <StatBar label="Puzzle" value={char.stats.puzzle} color={char.color}/>
              <StatBar label="Empathy" value={char.stats.empathy} color={char.color}/>
            </div>
            <div>
              <div className="text-xs tracking-[0.25em] uppercase mb-1" style={{fontFamily:'"Space Mono",monospace',color:ACCENT,opacity:0.5}}>Power Type</div>
              <div className="text-sm mb-4" style={{fontFamily:'"Crimson Pro",serif',color:char.color,fontStyle:'italic'}}>{char.powerType}</div>
              <div className="text-xs tracking-[0.25em] uppercase mb-1" style={{fontFamily:'"Space Mono",monospace',color:ACCENT,opacity:0.5}}>Character Arc</div>
              <div className="text-sm leading-relaxed" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.72}}>{char.arc}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. STORY TIMELINE
// ─────────────────────────────────────────────────────────────
const TIMELINE_BEATS = [
  {act:'I',id:'tb1',label:'The Irregular Invasion',type:'event',description:"Without warning, Irregulars flood Geometria. Hexa's district is raided. Family taken. No warning. No negotiation."},
  {act:'I',id:'tb2',label:'Escape',type:'hexa',description:"Hexa escapes the raid — the only protection is instinct and the ability to run. No power yet. Just survival and grief."},
  {act:'I',id:'tb3',label:'Circle Plains',type:'zone',description:"Hexa reaches Circle Plains. Orbis and the Circle Council are in crisis. Hexa offers help in exchange for passage and trust."},
  {act:'I',id:'tb4',label:'Circle Form Unlocked',type:'power',description:"First transformation. The Circle form changes how the world works — tunnels, rolls, momentum. A new way of moving through Geometria."},
  {act:'II',id:'tb5',label:'Triangle Peaks',type:'zone',description:"Apex meets Hexa with hostility. A shapeshifter is no different from an Irregular to a Triangle. Combat is the only language that counts."},
  {act:'II',id:'tb6',label:'Truth Surfaces',type:'lore',description:"Fragments of the Irregular Leader's origin begin to emerge. They were once a shape — outcast. The mission becomes less simple."},
  {act:'II',id:'tb7',label:'Triangle + Square Forms',type:'power',description:"Two new ways of engaging the world. The puzzle language of Geometria begins to fully open up."},
  {act:'II',id:'tb8',label:'Hexagon Archive',type:'zone',description:"Hexa returns to their homeland — now corrupted. The Archivist reveals the Irregular Leader's full history."},
  {act:'II',id:'tb9',label:'First Rescue',type:'hexa',description:"One family member is found. Not a clean rescue — they are changed by what happened, and the reunion is complicated."},
  {act:'III',id:'tb10',label:'Void Core — Entry',type:'event',description:"Geometry fully collapses. None of Hexa's forms work cleanly here. The absorbed chaos-forms become essential."},
  {act:'III',id:'tb11',label:'Full Reunion',type:'hexa',description:"The remaining family members are found. Each rescue is its own emotional arc. Nothing is simple."},
  {act:'III',id:'tb12',label:'The Final Choice',type:'choice',description:"Destroy the Irregular Leader — restore geometric law. Absorb — integrate chaos into Geometria's future. Both endings are valid. Neither is clean."},
];

const BEAT_COLORS: Record<string,string> = {event:'#f0b8a8',hexa:'#c8b8f0',zone:'#7eb8e8',power:'#98e8c8',lore:'#e8d898',choice:'#f0c8a8'};
const BEAT_LABELS: Record<string,string> = {event:'World Event',hexa:'Hexa Moment',zone:'Zone Beat',power:'Power Unlock',lore:'Lore Reveal',choice:'Player Choice'};

const StoryTimeline: React.FC = () => {
  const [selected, setSelected] = useState<string|null>(null);
  const [filterAct, setFilterAct] = useState('all');
  const filtered = TIMELINE_BEATS.filter(b=>filterAct==='all'||b.act===filterAct);
  const beat = TIMELINE_BEATS.find(b=>b.id===selected);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {['all','I','II','III'].map(a=>(
          <button key={a} onClick={()=>setFilterAct(a)}
            className="text-xs tracking-[0.2em] uppercase px-3 py-1.5 transition-all"
            style={{fontFamily:'"Space Mono",monospace',color:filterAct===a?'#0a0f18':ACCENT,background:filterAct===a?ACCENT:A10,border:`1px solid ${filterAct===a?ACCENT:A20}`}}>
            {a==='all'?'All Acts':`Act ${a}`}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(BEAT_LABELS).map(([type,label])=>(
          <div key={type} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{background:BEAT_COLORS[type]}}/>
            <span className="text-xs opacity-35" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8'}}>{label}</span>
          </div>
        ))}
      </div>

      {/* Track */}
      <div className="relative mb-4">
        <div className="absolute left-0 right-0 top-3 h-[1px]" style={{background:A20}}/>
        <div className="flex gap-1 overflow-x-auto pb-4 relative" style={{scrollbarWidth:'none'}}>
          {filtered.map((b,i)=>(
            <motion.div key={b.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer" style={{width:54}}
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              onClick={()=>setSelected(selected===b.id?null:b.id)}>
              <motion.div className="w-6 h-6 rounded-full border-2 flex items-center justify-center relative z-10"
                style={{background:selected===b.id?BEAT_COLORS[b.type]:'#0a0f18',borderColor:BEAT_COLORS[b.type]}}
                whileHover={{scale:1.2}}>
                {selected===b.id&&<div className="w-2 h-2 rounded-full" style={{background:'#0a0f18'}}/>}
              </motion.div>
              <div className="mt-2 text-center leading-tight" style={{fontFamily:'"Space Mono",monospace',fontSize:'0.44rem',letterSpacing:'0.1em',color:BEAT_COLORS[b.type],opacity:selected&&selected!==b.id?0.3:0.7,maxWidth:54,wordBreak:'break-word'}}>
                {b.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {beat&&(
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            className="p-5" style={{background:`${BEAT_COLORS[beat.type]}0d`,border:`1px solid ${BEAT_COLORS[beat.type]}30`}}>
            <span className="text-xs px-2 py-1 inline-block mb-2" style={{fontFamily:'"Space Mono",monospace',fontSize:'0.6rem',letterSpacing:'0.2em',color:BEAT_COLORS[beat.type],background:`${BEAT_COLORS[beat.type]}18`,border:`1px solid ${BEAT_COLORS[beat.type]}30`}}>
              ACT {beat.act} · {BEAT_LABELS[beat.type].toUpperCase()}
            </span>
            <h4 className="mb-2" style={{fontFamily:'"Bebas Neue",sans-serif',fontSize:'1.4rem',color:BEAT_COLORS[beat.type],letterSpacing:'0.05em'}}>{beat.label}</h4>
            <p className="text-sm leading-relaxed" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.8,fontSize:'1rem'}}>{beat.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 4. ART DIRECTION
// ─────────────────────────────────────────────────────────────
const PALETTE = [
  {name:'Void Ink',hex:'#07101a',use:'Background / deepest shadow'},
  {name:'Hexa Blue',hex:'#7eb8e8',use:'UI accent / Hexa glow / terminals'},
  {name:'Circle Frost',hex:'#a8d8f0',use:'Circle Plains environment'},
  {name:'Triangle Ember',hex:'#f0b8a8',use:'Triangle Peaks / combat flash'},
  {name:'Square Sage',hex:'#b8c8a8',use:'Square Citadel / structural elements'},
  {name:'Archive Violet',hex:'#c8b8f0',use:'Hexagon Archive / lore terminals'},
  {name:'Chaos Pink',hex:'#f0a8c8',use:'Irregular zones / corruption visual'},
  {name:'Clean White',hex:'#f5f0e8',use:'Text / pure geometry highlights'},
];

const DESIGN_PRINCIPLES = [
  {title:'Geometry as Character',desc:'Every shape communicates personality through its form. Circles feel safe and mobile. Triangles feel aggressive. Squares feel immovable. Irregular entities feel genuinely wrong — asymmetric, twitchy, visually uncomfortable.'},
  {title:'Corruption as Gradation',desc:'Zones exist on a spectrum from pure to corrupted. Pure zones have clean lines, solid fills, mathematical precision. Corrupted zones break down gradually — edges fragment, fills become unstable, geometric rules start to slip.'},
  {title:"Hexa's Visual Identity",desc:"In base Hexagon form, Hexa is slightly more detailed than other shapes — a quiet visual marker of their role. Each absorbed form maintains a trace of Hexa's color as a thin outline glow."},
  {title:'Negative Space as Threat',desc:'The Void Core is designed through absence — shapes disappear, leaving only edges, then leaving nothing. The visual language of emptiness should feel genuinely unsettling, not just dark.'},
];

const ArtDirection: React.FC = () => {
  const [hovered, setHovered] = useState<string|null>(null);
  return (
    <div className="space-y-10">
      <div>
        <div className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50" style={{fontFamily:'"Space Mono",monospace',color:ACCENT}}>Color Palette</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PALETTE.map(p=>(
            <div key={p.hex} onMouseEnter={()=>setHovered(p.hex)} onMouseLeave={()=>setHovered(null)}>
              <motion.div className="w-full mb-2" style={{background:p.hex,border:p.hex==='#07101a'?'1px solid #ffffff18':'none'}}
                animate={{height:hovered===p.hex?72:56}} transition={{duration:0.2}}/>
              <div className="text-xs mb-0.5" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8',opacity:0.65}}>{p.name}</div>
              <div style={{fontFamily:'"Space Mono",monospace',fontSize:'0.52rem',color:'#f5f0e8',opacity:0.3}}>{p.hex}</div>
              <AnimatePresence>
                {hovered===p.hex&&(
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                    className="text-xs mt-1" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.6}}>
                    {p.use}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs tracking-[0.25em] uppercase mb-4 opacity-42" style={{fontFamily:'"Space Mono",monospace',color:ACCENT}}>// Shape Language System</div>
        <TodoPlaceholder
          title="GEOMETRIA — SHAPE LANGUAGE"
          description="Zone shape icons and the visual grammar of each shape-civilization pending finalization of Geometria's design language."
          module="shape-language.sys"
          notes={[
            'Circle  →  flowing / safe / diplomatic',
            'Triangle →  aggressive / directional / proud',
            'Square   →  methodical / immovable / precise',
            'Hexagon  →  archive / memory / protagonist',
            'Irregular →  chaos / trauma / distortion',
          ]}
        />
      </div>

      <div>
        <div className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50" style={{fontFamily:'"Space Mono",monospace',color:ACCENT}}>Design Principles</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DESIGN_PRINCIPLES.map((p,i)=>(
            <motion.div key={p.title} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
              className="p-4" style={{background:A05,border:`1px solid ${A20}`}}>
              <div className="mb-2 font-semibold" style={{fontFamily:'"Crimson Pro",serif',color:ACCENT,fontSize:'1rem'}}>{p.title}</div>
              <p className="text-sm leading-relaxed" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.72}}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* TODO: UI element sketches — HUD, form-shift radial menu, corruption meter */}
      {/* TODO: Animation direction — how do form transitions feel? */}
      {/* TODO: Reference mood board images */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 5. AUDIO & MUSIC DIRECTION
// ─────────────────────────────────────────────────────────────
const AUDIO_ZONES = [
  {zone:'Circle Plains',color:'#a8d8f0',instruments:'Sine waves, smooth pads, low hum',tempo:'Moderate — flowing, never rushed',mood:"Cautious hope. A world that was beautiful and is trying to remember it.",corrupted:"Clean tones develop static. Smooth curves of sound begin to clip at the edges.",reference:'Hollow Knight — Greenpath. Journey OST.'},
  {zone:'Triangle Peaks',color:'#f0b8a8',instruments:'Staccato strings, sharp percussive hits, brass stabs',tempo:'Fast — aggressive, directional',mood:'Tension and pride. Everything moves with intent. No soft edges.',corrupted:'The sharp hits become chaotic — they lose rhythm and begin to overlap and clash.',reference:'Metroid Dread — combat zones. Celeste — confrontation tracks.'},
  {zone:'Square Citadel',color:'#b8c8a8',instruments:'Mechanical clicks, low pulses, grid-synced beats',tempo:'Precise — every beat on the measure, never syncopated',mood:'Order. Pressure. The sound of a world trying to hold itself together.',corrupted:'The grid-synced beats fall out of time. Mechanical precision becomes chaos.',reference:'Portal 2 — puzzle chambers. SOMA — industrial ambient.'},
  {zone:'Hexagon Archive',color:'#c8b8f0',instruments:'Deep choir, resonant tones, sparse piano',tempo:'Slow — contemplative, vast',mood:"Memory and loss. This was home. It doesn't feel like home anymore.",corrupted:'The choir falls into dissonance. Memory becomes distortion.',reference:'Ico OST. Shadow of the Colossus — exploration themes.'},
  {zone:'The Void Core',color:'#f0a8c8',instruments:'Inverted samples, noise, fragments of all previous zone themes',tempo:'Unstable — the tempo itself shifts',mood:"Everything breaking down. Recognition becoming impossible. A final confrontation with formlessness.",corrupted:'This is the corrupted version. It begins corrupted and ends corrupted.',reference:'Nier: Automata — final route. Undertale — Hopes and Dreams.'},
];

const SOUND_DESIGN = [
  {label:'Hexa — Base Form',desc:"A soft harmonic hum that shifts pitch with movement speed. The 'voice' of the protagonist — always present, always subtle."},
  {label:'Form Shifting',desc:"Each transformation has a distinct signature. Circle: smooth resonant ring. Triangle: sharp metallic click. Square: low satisfying thud. Chaos forms: a broken, reversed version of a clean form."},
  {label:'Corruption Creep',desc:"As zones corrupt, the ambient layer gains a ghost track — a slightly detuned, slightly delayed echo of the clean zone music. The further into corruption, the louder the ghost."},
  {label:'Irregular Enemies',desc:"No enemy has a consistent audio pattern. Their sound design is procedurally distorted — the same base sounds, rearranged unpredictably each encounter. They should never sound familiar."},
];

const AudioDirection: React.FC = () => {
  const [expanded, setExpanded] = useState<string|null>(null);
  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50" style={{fontFamily:'"Space Mono",monospace',color:ACCENT}}>Zone Audio Identity</div>
        <div className="space-y-2">
          {AUDIO_ZONES.map(z=>(
            <div key={z.zone}>
              <button className="w-full text-left p-4 flex items-center justify-between transition-all"
                style={{background:expanded===z.zone?`${z.color}10`:A05,border:`1px solid ${expanded===z.zone?`${z.color}30`:A20}`}}
                onClick={()=>setExpanded(expanded===z.zone?null:z.zone)}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:z.color}}/>
                  <span style={{fontFamily:'"Bebas Neue",sans-serif',fontSize:'1.1rem',color:z.color,letterSpacing:'0.05em'}}>{z.zone}</span>
                  <span className="text-xs opacity-35 hidden sm:block" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',fontStyle:'italic'}}>{z.instruments}</span>
                </div>
                <span style={{color:ACCENT,fontSize:'0.7rem',opacity:0.4}}>{expanded===z.zone?'▲':'▼'}</span>
              </button>
              <AnimatePresence>
                {expanded===z.zone&&(
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}} className="overflow-hidden">
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{background:`${z.color}07`,borderLeft:`3px solid ${z.color}40`}}>
                      {[{label:'Instruments',val:z.instruments},{label:'Tempo',val:z.tempo},{label:'Mood',val:z.mood,full:true},{label:'When Corrupted',val:z.corrupted,full:true},{label:'Reference Tracks',val:z.reference}].map(item=>(
                        <div key={item.label} className={item.full?'sm:col-span-2':''}>
                          <div className="text-xs tracking-[0.2em] uppercase mb-1" style={{fontFamily:'"Space Mono",monospace',color:z.color,opacity:0.5}}>{item.label}</div>
                          <div className="text-sm leading-relaxed" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.78}}>{item.val}</div>
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
        <div className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50" style={{fontFamily:'"Space Mono",monospace',color:ACCENT}}>Sound Design Notes</div>
        <div className="space-y-3">
          {SOUND_DESIGN.map((s,i)=>(
            <motion.div key={s.label} initial={{opacity:0,x:-12}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.08}}
              className="flex gap-4 p-4" style={{background:A05,border:`1px solid ${A20}`}}>
              <div className="text-xs flex-shrink-0 pt-1" style={{color:ACCENT,fontFamily:'"Space Mono",monospace',opacity:0.4}}>♪</div>
              <div>
                <div className="font-semibold mb-1" style={{fontFamily:'"Crimson Pro",serif',color:ACCENT,fontSize:'1rem'}}>{s.label}</div>
                <p className="text-sm leading-relaxed" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.75}}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* TODO: Adaptive music system — dynamic layer switching */}
      {/* TODO: Composer brief / reference playlist */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 6. LORE & RESEARCH PANEL
// ─────────────────────────────────────────────────────────────
const LORE_ENTRIES = [
  {id:'geo-history',category:'World Lore',title:'The Founding of Geometria',locked:false,content:"Geometria was not always divided by shape. The earliest records in the Hexagon Archive describe a time when shapes were fluid — beings existed on a spectrum rather than in fixed categories. The Great Codification, a philosophical and political movement some 400 cycles ago, established the current system: shapes were assigned roles, territories, and social hierarchies based on their geometric form. It was described as an act of bringing order to chaos. To the Irregulars, it was an act of violence."},
  {id:'irregulars-origin',category:'World Lore',title:'The Origin of the Irregulars',locked:false,content:"The Irregulars are not a species. They are Shapes who were expelled, rejected, or simply could not conform to the geometric standard. Over generations, the psychological weight of shapelessness caused physical changes. The geometry of an Irregular is a record of their trauma. The more they were rejected, the more their form distorted. The Irregular Leader's body, now almost entirely shapeless, is the most extreme expression of this history."},
  {id:'hexa-gift',category:'Character Lore',title:"Why Hexa Can Shift",locked:false,content:"The Hexagon Archive contains a single entry about form-sensitivity — the ability of certain Hexagons to perceive and temporarily absorb geometric information from other shapes. It was considered a minor curiosity with no practical application. Hexa never thought twice about it. The Archive entry ends with a note: 'Theoretical use in inter-shape diplomacy. No recorded practical applications.' The Archivist finds this entry in Act II and is shaken by it."},
  {id:'great-codification',category:'Historical',title:'The Great Codification — Fragment',locked:false,content:"\"Let each shape know its purpose, and in knowing its purpose, know its place. The Circle shall smooth the way between. The Triangle shall defend the boundary. The Square shall build the foundation. The Hexagon shall preserve the record. All others — those who cannot be defined, who resist the truth of their own geometry — shall be given time to find their form. Or they shall find their place beyond our borders.\" — The Codification Accord, Cycle 1, Author Unknown."},
  {id:'void-core-nature',category:'World Lore',title:'What Is the Void Core?',locked:true,content:"Unlocked in Act III. The Void Core is not simply an Irregular stronghold. It is the physical manifestation of what happens when a shape internalizes complete shapelessness — when the Irregular Leader's loss of defined form began to affect the surrounding geometry. The Core is, in a deeply literal sense, the Irregular Leader's grief made real."},
  {id:'hexa-family',category:'Character Lore',title:"Hexa's Family — Who They Are",locked:true,content:"Unlocked when the first family member is found. Details on each family member's personality, what they experienced during captivity, and how their relationship with Hexa changes as a result. The partner, Prism, is a rare Hexagon-Circle hybrid — a being who exists between shapes. This is why the Irregulars specifically targeted them."},
];

const LorePanel: React.FC = () => {
  const [activeEntry, setActiveEntry] = useState<string|null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = ['all',...Array.from(new Set(LORE_ENTRIES.map(e=>e.category)))];
  const filtered = LORE_ENTRIES.filter(e=>activeCategory==='all'||e.category===activeCategory);
  const entry = LORE_ENTRIES.find(e=>e.id===activeEntry);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4" style={{minHeight:380}}>
      <div className="md:col-span-2 space-y-2">
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.map(c=>(
            <button key={c} onClick={()=>setActiveCategory(c)}
              className="text-xs tracking-[0.15em] uppercase px-2 py-1 transition-all"
              style={{fontFamily:'"Space Mono",monospace',color:activeCategory===c?'#0a0f18':ACCENT,background:activeCategory===c?ACCENT:A10,border:`1px solid ${activeCategory===c?ACCENT:A20}`}}>
              {c==='all'?'All':c}
            </button>
          ))}
        </div>
        {filtered.map(e=>(
          <button key={e.id} onClick={()=>!e.locked&&setActiveEntry(activeEntry===e.id?null:e.id)}
            className="w-full text-left p-3 transition-all"
            style={{background:activeEntry===e.id?A10:'transparent',border:`1px solid ${activeEntry===e.id?A20:'transparent'}`,opacity:e.locked?0.4:1,cursor:e.locked?'not-allowed':'pointer'}}>
            <div className="flex items-start gap-2">
              <span style={{color:ACCENT,fontSize:'0.6rem',opacity:0.5,marginTop:'0.2rem'}}>{e.locked?'🔒':'◆'}</span>
              <div>
                <div className="text-xs tracking-[0.12em] uppercase mb-0.5" style={{fontFamily:'"Space Mono",monospace',color:ACCENT,opacity:0.4}}>{e.category}</div>
                <div className="text-sm" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:e.locked?0.5:0.85}}>{e.title}{e.locked?' [Locked]':''}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="md:col-span-3">
        <AnimatePresence mode="wait">
          {entry ? (
            <motion.div key={entry.id} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:0.3}}
              className="p-6" style={{background:A05,border:`1px solid ${A20}`,borderLeft:`3px solid ${ACCENT}`,minHeight:300}}>
              <div className="text-xs tracking-[0.25em] uppercase mb-1" style={{fontFamily:'"Space Mono",monospace',color:ACCENT,opacity:0.5}}>{entry.category}</div>
              <h3 className="mb-4" style={{fontFamily:'"Bebas Neue",sans-serif',fontSize:'1.8rem',color:ACCENT,letterSpacing:'0.04em'}}>{entry.title}</h3>
              <p className="leading-relaxed" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.82,fontSize:'1.05rem'}}>{entry.content}</p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}}
              className="flex items-center justify-center p-8" style={{border:`1px solid ${A20}`,minHeight:300}}>
              <p className="text-center" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.3,fontSize:'0.95rem'}}>
                Select a lore entry to read.<br/>Locked entries are revealed through play.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
const IrregularPage: React.FC = () => {
  const navigate   = useNavigate();
  const activeId   = useSectionObserver();
  const heroRef    = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgNumY     = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroFade   = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div className="min-h-screen" style={{ background: VOID, color: TEXT }}>
      <style>{IRREGULAR_CSS}</style>

      {/* Persistent grid overlay */}
      <div className="irr-grid-bg fixed inset-0 pointer-events-none z-0" />

      {/* Sticky sidebar nav */}
      <StickyNav activeId={activeId} />

      {/* ─── HERO ──────────────────────────────────────────── */}
      <div ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Floating atmospheric shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { type: 'hexagon',  size: 200, x: 4,  y: 8,  dur: 22, delay: 0,  r: 12  },
            { type: 'triangle', size: 80,  x: 80, y: 18, dur: 28, delay: 3,  r: -18 },
            { type: 'circle',   size: 120, x: 68, y: 60, dur: 20, delay: 6,  r: 0   },
            { type: 'square',   size: 58,  x: 10, y: 68, dur: 32, delay: 9,  r: 32  },
            { type: 'hexagon',  size: 52,  x: 46, y: 12, dur: 36, delay: 13, r: -8  },
            { type: 'triangle', size: 40,  x: 88, y: 76, dur: 17, delay: 5,  r: 50  },
            { type: 'circle',   size: 34,  x: 28, y: 84, dur: 25, delay: 8,  r: 0   },
            { type: 'square',   size: 28,  x: 58, y: 88, dur: 29, delay: 16, r: 18  },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              animate={{ y: [0, -17, 0], rotate: [s.r, s.r + 7, s.r] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GeomShape type={s.type} size={s.size} />
            </motion.div>
          ))}
        </div>

        {/* Giant bg watermark with parallax */}
        <motion.div
          className="absolute pointer-events-none select-none"
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(14rem, 42vw, 36rem)',
            color: `${ACCENT}04`,
            right: '-0.05em',
            top: '-0.05em',
            lineHeight: 0.85,
            y: bgNumY,
          }}
        >
          01
        </motion.div>

        {/* Back button */}
        <div className="relative z-10 px-5 sm:px-8 md:px-12 pt-6 sm:pt-8">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate('/games')}
            className="flex items-center gap-2"
            style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.56rem', letterSpacing: '0.25em', color: TEXT, opacity: 0.28 }}
          >
            <ArrowLeft size={10} />
            BACK TO ALL GAMES
          </motion.button>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 max-w-5xl py-10"
          style={{ opacity: heroFade }}
        >
          {/* Genre tag */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="mb-5">
            <span
              className="inline-block text-[10px] sm:text-xs px-3 py-1 tracking-[0.3em] uppercase"
              style={{ fontFamily: '"Space Mono", monospace', color: ACCENT, border: `1px solid ${ACCENT}35` }}
            >
              Metroidvania · Puzzle · Exploration
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="irr-flicker leading-none mb-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(5.5rem, 20vw, 15rem)',
              color: ACCENT,
              letterSpacing: '0.02em',
            }}
          >
            IRREGULAR
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mb-8 italic"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
          >
            A world of perfect shapes. An invasion of chaos. One family torn apart.
          </motion.p>

          {/* Hook quote */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.58 }}
            className="max-w-2xl mb-10 pl-5"
            style={{ borderLeft: `2px solid ${ACCENT}45` }}
          >
            <p
              className="italic leading-relaxed"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, opacity: 0.78, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}
            >
              In a world built from clean geometry, the Irregulars arrived without warning.
              One shape will transform into anything to find their family.
            </p>
          </motion.div>

          {/* Metadata bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.78 }}
            className="flex flex-wrap border-t border-b"
            style={{ borderColor: `${ACCENT}0e` }}
          >
            {[
              { label: 'STATUS',   value: 'DESIGN PHASE' },
              { label: 'ACTS',     value: '3' },
              { label: 'ENGINE',   value: 'TBD' },
              { label: 'PLATFORM', value: 'PC / CONSOLE' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="px-4 sm:px-6 py-3 flex flex-col gap-0.5"
                style={{ borderRight: i < 3 ? `1px solid ${ACCENT}08` : 'none' }}
              >
                <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.48rem', color: ACCENT, opacity: 0.32, letterSpacing: '0.2em' }}>{item.label}</div>
                <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', color: ACCENT, opacity: 0.82, letterSpacing: '0.1em' }}>{item.value}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="relative z-10 flex justify-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: ACCENT, opacity: 0.18 }}
          >
            <svg width="14" height="22" viewBox="0 0 14 22">
              <rect x="4" y="1.5" width="6" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7" cy="6.5" r="1.5" fill="currentColor" />
              <line x1="7" y1="14.5" x2="7" y2="19.5" stroke="currentColor" strokeWidth="1.5" />
              <polyline points="4.5,17.5 7,20.5 9.5,17.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── CONTENT SECTIONS ──────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-24">

        <IrrSection id="overview" num="01" label="OVERVIEW">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Genre',              value: 'Metroidvania / Action Platformer with puzzle-gating and environmental storytelling' },
              { label: 'Core Tone',          value: 'Melancholic but determined. Visually playful geometry hiding a surprisingly emotional story.' },
              { label: 'Primary Inspiration',value: 'Metroid Prime (morph mechanics, atmospheric isolation), Hollow Knight (world-building through environment)' },
              { label: 'Visual Style',       value: 'Clean geometric shapes with glowing edges. Corrupted zones use jagged fractured aesthetics — mathematical beauty against organic chaos.' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="p-4 sm:p-5 irr-glow transition-all duration-300"
                style={{ background: A05, border: `1px solid ${ACCENT}14` }}
              >
                <div className="text-xs tracking-[0.25em] uppercase mb-2 opacity-38" style={{ fontFamily: '"Space Mono", monospace', color: ACCENT }}>{item.label}</div>
                <div className="leading-relaxed" style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, opacity: 0.82, fontSize: '1rem' }}>{item.value}</div>
              </motion.div>
            ))}
          </div>
        </IrrSection>

        <IrrSection id="narrative" num="02" label="NARRATIVE">
          <div className="space-y-5 mb-8">
            {[
              { key: 'Geometria',       tail: ' is a structured civilization of Shapes — each assigned social roles tied to their geometry. Circles are diplomats, Triangles are warriors, Squares are builders, Hexagons are scholars. A beautiful, nearly abstract utopia built on mathematical harmony.' },
              { key: 'The Irregulars',  tail: " are not evil by nature — they are unstable, undefined shapes that don't conform to geometric law. Outcast for centuries, a faction has weaponized their chaos. They are terrifying because they are unpredictable — their bodies shift, their attacks have no pattern." },
              { key: 'The protagonist', tail: " — a cartographer, not a soldier — has one unusual gift: the ability to become something else. When the invasion takes their family, this gift is all they have." },
            ].map((p, i) => (
              <motion.p
                key={p.key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.88 }}
              >
                <strong style={{ color: ACCENT, opacity: 1, fontStyle: 'normal' }}>{p.key}</strong>{p.tail}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-5 sm:p-6"
            style={{ borderTop: `2px solid ${ACCENT}`, background: `${ACCENT}06` }}
          >
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', color: ACCENT, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Thematic Core: </span>
            <span className="italic" style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, opacity: 0.85, fontSize: '1.05rem' }}>
              Identity is not fixed. The hero&apos;s power is literally the ability to become something else — and the question the game asks is: after shapeshifting through an entire world, do you know who you are anymore?
            </span>
          </motion.div>
        </IrrSection>

        <IrrSection id="world-map" num="03" label="WORLD MAP">
          <TodoPlaceholder
            title="GEOMETRIA — INTERACTIVE ZONE MAP"
            description="Zone map, traversal boundaries, and inter-zone navigational infrastructure pending the cartography design phase."
            module="world.cartography"
            notes={ZONES.map(z => `Act ${z.act}  ·  ${z.name}  —  ${z.status}`)}
          />
        </IrrSection>

        <IrrSection id="characters" num="04" label="CHARACTERS">
          <CharacterRoster />
        </IrrSection>

        <IrrSection id="timeline" num="05" label="STORY TIMELINE">
          <p className="mb-5 opacity-28" style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.58rem', color: TEXT, letterSpacing: '0.12em' }}>
            // Filter by act · Click a beat to expand
          </p>
          <StoryTimeline />
        </IrrSection>

        <IrrSection id="mechanics" num="06" label="CORE MECHANICS">
          {[
            { title: 'Form Shifting',            description: 'Hexa morphs between unlocked shapes. Circle = fast roll + tight tunnel access (Morph Ball equivalent). Triangle = dash-attack + wall piercing. Square = anchor + weight puzzles. Hexagon (base) = versatile NPC interaction + terminal access.' },
            { title: 'Irregular Corruption Zones',description: "Some areas have corrupted geometry — the rules break down unpredictably. Hexa must learn Irregular patterns to navigate without succumbing to shapelessness. Unique visual and audio design: jagged edges, distorted sound, unstable platforms." },
            { title: 'Shape Empathy System',      description: "Defeated Irregular bosses don't die — Hexa absorbs their irregular geometry to unlock temporary chaos-forms that break normal puzzle rules. A late-game mechanic with moral weight: using the enemy's own nature against them." },
            { title: 'Open World Zones',          description: 'Each region corresponds to a Shape civilization. Gating is ability-based, not linear. The world opens progressively through form unlocks, not locked doors.' },
            { title: 'Family Trail System',       description: 'Hexa tracks their family through scattered notes, corrupted memories, and NPC testimony — assembling fragments into a hand-drawn map. Rewards exploration over waypoint-following.' },
          ].map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex gap-4 sm:gap-5 py-5 group"
              style={{ borderBottom: `1px solid ${ACCENT}09` }}
            >
              <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.52rem', color: ACCENT, opacity: 0.25, flexShrink: 0, paddingTop: '0.38rem', minWidth: 26, textAlign: 'right' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="mb-1" style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: ACCENT, fontSize: '1.05rem', fontWeight: 600 }}>{m.title}</div>
                <p style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, opacity: 0.7, fontSize: '1rem', lineHeight: 1.82 }}>{m.description}</p>
              </div>
            </motion.div>
          ))}
        </IrrSection>

        <IrrSection id="acts" num="07" label="ACT STRUCTURE">
          {[
            { num: 'I',   title: 'THE RAID',     col: '#a8d8f0', description: 'Opening sequence: the invasion. Hexa escapes but loses their family. The world is in chaos. Hexa begins navigating Circle Plains to reach the Circle Council and seek help. Tutorial disguised as desperation.' },
            { num: 'II',  title: 'THE ALLIANCE', col: ACCENT,    description: 'Hexa earns the trust of each shape civilization. Each ruler unlocks a new form. The truth emerges: the Irregular leader was once a shape who was outcast and mutated. The family is found one by one in sub-zones.' },
            { num: 'III', title: 'THE CORE',     col: CHAOS,     description: "The Irregular stronghold — geometry fully collapsed. Hexa must use all forms fluidly. Final boss: the Irregular leader. The choice — destroy or absorb — and what that means for Geometria's future. Both endings are valid. Neither is simple." },
          ].map(act => (
            <motion.div
              key={act.num}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-4 mb-5"
              style={{ gridTemplateColumns: '48px 1fr' }}
            >
              <div
                className="text-right leading-none font-black"
                style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '3.2rem', color: act.col, lineHeight: 0.85, opacity: 0.11 }}
              >
                {act.num}
              </div>
              <div className="pt-0.5 pb-6" style={{ borderBottom: `1px solid ${act.col}12` }}>
                <h4 className="mb-2 tracking-wider" style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.2rem', color: TEXT, letterSpacing: '0.1em' }}>{act.title}</h4>
                <div className="w-8 h-[1px] mb-3" style={{ background: act.col, opacity: 0.4 }} />
                <p style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: TEXT, opacity: 0.7, fontSize: '1rem', lineHeight: 1.82 }}>{act.description}</p>
              </div>
            </motion.div>
          ))}
        </IrrSection>

        <IrrSection id="art" num="08" label="ART DIRECTION">
          <ArtDirection />
        </IrrSection>

        <IrrSection id="audio" num="09" label="AUDIO & MUSIC">
          <AudioDirection />
        </IrrSection>

        <IrrSection id="lore" num="10" label="LORE & RESEARCH">
          <p className="mb-5 opacity-28" style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.58rem', color: TEXT, letterSpacing: '0.12em' }}>
            // Locked entries revealed through gameplay
          </p>
          <LorePanel />
        </IrrSection>

        {/* TODO: Boss design breakdowns — each boss reflects its zone's geometry rules */}
        {/* TODO: Upgrade tree diagram — Hexa's base form growth across the journey */}
        {/* TODO: Release strategy — episodic vs. full release */}
      </div>

      {/* Footer */}
      <div
        className="relative z-10 text-center pb-10"
        style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.5rem', letterSpacing: '0.3em', color: TEXT, opacity: 0.16 }}
      >
        DESIGN BIBLE · DRAFT 1 · IRREGULAR
      </div>
    </div>
  );
};

export default IrregularPage;