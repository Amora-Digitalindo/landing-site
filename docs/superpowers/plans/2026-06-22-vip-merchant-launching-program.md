# VIP Merchant Launching Program Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "VIP Merchant Launching Program" section to `amora-landing-v2.html` (free 3-month trial → lifetime discounted price) and update the hero CTAs to promote it.

**Architecture:** This is a static HTML/CSS site with no build step and no test framework — `amora-landing-v2.html` is hand-edited directly, and all CSS lives in `css/amora-landing-v2.css` (already extracted from the former inline `<style>` block). There is no JS framework; scroll-reveal animation is handled by existing `reveal`/`delay-N` classes already wired up elsewhere on the page, so no new JS is needed. "Testing" in this codebase means: grep-verify the edit landed correctly, then serve the file locally and visually confirm in a browser at desktop and mobile widths.

**Tech Stack:** Plain HTML5, CSS3 (custom properties already defined in `:root`), no JS frameworks, no build tooling.

---

### Task 1: Update hero CTA buttons

**Files:**
- Modify: `amora-landing-v2.html:260-274`

- [ ] **Step 1: Replace the hero CTA block**

Current content at lines 260–274:

```html
          <div class="hero-cta">
            <a href="https://admin.amora.id/" class="btn-primary">
              Buka Toko Sekarang
              <svg data-icon viewBox="0 0 24 24" width="15" height="15">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#fitur" class="hero-secondary-link">
              Lihat fitur lengkap
              <svg data-icon viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>
```

Replace with:

```html
          <div class="hero-cta">
            <a href="#vip-program" class="btn-primary">
              Join VIP Merchant Free Trial
              <svg data-icon viewBox="0 0 24 24" width="15" height="15">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="https://admin.amora.id/" class="btn-ghost">
              Buka Toko Sekarang
            </a>
          </div>
```

Use the Edit tool with the exact `old_string`/`new_string` shown above (the file uses 10-space indentation at this nesting level — match it exactly).

- [ ] **Step 2: Verify the edit landed**

Run: `grep -n "Join VIP Merchant Free Trial\|Buka Toko Sekarang\|Lihat fitur lengkap" "amora-landing-v2.html"`

Expected output: two matches — `Join VIP Merchant Free Trial` and `Buka Toko Sekarang` inside `.hero-cta` (around line 261–268). `Lihat fitur lengkap` must NOT appear anywhere in the file (it only existed in the hero).

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: promote VIP Merchant trial in hero CTA"
```

---

### Task 2: Add `.btn-ghost` sizing override for hero context

The existing `.btn-ghost` class (defined at `css/amora-landing-v2.css:534`) is a generic outlined button used elsewhere on the page at its default padding/font-size. The hero's `.btn-primary` gets a size bump via the existing `.hero-cta .btn-primary` rule (`css/amora-landing-v2.css:1088-1091`, padding `11px 22px`, font-size `0.875rem`). Add a matching override so the new `.btn-ghost` in the hero is visually the same size as the primary button next to it.

**Files:**
- Modify: `css/amora-landing-v2.css:1088-1091`

- [ ] **Step 1: Add the sizing rule right after `.hero-cta .btn-primary`**

Current content at lines 1088–1091:

```css
    .hero-cta .btn-primary {
      padding: 11px 22px;
      font-size: 0.875rem;
    }
```

Replace with:

```css
    .hero-cta .btn-primary {
      padding: 11px 22px;
      font-size: 0.875rem;
    }

    .hero-cta .btn-ghost {
      padding: 11px 22px;
      font-size: 0.875rem;
    }
```

- [ ] **Step 2: Verify**

Run: `grep -n "hero-cta .btn-ghost" "css/amora-landing-v2.css"`

Expected: one match.

- [ ] **Step 3: Commit**

```bash
git add css/amora-landing-v2.css
git commit -m "style: size hero secondary button to match primary CTA"
```

---

### Task 3: Insert the VIP Merchant Launching Program section

**Files:**
- Modify: `amora-landing-v2.html:1716-1718` (insert new section between the divider and `#harga`)

- [ ] **Step 1: Insert the new section before `<section id="harga">`**

Current content at lines 1716–1719:

```html
  <div class="section-divider" aria-hidden="true"></div>

  <!-- ══════════════ PRICING ══════════════ -->
  <section id="harga" class="py-section">
```

Replace with:

```html
  <div class="section-divider" aria-hidden="true"></div>

  <!-- ══════════════ VIP MERCHANT LAUNCHING PROGRAM ══════════════ -->
  <section id="vip-program" class="py-section">
    <div class="section-inner">

      <div class="vip-header reveal">
        <div class="section-eyebrow"><span class="section-eyebrow-dot"></span>Program Peluncuran</div>
        <h2>Daftar Sekarang, Jadi<br><span class="accent">VIP Merchant.</span></h2>
        <p>Coba gratis hingga 3 bulan, lalu nikmati harga spesial seumur hidup sebagai merchant VIP.</p>
      </div>

      <div class="vip-cards">
        <div class="vip-card reveal delay-1">
          <div class="vip-card-icon">
            <svg data-icon viewBox="0 0 24 24" width="22" height="22">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15.5 14" />
            </svg>
          </div>
          <div class="vip-card-title">Gratis hingga 3 Bulan</div>
          <div class="vip-card-desc">Coba semua fitur Amora tanpa biaya selama masa trial, tanpa kartu kredit.</div>
        </div>

        <div class="vip-card vip-card-accent reveal delay-2">
          <div class="vip-card-icon">
            <svg data-icon viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
            </svg>
          </div>
          <div class="vip-card-title">Harga VIP Seumur Hidup</div>
          <div class="vip-card-desc">Setelah trial berakhir, kunci harga spesial selamanya:</div>
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

  <div class="section-divider" aria-hidden="true"></div>

  <!-- ══════════════ PRICING ══════════════ -->
  <section id="harga" class="py-section">
```

- [ ] **Step 2: Verify the edit landed and the file is still well-formed**

Run: `grep -n '<section id="vip-program"\|<section id="harga"' "amora-landing-v2.html"`

Expected: `vip-program` section opens before `harga` section, with exactly one occurrence of each.

Run: `grep -c "<section" "amora-landing-v2.html"; grep -c "</section>" "amora-landing-v2.html"`

Expected: both counts equal (one new opening tag and one new closing tag added, so the total stays balanced — count went up by 1 on each side compared to before this task).

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: add VIP Merchant launching program section"
```

---

### Task 4: Style the VIP section

**Files:**
- Modify: `css/amora-landing-v2.css` (append new rules; insert right after the existing pricing rules block, i.e. after the `.plan-price span` rule ending around line 6265, so VIP styles sit next to the pricing styles they visually borrow from)

- [ ] **Step 1: Locate the insertion point**

Run: `grep -n "\.plan-price span" "css/amora-landing-v2.css"`

Expected: one match around line 6261. The rule block ends 3 lines later (closing `}` around line 6265).

- [ ] **Step 2: Insert the VIP CSS block immediately after that rule's closing brace**

Insert this block (use the Edit tool, anchoring `old_string` on the `.plan-price span { ... }` rule plus its closing brace so the new rules land directly after it):

```css
    .plan-price span {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-60);
    }

    /* ═══════════════════════════════════════
       VIP MERCHANT LAUNCHING PROGRAM
       ═══════════════════════════════════════ */

    .vip-header {
      text-align: center;
      margin-bottom: 56px;
    }

    .vip-header h2 {
      font-family: var(--font-display);
      font-size: clamp(1.75rem, 2.8vw, 2.375rem);
      font-weight: 800;
      line-height: 1.2;
      margin: 16px 0 12px;
    }

    .vip-header h2 .accent {
      background: linear-gradient(135deg, #B8E6A0 0%, #7FB86A 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .vip-header p {
      color: var(--text-60);
      font-size: 1rem;
      max-width: 480px;
      margin: 0 auto;
    }

    .vip-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }

    @media (min-width: 640px) {
      .vip-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .vip-cards {
        grid-template-columns: 1fr;
      }
    }

    .vip-card {
      background: rgba(16, 18, 30, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--r-2xl);
      padding: 32px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 24px 72px rgba(0, 0, 0, 0.55),
        0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .vip-card-accent {
      background: radial-gradient(ellipse at 60% -20%, rgba(107, 142, 90, 0.30) 0%, rgba(10, 20, 14, 0.95) 60%);
      border: 1.5px solid rgba(107, 142, 90, 0.6);
      box-shadow:
        0 0 0 1px rgba(107, 142, 90, 0.1),
        0 28px 72px rgba(0, 0, 0, 0.65),
        0 0 100px rgba(107, 142, 90, 0.2);
    }

    .vip-card-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--r-xl);
      background: var(--accent-dim);
      border: 1px solid var(--accent-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-light);
      margin-bottom: 16px;
    }

    .vip-card-title {
      font-family: var(--font-display);
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 8px;
    }

    .vip-card-desc {
      font-size: 0.875rem;
      color: var(--text-60);
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .vip-price-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .vip-price-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .vip-price-tier {
      font-family: var(--font-display);
      font-size: 0.6875rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-40);
    }

    .vip-price-old {
      font-size: 0.8125rem;
      color: var(--text-40);
      text-decoration: line-through;
    }

    .vip-price-new {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .vip-price-new span {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-60);
    }

    .vip-validity {
      text-align: center;
      font-size: 0.8125rem;
      color: var(--text-40);
      margin-bottom: 24px;
    }

    .vip-cta {
      display: flex;
      margin: 0 auto;
      width: fit-content;
    }
```

- [ ] **Step 3: Verify the CSS is syntactically balanced**

Run: `grep -c "^    \.vip-" "css/amora-landing-v2.css"` — expected: at least 12 (one per new class rule opener, sanity check the block landed).

Run a brace-balance check across the whole file (this CSS has no build step, so a mismatched brace would silently break every rule after it):

```bash
python3 -c "
content = open('css/amora-landing-v2.css').read()
print('open:', content.count('{'), 'close:', content.count('}'))
"
```

Expected: `open` and `close` counts are equal.

- [ ] **Step 4: Commit**

```bash
git add css/amora-landing-v2.css
git commit -m "style: add VIP Merchant launching program section styles"
```

---

### Task 5: Visual verification in browser

**Files:** none (verification only)

- [ ] **Step 1: Serve the site locally**

```bash
cd "/Users/ryantika/Documents/amora.id/Web/Landing Page 2" && python3 -m http.server 8123
```

- [ ] **Step 2: Load the page and check the hero**

Open `http://localhost:8123/amora-landing-v2.html` in a browser. Confirm:
- Hero shows two buttons side by side: "Join VIP Merchant Free Trial" (filled/primary) and "Buka Toko Sekarang" (outlined), same height.
- Clicking "Join VIP Merchant Free Trial" smooth-scrolls to the new VIP section (anchor `#vip-program`).
- Clicking "Buka Toko Sekarang" still points to `https://admin.amora.id/` (check the link target, don't need to actually navigate).

- [ ] **Step 3: Check the new section**

Scroll to the VIP Merchant section (between the feature showcase and Pricing). Confirm:
- Two cards render: "Gratis hingga 3 Bulan" and the accent-bordered "Harga VIP Seumur Hidup" card showing Starter Rp99.000 (was Rp134.000, struck through) and Pro Rp179.000 (was Rp209.000, struck through).
- "Berlaku hingga 31 Desember 2026" text and "Daftar VIP Merchant Sekarang" button appear below the cards, centered.
- Scroll-reveal fade-in animation triggers as you scroll into the section (same effect as the Pricing cards above it).

- [ ] **Step 4: Check responsive layout**

Resize the browser to ~375px width (or use devtools device toolbar). Confirm:
- The two hero buttons wrap/stack without overflowing.
- The two VIP cards stack into a single column (grid switches to `1fr` per the `@media (max-width: 768px)` rule from Task 4).

- [ ] **Step 5: Stop the server**

Press `Ctrl+C` in the terminal running the Python server.

---

## Spec Coverage Check

- Hero CTA update → Task 1, Task 2 ✓
- New VIP section, placement before `#harga` → Task 3 ✓
- Free trial + lifetime price messaging, Starter 99k / Pro 179k → Task 3 ✓
- Validity date placeholder with TODO comment → Task 3 ✓
- Registration CTA placeholder with TODO comment → Task 3 ✓
- CSS in external stylesheet, no inline `<style>` reintroduced → Task 4 ✓
- Responsive behavior reusing pricing breakpoint (640px/768px) → Task 4 ✓
- astro-app untouched → no task touches `astro-app/` ✓
