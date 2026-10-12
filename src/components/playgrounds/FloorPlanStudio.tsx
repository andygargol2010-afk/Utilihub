"use client";

import { useEffect, useRef, useState } from "react";

type Locale = "en" | "es";

interface PlanItem {
  id: string;
  type: "room" | "furniture";
  kind?: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  color: string;
}

const PX_PER_M = 24;

const labels = {
  en: {
    addRoom: "Add room",
    rooms: "Rooms",
    furniture: "Furniture",
    addSofa: "Sofa",
    addTable: "Table",
    addBed: "Bed",
    addChair: "Chair",
    addLamp: "Lamp",
    rotate: "Rotate",
    delete: "Delete",
    area: "Total area",
    share: "Share link",
    copied: "Copied!",
    wallColor: "Wall color",
    emptyHint: "Add a room or furniture to start composing",
    scaleNote: "Scale: 1 m ≈ 24 px · Drag to move · Corner to resize · Tap to select",
  },
  es: {
    addRoom: "Agregar habitación",
    rooms: "Habitaciones",
    furniture: "Muebles",
    addSofa: "Sofá",
    addTable: "Mesa",
    addBed: "Cama",
    addChair: "Silla",
    addLamp: "Lámpara",
    rotate: "Rotar",
    delete: "Eliminar",
    area: "Área total",
    share: "Compartir enlace",
    copied: "¡Copiado!",
    wallColor: "Color de pared",
    emptyHint: "Agregá una habitación o un mueble para empezar",
    scaleNote: "Escala: 1 m ≈ 24 px · Arrastrá para mover · Esquina para redimensionar · Tocá para seleccionar",
  },
};

const furniturePresets: Record<
  string,
  { name: string; w: number; h: number; color: string; icon: string }
> = {
  sofa: { name: "Sofa", w: 2.2, h: 0.9, color: "#64748b", icon: "🛋️" },
  table: { name: "Table", w: 1.4, h: 0.8, color: "#a16207", icon: "🪑" },
  bed: { name: "Bed", w: 2.0, h: 1.6, color: "#475569", icon: "🛏️" },
  chair: { name: "Chair", w: 0.55, h: 0.55, color: "#78716c", icon: "💺" },
  lamp: { name: "Lamp", w: 0.45, h: 0.45, color: "#f59e0b", icon: "💡" },
};

const furnitureNameEs: Record<string, string> = {
  sofa: "Sofá",
  table: "Mesa",
  bed: "Cama",
  chair: "Silla",
  lamp: "Lámpara",
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function serialize(items: PlanItem[]) {
  try {
    return btoa(encodeURIComponent(JSON.stringify(items)));
  } catch {
    return "";
  }
}

function deserialize(raw: string): PlanItem[] {
  try {
    const json = decodeURIComponent(atob(raw));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((it) => it && typeof it.id === "string" && typeof it.x === "number");
  } catch {
    return [];
  }
}

function ResizeHandle({
  position,
  onDown,
}: {
  position: string;
  onDown: (e: React.PointerEvent) => void;
}) {
  const pos: Record<string, string> = {
    se: "-bottom-3 -right-3 cursor-se-resize",
    sw: "-bottom-3 -left-3 cursor-sw-resize",
    ne: "-top-3 -right-3 cursor-ne-resize",
    nw: "-top-3 -left-3 cursor-nw-resize",
  };
  return (
    <div
      onPointerDown={onDown}
      className={`absolute h-7 w-7 rounded-full border-[4px] border-primary bg-white shadow-2xl ring-4 ring-primary/30 ${pos[position]}`}
      style={{ touchAction: "none" }}
    />
  );
}

export function FloorPlanStudio({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [items, setItems] = useState<PlanItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wallColor, setWallColor] = useState("#f1f5f9");
  const [copied, setCopied] = useState(false);
  const dragRef = useRef<{
    id: string;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("plan");
    if (data) {
      const loaded = deserialize(data);
      if (loaded.length) setItems(loaded);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (items.length) {
      url.searchParams.set("plan", serialize(items));
    } else {
      url.searchParams.delete("plan");
    }
    window.history.replaceState({}, "", url.toString());
  }, [items]);

  useEffect(() => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((it) => (it.id === selectedId && it.type === "room" ? { ...it, color: wallColor } : it)),
    );
  }, [wallColor, selectedId]);

  const totalArea = items
    .filter((it) => it.type === "room")
    .reduce((sum, it) => sum + it.w * it.h, 0);

  const selected = items.find((it) => it.id === selectedId) ?? null;

  const addRoom = () => {
    const id = generateId();
    setItems((prev) => {
      const offset = prev.filter((it) => it.type === "room").length;
      return [
        ...prev,
        {
          id,
          type: "room",
          name: locale === "es" ? "Habitación" : "Room",
          x: 0.5 + (offset % 3) * 1.5,
          y: 0.5 + Math.floor(offset / 3) * 1.5,
          w: 4,
          h: 3,
          rotation: 0,
          color: wallColor,
        },
      ];
    });
    setSelectedId(id);
  };

  const addFurniture = (kind: keyof typeof furniturePresets) => {
    const preset = furniturePresets[kind];
    const id = generateId();
    setItems((prev) => {
      const offset = prev.filter((it) => it.type === "furniture").length;
      return [
        ...prev,
        {
          id,
          type: "furniture",
          kind,
          name: locale === "es" ? furnitureNameEs[kind] ?? preset.name : preset.name,
          x: 1.5 + (offset % 4) * 0.7,
          y: 1.5 + Math.floor(offset / 4) * 0.7,
          w: preset.w,
          h: preset.h,
          rotation: 0,
          color: preset.color,
        },
      ];
    });
    setSelectedId(id);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((it) => (it.id === selectedId ? { ...it, rotation: (it.rotation + 15) % 360 } : it)),
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedId));
    setSelectedId(null);
  };

  const onPointerDown = (e: React.PointerEvent, item: PlanItem, mode: "move" | "resize" = "move") => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(item.id);
    dragRef.current = {
      id: item.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
      origW: item.w,
      origH: item.h,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) / PX_PER_M;
    const dy = (e.clientY - dragRef.current.startY) / PX_PER_M;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== dragRef.current!.id) return it;
        if (dragRef.current!.mode === "resize") {
          return {
            ...it,
            w: Math.max(0.5, dragRef.current!.origW + dx),
            h: Math.max(0.5, dragRef.current!.origH + dy),
          };
        }
        return {
          ...it,
          x: Math.max(0, dragRef.current!.origX + dx),
          y: Math.max(0, dragRef.current!.origY + dy),
        };
      }),
    );
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onCanvasPointerDown = () => {
    setSelectedId(null);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const btnBase =
    "rounded-xl border border-border/80 bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-muted/60 active:scale-[0.98]";
  const btnPrimary =
    "rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.98]";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-surface/50 p-2.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t.rooms}
          </span>
          <button type="button" onClick={addRoom} className={btnPrimary}>
            + {t.addRoom}
          </button>
        </div>
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t.furniture}
          </span>
          {(["sofa", "table", "bed", "chair", "lamp"] as const).map((k) => (
            <button key={k} type="button" onClick={() => addFurniture(k)} className={btnBase}>
              <span className="mr-1">{furniturePresets[k].icon}</span>
              {locale === "es" ? furnitureNameEs[k] : furniturePresets[k].name}
            </button>
          ))}
        </div>
        {selectedId && (
          <>
            <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <button type="button" onClick={rotateSelected} className={btnBase}>
              ↻ {t.rotate}
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
            >
              {t.delete}
            </button>
          </>
        )}
        <label className="ml-auto flex items-center gap-2 rounded-xl border border-border/60 bg-background px-2.5 py-1 text-sm shadow-sm">
          <span className="text-muted-foreground">{t.wallColor}</span>
          <input
            type="color"
            value={wallColor}
            onChange={(e) => setWallColor(e.target.value)}
            className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent"
          />
        </label>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative h-[min(560px,70vh)] w-full overflow-hidden rounded-2xl border border-slate-300/80 bg-[#f4f7fb] shadow-inner touch-none"
        onPointerDown={onCanvasPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fps-grid" width={PX_PER_M} height={PX_PER_M} patternUnits="userSpaceOnUse">
              <path
                d={`M ${PX_PER_M} 0 L 0 0 0 ${PX_PER_M}`}
                fill="none"
                stroke="#d1d9e6"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="fps-grid-major"
              width={PX_PER_M * 5}
              height={PX_PER_M * 5}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${PX_PER_M * 5} 0 L 0 0 0 ${PX_PER_M * 5}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fps-grid)" />
          <rect width="100%" height="100%" fill="url(#fps-grid-major)" opacity="0.4" />
          {/* X scale ticks */}
          {Array.from({ length: 22 }).map((_, i) => (
            <g key={`x${i}`}>
              <line
                x1={i * PX_PER_M}
                y1={0}
                x2={i * PX_PER_M}
                y2={i % 5 === 0 ? 12 : 6}
                stroke="#475569"
                strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
              />
              {i % 5 === 0 && (
                <text x={i * PX_PER_M + 4} y={20} fontSize="10" fill="#334155" fontWeight="700">
                  {i}m
                </text>
              )}
            </g>
          ))}
          {/* Y scale ticks */}
          {Array.from({ length: 18 }).map((_, i) => (
            <g key={`y${i}`}>
              <line
                x1={0}
                y1={i * PX_PER_M}
                x2={i % 5 === 0 ? 12 : 6}
                y2={i * PX_PER_M}
                stroke="#475569"
                strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
              />
              {i % 5 === 0 && i > 0 && (
                <text x={14} y={i * PX_PER_M + 4} fontSize="10" fill="#334155" fontWeight="700">
                  {i}m
                </text>
              )}
            </g>
          ))}
        </svg>

        {items.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-2xl border border-slate-200/80 bg-white/95 px-6 py-4 text-sm text-slate-600 shadow-md backdrop-blur">
              {t.emptyHint}
            </p>
          </div>
        )}

        {items.map((item) => {
          const left = item.x * PX_PER_M;
          const top = item.y * PX_PER_M;
          const width = item.w * PX_PER_M;
          const height = item.h * PX_PER_M;
          const isSelected = selectedId === item.id;
          const isRoom = item.type === "room";
          const icon = item.kind ? furniturePresets[item.kind]?.icon : null;

          return (
            <div
              key={item.id}
              onPointerDown={(e) => onPointerDown(e, item, "move")}
              className={`absolute flex select-none flex-col items-center justify-center text-xs font-medium ${
                isSelected ? "z-20" : "z-10"
              } ${
                isRoom
                  ? "rounded-sm border-[12px] border-slate-800 shadow-2xl"
                  : "rounded-xl border-[4px] shadow-xl"
              } ${
                isSelected
                  ? isRoom
                    ? "ring-4 ring-primary ring-offset-4 ring-offset-white"
                    : "border-primary ring-4 ring-primary/60"
                  : isRoom
                    ? ""
                    : "border-slate-700"
              }`}
              style={{
                left,
                top,
                width,
                height,
                backgroundColor: isRoom ? "#fefefe" : item.color,
                backgroundImage: isRoom
                  ? `linear-gradient(180deg, #ffffff 0%, ${item.color}40 100%), repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(15,23,42,0.015) 8px, rgba(15,23,42,0.015) 16px)`
                  : item.kind === "sofa"
                    ? `linear-gradient(90deg, ${item.color} 0%, ${item.color}cc 25%, ${item.color} 50%, ${item.color}cc 75%, ${item.color} 100%)`
                    : item.kind === "bed"
                      ? `linear-gradient(180deg, #f1f5f9 0%, ${item.color} 12%, ${item.color} 100%)`
                      : item.kind === "table"
                        ? `radial-gradient(ellipse at center, ${item.color}f5 0%, ${item.color} 70%)`
                        : item.kind === "chair"
                          ? `radial-gradient(circle at 50% 35%, ${item.color}f0 0%, ${item.color} 75%)`
                          : item.kind === "lamp"
                            ? `radial-gradient(circle at center, #fffbeb 0%, ${item.color} 55%)`
                            : undefined,
                transform: `rotate(${item.rotation}deg)`,
                transformOrigin: "center center",
                opacity: isRoom ? 1 : 0.97,
                boxShadow: isRoom
                  ? "inset 0 0 0 6px rgba(255,255,255,0.9), inset 0 0 16px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.22)"
                  : "0 8px 20px rgba(0,0,0,0.28), inset 0 2px 0 rgba(255,255,255,0.35)",
              }}
            >
              <span className="pointer-events-none flex flex-col items-center gap-1 px-1.5 text-center leading-tight">
                {icon && <span className="text-3xl leading-none drop-shadow-lg">{icon}</span>}
                <span
                  className={`${isRoom ? "text-slate-900" : "text-white drop-shadow-lg"} font-bold tracking-tight text-[12px]`}
                >
                  {item.name}
                </span>
                {(isRoom || isSelected) && (
                  <span
                    className={`text-[10px] font-semibold ${isRoom ? "text-slate-600" : "text-white/90 drop-shadow"}`}
                  >
                    {item.w.toFixed(1)}×{item.h.toFixed(1)} m
                    {isRoom ? ` · ${(item.w * item.h).toFixed(1)} m²` : ""}
                  </span>
                )}
              </span>
              {isSelected && (
                <>
                  <ResizeHandle position="se" onDown={(e) => onPointerDown(e, item, "resize")} />
                  <ResizeHandle position="sw" onDown={(e) => onPointerDown(e, item, "resize")} />
                  <ResizeHandle position="ne" onDown={(e) => onPointerDown(e, item, "resize")} />
                  <ResizeHandle position="nw" onDown={(e) => onPointerDown(e, item, "resize")} />
                </>
              )}
            </div>
          );
        })}

        {/* Dimension readout for selection */}
        {selected && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur">
            {selected.name}: {selected.w.toFixed(2)} × {selected.h.toFixed(2)} m
            {selected.type === "room" ? ` · ${(selected.w * selected.h).toFixed(2)} m²` : ""}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface/40 px-4 py-3 text-sm shadow-sm">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-muted-foreground">{t.area}</span>
          <span className="text-2xl font-black tracking-tight text-primary">{totalArea.toFixed(1)}</span>
          <span className="font-semibold text-muted-foreground">m²</span>
          <span className="text-xs text-muted-foreground">
            · {items.filter((i) => i.type === "room").length} room
            {items.filter((i) => i.type === "room").length !== 1 ? "s" : ""}
          </span>
        </div>
        <button type="button" onClick={share} className={btnPrimary}>
          {copied ? t.copied : t.share}
        </button>
        <p className="w-full text-xs text-muted-foreground">{t.scaleNote}</p>
      </div>
    </div>
  );
}
