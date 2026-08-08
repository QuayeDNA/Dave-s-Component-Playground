# Reusable viewport-aware dropdown for 3D scene cards

**Date:** 2026-08-08
**Status:** Approved design, ready for implementation plan

## Goal

Replace the inline geometry-option buttons in `GeometryShowcase` (the "Geometry
Selector" card on the 3D Animations page) with a single, reusable dropdown that:

1. Is **a reusable component** (future scenes will use the same approach).
2. Is **not capped within the card** — the menu must escape the card's
   `overflow-hidden` canvas slot.
3. Is **viewport-aware** — the menu flips side/alignment so it never renders
   off-screen.
4. Keeps the card visually clean and keyboard-navigable.

## Context

`src/components/ui/` already contains the shadcn/Radix component library,
including `dropdown-menu.tsx`. Radix provides two requirements for free:

- `DropdownMenuPrimitive.Portal` renders menu content outside the React tree,
  so the card's `overflow-hidden` clip (fixed 220px canvas slot in
  `ShowcaseCard.tsx`) can never cut it off.
- Collision detection (`side`, `align`, `sideOffset`, default `avoidCollisions`)
  flips placement to keep the menu within the viewport. Keyboard/focus
  management (arrows, Enter, Escape, focus return, click-outside) is built in.

We build on Radix rather than hand-rolling portal + flip + a11y logic.

## Decision

- **New component:** `src/components/ui/dropdown.tsx`, a thin,
  purpose-built dropdown wrapper on the existing Radix primitives
  (`DropdownMenu`, `Trigger`, `Content`, `RadioGroup`, `RadioItem`).
- **Naming:** lowercase-kebab, matching sibling `ui/` files
  (e.g. `dropdown-menu.tsx`).
- **Default styling:** dark (project tokens — `bg-popover`,
  `text-popover-foreground`). Light menu via `contentClassName` override.
- **First consumer:** `GeometryShowcase` uses a light menu to match its
  `#f0f4f8` canvas.

## Component API — `src/components/ui/dropdown.tsx`

```tsx
interface DropdownOption<T extends string | number> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<DropdownOption<T>>;
  label?: string;                 // optional title line inside the menu
  align?: 'start' | 'center' | 'end'; // default 'end'
  trigger?: (open: boolean) => ReactNode; // escape hatch for custom triggers
  triggerClassName?: string;      // applied to default trigger button
  contentClassName?: string;      // extends default menu classes
}
```

### Default trigger

Compact pill: current option's label + `ChevronDown`. Active state tints the
border/background. `aria-label` derives from the selected option's label.

### Menu content

- Dark-by-default classes: `bg-popover text-popover-foreground border rounded-md shadow-md`
- `DropdownMenuRadioGroup` + `DropdownMenuRadioItem` per option (Radix renders a
  selection dot and enforces single-selection semantics).
- `max-h-72 overflow-y-auto` so long lists scroll instead of overflowing.
- `collisionPadding` ~8 keeps the menu off the viewport edges.
- `value`/`onChange` map to RadioGroup value; selecting an option closes the
  menu (Radix default) and calls `onChange`.

## Integration — `scenes/GeometryShowcase.tsx`

- Remove the inline dropdown button/menu block.
- Keep an anchored overlay for the trigger:
  `<div className="absolute top-2 right-2 z-20">` wrapping the `<Dropdown>`.
- Light styling for this card:
  - trigger: translucent white pill (`rgba(255,255,255,0.75)`), blue active tint
  - `contentClassName`: white menu + slate text (override dark default)
- Geometry data and swap (`GEO_OPTIONS`, memoised-geometry `GeoMesh`) unchanged.
- `g` labels map 1:1 to `DropdownOption`s.

## Behavior

- Keyboard: arrows navigate, Enter selects, Escape closes (Radix defaults).
- Focus returns to trigger on close.
- Outside click / pointer interaction closes.
- Portal output is position:fixed — unaffected by scene/card CSS.

## Out of scope

- No change to the render-loop gating (`SceneActive`, `frameloop`).
- No restyling of other scene controls, other than what the shared default
  provides.
- No new dependencies (builds on existing `@radix-ui/react-dropdown-menu`).

## Verification

- `npx tsc -b` passes.
- `npm run build` passes (already gated on tsc).
- Manual: run `npm run dev`, open the 3D Animations page, confirm the menu
  opens downward/in view at the top-right of the Geometry card, never renders
  clipped, and can flip when the card is near the viewport bottom.