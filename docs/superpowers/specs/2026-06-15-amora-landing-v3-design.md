# Amora Landing v3 — Refined Upgrade Design Spec

**Date:** 2026-06-15  
**Scope:** Full redesign of `amora-landing-v2.html` plus nav/footer sync to `privasi.html` and `syarat.html`

---

## Goals

Upgrade the visual quality and perceived depth of the Amora landing page without changing brand identity or content. The result should feel premium, professional, and "alive" — inspired by the aesthetic of Resend, Modal, and Linear — while staying true to the earthy green palette and Indonesian audience.

**Non-goals:** Changing copy, pricing, or page structure. No new sections added or removed.

---

## Approach

CSS 3D transforms + vanilla JS mouse parallax. Zero new dependencies except the Geist font. Single-file HTML maintained. Homepage first, then nav/footer applied to all pages.

---

## 1. Design Tokens & Typography

### Fonts

```css
/* Headline only */
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');

--font-display: 'Geist', 'Inter', system-ui, sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
```

- `h1`, `h2`, `h3`, plan names, nav logo label → `font-family: var(--font-display)`
- All body text, labels, captions, table content → `font-family: var(--font-body)` (unchanged)

### Color Tokens (additions only — all existing tokens preserved)

```css
--accent-vivid:  #7FB86A;   /* brighter green for headline highlights */
--depth-1:       rgba(255,255,255,0.03);  /* subtle surface lift */
--depth-2:       rgba(255,255,255,0.055); /* card surface */
--depth-glow:    rgba(107,142,90,0.12);   /* ambient green glow */
```

All existing `--bg`, `--accent`, `--accent-light`, `--text-*`, `--border-*`, `--shadow-*` tokens remain unchanged.

### Spacing

Section padding increased:
```css
.py-section    { padding: 120px 0; }   /* was 100px */
.py-section-sm { padding: 88px 0; }    /* was 72px */

@media (min-width: 1024px) {
  .py-section    { padding: 160px 0; } /* was 132px */
  .py-section-sm { padding: 108px 0; } /* was 88px */
}
```

---

## 2. Hero Section

### Layout

Centered layout — text block centered above a wide 3D mockup. No more two-column split. Works identically on mobile and desktop.

```
[eyebrow pill]
[h1 — large, Geist 900]
[subtitle — centered, max-width 560px]
[CTA buttons — centered row]
[3D dashboard mockup — full width, max-width 900px, centered]
[stat pills]
```

### Typography

```css
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.05;
}
.hero-title .highlight {
  /* existing gradient stays, uses --accent-vivid at center stop */
  background: linear-gradient(135deg, #A4D490 0%, #7FB86A 50%, #8FB87A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 3D Mockup

The existing `hero-mockup.png` is wrapped in a CSS 3D perspective container.

```css
.hero-3d-stage {
  perspective: 1200px;
  perspective-origin: 50% 40%;
}
.hero-3d-card {
  transform: rotateX(8deg) rotateY(-4deg);
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
  /* reflection line at top */
  position: relative;
}
.hero-3d-card::before {
  content: '';
  position: absolute;
  top: 0; left: 5%; width: 90%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  border-radius: 50%;
  z-index: 3;
}
```

**Mouse parallax (vanilla JS):**
```js
// On desktop only — guard with matchMedia so mobile is untouched
if (window.matchMedia('(hover: fine) and (pointer: fine)').matches) {
  const card = document.querySelector('.hero-3d-card');
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy; // -1 to 1
    const rx = dy * -4; // max ±4deg on X axis
    const ry = dx *  4; // max ±4deg on Y axis
    card.style.transform = `rotateX(${8 + rx}deg) rotateY(${-4 + ry}deg)`;
  }, { passive: true });
}
```

- Disabled on `(hover: none)` and `(prefers-reduced-motion: reduce)` media queries
- On mobile: removed parallax, replaced with existing `float` animation

**Shadow & glow:** All existing shadow and glow layers on `.hero-mockup-frame img` are kept. Add one extra outer glow layer to increase depth:
```css
filter:
  drop-shadow(0 0 48px rgba(107,142,90,0.42))
  drop-shadow(0 0 120px rgba(107,142,90,0.20))
  drop-shadow(0 60px 120px rgba(0,0,0,0.90))
  drop-shadow(0 20px 40px rgba(0,0,0,0.75));
```

**Mockup size:** `max-width: 960px`, centered, `margin: 56px auto 0`.

### Hero Background

Existing orbs and grid retained. Add one stronger center bloom:
```css
/* New: center burst behind mockup */
.pg-orb-center {
  top: 30%; left: 50%; transform: translateX(-50%);
  width: 80vw; height: 60vw;
  background: radial-gradient(ellipse, rgba(107,142,90,0.08) 0%, transparent 60%);
  filter: blur(80px);
}
```

---

## 3. Feature Sections (Margin & Setup)

### Layout

Two-column layout preserved at desktop (`1024px+`). Spacing between columns increased from `56px` to `72px`.

### Feature Image 3D Tilt (static, not parallax)

```css
.feature-image-frame {
  transform: perspective(800px) rotateX(3deg) rotateY(6deg);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
/* Mirror for setup section (image on left) */
.feature-grid.setup-grid .feature-image-frame {
  transform: perspective(800px) rotateX(3deg) rotateY(-6deg);
}
/* Hover: neutralise tilt */
.feature-image:hover .feature-image-frame {
  transform: perspective(800px) rotateX(0deg) rotateY(0deg);
}
```

### Feature Section Headings

```css
.feature-text h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}
```

### Feature Bullets

Icon upgraded from small circle to bold square check:
```html
<span class="feature-bullet-icon">
  <!-- filled 14×14 square with checkmark inside -->
</span>
```
```css
.feature-bullet-icon {
  width: 20px; height: 20px;
  border-radius: var(--r-sm); /* square, not circle */
  background: linear-gradient(135deg, rgba(107,142,90,0.3), rgba(107,142,90,0.12));
  border: 1px solid var(--accent-border);
}
```

---

## 4. Features Grid

### Card Upgrades

```css
.feature-card {
  /* existing styles preserved */
  background: var(--depth-2);
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.feature-card:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(107,142,90,0.25);
  border-top-color: rgba(107,142,90,0.5); /* top glow border on hover */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 20px 56px rgba(0,0,0,0.6),
    0 0 40px rgba(107,142,90,0.1);
}
.feature-card h3 {
  font-family: var(--font-display);
  font-weight: 600;
}
.feature-card-img img {
  height: 240px; /* was 220px */
}
```

---

## 5. Pricing Section

### Plan Cards

```css
/* Pro card: stronger glow */
.plan-card-pro {
  border: 1.5px solid rgba(107,142,90,0.6); /* was 0.5 */
  box-shadow:
    0 0 0 1px rgba(107,142,90,0.1),
    0 28px 72px rgba(0,0,0,0.65),
    0 0 100px rgba(107,142,90,0.2); /* was 0.15 */
}
```

**Pro card shimmer animation (auto-runs, not just on hover):**
```css
@keyframes shimmer-sweep {
  0%   { left: -60%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { left: 130%; opacity: 0; }
}
.plan-card-pro::after {
  animation: shimmer-sweep 4s ease-in-out 2s infinite;
}
```

**Plan tier labels:** `font-family: var(--font-display); font-weight: 800;`

**Comparison table heading:** `font-family: var(--font-display);`

---

## 6. CTA Banner

```css
.cta-card h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 900;
  letter-spacing: -0.03em;
}
/* Richer card background */
.cta-card {
  background:
    radial-gradient(ellipse at 50% -10%, rgba(107,142,90,0.18) 0%, transparent 55%),
    rgba(13, 13, 24, 0.78);
}
```

**Trust badge below CTA buttons:**
```html
<p class="cta-trust">Tanpa kartu kredit &nbsp;·&nbsp; Setup dalam 5 menit &nbsp;·&nbsp; Batalkan kapan saja</p>
```
```css
.cta-trust {
  font-size: 0.8125rem;
  color: var(--text-40);
  margin-top: 20px;
}
```

---

## 7. FAQ

```css
.faq-header h2 {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.03em;
}
.faq-item.active {
  border-color: rgba(107,142,90,0.28); /* slightly more visible */
}
```

No structural or content changes.

---

## 8. Navbar

No structural changes. Upgrades:

```css
nav.scrolled .nav-inner {
  backdrop-filter: blur(36px) saturate(2) brightness(1.08); /* stronger blur */
  border: 1px solid rgba(255,255,255,0.16); /* more visible border */
}
```

Mobile drawer: no structural change, spacing refinement only.

---

## 9. Footer

```css
footer::before {
  background: linear-gradient(to right, transparent, rgba(107,142,90,0.5), transparent); /* stronger top border */
}
.footer-col h4 {
  font-family: var(--font-display);
  font-weight: 700;
}
.footer-social a:hover {
  transform: scale(1.1);
  color: var(--accent-light);
  border-color: var(--accent-border);
  background: var(--accent-dim);
  box-shadow: 0 0 12px rgba(107,142,90,0.2);
}
```

---

## 10. Cross-page Application (privasi.html & syarat.html)

After homepage is validated:

1. Copy the complete `<nav>` block (including all CSS and JS for scroll behavior, mobile drawer) from `amora-landing-v3.html` into `privasi.html` and `syarat.html`, replacing existing navbars
2. Copy the complete `<footer>` block (including new CSS) into both files, replacing existing footers
3. Add Geist font import to both files
4. Add the same `--font-display` token to `:root` in both files
5. Update any `h1`/`h2` in those pages to use `font-family: var(--font-display)`
6. No content changes to legal text

---

## 11. Mobile Considerations

- Hero: centered layout is naturally mobile-first. Mockup `max-width: 100%` with side padding `16px`
- Mouse parallax: disabled via `@media (hover: none)`. Float animation used instead
- 3D tilt on feature images: reduced to `rotateY(3deg)` on mobile (less aggressive)
- All touch tap targets remain `min-height: 44px`
- `prefers-reduced-motion`: all `transform` animations and transitions set to `transition: none` / `animation: none`

---

## 12. Implementation Order

1. Update design tokens (font import, new CSS variables, spacing)
2. Rebuild hero section (centered layout, 3D stage, mouse parallax JS)
3. Upgrade feature sections (3D tilt, bullet icon, heading font)
4. Upgrade features grid cards
5. Upgrade pricing cards (Pro shimmer, stronger glow)
6. Upgrade CTA banner (heading, trust badge)
7. FAQ and footer font/spacing
8. Navbar backdrop upgrade
9. Test mobile across breakpoints (375px, 390px, 768px)
10. Apply nav/footer to `privasi.html` and `syarat.html`
