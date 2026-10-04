import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Shape = "rect" | "perimeter";
type PresetId = "metric" | "bedroom" | "long" | "open";

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
  width: string;
  perimeter: string;
  doors: string;
  doorWidth: string;
  extra: string;
  stick: string;
  waste: string;
  shoe: boolean;
};

const PRESETS: Preset[] = [
  { id: "metric", unit: "m", length: "4", width: "3", perimeter: "14", doors: "1", doorWidth: "0.8", extra: "0", stick: "2.4", waste: "10", shoe: false },
  { id: "bedroom", unit: "ft", length: "12", width: "10", perimeter: "44", doors: "2", doorWidth: "2.5", extra: "0", stick: "8", waste: "10", shoe: false },
  { id: "long", unit: "ft", length: "16", width: "12", perimeter: "56", doors: "1", doorWidth: "2.67", extra: "0", stick: "12", waste: "10", shoe: true },
  { id: "open", unit: "m", length: "8", width: "5", perimeter: "26", doors: "2", doorWidth: "0.9", extra: "3", stick: "3", waste: "12", shoe: true },
];

export function BaseboardCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [shape, setShape] = useState<Shape>("rect");
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("3");
  const [knownPerimeter, setKnownPerimeter] = useState("14");
  const [doors, setDoors] = useState("1");
  const [doorWidth, setDoorWidth] = useState("0.8");
  const [extra, setExtra] = useState("0");
  const [stick, setStick] = useState("2.4");
  const [wastePct, setWastePct] = useState("10");
  const [shoe, setShoe] = useState(false);
  const [insideCorners, setInsideCorners] = useState("4");
  const [outsideCorners, setOutsideCorners] = useState("0");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá varillas de zócalo y de cuarto de rondana a partir del perímetro, las puertas y el desperdicio. Las esquinas las cargás vos.",
        presets: "Presets",
        metric: "Habitación 4×3 m",
        bedroom: "Dormitorio 12×10 ft",
        long: "Varilla 12 ft",
        open: "Abierto + rondana",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        shape: "Forma",
        rect: "Rectángulo",
        known: "Perímetro conocido",
        length: unit === "m" ? "Largo (m)" : "Largo (ft)",
        width: unit === "m" ? "Ancho (m)" : "Ancho (ft)",
        perimeter: unit === "m" ? "Perímetro (m)" : "Perímetro (ft)",
        doors: "Puertas a descontar",
        doorWidth: unit === "m" ? "Ancho de cada puerta (m)" : "Ancho de cada puerta (ft)",
        extra: unit === "m" ? "Placares e islas a sumar (m)" : "Placares e islas a sumar (ft)",
        stick: unit === "m" ? "Largo de la varilla (m)" : "Largo de la varilla (ft)",
        waste: "Desperdicio (%)",
        shoe: "Incluir cuarto de rondana",
        inside: "Esquinas interiores",
        outside: "Esquinas exteriores",
        price: "Precio por varilla de zócalo (opcional)",
        result: "Resultado",
        gross: "Perímetro bruto",
        net: "Recorrido neto",
        order: "Largo a pedir",
        sticks: "Varillas de zócalo",
        leftover: "Sobrante",
        shoeSticks: "Varillas de rondana",
        corners: "Esquinas (int. / ext.)",
        cost: "Material estimado",
        note: "Las varillas se redondean hacia arriba. El cuarto de rondana usa el mismo largo a pedir. Las esquinas no se calculan solas.",
        empty: "Completá el perímetro, las puertas, el largo de varilla y el desperdicio.",
        invalid: "Usá números válidos. El perímetro, el ancho de puerta y la varilla tienen que ser mayores que cero. Los decimales pueden llevar coma o punto.",
        doorsInvalid: "Las puertas no pueden ser negativas ni cubrir todo el perímetro más los extras.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 30%.",
        cornersInvalid: "Las esquinas no pueden ser negativas ni pasar de 200.",
        tooBig: "El perímetro supera el límite de planificación (5.000 m o 15.000 ft).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate baseboard and shoe-molding sticks from perimeter, door openings, and waste. You enter the corner counts.",
        presets: "Presets",
        metric: "4×3 m room",
        bedroom: "12×10 ft bedroom",
        long: "12 ft sticks",
        open: "Open plan + shoe",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        shape: "Shape",
        rect: "Rectangle",
        known: "Known perimeter",
        length: unit === "m" ? "Length (m)" : "Length (ft)",
        width: unit === "m" ? "Width (m)" : "Width (ft)",
        perimeter: unit === "m" ? "Perimeter (m)" : "Perimeter (ft)",
        doors: "Doors to subtract",
        doorWidth: unit === "m" ? "Each door width (m)" : "Each door width (ft)",
        extra: unit === "m" ? "Closets and islands to add (m)" : "Closets and islands to add (ft)",
        stick: unit === "m" ? "Stick length (m)" : "Stick length (ft)",
        waste: "Waste (%)",
        shoe: "Include shoe molding",
        inside: "Inside corners",
        outside: "Outside corners",
        price: "Price per baseboard stick (optional)",
        result: "Result",
        gross: "Gross perimeter",
        net: "Net run",
        order: "Length to order",
        sticks: "Baseboard sticks",
        leftover: "Leftover",
        shoeSticks: "Shoe-molding sticks",
        corners: "Corners (in / out)",
        cost: "Estimated material",
        note: "Sticks round up. Shoe molding uses the same order length. Corner counts are not calculated for you.",
        empty: "Enter the perimeter, doors, stick length, and waste.",
        invalid: "Use valid numbers. Perimeter, door width, and stick length must be greater than zero. Decimals can use a comma or a dot.",
        doorsInvalid: "Doors cannot be negative or cover the whole perimeter plus extras.",
        wasteInvalid: "Waste must be between 0% and 30%.",
        cornersInvalid: "Corners cannot be negative or exceed 200.",
        tooBig: "Perimeter is above the planning limit (5,000 m or 15,000 ft).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const doorCount = parseNum(doors);
    const opening = parseNum(doorWidth);
    const add = parseNum(extra);
    const piece = parseNum(stick);
    const waste = parseNum(wastePct);
    const inside = parseNum(insideCorners);
    const outside = parseNum(outsideCorners);
    const unitPrice = parseNum(price);
    const known = shape === "perimeter" ? parseNum(knownPerimeter) : null;
    const len = shape === "rect" ? parseNum(length) : 1;
    const wid = shape === "rect" ? parseNum(width) : 1;
    if (
      doorCount == null ||
      opening == null ||
      add == null ||
      piece == null ||
      waste == null ||
      inside == null ||
      outside == null ||
      (shape === "rect" && (len == null || wid == null)) ||
      (shape === "perimeter" && known == null)
    ) {
      return { error: copy.empty };
    }
    if (
      [opening, piece].some((n) => Number.isNaN(n) || n <= 0) ||
      Number.isNaN(doorCount) ||
      Number.isNaN(add) ||
      Number.isNaN(waste) ||
      Number.isNaN(inside) ||
      Number.isNaN(outside) ||
      doorCount < 0 ||
      !Number.isInteger(doorCount) ||
      (shape === "rect" && [len, wid].some((n) => n == null || Number.isNaN(n) || n <= 0)) ||
      (shape === "perimeter" && (known == null || Number.isNaN(known) || known <= 0))
    ) {
      return { error: copy.invalid };
    }
    const gross = shape === "rect" ? 2 * ((len as number) + (wid as number)) : (known as number);
    const limit = unit === "m" ? 5_000 : 15_000;
    if (gross > limit) return { error: copy.tooBig };
    if (add < 0 || waste < 0 || waste > 30) return { error: add < 0 ? copy.invalid : copy.wasteInvalid };
    if (inside < 0 || outside < 0 || inside > 200 || outside > 200 || !Number.isInteger(inside) || !Number.isInteger(outside)) {
      return { error: copy.cornersInvalid };
    }
    if (unitPrice != null && (Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.invalid };
    const deducted = doorCount * opening;
    if (deducted >= gross + add) return { error: copy.doorsInvalid };
    const net = gross - deducted + add;
    const order = net * (1 + waste / 100);
    const sticks = Math.ceil(order / piece - 1e-9);
    const leftover = sticks * piece - order;
    const shoeSticks = shoe ? Math.ceil(order / piece - 1e-9) : 0;
    const cost = unitPrice == null || price.trim() === "" ? null : sticks * unitPrice;
    return { gross, net, order, sticks, leftover, shoeSticks, inside, outside, cost };
  }, [
    shape,
    length,
    width,
    knownPerimeter,
    doors,
    doorWidth,
    extra,
    stick,
    wastePct,
    shoe,
    insideCorners,
    outsideCorners,
    price,
    unit,
    copy.empty,
    copy.invalid,
    copy.doorsInvalid,
    copy.wasteInvalid,
    copy.cornersInvalid,
    copy.tooBig,
  ]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLength(preset.length);
    setWidth(preset.width);
    setKnownPerimeter(preset.perimeter);
    setDoors(preset.doors);
    setDoorWidth(preset.doorWidth);
    setExtra(preset.extra);
    setStick(preset.stick);
    setWastePct(preset.waste);
    setShoe(preset.shoe);
    setInsideCorners(preset.id === "open" ? "6" : "4");
    setOutsideCorners(preset.id === "open" ? "2" : "0");
    setCopied(false);
  }

  function reset() {
    setShape("rect");
    setPrice("");
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const linear = unit === "m" ? "m" : "ft";
    const lines = [
      `${copy.gross}: ${formatNum(result.gross)} ${linear}`,
      `${copy.net}: ${formatNum(result.net)} ${linear}`,
      `${copy.order}: ${formatNum(result.order)} ${linear}`,
      `${copy.sticks}: ${result.sticks}`,
      `${copy.leftover}: ${formatNum(result.leftover)} ${linear}`,
      `${copy.corners}: ${result.inside} / ${result.outside}`,
    ];
    if (shoe) lines.push(`${copy.shoeSticks}: ${result.shoeSticks}`);
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) =>
    id === "metric" ? copy.metric : id === "bedroom" ? copy.bedroom : id === "long" ? copy.long : copy.open;
  const linear = unit === "m" ? "m" : "ft";

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
              <option value="perimeter">{copy.known}</option>
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
            {copy.perimeter}
            <input className={inputClass} inputMode="decimal" value={knownPerimeter} onChange={(e) => setKnownPerimeter(e.target.value)} />
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.doors}
            <input className={inputClass} inputMode="numeric" value={doors} onChange={(e) => setDoors(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.doorWidth}
            <input className={inputClass} inputMode="decimal" value={doorWidth} onChange={(e) => setDoorWidth(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.extra}
            <input className={inputClass} inputMode="decimal" value={extra} onChange={(e) => setExtra(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.stick}
            <input className={inputClass} inputMode="decimal" value={stick} onChange={(e) => setStick(e.target.value)} />
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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.inside}
            <input className={inputClass} inputMode="numeric" value={insideCorners} onChange={(e) => setInsideCorners(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.outside}
            <input className={inputClass} inputMode="numeric" value={outsideCorners} onChange={(e) => setOutsideCorners(e.target.value)} />
          </label>
        </div>
        <label className="flex h-11 items-center gap-2 rounded-xl border px-3 text-sm">
          <input type="checkbox" checked={shoe} onChange={(e) => setShoe(e.target.checked)} />
          {copy.shoe}
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
              <dt className="text-muted-foreground">{copy.gross}</dt>
              <dd className="font-medium">{formatNum(result.gross)} {linear}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.net}</dt>
              <dd className="font-medium">{formatNum(result.net)} {linear}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.order}</dt>
              <dd className="font-medium">{formatNum(result.order)} {linear}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.sticks}</dt>
              <dd className="text-base font-semibold">{result.sticks}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.leftover}</dt>
              <dd className="font-medium">{formatNum(result.leftover)} {linear}</dd>
            </div>
            {shoe ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
                <dt className="text-muted-foreground">{copy.shoeSticks}</dt>
                <dd className="font-medium">{result.shoeSticks}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.corners}</dt>
              <dd className="font-medium">{result.inside} / {result.outside}</dd>
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
