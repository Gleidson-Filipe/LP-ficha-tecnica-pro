# IDENTIDADE VISUAL — Ficha Técnica Pro Landing Page

## Stack Técnica
- Tailwind CSS para toda estilização (NUNCA criar arquivos .css separados exceto @keyframes)
- shadcn/ui como base quando aplicável, customizados via className
- GSAP (`gsap` + `@gsap/react` + `ScrollTrigger`) para toda animação de scroll e micro-interação — reveals, path-draw, count-up, pinning, parallax pontual. Usar o hook `useGSAP()` em vez de `useEffect` cru, sempre com `scope` definido
- Todos os valores visuais definidos como TOKENS SEMÂNTICOS no tailwind.config
- NUNCA usar valores hardcoded — sempre tokens semânticos
- NUNCA usar cores/radius/sombras padrão do Tailwind — apenas tokens deste documento
- A IA que implementa é RESPONSÁVEL por criar SVGs originais e composições visuais únicas baseadas nas descrições abaixo
- A paleta usa UMA cor accent forte (`#ff4785`) + neutros. NÃO crie arco-íris.
- Ícones: exclusivamente Phosphor Icons (peso `duotone` ou `bold`, nunca `thin`/`light` — precisam ter presença visual)

## Setup Necessário

### Fontes
| Fonte | Uso | Importação |
|---|---|---|
| Switzer | Headlines, hero, números grandes, tipografia-composição (a "arma" visual) | Fontshare (self-hosted via `@font-face` ou pacote `@fontshare/switzer`) |
| General Sans | Body text, UI, labels, badges, tabelas | Fontshare (self-hosted) |
| Piazzolla (itálico) | Palavras de ênfase isoladas dentro de headlines (ex: "não é *só mais uma planilha*") — uso cirúrgico, nunca em blocos de texto | Google Fonts |

**Justificativa (pesquisada, não assumida):** fiz uma pesquisa dedicada sobre quais fontes hoje são reconhecidas como marca registrada de site "gerado por IA"/template genérico. O consenso de 2026 (discussões de designers, incluindo a thread "slop fonts" do Hacker News, e coberturas como a do WhatFontIs e 925studios) aponta explicitamente **Space Grotesk, Inter, Instrument Serif, Geist, Syne, Fraunces, Poppins, Montserrat, Playfair Display, Bebas Neue e DM Sans** como os defaults que hoje sinalizam "vibecoded"/AI slop — justamente por serem os primeiros que ferramentas de IA puxam do Google Fonts. A escolha original deste documento (Space Grotesk + Inter + Newsreader) caía diretamente nesse problema e foi substituída.

A nova escolha usa fontes de fundição (Fontshare) que não vêm do catálogo padrão do Google Fonts — por isso não aparecem nas listas de slop, mesmo tendo qualidade profissional equivalente ou superior:
- **Switzer**: grotesk de inspiração suíça, 18 estilos, qualidade de fundição comparável a fontes pagas como Söhne; caráter técnico-preciso que conversa com o tema "engenharia do lucro"/planilha sem ser fria.
- **General Sans**: par natural do Switzer (mesma linguagem de design da Indian Type Foundry/Fontshare), geometria com toque humanista, ótima legibilidade em UI e mobile.
- **Piazzolla**: serifa editorial compacta, com itálico expressivo e personalidade própria — escolhida por NÃO estar em nenhuma lista de slop (diferente de Instrument Serif/Fraunces/Playfair Display, todas com uso idêntico ao que se pretendia aqui).

Fontes: [Hacker News — "slop fonts" thread](https://news.ycombinator.com/item?id=47865795), [WhatFontIs — Designers Are Punishing AI Fonts in 2026](https://www.whatfontis.com/blog/designers-are-punishing-ai-fonts-in-2026-and-its-making-type-more-human/), [925studios — AI slop design tells](https://www.925studios.co/blog/ai-slop-design-tells), [madegooddesigns — Switzer Font](https://madegooddesigns.com/switzer-font/).

### Libs adicionais
| Lib | Pra quê | Instalação |
|---|---|---|
| `gsap` | Motor de animação — tweens, timelines, path-draw, count-up | `npm i gsap` |
| `@gsap/react` | Hook `useGSAP()` com cleanup automático em React/Next.js | `npm i @gsap/react` |
| `@phosphor-icons/react` | Ícones consistentes (bold/duotone) | `npm i @phosphor-icons/react` |

Justificativa: GSAP (com ScrollTrigger) é o motor de animação usado pela maioria dos sites premium/agência — controle fino de timelines, scrub ligado ao scroll, pinning de seções, e performance melhor que soluções baseadas em CSS transition puro para composições complexas (trilho de Precificação, diagrama de rateio, count-up de números). Registrar `ScrollTrigger` uma vez via `gsap.registerPlugin(ScrollTrigger, useGSAP)`; todo GSAP roda client-side apenas (nunca durante SSR do Next.js) — usar sempre `useGSAP()` com `scope` no ref do container da seção, nunca seletor de string sem escopo.

### Assets externos
| Asset | Pra quê | Como obter |
|---|---|---|
| Screenshots do produto (Modulos, Precificacao, Solucao) | Seções Módulos, Precificação, Solução | Já fornecidos em `assets/Modulos`, `assets/Precificacao`, `assets/Solucao` — não cortar, respeitar proporção original |
| Fotos de depoimentos | Seção Depoimentos | `assets/Depoimentos/*.jpg` |
| Logos | Header e Footer | `assets/Hero/logo ficha tecnica pro.png`, `assets/Footer/logo gestor financeiro.png` |
| Thumb de vídeo | Seção Vídeo | `assets/Video/thumb de video temporaria.png` — vídeo real hospedado no Panda Video, confirmar link definitivo com cliente |

---

## A Alma da LP

Uma landing page que se comporta como a própria planilha que vende: linhas finas, células, grids, números que se alinham com precisão cirúrgica — mas com o calor humano da cozinha por trás. O visitante não é bombardeado com gráficos genéricos de SaaS; ele é conduzido por uma jornada de "acender a luz" sobre custos que hoje são invisíveis. Tipografia grande e confiante, respiros generosos entre argumentos, e UM rosa-elétrico (`#ff4785`) usado como caneta de destaque — nunca como papel de parede.

---

## Referências e Princípios

- **mmm menu (Hero):** headline centralizada curta + mockup de produto real emergindo do fundo com gradiente radial sutil → Princípio: o produto real pode ser o herói visual sem precisar de composição abstrata quando o produto É visualmente interessante → Aplicação: no Hero, o mockup da planilha (`Mockup-Hero2.png`) recebe tratamento de "elevação" (sombra profunda + leve perspectiva), não fica jogado como screenshot cru.
- **Leedlime / Ruul (Hero split):** headline serifada à esquerda + produto real à direita sobre fundo texturizado (verde oliva, grão fotográfico) → Princípio: textura de fundo pontual em UMA seção específica cria atmosfera sem virar identidade global → Aplicação: considerar textura sutil de "papel/grão" apenas na seção Hero ou CTA final, nunca em todas as seções.
- **Headlands Tech / Aspen Search / OhhMyDesign (Footer):** wordmark tipográfico GIGANTE ocupando a seção inteira do footer, com grid de colunas finas acima (links, contato, social) → Princípio: o footer pode ser uma seção de impacto tipográfico, não uma lista de links esquecida → Aplicação: footer da Ficha Técnica Pro usa grid de linhas finas (tema planilha) + o nome do produto ou CTA final em tipografia massiva antes do copyright.
- **Bradia / grafo de tours (referências diversas):** fluxo de cards conectados por linhas tracejadas em ângulo reto, com ícone circular em cada nó → Princípio: processos sequenciais ganham muito mais clareza narrativa como um "circuito" visual do que como 3 caixas numeradas lado a lado → Aplicação: seção Precificação (5 etapas) usa um conector visual entre os cards — não é preciso path SVG orgânico, uma linha reta tracejada tipo "trilho de planilha" já é temática e clara.
- **Rig ("Purpose beats scale") / Wist (dark, 2 colunas):** lista vertical de steps à esquerda (um ativo, destacado com borda accent) + painel visual fixo à direita que muda conforme o step ativo → Princípio: interações do tipo "tab ativa muda o conteúdo ao lado" comunicam sofisticação sem precisar de ilustração nova a cada item → Aplicação: descartado para a seção fundida "Mecanismo Único" pois o cliente já definiu grid de 4 colunas (ver seção própria abaixo) — mas o princípio de "um item ativo com destaque accent" é reaproveitado dentro dos próprios cards do grid (numeração 01-04 em rosa).
- **Deceptive patterns stats (roxo/amarelo, blocos de cor cheios):** números estatísticos GIGANTES (4x, 95%, 70%) em blocos de cor sólida cheia, um por linha → Princípio: números como protagonistas visuais (não como "stat card" pequeno) criam parada de leitura e memorabilidade → Aplicação: microcopy de Prova Social (~25 mil usuários, acesso vitalício, pagamento único) pode usar 1-2 números em escala tipográfica grande dentro do filete, em vez de ícone+texto pequeno.
- **Linea / Squire testimonials (grid assimétrico com bloco de número):** depoimentos em grid, mas UM bloco da grid é substituído por um número de credibilidade em cor sólida ("50+ projetos entregues") → Princípio: misturar prova social qualitativa (depoimento) com quantitativa (número) no mesmo grid reforça a mensagem sem precisar de seção extra → Aplicação: considerar 1 card do grid de Depoimentos substituído por selo "+25 mil usuários" se o layout permitir, para reforçar sem duplicar a seção de Prova Social.
- **"THE CARDS ARE ON THE TABLE" / cards numerados 01-03 levemente rotacionados:** títulos gigantes em caixa alta condensada + cards com número grande no canto → Princípio: números grandes (01, 02, 03) como assinatura visual reforçam a ideia de "processo enumerado, sem mistério" → Aplicação: é exatamente o padrão que o cliente já escolheu (via mockup enviado) para a seção fundida — cards claros numerados 01-04 sobre fundo escuro, e reaproveitado no fluxo de Precificação (Etapa 1 de 5 → 5 de 5) com a mesma linguagem numérica.
- **ChainGPT Labs / Refresh Studio (footer com grid fino + wordmark):** divisórias finas criando "planilha" mesmo no footer, números/CTAs em blocos separados por linha → Princípio: o grid de linhas finas é reaproveitável em QUALQUER seção como atmosfera de fundo, não só decoração pontual → Aplicação: adotado como a atmosfera global da LP (ver abaixo) — a única atmosfera que faz sentido tematicamente para "planilha".

---

## Narrativa de Scroll (Blueprint da Página)

A ordem segue o argumento de venda: prometer → provar que funciona → validar socialmente → mostrar o problema → mostrar a solução → detalhar o produto → provar diferencial → converter → tirar dúvidas → fechar. Energia alterna entre seções DENSAS (muita composição visual/prova) e seções RESPIRO (espaço, uma frase, uma prova social rápida) para o scroll não cansar — especialmente pensando em mobile, onde a maior parte do tráfego vai estar.

| Seção | Energia | Fundo | Layout | Papel narrativo |
|---|---|---|---|---|
| Header/Nav | sutil, presente | transparente → solid no scroll | fixo, logo + slogan abaixo | Orientação constante, ancoragem de marca |
| Hero | ALTA — impacto | dark (`#09090a`) | centralizado, mockup emergindo abaixo | A promessa: descobrir o custo real e lucro de cada prato |
| Vídeo | ALTA — prova visual | dark (`#0d0d0f`, leve contraste do Hero) | centralizado, player grande | Mostrar o produto "vivo" por dentro |
| Prova Social (filete) | BAIXA — respiro | light (`#f5f4ea`) | faixa horizontal fina, números grandes | Validação rápida: 25 mil usuários, vitalício, pagamento único |
| Problemas (fundida) | ALTA — tensão | dark (`#09090a`) | grid 2x2 de cards + bloco de "rateio genérico" | Agitar a dor: achismo, custo invisível, CMV fantasma, rateio genérico |
| Solução | MÉDIA — virada | light (`#f5f4ea`) | split: texto esquerda / mockup direita | Resolução: onde o lucro estava escondido |
| Módulos | ALTA — prova, exploração | light (`#f5f4ea`) | galeria/slider horizontal | Demonstração: tudo que o produto faz, em detalhe |
| Precificação (fluxo) | ALTA — prova, processo | dark (`#09090a`) | fluxo vertical conectado, 5 etapas + resultado | Remoção de atrito: como o cálculo automático funciona passo a passo |
| Mecanismo + Diferencial (fundida) | MÉDIA — clareza | dark (`#09090a`) | grid 4 colunas numeradas (mockup do cliente) | Prova do diferencial: por que não é "só mais uma planilha" |
| Depoimentos | MÉDIA — emocional | light (`#f5f4ea`) | grid/carrossel de cards com foto | Prova social emocional, não deixar perto do final |
| Oferta/Preço | ALTA — decisão | dark (`#09090a`) | box centralizado com preço + garantia | Facilitação da decisão de compra |
| FAQ | BAIXA — resolução de objeção | light (`#f5f4ea`) | accordion vertical | Tirar as últimas dúvidas |
| CTA Final | ALTA — clímax | dark (`#09090a`) | centralizado, texto grande | Urgência final antes do footer |
| Footer | BAIXA — encerramento | dark (`#0d0d0f`) | grid de linhas finas + wordmark grande | Credibilidade, contato, Instagram do Gestor Financeiro |

---

## Decisões de Identidade

### RITMO E ESTRUTURA

#### Ritmo de Scroll
**O que:** Alternância dark → light → dark a cada 2-3 seções, criando "atos". Hero e Vídeo abrem em dark para impacto imediato; Prova Social respira em light; Problemas volta pro dark pra tensão; Solução e Módulos ficam em light (fase de resolução/exploração); Precificação e Mecanismo voltam pro dark (fase de prova técnica); Depoimentos e FAQ ficam em light (fase emocional/racional final); Oferta, CTA Final e Footer fecham em dark (decisão e clímax).
**Por que:** O produto é uma ferramenta de precisão/números — o dark comunica "seriedade técnica" e o light comunica "clareza, organização, ar livre". Alternar os dois no ritmo do argumento evita monotonia e faz o visitante sentir que a página tem "capítulos".
**Como:** Alternância de fundo de seção inteira (nunca gradientes dentro da mesma seção misturando dark/light); espaçamento vertical generoso entre seções (mínimo 96px desktop, 64px mobile) pra cada transição respirar.
**Nunca:** Duas seções dark seguidas sem nenhuma seção light entre Hero e Problemas (perderia o respiro da Prova Social); mais de 3 seções dark consecutivas em qualquer ponto da página.

#### Layout Global
**O que:** Alternância entre centralizado (Hero, Vídeo, títulos de seção) e split assimétrico (Solução: texto/mockup; Precificação: fluxo vertical com imagem lateral alternando esquerda/direita a cada etapa, como no HTML antigo).
**Por que:** Layouts 100% centralizados em toda a página ficam monótonos; a alternância L/R nas etapas de Precificação já existia no material de referência do cliente e funciona bem para "guiar o olho" em zigue-zague — um padrão de leitura natural em mobile (empilha) e em desktop (Z-pattern).
**Como:** Container máximo de 1200px para conteúdo, 1440px para composições visuais largas (fluxo de Precificação, grid Mecanismo). Grid de 12 colunas no desktop, stack single-column no mobile.
**Nunca:** Layout "3 cards genéricos lado a lado" como única estratégia em qualquer seção — mesmo a seção de Problemas (que É um grid 2x2) precisa ter os cards com peso tipográfico desigual (não ícone+título+texto idênticos visualmente) para não parecer template.

#### Navegação
**O que:** Nav fixa, transparente sobre o Hero (dark), ganha fundo sólido com leve blur (`backdrop-blur`) e sombra sutil ao passar de ~80px de scroll. Logo "Ficha Técnica Pro" à esquerda, slogan "Engenharia do lucro para gastronomia" em texto pequeno logo abaixo da logo (conforme instrução do cliente) — visível apenas no estado inicial do Hero, encolhe/some da nav fixa para economizar espaço vertical no scroll.
**Por que:** Slogan reforça posicionamento logo no primeiro contato, mas não pode competir por espaço permanente com o CTA da nav fixa.
**Como:** CTA "Precificar certo" sempre visível na nav a partir do momento em que ela vira sólida; em mobile, menu hamburguer mínimo (a página é single-scroll, não precisa de nav complexa) — priorizar botão CTA visível sobre menu de links.
**Nunca:** Nav com 6+ itens de menu — essa LP é de conversão direta (scroll story), não precisa de nav de institucional com Sobre/Blog/Carreiras.

#### Transições entre Seções
**O que:** Corte seco de cor de fundo (sem gradiente de transição) reforçando a metáfora de "quebra de página/aba de planilha"; um traço fino horizontal (`border-subtle`) no ponto de transição, como a borda de uma célula.
**Por que:** Gradientes de transição suavizam demais e diluem o tema "planilha" (linhas retas, células bem definidas). O corte seco com uma linha fina é mais fiel à metáfora central do produto.
**Como:** `border-top: 1px solid` na cor de borda apropriada ao fundo que está começando, opacity baixa (~10-15%).
**Nunca:** Overlap de elementos entre seções (um card "flutuando" entre duas seções) — quebraria a metáfora de células discretas.

### LINGUAGEM VISUAL

#### Tipografia
**O que:** Switzer para headlines (peso 600-700, tracking levemente negativo em tamanhos grandes), General Sans para corpo (400-500), Piazzolla itálico reservado para 1-3 palavras de ênfase dentro de um H2 (nunca a headline inteira).
**Por que:** Pesquisa dedicada (ver Setup Necessário → Fontes) confirmou que Space Grotesk, Inter e serifas tipo Instrument Serif/Fraunces são hoje reconhecidas como "fontes de IA slop" — justamente as mais puxadas por ferramentas de geração automática. Switzer e General Sans (Fontshare) entregam qualidade de fundição equivalente sem esse estigma; Switzer tem personalidade geométrica-técnica suíça que conversa com o tema "planilha/engenharia" sem ser fria; o toque itálico da Piazzolla cria contraste de peso que dá sofisticação sem virar decoração nem repetir o clichê visual de 2024-2025.
**Como:** Escala tipográfica com tokens: `text-hero` (56-72px desktop / 36-44px mobile, peso 700), `text-section-title` (36-48px / 28-32px, peso 600), `text-section-subtitle` (18-20px, peso 500, cor `text-secondary`), `text-body` (16-17px, peso 400), `text-caption` (13-14px, peso 500, uppercase tracking 0.05em para eyebrows tipo "MÓDULOS INTEGRADOS").
**Nunca:** Mais de 2 famílias tipográficas ativas na mesma seção; itálico serifado em blocos de texto corrido (só em palavras isoladas de ênfase).

#### Paleta de Cores
**O que:** UMA cor accent (`#ff4785`) + neutros (`#f5f4ea` claro, `#09090a` escuro primário, `#0d0d0f` escuro secundário/grafite).
**Por que:** Regra de ouro do design.md — identidade forte não é arco-íris. O rosa já é a cor de marca definida pelo cliente; usá-la com escassez (CTAs, números-chave, sublinhados, badges) a torna mais memorável do que se estivesse em toda seção.
**Como:** Ver tokens de design abaixo — `accent-primary` só aparece em: botão CTA principal, número/palavra de destaque em headline, badges "⚡ Cálculo automático", numeração 01-04 dos cards, ícones ativos/hover.
**Nunca:** Gradiente rosa-para-outra-cor (viraria arco-íris); rosa como cor de fundo de seção inteira; mais de 1 elemento accent por "dobra" de tela — se o CTA já é rosa, o ícone ao lado não precisa ser.

#### Geometria e Formas
**O que:** Cantos majoritariamente retos ou com radius pequeno (4-8px) nos cards — nunca pill/totalmente arredondado, exceto no botão CTA principal (que pode ter radius maior, 8-12px, para se destacar como "elemento clicável" único). Divisórias em linha fina reta (1px), nunca curvas decorativas.
**Por que:** Reforça o tema "planilha" (células retangulares, bordas retas) sem copiar 1:1 um grid do Excel — é uma interpretação editorial, não literal.
**Como:** `radius-card: 6px`, `radius-button: 10px`, `radius-badge: 999px` (badge é a única exceção pill, para diferenciar de card).
**Nunca:** Blobs orgânicos, formas assimétricas decorativas, cantos arredondados grandes (16px+) em cards de conteúdo.

#### Profundidade e Efeitos
**O que:** Flat na maior parte da UI; sombra dramática única e pontual nos mockups de produto (Hero, Solução) para dar sensação de "elevação física" da planilha sobre o fundo — não em cards genéricos.
**Por que:** Sombra em tudo é ruído; reservada aos mockups reais do produto, ela funciona como spotlight — literalmente "aqui está o produto, olhe".
**Como:** `shadow-float` (grande, soft, opacity baixa, leve tint da cor de fundo escura) aplicada só a `Mockup-Hero2.png` e `Mockup-solucao2.png`.
**Nunca:** Glassmorphism, drop-shadow colorida (rosa) em qualquer elemento — sombra é sempre neutra/escura mesmo em fundo dark.

#### Micro-interações
**O que:** Hover em cards de Módulos/Precificação eleva sutilmente (translateY -4px) + a borda vira accent; CTAs têm leve scale (1.02) + brightness no hover; números/stats fazem count-up ao entrar no viewport.
**Por que:** Reforça affordance de clique sem exagero, e o count-up em números (25 mil usuários, 5 módulos, 100% automatizado) transforma estatística estática em momento de leitura ativa.
**Como:** Transições 200-250ms ease-out; ScrollTrigger com `toggleActions: "play none none none"` (ou `once: true` quando não precisa reverter) para disparar count-up e reveals apenas uma vez ao entrar no viewport.
**Nunca:** Cursor customizado, parallax pesado (o público é majoritariamente mobile, parallax complexo pesa performance e não funciona bem em touch).

### DRAMATURGIA VISUAL ← OBRIGATÓRIO

#### Atmosfera Global
**O que:** Grid de linhas finas (tipo planilha/spreadsheet) muito sutil cobrindo o fundo de TODAS as seções — verticais e horizontais espaçadas irregularmente (não um grid quadriculado perfeito, para não parecer papel milimetrado genérico), lembrando bordas de células.
**Temática:** É a metáfora central definida pela própria instrução do cliente: "o produto é uma planilha, e o que uma planilha possui? Muitas linhas, retângulos, whitespace". Esse padrão de linhas finas também apareceu repetidamente nas referências (ChainGPT Labs, Refresh Studio, Aspen Search) como textura de fundo elegante.
**Tratamento:** Opacity 4-6% em fundos dark (linhas em `#f5f4ea` a essa opacidade), opacity 5-8% em fundos light (linhas em `#09090a` a essa opacidade). As linhas não se movem no scroll (fixas ao documento, não ao viewport) para não distrair. Em 2-3 pontos estratégicos (Hero, Precificação), algumas células do grid podem ganhar um preenchimento sutil extra (opacity ainda mais baixa) para sugerir "dados preenchidos" sem formar nenhum texto/número legível.

#### Composições Narrativas por Seção

##### Hero
**Comunica:** A promessa central — descobrir o custo real e o lucro de cada item do cardápio, com preços que geram lucro e não só faturamento.
**Composição visual:** O mockup real da planilha (`Mockup-Hero2.png`) é o herói — não uma composição SVG abstrata. O produto em si já é visualmente rico (números, cores de status, tabelas), então a composição narrativa é o TRATAMENTO dado a ele: emerge do centro-baixo da tela como se estivesse "subindo à superfície" do fundo escuro, com leve perspectiva 3D sutil (rotateX de 2-4 graus, não um mockup de device) e um brilho radial suave atrás dele na cor accent em opacity muito baixa (8-10%), como um holofote focando no produto.
**Cena detalhada:** Headline centralizada em `text-hero`, 2 linhas máximo, com 1 palavra-chave em `accent-primary` (a palavra "lucro"). Subheadline em `text-section-subtitle`, `text-secondary`, 1 linha. **CTA logo abaixo da subheadline** — botão rosa com 2 linhas de texto (linha 1 regular, linha 2 bold caps) e microcopy de prova social pequena abaixo do botão. Só então o mockup, ocupando até 85% da largura em desktop, centralizado, com `shadow-float` e o glow radial accent atrás (z-index inferior, blur ~110px), levemente inclinado (`rotateX(3deg)` com origem na base) como se emergisse da página. No mobile: mockup a 100% da largura do container com padding lateral mínimo, headline em 38-44px, glow reduz proporcionalmente.

> Decisão de implementação: o CTA ficou **antes** do mockup (e não depois, como esboçado inicialmente) para manter a ação acima da dobra e respeitar o padrão F de leitura — headline → promessa → ação. O mockup, vindo em seguida, funciona como prova visual que puxa o usuário para o scroll.
**Viabilidade:** CÓDIGO PURO (glow radial via CSS radial-gradient) + ASSET EXTERNO (Mockup-Hero2.png já fornecido).
**Alternativa simplificada:** Se a perspectiva 3D no mockup gerar distorção visual ruim em telas pequenas, usar apenas o mockup reto com sombra e glow, sem rotação.

##### Precificação (Fluxo de Cálculo — 5 Etapas + Resultado)
**Comunica:** Remoção de atrito — o processo de precificar, que parece complexo, é automático e sequencial. Prova de como o produto calcula o preço de venda.
**Composição visual:** Um "trilho" vertical central (linha fina tracejada, cor `border-subtle` com leve tint accent) conecta os 6 cards (5 etapas + resultado) de cima a baixo, como o fio de costura entre células de uma planilha. Cada card tem um "nó" circular pequeno (12px) na linha, preenchido em accent quando é a etapa atual visível no viewport (ativado via scroll), cinza nos demais. Os cards alternam texto-esquerda/imagem-direita e texto-direita/imagem-esquerda a cada etapa (zigue-zague), replicando o padrão do material de referência do cliente, mas com o trilho central substituindo os ícones emoji antigos por ícones Phosphor.
**Cena detalhada:** Cada etapa: badge pequeno "ETAPA X DE 5" em `text-caption` uppercase; ícone Phosphor 32px em círculo com fundo accent-subtle; H3 em `text-section-title` reduzido; parágrafo em `text-body`; badge "⚡ Cálculo automático" com o raio como ícone Phosphor `Lightning`. Imagem do módulo correspondente (`ingredientes.png`, `embalagens.png`, `maquinarios.png`, `maodeobra.png`, `precificacao.png`) em container com `radius-card`, borda fina, sem cortar a imagem original. O card de Resultado final (`resultado.png`) é maior/destacado — fundo com leve tint accent-subtle, badge "✅ RESULTADO" em vez de número de etapa, lista de 6 itens com checkmarks Phosphor. No mobile: trilho vertical permanece (mais fino), cards empilham sem alternância L/R (sempre imagem acima, texto abaixo, para leitura natural).
**Viabilidade:** CÓDIGO PURO (trilho SVG/CSS, ícones Phosphor, animação de ativação por scroll) + ASSET EXTERNO (6 imagens já fornecidas em `assets/Precificacao/`).
**Alternativa simplificada:** Se o trilho vertical com nós animados for complexo demais, uma linha estática simples sem animação de ativação ainda comunica a sequência claramente.

##### Mecanismo Único + Diferencial (seção fundida — "Por que não é só mais uma planilha?")
**Comunica:** Prova do diferencial técnico — os 4 pilares que tornam o cálculo da Ficha Técnica Pro diferente de uma planilha comum (fator de correção, energia/gás isolados, mão de obra por tempo, embalagens/impostos/delivery).
**Composição visual:** Segue o layout já validado pelo cliente via mockup enviado: eyebrow em accent-primary ("Cálculo Automático. Zero Complicação."), H2 branco com 1 trecho sublinhado/destacado, grid de 4 colunas com cards claros (`surface-card` claro) sobre fundo escuro — o contraste claro-sobre-escuro dentro da própria seção (em vez de alternar a seção inteira) já cria uma pequena dramaturgia interna.
**Cena detalhada:** Cada card: número "01"–"04" grande em accent-primary (peso 700, ~32px) no topo; ícone Phosphor 24px logo abaixo do número, também em accent-primary; título em `text-section-subtitle` peso 600, cor escura (os cards são claros); descrição em `text-body` menor, cor `text-secondary`. Os 4 cards têm leve variação de altura ou um deles (o de "Embalagens, Impostos e Delivery", mais denso em conteúdo) levemente mais alto, quebrando a simetria perfeita de grid genérico. No mobile: grid vira scroll horizontal com snap (carrossel) ou empilha 1 coluna — decidir conforme teste de espaço; carrossel preferível para manter a sensação de "cards numerados em sequência".
**Viabilidade:** CÓDIGO PURO — layout já referenciado visualmente pelo cliente, sem necessidade de asset externo.
**Alternativa simplificada:** N/A — já é a versão simplificada de duas seções antigas fundidas em uma.

##### Problemas (Agitação + Rateios Genéricos — fundida)
**Comunica:** A dor: faturamento que engana e falta de controle de custos que quebra o negócio, culminando no perigo específico dos rateios genéricos.
**Composição visual:** Grid 2x2 de cards de problema (Preço no Achismo, Custos Invisíveis, Fantasma do CMV, Desperdício não Calculado) seguido por um bloco de destaque maior e distinto — não mais um card igual aos outros — para o argumento de "rateio genérico", com um ícone/mini-diagrama simples mostrando uma despesa sendo "dividida igualmente" entre pratos que não deveriam recebê-la (ex.: um pequeno diagrama de setas saindo de um bloco "despesa geral" e se espalhando uniformemente para 3-4 ícones de prato, um deles marcado com alerta accent).
**Cena detalhada:** H2 de abertura em `text-section-title`, tom mais grave. 4 cards com ícone Phosphor temático (ex.: `Target` para achismo, `EyeSlash` para custos invisíveis, `Ghost` para fantasma do CMV, `TrashSimple` para desperdício), título e parágrafo curto. Abaixo, bloco full-width com fundo levemente diferenciado (ainda dark, mas com o grid de atmosfera mais visível/denso ali) contendo o mini-diagrama de rateio + os 2 parágrafos de copy sobre "erro fatal na gastronomia". No mobile: grid 2x2 vira 1 coluna, diagrama de rateio simplifica para versão vertical (despesa no topo, setas descendo para 3 ícones de prato).
**Viabilidade:** CÓDIGO PURO (diagrama simples em SVG com setas e ícones Phosphor).
**Alternativa simplificada:** Se o diagrama de rateio for complexo, substituir por 3 ícones de prato lado a lado com uma "barra de custo" idêntica sobre cada um (mostrando visualmente que o rateio genérico ignora a diferença real entre pratos) — mais simples de implementar e igualmente didático.

##### Depoimentos
**Comunica:** Prova social emocional — pessoas reais tiveram resultado com o produto.
**Composição visual:** Grid assimétrico (não 3 cards idênticos): fotos de depoimento (já existentes em `assets/Depoimentos/`) em tamanhos variados, alguns cards maiores que outros, seguindo o padrão observado nas referências (Linea/Squire — um bloco do grid vira número de credibilidade). Um dos espaços do grid é substituído por um card de destaque com número grande "+25 mil" em vez de foto, reforçando a Prova Social sem repetir a seção do filete.
**Cena detalhada:** Cards com a foto do depoimento em `radius-card`, borda fina. Grid CSS com `grid-template-areas` ou masonry simples para variar tamanhos (2 cards grandes, resto médio/pequeno). Fundo light para contraste emocional/calor depois da seção técnica escura anterior.
**Viabilidade:** CÓDIGO PURO (grid) + ASSET EXTERNO (9 fotos já fornecidas).
**Alternativa simplificada:** Se masonry for complexo, grid uniforme 3 colunas com apenas variação de altura em 1-2 cards via `row-span`.

##### Prova Social (filete)
**Comunica:** Validação rápida e objetiva antes de aprofundar — o produto já é usado e confiável.
**Composição visual:** Faixa horizontal fina (não uma seção cheia), fundo light, com 3 blocos separados por linhas finas verticais (tema planilha/célula): "+25 mil usuários" (número grande em accent, count-up ao entrar em viewport), "Pagamento único", "Acesso vitalício" — cada bloco com um ícone Phosphor pequeno acima do texto.
**Cena detalhada:** Altura reduzida (~120-160px desktop), texto centralizado em cada célula, divisórias `border-subtle` verticais entre os 3 blocos. No mobile: empilha verticalmente com divisórias horizontais finas, mantendo a metáfora de células.
**Viabilidade:** CÓDIGO PURO.
**Alternativa simplificada:** N/A — já é o formato mínimo viável.

---

## Tokens de Design

### Cores — Fundos
| Token | Valor | Uso |
|---|---|---|
| `surface-page` | `#f5f4ea` | Fundo principal em seções light |
| `surface-page-dark` | `#09090a` | Fundo principal em seções dark |
| `surface-section-alt` | `#0d0d0f` | Fundo alternativo dark (grafite, usado em Vídeo/Footer para variar sutilmente do dark principal) |
| `surface-card` | `#ffffff` | Cards claros sobre fundo dark (seção Mecanismo/Diferencial) |
| `surface-card-dark` | `#131316` | Cards escuros sobre fundo dark (Precificação, Problemas) |
| `surface-card-light` | `#ffffff` | Cards sobre fundo light (Módulos, Depoimentos) |
| `surface-elevated` | `#ffffff` | Nav quando sólida (fundo original é dark, então nav sólida no scroll usa leve translucidez escura, não branca — ver nota abaixo) |

Nota: como o Hero é dark, a nav sólida no scroll deve usar `rgba(9,9,10,0.85)` + `backdrop-blur` em vez de branco, para não quebrar o tom do topo da página.

### Cores — Texto
| Token | Valor | Uso |
|---|---|---|
| `text-primary` | `#09090a` (sobre light) / `#f5f4ea` (sobre dark) | Headlines, títulos |
| `text-secondary` | `#52524f` (sobre light) / `#a1a19c` (sobre dark) | Subtítulos, corpo |
| `text-muted` | `#8a8a84` (sobre light) / `#6b6b68` (sobre dark) | Captions, labels, metadata |
| `text-on-accent` | `#ffffff` | Texto sobre fundo accent (botões) |

### Cores — Accent (UMA COR APENAS)
| Token | Valor | Uso |
|---|---|---|
| `accent-primary` | `#ff4785` | CTAs, links, highlights, badges, numeração 01-04, ícones ativos |
| `accent-hover` | `#ff2e73` | Hover state (leve escurecimento) |
| `accent-subtle` | `#ff4785` a 10-12% opacity | Backgrounds translúcidos, glow do Hero, fundo de ícone circular |

### Cores — Status (apenas feedback funcional, se houver formulário)
| Token | Valor | Uso |
|---|---|---|
| `status-success` | `#22c55e` | Confirmação |
| `status-error` | `#ef4444` | Erro de validação |

### Tipografia
| Token | Valor | Uso |
|---|---|---|
| `font-display` | Switzer | Headlines hero, títulos de seção, números grandes |
| `font-body` | General Sans | Texto corrido, descrições, UI |
| `font-accent-italic` | Piazzolla (italic) | Palavras isoladas de ênfase dentro de headlines |
| `text-hero` | 64px/700/-0.02em (desktop), 38px/700/-0.01em (mobile) | Headline do Hero |
| `text-section-title` | 42px/600/-0.01em (desktop), 30px/600 (mobile) | Título de seção |
| `text-section-subtitle` | 19px/500, `text-secondary` | Subtítulo de seção |
| `text-body` | 16px/400, line-height 1.6 | Texto corrido |
| `text-caption` | 13px/600, uppercase, letter-spacing 0.06em | Labels, eyebrows, badges |
| `text-cta` | 15px/600 | Texto de botões |

### Bordas
| Token | Valor | Uso |
|---|---|---|
| `border-default` | 1px solid, `#e5e4d8` (light) / `#1e1e21` (dark) | Contornos padrão de card |
| `border-subtle` | 1px solid, opacity 8-10% do `text-primary` correspondente | Divisórias entre seções, linhas do grid de atmosfera |

### Geometria
| Token | Valor | Uso |
|---|---|---|
| `radius-card` | 6px | Cards |
| `radius-button` | 10px | Botões/CTAs |
| `radius-input` | 6px | Inputs (se houver) |
| `radius-badge` | 999px | Badges/tags (única forma pill da LP) |

### Sombras
| Token | Valor | Uso |
|---|---|---|
| `shadow-float` | `0 40px 80px -20px rgba(0,0,0,0.35)` | Mockups de produto (Hero, Solução) |
| `shadow-nav` | `0 1px 0 rgba(255,255,255,0.06)` | Nav quando fixa/sólida sobre dark |
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.06)` | Cards sobre fundo light (sutil) |

### Espaçamento
| Token | Valor | Uso |
|---|---|---|
| `section-padding-y` | 96px desktop / 64px mobile | Padding vertical padrão de seções |
| `section-padding-y-lg` | 140px desktop / 88px mobile | Seções "respiro" (Prova Social, transições de ato) |
| `content-max-width` | 1200px (texto) / 1440px (composições visuais largas) | Largura máxima do conteúdo |

---

## Componentes-Chave — Overrides

| Componente | Override (usando tokens) |
|---|---|
| `<Button>` (CTA primário) | `bg-accent-primary`, `text-on-accent`, `radius-button`, padding generoso (16px/32px), hover: `bg-accent-hover` + scale 1.02, duas linhas de texto (regular + bold caps) quando for o CTA "Precificar Certo" |
| `<Button>` (secundário) | `bg-transparent`, `border-default`, `text-primary`, hover: `border-accent-primary` |
| `<Badge>` | `radius-badge`, `bg-accent-subtle`, `text-accent-primary` (dark) ou variante neutra `bg-surface-card`, `text-muted` para badges informativos |
| `<Card>` (feature/módulo/etapa) | `radius-card`, `border-default`, `surface-card-light`/`surface-card-dark` conforme seção, hover: translateY(-4px) + `border-accent-primary` a 40% opacity |
| `Nav` | `fixed`, transparente sobre Hero, transição para `rgba(9,9,10,0.85)` + `backdrop-blur(12px)` + `shadow-nav` após 80px de scroll |

---

## Animações de Scroll (Diretrizes)

Tom geral: sutil e confiante, nunca "flashy". A página deve parecer precisa (como a planilha que vende), não brincalhona. Motor: GSAP + ScrollTrigger em todos os itens abaixo (nunca CSS `@keyframes` para scroll-linked — só GSAP tem o controle de `scrub`/`toggleActions` necessário).

| Seção/Elemento | Mecanismo GSAP | Descrição |
|---|---|---|
| Hero headline | `gsap.timeline()` na entrada (sem ScrollTrigger, dispara no mount) | Fade up 16px + opacity 0→1, 0.6s ease-out, H1 e H2 em sequência na timeline com leve overlap (`"-=0.3"`) |
| Hero mockup | mesma timeline do headline, tween seguinte | Fade + scale 0.96→1, 0.7s ease-out, entra logo após a headline na timeline |
| Trilho de Precificação | `ScrollTrigger.batch()` ou um `ScrollTrigger` por nó com `toggleActions: "play reverse play reverse"` | Nó do card ativo (trigger `start: "top center"`) preenche com `accent-primary`, 0.3s ease; nó anterior reverte para cinza |
| Cards Módulos/Mecanismo | `ScrollTrigger.batch()` no container, `onEnter` dispara `gsap.to()` com `stagger` | Fade up staggered (0.08s entre cards), 0.5s ease-out, dispara uma vez ao entrar ~80% no viewport |
| Números de Prova Social | `ScrollTrigger` com `once: true`, `onEnter` roda tween de um objeto proxy (`{val:0}`) com `onUpdate` atualizando o texto | Count-up de 0 até o valor final, 1.2s ease-out, dispara ao entrar 50% no viewport, nunca repete |
| Diagrama de rateio (Problemas) | `ScrollTrigger` com `scrub: 1` no tween de `strokeDashoffset` | Setas se desenham conforme a seção entra no viewport, progressão ligada ao scroll (não a uma duração fixa) |
| CTA final | `ScrollTrigger` com `toggleActions: "play none none none"` | Fade up + leve pulse único no botão (`gsap.timeline()`: scale 1→1.03→1, 1.5s, roda 1x ao entrar em viewport) |

Registrar plugins uma única vez (`gsap.registerPlugin(ScrollTrigger, useGSAP)`), sempre dentro de `useGSAP()` com `scope` no ref da seção — nunca seletor de string sem escopo, e nunca executar GSAP durante SSR do Next.js.

---

## Responsividade — Princípios

- **Desktop (1280+):** Composições completas — trilho vertical de Precificação com zigue-zague L/R, grid 4 colunas do Mecanismo lado a lado, Hero com mockup em até 85% da largura com glow radial amplo, tipografia na escala máxima definida nos tokens.
- **Tablet (768-1279):** Zigue-zague de Precificação simplifica para sempre-mesmo-lado (imagem sempre acima do texto) mas trilho vertical permanece; grid do Mecanismo reduz para 2 colunas; Módulos mantém-se como galeria mas com 1.5 cards visíveis por vez (sugerindo scroll).
- **Mobile (< 768):** A essência que não pode se perder: (1) o trilho vertical de Precificação — é a espinha dorsal narrativa da seção mais técnica; (2) o mockup do Hero como protagonista visual, mesmo reduzido; (3) a alternância dark/light entre seções — nunca achatar tudo pro mesmo fundo por "simplicidade". Grid do Mecanismo vira carrossel horizontal com snap (1 card por vez, indicador de posição). Diagrama de rateio simplifica para versão vertical de 1 coluna. Todas as imagens de produto mantêm proporção original (nunca esticar/cortar) mesmo que isso signifique mais altura de scroll.

---

## Regra de Ouro

Ao criar qualquer seção da LP:
1. Siga TODAS as decisões de identidade (ritmo + linguagem + dramaturgia)
2. Use tokens semânticos — nunca valores crus
3. UMA cor accent (`#ff4785`) para tudo — base neutra (`#f5f4ea`/`#09090a`/`#0d0d0f`) + cor da marca
4. Cada seção importante DEVE ter uma COMPOSIÇÃO NARRATIVA — uma cena visual que reforça o ARGUMENTO da seção, nunca ícone+título+texto genérico como única estratégia
5. O scroll DEVE ter RITMO — alternância dark/light entre "atos", energia alta/baixa alternada
6. NÃO substitua composição por decoração genérica — o grid fino de linhas é atmosfera temática (planilha), não enfeite aleatório
7. A IA implementadora é RESPONSÁVEL por criar SVGs e composições visuais ORIGINAIS (trilho de Precificação, diagrama de rateio, glow do Hero)
8. A LP inteira é a própria planilha ganhando vida: linhas finas, células, precisão tipográfica, e UM rosa usado como caneta de destaque — nunca como papel de parede

## Teste Final
Coloque a LP ao lado de um template Framer/Webflow popular. A diferença deve ser óbvia em TRÊS níveis:
- RITMO: alternância dark/light entre seções cria "atos" claros, energia não é uniforme
- LINGUAGEM: Switzer + General Sans + toque itálico pontual (Piazzolla) têm personalidade própria, UMA cor forte (`#ff4785`), nunca arco-íris
- DRAMATURGIA: trilho conectando etapas de Precificação, diagrama de rateio em Problemas, mockup com glow no Hero, grid numerado no Mecanismo — nenhuma dessas é decoração genérica, todas reforçam o argumento específico daquela seção

Se as seções tiverem apenas ícone+título+texto sem nenhuma composição própria, está INCOMPLETO.
Se a LP usar mais de 1 cor vibrante além do rosa de marca, está ERRADO.
Se todas as seções forem dark ou todas light, está SEM RITMO.
