(() => {
  const body = document.body;
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const progress = document.querySelector('[data-progress]');

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('open');
    body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('open', !open);
    body.classList.toggle('menu-open', !open);
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const updateScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 28);
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0;
    if (progress) progress.style.width = `${percentage}%`;
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -30px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const safeStorage = {
    read() {
      try { return JSON.parse(localStorage.getItem('icosta-accessibility') || '{}'); }
      catch { return {}; }
    },
    write(value) {
      try { localStorage.setItem('icosta-accessibility', JSON.stringify(value)); }
      catch { /* Preferences remain active for this visit. */ }
    },
    clear() {
      try { localStorage.removeItem('icosta-accessibility'); }
      catch { /* No persistent preference to clear. */ }
    }
  };

  const accessPanel = document.querySelector('[data-access-panel]');
  const contrastButton = document.querySelector('[data-contrast]');
  const motionButton = document.querySelector('[data-motion]');
  let accessTrigger = null;

  const syncAccessButtons = () => {
    contrastButton?.classList.toggle('active', body.classList.contains('high-contrast'));
    motionButton?.classList.toggle('active', body.classList.contains('reduce-motion'));
  };

  const applyPreferences = (preferences) => {
    root.classList.toggle('font-large', preferences.font === 'large');
    root.classList.toggle('font-small', preferences.font === 'small');
    body.classList.toggle('high-contrast', Boolean(preferences.contrast));
    body.classList.toggle('reduce-motion', Boolean(preferences.motion));
    syncAccessButtons();
  };
  applyPreferences(safeStorage.read());

  const openAccess = (trigger) => {
    accessTrigger = trigger;
    accessPanel?.classList.add('open');
    accessPanel?.setAttribute('aria-hidden', 'false');
    body.classList.add('panel-open');
    accessPanel?.querySelector('button')?.focus();
  };
  const closeAccess = () => {
    accessPanel?.classList.remove('open');
    accessPanel?.setAttribute('aria-hidden', 'true');
    body.classList.remove('panel-open');
    accessTrigger?.focus();
  };
  document.querySelectorAll('[data-access-open]').forEach((button) => button.addEventListener('click', () => openAccess(button)));
  document.querySelector('[data-access-close]')?.addEventListener('click', closeAccess);

  document.querySelectorAll('[data-font]').forEach((button) => {
    button.addEventListener('click', () => {
      const prefs = safeStorage.read();
      prefs.font = button.dataset.font === 'increase' ? 'large' : 'small';
      safeStorage.write(prefs);
      applyPreferences(prefs);
    });
  });
  contrastButton?.addEventListener('click', () => {
    const prefs = safeStorage.read();
    prefs.contrast = !body.classList.contains('high-contrast');
    safeStorage.write(prefs);
    applyPreferences(prefs);
  });
  motionButton?.addEventListener('click', () => {
    const prefs = safeStorage.read();
    prefs.motion = !body.classList.contains('reduce-motion');
    safeStorage.write(prefs);
    applyPreferences(prefs);
  });
  document.querySelector('[data-access-reset]')?.addEventListener('click', () => {
    safeStorage.clear();
    applyPreferences({});
  });

  const dialog = document.querySelector('[data-legal-dialog]');
  const dialogBody = document.querySelector('[data-dialog-body]');
  let dialogTrigger = null;

  document.querySelectorAll('[data-legal]').forEach((button) => {
    button.addEventListener('click', () => {
      const template = document.querySelector(`#legal-${button.dataset.legal}`);
      if (!dialog || !dialogBody || !template) return;
      dialogTrigger = button;
      dialogBody.replaceChildren(template.content.cloneNode(true));
      dialog.showModal();
      body.classList.add('panel-open');
      dialog.querySelector('[data-dialog-close]')?.focus();
    });
  });

  const closeDialog = () => {
    if (!dialog?.open) return;
    dialog.close();
    body.classList.remove('panel-open');
    dialogTrigger?.focus();
  };
  document.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeMenu();
    closeAccess();
    closeDialog();
  });
})();
