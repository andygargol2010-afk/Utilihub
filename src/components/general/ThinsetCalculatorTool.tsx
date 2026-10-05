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
type Notch = "3" | "6" | "8" | "10" | "12" | "15";

type Preset = {
  id: string;
  unit: Unit;
  mode: Mode;
  area: string;
  length: string;
  width: string;
  notch: Notch;
  bag: string;
  waste: string;
  butter: boolean;
};

const PRESETS: Preset[] = [
  { id: "wall", unit: "m", mode: "rect", area: "8", length: "4", width: "2", notch: "6", bag: "25", waste: "10", butter: false },
  { id: "floor", unit: "m", mode: "rect", area: "12", length: "4", width: "3", notch: "10", bag: "25", waste: "10", butter: false },
  { id: "large", unit: "m", mode: "area", area: "18", length: "6", width: "3", notch: "12", bag: "25", waste: "10", butter: true },
  { id: "mosaic", unit: "m", mode: "area", area: "4", length: "2", width: "2", notch: "3", bag: "5", waste: "15", butter: false },
];

const RATE: Record<Notch, number> = { "3": 1.5, "6": 3, "8": 4, "10": 5, "12": 6.5, "15": 8 };
const BUTTER_KG = 1;

export function ThinsetCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [mode, setMode] = useState<Mode>("rect");
  const [area, setArea] = useState("12");
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("3");
  const [notch, setNotch] = useState<Notch>("10");
  const [bag, setBag] = useState("25");
  const [wastePct, setWastePct] = useState("10");
  const [butter, setButter] = useState(false);
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá kilos y sacos de cemento cola o adhesivo según el área y el diente de la llana. No cuenta baldosas ni junta: eso lo hacen las calculadoras hermanas.",
        presets: "Presets",
        wall: "Pared 20 cm",
        floor: "Piso 60 cm",
        large: "Gran formato",
        mosaic: "Mosaico",
        unit: "Unidades",
        meters: "Metros",
        feet: "Pies",
        mode: "Área",
        known: "Área conocida",
        rect: "Rectángulo",
        area: unit === "m" ? "Área (m²)" : "Área (ft²)",
        length: unit === "m" ? "Largo (m)" : "Largo (ft)",
        width: unit === "m" ? "Ancho (m)" : "Ancho (ft)",
        notch: "Diente de llana",
        bag: "Saco (kg)",
        waste: "Desperdicio (%)",
        butter: "Doble encolado (+1 kg/m²)",
        price: "Precio por saco (opcional)",
        result: "Pedido",
        areaOut: "Área",
        rate: "Cobertura de llana",
        butterOut: "Doble encolado",
        mass: "Masa neta",
        order: "A pedir (con desperdicio)",
        bags: "Sacos a pedir",
        leftover: "Adhesivo sobrante",
        cost: "Costo de sacos",
        note: "Tasas de planificación para diente cuadrado: 1,5 / 3 / 4 / 5 / 6,5 / 8 kg/m². No incluyen imprimación, nivelación ni crucetas.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
        errArea: "El área tiene que estar entre 0,2 y 500 m² (o el equivalente en pies).",
        errWaste: "El desperdicio tiene que estar entre 0 y 30%.",
        errBag: "El saco tiene que pesar entre 2 y 25 kg.",
      }
    : {
        help: "Estimate thinset or tile adhesive kilograms and bags from area and trowel notch. It does not count tiles or grout; the sibling calculators do that.",
        presets: "Presets",
        wall: "20 cm wall",
        floor: "60 cm floor",
        large: "Large format",
        mosaic: "Mosaic",
        unit: "Units",
        meters: "Meters",
        feet: "Feet",
        mode: "Area",
        known: "Known area",
        rect: "Rectangle",
        area: unit === "m" ? "Area (m²)" : "Area (ft²)",
        length: unit === "m" ? "Length (m)" : "Length (ft)",
        width: unit === "m" ? "Width (m)" : "Width (ft)",
        notch: "Trowel notch",
        bag: "Bag (kg)",
        waste: "Waste (%)",
        butter: "Back-butter (+1 kg/m²)",
        price: "Price per bag (optional)",
        result: "Order",
        areaOut: "Area",
        rate: "Notch coverage",
        butterOut: "Back-butter",
        mass: "Net mass",
        order: "To order (with waste)",
        bags: "Bags to order",
        leftover: "Leftover adhesive",
        cost: "Bag cost",
        note: "Planning rates for a square notch: 1.5 / 3 / 4 / 5 / 6.5 / 8 kg/m². Primer, leveling, and spacers are not included.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
        errArea: "Area must be between 0.2 and 500 m² (or the square-foot equivalent).",
        errWaste: "Waste must be between 0 and 30%.",
        errBag: "Bag size must be between 2 and 25 kg.",
      };

  const result = useMemo(() => {
    const toM = unit === "ft" ? 0.3048 : 1;
    let areaM2: number | null = null;
    if (mode === "area") {
      const raw = parseNum(area);
      areaM2 = raw == null ? null : raw * toM * toM;
    } else {
      const l = parseNum(length);
      const w = parseNum(width);
      areaM2 = l == null || w == null ? null : l * w * toM * toM;
    }
    const waste = parseNum(wastePct);
    const bagKg = parseNum(bag);
    if (areaM2 == null || areaM2 < 0.2 || areaM2 > 500) return { error: copy.errArea };
    if (waste == null || waste < 0 || waste > 30) return { error: copy.errWaste };
    if (bagKg == null || bagKg < 2 || bagKg > 25) return { error: copy.errBag };
    const rate = RATE[notch];
    const butterKg = butter ? BUTTER_KG * areaM2 : 0;
    const netKg = rate * areaM2 + butterKg;
    const orderKg = rate * areaM2 * (1 + waste / 100) + butterKg * (1 + waste / 100);
    const bags = Math.ceil(orderKg / bagKg - 1e-9);
    const leftover = bags * bagKg - orderKg;
    const unitPrice = parseNum(price);
    const areaShown = areaM2 / (toM * toM);
    return {
      areaShown,
      areaUnit: unit === "m" ? "m²" : "ft²",
      rate,
      butterKg,
      netKg,
      orderKg,
      bags,
      leftover,
      cost: unitPrice != null && unitPrice >= 0 ? bags * unitPrice : null,
    };
  }, [area, bag, butter, copy.errArea, copy.errBag, copy.errWaste, length, mode, notch, price, unit, wastePct, width]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setMode(preset.mode);
    setArea(preset.area);
    setLength(preset.length);
    setWidth(preset.width);
    setNotch(preset.notch);
    setBag(preset.bag);
    setWastePct(preset.waste);
    setButter(preset.butter);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[1]);
    setPrice("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Adhesivo: ${result.bags} sacos de ${formatNum(parseNum(bag) ?? 0, 1)} kg, ${formatNum(result.orderKg)} kg para ${formatNum(result.areaShown)} ${result.areaUnit}.`
      : `Adhesive: ${result.bags} bags of ${formatNum(parseNum(bag) ?? 0, 1)} kg, ${formatNum(result.orderKg)} kg for ${formatNum(result.areaShown)} ${result.areaUnit}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "wall" ? copy.wall : id === "floor" ? copy.floor : id === "large" ? copy.large : copy.mosaic;

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
            {copy.notch}
            <select className={inputClass} value={notch} onChange={(e) => setNotch(e.target.value as Notch)}>
              <option value="3">3 mm · 1.5 kg/m²</option>
              <option value="6">6 mm · 3 kg/m²</option>
              <option value="8">8 mm · 4 kg/m²</option>
              <option value="10">10 mm · 5 kg/m²</option>
              <option value="12">12 mm · 6.5 kg/m²</option>
              <option value="15">15 mm · 8 kg/m²</option>
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
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4" checked={butter} onChange={(e) => setButter(e.target.checked)} />
          {copy.butter}
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
                <dd className="font-medium">{formatNum(result.areaShown)} {result.areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.rate}</dt>
                <dd className="font-medium">{formatNum(result.rate, 1)} kg/m²</dd>
              </div>
              {result.butterKg > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.butterOut}</dt>
                  <dd className="font-medium">{formatNum(result.butterKg)} kg</dd>
                </div>
              )}
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
