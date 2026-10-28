# Auditoria do site — 24 de outubro de 2026

## Resultado

O site está tecnicamente consistente para uma presença institucional informativa e, na versão auditada, não apresenta promessas de resultado, divulgação de preços, comparação com outros profissionais, relatos de êxito, linguagem de urgência ou chamadas incompatíveis com a sobriedade esperada da publicidade jurídica.

Esta análise é uma revisão técnica e editorial baseada nas regras públicas vigentes. Ela não substitui parecer jurídico formal nem validação do Tribunal de Ética e Disciplina da OAB.

## Pontos verificados

- Identificação da sociedade sob registro OAB/SP nº 8.870 e das profissionais com suas respectivas inscrições.
- Caráter informativo das áreas de atuação, do ICosta Atlas e do ICosta Lente.
- Avisos de que o conteúdo não constitui consulta jurídica e de que resultados dependem do caso concreto.
- Um único contato principal no cabeçalho, sem pressão, promessa ou captação indevida.
- Ausência de preços, gratuidade promocional, comparações, rankings, garantias e exposição de casos concretos.
- Endereço, CEP, horário de atendimento, telefone do escritório e demais canais de contato consistentes.
- Aviso de privacidade com finalidades, retenção, acesso restrito e canal para exercício de direitos previstos na LGPD.
- Estrutura de títulos, descrição, dados estruturados, indexação, compartilhamento social e SEO local.
- Navegação por teclado, foco visível, painéis identificados e diálogos com rótulos acessíveis.
- Layout responsivo em tela ampla e celular.
- Recursos visuais e fontes servidos pelo próprio site, reduzindo dependências externas.
- Ausência de formulários, banco de dados, autenticação própria, dependências de terceiros e conteúdo inserido pelo visitante, mantendo pequena a superfície de ataque.
- JavaScript sem `eval`, `innerHTML`, `document.write` ou outros pontos comuns de injeção de código.
- Links externos abertos com isolamento `noopener noreferrer`.

## Melhorias aplicadas nesta auditoria

- Título e metadados ajustados para advocacia em São José dos Campos.
- Dados estruturados enriquecidos com mapa, imagem e identificador da organização.
- Fontes passaram a ser hospedadas localmente, com as respectivas licenças.
- Painéis interativos e janelas receberam identificação semântica para tecnologias assistivas.
- Navegação móvel e janelas laterais receberam contenção de foco.
- Aviso de privacidade foi ampliado com finalidade, retenção e direitos do titular.
- Verificação automatizada passou a detectar mais alegações de risco na publicidade jurídica.
- JavaScript inicial do tema foi movido para arquivo externo, permitindo bloquear scripts inline com CSP.
- Política de Segurança de Conteúdo restrita a recursos do próprio site, sem `unsafe-inline` ou `unsafe-eval`.
- Entrega migrada de hospedagem estática para um Worker mínimo que aplica cabeçalhos contra clickjacking, MIME sniffing, vazamento de referência e acesso a recursos sensíveis do navegador em todas as respostas.
- Canal padronizado `.well-known/security.txt` criado para comunicação responsável de vulnerabilidades.
- Verificação automatizada ampliada para barrar regressões de CSP, cabeçalhos, scripts inline e pontos de injeção no DOM.

## Informações ainda pendentes

Os itens abaixo não impedem o funcionamento do site, mas aumentariam confiança, autoridade institucional e precisão comercial quando confirmados:

- Mini-biografias das profissionais.
- Foto profissional da Dra. Simone da Costa e Silva.
- Confirmação do histórico: início da trajetória em 1982 versus abertura da sociedade em 2005.
- Confirmação se “ICosta Advocacia e Consultoria Jurídica” corresponde ao nome empresarial registrado ou apenas à assinatura de marca.
- Abrangência geográfica e disponibilidade de atendimento on-line.
- Link direto do perfil oficial no Google Maps/Google Business.
- Vinculação do domínio `icosta.adv.br` ao projeto Sites e correção do DNS/hospedagem; em 24/10/2026 o domínio ainda respondia HTTP 503 e não havia domínio personalizado cadastrado.
- Decisão e autorização para tornar o site público; o projeto está em acesso personalizado, visível apenas ao proprietário.
- Nova confirmação dos cabeçalhos de segurança depois de qualquer mudança de plataforma ou domínio.

## Risco residual

Nenhum site pode ser declarado “totalmente seguro”. A versão atual foi endurecida para o seu perfil estático e não identificamos vulnerabilidades exploráveis no código revisado. A segurança final também depende da plataforma de hospedagem, do DNS, das contas administrativas e da aplicação efetiva dos cabeçalhos pelo servidor. Recomenda-se manter autenticação multifator nas contas de domínio e hospedagem, usar acesso mínimo e refazer a varredura após qualquer integração, formulário, analytics ou código de terceiros.

## Referências oficiais consultadas

- [Provimento OAB nº 205/2021 — publicidade e informação da advocacia](https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021)
- [Código de Ética e Disciplina da OAB — Resolução nº 02/2015](https://www.oab.org.br/leisnormas/legislacao/resolucoes/02-2015)
- [Guia orientativo da ANPD sobre cookies e proteção de dados pessoais](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais)
