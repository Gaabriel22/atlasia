# Validação final do MVP

Data: 25 de julho de 2026

## Resultado

Todos os gates definidos para o MVP foram cumpridos.

| Gate                           | Resultado                                                       |
| ------------------------------ | --------------------------------------------------------------- |
| ESLint                         | Aprovado                                                        |
| TypeScript                     | Aprovado                                                        |
| Vitest                         | 19 arquivos e 72 testes aprovados                               |
| Build de produção              | Aprovado                                                        |
| Playwright                     | 31 testes aprovados                                             |
| Axe / WCAG 2.2 AA              | Sem violações nas rotas representativas                         |
| Dependências de produção       | 0 vulnerabilidades conhecidas                                   |
| Secrets                        | Nenhuma chave ou padrão comum encontrado em arquivos rastreados |
| Lighthouse — catálogo          | 98 / 100 / 100 / 100                                            |
| Lighthouse — perfil            | 99 / 100 / 100 / 100                                            |
| Core Web Vitals em laboratório | LCP ≤ 1,557 s; INP 168 ms; CLS 0                                |

Os scores Lighthouse seguem a ordem Performance, Accessibility, Best Practices
e SEO. Cada rota foi medida três vezes em build de produção; o gate usa a
mediana.

## Segurança

`npm audit --omit=dev` retornou zero vulnerabilidades. O audit completo mantém
doze achados conhecidos e já aceitos em ferramentas de desenvolvimento:

- nove achados altos na árvore do ESLint;
- três achados moderados na árvore do shadcn.

As correções automáticas propostas exigem versões incompatíveis. Essas
dependências não entram no bundle ou no grafo de produção, e o risco residual
está detalhado em [`security-audit.md`](./security-audit.md).

O histórico não contém `.env`, a credencial atual não aparece em arquivos
rastreados e a busca por padrões comuns de secrets não encontrou ocorrências.

## Deploy

Verificação HTTP após a publicação:

| Rota                                               | Resultado                           |
| -------------------------------------------------- | ----------------------------------- |
| `https://atlasia-world.vercel.app/`                | 200 após redirecionar para `/pt-BR` |
| `https://atlasia-world.vercel.app/pt-BR`           | 200                                 |
| `https://atlasia-world.vercel.app/pt-BR/paises/cv` | 200                                 |

## Comandos executados

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm audit --omit=dev
npm audit
npm run test:lighthouse
```
