import { useMemo, useState } from "react";
import { type Harmony } from "./ColorHarmonyJourney.part1";
import { LABELS, generatePalette, hexToHsl } from "./ColorHarmonyJourney.part2";

export function ColorHarmonyJourney({ locale }: { locale: "en" | "es" }) {
  const t = LABELS[locale];
  const [base, setBase] = useState("#3b82f6");
  const [harmony, setHarmony] = useState<Harmony>("complementary");
  const [step, setStep] = useState(1);

  const palette = useMemo(() => generatePalette(base, harmony), [base, harmony]);
  const hsl = useMemo(() => hexToHsl(base), [base]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex gap-2 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`rounded-full px-4 py-1.5 ${step === 1 ? "bg-primary text-primary-foreground" : "bg-accent"}`}
        >
          1
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className={`rounded-full px-4 py-1.5 ${step === 2 ? "bg-primary text-primary-foreground" : "bg-accent"}`}
        >
          2
        </button>
      </div>

      {step === 1 && (
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-6">
          <h2 className="text-lg font-bold">{t.step1}</h2>
          <label className="block text-sm font-medium">
            {t.base}
            <input
              type="color"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="mt-2 h-12 w-full cursor-pointer rounded-lg border"
            />
          </label>
          <p className="font-mono text-sm">{base.toUpperCase()}</p>
          <button type="button" onClick={() => setStep(2)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {locale === "es" ? "Continuar" : "Continue"}
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-6">
          <h2 className="text-lg font-bold">{t.step2}</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["complementary", "analogous", "triadic"] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHarmony(h)}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${harmony === h ? "border-primary bg-accent text-primary" : "border-border"}`}
              >
                {t[h]}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-muted-foreground underline">
            {locale === "es" ? "Volver" : "Back"}
          </button>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-bold">{t.palette}</h2>
        <p className="text-sm text-muted-foreground">{t.live}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {palette.map((hex) => {
            const c = hexToHsl(hex);
            return (
              <div key={hex} className="overflow-hidden rounded-xl border border-border/70">
                <div className="h-24" style={{ backgroundColor: hex }} />
                <div className="space-y-1 p-3 text-xs font-mono">
                  <div>
                    {t.hex}: {hex}
                  </div>
                  <div>
                    {t.hsl}: {Math.round(c.h)}° {Math.round(c.s)}% {Math.round(c.l)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Base HSL: {Math.round(hsl.h)}° {Math.round(hsl.s)}% {Math.round(hsl.l)}%
        </p>
      </section>
    </div>
  );
}
