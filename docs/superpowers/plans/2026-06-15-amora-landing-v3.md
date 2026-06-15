# Amora Landing v3 — Refined Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `amora-landing-v2.html` with deeper visual layering, CSS 3D hero mockup, Geist display font, mouse parallax, and upgraded component styles — then sync the new navbar/footer to `privasi.html` and `syarat.html`.

**Architecture:** All changes are contained in three standalone HTML files (no build system, no bundler). CSS and JS remain inline within each file. The homepage is completed and visually verified first; nav/footer are then extracted and pasted into the two legal pages.

**Tech Stack:** Vanilla HTML, CSS (custom properties, CSS 3D transforms), Vanilla JS (mousemove parallax), Geist font via Google Fonts CDN, existing assets in `./asset/`

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `amora-landing-v2.html` | Modify in-place | Font import, CSS tokens, hero layout, all section upgrades, JS parallax |
| `privasi.html` | Modify in-place | Nav block, footer block, font import, `:root` token additions only |
| `syarat.html` | Modify in-place | Same as privasi.html |

No new files created. Assets are reused as-is.

---

## Task 1: Font Import & Design Token Additions

**Files:**
- Modify: `amora-landing-v2.html` — `<head>` section (lines ~7–9) and `:root` block (lines ~19–45)

- [ ] **Step 1: Replace the Google Fonts link in `<head>`**

Find this block (around line 7–9):
```html
<link rel="preconnect" href="https://fonts.googleapis.com/">
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
<link href="./asset/css2" rel="stylesheet">
```

Replace with:
```html
<link rel="preconnect" href="https://fonts.googleapis.com/">
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

> Note: `./asset/css2` was the old cached Inter font file. This replaces it with a direct Google Fonts URL that also includes Geist.

- [ ] **Step 2: Add new tokens to `:root` block**

Inside the existing `:root { ... }` block (after `--inset-top` on ~line 44), add:
```css
--font-display: 'Geist', 'Inter', system-ui, sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
--accent-vivid:  #7FB86A;
--depth-1:       rgba(255,255,255,0.03);
--depth-2:       rgba(255,255,255,0.055);
--depth-glow:    rgba(107,142,90,0.12);
```

- [ ] **Step 3: Update section padding**

Find `.py-section` and `.py-section-sm` rules (around line 368–373):
```css
.py-section  { padding: 100px 0; }
.py-section-sm { padding: 72px 0; }
@media (min-width: 1024px) {
  .py-section    { padding: 132px 0; }
  .py-section-sm { padding: 88px 0; }
}
```

Replace with:
```css
.py-section    { padding: 120px 0; }
.py-section-sm { padding: 88px 0; }
@media (min-width: 1024px) {
  .py-section    { padding: 160px 0; }
  .py-section-sm { padding: 108px 0; }
}
```

- [ ] **Step 4: Open in browser and verify**

Open `amora-landing-v2.html` directly in browser (file:// or live server).

Check: headline font should now render as Geist (geometric, modern). If it still looks like Inter, open DevTools → Network tab and confirm the Google Fonts request loaded successfully. Body text should still be Inter.

- [ ] **Step 5: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: add Geist font + v3 design tokens"
```

---

## Task 2: Hero — Switch to Centered Layout

**Files:**
- Modify: `amora-landing-v2.html` — hero CSS (lines ~378–644) and hero HTML (lines ~1267–1346)

- [ ] **Step 1: Replace hero CSS**

Find the entire `/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */` block and replace it entirely with the following:

```css
/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
#hero {
  position: relative; min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  overflow: hidden; padding: 80px 0 120px;
}
.hero-bg {
  position: absolute; inset: 0; overflow: hidden;
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}
.hero-gradient {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 15% 22%, rgba(12,40,80,0.5) 0%, transparent 42%),
    radial-gradient(ellipse at 85% 78%, rgba(107,142,90,0.1) 0%, transparent 42%),
    radial-gradient(ellipse at 50% 0%,  rgba(28,28,56,0.4) 0%, transparent 50%);
  background-size: 200% 200%;
  animation: gradient-drift 28s ease infinite;
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse at 50% 38%, black 15%, transparent 68%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 38%, black 15%, transparent 68%);
}

/* ── Centered layout ── */
.hero-content {
  position: relative; z-index: 10; width: 100%;
}
.hero-center {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  max-width: 1280px; margin: 0 auto; padding: 0 24px;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 14px; border-radius: var(--r-full);
  background: var(--accent-dim); border: 1px solid var(--accent-border);
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--accent-light); margin-bottom: 28px;
  animation: fadeInUp 0.5s ease 0.1s both;
}
.hero-eyebrow-dot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
  animation: pulse-dot 2.5s ease-in-out infinite;
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: var(--text);
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease 0.18s both;
}
.hero-title .highlight {
  background: linear-gradient(135deg, #A4D490 0%, #7FB86A 50%, #8FB87A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.175rem);
  color: var(--text-60);
  max-width: 560px;
  margin: 0 auto 40px;
  line-height: 1.72;
  animation: fadeInUp 0.6s ease 0.28s both;
}
.hero-cta {
  display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;
  animation: fadeInUp 0.6s ease 0.38s both;
  margin-bottom: 0;
}
.hero-cta .btn-primary { padding: 14px 28px; font-size: 0.9375rem; }
.hero-secondary-link {
  font-size: 0.875rem; color: var(--text-60);
  display: inline-flex; align-items: center; gap: 5px; transition: color 0.2s;
}
.hero-secondary-link:hover { color: var(--text-80); }
.hero-secondary-link svg { width: 14px; height: 14px; }

/* ── 3D Mockup Stage ── */
.hero-mockup-wrap {
  width: 100%;
  max-width: 960px;
  margin: 60px auto 0;
  animation: fadeInUp 0.9s ease 0.52s both;
}
.hero-3d-stage {
  perspective: 1200px;
  perspective-origin: 50% 40%;
}
.hero-3d-card {
  transform: rotateX(8deg) rotateY(-4deg);
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
  position: relative;
}
.hero-3d-card::before {
  content: '';
  position: absolute;
  top: 0; left: 5%; width: 90%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  border-radius: 50%;
  z-index: 3;
  pointer-events: none;
}
.hero-3d-card img {
  width: 100%;
  border-radius: var(--r-2xl);
  display: block;
  filter:
    drop-shadow(0 0 48px rgba(107,142,90,0.42))
    drop-shadow(0 0 120px rgba(107,142,90,0.20))
    drop-shadow(0 60px 120px rgba(0,0,0,0.90))
    drop-shadow(0 20px 40px rgba(0,0,0,0.75));
}
/* Ambient glow layers behind mockup */
.hero-mockup-glow {
  position: absolute; z-index: -1;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 110%; height: 110%;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 90%, rgba(107,142,90,0.40) 0%, transparent 42%),
    radial-gradient(ellipse at 50% 55%, rgba(107,142,90,0.16) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(107,142,90,0.07) 0%, transparent 65%);
  filter: blur(72px);
}
.hero-mockup-rays {
  position: absolute; z-index: -1;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 138%; height: 138%;
  pointer-events: none;
  background-image:
    linear-gradient(0deg, transparent 45%, rgba(107,142,90,0.04) 47.5%, rgba(107,142,90,0.26) 49.5%, rgba(107,142,90,0.42) 50%, rgba(107,142,90,0.26) 50.5%, rgba(107,142,90,0.04) 52.5%, transparent 55%),
    linear-gradient(90deg, transparent 45%, rgba(107,142,90,0.04) 47.5%, rgba(107,142,90,0.26) 49.5%, rgba(107,142,90,0.42) 50%, rgba(107,142,90,0.26) 50.5%, rgba(107,142,90,0.04) 52.5%, transparent 55%),
    linear-gradient(rgba(107,142,90,0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(107,142,90,0.28) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 68px 68px, 68px 68px;
  mask: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 32%, transparent 72%);
  -webkit-mask: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 32%, transparent 72%);
}
.hero-mockup-ground {
  position: absolute; z-index: -1;
  bottom: -24px; left: 50%; transform: translateX(-50%);
  width: 70%; height: 48px;
  background: radial-gradient(ellipse, rgba(107,142,90,0.42) 0%, transparent 68%);
  filter: blur(28px); border-radius: 50%;
  pointer-events: none;
}

/* ── Stats row ── */
.hero-stats-wrap {
  width: 100%;
  animation: fadeInUp 0.6s ease 0.58s both;
  margin-top: 40px;
}
.hero-stats {
  display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;
}
.hero-stat {
  display: flex; flex-direction: column; align-items: center;
  padding: 12px 24px;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--r-lg);
}
.hero-stat-value { font-size: 1.375rem; font-weight: 700; color: var(--text); letter-spacing: -0.02em; line-height: 1.2; }
.hero-stat-label { font-size: 0.75rem; color: var(--text-40); font-weight: 500; margin-top: 3px; }
.hero-stat-note  { font-size: 0.6875rem; color: var(--text-30); margin-top: 10px; text-align: center; }

.scroll-indicator {
  position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
  color: var(--text-30); animation: bounce-subtle 2.2s ease-in-out infinite; transition: color 0.2s;
}
.scroll-indicator:hover { color: var(--text-60); }

@media (max-width: 768px) {
  .hero-mockup-wrap { margin-top: 44px; }
  .hero-3d-card { transform: rotateX(6deg) rotateY(-2deg); }
  .hero-stat { padding: 8px 16px; }
  .hero-stat-value { font-size: 1.125rem; }
}
```

- [ ] **Step 2: Replace hero HTML**

Find the `<!-- ══════════════ HERO ══════════════ -->` section in the HTML body (around line 1267–1346) and replace the entire `<section id="hero">` block with:

```html
<!-- ══════════════ HERO ══════════════ -->
<section id="hero">
  <div class="hero-bg">
    <div class="hero-gradient"></div>
    <div class="hero-grid"></div>
  </div>
  <div class="hero-content">
    <div class="hero-center">

      <p class="hero-eyebrow">
        <span class="hero-eyebrow-dot"></span>
        Solusi Website Toko Online
      </p>

      <h1 class="hero-title">
        Semua Bisa Punya<br>
        <span class="highlight">Toko Online</span>
      </h1>

      <p class="hero-subtitle">
        Buat toko online Anda sendiri untuk margin jualan yang lebih sehat.
        Tanpa komisi besar, tanpa ribet.
      </p>

      <div class="hero-cta">
        <a href="https://admin.amora.id/" class="btn-primary">
          Buka Toko Sekarang
          <svg data-icon viewBox="0 0 24 24" width="15" height="15"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a href="#fitur" class="hero-secondary-link">
          Lihat fitur lengkap
          <svg data-icon viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </a>
      </div>

      <!-- 3D mockup -->
      <div class="hero-mockup-wrap">
        <div class="hero-3d-stage">
          <div class="hero-mockup-glow"></div>
          <div class="hero-mockup-rays" aria-hidden="true"></div>
          <div class="hero-mockup-ground"></div>
          <div class="hero-3d-card" id="hero3dCard">
            <img src="./asset/hero-mockup.png" alt="Dashboard Amora">
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="hero-stats-wrap">
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-value">5 menit</span>
            <span class="hero-stat-label">Waktu setup toko</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-value">0%</span>
            <span class="hero-stat-label">Komisi*</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-value">100%</span>
            <span class="hero-stat-label">Kepemilikan data toko</span>
          </div>
        </div>
        <p class="hero-stat-note">*sesuai dengan kuota transaksi paket</p>
      </div>

    </div>
  </div>
  <a href="#fitur" class="scroll-indicator" aria-label="Scroll">
    <svg data-icon viewBox="0 0 24 24" width="24" height="24"><polyline points="6 9 12 15 18 9"/></svg>
  </a>
</section>
```

- [ ] **Step 3: Remove old hero CSS variables that are now unused**

Delete these now-unused classes from the CSS (they were part of the split layout — search and remove):
- `.hero-split`
- `.hero-text`
- `.hero-mockup` (the old float-based one)
- `.hero-text-col`
- `.hero-stats-wrap` (old one — already replaced above)
- `.hero-mockup-frame`
- `.hero-mockup-shadow`
- All `@media (min-width: 1024px)` rules inside the old hero block that reference `.hero-split`, `.hero-text-col`, `.hero-mockup`
- All `@media (max-width: 1023px)` rules referencing the same

> Tip: search for `.hero-split` in the CSS to find the block. Delete everything from `.hero-split {` through the end of the last hero-specific media query.

- [ ] **Step 4: Verify hero in browser**

Open `amora-landing-v2.html`. Check:
- Headline is large, centered, Geist font
- CTA buttons are centered below subtitle
- Dashboard mockup appears below CTA with visible 3D tilt (tilted back slightly)
- Stats row appears below mockup
- At mobile width 390px: layout is single column, mockup fills width with padding, tilt is subtle
- No layout breakage in between

- [ ] **Step 5: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: centered hero layout with CSS 3D mockup"
```

---

## Task 3: Mouse Parallax on Hero Mockup

**Files:**
- Modify: `amora-landing-v2.html` — `<script>` block at bottom (around line 1668+)

- [ ] **Step 1: Add parallax JS to the script block**

Find the `<script>` tag at the bottom of the file. After the existing `// Navbar scroll` listener (first few lines of the script), add the following block:

```js
// ── Hero 3D mouse parallax (desktop pointer only) ──
(function() {
  const card = document.getElementById('hero3dCard');
  if (!card) return;
  if (!window.matchMedia('(hover: fine) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const BASE_X = 8;   // default rotateX deg
  const BASE_Y = -4;  // default rotateY deg
  const MAX_DELTA = 4; // max ±deg shift from mouse

  let rafId = null;
  let targetRx = BASE_X;
  let targetRy = BASE_Y;
  let currentRx = BASE_X;
  let currentRy = BASE_Y;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy; // -1 to 1
    targetRx = BASE_X + dy * -MAX_DELTA;
    targetRy = BASE_Y + dx *  MAX_DELTA;
    if (!rafId) rafId = requestAnimationFrame(lerp);
  }, { passive: true });

  function lerp() {
    currentRx += (targetRx - currentRx) * 0.08;
    currentRy += (targetRy - currentRy) * 0.08;
    card.style.transform = `rotateX(${currentRx.toFixed(3)}deg) rotateY(${currentRy.toFixed(3)}deg)`;
    const delta = Math.abs(targetRx - currentRx) + Math.abs(targetRy - currentRy);
    rafId = delta > 0.01 ? requestAnimationFrame(lerp) : null;
  }
})();
```

- [ ] **Step 2: Verify parallax in browser**

Open the file, move mouse slowly across the hero. The dashboard mockup should subtly tilt toward/away from the cursor direction. Movement should feel smooth with gentle lag (lerp). Verify it does NOT fire on a touch device (or at narrow viewport).

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: mouse parallax on hero 3D mockup"
```

---

## Task 4: Feature Sections — 3D Tilt & Typography Upgrades

**Files:**
- Modify: `amora-landing-v2.html` — feature section CSS (lines ~646–688) and feature bullet HTML (lines ~1349–1398)

- [ ] **Step 1: Add 3D tilt and typography upgrades to feature section CSS**

Find the `/* ═══════════════════════════════════════ FEATURE SECTIONS ═══════════════════════════════════════ */` block and add the following rules at the end of that block (before the next `/* ═══` comment):

```css
/* ── Feature headings ── */
.feature-text h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

/* ── Feature image 3D tilt ── */
.feature-image-frame {
  transform: perspective(800px) rotateX(3deg) rotateY(6deg);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.feature-grid.setup-grid .feature-image-frame {
  transform: perspective(800px) rotateX(3deg) rotateY(-6deg);
}
.feature-image:hover .feature-image-frame {
  transform: perspective(800px) rotateX(0deg) rotateY(0deg);
}
@media (max-width: 1023px) {
  .feature-image-frame {
    transform: perspective(800px) rotateX(2deg) rotateY(3deg);
  }
  .feature-grid.setup-grid .feature-image-frame {
    transform: perspective(800px) rotateX(2deg) rotateY(-3deg);
  }
}

/* ── Feature bullet upgrade: square instead of circle ── */
.feature-bullet-icon {
  flex-shrink: 0; margin-top: 3px;
  width: 20px; height: 20px;
  border-radius: var(--r-sm);
  background: linear-gradient(135deg, rgba(107,142,90,0.3), rgba(107,142,90,0.12));
  border: 1px solid var(--accent-border);
  display: flex; align-items: center; justify-content: center;
}
.feature-bullet-icon svg { width: 11px; height: 11px; color: var(--accent-light); }
```

- [ ] **Step 2: Verify in browser**

Scroll to the "Amankan margin" and "Buat toko online" sections. Feature images should have a visible 3D tilt. Hover over an image — it should smoothly flatten to 0deg. Headings should render in Geist.

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: feature section 3D tilt, Geist headings, square bullets"
```

---

## Task 5: Features Grid Card Upgrades

**Files:**
- Modify: `amora-landing-v2.html` — features grid CSS (lines ~692–752)

- [ ] **Step 1: Update feature card CSS**

Find the `.feature-card` rule block and replace the entire block (from `.feature-card {` through `.feature-card:hover .feature-card-img img {`) with:

```css
.feature-card {
  background: var(--depth-2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-top: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--r-xl); padding: 24px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.07),
    inset 0 -1px 0 rgba(0,0,0,0.2),
    0 8px 32px rgba(0,0,0,0.45);
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
              border-color 0.3s cubic-bezier(0.22,1,0.36,1),
              box-shadow 0.3s cubic-bezier(0.22,1,0.36,1);
  position: relative; overflow: hidden;
}
.feature-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 50%);
  pointer-events: none;
}
.feature-card:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(107,142,90,0.2);
  border-top-color: rgba(107,142,90,0.5);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    inset 0 -1px 0 rgba(0,0,0,0.2),
    0 20px 56px rgba(0,0,0,0.6),
    0 0 40px rgba(107,142,90,0.1);
}
.feature-card-icon {
  width: 44px; height: 44px; border-radius: var(--r-md);
  background: linear-gradient(135deg, rgba(107,142,90,0.22) 0%, rgba(107,142,90,0.08) 100%);
  border: 1px solid var(--accent-border);
  display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
}
.feature-card-icon svg { width: 18px; height: 18px; color: var(--accent-light); }
.feature-card h3 {
  font-family: var(--font-display);
  font-size: 1.0625rem; font-weight: 600; color: var(--text); margin-bottom: 7px;
  letter-spacing: -0.01em;
}
.feature-card p { font-size: 0.875rem; color: var(--text-60); line-height: 1.65; margin-bottom: 16px; }
.feature-card-img { overflow: hidden; border-radius: var(--r-md); border: none; background: transparent; }
.feature-card-img img {
  width: 100%; height: 240px; object-fit: cover; object-position: center;
  opacity: 0.85; display: block;
  transition: opacity 0.5s, transform 0.5s;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
}
.feature-card:hover .feature-card-img img { opacity: 1; transform: scale(1.03); }
```

- [ ] **Step 2: Verify in browser**

Scroll to "Sistem toko online" features grid. Cards should have a glass-like surface. Hover a card: it lifts up with scale, top border glows green. Card titles in Geist. Images taller (240px).

- [ ] **Step 3: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: feature card depth upgrade with hover glow"
```

---

## Task 6: Pricing Section Upgrades

**Files:**
- Modify: `amora-landing-v2.html` — pricing CSS (lines ~754–1050)

- [ ] **Step 1: Upgrade Pro card CSS**

Find `.plan-card-pro {` and replace the rule with:

```css
.plan-card-pro {
  background: radial-gradient(ellipse at 60% -20%, rgba(107,142,90,0.30) 0%, rgba(10,20,14,0.95) 60%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(107,142,90,0.6);
  border-radius: var(--r-2xl); padding: 32px;
  box-shadow:
    0 0 0 1px rgba(107,142,90,0.1),
    0 28px 72px rgba(0,0,0,0.65),
    0 0 100px rgba(107,142,90,0.2);
  position: relative; overflow: hidden; height: 100%;
  transition: box-shadow 0.3s;
}
```

- [ ] **Step 2: Add auto-shimmer animation to Pro card**

Find the existing `@keyframes spotlight-sweep` rule and add a new keyframe immediately after it:

```css
@keyframes shimmer-auto {
  0%   { left: -60%; opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { left: 130%; opacity: 0; }
}
```

Then find `.plan-card-wrapper:hover .plan-card-pro::after {` (the hover shimmer rule) and change it so the Pro card's shimmer also runs automatically. Replace the existing `::after` rules for plan cards with:

```css
/* Shimmer on Starter — hover only */
.plan-card-starter::after {
  content: '';
  position: absolute; top: -60%; left: -60%;
  width: 80px; height: 220%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
  transform: rotate(-45deg); pointer-events: none;
}
.plan-card-wrapper:hover .plan-card-starter::after {
  animation: spotlight-sweep 1.2s cubic-bezier(0.22,1,0.36,1) forwards;
}

/* Shimmer on Pro — runs automatically every 4s */
.plan-card-pro::after {
  content: '';
  position: absolute; top: -60%; left: -60%;
  width: 80px; height: 220%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  transform: rotate(-45deg); pointer-events: none;
  animation: shimmer-auto 5s ease-in-out 1.5s infinite;
}
```

- [ ] **Step 3: Add Geist font to plan tier labels**

Find `.plan-tier {` and add `font-family: var(--font-display);`:

```css
.plan-tier {
  font-family: var(--font-display);
  font-size: 0.6875rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-40); margin-bottom: 16px;
}
```

Find `.plan-price {` and add `font-family: var(--font-display);`:

```css
.plan-price {
  font-family: var(--font-display);
  font-size: 2.5rem; font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px;
}
```

Find `.pricing-header h2 {` and add font:

```css
.pricing-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 4vw, 2.625rem); font-weight: 800;
  line-height: 1.12; letter-spacing: -0.03em; color: var(--text); margin-bottom: 14px;
}
```

- [ ] **Step 4: Verify in browser**

Scroll to pricing. Pro card border should be more vivid green. Watch the card — after ~1.5s the shimmer sweep should animate automatically across the Pro card, repeating every 5s. Plan names and prices in Geist.

- [ ] **Step 5: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: pricing Pro card glow, auto-shimmer, Geist font"
```

---

## Task 7: CTA Banner, FAQ & Section Headings

**Files:**
- Modify: `amora-landing-v2.html` — CTA CSS (lines ~1050–1103), FAQ CSS (~1105–1151), HTML for CTA section (~1586–1601)

- [ ] **Step 1: Upgrade CTA card CSS**

Find `.cta-card h2 {` and replace with:

```css
.cta-card h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--text); margin-bottom: 14px;
  position: relative; z-index: 1;
}
```

Find `.cta-card {` and update the background:

```css
.cta-card {
  text-align: center; padding: 88px 56px;
  border-radius: var(--r-3xl);
  background:
    radial-gradient(ellipse at 50% -10%, rgba(107,142,90,0.18) 0%, transparent 55%),
    rgba(13, 13, 24, 0.78);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(107,142,90,0.22);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.07),
    inset 0 -1px 0 rgba(0,0,0,0.25),
    0 2px 0 rgba(107,142,90,0.18),
    0 24px 72px rgba(0,0,0,0.6),
    0 0 100px rgba(107,142,90,0.08);
  position: relative; overflow: hidden;
}
```

Add trust note CSS (add after `.cta-note {`):

```css
.cta-trust {
  font-size: 0.8125rem;
  color: var(--text-40);
  margin-top: 20px;
  position: relative; z-index: 1;
}
```

- [ ] **Step 2: Add trust badge to CTA HTML**

Find the CTA section HTML (around `<!-- ══════════════ CTA BANNER ══════════════ -->`). Inside `.cta-banner-actions`, after the closing `</div>`, add:

```html
<p class="cta-trust">Tanpa kartu kredit &nbsp;·&nbsp; Setup dalam 5 menit &nbsp;·&nbsp; Batalkan kapan saja</p>
```

So the full CTA card content becomes:
```html
<div class="cta-card reveal">
  <h2>Siap punya toko<br>online sendiri?</h2>
  <p>Buat toko online Anda sendiri dalam 5 menit. Tanpa coding. Tanpa developer.</p>
  <div class="cta-banner-actions">
    <a href="https://admin.amora.id/" class="btn-primary">
      Buka Toko Sekarang
      <svg data-icon viewBox="0 0 24 24" width="15" height="15"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
    <a href="#harga" class="btn-ghost">Lihat Harga</a>
  </div>
  <p class="cta-trust">Tanpa kartu kredit &nbsp;·&nbsp; Setup dalam 5 menit &nbsp;·&nbsp; Batalkan kapan saja</p>
</div>
```

- [ ] **Step 3: Add Geist to FAQ and section headers**

Find `.faq-header h2 {` and add font:

```css
.faq-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 4vw, 2.5rem); font-weight: 800;
  line-height: 1.15; letter-spacing: -0.03em; color: var(--text); margin-bottom: 12px;
}
```

Find `.features-header h2 {` and add font:

```css
.features-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 4vw, 2.625rem); font-weight: 800;
  line-height: 1.15; letter-spacing: -0.025em;
  color: var(--text); max-width: 600px; margin: 0 auto;
}
```

- [ ] **Step 4: Verify in browser**

Scroll to CTA banner: heading is large Geist, trust badge visible below buttons. Scroll to FAQ: heading in Geist. Scroll to features grid: "Sistem toko online" heading in Geist.

- [ ] **Step 5: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: CTA banner upgrade, trust badge, Geist across all headings"
```

---

## Task 8: Navbar & Footer Polish

**Files:**
- Modify: `amora-landing-v2.html` — navbar CSS (~208–362) and footer CSS (~1153–1199)

- [ ] **Step 1: Strengthen navbar backdrop**

Find `nav.scrolled .nav-inner {` and update the backdrop-filter and border:

```css
nav.scrolled .nav-inner {
  border-radius: 9999px;
  background: rgba(13,13,24,0.76);
  backdrop-filter: blur(36px) saturate(2) brightness(1.08);
  -webkit-backdrop-filter: blur(36px) saturate(2) brightness(1.08);
  border: 1px solid rgba(255,255,255,0.16);
  box-shadow:
    0 8px 40px rgba(0,0,0,0.55),
    0 2px 12px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.14);
  padding: 0 20px;
}
```

- [ ] **Step 2: Upgrade footer top border and column headings**

Find `footer::before {` and update the gradient:

```css
footer::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(to right, transparent, rgba(107,142,90,0.5), transparent);
}
```

Find `.footer-col h4 {` and add font:

```css
.footer-col h4 {
  font-family: var(--font-display);
  font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-40); margin-bottom: 18px;
}
```

Find `.footer-social a:hover {` and upgrade:

```css
.footer-social a:hover {
  color: var(--accent-light);
  border-color: var(--accent-border);
  background: var(--accent-dim);
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(107,142,90,0.2);
}
```

Add `transition` to `.footer-social a`:

```css
.footer-social a {
  color: var(--text-40); width: 36px; height: 36px; border-radius: var(--r-md);
  border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
  transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
}
```

- [ ] **Step 3: Verify in browser**

Scroll down until navbar pills — it should have a stronger frosted glass effect. Scroll to footer — column headings in Geist. Hover social icons — they should scale up with a green glow.

- [ ] **Step 4: Full page visual check at all breakpoints**

Resize browser to these widths and confirm no layout breakage:
- `375px` (iPhone SE)
- `390px` (iPhone 14)
- `768px` (tablet)
- `1280px` (desktop)
- `1440px` (wide desktop)

- [ ] **Step 5: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: navbar glass upgrade, footer polish, social icon hover"
```

---

## Task 9: Add Center Bloom Background Orb

**Files:**
- Modify: `amora-landing-v2.html` — `#page-bg` HTML (~line 1207) and `.pg-orb` CSS (~lines 63–112)

- [ ] **Step 1: Add CSS for center bloom orb**

Find the `.pg-orb-6 {` rule block and add after it:

```css
/* Center bloom — stronger ambient behind hero mockup */
.pg-orb-center {
  position: absolute;
  top: 28%; left: 50%; transform: translateX(-50%);
  width: 80vw; height: 60vw;
  background: radial-gradient(ellipse, rgba(107,142,90,0.09) 0%, transparent 60%);
  filter: blur(80px);
  border-radius: 50%;
  pointer-events: none;
}
```

- [ ] **Step 2: Add the orb element to HTML**

Find the `<div id="page-bg" aria-hidden="true">` block and add the new orb div:

```html
<div id="page-bg" aria-hidden="true">
  <div class="pg-orb pg-orb-1"></div>
  <div class="pg-orb pg-orb-2"></div>
  <div class="pg-orb pg-orb-3"></div>
  <div class="pg-orb pg-orb-4"></div>
  <div class="pg-orb pg-orb-5"></div>
  <div class="pg-orb pg-orb-6"></div>
  <div class="pg-orb pg-orb-center"></div>
</div>
```

- [ ] **Step 3: Verify in browser**

Hero area should have a subtle green bloom emanating from behind the mockup area. Should feel like ambient light from the dashboard, not a harsh spotlight. If too strong, reduce the `rgba` alpha from `0.09` to `0.06`.

- [ ] **Step 4: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: add center ambient bloom orb behind hero"
```

---

## Task 10: Mobile & Reduced Motion Final Check

**Files:**
- Modify: `amora-landing-v2.html` — add reduced motion rules to CSS

- [ ] **Step 1: Add `prefers-reduced-motion` block**

At the very end of the `<style>` block (before `</style>`), add:

```css
/* ═══════════════════════════════════════
   REDUCED MOTION
═══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .hero-3d-card {
    transform: none !important;
  }
  .feature-image-frame {
    transform: none !important;
  }
}
```

- [ ] **Step 2: Test at 390px (iPhone 14 viewport)**

Open DevTools → Toggle device toolbar → iPhone 14 Pro (393×852). Scroll through the full page:
- Hero: mockup fills width, tilt visible but subtle, stats row stacks cleanly
- Feature sections: images stacked above or below text, 3D tilt reduced
- Pricing cards: both stack in single column below `640px`
- CTA trust badge wraps gracefully on narrow widths
- FAQ items expand/collapse correctly
- Footer: stacks to 2-col at tablet, 1-col at mobile
- No horizontal scroll at any point

- [ ] **Step 3: Test at 768px (tablet)**

Features grid should show 2 columns. Pricing should show 2 columns.

- [ ] **Step 4: Commit**

```bash
git add amora-landing-v2.html
git commit -m "feat: reduced-motion support, mobile verified"
```

---

## Task 11: Apply Nav & Footer to privasi.html and syarat.html

**Files:**
- Modify: `privasi.html`
- Modify: `syarat.html`

Do this task **twice** — once per file. Steps below are for `privasi.html`; repeat identically for `syarat.html`.

- [ ] **Step 1: Update font import in `privasi.html`**

Open `privasi.html`. Find the existing `<link>` to Google Fonts (or `./asset/css2`) and replace with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com/">
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add font display tokens to `:root` in `privasi.html`**

Find the `:root { ... }` block. Add after the last existing token:

```css
--font-display: 'Geist', 'Inter', system-ui, sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
--accent-vivid:  #7FB86A;
--depth-1:       rgba(255,255,255,0.03);
--depth-2:       rgba(255,255,255,0.055);
--depth-glow:    rgba(107,142,90,0.12);
```

- [ ] **Step 3: Replace the `<nav>` block in `privasi.html`**

Copy the entire `<nav id="navbar">...</nav>` block from the finished `amora-landing-v2.html` (including all its children: `.nav-inner`, `.nav-logo`, `.nav-links`, `.nav-ctas`, `.hamburger`).

Paste it into `privasi.html`, replacing the existing nav block.

Also copy the `<div class="mobile-menu" id="mobileMenu">...</div>` block that follows the nav.

- [ ] **Step 4: Copy nav CSS and JS to `privasi.html`**

From `amora-landing-v2.html`, copy all CSS rules that begin with `nav`, `.nav-`, `.mobile-menu`, `.menu-body`, `.mobile-nav-links`, `.mobile-link`, `.mobile-ctas`, `.menu-footer`, `.mobile-legal`, `.hamburger`, `.logo-anim` and any `@keyframes` used by the nav (strokeGlow). Paste them into `privasi.html`'s `<style>` block, replacing the existing nav CSS.

Copy the navbar JS section from `amora-landing-v2.html`'s `<script>` block (the `// Navbar scroll` and `// Mobile side drawer` sections) into `privasi.html`'s `<script>` block.

- [ ] **Step 5: Replace the `<footer>` block in `privasi.html`**

Copy the entire `<footer>...</footer>` block from `amora-landing-v2.html` and paste into `privasi.html`, replacing the existing footer.

Copy the footer CSS rules from `amora-landing-v2.html` (the `/* ═══ FOOTER ═══ */` block) into `privasi.html`'s `<style>`, replacing the existing footer CSS.

- [ ] **Step 6: Update h1 in `privasi.html` to use display font**

Find any `h1` or `h2` in `privasi.html` content and add:

```css
/* in privasi.html <style> */
.content-section h1, .content-section h2 {
  font-family: var(--font-display);
  letter-spacing: -0.025em;
}
```

(Adjust the selector to match the actual class used in privasi.html for the content wrapper.)

- [ ] **Step 7: Verify privasi.html in browser**

Open `privasi.html`. Navbar should match amora-landing-v2.html exactly: same logo, same links, same pill behavior on scroll, same mobile drawer. Footer should match exactly. Legal content unchanged.

- [ ] **Step 8: Repeat Steps 1–7 for `syarat.html`**

- [ ] **Step 9: Commit**

```bash
git add privasi.html syarat.html
git commit -m "feat: apply v3 nav and footer to legal pages"
```

---

## Task 12: Final Review & Tag

- [ ] **Step 1: Open all three pages and do a full scroll-through**

- `amora-landing-v2.html` — full scroll, check every section
- `privasi.html` — nav + content + footer
- `syarat.html` — nav + content + footer

Check list:
- [ ] Geist font renders on all headings (h1, h2, h3, plan names, footer col headings)
- [ ] Hero: centered, large headline, 3D mockup visible with tilt, stats row below
- [ ] Mouse parallax works when moving mouse over hero (desktop)
- [ ] Feature images have subtle 3D tilt, hover flattens them
- [ ] Feature cards: hover lifts + top green border glow
- [ ] Pro pricing card: shimmer auto-animates, border vivid green
- [ ] CTA section: large headline, trust badge visible
- [ ] Navbar pill appears on scroll with strong glass effect
- [ ] Footer social icons scale on hover
- [ ] No horizontal scroll at any viewport width
- [ ] Mobile (390px): all sections stack cleanly, no text overflow

- [ ] **Step 2: Commit final tag**

```bash
git add -A
git commit -m "feat: Amora landing v3 complete — refined upgrade" --allow-empty
git tag v3.0-landing
```
