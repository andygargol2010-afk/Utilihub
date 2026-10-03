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

type Shape = "rect" | "circle" | "area";
type BagUnit = "kg" | "L";

type Preset = {
  id: string;
  shape: Shape;
  length: string;
  width: string;
  diameter: string;
  area: string;
  depth: string;
  density: string;
  waste: string;
  bag: string;
  bagUnit: BagUnit;
};

const PRESETS: Preset[] = [
  { id: "path", shape: "rect", length: "8", width: "1.2", diameter: "3", area: "10", depth: "5", density: "1.5", waste: "10", bag: "20", bagUnit: "kg" },
  { id: "drive", shape: "rect", length: "6", width: "3", diameter: "4", area: "18", depth: "10", density: "1.6", waste: "8", bag: "25", bagUnit: "kg" },
  { id: "mulch", shape: "rect", length: "4", width: "1.5", diameter: "2.4", area: "6", depth: "7", density: "0.4", waste: "5", bag: "50", bagUnit: "L" },
  { id: "soil", shape: "area", length: "5", width: "2", diameter: "3", area: "12", depth: "10", density: "1.25", waste: "10", bag: "20", bagUnit: "kg" },
];

const YD3_PER_M3 = 1.3079506193;

export function GravelCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [shape, setShape] = useState<Shape>("rect");
  const [lengthM, setLengthM] = useState("8");
  const [widthM, setWidthM] = useState("1.2");
  const [diameterM, setDiameterM] = useState("3");
  const [areaM2, setAreaM2] = useState("10");
  const [depthCm, setDepthCm] = useState("5");
  const [density, setDensity] = useState("1.5");
  const [wastePct, setWastePct] = useState("10");
  const [bagSize, setBagSize] = useState("20");
  const [bagUnit, setBagUnit] = useState<BagUnit>("kg");
  const [pricePerM3, setPricePerM3] = useState("");
  const [pricePerBag, setPricePerBag] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá metros cúbicos, toneladas y sacos de grava, mantillo o tierra vegetal a partir del área y el espesor. Los precios son opcionales.",
        presets: "Presets",
        path: "Sendero",
        drive: "Entrada",
        mulch: "Mantillo",
        soil: "Tierra",
        shape: "Forma",
        rect: "Rectángulo",
        circle: "Círculo",
        known: "Área conocida",
        length: "Largo (m)",
        width: "Ancho (m)",
        diameter: "Diámetro (m)",
        area: "Área (m²)",
        depth: "Espesor (cm)",
        density: "Densidad suelta (t/m³)",
        waste: "Desperdicio (%)",
        bag: "Tamaño del saco",
        bagUnit: "Unidad del saco",
        priceM3: "Precio por m³ (opcional)",
        priceBag: "Precio por saco (opcional)",
        result: "Pedido",
        areaOut: "Área",
        volume: "Volumen neto",
        order: "A pedir (con desperdicio)",
        yards: "Yardas cúbicas",
        tonnes: "Toneladas",
        bags: "Sacos",
        bulkCost: "Costo a granel",
        bagCost: "Costo en sacos",
        note: "Densidad suelta de planificación. No incluye flete ni compactación en obra. La calculadora de hormigón es para dosificación de losa, no para áridos sueltos.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
        errArea: "El área tiene que ser mayor que 0. Revisá largo, ancho, diámetro o m².",
        errDepth: "El espesor tiene que estar entre 0,5 y 80 cm.",
        errDensity: "La densidad tiene que estar entre 0,1 y 3 t/m³.",
        errWaste: "El desperdicio tiene que estar entre 0 y 40%.",
        errBag: "El saco tiene que ser mayor que 0.",
      }
    : {
        help: "Estimate cubic metres, tonnes, and bags of gravel, mulch, or topsoil from area and depth. Prices are optional.",
        presets: "Presets",
        path: "Path",
        drive: "Driveway",
        mulch: "Mulch",
        soil: "Topsoil",
        shape: "Shape",
        rect: "Rectangle",
        circle: "Circle",
        known: "Known area",
        length: "Length (m)",
        width: "Width (m)",
        diameter: "Diameter (m)",
        area: "Area (m²)",
        depth: "Depth (cm)",
        density: "Loose density (t/m³)",
        waste: "Waste (%)",
        bag: "Bag size",
        bagUnit: "Bag unit",
        priceM3: "Price per m³ (optional)",
        priceBag: "Price per bag (optional)",
        result: "Order",
        areaOut: "Area",
        volume: "Net volume",
        order: "To order (with waste)",
        yards: "Cubic yards",
        tonnes: "Tonnes",
        bags: "Bags",
        bulkCost: "Bulk cost",
        bagCost: "Bag cost",
        note: "Planning density for loose material. Delivery and in-place compaction are not included. The concrete calculator is for a slab mix, not loose aggregate.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
        errArea: "Area must be greater than 0. Check length, width, diameter, or m².",
        errDepth: "Depth must be between 0.5 and 80 cm.",
        errDensity: "Density must be between 0.1 and 3 t/m³.",
        errWaste: "Waste must be between 0 and 40%.",
        errBag: "Bag size must be greater than 0.",
      };

  const result = useMemo(() => {
    const depth = parseNum(depthCm);
    const dens = parseNum(density);
    const waste = parseNum(wastePct);
    const bag = parseNum(bagSize);
    let area: number | null = null;
    if (shape === "rect") {
      const length = parseNum(lengthM);
      const width = parseNum(widthM);
      area = length != null && width != null ? length * width : null;
    } else if (shape === "circle") {
      const diameter = parseNum(diameterM);
      area = diameter != null ? Math.PI * (diameter / 2) ** 2 : null;
    } else {
      area = parseNum(areaM2);
    }
    if (area == null || area <= 0) return { error: copy.errArea };
    if (depth == null || depth < 0.5 || depth > 80) return { error: copy.errDepth };
    if (dens == null || dens < 0.1 || dens > 3) return { error: copy.errDensity };
    if (waste == null || waste < 0 || waste > 40) return { error: copy.errWaste };
    if (bag == null || bag <= 0) return { error: copy.errBag };
    const volume = area * (depth / 100);
    const order = volume * (1 + waste / 100);
    const tonnes = order * dens;
    const bags = bagUnit === "kg" ? Math.ceil((tonnes * 1000) / bag) : Math.ceil((order * 1000) / bag);
    const bulkPrice = parseNum(pricePerM3);
    const bagPrice = parseNum(pricePerBag);
    return {
      area,
      volume,
      order,
      yards: order * YD3_PER_M3,
      tonnes,
      bags,
      bulkCost: bulkPrice != null && bulkPrice >= 0 ? order * bulkPrice : null,
      bagCost: bagPrice != null && bagPrice >= 0 ? bags * bagPrice : null,
    };
  }, [areaM2, bagSize, bagUnit, copy.errArea, copy.errBag, copy.errDensity, copy.errDepth, copy.errWaste, density, depthCm, diameterM, lengthM, pricePerBag, pricePerM3, shape, wastePct, widthM]);

  function applyPreset(preset: Preset) {
    setShape(preset.shape);
    setLengthM(preset.length);
    setWidthM(preset.width);
    setDiameterM(preset.diameter);
    setAreaM2(preset.area);
    setDepthCm(preset.depth);
    setDensity(preset.density);
    setWastePct(preset.waste);
    setBagSize(preset.bag);
    setBagUnit(preset.bagUnit);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
    setPricePerM3("");
    setPricePerBag("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Áridos: ${formatNum(result.order)} m³ (${formatNum(result.yards)} yd³), ${formatNum(result.tonnes)} t, ${result.bags} sacos.`
      : `Aggregate: ${formatNum(result.order)} m³ (${formatNum(result.yards)} yd³), ${formatNum(result.tonnes)} t, ${result.bags} bags.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "path" ? copy.path : id === "drive" ? copy.drive : id === "mulch" ? copy.mulch : copy.soil;

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
        <label className="grid gap-1 text-sm">
          {copy.shape}
          <select className={inputClass} value={shape} onChange={(e) => setShape(e.target.value as Shape)}>
            <option value="rect">{copy.rect}</option>
            <option value="circle">{copy.circle}</option>
            <option value="area">{copy.known}</option>
          </select>
        </label>
        {shape === "rect" && (
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
        )}
        {shape === "circle" && (
          <label className="grid gap-1 text-sm">
            {copy.diameter}
            <input className={inputClass} inputMode="decimal" value={diameterM} onChange={(e) => setDiameterM(e.target.value)} />
          </label>
        )}
        {shape === "area" && (
          <label className="grid gap-1 text-sm">
            {copy.area}
            <input className={inputClass} inputMode="decimal" value={areaM2} onChange={(e) => setAreaM2(e.target.value)} />
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.depth}
            <input className={inputClass} inputMode="decimal" value={depthCm} onChange={(e) => setDepthCm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.density}
            <input className={inputClass} inputMode="decimal" value={density} onChange={(e) => setDensity(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.bag}
            <input className={inputClass} inputMode="decimal" value={bagSize} onChange={(e) => setBagSize(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.bagUnit}
          <select className={inputClass} value={bagUnit} onChange={(e) => setBagUnit(e.target.value as BagUnit)}>
            <option value="kg">kg</option>
            <option value="L">L</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.priceM3}
            <input className={inputClass} inputMode="decimal" value={pricePerM3} onChange={(e) => setPricePerM3(e.target.value)} placeholder="0" />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.priceBag}
            <input className={inputClass} inputMode="decimal" value={pricePerBag} onChange={(e) => setPricePerBag(e.target.value)} placeholder="0" />
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
                <dt className="text-muted-foreground">{copy.areaOut}</dt>
                <dd className="font-medium">{formatNum(result.area)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.volume}</dt>
                <dd className="font-medium">{formatNum(result.volume)} m³</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.order}</dt>
                <dd className="font-medium">{formatNum(result.order)} m³</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.yards}</dt>
                <dd className="font-medium">{formatNum(result.yards)} yd³</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.tonnes}</dt>
                <dd className="font-medium">{formatNum(result.tonnes)} t</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.bags}</dt>
                <dd className="font-medium">{result.bags}</dd>
              </div>
              {result.bulkCost != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.bulkCost}</dt>
                  <dd className="font-medium">{formatNum(result.bulkCost)}</dd>
                </div>
              )}
              {result.bagCost != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.bagCost}</dt>
                  <dd className="font-medium">{formatNum(result.bagCost)}</dd>
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
