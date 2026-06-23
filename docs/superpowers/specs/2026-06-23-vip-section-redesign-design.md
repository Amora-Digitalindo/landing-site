# VIP Merchant Section Redesign — Design Spec

Date: 2026-06-23
Target files: `amora-landing-v2.html` (markup), `css/amora-landing-v2.css` (styles)

## Goal

Redesign the homepage's `#vip-program` section from a single narrow (640px) vertically-stacked card into a wider panel (~960px) with an internal multi-section layout, individually highlighted benefit cards, and subtle ambient animation — while staying fully responsive and visually consistent with the rest of the site's dark/olive-green design system.

## Current state (being replaced)

`amora-landing-v2.html:1624-1688` — a single `.vip-card.vip-card-accent` (max-width 640px) with everything stacked vertically in one column: icon → slot badge → title → desc → free-trial highlight box → benefit checklist (plain `<ul>`) → price info → validity → CTA button.

`css/amora-landing-v2.css:6159-6385` — the `.vip-*` rule block backing that markup.

## New structure

### Markup (replaces `amora-landing-v2.html:1634-1685`, the `.vip-card` block only — `.vip-header` above it is unchanged)

```html
      <div class="vip-panel reveal delay-1">
        <div class="vip-panel-glow" aria-hidden="true"></div>

        <!-- Top strip: identity + urgency -->
        <div class="vip-panel-top">
          <div class="vip-identity">
            <img src="assets/vip-merchant-badge.png" alt="VIP Merchant Badge" width="56" height="56" class="vip-identity-badge">
            <div class="vip-identity-title">Jadi VIP Merchant</div>
          </div>
          <div class="vip-slot-badge"><span class="vip-slot-icon">🔥</span> Hanya 30 Slot VIP Merchant</div>
        </div>

        <!-- Hero highlight band -->
        <div class="vip-highlight-band">
          <span class="vip-highlight-label">Gratis</span>
          <span class="vip-highlight-duration">untuk 3 Bulan Pertama</span>
          <span class="vip-highlight-sub">Khusus paket Starter, tanpa kartu kredit</span>
        </div>

        <!-- Benefit mini-cards -->
        <div class="vip-benefit-grid">
          <div class="vip-benefit-card reveal delay-1">
            <svg class="vip-benefit-icon" data-icon viewBox="0 0 24 24" width="20" height="20">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Harga spesial seumur hidup untuk Starter maupun Pro</span>
          </div>
          <div class="vip-benefit-card reveal delay-2">
            <svg class="vip-benefit-icon" data-icon viewBox="0 0 24 24" width="20" height="20">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Bisa upgrade ke Pro kapan saja dengan harga VIP</span>
          </div>
          <div class="vip-benefit-card reveal delay-3">
            <svg class="vip-benefit-icon" data-icon viewBox="0 0 24 24" width="20" height="20">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Slot sangat terbatas — hanya untuk 30 merchant pertama</span>
          </div>
        </div>

        <!-- Bottom strip: price + CTA -->
        <div class="vip-panel-bottom">
          <div class="vip-price-info">
            Setelah trial, harga spesial seumur hidup:<br>
            <strong>Starter Rp 99.000</strong> &amp; <strong>Pro Rp 179.000</strong> per bulan.
          </div>
          <div class="vip-bottom-action">
            <!-- TODO: update validation/expiry date for the launching program once finalized -->
            <div class="vip-validity">Berlaku hingga 31 Desember 2026</div>
            <a href="vip-merchant-registration/index.html" class="btn-primary vip-cta">
              Daftar VIP Merchant Sekarang
              <svg data-icon viewBox="0 0 24 24" width="15" height="15">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
```

All copy, the registration link, and the validity placeholder TODO are carried over unchanged from the current implementation — only the structure and visual treatment change.

### CSS (replaces `css/amora-landing-v2.css:6190-6385`, i.e. everything from `.vip-card` through the closing of the `@media (max-width: 768px)` block — `.vip-header` rules above this range are unchanged)

```css
.vip-panel {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 40px;
  border-radius: var(--r-2xl);
  background: rgba(16, 18, 30, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(107, 142, 90, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 28px 72px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.vip-panel-glow {
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle, rgba(107, 142, 90, 0.35) 0%, transparent 60%);
  filter: blur(40px);
  z-index: 0;
  pointer-events: none;
  animation: vip-glow-drift 10s ease-in-out infinite alternate;
}

.vip-panel > *:not(.vip-panel-glow) {
  position: relative;
  z-index: 1;
}

@keyframes vip-glow-drift {
  from { transform: translate(-8%, -8%) scale(1); }
  to { transform: translate(8%, 8%) scale(1.15); }
}

/* Top strip */
.vip-panel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.vip-identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.vip-identity-badge {
  width: 56px;
  height: 56px;
  object-fit: contain;
  flex-shrink: 0;
}

.vip-identity-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text);
}

.vip-slot-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: var(--r-full);
  background: rgba(255, 174, 66, 0.12);
  border: 1px solid rgba(255, 174, 66, 0.35);
  color: #FFC97A;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.vip-slot-icon {
  font-size: 0.8125rem;
}

/* Highlight band */
.vip-highlight-band {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 22px 24px;
  margin-bottom: 28px;
  border-radius: var(--r-xl);
  background: rgba(107, 142, 90, 0.16);
  border: 1.5px solid rgba(107, 142, 90, 0.45);
  box-shadow: 0 0 40px rgba(107, 142, 90, 0.2);
}

.vip-highlight-band::after {
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  transform: skewX(-20deg);
  animation: vip-shimmer-sweep 4.5s ease-in-out infinite;
}

@keyframes vip-shimmer-sweep {
  0%, 55% { left: -60%; opacity: 0; }
  63% { opacity: 1; }
  85% { opacity: 1; }
  100% { left: 130%; opacity: 0; }
}

.vip-highlight-label {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--accent-light);
  letter-spacing: -0.02em;
}

.vip-highlight-duration {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--text);
}

.vip-highlight-sub {
  flex-basis: 100%;
  font-size: 0.8125rem;
  color: var(--text-60);
}

/* Benefit mini-cards */
.vip-benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 28px;
}

.vip-benefit-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 16px;
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-mid);
  font-size: 0.875rem;
  color: var(--text-80);
  line-height: 1.45;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}

.vip-benefit-card:hover {
  border-color: var(--accent-border);
  background: rgba(107, 142, 90, 0.08);
  transform: translateY(-2px);
}

.vip-benefit-icon {
  color: var(--accent-light);
}

/* Bottom strip */
.vip-panel-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.vip-price-info {
  font-size: 0.8125rem;
  color: var(--text-60);
  line-height: 1.6;
  padding: 10px 16px;
  border-radius: var(--r-xl);
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  flex: 1;
  min-width: 240px;
}

.vip-price-info strong {
  color: var(--accent-light);
  font-weight: 700;
}

.vip-bottom-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.vip-validity {
  font-size: 0.75rem;
  color: var(--text-40);
}

.vip-cta {
  display: flex;
  justify-content: center;
  white-space: normal;
}

@media (max-width: 900px) {
  .vip-panel {
    padding: 28px 20px;
  }

  .vip-benefit-grid {
    grid-template-columns: 1fr;
  }

  .vip-panel-bottom {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .vip-bottom-action {
    width: 100%;
  }

  .vip-cta {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .vip-panel-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .vip-highlight-label {
    font-size: 2rem;
  }

  .vip-highlight-duration {
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vip-panel-glow,
  .vip-highlight-band::after {
    animation: none;
  }
}
```

Notes:
- `.vip-panel-glow` reuses the exact same drift-animation technique as the homepage's existing `.pg-orb` background blobs (translate + scale via `ease-in-out infinite alternate`), just scoped to this one panel instead of the full page background — visually consistent with the site's established ambient-motion language, not a new pattern.
- `.vip-highlight-band::after` reuses the existing `shimmer-auto`-style sweep shape (fade in, sweep across, fade out) but as a new `vip-shimmer-sweep` keyframe with a built-in pause (0–55% holds), so it loops automatically every 4.5s without needing JS or a `:hover` trigger — unlike the existing `.plan-card-pro` shimmer, which is hover-only.
- `@media (prefers-reduced-motion: reduce)` turns off both animations, consistent with how the rest of the site already respects this preference (see existing `@keyframes` blocks guarded the same way elsewhere in `css/amora-landing-v2.css`).
- Three responsive breakpoints: `900px` (benefit grid 3→1 column, bottom strip stacks), `600px` (top strip stacks, highlight band text shrinks) — both new, chosen to match this panel's own content needs rather than reusing the site's generic `768px` breakpoint, since the 3-column benefit grid needs to break earlier than a typical two-column layout would.

## Out of scope

- No changes to `.vip-header` (the section's eyebrow/headline/subtext above the panel) — already centered and consistent with other section headers.
- No changes to copy, pricing figures, the registration link, or the validity-date TODO — purely a structural/visual redesign.
- `astro-app/` is not touched (separate, non-canonical codebase per `CLAUDE.md`).
