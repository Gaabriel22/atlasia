# Auditoria de segurança

Data da revisão: 2026-07-25

## Escopo

- Configuração Next.js, CSP e headers HTTP.
- `proxy.ts`, parâmetros dinâmicos e navegação localizada.
- Cliente REST Countries, validação Zod, URLs externas e tratamento de erros.
- Dependências de produção e desenvolvimento.
- Arquivos rastreados, histórico de `.env` e exposição da credencial atual.

## Resultado

- O grafo de produção retorna zero vulnerabilidades conhecidas em
  `npm audit --omit=dev`.
- O build de produção respondeu com CSP restrita, HSTS de dois anos, proteção
  contra framing e MIME sniffing, política de permissões e isolamento de
  contexto.
- A otimização de bandeiras respondeu com imagem PNG após a atualização
  controlada do Sharp.
- A URL do provedor é constante e server-only. O único parâmetro inserido no
  path é um código ISO alpha-2 validado antes do fetch e ainda codificado antes
  de compor a URL.
- URLs fornecidas pela API exigem HTTPS. Bandeiras exigem também o host
  `flags.restcountries.com` e os paths observados no contrato v5.
- `.env` está ignorado, nunca apareceu no histórico e o valor atual da chave
  não foi encontrado em arquivos rastreados. A busca por padrões comuns de
  secrets também não encontrou ocorrências.

## Decisões

- A CSP permanece estática para preservar SSG e ISR. `unsafe-inline` é mantido
  para scripts e estilos gerados pelo Next.js; scripts externos e conexões
  externas no navegador continuam bloqueados. `unsafe-eval` existe somente no
  desenvolvimento.
- Nonce por request foi descartado porque tornaria as páginas dinâmicas e
  eliminaria o cache estático sem benefício proporcional para este site
  público, somente leitura e sem autenticação.
- PostCSS e Sharp usam overrides explícitos enquanto as versões corrigidas não
  fazem parte da faixa publicada pelo Next.js 16.2.11. Build, imagem otimizada,
  testes unitários e testes de navegador cobrem esses overrides.

## Risco residual de desenvolvimento

O audit completo lista nove achados altos em `minimatch`/`brace-expansion`
através do ESLint e três moderados no servidor MCP distribuído pelo pacote
`shadcn`. Esses pacotes são dependências de desenvolvimento e não entram no
grafo auditado com `--omit=dev`.

A correção automática foi rejeitada porque propõe versões incompatíveis. Um
override manual de `brace-expansion` também foi testado e removido ao quebrar a
API esperada pelo ESLint. O risco é aceito temporariamente porque:

- o lint recebe apenas padrões definidos no repositório, não entrada pública;
- o servidor MCP do shadcn não é iniciado pela aplicação;
- o pacote shadcn precisa permanecer instalado porque
  `shadcn/tailwind.css` participa do build.

Reavaliar quando `eslint-config-next` e o pacote shadcn publicarem árvores
compatíveis com as versões transitivas corrigidas.

## Verificações reproduzíveis

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm audit --omit=dev
npm audit
```
