# Game UI Lab — Phase 1 Design Spec

**Date:** 2026-10-19
**Status:** Awaiting review
**Route:** `/games/ui` (`src/router/AppRouter.tsx:176`)
**Scope:** Lab shell + shared foundation + Pixel RPG specimen

## Overview

`Game UI Gallery.html` is a standalone 18 KB artifact containing four playable
game-interface demos: a pixel JRPG, a diegetic survival backpack, a projection-based
tactical shooter, and an arcade racing cockpit. It is visually strong but is built
from module-level IIFEs, fixed DOM IDs, global listeners, and page-level CSS. It
cannot be dropped into the React app as-is.

Phase 1 establishes the production seam:

1. A house-styled lab shell for `/games/ui` that uses the existing games design
   system.
2. A reusable specimen frame and error boundary.
3. A small shared-hook foundation.
4. The Pixel RPG ported to React as the reference implementation.

The remaining three demos follow in Phases 2–3 using the same contract. Phase 1
deliberately ports one demo to prove the architecture before repeating it.

## Current state

| Asset | State |
|---|---|
| `src/components/games/GameUI/GameUIPage.tsx` | 7-line placeholder |
| `src/router/AppRouter.tsx` | Route and lazy import already wired |
| `src/components/games/GamesIndex.tsx` | "UI Systems" card navigates to `/games/ui` |
| `Game UI Gallery.html` | Untracked reference artifact; four demos |
| `src/index.css` | Games tokens: ember/bone/gold + Bebas/Crimson/Space Mono |
| `src/main.tsx` | `StrictMode` enabled; effects run twice in development |

No routing or navigation work is required.

## Decisions

- **Four worlds first.** Port the existing four demos before adding new genres.
  Update every user-facing copy promise from "Six style directions · Nine
  interactive elements" to match four worlds, including the GamesIndex card,
  the Overview feature card, and the header dropdown. Six style directions
  remain a later expansion.
- **Split house chrome from diegetic stage.** The page frame uses the app's games
  identity. Each stage keeps its own typography, palette, radii, and motion. The
  genre distinction is the product.
- **Dedicated `GameLabShell`.** Do not use `GamePageShell` as-is: it is a
  design-bible shell with a "DESIGN BIBLE · DRAFT 1" footer, a narrow 4xl content
  width, and per-page font injection. Reuse its exported `Section` component for
  section labels.
- **Violet page accent.** `--t-world-violet` matches the UI Systems card accent
  (`#a080d0`) and distinguishes the lab from the gold game bibles.
- **Existing tokens only.** No new primitives in Phase 1. Page surfaces use
  `--t-ember-900`, `--t-panel-ember-*`, `--t-bone`, and the line/bone alpha ramps.
  If exact continuity with the card's `#0c0c14` is later required, add graphite
  primitives then.
- **No new dependencies.** React, framer-motion, lucide-react, and existing
  Tailwind/shadcn primitives are sufficient.
- **Page-scoped fonts.** Phase 1 adds only Press Start 2P. App display/mono/serif
  fonts are already global. The other demo fonts load in their respective phases.
- **Move the HTML reference.** After porting, move `Game UI Gallery.html` to
  `docs/reference/game-ui-gallery.html` (create the directory if absent). It is
  not shipped or imported.
- **HTML is the visual source of truth.** Port each demo faithfully before
  improving it. The four stages keep their own art direction; the lab shell does
  not restyle them.

## Architecture

```
src/components/games/
  uiSystemAccents.ts             // six-color UI Systems brand motif (shared)
  GameUI/
    GameUIPage.tsx               // composition root, no game logic
    GameLabShell.tsx             // hero, back link, accent strip, footer
    SpecimenFrame.tsx            // house chrome around a demo
    DemoErrorBoundary.tsx        // per-specimen isolation
    gameui.css                   // page-scoped font import + chrome helpers
    specs.ts                     // specimen metadata (id, title, genre, accent)
    shared/
      useGameKeys.ts             // scoped keydown handling
      useReducedMotion.ts        // media-query subscription
      usePersistentState.ts      // namespaced localStorage state
      useTypewriter.ts           // cancellable typewriter
    demos/
      PixelRpg/
        PixelRpgDemo.tsx         // view + composition
        pixel-rpg.module.css     // scoped diegetic styles
        logic.ts                 // pure reducer and selectors
        types.ts                 // state, actions, enemy/player types
```

### Component contracts

`GameLabShell`

```ts
interface GameLabShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  children: ReactNode;
}
```

Renders a back link labelled "ALL GAMES" to `/games`, a compact hero, a giant `04`
watermark, the six-accent strip shared with the GamesIndex card, and a footer
reading "INTERACTIVE LAB · DRAFT 1 · UI SYSTEMS". Content width is `1100px` to
give stages room while staying narrower than the viewport.

`SpecimenFrame`

```ts
interface SpecimenFrameProps {
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
```

Renders the specimen index, genre label, title in `--font-display`, description in
`--font-serif`, the stage container, and a footer with input hints in
`--font-mono` and an optional reset button labelled "RESET RUN". The frame owns
spacing, border, and labels only. The demo owns everything inside the stage.

`DemoErrorBoundary`

A class component with a themed fallback: specimen title, short message, and a
"Reload specimen" button that remounts the child. One specimen failure must not
take down the page.

### Shared hooks

- `useGameKeys(targetRef, handlers, options?)` attaches `keydown` to the specimen
  root, ignores events from inputs/textareas/contentEditable, and calls
  `preventDefault` only for configured keys. No `window` listeners.
- `useReducedMotion()` returns the current `prefers-reduced-motion` value and
  subscribes to changes.
- `usePersistentState<T>(key, initial)` reads once, guards malformed JSON, writes
  on change, and uses the `gameui:` namespace.
- `useTypewriter(text, speed, enabled)` returns `{ displayed, done, skip }`,
  cancels timers on text change/unmount, and never schedules after unmount.
- `useRafLoop` is intentionally deferred to Phase 2; the turn-based demo does not
  need a frame loop.

## Page design

- **Background:** `--t-ember-900` with a soft violet radial wash.
- **Hero:** eyebrow `GAME 04 · INTERACTIVE LAB`, title `UI SYSTEMS`, subtitle
  "Four worlds. Four interface languages. One component lab."
- **Accent strip:** the same six-color strip used by the UI Systems card, defined
  once in `src/components/games/uiSystemAccents.ts` and imported by both
  `GamesIndex.tsx` and `GameLabShell.tsx`. These are brand motif colors, not
  semantic tokens.
- **Section labels:** reuse `Section` from `GamePageShell.tsx` with the violet
  accent. Sections: `01 — SPECIMEN`, `02 — DESIGN NOTES`.
- **Specimen frame:** sharp edges, 1px violet-tinted border, dark panel, no heavy
  shadows. House chrome only.
- **Queue line:** below the specimen, a quiet line: "Next specimens: Abəde
  Backpack · Wardline · Apex Dash." This keeps the four-demo promise visible
  while Phase 1 ships one.
- **Design notes:** a static three-column block under the stage:
  - **Palette** — sky, slime, navy command box, white text.
  - **Type** — Press Start 2P at a single scale.
  - **Motion** — bob, shake, typewriter; all reduced-motion aware.
  - One "What to steal" line about showing cost and consequence before
    commitment.

### GamesIndex copy

Update `GamesIndex.tsx` so the card does not promise six finished style
directions. Replace line 69 with `// Four worlds · Four interface languages` and
adjust the paragraph to reference HUDs, inventory, combat logs, and cockpit
gauges. No layout or color changes.

Also align the other two user-facing promises:

- `src/pages/Overview.tsx:110` — description and tag currently promise "9
  interactive game UI elements" in "6 Styles". Change the description to a
  four-world lab that starts with a playable pixel JRPG and the tag to `4 Worlds`.
- `src/components/layout/Header.tsx:46` — sub-label currently says "Game UI
  Elements · 6 Styles". Change it to "Game UI Lab · 4 Worlds".

These are copy-only edits; no navigation structure changes.

## Pixel RPG specimen

The specimen is titled **Slime Road** and labelled **TURN-BASED JRPG**. The port
preserves the original art direction: cyan sky to grass gradient, Press Start 2P,
white on navy command box, slime SVG, yellow cursor, shake feedback. The stage
keeps its own CSS module and does not consume house chrome tokens except the
optional `--specimen-accent`.

### Mechanics in Phase 1

- Commands: FIGHT (6–10 damage), MAGIC (4 MP, 12–15 damage), ITEM (heal 15,
  consumes one potion), RUN (50% escape).
- Player: 40 HP, 12 MP, 2 potions.
- Enemy: `maxHp = 30 + (wave - 1) * 6`; damage `3 + floor(wave / 2)` to
  `8 + floor(wave / 2)`.
- Enemy turn after each non-escaped action.
- Enemy intent telegraph: `attack` or `charge`. Intent is chosen with a 30%
  chance of `charge` at wave start and after each enemy attack.   A `charge` turn
  deals no damage and announces the wind-up; the next enemy action is the doubled
  attack, after which a new intent is chosen. The enemy tracks a `charged` flag so
  the state can distinguish the wind-up turn from the release turn.
- RUN success ends the encounter and advances the wave with no HP/MP/potion
  recovery. RUN failure wastes the turn and the enemy attacks.
- Victory advances to the next wave after a 1.2s pause. HP, MP, and potions carry
  over; there is no automatic heal.
- One fairy revive per run: the first defeat restores the player to 20 HP and
  consumes the revive. A second defeat ends the run.
- Wave counter and best wave persisted under `gameui:pixel-rpg:best-wave`. The
  best wave is the furthest wave reached and updates on victory, escape, or
  defeat.
- Reset run restores the initial state but keeps the best wave.
- Damage numbers and a combat log with typewriter text (16ms per character,
  550ms hold). Damage numbers disappear after 900ms.
- Skip typewriter on click, Enter, or Space. While text is typing, that input is
  consumed by the skip and does not activate a command.
- Defeat shows a run summary and restart.

Deferred to Phase 2: multiple simultaneous enemies, target selection, party
members, XP/levels, equipment, items beyond potions, bosses.

### State model

```ts
type Phase = 'intro' | 'playerTurn' | 'resolving' | 'victory' | 'defeat';
type EnemyIntent = 'attack' | 'charge';

interface Enemy {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  intent: EnemyIntent;
  charged: boolean; // true after the wind-up; next attack deals double damage
}

interface Player {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  potions: number;
  revives: number;
}

interface CombatEvent {
  id: number;
  kind: 'damage' | 'heal' | 'miss';
  target: 'player' | 'enemy';
  value: number;
}

interface PixelRpgState {
  phase: Phase;
  wave: number;
  player: Player;
  enemy: Enemy;
  log: string[];
  message: string;
  lastEvent: CombatEvent | null;
  bestWave: number;
}
```

`logic.ts` exposes a pure `reduce(state, action, rng)` plus selectors such as
`canCastMagic`, `canUseItem`, and `isCommandEnabled`. RNG is injected so the
reducer can be unit-tested later without a test runner today. `log` is capped at
30 entries. `lastEvent.id` is monotonic so the view can detect new hits without
putting transient animation state in the reducer.

Phase transitions:

- `intro` — wave-start message; commands enable once the message completes or is
  skipped.
- `playerTurn` — commands enabled.
- `resolving` — action animation and enemy turn; commands locked.
- `victory` — wave clear; auto-advances after 1.2s.
- `defeat` — run over; restart available.

The React component dispatches actions, renders floating numbers from
`lastEvent`, and owns the victory and damage-number timers. `useTypewriter` owns
its own cancellable timer.

### Input

- Menu buttons are real `<button>` elements in a labelled group.
- Arrow keys move focus between commands; Enter/Space activates the focused
  command.
- `1`–`4` activate FIGHT/MAGIC/ITEM/RUN when focus is inside the specimen.
- Disabled commands use `aria-disabled="true"` so they remain focusable and can
  announce why; the reason is surfaced in the message/log and the command cannot
  execute.
- Pointer and touch use the same buttons; no drag required.
- Keys are scoped to the specimen root, not `window`.

### Accessibility

- Stage root: `role="group"` with `aria-label="Slime Road combat demo"`.
- Combat log: `aria-live="polite"` with the full sentence updated once; the
  visual typewriter is `aria-hidden` so screen readers are not spammed per
  character.
- HP/MP/potions: visible text plus hidden labels; no color-only state.
- Enemy HP: text value plus a bar; the bar is decorative and `aria-hidden`.
- Focus-visible ring on every command and the reset button.
- `prefers-reduced-motion` disables bob, shake, floating damage animation, and
  typewriter speed (text appears immediately).
- Contrast: white pixel text on the sky gets a subtle dark text shadow or
  backplate.

### Responsive behavior

- Desktop: 16:10 stage, content max 1100px.
- At container width below 480px: 4:3 stage, `font-size:
  clamp(11px, 2.2cqw, 22px)`, command grid remains 2×2.
- Touch targets are at least 44px tall on narrow stages.
- `touch-action: manipulation` on the stage; no scroll trapping.
- No horizontal overflow at 360px.

### Lifecycle and performance

- No frame loop. Turn-based animations are CSS transitions.
- Typewriter, victory pause, and damage-number removal use timers that are
  cancelled on unmount.
- Reducer is pure; no side effects in render.
- StrictMode-safe: no module-level mutable state, no duplicate listeners.
- localStorage is read during initialization only.
- One specimen mounts in Phase 1; Phase 2 adds pause-on-offscreen for real-time
  demos.

## Design system mapping

| UI element | Source |
|---|---|
| Page background | `--t-ember-900` |
| Panel surfaces | `--t-panel-ember-top/mid/deep` |
| Primary text | `--t-bone` |
| Muted text | `--t-bone-soft` / `--t-bone-faint` |
| Borders | `--t-line-strong` / `--t-line` |
| Page accent | `--t-world-violet` |
| Display type | `var(--font-display)` |
| Body type | `var(--font-serif)` |
| Labels / hints | `var(--font-mono)` |
| Chrome radii | Sharp (0–2px) to match the games family |
| Stage radii | Demo-owned (pixel UI stays square; cockpit stays round) |

Demo-specific colors stay inside the demo's CSS module. The frame uses only the
accent passed to it.

## Files touched

| File | Change |
|---|---|
| `src/components/games/GameUI/GameUIPage.tsx` | Replace placeholder with shell + specimen composition |
| `src/components/games/GameUI/GameLabShell.tsx` | New |
| `src/components/games/GameUI/SpecimenFrame.tsx` | New |
| `src/components/games/GameUI/DemoErrorBoundary.tsx` | New |
| `src/components/games/GameUI/gameui.css` | New; Press Start 2P import + page helpers |
| `src/components/games/GameUI/specs.ts` | New; specimen metadata |
| `src/components/games/uiSystemAccents.ts` | New; shared six-color brand motif |
| `src/components/games/GameUI/shared/*` | New hooks |
| `src/components/games/GameUI/demos/PixelRpg/*` | New port |
| `src/components/games/GamesIndex.tsx` | Copy update + import the shared accent strip |
| `src/pages/Overview.tsx` | Copy update for four worlds |
| `src/components/layout/Header.tsx` | Copy update for four worlds |
| `docs/reference/game-ui-gallery.html` | Moved reference artifact |

No changes to `AppRouter.tsx`, `GameLayout.tsx`, or `src/index.css`.

## Out of scope

- Porting Abode Backpack, Wardline, or Apex Dash (Phases 2–3).
- New fighting/horror/strategy specimens (later phase).
- Sound, attract mode, tune panel, inspect overlay, fullscreen dialog (Phase 4).
- Multi-enemy targeting, party members, XP, equipment, bosses (Phase 2).
- Adding a test runner. The reducer is written to be testable; unit tests follow
  when Vitest is approved.
- Redesigning `GamePageShell` or the other game pages.
- Navigation structure changes. The header edit above is copy only.

## Verification

- `npm run build` passes (TypeScript strict + Vite).
- `npm run lint` passes.
- `/games/ui` renders the shell and Pixel RPG; no console errors.
- Original mechanics work: FIGHT, MAGIC, ITEM, RUN, enemy turn, one-revive
  rule, restart.
- Keyboard-only play works: arrows move focus, Enter/Space activate, 1–4
  shortcuts.
- Reduced-motion mode removes bob/shake/floating animation and shows log text
  immediately.
- 360 / 768 / 1280 widths: readable, no horizontal scroll, touch targets usable.
- Best wave persists across reload; reset restores the run and keeps the best.
- StrictMode development run does not duplicate actions, timers, or listeners.
- A forced child error is contained by the specimen boundary (manual dev check).
- `rg "document.querySelector|addEventListener\('keydown'"` finds no occurrences
  in the new demo outside the scoped hook.
- GamesIndex card copy matches the four-specimen plan and no longer promises six.

## Acceptance criteria

1. `/games/ui` looks like part of the games section: ember surfaces, bone text,
   violet accent, Bebas/Space Mono/Crimson chrome.
2. The Pixel RPG stage still looks like the original pixel JRPG, not like the
   house theme.
3. The page is a reusable contract, not a one-off: `SpecimenFrame` and the hooks
   can host the remaining three demos without redesign.
4. The port has no fixed DOM IDs, no global CSS leakage, no global key listeners,
   and no leaked timers.
5. The original four commands and combat loop remain intact, with the Phase 1
   additions (intent telegraph, one-revive limit, game over, best wave, keyboard)
   clearly working.
6. `npm run build` and `npm run lint` pass.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Pixel text too small on mobile | `clamp()` + 4:3 mobile stage; test at 360px |
| CSS module bleed / global class collisions | All demo styles scoped in `pixel-rpg.module.css`; no IDs |
| StrictMode duplicate effects | Cleanup in every effect; pure reducer; refs for timers |
| Typewriter timer updates after unmount | Cancelled flag + cleanup in `useTypewriter` |
| Font import order or FOUT | `@import` first in `gameui.css`; `display=swap` |
| Scope creep into the other demos | Phase 1 ships one specimen; queue line documents the rest |
| Page feels like a design-bible page | `GameLabShell` replaces the bible shell; frame is compact |
| Card/page promise mismatch | Copy update in `GamesIndex.tsx` in the same change |
