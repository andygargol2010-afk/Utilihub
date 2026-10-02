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
  ceiling: boolean;
  depth: string;
  widthCm: string;
  lengthCm: string;
  layers: string;
  waste: string;
};

export function DrywallCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("8.4");
  const [heightM, setHeightM] = useState("2.5");
  const [openings, setOpenings] = useState("1.8");
  const [ceiling, setCeiling] = useState(false);
  const [depthM, setDepthM] = useState("3.2");
  const [widthCm, setWidthCm] = useState("120");
  const [lengthCm, setLengthCm] = useState("240");
  const [layers, setLayers] = useState("1");
  const [wastePct, setWastePct] = useState("10");
  const [screwsPerM2, setScrewsPerM2] = useState("11");
  const [mudKg, setMudKg] = useState("0.4");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estima placas de pladur, tornillos, pasta de juntas y cinta a partir del largo de pared, la altura, los huecos y un techo opcional.",
        length: "Largo total de pared (m)",
        height: "Altura de pared (m)",
        openings: "Huecos a restar (m²)",
        ceiling: "Incluir techo",
        depth: "Fondo de la habitación (m)",
        width: "Ancho de placa (cm)",
        sheet: "Largo de placa (cm)",
        layers: "Capas",
        waste: "Desperdicio (%)",
        screws: "Tornillos por m²",
        mud: "Pasta de juntas (kg/m²)",
        result: "Resultado",
        net: "Superficie neta",
        board: "Superficie de placa",
        sheets: "Placas a comprar",
        screwCount: "Tornillos",
        compound: "Pasta de juntas",
        tape: "Cinta de juntas",
        note: "Redondeado hacia arriba. Los huecos restan superficie, no una placa entera. La cinta no incluye guardavivos.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
        presets: "Presets",
        room: "Habitación 1,2×2,4",
        ceilingPreset: "Con techo",
        double: "Doble capa",
        us: "Placa 4×8 ft",
        empty: "Completá largo, altura y medida de la placa.",
        invalid: "Usá números válidos. Largo, altura y placa deben ser mayores a 0. El desperdicio va de 0 a 80.",
        noWall: "La superficie neta quedó en cero o negativa. Bajá los huecos o revisá las medidas.",
      }
    : {
        help: "Estimate drywall sheets, screws, joint compound, and tape from wall length, height, openings, and an optional ceiling.",
        length: "Total wall length (m)",
        height: "Wall height (m)",
        openings: "Openings to subtract (m²)",
        ceiling: "Include ceiling",
        depth: "Room depth (m)",
        width: "Sheet width (cm)",
        sheet: "Sheet length (cm)",
        layers: "Layers",
        waste: "Waste (%)",
        screws: "Screws per m²",
        mud: "Joint compound (kg/m²)",
        result: "Result",
        net: "Net area",
        board: "Board area",
        sheets: "Sheets to buy",
        screwCount: "Screws",
        compound: "Joint compound",
        tape: "Joint tape",
        note: "Rounded up. Openings reduce area, not a full sheet. Tape does not include corner bead.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
        presets: "Presets",
        room: "Room 1.2×2.4",
        ceilingPreset: "With ceiling",
        double: "Double layer",
        us: "4×8 ft sheet",
        empty: "Enter wall length, height, and sheet size.",
        invalid: "Use valid numbers. Length, height, and sheet size must be greater than 0. Waste must be 0–80.",
        noWall: "Net area is zero or negative. Lower the openings or check the measurements.",
      };

  const presets: Preset[] = [
    { id: "room", length: "8.4", height: "2.5", openings: "1.8", ceiling: false, depth: "3.2", widthCm: "120", lengthCm: "240", layers: "1", waste: "10" },
    { id: "ceiling", length: "8.4", height: "2.5", openings: "1.8", ceiling: true, depth: "3.2", widthCm: "120", lengthCm: "240", layers: "1", waste: "10" },
    { id: "double", length: "8.4", height: "2.5", openings: "1.8", ceiling: false, depth: "3.2", widthCm: "120", lengthCm: "240", layers: "2", waste: "12" },
    { id: "us", length: "8.4", height: "2.44", openings: "1.8", ceiling: false, depth: "3.2", widthCm: "121.9", lengthCm: "243.8", layers: "1", waste: "10" },
  ];

  function presetLabel(id: string) {
    if (id === "room") return copy.room;
    if (id === "ceiling") return copy.ceilingPreset;
    if (id === "double") return copy.double;
    return copy.us;
  }

  function applyPreset(preset: Preset) {
    setLengthM(preset.length);
    setHeightM(preset.height);
    setOpenings(preset.openings);
    setCeiling(preset.ceiling);
    setDepthM(preset.depth);
    setWidthCm(preset.widthCm);
    setLengthCm(preset.lengthCm);
    setLayers(preset.layers);
    setWastePct(preset.waste);
    setScrewsPerM2("11");
    setMudKg("0.4");
    setCopied(false);
  }

  function reset() {
    applyPreset(presets[0]);
  }

  const result = useMemo(() => {
    const length = parseNum(lengthM);
    const height = parseNum(heightM);
    const holes = parseNum(openings);
    const depth = parseNum(depthM);
    const width = parseNum(widthCm);
    const sheetLen = parseNum(lengthCm);
    const layerCount = parseNum(layers);
    const waste = parseNum(wastePct);
    const screws = parseNum(screwsPerM2);
    const mud = parseNum(mudKg);
    if (length == null || height == null || width == null || sheetLen == null) return { error: copy.empty };
    if ([length, height, holes, depth, width, sheetLen, layerCount, waste, screws, mud].some((n) => n != null && Number.isNaN(n))) {
      return { error: copy.invalid };
    }
    if (length <= 0 || height <= 0 || width <= 0 || sheetLen <= 0) return { error: copy.invalid };
    if ((holes ?? 0) < 0 || (waste ?? 0) < 0 || (waste ?? 0) > 80) return { error: copy.invalid };
    if ((layerCount ?? 1) < 1 || (layerCount ?? 1) > 3) return { error: copy.invalid };
    if (ceiling && ((depth ?? 0) <= 0)) return { error: copy.invalid };
    if ((screws ?? 0) < 0 || (screws ?? 0) > 40 || (mud ?? 0) < 0 || (mud ?? 0) > 5) return { error: copy.invalid };

    const wall = length * height - (holes ?? 0);
    const ceilingArea = ceiling ? length * (depth ?? 0) : 0;
    const net = wall + ceilingArea;
    if (net <= 0) return { error: copy.noWall };

    const layersN = layerCount ?? 1;
    const wasteFactor = 1 + (waste ?? 0) / 100;
    const sheetArea = (width / 100) * (sheetLen / 100);
    const boardArea = net * layersN;
    const sheets = Math.ceil((boardArea * wasteFactor) / sheetArea - 1e-9);
    const screwCount = Math.ceil(boardArea * (screws ?? 0) - 1e-9);
    const compound = boardArea * (mud ?? 0);
    const tape = (boardArea / (width / 100)) * 1.05;

    return { net, boardArea, sheets, screwCount, compound, tape, sheetArea };
  }, [lengthM, heightM, openings, ceiling, depthM, widthCm, lengthCm, layers, wastePct, screwsPerM2, mudKg, copy.empty, copy.invalid, copy.noWall]);

  async function copyResult() {
    if ("error" in result) return;
    const text = es
      ? `Pladur: ${result.sheets} placas · ${formatNum(result.net)} m² netos · ${result.screwCount} tornillos · ${formatNum(result.compound)} kg pasta · ${formatNum(result.tape)} m cinta`
      : `Drywall: ${result.sheets} sheets · ${formatNum(result.net)} m² net · ${result.screwCount} screws · ${formatNum(result.compound)} kg mud · ${formatNum(result.tape)} m tape`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

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
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4" checked={ceiling} onChange={(e) => setCeiling(e.target.checked)} />
          {copy.ceiling}
        </label>
        {ceiling ? (
          <label className="grid gap-1 text-sm">
            {copy.depth}
            <input className={inputClass} inputMode="decimal" value={depthM} onChange={(e) => setDepthM(e.target.value)} />
          </label>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.width}
            <input className={inputClass} inputMode="decimal" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.sheet}
            <input className={inputClass} inputMode="decimal" value={lengthCm} onChange={(e) => setLengthCm(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.layers}
            <input className={inputClass} inputMode="numeric" value={layers} onChange={(e) => setLayers(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.screws}
            <input className={inputClass} inputMode="decimal" value={screwsPerM2} onChange={(e) => setScrewsPerM2(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.mud}
            <input className={inputClass} inputMode="decimal" value={mudKg} onChange={(e) => setMudKg(e.target.value)} />
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
                <dt className="text-muted-foreground">{copy.board}</dt>
                <dd className="font-medium">{formatNum(result.boardArea)} m²</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.sheets}</dt>
                <dd className="text-base font-semibold">{result.sheets}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.screwCount}</dt>
                <dd className="font-medium">{formatNum(result.screwCount, 0)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.compound}</dt>
                <dd className="font-medium">{formatNum(result.compound)} kg</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.tape}</dt>
                <dd className="font-medium">{formatNum(result.tape)} m</dd>
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
