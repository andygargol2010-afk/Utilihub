import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-2 text-sm";
const buttonClass = "h-10 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const primaryBtn = `${buttonClass} bg-primary text-primary-foreground`;

const SIZE_UNITS = [
  { value: "B", factor: 1 },
  { value: "KB", factor: 1024 },
  { value: "MB", factor: 1024 * 1024 },
  { value: "GB", factor: 1024 * 1024 * 1024 },
  { value: "TB", factor: 1024 * 1024 * 1024 * 1024 },
];

const SPEED_UNITS = [
  { value: "bps", factor: 1 },
  { value: "Kbps", factor: 1000 },
  { value: "Mbps", factor: 1000 * 1000 },
  { value: "Gbps", factor: 1000 * 1000 * 1000 },
  { value: "KB/s", factor: 1024 * 8 },
  { value: "MB/s", factor: 1024 * 1024 * 8 },
];

function formatTime(seconds: number, es: boolean): string {
  if (!isFinite(seconds) || seconds < 0) return es ? "Inválido" : "Invalid";
  if (seconds < 1) return es ? "Menos de 1 segundo" : "Less than 1 second";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d) parts.push(`${d} ${es ? (d === 1 ? "día" : "días") : d === 1 ? "day" : "days"}`);
  if (h) parts.push(`${h} ${es ? (h === 1 ? "hora" : "horas") : h === 1 ? "hour" : "hours"}`);
  if (m) parts.push(`${m} ${es ? (m === 1 ? "minuto" : "minutos") : m === 1 ? "minute" : "minutes"}`);
  if (s || parts.length === 0) parts.push(`${s} ${es ? (s === 1 ? "segundo" : "segundos") : s === 1 ? "second" : "seconds"}`);
  return parts.join(es ? ", " : ", ");
}

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
