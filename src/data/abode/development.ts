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
    id: 'm1', title: 'Bible & Design Lock', status: 'completed',
    summary: 'World bible finalized: story, systems, art and audio directives ratified.',
    notes: 'Complete — design documentation locked during the polish pass: title locked as THE LONG ROAD HOME, Field History added, hero direction ratified.',
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
  'sys-inventory': { status: 'built', notes: 'Economy, weight model and local item flavor specified and ratified in Systems Manual 1.0.' },
  'sys-endurance': { status: 'built', notes: 'Age-based stamina and persistent injury model specified and ratified in Systems Manual 2.0.' },
  'sys-rest':      { status: 'built', notes: 'Rest-phase resource management and branching defined and ratified in Systems Manual 3.0.' },
  'sys-intel':     { status: 'built', notes: 'Clue-tracking map spec ratified in Systems Manual 4.0; live mock in bible section 07.' },
  'sys-culture':   { status: 'built', notes: 'Language mix, inventory flavor and world texture defined and ratified in Systems Manual 5.0.' },
  'sys-zombie':    { status: 'built', notes: 'Stage 1-3 specified; Stage 4 (The Recalled) locked. Ratified in Systems Manual 6.0.' },
  'sys-stealth':   { status: 'built', notes: 'Stealth-over-combat pillar specified and ratified in Systems Manual 7.0.' },
  'sys-morality':  { status: 'built', notes: 'World-memory / consequence system spec ratified in Systems Manual 8.0.' },
};

export const BEAT_STATUS: Record<string, { status: StoryStatus; notes?: string }> = {
  k1: { status: 'finalized' }, k2: { status: 'finalized' }, k3: { status: 'finalized' }, k4: { status: 'finalized' },
  a1: { status: 'finalized' }, a2: { status: 'finalized' },
  k5: { status: 'finalized' }, k6: { status: 'finalized' }, k7: { status: 'finalized' }, k8: { status: 'finalized' },
  a3: { status: 'finalized' }, a4: { status: 'finalized' }, a5: { status: 'finalized' },
  k9: { status: 'finalized' }, k10: { status: 'finalized' }, k11: { status: 'finalized' },
  k12: { status: 'finalized', notes: 'Ending branches depend on moral system states.' },
};
