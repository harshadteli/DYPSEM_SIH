/* =======================================================================
   auth.js  Login Gate for BulkMail
   Credentials checked client-side. Session persisted in localStorage.
   ======================================================================= */

(function () {
  "use strict";

  /* Credentials */
  var AUTH_EMAIL    = "harshtech417@gmail.com";
  var AUTH_PASSWORD = "harsh123";
  var SESSION_KEY   = "bulkmail_session";
  var SESSION_TTL   = 8 * 60 * 60 * 1000;   // 8 hours

  /* DOM refs (set after DOMContentLoaded) */
  var loginScreen, loginForm, emailInput, passwordInput,
      toggleBtn, loginError, loginErrorMsg,
      submitBtn, btnText, btnLoader, appContent;

  /* ── Session helpers ─────────────────────────────────────────────── */
  function saveSession() {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      loggedIn: true,
      expiry: Date.now() + SESSION_TTL
    }));
  }

  function isSessionValid() {
    try {
      var s = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
      return s.loggedIn === true && s.expiry > Date.now();
    } catch (e) { return false; }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  /* ── UI helpers ──────────────────────────────────────────────────── */
  function showError(msg) {
    loginErrorMsg.textContent = msg;
    loginError.removeAttribute("hidden");
    var card = loginScreen.querySelector(".login-card");
    card.classList.add("login-shake");
    setTimeout(function () { card.classList.remove("login-shake"); }, 600);
  }

  function hideError() {
    loginError.setAttribute("hidden", "");
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    btnText.style.display   = on ? "none" : "";
    if (on) {
      btnLoader.removeAttribute("hidden");
    } else {
      btnLoader.setAttribute("hidden", "");
    }
  }

  /* ── Show / hide app ─────────────────────────────────────────────── */
  function revealApp() {
    loginScreen.style.opacity   = "0";
    loginScreen.style.transform = "scale(1.04)";
    setTimeout(function () { loginScreen.style.display = "none"; }, 380);
    appContent.forEach(function (el) { el.removeAttribute("hidden"); });
    setTimeout(addLogoutButton, 420);
  }

  function showLogin() {
    loginScreen.style.display = "flex";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        loginScreen.style.opacity   = "1";
        loginScreen.style.transform = "scale(1)";
        emailInput.focus();
      });
    });
    appContent.forEach(function (el) { el.setAttribute("hidden", ""); });
  }

  /* ── Login handler ───────────────────────────────────────────────── */
  function handleLogin(e) {
    e.preventDefault();
    hideError();

    var email = emailInput.value.trim().toLowerCase();
    var pass  = passwordInput.value;

    setLoading(true);

    setTimeout(function () {
      if (email === AUTH_EMAIL.toLowerCase() && pass === AUTH_PASSWORD) {
        saveSession();
        revealApp();
      } else {
        setLoading(false);
        if (email !== AUTH_EMAIL.toLowerCase()) {
          showError("No account found with this email address.");
          emailInput.focus();
        } else {
          showError("Incorrect password. Please try again.");
          passwordInput.value = "";
          passwordInput.focus();
        }
      }
    }, 700);
  }

  /* ── Toggle password visibility ─────────────────────────────────── */
  function togglePasswordVisibility() {
    var isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    var eyeIcon = document.getElementById("eyeIcon");
    if (isHidden) {
      eyeIcon.innerHTML =
        '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M1 1l22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    } else {
      eyeIcon.innerHTML =
        '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>' +
        '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>';
    }
  }

  /* ── Add Logout button to header ─────────────────────────────────── */
  function addLogoutButton() {
    if (document.getElementById("logoutBtn")) return;
    var headerActions = document.querySelector(".header-actions");
    if (!headerActions) return;

    var logoutBtn = document.createElement("button");
    logoutBtn.className = "btn-icon";
    logoutBtn.id        = "logoutBtn";
    logoutBtn.title     = "Logout";
    logoutBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none">' +
        '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>' +
      '<span>Logout</span>';

    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        clearSession();
        emailInput.value      = "";
        passwordInput.value   = "";
        passwordInput.type    = "password";
        /* reset eye icon */
        var eyeIcon = document.getElementById("eyeIcon");
        if (eyeIcon) {
          eyeIcon.innerHTML =
            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>';
        }
        hideError();
        setLoading(false);
        showLogin();
      }
    });

    headerActions.appendChild(logoutBtn);
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  function init() {
    loginScreen   = document.getElementById("loginScreen");
    loginForm     = document.getElementById("loginForm");
    emailInput    = document.getElementById("loginEmail");
    passwordInput = document.getElementById("loginPassword");
    toggleBtn     = document.getElementById("togglePassword");
    loginError    = document.getElementById("loginError");
    loginErrorMsg = document.getElementById("loginErrorMsg");
    submitBtn     = document.getElementById("loginSubmitBtn");
    btnText       = document.getElementById("loginBtnText");
    btnLoader     = document.getElementById("loginBtnLoader");

    appContent = [
      document.querySelector(".app-header"),
      document.querySelector(".stepper-wrapper"),
      document.querySelector(".main-content"),
      document.getElementById("historyModal"),
      document.getElementById("settingsModal"),
      document.getElementById("toastContainer")
    ].filter(Boolean);

    /* Transition style for login screen */
    loginScreen.style.transition = "opacity 0.35s ease, transform 0.35s ease";

    /* Event wiring */
    loginForm.addEventListener("submit",  handleLogin);
    toggleBtn.addEventListener("click",   togglePasswordVisibility);
    emailInput.addEventListener("input",  hideError);
    passwordInput.addEventListener("input", hideError);

    /* Already logged in? Skip login screen */
    if (isSessionValid()) {
      loginScreen.style.display = "none";
      appContent.forEach(function (el) { el.removeAttribute("hidden"); });
      addLogoutButton();
    } else {
      /* Hide app and fade-in login */
      appContent.forEach(function (el) { el.setAttribute("hidden", ""); });
      loginScreen.style.opacity   = "0";
      loginScreen.style.transform = "scale(0.97)";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          loginScreen.style.opacity   = "1";
          loginScreen.style.transform = "scale(1)";
          emailInput.focus();
        });
      });
    }
  }

  /* Wait for DOM */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
