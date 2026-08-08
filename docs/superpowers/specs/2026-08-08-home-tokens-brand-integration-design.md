# Home Page — Brand Token Integration

**Date:** 2026-08-08
**Status:** Approved

## Goal

Update `src/pages/Home.tsx` to use the brand-centralized token system defined in
`src/index.css` instead of inline hex/rgba literals, with **zero visual change**.

## Scope

- `src/pages/Home.tsx` — replace all inline color values and font families with `var(--t-*)`.
- `src/index.css` — add any missing primitives needed for exact color preservation.
- No structural, layout, or behavioral changes.
- No other files touched.

## Token mappings (1:1, output identical)

| Hardcoded value | Token |
|---|---|
| `#06080f` | `--t-navy-800` |
| `#4d8fc8` | `--t-accent` |
| `#7eb8e8` | `--t-accent-b` |
| `#c9962b` | `--t-gold` |
| `#e8b84b` | `--t-gold-b` |
| `#f5f0e8` | `--t-bone` |
| `#7ec87e` | `--t-world-green` |

## New primitives (added to `:root` in `index.css`)

### White-on-navy alpha ramp (replaces `rgba(255,255,255,x)`)

| Token | Value | Replaces |
|---|---|---|
| `--t-ink-strong` | `oklch(1 0 0 / 0.68)` | `rgba(255,255,255,0.68)` |
| `--t-ink-muted` | `oklch(1 0 0 / 0.30)` | `rgba(255,255,255,0.30)` |
| `--t-ink-faint` | `oklch(1 0 0 / 0.22)` | `rgba(255,255,255,0.22)` |
| `--t-ink-dim` | `oklch(1 0 0 / 0.15)` | `rgba(255,255,255,0.15)` |
| `--t-line` | `oklch(1 0 0 / 0.06)` | `rgba(255,255,255,0.06)` |
| `--t-line-faint` | `oklch(1 0 0 / 0.04)` | `rgba(255,255,255,0.04)` |
| `--t-line-strong` | `oklch(1 0 0 / 0.10)` | `rgba(255,255,255,0.10)` |

### Bone ramp (replaces `rgba(245,240,232,x)`)

| Token | Oklch | Replaces |
|---|---|---|
| `--t-bone-soft` | `oklch(0.9566 0.0119 79.8 / 0.30)` | `rgba(245,240,232,0.30)` |
| `--t-bone-faint` | `oklch(0.9566 0.0119 79.8 / 0.26)` | `rgba(245,240,232,0.26)` |

### Panel gradient stops (exact hex → oklch, derived at implementation)

| Token | Replaces |
|---|---|
| `--t-panel-navy-top` | playground gradient stop `#071830` |
| `--t-panel-navy-mid` | playground gradient stop `#050d1c` |
| `--t-panel-navy-deep` | playground gradient stop `#030810` |
| `--t-panel-ember-top` | games gradient stop `#130c00` |
| `--t-panel-ember-mid` | games gradient stop `#0c0800` |
| `--t-panel-ember-deep` | games gradient stop `#07050a` |

Exact oklch values for the six gradient stops are derived from their hex values during
implementation so hue/lightness are preserved precisely; the sRGB fallback stays the
same hex so there is no browser-visible shift.

## `Home.tsx` changes

1. Replace every inline color in `style={{ ... }}` with `var(--t-*)`.
2. `GAME_LINKS` `color` fields → `var(--t-*)` so hover tints stay consistent.
3. Font families:
   - `Inter, system-ui, sans-serif` → `var(--font-sans)`
   - `monospace` → `var(--font-mono)`
   - `"Bebas Neue", sans-serif` → `var(--font-display)`
4. Keep `opacity` numbers as-is (they are not colors).
5. No `rgba()` literals remain; no `#` hex literals remain in `Home.tsx`.

## Gradients that stay as-is (already tokenized)

- `linear-gradient(90deg, #4d8fc8, #7eb8e8)` → token components (`--t-accent`, `--t-accent-b`)
- `linear-gradient(270deg, #c9962b, #e8b84b)` → token components (`--t-gold`, `--t-gold-b`)

## Success criteria

- `npm run dev` compiles clean, no PostCSS/lint warnings.
- Visual diff of the home page shows no change.
- `Home.tsx` contains zero hex and zero `rgba()` literals.