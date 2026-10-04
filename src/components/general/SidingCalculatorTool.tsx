import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Layout = "walls" | "area";
type PresetId = "d4" | "d5" | "metric";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const SQUARE_M2 = 9.290304;

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
  walls: string;
  openings: string;
  exposure: string;
  panelL: string;
  waste: string;
  starterL: string;
  jPerimeter: string;
  jL: string;
  corners: string;
  cornerL: string;
};

const PRESETS: Preset[] = [
  { id: "d4", unit: "ft", length: "40", height: "8", walls: "4", openings: "80", exposure: "0.667", panelL: "12.5", waste: "10", starterL: "12", jPerimeter: "48", jL: "12.5", corners: "4", cornerL: "10" },
  { id: "d5", unit: "ft", length: "32", height: "9", walls: "4", openings: "64", exposure: "0.833", panelL: "12", waste: "10", starterL: "12", jPerimeter: "40", jL: "12", corners: "4", cornerL: "10" },
  { id: "metric", unit: "m", length: "10", height: "2.5", walls: "4", openings: "6", exposure: "0.203", panelL: "3.66", waste: "10", starterL: "3.66", jPerimeter: "12", jL: "3.66", corners: "4", cornerL: "3" },
];

export function SidingCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [layout, setLayout] = useState<Layout>("walls");
  const [length, setLength] = useState("10");
  const [height, setHeight] = useState("2.5");
  const [walls, setWalls] = useState("4");
  const [known, setKnown] = useState("100");
  const [openings, setOpenings] = useState("6");
  const [exposure, setExposure] = useState("0.203");
  const [panelL, setPanelL] = useState("3.66");
  const [wastePct, setWastePct] = useState("10");
  const [starterL, setStarterL] = useState("3.66");
  const [jPerimeter, setJPerimeter] = useState("12");
  const [jL, setJL] = useState("3.66");
  const [corners, setCorners] = useState("4");
  const [cornerL, setCornerL] = useState("3");
  const [squarePrice, setSquarePrice] = useState("");
  const [copied, setCopied] = useState(false);

  const areaUnit = unit === "m" ? "m²" : "ft²";
  const linearUnit = unit === "m" ? "m" : "ft";

  const copy = es
    ? {
        help: "Estimá squares, paneles, starter strip y canal J de siding vinílico a partir de las paredes, restando huecos y sumando desperdicio.",
        presets: "Presets",
        d4: "Double-4",
        d5: "Double-5",
        metric: "Métrico 203 mm",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        layout: "Qué revestir",
        walls: "Paredes",
        area: "Área conocida",
        length: `Largo de pared (${linearUnit})`,
        height: `Alto de pared (${linearUnit})`,
        wallCount: "Cantidad de paredes",
        known: `Área conocida (${areaUnit})`,
        openings: `Huecos a restar (${areaUnit})`,
        exposure: `Exposición del panel (${linearUnit})`,
        panelL: `Largo del panel (${linearUnit})`,
        waste: "Desperdicio (%)",
        starterL: `Largo de cada starter (${linearUnit})`,
        jPerimeter: `Perímetro de huecos para canal J (${linearUnit})`,
        jL: `Largo de cada canal J (${linearUnit})`,
        corners: "Esquinas exteriores",
        cornerL: `Largo de cada esquina (${linearUnit})`,
        price: "Precio por square (opcional)",
        result: "Resultado",
        gross: "Área bruta",
        net: "Área neta",
        order: "Área a pedir",
        squares: "Squares",
        panels: "Paneles",
        starter: "Piezas de starter",
        jchannel: "Piezas de canal J",
        cornerPcs: "Esquinas a comprar",
        cost: "Material estimado",
        note: "1 square = 100 ft² (9,29 m²). Paneles, starter, canal J y esquinas se redondean hacia arriba. La exposición es el alto visible, no el ancho total.",
        empty: "Completá las medidas, la exposición y el largo del panel.",
        invalid: "Usá números mayores que cero. Los decimales pueden llevar coma o punto.",
        openingInvalid: "Los huecos no pueden ser negativos ni mayores que el área bruta.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 20%.",
        linearInvalid: "El perímetro de huecos y las esquinas no pueden ser negativos. Las esquinas van de 0 a 40.",
        tooBig: "El área supera el límite de planificación (5.000 m² o 50.000 ft²).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate vinyl siding squares, panels, starter strip, and J-channel from walls, after openings and waste.",
        presets: "Presets",
        d4: "Double-4",
        d5: "Double-5",
        metric: "Metric 203 mm",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        layout: "What to clad",
        walls: "Walls",
        area: "Known area",
        length: `Wall length (${linearUnit})`,
        height: `Wall height (${linearUnit})`,
        wallCount: "Number of walls",
        known: `Known area (${areaUnit})`,
        openings: `Openings to deduct (${areaUnit})`,
        exposure: `Panel exposure (${linearUnit})`,
        panelL: `Panel length (${linearUnit})`,
        waste: "Waste (%)",
        starterL: `Starter piece length (${linearUnit})`,
        jPerimeter: `Opening perimeter for J-channel (${linearUnit})`,
        jL: `J-channel piece length (${linearUnit})`,
        corners: "Outside corners",
        cornerL: `Corner piece length (${linearUnit})`,
        price: "Price per square (optional)",
        result: "Result",
        gross: "Gross area",
        net: "Net area",
        order: "Area to order",
        squares: "Squares",
        panels: "Panels",
        starter: "Starter pieces",
        jchannel: "J-channel pieces",
        cornerPcs: "Corner pieces",
        cost: "Estimated material",
        note: "1 square = 100 ft² (9.29 m²). Panels, starter, J-channel, and corners round up. Exposure is the visible course, not the full panel width.",
        empty: "Enter the dimensions, exposure, and panel length.",
        invalid: "Use numbers greater than zero. Decimals can use a comma or a dot.",
        openingInvalid: "Openings cannot be negative or larger than the gross area.",
        wasteInvalid: "Waste must be between 0% and 20%.",
        linearInvalid: "Opening perimeter and corners cannot be negative. Corners must be from 0 to 40.",
        tooBig: "Area is above the planning limit (5,000 m² or 50,000 ft²).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const len = parseNum(length);
    const ht = parseNum(height);
    const wallCount = parseNum(walls);
    const customArea = parseNum(known);
    const opening = parseNum(openings);
    const exp = parseNum(exposure);
    const panel = parseNum(panelL);
    const waste = parseNum(wastePct);
    const starter = parseNum(starterL);
    const jPerim = parseNum(jPerimeter);
    const jPiece = parseNum(jL);
    const cornerCount = parseNum(corners);
    const cornerPiece = parseNum(cornerL);
    const price = parseNum(squarePrice);
    if (opening == null || exp == null || panel == null || waste == null || starter == null || jPerim == null || jPiece == null || cornerCount == null || cornerPiece == null) {
      return { error: copy.empty };
    }
    if (layout === "area" && customArea == null) return { error: copy.empty };
    if (layout === "walls" && (len == null || ht == null || wallCount == null)) return { error: copy.empty };
    const dims = layout === "area" ? [customArea, exp, panel, starter, jPiece, cornerPiece] : [len, ht, exp, panel, starter, jPiece, cornerPiece];
    if (dims.some((n) => n == null || Number.isNaN(n) || n <= 0) || Number.isNaN(opening) || Number.isNaN(waste) || Number.isNaN(jPerim) || Number.isNaN(cornerCount)) {
      return { error: copy.invalid };
    }
    if (layout === "walls" && (wallCount == null || Number.isNaN(wallCount) || wallCount < 1 || wallCount > 40 || !Number.isInteger(wallCount))) {
      return { error: copy.invalid };
    }
    const gross = layout === "area" ? (customArea as number) : (len as number) * (ht as number) * (wallCount as number);
    const limit = unit === "m" ? 5_000 : 50_000;
    if (gross > limit) return { error: copy.tooBig };
    if (opening < 0 || opening > gross) return { error: copy.openingInvalid };
    if (waste < 0 || waste > 20) return { error: copy.wasteInvalid };
    if (jPerim < 0 || cornerCount < 0 || cornerCount > 40 || !Number.isInteger(cornerCount)) return { error: copy.linearInvalid };
    if (squarePrice.trim() !== "" && (price == null || Number.isNaN(price) || price < 0)) return { error: copy.invalid };
    const net = gross - opening;
    const order = net * (1 + waste / 100);
    const squareSize = unit === "ft" ? 100 : SQUARE_M2;
    const squares = order / squareSize;
    const panelArea = exp * panel;
    const panels = net === 0 ? 0 : Math.ceil(order / panelArea - 1e-9);
    const starterLinear = layout === "walls" ? (len as number) * (wallCount as number) * (1 + waste / 100) : 0;
    const starterPieces = starterLinear === 0 ? 0 : Math.ceil(starterLinear / starter - 1e-9);
    const jLinear = jPerim * (1 + waste / 100);
    const jPieces = jLinear === 0 ? 0 : Math.ceil(jLinear / jPiece - 1e-9);
    const cornerLinear = layout === "walls" ? (ht as number) * cornerCount * (1 + waste / 100) : 0;
    const cornerPieces = cornerLinear === 0 ? 0 : Math.ceil(cornerLinear / cornerPiece - 1e-9);
    const cost = squarePrice.trim() === "" || price == null ? null : squares * price;
    return { gross, net, order, squares, panels, starterPieces, jPieces, cornerPieces, cost, starterSkipped: layout === "area" };
  }, [layout, length, height, walls, known, openings, exposure, panelL, wastePct, starterL, jPerimeter, jL, corners, cornerL, squarePrice, unit, copy.empty, copy.invalid, copy.openingInvalid, copy.wasteInvalid, copy.linearInvalid, copy.tooBig]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLayout("walls");
    setLength(preset.length);
    setHeight(preset.height);
    setWalls(preset.walls);
    setOpenings(preset.openings);
    setExposure(preset.exposure);
    setPanelL(preset.panelL);
    setWastePct(preset.waste);
    setStarterL(preset.starterL);
    setJPerimeter(preset.jPerimeter);
    setJL(preset.jL);
    setCorners(preset.corners);
    setCornerL(preset.cornerL);
    setKnown(preset.unit === "ft" ? "1200" : "100");
    setCopied(false);
  }

  function reset() {
    setSquarePrice("");
    applyPreset(PRESETS[2]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const lines = [
      `${copy.gross}: ${formatNum(result.gross)} ${areaUnit}`,
      `${copy.net}: ${formatNum(result.net)} ${areaUnit}`,
      `${copy.order}: ${formatNum(result.order)} ${areaUnit}`,
      `${copy.squares}: ${formatNum(result.squares)}`,
      `${copy.panels}: ${result.panels}`,
      `${copy.starter}: ${result.starterPieces}`,
      `${copy.jchannel}: ${result.jPieces}`,
      `${copy.cornerPcs}: ${result.cornerPieces}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) => (id === "d4" ? copy.d4 : id === "d5" ? copy.d5 : copy.metric);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={`${buttonClass} w-full`} onClick={() => applyPreset(preset)}>
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
            {copy.layout}
            <select className={inputClass} value={layout} onChange={(e) => setLayout(e.target.value as Layout)}>
              <option value="walls">{copy.walls}</option>
              <option value="area">{copy.area}</option>
            </select>
          </label>
        </div>
        {layout === "area" ? (
          <label className="grid gap-1 text-sm">
            {copy.known}
            <input className={inputClass} inputMode="decimal" value={known} onChange={(e) => setKnown(e.target.value)} />
          </label>
        ) : (
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
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {layout === "walls" ? (
            <label className="grid gap-1 text-sm">
              {copy.wallCount}
              <input className={inputClass} inputMode="numeric" value={walls} onChange={(e) => setWalls(e.target.value)} />
            </label>
          ) : null}
          <label className="grid gap-1 text-sm">
            {copy.openings}
            <input className={inputClass} inputMode="decimal" value={openings} onChange={(e) => setOpenings(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.exposure}
            <input className={inputClass} inputMode="decimal" value={exposure} onChange={(e) => setExposure(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.panelL}
            <input className={inputClass} inputMode="decimal" value={panelL} onChange={(e) => setPanelL(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.starterL}
            <input className={inputClass} inputMode="decimal" value={starterL} onChange={(e) => setStarterL(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.jPerimeter}
            <input className={inputClass} inputMode="decimal" value={jPerimeter} onChange={(e) => setJPerimeter(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.jL}
            <input className={inputClass} inputMode="decimal" value={jL} onChange={(e) => setJL(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.corners}
            <input className={inputClass} inputMode="numeric" value={corners} onChange={(e) => setCorners(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.cornerL}
            <input className={inputClass} inputMode="decimal" value={cornerL} onChange={(e) => setCornerL(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.price}
          <input className={inputClass} inputMode="decimal" value={squarePrice} onChange={(e) => setSquarePrice(e.target.value)} placeholder="0" />
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
            {[
              [copy.gross, `${formatNum(result.gross)} ${areaUnit}`],
              [copy.net, `${formatNum(result.net)} ${areaUnit}`],
              [copy.order, `${formatNum(result.order)} ${areaUnit}`],
              [copy.squares, formatNum(result.squares)],
              [copy.panels, String(result.panels)],
              [copy.starter, result.starterSkipped ? "—" : String(result.starterPieces)],
              [copy.jchannel, String(result.jPieces)],
              [copy.cornerPcs, result.starterSkipped ? "—" : String(result.cornerPieces)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
            {result.cost != null ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
                <dt className="text-muted-foreground">{copy.cost}</dt>
                <dd className="font-medium">{formatNum(result.cost)}</dd>
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground">{copy.note}</p>
            {result.starterSkipped ? (
              <p className="text-xs text-muted-foreground">
                {es
                  ? "Con área conocida no se estima starter ni esquinas: hace falta el largo y el alto de las paredes."
                  : "Known area does not estimate starter or corners: those need wall length and height."}
              </p>
            ) : null}
          </dl>
        )}
      </section>
    </div>
  );
}
