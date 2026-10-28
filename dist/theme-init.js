(() => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let selectedTheme = systemTheme;

  try {
    const savedTheme = localStorage.getItem('icosta-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') selectedTheme = savedTheme;
  } catch {
    // The system preference remains available when storage is blocked.
  }

  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.style.colorScheme = selectedTheme;
})();
