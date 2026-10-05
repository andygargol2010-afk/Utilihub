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
type Mode = "heat" | "wind";
type Speed = "kmh" | "mph";

type Preset = {
  id: string;
  mode: Mode;
  scale: Scale;
  temp: string;
  humidity: string;
  wind: string;
  speed: Speed;
};

const PRESETS: Preset[] = [
  { id: "humid", mode: "heat", scale: "c", temp: "32", humidity: "70", wind: "15", speed: "kmh" },
  { id: "extreme", mode: "heat", scale: "c", temp: "40", humidity: "40", wind: "10", speed: "kmh" },
  { id: "breeze", mode: "wind", scale: "c", temp: "0", humidity: "50", wind: "20", speed: "kmh" },
  { id: "cold", mode: "wind", scale: "c", temp: "-15", humidity: "50", wind: "40", speed: "kmh" },
];

function toF(temp: number, scale: Scale) {
  return scale === "f" ? temp : temp * 1.8 + 32;
}

function fromF(tempF: number, scale: Scale) {
  return scale === "f" ? tempF : (tempF - 32) / 1.8;
}

function heatIndexF(tempF: number, rh: number) {
  const simple = 0.5 * (tempF + 61 + (tempF - 68) * 1.2 + rh * 0.094);
  if (simple < 80) return { hi: simple, method: "simple" as const };
  let hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * rh -
    0.22475541 * tempF * rh -
    0.00683783 * tempF * tempF -
    0.05481717 * rh * rh +
    0.00122874 * tempF * tempF * rh +
    0.00085282 * tempF * rh * rh -
    0.00000199 * tempF * tempF * rh * rh;
  if (rh < 13 && tempF >= 80 && tempF <= 112) {
    hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
  } else if (rh > 85 && tempF >= 80 && tempF <= 87) {
    hi += ((rh - 85) / 10) * ((87 - tempF) / 5);
  }
  return { hi, method: "rothfusz" as const };
}

function windChillF(tempF: number, mph: number) {
  const v = Math.pow(mph, 0.16);
  return 35.74 + 0.6215 * tempF - 35.75 * v + 0.4275 * tempF * v;
}

export function HeatIndexTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<Mode>("heat");
  const [scale, setScale] = useState<Scale>("c");
  const [temp, setTemp] = useState("32");
  const [humidity, setHumidity] = useState("70");
  const [wind, setWind] = useState("20");
  const [speed, setSpeed] = useState<Speed>("kmh");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá la sensación térmica: índice de calor con humedad, o wind chill con viento. No convierte solo la escala: para eso está el conversor de temperatura.",
        presets: "Presets",
        humid: "Tarde húmeda",
        extreme: "Calor extremo",
        breeze: "Frío con brisa",
        cold: "Frío severo",
        mode: "Modo",
        heat: "Índice de calor",
        windMode: "Wind chill",
        scale: "Escala",
        c: "Celsius",
        f: "Fahrenheit",
        temp: scale === "c" ? "Temperatura del aire (°C)" : "Temperatura del aire (°F)",
        humidity: "Humedad relativa (%)",
        wind: speed === "kmh" ? "Viento (km/h)" : "Viento (mph)",
        speed: "Unidad de viento",
        kmh: "km/h",
        mph: "mph",
        result: "Sensación térmica",
        feels: "Se siente como",
        air: "Aire",
        delta: "Diferencia",
        band: "Banda de planificación",
        method: "Método",
        note: "Índice de calor: regresión Rothfusz del NWS (con el ajuste simple bajo 80 °F). Wind chill: fórmula NWS 2001. No es consejo médico.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
        errTemp: "La temperatura tiene que estar entre −60 y 55 °C (o el equivalente en °F).",
        errRh: "La humedad tiene que estar entre 0 y 100%.",
        errWind: "El viento tiene que estar entre 0 y 150 km/h (o el equivalente en mph).",
        limited: "Fuera del rango habitual de la fórmula. El número es orientativo.",
        simple: "Fórmula simple (resultado bajo 80 °F)",
        rothfusz: "Rothfusz (NWS)",
        nws: "NWS 2001",
        caution: "Precaución",
        extremeCaution: "Precaución extrema",
        danger: "Peligro",
        extremeDanger: "Peligro extremo",
        low: "Riesgo bajo de congelación",
        belowCaution: "Debajo de la banda de precaución del NWS",
        min30: "Congelación posible en unos 30 min",
        min10: "Congelación posible en unos 10 min",
        min5: "Congelación posible en unos 5 min",
        warmer: "más cálido",
        cooler: "más frío",
        same: "igual que el aire",
      }
    : {
        help: "Estimate feels-like temperature: heat index from humidity, or wind chill from wind. It does not only convert the scale; the temperature converter does that.",
        presets: "Presets",
        humid: "Humid afternoon",
        extreme: "Extreme heat",
        breeze: "Cold breeze",
        cold: "Severe cold",
        mode: "Mode",
        heat: "Heat index",
        windMode: "Wind chill",
        scale: "Scale",
        c: "Celsius",
        f: "Fahrenheit",
        temp: scale === "c" ? "Air temperature (°C)" : "Air temperature (°F)",
        humidity: "Relative humidity (%)",
        wind: speed === "kmh" ? "Wind (km/h)" : "Wind (mph)",
        speed: "Wind unit",
        kmh: "km/h",
        mph: "mph",
        result: "Feels like",
        feels: "Feels like",
        air: "Air",
        delta: "Difference",
        band: "Planning band",
        method: "Method",
        note: "Heat index uses the NWS Rothfusz regression (simple formula below 80 °F). Wind chill uses the 2001 NWS equation. Not medical advice.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
        errTemp: "Temperature must be between −60 and 55 °C (or the Fahrenheit equivalent).",
        errRh: "Humidity must be between 0 and 100%.",
        errWind: "Wind must be between 0 and 150 km/h (or the mph equivalent).",
        limited: "Outside the usual formula range. Treat the number as a guide.",
        simple: "Simple formula (result under 80 °F)",
        rothfusz: "Rothfusz (NWS)",
        nws: "NWS 2001",
        caution: "Caution",
        extremeCaution: "Extreme caution",
        danger: "Danger",
        extremeDanger: "Extreme danger",
        low: "Low frostbite risk",
        belowCaution: "Below the NWS caution band",
        min30: "Frostbite possible in about 30 min",
        min10: "Frostbite possible in about 10 min",
        min5: "Frostbite possible in about 5 min",
        warmer: "warmer",
        cooler: "cooler",
        same: "same as the air",
      };

  const result = useMemo(() => {
    const air = parseNum(temp);
    if (air == null) return { error: copy.errTemp };
    const airC = scale === "c" ? air : (air - 32) / 1.8;
    if (airC < -60 || airC > 55) return { error: copy.errTemp };
    const airF = toF(air, scale);
    if (mode === "heat") {
      const rh = parseNum(humidity);
      if (rh == null || rh < 0 || rh > 100) return { error: copy.errRh };
      const computed = heatIndexF(airF, rh);
      const feelsF = computed.hi;
      const feels = fromF(feelsF, scale);
      const valid = airF >= 80 && rh >= 40;
      let band = copy.belowCaution;
      if (feelsF >= 125) band = copy.extremeDanger;
      else if (feelsF >= 103) band = copy.danger;
      else if (feelsF >= 90) band = copy.extremeCaution;
      else if (feelsF >= 80) band = copy.caution;
      return {
        feels,
        air,
        delta: feels - air,
        band,
        method: computed.method === "simple" ? copy.simple : copy.rothfusz,
        limited: !valid,
        unit: scale === "c" ? "°C" : "°F",
      };
    }
    const windRaw = parseNum(wind);
    if (windRaw == null) return { error: copy.errWind };
    const kmh = speed === "kmh" ? windRaw : windRaw * 1.609344;
    if (kmh < 0 || kmh > 150) return { error: copy.errWind };
    const mph = kmh / 1.609344;
    const valid = airF <= 50 && mph >= 3;
    const feelsF = mph < 3 ? airF : windChillF(airF, mph);
    const feels = fromF(feelsF, scale);
    let band = copy.low;
    if (feelsF <= -35) band = copy.min5;
    else if (feelsF <= -15) band = copy.min10;
    else if (feelsF <= 0) band = copy.min30;
    return {
      feels,
      air,
      delta: feels - air,
      band,
      method: copy.nws,
      limited: !valid,
      unit: scale === "c" ? "°C" : "°F",
    };
  }, [copy, humidity, mode, scale, speed, temp, wind]);

  function applyPreset(preset: Preset) {
    setMode(preset.mode);
    setScale(preset.scale);
    setTemp(preset.temp);
    setHumidity(preset.humidity);
    setWind(preset.wind);
    setSpeed(preset.speed);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Sensación térmica: ${formatNum(result.feels)} ${result.unit} (aire ${formatNum(result.air)} ${result.unit}, ${result.band}).`
      : `Feels like ${formatNum(result.feels)} ${result.unit} (air ${formatNum(result.air)} ${result.unit}, ${result.band}).`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "humid" ? copy.humid : id === "extreme" ? copy.extreme : id === "breeze" ? copy.breeze : copy.cold;

  const deltaLabel = (delta: number) => {
    if (Math.abs(delta) < 0.05) return copy.same;
    const word = delta > 0 ? copy.warmer : copy.cooler;
    return `${formatNum(Math.abs(delta))} ${word}`;
  };

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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.mode}
            <select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="heat">{copy.heat}</option>
              <option value="wind">{copy.windMode}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.scale}
            <select className={inputClass} value={scale} onChange={(e) => setScale(e.target.value as Scale)}>
              <option value="c">{copy.c}</option>
              <option value="f">{copy.f}</option>
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.temp}
          <input className={inputClass} inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} />
        </label>
        {mode === "heat" ? (
          <label className="grid gap-1 text-sm">
            {copy.humidity}
            <input className={inputClass} inputMode="decimal" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
          </label>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              {copy.wind}
              <input className={inputClass} inputMode="decimal" value={wind} onChange={(e) => setWind(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.speed}
              <select className={inputClass} value={speed} onChange={(e) => setSpeed(e.target.value as Speed)}>
                <option value="kmh">{copy.kmh}</option>
                <option value="mph">{copy.mph}</option>
              </select>
            </label>
          </div>
        )}
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
              {formatNum(result.feels)} {result.unit}
            </p>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.air}</dt>
                <dd className="font-medium">
                  {formatNum(result.air)} {result.unit}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.delta}</dt>
                <dd className="font-medium">{deltaLabel(result.delta)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.band}</dt>
                <dd className="font-medium">{result.band}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.method}</dt>
                <dd className="font-medium">{result.method}</dd>
              </div>
            </dl>
            {result.limited && <p className="mt-3 text-sm text-destructive">{copy.limited}</p>}
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
