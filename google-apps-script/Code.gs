/**
 * Saves OunCatalyst website enquiries to this Google Sheet.
 * Paste into the sheet: Extensions > Apps Script. Setup steps are in README.md.
 * @OnlyCurrentDoc
 */
const SHEET_NAME = "Enquiries";
const COLUMNS = [
  ["Submitted at", null], ["Full name", "name"], ["Phone", "phone"], ["Email", "email"],
  ["Degree / Department", "degree"], ["Graduation year", "graduationYear"], ["College", "college"],
  ["Current status", "status"], ["Wants help with", "help"], ["Best day", "availability"],
  ["Contact consent", "contactConsent"], ["UTM source", "utm_source"], ["UTM medium", "utm_medium"],
  ["UTM campaign", "utm_campaign"], ["UTM content", "utm_content"], ["UTM term", "utm_term"]
];
const REQUIRED = ["name", "phone", "email", "degree", "graduationYear", "status", "contactConsent"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return reply({ ok: true }); // hidden field: only bots fill it
    if (REQUIRED.some((key) => !String(data[key] || "").trim())) return reply({ ok: false });

    lock.waitLock(20000);
    const row = COLUMNS.map(([, key]) => (key ? clean(data[key]) : new Date()));
    getSheet().appendRow(row);
    SpreadsheetApp.flush();
    return reply({ ok: true });
  } catch (error) {
    console.error(error);
    return reply({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const file = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = file.getSheetByName(SHEET_NAME) || file.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(([title]) => title));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold").setBackground("#0b1445").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Leading apostrophe stops phone numbers and text being run as formulas
function clean(value) {
  const text = String(value == null ? "" : value).trim().slice(0, 300);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
