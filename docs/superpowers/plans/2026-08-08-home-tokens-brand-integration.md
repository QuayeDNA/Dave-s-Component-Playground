# Home Page Brand-Token Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every inline hex/rgba color and hardcoded font in `src/pages/Home.tsx` with the brand token system from `src/index.css`, with zero visual change.

**Architecture:** Extend the existing `--t-*` primitive system in `src/index.css` with the 15 tokens the Home page needs (white/bone alpha ramps + six panel-gradient stops), then swap all `Home.tsx` inline `style` values and `GAME_LINKS` colors to `var(--t-*)` / `var(--font-*)`. No component structure changes.

**Tech Stack:** React + TypeScript + Vite, Tailwind v4, CSS custom properties (oklch).

## Global Constraints

- Zero visual change: every new token must resolve to exactly the hex it replaces (verified by round-trip — see Task 1).
- Do not modify anything outside `src/index.css` and `src/pages/Home.tsx`.
- Do not touch `Header.tsx` or `Layout.tsx` (they already follow the token convention).
- Keep `opacity:` numbers as inline styles; only colors and font families become tokens.
- No `rgba()` or `#hex` literals may remain in `Home.tsx` when done.
- Follow existing `index.css` conventions: oklch values with `/* #hex */` comments, token blocks grouped by identity with `────` section headers.

---

### Task 1: Add brand tokens to `src/index.css`

**Files:**
- Modify: `src/index.css` (inside `:root { ... }` block, after the existing `--t-world-pink` line at line 53, before the `/* ── Base layer` comment at line 55)

**Interfaces:**
- Produces: CSS custom properties `--t-ink-strong`, `--t-ink-muted`, `--t-ink-faint`, `--t-ink-dim`, `--t-line`, `--t-line-soft`, `--t-line-faint`, `--t-line-strong`, `--t-bone-soft`, `--t-bone-faint`, `--t-panel-navy-top`, `--t-panel-navy-mid`, `--t-panel-navy-deep`, `--t-panel-ember-top`, `--t-panel-ember-mid`, `--t-panel-ember-deep` (Task 2 consumes these).

- [ ] **Step 1: Insert the new primitive tokens**

Insert this block into `:root { ... }` right after the `--t-world-pink` line:

```css
  /* ── Primitives · ink alpha ramp (playground) ────────────── */
  --t-ink-strong:  oklch(1 0 0 / 0.68);   /* white @ 68% */
  --t-ink-muted:   oklch(1 0 0 / 0.30);   /* white @ 30% */
  --t-ink-faint:   oklch(1 0 0 / 0.22);   /* white @ 22% */
  --t-ink-dim:     oklch(1 0 0 / 0.15);   /* white @ 15% */
  --t-line:        oklch(1 0 0 / 0.06);   /* white @  6% */
  --t-line-soft:   oklch(1 0 0 / 0.05);   /* white @  5% */
  --t-line-faint:  oklch(1 0 0 / 0.04);   /* white @  4% */
  --t-line-strong: oklch(1 0 0 / 0.10);   /* white @ 10% */

  /* ── Primitives · bone alpha ramp (games) ────────────────── */
  --t-bone-soft:  oklch(0.9568 0.0119 79.8 / 0.30);  /* bone @ 30% */
  --t-bone-faint: oklch(0.9568 0.0119 79.8 / 0.26);  /* bone @ 26% */

  /* ── Primitives · panel gradients (playground) ───────────── */
  --t-panel-navy-top:  oklch(0.2098 0.0530 257.2);  /* #071830 */
  --t-panel-navy-mid:  oklch(0.1599 0.0348 260.0);  /* #050d1c */
  --t-panel-navy-deep: oklch(0.1319 0.0217 252.0);  /* #030810 */

  /* ── Primitives · panel gradients (games) ────────────────── */
  --t-panel-ember-top:  oklch(0.1594 0.0326 87.5);  /* #130c00 */
  --t-panel-ember-mid:  oklch(0.1360 0.0279 94.2);  /* #0c0800 */
  --t-panel-ember-deep: oklch(0.1220 0.0141 304.9); /* #07050a */
```

- [ ] **Step 2: Verify the oklch values round-trip to the exact hex**

Run the following and confirm each output hex matches the comment on its token (especially the navy `#06080f` → `oklch(0.1356 0.0164 269.4)` sanity check, which already exists in the file and must be unchanged):

```bash
node -e "
function oklch2srgb(L,C,H){const h=H*Math.PI/180,a=C*Math.cos(h),b=C*Math.sin(h);
const l_=L+0.3963377774*a+0.2158037573*b,m_=L-0.1055613458*a-0.0638541728*b,s_=L-0.0894841775*a-1.2914855480*b;
const l=l_**3,m=m_**3,s=s_**3;
let r=+4.0767416621*l-3.3077115913*m+0.2309699292*s,g=+1.2684380046*l-2.6097574011*m+0.3413193965*s,b2=-0.0041960863*l-0.7034186147*m+1.7076147010*s;
const g2=(c)=>{c=c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055;return Math.round(c*255);};
return [g2(r),g2(g),g2(b2)].map(v=>v.toString(16).padStart(2,'0')).join('');}
[[0.2098,0.0530,257.2],[0.1599,0.0348,260.0],[0.1319,0.0217,252.0],[0.1594,0.0326,87.5],[0.1360,0.0279,94.2],[0.1220,0.0141,304.9]].forEach(v=>console.log(oklch2srgb(...v)));
"
```

Expected output:
```
071830
050d1c
030810
130c00
0c0800
07050a
```

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add ink/bone alpha and panel-gradient brand tokens"
```

---

### Task 2: Rewire `Home.tsx` to use the brand tokens

**Files:**
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: all tokens produced in Task 1, plus pre-existing tokens `--t-navy-800`, `--t-accent`, `--t-accent-b`, `--t-gold`, `--t-gold-b`, `--t-bone`, `--t-world-green`, and font tokens `--font-sans`, `--font-mono`, `--font-display`.
- Produces: no new interfaces (pure presentation swap).

- [ ] **Step 1: Tokenize `GAME_LINKS` colors**

Replace lines 20-22 so `color` values use tokens instead of hex:

```tsx
const GAME_LINKS = [
  { label: 'Irregular', sub: 'Metroidvania · Shapeshifting · Identity', path: '/games/irregular', color: 'var(--t-accent-b)', num: '01' },
  { label: 'Abɔde', sub: 'Survival · Ghana · Family', path: '/games/abode', color: 'var(--t-world-green)', num: '02' },
  { label: 'Gold & Iron', sub: 'Historical · Gold Coast · Saga', path: '/games/gold-and-iron', color: 'var(--t-gold)', num: '03' },
];
```

- [ ] **Step 2: Tokenize the page background + fonts (root div)**

Replace the root div's `style` (line 35):

```tsx
style={{ background: 'var(--t-navy-800)', fontFamily: 'var(--font-sans)' }}
```

- [ ] **Step 3: Tokenize the brand strip**

Replace the brand strip's `borderBottom` color (line 40), logo colors (line 45), and the two muted text colors (lines 49, 53):

```tsx
style={{ borderBottom: '1px solid var(--t-line-soft)' }}
```
```tsx
style={{ background: 'var(--t-accent)', color: 'var(--t-navy-800)' }}
```
```tsx
style={{ color: 'var(--t-ink-dim)', opacity: 0.6, fontFamily: 'var(--font-sans)' }}
```
```tsx
style={{ color: 'var(--t-ink-dim)', opacity: 0.15, fontFamily: 'var(--font-mono)' }}
```

- [ ] **Step 4: Tokenize the Playground panel**

Apply these replacements within the left panel:

Background (line 69):
```tsx
background: 'linear-gradient(140deg, var(--t-panel-navy-top) 0%, var(--t-panel-navy-mid) 60%, var(--t-panel-navy-deep) 100%)',
```
Desktop border (line 83): `background: 'var(--t-line-soft)'`
Mobile border (line 88): `background: 'var(--t-line)'`
Eyebrow text (line 96): `style={{ color: 'var(--t-accent)', opacity: 0.6, fontFamily: 'var(--font-mono)' }}`
Description (line 105): `style={{ color: 'var(--t-ink-muted)', maxWidth: 280 }}`
Link icon (line 122): `style={{ color: 'var(--t-accent)', opacity: 0.65 }}`
Link label (line 124): `style={{ color: 'var(--t-ink-strong)' }}`
Link subtitle (line 127): `style={{ color: 'var(--t-ink-faint)' }}`
CTA (line 140): `style={{ color: 'var(--t-accent)' }}`
Accent sweep (line 152): `background: 'linear-gradient(90deg, var(--t-accent), var(--t-accent-b))'`
Mobile top accent (line 159): `background: 'linear-gradient(90deg, var(--t-accent) 0%, transparent 70%)'`

- [ ] **Step 5: Tokenize the Games panel**

Apply these replacements within the right panel:

Background (line 167):
```tsx
background: 'linear-gradient(140deg, var(--t-panel-ember-top) 0%, var(--t-panel-ember-mid) 60%, var(--t-panel-ember-deep) 100%)',
```
Eyebrow text (line 183): `style={{ color: 'var(--t-gold)', opacity: 0.6, fontFamily: 'var(--font-mono)' }}`
Heading (line 188): change `color: '#f5f0e8'` → `color: 'var(--t-bone)'`
Description (line 192): `style={{ color: 'var(--t-bone-soft)', maxWidth: 280 }}`
Game num (line 211): `style={{ color: game.color, opacity: 0.4, fontFamily: 'var(--font-mono)', minWidth: '1.4rem' }}`
Game label (lines 217-224): replace `fontFamily: '"Bebas Neue", sans-serif'` with `fontFamily: 'var(--font-display)'`
Game subtitle (line 228): `style={{ color: 'var(--t-bone-faint)' }}`
CTA (line 241): `style={{ color: 'var(--t-gold)' }}`
Accent sweep (line 253): `background: 'linear-gradient(270deg, var(--t-gold), var(--t-gold-b))'`
Mobile bottom accent (line 260): `background: 'linear-gradient(90deg, var(--t-gold) 0%, transparent 70%)'`

- [ ] **Step 6: Tokenize the footer hint**

Replace the footer border (line 274) and text color (line 276):

```tsx
style={{ borderTop: '1px solid var(--t-line-faint)' }}
```
```tsx
style={{ color: 'var(--t-line-strong)', opacity: 0.3 }}
```

- [ ] **Step 7: Verify no raw colors remain in `Home.tsx`**

Run the following; it must print nothing (empty output):

```bash
rg -n "#[0-9a-fA-F]{3,8}|rgba?\(" src/pages/Home.tsx
```

Also confirm the only `opacity:` usage is still there (they're intentional) and no `color:`/`background:` still carries a literal.

- [ ] **Step 8: Typecheck and build**

Run: `npm run build`
Expected: compiles clean, no TS errors, no Vite/PostCSS warnings.

- [ ] **Step 9: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "refactor: use brand tokens in Home page"
```

---

### Task 3: Visual verification

**Files:** none (read-only verification)

- [ ] **Step 1: Start the dev server and compare against the last known-good state**

Run: `npm run dev`
Open `http://localhost:5173/` and confirm:
- Home page renders both panels with identical gradient colors to before (no blue shift in the Playground panel, no warm shift in the Games panel).
- All faint text/borders look the same as before (no change in contrast levels).
- Hover a Game link in the right panel: the title still tints to its world color.
- Hover both panels: the grow/shrink + accent sweep animations still work.

If any color looks off, the token value is wrong — re-run Task 1 Step 2 for that token and fix the oklch.

- [ ] **Step 2: Commit any visual fixes**

Only commit if Step 1 required a correction; otherwise no action.
