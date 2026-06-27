/**
 * Amora.id — VIP Merchant Registration
 * Google Apps Script Web App backend.
 *
 * Deploy as Web App (Execute as: Me, Who has access: Anyone).
 * See README.md in this folder for full step-by-step deploy instructions.
 */

var HEADERS = [
  "Timestamp",
  "Nama Toko",
  "Email",
  "WhatsApp",
  "Link Marketplace",
  "Status",
  "Catatan Amora",
  "Tidak Eligible",
];

// Number of data rows to pre-format with the "Tidak Eligible" checkbox +
// red highlight when the sheet is first set up.
var CHECKBOX_FORMAT_ROWS = 500;

// reCAPTCHA v3 secret key — lihat README.md untuk cara dapatkan ini di google.com/recaptcha
var RECAPTCHA_SECRET = "YOUR_RECAPTCHA_SECRET_KEY";
var RECAPTCHA_MIN_SCORE = 0.5;

var MAX_FIELD_LENGTH = 200;
var MIN_FILL_TIME_MS = 3000;

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var WHATSAPP_RE = /^\+62\d{8,15}$/;
var LINK_RE = /^https?:\/\//i;

// ── GANTI nilai ini dengan ID Google Sheet kamu ──────────────────
// Cara ambil: buka Google Sheet kamu → lihat URL-nya:
// https://docs.google.com/spreadsheets/d/INI_ADALAH_SHEET_ID/edit
//                                         ^^^^^^^^^^^^^^^^^^^
var SHEET_ID = "1A8sPYCjdUikygf19UNwvKfkw4_5RbFVDh7b00FOa4v0";

/**
 * GET — used by the registration page on load to compute remaining slots.
 * Returns: { status: 'success', count: <number of registered rows> }
 */
function doGet(e) {
  try {
    var sheet = getSheet_();
    ensureHeader_(sheet);

    var lastRow = getLastDataRow_(sheet);
    var count = countEligibleRows_(sheet, lastRow);

    return jsonResponse_({ status: "success", count: count });
  } catch (err) {
    return jsonResponse_({ status: "error", message: err.message });
  }
}

/**
 * Last row containing an actual submission, based on column A (Timestamp) —
 * deliberately NOT sheet.getLastRow(), which also counts rows that only have
 * formatting/validation applied to other columns (e.g. the "Tidak Eligible"
 * checkbox range) and would otherwise inflate the slot count.
 */
function getLastDataRow_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return lastRow;

  var timestamps = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = timestamps.length - 1; i >= 0; i--) {
    if (timestamps[i][0] !== "") return i + 2; // +2: 1-based + header row
  }
  return 1;
}

/**
 * Counts rows that have a real submission (non-blank Timestamp) and don't
 * have the "Tidak Eligible" checkbox checked. Deliberately does NOT assume
 * data rows are contiguous from row 2 to lastRow — leftover blank rows from
 * past data corruption (see repairStaleCheckboxRows) would otherwise be
 * miscounted as either present or absent depending on row gaps.
 */
function countEligibleRows_(sheet, lastRow) {
  if (lastRow < 2) return 0;

  var flagColIndex = HEADERS.indexOf("Tidak Eligible") + 1; // 1-based column number
  var data = sheet.getRange(2, 1, lastRow - 1, flagColIndex).getValues();

  var count = 0;
  for (var i = 0; i < data.length; i++) {
    var hasTimestamp = data[i][0] !== "";
    var flagged = data[i][flagColIndex - 1] === true;
    if (hasTimestamp && !flagged) count++;
  }
  return count;
}

/**
 * POST — receives form submissions as JSON and appends a row.
 * Expected payload: { namaToko, email, whatsapp, linkMarketplace }
 * Returns: { status: 'success' } or { status: 'error', message }
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({
        status: "error",
        message: "Tidak ada data terkirim.",
      });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot — field tersembunyi yang harus selalu kosong untuk manusia.
    var honeypot = (data.website || "").toString().trim();
    if (honeypot) {
      return jsonResponse_({ status: "success" });
    }

    // Submit instan (di bawah 3 detik) bukan perilaku manusia.
    var elapsedMs = Number(data.elapsedMs) || 0;
    if (elapsedMs < MIN_FILL_TIME_MS) {
      return jsonResponse_({
        status: "error",
        message: "Pendaftaran ditolak. Coba lagi.",
      });
    }

    var recaptchaCheck = verifyRecaptcha_(data.recaptchaToken);
    if (!recaptchaCheck.ok) {
      return jsonResponse_({
        status: "error",
        message: "Verifikasi keamanan gagal. Coba lagi.",
      });
    }

    var namaToko = (data.namaToko || "").toString().trim();
    var email = (data.email || "").toString().trim();
    var whatsapp = (data.whatsapp || "").toString().trim();
    var linkMarketplace = (data.linkMarketplace || "").toString().trim();

    if (!namaToko || !email || !whatsapp || !linkMarketplace) {
      return jsonResponse_({ status: "error", message: "Data tidak lengkap." });
    }

    if (
      namaToko.length > MAX_FIELD_LENGTH ||
      linkMarketplace.length > MAX_FIELD_LENGTH
    ) {
      return jsonResponse_({
        status: "error",
        message: "Data terlalu panjang.",
      });
    }

    if (!EMAIL_RE.test(email)) {
      return jsonResponse_({ status: "error", message: "Email tidak valid." });
    }

    if (!WHATSAPP_RE.test(whatsapp)) {
      return jsonResponse_({
        status: "error",
        message: "Nomor WhatsApp tidak valid.",
      });
    }

    if (!LINK_RE.test(linkMarketplace)) {
      return jsonResponse_({
        status: "error",
        message: "Link toko tidak valid.",
      });
    }

    var sheet = getSheet_();
    ensureHeader_(sheet);

    if (isDuplicate_(sheet, email, whatsapp)) {
      return jsonResponse_({
        status: "error",
        message: "Email atau nomor WhatsApp ini sudah terdaftar.",
      });
    }

    sheet.appendRow([
      new Date(),
      namaToko,
      email,
      whatsapp,
      linkMarketplace,
      "Pending Review",
      "",
      false,
    ]);

    return jsonResponse_({ status: "success" });
  } catch (err) {
    return jsonResponse_({ status: "error", message: err.message });
  }
}

/**
 * Verifies a reCAPTCHA v3 token against Google's siteverify endpoint.
 */
function verifyRecaptcha_(token) {
  if (!RECAPTCHA_SECRET || RECAPTCHA_SECRET.indexOf("[REPLACE") === 0) {
    return { ok: true };
  }

  if (!token) {
    return { ok: false };
  }

  try {
    var response = UrlFetchApp.fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "post",
        payload: { secret: RECAPTCHA_SECRET, response: token },
      },
    );
    var result = JSON.parse(response.getContentText());
    return {
      ok:
        !!result.success &&
        (typeof result.score !== "number" ||
          result.score >= RECAPTCHA_MIN_SCORE),
    };
  } catch (err) {
    return { ok: false };
  }
}

/**
 * Checks existing rows for a matching email or WhatsApp number (normalized).
 */
function isDuplicate_(sheet, email, whatsapp) {
  var lastRow = getLastDataRow_(sheet);
  if (lastRow < 2) return false;

  var rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  var normalizedEmail = email.toLowerCase().trim();
  var normalizedWhatsapp = whatsapp.replace(/\D/g, "");

  for (var i = 0; i < rows.length; i++) {
    var existingEmail = (rows[i][2] || "").toString().toLowerCase().trim();
    var existingWhatsapp = (rows[i][3] || "").toString().replace(/\D/g, "");
    if (
      existingEmail === normalizedEmail ||
      existingWhatsapp === normalizedWhatsapp
    ) {
      return true;
    }
  }
  return false;
}

// FIX: pakai openById() bukan getActiveSpreadsheet()
// getActiveSpreadsheet() hanya bekerja kalau script dibuat dari dalam Sheet itu sendiri.
// Karena ini standalone script, harus pakai SHEET_ID secara eksplisit.
function getSheet_() {
  return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    setupNotEligibleColumn_(sheet);
  }
}

/**
 * One-time manual setup for a sheet that already has data (created before the
 * "Tidak Eligible" column existed). Run this once from the Apps Script editor
 * (select this function in the dropdown next to "Run", then click Run).
 * Adds the header + checkbox + red conditional formatting without touching
 * existing rows' other columns.
 */
function setupExistingSheet() {
  var sheet = getSheet_();
  var flagColIndex = HEADERS.indexOf("Tidak Eligible") + 1;

  if (sheet.getRange(1, flagColIndex).getValue() !== "Tidak Eligible") {
    sheet.getRange(1, flagColIndex).setValue("Tidak Eligible");
  }

  setupNotEligibleColumn_(sheet);
}

/**
 * One-time repair for sheets that already ran the old setupExistingSheet,
 * which used insertCheckboxes() and wrote stray FALSE values past the real
 * data rows (inflating sheet.getLastRow() and breaking the slot count). Run
 * this once from the Apps Script editor, then redeploy. Safe to run even if
 * the sheet was never affected — it's a no-op in that case.
 */
/**
 * TEMPORARY DEBUG HELPER — run this directly from the Apps Script editor
 * (select it in the function dropdown, click Run), then check the logged
 * output via View > Logs (or Executions). Delete once the slot count is
 * confirmed correct.
 */
function debugSlotCount() {
  var sheet = getSheet_();
  Logger.log("Sheet name: " + sheet.getName());
  Logger.log("sheet.getLastRow(): " + sheet.getLastRow());
  Logger.log("getLastDataRow_: " + getLastDataRow_(sheet));
  Logger.log("countEligibleRows_: " + countEligibleRows_(sheet, getLastDataRow_(sheet)));
}

/**
 * One-time cleanup: deletes blank rows left over between row 2 and the last
 * real row (leftover gaps from the insertCheckboxes() data-corruption bug).
 * Run once from the Apps Script editor after confirming the slot count is
 * correct. Safe to re-run — it's a no-op once there are no blank gaps left.
 */
function compactBlankRows() {
  var sheet = getSheet_();
  var lastRow = getLastDataRow_(sheet);
  if (lastRow < 2) return;

  var timestamps = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  // Delete from the bottom up so row indices above the deletion point don't shift.
  for (var i = timestamps.length - 1; i >= 0; i--) {
    if (timestamps[i][0] === "") {
      sheet.deleteRow(i + 2);
    }
  }
}

function repairStaleCheckboxRows() {
  var sheet = getSheet_();
  var flagColIndex = HEADERS.indexOf("Tidak Eligible") + 1;
  var realLastRow = getLastDataRow_(sheet);
  var sheetLastRow = sheet.getLastRow();

  if (sheetLastRow > realLastRow) {
    // Clear the phantom values written into rows past the real data.
    sheet
      .getRange(realLastRow + 1, 1, sheetLastRow - realLastRow, sheet.getLastColumn())
      .clearContent();
  }

  // Re-apply validation-only (no stray values) to a fresh range.
  setupNotEligibleColumn_(sheet);
}

/**
 * Turns the "Tidak Eligible" column into a checkbox with conditional
 * formatting — checking it highlights the row's flag cell red.
 *
 * Uses setDataValidation(requireCheckbox()) rather than insertCheckboxes(),
 * because insertCheckboxes() writes a literal FALSE into every blank cell in
 * the range — which would make Sheets think the data extends through row
 * 2+CHECKBOX_FORMAT_ROWS and corrupt getLastRow()-based row counting.
 * Validation-only leaves untouched cells genuinely blank.
 */
function setupNotEligibleColumn_(sheet) {
  var flagColIndex = HEADERS.indexOf("Tidak Eligible") + 1;
  var range = sheet.getRange(2, flagColIndex, CHECKBOX_FORMAT_ROWS, 1);

  range.setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());

  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied("=" + range.getCell(1, 1).getA1Notation() + "=TRUE")
    .setBackground("#E0584F")
    .setFontColor("#FFFFFF")
    .setRanges([range])
    .build();

  // Drop any rule already targeting this column before adding the fresh one,
  // so re-running setup (e.g. via repairStaleCheckboxRows) doesn't stack dupes.
  var rules = sheet.getConditionalFormatRules().filter(function (existing) {
    return !existing.getRanges().some(function (r) {
      return r.getColumn() === flagColIndex;
    });
  });
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
