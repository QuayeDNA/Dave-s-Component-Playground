import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useGameKeys } from '../../shared/useGameKeys';
import { usePersistentState } from '../../shared/usePersistentState';
import { useReducedMotion } from '../../shared/useReducedMotion';
import { useTypewriter } from '../../shared/useTypewriter';
import {
  canCastMagic,
  canUseItem,
  createInitialState,
  enemyHpPercent,
  intentLabel,
  isCommandEnabled,
  reduce,
} from './logic';
import { COMMANDS } from './types';
import type { Command, PixelRpgAction, PixelRpgState } from './types';
import styles from './pixel-rpg.module.css';

const reducer = (state: PixelRpgState, action: PixelRpgAction): PixelRpgState =>
  reduce(state, action);

const COMMAND_LABELS: Record<Command, string> = {
  FIGHT: 'FIGHT',
  MAGIC: 'MAGIC',
  ITEM: 'ITEM',
  RUN: 'RUN',
};

const COMMAND_COSTS: Record<Command, string> = {
  FIGHT: '',
  MAGIC: '4MP',
  ITEM: '',
  RUN: '50%',
};

const Slime: React.FC<{ hit: boolean }> = ({ hit }) => (
  <svg className={styles.slime} data-hit={hit} viewBox="0 0 16 12" aria-hidden="true">
    <path d="M5 2h6v1h2v1h1v2h1v4H1V6h1V4h1V3h2z" fill="#5bd16b" />
    <rect x="4" y="5" width="2" height="2" fill="#10142c" />
    <rect x="10" y="5" width="2" height="2" fill="#10142c" />
    <rect x="5" y="3" width="2" height="1" fill="#b6f5be" />
  </svg>
);

export const PixelRpgDemo: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const commandRefs = useRef<Record<Command, HTMLButtonElement | null>>({
    FIGHT: null,
    MAGIC: null,
    ITEM: null,
    RUN: null,
  });
  const [bestWave, setBestWave] = usePersistentState<number>('pixel-rpg:best-wave', 0);
  const [state, dispatch] = useReducer(reducer, bestWave, (storedBest) =>
    createInitialState(Number.isFinite(storedBest) ? storedBest : 0),
  );
  const reducedMotion = useReducedMotion();
  const typewriter = useTypewriter(state.message, 16, !reducedMotion);
  const [showEvent, setShowEvent] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const eventId = state.lastEvent?.id ?? null;

  useEffect(() => {
    if (state.bestWave > bestWave) setBestWave(state.bestWave);
  }, [state.bestWave, bestWave, setBestWave]);

  useEffect(() => {
    if (eventId === null) return;
    setShowEvent(true);
    const timer = window.setTimeout(() => setShowEvent(false), 900);
    return () => window.clearTimeout(timer);
  }, [eventId]);

  useEffect(() => {
    setNotice(null);
  }, [state.message]);

  useEffect(() => {
    if (!typewriter.done) return;

    if (state.phase === 'intro') {
      const timer = window.setTimeout(() => dispatch({ type: 'INTRO_DONE' }), 550);
      return () => window.clearTimeout(timer);
    }

    if (state.phase === 'resolving') {
      const timer = window.setTimeout(() => dispatch({ type: 'ENEMY_TURN' }), 550);
      return () => window.clearTimeout(timer);
    }

    if (state.phase === 'victory') {
      const timer = window.setTimeout(() => dispatch({ type: 'ADVANCE_WAVE' }), 1200);
      return () => window.clearTimeout(timer);
    }

    return;
  }, [state.phase, typewriter.done]);

  const disabledReason = (command: Command): string | undefined => {
    if (state.phase !== 'playerTurn') return 'Wait for your turn.';
    if (command === 'MAGIC' && !canCastMagic(state)) return 'Not enough MP.';
    if (command === 'ITEM' && !canUseItem(state)) return 'No potions left.';
    return undefined;
  };

  const handleCommand = (command: Command) => {
    if (!typewriter.done) {
      typewriter.skip();
      return;
    }
    if (state.phase !== 'playerTurn') {
      setNotice('Wait for your turn.');
      return;
    }
    setNotice(null);
    dispatch({ type: 'COMMAND', command });
  };

  const moveFocus = (direction: 1 | -1) => {
    const enabled = COMMANDS.filter((command) => isCommandEnabled(state, command));
    if (enabled.length === 0) return;

    const active = document.activeElement;
    const currentIndex = enabled.findIndex(
      (command) => commandRefs.current[command] === active,
    );
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + direction + enabled.length) % enabled.length;
    const nextCommand = enabled[nextIndex];

    if (nextCommand) commandRefs.current[nextCommand]?.focus();
  };

  const activateFocused = () => {
    if (!typewriter.done) {
      typewriter.skip();
      return;
    }

    const active = document.activeElement;
    if (active instanceof HTMLButtonElement && stageRef.current?.contains(active)) {
      active.click();
      return;
    }

    const first = COMMANDS.find((command) => isCommandEnabled(state, command));
    if (first) commandRefs.current[first]?.click();
  };

  useGameKeys(
    stageRef,
    {
      ArrowLeft: () => moveFocus(-1),
      ArrowUp: () => moveFocus(-1),
      ArrowRight: () => moveFocus(1),
      ArrowDown: () => moveFocus(1),
      '1': () => handleCommand('FIGHT'),
      '2': () => handleCommand('MAGIC'),
      '3': () => handleCommand('ITEM'),
      '4': () => handleCommand('RUN'),
      Enter: activateFocused,
      ' ': activateFocused,
    },
    {
      preventDefault: ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Enter', ' '],
    },
  );

  const skipOnPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (typewriter.done) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button')) return;
    typewriter.skip();
  };

  const enemyHit =
    showEvent && state.lastEvent?.kind === 'damage' && state.lastEvent.target === 'enemy';
  const playerHit =
    showEvent && state.lastEvent?.kind === 'damage' && state.lastEvent.target === 'player';

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      role="group"
      aria-label="Slime Road combat demo"
      tabIndex={0}
      onPointerDown={skipOnPointerDown}
    >
      <div className={styles.stageInner}>
        <div className={styles.hud}>
          <span>WAVE {state.wave}</span>
          <span>BEST {state.bestWave.toString().padStart(2, '0')}</span>
        </div>

        <div className={styles.foe}>
          <div className={styles.foeName}>
            <span>
              {state.enemy.name} Lv{state.enemy.level}
            </span>
            <span
              className={styles.intent}
              data-intent={intentLabel(state.enemy).toLowerCase()}
            >
              {intentLabel(state.enemy)}
            </span>
          </div>
          <div className={styles.hpTrack} aria-hidden="true">
            <div
              className={styles.hpFill}
              style={{ width: `${enemyHpPercent(state.enemy)}%` }}
            />
          </div>
          <div className={styles.enemyHpText}>
            {state.enemy.hp} / {state.enemy.maxHp} HP
          </div>
          <Slime hit={enemyHit} />
          {enemyHit && state.lastEvent && (
            <span key={state.lastEvent.id} className={styles.damage} aria-hidden="true">
              -{state.lastEvent.value}
            </span>
          )}
        </div>

        <div className={styles.ui} data-shake={playerHit}>
          <div className={`${styles.box} ${styles.message}`}>
            <span aria-hidden="true">
              {notice ?? (typewriter.displayed || '\u00A0')}
            </span>
            <span className={styles.srOnly} aria-live="polite">
              {notice ?? state.message}
            </span>
          </div>

          <div className={styles.row}>
            <div
              className={`${styles.box} ${styles.menu}`}
              role="group"
              aria-label="Combat commands"
            >
              {COMMANDS.map((command) => {
                const enabled = isCommandEnabled(state, command);
                return (
                  <button
                    key={command}
                    ref={(node) => {
                      commandRefs.current[command] = node;
                    }}
                    type="button"
                    className={styles.command}
                    aria-disabled={!enabled}
                    title={disabledReason(command)}
                    onClick={() => handleCommand(command)}
                  >
                    {COMMAND_LABELS[command]}
                    {COMMAND_COSTS[command] && (
                      <span className={styles.commandCost}>{COMMAND_COSTS[command]}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className={`${styles.box} ${styles.status}`}>
              <div className={styles.statusTitle}>HERO</div>
              <div className={styles.statusRow}>
                <span>HP</span>
                <span>
                  <strong>{state.player.hp}</strong>/{state.player.maxHp}
                </span>
              </div>
              <div className={styles.statusRow}>
                <span>MP</span>
                <span>
                  <strong>{state.player.mp}</strong>/{state.player.maxMp}
                </span>
              </div>
              <div className={styles.statusRow}>
                <span>POTION</span>
                <span>
                  x<strong>{state.player.potions}</strong>
                </span>
              </div>
              <div className={styles.statusRow}>
                <span>FAIRY</span>
                <span>
                  x<strong>{state.player.revives}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {playerHit && state.lastEvent && (
          <span key={state.lastEvent.id} className={styles.damagePlayer} aria-hidden="true">
            -{state.lastEvent.value}
          </span>
        )}

        {state.phase === 'defeat' && (
          <div className={styles.overlay} role="alert">
            <div className={styles.overlayBox}>
              <div className={styles.overlayTitle}>RUN OVER</div>
              <div>You reached wave {state.wave}.</div>
              <div>Best wave: {state.bestWave.toString().padStart(2, '0')}</div>
              <button
                type="button"
                className={styles.overlayButton}
                onClick={() => dispatch({ type: 'RESTART' })}
              >
                RESTART RUN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
