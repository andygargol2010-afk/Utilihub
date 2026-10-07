import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { buildClamp } from "@/lib/general/clamp";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLE = { minPx: "16", maxPx: "24", minVw: "320", maxVw: "1200", root: "16" };

export function ClampTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [minPx, setMinPx] = useState(EXAMPLE.minPx);
  const [maxPx, setMaxPx] = useState(EXAMPLE.maxPx);
  const [minVw, setMinVw] = useState(EXAMPLE.minVw);
  const [maxVw, setMaxVw] = useState(EXAMPLE.maxVw);
  const [root, setRoot] = useState(EXAMPLE.root);
  const [copied, setCopied] = useState(false);

  const parsed = [minPx, maxPx, minVw, maxVw, root].map((v) => v.trim());
  const empty = parsed.some((v) => v === "");
  const result = useMemo(() => {
    if (empty) return { status: "empty" as const };
    return buildClamp(Number(minPx), Number(maxPx), Number(minVw), Number(maxVw), Number(root));
  }, [empty, minPx, maxPx, minVw, maxVw, root]);

  const status =
    result.status === "ok"
      ? es
        ? "Listo para copiar."
        : "Ready to copy."
      : result.status === "empty"
        ? es
          ? "Completá los cinco campos. Vacío no inventa un clamp."
          : "Fill all five fields. Empty input does not invent a clamp."
        : result.issue === "viewport"
          ? es
            ? "El viewport máximo tiene que ser mayor que el mínimo."
            : "The maximum viewport must be greater than the minimum."
          : result.issue === "root"
            ? es
              ? "La raíz tiene que ser mayor que 0."
              : "Root size must be greater than 0."
            : result.issue === "range"
              ? es
                ? "Los tamaños tienen que ser positivos y el mínimo no puede superar al máximo."
                : "Sizes must be positive, and the minimum cannot exceed the maximum."
              : es
                ? "Solo números. Las letras no son un tamaño."
                : "Numbers only. Letters are not a size.";

  async function copyResult() {
    if (result.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(result.css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMinPx("");
    setMaxPx("");
    setMinVw("");
    setMaxVw("");
    setRoot(EXAMPLE.root);
    setCopied(false);
  }

  const fields: { id: string; label: string; value: string; set: (v: string) => void }[] = [
    { id: "min", label: es ? "Tamaño mínimo (px)" : "Minimum size (px)", value: minPx, set: setMinPx },
    { id: "max", label: es ? "Tamaño máximo (px)" : "Maximum size (px)", value: maxPx, set: setMaxPx },
    { id: "minvw", label: es ? "Viewport mínimo (px)" : "Minimum viewport (px)", value: minVw, set: setMinVw },
    { id: "maxvw", label: es ? "Viewport máximo (px)" : "Maximum viewport (px)", value: maxVw, set: setMaxVw },
    { id: "root", label: es ? "Raíz (px)" : "Root (px)", value: root, set: setRoot },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.id} className="block space-y-2">
            <span className="text-sm font-medium">{field.label}</span>
            <input
              className={fieldClass}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              aria-label={field.label}
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setMinPx(EXAMPLE.minPx);
            setMaxPx(EXAMPLE.maxPx);
            setMinVw(EXAMPLE.minVw);
            setMaxVw(EXAMPLE.maxVw);
            setRoot(EXAMPLE.root);
          }}
        >
          16 → 24
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setMinPx("18");
            setMaxPx("32");
            setMinVw("360");
            setMaxVw("1440");
            setRoot("16");
          }}
        >
          18 → 32
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Limpiar" : "Reset"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? (
        <div className="rounded-xl border p-4 space-y-3">
          <p className="font-medium break-words">{result.css}</p>
          <p className="text-sm text-muted-foreground">
            {es ? "En el mínimo" : "At minimum"}: {result.atMinPx}px · {es ? "en el máximo" : "at maximum"}: {result.atMaxPx}px
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
