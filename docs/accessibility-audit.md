# Auditoria de acessibilidade

Data da revisão: 2026-07-25

Conformidade-alvo: WCAG 2.2 nível AA.

## Escopo

- Shell compartilhado, catálogo em `pt-BR` e `en`, busca e filtros.
- Perfil de país, navegação interna e página não encontrada.
- Teclado, ordem e visibilidade de foco, landmarks e headings.
- Nomes acessíveis, textos alternativos e anúncios dinâmicos.
- Contraste, alvos de interação, reflow, espaçamento de texto e movimento
  reduzido.

## Resultado

- As rotas representativas passam no axe com as tags `wcag2a`, `wcag2aa`,
  `wcag21aa` e `wcag22aa`, sem exclusões, regras desativadas ou violações.
- A auditoria detectou e corrigiu grupos `dt`/`dd` inválidos no perfil. As
  divisórias visuais agora pertencem ao próprio grupo sem prejudicar a
  semântica da lista de definições.
- O catálogo possui um único `h1`, título de seção `h2` e títulos dos países
  `h3`. O perfil possui um único `h1` seguido por seções `h2`.
- Header, navegação de idioma, conteúdo principal e footer expõem landmarks.
  O skip link é o primeiro controle e transfere o foco para o conteúdo.
- O percurso principal é operável por teclado. Toggle groups usam foco
  itinerante e setas; busca, filtros e cards permanecem alcançáveis por `Tab`,
  com indicador visível.
- Contagens de resultado usam live region educada e atômica. Controles,
  imagens e ícones têm nome acessível, texto alternativo contextual ou são
  corretamente decorativos.
- Os controles principais possuem alvos de 44 px. Controles compactos respeitam
  o mínimo de 24 por 24 px da WCAG 2.2 AA.
- Catálogo e perfil não criam overflow horizontal em 320 px, equivalente ao
  reflow esperado a 400% sobre um viewport CSS de 1280 px. O catálogo também
  permanece utilizável com os overrides de espaçamento de texto da WCAG.
- Com `prefers-reduced-motion: reduce`, scroll suave é removido e animações e
  transições não essenciais são reduzidas a `0.01ms`.
- A regra de contraste do axe passa nos estados testados. O modo de cores
  forçadas também preserva bordas e indicadores de foco explícitos.

## Cobertura automatizada

`tests/e2e/accessibility.spec.ts` cobre:

- catálogo completo nos dois idiomas;
- atualização dinâmica após busca;
- perfil completo em inglês;
- página 404 localizada;
- percurso por teclado e foco visível;
- hierarquia de headings e tamanho de alvos;
- viewport estreito com espaçamento de texto ampliado;
- preferência por movimento reduzido.

Os componentes são avaliados em páginas reais renderizadas, com estilos,
hidratação, roteamento e dados integrados. Isso evita falsos resultados comuns
em auditorias de componentes isolados.

## Limitações e revisão contínua

Ferramentas automatizadas não demonstram conformidade total por si sós. Esta
revisão combina axe, testes de navegador e inspeção manual do código e da
interface, mas testes periódicos com leitores de tela reais, alto contraste do
sistema e usuários de tecnologias assistivas continuam recomendados quando o
produto evoluir.

## Verificações reproduzíveis

```text
npx playwright test tests/e2e/accessibility.spec.ts
npm run test:e2e
npm run lint
npm run typecheck
npm run test
npm run build
```
