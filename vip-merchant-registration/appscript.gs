/**
 * Amora.id — Founding Merchant Registration
 * Google Apps Script Web App backend.
 *
 * Deploy as Web App (Execute as: Me, Who has access: Anyone).
 * See README.md in this folder for full step-by-step deploy instructions.
 */

var HEADERS = ['Timestamp', 'Nama Toko', 'WhatsApp', 'Link Marketplace', 'Status', 'Catatan Amora'];

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
 * Expected payload: { namaToko, whatsapp, linkMarketplace }
 * Returns: { status: 'success' } or { status: 'error', message }
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ status: 'error', message: 'Tidak ada data terkirim.' });
    }

    var data = JSON.parse(e.postData.contents);

    var namaToko = (data.namaToko || '').toString().trim();
    var whatsapp = (data.whatsapp || '').toString().trim();
    var linkMarketplace = (data.linkMarketplace || '').toString().trim();

    if (!namaToko || !whatsapp || !linkMarketplace) {
      return jsonResponse_({ status: 'error', message: 'Data tidak lengkap.' });
    }

    var sheet = getSheet_();
    ensureHeader_(sheet);

    // Status default "Pending Review"; "Catatan Amora" dikosongkan untuk diisi manual oleh tim Amora.
    sheet.appendRow([
      new Date(),
      namaToko,
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
