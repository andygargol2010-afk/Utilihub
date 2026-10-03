import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, locale: string, digits = 1) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

type Preset = { id: string; rise: string; target: string; tread: string; mode: "minus" | "equal" };

const PRESETS: Preset[] = [
  { id: "comfort", rise: "280", target: "17.5", tread: "28", mode: "minus" },
  { id: "floor", rise: "270", target: "18", tread: "27", mode: "minus" },
  { id: "attic", rise: "260", target: "20", tread: "22", mode: "minus" },
  { id: "deck", rise: "70", target: "17.5", tread: "28", mode: "equal" },
];

export function StairCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const numberLocale = es ? "es-AR" : "en-US";
  const [rise, setRise] = useState("280");
  const [target, setTarget] = useState("17.5");
  const [tread, setTread] = useState("28");
  const [mode, setMode] = useState<"minus" | "equal">("minus");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Calculá contrahuellas, huellas, desarrollo y longitud de zanca de un tramo recto a partir del desnivel entre pisos. La regla de Blondel indica si la proporción es cómoda.",
        rise: "Desnivel entre pisos (cm)",
        target: "Contrahuella objetivo (cm)",
        tread: "Huella (cm)",
        mode: "Conteo de huellas",
        minus: "Piso a piso (huellas = contrahuellas − 1)",
        equal: "Incluir huella superior (huellas = contrahuellas)",
        result: "Resultado",
        risers: "Contrahuellas",
        treads: "Huellas",
        actual: "Contrahuella real",
        run: "Desarrollo",
        stringer: "Longitud de zanca",
        angle: "Ángulo",
        blondel: "Blondel (2C + H)",
        presets: "Presets",
        comfort: "Casa cómoda",
        floor: "Piso 2,7 m",
        attic: "Altillo",
        deck: "Deck",
        copy: "Copiar resumen",
        copied: "Copiado",
        reset: "Reiniciar",
        empty: "Completá desnivel, contrahuella y huella con números mayores que cero.",
        invalid: "Usá números válidos. El desnivel y la huella no pueden ser cero o negativos.",
        steep: "Pendiente empinada: revisá si cumple la altura libre y la baranda.",
        shallow: "Pendiente muy suave: ocupa mucho desarrollo.",
        riserHigh: "Contrahuella alta para vivienda típica (referencia habitual ≤ 18–20 cm).",
        riserLow: "Contrahuella baja: vas a necesitar más peldaños y más desarrollo.",
        treadShort: "Huella corta (muchas normas piden al menos 25–28 cm).",
        blondelOk: "Proporción cómoda (60–65 cm).",
        blondelOff: "Fuera de la banda cómoda de 60–65 cm.",
        note: "Planificación local. No certifica código ni descuenta el vuelo de la huella.",
      }
    : {
        help: "Size risers, treads, total run, and stringer length for a straight flight from floor-to-floor rise. Blondel’s rule flags whether the proportion is comfortable.",
        rise: "Floor-to-floor rise (cm)",
        target: "Target riser (cm)",
        tread: "Tread depth (cm)",
        mode: "Tread count",
        minus: "Floor to floor (treads = risers − 1)",
        equal: "Include top tread (treads = risers)",
        result: "Result",
        risers: "Risers",
        treads: "Treads",
        actual: "Actual riser",
        run: "Total run",
        stringer: "Stringer length",
        angle: "Angle",
        blondel: "Blondel (2R + T)",
        presets: "Presets",
        comfort: "Comfortable house",
        floor: "2.7 m floor",
        attic: "Attic",
        deck: "Deck",
        copy: "Copy summary",
        copied: "Copied",
        reset: "Reset",
        empty: "Enter rise, target riser, and tread as numbers greater than zero.",
        invalid: "Use valid numbers. Rise and tread cannot be zero or negative.",
        steep: "Steep slope: check headroom and the handrail requirement.",
        shallow: "Very shallow slope: the run will be long.",
        riserHigh: "High riser for a typical home (a common reference is ≤ 18–20 cm).",
        riserLow: "Low riser: you will need more steps and a longer run.",
        treadShort: "Short tread (many codes ask for at least 25–28 cm).",
        blondelOk: "Comfortable proportion (60–65 cm).",
        blondelOff: "Outside the 60–65 cm comfort band.",
        note: "Local planning aid. It does not certify code and ignores nosing overlap.",
      };

  const presetLabel: Record<string, string> = {
    comfort: copy.comfort,
    floor: copy.floor,
    attic: copy.attic,
    deck: copy.deck,
  };

  const result = useMemo(() => {
    const riseCm = parseNum(rise);
    const targetCm = parseNum(target);
    const treadCm = parseNum(tread);
    if (riseCm === null || targetCm === null || treadCm === null) return { error: "empty" as const };
    if (Number.isNaN(riseCm) || Number.isNaN(targetCm) || Number.isNaN(treadCm)) return { error: "invalid" as const };
    if (riseCm <= 0 || targetCm <= 0 || treadCm <= 0) return { error: "invalid" as const };
    if (riseCm > 2000 || treadCm > 80) return { error: "invalid" as const };

    const risers = Math.max(1, Math.round(riseCm / targetCm));
    const actual = riseCm / risers;
    const treads = mode === "equal" ? risers : Math.max(0, risers - 1);
    const run = treads * treadCm;
    const stringer = Math.hypot(riseCm, run);
    const angle = run === 0 ? 90 : (Math.atan2(riseCm, run) * 180) / Math.PI;
    const blondel = 2 * actual + treadCm;
    const warnings: string[] = [];
    if (actual > 20) warnings.push(copy.riserHigh);
    if (actual < 15) warnings.push(copy.riserLow);
    if (treadCm < 25) warnings.push(copy.treadShort);
    if (angle > 42) warnings.push(copy.steep);
    if (angle < 20 && treads > 0) warnings.push(copy.shallow);
    return { error: null, risers, treads, actual, run, stringer, angle, blondel, warnings };
  }, [rise, target, tread, mode, copy.riserHigh, copy.riserLow, copy.treadShort, copy.steep, copy.shallow]);

  const summary = useMemo(() => {
    if (result.error || result.risers === undefined) return "";
    const unit = es ? "cm" : "cm";
    return [
      `${copy.risers}: ${result.risers}`,
      `${copy.treads}: ${result.treads}`,
      `${copy.actual}: ${formatNum(result.actual, numberLocale)} ${unit}`,
      `${copy.run}: ${formatNum(result.run, numberLocale)} ${unit}`,
      `${copy.stringer}: ${formatNum(result.stringer, numberLocale)} ${unit}`,
      `${copy.angle}: ${formatNum(result.angle, numberLocale, 1)}°`,
      `${copy.blondel}: ${formatNum(result.blondel, numberLocale)} ${unit}`,
    ].join("\n");
  }, [result, copy, es, numberLocale]);

  async function onCopy() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function onReset() {
    setRise("280");
    setTarget("17.5");
    setTread("28");
    setMode("minus");
    setCopied(false);
  }

  const sketchSteps = !result.error && result.risers ? Math.min(result.risers, 14) : 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{copy.help}</p>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={buttonClass}
              onClick={() => {
                setRise(preset.rise);
                setTarget(preset.target);
                setTread(preset.tread);
                setMode(preset.mode);
              }}
            >
              {presetLabel[preset.id]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>{copy.rise}</span>
          <input className={inputClass} inputMode="decimal" value={rise} onChange={(e) => setRise(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{copy.target}</span>
          <input className={inputClass} inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{copy.tread}</span>
          <input className={inputClass} inputMode="decimal" value={tread} onChange={(e) => setTread(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span>{copy.mode}</span>
          <select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as "minus" | "equal")}>
            <option value="minus">{copy.minus}</option>
            <option value="equal">{copy.equal}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={onCopy} disabled={!summary}>
          {copied ? copy.copied : copy.copy}
        </button>
        <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={onReset}>
          {copy.reset}
        </button>
      </div>

      <section className="rounded-2xl border bg-card p-4">
        <h2 className="text-sm font-semibold">{copy.result}</h2>
        {result.error ? (
          <p className="mt-2 text-sm text-destructive">{result.error === "empty" ? copy.empty : copy.invalid}</p>
        ) : (
          <div className="mt-3 space-y-3">
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Stat label={copy.risers} value={String(result.risers)} />
              <Stat label={copy.treads} value={String(result.treads)} />
              <Stat label={copy.actual} value={`${formatNum(result.actual, numberLocale)} cm`} />
              <Stat label={copy.run} value={`${formatNum(result.run, numberLocale)} cm`} />
              <Stat label={copy.stringer} value={`${formatNum(result.stringer, numberLocale)} cm`} />
              <Stat label={copy.angle} value={`${formatNum(result.angle, numberLocale, 1)}°`} />
              <Stat label={copy.blondel} value={`${formatNum(result.blondel, numberLocale)} cm`} />
            </dl>
            <p className={`text-sm ${result.blondel >= 60 && result.blondel <= 65 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
              {result.blondel >= 60 && result.blondel <= 65 ? copy.blondelOk : copy.blondelOff}
            </p>
            {result.warnings.length > 0 && (
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
            {sketchSteps > 0 && (
              <div className="flex items-end gap-0.5 overflow-hidden pt-2" aria-hidden="true">
                {Array.from({ length: sketchSteps }, (_, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-sm bg-primary/70"
                    style={{ height: `${12 + index * 6}px` }}
                  />
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">{copy.note}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
