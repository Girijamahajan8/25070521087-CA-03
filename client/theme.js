(() => {
  const themeKey = 'studysphere_theme';
  const toggle = document.querySelector('#theme-toggle');
  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-mode', isLight);
    if (toggle) {
      toggle.textContent = isLight ? 'Switch to dark theme' : 'Switch to light theme';
      toggle.setAttribute('aria-label', toggle.textContent);
      toggle.setAttribute('aria-pressed', String(isLight));
    }
  };

  applyTheme(localStorage.getItem(themeKey) === 'light' ? 'light' : 'dark');
  if (toggle) {
    toggle.onclick = () => {
      const theme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
      localStorage.setItem(themeKey, theme);
      applyTheme(theme);
    };
  }
})();
