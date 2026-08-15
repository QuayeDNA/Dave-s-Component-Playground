# Reusable Viewport-Aware Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable, viewport-aware `Dropdown` component (`src/components/ui/dropdown.tsx`) and use it to replace GeometryShowcase's inline geometry buttons.

**Architecture:** A thin wrapper over the existing shadcn/Radix `dropdown-menu.tsx` (which portals content out of the card's `overflow-hidden` clip and flips placement via Radix collision detection). The component exposes a controlled `value`/`options`/`onChange` API with a default compact pill trigger; scenes can override trigger/menu styling via className props.

**Tech Stack:** React 18, TypeScript, Radix UI (`@radix-ui/react-dropdown-menu` via existing `src/components/ui/dropdown-menu.tsx`), `lucide-react` icons, `tailwind-merge` via `cn` from `@/lib/utils`.

## Global Constraints

- No new dependencies (build on existing `@radix-ui/react-dropdown-menu` and `lucide-react`).
- Default menu styling is dark (project tokens `bg-popover text-popover-foreground`); light overrides come from `contentClassName`.
- Geometry swap logic in `GeometryShowcase` (`GEO_OPTIONS`, memoised `THREE.BufferGeometry` in `GeoMesh`) must not change.
- Naming matches repo convention (lowercase-kebab, e.g. `dropdown-menu.tsx`).
- Do NOT use `npm run lint`: the repo's ESLint config is currently broken on every file (rule-loading crash), unrelated to this work. Verify with `npx tsc -b` and `npm run build` instead.
- There is no test runner; the per-task test cycle is the TypeScript check + production build.

Reference: `docs/superpowers/specs/2026-08-08-reusable-viewport-dropdown-design.md`

---
### Task 1: Create the reusable `Dropdown` component

**Files:**
- Create: `src/components/ui/dropdown.tsx`

**Interfaces:**
- Consumes: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuLabel` from `@/components/ui/dropdown-menu`; `cn` from `@/lib/utils`; `ChevronDown` from `lucide-react`.
- Produces:
  - `export interface DropdownOption<T extends string | number> { value: T; label: React.ReactNode; disabled?: boolean }`
  - `export interface DropdownProps<T extends string | number> { value: T; onChange: (value: T) => void; options: ReadonlyArray<DropdownOption<T>>; label?: string; align?: 'start' | 'center' | 'end'; trigger?: (open: boolean) => ReactNode; triggerClassName?: string; contentClassName?: string }`
  - `export function Dropdown<T extends string | number>(props: DropdownProps<T>): React.ReactElement`

- [ ] **Step 1: Create the component file**

`src/components/ui/dropdown.tsx`:

```tsx
import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface DropdownOption<T extends string | number> {
  value: T
  label: React.ReactNode
  disabled?: boolean
}

export interface DropdownProps<T extends string | number> {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<DropdownOption<T>>
  label?: string
  align?: "start" | "center" | "end"
  trigger?: (open: boolean) => React.ReactNode
  triggerClassName?: string
  contentClassName?: string
}

export function Dropdown<T extends string | number>({
  value,
  onChange,
  options,
  label,
  align = "end",
  trigger,
  triggerClassName,
  contentClassName,
}: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false)
  const selected = options.find(o => o.value === value)

  const defaultTrigger = (isOpen: boolean) => (
    <button
      type="button"
      aria-label={typeof selected?.label === "string" ? `Select ${selected.label}` : "Dropdown"}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
        "border-border bg-background text-foreground hover:bg-accent",
        isOpen && "bg-accent",
        triggerClassName,
      )}
    >
      <span>{selected ? selected.label : ""}</span>
      <ChevronDown className="h-3 w-3 opacity-60" />
    </button>
  )

  const triggerNode = trigger ?? defaultTrigger

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{triggerNode(open)}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={6}
        collisionPadding={8}
        className={cn("max-h-72 overflow-y-auto p-1", contentClassName)}
      >
        {label ? <DropdownMenuLabel>{label}</DropdownMenuLabel> : null}
        <DropdownMenuRadioGroup
          value={String(value)}
          onValueChange={v => {
            onChange(v as T)
            setOpen(false)
          }}
        >
          {options.map(opt => (
            <DropdownMenuRadioItem
              key={String(opt.value)}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

Note: the default trigger reads its open-state style from the `isOpen` param, so no `data-state` coupling is needed — the component owns `open`. `collisionPadding={8}` and `align` are passed straight to Radix, which flips placement in the Portal — this is what keeps the menu in the viewport and out of the card's `overflow-hidden` clip.

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: exits 0, no output. (Only `tsconfig.app.tsbuildinfo` touched by the build.)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/dropdown.tsx tsconfig.app.tsbuildinfo
git commit -m "feat: add reusable viewport-aware dropdown component"
```

---
### Task 2: Integrate `Dropdown` into GeometryShowcase

**Files:**
- Modify: `src/components/Animations/threeD/scenes/GeometryShowcase.tsx`

**Interfaces:**
- Consumes: `Dropdown` from `@/components/ui/dropdown` (API from Task 1): `{ value, onChange, options, contentClassName, triggerClassName }`.
- Produces: the Geometry Selector card with the geometry picker menu rendered via portal (not the card's clip), viewport-flipped, light-styled.

- [ ] **Step 1: Replace the inline dropdown with the shared component**

Open `src/components/Animations/threeD/scenes/GeometryShowcase.tsx` and make these changes:

Add import before the `Scene` import:

```tsx
import { Dropdown } from "../../../ui/dropdown"
```

Remove the now-unused `ChevronDown` import (line `import { ChevronDown } from 'lucide-react';`) — delete the line.

Delete the whole `<div className="absolute top-2 right-2 z-20"> ... </div>` block at the bottom of `GeometryShowcase` (the button + conditional menu). Replace it with:

```tsx
        {/* Dropdown — portals out of the canvas card, viewport-aware */}
        <div className="absolute top-2 right-2 z-20">
          <Dropdown
            value={geo}
            onChange={setGeo}
            options={GEO_OPTIONS.map(g => ({ value: g, label: g }))}
            contentClassName="w-40 bg-white/95 border-slate-200 text-slate-600 shadow-lg"
            triggerClassName="border-slate-300 bg-white/75 text-slate-700 backdrop-blur"
          />
        </div>
```

Also remove the `const [open, setOpen] = useState(false);` line inside `GeometryShowcase` (the shared component owns its open state). The result should be:

```tsx
const GeometryShowcase: React.FC = () => {
  const [geo, setGeo] = useState<GeoName>('Box');
  return (
    <div className="flex flex-col h-full">
      <div className="relative" style={{ flex: 1 }}>
        <Scene camera={[0, 0, 4]} lightBg>
          <GeoMesh geo={geo} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Scene>

        {/* Dropdown triggers portal, viewport-aware */}
        <div className="absolute top-2 right-2 z-20">
          <Dropdown
            value={geo}
            onChange={setGeo}
            options={GEO_OPTIONS.map(g => ({ value: g, label: g }))}
            contentClassName="w-40 bg-white/95 border-slate-200 text-slate-600 shadow-lg"
            triggerClassName="border-slate-300 bg-white/75 text-slate-700 backdrop-blur"
          />
        </div>
      </div>
    </div>
  );
};
```

Verify the file top still imports `useState` (used for `geo`). Remove `ChevronDown` from imports; keep `useMemo`, `useRef`, `useState`.

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: PASS — 0 errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: PASS — vite bundles, exit code 0.

- [ ] **Step 4: Manual verification (dev server)**

Run: `npm run dev`, open the 3D Animations page at route `animations/3d`.

Check:
1. Geometry Selector card: the pill trigger shows the current geometry (default "Box"). Click it — a white menu appears and is never clipped by the card.
2. Position the page so the card is near the bottom of the viewport → the menu flips to stay on screen.
3. Keyboard: Tab to the trigger, Enter opens, arrows move the highlight, Enter selects, Escape closes.
4. Selecting a geometry (Box/Sphere/Torus/Octahedron/Cone) swaps the 3D object in the canvas.

- [ ] **Step 5: Commit**

```bash
git add src/components/Animations/threeD/scenes/GeometryShowcase.tsx tsconfig.app.tsbuildinfo
git commit -m "refactor: use reusable Dropdown in GeometryShowcase"
```