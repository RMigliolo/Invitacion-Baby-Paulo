/*
  BACKEND OPCIONAL PARA REGISTRAR CONFIRMACIONES EN GOOGLE SHEETS

  1. Crea una hoja de cálculo y abre Extensiones > Apps Script.
  2. Pega este código.
  3. Implementar > Nueva implementación > Aplicación web.
  4. Ejecutar como: tú. Acceso: cualquier persona.
  5. Copia la URL /exec en CONFIG.sheetsEndpoint dentro de script.js.
*/

const SHEET_NAME = "Confirmaciones";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const sheet = getConfirmationSheet_();

    sheet.appendRow([
      new Date(),
      clean_(data.nombre),
      clean_(data.asistencia),
      clean_(data.adultos),
      clean_(data.prediccion),
      clean_(data.mensaje),
      clean_(data.evento)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getConfirmationSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Fecha y hora",
      "Nombre",
      "Asistencia",
      "Número de adultos",
      "Predicción",
      "Mensaje",
      "Evento"
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
  }

  return sheet;
}

function clean_(value) {
  const text = String(value == null ? "" : value).trim();
  // Evita que una respuesta se interprete como fórmula en Sheets.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
