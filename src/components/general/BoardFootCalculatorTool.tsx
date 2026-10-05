import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "in" | "mm";
type Basis = "actual" | "nominal";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const IN_PER_MM = 1 / 25.4;
const FT_PER_M = 3.280839895;
const M3_PER_BF = 0.002359737;

type SizePreset = {
  id: string;
  label: string;
  labelEs: string;
  nominalT: number;
  nominalW: number;
  actualT: number;
  actualW: number;
};

const SIZES: SizePreset[] = [
  { id: "2x4", label: "2×4", labelEs: "2×4", nominalT: 2, nominalW: 4, actualT: 1.5, actualW: 3.5 },
  { id: "2x6", label: "2×6", labelEs: "2×6", nominalT: 2, nominalW: 6, actualT: 1.5, actualW: 5.5 },
  { id: "2x8", label: "2×8", labelEs: "2×8", nominalT: 2, nominalW: 8, actualT: 1.5, actualW: 7.25 },
  { id: "2x10", label: "2×10", labelEs: "2×10", nominalT: 2, nominalW: 10, actualT: 1.5, actualW: 9.25 },
  { id: "2x12", label: "2×12", labelEs: "2×12", nominalT: 2, nominalW: 12, actualT: 1.5, actualW: 11.25 },
  { id: "4x4", label: "4×4", labelEs: "4×4", nominalT: 4, nominalW: 4, actualT: 3.5, actualW: 3.5 },
  { id: "1x6", label: "1×6", labelEs: "1×6", nominalT: 1, nominalW: 6, actualT: 0.75, actualW: 5.5 },
  { id: "1x8", label: "1×8", labelEs: "1×8", nominalT: 1, nominalW: 8, actualT: 0.75, actualW: 7.25 },
];

type Row = { id: string; label: string; thickness: string; width: string; length: string; qty: string };

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

function blankRow(partial?: Partial<Row>): Row {
  return {
    id: uid(),
    label: partial?.label ?? "",
    thickness: partial?.thickness ?? "",
    width: partial?.width ?? "",
    length: partial?.length ?? "",
    qty: partial?.qty ?? "1",
  };
}

const PRESET_ROWS: Record<string, { unit: Unit; basis: Basis; waste: string; rows: Omit<Row, "id">[] }> = {
  studs: {
    unit: "in",
    basis: "actual",
    waste: "10",
    rows: [{ label: "2x4 studs", thickness: "1.5", width: "3.5", length: "8", qty: "20" }],
  },
  joists: {
    unit: "in",
    basis: "nominal",
    waste: "10",
    rows: [{ label: "2x8 joists", thickness: "2", width: "8", length: "12", qty: "10" }],
  },
  posts: {
    unit: "in",
    basis: "actual",
    waste: "5",
    rows: [{ label: "4x4 posts", thickness: "3.5", width: "3.5", length: "8", qty: "6" }],
  },
  metric: {
    unit: "mm",
    basis: "actual",
    waste: "10",
    rows: [{ label: "estante", thickness: "20", width: "200", length: "1.8", qty: "4" }],
  },
};

export function BoardFootCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("in");
  const [basis, setBasis] = useState<Basis>("actual");
  const [wastePct, setWastePct] = useState("10");
  const [price, setPrice] = useState("");
  const [rows, setRows] = useState<Row[]>(() => PRESET_ROWS.studs.rows.map((row) => blankRow(row)));
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Convertí una lista de cortes a pies tablares, volumen y costo. Un pie tablar es una tabla de 12 × 12 pulgadas y 1 pulgada de espesor. Nada se sube: el cálculo queda en el navegador.",
        presets: "Ejemplos",
        studs: "Montantes 2×4",
        joists: "Viguetas 2×8",
        posts: "Postes 4×4",
        metric: "Estante en mm",
        units: "Unidades",
        inches: "Pulgadas y pies",
        metricUnit: "Milímetros y metros",
        basis: "Medida para el pie tablar",
        actual: "Cepillada (real)",
        nominal: "Nominal (de catálogo)",
        basisHint: "En pulgadas, un 2×4 cepillado mide 1,5 × 3,5. Algunos aserraderos facturan el nominal 2 × 4.",
        waste: "Desperdicio (%)",
        price: "Precio por pie tablar (opcional)",
        pricePh: "3.50",
        cutList: "Lista de cortes",
        add: "Agregar corte",
        remove: "Quitar",
        piece: "Pieza",
        thickness: "Espesor",
        width: "Ancho",
        length: "Largo",
        qty: "Cantidad",
        sizes: "Secciones habituales",
        reset: "Restablecer",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        results: "Resultado",
        boardFeet: "Pies tablares",
        withWaste: "Con desperdicio",
        cubicFeet: "Pies cúbicos",
        cubicMeters: "Metros cúbicos",
        linear: "Largo lineal",
        pieces: "Piezas a pedir",
        cost: "Costo estimado",
        perPiece: "Por pieza",
        empty: "Agregá al menos un corte con espesor, ancho, largo y cantidad.",
        invalid: "Usá números mayores que cero. La cantidad debe ser un entero.",
        tooBig: "Un valor supera el límite de la lista (24 in / 600 mm, 40 ft / 12 m, 200 piezas por corte).",
        wasteInvalid: "El desperdicio debe estar entre 0 y 80 %.",
        priceInvalid: "El precio no puede ser negativo.",
        rowsInvalid: "Máximo 12 cortes.",
      }
    : {
        help: "Turn a cut list into board feet, volume, and cost. One board foot is a 12 × 12 inch board, 1 inch thick. Nothing is uploaded: the math stays in the browser.",
        presets: "Examples",
        studs: "2×4 studs",
        joists: "2×8 joists",
        posts: "4×4 posts",
        metric: "Shelf in mm",
        units: "Units",
        inches: "Inches and feet",
        metricUnit: "Millimeters and meters",
        basis: "Size used for board feet",
        actual: "Dressed (actual)",
        nominal: "Nominal (name size)",
        basisHint: "In inches, a dressed 2×4 is 1.5 × 3.5. Some yards bill the nominal 2 × 4.",
        waste: "Waste (%)",
        price: "Price per board foot (optional)",
        pricePh: "3.50",
        cutList: "Cut list",
        add: "Add cut",
        remove: "Remove",
        piece: "Piece",
        thickness: "Thickness",
        width: "Width",
        length: "Length",
        qty: "Quantity",
        sizes: "Common sections",
        reset: "Reset",
        copyBtn: "Copy result",
        copied: "Copied",
        results: "Result",
        boardFeet: "Board feet",
        withWaste: "With waste",
        cubicFeet: "Cubic feet",
        cubicMeters: "Cubic meters",
        linear: "Linear length",
        pieces: "Pieces to order",
        cost: "Estimated cost",
        perPiece: "Per piece",
        empty: "Add at least one cut with thickness, width, length, and quantity.",
        invalid: "Use numbers greater than zero. Quantity must be a whole number.",
        tooBig: "A value is over the cut-list limit (24 in / 600 mm, 40 ft / 12 m, 200 pieces per cut).",
        wasteInvalid: "Waste must be between 0 and 80%.",
        priceInvalid: "Price cannot be negative.",
        rowsInvalid: "Maximum 12 cuts.",
      };

  const result = useMemo(() => {
    if (rows.length > 12) return { error: copy.rowsInvalid };
    const waste = parseNum(wastePct);
    if (waste == null || Number.isNaN(waste) || waste < 0 || waste > 80) return { error: copy.wasteInvalid };
    const priceN = price.trim() ? parseNum(price) : null;
    if (priceN != null && (Number.isNaN(priceN) || priceN < 0)) return { error: copy.priceInvalid };

    const filled = rows.filter((row) => row.thickness.trim() || row.width.trim() || row.length.trim() || row.qty.trim());
    if (!filled.length) return { error: copy.empty };

    let boardFeet = 0;
    let linearFt = 0;
    let pieces = 0;
    const lines: { label: string; bf: number; qty: number }[] = [];

    for (const row of filled) {
      const t = parseNum(row.thickness);
      const w = parseNum(row.width);
      const len = parseNum(row.length);
      const qty = parseNum(row.qty);
      if (t == null || w == null || len == null || qty == null || [t, w, len, qty].some((n) => Number.isNaN(n))) {
        return { error: copy.invalid };
      }
      if (t <= 0 || w <= 0 || len <= 0 || qty <= 0 || !Number.isInteger(qty)) return { error: copy.invalid };
      const tIn = unit === "in" ? t : t * IN_PER_MM;
      const wIn = unit === "in" ? w : w * IN_PER_MM;
      const lenFt = unit === "in" ? len : len * FT_PER_M;
      if (tIn > 24 || wIn > 24 || lenFt > 40 || qty > 200) return { error: copy.tooBig };
      const bf = (tIn * wIn * lenFt * qty) / 12;
      boardFeet += bf;
      linearFt += lenFt * qty;
      pieces += qty;
      lines.push({ label: row.label.trim() || copy.piece, bf, qty });
    }

    const withWaste = boardFeet * (1 + waste / 100);
    const orderPieces = Math.ceil(pieces * (1 + waste / 100));
    const cost = priceN == null ? null : withWaste * priceN;
    return {
      boardFeet,
      withWaste,
      cubicFeet: withWaste / 12,
      cubicMeters: withWaste * M3_PER_BF,
      linearFt,
      pieces,
      orderPieces,
      cost,
      lines,
    };
  }, [rows, wastePct, price, unit, copy]);


  function convertRows(next: Basis) {
    setRows((current) =>
      current.map((row) => {
        const t = parseNum(row.thickness);
        const w = parseNum(row.width);
        if (t == null || w == null || Number.isNaN(t) || Number.isNaN(w)) return row;
        const tIn = unit === "in" ? t : t * IN_PER_MM;
        const wIn = unit === "in" ? w : w * IN_PER_MM;
        const match = SIZES.find((size) => {
          const srcT = basis === "nominal" ? size.nominalT : size.actualT;
          const srcW = basis === "nominal" ? size.nominalW : size.actualW;
          return Math.abs(srcT - tIn) < 0.08 && Math.abs(srcW - wIn) < 0.08;
        });
        if (!match) return row;
        const nextT = next === "nominal" ? match.nominalT : match.actualT;
        const nextW = next === "nominal" ? match.nominalW : match.actualW;
        return {
          ...row,
          thickness: unit === "in" ? String(nextT) : String(Math.round(nextT / IN_PER_MM)),
          width: unit === "in" ? String(nextW) : String(Math.round(nextW / IN_PER_MM)),
        };
      }),
    );
  }

  function applyPreset(id: string) {
    const preset = PRESET_ROWS[id];
    setUnit(preset.unit);
    setBasis(preset.basis);
    setWastePct(preset.waste);
    setRows(preset.rows.map((row) => blankRow(row)));
    setCopied(false);
  }

  function applySize(size: SizePreset, rowId: string) {
    const t = basis === "nominal" ? size.nominalT : size.actualT;
    const w = basis === "nominal" ? size.nominalW : size.actualW;
    const thickness = unit === "in" ? String(t) : String(Math.round(t / IN_PER_MM));
    const width = unit === "in" ? String(w) : String(Math.round(w / IN_PER_MM));
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, thickness, width, label: row.label || size.label } : row)),
    );
    setCopied(false);
  }

  function reset() {
    setPrice("");
    applyPreset("studs");
  }

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    setCopied(false);
  }

  async function copyResult() {
    if ("error" in result) return;
    const u = unit === "in" ? "ft" : "m";
    const linear = unit === "in" ? result.linearFt : result.linearFt / FT_PER_M;
    const lines = [
      `${copy.boardFeet}: ${formatNum(result.boardFeet, 2)}`,
      `${copy.withWaste}: ${formatNum(result.withWaste, 2)}`,
      `${copy.cubicFeet}: ${formatNum(result.cubicFeet, 2)}`,
      `${copy.cubicMeters}: ${formatNum(result.cubicMeters, 3)}`,
      `${copy.linear}: ${formatNum(linear, 2)} ${u}`,
      `${copy.pieces}: ${result.orderPieces}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost, 2)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const tUnit = unit === "in" ? "in" : "mm";
  const lUnit = unit === "in" ? "ft" : "m";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={buttonClass} onClick={() => applyPreset("studs")}>{copy.studs}</button>
            <button type="button" className={buttonClass} onClick={() => applyPreset("joists")}>{copy.joists}</button>
            <button type="button" className={buttonClass} onClick={() => applyPreset("posts")}>{copy.posts}</button>
            <button type="button" className={buttonClass} onClick={() => applyPreset("metric")}>{copy.metric}</button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.units}
            <select className={inputClass} value={unit} onChange={(e) => { setUnit(e.target.value as Unit); setCopied(false); }}>
              <option value="in">{copy.inches}</option>
              <option value="mm">{copy.metricUnit}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.basis}
            <select className={inputClass} value={basis} onChange={(e) => { setBasis(e.target.value as Basis); convertRows(e.target.value as Basis); setCopied(false); }}>
              <option value="actual">{copy.actual}</option>
              <option value="nominal">{copy.nominal}</option>
            </select>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">{copy.basisHint}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => { setWastePct(e.target.value); setCopied(false); }} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.price}
            <input className={inputClass} inputMode="decimal" placeholder={copy.pricePh} value={price} onChange={(e) => { setPrice(e.target.value); setCopied(false); }} />
          </label>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{copy.cutList}</p>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setRows((current) => (current.length >= 12 ? current : [...current, blankRow()]))}
            >
              {copy.add}
            </button>
          </div>
          {rows.map((row, index) => (
            <div key={row.id} className="grid gap-2 rounded-xl border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {copy.piece} {index + 1}
                </p>
                {rows.length > 1 ? (
                  <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}>
                    {copy.remove}
                  </button>
                ) : null}
              </div>
              <label className="grid gap-1 text-sm">
                {copy.piece}
                <input className={inputClass} value={row.label} onChange={(e) => updateRow(row.id, { label: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <label className="grid gap-1 text-sm">
                  {copy.thickness} ({tUnit})
                  <input className={inputClass} inputMode="decimal" value={row.thickness} onChange={(e) => updateRow(row.id, { thickness: e.target.value })} />
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.width} ({tUnit})
                  <input className={inputClass} inputMode="decimal" value={row.width} onChange={(e) => updateRow(row.id, { width: e.target.value })} />
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.length} ({lUnit})
                  <input className={inputClass} inputMode="decimal" value={row.length} onChange={(e) => updateRow(row.id, { length: e.target.value })} />
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.qty}
                  <input className={inputClass} inputMode="numeric" value={row.qty} onChange={(e) => updateRow(row.id, { qty: e.target.value })} />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button key={size.id} type="button" className="h-9 rounded-xl border px-3 text-xs font-medium hover:bg-muted" onClick={() => applySize(size, row.id)}>
                    {es ? size.labelEs : size.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button type="button" className={`${buttonClass} w-full`} onClick={reset}>{copy.reset}</button>
      </form>
      <section className="grid content-start gap-3 rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{copy.results}</h2>
        {"error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <>
            <dl className="grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                <dt>{copy.boardFeet}</dt>
                <dd className="font-semibold">{formatNum(result.boardFeet)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                <dt>{copy.withWaste}</dt>
                <dd className="font-semibold">{formatNum(result.withWaste)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                <dt>{copy.cubicFeet}</dt>
                <dd className="font-semibold">{formatNum(result.cubicFeet)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                <dt>{copy.cubicMeters}</dt>
                <dd className="font-semibold">{formatNum(result.cubicMeters, 3)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                <dt>{copy.linear}</dt>
                <dd className="font-semibold">
                  {formatNum(unit === "in" ? result.linearFt : result.linearFt / FT_PER_M)} {lUnit}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                <dt>{copy.pieces}</dt>
                <dd className="font-semibold">{result.orderPieces}</dd>
              </div>
              {result.cost != null ? (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                  <dt>{copy.cost}</dt>
                  <dd className="font-semibold">{formatNum(result.cost)}</dd>
                </div>
              ) : null}
            </dl>
            <ul className="grid gap-1 text-sm text-muted-foreground">
              {result.lines.map((line, index) => (
                <li key={`${line.label}-${index}`}>
                  {line.label}: {formatNum(line.bf)} BF · {line.qty}
                </li>
              ))}
            </ul>
            <button type="button" className={`${buttonClass} w-full`} onClick={copyResult}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
