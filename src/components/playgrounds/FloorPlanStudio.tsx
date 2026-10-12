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
    se: "-bottom-4 -right-4 cursor-se-resize",
    sw: "-bottom-4 -left-4 cursor-sw-resize",
    ne: "-top-4 -right-4 cursor-ne-resize",
    nw: "-top-4 -left-4 cursor-nw-resize",
  };
  return (
    <div
      onPointerDown={onDown}
      className={`absolute h-10 w-10 rounded-full border-[5px] border-white bg-primary shadow-[0_4px_12px_rgba(0,0,0,0.4)] ring-4 ring-primary/60 transition hover:scale-110 ${pos[position]}`}
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
    const id = generateId();
    const preset = furniturePresets[kind];
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
    if (dragRef.current) {
      const id = dragRef.current.id;
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== id) return it;
          return {
            ...it,
            x: Math.round(it.x * 2) / 2,
            y: Math.round(it.y * 2) / 2,
            w: Math.round(it.w * 2) / 2,
            h: Math.round(it.h * 2) / 2,
          };
        }),
      );
    }
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

      {/* Canvas — warmer paper tone, professional grid */}
      <div
        ref={containerRef}
        className="relative h-[min(560px,70vh)] w-full overflow-hidden rounded-2xl border border-slate-300/90 bg-[#f7f3eb] shadow-inner touch-none"
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
                stroke="#c9c2b6"
                strokeWidth="0.6"
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
                stroke="#8f8678"
                strokeWidth="1.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fps-grid)" />
          <rect width="100%" height="100%" fill="url(#fps-grid-major)" opacity="0.45" />
          {/* X scale ticks */}
          {Array.from({ length: 22 }).map((_, i) => (
            <g key={`x${i}`}>
              <line
                x1={i * PX_PER_M}
                y1={0}
                x2={i * PX_PER_M}
                y2={i % 5 === 0 ? 14 : 7}
                stroke="#57534e"
                strokeWidth={i % 5 === 0 ? 1.5 : 0.9}
              />
              {i % 5 === 0 && (
                <text x={i * PX_PER_M + 4} y={22} fontSize="11" fill="#44403c" fontWeight="700">
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
                x2={i % 5 === 0 ? 14 : 7}
                y2={i * PX_PER_M}
                stroke="#57534e"
                strokeWidth={i % 5 === 0 ? 1.5 : 0.9}
              />
              {i % 5 === 0 && i > 0 && (
                <text x={16} y={i * PX_PER_M + 4} fontSize="11" fill="#44403c" fontWeight="700">
                  {i}m
                </text>
              )}
            </g>
          ))}
        </svg>

        {items.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-2xl border border-stone-200/90 bg-white/95 px-6 py-4 text-sm text-stone-600 shadow-md backdrop-blur">
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
                  ? "rounded-md border-[18px] border-stone-800 shadow-[0_18px_48px_rgba(0,0,0,0.38),inset_0_0_0_6px_rgba(255,255,255,0.85)]"
                  : "rounded-2xl border-[5px] border-stone-600 shadow-2xl"
              } ${
                isSelected
                  ? isRoom
                    ? "ring-[8px] ring-primary ring-offset-6 ring-offset-[#f7f3eb] shadow-[0_0_0_4px_rgba(59,130,246,0.5)]"
                    : "border-primary ring-[7px] ring-primary shadow-[0_0_0_5px_rgba(59,130,246,0.35)]"
                  : isRoom
                    ? ""
                    : "border-stone-600"
              }`}
              style={{
                left,
                top,
                width,
                height,
                backgroundColor: isRoom ? "#fafaf9" : item.color,
                backgroundImage: isRoom
                  ? `linear-gradient(160deg, #ffffff 0%, ${item.color}30 40%, ${item.color}55 100%), repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,0,0,0.015) 16px, rgba(0,0,0,0.015) 17px), repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(0,0,0,0.01) 16px, rgba(0,0,0,0.01) 17px)`
                  : item.kind === "sofa"
                    ? `linear-gradient(100deg, ${item.color} 0%, ${item.color}cc 25%, ${item.color} 50%, ${item.color}bb 75%, ${item.color} 100%)`
                    : item.kind === "bed"
                      ? `linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 10%, ${item.color} 22%, ${item.color}ee 100%)`
                      : item.kind === "table"
                        ? `radial-gradient(ellipse at 50% 35%, ${item.color}ff 0%, ${item.color}dd 45%, ${item.color}aa 80%)`
                        : item.kind === "chair"
                          ? `radial-gradient(circle at 50% 25%, ${item.color}ff 0%, ${item.color}dd 55%, ${item.color} 85%)`
                          : item.kind === "lamp"
                            ? `radial-gradient(circle at center, #fff 0%, #fef3c7 30%, ${item.color} 70%)`
                            : undefined,
                transform: `rotate(${item.rotation}deg)`,
                transformOrigin: "center center",
                opacity: isRoom ? 1 : 0.98,
                boxShadow: isRoom
                  ? "inset 0 0 0 10px rgba(255,255,255,0.95), inset 0 0 30px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.32)"
                  : "0 14px 32px rgba(0,0,0,0.4), inset 0 4px 0 rgba(255,255,255,0.55), inset 0 -4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <span className="pointer-events-none flex flex-col items-center gap-1 px-1.5 text-center leading-tight">
                {icon && <span className="text-6xl leading-none drop-shadow-2xl">{icon}</span>}
                <span
                  className={`${isRoom ? "text-stone-900" : "text-white drop-shadow-xl"} font-bold tracking-tight text-[13px]`}
                >
                  {item.name}
                </span>
                {(isRoom || isSelected) && (
                  <span
                    className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${isRoom ? "bg-stone-100/95 text-stone-700 shadow-sm" : "bg-black/45 text-white/95"}`}
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
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-stone-200/90 bg-white/95 px-4 py-2.5 text-xs font-semibold text-stone-700 shadow-lg backdrop-blur">
            {selected.name}: {selected.w.toFixed(1)} × {selected.h.toFixed(1)} m
            {selected.type === "room" ? ` · ${(selected.w * selected.h).toFixed(1)} m²` : ""}
          </div>
        )}
      </div>

      {/* Footer stats + share */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface/40 px-4 py-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold">
            {t.area}: {totalArea.toFixed(1)} m²
          </span>
          <span className="text-xs text-muted-foreground">
            · {items.filter((i) => i.type === "room").length}{" "}
            {locale === "es"
              ? items.filter((i) => i.type === "room").length === 1
                ? "habitación"
                : "habitaciones"
              : items.filter((i) => i.type === "room").length === 1
                ? "room"
                : "rooms"}
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
