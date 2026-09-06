# Professional Bulk Email System

A fully web-based, low-cost professional bulk email sender built with **HTML5 + CSS3 + JavaScript** on the frontend and **Google Apps Script + Gmail + Google Sheets** on the backend.

---

## 🗂️ Project Structure

```
SIH_EMAIL/
├── index.html              ← Main multi-step web app (single page)
├── css/
│   └── style.css           ← Google Light Theme · Fully Responsive
├── js/
│   ├── conect.js           ← Fixed Google Apps Script Web App URL
│   ├── connect.js          ← Mirror config for connectivity
│   ├── api.js              ← GAS API calls (fetch wrapper)
│   ├── recipients.js       ← Recipient management (add/paste/CSV/chips)
│   ├── composer.js         ← Email composer (Base64 canvas compression, spam risk checker, banner upload)
│   ├── preview.js          ← Desktop/mobile email preview (dual-mode CID rendering, clean footer)
│   └── app.js              ← Main controller (steps, modals, toasts)
├── gas/
│   └── Code.gs             ← Google Apps Script backend (CID inline MIME image embedding, GmailApp)
└── README.md               ← This file
```

---

## ⚡ How to Deploy Updates in Google Apps Script (CRITICAL)

When you make changes to `gas/Code.gs`, Google Apps Script in the cloud **DOES NOT auto-update**. You must deploy a **New Version**:

1. Open [script.google.com](https://script.google.com) and select your project.
2. Paste the entire content of [`gas/Code.gs`](file:///c:/Academi-Projects/SIH_EMAIL/gas/Code.gs) into the editor.
3. Click **Save** (Ctrl + S).
4. Click **Deploy → Manage Deployments**.
5. Click the **Edit (pencil icon)** next to your active Web App.
6. Under **Version**, choose **"New version"**.
7. Click **Deploy** → **Done**.

---

## 🖼️ Reliable banner embedding

1. **Client-Side Canvas Compression**: When an image is uploaded or a URL is entered, the browser resizes it to max 600px width and compresses it into a clean, lightweight JPEG/PNG Base64 string.
2. **CID Inline MIME Attachment**: Instead of relying on external URLs (which Google Image Proxy frequently blocks with a broken image icon), `gas/Code.gs` embeds the image directly into the email payload via `inlineImages: { bannerImg: blob }`.
3. **Works in All Email Clients**: The recipient’s Gmail (Android, iPhone, Web), Outlook, and Apple Mail render the image locally from the email payload without making external HTTP requests.

---

## 🛡️ Deliverability rules

Gmail’s automated spam filter evaluates sender reputation, authentication, engagement,
content, and sending patterns. The application cannot guarantee inbox placement:
1. Use a clear subject that helps recipients recognize the message (e.g. `Smart India Hackathon 2024 — Project Guidelines`).
2. Add enough context in the body for recipients to understand why they received it.
4. Use the **"✨ Load Sample Template"** button in Step 2 for a complete, descriptive template.
5. Publish SPF, DKIM, and DMARC for the domain used by the Google account sending the mail.
6. Start with a small, consented test list and increase volume gradually. Do not send unsolicited bulk email.

Gmail may still place a message in Spam when the sender account or domain has a poor
reputation, recipients have reported similar messages, or authentication is missing.
Recipients should use **Report as not spam** only when the message is expected.
