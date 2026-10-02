import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import type { Locale } from "@/lib/i18n/locale";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

type Mode = "picket" | "panel";

type Preset = {
  id: string;
  length: string;
  spacing: string;
  gates: string;
  gateWidth: string;
  mode: Mode;
  board: string;
  gap: string;
  panel: string;
  rails: string;
  waste: string;
  bags: string;
};

const PRESETS: Preset[] = [
  { id: "privacy", length: "12", spacing: "1.8", gates: "1", gateWidth: "1", mode: "picket", board: "140", gap: "0", panel: "1.8", rails: "3", waste: "10", bags: "1" },
  { id: "gapped", length: "15", spacing: "2.4", gates: "1", gateWidth: "0.9", mode: "picket", board: "90", gap: "15", panel: "1.8", rails: "2", waste: "8", bags: "1" },
  { id: "panel", length: "18", spacing: "1.8", gates: "1", gateWidth: "1", mode: "panel", board: "140", gap: "0", panel: "1.8", rails: "0", waste: "5", bags: "2" },
];

export function FenceCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [lengthM, setLengthM] = useState("12");
  const [spacingM, setSpacingM] = useState("1.8");
  const [gates, setGates] = useState("1");
  const [gateWidth, setGateWidth] = useState("1");
  const [mode, setMode] = useState<Mode>("picket");
  const [boardMm, setBoardMm] = useState("140");
  const [gapMm, setGapMm] = useState("0");
  const [panelM, setPanelM] = useState("1.8");
  const [railsPer, setRailsPer] = useState("3");
  const [wastePct, setWastePct] = useState("10");
  const [bagsEach, setBagsEach] = useState("1");
  const [postPrice, setPostPrice] = useState("");
  const [railPrice, setRailPrice] = useState("");
  const [boardPrice, setBoardPrice] = useState("");
  const [bagPrice, setBagPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá postes, vanos, travesaños y tablas o paneles de un tramo recto. El portón resta ancho del ciego. Los precios son opcionales.",
        length: "Largo del tramo (m)",
        spacing: "Separación entre ejes (m)",
        gates: "Portones",
        gateWidth: "Ancho de cada portón (m)",
        style: "Cerramiento",
        picket: "Tablas",
        panel: "Paneles",
        board: "Ancho de tabla (mm)",
        gap: "Separación entre tablas (mm)",
        panelW: "Ancho de panel (m)",
        rails: "Travesaños por vano ciego",
        waste: "Desperdicio (%)",
        bags: "Sacos de hormigón por poste",
        postPrice: "Precio por poste (opcional)",
        railPrice: "Precio por travesaño (opcional)",
        boardPrice: "Precio por tabla o panel (opcional)",
        bagPrice: "Precio por saco (opcional)",
        result: "Resultado",
        posts: "Postes",
        bays: "Vanos",
        infillBays: "Vanos ciegos",
        infill: "Longitud ciega",
        last: "Último vano",
        boards: "Tablas a comprar",
        panels: "Paneles a comprar",
        railCount: "Travesaños",
        bagCount: "Sacos de hormigón",
        cost: "Costo de material",
        note: "Los postes incluyen ambos extremos. El último vano puede ser más corto que la separación.",
        copyBtn: "Copiar resultado",
        copied: "Copiado",
        reset: "Restablecer",
        presets: "Presets",
        privacy: "Privacidad",
        gapped: "Con hueco",
        panelPreset: "Paneles",
        empty: "Completá largo y separación mayores a 0.",
        invalid: "Usá números válidos. Largo y separación tienen que ser mayores a 0.",
        gatesInvalid: "Los portones tienen que ser un entero mayor o igual a 0, y no pueden superar los vanos.",
        gateWidthInvalid: "Si hay portones, el ancho de cada uno tiene que ser mayor a 0.",
        gateRunInvalid: "La suma de portones no puede ocupar todo el tramo ni superarlo.",
        wasteInvalid: "El desperdicio no puede ser negativo.",
        railsInvalid: "Los travesaños por vano tienen que ser un entero mayor o igual a 0.",
        pitchInvalid: "El ancho de tabla más la separación tiene que ser mayor a 0.",
        panelInvalid: "El ancho de panel tiene que ser mayor a 0.",
        bagsInvalid: "Los sacos por poste no pueden ser negativos.",
        priceInvalid: "Los precios opcionales tienen que ser números mayores o iguales a 0.",
      }
    : {
        help: "Estimate posts, bays, rails, and pickets or panels for a straight run. Gates remove width from the infill. Prices are optional.",
        length: "Run length (m)",
        spacing: "Post spacing, center to center (m)",
        gates: "Gates",
        gateWidth: "Width of each gate (m)",
        style: "Infill",
        picket: "Pickets",
        panel: "Panels",
        board: "Board width (mm)",
        gap: "Gap between boards (mm)",
        panelW: "Panel width (m)",
        rails: "Rails per infill bay",
        waste: "Waste (%)",
        bags: "Concrete bags per post",
        postPrice: "Price per post (optional)",
        railPrice: "Price per rail (optional)",
        boardPrice: "Price per board or panel (optional)",
        bagPrice: "Price per bag (optional)",
        result: "Result",
        posts: "Posts",
        bays: "Bays",
        infillBays: "Infill bays",
        infill: "Infill length",
        last: "Last bay",
        boards: "Boards to buy",
        panels: "Panels to buy",
        railCount: "Rails",
        bagCount: "Concrete bags",
        cost: "Material cost",
        note: "Posts include both ends. The last bay may be shorter than the spacing.",
        copyBtn: "Copy result",
        copied: "Copied",
        reset: "Reset",
        presets: "Presets",
        privacy: "Privacy",
        gapped: "Gapped",
        panelPreset: "Panels",
        empty: "Enter a run length and spacing greater than 0.",
        invalid: "Use valid numbers. Length and spacing must be greater than 0.",
        gatesInvalid: "Gates must be a whole number of 0 or more, and cannot exceed the bay count.",
        gateWidthInvalid: "If there are gates, each gate width must be greater than 0.",
        gateRunInvalid: "Gates cannot take the whole run or more.",
        wasteInvalid: "Waste cannot be negative.",
        railsInvalid: "Rails per bay must be a whole number of 0 or more.",
        pitchInvalid: "Board width plus gap must be greater than 0.",
        panelInvalid: "Panel width must be greater than 0.",
        bagsInvalid: "Bags per post cannot be negative.",
        priceInvalid: "Optional prices must be numbers of 0 or more.",
      };

  const result = useMemo(() => {
    if (!lengthM.trim() || !spacingM.trim()) return { error: copy.empty };
    const length = parseNum(lengthM);
    const spacing = parseNum(spacingM);
    const gateCount = parseNum(gates);
    const gateW = parseNum(gateWidth);
    const waste = parseNum(wastePct);
    const railN = parseNum(railsPer);
    const bags = parseNum(bagsEach);
    const board = parseNum(boardMm);
    const gap = parseNum(gapMm);
    const panel = parseNum(panelM);
    if (length == null || spacing == null || length <= 0 || spacing <= 0) return { error: copy.invalid };
    if (gateCount == null || gateCount < 0 || !Number.isInteger(gateCount)) return { error: copy.gatesInvalid };
    if (gateCount > 0 && (gateW == null || gateW <= 0)) return { error: copy.gateWidthInvalid };
    if (waste == null || waste < 0) return { error: copy.wasteInvalid };
    if (railN == null || railN < 0 || !Number.isInteger(railN)) return { error: copy.railsInvalid };
    if (bags == null || bags < 0) return { error: copy.bagsInvalid };
    const bays = Math.max(1, Math.ceil(length / spacing - 1e-9));
    const posts = bays + 1;
    if (gateCount > bays) return { error: copy.gatesInvalid };
    const gateRun = gateCount * (gateW ?? 0);
    if (gateRun >= length) return { error: copy.gateRunInvalid };
    const infillLength = length - gateRun;
    const infillBays = bays - gateCount;
    const rails = infillBays * railN;
    const lastBay = bays === 1 ? length : length - (bays - 1) * spacing;
    const wasteFactor = 1 + waste / 100;
    let boards = 0;
    let panels = 0;
    if (mode === "picket") {
      if (board == null || gap == null || board < 0 || gap < 0 || board + gap <= 0) return { error: copy.pitchInvalid };
      const pitch = (board + gap) / 1000;
      boards = Math.ceil((infillLength / pitch) * wasteFactor - 1e-9);
    } else {
      if (panel == null || panel <= 0) return { error: copy.panelInvalid };
      panels = Math.ceil((infillLength / panel) * wasteFactor - 1e-9);
    }
    const bagCount = Math.ceil(posts * bags - 1e-9);
    const prices = [postPrice, railPrice, boardPrice, bagPrice].map((value) => (value.trim() ? parseNum(value) : 0));
    if (prices.some((value) => value == null || value < 0)) return { error: copy.priceInvalid };
    const [pp, rp, bp, bagp] = prices as number[];
    const units = mode === "picket" ? boards : panels;
    const cost = pp * posts + rp * rails + bp * units + bagp * bagCount;
    const hasPrice = [postPrice, railPrice, boardPrice, bagPrice].some((value) => value.trim());
    return { posts, bays, infillBays, infillLength, lastBay, boards, panels, rails, bagCount, cost: hasPrice ? cost : null };
  }, [
    lengthM,
    spacingM,
    gates,
    gateWidth,
    mode,
    boardMm,
    gapMm,
    panelM,
    railsPer,
    wastePct,
    bagsEach,
    postPrice,
    railPrice,
    boardPrice,
    bagPrice,
    copy,
  ]);

  function applyPreset(preset: Preset) {
    setLengthM(preset.length);
    setSpacingM(preset.spacing);
    setGates(preset.gates);
    setGateWidth(preset.gateWidth);
    setMode(preset.mode);
    setBoardMm(preset.board);
    setGapMm(preset.gap);
    setPanelM(preset.panel);
    setRailsPer(preset.rails);
    setWastePct(preset.waste);
    setBagsEach(preset.bags);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
    setPostPrice("");
    setRailPrice("");
    setBoardPrice("");
    setBagPrice("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const units = mode === "picket" ? `${result.boards} ${es ? "tablas" : "boards"}` : `${result.panels} ${es ? "paneles" : "panels"}`;
    const costText = result.cost == null ? "" : es ? `, costo ${formatNum(result.cost)}` : `, cost ${formatNum(result.cost)}`;
    const text = es
      ? `Valla: ${result.posts} postes, ${result.bays} vanos, ${result.rails} travesaños, ${units}, ${result.bagCount} sacos${costText}.`
      : `Fence: ${result.posts} posts, ${result.bays} bays, ${result.rails} rails, ${units}, ${result.bagCount} bags${costText}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) => (id === "privacy" ? copy.privacy : id === "gapped" ? copy.gapped : copy.panelPreset);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={buttonClass} onClick={() => applyPreset(preset)}>
                {presetLabel(preset.id)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.length}
            <input className={inputClass} inputMode="decimal" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.spacing}
            <input className={inputClass} inputMode="decimal" value={spacingM} onChange={(e) => setSpacingM(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.gates}
            <input className={inputClass} inputMode="numeric" value={gates} onChange={(e) => setGates(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.gateWidth}
            <input className={inputClass} inputMode="decimal" value={gateWidth} onChange={(e) => setGateWidth(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-2">
          <p className="text-sm">{copy.style}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={`${buttonClass} ${mode === "picket" ? "bg-muted" : ""}`} onClick={() => setMode("picket")}>
              {copy.picket}
            </button>
            <button type="button" className={`${buttonClass} ${mode === "panel" ? "bg-muted" : ""}`} onClick={() => setMode("panel")}>
              {copy.panel}
            </button>
          </div>
        </div>
        {mode === "picket" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              {copy.board}
              <input className={inputClass} inputMode="decimal" value={boardMm} onChange={(e) => setBoardMm(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.gap}
              <input className={inputClass} inputMode="decimal" value={gapMm} onChange={(e) => setGapMm(e.target.value)} />
            </label>
          </div>
        ) : (
          <label className="grid gap-1 text-sm">
            {copy.panelW}
            <input className={inputClass} inputMode="decimal" value={panelM} onChange={(e) => setPanelM(e.target.value)} />
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.rails}
            <input className={inputClass} inputMode="numeric" value={railsPer} onChange={(e) => setRailsPer(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {copy.bags}
          <input className={inputClass} inputMode="decimal" value={bagsEach} onChange={(e) => setBagsEach(e.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.postPrice}
            <input className={inputClass} inputMode="decimal" placeholder="0" value={postPrice} onChange={(e) => setPostPrice(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.railPrice}
            <input className={inputClass} inputMode="decimal" placeholder="0" value={railPrice} onChange={(e) => setRailPrice(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.boardPrice}
            <input className={inputClass} inputMode="decimal" placeholder="0" value={boardPrice} onChange={(e) => setBoardPrice(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.bagPrice}
            <input className={inputClass} inputMode="decimal" placeholder="0" value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} />
          </label>
        </div>
        <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={reset}>
          {copy.reset}
        </button>
      </form>
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {"error" in result ? (
          <p className="mt-3 text-sm text-destructive">{result.error}</p>
        ) : (
          <>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.posts}</dt>
                <dd className="font-medium">{result.posts}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.bays}</dt>
                <dd className="font-medium">{result.bays}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.infillBays}</dt>
                <dd className="font-medium">{result.infillBays}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.infill}</dt>
                <dd className="font-medium">{formatNum(result.infillLength)} m</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.last}</dt>
                <dd className="font-medium">{formatNum(result.lastBay)} m</dd>
              </div>
              {mode === "picket" ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.boards}</dt>
                  <dd className="font-medium">{result.boards}</dd>
                </div>
              ) : (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.panels}</dt>
                  <dd className="font-medium">{result.panels}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.railCount}</dt>
                <dd className="font-medium">{result.rails}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.bagCount}</dt>
                <dd className="font-medium">{result.bagCount}</dd>
              </div>
              {result.cost != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.cost}</dt>
                  <dd className="font-medium">{formatNum(result.cost)}</dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">{copy.note}</p>
            <button type="button" className={`${buttonClass} mt-4 w-full sm:w-auto`} onClick={copyResult}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
