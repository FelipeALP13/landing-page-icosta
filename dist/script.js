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

  const atlasData = {
    trabalhista: {
      label: 'Direito Trabalhista',
      stages: [
        { kicker: 'Movimento 01 — Contexto', title: 'O vínculo e a sequência dos fatos vêm antes da conclusão.', description: 'Datas, funções, comunicações e mudanças na relação de trabalho ajudam a construir uma leitura mais precisa do cenário.', attention: ['Como a relação começou e se desenvolveu', 'Quais fatos mudaram a rotina ou o vínculo'], materials: ['Contrato ou registro de trabalho', 'Mensagens e linha do tempo'] },
        { kicker: 'Movimento 02 — Evidências', title: 'Documentos transformam lembranças em uma cronologia verificável.', description: 'Organizar os registros por data facilita a identificação de informações relevantes e reduz dúvidas no atendimento.', attention: ['Períodos, pagamentos e alterações', 'Origem e integridade de cada registro'], materials: ['Holerites, recibos e controles', 'Comunicados e documentos rescisórios'] },
        { kicker: 'Movimento 03 — Caminhos', title: 'Prevenção, negociação e processo são rotas diferentes.', description: 'A escolha depende do objetivo, dos riscos, das provas disponíveis e do momento da relação de trabalho.', attention: ['Objetivo prático da pessoa ou empresa', 'Custos, riscos e efeitos de cada rota'], materials: ['Resumo dos objetivos', 'Histórico de tentativas de solução'] },
        { kicker: 'Movimento 04 — Condução', title: 'A estratégia precisa continuar clara depois da primeira conversa.', description: 'Definir responsabilidades, canais e próximos marcos permite acompanhar o trabalho jurídico com mais segurança.', attention: ['Próxima decisão e responsável', 'Prazos que exigem acompanhamento'], materials: ['Plano de ação validado', 'Atualizações e documentos posteriores'] }
      ]
    },
    civil: {
      label: 'Direito Civil',
      stages: [
        { kicker: 'Movimento 01 — Contexto', title: 'A relação entre as pessoas explica o que o documento sozinho não mostra.', description: 'Origem do compromisso, expectativas, comunicações e acontecimentos ajudam a compreender uma questão civil.', attention: ['O que foi combinado entre as partes', 'Quando surgiu a divergência'], materials: ['Contrato, proposta ou orçamento', 'Mensagens e sequência dos fatos'] },
        { kicker: 'Movimento 02 — Evidências', title: 'Coerência documental importa tanto quanto quantidade.', description: 'Reunir registros relacionados ao mesmo acontecimento permite confrontar versões, obrigações e consequências.', attention: ['Correspondência entre fatos e comprovantes', 'Notificações já enviadas ou recebidas'], materials: ['Recibos, comprovantes e notas', 'Notificações, fotos ou laudos'] },
        { kicker: 'Movimento 03 — Caminhos', title: 'Uma controvérsia pode admitir composição, prevenção ou processo.', description: 'Cada alternativa produz efeitos distintos e deve ser avaliada conforme urgência, prova e resultado pretendido.', attention: ['Possibilidade de solução consensual', 'Necessidade de medida urgente'], materials: ['Propostas já apresentadas', 'Registro de prejuízos alegados'] },
        { kicker: 'Movimento 04 — Condução', title: 'Decisões melhores nascem de expectativas bem alinhadas.', description: 'Um acompanhamento claro registra avanços, mudanças de cenário e as decisões tomadas ao longo do caminho.', attention: ['Critérios para reavaliar a estratégia', 'Comunicação entre cliente e equipe'], materials: ['Registro das orientações', 'Cronologia atualizada'] }
      ]
    },
    imobiliario: {
      label: 'Direito Imobiliário',
      stages: [
        { kicker: 'Movimento 01 — Contexto', title: 'O imóvel tem uma história jurídica que precisa ser reconstruída.', description: 'Uso, posse, propriedade, negócio e ocupação podem revelar relações diferentes sobre o mesmo bem.', attention: ['Quem ocupa e em qual condição', 'Qual negócio ou relação deu origem à questão'], materials: ['Contrato, escritura ou matrícula', 'Linha do tempo da ocupação'] },
        { kicker: 'Movimento 02 — Evidências', title: 'Regularidade documental e realidade do imóvel precisam conversar.', description: 'Registros, pagamentos, plantas e comunicações ajudam a comparar a situação formal com a situação existente.', attention: ['Titularidade e eventuais restrições', 'Débitos, alterações e responsabilidades'], materials: ['Matrícula e certidões pertinentes', 'IPTU, condomínio, fotos ou plantas'] },
        { kicker: 'Movimento 03 — Caminhos', title: 'Regularizar, negociar, contratar ou litigar exige leituras distintas.', description: 'A rota adequada depende da documentação, do objetivo sobre o imóvel e das pessoas envolvidas.', attention: ['Segurança do negócio pretendido', 'Urgência e possibilidade de acordo'], materials: ['Minutas ou propostas existentes', 'Notificações e tentativas de solução'] },
        { kicker: 'Movimento 04 — Condução', title: 'Patrimônio pede acompanhamento cuidadoso até a última formalidade.', description: 'O encerramento pode depender de registros, certidões, obrigações financeiras e providências posteriores.', attention: ['Ato que efetivamente conclui a operação', 'Pendências após acordo ou decisão'], materials: ['Comprovantes de cumprimento', 'Registros e certidões atualizados'] }
      ]
    }
  };

  const atlasTabs = Array.from(document.querySelectorAll('[data-atlas-area]'));
  const atlasStageButtons = Array.from(document.querySelectorAll('[data-atlas-stage]'));
  const atlasDetail = document.querySelector('.atlas-detail');
  let activeAtlasArea = 'trabalhista';
  let activeAtlasStage = 0;

  const fillList = (selector, items) => {
    const list = document.querySelector(selector);
    if (!list) return;
    list.replaceChildren(...items.map((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
  };

  const renderAtlas = () => {
    const area = atlasData[activeAtlasArea];
    const stage = area?.stages[activeAtlasStage];
    if (!area || !stage) return;
    const values = {
      '[data-atlas-area-label]': area.label,
      '[data-atlas-kicker]': stage.kicker,
      '[data-atlas-title]': stage.title,
      '[data-atlas-description]': stage.description
    };
    Object.entries(values).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = value;
    });
    fillList('[data-atlas-attention]', stage.attention);
    fillList('[data-atlas-materials]', stage.materials);
    atlasTabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.atlasArea === activeAtlasArea)));
    atlasStageButtons.forEach((button) => {
      const active = Number(button.dataset.atlasStage) === activeAtlasStage;
      button.closest('li')?.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    });
    if (!body.classList.contains('reduce-motion') && !prefersReducedMotion) {
      atlasDetail?.animate([{ opacity: .25, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' });
    }
  };

  atlasTabs.forEach((tab) => tab.addEventListener('click', () => {
    activeAtlasArea = tab.dataset.atlasArea;
    activeAtlasStage = 0;
    renderAtlas();
  }));
  atlasStageButtons.forEach((button) => button.addEventListener('click', () => {
    activeAtlasStage = Number(button.dataset.atlasStage);
    renderAtlas();
  }));
  renderAtlas();

  const resourceCards = Array.from(document.querySelectorAll('[data-resource-card]'));
  const resourceSearch = document.querySelector('[data-resource-search]');
  const resourceFilters = Array.from(document.querySelectorAll('[data-resource-filter]'));
  const resourceCount = document.querySelector('[data-resource-count]');
  const resourceEmpty = document.querySelector('[data-resource-empty]');
  let activeResourceFilter = 'todos';
  let favoriteResources = new Set();
  try { favoriteResources = new Set(JSON.parse(localStorage.getItem('icosta-resource-favorites') || '[]')); } catch { favoriteResources = new Set(); }

  const normalizeSearch = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const syncFavoriteButtons = () => {
    resourceCards.forEach((card) => {
      const favorite = favoriteResources.has(card.dataset.resourceId);
      const button = card.querySelector('[data-favorite]');
      if (!button) return;
      button.setAttribute('aria-pressed', String(favorite));
      button.textContent = favorite ? '★' : '☆';
    });
  };
  const filterResources = () => {
    const query = normalizeSearch(resourceSearch?.value || '');
    let visible = 0;
    resourceCards.forEach((card) => {
      const matchesText = normalizeSearch(card.dataset.search || '').includes(query);
      const matchesCategory = activeResourceFilter === 'todos' || card.dataset.category === activeResourceFilter || (activeResourceFilter === 'favoritos' && favoriteResources.has(card.dataset.resourceId));
      card.hidden = !(matchesText && matchesCategory);
      if (!card.hidden) visible += 1;
    });
    if (resourceCount) resourceCount.textContent = String(visible);
    if (resourceEmpty) resourceEmpty.hidden = visible !== 0;
  };
  resourceSearch?.addEventListener('input', filterResources);
  resourceFilters.forEach((button) => button.addEventListener('click', () => {
    activeResourceFilter = button.dataset.resourceFilter;
    resourceFilters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filterResources();
  }));
  document.querySelectorAll('[data-favorite]').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest('[data-resource-card]')?.dataset.resourceId;
    if (!id) return;
    if (favoriteResources.has(id)) favoriteResources.delete(id); else favoriteResources.add(id);
    try { localStorage.setItem('icosta-resource-favorites', JSON.stringify([...favoriteResources])); } catch { /* Favorite remains active for this visit. */ }
    syncFavoriteButtons();
    filterResources();
  }));
  syncFavoriteButtons();
  filterResources();

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
