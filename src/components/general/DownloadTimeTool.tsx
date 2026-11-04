import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./DownloadTimeTool.part1";
import { SIZE_UNITS, SPEED_UNITS, formatTime, fieldClass, primaryBtn, buttonClass } from "./DownloadTimeTool.part2";

export function DownloadTimeTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [size, setSize] = useState(100);
  const [sizeUnit, setSizeUnit] = useState("MB");
  const [speed, setSpeed] = useState(50);
  const [speedUnit, setSpeedUnit] = useState("Mbps");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const sizeFactor = SIZE_UNITS.find((u) => u.value === sizeUnit)?.factor ?? 1;
    const speedFactor = SPEED_UNITS.find((u) => u.value === speedUnit)?.factor ?? 1;
    const bytes = size * sizeFactor;
    const bitsPerSecond = speed * speedFactor;
    if (bitsPerSecond <= 0) return null;
    const seconds = (bytes * 8) / bitsPerSecond;
    return { seconds, formatted: formatTime(seconds, es) };
  }, [size, sizeUnit, speed, speedUnit, es]);

  function copy() {
    if (!result) return;
    const text = es
      ? `Tiempo estimado: ${result.formatted} (tamaño ${size} ${sizeUnit}, velocidad ${speed} ${speedUnit})`
      : `Estimated time: ${result.formatted} (size ${size} ${sizeUnit}, speed ${speed} ${speedUnit})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function reset() {
    setSize(100);
    setSizeUnit("MB");
    setSpeed(50);
    setSpeedUnit("Mbps");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Tamaño del archivo" : "File size"}</span>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              step="any"
              value={size}
              onChange={(e) => setSize(Math.max(0, Number(e.target.value) || 0))}
              className={fieldClass}
            />
            <select value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value)} className={fieldClass}>
              {SIZE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.value}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Velocidad de conexión" : "Connection speed"}</span>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              step="any"
              value={speed}
              onChange={(e) => setSpeed(Math.max(0, Number(e.target.value) || 0))}
              className={fieldClass}
            />
            <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)} className={fieldClass}>
              {SPEED_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.value}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
      {result && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium">{es ? "Tiempo estimado de descarga" : "Estimated download time"}</p>
          <p className="text-2xl font-semibold mt-1">{result.formatted}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {es ? "Basado en el tamaño y la velocidad ingresados." : "Based on the entered size and speed."}
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" className={primaryBtn} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "La velocidad real puede variar por overhead de protocolo, latencia y congestión. Use este cálculo como estimación."
          : "Actual speed may vary due to protocol overhead, latency, and congestion. Use this as an estimate."}
      </p>
    </div>
  );
}
