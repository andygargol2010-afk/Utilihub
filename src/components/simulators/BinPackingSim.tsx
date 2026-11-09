import { useState, useCallback, useMemo, useEffect } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";
import { BIN_W } from "./BinPackingSim.part1";
import { type ItemType, ITEM_TYPES, type Placed, CHALLENGES, BIN_H, readBest, writeBest, updateUrl } from "./BinPackingSim.part2";

export function BinPackingSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const [selected, setSelected] = useState<ItemType | null>(ITEM_TYPES[0]);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [nextId, setNextId] = useState(1);
  const [challengeId, setChallengeId] = useState("free");
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const challenge = CHALLENGES.find((c) => c.id === challengeId) ?? CHALLENGES[0];
  const binArea = BIN_W * BIN_H;
  const used = placed.reduce((sum, p) => sum + p.type.w * p.type.h, 0);
  const util = binArea ? Math.round((used / binArea) * 100) : 0;
  const score = util;

  const availableItems = useMemo(() => {
    if (!challenge.allowedIds) return ITEM_TYPES;
    return ITEM_TYPES.filter((it) => challenge.allowedIds!.includes(it.id));
  }, [challenge]);

  const uniqueTypes = useMemo(() => new Set(placed.map((p) => p.type.id)).size, [placed]);

  const challengeMet = useMemo(() => {
    if (challenge.id === "free") return false;
    if (util < challenge.targetUtil) return false;
    if (challenge.id === "mixed70" && uniqueTypes < 3) return false;
    return true;
  }, [challenge, util, uniqueTypes]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chParam = params.get("ch");
    if (chParam && CHALLENGES.some((c) => c.id === chParam)) {
      setChallengeId(chParam);
      const ch = CHALLENGES.find((c) => c.id === chParam)!;
      const avail = ch.allowedIds
        ? ITEM_TYPES.filter((it) => ch.allowedIds!.includes(it.id))
        : ITEM_TYPES;
      setSelected(avail[0] ?? null);
    }
    setBest(readBest(`bin-packing-best-${challengeId}`));
  }, []);

  useEffect(() => {
    if (util > 0) {
      const nextBest = writeBest(`bin-packing-best-${challengeId}`, util);
      setBest(nextBest);
    }
  }, [util, challengeId]);

  const canPlace = useCallback(
    (x: number, y: number, item: ItemType) => {
      if (x < 0 || y < 0 || x + item.w > BIN_W || y + item.h > BIN_H) return false;
      for (const p of placed) {
        if (x < p.x + p.type.w && x + item.w > p.x && y < p.y + p.type.h && y + item.h > p.y) {
          return false;
        }
      }
      return true;
    },
    [placed],
  );

  const onBinClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selected) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const gx = Math.floor(relX / (rect.width / BIN_W));
    const gy = Math.floor(relY / (rect.height / BIN_H));
    if (canPlace(gx, gy, selected)) {
      setPlaced((prev) => [...prev, { id: nextId, type: selected, x: gx, y: gy }]);
      setNextId((n) => n + 1);
      setMoves((m) => m + 1);
    }
  };

  const undo = () => {
    if (placed.length === 0) return;
    setPlaced((prev) => prev.slice(0, -1));
    setMoves((m) => Math.max(0, m - 1));
  };

  const reset = () => {
    setPlaced([]);
    setNextId(1);
    setMoves(0);
    if (!availableItems.find((it) => it.id === selected?.id)) {
      setSelected(availableItems[0] ?? null);
    }
  };

  const selectChallenge = (id: string) => {
    setChallengeId(id);
    setPlaced([]);
    setNextId(1);
    setMoves(0);
    const ch = CHALLENGES.find((c) => c.id === id);
    const avail = ch?.allowedIds
      ? ITEM_TYPES.filter((it) => ch.allowedIds!.includes(it.id))
      : ITEM_TYPES;
    setSelected(avail[0] ?? null);
    updateUrl(id);
    setBest(readBest(`bin-packing-best-${id}`));
  };

  const shareUrl = useCallback(async () => {
    updateUrl(challengeId);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [challengeId]);

  const downloadPng = useCallback(() => {
    const cell = 32;
    const pad = 20;
    const headerH = 90;
    const footerH = 36;
    const w = pad * 2 + BIN_W * cell;
    const h = headerH + footerH + pad * 2 + BIN_H * cell;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#0f172a");
    bg.addColorStop(1, "#020617");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(0, 0, w, 6);

    ctx.fillStyle = "#e0f2fe";
    ctx.font = "bold 24px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Empaque de Cajas" : "Bin Packing", w / 2, 36);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#7dd3fc";
    ctx.fillText(
      `${es ? "Utilización" : "Utilization"}: ${util}%  ·  ${es ? "Puntuación" : "Score"}: ${score}  ·  ${es ? "Piezas" : "Pieces"}: ${placed.length}`,
      w / 2,
      62,
    );
    ctx.fillText(es ? challenge.nameEs : challenge.nameEn, w / 2, 84);

    const startX = pad;
    const startY = headerH + pad;
    // grid background
    ctx.strokeStyle = "rgba(56,189,248,0.25)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= BIN_W; x++) {
      ctx.beginPath();
      ctx.moveTo(startX + x * cell, startY);
      ctx.lineTo(startX + x * cell, startY + BIN_H * cell);
      ctx.stroke();
    }
    for (let y = 0; y <= BIN_H; y++) {
      ctx.beginPath();
      ctx.moveTo(startX, startY + y * cell);
      ctx.lineTo(startX + BIN_W * cell, startY + y * cell);
      ctx.stroke();
    }

    placed.forEach((p) => {
      const px = startX + p.x * cell;
      const py = startY + p.y * cell;
      const pw = p.type.w * cell;
      const ph = p.type.h * cell;
      ctx.fillStyle = p.type.color;
      ctx.fillRect(px + 1, py + 1, pw - 2, ph - 2);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 1, py + 1, pw - 2, ph - 2);
    });

    ctx.fillStyle = "#7dd3fc";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("utilihub.app", w / 2, h - 14);

    const link = document.createElement("a");
    link.download = `bin-packing-${challengeId}-${util}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [placed, util, score, challengeId, challenge, es]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {CHALLENGES.map((ch) => (
          <SimSecondaryButton
            key={ch.id}
            theme="lab"
            active={challengeId === ch.id}
            onClick={() => selectChallenge(ch.id)}
          >
            {es ? ch.nameEs : ch.nameEn}
          </SimSecondaryButton>
        ))}
      </div>

      <p className="text-center text-xs text-white/60">
        {es ? challenge.descEs : challenge.descEn}
        {challenge.targetUtil > 0 && (
          <>
            {" "}
            {es ? "Meta" : "Target"}: {challenge.targetUtil}%
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-2">
        {availableItems.map((it) => (
          <SimSecondaryButton
            key={it.id}
            theme="lab"
            active={selected?.id === it.id}
            onClick={() => setSelected(it)}
          >
            {es ? it.labelEs : it.labelEn}
          </SimSecondaryButton>
        ))}
        <SimPrimaryButton theme="lab" onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </SimPrimaryButton>
        <SimSecondaryButton theme="lab" onClick={undo} disabled={placed.length === 0}>
          {es ? "Deshacer" : "Undo"}
        </SimSecondaryButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90">
          {es ? "Utilización" : "Utilization"}:{" "}
          <span className={`tabular-nums font-bold ${challengeMet ? "text-emerald-300" : "text-sky-200"}`}>
            {util}%
          </span>
          {challengeMet && <span className="ml-1 text-emerald-300">✓</span>}
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90">
          {es ? "Puntuación" : "Score"}: <span className="tabular-nums text-white">{score}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/90">
          {es ? "Movimientos" : "Moves"}: <span className="tabular-nums text-white">{moves}</span>
        </span>
        {best != null && (
          <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-amber-200">
            {es ? "Mejor" : "Best"}: <span className="tabular-nums">{best}%</span>
          </span>
        )}
        <SimSecondaryButton theme="lab" onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir enlace" : "Share link"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={downloadPng}>
          {es ? "Descargar PNG" : "Download PNG"}
        </SimSecondaryButton>
      </div>

      <div className="text-center">
        <p className="text-xs text-white/50">
          {es ? `Área usada ${used}/${binArea}` : `Used ${used}/${binArea}`}
          {challenge.id === "mixed70" && (
            <> · {es ? "Tipos" : "Types"}: {uniqueTypes}/3</>
          )}
        </p>
      </div>

      <div
        className="relative mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-sky-400/40 bg-black/40"
        style={{ 
          width: "100%", 
          maxWidth: 320, 
          aspectRatio: `${BIN_W}/${BIN_H}`,
          backgroundImage: `linear-gradient(to right, rgba(56,189,248,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.15) 1px, transparent 1px)`,
          backgroundSize: `${100 / BIN_W}% ${100 / BIN_H}%`,
        }}
        onClick={onBinClick}
      >
        {placed.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm border border-white/30"
            style={{
              left: `${(p.x / BIN_W) * 100}%`,
              top: `${(p.y / BIN_H) * 100}%`,
              width: `${(p.type.w / BIN_W) * 100}%`,
              height: `${(p.type.h / BIN_H) * 100}%`,
              backgroundColor: p.type.color,
            }}
          />
        ))}
      </div>

      <p className="text-center text-xs text-white/55">
        {es
          ? "Elegí un tamaño y hacé clic en el contenedor para colocar. Evitá solapamientos. Deshacé el último movimiento."
          : "Select a size and click in the bin to place. Avoid overlaps. Undo last placement."}
        {challengeMet && (
          <span className="mt-1 block font-semibold text-emerald-300">
            {es ? "¡Desafío completado!" : "Challenge complete!"}
          </span>
        )}
      </p>
    </div>
  );
}
