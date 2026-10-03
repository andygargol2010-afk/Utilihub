import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const FT_PER_M = 3.280839895;
const SQFT_PER_M2 = FT_PER_M * FT_PER_M;
const SQUARE_FT2 = 100;

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

type Preset = {
  id: string;
  unit: Unit;
  length: string;
  width: string;
  rise: string;
  run: string;
  extra: string;
  waste: string;
  bundles: string;
  ridge: string;
  ridgeCover: string;
};

const PRESETS: Preset[] = [
  { id: "gable", unit: "m", length: "12", width: "8", rise: "6", run: "12", extra: "0", waste: "10", bundles: "3", ridge: "12", ridgeCover: "10" },
  { id: "hip", unit: "m", length: "14", width: "10", rise: "4", run: "12", extra: "0", waste: "15", bundles: "3", ridge: "24", ridgeCover: "10" },
  { id: "arch", unit: "ft", length: "40", width: "28", rise: "8", run: "12", extra: "0", waste: "12", bundles: "4", ridge: "40", ridgeCover: "35" },
  { id: "steep", unit: "m", length: "10", width: "7", rise: "12", run: "12", extra: "2", waste: "15", bundles: "3", ridge: "10", ridgeCover: "10" },
];

export function RoofCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("8");
  const [rise, setRise] = useState("6");
  const [run, setRun] = useState("12");
  const [extra, setExtra] = useState("0");
  const [wastePct, setWastePct] = useState("10");
  const [bundlesPerSquare, setBundlesPerSquare] = useState("3");
  const [ridge, setRidge] = useState("12");
  const [ridgeCover, setRidgeCover] = useState("10");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá squares, paquetes de teja y cumbrera a partir de la planta horizontal, la pendiente y el desperdicio. El precio por paquete es opcional.",
        unit: "Unidad",
        meters: "Metros",
        feet: "Pies",
        length: "Largo de planta",
        width: "Ancho de planta",
        rise: "Subida de pendiente",
        run: "Base de pendiente",
        extra: "Área extra (buhardillas)",
        waste: "Desperdicio (%)",
        bundles: "Paquetes por square",
        ridge: "Longitud de cumbrera (opcional)",
        ridgeCover: "Rendimiento de cumbrera por paquete",
        price: "Precio por paquete (opcional)",
        presets: "Presets",
        gable: "Hastial 6/12",
        hip: "Limas 4/12",
        arch: "Arquitectónica 8/12",
        steep: "Pronunciada 12/12",
        result: "Resultado",
        plan: "Planta",
        factor: "Factor de pendiente",
        sloped: "Superficie inclinada",
        withWaste: "Con desperdicio",
        squares: "Squares",
        field: "Paquetes de faldón",
        ridgeBundles: "Paquetes de cumbrera",
        totalBundles: "Paquetes totales",
        cost: "Coste estimado",
        lowSlope: "Pendiente bajo 2/12: la teja asfáltica no suele ser apta. Confirmá el sistema de cubierta.",
        note: "Un square = 100 ft². Los paquetes se redondean hacia arriba. Confirmá el rendimiento del paquete real.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
        errLength: "Indicá largo y ancho mayores que cero.",
        errPitch: "La base de la pendiente tiene que ser mayor que cero y la subida no puede ser negativa.",
        errWaste: "El desperdicio tiene que estar entre 0 y 50%.",
        errBundles: "Los paquetes por square tienen que ser mayores que cero.",
        errExtra: "El área extra no puede ser negativa.",
        errRidge: "La cumbrera y su rendimiento no pueden ser negativos. Si hay cumbrera, el rendimiento tiene que ser mayor que cero.",
        errPrice: "El precio, si lo indicás, tiene que ser cero o mayor.",
        errNumber: "Revisá los campos: hay un número no válido.",
      }
    : {
        help: "Estimate squares, field bundles, and ridge caps from the horizontal footprint, pitch, and waste. Bundle price is optional.",
        unit: "Unit",
        meters: "Meters",
        feet: "Feet",
        length: "Footprint length",
        width: "Footprint width",
        rise: "Pitch rise",
        run: "Pitch run",
        extra: "Extra area (dormers)",
        waste: "Waste (%)",
        bundles: "Bundles per square",
        ridge: "Ridge length (optional)",
        ridgeCover: "Ridge coverage per bundle",
        price: "Price per bundle (optional)",
        presets: "Presets",
        gable: "Gable 6/12",
        hip: "Hip 4/12",
        arch: "Architectural 8/12",
        steep: "Steep 12/12",
        result: "Result",
        plan: "Plan area",
        factor: "Pitch factor",
        sloped: "Sloped area",
        withWaste: "With waste",
        squares: "Squares",
        field: "Field bundles",
        ridgeBundles: "Ridge bundles",
        totalBundles: "Total bundles",
        cost: "Estimated cost",
        lowSlope: "Pitch is under 2/12: asphalt shingles are usually not suitable. Confirm the roof system.",
        note: "One square = 100 ft². Bundles are rounded up. Confirm coverage on the bundle you will buy.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
        errLength: "Enter length and width greater than zero.",
        errPitch: "Pitch run must be greater than zero and rise cannot be negative.",
        errWaste: "Waste must be between 0 and 50%.",
        errBundles: "Bundles per square must be greater than zero.",
        errExtra: "Extra area cannot be negative.",
        errRidge: "Ridge length and coverage cannot be negative. If you enter ridge, coverage must be greater than zero.",
        errPrice: "Price, if entered, must be zero or greater.",
        errNumber: "Check the fields: one of the numbers is invalid.",
      };

  const presetLabel: Record<string, string> = {
    gable: copy.gable,
    hip: copy.hip,
    arch: copy.arch,
    steep: copy.steep,
  };

  const result = useMemo(() => {
    const values = [length, width, rise, run, extra, wastePct, bundlesPerSquare, ridge, ridgeCover, price].map(parseNum);
    if (values.some((n) => Number.isNaN(n))) return { error: copy.errNumber };
    const [len, wid, riseN, runN, extraN, wasteN, perSquare, ridgeN, ridgeCoverN, priceN] = values;
    if (len == null || wid == null || riseN == null || runN == null || extraN == null || wasteN == null || perSquare == null || ridgeN == null || ridgeCoverN == null) {
      return { error: copy.errNumber };
    }
    if (len <= 0 || wid <= 0) return { error: copy.errLength };
    if (runN <= 0 || riseN < 0) return { error: copy.errPitch };
    if (wasteN < 0 || wasteN > 50) return { error: copy.errWaste };
    if (perSquare <= 0) return { error: copy.errBundles };
    if (extraN < 0) return { error: copy.errExtra };
    if (ridgeN < 0 || ridgeCoverN < 0 || (ridgeN > 0 && ridgeCoverN <= 0)) return { error: copy.errRidge };
    if (priceN != null && priceN < 0) return { error: copy.errPrice };

    const plan = len * wid;
    const factor = Math.sqrt(1 + (riseN / runN) ** 2);
    const sloped = plan * factor + extraN;
    const withWaste = sloped * (1 + wasteN / 100);
    const areaFt2 = unit === "ft" ? withWaste : withWaste * SQFT_PER_M2;
    const squares = areaFt2 / SQUARE_FT2;
    const fieldBundles = Math.ceil(squares * perSquare - 1e-9);
    const ridgeBundles = ridgeN > 0 ? Math.ceil(ridgeN / ridgeCoverN - 1e-9) : 0;
    const totalBundles = fieldBundles + ridgeBundles;
    const cost = priceN != null && priceN > 0 ? totalBundles * priceN : null;
    return {
      plan,
      factor,
      sloped,
      withWaste,
      squares,
      fieldBundles,
      ridgeBundles,
      totalBundles,
      cost,
      lowSlope: riseN / runN < 2 / 12,
    };
  }, [length, width, rise, run, extra, wastePct, bundlesPerSquare, ridge, ridgeCover, price, unit, copy]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLength(preset.length);
    setWidth(preset.width);
    setRise(preset.rise);
    setRun(preset.run);
    setExtra(preset.extra);
    setWastePct(preset.waste);
    setBundlesPerSquare(preset.bundles);
    setRidge(preset.ridge);
    setRidgeCover(preset.ridgeCover);
    setPrice("");
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const u = unit === "m" ? "m" : "ft";
    const area = unit === "m" ? "m²" : "ft²";
    const lines = [
      `${copy.plan}: ${formatNum(result.plan)} ${area}`,
      `${copy.factor}: ${formatNum(result.factor, 3)}`,
      `${copy.sloped}: ${formatNum(result.sloped)} ${area}`,
      `${copy.withWaste}: ${formatNum(result.withWaste)} ${area}`,
      `${copy.squares}: ${formatNum(result.squares, 2)}`,
      `${copy.field}: ${result.fieldBundles}`,
      `${copy.ridgeBundles}: ${result.ridgeBundles}`,
      `${copy.totalBundles}: ${result.totalBundles}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    lines.push(`${copy.length}: ${length} ${u}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const areaUnit = unit === "m" ? "m²" : "ft²";
  const lenUnit = unit === "m" ? "m" : "ft";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <span className="text-sm font-medium">{copy.presets}</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={buttonClass} onClick={() => applyPreset(preset)}>
                {presetLabel[preset.id]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium" htmlFor="roof-unit">{copy.unit}</label>
          <select id="roof-unit" className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            <option value="m">{copy.meters}</option>
            <option value="ft">{copy.feet}</option>
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            {copy.length} ({lenUnit})
            <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.width} ({lenUnit})
            <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.rise}
            <input className={inputClass} inputMode="decimal" value={rise} onChange={(e) => setRise(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.run}
            <input className={inputClass} inputMode="decimal" value={run} onChange={(e) => setRun(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.extra} ({areaUnit})
            <input className={inputClass} inputMode="decimal" value={extra} onChange={(e) => setExtra(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.bundles}
            <input className={inputClass} inputMode="decimal" value={bundlesPerSquare} onChange={(e) => setBundlesPerSquare(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.price}
            <input className={inputClass} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.ridge} ({lenUnit})
            <input className={inputClass} inputMode="decimal" value={ridge} onChange={(e) => setRidge(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {copy.ridgeCover} ({lenUnit})
            <input className={inputClass} inputMode="decimal" value={ridgeCover} onChange={(e) => setRidgeCover(e.target.value)} />
          </label>
        </div>
        <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={reset}>
          {copy.reset}
        </button>
      </form>
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {"error" in result ? (
          <p className="mt-3 text-sm text-destructive">{result.error}</p>
        ) : (
          <>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.plan}</dt>
                <dd className="font-medium">{formatNum(result.plan)} {areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.factor}</dt>
                <dd className="font-medium">{formatNum(result.factor, 3)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.sloped}</dt>
                <dd className="font-medium">{formatNum(result.sloped)} {areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.withWaste}</dt>
                <dd className="font-medium">{formatNum(result.withWaste)} {areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.squares}</dt>
                <dd className="font-medium">{formatNum(result.squares)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.field}</dt>
                <dd className="text-base font-semibold">{result.fieldBundles}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.ridgeBundles}</dt>
                <dd className="font-medium">{result.ridgeBundles}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.totalBundles}</dt>
                <dd className="text-base font-semibold">{result.totalBundles}</dd>
              </div>
              {result.cost != null ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.cost}</dt>
                  <dd className="font-medium">{formatNum(result.cost)}</dd>
                </div>
              ) : null}
              {result.lowSlope ? <p className="pt-2 text-amber-700 dark:text-amber-400">{copy.lowSlope}</p> : null}
              <p className="pt-2 text-muted-foreground">{copy.note}</p>
            </dl>
            <button type="button" className={`${buttonClass} mt-4 w-full`} onClick={copyResult}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
