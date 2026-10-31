import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type StyleId = "minimal" | "bold" | "accent";

const STYLES: { id: StyleId; name: { en: string; es: string } }[] = [
  { id: "minimal", name: { en: "Minimal", es: "Minimal" } },
  { id: "bold", name: { en: "Bold", es: "Negrita" } },
  { id: "accent", name: { en: "Accent", es: "Acento" } },
];

const BACKGROUNDS = [
  { id: "slate", label: { en: "Slate", es: "Pizarra" }, css: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", solid: "#0f172a" },
  { id: "indigo", label: { en: "Indigo", es: "Índigo" }, css: "linear-gradient(135deg, #312e81 0%, #4c1d95 100%)", solid: "#312e81" },
  { id: "rose", label: { en: "Rose", es: "Rosa" }, css: "linear-gradient(135deg, #881337 0%, #9f1239 100%)", solid: "#881337" },
  { id: "emerald", label: { en: "Emerald", es: "Esmeralda" }, css: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)", solid: "#064e3b" },
  { id: "amber", label: { en: "Amber", es: "Ámbar" }, css: "linear-gradient(135deg, #78350f 0%, #92400e 100%)", solid: "#78350f" },
  { id: "white", label: { en: "White", es: "Blanco" }, css: "#ffffff", solid: "#ffffff" },
] as const;

type BgId = (typeof BACKGROUNDS)[number]["id"];

const EXAMPLES = [
  {
    q: { en: "The only way to do great work is to love what you do.", es: "La única forma de hacer un gran trabajo es amar lo que haces." },
    a: { en: "Steve Jobs", es: "Steve Jobs" },
  },
  {
    q: { en: "Be yourself; everyone else is already taken.", es: "Sé tú mismo; todos los demás ya están ocupados." },
    a: { en: "Oscar Wilde", es: "Oscar Wilde" },
  },
  {
    q: { en: "In the middle of difficulty lies opportunity.", es: "En medio de la dificultad yace la oportunidad." },
    a: { en: "Albert Einstein", es: "Albert Einstein" },
  },
];

export function QuoteCardMaker({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [styleId, setStyleId] = useState<StyleId>("minimal");
  const [bgId, setBgId] = useState<BgId>("slate");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [imgCopied, setImgCopied] = useState(false);

  const bg = useMemo(() => BACKGROUNDS.find((b) => b.id === bgId) || BACKGROUNDS[0], [bgId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuote(decodeURIComponent(q));
    const a = params.get("a");
    if (a) setAuthor(decodeURIComponent(a));
    const s = params.get("s") as StyleId | null;
    if (s && STYLES.some((x) => x.id === s)) setStyleId(s);
    const bgParam = params.get("bg") as BgId | null;
    if (bgParam && BACKGROUNDS.some((b) => b.id === bgParam)) setBgId(bgParam);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (quote.trim()) url.searchParams.set("q", encodeURIComponent(quote.trim()));
    else url.searchParams.delete("q");
    if (author.trim()) url.searchParams.set("a", encodeURIComponent(author.trim()));
    else url.searchParams.delete("a");
    url.searchParams.set("s", styleId);
    url.searchParams.set("bg", bgId);
    window.history.replaceState({}, "", url.toString());
  }, [quote, author, styleId, bgId]);

  const displayQuote = quote.trim() || (es ? "Tu cita aquí…" : "Your quote here…");
  const displayAuthor = author.trim() ? `— ${author.trim()}` : "";
  const charCount = quote.trim().length;
  const tooLong = charCount > 180;

  const loadExample = (idx: number) => {
    const ex = EXAMPLES[idx];
    setQuote(es ? ex.q.es : ex.q.en);
    setAuthor(es ? ex.a.es : ex.a.en);
  };

  const reset = () => {
    setQuote("");
    setAuthor("");
    setStyleId("minimal");
    setBgId("slate");
  };

  const copyText = async () => {
    const text = displayAuthor ? `"${displayQuote}" ${displayAuthor}` : `"${displayQuote}"`;
    try {
      await navigator.clipboard.writeText(text);
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
    const text = encodeURIComponent(displayAuthor ? `"${displayQuote}" ${displayAuthor}` : `"${displayQuote}"`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const generateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    if (bg.css.startsWith("linear-gradient")) {
      const grd = ctx.createLinearGradient(0, 0, 800, 500);
      if (bg.id === "slate") {
        grd.addColorStop(0, "#0f172a");
        grd.addColorStop(1, "#1e293b");
      } else if (bg.id === "indigo") {
        grd.addColorStop(0, "#312e81");
        grd.addColorStop(1, "#4c1d95");
      } else if (bg.id === "rose") {
        grd.addColorStop(0, "#881337");
        grd.addColorStop(1, "#9f1239");
      } else if (bg.id === "emerald") {
        grd.addColorStop(0, "#064e3b");
        grd.addColorStop(1, "#065f46");
      } else if (bg.id === "amber") {
        grd.addColorStop(0, "#78350f");
        grd.addColorStop(1, "#92400e");
      }
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = bg.solid;
    }
    ctx.fillRect(0, 0, 800, 500);

    // Style treatments
    const isLight = bg.id === "white";
    if (styleId === "accent") {
      ctx.fillStyle = "#ec4899";
      ctx.fillRect(0, 0, 16, 500);
    } else if (styleId === "bold") {
      // subtle inner glow / border
      ctx.strokeStyle = isLight ? "#e2e8f0" : "rgba(255,255,255,0.15)";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 760, 460);
    } else {
      // minimal: thin border
      ctx.strokeStyle = isLight ? "#cbd5e1" : "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, 776, 476);
    }

    // Quote text — improved wrapping & sizing matched to style
    ctx.fillStyle = isLight ? "#0f172a" : "#f8fafc";
    const baseSize = styleId === "bold" ? 36 : styleId === "accent" ? 30 : 28;
    const weight = styleId === "bold" ? "700 " : "500 ";
    ctx.font = `${weight}${baseSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    const words = displayQuote.split(/\s+/);
    let line = "";
    const lines: string[] = [];
    const maxWidth = styleId === "accent" ? 640 : 660;
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const lineHeight = baseSize * 1.3;
    const totalTextH = Math.min(lines.length, 6) * lineHeight;
    const startY = 230 - totalTextH / 2 + baseSize * 0.65;
    lines.slice(0, 6).forEach((ln, i) => {
      ctx.fillText(ln, 400, startY + i * lineHeight);
    });

    // Author
    if (displayAuthor) {
      ctx.font = `italic ${styleId === "bold" ? 24 : 20}px system-ui, sans-serif`;
      ctx.fillStyle = isLight ? "#475569" : "#cbd5e1";
      ctx.fillText(displayAuthor, 400, startY + Math.min(lines.length, 6) * lineHeight + 32);
    }

    // Watermark
    ctx.fillStyle = isLight ? "#94a3b8" : "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("utilihub.app", 760, 470);

    return canvas;
  };

  const downloadPng = () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "quote-card.png";
    a.click();
  };

  const copyImage = async () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setImgCopied(true);
        setTimeout(() => setImgCopied(false), 2000);
      }, "image/png");
    } catch {
      /* fallback or ignore */
    }
  };

  const previewStyle: React.CSSProperties = {
    background: bg.css,
    color: bg.id === "white" ? "#0f172a" : "#f8fafc",
    borderLeft: styleId === "accent" ? "8px solid #ec4899" : undefined,
    border: styleId === "minimal" ? (bg.id === "white" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.12)") : styleId === "bold" ? (bg.id === "white" ? "3px solid #e2e8f0" : "3px solid rgba(255,255,255,0.2)") : undefined,
    fontWeight: styleId === "bold" ? 700 : 500,
    fontSize: styleId === "bold" ? "1.25rem" : styleId === "accent" ? "1.15rem" : "1.05rem",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">{es ? "Cita" : "Quote"}</label>
          <span className={`text-xs ${tooLong ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
            {charCount} {es ? "caracteres" : "chars"}{tooLong ? (es ? " (puede recortarse)" : " (may crop)") : ""}
          </span>
        </div>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder={es ? "Escribe o pega tu cita…" : "Write or paste your quote…"}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-muted-foreground self-center">{es ? "Ejemplos:" : "Examples:"}</span>
        {EXAMPLES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => loadExample(i)}
            className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
          >
            {es ? `Ej. ${i + 1}` : `Ex. ${i + 1}`}
          </button>
        ))}
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted ml-auto"
        >
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div>
        <label className="text-sm font-bold">{es ? "Autor (opcional)" : "Author (optional)"}</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={es ? "Nombre del autor" : "Author name"}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">{es ? "Estilo" : "Style"}</label>
          <select
            value={styleId}
            onChange={(e) => setStyleId(e.target.value as StyleId)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {STYLES.map((s) => (
              <option key={s.id} value={s.id}>{es ? s.name.es : s.name.en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold">{es ? "Fondo" : "Background"}</label>
          <select
            value={bgId}
            onChange={(e) => setBgId(e.target.value as BgId)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {BACKGROUNDS.map((b) => (
              <option key={b.id} value={b.id}>{es ? b.label.es : b.label.en}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="relative mx-auto flex min-h-[220px] w-full max-w-md flex-col items-center justify-center rounded-2xl p-6 text-center shadow-lg sm:min-h-[260px]"
        style={previewStyle}
      >
        <p className="leading-snug">
          “{displayQuote}”
        </p>
        {displayAuthor && (
          <p className="mt-4 text-sm italic opacity-80">{displayAuthor}</p>
        )}
        <span className="absolute bottom-3 right-4 text-xs opacity-50">utilihub.app</span>
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
          onClick={copyImage}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {imgCopied ? (es ? "¡Imagen copiada!" : "Image copied!") : (es ? "Copiar imagen" : "Copy image")}
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
