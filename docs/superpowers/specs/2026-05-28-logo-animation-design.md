# Logo Animation — Navbar Entrance

## Summary

Animate the Amora.id SVG logo in the navbar on page load. Inline the SVG, add per-character blur bloom intro + infinite looping glow outline.

## Animation Sequence

**First load (one-time):**
1. Each character group appears staggered L→R: icon bars → a → m → o → dots → r → a
2. Fill: white, starts `opacity:0; filter:blur(14px)`, transitions to `opacity:1; filter:blur(0)`
3. Stroke outline (`#8FB87A`, 5px) draws simultaneously via `stroke-dashoffset`
4. Glow: double `drop-shadow` in `#597043` at 70% opacity on stroke layer
5. Stroke + glow fade out after draw completes

**After intro (continuous):**
- Outline glow redraws in a loop (~4.2s interval)
- Fill stays visible, no re-animation

## Character Groups & Delays

| Group | Paths | Delay |
|-------|-------|-------|
| Icon bars | 3 bar paths | 0s |
| a | M590.54... | 0.15s |
| m | M840.46... | 0.30s |
| o | M1191.82... | 0.45s |
| dots | M1126.23 + M1228.4 | 0.58s |
| r | M1438.23... | 0.72s |
| a₂ | M1793.66... | 0.86s |

## Technical Approach

1. **Replace `<img>` with inline `<svg>`** in navbar across all 3 pages (homepage, syarat, privasi)
2. **Two SVG layers stacked** inside a wrapper:
   - `.fill-layer` (z-index 1): white filled paths, per-char blur bloom
   - `.stroke-layer` (z-index 2): green stroke outline, glow animation
3. **CSS**: keyframes `strokeGlow`, per-path transitions for dashoffset/opacity
4. **JS** (~30 lines): `getTotalLength()` per path, setup dasharray, trigger play, `setInterval` for glow loop
5. **No layout changes** — logo wrapper keeps same dimensions as current `<img>`

## Files Changed

- `amora-landing-v2.html` — inline SVG + CSS + JS
- `syarat.html` — same
- `privasi.html` — same

## Constraints

- SVG viewBox preserved: `0 0 1920 543.72`
- Logo dimensions in navbar unchanged
- Animation CSS scoped to `.logo-anim` to avoid conflicts
- JS runs on `DOMContentLoaded`
