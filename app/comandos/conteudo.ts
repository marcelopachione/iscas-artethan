/**
 * Isca "15 comandos escondidos do ChatGPT" / "15 hidden ChatGPT commands".
 * A página (page.tsx) e o PDF (api/comandos-pdf) leem daqui, então o texto é escrito uma vez só,
 * com acento normal. O PDF tira os acentos sozinho. Idioma: ?lang=en (padrão: português).
 *
 * Palavras do comentário no Instagram: COMANDOS (PT) e COMMANDS (EN). As duas levam pro mesmo slug.
 */
import type { Lang } from "../lib/i18n";

export const SLUG = "comandos";

export type Comando = {
  /** A palavra que abre o pedido, igual à do carrossel. */
  comando: string;
  /** Nome curto do que ele faz. */
  nome: string;
  /** Quando usar. */
  quando: string;
  /** O prompt pronto pra copiar. Troque o que está entre [colchetes] pelo seu tema. */
  prompt: string;
  /** Um exemplo de preenchimento. */
  exemplo: string;
};

export type Conteudo = {
  titulo: string;
  descricao: string;
  selo: string;
  intro: string;
  baixarPdf: string;
  comoUsarTitulo: string;
  comoUsar: string[];
  avisoTitulo: string;
  aviso: string;
  comandos: Comando[];
  quandoRotulo: string;
  promptRotulo: string;
  exemploRotulo: string;
  copiar: string;
  checklistTitulo: string;
  checklist: string;
  dicaTitulo: string;
  dicaTexto: string;
  fontesTitulo: string;
  outroIdioma: { rotulo: string; href: string };
};

const FONTES_BASE: { titulo: string; url: string }[] = [
  { titulo: "OpenAI Academy: Creating images with ChatGPT", url: "https://openai.com/academy/image-generation" },
  {
    titulo: "OpenAI Cookbook: GPT Image prompting guide",
    url: "https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide",
  },
];

export const FONTES = FONTES_BASE;

const PT: Conteudo = {
  titulo: "15 comandos escondidos do ChatGPT",
  descricao: "15 prompts prontos pra copiar: uma palavra no começo do pedido e a IA monta o visual pra você.",
  selo: "Material gratuito",
  intro:
    "Aqui estão os 15 prompts do carrossel, um por comando. Cada um já vem pronto: você copia, troca o que está entre [colchetes] pelo seu tema e cola no ChatGPT. A ideia é simples: uma palavra no começo do pedido diz pra IA que tipo de visual você quer.",
  baixarPdf: "Baixar em PDF",
  comoUsarTitulo: "Como usar",
  comoUsar: [
    "Copie o prompt do comando que você quer",
    "Troque o que está entre [colchetes] pelo seu tema, produto ou dado",
    "Cole no ChatGPT, na conversa de criar imagens",
    "Não gostou do primeiro resultado? Peça um ajuste por vez: cor, texto, enquadramento",
  ],
  avisoTitulo: "Antes de começar: o que esses comandos são",
  aviso:
    "Eles não são comandos oficiais do ChatGPT. São palavras de abertura que a gente usa pra organizar o pedido de imagem, e funcionam porque o prompt deixa claro o objetivo, o assunto, o cenário e o estilo, que é o que a própria OpenAI recomenda. O resultado varia conforme o modelo e a versão do ChatGPT. Se o texto dentro da imagem sair com erro, peça pra corrigir só aquele rótulo, ou deixe os rótulos mais curtos.",
  quandoRotulo: "Quando usar",
  promptRotulo: "Prompt",
  exemploRotulo: "Exemplo",
  copiar: "Copiar prompt",
  comandos: [
    {
      comando: "/xray",
      nome: "Por dentro de qualquer coisa",
      quando: "Pra explicar um produto, máquina, corpo humano, sistema ou processo mostrando o que há por dentro.",
      prompt:
        "/xray [objeto ou sistema]. Mostre em corte transversal, revelando as partes internas principais. Coloque de 5 a 6 etiquetas curtas apontando cada parte, com linhas finas. Fundo limpo e claro, estilo realista e bem iluminado.",
      exemplo: "/xray uma garrafa térmica inteligente com chip de hidratação, bateria e módulo de limpeza UV.",
    },
    {
      comando: "/infographic",
      nome: "Informação num visual fácil",
      quando: "Pra mostrar números, comparações ou conteúdo educativo num formato que dá vontade de compartilhar.",
      prompt:
        "/infographic [tema]. Monte um infográfico com título claro e 4 blocos: um número em destaque, um gráfico simples, uma comparação e um resumo. Use os dados abaixo, sem inventar nenhum: [cole seus dados]. Estilo limpo e moderno, textos curtos.",
      exemplo: "/infographic resultados do 1º trimestre da minha loja, com os dados: [cole seus números reais aqui].",
    },
    {
      comando: "/diagram",
      nome: "Como as partes se conectam",
      quando: "Pra quebrar uma ideia complexa em estruturas, fluxos e processos claros.",
      prompt:
        "/diagram [sistema ou processo]. Desenhe um diagrama com caixas e setas mostrando como as partes se conectam, com a entrada à esquerda e o resultado à direita. Rótulos curtos dentro de cada caixa e uma legenda pequena no canto. Fundo escuro com cores bem distintas por grupo.",
      exemplo: "/diagram o fluxo de um pedido numa loja virtual, do clique em comprar até a entrega.",
    },
    {
      comando: "/visualize",
      nome: "Uma ideia, vários jeitos de mostrar",
      quando: "Quando você sabe o que quer comunicar, mas não sabe se vira cena, linha do tempo, gráfico ou ilustração.",
      prompt:
        "/visualize [ideia]. Mostre a mesma ideia em 5 formatos num painel só: uma cena realista, uma linha do tempo, um gráfico, uma ilustração e um conceito em desenho. Cada quadro com uma etiqueta e uma frase curta embaixo.",
      exemplo: "/visualize o crescimento da energia solar em casas.",
    },
    {
      comando: "/handwritten",
      nome: "Anotação escrita à mão",
      quando: "Pra resumo de estudo, explicação ou mensagem carinhosa, com marca-texto, setinha e rabisco.",
      prompt:
        "/handwritten [assunto]. Converta em anotações escritas à mão numa página de caderno de espiral: título com marca-texto amarelo, tópicos numerados, setas, um desenho simples e uma caixa de exemplos. Escreva o texto abaixo, sem mudar o sentido: [cole o conteúdo].",
      exemplo: "/handwritten a regra 80/20 (princípio de Pareto) explicada em 4 passos.",
    },
    {
      comando: "/stickynotes",
      nome: "Pensamento solto em post-its",
      quando: "Pra fazer brainstorm, planejar um projeto, organizar tarefas ou enxergar uma ideia de forma simples e colorida.",
      prompt:
        "/stickynotes [tema]. Organize em uma grade de 9 post-its coloridos, cada um com um título curto e de 3 a 4 tópicos, escritos à mão com canetinha preta. Um post-it para ideias, um para metas, um para o que fazer hoje e um para lembretes. Fundo branco.",
      exemplo: "/stickynotes o planejamento do lançamento do meu primeiro curso online.",
    },
    {
      comando: "/table",
      nome: "Bagunça numa tabela limpa",
      quando: "Pra comparar opções, montar um cronograma, listar tarefas ou colocar qualquer informação em linhas e colunas.",
      prompt:
        "/table [tema]. Monte uma tabela limpa e fácil de ler, com cabeçalho escuro, linhas alternadas e uma bolinha de status (feito, em andamento, a fazer) em cada célula. Colunas: [colunas]. Linhas: [linhas]. Legenda embaixo.",
      exemplo: "/table plano de estudo da semana, de segunda a sexta, com 4 matérias.",
    },
    {
      comando: "/flowchart",
      nome: "Fluxograma passo a passo",
      quando: "Pra mapear um processo, tomar uma decisão ou explicar um fluxo numa ordem visual simples.",
      prompt:
        "/flowchart [processo]. Desenhe um fluxograma com início e fim em cápsulas, passos em caixas coloridas e decisões em losangos com os caminhos SIM e NÃO. Setas finas, ícones pequenos e frases curtas em cada passo. Fundo branco.",
      exemplo: "/flowchart como planejar o dia de estudo, incluindo o que fazer quando o tema não foi entendido.",
    },
    {
      comando: "/then vs now",
      nome: "Passado e presente lado a lado",
      quando: "Pra mostrar mudança, melhoria ou evolução de um jeito simples e com impacto.",
      prompt:
        "/then vs now [tema]. Compare antes e agora em duas colunas lado a lado. Cada coluna com uma etiqueta (ANTES / AGORA), um subtítulo, uma ilustração e 5 linhas curtas com ícones. Tom de cor quente do lado do antes e frio do lado do agora.",
      exemplo: "/then vs now estudar: do livro impresso aos recursos digitais e à IA.",
    },
    {
      comando: "/explodedview",
      nome: "Vista explodida em camadas",
      quando: "Pra entender camadas, montagem, componentes ou como algo é construído de dentro pra fora.",
      prompt:
        "/explodedview [objeto]. Mostre uma vista explodida com as camadas separadas e empilhadas na vertical, cada camada numerada e com uma etiqueta curta. Ao lado, uma lista numerada com uma frase explicando cada camada. Fundo branco e luz suave.",
      exemplo: "/explodedview as camadas da Terra: solo, rocha sedimentar, rocha ígnea, manto superior e manto inferior.",
    },
    {
      comando: "/microscopic",
      nome: "Zoom no que o olho não vê",
      quando: "Pra entender um processo minúsculo, uma ação biológica ou qualquer coisa em nível microscópico.",
      prompt:
        "/microscopic [processo]. Mostre o processo em 5 etapas numeradas, cada uma com um render microscópico em 3D à direita e um título curto com uma frase à esquerda. Cores bem distintas por etapa e fundo azul escuro nas imagens.",
      exemplo: "/microscopic como um vírus ataca uma célula: fixação, penetração, desnudamento, replicação e liberação.",
    },
    {
      comando: "/heatmap",
      nome: "Intensidade vira padrão visual",
      quando: "Pra comparar valores, achar padrões e acompanhar qualquer coisa por região ou categoria.",
      prompt:
        "/heatmap [tema]. Monte um mapa de calor com uma legenda de baixa a alta intensidade e cartões abaixo com o nível de cada região ou categoria. Use APENAS estes valores, e se eu não colar nenhum, marque a imagem inteira como \"valores ilustrativos\": [cole seus dados].",
      exemplo: "/heatmap o uso de ferramentas de IA por região, com valores ilustrativos.",
    },
    {
      comando: "/network",
      nome: "Conexões como uma rede só",
      quando: "Pra mostrar relação, fluxo de dados, infraestrutura ou qualquer sistema conectado.",
      prompt:
        "/network [sistema]. Mapeie as conexões num mapa com nós e linhas, com os pontos principais em destaque e uma legenda das linhas. Abaixo, 4 cartões com um número e uma frase curta sobre a rede. Use só dados que eu informar: [cole seus dados].",
      exemplo: "/network como os cabos submarinos de internet ligam os continentes.",
    },
    {
      comando: "/architecture",
      nome: "Planta clara de um sistema",
      quando: "Pra desenhar um sistema, planejar uma solução ou mostrar como as peças conversam.",
      prompt:
        "/architecture [sistema]. Desenhe a arquitetura em blocos organizados por camadas, no estilo de planta desenhada à mão, com contornos coloridos, ícones finos e conectores tracejados. Um bloco por camada, com rótulos curtos. Fundo branco.",
      exemplo: "/architecture um agente de IA com memória, ferramentas, integrações e navegador.",
    },
    {
      comando: "/birdseye",
      nome: "O cenário completo, visto de cima",
      quando: "Pra mostrar sistemas, prédios, cidades ou estruturas complexas numa visão só.",
      prompt:
        "/birdseye [cenário]. Mostre uma vista aérea isométrica e detalhada do cenário, com etiquetas escuras e curtas sobre cada zona. Embaixo, uma barra com 5 itens, cada um com um ícone, um título e uma linha. Luz natural e fundo claro.",
      exemplo: "/birdseye uma fábrica inteligente 100% automatizada, com robôs, esteiras e sala de controle.",
    },
  ],
  checklistTitulo: "Checklist pra copiar",
  checklist: `Antes de gerar a sua imagem:
[ ] Escolhi o comando certo pro que quero mostrar
[ ] Troquei tudo o que estava entre [colchetes]
[ ] Colei dados reais (e não deixei a IA inventar números)
[ ] Deixei os rótulos curtos pra o texto sair certo
[ ] Conferi cada palavra da imagem antes de publicar`,
  dicaTitulo: "Dica da Artethan",
  dicaTexto:
    "Se a imagem sair quase certa, não recomece: peça um ajuste por vez. Trocar a cor, encurtar um rótulo ou mudar o enquadramento costuma resolver mais rápido do que gerar tudo de novo.",
  fontesTitulo: "Fontes",
  outroIdioma: { rotulo: "Read this in English", href: `/${SLUG}?lang=en` },
};

const EN: Conteudo = {
  titulo: "15 hidden ChatGPT commands",
  descricao: "15 ready-to-copy prompts: one word at the start of your request and the AI builds the visual for you.",
  selo: "Free material",
  intro:
    "Here are the 15 prompts from the carousel, one per command. Each one is ready to go: copy it, swap whatever is in [square brackets] for your own topic, and paste it into ChatGPT. The idea is simple: one word at the start of your request tells the AI what kind of visual you want.",
  baixarPdf: "Download as PDF",
  comoUsarTitulo: "How to use it",
  comoUsar: [
    "Copy the prompt for the command you want",
    "Swap whatever is in [square brackets] for your topic, product or data",
    "Paste it into ChatGPT, in an image conversation",
    "Not happy with the first result? Ask for one change at a time: colour, text, framing",
  ],
  avisoTitulo: "Before you start: what these commands are",
  aviso:
    "These are not official ChatGPT commands. They are opening words we use to structure an image request, and they work because the prompt makes the goal, subject, setting and style clear, which is what OpenAI itself recommends. Results vary with the model and the version of ChatGPT. If the text inside an image comes out wrong, ask it to fix just that label, or shorten your labels.",
  quandoRotulo: "When to use it",
  promptRotulo: "Prompt",
  exemploRotulo: "Example",
  copiar: "Copy prompt",
  comandos: [
    {
      comando: "/xray",
      nome: "See inside anything",
      quando: "To explain a product, machine, anatomy, system or workflow by showing what's inside.",
      prompt:
        "/xray [object or system]. Show it as a cutaway, revealing the main internal parts. Add 5 to 6 short labels pointing to each part with thin lines. Clean, light background, realistic and well lit.",
      exemplo: "/xray a smart water bottle with a hydration chip, battery and UV self-cleaning module.",
    },
    {
      comando: "/infographic",
      nome: "Information as an easy visual",
      quando: "To present statistics, comparisons or educational content in a format people want to share.",
      prompt:
        "/infographic [topic]. Build an infographic with a clear title and 4 blocks: a highlighted number, a simple chart, a comparison and a summary. Use only the data below and invent nothing: [paste your data]. Clean, modern style, short text.",
      exemplo: "/infographic my shop's Q1 results, using this data: [paste your real numbers here].",
    },
    {
      comando: "/diagram",
      nome: "How the parts connect",
      quando: "To break a complex idea down into clear structures, flows and processes.",
      prompt:
        "/diagram [system or process]. Draw a diagram with boxes and arrows showing how the parts connect, with the input on the left and the result on the right. Short labels inside each box and a small legend in the corner. Dark background with clearly different colours per group.",
      exemplo: "/diagram the flow of an order in an online shop, from clicking buy to delivery.",
    },
    {
      comando: "/visualize",
      nome: "One idea, many ways to show it",
      quando: "When you know what you want to say but aren't sure if it should be a scene, timeline, chart or illustration.",
      prompt:
        "/visualize [idea]. Show the same idea in 5 formats on a single panel: a realistic scene, a timeline, a chart, an illustration and a concept sketch. Each panel with a label and a short caption underneath.",
      exemplo: "/visualize the growth of solar energy in homes.",
    },
    {
      comando: "/handwritten",
      nome: "Handwritten notes",
      quando: "For study notes, explainers or heartfelt messages with highlights, arrows and doodles.",
      prompt:
        "/handwritten [subject]. Convert it into handwritten notes on a spiral notebook page: a title with yellow highlighter, numbered points, arrows, a simple drawing and an examples box. Write the text below without changing its meaning: [paste the content].",
      exemplo: "/handwritten the 80/20 rule (the Pareto principle) explained in 4 steps.",
    },
    {
      comando: "/stickynotes",
      nome: "Loose thoughts on sticky notes",
      quando: "To brainstorm, plan a project, organise tasks or see an idea in a simple, colourful way.",
      prompt:
        "/stickynotes [topic]. Organise it into a grid of 9 colourful sticky notes, each with a short title and 3 to 4 points, handwritten in black marker. One note for ideas, one for goals, one for what to do today and one for reminders. White background.",
      exemplo: "/stickynotes the launch plan for my first online course.",
    },
    {
      comando: "/table",
      nome: "A mess turned into a clean table",
      quando: "To compare options, build a schedule, list tasks or put any information into rows and columns.",
      prompt:
        "/table [topic]. Build a clean, easy-to-read table with a dark header, alternating rows and a status dot (done, in progress, to do) in each cell. Columns: [columns]. Rows: [rows]. Legend underneath.",
      exemplo: "/table a weekly study plan, Monday to Friday, with 4 subjects.",
    },
    {
      comando: "/flowchart",
      nome: "Step-by-step flowchart",
      quando: "To map a workflow, make a decision or explain a process in a simple visual order.",
      prompt:
        "/flowchart [process]. Draw a flowchart with start and end in capsules, steps in coloured boxes and decisions in diamonds with YES and NO paths. Thin arrows, small icons and a short sentence in each step. White background.",
      exemplo: "/flowchart how to plan a study day, including what to do when a topic wasn't understood.",
    },
    {
      comando: "/then vs now",
      nome: "Past and present side by side",
      quando: "To show change, improvement or progress in a simple, impactful way.",
      prompt:
        "/then vs now [topic]. Compare then and now in two side-by-side columns. Each column with a label (THEN / NOW), a subtitle, an illustration and 5 short lines with icons. Warm tones on the then side and cool tones on the now side.",
      exemplo: "/then vs now studying: from printed books to digital resources and AI.",
    },
    {
      comando: "/explodedview",
      nome: "Exploded view in layers",
      quando: "To understand layers, assembly, components or how something is built from the inside out.",
      prompt:
        "/explodedview [object]. Show an exploded view with the layers separated and stacked vertically, each layer numbered with a short label. Next to it, a numbered list with one sentence explaining each layer. White background and soft light.",
      exemplo: "/explodedview the layers of the Earth: soil, sedimentary rock, igneous rock, upper mantle and lower mantle.",
    },
    {
      comando: "/microscopic",
      nome: "Zoom into what the eye can't see",
      quando: "To understand a tiny process, a biological action or anything at a microscopic level.",
      prompt:
        "/microscopic [process]. Show the process in 5 numbered steps, each with a 3D microscopic render on the right and a short title with one sentence on the left. Clearly different colours per step and a dark blue background in the images.",
      exemplo: "/microscopic how a virus attacks a cell: attachment, penetration, uncoating, replication and release.",
    },
    {
      comando: "/heatmap",
      nome: "Intensity turned into a visual pattern",
      quando: "To compare values, find patterns and track anything by region or category.",
      prompt:
        "/heatmap [topic]. Build a heatmap with a legend from low to high intensity and cards underneath with the level for each region or category. Use ONLY these values, and if I paste none, mark the whole image as \"illustrative values\": [paste your data].",
      exemplo: "/heatmap the use of AI tools by region, with illustrative values.",
    },
    {
      comando: "/network",
      nome: "Connections as one network",
      quando: "To show relationships, data flows, infrastructure or any connected system.",
      prompt:
        "/network [system]. Map the connections on a map of nodes and lines, with the main hubs highlighted and a legend for the lines. Underneath, 4 cards with a number and a short sentence about the network. Use only data I provide: [paste your data].",
      exemplo: "/network how submarine internet cables connect the continents.",
    },
    {
      comando: "/architecture",
      nome: "A clear blueprint of a system",
      quando: "To design a system, plan a solution or show how the pieces talk to each other.",
      prompt:
        "/architecture [system]. Draw the architecture as blocks organised in layers, in a hand-drawn blueprint style, with coloured outlines, thin icons and dashed connectors. One block per layer with short labels. White background.",
      exemplo: "/architecture an AI agent with memory, tools, integrations and a browser.",
    },
    {
      comando: "/birdseye",
      nome: "The full picture, from above",
      quando: "To show systems, buildings, cities or complex setups in one view.",
      prompt:
        "/birdseye [scene]. Show a detailed isometric aerial view of the scene, with short dark labels on each zone. Along the bottom, a bar with 5 items, each with an icon, a title and one line. Natural light and a light background.",
      exemplo: "/birdseye a 100% automated smart factory, with robots, conveyors and a control room.",
    },
  ],
  checklistTitulo: "Checklist to copy",
  checklist: `Before you generate your image:
[ ] I picked the right command for what I want to show
[ ] I replaced everything in [square brackets]
[ ] I pasted real data (and didn't let the AI make up numbers)
[ ] I kept the labels short so the text comes out right
[ ] I checked every word in the image before publishing`,
  dicaTitulo: "Tip from Artethan",
  dicaTexto:
    "If the image comes out almost right, don't start over: ask for one change at a time. Changing a colour, shortening a label or adjusting the framing is usually quicker than generating everything again.",
  fontesTitulo: "Sources",
  outroIdioma: { rotulo: "Ler em português", href: `/${SLUG}` },
};

export const CONTEUDO: Record<Lang, Conteudo> = { pt: PT, en: EN };
