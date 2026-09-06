/**
 * Code.gs — Google Apps Script Backend
 * Professional Email Sender Backend
 *
 * ══════════════════════════════════════════════════════════════════════
 * CRITICAL DEPLOYMENT INSTRUCTIONS (PLEASE READ):
 * 1. Open your Apps Script editor at: script.google.com
 * 2. Paste this entire file into Code.gs (replacing everything)
 * 3. Save (Ctrl+S)
 * 4. Click: Deploy → Manage Deployments
 * 5. Click the EDIT icon (pencil) next to your active Web App
 * 6. Under "Version", click the dropdown and choose: "New version"
 * 7. Click "Deploy" and then "Done"
 * ⚠️ If you don't select "New version", Google Apps Script will keep
 *    running the older version from the cloud!
 * ══════════════════════════════════════════════════════════════════════
 */

const CONFIG = {
  SPREADSHEET_ID: '1NfbQ5UirQnYdK0RpT40fUt8bLhuc8lRLgaYI1fAciXg',       // ← Leave empty to auto-use the active spreadsheet
  SHEET_RECIPIENTS: 'Recipients',
  SHEET_CAMPAIGNS:  'Campaigns',
  SHEET_EMAIL_LOGS: 'Email Logs',
  SHEET_SETTINGS:   'Settings',
  MAX_EMAILS_PER_CAMPAIGN: 500,
  BATCH_DELAY_MS: 150,      // ms between sends for high deliverability
};

// ══════════════════════════════════════════════════════════════════════
// HTTP HANDLERS
// ══════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action  = payload.action;

    if (action === 'send') {
      return handleSendBulk(payload);
    } else if (action === 'test') {
      return handleSendTest(payload);
    } else {
      return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    const action = e.parameter ? e.parameter.action : null;

    if (action === 'history') {
      return handleGetHistory();
    } else if (action === 'settings') {
      return handleGetSettings();
    } else {
      return jsonResponse({ success: true, message: 'Email Service Backend is active and running ✓' });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ══════════════════════════════════════════════════════════════════════
// HELPER: PROCESS BANNER ASSET (INLINE MIME EMBEDDING)
// ══════════════════════════════════════════════════════════════════════

function embedBannerInlineInHtml(bodyHtml, bannerBlob) {
  if (!bannerBlob || !bodyHtml) return bodyHtml;

  return String(bodyHtml).replace(/<img[^>]*id=["']emailBannerImg["'][^>]*>/i, function(tag) {
    return tag.replace(/src=["'][^"']*["']/i, 'src="cid:bannerImg"');
  });
}

function processBannerAsset(bannerBase64, bannerMimeType, rawHtml) {
  let bodyHtml = rawHtml || '';
  let bannerBlob = null;

  try {
    if (bannerBase64 && String(bannerBase64).trim() !== '') {
      const decoded = Utilities.base64Decode(String(bannerBase64).trim());
      bannerBlob = Utilities.newBlob(decoded, bannerMimeType || 'image/jpeg', 'banner.jpg');
    }

    if (bannerBlob) {
      // Reference the MIME part by CID so Gmail renders it inline.
      bodyHtml = embedBannerInlineInHtml(bodyHtml, bannerBlob);
    }
  } catch (err) {
    throw new Error('Banner image could not be decoded: ' + err);
  }

  // CID images are supported by Gmail and email clients without appearing as
  // a separate downloadable attachment.
  return { bodyHtml, inlineImages: bannerBlob ? { bannerImg: bannerBlob } : {} };
}

// ══════════════════════════════════════════════════════════════════════
// SEND HANDLERS
// ══════════════════════════════════════════════════════════════════════

function handleSendBulk(payload) {
  const { recipients, senderName, subject, bannerBase64, bannerMimeType, attachment } = payload;
  const rawBodyHtml = payload.bodyHtml;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return jsonResponse({ success: false, error: 'No recipients provided.' });
  }
  if (!subject || String(subject).trim() === '') {
    return jsonResponse({ success: false, error: 'Subject is required.' });
  }
  if (!rawBodyHtml || String(rawBodyHtml).trim() === '') {
    return jsonResponse({ success: false, error: 'Email body is required.' });
  }
  if (recipients.length > CONFIG.MAX_EMAILS_PER_CAMPAIGN) {
    return jsonResponse({ success: false, error: `Too many recipients. Max is ${CONFIG.MAX_EMAILS_PER_CAMPAIGN}.` });
  }

  const { bodyHtml, inlineImages } = processBannerAsset(bannerBase64, bannerMimeType, rawBodyHtml);

  const campaignId    = generateId();
  const campaignSheet = getSheet(CONFIG.SHEET_CAMPAIGNS);
  const displayName   = (senderName || '').trim() || 'Notification';

  campaignSheet.appendRow([
    campaignId,
    subject,
    displayName,
    new Date().toISOString(),
    recipients.length,
    'Sending',
  ]);

  let attachmentBlob = null;
  if (attachment && attachment.base64 && attachment.name) {
    try {
      const decoded = Utilities.base64Decode(attachment.base64);
      attachmentBlob = Utilities.newBlob(decoded, attachment.mimeType || 'application/octet-stream', attachment.name);
    } catch (e) {
      Logger.log('Attachment error: ' + e);
    }
  }

  const logSheet = getSheet(CONFIG.SHEET_EMAIL_LOGS);
  let sent   = 0;
  let failed = 0;
  const errors = [];

  const validEmails = recipients.filter(email => isValidEmail(email));
  const invalidEmails = recipients.filter(email => !isValidEmail(email));
  const plainTextBody = stripHtml(bodyHtml, displayName);

  invalidEmails.forEach(email => {
    failed++;
    errors.push(`${email}: Invalid email address`);
    logSheet.appendRow([
      campaignId,
      subject,
      email,
      'Failed',
      new Date().toISOString(),
      'Invalid email address',
    ]);
  });

  validEmails.forEach((email, idx) => {
    try {
      const options = {
        name:     displayName,
        htmlBody: bodyHtml,
      };

      if (Object.keys(inlineImages).length > 0) {
        options.inlineImages = inlineImages;
      }

      if (attachmentBlob) {
        options.attachments = [attachmentBlob];
      }

      GmailApp.sendEmail(email, subject, plainTextBody, options);

      logSheet.appendRow([
        campaignId,
        subject,
        email,
        'Sent',
        new Date().toISOString(),
        '',
      ]);
      sent++;

      if (idx < validEmails.length - 1) {
        Utilities.sleep(CONFIG.BATCH_DELAY_MS);
      }
    } catch (err) {
      const errMsg = err.toString();
      logSheet.appendRow([
        campaignId,
        subject,
        email,
        'Failed',
        new Date().toISOString(),
        errMsg,
      ]);
      failed++;
      errors.push(`${email}: ${errMsg}`);
    }
  });

  updateCampaignStatus(campaignId, failed === 0 ? 'Sent' : sent > 0 ? 'Partial' : 'Failed');

  return jsonResponse({
    success: true,
    campaignId,
    sent,
    failed,
    errors,
  });
}

function handleSendTest(payload) {
  const { toEmail, senderName, subject, bannerBase64, bannerMimeType, attachment } = payload;
  const rawBodyHtml = payload.bodyHtml;

  if (!toEmail || !isValidEmail(toEmail)) {
    return jsonResponse({ success: false, error: 'Invalid test email address.' });
  }
  if (!subject) {
    return jsonResponse({ success: false, error: 'Subject is required.' });
  }

  const { bodyHtml, inlineImages } = processBannerAsset(bannerBase64, bannerMimeType, rawBodyHtml);

  let attachmentBlob = null;
  if (attachment && attachment.base64 && attachment.name) {
    try {
      const decoded = Utilities.base64Decode(attachment.base64);
      attachmentBlob = Utilities.newBlob(decoded, attachment.mimeType || 'application/octet-stream', attachment.name);
    } catch (e) {
      return jsonResponse({ success: false, error: 'Attachment could not be decoded: ' + e });
    }
  }

  const displayName = ((senderName || '').trim() || 'Notification');
  const options = {
    name:     displayName,
    htmlBody: bodyHtml,
  };

  if (Object.keys(inlineImages).length > 0) {
    options.inlineImages = inlineImages;
  }
  try {
    if (attachmentBlob) {
      options.attachments = [attachmentBlob];
    }
    const plainText = stripHtml(bodyHtml, displayName);
    GmailApp.sendEmail(toEmail, subject, plainText, options);
    return jsonResponse({ success: true, message: `Test email sent successfully to ${toEmail}` });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ══════════════════════════════════════════════════════════════════════
// GET HANDLERS
// ══════════════════════════════════════════════════════════════════════

function handleGetHistory() {
  const sheet = getSheet(CONFIG.SHEET_EMAIL_LOGS);
  const data  = sheet.getDataRange().getValues();

  if (data.length <= 1) return jsonResponse({ success: true, logs: [] });

  const logs = data.slice(1).reverse().slice(0, 100).map(row => ({
    campaignId: row[0],
    subject:    row[1],
    recipient:  row[2],
    status:     row[3],
    timestamp:  row[4] instanceof Date ? formatDate(row[4]) : row[4],
    error:      row[5],
  }));

  return jsonResponse({ success: true, logs });
}

function handleGetSettings() {
  const sheet  = getSheet(CONFIG.SHEET_SETTINGS);
  const data   = sheet.getDataRange().getValues();
  const settings = {};
  data.slice(1).forEach(row => {
    if (row[0]) settings[row[0]] = row[1];
  });
  return jsonResponse({ success: true, settings });
}

// ══════════════════════════════════════════════════════════════════════
// SHEET UTILITIES
// ══════════════════════════════════════════════════════════════════════

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(name) {
  const ss    = getSpreadsheet();
  let sheet   = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    addSheetHeaders(sheet, name);
  }
  return sheet;
}

function addSheetHeaders(sheet, name) {
  const headers = {
    [CONFIG.SHEET_RECIPIENTS]: ['Email', 'Name', 'Added Date', 'Status'],
    [CONFIG.SHEET_CAMPAIGNS]:  ['Campaign ID', 'Subject', 'Sender Name', 'Sent Date', 'Recipient Count', 'Status'],
    [CONFIG.SHEET_EMAIL_LOGS]: ['Campaign ID', 'Subject', 'Recipient', 'Status', 'Timestamp', 'Error'],
    [CONFIG.SHEET_SETTINGS]:   ['Key', 'Value'],
  };
  const h = headers[name];
  if (h) {
    sheet.appendRow(h);
    sheet.getRange(1, 1, 1, h.length)
      .setBackground('#1a73e8')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  if (name === CONFIG.SHEET_SETTINGS) {
    sheet.appendRow(['default_sender_name', 'Notification Team']);
    sheet.appendRow(['max_emails_per_day',  '500']);
  }
}

function updateCampaignStatus(campaignId, status) {
  try {
    const sheet  = getSheet(CONFIG.SHEET_CAMPAIGNS);
    const data   = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === campaignId) {
        sheet.getRange(i + 1, 6).setValue(status);
        break;
      }
    }
  } catch (e) {
    Logger.log('updateCampaignStatus error: ' + e);
  }
}

// ══════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}

function stripHtml(html, senderName) {
  const text = String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .trim();

  return text + '\n\nSent by ' + (senderName || 'Sender') + '.\nIf you have questions, please reply to this email.\n';
}

function generateId() {
  return 'CMP_' + new Date().getTime() + '_' + Math.floor(Math.random() * 10000);
}

function formatDate(date) {
  if (!(date instanceof Date)) return String(date);
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function initSheets() {
  getSheet(CONFIG.SHEET_RECIPIENTS);
  getSheet(CONFIG.SHEET_CAMPAIGNS);
  getSheet(CONFIG.SHEET_EMAIL_LOGS);
  getSheet(CONFIG.SHEET_SETTINGS);
  SpreadsheetApp.getUi().alert('✅ All database sheets created successfully!');
}
