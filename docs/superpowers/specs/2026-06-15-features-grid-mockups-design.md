# Features Grid Animated Mockups — Design Spec

Date: 2026-06-15
File affected: `amora-landing-v2.html`

## Background

The `#features-grid` section contains 5 feature cards (Website Toko Instan, Dashboard, Kustomisasi Tampilan Toko, Pembayaran, Promo Fleksibel). Each currently uses a static `<img>` via `.feature-card-img`. These are replaced with inline SVG/HTML animated mockups that reinforce the premium SaaS aesthetic established by the bento widgets in the sections above (Pesanan Masuk, Lacak Pesanan).

The project remains **vanilla HTML/CSS/JS** — no React/Tailwind/Framer Motion.

## 1. Structure & Sizing

### `.feature-mockup` (replaces `.feature-card-img`)

- Fixed height: `~220px` (matches current card image height for grid consistency)
- Background: `var(--surface-card)` with `border: 1px solid rgba(255,255,255,0.06)`
- Border-radius: `var(--r-xl)` (inner radius, inside the card's `var(--r-2xl)`)
- Overflow: `hidden`
- Header: `.bento-chrome` — the 3-dot window chrome already used by the Orders/Tracking widgets, ensuring visual consistency across all mockup elements

### Two layout variants

**`.feature-mockup.has-sidebar`** — used by Dashboard & Kustomisasi:
- `display: flex`
- Left sidebar `.mockup-sidebar` (~80px wide): vertical tab list with icons + labels, `background: rgba(255,255,255,0.02)`, `border-right: 1px solid rgba(255,255,255,0.06)`
- Right `.mockup-panel`: remaining width, holds the card-specific content

**`.feature-mockup` (no sidebar)** — used by Website, Pembayaran, Promo:
- Single `.mockup-panel` fills full width below `.bento-chrome`

## 2. Card-Specific Mockup Content

### Card 1: Website Toko Instan

**Layout:** no sidebar. Panel shows a skeleton wireframe of a storefront page.

**Content (inline HTML/SVG):**
- Top bar: thin rect (nav placeholder)
- Hero area: large rect with subtle gradient fill (hero image placeholder)
- Product grid: 2×2 grid of small rounded rects (product card skeletons)
- All rects use `background: rgba(255,255,255,0.04)` with `border-radius: 4px`

**One-shot animation (`.reveal.visible`):**
- Skeleton blocks appear with staggered `fadeInUp` — nav first, hero second, then product cards left-to-right with `transition-delay` increments of `0.08s`
- Each block transitions from `opacity: 0; transform: translateY(8px)` to visible
- Total entrance duration: ~600ms

**No cycling animation.**

### Card 2: Dashboard

**Layout:** `.has-sidebar`. Sidebar has 3 tab items: "Ringkasan" (active), "Pesanan", "Produk" — each with a small inline SVG icon (chart, list, box).

**Content (`.mockup-panel`):**
- Row of 3 mini stat cards at top (text: "Pesanan", "Pendapatan", "Pengunjung" with placeholder numbers)
- Below: bar chart — 6 vertical bars of varying heights
- All values are decorative/static text

**One-shot animation (`.reveal.visible`):**
- Bar chart bars grow from `height: 0` to their final height via CSS `transition: height 0.6s cubic-bezier(0.22,1,0.36,1)` with staggered delays (0s, 0.08s, 0.16s, 0.24s, 0.32s, 0.4s)
- Stat cards fade in simultaneously

**Cycling animation (one per card):**
- Active sidebar tab changes every ~4s: "Ringkasan" → "Pesanan" → "Produk" → loop
- Active tab gets `background: rgba(255,255,255,0.06)` + `border-left: 2px solid var(--accent-light)` via class toggle
- Transition: `background 0.3s, border-color 0.3s`
- JS: `setInterval` started on IntersectionObserver visibility, rotates `.active` class among sidebar tabs
- `prefers-reduced-motion`: interval not started, "Ringkasan" stays active

### Card 3: Kustomisasi Tampilan Toko

**Layout:** `.has-sidebar`. Sidebar has 3 tab items: "Warna" (active), "Font", "Layout" — each with icon (palette, type, layout).

**Content (`.mockup-panel`):**
- Top section: mini preview of a storefront header bar (~40px tall, `background` set to the active swatch color, transitions on change)
- Below: row of 4 color swatch circles (e.g. green/accent, blue, rose, amber), one with `.active` ring indicator (`box-shadow: 0 0 0 2px var(--accent-light)`)

**One-shot animation (`.reveal.visible`):**
- Swatches scale in with staggered `transition-delay`
- Preview header fades in

**Cycling animation (one per card):**
- Active color swatch changes every ~4s, cycling through the 4 colors
- The `.active` ring moves to the new swatch (CSS transition on `box-shadow`)
- The preview header bar's `background-color` transitions to match the selected swatch color (`transition: background-color 0.5s ease`)
- JS: `setInterval` started on IntersectionObserver visibility
- `prefers-reduced-motion`: interval not started, first swatch stays active

### Card 4: Pembayaran

**Layout:** no sidebar. Panel shows a payment method checklist.

**Content (inline HTML):**
- 3-4 rows, each with a small icon (credit card, wallet, bank, QRIS) + label + checkmark icon on right
- Labels: "Kartu Kredit/Debit", "E-Wallet", "Transfer Bank", "QRIS"
- Checkmarks use the existing `check-icon` SVG pattern (`data-icon`)

**One-shot animation (`.reveal.visible`):**
- Rows appear sequentially with staggered `translateX(-12px) → 0` + `opacity: 0 → 1`
- Each checkmark does a `scale(0) → scale(1)` with a slight bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`) after its row appears (additional ~0.15s delay)
- Total entrance: ~800ms

**No cycling animation.**

### Card 5: Promo Fleksibel

**Layout:** no sidebar. Panel shows a promo/discount configuration mockup.

**Content (inline HTML):**
- Toggle switch (styled `<div>`) with label "Aktifkan Promo"
- Below: mini promo card showing "Diskon 20%" badge + code field "AMORA20"
- Badge uses `background: var(--accent-dim)`, `color: var(--accent-light)`, `border-radius: var(--r-full)`

**One-shot animation (`.reveal.visible`):**
- Toggle slides to "on" position: track transitions from gray to green (`var(--accent)`), thumb slides right
- Badge scales in from `scale(0.8)` with slight bounce
- Promo card fades in after toggle

**No cycling animation.** The toggle "lighting up" is the one-shot entrance effect.

## 3. Animation Principles

Following the "mockup tenang" (calm mockup) approach from the bento widget revision:

1. **One-shot entrances** trigger on `.reveal.visible` (IntersectionObserver scroll reveal). They do not repeat.
2. **Maximum one cycling animation per card** — prevents visual noise. Only Dashboard (tab cycling) and Kustomisasi (swatch cycling) have cycles.
3. **Cycling timing:** ~4s interval, smooth easing, starts only after widget enters viewport via IntersectionObserver, stops completely with `prefers-reduced-motion: reduce`.
4. **No dual-pulse:** no card has two simultaneous looping animations (avoids the issue fixed in prior revision).

## 4. Icons & Assets

- All icons are **inline SVG** reusing the existing `data-icon` pattern (`viewBox="0 0 24 24"`, `stroke="currentColor"`, `fill="none"`, `stroke-width="2"`)
- New icons needed: chart-bar, layout, type/font, palette, credit-card, wallet, qr-code, toggle — all simple Feather-style line icons
- The 5 old `feature-illustration-*.png` files are no longer referenced (image `<img>` tags removed from HTML). Files remain on disk.

## 5. Responsive Behavior

- On mobile (`max-width: 600px`), `.feature-mockup.has-sidebar` collapses the sidebar: sidebar is hidden, panel fills full width, cycling animation still works but operates on a hidden element (no visual change — acceptable since the one-shot entrance is the primary effect)
- `.feature-mockup` height stays `~220px` across breakpoints (consistent card sizing)
- `.bento-chrome` dots remain at all breakpoints (small footprint)

## 6. CSS Implementation Notes

- `.feature-mockup` styles added alongside existing `.feature-card-img` rules (which are removed)
- `.bento-chrome` is already defined for the Orders/Tracking widgets — reused as-is
- Bar chart bars use CSS custom property `--bar-h` per element for height targets, animated via `transition: height`
- Color swatch cycling uses CSS custom property `--preview-color` on the mockup panel, updated by JS — the header bar reads `background-color: var(--preview-color)` with `transition`
- All entrance animations use the existing `.reveal` system — the card container has `.reveal`, and internal elements use CSS `transition-delay` relative to the parent becoming `.visible`

## 7. Out of Scope

- No changes to card copy (titles, descriptions, icon badges above title)
- No changes to the features-grid layout (2-column + 3-column bento arrangement)
- No React/Tailwind/Framer Motion
- No new font loads or design token changes
- No changes to sections outside `#features-grid`
