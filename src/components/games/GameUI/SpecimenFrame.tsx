import React, { ReactNode } from 'react';

export interface SpecimenFrameProps {
  id: string;
  index: number;
  total: number;
  title: string;
  genre: string;
  accent: string;
  description: string;
  inputHints: string[];
  onReset?: () => void;
  children: ReactNode;
}

export const SpecimenFrame: React.FC<SpecimenFrameProps> = ({
  id,
  index,
  total,
  title,
  genre,
  accent,
  description,
  inputHints,
  onReset,
  children,
}) => (
  <section aria-labelledby={`${id}-title`} className="relative">
    <div
      className="flex flex-wrap items-center justify-between gap-3 border-b pb-3"
      style={{ borderColor: 'var(--t-line)' }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.25em]"
        style={{ fontFamily: 'var(--font-mono)', color: accent }}
      >
        {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')} · {genre}
      </span>
      <span
        className="text-[9px] uppercase tracking-[0.25em]"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--t-bone-faint)' }}
      >
        LIVE SPECIMEN
      </span>
    </div>

    <div className="mt-5">
      <h2
        id={`${id}-title`}
        className="leading-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
          color: 'var(--t-bone)',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h2>
      <p
        className="mt-2 max-w-2xl leading-relaxed"
        style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--t-bone-soft)' }}
      >
        {description}
      </p>
    </div>

    <div
      className="relative mt-6 overflow-hidden"
      style={{
        border: `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
        background: 'var(--t-panel-ember-mid)',
      }}
    >
      <div className="h-[2px] w-full" style={{ background: accent }} aria-hidden="true" />
      {children}
    </div>

    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <ul
        className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] uppercase tracking-[0.2em]"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--t-bone-faint)' }}
      >
        {inputHints.map((hint, hintIndex) => (
          <li key={hint}>
            {hintIndex > 0 ? '· ' : ''}
            {hint}
          </li>
        ))}
      </ul>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="border px-3 py-2 text-[9px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--t-bone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--t-world-violet)]"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--t-bone-soft)',
            borderColor: 'var(--t-line-strong)',
            background: 'transparent',
          }}
        >
          RESET RUN
        </button>
      )}
    </div>
  </section>
);
