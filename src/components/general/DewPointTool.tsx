import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import type { Locale } from "@/lib/i18n/locale";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formatNum(value: number, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

type Scale = "c" | "f";

type Preset = { id: string; scale: Scale; temp: string; humidity: string };

const PRESETS: Preset[] = [
  { id: "room", scale: "c", temp: "22", humidity: "45" },
  { id: "humid", scale: "c", temp: "30", humidity: "70" },
  { id: "night", scale: "c", temp: "5", humidity: "90" },
  { id: "desert", scale: "c", temp: "35", humidity: "15" },
];

/** August–Roche–Magnus (Alduchov & Eskridge): a = 17.625, b = 243.04 °C. */
function dewPointC(tempC: number, rh: number) {
  const a = 17.625;
  const b = 243.04;
  const gamma = Math.log(rh / 100) + (a * tempC) / (b + tempC);
  return (b * gamma) / (a - gamma);
}

export function DewPointTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [scale, setScale] = useState<Scale>("c");
  const [temp, setTemp] = useState("22");
  const [humidity, setHumidity] = useState("45");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá el punto de rocío a partir de la temperatura del aire y la humedad relativa. No es la sensación térmica: el índice de calor mide cómo se siente el calor, y la sensación del viento la mide otra herramienta.",
        presets: "Presets",
        room: "Ambiente confortable",
        humid: "Tarde húmeda",
        night: "Noche con rocío",
        desert: "Aire seco",
        scale: "Escala",
        c: "Celsius",
        f: "Fahrenheit",
        temp: scale === "c" ? "Temperatura del aire (°C)" : "Temperatura del aire (°F)",
        humidity: "Humedad relativa (%)",
        result: "Punto de rocío",
        air: "Aire",
        spread: "Diferencia",
        band: "Banda de confort",
        method: "Método",
        methodValue: "August–Roche–Magnus",
        note: "Fórmula sobre agua líquida (a = 17,625, b = 243,04 °C). Bajo 0 °C no es el punto de escarcha. No es un pronóstico.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
        errTemp: "La temperatura tiene que estar entre −40 y 60 °C (o el equivalente en °F).",
        errRh: "La humedad tiene que estar entre 1 y 100%. En 0% el punto de rocío no está definido.",
        frost: "Bajo cero: es punto de rocío sobre agua, no punto de escarcha sobre hielo.",
        dry: "Seco",
        comfortable: "Confortable",
        slight: "Algo húmedo",
        muggy: "Bochornoso",
        very: "Muy húmedo",
        oppressive: "Opresivo",
        margin: "antes de condensar",
      }
    : {
        help: "Estimate dew point from air temperature and relative humidity. This is not the feels-like temperature; the heat index covers heat, and the wind-chill tool covers wind.",
        presets: "Presets",
        room: "Comfortable room",
        humid: "Humid afternoon",
        night: "Dewy night",
        desert: "Dry air",
        scale: "Scale",
        c: "Celsius",
        f: "Fahrenheit",
        temp: scale === "c" ? "Air temperature (°C)" : "Air temperature (°F)",
        humidity: "Relative humidity (%)",
        result: "Dew point",
        air: "Air",
        spread: "Spread",
        band: "Comfort band",
        method: "Method",
        methodValue: "August–Roche–Magnus",
        note: "Formula over liquid water (a = 17.625, b = 243.04 °C). Below 0 °C this is not the frost point. Not a forecast.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
        errTemp: "Temperature must be between −40 and 60 °C (or the Fahrenheit equivalent).",
        errRh: "Humidity must be between 1 and 100%. At 0% the dew point is undefined.",
        frost: "Below freezing: this is the dew point over water, not the frost point over ice.",
        dry: "Dry",
        comfortable: "Comfortable",
        slight: "Slightly humid",
        muggy: "Muggy",
        very: "Very humid",
        oppressive: "Oppressive",
        margin: "before condensation",
      };

  const result = useMemo(() => {
    const air = parseNum(temp);
    if (air == null) return { error: copy.errTemp };
    const airC = scale === "c" ? air : (air - 32) / 1.8;
    if (airC < -40 || airC > 60) return { error: copy.errTemp };
    const rh = parseNum(humidity);
    if (rh == null || rh < 1 || rh > 100) return { error: copy.errRh };
    const tdC = dewPointC(airC, rh);
    const td = scale === "c" ? tdC : tdC * 1.8 + 32;
    const spread = air - td;
    let band = copy.dry;
    if (tdC >= 24) band = copy.oppressive;
    else if (tdC >= 21) band = copy.very;
    else if (tdC >= 18) band = copy.muggy;
    else if (tdC >= 16) band = copy.slight;
    else if (tdC >= 10) band = copy.comfortable;
    return {
      td,
      air,
      spread,
      band,
      frost: tdC < 0,
      unit: scale === "c" ? "°C" : "°F",
    };
  }, [copy, humidity, scale, temp]);

  function applyPreset(preset: Preset) {
    setScale(preset.scale);
    setTemp(preset.temp);
    setHumidity(preset.humidity);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Punto de rocío: ${formatNum(result.td)} ${result.unit} (aire ${formatNum(result.air)} ${result.unit}, ${result.band}).`
      : `Dew point: ${formatNum(result.td)} ${result.unit} (air ${formatNum(result.air)} ${result.unit}, ${result.band}).`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "room" ? copy.room : id === "humid" ? copy.humid : id === "night" ? copy.night : copy.desert;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={buttonClass} onClick={() => applyPreset(preset)}>
                {presetLabel(preset.id)}
              </button>
            ))}
          </div>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.scale}
          <select className={inputClass} value={scale} onChange={(e) => setScale(e.target.value as Scale)}>
            <option value="c">{copy.c}</option>
            <option value="f">{copy.f}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {copy.temp}
          <input className={inputClass} inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder={es ? "ej. 22" : "e.g. 22"} />
        </label>
        <label className="grid gap-1 text-sm">
          {copy.humidity}
          <input className={inputClass} inputMode="decimal" value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder={es ? "ej. 45" : "e.g. 45"} />
        </label>
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
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {formatNum(result.td)} {result.unit}
            </p>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.air}</dt>
                <dd className="font-medium">
                  {formatNum(result.air)} {result.unit}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.spread}</dt>
                <dd className="font-medium">
                  {formatNum(result.spread)} {result.unit} {copy.margin}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.band}</dt>
                <dd className="font-medium">{result.band}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.method}</dt>
                <dd className="font-medium">{copy.methodValue}</dd>
              </div>
            </dl>
            {result.frost && <p className="mt-3 text-sm text-destructive">{copy.frost}</p>}
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
