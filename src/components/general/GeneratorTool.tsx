import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";
import { generate } from "./GeneratorTool.part2";

export function GeneratorTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const es = locale === "es";
  const showcase = getToolShowcase(tool.slug);
  const ui = showcaseUi(showcase?.accent);
  const premium = Boolean(showcase);

  const run = () => {
    try {
      setError("");
      setOutput(generate(tool.slug, input));
    } catch (e) {
      setOutput("");
      setError(
        e instanceof Error
          ? es
            ? ({
                "Enter a valid minimum and maximum.": "Introduce un mínimo y un máximo válidos.",
                "Use between 2 and 10,000 sides and between 1 and 100 dice.": "Usa entre 2 y 10.000 caras y entre 1 y 100 dados.",
                "Length must be between 1 and 32.": "La longitud debe estar entre 1 y 32.",
                "Length must be between 1 and 128.": "La longitud debe estar entre 1 y 128.",
                "Enter at least one item, one per line.": "Introduce al menos un elemento, uno por línea.",
              }[e.message] ?? e.message)
            : e.message
          : es
            ? "No se pudo generar el resultado."
            : "Could not generate the result.",
      );
    }
  };

  const placeholder =
    tool.slug === "generador-dados"
      ? es
        ? "Caras, cantidad · ej. 6, 2"
        : "Sides, count · e.g. 6, 2"
      : tool.slug === "generador-numeros"
        ? es
          ? "Mínimo, máximo · ej. 1, 100"
          : "Minimum, maximum · e.g. 1, 100"
        : es
          ? "Configuración opcional"
          : "Optional configuration";

  const inputClass = ui?.field ?? "h-11 w-full rounded-xl border bg-background px-3";
  const btnClass = ui?.btn ?? "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground";

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">{es ? "Configuración" : "Settings"}</label>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} className={inputClass} />
      <p className="text-xs text-muted-foreground">
        {es
          ? "La generación se ejecuta localmente en tu navegador. Para sorteos y listas, usa un elemento por línea."
          : "Generation runs locally in your browser. For draws and lists, use one item per line."}
      </p>
      <button type="button" onClick={run} className={btnClass}>
        {es ? "Generar" : "Generate"}
      </button>
      {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
      {output && (
        <output className={`block whitespace-pre-wrap break-words rounded-2xl border p-4 font-medium ${ui ? `${ui.out} text-[15px]` : "bg-muted/30"}`}>
          {output}
        </output>
      )}
    </div>
  );
}
