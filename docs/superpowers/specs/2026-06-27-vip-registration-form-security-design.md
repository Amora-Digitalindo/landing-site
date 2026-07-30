# VIP Merchant Registration Form — Bot/Abuse Protection

**Status:** Approved
**Scope:** `vip-merchant-registration/index.html` + `vip-merchant-registration/appscript.gs`

> **2026-07-30 update:** the frontend described below was later merged into the `#vip-program`
> section of the root `index.html` (see the VIP-prefixed IDs/classes there); the protections and
> backend contract documented here are unchanged. `appscript.gs` still lives in
> `vip-merchant-registration/`.

## Problem

The VIP merchant registration form POSTs JSON directly to a public Google Apps Script Web App
(`Who has access: Anyone`). There is currently no bot or abuse protection:

- Any script can POST arbitrary payloads — no CAPTCHA, no honeypot, no rate limiting.
- `doPost` only checks that fields are non-empty; no format validation, no length caps.
- Duplicate submissions (same email/WhatsApp) are appended as new rows with no dedup.
- Slot count (`doGet` → `count`) is just `lastRow - 1`, so spam rows directly inflate the
  "VIP slots remaining" indicator shown to real users and can falsely trigger the "slots full" state.

## Goals

- Block scripted/bot submissions without adding friction for real merchants (no visible
  challenge on the happy path).
- Reject duplicate registrations (same email or WhatsApp) server-side.
- Validate and cap submitted data server-side so junk/oversized payloads can't reach the sheet.
- Stay within project constraints: plain HTML/CSS/vanilla JS on the frontend (no build step,
  no package manager), Google Apps Script on the backend.

## Non-goals

- IP-based rate limiting — Apps Script's `doPost(e)` does not expose the caller's IP, so this
  is not achievable server-side. Rate limiting here is keyed on submitted email/WhatsApp instead.
- Visible CAPTCHA challenges (e.g. checkbox "I'm not a robot") — out of scope per chosen friction
  level (invisible-only).
- Persistent backend/database changes — Google Sheets remains the system of record.

## Design

### 1. reCAPTCHA v3 (primary defense)

**Client (`index.html`):**
- Add `<script src="https://www.google.com/recaptcha/api.js?render=SITE_KEY"></script>` to `<head>`.
- On form submit, before building the payload, call
  `grecaptcha.execute(SITE_KEY, {action: 'vip_register'})` to get a token (returns a Promise).
- Include the token as `recaptchaToken` in the POST payload.
- If `grecaptcha` fails to load or `execute` rejects, fail closed: show the existing error modal
  rather than silently submitting without a token (an attacker could otherwise block the
  reCAPTCHA script to bypass this layer entirely).

**Server (`appscript.gs`):**
- Add a `RECAPTCHA_SECRET` constant (placeholder, documented in README like `APPS_SCRIPT_URL`).
- In `doPost`, before validating other fields, call
  `UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'post', payload: { secret: RECAPTCHA_SECRET, response: data.recaptchaToken } })`.
- Parse the JSON response; reject (return `{status: 'error', message: '...'}`, do not append row)
  if `success !== true` or `score < 0.5`.

### 2. Honeypot field (secondary defense, catches non-JS-aware bots)

**Client:**
- Add a hidden input inside `#regForm`, e.g. `<input type="text" id="website" name="website" autocomplete="off" tabindex="-1">`.
- Hide it via CSS using `position: absolute; left: -9999px; opacity: 0; pointer-events: none;`
  (not `display:none` or `hidden`, which some scrapers explicitly skip) and mark it
  `aria-hidden="true"` so screen readers skip it.
- Include its value (should always be empty for humans) in the POST payload as `honeypot`.

**Server:**
- In `doPost`, if `data.honeypot` is non-empty, return `{status: 'success'}` (so the bot doesn't
  learn it was caught) but skip `appendRow` entirely.

### 3. Minimum fill-time check

**Client:**
- Record `const formRenderedAt = Date.now();` when the script runs (page load).
- On submit, compute `elapsedMs = Date.now() - formRenderedAt` and include it in the payload as
  `elapsedMs`.

**Server:**
- In `doPost`, reject (no append) if `elapsedMs < 3000` (3 seconds) — instant submissions are
  not human. This is a server-side check because a client-only check is trivially bypassed by
  calling the endpoint directly.

### 4. Server-side validation & limits

In `doPost`, extend the existing non-empty checks to:
- `email` must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `whatsapp` must match `/^\+62\d{8,15}$/`.
- `namaToko` and `linkMarketplace` capped at a reasonable max length (e.g. 200 chars) — reject
  (don't truncate) if exceeded, since oversized input indicates abuse rather than a legit typo.
- `linkMarketplace` must start with `http://` or `https://` (already normalized client-side, but
  the server should not trust the client).

### 5. Duplicate rejection

In `doPost`, before `ensureHeader_`/`appendRow`:
- Read all existing rows once (`sheet.getDataRange().getValues()`).
- Normalize incoming `email` (lowercase, trim) and `whatsapp` (digits only) and compare against
  existing rows' Email/WhatsApp columns (same normalization).
- If either matches an existing row, return
  `{status: 'error', message: 'Email atau nomor WhatsApp ini sudah terdaftar.'}` and do not append.

### Error handling

- All new rejection paths return the existing `{status: 'error', message}` shape, so the
  frontend's existing `showError()` modal handles them without changes — except the duplicate
  case, which should show a more specific message. The error modal's text is currently a fixed
  string in `index.html`; switch `errorModalTitle`/`.error-box` content to use `data.message`
  from the response when present, falling back to the current generic "kendala teknis" text.
- Honeypot-triggered rejections deliberately return `success` to avoid signaling detection to bots.

### Config additions

- `index.html`: new `RECAPTCHA_SITE_KEY` constant alongside the existing `APPS_SCRIPT_URL` constant.
- `appscript.gs`: new `RECAPTCHA_SECRET` constant.
- `README.md`: add a step for registering the site at google.com/recaptcha (v3, score-based) and
  pasting in both keys, alongside the existing Apps Script deploy steps.

## Testing

No automated test suite exists for this project (per `CLAUDE.md`). Verification is manual:
- Submit the form normally (fast network, real browser) → succeeds, row appended, slot count updates.
- Submit with the honeypot field force-filled via devtools → silently rejected, no row appended.
- Submit immediately on page load via a scripted `fetch()` directly to the Apps Script URL
  (bypassing the page/JS entirely) → rejected for missing/invalid `recaptchaToken`.
- Submit the same email twice → second attempt returns the duplicate error message.
- Submit with an invalid email/WhatsApp format → client-side validation catches it first; bypass
  client validation via direct `fetch()` → server-side validation still rejects it.
