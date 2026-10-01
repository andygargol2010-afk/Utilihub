import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

export function TileCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("4");
  const [widthM, setWidthM] = useState("3.2");
  const [tileCmA, setTileCmA] = useState("60");
  const [tileCmB, setTileCmB] = useState("60");
  const [groutMm, setGroutMm] = useState("2");
  const [wastePct, setWastePct] = useState("10");
  const [openings, setOpenings] = useState("0");
  const [perBox, setPerBox] = useState("4");

  const copy = es
    ? {
        length: "Largo del ambiente (m)",
        width: "Ancho del ambiente (m)",
        tileA: "Lado A de la baldosa (cm)",
        tileB: "Lado B de la baldosa (cm)",
        grout: "Junta (mm)",
        waste: "Desperdicio (%)",
        openings: "Huecos a restar (m²)",
        perBox: "Baldosas por caja",
        result: "Resultado",
        net: "Superficie neta",
        tiles: "Baldosas a comprar",
        boxes: "Cajas",
        each: "Cobertura por baldosa (con junta)",
        note: "Redondeado hacia arriba. La junta se suma al tamaño útil de cada pieza.",
      }
    : {
        length: "Room length (m)",
        width: "Room width (m)",
        tileA: "Tile side A (cm)",
        tileB: "Tile side B (cm)",
        grout: "Grout joint (mm)",
        waste: "Waste (%)",
        openings: "Openings to subtract (m²)",
        perBox: "Tiles per box",
        result: "Result",
        net: "Net area",
        tiles: "Tiles to buy",
        boxes: "Boxes",
        each: "Coverage per tile (with grout)",
        note: "Rounded up. Grout is added to the effective size of each tile.",
      };

  const result = useMemo(() => {
    const length = parseNum(lengthM);
    const width = parseNum(widthM);
    const sideA = parseNum(tileCmA);
    const sideB = parseNum(tileCmB);
    const grout = parseNum(groutMm);
    const waste = parseNum(wastePct);
    const holes = parseNum(openings);
    const box = parseNum(perBox);

    if ([length, width, sideA, sideB, grout, waste, holes, box].some((n) => n === null || Number.isNaN(n))) {
      return { error: es ? "Completá todos los campos con números válidos." : "Fill every field with a valid number." };
    }
    if (length! <= 0 || width! <= 0 || sideA! <= 0 || sideB! <= 0) {
      return { error: es ? "El ambiente y la baldosa tienen que medir más de cero." : "Room and tile sizes must be greater than zero." };
    }
    if (grout! < 0 || grout! > 30) {
      return { error: es ? "La junta debe estar entre 0 y 30 mm." : "Grout must be between 0 and 30 mm." };
    }
    if (waste! < 0 || waste! > 40) {
      return { error: es ? "El desperdicio debe estar entre 0 y 40%." : "Waste must be between 0 and 40%." };
    }
    if (holes! < 0) {
      return { error: es ? "Los huecos no pueden ser negativos." : "Openings cannot be negative." };
    }
    if (box! <= 0 || !Number.isInteger(box)) {
      return { error: es ? "Las baldosas por caja tienen que ser un entero mayor que 0." : "Tiles per box must be a whole number greater than 0." };
    }

    const gross = length! * width!;
    const net = gross - holes!;
    if (net <= 0) {
      return { error: es ? "Los huecos no pueden cubrir toda la superficie." : "Openings cannot cover the whole area." };
    }
    const groutM = grout! / 1000;
    const tileArea = (sideA! / 100 + groutM) * (sideB! / 100 + groutM);
    if (tileArea <= 0) {
      return { error: es ? "El tamaño de la baldosa no es válido." : "Tile size is not valid." };
    }
    const tiles = Math.ceil((net / tileArea) * (1 + waste! / 100));
    const boxes = Math.ceil(tiles / box!);
    return { net, tiles, boxes, tileArea, extra: boxes * box! - tiles };
  }, [lengthM, widthM, tileCmA, tileCmB, groutMm, wastePct, openings, perBox, es]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <label className="grid gap-1 text-sm">
          {copy.length}
          <input className={inputClass} inputMode="decimal" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          {copy.width}
          <input className={inputClass} inputMode="decimal" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            {copy.tileA}
            <input className={inputClass} inputMode="decimal" value={tileCmA} onChange={(e) => setTileCmA(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.tileB}
            <input className={inputClass} inputMode="decimal" value={tileCmB} onChange={(e) => setTileCmB(e.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            {copy.grout}
            <input className={inputClass} inputMode="decimal" value={groutMm} onChange={(e) => setGroutMm(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.openings}
          <input className={inputClass} inputMode="decimal" value={openings} onChange={(e) => setOpenings(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          {copy.perBox}
          <input className={inputClass} inputMode="numeric" value={perBox} onChange={(e) => setPerBox(e.target.value)} />
        </label>
      </form>
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {"error" in result ? (
          <p className="mt-3 text-sm text-destructive">{result.error}</p>
        ) : (
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt>{copy.net}</dt>
              <dd className="font-medium">{formatNum(result.net)} m²</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{copy.tiles}</dt>
              <dd className="font-medium">{result.tiles}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{copy.boxes}</dt>
              <dd className="font-medium">{result.boxes}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{copy.each}</dt>
              <dd className="font-medium">{formatNum(result.tileArea, 4)} m²</dd>
            </div>
            <p className="pt-2 text-muted-foreground">{copy.note}</p>
          </dl>
        )}
      </section>
    </div>
  );
}
