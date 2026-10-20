# Game UI Lab Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/games/ui` as a house-styled interactive lab with a reusable specimen frame and the fully ported Slime Road pixel JRPG.

**Architecture:** A dedicated `GameLabShell` provides the games-family chrome while each demo owns its diegetic stage. `SpecimenFrame` and `DemoErrorBoundary` create the reusable contract; four small hooks cover input, motion preference, persistence, and typewriter timing. The Pixel RPG is split into pure reducer logic, types, a CSS module, and a composition component.

**Tech Stack:** React 18.3, TypeScript 5.5 strict, Vite, Tailwind CSS v4, framer-motion (through the existing `Section`), lucide-react, React Router 6. No new dependencies.

## Global Constraints

- Use existing `--t-*` tokens only. Do not modify `src/index.css`.
- Add no dependencies and no test runner. The pure reducer is written so Vitest can be added later.
- House chrome uses `var(--font-display)`, `var(--font-serif)`, and `var(--font-mono)`. The Pixel RPG stage keeps Press Start 2P and its own palette.
- No fixed DOM IDs in the demo, no global key listeners, no unowned timers, no CSS leakage outside a CSS module.
- Page accent is `var(--t-world-violet)`. Shared brand strip is `#7eb8e8, #7ec87e, #c9962b, #00f5ff, #e05c2a, #ffe866`.
- Do not run `git commit`. The user has not authorized commits. Review with `git status` and `git diff`.
- Every task ends with `npm run build` and `npm run lint` passing.
- Commands run from `C:\Projects\Dave-s-Component-Playground` in PowerShell 7.

---

## File Map

| File | Responsibility |
|---|---|
| `src/components/games/uiSystemAccents.ts` | Shared six-color UI Systems brand motif |
| `src/components/games/GameUI/GameUIPage.tsx` | Page composition root; no game logic |
| `src/components/games/GameUI/GameLabShell.tsx` | Back link, hero, watermark, accent strip, footer |
| `src/components/games/GameUI/SpecimenFrame.tsx` | House chrome around a demo |
| `src/components/games/GameUI/DemoErrorBoundary.tsx` | Per-specimen error isolation |
| `src/components/games/GameUI/gameui.css` | Press Start 2P import and page baseline |
| `src/components/games/GameUI/specs.ts` | Specimen metadata |
| `src/components/games/GameUI/shared/useGameKeys.ts` | Scoped keydown handling |
| `src/components/games/GameUI/shared/useReducedMotion.ts` | Media-query subscription |
| `src/components/games/GameUI/shared/usePersistentState.ts` | Namespaced localStorage state |
| `src/components/games/GameUI/shared/useTypewriter.ts` | Cancellable typewriter |
| `src/components/games/GameUI/demos/PixelRpg/types.ts` | State and action types |
| `src/components/games/GameUI/demos/PixelRpg/logic.ts` | Pure reducer and selectors |
| `src/components/games/GameUI/demos/PixelRpg/pixel-rpg.module.css` | Diegetic stage styles |
| `src/components/games/GameUI/demos/PixelRpg/PixelRpgDemo.tsx` | Stage view and composition |
| `src/components/games/GamesIndex.tsx` | Card copy + shared accent import |
| `src/pages/Overview.tsx` | Four-world copy |
| `src/components/layout/Header.tsx` | Four-world sub-label |
| `docs/reference/game-ui-gallery.html` | Source-of-truth reference artifact |

---

## Task 1: Shared Brand Accents and Product Copy

**Files:**
- Create: `src/components/games/uiSystemAccents.ts`
- Modify: `src/components/games/GamesIndex.tsx:1-7, 25, 39, 51, 69, 74-75`
- Modify: `src/pages/Overview.tsx:110`
- Modify: `src/components/layout/Header.tsx:46`

**Interfaces:**
- Consumes: nothing.
- Produces: `UI_SYSTEM_ACCENTS: readonly string[]`, imported by `GamesIndex.tsx` and, in Task 2, by `GameLabShell.tsx`.

- [ ] **Step 1: Create the shared accent module**

```ts
export const UI_SYSTEM_ACCENTS = [
  '#7eb8e8',
  '#7ec87e',
  '#c9962b',
  '#00f5ff',
  '#e05c2a',
  '#ffe866',
] as const;
```

- [ ] **Step 2: Replace the local accent constant in GamesIndex**

Change the import block at the top of `src/components/games/GamesIndex.tsx` to:

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { UI_SYSTEM_ACCENTS } from './uiSystemAccents';

// ─── UI Showcase Card ────────────────────────────────────────
```

Delete the old line:

```tsx
const STYLE_ACCENTS = ['#7eb8e8', '#7ec87e', '#c9962b', '#00f5ff', '#e05c2a', '#ffe866'];
```

Replace all three `STYLE_ACCENTS` references with `UI_SYSTEM_ACCENTS`:

```tsx
        {UI_SYSTEM_ACCENTS.map((c, i) => (
          <div key={i} className="flex-1 transition-opacity duration-300 group-hover:opacity-100" style={{ background: c, opacity: 0.7 }} />
        ))}
```

```tsx
            {UI_SYSTEM_ACCENTS.map((c, i) => (
              <div key={i} className="w-3 h-3" style={{ background: c + '60', border: `1px solid ${c}` }} />
            ))}
```

The third reference is inside the pixel-dot loop:

```tsx
        {[0,1,2,3,4].map(i => (
          <div key={i} className="absolute" style={{ width: 6, height: 6, background: UI_SYSTEM_ACCENTS[i % 6] + '28',
            right: `${8 + i * 14}%`, top: `${20 + (i % 3) * 18}%`, imageRendering: 'pixelated' }} />
        ))}
```

- [ ] **Step 3: Update the GamesIndex card promise**

Replace:

```tsx
            // Six style directions · Nine interactive elements
```

with:

```tsx
            // Four worlds · Four interface languages
```

Replace the paragraph:

```tsx
            HUD bars, inventory grids, achievement toasts, dialogue systems, screen templates — all rendered
            in six distinct visual languages from pixel-art to neon void.
```

with:

```tsx
            HUD bars, inventory grids, combat logs, and cockpit gauges — four interface languages,
            starting with a playable pixel JRPG.
```

- [ ] **Step 4: Update the Overview card copy**

Replace the UI Showcase item in `src/pages/Overview.tsx`:

```tsx
      { label: 'UI Showcase', description: '9 interactive game UI elements rendered in 6 distinct style directions.', path: '/games/ui', Icon: Palette, tag: '6 Styles' },
```

with:

```tsx
      { label: 'UI Showcase', description: 'A four-world game UI lab, starting with a playable pixel JRPG.', path: '/games/ui', Icon: Palette, tag: '4 Worlds' },
```

- [ ] **Step 5: Update the header sub-label**

Replace:

```tsx
  { label: 'UI Showcase', sub: 'Game UI Elements · 6 Styles', path: '/games/ui', color: '#a080d0', num: '◈' },
```

with:

```tsx
  { label: 'UI Showcase', sub: 'Game UI Lab · 4 Worlds', path: '/games/ui', color: '#a080d0', num: '◈' },
```

- [ ] **Step 6: Verify no stale promises remain**

Run:

```powershell
rg "STYLE_ACCENTS|Six style directions|6 Styles|9 interactive" src/components/games/GamesIndex.tsx src/pages/Overview.tsx src/components/layout/Header.tsx
```

Expected: no output, exit code 1.

- [ ] **Step 7: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0. `tsc -b` reports no errors; Vite reports `built in`; ESLint prints nothing.

---

## Task 2: Page Font and Lab Shell

**Files:**
- Create: `src/components/games/GameUI/gameui.css`
- Create: `src/components/games/GameUI/GameLabShell.tsx`

**Interfaces:**
- Consumes: `UI_SYSTEM_ACCENTS` from `../uiSystemAccents`; tokens from `src/index.css`.
- Produces: `GameLabShell` React component with props `{ eyebrow, title, subtitle, accent, children }`.

- [ ] **Step 1: Create the page-scoped stylesheet**

Create `src/components/games/GameUI/gameui.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.gameui-page ::selection {
  background: var(--t-world-violet);
  color: var(--t-ember-900);
}
```

The `@import` must stay the first statement in the file.

- [ ] **Step 2: Create GameLabShell**

Create `src/components/games/GameUI/GameLabShell.tsx`:

```tsx
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
```

- [ ] **Step 3: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0. The shell is not imported yet, but `tsc -b` type-checks it.

---

## Task 3: Specimen Frame and Error Boundary

**Files:**
- Create: `src/components/games/GameUI/SpecimenFrame.tsx`
- Create: `src/components/games/GameUI/DemoErrorBoundary.tsx`
- Create: `src/components/games/GameUI/specs.ts`

**Interfaces:**
- Consumes: tokens only.
- Produces:
  - `SpecimenFrame` props: `{ id, index, total, title, genre, accent, description, inputHints, onReset?, children }`.
  - `DemoErrorBoundary` props: `{ title, accent, children }`.
  - `SpecimenSpec` and `PIXEL_RPG_SPECIMEN`.

- [ ] **Step 1: Create specimen metadata**

Create `src/components/games/GameUI/specs.ts`:

```ts
export interface SpecimenSpec {
  id: string;
  index: number;
  total: number;
  title: string;
  genre: string;
  accent: string;
  description: string;
  inputHints: string[];
}

export const PIXEL_RPG_SPECIMEN: SpecimenSpec = {
  id: 'pixel-rpg',
  index: 1,
  total: 4,
  title: 'Slime Road',
  genre: 'TURN-BASED JRPG',
  accent: 'var(--t-world-violet)',
  description:
    'A pocket-sized turn-based encounter: four commands, one slime, and a road that keeps going.',
  inputHints: ['CLICK / TAP COMMANDS', 'ARROW KEYS MOVE FOCUS', '1–4 SHORTCUTS'],
};
```

- [ ] **Step 2: Create SpecimenFrame**

Create `src/components/games/GameUI/SpecimenFrame.tsx`:

```tsx
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
```

- [ ] **Step 3: Create DemoErrorBoundary**

Create `src/components/games/GameUI/DemoErrorBoundary.tsx`:

```tsx
import React, { ReactNode } from 'react';

interface DemoErrorBoundaryProps {
  title: string;
  accent: string;
  children: ReactNode;
}

interface DemoErrorBoundaryState {
  error: Error | null;
  resetKey: number;
}

export class DemoErrorBoundary extends React.Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  state: DemoErrorBoundaryState = { error: null, resetKey: 0 };

  static getDerivedStateFromError(error: Error): Partial<DemoErrorBoundaryState> {
    return { error };
  }

  private reload = () => {
    this.setState((current) => ({ error: null, resetKey: current.resetKey + 1 }));
  };

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="relative"
          style={{
            minHeight: '420px',
            background: 'var(--t-panel-ember-deep)',
            border: '1px solid var(--t-line-strong)',
          }}
        >
          <div className="h-[2px] w-full" style={{ background: this.props.accent }} aria-hidden="true" />
          <div className="p-8 sm:p-12">
            <p
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-mono)', color: this.props.accent }}
            >
              SPECIMEN OFFLINE
            </p>
            <h3
              className="mt-3 leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--t-bone)',
              }}
            >
              {this.props.title}
            </h3>
            <p
              className="mt-3 max-w-md leading-relaxed"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--t-bone-soft)' }}
            >
              This specimen hit an error. The rest of the lab is still running.
            </p>
            <button
              type="button"
              onClick={this.reload}
              className="mt-6 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--t-bone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--t-world-violet)]"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--t-bone-soft)',
                borderColor: 'var(--t-line-strong)',
                background: 'transparent',
              }}
            >
              RELOAD SPECIMEN
            </button>
          </div>
        </div>
      );
    }

    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
  }
}
```

- [ ] **Step 4: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0.

---

## Task 4: Shared Hooks

**Files:**
- Create: `src/components/games/GameUI/shared/useGameKeys.ts`
- Create: `src/components/games/GameUI/shared/useReducedMotion.ts`
- Create: `src/components/games/GameUI/shared/usePersistentState.ts`
- Create: `src/components/games/GameUI/shared/useTypewriter.ts`

**Interfaces:**
- Consumes: React only.
- Produces:
  - `useGameKeys(targetRef, handlers, options?)`.
  - `useReducedMotion(): boolean`.
  - `usePersistentState<T>(key, initial): [T, Dispatch<SetStateAction<T>>]`.
  - `useTypewriter(text, speed, enabled?): { displayed: string; done: boolean; skip: () => void }`.

- [ ] **Step 1: Create useGameKeys**

Create `src/components/games/GameUI/shared/useGameKeys.ts`:

```ts
import { useEffect, useRef, type RefObject } from 'react';

export type GameKeyHandler = (event: KeyboardEvent) => void;

interface UseGameKeysOptions {
  preventDefault?: string[];
}

export function useGameKeys(
  targetRef: RefObject<HTMLElement>,
  handlers: Record<string, GameKeyHandler>,
  options: UseGameKeysOptions = {},
): void {
  const handlersRef = useRef(handlers);
  const preventRef = useRef<string[]>(options.preventDefault ?? []);

  handlersRef.current = handlers;
  preventRef.current = options.preventDefault ?? [];

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null;
      if (element && (element.isContentEditable || element.closest('input, textarea, select'))) {
        return;
      }

      const handler = handlersRef.current[event.key];
      if (!handler) return;

      if (preventRef.current.includes(event.key)) {
        event.preventDefault();
      }
      handler(event);
    };

    target.addEventListener('keydown', onKeyDown);
    return () => target.removeEventListener('keydown', onKeyDown);
  }, [targetRef]);
}
```

- [ ] **Step 2: Create useReducedMotion**

Create `src/components/games/GameUI/shared/useReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = () => setReduced(media.matches);

    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: Create usePersistentState**

Create `src/components/games/GameUI/shared/usePersistentState.ts`:

```ts
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `gameui:${key}`;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw === null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      return;
    }
  }, [storageKey, value]);

  return [value, setValue];
}
```

- [ ] **Step 4: Create useTypewriter**

Create `src/components/games/GameUI/shared/useTypewriter.ts`:

```ts
import { useCallback, useEffect, useRef, useState } from 'react';

export interface TypewriterState {
  displayed: string;
  done: boolean;
  skip: () => void;
}

export function useTypewriter(text: string, speed: number, enabled = true): TypewriterState {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!enabled) {
      setDisplayed(text);
      return;
    }

    setDisplayed('');
    let index = 0;

    timerRef.current = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length && timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, speed);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, speed, enabled]);

  const skip = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplayed(text);
  }, [text]);

  return { displayed, done: displayed.length >= text.length, skip };
}
```

- [ ] **Step 5: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0.

---

## Task 5: Pixel RPG Types and Pure Logic

**Files:**
- Create: `src/components/games/GameUI/demos/PixelRpg/types.ts`
- Create: `src/components/games/GameUI/demos/PixelRpg/logic.ts`

**Interfaces:**
- Consumes: nothing outside TypeScript.
- Produces:
  - Types: `Phase`, `EnemyIntent`, `Enemy`, `Player`, `CombatEvent`, `PixelRpgState`, `Command`, `PixelRpgAction`, `Rng`.
  - `COMMANDS: readonly Command[]`.
  - `createInitialState(bestWave?, rng?)`, `reduce(state, action, rng?)`, `canCastMagic`, `canUseItem`, `isCommandEnabled`, `enemyHpPercent`, `intentLabel`.

- [ ] **Step 1: Create the types**

Create `src/components/games/GameUI/demos/PixelRpg/types.ts`:

```ts
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
```

- [ ] **Step 2: Create the reducer**

Create `src/components/games/GameUI/demos/PixelRpg/logic.ts`:

```ts
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
```

- [ ] **Step 3: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0.

- [ ] **Step 4: Sanity-check the reducer live via the browser console**

This step is deferred until Task 8 wires the page. The reducer is pure and all values are visible in the component state; no separate test runner is added in Phase 1.

---

## Task 6: Pixel RPG Stage Styles

**Files:**
- Create: `src/components/games/GameUI/demos/PixelRpg/pixel-rpg.module.css`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS module class names used by `PixelRpgDemo.tsx`: `stage`, `stageInner`, `foe`, `foeName`, `intent`, `hpTrack`, `hpFill`, `enemyHpText`, `slime`, `damage`, `damagePlayer`, `ui`, `box`, `message`, `row`, `menu`, `command`, `commandCost`, `status`, `statusTitle`, `statusRow`, `hud`, `overlay`, `overlayBox`, `overlayTitle`, `overlayButton`, `srOnly`.

- [ ] **Step 1: Create the CSS module**

Create `src/components/games/GameUI/demos/PixelRpg/pixel-rpg.module.css`:

```css
.stage {
  position: relative;
  container-type: inline-size;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: linear-gradient(#5ac8fa, #c9f1ff 58%, #4a9c3a 58%, #2d6b25);
  font-family: 'Press Start 2P', monospace;
  color: #fff;
  user-select: none;
  touch-action: manipulation;
  image-rendering: pixelated;
  outline: none;
}

.stage:focus-visible {
  outline: 3px solid #ffd23f;
  outline-offset: -3px;
}

.stageInner {
  position: absolute;
  inset: 0;
  font-size: clamp(11px, 2.2cqw, 22px);
  line-height: 1.6;
}

.foe {
  position: absolute;
  left: 50%;
  top: 7%;
  width: 80%;
  transform: translateX(-50%);
  text-align: center;
  text-shadow: 0.18em 0.18em 0 #10142c;
}

.foeName {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8em;
  font-size: 0.9em;
}

.intent {
  font-size: 0.7em;
  letter-spacing: 0.05em;
}

.intent[data-intent='charging'] {
  color: #ffd23f;
}

.intent[data-intent='release'] {
  color: #ff8a7a;
}

.intent[data-intent='attack'] {
  color: #b6f5be;
}

.hpTrack {
  width: 12em;
  height: 0.8em;
  margin: 0.55em auto 0;
  background: #0006;
  box-shadow: 0 0 0 0.15em #10142c;
}

.hpFill {
  height: 100%;
  background: #5bd16b;
  transition: width 180ms steps(6, end);
}

.enemyHpText {
  margin-top: 0.55em;
  font-size: 0.58em;
  color: #fff;
}

.slime {
  display: block;
  width: 12em;
  height: 9em;
  margin: 0.9em auto 0;
  animation: bob 0.8s steps(2, end) infinite;
}

.slime[data-hit='true'] {
  animation: hit 0.3s steps(2, end);
}

.damage {
  position: absolute;
  left: 50%;
  top: 54%;
  transform: translateX(-50%);
  font-size: 1.1em;
  color: #fff;
  text-shadow: 0.15em 0.15em 0 #10142c;
  animation: float 0.9s steps(6, end) forwards;
  pointer-events: none;
}

.damagePlayer {
  position: absolute;
  right: 8%;
  bottom: 32%;
  z-index: 4;
  color: #ff8a7a;
  text-shadow: 0.15em 0.15em 0 #10142c;
  animation: floatUp 0.9s steps(6, end) forwards;
  pointer-events: none;
}

.ui {
  position: absolute;
  inset: auto 4% 4% 4%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.4em;
  font-size: max(10px, 0.72em);
}

.ui[data-shake='true'] {
  animation: shake 0.3s steps(2, end);
}

.box {
  background: #1d2350;
  box-shadow: 0 0 0 0.3em #10142c, 0 0 0 0.6em #fff;
  padding: 1em;
  line-height: 1.9;
}

.message {
  min-height: 3.8em;
  color: #fff;
  overflow-wrap: anywhere;
}

.row {
  display: flex;
  gap: 1.6em;
  align-items: stretch;
}

.menu {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65em 1.6em;
}

.command {
  all: unset;
  position: relative;
  padding-left: 1.2em;
  cursor: pointer;
  color: #ffd23f;
  font: inherit;
  line-height: 1.9;
}

.command::before {
  content: '▶';
  position: absolute;
  left: 0;
  opacity: 0;
}

.command:hover::before,
.command:focus-visible::before {
  opacity: 1;
}

.command:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.command[aria-disabled='true'] {
  opacity: 0.35;
  cursor: not-allowed;
}

.commandCost {
  margin-left: 0.35em;
  font-size: 0.65em;
  color: #b6f5be;
}

.status {
  min-width: 38%;
  color: #fff;
}

.statusTitle {
  color: #b6f5be;
}

.status strong {
  color: #ffd23f;
}

.statusRow {
  display: flex;
  justify-content: space-between;
  gap: 0.8em;
}

.hud {
  position: absolute;
  top: 4%;
  left: 4%;
  z-index: 3;
  font-size: 0.62em;
  line-height: 1.9;
  color: #fff;
  text-shadow: 0.18em 0.18em 0 #10142c;
}

.hud span {
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  padding: 5%;
  background: rgba(16, 20, 44, 0.84);
}

.overlayBox {
  width: min(100%, 30em);
  background: #1d2350;
  box-shadow: 0 0 0 0.3em #10142c, 0 0 0 0.6em #fff;
  padding: 1.6em;
  text-align: center;
  line-height: 2;
}

.overlayTitle {
  color: #ff8a7a;
  font-size: 1.1em;
}

.overlayButton {
  all: unset;
  margin-top: 1em;
  padding: 0.8em 1.2em;
  border: 2px solid #ffd23f;
  color: #ffd23f;
  cursor: pointer;
  font: inherit;
  font-size: 0.8em;
}

.overlayButton:hover,
.overlayButton:focus-visible {
  background: #ffd23f;
  color: #10142c;
}

.overlayButton:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.6em);
  }
}

@keyframes hit {
  0%,
  100% {
    transform: translateX(0);
    filter: brightness(1);
  }
  50% {
    transform: translateX(-0.35em);
    filter: brightness(1.8);
  }
}

@keyframes float {
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -2.4em);
  }
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-2.4em);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-0.35em);
  }
  75% {
    transform: translateX(0.35em);
  }
}

@media (max-width: 520px) {
  .stage {
    aspect-ratio: 4 / 3;
  }

  .foe {
    top: 4%;
    width: 88%;
  }

  .foeName {
    font-size: 0.8em;
  }

  .hpTrack {
    width: 9em;
  }

  .slime {
    width: 7em;
    height: 5.25em;
    margin-top: 0.5em;
  }

  .ui {
    inset: auto 3% 3% 3%;
    gap: 0.8em;
    font-size: max(10px, 0.9em);
  }

  .box {
    padding: 0.7em;
    line-height: 1.6;
  }

  .message {
    min-height: 2.6em;
  }

  .row {
    gap: 0.8em;
  }

  .command {
    display: flex;
    align-items: center;
    min-height: 44px;
    padding-left: 1em;
  }

  .status {
    min-width: 46%;
  }

  .hud {
    top: 3%;
    left: 3%;
    font-size: 0.55em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slime,
  .slime[data-hit='true'],
  .ui[data-shake='true'],
  .damage,
  .damagePlayer {
    animation: none;
  }

  .hpFill {
    transition: none;
  }
}
```

- [ ] **Step 2: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0. The CSS module is not imported yet; TypeScript ignores it.

---

## Task 7: Pixel RPG Demo Component

**Files:**
- Create: `src/components/games/GameUI/demos/PixelRpg/PixelRpgDemo.tsx`

**Interfaces:**
- Consumes: types and selectors from `./types` and `./logic`; hooks from `../../shared/*`; `./pixel-rpg.module.css`.
- Produces: `PixelRpgDemo` React component.

- [ ] **Step 1: Create the component**

Create `src/components/games/GameUI/demos/PixelRpg/PixelRpgDemo.tsx`:

```tsx
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
```

- [ ] **Step 2: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0. The component is not imported yet, but it type-checks and lints.

---

## Task 8: Page Composition and Reference Move

**Files:**
- Modify: `src/components/games/GameUI/GameUIPage.tsx` (replace all 7 lines)
- Move: `src/components/games/GameUI/Game UI Gallery.html` → `docs/reference/game-ui-gallery.html`

**Interfaces:**
- Consumes: `GameLabShell`, `SpecimenFrame`, `DemoErrorBoundary`, `PIXEL_RPG_SPECIMEN`, `PixelRpgDemo`, `Section`, `gameui.css`.
- Produces: the `/games/ui` page.

- [ ] **Step 1: Replace GameUIPage**

Replace the entire contents of `src/components/games/GameUI/GameUIPage.tsx` with:

```tsx
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
```

- [ ] **Step 2: Move the reference artifact**

Run:

```powershell
New-Item -ItemType Directory -Force -Path "docs/reference" | Out-Null
Move-Item -LiteralPath "src/components/games/GameUI/Game UI Gallery.html" -Destination "docs/reference/game-ui-gallery.html"
```

Expected: no output. Verify:

```powershell
Test-Path -LiteralPath "docs/reference/game-ui-gallery.html"
Test-Path -LiteralPath "src/components/games/GameUI/Game UI Gallery.html"
```

Expected: `True` then `False`.

- [ ] **Step 3: Build and lint**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0. The route chunk now imports the shell, frame, boundary, hooks, logic, CSS module, and demo.

---

## Task 9: Verification and Manual Play Check

**Files:**
- No file changes expected. If a check fails, fix the owning task's file and rerun.

**Interfaces:**
- Consumes: the complete Phase 1 page.
- Produces: verified build, lint, copy, and manual behavior.

- [ ] **Step 1: Verify the static checks**

Run:

```powershell
npm run build
npm run lint
```

Expected: both exit code 0.

- [ ] **Step 2: Verify the port has no forbidden globals**

Run:

```powershell
rg "document\.querySelector|window\.addEventListener|addEventListener\('keydown'" src/components/games/GameUI/demos
```

Expected: no output, exit code 1.

Run:

```powershell
rg "#[0-9a-fA-F]{6}" src/components/games/GameUI/GameLabShell.tsx src/components/games/GameUI/SpecimenFrame.tsx src/components/games/GameUI/GameUIPage.tsx src/components/games/GameUI/DemoErrorBoundary.tsx
```

Expected: no output, exit code 1. House chrome uses tokens; the six brand accents live in `uiSystemAccents.ts`, and demo colors live in the CSS module.

Run:

```powershell
rg "STYLE_ACCENTS|Six style directions|6 Styles|9 interactive" src/components/games/GamesIndex.tsx src/pages/Overview.tsx src/components/layout/Header.tsx
```

Expected: no output, exit code 1.

- [ ] **Step 3: Start the dev server**

Run:

```powershell
npm run dev
```

Expected: Vite prints `Local: http://localhost:5173/` (the port may differ). Open `/games/ui`.

- [ ] **Step 4: Check the mechanics**

In the browser:

1. The intro message types at 16ms per character, then the commands enable after the 550ms hold.
2. FIGHT deals 6–10 and the slime HP drops.
3. MAGIC costs 4 MP, deals 12–15, and disables at 0–3 MP.
4. ITEM consumes a potion and heals up to 15.
5. RUN succeeds roughly half the time; a failure shows the blocked-road message and the slime attacks.
6. An enemy telegraph reads `CHARGING`, then `RELEASE`; the release hit is doubled.
7. Killing the slime shows `victory`, then wave 2 starts after 1.2s with HP/MP/potions carried over.
8. The first defeat with a fairy restores 20 HP and consumes `FAIRY`; the second defeat shows `RUN OVER` with the wave summary and `RESTART RUN`.
9. `BEST` updates on victory, escape, or defeat and survives a page reload.
10. `RESET RUN` under the stage restarts at wave 1 and keeps `BEST`.

Expected: all ten behaviors observed, no console errors.

- [ ] **Step 5: Check keyboard play**

Click the stage, then:

1. Arrow keys move focus between enabled commands.
2. Enter and Space activate the focused command.
3. `1`–`4` activate FIGHT/MAGIC/ITEM/RUN.
4. While text is typing, the first key or click only completes the text; it does not execute a command.

Expected: all four behaviors observed, and the page does not scroll when arrow keys are used inside the stage.

- [ ] **Step 6: Check reduced motion**

In DevTools, open Rendering, set `Emulate CSS media feature prefers-reduced-motion` to `reduce`, and reload `/games/ui`.

Expected: the slime does not bob, the UI does not shake, damage numbers do not float, and message text appears immediately.

- [ ] **Step 7: Check responsive widths**

Use the device toolbar at 360, 768, and 1280 CSS pixels.

Expected:

- 1280 and 768: 16:10 stage, readable chrome, no overlap between the foe and the command box.
- 360: 4:3 stage, 2×2 command grid, 44px command targets, no horizontal page scroll, all text readable.
- The page never scrolls horizontally at 360.

- [ ] **Step 8: Check StrictMode and the error boundary**

In development, StrictMode is already active. Reload and confirm no duplicate listeners, no double actions, and no console warnings about state updates after unmount.

Temporarily add this line at the start of the `PixelRpgDemo` function body:

```tsx
  throw new Error('Specimen boundary check');
```

Reload `/games/ui`. Expected: the `SPECIMEN OFFLINE` panel appears inside the frame and the rest of the page still renders. Click `RELOAD SPECIMEN`; it throws again and stays contained. Remove the line, reload, and confirm the specimen returns. Then run:

```powershell
rg "Specimen boundary check" src
```

Expected: no output, exit code 1.

- [ ] **Step 9: Review the diff without committing**

Run:

```powershell
git status --short
git diff --stat
```

Expected: the new GameUI files, the three copy edits, the moved reference HTML, the spec, and this plan are the only changes. Do not run `git commit`.

---

## Plan Self-Review

**Spec coverage:**

- House shell, back link, hero, watermark, accent strip, footer: Task 2.
- Specimen frame with index/genre/title/description/hints/reset: Task 3.
- Per-specimen error isolation: Task 3.
- Shared hooks: Task 4.
- Pure state model, intent/charge, one revive, best wave, restart: Task 5.
- Original four commands and formulas: Task 5.
- Typewriter 16ms + 550ms, damage numbers 900ms, victory 1.2s: Task 7.
- Keyboard, skip-on-input, focus management: Task 7.
- Accessibility, live region, reduced motion, responsive stage: Tasks 6 and 7.
- Page design notes and queue line: Task 8.
- Four-world copy: Task 1.
- HTML reference move: Task 8.
- Build, lint, forbidden globals, manual checks: Task 9.

**Placeholder scan:** No TBD/TODO/"similar to" steps. Every code step contains the code to write.

**Type consistency:** `Enemy.charged` is used in `logic.ts` and rendered through `intentLabel`. `Command`/`COMMANDS` are defined once in `types.ts` and consumed by both the reducer and the component. Hook return shapes match their consumers. `SpecimenSpec` fields match the `SpecimenFrame` spread in `GameUIPage`.
