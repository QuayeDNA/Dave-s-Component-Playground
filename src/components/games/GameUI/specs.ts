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

export const SURVIVAL_PACK_SPECIMEN: SpecimenSpec = {
  id: 'abode-backpack',
  index: 2,
  total: 4,
  title: 'Abəde Backpack',
  genre: 'DIEGETIC SURVIVAL',
  accent: 'var(--t-world-gold)',
  description:
    'A weight-limited pack, a pile of salvage, and a walk speed you can feel. Every kilogram is a decision.',
  inputHints: ['CLICK / TAP TO MOVE', 'DRAG BETWEEN ZONES', 'TAB + ENTER'],
};

export const TACTICAL_SHOOTER_SPECIMEN: SpecimenSpec = {
  id: 'wardline',
  index: 3,
  total: 4,
  title: 'Wardline',
  genre: 'TACTICAL SHOOTER',
  accent: 'var(--t-world-green)',
  description:
    'A projected-nameplate firefight: aim the line, manage the magazine, and keep your armor between you and the dark.',
  inputHints: ['POINTER / A D TO AIM', 'CLICK / F TO FIRE', 'R RELOAD · P PAUSE'],
};

export const RACING_SPECIMEN: SpecimenSpec = {
  id: 'apex-dash',
  index: 4,
  total: 4,
  title: 'Apex Dash',
  genre: 'ARCADE RACING',
  accent: 'var(--t-world-pink)',
  description:
    'A cockpit built around one number: how fast can you hold the line for three laps?',
  inputHints: ['W / S THROTTLE + BRAKE', 'SPACE BOOST', 'THREE LAPS'],
};

export const SPECIMENS: SpecimenSpec[] = [
  PIXEL_RPG_SPECIMEN,
  SURVIVAL_PACK_SPECIMEN,
  TACTICAL_SHOOTER_SPECIMEN,
  RACING_SPECIMEN,
];
