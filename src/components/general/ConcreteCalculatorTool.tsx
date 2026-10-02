import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Shape = "slab" | "column";
type MixId = "lean" | "standard" | "rich";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const chipClass = "h-11 rounded-xl border px-3 text-sm";

const MIXES: Record<MixId, { cement: number; sand: number; gravel: number }> = {
  lean: { cement: 1, sand: 3, gravel: 5 },
  standard: { cement: 1, sand: 2, gravel: 3 },
  rich: { cement: 1, sand: 1.5, gravel: 3 },
};

const DRY_FACTOR = 1.54;
const CEMENT_DENSITY = 1440;

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export function ConcreteCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [shape, setShape] = useState<Shape>("slab");
  const [lengthM, setLengthM] = useState("4");
  const [widthM, setWidthM] = useState("3");
  const [thicknessCm, setThicknessCm] = useState("10");
  const [diameterCm, setDiameterCm] = useState("30");
  const [heightM, setHeightM] = useState("0.8");
  const [count, setCount] = useState("4");
  const [wastePct, setWastePct] = useState("10");
  const [mix, setMix] = useState<MixId>("standard");
  const [bagKg, setBagKg] = useState("50");
  const [bagPrice, setBagPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá el hormigón de una losa o de columnas redondas y los sacos de cemento, arena y grava para pedirlo.",
        slab: "Losa",
        column: "Columnas",
        presets: "Presets",
        patio: "Patio 10 cm",
        sidewalk: "Vereda 8 cm",
        thick: "Losa 12 cm",
        posts: "4 postes Ø 30 cm",
        length: "Largo (m)",
        width: "Ancho (m)",
        thickness: "Espesor (cm)",
        diameter: "Diámetro (cm)",
        height: "Altura (m)",
        count: "Cantidad",
        waste: "Desperdicio (%)",
        mix: "Dosificación",
        lean: "Pobre 1:3:5",
        standard: "Estándar 1:2:3",
        rich: "Rica 1:1,5:3",
        bag: "Saco de cemento (kg)",
        price: "Precio por saco (opcional)",
        result: "Resultado",
        wet: "Volumen húmedo",
        order: "Volumen a pedir",
        bags: "Sacos a comprar",
        cement: "Cemento",
        sand: "Arena",
        gravel: "Grava",
        water: "Agua orientativa",
        cost: "Costo de sacos",
        note: "Estimación de materiales. El volumen seco usa el factor 1,54. No es un cálculo estructural.",
        copy: "Copiar resultado",
        copied: "Copiado",
        reset: "Reiniciar",
        errDim: "Revisá las medidas: tienen que ser números mayores que cero.",
        errThick: "El espesor debe estar entre 1 y 80 cm.",
        errWaste: "El desperdicio debe estar entre 0 y 40%.",
        errBag: "El saco debe pesar entre 10 y 50 kg.",
        errCount: "La cantidad de columnas debe estar entre 1 y 200.",
        errBig: "El volumen supera 200 m³. Dividí el trabajo en tramos.",
      }
    : {
        help: "Estimate concrete for a slab or round columns, plus cement bags, sand, and gravel to order.",
        slab: "Slab",
        column: "Columns",
        presets: "Presets",
        patio: "Patio 10 cm",
        sidewalk: "Sidewalk 8 cm",
        thick: "Slab 12 cm",
        posts: "4 posts Ø 30 cm",
        length: "Length (m)",
        width: "Width (m)",
        thickness: "Thickness (cm)",
        diameter: "Diameter (cm)",
        height: "Height (m)",
        count: "Count",
        waste: "Waste (%)",
        mix: "Mix",
        lean: "Lean 1:3:5",
        standard: "Standard 1:2:3",
        rich: "Rich 1:1.5:3",
        bag: "Cement bag (kg)",
        price: "Price per bag (optional)",
        result: "Result",
        wet: "Wet volume",
        order: "Volume to order",
        bags: "Bags to buy",
        cement: "Cement",
        sand: "Sand",
        gravel: "Gravel",
        water: "Indicative water",
        cost: "Bag cost",
        note: "Materials estimate. Dry volume uses the 1.54 factor. Not a structural calculation.",
        copy: "Copy result",
        copied: "Copied",
        reset: "Reset",
        errDim: "Check the dimensions: they must be numbers greater than zero.",
        errThick: "Thickness must be between 1 and 80 cm.",
        errWaste: "Waste must be between 0 and 40%.",
        errBag: "Bag weight must be between 10 and 50 kg.",
        errCount: "Column count must be between 1 and 200.",
        errBig: "Volume is over 200 m³. Split the pour into sections.",
      };

  const result = useMemo(() => {
    const waste = parseNum(wastePct);
    const bag = parseNum(bagKg);
    const price = parseNum(bagPrice);
    if (waste === null || Number.isNaN(waste) || waste < 0 || waste > 40) return { error: copy.errWaste };
    if (bag === null || Number.isNaN(bag) || bag < 10 || bag > 50) return { error: copy.errBag };
    if (price !== null && (Number.isNaN(price) || price < 0)) return { error: copy.errDim };

    let wet = 0;
    if (shape === "slab") {
      const length = parseNum(lengthM);
      const width = parseNum(widthM);
      const thickness = parseNum(thicknessCm);
      if (length === null || width === null || thickness === null || [length, width, thickness].some(Number.isNaN)) {
        return { error: copy.errDim };
      }
      if (length <= 0 || width <= 0 || length > 200 || width > 200) return { error: copy.errDim };
      if (thickness < 1 || thickness > 80) return { error: copy.errThick };
      wet = length * width * (thickness / 100);
    } else {
      const diameter = parseNum(diameterCm);
      const height = parseNum(heightM);
      const pieces = parseNum(count);
      if (diameter === null || height === null || pieces === null || [diameter, height, pieces].some(Number.isNaN)) {
        return { error: copy.errDim };
      }
      if (diameter <= 0 || diameter > 300 || height <= 0 || height > 30) return { error: copy.errDim };
      if (pieces < 1 || pieces > 200) return { error: copy.errCount };
      const radius = diameter / 100 / 2;
      wet = pieces * Math.PI * radius * radius * height;
    }
    if (wet > 200) return { error: copy.errBig };

    const order = wet * (1 + waste / 100);
    const dry = order * DRY_FACTOR;
    const parts = MIXES[mix];
    const totalParts = parts.cement + parts.sand + parts.gravel;
    const cementM3 = dry * (parts.cement / totalParts);
    const sandM3 = dry * (parts.sand / totalParts);
    const gravelM3 = dry * (parts.gravel / totalParts);
    const cementKg = cementM3 * CEMENT_DENSITY;
    const bags = Math.ceil(cementKg / bag);
    const waterL = cementKg * 0.5;
    const cost = price === null ? null : bags * price;
    return { wet, order, bags, cementKg, sandM3, gravelM3, waterL, cost };
  }, [shape, lengthM, widthM, thicknessCm, diameterCm, heightM, count, wastePct, mix, bagKg, bagPrice, copy]);

  function applyPreset(id: "patio" | "sidewalk" | "thick" | "posts") {
    if (id === "posts") {
      setShape("column");
      setDiameterCm("30");
      setHeightM("0.8");
      setCount("4");
      setWastePct("10");
      return;
    }
    setShape("slab");
    setLengthM("4");
    setWidthM("3");
    setThicknessCm(id === "sidewalk" ? "8" : id === "thick" ? "12" : "10");
    setWastePct("10");
  }

  function reset() {
    setShape("slab");
    setLengthM("4");
    setWidthM("3");
    setThicknessCm("10");
    setDiameterCm("30");
    setHeightM("0.8");
    setCount("4");
    setWastePct("10");
    setMix("standard");
    setBagKg("50");
    setBagPrice("");
    setCopied(false);
  }

  async function copyResult() {
    if ("error" in result) return;
    const lines = [
      `${copy.wet}: ${formatNum(result.wet, 3)} m3`,
      `${copy.order}: ${formatNum(result.order, 3)} m3`,
      `${copy.bags}: ${result.bags} x ${bagKg} kg`,
      `${copy.cement}: ${formatNum(result.cementKg, 0)} kg`,
      `${copy.sand}: ${formatNum(result.sandM3, 3)} m3`,
      `${copy.gravel}: ${formatNum(result.gravelM3, 3)} m3`,
    ];
    if (result.cost !== null) lines.push(`${copy.cost}: ${formatNum(result.cost, 2)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">{copy.help}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={`${chipClass} ${shape === "slab" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setShape("slab")}>
              {copy.slab}
            </button>
            <button type="button" className={`${chipClass} ${shape === "column" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setShape("column")}>
              {copy.column}
            </button>
          </div>
          <div className="grid gap-2">
            <span className="text-sm text-muted-foreground">{copy.presets}</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={chipClass} onClick={() => applyPreset("patio")}>{copy.patio}</button>
              <button type="button" className={chipClass} onClick={() => applyPreset("sidewalk")}>{copy.sidewalk}</button>
              <button type="button" className={chipClass} onClick={() => applyPreset("thick")}>{copy.thick}</button>
              <button type="button" className={chipClass} onClick={() => applyPreset("posts")}>{copy.posts}</button>
            </div>
          </div>
          {shape === "slab" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  {copy.length}
                  <input className={inputClass} inputMode="decimal" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
                </label>
                <label className="grid gap-1 text-sm">
                  {copy.width}
                  <input className={inputClass} inputMode="decimal" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
                </label>
              </div>
              <label className="grid gap-1 text-sm">
                {copy.thickness}
                <input className={inputClass} inputMode="decimal" value={thicknessCm} onChange={(e) => setThicknessCm(e.target.value)} />
              </label>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm">
                {copy.diameter}
                <input className={inputClass} inputMode="decimal" value={diameterCm} onChange={(e) => setDiameterCm(e.target.value)} />
              </label>
              <label className="grid gap-1 text-sm">
                {copy.height}
                <input className={inputClass} inputMode="decimal" value={heightM} onChange={(e) => setHeightM(e.target.value)} />
              </label>
              <label className="col-span-2 grid gap-1 text-sm">
                {copy.count}
                <input className={inputClass} inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value)} />
              </label>
            </div>
          )}
          <label className="grid gap-1 text-sm">
            {copy.mix}
            <select className={inputClass} value={mix} onChange={(e) => setMix(e.target.value as MixId)}>
              <option value="lean">{copy.lean}</option>
              <option value="standard">{copy.standard}</option>
              <option value="rich">{copy.rich}</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              {copy.waste}
              <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.bag}
              <select className={inputClass} value={bagKg} onChange={(e) => setBagKg(e.target.value)}>
                <option value="25">25 kg</option>
                <option value="40">40 kg</option>
                <option value="42.5">42.5 kg</option>
                <option value="50">50 kg</option>
              </select>
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            {copy.price}
            <input className={inputClass} inputMode="decimal" placeholder="0" value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} />
          </label>
          <button type="button" className="h-11 w-full rounded-xl border text-sm" onClick={reset}>
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
                  <dt>{copy.wet}</dt>
                  <dd className="font-medium">{formatNum(result.wet, 3)} m³</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{copy.order}</dt>
                  <dd className="font-medium">{formatNum(result.order, 3)} m³</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{copy.bags}</dt>
                  <dd className="font-medium">{result.bags} × {bagKg} kg</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{copy.cement}</dt>
                  <dd className="font-medium">{formatNum(result.cementKg, 0)} kg</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{copy.sand}</dt>
                  <dd className="font-medium">{formatNum(result.sandM3, 3)} m³</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{copy.gravel}</dt>
                  <dd className="font-medium">{formatNum(result.gravelM3, 3)} m³</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{copy.water}</dt>
                  <dd className="font-medium">{formatNum(result.waterL, 0)} L</dd>
                </div>
                {result.cost !== null ? (
                  <div className="flex justify-between gap-3">
                    <dt>{copy.cost}</dt>
                    <dd className="font-medium">{formatNum(result.cost, 2)}</dd>
                  </div>
                ) : null}
              </dl>
              <p className="pt-3 text-sm text-muted-foreground">{copy.note}</p>
              <button type="button" className="mt-3 h-11 w-full rounded-xl bg-primary text-sm text-primary-foreground" onClick={copyResult}>
                {copied ? copy.copied : copy.copy}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
