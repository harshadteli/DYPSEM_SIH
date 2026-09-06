/**
 * app.js — Main Application Controller
 * Step navigation state machine, modal management, settings, toasts.
 * Runs after all other modules are loaded.
 */

const App = (() => {
  // ── State ──────────────────────────────────────────────────────────
  let currentStep = 1;

  // ── Step Navigation ────────────────────────────────────────────────
  function goToStep(n) {
    if (n < 1 || n > 4) return;
    currentStep = n;

    // Update panels
    document.querySelectorAll('.step-panel').forEach((p, i) => {
      p.classList.toggle('active', i + 1 === n);
    });

    // Update stepper
    document.querySelectorAll('.step').forEach((s, i) => {
      const sn = i + 1;
      s.classList.toggle('active',    sn === n);
      s.classList.toggle('completed', sn < n);
    });

    // Update connectors
    document.querySelectorAll('.step-connector').forEach((c, i) => {
      c.classList.toggle('filled', i + 1 < n);
    });

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Toast Notifications ────────────────────────────────────────────
  function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close" aria-label="Dismiss">✕</button>
    `;
    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
    container.appendChild(toast);
    setTimeout(() => removeToast(toast), duration);
  }
  function removeToast(el) {
    if (!el.parentNode) return;
    el.style.opacity = '0';
    el.style.transform = 'translateX(40px)';
    el.style.transition = 'all .3s';
    setTimeout(() => el.remove(), 300);
  }

  // ── Modal Helpers ──────────────────────────────────────────────────
  function showModal(id) {
    const m = document.getElementById(id);
    m.removeAttribute('hidden');
    // Trap focus on first input
    const first = m.querySelector('input, button');
    if (first) setTimeout(() => first.focus(), 50);
  }
  function hideModal(id) {
    document.getElementById(id).setAttribute('hidden', '');
  }

  // ── Settings ───────────────────────────────────────────────────────
  function initSettings() {
    document.getElementById('settingsBtn').addEventListener('click', () => {
      document.getElementById('gasUrlInput').value       = API.getGasUrl();
      document.getElementById('defaultTestEmail').value  = API.getDefaultTestEmail();
      showModal('settingsModal');
    });
    document.getElementById('closeSettingsModal').addEventListener('click',  () => hideModal('settingsModal'));
    document.getElementById('cancelSettingsBtn').addEventListener('click',   () => hideModal('settingsModal'));
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
      const url       = document.getElementById('gasUrlInput').value.trim();
      const testEmail = document.getElementById('defaultTestEmail').value.trim();
      API.setGasUrl(url);
      API.setDefaultTestEmail(testEmail);
      hideModal('settingsModal');
      showToast('Settings saved successfully', 'success');
    });
    // Close on overlay click
    document.getElementById('settingsModal').addEventListener('click', e => {
      if (e.target === document.getElementById('settingsModal')) hideModal('settingsModal');
    });
  }

  // ── History ────────────────────────────────────────────────────────
  function initHistory() {
    async function openHistory() {
      showModal('historyModal');
      document.getElementById('historyLoading').style.display = '';
      document.getElementById('historyTable').setAttribute('hidden', '');
      document.getElementById('historyEmpty').setAttribute('hidden', '');

      try {
        const logs = await API.getHistory();
        document.getElementById('historyLoading').style.display = 'none';
        if (!logs || logs.length === 0) {
          document.getElementById('historyEmpty').removeAttribute('hidden');
          return;
        }
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';
        logs.forEach(log => {
          const tr = document.createElement('tr');
          const statusClass = log.status === 'Sent' ? 'sent' : log.status === 'Failed' ? 'failed' : 'pending';
          tr.innerHTML = `
            <td>${escapeHtml(log.timestamp || '')}</td>
            <td>${escapeHtml(log.subject || '')}</td>
            <td>${escapeHtml(log.recipient || '')}</td>
            <td><span class="status-badge ${statusClass}">${escapeHtml(log.status || '')}</span></td>
          `;
          tbody.appendChild(tr);
        });
        document.getElementById('historyTable').removeAttribute('hidden');
      } catch (err) {
        document.getElementById('historyLoading').style.display = 'none';
        document.getElementById('historyEmpty').removeAttribute('hidden');
        document.getElementById('historyEmpty').textContent = 'Could not load history. Check your GAS URL in Settings.';
        console.error(err);
      }
    }

    document.getElementById('historyBtn').addEventListener('click',       openHistory);
    document.getElementById('viewHistoryBtn').addEventListener('click',   openHistory);
    document.getElementById('closeHistoryModal').addEventListener('click', () => hideModal('historyModal'));
    document.getElementById('closeHistoryBtn').addEventListener('click',   () => hideModal('historyModal'));
    document.getElementById('historyModal').addEventListener('click', e => {
      if (e.target === document.getElementById('historyModal')) hideModal('historyModal');
    });
  }

  // ── Step 1 → 2 ────────────────────────────────────────────────────
  function initStep1() {
    document.getElementById('step1ContinueBtn').addEventListener('click', () => {
      const list = Recipients.getList();
      if (list.length === 0) {
        showToast('Please add at least one recipient', 'error');
        return;
      }
      goToStep(2);
    });
  }

  // ── Step 2 → 3 ────────────────────────────────────────────────────
  function initStep2() {
    document.getElementById('step2BackBtn').addEventListener('click',     () => goToStep(1));
    document.getElementById('step2ContinueBtn').addEventListener('click', async () => {
      showToast('Preparing email preview…', 'info', 2000);
      await Composer.ensureBannerReady();

      const v = Composer.validate();
      if (!v.valid) {
        showToast(v.msg, 'error');
        const field = document.getElementById(v.field);
        if (field) { field.focus(); field.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }
      const data = Composer.getData();
      Preview.render(data);
      goToStep(3);
    });
  }

  // ── Step 3: Preview, Test, Send ───────────────────────────────────
  function initStep3() {
    document.getElementById('step3BackBtn').addEventListener('click', () => goToStep(2));

    // Send Test Email
    document.getElementById('sendTestEmailBtn').addEventListener('click', () => {
      document.getElementById('testEmailInput').value = API.getDefaultTestEmail();
      showModal('testEmailModal');
    });
    document.getElementById('cancelTestEmailBtn').addEventListener('click', () => hideModal('testEmailModal'));
    document.getElementById('testEmailModal').addEventListener('click', e => {
      if (e.target === document.getElementById('testEmailModal')) hideModal('testEmailModal');
    });
    document.getElementById('confirmTestEmailBtn').addEventListener('click', async () => {
      const email = document.getElementById('testEmailInput').value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      hideModal('testEmailModal');
      const btn = document.getElementById('confirmTestEmailBtn');
      btn.disabled = true;
      showToast(`Sending test email to ${email}…`, 'info');
      try {
        await Composer.ensureBannerReady();
        const v = Composer.validate();
        if (!v.valid) {
          showToast(v.msg, 'error');
          goToStep(2);
          return;
        }
        const data = Composer.getData();
        data.bodyHtml = Preview.getHtml(data);
        await API.sendTestEmail(email, data);
        showToast(`Test email sent to ${email}!`, 'success');
      } catch (err) {
        showToast(`Test email failed: ${err.message}`, 'error');
      } finally {
        btn.disabled = false;
      }
    });

    // Send All
    document.getElementById('sendAllBtn').addEventListener('click', () => {
      const recipients = Recipients.getList();
      const data = Composer.getData();
      document.getElementById('confirmRecipientCount').textContent = recipients.length;
      document.getElementById('confirmSubject').textContent        = data.subject;
      showModal('confirmSendModal');
    });
    document.getElementById('cancelSendBtn').addEventListener('click', () => hideModal('confirmSendModal'));
    document.getElementById('confirmSendModal').addEventListener('click', e => {
      if (e.target === document.getElementById('confirmSendModal')) hideModal('confirmSendModal');
    });
    document.getElementById('confirmSendBtn').addEventListener('click', () => {
      hideModal('confirmSendModal');
      startSendCampaign();
    });
  }

  // ── Step 4: Sending ───────────────────────────────────────────────
  async function startSendCampaign() {
    goToStep(4);

    const recipients = Recipients.getList();
    const total      = recipients.length;

    const progressBar  = document.getElementById('sendProgressBar');
    const statusText   = document.getElementById('sendStatusText');
    const statusTitle  = document.getElementById('sendStatusTitle');

    progressBar.style.width = '5%';
    statusText.textContent  = 'Preparing banner image…';

    if (!API.getGasUrl()) {
      finishSend(0, total, ['GAS URL not configured. Please go to Settings and add your Google Apps Script URL.']);
      return;
    }

    await Composer.ensureBannerReady();
    const v = Composer.validate();
    if (!v.valid) {
      goToStep(2);
      showToast(v.msg, 'error');
      return;
    }

    const data = Composer.getData();

    try {
      statusText.textContent = `Sending to ${total} recipients…`;
      progressBar.style.width = '40%';

      const payload = {
        recipients:     recipients.map(r => r.email),
        senderName:     data.senderName,
        subject:        data.subject,
        bodyHtml:       Preview.getHtml(data),
        bannerBase64:   data.bannerBase64 || '',
        bannerMimeType: data.bannerMimeType || 'image/jpeg',
        attachment:     data.attachment,
      };

      const result = await API.sendBulkEmails(payload);

      progressBar.style.width = '100%';
      statusText.textContent  = 'Done!';
      setTimeout(() => {
        finishSend(result.sent || 0, result.failed || 0, result.errors || []);
      }, 600);

    } catch (err) {
      progressBar.style.width = '100%';
      progressBar.style.background = 'var(--danger)';
      statusTitle.textContent = 'Send Failed';
      statusText.textContent  = err.message;
      finishSend(0, total, [err.message]);
    }
  }

  function finishSend(sent, failed, errors) {
    document.getElementById('sendProgressCard').setAttribute('hidden', '');
    const card = document.getElementById('sendResultsCard');
    card.removeAttribute('hidden');
    document.getElementById('resultSuccess').textContent = sent;
    document.getElementById('resultFailed').textContent  = failed;

    if (failed > 0 && sent === 0) {
      card.querySelector('.result-icon').innerHTML = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#ea4335" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="#ea4335" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="#ea4335" stroke-width="2" stroke-linecap="round"/></svg>`;
      card.querySelector('.result-icon').className = 'result-icon';
      document.getElementById('resultTitle').textContent    = 'Send Failed';
      document.getElementById('resultSubtitle').textContent = errors[0] || 'An error occurred.';
    } else if (failed > 0) {
      document.getElementById('resultTitle').textContent    = 'Campaign Partially Sent';
      document.getElementById('resultSubtitle').textContent = `${sent} emails sent, ${failed} failed.`;
    } else {
      document.getElementById('resultTitle').textContent    = 'Campaign Sent!';
      document.getElementById('resultSubtitle').textContent = `All ${sent} emails sent successfully.`;
    }
  }

  // ── New Campaign ──────────────────────────────────────────────────
  function initNewCampaign() {
    document.getElementById('newCampaignBtn').addEventListener('click', () => {
      if (confirm('Start a new campaign? This will clear the current one.')) {
        Recipients.clearAll();
        Composer.reset();
        // Reset send step
        document.getElementById('sendProgressCard').removeAttribute('hidden');
        document.getElementById('sendResultsCard').setAttribute('hidden', '');
        document.getElementById('sendProgressBar').style.width     = '0%';
        document.getElementById('sendProgressBar').style.background = '';
        document.getElementById('sendStatusTitle').textContent     = 'Sending Emails…';
        document.getElementById('sendStatusText').textContent      = 'Preparing campaign…';
        goToStep(1);
        showToast('New campaign started', 'success');
      }
    });
  }

  // ── Escape HTML (shared) ──────────────────────────────────────────
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    Recipients.init();
    Composer.init();
    Preview.init();

    initSettings();
    initHistory();
    initStep1();
    initStep2();
    initStep3();
    initNewCampaign();

    // If no GAS URL, show a welcome hint
    if (!API.getGasUrl()) {
      setTimeout(() => {
        showToast('👋 Welcome! Go to Settings and paste your Google Apps Script URL to get started.', 'info', 8000);
      }, 1000);
    }
  }

  // ── Run on DOM ready ──────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { goToStep, showToast, showModal, hideModal };
})();
