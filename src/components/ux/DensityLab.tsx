import { useEffect, useState } from "react";

type Density = "compact" | "comfortable" | "spacious";

const STORAGE_KEY = "utilihub-ux-density";

const LABELS = {
  en: {
    title: "Density Lab",
    subtitle: "UX experiment: space density for sample cards",
    compact: "Compact",
    comfortable: "Comfortable",
    spacious: "Spacious",
    reset: "Reset to default",
    note: "Preference is saved in this browser only.",
  },
  es: {
    title: "Laboratorio de densidad",
    subtitle: "Experimento UX: densidad de espacio para tarjetas de muestra",
    compact: "Compacto",
    comfortable: "Cómodo",
    spacious: "Espacioso",
    reset: "Restablecer por defecto",
    note: "La preferencia se guarda solo en este navegador.",
  },
} as const;

const SAMPLE_CARDS = [
  { id: 1, title: "Sample tool A", desc: "A short description of a utility." },
  { id: 2, title: "Sample tool B", desc: "Another example card for density testing." },
  { id: 3, title: "Sample tool C", desc: "Observe spacing, padding and rhythm." },
  { id: 4, title: "Sample tool D", desc: "Comfortable is the default density." },
  { id: 5, title: "Sample tool E", desc: "Compact packs more content." },
  { id: 6, title: "Sample tool F", desc: "Spacious gives more breathing room." },
];

interface Props {
  locale: "en" | "es";
}

export function DensityLab({ locale }: Props) {
  const t = LABELS[locale];
  const [density, setDensity] = useState<Density>("comfortable");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "compact" || stored === "comfortable" || stored === "spacious") {
        setDensity(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, density);
    } catch {
      /* ignore */
    }
  }, [density]);

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setDensity("comfortable");
  }

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.subtitle}</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["compact", "comfortable", "spacious"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDensity(d)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              density === d
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            {t[d]}
          </button>
        ))}
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary/40"
        >
          {t.reset}
        </button>
      </div>

      <p className="mb-6 text-xs text-muted-foreground">{t.note}</p>

      <div data-ux-density={density} className="density-lab rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
        <ul className="card-list grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_CARDS.map((card) => (
            <li
              key={card.id}
              className="surface-card rounded-xl border border-border p-4 transition-all"
            >
              <h2 className="text-lg font-bold">{card.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
