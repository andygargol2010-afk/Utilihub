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
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

type Shape = "rect" | "area";
type Unit = "m" | "ft";
type PaverUnit = "cm" | "in";

type Preset = {
  id: string;
  shape: Shape;
  unit: Unit;
  length: string;
  width: string;
  area: string;
  perimeter: string;
  paverUnit: PaverUnit;
  paverL: string;
  paverW: string;
  gapMm: string;
  waste: string;
  border: boolean;
  baseCm: string;
  baseWaste: string;
};

const PRESETS: Preset[] = [
  {
    id: "patio",
    shape: "rect",
    unit: "m",
    length: "4",
    width: "3",
    area: "12",
    perimeter: "14",
    paverUnit: "cm",
    paverL: "20",
    paverW: "10",
    gapMm: "3",
    waste: "10",
    border: true,
    baseCm: "10",
    baseWaste: "8",
  },
  {
    id: "walk",
    shape: "rect",
    unit: "m",
    length: "8",
    width: "1.2",
    area: "9.6",
    perimeter: "18.4",
    paverUnit: "cm",
    paverL: "20",
    paverW: "10",
    gapMm: "3",
    waste: "8",
    border: false,
    baseCm: "8",
    baseWaste: "5",
  },
  {
    id: "entry",
    shape: "rect",
    unit: "ft",
    length: "10",
    width: "6",
    area: "60",
    perimeter: "32",
    paverUnit: "in",
    paverL: "8",
    paverW: "4",
    gapMm: "4",
    waste: "12",
    border: true,
    baseCm: "10",
    baseWaste: "10",
  },
];

const FT = 0.3048;
const IN = 0.0254;

export function PaverCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [shape, setShape] = useState<Shape>("rect");
  const [unit, setUnit] = useState<Unit>("m");
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("3");
  const [area, setArea] = useState("12");
  const [perimeter, setPerimeter] = useState("14");
  const [paverUnit, setPaverUnit] = useState<PaverUnit>("cm");
  const [paverL, setPaverL] = useState("20");
  const [paverW, setPaverW] = useState("10");
  const [gapMm, setGapMm] = useState("3");
  const [waste, setWaste] = useState("10");
  const [border, setBorder] = useState(true);
  const [baseCm, setBaseCm] = useState("10");
  const [baseWaste, setBaseWaste] = useState("8");
  const [pricePaver, setPricePaver] = useState("");
  const [priceBase, setPriceBase] = useState("");
  const [priceSand, setPriceSand] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Contá adoquines de patio según el área, la medida de la pieza y la junta. Podés sumar un curso de borde, sacos de arena polimérica y la base de piedra partida.",
        presets: "Presets",
        patio: "Patio",
        walk: "Sendero",
        entry: "Entrada (pies)",
        unit: "Unidad del patio",
        shape: "Forma",
        rect: "Rectángulo",
        known: "Área conocida",
        length: "Largo",
        width: "Ancho",
        area: "Área",
        perimeter: "Perímetro (solo borde)",
        paverUnit: "Unidad del adoquín",
        paverL: "Largo de la pieza",
        paverW: "Ancho de la pieza",
        gap: "Junta (mm)",
        waste: "Desperdicio de piezas (%)",
        border: "Curso de borde",
        borderOn: "Incluir borde",
        borderOff: "Sin borde",
        base: "Base de piedra (cm)",
        baseWaste: "Desperdicio de base (%)",
        pricePaver: "Precio por adoquín (opcional)",
        priceBase: "Precio de base por m³ (opcional)",
        priceSand: "Precio por saco de arena (opcional)",
        result: "Pedido",
        areaOut: "Área",
        field: "Piezas de campo",
        borderOut: "Piezas de borde",
        total: "A pedir",
        sand: "Sacos de arena (22,7 kg)",
        baseOut: "Base a pedir",
        cost: "Costo estimado",
        note: "La cobertura de arena es orientativa y baja si la junta es más ancha. La base no incluye compactación ni flete. La calculadora de grava es para árido suelto, no para contar piezas.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
        errArea: "El área tiene que estar entre 0,2 y 2.000 m². Revisá largo, ancho o m².",
        errPaver: "La pieza tiene que medir entre 5 y 80 cm de lado.",
        errGap: "La junta tiene que estar entre 0 y 15 mm.",
        errWaste: "El desperdicio de piezas tiene que estar entre 0 y 30%.",
        errBase: "La base tiene que estar entre 0 y 40 cm.",
        errBaseWaste: "El desperdicio de base tiene que estar entre 0 y 30%.",
        errPerim: "Para el borde con área conocida, el perímetro tiene que ser mayor que 0.",
      }
    : {
        help: "Count patio pavers from area, paver size, and joint gap. You can add a border course, polymeric sand bags, and a crushed-stone base.",
        presets: "Presets",
        patio: "Patio",
        walk: "Walkway",
        entry: "Entry (feet)",
        unit: "Patio unit",
        shape: "Shape",
        rect: "Rectangle",
        known: "Known area",
        length: "Length",
        width: "Width",
        area: "Area",
        perimeter: "Perimeter (border only)",
        paverUnit: "Paver unit",
        paverL: "Paver length",
        paverW: "Paver width",
        gap: "Joint gap (mm)",
        waste: "Paver waste (%)",
        border: "Border course",
        borderOn: "Include border",
        borderOff: "No border",
        base: "Crushed-stone base (cm)",
        baseWaste: "Base waste (%)",
        pricePaver: "Price per paver (optional)",
        priceBase: "Base price per m³ (optional)",
        priceSand: "Sand bag price (optional)",
        result: "Order",
        areaOut: "Area",
        field: "Field pavers",
        borderOut: "Border pavers",
        total: "To order",
        sand: "Sand bags (22.7 kg)",
        baseOut: "Base to order",
        cost: "Estimated cost",
        note: "Sand coverage is a planning factor and drops as the joint gets wider. Base volume does not include compaction or delivery. The gravel calculator is for loose aggregate, not piece counts.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
        errArea: "Area must be between 0.2 and 2,000 m². Check length, width, or area.",
        errPaver: "Each paver side must be between 5 and 80 cm.",
        errGap: "Joint gap must be between 0 and 15 mm.",
        errWaste: "Paver waste must be between 0 and 30%.",
        errBase: "Base depth must be between 0 and 40 cm.",
        errBaseWaste: "Base waste must be between 0 and 30%.",
        errPerim: "For a border on a known area, perimeter must be greater than 0.",
      };

  const result = useMemo(() => {
    const toM = (value: number) => (unit === "ft" ? value * FT : value);
    const toM2 = (value: number) => (unit === "ft" ? value * FT * FT : value);
    let areaM: number | null = null;
    let perimM: number | null = null;
    if (shape === "rect") {
      const l = parseNum(length);
      const w = parseNum(width);
      if (l != null && w != null) {
        areaM = toM(l) * toM(w);
        perimM = 2 * (toM(l) + toM(w));
      }
    } else {
      const a = parseNum(area);
      areaM = a != null ? toM2(a) : null;
      const p = parseNum(perimeter);
      perimM = p != null ? toM(p) : null;
    }
    const pl = parseNum(paverL);
    const pw = parseNum(paverW);
    const gap = parseNum(gapMm);
    const wastePct = parseNum(waste);
    const base = parseNum(baseCm);
    const baseWastePct = parseNum(baseWaste);
    if (areaM == null || areaM < 0.2 || areaM > 2000) return { error: copy.errArea };
    if (pl == null || pw == null) return { error: copy.errPaver };
    const plM = paverUnit === "in" ? pl * IN : pl / 100;
    const pwM = paverUnit === "in" ? pw * IN : pw / 100;
    if (plM < 0.05 || plM > 0.8 || pwM < 0.05 || pwM > 0.8) return { error: copy.errPaver };
    if (gap == null || gap < 0 || gap > 15) return { error: copy.errGap };
    if (wastePct == null || wastePct < 0 || wastePct > 30) return { error: copy.errWaste };
    if (base == null || base < 0 || base > 40) return { error: copy.errBase };
    if (baseWastePct == null || baseWastePct < 0 || baseWastePct > 30) return { error: copy.errBaseWaste };
    if (border && (perimM == null || perimM <= 0)) return { error: copy.errPerim };
    const gapM = gap / 1000;
    const cover = (plM + gapM) * (pwM + gapM);
    const borderCount = border && perimM != null ? Math.ceil(perimM / (plM + gapM)) : 0;
    const borderArea = borderCount * plM * pwM;
    const fieldArea = Math.max(0, areaM - Math.min(areaM, borderArea));
    const fieldCount = Math.ceil(fieldArea / cover);
    const total = Math.ceil((fieldCount + borderCount) * (1 + wastePct / 100));
    const sandCover = 8 * (gap > 0 ? 3 / gap : 4);
    const sandBags = Math.ceil(areaM / Math.max(1.5, Math.min(sandCover, 20)));
    const baseM3 = areaM * (base / 100) * (1 + baseWastePct / 100);
    const paverPrice = parseNum(pricePaver);
    const basePrice = parseNum(priceBase);
    const sandPrice = parseNum(priceSand);
    const cost =
      (paverPrice != null && paverPrice >= 0 ? total * paverPrice : 0) +
      (basePrice != null && basePrice >= 0 ? baseM3 * basePrice : 0) +
      (sandPrice != null && sandPrice >= 0 ? sandBags * sandPrice : 0);
    const hasPrice = [paverPrice, basePrice, sandPrice].some((n) => n != null && n > 0);
    return { areaM, fieldCount, borderCount, total, sandBags, baseM3, cost: hasPrice ? cost : null };
  }, [
    area,
    baseCm,
    baseWaste,
    border,
    copy.errArea,
    copy.errBase,
    copy.errBaseWaste,
    copy.errGap,
    copy.errPaver,
    copy.errPerim,
    copy.errWaste,
    gapMm,
    length,
    paverL,
    paverUnit,
    paverW,
    perimeter,
    priceBase,
    pricePaver,
    priceSand,
    shape,
    unit,
    waste,
    width,
  ]);

  function applyPreset(preset: Preset) {
    setShape(preset.shape);
    setUnit(preset.unit);
    setLength(preset.length);
    setWidth(preset.width);
    setArea(preset.area);
    setPerimeter(preset.perimeter);
    setPaverUnit(preset.paverUnit);
    setPaverL(preset.paverL);
    setPaverW(preset.paverW);
    setGapMm(preset.gapMm);
    setWaste(preset.waste);
    setBorder(preset.border);
    setBaseCm(preset.baseCm);
    setBaseWaste(preset.baseWaste);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
    setPricePaver("");
    setPriceBase("");
    setPriceSand("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Adoquines: ${result.total} piezas (${result.fieldCount} campo + ${result.borderCount} borde, con desperdicio), ${result.sandBags} sacos de arena, ${formatNum(result.baseM3)} m³ de base.`
      : `Pavers: ${result.total} pieces (${result.fieldCount} field + ${result.borderCount} border, with waste), ${result.sandBags} sand bags, ${formatNum(result.baseM3)} m³ base.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) => (id === "patio" ? copy.patio : id === "walk" ? copy.walk : copy.entry);
  const unitSuffix = unit === "ft" ? "ft" : "m";
  const areaSuffix = unit === "ft" ? "ft²" : "m²";
  const paverSuffix = paverUnit === "in" ? "in" : "cm";

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
            {copy.unit}
            <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
              <option value="m">m</option>
              <option value="ft">ft</option>
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
              {copy.length} ({unitSuffix})
              <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.width} ({unitSuffix})
              <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
            </label>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              {copy.area} ({areaSuffix})
              <input className={inputClass} inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.perimeter} ({unitSuffix})
              <input className={inputClass} inputMode="decimal" value={perimeter} onChange={(e) => setPerimeter(e.target.value)} />
            </label>
          </div>
        )}
        <label className="grid gap-1 text-sm">
          {copy.paverUnit}
          <select className={inputClass} value={paverUnit} onChange={(e) => setPaverUnit(e.target.value as PaverUnit)}>
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.paverL} ({paverSuffix})
            <input className={inputClass} inputMode="decimal" value={paverL} onChange={(e) => setPaverL(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.paverW} ({paverSuffix})
            <input className={inputClass} inputMode="decimal" value={paverW} onChange={(e) => setPaverW(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.gap}
            <input className={inputClass} inputMode="decimal" value={gapMm} onChange={(e) => setGapMm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={waste} onChange={(e) => setWaste(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.border}
          <select className={inputClass} value={border ? "on" : "off"} onChange={(e) => setBorder(e.target.value === "on")}>
            <option value="on">{copy.borderOn}</option>
            <option value="off">{copy.borderOff}</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.base}
            <input className={inputClass} inputMode="decimal" value={baseCm} onChange={(e) => setBaseCm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.baseWaste}
            <input className={inputClass} inputMode="decimal" value={baseWaste} onChange={(e) => setBaseWaste(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.pricePaver}
            <input className={inputClass} inputMode="decimal" value={pricePaver} onChange={(e) => setPricePaver(e.target.value)} placeholder="0" />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.priceBase}
            <input className={inputClass} inputMode="decimal" value={priceBase} onChange={(e) => setPriceBase(e.target.value)} placeholder="0" />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.priceSand}
          <input className={inputClass} inputMode="decimal" value={priceSand} onChange={(e) => setPriceSand(e.target.value)} placeholder="0" />
        </label>
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
                <dt className="text-muted-foreground">{copy.areaOut}</dt>
                <dd className="font-medium">{formatNum(result.areaM)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.field}</dt>
                <dd className="font-medium">{result.fieldCount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.borderOut}</dt>
                <dd className="font-medium">{result.borderCount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.total}</dt>
                <dd className="text-base font-semibold">{result.total}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.sand}</dt>
                <dd className="font-medium">{result.sandBags}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.baseOut}</dt>
                <dd className="font-medium">{formatNum(result.baseM3)} m³</dd>
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
