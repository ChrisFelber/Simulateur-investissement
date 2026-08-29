(function () {
  'use strict';

  var modes = ['system', 'light', 'dark'];
  var icons = { system: '◐', light: '☀', dark: '☾' };
  var labels = {
    fr: { system: 'Système', light: 'Clair', dark: 'Sombre', prefix: 'Thème' },
    de: { system: 'System', light: 'Hell', dark: 'Dunkel', prefix: 'Design' },
    en: { system: 'System', light: 'Light', dark: 'Dark', prefix: 'Theme' }
  };
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function getLanguage() {
    if (window.InvestmentI18n && window.InvestmentI18n.getLanguage) {
      return window.InvestmentI18n.getLanguage();
    }
    return 'fr';
  }

  function loadMode() {
    try {
      var saved = sessionStorage.getItem('investment-theme');
      if (modes.indexOf(saved) !== -1) return saved;
    } catch (error) {}
    return 'system';
  }

  var currentMode = loadMode();

  function resolvedTheme() {
    if (currentMode === 'system') return media.matches ? 'dark' : 'light';
    return currentMode;
  }

  function updateButton() {
    var button = document.getElementById('theme-button');
    if (!button) return;
    var language = getLanguage();
    var copy = labels[language] || labels.fr;
    button.textContent = icons[currentMode];
    button.setAttribute('aria-label', copy.prefix + ' : ' + copy[currentMode]);
    button.setAttribute('title', copy.prefix + ' : ' + copy[currentMode]);
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', resolvedTheme());
    document.documentElement.setAttribute('data-theme-mode', currentMode);
    updateButton();
  }

  function setMode(mode) {
    if (modes.indexOf(mode) === -1) return;
    currentMode = mode;
    try { sessionStorage.setItem('investment-theme', currentMode); } catch (error) {}
    applyTheme();
  }

  function nextMode() {
    var index = modes.indexOf(currentMode);
    setMode(modes[(index + 1) % modes.length]);
  }

  function init() {
    var button = document.getElementById('theme-button');
    if (button) button.addEventListener('click', nextMode);
    applyTheme();
  }

  if (media.addEventListener) {
    media.addEventListener('change', function () {
      if (currentMode === 'system') applyTheme();
    });
  } else if (media.addListener) {
    media.addListener(function () {
      if (currentMode === 'system') applyTheme();
    });
  }

  document.addEventListener('investment-language-change', updateButton);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.InvestmentTheme = Object.freeze({
    setMode: setMode,
    nextMode: nextMode,
    applyTheme: applyTheme,
    getMode: function () { return currentMode; },
    getResolvedTheme: resolvedTheme,
    updateButton: updateButton
  });
}());
