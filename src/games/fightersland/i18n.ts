/**
 * Fightersland UI strings in English, Spanish and Portuguese.
 *
 * Every string is drawn with the bitmap pixel font, so texts are written in uppercase and only
 * use its glyphs: A-Z, digits, space, . , : ; ! ¡ ? ¿ ' " - + / ( ) % & = * < > # and the
 * arrows ← → ↑ ↓, plus Á É Í Ó Ú À Â Ê Ô Ã Õ Ñ Ü Ç.
 */
import type { AiLevel, CharId, Locale, MapId, RenderLabels, TutorialStepId } from "./core/types";

export interface CharText {
  /** Short epithet under the name. */
  title: string;
  /** One-line description on the select screen. */
  tagline: string;
}

export interface StepText {
  title: string;
  /** Instruction; `{move}`, `{jump}`, `{light}`, `{medium}`, `{heavy}`, `{block}`, `{dodge}` are replaced by the control names of the active device. */
  text: string;
}

export interface Strings {
  labels: RenderLabels;
  poster: { tagline: string; play: string; hint: string };
  tagline: string;
  play: string;
  options: string;
  controls: string;
  back: string;
  exit: string;
  pause: string;
  on: string;
  off: string;
  sound: string;
  music: string;
  reducedFlash: string;
  firstVisit: { title: string; text: string; start: string; skip: string };
  mode: {
    title: string;
    tutorial: string;
    tutorialDesc: string;
    ai: string;
    aiDesc: string;
    versus: string;
    versusDesc: string;
    difficulty: string;
  };
  levels: Record<AiLevel, string>;
  select: {
    title: string;
    player1: string;
    player2: string;
    cpu: string;
    dummy: string;
    random: string;
    randomText: string;
    power: string;
    speed: string;
    reach: string;
    health: string;
    pick: string;
  };
  chars: Record<CharId, CharText>;
  map: { title: string; random: string; names: Record<MapId, string>; descs: Record<MapId, string> };
  paused: { title: string; resume: string; quit: string; restart: string };
  result: {
    wins: string;
    victory: string;
    defeat: string;
    rounds: string;
    rematch: string;
    change: string;
    menu: string;
  };
  tutorial: {
    step: string;
    skip: string;
    done: string;
    doneText: string;
    fightCpu: string;
    menu: string;
    steps: Record<TutorialStepId, StepText>;
  };
  controlsScreen: {
    title: string;
    keyboard: string;
    p1: string;
    p2: string;
    gamepad: string;
    touch: string;
    move: string;
    jump: string;
    block: string;
    light: string;
    medium: string;
    heavy: string;
    dodge: string;
    pause: string;
    tips: string[];
  };
  touchButtons: { block: string; dodge: string };
  rotate: string;
  loading: string;
}

const EN: Strings = {
  labels: {
    round: "ROUND",
    finalRound: "FINAL ROUND",
    fight: "FIGHT!",
    ko: "K.O.",
    perfect: "PERFECT",
    timeUp: "TIME UP",
    draw: "DRAW",
    hits: "HITS",
    wins: "WINS",
    cpu: "CPU",
    p1: "P1",
    p2: "P2",
  },
  poster: {
    tagline: "PIXEL-ART 1 VS 1 FIGHTING GAME",
    play: "PLAY",
    hint: "6 FIGHTERS / VS CPU / 2 PLAYERS / TUTORIAL",
  },
  tagline: "SIX FIGHTERS. TWO ARENAS. ONE WINNER.",
  play: "PLAY",
  options: "OPTIONS",
  controls: "CONTROLS",
  back: "BACK",
  exit: "EXIT",
  pause: "PAUSE",
  on: "ON",
  off: "OFF",
  sound: "SOUND",
  music: "MUSIC",
  reducedFlash: "REDUCE FLASHES",
  firstVisit: {
    title: "FIRST TIME HERE?",
    text: "THE TUTORIAL TEACHES THE BASICS IN ABOUT TWO MINUTES.",
    start: "START TUTORIAL",
    skip: "SKIP",
  },
  mode: {
    title: "SELECT MODE",
    tutorial: "TUTORIAL",
    tutorialDesc: "LEARN MOVES, CHARGE, BLOCK AND DODGE",
    ai: "VS CPU",
    aiDesc: "BEST OF 3 AGAINST THE COMPUTER",
    versus: "2 PLAYERS",
    versusDesc: "SAME KEYBOARD, BEST OF 3",
    difficulty: "DIFFICULTY",
  },
  levels: { easy: "EASY", normal: "NORMAL", hard: "HARD" },
  select: {
    title: "CHOOSE YOUR FIGHTER",
    player1: "PLAYER 1",
    player2: "PLAYER 2",
    cpu: "CPU",
    dummy: "TRAINING PARTNER",
    random: "RANDOM",
    randomText: "LET FATE PICK A FIGHTER.",
    power: "POWER",
    speed: "SPEED",
    reach: "REACH",
    health: "HEALTH",
    pick: "PICK",
  },
  chars: {
    asagiri: { title: "THE DAWN BLADE", tagline: "BALANCED KATANA DUELIST. CLEAN CUTS, NO WEAK SPOTS." },
    yoikaze: { title: "THE NIGHT WIND", tagline: "FASTEST FIGHTER. LOW HEALTH, RELENTLESS RUSH." },
    grimvald: { title: "THE IRON TIDE", tagline: "AXE AND SHIELD. SLOW, BUT EVERY BLOW IS CRUSHING." },
    maelis: { title: "THE TIDE GLAIVE", tagline: "WAVE-WARDEN OF THE PEARL REEFS. LONGEST REACH." },
    bazalt: { title: "THE EMBER FIST", tagline: "STONE GOLEM OF THE CINDER FORGE. A TOUGH BRUISER." },
    oriel: { title: "THE LANTERN KEEPER", tagline: "MONK OF THE ROAD ORDER. TRICKY MID-RANGE STAFF." },
  },
  map: {
    title: "CHOOSE ARENA",
    random: "RANDOM",
    names: { quay: "SUNSET QUAY", frost: "FROST NIGHT" },
    descs: { quay: "WOODEN DOCKS UNDER A SETTING SUN.", frost: "A FROZEN COURTYARD UNDER THE STARS." },
  },
  paused: { title: "PAUSED", resume: "RESUME", quit: "QUIT TO MENU", restart: "RESTART" },
  result: {
    wins: "WINS!",
    victory: "VICTORY",
    defeat: "DEFEAT",
    rounds: "ROUNDS",
    rematch: "REMATCH",
    change: "CHANGE FIGHTERS",
    menu: "MAIN MENU",
  },
  tutorial: {
    step: "STEP",
    skip: "SKIP",
    done: "TUTORIAL COMPLETE!",
    doneText: "YOU KNOW THE BASICS. TIME FOR A REAL FIGHT.",
    fightCpu: "FIGHT THE CPU",
    menu: "MAIN MENU",
    steps: {
      move: { title: "MOVE", text: "WALK LEFT AND RIGHT WITH {move}." },
      jump: { title: "JUMP", text: "PRESS {jump} TO JUMP. JUMP TWICE." },
      light: { title: "LIGHT ATTACK", text: "FAST AND SAFE. HIT THE DUMMY 3 TIMES WITH {light}." },
      medium: { title: "MEDIUM ATTACK", text: "MORE REACH AND DAMAGE. LAND {medium} TWICE." },
      heavy: { title: "HEAVY ATTACK", text: "SLOW BUT STRONG. LAND {heavy} TWICE." },
      charge: {
        title: "CHARGE",
        text: "HOLD AN ATTACK TO CHARGE IT, RELEASE TO STRIKE. A FULL CHARGE BREAKS GUARD. LAND 2 CHARGED HITS.",
      },
      block: { title: "BLOCK", text: "HOLD {block} WHEN THE DUMMY ATTACKS. BLOCK 3 ATTACKS." },
      dodge: { title: "DODGE", text: "PRESS {dodge} AS THE DUMMY SWINGS TO SLIP BACK. DODGE TWICE." },
      combo: { title: "COMBO", text: "CHAIN {light} → {medium} → {heavy} QUICKLY FOR A 3-HIT COMBO." },
      free: { title: "FREE PRACTICE", text: "PUT IT ALL TOGETHER: LAND 6 HITS." },
    },
  },
  controlsScreen: {
    title: "CONTROLS",
    keyboard: "KEYBOARD",
    p1: "PLAYER 1",
    p2: "PLAYER 2",
    gamepad: "GAMEPAD",
    touch: "TOUCH",
    move: "MOVE",
    jump: "JUMP",
    block: "BLOCK (HOLD)",
    light: "LIGHT",
    medium: "MEDIUM",
    heavy: "HEAVY",
    dodge: "BACK DODGE",
    pause: "PAUSE",
    tips: [
      "HOLD AN ATTACK BUTTON TO CHARGE IT. FULL CHARGE BREAKS GUARD.",
      "CHAIN LIGHT → MEDIUM → HEAVY FOR COMBOS.",
      "BLOCK AT THE EXACT MOMENT OF A HIT TO STUN YOUR RIVAL FOR 1 SECOND.",
      "VS CPU: BOTH KEYBOARD LAYOUTS CONTROL PLAYER 1.",
    ],
  },
  touchButtons: { block: "BLOCK", dodge: "DODGE" },
  rotate: "ROTATE YOUR PHONE FOR A BIGGER VIEW",
  loading: "LOADING...",
};

const ES: Strings = {
  labels: {
    round: "ASALTO",
    finalRound: "ASALTO FINAL",
    fight: "¡A LUCHAR!",
    ko: "K.O.",
    perfect: "PERFECTO",
    timeUp: "TIEMPO",
    draw: "EMPATE",
    hits: "GOLPES",
    wins: "GANA",
    cpu: "CPU",
    p1: "J1",
    p2: "J2",
  },
  poster: {
    tagline: "JUEGO DE LUCHA 1 CONTRA 1 EN PIXEL ART",
    play: "JUGAR",
    hint: "6 LUCHADORES / CONTRA CPU / 2 JUGADORES / TUTORIAL",
  },
  tagline: "SEIS LUCHADORES. DOS ARENAS. UN GANADOR.",
  play: "JUGAR",
  options: "OPCIONES",
  controls: "CONTROLES",
  back: "VOLVER",
  exit: "SALIR",
  pause: "PAUSA",
  on: "SÍ",
  off: "NO",
  sound: "SONIDO",
  music: "MÚSICA",
  reducedFlash: "MENOS DESTELLOS",
  firstVisit: {
    title: "¿PRIMERA VEZ AQUÍ?",
    text: "EL TUTORIAL TE ENSEÑA LO BÁSICO EN UNOS DOS MINUTOS.",
    start: "EMPEZAR TUTORIAL",
    skip: "SALTAR",
  },
  mode: {
    title: "ELIGE MODO",
    tutorial: "TUTORIAL",
    tutorialDesc: "APRENDE GOLPES, CARGA, BLOQUEO Y ESQUIVA",
    ai: "CONTRA CPU",
    aiDesc: "AL MEJOR DE 3 CONTRA LA MÁQUINA",
    versus: "2 JUGADORES",
    versusDesc: "MISMO TECLADO, AL MEJOR DE 3",
    difficulty: "DIFICULTAD",
  },
  levels: { easy: "FÁCIL", normal: "NORMAL", hard: "DIFÍCIL" },
  select: {
    title: "ELIGE TU LUCHADOR",
    player1: "JUGADOR 1",
    player2: "JUGADOR 2",
    cpu: "CPU",
    dummy: "COMPAÑERO DE ENTRENO",
    random: "AL AZAR",
    randomText: "DEJA QUE EL DESTINO ELIJA.",
    power: "FUERZA",
    speed: "VELOCIDAD",
    reach: "ALCANCE",
    health: "VIDA",
    pick: "ELEGIR",
  },
  chars: {
    asagiri: { title: "LA HOJA DEL ALBA", tagline: "DUELISTA DE KATANA EQUILIBRADA. CORTES LIMPIOS, SIN PUNTOS DÉBILES." },
    yoikaze: { title: "EL VIENTO NOCTURNO", tagline: "EL MÁS RÁPIDO. POCA VIDA, ATAQUE SIN TREGUA." },
    grimvald: { title: "LA MAREA DE HIERRO", tagline: "HACHA Y ESCUDO. LENTO, PERO CADA GOLPE APLASTA." },
    maelis: { title: "LA GUJA DE LA MAREA", tagline: "GUARDIANA DE LOS ARRECIFES DE PERLA. EL MAYOR ALCANCE." },
    bazalt: { title: "EL PUÑO DE ASCUA", tagline: "GÓLEM DE PIEDRA DE LA FRAGUA DE CENIZA. DURO Y PEGÓN." },
    oriel: { title: "EL GUARDIÁN DEL FAROL", tagline: "MONJE DE LA ORDEN DEL CAMINO. BASTÓN ASTUTO A MEDIA DISTANCIA." },
  },
  map: {
    title: "ELIGE ARENA",
    random: "AL AZAR",
    names: { quay: "MUELLE AL OCASO", frost: "NOCHE HELADA" },
    descs: { quay: "MUELLES DE MADERA BAJO EL SOL PONIENTE.", frost: "UN PATIO HELADO BAJO LAS ESTRELLAS." },
  },
  paused: { title: "PAUSA", resume: "CONTINUAR", quit: "SALIR AL MENÚ", restart: "REINICIAR" },
  result: {
    wins: "¡GANA!",
    victory: "VICTORIA",
    defeat: "DERROTA",
    rounds: "ASALTOS",
    rematch: "REVANCHA",
    change: "CAMBIAR LUCHADORES",
    menu: "MENÚ PRINCIPAL",
  },
  tutorial: {
    step: "PASO",
    skip: "SALTAR",
    done: "¡TUTORIAL COMPLETADO!",
    doneText: "YA SABES LO BÁSICO. HORA DE UN COMBATE DE VERDAD.",
    fightCpu: "LUCHAR CONTRA CPU",
    menu: "MENÚ PRINCIPAL",
    steps: {
      move: { title: "MOVERSE", text: "CAMINA A IZQUIERDA Y DERECHA CON {move}." },
      jump: { title: "SALTAR", text: "PULSA {jump} PARA SALTAR. SALTA DOS VECES." },
      light: { title: "ATAQUE LIGERO", text: "RÁPIDO Y SEGURO. GOLPEA AL MUÑECO 3 VECES CON {light}." },
      medium: { title: "ATAQUE MEDIO", text: "MÁS ALCANCE Y DAÑO. ACIERTA {medium} DOS VECES." },
      heavy: { title: "ATAQUE FUERTE", text: "LENTO PERO POTENTE. ACIERTA {heavy} DOS VECES." },
      charge: {
        title: "CARGAR",
        text: "MANTÉN UN ATAQUE PARA CARGARLO Y SUELTA PARA GOLPEAR. LA CARGA COMPLETA ROMPE LA GUARDIA. ACIERTA 2 GOLPES CARGADOS.",
      },
      block: { title: "BLOQUEAR", text: "MANTÉN {block} CUANDO ATAQUE EL MUÑECO. BLOQUEA 3 ATAQUES." },
      dodge: { title: "ESQUIVAR", text: "PULSA {dodge} CUANDO ATAQUE EL MUÑECO PARA ESQUIVAR HACIA ATRÁS. ESQUIVA DOS VECES." },
      combo: { title: "COMBO", text: "ENCADENA {light} → {medium} → {heavy} RÁPIDO PARA UN COMBO DE 3 GOLPES." },
      free: { title: "PRÁCTICA LIBRE", text: "JUNTA TODO LO APRENDIDO: ACIERTA 6 GOLPES." },
    },
  },
  controlsScreen: {
    title: "CONTROLES",
    keyboard: "TECLADO",
    p1: "JUGADOR 1",
    p2: "JUGADOR 2",
    gamepad: "MANDO",
    touch: "TÁCTIL",
    move: "MOVERSE",
    jump: "SALTAR",
    block: "BLOQUEAR (MANTENER)",
    light: "LIGERO",
    medium: "MEDIO",
    heavy: "FUERTE",
    dodge: "ESQUIVA ATRÁS",
    pause: "PAUSA",
    tips: [
      "MANTÉN UN BOTÓN DE ATAQUE PARA CARGARLO. LA CARGA COMPLETA ROMPE LA GUARDIA.",
      "ENCADENA LIGERO → MEDIO → FUERTE PARA HACER COMBOS.",
      "BLOQUEA EN EL MOMENTO EXACTO DEL GOLPE PARA ATURDIR AL RIVAL 1 SEGUNDO.",
      "CONTRA CPU: LOS DOS LADOS DEL TECLADO CONTROLAN AL JUGADOR 1.",
    ],
  },
  touchButtons: { block: "BLOQ.", dodge: "ESQUIVA" },
  rotate: "GIRA EL MÓVIL PARA VERLO MÁS GRANDE",
  loading: "CARGANDO...",
};

const PT: Strings = {
  labels: {
    round: "ROUND",
    finalRound: "ROUND FINAL",
    fight: "LUTEM!",
    ko: "K.O.",
    perfect: "PERFEITO",
    timeUp: "TEMPO ESGOTADO",
    draw: "EMPATE",
    hits: "GOLPES",
    wins: "VENCE",
    cpu: "CPU",
    p1: "J1",
    p2: "J2",
  },
  poster: {
    tagline: "JOGO DE LUTA 1 CONTRA 1 EM PIXEL ART",
    play: "JOGAR",
    hint: "6 LUTADORES / CONTRA CPU / 2 JOGADORES / TUTORIAL",
  },
  tagline: "SEIS LUTADORES. DUAS ARENAS. UM VENCEDOR.",
  play: "JOGAR",
  options: "OPÇÕES",
  controls: "CONTROLES",
  back: "VOLTAR",
  exit: "SAIR",
  pause: "PAUSA",
  on: "SIM",
  off: "NÃO",
  sound: "SOM",
  music: "MÚSICA",
  reducedFlash: "MENOS CLARÕES",
  firstVisit: {
    title: "PRIMEIRA VEZ AQUI?",
    text: "O TUTORIAL ENSINA O BÁSICO EM CERCA DE DOIS MINUTOS.",
    start: "COMEÇAR TUTORIAL",
    skip: "PULAR",
  },
  mode: {
    title: "ESCOLHA O MODO",
    tutorial: "TUTORIAL",
    tutorialDesc: "APRENDA GOLPES, CARGA, DEFESA E ESQUIVA",
    ai: "CONTRA CPU",
    aiDesc: "MELHOR DE 3 CONTRA O COMPUTADOR",
    versus: "2 JOGADORES",
    versusDesc: "MESMO TECLADO, MELHOR DE 3",
    difficulty: "DIFICULDADE",
  },
  levels: { easy: "FÁCIL", normal: "NORMAL", hard: "DIFÍCIL" },
  select: {
    title: "ESCOLHA SEU LUTADOR",
    player1: "JOGADOR 1",
    player2: "JOGADOR 2",
    cpu: "CPU",
    dummy: "PARCEIRO DE TREINO",
    random: "ALEATÓRIO",
    randomText: "DEIXE O DESTINO ESCOLHER.",
    power: "FORÇA",
    speed: "VELOCIDADE",
    reach: "ALCANCE",
    health: "VIDA",
    pick: "ESCOLHER",
  },
  chars: {
    asagiri: { title: "A LÂMINA DA AURORA", tagline: "DUELISTA DE KATANA EQUILIBRADA. CORTES LIMPOS, SEM PONTOS FRACOS." },
    yoikaze: { title: "O VENTO DA NOITE", tagline: "O MAIS RÁPIDO. POUCA VIDA, ATAQUE SEM TRÉGUA." },
    grimvald: { title: "A MARÉ DE FERRO", tagline: "MACHADO E ESCUDO. LENTO, MAS CADA GOLPE ESMAGA." },
    maelis: { title: "A GLÁDIA DA MARÉ", tagline: "GUARDIÃ DOS RECIFES DE PÉROLA. O MAIOR ALCANCE." },
    bazalt: { title: "O PUNHO DE BRASA", tagline: "GOLEM DE PEDRA DA FORJA DE CINZAS. BRIGÃO RESISTENTE." },
    oriel: { title: "O GUARDIÃO DA LANTERNA", tagline: "MONGE DA ORDEM DA ESTRADA. CAJADO ARDILOSO A MEIA DISTÂNCIA." },
  },
  map: {
    title: "ESCOLHA A ARENA",
    random: "ALEATÓRIO",
    names: { quay: "CAIS DO PÔR DO SOL", frost: "NOITE GELADA" },
    descs: { quay: "DOCAS DE MADEIRA SOB O SOL POENTE.", frost: "UM PÁTIO CONGELADO SOB AS ESTRELAS." },
  },
  paused: { title: "PAUSA", resume: "CONTINUAR", quit: "SAIR PARA O MENU", restart: "REINICIAR" },
  result: {
    wins: "VENCE!",
    victory: "VITÓRIA",
    defeat: "DERROTA",
    rounds: "ROUNDS",
    rematch: "REVANCHE",
    change: "TROCAR LUTADORES",
    menu: "MENU PRINCIPAL",
  },
  tutorial: {
    step: "PASSO",
    skip: "PULAR",
    done: "TUTORIAL CONCLUÍDO!",
    doneText: "VOCÊ JÁ SABE O BÁSICO. HORA DE UMA LUTA DE VERDADE.",
    fightCpu: "LUTAR CONTRA CPU",
    menu: "MENU PRINCIPAL",
    steps: {
      move: { title: "MOVER", text: "ANDE PARA A ESQUERDA E A DIREITA COM {move}." },
      jump: { title: "PULAR", text: "APERTE {jump} PARA PULAR. PULE DUAS VEZES." },
      light: { title: "ATAQUE LEVE", text: "RÁPIDO E SEGURO. ACERTE O BONECO 3 VEZES COM {light}." },
      medium: { title: "ATAQUE MÉDIO", text: "MAIS ALCANCE E DANO. ACERTE {medium} DUAS VEZES." },
      heavy: { title: "ATAQUE FORTE", text: "LENTO, MAS PODEROSO. ACERTE {heavy} DUAS VEZES." },
      charge: {
        title: "CARREGAR",
        text: "SEGURE UM ATAQUE PARA CARREGÁ-LO E SOLTE PARA GOLPEAR. A CARGA TOTAL QUEBRA A DEFESA. ACERTE 2 GOLPES CARREGADOS.",
      },
      block: { title: "DEFENDER", text: "SEGURE {block} QUANDO O BONECO ATACAR. DEFENDA 3 ATAQUES." },
      dodge: { title: "ESQUIVAR", text: "APERTE {dodge} QUANDO O BONECO ATACAR PARA RECUAR. ESQUIVE DUAS VEZES." },
      combo: { title: "COMBO", text: "ENCADEIE {light} → {medium} → {heavy} RÁPIDO PARA UM COMBO DE 3 GOLPES." },
      free: { title: "TREINO LIVRE", text: "JUNTE TUDO: ACERTE 6 GOLPES." },
    },
  },
  controlsScreen: {
    title: "CONTROLES",
    keyboard: "TECLADO",
    p1: "JOGADOR 1",
    p2: "JOGADOR 2",
    gamepad: "CONTROLE",
    touch: "TOQUE",
    move: "MOVER",
    jump: "PULAR",
    block: "DEFENDER (SEGURAR)",
    light: "LEVE",
    medium: "MÉDIO",
    heavy: "FORTE",
    dodge: "ESQUIVA PARA TRÁS",
    pause: "PAUSA",
    tips: [
      "SEGURE UM BOTÃO DE ATAQUE PARA CARREGAR. A CARGA TOTAL QUEBRA A DEFESA.",
      "ENCADEIE LEVE → MÉDIO → FORTE PARA FAZER COMBOS.",
      "DEFENDA NO MOMENTO EXATO DO GOLPE PARA ATORDOAR O RIVAL POR 1 SEGUNDO.",
      "CONTRA CPU: OS DOIS LADOS DO TECLADO CONTROLAM O JOGADOR 1.",
    ],
  },
  touchButtons: { block: "DEFESA", dodge: "ESQUIVA" },
  rotate: "GIRE O CELULAR PARA VER MAIOR",
  loading: "CARREGANDO...",
};

const TABLE: Record<Locale, Strings> = { en: EN, es: ES, pt: PT };

export function getStrings(locale: Locale): Strings {
  return TABLE[locale];
}

/** Control names shown inside tutorial instructions, per input device. */
export type DeviceKind = "keyboard" | "touch" | "pad";

export function controlNames(device: DeviceKind, s: Strings): Record<string, string> {
  switch (device) {
    case "keyboard":
      return { move: "A / D", jump: "W", block: "S", light: "F", medium: "G", heavy: "H", dodge: "E" };
    case "touch":
      return {
        move: "← →",
        jump: "↑",
        block: s.touchButtons.block,
        light: "L",
        medium: "M",
        heavy: "H",
        dodge: s.touchButtons.dodge,
      };
    case "pad":
      return { move: "← →", jump: "A", block: "LB", light: "X", medium: "Y", heavy: "B", dodge: "RB" };
  }
}

/** Replace `{name}` tokens with entries of `vars`. */
export function fill(text: string, vars: Readonly<Record<string, string | number>>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => {
    const v = vars[k];
    return v === undefined ? m : String(v);
  });
}
