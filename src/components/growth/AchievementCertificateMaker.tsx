import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";
type TemplateId = "classic" | "modern" | "playful";
type ColorId = "navy" | "gold" | "emerald" | "rose" | "slate";

const TEMPLATES: { id: TemplateId; name: { en: string; es: string } }[] = [
  { id: "classic", name: { en: "Classic Diploma", es: "Diploma Clásico" } },
  { id: "modern", name: { en: "Modern Badge", es: "Insignia Moderna" } },
  { id: "playful", name: { en: "Playful Award", es: "Premio Divertido" } },
];

const COLORS: { id: ColorId; label: { en: string; es: string }; primary: string; accent: string; bg: string }[] = [
  { id: "navy", label: { en: "Navy", es: "Azul marino" }, primary: "#1e3a8a", accent: "#d4af37", bg: "#f8fafc" },
  { id: "gold", label: { en: "Gold", es: "Dorado" }, primary: "#92400e", accent: "#fbbf24", bg: "#fffbeb" },
  { id: "emerald", label: { en: "Emerald", es: "Esmeralda" }, primary: "#065f46", accent: "#34d399", bg: "#ecfdf5" },
  { id: "rose", label: { en: "Rose", es: "Rosa" }, primary: "#9f1239", accent: "#fb7185", bg: "#fff1f2" },
  { id: "slate", label: { en: "Slate", es: "Pizarra" }, primary: "#0f172a", accent: "#64748b", bg: "#f1f5f9" },
];

export function AchievementCertificateMaker({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [colorId, setColorId] = useState<ColorId>("navy");
  const [linkCopied, setLinkCopied] = useState(false);
  const [imgCopied, setImgCopied] = useState(false);

  const color = useMemo(() => COLORS.find((c) => c.id === colorId) || COLORS[0], [colorId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const n = p.get("n"); if (n) setName(decodeURIComponent(n));
    const t = p.get("t"); if (t) setTitle(decodeURIComponent(t));
    const d = p.get("d"); if (d) setDate(d);
    const m = p.get("m"); if (m) setMessage(decodeURIComponent(m));
    const ib = p.get("ib"); if (ib) setIssuedBy(decodeURIComponent(ib));
    const tm = p.get("tm") as TemplateId | null;
    if (tm && TEMPLATES.some((x) => x.id === tm)) setTemplateId(tm);
    const c = p.get("c") as ColorId | null;
    if (c && COLORS.some((x) => x.id === c)) setColorId(c);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (name.trim()) url.searchParams.set("n", encodeURIComponent(name.trim())); else url.searchParams.delete("n");
    if (title.trim()) url.searchParams.set("t", encodeURIComponent(title.trim())); else url.searchParams.delete("t");
    if (date) url.searchParams.set("d", date); else url.searchParams.delete("d");
    if (message.trim()) url.searchParams.set("m", encodeURIComponent(message.trim())); else url.searchParams.delete("m");
    if (issuedBy.trim()) url.searchParams.set("ib", encodeURIComponent(issuedBy.trim())); else url.searchParams.delete("ib");
    url.searchParams.set("tm", templateId);
    url.searchParams.set("c", colorId);
    window.history.replaceState({}, "", url.toString());
  }, [name, title, date, message, issuedBy, templateId, colorId]);

  const displayName = name.trim() || (es ? "Tu nombre" : "Your name");
  const displayTitle = title.trim() || (es ? "Logro destacado" : "Outstanding achievement");
  const displayMessage = message.trim();
  const displayIssued = issuedBy.trim() || (es ? "UtiliHub" : "UtiliHub");
  const displayDate = date ? new Date(date + "T12:00:00").toLocaleDateString(es ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  const generateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = color.bg;
    ctx.fillRect(0, 0, 900, 640);

    if (templateId === "classic") {
      ctx.strokeStyle = color.primary;
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 840, 580);
      ctx.strokeStyle = color.accent;
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 800, 540);
    } else if (templateId === "modern") {
      ctx.fillStyle = color.primary;
      ctx.fillRect(0, 0, 900, 80);
      ctx.fillStyle = color.accent;
      ctx.fillRect(0, 80, 900, 8);
    } else {
      ctx.fillStyle = color.accent;
      ctx.beginPath();
      ctx.arc(450, 120, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color.bg;
      ctx.font = "bold 48px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★", 450, 138);
    }

    ctx.fillStyle = color.primary;
    ctx.textAlign = "center";
    ctx.font = templateId === "playful" ? "bold 28px system-ui, sans-serif" : "bold 22px system-ui, sans-serif";
    ctx.fillText(es ? "CERTIFICADO DE LOGRO" : "CERTIFICATE OF ACHIEVEMENT", 450, templateId === "modern" ? 150 : 140);

    ctx.font = "italic 20px system-ui, sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(es ? "Se otorga a" : "This is awarded to", 450, 220);

    ctx.font = "bold 42px system-ui, sans-serif";
    ctx.fillStyle = color.primary;
    const nameLines = wrapText(ctx, displayName, 700);
    nameLines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 450, 280 + i * 48));

    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText(es ? "por" : "for", 450, 380);

    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillStyle = color.primary;
    const titleLines = wrapText(ctx, displayTitle, 720);
    titleLines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 450, 430 + i * 40));

    if (displayMessage) {
      ctx.font = "italic 16px system-ui, sans-serif";
      ctx.fillStyle = "#64748b";
      const msgLines = wrapText(ctx, displayMessage, 680);
      msgLines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 450, 510 + i * 22));
    }

    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(displayDate, 450, 560);

    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = color.primary;
    ctx.fillText(es ? "Emitido por" : "Issued by", 450, 590);
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(displayIssued, 450, 612);

    ctx.font = "12px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "right";
    ctx.fillText("utilihub.app", 850, 625);

    return canvas;
  };

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = "";
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
    return lines;
  }

  const downloadPng = () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "certificate.png";
    a.click();
  };

  const copyImage = async () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setImgCopied(true);
        setTimeout(() => setImgCopied(false), 2000);
      }, "image/png");
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

  const resetForm = () => {
    setName("");
    setTitle("");
    setMessage("");
    setIssuedBy("");
    setDate(new Date().toISOString().slice(0, 10));
    setTemplateId("classic");
    setColorId("navy");
  };

  const previewClass =
    templateId === "classic"
      ? "border-8 border-double"
      : templateId === "modern"
      ? "border-t-8"
      : "rounded-3xl border-4";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">{es ? "Nombre" : "Name"}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={es ? "Nombre del destinatario" : "Recipient name"}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-bold">{es ? "Logro / título" : "Achievement / title"}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={es ? "Ej. Completó el curso" : "E.g. Completed the course"}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">{es ? "Fecha" : "Date"}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-bold">{es ? "Emitido por" : "Issued by"}</label>
          <input
            type="text"
            value={issuedBy}
            onChange={(e) => setIssuedBy(e.target.value)}
            placeholder={es ? "Tu nombre u organización" : "Your name or organization"}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold">{es ? "Mensaje (opcional)" : "Message (optional)"}</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={es ? "Felicitaciones…" : "Congratulations…"}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">{es ? "Plantilla" : "Template"}</label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value as TemplateId)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{es ? t.name.es : t.name.en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold">{es ? "Color" : "Color"}</label>
          <select
            value={colorId}
            onChange={(e) => setColorId(e.target.value as ColorId)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {COLORS.map((c) => (
              <option key={c.id} value={c.id}>{es ? c.label.es : c.label.en}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={`relative mx-auto w-full max-w-md rounded-2xl p-6 text-center shadow-lg ${previewClass}`}
        style={{
          background: color.bg,
          borderColor: templateId === "playful" ? color.accent : color.primary,
          color: color.primary,
          minHeight: 320,
        }}
      >
        {templateId === "modern" && (
          <div className="mb-3 h-2 rounded-full" style={{ background: color.accent }} />
        )}
        {templateId === "playful" && (
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full text-2xl" style={{ background: color.accent, color: color.bg }}>★</div>
        )}
        <p className="text-xs font-bold uppercase tracking-wider opacity-70">{es ? "Certificado de logro" : "Certificate of Achievement"}</p>
        <p className="mt-3 text-sm italic opacity-80">{es ? "Se otorga a" : "Awarded to"}</p>
        <p className="mt-1 text-2xl font-black leading-tight break-words">{displayName}</p>
        <p className="mt-4 text-sm opacity-80">{es ? "por" : "for"}</p>
        <p className="mt-1 text-xl font-bold leading-tight break-words">{displayTitle}</p>
        {displayMessage && <p className="mt-3 text-sm italic opacity-70 break-words">{displayMessage}</p>}
        <p className="mt-4 text-xs opacity-60">{displayDate}</p>
        <p className="mt-2 text-xs opacity-70">{es ? "Emitido por" : "Issued by"}</p>
        <p className="text-sm font-bold break-words">{displayIssued}</p>
        <span className="absolute bottom-2 right-3 text-[10px] opacity-40">utilihub.app</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={downloadPng} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
        <button type="button" onClick={copyImage} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">
          {imgCopied ? (es ? "¡Imagen copiada!" : "Image copied!") : (es ? "Copiar imagen" : "Copy image")}
        </button>
        <button type="button" onClick={copyLink} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">
          {linkCopied ? (es ? "¡Enlace copiado!" : "Link copied!") : (es ? "Copiar enlace" : "Copy link")}
        </button>
        <button type="button" onClick={resetForm} className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted-foreground">
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
