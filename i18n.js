/*
 * Shared i18n foundation for static HTML pages.
 * Usage in a page:
 *
 *   <script src="i18n.js"></script>
 *   <script>
 *     I18N.init({
 *       en: { title: "Card Details", name: "Cardholder Name" },
 *       ja: { title: "カード情報", name: "カード名義人" }
 *     });
 *   </script>
 *
 * Mark translatable text with data-i18n="key" (sets textContent)
 * or data-i18n-placeholder="key" (sets the placeholder attribute).
 * Language is persisted in a cookie so it carries across pages.
 */
(function (global) {
  const COOKIE_NAME = 'lang';
  const DEFAULT_LANG = 'en';
  const COOKIE_MAX_AGE_DAYS = 365;

  let translations = {};
  let currentLang = DEFAULT_LANG;

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function applyTranslations() {
    const dict = translations[currentLang] || translations[DEFAULT_LANG] || {};

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    document.documentElement.setAttribute('lang', currentLang);
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: currentLang } }));
  }

  function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    setCookie(COOKIE_NAME, lang, COOKIE_MAX_AGE_DAYS);
    applyTranslations();
  }

  function init(dict, defaultLang) {
    translations = dict || {};
    const saved = getCookie(COOKIE_NAME);
    const fallback = defaultLang || DEFAULT_LANG;
    currentLang = (saved && translations[saved]) ? saved : (translations[fallback] ? fallback : Object.keys(translations)[0]);
    applyTranslations();
  }

  global.I18N = {
    init,
    setLang,
    getLang: () => currentLang,
    t: (key) => (translations[currentLang] && translations[currentLang][key]) || key
  };
})(window);
