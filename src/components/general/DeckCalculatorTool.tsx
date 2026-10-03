import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import type { Locale } from "@/lib/i18n/locale";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

type Direction = "length" | "width";

type Preset = {
  id: string;
  length: string;
  width: string;
  board: string;
  gap: string;
  stock: string;
  spacing: string;
  waste: string;
  direction: Direction;
};

const PRESETS: Preset[] = [
  { id: "patio", length: "3.6", width: "2.4", board: "140", gap: "5", stock: "3.6", direction: "length", spacing: "400", waste: "10" },
  { id: "family", length: "4.8", width: "3.6", board: "140", gap: "5", stock: "4.8", direction: "length", spacing: "400", waste: "12" },
  { id: "wide", length: "6", width: "4", board: "90", gap: "5", stock: "3", direction: "width", spacing: "600", waste: "15" },
];

export function DeckCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("3.6");
  const [widthM, setWidthM] = useState("2.4");
  const [boardMm, setBoardMm] = useState("140");
  const [gapMm, setGapMm] = useState("5");
  const [stockM, setStockM] = useState("3.6");
  const [spacingMm, setSpacingMm] = useState("400");
  const [wastePct, setWastePct] = useState("10");
  const [direction, setDirection] = useState<Direction>("length");
  const [screwsEach, setScrewsEach] = useState("2");
  const [boxSize, setBoxSize] = useState("100");
  const [boardPrice, setBoardPrice] = useState("");
  const [joistPrice, setJoistPrice] = useState("");
  const [boxPrice, setBoxPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá tablas de deck, vigas y tornillos de una terraza rectangular. Las vigas cruzan la tabla; el remate no incluye solera ni pilares. Los precios son opcionales.",
        presets: "Presets",
        patio: "Patio 3,6×2,4",
        family: "Familiar 4,8×3,6",
        wide: "Ancho 6×4",
        length: "Largo (m)",
        width: "Ancho (m)",
        board: "Ancho de tabla (mm)",
        gap: "Junta entre tablas (mm)",
        stock: "Largo de pieza (m)",
        spacing: "Separación de vigas (mm)",
        waste: "Desperdicio (%)",
        direction: "Dirección de las tablas",
        alongLength: "A lo largo",
        alongWidth: "A lo ancho",
        screws: "Tornillos por cruce",
        box: "Tornillos por caja",
        prices: "Precios opcionales",
        boardPrice: "Precio por tabla",
        joistPrice: "Precio por viga",
        boxPrice: "Precio por caja",
        result: "Lista de materiales",
        area: "Superficie",
        rows: "Filas de tablas",
        boards: "Tablas a comprar",
        joists: "Vigas",
        joistCut: "Corte de cada viga",
        rim: "Remate (ambos lados)",
        screwsTotal: "Tornillos",
        boxes: "Cajas de tornillos",
        cost: "Costo de material",
        note: "Rectángulo simple. No dimensiona carga, pilares ni escaleras. Confirmá la separación con el fabricante.",
        copyBtn: "Copiar lista",
        copied: "Copiado",
        reset: "Reiniciar",
        invalid: "Ingresá largo y ancho mayores que 0 y de hasta 40 m.",
        boardInvalid: "El ancho de tabla más la junta tiene que ser mayor que 0.",
        stockInvalid: "El largo de pieza tiene que ser mayor que 0.",
        spacingInvalid: "La separación de vigas tiene que ser mayor que 0.",
        wasteInvalid: "El desperdicio no puede ser negativo.",
        screwsInvalid: "Los tornillos por cruce tienen que ser un entero de 0 o más.",
        boxInvalid: "La caja tiene que traer al menos 1 tornillo.",
        priceInvalid: "Los precios opcionales tienen que ser números de 0 o más.",
      }
    : {
        help: "Estimate deck boards, joists, and screws for a rectangular deck. Joists cross the boards. Rim length does not include a ledger or posts. Prices are optional.",
        presets: "Presets",
        patio: "Patio 3.6×2.4",
        family: "Family 4.8×3.6",
        wide: "Wide 6×4",
        length: "Length (m)",
        width: "Width (m)",
        board: "Board width (mm)",
        gap: "Gap between boards (mm)",
        stock: "Stock board length (m)",
        spacing: "Joist spacing (mm)",
        waste: "Waste (%)",
        direction: "Board direction",
        alongLength: "Along the length",
        alongWidth: "Along the width",
        screws: "Screws per crossing",
        box: "Screws per box",
        prices: "Optional prices",
        boardPrice: "Price per board",
        joistPrice: "Price per joist",
        boxPrice: "Price per box",
        result: "Materials list",
        area: "Area",
        rows: "Board rows",
        boards: "Boards to buy",
        joists: "Joists",
        joistCut: "Each joist cut",
        rim: "Rim (both sides)",
        screwsTotal: "Screws",
        boxes: "Screw boxes",
        cost: "Material cost",
        note: "Simple rectangle only. It does not size loads, posts, or stairs. Match spacing to the board maker.",
        copyBtn: "Copy list",
        copied: "Copied",
        reset: "Reset",
        invalid: "Enter length and width greater than 0 and up to 40 m.",
        boardInvalid: "Board width plus gap must be greater than 0.",
        stockInvalid: "Stock board length must be greater than 0.",
        spacingInvalid: "Joist spacing must be greater than 0.",
        wasteInvalid: "Waste cannot be negative.",
        screwsInvalid: "Screws per crossing must be an integer of 0 or more.",
        boxInvalid: "A box must contain at least 1 screw.",
        priceInvalid: "Optional prices must be numbers of 0 or more.",
      };

  const result = useMemo(() => {
    const length = parseNum(lengthM);
    const width = parseNum(widthM);
    const board = parseNum(boardMm);
    const gap = parseNum(gapMm);
    const stock = parseNum(stockM);
    const spacing = parseNum(spacingMm);
    const waste = parseNum(wastePct);
    const screws = parseNum(screwsEach);
    const box = parseNum(boxSize);
    if (length == null || width == null || length <= 0 || width <= 0 || length > 40 || width > 40) return { error: copy.invalid };
    if (board == null || gap == null || board < 0 || gap < 0 || board + gap <= 0) return { error: copy.boardInvalid };
    if (stock == null || stock <= 0) return { error: copy.stockInvalid };
    if (spacing == null || spacing <= 0) return { error: copy.spacingInvalid };
    if (waste == null || waste < 0) return { error: copy.wasteInvalid };
    if (screws == null || screws < 0 || !Number.isInteger(screws)) return { error: copy.screwsInvalid };
    if (box == null || box < 1 || !Number.isInteger(box)) return { error: copy.boxInvalid };
    const run = direction === "length" ? length : width;
    const across = direction === "length" ? width : length;
    const pitch = (board + gap) / 1000;
    const rows = Math.max(1, Math.ceil(across / pitch - 1e-9));
    const piecesPerRow = Math.max(1, Math.ceil(run / stock - 1e-9));
    const boards = Math.ceil(rows * piecesPerRow * (1 + waste / 100) - 1e-9);
    const joists = Math.ceil(run / (spacing / 1000) - 1e-9) + 1;
    const joistCut = across;
    const rim = run * 2;
    const screwCount = rows * joists * screws;
    const boxes = screwCount === 0 ? 0 : Math.ceil(screwCount / box - 1e-9);
    const prices = [boardPrice, joistPrice, boxPrice].map((value) => (value.trim() ? parseNum(value) : 0));
    if (prices.some((value) => value == null || value < 0)) return { error: copy.priceInvalid };
    const [bp, jp, xp] = prices as number[];
    const hasPrice = [boardPrice, joistPrice, boxPrice].some((value) => value.trim());
    const cost = bp * boards + jp * joists + xp * boxes;
    return {
      area: length * width,
      rows,
      boards,
      joists,
      joistCut,
      rim,
      screwCount,
      boxes,
      cost: hasPrice ? cost : null,
    };
  }, [lengthM, widthM, boardMm, gapMm, stockM, spacingMm, wastePct, direction, screwsEach, boxSize, boardPrice, joistPrice, boxPrice, copy]);

  function applyPreset(preset: Preset) {
    setLengthM(preset.length);
    setWidthM(preset.width);
    setBoardMm(preset.board);
    setGapMm(preset.gap);
    setStockM(preset.stock);
    setSpacingMm(preset.spacing);
    setWastePct(preset.waste);
    setDirection(preset.direction);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
    setScrewsEach("2");
    setBoxSize("100");
    setBoardPrice("");
    setJoistPrice("");
    setBoxPrice("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const costText = result.cost == null ? "" : es ? `, costo ${formatNum(result.cost)}` : `, cost ${formatNum(result.cost)}`;
    const text = es
      ? `Deck: ${result.boards} tablas, ${result.joists} vigas de ${formatNum(result.joistCut)} m, remate ${formatNum(result.rim)} m, ${result.boxes} cajas (${result.screwCount} tornillos)${costText}.`
      : `Deck: ${result.boards} boards, ${result.joists} joists at ${formatNum(result.joistCut)} m, rim ${formatNum(result.rim)} m, ${result.boxes} boxes (${result.screwCount} screws)${costText}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) => (id === "patio" ? copy.patio : id === "family" ? copy.family : copy.wide);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(event) => event.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={buttonClass} onClick={() => applyPreset(preset)}>
                {presetLabel(preset.id)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.length}
            <input className={inputClass} inputMode="decimal" value={lengthM} onChange={(event) => setLengthM(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.width}
            <input className={inputClass} inputMode="decimal" value={widthM} onChange={(event) => setWidthM(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.board}
            <input className={inputClass} inputMode="decimal" value={boardMm} onChange={(event) => setBoardMm(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.gap}
            <input className={inputClass} inputMode="decimal" value={gapMm} onChange={(event) => setGapMm(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.stock}
            <input className={inputClass} inputMode="decimal" value={stockM} onChange={(event) => setStockM(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.spacing}
            <input className={inputClass} inputMode="decimal" value={spacingMm} onChange={(event) => setSpacingMm(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(event) => setWastePct(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.direction}
            <select className={inputClass} value={direction} onChange={(event) => setDirection(event.target.value as Direction)}>
              <option value="length">{copy.alongLength}</option>
              <option value="width">{copy.alongWidth}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.screws}
            <input className={inputClass} inputMode="numeric" value={screwsEach} onChange={(event) => setScrewsEach(event.target.value)} />
          </label>
          <label className={ "grid gap-1 text-sm"}>
            {copy.box}
            <input className={inputClass} inputMode="numeric" value={boxSize} onChange={(event) => setBoxSize(event.target.value)} />
          </label>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.prices}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm">
              {copy.boardPrice}
              <input className={inputClass} inputMode="decimal" placeholder="0" value={boardPrice} onChange={(event) => setBoardPrice(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.joistPrice}
              <input className={inputClass} inputMode="decimal" placeholder="0" value={joistPrice} onChange={(event) => setJoistPrice(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.boxPrice}
              <input className={inputClass} inputMode="decimal" placeholder="0" value={boxPrice} onChange={(event) => setBoxPrice(event.target.value)} />
            </label>
          </div>
        </div>
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
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.area}</dt>
                <dd className="font-medium">{formatNum(result.area)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.rows}</dt>
                <dd className="font-medium">{result.rows}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.boards}</dt>
                <dd className="font-medium">{result.boards}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.joists}</dt>
                <dd className="font-medium">{result.joists}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.joistCut}</dt>
                <dd className="font-medium">{formatNum(result.joistCut)} m</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.rim}</dt>
                <dd className="font-medium">{formatNum(result.rim)} m</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.screwsTotal}</dt>
                <dd className="font-medium">{result.screwCount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.boxes}</dt>
                <dd className="font-medium">{result.boxes}</dd>
              </div>
              {result.cost != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.cost}</dt>
                  <dd className="font-medium">{formatNum(result.cost)}</dd>
                </div>
              )}
            </dl>
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
