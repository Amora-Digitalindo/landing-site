# VIP Merchant Launching Program — Design Spec

Date: 2026-06-22
Target file: `amora-landing-v2.html` (legacy static landing page; `astro-app/` is out of scope for this change)

## Goal

Promote a limited-time launching program: merchants who register get a free trial of up to 3 months, then lock in a lifetime "VIP Merchant" discounted price on Starter/Pro plans. Update the hero CTAs to surface this program alongside the existing "open a store" action.

## 1. Hero CTA update

File: `amora-landing-v2.html`, `.hero-cta` block (currently ~line 260–274).

Replace the existing two elements (`btn-primary` "Buka Toko Sekarang" + `hero-secondary-link` "Lihat fitur lengkap") with:

- **Primary button** — "Join VIP Merchant Free Trial"
  - class `btn-primary`
  - `href="#vip-program"` (anchor scroll to the new section)
- **Secondary button** — "Buka Toko Sekarang"
  - reuse the existing `.btn-ghost` class (outlined button already defined in `css/amora-landing-v2.css`, used elsewhere on the page) — no new CSS class needed
  - `href="https://admin.amora.id/"` (unchanged destination)

`.hero-secondary-link` ("Lihat fitur lengkap") is removed from the hero entirely to keep the two-button row clean. The `.hero-secondary-link` CSS rule can stay in the stylesheet (it's harmless dead CSS, not worth a risky removal pass right now) — only the HTML usage is dropped.

Both buttons keep the existing SVG iconography pattern (arrow icon) consistent with the current primary button markup.

## 2. New "VIP Merchant Launching Program" section

Placement: inserted as a new `<section>` directly **before** `<section id="harga" class="py-section">` (currently ~line 1719), i.e. after `#features-grid` and before Pricing.

```html
<section id="vip-program" class="py-section">
  <div class="section-inner">
    <div class="vip-header reveal">
      <div class="section-eyebrow"><span class="section-eyebrow-dot"></span>Program Peluncuran</div>
      <h2>Daftar Sekarang, Jadi<br><span class="accent">VIP Merchant.</span></h2>
      <p>Coba gratis hingga 3 bulan, lalu nikmati harga spesial seumur hidup sebagai merchant VIP.</p>
    </div>

    <div class="vip-cards reveal delay-1">
      <div class="vip-card">
        <div class="vip-card-icon"><!-- clock/gift icon --></div>
        <div class="vip-card-title">Gratis hingga 3 Bulan</div>
        <div class="vip-card-desc">Coba semua fitur tanpa biaya selama masa trial.</div>
      </div>
      <div class="vip-card vip-card-accent">
        <div class="vip-card-icon"><!-- crown/star icon --></div>
        <div class="vip-card-title">Harga VIP Seumur Hidup</div>
        <div class="vip-card-desc">
          Setelah trial berakhir, kunci harga spesial selamanya:
        </div>
        <div class="vip-price-row">
          <div class="vip-price-item">
            <span class="vip-price-tier">Starter</span>
            <span class="vip-price-old">Rp 134.000</span>
            <span class="vip-price-new">Rp 99.000<span>/bulan</span></span>
          </div>
          <div class="vip-price-item">
            <span class="vip-price-tier">Pro</span>
            <span class="vip-price-old">Rp 209.000</span>
            <span class="vip-price-new">Rp 179.000<span>/bulan</span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- TODO: update validation/expiry date for the launching program once finalized -->
    <div class="vip-validity reveal delay-2">Berlaku hingga 31 Desember 2026</div>

    <!-- TODO: wire to actual VIP registration URL/form once available -->
    <a href="#" class="btn-primary vip-cta reveal delay-2">
      Daftar VIP Merchant Sekarang
      <svg data-icon viewBox="0 0 24 24" width="15" height="15">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  </div>
</section>
```

Notes:
- Reuses existing scroll-reveal classes (`reveal`, `delay-1`, `delay-2`) and section scaffolding classes (`py-section`, `section-inner`, `section-eyebrow`, `accent`) already used by sibling sections — no new JS behavior needed.
- Two TODO comments mark the two known placeholders (registration link, validity date) so they're easy to find later via `grep -n "TODO" amora-landing-v2.html`.
- Pricing numbers (Starter 134.000→99.000, Pro 209.000→179.000) mirror the currently-displayed discounted prices in the `#harga` section, framed as a further VIP-only lifetime discount on top.

## 3. CSS

New rules appended to `css/amora-landing-v2.css` (not inline), following existing naming/visual conventions (dark background, `var(--accent)` teal, card border/radius patterns borrowed from `.plan-card`):

- `.vip-header` — centered header block, same pattern as `.pricing-header`
- `.vip-cards` — flex/grid row of two cards
- `.vip-card`, `.vip-card-accent` — card containers; accent variant gets a teal border/glow like `.plan-card-pro`
- `.vip-card-icon`, `.vip-card-title`, `.vip-card-desc`
- `.vip-price-row`, `.vip-price-item`, `.vip-price-tier`, `.vip-price-old` (strikethrough), `.vip-price-new`
- `.vip-validity` — small pill/badge text below the cards
- `.vip-cta` — uses `.btn-primary` as base; no override needed unless spacing/centering requires a small additive rule

Responsive behavior: stack `.vip-cards` to a single column under the same breakpoint already used by `.pricing-plans-grid` (check existing breakpoint value and reuse it, don't invent a new one).

## Out of scope

- `astro-app/` rewrite is not touched in this change.
- No backend/registration form is built — CTA href is a placeholder anchor.
- No countdown timer or dynamic date logic — the validity date is static text to be hand-edited later.
