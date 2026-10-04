import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Layout = "closed" | "two" | "one" | "custom";
type PresetId = "metric" | "us" | "front" | "rain";

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
  width: string;
  section: string;
  hanger: string;
  downspout: string;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "metric", unit: "m", layout: "closed", length: "10", width: "8", section: "3", hanger: "0.6", downspout: "10", waste: "8" },
  { id: "us", unit: "ft", layout: "closed", length: "40", width: "30", section: "10", hanger: "2", downspout: "30", waste: "8" },
  { id: "front", unit: "m", layout: "two", length: "12", width: "8", section: "3", hanger: "0.6", downspout: "10", waste: "10" },
  { id: "rain", unit: "ft", layout: "closed", length: "40", width: "30", section: "10", hanger: "1.5", downspout: "20", waste: "10" },
];

export function GutterCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [layout, setLayout] = useState<Layout>("closed");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("8");
  const [known, setKnown] = useState("36");
  const [sectionLen, setSectionLen] = useState("3");
  const [hangerGap, setHangerGap] = useState("0.6");
  const [dropGap, setDropGap] = useState("10");
  const [elbowsEach, setElbowsEach] = useState("2");
  const [extraCorners, setExtraCorners] = useState("0");
  const [wastePct, setWastePct] = useState("8");
  const [sectionPrice, setSectionPrice] = useState("");
  const [dropPrice, setDropPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá tramos de canalón, soportes y bajantes a partir del alero, la pieza que comprás y la separación. Un circuito cerrado no lleva tapones.",
        presets: "Presets",
        metric: "Casa 10×8 m",
        us: "Ranch 40×30 ft",
        front: "Solo frente y fondo",
        rain: "Lluvia fuerte",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        layout: "Recorrido",
        closed: "Cuatro lados (cerrado)",
        two: "Frente y fondo",
        one: "Un solo alero",
        custom: "Largo conocido",
        length: unit === "m" ? "Largo de la casa (m)" : "Largo de la casa (ft)",
        width: unit === "m" ? "Ancho de la casa (m)" : "Ancho de la casa (ft)",
        known: unit === "m" ? "Largo de alero (m)" : "Largo de alero (ft)",
        section: unit === "m" ? "Largo de la pieza (m)" : "Largo de la pieza (ft)",
        hanger: unit === "m" ? "Separación de soportes (m)" : "Separación de soportes (ft)",
        drop: unit === "m" ? "Un bajante cada (m)" : "Un bajante cada (ft)",
        elbows: "Codos por bajante",
        corners: "Esquinas extra",
        waste: "Desperdicio (%)",
        sectionPrice: "Precio por tramo (opcional)",
        dropPrice: "Precio por bajante (opcional)",
        result: "Resultado",
        eave: "Largo de alero",
        order: "Largo a pedir",
        sections: "Tramos a comprar",
        hangers: "Soportes",
        drops: "Bajantes",
        elbowOut: "Codos",
        caps: "Tapones",
        cornerOut: "Esquinas",
        joints: "Uniones",
        cost: "Material estimado",
        note: "Tramos, soportes y bajantes se redondean hacia arriba. El circuito cerrado suma 4 esquinas y 0 tapones.",
        empty: "Completá el largo, la pieza, la separación de soportes y la de bajantes.",
        invalid: "Usá números mayores que cero. Los decimales pueden llevar coma o punto.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 25%.",
        spacingInvalid: "La separación de soportes y bajantes tiene que ser mayor que cero y menor que el largo del alero.",
        elbowInvalid: "Los codos por bajante tienen que estar entre 0 y 6.",
        tooBig: "El alero supera el límite de planificación (2.000 m o 6.000 ft).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate gutter sections, hangers, and downspouts from eave length, stock length, and spacing. A closed loop needs no end caps.",
        presets: "Presets",
        metric: "10×8 m house",
        us: "40×30 ft ranch",
        front: "Front and back",
        rain: "Heavy rain",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        layout: "Layout",
        closed: "Four sides (closed)",
        two: "Front and back",
        one: "One fascia",
        custom: "Known length",
        length: unit === "m" ? "House length (m)" : "House length (ft)",
        width: unit === "m" ? "House width (m)" : "House width (ft)",
        known: unit === "m" ? "Eave length (m)" : "Eave length (ft)",
        section: unit === "m" ? "Stock length (m)" : "Stock length (ft)",
        hanger: unit === "m" ? "Hanger spacing (m)" : "Hanger spacing (ft)",
        drop: unit === "m" ? "Downspout every (m)" : "Downspout every (ft)",
        elbows: "Elbows per downspout",
        corners: "Extra corners",
        waste: "Waste (%)",
        sectionPrice: "Price per section (optional)",
        dropPrice: "Price per downspout (optional)",
        result: "Result",
        eave: "Eave length",
        order: "Length to order",
        sections: "Sections to buy",
        hangers: "Hangers",
        drops: "Downspouts",
        elbowOut: "Elbows",
        caps: "End caps",
        cornerOut: "Corners",
        joints: "Connectors",
        cost: "Estimated material",
        note: "Sections, hangers, and downspouts round up. A closed loop adds 4 corners and 0 end caps.",
        empty: "Enter the length, stock length, hanger spacing, and downspout spacing.",
        invalid: "Use numbers greater than zero. Decimals can use a comma or a dot.",
        wasteInvalid: "Waste must be between 0% and 25%.",
        spacingInvalid: "Hanger and downspout spacing must be greater than zero and shorter than the eave.",
        elbowInvalid: "Elbows per downspout must be between 0 and 6.",
        tooBig: "Eave length is above the planning limit (2,000 m or 6,000 ft).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const len = parseNum(length);
    const wid = parseNum(width);
    const customLen = parseNum(known);
    const stock = parseNum(sectionLen);
    const hanger = parseNum(hangerGap);
    const drop = parseNum(dropGap);
    const elbows = parseNum(elbowsEach);
    const extra = parseNum(extraCorners);
    const waste = parseNum(wastePct);
    const pSection = parseNum(sectionPrice);
    const pDrop = parseNum(dropPrice);
    if (stock == null || hanger == null || drop == null || elbows == null || extra == null || waste == null) {
      return { error: copy.empty };
    }
    if (layout !== "custom" && (len == null || (layout !== "one" && wid == null))) return { error: copy.empty };
    if (layout === "custom" && customLen == null) return { error: copy.empty };
    const dims = layout === "custom" ? [customLen] : layout === "one" ? [len] : [len, wid];
    if (
      dims.some((n) => n == null || Number.isNaN(n) || n <= 0) ||
      [stock, hanger, drop].some((n) => Number.isNaN(n) || n <= 0) ||
      Number.isNaN(elbows) ||
      Number.isNaN(extra) ||
      Number.isNaN(waste)
    ) {
      return { error: copy.invalid };
    }
    const eave =
      layout === "custom"
        ? (customLen as number)
        : layout === "closed"
          ? 2 * ((len as number) + (wid as number))
          : layout === "two"
            ? 2 * (len as number)
            : (len as number);
    const limit = unit === "m" ? 2_000 : 6_000;
    if (eave > limit) return { error: copy.tooBig };
    if (waste < 0 || waste > 25) return { error: copy.wasteInvalid };
    if (hanger >= eave || drop >= eave) return { error: copy.spacingInvalid };
    if (elbows < 0 || elbows > 6 || extra < 0 || extra > 40) return { error: copy.elbowInvalid };
    if (pSection != null && (Number.isNaN(pSection) || pSection < 0)) return { error: copy.invalid };
    if (pDrop != null && (Number.isNaN(pDrop) || pDrop < 0)) return { error: copy.invalid };
    const order = eave * (1 + waste / 100);
    const sections = Math.ceil(order / stock - 1e-9);
    const hangers = Math.ceil(eave / hanger - 1e-9);
    const drops = Math.max(1, Math.ceil(eave / drop - 1e-9));
    const elbowCount = drops * elbows;
    const runs = layout === "closed" ? 1 : layout === "two" ? 2 : layout === "one" ? 1 : 1;
    const caps = layout === "closed" ? 0 : runs * 2;
    const corners = (layout === "closed" ? 4 : 0) + extra;
    const joints = layout === "closed" ? sections : Math.max(0, sections - runs);
    const costSections = sectionPrice.trim() === "" || pSection == null ? 0 : sections * pSection;
    const costDrops = dropPrice.trim() === "" || pDrop == null ? 0 : drops * pDrop;
    const cost = sectionPrice.trim() === "" && dropPrice.trim() === "" ? null : costSections + costDrops;
    return { eave, order, sections, hangers, drops, elbowCount, caps, corners, joints, cost };
  }, [
    layout,
    length,
    width,
    known,
    sectionLen,
    hangerGap,
    dropGap,
    elbowsEach,
    extraCorners,
    wastePct,
    sectionPrice,
    dropPrice,
    unit,
    copy.empty,
    copy.invalid,
    copy.wasteInvalid,
    copy.spacingInvalid,
    copy.elbowInvalid,
    copy.tooBig,
  ]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLayout(preset.layout);
    setLength(preset.length);
    setWidth(preset.width);
    setSectionLen(preset.section);
    setHangerGap(preset.hanger);
    setDropGap(preset.downspout);
    setWastePct(preset.waste);
    setKnown(preset.unit === "ft" ? "140" : "36");
    setCopied(false);
  }

  function reset() {
    setElbowsEach("2");
    setExtraCorners("0");
    setSectionPrice("");
    setDropPrice("");
    applyPreset(PRESETS[0]);
  }

  async function copyResult() {
    if ("error" in result) return;
    const u = unit === "m" ? "m" : "ft";
    const lines = [
      `${copy.eave}: ${formatNum(result.eave)} ${u}`,
      `${copy.order}: ${formatNum(result.order)} ${u}`,
      `${copy.sections}: ${result.sections}`,
      `${copy.hangers}: ${result.hangers}`,
      `${copy.drops}: ${result.drops}`,
      `${copy.elbowOut}: ${formatNum(result.elbowCount, 0)}`,
      `${copy.caps}: ${result.caps}`,
      `${copy.cornerOut}: ${formatNum(result.corners, 0)}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) =>
    id === "metric" ? copy.metric : id === "us" ? copy.us : id === "front" ? copy.front : copy.rain;
  const linearUnit = unit === "m" ? "m" : "ft";

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
              <option value="closed">{copy.closed}</option>
              <option value="two">{copy.two}</option>
              <option value="one">{copy.one}</option>
              <option value="custom">{copy.custom}</option>
            </select>
          </label>
        </div>
        {layout === "custom" ? (
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
            {layout !== "one" ? (
              <label className="grid gap-1 text-sm">
                {copy.width}
                <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
              </label>
            ) : null}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.section}
            <input className={inputClass} inputMode="decimal" value={sectionLen} onChange={(e) => setSectionLen(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.hanger}
            <input className={inputClass} inputMode="decimal" value={hangerGap} onChange={(e) => setHangerGap(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.drop}
            <input className={inputClass} inputMode="decimal" value={dropGap} onChange={(e) => setDropGap(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.elbows}
            <input className={inputClass} inputMode="decimal" value={elbowsEach} onChange={(e) => setElbowsEach(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.corners}
            <input className={inputClass} inputMode="decimal" value={extraCorners} onChange={(e) => setExtraCorners(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.sectionPrice}
            <input className={inputClass} inputMode="decimal" value={sectionPrice} onChange={(e) => setSectionPrice(e.target.value)} placeholder="0" />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.dropPrice}
            <input className={inputClass} inputMode="decimal" value={dropPrice} onChange={(e) => setDropPrice(e.target.value)} placeholder="0" />
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
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.eave}</dt>
              <dd className="font-medium">{formatNum(result.eave)} {linearUnit}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.order}</dt>
              <dd className="font-medium">{formatNum(result.order)} {linearUnit}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.sections}</dt>
              <dd className="text-base font-semibold">{result.sections}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.hangers}</dt>
              <dd className="font-medium">{result.hangers}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.drops}</dt>
              <dd className="font-medium">{result.drops}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.elbowOut}</dt>
              <dd className="font-medium">{formatNum(result.elbowCount, 0)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.caps}</dt>
              <dd className="font-medium">{result.caps}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.cornerOut}</dt>
              <dd className="font-medium">{formatNum(result.corners, 0)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.joints}</dt>
              <dd className="font-medium">{result.joints}</dd>
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
