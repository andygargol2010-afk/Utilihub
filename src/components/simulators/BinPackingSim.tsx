import { useState, useCallback, useMemo } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const BIN_W = 10;
const BIN_H = 6;

type ItemType = {
  id: string;
  w: number;
  h: number;
  color: string;
  labelEn: string;
  labelEs: string;
};

const ITEM_TYPES: ItemType[] = [
  { id: "s2", w: 2, h: 2, color: "#3b82f6", labelEn: "2×2", labelEs: "2×2" },
  { id: "r31", w: 3, h: 1, color: "#10b981", labelEn: "3×1", labelEs: "3×1" },
  { id: "r13", w: 1, h: 3, color: "#f59e0b", labelEn: "1×3", labelEs: "1×3" },
  { id: "s1", w: 1, h: 1, color: "#ef4444", labelEn: "1×1", labelEs: "1×1" },
  { id: "r42", w: 4, h: 2, color: "#8b5cf6", labelEn: "4×2", labelEs: "4×2" },
];

type Placed = { id: number; type: ItemType; x: number; y: number };

type Challenge = {
  id: string;
  nameEn: string;
  nameEs: string;
  descEn: string;
  descEs: string;
  targetUtil: number;
  allowedIds?: string[];
};

const CHALLENGES: Challenge[] = [
  {
    id: "free",
    nameEn: "Free play",
    nameEs: "Libre",
    descEn: "Any items. Maximize utilization.",
    descEs: "Cualquier pieza. Maximizá la utilización.",
    targetUtil: 0,
  },
  {
    id: "util80",
    nameEn: "80% challenge",
    nameEs: "Desafío 80%",
    descEn: "Reach at least 80% utilization.",
    descEs: "Alcanzá al menos 80% de utilización.",
    targetUtil: 80,
  },
  {
    id: "small90",
    nameEn: "Small items 90%",
    nameEs: "Pequeñas 90%",
    descEn: "Only 1×1 and 2×2. Reach 90%.",
    descEs: "Solo 1×1 y 2×2. Alcanzá 90%.",
    targetUtil: 90,
    allowedIds: ["s1", "s2"],
  },
  {
    id: "mixed70",
    nameEn: "Mixed 70%",
    nameEs: "Mixto 70%",
    descEn: "Use at least 3 different sizes. Reach 70%.",
    descEs: "Usá al menos 3 tamaños distintos. Alcanzá 70%.",
    targetUtil: 70,
  },
];

export function BinPackingSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const [selected, setSelected] = useState<ItemType | null>(ITEM_TYPES[0]);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [nextId, setNextId] = useState(1);
  const [challengeId, setChallengeId] = useState("free");

  const challenge = CHALLENGES.find((c) => c.id === challengeId) ?? CHALLENGES[0];
  const binArea = BIN_W * BIN_H;
  const used = placed.reduce((sum, p) => sum + p.type.w * p.type.h, 0);
  const util = binArea ? Math.round((used / binArea) * 100) : 0;

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
    }
  };

  const reset = () => {
    setPlaced([]);
    setNextId(1);
    if (!availableItems.find((it) => it.id === selected?.id)) {
      setSelected(availableItems[0] ?? null);
    }
  };

  const selectChallenge = (id: string) => {
    setChallengeId(id);
    setPlaced([]);
    setNextId(1);
    const ch = CHALLENGES.find((c) => c.id === id);
    const avail = ch?.allowedIds
      ? ITEM_TYPES.filter((it) => ch.allowedIds!.includes(it.id))
      : ITEM_TYPES;
    setSelected(avail[0] ?? null);
  };

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
      </div>

      <div className="text-center">
        <p className="text-sm font-bold text-white/80">
          {es ? "Utilización" : "Utilization"}:{" "}
          <span className={`tabular-nums ${challengeMet ? "text-emerald-300" : "text-sky-200"}`}>
            {util}%
          </span>
          {challengeMet && <span className="ml-2 text-emerald-300">✓</span>}
        </p>
        <p className="text-xs text-white/50">
          {es ? `Área usada ${used}/${binArea}` : `Used ${used}/${binArea}`}
          {challenge.id === "mixed70" && (
            <> · {es ? "Tipos" : "Types"}: {uniqueTypes}/3</>
          )}
        </p>
      </div>

      <div
        className="relative mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-sky-400/40 bg-black/40"
        style={{ width: "100%", maxWidth: 280, aspectRatio: `${BIN_W}/${BIN_H}` }}
        onClick={onBinClick}
      >
        {placed.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm border border-white/20"
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
          ? "Elegí un tamaño y hacé clic en el contenedor para colocar. Evitá solapamientos."
          : "Select a size and click in the bin to place. Avoid overlaps."}
        {challengeMet && (
          <span className="mt-1 block font-semibold text-emerald-300">
            {es ? "¡Desafío completado!" : "Challenge complete!"}
          </span>
        )}
      </p>
    </div>
  );
}
