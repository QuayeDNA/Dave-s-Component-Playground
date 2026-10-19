import type {
  Command,
  Enemy,
  PixelRpgAction,
  PixelRpgState,
  Player,
  Rng,
} from './types';

const MAX_LOG = 30;
const MAGIC_COST = 4;
const MAGIC_MIN = 12;
const MAGIC_MAX = 15;
const FIGHT_MIN = 6;
const FIGHT_MAX = 10;
const ITEM_HEAL = 15;
const REVIVE_HP = 20;
const CHARGE_CHANCE = 0.3;

export const createInitialPlayer = (): Player => ({
  hp: 40,
  maxHp: 40,
  mp: 12,
  maxMp: 12,
  potions: 2,
  revives: 1,
});

const appendLog = (log: string[], ...entries: string[]): string[] =>
  [...log, ...entries].slice(-MAX_LOG);

const roll = (rng: Rng, min: number, max: number): number =>
  min + Math.floor(rng() * (max - min + 1));

const chooseIntent = (rng: Rng): Enemy['intent'] =>
  rng() < CHARGE_CHANCE ? 'charge' : 'attack';

const createEnemy = (wave: number, rng: Rng): Enemy => {
  const maxHp = 30 + (wave - 1) * 6;
  return {
    name: 'SLIME',
    level: wave + 2,
    hp: maxHp,
    maxHp,
    intent: chooseIntent(rng),
    charged: false,
  };
};

const nextEventId = (state: PixelRpgState): number =>
  (state.lastEvent?.id ?? 0) + 1;

const updateBestWave = (state: PixelRpgState): number =>
  Math.max(state.bestWave, state.wave);

const finishVictory = (state: PixelRpgState, message: string): PixelRpgState => ({
  ...state,
  phase: 'victory',
  message,
  log: appendLog(state.log, message),
  bestWave: updateBestWave(state),
});

export const canCastMagic = (state: PixelRpgState): boolean =>
  state.player.mp >= MAGIC_COST;

export const canUseItem = (state: PixelRpgState): boolean =>
  state.player.potions > 0;

export const isCommandEnabled = (state: PixelRpgState, command: Command): boolean => {
  if (state.phase !== 'playerTurn') return false;
  if (command === 'MAGIC') return canCastMagic(state);
  if (command === 'ITEM') return canUseItem(state);
  return true;
};

export const intentLabel = (enemy: Enemy): 'CHARGING' | 'RELEASE' | 'ATTACK' => {
  if (enemy.charged) return 'RELEASE';
  return enemy.intent === 'charge' ? 'CHARGING' : 'ATTACK';
};

export const enemyHpPercent = (enemy: Enemy): number =>
  Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));

export const createInitialState = (bestWave = 0, rng: Rng = Math.random): PixelRpgState => {
  const enemy = createEnemy(1, rng);
  const message =
    enemy.intent === 'charge'
      ? 'A wild slime appears! It is winding up a heavy blow.'
      : 'A wild slime appears!';

  return {
    phase: 'intro',
    wave: 1,
    player: createInitialPlayer(),
    enemy,
    log: [message],
    message,
    lastEvent: null,
    bestWave,
  };
};

const resolveCommand = (
  state: PixelRpgState,
  command: Command,
  rng: Rng,
): PixelRpgState => {
  if (state.phase !== 'playerTurn') return state;

  if (command === 'MAGIC' && !canCastMagic(state)) {
    const message = 'Not enough MP. Magic costs 4 MP.';
    return { ...state, message, log: appendLog(state.log, message) };
  }

  if (command === 'ITEM' && !canUseItem(state)) {
    const message = 'No potions left.';
    return { ...state, message, log: appendLog(state.log, message) };
  }

  if (command === 'RUN') {
    if (rng() < 0.5) {
      return finishVictory(state, 'You slip past the slime.');
    }
    const message = 'You try to run... but the slime blocks the road!';
    return {
      ...state,
      phase: 'resolving',
      message,
      log: appendLog(state.log, message),
    };
  }

  if (command === 'FIGHT') {
    const damage = roll(rng, FIGHT_MIN, FIGHT_MAX);
    const enemy = { ...state.enemy, hp: Math.max(0, state.enemy.hp - damage) };
    const message = `You strike the slime for ${damage}.`;
    const next: PixelRpgState = {
      ...state,
      enemy,
      message,
      lastEvent: {
        id: nextEventId(state),
        kind: 'damage',
        target: 'enemy',
        value: damage,
      },
    };

    if (enemy.hp <= 0) return finishVictory(next, message);
    return { ...next, phase: 'resolving', log: appendLog(state.log, message) };
  }

  if (command === 'MAGIC') {
    const damage = roll(rng, MAGIC_MIN, MAGIC_MAX);
    const player = { ...state.player, mp: state.player.mp - MAGIC_COST };
    const enemy = { ...state.enemy, hp: Math.max(0, state.enemy.hp - damage) };
    const message = `Magic bursts for ${damage}!`;
    const next: PixelRpgState = {
      ...state,
      player,
      enemy,
      message,
      lastEvent: {
        id: nextEventId(state),
        kind: 'damage',
        target: 'enemy',
        value: damage,
      },
    };

    if (enemy.hp <= 0) return finishVictory(next, message);
    return { ...next, phase: 'resolving', log: appendLog(state.log, message) };
  }

  const healed = Math.min(ITEM_HEAL, state.player.maxHp - state.player.hp);
  const player = {
    ...state.player,
    hp: state.player.hp + healed,
    potions: state.player.potions - 1,
  };
  const message =
    healed > 0
      ? `You drink a potion. Recovered ${healed} HP.`
      : 'You drink a potion. HP is already full.';

  return {
    ...state,
    player,
    phase: 'resolving',
    message,
    log: appendLog(state.log, message),
    lastEvent: {
      id: nextEventId(state),
      kind: 'heal',
      target: 'player',
      value: healed,
    },
  };
};

const resolveEnemyTurn = (state: PixelRpgState, rng: Rng): PixelRpgState => {
  if (state.phase !== 'resolving') return state;

  if (state.enemy.intent === 'charge' && !state.enemy.charged) {
    const message = 'The slime is charging a heavy blow!';
    return {
      ...state,
      enemy: { ...state.enemy, intent: 'attack', charged: true },
      phase: 'playerTurn',
      message,
      log: appendLog(state.log, message),
    };
  }

  const doubled = state.enemy.charged;
  const base = roll(rng, 3 + Math.floor(state.wave / 2), 8 + Math.floor(state.wave / 2));
  const damage = doubled ? base * 2 : base;
  const message = doubled
    ? `The slime releases its charge for ${damage}!`
    : `The slime hits you for ${damage}.`;
  const hp = Math.max(0, state.player.hp - damage);
  const player = { ...state.player, hp };
  const enemy = { ...state.enemy, intent: chooseIntent(rng), charged: false };
  const next: PixelRpgState = {
    ...state,
    player,
    enemy,
    message,
    log: appendLog(state.log, message),
    lastEvent: {
      id: nextEventId(state),
      kind: 'damage',
      target: 'player',
      value: damage,
    },
  };

  if (hp > 0) return { ...next, phase: 'playerTurn' };

  if (player.revives > 0) {
    const reviveMessage = 'The fairy revives you! You are back with 20 HP.';
    return {
      ...next,
      player: { ...player, hp: REVIVE_HP, revives: player.revives - 1 },
      phase: 'playerTurn',
      message: reviveMessage,
      log: appendLog(next.log, reviveMessage),
    };
  }

  return { ...next, phase: 'defeat', bestWave: updateBestWave(state) };
};

const advanceWave = (state: PixelRpgState, rng: Rng): PixelRpgState => {
  if (state.phase !== 'victory') return state;

  const wave = state.wave + 1;
  const enemy = createEnemy(wave, rng);
  const message = `Wave ${wave}: a wild slime appears!`;

  return {
    ...state,
    phase: 'intro',
    wave,
    enemy,
    message,
    log: appendLog(state.log, message),
  };
};

export const reduce = (
  state: PixelRpgState,
  action: PixelRpgAction,
  rng: Rng = Math.random,
): PixelRpgState => {
  switch (action.type) {
    case 'INTRO_DONE':
      return state.phase === 'intro' ? { ...state, phase: 'playerTurn' } : state;
    case 'COMMAND':
      return resolveCommand(state, action.command, rng);
    case 'ENEMY_TURN':
      return resolveEnemyTurn(state, rng);
    case 'ADVANCE_WAVE':
      return advanceWave(state, rng);
    case 'RESTART':
      return createInitialState(state.bestWave, rng);
    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
};
