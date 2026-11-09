import { useEffect, useState } from "react";

const KEY = "utilihub.houseModeler.onboarded.v1";

const TEXT = {
  en: {
    title: "Quick start",
    steps: [
      "Drag a piece from the palette onto the scene (or tap it, then tap the ground).",
      "Orbit: drag with one finger / left mouse. Pan: two fingers / right mouse. Zoom: pinch / wheel.",
      "Undo with Ctrl+Z. Your design is saved automatically.",
    ],
    ok: "Got it",
  },
  es: {
    title: "Inicio rápido",
    steps: [
      "Arrastra una pieza de la paleta a la escena (o tócala y luego toca el suelo).",
      "Orbitar: un dedo / botón izquierdo. Desplazar: dos dedos / botón derecho. Zoom: pellizcar / rueda.",
      "Deshaz con Ctrl+Z. Tu diseño se guarda automáticamente.",
    ],
    ok: "Entendido",
  },
};

function seen(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** First-visit overlay that explains placing, camera gestures and autosave; remembered once dismissed. */
export function OnboardingHint({ es }: { es: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(!seen());
  }, []);
  if (!open) return null;
  const t = es ? TEXT.es : TEXT.en;
  const close = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked: hint simply shows again next visit */
    }
  };
  return (
    <div
      role="dialog"
      aria-label={t.title}
      data-testid="hm-onboarding"
      className="absolute bottom-3 left-3 right-3 z-20 mx-auto max-w-md rounded-xl border border-border bg-card/95 p-3 text-xs shadow-lg backdrop-blur sm:left-auto sm:right-3 sm:mx-0"
    >
      <p className="mb-1 text-sm font-semibold text-foreground">{t.title}</p>
      <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
        {t.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={close}
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        {t.ok}
      </button>
    </div>
  );
}
