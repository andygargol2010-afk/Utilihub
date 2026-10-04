import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type Shape = "rect" | "area";
type Job = "new" | "overseed" | "patch";
type Species = "fescue" | "rye" | "bluegrass" | "bermuda" | "custom";
type PresetId = "metric" | "overseed" | "patch" | "bluegrass";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

/** Planning rates in pounds per 1,000 sq ft for a new lawn. */
const NEW_LB_PER_1000: Record<Exclude<Species, "custom">, number> = {
  fescue: 8,
  rye: 6,
  bluegrass: 3,
  bermuda: 1.5,
};

const JOB_FACTOR: Record<Job, number> = {
  new: 1,
  overseed: 0.5,
  patch: 1.25,
};

const LB_PER_1000_TO_G_PER_M2 = 4.8824276;
const SQFT_PER_M2 = 10.7639104;
const LB_PER_KG = 2.2046226218;

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
  length: string;
  width: string;
  area: string;
  hardscape: string;
  job: Job;
  species: Species;
  customRate: string;
  bag: string;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "metric", unit: "m", length: "10", width: "6", area: "60", hardscape: "0", job: "new", species: "fescue", customRate: "8", bag: "1", waste: "10" },
  { id: "overseed", unit: "ft", length: "80", width: "50", area: "4000", hardscape: "200", job: "overseed", species: "fescue", customRate: "8", bag: "10", waste: "10" },
  { id: "patch", unit: "m", length: "3", width: "2", area: "6", hardscape: "0", job: "patch", species: "bermuda", customRate: "1.5", bag: "1", waste: "15" },
  { id: "bluegrass", unit: "ft", length: "50", width: "40", area: "2000", hardscape: "0", job: "new", species: "bluegrass", customRate: "3", bag: "5", waste: "10" },
];

export function GrassSeedCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [shape, setShape] = useState<Shape>("rect");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("6");
  const [knownArea, setKnownArea] = useState("60");
  const [hardscape, setHardscape] = useState("0");
  const [job, setJob] = useState<Job>("new");
  const [species, setSpecies] = useState<Species>("fescue");
  const [customRate, setCustomRate] = useState("8");
  const [bag, setBag] = useState("1");
  const [wastePct, setWastePct] = useState("10");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá kilos y sacos de semilla para césped nuevo, resiembra o un parche. Las dosis son de planificación: igualalas a la etiqueta del saco.",
        presets: "Presets",
        metric: "Festuca 10×6 m",
        overseed: "Resiembra 4.000 ft²",
        patch: "Parche bermuda",
        bluegrass: "Bluegrass 2.000 ft²",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        shape: "Forma",
        rect: "Rectángulo",
        known: "Área conocida",
        length: unit === "m" ? "Largo (m)" : "Largo (ft)",
        width: unit === "m" ? "Ancho (m)" : "Ancho (ft)",
        area: unit === "m" ? "Área (m²)" : "Área (ft²)",
        hardscape: unit === "m" ? "Solado a restar (m²)" : "Solado a restar (ft²)",
        job: "Trabajo",
        new: "Césped nuevo",
        overseedJob: "Resiembra",
        patchJob: "Parche pelado",
        species: "Especie",
        fescue: "Festuca alta",
        rye: "Raigrás perenne",
        bluegrassSp: "Kentucky bluegrass",
        bermuda: "Bermuda de semilla",
        custom: "Dosis propia",
        rate: unit === "m" ? "Dosis (g/m²)" : "Dosis (lb / 1.000 ft²)",
        bag: unit === "m" ? "Peso del saco (kg)" : "Peso del saco (lb)",
        waste: "Desperdicio (%)",
        price: "Precio por saco (opcional)",
        result: "Resultado",
        gross: "Área bruta",
        net: "Área neta",
        rateUsed: "Dosis usada",
        order: "Semilla a pedir",
        bags: "Sacos",
        leftover: "Sobrante",
        coverage: "Cobertura de un saco",
        cost: "Material estimado",
        note: "La resiembra usa la mitad de la dosis de césped nuevo; el parche, 1,25 veces. Los sacos se redondean hacia arriba.",
        empty: "Completá el área, el solado, la dosis, el saco y el desperdicio.",
        invalid: "Usá números válidos. El área y el saco tienen que ser mayores que cero. Los decimales pueden llevar coma o punto.",
        hardscapeInvalid: "El solado no puede ser negativo ni cubrir toda el área.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 40%.",
        rateInvalid: "La dosis tiene que estar entre 0,2 y 20 lb por 1.000 ft² (cerca de 1 a 98 g/m²).",
        tooBig: "El área supera el límite de planificación (20.000 m² o 200.000 ft²).",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate kilograms or pounds and bags of grass seed for a new lawn, overseed, or bare patch. Rates are planning defaults — match the bag label.",
        presets: "Presets",
        metric: "Fescue 10×6 m",
        overseed: "Overseed 4,000 ft²",
        patch: "Bermuda patch",
        bluegrass: "Bluegrass 2,000 ft²",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        shape: "Shape",
        rect: "Rectangle",
        known: "Known area",
        length: unit === "m" ? "Length (m)" : "Length (ft)",
        width: unit === "m" ? "Width (m)" : "Width (ft)",
        area: unit === "m" ? "Area (m²)" : "Area (ft²)",
        hardscape: unit === "m" ? "Hardscape to subtract (m²)" : "Hardscape to subtract (ft²)",
        job: "Job",
        new: "New lawn",
        overseedJob: "Overseed",
        patchJob: "Bare patch",
        species: "Species",
        fescue: "Tall fescue",
        rye: "Perennial rye",
        bluegrassSp: "Kentucky bluegrass",
        bermuda: "Seeded bermuda",
        custom: "Custom rate",
        rate: unit === "m" ? "Rate (g/m²)" : "Rate (lb / 1,000 ft²)",
        bag: unit === "m" ? "Bag weight (kg)" : "Bag weight (lb)",
        waste: "Waste (%)",
        price: "Price per bag (optional)",
        result: "Result",
        gross: "Gross area",
        net: "Net area",
        rateUsed: "Rate used",
        order: "Seed to order",
        bags: "Bags",
        leftover: "Leftover",
        coverage: "One bag covers",
        cost: "Estimated material",
        note: "Overseed uses half the new-lawn rate; a patch uses 1.25 times. Bags round up.",
        empty: "Enter the area, hardscape, rate, bag weight, and waste.",
        invalid: "Use valid numbers. Area and bag weight must be greater than zero. Decimals can use a comma or a dot.",
        hardscapeInvalid: "Hardscape cannot be negative or cover the whole area.",
        wasteInvalid: "Waste must be between 0% and 40%.",
        rateInvalid: "Rate must be between 0.2 and 20 lb per 1,000 ft² (about 1 to 98 g/m²).",
        tooBig: "Area is above the planning limit (20,000 m² or 200,000 ft²).",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const cut = parseNum(hardscape);
    const waste = parseNum(wastePct);
    const bagWeight = parseNum(bag);
    const custom = parseNum(customRate);
    const known = shape === "area" ? parseNum(knownArea) : null;
    const len = shape === "rect" ? parseNum(length) : 1;
    const wid = shape === "rect" ? parseNum(width) : 1;
    if (
      cut == null ||
      waste == null ||
      bagWeight == null ||
      custom == null ||
      (shape === "rect" && (len == null || wid == null)) ||
      (shape === "area" && known == null)
    ) {
      return { error: copy.empty };
    }
    if (
      [bagWeight, custom].some((n) => Number.isNaN(n)) ||
      Number.isNaN(cut) ||
      Number.isNaN(waste) ||
      bagWeight <= 0 ||
      (shape === "rect" && [len, wid].some((n) => n == null || Number.isNaN(n) || n <= 0)) ||
      (shape === "area" && (known == null || Number.isNaN(known) || known <= 0))
    ) {
      return { error: copy.invalid };
    }
    const gross = shape === "rect" ? (len as number) * (wid as number) : (known as number);
    const limit = unit === "m" ? 20_000 : 200_000;
    if (gross > limit) return { error: copy.tooBig };
    if (cut < 0 || cut >= gross) return { error: copy.hardscapeInvalid };
    if (waste < 0 || waste > 40) return { error: copy.wasteInvalid };
    const baseLb = species === "custom" ? custom : NEW_LB_PER_1000[species];
    const enteredLb = unit === "m" ? custom / LB_PER_1000_TO_G_PER_M2 : custom;
    const rateLb = species === "custom" ? enteredLb : baseLb * JOB_FACTOR[job];
    if (rateLb < 0.2 || rateLb > 20) return { error: copy.rateInvalid };
    const unitPrice = parseNum(price);
    if (price.trim() !== "" && (unitPrice == null || Number.isNaN(unitPrice) || unitPrice < 0)) return { error: copy.invalid };
    const net = gross - cut;
    const netM2 = unit === "m" ? net : net / SQFT_PER_M2;
    const orderKg = (netM2 * rateLb * LB_PER_1000_TO_G_PER_M2 * (1 + waste / 100)) / 1000;
    const bagKg = unit === "m" ? bagWeight : bagWeight / LB_PER_KG;
    const bags = Math.ceil(orderKg / bagKg - 1e-9);
    const leftoverKg = bags * bagKg - orderKg;
    const coverM2 = (bagKg * 1000) / (rateLb * LB_PER_1000_TO_G_PER_M2);
    const cost = price.trim() === "" || unitPrice == null ? null : bags * unitPrice;
    return { gross, net, rateLb, orderKg, bags, leftoverKg, coverM2, cost };
  }, [
    shape,
    length,
    width,
    knownArea,
    hardscape,
    job,
    species,
    customRate,
    bag,
    wastePct,
    price,
    unit,
    copy.empty,
    copy.invalid,
    copy.hardscapeInvalid,
    copy.wasteInvalid,
    copy.rateInvalid,
    copy.tooBig,
  ]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLength(preset.length);
    setWidth(preset.width);
    setKnownArea(preset.area);
    setHardscape(preset.hardscape);
    setJob(preset.job);
    setSpecies(preset.species);
    setCustomRate(preset.unit === "m" ? String(Math.round(NEW_LB_PER_1000[preset.species === "custom" ? "fescue" : preset.species] * LB_PER_1000_TO_G_PER_M2 * 10) / 10) : preset.customRate);
    setBag(preset.bag);
    setWastePct(preset.waste);
    setCopied(false);
  }

  function reset() {
    setShape("rect");
    setPrice("");
    applyPreset(PRESETS[0]);
  }

  function onSpecies(next: Species) {
    setSpecies(next);
    if (next === "custom") return;
    const lb = NEW_LB_PER_1000[next];
    setCustomRate(unit === "m" ? String(Math.round(lb * LB_PER_1000_TO_G_PER_M2 * 10) / 10) : String(lb));
  }

  function onUnit(next: Unit) {
    if (next === unit) return;
    const current = parseNum(customRate);
    if (current != null && !Number.isNaN(current) && current > 0) {
      const lb = unit === "m" ? current / LB_PER_1000_TO_G_PER_M2 : current;
      setCustomRate(next === "m" ? String(Math.round(lb * LB_PER_1000_TO_G_PER_M2 * 10) / 10) : String(Math.round(lb * 10) / 10));
    }
    const bagNow = parseNum(bag);
    if (bagNow != null && !Number.isNaN(bagNow) && bagNow > 0) {
      const kg = unit === "m" ? bagNow : bagNow / LB_PER_KG;
      setBag(next === "m" ? String(Math.round(kg * 100) / 100) : String(Math.round(kg * LB_PER_KG * 10) / 10));
    }
    setUnit(next);
  }

  async function copyResult() {
    if ("error" in result) return;
    const areaUnit = unit === "m" ? "m²" : "ft²";
    const weightUnit = unit === "m" ? "kg" : "lb";
    const order = unit === "m" ? result.orderKg : result.orderKg * LB_PER_KG;
    const leftover = unit === "m" ? result.leftoverKg : result.leftoverKg * LB_PER_KG;
    const cover = unit === "m" ? result.coverM2 : result.coverM2 * SQFT_PER_M2;
    const rateLabel = unit === "m" ? `${formatNum(result.rateLb * LB_PER_1000_TO_G_PER_M2, 1)} g/m²` : `${formatNum(result.rateLb, 2)} lb/1,000 ft²`;
    const lines = [
      `${copy.gross}: ${formatNum(result.gross)} ${areaUnit}`,
      `${copy.net}: ${formatNum(result.net)} ${areaUnit}`,
      `${copy.rateUsed}: ${rateLabel}`,
      `${copy.order}: ${formatNum(order, 2)} ${weightUnit}`,
      `${copy.bags}: ${result.bags}`,
      `${copy.leftover}: ${formatNum(leftover, 2)} ${weightUnit}`,
      `${copy.coverage}: ${formatNum(cover, 1)} ${areaUnit}`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) =>
    id === "metric" ? copy.metric : id === "overseed" ? copy.overseed : id === "patch" ? copy.patch : copy.bluegrass;
  const areaUnit = unit === "m" ? "m²" : "ft²";
  const weightUnit = unit === "m" ? "kg" : "lb";

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
            <select className={inputClass} value={unit} onChange={(e) => onUnit(e.target.value as Unit)}>
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
            <input className={inputClass} inputMode="decimal" value={knownArea} onChange={(e) => setKnownArea(e.target.value)} />
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.hardscape}
            <input className={inputClass} inputMode="decimal" value={hardscape} onChange={(e) => setHardscape(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.job}
            <select className={inputClass} value={job} onChange={(e) => setJob(e.target.value as Job)}>
              <option value="new">{copy.new}</option>
              <option value="overseed">{copy.overseedJob}</option>
              <option value="patch">{copy.patchJob}</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.species}
            <select className={inputClass} value={species} onChange={(e) => onSpecies(e.target.value as Species)}>
              <option value="fescue">{copy.fescue}</option>
              <option value="rye">{copy.rye}</option>
              <option value="bluegrass">{copy.bluegrassSp}</option>
              <option value="bermuda">{copy.bermuda}</option>
              <option value="custom">{copy.custom}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.rate}
            <input
              className={inputClass}
              inputMode="decimal"
              value={customRate}
              onChange={(e) => {
                setSpecies("custom");
                setCustomRate(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.bag}
            <input className={inputClass} inputMode="decimal" value={bag} onChange={(e) => setBag(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
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
              <dt className="text-muted-foreground">{copy.gross}</dt>
              <dd className="font-medium">{formatNum(result.gross)} {areaUnit}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.net}</dt>
              <dd className="font-medium">{formatNum(result.net)} {areaUnit}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.rateUsed}</dt>
              <dd className="font-medium">
                {unit === "m"
                  ? `${formatNum(result.rateLb * LB_PER_1000_TO_G_PER_M2, 1)} g/m²`
                  : `${formatNum(result.rateLb, 2)} lb/1,000 ft²`}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.order}</dt>
              <dd className="text-base font-semibold">
                {formatNum(unit === "m" ? result.orderKg : result.orderKg * LB_PER_KG)} {weightUnit}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.bags}</dt>
              <dd className="text-base font-semibold">{result.bags}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.leftover}</dt>
              <dd className="font-medium">
                {formatNum(unit === "m" ? result.leftoverKg : result.leftoverKg * LB_PER_KG)} {weightUnit}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{copy.coverage}</dt>
              <dd className="font-medium">
                {formatNum(unit === "m" ? result.coverM2 : result.coverM2 * SQFT_PER_M2, 1)} {areaUnit}
              </dd>
            </div>
            {result.cost != null ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
                <dt className="text-muted-foreground">{copy.cost}</dt>
                <dd className="font-medium">{formatNum(result.cost)}</dd>
              </div>
            ) : null}
          </dl>
        )}
        <p className="text-xs text-muted-foreground">{copy.note}</p>
      </section>
    </div>
  );
}
