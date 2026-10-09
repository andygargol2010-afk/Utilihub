import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { buildManifest, type ManifestDisplay, type ManifestOrientation } from "@/lib/general/manifest";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLE = {
  name: "UtiliHub",
  shortName: "Hub",
  description: "Browser tools",
  startUrl: "/",
  scope: "/",
  display: "standalone" as ManifestDisplay,
  orientation: "" as ManifestOrientation,
  themeColor: "#0f766e",
  backgroundColor: "#f8fafc",
  lang: "en",
  iconSrc: "",
  iconSizes: "",
};

const EMPTY = {
  name: "",
  shortName: "",
  description: "",
  startUrl: "/",
  scope: "",
  display: "standalone" as ManifestDisplay,
  orientation: "" as ManifestOrientation,
  themeColor: "",
  backgroundColor: "",
  lang: "",
  iconSrc: "",
  iconSizes: "",
};

export function ManifestTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [name, setName] = useState(EXAMPLE.name);
  const [shortName, setShortName] = useState(EXAMPLE.shortName);
  const [description, setDescription] = useState(EXAMPLE.description);
  const [startUrl, setStartUrl] = useState(EXAMPLE.startUrl);
  const [scope, setScope] = useState(EXAMPLE.scope);
  const [display, setDisplay] = useState<ManifestDisplay>(EXAMPLE.display);
  const [orientation, setOrientation] = useState<ManifestOrientation>(EXAMPLE.orientation);
  const [themeColor, setThemeColor] = useState(EXAMPLE.themeColor);
  const [backgroundColor, setBackgroundColor] = useState(EXAMPLE.backgroundColor);
  const [lang, setLang] = useState(EXAMPLE.lang);
  const [iconSrc, setIconSrc] = useState("");
  const [iconSizes, setIconSizes] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () =>
      buildManifest({
        name,
        shortName,
        description,
        startUrl,
        scope,
        display,
        orientation,
        themeColor,
        backgroundColor,
        lang,
        iconSrc,
        iconSizes,
      }),
    [name, shortName, description, startUrl, scope, display, orientation, themeColor, backgroundColor, lang, iconSrc, iconSizes],
  );

  async function copyResult() {
    if (result.status !== "ok") return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function loadExample() {
    setName(EXAMPLE.name);
    setShortName(EXAMPLE.shortName);
    setDescription(EXAMPLE.description);
    setStartUrl(EXAMPLE.startUrl);
    setScope(EXAMPLE.scope);
    setDisplay(EXAMPLE.display);
    setOrientation(EXAMPLE.orientation);
    setThemeColor(EXAMPLE.themeColor);
    setBackgroundColor(EXAMPLE.backgroundColor);
    setLang(EXAMPLE.lang);
    setIconSrc("");
    setIconSizes("");
  }

  function reset() {
    setName(EMPTY.name);
    setShortName(EMPTY.shortName);
    setDescription(EMPTY.description);
    setStartUrl(EMPTY.startUrl);
    setScope(EMPTY.scope);
    setDisplay(EMPTY.display);
    setOrientation(EMPTY.orientation);
    setThemeColor(EMPTY.themeColor);
    setBackgroundColor(EMPTY.backgroundColor);
    setLang(EMPTY.lang);
    setIconSrc(EMPTY.iconSrc);
    setIconSizes(EMPTY.iconSizes);
  }

  const note =
    result.status === "ok"
      ? es
        ? "Manifest listo. Sin ícono si no pegaste una ruta."
        : "Manifest ready. No icon unless you pasted a path."
      : result.status === "empty"
        ? es
          ? "Nombre vacío no inventa un archivo."
          : "An empty name does not invent a file."
        : result.status === "too-big"
          ? es
            ? "Nombre, short name o descripción fuera de límite."
            : "Name, short name, or description is over the limit."
          : es
            ? "URL, color, idioma o sizes inválido. No se inventa un archivo."
            : "Invalid URL, color, language, or sizes. No file is invented.";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "Nombre" : "Name"}</span>
          <input className={fieldClass} value={name} maxLength={48} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "Nombre corto" : "Short name"}</span>
          <input className={fieldClass} value={shortName} maxLength={12} onChange={(e) => setShortName(e.target.value)} />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Descripción" : "Description"}</span>
        <input className={fieldClass} value={description} maxLength={300} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "URL de inicio" : "Start URL"}</span>
          <input className={fieldClass} value={startUrl} onChange={(e) => setStartUrl(e.target.value)} placeholder="/" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Scope</span>
          <input className={fieldClass} value={scope} onChange={(e) => setScope(e.target.value)} placeholder="/" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">Display</span>
          <select className={fieldClass} value={display} onChange={(e) => setDisplay(e.target.value as ManifestDisplay)}>
            <option value="standalone">standalone</option>
            <option value="minimal-ui">minimal-ui</option>
            <option value="fullscreen">fullscreen</option>
            <option value="browser">browser</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "Orientación" : "Orientation"}</span>
          <select className={fieldClass} value={orientation} onChange={(e) => setOrientation(e.target.value as ManifestOrientation)}>
            <option value="">{es ? "Sin fijar" : "Unset"}</option>
            <option value="any">any</option>
            <option value="portrait">portrait</option>
            <option value="landscape">landscape</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "Color de tema" : "Theme color"}</span>
          <input className={fieldClass} value={themeColor} onChange={(e) => setThemeColor(e.target.value)} placeholder="#0f766e" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "Color de fondo" : "Background color"}</span>
          <input className={fieldClass} value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} placeholder="#f8fafc" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "Idioma" : "Language"}</span>
          <input className={fieldClass} value={lang} onChange={(e) => setLang(e.target.value)} placeholder="en" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{es ? "Ruta del ícono" : "Icon path"}</span>
          <input className={fieldClass} value={iconSrc} onChange={(e) => setIconSrc(e.target.value)} placeholder="/icon-192.png" />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Tamaño del ícono" : "Icon sizes"}</span>
        <input className={fieldClass} value={iconSizes} onChange={(e) => setIconSizes(e.target.value)} placeholder="192x192" />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={loadExample}>
          UtiliHub
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Limpiar" : "Clear"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{note}</p>
      {result.status === "ok" ? (
        <div className="space-y-3 rounded-xl border p-4">
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm">{result.output}</pre>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
