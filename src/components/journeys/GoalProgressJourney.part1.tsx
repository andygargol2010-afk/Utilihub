// Part 1 of GoalProgressJourney — types + static data. Edit here; main re-exports.

export type Locale = "en" | "es";

export type CategoryId = "learn" | "habit" | "save" | "fitness";

export interface StageItem {
  id: string;
  text: Record<Locale, string>;
}

export interface Stage {
  id: string;
  title: Record<Locale, string>;
  tip: Record<Locale, string>;
  items: StageItem[];
}

export interface Category {
  id: CategoryId;
  name: Record<Locale, string>;
  stages: Stage[];
}

export const CATEGORIES: Category[] = [
  {
    id: "learn",
    name: { en: "Learn a skill", es: "Aprender una habilidad" },
    stages: [
      {
        id: "s1",
        title: { en: "Choose focus", es: "Elegir enfoque" },
        tip: { en: "Pick one specific skill to start." , es: "Elige una habilidad específica para empezar." },
        items: [
          { id: "i1", text: { en: "Define the skill clearly", es: "Define la habilidad con claridad" } },
          { id: "i2", text: { en: "Set a weekly practice goal", es: "Fija una meta de práctica semanal" } },
        ],
      },
      {
        id: "s2",
        title: { en: "Gather resources", es: "Reunir recursos" },
        tip: { en: "Start with free, high-quality materials." , es: "Empieza con materiales gratuitos de calidad." },
        items: [
          { id: "i1", text: { en: "Find 1-2 beginner guides", es: "Encuentra 1-2 guías para principiantes" } },
          { id: "i2", text: { en: "Bookmark a practice tool", es: "Guarda una herramienta de práctica" } },
        ],
      },
      {
        id: "s3",
        title: { en: "First session", es: "Primera sesión" },
        tip: { en: "Short and consistent beats long and rare." , es: "Corto y constante gana a largo y raro." },
        items: [
          { id: "i1", text: { en: "Complete a 15-min session", es: "Completa una sesión de 15 min" } },
          { id: "i2", text: { en: "Note one takeaway", es: "Anota un aprendizaje" } },
        ],
      },
      {
        id: "s4",
        title: { en: "Build habit", es: "Construir hábito" },
        tip: { en: "Link practice to an existing routine." , es: "Enlaza la práctica a una rutina existente." },
        items: [
          { id: "i1", text: { en: "Schedule next 3 sessions", es: "Agenda las próximas 3 sesiones" } },
          { id: "i2", text: { en: "Track one week", es: "Registra una semana" } },
        ],
      },
      {
        id: "s5",
        title: { en: "Review & next", es: "Revisar y siguiente" },
        tip: { en: "Celebrate progress and adjust." , es: "Celebra el progreso y ajusta." },
        items: [
          { id: "i1", text: { en: "Review what worked", es: "Revisa qué funcionó" } },
          { id: "i2", text: { en: "Plan the next level", es: "Planifica el siguiente nivel" } },
        ],
      },
    ],
  },
  {
    id: "habit",
    name: { en: "Build a habit", es: "Construir un hábito" },
    stages: [
      {
        id: "s1",
        title: { en: "Define the habit", es: "Definir el hábito" },
        tip: { en: "Make it tiny and specific." , es: "Hazlo pequeño y específico." },
        items: [
          { id: "i1", text: { en: "Write the exact behavior", es: "Escribe el comportamiento exacto" } },
          { id: "i2", text: { en: "Choose a cue", es: "Elige una señal" } },
        ],
      },
      {
        id: "s2",
        title: { en: "Prepare environment", es: "Preparar entorno" },
        tip: { en: "Remove friction." , es: "Elimina fricción." },
        items: [
          { id: "i1", text: { en: "Set up tools in advance", es: "Prepara las herramientas" } },
          { id: "i2", text: { en: "Remove one obstacle", es: "Elimina un obstáculo" } },
        ],
      },
      {
        id: "s3",
        title: { en: "First streak", es: "Primera racha" },
        tip: { en: "Never miss twice." , es: "Nunca falles dos veces seguidas." },
        items: [
          { id: "i1", text: { en: "Do it 3 days in a row", es: "Hazlo 3 días seguidos" } },
          { id: "i2", text: { en: "Log the result", es: "Registra el resultado" } },
        ],
      },
      {
        id: "s4",
        title: { en: "Strengthen", es: "Fortalecer" },
        tip: { en: "Add a small reward." , es: "Añade una recompensa pequeña." },
        items: [
          { id: "i1", text: { en: "Reach 7-day streak", es: "Llega a racha de 7 días" } },
          { id: "i2", text: { en: "Reflect on ease", es: "Reflexiona sobre la facilidad" } },
        ],
      },
      {
        id: "s5",
        title: { en: "Sustain", es: "Sostener" },
        tip: { en: "Plan for obstacles." , es: "Planifica obstáculos." },
        items: [
          { id: "i1", text: { en: "Identify one risk", es: "Identifica un riesgo" } },
          { id: "i2", text: { en: "Set a recovery plan", es: "Establece un plan de recuperación" } },
        ],
      },
    ],
  },
  {
    id: "save",
    name: { en: "Save for a goal", es: "Ahorrar para un objetivo" },
    stages: [
      {
        id: "s1",
        title: { en: "Set target", es: "Fijar meta" },
        tip: { en: "Specific amount and date." , es: "Cantidad y fecha específicas." },
        items: [
          { id: "i1", text: { en: "Name the goal", es: "Nombra el objetivo" } },
          { id: "i2", text: { en: "Calculate monthly amount", es: "Calcula la cantidad mensual" } },
        ],
      },
      {
        id: "s2",
        title: { en: "Open tracking", es: "Abrir seguimiento" },
        tip: { en: "Visible progress motivates." , es: "El progreso visible motiva." },
        items: [
          { id: "i1", text: { en: "Create a savings account or pot", es: "Crea una cuenta o fondo de ahorro" } },
          { id: "i2", text: { en: "Set first transfer", es: "Programa la primera transferencia" } },
        ],
      },
      {
        id: "s3",
        title: { en: "First contribution", es: "Primera aportación" },
        tip: { en: "Automate if possible." , es: "Automatiza si es posible." },
        items: [
          { id: "i1", text: { en: "Make the first deposit", es: "Haz el primer depósito" } },
          { id: "i2", text: { en: "Confirm it appears", es: "Confirma que aparece" } },
        ],
      },
      {
        id: "s4",
        title: { en: "Protect the plan", es: "Proteger el plan" },
        tip: { en: "Review expenses briefly." , es: "Revisa gastos brevemente." },
        items: [
          { id: "i1", text: { en: "Check one month of spending", es: "Revisa un mes de gastos" } },
          { id: "i2", text: { en: "Adjust one category", es: "Ajusta una categoría" } },
        ],
      },
      {
        id: "s5",
        title: { en: "Review progress", es: "Revisar progreso" },
        tip: { en: "Adjust or celebrate." , es: "Ajusta o celebra." },
        items: [
          { id: "i1", text: { en: "Calculate % complete", es: "Calcula el % completado" } },
          { id: "i2", text: { en: "Decide next step", es: "Decide el siguiente paso" } },
        ],
      },
    ],
  },
  {
    id: "fitness",
    name: { en: "Improve fitness", es: "Mejorar forma física" },
    stages: [
      {
        id: "s1",
        title: { en: "Baseline", es: "Línea base" },
        tip: { en: "Measure where you are." , es: "Mide dónde estás." },
        items: [
          { id: "i1", text: { en: "Note current activity level", es: "Anota el nivel de actividad actual" } },
          { id: "i2", text: { en: "Set one simple metric", es: "Fija una métrica simple" } },
        ],
      },
      {
        id: "s2",
        title: { en: "Start moving", es: "Empezar a moverse" },
        tip: { en: "Consistency over intensity." , es: "Consistencia sobre intensidad." },
        items: [
          { id: "i1", text: { en: "Do one short session", es: "Haz una sesión corta" } },
          { id: "i2", text: { en: "Schedule the next one", es: "Agenda la siguiente" } },
        ],
      },
      {
        id: "s3",
        title: { en: "Build volume", es: "Aumentar volumen" },
        tip: { en: "Add a little each week." , es: "Añade un poco cada semana." },
        items: [
          { id: "i1", text: { en: "Complete 3 sessions", es: "Completa 3 sesiones" } },
          { id: "i2", text: { en: "Note energy after", es: "Anota la energía después" } },
        ],
      },
      {
        id: "s4",
        title: { en: "Recover well", es: "Recuperar bien" },
        tip: { en: "Sleep and rest matter." , es: "El sueño y el descanso importan." },
        items: [
          { id: "i1", text: { en: "Track one night of sleep", es: "Registra una noche de sueño" } },
          { id: "i2", text: { en: "Add a rest day", es: "Añade un día de descanso" } },
        ],
      },
      {
        id: "s5",
        title: { en: "Progress check", es: "Chequeo de progreso" },
        tip: { en: "Adjust based on results." , es: "Ajusta según resultados." },
        items: [
          { id: "i1", text: { en: "Compare to baseline", es: "Compara con la línea base" } },
          { id: "i2", text: { en: "Set next milestone", es: "Fija el siguiente hito" } },
        ],
      },
    ],
  },
];
