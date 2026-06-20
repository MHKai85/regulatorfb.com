// Regulator public document newsletter prompt A/B test.
// Privacy posture: sessionStorage only, no cookies, no third-party analytics.
(function () {
  'use strict';
  try {
    var path = window.location.pathname || '';
    if (!/^\/doc\//.test(path)) return;

    var params = new URLSearchParams(window.location.search || '');
    var forcedVariant = params.get('regulator_doc_prompt');
    var debug = params.get('regulator_doc_prompt_debug') === '1';
    var referrer = (document.referrer || '').toLowerCase();
    var likelySearch = !referrer || /(google\.|bing\.|duckduckgo\.|yahoo\.|ecosia\.|brave\.com\/search)/.test(referrer);
    if (!likelySearch && forcedVariant !== 'prompt') return;

    var storage = window.sessionStorage;
    var variantKey = 'regulator_doc_prompt_variant_v1';
    var dismissedKey = 'regulator_doc_prompt_dismissed_v1';
    if (storage.getItem(dismissedKey) === '1' && forcedVariant !== 'prompt') return;

    var variant = forcedVariant || storage.getItem(variantKey);
    if (!variant) {
      variant = Math.random() < 0.5 ? 'control' : 'prompt';
      storage.setItem(variantKey, variant);
    }
    if (variant !== 'prompt') return;

    var style = document.createElement('style');
    style.textContent = `
      .doc-prompt-ab {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: min(360px, calc(100vw - 32px));
        background: #fff;
        color: #1e293b;
        border: 1px solid #e5ded2;
        box-shadow: 0 18px 45px rgba(15, 36, 64, 0.18);
        border-radius: 6px;
        padding: 18px;
        z-index: 50;
        transform: translateY(18px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.18s ease, transform 0.18s ease;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .doc-prompt-ab.is-visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
      .doc-prompt-ab__label {
        color: #9a4a1d;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .doc-prompt-ab h2 {
        font-family: 'Source Serif 4', Georgia, serif;
        color: #1a365d;
        font-size: 21px;
        line-height: 1.25;
        margin: 0 20px 8px 0;
      }
      .doc-prompt-ab p { color: #64748b; font-size: 14px; line-height: 1.45; margin: 0 0 14px; }
      .doc-prompt-ab__actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
      .doc-prompt-ab__primary {
        display: inline-block;
        background: #c05621;
        color: #fff;
        padding: 10px 14px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
      }
      .doc-prompt-ab__primary:hover { background: #9a4a1d; }
      .doc-prompt-ab__secondary { color: #1a365d; font-size: 13px; font-weight: 700; text-decoration: none; }
      .doc-prompt-ab__close {
        position: absolute;
        top: 8px;
        right: 10px;
        border: 0;
        background: transparent;
        color: #94a3b8;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
      }
      .doc-prompt-ab__close:hover { color: #1e293b; }
      @media (max-width: 640px) {
        .doc-prompt-ab { left: 16px; right: 16px; bottom: 16px; width: auto; }
      }
    `;
    document.head.appendChild(style);

    var prompt = document.createElement('div');
    prompt.className = 'doc-prompt-ab';
    prompt.setAttribute('aria-live', 'polite');
    prompt.hidden = true;
    prompt.innerHTML = [
      '<button class="doc-prompt-ab__close" type="button" aria-label="Dismiss newsletter prompt">&times;</button>',
      '<div class="doc-prompt-ab__label">Weekly F&amp;B regulatory briefing</div>',
      '<h2>Useful source? Get the weekly signal.</h2>',
      '<p>Regulator turns public FDA, USDA, FTC, and Federal Register items into a short operator-ready briefing.</p>',
      '<div class="doc-prompt-ab__actions">',
      '<a class="doc-prompt-ab__primary" href="https://regulatorfb.com/newsletter/?utm_source=organic_search_doc&utm_medium=doc_prompt&utm_campaign=newsletter_ab&utm_content=variant_prompt">Get the briefing</a>',
      '<a class="doc-prompt-ab__secondary" href="https://regulatorfb.com/?utm_source=organic_search_doc&utm_medium=doc_prompt&utm_campaign=newsletter_ab&utm_content=variant_prompt_beta#signup">Request beta access</a>',
      '</div>'
    ].join('');
    document.body.appendChild(prompt);

    var shown = false;
    function showPrompt() {
      if (shown) return;
      shown = true;
      prompt.hidden = false;
      window.setTimeout(function () { prompt.classList.add('is-visible'); }, 20);
    }
    function maybeShowOnScroll() {
      var doc = document.documentElement;
      var scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      if ((window.scrollY || doc.scrollTop || 0) / scrollable >= 0.55) showPrompt();
    }

    window.setTimeout(showPrompt, debug ? 250 : 25000);
    window.addEventListener('scroll', maybeShowOnScroll, { passive: true });
    prompt.querySelector('.doc-prompt-ab__close').addEventListener('click', function () {
      storage.setItem(dismissedKey, '1');
      prompt.classList.remove('is-visible');
      window.setTimeout(function () { prompt.hidden = true; }, 200);
    });
  } catch (err) {}
})();
