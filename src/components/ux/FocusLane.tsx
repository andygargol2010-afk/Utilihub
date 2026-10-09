import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

type Locale = "en" | "es";

type Copy = {
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

const COPY: Record<Locale, Copy> = {
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

function OrderBadge({ order, on }: { order: number; on: boolean }) {
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

function Slot({ order, on, children }: { order: number; on: boolean; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <OrderBadge order={order} on={on} />
    </div>
  );
}

export function FocusLane({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const nameId = useId();
  const noteId = useId();
  const [on, setOn] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(copy.sent);
  }

  function onCancel() {
    setName("");
    setNote("");
    setStatus(copy.cleared);
  }

  return (
    <main className="container-page py-8 sm:py-12">
      <section
        data-ux-focus={on ? "on" : "off"}
        className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{copy.title}</h1>
          <Slot order={1} on={on}>
            <Link
              to={copy.otherTo}
              className="text-sm font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
            >
              {copy.otherLabel}
            </Link>
          </Slot>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.lead}</p>
        <Slot order={2} on={on}>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => setOn((value) => !value)}
            className="mt-5 inline-flex items-center gap-3 rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <span
              aria-hidden="true"
              className={
                on
                  ? "relative h-5 w-9 rounded-full bg-sky-600"
                  : "relative h-5 w-9 rounded-full bg-slate-300 dark:bg-slate-600"
              }
            >
              <span
                className={
                  on
                    ? "absolute top-0.5 left-4 h-4 w-4 rounded-full bg-white"
                    : "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white"
                }
              />
            </span>
            {copy.toggle}: {on ? copy.on : copy.off}
          </button>
        </Slot>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{copy.hint}</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Slot order={3} on={on}>
            <label htmlFor={nameId} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
              {copy.name}
            </label>
            <input
              id={nameId}
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
            />
          </Slot>
          <Slot order={4} on={on}>
            <label htmlFor={noteId} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
              {copy.note}
            </label>
            <textarea
              id={noteId}
              name="note"
              value={note}
              rows={4}
              onChange={(event) => setNote(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
            />
          </Slot>
          <div className="flex flex-wrap gap-3">
            <Slot order={5} on={on}>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-amber-300 dark:text-slate-950"
              >
                {copy.submit}
              </button>
            </Slot>
            <Slot order={6} on={on}>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
              >
                {copy.cancel}
              </button>
            </Slot>
          </div>
        </form>
        <p className="mt-4 min-h-5 text-sm text-slate-600 dark:text-slate-300" role="status">
          {status}
        </p>
      </section>
    </main>
  );
}
