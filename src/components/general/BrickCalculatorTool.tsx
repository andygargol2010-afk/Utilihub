import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Layout = "wall" | "area";
type PresetId = "modular" | "solid" | "hollow" | "uk";

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
  height: string;
  openings: string;
  brickL: string;
  brickH: string;
  brickD: string;
  joint: string;
  waste: string;
  bagYield: string;
};

const PRESETS: Preset[] = [
  { id: "modular", unit: "ft", layout: "wall", length: "20", height: "8", openings: "20", brickL: "7.625", brickH: "2.25", brickD: "3.625", joint: "0.375", waste: "10", bagYield: "0.65" },
  { id: "solid", unit: "m", layout: "wall", length: "5", height: "2.5", openings: "1.5", brickL: "24", brickH: "5.2", brickD: "11.5", joint: "1", waste: "8", bagYield: "0.015" },
  { id: "hollow", unit: "m", layout: "wall", length: "6", height: "2.6", openings: "2", brickL: "24", brickH: "11.5", brickD: "11.5", joint: "1", waste: "8", bagYield: "0.015" },
  { id: "uk", unit: "m", layout: "wall", length: "5", height: "2.4", openings: "1.2", brickL: "21.5", brickH: "6.5", brickD: "10.25", joint: "1", waste: "10", bagYield: "0.015" },
];

export function BrickCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [layout, setLayout] = useState<Layout>("wall");
  const [length, setLength] = useState("5");
  const [height, setHeight] = useState("2.5");
  const [known, setKnown] = useState("12");
  const [openings, setOpenings] = useState("1.5");
  const [brickL, setBrickL] = useState("24");
  const [brickH, setBrickH] = useState("5.2");
  const [brickD, setBrickD] = useState("11.5");
  const [joint, setJoint] = useState("1");
  const [wastePct, setWastePct] = useState("8");
  const [bagYield, setBagYield] = useState("0.015");
  const [brickPrice, setBrickPrice] = useState("");
  const [bagPrice, setBagPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const areaUnit = unit === "m" ? "m²" : "ft²";
  const linearUnit = unit === "m" ? "m" : "ft";
  const brickUnit = unit === "m" ? "cm" : "in";
  const volumeUnit = unit === "m" ? "m³" : "ft³";

  const copy = es
    ? {
        help: "Estimá ladrillos y sacos de mortero para una pared de una hoja, restando huecos y sumando desperdicio.",
        presets: "Presets",
        modular: "Modular EE. UU.",
        solid: "Macizo 24×5",
        hollow: "Hueco 24×11",
        uk: "UK 215×65",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        layout: "Cómo medir",
        wall: "Pared",
        area: "Área conocida",
        length: `Largo de pared (${linearUnit})`,
        height: `Alto de pared (${linearUnit})`,
        known: `Área conocida (${areaUnit})`,
        openings: `Huecos a restar (${areaUnit})`,
        brickL: `Largo del ladrillo (${brickUnit})`,
        brickH: `Alto del ladrillo (${brickUnit})`,
        brickD: `Fondo del ladrillo (${brickUnit})`,
        joint: `Junta (${brickUnit})`,
        waste: "Desperdicio (%)",
        bagYield: `Rendimiento del saco (${volumeUnit})`,
        brickPrice: "Precio por ladrillo (opcional)",
        bagPrice: "Precio por saco (opcional)",
        result: "Resultado",
        gross: "Área bruta",
        net: "Área neta",
        order: "Área a pedir",
        module: "Módulo de cara",
        perArea: unit === "m" ? "Ladrillos por m²" : "Ladrillos por ft²",
        bricks: "Ladrillos a comprar",
        mortar: "Mortero",
        bags: "Sacos de mortero",
        cost: "Material estimado",
        note: "Los ladrillos y los sacos se redondean hacia arriba. El mortero cubre junta horizontal y vertical de una sola hoja.",
        empty: "Completá la pared, el ladrillo, la junta y el rendimiento del saco.",
        invalid: "Usá números mayores que cero. Los decimales pueden llevar coma o punto.",
        openingInvalid: "Los huecos no pueden ser negativos ni mayores que el área bruta.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 20%.",
        jointInvalid: "La junta tiene que ser mayor que cero y menor que la mitad del lado más corto del ladrillo.",
        yieldInvalid: "El rendimiento del saco tiene que ser mayor que cero.",
        tooBig: "El área supera el límite de planificación (2.000 m² o 20.000 ft²).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate bricks and mortar bags for a single-wythe wall, after openings and waste.",
        presets: "Presets",
        modular: "US modular",
        solid: "Solid 24×5",
        hollow: "Hollow 24×11",
        uk: "UK 215×65",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        layout: "How to measure",
        wall: "Wall",
        area: "Known area",
        length: `Wall length (${linearUnit})`,
        height: `Wall height (${linearUnit})`,
        known: `Known area (${areaUnit})`,
        openings: `Openings to deduct (${areaUnit})`,
        brickL: `Brick length (${brickUnit})`,
        brickH: `Brick height (${brickUnit})`,
        brickD: `Brick depth (${brickUnit})`,
        joint: `Joint (${brickUnit})`,
        waste: "Waste (%)",
        bagYield: `Bag yield (${volumeUnit})`,
        brickPrice: "Price per brick (optional)",
        bagPrice: "Price per bag (optional)",
        result: "Result",
        gross: "Gross area",
        net: "Net area",
        order: "Area to order",
        module: "Face module",
        perArea: unit === "m" ? "Bricks per m²" : "Bricks per ft²",
        bricks: "Bricks to buy",
        mortar: "Mortar",
        bags: "Mortar bags",
        cost: "Estimated material",
        note: "Bricks and bags round up. Mortar covers the bed and head joints of one leaf.",
        empty: "Enter the wall, brick size, joint, and bag yield.",
        invalid: "Use numbers greater than zero. Decimals can use a comma or a dot.",
        openingInvalid: "Openings cannot be negative or larger than the gross area.",
        wasteInvalid: "Waste must be between 0% and 20%.",
        jointInvalid: "The joint must be greater than zero and less than half the shorter brick face.",
        yieldInvalid: "Bag yield must be greater than zero.",
        tooBig: "Area is above the planning limit (2,000 m² or 20,000 ft²).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const len = parseNum(length);
    const hei = parseNum(height);
    const customArea = parseNum(known);
    const opening = parseNum(openings);
    const bl = parseNum(brickL);
    const bh = parseNum(brickH);
    const bd = parseNum(brickD);
    const jt = parseNum(joint);
    const waste = parseNum(wastePct);
    const yieldValue = parseNum(bagYield);
    const brickCost = parseNum(brickPrice);
    const bagCost = parseNum(bagPrice);
    if (opening == null || bl == null || bh == null || bd == null || jt == null || waste == null || yieldValue == null) return { error: copy.empty };
    if (layout === "area" && customArea == null) return { error: copy.empty };
    if (layout === "wall" && (len == null || hei == null)) return { error: copy.empty };
    const dims = layout === "area" ? [customArea, bl, bh, bd] : [len, hei, bl, bh, bd];
    if (dims.some((n) => n == null || Number.isNaN(n) || n <= 0) || Number.isNaN(opening) || Number.isNaN(jt) || Number.isNaN(waste) || Number.isNaN(yieldValue)) {
      return { error: copy.invalid };
    }
    const scale = unit === "m" ? 0.01 : 1 / 12;
    const brickLength = bl * scale;
    const brickHeight = bh * scale;
    const brickDepth = bd * scale;
    const jointSize = jt * scale;
    if (jointSize <= 0 || jointSize >= Math.min(brickLength, brickHeight) / 2) return { error: copy.jointInvalid };
    if (yieldValue <= 0 || yieldValue > (unit === "m" ? 0.2 : 5)) return { error: copy.yieldInvalid };
    const gross = layout === "area" ? (customArea as number) : (len as number) * (hei as number);
    const limit = unit === "m" ? 2_000 : 20_000;
    if (gross > limit) return { error: copy.tooBig };
    if (opening < 0 || opening > gross) return { error: copy.openingInvalid };
    if (waste < 0 || waste > 20) return { error: copy.wasteInvalid };
    if (brickPrice.trim() !== "" && (brickCost == null || Number.isNaN(brickCost) || brickCost < 0)) return { error: copy.invalid };
    if (bagPrice.trim() !== "" && (bagCost == null || Number.isNaN(bagCost) || bagCost < 0)) return { error: copy.invalid };
    const net = gross - opening;
    const order = net * (1 + waste / 100);
    const moduleArea = (brickLength + jointSize) * (brickHeight + jointSize);
    const bricks = net === 0 ? 0 : Math.ceil(order / moduleArea - 1e-9);
    const mortarPerBrick = moduleArea * brickDepth - brickLength * brickHeight * brickDepth;
    const mortar = bricks * mortarPerBrick;
    const bags = mortar === 0 ? 0 : Math.ceil(mortar / yieldValue - 1e-9);
    const cost =
      brickPrice.trim() === "" && bagPrice.trim() === ""
        ? null
        : bricks * (brickCost ?? 0) + bags * (bagCost ?? 0);
    return { gross, net, order, moduleArea, perArea: 1 / moduleArea, bricks, mortar, bags, cost };
  }, [layout, length, height, known, openings, brickL, brickH, brickD, joint, wastePct, bagYield, brickPrice, bagPrice, unit, copy.empty, copy.invalid, copy.openingInvalid, copy.wasteInvalid, copy.jointInvalid, copy.yieldInvalid, copy.tooBig]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLayout(preset.layout);
    setLength(preset.length);
    setHeight(preset.height);
    setOpenings(preset.openings);
    setBrickL(preset.brickL);
    setBrickH(preset.brickH);
    setBrickD(preset.brickD);
    setJoint(preset.joint);
    setWastePct(preset.waste);
    setBagYield(preset.bagYield);
    setKnown(preset.unit === "ft" ? "160" : "12");
    setCopied(false);
  }

  function reset() {
    setBrickPrice("");
    setBagPrice("");
    applyPreset(PRESETS[1]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const lines = [
      `${copy.gross}: ${formatNum(result.gross)} ${areaUnit}`,
      `${copy.net}: ${formatNum(result.net)} ${areaUnit}`,
      `${copy.order}: ${formatNum(result.order)} ${areaUnit}`,
      `${copy.bricks}: ${result.bricks}`,
      `${copy.mortar}: ${formatNum(result.mortar, 3)} ${volumeUnit}`,
      `${copy.bags}: ${result.bags}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) => (id === "modular" ? copy.modular : id === "solid" ? copy.solid : id === "hollow" ? copy.hollow : copy.uk);

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
              <option value="wall">{copy.wall}</option>
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
        <label className="grid gap-1 text-sm">
          {copy.openings}
          <input className={inputClass} inputMode="decimal" value={openings} onChange={(e) => setOpenings(e.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">
            {copy.brickL}
            <input className={inputClass} inputMode="decimal" value={brickL} onChange={(e) => setBrickL(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.brickH}
            <input className={inputClass} inputMode="decimal" value={brickH} onChange={(e) => setBrickH(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.brickD}
            <input className={inputClass} inputMode="decimal" value={brickD} onChange={(e) => setBrickD(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">
            {copy.joint}
            <input className={inputClass} inputMode="decimal" value={joint} onChange={(e) => setJoint(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.bagYield}
            <input className={inputClass} inputMode="decimal" value={bagYield} onChange={(e) => setBagYield(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.brickPrice}
            <input className={inputClass} inputMode="decimal" value={brickPrice} onChange={(e) => setBrickPrice(e.target.value)} placeholder="0" />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.bagPrice}
            <input className={inputClass} inputMode="decimal" value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} placeholder="0" />
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
            {[
              [copy.gross, `${formatNum(result.gross)} ${areaUnit}`],
              [copy.net, `${formatNum(result.net)} ${areaUnit}`],
              [copy.order, `${formatNum(result.order)} ${areaUnit}`],
              [copy.module, `${formatNum(result.moduleArea, 4)} ${areaUnit}`],
              [copy.perArea, formatNum(result.perArea, 1)],
              [copy.bricks, String(result.bricks)],
              [copy.mortar, `${formatNum(result.mortar, 3)} ${volumeUnit}`],
              [copy.bags, String(result.bags)],
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
