/**
 * Copy da landing page.
 * O TEXTO vem de Assets/*\/copy-antiga.txt (extraído do site antigo, que foi
 * abandonado). Estrutura e design não têm relação com aquele site.
 */

/**
 * Cada CTA é adaptado ao momento da página. O mesmo texto repetido em toda
 * seção perde força — principalmente header e hero, que dividem a mesma tela.
 */
export const CTA = {
  header: { l2: "Quero minha planilha" },
  heroMobile: { l2: "Comprar" },
  hero: { l1: "Quero saber meu custo real e", l2: "precificar certo" },
  calculo: { l1: "Fazer essa conta no", l2: "meu cardápio" },
  preco: { l1: "Garantir meu acesso", l2: "vitalício por R$ 197" },
  rodape: { l1: "Parar de perder", l2: "dinheiro na mesa" },
} as const;

/** TODO: URL real do checkout quando o cliente enviar. */
export const CHECKOUT = "#preco";
export const INSTAGRAM = "https://www.instagram.com/gestaofinanceiradigital/";
export const VIDEO_EMBED =
  "https://player-vz-0e8baf6e-011.tv.pandavideo.com.br/embed/?v=66bcda6b-0d7a-46d8-9e08-997dd88101b9";

export const SLOGAN = "Engenharia do lucro para gastronomia";

export const NAV = [
  { id: "calculo", label: "Como funciona" },
  { id: "diferenciais", label: "Recursos" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "faq", label: "FAQ" },
] as const;

export const hero = {
  l1: "Descubra o custo real",
  l2a: "e o ",
  fill: "lucro",
  l2b: " de cada",
  l3: "item do seu cardápio.",
  lead: "Tenha preços que geram lucro — e não apenas faturamento.",
  paraQuem:
    "Para restaurantes, hamburguerias, pizzarias, confeitarias, marmitarias, cafeterias e delivery.",
  trust: { n: "+25 mil", t: "negócios já precificam com ela" },
};

export const reforcos = [
  { forte: "+25 mil", fraco: "negócios atendidos" },
  { forte: "Pagamento único", fraco: "sem mensalidade" },
  { forte: "Acesso vitalício", fraco: "atualizações incluídas" },
];

/**
 * UMA seção só, logo depois do vídeo. Percorre: para quem é → o problema
 * (faturamento que engana, falta de controle de custos, rateio genérico) →
 * a planilha como solução, em comparação lado a lado.
 *
 * A copy do problema é a original do site antigo; o "para quem é" mescla a
 * lista de negócios do FAQ original com texto novo.
 */
export const problema = {
  /* Dois momentos, dois títulos. Fundir os dois numa frase só foi o que
     tirou a clareza: o eyebrow prometia "para quem é" e o título entregava
     a dor. Agora cada bloco responde uma pergunta só. */
  label: "Para quem é",
  title: "Feita para quem vive de gastronomia.",
  lead: "Se você define preço de prato, monta cardápio ou responde pelo caixa, essa planilha é pra você.",
  /* Abre a comparação — copy original do site antigo, intacta. */
  problemaLabel: "O problema",
  problemaTitle: "O faturamento engana. A falta de controle de custos quebra.",
  problemaLead: "Veja o que muda quando cada custo entra na conta.",
  gruposNegocio: [
    {
      n: "01",
      grupo: "Salão e balcão",
      desc: "Atendimento presencial e consumo no local",
      itens: ["Restaurantes", "Hamburguerias", "Pizzarias", "Cafeterias"],
    },
    {
      n: "02",
      grupo: "Produção e confeitaria",
      desc: "Produção por lote, receitas e encomendas",
      itens: ["Confeitarias", "Padarias", "Docerias", "Buffets"],
    },
    {
      n: "03",
      grupo: "Delivery e itinerante",
      desc: "Modelos enxutos, entregas e taxas de aplicativo",
      itens: ["Marmitarias", "Dark kitchens", "Food trucks", "Delivery"],
    },
  ],
  /** Comparação: como é hoje × como fica com a planilha. */
  comparacao: {
    tituloAntes: "Como é hoje",
    tituloDepois: "Com a Ficha Técnica Pro",
    linhas: [
      {
        n: "01",
        antes: "Preço no achismo",
        antesTexto:
          "Você não tem segurança para reajustar e acaba copiando o concorrente, engolindo os próprios custos.",
        depois: "Preço calculado",
        depoisTexto:
          "Markup, impostos e taxas entram na conta e devolvem o preço de venda sugerido.",
      },
      {
        n: "02",
        antes: "Custos invisíveis",
        antesTexto:
          "Você paga pelo gás, pela energia e pela embalagem, mas esquece de incluir isso no custo do prato.",
        depois: "Todo custo aparece",
        depoisTexto:
          "Gás, energia, embalagem e mão de obra entram item a item, sem nada ficar de fora.",
      },
      {
        n: "03",
        antes: "O fantasma do CMV",
        antesTexto:
          "As vendas aumentam, o salão lota, mas o caixa vive vazio porque o CMV está descontrolado.",
        depois: "CMV sob controle",
        depoisTexto:
          "CMV e margem de contribuição atualizam sozinhos a cada mudança de insumo.",
      },
      {
        n: "04",
        antes: "Desperdício não calculado",
        antesTexto:
          "As perdas do preparo (fator de correção) corroem sua margem sem você perceber.",
        depois: "Perda considerada",
        depoisTexto:
          "O fator de correção entra no cálculo: cascas, ossos e cozimento contam no custo real.",
      },
    ],
  },

  /**
   * O rateio genérico sai da tabela e vira bloco próprio: é o argumento mais
   * forte da seção e, espremido como mais uma linha, virava item de lista.
   * Copy original do site antigo, na íntegra.
   */
  rateio: {
    label: "A falsa margem",
    titlePre: "O grande perigo dos ",
    titleMark: "rateios genéricos",
    titlePost: ".",
    p1: "A maioria das planilhas comuns e sistemas de contabilidade divide as despesas gerais igualmente entre todos os produtos.",
    p2: "Isso é um erro fatal na gastronomia. Produtos que nunca passaram pelo fogão acabam recebendo custos de gás, mascarando a margem real.",
    remate:
      "O resultado? Você continua vendendo sem saber qual prato dá lucro de verdade e qual está te dando prejuízo.",
    /* A prova em números: a mesma despesa de gás, dividida dos dois jeitos. */
    provaTitulo: "A mesma conta de gás, dividida dos dois jeitos",
    colunas: ["Prato", "Rateio genérico", "Custo real de energia"],
    pratos: [
      { nome: "Costela 8h no forno", rateio: "1,20", real: "4,80", nota: "" },
      { nome: "Hambúrguer na chapa", rateio: "1,20", real: "0,90", nota: "" },
      {
        nome: "Salada da casa",
        rateio: "1,20",
        real: "0,00",
        nota: "nunca foi ao fogo",
      },
    ],
    solucao: {
      titulo: "Custo por uso real",
      texto:
        "Cada item recebe só o que consumiu: tempo de uso × potência × tarifa. Sem rateio irreal, sem margem mascarada.",
    },
  },
};

/**
 * A virada entre o produto por dentro (Módulos) e os diferenciais técnicos:
 * resume em três blocos o que a tela de gestão do cardápio entrega. Copy
 * original do site antigo (parágrafo único) quebrada em lista, como pedido
 * em Assets/Solucao/intruções.txt.
 */
export const solucao = {
  label: "A Solução Definitiva",
  title: "Onde seu lucro está escondido?",
  blocos: [
    {
      n: "01",
      titulo: "Visualize em uma única tela:",
      itens: [
        "informações de custos",
        "CMV",
        "Margem de Contribuição",
        "preço sugerido e o lucro de todos os seus produtos",
      ],
    },
    {
      n: "02",
      titulo: "Cálculo automático:",
      itens: [
        "Sempre que o preço de um insumo mudar, todo o cardápio é recalculado automaticamente",
      ],
    },
    {
      n: "03",
      titulo: "Você vê imediatamente:",
      itens: ["Itens mais lucrativos", "Itens que precisam de atenção"],
    },
  ],
  stats: [
    { valor: "6", rotulo: "Módulos" },
    { valor: "100%", rotulo: "Automático" },
    { valor: "30s", rotulo: "Para precificar" },
    { valor: "7 dias", rotulo: "de garantia" },
  ],
  cta: "Ver a Ficha Técnica Pro por Dentro",
};

export const diferenciais = {
  label: "Cálculo automático. Zero complicação.",
  titlePre: "Por que a Ficha Técnica Pro não é ",
  titleMark: "“só mais uma planilha”",
  titlePost: "?",
  cards: [
    {
      n: "01",
      icone: "calculadora",
      titulo: "Ingredientes e fator de correção",
      texto:
        "Calcule o custo exato considerando as perdas normais do preparo (cascas, ossos, cozimento).",
      pergunta: "Isola custos de gás e energia por prato?",
      concorrente: "Planilha comum",
      destaque: "Ficha Técnica Pro",
    },
    {
      n: "02",
      icone: "energia",
      titulo: "Energia Elétrica e Gás Isolados",
      texto:
        "Descubra o custo exato de cocção ou refrigeração de cada item, sem rateios irreais.",
      pergunta: "Calcula Mão de Obra baseada no tempo de preparo?",
      concorrente: "Planilha comum",
      destaque: "Ficha Técnica Pro",
    },
    {
      n: "03",
      icone: "tempo",
      titulo: "Mão de Obra e Tempo de Produção",
      texto:
        "Saiba quanto custa a hora do seu funcionário dedicada especificamente àquela receita.",
      pergunta: "Sugere preço de venda baseado no Markup e CMV?",
      concorrente: "Planilha comum",
      destaque: "Ficha Técnica Pro",
    },
    {
      n: "04",
      icone: "embalagem",
      titulo: "Embalagens, Impostos e Delivery",
      texto:
        "Precifique corretamente para o salão e para o iFood. Calcule taxas, impostos e custos extras automaticamente.",
      pergunta: "É feita exclusivamente para Gastronomia?",
      concorrente: "Planilha comum",
      destaque: "Ficha Técnica Pro",
    },
  ],
};

export const modulos = {
  label: "Módulos integrados",
  title: "Tudo que você precisa em\u00A0um único lugar.",
  lead: "Cada aba resolve uma parte do negócio — e todas conversam entre si.",
  items: [
    {
      tab: "Cardápio",
      titulo: "Gestão do cardápio",
      texto: "Custos, CMV, margem e lucro de todos os produtos em uma única tela.",
      image: "/images/modulos/gestor_lucro_cardapio.png",
      w: 2278,
      h: 1100,
    },
    {
      tab: "Despesas",
      titulo: "Controle de despesas",
      texto:
        "Registre as despesas operacionais e veja o impacto direto na rentabilidade.",
      image: "/images/modulos/controle_despesas.png",
      w: 1650,
      h: 991,
    },
    {
      tab: "Mão de obra",
      titulo: "Custo de mão de obra",
      texto:
        "Custo da mão de obra por produto, calculado a partir do tempo de preparo.",
      image: "/images/modulos/custo_maodeobra.png",
      w: 2141,
      h: 1073,
    },
    {
      tab: "Combos",
      titulo: "Calculadora de combos",
      texto: "Monte combos e promoções sem perder margem, com custo em tempo real.",
      image: "/images/modulos/calc_combos.png",
      w: 2102,
      h: 1131,
    },
    {
      tab: "Precificar",
      titulo: "Precificação inteligente",
      texto:
        "Markup, impostos e taxas definem o preço de venda ideal automaticamente.",
      image: "/images/modulos/modulo_precificar.png",
      w: 884,
      h: 899,
    },
    {
      tab: "Equilíbrio",
      titulo: "Ponto de equilíbrio",
      texto: "Quantos produtos você precisa vender para cobrir os custos fixos.",
      image: "/images/modulos/pontodeequilibrio.png",
      w: 757,
      h: 309,
    },
  ],
};

export const calculo = {
  label: "Precificação inteligente",
  title: "Como a Ficha Técnica Pro calcula o preço de venda",
  lead: "Você informa os dados da produção. Todos os cálculos são feitos automaticamente para entregar um preço de venda baseado nos custos reais do seu produto.",
  nota: "Valores de uma ficha técnica de exemplo.",
  etapas: [
    {
      n: "01",
      titulo: "Ingredientes",
      texto:
        "Cadastre os ingredientes e as quantidades. O custo exato sai automático, já com o fator de correção.",
      valor: "8,40",
      image: "/images/precificacao/ingredientes.png",
      w: 1001,
      h: 677,
    },
    {
      n: "02",
      titulo: "Embalagens",
      texto:
        "Some embalagens, etiquetas, sacolas e todo material usado na venda do produto.",
      valor: "1,15",
      image: "/images/precificacao/embalagens.png",
      w: 691,
      h: 677,
    },
    {
      n: "03",
      titulo: "Maquinários",
      texto:
        "Informe os equipamentos e o tempo de uso. O consumo de gás e energia é calculado sozinho.",
      valor: "0,95",
      image: "/images/precificacao/maquinarios.png",
      w: 768,
      h: 677,
    },
    {
      n: "04",
      titulo: "Mão de obra",
      texto:
        "Cadastre a equipe e o tempo de produção. O custo da hora dedicada à receita entra na conta.",
      valor: "2,60",
      image: "/images/precificacao/maodeobra.png",
      w: 777,
      h: 677,
    },
    {
      n: "05",
      titulo: "Precificação",
      texto:
        "Informe impostos, taxas de cartão, comissões e a margem de lucro desejada. A Ficha Técnica Pro calcula automaticamente o preço de venda sugerido.",
      valor: "",
      image: "/images/precificacao/precificacao.png",
      w: 950,
      h: 991,
    },
  ],
  resultado: {
    titulo: "Preço de venda calculado",
    image: "/images/precificacao/resultado.png",
    w: 827,
    h: 861,
    linhas: [
      { rotulo: "Custo total", valor: "R$ 13,10" },
      { rotulo: "Preço sugerido", valor: "R$ 32,00", destaque: true },
      { rotulo: "Margem de contribuição", valor: "59,1%" },
      { rotulo: "CMV", valor: "40,9%" },
      { rotulo: "Markup", valor: "2,44×" },
    ],
  },
};

export const video = {
  label: "Apresentação",
  title: "Uma visão geral da planilha.",
  lead: "Veja rapidamente como ela funciona por dentro. O detalhe de cada módulo vem logo abaixo.",
};

export const depoimentos = {
  label: "Depoimentos",
  title: "Relatos de quem decidiu ter controle de verdade.",
  statN: "+25 mil",
  statT: "negócios gastronômicos já precificam com a Ficha Técnica Pro",
  imagens: [
    { src: "/images/depoimentos/d7.jpg", w: 1440, h: 1552 },
    { src: "/images/depoimentos/d2.jpg", w: 1080, h: 781 },
    { src: "/images/depoimentos/d6.jpg", w: 1440, h: 1035 },
    { src: "/images/depoimentos/d8.jpg", w: 1440, h: 1521 },
    { src: "/images/depoimentos/d3.jpg", w: 1080, h: 745 },
    { src: "/images/depoimentos/d9.jpg", w: 1440, h: 1303 },
    { src: "/images/depoimentos/d4.jpg", w: 1080, h: 766 },
    { src: "/images/depoimentos/d5.jpg", w: 1080, h: 890 },
    { src: "/images/depoimentos/d1.jpg", w: 1440, h: 508 },
  ],
};

export const preco = {
  label: "O Próximo Passo",
  title: "Assuma o controle da precificação do seu negócio agora.",
  beneficios: [
    {
      icone: "escudo",
      titulo: "Pare de ter medo de reajustar",
      texto:
        "Tenha segurança total para formar preços (Markup) e saiba exatamente quanto cobrar sem afugentar clientes.",
    },
    {
      icone: "lupa",
      titulo: "Identifique os vilões do cardápio",
      texto:
        "Descubra em segundos quais pratos estão sugando sua margem de contribuição e ajuste o cardápio.",
    },
    {
      icone: "queda",
      titulo: "Reduza o Desperdício",
      texto:
        "Controle rigorosamente o fator de correção e pare de jogar insumos caros no lixo.",
    },
    {
      icone: "relogio",
      titulo: "Ganhe tempo para ser dono",
      texto:
        "Automações prontas. Você só insere os dados, a Ficha Técnica Pro calcula CMV, preços e lucros sozinha.",
    },
  ],
  valor: "197",
  nota: "pagamento único",
  inclui: [
    "Acesso vitalício à Ficha Técnica Pro",
    "Atualização automática de CMV e Margem de Contribuição",
    "Cálculo automatizado de Gás, Energia e Mão de Obra",
    "Suporte especializado e aulas práticas",
  ],
  cta: "Quero assumir o controle da minha precificação",
  garantiaTitulo: "Risco Zero. Garantia de 7 Dias.",
  garantiaTexto:
    "Se você achar que a ferramenta não vai ajudar seu restaurante a economizar dinheiro, devolvemos 100% do seu investimento. Sem burocracia.",
};

export const faq = {
  label: "Dúvidas",
  title: "Ainda tem dúvidas?",
  items: [
    {
      q: "Serve para qualquer restaurante?",
      a: "Sim. Atende padarias, pizzarias, hamburguerias, confeitarias, marmitarias, cafeterias, dark kitchens e similares.",
    },
    {
      q: "Preciso entender de Excel ou planilhas?",
      a: "Não. Todos os cálculos e automações já estão prontos. Você apenas preenche as informações do seu negócio.",
    },
    {
      q: "Ela calcula os custos operacionais?",
      a: "Sim. Calcula detalhadamente consumo de gás, energia elétrica e mão de obra por produto.",
    },
    {
      q: "Como recebo o acesso?",
      a: "O acesso é enviado imediatamente para o seu e-mail após a confirmação do pagamento, com instruções claras de uso.",
    },
    {
      q: "Posso atualizar os preços dos insumos facilmente?",
      a: "Sim. Ao alterar o preço de um ingrediente, todas as fichas técnicas que o utilizam são recalculadas automaticamente.",
    },
  ],
};

export const rodape = {
  tituloLinha1: "O custo invisível de",
  tituloLinha2: "não ter controle.",
  texto:
    "Continuar precificando sem informações completas é o caminho mais rápido para ver seu faturamento crescer e seu caixa esvaziar. Pare de perder dinheiro na mesa.",
  ctaLinha1: "Quero saber meu custo real e",
  ctaLinha2: "PRECIFICAR CERTO",
  copyright: "© 2026 In-app Digital Ltda. Todos os direitos reservados.",
  empresa: "Gestão Financeira Digital",
};
