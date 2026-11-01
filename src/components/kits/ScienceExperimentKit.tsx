import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type AgeGroup = "young" | "elem" | "older";

type Theme = {
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

const AGE_GROUPS: { id: AgeGroup; nameEn: string; nameEs: string }[] = [
  { id: "young", nameEn: "Young kids (5-7)", nameEs: "Niños pequeños (5-7)" },
  { id: "elem", nameEn: "Elementary (8-11)", nameEs: "Primaria (8-11)" },
  { id: "older", nameEn: "Older kids (12+)", nameEs: "Mayores (12+)" },
];

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

export function ScienceExperimentKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [age, setAge] = useState<AgeGroup>("elem");
  const [checked, setChecked] = useState<boolean[]>([]);
  const [copied, setCopied] = useState(false);

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const steps = es ? theme.stepsEs : theme.stepsEn;
  const materials = es ? theme.materialsEs : theme.materialsEn;
  const safety = es ? theme.safetyEs[age] : theme.safetyEn[age];
  const ageLabel = AGE_GROUPS.find((a) => a.id === age);
  const themeName = es ? theme.nameEs : theme.nameEn;

  useEffect(() => {
    setChecked(new Array(steps.length).fill(false));
  }, [themeId, steps.length]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("theme");
    const a = params.get("age") as AgeGroup | null;
    if (t && THEMES.some((th) => th.id === t)) setThemeId(t);
    if (a && AGE_GROUPS.some((ag) => ag.id === a)) setAge(a);
  }, []);

  const updateUrl = (newTheme?: string, newAge?: AgeGroup) => {
    const params = new URLSearchParams(window.location.search);
    if (newTheme) params.set("theme", newTheme);
    if (newAge) params.set("age", newAge);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

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
    updateUrl(id, undefined);
  };

  const selectAge = (id: AgeGroup) => {
    setAge(id);
    updateUrl(undefined, id);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const sharePng = () => {
    const lineH = 20;
    const headerH = 140;
    const matH = materials.length * lineH + 40;
    const stepsH = steps.length * lineH + 50;
    const safetyH = Math.min(safety.length, 3) * lineH + 40;
    const totalH = Math.max(720, headerH + matH + stepsH + safetyH + 60);
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, totalH);
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(0, 0, 8, totalH);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.fillText(themeName, 40, 60);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(
      `${es ? "Kit de experimento de ciencia" : "Science Experiment Kit"} · ${ageLabel ? (es ? ageLabel.nameEs : ageLabel.nameEn) : ""}`,
      40,
      90,
    );
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(`${es ? "Progreso" : "Progress"}: ${progress.pct}% (${progress.done}/${progress.total})`, 40, 130);
    let y = 170;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(es ? "Materiales" : "Materials", 40, y);
    y += 28;
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    materials.forEach((m) => {
      ctx.fillText(`• ${m}`, 40, y);
      y += lineH;
    });
    y += 16;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(es ? "Pasos" : "Steps", 40, y);
    y += 28;
    ctx.font = "14px system-ui, sans-serif";
    steps.forEach((step, i) => {
      const mark = checked[i] ? "✓" : "○";
      ctx.fillStyle = checked[i] ? "#22c55e" : "#cbd5e1";
      ctx.fillText(`${mark} ${i + 1}. ${step}`, 40, y);
      y += lineH;
    });
    y += 16;
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(es ? "Seguridad" : "Safety", 40, y);
    y += 28;
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#fcd34d";
    safety.slice(0, 3).forEach((s) => {
      ctx.fillText(`• ${s}`, 40, y);
      y += lineH;
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("utilihub.com", 40, totalH - 24);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `science-experiment-${themeId}.png`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
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
        <div>
          <label className="text-sm font-bold">{es ? "Grupo de edad" : "Age group"}</label>
          <select
            value={age}
            onChange={(e) => selectAge(e.target.value as AgeGroup)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {AGE_GROUPS.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {es ? ag.nameEs : ag.nameEn}
              </option>
            ))}
          </select>
        </div>
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

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <h2 className="font-bold text-lg text-amber-800 dark:text-amber-200">{es ? "Consejos de seguridad" : "Safety tips"}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-100">
          {safety.map((s, i) => (
            <li key={i}>{s}</li>
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

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium"
        >
          {copied ? (es ? "¡Enlace copiado!" : "Link copied!") : es ? "Copiar enlace" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={sharePng}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {es ? "Descargar PNG del plan" : "Download plan PNG"}
        </button>
      </div>
    </div>
  );
}
