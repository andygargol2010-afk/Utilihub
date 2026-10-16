import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ProportionCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("2");
  const [b, setB] = useState("3");
  const [c, setC] = useState("4");
  const [x, setX] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const nc = parseFloat(c);
    const nx = parseFloat(x);
    const emptyCount = [a, b, c, x].filter((v) => v.trim() === "").length;
    if (emptyCount !== 1) return null;

    if (a.trim() === "" && !isNaN(nb) && !isNaN(nc) && !isNaN(nx) && nx !== 0) {
      return { value: (nb * nc) / nx, label: "a" };
    }
    if (b.trim() === "" && !isNaN(na) && !isNaN(nc) && !isNaN(nx) && na !== 0) {
      return { value: (na * nx) / nc, label: "b" };
    }
    if (c.trim() === "" && !isNaN(na) && !isNaN(nb) && !isNaN(nx) && nx !== 0) {
      return { value: (na * nx) / nb, label: "c" };
    }
    if (x.trim() === "" && !isNaN(na) && !isNaN(nb) && !isNaN(nc) && na !== 0) {
      return { value: (nb * nc) / na, label: "x" };
    }
    return null;
  }, [a, b, c, x]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Proporción: ${result.label} = ${Math.round(result.value * 1000) / 1000}`
      : `Proportion: ${result.label} = ${Math.round(result.value * 1000) / 1000}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setA("2");
    setB("3");
    setC("4");
    setX("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Valor desconocido" : "Missing value"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{Math.round(result.value * 1000) / 1000}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Variable ${result.label}` : `Variable ${result.label}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Deja exactamente un campo vacío" : "Leave exactly one field empty"}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center">a / b = c / x</p>

      <div className="grid gap-4 sm:grid-cols-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">a</span>
          <input type="number" step="any" value={a} onChange={(e) => setA(e.target.value)} className={fieldClass} placeholder={es ? "vacío" : "empty"} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">b</span>
          <input type="number" step="any" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} placeholder={es ? "vacío" : "empty"} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">c</span>
          <input type="number" step="any" value={c} onChange={(e) => setC(e.target.value)} className={fieldClass} placeholder={es ? "vacío" : "empty"} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">x</span>
          <input type="number" step="any" value={x} onChange={(e) => setX(e.target.value)} className={fieldClass} placeholder={es ? "vacío" : "empty"} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 / 3 = 4 / x → x = 6" : "2 / 3 = 4 / x → x = 6"}</p>
        <p>{es ? "5 / b = 10 / 4 → b = 2" : "5 / b = 10 / 4 → b = 2"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
