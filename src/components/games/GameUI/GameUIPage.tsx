import React, { useState } from 'react';
import { Section } from '../GamePageShell';
import { DemoErrorBoundary } from './DemoErrorBoundary';
import { GameLabShell } from './GameLabShell';
import { PixelRpgDemo } from './demos/PixelRpg/PixelRpgDemo';
import { RacingDemo } from './demos/Racing/RacingDemo';
import { SurvivalPackDemo } from './demos/SurvivalPack/SurvivalPackDemo';
import { TacticalShooterDemo } from './demos/TacticalShooter/TacticalShooterDemo';
import { SPECIMENS } from './specs';
import { SpecimenFrame } from './SpecimenFrame';
import './gameui.css';

const ACCENT = 'var(--t-world-violet)';

const DEMO_BY_ID: Record<string, React.ComponentType> = {
  'pixel-rpg': PixelRpgDemo,
  'abode-backpack': SurvivalPackDemo,
  wardline: TacticalShooterDemo,
  'apex-dash': RacingDemo,
};

const NOTES = [
  {
    label: 'PALETTE',
    body: 'Four stage palettes, one house frame. The chrome stays ember, bone, and violet while each specimen owns its own colors.',
  },
  {
    label: 'TYPE',
    body: 'Press Start 2P, Special Elite, Rajdhani, and Orbitron are stage voices. House chrome speaks Bebas, Crimson, and Space Mono.',
  },
  {
    label: 'MOTION',
    body: 'Bob, shake, muzzle flash, and speed lines. Every loop collapses to a still frame under reduced motion.',
  },
  {
    label: 'INPUT',
    body: 'Pointer, drag, keyboard, and hold controls. Each specimen has a working keyboard path and a touch path.',
  },
];

const GameUIPage: React.FC = () => {
  const [resetKeys, setResetKeys] = useState<Record<string, number>>({});

  const resetSpecimen = (id: string): void => {
    setResetKeys((current) => ({
      ...current,
      [id]: (current[id] ?? 0) + 1,
    }));
  };

  return (
    <GameLabShell
      eyebrow="GAME 04 · INTERACTIVE LAB"
      title="UI SYSTEMS"
      subtitle="Four worlds. Four interface languages. One component lab."
      accent={ACCENT}
    >
      <Section label="01 — SPECIMENS" accentColor={ACCENT}>
        {SPECIMENS.map((specimen) => {
          const resetKey = resetKeys[specimen.id] ?? 0;
          const Demo = DEMO_BY_ID[specimen.id];

          return (
            <div key={specimen.id} className="mb-16 last:mb-0">
              <SpecimenFrame
                id={specimen.id}
                index={specimen.index}
                total={specimen.total}
                title={specimen.title}
                genre={specimen.genre}
                accent={specimen.accent}
                description={specimen.description}
                inputHints={specimen.inputHints}
                onReset={() => resetSpecimen(specimen.id)}
              >
                <DemoErrorBoundary
                  key={`${specimen.id}-${resetKey}`}
                  title={specimen.title}
                  accent={specimen.accent}
                >
                  {Demo ? <Demo key={resetKey} /> : null}
                </DemoErrorBoundary>
              </SpecimenFrame>
            </div>
          );
        })}

        <p
          className="mt-6 text-[9px] uppercase tracking-[0.22em]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--t-bone-faint)' }}
        >
          Four specimens live · deeper mechanics next.
        </p>
      </Section>

      <Section label="02 — DESIGN NOTES" accentColor={ACCENT}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {NOTES.map((note) => (
            <div
              key={note.label}
              className="p-5"
              style={{
                background:
                  'linear-gradient(140deg, var(--t-panel-ember-top), var(--t-panel-ember-mid))',
                border: '1px solid var(--t-line)',
              }}
            >
              <div
                className="text-[9px] uppercase tracking-[0.25em]"
                style={{ fontFamily: 'var(--font-mono)', color: ACCENT }}
              >
                {note.label}
              </div>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--t-bone-soft)' }}
              >
                {note.body}
              </p>
            </div>
          ))}
        </div>

        <p
          className="mt-6 border-l-2 pl-4 text-sm leading-relaxed"
          style={{
            borderColor: ACCENT,
            fontFamily: 'var(--font-serif)',
            color: 'var(--t-bone)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: ACCENT }}>
            WHAT TO STEAL —{' '}
          </span>
          Make cost visible before commitment. HP, MP, weight, ammo, armor, and lap time are all
          on screen before the player acts.
        </p>
      </Section>
    </GameLabShell>
  );
};

export default GameUIPage;
