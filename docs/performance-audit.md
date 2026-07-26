# Auditoria de performance

Data: 25 de julho de 2026

## Escopo e budgets

A auditoria cobre o catálogo (`/en`) e um perfil de país
(`/en/countries/ca`) sobre o build de produção, servido localmente com a mesma
origem usada na geração dos metadados.

| Verificação | Budget |
| --- | ---: |
| Performance | ≥ 90 |
| Accessibility | 100 |
| Best Practices | ≥ 95 |
| SEO | 100 |
| LCP | ≤ 2,5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0,1 |

## Método reproduzível

- Lighthouse 13.4.1 e Chromium 151, em viewport mobile de 360 × 800, DPR 2.
- Throttling simulado padrão do Lighthouse (Slow 4G e CPU mobile) para as
  categorias, LCP e CLS, mantendo equivalência com o modo padrão do
  Lighthouse e do PageSpeed Insights.
- Três execuções independentes por rota, cada uma em navegador e perfil
  novos; o gate usa a mediana.
- INP medido com `PerformanceEventTiming` durante uma interação real de busca
  e filtro, em três execuções com CPU desacelerada 4×.
- Relatórios HTML e JSON são gravados em `.lighthouse/`, que não é versionado.

Execução completa:

```bash
npm run test:lighthouse
```

Variações úteis:

```bash
npm run test:lighthouse -- --runs=1
node scripts/run-lighthouse.mjs --skip-build --runs=3 --interaction-only
```

## Resultado

| Rota | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Catálogo | 98 | 100 | 100 | 100 | 1,664 s | 0 |
| Perfil | 99 | 100 | 100 | 100 | 1,382 s | 0 |

Na interação do catálogo, o INP foi 160, 168 e 168 ms, com mediana de 168 ms.
Todos os budgets foram cumpridos.

Como contraprova do LCP, uma execução com throttling aplicado pelo DevTools,
em vez da projeção Lantern, mediu 1,884 s no catálogo e 2,107 s no perfil.
Essa execução ajudou a confirmar a causa de renderização, mas o gate principal
permanece no modo simulado padrão.

## Causas medidas e correções

- A folha Tailwind de 13,5 KB criava um novo round-trip bloqueante e consumia
  cerca de 743 ms sob Slow 4G. `experimental.inlineCss` elimina essa cascata
  no primeiro carregamento; a troca consciente é repetir o CSS no HTML.
- A bandeira do perfil era o elemento LCP. Ela recebeu preload e prioridade
  alta, atendendo descoberta, carregamento eager e priority hint.
- A troca da fonte decorativa redefinia o LCP do hero mobile. O título usa uma
  serif local compatível no mobile e mantém Cormorant a partir de `sm`.
  Cormorant continua self-hosted, opcional e sem competir como preload.
- Cada tecla tentava reconciliar centenas de cards e animava a opacidade da
  grade inteira. Os cards foram memoizados, a busca passou a usar debounce de
  200 ms e a pintura global do estado pendente foi removida. O estado continua
  exposto por texto e `aria-busy`.
- Prefetch em massa dos perfis foi desativado e cards fora da viewport usam
  `content-visibility`.

## Limitações

Lighthouse é uma medição de laboratório. Os limites de Core Web Vitals em
produção são avaliados no percentil 75 de usuários reais; portanto, LCP, INP e
CLS devem ser acompanhados novamente com dados de campo após o deploy e volume
de tráfego suficiente.

Referências:

- [Lighthouse: Network Throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)
- [Lighthouse: Variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)
- Documentação local do Next.js 16: `inlineCss` e `next/image`
