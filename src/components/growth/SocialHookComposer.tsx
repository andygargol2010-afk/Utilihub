import { useEffect, useMemo, useState } from "react";
import { type Locale } from "./SocialHookComposer.part1";
import { type PlatformId, PATTERNS, PLATFORMS, interpolate } from "./SocialHookComposer.part2";

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
