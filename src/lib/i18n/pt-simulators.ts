/** pt-BR names, badges and summaries for the simulators catalog (keys = EN slug). Missing keys fall back to EN. */
export const PT_SIMULATORS: Record<string, { name: string; badge: string; summary: string }> = {
  "molecular-motion": { name: "Movimento molecular", badge: "Estados da matéria", summary: "Estados da matéria interativos: sólido, líquido e gás. Veja as partículas vibrarem, fluírem ou voarem livres." },
  "gravity-sandbox": { name: "Caixa de areia gravitacional", badge: "N-corpos", summary: "Posicione massas e veja órbitas se formarem sob a gravidade. Ajuste G e a massa para explorar trajetórias estáveis e caóticas." },
  pendulum: { name: "Pêndulo simples", badge: "Período e g", summary: "Pêndulo clássico com ângulo, período e energia ao vivo. Mude o comprimento e a gravidade e veja o movimento se atualizar." },
  "double-pendulum": { name: "Pêndulo duplo", badge: "Caos", summary: "Dois pêndulos ligados, sensíveis às condições iniciais. Trace a trajetória e sinta o caos determinístico." },
  "projectile-motion": { name: "Lançamento de projéteis", badge: "Trajetórias", summary: "Lance um projétil com ângulo e velocidade. Veja alcance, altura e a trajetória parabólica em tempo real." },
  "optics-bench": { name: "Banco óptico", badge: "Lentes", summary: "Lentes e raios num banco óptico virtual. Mova os elementos e veja o foco e a ampliação mudarem." },
  "dc-circuit": { name: "Circuito CC", badge: "Lei de Ohm", summary: "Monte um circuito de corrente contínua simples. Ajuste resistência e tensão e veja a corrente reagir ao vivo." },
  "standing-wave": { name: "Ondas estacionárias", badge: "Nós", summary: "Ondas estacionárias numa corda. Mude a frequência e a tensão para encontrar harmônicos e nós." },
  "wave-interference": { name: "Interferência de ondas", badge: "Superposição", summary: "Duas fontes de ondas interferem. Veja padrões construtivos e destrutivos se formarem em tempo real." },
  ecosystem: { name: "Ecossistema", badge: "Predador–presa", summary: "Dinâmica predador–presa simples. Ajuste as taxas e veja as populações subirem, caírem e se estabilizarem." },
  "sir-epidemic": { name: "Epidemia SIR", badge: "Compartimentos", summary: "Modelo SIR clássico: suscetíveis, infectados e recuperados. Mude o R0 e a taxa de recuperação e acompanhe a curva." },
  "market-equilibrium": { name: "Equilíbrio de mercado", badge: "Oferta e demanda", summary: "As curvas de oferta e demanda se cruzam. Desloque as curvas e veja preço e quantidade acharem um novo equilíbrio." },
  "galton-board": { name: "Tabuleiro de Galton", badge: "Curva normal", summary: "Bolinhas quicam entre pinos até as caixas. Veja uma distribuição binomial formar uma curva em sino." },
  "boids-flocking-lab": { name: "Laboratório de bandos (boids)", badge: "Bandos", summary: "Separação, alinhamento e coesão. Ajuste as três regras e veja os agentes formarem bandos e rastros." },
  "reaction-diffusion-lab": { name: "Laboratório de reação–difusão", badge: "Padrões", summary: "Reação–difusão no estilo Gray–Scott. Faça surgir manchas, listras e labirintos a partir de regras locais simples." },
  "logistic-chaos-lab": { name: "Laboratório do caos logístico", badge: "Duplicação de período", summary: "Mapa logístico x→r·x·(1−x): série temporal, diagrama de teia e bifurcação. Encontre a cascata de Feigenbaum e os atratores." },
  "traffic-signal-lab": { name: "Laboratório de semáforos", badge: "Tempos de fase", summary: "Cruzamento de 4 vias. Defina os tempos de verde N-S/L-O, veja os carros formarem fila ou fluírem e acompanhe o fluxo ao vivo." },
  "bin-packing": { name: "Empacotamento em caixa", badge: "Aproveitamento", summary: "Encaixe retângulos numa caixa fixa. Clique para posicionar os tamanhos escolhidos, evite sobreposições e maximize o aproveitamento em %." },
};

export const PT_SIM_TAGS = { physics: "Física", chemistry: "Química", math: "Matemática" } as const;
