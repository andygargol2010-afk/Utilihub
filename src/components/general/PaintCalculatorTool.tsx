import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

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
  id: string;
  length: string;
  height: string;
  openings: string;
  coats: string;
  coverage: string;
  waste: string;
  can: string;
};

const PRESETS: Preset[] = [
  { id: "latex", length: "12", height: "2.5", openings: "2.4", coats: "2", coverage: "10", waste: "10", can: "4" },
  { id: "ceiling", length: "4.5", height: "3.2", openings: "0", coats: "2", coverage: "8", waste: "10", can: "4" },
  { id: "primer", length: "12", height: "2.5", openings: "2.4", coats: "1", coverage: "12", waste: "8", can: "4" },
  { id: "exterior", length: "18", height: "2.8", openings: "3.5", coats: "2", coverage: "6", waste: "15", can: "10" },
];

export function PaintCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("12");
  const [heightM, setHeightM] = useState("2.5");
  const [openings, setOpenings] = useState("2.4");
  const [coats, setCoats] = useState("2");
  const [coverage, setCoverage] = useState("10");
  const [wastePct, setWastePct] = useState("10");
  const [canL, setCanL] = useState("4");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá litros y latas de pintura a partir del largo de pared, la altura, los huecos, las manos y el rendimiento del envase. El precio es opcional.",
        length: "Largo total de pared (m)",
        height: "Altura de pared (m)",
        openings: "Huecos a restar (m²)",
        coats: "Manos",
        coverage: "Rendimiento (m²/L)",
        waste: "Desperdicio (%)",
        can: "Tamaño de lata (L)",
        price: "Precio por litro (opcional)",
        result: "Resultado",
        gross: "Superficie bruta",
        net: "Superficie neta",
        paintable: "Superficie a pintar",
        liters: "Litros necesarios",
        cans: "Latas a comprar",
        leftover: "Sobrante en las latas",
        cost: "Costo de material",
        note: "Las latas se redondean hacia arriba. El rendimiento es el de la etiqueta, por mano.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
        presets: "Presets",
        latex: "Látex interior",
        ceiling: "Techo",
        primer: "Imprimación",
        exterior: "Exterior",
        empty: "Completá largo, altura, manos, rendimiento y tamaño de lata.",
        invalid: "Usá números válidos. Largo, altura, manos, rendimiento y lata tienen que ser mayores a 0.",
        wasteInvalid: "El desperdicio no puede ser negativo ni llegar al 100% o más.",
        openingsInvalid: "Los huecos no pueden ser negativos.",
        noWall: "Los huecos superan o igualan la superficie de pared. Bajá los huecos o subí las medidas.",
        priceInvalid: "El precio por litro tiene que ser un número mayor o igual a 0, o dejalo vacío.",
      }
    : {
        help: "Estimate liters and paint cans from wall length, height, openings, coats, and the coverage on the can. Price is optional.",
        length: "Total wall length (m)",
        height: "Wall height (m)",
        openings: "Openings to subtract (m²)",
        coats: "Coats",
        coverage: "Coverage (m²/L)",
        waste: "Waste (%)",
        can: "Can size (L)",
        price: "Price per liter (optional)",
        result: "Result",
        gross: "Gross area",
        net: "Net area",
        paintable: "Paintable area",
        liters: "Liters needed",
        cans: "Cans to buy",
        leftover: "Leftover in the cans",
        cost: "Material cost",
        note: "Cans are rounded up. Coverage is the label figure, per coat.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
        presets: "Presets",
        latex: "Interior latex",
        ceiling: "Ceiling",
        primer: "Primer",
        exterior: "Exterior",
        empty: "Enter length, height, coats, coverage, and can size.",
        invalid: "Use valid numbers. Length, height, coats, coverage, and can size must be greater than 0.",
        wasteInvalid: "Waste cannot be negative or 100% or more.",
        openingsInvalid: "Openings cannot be negative.",
        noWall: "Openings are equal to or larger than the wall area. Reduce openings or increase the measurements.",
        priceInvalid: "Price per liter must be a number of 0 or more, or leave it blank.",
      };

  const result = useMemo(() => {
    const length = parseNum(lengthM);
    const height = parseNum(heightM);
    const openingArea = parseNum(openings);
    const coatCount = parseNum(coats);
    const cover = parseNum(coverage);
    const waste = parseNum(wastePct);
    const can = parseNum(canL);
    const unitPrice = price.trim() === "" ? null : parseNum(price);
    if (length == null || height == null || openingArea == null || coatCount == null || cover == null || waste == null || can == null) {
      return { error: copy.empty };
    }
    if ([length, height, coatCount, cover, can].some((n) => Number.isNaN(n) || n <= 0) || Number.isNaN(openingArea) || Number.isNaN(waste)) {
      return { error: copy.invalid };
    }
    if (openingArea < 0) return { error: copy.openingsInvalid };
    if (waste < 0 || waste >= 100) return { error: copy.wasteInvalid };
    if (unitPrice != null && (Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.priceInvalid };
    const gross = length * height;
    const net = gross - openingArea;
    if (net <= 0) return { error: copy.noWall };
    const paintable = net * coatCount * (1 + waste / 100);
    const liters = paintable / cover;
    const cans = Math.ceil(liters / can - 1e-9);
    const leftover = cans * can - liters;
    const cost = unitPrice == null ? null : cans * can * unitPrice;
    return { gross, net, paintable, liters, cans, leftover, cost, can };
  }, [lengthM, heightM, openings, coats, coverage, wastePct, canL, price, copy.empty, copy.invalid, copy.wasteInvalid, copy.openingsInvalid, copy.noWall, copy.priceInvalid]);

  function applyPreset(preset: Preset) {
    setLengthM(preset.length);
    setHeightM(preset.height);
    setOpenings(preset.openings);
    setCoats(preset.coats);
    setCoverage(preset.coverage);
    setWastePct(preset.waste);
    setCanL(preset.can);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
    setPrice("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const costText =
      result.cost == null
        ? ""
        : es
          ? `, costo ${formatNum(result.cost)}`
          : `, cost ${formatNum(result.cost)}`;
    const text = es
      ? `Pintura: ${formatNum(result.liters)} L, ${result.cans} latas de ${formatNum(result.can)} L, ${formatNum(result.net)} m² netos, sobrante ${formatNum(result.leftover)} L${costText}.`
      : `Paint: ${formatNum(result.liters)} L, ${result.cans} cans of ${formatNum(result.can)} L, ${formatNum(result.net)} m² net, leftover ${formatNum(result.leftover)} L${costText}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "latex" ? copy.latex : id === "ceiling" ? copy.ceiling : id === "primer" ? copy.primer : copy.exterior;

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
            {copy.length}
            <input className={inputClass} inputMode="decimal" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.height}
            <input className={inputClass} inputMode="decimal" value={heightM} onChange={(e) => setHeightM(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.openings}
            <input className={inputClass} inputMode="decimal" value={openings} onChange={(e) => setOpenings(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.coats}
            <input className={inputClass} inputMode="decimal" value={coats} onChange={(e) => setCoats(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.coverage}
            <input className={inputClass} inputMode="decimal" value={coverage} onChange={(e) => setCoverage(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.can}
            <input className={inputClass} inputMode="decimal" value={canL} onChange={(e) => setCanL(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.price}
            <input className={inputClass} inputMode="decimal" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
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
                <dt className="text-muted-foreground">{copy.gross}</dt>
                <dd className="font-medium">{formatNum(result.gross)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.net}</dt>
                <dd className="font-medium">{formatNum(result.net)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.paintable}</dt>
                <dd className="font-medium">{formatNum(result.paintable)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.liters}</dt>
                <dd className="font-medium">{formatNum(result.liters)} L</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.cans}</dt>
                <dd className="text-base font-semibold">{result.cans}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.leftover}</dt>
                <dd className="font-medium">{formatNum(Math.max(0, result.leftover))} L</dd>
              </div>
              {result.cost != null ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.cost}</dt>
                  <dd className="font-medium">{formatNum(result.cost)}</dd>
                </div>
              ) : null}
              <p className="pt-2 text-muted-foreground">{copy.note}</p>
            </dl>
            <button type="button" className={`${buttonClass} mt-4 w-full`} onClick={copyResult}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
