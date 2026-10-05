import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type PresetId = "metric" | "oc16" | "oc24" | "door";

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
  length: string;
  height: string;
  spacing: string;
  plates: string;
  openings: string;
  extra: string;
  corners: string;
  waste: string;
  studStock: string;
  plateStock: string;
};

const PRESETS: Preset[] = [
  { id: "metric", unit: "m", length: "4", height: "2.4", spacing: "0.4", plates: "3", openings: "0", extra: "4", corners: "0", waste: "10", studStock: "2.4", plateStock: "3" },
  { id: "oc16", unit: "ft", length: "12", height: "8", spacing: "1.333", plates: "3", openings: "0", extra: "4", corners: "2", waste: "10", studStock: "8", plateStock: "12" },
  { id: "oc24", unit: "ft", length: "20", height: "8", spacing: "2", plates: "3", openings: "0", extra: "4", corners: "0", waste: "5", studStock: "8", plateStock: "10" },
  { id: "door", unit: "m", length: "3.2", height: "2.4", spacing: "0.4", plates: "3", openings: "1", extra: "4", corners: "0", waste: "10", studStock: "2.4", plateStock: "3" },
];

export function StudCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [length, setLength] = useState("4");
  const [height, setHeight] = useState("2.4");
  const [spacing, setSpacing] = useState("0.4");
  const [plates, setPlates] = useState("3");
  const [openings, setOpenings] = useState("0");
  const [extra, setExtra] = useState("4");
  const [corners, setCorners] = useState("0");
  const [wastePct, setWastePct] = useState("10");
  const [studStock, setStudStock] = useState("2.4");
  const [plateStock, setPlateStock] = useState("3");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Contá montantes a eje, soleras y piezas extra de huecos para un tabique. No reemplaza un plano estructural ni el conteo de placas de pladur.",
        presets: "Presets",
        metric: "4 m a 40 cm",
        oc16: "12 ft a 16 in",
        oc24: "20 ft a 24 in",
        door: "Hueco de puerta",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        length: unit === "m" ? "Largo del muro (m)" : "Largo del muro (ft)",
        height: unit === "m" ? "Alto del montante (m)" : "Alto del montante (ft)",
        spacing: unit === "m" ? "Separación a ejes (m)" : "Separación a ejes (ft)",
        spacingHint: unit === "m" ? "40 cm = 0,4 · 60 cm = 0,6" : "16 in = 1,333 · 24 in = 2",
        plates: "Soleras (corridas)",
        openings: "Huecos (puertas o ventanas)",
        extra: "Piezas extra por hueco",
        corners: "Montantes extra de esquina",
        waste: "Desperdicio (%)",
        studStock: unit === "m" ? "Largo de montante en tienda (m)" : "Largo de montante en tienda (ft)",
        plateStock: unit === "m" ? "Largo de solera en tienda (m)" : "Largo de solera en tienda (ft)",
        price: "Precio por pieza (opcional)",
        result: "Pedido",
        layout: "Montantes de trama",
        openingStuds: "Extra de huecos y esquinas",
        orderStuds: "Montantes a pedir",
        plateRun: "Largo de soleras",
        platePieces: "Piezas de solera",
        lastBay: "Último vano",
        stockNote: "Aviso de largo",
        cost: "Material estimado",
        note: "Los montantes de trama son techo(largo / separación) + 1, con ambos extremos. Cada hueco suma las piezas extra (por defecto 4: dos king y dos jack) sin descontar los de la trama, para no quedar corto.",
        empty: "Completá largo, alto, separación, soleras, huecos, desperdicio y largos de tienda.",
        invalid: "Usá números válidos. Largo, alto, separación y largos de tienda tienen que ser mayores que cero. Los decimales pueden llevar coma o punto.",
        platesInvalid: "Las corridas de solera tienen que ser 1, 2 o 3.",
        countInvalid: "Los huecos y las piezas extra no pueden ser negativos. Extra por hueco: 0 a 8. Esquinas: 0 a 12.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 25%.",
        spacingInvalid: "La separación tiene que ser menor que el largo del muro y al menos 0,2 m o 8 in.",
        tooBig: "El muro supera el límite de planificación (80 m o 260 ft).",
        heightWarn: "El alto supera el largo de tienda: pedí montantes más largos o empalmes, no este listón.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Count on-center studs, plates, and extra opening pieces for one framed wall. This is not a structural plan and it does not count drywall sheets.",
        presets: "Presets",
        metric: "4 m at 40 cm",
        oc16: "12 ft at 16 in",
        oc24: "20 ft at 24 in",
        door: "Door opening",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        length: unit === "m" ? "Wall length (m)" : "Wall length (ft)",
        height: unit === "m" ? "Stud height (m)" : "Stud height (ft)",
        spacing: unit === "m" ? "On-center spacing (m)" : "On-center spacing (ft)",
        spacingHint: unit === "m" ? "40 cm = 0.4 · 60 cm = 0.6" : "16 in = 1.333 · 24 in = 2",
        plates: "Plate runs",
        openings: "Openings (doors or windows)",
        extra: "Extra pieces per opening",
        corners: "Extra corner studs",
        waste: "Waste (%)",
        studStock: unit === "m" ? "Stud stock length (m)" : "Stud stock length (ft)",
        plateStock: unit === "m" ? "Plate stock length (m)" : "Plate stock length (ft)",
        price: "Price per piece (optional)",
        result: "Order",
        layout: "Layout studs",
        openingStuds: "Opening and corner extras",
        orderStuds: "Studs to order",
        plateRun: "Plate run",
        platePieces: "Plate pieces",
        lastBay: "Last bay",
        stockNote: "Stock note",
        cost: "Estimated material",
        note: "Layout studs are ceil(length / spacing) + 1, including both ends. Each opening adds the extra pieces (default 4: two kings and two jacks) without removing layout studs, so the order stays conservative.",
        empty: "Enter length, height, spacing, plates, openings, waste, and stock lengths.",
        invalid: "Use valid numbers. Length, height, spacing, and stock lengths must be greater than zero. Decimals can use a comma or a dot.",
        platesInvalid: "Plate runs must be 1, 2, or 3.",
        countInvalid: "Openings and extras cannot be negative. Extra per opening: 0 to 8. Corners: 0 to 12.",
        wasteInvalid: "Waste must be between 0% and 25%.",
        spacingInvalid: "Spacing must be shorter than the wall and at least 0.2 m or 8 in.",
        tooBig: "The wall is above the planning limit (80 m or 260 ft).",
        heightWarn: "Height is longer than the stock stick: order longer studs or splices, not this length.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const len = parseNum(length);
    const h = parseNum(height);
    const space = parseNum(spacing);
    const plateRuns = parseNum(plates);
    const holes = parseNum(openings);
    const perHole = parseNum(extra);
    const corner = parseNum(corners);
    const waste = parseNum(wastePct);
    const studLen = parseNum(studStock);
    const plateLen = parseNum(plateStock);
    if ([len, h, space, plateRuns, holes, perHole, corner, waste, studLen, plateLen].some((n) => n == null)) {
      return { error: copy.empty };
    }
    if ([len, h, space, plateRuns, holes, perHole, corner, waste, studLen, plateLen].some((n) => Number.isNaN(n as number))) {
      return { error: copy.invalid };
    }
    if ((len as number) <= 0 || (h as number) <= 0 || (space as number) <= 0 || (studLen as number) <= 0 || (plateLen as number) <= 0) {
      return { error: copy.invalid };
    }
    const limit = unit === "m" ? 80 : 260;
    if ((len as number) > limit) return { error: copy.tooBig };
    const minSpace = unit === "m" ? 0.2 : 8 / 12;
    if ((space as number) < minSpace || (space as number) >= (len as number)) return { error: copy.spacingInvalid };
    if (![1, 2, 3].includes(plateRuns as number)) return { error: copy.platesInvalid };
    if (
      (holes as number) < 0 ||
      (perHole as number) < 0 ||
      (perHole as number) > 8 ||
      (corner as number) < 0 ||
      (corner as number) > 12 ||
      !Number.isInteger(holes) ||
      !Number.isInteger(perHole) ||
      !Number.isInteger(corner)
    ) {
      return { error: copy.countInvalid };
    }
    if ((waste as number) < 0 || (waste as number) > 25) return { error: copy.wasteInvalid };
    const unitPrice = parseNum(price);
    if (price.trim() !== "" && (unitPrice == null || Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.invalid };
    const layout = Math.ceil((len as number) / (space as number) - 1e-9) + 1;
    const extras = (holes as number) * (perHole as number) + (corner as number);
    const factor = 1 + (waste as number) / 100;
    const orderStuds = Math.ceil((layout + extras) * factor - 1e-9);
    const plateRun = (plateRuns as number) * (len as number) * factor;
    const platePieces = Math.ceil(plateRun / (plateLen as number) - 1e-9);
    const used = (layout - 1) * (space as number);
    const lastBay = (len as number) - used;
    const heightWarn = (h as number) > (studLen as number) + 1e-9;
    const cost = price.trim() === "" || unitPrice == null ? null : (orderStuds + platePieces) * unitPrice;
    return { layout, extras, orderStuds, plateRun, platePieces, lastBay, heightWarn, cost };
  }, [length, height, spacing, plates, openings, extra, corners, wastePct, studStock, plateStock, price, unit, copy.empty, copy.invalid, copy.tooBig, copy.spacingInvalid, copy.platesInvalid, copy.countInvalid, copy.wasteInvalid]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLength(preset.length);
    setHeight(preset.height);
    setSpacing(preset.spacing);
    setPlates(preset.plates);
    setOpenings(preset.openings);
    setExtra(preset.extra);
    setCorners(preset.corners);
    setWastePct(preset.waste);
    setStudStock(preset.studStock);
    setPlateStock(preset.plateStock);
    setCopied(false);
  }

  function reset() {
    setPrice("");
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const u = unit === "m" ? "m" : "ft";
    const lines = [
      `${copy.layout}: ${result.layout}`,
      `${copy.openingStuds}: ${result.extras}`,
      `${copy.orderStuds}: ${result.orderStuds}`,
      `${copy.plateRun}: ${formatNum(result.plateRun)} ${u}`,
      `${copy.platePieces}: ${result.platePieces}`,
      `${copy.lastBay}: ${formatNum(result.lastBay)} ${u}`,
    ];
    if (result.heightWarn) lines.push(copy.heightWarn);
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) => (id === "metric" ? copy.metric : id === "oc16" ? copy.oc16 : id === "oc24" ? copy.oc24 : copy.door);
  const u = unit === "m" ? "m" : "ft";

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
          {copy.units}
          <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            <option value="m">{copy.meters}</option>
            <option value="ft">{copy.feet}</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.length}
            <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.height}
            <input className={inputClass} inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.spacing}
          <input className={inputClass} inputMode="decimal" value={spacing} onChange={(e) => setSpacing(e.target.value)} />
          <span className="text-xs text-muted-foreground">{copy.spacingHint}</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.plates}
            <select className={inputClass} value={plates} onChange={(e) => setPlates(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.openings}
            <input className={inputClass} inputMode="numeric" value={openings} onChange={(e) => setOpenings(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.extra}
            <input className={inputClass} inputMode="numeric" value={extra} onChange={(e) => setExtra(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.corners}
            <input className={inputClass} inputMode="numeric" value={corners} onChange={(e) => setCorners(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.studStock}
            <input className={inputClass} inputMode="decimal" value={studStock} onChange={(e) => setStudStock(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.plateStock}
            <input className={inputClass} inputMode="decimal" value={plateStock} onChange={(e) => setPlateStock(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.price}
            <input className={inputClass} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
          </label>
        </div>
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
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.layout}</dt>
              <dd className="font-medium">{result.layout}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.openingStuds}</dt>
              <dd className="font-medium">{result.extras}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.orderStuds}</dt>
              <dd className="text-base font-semibold">{result.orderStuds}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.plateRun}</dt>
              <dd className="font-medium">{formatNum(result.plateRun)} {u}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.platePieces}</dt>
              <dd className="font-medium">{result.platePieces}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{copy.lastBay}</dt>
              <dd className="font-medium">{formatNum(result.lastBay)} {u}</dd>
            </div>
            {result.heightWarn ? <p className="text-sm text-amber-700 dark:text-amber-400">{copy.heightWarn}</p> : null}
            {result.cost != null ? (
              <div className="flex items-baseline justify-between gap-3">
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