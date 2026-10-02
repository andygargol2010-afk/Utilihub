import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Sun = "low" | "medium" | "high";
type Insulation = "good" | "average" | "poor";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

const SPLITS = [
  { btu: 9000, frig: 2250 },
  { btu: 12000, frig: 3000 },
  { btu: 18000, frig: 4500 },
  { btu: 24000, frig: 6000 },
  { btu: 36000, frig: 9000 },
];

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, digits = 0) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

export function AcSizeTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("4");
  const [widthM, setWidthM] = useState("3.5");
  const [heightM, setHeightM] = useState("2.6");
  const [people, setPeople] = useState("2");
  const [windows, setWindows] = useState("1");
  const [sun, setSun] = useState<Sun>("medium");
  const [insulation, setInsulation] = useState<Insulation>("average");
  const [kitchen, setKitchen] = useState(false);

  const copy = es
    ? {
        length: "Largo (m)",
        width: "Ancho (m)",
        height: "Altura del techo (m)",
        people: "Personas habituales",
        windows: "Ventanas",
        sun: "Sol directo",
        insulation: "Aislación",
        kitchen: "Es cocina o está junto a la cocina",
        sunLow: "Poco",
        sunMed: "Medio",
        sunHigh: "Mucho",
        insGood: "Buena",
        insAvg: "Media",
        insPoor: "Mala",
        result: "Estimación",
        area: "Superficie",
        frig: "Frigorías/h",
        btu: "BTU/h",
        kw: "Potencia aprox.",
        suggest: "Split sugerido",
        note: "Estimación de ambiente, no un cálculo Manual J. Se redondea al tamaño comercial siguiente.",
      }
    : {
        length: "Length (m)",
        width: "Width (m)",
        height: "Ceiling height (m)",
        people: "Usual occupants",
        windows: "Windows",
        sun: "Direct sun",
        insulation: "Insulation",
        kitchen: "Kitchen or next to the kitchen",
        sunLow: "Low",
        sunMed: "Medium",
        sunHigh: "High",
        insGood: "Good",
        insAvg: "Average",
        insPoor: "Poor",
        result: "Estimate",
        area: "Floor area",
        frig: "Frigorías/h",
        btu: "BTU/h",
        kw: "Approx. capacity",
        suggest: "Suggested split",
        note: "Room-size estimate, not a Manual J load. Rounded up to the next common split size.",
      };

  const result = useMemo(() => {
    const length = parseNum(lengthM);
    const width = parseNum(widthM);
    const height = parseNum(heightM);
    const occupants = parseNum(people);
    const windowCount = parseNum(windows);
    if ([length, width, height, occupants, windowCount].some((n) => n === null || Number.isNaN(n))) {
      return { error: es ? "Completá todos los campos con números válidos." : "Fill every field with a valid number." };
    }
    if (length! <= 0 || width! <= 0 || length! > 30 || width! > 30) {
      return { error: es ? "El largo y el ancho tienen que estar entre 0 y 30 m." : "Length and width must be between 0 and 30 m." };
    }
    if (height! < 2 || height! > 6) {
      return { error: es ? "La altura debe estar entre 2 y 6 m." : "Ceiling height must be between 2 and 6 m." };
    }
    if (!Number.isInteger(occupants) || occupants! < 1 || occupants! > 20) {
      return { error: es ? "Las personas tienen que ser un entero entre 1 y 20." : "People must be a whole number from 1 to 20." };
    }
    if (!Number.isInteger(windowCount) || windowCount! < 0 || windowCount! > 12) {
      return { error: es ? "Las ventanas tienen que ser un entero entre 0 y 12." : "Windows must be a whole number from 0 to 12." };
    }

    const area = length! * width!;
    const sunFactor = sun === "low" ? 0.9 : sun === "high" ? 1.15 : 1;
    const insulationFactor = insulation === "good" ? 0.9 : insulation === "poor" ? 1.12 : 1;
    const windowFactor = 1 + Math.min(windowCount!, 6) * 0.05;
    const extraPeople = Math.max(0, occupants! - 2) * 125;
    const kitchenExtra = kitchen ? 800 : 0;
    const frig = Math.ceil(area * 100 * (height! / 2.5) * sunFactor * insulationFactor * windowFactor + extraPeople + kitchenExtra);
    const btu = Math.ceil(frig / 0.252);
    const kw = (frig * 1.163) / 1000;
    const suggested = SPLITS.find((size) => size.btu >= btu) ?? SPLITS[SPLITS.length - 1];
    return { area, frig, btu, kw, suggested, oversized: btu > SPLITS[SPLITS.length - 1].btu };
  }, [lengthM, widthM, heightM, people, windows, sun, insulation, kitchen, es]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            {copy.length}
            <input className={inputClass} inputMode="decimal" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.width}
            <input className={inputClass} inputMode="decimal" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.height}
          <input className={inputClass} inputMode="decimal" value={heightM} onChange={(e) => setHeightM(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            {copy.people}
            <input className={inputClass} inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.windows}
            <input className={inputClass} inputMode="numeric" value={windows} onChange={(e) => setWindows(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.sun}
          <select className={inputClass} value={sun} onChange={(e) => setSun(e.target.value as Sun)}>
            <option value="low">{copy.sunLow}</option>
            <option value="medium">{copy.sunMed}</option>
            <option value="high">{copy.sunHigh}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {copy.insulation}
          <select className={inputClass} value={insulation} onChange={(e) => setInsulation(e.target.value as Insulation)}>
            <option value="good">{copy.insGood}</option>
            <option value="average">{copy.insAvg}</option>
            <option value="poor">{copy.insPoor}</option>
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={kitchen} onChange={(e) => setKitchen(e.target.checked)} />
          {copy.kitchen}
        </label>
      </form>
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {"error" in result ? (
          <p className="mt-3 text-sm text-destructive">{result.error}</p>
        ) : (
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt>{copy.area}</dt>
              <dd className="font-medium">{formatNum(result.area, 2)} m²</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{copy.frig}</dt>
              <dd className="font-medium">{formatNum(result.frig)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{copy.btu}</dt>
              <dd className="font-medium">{formatNum(result.btu)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{copy.kw}</dt>
              <dd className="font-medium">{formatNum(result.kw, 2)} kW</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{copy.suggest}</dt>
              <dd className="font-medium">
                {formatNum(result.suggested.btu)} BTU/h · {formatNum(result.suggested.frig)} fg/h
                {result.oversized ? (es ? " (mínimo; ambiente grande)" : " (minimum; large room)") : ""}
              </dd>
            </div>
            <p className="pt-2 text-muted-foreground">{copy.note}</p>
          </dl>
        )}
      </section>
    </div>
  );
}
