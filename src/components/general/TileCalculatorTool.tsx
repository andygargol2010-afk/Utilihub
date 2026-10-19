import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TileCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [roomL, setRoomL] = useState("4");
  const [roomW, setRoomW] = useState("3");
  const [tileL, setTileL] = useState("0.3");
  const [tileW, setTileW] = useState("0.3");
  const [waste, setWaste] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rl = parseFloat(roomL);
    const rw = parseFloat(roomW);
    const tl = parseFloat(tileL);
    const tw = parseFloat(tileW);
    const w = parseFloat(waste);
    if ([rl, rw, tl, tw, w].some(isNaN) || rl <= 0 || rw <= 0 || tl <= 0 || tw <= 0 || w < 0 || w > 100) return null;
    const roomArea = rl * rw;
    const tileArea = tl * tw;
    if (tileArea === 0) return null;
    const baseTiles = roomArea / tileArea;
    const withWaste = baseTiles * (1 + w / 100);
    return {
      roomArea: Math.round(roomArea * 100) / 100,
      tiles: Math.ceil(withWaste),
      base: Math.round(baseTiles * 10) / 10,
    };
  }, [roomL, roomW, tileL, tileW, waste]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Azulejos necesarios: ${result.tiles} (área ${result.roomArea} m²)`
      : `Tiles needed: ${result.tiles} (area ${result.roomArea} m²)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRoomL("4");
    setRoomW("3");
    setTileL("0.3");
    setTileW("0.3");
    setWaste("10");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Azulejos necesarios" : "Tiles needed"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.tiles}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
        {result && (
          <p className="text-sm text-muted-foreground">
            {es ? `Área habitación: ${result.roomArea} m² · Base: ${result.base}` : `Room area: ${result.roomArea} m² · Base: ${result.base}`}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Largo habitación (m)" : "Room length (m)"}</span>
          <input type="number" step="any" min="0" value={roomL} onChange={(e) => setRoomL(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ancho habitación (m)" : "Room width (m)"}</span>
          <input type="number" step="any" min="0" value={roomW} onChange={(e) => setRoomW(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Largo azulejo (m)" : "Tile length (m)"}</span>
          <input type="number" step="any" min="0" value={tileL} onChange={(e) => setTileL(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ancho azulejo (m)" : "Tile width (m)"}</span>
          <input type="number" step="any" min="0" value={tileW} onChange={(e) => setTileW(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm sm:col-span-2">
          <span className="font-medium">{es ? "Desperdicio (%)" : "Waste (%)"}</span>
          <input type="number" step="any" min="0" max="100" value={waste} onChange={(e) => setWaste(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Habitación 4×3 m, azulejo 0.3×0.3 m, 10% → 147 azulejos" : "Room 4×3 m, tile 0.3×0.3 m, 10% → 147 tiles"}</p>
        <p>{es ? "Habitación 5×4 m, azulejo 0.4×0.4 m, 5% → 132 azulejos" : "Room 5×4 m, tile 0.4×0.4 m, 5% → 132 tiles"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
