/**
 * recipients.js — Recipient Management Module
 * Handles: single add, bulk paste, CSV import, chip rendering, validation.
 */

const Recipients = (() => {
  // ── State ──────────────────────────────────────────────────────────
  const state = {
    list: [],   // [{ email, name }]
  };

  // ── Email Validation ───────────────────────────────────────────────
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function isValid(email) {
    return EMAIL_RE.test(email.trim().toLowerCase());
  }

  // ── DOM References ─────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const chipsContainer    = () => $('chipsContainer');
  const emptyState        = () => $('recipientsEmptyState');
  const recipientCount    = () => $('recipientCount');
  const clearAllBtn       = () => $('clearAllBtn');
  const listStats         = () => $('listStats');
  const statValid         = () => $('statValid');
  const statDuplicate     = () => $('statDuplicate');
  const statInvalid       = () => $('statInvalid');
  const step1ContinueBtn  = () => $('step1ContinueBtn');

  // ── Add a single email ─────────────────────────────────────────────
  function addEmail(email, name = '') {
    email = email.trim().toLowerCase();
    if (!email) return { status: 'empty' };
    if (!isValid(email)) return { status: 'invalid', email };
    if (state.list.some(r => r.email === email)) return { status: 'duplicate', email };
    state.list.push({ email, name: name.trim() });
    renderList();
    return { status: 'added', email };
  }

  // ── Parse raw text into emails ─────────────────────────────────────
  function parseRawText(raw) {
    return raw
      .split(/[\s,;\n\r]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);
  }

  // ── Add multiple emails ─────────────────────────────────────────────
  function addMany(rawList) {
    const results = { added: 0, duplicate: 0, invalid: 0 };
    rawList.forEach(email => {
      const r = addEmail(email);
      if (r.status === 'added')     results.added++;
      if (r.status === 'duplicate') results.duplicate++;
      if (r.status === 'invalid')   results.invalid++;
    });
    return results;
  }

  // ── Remove email by index ──────────────────────────────────────────
  function removeEmail(email) {
    state.list = state.list.filter(r => r.email !== email);
    renderList();
  }

  // ── Clear all ──────────────────────────────────────────────────────
  function clearAll() {
    state.list = [];
    renderList();
  }

  // ── Get recipients list ─────────────────────────────────────────────
  function getList() {
    return [...state.list];
  }

  // ── Render chip list ─────────────────────────────────────────────────
  function renderList() {
    const container = chipsContainer();
    // Remove existing chips (keep empty state node)
    container.querySelectorAll('.chip').forEach(c => c.remove());

    const count = state.list.length;
    recipientCount().textContent = count;
    step1ContinueBtn().disabled = count === 0;
    clearAllBtn().style.display = count > 0 ? '' : 'none';

    if (count === 0) {
      emptyState().style.display = '';
      listStats().setAttribute('hidden', '');
      return;
    }

    emptyState().style.display = 'none';
    listStats().removeAttribute('hidden');
    statValid().textContent = count;

    state.list.forEach(({ email, name }) => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.title = name ? `${name} <${email}>` : email;
      chip.innerHTML = `
        <span class="chip-email">${name ? `<strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;` : escapeHtml(email)}</span>
        <button class="chip-remove" aria-label="Remove ${escapeHtml(email)}" data-email="${escapeHtml(email)}">✕</button>
      `;
      chip.querySelector('.chip-remove').addEventListener('click', () => {
        removeEmail(email);
      });
      container.appendChild(chip);
    });
  }

  // ── Escape HTML ────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── CSV Parse ──────────────────────────────────────────────────────
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const emailCol = headers.findIndex(h => h === 'email' || h === 'e-mail' || h === 'email address');
    const nameCol  = headers.findIndex(h => h === 'name' || h === 'full name' || h === 'display name');

    if (emailCol === -1) return null; // No email column

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const email = (cols[emailCol] || '').trim().replace(/"/g, '');
      const name  = nameCol >= 0 ? (cols[nameCol] || '').trim().replace(/"/g, '') : '';
      if (email) rows.push({ email, name });
    }
    return rows;
  }

  function parseCSVLine(line) {
    const result = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuote = !inQuote; continue; }
      if (line[i] === ',' && !inQuote) { result.push(cur); cur = ''; continue; }
      cur += line[i];
    }
    result.push(cur);
    return result;
  }

  // ── Init UI ────────────────────────────────────────────────────────
  function init() {
    // ── Tab switching ───────────────────────────────────────────────
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.id === `tab-${tab}`);
        });
      });
    });

    // ── Single Email Add ────────────────────────────────────────────
    const singleInput = document.getElementById('singleEmailInput');
    const singleName  = document.getElementById('singleNameInput');
    const addBtn      = document.getElementById('addSingleEmailBtn');

    function doAddSingle() {
      const email = singleInput.value.trim();
      const name  = singleName.value.trim();
      const result = addEmail(email, name);
      if (result.status === 'added') {
        singleInput.value = '';
        singleName.value  = '';
        singleInput.focus();
        App.showToast('Recipient added', 'success');
      } else if (result.status === 'invalid') {
        App.showToast(`"${email}" is not a valid email address`, 'error');
        singleInput.focus();
      } else if (result.status === 'duplicate') {
        App.showToast(`"${email}" is already in the list`, 'warning');
      }
    }
    addBtn.addEventListener('click', doAddSingle);
    singleInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAddSingle(); });

    // ── Bulk Paste ──────────────────────────────────────────────────
    const bulkInput  = document.getElementById('bulkEmailInput');
    const parseCount = document.getElementById('bulkParseCount');
    const addBulkBtn = document.getElementById('addBulkEmailsBtn');

    bulkInput.addEventListener('input', () => {
      const emails = parseRawText(bulkInput.value).filter(isValid);
      parseCount.textContent = `${emails.length} email${emails.length !== 1 ? 's' : ''} detected`;
    });

    addBulkBtn.addEventListener('click', () => {
      const raw = parseRawText(bulkInput.value);
      if (!raw.length) { App.showToast('Nothing to add', 'warning'); return; }
      const results = addMany(raw);
      bulkInput.value = '';
      parseCount.textContent = '0 emails detected';
      App.showToast(
        `Added ${results.added} · Skipped ${results.duplicate} duplicates · ${results.invalid} invalid`,
        results.added > 0 ? 'success' : 'warning'
      );
    });

    // ── CSV Import ──────────────────────────────────────────────────
    const csvInput   = document.getElementById('csvFileInput');
    const csvDrop    = document.getElementById('csvDropZone');
    const csvPreview = document.getElementById('csvPreview');

    function handleCSVFile(file) {
      if (!file || !file.name.endsWith('.csv')) {
        App.showToast('Please upload a valid .csv file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const rows = parseCSV(e.target.result);
        if (rows === null) {
          App.showToast('CSV must have an "email" column', 'error');
          return;
        }
        const results = rows.reduce((acc, { email, name }) => {
          const r = addEmail(email, name);
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        }, {});
        csvPreview.removeAttribute('hidden');
        csvPreview.textContent = `✓ Imported from CSV: ${results.added || 0} added, ${results.duplicate || 0} duplicates skipped, ${results.invalid || 0} invalid.`;
        App.showToast(`CSV imported: ${results.added || 0} recipients added`, 'success');
      };
      reader.readAsText(file);
    }

    csvInput.addEventListener('change', () => handleCSVFile(csvInput.files[0]));

    ['dragenter','dragover'].forEach(evt => {
      csvDrop.addEventListener(evt, e => { e.preventDefault(); csvDrop.classList.add('dragging'); });
    });
    ['dragleave','drop'].forEach(evt => {
      csvDrop.addEventListener(evt, e => { e.preventDefault(); csvDrop.classList.remove('dragging'); });
    });
    csvDrop.addEventListener('drop', e => {
      handleCSVFile(e.dataTransfer.files[0]);
    });

    // ── Clear All ───────────────────────────────────────────────────
    document.getElementById('clearAllBtn').addEventListener('click', () => {
      if (state.list.length === 0) return;
      if (confirm(`Remove all ${state.list.length} recipients?`)) {
        clearAll();
        App.showToast('Recipient list cleared', 'success');
      }
    });

    renderList();
  }

  return { init, addEmail, addMany, removeEmail, clearAll, getList, parseRawText, isValid };
})();
