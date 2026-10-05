import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";
type PresetId = "garden" | "seat" | "imperial" | "tall";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const FT_PER_M = 3.280839895;
const CUFT_PER_M3 = 35.314666721;

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
  height: string;
  blockLen: string;
  blockH: string;
  buried: string;
  capLen: string;
  waste: string;
  trenchW: string;
  trenchD: string;
};

const PRESETS: Preset[] = [
  { id: "garden", unit: "m", length: "6", height: "0.6", blockLen: "0.4", blockH: "0.2", buried: "1", capLen: "0.4", waste: "5", trenchW: "0.45", trenchD: "0.15" },
  { id: "seat", unit: "m", length: "4", height: "0.4", blockLen: "0.4", blockH: "0.2", buried: "1", capLen: "0.4", waste: "5", trenchW: "0.4", trenchD: "0.1" },
  { id: "imperial", unit: "ft", length: "20", height: "2", blockLen: "1", blockH: "0.333", buried: "1", capLen: "1", waste: "5", trenchW: "1.25", trenchD: "0.5" },
  { id: "tall", unit: "m", length: "8", height: "1", blockLen: "0.5", blockH: "0.2", buried: "1", capLen: "0.5", waste: "8", trenchW: "0.6", trenchD: "0.2" },
];

export function RetainingWallCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [length, setLength] = useState("6");
  const [height, setHeight] = useState("0.6");
  const [blockLen, setBlockLen] = useState("0.4");
  const [blockH, setBlockH] = useState("0.2");
  const [buried, setBuried] = useState("1");
  const [capLen, setCapLen] = useState("0.4");
  const [wastePct, setWastePct] = useState("5");
  const [trenchW, setTrenchW] = useState("0.45");
  const [trenchD, setTrenchD] = useState("0.15");
  const [blockPrice, setBlockPrice] = useState("");
  const [capPrice, setCapPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá bloques, tapas y grava de base para un muro de contención de jardín. Es una lista de materiales, no un cálculo estructural.",
        presets: "Presets",
        garden: "Jardín 6 m",
        seat: "Asiento 4 m",
        imperial: "20 ft · 12×4 in",
        tall: "Alto 8×1 m",
        units: "Unidades",
        meters: "Metros",
        feet: "Pies",
        length: unit === "m" ? "Largo del muro (m)" : "Largo del muro (ft)",
        height: unit === "m" ? "Altura vista (m)" : "Altura vista (ft)",
        blockLen: unit === "m" ? "Cara del bloque (m)" : "Cara del bloque (ft)",
        blockH: unit === "m" ? "Alto del bloque (m)" : "Alto del bloque (ft)",
        buried: "Hiladas enterradas",
        capLen: unit === "m" ? "Largo de la tapa (m)" : "Largo de la tapa (ft)",
        waste: "Desperdicio (%)",
        trenchW: unit === "m" ? "Ancho de zanja (m)" : "Ancho de zanja (ft)",
        trenchD: unit === "m" ? "Profundidad de grava (m)" : "Profundidad de grava (ft)",
        blockPrice: "Precio por bloque (opcional)",
        capPrice: "Precio por tapa (opcional)",
        result: "Resultado",
        courses: "Hiladas vistas",
        totalCourses: "Hiladas totales",
        perCourse: "Bloques por hilada",
        blocks: "Bloques a pedir",
        caps: "Tapas",
        gravel: "Grava de base",
        yards: "Yardas cúbicas",
        cost: "Material estimado",
        note: "Enterrar una hilada es el punto de partida habitual. Muros altos, con pendiente o con carga necesitan la ficha del fabricante y, si corresponde, un ingeniero.",
        empty: "Completá largo, altura, bloque, tapa, hiladas enterradas, desperdicio y zanja.",
        invalid: "Usá números válidos mayores que cero. Los decimales pueden llevar coma o punto.",
        buriedInvalid: "Las hiladas enterradas tienen que ser un entero de 0 a 3.",
        wasteInvalid: "El desperdicio tiene que estar entre 0% y 15%.",
        heightInvalid: unit === "m" ? "La altura vista tiene que ser de 20 cm a 2,4 m." : "La altura vista tiene que ser de 8 in a 8 ft.",
        tooBig: "El muro supera el límite de planificación (80 m / 260 ft o 24 hiladas).",
        priceInvalid: "El precio opcional tiene que ser cero o mayor.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
      }
    : {
        help: "Estimate blocks, caps, and base gravel for a garden retaining wall. This is a material list, not a structural design.",
        presets: "Presets",
        garden: "Garden 6 m",
        seat: "Seat wall 4 m",
        imperial: "20 ft · 12×4 in",
        tall: "Tall 8×1 m",
        units: "Units",
        meters: "Meters",
        feet: "Feet",
        length: unit === "m" ? "Wall length (m)" : "Wall length (ft)",
        height: unit === "m" ? "Exposed height (m)" : "Exposed height (ft)",
        blockLen: unit === "m" ? "Block face (m)" : "Block face (ft)",
        blockH: unit === "m" ? "Block height (m)" : "Block height (ft)",
        buried: "Buried courses",
        capLen: unit === "m" ? "Cap length (m)" : "Cap length (ft)",
        waste: "Waste (%)",
        trenchW: unit === "m" ? "Trench width (m)" : "Trench width (ft)",
        trenchD: unit === "m" ? "Gravel depth (m)" : "Gravel depth (ft)",
        blockPrice: "Price per block (optional)",
        capPrice: "Price per cap (optional)",
        result: "Result",
        courses: "Exposed courses",
        totalCourses: "Total courses",
        perCourse: "Blocks per course",
        blocks: "Blocks to order",
        caps: "Caps",
        gravel: "Base gravel",
        yards: "Cubic yards",
        cost: "Estimated material",
        note: "Burying one course is the usual starting point. Tall, sloped, or loaded walls need the manufacturer sheet and an engineer when required.",
        empty: "Enter length, height, block size, cap length, buried courses, waste, and trench.",
        invalid: "Use valid numbers greater than zero. Decimals can use a comma or a dot.",
        buriedInvalid: "Buried courses must be a whole number from 0 to 3.",
        wasteInvalid: "Waste must be between 0% and 15%.",
        heightInvalid: unit === "m" ? "Exposed height must be from 20 cm to 2.4 m." : "Exposed height must be from 8 in to 8 ft.",
        tooBig: "The wall is above the planning limit (80 m / 260 ft or 24 courses).",
        priceInvalid: "Optional prices must be zero or greater.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
      };

  const result = useMemo(() => {
    const len = parseNum(length);
    const h = parseNum(height);
    const face = parseNum(blockLen);
    const bh = parseNum(blockH);
    const bury = parseNum(buried);
    const cap = parseNum(capLen);
    const waste = parseNum(wastePct);
    const tw = parseNum(trenchW);
    const td = parseNum(trenchD);
    if ([len, h, face, bh, bury, cap, waste, tw, td].some((n) => n == null)) return { error: copy.empty };
    if ([len, h, face, bh, cap, tw, td].some((n) => Number.isNaN(n) || n! <= 0) || Number.isNaN(bury) || Number.isNaN(waste)) {
      return { error: copy.invalid };
    }
    if (!Number.isInteger(bury) || bury! < 0 || bury! > 3) return { error: copy.buriedInvalid };
    if (waste! < 0 || waste! > 15) return { error: copy.wasteInvalid };
    const minH = unit === "m" ? 0.2 : 8 / 12;
    const maxH = unit === "m" ? 2.4 : 8;
    if (h! < minH || h! > maxH) return { error: copy.heightInvalid };
    const maxLen = unit === "m" ? 80 : 260;
    if (len! > maxLen) return { error: copy.tooBig };
    const blockCost = parseNum(blockPrice);
    const capCost = parseNum(capPrice);
    if ((blockPrice.trim() !== "" && (blockCost == null || Number.isNaN(blockCost) || blockCost < 0)) || (capPrice.trim() !== "" && (capCost == null || Number.isNaN(capCost) || capCost < 0))) {
      return { error: copy.priceInvalid };
    }
    const exposed = Math.ceil(h! / bh! - 1e-9);
    const courses = exposed + bury!;
    if (exposed < 1 || courses > 24) return { error: copy.tooBig };
    const perCourse = Math.ceil(len! / face! - 1e-9);
    const factor = 1 + waste! / 100;
    const blocks = Math.ceil(perCourse * courses * factor - 1e-9);
    const caps = Math.ceil(Math.ceil(len! / cap! - 1e-9) * factor - 1e-9);
    const gravel = len! * tw! * td! * factor;
    const gravelM3 = unit === "m" ? gravel : gravel / CUFT_PER_M3;
    const cost = (blockPrice.trim() === "" ? 0 : blocks * (blockCost ?? 0)) + (capPrice.trim() === "" ? 0 : caps * (capCost ?? 0));
    const hasCost = blockPrice.trim() !== "" || capPrice.trim() !== "";
    return { exposed, courses, perCourse, blocks, caps, gravel, gravelM3, cost: hasCost ? cost : null };
  }, [length, height, blockLen, blockH, buried, capLen, wastePct, trenchW, trenchD, blockPrice, capPrice, unit, copy.empty, copy.invalid, copy.buriedInvalid, copy.wasteInvalid, copy.heightInvalid, copy.tooBig, copy.priceInvalid]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setLength(preset.length);
    setHeight(preset.height);
    setBlockLen(preset.blockLen);
    setBlockH(preset.blockH);
    setBuried(preset.buried);
    setCapLen(preset.capLen);
    setWastePct(preset.waste);
    setTrenchW(preset.trenchW);
    setTrenchD(preset.trenchD);
    setCopied(false);
  }

  function reset() {
    setBlockPrice("");
    setCapPrice("");
    applyPreset(PRESETS[0]);
  }

  function scaleField(value: string, set: (v: string) => void, scale: number) {
    const n = parseNum(value);
    if (n != null && !Number.isNaN(n) && n > 0) set(String(Math.round(n * scale * 1000) / 1000));
  }

  function onUnit(next: Unit) {
    if (next === unit) return;
    const scale = next === "ft" ? FT_PER_M : 1 / FT_PER_M;
    scaleField(length, setLength, scale);
    scaleField(height, setHeight, scale);
    scaleField(blockLen, setBlockLen, scale);
    scaleField(blockH, setBlockH, scale);
    scaleField(capLen, setCapLen, scale);
    scaleField(trenchW, setTrenchW, scale);
    scaleField(trenchD, setTrenchD, scale);
    setUnit(next);
  }

  async function copyResult() {
    if ("error" in result) return;
    const volUnit = unit === "m" ? "m³" : "ft³";
    const lines = [
      `${copy.courses}: ${result.exposed}`,
      `${copy.totalCourses}: ${result.courses}`,
      `${copy.perCourse}: ${result.perCourse}`,
      `${copy.blocks}: ${result.blocks}`,
      `${copy.caps}: ${result.caps}`,
      `${copy.gravel}: ${formatNum(result.gravel, 3)} ${volUnit}`,
      `${copy.yards}: ${formatNum((result.gravelM3 * CUFT_PER_M3) / 27, 2)} yd³`,
    ];
    if (result.cost != null) lines.push(`${copy.cost}: ${formatNum(result.cost)}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  }

  const presetLabel = (id: PresetId) => (id === "garden" ? copy.garden : id === "seat" ? copy.seat : id === "imperial" ? copy.imperial : copy.tall);
  const volUnit = unit === "m" ? "m³" : "ft³";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={buttonClass} onClick={() => applyPreset(preset)}>
                {presetLabel(preset.id)}
              </button>
            ))}
          </div>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.units}
          <select className={inputClass} value={unit} onChange={(e) => onUnit(e.target.value as Unit)}>
            <option value="m">{copy.meters}</option>
            <option value="ft">{copy.feet}</option>
          </select>
        </label>
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
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.blockLen}
            <input className={inputClass} inputMode="decimal" value={blockLen} onChange={(e) => setBlockLen(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.blockH}
            <input className={inputClass} inputMode="decimal" value={blockH} onChange={(e) => setBlockH(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.buried}
            <input className={inputClass} inputMode="numeric" value={buried} onChange={(e) => setBuried(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.capLen}
            <input className={inputClass} inputMode="decimal" value={capLen} onChange={(e) => setCapLen(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.trenchW}
            <input className={inputClass} inputMode="decimal" value={trenchW} onChange={(e) => setTrenchW(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.trenchD}
            <input className={inputClass} inputMode="decimal" value={trenchD} onChange={(e) => setTrenchD(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.blockPrice}
            <input className={inputClass} inputMode="decimal" value={blockPrice} onChange={(e) => setBlockPrice(e.target.value)} placeholder="0" />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.capPrice}
            <input className={inputClass} inputMode="decimal" value={capPrice} onChange={(e) => setCapPrice(e.target.value)} placeholder="0" />
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
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.courses}</dt>
              <dd className="font-medium">{result.exposed}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.totalCourses}</dt>
              <dd className="font-medium">{result.courses}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.perCourse}</dt>
              <dd className="font-medium">{result.perCourse}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.blocks}</dt>
              <dd className="text-lg font-semibold">{result.blocks}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.caps}</dt>
              <dd className="font-medium">{result.caps}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.gravel}</dt>
              <dd className="font-medium">{formatNum(result.gravel, 3)} {volUnit}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b pb-2">
              <dt className="text-muted-foreground">{copy.yards}</dt>
              <dd className="font-medium">{formatNum((result.gravelM3 * CUFT_PER_M3) / 27, 2)} yd³</dd>
            </div>
            {result.cost != null ? (
              <div className="flex items-baseline justify-between gap-3">
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
