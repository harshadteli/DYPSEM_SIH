/**
 * composer.js — Email Composer Module
 * Handles: form binding, rich editor, banner file upload,
 * client-side image compression to Base64, spam risk detection, and live inbox preview.
 */

const Composer = (() => {
  // ── State ──────────────────────────────────────────────────────────
  const state = {
    attachment: null,     // { name, mimeType, base64, sizeLabel }
    bannerData: '',       // Local uploaded image data URI
    bannerBase64: '',     // Raw Base64 string for GAS inlineImages
    bannerMimeType: 'image/jpeg',
    bannerReady: true,    // false while image is still loading/compressing
  };

  let bannerReadyResolve = null;
  let bannerReadyPromise = Promise.resolve();

  // ── Compress Image to Base64 (Max 600px width, lightweight JPEG) ────
  function extractCompressedBase64(imgElement, callback) {
    try {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 600;
      let width = imgElement.naturalWidth || imgElement.width || 600;
      let height = imgElement.naturalHeight || imgElement.height || 200;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx !== -1) {
        callback({
          base64: dataUrl.substring(commaIdx + 1),
          mimeType: 'image/jpeg',
          dataUrl: dataUrl,
        });
        return;
      }
    } catch (e) {
      // If canvas is tainted due to external CORS image, fallback
    }
    callback(null);
  }

  // ── Helper: Remove all hyperlinks to prevent spam flagging ────────
  function removeLinks(html) {
    if (!html) return '';
    return String(html).replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
  }

  // ── Banner payload helpers ─────────────────────────────────────────
  function markBannerProcessing() {
    state.bannerReady = false;
    bannerReadyPromise = new Promise(resolve => {
      bannerReadyResolve = resolve;
    });
  }

  function markBannerReady(success = true) {
    state.bannerReady = success && (!state.bannerData || !!state.bannerBase64);
    if (bannerReadyResolve) {
      bannerReadyResolve(state.bannerReady);
      bannerReadyResolve = null;
    }
  }

  async function ensureBannerReady() {
    await bannerReadyPromise;
    return !state.bannerData || !!state.bannerBase64;
  }

  // ── Get Form Data ──────────────────────────────────────────────────
  function getData() {
    return {
      senderName:     document.getElementById('senderName').value.trim(),
      subject:        document.getElementById('emailSubject').value.trim(),
      bannerBase64:   state.bannerBase64 || '',
      bannerMimeType: state.bannerMimeType || 'image/jpeg',
      bodyHtml:       removeLinks(document.getElementById('emailBody').innerHTML.trim()),
      attachment:     state.attachment,
    };
  }

  // ── Validate ───────────────────────────────────────────────────────
  function validate() {
    const d = getData();
    if (!d.senderName)  return { valid: false, field: 'senderName',   msg: 'Sender Name is required.' };
    if (!d.subject)     return { valid: false, field: 'emailSubject', msg: 'Subject (Email Title) is required.' };

    const bodyText = document.getElementById('emailBody').innerText.trim();
    if (!bodyText)      return { valid: false, field: 'emailBody',    msg: 'Email Body cannot be empty.' };

    if (d.subject.length < 10) {
      return {
        valid: false,
        field: 'emailSubject',
        msg: 'Subject is too short. Use a descriptive title (e.g. "SIH 2024 — Project Guidelines"). Single words like "SIH" are flagged as spam.',
      };
    }

    if (bodyText.length < 50) {
      return {
        valid: false,
        field: 'emailBody',
        msg: 'Email body is too short. Write at least 2–3 complete sentences. Short messages like "Hello" are flagged as spam.',
      };
    }

    if (state.bannerData && !state.bannerBase64) {
      return {
        valid: false,
        field: 'bannerFileInput',
        msg: 'Banner image is still loading. Wait for the preview to appear, or upload the image file directly.',
      };
    }

    return { valid: true };
  }

  // ── Deliverability & Spam Checker (Live Warning) ───────────────────
  function checkSpamRisk() {
    const subject = (document.getElementById('emailSubject').value || '').trim();
    const body = (document.getElementById('emailBody').innerText || '').trim();
    const spamAlert = document.getElementById('spamRiskAlert');
    if (!spamAlert) return;

    const warnings = [];

    if (subject.length > 0 && subject.length < 10) {
      warnings.push('Add a few descriptive words so recipients can quickly recognize this message.');
    }

    if (body.length > 0 && body.length < 50) {
      warnings.push('Add a little more context so recipients know why they received this message.');
    }

    if (state.bannerData && !state.bannerBase64) {
      warnings.push('Banner image has not finished loading. Wait for the preview or upload the file directly so it embeds correctly in the email.');
    }

    if (warnings.length > 0) {
      spamAlert.removeAttribute('hidden');
      spamAlert.innerHTML = `
        <div class="spam-warning-box">
          <span class="spam-warning-icon">⚠️</span>
          <div class="spam-warning-text">
            <strong>Message quality suggestion</strong>
            ${warnings.join('<br>')}
          </div>
        </div>
      `;
    } else {
      spamAlert.setAttribute('hidden', '');
    }
  }

  // ── Update Inbox Preview ───────────────────────────────────────────
  function updateInboxPreview() {
    const name    = document.getElementById('senderName').value.trim()    || 'Your Name';
    const subject = document.getElementById('emailSubject').value.trim()  || 'Email Subject';
    const body    = document.getElementById('emailBody').innerText.trim() || 'Email preview will appear here...';

    const senderEl  = document.getElementById('previewSenderName');
    const subjectEl = document.getElementById('previewSubjectLine');
    const snippetEl = document.getElementById('previewBodySnippet');

    if (senderEl)  senderEl.textContent  = name;
    if (subjectEl) subjectEl.textContent = subject;
    if (snippetEl) snippetEl.textContent = body.substring(0, 120);

    const miniBanner = document.getElementById('miniBannerPreview');
    const miniImg    = document.getElementById('miniBannerImg');
    const data = getData();
    if (miniBanner && miniImg) {
      if (data.bannerBase64) {
        miniImg.src = `data:${data.bannerMimeType || 'image/jpeg'};base64,${data.bannerBase64}`;
        miniBanner.removeAttribute('hidden');
      } else {
        miniBanner.setAttribute('hidden', '');
      }
    }

    checkSpamRisk();
  }

  // ── Format file size ───────────────────────────────────────────────
  function formatSize(bytes) {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ── Handle Attachment ──────────────────────────────────────────────
  function handleAttachment(file) {
    if (!file) return;
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      App.showToast('Attachment must be smaller than 10 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      state.attachment = {
        name:       file.name,
        mimeType:   file.type || 'application/octet-stream',
        base64:     base64,
        sizeLabel:  formatSize(file.size),
      };
      document.getElementById('attachmentPreview').removeAttribute('hidden');
      document.getElementById('attachDropZone').setAttribute('hidden', '');
      document.getElementById('attachFileName').textContent = file.name;
      document.getElementById('attachFileSize').textContent = formatSize(file.size);
      App.showToast(`Attached: ${file.name}`, 'success');
    };
    reader.readAsDataURL(file);
  }

  // ── Remove Attachment ──────────────────────────────────────────────
  function removeAttachment() {
    state.attachment = null;
    document.getElementById('attachmentPreview').setAttribute('hidden', '');
    document.getElementById('attachDropZone').removeAttribute('hidden');
    document.getElementById('attachmentInput').value = '';
  }

  // ── Banner Image Handling ──────────────────────────────────────────
  function applyBannerBase64(base64, mimeType) {
    state.bannerBase64 = base64 || '';
    state.bannerMimeType = mimeType || 'image/jpeg';
    markBannerReady(!!state.bannerBase64);
    updateInboxPreview();
  }

  function setBanner(urlOrBase64) {
    const cleanUrl = urlOrBase64;
    state.bannerData = cleanUrl;

    const previewContainer = document.getElementById('bannerPreviewInline');
    const previewImg       = document.getElementById('bannerPreviewImg');

    if (cleanUrl) {
      markBannerProcessing();

      if (cleanUrl.startsWith('data:')) {
        const commaIdx = cleanUrl.indexOf(',');
        const meta = cleanUrl.substring(0, commaIdx);
        const mimeMatch = meta.match(/:(.*?);/);
        applyBannerBase64(
          commaIdx !== -1 ? cleanUrl.substring(commaIdx + 1) : '',
          mimeMatch ? mimeMatch[1] : 'image/jpeg'
        );
      } else {
        state.bannerBase64 = '';
      }

      previewImg.removeAttribute('crossorigin');
      previewImg.src = cleanUrl;

      previewImg.onload = () => {
        if (previewContainer) previewContainer.removeAttribute('hidden');

        extractCompressedBase64(previewImg, async (res) => {
          if (res) {
            applyBannerBase64(res.base64, res.mimeType);
            return;
          }

          if (cleanUrl.startsWith('data:')) {
            const commaIdx = cleanUrl.indexOf(',');
            applyBannerBase64(
              commaIdx !== -1 ? cleanUrl.substring(commaIdx + 1) : '',
              'image/jpeg'
            );
            return;
          }

          markBannerReady(false);
          App.showToast('Could not process the uploaded banner image.', 'warning');
        });
      };

      previewImg.onerror = () => {
        markBannerReady(false);
        App.showToast('Could not load the uploaded banner image.', 'warning');
      };
    } else {
      if (previewContainer) previewContainer.setAttribute('hidden', '');
      state.bannerBase64 = '';
      markBannerReady(true);
      updateInboxPreview();
    }
  }

  function removeBanner() {
    state.bannerData = '';
    state.bannerBase64 = '';
    markBannerReady(true);
    const fileInput = document.getElementById('bannerFileInput');
    if (fileInput) fileInput.value = '';
    const previewContainer = document.getElementById('bannerPreviewInline');
    if (previewContainer) previewContainer.setAttribute('hidden', '');
    updateInboxPreview();
    App.showToast('Banner image removed', 'info');
  }

  // ── Load Sample Template ───────────────────────────────────────────
  function loadSampleTemplate() {
    document.getElementById('senderName').value   = 'Smart India Hackathon Team';
    document.getElementById('emailSubject').value = 'SIH 2024 — Important Project Guidelines & Schedule';

    // Reliable public sample banner
    removeBanner();

    document.getElementById('emailBody').innerHTML = `
      <p>Dear Participants,</p>
      <p>Welcome to the <strong>Smart India Hackathon 2024</strong>. Please review the updated schedule and project documentation guidelines below.</p>
      <ul>
        <li><strong>Phase 1 Evaluation:</strong> Submissions will close this Friday at 11:59 PM.</li>
        <li><strong>Repository Verification:</strong> Ensure your GitHub repository is public with an updated README.</li>
        <li><strong>Mentorship Sessions:</strong> Check the portal dashboard for your assigned mentor slot.</li>
      </ul>
      <p>If you encounter any technical issues, please contact your team coordinator directly.</p>
      <p>Best regards,<br><strong>SIH Organizing Committee</strong></p>
    `;

    updateInboxPreview();
    App.showToast('Sample template loaded.', 'success');
  }

  // ── Rich Editor Toolbar ────────────────────────────────────────────
  function initToolbar() {
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('mousedown', e => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        if (cmd) document.execCommand(cmd, false, null);
        updateToolbarState();
      });
    });

    const fontSelect = document.getElementById('fontSizeSelect');
    if (fontSelect) {
      fontSelect.addEventListener('change', e => {
        document.execCommand('fontSize', false, e.target.value);
      });
    }

    const colorSelect = document.getElementById('fontColorSelect');
    if (colorSelect) {
      colorSelect.addEventListener('change', e => {
        document.execCommand('foreColor', false, e.target.value);
      });
    }

    const editor = document.getElementById('emailBody');
    if (editor) {
      editor.addEventListener('keyup',   updateToolbarState);
      editor.addEventListener('mouseup', updateToolbarState);
      editor.addEventListener('input',   updateInboxPreview);
    }
  }

  function updateToolbarState() {
    document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
      try {
        btn.classList.toggle('active', document.queryCommandState(btn.dataset.cmd));
      } catch (_) {}
    });
  }

  // ── Init ───────────────────────────────────────────────────────────
  function init() {
    initToolbar();

    ['senderName', 'emailSubject'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateInboxPreview);
    });

    const subjectInput = document.getElementById('emailSubject');
    const charCount    = document.getElementById('subjectCharCount');
    if (subjectInput && charCount) {
      subjectInput.addEventListener('input', () => {
        const len = subjectInput.value.length;
        charCount.textContent = len;
        charCount.style.color = len > 130 ? 'var(--danger)' : len > 100 ? 'var(--warning)' : 'var(--text-disabled)';
        checkSpamRisk();
      });
    }

    const bannerFileInput = document.getElementById('bannerFileInput');
    const bannerUploadBtn = document.getElementById('bannerUploadBtn');
    if (bannerUploadBtn && bannerFileInput) {
      bannerUploadBtn.addEventListener('click', () => bannerFileInput.click());
    }

    if (bannerFileInput) {
      bannerFileInput.addEventListener('change', () => {
        const file = bannerFileInput.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          App.showToast('Please select an image file (PNG, JPG, WebP, GIF)', 'error');
          return;
        }
        if (file.size > 8 * 1024 * 1024) {
          App.showToast('Banner file must be smaller than 8 MB', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          const commaIdx = dataUrl.indexOf(',');
          if (commaIdx !== -1) {
            state.bannerBase64 = dataUrl.substring(commaIdx + 1);
            state.bannerMimeType = file.type || 'image/jpeg';
          }
          setBanner(dataUrl);
          App.showToast(`Banner uploaded: ${file.name}`, 'success');
        };
        reader.readAsDataURL(file);
      });
    }

    const closeBannerPreview = document.getElementById('closeBannerPreview');
    if (closeBannerPreview) {
      closeBannerPreview.addEventListener('click', removeBanner);
    }

    // Load Sample Template Button
    const sampleBtn = document.getElementById('loadSampleTemplateBtn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', loadSampleTemplate);
    }

    // Attachment
    const attachInput   = document.getElementById('attachmentInput');
    const attachZone    = document.getElementById('attachDropZone');
    const removeAttach  = document.getElementById('removeAttachBtn');

    if (attachZone && attachInput) {
      attachZone.addEventListener('click', () => attachInput.click());
      attachInput.addEventListener('change', () => handleAttachment(attachInput.files[0]));

      ['dragenter','dragover'].forEach(evt => {
        attachZone.addEventListener(evt, e => { e.preventDefault(); attachZone.classList.add('dragging'); });
      });
      ['dragleave','drop'].forEach(evt => {
        attachZone.addEventListener(evt, e => { e.preventDefault(); attachZone.classList.remove('dragging'); });
      });
      attachZone.addEventListener('drop', e => {
        e.preventDefault();
        attachZone.classList.remove('dragging');
        if (e.dataTransfer && e.dataTransfer.files.length) {
          handleAttachment(e.dataTransfer.files[0]);
        }
      });
    }

    if (removeAttach) {
      removeAttach.addEventListener('click', removeAttachment);
    }

    updateInboxPreview();
  }

  function reset() {
    removeBanner();
    removeAttachment();

    const senderName = document.getElementById('senderName');
    const emailSubject = document.getElementById('emailSubject');
    const emailBody = document.getElementById('emailBody');
    const bannerFileInput = document.getElementById('bannerFileInput');
    const subjectCharCount = document.getElementById('subjectCharCount');
    const spamAlert = document.getElementById('spamRiskAlert');

    if (senderName) senderName.value = '';
    if (emailSubject) emailSubject.value = '';
    if (emailBody) emailBody.innerHTML = '';
    if (bannerFileInput) bannerFileInput.value = '';
    if (subjectCharCount) subjectCharCount.textContent = '0';
    if (spamAlert) spamAlert.setAttribute('hidden', '');

    updateInboxPreview();
  }

  return { init, getData, validate, setBanner, removeBanner, loadSampleTemplate, ensureBannerReady, reset };
})();
