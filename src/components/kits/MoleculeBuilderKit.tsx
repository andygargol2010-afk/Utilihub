import { useEffect, useMemo, useState } from "react";

export type Locale = "en" | "es";

type AtomType = "C" | "H" | "O" | "N" | null;
type BondOrder = 1 | 2 | 3;

interface AtomCell {
  type: AtomType;
}

interface Bond {
  from: { r: number; c: number };
  to: { r: number; c: number };
  order: BondOrder;
}

const GRID = 5;
const ATOMIC_MASS: Record<string, number> = { C: 12.011, H: 1.008, O: 15.999, N: 14.007 };

const ATOMS = ["C", "H", "O", "N"] as const;

const LABELS = {
  en: { C: "Carbon", H: "Hydrogen", O: "Oxygen", N: "Nitrogen", bond: "Bond", single: "Single", double: "Double", triple: "Triple", clear: "Clear" },
  es: { C: "Carbono", H: "Hidrógeno", O: "Oxígeno", N: "Nitrógeno", bond: "Enlace", single: "Simple", double: "Doble", triple: "Triple", clear: "Borrar" },
};

const CHALLENGES = [
  { id: "h2o", formula: "H2O", en: "Build water (H2O)", es: "Construye agua (H2O)" },
  { id: "co2", formula: "CO2", en: "Build carbon dioxide (CO2)", es: "Construye dióxido de carbono (CO2)" },
  { id: "ch4", formula: "CH4", en: "Build methane (CH4)", es: "Construye metano (CH4)" },
];

export function MoleculeBuilderKit({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const labels = LABELS[locale];

  const [grid, setGrid] = useState<AtomCell[][]>(
    Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ type: null })))
  );
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [selectedAtom, setSelectedAtom] = useState<AtomType>("C");
  const [mode, setMode] = useState<"place" | "bond" | "clear">("place");
  const [bondOrder, setBondOrder] = useState<BondOrder>(1);
  const [bondFrom, setBondFrom] = useState<{ r: number; c: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("g");
    const b = params.get("b");
    if (g) {
      try {
        const parsed = JSON.parse(decodeURIComponent(g));
        if (Array.isArray(parsed) && parsed.length === GRID) setGrid(parsed);
      } catch { /* ignore */ }
    }
    if (b) {
      try {
        const parsed = JSON.parse(decodeURIComponent(b));
        if (Array.isArray(parsed)) setBonds(parsed);
      } catch { /* ignore */ }
    }
  }, []);

  const updateUrl = () => {
    const params = new URLSearchParams();
    params.set("g", encodeURIComponent(JSON.stringify(grid)));
    params.set("b", encodeURIComponent(JSON.stringify(bonds)));
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
    if (mode !== "place" || !selectedAtom) return;
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      next[r][c] = { type: selectedAtom };
      return next;
    });
    setTimeout(updateUrl, 0);
  };

  const startBond = (r: number, c: number) => {
    if (mode !== "bond" || !grid[r][c].type) return;
    if (!bondFrom) {
      setBondFrom({ r, c });
    } else {
      if (bondFrom.r === r && bondFrom.c === c) {
        setBondFrom(null);
        return;
      }
      const exists = bonds.some(
        (b) =>
          (b.from.r === bondFrom.r && b.from.c === bondFrom.c && b.to.r === r && b.to.c === c) ||
          (b.from.r === r && b.from.c === c && b.to.r === bondFrom.r && b.to.c === bondFrom.c)
      );
      if (!exists) {
        setBonds((prev) => [...prev, { from: bondFrom, to: { r, c }, order: bondOrder }]);
      }
      setBondFrom(null);
      setTimeout(updateUrl, 0);
    }
  };

  const resetAll = () => {
    setGrid(Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ type: null }))));
    setBonds([]);
    setBondFrom(null);
    setMode("place");
    setCompleted(new Set());
    setActiveChallenge(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const formulaData = useMemo(() => {
    const counts: Record<string, number> = { C: 0, H: 0, O: 0, N: 0 };
    grid.flat().forEach((cell) => {
      if (cell.type) counts[cell.type] = (counts[cell.type] || 0) + 1;
    });
    const parts: string[] = [];
    (["C", "H", "O", "N"] as const).forEach((a) => {
      if (counts[a] > 0) parts.push(counts[a] === 1 ? a : `${a}${counts[a]}`);
    });
    const formula = parts.length ? parts.join("") : (isEs ? "Vacío" : "Empty");
    let mass = 0;
    Object.entries(counts).forEach(([a, n]) => {
      mass += n * (ATOMIC_MASS[a] || 0);
    });
    return { formula, mass: mass.toFixed(3), counts };
  }, [grid, isEs]);

  useEffect(() => {
    if (!activeChallenge) return;
    const ch = CHALLENGES.find((c) => c.id === activeChallenge);
    if (ch && formulaData.formula === ch.formula && !completed.has(ch.id)) {
      setCompleted((prev) => new Set(prev).add(ch.id));
    }
  }, [formulaData.formula, activeChallenge, completed]);

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
    canvas.height = 520;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 600, 520);
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(0, 0, 6, 520);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 24px system-ui";
    ctx.fillText(isEs ? "Constructor de Moléculas" : "Molecule Builder Kit", 30, 50);
    ctx.font = "16px system-ui";
    ctx.fillText(`${isEs ? "Fórmula" : "Formula"}: ${formulaData.formula}`, 30, 90);
    ctx.fillText(`${isEs ? "Masa" : "Mass"}: ${formulaData.mass} g/mol`, 30, 115);
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const x = 40 + c * 90;
        const y = 150 + r * 60;
        ctx.strokeStyle = "#334155";
        ctx.strokeRect(x, y, 70, 45);
        const cell = grid[r][c];
        if (cell.type) {
          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 14px system-ui";
          ctx.fillText(cell.type, x + 25, y + 28);
        }
      }
    }
    ctx.strokeStyle = "#22d3ee";
    bonds.forEach((b) => {
      const x1 = 40 + b.from.c * 90 + 35;
      const y1 = 150 + b.from.r * 60 + 22;
      const x2 = 40 + b.to.c * 90 + 35;
      const y2 = 150 + b.to.r * 60 + 22;
      const offsets = b.order === 1 ? [0] : b.order === 2 ? [-3, 3] : [-4, 0, 4];
      offsets.forEach((off) => {
        ctx.lineWidth = b.order === 1 ? 2 : 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1 + off);
        ctx.lineTo(x2, y2 + off);
        ctx.stroke();
      });
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.fillText("utilihub.com", 30, 490);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "molecule-builder-kit.png";
    a.click();
  };

  const bondLines = useMemo(() => {
    return bonds.map((b) => ({
      x1: (b.from.c + 0.5) * 100 / GRID,
      y1: (b.from.r + 0.5) * 100 / GRID,
      x2: (b.to.c + 0.5) * 100 / GRID,
      y2: (b.to.r + 0.5) * 100 / GRID,
      order: b.order,
    }));
  }, [bonds]);

  const currentChallenge = activeChallenge ? CHALLENGES.find((c) => c.id === activeChallenge) : null;
  const isChallengeDone = currentChallenge ? completed.has(currentChallenge.id) : false;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={resetAll} className="rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] bg-secondary border-border">
          {isEs ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ATOMS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setSelectedAtom(t); setMode("place"); }}
            className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium border min-h-[44px] ${selectedAtom === t && mode === "place" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"}`}
          >
            {t} · {labels[t]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMode("bond")}
          className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium border min-h-[44px] ${mode === "bond" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"}`}
        >
          {labels.bond}
        </button>
        <button
          type="button"
          onClick={() => setMode("clear")}
          className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium border min-h-[44px] ${mode === "clear" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"}`}
        >
          {labels.clear}
        </button>
      </div>

      {mode === "bond" && (
        <div className="flex flex-wrap gap-2">
          {([1, 2, 3] as BondOrder[]).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setBondOrder(o)}
              className={`rounded-lg px-3 py-2 text-sm border min-h-[44px] ${bondOrder === o ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            >
              {o === 1 ? labels.single : o === 2 ? labels.double : labels.triple}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm">{isEs ? "Fórmula en vivo" : "Live formula"}</h3>
        <p className="mt-2 text-2xl font-black tracking-tight" aria-live="polite">{formulaData.formula}</p>
        <p className="text-sm text-muted-foreground">{isEs ? "Masa molar" : "Molar mass"}: {formulaData.mass} g/mol</p>
      </div>

      <div className="relative">
        <div className="relative grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => (mode === "place" || mode === "clear" ? place(r, c) : startBond(r, c))}
                className={`aspect-square rounded border text-sm font-bold min-h-[44px] sm:min-h-[52px] ${
                  cell.type ? "bg-sky-500/20 border-sky-400 text-sky-100" : "bg-muted/30 border-border"
                } ${bondFrom?.r === r && bondFrom?.c === c ? "ring-2 ring-primary" : ""}`}
                aria-label={cell.type ? cell.type : (isEs ? "Celda vacía" : "Empty cell")}
              >
                {cell.type || ""}
              </button>
            ))
          )}
        </div>
        <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {bondLines.map((line, i) => {
            const offsets = line.order === 1 ? [0] : line.order === 2 ? [-0.6, 0.6] : [-1.0, 0, 1.0];
            return (
              <g key={i}>
                {offsets.map((off, j) => (
                  <line
                    key={j}
                    x1={`${line.x1}%`}
                    y1={`${line.y1 + off}%`}
                    x2={`${line.x2}%`}
                    y2={`${line.y2 + off}%`}
                    stroke="#22d3ee"
                    strokeWidth={line.order === 1 ? "1.6" : "1.2"}
                    strokeLinecap="round"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm mb-2">{isEs ? "Leyenda de átomos" : "Atom legend"}</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          {ATOMS.map((a) => (
            <span key={a} className="inline-flex items-center gap-1.5">
              <span className="inline-block w-6 h-6 rounded bg-sky-500/30 border border-sky-400 text-center font-bold text-xs leading-6">{a}</span>
              {labels[a]} ({ATOMIC_MASS[a]} g/mol)
            </span>
          ))}
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
              } ${completed.has(ch.id) ? "opacity-70" : ""}`}
            >
              {isEs ? ch.es : ch.en} {completed.has(ch.id) ? "✓" : ""}
            </button>
          ))}
        </div>
        {currentChallenge && (
          <p className="mt-3 text-sm font-medium" aria-live="polite">
            {isChallengeDone
              ? (isEs ? "¡Desafío completado! Fórmula correcta." : "Challenge complete! Correct formula.")
              : (isEs ? `Objetivo: ${currentChallenge.formula}. Coloca los átomos y conecta.` : `Target: ${currentChallenge.formula}. Place atoms and connect bonds.`)}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">{isEs ? "Selecciona un desafío, construye la fórmula exacta y verás la marca de completado." : "Select a challenge, build the exact formula, and you will see the completion mark."}</p>
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
