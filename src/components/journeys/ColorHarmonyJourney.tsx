import { useMemo, useState } from "react";

type Harmony = "complementary" | "analogous" | "triadic";

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(baseHex: string, harmony: Harmony): string[] {
  const { h, s, l } = hexToHsl(baseHex);
  const base = baseHex.toUpperCase();
  if (harmony === "complementary") {
    return [base, hslToHex(h + 180, s, l)];
  }
  if (harmony === "analogous") {
    return [hslToHex(h - 30, s, l), base, hslToHex(h + 30, s, l)];
  }
  // triadic
  return [base, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)];
}

const LABELS = {
  en: {
    step1: "Step 1: Choose base color",
    step2: "Step 2: Select harmony type",
    base: "Base color",
    complementary: "Complementary",
    analogous: "Analogous",
    triadic: "Triadic",
    palette: "Generated palette",
    hex: "HEX",
    hsl: "HSL",
    live: "Live preview updates as you change values.",
  },
  es: {
    step1: "Paso 1: Elegir color base",
    step2: "Paso 2: Tipo de armonía",
    base: "Color base",
    complementary: "Complementaria",
    analogous: "Análoga",
    triadic: "Triádica",
    palette: "Paleta generada",
    hex: "HEX",
    hsl: "HSL",
    live: "La visualización se actualiza en vivo al cambiar los valores.",
  },
} as const;

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
