// Part 2 of 3 — split from CelebrationJourney.tsx on 2026-11-04. Edit here; CelebrationJourney.tsx re-exports.
import { type Occasion } from "./CelebrationJourney.part1";

export type Locale = "en" | "es";

export const OCCASIONS: Occasion[] = ["birthday", "wedding", "baby", "graduation", "party"];

export const OCCASION_META: Record<Occasion, { icon: string; gradient: string; accent: string }> = {
  birthday: { icon: "🎂", gradient: "from-pink-400 to-rose-500", accent: "text-rose-600" },
  wedding: { icon: "💍", gradient: "from-amber-200 to-yellow-400", accent: "text-amber-700" },
  baby: { icon: "🍼", gradient: "from-sky-300 to-blue-400", accent: "text-sky-700" },
  graduation: { icon: "🎓", gradient: "from-violet-400 to-purple-500", accent: "text-violet-700" },
  party: { icon: "🎉", gradient: "from-fuchsia-400 to-pink-500", accent: "text-fuchsia-700" },
};

export const LABELS = {
  en: {
    step1: "Step 1: Occasion & Guests",
    step2: "Step 2: Budget Breakdown",
    step3: "Step 3: Checklist",
    step4: "Step 4: Invite Preview",
    occasion: "Occasion",
    guests: "Number of guests",
    birthday: "Birthday",
    wedding: "Wedding",
    baby: "Baby shower",
    graduation: "Graduation",
    party: "Party",
    budget: "Budget",
    food: "Food & drinks",
    decor: "Decorations",
    gifts: "Gifts",
    venue: "Venue",
    total: "Total",
    checklist: "Tasks",
    addTask: "Add task",
    invite: "Invite card",
    host: "Host name",
    date: "Date",
    message: "Message",
    share: "Share link",
    copied: "Copied!",
    continue: "Continue",
    back: "Back",
    live: "Live preview",
    dragHint: "Drag or use ↑↓ to reorder",
    progress: "Progress",
    perGuest: "per guest",
    done: "done",
  },
  es: {
    step1: "Paso 1: Ocasión e invitados",
    step2: "Paso 2: Desglose de presupuesto",
    step3: "Paso 3: Lista de tareas",
    step4: "Paso 4: Vista previa de invitación",
    occasion: "Ocasión",
    guests: "Número de invitados",
    birthday: "Cumpleaños",
    wedding: "Boda",
    baby: "Baby shower",
    graduation: "Graduación",
    party: "Fiesta",
    budget: "Presupuesto",
    food: "Comida y bebida",
    decor: "Decoración",
    gifts: "Regalos",
    venue: "Lugar",
    total: "Total",
    checklist: "Tareas",
    addTask: "Añadir tarea",
    invite: "Tarjeta de invitación",
    host: "Nombre del anfitrión",
    date: "Fecha",
    message: "Mensaje",
    share: "Compartir enlace",
    copied: "¡Copiado!",
    continue: "Continuar",
    back: "Volver",
    live: "Vista previa en vivo",
    dragHint: "Arrastra o usa ↑↓ para reordenar",
    progress: "Progreso",
    perGuest: "por invitado",
    done: "hecho",
  },
} as const;

export function parseInitial(locale: Locale) {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const rawTasks = (p.get("tk") || "Send invites|Buy cake|Book venue").split("|").filter(Boolean);
  const done = (p.get("td") || "").split("|").filter(Boolean);
  return {
    step: Math.min(4, Math.max(1, Number(p.get("s")) || 1)),
    occasion: (OCCASIONS.includes(p.get("o") as Occasion) ? p.get("o") : "birthday") as Occasion,
    guests: Math.min(100, Math.max(1, Number(p.get("g")) || 20)),
    food: Number(p.get("f")) || 300,
    decor: Number(p.get("d")) || 100,
    gifts: Number(p.get("gi")) || 150,
    venue: Number(p.get("v")) || 200,
    host: p.get("h") || "Alex",
    date: p.get("dt") || "2026-12-15",
    message: p.get("m") || (locale === "es" ? "¡Ven a celebrar con nosotros!" : "Join us to celebrate!"),
    tasks: rawTasks.map((t) => ({ text: t, done: done.includes(t) })),
  };
}
