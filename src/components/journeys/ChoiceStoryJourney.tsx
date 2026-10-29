import { useCallback, useEffect, useState } from "react";

type Locale = "en" | "es";

type Choice = { text: Record<Locale, string>; next: string };
type Stage = { id: string; text: Record<Locale, string>; choices: Choice[] };
type Ending = { id: string; title: Record<Locale, string>; summary: Record<Locale, string> };

const STAGES: Stage[] = [
  {
    id: "start",
    text: {
      en: "You stand at the edge of an ancient forest. Two paths open before you.",
      es: "Estás al borde de un bosque antiguo. Dos caminos se abren ante ti.",
    },
    choices: [
      { text: { en: "Take the sunlit path", es: "Tomar el camino iluminado" }, next: "sunlit" },
      { text: { en: "Enter the shadowed trail", es: "Entrar en el sendero sombrío" }, next: "shadow" },
    ],
  },
  {
    id: "sunlit",
    text: {
      en: "The path glows. A wise traveler offers guidance or a shortcut.",
      es: "El camino brilla. Un viajero sabio ofrece guía o un atajo.",
    },
    choices: [
      { text: { en: "Accept the guidance", es: "Aceptar la guía" }, next: "guide" },
      { text: { en: "Take the shortcut alone", es: "Tomar el atajo solo" }, next: "shortcut" },
    ],
  },
  {
    id: "shadow",
    text: {
      en: "Darkness deepens. You hear distant music or see a faint light.",
      es: "La oscuridad se profundiza. Oyes música lejana o ves una luz tenue.",
    },
    choices: [
      { text: { en: "Follow the music", es: "Seguir la música" }, next: "music" },
      { text: { en: "Head toward the light", es: "Ir hacia la luz" }, next: "light" },
    ],
  },
  {
    id: "guide",
    text: {
      en: "The traveler shares old maps. You learn secrets of the land.",
      es: "El viajero comparte mapas antiguos. Aprendes secretos de la tierra.",
    },
    choices: [{ text: { en: "Continue to the clearing", es: "Continuar al claro" }, next: "end-discovery" }],
  },
  {
    id: "shortcut",
    text: {
      en: "The shortcut is rough but fast. You reach a crossroads quickly.",
      es: "El atajo es áspero pero rápido. Llegas pronto a un cruce.",
    },
    choices: [{ text: { en: "Press onward", es: "Seguir adelante" }, next: "end-return" }],
  },
  {
    id: "music",
    text: {
      en: "The music leads to a hidden grove of glowing flowers.",
      es: "La música lleva a un claro oculto de flores brillantes.",
    },
    choices: [{ text: { en: "Rest and listen", es: "Descansar y escuchar" }, next: "end-mystery" }],
  },
  {
    id: "light",
    text: {
      en: "The light is a lantern left by someone who came before.",
      es: "La luz es un farol dejado por alguien que vino antes.",
    },
    choices: [{ text: { en: "Take the lantern", es: "Tomar el farol" }, next: "end-discovery" }],
  },
];

const ENDINGS: Record<string, Ending> = {
  "end-discovery": {
    id: "end-discovery",
    title: { en: "Discovery", es: "Descubrimiento" },
    summary: {
      en: "You uncover ancient knowledge and leave with new purpose.",
      es: "Descubres conocimiento antiguo y partes con un nuevo propósito.",
    },
  },
  "end-return": {
    id: "end-return",
    title: { en: "Return Home", es: "Regreso a Casa" },
    summary: {
      en: "The journey was short but memorable. You return wiser.",
      es: "El viaje fue corto pero memorable. Regresas más sabio.",
    },
  },
  "end-mystery": {
    id: "end-mystery",
    title: { en: "Mystery", es: "Misterio" },
    summary: {
      en: "The grove holds secrets still. You stay to unravel them.",
      es: "El claro guarda secretos aún. Te quedas para desentrañarlos.",
    },
  },
};

function encodePath(ids: string[]): string {
  return ids.join(">");
}

function decodePath(s: string | null): string[] {
  if (!s) return ["start"];
  return s.split(">").filter(Boolean);
}

export function ChoiceStoryJourney({ locale }: { locale: Locale }) {
  const [path, setPath] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["start"];
    const params = new URLSearchParams(window.location.search);
    return decodePath(params.get("path"));
  });
  const [copied, setCopied] = useState(false);

  const currentId = path[path.length - 1];
  const isEnding = currentId.startsWith("end-");
  const stage = STAGES.find((s) => s.id === currentId);
  const ending = isEnding ? ENDINGS[currentId] : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("path", encodePath(path));
    window.history.replaceState({}, "", url.toString());
  }, [path]);

  const choose = useCallback((next: string) => {
    setPath((prev) => [...prev, next]);
  }, []);

  const reset = () => setPath(["start"]);

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const sharePng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(1, "#1e293b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 36px system-ui, sans-serif";
    const title = ending ? ending.title[locale] : "Choice Story Journey";
    ctx.fillText(title, 40, 90);
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    const sum = ending ? ending.summary[locale] : "Journey in progress";
    const words = sum.split(" ");
    let line = "";
    let y = 150;
    for (const w of words) {
      const test = line + w + " ";
      if (ctx.measureText(test).width > 700) {
        ctx.fillText(line, 40, y);
        line = w + " ";
        y += 28;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, 40, y);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`utilihub.com · ${path.slice(0, -1).join(" → ")}`, 40, 430);
    ctx.fillText("Share your choice path", 40, 460);
    const link = document.createElement("a");
    link.download = "choice-story-ending.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const progress = Math.min(path.length, 5);
  const stepLabels = locale === "es" 
    ? ["Inicio", "Elección 1", "Elección 2", "Elección 3", "Final"]
    : ["Start", "Choice 1", "Choice 2", "Choice 3", "Ending"];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex gap-1" role="progressbar" aria-valuenow={progress} aria-valuemin={1} aria-valuemax={5}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className={`h-2 rounded ${
                i < progress ? "bg-primary" : "bg-muted"
              }`}
            />
            <span className="mt-1 block text-[10px] text-muted-foreground">{stepLabels[i]}</span>
          </div>
        ))}
      </div>
      {stage && !isEnding && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-lg font-medium">{stage.text[locale]}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {stage.choices.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => choose(c.next)}
                className="min-h-11 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
                aria-label={c.text[locale]}
              >
                {c.text[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
      {ending && (
        <div className="rounded-2xl border border-primary/30 bg-accent/40 p-5 text-center">
          <h2 className="text-2xl font-black">{ending.title[locale]}</h2>
          <p className="mt-2 text-muted-foreground">{ending.summary[locale]}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {locale === "es" ? "Camino" : "Path"}: {path.slice(0, -1).join(" → ")}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={sharePng}
              className="min-h-11 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              {locale === "es" ? "Compartir PNG" : "Share PNG"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="min-h-11 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold"
            >
              {copied
                ? locale === "es" ? "¡Copiado!" : "Copied!"
                : locale === "es" ? "Copiar enlace" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold"
            >
              {locale === "es" ? "Empezar de nuevo" : "Start over"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
