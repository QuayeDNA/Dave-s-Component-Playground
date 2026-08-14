# Abode Bible Evolution — Design Spec

**Date:** 2026-08-14
**Status:** Approved (design)
**Game:** Abode (Abɔde) — Game 02 of 03, survival narrative set in Ghana

## Overview

The Abode "game bible" currently exists as a single 1176-line React component
(`src/components/games/AbodePage.tsx`) styled as a classified military dossier.
This spec covers three evolutions requested by the game's author:

1. **Story polish** — fill deliberate gaps (Antagonist identity, Zombie Stage 4,
   Act III location, placeholder NPC name) and strengthen existing prose.
2. **Development progress tracking** — a separate dev-tracker page (production
   dashboard) reachable only from the Abode page.
3. **Asset showcase** — an "Evidence Locker" section that inventories required
   assets and renders real files when present.

A data-layer refactor makes all three possible and maintainable: content moves
into typed data modules that become the single source of truth, consumed by both
the bible page and the tracker page.

## Design

### 1. Data architecture

Create `src/data/abode/` containing:

| File | Contents |
|---|---|
| `theme.ts` | Dossier tokens (colors `G`, `WARN`, `PALE`, `BG`, `SURF`, `BORD`), font strings, CSS helper strings, and a small `TITLE` config object (name, tagline, draft version) so a later rename is a one-line change |
| `types.ts` | Shared types and status enums |
| `characters.ts` | Personnel dossiers (incl. finalized antagonist) |
| `zones.ts` | Operational-map zones + zone visuals |
| `beats.ts` | Dual-track timeline beats |
| `systems.ts` | Systems Manual entries |
| `research.ts` | Research entries + categories |
| `incidents.ts` | Incident-log phases |
| `development.ts` | Milestones/roadmap, per-system feature status, narrative-beat status |
| `assets.ts` | Asset manifest |

**Status enums** (`types.ts`):
- Feature/system: `concept → inProgress → built → tested → shipped`
- Narrative beat: `draft → finalized → locked`
- Asset: `concept → inProduction → final → integrated`
- Milestone: `planned → active → completed`

**Refactor:** `AbodePage.tsx` is reduced to a pure renderer. Every section reads
from the data modules. No content remains inline in the component.

### 2. Story content

All gaps are filled with authored content. Placeholders and CLASSIFIED markers
are resolved unless intentionally kept as in-fiction mystery.

- **Antagonist:** `COL. YAW OPOKU (RET.)`. Served with Kwame in ECOMOG
  peacekeeping in Liberia (1990s). During the Monrovia evacuation the two faced
  a defining choice — Kwame loaded families against orders, Opoku enforced
  strict order. Opoku concluded order is what saves people. His faction sorts
  civilians and deliberately collects **unaccompanied children** ("the seed"),
  moving them north to a facility he calls **the Ark**. Kofi was swept up because
  he was separated from Ama. The children were not taken by accident.
- **Zombie Stage 4:** "The Recalled." The dead whose transition broke so
  completely they begin to remember. They do not attack — they recognize, and
  reproduce the voices of the living they loved. Encounters with them reframe the
  ending around the cosmological dread established in the Research section;
  neither the scientific nor the spiritual explanation is confirmed.
- **Nurse Akosua:** finalized to `NURSE AKOSUA AMOAH` (drop `[TEMP]`).
- **Act III location:** repurposed colonial-era teacher-training college outside
  Tamale, internally called **the Ark**.
- **Operational Map:** replace the "ASSET PENDING CLEARANCE" placeholder with a
  real interactive SVG silhouette of Ghana using the existing 4 zone nodes and
  their coordinates. Clickable nodes reveal status/threat/resources/intel.
  Styled as a hand-annotated field map.
- **Copy polish:** strengthen prose throughout; reconcile inconsistencies
  (2D side-scroller vs. survival-strategy framing; status labels); bump the
  draft version (hero + footer).

### 3. Dev tracker page

New route `/games/abode/dev-tracker`, sharing the dossier theme via `theme.ts`.

- Header with title, overall progress percent (computed from data), and
  per-category summary chips.
- Tabs:
  - **Roadmap & Milestones** — vertical slice → playable demo → alpha → beta →
    launch; each with status, notes, checklist items.
  - **Systems** — the 8 Systems Manual entries, each with feature status + notes.
  - **Narrative** — the dual-track beats with story status + "known to Kwame" flag.
  - **Asset Pipeline** — the same `assets.ts` manifest grouped by category.
- Per-tab status filters.
- All progress figures are computed from data — no hardcoded percentages.

### 4. Evidence Locker (asset showcase)

New bible section **12 — Evidence Locker: Asset Registry**, reading `assets.ts`.

- Each asset: `id`, `category`, `name`, `status`, `reference/source`,
  optional `src` path.
- Raw asset files live under `public/abode/` (URLs like `/abode/xxx.png`).
- Present file → rendered as a dossier-styled exhibit (image or audio player).
- Missing file → styled pending block reusing the existing placeholder visual
  language.
- Same data feeds the tracker's Asset Pipeline tab; status updates appear in
  both places.

### 5. Integration & navigation

- Register `/games/abode/dev-tracker` in `src/router/AppRouter.tsx`.
- **Tracker reachable only from the Abode page** (no global Sidebar entry):
  "OPEN PRODUCTION TRACKER" link on the bible page; "RETURN TO BIBLE" link on
  the tracker.
- Verify with `npm run build`.

## Out of scope

- Renaming the game title (deferred by the user; the data layer makes it trivial
  later via `theme.ts`).
- Creating actual art/audio asset files (only the manifest + embed-when-present
  mechanism ships).
- Global navigation changes beyond the two page links above.

## Verification

- `npm run build` (typecheck + vite build) passes.
- Tracker route renders; links between bible and tracker work.
- Op Map renders interactive zones; Evidence Locker renders pending blocks (no
  asset files exist yet).
