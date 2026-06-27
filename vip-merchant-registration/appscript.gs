/**
 * Amora.id — VIP Merchant Registration
 * Google Apps Script Web App backend.
 *
 * Deploy as Web App (Execute as: Me, Who has access: Anyone).
 * See README.md in this folder for full step-by-step deploy instructions.
 */

var HEADERS = ['Timestamp', 'Nama Toko', 'Email', 'WhatsApp', 'Link Marketplace', 'Status', 'Catatan Amora'];

// reCAPTCHA v3 secret key — lihat README.md untuk cara dapatkan ini di google.com/recaptcha
var RECAPTCHA_SECRET = '6Lc6OzgtAAAAAPeA7MglaMxDRh__zDG8RyUP3pVv';
var RECAPTCHA_MIN_SCORE = 0.5;

var MAX_FIELD_LENGTH = 200;
var MIN_FILL_TIME_MS = 3000;

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var WHATSAPP_RE = /^\+62\d{8,15}$/;
var LINK_RE = /^https?:\/\//i;

/**
 * GET — used by the registration page on load to compute remaining slots.
 * Returns: { status: 'success', count: <number of registered rows> }
 */
function doGet(e) {
  try {
    var sheet = getSheet_();
    ensureHeader_(sheet);

    var lastRow = sheet.getLastRow();
    var count = Math.max(lastRow - 1, 0); // minus header row

    return jsonResponse_({ status: 'success', count: count });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.message });
  }
}

/**
 * POST — receives form submissions as JSON and appends a row.
 * Expected payload: { namaToko, email, whatsapp, linkMarketplace }
 * Returns: { status: 'success' } or { status: 'error', message }
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ status: 'error', message: 'Tidak ada data terkirim.' });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot — field tersembunyi yang harus selalu kosong untuk manusia.
    // Bot yang mengisi semua field biasanya juga mengisi ini. Balas "success" palsu
    // supaya bot tidak tahu submission-nya ditolak, tapi jangan simpan apa pun.
    var honeypot = (data.website || '').toString().trim();
    if (honeypot) {
      return jsonResponse_({ status: 'success' });
    }

    // Submit instan (di bawah 3 detik sejak form dirender) bukan perilaku manusia.
    var elapsedMs = Number(data.elapsedMs) || 0;
    if (elapsedMs < MIN_FILL_TIME_MS) {
      return jsonResponse_({ status: 'error', message: 'Pendaftaran ditolak. Coba lagi.' });
    }

    var recaptchaCheck = verifyRecaptcha_(data.recaptchaToken);
    if (!recaptchaCheck.ok) {
      return jsonResponse_({ status: 'error', message: 'Verifikasi keamanan gagal. Coba lagi.' });
    }

    var namaToko = (data.namaToko || '').toString().trim();
    var email = (data.email || '').toString().trim();
    var whatsapp = (data.whatsapp || '').toString().trim();
    var linkMarketplace = (data.linkMarketplace || '').toString().trim();

    if (!namaToko || !email || !whatsapp || !linkMarketplace) {
      return jsonResponse_({ status: 'error', message: 'Data tidak lengkap.' });
    }

    if (namaToko.length > MAX_FIELD_LENGTH || linkMarketplace.length > MAX_FIELD_LENGTH) {
      return jsonResponse_({ status: 'error', message: 'Data terlalu panjang.' });
    }

    if (!EMAIL_RE.test(email)) {
      return jsonResponse_({ status: 'error', message: 'Email tidak valid.' });
    }

    if (!WHATSAPP_RE.test(whatsapp)) {
      return jsonResponse_({ status: 'error', message: 'Nomor WhatsApp tidak valid.' });
    }

    if (!LINK_RE.test(linkMarketplace)) {
      return jsonResponse_({ status: 'error', message: 'Link toko tidak valid.' });
    }

    var sheet = getSheet_();
    ensureHeader_(sheet);

    if (isDuplicate_(sheet, email, whatsapp)) {
      return jsonResponse_({ status: 'error', message: 'Email atau nomor WhatsApp ini sudah terdaftar.' });
    }

    // Status default "Pending Review"; "Catatan Amora" dikosongkan untuk diisi manual oleh tim Amora.
    sheet.appendRow([
      new Date(),
      namaToko,
      email,
      whatsapp,
      linkMarketplace,
      'Pending Review',
      ''
    ]);

    return jsonResponse_({ status: 'success' });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.message });
  }
}

/**
 * Verifies a reCAPTCHA v3 token against Google's siteverify endpoint.
 * If RECAPTCHA_SECRET hasn't been configured yet, skips verification
 * (so the form keeps working before deploy step 5 in README.md is done).
 */
function verifyRecaptcha_(token) {
  if (!RECAPTCHA_SECRET || RECAPTCHA_SECRET.indexOf('[REPLACE') === 0) {
    return { ok: true };
  }

  if (!token) {
    return { ok: false };
  }

  try {
    var response = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: { secret: RECAPTCHA_SECRET, response: token }
    });
    var result = JSON.parse(response.getContentText());
    return { ok: !!result.success && (typeof result.score !== 'number' || result.score >= RECAPTCHA_MIN_SCORE) };
  } catch (err) {
    return { ok: false };
  }
}

/**
 * Checks existing rows for a matching email or WhatsApp number (normalized).
 */
function isDuplicate_(sheet, email, whatsapp) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false; // hanya header, atau kosong

  var rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues(); // Timestamp, Nama Toko, Email, WhatsApp
  var normalizedEmail = email.toLowerCase().trim();
  var normalizedWhatsapp = whatsapp.replace(/\D/g, '');

  for (var i = 0; i < rows.length; i++) {
    var existingEmail = (rows[i][2] || '').toString().toLowerCase().trim();
    var existingWhatsapp = (rows[i][3] || '').toString().replace(/\D/g, '');
    if (existingEmail === normalizedEmail || existingWhatsapp === normalizedWhatsapp) {
      return true;
    }
  }
  return false;
}

function getSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
}

function jsonResponse_(obj) {
  // Apps Script Web Apps deployed with "Anyone" access automatically include
  // Access-Control-Allow-Origin: * on the actual response for simple requests
  // (no custom headers / text-plain content type), so no manual CORS header
  // is needed here — and ContentService's TextOutput has no setHeader API.
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
