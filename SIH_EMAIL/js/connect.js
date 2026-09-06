/**
 * connect.js — Fixed Google Apps Script Web App Connection Configuration
 */
const CONNECT_CONFIG = {
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwHagHGgEvYb9qmt91QRjqGJzKcA-soTmXzv84V2OBlR4Eb74Z5vArNMX216BHFl8naPg/exec'
};

window.CONNECT_CONFIG = CONNECT_CONFIG;
window.CONFIG = window.CONFIG || {};
window.CONFIG.GAS_URL = CONNECT_CONFIG.WEB_APP_URL;
