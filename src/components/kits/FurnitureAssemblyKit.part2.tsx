// Part 2 of 3 — split from FurnitureAssemblyKit.tsx on 2026-11-04. Edit here; FurnitureAssemblyKit.tsx re-exports.

export type Part = {
  id: string;
  name: string;
  type: "board" | "screw" | "dowel" | "leg" | "top";
  qty: number;
};

export type Step = {
  id: string;
  title: string;
  parts: Part[];
  completed: boolean;
};

export type Furniture = {
  type: string;
  difficulty: "easy" | "normal";
  steps: Step[];
};

export const TYPES = [
  { id: "shelf", en: "Simple Shelf", es: "Estantería simple" },
  { id: "desk", en: "Desk", es: "Escritorio" },
  { id: "chair", en: "Chair", es: "Silla" },
];

export const PRESETS: Record<string, Record<string, { steps: Omit<Step, "id" | "completed">[] }>> = {
  shelf: {
    easy: {
      steps: [
        { title: "Attach sides", parts: [{ id: "", name: "Side panel", type: "board", qty: 2 }] },
        { title: "Add shelves", parts: [{ id: "", name: "Shelf board", type: "board", qty: 2 }, { id: "", name: "Dowels", type: "dowel", qty: 8 }] },
      ],
    },
    normal: {
      steps: [
        { title: "Base frame", parts: [{ id: "", name: "Side panel", type: "board", qty: 2 }, { id: "", name: "Screws", type: "screw", qty: 4 }] },
        { title: "Middle shelves", parts: [{ id: "", name: "Shelf board", type: "board", qty: 3 }, { id: "", name: "Dowels", type: "dowel", qty: 12 }] },
        { title: "Top and finish", parts: [{ id: "", name: "Top board", type: "board", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 4 }] },
      ],
    },
  },
  desk: {
    easy: {
      steps: [
        { title: "Legs", parts: [{ id: "", name: "Leg", type: "leg", qty: 4 }] },
        { title: "Top", parts: [{ id: "", name: "Desktop", type: "top", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 8 }] },
      ],
    },
    normal: {
      steps: [
        { title: "Frame", parts: [{ id: "", name: "Leg", type: "leg", qty: 4 }, { id: "", name: "Support beam", type: "board", qty: 2 }] },
        { title: "Surface", parts: [{ id: "", name: "Desktop", type: "top", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 12 }] },
        { title: "Cable tray", parts: [{ id: "", name: "Tray board", type: "board", qty: 1 }, { id: "", name: "Dowels", type: "dowel", qty: 4 }] },
      ],
    },
  },
  chair: {
    easy: {
      steps: [
        { title: "Seat base", parts: [{ id: "", name: "Seat board", type: "board", qty: 1 }, { id: "", name: "Legs", type: "leg", qty: 4 }] },
        { title: "Back", parts: [{ id: "", name: "Backrest", type: "board", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 6 }] },
      ],
    },
    normal: {
      steps: [
        { title: "Legs & stretchers", parts: [{ id: "", name: "Leg", type: "leg", qty: 4 }, { id: "", name: "Stretcher", type: "board", qty: 2 }] },
        { title: "Seat", parts: [{ id: "", name: "Seat board", type: "board", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 8 }] },
        { title: "Backrest", parts: [{ id: "", name: "Backrest", type: "board", qty: 1 }, { id: "", name: "Dowels", type: "dowel", qty: 4 }] },
      ],
    },
  },
};

export const PART_NAMES: Record<string, {en: string; es: string}> = {
  "Side panel": {en: "Side panel", es: "Panel lateral"},
  "Shelf board": {en: "Shelf board", es: "Tabla de estante"},
  "Dowels": {en: "Dowels", es: "Espigas"},
  "Screws": {en: "Screws", es: "Tornillos"},
  "Top board": {en: "Top board", es: "Tabla superior"},
  "Leg": {en: "Leg", es: "Pata"},
  "Desktop": {en: "Desktop", es: "Encimera"},
  "Support beam": {en: "Support beam", es: "Viga de soporte"},
  "Tray board": {en: "Tray board", es: "Tabla de bandeja"},
  "Seat board": {en: "Seat board", es: "Tabla de asiento"},
  "Legs": {en: "Legs", es: "Patas"},
  "Backrest": {en: "Backrest", es: "Respaldo"},
  "Stretcher": {en: "Stretcher", es: "Travesaño"},
};

export const STEP_TITLES: Record<string, {en: string; es: string}> = {
  "Attach sides": {en: "Attach sides", es: "Fijar laterales"},
  "Add shelves": {en: "Add shelves", es: "Añadir estantes"},
  "Base frame": {en: "Base frame", es: "Marco base"},
  "Middle shelves": {en: "Middle shelves", es: "Estantes intermedios"},
  "Top and finish": {en: "Top and finish", es: "Tapa y acabado"},
  "Legs": {en: "Legs", es: "Patas"},
  "Top": {en: "Top", es: "Tapa"},
  "Frame": {en: "Frame", es: "Marco"},
  "Surface": {en: "Surface", es: "Superficie"},
  "Cable tray": {en: "Cable tray", es: "Bandeja de cables"},
  "Seat base": {en: "Seat base", es: "Base del asiento"},
  "Back": {en: "Back", es: "Respaldo"},
  "Legs & stretchers": {en: "Legs & stretchers", es: "Patas y travesaños"},
  "Seat": {en: "Seat", es: "Asiento"},
  "Backrest": {en: "Backrest", es: "Respaldo"},
};

export function locName(name: string, es: boolean) {
  const t = PART_NAMES[name];
  return t ? (es ? t.es : t.en) : name;
}
export function locTitle(title: string, es: boolean) {
  const t = STEP_TITLES[title];
  return t ? (es ? t.es : t.en) : title;
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function emptyFurniture(): Furniture {
  return { type: "shelf", difficulty: "normal", steps: [] };
}

export function loadPreset(type: string, diff: "easy" | "normal"): Furniture {
  const preset = PRESETS[type]?.[diff];
  if (!preset) return emptyFurniture();
  return {
    type,
    difficulty: diff,
    steps: preset.steps.map((s) => ({
      id: uid(),
      title: s.title,
      parts: s.parts.map((p) => ({ ...p, id: uid() })),
      completed: false,
    })),
  };
}

export function encodeState(f: Furniture): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify({ t: f.type, d: f.difficulty, s: f.steps.map(st => ({ id: st.id, title: st.title, completed: st.completed, parts: st.parts })) }))));
  } catch {
    return "";
  }
}

export function decodeState(s: string | null): Furniture | null {
  if (!s) return null;
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(s))));
    return {
      type: data.t || "shelf",
      difficulty: data.d || "normal",
      steps: (data.s || []).map((st: any) => ({
        id: st.id || uid(),
        title: st.title || "",
        completed: !!st.completed,
        parts: (st.parts || []).map((p: any) => ({ ...p, id: p.id || uid() })),
      })),
    };
  } catch {
    return null;
  }
}
