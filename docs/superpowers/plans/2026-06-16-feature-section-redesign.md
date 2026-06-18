# Feature Section Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the feature showcase to a sidebar+panel layout, replace all 5 panel mockups with glassmorphic app-style content, and add compact floating cards to the hero on mobile.

**Architecture:** Single file `amora-landing-v2.html` — all changes are inline CSS + HTML + JS edits. CSS block is at top, HTML is mid-file, JS IIFE for showcase is at bottom (~line 4102). The `.showcase-view` elements stay in place; only their content and the surrounding nav are replaced.

**Tech Stack:** Vanilla HTML/CSS/JS, no build system. Preview at `http://localhost:PORT` via preview server.

---

## File Map

- **Modify only:** `amora-landing-v2.html`
  - CSS (~line 1417–1530): Replace showcase tab CSS → sidebar + pills CSS
  - CSS (~line 1482–1497): Update `.showcase-panel` border-radius + remove `border-top: none`
  - HTML (~line 3031–3086): Replace tab row + progress bar → sidebar + pills structure
  - HTML (~line 3088–end of showcase-panel): Rewrite content of all 5 `.showcase-view` elements
  - JS (~line 4102–4275): Replace auto-slide IIFE with simple tab switcher (keep kust cycle logic)
  - HTML (~line 808–819): Add mobile floating card CSS in mobile media query
  - HTML (~inside hero-canvas-wrap): Add 2 compact cards for mobile

---

## Task 1: Replace Showcase Tab CSS with Sidebar + Pills

**Files:**
- Modify: `amora-landing-v2.html` ~line 1417–1480

- [ ] **Step 1: Locate the CSS block to replace**

Find this exact opening comment in the CSS section:
```
/* ═══════════════════════════════════════
   FEATURE SHOWCASE (resend-style)
═══════════════════════════════════════ */
.feature-showcase { margin-top: 48px; }

/* Tab selector row — icons like resend.com tech stack */
.showcase-tabs-wrap {
```

Replace everything from `.feature-showcase { margin-top: 48px; }` through the end of `.showcase-progress-fill.animating { ... }` block (just before `/* Large panel */`) with:

```css
/* ═══════════════════════════════════════
   FEATURE SHOWCASE — sidebar layout
═══════════════════════════════════════ */
.feature-showcase { margin-top: 48px; }

/* Mobile pills (shown on mobile, hidden on desktop) */
.feature-pills {
  display: none;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  gap: 8px; padding-bottom: 4px;
  scrollbar-width: none; -ms-overflow-style: none;
  margin-bottom: 20px;
}
.feature-pills::-webkit-scrollbar { display: none; }
.feature-pill {
  flex-shrink: 0; padding: 8px 16px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.5);
  font-size: 12.5px; font-weight: 500; white-space: nowrap;
  cursor: pointer; transition: all 0.2s;
}
.feature-pill.active {
  background: rgba(100,210,180,0.12);
  border-color: rgba(100,210,180,0.4);
  color: var(--accent-light);
}

/* Desktop split: sidebar + panel */
.feature-showcase-split {
  display: flex; gap: 32px; align-items: flex-start;
}

/* Sidebar */
.feature-sidebar {
  width: 180px; flex-shrink: 0;
  display: flex; flex-direction: column; gap: 2px;
  position: sticky; top: 100px;
}
.feature-sidebar-tab {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px; border-radius: 10px;
  border: none; border-left: 2px solid transparent;
  background: transparent; color: rgba(255,255,255,0.42);
  cursor: pointer; text-align: left; width: 100%;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  font-size: 13px; font-weight: 500;
}
.feature-sidebar-tab:hover {
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.72);
}
.feature-sidebar-tab.active {
  background: rgba(100,210,180,0.08);
  border-left-color: var(--accent);
  color: rgba(255,255,255,0.92);
}
.feature-sidebar-tab svg {
  width: 16px; height: 16px; flex-shrink: 0;
  stroke: currentColor; fill: none; stroke-width: 1.75;
}
.feature-sidebar-label { white-space: nowrap; }

@media (max-width: 900px) {
  .feature-showcase-split { flex-direction: column; gap: 0; }
  .feature-sidebar { display: none; }
  .feature-pills { display: flex; }
}
```

- [ ] **Step 2: Update `.showcase-panel` CSS** (just below, ~line 1482)

Find:
```css
    /* Large panel */
    .showcase-panel {
      position: relative; height: 500px;
      background: rgba(8,10,16,0.97);
      border: 1px solid rgba(255,255,255,0.09);
      border-top: none;
      border-radius: 0 0 var(--r-xl) var(--r-xl);
      overflow: hidden;
```

Replace with:
```css
    /* Large panel */
    .showcase-panel {
      position: relative; height: 500px;
      background: rgba(8,10,16,0.97);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: var(--r-xl);
      overflow: hidden;
      flex: 1;
```

- [ ] **Step 3: Verify in browser — the panel should have rounded corners all around, no top-flat edge**

Open preview and navigate to `#features-grid`. The panel should be fully rounded rectangle.

- [ ] **Step 4: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: feature section sidebar CSS layout"
```

---

## Task 2: Replace Feature Section HTML Structure

**Files:**
- Modify: `amora-landing-v2.html` ~line 3031–3087 (section header + tabs + progress bar)

- [ ] **Step 1: Update the section heading** (~line 3033–3036)

Find:
```html
    <div class="features-header reveal">
      <div class="section-eyebrow"><span class="section-eyebrow-dot"></span>Semua Fitur</div>
      <h2>Sistem toko online sesuai <span class="accent">kebutuhan Anda</span></h2>
    </div>
```

Replace with:
```html
    <div class="features-header reveal">
      <div class="section-eyebrow"><span class="section-eyebrow-dot"></span>Fitur Lengkap</div>
      <h2>Semua yang kamu butuhkan untuk <span class="accent">jualan online</span></h2>
    </div>
```

- [ ] **Step 2: Replace tabs-wrap + progress bar + open showcase-panel with new sidebar structure**

Find this block (lines ~3038–3087):
```html
    <!-- Showcase: resend-style tab selector + large panel -->
    <div class="feature-showcase reveal">

      <!-- Tab selector row -->
      <div class="showcase-tabs-wrap" id="showcaseTabs">

        <button class="showcase-tab active" data-idx="0">
          <div class="showcase-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span class="showcase-tab-label">Website Toko</span>
        </button>

        <button class="showcase-tab" data-idx="1">
          <div class="showcase-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.75"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <span class="showcase-tab-label">Dashboard</span>
        </button>

        <button class="showcase-tab" data-idx="2">
          <div class="showcase-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <span class="showcase-tab-label">Pembayaran</span>
        </button>

        <button class="showcase-tab" data-idx="3">
          <div class="showcase-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          </div>
          <span class="showcase-tab-label">Kustomisasi</span>
        </button>

        <button class="showcase-tab" data-idx="4">
          <div class="showcase-tab-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.75"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          </div>
          <span class="showcase-tab-label">Promo</span>
        </button>

      </div>

      <!-- Progress bar -->
      <div class="showcase-progress">
        <div class="showcase-progress-fill animating" id="showcaseProgress"></div>
      </div>

      <!-- Large showcase panel -->
      <div class="showcase-panel">
```

Replace with:
```html
    <!-- Showcase: sidebar + panel -->
    <div class="feature-showcase reveal">

      <!-- Mobile pills -->
      <div class="feature-pills" id="featurePills">
        <button class="feature-pill active" data-idx="0">Website Toko</button>
        <button class="feature-pill" data-idx="1">Dashboard</button>
        <button class="feature-pill" data-idx="2">Pembayaran</button>
        <button class="feature-pill" data-idx="3">Kustomisasi</button>
        <button class="feature-pill" data-idx="4">Promo</button>
      </div>

      <!-- Desktop sidebar + panel split -->
      <div class="feature-showcase-split">

      <!-- Sidebar (desktop only) -->
      <nav class="feature-sidebar" id="featureSidebar">
        <button class="feature-sidebar-tab active" data-idx="0">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span class="feature-sidebar-label">Website Toko</span>
        </button>
        <button class="feature-sidebar-tab" data-idx="1">
          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          <span class="feature-sidebar-label">Dashboard</span>
        </button>
        <button class="feature-sidebar-tab" data-idx="2">
          <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span class="feature-sidebar-label">Pembayaran</span>
        </button>
        <button class="feature-sidebar-tab" data-idx="3">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          <span class="feature-sidebar-label">Kustomisasi</span>
        </button>
        <button class="feature-sidebar-tab" data-idx="4">
          <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <span class="feature-sidebar-label">Promo</span>
        </button>
      </nav>

      <!-- Large showcase panel -->
      <div class="showcase-panel">
```

- [ ] **Step 3: Close the new `feature-showcase-split` div**

After the closing `</div>` of `.showcase-panel` (and before the closing `</div>` of `.feature-showcase`), add `</div>` to close `.feature-showcase-split`:

Find:
```html
      </div><!-- /.showcase-panel -->

    </div><!-- /.feature-showcase -->
```

Replace with:
```html
      </div><!-- /.showcase-panel -->

      </div><!-- /.feature-showcase-split -->
    </div><!-- /.feature-showcase -->
```

- [ ] **Step 4: Verify in browser — sidebar appears on left, panel on right on desktop. Mobile shows pills at top.**

- [ ] **Step 5: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: feature section sidebar HTML structure"
```

---

## Task 3: Update JS — Remove Auto-Slide, Add Simple Tab Switcher

**Files:**
- Modify: `amora-landing-v2.html` ~line 4102–4275

- [ ] **Step 1: Locate the showcase IIFE**

Find this exact line:
```javascript
  // ── Feature Showcase (resend-style) ──
  (function() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INTERVAL = 5000;

    const tabs = Array.from(document.querySelectorAll('#showcaseTabs .showcase-tab'));
```

- [ ] **Step 2: Replace the entire showcase IIFE** (from `// ── Feature Showcase (resend-style) ──` through the closing `})();` before `// ── Widget interactivity ──`) with:

```javascript
  // ── Feature Showcase — sidebar + pills tab switcher ──
  (function() {
    const sidebarTabs = Array.from(document.querySelectorAll('#featureSidebar .feature-sidebar-tab'));
    const pillTabs    = Array.from(document.querySelectorAll('#featurePills .feature-pill'));
    const views       = Array.from(document.querySelectorAll('.showcase-panel .showcase-view'));
    let current = 0;

    // ── Kustomisasi: live color cycling ──
    const kustSwatchWraps = Array.from(document.querySelectorAll('#svKustSwatches .sv-kust-swatch-wrap'));
    const kustSwatches    = Array.from(document.querySelectorAll('#svKustSwatches .sv-kust-swatch'));
    const kustNav   = document.getElementById('svKustNav');
    const kustCta   = document.getElementById('svKustCta');
    const kustGrid  = document.getElementById('svKustGrid');
    const kustThumbs  = [document.getElementById('svKustThumb1'), document.getElementById('svKustThumb2'), document.getElementById('svKustThumb3')];
    const kustPrices  = [document.getElementById('svKustPrice1'), document.getElementById('svKustPrice2'), document.getElementById('svKustPrice3')];
    const kustBtns    = [document.getElementById('svKustBtn1'),   document.getElementById('svKustBtn2'),   document.getElementById('svKustBtn3')];
    const kustNames   = [document.getElementById('svKustName1'),  document.getElementById('svKustName2'),  document.getElementById('svKustName3')];
    let kustIdx = 0, kustTimer = null;

    const kustTabBtns = Array.from(document.querySelectorAll('#svKustTabs .sv-kust-tab'));
    const kustPanes   = Array.from(document.querySelectorAll('.sv-kust-controls .sv-kust-pane'));
    kustTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        kustTabBtns.forEach(b => b.classList.remove('active'));
        kustPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = document.querySelector(`.sv-kust-controls .sv-kust-pane[data-pane="${btn.dataset.tab}"]`);
        if (pane) pane.classList.add('active');
        if (btn.dataset.tab !== 'warna') stopKustCycle();
      });
    });

    document.querySelectorAll('.sv-kust-font-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.sv-kust-font-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const fontMap = { sans: 'Inter,sans-serif', serif: 'Georgia,serif', mono: "'SF Mono',monospace" };
        const ff = fontMap[opt.dataset.font] || 'Inter,sans-serif';
        kustNames.forEach(n => { if (n) n.style.fontFamily = ff; });
        if (kustNav) kustNav.querySelector('.sv-kust-nav-logo').style.fontFamily = ff;
      });
    });

    document.querySelectorAll('.sv-kust-layout-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.sv-kust-layout-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        if (!kustGrid) return;
        kustGrid.classList.remove('layout-list', 'layout-mosaic');
        if (opt.dataset.layout === 'list') kustGrid.classList.add('layout-list');
        else if (opt.dataset.layout === 'mosaic') kustGrid.classList.add('layout-mosaic');
      });
    });

    function applyKustColor(idx) {
      const swatch = kustSwatches[idx];
      if (!swatch) return;
      kustSwatches.forEach((s, i) => s.classList.toggle('active', i === idx));
      kustSwatchWraps.forEach((w, i) => w.classList.toggle('active', i === idx));
      const solid = swatch.dataset.solid || '#6B8E5A';
      const nav   = swatch.dataset.nav   || 'rgba(107,142,90,0.3)';
      if (kustNav) kustNav.style.background = nav;
      if (kustCta) kustCta.style.background = solid;
      kustPrices.forEach(p => { if (p) p.style.color = solid; });
      kustBtns.forEach(b => { if (b) b.style.background = solid; });
      const h = solid.replace('#','');
      const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
      const opacities = [0.2, 0.13, 0.08];
      kustThumbs.forEach((t, i) => { if (t) t.style.background = `rgba(${r},${g},${b},${opacities[i]})`; });
    }

    function startKustCycle() {
      if (kustTimer) return;
      kustTimer = setInterval(() => {
        const activeTab = document.querySelector('#svKustTabs .sv-kust-tab.active');
        if (activeTab && activeTab.dataset.tab !== 'warna') return;
        kustIdx = (kustIdx + 1) % kustSwatches.length;
        applyKustColor(kustIdx);
      }, 2200);
    }
    function stopKustCycle() { clearInterval(kustTimer); kustTimer = null; }

    // ── Main tab switcher ──
    function goTo(idx) {
      if (idx === current) return;
      sidebarTabs[current]?.classList.remove('active');
      pillTabs[current]?.classList.remove('active');
      views[current]?.classList.remove('active');
      current = idx;
      sidebarTabs[current]?.classList.add('active');
      pillTabs[current]?.classList.add('active');
      views[current]?.classList.add('active');
      if (current === 3) startKustCycle();
      else stopKustCycle();
    }

    [...sidebarTabs, ...pillTabs].forEach(tab => {
      tab.addEventListener('click', () => goTo(parseInt(tab.dataset.idx)));
    });

    // Init kust swatches click
    kustSwatches.forEach((s, i) => {
      s.addEventListener('click', () => { kustIdx = i; applyKustColor(i); stopKustCycle(); });
    });
  })();
```

- [ ] **Step 3: Verify — clicking sidebar tabs switches the panel. Mobile pills also switch panel. No auto-advance occurs.**

- [ ] **Step 4: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: feature section tab switcher, remove auto-slide"
```

---

## Task 4: Panel 1 — Website Toko (Full-Width Mockup)

**Files:**
- Modify: `amora-landing-v2.html` — content of `<div class="showcase-view active" data-view="0">`

- [ ] **Step 1: Add CSS for website toko panel** (add after existing showcase-view CSS block, ~line 1493)

Find:
```css
    .showcase-view.active { opacity: 1; transform: translateY(0); pointer-events: auto; }
```

Add after it:
```css
    /* Panel 1: Website Toko */
    .sv-browser { display:flex; flex-direction:column; height:100%; }
    .sv-browser-bar {
      display:flex; align-items:center; gap:6px; padding:10px 14px;
      background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.07);
      flex-shrink:0;
    }
    .sv-browser-dot { width:9px; height:9px; border-radius:50%; }
    .sv-browser-dot.red    { background:rgba(255,90,90,0.7); }
    .sv-browser-dot.yellow { background:rgba(255,180,50,0.6); }
    .sv-browser-dot.green  { background:rgba(80,200,80,0.6); }
    .sv-browser-url {
      flex:1; margin:0 10px; padding:4px 10px; border-radius:6px;
      background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
      font-size:11px; color:rgba(255,255,255,0.4); text-align:center;
    }
    .sv-store-wrap {
      flex:1; overflow:hidden;
      background:linear-gradient(160deg,rgba(12,22,14,0.95),rgba(8,14,10,0.98));
    }
    .sv-store-nav-bar {
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 16px; border-bottom:1px solid rgba(100,210,180,0.12);
    }
    .sv-store-logo { font-size:12px; font-weight:700; color:rgba(255,255,255,0.9); letter-spacing:0.08em; }
    .sv-store-links { display:flex; gap:12px; }
    .sv-store-link { font-size:10px; color:rgba(255,255,255,0.45); }
    .sv-store-cta-btn {
      padding:4px 12px; border-radius:6px; font-size:10px; font-weight:600;
      background:var(--accent); color:#0a1a0e; border:none; cursor:pointer;
    }
    .sv-product-row {
      display:grid; grid-template-columns:repeat(3,1fr); gap:10px; padding:14px 16px;
    }
    .sv-product-card {
      border-radius:10px; overflow:hidden;
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    }
    .sv-product-thumb {
      height:80px;
      background:linear-gradient(145deg,rgba(30,45,35,0.8),rgba(20,30,22,0.6));
      display:flex; align-items:center; justify-content:center; overflow:hidden;
    }
    .sv-product-thumb img { width:60px; height:60px; object-fit:contain; opacity:0.9; }
    .sv-product-info { padding:8px; }
    .sv-product-name-sm { font-size:9.5px; color:rgba(255,255,255,0.7); margin-bottom:4px; }
    .sv-product-price-sm { font-size:11px; font-weight:700; color:var(--accent-light); margin-bottom:6px; }
    .sv-product-add {
      width:100%; padding:5px; border-radius:6px; border:none; cursor:pointer;
      background:var(--accent); color:#0a1a0e; font-size:9px; font-weight:600;
    }
```

- [ ] **Step 2: Replace View 0 content**

Find the opening of view 0:
```html
        <!-- View 0: Website Toko -->
        <div class="showcase-view active" data-view="0">
          <div class="sv-split">
```

Replace the entire contents of `data-view="0"` (everything between its opening and closing `</div>`) with:
```html
        <!-- View 0: Website Toko -->
        <div class="showcase-view active" data-view="0">
          <div class="sv-browser">
            <div class="sv-browser-bar">
              <span class="sv-browser-dot red"></span>
              <span class="sv-browser-dot yellow"></span>
              <span class="sv-browser-dot green"></span>
              <div class="sv-browser-url">tokosaya.amora.id</div>
            </div>
            <div class="sv-store-wrap">
              <div class="sv-store-nav-bar">
                <span class="sv-store-logo">TOKO SAYA</span>
                <div class="sv-store-links">
                  <span class="sv-store-link">Produk</span>
                  <span class="sv-store-link">Tentang</span>
                  <span class="sv-store-link">Promo</span>
                </div>
                <button class="sv-store-cta-btn">Belanja</button>
              </div>
              <div class="sv-product-row">
                <div class="sv-product-card">
                  <div class="sv-product-thumb"><img src="asset/shirt.png" alt=""></div>
                  <div class="sv-product-info">
                    <div class="sv-product-name-sm">T-Shirt Oversize</div>
                    <div class="sv-product-price-sm">Rp 185.000</div>
                    <button class="sv-product-add">+ Keranjang</button>
                  </div>
                </div>
                <div class="sv-product-card">
                  <div class="sv-product-thumb"><img src="asset/shirt.png" alt=""></div>
                  <div class="sv-product-info">
                    <div class="sv-product-name-sm">Hoodie Crop Navy</div>
                    <div class="sv-product-price-sm">Rp 320.000</div>
                    <button class="sv-product-add">+ Keranjang</button>
                  </div>
                </div>
                <div class="sv-product-card">
                  <div class="sv-product-thumb"><img src="asset/shirt.png" alt=""></div>
                  <div class="sv-product-info">
                    <div class="sv-product-name-sm">Celana Cargo Olive</div>
                    <div class="sv-product-price-sm">Rp 245.000</div>
                    <button class="sv-product-add">+ Keranjang</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
```

- [ ] **Step 3: Click "Website Toko" tab — full storefront mockup fills the panel**

- [ ] **Step 4: Commit**
```bash
git add amora-landing-v2.html
git commit -m "feat: panel 1 website toko full mockup"
```

---

## Task 5: Panel 2 — Dashboard (Full-Width Mockup)

**Files:**
- Modify: `amora-landing-v2.html` — content of `<div class="showcase-view" data-view="1">`

- [ ] **Step 1: Add CSS for Dashboard panel** (add after Task 4's CSS block)

```css
    /* Panel 2: Dashboard */
    .sv-dash-wrap { padding:24px; display:flex; flex-direction:column; gap:16px; height:100%; box-sizing:border-box; }
    .sv-dash-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    .sv-dash-card {
      padding:14px; border-radius:12px;
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    }
    .sv-dash-card-label { font-size:10px; color:rgba(255,255,255,0.4); margin-bottom:6px; }
    .sv-dash-card-value { font-size:20px; font-weight:700; color:rgba(255,255,255,0.92); letter-spacing:-0.03em; }
    .sv-dash-card-trend { font-size:10px; color:var(--accent-light); margin-top:4px; }
    .sv-chart-wrap { flex:1; display:flex; flex-direction:column; gap:8px; min-height:0; }
    .sv-chart-label { font-size:10px; color:rgba(255,255,255,0.35); }
    .sv-chart-bars {
      flex:1; display:flex; align-items:flex-end; gap:6px; min-height:0;
      padding:0 0 4px;
    }
    .sv-chart-bar-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
    .sv-chart-bar {
      width:100%; border-radius:4px 4px 0 0;
      background:linear-gradient(180deg,rgba(100,210,180,0.8) 0%,rgba(60,160,120,0.6) 100%);
      transition:height 0.6s cubic-bezier(0.22,1,0.36,1);
    }
    .sv-chart-bar-day { font-size:8.5px; color:rgba(255,255,255,0.3); }
    .sv-feed { display:flex; flex-direction:column; gap:6px; }
    .sv-feed-row {
      display:flex; align-items:center; justify-content:space-between;
      padding:8px 12px; border-radius:8px;
      background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);
      font-size:11px;
    }
    .sv-feed-name { color:rgba(255,255,255,0.7); }
    .sv-feed-price { color:var(--accent-light); font-weight:600; }
    .sv-feed-status { font-size:9.5px; padding:2px 7px; border-radius:999px; }
    .sv-feed-status.paid { background:rgba(80,200,100,0.15); color:rgba(100,220,120,0.9); }
    .sv-feed-status.proc { background:rgba(200,160,60,0.15); color:rgba(220,180,80,0.9); }
```

- [ ] **Step 2: Replace View 1 content**

Find `<!-- View 1:` and the entire `<div class="showcase-view" data-view="1">` content, replace with:

```html
        <!-- View 1: Dashboard -->
        <div class="showcase-view" data-view="1">
          <div class="sv-dash-wrap">
            <div class="sv-dash-cards">
              <div class="sv-dash-card">
                <div class="sv-dash-card-label">Total Pesanan</div>
                <div class="sv-dash-card-value">247</div>
                <div class="sv-dash-card-trend">↑ 12% minggu ini</div>
              </div>
              <div class="sv-dash-card">
                <div class="sv-dash-card-label">Revenue Bulan Ini</div>
                <div class="sv-dash-card-value">Rp 18.4jt</div>
                <div class="sv-dash-card-trend">↑ 8% vs bulan lalu</div>
              </div>
              <div class="sv-dash-card">
                <div class="sv-dash-card-label">Pengunjung</div>
                <div class="sv-dash-card-value">1.2rb</div>
                <div class="sv-dash-card-trend">↑ 23% organik</div>
              </div>
            </div>
            <div class="sv-chart-wrap">
              <div class="sv-chart-label">Pesanan 7 hari terakhir</div>
              <div class="sv-chart-bars">
                <div class="sv-chart-bar-wrap"><div class="sv-chart-bar" style="height:55%"></div><div class="sv-chart-bar-day">Sen</div></div>
                <div class="sv-chart-bar-wrap"><div class="sv-chart-bar" style="height:72%"></div><div class="sv-chart-bar-day">Sel</div></div>
                <div class="sv-chart-bar-wrap"><div class="sv-chart-bar" style="height:48%"></div><div class="sv-chart-bar-day">Rab</div></div>
                <div class="sv-chart-bar-wrap"><div class="sv-chart-bar" style="height:85%"></div><div class="sv-chart-bar-day">Kam</div></div>
                <div class="sv-chart-bar-wrap"><div class="sv-chart-bar" style="height:63%"></div><div class="sv-chart-bar-day">Jum</div></div>
                <div class="sv-chart-bar-wrap"><div class="sv-chart-bar" style="height:91%"></div><div class="sv-chart-bar-day">Sab</div></div>
                <div class="sv-chart-bar-wrap"><div class="sv-chart-bar" style="height:78%"></div><div class="sv-chart-bar-day">Min</div></div>
              </div>
            </div>
            <div class="sv-feed">
              <div class="sv-feed-row">
                <span class="sv-feed-name">T-Shirt Oversize ×2</span>
                <span class="sv-feed-price">Rp 370.000</span>
                <span class="sv-feed-status paid">Dibayar</span>
              </div>
              <div class="sv-feed-row">
                <span class="sv-feed-name">Hoodie Crop Navy ×1</span>
                <span class="sv-feed-price">Rp 320.000</span>
                <span class="sv-feed-status proc">Diproses</span>
              </div>
            </div>
          </div>
```

- [ ] **Step 3: Click "Dashboard" — stat cards, chart bars, and order feed visible**

- [ ] **Step 4: Commit**
```bash
git add amora-landing-v2.html
git commit -m "feat: panel 2 dashboard full mockup"
```

---

## Task 6: Panel 3 — Pembayaran (Checkout Mockup)

**Files:**
- Modify: `amora-landing-v2.html` — content of `<div class="showcase-view" data-view="2">`

- [ ] **Step 1: Add CSS for Pembayaran panel**

```css
    /* Panel 3: Pembayaran */
    .sv-checkout-wrap {
      display:flex; flex-direction:column; gap:16px; padding:32px;
      max-width:420px; margin:0 auto; height:100%; box-sizing:border-box; justify-content:center;
    }
    .sv-checkout-title { font-size:14px; font-weight:600; color:rgba(255,255,255,0.85); margin-bottom:4px; }
    .sv-checkout-card {
      border-radius:12px; border:1px solid rgba(255,255,255,0.08);
      background:rgba(255,255,255,0.03); overflow:hidden;
    }
    .sv-checkout-item-row {
      display:flex; justify-content:space-between; align-items:center;
      padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.06);
      font-size:12px; color:rgba(255,255,255,0.7);
    }
    .sv-checkout-item-row:last-child { border-bottom:none; }
    .sv-checkout-total-row {
      display:flex; justify-content:space-between; align-items:center;
      padding:12px 16px; font-size:13px; font-weight:700;
      color:rgba(255,255,255,0.92);
      border-top:1px solid rgba(255,255,255,0.1);
    }
    .sv-checkout-total-row span { color:var(--accent-light); }
    .sv-pay-option {
      display:flex; align-items:center; gap:12px; padding:12px 16px;
      cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.06);
      transition:background 0.2s;
    }
    .sv-pay-option:last-child { border-bottom:none; }
    .sv-pay-option:hover { background:rgba(255,255,255,0.03); }
    .sv-pay-radio {
      width:16px; height:16px; border-radius:50%;
      border:2px solid rgba(255,255,255,0.25); flex-shrink:0;
      transition:border-color 0.2s, box-shadow 0.2s;
    }
    .sv-pay-option.active .sv-pay-radio {
      border-color:var(--accent); box-shadow:0 0 0 3px rgba(100,210,180,0.2);
    }
    .sv-pay-icon { font-size:18px; }
    .sv-pay-name { font-size:12.5px; color:rgba(255,255,255,0.8); font-weight:500; }
    .sv-pay-now-btn {
      width:100%; padding:13px; border-radius:12px; border:none; cursor:pointer;
      background:linear-gradient(135deg,var(--accent) 0%,rgba(80,180,140,1) 100%);
      color:#071410; font-size:13px; font-weight:700; letter-spacing:0.01em;
    }
```

- [ ] **Step 2: Replace View 2 content**

```html
        <!-- View 2: Pembayaran -->
        <div class="showcase-view" data-view="2">
          <div class="sv-checkout-wrap">
            <div class="sv-checkout-title">Ringkasan Pesanan</div>
            <div class="sv-checkout-card">
              <div class="sv-checkout-item-row">
                <span>T-Shirt Oversize × 1</span>
                <span>Rp 185.000</span>
              </div>
              <div class="sv-checkout-item-row">
                <span>Ongkir</span>
                <span style="color:var(--accent-light)">Gratis</span>
              </div>
              <div class="sv-checkout-total-row">
                <span>Total</span>
                <span>Rp 185.000</span>
              </div>
            </div>
            <div class="sv-checkout-title">Metode Pembayaran</div>
            <div class="sv-checkout-card">
              <div class="sv-pay-option active">
                <div class="sv-pay-radio"></div>
                <div class="sv-pay-icon">⬛</div>
                <div class="sv-pay-name">QRIS</div>
              </div>
              <div class="sv-pay-option">
                <div class="sv-pay-radio"></div>
                <div class="sv-pay-icon">🏦</div>
                <div class="sv-pay-name">Transfer BCA</div>
              </div>
            </div>
            <button class="sv-pay-now-btn">Bayar Sekarang →</button>
          </div>
```

- [ ] **Step 3: Click "Pembayaran" — checkout UI with 2 payment options visible centered in panel**

- [ ] **Step 4: Commit**
```bash
git add amora-landing-v2.html
git commit -m "feat: panel 3 pembayaran checkout mockup"
```

---

## Task 7: Panel 4 — Kustomisasi (Keep Existing, Remove sv-copy)

The Kustomisasi panel has a working color-cycle interaction. Keep all existing HTML inside the panel but remove only the `.sv-copy` (left text) half of `.sv-split`.

**Files:**
- Modify: `amora-landing-v2.html` — content of `<div class="showcase-view" data-view="3">`

- [ ] **Step 1: Find view 3 and locate its `.sv-split` → `.sv-copy` block**

The existing structure is:
```html
<div class="sv-split">
  <div class="sv-copy"> ... text content ... </div>
  <div class="sv-kust-mockup"> ... interactive kust mockup ... </div>
</div>
```

- [ ] **Step 2: Remove `.sv-split` wrapper and `.sv-copy` block, keep only the mockup**

Replace the entire content of `data-view="3"` with just the kust mockup content (remove `.sv-split` wrapper + `.sv-copy` div, keep `.sv-kust-mockup` div and its children). Also update `.sv-kust-mockup` to fill the full panel:

Find `<div class="sv-kust-mockup"` within view 3 and add inline style:
```html
<div class="sv-kust-mockup" style="width:100%;height:100%;display:flex;flex-direction:column;">
```

- [ ] **Step 3: Click "Kustomisasi" — the color swatches and live preview fill the full panel**

- [ ] **Step 4: Commit**
```bash
git add amora-landing-v2.html
git commit -m "feat: panel 4 kustomisasi full-width"
```

---

## Task 8: Panel 5 — Promo (Clean List)

**Files:**
- Modify: `amora-landing-v2.html` — content of `<div class="showcase-view" data-view="4">`

- [ ] **Step 1: Add CSS for Promo panel**

```css
    /* Panel 5: Promo */
    .sv-promo-wrap { padding:28px; display:flex; flex-direction:column; gap:12px; height:100%; box-sizing:border-box; justify-content:center; }
    .sv-promo-heading { font-size:14px; font-weight:600; color:rgba(255,255,255,0.8); margin-bottom:4px; }
    .sv-promo-item {
      display:grid; grid-template-columns:120px 1fr auto auto;
      align-items:center; gap:16px; padding:14px 18px; border-radius:12px;
      background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    }
    .sv-promo-code { font-family:monospace; font-size:12px; font-weight:700; color:rgba(255,255,255,0.9); letter-spacing:0.05em; }
    .sv-promo-desc { font-size:11px; color:rgba(255,255,255,0.45); }
    .sv-promo-usage { display:flex; flex-direction:column; gap:4px; min-width:120px; }
    .sv-promo-usage-bar { height:4px; border-radius:2px; background:rgba(255,255,255,0.08); overflow:hidden; }
    .sv-promo-usage-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--accent),var(--accent-light)); }
    .sv-promo-usage-count { font-size:9.5px; color:rgba(255,255,255,0.35); }
    .sv-promo-toggle {
      width:36px; height:20px; border-radius:10px; position:relative; cursor:pointer;
      background:rgba(255,255,255,0.12); transition:background 0.2s; flex-shrink:0;
    }
    .sv-promo-toggle.on { background:var(--accent); }
    .sv-promo-toggle::after {
      content:''; position:absolute; top:3px; left:3px;
      width:14px; height:14px; border-radius:50%; background:#fff;
      transition:transform 0.2s;
    }
    .sv-promo-toggle.on::after { transform:translateX(16px); }
```

- [ ] **Step 2: Replace View 4 content**

```html
        <!-- View 4: Promo -->
        <div class="showcase-view" data-view="4">
          <div class="sv-promo-wrap">
            <div class="sv-promo-heading">Kode Promo Aktif</div>
            <div class="sv-promo-item">
              <div class="sv-promo-code">AMORA20</div>
              <div class="sv-promo-desc">Diskon 20% semua produk</div>
              <div class="sv-promo-usage">
                <div class="sv-promo-usage-bar"><div class="sv-promo-usage-fill" style="width:85%"></div></div>
                <div class="sv-promo-usage-count">142× digunakan</div>
              </div>
              <div class="sv-promo-toggle on"></div>
            </div>
            <div class="sv-promo-item">
              <div class="sv-promo-code">ONGKIR0</div>
              <div class="sv-promo-desc">Gratis ongkir min. Rp 100rb</div>
              <div class="sv-promo-usage">
                <div class="sv-promo-usage-bar"><div class="sv-promo-usage-fill" style="width:58%"></div></div>
                <div class="sv-promo-usage-count">89× digunakan</div>
              </div>
              <div class="sv-promo-toggle on"></div>
            </div>
            <div class="sv-promo-item">
              <div class="sv-promo-code">BELI2</div>
              <div class="sv-promo-desc">Beli 2 gratis 1 item pilihan</div>
              <div class="sv-promo-usage">
                <div class="sv-promo-usage-bar"><div class="sv-promo-usage-fill" style="width:22%"></div></div>
                <div class="sv-promo-usage-count">34× digunakan</div>
              </div>
              <div class="sv-promo-toggle"></div>
            </div>
          </div>
```

- [ ] **Step 3: Click "Promo" — 3 promo code rows with usage bars and toggles, no input field**

- [ ] **Step 4: Commit**
```bash
git add amora-landing-v2.html
git commit -m "feat: panel 5 promo code list mockup"
```

---

## Task 9: Hero Mobile — Compact Floating Cards

**Files:**
- Modify: `amora-landing-v2.html` — mobile media query CSS + hero HTML

- [ ] **Step 1: Add CSS for mobile floating cards** — in the first `@media (max-width: 900px)` block (the one with `.gc-main`)

Find:
```css
      #hero { min-height: auto !important; padding: 80px 0 48px; }
      .hero-right { min-height: auto !important; }
    }
```

Add before the closing `}`:
```css
      .gc-mobile-cards { display:flex; flex-direction:column; gap:6px; margin-top:8px; width:90%; margin-left:5%; }
      .gc-mobile-card {
        display:flex; align-items:center; gap:10px; padding:10px 14px;
        border-radius:12px;
        background:rgba(12,22,16,0.78);
        backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        border:1px solid rgba(100,210,180,0.18);
        box-shadow:0 4px 16px rgba(0,0,0,0.3);
        opacity:0.9;
      }
      .gc-mobile-card-icon { font-size:14px; flex-shrink:0; }
      .gc-mobile-card-label { font-size:10px; color:rgba(255,255,255,0.45); }
      .gc-mobile-card-value { font-size:12px; font-weight:600; color:rgba(255,255,255,0.85); }
      .gc-mobile-card-price { font-size:11px; color:var(--accent-light); font-weight:600; margin-left:auto; flex-shrink:0; }
```

On desktop, `.gc-mobile-cards` must be hidden. Add this to the **desktop-only** default (outside media query), right after defining `.gc-mobile-cards`:

Find the line:
```css
    .scroll-indicator {
```

Add before it:
```css
    .gc-mobile-cards { display:none; }
```

- [ ] **Step 2: Add mobile card HTML inside hero-canvas-wrap**

Find the closing `</div>` of `.hero-canvas-wrap` (the one that has `id="heroWrap"`). It should be right after the last `.gc` card element. Add before the closing `</div>`:

```html
              <!-- Mobile-only compact floating cards -->
              <div class="gc-mobile-cards">
                <div class="gc-mobile-card">
                  <span class="gc-mobile-card-icon">🛍</span>
                  <div>
                    <div class="gc-mobile-card-label">Pesanan Baru</div>
                    <div class="gc-mobile-card-value">T-Shirt Oversize</div>
                  </div>
                  <div class="gc-mobile-card-price">Rp 185.000</div>
                </div>
                <div class="gc-mobile-card">
                  <span class="gc-mobile-card-icon">📍</span>
                  <div>
                    <div class="gc-mobile-card-label">Sedang Dikirim</div>
                    <div class="gc-mobile-card-value">Jakarta Selatan</div>
                  </div>
                </div>
              </div>
```

- [ ] **Step 3: Switch preview to mobile (375px). Verify 2 compact cards appear below the main storefront card.**

- [ ] **Step 4: Switch back to desktop. Verify the compact cards are hidden on desktop.**

- [ ] **Step 5: Commit**
```bash
git add amora-landing-v2.html
git commit -m "feat: hero mobile compact floating order+tracking cards"
```

---

## Task 10: Final Cleanup + Verification

**Files:**
- Modify: `amora-landing-v2.html`

- [ ] **Step 1: Remove old `.showcase-tab*`, `.showcase-progress*` CSS** if still present (search for `.showcase-tab {` — should be gone after Task 1, but double-check)

```bash
grep -n "showcase-tab\|showcase-progress" amora-landing-v2.html | grep -v "view\|panel\|wrap"
```
If any old `.showcase-tab` rules remain, delete them.

- [ ] **Step 2: Desktop check** — resize to 1280px. Verify:
  - Sidebar on left, panel on right, no empty space
  - Clicking each of 5 tabs switches panel content
  - No auto-slide

- [ ] **Step 3: Mobile check** — resize to 375px. Verify:
  - Hero shows main card + 2 compact floating cards below it
  - Feature section shows horizontal pills at top, panel below
  - Pills switch panel content

- [ ] **Step 4: Final commit**
```bash
git add amora-landing-v2.html
git commit -m "feat: feature section redesign complete"
```
