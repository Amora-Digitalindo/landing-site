# VIP Merchant Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's narrow single-column VIP Merchant card with a wider panel (top identity/urgency strip, animated highlight band, 3 individual benefit mini-cards, bottom price+CTA strip), fully responsive, with subtle ambient glow/shimmer animation.

**Architecture:** This is a static HTML/CSS/JS site with no build step and no test framework. Verification means: grep-check each edit landed, confirm CSS/HTML stay balanced, then load the page in headless Chrome and screenshot at desktop and mobile widths to confirm the new layout renders and collapses correctly.

**Tech Stack:** Plain HTML5, CSS3 (existing design tokens in `:root`), no JS changes needed (this is a pure markup/CSS redesign — no new script logic).

---

### Task 1: Replace the VIP card markup with the new panel structure

**Files:**
- Modify: `amora-landing-v2.html:1634-1685`

- [ ] **Step 1: Replace the `.vip-card` block**

Current content (the `.vip-card.vip-card-accent` block, a sibling of `.vip-header` inside `#vip-program`'s `.section-inner`):

```html
      <div class="vip-card vip-card-accent reveal delay-1">
        <div class="vip-card-icon">
          <img src="assets/vip-merchant-badge.png" alt="VIP Merchant Badge" width="64" height="64">
        </div>
        <div class="vip-slot-badge"><span class="vip-slot-icon">🔥</span> Hanya 30 Slot VIP Merchant</div>

        <div class="vip-card-title">Jadi VIP Merchant</div>
        <div class="vip-card-desc">Daftar sekarang dan nikmati semua keuntungan berikut:</div>

        <div class="vip-free-highlight">
          <span class="vip-free-label">Gratis</span>
          <span class="vip-free-duration">untuk 3 Bulan Pertama</span>
          <span class="vip-free-sub">Khusus paket Starter, tanpa kartu kredit</span>
        </div>

        <ul class="vip-benefits">
          <li>
            <svg class="check-icon" data-icon viewBox="0 0 24 24" width="18" height="18">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Harga spesial seumur hidup untuk Starter maupun Pro
          </li>
          <li>
            <svg class="check-icon" data-icon viewBox="0 0 24 24" width="18" height="18">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Bisa upgrade ke Pro kapan saja dengan harga VIP
          </li>
          <li>
            <svg class="check-icon" data-icon viewBox="0 0 24 24" width="18" height="18">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Slot sangat terbatas — hanya untuk 30 merchant pertama
          </li>
        </ul>

        <div class="vip-price-info">
          Setelah trial, harga spesial seumur hidup:<br>
          <strong>Starter Rp 99.000</strong> &amp; <strong>Pro Rp 179.000</strong> per bulan.
        </div>

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
```

Replace with:

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

- [ ] **Step 2: Verify the edit landed**

Run: `grep -n "vip-panel\b\|vip-panel-top\|vip-highlight-band\|vip-benefit-grid\|vip-panel-bottom" amora-landing-v2.html`

Expected: matches for `vip-panel` (opening div), `vip-panel-glow`, `vip-panel-top`, `vip-highlight-band`, `vip-benefit-grid`, `vip-panel-bottom`, `vip-bottom-action` — at least 7 lines.

Run: `grep -n "vip-card\b\|vip-card-accent\|vip-card-icon\|vip-card-title\|vip-card-desc\|vip-free-highlight\|vip-benefits\b" amora-landing-v2.html`

Expected: no output — confirms the old class names are fully gone, not left as dead duplicates alongside the new ones.

- [ ] **Step 3: Verify HTML stays balanced**

Run: `python3 -c "content = open('amora-landing-v2.html').read(); print('div:', content.count('<div'), content.count('</div>')); print('section:', content.count('<section'), content.count('</section>'))"`

Expected: both pairs equal (compare against pre-edit counts if unsure — the new markup has 14 `<div>` opens where the old one had 9, all properly closed, so the net div count goes up by 5 and stays balanced).

- [ ] **Step 4: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: restructure VIP Merchant section markup into a wider panel layout"
```

---

### Task 2: Replace the VIP CSS with the new panel styles

**Files:**
- Modify: `css/amora-landing-v2.css:6190-6385`

- [ ] **Step 1: Replace everything from `.vip-card` through the end of its `@media (max-width: 768px)` block**

Current content at `css/amora-landing-v2.css:6190-6385` (from `.vip-card {` through the closing `}` of the `@media (max-width: 768px)` block right before `.plan-saving`):

```css
    .vip-card {
      max-width: 640px;
      margin: 0 auto;
      background: rgba(16, 18, 30, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--r-2xl);
      padding: 48px;
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

    .vip-slot-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: fit-content;
      margin: 0 auto 20px;
      padding: 5px 14px;
      border-radius: var(--r-full);
      background: rgba(255, 174, 66, 0.12);
      border: 1px solid rgba(255, 174, 66, 0.35);
      color: #FFC97A;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .vip-slot-icon {
      font-size: 0.8125rem;
    }

    .vip-card-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .vip-card-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .vip-card-title {
      font-family: var(--font-display);
      font-size: 1.375rem;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 8px;
      text-align: center;
    }

    .vip-card-desc {
      font-size: 0.875rem;
      color: var(--text-60);
      line-height: 1.5;
      margin-bottom: 24px;
      text-align: center;
    }

    .vip-benefits {
      list-style: none;
      margin: 0 0 28px;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .vip-benefits li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.9375rem;
      color: var(--text-80);
      line-height: 1.4;
    }

    .vip-benefits .check-icon {
      flex-shrink: 0;
      margin-top: 1px;
    }

    .vip-free-highlight {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
      padding: 28px 20px;
      margin-bottom: 24px;
      border-radius: var(--r-xl);
      background: rgba(107, 142, 90, 0.16);
      border: 1.5px solid rgba(107, 142, 90, 0.45);
      box-shadow: 0 0 40px rgba(107, 142, 90, 0.2);
    }

    .vip-free-label {
      font-family: var(--font-display);
      font-size: 3rem;
      font-weight: 800;
      line-height: 1;
      color: var(--accent-light);
      letter-spacing: -0.02em;
    }

    .vip-free-duration {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text);
      margin-top: 4px;
    }

    .vip-free-sub {
      font-size: 0.8125rem;
      color: var(--text-60);
      margin-top: 8px;
    }

    .vip-price-info {
      font-size: 0.8125rem;
      color: var(--text-60);
      text-align: center;
      line-height: 1.6;
      margin-bottom: 20px;
      padding: 10px 16px;
      border-radius: var(--r-xl);
      background: var(--accent-dim);
      border: 1px solid var(--accent-border);
    }

    .vip-price-info strong {
      color: var(--accent-light);
      font-weight: 700;
    }

    .vip-validity {
      text-align: center;
      font-size: 0.8125rem;
      color: var(--text-40);
      margin-bottom: 24px;
    }

    .vip-cta {
      display: flex;
      justify-content: center;
      margin: 0 auto;
      width: fit-content;
      max-width: 100%;
      text-align: center;
      white-space: normal;
    }

    @media (max-width: 768px) {
      .vip-header {
        margin-bottom: 40px;
      }

      .vip-card {
        padding: 28px 20px;
      }

      .vip-free-highlight {
        padding: 22px 16px;
      }

      .vip-free-label {
        font-size: 2.25rem;
      }

      .vip-free-duration {
        font-size: 1.0625rem;
      }

      .vip-cta {
        width: 100%;
      }
    }
```

Replace with:

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

(`.vip-header` rules immediately above `.vip-card` at `css/amora-landing-v2.css:6163-6188` are untouched — only the `.vip-card` block onward is replaced.)

- [ ] **Step 2: Verify the edit landed**

Run: `grep -n "\.vip-panel\b\|\.vip-panel-glow\|\.vip-benefit-grid\|\.vip-benefit-card\b\|vip-glow-drift\|vip-shimmer-sweep" css/amora-landing-v2.css`

Expected: matches for all of `.vip-panel`, `.vip-panel-glow`, `.vip-benefit-grid`, `.vip-benefit-card`, `@keyframes vip-glow-drift`, `@keyframes vip-shimmer-sweep` — at least 6 lines.

Run: `grep -n "\.vip-card\b\|\.vip-card-accent\|\.vip-card-icon\|\.vip-card-title\|\.vip-card-desc\|\.vip-free-highlight\|\.vip-benefits\b\|\.vip-free-label\|\.vip-free-duration\|\.vip-free-sub" css/amora-landing-v2.css`

Expected: no output — confirms the old rules are fully removed, not left as dead CSS alongside the new ones.

- [ ] **Step 3: Verify CSS stays balanced**

Run: `python3 -c "content = open('css/amora-landing-v2.css').read(); print('open:', content.count('{'), 'close:', content.count('}'))"`

Expected: `open` and `close` counts equal.

- [ ] **Step 4: Commit**

```bash
git add css/amora-landing-v2.css
git commit -m "feat: redesign VIP Merchant section as a wider animated panel"
```

---

### Task 3: Visual verification across desktop and mobile

**Files:** none (verification only)

- [ ] **Step 1: Serve the site locally**

```bash
cd "/Users/ryantika/Documents/amora.id/Web/Landing Page 2" && python3 -m http.server 8123
```

- [ ] **Step 2: Screenshot the section at desktop width**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --window-size=1400,1400 --screenshot=/tmp/vip-panel-desktop.png \
  "http://localhost:8123/amora-landing-v2.html"
```

Open `/tmp/vip-panel-desktop.png`. Since the page loads scrolled to the top, the VIP panel (which sits below the hero) likely won't be visible in a 1400px-tall capture — if it isn't, increase `--window-size` height to 2400 and re-run, or accept that confirming the section exists/renders without errors in the DOM (next step) is sufficient if the screenshot crop misses it.

Confirm in the screenshot (if visible) or via the DOM dump in Step 4:
- The panel is a single wide card, noticeably wider than the old narrow 640px card.
- Top strip shows the badge + "Jadi VIP Merchant" on one side and the "🔥 Hanya 30 Slot" badge on the other, side by side (not stacked).
- The "Gratis untuk 3 Bulan Pertama" band is a horizontal strip.
- Three benefit cards appear in a row (not stacked).
- Bottom strip shows price info and the CTA button side by side.

- [ ] **Step 3: Screenshot the section at mobile width**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --window-size=390,2400 --screenshot=/tmp/vip-panel-mobile.png \
  "http://localhost:8123/amora-landing-v2.html"
```

Open `/tmp/vip-panel-mobile.png` and confirm:
- The top strip stacks vertically (badge+title above, slot badge below, both centered).
- The three benefit cards stack into a single column.
- The bottom strip (price info + validity + CTA) stacks vertically, full width.
- No horizontal overflow/scroll is introduced (panel respects the viewport width with its padding).

- [ ] **Step 4: Confirm the new markup exists in the rendered DOM**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --dump-dom "http://localhost:8123/amora-landing-v2.html" 2>/dev/null > /tmp/vip-redesign-dom.html
grep -c 'class="vip-panel' /tmp/vip-redesign-dom.html
grep -c 'class="vip-benefit-card' /tmp/vip-redesign-dom.html
```

Expected: first count is `1` (one `.vip-panel` root element — note this also matches `vip-panel-glow`/`vip-panel-top`/`vip-panel-bottom` since they start with the same prefix, so don't worry if the count is higher than 1; just confirm it's non-zero), second count is `3` (three benefit cards).

- [ ] **Step 5: Stop the server**

Press `Ctrl+C` in the terminal running the Python server.

---

## Spec Coverage Check

- Wider panel (~960px) replacing the narrow 640px card → Task 1 + Task 2 (`.vip-panel` max-width) ✓
- Top strip: identity + urgency badge side by side → Task 1 (`.vip-panel-top`) + Task 2 ✓
- Highlight band stays the dominant visual focus, reworked as horizontal banner → Task 1 (`.vip-highlight-band`) + Task 2 ✓
- 3 individual benefit mini-cards (not a checklist) → Task 1 (`.vip-benefit-grid`/`.vip-benefit-card`) + Task 2 ✓
- Bottom strip: price info + validity + CTA → Task 1 (`.vip-panel-bottom`/`.vip-bottom-action`) + Task 2 ✓
- Responsive collapse at 900px (benefit grid, bottom strip) and 600px (top strip, highlight text size) → Task 2 media queries ✓
- Ambient glow animation on the panel → Task 2 (`.vip-panel-glow` + `vip-glow-drift`) ✓
- Auto-looping shimmer on the highlight band → Task 2 (`.vip-highlight-band::after` + `vip-shimmer-sweep`) ✓
- `prefers-reduced-motion` respected → Task 2 media query ✓
- Copy/pricing/link/TODO carried over unchanged → Task 1 (verbatim text preserved in the replacement markup) ✓
- Visual verification at desktop and mobile widths → Task 3 ✓
