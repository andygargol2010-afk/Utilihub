import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Shape = "rect" | "round" | "oval";
type Unit = "m" | "ft";
type Chlorine = "liquid125" | "liquid6" | "cal65" | "tri90";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

const FT = 0.3048;
const LITER_PER_M3 = 1000;
const US_GAL_PER_L = 1 / 3.785411784;
const UK_GAL_PER_L = 1 / 4.54609;

/** Ounces of product to raise 10,000 US gallons by 1 ppm FC. Industry rule of thumb. */
const DOSE_PER_10K_PPM: Record<Chlorine, { oz: number; liquid: boolean }> = {
  liquid125: { oz: 10.7, liquid: true },
  liquid6: { oz: 22.4, liquid: true },
  cal65: { oz: 2, liquid: false },
  tri90: { oz: 1.5, liquid: false },
};

function parseNum(value: string) {
  const n = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function fmt(n: number, locale: Locale, digits = 1) {
  return n.toLocaleString(locale === "es" ? "es-AR" : "en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function PoolCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [shape, setShape] = useState<Shape>("rect");
  const [unit, setUnit] = useState<Unit>("m");
  const [length, setLength] = useState("8");
  const [width, setWidth] = useState("4");
  const [shallow, setShallow] = useState("1.1");
  const [deep, setDeep] = useState("1.6");
  const [ppm, setPpm] = useState("1");
  const [chlorine, setChlorine] = useState<Chlorine>("liquid125");
  const [flow, setFlow] = useState("");
  const [copied, setCopied] = useState(false);

  const applyPreset = (id: string) => {
    if (id === "family") {
      setShape("rect");
      setUnit("m");
      setLength("8");
      setWidth("4");
      setShallow("1.1");
      setDeep("1.6");
    } else if (id === "round") {
      setShape("round");
      setUnit("m");
      setLength("3.66");
      setWidth("");
      setShallow("0.9");
      setDeep("0.9");
    } else {
      setShape("rect");
      setUnit("m");
      setLength("2");
      setWidth("2");
      setShallow("0.9");
      setDeep("0.9");
    }
  };

  const result = useMemo(() => {
    const len = parseNum(length);
    const wid = shape === "round" ? len : parseNum(width);
    const sh = parseNum(shallow);
    const dp = parseNum(deep);
    const raise = parseNum(ppm);
    const pump = flow.trim() === "" ? 0 : parseNum(flow);
    if ([len, wid, sh, dp, raise].some((n) => Number.isNaN(n)) || Number.isNaN(pump)) {
      return { error: es ? "Ingresá solo números válidos. Usá coma o punto." : "Enter valid numbers only. Use a comma or a dot." };
    }
    if (len <= 0 || wid <= 0 || sh <= 0 || dp <= 0) {
      return { error: es ? "Las medidas tienen que ser mayores que 0." : "Dimensions must be greater than 0." };
    }
    if (raise < 0 || raise > 20) {
      return { error: es ? "La suba de cloro debe estar entre 0 y 20 ppm." : "Chlorine raise must be between 0 and 20 ppm." };
    }
    if (pump < 0) {
      return { error: es ? "El caudal no puede ser negativo." : "Flow cannot be negative." };
    }
    const toM = unit === "ft" ? FT : 1;
    const lengthM = len * toM;
    const widthM = wid * toM;
    const depthM = ((sh + dp) / 2) * toM;
    const maxSpan = Math.max(lengthM, widthM, depthM);
    if (maxSpan > 80) {
      return { error: es ? "Una medida supera 80 m. Revisá la unidad (m o ft)." : "A dimension is over 80 m. Check the unit (m or ft)." };
    }
    const area = shape === "round" ? Math.PI * (lengthM / 2) ** 2 : shape === "oval" ? Math.PI * (lengthM / 2) * (widthM / 2) : lengthM * widthM;
    const m3 = area * depthM;
    const liters = m3 * LITER_PER_M3;
    const usGal = liters * US_GAL_PER_L;
    const ukGal = liters * UK_GAL_PER_L;
    const dose = DOSE_PER_10K_PPM[chlorine];
    const ounces = (usGal / 10000) * dose.oz * raise;
    const doseMl = dose.liquid ? ounces * 29.5735 : null;
    const doseG = dose.liquid ? null : ounces * 28.3495;
    const flowM3h = pump <= 0 ? 0 : unit === "ft" ? pump * 0.227125 : pump / 1000;
    const turnoverH = flowM3h > 0 ? m3 / flowM3h : null;
    return { area, depthM, m3, liters, usGal, ukGal, ounces, doseMl, doseG, liquid: dose.liquid, turnoverH };
  }, [chlorine, deep, es, flow, length, ppm, shape, shallow, unit, width]);

  const summary = useMemo(() => {
    if ("error" in result) return result.error;
    const dose =
      result.liquid && result.doseMl != null
        ? `${fmt(result.ounces, locale, 1)} fl oz (${fmt(result.doseMl / 1000, locale, 2)} L)`
        : `${fmt(result.ounces, locale, 1)} oz (${fmt((result.doseG ?? 0) / 1000, locale, 2)} kg)`;
    return [
      `${es ? "Volumen" : "Volume"}: ${fmt(result.liters, locale, 0)} L / ${fmt(result.m3, locale, 2)} m³`,
      `${es ? "Galones US" : "US gallons"}: ${fmt(result.usGal, locale, 0)}`,
      `${es ? "Galones UK" : "UK gallons"}: ${fmt(result.ukGal, locale, 0)}`,
      `${es ? "Superficie" : "Surface"}: ${fmt(result.area, locale, 2)} m²`,
      `${es ? "Dosis orientativa" : "Rule-of-thumb dose"}: ${dose}`,
      result.turnoverH != null ? `${es ? "Una recirculación" : "One turnover"}: ${fmt(result.turnoverH, locale, 1)} h` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [es, locale, result]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    setShape("rect");
    setUnit("m");
    setLength("8");
    setWidth("4");
    setShallow("1.1");
    setDeep("1.6");
    setPpm("1");
    setChlorine("liquid125");
    setFlow("");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {es
          ? "Calculá litros y galones de una piscina rectangular, redonda u oval, con una dosis de cloro orientativa."
          : "Calculate liters and gallons for a rectangular, round, or oval pool, with a labeled chlorine estimate."}
      </p>
      <div className="flex flex-wrap gap-2">
        {[
          ["family", es ? "Familiar 8×4 m" : "Family 8×4 m"],
          ["round", es ? "Redonda 3,66 m" : "Round 12 ft"],
          ["spa", es ? "Spa 2×2 m" : "Spa 2×2 m"],
        ].map(([id, label]) => (
          <button key={id} type="button" className="min-h-11 rounded-full border bg-background px-4 text-sm font-medium" onClick={() => applyPreset(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Forma" : "Shape"}</span>
          <select className={inputClass} value={shape} onChange={(e) => setShape(e.target.value as Shape)}>
            <option value="rect">{es ? "Rectangular" : "Rectangular"}</option>
            <option value="round">{es ? "Redonda" : "Round"}</option>
            <option value="oval">{es ? "Oval" : "Oval"}</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Unidad" : "Unit"}</span>
          <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            <option value="m">{es ? "Metros" : "Meters"}</option>
            <option value="ft">{es ? "Pies" : "Feet"}</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{shape === "round" ? (es ? "Diámetro" : "Diameter") : es ? "Largo" : "Length"}</span>
          <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
        </label>
        {shape !== "round" ? (
          <label className="space-y-1">
            <span className="text-sm font-medium">{es ? "Ancho" : "Width"}</span>
            <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
          </label>
        ) : null}
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Profundidad playa" : "Shallow depth"}</span>
          <input className={inputClass} inputMode="decimal" value={shallow} onChange={(e) => setShallow(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Profundidad hondo" : "Deep depth"}</span>
          <input className={inputClass} inputMode="decimal" value={deep} onChange={(e) => setDeep(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Subir cloro (ppm)" : "Raise chlorine (ppm)"}</span>
          <input className={inputClass} inputMode="decimal" value={ppm} onChange={(e) => setPpm(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Producto" : "Product"}</span>
          <select className={inputClass} value={chlorine} onChange={(e) => setChlorine(e.target.value as Chlorine)}>
            <option value="liquid125">{es ? "Líquido 12,5%" : "Liquid 12.5%"}</option>
            <option value="liquid6">{es ? "Lavandina 6%" : "Bleach 6%"}</option>
            <option value="cal65">{es ? "Hipoclorito 65%" : "Cal-hypo 65%"}</option>
            <option value="tri90">{es ? "Tricloro 90%" : "Trichlor 90%"}</option>
          </select>
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium">
            {unit === "ft" ? (es ? "Caudal de bomba (gal/min, opcional)" : "Pump flow (gal/min, optional)") : es ? "Caudal de bomba (L/h, opcional)" : "Pump flow (L/h, optional)"}
          </span>
          <input className={inputClass} inputMode="decimal" placeholder={es ? "Vacío si no aplica" : "Leave empty to skip"} value={flow} onChange={(e) => setFlow(e.target.value)} />
        </label>
      </div>
      <div className="rounded-2xl border bg-accent/40 p-4" aria-live="polite">
        {"error" in result ? (
          <p className="text-sm font-medium text-destructive">{result.error}</p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Litros" : "Liters"}</dt>
              <dd className="text-lg font-semibold">{fmt(result.liters, locale, 0)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Metros cúbicos" : "Cubic meters"}</dt>
              <dd className="text-lg font-semibold">{fmt(result.m3, locale, 2)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Galones US" : "US gallons"}</dt>
              <dd className="text-lg font-semibold">{fmt(result.usGal, locale, 0)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Galones UK" : "UK gallons"}</dt>
              <dd className="text-lg font-semibold">{fmt(result.ukGal, locale, 0)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Superficie" : "Surface area"}</dt>
              <dd className="text-lg font-semibold">{fmt(result.area, locale, 2)} m²</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Dosis orientativa" : "Rule-of-thumb dose"}</dt>
              <dd className="text-lg font-semibold">
                {result.liquid && result.doseMl != null
                  ? `${fmt(result.doseMl / 1000, locale, 2)} L`
                  : `${fmt((result.doseG ?? 0) / 1000, locale, 2)} kg`}
              </dd>
            </div>
            {result.turnoverH != null ? (
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Una recirculación" : "One turnover"}</dt>
                <dd className="text-lg font-semibold">{fmt(result.turnoverH, locale, 1)} h</dd>
              </div>
            ) : null}
          </dl>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "La dosis es una estimación de producto para subir el cloro libre. Medí el agua y seguí la etiqueta."
          : "The dose is a product estimate to raise free chlorine. Test the water and follow the label."}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className="min-h-11 w-full rounded-full border px-4 text-sm font-semibold sm:w-auto" onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className="min-h-11 w-full rounded-full border px-4 text-sm font-semibold sm:w-auto" onClick={reset}>
          {es ? "Restablecer" : "Reset"}
        </button>
      </div>
    </div>
  );
}
