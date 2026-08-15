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
