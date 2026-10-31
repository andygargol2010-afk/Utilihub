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
  | "no-prohibited"
  | "https"
  | "sitemap";

const CHECKS: {
  id: CheckId;
  label: { en: string; es: string };
  tip: { en: string; es: string };
  suggestion: { en: string; es: string };
  weight: number;
}[] = [
  {
    id: "privacy",
    label: { en: "Privacy policy page", es: "Página de política de privacidad" },
    tip: { en: "Link a clear privacy policy from the footer or menu.", es: "Enlaza una política de privacidad clara desde el pie o el menú." },
    suggestion: { en: "Create /privacy with data practices, cookies, and contact.", es: "Crea /privacidad con prácticas de datos, cookies y contacto." },
    weight: 12,
  },
  {
    id: "about",
    label: { en: "About / who we are page", es: "Página Acerca de / quiénes somos" },
    tip: { en: "Tell visitors who is behind the site.", es: "Cuéntale a los visitantes quién está detrás del sitio." },
    suggestion: { en: "Add author bio, mission, and real photo or team note.", es: "Añade biografía del autor, misión y foto real o nota del equipo." },
    weight: 8,
  },
  {
    id: "contact",
    label: { en: "Contact page or form", es: "Página o formulario de contacto" },
    tip: { en: "Provide a way for users and Google to reach you.", es: "Ofrece una forma para que usuarios y Google te contacten." },
    suggestion: { en: "Include email, form, or business address that is monitored.", es: "Incluye email, formulario o dirección de negocio que se supervise." },
    weight: 8,
  },
  {
    id: "original",
    label: { en: "Mostly original content", es: "Contenido mayormente original" },
    tip: { en: "Avoid scraped or thin duplicate pages.", es: "Evita páginas raspadas o duplicadas delgadas." },
    suggestion: { en: "Rewrite thin pages; add unique examples, data, or analysis.", es: "Reescribe páginas delgadas; añade ejemplos, datos o análisis únicos." },
    weight: 18,
  },
  {
    id: "mobile",
    label: { en: "Mobile-friendly layout", es: "Diseño amigable con móviles" },
    tip: { en: "Test on a phone; text readable, buttons tappable.", es: "Prueba en un teléfono; texto legible, botones tocables." },
    suggestion: { en: "Use responsive CSS, 16px+ text, 44px tap targets.", es: "Usa CSS responsivo, texto de 16px+, objetivos de toque de 44px." },
    weight: 12,
  },
  {
    id: "nav",
    label: { en: "Clear navigation", es: "Navegación clara" },
    tip: { en: "Users should find main sections easily.", es: "Los usuarios deben encontrar las secciones principales fácilmente." },
    suggestion: { en: "Add header menu + footer links to key pages.", es: "Añade menú de encabezado + enlaces de pie a páginas clave." },
    weight: 8,
  },
  {
    id: "content",
    label: { en: "Sufficient content quality", es: "Calidad de contenido suficiente" },
    tip: { en: "Aim for helpful, substantial pages, not doorways.", es: "Apunta a páginas útiles y sustanciales, no de entrada." },
    suggestion: { en: "Expand top pages to 800+ words with structure and media.", es: "Amplía las páginas principales a 800+ palabras con estructura y medios." },
    weight: 14,
  },
  {
    id: "no-prohibited",
    label: { en: "No prohibited content", es: "Sin contenido prohibido" },
    tip: { en: "No adult, violent, or policy-violating material.", es: "Sin material adulto, violento o que viole políticas." },
    suggestion: { en: "Remove or age-gate any adult, illegal, or misleading claims.", es: "Elimina o restringe por edad cualquier contenido adulto, ilegal o engañoso." },
    weight: 5,
  },
  {
    id: "https",
    label: { en: "HTTPS / secure site", es: "HTTPS / sitio seguro" },
    tip: { en: "Entire site must load over HTTPS.", es: "Todo el sitio debe cargar por HTTPS." },
    suggestion: { en: "Force HTTPS redirects and fix mixed-content warnings.", es: "Fuerza redirecciones HTTPS y corrige avisos de contenido mixto." },
    weight: 8,
  },
  {
    id: "sitemap",
    label: { en: "Sitemap + robots.txt", es: "Sitemap + robots.txt" },
    tip: { en: "Help Google discover your pages.", es: "Ayuda a Google a descubrir tus páginas." },
    suggestion: { en: "Submit sitemap in Search Console; allow crawling in robots.txt.", es: "Envía el sitemap en Search Console; permite rastreo en robots.txt." },
    weight: 7,
  },
];

export function AdsenseComplianceKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [checked, setChecked] = useState<Record<CheckId, boolean>>(
    Object.fromEntries(CHECKS.map((c) => [c.id, false])) as Record<CheckId, boolean>,
  );
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

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

  const missing = useMemo(
    () => CHECKS.filter((c) => !checked[c.id]),
    [checked],
  );

  const toggle = (id: CheckId) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setChecked(Object.fromEntries(CHECKS.map((c) => [c.id, false])) as Record<CheckId, boolean>);
  };

  const generateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grd = ctx.createLinearGradient(0, 0, 800, 640);
    grd.addColorStop(0, "#0f172a");
    grd.addColorStop(1, "#1e293b");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 800, 640);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 0, 12, 640);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(es ? "Puntaje de Cumplimiento AdSense" : "AdSense Compliance Score", 40, 60);

    ctx.font = "bold 88px system-ui, sans-serif";
    ctx.fillStyle = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, 400, 190);
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("/ 100", 400, 220);

    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#e2e8f0";
    let y = 270;
    CHECKS.forEach((ch) => {
      const mark = checked[ch.id] ? "✓" : "○";
      const label = es ? ch.label.es : ch.label.en;
      ctx.fillText(`${mark}  ${label}`, 50, y);
      y += 26;
    });

    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("utilihub.app", 760, 610);

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

  const copyImage = async () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch {
      /* ignore */
    }
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
              {!checked[ch.id] && (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  {es ? "Sugerencia: " : "Suggestion: "}
                  {es ? ch.suggestion.es : ch.suggestion.en}
                </p>
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{ch.weight} pts</span>
          </label>
        ))}
      </div>

      {missing.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {es ? "Próximos pasos sugeridos" : "Suggested next steps"}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-300">
            {missing.slice(0, 4).map((m) => (
              <li key={m.id}>{es ? m.suggestion.es : m.suggestion.en}</li>
            ))}
          </ul>
        </div>
      )}

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
          onClick={copyImage}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {imageCopied ? (es ? "¡Imagen copiada!" : "Image copied!") : es ? "Copiar imagen" : "Copy image"}
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
