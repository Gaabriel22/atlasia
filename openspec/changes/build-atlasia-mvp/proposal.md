## Why

Atlasia precisa renascer como projeto de portfólio funcional, profissional e sustentável, preservando sua identidade cartográfica enquanto substitui a integração obsoleta da REST Countries por um contrato validado e desacoplado. O novo MVP deve demonstrar qualidade de produto, arquitetura e experiência, sem crescer além do necessário para uma primeira entrega commitável.

## What Changes

- Reconstruir a experiência pública do Atlasia com a mesma direção visual editorial/cartográfica, reutilizando logo e favicon do projeto anterior.
- Criar catálogo responsivo de países com busca instantânea por nome ou capital e filtro por região.
- Exibir em cada card bandeira, nome, capital, região e população.
- Criar rota compartilhável e indexável para cada país, com informações da API organizadas em grupos compreensíveis.
- Estruturar toda a aplicação com `next-intl` desde o início, oferecendo `pt-BR` como idioma padrão e `en` como alternativa.
- Localizar rotas, conteúdo da interface, nomes exibidos quando possível, formatação numérica e metadata.
- Consumir a versão atual da REST Countries apenas no servidor, com credencial em variável de ambiente.
- Validar a resposta externa com Zod antes de convertê-la para o domínio interno.
- Usar componentes shadcn/ui sempre que houver primitivo adequado, preservando personalização visual por tokens semânticos.
- Adicionar estados profissionais de carregamento, vazio, erro, ausência de dados e página não encontrada.
- Preparar SEO técnico, acessibilidade, responsividade e metadata dinâmica como parte do MVP.
- Atender WCAG 2.2 nível AA e validar a experiência com teclado, landmarks, contraste, zoom e tecnologias assistivas.
- Definir metas Lighthouse e Core Web Vitals verificáveis para impedir regressões de performance.
- Adicionar JSON-LD Schema.org fiel ao conteúdo visível para site, catálogo, breadcrumbs e perfis de país.
- Aplicar Clean Architecture de forma proporcional, Clean Code e dependências apontando do framework/adaptadores para o domínio.
- Organizar a implementação em camadas orientadas ao domínio e em etapas pequenas para permitir um commit revisável por etapa.
- Manter modal de detalhes fora do primeiro ciclo; a rota dedicada será a experiência canônica. Um modal com rota interceptada poderá ser adicionado depois sem substituir a página.

## Capabilities

### New Capabilities

- `country-data-integration`: Busca server-side, validação Zod, normalização, cache e tratamento de falhas dos dados da REST Countries.
- `country-discovery`: Catálogo, cards, busca, filtro por região e estados de interface da página inicial.
- `country-profile`: Página dedicada e compartilhável com dados do país agrupados, navegação e metadata dinâmica.
- `internationalized-routing`: Rotas prefixadas por locale, traduções `pt-BR`/`en`, navegação consciente de locale e seletor de idioma.
- `atlasia-experience-foundation`: Identidade visual cartográfica, componentes shadcn/ui, responsividade, acessibilidade, SEO básico e estados globais.

### Modified Capabilities

Nenhuma. O projeto ainda não possui especificações de capacidades existentes.

## Impact

- Afeta a aplicação Next.js atual em `app/` e adiciona camadas de domínio, dados, componentes e validação.
- Adiciona shadcn/ui, Zod e next-intl às dependências do projeto.
- Exige uma variável de ambiente server-only para a credencial da REST Countries.
- Reutiliza `atlasia-logo.png` e favicon de `Atlasia-old`, sem modificar o projeto antigo.
- Estabelece rotas públicas localizadas em `/[locale]` e `/[locale]/countries/[slug]`, com redirecionamento da raiz para o locale adequado, além de arquivos de metadata e estados especiais do App Router.
- Não inclui autenticação de usuários, banco de dados, favoritos, quiz, progresso ou internacionalização neste primeiro ciclo.
