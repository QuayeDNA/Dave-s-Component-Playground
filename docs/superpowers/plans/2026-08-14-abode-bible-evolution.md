# Abode Bible Evolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Abode story bible (fill narrative gaps, build the interactive op map), add a production dev-tracker page, and add an Evidence Locker asset showcase — all backed by a data layer so the bible stays in sync with development.

**Architecture:** Extract all Abode content from `AbodePage.tsx` into typed data modules under `src/data/abode/`. The bible page becomes a pure renderer; a new shared UI module (`src/components/games/abode/ui.tsx`) holds primitives reused by the bible, the new Evidence Locker section, and the new dev-tracker page. The tracker reads the same data modules, so status updates in one file propagate everywhere.

**Tech Stack:** React 18 + TypeScript (strict), Vite 5, framer-motion 11, react-router-dom 6, Tailwind v4 utilities, lucide-react. No test framework — verification is `npm run build` (typecheck) and `npm run lint`.

## Global Constraints

- Path alias `@/` resolves to `./src` (vite.config.ts + tsconfig.app.json `paths`).
- TypeScript `strict`, `noUnusedLocals`, `noUnusedParameters` are ON — no unused imports/variables, or build fails.
- No test framework exists. The gate for each task is `npm run build` (must pass) and `npm run lint` (must not fail).
- Dossier visual language is mandatory for every new UI: colors `G/WARN/PALE/BG/SURF/BORD` from `src/data/abode/theme.ts`, fonts via the `FONTS` import, `.at/.ab/.am/.astamp` classes via the `CSS` string injected by each page's `<style>{FONTS + CSS}</style>`.
- All content lives in data modules. No game content may be hardcoded in components.
- The dev-tracker is reachable ONLY from the Abode bible page (`/games/abode`). No Sidebar or index entry.
- Git commits: one per task, message style matches repo (e.g. `feat: ...`, `refactor: ...`, `docs: ...`). LF→CRLF warnings are expected on Windows and are harmless.

---

### Task 1: Data foundation — theme + types

**Files:**
- Create: `src/data/abode/theme.ts`
- Create: `src/data/abode/types.ts`

**Interfaces:**
- Produces: `G, WARN, PALE, BG, SURF, BORD` (string hex), `FONTS` (string), `CSS` (string), `TITLE` (object with `name`, `romanised`, `translation`, `operation`, `draft`).
- Produces: status unions `FeatureStatus`, `StoryStatus`, `AssetStatus`, `MilestoneStatus`; order arrays `FEATURE_ORDER`, `STORY_ORDER`, `ASSET_ORDER`, `MILESTONE_ORDER`; weight maps `FEATURE_WEIGHTS`, `STORY_WEIGHTS`, `ASSET_WEIGHTS`, `MILESTONE_WEIGHTS`; helper `pct(values: number[]): number`; types `ResearchCat`, `AssetCategory`.

- [ ] **Step 1: Create `src/data/abode/theme.ts`**

```ts
export const G    = '#7ec87e'; // survival green
export const WARN = '#c8522a'; // blood orange / danger
export const PALE = '#c8b89a'; // aged paper
export const BG   = '#0f0d0a';
export const SURF = '#1a1610';
export const BORD = '#3d3020';

export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=VT323&display=swap');`;

export const CSS = `
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
  .abar-fill::after{content:'';position:absolute;inset:0;
    background:repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,.25) 6px,rgba(0,0,0,.25) 7px);}
  .ascan::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:98;
    background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.045) 3px,rgba(0,0,0,0.045) 4px);}
`;

export const TITLE = {
  name: 'Abɔde',
  romanised: 'ABƆDE',
  translation: 'AKAN / TWI: HOMELAND',
  operation: 'OPERATION: HOMELAND · GAME 02 OF 03',
  draft: '0.3',
};
```

- [ ] **Step 2: Create `src/data/abode/types.ts`**

```ts
export type FeatureStatus = 'concept' | 'inProgress' | 'built' | 'tested' | 'shipped';
export type StoryStatus = 'draft' | 'finalized' | 'locked';
export type AssetStatus = 'concept' | 'inProduction' | 'final' | 'integrated';
export type MilestoneStatus = 'planned' | 'active' | 'completed';

export const FEATURE_ORDER: FeatureStatus[] = ['concept', 'inProgress', 'built', 'tested', 'shipped'];
export const STORY_ORDER: StoryStatus[] = ['draft', 'finalized', 'locked'];
export const ASSET_ORDER: AssetStatus[] = ['concept', 'inProduction', 'final', 'integrated'];
export const MILESTONE_ORDER: MilestoneStatus[] = ['planned', 'active', 'completed'];

export const FEATURE_WEIGHTS: Record<FeatureStatus, number> = { concept: 0, inProgress: 0.35, built: 0.7, tested: 0.9, shipped: 1 };
export const STORY_WEIGHTS: Record<StoryStatus, number> = { draft: 0, finalized: 0.6, locked: 1 };
export const ASSET_WEIGHTS: Record<AssetStatus, number> = { concept: 0, inProduction: 0.5, final: 0.85, integrated: 1 };
export const MILESTONE_WEIGHTS: Record<MilestoneStatus, number> = { planned: 0, active: 0.5, completed: 1 };

export function pct(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100);
}

export type ResearchCat = 'Geography' | 'Culture & Language' | 'Military & Emergency' | 'Ancestral Beliefs' | 'Accuracy Charter';

export type AssetCategory =
  | 'Concept Art' | 'Character' | 'Environment' | 'UI' | 'Audio' | 'Map' | 'Reference';
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS (typecheck + vite build complete without errors).

- [ ] **Step 4: Commit**

```bash
git add src/data/abode/theme.ts src/data/abode/types.ts
git commit -m "feat: add Abode theme tokens and shared status types"
```

---

### Task 2: Content data modules

**Files:**
- Create: `src/data/abode/characters.ts`
- Create: `src/data/abode/zones.ts`
- Create: `src/data/abode/beats.ts`
- Create: `src/data/abode/systems.ts`
- Create: `src/data/abode/incidents.ts`
- Create: `src/data/abode/art.ts`
- Create: `src/data/abode/audio.ts`
- Create: `src/data/abode/research.ts`

**Interfaces:**
- Produces: `Personnel` + `PERSONNEL` + `STAT_LABELS`; `Zone` + `ZONES` + `ZoneVisual` + `ZONE_VISUALS`; `Beat` + `BeatType` + `BEATS` + `BEAT_COLORS` + `BEAT_TYPE_LABELS`; `SystemEntry` + `SYSTEMS`; `Incident` + `INCIDENTS`; `PALETTE_DATA` + `DESIGN_PRINCIPLES`; `AUDIO_ZONES` + `SOUND_DESIGN`; `RESEARCH_CATEGORIES` + `RESEARCH_CATEGORY_COLORS` + `RESEARCH_ENTRIES` + `ResearchEntry`.
- Consumes: theme tokens (`G`, `WARN`, `PALE`), `ResearchCat` type from `types.ts`.

Note: all content below is moved verbatim from `AbodePage.tsx` EXCEPT the items explicitly rewritten with new story content (antagonist, Stage 4 zombie, Akosua, Act III location/intel).

- [ ] **Step 1: Create `src/data/abode/characters.ts`**

```ts
import { G, WARN } from './theme';

export interface PersonnelStats {
  fitness: number; combat: number; resilience: number; fieldKnowledge: number; culturalKnowledge: number;
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  age: string;
  status: string;
  statusColor: string;
  description: string;
  details: string[];
  stats: PersonnelStats;
  notes: string[];
}

export const PERSONNEL: Personnel[] = [
  {
    id: 'KM-001', name: 'COL. KWAME MENSAH (RET.)', role: 'Protagonist', age: '62',
    status: 'Active', statusColor: G,
    description: "62 years old. Served in ECOMOG, UN peacekeeping in DRC, and two domestic crises. Retired to Tema with his two children after their mother died. On D-Day, separated from them at a checkpoint collapse. He is not a superhero — he moves deliberately, tires realistically, and every fight costs him. But he knows how to survive, how to read terrain, and how to keep his head while everything falls apart.",
    details: ['Age is a mechanic — experienced but not tireless', 'Military training: infantry, close-quarters, field medicine', 'Emotional blind spot: anything involving his children'],
    stats: { fitness: 55, combat: 88, resilience: 92, fieldKnowledge: 95, culturalKnowledge: 80 },
    notes: ["Military discipline overrides physical limits — until it doesn't", 'Emotional blind spot: anything involving his children', 'Best asset: 40 years of reading terrain and people'],
  },
  {
    id: 'AM-002', name: 'AMA MENSAH', role: 'Kwame\'s Daughter', age: '17',
    status: 'Located', statusColor: G,
    description: "17 years old. Found in Act II — she's been surviving on her own for weeks and has become capable and hardened. Their reunion is not a rescue. Ama doesn't need saving. She needs her father to acknowledge who she's become.",
    details: ["Knows things about the faction Kwame doesn't", 'Dynamic shifts: starts dependent, becomes partner', 'Her survival methods may have crossed moral lines Kwame struggles with'],
    stats: { fitness: 78, combat: 52, resilience: 85, fieldKnowledge: 48, culturalKnowledge: 72 },
    notes: ['Survived weeks alone — raw capability, no formal training', "Knows things about the faction that Kwame doesn't", "Dynamic with Kwame shifts: starts dependent, becomes partner"],
  },
  {
    id: 'KM-003', name: 'KOFI MENSAH', role: 'Kwame\'s Son', age: '12',
    status: 'Missing', statusColor: WARN,
    description: "12 years old. Location unknown at game start. Kofi's trail is the spine of the third act — and when he's found, the circumstances of his survival will reframe everything the player thought they knew.",
    details: ['Emotional anchor of the entire story', "His survival method is Act III's central revelation", 'His condition when found defines the emotional climax'],
    stats: { fitness: 42, combat: 12, resilience: 70, fieldKnowledge: 20, culturalKnowledge: 60 },
    notes: ["Survival method is Act III's central revelation", 'Resourcefulness is his only real asset', 'His condition when found defines the emotional climax'],
  },
  {
    id: 'YO-004', name: 'COL. YAW OPOKU (RET.)', role: 'Former Colonel — Faction Leader', age: '[REDACTED]',
    status: 'Hostile', statusColor: WARN,
    description: "A former colleague of Kwame's who chose order over people when the outbreak hit. In the 1990s they served together in ECOMOG, Liberia. At the Monrovia evacuation, Kwame loaded families against orders; Opoku enforced strict order and got his column through. He has carried that lesson for twenty-five years. Now his faction sorts the living and moves unaccompanied children north to a facility he calls the Ark. The children were not taken by accident.",
    details: ['Mirror of Kwame — same training, opposite choices', 'Believes he is doing the only rational thing', 'Shared history makes the final confrontation devastating'],
    stats: { fitness: 60, combat: 85, resilience: 88, fieldKnowledge: 92, culturalKnowledge: 75 },
    notes: ['Mirror of Kwame — same training, opposite choices', 'Served beside Kwame in ECOMOG, Liberia; they split over a single choice at Monrovia', 'Believes order, not compassion, is what saves people — the children are the seed he is preserving', 'Personal history makes the final confrontation devastating'],
  },
  {
    id: 'NPC-005', name: 'NURSE AKOSUA AMOAH', role: 'Recurring Survivor NPC', age: '34',
    status: 'Conditional', statusColor: '#e8c84a',
    description: "A nurse working out of a roadside clinic west of Accra. She treats Kwame's wounds on the Cape Coast route and becomes a recurring presence — her skill is the rarest resource in the game. Whether she survives depends on choices the player makes.",
    details: ['Medical knowledge is the rarest resource in the game', "Her survival or loss has cascading effects on Kwame's injury system", 'Name finalized from earlier placeholder'],
    stats: { fitness: 50, combat: 20, resilience: 80, fieldKnowledge: 65, culturalKnowledge: 90 },
    notes: ['Medical knowledge is the rarest resource in the game', "Her survival or loss has cascading effects on Kwame's injury system", 'First met at a roadside clinic west of Accra — her triage shapes Act II'],
  },
];

export const STAT_LABELS: Record<string, string> = {
  fitness: 'PHYSICAL FITNESS',
  combat: 'COMBAT CAPABILITY',
  resilience: 'EMOTIONAL RESILIENCE',
  fieldKnowledge: 'FIELD KNOWLEDGE',
  culturalKnowledge: 'CULTURAL KNOWLEDGE',
};
```

- [ ] **Step 2: Create `src/data/abode/zones.ts`**

```ts
import { WARN } from './theme';

export interface Zone {
  id: string;
  label: string;
  act: string;
  coords: { x: number; y: number };
  status: string;
  statusColor: string;
  threat: string;
  resources: string;
  intel: string;
  locations: string[];
}

export const ZONES: Zone[] = [
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
    threat: 'UNKNOWN — No reliable intelligence. Radio silence. The ground around the facility is different.',
    resources: 'Unknown. Possibly isolated community settlements.',
    intel: "Radio intercepts place a functioning facility north of Tamale — a repurposed teacher-training college running its own radio net. Survivor accounts from the convoy mention children being moved there. Kofi is among them. The dead near the site are not behaving like the dead elsewhere. The Ark, the faction calls it.",
    locations: ['Old teacher-training college (the Ark)', 'Tamale approach roads', 'Ark perimeter fence', '[CLASSIFIED]'],
  },
];

export interface ZoneVisual {
  zone: string; time: string; palette: string; feel: string;
}

export const ZONE_VISUALS: ZoneVisual[] = [
  { zone: 'Tema / Accra', time: 'Dusk → Night', palette: 'Red laterite dust, concrete grey, fire orange against dark sky', feel: 'Claustrophobic. The streets were built for cars, not refugees. Industrial scale makes survival feel small.' },
  { zone: 'Cape Coast Road', time: 'Dawn → Midday', palette: 'Pale sky blue overhead, green-brown roadside bush, bleached tarmac', feel: 'Exposed. The highway offers no cover. Distance is the only safety, and the road is very long.' },
  { zone: 'Kumasi District', time: 'Overcast / Midday', palette: 'Deep ochre market stalls, faded signage colors, concrete shadow', feel: 'Familiar turned wrong. A market full of life becomes a maze of threat. Memory makes it worse.' },
  { zone: 'Northern Interior', time: 'Night / Unknown', palette: 'Near-monochrome — dark greens, deep shadow, single light sources', feel: "Alien. Kwame doesn't know this territory. His military instincts work but his cultural map doesn't." },
];
```

- [ ] **Step 3: Create `src/data/abode/beats.ts`**

```ts
import { G, WARN, PALE } from './theme';

export type BeatType = 'incident' | 'intel' | 'contact' | 'objective' | 'personal';

export interface Beat {
  id: string; track: 'kwame' | 'ama'; type: BeatType;
  label: string; location: string; description: string;
  act: 'I' | 'II' | 'III'; known: boolean;
}

export const BEAT_COLORS: Record<BeatType, string> = {
  incident: WARN, intel: G, contact: '#e8c84a', objective: PALE, personal: '#a8c8e8',
};

export const BEAT_TYPE_LABELS: Record<BeatType, string> = {
  incident: 'THREAT', intel: 'INTEL', contact: 'CONTACT', objective: 'OBJECTIVE', personal: 'PERSONAL',
};

export const BEATS: Beat[] = [
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
  { id:'k10', track:'kwame', act:'III', type:'intel', known:true, label:'Full Picture Assembled', location:'Kumasi → North Road', description:"Ama's intelligence combined with Kwame's trail. For the first time, they know exactly what's happening, who is responsible, and where Kofi is. Col. Yaw Opoku. Kwame says nothing for a long moment." },
  { id:'k11', track:'kwame', act:'III', type:'objective', known:true, label:'North — Final Approach', location:'Northern Interior', description:"Father and daughter moving north together. The dynamic has shifted. Kwame follows Ama's route intel. She leads more than he does. He lets her." },
  { id:'k12', track:'kwame', act:'III', type:'incident', known:true, label:'Final Confrontation', location:'The Ark — Northern Region', description:"Kofi is found. He is alive. Inside the Ark's grounds, Col. Yaw Opoku is waiting — not surprised, not hiding. The confrontation happens. The ending is determined by choices Kwame has made across all three acts — not by a single decision at the end." },
];
```

- [ ] **Step 4: Create `src/data/abode/systems.ts`**

```ts
export interface SystemEntry {
  id: string;
  number: string;
  title: string;
  body: string;
}

export const SYSTEMS: SystemEntry[] = [
  { id: 'sys-inventory', number: '1.0', title: 'INVENTORY & EQUIPMENT SYSTEM',
    body: "Scavenged weapons (machetes, shotguns, repurposed tools), medical supplies, food, fuel. Weight limits force real decisions. Kwame can modify weapons using found parts. Local items: palm oil tins, dried fish (high calorie), kenkey wraps, sachet water." },
  { id: 'sys-endurance', number: '2.0', title: 'ENDURANCE & INJURY MODEL',
    body: "Stamina and injury system that reflects Kwame's age. Wounds persist between levels unless treated. Running costs stamina. Every encounter has an accumulating cost — by Act III, Kwame carries the whole game in his body." },
  { id: 'sys-rest', number: '3.0', title: 'BASE & REST PHASES',
    body: "Between levels: a compound, a school, an abandoned petrol station. Resource management, crafting, survivor NPC encounters. Decisions here create narrative branches that affect what help is available in later levels." },
  { id: 'sys-intel', number: '4.0', title: 'INTELLIGENCE GATHERING',
    body: "Kwame tracks his children through clues: a schoolbag, a survivor's account, a radio message in Twi. Fragments update a hand-drawn map that drives progression. He's searching — not following a waypoint." },
  { id: 'sys-culture', number: '5.0', title: 'CULTURAL TEXTURE',
    body: "NPCs speak in a mix of English, Twi, and pidgin. Inventory includes local staples. Enemies include human factions — bandits, military splinter groups, cult survivors. The world feels specifically Ghanaian." },
  { id: 'sys-zombie', number: '6.0', title: 'ZOMBIE STAGE SYSTEM',
    body: "Stage 1: Recently turned — fast, disoriented, responds to sound. Stage 2: Settled — slower, territorial, senses heat. Stage 3: Rooted — near-stationary, wide aggro radius, used as zone hazards. Stage 4: The Recalled — old dead that remember. They do not attack; they recognize, and they reproduce the voices of the living they loved. The game never confirms what they are." },
  { id: 'sys-stealth', number: '7.0', title: 'STEALTH & AVOIDANCE',
    body: "Kwame is 62 with limited stamina. Stealth is rewarded more than combat. Crouching, distraction, route planning. Killing every threat is not sustainable — and the game's resource system ensures the player feels this." },
  { id: 'sys-morality', number: '8.0', title: 'MORAL DECISION SYSTEM',
    body: "Helping or ignoring survivors affects the world state. Camps Kwame aided are different on a return pass. NPCs remember behavior. The world is a record of choices — not a score, but a quiet, accumulating consequence." },
];
```

- [ ] **Step 5: Create `src/data/abode/incidents.ts`**

```ts
export interface Incident {
  phase: string; title: string; location: string; body: string;
}

export const INCIDENTS: Incident[] = [
  {
    phase: '01', title: 'D-Day / The Separation', location: 'Tema Industrial Area, Accra',
    body: "The separation. Tutorial-as-chaos. Kwame fights through collapsing Tema to reach the last known location of his children's school bus. He finds it empty — but finds the first clue: Ama's notebook with a handwritten note. The city is falling. He has to move before it fully goes dark.",
  },
  {
    phase: '02', title: 'The Road North', location: 'Cape Coast Highway → Kumasi Outskirts',
    body: "Following the trail through increasingly hostile territory. Alliances and betrayals with survivor groups. Ama is found — not saved, found. She's been managing. The truth slowly surfaces: someone is using the outbreak for control, and the children didn't end up where they are by accident.",
  },
  {
    phase: '03', title: 'Reunion', location: 'The Ark, Northern Region',
    body: "Kwame and Ama track Kofi together to the facility the faction calls the Ark. The emotional weight of the full reunion is earned — each character has changed and the relationships have to be renegotiated, not just restored. The ending turns on a single choice: what Kwame does after the confrontation with Col. Yaw Opoku.",
  },
];
```

- [ ] **Step 6: Create `src/data/abode/art.ts`**

```ts
export const PALETTE_DATA = [
  { name: 'Laterite Red',   hex: '#c8522a', use: 'Soil / Danger / Wounds' },
  { name: 'Survival Green', hex: '#7ec87e', use: 'Radio / Night Vision / Hope' },
  { name: 'Aged Paper',     hex: '#c8b89a', use: 'UI Text / Warm Light Sources' },
  { name: 'Concrete Grey',  hex: '#6a6258', use: 'Urban Decay / Dead Zones' },
  { name: 'Deep Shadow',    hex: '#1a1610', use: 'Night / Interior Threat' },
  { name: 'Rust Orange',    hex: '#8b4a1a', use: 'Fire / Structural Decay' },
  { name: 'Pale Sky',       hex: '#8ab0b8', use: 'Daylight Outdoors / Safe Zones' },
  { name: 'Void Black',     hex: '#080604', use: 'Deepest Shadow / Cut Scenes' },
];

export const DESIGN_PRINCIPLES = [
  { n: '01', title: 'Every Level is a Real Place', body: "Each zone must be recognizable as a specific Ghanaian location. Tema's planned grid streets feel different from Osu's organic density. Kumasi's market architecture is distinct from coastal compounds. No generic city — this is Ghana." },
  { n: '02', title: 'Zombies Look Like Neighbors', body: "They're wearing everyday clothes: kente print shirts, office wear, school uniforms. The horror is recognition, not creature design. A child in a primary school uniform is the most disturbing enemy in the game. Don't flinch from it." },
  { n: '03', title: 'Night is a Resource Constraint', body: "Night levels: Kwame's flashlight, distant fires, phone screens glowing in dead hands. Darkness is not decorative — it limits the player's information and costs battery/fuel to fight. Stealth is rewarded over confrontation." },
  { n: '04', title: 'Health is a Physical State, Not a Bar', body: "Kwame's health shows in his performance. He breathes heavier, limps, moves slower. The screen doesn't go red — it desaturates. His hand shakes on the weapon. The UI reflects what his body is doing, not a number." },
  { n: '05', title: 'The World Remembers What You Did', body: "Survivor camps Kwame helped look different on a return pass. Bodies he left unretrieved become hazards. NPC factions remember his behavior. The world is not a backdrop — it's a record of Kwame's choices." },
];
```

- [ ] **Step 7: Create `src/data/abode/audio.ts`**

```ts
export const AUDIO_ZONES = [
  {
    zone: 'Tema / Accra', act: 'Act I', color: '#c8522a',
    instruments: 'Distorted highlife guitar, industrial bass hum, broken percussion',
    tempo: 'Fast and chaotic — no consistent pulse. The world is falling apart.',
    mood: "Chaos and muscle memory. Kwame acts before he thinks. The city's sonic identity is breaking down in real time.",
    threat: 'Industrial drone overtakes the highlife guitar. The music becomes noise. Then silence.',
    ref: 'Ebo Taylor — corrupted. Ben Frost — Trauma. Lustmord — infrastructure collapse.',
    notes: 'The opening sequence should be sonically overwhelming. Then abruptly quiet when Kwame realizes the bus is empty.',
  },
  {
    zone: 'Cape Coast Road', act: 'Act I–II', color: '#8ab0b8',
    instruments: 'Sparse acoustic guitar, wind through abandoned cars, distant birds',
    tempo: 'Slow and directional. Forward momentum without comfort.',
    mood: "Desolation. The highway was built for movement — now it's just a very long, very exposed corridor.",
    threat: "At night: only wind and distant shuffling. The absence of music is the threat.",
    ref: 'Nils Frahm — Says. Jóhann Jóhannsson — quiet walking themes.',
    notes: 'Dawn and dusk sound completely different on this road. Dawn: bird calls, distant cock crow — normalcy that makes the silence wrong. Dusk: the light failing means something entirely different now.',
  },
  {
    zone: 'Kumasi Market District', act: 'Act II', color: '#e8c84a',
    instruments: 'Found percussion on market stalls, echo of voices, bass resonance in empty halls',
    tempo: "Syncopated — the rhythm keeps almost falling into something familiar, then doesn't.",
    mood: 'The memory of noise in a place that was built on sound. Kumasi central market at full capacity is deafening. Empty, it\'s its own kind of horror.',
    threat: 'When faction soldiers are near, the percussion becomes regimented. Military cadence bleeding into market rhythm.',
    ref: 'Tinariwen — sparse. Rokia Traoré — structural decay of melody.',
    notes: "Ama's theme is first heard here — a light melodic fragment, unresolved, like something half-remembered. It signals her presence before Kwame finds her evidence.",
  },
  {
    zone: 'Northern Interior', act: 'Act III', color: '#c8a8e8',
    instruments: 'Talking drum (transformed — slower, heavier), low choir, long silences',
    tempo: 'Slow to the point of discomfort. Beats spaced far apart.',
    mood: 'The weight of everything that led to this. Kwame and Ama moving north together. This is the point of no return.',
    threat: "Near the antagonist's location: the choir becomes dissonant. The drums stop. Only Kwame's breathing remains.",
    ref: 'Arvo Pärt — Spiegel im Spiegel. Jóhann Jóhannsson — The Sun\'s Gone Dim.',
    notes: "The final confrontation should have no score. Just environmental sound. Then silence. The emotional weight of the music was spent getting here — the moment itself doesn't need it.",
  },
];

export const SOUND_DESIGN = [
  { label: "Kwame's Breathing", body: "The primary health indicator. At full health: controlled, inaudible. As he tires or is injured: audible, labored. At critical: rasping. The player hears his age accumulating across the game. By Act III, even at full health, he breathes a little heavier than he did in Act I." },
  { label: 'Zombie Audio Design', body: "No roars, no classic horror sounds. Cloth rustling. Labored breathing. Familiar voices (occasionally) — a child, a woman calling a name. The uncanny horror is recognition. Stage 1: disoriented, vocalizing. Stage 2: quiet, focused. Stage 3: near-silent. The quieter they get, the more dangerous." },
  { label: 'Twi Radio Fragments', body: "Environmental storytelling. Fragments heard from car radios still running, phones with battery, distant buildings with generators. Some are official broadcasts. Some are personal. One, late in Act II, is a child's voice. It is not Kofi's — but the player won't know that immediately." },
  { label: 'Silence as Design Element', body: "After every significant combat encounter, there should be at least 8–12 seconds of near-silence. Wind. Kwame's breathing. The sound of him reloading or picking up a resource. This silence is mandatory — it prevents desensitization and makes the next threat feel real again." },
  { label: "The Antagonist's Audio Signature", body: "He sounds like Kwame used to sound. Controlled breathing, deliberate movement, no panic. When the two finally meet, the similarity in how they carry themselves should be audible. Same training. Completely different destinations." },
];
```

- [ ] **Step 8: Create `src/data/abode/research.ts`**

```ts
import { G, WARN } from './theme';
import type { ResearchCat } from './types';

export const RESEARCH_CATEGORIES: (ResearchCat | 'all')[] = ['all', 'Geography', 'Culture & Language', 'Military & Emergency', 'Ancestral Beliefs', 'Accuracy Charter'];

export const RESEARCH_CATEGORY_COLORS: Record<string, string> = {
  'Geography': '#8ab0b8', 'Culture & Language': G, 'Military & Emergency': WARN,
  'Ancestral Beliefs': '#c8a8e8', 'Accuracy Charter': '#e8c84a',
};

export interface ResearchEntry {
  id: string; category: ResearchCat; title: string; content: string;
}

export const RESEARCH_ENTRIES: ResearchEntry[] = [
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
```

- [ ] **Step 9: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/data/abode/
git commit -m "feat: extract Abode bible content into typed data modules with story gaps filled"
```

---

### Task 3: Development tracking + asset manifest data

**Files:**
- Create: `src/data/abode/development.ts`
- Create: `src/data/abode/assets.ts`

**Interfaces:**
- Produces: `Milestone` + `MILESTONES`; `SYSTEM_STATUS: Record<string, { status: FeatureStatus; notes: string }>`; `BEAT_STATUS: Record<string, { status: StoryStatus; notes?: string }>`; `AssetItem` + `ASSETS` (imports `AssetCategory` type).
- Consumes: types from `types.ts`.

- [ ] **Step 1: Create `src/data/abode/development.ts`**

```ts
import type { FeatureStatus, MilestoneStatus, StoryStatus } from './types';

export interface Milestone {
  id: string;
  title: string;
  summary: string;
  status: MilestoneStatus;
  notes: string;
  checklist: string[];
}

export const MILESTONES: Milestone[] = [
  {
    id: 'm1', title: 'Bible & Design Lock', status: 'active',
    summary: 'World bible finalized: story, systems, art and audio directives ratified.',
    notes: 'In progress — this polish pass pushes design documentation toward a locking state.',
    checklist: ['Story beats finalized across all three acts', 'Antagonist identity and rationale locked', 'Systems Manual ratified', 'Asset manifest defined'],
  },
  {
    id: 'm2', title: 'Vertical Slice', status: 'planned',
    summary: 'One playable level: D-Day / checkpoint collapse through the school bus discovery.',
    notes: 'Prove the core loop — scavenging, stamina, stealth, one stage of zombie threat.',
    checklist: ['Tema Industrial Area level', 'Kwame movement + stamina', 'Stage 1 zombie behavior', 'Ama notebook clue + objective flow'],
  },
  {
    id: 'm3', title: 'Playable Demo', status: 'planned',
    summary: 'Act I complete: Cape Coast route, survivor camp, first faction contact.',
    notes: '',
    checklist: ['Cape Coast Road level', 'Survivor camp + rest phase', 'Faction NPC encounters', 'Inventory + crafting pass'],
  },
  {
    id: 'm4', title: 'Alpha', status: 'planned',
    summary: 'All three acts playable end-to-end with placeholder art.',
    notes: '',
    checklist: ['Kumasi market district', 'Dual-track reunion sequence', 'The Recalled stage', 'The Ark / Act III confrontation'],
  },
  {
    id: 'm5', title: 'Beta', status: 'planned',
    summary: 'Content complete; bug fixing, balance, performance.',
    notes: '',
    checklist: ['Full art + audio integration', 'Balance pass on economy', 'Twi/English dialogue review'],
  },
  {
    id: 'm6', title: 'Launch', status: 'planned',
    summary: 'Release on target platforms.',
    notes: '',
    checklist: ['Platform certification', 'Marketing assets', 'Cultural accuracy sign-off'],
  },
];

export const SYSTEM_STATUS: Record<string, { status: FeatureStatus; notes: string }> = {
  'sys-inventory': { status: 'concept', notes: 'Economy and weight model designed; prototype pending.' },
  'sys-endurance': { status: 'concept', notes: 'Age-based stamina model described; tuning needed.' },
  'sys-rest':      { status: 'concept', notes: 'Rest-phase decisions outlined; branching defined.' },
  'sys-intel':     { status: 'concept', notes: 'Clue-tracking map spec\'d; UI mock needed.' },
  'sys-culture':   { status: 'concept', notes: 'Language mix and inventory flavor defined in bible.' },
  'sys-zombie':    { status: 'concept', notes: 'Stage 1–3 designed; Stage 4 (The Recalled) locked.' },
  'sys-stealth':   { status: 'concept', notes: 'Stealth-over-combat pillar described; gameplay test needed.' },
  'sys-morality':  { status: 'concept', notes: 'World-memory system spec\'d; state persistence pending.' },
};

export const BEAT_STATUS: Record<string, { status: StoryStatus; notes?: string }> = {
  k1: { status: 'finalized' }, k2: { status: 'finalized' }, k3: { status: 'finalized' }, k4: { status: 'finalized' },
  a1: { status: 'finalized' }, a2: { status: 'finalized' },
  k5: { status: 'finalized' }, k6: { status: 'finalized' }, k7: { status: 'finalized' }, k8: { status: 'finalized' },
  a3: { status: 'draft' }, a4: { status: 'draft' }, a5: { status: 'draft' },
  k9: { status: 'finalized' }, k10: { status: 'finalized' }, k11: { status: 'finalized' },
  k12: { status: 'finalized', notes: 'Ending branches depend on moral system states.' },
};
```

- [ ] **Step 2: Create `src/data/abode/assets.ts`**

```ts
import type { AssetCategory, AssetStatus } from './types';

export interface AssetItem {
  id: string;
  category: AssetCategory;
  name: string;
  status: AssetStatus;
  source: string;
  src?: string;
}

export const ASSETS: AssetItem[] = [
  { id: 'a-con-tema',   category: 'Concept Art', name: 'Tema Industrial Area — Dusk', status: 'concept', source: 'Reference: street photography of Tema industrial zone; 1950s plan drawings.', src: '/abode/concept-tema.png' },
  { id: 'a-con-cape',   category: 'Concept Art', name: 'Cape Coast Road — Dawn', status: 'concept', source: 'Reference: N1 highway photography; coastal vegetation studies.', src: '/abode/concept-cape-coast.png' },
  { id: 'a-con-kumasi', category: 'Concept Art', name: 'Kumasi Market District', status: 'inProduction', source: 'Reference: Kejetia market documentation; ochre palette study.', src: '/abode/concept-kumasi.png' },
  { id: 'a-con-ark',    category: 'Concept Art', name: 'The Ark — Northern Facility', status: 'concept', source: 'Reference: colonial-era teacher training colleges, Northern Region.', src: '/abode/concept-ark.png' },
  { id: 'a-ch-kwame',   category: 'Character', name: 'Col. Kwame Mensah', status: 'concept', source: 'Dossier KM-001. Reference: retired officer portraits; 60s West African military dress.' },
  { id: 'a-ch-ama',     category: 'Character', name: 'Ama Mensah', status: 'concept', source: 'Dossier AM-002. Reference: contemporary Accra youth photography.' },
  { id: 'a-ch-kofi',    category: 'Character', name: 'Kofi Mensah', status: 'concept', source: 'Dossier KM-003. School uniform studies.' },
  { id: 'a-ch-opoku',   category: 'Character', name: 'Col. Yaw Opoku', status: 'concept', source: 'Dossier YO-004. Mirror framing against Kwame.' },
  { id: 'a-ui-dossier', category: 'UI', name: 'Dossier Frame + Stamp Set', status: 'inProduction', source: 'This bible page is the live UI mock.' },
  { id: 'a-ui-map',     category: 'UI', name: 'Field Map + Clue Tracker', status: 'inProduction', source: 'Spec: Intelligence Gathering system 4.0.' },
  { id: 'a-snd-theme',  category: 'Audio', name: 'Highlife Decay — Act I Theme', status: 'concept', source: 'Ebo Taylor corrupted; Ben Frost Trauma.', src: '/abode/audio-act1-theme.mp3' },
  { id: 'a-snd-radio',  category: 'Audio', name: 'Twi Radio Fragments', status: 'concept', source: 'Scripted fragments; native speaker review required.' },
  { id: 'a-map-ghana',  category: 'Map', name: 'Operational Map — Ghana', status: 'inProduction', source: 'Live in bible section 06; hand-drawn SVG silhouette.' },
  { id: 'a-ref-photo',  category: 'Reference', name: 'Location Photography Pack', status: 'concept', source: 'Tema, Osu, Kejetia, Tamale street-level documentation.' },
];
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/abode/development.ts src/data/abode/assets.ts
git commit -m "feat: add Abode development tracker and asset manifest data"
```

---

### Task 4: Shared dossier UI module

**Files:**
- Create: `src/components/games/abode/ui.tsx`

**Interfaces:**
- Produces: `TodoPlaceholder`, `FieldNote`, `IntelCard`, `ManualEntry`, `MissionBrief` (moved verbatim from `AbodePage.tsx`), plus new `StatusChip` (`{ status: string }`) and `ProgressBar` (`{ value: number; color?: string }`).
- Consumes: theme tokens from `@/data/abode/theme`, `motion` from framer-motion.

- [ ] **Step 1: Create `src/components/games/abode/ui.tsx`**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { G, WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';

export const TodoPlaceholder: React.FC<{ title: string; notes?: string[] }> = ({ title, notes = [] }) => (
  <div style={{ background: SURF, border: `1px solid ${BORD}` }} className="relative overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2.5"
      style={{ background: `${WARN}15`, borderBottom: `1px solid ${WARN}28` }}>
      <span className="at" style={{ color: WARN, fontSize: '0.75rem', letterSpacing: '0.22em' }}>ACCESS RESTRICTED</span>
      <span className="am" style={{ color: PALE, fontSize: '0.52rem', letterSpacing: '0.18em', opacity: 0.38 }}>
        REF: {title.replace(/\s+/g, '-').toUpperCase().slice(0, 30)}
      </span>
    </div>
    <div className="p-6">
      <div className="space-y-3 mb-6">
        {[1, 0.62, 0.9, 0.68, 0.82].map((w, i) => (
          <div key={i} style={{
            height: i === 2 ? 20 : 11,
            background: BG,
            border: `1px solid ${BORD}44`,
            width: `${Math.round(w * 100)}%`,
          }} />
        ))}
      </div>
      <div className="flex justify-center my-6">
        <motion.div animate={{ opacity: [0.45, 0.7, 0.45] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="astamp" style={{ color: WARN, borderColor: WARN, fontSize: '0.8rem', letterSpacing: '0.28em', opacity: 1 }}>
            ASSET PENDING CLEARANCE
          </div>
        </motion.div>
      </div>
      {notes.length > 0 && (
        <div className="pt-4" style={{ borderTop: `1px dashed ${BORD}` }}>
          <div className="am mb-3" style={{ color: G, fontSize: '0.52rem', letterSpacing: '0.28em', opacity: 0.38 }}>
            FIELD REFERENCE DATA:
          </div>
          <div className="space-y-1.5">
            {notes.map((n, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="am flex-shrink-0" style={{ color: WARN, fontSize: '0.58rem', opacity: 0.42 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="am" style={{ color: PALE, fontSize: '0.62rem', opacity: 0.38, lineHeight: 1.6 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export const FieldNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ab leading-loose mb-4" style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem', lineHeight: 1.9 }}>{children}</div>
);

export const IntelCard: React.FC<{ category: string; content: string }> = ({ category, content }) => (
  <div style={{ background: SURF, border: `1px solid ${BORD}`, padding: '1.25rem' }}>
    <div className="am mb-2" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.25em', opacity: 0.55 }}>[{category.toUpperCase()}]</div>
    <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '0.95rem' }}>{content}</div>
  </div>
);

export const ManualEntry: React.FC<{ number: string; title: string; body: string }> = ({ number, title, body }) => (
  <motion.div className="mb-5 flex gap-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
    <div className="am flex-shrink-0" style={{ color: G, fontSize: '1.1rem', opacity: 0.35, width: 36, textAlign: 'right' }}>{number}</div>
    <div>
      <div className="at mb-1" style={{ color: G, fontSize: '1rem', letterSpacing: '0.05em' }}>{title}</div>
      <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '1rem' }}>{body}</div>
    </div>
  </motion.div>
);

export const MissionBrief: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div className="my-8 p-5" style={{ background: `${WARN}0a`, border: `1px solid ${WARN}30`, borderLeft: `3px solid ${WARN}` }}>
    <div className="am mb-2" style={{ color: WARN, fontSize: '0.8rem', letterSpacing: '0.3em', opacity: 0.7 }}>!! {label.toUpperCase()} !!</div>
    <p className="ab italic leading-relaxed" style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem' }}>{text}</p>
  </div>
);

export const STATUS_COLORS: Record<string, string> = {
  concept: '#6a6258', inProgress: '#e8c84a', built: G, tested: '#8ab0b8', shipped: '#57d68a',
  draft: '#6a6258', finalized: '#e8c84a', locked: G,
  inProduction: '#e8c84a', final: '#8ab0b8', integrated: G,
  planned: '#6a6258', active: '#e8c84a', completed: G,
};

export const STATUS_LABELS: Record<string, string> = {
  concept: 'CONCEPT', inProgress: 'IN PROGRESS', built: 'BUILT', tested: 'TESTED', shipped: 'SHIPPED',
  draft: 'DRAFT', finalized: 'FINALIZED', locked: 'LOCKED',
  inProduction: 'IN PRODUCTION', final: 'FINAL', integrated: 'INTEGRATED',
  planned: 'PLANNED', active: 'ACTIVE', completed: 'COMPLETED',
};

export const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const color = STATUS_COLORS[status] || PALE;
  return (
    <span className="am inline-block px-2 py-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color, border: `1px solid ${color}`, opacity: 0.85 }}>
      {STATUS_LABELS[status] || status.toUpperCase()}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = G }) => (
  <div className="abar-track">
    <div className="abar-fill" style={{ background: color, width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/abode/ui.tsx
git commit -m "feat: add shared Abode dossier UI primitives (status chips, progress bars)"
```

---

### Task 5: Refactor AbodePage.tsx to data-driven

**Files:**
- Modify: `src/components/games/AbodePage.tsx`

**Interfaces:**
- Consumes: `G, WARN, PALE, BG, SURF, BORD, FONTS, CSS, TITLE` from `@/data/abode/theme`; `PERSONNEL` + `STAT_LABELS` from `@/data/abode/characters`; `ZONE_VISUALS` from `@/data/abode/zones`; `BEATS, BEAT_COLORS, BEAT_TYPE_LABELS` from `@/data/abode/beats`; `SYSTEMS` from `@/data/abode/systems`; `PALETTE_DATA, DESIGN_PRINCIPLES` from `@/data/abode/art`; `AUDIO_ZONES, SOUND_DESIGN` from `@/data/abode/audio`; `RESEARCH_ENTRIES, RESEARCH_CATEGORIES, RESEARCH_CATEGORY_COLORS` from `@/data/abode/research`; `FieldNote, IntelCard, ManualEntry, MissionBrief` from `./abode/ui`.

All edits are surgical — the page's hooks, `StickyNav`, section primitives (`ASection`, `DossierCard`, `IncidentBlock`), and the interactive sub-components (`PersonnelComparison`, `DualTimeline`, `ArtDirective`, `AudioDirective`, `ResearchPanel`) stay in the file and only change their data source.

- [ ] **Step 1: Replace the imports + visual identity block**

Replace the top of the file (current lines 1–40) so that imports come first, the const blocks `G/WARN/PALE/BG/SURF/BORD`, `FONTS`, and `CSS` are removed, and data-module imports are added:

```tsx
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
import { FieldNote, IntelCard, ManualEntry, MissionBrief } from './abode/ui';
import { OpMap } from './abode/OpMap';
import { EvidenceLocker } from './abode/EvidenceLocker';
```

Keep the `SECTIONS` registry (lines 44–56) but change it to the following (12 sections):

```tsx
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
```

- [ ] **Step 2: Delete the moved data blocks**

Delete each of the following blocks from `AbodePage.tsx` (they now live in the data modules):
- The `ZONES` array (current lines ~264–305).
- The `PERSONNEL` array + `STAT_LABELS` map (current lines ~314–353).
- The `BeatType`, `Beat` interface, `BEAT_COLORS`, `BEAT_TYPE_LABELS`, and `BEATS` array (current lines ~435–473).
- `PALETTE_DATA`, `DESIGN_PRINCIPLES`, and `ZONE_VISUALS` (current lines ~582–606).
- `AUDIO_ZONES` and `SOUND_DESIGN` (current lines ~677–722).
- `ResearchCat`, `RESEARCH_ENTRIES` (current lines ~797–860).
- The `TodoPlaceholder` component definition (current lines ~114–164).

The sub-components (`PersonnelComparison`, `DualTimeline`, `ArtDirective`, `AudioDirective`, `ResearchPanel`) now resolve these names from the top-of-file imports instead of closure constants — no other change is needed to them except `ResearchPanel`, which is updated in Step 4.

- [ ] **Step 3: Update `ResearchPanel` to use the shared category data**

Replace the two lines in `ResearchPanel`:

```tsx
  const categories: (ResearchCat | 'all')[] = ['all', 'Geography', 'Culture & Language', 'Military & Emergency', 'Ancestral Beliefs', 'Accuracy Charter'];
```

and

```tsx
  const catColors: Record<string, string> = {
    'Geography': '#8ab0b8', 'Culture & Language': G, 'Military & Emergency': WARN,
    'Ancestral Beliefs': '#c8a8e8', 'Accuracy Charter': '#e8c84a',
  };
```

with:

```tsx
  const categories = RESEARCH_CATEGORIES;
```

and

```tsx
  const catColors = RESEARCH_CATEGORY_COLORS;
```

Keep the existing `ResearchCat` references (the type is still imported from `@/data/abode/research`? No — it is re-exported from `@/data/abode/types`; add `ResearchCat` to the research import):

```tsx
import { RESEARCH_ENTRIES, RESEARCH_CATEGORIES, RESEARCH_CATEGORY_COLORS } from '@/data/abode/research';
import type { ResearchCat } from '@/data/abode/types';
```

Note: `ResearchPanel`'s `useState<ResearchCat | 'all'>('all')` keeps compiling via the type import above.

- [ ] **Step 4: Replace the Personnel section to map over data**

Replace the body of the `personnel` section (currently five hardcoded `<DossierCard ... />` entries) with:

```tsx
        <ASection id="personnel" label="03 — Personnel Files" stamp="RESTRICTED">
          {PERSONNEL.map(p => (
            <DossierCard key={p.id} id={p.id} name={p.name} role={p.role} status={p.status}
              description={p.description} details={p.details} />
          ))}
        </ASection>
```

- [ ] **Step 5: Replace the Systems section to map over data**

Replace the body of the `systems` section (eight hardcoded `<ManualEntry ... />` entries) with:

```tsx
        <ASection id="systems" label="04 — Systems Manual" stamp="OPERATIONAL">
          {SYSTEMS.map(s => (
            <ManualEntry key={s.id} number={s.number} title={s.title} body={s.body} />
          ))}
        </ASection>
```

- [ ] **Step 6: Replace the Op Map section**

Replace the `opmap` section (currently renders a `TodoPlaceholder`) with:

```tsx
        <ASection id="opmap" label="06 — Operational Map" stamp="FIELD ANNOTATED">
          <OpMap />
        </ASection>
```

- [ ] **Step 7: Replace the Incident Log section to map over data**

Replace the body of the `incidents` section (three hardcoded `<IncidentBlock ... />` entries) with:

```tsx
        <ASection id="incidents" label="05 — Incident Log" stamp="CHRONOLOGICAL">
          {INCIDENTS.map(inc => (
            <IncidentBlock key={inc.phase} phase={inc.phase} title={inc.title} location={inc.location} body={inc.body} />
          ))}
        </ASection>
```

Add `INCIDENTS` to the imports in Step 1:

```tsx
import { INCIDENTS } from '@/data/abode/incidents';
```

- [ ] **Step 8: Add the Evidence Locker section**

After the `research` section, add:

```tsx
        <ASection id="locker" label="12 — Evidence Locker" stamp="ASSET REGISTRY">
          <EvidenceLocker />
        </ASection>
```

- [ ] **Step 9: Add the production tracker link to the top classification strip**

In the hero's top strip (currently `flex items-center justify-between` with back button + classification text), wrap the classification text and a new tracker button in a right-side flex container. Replace:

```tsx
            <div className="am" style={{ color: WARN, fontSize: '0.52rem', letterSpacing: '0.35em', opacity: 0.38 }}>
              TOP SECRET // SCI // NOFORN · REF: GH-ZB-MENSAH-02
            </div>
```

with:

```tsx
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
```

- [ ] **Step 10: Wire the hero + footer to the TITLE config and dynamic section count**

Replace the hero tagline block:

```tsx
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 0.1 }}
            className="am mb-5" style={{ color: WARN, fontSize: '0.62rem', letterSpacing: '0.48em' }}>
            OPERATION: HOMELAND · GAME 02 OF 03
          </motion.div>
```

with:

```tsx
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 0.1 }}
            className="am mb-5" style={{ color: WARN, fontSize: '0.62rem', letterSpacing: '0.48em' }}>
            {TITLE.operation}
          </motion.div>
```

Replace the `<motion.h1 ...>Abɔde</motion.h1>` text with `{TITLE.name}` and the translation line `[ AKAN / TWI: HOMELAND ]` with `[ {TITLE.translation} ]`.

Replace the bottom-strip draft line:

```tsx
              DRAFT 0.2 · ALL 11 SECTIONS
```

with:

```tsx
              DRAFT {TITLE.draft} · ALL {SECTIONS.length} SECTIONS
```

Replace the footer:

```tsx
          ABƆDE · DESIGN BIBLE · DRAFT 0.2 · ALL 11 SECTIONS COMPLETE
```

with:

```tsx
          {TITLE.romanised} · DESIGN BIBLE · DRAFT {TITLE.draft} · ALL {SECTIONS.length} SECTIONS COMPLETE
```

- [ ] **Step 11: Verify build + lint**

Run: `npm run build`
Expected: PASS (no unused imports — `G`, `WARN`, `PALE`, `BG`, `SURF`, `BORD` must all still be referenced somewhere in the page after the deletions; they are, in the remaining primitives and sections).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add src/components/games/AbodePage.tsx
git commit -m "refactor: drive Abode bible page from data modules, add tracker link and locker section"
```

---

### Task 6: Interactive Operational Map

**Files:**
- Create: `src/components/games/abode/OpMap.tsx`
- (Consumed by `AbodePage.tsx` via the import added in Task 5.)

**Interfaces:**
- Produces: `OpMap: React.FC` — an SVG field map with clickable zone nodes + intel detail panel.
- Consumes: `ZONES` (has `coords`, `statusColor`, `status`, `threat`, `resources`, `intel`, `locations`, `label`, `act`) from `@/data/abode/zones`; `IntelCard` from `./ui`; theme tokens.

- [ ] **Step 1: Create `src/components/games/abode/OpMap.tsx`**

```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { G, WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';
import { ZONES, Zone } from '@/data/abode/zones';
import { IntelCard } from './ui';

const GHANA_PATH = 'M 20 22 L 78 22 C 81 30 84 40 82 50 C 81 58 78 60 72 62 L 62 72 C 56 74 50 76 46 74 L 30 70 C 24 68 20 64 20 58 L 18 44 C 16 36 17 28 20 22 Z';

export const OpMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  return (
    <div>
      <div className="relative" style={{ border: `1px solid ${BORD}`, background: `${SURF}66`, padding: '1rem' }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="am" style={{ color: G, fontSize: '0.62rem', letterSpacing: '0.25em', opacity: 0.6 }}>FIELD MAP · GHANA — HAND-ANNOTATED</span>
          <span className="am" style={{ color: WARN, fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.4 }}>DISTORTED FOR ILLUSTRATION</span>
        </div>

        <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: 440 }}>
          <defs>
            <pattern id="mapgrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke={BORD} strokeOpacity="0.35" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#mapgrid)"/>
          <path d={GHANA_PATH} fill={`${SURF}88`} stroke={BORD} strokeWidth="0.8" strokeDasharray="2 1.4" />
          {ZONES.map(z => {
            const selected = activeZone?.id === z.id;
            return (
              <g key={z.id} onClick={() => setActiveZone(selected ? null : z)} style={{ cursor: 'pointer' }}>
                <circle cx={z.coords.x} cy={z.coords.y} r={selected ? 3.4 : 2.2}
                  fill={z.statusColor} fillOpacity={selected ? 0.95 : 0.7} stroke={BG} strokeWidth="0.4" />
                <line x1={z.coords.x - 6} y1={z.coords.y} x2={z.coords.x + 6} y2={z.coords.y} stroke={z.statusColor} strokeWidth="0.5" opacity="0.6"/>
                <line x1={z.coords.x} y1={z.coords.y - 6} x2={z.coords.x} y2={z.coords.y + 6} stroke={z.statusColor} strokeWidth="0.5" opacity="0.6"/>
                <text x={z.coords.x + 5} y={z.coords.y - 4} fill={PALE} fontSize="3" fontFamily="VT323, monospace" opacity="0.75" letterSpacing="0.3">
                  {z.label.split(' / ')[0]} · {z.act}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex flex-wrap gap-4 mt-3 pt-3" style={{ borderTop: `1px dashed ${BORD}` }}>
          {ZONES.map(z => (
            <button key={z.id} onClick={() => setActiveZone(activeZone?.id === z.id ? null : z)}
              className="am" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: z.statusColor, opacity: activeZone?.id === z.id ? 1 : 0.6 }}>
              ● {z.label} — {z.status}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeZone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="mt-4 p-5" style={{ background: SURF, border: `1px solid ${BORD}`, borderLeft: `3px solid ${activeZone.statusColor}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="am" style={{ color: activeZone.statusColor, fontSize: '0.7rem', letterSpacing: '0.25em' }}>{activeZone.label} · {activeZone.act}</span>
              <span className="am" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.35 }}>STATUS: {activeZone.status}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <IntelCard category="Threat" content={activeZone.threat} />
              <IntelCard category="Resources" content={activeZone.resources} />
            </div>
            <div className="mt-3">
              <div className="am mb-1" style={{ color: G, fontSize: '0.65rem', letterSpacing: '0.25em', opacity: 0.5 }}>INTEL</div>
              <p className="ab leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '0.95rem' }}>{activeZone.intel}</p>
            </div>
            <div className="mt-3 space-y-1" style={{ borderTop: `1px dashed ${BORD}`, paddingTop: '0.75rem' }}>
              {activeZone.locations.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="am" style={{ color: WARN, opacity: 0.45, fontSize: '0.7rem' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="ab" style={{ color: PALE, opacity: 0.65, fontSize: '0.9rem' }}>{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/abode/OpMap.tsx
git commit -m "feat: build interactive operational map for Abode bible"
```

---

### Task 7: Evidence Locker asset showcase

**Files:**
- Create: `src/components/games/abode/EvidenceLocker.tsx`
- (Consumed by `AbodePage.tsx` via the import added in Task 5.)

**Interfaces:**
- Produces: `EvidenceLocker: React.FC` — category-filtered asset grid; renders image/audio when `src` file loads, pending block when missing.
- Consumes: `ASSETS` (has `id`, `category`, `name`, `status`, `source`, optional `src`) from `@/data/abode/assets`; `StatusChip` from `./ui`; theme tokens.

- [ ] **Step 1: Create `src/components/games/abode/EvidenceLocker.tsx`**

```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { G, WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';
import { ASSETS } from '@/data/abode/assets';
import { StatusChip } from './ui';

const CATEGORIES = ['ALL', 'Concept Art', 'Character', 'UI', 'Audio', 'Map', 'Reference'];

export const EvidenceLocker: React.FC = () => {
  const [category, setCategory] = useState('ALL');
  const [missing, setMissing] = useState<Record<string, boolean>>({});

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
              <div className="relative aspect-video flex items-center justify-center overflow-hidden" style={{ background: BG, borderBottom: `1px solid ${BORD}` }}>
                {showFile ? (
                  a.category === 'Audio' ? (
                    <audio controls src={a.src} className="w-full px-3" onError={() => setMissing(m => ({ ...m, [a.id]: true }))} />
                  ) : (
                    <img src={a.src} alt={a.name} className="w-full h-full object-cover" onError={() => setMissing(m => ({ ...m, [a.id]: true }))} />
                  )
                ) : (
                  <span className="am" style={{ color: WARN, fontSize: '0.6rem', letterSpacing: '0.22em', opacity: 0.55 }}>ASSET PENDING CLEARANCE</span>
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
    </div>
  );
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/abode/EvidenceLocker.tsx
git commit -m "feat: add Evidence Locker asset showcase to Abode bible"
```

---

### Task 8: Dev tracker page + route

**Files:**
- Create: `src/components/games/abode/AbodeTrackerPage.tsx`
- Modify: `src/router/AppRouter.tsx`

**Interfaces:**
- Produces: `AbodeTrackerPage: React.FC` (default export) — production dashboard with computed progress + four tabs.
- Consumes: `TITLE`, theme tokens from `@/data/abode/theme`; `MILESTONES, SYSTEM_STATUS, BEAT_STATUS` from `@/data/abode/development`; `SYSTEMS` from `@/data/abode/systems`; `BEATS` from `@/data/abode/beats`; `ASSETS` from `@/data/abode/assets`; `FEATURE_WEIGHTS, STORY_WEIGHTS, ASSET_WEIGHTS, MILESTONE_WEIGHTS, pct` from `@/data/abode/types`; `StatusChip, ProgressBar, MissionBrief` from `./ui`.

- [ ] **Step 1: Create `src/components/games/abode/AbodeTrackerPage.tsx`**

```tsx
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
        <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => navigate('/games/abode')}
            className="flex items-center gap-2"
            style={{ color: WARN, opacity: 0.42 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.42')}>
            <ArrowLeft size={10} />
            <span className="am" style={{ fontSize: '0.58rem', letterSpacing: '0.3em' }}>RETURN TO BIBLE</span>
          </motion.button>
          <div className="am" style={{ color: WARN, fontSize: '0.52rem', letterSpacing: '0.35em', opacity: 0.38 }}>
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
```

- [ ] **Step 2: Register the route in `src/router/AppRouter.tsx`**

Add the lazy import after the `AbodePage` import (line 25):

```tsx
const AbodeTrackerPage = lazy(() => import('@/components/games/abode/AbodeTrackerPage'));
```

Add the route after the `games/abode` route (line 123):

```tsx
              <Route path="games/abode/dev-tracker" element={<Suspense fallback={<GamesFallback />}><AbodeTrackerPage /></Suspense>} />
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build`
Expected: PASS.
Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/games/abode/AbodeTrackerPage.tsx src/router/AppRouter.tsx
git commit -m "feat: add Abode production tracker page and route"
```

---

### Task 9: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 2: Full lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual smoke check**

Run: `npm run dev` and verify in the browser:
1. `/games/abode` renders all 12 sections; the Op Map shows the SVG Ghana silhouette and clicking each zone opens its intel panel.
2. The Evidence Locker shows "ASSET PENDING CLEARANCE" blocks for all assets (no files exist yet under `public/abode/`).
3. The top strip "OPEN PRODUCTION TRACKER" link navigates to `/games/abode/dev-tracker`.
4. The tracker shows computed percentages (SYSTEMS 0%, NARRATIVE ~61%, ASSETS ~11%, MILESTONES ~8%, overall ~20%), four working tabs with status filters, and the "RETURN TO BIBLE" link works.

- [ ] **Step 4: Commit any fix-ups**

```bash
git add -A
git commit -m "fix: final verification adjustments"
```
(Only run if verification surfaced changes.)
