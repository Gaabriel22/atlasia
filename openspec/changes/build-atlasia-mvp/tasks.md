## 1. Fundação do projeto

- [x] 1.1 Instalar `next-intl`, `zod` e dependências de desenvolvimento necessárias, registrando scripts de lint, typecheck, testes e build
- [x] 1.2 Inicializar shadcn/ui para Next.js, RSC e Tailwind CSS 4 e confirmar aliases e tokens gerados
- [x] 1.3 Migrar o código da aplicação para `src/` conforme a estrutura definida, preservando arquivos de configuração na raiz
- [x] 1.4 Copiar logo, favicon e ícones aprovados de `Atlasia-old` para a nova pasta `public/brand` sem alterar o projeto antigo
- [x] 1.5 Configurar Vitest, Testing Library e Playwright com um teste mínimo executável
- [x] 1.6 Validar lint, typecheck, testes e build da fundação antes do primeiro checkpoint

## 2. Internacionalização desde a raiz

- [x] 2.1 Criar configuração central de locales `pt-BR` e `en`, com `pt-BR` padrão e pathnames localizados
- [x] 2.2 Criar request config, wrappers de navegação e `src/proxy.ts` do next-intl
- [x] 2.3 Criar dicionários `messages/pt-BR.json` e `messages/en.json` com namespaces iniciais equivalentes
- [x] 2.4 Criar root layout mínimo e layout `[locale]` com validação de locale, provider, `lang` correto e geração estática de locales
- [x] 2.5 Criar seletor de idioma acessível que preserve a rota equivalente e parâmetros dinâmicos
- [x] 2.6 Adicionar teste automatizado de paridade estrutural entre os dois dicionários
- [x] 2.7 Validar redirecionamento por locale, navegação e build antes do checkpoint de i18n

## 3. Arquitetura, ambiente e domínio

- [x] 3.1 Criar configuração server-only de ambiente com schema Zod para URL pública e credencial REST Countries
- [x] 3.2 Criar schemas Zod externos separados para resumo e detalhe usando payloads reais anonimizados como fixtures
- [x] 3.3 Criar schemas e tipos inferidos dos modelos internos `CountrySummary` e `CountryDetail`
- [x] 3.4 Implementar normalizadores puros entre contratos externos e modelos internos, com testes de campos completos e ausentes
- [x] 3.5 Implementar formatadores localizados de nome, população, área, moeda e demais valores com testes em ambos os locales
- [x] 3.6 Criar erros de domínio para autenticação, limite, rede, contrato inválido e país inexistente
- [x] 3.7 Revisar grafo de imports para garantir que domínio e utilitários puros não dependem de Next.js, React, rede ou DTO externo

## 4. Integração REST Countries

- [x] 4.1 Implementar cliente server-only para catálogo com projeção mínima de campos, autenticação e validação Zod
- [x] 4.2 Implementar cliente server-only para perfil por código ISO com projeção detalhada e validação Zod
- [x] 4.3 Configurar revalidação diária, tags de cache e memoização por request nas queries de país
- [x] 4.4 Mapear respostas HTTP e falhas de parsing para os erros de domínio sem vazar informações sensíveis
- [x] 4.5 Testar cliente e queries com fetch simulado para sucesso, ausência, autenticação, rate limit, rede e schema inválido
- [x] 4.6 Executar uma verificação manual autenticada contra a API atual e ajustar somente o adaptador ao contrato observado

## 5. Sistema visual Atlasia

- [x] 5.1 Definir tokens semânticos de tinta, pergaminho, bronze, oceano, superfícies, bordas, foco e estados no CSS global
- [x] 5.2 Configurar tipografias editorial e de leitura com `next/font`, fallback e carregamento otimizado
- [x] 5.3 Adicionar componentes shadcn necessários com CLI e revisar composição, imports, acessibilidade e variantes
- [x] 5.4 Criar shell compartilhado com header, marca, seletor de idioma, footer, landmarks e skip link
- [x] 5.5 Criar atmosfera cartográfica responsiva com textura sutil, profundidade e reduced motion sem biblioteca de animação pesada
- [x] 5.6 Criar estados globais localizados de loading, error e not-found usando `Skeleton`, `Alert`, `Empty` e ações acessíveis
- [x] 5.7 Verificar contraste, foco, alvo de toque, zoom 200% e ausência de overflow em mobile e desktop

## 6. Catálogo e descoberta

- [x] 6.1 Construir hero editorial localizado com proposta do produto e contagem real de países
- [x] 6.2 Construir card de país com `Card`, `Badge` e imagem otimizada para bandeira, nome, capital, região e população
- [x] 6.3 Implementar busca pura case-insensitive e accent-insensitive por nome e capital com testes unitários
- [x] 6.4 Implementar controles cliente com `InputGroup` e `ToggleGroup`, combinando busca e região sem reload
- [x] 6.5 Adicionar contagem de resultados em live region e estados de catálogo vazio, pendente e indisponível
- [x] 6.6 Montar grade responsiva com payload resumido, links localizados e tamanhos de imagem apropriados
- [x] 6.7 Adicionar testes de componente para cards, filtros, fallback de dados e anúncios de resultado
- [x] 6.8 Validar catálogo nos dois idiomas com teclado e viewport mobile antes do checkpoint

## 7. Perfil de país

- [x] 7.1 Criar rota interna `[locale]/countries/[code]` com pathnames externos localizados e validação do código ISO
- [x] 7.2 Criar cabeçalho editorial do país com bandeira, nome localizado, nome oficial, região e navegação por breadcrumb
- [x] 7.3 Criar seções de identidade, geografia, população, idiomas, moedas, códigos e conectividade com componentes shadcn
- [x] 7.4 Omitir ou localizar valores ausentes sem expor JSON bruto ou quebrar a composição
- [x] 7.5 Preservar código do país ao trocar idioma e fornecer retorno localizado ao catálogo
- [x] 7.6 Criar loading e not-found específicos do perfil e cobrir falha recuperável da API
- [x] 7.7 Criar metadata dinâmica localizada, canonical, alternates e imagem social para perfis válidos
- [x] 7.8 Adicionar testes de perfil completo, parcial, código inexistente e troca de locale

## 8. SEO técnico e dados estruturados

- [x] 8.1 Criar configuração central de site e URLs absolutas validada por ambiente
- [x] 8.2 Criar metadata global localizada, manifest, robots, ícones e imagem Open Graph coerentes com a marca
- [x] 8.3 Gerar sitemap com catálogo e perfis válidos em `pt-BR` e `en`, incluindo relações de alternates
- [x] 8.4 Implementar JSON-LD server-side seguro para `WebSite` e `CollectionPage` no catálogo
- [x] 8.5 Implementar JSON-LD server-side seguro para `BreadcrumbList` e `Country` nos perfis
- [x] 8.6 Verificar que dados estruturados refletem conteúdo visível e validar amostras no Schema.org Validator e ferramenta aplicável do Google
- [x] 8.7 Revisar headings, links internos, títulos, descrições, canonicals, hreflang e indexabilidade nos dois locales

## 9. Segurança

- [x] 9.1 Configurar CSP estática e headers defensivos globais sem sacrificar a geração estática
- [x] 9.2 Isolar ambiente e credencial REST Countries em módulo `server-only` validado, sem exposição em bundles, erros ou logs
- [x] 9.3 Restringir CSP e hosts de imagem ao contrato real observado e validar headers em build de produção
- [x] 9.4 Auditar parâmetros dinâmicos, `proxy.ts` e fetch externo contra injeção, SSRF e exposição de informações
- [x] 9.5 Executar auditoria de dependências e verificação de secrets antes da entrega, resolvendo achados de alto risco

## 10. Acessibilidade, performance e entrega

- [x] 10.1 Adicionar axe aos testes de componentes e rotas representativas e corrigir violações detectadas
- [x] 10.2 Executar auditoria manual WCAG 2.2 AA de teclado, foco, landmarks, headings, alternativas, contraste, zoom e reduced motion
- [x] 10.3 Configurar auditoria Lighthouse reproduzível sobre build de produção para catálogo e um perfil em mobile
- [x] 10.4 Cumprir budgets Lighthouse de Performance ≥90, Accessibility 100, Best Practices ≥95 e SEO 100
- [x] 10.5 Verificar LCP ≤2,5 s, INP ≤200 ms e CLS ≤0,1 e corrigir causas medidas sem otimização especulativa
- [x] 10.6 Executar smoke tests Playwright para catálogo, busca, filtro, navegação, troca de idioma, perfil e 404
- [x] 10.7 Atualizar README com visão, arquitetura, estrutura, variáveis de ambiente, scripts, decisões de i18n, segurança e instruções de deploy
- [ ] 10.8 Executar suite final de lint, typecheck, testes, e2e, build, auditoria de segurança e Lighthouse e registrar resultados do MVP
