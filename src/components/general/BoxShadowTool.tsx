import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-2 text-sm";
const buttonClass = "h-10 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const primaryBtn = `${buttonClass} bg-primary text-primary-foreground`;

export function BoxShadowTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [h, setH] = useState(0);
  const [v, setV] = useState(4);
  const [blur, setBlur] = useState(6);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000040");
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const insetPart = inset ? "inset " : "";
    return `${insetPart}${h}px ${v}px ${blur}px ${spread}px ${color}`;
  }, [h, v, blur, spread, color, inset]);

  const fullCss = `box-shadow: ${css};`;

  function copy() {
    navigator.clipboard.writeText(fullCss).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function reset() {
    setH(0);
    setV(4);
    setBlur(6);
    setSpread(0);
    setColor("#00000040");
    setInset(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{es ? "Horizontal (px)" : "Horizontal (px)"}</span>
              <input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} className={fieldClass} />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{es ? "Vertical (px)" : "Vertical (px)"}</span>
              <input type="number" value={v} onChange={(e) => setV(Number(e.target.value) || 0)} className={fieldClass} />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{es ? "Desenfoque (px)" : "Blur (px)"}</span>
              <input type="number" min={0} value={blur} onChange={(e) => setBlur(Math.max(0, Number(e.target.value) || 0))} className={fieldClass} />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{es ? "Extensi\u00f3n (px)" : "Spread (px)"}</span>
              <input type="number" value={spread} onChange={(e) => setSpread(Number(e.target.value) || 0)} className={fieldClass} />
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">{es ? "Color" : "Color"}</span>
            <div className="flex gap-2">
              <input type="color" value={color.startsWith("#") && color.length >= 7 ? color.slice(0, 7) : "#000000"} onChange={(e) => setColor(e.target.value + (color.length > 7 ? color.slice(7) : ""))} className="h-10 w-16 rounded border" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className={fieldClass} placeholder="#00000040" />
            </div>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} />
            <span>{es ? "Inset (interior)" : "Inset"}</span>
          </label>
          <div className="flex gap-2">
            <button type="button" className={primaryBtn} onClick={copy}>
              {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar CSS" : "Copy CSS"}
            </button>
            <button type="button" className={buttonClass} onClick={reset}>
              {es ? "Reiniciar" : "Reset"}
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div
            className="w-48 h-48 rounded-2xl bg-white dark:bg-neutral-800 border flex items-center justify-center text-sm text-muted-foreground"
            style={{ boxShadow: css }}
          >
            {es ? "Vista previa" : "Preview"}
          </div>
          <pre className="mt-4 text-xs bg-muted p-3 rounded-xl overflow-x-auto w-full text-left">{fullCss}</pre>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Ajusta los valores y copia el CSS listo para pegar en tu hoja de estilos. El color admite hex con alfa (ej. #00000040)."
          : "Adjust the values and copy the CSS ready to paste into your stylesheet. Color supports hex with alpha (e.g. #00000040)."}
      </p>
    </div>
  );
}
