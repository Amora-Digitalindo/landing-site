# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skill usage policy

Do **not** invoke any `superpowers:*` skill (brainstorming, writing-plans, executing-plans, subagent-driven-development, systematic-debugging, test-driven-development, etc.) on this repository unless the user explicitly names the skill or explicitly asks for that workflow (e.g. "use the brainstorming skill", "write a plan first"). This overrides the default "if a skill might apply, you must use it" behavior — for this repo, skip straight to doing the work the user asked for. Non-superpowers skills (e.g. `frontend-design`, `web-design-guidelines`) are unaffected by this rule.

## Repository structure: two parallel codebases

This repo contains **two separate, non-syncing implementations** of the Amora.id marketing site. Always confirm which one a task targets before editing — they do not share files and edits to one do not propagate to the other.

1. **Root static HTML (currently canonical/active)** — `amora-landing-v2.html`, `login.html`, `privasi.html`, `syarat.html`, each paired with a stylesheet in `css/` (e.g. `css/amora-landing-v2.css`). No build step; these are plain HTML files with inline `<script>` blocks and a `<script type="importmap">` pulling Three.js from `esm.sh` for the hero's WebGL scene. Open directly in a browser or serve statically (see `.claude/launch.json`, which runs `npx serve -p 3456 .`).
2. **`astro-app/` (in-progress migration, not yet canonical)** — an Astro 4 static site (`output: 'static'`) rebuilding the same pages as components. Structure: `src/pages/*.astro` (index, privasi, syarat) compose `src/components/{Landing,Legal,Shared}/*.astro`, wrapped by `src/layouts/MainLayout.astro`. Styles live in `src/styles/*.css`; page-specific JS in `src/scripts/*.js`. Has its own `package.json` (`npm run dev|build|preview`).

Design/planning docs in `docs/superpowers/specs/` and `docs/superpowers/plans/` explicitly call out their target file per change (e.g. the 2026-06-22 VIP Merchant spec states `astro-app/` is out of scope). When a task doesn't specify, check these docs or ask — most active feature work targets the root `amora-landing-v2.html`, with `astro-app/` lagging behind as a future rewrite.

## Commands

Root static site — no install/build; just serve:
```
npx serve -p 3456 .
```

`astro-app/`:
```
cd astro-app
npm install
npm run dev       # local dev server
npm run build     # static build to dist/
npm run preview   # preview the build
```

There is no test suite or linter configured in either codebase.

## Architecture notes (root static site)

- `amora-landing-v2.html` is a single long page (~3300 lines) assembled from clearly delimited `<section id="...">` blocks in this order: hero → `#fitur` (live orders feature) → `#feature-setup` (order tracking) → `#features-grid` (tabbed showcase with multiple "views": Website Toko, Dashboard, Pembayaran, Kustomisasi) → `#harga` (pricing) → `#cta-banner` → `#faq` → footer.
- Section boundaries are marked with `<!-- ══════ NAME ══════ -->` banner comments — search for these to jump between sections instead of scanning line-by-line.
- All page CSS lives in one file, `css/amora-landing-v2.css`; there's no CSS module/scoping system, so class names must stay globally unique.
- Inline `<script>` blocks (around lines ~2048, ~3121, ~3243) handle navbar scroll state, scroll-reveal animations, and other page behavior. The hero's 2D canvas fallback code is dead (an early `return` short-circuits it) — Three.js (loaded via the importmap) now drives the hero's 3D scene.
- `login.html`, `privasi.html`, `syarat.html` are simpler standalone pages, each with their own CSS file in `css/`.

## Architecture notes (astro-app)

- `MainLayout.astro` is the shared shell (head metadata, nav/footer wiring) used by every page via a `variant` prop (e.g. `"landing"`).
- Landing page composition lives in `src/pages/index.astro`, which imports and stacks `Landing/*` components in order; structured data (JSON-LD) is injected via `set:html` into the `Fragment slot="head"`.
- Legal pages (`privasi.astro`, `syarat.astro`) use `Legal/LegalHeader.astro` + `Legal/LegalAccordion.astro` rather than the Landing components.
- Shared chrome (`Navbar`, `MobileMenu`, `Footer`, `BackgroundCanvas`) lives under `Shared/`.

## Design/planning history

`docs/superpowers/` contains dated specs and plans (`specs/YYYY-MM-DD-*.md`, `plans/YYYY-MM-DD-*.md`) documenting past feature work (e.g. landing page redesigns, feature-section overhauls, the VIP Merchant program). These are useful for understanding *why* a section looks the way it does and which file a similar future change should target.
