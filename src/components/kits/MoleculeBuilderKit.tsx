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
  en: { C: "Carbon", H: "Hydrogen", O: "Oxygen", N: "Nitrogen", bond: "Bond", single: "Single", double: "Double", triple: "Triple" },
  es: { C: "Carbono", H: "Hidrógeno", O: "Oxígeno", N: "Nitrógeno", bond: "Enlace", single: "Simple", double: "Doble", triple: "Triple" },
};

const CHALLENGES = {
  en: ["Build water (H2O)", "Build carbon dioxide (CO2)", "Build methane (CH4)"],
  es: ["Construye agua (H2O)", "Construye dióxido de carbono (CO2)", "Construye metano (CH4)"],
};

export function MoleculeBuilderKit({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const labels = LABELS[locale];
  const challenges = CHALLENGES[locale];

  const [grid, setGrid] = useState<AtomCell[][]>(
    Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ type: null })))
  );
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [selectedAtom, setSelectedAtom] = useState<AtomType>("C");
  const [mode, setMode] = useState<"place" | "bond">("place");
  const [bondOrder, setBondOrder] = useState<BondOrder>(1);
  const [bondFrom, setBondFrom] = useState<{ r: number; c: number } | null>(null);
  const [copied, setCopied] = useState(false);

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
    ctx.lineWidth = 2;
    bonds.forEach((b) => {
      const x1 = 40 + b.from.c * 90 + 35;
      const y1 = 150 + b.from.r * 60 + 22;
      const x2 = 40 + b.to.c * 90 + 35;
      const y2 = 150 + b.to.r * 60 + 22;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (b.order > 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1 + 3, y1);
        ctx.lineTo(x2 + 3, y2);
        ctx.stroke();
      }
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.fillText("utilihub.com", 30, 470);
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
        <p className="mt-2 text-2xl font-black tracking-tight">{formulaData.formula}</p>
        <p className="text-sm text-muted-foreground">{isEs ? "Masa molar" : "Molar mass"}: {formulaData.mass} g/mol</p>
      </div>

      <div className="relative">
        <div className="relative grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => (mode === "place" ? place(r, c) : startBond(r, c))}
                className={`aspect-square rounded border text-sm font-bold min-h-[48px] sm:min-h-[56px] ${
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
          {bondLines.map((line, i) => (
            <g key={i}>
              <line
                x1={`${line.x1}%`}
                y1={`${line.y1}%`}
                x2={`${line.x2}%`}
                y2={`${line.y2}%`}
                stroke="#22d3ee"
                strokeWidth={line.order === 1 ? "1.8" : line.order === 2 ? "2.5" : "3.2"}
                strokeLinecap="round"
              />
              {line.order > 1 && (
                <line
                  x1={`${line.x1 + 1.2}%`}
                  y1={`${line.y1}%`}
                  x2={`${line.x2 + 1.2}%`}
                  y2={`${line.y2}%`}
                  stroke="#22d3ee"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm mb-2">{isEs ? "Desafíos" : "Challenges"}</h3>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
          {challenges.map((ch, i) => <li key={i}>{ch}</li>)}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">{isEs ? "Coloca átomos y conecta con enlaces para formar la molécula." : "Place atoms and connect with bonds to form the molecule."}</p>
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
