import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type LayoutId = "straight" | "wide" | "vinyl" | "herringbone";

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
  id: LayoutId;
  lengthMm: string;
  widthMm: string;
  packM2: string;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "straight", lengthMm: "1380", widthMm: "193", packM2: "2.22", waste: "8" },
  { id: "wide", lengthMm: "1524", widthMm: "228", packM2: "2.16", waste: "8" },
  { id: "vinyl", lengthMm: "1220", widthMm: "180", packM2: "2.2", waste: "8" },
  { id: "herringbone", lengthMm: "600", widthMm: "100", packM2: "1.44", waste: "15" },
];

export function FlooringCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("5");
  const [widthM, setWidthM] = useState("4");
  const [openings, setOpenings] = useState("0");
  const [lengthMm, setLengthMm] = useState(PRESETS[0].lengthMm);
  const [widthMm, setWidthMm] = useState(PRESETS[0].widthMm);
  const [packM2, setPackM2] = useState(PRESETS[0].packM2);
  const [wastePct, setWastePct] = useState(PRESETS[0].waste);
  const [underlayM2, setUnderlayM2] = useState("15");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá cajas de laminado o vinílico clic a partir del ambiente, el tamaño de la lama y la cobertura del paquete. El desperdicio cambia según el patrón.",
        presets: "Presets",
        straight: "Laminado recto",
        wide: "Lama ancha",
        vinyl: "Vinílico clic",
        herringbone: "Espiga",
        length: "Largo del ambiente (m)",
        width: "Ancho del ambiente (m)",
        openings: "Huecos a restar (m²)",
        plankL: "Largo de la lama (mm)",
        plankW: "Ancho de la lama (mm)",
        pack: "Cobertura por caja (m²)",
        waste: "Desperdicio (%)",
        underlay: "Cobertura del rollo de base (m²)",
        price: "Precio por caja (opcional)",
        result: "Resultado",
        net: "Superficie neta",
        order: "Superficie a pedir",
        boxes: "Cajas a comprar",
        planks: "Lamas estimadas",
        each: "Cobertura por lama",
        underlayRolls: "Rollos de base",
        cost: "Material estimado",
        note: "Las cajas se redondean hacia arriba. La base usa el área neta más un 5% de solape, no el desperdicio de las lamas.",
        empty: "Completá largo, ancho, tamaño de lama y cobertura de la caja.",
        invalid: "Usá números mayores que cero. Los decimales pueden llevar coma o punto.",
        openingsInvalid: "Los huecos no pueden ser negativos ni mayores que el área del ambiente.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 40%.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate laminate or click-vinyl boxes from the room, plank size, and pack coverage. Waste changes with the layout.",
        presets: "Presets",
        straight: "Straight laminate",
        wide: "Wide plank",
        vinyl: "Click vinyl",
        herringbone: "Herringbone",
        length: "Room length (m)",
        width: "Room width (m)",
        openings: "Openings to subtract (m²)",
        plankL: "Plank length (mm)",
        plankW: "Plank width (mm)",
        pack: "Pack coverage (m²)",
        waste: "Waste (%)",
        underlay: "Underlay roll coverage (m²)",
        price: "Price per box (optional)",
        result: "Result",
        net: "Net area",
        order: "Area to order",
        boxes: "Boxes to buy",
        planks: "Estimated planks",
        each: "Coverage per plank",
        underlayRolls: "Underlay rolls",
        cost: "Estimated material",
        note: "Boxes round up. Underlay uses net area plus a 5% overlap, not the plank waste allowance.",
        empty: "Enter length, width, plank size, and pack coverage.",
        invalid: "Use numbers greater than zero. Decimals can use a comma or a dot.",
        openingsInvalid: "Openings cannot be negative or larger than the room area.",
        wasteInvalid: "Waste must be between 0% and 40%.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const length = parseNum(lengthM);
    const width = parseNum(widthM);
    const holes = parseNum(openings);
    const plankL = parseNum(lengthMm);
    const plankW = parseNum(widthMm);
    const pack = parseNum(packM2);
    const waste = parseNum(wastePct);
    const roll = parseNum(underlayM2);
    const unitPrice = parseNum(price);
    if (length == null || width == null || holes == null || plankL == null || plankW == null || pack == null || waste == null || roll == null) {
      return { error: copy.empty };
    }
    if ([length, width, plankL, plankW, pack, roll].some((n) => Number.isNaN(n) || n <= 0) || Number.isNaN(holes) || Number.isNaN(waste)) {
      return { error: copy.invalid };
    }
    const gross = length * width;
    if (holes < 0 || holes >= gross) return { error: copy.openingsInvalid };
    if (waste < 0 || waste > 40) return { error: copy.wasteInvalid };
    if (unitPrice != null && (Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.invalid };
    const net = gross - holes;
    const order = net * (1 + waste / 100);
    const plankArea = (plankL / 1000) * (plankW / 1000);
    const boxes = Math.ceil(order / pack - 1e-9);
    const planks = Math.ceil(order / plankArea - 1e-9);
    const underlayRolls = Math.ceil((net * 1.05) / roll - 1e-9);
    const cost = unitPrice == null ? null : boxes * unitPrice;
    return { net, order, boxes, planks, plankArea, underlayRolls, cost };
  }, [lengthM, widthM, openings, lengthMm, widthMm, packM2, wastePct, underlayM2, price, copy.empty, copy.invalid, copy.openingsInvalid, copy.wasteInvalid]);

  function applyPreset(preset: Preset) {
    setLengthMm(preset.lengthMm);
    setWidthMm(preset.widthMm);
    setPackM2(preset.packM2);
    setWastePct(preset.waste);
    setCopied(false);
  }

  function reset() {
    setLengthM("5");
    setWidthM("4");
    setOpenings("0");
    setUnderlayM2("15");
    setPrice("");
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const lines = [
      `${copy.net}: ${formatNum(result.net)} m²`,
      `${copy.order}: ${formatNum(result.order)} m²`,
      `${copy.boxes}: ${result.boxes}`,
      `${copy.planks}: ${result.planks}`,
      `${copy.underlayRolls}: ${result.underlayRolls}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: LayoutId) =>
    id === "straight" ? copy.straight : id === "wide" ? copy.wide : id === "vinyl" ? copy.vinyl : copy.herringbone;

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
            {copy.width}
            <input className={inputClass} inputMode="decimal" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
          </label>
        </div>
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
            {copy.plankL}
            <input className={inputClass} inputMode="decimal" value={lengthMm} onChange={(e) => setLengthMm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.plankW}
            <input className={inputClass} inputMode="decimal" value={widthMm} onChange={(e) => setWidthMm(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.pack}
            <input className={inputClass} inputMode="decimal" value={packM2} onChange={(e) => setPackM2(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.underlay}
            <input className={inputClass} inputMode="decimal" value={underlayM2} onChange={(e) => setUnderlayM2(e.target.value)} />
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
              <dd className="font-medium">{formatNum(result.net)} m²</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.order}</dt>
              <dd className="font-medium">{formatNum(result.order)} m²</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.boxes}</dt>
              <dd className="text-base font-semibold">{result.boxes}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.planks}</dt>
              <dd className="font-medium">{result.planks}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.each}</dt>
              <dd className="font-medium">{formatNum(result.plankArea, 3)} m²</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.underlayRolls}</dt>
              <dd className="font-medium">{result.underlayRolls}</dd>
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
