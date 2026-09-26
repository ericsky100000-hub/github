const SPREADSHEET_ID = '1mH-5J-yvxPhWANlcfpC3HArjzQMAMH88uaQepx3PYFI';

const SHEETS = {
  settings: '網站設定',
  about: '企業介紹',
  specialty: '專營項目',
  products: '產品',
  categories: '產品分類',
  oem: 'OEM_ODM',
  quality: '品質認證',
  contact: '聯絡資訊',
  history: '版本紀錄',
  admins: '管理員'
};

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'content';
  try {
    if (action === 'content') {
      return json_({ ok: true, data: getSiteContent_() });
    }
    if (action === 'health') {
      return json_({ ok: true, service: 'sunny-baking-cms', spreadsheetId: SPREADSHEET_ID });
    }
    return json_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = body.action || '';

    if (action === 'saveContent') {
      saveSiteContent_(body.data || {});
      addHistory_('儲存草稿', body.user || '', body.note || '');
      return json_({ ok: true });
    }

    if (action === 'publish') {
      saveSiteContent_(body.data || {});
      setKeyValue_(SHEETS.settings, 'publish_status', 'published');
      addHistory_('發布更新', body.user || '', body.note || '');
      return json_({ ok: true, publishedAt: new Date().toISOString() });
    }

    return json_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function getSiteContent_() {
  return {
    home: rowsToObject_(SHEETS.settings),
    about: rowsToObject_(SHEETS.about),
    specialty: getTable_(SHEETS.specialty),
    products: getTable_(SHEETS.products),
    categories: getTable_(SHEETS.categories),
    oem: rowsToObject_(SHEETS.oem),
    quality: getTable_(SHEETS.quality),
    contact: rowsToObject_(SHEETS.contact),
    history: getTable_(SHEETS.history)
  };
}

function saveSiteContent_(data) {
  if (data.home) writeObjectSheet_(SHEETS.settings, data.home, ['說明']);
  if (data.about) writeObjectSheet_(SHEETS.about, data.about);
  if (Array.isArray(data.specialty)) writeTable_(SHEETS.specialty, data.specialty);
  if (Array.isArray(data.products)) writeTable_(SHEETS.products, data.products);
  if (Array.isArray(data.categories)) writeTable_(SHEETS.categories, data.categories);
  if (data.oem) writeObjectSheet_(SHEETS.oem, data.oem);
  if (Array.isArray(data.quality)) writeTable_(SHEETS.quality, data.quality);
  if (data.contact) writeObjectSheet_(SHEETS.contact, data.contact);
}

function rowsToObject_(sheetName) {
  const sh = sheet_(sheetName);
  const values = sh.getDataRange().getValues();
  const out = {};
  for (let i = 1; i < values.length; i++) {
    const key = values[i][0];
    if (key !== '' && key != null) out[String(key)] = values[i][1];
  }
  return out;
}

function getTable_(sheetName) {
  const sh = sheet_(sheetName);
  const values = sh.getDataRange().getValues();
  if (!values.length) return [];
  const headers = values[0].map(String);
  return values.slice(1)
    .filter(r => r.some(v => v !== '' && v != null))
    .map(r => {
      const o = {};
      headers.forEach((h, i) => o[h] = r[i]);
      return o;
    });
}

function writeObjectSheet_(sheetName, obj, extraHeaders) {
  const sh = sheet_(sheetName);
  const old = sh.getDataRange().getValues();
  const third = {};
  if (old[0] && old[0].length > 2) {
    for (let i = 1; i < old.length; i++) third[String(old[i][0])] = old[i][2] || '';
  }

  const rows = [['key','value'].concat(extraHeaders || [])];
  Object.keys(obj).forEach(k => {
    if (k === 'publish_status' || k === 'site_title' || k.indexOf('hero_') === 0 || k.indexOf('cta_') === 0 ||
        sheetName !== SHEETS.settings) {
      const row = [k, obj[k]];
      if (extraHeaders && extraHeaders.length) row.push(third[k] || '');
      rows.push(row);
    }
  });

  sh.clearContents();
  sh.getRange(1,1,rows.length,rows[0].length).setValues(rows);
}

function writeTable_(sheetName, records) {
  const sh = sheet_(sheetName);
  if (!records.length) {
    const header = sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getValues();
    sh.clearContents();
    if (header[0].some(String)) sh.getRange(1,1,1,header[0].length).setValues(header);
    return;
  }

  const headers = Object.keys(records[0]);
  const rows = [headers].concat(records.map(r => headers.map(h => r[h] == null ? '' : r[h])));
  sh.clearContents();
  sh.getRange(1,1,rows.length,headers.length).setValues(rows);
}

function setKeyValue_(sheetName, key, value) {
  const sh = sheet_(sheetName);
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(key)) {
      sh.getRange(i+1,2).setValue(value);
      return;
    }
  }
  sh.appendRow([key,value]);
}

function addHistory_(action, user, note) {
  const sh = sheet_(SHEETS.history);
  sh.appendRow([new Date(), action, user || '', Utilities.getUuid().slice(0,8), note || '']);
}

function sheet_(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('找不到工作表：' + name);
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
