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
    se: "-bottom-1.5 -right-1.5 cursor-se-resize",
    sw: "-bottom-1.5 -left-1.5 cursor-sw-resize",
    ne: "-top-1.5 -right-1.5 cursor-ne-resize",
    nw: "-top-1.5 -left-1.5 cursor-nw-resize",
  };
  return (
    <div
      onPointerDown={onDown}
      className={`absolute h-3.5 w-3.5 rounded-full border-2 border-primary bg-white shadow-md ${pos[position]}`}
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
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-surface/50 p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t.rooms}
          </span>
          <button type="button" onClick={addRoom} className={btnPrimary}>
            + {t.addRoom}
          </button>
        </div>
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              {t.delete}
            </button>
          </>
        )}
        <label className="ml-auto flex items-center gap-2 rounded-xl border border-border/60 bg-background px-2.5 py-1 text-sm">
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
        className="relative h-[min(560px,70vh)] w-full overflow-hidden rounded-2xl border border-slate-300/80 bg-[#eef2f7] shadow-inner touch-none"
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
                stroke="#cbd5e1"
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
                stroke="#94a3b8"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fps-grid)" />
          <rect width="100%" height="100%" fill="url(#fps-grid-major)" opacity="0.5" />
        </svg>

        {items.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-2xl bg-white/80 px-5 py-3 text-sm text-slate-500 shadow-sm backdrop-blur">
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
                  ? "rounded-sm border-[3px] border-slate-700/80 shadow-md"
                  : "rounded-lg border-2 shadow-sm"
              } ${
                isSelected
                  ? isRoom
                    ? "ring-2 ring-primary ring-offset-1"
                    : "border-primary ring-2 ring-primary/50"
                  : isRoom
                    ? ""
                    : "border-slate-500/60"
              }`}
              style={{
                left,
                top,
                width,
                height,
                backgroundColor: isRoom ? item.color : item.color,
                backgroundImage: isRoom
                  ? `linear-gradient(135deg, ${item.color} 0%, ${item.color}ee 100%)`
                  : undefined,
                transform: `rotate(${item.rotation}deg)`,
                transformOrigin: "center center",
                opacity: isRoom ? 1 : 0.95,
                boxShadow: isRoom
                  ? "inset 0 0 0 1px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.12)"
                  : "0 1px 4px rgba(0,0,0,0.15)",
              }}
            >
              <span className="pointer-events-none flex flex-col items-center gap-0.5 px-1 text-center leading-tight">
                {icon && <span className="text-base leading-none drop-shadow-sm">{icon}</span>}
                <span className={`${isRoom ? "text-slate-800" : "text-white drop-shadow"} font-semibold`}>
                  {item.name}
                </span>
                {isRoom && (
                  <span className="text-[10px] font-normal text-slate-600">
                    {item.w.toFixed(1)}×{item.h.toFixed(1)} m · {(item.w * item.h).toFixed(1)} m²
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
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface/40 px-4 py-3 text-sm">
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
