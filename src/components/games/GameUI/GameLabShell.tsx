import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UI_SYSTEM_ACCENTS } from '../uiSystemAccents';

interface GameLabShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  children: ReactNode;
}

export const GameLabShell: React.FC<GameLabShellProps> = ({
  eyebrow,
  title,
  subtitle,
  accent,
  children,
}) => (
  <div
    className="gameui-page relative min-h-screen overflow-hidden"
    style={{ background: 'var(--t-ember-900)', color: 'var(--t-bone)' }}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 18% 0%, color-mix(in srgb, ${accent} 14%, transparent) 0%, transparent 55%)`,
      }}
    />
    <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-10">
      <Link
        to="/games"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] opacity-70 transition-opacity hover:opacity-100"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--t-bone-soft)' }}
      >
        <ArrowLeft size={12} aria-hidden="true" />
        ALL GAMES
      </Link>

      <header
        className="relative mt-10 overflow-hidden border-b pb-10 sm:mt-12 sm:pb-14"
        style={{ borderColor: 'var(--t-line-strong)' }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-10 select-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(8rem, 22vw, 16rem)',
            lineHeight: 0.75,
            color: accent,
            opacity: 0.08,
          }}
        >
          04
        </span>
        <p
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-mono)', color: accent }}
        >
          {eyebrow}
        </p>
        <h1
          className="mt-3 leading-[0.82]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 12vw, 8.5rem)',
            letterSpacing: '0.02em',
            color: 'var(--t-bone)',
          }}
        >
          {title}
        </h1>
        <p
          className="mt-4 max-w-2xl leading-snug"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)',
            color: 'var(--t-bone-soft)',
          }}
        >
          {subtitle}
        </p>
        <div className="absolute bottom-0 left-0 right-0 flex h-[3px]" aria-hidden="true">
          {UI_SYSTEM_ACCENTS.map((color) => (
            <span key={color} className="flex-1" style={{ background: color, opacity: 0.75 }} />
          ))}
        </div>
      </header>

      <main className="pt-12 sm:pt-16">{children}</main>

      <footer
        className="mt-16 border-t pt-6 text-[9px] uppercase tracking-[0.3em]"
        style={{
          borderColor: 'var(--t-line)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--t-bone-faint)',
        }}
      >
        INTERACTIVE LAB · DRAFT 1 · UI SYSTEMS
      </footer>
    </div>
  </div>
);
