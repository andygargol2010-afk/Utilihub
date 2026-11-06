import { useState, useMemo, useEffect, useCallback, useRef } from "react";

type Locale = "en" | "es";

type TypeKey = "circuit" | "strategy" | "simulator" | "creator";

interface TypeInfo {
  name: Record<Locale, string>;
  desc: Record<Locale, string>;
  recs: { slug: string; name: Record<Locale, string> }[];
}

const TYPES: Record<TypeKey, TypeInfo> = {
  circuit: {
    name: { en: "Circuit Builder", es: "Constructor de Circuitos" },
    desc: {
      en: "You love assembling discrete parts and seeing cause-and-effect light up. Precision and experimentation are your style.",
      es: "Te encanta ensamblar partes discretas y ver la causa-efecto iluminarse. Precisión y experimentación son tu estilo.",
    },
    recs: [
      { slug: "/kits/simple-circuit-kit", name: { en: "Simple Circuit Kit", es: "Kit de Circuito Simple" } },
      { slug: "/playgrounds/n-body-gravity", name: { en: "N-Body Gravity", es: "Gravedad N-Cuerpos" } },
    ],
  },
  strategy: {
    name: { en: "Strategy Master", es: "Maestro de Estrategia" },
    desc: {
      en: "Planning ahead, reading the board, and outthinking opponents is where you shine. Classic games are your playground.",
      es: "Planificar por adelantado, leer el tablero y superar al oponente es donde brillas. Los juegos clásicos son tu patio.",
    },
    recs: [
      { slug: "/games/battleship-classic", name: { en: "Battleship Classic", es: "Batalla Naval Clásica" } },
      { slug: "/games/checkers-classic", name: { en: "Checkers Classic", es: "Damas Clásicas" } },
    ],
  },
  simulator: {
    name: { en: "Simulator Fan", es: "Fan de Simuladores" },
    desc: {
      en: "You enjoy tweaking parameters and watching systems evolve. Models, charts, and what-if scenarios fascinate you.",
      es: "Disfrutas ajustando parámetros y viendo sistemas evolucionar. Modelos, gráficos y escenarios hipotéticos te fascinan.",
    },
    recs: [
      { slug: "/simulators/population-dynamics-simulator", name: { en: "Population Dynamics", es: "Dinámica de Población" } },
      { slug: "/playgrounds/orbit-pulse-catcher", name: { en: "Orbit Pulse Catcher", es: "Cazador de Pulsos Orbitales" } },
    ],
  },
  creator: {
    name: { en: "Creative Maker", es: "Creador Creativo" },
    desc: {
      en: "Designing, folding, composing, and sharing visual results is your jam. You turn ideas into shareable artifacts.",
      es: "Diseñar, doblar, componer y compartir resultados visuales es lo tuyo. Conviertes ideas en artefactos compartibles.",
    },
    recs: [
      { slug: "/kits/paper-airplane-kit", name: { en: "Paper Airplane Kit", es: "Kit de Avión de Papel" } },
      { slug: "/aura-card", name: { en: "Aura Card", es: "Tarjeta de Aura" } },
    ],
  },
};

interface Question {
  text: Record<Locale, string>;
  options: { label: Record<Locale, string>; scores: Partial<Record<TypeKey, number>> }[];
}

const QUESTIONS: Question[] = [
  {
    text: { en: "What sounds more fun right now?", es: "¿Qué suena más divertido ahora?" },
    options: [
      { label: { en: "Building a working circuit", es: "Construir un circuito funcional" }, scores: { circuit: 2 } },
      { label: { en: "Outsmarting an opponent in a board game", es: "Superar a un oponente en un juego de mesa" }, scores: { strategy: 2 } },
      { label: { en: "Watching a population grow on a chart", es: "Ver una población crecer en un gráfico" }, scores: { simulator: 2 } },
      { label: { en: "Designing a paper airplane that flies far", es: "Diseñar un avión de papel que vuele lejos" }, scores: { creator: 2 } },
    ],
  },
  {
    text: { en: "Your ideal weekend project is...", es: "Tu proyecto ideal de fin de semana es..." },
    options: [
      { label: { en: "Following a multi-step assembly guide", es: "Seguir una guía de ensamblaje de varios pasos" }, scores: { circuit: 1, creator: 1 } },
      { label: { en: "Perfecting a winning strategy", es: "Perfeccionar una estrategia ganadora" }, scores: { strategy: 2 } },
      { label: { en: "Tweaking numbers until the model stabilizes", es: "Ajustar números hasta que el modelo se estabilice" }, scores: { simulator: 2 } },
      { label: { en: "Making something shareable and pretty", es: "Hacer algo compartible y bonito" }, scores: { creator: 2 } },
    ],
  },
  {
    text: { en: "When learning something new, you prefer...", es: "Cuando aprendes algo nuevo, prefieres..." },
    options: [
      { label: { en: "Hands-on parts and immediate feedback", es: "Partes prácticas y feedback inmediato" }, scores: { circuit: 2 } },
      { label: { en: "Rules, levels, and clear win conditions", es: "Reglas, niveles y condiciones claras de victoria" }, scores: { strategy: 2 } },
      { label: { en: "Parameters, charts, and cause-effect", es: "Parámetros, gráficos y causa-efecto" }, scores: { simulator: 2 } },
      { label: { en: "Visual results you can show others", es: "Resultados visuales que puedes mostrar a otros" }, scores: { creator: 2 } },
    ],
  },
  {
    text: { en: "Which UtiliHub experience would you open first?", es: "¿Qué experiencia de UtiliHub abrirías primero?" },
    options: [
      { label: { en: "A guided kit with discrete components", es: "Un kit guiado con componentes discretos" }, scores: { circuit: 2 } },
      { label: { en: "A classic turn-based grid game", es: "Un juego de cuadrícula por turnos clásico" }, scores: { strategy: 2 } },
      { label: { en: "A live model with adjustable rates", es: "Un modelo en vivo con tasas ajustables" }, scores: { simulator: 2 } },
      { label: { en: "A composer that exports a branded card", es: "Un compositor que exporta una tarjeta de marca" }, scores: { creator: 2 } },
    ],
  },
  {
    text: { en: "Your friends would describe you as...", es: "Tus amigos te describirían como..." },
    options: [
      { label: { en: "The one who figures out how things work", es: "El que descubre cómo funcionan las cosas" }, scores: { circuit: 1, simulator: 1 } },
      { label: { en: "The strategic thinker who plans three moves ahead", es: "El pensador estratégico que planea tres movimientos" }, scores: { strategy: 2 } },
      { label: { en: "The curious one who loves simulations", es: "El curioso que ama las simulaciones" }, scores: { simulator: 2 } },
      { label: { en: "The maker who always has a new design", es: "El hacedor que siempre tiene un nuevo diseño" }, scores: { creator: 2 } },
    ],
  },
  {
    text: { en: "What would you rather share?", es: "¿Qué preferirías compartir?" },
    options: [
      { label: { en: "A photo of a working LED circuit", es: "Una foto de un circuito LED funcionando" }, scores: { circuit: 2 } },
      { label: { en: "A winning board position", es: "Una posición de tablero ganadora" }, scores: { strategy: 2 } },
      { label: { en: "A chart of an interesting population curve", es: "Un gráfico de una curva de población interesante" }, scores: { simulator: 2 } },
      { label: { en: "A custom designed shareable card", es: "Una tarjeta personalizada compartible" }, scores: { creator: 2 } },
    ],
  },
  {
    text: { en: "Preferred interaction style?", es: "¿Estilo de interacción preferido?" },
    options: [
      { label: { en: "Place parts, connect, test", es: "Colocar partes, conectar, probar" }, scores: { circuit: 2 } },
      { label: { en: "Select, move, capture, win", es: "Seleccionar, mover, capturar, ganar" }, scores: { strategy: 2 } },
      { label: { en: "Adjust sliders, watch the system respond", es: "Ajustar deslizadores, ver responder el sistema" }, scores: { simulator: 2 } },
      { label: { en: "Choose options, preview, export", es: "Elegir opciones, previsualizar, exportar" }, scores: { creator: 2 } },
    ],
  },
  {
    text: { en: "Which outcome feels most satisfying?", es: "¿Qué resultado se siente más satisfactorio?" },
    options: [
      { label: { en: "The LED lights up exactly as predicted", es: "El LED se enciende exactamente como se predijo" }, scores: { circuit: 2 } },
      { label: { en: "You force a win with a clever sequence", es: "Forzas una victoria con una secuencia inteligente" }, scores: { strategy: 2 } },
      { label: { en: "The model reaches equilibrium after your tweaks", es: "El modelo alcanza el equilibrio después de tus ajustes" }, scores: { simulator: 2 } },
      { label: { en: "Someone asks how you made that cool result", es: "Alguien pregunta cómo hiciste ese resultado genial" }, scores: { creator: 2 } },
    ],
  },
];

function getTypeFromUrl(): TypeKey | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const t = params.get("type") as TypeKey | null;
  return t && t in TYPES ? t : null;
}

export function UtiliTypeQuiz({ locale = "en" }: { locale?: Locale }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<TypeKey, number>>({ circuit: 0, strategy: 0, simulator: 0, creator: 0 });
  const [done, setDone] = useState(false);
  const [forcedType, setForcedType] = useState<TypeKey | null>(null);
  const [copied, setCopied] = useState(false);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const total = QUESTIONS.length;
  const progress = done ? 100 : Math.round((step / total) * 100);

  useEffect(() => {
    const fromUrl = getTypeFromUrl();
    if (fromUrl) {
      setForcedType(fromUrl);
      setDone(true);
    }
  }, []);

  useEffect(() => {
    if (!done && optionRefs.current[0]) {
      optionRefs.current[0]?.focus();
    }
  }, [step, done]);

  const bestKey = useMemo((): TypeKey => {
    if (forcedType) return forcedType;
    let best: TypeKey = "circuit";
    let max = -1;
    (Object.keys(scores) as TypeKey[]).forEach((k) => {
      if (scores[k] > max) {
        max = scores[k];
        best = k;
      }
    });
    return best;
  }, [done, scores, forcedType]);

  const result = done ? TYPES[bestKey] : null;

  const shareUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("type", bestKey);
    return url.toString();
  }, [bestKey]);

  const onAnswer = (optScores: Partial<Record<TypeKey, number>>) => {
    setScores((prev) => {
      const next = { ...prev };
      (Object.keys(optScores) as TypeKey[]).forEach((k) => {
        next[k] = (next[k] || 0) + (optScores[k] || 0);
      });
      return next;
    });
    if (step + 1 >= total) {
      setDone(true);
      setForcedType(null);
    } else {
      setStep((s) => s + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setScores({ circuit: 0, strategy: 0, simulator: 0, creator: 0 });
    setDone(false);
    setForcedType(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("type");
    window.history.replaceState(null, "", url);
  };

  const copyShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [shareUrl]);

  const exportPng = useCallback(() => {
    if (!result) return;
    const w = 800;
    const h = 600;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    // Accent bar
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(0, 0, w, 8);

    // Header
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(locale === "es" ? "Tu Tipo Utili" : "Your Utili Type", w / 2, 60);

    // Type name
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 42px system-ui, sans-serif";
    ctx.fillText(result.name[locale], w / 2, 120);

    // Description
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px system-ui, sans-serif";
    const desc = result.desc[locale];
    const words = desc.split(" ");
    let line = "";
    let y = 180;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > 700) {
        ctx.fillText(line, w / 2, y);
        line = word + " ";
        y += 28;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, w / 2, y);

    // Recs
    y += 50;
    ctx.fillStyle = "#06b6d4";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillText(locale === "es" ? "Recomendado para ti" : "Recommended for you", w / 2, y);

    y += 40;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "18px system-ui, sans-serif";
    result.recs.forEach((r) => {
      ctx.fillText("→ " + r.name[locale], w / 2, y);
      y += 32;
    });

    // Footer
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("UtiliHub · utili-type-quiz", w / 2, h - 40);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-type-${bestKey}.png`;
    a.click();
  }, [result, locale, bestKey]);

  const t = (en: string, es: string) => (locale === "es" ? es : en);

  if (done && result) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div role="region" aria-live="polite" aria-label={t("Quiz result", "Resultado del quiz")} className="rounded-2xl border bg-card p-6 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">{t("Your Utili Type", "Tu Tipo Utili")}</p>
          <h2 className="mt-2 text-3xl font-black">{result.name[locale]}</h2>
          <p className="mt-3 text-muted-foreground">{result.desc[locale]}</p>
          <div className="mt-6 space-y-2 text-left">
            <p className="text-sm font-semibold">{t("Recommended for you", "Recomendado para ti")}</p>
            {result.recs.map((r) => (
              <a key={r.slug} href={r.slug} className="block rounded-lg bg-muted/50 px-3 py-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                → {r.name[locale]}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={restart} className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
            {t("Take again", "Hacer de nuevo")}
          </button>
          <button type="button" onClick={copyShare} className="flex-1 rounded-xl border px-4 py-3 font-semibold min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
            {copied ? t("Copied!", "¡Copiado!") : t("Copy share link", "Copiar enlace")}
          </button>
          <button type="button" onClick={exportPng} className="flex-1 rounded-xl border px-4 py-3 font-semibold min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
            {t("Download PNG", "Descargar PNG")}
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {t("Share your type with the link or image.", "Comparte tu tipo con el enlace o la imagen.")}
        </p>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-sm text-muted-foreground">
          <span>{t("Question", "Pregunta")} {step + 1} / {total}</span>
          <span>{progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("Quiz progress", "Progreso del quiz")}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full bg-cyan-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold">{q.text[locale]}</h2>
        <div className="mt-6 space-y-3" role="group" aria-label={t("Answer options", "Opciones de respuesta")}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              onClick={() => onAnswer(opt.scores)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const next = optionRefs.current[(i + 1) % q.options.length];
                  next?.focus();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  const prev = optionRefs.current[(i - 1 + q.options.length) % q.options.length];
                  prev?.focus();
                }
              }}
              className="w-full rounded-xl border bg-background px-4 py-4 text-left text-base font-medium transition hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label={opt.label[locale]}
            >
              {opt.label[locale]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
