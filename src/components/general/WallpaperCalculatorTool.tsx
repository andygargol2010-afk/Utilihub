import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

type Preset = {
  id: string;
  length: string;
  height: string;
  openings: string;
  widthCm: string;
  rollM: string;
  repeatCm: string;
  waste: string;
};

export function WallpaperCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("4.2");
  const [heightM, setHeightM] = useState("2.45");
  const [openings, setOpenings] = useState("1.6");
  const [widthCm, setWidthCm] = useState("53");
  const [rollM, setRollM] = useState("10.05");
  const [repeatCm, setRepeatCm] = useState("0");
  const [wastePct, setWastePct] = useState("10");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Calcula tiras y rollos de papel pintado a partir del largo de pared, la altura, el tamaño del rollo y el rapport. Los huecos se restan como superficie.",
        length: "Largo total de pared (m)",
        height: "Altura de pared (m)",
        openings: "Huecos a restar (m²)",
        width: "Ancho útil del rollo (cm)",
        roll: "Largo del rollo (m)",
        repeat: "Rapport / repetición (cm)",
        waste: "Desperdicio (%)",
        result: "Resultado",
        net: "Superficie neta",
        strips: "Tiras a cortar",
        perRoll: "Tiras por rollo",
        rolls: "Rollos a comprar",
        leftover: "Sobrante estimado",
        note: "Redondeado hacia arriba. El rapport se suma a cada tira para empatar el dibujo.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
        presets: "Presets",
        euro: "Europeo 53×10,05",
        wide: "Ancho 70×10",
        pattern: "Con dibujo 32 cm",
        feature: "Pared foco 3,2 m",
        empty: "Completá largo, altura y medidas del rollo.",
        invalid: "Usá números válidos. El largo, la altura y el rollo deben ser mayores que 0.",
        short: "El rollo es más corto que la altura más el rapport. Elegí un rollo más largo o bajá el rapport.",
        noWall: "La superficie neta quedó en 0. Bajá los huecos o subí el largo de pared.",
      }
    : {
        help: "Estimate wallpaper strips and rolls from wall length, height, roll size, and pattern repeat. Openings are subtracted as area.",
        length: "Total wall length (m)",
        height: "Wall height (m)",
        openings: "Openings to subtract (m²)",
        width: "Usable roll width (cm)",
        roll: "Roll length (m)",
        repeat: "Pattern repeat (cm)",
        waste: "Waste (%)",
        result: "Result",
        net: "Net area",
        strips: "Strips to cut",
        perRoll: "Strips per roll",
        rolls: "Rolls to buy",
        leftover: "Estimated leftover",
        note: "Rounded up. Pattern repeat is added to every strip so the motif can match.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
        presets: "Presets",
        euro: "Euro 53×10.05",
        wide: "Wide 70×10",
        pattern: "Pattern 32 cm",
        feature: "Feature wall 3.2 m",
        empty: "Enter wall length, height, and roll size.",
        invalid: "Use valid numbers. Length, height, and roll size must be greater than 0.",
        short: "The roll is shorter than the height plus pattern repeat. Use a longer roll or a smaller repeat.",
        noWall: "Net area is 0. Reduce openings or increase wall length.",
      };

  const presets: Preset[] = [
    { id: "euro", length: "4.2", height: "2.45", openings: "1.6", widthCm: "53", rollM: "10.05", repeatCm: "0", waste: "10" },
    { id: "wide", length: "4.2", height: "2.45", openings: "1.6", widthCm: "70", rollM: "10", repeatCm: "0", waste: "10" },
    { id: "pattern", length: "4.2", height: "2.45", openings: "1.6", widthCm: "53", rollM: "10.05", repeatCm: "32", waste: "15" },
    { id: "feature", length: "3.2", height: "2.45", openings: "0", widthCm: "53", rollM: "10.05", repeatCm: "0", waste: "10" },
  ];

  function applyPreset(preset: Preset) {
    setLengthM(preset.length);
    setHeightM(preset.height);
    setOpenings(preset.openings);
    setWidthCm(preset.widthCm);
    setRollM(preset.rollM);
    setRepeatCm(preset.repeatCm);
    setWastePct(preset.waste);
    setCopied(false);
  }

  function reset() {
    applyPreset(presets[0]);
  }

  const result = useMemo(() => {
    const length = parseNum(lengthM);
    const height = parseNum(heightM);
    const holes = parseNum(openings);
    const width = parseNum(widthCm);
    const roll = parseNum(rollM);
    const repeat = parseNum(repeatCm);
    const waste = parseNum(wastePct);
    if (length == null || height == null || width == null || roll == null) return { error: copy.empty };
    if ([length, height, holes, width, roll, repeat, waste].some((n) => n != null && Number.isNaN(n))) {
      return { error: copy.invalid };
    }
    if (length <= 0 || height <= 0 || width <= 0 || roll <= 0) return { error: copy.invalid };
    if ((holes ?? 0) < 0 || (repeat ?? 0) < 0 || (waste ?? 0) < 0 || (waste ?? 0) > 100) return { error: copy.invalid };

    const openingArea = holes ?? 0;
    const gross = length * height;
    const net = gross - openingArea;
    if (net <= 0) return { error: copy.noWall };

    const widthM = width / 100;
    const repeatM = (repeat ?? 0) / 100;
    const effectiveLength = Math.max(0, length - openingArea / height);
    if (effectiveLength <= 0) return { error: copy.noWall };
    const strips = Math.ceil(effectiveLength / widthM - 1e-9);
    const drop = height + repeatM;
    if (drop > roll + 1e-9) return { error: copy.short };
    const stripsPerRoll = Math.floor(roll / drop + 1e-9);
    if (stripsPerRoll < 1) return { error: copy.short };
    const wasteStrips = Math.ceil(strips * ((waste ?? 0) / 100) - 1e-9);
    const totalStrips = strips + Math.max(0, wasteStrips);
    const rolls = Math.ceil(totalStrips / stripsPerRoll);
    const leftover = rolls * roll - totalStrips * drop;
    return { net, strips: totalStrips, baseStrips: strips, stripsPerRoll, rolls, leftover, drop };
  }, [lengthM, heightM, openings, widthCm, rollM, repeatCm, wastePct, copy.empty, copy.invalid, copy.short, copy.noWall]);

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Papel pintado: ${result.rolls} rollos, ${result.strips} tiras, ${formatNum(result.net)} m² netos, sobrante ${formatNum(result.leftover)} m.`
      : `Wallpaper: ${result.rolls} rolls, ${result.strips} strips, ${formatNum(result.net)} m² net, leftover ${formatNum(result.leftover)} m.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "euro" ? copy.euro : id === "wide" ? copy.wide : id === "pattern" ? copy.pattern : copy.feature;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {presets.map((preset) => (
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
            {copy.height}
            <input className={inputClass} inputMode="decimal" value={heightM} onChange={(e) => setHeightM(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.openings}
          <input className={inputClass} inputMode="decimal" value={openings} onChange={(e) => setOpenings(e.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.width}
            <input className={inputClass} inputMode="decimal" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.roll}
            <input className={inputClass} inputMode="decimal" value={rollM} onChange={(e) => setRollM(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.repeat}
            <input className={inputClass} inputMode="decimal" value={repeatCm} onChange={(e) => setRepeatCm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
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
                <dt className="text-muted-foreground">{copy.net}</dt>
                <dd className="font-medium">{formatNum(result.net)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.strips}</dt>
                <dd className="font-medium">{result.strips}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.perRoll}</dt>
                <dd className="font-medium">{result.stripsPerRoll}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.rolls}</dt>
                <dd className="text-base font-semibold">{result.rolls}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.leftover}</dt>
                <dd className="font-medium">{formatNum(Math.max(0, result.leftover))} m</dd>
              </div>
              <p className="pt-2 text-muted-foreground">{copy.note}</p>
            </dl>
            <button type="button" className={`${buttonClass} mt-4 w-full`} onClick={copyResult}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
