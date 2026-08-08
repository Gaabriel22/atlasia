## Context

O repositório atual contém uma instalação limpa de Next.js 16.2.11, React 19, TypeScript e Tailwind CSS 4. O projeto anterior comprova a direção do produto e fornece logo e favicon, mas sua integração usa o contrato descontinuado da REST Countries v3.1 e não possui validação de runtime, internacionalização ou biblioteca de componentes.

Atlasia será público, sem autenticação e sem banco de dados. Dados geográficos mudam lentamente, enquanto APIs externas possuem cota, disponibilidade e contratos independentes da aplicação. Um snapshot versionado elimina essa dependência do caminho público. O projeto também precisa funcionar como peça de portfólio: arquitetura compreensível, UI autoral, acessibilidade, SEO, testes e histórico de commits legível importam tanto quanto o catálogo.

## Goals / Non-Goals

**Goals:**

- Preservar a identidade “atlas editorial de explorador” do projeto anterior.
- Criar fundação bilíngue `pt-BR` e `en` antes das páginas de produto.
- Isolar atualização externa em um gerador manual e validar o snapshot com Zod.
- Usar páginas e componentes server-first, limitando JavaScript cliente à descoberta interativa.
- Usar shadcn/ui como conjunto de primitivas acessíveis e personalizá-lo por tokens semânticos.
- Oferecer catálogo rápido e perfil rico de país com URLs estáveis.
- Manter rotas finas e organizar regras de país por feature.
- Dividir trabalho em incrementos pequenos, testáveis e adequados para commits separados.
- Manter o domínio testável sem Next.js, rede ou componentes React.
- Aplicar segurança proporcional a um site público sem autenticação, protegendo browser, credenciais e fronteiras externas.
- Alcançar WCAG 2.2 AA e orçamento Lighthouse definido para mobile.

**Non-Goals:**

- Replicar cada arquivo ou decisão técnica do projeto antigo.
- Expor o payload bruto da API diretamente à UI.
- Adicionar modal interceptado no primeiro ciclo.
- Implementar contas, banco de dados, favoritos, quizzes, progresso ou CMS.
- Traduzir manualmente dados factuais que não possuam representação localizada confiável.
- Criar abstrações genéricas antes de existir segundo consumidor real.

## Decisions

### 1. Estrutura `src/` orientada a feature

Rotas ficarão finas em `src/app`; domínio, contrato externo e regras de apresentação dos países ficarão em `src/features/countries`. Componentes shadcn permanecerão em `src/components/ui`, como esperado pelo ecossistema. Elementos compartilhados de shell ficarão em `src/components/layout`.

```text
messages/
  en.json
  pt-BR.json
public/
  brand/
src/
  app/
    [locale]/
      layout.tsx    # root layout localizado
      page.tsx
      loading.tsx
      error.tsx
      not-found.tsx
      countries/
        [code]/
          page.tsx
          loading.tsx
  components/
    layout/
    ui/
  config/
    env.ts
    site.ts
  features/
    countries/
      api/
        rest-countries.client.ts
        rest-countries.schemas.ts
      components/
      model/
        country.schemas.ts
      queries/
        get-countries.ts
        get-country.ts
      utils/
        country-formatters.ts
        country-search.ts
  i18n/
    navigation.ts
    request.ts
    routing.ts
  lib/
    utils.ts
  proxy.ts
```

Arquivos de teste ficarão próximos da unidade testada quando forem unitários; fluxos ponta a ponta ficarão em `tests/e2e`.

Alternativa considerada: separar tudo por tipo global (`lib`, `types`, `services`, `components`). Rejeitada porque espalha uma única feature por muitas pastas e torna o crescimento futuro menos legível.

### 2. Duas consultas server-only com projeções diferentes

A homepage lerá somente os dados necessários para catálogo: código ISO, nomes, bandeira, capital, região e população. A página individual lerá o país pelo código ISO com uma projeção mais rica. O snapshot completo será validado na entrada antes de sair da feature.

O código ISO alpha-2 será a identidade canônica e o parâmetro de rota. Isso mantém a mesma URL lógica ao trocar idioma e evita slugs dependentes de tradução. A UI poderá exibir nomes localizados usando `Intl.DisplayNames`, com o nome retornado pela API como fallback.

Alternativa considerada: buscar todos os campos de todos os países na homepage. Rejeitada por aumentar payload, validação e dados enviados ao cliente sem benefício para o catálogo.

### 3. Zod como fonte do contrato em runtime

Haverá schemas separados para o payload externo resumido, o payload externo detalhado e os modelos internos. Tipos TypeScript serão inferidos com `z.infer`; JSON externo será tratado como `unknown` e validado uma vez com `safeParse` na fronteira.

Falhas de geração ou contrato interromperão a atualização antes de substituir o último snapshot válido. Componentes nunca conhecerão nomes de campos da fonte externa.

Alternativa considerada: interfaces TypeScript manuais com type assertion. Rejeitada porque não oferecem segurança em runtime contra mudanças do provedor.

### 4. Dependency Rule proporcional ao tamanho do produto

O modelo, schemas internos, formatadores e busca serão funções puras sem imports de Next.js, React ou `fetch`. O módulo de dados validará o snapshot; queries server-only lerão os modelos internos e rotas chamarão essas queries.

Não será criada uma hierarquia cerimonial de entidades, casos de uso, repositórios e classes para operações simples. Uma porta abstrata só será extraída quando surgir um segundo provedor, snapshot persistente ou necessidade real de substituição. Assim, a fronteira volátil permanece isolada sem complexidade acidental.

Funções terão uma responsabilidade, nomes orientados à intenção e contratos pequenos. Erros serão explícitos, sem `any`, type assertions cegas ou valores `null` espalhados. Testes de domínio não dependerão de servidor web.

### 5. Internacionalização prefixada desde a raiz

`next-intl` controlará `pt-BR` e `en`, com `pt-BR` como padrão. `src/proxy.ts` fará negociação por `Accept-Language` e redirecionará URLs sem locale. O conteúdo público ficará em `src/app/[locale]`; esse segmento será o root layout localizado e instalará `NextIntlClientProvider`, permitindo definir `html lang` corretamente sem leitura dinâmica de headers.

Links usarão wrappers de `src/i18n/navigation.ts`. O seletor de idioma preservará rota e código do país atual. Mensagens ficarão em arquivos JSON por locale. Números e nomes de país usarão APIs `Intl` com o locale ativo.

Os caminhos externos podem ser localizados (`/pt-BR/paises/br` e `/en/countries/br`) por meio da configuração de `pathnames`, mantendo um pathname interno único.

Alternativa considerada: adicionar i18n após o MVP. Rejeitada porque textos embutidos, slugs e metadata criariam retrabalho estrutural.

### 6. Página canônica primeiro; modal como melhoria posterior

Detalhes serão exibidos em uma página dedicada. Isso oferece link compartilhável, navegação direta, metadata própria, melhor indexação e uma demonstração de arquitetura mais forte no portfólio. Uma futura rota interceptada poderá apresentar essa mesma página em `Dialog` ou `Drawer` quando aberta pelo catálogo, sem duplicar conteúdo.

### 7. shadcn/ui como primitiva, identidade Atlasia como tema

O projeto inicializará shadcn/ui com RSC e Tailwind 4. Componentes como `Card`, `Badge`, `InputGroup`, `ToggleGroup`, `Button`, `Breadcrumb`, `Separator`, `Skeleton`, `Alert`, `Empty`, `Tooltip` e `DropdownMenu` serão usados quando adequados.

Tokens semânticos em `globals.css` representarão tinta, pergaminho, bronze, oceano e superfícies. Layout, composição editorial, textura, tipografia e arte de fundo continuarão autorais. shadcn não definirá a aparência final; fornecerá comportamento, acessibilidade e consistência.

### 8. Server Components, cache e payload cliente reduzido

Páginas e busca de dados serão Server Components por padrão. Somente controles de busca/filtro e seletor de locale serão Client Components. O cliente receberá apenas o modelo resumido serializável.

Catálogo e perfis usarão um snapshot completo, versionado e validado com Zod. Consultas usadas simultaneamente por metadata e página serão memoizadas por request para evitar trabalho duplicado. Atualizações externas ocorrerão somente por comando manual; navegação, build e deploy não dependerão de cota, credencial ou disponibilidade do provedor.

### 9. Perfil rico organizado, não dump de JSON

A página de país apresentará todos os campos selecionados da consulta detalhada, agrupados em: identidade, geografia, população, idiomas, moedas, códigos e conectividade. Valores ausentes serão omitidos ou receberão fallback localizado. Objetos internos e dados técnicos sem valor para usuário não serão impressos como JSON.

### 10. SEO e Schema.org sem marcação artificial

Homepage usará um grafo JSON-LD com `WebSite` e `CollectionPage`. Perfis usarão `BreadcrumbList` e `Country`, contendo somente propriedades também apresentadas ao usuário. URLs serão absolutas. Não serão usados schemas de `Product`, `FAQPage`, avaliações ou outras marcações sem conteúdo correspondente.

Páginas de país terão título e descrição únicos, heading principal único, links internos a países relacionados quando houver relação factual disponível e sitemap por locale. Canonical apontará para a própria versão localizada; `alternates.languages` conectará `pt-BR` e `en`.

### 11. Acessibilidade WCAG 2.2 AA

HTML semântico e controles nativos terão preferência sobre ARIA. O shell terá skip link, landmarks e hierarquia de headings. Busca e filtros anunciarão quantidade atualizada com live region educada. Alvos interativos terão pelo menos 44×44 CSS pixels como meta de conforto, foco será sempre visível e a experiência funcionará com teclado e zoom de 200%.

Contraste mínimo será 4.5:1 para texto normal, 3:1 para texto grande e componentes. Animações respeitarão `prefers-reduced-motion`; nenhuma informação dependerá apenas de cor ou movimento.

### 12. Performance medida, não presumida

Primeiro serão preservadas decisões de baixo custo: Server Components, pouco JavaScript cliente, projeção pequena no catálogo, cache, `next/image`, `next/font`, dimensões reservadas e ausência de bibliotecas de animação desnecessárias.

Lighthouse CI ou execução equivalente medirá as rotas representativas em build de produção. Orçamento mobile inicial:

- Performance: pelo menos 90.
- Accessibility: 100.
- Best Practices: pelo menos 95.
- SEO: 100.

Core Web Vitals alvo no percentil 75: LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1. O score Lighthouse é um sinal variável, portanto regressões serão investigadas por métricas e auditorias, sem sacrificar legibilidade por otimização especulativa.

### 13. Qualidade e verificação por camada

Cada locale terá `lang`, canonical e alternates corretos. Perfis terão metadata dinâmica, Open Graph e JSON-LD. Sitemap incluirá combinações válidas de locale e país. Imagens usarão `next/image` com tamanhos responsivos.

Testes unitários cobrirão validação, normalização, localização e filtro; testes de componente cobrirão estados críticos e anúncios acessíveis; smoke tests ponta a ponta cobrirão catálogo, teclado, troca de idioma e perfil. Axe e Lighthouse complementarão testes, sem substituir verificação manual.

### 14. Segurança proporcional e defesa em profundidade

O site não possui autenticação, banco, credenciais de dados ou mutações públicas, portanto controles de sessão, CSRF e autorização não serão adicionados sem uma superfície correspondente. Parâmetros de rota serão tratados como entrada não confiável e o snapshot será validado antes do uso.

O Next.js enviará CSP, `Permissions-Policy`, `Referrer-Policy`, proteção contra MIME sniffing, clickjacking e HSTS em produção, além de ocultar `X-Powered-By`. A CSP inicial preservará geração estática; nonce por request foi rejeitado porque forçaria renderização dinâmica em todas as páginas. Os hosts de imagem serão restringidos após confirmar o contrato real da API, sem liberar scripts ou conexões externas desnecessárias.

Dependências serão verificadas com auditoria reproduzível, arquivos de ambiente permanecerão ignorados e os fluxos de erro nunca exibirão credencial, payload sensível ou detalhes internos. `proxy.ts`, parâmetros dinâmicos e chamadas `fetch` externas receberão revisão de segurança específica antes da entrega.

## Risks / Trade-offs

- [Fonte geográfica ficar indisponível ou mudar contrato] → Preservar o último snapshot versionado; falhar a atualização antes de substituir dados válidos.
- [“Mostrar tudo” gerar página extensa e confusa] → Exibir todos os campos selecionados em grupos progressivos; não expor payload bruto.
- [Localização incompleta de dados externos] → Localizar interface, números e nomes via `Intl`; manter valores factuais externos com fallback claro.
- [shadcn deixar visual genérico] → Usar componentes como primitivas e concentrar identidade em tokens, composição, tipografia e atmosfera.
- [Arquitetura feature-first parecer maior no início] → Manter apenas uma feature real e evitar camadas sem responsabilidade concreta.
- [Aplicar Clean Architecture de forma cerimonial] → Preservar somente fronteiras de volatilidade e criar abstrações quando houver consumidor real.
- [Cache diário mostrar dados levemente antigos] → Aceitar defasagem para dados geográficos estáveis; permitir revalidação futura por tag.
- [Fonte externa indisponível durante atualização] → Manter o snapshot versionado anterior e falhar o comando sem sobrescrevê-lo.
- [Lighthouse variar entre execuções] → Rodar build de produção em ambiente controlado, guardar relatórios e usar orçamento junto às métricas individuais.
- [Schema gerar rich result enganoso] → Marcar somente conteúdo visível e validar no Schema.org Validator e Google Rich Results Test quando aplicável.
- [CSP quebrar recursos legítimos ou ficar permissiva demais] → Testar em build de produção e restringir diretivas a partir dos hosts realmente usados, mantendo relatório claro das exceções.
- [Dados malformados entrarem no snapshot] → Validar todos os registros com Zod em testes e no build antes de renderizar.

## Migration Plan

1. Criar fundação de dependências, `src/`, shadcn, tema e ativos de marca.
2. Configurar next-intl, proxy, mensagens e layouts localizados.
3. Implementar schemas, cliente server-only, normalização e testes do domínio.
4. Construir catálogo e estados da homepage.
5. Construir página de país e metadata.
6. Adicionar SEO técnico, JSON-LD, acessibilidade, testes ponta a ponta e documentação.
7. Validar lint, tipos, testes, build, axe, Lighthouse e rotas nos dois locales antes do deploy.

Cada etapa será um ponto seguro de commit. Em caso de regressão, o rollback ocorre por etapa; o projeto antigo permanece intocado como referência visual.

## Open Questions

- O modal com rota interceptada será avaliado somente após a página dedicada estar aprovada.
- A seleção final de campos detalhados será ajustada ao contrato observado na fonte do snapshot, sem quebrar o modelo de apresentação definido aqui.
