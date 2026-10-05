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

type Unit = "m" | "ft";
type Mode = "area" | "rect";
type Grout = "sanded" | "unsanded" | "epoxy";

type Preset = {
  id: string;
  unit: Unit;
  mode: Mode;
  area: string;
  length: string;
  width: string;
  tileL: string;
  tileW: string;
  joint: string;
  depth: string;
  grout: Grout;
  bag: string;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "floor", unit: "m", mode: "rect", area: "12", length: "4", width: "3", tileL: "600", tileW: "600", joint: "2", depth: "10", grout: "sanded", bag: "5", waste: "10" },
  { id: "subway", unit: "m", mode: "area", area: "4", length: "2", width: "2", tileL: "75", tileW: "150", joint: "3", depth: "8", grout: "unsanded", bag: "2.5", waste: "10" },
  { id: "mosaic", unit: "m", mode: "area", area: "1.5", length: "1.5", width: "1", tileL: "25", tileW: "25", joint: "2", depth: "4", grout: "unsanded", bag: "1", waste: "15" },
  { id: "inch", unit: "ft", mode: "rect", area: "100", length: "10", width: "8", tileL: "12", tileW: "12", joint: "0.125", depth: "0.375", grout: "sanded", bag: "10", waste: "10" },
];

const DENSITY: Record<Grout, number> = { sanded: 1.6, unsanded: 1.5, epoxy: 1.55 };

export function GroutCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [mode, setMode] = useState<Mode>("rect");
  const [area, setArea] = useState("12");
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("3");
  const [tileL, setTileL] = useState("600");
  const [tileW, setTileW] = useState("600");
  const [joint, setJoint] = useState("2");
  const [depth, setDepth] = useState("10");
  const [grout, setGrout] = useState<Grout>("sanded");
  const [bag, setBag] = useState("5");
  const [wastePct, setWastePct] = useState("10");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá kilos y sacos de junta de cemento o epoxi a partir del área, el tamaño de la baldosa y la junta. No cuenta piezas: eso lo hace la calculadora de baldosas.",
        presets: "Presets",
        floor: "Piso 60×60",
        subway: "Subway",
        mosaic: "Mosaico",
        inch: "12×12 in",
        unit: "Unidades",
        meters: "Metros",
        feet: "Pies",
        mode: "Área",
        known: "Área conocida",
        rect: "Rectángulo",
        area: unit === "m" ? "Área (m²)" : "Área (ft²)",
        length: unit === "m" ? "Largo (m)" : "Largo (ft)",
        width: unit === "m" ? "Ancho (m)" : "Ancho (ft)",
        tileL: unit === "m" ? "Largo de baldosa (mm)" : "Largo de baldosa (in)",
        tileW: unit === "m" ? "Ancho de baldosa (mm)" : "Ancho de baldosa (in)",
        joint: unit === "m" ? "Ancho de junta (mm)" : "Ancho de junta (in)",
        depth: unit === "m" ? "Profundidad de junta (mm)" : "Profundidad de junta (in)",
        grout: "Tipo de junta",
        sanded: "Con arena",
        unsanded: "Sin arena",
        epoxy: "Epoxi",
        bag: "Saco (kg)",
        waste: "Desperdicio (%)",
        price: "Precio por saco (opcional)",
        result: "Pedido",
        areaOut: "Área",
        rate: "Cobertura",
        mass: "Masa neta",
        order: "A pedir (con desperdicio)",
        bags: "Sacos a pedir",
        leftover: "Junta sobrante",
        cost: "Costo de sacos",
        note: "Fórmula de planificación: (L+A)/(L×A) × junta × profundidad × densidad, en milímetros. No incluye crucetas, llana ni sellador de esquina.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
        errArea: "El área tiene que estar entre 0,2 y 500 m² (o el equivalente en pies).",
        errTile: unit === "m" ? "Cada lado de baldosa tiene que medir entre 10 y 1200 mm." : "Cada lado de baldosa tiene que medir entre 0,4 y 47 in.",
        errJoint: unit === "m" ? "La junta tiene que medir entre 1 y 20 mm, y la profundidad entre 2 y 25 mm." : "La junta tiene que medir entre 0,04 y 0,79 in, y la profundidad entre 0,08 y 0,98 in.",
        errWaste: "El desperdicio tiene que estar entre 0 y 30%.",
        errBag: "El saco tiene que pesar entre 0,5 y 25 kg.",
      }
    : {
        help: "Estimate cement or epoxy grout kilograms and bags from area, tile size, and joint size. It does not count tiles; the tile calculator does that.",
        presets: "Presets",
        floor: "60×60 floor",
        subway: "Subway",
        mosaic: "Mosaic",
        inch: "12×12 in",
        unit: "Units",
        meters: "Meters",
        feet: "Feet",
        mode: "Area",
        known: "Known area",
        rect: "Rectangle",
        area: unit === "m" ? "Area (m²)" : "Area (ft²)",
        length: unit === "m" ? "Length (m)" : "Length (ft)",
        width: unit === "m" ? "Width (m)" : "Width (ft)",
        tileL: unit === "m" ? "Tile length (mm)" : "Tile length (in)",
        tileW: unit === "m" ? "Tile width (mm)" : "Tile width (in)",
        joint: unit === "m" ? "Joint width (mm)" : "Joint width (in)",
        depth: unit === "m" ? "Joint depth (mm)" : "Joint depth (in)",
        grout: "Grout type",
        sanded: "Sanded",
        unsanded: "Unsanded",
        epoxy: "Epoxy",
        bag: "Bag (kg)",
        waste: "Waste (%)",
        price: "Price per bag (optional)",
        result: "Order",
        areaOut: "Area",
        rate: "Coverage",
        mass: "Net mass",
        order: "To order (with waste)",
        bags: "Bags to order",
        leftover: "Leftover grout",
        cost: "Bag cost",
        note: "Planning formula: (L+W)/(L×W) × joint × depth × density, in millimetres. Spacers, trowels, and corner sealant are not included.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
        errArea: "Area must be between 0.2 and 500 m² (or the square-foot equivalent).",
        errTile: unit === "m" ? "Each tile side must be between 10 and 1200 mm." : "Each tile side must be between 0.4 and 47 in.",
        errJoint: unit === "m" ? "Joint width must be 1 to 20 mm, and depth 2 to 25 mm." : "Joint width must be 0.04 to 0.79 in, and depth 0.08 to 0.98 in.",
        errWaste: "Waste must be between 0 and 30%.",
        errBag: "Bag size must be between 0.5 and 25 kg.",
      };

  const result = useMemo(() => {
    const toM = unit === "ft" ? 0.3048 : 1;
    const toMm = unit === "ft" ? 25.4 : 1;
    let areaM2: number | null = null;
    if (mode === "area") {
      const raw = parseNum(area);
      areaM2 = raw == null ? null : raw * toM * toM;
    } else {
      const l = parseNum(length);
      const w = parseNum(width);
      areaM2 = l == null || w == null ? null : l * w * toM * toM;
    }
    const tl = parseNum(tileL);
    const tw = parseNum(tileW);
    const j = parseNum(joint);
    const d = parseNum(depth);
    const waste = parseNum(wastePct);
    const bagKg = parseNum(bag);
    if (areaM2 == null || areaM2 < 0.2 || areaM2 > 500) return { error: copy.errArea };
    if (tl == null || tw == null || tl * toMm < 10 || tw * toMm < 10 || tl * toMm > 1200 || tw * toMm > 1200) return { error: copy.errTile };
    if (j == null || d == null || j * toMm < 1 || j * toMm > 20 || d * toMm < 2 || d * toMm > 25) return { error: copy.errJoint };
    if (waste == null || waste < 0 || waste > 30) return { error: copy.errWaste };
    if (bagKg == null || bagKg < 0.5 || bagKg > 25) return { error: copy.errBag };
    const tlMm = tl * toMm;
    const twMm = tw * toMm;
    const density = DENSITY[grout];
    const kgPerM2 = ((tlMm + twMm) / (tlMm * twMm)) * (j * toMm) * (d * toMm) * density;
    const netKg = kgPerM2 * areaM2;
    const orderKg = netKg * (1 + waste / 100);
    const bags = Math.ceil(orderKg / bagKg - 1e-9);
    const leftover = bags * bagKg - orderKg;
    const unitPrice = parseNum(price);
    const areaShown = areaM2 / (toM * toM);
    return {
      areaShown,
      areaUnit: unit === "m" ? "m²" : "ft²",
      kgPerM2,
      netKg,
      orderKg,
      bags,
      leftover,
      cost: unitPrice != null && unitPrice >= 0 ? bags * unitPrice : null,
    };
  }, [area, bag, copy.errArea, copy.errBag, copy.errJoint, copy.errTile, copy.errWaste, depth, grout, joint, length, mode, price, tileL, tileW, unit, wastePct, width]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setMode(preset.mode);
    setArea(preset.area);
    setLength(preset.length);
    setWidth(preset.width);
    setTileL(preset.tileL);
    setTileW(preset.tileW);
    setJoint(preset.joint);
    setDepth(preset.depth);
    setGrout(preset.grout);
    setBag(preset.bag);
    setWastePct(preset.waste);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
    setPrice("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Junta: ${result.bags} sacos de ${formatNum(parseNum(bag) ?? 0, 1)} kg, ${formatNum(result.orderKg)} kg para ${formatNum(result.areaShown)} ${result.areaUnit}.`
      : `Grout: ${result.bags} bags of ${formatNum(parseNum(bag) ?? 0, 1)} kg, ${formatNum(result.orderKg)} kg for ${formatNum(result.areaShown)} ${result.areaUnit}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "floor" ? copy.floor : id === "subway" ? copy.subway : id === "mosaic" ? copy.mosaic : copy.inch;

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
            {copy.unit}
            <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
              <option value="m">{copy.meters}</option>
              <option value="ft">{copy.feet}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.mode}
            <select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="rect">{copy.rect}</option>
              <option value="area">{copy.known}</option>
            </select>
          </label>
        </div>
        {mode === "area" ? (
          <label className="grid gap-1 text-sm">
            {copy.area}
            <input className={inputClass} inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
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
          <label className="grid gap-1 text-sm">
            {copy.tileL}
            <input className={inputClass} inputMode="decimal" value={tileL} onChange={(e) => setTileL(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.tileW}
            <input className={inputClass} inputMode="decimal" value={tileW} onChange={(e) => setTileW(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.joint}
            <input className={inputClass} inputMode="decimal" value={joint} onChange={(e) => setJoint(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.depth}
            <input className={inputClass} inputMode="decimal" value={depth} onChange={(e) => setDepth(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.grout}
            <select className={inputClass} value={grout} onChange={(e) => setGrout(e.target.value as Grout)}>
              <option value="sanded">{copy.sanded}</option>
              <option value="unsanded">{copy.unsanded}</option>
              <option value="epoxy">{copy.epoxy}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.bag}
            <input className={inputClass} inputMode="decimal" value={bag} onChange={(e) => setBag(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.price}
            <input className={inputClass} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
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
                <dd className="font-medium">{formatNum(result.areaShown)} {result.areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.rate}</dt>
                <dd className="font-medium">{formatNum(result.kgPerM2, 3)} kg/m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.mass}</dt>
                <dd className="font-medium">{formatNum(result.netKg)} kg</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.order}</dt>
                <dd className="font-medium">{formatNum(result.orderKg)} kg</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.bags}</dt>
                <dd className="font-medium">{result.bags}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.leftover}</dt>
                <dd className="font-medium">{formatNum(result.leftover)} kg</dd>
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
