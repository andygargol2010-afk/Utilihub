/** pt-BR names and summaries for the games catalog (keys = EN slug). Missing keys fall back to EN. */
export const PT_GAMES: Record<string, { name: string; summary: string }> = {
  "2048": { name: "2048", summary: "Deslize as peças, junte os números e chegue a 2048." },
  "tic-tac-toe": { name: "Jogo da velha", summary: "O clássico 3×3. Jogue contra um amigo ou contra o computador." },
  "connect-four": { name: "Lig 4", summary: "Solte as fichas e alinhe quatro em linha." },
  "connect-four-classic": {
    name: "Lig 4 clássico",
    summary: "Lig 4 clássico com gravidade. Dois jogadores ou contra o computador. Alinhe quatro para vencer. Tabuleiro compartilhável.",
  },
  "sudoku-classic": {
    name: "Sudoku clássico",
    summary: "Sudoku clássico: preencha a grade 9×9 sem repetir nas linhas, colunas e caixas. Níveis, conflitos destacados e tabuleiro compartilhável.",
  },
  minesweeper: {
    name: "Campo minado",
    summary: "Campo minado online: limpe o tabuleiro sem acertar uma mina. Quebra-cabeça grátis no navegador com cronômetro e bandeiras.",
  },
  "minesweeper-classic": {
    name: "Campo minado clássico",
    summary: "Campo minado clássico: Fácil 9×9/10, Médio 16×16/40, Difícil 16×30/99. Abertura em cascata, bandeiras, cronômetro, primeiro clique seguro e semente compartilhável.",
  },
  hangman: { name: "Forca", summary: "Forca clássica: adivinhe a palavra oculta letra por letra antes que acabem as tentativas." },
  snake: { name: "Cobrinha", summary: "Coma, cresça e não bata nas paredes." },
  pong: { name: "Pong", summary: "O duelo clássico de raquetes contra o computador." },
  memory: { name: "Jogo da memória", summary: "Vire as cartas e encontre todos os pares." },
  sudoku: { name: "Sudoku", summary: "Preencha a grade sem repetir números na linha, coluna ou caixa." },
  pacman: { name: "Pac-Man", summary: "Perseguição clássica no labirinto: coma todas as pastilhas, fuja dos fantasmas e pegue as pastilhas de poder." },
  tetris: { name: "Tetris", summary: "Empilhe tetraminós, complete linhas e bata seu recorde." },
  "code-type-race": {
    name: "Corrida de digitação de código",
    summary: "Digite trechos reais de JS e Python. Corra contra o relógio por PPM e precisão.",
  },
  "formula-memory": {
    name: "Memória de fórmulas",
    summary: "Ligue cada nome de fórmula à sua equação: física, geometria e finanças.",
  },
  "budget-survivor": {
    name: "Sobrevivente do orçamento",
    summary: "Sobreviva a um mês de contas e imprevistos aleatórios sem ficar no vermelho.",
  },
  pathfinder: { name: "Caminho mais curto", summary: "Desenhe paredes e veja o BFS ou o A* encontrar o caminho passo a passo." },
  "refraction-challenge": {
    name: "Desafio da refração",
    summary: "Mire um laser através de lentes e acerte o alvo. Desvie a luz e passe de fase.",
  },
  "lights-out": { name: "Apague as luzes", summary: "Alterne as luzes e suas vizinhas. Apague a grade inteira." },
  "magnetic-letter-catcher": {
    name: "Ímã de letras",
    summary: "Pegue as letras flutuantes do seu nome na ordem com um ímã. Combos, modos e PNG compartilhável.",
  },
  "pulse-catch-arena": {
    name: "Arena de pulsos",
    summary: "Pegue os pulsos neon que caem com sua barra. Faça combos, perca vidas nos erros e enfrente dificuldade crescente.",
  },
  "orbit-defender-arcade": {
    name: "Defensor da órbita",
    summary: "Defenda um planeta brilhante de ondas de asteroides. Mire interceptores, faça combos, libere power-ups e resista à dificuldade crescente.",
  },
  "orbit-pulse-catcher": {
    name: "Pulsos em órbita",
    summary: "Toque na hora certa nas zonas coloridas para pegar os pulsos em órbita da mesma cor. Combos, níveis e PNG para compartilhar.",
  },
  "simon-sequence-memory": {
    name: "Genius: sequência de cores",
    summary: "Genius clássico: observe a sequência de cores e sons que cresce e repita-a. Níveis, melhor pontuação e som ligável.",
  },
  "memory-match-classic": {
    name: "Jogo da memória clássico",
    summary: "Jogo da memória clássico: vire cartas para achar os pares. Escolha o tamanho da grade, conte os movimentos e comemore a vitória.",
  },
  "othello-classic": {
    name: "Otelo clássico",
    summary: "Otelo / Reversi clássico: coloque peças para virar as do adversário em linha reta. Jogadas válidas destacadas. Vence quem tiver mais peças.",
  },
  "checkers-classic": {
    name: "Damas clássico",
    summary: "Damas clássico: movimentos na diagonal, capturas por salto e promoção a dama. Jogue de vermelho ou preto contra a IA ou um amigo. Tabuleiro e PNG compartilháveis.",
  },
  "battleship-classic": {
    name: "Batalha naval clássica",
    summary: "Batalha naval clássica: posicione os navios na sua grade 10×10 ou ao acaso, atire na grade inimiga e afunde todos para vencer a IA.",
  },
  fightersland: {
    name: "Fightersland",
    summary: "Jogo de luta pixel 1x1 contra a IA. Ataques rápidos, médios e fortes com carga, bloqueio e esquiva. Melhor de 3 rodadas. Tutorial opcional.",
  },
};

export const PT_GAME_TAGS = { puzzle: "Quebra-cabeça", arcade: "Arcade", board: "Tabuleiro" } as const;
