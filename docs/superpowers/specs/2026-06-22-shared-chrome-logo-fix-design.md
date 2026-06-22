# Shared Chrome Fix: Logo Animation + Nav Clearance — Design Spec

Date: 2026-06-22
Target files: `assets/js/site-chrome.js`, `amora-landing-v2.html`, `privasi.html`, `syarat.html`, `vip-merchant-registration/index.html`

## Problem

After extracting the navbar/footer into the shared `assets/js/site-chrome.js` component (commit `eca1049`), the VIP Merchant registration page still visually diverged from the homepage:

1. **Logo renders as a hollow outline, not the full logo.** The nav logo SVG has two layers: a solid white `.fill-layer` (paths start at `opacity: 0`, animated to `1` on page load) and a green `.stroke-layer` (animated draw-in effect, replayed every 4.2s). The animation that drives this lives in a "Logo Animation" `<script>` block duplicated separately in `amora-landing-v2.html` (~line 2958), `privasi.html` (~line 178), and `syarat.html` (~line 232). The registration page never had this script, so its `.fill-layer` paths stay at `opacity: 0` forever — only the thin stroke outline is visible.
2. **Nav overlaps page content.** `nav` is `position: fixed` with a transparent background until scrolled (`nav.scrolled` adds the blurred pill background). Every other page's first section has enough top padding to clear the nav's 68px height (e.g. `#hero { padding: 80px 0 120px; }`). The registration page's `.split` only has `padding: 56px 32px`, so the "Founding Merchant — 30 Slot" badge at the top of `.banner` renders squeezed against/behind the nav.

Both bugs trace back to the same root cause as the original nav/footer duplication: page-specific copies of behavior that should be centralized.

## Fix

### 1. Move Logo Animation into `site-chrome.js`

Add the logo animation logic (verbatim from `amora-landing-v2.html`'s copy — all three existing copies are identical) as a new function in `assets/js/site-chrome.js`, called from `mount()` after the nav is injected (since `.logo-anim` only exists once `navHtml()` has been mounted):

- `setupStroke()` — sets `stroke-dasharray`/`stroke-dashoffset` on each stroke path to its own length (for the draw-in effect).
- `playOutline()` — replays the stroke draw-in + glow animation.
- Initial fill-bloom timeout (60ms after mount) that fades in `.fill-layer` paths in staggered groups, then calls `playOutline()`.
- `setInterval(playOutline, 4200)` — repeats the outline animation every 4.2s, matching current behavior.

This function must run after `navSlot.outerHTML = ...` (so `.logo-anim` exists in the DOM) — it's added as a new step in `mount()`, not `initBehavior()`, since it's logo-specific rather than nav-interaction-specific (kept as a separate function for clarity, but both are called from `mount()`).

### 2. Remove duplicated Logo Animation scripts

Delete the "Logo Animation" IIFE block from:
- `amora-landing-v2.html` (~line 2958-2998)
- `privasi.html` (~line 178-218, exact range to be confirmed when editing)
- `syarat.html` (~line 232-272, exact range to be confirmed when editing)

Each deletion leaves the rest of that page's script block intact (the logo animation is a self-contained IIFE; removing it doesn't affect surrounding code).

### 3. Add top clearance to the registration page's `.split`

In `vip-merchant-registration/index.html`'s inline `<style>`, change:

```css
.split {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 56px;
  max-width: 1180px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 56px 32px;
}
```

to use a larger top padding that clears the fixed nav (68px tall) plus breathing room, matching the spirit of `#hero`'s `padding-top: 80px` on the homepage:

```css
.split {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 56px;
  max-width: 1180px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 110px 32px 56px;
}
```

Also check the `@media (max-width: 900px)` override of `.split` padding (currently `padding: 40px 24px`) and apply the same top-clearance fix there (e.g. `padding: 100px 24px 40px`), since the nav remains fixed at all viewport widths.

## Verification

- Reload `vip-merchant-registration/index.html` (file:// and via local server) in headless Chrome; confirm via screenshot that the logo shows its full white fill (not just a green outline) and that the "Founding Merchant — 30 Slot" badge no longer overlaps the nav.
- Reload `amora-landing-v2.html`, `privasi.html`, `syarat.html` and confirm the logo animation still plays identically post-refactor (no visual regression from centralizing it).
- Grep all four HTML files afterward to confirm no leftover duplicate "Logo Animation" blocks remain outside `site-chrome.js`.

## Out of scope

- No other visual differences between the registration page and homepage are being addressed in this pass (e.g. overall background texture/orbs) unless further reported.
- `login.html` is unaffected (it has no nav/footer/logo-anim to begin with).
