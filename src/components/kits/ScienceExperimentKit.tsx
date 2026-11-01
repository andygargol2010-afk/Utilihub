import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type Theme = {
  id: string;
  nameEn: string;
  nameEs: string;
  materialsEn: string[];
  materialsEs: string[];
  stepsEn: string[];
  stepsEs: string[];
  timeMin: number;
};

const THEMES: Theme[] = [
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
  },
];

export function ScienceExperimentKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [checked, setChecked] = useState<boolean[]>([]);

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const steps = es ? theme.stepsEs : theme.stepsEn;
  const materials = es ? theme.materialsEs : theme.materialsEn;

  useEffect(() => {
    setChecked(new Array(steps.length).fill(false));
  }, [themeId, steps.length]);

  const progress = useMemo(() => {
    const done = checked.filter(Boolean).length;
    return { done, total: steps.length, pct: steps.length ? Math.round((done / steps.length) * 100) : 0 };
  }, [checked, steps.length]);

  const toggleStep = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const selectTheme = (id: string) => {
    setThemeId(id);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="text-sm font-bold">{es ? "Tema del experimento" : "Experiment theme"}</label>
        <select
          value={themeId}
          onChange={(e) => selectTheme(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {es ? t.nameEs : t.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{es ? "Progreso" : "Progress"}</span>
          <span className="text-muted-foreground">
            {progress.done}/{progress.total} · {progress.pct}% · ~{theme.timeMin} {es ? "min" : "min"}
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${progress.pct}%` }} />
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg">{es ? "Materiales" : "Materials"}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {materials.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-lg">{es ? "Pasos guiados" : "Guided steps"}</h2>
        <div className="mt-3 space-y-3">
          {steps.map((step, i) => (
            <label key={i} className="flex items-start gap-3 rounded-xl border border-border p-3 cursor-pointer hover:bg-accent/50">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggleStep(i)}
                className="mt-1 size-4"
              />
              <span className={checked[i] ? "line-through text-muted-foreground" : ""}>
                <span className="font-medium">{i + 1}. </span>
                {step}
              </span>
            </label>
          ))}
        </div>
      </div>

      {progress.pct === 100 && (
        <div className="rounded-xl bg-primary/10 p-4 text-center font-bold text-primary">
          {es ? "¡Experimento completado!" : "Experiment complete!"}
        </div>
      )}
    </div>
  );
}
