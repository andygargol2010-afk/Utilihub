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
type Shape = "rect" | "area";
type Material = "plywood" | "osb" | "mdf";

type Preset = {
  id: string;
  unit: Unit;
  shape: Shape;
  length: string;
  width: string;
  area: string;
  openings: string;
  sheetL: string;
  sheetW: string;
  thickness: string;
  material: Material;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "subfloor", unit: "ft", shape: "rect", length: "12", width: "10", area: "120", openings: "0", sheetL: "8", sheetW: "4", thickness: "0.75", material: "osb", waste: "10" },
  { id: "sheathing", unit: "ft", shape: "rect", length: "24", width: "8", area: "192", openings: "28", sheetL: "8", sheetW: "4", thickness: "0.4375", material: "osb", waste: "12" },
  { id: "cabinet", unit: "m", shape: "area", length: "2.4", width: "1.2", area: "6.5", openings: "0", sheetL: "2.44", sheetW: "1.22", thickness: "18", material: "mdf", waste: "15" },
  { id: "metric", unit: "m", shape: "rect", length: "5", width: "3.2", area: "16", openings: "1.8", sheetL: "2.5", sheetW: "1.25", thickness: "18", material: "plywood", waste: "10" },
];

const DENSITY: Record<Material, number> = { plywood: 550, osb: 650, mdf: 750 };

export function SheetCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("ft");
  const [shape, setShape] = useState<Shape>("rect");
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("10");
  const [area, setArea] = useState("120");
  const [openings, setOpenings] = useState("0");
  const [sheetL, setSheetL] = useState("8");
  const [sheetW, setSheetW] = useState("4");
  const [thickness, setThickness] = useState("0.75");
  const [material, setMaterial] = useState<Material>("osb");
  const [wastePct, setWastePct] = useState("10");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá cuántas placas de contrachapado, OSB o MDF pedir para un piso o una pared. Restá huecos y sumá desperdicio de corte. El precio es opcional.",
        presets: "Presets",
        subfloor: "Contrapiso",
        sheathing: "Cerramiento",
        cabinet: "Mueble MDF",
        metric: "Placa 1250",
        unit: "Unidades",
        meters: "Metros",
        feet: "Pies",
        shape: "Superficie",
        rect: "Rectángulo",
        known: "Área conocida",
        length: unit === "m" ? "Largo (m)" : "Largo (ft)",
        width: unit === "m" ? "Ancho (m)" : "Ancho (ft)",
        area: unit === "m" ? "Área (m²)" : "Área (ft²)",
        openings: unit === "m" ? "Huecos a restar (m²)" : "Huecos a restar (ft²)",
        sheet: "Placa",
        sheetL: unit === "m" ? "Largo de placa (m)" : "Largo de placa (ft)",
        sheetW: unit === "m" ? "Ancho de placa (m)" : "Ancho de placa (ft)",
        thickness: unit === "m" ? "Espesor (mm)" : "Espesor (in)",
        material: "Material",
        plywood: "Contrachapado",
        osb: "OSB",
        mdf: "MDF",
        waste: "Desperdicio (%)",
        price: "Precio por placa (opcional)",
        result: "Pedido",
        gross: "Área bruta",
        net: "Área neta",
        sheetArea: "Área de una placa",
        sheets: "Placas a pedir",
        leftover: "Sobrante estimado",
        weight: "Peso de las placas",
        cost: "Costo de placas",
        note: "El redondeo compra placas enteras. El peso usa densidad de planificación y no incluye tornillos ni pallet. No es la calculadora de pladur ni la de siding.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
        errArea: "El área neta tiene que ser mayor que 0. Revisá medidas y huecos.",
        errSheet: "La placa tiene que medir entre 0,3 y 6 m de lado (o el equivalente en pies).",
        errThick: unit === "m" ? "El espesor tiene que estar entre 3 y 40 mm." : "El espesor tiene que estar entre 0,12 y 1,6 in.",
        errWaste: "El desperdicio tiene que estar entre 0 y 40%.",
        errOpen: "Los huecos no pueden superar el área bruta.",
      }
    : {
        help: "Estimate plywood, OSB, or MDF sheets for a floor or wall. Subtract openings and add cut waste. Price is optional.",
        presets: "Presets",
        subfloor: "Subfloor",
        sheathing: "Sheathing",
        cabinet: "MDF cabinet",
        metric: "1250 sheet",
        unit: "Units",
        meters: "Meters",
        feet: "Feet",
        shape: "Surface",
        rect: "Rectangle",
        known: "Known area",
        length: unit === "m" ? "Length (m)" : "Length (ft)",
        width: unit === "m" ? "Width (m)" : "Width (ft)",
        area: unit === "m" ? "Area (m²)" : "Area (ft²)",
        openings: unit === "m" ? "Openings to subtract (m²)" : "Openings to subtract (ft²)",
        sheet: "Sheet",
        sheetL: unit === "m" ? "Sheet length (m)" : "Sheet length (ft)",
        sheetW: unit === "m" ? "Sheet width (m)" : "Sheet width (ft)",
        thickness: unit === "m" ? "Thickness (mm)" : "Thickness (in)",
        material: "Material",
        plywood: "Plywood",
        osb: "OSB",
        mdf: "MDF",
        waste: "Waste (%)",
        price: "Price per sheet (optional)",
        result: "Order",
        gross: "Gross area",
        net: "Net area",
        sheetArea: "One sheet",
        sheets: "Sheets to order",
        leftover: "Estimated leftover",
        weight: "Sheet weight",
        cost: "Sheet cost",
        note: "Rounding buys whole sheets. Weight uses a planning density and excludes fasteners and the pallet. This is not the drywall or vinyl siding calculator.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
        errArea: "Net area must be greater than 0. Check dimensions and openings.",
        errSheet: "Each sheet side must be between 0.3 and 6 m (or the foot equivalent).",
        errThick: unit === "m" ? "Thickness must be between 3 and 40 mm." : "Thickness must be between 0.12 and 1.6 in.",
        errWaste: "Waste must be between 0 and 40%.",
        errOpen: "Openings cannot exceed the gross area.",
      };

  const result = useMemo(() => {
    const waste = parseNum(wastePct);
    const open = parseNum(openings);
    const sL = parseNum(sheetL);
    const sW = parseNum(sheetW);
    const thick = parseNum(thickness);
    const gross = shape === "rect" ? (() => {
      const l = parseNum(length);
      const w = parseNum(width);
      return l != null && w != null ? l * w : null;
    })() : parseNum(area);
    if (gross == null || gross <= 0) return { error: copy.errArea };
    if (open == null || open < 0) return { error: copy.errOpen };
    if (open >= gross) return { error: copy.errOpen };
    const toM = unit === "ft" ? 0.3048 : 1;
    if (sL == null || sW == null || sL * toM < 0.3 || sW * toM < 0.3 || sL * toM > 6 || sW * toM > 6) return { error: copy.errSheet };
    const thickM = unit === "ft" ? (thick ?? -1) * 0.0254 : (thick ?? -1) / 1000;
    if (thick == null || thickM < 0.003 || thickM > 0.04) return { error: copy.errThick };
    if (waste == null || waste < 0 || waste > 40) return { error: copy.errWaste };
    const net = gross - open;
    const sheetArea = sL * sW;
    const orderArea = net * (1 + waste / 100);
    const sheets = Math.ceil(orderArea / sheetArea - 1e-9);
    const leftover = sheets * sheetArea - orderArea;
    const netM2 = net * toM * toM;
    const weight = sheets * sheetArea * toM * toM * thickM * DENSITY[material];
    const unitPrice = parseNum(price);
    const areaUnit = unit === "m" ? "m²" : "ft²";
    return {
      gross,
      net,
      sheetArea,
      sheets,
      leftover,
      weight,
      areaUnit,
      cost: unitPrice != null && unitPrice >= 0 ? sheets * unitPrice : null,
    };
  }, [area, copy.errArea, copy.errOpen, copy.errSheet, copy.errThick, copy.errWaste, length, material, openings, price, shape, sheetL, sheetW, thickness, unit, wastePct, width]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setShape(preset.shape);
    setLength(preset.length);
    setWidth(preset.width);
    setArea(preset.area);
    setOpenings(preset.openings);
    setSheetL(preset.sheetL);
    setSheetW(preset.sheetW);
    setThickness(preset.thickness);
    setMaterial(preset.material);
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
      ? `Tableros ${copy[material]}: ${result.sheets} placas de ${formatNum(Number(sheetL), 2)}×${formatNum(Number(sheetW), 2)}, sobrante ${formatNum(result.leftover)} ${result.areaUnit}, peso ${formatNum(result.weight, 0)} kg.`
      : `${copy[material]} sheets: ${result.sheets} sheets of ${formatNum(Number(sheetL), 2)}×${formatNum(Number(sheetW), 2)}, leftover ${formatNum(result.leftover)} ${result.areaUnit}, weight ${formatNum(result.weight, 0)} kg.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "subfloor" ? copy.subfloor : id === "sheathing" ? copy.sheathing : id === "cabinet" ? copy.cabinet : copy.metric;

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
              {copy.length}
              <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.width}
              <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
            </label>
          </div>
        ) : (
          <label className="grid gap-1 text-sm">
            {copy.area}
            <input className={inputClass} inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
          </label>
        )}
        <label className="grid gap-1 text-sm">
          {copy.openings}
          <input className={inputClass} inputMode="decimal" value={openings} onChange={(e) => setOpenings(e.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.sheetL}
            <input className={inputClass} inputMode="decimal" value={sheetL} onChange={(e) => setSheetL(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.sheetW}
            <input className={inputClass} inputMode="decimal" value={sheetW} onChange={(e) => setSheetW(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.thickness}
            <input className={inputClass} inputMode="decimal" value={thickness} onChange={(e) => setThickness(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.material}
            <select className={inputClass} value={material} onChange={(e) => setMaterial(e.target.value as Material)}>
              <option value="plywood">{copy.plywood}</option>
              <option value="osb">{copy.osb}</option>
              <option value="mdf">{copy.mdf}</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
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
                <dt className="text-muted-foreground">{copy.gross}</dt>
                <dd className="font-medium">{formatNum(result.gross)} {result.areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.net}</dt>
                <dd className="font-medium">{formatNum(result.net)} {result.areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.sheetArea}</dt>
                <dd className="font-medium">{formatNum(result.sheetArea)} {result.areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.sheets}</dt>
                <dd className="font-medium">{result.sheets}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.leftover}</dt>
                <dd className="font-medium">{formatNum(result.leftover)} {result.areaUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.weight}</dt>
                <dd className="font-medium">{formatNum(result.weight, 0)} kg</dd>
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
