import React, { useState } from 'react';
import { Section } from '../GamePageShell';
import { DemoErrorBoundary } from './DemoErrorBoundary';
import { GameLabShell } from './GameLabShell';
import { PixelRpgDemo } from './demos/PixelRpg/PixelRpgDemo';
import { PIXEL_RPG_SPECIMEN } from './specs';
import { SpecimenFrame } from './SpecimenFrame';
import './gameui.css';

const ACCENT = 'var(--t-world-violet)';

const NOTES = [
  {
    label: 'PALETTE',
    body: 'Sky cyan, slime green, a navy command box, and white pixel text. The stage never borrows the house palette.',
  },
  {
    label: 'TYPE',
    body: 'Press Start 2P at one scale. Hierarchy comes from spacing, color, and the box, not from extra font sizes.',
  },
  {
    label: 'MOTION',
    body: 'Bob, shake, and typewriter. Every one of them collapses cleanly under reduced motion.',
  },
];

const GameUIPage: React.FC = () => {
  const [resetKey, setResetKey] = useState(0);
  const specimen = PIXEL_RPG_SPECIMEN;

  return (
    <GameLabShell
      eyebrow="GAME 04 · INTERACTIVE LAB"
      title="UI SYSTEMS"
      subtitle="Four worlds. Four interface languages. One component lab."
      accent={ACCENT}
    >
      <Section label="01 — SPECIMEN" accentColor={ACCENT}>
        <SpecimenFrame
          id={specimen.id}
          index={specimen.index}
          total={specimen.total}
          title={specimen.title}
          genre={specimen.genre}
          accent={specimen.accent}
          description={specimen.description}
          inputHints={specimen.inputHints}
          onReset={() => setResetKey((current) => current + 1)}
        >
          <DemoErrorBoundary key={resetKey} title={specimen.title} accent={specimen.accent}>
            <PixelRpgDemo key={resetKey} />
          </DemoErrorBoundary>
        </SpecimenFrame>

        <p
          className="mt-5 text-[9px] uppercase tracking-[0.22em]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--t-bone-faint)' }}
        >
          Next specimens: Abəde Backpack · Wardline · Apex Dash.
        </p>
      </Section>

      <Section label="02 — DESIGN NOTES" accentColor={ACCENT}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
          Show cost and consequence before commitment. HP, MP, potions, and the enemy's intent
          are all visible before the player chooses.
        </p>
      </Section>
    </GameLabShell>
  );
};

export default GameUIPage;
