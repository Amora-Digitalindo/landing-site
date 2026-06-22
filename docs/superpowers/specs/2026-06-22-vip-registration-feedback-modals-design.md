# VIP Registration Success/Error Feedback Modals — Design Spec

Date: 2026-06-22
Target file: `vip-merchant-registration/index.html`

## Goal

Replace the current inline success/error "page state swap" with proper modal overlays for more professional, visually clear submission feedback. The form stays usable/intact behind the error modal; success permanently replaces the form with a confirmation block once dismissed.

## Current state (being replaced)

`successCard` and `errorCard` are plain `.card.state-card` siblings of the form inside `.form-col`, toggled via the `hidden` attribute:
- `showSuccess()`: sets `form.hidden = true`, fills in `successText`, shows `successCard`.
- `showError()`: shows `errorCard` — but does **not** hide the form, so the error message currently renders stacked below the still-visible form rather than as a focused overlay.
- Both are visually identical to the inline page card style (no backdrop, no elevation, no entrance animation).

## New structure

### Markup

Two new modal overlays added as direct children of `<body>`, replacing the current in-flow `successCard`/`errorCard` (their content is preserved, just re-parented and restyled):

```html
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
```

A new element replaces the form on success close:

```html
<div class="card state-card" id="submittedCard" hidden>
  <div class="state-icon">🌿</div>
  <h2>Pendaftaran Terkirim</h2>
  <p>Pendaftaran kamu sudah kami terima dan sedang dalam proses kurasi. Cek WhatsApp kamu dalam 1–2 hari kerja.</p>
</div>
```

The existing `fullCard` (Slot Penuh) stays exactly as-is, untouched, still inline in `.form-col`.

### CSS

```css
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
```

`.state-icon`, `h2`, `p`, `.steps`/`.step`/`.step-num`, `.error-box` rules already exist and are reused as-is inside `.modal-card` (same class names, just nested in the new container instead of `.card.state-card`).

### Behavior (JS changes)

- `showSuccess(namaToko)`: sets `successText`, shows `successModal` (`hidden = false`). Does **not** hide the form yet — that happens on modal close.
- `successCloseBtn` click handler: hides `successModal`, hides `form`, shows `submittedCard`. This is the only path that permanently swaps the form out — closing the modal is what commits the "submitted" state.
- `showError()`: shows `errorModal`. Form is never hidden by this function (already the case today) — now made intentional/correct since the modal visually overlays it via the fixed backdrop instead of stacking inline.
- `retryBtn` click handler (existing): hides `errorModal` instead of `errorCard`. Form remains filled and interactive underneath, unchanged.
- No backdrop-click or Escape-key listener is added — `.modal-overlay` has no click handler, and no `keydown` listener is added for `Escape`. Dismissal is button-only by design.
- Focus management: when each modal opens, call `.focus()` on its primary button (`successCloseBtn` / `retryBtn`) for basic keyboard accessibility (so Enter/Space immediately works without requiring a mouse).

## Out of scope

- `fullCard` (Slot Penuh) stays an inline page state, not a modal — it's shown on page load before any submission, not a submit-time result.
- No focus trap (cycling Tab within the modal) — basic initial-focus-on-open is sufficient for this scope; a full trap would require additional keydown handling not requested.
- No changes to the Apps Script backend or validation logic — purely a presentation-layer change to how success/error are displayed.
