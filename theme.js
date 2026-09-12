/*
 * Shared theme (light/dark/system) foundation for static HTML pages.
 * Include this in <head>, before common.css's effect is painted, to avoid a flash:
 *
 *   <script src="theme.js"></script>
 *
 * Theme choice ("system" | "light" | "dark") is persisted in a cookie
 * and applied as document.documentElement[data-theme].
 * common.css reads that attribute to pick the right CSS variables.
 */
(function (global) {
  const COOKIE_NAME = 'theme';
  const COOKIE_MAX_AGE_DAYS = 365;
  const VALID = ['system', 'light', 'dark'];

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function apply(theme) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function getTheme() {
    const saved = getCookie(COOKIE_NAME);
    return VALID.includes(saved) ? saved : 'system';
  }

  function setTheme(theme) {
    if (!VALID.includes(theme)) return;
    setCookie(COOKIE_NAME, theme, COOKIE_MAX_AGE_DAYS);
    apply(theme);
    document.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme } }));
  }

  apply(getTheme());

  global.THEME = { getTheme, setTheme };
})(window);
