import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

type Locale = "en" | "es";
type Density = "compact" | "comfortable" | "spacious";

type Copy = {
  title: string;
  lead: string;
  otherLabel: string;
  otherTo: "/ux/density-lab" | "/es/ux/laboratorio-densidad";
  compact: string;
  comfortable: string;
  spacious: string;
  reset: string;
  current: string;
  hint: string;
  cards: { title: string; body: string }[];
};

const COPY: Record<Locale, Copy> = {
  en: {
    title: "Density lab",
    lead: "Choose how much space the sample cards use. Compact packs them tighter, spacious gives them room. The choice is saved in this browser (utilihub-ux-density).",
    otherLabel: "Español",
    otherTo: "/es/ux/laboratorio-densidad",
    compact: "Compact",
    comfortable: "Comfortable",
    spacious: "Spacious",
    reset: "Reset to default",
    current: "Current density",
    hint: "The container carries data-ux-density. Refresh keeps the last choice unless you reset.",
    cards: [
      { title: "Sample card one", body: "A short description of something useful. Density changes the gaps and padding around these cards." },
      { title: "Sample card two", body: "Another item in the list. Comfortable is the default when nothing is stored." },
      { title: "Sample card three", body: "Compact reduces vertical space so more fits on screen." },
      { title: "Sample card four", body: "Spacious adds breathing room between items." },
      { title: "Sample card five", body: "This is only a layout experiment. No tools or catalog are affected." },
      { title: "Sample card six", body: "Ads and the rest of the site stay as they are." },
    ],
  },
  es: {
    title: "Laboratorio de densidad",
    lead: "Elegí cuánto espacio usan las tarjetas de muestra. Compacta las junta más, espaciosa les da aire. La elección se guarda en este navegador (utilihub-ux-density).",
    otherLabel: "English",
    otherTo: "/ux/density-lab",
    compact: "Compacta",
    comfortable: "Cómoda",
    spacious: "Espaciosa",
    reset: "Restablecer predeterminado",
    current: "Densidad actual",
    hint: "El contenedor lleva data-ux-density. Recargar mantiene la última elección salvo que restablezcas.",
    cards: [
      { title: "Tarjeta de muestra uno", body: "Una descripción corta de algo útil. La densidad cambia los espacios y el padding alrededor de estas tarjetas." },
      { title: "Tarjeta de muestra dos", body: "Otro ítem en la lista. Cómoda es el predeterminado cuando no hay nada guardado." },
      { title: "Tarjeta de muestra tres", body: "Compacta reduce el espacio vertical para que entre más en pantalla." },
      { title: "Tarjeta de muestra cuatro", body: "Espaciosa agrega aire entre los ítems." },
      { title: "Tarjeta de muestra cinco", body: "Esto es solo un experimento de layout. No afecta herramientas ni el catálogo." },
      { title: "Tarjeta de muestra seis", body: "Los anuncios y el resto del sitio quedan igual." },
    ],
  },
};

const STORAGE_KEY = "utilihub-ux-density";
const DEFAULT_DENSITY: Density = "comfortable";

function densityClasses(density: Density): string {
  if (density === "compact") return "gap-2 p-3 text-sm";
  if (density === "spacious") return "gap-8 p-6 text-base";
  return "gap-4 p-4 text-sm";
}

export function DensityLab({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [density, setDensity] = useState<Density>(DEFAULT_DENSITY);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "compact" || stored === "comfortable" || stored === "spacious") {
        setDensity(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, density);
    } catch {
      /* ignore */
    }
  }, [density]);

  function choose(next: Density) {
    setDensity(next);
  }

  function reset() {
    setDensity(DEFAULT_DENSITY);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="container-page py-8 sm:py-12">
      <section className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{copy.title}</h1>
          <Link
            to={copy.otherTo}
            className="text-sm font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
          >
            {copy.otherLabel}
          </Link>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.lead}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => choose("compact")}
            aria-pressed={density === "compact"}
            className={
              density === "compact"
                ? "rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-amber-300 dark:text-slate-950"
                : "rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
            }
          >
            {copy.compact}
          </button>
          <button
            type="button"
            onClick={() => choose("comfortable")}
            aria-pressed={density === "comfortable"}
            className={
              density === "comfortable"
                ? "rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-amber-300 dark:text-slate-950"
                : "rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
            }
          >
            {copy.comfortable}
          </button>
          <button
            type="button"
            onClick={() => choose("spacious")}
            aria-pressed={density === "spacious"}
            className={
              density === "spacious"
                ? "rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-amber-300 dark:text-slate-950"
                : "rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
            }
          >
            {copy.spacious}
          </button>
          <button
            type="button"
            onClick={reset}
            className="ml-1 rounded-full border border-dashed border-slate-400 px-3 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-500 dark:text-slate-300"
          >
            {copy.reset}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {copy.current}: <span className="font-medium">{density}</span>. {copy.hint}
        </p>

        <div
          data-ux-density={density}
          className={`mt-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 ${densityClasses(density)}`}
        >
          <ul className="flex flex-col">
            {copy.cards.map((card) => (
              <li
                key={card.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950"
              >
                <h2 className="font-medium text-slate-900 dark:text-slate-50">{card.title}</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{card.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
