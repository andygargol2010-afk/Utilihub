import { lazy, Suspense, type ComponentType } from "react";
import type { SimDef, SimLocale } from "@/lib/simulators/catalog";

const MoleculesSim = lazy(() => import("./MoleculesSim").then((m) => ({ default: m.MoleculesSim })));

const MAP: Record<string, ComponentType<{ locale?: SimLocale }>> = {
  "molecular-motion": MoleculesSim,
  "movimiento-molecular": MoleculesSim,
};

export function SimPlayer({ sim, locale = "en" }: { sim: SimDef; locale?: SimLocale }) {
  const Comp = MAP[sim.slug] ?? MAP[sim.slugEs];
  if (!Comp) {
    return (
      <p className="py-16 text-center text-sm font-semibold text-sky-200/80">
        {locale === "es" ? "Simulador no disponible." : "Simulator not available."}
      </p>
    );
  }
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-sm text-white/60">
          {locale === "es" ? "Cargando simulador…" : "Loading simulator…"}
        </p>
      }
    >
      <Comp locale={locale} />
    </Suspense>
  );
}
