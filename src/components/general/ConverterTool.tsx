import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";
import { units } from "./ConverterTool.part1";
import { sets, hexToRgb, rgbToHsl } from "./ConverterTool.part2";

export function ConverterTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [out, setOut] = useState("");
  const es = locale === "es";
  const showcase = getToolShowcase(tool.slug);
  const ui = showcaseUi(showcase?.accent);
  const premium = Boolean(showcase);
  const base = tool.slug.replace("conversor-", "");
  const kind =
    base === "datos"
      ? "data"
      : base === "velocidad"
        ? "speed"
        : base === "energia"
          ? "energy"
          : base === "potencia"
            ? "power"
            : base === "presion"
              ? "pressure"
              : base === "frecuencia"
                ? "frequency"
                : base === "area"
                  ? "area"
                  : base === "volumen"
                    ? "volume"
                    : "";
  const options = sets[kind] ?? [];
  const msg = (en: string, esText: string) => (es ? esText : en);

  const convert = () => {
    const raw = value.trim();
    if (tool.slug === "binario-decimal") {
      if (!/^[01]+$/.test(raw)) {
        setOut(msg("Enter a valid binary number.", "Introduce un número binario válido."));
        return;
      }
      setOut(`${parseInt(raw, 2)}`);
      return;
    }
    if (tool.slug === "decimal-binario") {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0) {
        setOut(msg("Enter a non-negative decimal integer.", "Introduce un entero decimal no negativo."));
        return;
      }
      setOut(n.toString(2));
      return;
    }
    if (tool.slug === "hexadecimal-decimal") {
      if (!/^(?:0x)?[0-9a-f]+$/i.test(raw)) {
        setOut(msg("Enter valid hexadecimal.", "Introduce un valor hexadecimal válido."));
        return;
      }
      setOut(`${parseInt(raw.replace(/^0x/i, ""), 16)}`);
      return;
    }
    if (tool.slug === "decimal-hexadecimal") {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0) {
        setOut(msg("Enter a non-negative decimal integer.", "Introduce un entero decimal no negativo."));
        return;
      }
      setOut(n.toString(16).toUpperCase());
      return;
    }
    if (tool.slug === "conversor-angulos" || tool.slug === "grados-radianes") {
      const n = Number(raw.replace(",", "."));
      if (!Number.isFinite(n)) {
        setOut(msg("Enter a valid angle.", "Introduce un ángulo válido."));
        return;
      }
      const a = from || "degrees",
        b = to || "radians";
      setOut(
        a === b
          ? `${n} ${a}`
          : a === "degrees" || a === "grados"
            ? `${n} deg = ${((n * Math.PI) / 180).toFixed(10)} rad`
            : `${n} rad = ${((n * 180) / Math.PI).toFixed(10)} deg`,
      );
      return;
    }
    if (tool.slug === "rgb-hex" || tool.slug === "conversor-rgb-hex") {
      const p = raw.split(/[,; ]+/).map(Number);
      if (p.length !== 3 || p.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) {
        setOut(msg("Enter R, G and B between 0 and 255.", "Introduce R, G y B entre 0 y 255."));
        return;
      }
      setOut(`#${p.map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase()}`);
      return;
    }
    if (tool.slug === "hex-rgb") {
      const rgb = hexToRgb(raw);
      if (!rgb) {
        setOut(msg("Enter a valid HEX, for example #2563EB.", "Introduce un HEX válido, por ejemplo #2563EB."));
        return;
      }
      setOut(`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`);
      return;
    }
    if (tool.slug === "rgb-hsl") {
      const p = raw.split(/[,; ]+/).map(Number);
      if (p.length !== 3 || p.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) {
        setOut(msg("Enter R, G and B between 0 and 255.", "Introduce R, G y B entre 0 y 255."));
        return;
      }
      const h = rgbToHsl(p[0], p[1], p[2]);
      setOut(`HSL: ${h.h.toFixed(1)}°, ${h.s.toFixed(1)}%, ${h.l.toFixed(1)}%`);
      return;
    }
    const n = Number(raw.replace(",", "."));
    if (!Number.isFinite(n)) {
      setOut(msg("Enter a valid number.", "Introduce un número válido."));
      return;
    }
    if (kind) {
      const a = from || options[0],
        b = to || options[1] || options[0];
      setOut(`${n} ${a} = ${((n * units[kind][a]) / units[kind][b]).toPrecision(10)} ${b}`);
      return;
    }
    setOut(msg("Enter the data to convert.", "Introduce los datos que quieres convertir."));
  };

  const angleOptions = ["degrees", "radians"];
  const inputClass = ui?.field ?? "h-11 w-full rounded-xl border bg-background px-3";
  const selectClass = ui?.select ?? "h-11 rounded-xl border bg-background px-3";
  const btnClass = ui?.btn ?? "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground";

  return (
    <div className="space-y-4">
      <label className="block space-y-1">
        <span className="text-sm font-medium">{msg("Value", "Valor")}</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
          inputMode={tool.slug.includes("rgb") || tool.slug.includes("hex") ? "text" : "decimal"}
          placeholder={tool.slug.includes("rgb") || tool.slug === "conversor-rgb-hex" ? "255, 99, 71" : "100"}
        />
      </label>
      {(options.length > 1 || tool.slug === "conversor-angulos" || tool.slug === "grados-radianes") && (
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            aria-label={msg("From unit", "Unidad de origen")}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={selectClass}
          >
            {(tool.slug.includes("angulos") || tool.slug === "grados-radianes" ? angleOptions : options).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label={msg("To unit", "Unidad de destino")}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={selectClass}
          >
            {(tool.slug.includes("angulos") || tool.slug === "grados-radianes" ? angleOptions : options).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      )}
      <button type="button" className={`${btnClass} min-h-11`} onClick={convert}>
        {msg("Convert", "Convertir")}
      </button>
      <div aria-live="polite">
      {out && (
        <output className={`block break-all rounded-2xl border p-4 ${ui ? `${ui.out} font-medium` : "bg-muted/30"}`}>
          {out}
        </output>
      )}
      </div>
    </div>
  );
}
