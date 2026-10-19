export interface SpecimenSpec {
  id: string;
  index: number;
  total: number;
  title: string;
  genre: string;
  accent: string;
  description: string;
  inputHints: string[];
}

export const PIXEL_RPG_SPECIMEN: SpecimenSpec = {
  id: 'pixel-rpg',
  index: 1,
  total: 4,
  title: 'Slime Road',
  genre: 'TURN-BASED JRPG',
  accent: 'var(--t-world-violet)',
  description:
    'A pocket-sized turn-based encounter: four commands, one slime, and a road that keeps going.',
  inputHints: ['CLICK / TAP COMMANDS', 'ARROW KEYS MOVE FOCUS', '1–4 SHORTCUTS'],
};
