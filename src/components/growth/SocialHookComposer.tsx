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
  },
];

function interpolate(template: string, blanks: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => blanks[key]?.trim() || `{${key}}`);
}

export function SocialHookComposer({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [patternId, setPatternId] = useState("question");
  const [blanks, setBlanks] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const pattern = useMemo(() => PATTERNS.find((p) => p.id === patternId) || PATTERNS[0], [patternId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p && PATTERNS.some((x) => x.id === p)) {
      setPatternId(p);
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
    // clear previous blank keys
    PATTERNS.forEach((pat) => {
      pat.blanks.forEach((b) => url.searchParams.delete(b.key));
    });
    pattern.blanks.forEach((b) => {
      const v = blanks[b.key]?.trim();
      if (v) url.searchParams.set(b.key, v);
    });
    window.history.replaceState({}, "", url.toString());
  }, [patternId, blanks, pattern]);

  const preview = useMemo(() => {
    const tmpl = es ? pattern.template.es : pattern.template.en;
    return interpolate(tmpl, blanks);
  }, [pattern, blanks, es]);

  const hashtags = pattern.hashtags.join(" ");

  const updateBlank = (key: string, value: string) => {
    setBlanks((prev) => ({ ...prev, [key]: value }));
  };

  const copyText = async () => {
    const text = `${preview}\n\n${hashtags}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 520;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 520);
    ctx.fillStyle = "#ec4899";
    ctx.fillRect(0, 0, 12, 520);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.fillText(es ? "Gancho Social" : "Social Hook", 40, 70);
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#e2e8f0";
    const words = preview.split(" ");
    let line = "";
    let y = 130;
    const maxWidth = 720;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), 40, y);
        line = word + " ";
        y += 32;
        if (y > 380) break;
      } else {
        line = test;
      }
    }
    if (line && y <= 380) ctx.fillText(line.trim(), 40, y);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(hashtags, 40, Math.min(y + 50, 430));
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("utilihub.app", 40, 490);
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

      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {es ? "Vista previa" : "Live preview"}
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
          onClick={downloadPng}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
