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
