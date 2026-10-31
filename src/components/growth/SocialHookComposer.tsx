import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type Blank = {
  key: string;
  label: { en: string; es: string };
  placeholder: { en: string; es: string };
};

type Pattern = {
  id: string;
  name: { en: string; es: string };
  template: { en: string; es: string };
  blanks: Blank[];
  hashtags: string[];
  accent: string;
  example: Record<string, string>;
};

const PATTERNS: Pattern[] = [
  {
    id: "question",
    name: { en: "Question Hook", es: "Gancho de Pregunta" },
    template: { en: "What if {topic} could {benefit} without {pain}?", es: "¿Y si {topic} pudiera {benefit} sin {pain}?" },
    blanks: [
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "your product", es: "tu producto" } },
      { key: "benefit", label: { en: "Benefit", es: "Beneficio" }, placeholder: { en: "save hours", es: "ahorrar horas" } },
      { key: "pain", label: { en: "Pain", es: "Dolor" }, placeholder: { en: "the usual hassle", es: "el lío habitual" } },
    ],
    hashtags: ["#productivity", "#tips", "#growth"],
    accent: "#ec4899",
    example: { topic: "a simple template", benefit: "write hooks that stop the scroll", pain: "staring at a blank page" },
  },
  {
    id: "story",
    name: { en: "Story Hook", es: "Gancho de Historia" },
    template: { en: "I used to struggle with {problem} until I discovered {solution} that {result}.", es: "Solía luchar con {problem} hasta que descubrí {solution} que {result}." },
    blanks: [
      { key: "problem", label: { en: "Problem", es: "Problema" }, placeholder: { en: "messy notes", es: "notas desordenadas" } },
      { key: "solution", label: { en: "Solution", es: "Solución" }, placeholder: { en: "this simple method", es: "este método simple" } },
      { key: "result", label: { en: "Result", es: "Resultado" }, placeholder: { en: "changed everything", es: "lo cambió todo" } },
    ],
    hashtags: ["#story", "#motivation", "#personal"],
    accent: "#8b5cf6",
    example: { problem: "posting without a clear hook", solution: "this fill-in pattern", result: "doubled my saves in a week" },
  },
  {
    id: "list",
    name: { en: "List Hook", es: "Gancho de Lista" },
    template: { en: "{number} ways to {goal} with {topic} that most people ignore.", es: "{number} formas de {goal} con {topic} que la mayoría ignora." },
    blanks: [
      { key: "number", label: { en: "Number", es: "Número" }, placeholder: { en: "5", es: "5" } },
      { key: "goal", label: { en: "Goal", es: "Objetivo" }, placeholder: { en: "grow your audience", es: "crecer tu audiencia" } },
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "short videos", es: "videos cortos" } },
    ],
    hashtags: ["#listicle", "#tips", "#howto"],
    accent: "#06b6d4",
    example: { number: "7", goal: "get more replies", topic: "your first line" },
  },
  {
    id: "myth",
    name: { en: "Myth-bust Hook", es: "Gancho Desmitificador" },
    template: { en: "The myth about {topic} is {myth}. The truth is {truth}.", es: "El mito sobre {topic} es {myth}. La verdad es {truth}." },
    blanks: [
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "morning routines", es: "rutinas matutinas" } },
      { key: "myth", label: { en: "Myth", es: "Mito" }, placeholder: { en: "you need 2 hours", es: "necesitas 2 horas" } },
      { key: "truth", label: { en: "Truth", es: "Verdad" }, placeholder: { en: "10 minutes works", es: "10 minutos funcionan" } },
    ],
    hashtags: ["#mythbust", "#truth", "#facts"],
    accent: "#f59e0b",
    example: { topic: "viral posts", myth: "they need perfect visuals", truth: "the hook does 80% of the work" },
  },
  {
    id: "howto",
    name: { en: "How-to Hook", es: "Gancho Cómo-hacer" },
    template: { en: "How to {result} in {time} using {method}.", es: "Cómo {result} en {time} usando {method}." },
    blanks: [
      { key: "result", label: { en: "Result", es: "Resultado" }, placeholder: { en: "write better hooks", es: "escribir mejores ganchos" } },
      { key: "time", label: { en: "Timeframe", es: "Plazo" }, placeholder: { en: "10 minutes", es: "10 minutos" } },
      { key: "method", label: { en: "Method", es: "Método" }, placeholder: { en: "this template", es: "esta plantilla" } },
    ],
    hashtags: ["#howto", "#tutorial", "#quicktip"],
    accent: "#10b981",
    example: { result: "stop the scroll", time: "under 60 seconds", method: "one proven pattern" },
  },
  {
    id: "curiosity",
    name: { en: "Curiosity Gap", es: "Brecha de Curiosidad" },
    template: { en: "Most people miss this about {topic}: {insight}. Here's why it matters.", es: "La mayoría se pierde esto sobre {topic}: {insight}. Aquí por qué importa." },
    blanks: [
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "writing hooks", es: "escribir ganchos" } },
      { key: "insight", label: { en: "Insight", es: "Insight" }, placeholder: { en: "the first line decides the rest", es: "la primera línea decide el resto" } },
    ],
    hashtags: ["#curiosity", "#insight", "#growth"],
    accent: "#f43f5e",
    example: { topic: "engagement", insight: "the first 8 words decide if anyone reads the rest" },
  },
  {
    id: "statistic",
    name: { en: "Statistic Hook", es: "Gancho con Estadística" },
    template: { en: "{stat}% of people {action} but only {few} actually {outcome}.", es: "{stat}% de las personas {action} pero solo {few} realmente {outcome}." },
    blanks: [
      { key: "stat", label: { en: "Stat", es: "Estadística" }, placeholder: { en: "80", es: "80" } },
      { key: "action", label: { en: "Action", es: "Acción" }, placeholder: { en: "post regularly", es: "publican con regularidad" } },
      { key: "few", label: { en: "Few", es: "Pocos" }, placeholder: { en: "a handful", es: "unos pocos" } },
      { key: "outcome", label: { en: "Outcome", es: "Resultado" }, placeholder: { en: "get real engagement", es: "logran engagement real" } },
    ],
    hashtags: ["#stats", "#data", "#growth"],
    accent: "#3b82f6",
    example: { stat: "73", action: "post every day", few: "less than 10%", outcome: "see consistent growth" },
  },
  {
    id: "contrarian",
    name: { en: "Contrarian Hook", es: "Gancho Contrario" },
    template: { en: "Stop {common}. Start {alternative} instead. Here's why.", es: "Deja de {common}. Empieza a {alternative} en su lugar. Aquí por qué." },
    blanks: [
      { key: "common", label: { en: "Common", es: "Común" }, placeholder: { en: "posting every day", es: "publicar todos los días" } },
      { key: "alternative", label: { en: "Alternative", es: "Alternativa" }, placeholder: { en: "posting with intention", es: "publicar con intención" } },
    ],
    hashtags: ["#contrarian", "#truth", "#strategy"],
    accent: "#ef4444",
    example: { common: "chasing viral trends", alternative: "writing one clear hook that solves a real problem" },
  },
  {
    id: "beforeafter",
    name: { en: "Before / After", es: "Antes / Después" },
    template: { en: "Before: {before}. After: {after}. The only change was {change}.", es: "Antes: {before}. Después: {after}. El único cambio fue {change}." },
    blanks: [
      { key: "before", label: { en: "Before", es: "Antes" }, placeholder: { en: "crickets on every post", es: "silencio en cada post" } },
      { key: "after", label: { en: "After", es: "Después" }, placeholder: { en: "saves and replies daily", es: "guardados y respuestas a diario" } },
      { key: "change", label: { en: "Change", es: "Cambio" }, placeholder: { en: "rewriting the first line", es: "reescribir la primera línea" } },
    ],
    hashtags: ["#beforeandafter", "#results", "#growth"],
    accent: "#a855f7",
    example: { before: "0 comments on most posts", after: "people quoting my first line", change: "using a specific hook pattern" },
  },
];

const PLATFORMS = {
  x: { limit: 280, name: { en: "X / Twitter", es: "X / Twitter" } },
  linkedin: { limit: 1300, name: { en: "LinkedIn", es: "LinkedIn" } },
  instagram: { limit: 2200, name: { en: "Instagram", es: "Instagram" } },
} as const;

type PlatformId = keyof typeof PLATFORMS;

function interpolate(template: string, blanks: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => blanks[key]?.trim() || `{${key}}`);
}

export function SocialHookComposer({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [patternId, setPatternId] = useState("question");
  const [platformId, setPlatformId] = useState<PlatformId>("x");
  const [blanks, setBlanks] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const pattern = useMemo(() => PATTERNS.find((p) => p.id === patternId) || PATTERNS[0], [patternId]);
  const platform = PLATFORMS[platformId];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p && PATTERNS.some((x) => x.id === p)) {
      setPatternId(p);
    }
    const plat = params.get("plat");
    if (plat && plat in PLATFORMS) {
      setPlatformId(plat as PlatformId);
    }
    const init: Record<string, string> = {};
    PATTERNS.forEach((pat) => {
      pat.blanks.forEach((b) => {
        const v = params.get(b.key);
        if (v) init[b.key] = v;
      });
    });
    if (Object.keys(init).length) setBlanks(init);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("p", patternId);
    url.searchParams.set("plat", platformId);
    PATTERNS.forEach((pat) => {
      pat.blanks.forEach((b) => url.searchParams.delete(b.key));
    });
    pattern.blanks.forEach((b) => {
      const v = blanks[b.key]?.trim();
      if (v) url.searchParams.set(b.key, v);
    });
    window.history.replaceState({}, "", url.toString());
  }, [patternId, platformId, blanks, pattern]);

  const preview = useMemo(() => {
    const tmpl = es ? pattern.template.es : pattern.template.en;
    return interpolate(tmpl, blanks);
  }, [pattern, blanks, es]);

  const hashtags = pattern.hashtags.join(" ");
  const fullText = `${preview}\n\n${hashtags}`;
  const charCount = fullText.length;
  const overLimit = charCount > platform.limit;

  const updateBlank = (key: string, value: string) => {
    setBlanks((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setBlanks({});
  };

  const fillExample = () => {
    setBlanks({ ...pattern.example });
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const postToX = () => {
    const text = encodeURIComponent(fullText);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 540);
    ctx.fillStyle = pattern.accent;
    ctx.fillRect(0, 0, 14, 540);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillText(es ? pattern.name.es : pattern.name.en, 40, 68);
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${es ? "Para" : "For"} ${platform.name[locale]}`, 40, 92);
    ctx.font = "19px system-ui, sans-serif";
    ctx.fillStyle = "#e2e8f0";
    const words = preview.split(" ");
    let line = "";
    let y = 130;
    const maxWidth = 700;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), 40, y);
        line = word + " ";
        y += 30;
        if (y > 360) break;
      } else {
        line = test;
      }
    }
    if (line && y <= 360) ctx.fillText(line.trim(), 40, y);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "15px system-ui, sans-serif";
    ctx.fillText(hashtags, 40, Math.min(y + 46, 420));
    ctx.fillStyle = "#64748b";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText("utilihub.app", 40, 500);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "social-hook.png";
    a.click();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="text-sm font-bold">{es ? "Patrón de gancho" : "Hook pattern"}</label>
        <select
          value={patternId}
          onChange={(e) => {
            setPatternId(e.target.value);
            setBlanks({});
          }}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {PATTERNS.map((p) => (
            <option key={p.id} value={p.id}>{es ? p.name.es : p.name.en}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold">{es ? "Plataforma" : "Platform"}</label>
        <select
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value as PlatformId)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {(Object.keys(PLATFORMS) as PlatformId[]).map((id) => (
            <option key={id} value={id}>{PLATFORMS[id].name[locale]}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {pattern.blanks.map((b) => (
          <div key={b.key}>
            <label className="text-sm font-medium">{es ? b.label.es : b.label.en}</label>
            <input
              type="text"
              value={blanks[b.key] || ""}
              onChange={(e) => updateBlank(b.key, e.target.value)}
              placeholder={es ? b.placeholder.es : b.placeholder.en}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={fillExample}
          className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
        >
          {es ? "Rellenar ejemplo" : "Fill example"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
        >
          {es ? "Resetear" : "Reset"}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>{es ? "Vista previa" : "Live preview"}</span>
          <span className={overLimit ? "text-amber-500" : ""}>
            {charCount}/{platform.limit} {es ? "caracteres" : "chars"}{overLimit ? (es ? " · largo" : " · long") : ""}
          </span>
        </div>
        <p className="text-base font-medium leading-relaxed">{preview}</p>
        <p className="mt-3 text-sm text-primary">{hashtags}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyText}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          {copied ? (es ? "¡Copiado!" : "Copied!") : (es ? "Copiar texto" : "Copy text")}
        </button>
        <button
          type="button"
          onClick={postToX}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {es ? "Publicar en X" : "Post to X"}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {linkCopied ? (es ? "¡Enlace copiado!" : "Link copied!") : (es ? "Copiar enlace" : "Copy link")}
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
