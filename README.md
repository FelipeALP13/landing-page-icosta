# ICosta Advocacia e Consultoria Jurídica

Landing page institucional da ICosta Advocacia e Consultoria Jurídica, com conteúdo informativo sobre as áreas de atuação, as profissionais e os canais oficiais do escritório.

## Áreas de atuação

- Direito Civil
- Direito Trabalhista
- Direito Empresarial
- Direito Condominial
- Direito Imobiliário
- Direito de Família

## Recursos

- ICosta Atlas: percursos visuais e educativos das seis áreas de atuação
- ICosta Lente: demonstrações interativas para leitura orientada de documentos
- Navegação responsiva e recursos de acessibilidade
- Dados estruturados para mecanismos de busca
- Contato direto pelo WhatsApp
- Política de Segurança de Conteúdo, bloqueio de enquadramento, restrição de permissões do navegador e canal `security.txt`

## Desenvolvimento local

O conteúdo visual pode ser aberto diretamente em `dist/index.html` ou servido localmente. Para publicação, o build empacota esses arquivos em um Worker que adiciona os cabeçalhos HTTP de segurança.

Para executar as verificações automatizadas:

```powershell
node scripts/check-site.mjs
node --check dist/theme-init.js
node --check dist/script.js
node scripts/build-worker.mjs
node scripts/validate-worker.mjs
```

## Estrutura

- `dist/`: versão publicável do site
- `scripts/check-site.mjs`: verificações de conteúdo e integridade
- `.openai/hosting.json`: configuração de hospedagem do projeto

O Worker aplica os cabeçalhos de segurança em todas as respostas. O arquivo `dist/_headers` documenta a política e a CSP no HTML funciona como defesa adicional.

Desenvolvido por **Felipe Lucena**.
