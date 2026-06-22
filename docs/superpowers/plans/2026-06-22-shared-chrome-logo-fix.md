# Shared Chrome Logo Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the VIP Merchant registration page's broken-looking nav by centralizing the logo fill-in animation into the shared `site-chrome.js` component and giving the page enough top padding to clear the fixed nav.

**Architecture:** This is a static HTML/CSS/JS site with no build step and no test framework. Verification means: grep-check the edit landed, then load the page in headless Chrome and confirm via screenshot/DOM inspection that the logo fill renders and nothing overlaps the nav.

**Tech Stack:** Plain HTML5, CSS3, vanilla JS (no frameworks).

---

### Task 1: Move the Logo Animation into `assets/js/site-chrome.js`

**Files:**
- Modify: `assets/js/site-chrome.js`

The logo SVG (already built by `navHtml()` in this file) has a `.fill-layer` (solid white paths, start at `opacity: 0`) and a `.stroke-layer` (green outline, animated draw-in). Three pages currently each have their own copy of the script that animates these layers in; this task adds one canonical copy here so every page that mounts the shared nav gets the animation for free.

- [ ] **Step 1: Add a `playLogoAnimation()` function**

In `assets/js/site-chrome.js`, add this new function right after `initBehavior()` (i.e., between the closing `}` of `initBehavior` at line 204 and the `function mount() {` at line 206):

```js
  function playLogoAnimation() {
    var la = document.querySelector('.logo-anim');
    if (!la) return;

    var fp = la.querySelectorAll('.fill-layer path');
    var sp = la.querySelectorAll('.stroke-layer path');
    var sl = la.querySelector('.stroke-layer');
    var groups = [[0, 1, 2], [3], [4], [5], [6, 7], [8], [9]];
    var gd = [0, .15, .30, .45, .58, .72, .86];

    function setupStroke() {
      sp.forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    }

    function playOutline() {
      sl.style.opacity = '1'; sl.style.animation = 'none';
      sp.forEach(function (p) { p.style.transition = 'none'; });
      void la.offsetWidth;
      setupStroke();
      sp.forEach(function (p) { p.style.strokeOpacity = '1'; });
      void la.offsetWidth;
      sl.style.animation = 'strokeGlow 3.2s cubic-bezier(.16,1,.3,1) forwards';
      groups.forEach(function (g, gi) {
        var d = gd[gi];
        g.forEach(function (i) {
          sp[i].style.transition = 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1) ' + d + 's,stroke-opacity .5s ease ' + (d + 1.8) + 's';
          sp[i].style.strokeDashoffset = '0';
          sp[i].style.strokeOpacity = '0';
        });
      });
    }

    setupStroke();
    setTimeout(function () {
      groups.forEach(function (g, gi) {
        var d = gd[gi];
        g.forEach(function (i) {
          fp[i].style.transition = 'opacity .55s cubic-bezier(.16,1,.3,1) ' + d + 's,filter .6s cubic-bezier(.16,1,.3,1) ' + d + 's';
          fp[i].style.opacity = '1';
          fp[i].style.filter = 'blur(0)';
        });
      });
      playOutline();
    }, 60);
    setInterval(playOutline, 4200);
  }
```

- [ ] **Step 2: Call it from `mount()`**

Current `mount()` function (lines 206-214):

```js
  function mount() {
    var navSlot = document.getElementById('site-navbar');
    var footerSlot = document.getElementById('site-footer');

    if (navSlot) navSlot.outerHTML = navHtml() + mobileMenuHtml();
    if (footerSlot) footerSlot.outerHTML = footerHtml();

    initBehavior();
  }
```

Replace with:

```js
  function mount() {
    var navSlot = document.getElementById('site-navbar');
    var footerSlot = document.getElementById('site-footer');

    if (navSlot) navSlot.outerHTML = navHtml() + mobileMenuHtml();
    if (footerSlot) footerSlot.outerHTML = footerHtml();

    initBehavior();
    playLogoAnimation();
  }
```

- [ ] **Step 3: Verify syntax**

Run: `node --check assets/js/site-chrome.js`
Expected: no output (exits 0).

- [ ] **Step 4: Commit**

```bash
git add assets/js/site-chrome.js
git commit -m "feat: centralize logo fill-in animation into site-chrome.js"
```

---

### Task 2: Remove the duplicated Logo Animation script from each page

**Files:**
- Modify: `amora-landing-v2.html`
- Modify: `privasi.html`
- Modify: `syarat.html`

- [ ] **Step 1: Remove it from `amora-landing-v2.html`**

Run this to confirm the current line range before editing:

```bash
grep -n "Logo Animation" amora-landing-v2.html
```

Expected: one match around line 2958. Read lines 2955-3001 to confirm the block is a self-contained `<script>...</script>` pair (starts with `<script>` right before the comment, ends with `</script>` right after the IIFE's closing `})();`).

Using the Edit tool, replace:

```html
    // ── Logo Animation ──
    (function () {
      var la = document.querySelector('.logo-anim');
      if (!la) return;
      var fp = la.querySelectorAll('.fill-layer path');
      var sp = la.querySelectorAll('.stroke-layer path');
      var sl = la.querySelector('.stroke-layer');
      var groups = [[0, 1, 2], [3], [4], [5], [6, 7], [8], [9]];
      var gd = [0, .15, .30, .45, .58, .72, .86];

      function setupStroke() {
        sp.forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l });
      }
      function playOutline() {
        sl.style.opacity = '1'; sl.style.animation = 'none';
        sp.forEach(function (p) { p.style.transition = 'none' });
        void la.offsetWidth;
        setupStroke();
        sp.forEach(function (p) { p.style.strokeOpacity = '1' });
        void la.offsetWidth;
        sl.style.animation = 'strokeGlow 3.2s cubic-bezier(.16,1,.3,1) forwards';
        groups.forEach(function (g, gi) {
          var d = gd[gi]; g.forEach(function (i) {
            sp[i].style.transition = 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1) ' + d + 's,stroke-opacity .5s ease ' + (d + 1.8) + 's';
            sp[i].style.strokeDashoffset = '0'; sp[i].style.strokeOpacity = '0';
          })
        });
      }
      // intro: fill bloom + outline
      setupStroke();
      setTimeout(function () {
        groups.forEach(function (g, gi) {
          var d = gd[gi]; g.forEach(function (i) {
            fp[i].style.transition = 'opacity .55s cubic-bezier(.16,1,.3,1) ' + d + 's,filter .6s cubic-bezier(.16,1,.3,1) ' + d + 's';
            fp[i].style.opacity = '1'; fp[i].style.filter = 'blur(0)';
          })
        });
        playOutline();
      }, 60);
      setInterval(playOutline, 4200);
    })();

  </script>

  <script>
    // ── Hero glassmorphic parallax — pure CSS 3D, no WebGL ──
```

with:

```html
  </script>

  <script>
    // ── Hero glassmorphic parallax — pure CSS 3D, no WebGL ──
```

(i.e., delete the `// ── Logo Animation ──` comment through the IIFE's `})();` plus the blank line after it, while keeping the `</script>` that closes that block and the following `<script>` tag that starts the next block — net effect: the entire Logo Animation IIFE is gone, the two `<script>` tags around it remain untouched.)

- [ ] **Step 2: Verify removal**

```bash
grep -n "Logo Animation" amora-landing-v2.html
```

Expected: no output (no matches).

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('amora-landing-v2.html', 'utf8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
matches.forEach((m, i) => { try { new Function(m[1]); } catch(e) { console.log('Script', i, 'ERROR:', e.message); process.exitCode = 1; } });
console.log('checked', matches.length, 'script blocks');
"
```

Expected: `checked N script blocks` with no `ERROR` lines (N is whatever the current count is — just confirm no errors printed).

- [ ] **Step 3: Remove it from `privasi.html`**

Run: `grep -n "Logo Animation" privasi.html` — expected one match around line 178.

Read lines 175-212 to confirm the exact block (it's the last piece of code inside a `<script>` tag that also contains scroll-reveal and accordion-building logic earlier — only the IIFE itself is removed, not the enclosing `<script>` tag).

Using the Edit tool, replace:

```html
  // ── Logo Animation ──
  (function(){
    var la=document.querySelector('.logo-anim');
    if(!la)return;
    var fp=la.querySelectorAll('.fill-layer path');
    var sp=la.querySelectorAll('.stroke-layer path');
    var sl=la.querySelector('.stroke-layer');
    var groups=[[0,1,2],[3],[4],[5],[6,7],[8],[9]];
    var gd=[0,.15,.30,.45,.58,.72,.86];
    function setupStroke(){sp.forEach(function(p){var l=p.getTotalLength();p.style.strokeDasharray=l;p.style.strokeDashoffset=l})}
    function playOutline(){
      sl.style.opacity='1';sl.style.animation='none';
      sp.forEach(function(p){p.style.transition='none'});
      void la.offsetWidth;
      setupStroke();sp.forEach(function(p){p.style.strokeOpacity='1'});
      void la.offsetWidth;
      sl.style.animation='strokeGlow 3.2s cubic-bezier(.16,1,.3,1) forwards';
      groups.forEach(function(g,gi){var d=gd[gi];g.forEach(function(i){
        sp[i].style.transition='stroke-dashoffset 1s cubic-bezier(.22,1,.36,1) '+d+'s,stroke-opacity .5s ease '+(d+1.8)+'s';
        sp[i].style.strokeDashoffset='0';sp[i].style.strokeOpacity='0';
      })});
    }
    setupStroke();
    setTimeout(function(){
      groups.forEach(function(g,gi){var d=gd[gi];g.forEach(function(i){
        fp[i].style.transition='opacity .55s cubic-bezier(.16,1,.3,1) '+d+'s,filter .6s cubic-bezier(.16,1,.3,1) '+d+'s';
        fp[i].style.opacity='1';fp[i].style.filter='blur(0)';
      })});
      playOutline();
    },60);
    setInterval(playOutline,4200);
  })();
</script>
</body>
</html>
```

with:

```html
</script>
</body>
</html>
```

- [ ] **Step 4: Remove it from `syarat.html`**

Run: `grep -n "Logo Animation" syarat.html` — expected one match around line 232. The block is byte-for-byte identical to the one just removed from `privasi.html` (confirmed during spec investigation). Read lines 229-267 to confirm, then apply the same replacement as Step 3 (replace the `// ── Logo Animation ──` comment through `})();` with nothing, keeping `</script></body></html>` intact).

- [ ] **Step 5: Verify removal on both files**

```bash
grep -n "Logo Animation" privasi.html syarat.html
```

Expected: no output.

```bash
node -e "
const fs = require('fs');
['privasi.html', 'syarat.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  matches.forEach((m, i) => { try { new Function(m[1]); } catch(e) { console.log(file, 'script', i, 'ERROR:', e.message); process.exitCode = 1; } });
  console.log(file, 'checked', matches.length, 'script blocks');
});
"
```

Expected: both files print their `checked N script blocks` line with no `ERROR`.

- [ ] **Step 6: Commit**

```bash
git add amora-landing-v2.html privasi.html syarat.html
git commit -m "refactor: remove duplicated logo animation now centralized in site-chrome.js"
```

---

### Task 3: Add top clearance to the registration page so it doesn't sit under the fixed nav

**Files:**
- Modify: `vip-merchant-registration/index.html`

- [ ] **Step 1: Fix desktop padding**

Current (around line 65-74):

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

Replace with:

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

- [ ] **Step 2: Fix mobile padding**

Current (around line 458-464):

```css
  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
      gap: 36px;
      padding: 40px 24px;
      min-height: auto;
    }
```

Replace with:

```css
  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
      gap: 36px;
      padding: 100px 24px 40px;
      min-height: auto;
    }
```

- [ ] **Step 3: Verify CSS is still balanced**

```bash
python3 -c "
content = open('vip-merchant-registration/index.html').read()
print('open:', content.count('{'), 'close:', content.count('}'))
"
```

Expected: `open` and `close` counts equal.

- [ ] **Step 4: Commit**

```bash
git add vip-merchant-registration/index.html
git commit -m "fix: add top clearance so fixed nav doesn't overlap registration page banner"
```

---

### Task 4: Visual verification across all four pages

**Files:** none (verification only)

- [ ] **Step 1: Serve the site locally**

```bash
cd "/Users/ryantika/Documents/amora.id/Web/Landing Page 2" && python3 -m http.server 8123
```

- [ ] **Step 2: Screenshot the registration page nav with headless Chrome**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --window-size=900,200 --screenshot=/tmp/vip-nav-fixed.png --force-device-scale-factor=2 \
  "http://localhost:8123/vip-merchant-registration/index.html"
```

Open `/tmp/vip-nav-fixed.png` and confirm:
- The "amora" logo shows its solid white fill (not just a thin green outline).
- The "Founding Merchant — 30 Slot" badge starts clearly below the nav bar, no overlap.

- [ ] **Step 3: Screenshot the homepage nav to confirm no regression**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --window-size=900,200 --screenshot=/tmp/home-nav-fixed.png --force-device-scale-factor=2 \
  "http://localhost:8123/amora-landing-v2.html"
```

Open `/tmp/home-nav-fixed.png` and confirm the logo still renders identically to before (solid fill + green outline), since the animation now comes from `site-chrome.js` instead of the page's own inline script.

- [ ] **Step 4: Confirm privasi.html and syarat.html logos still animate**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --window-size=900,200 --screenshot=/tmp/privasi-nav-fixed.png --force-device-scale-factor=2 \
  "http://localhost:8123/privasi.html"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --window-size=900,200 --screenshot=/tmp/syarat-nav-fixed.png --force-device-scale-factor=2 \
  "http://localhost:8123/syarat.html"
```

Open both screenshots and confirm the logo renders with its solid fill on each.

- [ ] **Step 5: Stop the server**

Press `Ctrl+C` in the terminal running the Python server.

---

## Spec Coverage Check

- Move Logo Animation into `site-chrome.js`, called after nav mount → Task 1 ✓
- Remove duplicated copies from all three pages → Task 2 ✓
- Add top clearance to `.split` (desktop + mobile) → Task 3 ✓
- Verify logo fill renders and no nav overlap on registration page → Task 4 Step 2 ✓
- Verify no regression on homepage/legal pages → Task 4 Steps 3-4 ✓