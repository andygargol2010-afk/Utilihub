import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./GreatCircleDistanceCalculatorTool.part1";
import { haversine, fieldClass, buttonClass } from "./GreatCircleDistanceCalculatorTool.part2";

export function GreatCircleDistanceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lat1, setLat1] = useState("40.7128");
  const [lon1, setLon1] = useState("-74.0060");
  const [lat2, setLat2] = useState("51.5074");
  const [lon2, setLon2] = useState("-0.1278");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const la1 = parseFloat(lat1);
    const lo1 = parseFloat(lon1);
    const la2 = parseFloat(lat2);
    const lo2 = parseFloat(lon2);
    const r = haversine(la1, lo1, la2, lo2);
    if (typeof r === "object") {
      const map: Record<string, string> = {
        lat1: es ? "Latitud 1 debe estar entre -90 y 90" : "Latitude 1 must be between -90 and 90",
        lon1: es ? "Longitud 1 debe estar entre -180 y 180" : "Longitude 1 must be between -180 and 180",
        lat2: es ? "Latitud 2 debe estar entre -90 y 90" : "Latitude 2 must be between -90 and 90",
        lon2: es ? "Longitud 2 debe estar entre -180 y 180" : "Longitude 2 must be between -180 and 180",
      };
      return { error: map[r.error] || (es ? "Valores inválidos" : "Invalid values") };
    }
    const miles = r * 0.621371;
    return { km: r, miles };
  }, [lat1, lon1, lat2, lon2, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = result.km.toFixed(1) + " km";
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLat1("40.7128");
    setLon1("-74.0060");
    setLat2("51.5074");
    setLon2("-0.1278");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.km.toFixed(1)} km</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Aprox. ${result.miles.toFixed(1)} millas` : `Approx. ${result.miles.toFixed(1)} miles`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa coordenadas" : "Enter coordinates"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Latitud 1" : "Latitude 1"}</span>
          <input type="number" step="any" value={lat1} onChange={(e) => setLat1(e.target.value)} className={fieldClass} placeholder="40.7128" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Longitud 1" : "Longitude 1"}</span>
          <input type="number" step="any" value={lon1} onChange={(e) => setLon1(e.target.value)} className={fieldClass} placeholder="-74.0060" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Latitud 2" : "Latitude 2"}</span>
          <input type="number" step="any" value={lat2} onChange={(e) => setLat2(e.target.value)} className={fieldClass} placeholder="51.5074" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Longitud 2" : "Longitude 2"}</span>
          <input type="number" step="any" value={lon2} onChange={(e) => setLon2(e.target.value)} className={fieldClass} placeholder="-0.1278" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Fórmula de Haversine con radio medio terrestre 6371 km. Latitudes -90 a 90, longitudes -180 a 180."
          : "Haversine formula with mean Earth radius 6371 km. Latitudes -90 to 90, longitudes -180 to 180."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>NY (40.7128, -74.0060) → Londres (51.5074, -0.1278) ≈ 5570 km</p>
        <p>Madrid (40.4168, -3.7038) → Buenos Aires (-34.6037, -58.3816) ≈ 10014 km</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-tiempo-vuelo" : "/tools/flight-time-calculator"} className="underline text-primary">
            {es ? "Tiempo de vuelo" : "Flight time"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-velocidad-media" : "/tools/average-speed-calculator"} className="underline text-primary">
            {es ? "Velocidad media" : "Average speed"}
          </a>
        </p>
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
