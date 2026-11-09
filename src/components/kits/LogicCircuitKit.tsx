import { useEffect, useMemo, useState, useRef } from "react";

export type Locale = "en" | "es";

type GateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "INPUT" | "OUTPUT" | null;

interface Cell {
  type: GateType;
  value?: boolean;
}

interface Wire {
  from: { r: number; c: number; port: "out" | "in1" | "in2" };
  to: { r: number; c: number; port: "out" | "in1" | "in2" };
}

const GRID = 5;

const LABELS = {
  en: { AND: "AND", OR: "OR", NOT: "NOT", XOR: "XOR", NAND: "NAND", NOR: "NOR", INPUT: "Input", OUTPUT: "Output", place: "Place", wire: "Wire", clear: "Clear" },
  es: { AND: "AND", OR: "OR", NOT: "NOT", XOR: "XOR", NAND: "NAND", NOR: "NOR", INPUT: "Entrada", OUTPUT: "Salida", place: "Colocar", wire: "Cable", clear: "Borrar" },
};

const CHALLENGES = [
  { id: "half-adder", en: "Build a half-adder", es: "Construye un semi-sumador" },
  { id: "decoder", en: "Simple 2-to-4 decoder", es: "Decodificador 2-a-4 simple" },
];

export function LogicCircuitKit({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const labels = LABELS[locale];

  const [grid, setGrid] = useState<Cell[][]>(
    Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ type: null })))
  );
  const [wires, setWires] = useState<Wire[]>([]);
  const [selected, setSelected] = useState<GateType>("AND");
  const [mode, setMode] = useState<"place" | "wire" | "clear">("place");
  const [wireFrom, setWireFrom] = useState<{ r: number; c: number; port: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [focusPos, setFocusPos] = useState({ r: 0, c: 0 });
  const gridRefs = useRef<(HTMLButtonElement | null)[][]>(Array.from({ length: GRID }, () => Array(GRID).fill(null)));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("g");
    const w = params.get("w");
    if (g) {
      try {
        const parsed = JSON.parse(decodeURIComponent(g));
        if (Array.isArray(parsed) && parsed.length === GRID) setGrid(parsed);
      } catch { /* ignore */ }
    }
    if (w) {
      try {
        const parsed = JSON.parse(decodeURIComponent(w));
        if (Array.isArray(parsed)) setWires(parsed);
      } catch { /* ignore */ }
    }
  }, []);

  const updateUrl = () => {
    const params = new URLSearchParams();
    params.set("g", encodeURIComponent(JSON.stringify(grid)));
    params.set("w", encodeURIComponent(JSON.stringify(wires)));
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  const place = (r: number, c: number) => {
    if (mode === "clear") {
      setGrid((prev) => {
        const next = prev.map((row) => row.map((cell) => ({ ...cell })));
        next[r][c] = { type: null };
        return next;
      });
      setTimeout(updateUrl, 0);
      return;
    }
    if (mode !== "place" || !selected) return;
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      next[r][c] = { type: selected, value: selected === "INPUT" ? false : undefined };
      return next;
    });
    setTimeout(updateUrl, 0);
  };

  const toggleInput = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (next[r][c].type === "INPUT") next[r][c].value = !next[r][c].value;
      return next;
    });
    setTimeout(updateUrl, 0);
  };

  const startWire = (r: number, c: number, port: string) => {
    if (mode !== "wire") return;
    if (!wireFrom) {
      setWireFrom({ r, c, port });
    } else {
      if (wireFrom.r === r && wireFrom.c === c && wireFrom.port === port) {
        setWireFrom(null);
        return;
      }
      setWires((prev) => [...prev, { from: wireFrom as any, to: { r, c, port: port as any } }]);
      setWireFrom(null);
      setTimeout(updateUrl, 0);
    }
  };

  const resetAll = () => {
    setGrid(Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ type: null }))));
    setWires([]);
    setWireFrom(null);
    setMode("place");
    setActiveChallenge(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const evaluated = useMemo(() => {
    const values = new Map<string, boolean>();
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type === "INPUT") values.set(`${r}-${c}-out`, !!cell.value);
    }));
    for (let pass = 0; pass < 8; pass++) {
      wires.forEach((w) => {
        const srcKey = `${w.from.r}-${w.from.c}-out`;
        const dstKey = `${w.to.r}-${w.to.c}-${w.to.port}`;
        if (values.has(srcKey)) values.set(dstKey, values.get(srcKey)!);
      });
      grid.forEach((row, r) => row.forEach((cell, c) => {
        if (!cell.type || cell.type === "INPUT" || cell.type === "OUTPUT") return;
        const in1 = values.get(`${r}-${c}-in1`) ?? false;
        const in2 = values.get(`${r}-${c}-in2`) ?? false;
        let out = false;
        if (cell.type === "AND") out = in1 && in2;
        else if (cell.type === "OR") out = in1 || in2;
        else if (cell.type === "XOR") out = in1 !== in2;
        else if (cell.type === "NAND") out = !(in1 && in2);
        else if (cell.type === "NOR") out = !(in1 || in2);
        else if (cell.type === "NOT") out = !in1;
        values.set(`${r}-${c}-out`, out);
      }));
    }
    return values;
  }, [grid, wires]);

  const truthSnippet = useMemo(() => {
    const inputs = grid.flat().filter((c) => c.type === "INPUT").length;
    if (inputs === 0) return isEs ? "Añade entradas" : "Add inputs";
    return isEs ? `Entradas activas: ${evaluated.size > 0 ? "sí" : "no"}` : `Active outputs: ${evaluated.size > 0 ? "yes" : "no"}`;
  }, [evaluated, isEs, grid]);

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
    ctx.fillText(isEs ? "Kit de Circuitos Lógicos" : "Logic Circuit Kit", 30, 50);
    ctx.font = "14px system-ui";
    ctx.fillText(truthSnippet, 30, 80);
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const x = 40 + c * 100;
        const y = 120 + r * 70;
        ctx.strokeStyle = "#334155";
        ctx.strokeRect(x, y, 80, 50);
        const cell = grid[r][c];
        if (cell.type) {
          ctx.fillStyle = "#38bdf8";
          ctx.fillText(labels[cell.type as keyof typeof labels] || cell.type, x + 8, y + 30);
        }
      }
    }
    ctx.fillStyle = "#64748b";
    ctx.fillText("utilihub.com", 30, 470);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "logic-circuit-kit.png";
    a.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    let nr = r, nc = c;
    if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
    else if (e.key === "ArrowDown") nr = Math.min(GRID - 1, r + 1);
    else if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
    else if (e.key === "ArrowRight") nc = Math.min(GRID - 1, c + 1);
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (mode === "place" || mode === "clear") place(r, c);
      else if (mode === "wire") startWire(r, c, "out");
      if (grid[r][c].type === "INPUT") toggleInput(r, c);
      return;
    } else return;
    e.preventDefault();
    setFocusPos({ r: nr, c: nc });
    setTimeout(() => gridRefs.current[nr]?.[nc]?.focus(), 0);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={resetAll} className="rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] bg-secondary border-border">
          {isEs ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["AND", "OR", "NOT", "XOR", "NAND", "NOR", "INPUT", "OUTPUT"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setSelected(t); setMode("place"); }}
            className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium border min-h-[44px] ${selected === t && mode === "place" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"}`}
          >
            {labels[t]}
          </button>
        ))}
        <button type="button" onClick={() => setMode("wire")} className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium border min-h-[44px] ${mode === "wire" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"}`}>
          {labels.wire}
        </button>
        <button type="button" onClick={() => setMode("clear")} className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium border min-h-[44px] ${mode === "clear" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"}`}>
          {labels.clear}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm">{isEs ? "Salidas en vivo" : "Live outputs"}</h3>
        <p className="mt-2 text-lg font-bold" aria-live="polite">{truthSnippet}</p>
        <p className="text-xs text-muted-foreground">{isEs ? "Toca una entrada para alternar 0/1. Conecta puertos con modo Cable." : "Tap an input to toggle 0/1. Connect ports in Wire mode."}</p>
      </div>

      <div className="relative">
        <div className="relative grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }} role="grid">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const outVal = evaluated.get(`${r}-${c}-out`);
              return (
                <button
                  key={`${r}-${c}`}
                  ref={(el) => { if (gridRefs.current[r]) gridRefs.current[r][c] = el; }}
                  type="button"
                  onClick={() => {
                    if (mode === "place" || mode === "clear") place(r, c);
                    else if (mode === "wire") startWire(r, c, "out");
                    if (cell.type === "INPUT") toggleInput(r, c);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, r, c)}
                  tabIndex={focusPos.r === r && focusPos.c === c ? 0 : -1}
                  className={`aspect-square rounded border text-[10px] sm:text-xs font-medium min-h-[44px] sm:min-h-[52px] ${
                    cell.type ? "bg-sky-500/20 border-sky-400" : "bg-muted/30 border-border"
                  } ${wireFrom?.r === r && wireFrom?.c === c ? "ring-2 ring-primary" : ""} focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                  aria-label={cell.type ? `${labels[cell.type as keyof typeof labels]} ${outVal !== undefined ? (outVal ? "1" : "0") : ""}` : (isEs ? "Celda vacía" : "Empty cell")}
                >
                  {cell.type ? labels[cell.type as keyof typeof labels] : ""}
                  {cell.type === "INPUT" && (cell.value ? " 1" : " 0")}
                  {cell.type === "OUTPUT" && (outVal !== undefined ? (outVal ? " ●" : " ○") : "")}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm mb-2">{isEs ? "Desafíos" : "Challenges"}</h3>
        <div className="space-y-2">
          {CHALLENGES.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChallenge(ch.id)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm border min-h-[44px] ${
                activeChallenge === ch.id ? "border-primary bg-primary/10" : "border-border bg-secondary"
              }`}
            >
              {isEs ? ch.es : ch.en}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{isEs ? "Modo libre o sigue el desafío. Usa flechas + Enter." : "Free mode or follow challenge. Use arrows + Enter."}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copyLink} className="rounded-lg bg-secondary px-4 py-3 text-sm font-medium min-h-[48px]">
          {copied ? (isEs ? "¡Enlace copiado!" : "Link copied!") : isEs ? "Copiar enlace" : "Copy link"}
        </button>
        <button type="button" onClick={sharePng} className="rounded-lg bg-secondary px-4 py-3 text-sm font-medium min-h-[48px]">
          {isEs ? "Descargar PNG" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
