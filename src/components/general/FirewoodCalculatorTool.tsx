import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Shape = "stack" | "volume";
type Species = "oak" | "birch" | "maple" | "pine" | "mixed" | "custom";
type Moisture = "seasoned" | "green";
type PresetId = "half" | "face" | "stere" | "loose";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

/** Seasoned solid-wood density, kg per cubic meter. */
const DENSITY: Record<Exclude<Species, "custom">, number> = {
  oak: 720,
  birch: 640,
  maple: 680,
  pine: 450,
  mixed: 600,
};

const CORD_M3 = 3.62455636378;
const M_PER_FT = 0.3048;
const GREEN_FACTOR = 1.4;

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
  id: PresetId;
  unit: Unit;
  length: string;
  height: string;
  depth: string;
  volume: string;
  species: Species;
  solid: string;
  moisture: Moisture;
};

const PRESETS: Preset[] = [
  { id: "half", unit: "ft", length: "8", height: "4", depth: "2", volume: "64", species: "oak", solid: "65", moisture: "seasoned" },
  { id: "face", unit: "ft", length: "8", height: "4", depth: "1.333", volume: "42.7", species: "mixed", solid: "65", moisture: "seasoned" },
  { id: "stere", unit: "m", length: "2", height: "1", depth: "0.5", volume: "1", species: "birch", solid: "65", moisture: "seasoned" },
  { id: "loose", unit: "m", length: "3", height: "1.5", depth: "0.4", volume: "1.8", species: "pine", solid: "50", moisture: "green" },
];

export function FirewoodCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("ft");
  const [shape, setShape] = useState<Shape>("stack");
  const [length, setLength] = useState("8");
  const [height, setHeight] = useState("4");
  const [depth, setDepth] = useState("2");
  const [knownVolume, setKnownVolume] = useState("64");
  const [species, setSpecies] = useState<Species>("oak");
  const [customDensity, setCustomDensity] = useState("720");
  const [solidPct, setSolidPct] = useState("65");
  const [moisture, setMoisture] = useState<Moisture>("seasoned");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá cuerdas, face cords, estéreos y peso de una pila de leña. Una cuerda son 128 ft³ apilados; el peso depende de la especie y de si está seca.",
        presets: "Presets",
        half: "Media cuerda",
        face: "Face cord 16 in",
        stere: "1 estéreo abedul",
        loose: "Pino verde flojo",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        shape: "Entrada",
        stack: "Pila (largo × alto × fondo)",
        known: "Volumen apilado conocido",
        length: unit === "m" ? "Largo de la pila (m)" : "Largo de la pila (ft)",
        height: unit === "m" ? "Alto (m)" : "Alto (ft)",
        depth: unit === "m" ? "Fondo / largo del tronco (m)" : "Fondo / largo del tronco (ft)",
        volume: unit === "m" ? "Volumen apilado (m³)" : "Volumen apilado (ft³)",
        species: "Especie",
        oak: "Roble",
        birch: "Abedul",
        maple: "Arce",
        pine: "Pino",
        mixed: "Mezcla",
        custom: "Densidad propia",
        density: "Densidad sólida seca (kg/m³)",
        solid: "Parte sólida (%)",
        moisture: "Humedad",
        seasoned: "Seca",
        green: "Verde",
        price: "Precio por cuerda (opcional)",
        result: "Resultado",
        stacked: "Volumen apilado",
        cords: "Cuerdas",
        faces: "Face cords",
        steres: "Estéreos",
        solidVol: "Madera sólida",
        weight: "Peso estimado",
        cost: "Material estimado",
        note: "Un face cord es 4×8 ft por el largo del tronco. Solo vale 1/3 de cuerda si el tronco mide 16 in. La leña verde pesa 1,4 veces la seca.",
        empty: "Completá la pila o el volumen, la parte sólida y la densidad.",
        invalid: "Usá números válidos mayores que cero. Los decimales pueden llevar coma o punto.",
        solidInvalid: "La parte sólida tiene que estar entre 40% y 80%.",
        densityInvalid: "La densidad tiene que estar entre 300 y 1.000 kg/m³.",
        depthInvalid: "El fondo del tronco tiene que ser mayor que cero para calcular face cords.",
        tooBig: "La pila supera el límite de planificación (200 m³ o 7.000 ft³).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate cords, face cords, steres, and weight of a firewood stack. A cord is 128 stacked cubic feet; weight depends on species and whether the wood is seasoned.",
        presets: "Presets",
        half: "Half cord",
        face: "16 in face cord",
        stere: "1 stere birch",
        loose: "Loose green pine",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        shape: "Input",
        stack: "Stack (length × height × depth)",
        known: "Known stacked volume",
        length: unit === "m" ? "Stack length (m)" : "Stack length (ft)",
        height: unit === "m" ? "Height (m)" : "Height (ft)",
        depth: unit === "m" ? "Depth / log length (m)" : "Depth / log length (ft)",
        volume: unit === "m" ? "Stacked volume (m³)" : "Stacked volume (ft³)",
        species: "Species",
        oak: "Oak",
        birch: "Birch",
        maple: "Maple",
        pine: "Pine",
        mixed: "Mixed",
        custom: "Custom density",
        density: "Seasoned solid density (kg/m³)",
        solid: "Solid wood share (%)",
        moisture: "Moisture",
        seasoned: "Seasoned",
        green: "Green",
        price: "Price per cord (optional)",
        result: "Result",
        stacked: "Stacked volume",
        cords: "Cords",
        faces: "Face cords",
        steres: "Steres",
        solidVol: "Solid wood",
        weight: "Estimated weight",
        cost: "Estimated material",
        note: "A face cord is 4×8 ft times the log length. It is one third of a cord only at 16 in. Green wood weighs 1.4 times seasoned wood.",
        empty: "Enter the stack or volume, the solid share, and the density.",
        invalid: "Use valid numbers greater than zero. Decimals can use a comma or a dot.",
        solidInvalid: "Solid share must be between 40% and 80%.",
        densityInvalid: "Density must be between 300 and 1,000 kg/m³.",
        depthInvalid: "Log depth must be greater than zero to count face cords.",
        tooBig: "The stack is above the planning limit (200 m³ or 7,000 ft³).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const solid = parseNum(solidPct);
    const densityInput = parseNum(customDensity);
    const len = shape === "stack" ? parseNum(length) : 1;
    const h = shape === "stack" ? parseNum(height) : 1;
    const d = parseNum(depth);
    const known = shape === "volume" ? parseNum(knownVolume) : null;
    if (solid == null || densityInput == null || d == null || (shape === "stack" && (len == null || h == null)) || (shape === "volume" && known == null)) {
      return { error: copy.empty };
    }
    if (
      [solid, densityInput, d].some((n) => Number.isNaN(n)) ||
      (shape === "stack" && [len, h].some((n) => n == null || Number.isNaN(n) || n <= 0)) ||
      (shape === "volume" && (known == null || Number.isNaN(known) || known <= 0))
    ) {
      return { error: copy.invalid };
    }
    if (d <= 0) return { error: copy.depthInvalid };
    if (solid < 40 || solid > 80) return { error: copy.solidInvalid };
    const density = species === "custom" ? densityInput : DENSITY[species];
    if (density < 300 || density > 1000) return { error: copy.densityInvalid };
    const stackedDisplay = shape === "stack" ? (len as number) * (h as number) * d : (known as number);
    const limit = unit === "m" ? 200 : 7000;
    if (stackedDisplay > limit) return { error: copy.tooBig };
    const stackedM3 = unit === "m" ? stackedDisplay : stackedDisplay * M_PER_FT ** 3;
    const depthM = unit === "m" ? d : d * M_PER_FT;
    const cords = stackedM3 / CORD_M3;
    const faceM3 = 32 * M_PER_FT ** 2 * depthM;
    const faces = stackedM3 / faceM3;
    const solidM3 = stackedM3 * (solid / 100);
    const weightKg = solidM3 * density * (moisture === "green" ? GREEN_FACTOR : 1);
    const unitPrice = parseNum(price);
    if (price.trim() !== "" && (unitPrice == null || Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.invalid };
    const cost = price.trim() === "" || unitPrice == null ? null : cords * unitPrice;
    return { stackedM3, cords, faces, solidM3, weightKg, cost, density };
  }, [shape, length, height, depth, knownVolume, species, customDensity, solidPct, moisture, price, unit, copy.empty, copy.invalid, copy.solidInvalid, copy.densityInvalid, copy.depthInvalid, copy.tooBig]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLength(preset.length);
    setHeight(preset.height);
    setDepth(preset.depth);
    setKnownVolume(preset.volume);
    setSpecies(preset.species);
    setCustomDensity(String(DENSITY[preset.species === "custom" ? "oak" : preset.species]));
    setSolidPct(preset.solid);
    setMoisture(preset.moisture);
    setCopied(false);
  }

  function reset() {
    setShape("stack");
    setPrice("");
    applyPreset(PRESETS[0]);
  }

  function onSpecies(next: Species) {
    setSpecies(next);
    if (next === "custom") return;
    setCustomDensity(String(DENSITY[next]));
  }

  async function copyResult() {
    if ("error" in result) return;
    const vol = unit === "m" ? result.stackedM3 : result.stackedM3 / M_PER_FT ** 3;
    const volUnit = unit === "m" ? "m³" : "ft³";
    const lines = [
      `${copy.stacked}: ${formatNum(vol, 2)} ${volUnit}`,
      `${copy.cords}: ${formatNum(result.cords, 2)}`,
      `${copy.faces}: ${formatNum(result.faces, 2)}`,
      `${copy.steres}: ${formatNum(result.stackedM3, 2)}`,
      `${copy.solidVol}: ${formatNum(result.solidM3, 2)} m³`,
      `${copy.weight}: ${formatNum(result.weightKg, 0)} kg`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost, 2)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) => (id === "half" ? copy.half : id === "face" ? copy.face : id === "stere" ? copy.stere : copy.loose);
  const volUnit = unit === "m" ? "m³" : "ft³";

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
            {copy.units}
            <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
              <option value="m">{copy.meters}</option>
              <option value="ft">{copy.feet}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.shape}
            <select className={inputClass} value={shape} onChange={(e) => setShape(e.target.value as Shape)}>
              <option value="stack">{copy.stack}</option>
              <option value="volume">{copy.known}</option>
            </select>
          </label>
        </div>
        {shape === "stack" ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm">
              {copy.length}
              <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.height}
              <input className={inputClass} inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.depth}
              <input className={inputClass} inputMode="decimal" value={depth} onChange={(e) => setDepth(e.target.value)} />
            </label>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              {copy.volume}
              <input className={inputClass} inputMode="decimal" value={knownVolume} onChange={(e) => setKnownVolume(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.depth}
              <input className={inputClass} inputMode="decimal" value={depth} onChange={(e) => setDepth(e.target.value)} />
            </label>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.species}
            <select className={inputClass} value={species} onChange={(e) => onSpecies(e.target.value as Species)}>
              <option value="oak">{copy.oak}</option>
              <option value="birch">{copy.birch}</option>
              <option value="maple">{copy.maple}</option>
              <option value="pine">{copy.pine}</option>
              <option value="mixed">{copy.mixed}</option>
              <option value="custom">{copy.custom}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.density}
            <input
              className={inputClass}
              inputMode="decimal"
              value={customDensity}
              onChange={(e) => {
                setSpecies("custom");
                setCustomDensity(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.solid}
            <input className={inputClass} inputMode="decimal" value={solidPct} onChange={(e) => setSolidPct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.moisture}
            <select className={inputClass} value={moisture} onChange={(e) => setMoisture(e.target.value as Moisture)}>
              <option value="seasoned">{copy.seasoned}</option>
              <option value="green">{copy.green}</option>
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.price}
          <input className={inputClass} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={`${buttonClass} w-full`} onClick={copyResult} disabled={"error" in result}>
            {copied ? copy.copied : copy.copyBtn}
          </button>
          <button type="button" className={`${buttonClass} w-full`} onClick={reset}>
            {copy.reset}
          </button>
        </div>
      </form>
      <section className="grid content-start gap-3 rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {"error" in result ? (
          <p className="text-sm text-muted-foreground">{result.error}</p>
        ) : (
          <dl className="grid gap-2 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.stacked}</dt>
              <dd className="font-medium">
                {formatNum(unit === "m" ? result.stackedM3 : result.stackedM3 / M_PER_FT ** 3)} {volUnit}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.cords}</dt>
              <dd className="text-lg font-semibold">{formatNum(result.cords, 2)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.faces}</dt>
              <dd className="font-medium">{formatNum(result.faces, 2)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.steres}</dt>
              <dd className="font-medium">{formatNum(result.stackedM3, 2)} m³</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.solidVol}</dt>
              <dd className="font-medium">{formatNum(result.solidM3, 2)} m³</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.weight}</dt>
              <dd className="font-medium">{formatNum(result.weightKg, 0)} kg</dd>
            </div>
            {result.cost != null ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">{copy.cost}</dt>
                <dd className="font-medium">{formatNum(result.cost, 2)}</dd>
              </div>
            ) : null}
            <p className="pt-2 text-xs text-muted-foreground">{copy.note}</p>
          </dl>
        )}
      </section>
    </div>
  );
}
