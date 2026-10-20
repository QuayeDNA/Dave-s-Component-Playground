import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from '../../shared/useInView';
import { usePersistentState } from '../../shared/usePersistentState';
import styles from './racing.module.css';

const GEARS = [0, 60, 100, 145, 190, 235, 285];
const MAX_SPEED = 285;
const LAP_DISTANCE = 1200;
const TOTAL_LAPS = 3;
const BOOST_DRAIN = 0.3;
const BOOST_RECHARGE = 0.08;
const HUD_INTERVAL_MS = 80;

type Phase = 'racing' | 'finished';
type Control = 'gas' | 'brake' | 'boost';

interface Hud {
  speed: number;
  gear: number;
  rpm: number;
  lap: number;
  distance: number;
  lapTime: number;
  raceTime: number;
}

const INITIAL_HUD: Hud = {
  speed: 0,
  gear: 1,
  rpm: 0,
  lap: 1,
  distance: 0,
  lapTime: 0,
  raceTime: 0,
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const formatTime = (seconds: number): string => {
  const hundredths = Math.max(0, Math.round(seconds * 100));
  const minutes = Math.floor(hundredths / 6000);
  const remainder = (hundredths % 6000) / 100;
  return `${minutes}:${remainder.toFixed(2).padStart(5, '0')}`;
};

const CONTROL_LABELS: Record<Control, string> = {
  gas: 'GAS',
  brake: 'BRAKE',
  boost: 'BOOST',
};

export const RacingDemo: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);

  const [bestLap, setBestLap] = usePersistentState<number>('apex-dash:best-lap', 0);
  const [phase, setPhase] = useState<Phase>('racing');
  const [hud, setHud] = useState<Hud>(INITIAL_HUD);
  const [message, setMessage] = useState('LIGHTS OUT · THREE LAPS');
  const [held, setHeld] = useState<Record<Control, boolean>>({
    gas: false,
    brake: false,
    boost: false,
  });

  const speedRef = useRef(0);
  const gearRef = useRef(1);
  const boostRef = useRef(1);
  const distanceRef = useRef(0);
  const lapRef = useRef(1);
  const lapElapsedRef = useRef(0);
  const raceElapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const lastHudRef = useRef(0);
  const phaseRef = useRef<Phase>('racing');
  const bestLapRef = useRef(0);
  const gasRef = useRef(false);
  const brakeRef = useRef(false);
  const boostHeldRef = useRef(false);

  const bestLapValue = Number.isFinite(bestLap) && bestLap > 0 ? bestLap : 0;
  bestLapRef.current = bestLapValue;

  const setInput = useCallback((control: Control, value: boolean) => {
    if (control === 'gas') gasRef.current = value;
    if (control === 'brake') brakeRef.current = value;
    if (control === 'boost') boostHeldRef.current = value;
    setHeld((current) =>
      current[control] === value ? current : { ...current, [control]: value },
    );
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button')) return;

      const key = event.key.toLowerCase();
      if (key === 'w' || event.key === 'ArrowUp') {
        event.preventDefault();
        setInput('gas', true);
        return;
      }
      if (key === 's' || event.key === 'ArrowDown') {
        event.preventDefault();
        setInput('brake', true);
        return;
      }
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        setInput('boost', true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button')) return;

      const key = event.key.toLowerCase();
      if (key === 'w' || event.key === 'ArrowUp') setInput('gas', false);
      if (key === 's' || event.key === 'ArrowDown') setInput('brake', false);
      if (event.key === ' ' || event.key === 'Spacebar') setInput('boost', false);
    };

    stage.addEventListener('keydown', handleKeyDown);
    stage.addEventListener('keyup', handleKeyUp);
    return () => {
      stage.removeEventListener('keydown', handleKeyDown);
      stage.removeEventListener('keyup', handleKeyUp);
    };
  }, [setInput]);

  useEffect(() => {
    if (!inView) {
      lastTimeRef.current = null;
      return;
    }

    let frame = 0;

    const tick = (time: number): void => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (phaseRef.current === 'racing') {
        const gas = gasRef.current;
        const brake = brakeRef.current;
        let speed = speedRef.current;
        let gear = gearRef.current;
        let boost = boostRef.current;

        const boosting = boostHeldRef.current && boost > 0 && gas;
        const rpm = speed / GEARS[gear];

        if (rpm > 0.97 && gear < 6) {
          gear += 1;
        } else if (gear > 1 && speed < GEARS[gear - 1] * 0.8) {
          gear -= 1;
        }

        const currentRpm = speed / GEARS[gear];
        const accel =
          (gas ? (1 - currentRpm * 0.55) * 70 * (boosting ? 1.7 : 1) : 0) -
          speed * 0.12 -
          (brake ? 150 : 0);

        speed = clamp(speed + accel * dt, 0, MAX_SPEED);
        boost = boosting
          ? Math.max(0, boost - BOOST_DRAIN * dt)
          : Math.min(1, boost + BOOST_RECHARGE * dt);

        distanceRef.current += (speed / 3.6) * dt;
        lapElapsedRef.current += dt;
        raceElapsedRef.current += dt;

        const lapTarget = lapRef.current * LAP_DISTANCE;

        if (distanceRef.current >= lapTarget) {
          const lapTime = lapElapsedRef.current;

          if (bestLapRef.current === 0 || lapTime < bestLapRef.current) {
            bestLapRef.current = lapTime;
            setBestLap(lapTime);
          }

          if (lapRef.current >= TOTAL_LAPS) {
            phaseRef.current = 'finished';
            speed = 0;
            setPhase('finished');
            setMessage(`RACE COMPLETE · ${formatTime(raceElapsedRef.current)}`);
            setHud({
              speed: 0,
              gear,
              rpm: 0,
              lap: TOTAL_LAPS,
              distance: distanceRef.current,
              lapTime,
              raceTime: raceElapsedRef.current,
            });
          } else {
            lapRef.current += 1;
            lapElapsedRef.current = 0;
            setMessage(
              `LAP ${lapRef.current} OF ${TOTAL_LAPS} · ${formatTime(lapTime)}`,
            );
          }
        }

        speedRef.current = speed;
        gearRef.current = gear;
        boostRef.current = boost;

        const stage = stageRef.current;
        if (stage) {
          stage.style.setProperty('--speed', String(speed));
          stage.style.setProperty('--arc', String((speed / MAX_SPEED) * 66.67));
          stage.style.setProperty(
            '--needle',
            `${-120 + (speed / MAX_SPEED) * 240}deg`,
          );
          stage.style.setProperty('--boost-pct', `${boost * 100}%`);
          stage.style.setProperty('--road', `${(distanceRef.current * 1.8) % 80}px`);
        }

        if (time - lastHudRef.current >= HUD_INTERVAL_MS) {
          lastHudRef.current = time;
          setHud({
            speed,
            gear,
            rpm: clamp(speed / GEARS[gear], 0, 1),
            lap: lapRef.current,
            distance: distanceRef.current,
            lapTime: lapElapsedRef.current,
            raceTime: raceElapsedRef.current,
          });
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, setBestLap]);

  const restart = (): void => {
    speedRef.current = 0;
    gearRef.current = 1;
    boostRef.current = 1;
    distanceRef.current = 0;
    lapRef.current = 1;
    lapElapsedRef.current = 0;
    raceElapsedRef.current = 0;
    lastTimeRef.current = null;
    lastHudRef.current = 0;
    phaseRef.current = 'racing';
    gasRef.current = false;
    brakeRef.current = false;
    boostHeldRef.current = false;

    setHeld({ gas: false, brake: false, boost: false });
    setPhase('racing');
    setHud(INITIAL_HUD);
    setMessage('LIGHTS OUT · THREE LAPS');

    const stage = stageRef.current;
    if (stage) {
      stage.style.setProperty('--speed', '0');
      stage.style.setProperty('--arc', '0');
      stage.style.setProperty('--needle', '-120deg');
      stage.style.setProperty('--boost-pct', '100%');
      stage.style.setProperty('--road', '0px');
    }
  };

  const holdProps = (control: Control) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setInput(control, true);
    },
    onPointerUp: () => setInput(control, false),
    onPointerLeave: () => setInput(control, false),
    onPointerCancel: () => setInput(control, false),
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setInput(control, true);
    },
    onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setInput(control, false);
    },
  });

  const lapProgress =
    phase === 'finished'
      ? 100
      : clamp(((hud.distance % LAP_DISTANCE) / LAP_DISTANCE) * 100, 0, 100);

  const gaugeTicks = Array.from({ length: 15 }, (_, index) => index * 20);

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      role="group"
      aria-label="Apex Dash arcade racing demo"
      aria-keyshortcuts="W S ArrowUp ArrowDown Space"
      tabIndex={0}
    >
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.sky} />
        <div className={styles.road} />
        <div className={styles.speedLines} />
      </div>

      <div className={styles.progress} aria-hidden="true">
        <i style={{ width: `${lapProgress}%` }} />
      </div>

      <div className={styles.hud}>
        <div className={styles.lap}>
          LAP <strong>{Math.min(hud.lap, TOTAL_LAPS)}</strong> / {TOTAL_LAPS}
        </div>
        <div className={styles.times}>
          <div>
            LAP
            <span>{formatTime(hud.lapTime)}</span>
          </div>
          <div>
            RACE
            <span>{formatTime(hud.raceTime)}</span>
          </div>
          <div data-best="true">
            BEST
            <span>{bestLapValue > 0 ? formatTime(bestLapValue) : '--:--.--'}</span>
          </div>
        </div>
      </div>

      <div className={styles.topRight} aria-hidden="true">
        <div className={styles.speedReadout}>{Math.round(hud.speed)}</div>
        <div className={styles.speedUnit}>KM/H</div>
        <div className={styles.gearReadout}>
          GEAR <strong>{hud.gear}</strong>
        </div>
      </div>

      <div className={styles.dash} aria-hidden="true">
        <div className={styles.gauge}>
          <svg className={styles.gaugeSvg} viewBox="0 0 100 100">
            <circle
              className={styles.gaugeBase}
              cx="50"
              cy="50"
              r="40"
              pathLength="100"
              transform="rotate(150 50 50)"
            />
            <circle
              className={styles.gaugeArc}
              cx="50"
              cy="50"
              r="40"
              pathLength="100"
              transform="rotate(150 50 50)"
            />
          </svg>
          <div className={styles.ticks}>
            {gaugeTicks.map((value) => (
              <i
                key={value}
                className={styles.tick}
                data-major={value % 40 === 0}
                style={{ '--angle': `${150 + (value / MAX_SPEED) * 240}deg` } as React.CSSProperties}
              />
            ))}
          </div>
          <div className={styles.needle} />
          <div className={styles.gaugeHub} />
          <div className={styles.leds}>
            {Array.from({ length: 9 }, (_, index) => {
              const color = index < 3 ? '#3ec7ff' : index < 6 ? '#6cf08a' : '#ff2d78';
              const lit = hud.rpm > 0.55 + index * 0.05;
              return (
                <i
                  key={index}
                  className={styles.led}
                  data-lit={lit}
                  style={{ backgroundColor: color, boxShadow: lit ? `0 0 0.4em ${color}` : 'none' }}
                />
              );
            })}
          </div>
          <div className={styles.gaugeSpeed}>
            {Math.round(hud.speed)}
            <span>KM/H</span>
          </div>
        </div>

        <div className={styles.gearBox}>
          <span className={styles.gearLabel}>GEAR</span>
          <strong className={styles.gearValue}>{hud.gear}</strong>
        </div>

        <div className={styles.boostBox}>
          <span className={styles.boostLabel}>BOOST</span>
          <div className={styles.boostTrack}>
            <div className={styles.boostFill} />
          </div>
        </div>
      </div>

      <div className={styles.message} role="status" aria-live="polite">
        {message}
      </div>

      <div className={styles.controls}>
        {(['brake', 'gas', 'boost'] as Control[]).map((control) => (
          <button
            key={control}
            type="button"
            data-control={control}
            data-held={held[control]}
            {...holdProps(control)}
          >
            {CONTROL_LABELS[control]}
          </button>
        ))}
      </div>

      {phase === 'finished' ? (
        <div className={styles.overlay} role="alert">
          <div className={styles.overlayInner}>
            <p className={styles.overlayKicker}>RACE COMPLETE</p>
            <h3 className={styles.overlayTitle}>APEX DASH</h3>
            <p className={styles.overlayText}>
              Three laps in the book. The best lap is saved for the next run.
            </p>
            <div className={styles.overlayStats}>
              <div>
                TOTAL
                <strong>{formatTime(hud.raceTime)}</strong>
              </div>
              <div>
                BEST LAP
                <strong>{bestLapValue > 0 ? formatTime(bestLapValue) : '--:--.--'}</strong>
              </div>
            </div>
            <button type="button" className={styles.overlayButton} onClick={restart}>
              RACE AGAIN
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
