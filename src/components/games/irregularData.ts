export type Zone = {
  id: string;
  name: string;
  shape: string;
  ruler: string;
  status: string;
  color: string;
  x: number;
  y: number;
  size: number;
  description: string;
  unlock: string;
  enemies: string;
  act: string;
};

export type Character = {
  id: string;
  name: string;
  role: string;
  type: string;
  description: string;
  traits: string[];
  powerType: string;
  arc: string;
  stats: { combat: number; mobility: number; puzzle: number; empathy: number };
  shape: string;
  color: string;
  image: string;
};

export const environments: Record<string, string> = {
  'circle-plains': '/assets/irregular/environments/circle-plains.webp',
  'triangle-peaks': '/assets/irregular/environments/triangle-peaks.webp',
  'square-citadel': '/assets/irregular/environments/square-citadel.webp',
  'hexagon-archive': '/assets/irregular/environments/hexagon-archive.webp',
  'void-core': '/assets/irregular/environments/void-core.webp',
};

export const SOURCE_BOARD = '/assets/irregular/source-board.png';

export const NAV_SECTIONS = [
  { id: 'overview', label: 'OVERVIEW', num: '01' },
  { id: 'narrative', label: 'NARRATIVE', num: '02' },
  { id: 'world-map', label: 'WORLD MAP', num: '03' },
  { id: 'characters', label: 'CHARACTERS', num: '04' },
  { id: 'timeline', label: 'TIMELINE', num: '05' },
  { id: 'mechanics', label: 'MECHANICS', num: '06' },
  { id: 'acts', label: 'ACT STRUCT', num: '07' },
  { id: 'art', label: 'ART DIR', num: '08' },
  { id: 'audio', label: 'AUDIO', num: '09' },
  { id: 'lore', label: 'LORE', num: '10' },
];

export const ZONES: Zone[] = [
  {
    id: 'circle-plains',
    name: 'Circle Plains',
    shape: 'circle',
    ruler: 'The Circle Diplomat',
    status: 'Partially Corrupted',
    color: '#a8d8f0',
    x: 18,
    y: 55,
    size: 70,
    description:
      'Vast rolling terrain of smooth loops and arcs. The first zone Hexa enters. Home to the Circle Diplomat whose trust must be earned before the Circle form is unlocked. Corruption zones appear as jagged cracks splitting smooth curves.',
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
    x: 62,
    y: 18,
    size: 60,
    description:
      "Vertical spike zones and razor ridges. The Triangle General views Hexa's shapeshifting as a threat to Triangle purity. Earning trust here requires proving worth through combat, not diplomacy.",
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
    x: 62,
    y: 60,
    size: 65,
    description:
      "A vast mechanical grid of pressure plates, weight puzzles, and interlocking chambers. The Square Architect has sealed the Citadel — getting inside requires demonstrating patience and precision Hexa hasn't needed before.",
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
    x: 20,
    y: 20,
    size: 58,
    description:
      "Hexa's homeland. Lore-heavy, terminal-driven — a vast library of geometric history. The Archivist knows more about the Irregular leader than anyone, but has gone into hiding. This zone reveals why the Irregular war truly began.",
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
    x: 43,
    y: 43,
    size: 75,
    description:
      'The Irregular stronghold at the centre of Geometria — geometry has fully collapsed here. No shape rules apply. Platforms phase in and out. Enemies shift form mid-fight. Hexa must use all forms fluidly and begin using absorbed chaos-forms.',
    unlock: 'Chaos Forms — absorbed from defeated Irregular bosses',
    enemies: 'All types + The Irregular Leader (final boss)',
    act: 'III',
  },
];

export const characters: Character[] = [
  {
    id: 'hexa',
    name: 'HEXA',
    role: 'Protagonist',
    type: 'Hero',
    description:
      'A mid-tier Hexagon — not a warrior, not royalty. Hexa was a cartographer, mapping the edges of Geometria. Their power is empathy through transformation: studying and absorbing the geometry of other shapes to solve problems no single shape could handle.',
    traits: ['Empathetic', 'Resourceful', 'Undefined', 'Determined'],
    powerType: 'Form Shifting',
    arc: 'Civilian → Multi-form survivor → Identity crisis → Chosen guardian',
    stats: { combat: 40, mobility: 75, puzzle: 90, empathy: 95 },
    shape: 'hexagon',
    color: '#c8b8f0',
    image: '/assets/irregular/characters/hexa.webp',
  },
  {
    id: 'unnamed',
    name: 'THE UNNAMED',
    role: 'Primary Antagonist',
    type: 'Antagonist',
    description:
      'Not a villain born from malice — a shape that was outcast and mutated over decades of rejection. They want the dissolution of geometric law entirely. Wrong in their methods, not wrong in their grievance.',
    traits: ['Bitter', 'Visionary', 'Unpredictable', 'Tragic'],
    powerType: 'Chaos Manipulation',
    arc: 'Outcast shape → Mutation → Revolutionary → Mirror to Hexa',
    stats: { combat: 95, mobility: 85, puzzle: 60, empathy: 30 },
    shape: 'irregular',
    color: '#f0a8c8',
    image: '/assets/irregular/characters/the-unnamed.webp',
  },
  {
    id: 'orbis',
    name: 'ORBIS',
    role: 'Circle Diplomat · Zone Ruler',
    type: 'Ally (earned)',
    description:
      "Smooth, adaptable, and politically cautious. Orbis is reluctant to commit the Circle civilization to any cause — they've survived by negotiation, not by picking sides.",
    traits: ['Diplomatic', 'Cautious', 'Adaptable', 'Calculating'],
    powerType: 'Sphere of Influence',
    arc: 'Neutral → Skeptical ally → Committed council member',
    stats: { combat: 30, mobility: 80, puzzle: 65, empathy: 70 },
    shape: 'circle',
    color: '#a8d8f0',
    image: '/assets/irregular/characters/orbis.webp',
  },
  {
    id: 'apex',
    name: 'APEX',
    role: 'Triangle General · Zone Ruler',
    type: 'Ally (earned)',
    description:
      "Sharp, directional, and deeply suspicious of Hexa's shapeshifting. Apex sees it as deception — a shapeshifter has no loyalties. Once trust is earned through combat, Apex becomes the most valuable military ally.",
    traits: ['Proud', 'Martial', 'Suspicious', 'Loyal once proven'],
    powerType: 'Precision Strike',
    arc: 'Hostile → Grudging respect → Fierce ally',
    stats: { combat: 90, mobility: 70, puzzle: 40, empathy: 45 },
    shape: 'triangle',
    color: '#f0b8a8',
    image: '/assets/irregular/characters/apex.webp',
  },
  {
    id: 'quad',
    name: 'QUAD',
    role: 'Square Architect · Zone Ruler',
    type: 'Ally (earned)',
    description:
      "Methodical, patient, and entirely uninterested in anything that can't be measured. Once inside the sealed Citadel, Quad becomes scientifically fascinated by Hexa — a shape that shouldn't work, but does.",
    traits: ['Analytical', 'Patient', 'Rigid', 'Quietly curious'],
    powerType: 'Structural Engineering',
    arc: 'Sealed away → Reluctant → Scientifically invested',
    stats: { combat: 45, mobility: 30, puzzle: 95, empathy: 55 },
    shape: 'square',
    color: '#b8c8a8',
    image: '/assets/irregular/characters/quad.webp',
  },
];

export const TIMELINE_BEATS = [
  { act: 'I', id: 'tb1', label: 'The Irregular Invasion', type: 'event', description: "Without warning, Irregulars flood Geometria. Hexa's district is raided. Family taken. No warning. No negotiation." },
  { act: 'I', id: 'tb2', label: 'Escape', type: 'hexa', description: 'Hexa escapes the raid — the only protection is instinct and the ability to run. No power yet. Just survival and grief.' },
  { act: 'I', id: 'tb3', label: 'Circle Plains', type: 'zone', description: 'Hexa reaches Circle Plains. Orbis and the Circle Council are in crisis. Hexa offers help in exchange for passage and trust.' },
  { act: 'I', id: 'tb4', label: 'Circle Form Unlocked', type: 'power', description: 'First transformation. The Circle form changes how the world works — tunnels, rolls, momentum. A new way of moving through Geometria.' },
  { act: 'II', id: 'tb5', label: 'Triangle Peaks', type: 'zone', description: 'Apex meets Hexa with hostility. A shapeshifter is no different from an Irregular to a Triangle. Combat is the only language that counts.' },
  { act: 'II', id: 'tb6', label: 'Truth Surfaces', type: 'lore', description: "Fragments of the Irregular Leader's origin begin to emerge. They were once a shape — outcast. The mission becomes less simple." },
  { act: 'II', id: 'tb7', label: 'Triangle + Square Forms', type: 'power', description: 'Two new ways of engaging the world. The puzzle language of Geometria begins to fully open up.' },
  { act: 'II', id: 'tb8', label: 'Hexagon Archive', type: 'zone', description: "Hexa returns to their homeland — now corrupted. The Archivist reveals the Irregular Leader's full history." },
  { act: 'II', id: 'tb9', label: 'First Rescue', type: 'hexa', description: 'One family member is found. Not a clean rescue — they are changed by what happened, and the reunion is complicated.' },
  { act: 'III', id: 'tb10', label: 'Void Core — Entry', type: 'event', description: "Geometry fully collapses. None of Hexa's forms work cleanly here. The absorbed chaos-forms become essential." },
  { act: 'III', id: 'tb11', label: 'Full Reunion', type: 'hexa', description: 'The remaining family members are found. Each rescue is its own emotional arc. Nothing is simple.' },
  { act: 'III', id: 'tb12', label: 'The Final Choice', type: 'choice', description: "Destroy the Irregular Leader — restore geometric law. Absorb — integrate chaos into Geometria's future. Both endings are valid. Neither is clean." },
];

export const BEAT_COLORS: Record<string, string> = {
  event: '#f0b8a8',
  hexa: '#c8b8f0',
  zone: '#7eb8e8',
  power: '#98e8c8',
  lore: '#e8d898',
  choice: '#f0c8a8',
};

export const BEAT_LABELS: Record<string, string> = {
  event: 'World Event',
  hexa: 'Hexa Moment',
  zone: 'Zone Beat',
  power: 'Power Unlock',
  lore: 'Lore Reveal',
  choice: 'Player Choice',
};

export const MECHANICS: [string, string, string, string][] = [
  ['01', 'CIRCLE FORM', 'Momentum & traversal', 'Fast rolling, smooth momentum, and access to tight tunnels. Turns curved spaces into navigable routes.'],
  ['02', 'TRIANGLE FORM', 'Combat & penetration', 'Directional dash-attacks and wall piercing. A form built around force, precision, and forward intent.'],
  ['03', 'SQUARE FORM', 'Weight & structure', 'Anchoring, pressure plates, and weight puzzles. Stability becomes a tool for manipulating the environment.'],
  ['04', 'HEXAGON FORM', 'Perception & memory', "Hexa's base form and native identity. Archive terminals, extended NPC dialogue, and form-sensitivity underpin the journey."],
  ['05', 'CHAOS FORMS', 'Adaptation under collapse', 'Absorbed from defeated Irregular bosses. Unstable abilities become essential in the Void Core, where clean geometry fails.'],
  ['06', 'FORM-SHIFTING', 'Empathy as a system', 'Hexa studies and absorbs geometric information. Transformation is not only a power — it is a way of understanding other shapes.'],
];

export const PALETTE = [
  { name: 'Void Ink', hex: '#07101a', use: 'Background / deepest shadow' },
  { name: 'Hexa Blue', hex: '#7eb8e8', use: 'UI accent / Hexa glow / terminals' },
  { name: 'Circle Frost', hex: '#a8d8f0', use: 'Circle Plains environment' },
  { name: 'Triangle Ember', hex: '#f0b8a8', use: 'Triangle Peaks / combat flash' },
  { name: 'Square Sage', hex: '#b8c8a8', use: 'Square Citadel / structural elements' },
  { name: 'Archive Violet', hex: '#c8b8f0', use: 'Hexagon Archive / lore terminals' },
  { name: 'Chaos Pink', hex: '#f0a8c8', use: 'Irregular zones / corruption visual' },
  { name: 'Clean White', hex: '#f5f0e8', use: 'Text / pure geometry highlights' },
];

export const DESIGN_PRINCIPLES = [
  { title: 'Geometry as Character', desc: 'Every shape communicates personality through its form. Circles feel safe and mobile. Triangles feel aggressive. Squares feel immovable. Irregular entities feel genuinely wrong — asymmetric, twitchy, visually uncomfortable.' },
  { title: 'Corruption as Gradation', desc: 'Zones exist on a spectrum from pure to corrupted. Pure zones have clean lines, solid fills, mathematical precision. Corrupted zones break down gradually — edges fragment, fills become unstable, geometric rules start to slip.' },
  { title: "Hexa's Visual Identity", desc: "In base Hexagon form, Hexa is slightly more detailed than other shapes — a quiet visual marker of their role. Each absorbed form maintains a trace of Hexa's color as a thin outline glow." },
  { title: 'Negative Space as Threat', desc: 'The Void Core is designed through absence — shapes disappear, leaving only edges, then leaving nothing. The visual language of emptiness should feel genuinely unsettling, not just dark.' },
];

export const AUDIO_ZONES = [
  { zone: 'Circle Plains', color: '#a8d8f0', instruments: 'Sine waves, smooth pads, low hum', tempo: 'Moderate — flowing, never rushed', mood: 'Cautious hope. A world that was beautiful and is trying to remember it.', corrupted: 'Clean tones develop static. Smooth curves of sound begin to clip at the edges.', reference: 'Hollow Knight — Greenpath. Journey OST.' },
  { zone: 'Triangle Peaks', color: '#f0b8a8', instruments: 'Staccato strings, sharp percussive hits, brass stabs', tempo: 'Fast — aggressive, directional', mood: 'Tension and pride. Everything moves with intent. No soft edges.', corrupted: 'The sharp hits become chaotic — they lose rhythm and begin to overlap and clash.', reference: 'Metroid Dread — combat zones. Celeste — confrontation tracks.' },
  { zone: 'Square Citadel', color: '#b8c8a8', instruments: 'Mechanical clicks, low pulses, grid-synced beats', tempo: 'Precise — every beat on the measure, never syncopated', mood: 'Order. Pressure. The sound of a world trying to hold itself together.', corrupted: 'The grid-synced beats fall out of time. Mechanical precision becomes chaos.', reference: 'Portal 2 — puzzle chambers. SOMA — industrial ambient.' },
  { zone: 'Hexagon Archive', color: '#c8b8f0', instruments: 'Deep choir, resonant tones, sparse piano', tempo: 'Slow — contemplative, vast', mood: "Memory and loss. This was home. It doesn't feel like home anymore.", corrupted: 'The choir falls into dissonance. Memory becomes distortion.', reference: 'Ico OST. Shadow of the Colossus — exploration themes.' },
  { zone: 'The Void Core', color: '#f0a8c8', instruments: 'Inverted samples, noise, fragments of all previous zone themes', tempo: 'Unstable — the tempo itself shifts', mood: 'Everything breaking down. Recognition becoming impossible. A final confrontation with formlessness.', corrupted: 'This is the corrupted version. It begins corrupted and ends corrupted.', reference: 'Nier: Automata — final route. Undertale — Hopes and Dreams.' },
];

export const SOUND_DESIGN = [
  { label: 'Hexa — Base Form', desc: "A soft harmonic hum that shifts pitch with movement speed. The 'voice' of the protagonist — always present, always subtle." },
  { label: 'Form Shifting', desc: 'Each transformation has a distinct signature. Circle: smooth resonant ring. Triangle: sharp metallic click. Square: low satisfying thud. Chaos forms: a broken, reversed version of a clean form.' },
  { label: 'Corruption Creep', desc: 'As zones corrupt, the ambient layer gains a ghost track — a slightly detuned, slightly delayed echo of the clean zone music. The further into corruption, the louder the ghost.' },
  { label: 'Irregular Enemies', desc: 'No enemy has a consistent audio pattern. Their sound design is procedurally distorted — the same base sounds, rearranged unpredictably each encounter.' },
];

export const LORE_ENTRIES = [
  {
    id: 'geo-history',
    category: 'World Lore',
    title: 'The Founding of Geometria',
    locked: false,
    content:
      'Geometria was not always divided by shape. The earliest records in the Hexagon Archive describe a time when shapes were fluid — beings existed on a spectrum rather than in fixed categories. The Great Codification, a philosophical and political movement some 400 cycles ago, established the current system: shapes were assigned roles, territories, and social hierarchies based on their geometric form. It was described as an act of bringing order to chaos. To the Irregulars, it was an act of violence.',
  },
  {
    id: 'irregulars-origin',
    category: 'World Lore',
    title: 'The Origin of the Irregulars',
    locked: false,
    content:
      "The Irregulars are not a species. They are Shapes who were expelled, rejected, or simply could not conform to the geometric standard. Over generations, the psychological weight of shapelessness caused physical changes. The geometry of an Irregular is a record of their trauma. The more they were rejected, the more their form distorted. The Irregular Leader's body, now almost entirely shapeless, is the most extreme expression of this history.",
  },
  {
    id: 'hexa-gift',
    category: 'Character Lore',
    title: 'Why Hexa Can Shift',
    locked: false,
    content:
      "The Hexagon Archive contains a single entry about form-sensitivity — the ability of certain Hexagons to perceive and temporarily absorb geometric information from other shapes. It was considered a minor curiosity with no practical application. Hexa never thought twice about it. The Archive entry ends with a note: 'Theoretical use in inter-shape diplomacy. No recorded practical applications.' The Archivist finds this entry in Act II and is shaken by it.",
  },
  {
    id: 'great-codification',
    category: 'Historical',
    title: 'The Great Codification — Fragment',
    locked: false,
    content:
      '"Let each shape know its purpose, and in knowing its purpose, know its place. The Circle shall smooth the way between. The Triangle shall defend the boundary. The Square shall build the foundation. The Hexagon shall preserve the record. All others — those who cannot be defined, who resist the truth of their own geometry — shall be given time to find their form. Or they shall find their place beyond our borders." — The Codification Accord, Cycle 1, Author Unknown.',
  },
  {
    id: 'void-core-nature',
    category: 'World Lore',
    title: 'What Is the Void Core?',
    locked: true,
    content:
      "Unlocked in Act III. The Void Core is not simply an Irregular stronghold. It is the physical manifestation of what happens when a shape internalizes complete shapelessness — when the Irregular Leader's loss of defined form began to affect the surrounding geometry. The Core is, in a deeply literal sense, the Irregular Leader's grief made real.",
  },
  {
    id: 'hexa-family',
    category: 'Character Lore',
    title: "Hexa's Family — Who They Are",
    locked: true,
    content:
      "Unlocked when the first family member is found. Details on each family member's personality, what they experienced during captivity, and how their relationship with Hexa changes as a result. The partner, Prism, is a rare Hexagon-Circle hybrid — a being who exists between shapes. This is why the Irregulars specifically targeted them.",
  },
];
