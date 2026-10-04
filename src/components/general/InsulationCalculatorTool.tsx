import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Layout = "walls" | "attic" | "area";
type PresetId = "r13" | "attic" | "panel" | "roll";

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
  layout: Layout;
  length: string;
  width: string;
  walls: string;
  openings: string;
  pieceW: string;
  pieceL: string;
  perPack: string;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "r13", unit: "ft", layout: "walls", length: "40", width: "8", walls: "4", openings: "48", pieceW: "1.25", pieceL: "7.75", perPack: "10", waste: "10" },
  { id: "attic", unit: "ft", layout: "attic", length: "40", width: "30", walls: "1", openings: "0", pieceW: "1.25", pieceL: "32", perPack: "1", waste: "10" },
  { id: "panel", unit: "m", layout: "walls", length: "4", width: "2.4", walls: "4", openings: "4", pieceW: "0.6", pieceL: "1.2", perPack: "8", waste: "10" },
  { id: "roll", unit: "m", layout: "attic", length: "8", width: "6", walls: "1", openings: "0", pieceW: "0.6", pieceL: "10", perPack: "1", waste: "8" },
];

export function InsulationCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [layout, setLayout] = useState<Layout>("walls");
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("2.4");
  const [walls, setWalls] = useState("4");
  const [known, setKnown] = useState("40");
  const [openings, setOpenings] = useState("4");
  const [pieceW, setPieceW] = useState("0.6");
  const [pieceL, setPieceL] = useState("1.2");
  const [perPack, setPerPack] = useState("8");
  const [wastePct, setWastePct] = useState("10");
  const [packPrice, setPackPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const areaUnit = unit === "m" ? "m²" : "ft²";
  const linearUnit = unit === "m" ? "m" : "ft";

  const copy = es
    ? {
        help: "Estimá paneles, mantas o rollos de aislante a partir de paredes o buhardilla, restando huecos y sumando desperdicio.",
        presets: "Presets",
        r13: "Pared R-13",
        attic: "Buhardilla R-30",
        panel: "Panel 60×120",
        roll: "Rollo 0,6×10 m",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        layout: "Qué aislar",
        walls: "Paredes",
        atticLayout: "Buhardilla o techo",
        area: "Área conocida",
        length: layout === "attic" ? `Largo (${linearUnit})` : `Largo de pared (${linearUnit})`,
        width: layout === "attic" ? `Ancho (${linearUnit})` : `Alto de pared (${linearUnit})`,
        wallCount: "Cantidad de paredes",
        known: `Área conocida (${areaUnit})`,
        openings: `Huecos a restar (${areaUnit})`,
        pieceW: `Ancho de la pieza (${linearUnit})`,
        pieceL: `Largo de la pieza (${linearUnit})`,
        perPack: "Piezas por paquete",
        waste: "Desperdicio (%)",
        price: "Precio por paquete (opcional)",
        result: "Resultado",
        gross: "Área bruta",
        net: "Área neta",
        order: "Área a pedir",
        pieceArea: "Cobertura por pieza",
        pieces: "Piezas a comprar",
        packs: "Paquetes",
        cost: "Material estimado",
        note: "Las piezas y los paquetes se redondean hacia arriba. Los huecos se restan antes del desperdicio.",
        empty: "Completá las medidas, el tamaño de la pieza y las piezas por paquete.",
        invalid: "Usá números mayores que cero. Los decimales pueden llevar coma o punto.",
        openingInvalid: "Los huecos no pueden ser negativos ni mayores que el área bruta.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 25%.",
        packInvalid: "Las piezas por paquete tienen que ser un entero entre 1 y 100.",
        tooBig: "El área supera el límite de planificación (5.000 m² o 50.000 ft²).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate insulation batts, panels, or rolls from walls or an attic, after openings and waste.",
        presets: "Presets",
        r13: "R-13 walls",
        attic: "R-30 attic",
        panel: "60×120 panel",
        roll: "0.6×10 m roll",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        layout: "What to insulate",
        walls: "Walls",
        atticLayout: "Attic or ceiling",
        area: "Known area",
        length: layout === "attic" ? `Length (${linearUnit})` : `Wall length (${linearUnit})`,
        width: layout === "attic" ? `Width (${linearUnit})` : `Wall height (${linearUnit})`,
        wallCount: "Number of walls",
        known: `Known area (${areaUnit})`,
        openings: `Openings to deduct (${areaUnit})`,
        pieceW: `Piece width (${linearUnit})`,
        pieceL: `Piece length (${linearUnit})`,
        perPack: "Pieces per package",
        waste: "Waste (%)",
        price: "Price per package (optional)",
        result: "Result",
        gross: "Gross area",
        net: "Net area",
        order: "Area to order",
        pieceArea: "Coverage per piece",
        pieces: "Pieces to buy",
        packs: "Packages",
        cost: "Estimated material",
        note: "Pieces and packages round up. Openings are deducted before waste.",
        empty: "Enter the dimensions, piece size, and pieces per package.",
        invalid: "Use numbers greater than zero. Decimals can use a comma or a dot.",
        openingInvalid: "Openings cannot be negative or larger than the gross area.",
        wasteInvalid: "Waste must be between 0% and 25%.",
        packInvalid: "Pieces per package must be a whole number from 1 to 100.",
        tooBig: "Area is above the planning limit (5,000 m² or 50,000 ft²).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const len = parseNum(length);
    const wid = parseNum(width);
    const wallCount = parseNum(walls);
    const customArea = parseNum(known);
    const opening = parseNum(openings);
    const pw = parseNum(pieceW);
    const pl = parseNum(pieceL);
    const pack = parseNum(perPack);
    const waste = parseNum(wastePct);
    const price = parseNum(packPrice);
    if (opening == null || pw == null || pl == null || pack == null || waste == null) return { error: copy.empty };
    if (layout === "area" && customArea == null) return { error: copy.empty };
    if (layout !== "area" && (len == null || wid == null || (layout === "walls" && wallCount == null))) return { error: copy.empty };
    const dims = layout === "area" ? [customArea, pw, pl] : [len, wid, pw, pl];
    if (dims.some((n) => n == null || Number.isNaN(n) || n <= 0) || Number.isNaN(opening) || Number.isNaN(pack) || Number.isNaN(waste)) {
      return { error: copy.invalid };
    }
    if (layout === "walls" && (wallCount == null || Number.isNaN(wallCount) || wallCount < 1 || wallCount > 40 || !Number.isInteger(wallCount))) {
      return { error: copy.invalid };
    }
    const gross =
      layout === "area"
        ? (customArea as number)
        : layout === "attic"
          ? (len as number) * (wid as number)
          : (len as number) * (wid as number) * (wallCount as number);
    const limit = unit === "m" ? 5_000 : 50_000;
    if (gross > limit) return { error: copy.tooBig };
    if (opening < 0 || opening > gross) return { error: copy.openingInvalid };
    if (waste < 0 || waste > 25) return { error: copy.wasteInvalid };
    if (!Number.isInteger(pack) || pack < 1 || pack > 100) return { error: copy.packInvalid };
    if (packPrice.trim() !== "" && (price == null || Number.isNaN(price) || price < 0)) return { error: copy.invalid };
    const net = gross - opening;
    const order = net * (1 + waste / 100);
    const pieceArea = pw * pl;
    const pieces = net === 0 ? 0 : Math.ceil(order / pieceArea - 1e-9);
    const packs = pieces === 0 ? 0 : Math.ceil(pieces / pack - 1e-9);
    const cost = packPrice.trim() === "" || price == null ? null : packs * price;
    return { gross, net, order, pieceArea, pieces, packs, cost };
  }, [layout, length, width, walls, known, openings, pieceW, pieceL, perPack, wastePct, packPrice, unit, copy.empty, copy.invalid, copy.openingInvalid, copy.wasteInvalid, copy.packInvalid, copy.tooBig]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLayout(preset.layout);
    setLength(preset.length);
    setWidth(preset.width);
    setWalls(preset.walls);
    setOpenings(preset.openings);
    setPieceW(preset.pieceW);
    setPieceL(preset.pieceL);
    setPerPack(preset.perPack);
    setWastePct(preset.waste);
    setKnown(preset.unit === "ft" ? "1200" : "40");
    setCopied(false);
  }

  function reset() {
    setPackPrice("");
    applyPreset(PRESETS[2]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const lines = [
      `${copy.gross}: ${formatNum(result.gross)} ${areaUnit}`,
      `${copy.net}: ${formatNum(result.net)} ${areaUnit}`,
      `${copy.order}: ${formatNum(result.order)} ${areaUnit}`,
      `${copy.pieceArea}: ${formatNum(result.pieceArea)} ${areaUnit}`,
      `${copy.pieces}: ${result.pieces}`,
      `${copy.packs}: ${result.packs}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) => (id === "r13" ? copy.r13 : id === "attic" ? copy.attic : id === "panel" ? copy.panel : copy.roll);

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
            {copy.layout}
            <select className={inputClass} value={layout} onChange={(e) => setLayout(e.target.value as Layout)}>
              <option value="walls">{copy.walls}</option>
              <option value="attic">{copy.atticLayout}</option>
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
              {copy.width}
              <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
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
            {copy.pieceW}
            <input className={inputClass} inputMode="decimal" value={pieceW} onChange={(e) => setPieceW(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.pieceL}
            <input className={inputClass} inputMode="decimal" value={pieceL} onChange={(e) => setPieceL(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.perPack}
            <input className={inputClass} inputMode="numeric" value={perPack} onChange={(e) => setPerPack(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.price}
          <input className={inputClass} inputMode="decimal" value={packPrice} onChange={(e) => setPackPrice(e.target.value)} placeholder="0" />
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
              [copy.pieceArea, `${formatNum(result.pieceArea)} ${areaUnit}`],
              [copy.pieces, String(result.pieces)],
              [copy.packs, String(result.packs)],
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
          </dl>
        )}
      </section>
    </div>
  );
}
