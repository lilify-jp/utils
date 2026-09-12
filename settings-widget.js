/*
 * Floating settings widget (language + theme), shared across all tool pages.
 * Requires theme.js and i18n.js to be loaded first.
 *
 * Usage: <script src="settings-widget.js"></script>  (near the end of <body>)
 */
(function () {
  const STRINGS = {
    en: {
      title: 'Settings',
      language: 'Language',
      appearance: 'Appearance',
      system: 'System',
      light: 'Light',
      dark: 'Dark'
    },
    ja: {
      title: '設定',
      language: '言語',
      appearance: '表示モード',
      system: 'システムに合わせる',
      light: 'ライトモード',
      dark: 'ダークモード'
    }
  };

  function t(key) {
    const lang = window.I18N ? window.I18N.getLang() : 'en';
    return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key];
  }

  const style = document.createElement('style');
  style.textContent = `
    .settings-fab {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      box-shadow: 0 4px 12px var(--shadow);
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .settings-popup {
      position: fixed;
      right: 20px;
      bottom: 78px;
      width: 240px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: 0 8px 24px var(--shadow);
      padding: 16px;
      z-index: 1000;
      display: none;
    }
    .settings-popup.open {
      display: block;
    }
    .settings-popup h2 {
      font-size: 14px;
      margin: 0 0 14px;
      color: var(--text);
    }
    .settings-popup .settings-row {
      margin-bottom: 12px;
    }
    .settings-popup .settings-row:last-child {
      margin-bottom: 0;
    }
    .settings-popup label {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .settings-popup select {
      width: 100%;
      padding: 8px 10px;
      font-size: 14px;
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 6px;
    }
    .settings-popup select:focus {
      outline: none;
      border-color: var(--accent);
    }
  `;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'settings-fab';
  fab.setAttribute('aria-label', 'Settings');
  fab.textContent = '⚙';

  const popup = document.createElement('div');
  popup.className = 'settings-popup';
  popup.innerHTML = `
    <h2 data-role="title"></h2>
    <div class="settings-row">
      <label data-role="language-label"></label>
      <select data-role="lang-select">
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>
    <div class="settings-row">
      <label data-role="appearance-label"></label>
      <select data-role="theme-select">
        <option value="system" data-role="theme-system"></option>
        <option value="light" data-role="theme-light"></option>
        <option value="dark" data-role="theme-dark"></option>
      </select>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(popup);

  const langSelect = popup.querySelector('[data-role="lang-select"]');
  const themeSelect = popup.querySelector('[data-role="theme-select"]');

  function refreshTexts() {
    popup.querySelector('[data-role="title"]').textContent = t('title');
    popup.querySelector('[data-role="language-label"]').textContent = t('language');
    popup.querySelector('[data-role="appearance-label"]').textContent = t('appearance');
    popup.querySelector('[data-role="theme-system"]').textContent = t('system');
    popup.querySelector('[data-role="theme-light"]').textContent = t('light');
    popup.querySelector('[data-role="theme-dark"]').textContent = t('dark');
  }

  function syncValues() {
    langSelect.value = window.I18N ? window.I18N.getLang() : 'en';
    themeSelect.value = window.THEME ? window.THEME.getTheme() : 'system';
  }

  refreshTexts();
  syncValues();

  fab.addEventListener('click', () => {
    popup.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== fab) {
      popup.classList.remove('open');
    }
  });

  langSelect.addEventListener('change', () => {
    if (window.I18N) window.I18N.setLang(langSelect.value);
    refreshTexts();
  });

  themeSelect.addEventListener('change', () => {
    if (window.THEME) window.THEME.setTheme(themeSelect.value);
  });

  document.addEventListener('i18n:changed', () => {
    refreshTexts();
  });
})();
