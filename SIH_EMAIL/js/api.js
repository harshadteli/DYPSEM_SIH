/**
 * api.js — Google Apps Script API Layer
 * Handles all fetch requests to the GAS Web App backend.
 */

const API = (() => {
  // ── Hardcoded GAS Web App URL from conect.js ──────────────────────
  const FIXED_GAS_URL = (window.CONFIG && window.CONFIG.GAS_URL)
    || (window.GAS_CONFIG && window.GAS_CONFIG.WEB_APP_URL)
    || (window.CONNECT_CONFIG && window.CONNECT_CONFIG.WEB_APP_URL)
    || 'https://script.google.com/macros/s/AKfycbwHagHGgEvYb9qmt91QRjqGJzKcA-soTmXzv84V2OBlR4Eb74Z5vArNMX216BHFl8naPg/exec';

  const STORAGE_KEY_URL  = 'bulkmail_gas_url';
  const STORAGE_KEY_TEST = 'bulkmail_test_email';

  // Returns saved URL from settings, or falls back to fixed URL
  function getGasUrl() {
    const custom = localStorage.getItem(STORAGE_KEY_URL);
    if (custom && custom.trim() !== '') {
      return custom.trim();
    }
    return FIXED_GAS_URL;
  }

  function setGasUrl(url) {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  }

  function getDefaultTestEmail() {
    return localStorage.getItem(STORAGE_KEY_TEST) || '';
  }

  function setDefaultTestEmail(email) {
    localStorage.setItem(STORAGE_KEY_TEST, email.trim());
  }

  // ── Generic POST to GAS ──────────────────────────────────────────────
  async function post(payload) {
    const url = getGasUrl();
    if (!url) throw new Error('GAS URL not configured. Please set it in Settings.');

    const response = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain' }, // GAS needs text/plain for CORS
      body:    JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response from server. Check your GAS Web App.');
    }

    if (!data.success) {
      throw new Error(data.message || data.error || 'Unknown server error');
    }

    return data;
  }

  // ── Generic GET to GAS ──────────────────────────────────────────────
  async function get(params = {}) {
    const url = getGasUrl();
    if (!url) throw new Error('GAS URL not configured. Please set it in Settings.');

    const qs = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${qs}`);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response from server.');
    }

    return data;
  }

  // ── API Methods ──────────────────────────────────────────────────────

  /**
   * Send bulk emails.
   * @param {object} campaign
   * @param {string[]} campaign.recipients   - Array of email strings
   * @param {string}   campaign.senderName
   * @param {string}   campaign.subject
   * @param {string}   campaign.bodyHtml
   * @param {string}   [campaign.ctaLabel]
   * @param {string}   [campaign.ctaUrl]
   * @param {object}   [campaign.attachment]  - { name, mimeType, base64 }
   * @returns {Promise<{success: boolean, sent: number, failed: number, errors: string[]}>}
   */
  async function sendBulkEmails(campaign) {
    return await post({ action: 'send', ...campaign });
  }

  /**
   * Send a single test email.
   * @param {string} toEmail
   * @param {object} campaign - Same shape as sendBulkEmails
   */
  async function sendTestEmail(toEmail, campaign) {
    return await post({ action: 'test', toEmail, ...campaign });
  }

  /**
   * Fetch email send history.
   * @returns {Promise<Array>}
   */
  async function getHistory() {
    const data = await get({ action: 'history' });
    return data.logs || [];
  }

  return {
    FIXED_GAS_URL,
    getGasUrl,
    setGasUrl,
    getDefaultTestEmail,
    setDefaultTestEmail,
    sendBulkEmails,
    sendTestEmail,
    getHistory,
  };
})();
