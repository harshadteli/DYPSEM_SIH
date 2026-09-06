/**
 * conect.js — Fixed Google Apps Script Web App Connection Configuration
 */
const GAS_CONFIG = {
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwHagHGgEvYb9qmt91QRjqGJzKcA-soTmXzv84V2OBlR4Eb74Z5vArNMX216BHFl8naPg/exec'
};

// Also expose globally under CONFIG for convenience
window.GAS_CONFIG = GAS_CONFIG;
window.CONFIG = window.CONFIG || {};
window.CONFIG.GAS_URL = GAS_CONFIG.WEB_APP_URL;
