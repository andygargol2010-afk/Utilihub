import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type CheckId =
  | "privacy"
  | "about"
  | "contact"
  | "original"
  | "mobile"
  | "nav"
  | "content"
  | "no-prohibited";

const CHECKS: {
  id: CheckId;
  label: { en: string; es: string };
  tip: { en: string; es: string };
  weight: number;
}[] = [
  {
    id: "privacy",
    label: { en: "Privacy policy page", es: "Página de política de privacidad" },
    tip: { en: "Link a clear privacy policy from the footer or menu.", es: "Enlaza una política de privacidad clara desde el pie o el menú." },
    weight: 15,
  },
  {
    id: "about",
    label: { en: "About / who we are page", es: "Página Acerca de / quiénes somos" },
    tip: { en: "Tell visitors who is behind the site.", es: "Cuéntale a los visitantes quién está detrás del sitio." },
    weight: 10,
  },
  {
    id: "contact",
    label: { en: "Contact page or form", es: "Página o formulario de contacto" },
    tip: { en: "Provide a way for users and Google to reach you.", es: "Ofrece una forma para que usuarios y Google te contacten." },
    weight: 10,
  },
  {
    id: "original",
    label: { en: "Mostly original content", es: "Contenido mayormente original" },
    tip: { en: "Avoid scraped or thin duplicate pages.", es: "Evita páginas raspadas o duplicadas delgadas." },
    weight: 20,
  },
  {
    id: "mobile",
    label: { en: "Mobile-friendly layout", es: "Diseño amigable con móviles" },
    tip: { en: "Test on a phone; text readable, buttons tappable.", es: "Prueba en un teléfono; texto legible, botones tocables." },
    weight: 15,
  },
  {
    id: "nav",
    label: { en: "Clear navigation", es: "Navegación clara" },
    tip: { en: "Users should find main sections easily.", es: "Los usuarios deben encontrar las secciones principales fácilmente." },
    weight: 10,
  },
  {
    id: "content",
    label: { en: "Sufficient content quality", es: "Calidad de contenido suficiente" },
    tip: { en: "Aim for helpful, substantial pages, not doorways.", es: "Apunta a páginas útiles y sustanciales, no de entrada." },
    weight: 15,
  },
  {
    id: "no-prohibited",
    label: { en: "No prohibited content", es: "Sin contenido prohibido" },
    tip: { en: "No adult, violent, or policy-violating material.", es: "Sin material adulto, violento o que viole políticas." },
    weight: 5,
  },
];

export function AdsenseComplianceKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [checked, setChecked] = useState<Record<CheckId, boolean>>({
    privacy: false,
    about: false,
    contact: false,
    original: false,
    mobile: false,
    nav: false,
    content: false,
    "no-prohibited": false,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    if (c && c.length === CHECKS.length) {
      const next: Record<CheckId, boolean> = { ...checked };
      CHECKS.forEach((ch, i) => {
        next[ch.id] = c[i] === "1";
      });
      setChecked(next);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const bits = CHECKS.map((ch) => (checked[ch.id] ? "1" : "0")).join("");
    const url = new URL(window.location.href);
    if (bits.includes("1")) url.searchParams.set("c", bits);
    else url.searchParams.delete("c");
    window.history.replaceState({}, "", url.toString());
  }, [checked]);

  const score = useMemo(() => {
    const totalWeight = CHECKS.reduce((s, c) => s + c.weight, 0);
    const got = CHECKS.reduce((s, c) => s + (checked[c.id] ? c.weight : 0), 0);
    return Math.round((got / totalWeight) * 100);
  }, [checked]);

  const toggle = (id: CheckId) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setChecked({
      privacy: false,
      about: false,
      contact: false,
      original: false,
      mobile: false,
      nav: false,
      content: false,
      "no-prohibited": false,
    });
  };

  const generateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    const grd = ctx.createLinearGradient(0, 0, 800, 560);
    grd.addColorStop(0, "#0f172a");
    grd.addColorStop(1, "#1e293b");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 800, 560);

    // Accent bar
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 0, 12, 560);

    // Title
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(es ? "Puntaje de Cumplimiento AdSense" : "AdSense Compliance Score", 40, 70);

    // Big score
    ctx.font = "bold 96px system-ui, sans-serif";
    ctx.fillStyle = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, 400, 220);
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("/ 100", 400, 250);

    // Checklist summary
    ctx.font = "16px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#e2e8f0";
    let y = 300;
    CHECKS.forEach((ch) => {
      const mark = checked[ch.id] ? "✓" : "○";
      const label = es ? ch.label.es : ch.label.en;
      ctx.fillText(`${mark}  ${label}`, 50, y);
      y += 28;
    });

    // Watermark
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("utilihub.app", 760, 530);

    return canvas;
  };

  const downloadPng = () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "adsense-compliance-score.png";
    a.click();
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

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {es ? "Puntaje en vivo" : "Live score"}
            </p>
            <p className="text-5xl font-black tabular-nums">{score}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {CHECKS.filter((c) => checked[c.id]).length} / {CHECKS.length} {es ? "ítems" : "items"}
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {CHECKS.map((ch) => (
          <label
            key={ch.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/40"
          >
            <input
              type="checkbox"
              checked={checked[ch.id]}
              onChange={() => toggle(ch.id)}
              className="mt-1 h-5 w-5 rounded border-border"
            />
            <div className="flex-1">
              <p className="font-semibold">{es ? ch.label.es : ch.label.en}</p>
              <p className="mt-1 text-sm text-muted-foreground">{es ? ch.tip.es : ch.tip.en}</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{ch.weight} pts</span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          {es ? "Descargar PNG del puntaje" : "Download score PNG"}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {copied ? (es ? "¡Enlace copiado!" : "Link copied!") : es ? "Copiar enlace" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
