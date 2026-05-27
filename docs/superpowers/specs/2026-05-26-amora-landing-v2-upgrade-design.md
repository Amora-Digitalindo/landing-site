# Amora Landing Page — Upgrade Design Spec
**Date:** 2026-05-26  
**File:** `amora-landing-v2.html` (edit in place) + 2 new legal pages

---

## Scope

Five areas of change:

1. Legal pages extracted to dedicated HTML files
2. Section dividers removed
3. Neumorphic blurry glass card treatment across all card elements
4. Micro-animations, staggered entrance, count-up stats
5. Pricing section redesigned (Option C glow card + table improvements)

---

## 1. Legal Pages

### New files
- `syarat.html` — Syarat & Ketentuan
- `privasi.html` — Kebijakan Privasi

### Structure (same for both)
- Same `<nav>` and `<footer>` markup as `amora-landing-v2.html`
- Same design tokens, font, background orbs (`#page-bg`)
- Content rendered as **flat scrollable sections** — each point is a titled block with body text, not an accordion. Legal pages are meant for reading in full, not exploring.
- Section layout: `max-width: 760px; margin: auto; padding: 80px 24px`
- Each legal point: `<h3>` heading + body paragraphs + `<ul>` lists where appropriate
- Content sourced from existing `makeAccordion('sykList', [...])` and `makeAccordion('privList', [...])` data in `amora-landing-v2.html`

### Main page changes
- Remove the `<section id="syarat-ketentuan">` and `<section id="kebijakan-privasi">` sections entirely
- Remove corresponding `makeAccordion('sykList', ...)` and `makeAccordion('privList', ...)` JS calls
- Remove all `.legal-*` CSS rules from `amora-landing-v2.html` (`.legal-accordion`, `.legal-item`, `.legal-question`, `.legal-answer`, `.legal-chevron`, `.legal-answer-inner`) — no longer needed on main page
- Update footer legal links: `href="syarat.html"` and `href="privasi.html"` (no `#` anchor)

---

## 2. Section Dividers Removed

- Remove all `<div class="section-divider"></div>` elements from HTML
- Remove `.section-divider` CSS rule
- No replacement needed — ambient background orbs provide natural visual flow between sections

---

## 3. Neumorphic Blurry Glass Cards

Applied to all card-type surfaces. Core treatment:

```css
background: rgba(13, 13, 24, 0.65);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.07),   /* inner top highlight */
  inset 0 -1px 0 rgba(0, 0, 0, 0.2),          /* inner bottom depth */
  0 8px 32px rgba(0, 0, 0, 0.45);             /* outer drop shadow */
```

### Targets

**Feature cards (`.feature-card`)**
- Apply glass treatment above
- Hover: `transform: translateY(-4px)`, deepen outer shadow, add subtle `box-shadow` green inner glow `inset 0 0 0 1px rgba(107,142,90,0.12)`
- Transition: `0.28s cubic-bezier(0.22,1,0.36,1)` on transform + box-shadow

**FAQ items (`.faq-item`)**
- Wrap each item in glass container with above treatment
- Open/active item: background shifts to `rgba(107,142,90,0.06)` + border becomes `rgba(107,142,90,0.2)`

**Hero stats (`.hero-stat`)**
- Glass pill: `background: rgba(255,255,255,0.04); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--r-lg); padding: 12px 20px`

**Pricing comparison table rows**
- Even rows: `background: rgba(255,255,255,0.02)`
- Odd rows: `background: transparent`
- Pro column cells: `background: rgba(107,142,90,0.05)`
- Table container: glass treatment with `backdrop-filter: blur(12px)`

---

## 4. Animations

### 4a. Count-up stats
Trigger: IntersectionObserver on `.hero-stats` (fires once)

Targets and values:
- `10.000+` — counts from 0 to 10000, formats with `.` separator, appends `+`
- `5 menit` — counts from 0 to 5, appends ` menit`
- `0%` — stays at 0 (already 0, just fades in)

Duration: 1.8s, easing: `easeOutQuart`. Uses `requestAnimationFrame`.

### 4b. Hover micro-interactions

**`.btn-primary` (all primary buttons)**
- Existing spotlight-sweep animation — keep but make smoother
- Add: `transform: translateY(-1px)` on hover
- Add: `box-shadow` deepens to `0 12px 40px rgba(107,142,90,0.3)` on hover

**`.feature-card`**
- `transform: translateY(-4px)` on hover
- Box-shadow deepens + adds `inset 0 0 0 1px rgba(107,142,90,0.12)`

**`.nav-links a`**
- Underline slide-in from left: pseudo-element `::after` with `width: 0 → 100%` on hover, `background: var(--accent-light)`, `height: 1px`, `transition: width 0.2s ease`

**`.plan-card-wrapper.featured` (Pro card)**
- On hover: `box-shadow` adds extra `0 0 100px rgba(107,142,90,0.2)`

**`.faq-question`, `.legal-question`**
- On hover: `color` shifts from `--text-80` to `--text`, background `rgba(255,255,255,0.02)`

### 4c. Staggered entrance (feature cards grid)

Feature cards in `.features-top` and `.features-bottom` already have `.reveal` class. Ensure delays are assigned:
- Card 1: `delay-1` (80ms)
- Card 2: `delay-2` (160ms)
- Card 3: `delay-3` (240ms)
- Card 4: `delay-4` (320ms)
- Card 5: `delay-5` (400ms)

Also apply stagger to pricing plan cards and comparison table reveal.

---

## 5. Pricing Redesign (Option C — Glow Card)

### Plan cards

**Starter card:**
```css
background: rgba(13, 13, 24, 0.75);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.08);
box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5);
```

**Pro card:**
```css
background: radial-gradient(ellipse at 60% -20%, rgba(107,142,90,0.28) 0%, rgba(10,20,14,0.95) 60%);
backdrop-filter: blur(16px);
border: 1.5px solid rgba(107,142,90,0.5);
box-shadow:
  0 0 0 1px rgba(107,142,90,0.08),
  0 24px 64px rgba(0,0,0,0.6),
  0 0 80px rgba(107,142,90,0.15);
```
- Top glow line: `::before` pseudo-element, `height: 1px`, `background: linear-gradient(90deg, transparent, rgba(107,142,90,0.6), transparent)`, `position: absolute; top: 0; left: 10%; width: 80%`
- Remove current gradient-border wrapper (`plan-card-wrapper`) approach — replace with direct card styling above

**Pro CTA button:** Full-width, `padding: 13px`, font-size slightly larger than Starter button, gradient `linear-gradient(135deg, #6B8E5A, #8FB87A)`

**Starter CTA button:** Full-width, glass style `background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12)`

### Comparison table

- Table container: glass card treatment
- Header row (`<thead>`): sticky `position: sticky; top: 72px` (below navbar)
- Pro column header: green-tinted `background: rgba(107,142,90,0.1)`
- Category header rows: `background: rgba(255,255,255,0.03); font-size: 11px; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-40)`
- Check icon: larger (20px), green `#8FB87A`
- Cross icon: 18px, `rgba(242,242,245,0.25)`
- Footer note row: `* Harga sudah termasuk PPN` — left-aligned, `var(--text-40)`, `font-size: 12px`

---

## File plan

| File | Action |
|------|--------|
| `amora-landing-v2.html` | Edit in place — pricing, cards, animations, dividers, footer links, remove legal sections |
| `syarat.html` | New file — full standalone legal page |
| `privasi.html` | New file — full standalone legal page |

---

## Out of scope

- No changes to copy (Indonesian text stays as-is)
- No changes to color tokens (`--accent`, `--bg`, etc.)
- No changes to images or asset paths
- No new external dependencies
- No build system introduced
