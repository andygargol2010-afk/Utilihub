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
  { id: "half-adder", en: "Build a half-adder", es: "Construye un semi-sumador", hintEn: "Two inputs → XOR (sum) + AND (carry)", hintEs: "Dos entradas → XOR (suma) + AND (acarreo)" },
  { id: "decoder", en: "Simple 2-to-4 decoder", es: "Decodificador 2-a-4 simple", hintEn: "Two inputs drive four AND/NOT combinations", hintEs: "Dos entradas activan cuatro combinaciones AND/NOT" },
];

function evaluateCircuit(grid: Cell[][], wires: Wire[], inputOverrides?: Map<string, boolean>): Map<string, boolean> {
  const values = new Map<string, boolean>();
  grid.forEach((row, r) => row.forEach((cell, c) => {
    if (cell.type === "INPUT") {
      const key = `${r}-${c}`;
      const val = inputOverrides?.has(key) ? inputOverrides.get(key)! : !!cell.value;
      values.set(`${r}-${c}-out`, val);
    }
  }));
  for (let pass = 0; pass < 10; pass++) {
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
}

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
  const [selectedPort, setSelectedPort] = useState<"out" | "in1" | "in2">("out");
  const gridRefs = useRef<(HTMLButtonElement | null)[][]>(Array.from({ length: GRID }, () => Array(GRID).fill(null)));
  const gridContainerRef = useRef<HTMLDivElement>(null);

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

  const deleteWire = (index: number) => {
    setWires((prev) => prev.filter((_, i) => i !== index));
    setTimeout(updateUrl, 0);
  };

  const resetAll = () => {
    setGrid(Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ type: null }))));
    setWires([]);
    setWireFrom(null);
    setMode("place");
    setActiveChallenge(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const evaluated = useMemo(() => evaluateCircuit(grid, wires), [grid, wires]);

  const inputPositions = useMemo(() => {
    const pos: { r: number; c: number }[] = [];
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type === "INPUT") pos.push({ r, c });
    }));
    return pos;
  }, [grid]);

  const outputPositions = useMemo(() => {
    const pos: { r: number; c: number }[] = [];
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type === "OUTPUT") pos.push({ r, c });
    }));
    return pos;
  }, [grid]);

  const truthTable = useMemo(() => {
    const n = inputPositions.length;
    if (n === 0 || n > 3) return null;
    const rows: { inputs: boolean[]; outputs: (boolean | undefined)[] }[] = [];
    const max = 1 << n;
    for (let i = 0; i < max; i++) {
      const overrides = new Map<string, boolean>();
      const inputVals: boolean[] = [];
      inputPositions.forEach((p, idx) => {
        const bit = ((i >> (n - 1 - idx)) & 1) === 1;
        inputVals.push(bit);
        overrides.set(`${p.r}-${p.c}`, bit);
      });
      const evalMap = evaluateCircuit(grid, wires, overrides);
      const outVals = outputPositions.map((p) => evalMap.get(`${p.r}-${p.c}-out`));
      rows.push({ inputs: inputVals, outputs: outVals });
    }
    return rows;
  }, [grid, wires, inputPositions, outputPositions]);

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
    canvas.width = 640;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 640, 560);
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(0, 0, 6, 560);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 22px system-ui";
    ctx.fillText(isEs ? "Kit de Circuitos Lógicos" : "Logic Circuit Kit", 28, 42);
    ctx.font = "13px system-ui";
    ctx.fillText(isEs ? `Entradas: ${inputPositions.length} · Salidas: ${outputPositions.length}` : `Inputs: ${inputPositions.length} · Outputs: ${outputPositions.length}`, 28, 68);
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const x = 28 + c * 112;
        const y = 100 + r * 72;
        ctx.strokeStyle = "#334155";
        ctx.strokeRect(x, y, 96, 56);
        const cell = grid[r][c];
        if (cell.type) {
          ctx.fillStyle = "#38bdf8";
          ctx.font = "12px system-ui";
          ctx.fillText(labels[cell.type as keyof typeof labels] || cell.type, x + 6, y + 28);
          if (cell.type === "INPUT") {
            ctx.fillText(cell.value ? "1" : "0", x + 70, y + 28);
          }
          if (cell.type === "OUTPUT") {
            const v = evaluated.get(`${r}-${c}-out`);
            ctx.fillText(v ? "●" : "○", x + 70, y + 28);
          }
        }
      }
    }
    wires.forEach((w) => {
      const fx = 28 + w.from.c * 112 + 48;
      const fy = 100 + w.from.r * 72 + 28;
      const tx = 28 + w.to.c * 112 + 48;
      const ty = 100 + w.to.r * 72 + 28;
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.fillText("utilihub.com", 28, 530);
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
      else if (mode === "wire") startWire(r, c, selectedPort);
      if (grid[r][c].type === "INPUT") toggleInput(r, c);
      return;
    } else return;
    e.preventDefault();
    setFocusPos({ r: nr, c: nc });
    setTimeout(() => gridRefs.current[nr]?.[nc]?.focus(), 0);
  };

  const challenge = CHALLENGES.find((ch) => ch.id === activeChallenge);

  const challengeDone = useMemo(() => {
    if (!activeChallenge) return false;
    if (activeChallenge === "half-adder") {
      return inputPositions.length >= 2 && outputPositions.length >= 2 && wires.length >= 4;
    }
    if (activeChallenge === "decoder") {
      return inputPositions.length >= 2 && outputPositions.length >= 4 && wires.length >= 6;
    }
    return false;
  }, [activeChallenge, inputPositions, outputPositions, wires]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={resetAll} className="rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] bg-secondary border-border">
          {isEs ? "Reiniciar" : "Reset"}
        </button>
        <button type="button" onClick={copyLink} className="rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] bg-secondary border-border">
          {copied ? (isEs ? "¡Copiado!" : "Copied!") : (isEs ? "Copiar enlace" : "Copy link")}
        </button>
        <button type="button" onClick={sharePng} className="rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] bg-secondary border-border">
          {isEs ? "Compartir PNG" : "Share PNG"}
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

      {mode === "wire" && (
        <div className="flex gap-2 text-xs items-center">
          <span>{isEs ? "Puerto:" : "Port:"}</span>
          {(["out", "in1", "in2"] as const).map((p) => (
            <button key={p} type="button" onClick={() => setSelectedPort(p)} className={`px-2 py-1 rounded border min-h-[32px] ${selectedPort === p ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {p}
            </button>
          ))}
          {wireFrom && <span className="text-cyan-400">{isEs ? "Selecciona destino" : "Select destination"}</span>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {CHALLENGES.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setActiveChallenge(ch.id === activeChallenge ? null : ch.id)}
            className={`rounded-lg px-3 py-2 text-sm border min-h-[44px] ${activeChallenge === ch.id ? "bg-primary text-primary-foreground" : "bg-secondary border-border"}`}
          >
            {isEs ? ch.es : ch.en}
          </button>
        ))}
      </div>

      {challenge && (
        <div className="rounded-xl border border-border bg-card/30 p-3 text-sm" aria-live="polite">
          <p className="font-medium">{isEs ? challenge.es : challenge.en}</p>
          <p className="text-muted-foreground mt-1">{isEs ? challenge.hintEs : challenge.hintEn}</p>
          {challengeDone && <p className="text-green-500 mt-1 font-medium">{isEs ? "¡Reto completado!" : "Challenge complete!"}</p>}
        </div>
      )}

      <div ref={gridContainerRef} className="relative rounded-2xl border border-border bg-card/50 p-2 sm:p-4 overflow-x-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID}, minmax(52px, 1fr))` }}>
          {grid.map((row, r) => row.map((cell, c) => {
            const isInput = cell.type === "INPUT";
            const isOutput = cell.type === "OUTPUT";
            const outVal = isOutput ? evaluated.get(`${r}-${c}-out`) : undefined;
            return (
              <button
                key={`${r}-${c}`}
                ref={(el) => { if (gridRefs.current[r]) gridRefs.current[r][c] = el; }}
                type="button"
                onClick={() => {
                  if (mode === "wire") startWire(r, c, selectedPort);
                  else if (isInput && mode === "place") toggleInput(r, c);
                  else place(r, c);
                }}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                aria-label={`${isEs ? "Celda" : "Cell"} ${r},${c}${cell.type ? ` ${labels[cell.type as keyof typeof labels] || cell.type}` : ""}`}
                className={`relative h-12 sm:h-14 rounded border text-[10px] sm:text-xs font-medium flex flex-col items-center justify-center min-w-[52px] ${cell.type ? "bg-primary/10 border-primary/50" : "bg-secondary/50 border-border"} ${focusPos.r === r && focusPos.c === c ? "ring-2 ring-primary" : ""}`}
              >
                {cell.type && <span>{labels[cell.type as keyof typeof labels] || cell.type}</span>}
                {isInput && <span className={cell.value ? "text-green-400" : "text-red-400"}>{cell.value ? "1" : "0"}</span>}
                {isOutput && <span className={outVal ? "text-green-400" : "text-muted-foreground"}>{outVal ? "●" : "○"}</span>}
              </button>
            );
          }))}
        </div>
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
          {wires.map((w, i) => {
            const fx = (w.from.c + 0.5) * (100 / GRID);
            const fy = (w.from.r + 0.5) * (100 / GRID);
            const tx = (w.to.c + 0.5) * (100 / GRID);
            const ty = (w.to.r + 0.5) * (100 / GRID);
            return (
              <line
                key={i}
                x1={`${fx}%`}
                y1={`${fy}%`}
                x2={`${tx}%`}
                y2={`${ty}%`}
                stroke="#22d3ee"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm">{isEs ? "Salidas en vivo" : "Live outputs"}</h3>
        <p className="mt-2 text-sm" aria-live="polite">
          {outputPositions.length === 0
            ? (isEs ? "Coloca salidas para ver resultados" : "Place outputs to see results")
            : outputPositions.map((p) => {
                const v = evaluated.get(`${p.r}-${p.c}-out`);
                return (
                  <span key={`${p.r}-${p.c}`} className="inline-flex items-center gap-1 mr-3">
                    {isEs ? "Salida" : "Out"} {p.r},{p.c}: <strong className={v ? "text-green-400" : "text-red-400"}>{v ? "1" : "0"}</strong>
                  </span>
                );
              })}
        </p>
      </div>

      {truthTable && (
        <div className="rounded-2xl border border-border bg-card/50 p-4 overflow-x-auto">
          <h3 className="font-bold text-sm mb-2">{isEs ? "Tabla de verdad" : "Truth table"}</h3>
          <table className="text-xs w-full min-w-[200px]">
            <thead>
              <tr>
                {inputPositions.map((_, i) => <th key={i} className="px-2 text-left">{isEs ? "E" : "I"}{i+1}</th>)}
                {outputPositions.map((_, i) => <th key={`o${i}`} className="px-2 text-left">{isEs ? "S" : "O"}{i+1}</th>)}
              </tr>
            </thead>
            <tbody>
              {truthTable.map((row, i) => (
                <tr key={i} className="border-t border-border/50">
                  {row.inputs.map((v, j) => <td key={j} className="px-2">{v ? "1" : "0"}</td>)}
                  {row.outputs.map((v, j) => <td key={`o${j}`} className="px-2">{v ? "1" : "0"}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {wires.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <h3 className="font-bold text-sm mb-2">{isEs ? "Cables" : "Wires"} ({wires.length})</h3>
          <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
            {wires.map((w, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <span>{w.from.r},{w.from.c}:{w.from.port} → {w.to.r},{w.to.c}:{w.to.port}</span>
                <button type="button" onClick={() => deleteWire(i)} className="text-red-400 text-xs px-2 py-1 rounded border" aria-label={isEs ? "Eliminar cable" : "Delete wire"}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
