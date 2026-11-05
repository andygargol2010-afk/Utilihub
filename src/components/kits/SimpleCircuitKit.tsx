import { useEffect, useMemo, useState } from "react";

export type Locale = "en" | "es";

type CompType = "battery" | "switch" | "resistor" | "led" | null;
type Cell = { type: CompType; closed?: boolean; ohms?: number };

const GRID = 4;
const STEPS_EN = [
  "Place the battery on the grid",
  "Place the switch next to it",
  "Place the resistor",
  "Place the LED",
  "Connect them in series with wires",
  "Close the switch and test the circuit",
];
const STEPS_ES = [
  "Coloca la batería en la cuadrícula",
  "Coloca el interruptor junto a ella",
  "Coloca la resistencia",
  "Coloca el LED",
  "Conéctalos en serie con cables",
  "Cierra el interruptor y prueba el circuito",
];

export function SimpleCircuitKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const steps = es ? STEPS_ES : STEPS_EN;

  const [grid, setGrid] = useState<Cell[][]>(
    Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ type: null })))
  );
  const [selected, setSelected] = useState<CompType>("battery");
  const [checked, setChecked] = useState<boolean[]>(new Array(steps.length).fill(false));
  const [wires, setWires] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"place" | "wire">("place");
  const [wireFrom, setWireFrom] = useState<{ r: number; c: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("g");
    if (g) {
      try {
        const parsed = JSON.parse(decodeURIComponent(g));
        if (Array.isArray(parsed) && parsed.length === GRID) setGrid(parsed);
      } catch { /* ignore */ }
    }
  }, []);

  const updateUrl = () => {
    const params = new URLSearchParams();
    params.set("g", encodeURIComponent(JSON.stringify(grid)));
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  const place = (r: number, c: number) => {
    if (mode !== "place" || !selected) return;
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      next[r][c] = { type: selected, closed: selected === "switch" ? true : undefined, ohms: selected === "resistor" ? 100 : undefined };
      return next;
    });
    setTimeout(updateUrl, 0);
  };

  const toggleSwitch = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (next[r][c].type === "switch") next[r][c].closed = !next[r][c].closed;
      return next;
    });
  };

  const startWire = (r: number, c: number) => {
    if (mode !== "wire") return;
    if (!wireFrom) {
      setWireFrom({ r, c });
    } else {
      const key = [wireFrom.r, wireFrom.c, r, c].sort().join("-");
      setWires((prev) => new Set(prev).add(key));
      setWireFrom(null);
    }
  };

  const progress = useMemo(() => {
    const done = checked.filter(Boolean).length;
    return { done, total: steps.length, pct: Math.round((done / steps.length) * 100) };
  }, [checked, steps.length]);

  const toggleStep = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const testCircuit = () => {
    const comps = grid.flat().filter((c) => c.type);
    const hasBattery = comps.some((c) => c.type === "battery");
    const hasSwitch = comps.some((c) => c.type === "switch");
    const hasRes = comps.some((c) => c.type === "resistor");
    const hasLed = comps.some((c) => c.type === "led");
    const switchClosed = comps.some((c) => c.type === "switch" && c.closed);
    const connected = wires.size >= 3;
    if (hasBattery && hasSwitch && hasRes && hasLed && switchClosed && connected) {
      const R = comps.find((c) => c.type === "resistor")?.ohms || 100;
      const bright = Math.max(0.2, Math.min(1, 200 / R));
      setTestResult(es ? `Circuito cerrado. LED encendido (brillo ~${Math.round(bright * 100)}%)` : `Circuit closed. LED on (brightness ~${Math.round(bright * 100)}%)`);
    } else {
      setTestResult(es ? "Circuito incompleto o abierto. Revisa conexiones e interruptor." : "Circuit incomplete or open. Check connections and switch.");
    }
  };

  const copyLink = async () => {
    updateUrl();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const sharePng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 600, 500);
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(0, 0, 6, 500);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 24px system-ui";
    ctx.fillText(es ? "Kit de Circuito Simple" : "Simple Circuit Kit", 30, 50);
    ctx.font = "14px system-ui";
    ctx.fillText(testResult || (es ? "En progreso" : "In progress"), 30, 80);
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const x = 40 + c * 120;
        const y = 120 + r * 80;
        ctx.strokeStyle = "#334155";
        ctx.strokeRect(x, y, 100, 60);
        const cell = grid[r][c];
        if (cell.type) {
          ctx.fillStyle = cell.type === "led" && testResult?.includes("on") ? "#fbbf24" : "#38bdf8";
          ctx.fillText(cell.type, x + 10, y + 35);
        }
      }
    }
    ctx.fillStyle = "#64748b";
    ctx.fillText("utilihub.com", 30, 470);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "simple-circuit-kit.png";
    a.click();
  };

  const materials = es
    ? ["Batería", "Interruptor", "Resistencia", "LED", "Cables"]
    : ["Battery", "Switch", "Resistor", "LED", "Wires"];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap gap-2">
        {(["battery", "switch", "resistor", "led"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setSelected(t); setMode("place"); }}
            className={`rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] ${
              selected === t && mode === "place" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"
            }`}
          >
            {t}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMode("wire")}
          className={`rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] ${
            mode === "wire" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"
          }`}
        >
          {es ? "Cable" : "Wire"}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm">{es ? "Materiales" : "Materials"}</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
          {materials.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{es ? "Progreso guiado" : "Guided progress"}</span>
          <span>{progress.done}/{progress.total} · {progress.pct}%</span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-muted">
          <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${progress.pct}%` }} />
        </div>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => (mode === "place" ? place(r, c) : startWire(r, c))}
              onDoubleClick={() => toggleSwitch(r, c)}
              className={`aspect-square rounded border text-xs font-medium min-h-[60px] ${
                cell.type ? "bg-sky-500/20 border-sky-400" : "bg-muted/30 border-border"
              } ${wireFrom?.r === r && wireFrom?.c === c ? "ring-2 ring-primary" : ""}`}
            >
              {cell.type || ""}
              {cell.type === "switch" && (cell.closed ? " ON" : " OFF")}
              {cell.type === "resistor" && ` ${cell.ohms}Ω`}
            </button>
          ))
        )}
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <label key={i} className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer min-h-[52px]">
            <input type="checkbox" checked={!!checked[i]} onChange={() => toggleStep(i)} className="mt-1 size-5" />
            <span className={checked[i] ? "line-through text-muted-foreground" : ""}>{i + 1}. {step}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={testCircuit} className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground min-h-[48px]">
          {es ? "Probar circuito" : "Test circuit"}
        </button>
        <button type="button" onClick={copyLink} className="rounded-lg bg-secondary px-4 py-3 text-sm font-medium min-h-[48px]">
          {copied ? (es ? "¡Enlace copiado!" : "Link copied!") : es ? "Copiar enlace" : "Copy link"}
        </button>
        <button type="button" onClick={sharePng} className="rounded-lg bg-secondary px-4 py-3 text-sm font-medium min-h-[48px]">
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
      </div>

      {testResult && (
        <div className="rounded-xl bg-primary/10 p-4 text-center font-bold text-primary" aria-live="polite">
          {testResult}
        </div>
      )}
    </div>
  );
}
