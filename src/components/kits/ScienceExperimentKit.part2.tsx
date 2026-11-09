// Part 2 of 3 — split from ScienceExperimentKit.tsx on 2026-11-04. Edit here; ScienceExperimentKit.tsx re-exports.

export type AgeGroup = "young" | "elem" | "older";

export type Theme = {
  id: string;
  nameEn: string;
  nameEs: string;
  materialsEn: string[];
  materialsEs: string[];
  stepsEn: string[];
  stepsEs: string[];
  timeMin: number;
  safetyEn: Record<AgeGroup, string[]>;
  safetyEs: Record<AgeGroup, string[]>;
};

export const AGE_GROUPS: { id: AgeGroup; nameEn: string; nameEs: string }[] = [
  { id: "young", nameEn: "Young kids (5-7)", nameEs: "Niños pequeños (5-7)" },
  { id: "elem", nameEn: "Elementary (8-11)", nameEs: "Primaria (8-11)" },
  { id: "older", nameEn: "Older kids (12+)", nameEs: "Mayores (12+)" },
];

export const THEMES: Theme[] = [
  {
    id: "volcano",
    nameEn: "Volcano",
    nameEs: "Volcán",
    materialsEn: ["Baking soda", "Vinegar", "Red food coloring", "Dish soap", "Plastic bottle or cup", "Tray"],
    materialsEs: ["Bicarbonato de sodio", "Vinagre", "Colorante rojo", "Jabón para platos", "Botella o vaso de plástico", "Bandeja"],
    stepsEn: [
      "Place the bottle in the tray",
      "Add 2 tbsp baking soda",
      "Add a few drops of red coloring and a squirt of soap",
      "Pour in vinegar and watch the eruption",
      "Observe the foam and discuss the reaction",
    ],
    stepsEs: [
      "Coloca la botella en la bandeja",
      "Agrega 2 cucharadas de bicarbonato",
      "Añade unas gotas de colorante rojo y un chorro de jabón",
      "Vierte el vinagre y observa la erupción",
      "Observa la espuma y discute la reacción",
    ],
    timeMin: 10,
    safetyEn: {
      young: ["Adult must supervise the pouring", "Keep vinegar away from eyes", "Use a tray to contain spills"],
      elem: ["Wear old clothes", "Do not taste the mixture", "Clean up spills promptly"],
      older: ["Handle vinegar carefully", "Optional: measure precisely for better results"],
    },
    safetyEs: {
      young: ["Un adulto debe supervisar el vertido", "Mantén el vinagre lejos de los ojos", "Usa una bandeja para contener derrames"],
      elem: ["Usa ropa vieja", "No pruebes la mezcla", "Limpia los derrames pronto"],
      older: ["Maneja el vinagre con cuidado", "Opcional: mide con precisión para mejores resultados"],
    },
  },
  {
    id: "slime",
    nameEn: "Slime",
    nameEs: "Slime",
    materialsEn: ["White glue", "Borax or contact solution", "Water", "Food coloring", "Bowl", "Spoon"],
    materialsEs: ["Pegamento blanco", "Bórax o solución de lentes", "Agua", "Colorante", "Tazón", "Cuchara"],
    stepsEn: [
      "Mix glue with a bit of water and coloring",
      "In another cup dissolve borax in water",
      "Slowly add activator to glue mix while stirring",
      "Knead until it reaches slime consistency",
      "Store in a sealed bag",
    ],
    stepsEs: [
      "Mezcla el pegamento con un poco de agua y colorante",
      "En otro vaso disuelve el bórax en agua",
      "Añade lentamente el activador a la mezcla de pegamento mientras revuelves",
      "Amasa hasta obtener la consistencia de slime",
      "Guarda en una bolsa sellada",
    ],
    timeMin: 15,
    safetyEn: {
      young: ["Adult handles borax/activator", "Wash hands after", "Do not eat slime"],
      elem: ["Follow activator amounts carefully", "Wash hands thoroughly", "Store away from younger siblings"],
      older: ["Use gloves if sensitive skin", "Dispose of properly if not keeping"],
    },
    safetyEs: {
      young: ["El adulto maneja el bórax/activador", "Lávate las manos después", "No comas el slime"],
      elem: ["Sigue las cantidades de activador con cuidado", "Lávate las manos bien", "Guárdalo lejos de hermanos menores"],
      older: ["Usa guantes si tienes piel sensible", "Desecha correctamente si no lo guardas"],
    },
  },
  {
    id: "circuit",
    nameEn: "Simple Circuit",
    nameEs: "Circuito simple",
    materialsEn: ["Battery (AA or 9V)", "Wires or foil", "Small bulb or LED", "Tape", "Cardboard base"],
    materialsEs: ["Batería (AA o 9V)", "Cables o papel aluminio", "Bombilla pequeña o LED", "Cinta", "Base de cartón"],
    stepsEn: [
      "Attach battery to cardboard with tape",
      "Connect one wire from battery positive to bulb",
      "Connect second wire from bulb to battery negative",
      "Close the circuit and see the light",
      "Try adding a switch with foil",
    ],
    stepsEs: [
      "Fija la batería al cartón con cinta",
      "Conecta un cable del positivo de la batería a la bombilla",
      "Conecta el segundo cable de la bombilla al negativo de la batería",
      "Cierra el circuito y observa la luz",
      "Prueba agregar un interruptor con papel aluminio",
    ],
    timeMin: 12,
    safetyEn: {
      young: ["Adult supervises battery connections", "Do not short the battery", "Use low voltage only"],
      elem: ["Avoid touching both terminals at once", "Disconnect when done", "No metal jewelry"],
      older: ["Understand basic polarity", "Do not use household voltage"],
    },
    safetyEs: {
      young: ["El adulto supervisa las conexiones de la batería", "No cortocircuites la batería", "Usa solo bajo voltaje"],
      elem: ["Evita tocar ambos terminales a la vez", "Desconecta al terminar", "Sin joyas de metal"],
      older: ["Entiende la polaridad básica", "No uses voltaje de casa"],
    },
  },
  {
    id: "plant",
    nameEn: "Plant Growth",
    nameEs: "Crecimiento de planta",
    materialsEn: ["Seed (bean or similar)", "Soil or cotton", "Clear cup", "Water", "Sunlight spot"],
    materialsEs: ["Semilla (frijol o similar)", "Tierra o algodón", "Vaso transparente", "Agua", "Lugar con luz"],
    stepsEn: [
      "Fill cup with damp cotton or soil",
      "Place seed near the side so roots are visible",
      "Add a little water",
      "Place in sunlight",
      "Observe daily and record growth",
    ],
    stepsEs: [
      "Llena el vaso con algodón húmedo o tierra",
      "Coloca la semilla cerca del borde para ver las raíces",
      "Agrega un poco de agua",
      "Colócalo a la luz del sol",
      "Observa diariamente y registra el crecimiento",
    ],
    timeMin: 5,
    safetyEn: {
      young: ["Wash hands after handling soil", "Do not overwater", "Adult helps with placement"],
      elem: ["Label the cup", "Check moisture daily", "Keep away from pets"],
      older: ["Record observations in a journal", "Try different light conditions"],
    },
    safetyEs: {
      young: ["Lávate las manos después de manipular tierra", "No riegues demasiado", "El adulto ayuda con la colocación"],
      elem: ["Etiqueta el vaso", "Revisa la humedad diariamente", "Mantén lejos de mascotas"],
      older: ["Registra observaciones en un diario", "Prueba diferentes condiciones de luz"],
    },
  },
];
