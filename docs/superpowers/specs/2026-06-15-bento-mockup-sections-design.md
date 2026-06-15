# Bento Mockup Sections & Reveal Fix — Design Spec

Date: 2026-06-15
File affected: `amora-landing-v2.html`

## Background

Two issues are addressed:

1. Some sections below the hero may fail to appear because the scroll-reveal
   fallback logic is global rather than per-element.
2. The two feature sections directly below the hero ("Margin" and "Setup
   Cepat") should be redesigned with a Resend/Linear/Vercel-style aesthetic,
   replacing static screenshots with live, animated UI mockups relevant to
   Amora's e-commerce context.

The project remains **vanilla HTML/CSS/JS** — no React/Tailwind migration.
The existing design tokens (colors, shadows, radii, fonts) defined in `:root`
are reused; no new design system is introduced.

## 1. Reveal System Fix

**Current behavior** (`amora-landing-v2.html`, end of `<script>`):

```js
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => observer.observe(el));
  // Fallback: if observer hasn't revealed anything after 3s, force all visible
  setTimeout(() => {
    if (!document.querySelector('.reveal.visible')) {
      revealEls.forEach(el => el.classList.add('visible'));
    }
  }, 3000);
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}
```

**Problem:** the fallback checks for *any* `.visible` element globally. If
one element (e.g. a hero stat) becomes visible, the fallback never fires for
other elements that the observer missed — those stay at `opacity: 0`
permanently.

**Fix:** give each `.reveal` element its own fallback timer, independent of
other elements:

```js
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => {
    observer.observe(el);
    // Per-element fallback: reveal this element if the observer hasn't
    // caught it within 1.5s of page load (handles edge cases/timing misses).
    setTimeout(() => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    }, 1500);
  });
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}
```

This is a self-contained fix that benefits all sections, not just the two
being redesigned.

## 2. Section 1 — "Pesanan Masuk Real-Time" (replaces `#fitur` Margin section)

**Layout:** unchanged grid (`feature-grid margin-grid`, 52%/48% on desktop,
text left / visual right, stacks on mobile). The `<img>`-based
`.feature-image` block is replaced by the new mockup widget; `.glow-bg` stays
for ambient glow behind the card.

**Copy:**
- Eyebrow: "Keunggulan Amora" (unchanged)
- Headline: "Amankan **margin** produk toko Anda" (unchanged)
- Body paragraph: lightly revised to mention pesanan masuk langsung ke
  dashboard secara real-time tanpa potongan marketplace
- Bullets: keep the 3-bullet format, revise wording to tie into the live
  order feed concept (e.g. "Notifikasi pesanan masuk secara real-time")

**Mockup — "Live Orders" widget** (new component, replaces `feature-image`):

```html
<div class="orders-widget">
  <div class="orders-widget-header">
    <span class="orders-widget-icon"><!-- store/bag icon --></span>
    <span class="orders-widget-title">Pesanan Masuk</span>
    <span class="orders-widget-live"><span class="section-eyebrow-dot"></span>Live</span>
  </div>
  <div class="orders-widget-list" id="ordersList">
    <!-- order cards injected/animated here -->
  </div>
</div>
```

Each order card:

```html
<div class="order-card">
  <div class="order-card-icon"><!-- bag icon --></div>
  <div class="order-card-info">
    <div class="order-card-top">
      <span class="order-card-label">Pesanan Baru</span>
      <span class="order-card-id">#AMR-7421</span>
    </div>
    <div class="order-card-item">Sneakers Classic White</div>
  </div>
  <div class="order-card-price">Rp 249.000</div>
</div>
```

Styling:
- `.orders-widget`: glass card — `background: var(--surface-card)`,
  `backdrop-filter: blur(20px)`, `border: 1px solid rgba(255,255,255,0.1)`,
  `border-radius: var(--r-2xl)`, padding ~20px, inset top highlight
  (matches `.feature-card` treatment already defined in CSS)
- `.orders-widget-live`: small pill reusing `.section-eyebrow` styling +
  `.section-eyebrow-dot` pulse animation
- `.order-card`: flex row, `background: rgba(255,255,255,0.03)`,
  `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: var(--r-lg)`,
  padding ~12px
- `.order-card-id`: monospace font (`font-family: 'SF Mono', 'Roboto Mono',
  monospace` — add as a small addition, no new font load)
- `.order-card-price`: `color: var(--accent-light)`, `font-weight: 700`,
  subtle `text-shadow` glow using `var(--accent-glow)`
- `.order-card-icon`: small square, same treatment as
  `.feature-bullet-icon` (gradient bg + accent border)

**Animation (vanilla JS):**
- A pool of mock order data (Indonesian product names + random prices/IDs)
- Every 3000ms: build a new `.order-card`, insert at top of
  `.orders-widget-list` with class `.entering` (starts at
  `opacity:0; transform: scale(0.92) translateY(-16px)`), then on next frame
  remove `.entering` so CSS transition animates it to natural position
  (reusing the `fadeInScale`-style easing already in the codebase)
- If list has >3 cards, the last (oldest) card gets class `.exiting`
  (`opacity:0; transform: scale(0.95) translateY(16px)`) and is removed from
  DOM after its transition ends (~400ms)
- The interval starts only when the section enters the viewport — reuse the
  existing IntersectionObserver: when `#fitur` becomes visible, call
  `startOrdersFeed()` once
- `prefers-reduced-motion: reduce` → skip the interval entirely, show 3
  static order cards

## 3. Section 2 — "Pantau & Kelola Pesanan" (replaces `#feature-setup`)

**Layout:** unchanged grid (`feature-grid setup-grid`, 48%/52% on desktop,
visual left / text right, `order-first` on mobile preserved). The
`.feature-image.setup` block (currently an `<img>`) is replaced by the new
tracking mockup widget.

**Copy (full rewrite):**
- Eyebrow: "Kelola Pesanan" (was "Setup Cepat")
- Headline: "Pantau pesanan dari **diterima** sampai ke **pelanggan**"
  (exact wording finalized during implementation, kept within existing
  `.feature-text h2` styling incl. `.accent` gradient span)
- Body paragraph: rewritten around automatic order status updates visible to
  both merchant and customer, all from one dashboard
- Bullets: rewritten, 3 items, e.g.:
  - "Status pesanan otomatis terupdate di setiap tahap"
  - "Pelanggan bisa memantau status pengiriman sendiri"
  - "Semua riwayat pesanan dalam satu dashboard"

**Mockup — "Delivery Tracking" widget** (new component):

```html
<div class="tracking-widget">
  <div class="tracking-widget-header">
    <span class="tracking-widget-title">Lacak Pesanan</span>
    <span class="tracking-widget-id">#AMR-7421</span>
  </div>
  <div class="tracking-steps">
    <div class="tracking-line">
      <div class="tracking-line-fill"></div>
      <div class="tracking-dot"></div>
    </div>
    <div class="tracking-step done">
      <span class="tracking-node"><!-- check icon --></span>
      <div class="tracking-step-text">
        <strong>Pesanan Dikonfirmasi</strong>
        <span>Hari ini, 09:12</span>
      </div>
    </div>
    <div class="tracking-step done">
      <span class="tracking-node"><!-- package icon --></span>
      <div class="tracking-step-text">
        <strong>Sedang Disiapkan</strong>
        <span>Hari ini, 10:40</span>
      </div>
    </div>
    <div class="tracking-step active">
      <span class="tracking-node tracking-node-pulse"><!-- truck icon --></span>
      <div class="tracking-step-text">
        <strong>Dikirim</strong>
        <span>Dalam perjalanan</span>
      </div>
    </div>
    <div class="tracking-step">
      <span class="tracking-node"><!-- home/flag icon --></span>
      <div class="tracking-step-text">
        <strong>Selesai</strong>
        <span>Menunggu konfirmasi</span>
      </div>
    </div>
  </div>
</div>
```

Styling:
- `.tracking-widget`: same glass-card treatment as `.orders-widget`
  (shared base class `.bento-widget` to avoid duplication)
- `.tracking-steps`: positioned relative, each `.tracking-step` is a flex row
  with the node icon + text, vertical gap ~28px
- `.tracking-line`: absolute-positioned vertical line behind the nodes
  (`width: 2px`, `background: rgba(255,255,255,0.08)`), spans the height of
  the steps
- `.tracking-line-fill`: absolute overlay on the line,
  `background: linear-gradient(180deg, var(--accent), var(--accent-light))`,
  animates `height: 0% → 75%` (3 of 4 segments complete) on loop using a
  CSS `@keyframes` (e.g. `track-fill` 6s ease-in-out infinite alternate, or
  a one-direction loop with a brief pause — final timing tuned during
  implementation)
- `.tracking-node`: circular icon badge (32px), default
  `background: rgba(255,255,255,0.05)`, `border: 1px solid
  rgba(255,255,255,0.1)`; `.done` nodes get `background: var(--accent-dim)`,
  `border-color: var(--accent-border)`, icon colored `var(--accent-light)`
- `.tracking-node-pulse`: continuous pulsing ring via `@keyframes` —
  `box-shadow` expanding from `0 0 0 0 var(--accent-glow)` to
  `0 0 0 8px transparent`, looping (same family as existing `pulse-dot`
  keyframe, new variant with larger spread)
- `.tracking-dot`: small circle (8px), `background: var(--accent-light)`,
  `box-shadow: 0 0 8px var(--accent-glow)`, animates `top` position from 0%
  to ~75% in sync with `.tracking-line-fill`, looping

**Animation:** pure CSS, no JS required (all `@keyframes`, `infinite`). When
`prefers-reduced-motion: reduce`, animations are disabled and the fill /
pulse / dot render in their "settled" end-state (line filled to step 3,
no pulse, dot hidden).

## 4. Shared Styling Notes

- New base class `.bento-widget` holds the common glass-card styles (used by
  both `.orders-widget` and `.tracking-widget`):
  `background: var(--surface-card)`, `backdrop-filter: blur(20px)`,
  `border: 1px solid rgba(255,255,255,0.1)`, `border-top: 1px solid
  rgba(255,255,255,0.14)`, `border-radius: var(--r-2xl)`, padding ~20-24px,
  shadow stack consistent with `.feature-card`
- Monospace stack added inline where needed:
  `font-family: 'SF Mono', 'Roboto Mono', 'Consolas', monospace` (system
  fonts only, no new font load)
- All new icons are inline SVGs in the existing Feather-style
  (`viewBox="0 0 24 24"`, `stroke="currentColor"`, `fill="none"`,
  `data-icon` attribute) matching icons already used in `#features-grid`
- Both widgets get a `max-width` on mobile and stack below their text
  column per existing responsive grid rules (`.order-first` already applies
  to the setup grid)

## 5. Removed Assets

- `./asset/feature-margin.png` and `./asset/feature-setup.png` references
  removed from HTML. Files remain on disk (not deleted) in case they're
  reused elsewhere.

## 6. Out of Scope

- No new design tokens / color palette changes
- No React/Tailwind/Framer Motion — all animation via CSS `@keyframes` and
  minimal vanilla JS (only needed for Section 1's order feed)
- No changes to other sections (`#features-grid`, `#harga`, `#cta-banner`,
  `#faq`), other than the global reveal-fallback fix in Part 1
