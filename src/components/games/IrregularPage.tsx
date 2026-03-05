import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GamePageShell,
  Section,
  InfoGrid,
  MechanicItem,
  ActBlock,
  Callout,
} from './GamePageShell';

const ACCENT = '#7eb8e8';
const A10 = `${ACCENT}1a`;
const A20 = `${ACCENT}33`;
const A05 = `${ACCENT}0d`;

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

const ShapeIcon: React.FC<{ shape: string; color: string; size: number }> = ({ shape, color, size }) => {
  const s = size * 0.55;
  if (shape === 'circle') return <circle cx={size/2} cy={size/2} r={s/2} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} />;
  if (shape === 'triangle') {
    const cx = size/2, cy = size/2;
    return <polygon points={`${cx},${cy-s/2} ${cx+s/2},${cy+s/2} ${cx-s/2},${cy+s/2}`} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} />;
  }
  if (shape === 'square') {
    const off = (size - s) / 2;
    return <rect x={off} y={off} width={s} height={s} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} />;
  }
  if (shape === 'hexagon') {
    const cx = size/2, cy = size/2, r = s/2;
    const pts = Array.from({length:6},(_,i)=>{const a=(Math.PI/3)*i-Math.PI/6;return`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(' ');
    return <polygon points={pts} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} />;
  }
  const cx = size/2, cy = size/2;
  const pts = Array.from({length:8},(_,i)=>{const a=(Math.PI/4)*i,r=(s/2)*(0.6+0.4*Math.sin(i*2.3+1));return`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(' ');
  return <polygon points={pts} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} strokeDasharray="3 2" />;
};

const WorldMap: React.FC = () => {
  const [selected, setSelected] = useState<string|null>(null);
  const zone = ZONES.find(z=>z.id===selected);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{minHeight:400}}>
      <div className="lg:col-span-3 relative rounded-sm overflow-hidden" style={{background:'#07101a',border:`1px solid ${A20}`,minHeight:380}}>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {Array.from({length:10}).map((_,i)=>(
            <g key={i}>
              <line x1={`${i*10}%`} y1="0%" x2={`${i*10}%`} y2="100%" stroke={ACCENT} strokeOpacity={0.04} strokeWidth={1}/>
              <line x1="0%" y1={`${i*10}%`} x2="100%" y2={`${i*10}%`} stroke={ACCENT} strokeOpacity={0.04} strokeWidth={1}/>
            </g>
          ))}
          {[[18+3.5,55+3.5,40+3.75,40+3.75],[62+3,18+3,40+3.75,40+3.75],[62+3.25,60+3.25,40+3.75,40+3.75],[20+2.9,20+2.9,40+3.75,40+3.75]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={ACCENT} strokeOpacity={0.1} strokeWidth={1} strokeDasharray="4 4"/>
          ))}
        </svg>
        {ZONES.map(z=>(
          <motion.button key={z.id} className="absolute flex flex-col items-center"
            style={{left:`${z.x}%`,top:`${z.y}%`,transform:'translate(-50%,-50%)'}}
            onClick={()=>setSelected(selected===z.id?null:z.id)}
            whileHover={{scale:1.12}} whileTap={{scale:0.96}}>
            <motion.svg width={z.size*0.7} height={z.size*0.7} viewBox={`0 0 ${z.size} ${z.size}`}
              animate={{opacity:selected&&selected!==z.id?0.3:1}}>
              <ShapeIcon shape={z.shape} color={z.color} size={z.size}/>
            </motion.svg>
            {selected===z.id&&(
              <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                className="absolute -bottom-6 whitespace-nowrap"
                style={{fontFamily:'"Space Mono",monospace',fontSize:'0.48rem',letterSpacing:'0.2em',color:z.color}}>
                {z.name.toUpperCase()}
              </motion.div>
            )}
          </motion.button>
        ))}
        <div className="absolute bottom-3 left-3" style={{fontFamily:'"Space Mono",monospace',fontSize:'0.48rem',letterSpacing:'0.2em',color:ACCENT,opacity:0.35}}>
          GEOMETRIA · WORLD MAP
        </div>
      </div>

      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {zone ? (
            <motion.div key={zone.id} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:0.3}}
              className="h-full p-5 flex flex-col gap-4" style={{background:`${zone.color}08`,border:`1px solid ${zone.color}30`,minHeight:380}}>
              <div>
                <div className="text-xs tracking-[0.25em] uppercase mb-1" style={{fontFamily:'"Space Mono",monospace',color:zone.color,opacity:0.6}}>Act {zone.act} Zone</div>
                <h3 className="leading-none mb-1" style={{fontFamily:'"Bebas Neue",sans-serif',fontSize:'2rem',color:zone.color,letterSpacing:'0.04em'}}>{zone.name}</h3>
                <div className="text-xs mb-3" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8',opacity:0.35}}>{zone.status} · {zone.ruler}</div>
                <p className="text-sm leading-relaxed" style={{fontFamily:'"Crimson Pro",Georgia,serif',color:'#f5f0e8',opacity:0.78}}>{zone.description}</p>
              </div>
              <div className="space-y-3 mt-auto">
                {[{label:'Form Unlocked',val:zone.unlock},{label:'Enemy Types',val:zone.enemies}].map(item=>(
                  <div key={item.label} style={{borderTop:`1px solid ${zone.color}22`,paddingTop:'0.75rem'}}>
                    <div className="text-xs tracking-[0.2em] uppercase mb-1" style={{fontFamily:'"Space Mono",monospace',color:zone.color,opacity:0.5}}>{item.label}</div>
                    <div className="text-sm" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.8}}>{item.val}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}}
              className="h-full flex items-center justify-center p-6" style={{border:`1px solid ${A20}`,minHeight:380}}>
              <p className="text-center" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8',opacity:0.3,fontSize:'0.95rem'}}>
                Select a zone on the map<br/>to explore its details
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

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
        <div className="text-xs tracking-[0.25em] uppercase mb-4 opacity-50" style={{fontFamily:'"Space Mono",monospace',color:ACCENT}}>Shape Language System</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ZONES.map(z=>(
            <div key={z.id} className="flex flex-col items-center p-4 gap-3" style={{background:`${z.color}08`,border:`1px solid ${z.color}20`}}>
              <svg width={52} height={52} viewBox={`0 0 ${z.size} ${z.size}`}><ShapeIcon shape={z.shape} color={z.color} size={z.size}/></svg>
              <div className="text-center">
                <div className="text-xs font-mono" style={{color:z.color,opacity:0.8}}>{z.shape.toUpperCase()}</div>
                <div className="text-xs mt-0.5 opacity-35" style={{fontFamily:'"Crimson Pro",serif',color:'#f5f0e8'}}>{z.ruler.split(' The ')[1]||z.ruler}</div>
              </div>
            </div>
          ))}
        </div>
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
  return (
    <GamePageShell
      gameNumber="01"
      title="Irregular"
      subtitle="A world of perfect shapes. An invasion of chaos. One family torn apart."
      hook="In a world built from clean geometry, the Irregulars arrived without warning — warping matter, corrupting order, and tearing families apart. Now one shape will transform into anything to get theirs back."
      genre="Metroidvania · Puzzle · Exploration"
      accentColor={ACCENT}
      bgFrom="#0a0f18"
      bgTo="#081525"
    >
      <Section label="Overview" accentColor={ACCENT}>
        <InfoGrid accentColor={ACCENT} items={[
          {label:'Genre',value:'Metroidvania / Action Platformer with puzzle-gating and environmental storytelling'},
          {label:'Core Tone',value:'Melancholic but determined. Visually playful geometry hiding a surprisingly emotional story.'},
          {label:'Primary Inspiration',value:'Metroid Prime (morph mechanics, atmospheric isolation), Hollow Knight (world-building through environment)'},
          {label:'Visual Style',value:'Clean geometric shapes with glowing edges. Corrupted Irregular zones use jagged, fractured aesthetics — organic vs. pure.'},
        ]}/>
      </Section>

      <Section label="Story / Narrative" accentColor={ACCENT}>
        <div className="space-y-5 leading-relaxed opacity-80" style={{fontFamily:'"Crimson Pro",Georgia,serif',color:'#f5f0e8',fontSize:'1.1rem'}}>
          <p><strong style={{color:ACCENT,opacity:1}}>Geometria</strong> is a structured civilization of Shapes — Circles, Triangles, Squares, Hexagons — each with defined social roles tied to their geometry. Circles are diplomats, Triangles are warriors, Squares are builders, Hexagons are scholars. A beautiful, almost abstract utopia built on mathematical harmony.</p>
          <p>The <strong style={{color:ACCENT,opacity:1}}>Irregulars</strong> are not evil by nature — they are unstable, undefined shapes that don't conform to geometric law. Outcast for centuries, a faction has weaponized their chaos, invading Geometria to "liberate" it from order. They are terrifying because they are <em>unpredictable</em> — their bodies shift, their attacks have no pattern.</p>
          <p>During the invasion, the protagonist's family is taken in a raid. Not a soldier, not royalty — a cartographer with one unusual gift: the ability to become something else.</p>
        </div>
        <Callout label="Thematic Core" accentColor={ACCENT} text="Identity is not fixed. The hero's power is literally the ability to become something else — and the question the game asks is: after shapeshifting through an entire world, do you know who you are anymore?"/>
      </Section>

      <Section label="Interactive World Map" accentColor={ACCENT}>
        <p className="mb-5 text-sm opacity-45" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8',letterSpacing:'0.1em'}}>Click a zone to explore →</p>
        <WorldMap/>
      </Section>

      <Section label="Characters & Roster" accentColor={ACCENT}>
        <CharacterRoster/>
      </Section>

      <Section label="Story Timeline" accentColor={ACCENT}>
        <p className="mb-4 text-sm opacity-45" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8',letterSpacing:'0.1em'}}>Filter by act · Click a beat to expand →</p>
        <StoryTimeline/>
      </Section>

      <Section label="Core Mechanics" accentColor={ACCENT}>
        {[
          {title:'Form Shifting',description:'Hexa morphs between unlocked shapes. Circle = fast roll + tight tunnel access (Morph Ball equivalent). Triangle = dash-attack + wall piercing. Square = anchor + weight puzzles. Hexagon (base) = versatile, can talk to NPCs and interact with terminals.'},
          {title:'Irregular Corruption Zones',description:"Some areas are corrupted — geometry breaks down and the rules change unpredictably. Hexa must learn Irregular patterns to navigate without succumbing to shapelessness. These zones have unique visual and audio design: jagged edges, distorted sound, unstable platforms."},
          {title:'Shape Empathy System',description:"Defeated Irregular bosses don't die — Hexa absorbs their irregular geometry to unlock temporary chaos-forms that break normal puzzle rules. Late-game mechanic that adds moral complexity: using the enemy's own nature."},
          {title:'Open World Zones',description:'Each region corresponds to a Shape civilization: Circle Plains (rolling loops), Triangle Peaks (vertical spike zones), Square Citadel (mechanical grid puzzles), Hexagon Archive (lore-heavy, terminal-driven). Gating is ability-based, not linear.'},
          {title:'Family Trail System',description:"Hexa tracks their family through scattered notes, corrupted memories, and NPC testimony — assembling fragments into a hand-drawn map. Rewards exploration over waypoint-following."},
        ].map((m,i)=><MechanicItem key={m.title} title={m.title} description={m.description} accentColor={ACCENT} index={i}/>)}
      </Section>

      <Section label="Act Structure" accentColor={ACCENT}>
        <ActBlock accentColor={ACCENT} number="I" title="The Raid" description="Opening sequence: the invasion. Hexa escapes but loses their family. The world is in chaos. Hexa begins navigating Circle Plains to reach the Circle Council and seek help. Tutorial disguised as desperation."/>
        <ActBlock accentColor={ACCENT} number="II" title="The Alliance" description="Hexa earns the trust of each shape civilization. Each ruler unlocks a new form. The truth emerges: the Irregular leader was once a shape who was outcast and mutated. The family is found one by one in sub-zones."/>
        <ActBlock accentColor={ACCENT} number="III" title="The Core" description="The Irregular stronghold — geometry fully collapsed. Hexa must use all forms fluidly. Final boss: the Irregular leader. Hexa's choice — destroy or absorb — and what that means for Geometria's future. Both endings are valid. Neither is simple."/>
      </Section>

      <Section label="Art Direction" accentColor={ACCENT}>
        <ArtDirection/>
      </Section>

      <Section label="Audio & Music Direction" accentColor={ACCENT}>
        <AudioDirection/>
      </Section>

      <Section label="Lore & Research" accentColor={ACCENT}>
        <p className="mb-5 text-sm opacity-45" style={{fontFamily:'"Space Mono",monospace',color:'#f5f0e8',letterSpacing:'0.1em'}}>Locked entries revealed through gameplay →</p>
        <LorePanel/>
      </Section>

      {/* TODO: Boss design breakdowns — each boss reflects its zone's geometry rules */}
      {/* TODO: Upgrade tree diagram — Hexa's base form growth across the journey */}
      {/* TODO: Release strategy — episodic vs. full release */}
    </GamePageShell>
  );
};

export default IrregularPage;