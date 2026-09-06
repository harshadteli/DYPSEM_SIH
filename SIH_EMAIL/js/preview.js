/**
 * preview.js — Email Preview Module
 * Generates an email client-compatible table-based HTML template
 * and renders it in the preview iframe.
 * Handles desktop / mobile toggle.
 * Keeps the template simple and compatible; inbox placement is controlled by
 * recipient and sender reputation as well as domain authentication.
 */

const Preview = (() => {

  // ── Helper: Remove all hyperlinks from HTML to eliminate spam risk ──
  function removeLinks(html) {
    if (!html) return '';
    return String(html).replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
  }

  // ── Build the HTML email template ──
  function buildEmailHtml({ senderName, subject, bannerBase64, bannerMimeType, bodyHtml }) {

    const cleanSender  = (senderName || '').trim() || 'Sender';
    const cleanSubject = (subject || '').trim() || 'Important Notification';
    const safeBodyHtml = removeLinks(bodyHtml);
    const currentYear  = new Date().getFullYear();
    const bannerAlt    = cleanSubject.length > 3 ? cleanSubject : `${cleanSender} notification banner`;

    // Only embed inline base64 — avoids Gmail showing banner as a bottom attachment
    let bannerSrc = '';
    if (bannerBase64) {
      bannerSrc = `data:${bannerMimeType || 'image/jpeg'};base64,${bannerBase64}`;
    }

    // Banner table row
    const bannerRow = bannerSrc
      ? `
        <tr>
          <td align="center" style="padding:0;margin:0;line-height:0;font-size:0;background-color:#ffffff;border-bottom:1px solid #e8eaed;">
            <img
              id="emailBannerImg"
              src="${escAttr(bannerSrc)}"
              alt="${escAttr(bannerAlt)}"
              width="600"
              style="width:100%;max-width:600px;height:auto;display:block;border:0;outline:none;text-decoration:none;margin:0 auto;vertical-align:bottom;"
            />
          </td>
        </tr>`
      : '';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <title>${escHtml(cleanSubject)}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
    body {
      margin:0 !important;
      padding:0 !important;
      background-color:#f1f3f4;
      font-family:Roboto,Arial,'Helvetica Neue',Helvetica,sans-serif;
      color:#202124;
    }
    .email-content h1, .email-content h2, .email-content h3 {
      color:#202124; margin:0 0 12px 0; line-height:1.3;
    }
    .email-content p { margin:0 0 14px 0; color:#202124; font-size:15px; line-height:1.6; }
    .email-content ul, .email-content ol { padding-left:20px; margin:0 0 14px 0; }
    .email-content li { margin-bottom:6px; font-size:15px; }
    @media screen and (max-width:620px) {
      .email-outer { width:100% !important; border-radius:0 !important; }
      .email-pad { padding:20px 16px !important; }
      .foot-pad { padding:18px 16px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f3f4;">

  <!-- Preheader text (Invisible to viewer, gives Gmail a legitimate preview snippet) -->
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${escHtml(cleanSubject)} — Update from ${escHtml(cleanSender)}
  </div>

  <!-- Wrapper Table -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f3f4;width:100%;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!-- Main Email Card -->
        <table role="presentation" class="email-outer" width="600" cellspacing="0" cellpadding="0" border="0"
               style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(60,64,67,.15);max-width:600px;border-collapse:separate;border:1px solid #e0e0e0;">

          <!-- Top Blue Accent -->
          <tr>
            <td style="background-color:#1a73e8;height:6px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          ${bannerRow}

          <!-- Header Section -->
          <tr>
            <td style="padding:24px 32px 12px;background-color:#ffffff;border-bottom:1px solid #f1f3f4;">
              <h1 style="margin:0 0 4px 0;font-size:20px;font-weight:600;color:#202124;line-height:1.3;">
                ${escHtml(cleanSubject)}
              </h1>
              <p style="margin:0;font-size:13px;color:#5f6368;">
                From <strong>${escHtml(cleanSender)}</strong>
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="email-pad" style="padding:24px 32px 24px;background-color:#ffffff;">
              <div class="email-content" style="font-size:15px;line-height:1.65;color:#202124;">
                ${safeBodyHtml || '<p>Hello,</p><p>Please find the latest update regarding this message.</p>'}
              </div>
            </td>
          </tr>

          <!-- Friendly footer -->
          <tr>
            <td class="foot-pad" style="padding:20px 32px 24px;background-color:#f8f9fa;border-top:1px solid #ebebeb;text-align:center;font-size:12px;color:#5f6368;line-height:1.5;">

              <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#202124;">
                ${escHtml(cleanSender)}
              </p>

              <div style="padding:10px 16px;margin:8px 0;background-color:#ffffff;border-radius:6px;border:1px solid #e8eaed;text-align:center;font-size:12px;color:#5f6368;line-height:1.5;">
                Sent by ${escHtml(cleanSender)}. If you have questions, please reply to this email.
              </div>

              <p style="margin:8px 0 0 0;font-size:11px;color:#9aa0a6;">
                © ${currentYear} All rights reserved.
              </p>

            </td>
          </tr>

        </table>
        <!-- /Main Email Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
  }

  // ── HTML escape helpers ──────────────────────────────────────────
  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escAttr(s) {
    return String(s || '').replace(/"/g, '&quot;');
  }

  // ── Render into iframe (Browser view) ─────────────────────────────
  function render(data) {
    const html   = buildEmailHtml(data);
    const iframe = document.getElementById('previewIframe');
    if (!iframe) return;
    // srcdoc avoids file:// cross-origin errors when opening index.html locally
    iframe.srcdoc = html;
  }

  // ── Toggle desktop / mobile ────────────────────────────────────────
  function initToggle() {
    const wrapper = document.getElementById('previewDeviceWrapper');
    const btnDesk = document.getElementById('toggleDesktop');
    const btnMob  = document.getElementById('toggleMobile');

    if (btnDesk && wrapper) {
      btnDesk.addEventListener('click', () => {
        wrapper.classList.remove('mobile');
        wrapper.classList.add('desktop');
        btnDesk.classList.add('active');
        if (btnMob) btnMob.classList.remove('active');
      });
    }

    if (btnMob && wrapper) {
      btnMob.addEventListener('click', () => {
        wrapper.classList.remove('desktop');
        wrapper.classList.add('mobile');
        btnMob.classList.add('active');
        if (btnDesk) btnDesk.classList.remove('active');
      });
    }
  }

  // ── Get HTML for sending to Gmail (inline base64 banner at top) ───
  function getHtml(data) {
    return buildEmailHtml(data);
  }

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    initToggle();
  }

  return { init, render, getHtml, buildEmailHtml, removeLinks };
})();
