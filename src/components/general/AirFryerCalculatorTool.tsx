import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Direction = "oven-to-air" | "air-to-oven";
type Unit = "C" | "F";
type PresetId = "general" | "fries" | "veg" | "chicken" | "fish" | "bake" | "frozen" | "reheat";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, digits = 0) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

function cToF(c: number) {
  return (c * 9) / 5 + 32;
}

function fToC(f: number) {
  return ((f - 32) * 5) / 9;
}

type Preset = {
  id: PresetId;
  deltaC: number;
  factor: number;
};

const PRESETS: Preset[] = [
  { id: "general", deltaC: 20, factor: 0.8 },
  { id: "fries", deltaC: 20, factor: 0.75 },
  { id: "veg", deltaC: 15, factor: 0.75 },
  { id: "chicken", deltaC: 15, factor: 0.8 },
  { id: "fish", deltaC: 20, factor: 0.7 },
  { id: "bake", deltaC: 20, factor: 0.8 },
  { id: "frozen", deltaC: 20, factor: 0.85 },
  { id: "reheat", deltaC: 20, factor: 0.5 },
];

export function AirFryerCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [direction, setDirection] = useState<Direction>("oven-to-air");
  const [unit, setUnit] = useState<Unit>("C");
  const [presetId, setPresetId] = useState<PresetId>("general");
  const [temp, setTemp] = useState("180");
  const [minutes, setMinutes] = useState("25");
  const [delta, setDelta] = useState("20");
  const [cut, setCut] = useState("20");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Convertí temperatura y tiempo de horno a un ajuste de freidora de aire, o al revés. Los presets aplican la baja habitual y un recorte de tiempo según la comida.",
        direction: "Sentido",
        ovenToAir: "Horno → freidora",
        airToOven: "Freidora → horno",
        unit: "Unidad",
        presets: "Presets",
        general: "Regla general",
        fries: "Papas",
        veg: "Verduras",
        chicken: "Pollo",
        fish: "Pescado",
        bake: "Horneados",
        frozen: "Congelado",
        reheat: "Recalentar",
        temp: "Temperatura de la receta",
        time: "Tiempo de la receta (min)",
        delta: "Baja de temperatura",
        cut: "Recorte de tiempo (%)",
        result: "Ajuste sugerido",
        outTemp: "Temperatura",
        outTime: "Tiempo",
        check: "Revisar desde",
        note: "Nota",
        range: "Ventana",
        copy: "Copiar resultado",
        copied: "Copiado",
        reset: "Reiniciar",
        empty: "Completá temperatura y tiempo para ver el ajuste.",
        invalid: "Usá números válidos. La temperatura y el tiempo tienen que ser mayores que cero.",
        cutRange: "El recorte de tiempo tiene que estar entre 0 y 80%.",
        deltaRange: "La baja de temperatura tiene que estar entre 0 y 60° en la unidad elegida.",
        hot: "Queda por encima de 200°C. Muchas freidoras no llegan: usá el máximo del equipo y sumá unos minutos.",
        cool: "Queda por debajo de 80°C. Puede no dorar; subí la temperatura si el manual lo permite.",
        poultry: "En pollo, confirmá 74°C (165°F) en la parte más gruesa. Este número no garantiza el punto.",
        min: "min",
      }
    : {
        help: "Convert oven temperature and time into an air fryer setting, or reverse it. Presets apply the usual temperature drop and a food-specific time cut.",
        direction: "Direction",
        ovenToAir: "Oven → air fryer",
        airToOven: "Air fryer → oven",
        unit: "Unit",
        presets: "Presets",
        general: "General rule",
        fries: "Fries",
        veg: "Vegetables",
        chicken: "Chicken",
        fish: "Fish",
        bake: "Baking",
        frozen: "Frozen",
        reheat: "Reheat",
        temp: "Recipe temperature",
        time: "Recipe time (min)",
        delta: "Temperature drop",
        cut: "Time cut (%)",
        result: "Suggested setting",
        outTemp: "Temperature",
        outTime: "Time",
        check: "Start checking at",
        note: "Note",
        range: "Window",
        copy: "Copy result",
        copied: "Copied",
        reset: "Reset",
        empty: "Enter temperature and time to see the setting.",
        invalid: "Use valid numbers. Temperature and time must be greater than zero.",
        cutRange: "Time cut must be between 0 and 80%.",
        deltaRange: "Temperature drop must be between 0 and 60 degrees in the selected unit.",
        hot: "Above 200°C. Many air fryers cannot reach that: use the machine max and add a few minutes.",
        cool: "Below 80°C. It may not brown; raise the temperature if the manual allows it.",
        poultry: "For chicken, confirm 74°C (165°F) in the thickest part. This number does not guarantee doneness.",
        min: "min",
      };

  const presetLabels: Record<PresetId, string> = {
    general: copy.general,
    fries: copy.fries,
    veg: copy.veg,
    chicken: copy.chicken,
    fish: copy.fish,
    bake: copy.bake,
    frozen: copy.frozen,
    reheat: copy.reheat,
  };

  const notes: Record<PresetId, string> = es
    ? {
        general: "Punto de partida de manuales: unos 20°C menos y revisar un 20% antes. No apiles la cubeta.",
        fries: "Sacudí la cubeta a la mitad. Una sola capa dora más parejo.",
        veg: "Las verduras sueltan agua: no llenes la cubeta y revisá el dorado.",
        chicken: "Bajá menos la temperatura para que el centro se cocine. Confirmá 74°C internos.",
        fish: "El pescado se pasa rápido. Revisá antes y no lo des vuelta si se desarma.",
        bake: "Los bizcochos suben menos que en horno. No uses moldes que tapen el flujo de aire.",
        frozen: "No descongeles si el paquete dice que va directo. Separá las piezas a la mitad.",
        reheat: "Ya está cocido: menos tiempo y una pasada corta para recuperar textura.",
      }
    : {
        general: "Manual starting point: about 20°C lower and check 20% earlier. Do not stack the basket.",
        fries: "Shake the basket halfway. A single layer browns more evenly.",
        veg: "Vegetables release water: do not fill the basket and watch the browning.",
        chicken: "Drop less temperature so the center still cooks. Confirm 74°C internal.",
        fish: "Fish overcooks quickly. Check early and avoid flipping if it falls apart.",
        bake: "Cakes rise less than in an oven. Do not use pans that block airflow.",
        frozen: "Skip thawing if the pack says cook from frozen. Separate pieces halfway.",
        reheat: "Already cooked: a shorter blast is enough to bring texture back.",
      };

  function applyPreset(id: PresetId) {
    const preset = PRESETS.find((item) => item.id === id) ?? PRESETS[0];
    setPresetId(id);
    const drop = unit === "C" ? preset.deltaC : Math.round((preset.deltaC * 9) / 5);
    setDelta(String(drop));
    setCut(String(Math.round((1 - preset.factor) * 100)));
  }

  function switchUnit(next: Unit) {
    if (next === unit) return;
    const current = parseNum(temp);
    const drop = parseNum(delta);
    if (current != null && !Number.isNaN(current)) {
      const converted = next === "F" ? cToF(current) : fToC(current);
      setTemp(String(Math.round(converted)));
    }
    if (drop != null && !Number.isNaN(drop)) {
      const converted = next === "F" ? (drop * 9) / 5 : (drop * 5) / 9;
      setDelta(String(Math.round(converted)));
    }
    setUnit(next);
  }

  const result = useMemo(() => {
    const temperature = parseNum(temp);
    const time = parseNum(minutes);
    const drop = parseNum(delta);
    const cutPct = parseNum(cut);
    if (temperature == null || time == null || drop == null || cutPct == null) return { error: copy.empty as string };
    if ([temperature, time, drop, cutPct].some((n) => Number.isNaN(n)) || temperature <= 0 || time <= 0) {
      return { error: copy.invalid as string };
    }
    if (cutPct < 0 || cutPct > 80) return { error: copy.cutRange as string };
    if (drop < 0 || drop > 60) return { error: copy.deltaRange as string };

    const tempC = unit === "C" ? temperature : fToC(temperature);
    const dropC = unit === "C" ? drop : (drop * 5) / 9;
    const factor = 1 - cutPct / 100;
    const toAir = direction === "oven-to-air";
    const outC = toAir ? tempC - dropC : tempC + dropC;
    const outMin = toAir ? time * factor : time / factor;
    const checkMin = toAir ? outMin * 0.8 : outMin * 0.9;
    const warnings: string[] = [];
    if (outC > 200) warnings.push(copy.hot);
    if (outC < 80) warnings.push(copy.cool);
    if (presetId === "chicken") warnings.push(copy.poultry);
    return { outC, outMin, checkMin, warnings };
  }, [temp, minutes, delta, cut, unit, direction, presetId, copy]);

  const displayTemp = (celsius: number) => (unit === "C" ? celsius : cToF(celsius));

  async function onCopy() {
    if ("error" in result) return;
    const label = direction === "oven-to-air" ? copy.ovenToAir : copy.airToOven;
    const text = [
      `${label} · ${presetLabels[presetId]}`,
      `${copy.outTemp}: ${formatNum(displayTemp(result.outC), 0)}°${unit}`,
      `${copy.outTime}: ${formatNum(result.outMin, 1)} ${copy.min}`,
      `${copy.check}: ${formatNum(result.checkMin, 1)} ${copy.min}`,
      notes[presetId],
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function onReset() {
    setDirection("oven-to-air");
    setUnit("C");
    setPresetId("general");
    setTemp("180");
    setMinutes("25");
    setDelta("20");
    setCut("20");
    setCopied(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{copy.help}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">{copy.direction}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button type="button" className={`${buttonClass} w-full ${direction === "oven-to-air" ? "bg-muted" : ""}`} onClick={() => setDirection("oven-to-air")}>
              {copy.ovenToAir}
            </button>
            <button type="button" className={`${buttonClass} w-full ${direction === "air-to-oven" ? "bg-muted" : ""}`} onClick={() => setDirection("air-to-oven")}>
              {copy.airToOven}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">{copy.unit}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={`${buttonClass} w-full ${unit === "C" ? "bg-muted" : ""}`} onClick={() => switchUnit("C")}>
              °C
            </button>
            <button type="button" className={`${buttonClass} w-full ${unit === "F" ? "bg-muted" : ""}`} onClick={() => switchUnit("F")}>
              °F
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{copy.presets}</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`${buttonClass} ${presetId === preset.id ? "bg-muted" : ""}`}
              onClick={() => applyPreset(preset.id)}
            >
              {presetLabels[preset.id]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">{copy.temp} (°{unit})</span>
          <input className={inputClass} inputMode="decimal" value={temp} onChange={(event) => setTemp(event.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">{copy.time}</span>
          <input className={inputClass} inputMode="decimal" value={minutes} onChange={(event) => setMinutes(event.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">{copy.delta} (°{unit})</span>
          <input className={inputClass} inputMode="decimal" value={delta} onChange={(event) => setDelta(event.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">{copy.cut}</span>
          <input className={inputClass} inputMode="decimal" value={cut} onChange={(event) => setCut(event.target.value)} />
        </label>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-sm font-medium">{copy.result}</p>
        {"error" in result ? (
          <p className="mt-2 text-sm text-muted-foreground">{result.error}</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">{copy.outTemp}</p>
              <p className="text-xl font-semibold">{formatNum(displayTemp(result.outC), 0)}°{unit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.outTime}</p>
              <p className="text-xl font-semibold">{formatNum(result.outMin, 1)} {copy.min}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.check}</p>
              <p className="text-xl font-semibold">{formatNum(result.checkMin, 1)} {copy.min}</p>
            </div>
            <p className="text-sm text-muted-foreground sm:col-span-3">{notes[presetId]}</p>
            {result.warnings.map((warning) => (
              <p key={warning} className="text-sm sm:col-span-3">{warning}</p>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" className={`${buttonClass} w-full`} onClick={onCopy} disabled={"error" in result}>
          {copied ? copy.copied : copy.copy}
        </button>
        <button type="button" className={`${buttonClass} w-full`} onClick={onReset}>
          {copy.reset}
        </button>
      </div>
    </div>
  );
}
