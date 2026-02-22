/* consent-gate.js — Law & Learning
   Lightweight GDPR-compliant analytics consent gate.
   No scripts load before explicit consent. Default = decline. */
(function () {
  'use strict';

  var GA_ID = 'G-8W7WL8NF0';
  var AHREFS_KEY = '/mVLMGqa1tEN9pmcQJq/zg';
  var STORE = 'analytics_consent';

  /* ── state ── */
  function get()  { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(STORE, v); }    catch (e) {} }

  /* ── loaders ── */
  function loadGA() {
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function loadAhrefs() {
    if (!AHREFS_KEY || document.querySelector('script[src*="ahrefs"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://analytics.ahrefs.com/analytics.js';
    s.setAttribute('data-key', AHREFS_KEY);
    document.head.appendChild(s);
  }

  function loadAll() { loadGA(); loadAhrefs(); }

  /* ── banner ── */
  function css() {
    var el = document.createElement('style');
    el.textContent =
      '#cg-banner{position:fixed;bottom:0;left:0;right:0;z-index:10000;' +
      'background:rgba(15,20,30,.97);color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;' +
      'font-size:14px;line-height:1.5;padding:16px 24px;display:flex;align-items:center;' +
      'justify-content:center;gap:16px;flex-wrap:wrap;box-shadow:0 -2px 12px rgba(0,0,0,.3)}' +
      '#cg-banner p{margin:0;flex:1 1 320px}' +
      '.cg-btn{border:none;border-radius:6px;padding:8px 20px;font-size:13px;font-weight:600;' +
      'cursor:pointer;transition:opacity .2s}' +
      '.cg-btn--accept{background:#3b82f6;color:#fff}' +
      '.cg-btn--decline{background:transparent;color:#94a3b8;border:1px solid #475569}' +
      '.cg-btn:hover{opacity:.85}' +
      '@media(max-width:600px){#cg-banner{flex-direction:column;text-align:center;gap:12px}' +
      '#cg-banner p{flex:none}}';
    document.head.appendChild(el);
  }

  function show() {
    css();
    var b = document.createElement('div');
    b.id = 'cg-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie consent');
    b.innerHTML =
      '<p>This site uses analytics cookies to understand how it is used. You can accept or decline.</p>' +
      '<button class="cg-btn cg-btn--decline" id="cg-decline">Decline</button>' +
      '<button class="cg-btn cg-btn--accept" id="cg-accept">Accept analytics</button>';
    document.body.appendChild(b);
    document.getElementById('cg-accept').addEventListener('click', function () {
      set('accepted'); loadAll(); b.remove();
    });
    document.getElementById('cg-decline').addEventListener('click', function () {
      set('declined'); b.remove();
    });
  }

  /* ── public: footer "Cookie settings" link ── */
  window.resetAnalyticsConsent = function () {
    try { localStorage.removeItem(STORE); } catch (e) {}
    location.reload();
  };

  /* ── init ── */
  var c = get();
  if (c === 'accepted') { loadAll(); }
  else if (!c) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }
})();
