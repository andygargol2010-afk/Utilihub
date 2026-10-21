"use client";

/** Temporary stub — full component was replaced by PLACEHOLDER and broke the Vercel build.
 *  Playground agent should restore the real interactive canvas (EXECUTE history has full versions).
 *  Catalog tools agent only unblocks deploy for general tools.
 */
export function AuroraParticlePlayground({ locale }: { locale: "en" | "es" }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
      {locale === "es"
        ? "Playground Aurora temporalmente no disponible. Se restaurará en la próxima corrida de playgrounds."
        : "Aurora Particle Playground temporarily unavailable. Will be restored by the playgrounds agent."}
    </div>
  );
}
