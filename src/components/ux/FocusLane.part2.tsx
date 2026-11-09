// Part 2 of 3 — split from FocusLane.tsx on 2026-11-04. Edit here; FocusLane.tsx re-exports.
import { type ReactNode } from "react";
import { type Locale } from "./FocusLane.part1";

export type Copy = {
  title: string;
  lead: string;
  otherLabel: string;
  otherTo: "/ux/focus-lane" | "/es/ux/carril-foco";
  toggle: string;
  on: string;
  off: string;
  name: string;
  note: string;
  submit: string;
  cancel: string;
  sent: string;
  cleared: string;
  hint: string;
};

export const COPY: Record<Locale, Copy> = {
  en: {
    title: "Focus lane",
    lead: "Turn the lane on to number every tabbable control in tab order. Turning it off removes the numbers. Nothing is stored in this browser.",
    otherLabel: "Español",
    otherTo: "/es/ux/carril-foco",
    toggle: "Show tab order",
    on: "On",
    off: "Off",
    name: "Name",
    note: "Note",
    submit: "Submit",
    cancel: "Cancel",
    sent: "Note kept on this page only. Refresh clears it.",
    cleared: "Fields cleared.",
    hint: "Tab through the lane. Badges follow focus order, not visual importance.",
  },
  es: {
    title: "Carril de foco",
    lead: "Encender numera cada control tabulable en el orden de tabulación. Apagar quita los números. Nada se guarda en este navegador.",
    otherLabel: "English",
    otherTo: "/ux/focus-lane",
    toggle: "Mostrar orden de tabulación",
    on: "Encendido",
    off: "Apagado",
    name: "Nombre",
    note: "Nota",
    submit: "Enviar",
    cancel: "Cancelar",
    sent: "La nota queda solo en esta página. Recargar la borra.",
    cleared: "Campos vaciados.",
    hint: "Tabulá el carril. Las insignias siguen el orden de foco, no la importancia visual.",
  },
};

export function OrderBadge({ order, on }: { order: number; on: boolean }) {
  if (!on) return null;
  return (
    <span
      data-ux-order={order}
      aria-hidden="true"
      className="pointer-events-none absolute -top-2 right-1 z-10 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[11px] font-semibold text-white dark:bg-amber-300 dark:text-slate-950"
    >
      {order}
    </span>
  );
}

export function Slot({ order, on, children }: { order: number; on: boolean; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <OrderBadge order={order} on={on} />
    </div>
  );
}
