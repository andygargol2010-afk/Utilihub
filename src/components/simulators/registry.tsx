import { lazy, Suspense, type ComponentType } from "react";
import type { SimDef, SimLocale } from "@/lib/simulators/catalog";

const MoleculesSim = lazy(() => import("./MoleculesSim").then((m) => ({ default: m.MoleculesSim })));
const GravitySandbox = lazy(() => import("./GravitySandbox").then((m) => ({ default: m.GravitySandbox })));
const PendulumSim = lazy(() => import("./PendulumSim").then((m) => ({ default: m.PendulumSim })));
const ProjectileSim = lazy(() => import("./ProjectileSim").then((m) => ({ default: m.ProjectileSim })));
const OpticsSim = lazy(() => import("./OpticsSim").then((m) => ({ default: m.OpticsSim })));
const DcCircuitSim = lazy(() => import("./DcCircuitSim").then((m) => ({ default: m.DcCircuitSim })));
const EcosystemSim = lazy(() => import("./EcosystemSim").then((m) => ({ default: m.EcosystemSim })));
const SirEpidemicSim = lazy(() => import("./SirEpidemicSim").then((m) => ({ default: m.SirEpidemicSim })));
const MarketSim = lazy(() => import("./MarketSim").then((m) => ({ default: m.MarketSim })));

const MAP: Record<string, ComponentType<{ locale?: SimLocale }>> = {
  "molecular-motion": MoleculesSim,
  "movimiento-molecular": MoleculesSim,
  "gravity-sandbox": GravitySandbox,
  "sandbox-gravedad": GravitySandbox,
  pendulum: PendulumSim,
  pendulo: PendulumSim,
  "projectile-motion": ProjectileSim,
  "movimiento-proyectil": ProjectileSim,
  "optics-bench": OpticsSim,
  "banco-optico": OpticsSim,
  "dc-circuit": DcCircuitSim,
  "circuito-dc": DcCircuitSim,
  ecosystem: EcosystemSim,
  ecosistema: EcosystemSim,
  "sir-epidemic": SirEpidemicSim,
  "epidemia-sir": SirEpidemicSim,
  "market-equilibrium": MarketSim,
  "equilibrio-mercado": MarketSim,
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
        <div className="mx-auto max-w-md py-8">
          <div className="skeleton mx-auto h-48 w-full max-w-sm rounded-2xl" />
          <p className="mt-4 text-center text-xs text-white/50">
            {locale === "es" ? "Cargando…" : "Loading…"}
          </p>
        </div>
      }
    >
      <Comp locale={locale} />
    </Suspense>
  );
}
