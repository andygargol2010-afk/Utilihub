import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Shape = "rect" | "area";
type PresetId = "us" | "metric" | "half" | "slope";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

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
  rollL: string;
  rollW: string;
  waste: string;
  perPallet: string;
};

const PRESETS: Preset[] = [
  { id: "us", unit: "ft", rollL: "5", rollW: "2", waste: "8", perPallet: "50" },
  { id: "metric", unit: "m", rollL: "2.5", rollW: "0.4", waste: "8", perPallet: "50" },
  { id: "half", unit: "m", rollL: "1.25", rollW: "0.4", waste: "8", perPallet: "80" },
  { id: "slope", unit: "m", rollL: "2.5", rollW: "0.4", waste: "15", perPallet: "50" },
];

export function SodCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [shape, setShape] = useState<Shape>("rect");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("6");
  const [knownArea, setKnownArea] = useState("60");
  const [openings, setOpenings] = useState("0");
  const [rollL, setRollL] = useState("2.5");
  const [rollW, setRollW] = useState("0.4");
  const [wastePct, setWastePct] = useState("8");
  const [perPallet, setPerPallet] = useState("50");
  const [bagCoverage, setBagCoverage] = useState("50");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá rollos y pallets de césped a partir del área, la medida del rollo y el desperdicio. Los sacos de abono de arranque son opcionales.",
        presets: "Presets",
        us: "Rollo EE. UU. 2×5 ft",
        metric: "Rollo 1 m²",
        half: "Medio rollo",
        slope: "Pendiente 15%",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        shape: "Forma",
        rect: "Rectángulo",
        known: "Área conocida",
        length: unit === "m" ? "Largo (m)" : "Largo (ft)",
        width: unit === "m" ? "Ancho (m)" : "Ancho (ft)",
        area: unit === "m" ? "Área (m²)" : "Área (sq ft)",
        openings: unit === "m" ? "Canteros y senderos a restar (m²)" : "Canteros y senderos a restar (sq ft)",
        rollL: unit === "m" ? "Largo del rollo (m)" : "Largo del rollo (ft)",
        rollW: unit === "m" ? "Ancho del rollo (m)" : "Ancho del rollo (ft)",
        waste: "Desperdicio (%)",
        perPallet: "Rollos por pallet",
        bag: unit === "m" ? "Cobertura del saco de abono (m²)" : "Cobertura del saco de abono (sq ft)",
        price: "Precio por rollo (opcional)",
        result: "Resultado",
        net: "Superficie neta",
        order: "Superficie a pedir",
        rolls: "Rollos a comprar",
        each: "Cobertura por rollo",
        pallets: "Pallets",
        bags: "Sacos de abono",
        cost: "Material estimado",
        note: "Los rollos y pallets se redondean hacia arriba. El abono cubre el área neta, no el desperdicio de cortes.",
        empty: "Completá el área, la medida del rollo, el desperdicio y los rollos por pallet.",
        invalid: "Usá números mayores que cero. Los decimales pueden llevar coma o punto.",
        openingsInvalid: "Los canteros no pueden ser negativos ni ocupar toda el área.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 40%.",
        tooBig: "El área supera el límite de planificación (100.000 m² o 1.000.000 sq ft).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate sod rolls and pallets from lawn area, roll size, and waste. Starter-fertilizer bags are optional.",
        presets: "Presets",
        us: "US 2×5 ft roll",
        metric: "1 m² roll",
        half: "Half roll",
        slope: "Slope 15%",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        shape: "Shape",
        rect: "Rectangle",
        known: "Known area",
        length: unit === "m" ? "Length (m)" : "Length (ft)",
        width: unit === "m" ? "Width (m)" : "Width (ft)",
        area: unit === "m" ? "Area (m²)" : "Area (sq ft)",
        openings: unit === "m" ? "Beds and paths to subtract (m²)" : "Beds and paths to subtract (sq ft)",
        rollL: unit === "m" ? "Roll length (m)" : "Roll length (ft)",
        rollW: unit === "m" ? "Roll width (m)" : "Roll width (ft)",
        waste: "Waste (%)",
        perPallet: "Rolls per pallet",
        bag: unit === "m" ? "Starter bag coverage (m²)" : "Starter bag coverage (sq ft)",
        price: "Price per roll (optional)",
        result: "Result",
        net: "Net area",
        order: "Area to order",
        rolls: "Rolls to buy",
        each: "Coverage per roll",
        pallets: "Pallets",
        bags: "Starter bags",
        cost: "Estimated material",
        note: "Rolls and pallets round up. Starter bags cover net area, not cut waste.",
        empty: "Enter the area, roll size, waste, and rolls per pallet.",
        invalid: "Use numbers greater than zero. Decimals can use a comma or a dot.",
        openingsInvalid: "Beds and paths cannot be negative or cover the whole area.",
        wasteInvalid: "Waste must be between 0% and 40%.",
        tooBig: "Area is above the planning limit (100,000 m² or 1,000,000 sq ft).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const holes = parseNum(openings);
    const rL = parseNum(rollL);
    const rW = parseNum(rollW);
    const waste = parseNum(wastePct);
    const pallet = parseNum(perPallet);
    const bag = parseNum(bagCoverage);
    const unitPrice = parseNum(price);
    const grossInput = shape === "rect" ? null : parseNum(knownArea);
    const len = shape === "rect" ? parseNum(length) : 1;
    const wid = shape === "rect" ? parseNum(width) : 1;
    if (
      holes == null ||
      rL == null ||
      rW == null ||
      waste == null ||
      pallet == null ||
      bag == null ||
      (shape === "rect" && (len == null || wid == null)) ||
      (shape === "area" && grossInput == null)
    ) {
      return { error: copy.empty };
    }
    if (
      [rL, rW, pallet, bag].some((n) => Number.isNaN(n) || n <= 0) ||
      Number.isNaN(holes) ||
      Number.isNaN(waste) ||
      (shape === "rect" && [len, wid].some((n) => n == null || Number.isNaN(n) || n <= 0)) ||
      (shape === "area" && (grossInput == null || Number.isNaN(grossInput) || grossInput <= 0))
    ) {
      return { error: copy.invalid };
    }
    const gross = shape === "rect" ? (len as number) * (wid as number) : (grossInput as number);
    const limit = unit === "m" ? 100_000 : 1_000_000;
    if (gross > limit) return { error: copy.tooBig };
    if (holes < 0 || holes >= gross) return { error: copy.openingsInvalid };
    if (waste < 0 || waste > 40) return { error: copy.wasteInvalid };
    if (pallet > 500) return { error: copy.invalid };
    if (unitPrice != null && (Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.invalid };
    const net = gross - holes;
    const order = net * (1 + waste / 100);
    const rollArea = rL * rW;
    const rolls = Math.ceil(order / rollArea - 1e-9);
    const pallets = Math.ceil(rolls / pallet - 1e-9);
    const bags = Math.ceil(net / bag - 1e-9);
    const cost = unitPrice == null || price.trim() === "" ? null : rolls * unitPrice;
    return { net, order, rolls, rollArea, pallets, bags, cost };
  }, [
    shape,
    length,
    width,
    knownArea,
    openings,
    rollL,
    rollW,
    wastePct,
    perPallet,
    bagCoverage,
    price,
    unit,
    copy.empty,
    copy.invalid,
    copy.openingsInvalid,
    copy.wasteInvalid,
    copy.tooBig,
  ]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setRollL(preset.rollL);
    setRollW(preset.rollW);
    setWastePct(preset.waste);
    setPerPallet(preset.perPallet);
    setBagCoverage(preset.unit === "ft" ? "500" : "50");
    if (preset.unit === "ft") {
      setLength("40");
      setWidth("20");
      setKnownArea("800");
    } else {
      setLength("10");
      setWidth("6");
      setKnownArea("60");
    }
    setCopied(false);
  }

  function reset() {
    setShape("rect");
    setOpenings("0");
    setPrice("");
    applyPreset(PRESETS[1]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const areaUnit = unit === "m" ? "m²" : "sq ft";
    const lines = [
      `${copy.net}: ${formatNum(result.net)} ${areaUnit}`,
      `${copy.order}: ${formatNum(result.order)} ${areaUnit}`,
      `${copy.rolls}: ${result.rolls}`,
      `${copy.pallets}: ${result.pallets}`,
      `${copy.bags}: ${result.bags}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) =>
    id === "us" ? copy.us : id === "metric" ? copy.metric : id === "half" ? copy.half : copy.slope;
  const areaUnit = unit === "m" ? "m²" : "sq ft";

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
              <option value="rect">{copy.rect}</option>
              <option value="area">{copy.known}</option>
            </select>
          </label>
        </div>
        {shape === "rect" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              {copy.length}
              <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.width}
              <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
            </label>
          </div>
        ) : (
          <label className="grid gap-1 text-sm">
            {copy.area}
            <input className={inputClass} inputMode="decimal" value={knownArea} onChange={(e) => setKnownArea(e.target.value)} />
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.openings}
            <input className={inputClass} inputMode="decimal" value={openings} onChange={(e) => setOpenings(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.rollL}
            <input className={inputClass} inputMode="decimal" value={rollL} onChange={(e) => setRollL(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.rollW}
            <input className={inputClass} inputMode="decimal" value={rollW} onChange={(e) => setRollW(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.perPallet}
            <input className={inputClass} inputMode="numeric" value={perPallet} onChange={(e) => setPerPallet(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.bag}
            <input className={inputClass} inputMode="decimal" value={bagCoverage} onChange={(e) => setBagCoverage(e.target.value)} />
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
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.net}</dt>
              <dd className="font-medium">{formatNum(result.net)} {areaUnit}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.order}</dt>
              <dd className="font-medium">{formatNum(result.order)} {areaUnit}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.rolls}</dt>
              <dd className="text-base font-semibold">{result.rolls}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.each}</dt>
              <dd className="font-medium">{formatNum(result.rollArea, 3)} {areaUnit}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.pallets}</dt>
              <dd className="font-medium">{result.pallets}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.bags}</dt>
              <dd className="font-medium">{result.bags}</dd>
            </div>
            {result.cost != null ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
                <dt className="text-muted-foreground">{copy.cost}</dt>
                <dd className="font-medium">{formatNum(result.cost)}</dd>
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground">{copy.note}</p>
          </dl>
        )}
      </section>
    </div>
  );
}
