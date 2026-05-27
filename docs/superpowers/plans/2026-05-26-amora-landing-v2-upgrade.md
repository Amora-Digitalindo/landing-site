# Amora Landing Page v2 Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply five upgrades to `amora-landing-v2.html` — extract legal pages, remove section dividers, add glass card treatment, add animations, and redesign pricing to Option C glow card.

**Architecture:** All changes are in a single-file static HTML/CSS/JS project. Legal content is extracted from inline JS arrays into two new standalone HTML pages. All CSS is in the `<style>` block; all JS is in the `<script>` block at end of body.

**Tech Stack:** Vanilla HTML5, CSS3 (backdrop-filter, custom properties, keyframes), vanilla JS (IntersectionObserver, requestAnimationFrame). No build system.

---

## File Map

| File | Action |
|------|--------|
| `amora-landing-v2.html` | Edit in place — 7 targeted changes (see tasks below) |
| `syarat.html` | Create — standalone S&K legal page |
| `privasi.html` | Create — standalone Kebijakan Privasi page |

---

## Task 1 — Remove section dividers

**Files:**
- Modify: `amora-landing-v2.html` (HTML lines 901, 1142, 1155; CSS lines 188–191)

- [ ] **Step 1: Remove `.section-divider` CSS rule**

In the `<style>` block, find and delete these 4 lines:
```css
.section-divider {
  width: 100%; height: 1px;
  background: linear-gradient(to right, transparent, var(--border), transparent);
}
```

- [ ] **Step 2: Remove all three `<div class="section-divider"></div>` elements**

Delete line 901 (between `</section>` hero close and `<!-- FEATURE: MARGIN -->`):
```html
<div class="section-divider"></div>
```

Delete lines 1142 and 1155 inside `#cta-banner`:
```html
<div class="section-divider"></div>   ← before .cta-banner-inner
```
and
```html
<div class="section-divider"></div>   ← after .cta-banner-inner
```

- [ ] **Step 3: Open in browser and verify no horizontal rules appear between sections**

Open `http://localhost:3456/amora-landing-v2.html` and scroll through. No visible divider lines should appear.

- [ ] **Step 4: Commit**
```bash
git add "amora-landing-v2.html"
git commit -m "feat: remove section dividers — ambient orbs handle visual flow"
```

---

## Task 2 — Glass card treatment (CSS)

**Files:**
- Modify: `amora-landing-v2.html` (CSS only — feature cards, hero stats, FAQ, pricing table)

- [ ] **Step 1: Update `.feature-card` CSS**

Replace the existing `.feature-card` rule block (lines ~436–465) with:
```css
.feature-card {
  background: rgba(13, 13, 24, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-xl); padding: 24px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.45);
  transition: transform 0.28s cubic-bezier(0.22,1,0.36,1),
              border-color 0.28s cubic-bezier(0.22,1,0.36,1),
              box-shadow 0.28s cubic-bezier(0.22,1,0.36,1);
  position: relative; overflow: hidden;
}
.feature-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 50%);
  pointer-events: none;
}
.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(107, 142, 90, 0.2);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(107, 142, 90, 0.12),
    0 16px 48px rgba(0, 0, 0, 0.55),
    0 0 32px rgba(107, 142, 90, 0.08);
}
```

- [ ] **Step 2: Update `.hero-stat` CSS**

Replace the existing `.hero-stat` rule (line ~346):
```css
.hero-stat {
  display: flex; flex-direction: column; align-items: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-lg);
}
.hero-stat + .hero-stat { margin-left: 8px; }
```

Also remove the rule `.hero-stat + .hero-stat { border-left: 1px solid var(--border); }` since the pill layout replaces it.

- [ ] **Step 3: Update FAQ list container to individual glass items**

Replace the `.faq-list` rule:
```css
.faq-list {
  display: flex; flex-direction: column; gap: 8px;
}
.faq-item {
  background: rgba(13, 13, 24, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-xl);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  transition: border-color 0.2s;
}
.faq-item:last-child { border-bottom: none; }
.faq-item.active {
  background: rgba(107, 142, 90, 0.06);
  border-color: rgba(107, 142, 90, 0.2);
}
```

Remove the old `.faq-item { border-bottom: 1px solid var(--border); }` rule.

- [ ] **Step 4: Update pricing table container**

Replace the `.pricing-table` rule:
```css
.pricing-table {
  background: rgba(13, 13, 24, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--r-2xl); overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 8px 32px rgba(0, 0, 0, 0.45);
}
```

Add alternating row styles and Pro column tint:
```css
.pricing-table tbody tr:not(.cat-row):nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}
.pricing-table tbody tr:not(.cat-row):nth-child(odd) {
  background: transparent;
}
.pricing-table td.pro-col {
  background: rgba(107, 142, 90, 0.05);
}
```

- [ ] **Step 5: Verify in browser**

All cards should have frosted-glass depth. FAQ items should be individual pill-cards not a grouped list. Hero stats should be glass pills arranged in a row.

- [ ] **Step 6: Commit**
```bash
git add "amora-landing-v2.html"
git commit -m "feat: apply neumorphic glass card treatment to feature cards, FAQ, hero stats, pricing table"
```

---

## Task 3 — Animations (count-up + hover micro-interactions + stagger)

**Files:**
- Modify: `amora-landing-v2.html` (CSS `@keyframes` + `transition` rules; JS `<script>` block)

- [ ] **Step 1: Add nav link underline slide animation (CSS)**

The nav link hover is already partially implemented. Replace the existing `.nav-links a::after` block:
```css
.nav-links a::after {
  content: ''; position: absolute; bottom: -4px; left: 0;
  height: 1px; width: 0;
  background: var(--accent-light);
  transition: width 0.2s ease;
}
.nav-links a:hover::after { width: 100%; }
```

Remove the old `transform: scaleX(0)` / `transform-origin` approach.

- [ ] **Step 2: Improve `.btn-primary` hover (CSS)**

Update `.btn-primary:hover` — add deeper shadow on hover:
```css
.btn-primary:hover {
  background: var(--accent-light);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px rgba(107, 142, 90, 0.3);
}
```

- [ ] **Step 3: Add Pro plan card glow on hover (CSS) — add to pricing CSS section**

```css
.plan-card-pro:hover {
  box-shadow:
    0 0 0 1px rgba(107, 142, 90, 0.08),
    0 24px 64px rgba(0, 0, 0, 0.6),
    0 0 100px rgba(107, 142, 90, 0.2);
}
```

- [ ] **Step 4: Verify stagger delay classes are on feature cards in HTML**

Check that each `.feature-card` in `.features-top` has `delay-1`, `delay-2`, `delay-3` and each in `.features-bottom` has `delay-1`, `delay-2`. The delay classes are already in the CSS (lines 167–171). Confirm in HTML (lines 963–994) — they should already be present. If `delay-1` through `delay-2` are missing on the bottom grid cards, add them.

- [ ] **Step 5: Add stagger to pricing plan cards in HTML**

Confirm `reveal delay-1` is on the Starter wrapper and `reveal delay-2` on Pro wrapper (lines 1012, 1023). Already present — no change needed.

Add `reveal delay-3` to the comparison table div (line 1036): change `class="pricing-table reveal delay-2"` → `class="pricing-table reveal delay-3"`.

- [ ] **Step 6: Add count-up JS**

Insert this function inside the `<script>` block, BEFORE the `renderFaqs()` call:

```javascript
// ── Count-up stats ──
(function() {
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCount(el, target, suffix, separator, duration) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      let display = value.toString();
      if (separator) {
        display = value.toLocaleString('id-ID').replace(/,/g, '.');
      }
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statObserver.unobserve(entry.target);

      const statValues = document.querySelectorAll('.hero-stat-value');
      // statValues[0] = "10.000+", statValues[1] = "5 menit", statValues[2] = "0%"
      if (statValues[0]) animateCount(statValues[0], 10000, '+', true, 1800);
      if (statValues[1]) animateCount(statValues[1], 5, ' menit', false, 1800);
      if (statValues[2]) {
        // Already 0 — just fade in via CSS reveal, no animation needed
        statValues[2].textContent = '0%';
      }
    });
  }, { threshold: 0.5 });

  statObserver.observe(statsSection);
})();
```

- [ ] **Step 7: Verify count-up in browser**

Load page, scroll down past hero, then scroll back up and reload. On first scroll into hero stats area, the numbers should count up: 0 → 10.000+, 0 → 5 menit.

- [ ] **Step 8: Commit**
```bash
git add "amora-landing-v2.html"
git commit -m "feat: add count-up stats, nav underline animation, hover micro-interactions, stagger delays"
```

---

## Task 4 — Pricing redesign (Option C glow card)

**Files:**
- Modify: `amora-landing-v2.html` (CSS pricing section + HTML plan card markup)

- [ ] **Step 1: Rewrite Starter card CSS**

Replace `.plan-card-wrapper` and `.plan-card` rules with:
```css
/* Plan card wrappers become direct cards — no gradient-border wrapper */
.plan-card-wrapper {
  border-radius: var(--r-2xl);
  transition: box-shadow 0.3s;
}

/* Starter card */
.plan-card-starter {
  background: rgba(13, 13, 24, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-2xl); padding: 32px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative; overflow: hidden; height: 100%;
  transition: box-shadow 0.3s;
}

/* Pro card — glow card */
.plan-card-pro {
  background: radial-gradient(ellipse at 60% -20%, rgba(107,142,90,0.28) 0%, rgba(10,20,14,0.95) 60%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(107, 142, 90, 0.5);
  border-radius: var(--r-2xl); padding: 32px;
  box-shadow:
    0 0 0 1px rgba(107, 142, 90, 0.08),
    0 24px 64px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(107, 142, 90, 0.15);
  position: relative; overflow: hidden; height: 100%;
  transition: box-shadow 0.3s;
}

/* Pro top glow line */
.plan-card-pro::before {
  content: '';
  position: absolute; top: 0; left: 10%; width: 80%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(107,142,90,0.6), transparent);
}

/* Spotlight sweep — keep on both */
.plan-card-starter::after,
.plan-card-pro::after {
  content: '';
  position: absolute; top: -60%; left: -60%;
  width: 80px; height: 220%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
  transform: rotate(-45deg); pointer-events: none;
}
.plan-card-wrapper:hover .plan-card-starter::after,
.plan-card-wrapper:hover .plan-card-pro::after {
  animation: spotlight-sweep 1.2s cubic-bezier(0.22,1,0.36,1) forwards;
}
```

- [ ] **Step 2: Rewrite plan CTA buttons CSS**

Replace `.plan-cta` rules:
```css
.plan-cta {
  display: block; width: 100%; padding: 13px; text-align: center;
  font-size: 0.9375rem; font-weight: 700;
  border-radius: var(--r-xl);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s, border-color 0.2s;
}
/* Starter — glass style */
.plan-cta.outline-cta {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-80);
}
.plan-cta.outline-cta:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text);
}
/* Pro — full gradient */
.plan-cta.filled-cta {
  background: linear-gradient(135deg, #6B8E5A, #8FB87A);
  color: #fff;
  font-size: 1rem;
}
.plan-cta.filled-cta:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(107, 142, 90, 0.4);
}
```

- [ ] **Step 3: Update HTML plan card markup**

Locate the `<!-- STARTER -->` plan card (lines ~1012–1021). Replace `<div class="plan-card">` with `<div class="plan-card plan-card-starter">`.

Locate the `<!-- PRO -->` plan card (lines ~1023–1032). Replace `<div class="plan-card">` with `<div class="plan-card plan-card-pro">`.

Remove the `featured` class from the Pro wrapper (since the styling is now on the card itself, not the wrapper). Change:
```html
<div class="plan-card-wrapper featured reveal delay-2">
```
to:
```html
<div class="plan-card-wrapper reveal delay-2">
```

- [ ] **Step 4: Update comparison table header — sticky + Pro column tint**

Add sticky header CSS:
```css
.pricing-table thead {
  position: sticky; top: 68px; z-index: 10;
}
.pricing-table thead tr {
  background: rgba(13, 13, 24, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-mid);
}
.pricing-table thead th.th-pro {
  background: rgba(107, 142, 90, 0.1);
}
```

- [ ] **Step 5: Update check/cross icon sizes in CSS**

```css
.check-icon { color: #8FB87A; width: 20px; height: 20px; }
.cross-icon { color: rgba(242, 242, 245, 0.25); width: 18px; height: 18px; }
```

In HTML, update all `width="16" height="16"` on `.check-icon` to `width="20" height="20"`, and `.cross-icon` to `width="18" height="18"`.

- [ ] **Step 6: Update category rows CSS**

Replace `.pricing-table .cat-row td`:
```css
.pricing-table .cat-row td {
  background: rgba(255, 255, 255, 0.03);
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--text-40); padding: 10px 20px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
```

- [ ] **Step 7: Verify pricing section in browser**

Pro card should show: radial green glow from top, bright green border, gradient CTA button. Starter card should be dark glass, ghost button. Table header should stick when scrolling. Check icons should be larger and green.

- [ ] **Step 8: Commit**
```bash
git add "amora-landing-v2.html"
git commit -m "feat: pricing redesign — Pro glow card, gradient CTA, glass starter, sticky table header"
```

---

## Task 5 — Create syarat.html

**Files:**
- Create: `syarat.html`

The content is the 14 S&K items from the `makeAccordion('sykList', [...])` call in `amora-landing-v2.html` (lines 1330–1387). Each item has a `q` (title) and `a` (HTML body).

- [ ] **Step 1: Create `syarat.html` with full structure**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Syarat &amp; Ketentuan — Amora.id</title>
  <link rel="preconnect" href="https://fonts.googleapis.com/">
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
  <link href="./Amora.id — Semua Bisa Punya Toko Online_files/css2" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #09090E; --elevated: #0F0F17; --card: #131320;
      --accent: #6B8E5A; --accent-light: #8FB87A;
      --accent-glow: rgba(107,142,90,0.22); --accent-dim: rgba(107,142,90,0.12);
      --accent-border: rgba(107,142,90,0.32);
      --border: rgba(255,255,255,0.07); --border-mid: rgba(255,255,255,0.11);
      --border-strong: rgba(255,255,255,0.17);
      --text: #F2F2F5; --text-80: rgba(242,242,245,0.8);
      --text-60: rgba(242,242,245,0.6); --text-40: rgba(242,242,245,0.4);
      --text-30: rgba(242,242,245,0.3);
      --r-sm: 8px; --r-md: 12px; --r-lg: 16px;
      --r-xl: 20px; --r-2xl: 24px; --r-full: 9999px;
      --shadow-sm: 0 1px 4px rgba(0,0,0,0.4);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.45);
      --inset-top: inset 0 1px 0 rgba(255,255,255,0.07);
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg); color: var(--text);
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      line-height: 1.5; overflow-x: hidden; position: relative;
    }
    a { text-decoration: none; color: inherit; }
    img { display: block; max-width: 100%; }

    /* Background orbs */
    #page-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
    .pg-orb { position: absolute; border-radius: 50%; pointer-events: none; }
    .pg-orb-1 { top: -15%; left: -12%; width: 65vw; height: 65vw; background: radial-gradient(ellipse, rgba(8,22,55,0.65) 0%, transparent 68%); filter: blur(90px); }
    .pg-orb-2 { top: -8%; right: -8%; width: 55vw; height: 55vw; background: radial-gradient(ellipse, rgba(25,65,40,0.55) 0%, transparent 68%); filter: blur(100px); }
    .pg-orb-3 { top: 28%; left: 20%; width: 70vw; height: 60vw; background: radial-gradient(ellipse, rgba(15,40,25,0.4) 0%, transparent 65%); filter: blur(120px); }
    .pg-orb-4 { top: 35%; right: 5%; width: 40vw; height: 40vw; background: radial-gradient(ellipse, rgba(107,142,90,0.1) 0%, transparent 65%); filter: blur(80px); }
    .pg-orb-5 { bottom: 5%; left: -5%; width: 50vw; height: 50vw; background: radial-gradient(ellipse, rgba(10,35,30,0.6) 0%, transparent 68%); filter: blur(100px); }
    .pg-orb-6 { bottom: -10%; right: -5%; width: 50vw; height: 50vw; background: radial-gradient(ellipse, rgba(10,18,45,0.6) 0%, transparent 68%); filter: blur(90px); }
    section { background: transparent !important; position: relative; z-index: 1; }
    nav, footer { position: relative; z-index: 2; }

    @keyframes pulse-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(107,142,90,0.5); } 50% { box-shadow: 0 0 0 5px rgba(107,142,90,0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

    /* Navbar */
    nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; height: 68px; display: flex; align-items: center; transition: background 0.35s, border-bottom 0.35s, box-shadow 0.35s; }
    nav.scrolled { background: rgba(9,9,14,0.88); backdrop-filter: blur(24px) saturate(1.5); -webkit-backdrop-filter: blur(24px) saturate(1.5); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-sm); }
    .nav-inner { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo img { height: 30px; width: auto; }
    .nav-links { display: flex; align-items: center; gap: 36px; }
    .nav-links a { font-size: 0.875rem; font-weight: 500; color: var(--text-60); transition: color 0.2s; position: relative; }
    .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; height: 1px; width: 0; background: var(--accent-light); transition: width 0.2s ease; }
    .nav-links a:hover { color: var(--text); }
    .nav-links a:hover::after { width: 100%; }
    .nav-ctas { display: flex; align-items: center; gap: 10px; }
    .btn-ghost { padding: 9px 18px; font-size: 0.875rem; font-weight: 500; border: 1px solid var(--border-mid); border-radius: var(--r-full); color: var(--text-80); transition: background 0.2s, border-color 0.2s, color 0.2s; }
    .btn-ghost:hover { background: rgba(255,255,255,0.05); border-color: var(--border-strong); color: var(--text); }
    .btn-primary { padding: 9px 18px; font-size: 0.875rem; font-weight: 600; background: var(--accent); border-radius: var(--r-full); color: #fff; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 7px; }
    .btn-primary:hover { background: var(--accent-light); transform: translateY(-1px); box-shadow: 0 12px 40px rgba(107,142,90,0.3); }
    .hamburger { display: none; background: none; border: none; cursor: pointer; color: var(--text); padding: 8px; border-radius: var(--r-md); transition: background 0.2s; }
    .hamburger:hover { background: rgba(255,255,255,0.06); }
    .mobile-menu { display: none; position: fixed; inset: 0; z-index: 40; background: rgba(9,9,14,0.97); backdrop-filter: blur(24px); flex-direction: column; align-items: center; justify-content: center; gap: 28px; }
    .mobile-menu.open { display: flex; }
    .mobile-menu a { font-size: 1.375rem; font-weight: 600; color: var(--text-80); transition: color 0.2s; }
    .mobile-menu a:hover { color: var(--text); }
    .mobile-menu .mobile-ctas { display: flex; flex-direction: column; gap: 10px; width: 220px; margin-top: 12px; }
    .mobile-menu .mobile-ctas a { font-size: 0.9375rem; padding: 13px; text-align: center; border-radius: var(--r-full); font-weight: 500; }
    .mobile-menu .mobile-ctas a.outline { border: 1px solid var(--border-strong); color: var(--text-80); }
    .mobile-menu .mobile-ctas a.filled { background: var(--accent); font-weight: 600; color: #fff; }
    @media (max-width: 768px) { .nav-links, .nav-ctas { display: none; } .hamburger { display: block; } }

    /* Page content */
    .legal-page { max-width: 760px; margin: 0 auto; padding: 120px 24px 80px; }
    .legal-page-header { margin-bottom: 56px; animation: fadeInUp 0.6s ease 0.1s both; }
    .legal-eyebrow {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 4px 12px; border-radius: var(--r-full);
      background: var(--accent-dim); border: 1px solid var(--accent-border);
      font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--accent-light); margin-bottom: 16px;
    }
    .legal-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: pulse-dot 2.5s ease-in-out infinite; }
    .legal-page-header h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -0.025em; color: var(--text); margin-bottom: 8px; }
    .legal-page-header p { font-size: 0.875rem; color: var(--text-40); }

    /* Legal sections — flat scrollable */
    .legal-sections { display: flex; flex-direction: column; gap: 32px; }
    .legal-section {
      background: rgba(13, 13, 24, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--r-xl); padding: 28px 32px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.07),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.45);
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
    }
    .legal-section.visible { opacity: 1; transform: translateY(0); }
    .legal-section h3 {
      font-size: 1rem; font-weight: 700; color: var(--text);
      margin-bottom: 14px; padding-bottom: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .legal-section p { font-size: 0.875rem; color: var(--text-60); line-height: 1.75; }
    .legal-section p + p { margin-top: 10px; }
    .legal-section ul { list-style: none; display: flex; flex-direction: column; gap: 7px; margin-top: 10px; }
    .legal-section ul li {
      font-size: 0.875rem; color: var(--text-60); line-height: 1.65;
      display: flex; align-items: flex-start; gap: 10px;
    }
    .legal-section ul li::before { content: '–'; color: var(--accent); flex-shrink: 0; margin-top: 1px; }
    .legal-section a { color: var(--accent-light); transition: color 0.2s; }
    .legal-section a:hover { color: var(--text-80); }
    .legal-section strong { color: var(--text-80); }

    /* Footer */
    footer { background: rgba(15,15,23,0.96) !important; backdrop-filter: blur(24px); border-top: 1px solid var(--border); margin-top: 80px; }
    footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(to right, transparent, var(--accent-border), transparent); }
    .footer-inner { max-width: 1200px; margin: 0 auto; padding: 48px 28px 32px; }
    .footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    .footer-bottom p { font-size: 0.75rem; color: var(--text-30); }
    .footer-legal-links { display: flex; gap: 20px; }
    .footer-legal-links a { font-size: 0.75rem; color: var(--text-40); transition: color 0.2s; }
    .footer-legal-links a:hover { color: var(--text-60); }
    @media (max-width: 768px) { .footer-bottom { justify-content: center; text-align: center; } }

    svg[data-icon] { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  </style>
</head>
<body>

<div id="page-bg" aria-hidden="true">
  <div class="pg-orb pg-orb-1"></div>
  <div class="pg-orb pg-orb-2"></div>
  <div class="pg-orb pg-orb-3"></div>
  <div class="pg-orb pg-orb-4"></div>
  <div class="pg-orb pg-orb-5"></div>
  <div class="pg-orb pg-orb-6"></div>
</div>

<nav id="navbar">
  <div class="nav-inner">
    <a href="amora-landing-v2.html" class="nav-logo">
      <img src="./Amora.id — Semua Bisa Punya Toko Online_files/logo.png" alt="Amora.id">
    </a>
    <div class="nav-links">
      <a href="amora-landing-v2.html#fitur">Fitur</a>
      <a href="amora-landing-v2.html#harga">Harga</a>
      <a href="amora-landing-v2.html#faq">FAQ</a>
    </div>
    <div class="nav-ctas">
      <a href="#" class="btn-ghost">Masuk</a>
      <a href="#" class="btn-primary">
        Buat Toko
        <svg data-icon viewBox="0 0 24 24" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <svg data-icon viewBox="0 0 24 24" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <a href="amora-landing-v2.html#fitur" class="mobile-link">Fitur</a>
  <a href="amora-landing-v2.html#harga" class="mobile-link">Harga</a>
  <a href="amora-landing-v2.html#faq" class="mobile-link">FAQ</a>
  <div class="mobile-ctas">
    <a href="#" class="outline">Masuk</a>
    <a href="#" class="filled">Buat Toko</a>
  </div>
</div>

<main>
  <div class="legal-page">
    <div class="legal-page-header">
      <div class="legal-eyebrow"><span class="legal-eyebrow-dot"></span>Legal</div>
      <h1>Syarat &amp; Ketentuan</h1>
      <p>Versi 1.1 · 24 Mei 2026 · Berlaku sejak tanggal publikasi</p>
    </div>
    <div class="legal-sections">

      <div class="legal-section">
        <h3>Tentang Amora</h3>
        <p>Amora adalah platform web builder berbasis langganan (SaaS) yang membantu UMKM membangun dan mengelola toko online sendiri. Amora adalah penyedia teknologi, bukan marketplace.</p>
        <p>Amora tidak ikut campur dalam transaksi jual beli antara Merchant dan Pembeli, tidak menyentuh dana transaksi, dan tidak bertanggung jawab atas pengiriman pesanan.</p>
      </div>

      <div class="legal-section">
        <h3>Siapa yang Bisa Menggunakan Amora?</h3>
        <p>Anda bisa menggunakan Amora jika memenuhi syarat berikut:</p>
        <ul>
          <li>Berusia minimal 18 tahun atau memiliki persetujuan dari orang tua/wali yang sah</li>
          <li>Memiliki kapasitas hukum untuk membuat perjanjian</li>
          <li>Mendaftarkan diri dengan informasi yang benar dan lengkap</li>
        </ul>
        <p>Amora berhak menolak atau menutup akun yang menggunakan informasi palsu.</p>
      </div>

      <div class="legal-section">
        <h3>Paket dan Harga</h3>
        <p>Tersedia dua paket: <strong>Starter</strong> dan <strong>Pro</strong>. Detail fitur dan harga terbaru selalu tersedia di halaman harga Amora.</p>
        <ul>
          <li>Harga sudah termasuk PPN — tidak ada biaya pajak tambahan di luar harga yang tertera</li>
          <li>Pembayaran pertama dilakukan di muka saat subscription</li>
          <li>Tagihan bulanan berikutnya dibayarkan setiap bulan</li>
          <li>Invoice tagihan bulanan diterbitkan 3 hari sebelum tanggal jatuh tempo</li>
          <li>Pembayaran yang sudah dilakukan tidak dapat dikembalikan (non-refundable)</li>
        </ul>
      </div>

      <div class="legal-section">
        <h3>Batas Waktu Pembayaran</h3>
        <p>Pembayaran pertama harus diselesaikan dalam waktu <strong>2 jam</strong> setelah order dibuat. Halaman pembayaran akan kadaluarsa setelah 2 jam dan order otomatis dibatalkan.</p>
        <p>Setelah pembayaran pertama berhasil, layanan Platform langsung aktif dan dapat digunakan.</p>
      </div>

      <div class="legal-section">
        <h3>Perpanjangan Bulanan</h3>
        <p>Untuk tagihan bulanan berikutnya:</p>
        <ul>
          <li>Invoice diterbitkan otomatis 3 hari sebelum tanggal jatuh tempo</li>
          <li>Tanggal jatuh tempo adalah tanggal yang sama setiap bulannya dengan tanggal pembayaran pertama</li>
          <li>Pembayaran harus diselesaikan maksimal pada tanggal jatuh tempo</li>
          <li>Jika melewati jatuh tempo, akses Platform ditangguhkan hingga pembayaran diselesaikan</li>
        </ul>
      </div>

      <div class="legal-section">
        <h3>Biaya Kelebihan Kuota</h3>
        <p>Jika pesanan melebihi kuota bulanan paket Anda, biaya tambahan dikenakan:</p>
        <ul>
          <li>Starter (kuota 300 pesanan/bulan): +2% per pesanan lebih</li>
          <li>Pro (kuota 1.000 pesanan/bulan): +1% per pesanan lebih</li>
        </ul>
        <p>Tagihan kelebihan kuota diproses di periode berikutnya.</p>
      </div>

      <div class="legal-section">
        <h3>Pembayaran dan Payment Gateway</h3>
        <p>Amora tidak memproses, menampung, atau memiliki akses ke dana dari transaksi toko Anda. Semua pembayaran dari Pembeli mengalir langsung melalui payment gateway yang Anda pilih sendiri.</p>
        <ul>
          <li>Amora hanya menyediakan integrasi teknis dengan payment gateway (Xendit, Midtrans, Doku, dll)</li>
          <li>Tanggung jawab atas transaksi, klaim, dan pengembalian dana sepenuhnya ada di tangan Merchant dan payment gateway masing-masing</li>
        </ul>
      </div>

      <div class="legal-section">
        <h3>Kewajiban Merchant</h3>
        <p>Sebagai Merchant, Anda berkewajiban untuk:</p>
        <ul>
          <li>Memastikan semua informasi produk akurat dan tidak menyesatkan sesuai UU No. 8 Tahun 1999</li>
          <li>Tidak menjual produk yang melanggar hukum Indonesia</li>
          <li>Mengisi dan mempublikasikan Kebijakan Refund sebelum toko aktif</li>
          <li>Memproses pesanan dalam waktu wajar</li>
          <li>Membalas komplain Pembeli dalam 2×24 jam hari kerja</li>
        </ul>
      </div>

      <div class="legal-section">
        <h3>Yang Tidak Boleh Dilakukan</h3>
        <p>Pelanggaran berikut dapat mengakibatkan akun dinonaktifkan tanpa pemberitahuan:</p>
        <ul>
          <li>Menjual barang ilegal (palsu, narkotika, senjata, konten melanggar kesusilaan)</li>
          <li>Menipu atau menyesatkan Pembeli</li>
          <li>Menyebarkan informasi palsu atau hoaks</li>
          <li>Melanggar hak kekayaan intelektual pihak lain</li>
          <li>Merusak atau membebani sistem Platform</li>
          <li>Pencucian uang atau kegiatan ilegal lainnya</li>
        </ul>
      </div>

      <div class="legal-section">
        <h3>Penanganan Fraud dan Sanksi</h3>
        <p>Jika Amora menemukan atau menerima laporan yang dapat dipercaya tentang fraud, akun Merchant akan langsung dinonaktifkan. Untuk pelanggaran ringan, sanksi bertahap berlaku:</p>
        <ul>
          <li>Peringatan tertulis</li>
          <li>Penangguhan sementara</li>
          <li>Penghentian layanan permanen</li>
        </ul>
        <p>Biaya langganan yang sudah dibayar tidak akan dikembalikan. Kasus pidana dilaporkan ke pihak berwajib.</p>
      </div>

      <div class="legal-section">
        <h3>Hak Kekayaan Intelektual</h3>
        <p><strong>Milik Amora:</strong> Seluruh Platform termasuk kode, desain, merek, dan logo adalah milik Amora. Anda hanya mendapat lisensi pakai selama berlangganan.</p>
        <p><strong>Milik Anda:</strong> Semua konten yang Anda unggah tetap milik Anda. Anda memberi Amora izin menampilkannya untuk operasional Platform. Anda bertanggung jawab jika konten Anda melanggar hak pihak lain.</p>
      </div>

      <div class="legal-section">
        <h3>Batasan Tanggung Jawab Amora</h3>
        <p>Platform disediakan as-is tanpa garansi bebas gangguan setiap saat. Amora tidak bertanggung jawab atas:</p>
        <ul>
          <li>Kerugian dari transaksi Merchant-Pembeli</li>
          <li>Gangguan akibat bencana atau serangan siber</li>
          <li>Kerugian tidak langsung</li>
          <li>Kegagalan payment gateway atau jasa pengiriman</li>
        </ul>
        <p>Maksimal kewajiban Amora kepada Anda = biaya langganan 3 bulan terakhir.</p>
      </div>

      <div class="legal-section">
        <h3>Penghentian Layanan</h3>
        <ul>
          <li><strong>Oleh Merchant:</strong> Bisa berhenti kapan saja. Berlaku di akhir periode tagihan. Tidak ada refund.</li>
          <li><strong>Oleh Amora (30 hari pemberitahuan):</strong> Jika Amora menghentikan layanan secara keseluruhan.</li>
          <li><strong>Oleh Amora (tanpa pemberitahuan):</strong> Jika ada pelanggaran berat, fraud, atau perintah otoritas.</li>
        </ul>
        <p>Ekspor data Anda sebelum akun ditutup.</p>
      </div>

      <div class="legal-section">
        <h3>Perubahan Ketentuan &amp; Penyelesaian Sengketa</h3>
        <p>Amora bisa mengubah ketentuan ini kapan saja. Perubahan besar diberitahukan minimal 14 hari sebelum berlaku. Terus menggunakan Platform berarti menyetujui ketentuan baru.</p>
        <p>Sengketa diselesaikan melalui: musyawarah (30 hari) → mediasi → Pengadilan Negeri Jakarta Pusat. Berlaku hukum Republik Indonesia.</p>
        <p>Hubungi kami: <a href="mailto:support@amora.id">support@amora.id</a></p>
      </div>

    </div>
  </div>
</main>

<footer>
  <div class="footer-inner">
    <div class="footer-bottom">
      <p>© 2025 Amora.id. Hak cipta dilindungi.</p>
      <div class="footer-legal-links">
        <a href="syarat.html">Syarat &amp; Ketentuan</a>
        <a href="privasi.html">Kebijakan Privasi</a>
      </div>
    </div>
  </div>
</footer>

<script>
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.querySelectorAll('.mobile-link, .mobile-ctas a').forEach(el => {
    el.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); sectionObserver.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: '-20px' });
  document.querySelectorAll('.legal-section').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.05}s`;
    sectionObserver.observe(el);
  });
</script>
</body>
</html>
```

- [ ] **Step 2: Verify syarat.html opens correctly**

Open `http://localhost:3456/syarat.html`. Should show all 14 S&K sections as individual glass cards with staggered fade-in. Nav links back to main page. Footer shows correct links.

- [ ] **Step 3: Commit**
```bash
git add "syarat.html"
git commit -m "feat: add syarat.html — standalone S&K legal page with glass card sections"
```

---

## Task 6 — Create privasi.html

**Files:**
- Create: `privasi.html`

Same structure as `syarat.html`. Content from the `makeAccordion('privList', [...])` call (lines 1390–1423) — 8 privacy items.

- [ ] **Step 1: Create `privasi.html`**

Copy the full `syarat.html` structure. Change:
- `<title>` → `Kebijakan Privasi — Amora.id`
- `<h1>` → `Kebijakan Privasi`
- `<p>` under h1 → `24 Mei 2026 · Disusun sesuai UU No. 27 Tahun 2022 (UU PDP)`

Replace the `.legal-sections` content with these 8 sections:

```html
<div class="legal-section">
  <h3>Data Apa yang Kami Kumpulkan?</h3>
  <p><strong>Data yang Anda berikan:</strong></p>
  <ul>
    <li>Nama, email, nomor telepon, tanggal lahir</li>
    <li>Username dan kata sandi (disimpan terenkripsi)</li>
    <li>Informasi bisnis untuk keperluan toko</li>
  </ul>
  <p><strong>Data yang dikumpulkan otomatis:</strong></p>
  <ul>
    <li>Jenis perangkat, browser, alamat IP</li>
    <li>Halaman yang dikunjungi dan durasi kunjungan</li>
    <li>Data dari cookies dan teknologi pelacakan serupa</li>
  </ul>
</div>

<div class="legal-section">
  <h3>Untuk Apa Data Anda Digunakan?</h3>
  <p>Data Anda digunakan untuk:</p>
  <ul>
    <li>Menjalankan dan meningkatkan layanan Platform</li>
    <li>Mengelola akun dan komunikasi dengan Anda</li>
    <li>Mendeteksi dan mencegah penipuan atau penyalahgunaan</li>
    <li>Memenuhi kewajiban hukum jika diminta otoritas berwenang</li>
    <li>Mengirim info produk dan promosi (bisa Anda nonaktifkan kapan saja)</li>
  </ul>
  <p>Amora memproses data berdasarkan: persetujuan Anda, pelaksanaan kontrak, kewajiban hukum, atau kepentingan yang sah.</p>
</div>

<div class="legal-section">
  <h3>Siapa yang Bisa Mengakses Data Anda?</h3>
  <p>Amora tidak menjual data pribadi Anda. Data bisa dibagikan kepada:</p>
  <ul>
    <li>Mitra teknis yang membantu operasional Platform (terikat perjanjian kerahasiaan)</li>
    <li>Otoritas hukum jika diwajibkan oleh pengadilan atau peraturan</li>
    <li>Pihak pengakuisisi jika Amora mengalami merger atau akuisisi</li>
  </ul>
  <p><strong>Catatan untuk Merchant:</strong> Anda adalah Pengendali Data atas informasi Pembeli yang dikumpulkan di toko Anda dan bertanggung jawab mematuhi UU PDP.</p>
</div>

<div class="legal-section">
  <h3>Bagaimana Kami Melindungi Data Anda?</h3>
  <p>Langkah perlindungan yang kami terapkan:</p>
  <ul>
    <li>Enkripsi data saat dikirim dan disimpan</li>
    <li>Kontrol akses ketat dan autentikasi berlapis</li>
    <li>Pemantauan sistem secara berkala</li>
  </ul>
  <p>Data disimpan hanya selama diperlukan, lalu dihapus atau dianonimkan. Tidak ada sistem yang 100% aman.</p>
</div>

<div class="legal-section">
  <h3>Hak Anda atas Data Pribadi</h3>
  <p>Sesuai UU No. 27 Tahun 2022 (UU PDP), Anda berhak untuk:</p>
  <ul>
    <li>Mengakses data yang kami miliki tentang Anda</li>
    <li>Memperbaiki data yang tidak akurat</li>
    <li>Menghapus data Anda dalam kondisi tertentu</li>
    <li>Menolak pemrosesan untuk tujuan pemasaran</li>
    <li>Memindahkan data ke platform lain (portabilitas data)</li>
    <li>Menarik persetujuan kapan saja</li>
  </ul>
  <p>Ajukan permintaan ke <a href="mailto:support@amora.id">support@amora.id</a>. Jika tidak puas, Anda bisa melapor ke Kementerian Komunikasi dan Digital.</p>
</div>

<div class="legal-section">
  <h3>Cookies</h3>
  <p>Kami menggunakan cookies untuk: fungsi dasar (login, keamanan), preferensi, analitik, dan pemasaran.</p>
  <p>Anda bisa mengatur atau menonaktifkan cookies di browser, namun ini bisa mempengaruhi fungsi Platform.</p>
</div>

<div class="legal-section">
  <h3>Platform Tidak untuk Anak di Bawah 18 Tahun</h3>
  <p>Amora tidak ditujukan untuk pengguna di bawah usia 18 tahun. Jika kami mengetahui ada data anak yang terkumpul tanpa izin orang tua, data tersebut akan segera dihapus.</p>
</div>

<div class="legal-section">
  <h3>Perubahan Kebijakan</h3>
  <p>Kebijakan ini bisa diperbarui sewaktu-waktu. Perubahan besar diberitahukan lewat email atau notifikasi di Platform. Terus menggunakan Platform setelah perubahan berarti menyetujui kebijakan baru.</p>
  <p>Hubungi kami: <a href="mailto:support@amora.id">support@amora.id</a> · Jakarta, Indonesia</p>
</div>
```

- [ ] **Step 2: Verify privasi.html opens correctly**

Open `http://localhost:3456/privasi.html`. Should show 8 privacy sections as glass cards.

- [ ] **Step 3: Commit**
```bash
git add "privasi.html"
git commit -m "feat: add privasi.html — standalone Kebijakan Privasi page with glass card sections"
```

---

## Task 7 — Remove legal sections from main page + update footer links

**Files:**
- Modify: `amora-landing-v2.html` (HTML + CSS + JS)

- [ ] **Step 1: Remove CSS `.legal-*` rules**

In the `<style>` block, delete the entire `/* LEGAL SECTIONS */` block — lines 701–744:
```
.legal-inner { ... }
.legal-header { ... }
.legal-header h2 { ... }
.legal-header p { ... }
.legal-accordion { ... }
.legal-item { ... }
.legal-question { ... }
.legal-question:hover { ... }
.legal-item.active > .legal-question { ... }
.legal-question span { ... }
.legal-question:hover span, .legal-item.active .legal-question span { ... }
.legal-chevron { ... }
.legal-chevron.open { ... }
.legal-answer { ... }
.legal-answer.open { ... }
.legal-answer-inner { ... }
.legal-answer-inner p { ... }
.legal-answer-inner ul { ... }
.legal-answer-inner ul li { ... }
.legal-answer-inner ul li::before { ... }
```

- [ ] **Step 2: Remove `<section id="syarat-ketentuan">` from HTML**

Delete lines 1169–1179:
```html
<!-- ══════════════ SYARAT & KETENTUAN ══════════════ -->
<section id="syarat-ketentuan" class="py-section-sm">
  <div class="section-inner legal-inner">
    <div class="legal-header reveal">
      <div class="section-eyebrow"><span class="section-eyebrow-dot"></span>Legal</div>
      <h2>Syarat &amp; Ketentuan</h2>
      <p>Versi 1.1 · 24 Mei 2026 · Berlaku sejak tanggal publikasi</p>
    </div>
    <div class="legal-accordion reveal delay-1" id="sykList"></div>
  </div>
</section>
```

- [ ] **Step 3: Remove `<section id="kebijakan-privasi">` from HTML**

Delete lines 1181–1191:
```html
<!-- ══════════════ KEBIJAKAN PRIVASI ══════════════ -->
<section id="kebijakan-privasi" class="py-section-sm">
  <div class="section-inner legal-inner">
    <div class="legal-header reveal">
      <div class="section-eyebrow"><span class="section-eyebrow-dot"></span>Legal</div>
      <h2>Kebijakan Privasi</h2>
      <p>24 Mei 2026 · Disusun sesuai UU No. 27 Tahun 2022 (UU PDP)</p>
    </div>
    <div class="legal-accordion reveal delay-1" id="privList"></div>
  </div>
</section>
```

- [ ] **Step 4: Remove `makeAccordion` JS calls and factory function**

In the `<script>` block, delete:
1. The `makeAccordion` function definition (lines 1265–1293)
2. The `makeAccordion('sykList', [...], false)` call (lines 1330–1387)
3. The `makeAccordion('privList', [...], false)` call (lines 1390–1423)

- [ ] **Step 5: Update footer legal link hrefs**

Change:
```html
<a href="#syarat-ketentuan">Syarat &amp; Ketentuan</a>
<a href="#kebijakan-privasi">Kebijakan Privasi</a>
```
To:
```html
<a href="syarat.html">Syarat &amp; Ketentuan</a>
<a href="privasi.html">Kebijakan Privasi</a>
```

- [ ] **Step 6: Verify main page in browser**

Scroll to bottom — no S&K or Privasi accordions. Footer links should navigate to `syarat.html` and `privasi.html`. No JS errors in console.

- [ ] **Step 7: Commit**
```bash
git add "amora-landing-v2.html"
git commit -m "feat: extract legal sections to dedicated pages, update footer links"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Task 1: Section dividers removed
- ✅ Task 2: Glass card treatment — feature cards, FAQ, hero stats, pricing table
- ✅ Task 3: Animations — count-up, hover micro-interactions, stagger (nav underline, btn-primary, feature card, Pro card hover)
- ✅ Task 4: Pricing Option C — Pro glow card, gradient CTA, glass starter, sticky thead, updated icons/rows
- ✅ Task 5: syarat.html created with full content
- ✅ Task 6: privasi.html created with full content
- ✅ Task 7: Legal sections removed from main page, footer links updated

**Execution order note:** Tasks 5 and 6 can be done before or after Tasks 1–4. Task 7 must come after Tasks 5 and 6 are verified working (so footer links don't break before destination pages exist).
