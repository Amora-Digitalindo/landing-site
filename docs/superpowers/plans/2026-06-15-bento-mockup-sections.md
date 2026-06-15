# Bento Mockup Sections & Reveal Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the scroll-reveal fallback so every `.reveal` section appears reliably, and replace the two static-image feature sections below the hero with animated "Live Orders" and "Delivery Tracking" bento-style widgets (Resend/Linear/Vercel aesthetic), with rewritten copy matching Amora's order-management features.

**Architecture:** Single-file vanilla HTML/CSS/JS change to `amora-landing-v2.html`. No build step, no new files, no new dependencies. New CSS lives in the existing `<style>` block (shared `.bento-widget` base class + two widget-specific blocks + keyframes). New JS lives in the existing `<script>` block as a small self-contained IIFE for the Live Orders feed; the Delivery Tracking widget is pure CSS animation.

**Tech Stack:** HTML5, CSS3 (custom properties, `@keyframes`, `prefers-reduced-motion`), vanilla ES6 JS (IntersectionObserver).

---

## Task 1: Fix scroll-reveal fallback (per-element)

**Files:**
- Modify: `amora-landing-v2.html` (script section, reveal observer block)

- [ ] **Step 1: Replace the global fallback with a per-element fallback**

Find this block in the `<script>` section:

```js
  // Scroll reveal — with staggered entrance and fallback
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

Replace it with:

```js
  // Scroll reveal — with staggered entrance and per-element fallback
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
      // caught it within 1.5s (handles edge cases/timing misses).
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

- [ ] **Step 2: Verify in browser**

Start the preview server (if not already running) using `preview_start` with `cwd` set to the project directory and command `npx serve -p 3456 .`. Then:

1. `preview_eval`: `document.querySelectorAll('.reveal').length` — note the count (call it N).
2. Reload the page.
3. Wait ~2 seconds, then `preview_eval`: `document.querySelectorAll('.reveal.visible').length`.

Expected: the second count equals N (every `.reveal` element has `.visible`).

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "fix: make scroll-reveal fallback per-element so no section stays hidden"
```

---

## Task 2: Add shared bento-widget CSS (Live Orders + Delivery Tracking)

**Files:**
- Modify: `amora-landing-v2.html` (`<style>` section, after the feature-sections responsive rule, before the `FEATURES GRID` comment block)

- [ ] **Step 1: Insert the new CSS block**

Find this anchor (existing CSS, three consecutive lines):

```css
    #feature-setup { overflow: hidden; }
    .feature-image.setup .feature-image-frame { max-width: none; }
    @media (max-width: 1023px) { .order-first { order: -1; } }
```

Replace it with the same three lines plus the new CSS block appended after:

```css
    #feature-setup { overflow: hidden; }
    .feature-image.setup .feature-image-frame { max-width: none; }
    @media (max-width: 1023px) { .order-first { order: -1; } }

    /* ═══════════════════════════════════════
       BENTO WIDGETS (Live Orders / Tracking)
    ═══════════════════════════════════════ */
    .bento-widget {
      position: relative;
      background: var(--surface-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-top: 1px solid rgba(255,255,255,0.14);
      border-radius: var(--r-2xl);
      padding: 22px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.09),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 12px 40px rgba(0,0,0,0.5),
        0 4px 12px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .bento-widget::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 50%);
      pointer-events: none;
    }

    /* ── Live Orders widget ── */
    .orders-widget-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 16px; position: relative; z-index: 1;
    }
    .orders-widget-icon {
      flex-shrink: 0;
      width: 32px; height: 32px; border-radius: var(--r-md);
      background: linear-gradient(135deg, rgba(107,142,90,0.22) 0%, rgba(107,142,90,0.08) 100%);
      border: 1px solid var(--accent-border);
      display: flex; align-items: center; justify-content: center;
    }
    .orders-widget-icon svg { width: 15px; height: 15px; color: var(--accent-light); }
    .orders-widget-title {
      font-family: var(--font-display);
      font-size: 0.9375rem; font-weight: 700; color: var(--text);
      flex: 1;
    }
    .orders-widget-live {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 10px; border-radius: var(--r-full);
      background: var(--accent-dim); border: 1px solid var(--accent-border);
      font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--accent-light);
    }
    .orders-widget-list {
      position: relative; z-index: 1;
      display: flex; flex-direction: column; gap: 10px;
      height: 204px; overflow: hidden;
    }
    .order-card {
      display: flex; align-items: center; gap: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: var(--r-lg);
      transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
                  transform 0.5s cubic-bezier(0.22,1,0.36,1);
    }
    .order-card.entering { opacity: 0; transform: scale(0.92) translateY(-18px); }
    .order-card.exiting  { opacity: 0; transform: scale(0.95) translateY(18px); }
    .order-card-icon {
      flex-shrink: 0;
      width: 36px; height: 36px; border-radius: var(--r-md);
      background: linear-gradient(135deg, rgba(107,142,90,0.25) 0%, rgba(107,142,90,0.08) 100%);
      border: 1px solid var(--accent-border);
      display: flex; align-items: center; justify-content: center;
    }
    .order-card-icon svg { width: 16px; height: 16px; color: var(--accent-light); }
    .order-card-info { flex: 1; min-width: 0; }
    .order-card-top {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      margin-bottom: 2px;
    }
    .order-card-label {
      font-size: 0.6875rem; font-weight: 600; color: var(--text-40);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .order-card-id {
      font-family: 'SF Mono', 'Roboto Mono', 'Consolas', monospace;
      font-size: 0.6875rem; color: var(--text-30);
    }
    .order-card-item {
      font-size: 0.875rem; font-weight: 500; color: var(--text-80);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .order-card-price {
      flex-shrink: 0;
      font-family: var(--font-display);
      font-size: 0.9375rem; font-weight: 700; color: var(--accent-light);
      text-shadow: 0 0 16px var(--accent-glow);
    }

    /* ── Delivery Tracking widget ── */
    .tracking-widget-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 28px; position: relative; z-index: 1;
    }
    .tracking-widget-title {
      font-family: var(--font-display);
      font-size: 0.9375rem; font-weight: 700; color: var(--text);
    }
    .tracking-widget-id {
      font-family: 'SF Mono', 'Roboto Mono', 'Consolas', monospace;
      font-size: 0.75rem; color: var(--text-30);
    }
    .tracking-steps { position: relative; z-index: 1; padding-left: 4px; }
    .tracking-line {
      position: absolute; top: 16px; bottom: 16px; left: 19px;
      width: 2px;
      background: rgba(255,255,255,0.08);
      border-radius: 1px;
      overflow: hidden;
    }
    .tracking-line-fill {
      position: absolute; top: 0; left: 0; right: 0;
      height: 0%;
      background: linear-gradient(180deg, var(--accent) 0%, var(--accent-light) 100%);
      animation: track-fill 6s cubic-bezier(0.45,0,0.55,1) infinite;
    }
    .tracking-dot {
      position: absolute; left: 16px; top: 0;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--accent-light);
      box-shadow: 0 0 8px 2px var(--accent-glow);
      animation: track-dot 6s cubic-bezier(0.45,0,0.55,1) infinite;
    }
    @keyframes track-fill {
      0%   { height: 0%; }
      45%  { height: 75%; }
      55%  { height: 75%; }
      100% { height: 0%; }
    }
    @keyframes track-dot {
      0%   { top: 0%; }
      45%  { top: 75%; }
      55%  { top: 75%; }
      100% { top: 0%; }
    }
    .tracking-step {
      position: relative;
      display: flex; align-items: flex-start; gap: 14px;
      padding-bottom: 28px;
    }
    .tracking-step:last-child { padding-bottom: 0; }
    .tracking-node {
      flex-shrink: 0;
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      position: relative; z-index: 1;
    }
    .tracking-node svg { width: 14px; height: 14px; color: var(--text-40); }
    .tracking-step.done .tracking-node,
    .tracking-step.active .tracking-node {
      background: var(--accent-dim);
      border-color: var(--accent-border);
    }
    .tracking-step.done .tracking-node svg,
    .tracking-step.active .tracking-node svg { color: var(--accent-light); }
    .tracking-node-pulse::after {
      content: '';
      position: absolute; inset: -1px;
      border-radius: 50%;
      border: 1px solid var(--accent-light);
      animation: track-pulse 2s cubic-bezier(0.22,1,0.36,1) infinite;
    }
    @keyframes track-pulse {
      0%   { transform: scale(1);   opacity: 0.7; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .tracking-step-text { display: flex; flex-direction: column; gap: 3px; padding-top: 4px; }
    .tracking-step-text strong { font-size: 0.875rem; font-weight: 600; color: var(--text-60); }
    .tracking-step.done .tracking-step-text strong,
    .tracking-step.active .tracking-step-text strong { color: var(--text); }
    .tracking-step-text span { font-size: 0.75rem; color: var(--text-40); }

    @media (prefers-reduced-motion: reduce) {
      .tracking-line-fill { animation: none; height: 75%; }
      .tracking-dot       { animation: none; opacity: 0; }
      .tracking-node-pulse::after { animation: none; opacity: 0; }
    }
```

- [ ] **Step 2: Verify the page still loads without CSS errors**

`preview_console_logs` (filtered to errors) after reloading — expect no new errors. The widgets aren't referenced in HTML yet, so the page should look unchanged.

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: add bento-widget CSS for Live Orders and Delivery Tracking mockups"
```

---

## Task 3: Redesign Section 1 (`#fitur`) — Live Orders widget + copy

**Files:**
- Modify: `amora-landing-v2.html` (`#fitur` section HTML)

- [ ] **Step 1: Replace the `#fitur` section markup**

Find this section:

```html
    <!-- ══════════════ FEATURE: MARGIN ══════════════ -->
    <section id="fitur" class="py-section">
      <div class="section-inner">
        <div class="feature-grid margin-grid">
          <div class="feature-text reveal from-left">
            <span class="section-eyebrow"><span class="section-eyebrow-dot"></span>Keunggulan Amora</span>
            <h2>Amankan <span class="accent">margin</span><br>produk toko Anda</h2>
            <p>Jual langsung melalui website toko sendiri tanpa bergantung sepenuhnya pada marketplace. Margin keuntungan tetap optimal, brand bisnis lebih profesional.</p>
            <ul class="feature-bullets">
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Tanpa potongan komisi marketplace</li>
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Brand bisnis yang lebih terpercaya</li>
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Kontrol penuh atas data pelanggan</li>
            </ul>
          </div>
          <div class="feature-image order-first reveal from-right delay-2">
            <div class="animate-float">
              <div class="feature-image-frame">
                <img src="./asset/feature-margin.png" alt="Margin Analytics">
              </div>
            </div>
            <div class="glow-bg"></div>
          </div>
        </div>
      </div>
    </section>
```

Replace it with:

```html
    <!-- ══════════════ FEATURE: LIVE ORDERS ══════════════ -->
    <section id="fitur" class="py-section">
      <div class="section-inner">
        <div class="feature-grid margin-grid">
          <div class="feature-text reveal from-left">
            <span class="section-eyebrow"><span class="section-eyebrow-dot"></span>Keunggulan Amora</span>
            <h2>Amankan <span class="accent">margin</span><br>produk toko Anda</h2>
            <p>Jual langsung melalui website toko sendiri tanpa bergantung sepenuhnya pada marketplace. Setiap pesanan masuk langsung ke dashboard Anda secara real-time — margin keuntungan tetap optimal, brand bisnis lebih profesional.</p>
            <ul class="feature-bullets">
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Notifikasi pesanan masuk secara real-time</li>
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Tanpa potongan komisi marketplace</li>
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Kontrol penuh atas data pelanggan</li>
            </ul>
          </div>
          <div class="feature-image order-first reveal from-right delay-2">
            <div class="bento-widget orders-widget" id="ordersWidget">
              <div class="orders-widget-header">
                <span class="orders-widget-icon"><svg data-icon viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                <span class="orders-widget-title">Pesanan Masuk</span>
                <span class="orders-widget-live"><span class="section-eyebrow-dot"></span>Live</span>
              </div>
              <div class="orders-widget-list" id="ordersList"></div>
            </div>
            <div class="glow-bg"></div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify in browser**

1. `preview_eval` (after reload): `document.getElementById('ordersWidget') !== null` → expect `true`.
2. `preview_eval`: `document.getElementById('ordersList').children.length` → expect `0` (JS not added yet, so the list is empty — this is expected at this stage).

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: redesign margin section with Live Orders widget and updated copy"
```

---

## Task 4: Redesign Section 2 (`#feature-setup`) — Delivery Tracking widget + copy

**Files:**
- Modify: `amora-landing-v2.html` (`#feature-setup` section HTML)

- [ ] **Step 1: Replace the `#feature-setup` section markup**

Find this section (note: the bullet list content may vary slightly — match by the surrounding structure and `id="feature-setup"` / `setup-grid` markers):

```html
    <!-- ══════════════ FEATURE: SETUP ══════════════ -->
    <section id="feature-setup" class="py-section">
      <div class="section-inner">
        <div class="feature-grid setup-grid">
          <div class="feature-image setup reveal from-left order-first">
            <div class="animate-float-slow">
              <div class="feature-image-frame">
                <img src="./asset/feature-setup.png" alt="Setup Toko Online">
              </div>
            </div>
            <div class="glow-bg"></div>
          </div>
          <div class="feature-text reveal from-right delay-2">
            <span class="section-eyebrow"><span class="section-eyebrow-dot"></span>Setup Cepat</span>
            <h2>Buat toko online<br>dalam <span class="accent">5 menit</span></h2>
```

Replace the **entire** `<section id="feature-setup" ...> ... </section>` block with:

```html
    <!-- ══════════════ FEATURE: ORDER TRACKING ══════════════ -->
    <section id="feature-setup" class="py-section">
      <div class="section-inner">
        <div class="feature-grid setup-grid">
          <div class="feature-image setup reveal from-left order-first">
            <div class="bento-widget tracking-widget">
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
                  <span class="tracking-node"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
                  <div class="tracking-step-text">
                    <strong>Pesanan Dikonfirmasi</strong>
                    <span>Hari ini, 09:12</span>
                  </div>
                </div>
                <div class="tracking-step done">
                  <span class="tracking-node"><svg data-icon viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></span>
                  <div class="tracking-step-text">
                    <strong>Sedang Disiapkan</strong>
                    <span>Hari ini, 10:40</span>
                  </div>
                </div>
                <div class="tracking-step active">
                  <span class="tracking-node tracking-node-pulse"><svg data-icon viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span>
                  <div class="tracking-step-text">
                    <strong>Dikirim</strong>
                    <span>Dalam perjalanan</span>
                  </div>
                </div>
                <div class="tracking-step">
                  <span class="tracking-node"><svg data-icon viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                  <div class="tracking-step-text">
                    <strong>Selesai</strong>
                    <span>Menunggu konfirmasi</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="glow-bg"></div>
          </div>
          <div class="feature-text reveal from-right delay-2">
            <span class="section-eyebrow"><span class="section-eyebrow-dot"></span>Kelola Pesanan</span>
            <h2>Pantau status pesanan<br>dari <span class="accent">awal sampai selesai</span></h2>
            <p>Setiap pesanan otomatis mendapatkan update status — dari dikonfirmasi, disiapkan, dikirim, hingga selesai. Pelanggan bisa memantau sendiri tanpa perlu bertanya ke Anda.</p>
            <ul class="feature-bullets">
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Status pesanan otomatis terupdate di setiap tahap</li>
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Pelanggan dapat memantau status pengiriman sendiri</li>
              <li><span class="feature-bullet-icon"><svg data-icon viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>Semua riwayat pesanan dalam satu dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify in browser**

1. Reload, `preview_eval`: `document.querySelectorAll('#feature-setup .tracking-step').length` → expect `4`.
2. `preview_eval`: `document.querySelector('#feature-setup .tracking-step.active') !== null` → expect `true`.
3. `preview_screenshot` of the `#feature-setup` section to visually sanity-check alignment of the vertical line against the step nodes. If the line is visibly off-center relative to the circular nodes, adjust `.tracking-line`'s `left` value (currently `19px`, half of the 32px node width minus half the 2px line width) and `.tracking-dot`'s `left` value (currently `16px`) in the CSS from Task 2 until centered.

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: redesign setup section with Delivery Tracking widget and order-management copy"
```

---

## Task 5: Live Orders feed animation (JS)

**Files:**
- Modify: `amora-landing-v2.html` (`<script>` section)

- [ ] **Step 1: Add the Live Orders feed IIFE**

Find the call to `initFaqs();` (or equivalent existing initialization call near the end of the `<script>` block) and add the new block immediately after it:

```js
  // ── Live Orders feed (Section: Pesanan Masuk) ──
  (function() {
    var list = document.getElementById('ordersList');
    if (!list) return;

    var ITEMS = [
      { item: 'Sneakers Classic White', price: 'Rp 249.000' },
      { item: 'Kaos Polos Premium',     price: 'Rp 89.000'  },
      { item: 'Tas Selempang Kanvas',   price: 'Rp 175.000' },
      { item: 'Kopi Arabika 250g',      price: 'Rp 65.000'  },
      { item: 'Jaket Hoodie Oversize',  price: 'Rp 219.000' },
      { item: 'Sandal Slip-On',         price: 'Rp 129.000' },
      { item: 'Botol Minum Stainless',  price: 'Rp 95.000'  },
      { item: 'Dompet Kulit Asli',      price: 'Rp 159.000' }
    ];

    var BAG_ICON = '<svg data-icon viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

    function randomOrderId() {
      return '#AMR-' + Math.floor(1000 + Math.random() * 9000);
    }

    function buildCard(data, animate) {
      var card = document.createElement('div');
      card.className = 'order-card' + (animate ? ' entering' : '');
      card.innerHTML =
        '<div class="order-card-icon">' + BAG_ICON + '</div>' +
        '<div class="order-card-info">' +
          '<div class="order-card-top">' +
            '<span class="order-card-label">Pesanan Baru</span>' +
            '<span class="order-card-id">' + randomOrderId() + '</span>' +
          '</div>' +
          '<div class="order-card-item">' + data.item + '</div>' +
        '</div>' +
        '<div class="order-card-price">' + data.price + '</div>';
      return card;
    }

    function addOrder() {
      var data = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      var card = buildCard(data, true);
      list.insertBefore(card, list.firstChild);

      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          card.classList.remove('entering');
        });
      });

      var cards = list.querySelectorAll('.order-card');
      if (cards.length > 3) {
        var last = cards[cards.length - 1];
        last.classList.add('exiting');
        last.addEventListener('transitionend', function() {
          if (last.parentNode) last.parentNode.removeChild(last);
        }, { once: true });
      }
    }

    // Initial 3 cards, no entrance animation
    [ITEMS[0], ITEMS[1], ITEMS[2]].forEach(function(data) {
      list.appendChild(buildCard(data, false));
    });

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    var widget = document.getElementById('ordersWidget');
    var started = false;
    function start() {
      if (started) return;
      started = true;
      setInterval(addOrder, 3000);
    }

    if ('IntersectionObserver' in window && widget) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            start();
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      io.observe(widget);
    } else {
      start();
    }
  })();
```

- [ ] **Step 2: Verify initial render**

1. Reload the page.
2. `preview_eval`: `document.querySelectorAll('#ordersList .order-card').length` → expect `3`.
3. `preview_eval`: `document.querySelector('#ordersList .order-card .order-card-item').textContent` → expect `"Sneakers Classic White"`.

- [ ] **Step 3: Verify the feed animates over time**

1. `preview_eval`: scroll the `#ordersWidget` into view, e.g. `document.getElementById('ordersWidget').scrollIntoView()`.
2. `preview_eval`: record current first item text — `document.querySelector('#ordersList .order-card .order-card-item').textContent`.
3. Wait ~4 seconds (e.g. via `preview_eval` with a `await new Promise(r => setTimeout(r, 4000))`, or issue the next eval ~4s later).
4. `preview_eval`: `document.querySelectorAll('#ordersList .order-card').length` → expect `3` (still capped at 3, old one removed after transition).

- [ ] **Step 4: Check console for errors**

`preview_console_logs` (onlyErrors: true) — expect no errors.

- [ ] **Step 5: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: animate Live Orders feed with mock data and lazy start on scroll"
```

---

## Task 6: Final full-page verification

**Files:** none (verification only)

- [ ] **Step 1: Full reload check**

1. Reload the page fully.
2. `preview_eval`: `document.querySelectorAll('.reveal').length === document.querySelectorAll('.reveal.visible').length` after a 2s wait → expect `true` (Task 1 fix holds across the whole page, not just the two redesigned sections).

- [ ] **Step 2: Confirm no leftover references to removed images**

`preview_eval`: `document.querySelectorAll('img[src*="feature-margin"], img[src*="feature-setup"]').length` → expect `0`.

- [ ] **Step 3: Visual screenshots**

`preview_screenshot` of:
1. The `#fitur` section (Live Orders widget) — scroll it into view first.
2. The `#feature-setup` section (Delivery Tracking widget) — scroll it into view first.

Confirm both widgets render as glass cards consistent with the rest of the page (dark translucent background, rounded corners, accent-green highlights), with no layout overflow or clipping issues on desktop width (`preview_resize` to ~1440px) and mobile width (~390px).

- [ ] **Step 4: Commit (if any adjustments were made during verification)**

```bash
git add amora-landing-v2.html
git commit -m "fix: polish bento widget alignment after visual verification"
```

(Skip this commit if no changes were needed.)

---

## Self-Review Notes

- **Spec coverage:** Reveal fix (Task 1), shared `.bento-widget` base + both widget CSS blocks + keyframes + reduced-motion (Task 2), Section 1 copy/markup + Live Orders widget (Task 3), Section 2 copy/markup + Delivery Tracking widget (Task 4), Live Orders JS animation with lazy start and reduced-motion bail-out (Task 5), removed image references verified (Task 6). All spec sections (1-6) are covered; `./asset/*.png` files are left on disk per spec section 5.
- **Placeholder scan:** No TBD/TODO; all code blocks are complete and copy-pasteable.
- **Type/name consistency:** `#ordersWidget` / `#ordersList` (Task 3 HTML) match the IDs used in Task 5 JS (`document.getElementById('ordersWidget')`, `document.getElementById('ordersList')`). CSS class names (`.bento-widget`, `.orders-widget-*`, `.order-card*`, `.tracking-*`) are consistent between Task 2 (definitions) and Tasks 3-4 (usage).
