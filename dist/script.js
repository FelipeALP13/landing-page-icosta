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
    empresarial: {
      label: 'Direito Empresarial',
      stages: [
        { kicker: 'Movimento 01 — Contexto', title: 'A decisão empresarial precisa ser lida dentro da operação real.', description: 'Estrutura societária, relações comerciais, fluxo de decisões e objetivos do negócio ajudam a delimitar a questão.', attention: ['Quem decide e com quais poderes', 'Qual impacto se busca evitar ou alcançar'], materials: ['Contrato social e alterações', 'Contratos, propostas e comunicações'] },
        { kicker: 'Movimento 02 — Evidências', title: 'Governança e documentação precisam contar a mesma história.', description: 'Atas, registros, contratos e demonstrativos ajudam a verificar responsabilidades e compromissos assumidos.', attention: ['Validade e sequência das deliberações', 'Obrigações, garantias e vencimentos'], materials: ['Atas e documentos societários', 'Instrumentos comerciais e comprovantes'] },
        { kicker: 'Movimento 03 — Caminhos', title: 'Prevenir, reorganizar, negociar ou litigar produz efeitos distintos.', description: 'A escolha considera continuidade da empresa, relações entre sócios, exposição financeira e urgência.', attention: ['Continuidade da atividade empresarial', 'Riscos para sócios, empresa e terceiros'], materials: ['Cenários financeiros relevantes', 'Propostas e tentativas de composição'] },
        { kicker: 'Movimento 04 — Condução', title: 'A estratégia jurídica deve acompanhar o ritmo das decisões do negócio.', description: 'Responsáveis, prazos e documentos de cada etapa precisam permanecer visíveis até a formalização final.', attention: ['Aprovações e responsáveis internos', 'Marcos para revisão da estratégia'], materials: ['Plano de ação e calendário', 'Registros das decisões tomadas'] }
      ]
    },
    condominial: {
      label: 'Direito Condominial',
      stages: [
        { kicker: 'Movimento 01 — Contexto', title: 'A convivência coletiva depende das regras e dos fatos concretos.', description: 'Convenção, regimento, deliberações e histórico da situação ajudam a compreender direitos e deveres no condomínio.', attention: ['Quem é afetado e de que maneira', 'Qual regra interna se relaciona ao fato'], materials: ['Convenção e regimento interno', 'Atas e comunicações relevantes'] },
        { kicker: 'Movimento 02 — Evidências', title: 'Registros claros dão segurança às decisões da comunidade.', description: 'Convocações, atas, notificações e demonstrativos permitem conferir procedimentos, quóruns e obrigações.', attention: ['Regularidade da convocação e votação', 'Histórico de avisos e providências'], materials: ['Editais, listas de presença e atas', 'Boletos, notificações e registros'] },
        { kicker: 'Movimento 03 — Caminhos', title: 'Orientação, mediação, assembleia e processo têm funções diferentes.', description: 'A rota depende da urgência, do impacto coletivo, das regras aplicáveis e da possibilidade de solução consensual.', attention: ['Efeito da medida sobre a coletividade', 'Possibilidade de correção administrativa'], materials: ['Propostas de encaminhamento', 'Registros de tentativas de solução'] },
        { kicker: 'Movimento 04 — Condução', title: 'A solução precisa ser comunicada e aplicada de forma consistente.', description: 'Depois da decisão, responsáveis, prazos e registros ajudam a preservar transparência e segurança para todos.', attention: ['Como a decisão será formalizada', 'Quem acompanhará seu cumprimento'], materials: ['Comunicado ou ata final', 'Comprovantes das providências adotadas'] }
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
    },
    familia: {
      label: 'Direito de Família',
      stages: [
        { kicker: 'Movimento 01 — Contexto', title: 'Vínculos, necessidades e patrimônio fazem parte da mesma história.', description: 'Compreender a composição familiar, os acontecimentos e os objetivos de cada pessoa permite uma leitura mais cuidadosa.', attention: ['Quem precisa ser considerado na decisão', 'Quais mudanças motivaram a conversa'], materials: ['Certidões e documentos pessoais', 'Linha do tempo familiar e patrimonial'] },
        { kicker: 'Movimento 02 — Evidências', title: 'Organização documental reduz incertezas em momentos delicados.', description: 'Registros pessoais, patrimoniais e financeiros ajudam a esclarecer responsabilidades e possibilidades.', attention: ['Situação de filhos e dependentes', 'Composição e origem do patrimônio'], materials: ['Comprovantes de renda e despesas', 'Documentos de bens e obrigações'] },
        { kicker: 'Movimento 03 — Caminhos', title: 'Consenso e processo devem ser comparados com cuidado humano.', description: 'A rota considera proteção, urgência, viabilidade do diálogo e efeitos práticos para todas as pessoas envolvidas.', attention: ['Possibilidade de construção conjunta', 'Necessidade de proteção ou medida urgente'], materials: ['Propostas já conversadas', 'Registros relevantes para a decisão'] },
        { kicker: 'Movimento 04 — Condução', title: 'Acordos e decisões precisam funcionar também na vida cotidiana.', description: 'Acompanhamento claro ajuda a transformar definições jurídicas em rotinas compreensíveis e documentadas.', attention: ['Como cada obrigação será cumprida', 'Quando a situação deverá ser revista'], materials: ['Minuta ou decisão final', 'Calendário e comprovantes posteriores'] }
      ]
    }
  };

  const atlasTabs = Array.from(document.querySelectorAll('[data-atlas-area]'));
  const atlasStageButtons = Array.from(document.querySelectorAll('[data-atlas-stage]'));
  const atlasDetail = document.querySelector('.atlas-detail');
  let activeAtlasArea = 'civil';
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

  const bindTabKeyboard = (tabs) => {
    tabs.forEach((tab, index) => tab.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
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
    atlasTabs.forEach((tab) => {
      const selected = tab.dataset.atlasArea === activeAtlasArea;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
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
  bindTabKeyboard(atlasTabs);
  renderAtlas();

  const lensData = {
    imobiliario: {
      label: 'Contrato de locação',
      code: 'IMÓVEL / 001',
      title: 'Contrato de locação residencial',
      parties: 'LOCADOR e LOCATÁRIO, devidamente identificados, ajustam as condições descritas neste instrumento.',
      clauses: [
        { heading: 'Objeto e identificação do imóvel', preview: 'O contrato deve permitir compreender exatamente qual bem está sendo locado.', kicker: 'Ponto 01 • Identificação', title: 'Você sabe exatamente o que está sendo contratado?', text: 'Endereço, unidade, vagas, áreas vinculadas e condições de uso precisam permitir a identificação precisa do imóvel.', question: 'O documento e a vistoria descrevem o mesmo imóvel e seus acessórios?', keep: 'Contrato, laudo de vistoria, fotos datadas e comprovantes relacionados ao imóvel.' },
        { heading: 'Prazo e renovação', preview: 'A duração influencia saída, continuidade e planejamento das partes.', kicker: 'Ponto 02 • Duração', title: 'O que acontece quando o prazo termina?', text: 'Prazo inicial, renovação, aviso e permanência após o término podem produzir efeitos diferentes para as partes.', question: 'O contrato explica com clareza a duração, a renovação e a forma de aviso?', keep: 'Versão assinada, comunicações sobre renovação e comprovantes de entrega de avisos.' },
        { heading: 'Valor, reajuste e encargos', preview: 'Aluguel, índice e despesas precisam estar claramente separados.', kicker: 'Ponto 03 • Valores', title: 'O custo total está visível ou espalhado pelo documento?', text: 'Além do aluguel, podem existir reajuste, condomínio, tributos, seguros e outras despesas que precisam ser compreendidas em conjunto.', question: 'Quais valores podem mudar, quando e segundo qual critério?', keep: 'Boletos, demonstrativos, recibos e comunicações sobre reajuste ou despesas.' },
        { heading: 'Garantias', preview: 'Caução, fiança ou seguro possuem efeitos e responsabilidades diferentes.', kicker: 'Ponto 04 • Garantia', title: 'A garantia escolhida combina com o risco assumido?', text: 'Cada modalidade possui regras próprias, custos e consequências para locatário, locador e eventuais terceiros.', question: 'Como a garantia é constituída, atualizada e devolvida ao final?', keep: 'Comprovantes da garantia, apólice, depósito ou documentos do fiador.' },
        { heading: 'Saída, multa e vistoria', preview: 'O encerramento deve dialogar com prazo, conservação e entrega das chaves.', kicker: 'Ponto 05 • Encerramento', title: 'Como o contrato termina na prática?', text: 'Aviso, multa, vistoria, reparos e entrega das chaves devem formar um procedimento compreensível e documentado.', question: 'A multa, a vistoria e a devolução do imóvel estão descritas de forma compatível entre si?', keep: 'Vistorias de entrada e saída, fotos, avisos e recibo de entrega das chaves.' }
      ]
    },
    trabalhista: {
      label: 'Contrato de trabalho',
      code: 'TRABALHO / 001',
      title: 'Instrumento de contratação profissional',
      parties: 'CONTRATANTE e PROFISSIONAL estabelecem as condições da atividade descrita neste instrumento ilustrativo.',
      clauses: [
        { heading: 'Função e forma de contratação', preview: 'O nome do contrato precisa conversar com a rotina real.', kicker: 'Ponto 01 • Relação', title: 'O documento descreve a relação que acontecerá na prática?', text: 'Função, autonomia, subordinação, local e forma de prestação ajudam a compreender a natureza da relação profissional.', question: 'As atividades e a forma de trabalho estão descritas como realmente serão executadas?', keep: 'Proposta, contrato, descrição da função e comunicações sobre a contratação.' },
        { heading: 'Jornada e disponibilidade', preview: 'Horários, escalas e disponibilidade merecem linguagem objetiva.', kicker: 'Ponto 02 • Tempo', title: 'Quando começa e quando termina a disponibilidade?', text: 'Horário, intervalo, escala, trabalho remoto e chamadas fora da jornada podem alterar a compreensão do compromisso.', question: 'O documento diferencia jornada, intervalo, disponibilidade e eventual trabalho extraordinário?', keep: 'Escalas, controles de horário, mensagens e registros de acesso.' },
        { heading: 'Remuneração e benefícios', preview: 'Valores e critérios variáveis devem poder ser conferidos.', kicker: 'Ponto 03 • Remuneração', title: 'É possível verificar como cada pagamento será calculado?', text: 'Parcela fixa, variável, benefícios, datas e condições precisam ser lidos em conjunto, sem depender apenas de promessas externas.', question: 'Quais parcelas são fixas, variáveis ou condicionadas e quando são pagas?', keep: 'Proposta, holerites, políticas de remuneração e comprovantes.' },
        { heading: 'Deveres e confidencialidade', preview: 'Responsabilidades amplas precisam ter limites compreensíveis.', kicker: 'Ponto 04 • Responsabilidades', title: 'Os deveres estão definidos ou abertos demais?', text: 'Sigilo, uso de equipamentos, propriedade intelectual e condutas esperadas devem ter alcance e duração identificáveis.', question: 'Quais obrigações continuam depois do fim da relação e por quanto tempo?', keep: 'Políticas internas, termos anexos e comprovantes de entrega de equipamentos.' },
        { heading: 'Término e consequências', preview: 'Aviso, verbas e devoluções precisam formar um procedimento claro.', kicker: 'Ponto 05 • Encerramento', title: 'O documento explica as consequências de cada forma de término?', text: 'O encerramento pode envolver aviso, valores, documentos, devolução de bens e obrigações posteriores.', question: 'Quais providências cada parte deverá cumprir quando a relação terminar?', keep: 'Avisos, termos de encerramento, comprovantes e documentos entregues.' }
      ]
    },
    civil: {
      label: 'Prestação de serviços',
      code: 'CIVIL / 001',
      title: 'Contrato de prestação de serviços',
      parties: 'CONTRATANTE e PRESTADOR ajustam o escopo, as responsabilidades e as condições deste exemplo educativo.',
      clauses: [
        { heading: 'Objeto e entregas', preview: 'O serviço precisa ser reconhecível quando estiver concluído.', kicker: 'Ponto 01 • Escopo', title: 'As partes saberão reconhecer uma entrega completa?', text: 'Escopo, quantidade, formato, limites e critérios de aceite reduzem interpretações diferentes sobre o que foi contratado.', question: 'O contrato distingue o que está incluído, o que não está e como a entrega será aprovada?', keep: 'Proposta, briefing, cronograma e registros de aprovação.' },
        { heading: 'Prazos e dependências', preview: 'Uma entrega pode depender de informações fornecidas por ambas as partes.', kicker: 'Ponto 02 • Cronograma', title: 'Os prazos consideram as dependências do projeto?', text: 'Datas, etapas, revisões e responsabilidades por atrasos precisam considerar o que cada parte deve fornecer.', question: 'O que suspende ou altera um prazo e como essa mudança será registrada?', keep: 'Cronograma, pedidos de alteração e comunicações sobre dependências.' },
        { heading: 'Preço, despesas e reajustes', preview: 'Pagamento deve acompanhar escopo e marcos verificáveis.', kicker: 'Ponto 03 • Pagamento', title: 'O valor está ligado a etapas que podem ser comprovadas?', text: 'Preço, vencimento, reembolso, impostos e serviços adicionais devem permitir conferência durante a execução.', question: 'Como mudanças de escopo afetam valor, prazo e forma de pagamento?', keep: 'Proposta comercial, notas, recibos e aprovações de serviço adicional.' },
        { heading: 'Sigilo e propriedade intelectual', preview: 'Uso de informações e resultados precisa ter limites definidos.', kicker: 'Ponto 04 • Conteúdo', title: 'Quem poderá usar o quê depois da entrega?', text: 'Informações confidenciais, materiais preexistentes e resultados produzidos podem ter titulares e permissões diferentes.', question: 'O contrato diferencia propriedade, licença de uso e obrigação de confidencialidade?', keep: 'Arquivos originais, autorizações, registros de criação e termos de sigilo.' },
        { heading: 'Rescisão e solução de conflitos', preview: 'A saída deve prever o destino do trabalho já realizado.', kicker: 'Ponto 05 • Saída', title: 'O que acontece com entregas, valores e acessos se o contrato terminar?', text: 'Encerramento, aviso, pagamento proporcional, devolução de materiais e resolução de divergências precisam conversar.', question: 'A rescisão explica o que permanece devido e como os materiais serão entregues ou devolvidos?', keep: 'Avisos, entregas parciais, acessos concedidos e comprovantes de pagamento.' }
      ]
    },
    empresarial: {
      label: 'Acordo societário',
      code: 'EMPRESA / 001',
      title: 'Acordo entre sócios',
      parties: 'SÓCIOS e SOCIEDADE organizam decisões, responsabilidades e situações futuras neste exemplo educativo.',
      clauses: [
        { heading: 'Participações e contribuições', preview: 'Percentuais, aportes e responsabilidades devem estar relacionados.', kicker: 'Ponto 01 • Estrutura', title: 'O documento mostra com clareza o papel de cada sócio?', text: 'Participação, contribuição e responsabilidade podem ter efeitos diferentes e precisam ser compreendidas em conjunto.', question: 'O acordo diferencia participação societária, aportes e obrigações de cada pessoa?', keep: 'Contrato social, alterações, comprovantes de aporte e registros contábeis pertinentes.' },
        { heading: 'Decisões e quóruns', preview: 'Governança precisa indicar quem decide e em quais condições.', kicker: 'Ponto 02 • Governança', title: 'Como as decisões relevantes serão aprovadas?', text: 'Matérias ordinárias e estratégicas podem exigir responsáveis, quóruns e formas de registro diferentes.', question: 'O documento define quais decisões exigem consenso, maioria ou aprovação específica?', keep: 'Atas, políticas internas e registros das deliberações.' },
        { heading: 'Pró-labore e distribuição', preview: 'Trabalho, remuneração e lucro não são a mesma coisa.', kicker: 'Ponto 03 • Valores', title: 'As regras financeiras podem ser conferidas?', text: 'Remuneração pelo trabalho, reembolso, reservas e distribuição de resultados precisam ter critérios identificáveis.', question: 'Quando e como cada pagamento poderá ocorrer e ser comprovado?', keep: 'Demonstrativos, deliberações, comprovantes e documentos contábeis.' },
        { heading: 'Sigilo e não concorrência', preview: 'Restrições precisam ter alcance, prazo e finalidade claros.', kicker: 'Ponto 04 • Proteção', title: 'As obrigações de proteção têm limites compreensíveis?', text: 'Informações confidenciais, relacionamento com clientes e atividades concorrentes exigem definições proporcionais.', question: 'O acordo explica o que é protegido, por quanto tempo e em qual contexto?', keep: 'Políticas de informação, contratos e registros de acesso relevantes.' },
        { heading: 'Saída e solução de impasses', preview: 'A empresa precisa de um caminho para mudanças e divergências.', kicker: 'Ponto 05 • Transição', title: 'O que acontece se um sócio quiser sair ou houver impasse?', text: 'Avaliação de participação, pagamento, sucessão e solução de divergências devem formar um procedimento verificável.', question: 'O documento define etapas, critérios de valor e responsáveis pela transição?', keep: 'Balanços, notificações, propostas e registros das negociações.' }
      ]
    },
    condominial: {
      label: 'Convenção condominial',
      code: 'CONDOMÍNIO / 001',
      title: 'Convenção e regras de convivência',
      parties: 'CONDOMÍNIO, SÍNDICO e CONDÔMINOS observam regras coletivas descritas neste exemplo educativo.',
      clauses: [
        { heading: 'Unidades e áreas comuns', preview: 'Uso individual e uso coletivo precisam estar diferenciados.', kicker: 'Ponto 01 • Espaços', title: 'As regras deixam claro o que é privativo e o que é comum?', text: 'Áreas, acessos, vagas e equipamentos podem ter destinações e responsabilidades diferentes.', question: 'A descrição dos espaços corresponde à realidade e aos documentos do condomínio?', keep: 'Convenção, planta, memorial, matrícula e registros de uso.' },
        { heading: 'Assembleias e votações', preview: 'Convocação, pauta e quórum dão validade às decisões.', kicker: 'Ponto 02 • Deliberação', title: 'A decisão coletiva foi formada pelo procedimento previsto?', text: 'Prazo de convocação, pauta, participação e quórum precisam ser lidos em conjunto.', question: 'Quem pode votar, qual quórum se aplica e como a decisão será registrada?', keep: 'Edital, lista de presença, procurações e ata.' },
        { heading: 'Despesas e rateios', preview: 'Critérios de cobrança devem poder ser conferidos.', kicker: 'Ponto 03 • Custos', title: 'O rateio explica de onde vem cada obrigação?', text: 'Despesas ordinárias, extraordinárias, fundos e critérios de divisão precisam ser identificáveis.', question: 'A cobrança corresponde à regra aprovada e ao período indicado?', keep: 'Boletos, orçamento, balancetes, atas e comprovantes.' },
        { heading: 'Deveres e medidas internas', preview: 'Regras de convivência precisam prever comunicação e resposta.', kicker: 'Ponto 04 • Convivência', title: 'A regra e a consequência estão descritas de forma coerente?', text: 'Deveres, avisos, multas e possibilidades de manifestação devem formar um procedimento compreensível.', question: 'A pessoa afetada consegue entender o fato, a regra e a providência adotada?', keep: 'Regimento, notificações, registros e comunicações.' },
        { heading: 'Administração e representação', preview: 'Poderes e prestação de contas precisam ter limites visíveis.', kicker: 'Ponto 05 • Gestão', title: 'Quem pode agir em nome do condomínio e até onde?', text: 'Competências do síndico, conselho, administradora e assembleia podem ser diferentes.', question: 'O documento identifica responsáveis, limites e formas de prestação de contas?', keep: 'Atas de eleição, contratos de administração e demonstrativos.' }
      ]
    },
    familia: {
      label: 'Acordo familiar',
      code: 'FAMÍLIA / 001',
      title: 'Acordo de convivência e responsabilidades',
      parties: 'FAMILIARES organizam responsabilidades, comunicação e rotina neste exemplo exclusivamente educativo.',
      clauses: [
        { heading: 'Pessoas e responsabilidades', preview: 'O acordo deve indicar quem participa e o que cabe a cada pessoa.', kicker: 'Ponto 01 • Pessoas', title: 'As responsabilidades estão descritas de forma prática?', text: 'Necessidades, capacidade de cuidado e rotina precisam ser consideradas sem expressões vagas.', question: 'Cada pessoa consegue compreender o que deverá fazer e em quais situações?', keep: 'Documentos pessoais, certidões e registros da rotina relevante.' },
        { heading: 'Convivência e calendário', preview: 'Datas e transições precisam funcionar no cotidiano.', kicker: 'Ponto 02 • Rotina', title: 'O calendário prevê a vida real e situações de mudança?', text: 'Dias, horários, férias, deslocamentos e comunicação podem exigir regras simples e ajustáveis.', question: 'O texto explica horários, responsabilidades de transporte e forma de avisar mudanças?', keep: 'Calendários, comprovantes de atividades e comunicações importantes.' },
        { heading: 'Despesas e contribuições', preview: 'Valores e responsabilidades financeiras precisam ser verificáveis.', kicker: 'Ponto 03 • Despesas', title: 'O acordo distingue despesas regulares e extraordinárias?', text: 'Valor, vencimento, reajuste, reembolso e comprovação devem ser lidos em conjunto.', question: 'Quem paga, quando paga e como uma despesa adicional será aprovada?', keep: 'Comprovantes de renda, despesas, pagamentos e reembolsos.' },
        { heading: 'Decisões importantes', preview: 'Saúde, educação e mudanças relevantes pedem um processo claro.', kicker: 'Ponto 04 • Decisões', title: 'Como serão tomadas as decisões que afetam a família?', text: 'Informação prévia, participação e registro ajudam a reduzir divergências sobre escolhas relevantes.', question: 'O acordo define quais decisões precisam ser compartilhadas e por qual canal?', keep: 'Registros escolares, médicos e comunicações entre responsáveis.' },
        { heading: 'Revisão e solução de divergências', preview: 'A vida muda e o acordo precisa prever como será revisto.', kicker: 'Ponto 05 • Revisão', title: 'Existe um caminho para ajustar o acordo quando a realidade mudar?', text: 'Marcos de revisão, diálogo e eventual formalização ajudam a manter o documento útil.', question: 'Quais mudanças justificam nova conversa e como ela será registrada?', keep: 'Acordo vigente, registros das mudanças e propostas de ajuste.' }
      ]
    }
  };

  const lensTabs = Array.from(document.querySelectorAll('[data-lens-document]'));
  const lensClauseContainer = document.querySelector('[data-lens-clauses]');
  const lensInsight = document.querySelector('.lens-insight');
  const lensDialog = document.querySelector('[data-lens-dialog]');
  const lensSummaryList = document.querySelector('[data-lens-summary-list]');
  const lensCopyStatus = document.querySelector('[data-lens-copy-status]');
  let activeLensDocument = 'civil';
  let activeLensClause = 0;
  let lensTrigger = null;

  const setLensText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const renderLensClause = () => {
    const documentData = lensData[activeLensDocument];
    const clause = documentData.clauses[activeLensClause];
    setLensText('[data-lens-insight-kicker]', clause.kicker);
    setLensText('[data-lens-insight-title]', clause.title);
    setLensText('[data-lens-insight-text]', clause.text);
    setLensText('[data-lens-question]', clause.question);
    setLensText('[data-lens-keep]', clause.keep);
    setLensText('[data-lens-progress]', `${activeLensClause + 1} / ${documentData.clauses.length}`);
    document.querySelectorAll('[data-lens-clause]').forEach((button) => {
      const active = Number(button.dataset.lensClause) === activeLensClause;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const prev = document.querySelector('[data-lens-prev]');
    const next = document.querySelector('[data-lens-next]');
    if (prev) prev.disabled = activeLensClause === 0;
    if (next) next.disabled = activeLensClause === documentData.clauses.length - 1;
    const progress = document.querySelector('[data-lens-nav-progress]');
    if (progress) progress.style.width = `${((activeLensClause + 1) / documentData.clauses.length) * 100}%`;
    if (!body.classList.contains('reduce-motion') && !prefersReducedMotion) {
      lensInsight?.animate([{ opacity: .35, transform: 'translateX(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
    }
  };

  const renderLensDocument = () => {
    const documentData = lensData[activeLensDocument];
    setLensText('[data-lens-doc-code]', documentData.code);
    setLensText('[data-lens-doc-title]', documentData.title);
    setLensText('[data-lens-parties]', documentData.parties);
    lensClauseContainer?.replaceChildren(...documentData.clauses.map((clause, index) => {
      const button = document.createElement('button');
      const number = document.createElement('b');
      const copy = document.createElement('span');
      const title = document.createElement('strong');
      const preview = document.createElement('i');
      button.type = 'button';
      button.className = 'lens-clause';
      button.dataset.lensClause = String(index);
      button.setAttribute('aria-pressed', 'false');
      number.textContent = String(index + 1).padStart(2, '0');
      title.textContent = clause.heading;
      preview.textContent = clause.preview;
      copy.append(title, preview);
      button.append(number, copy);
      button.addEventListener('click', () => {
        activeLensClause = index;
        renderLensClause();
      });
      return button;
    }));
    lensTabs.forEach((tab) => {
      const selected = tab.dataset.lensDocument === activeLensDocument;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    renderLensClause();
  };

  lensTabs.forEach((tab) => tab.addEventListener('click', () => {
    activeLensDocument = tab.dataset.lensDocument;
    activeLensClause = 0;
    renderLensDocument();
  }));
  bindTabKeyboard(lensTabs);
  document.querySelector('[data-lens-prev]')?.addEventListener('click', () => {
    activeLensClause = Math.max(0, activeLensClause - 1);
    renderLensClause();
  });
  document.querySelector('[data-lens-next]')?.addEventListener('click', () => {
    activeLensClause = Math.min(lensData[activeLensDocument].clauses.length - 1, activeLensClause + 1);
    renderLensClause();
  });
  renderLensDocument();

  const lensSummaryText = () => {
    const documentData = lensData[activeLensDocument];
    return [
      `ROTEIRO DE LEITURA — ${documentData.label.toUpperCase()}`,
      ...documentData.clauses.map((clause, index) => `${index + 1}. ${clause.question}`),
      '',
      'Material educativo da ICosta Advocacia. Não constitui análise, parecer ou orientação jurídica para um caso concreto.'
    ].join('\n');
  };

  document.querySelector('[data-lens-summary]')?.addEventListener('click', (event) => {
    lensTrigger = event.currentTarget;
    const documentData = lensData[activeLensDocument];
    setLensText('[data-lens-dialog-title]', `Roteiro — ${documentData.label}`);
    lensSummaryList?.replaceChildren(...documentData.clauses.map((clause) => {
      const item = document.createElement('li');
      item.textContent = clause.question;
      return item;
    }));
    if (lensCopyStatus) lensCopyStatus.textContent = '';
    lensDialog?.showModal();
    body.classList.add('panel-open');
    lensDialog?.querySelector('[data-lens-dialog-close]')?.focus();
  });

  const closeLensDialog = () => {
    if (!lensDialog?.open) return;
    lensDialog.close();
    body.classList.remove('panel-open');
    lensTrigger?.focus();
  };
  document.querySelector('[data-lens-dialog-close]')?.addEventListener('click', closeLensDialog);
  lensDialog?.addEventListener('click', (event) => {
    if (event.target === lensDialog) closeLensDialog();
  });
  lensDialog?.addEventListener('close', () => body.classList.remove('panel-open'));

  document.querySelector('[data-lens-copy]')?.addEventListener('click', async () => {
    const value = lensSummaryText();
    try {
      await navigator.clipboard.writeText(value);
      if (lensCopyStatus) lensCopyStatus.textContent = 'Roteiro copiado.';
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      if (lensCopyStatus) lensCopyStatus.textContent = 'Roteiro copiado.';
    }
  });

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
