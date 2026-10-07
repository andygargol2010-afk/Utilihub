import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import type { Locale } from "@/lib/i18n/locale";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const GAL_PER_L = 0.264172052;

function parseNum(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formatNum(value: number, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

type Preset = {
  id: string;
  area: string;
  storm: string;
  annual: string;
  coeff: string;
  flush: string;
  barrel: string;
  daily: string;
};

const PRESETS: Preset[] = [
  { id: "shed", area: "18", storm: "20", annual: "800", coeff: "0.90", flush: "0", barrel: "200", daily: "20" },
  { id: "house", area: "90", storm: "25", annual: "650", coeff: "0.80", flush: "20", barrel: "200", daily: "40" },
  { id: "tile", area: "120", storm: "15", annual: "900", coeff: "0.75", flush: "15", barrel: "300", daily: "50" },
  { id: "tank", area: "45", storm: "30", annual: "500", coeff: "0.85", flush: "10", barrel: "1000", daily: "30" },
];

export function RainwaterCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [area, setArea] = useState("18");
  const [storm, setStorm] = useState("20");
  const [annual, setAnnual] = useState("800");
  const [coeff, setCoeff] = useState("0.90");
  const [flush, setFlush] = useState("0");
  const [barrel, setBarrel] = useState("200");
  const [daily, setDaily] = useState("20");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá los litros que recoge un techo en una tormenta y en el año, y cuántos tanques hacen falta. El canalón se pide aparte.",
        presets: "Presets",
        shed: "Cobertizo",
        house: "Casa asfalto",
        tile: "Teja",
        tank: "Tanque huerto",
        area: "Área de captación (m²)",
        storm: "Lluvia de la tormenta (mm)",
        annual: "Lluvia anual (mm)",
        coeff: "Coeficiente de escorrentía",
        flush: "Primer lavado (L, opcional)",
        barrel: "Capacidad del tanque (L)",
        daily: "Uso diario (L, opcional)",
        result: "Captación",
        stormOut: "Tormenta neta",
        annualOut: "Captación anual",
        gallons: "Galones (tormenta)",
        barrels: "Tanques para la tormenta",
        days: "Días de uso con la tormenta",
        note: "1 mm sobre 1 m² = 1 L antes del coeficiente. No incluye fugas, rebalse ni pronóstico. Canalones y tejas se calculan en las tools hermanas.",
        copyBtn: "Copiar estimación",
        copied: "Copiado",
        reset: "Restablecer",
        errArea: "El área tiene que estar entre 0,5 y 5.000 m².",
        errStorm: "La tormenta tiene que estar entre 0,1 y 500 mm.",
        errAnnual: "La lluvia anual tiene que estar entre 1 y 4.000 mm.",
        errCoeff: "El coeficiente tiene que estar entre 0,30 y 1.",
        errFlush: "El primer lavado tiene que estar entre 0 y 500 L.",
        errBarrel: "El tanque tiene que estar entre 20 y 20.000 L.",
        errDaily: "El uso diario, si lo cargás, tiene que estar entre 1 y 2.000 L.",
      }
    : {
        help: "Estimate litres a roof collects in one storm and over a year, and how many barrels that storm needs. Gutters are ordered separately.",
        presets: "Presets",
        shed: "Metal shed",
        house: "Asphalt house",
        tile: "Tile roof",
        tank: "Garden tank",
        area: "Catchment area (m²)",
        storm: "Storm rainfall (mm)",
        annual: "Annual rainfall (mm)",
        coeff: "Runoff coefficient",
        flush: "First flush (L, optional)",
        barrel: "Barrel size (L)",
        daily: "Daily use (L, optional)",
        result: "Capture",
        stormOut: "Net storm",
        annualOut: "Annual capture",
        gallons: "Gallons (storm)",
        barrels: "Barrels for the storm",
        days: "Days of use from the storm",
        note: "1 mm over 1 m² = 1 L before the coefficient. Leaks, overflow routing, and forecasts are not included. Gutters and shingles live in the sibling tools.",
        copyBtn: "Copy estimate",
        copied: "Copied",
        reset: "Reset",
        errArea: "Area must be between 0.5 and 5,000 m².",
        errStorm: "Storm rainfall must be between 0.1 and 500 mm.",
        errAnnual: "Annual rainfall must be between 1 and 4,000 mm.",
        errCoeff: "Coefficient must be between 0.30 and 1.",
        errFlush: "First flush must be between 0 and 500 L.",
        errBarrel: "Barrel size must be between 20 and 20,000 L.",
        errDaily: "Daily use, if entered, must be between 1 and 2,000 L.",
      };

  const result = useMemo(() => {
    const areaM2 = parseNum(area);
    const stormMm = parseNum(storm);
    const annualMm = parseNum(annual);
    const runoff = parseNum(coeff);
    const flushL = flush.trim() === "" ? 0 : parseNum(flush);
    const barrelL = parseNum(barrel);
    const dailyL = daily.trim() === "" ? null : parseNum(daily);
    if (areaM2 == null || areaM2 < 0.5 || areaM2 > 5000) return { error: copy.errArea };
    if (stormMm == null || stormMm < 0.1 || stormMm > 500) return { error: copy.errStorm };
    if (annualMm == null || annualMm < 1 || annualMm > 4000) return { error: copy.errAnnual };
    if (runoff == null || runoff < 0.3 || runoff > 1) return { error: copy.errCoeff };
    if (flushL == null || flushL < 0 || flushL > 500) return { error: copy.errFlush };
    if (barrelL == null || barrelL < 20 || barrelL > 20000) return { error: copy.errBarrel };
    if (dailyL != null && (dailyL < 1 || dailyL > 2000)) return { error: copy.errDaily };
    const stormGross = areaM2 * stormMm * runoff;
    const annualGross = areaM2 * annualMm * runoff;
    const stormNet = Math.max(0, stormGross - flushL);
    const annualCapture = annualGross;
    const barrels = stormNet === 0 ? 0 : Math.ceil(stormNet / barrelL);
    const days = dailyL != null && dailyL > 0 ? stormNet / dailyL : null;
    return { stormNet, annualCapture, gallons: stormNet * GAL_PER_L, barrels, days };
  }, [annual, area, barrel, coeff, copy.errAnnual, copy.errArea, copy.errBarrel, copy.errCoeff, copy.errDaily, copy.errFlush, copy.errStorm, daily, flush, storm]);

  function applyPreset(preset: Preset) {
    setArea(preset.area);
    setStorm(preset.storm);
    setAnnual(preset.annual);
    setCoeff(preset.coeff);
    setFlush(preset.flush);
    setBarrel(preset.barrel);
    setDaily(preset.daily);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Agua de lluvia: ${formatNum(result.stormNet)} L en la tormenta (${formatNum(result.gallons)} gal), ${result.barrels} tanques, ${formatNum(result.annualCapture, 0)} L al año.`
      : `Rainwater: ${formatNum(result.stormNet)} L in the storm (${formatNum(result.gallons)} gal), ${result.barrels} barrels, ${formatNum(result.annualCapture, 0)} L a year.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "shed" ? copy.shed : id === "house" ? copy.house : id === "tile" ? copy.tile : copy.tank;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={buttonClass} onClick={() => applyPreset(preset)}>
                {presetLabel(preset.id)}
              </button>
            ))}
          </div>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.area}
          <input className={inputClass} inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.storm}
            <input className={inputClass} inputMode="decimal" value={storm} onChange={(e) => setStorm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.annual}
            <input className={inputClass} inputMode="decimal" value={annual} onChange={(e) => setAnnual(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.coeff}
            <input className={inputClass} inputMode="decimal" value={coeff} onChange={(e) => setCoeff(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.flush}
            <input className={inputClass} inputMode="decimal" value={flush} onChange={(e) => setFlush(e.target.value)} placeholder="0" />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.barrel}
            <input className={inputClass} inputMode="decimal" value={barrel} onChange={(e) => setBarrel(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.daily}
            <input className={inputClass} inputMode="decimal" value={daily} onChange={(e) => setDaily(e.target.value)} placeholder="0" />
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
                <dt className="text-muted-foreground">{copy.stormOut}</dt>
                <dd className="font-medium">{formatNum(result.stormNet)} L</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.gallons}</dt>
                <dd className="font-medium">{formatNum(result.gallons)} gal</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.barrels}</dt>
                <dd className="font-medium">{result.barrels}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.annualOut}</dt>
                <dd className="font-medium">{formatNum(result.annualCapture, 0)} L</dd>
              </div>
              {result.days != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.days}</dt>
                  <dd className="font-medium">{formatNum(result.days, 1)}</dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">{copy.note}</p>
            <button type="button" className={`${buttonClass} mt-4 w-full sm:w-auto`} onClick={copyResult}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}