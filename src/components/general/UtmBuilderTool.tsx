import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

const MEDIUMS = ["cpc", "email", "social", "referral", "organic", "display"];

function cleanToken(value: string, lower: boolean) {
  const trimmed = value.trim().replace(/\s+/g, "-");
  return lower ? trimmed.toLowerCase() : trimmed;
}

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return { error: "empty" as const };
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return { error: "invalid" as const };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { error: "protocol" as const };
  if (!url.hostname || !url.hostname.includes(".")) return { error: "host" as const };
  return { url };
}

export function UtmBuilderTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [pageUrl, setPageUrl] = useState("https://www.example.com/oferta");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("lanzamiento-octubre");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [lower, setLower] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const parsed = normalizeUrl(pageUrl);
    if (parsed.error === "empty") return { error: es ? "Ingresá la URL de destino." : "Enter the landing page URL." };
    if (parsed.error === "invalid" || parsed.error === "host") {
      return { error: es ? "La URL no es válida. Ej.: https://ejemplo.com/ruta" : "That URL is not valid. Example: https://example.com/path" };
    }
    if (parsed.error === "protocol") {
      return { error: es ? "Solo se permiten enlaces http y https." : "Only http and https links are allowed." };
    }
    const fields = {
      utm_source: cleanToken(source, lower),
      utm_medium: cleanToken(medium, lower),
      utm_campaign: cleanToken(campaign, lower),
      utm_term: cleanToken(term, lower),
      utm_content: cleanToken(content, lower),
    };
    if (!fields.utm_source || !fields.utm_medium || !fields.utm_campaign) {
      return {
        error: es
          ? "Origen, medio y campaña son obligatorios."
          : "Source, medium, and campaign are required.",
      };
    }
    if (Object.values(fields).some((value) => value.length > 120)) {
      return { error: es ? "Cada campo admite hasta 120 caracteres." : "Each field allows up to 120 characters." };
    }
    const url = parsed.url;
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) url.searchParams.delete(key);
    url.searchParams.set("utm_source", fields.utm_source);
    url.searchParams.set("utm_medium", fields.utm_medium);
    url.searchParams.set("utm_campaign", fields.utm_campaign);
    if (fields.utm_term) url.searchParams.set("utm_term", fields.utm_term);
    if (fields.utm_content) url.searchParams.set("utm_content", fields.utm_content);
    return { href: url.toString(), fields };
  }, [campaign, content, es, lower, medium, pageUrl, source, term]);

  const copy = async () => {
    if (!("href" in result)) return;
    try {
      await navigator.clipboard.writeText(result.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {es
          ? "Armá un enlace de campaña con origen, medio y nombre, listo para copiar."
          : "Build a campaign link with source, medium, and name, ready to copy."}
      </p>
      <label className="block space-y-1">
        <span className="text-sm font-medium">{es ? "URL de destino" : "Landing page URL"}</span>
        <input
          className={inputClass}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Origen (utm_source)" : "Source (utm_source)"}</span>
          <input className={inputClass} value={source} onChange={(e) => setSource(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Campaña (utm_campaign)" : "Campaign (utm_campaign)"}</span>
          <input className={inputClass} value={campaign} onChange={(e) => setCampaign(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Término (opcional)" : "Term (optional)"}</span>
          <input className={inputClass} value={term} onChange={(e) => setTerm(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Contenido (opcional)" : "Content (optional)"}</span>
          <input className={inputClass} value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{es ? "Medio (utm_medium)" : "Medium (utm_medium)"}</legend>
        <div className="flex flex-wrap gap-2">
          {MEDIUMS.map((value) => (
            <button
              key={value}
              type="button"
              className={`min-h-11 rounded-full border px-4 text-sm font-medium ${medium === value ? "border-primary bg-accent text-primary" : "bg-background"}`}
              onClick={() => setMedium(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">{es ? "Medio personalizado" : "Custom medium"}</span>
          <input className={inputClass} value={medium} onChange={(e) => setMedium(e.target.value)} />
        </label>
      </fieldset>
      <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
        {es ? "Pasar los UTM a minúsculas" : "Lowercase UTM values"}
      </label>
      <div className="rounded-2xl border bg-accent/40 p-4" aria-live="polite">
        {"error" in result ? (
          <p className="text-sm font-medium text-destructive">{result.error}</p>
        ) : (
          <div className="space-y-3">
            <p className="break-all text-sm font-semibold">{result.href}</p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {Object.entries(result.fields)
                .filter(([, value]) => value)
                .map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        )}
      </div>
      <button type="button" className="min-h-11 rounded-full border px-4 text-sm font-semibold" onClick={copy} disabled={"error" in result}>
        {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar enlace" : "Copy link"}
      </button>
    </div>
  );
}
