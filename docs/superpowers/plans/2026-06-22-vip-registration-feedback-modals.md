# VIP Registration Feedback Modals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the VIP Merchant registration form's inline success/error page-state swap with proper modal overlays, so submission feedback is visually clearer and the form data isn't lost on error.

**Architecture:** This is a static HTML/CSS/JS page with no build step and no test framework. Verification means: grep-check each edit landed, run a Node syntax check on the inline `<script>` block, then load the page in headless Chrome and screenshot/inspect both modal states.

**Tech Stack:** Plain HTML5, CSS3, vanilla JS (no frameworks).

---

### Task 1: Add modal CSS

**Files:**
- Modify: `vip-merchant-registration/index.html`

- [ ] **Step 1: Insert `.modal-overlay`/`.modal-card` rules after `.error-box`**

Current content at lines 400-411:

```css
  .error-box {
    text-align: left;
    font-size: 0.875rem;
    color: var(--text);
    background: var(--danger-dim);
    border: 1px solid rgba(224, 88, 79, 0.35);
    border-radius: var(--r-md);
    padding: 14px 16px;
    margin-bottom: 20px;
  }

  [hidden] { display: none !important; }
```

Replace with:

```css
  .error-box {
    text-align: left;
    font-size: 0.875rem;
    color: var(--text);
    background: var(--danger-dim);
    border: 1px solid rgba(224, 88, 79, 0.35);
    border-radius: var(--r-md);
    padding: 14px 16px;
    margin-bottom: 20px;
  }

  /* ── Feedback modals (success / error) ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    animation: modalFadeIn 0.2s ease;
  }

  .modal-card {
    max-width: 420px;
    width: 100%;
    text-align: center;
    padding: 36px 32px;
    border-radius: var(--r-2xl);
    background: var(--card);
    border: 1px solid var(--border-mid);
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04);
    animation: modalPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalPopIn {
    from { opacity: 0; transform: scale(0.94) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  [hidden] { display: none !important; }
```

- [ ] **Step 2: Verify the edit landed**

Run: `grep -n "modal-overlay\|modal-card\|modalFadeIn\|modalPopIn" "vip-merchant-registration/index.html"`

Expected: matches for `.modal-overlay` (definition), `.modal-card` (definition), and both `@keyframes` names — at least 4 lines of output.

- [ ] **Step 3: Verify CSS is still balanced**

Run: `python3 -c "content = open('vip-merchant-registration/index.html').read(); print('open:', content.count('{'), 'close:', content.count('}'))"`

Expected: `open` and `close` counts equal.

- [ ] **Step 4: Commit**

```bash
git add vip-merchant-registration/index.html
git commit -m "feat: add modal overlay CSS for registration feedback"
```

---

### Task 2: Replace inline success/error cards with modal markup + add submitted-state card

**Files:**
- Modify: `vip-merchant-registration/index.html`

- [ ] **Step 1: Replace the SUCCESS VIEW and ERROR VIEW blocks**

Current content at lines 550-579 (inside `.form-col`, siblings of `regForm` and `fullCard`):

```html
      <!-- SUCCESS VIEW -->
      <div class="card state-card" id="successCard" hidden>
        <div class="state-icon">🌿</div>
        <h2>Pendaftaran Diterima!</h2>
        <p id="successText">Terima kasih sudah mendaftar. Tim kami akan menghubungi kamu segera.</p>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <span>Cek WhatsApp kamu — konfirmasi dalam 1–2 hari kerja</span>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <span>Kalau approved, kamu pilih plan dan akses gratis 3 bulan</span>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <span>Founder akan personally bantu setup toko pertamamu</span>
          </div>
        </div>
      </div>

      <!-- ERROR VIEW -->
      <div class="card state-card" id="errorCard" hidden>
        <div class="state-icon">😕</div>
        <h2>Ups, Ada Kendala Teknis</h2>
        <div class="error-box">
          Ups, ada kendala teknis. Data kamu belum tersimpan. Coba lagi atau hubungi kami via WhatsApp di 0878 3210 1750.
        </div>
        <button type="button" class="btn-primary btn-block" id="retryBtn">Coba Lagi</button>
      </div>
```

Replace with:

```html
      <!-- SUBMITTED STATE — replaces the form permanently after success modal is closed -->
      <div class="card state-card" id="submittedCard" hidden>
        <div class="state-icon">🌿</div>
        <h2>Pendaftaran Terkirim</h2>
        <p>Pendaftaran kamu sudah kami terima dan sedang dalam proses kurasi. Cek WhatsApp kamu dalam 1–2 hari kerja.</p>
      </div>
```

- [ ] **Step 2: Add the two modal overlays as direct children of `<body>`**

Current content at lines 581-585:

```html
    </div>
  </div>
</div>

<div id="site-footer"></div>
```

Replace with:

```html
    </div>
  </div>
</div>

<!-- SUCCESS MODAL -->
<div class="modal-overlay" id="successModal" hidden>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="successModalTitle">
    <div class="state-icon">🌿</div>
    <h2 id="successModalTitle">Pendaftaran Diterima!</h2>
    <p id="successText">Terima kasih sudah mendaftar. Tim kami akan menghubungi kamu segera.</p>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <span>Cek WhatsApp kamu — konfirmasi dalam 1–2 hari kerja</span>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <span>Kalau approved, kamu pilih plan dan akses gratis 3 bulan</span>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <span>Founder akan personally bantu setup toko pertamamu</span>
      </div>
    </div>
    <button type="button" class="btn-primary btn-block" id="successCloseBtn">Tutup</button>
  </div>
</div>

<!-- ERROR MODAL -->
<div class="modal-overlay" id="errorModal" hidden>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="errorModalTitle">
    <div class="state-icon">😕</div>
    <h2 id="errorModalTitle">Ups, Ada Kendala Teknis</h2>
    <div class="error-box">
      Ups, ada kendala teknis. Data kamu belum tersimpan. Coba lagi atau hubungi kami via WhatsApp di 0878 3210 1750.
    </div>
    <button type="button" class="btn-primary btn-block" id="retryBtn">Coba Lagi</button>
  </div>
</div>

<div id="site-footer"></div>
```

- [ ] **Step 3: Verify the edits landed**

Run: `grep -n 'id="successModal"\|id="errorModal"\|id="submittedCard"\|id="successCloseBtn"\|id="successCard"\|id="errorCard"' "vip-merchant-registration/index.html"`

Expected: `successModal`, `errorModal`, `submittedCard`, `successCloseBtn` each appear exactly once. `successCard` and `errorCard` (the old IDs) must NOT appear anywhere — confirms the old inline cards were fully replaced, not duplicated.

- [ ] **Step 4: Verify div balance**

Run: `python3 -c "content = open('vip-merchant-registration/index.html').read(); print('div open:', content.count('<div'), 'close:', content.count('</div>'))"`

Expected: open and close counts equal.

- [ ] **Step 5: Commit**

```bash
git add vip-merchant-registration/index.html
git commit -m "feat: replace inline success/error cards with modal markup"
```

---

### Task 3: Update JS to drive the new modals

**Files:**
- Modify: `vip-merchant-registration/index.html`

- [ ] **Step 1: Update the element references**

Current content at lines 620-624:

```js
  const fullCard = document.getElementById('fullCard');
  const successCard = document.getElementById('successCard');
  const errorCard = document.getElementById('errorCard');
  const successText = document.getElementById('successText');
  const retryBtn = document.getElementById('retryBtn');
```

Replace with:

```js
  const fullCard = document.getElementById('fullCard');
  const successModal = document.getElementById('successModal');
  const errorModal = document.getElementById('errorModal');
  const successText = document.getElementById('successText');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const retryBtn = document.getElementById('retryBtn');
  const submittedCard = document.getElementById('submittedCard');
```

- [ ] **Step 2: Update `showSuccess`, `showError`, the submit handler, and `retryBtn`'s click handler**

Current content (find via `grep -n "function showSuccess\|function showError\|retryBtn.addEventListener" vip-merchant-registration/index.html` — should be around lines 732-781):

```js
  function showSuccess(namaToko) {
    form.hidden = true;
    errorCard.hidden = true;
    successText.textContent = 'Terima kasih, ' + namaToko + '! Pendaftaran kamu sudah kami terima.';
    successCard.hidden = false;
  }

  function showError() {
    errorCard.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    errorCard.hidden = true;

    const payload = {
      namaToko: namaTokoInput.value.trim(),
      email: emailInput.value.trim(),
      whatsapp: '+62' + waInput.value.replace(/\D/g, ''),
      linkMarketplace: normalizeLink(linkInput.value)
    };

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // hindari CORS preflight di Apps Script
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === 'success') {
          showSuccess(payload.namaToko);
        } else {
          showError();
        }
      })
      .catch(() => {
        setLoading(false);
        showError();
      });
  });

  retryBtn.addEventListener('click', () => {
    errorCard.hidden = true;
    setLoading(false);
  });
```

Replace with:

```js
  function showSuccess(namaToko) {
    successText.textContent = 'Terima kasih, ' + namaToko + '! Pendaftaran kamu sudah kami terima.';
    successModal.hidden = false;
    successCloseBtn.focus();
  }

  function showError() {
    errorModal.hidden = false;
    retryBtn.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    errorModal.hidden = true;

    const payload = {
      namaToko: namaTokoInput.value.trim(),
      email: emailInput.value.trim(),
      whatsapp: '+62' + waInput.value.replace(/\D/g, ''),
      linkMarketplace: normalizeLink(linkInput.value)
    };

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // hindari CORS preflight di Apps Script
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === 'success') {
          showSuccess(payload.namaToko);
        } else {
          showError();
        }
      })
      .catch(() => {
        setLoading(false);
        showError();
      });
  });

  successCloseBtn.addEventListener('click', () => {
    successModal.hidden = true;
    form.hidden = true;
    submittedCard.hidden = false;
  });

  retryBtn.addEventListener('click', () => {
    errorModal.hidden = true;
    setLoading(false);
  });
```

- [ ] **Step 3: Verify the old identifiers are gone and script still parses**

Run: `grep -n "successCard\|errorCard\.hidden" "vip-merchant-registration/index.html"`

Expected: no output (no matches — confirms every reference to the old `successCard`/`errorCard` IDs was updated).

Run:
```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('vip-merchant-registration/index.html', 'utf8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
matches.forEach((m, i) => { try { new Function(m[1]); } catch(e) { console.log('Script', i, 'ERROR:', e.message); process.exitCode = 1; } });
console.log('checked', matches.length, 'script blocks');
"
```

Expected: `checked 2 script blocks` with no `ERROR` line.

- [ ] **Step 4: Commit**

```bash
git add vip-merchant-registration/index.html
git commit -m "feat: wire success/error modals into submit flow"
```

---

### Task 4: Visual verification

**Files:** none (verification only)

- [ ] **Step 1: Serve the site locally**

```bash
cd "/Users/ryantika/Documents/amora.id/Web/Landing Page 2" && python3 -m http.server 8123
```

- [ ] **Step 2: Confirm both modals start hidden by default**

```bash
grep -n 'id="successModal" hidden\|id="errorModal" hidden' vip-merchant-registration/index.html
```

Expected: two matches — confirms both modals are closed on initial page load.

- [ ] **Step 3: Render an isolated fixture to visually verify the modal styling**

Since opening the real page's modal requires clicking through form submission (which itself requires a live `APPS_SCRIPT_URL`, not available in this environment), verify the modal's visual appearance in isolation instead. Create a throwaway fixture that reuses the actual page's CSS and a copy of the success modal markup with `hidden` removed:

```bash
cat > /tmp/modal-fixture.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="http://localhost:8123/assets/css/design-system.css">
</head>
<body style="background:#09090E;">
EOF
python3 -c "
import re
html = open('vip-merchant-registration/index.html').read()
style = re.search(r'<style>([\s\S]*?)</style>', html).group(1)
print('<style>' + style + '</style>')
" >> /tmp/modal-fixture.html
python3 -c "
import re
html = open('vip-merchant-registration/index.html').read()
modal = re.search(r'<!-- SUCCESS MODAL -->([\s\S]*?)</div>\s*</div>\s*\n\n<!-- ERROR MODAL -->', html).group(1)
print(modal.replace('hidden', '').replace('<div class=\"modal-overlay\"', '<div class=\"modal-overlay\"') + '</div></div>')
" >> /tmp/modal-fixture.html
echo "</body></html>" >> /tmp/modal-fixture.html

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --window-size=900,800 --screenshot=/tmp/vip-success-modal.png \
  "file:///tmp/modal-fixture.html"
```

(Reuses the server already running on port 8123 from Step 1 — only the `design-system.css` `<link>` needs it, the fixture HTML itself loads via `file://`. Do not start a second server on the same port.)

Open `/tmp/vip-success-modal.png` and confirm:
- A dark, elevated card is centered on a dimmed/blurred backdrop.
- The 🌿 icon, "Pendaftaran Diterima!" heading, body text, the 3 numbered steps, and the "Tutup" button all render correctly inside the card.
- The card has visible rounded corners and a strong drop shadow distinguishing it from the backdrop.

If the extraction script produces malformed output (e.g. the regex doesn't cleanly capture the modal block), open `vip-merchant-registration/index.html` directly in a browser instead, temporarily remove the `hidden` attribute from `#successModal` using browser devtools, take a screenshot, then refresh the page (devtools changes aren't saved to the file).

- [ ] **Step 4: Confirm the real page still loads with no errors**

```bash
python3 -c "
import urllib.request
r = urllib.request.urlopen('http://localhost:8123/vip-merchant-registration/index.html')
print(r.status)
"
```

Expected: `200`. (The server started in Step 1 is still running — Step 3 started and killed its own separate temporary server instance for the fixture, so this one is unaffected.)

- [ ] **Step 5: Confirm CSS/JS balance one more time on the final file**

```bash
python3 -c "
content = open('vip-merchant-registration/index.html').read()
print('div:', content.count('<div'), content.count('</div>'))
print('braces:', content.count('{'), content.count('}'))
"
```

Expected: both pairs equal.

- [ ] **Step 6: Stop the server**

Press `Ctrl+C` in the terminal running the Python server from Step 1.

---

## Spec Coverage Check

- Modal CSS (`.modal-overlay`, `.modal-card`, entrance animation) → Task 1 ✓
- Success/error markup moved into `role="dialog"` modal overlays as direct children of `<body>` → Task 2 ✓
- `submittedCard` persistent confirmation block added → Task 2 ✓
- `fullCard` (Slot Penuh) left untouched → not modified by any task ✓
- `showSuccess`/`showError` updated to target modals instead of inline cards → Task 3 ✓
- Error modal does not hide the form (form stays filled behind it) → Task 3 (`showError` never sets `form.hidden`) ✓
- Success modal close (`successCloseBtn`) permanently swaps form → `submittedCard` → Task 3 ✓
- No backdrop-click or Escape-key dismissal added → not implemented in any task (intentional) ✓
- Basic focus-on-open accessibility (`.focus()` on primary button) → Task 3 ✓
