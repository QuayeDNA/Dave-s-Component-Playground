export type Zone =
  | 'ground'
  | 'lid'
  | 'main'
  | 'left'
  | 'right'
  | 'belt'
  | 'handLeft'
  | 'handRight';

export type Kind = 'food' | 'water' | 'med' | 'tool' | 'light' | 'signal' | 'ammo';

export interface Item {
  id: number;
  name: string;
  weight: number;
  kind: Kind;
  zone: Zone;
  rotation: string;
  quantity: number;
  condition: number;
  usable: boolean;
  active: boolean;
  note: string;
}

export interface Requirement {
  id: string;
  label: string;
  kind: Kind;
}

export const CAPACITY = 8;

export const ZONE_INFO: Record<Zone, { label: string; short: string; capacity: number }> = {
  ground: { label: 'On the ground', short: 'GROUND', capacity: Number.POSITIVE_INFINITY },
  lid: { label: 'Lid', short: 'LID', capacity: 2 },
  main: { label: 'Main compartment', short: 'MAIN', capacity: 6 },
  left: { label: 'Left pocket', short: 'LEFT', capacity: 1 },
  right: { label: 'Right pocket', short: 'RIGHT', capacity: 1 },
  belt: { label: 'Belt', short: 'BELT', capacity: 3 },
  handLeft: { label: 'Left hand', short: 'L HAND', capacity: 1 },
  handRight: { label: 'Right hand', short: 'R HAND', capacity: 1 },
};

export const ZONE_ORDER: Zone[] = [
  'ground',
  'lid',
  'main',
  'left',
  'right',
  'belt',
  'handLeft',
  'handRight',
];

const PACK_ZONES: Zone[] = ['main', 'lid', 'belt', 'left', 'right', 'handLeft', 'handRight'];

export const REQUIREMENTS: Requirement[] = [
  { id: 'water', label: 'WATER', kind: 'water' },
  { id: 'food', label: 'FOOD', kind: 'food' },
  { id: 'light', label: 'LIGHT', kind: 'light' },
  { id: 'med', label: 'MED', kind: 'med' },
  { id: 'tool', label: 'TOOL', kind: 'tool' },
  { id: 'signal', label: 'SIGNAL', kind: 'signal' },
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 0,
    name: 'Canned beans',
    weight: 0.8,
    kind: 'food',
    zone: 'main',
    rotation: '-2deg',
    quantity: 1,
    condition: 100,
    usable: true,
    active: false,
    note: 'One meal. The label is gone.',
  },
  {
    id: 1,
    name: 'Torch',
    weight: 0.6,
    kind: 'light',
    zone: 'handRight',
    rotation: '1deg',
    quantity: 1,
    condition: 70,
    usable: true,
    active: false,
    note: 'The switch sticks. Half a battery.',
  },
  {
    id: 2,
    name: 'Bandages',
    weight: 0.2,
    kind: 'med',
    zone: 'belt',
    rotation: '2deg',
    quantity: 3,
    condition: 100,
    usable: true,
    active: false,
    note: 'Clean enough. Three wraps.',
  },
  {
    id: 3,
    name: 'Radio',
    weight: 1.4,
    kind: 'signal',
    zone: 'main',
    rotation: '-1deg',
    quantity: 1,
    condition: 60,
    usable: true,
    active: false,
    note: 'The shelter frequency repeats under the static.',
  },
  {
    id: 4,
    name: 'Water',
    weight: 1.0,
    kind: 'water',
    zone: 'main',
    rotation: '0deg',
    quantity: 1,
    condition: 100,
    usable: true,
    active: false,
    note: 'A full canteen. It sloshes when you move.',
  },
  {
    id: 5,
    name: 'Crowbar',
    weight: 2.5,
    kind: 'tool',
    zone: 'ground',
    rotation: '-2deg',
    quantity: 1,
    condition: 100,
    usable: false,
    active: false,
    note: 'Heavy. Opens crates, doors, and arguments.',
  },
  {
    id: 6,
    name: 'Machete',
    weight: 1.8,
    kind: 'tool',
    zone: 'ground',
    rotation: '0deg',
    quantity: 1,
    condition: 100,
    usable: false,
    active: false,
    note: 'Quick. Loud when it leaves the sheath.',
  },
  {
    id: 7,
    name: 'Shells',
    weight: 0.4,
    kind: 'ammo',
    zone: 'ground',
    rotation: '2deg',
    quantity: 8,
    condition: 100,
    usable: false,
    active: false,
    note: 'Loose. They rattle with every step.',
  },
  {
    id: 8,
    name: 'Rope',
    weight: 1.2,
    kind: 'tool',
    zone: 'ground',
    rotation: '-1deg',
    quantity: 1,
    condition: 100,
    usable: false,
    active: false,
    note: 'Twelve meters of salvage.',
  },
  {
    id: 9,
    name: 'Medkit',
    weight: 1.5,
    kind: 'med',
    zone: 'ground',
    rotation: '1deg',
    quantity: 1,
    condition: 100,
    usable: true,
    active: false,
    note: 'Sealed. Better than bandages, heavier than a decision.',
  },
];

export const carriedItems = (items: Item[]): Item[] =>
  items.filter((item) => item.zone !== 'ground');

export const totalWeight = (items: Item[]): number =>
  carriedItems(items).reduce((total, item) => total + item.weight, 0);

export const zoneWeight = (items: Item[], zone: Zone): number =>
  items
    .filter((item) => item.zone === zone)
    .reduce((total, item) => total + item.weight, 0);

export const isFunctional = (item: Item): boolean => item.quantity > 0 && item.condition > 0;

export const loadLabel = (load: number): string =>
  load < 0.5 ? 'LIGHT' : load < 0.85 ? 'LOADED' : 'HEAVY';

export const isOffBalance = (items: Item[]): boolean =>
  Math.abs(zoneWeight(items, 'left') - zoneWeight(items, 'right')) > 1.2;

export const balancePercent = (items: Item[]): number => {
  const offset = zoneWeight(items, 'left') - zoneWeight(items, 'right');
  return 50 + Math.max(-1, Math.min(1, offset / 3)) * 40;
};

export const walkSpeed = (items: Item[]): number => {
  const load = totalWeight(items) / CAPACITY;
  const penalty = Math.max(0, load - 0.5) * 80;
  return Math.max(0, Math.round(100 - penalty - (isOffBalance(items) ? 5 : 0)));
};

export const requirementMet = (items: Item[], requirement: Requirement): boolean =>
  carriedItems(items).some((item) => item.kind === requirement.kind && isFunctional(item));

export const readinessCount = (items: Item[]): number =>
  REQUIREMENTS.filter((requirement) => requirementMet(items, requirement)).length;

export const placementError = (item: Item, to: Zone, items: Item[]): string | null => {
  if (item.zone === to) return null;
  if (to === 'ground') return null;

  const info = ZONE_INFO[to];
  const occupants = items.filter((candidate) => candidate.zone === to && candidate.id !== item.id);
  if (occupants.length >= info.capacity) return `${info.label} is full.`;

  if (to === 'belt' && item.weight > 1.0) {
    return `${item.name} is too bulky for the belt.`;
  }

  if (
    (to === 'handLeft' || to === 'handRight') &&
    !['tool', 'light', 'signal'].includes(item.kind)
  ) {
    return `${item.name} belongs in the pack.`;
  }

  const nextWeight =
    totalWeight(items) - (item.zone === 'ground' ? 0 : item.weight) + item.weight;
  if (nextWeight > CAPACITY + 1e-6) {
    return `Too heavy. Drop ${(nextWeight - CAPACITY).toFixed(1)} kg first.`;
  }

  return null;
};

export const firstOpenZone = (item: Item, items: Item[]): Zone | null => {
  for (const zone of PACK_ZONES) {
    if (!placementError(item, zone, items)) return zone;
  }
  return null;
};
