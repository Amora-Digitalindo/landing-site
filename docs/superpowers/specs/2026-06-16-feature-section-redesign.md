# Feature Section Redesign — Spec

**Goal:** Redesign the feature showcase section to match the hero glassmorphic aesthetic, with a sidebar tab layout on desktop and horizontal pill tabs on mobile, plus compact floating cards added to the hero on mobile.

**Scope:** `amora-landing-v2.html` — feature section (`#fitur` / `.feature-showcase`) + hero mobile floating cards.

---

## 1. Hero Mobile — Floating Side Cards

Two compact cards appear below the main storefront card on mobile (hidden on desktop since full cards already show):

- **Card 1:** "🛍 Pesanan Baru" — product name (T-Shirt Oversize) + price (Rp 185.000). Height ~60px, full-width of canvas area.
- **Card 2:** "📍 Sedang Dikirim" — destination city (Jakarta Selatan). Height ~60px.
- Style: same glassmorphic dark glass as gc-tr widget — `background: rgba(12,20,16,0.75)`, `backdrop-filter: blur(16px)`, border `1px solid rgba(100,210,180,0.2)`, radius 14px.
- Opacity: 0.85 (slightly lower than main card) to avoid visual crowding.
- Position: stacked below gc-main, within the canvas wrap, visible only on mobile.

---

## 2. Feature Section Layout

### Desktop (>900px)

```
[ Section heading: eyebrow + h2, max 2 lines ]

[ Sidebar 180px ] [ Gap 32px ] [ Panel flex-1 ]
  - 5 tabs vertical    glassmorphic panel min-height 520px
  - icon + label       content switches with fade
  - active: teal bar   no auto-slide
  - sticky scroll
```

- Container: max-width 1280px, padding 0 48px
- Sidebar: `width: 180px`, `flex-shrink: 0`, `position: sticky`, `top: 100px`
- Tab item: `padding: 12px 16px`, `border-radius: 10px`, `gap: 10px` (icon + label)
  - Default: `color: rgba(255,255,255,0.45)`, `background: transparent`
  - Active: `background: rgba(100,210,180,0.08)`, `border-left: 2px solid var(--accent)`, `color: rgba(255,255,255,0.9)`
  - Hover: `background: rgba(255,255,255,0.04)`
- Panel: `background: rgba(8,10,16,0.95)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 20px`, `overflow: hidden`, `min-height: 520px`
- Content transition: opacity 0→1 + translateY(6px)→0, 300ms ease

### Mobile (≤900px)

- Sidebar hidden (`display: none`)
- Tabs: horizontal scrollable row of pill buttons, sticky below heading
  - Pill style: `padding: 8px 16px`, `border-radius: 999px`, `white-space: nowrap`
  - Active pill: `background: rgba(100,210,180,0.15)`, `border: 1px solid rgba(100,210,180,0.4)`, `color: var(--accent-light)`
  - Default: `background: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.08)`
  - Swipe gesture on panel switches active tab
- Panel: full-width, height auto, same glass style

### Heading (above layout)

- Eyebrow: "• FITUR LENGKAP" — same style as other eyebrows
- H2: max 2 lines, no subheading paragraph (reduce text)
- Example: "Semua yang Kamu Butuhkan untuk **Jualan Online**"

---

## 3. Tab Content — 5 Panels

All panels share base style: dark glass `rgba(8,10,16,0.95)`, app chrome header (3 traffic light dots), content area with realistic UI.

### Tab 1 — Website Toko (icon: Globe)

Browser chrome with URL bar showing `tokosaya.amora.id`:
- Storefront navbar: logo "TOKO SAYA" + menu links (Produk, Tentang, Promo) + "Belanja" button green
- Product grid 3 columns: T-Shirt Oversize Rp 185.000 / Hoodie Crop Navy Rp 320.000 / Celana Cargo Olive Rp 245.000
- Each product: image area (dark placeholder with subtle gradient) + name + price + "+ Keranjang" green button
- Background: light green tint (`#f0faf0` or similar) to contrast with dark UI — shows the "store looks clean for buyers"

### Tab 2 — Dashboard (icon: BarChart2)

3 stat cards horizontal row:
- Total Pesanan: **247** / Revenue: **Rp 18.4jt** / Pengunjung: **1.2rb**
- Each card: glassmorphic, small label above, big number, subtle green trend arrow

Bar chart below (7 bars = Mon–Sun), bars use gradient teal→green, animated height on tab activation.

Order feed at bottom: 2 rows — "T-Shirt Oversize ×2 · Rp 370.000 · Dibayar" and "Hoodie Crop ×1 · Rp 320.000 · Diproses"

### Tab 3 — Pembayaran (icon: CreditCard)

Checkout page mockup:
- Order summary card: "T-Shirt Oversize ×1 — Rp 185.000", total section
- Payment method: 2 selectable cards (not 3 — no COD)
  - QRIS (selected, teal border + radio dot)
  - Transfer BCA
- "Bayar Sekarang" full-width green button at bottom

### Tab 4 — Kustomisasi (icon: Palette)

Split layout inside panel:
- Left (~35%): editor panel — 5 color swatches (Sage active/selected, Ocean, Terra, Amber, Royal) + font selector row (2 options) + layout toggle
- Right (~65%): live mini storefront preview — navbar color changes to match active swatch, product cards show updated theme

### Tab 5 — Promo (icon: Tag)

3 promo code rows only (no input field, no "Buat Promo" button):
- AMORA20 | Diskon 20% semua produk | progress bar 85% (142×) | toggle ON (teal)
- ONGKIR0 | Gratis ongkir min. Rp 100rb | progress bar 58% (89×) | toggle ON
- BELI2 | Beli 2 gratis 1 item pilihan | progress bar 22% (34×) | toggle OFF (grey)

Each row: glassmorphic card, code bold monospace, description muted, progress bar teal, toggle right-aligned.

---

## 4. Remove / Disable

- Auto-slide timer on showcase → disabled entirely
- Hover 3D tilt on `.showcase-panel` → removed (user preference)
- Long descriptive text blocks in feature section → removed or compressed to 1 line max
- Bullet point checklist under feature heading → removed

---

## 5. Style Consistency Rules

All panels must follow:
- Background: `rgba(8,10,16,0.95)` or `rgba(10,14,20,0.97)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Accent color: `var(--accent)` = teal/green from hero (`#64d2b4` / `rgba(100,210,180,x)`)
- Typography: same font stack as hero
- No white backgrounds inside panels (exception: Tab 1 storefront preview may use very light green tint to show buyer-facing UI contrast)
