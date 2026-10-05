import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type PresetId = "veg" | "deep" | "herbs" | "imperial";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const CUFT_PER_M3 = 35.314666721;
const L_PER_M3 = 1000;

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
  width: string;
  height: string;
  beds: string;
  compost: string;
  bag: string;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "veg", unit: "m", length: "1.2", width: "0.8", height: "0.3", beds: "1", compost: "30", bag: "50", waste: "10" },
  { id: "deep", unit: "m", length: "2.4", width: "1.2", height: "0.45", beds: "1", compost: "30", bag: "50", waste: "10" },
  { id: "herbs", unit: "m", length: "1", width: "0.4", height: "0.2", beds: "2", compost: "20", bag: "25", waste: "5" },
  { id: "imperial", unit: "ft", length: "8", width: "4", height: "1", beds: "1", compost: "30", bag: "2", waste: "10" },
];

export function RaisedBedCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [length, setLength] = useState("1.2");
  const [width, setWidth] = useState("0.8");
  const [height, setHeight] = useState("0.3");
  const [beds, setBeds] = useState("1");
  const [compost, setCompost] = useState("30");
  const [bag, setBag] = useState("50");
  const [wastePct, setWastePct] = useState("10");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá metros cúbicos, compost y sacos de tierra para bancales o jardineras. Usá la altura de relleno, no el borde si dejás un labio.",
        presets: "Presets",
        veg: "Huerto 1,2×0,8 m",
        deep: "Raíces 2,4×1,2 m",
        herbs: "Hierbas ×2",
        imperial: "Cama 4×8 ft",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        length: unit === "m" ? "Largo interior (m)" : "Largo interior (ft)",
        width: unit === "m" ? "Ancho interior (m)" : "Ancho interior (ft)",
        height: unit === "m" ? "Altura de relleno (m)" : "Altura de relleno (ft)",
        beds: "Bancales iguales",
        compost: "Compost (% del volumen)",
        bag: unit === "m" ? "Saco (L)" : "Saco (ft³)",
        waste: "Desperdicio / asentamiento (%)",
        price: "Precio por saco (opcional)",
        result: "Resultado",
        perBed: "Volumen por bancal",
        order: "Tierra a pedir",
        yards: "Yardas cúbicas",
        mixCompost: "Compost",
        mixSoil: "Tierra o sustrato",
        bags: "Sacos",
        leftover: "Sobrante",
        cost: "Material estimado",
        note: "El 30% de compost es un punto de partida para huerto, no un análisis de suelo. Los sacos se redondean hacia arriba.",
        empty: "Completá largo, ancho, altura, cantidad, compost, saco y desperdicio.",
        invalid: "Usá números válidos. Largo, ancho, altura y saco tienen que ser mayores que cero. Los decimales pueden llevar coma o punto.",
        bedsInvalid: "La cantidad de bancales tiene que ser un entero entre 1 y 40.",
        compostInvalid: "El compost tiene que estar entre 0% y 80% del volumen.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 30%.",
        tooBig: "El volumen supera el límite de planificación (40 m³ o 1.400 ft³).",
        heightInvalid: unit === "m" ? "La altura de relleno tiene que ser de 5 cm a 1,2 m." : "La altura de relleno tiene que ser de 2 in a 4 ft.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate cubic meters or yards, compost, and bags of soil for raised beds or planters. Use fill height, not the rim if you leave a lip.",
        presets: "Presets",
        veg: "Veg bed 1.2×0.8 m",
        deep: "Deep roots 2.4×1.2 m",
        herbs: "Herbs ×2",
        imperial: "4×8 ft bed",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        length: unit === "m" ? "Inside length (m)" : "Inside length (ft)",
        width: unit === "m" ? "Inside width (m)" : "Inside width (ft)",
        height: unit === "m" ? "Fill height (m)" : "Fill height (ft)",
        beds: "Identical beds",
        compost: "Compost (% of volume)",
        bag: unit === "m" ? "Bag (L)" : "Bag (ft³)",
        waste: "Waste / settling (%)",
        price: "Price per bag (optional)",
        result: "Result",
        perBed: "Volume per bed",
        order: "Soil to order",
        yards: "Cubic yards",
        mixCompost: "Compost",
        mixSoil: "Topsoil or mix",
        bags: "Bags",
        leftover: "Leftover",
        cost: "Estimated material",
        note: "30% compost is a vegetable-bed starting point, not a soil test. Bags round up.",
        empty: "Enter length, width, height, bed count, compost, bag size, and waste.",
        invalid: "Use valid numbers. Length, width, height, and bag size must be greater than zero. Decimals can use a comma or a dot.",
        bedsInvalid: "Bed count must be a whole number from 1 to 40.",
        compostInvalid: "Compost must be between 0% and 80% of volume.",
        wasteInvalid: "Waste must be between 0% and 30%.",
        tooBig: "Volume is above the planning limit (40 m³ or 1,400 ft³).",
        heightInvalid: unit === "m" ? "Fill height must be from 5 cm to 1.2 m." : "Fill height must be from 2 in to 4 ft.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const len = parseNum(length);
    const wid = parseNum(width);
    const h = parseNum(height);
    const bedCount = parseNum(beds);
    const compostPct = parseNum(compost);
    const bagSize = parseNum(bag);
    const waste = parseNum(wastePct);
    if ([len, wid, h, bedCount, compostPct, bagSize, waste].some((n) => n == null)) return { error: copy.empty };
    if ([len, wid, h, bedCount, compostPct, bagSize, waste].some((n) => Number.isNaN(n)) || len! <= 0 || wid! <= 0 || h! <= 0 || bagSize! <= 0) {
      return { error: copy.invalid };
    }
    if (!Number.isInteger(bedCount) || bedCount! < 1 || bedCount! > 40) return { error: copy.bedsInvalid };
    const minH = unit === "m" ? 0.05 : 2 / 12;
    const maxH = unit === "m" ? 1.2 : 4;
    if (h! < minH || h! > maxH) return { error: copy.heightInvalid };
    if (compostPct! < 0 || compostPct! > 80) return { error: copy.compostInvalid };
    if (waste! < 0 || waste! > 30) return { error: copy.wasteInvalid };
    const unitPrice = parseNum(price);
    if (price.trim() !== "" && (unitPrice == null || Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.invalid };
    const perBed = len! * wid! * h!;
    const order = perBed * bedCount! * (1 + waste! / 100);
    const limit = unit === "m" ? 40 : 1400;
    if (order > limit) return { error: copy.tooBig };
    const orderM3 = unit === "m" ? order : order / CUFT_PER_M3;
    const bagM3 = unit === "m" ? bagSize! / L_PER_M3 : bagSize! / CUFT_PER_M3;
    const bags = Math.ceil(orderM3 / bagM3 - 1e-9);
    const leftoverM3 = bags * bagM3 - orderM3;
    const compostM3 = orderM3 * (compostPct! / 100);
    const soilM3 = orderM3 - compostM3;
    const cost = price.trim() === "" || unitPrice == null ? null : bags * unitPrice;
    return { perBed, order, orderM3, bags, leftoverM3, compostM3, soilM3, cost };
  }, [length, width, height, beds, compost, bag, wastePct, price, unit, copy.empty, copy.invalid, copy.bedsInvalid, copy.heightInvalid, copy.compostInvalid, copy.wasteInvalid, copy.tooBig]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLength(preset.length);
    setWidth(preset.width);
    setHeight(preset.height);
    setBeds(preset.beds);
    setCompost(preset.compost);
    setBag(preset.bag);
    setWastePct(preset.waste);
    setCopied(false);
  }

  function reset() {
    setPrice("");
    applyPreset(PRESETS[0]);
  }

  function onUnit(next: Unit) {
    if (next === unit) return;
    const scale = next === "ft" ? 3.280839895 : 1 / 3.280839895;
    for (const [value, set] of [
      [length, setLength],
      [width, setWidth],
      [height, setHeight],
    ] as const) {
      const n = parseNum(value);
      if (n != null && !Number.isNaN(n) && n > 0) set(String(Math.round(n * scale * 100) / 100));
    }
    const bagNow = parseNum(bag);
    if (bagNow != null && !Number.isNaN(bagNow) && bagNow > 0) {
      const m3 = unit === "m" ? bagNow / L_PER_M3 : bagNow / CUFT_PER_M3;
      setBag(next === "m" ? String(Math.round(m3 * L_PER_M3)) : String(Math.round(m3 * CUFT_PER_M3 * 10) / 10));
    }
    setUnit(next);
  }

  async function copyResult() {
    if ("error" in result) return;
    const volUnit = unit === "m" ? "m³" : "ft³";
    const leftover = unit === "m" ? result.leftoverM3 * L_PER_M3 : result.leftoverM3 * CUFT_PER_M3;
    const compostVol = unit === "m" ? result.compostM3 : result.compostM3 * CUFT_PER_M3;
    const soilVol = unit === "m" ? result.soilM3 : result.soilM3 * CUFT_PER_M3;
    const lines = [
      `${copy.perBed}: ${formatNum(result.perBed, 3)} ${volUnit}`,
      `${copy.order}: ${formatNum(result.order, 3)} ${volUnit}`,
      `${copy.yards}: ${formatNum(result.orderM3 * CUFT_PER_M3 / 27, 2)} yd³`,
      `${copy.mixCompost}: ${formatNum(compostVol, 3)} ${volUnit}`,
      `${copy.mixSoil}: ${formatNum(soilVol, 3)} ${volUnit}`,
      `${copy.bags}: ${result.bags}`,
      `${copy.leftover}: ${formatNum(leftover, 1)} ${unit === "m" ? "L" : "ft³"}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) => (id === "veg" ? copy.veg : id === "deep" ? copy.deep : id === "herbs" ? copy.herbs : copy.imperial);
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
        <label className="grid gap-1 text-sm">
          {copy.units}
          <select className={inputClass} value={unit} onChange={(e) => onUnit(e.target.value as Unit)}>
            <option value="m">{copy.meters}</option>
            <option value="ft">{copy.feet}</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">
            {copy.length}
            <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.width}
            <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.height}
            <input className={inputClass} inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.beds}
            <input className={inputClass} inputMode="numeric" value={beds} onChange={(e) => setBeds(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.compost}
            <input className={inputClass} inputMode="decimal" value={compost} onChange={(e) => setCompost(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.bag}
            <input className={inputClass} inputMode="decimal" value={bag} onChange={(e) => setBag(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
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
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <dl className="grid gap-2 text-sm">
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.perBed}</dt>
              <dd className="font-medium">{formatNum(result.perBed, 3)} {volUnit}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.order}</dt>
              <dd className="text-lg font-semibold">{formatNum(result.order, 3)} {volUnit}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.yards}</dt>
              <dd className="font-medium">{formatNum((result.orderM3 * CUFT_PER_M3) / 27, 2)} yd³</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.mixCompost}</dt>
              <dd className="font-medium">{formatNum(unit === "m" ? result.compostM3 : result.compostM3 * CUFT_PER_M3, 3)} {volUnit}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.mixSoil}</dt>
              <dd className="font-medium">{formatNum(unit === "m" ? result.soilM3 : result.soilM3 * CUFT_PER_M3, 3)} {volUnit}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.bags}</dt>
              <dd className="font-medium">{result.bags}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.leftover}</dt>
              <dd className="font-medium">{formatNum(unit === "m" ? result.leftoverM3 * L_PER_M3 : result.leftoverM3 * CUFT_PER_M3, 1)} {unit === "m" ? "L" : "ft³"}</dd>
            </div>
            {result.cost != null ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">{copy.cost}</dt>
                <dd className="font-medium">{formatNum(result.cost)}</dd>
              </div>
            ) : null}
          </dl>
        )}
        <p className="text-xs text-muted-foreground">{copy.note}</p>
      </section>
    </div>
  );
}
