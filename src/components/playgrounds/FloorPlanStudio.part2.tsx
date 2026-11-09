"use client";
// Part 2 of 3 — split from FloorPlanStudio.tsx on 2026-11-04. Edit here; FloorPlanStudio.tsx re-exports.

export interface PlanItem {
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

export const PX_PER_M = 24;

export const labels = {
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

export const furniturePresets: Record<
  string,
  { name: string; w: number; h: number; color: string; icon: string }
> = {
  sofa: { name: "Sofa", w: 2.2, h: 0.9, color: "#64748b", icon: "🛋️" },
  table: { name: "Table", w: 1.4, h: 0.8, color: "#a16207", icon: "🪑" },
  bed: { name: "Bed", w: 2.0, h: 1.6, color: "#475569", icon: "🛏️" },
  chair: { name: "Chair", w: 0.55, h: 0.55, color: "#78716c", icon: "💺" },
  lamp: { name: "Lamp", w: 0.45, h: 0.45, color: "#f59e0b", icon: "💡" },
};

export const furnitureNameEs: Record<string, string> = {
  sofa: "Sofá",
  table: "Mesa",
  bed: "Cama",
  chair: "Silla",
  lamp: "Lámpara",
};

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function serialize(items: PlanItem[]) {
  try {
    return btoa(encodeURIComponent(JSON.stringify(items)));
  } catch {
    return "";
  }
}

export function deserialize(raw: string): PlanItem[] {
  try {
    const json = decodeURIComponent(atob(raw));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((it) => it && typeof it.id === "string" && typeof it.x === "number");
  } catch {
    return [];
  }
}

export function ResizeHandle({
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
