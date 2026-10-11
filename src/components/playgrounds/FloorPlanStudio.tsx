"use client";

import { useEffect, useRef, useState } from "react";

type Locale = "en" | "es";

interface PlanItem {
  id: string;
  type: "room" | "furniture";
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
    scaleNote: "Scale: 1 m ≈ 24 px. Drag to move. Drag corner to resize. Tap to select.",
  },
  es: {
    addRoom: "Agregar habitación",
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
    scaleNote: "Escala: 1 m ≈ 24 px. Arrastrá para mover. Arrastrá la esquina para redimensionar. Tocá para seleccionar.",
  },
};

const furniturePresets = {
  sofa: { name: "Sofa", w: 2.2, h: 0.9, color: "#64748b" },
  table: { name: "Table", w: 1.4, h: 0.8, color: "#78716c" },
  bed: { name: "Bed", w: 2.0, h: 1.6, color: "#475569" },
  chair: { name: "Chair", w: 0.5, h: 0.5, color: "#a8a29e" },
  lamp: { name: "Lamp", w: 0.4, h: 0.4, color: "#fbbf24" },
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

export function FloorPlanStudio({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [items, setItems] = useState<PlanItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wallColor, setWallColor] = useState("#e2e8f0");
  const [copied, setCopied] = useState(false);
  const dragRef = useRef<{ id: string; mode: "move" | "resize"; startX: number; startY: number; origX: number; origY: number; origW: number; origH: number } | null>(null);
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
    setItems((prev) => [
      ...prev,
      {
        id,
        type: "room",
        name: locale === "es" ? "Habitación" : "Room",
        x: 40 + prev.length * 20,
        y: 40 + prev.length * 15,
        w: 4,
        h: 3,
        rotation: 0,
        color: wallColor,
      },
    ]);
    setSelectedId(id);
  };

  const addFurniture = (kind: keyof typeof furniturePresets) => {
    const preset = furniturePresets[kind];
    const id = generateId();
    setItems((prev) => [
      ...prev,
      {
        id,
        type: "furniture",
        name:
          locale === "es"
            ? kind === "sofa"
              ? "Sofá"
              : kind === "table"
                ? "Mesa"
                : kind === "bed"
                  ? "Cama"
                  : kind === "chair"
                    ? "Silla"
                    : "Lámpara"
            : preset.name,
        x: 100,
        y: 100,
        w: preset.w,
        h: preset.h,
        rotation: 0,
        color: preset.color,
      },
    ]);
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addRoom}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
        >
          {t.addRoom}
        </button>
        <button
          type="button"
          onClick={() => addFurniture("sofa")}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        >
          {t.addSofa}
        </button>
        <button
          type="button"
          onClick={() => addFurniture("table")}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        >
          {t.addTable}
        </button>
        <button
          type="button"
          onClick={() => addFurniture("bed")}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        >
          {t.addBed}
        </button>
        <button
          type="button"
          onClick={() => addFurniture("chair")}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        >
          {t.addChair}
        </button>
        <button
          type="button"
          onClick={() => addFurniture("lamp")}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        >
          {t.addLamp}
        </button>
        {selectedId && (
          <>
            <button
              type="button"
              onClick={rotateSelected}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            >
              {t.rotate}
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700"
            >
              {t.delete}
            </button>
          </>
        )}
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span>{t.wallColor}</span>
          <input
            type="color"
            value={wallColor}
            onChange={(e) => setWallColor(e.target.value)}
            className="h-8 w-10 cursor-pointer rounded border"
          />
        </label>
      </div>

      <div
        ref={containerRef}
        className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-border/70 bg-slate-100 shadow-inner touch-none"
        onPointerDown={onCanvasPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width={PX_PER_M} height={PX_PER_M} patternUnits="userSpaceOnUse">
              <path
                d={`M ${PX_PER_M} 0 L 0 0 0 ${PX_PER_M}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {items.map((item) => {
          const left = item.x * PX_PER_M;
          const top = item.y * PX_PER_M;
          const width = item.w * PX_PER_M;
          const height = item.h * PX_PER_M;
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onPointerDown={(e) => onPointerDown(e, item, "move")}
              className={`absolute flex cursor-move select-none items-center justify-center rounded border-2 text-xs font-medium shadow-sm ${
                isSelected ? "z-10 border-primary ring-2 ring-primary/40" : "border-slate-400"
              } ${item.type === "room" ? "bg-white/90" : ""}`}
              style={{
                left,
                top,
                width,
                height,
                backgroundColor: item.color,
                transform: `rotate(${item.rotation}deg)`,
                transformOrigin: "center center",
                opacity: item.type === "furniture" ? 0.85 : 1,
              }}
            >
              <span className="pointer-events-none px-1 text-center leading-tight text-slate-800">
                {item.name}
                {item.type === "room" && (
                  <span className="block text-[10px] font-normal opacity-70">
                    {(item.w * item.h).toFixed(1)} m²
                  </span>
                )}
              </span>
              {isSelected && (
                <div
                  onPointerDown={(e) => onPointerDown(e, item, "resize")}
                  className="absolute -bottom-1 -right-1 h-4 w-4 cursor-se-resize rounded-sm border-2 border-primary bg-white shadow"
                  style={{ touchAction: "none" }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface/40 p-4 text-sm">
        <div>
          <span className="font-semibold">{t.area}: </span>
          <span className="text-lg font-bold text-primary">{totalArea.toFixed(1)} m²</span>
        </div>
        <button
          type="button"
          onClick={share}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {copied ? t.copied : t.share}
        </button>
        <p className="w-full text-xs text-muted-foreground">{t.scaleNote}</p>
      </div>
    </div>
  );
}
