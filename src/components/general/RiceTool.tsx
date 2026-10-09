import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { riceWater, type RiceKind } from "@/lib/general/rice";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const KINDS: ReadonlyArray<{ id: RiceKind; en: string; es: string }> = [
  { id: "white", en: "White long-grain", es: "Blanco de grano largo" },
  { id: "basmati", en: "Basmati", es: "Basmati" },
  { id: "jasmine", en: "Jasmine", es: "Jazmín" },
  { id: "sushi", en: "Sushi", es: "Sushi" },
  { id: "brown", en: "Brown", es: "Integral" },
  { id: "parboiled", en: "Parboiled", es: "Parboil" },
];

export function RiceTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [kind, setKind] = useState<RiceKind>("white");
  const [grams, setGrams] = useState("200");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => riceWater(kind, Number(grams)), [kind, grams]);

  async function copyResult() {
    if (result.status !== "ok") return;
    const text = es
      ? `${grams} g de arroz: ${result.waterMl} ml de agua, unos ${result.cookedG} g cocidos.`
      : `${grams} g rice: ${result.waterMl} ml water, about ${result.cookedG} g cooked.`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Variedad" : "Variety"}</span>
        <select className={fieldClass} value={kind} onChange={(e) => setKind(e.target.value as RiceKind)}>
          {KINDS.map((item) => (
            <option key={item.id} value={item.id}>
              {es ? item.es : item.en}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Arroz seco (g)" : "Dry rice (g)"}</span>
        <input
          className={fieldClass}
          inputMode="decimal"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          placeholder="200"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setKind("white");
            setGrams("200");
          }}
        >
          {es ? "200 g blanco" : "200 g white"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setKind("basmati");
            setGrams("150");
          }}
        >
          {es ? "150 g basmati" : "150 g basmati"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setKind("white");
            setGrams("");
          }}
        >
          {es ? "Limpiar" : "Clear"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        {result.status === "ok"
          ? es
            ? `${result.ratio} ml por gramo. El peso cocido es una estimación de absorción.`
            : `${result.ratio} ml per gram. Cooked weight is an absorption estimate.`
          : result.issue === "range"
            ? es
              ? "Más de 5000 g queda fuera de una olla de casa."
              : "More than 5000 g is outside a home pot."
            : es
              ? "Ingresá gramos mayores a cero. Vacío no inventa agua."
              : "Enter grams above zero. Empty input does not invent water."}
      </p>
      {result.status === "ok" ? (
        <div className="space-y-3 rounded-xl border p-4">
          <p className="text-lg font-medium">
            {es ? `${result.waterMl} ml de agua` : `${result.waterMl} ml water`}
          </p>
          <p className="text-sm">
            {es ? `Peso cocido estimado: ${result.cookedG} g` : `Estimated cooked weight: ${result.cookedG} g`}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
