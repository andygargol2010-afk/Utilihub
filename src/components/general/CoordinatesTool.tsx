import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { fromDecimal, fromDms } from "@/lib/general/coordinates";

type Locale = "en" | "es";
type Mode = "decimal" | "dms";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const MADRID = { lat: "40.4168", lon: "-3.7038" };
const BARCELONA = {
  latDeg: "41",
  latMin: "24",
  latSec: "12.20",
  latH: "N" as const,
  lonDeg: "2",
  lonMin: "10",
  lonSec: "26.50",
  lonH: "E" as const,
};

export function CoordinatesTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<Mode>("decimal");
  const [lat, setLat] = useState(MADRID.lat);
  const [lon, setLon] = useState(MADRID.lon);
  const [latDeg, setLatDeg] = useState(BARCELONA.latDeg);
  const [latMin, setLatMin] = useState(BARCELONA.latMin);
  const [latSec, setLatSec] = useState(BARCELONA.latSec);
  const [latH, setLatH] = useState<"N" | "S">(BARCELONA.latH);
  const [lonDeg, setLonDeg] = useState(BARCELONA.lonDeg);
  const [lonMin, setLonMin] = useState(BARCELONA.lonMin);
  const [lonSec, setLonSec] = useState(BARCELONA.lonSec);
  const [lonH, setLonH] = useState<"E" | "W">(BARCELONA.lonH);
  const [copied, setCopied] = useState(false);

  const decimal = useMemo(() => fromDecimal(lat, lon), [lat, lon]);
  const dms = useMemo(
    () => fromDms(
      { degrees: latDeg, minutes: latMin, seconds: latSec, hemisphere: latH },
      { degrees: lonDeg, minutes: lonMin, seconds: lonSec, hemisphere: lonH },
    ),
    [latDeg, latMin, latSec, latH, lonDeg, lonMin, lonSec, lonH],
  );
  const result = mode === "decimal" ? decimal : dms;

  const status = result.status === "ok"
    ? (es ? "Listo para copiar." : "Ready to copy.")
    : result.message === "empty"
      ? (es ? "Completá latitud y longitud." : "Enter latitude and longitude.")
      : result.message === "minutes"
        ? (es ? "Los minutos van de 0 a 59." : "Minutes must be from 0 to 59.")
        : result.message === "seconds"
          ? (es ? "Los segundos van de 0 a 59.99." : "Seconds must be from 0 to 59.99.")
          : result.message === "lat"
            ? (es ? "La latitud no es un número." : "Latitude is not a number.")
            : result.message === "lon"
              ? (es ? "La longitud no es un número." : "Longitude is not a number.")
              : (es ? "Latitud máx. 90 y longitud máx. 180." : "Latitude max 90 and longitude max 180.");

  function reset() {
    setLat(MADRID.lat);
    setLon(MADRID.lon);
    setLatDeg(BARCELONA.latDeg);
    setLatMin(BARCELONA.latMin);
    setLatSec(BARCELONA.latSec);
    setLatH(BARCELONA.latH);
    setLonDeg(BARCELONA.lonDeg);
    setLonMin(BARCELONA.lonMin);
    setLonSec(BARCELONA.lonSec);
    setLonH(BARCELONA.lonH);
    setCopied(false);
  }

  async function copyResult() {
    if (result.status !== "ok") return;
    await navigator.clipboard.writeText(result.pair);
    setCopied(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setMode("decimal")} aria-pressed={mode === "decimal"}>
          {es ? "Decimal → DMS" : "Decimal → DMS"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setMode("dms")} aria-pressed={mode === "dms"}>
          {es ? "DMS → decimal" : "DMS → decimal"}
        </button>
        <button type="button" className={buttonClass} onClick={() => { setMode("decimal"); setLat(MADRID.lat); setLon(MADRID.lon); }}>
          Madrid
        </button>
        <button type="button" className={buttonClass} onClick={() => setMode("dms")}>
          Barcelona
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      {mode === "decimal" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>{es ? "Latitud" : "Latitude"}</span>
            <input className={fieldClass} value={lat} onChange={(e) => setLat(e.target.value)} inputMode="decimal" placeholder="40.4168" />
          </label>
          <label className="space-y-1 text-sm">
            <span>{es ? "Longitud" : "Longitude"}</span>
            <input className={fieldClass} value={lon} onChange={(e) => setLon(e.target.value)} inputMode="decimal" placeholder="-3.7038" />
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <DmsRow es={es} label={es ? "Latitud" : "Latitude"} deg={latDeg} min={latMin} sec={latSec} hem={latH} hems={["N", "S"]} onDeg={setLatDeg} onMin={setLatMin} onSec={setLatSec} onHem={setLatH} />
          <DmsRow es={es} label={es ? "Longitud" : "Longitude"} deg={lonDeg} min={lonMin} sec={lonSec} hem={lonH} hems={["E", "W"]} onDeg={setLonDeg} onMin={setLonMin} onSec={setLonSec} onHem={setLonH} />
        </div>
      )}
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? (
        <div className="rounded-xl border p-4 space-y-3">
          <p className="font-medium break-words">{es ? result.pair.replace(" W", " O") : result.pair}</p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DmsRow<H extends string>({
  es,
  label,
  deg,
  min,
  sec,
  hem,
  hems,
  onDeg,
  onMin,
  onSec,
  onHem,
}: {
  es: boolean;
  label: string;
  deg: string;
  min: string;
  sec: string;
  hem: H;
  hems: H[];
  onDeg: (v: string) => void;
  onMin: (v: string) => void;
  onSec: (v: string) => void;
  onHem: (v: H) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input className={fieldClass} value={deg} onChange={(e) => onDeg(e.target.value)} inputMode="numeric" aria-label={es ? "grados" : "degrees"} placeholder={es ? "grados" : "degrees"} />
        <input className={fieldClass} value={min} onChange={(e) => onMin(e.target.value)} inputMode="numeric" aria-label={es ? "minutos" : "minutes"} placeholder={es ? "minutos" : "minutes"} />
        <input className={fieldClass} value={sec} onChange={(e) => onSec(e.target.value)} inputMode="decimal" aria-label={es ? "segundos" : "seconds"} placeholder={es ? "segundos" : "seconds"} />
        <select className={fieldClass} value={hem} onChange={(e) => onHem(e.target.value as H)} aria-label={es ? "hemisferio" : "hemisphere"}>
          {hems.map((item) => <option key={item} value={item}>{item === "W" && es ? "O" : item}</option>)}
        </select>
      </div>
    </fieldset>
  );
}
