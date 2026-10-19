export type Phase = 'intro' | 'playerTurn' | 'resolving' | 'victory' | 'defeat';
export type EnemyIntent = 'attack' | 'charge';
export type Command = 'FIGHT' | 'MAGIC' | 'ITEM' | 'RUN';

export const COMMANDS: readonly Command[] = ['FIGHT', 'MAGIC', 'ITEM', 'RUN'];

export interface Enemy {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  intent: EnemyIntent;
  charged: boolean;
}

export interface Player {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  potions: number;
  revives: number;
}

export interface CombatEvent {
  id: number;
  kind: 'damage' | 'heal' | 'miss';
  target: 'player' | 'enemy';
  value: number;
}

export interface PixelRpgState {
  phase: Phase;
  wave: number;
  player: Player;
  enemy: Enemy;
  log: string[];
  message: string;
  lastEvent: CombatEvent | null;
  bestWave: number;
}

export type PixelRpgAction =
  | { type: 'INTRO_DONE' }
  | { type: 'COMMAND'; command: Command }
  | { type: 'ENEMY_TURN' }
  | { type: 'ADVANCE_WAVE' }
  | { type: 'RESTART' };

export type Rng = () => number;
