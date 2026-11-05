// Part 2 of 3 — split from PaperAirplaneKit.tsx on 2026-11-04. Edit here; PaperAirplaneKit.tsx re-exports.

export type Design = {
  id: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  stepsEn: string[];
  stepsEs: string[];
  stepsPt: string[];
  folds: number;
  descEn: string;
  descEs: string;
  descPt: string;
  distanceScore: number;
  stuntScore: number;
  timeMin: number;
};

export const DESIGNS: Design[] = [
  {
    id: "dart",
    nameEn: "Classic Dart",
    nameEs: "Dardo clásico",
    namePt: "Dardo clássico",
    descEn: "Fast, pointed nose for distance.",
    descEs: "Nariz puntiaguda y rápida para distancia.",
    descPt: "Nariz pontiagudo e rápido para distância.",
    folds: 6,
    distanceScore: 90,
    stuntScore: 40,
    timeMin: 5,
    stepsEn: [
      "Fold paper in half lengthwise, crease firmly, then open",
      "Fold top corners to the center crease",
      "Fold the new top edges to the center again",
      "Fold in half along the original crease",
      "Fold wings down evenly on both sides",
      "Adjust wing angle slightly and launch",
    ],
    stepsEs: [
      "Dobla el papel por la mitad a lo largo, marca firmemente y abre",
      "Dobla las esquinas superiores hacia el pliegue central",
      "Dobla los nuevos bordes superiores al centro de nuevo",
      "Dobla por la mitad a lo largo del pliegue original",
      "Dobla las alas hacia abajo de forma pareja",
      "Ajusta ligeramente el ángulo de las alas y lanza",
    ],
    stepsPt: [
      "Dobre o papel ao meio no sentido do comprimento, marque firmemente e abra",
      "Dobre os cantos superiores em direção ao vinco central",
      "Dobre as novas bordas superiores para o centro novamente",
      "Dobre ao meio ao longo do vinco original",
      "Dobre as asas para baixo de forma uniforme",
      "Ajuste ligeiramente o ângulo das asas e lance",
    ],
  },
  {
    id: "glider",
    nameEn: "Glider",
    nameEs: "Planeador",
    namePt: "Planador",
    descEn: "Wider wings for smooth, long glides.",
    descEs: "Alas más anchas para planeos largos y suaves.",
    descPt: "Asas mais largas para planeios longos e suaves.",
    folds: 5,
    distanceScore: 75,
    stuntScore: 55,
    timeMin: 6,
    stepsEn: [
      "Fold in half lengthwise, crease, open",
      "Fold top corners to center crease",
      "Fold top point down to meet the bottom edge",
      "Fold in half and create wide, even wings",
      "Bend wing tips slightly upward for stability",
    ],
    stepsEs: [
      "Dobla por la mitad a lo largo, marca y abre",
      "Dobla las esquinas superiores al pliegue central",
      "Dobla la punta superior hacia abajo hasta el borde inferior",
      "Dobla por la mitad y crea alas anchas y parejas",
      "Dobla ligeramente las puntas de las alas hacia arriba para estabilidad",
    ],
    stepsPt: [
      "Dobre ao meio no sentido do comprimento, marque e abra",
      "Dobre os cantos superiores ao vinco central",
      "Dobre a ponta superior para baixo até a borda inferior",
      "Dobre ao meio e crie asas largas e uniformes",
      "Dobre ligeiramente as pontas das asas para cima para estabilidade",
    ],
  },
  {
    id: "stunt",
    nameEn: "Stunt Plane",
    nameEs: "Avión de acrobacias",
    namePt: "Avião de acrobacias",
    descEn: "Loops and tricks with balanced folds.",
    descEs: "Bucles y trucos con pliegues equilibrados.",
    descPt: "Loops e truques com dobras equilibradas.",
    folds: 7,
    distanceScore: 50,
    stuntScore: 85,
    timeMin: 8,
    stepsEn: [
      "Fold in half lengthwise and open",
      "Fold top corners inward to center",
      "Fold the top down once more",
      "Fold sides to center to form the body",
      "Fold in half along the center",
      "Create small elevators by folding wing edges up",
      "Test short throws to practice loops",
    ],
    stepsEs: [
      "Dobla por la mitad a lo largo y abre",
      "Dobla las esquinas superiores hacia el centro",
      "Dobla la parte superior hacia abajo una vez más",
      "Dobla los lados al centro para formar el cuerpo",
      "Dobla por la mitad a lo largo del centro",
      "Crea elevadores pequeños doblando los bordes de las alas hacia arriba",
      "Prueba lanzamientos cortos para practicar bucles",
    ],
    stepsPt: [
      "Dobre ao meio no sentido do comprimento e abra",
      "Dobre os cantos superiores para dentro em direção ao centro",
      "Dobre a parte superior para baixo mais uma vez",
      "Dobre os lados para o centro para formar o corpo",
      "Dobre ao meio ao longo do centro",
      "Crie elevadores pequenos dobrando as bordas das asas para cima",
      "Teste lançamentos curtos para praticar loops",
    ],
  },
  {
    id: "delta",
    nameEn: "Delta Wing",
    nameEs: "Ala delta",
    namePt: "Asa delta",
    descEn: "Simple triangular shape, stable and easy for beginners.",
    descEs: "Forma triangular simple, estable y fácil para principiantes.",
    descPt: "Forma triangular simples, estável e fácil para iniciantes.",
    folds: 4,
    distanceScore: 65,
    stuntScore: 60,
    timeMin: 4,
    stepsEn: [
      "Fold paper in half lengthwise, crease firmly, open",
      "Fold both top corners down to meet the center crease, forming a triangle",
      "Fold the new top point down slightly for nose weight",
      "Fold in half and adjust wing angles for balance",
    ],
    stepsEs: [
      "Dobla el papel por la mitad a lo largo, marca firmemente y abre",
      "Dobla ambas esquinas superiores hacia el pliegue central formando un triángulo",
      "Dobla la nueva punta superior ligeramente hacia abajo para peso en la nariz",
      "Dobla por la mitad y ajusta los ángulos de las alas para equilibrar",
    ],
    stepsPt: [
      "Dobre o papel ao meio no sentido do comprimento, marque firmemente e abra",
      "Dobre ambos os cantos superiores para o vinco central formando um triângulo",
      "Dobre a nova ponta superior ligeiramente para baixo para peso no nariz",
      "Dobre ao meio e ajuste os ângulos das asas para equilibrar",
    ],
  },
];
