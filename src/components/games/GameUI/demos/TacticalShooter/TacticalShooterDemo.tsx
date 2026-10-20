import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGameKeys } from '../../shared/useGameKeys';
import styles from './tactical-shooter.module.css';

const MAX_HP = 100;
const MAX_ARMOR = 50;
const MAG_SIZE = 30;
const MAX_RESERVE = 90;
const RELOAD_STEPS = 20;
const RELOAD_STEP_MS = 50;
const RESPAWN_MS = 1600;
const FIRE_ANGLE = 4;
const YAW_LIMIT = 55;
const PIXELS_PER_DEGREE = 1.15;
const ENEMY_FIRE_MS = 2400;

interface Enemy {
  id: number;
  angle: number;
  distance: number;
  hp: number;
  maxHp: number;
  alive: boolean;
}

const INITIAL_ENEMIES: Enemy[] = [
  { id: 0, angle: -38, distance: 14, hp: 100, maxHp: 100, alive: true },
  { id: 1, angle: 8, distance: 31, hp: 100, maxHp: 100, alive: true },
  { id: 2, angle: 34, distance: 52, hp: 100, maxHp: 100, alive: true },
];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const enemyScreenX = (angle: number, yaw: number): number =>
  50 + (angle - yaw) * (100 / 110);

const enemyIsVisible = (angle: number, yaw: number): boolean => {
  const x = enemyScreenX(angle, yaw);
  return x > -10 && x < 110;
};

const cardinalLabel = (mark: number): string => {
  const normalized = ((mark % 360) + 360) % 360;
  if (normalized === 0) return 'N';
  if (normalized === 90) return 'E';
  if (normalized === 180) return 'S';
  if (normalized === 270) return 'W';
  return '';
};

const COMPASS_MARKS = Array.from({ length: 25 }, (_, index) => -180 + index * 15);

function EnemySilhouette(): React.ReactElement {
  return (
    <svg className={styles.silhouette} viewBox="0 0 40 64" aria-hidden="true">
      <path
        d="M20 3c4.4 0 7.5 3.1 7.5 7.4v3.2h-3.1l-1 4.4h-6.8l-1-4.4h-3.1v-3.2C12.5 6.1 15.6 3 20 3Z"
        fill="currentColor"
      />
      <path
        d="M12.8 18h14.4l4.1 9.4-3 3.1-2.1-4.2V47h-4.3l-1.9-8.8-1.9 8.8h-4.3V26.3l-2.1 4.2-3-3.1 4.1-9.4Z"
        fill="currentColor"
      />
      <path d="M8.4 30.8h4v17.4h-4zM27.6 30.8h4v17.4h-4z" fill="currentColor" opacity=".76" />
      <path d="M24.2 35.4h13.2v3.1H24.2z" fill="currentColor" opacity=".9" />
    </svg>
  );
}

export const TacticalShooterDemo: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const timeouts = useRef<number[]>([]);
  const reloadTimer = useRef<number | null>(null);
  const enemyFireTimer = useRef<number | null>(null);

  const [player, setPlayer] = useState({ hp: MAX_HP, armor: MAX_ARMOR });
  const [ammo, setAmmo] = useState({ mag: MAG_SIZE, reserve: MAX_RESERVE });
  const [kills, setKills] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>(INITIAL_ENEMIES);
  const [reloading, setReloading] = useState(false);
  const [reloadProgress, setReloadProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dead, setDead] = useState(false);
  const [message, setMessage] = useState('Hold the line.');
  const [muzzle, setMuzzle] = useState(false);
  const [hitmarker, setHitmarker] = useState(false);
  const [damageFlash, setDamageFlash] = useState(false);

  const enemiesRef = useRef(enemies);
  const yawRef = useRef(yaw);
  const pausedRef = useRef(paused);
  const deadRef = useRef(dead);

  enemiesRef.current = enemies;
  yawRef.current = yaw;
  pausedRef.current = paused;
  deadRef.current = dead;

  const clearTransientTimers = useCallback(() => {
    timeouts.current.forEach((timer) => window.clearTimeout(timer));
    timeouts.current = [];
    if (reloadTimer.current !== null) {
      window.clearInterval(reloadTimer.current);
      reloadTimer.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearTransientTimers();
      if (enemyFireTimer.current !== null) {
        window.clearInterval(enemyFireTimer.current);
      }
    },
    [clearTransientTimers],
  );

  useEffect(() => {
    enemyFireTimer.current = window.setInterval(() => {
      if (pausedRef.current || deadRef.current) return;

      const visible = enemiesRef.current.filter(
        (enemy) => enemy.alive && enemyIsVisible(enemy.angle, yawRef.current),
      );
      if (visible.length === 0) return;

      const shooter = visible[Math.floor(Math.random() * visible.length)];
      const damage = 4 + Math.floor(Math.random() * 5);

      setPlayer((current) => {
        const armor = Math.max(0, current.armor - damage);
        const overflow = Math.max(0, damage - current.armor);
        const hp = Math.max(0, current.hp - overflow);
        return { hp, armor };
      });
      setDamageFlash(true);
      setMessage(`HOSTILE ${shooter.id + 1} RETURN FIRE · -${damage}`);
      const timer = window.setTimeout(() => setDamageFlash(false), 260);
      timeouts.current.push(timer);
    }, ENEMY_FIRE_MS);

    return () => {
      if (enemyFireTimer.current !== null) {
        window.clearInterval(enemyFireTimer.current);
        enemyFireTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (player.hp > 0 || dead) return;
    setDead(true);
    setPaused(true);
    setReloading(false);
    setReloadProgress(0);
    setMuzzle(false);
    setHitmarker(false);
    setDamageFlash(false);
    setMessage('SIGNAL LOST · RESTART TO REDEPLOY');
    clearTransientTimers();
  }, [player.hp, dead, clearTransientTimers]);

  const yawFromPointer = (event: React.PointerEvent<HTMLDivElement>): number => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    return (ratio - 0.5) * 2 * YAW_LIMIT;
  };

  const fire = (heading = yaw): void => {
    if (paused || dead) return;
    if (reloading) {
      setMessage('RELOADING · HOLD THE LINE');
      return;
    }
    if (ammo.mag <= 0) {
      setMessage('MAGAZINE EMPTY · R TO RELOAD');
      return;
    }

    setAmmo((current) => ({ ...current, mag: current.mag - 1 }));
    setMuzzle(true);
    const muzzleTimer = window.setTimeout(() => setMuzzle(false), 90);
    timeouts.current.push(muzzleTimer);

    const target = enemies
      .filter((enemy) => enemy.alive && enemyIsVisible(enemy.angle, heading))
      .sort((a, b) => Math.abs(a.angle - heading) - Math.abs(b.angle - heading))[0];

    if (!target || Math.abs(target.angle - heading) > FIRE_ANGLE) {
      setMessage('MISS · ADJUST THE LINE');
      return;
    }

    const nextHp = Math.max(0, target.hp - 34);
    const killed = nextHp <= 0;

    setEnemies((current) =>
      current.map((enemy) =>
        enemy.id === target.id ? { ...enemy, hp: nextHp, alive: !killed } : enemy,
      ),
    );
    setHitmarker(true);
    const hitTimer = window.setTimeout(() => setHitmarker(false), 220);
    timeouts.current.push(hitTimer);

    if (killed) {
      setKills((current) => current + 1);
      setMessage(`HOSTILE ${target.id + 1} DOWN · REDEPLOYING`);
      const respawnTimer = window.setTimeout(() => {
        setEnemies((current) =>
          current.map((enemy) =>
            enemy.id === target.id ? { ...enemy, hp: enemy.maxHp, alive: true } : enemy,
          ),
        );
      }, RESPAWN_MS);
      timeouts.current.push(respawnTimer);
      return;
    }

    setMessage(`HIT · HOSTILE ${target.id + 1} · ${nextHp} HP`);
  };

  const startReload = (): void => {
    if (paused || dead || reloading) return;
    if (ammo.mag >= MAG_SIZE) {
      setMessage('MAGAZINE FULL');
      return;
    }
    if (ammo.reserve <= 0) {
      setMessage('NO RESERVE AMMO');
      return;
    }

    setReloading(true);
    setReloadProgress(0);
    setMessage('RELOADING');

    let progress = 0;
    reloadTimer.current = window.setInterval(() => {
      if (pausedRef.current || deadRef.current) return;

      progress = Math.min(100, progress + 100 / RELOAD_STEPS);
      setReloadProgress(progress);

      if (progress < 100) return;

      if (reloadTimer.current !== null) {
        window.clearInterval(reloadTimer.current);
        reloadTimer.current = null;
      }

      setAmmo((current) => {
        const needed = MAG_SIZE - current.mag;
        const loaded = Math.min(needed, current.reserve);
        return { mag: current.mag + loaded, reserve: current.reserve - loaded };
      });
      setReloading(false);
      setReloadProgress(0);
      setMessage('MAGAZINE READY');
    }, RELOAD_STEP_MS);
  };

  const togglePause = (): void => {
    if (dead) return;
    setPaused((current) => !current);
  };

  const aimBy = (delta: number): void => {
    if (paused || dead) return;
    setYaw((current) => clamp(current + delta, -YAW_LIMIT, YAW_LIMIT));
  };

  const resetRun = (): void => {
    clearTransientTimers();
    setPlayer({ hp: MAX_HP, armor: MAX_ARMOR });
    setAmmo({ mag: MAG_SIZE, reserve: MAX_RESERVE });
    setKills(0);
    setYaw(0);
    setEnemies(INITIAL_ENEMIES.map((enemy) => ({ ...enemy })));
    setReloading(false);
    setReloadProgress(0);
    setPaused(false);
    setDead(false);
    setMessage('Hold the line.');
    setMuzzle(false);
    setHitmarker(false);
    setDamageFlash(false);
  };

  useGameKeys(
    stageRef,
    {
      a: () => aimBy(-5),
      A: () => aimBy(-5),
      d: () => aimBy(5),
      D: () => aimBy(5),
      ArrowLeft: () => aimBy(-5),
      ArrowRight: () => aimBy(5),
      f: (event) => {
        if (!event.repeat) fire();
      },
      F: (event) => {
        if (!event.repeat) fire();
      },
      r: (event) => {
        if (!event.repeat) startReload();
      },
      R: (event) => {
        if (!event.repeat) startReload();
      },
      p: (event) => {
        if (!event.repeat) togglePause();
      },
      P: (event) => {
        if (!event.repeat) togglePause();
      },
      Escape: () => togglePause(),
    },
    { preventDefault: ['ArrowLeft', 'ArrowRight'] },
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (paused || dead) return;
    setYaw(yawFromPointer(event));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (paused || dead) return;
    if ((event.target as HTMLElement | null)?.closest('button')) return;
    const heading = yawFromPointer(event);
    setYaw(heading);
    fire(heading);
  };

  const visibleEnemies = enemies.filter(
    (enemy) => enemy.alive && enemyIsVisible(enemy.angle, yaw),
  );

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      role="group"
      aria-label="Wardline tactical shooter demo"
      aria-keyshortcuts="A D ArrowLeft ArrowRight F R P"
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.compass}>
          <div
            className={styles.compassTrack}
            style={{ transform: `translateX(${-yaw * PIXELS_PER_DEGREE}px)` }}
          >
            {COMPASS_MARKS.map((mark) => {
              const label = cardinalLabel(mark);
              return (
                <div
                  key={mark}
                  className={styles.compassMark}
                  style={{ left: `calc(50% + ${mark * PIXELS_PER_DEGREE}px)` }}
                >
                  <i data-major={mark % 45 === 0} />
                  {label && <span>{label}</span>}
                </div>
              );
            })}
          </div>
          <div className={styles.compassNeedle} />
        </div>
      </div>

      <div className={styles.heading} aria-hidden="true">
        HDG {String(Math.round((yaw + 360) % 360)).padStart(3, '0')}°
      </div>

      <div className={styles.hud}>
        <div className={styles.vitals}>
          <div className={styles.vital} data-kind="hp">
            <span>HP</span>
            <i>
              <b style={{ width: `${(player.hp / MAX_HP) * 100}%` }} />
            </i>
            <strong>{player.hp}</strong>
          </div>
          <div className={styles.vital} data-kind="armor">
            <span>ARMOR</span>
            <i>
              <b style={{ width: `${(player.armor / MAX_ARMOR) * 100}%` }} />
            </i>
            <strong>{player.armor}</strong>
          </div>
        </div>
      </div>

      <div className={styles.ammo} aria-label={`Magazine ${ammo.mag}, reserve ${ammo.reserve}`}>
        <strong>{ammo.mag}</strong>
        <span>/ {ammo.reserve} RESERVE</span>
        <div className={styles.kills}>
          KILLS <strong>{kills}</strong>
        </div>
      </div>

      {visibleEnemies.map((enemy) => {
        const x = enemyScreenX(enemy.angle, yaw);
        const scale = clamp(1.15 - enemy.distance / 70, 0.5, 1.15);
        return (
          <div
            key={enemy.id}
            className={styles.enemy}
            style={{ left: `${x}%` }}
            aria-hidden="true"
          >
            <div className={styles.nameplate}>
              HOSTILE {enemy.id + 1} · {enemy.distance}M
              <i>
                <b style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
              </i>
            </div>
            <div style={{ '--scale': scale } as React.CSSProperties}>
              <EnemySilhouette />
            </div>
          </div>
        );
      })}

      <div className={styles.crosshair} aria-hidden="true">
        <span className={styles.crosshairLines} />
      </div>
      <div className={styles.muzzle} data-on={muzzle} aria-hidden="true" />
      <div className={styles.hitmarker} data-on={hitmarker} aria-hidden="true">
        ✕
      </div>
      <div className={styles.damage} data-on={damageFlash} aria-hidden="true" />

      <div className={styles.message} role="status" aria-live="polite">
        {message}
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={() => fire()}>
          FIRE
        </button>
        <button type="button" onClick={startReload}>
          RELOAD
        </button>
        <button type="button" onClick={togglePause} aria-pressed={paused}>
          {paused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      <div className={styles.reloadBar} data-on={reloading} aria-hidden="true">
        <i style={{ width: `${reloadProgress}%` }} />
      </div>

      {dead ? (
        <div className={styles.overlay} role="alert">
          <div className={styles.overlayInner}>
            <p className={styles.overlayKicker}>SIGNAL LOST</p>
            <h3 className={styles.overlayTitle}>REDEPLOY</h3>
            <p className={styles.overlayText}>
              The line broke. Your armor and magazine reset when you go back in.
            </p>
            <div className={styles.overlayStats}>
              <div>
                KILLS
                <strong>{kills}</strong>
              </div>
              <div>
                HP
                <strong>0</strong>
              </div>
            </div>
            <button type="button" className={styles.overlayButton} onClick={resetRun}>
              RESTART RUN
            </button>
          </div>
        </div>
      ) : paused ? (
        <div className={styles.overlay} role="status">
          <div className={styles.overlayInner}>
            <p className={styles.overlayKicker}>PAUSED</p>
            <h3 className={styles.overlayTitle}>HOLD</h3>
            <p className={styles.overlayText}>The line is frozen. Resume when you are ready.</p>
            <button type="button" className={styles.overlayButton} onClick={togglePause}>
              RESUME
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
