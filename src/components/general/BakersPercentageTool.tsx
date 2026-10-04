import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Mode = "flour" | "dough";
type YeastKind = "instant" | "fresh";
type PresetId = "sandwich" | "baguette" | "pizza" | "ciabatta" | "focaccia" | "sourdough";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

type Preset = {
  id: PresetId;
  hydration: string;
  salt: string;
  yeast: string;
  fat: string;
  extras: string;
  starter: string;
  starterHydration: string;
};

const PRESETS: Preset[] = [
  { id: "sandwich", hydration: "62", salt: "1.8", yeast: "1", fat: "4", extras: "0", starter: "0", starterHydration: "100" },
  { id: "baguette", hydration: "68", salt: "2", yeast: "0.8", fat: "0", extras: "0", starter: "0", starterHydration: "100" },
  { id: "pizza", hydration: "65", salt: "2.8", yeast: "0.2", fat: "0", extras: "0", starter: "0", starterHydration: "100" },
  { id: "ciabatta", hydration: "80", salt: "2", yeast: "0.6", fat: "0", extras: "0", starter: "0", starterHydration: "100" },
  { id: "focaccia", hydration: "78", salt: "2.2", yeast: "0.8", fat: "6", extras: "0", starter: "0", starterHydration: "100" },
  { id: "sourdough", hydration: "75", salt: "2", yeast: "0", fat: "0", extras: "0", starter: "20", starterHydration: "100" },
];

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatGrams(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatPct(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}

export function BakersPercentageTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<Mode>("flour");
  const [presetId, setPresetId] = useState<PresetId>("sandwich");
  const [yeastKind, setYeastKind] = useState<YeastKind>("instant");
  const [base, setBase] = useState("500");
  const [hydration, setHydration] = useState("62");
  const [salt, setSalt] = useState("1.8");
  const [yeast, setYeast] = useState("1");
  const [fat, setFat] = useState("4");
  const [extras, setExtras] = useState("0");
  const [starter, setStarter] = useState("0");
  const [starterHydration, setStarterHydration] = useState("100");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Armá una fórmula panadera en gramos desde el peso de harina o desde la masa que querés obtener. La masa madre se descuenta de la harina y del agua.",
        mode: "Base",
        flourMode: "Desde harina",
        doughMode: "Desde masa",
        presets: "Presets",
        sandwich: "Molde",
        baguette: "Baguette",
        pizza: "Pizza",
        ciabatta: "Ciabatta",
        focaccia: "Focaccia",
        sourdough: "Masa madre",
        flour: "Harina total (g)",
        dough: "Masa objetivo (g)",
        hydration: "Hidratación (%)",
        salt: "Sal (%)",
        yeast: "Levadura instantánea (%)",
        yeastKind: "Tipo de levadura",
        instant: "Instantánea",
        fresh: "Fresca ×3",
        fat: "Grasa o aceite (%)",
        extras: "Extras (%)",
        starter: "Prefermento (%)",
        starterHydration: "Hidratación del prefermento (%)",
        result: "Fórmula a pesar",
        totalFlour: "Harina total",
        flourAdd: "Harina a agregar",
        flourStarter: "Harina en el prefermento",
        waterTotal: "Agua total",
        waterAdd: "Agua a agregar",
        waterStarter: "Agua en el prefermento",
        saltOut: "Sal",
        yeastOut: "Levadura",
        fatOut: "Grasa",
        extrasOut: "Extras",
        starterOut: "Prefermento a usar",
        total: "Masa total",
        band: "Rango de hidratación",
        note: "Nota",
        copyBtn: "Copiar fórmula",
        copied: "Copiado",
        reset: "Restablecer",
        empty: "Completá la base y los porcentajes para ver los gramos.",
        invalid: "Usá números válidos. La base tiene que ser mayor que cero. Los decimales pueden llevar coma o punto.",
        range: "Hidratación 30–130%, sal 0–6%, levadura 0–10%, grasa 0–40%, extras 0–50%, prefermento 0–60% y su hidratación 50–150%.",
        size: "La harina total tiene que quedar entre 50 g y 20 kg.",
        starterFit: "El prefermento pide más harina o más agua de las que tiene la fórmula. Bajá su porcentaje o subí la hidratación de la masa.",
        bands: {
          stiff: "Masa firme, típica de panes enriquecidos o de molde cerrado.",
          standard: "Hidratación de pan de molde o pizza. Fácil de amasar a mano.",
          artisan: "Masa artesanal. Conviene pliegues en vez de un amasado largo.",
          wet: "Alta hidratación. Pegajosa: usá recipiente aceitado y pliegues.",
          veryWet: "Muy líquida. Más cercana a un pan de cristal o a un batido que a una bola.",
        },
        freshNote: "La levadura fresca se pesa al triple de la instantánea. El porcentaje de referencia no cambia.",
        starterNote: "El prefermento ya incluye parte de la harina y del agua. No lo sumes otra vez al total.",
      }
    : {
        help: "Build a baker's formula in grams from flour weight or from the dough weight you want. Preferment flour and water are deducted from what you add.",
        mode: "Base",
        flourMode: "From flour",
        doughMode: "From dough",
        presets: "Presets",
        sandwich: "Sandwich",
        baguette: "Baguette",
        pizza: "Pizza",
        ciabatta: "Ciabatta",
        focaccia: "Focaccia",
        sourdough: "Sourdough",
        flour: "Total flour (g)",
        dough: "Target dough (g)",
        hydration: "Hydration (%)",
        salt: "Salt (%)",
        yeast: "Instant yeast (%)",
        yeastKind: "Yeast type",
        instant: "Instant",
        fresh: "Fresh ×3",
        fat: "Fat or oil (%)",
        extras: "Extras (%)",
        starter: "Preferment (%)",
        starterHydration: "Preferment hydration (%)",
        result: "Formula to weigh",
        totalFlour: "Total flour",
        flourAdd: "Flour to add",
        flourStarter: "Flour in preferment",
        waterTotal: "Total water",
        waterAdd: "Water to add",
        waterStarter: "Water in preferment",
        saltOut: "Salt",
        yeastOut: "Yeast",
        fatOut: "Fat",
        extrasOut: "Extras",
        starterOut: "Preferment to use",
        total: "Total dough",
        band: "Hydration band",
        note: "Note",
        copyBtn: "Copy formula",
        copied: "Copied",
        reset: "Reset",
        empty: "Enter the base weight and percentages to see grams.",
        invalid: "Use valid numbers. The base weight must be greater than zero. Decimals can use a comma or a dot.",
        range: "Hydration 30–130%, salt 0–6%, yeast 0–10%, fat 0–40%, extras 0–50%, preferment 0–60%, and preferment hydration 50–150%.",
        size: "Total flour must land between 50 g and 20 kg.",
        starterFit: "The preferment needs more flour or water than the formula has. Lower its percentage or raise dough hydration.",
        bands: {
          stiff: "Stiff dough, typical of enriched or tight sandwich loaves.",
          standard: "Sandwich or pizza hydration. Straightforward to knead by hand.",
          artisan: "Artisan dough. Folds work better than a long knead.",
          wet: "High hydration. Sticky: use an oiled tub and folds.",
          veryWet: "Very wet. Closer to a ciabatta batter than to a ball.",
        },
        freshNote: "Fresh yeast is weighed at three times the instant amount. The reference percentage stays the same.",
        starterNote: "The preferment already includes some flour and water. Do not add that weight again to the total.",
      };

  const presetLabels: Record<PresetId, string> = {
    sandwich: copy.sandwich,
    baguette: copy.baguette,
    pizza: copy.pizza,
    ciabatta: copy.ciabatta,
    focaccia: copy.focaccia,
    sourdough: copy.sourdough,
  };

  function applyPreset(id: PresetId) {
    const preset = PRESETS.find((item) => item.id === id) ?? PRESETS[0];
    setPresetId(id);
    setHydration(preset.hydration);
    setSalt(preset.salt);
    setYeast(preset.yeast);
    setFat(preset.fat);
    setExtras(preset.extras);
    setStarter(preset.starter);
    setStarterHydration(preset.starterHydration);
    setYeastKind("instant");
  }

  const result = useMemo(() => {
    const baseN = parseNum(base);
    const hydrationN = parseNum(hydration);
    const saltN = parseNum(salt);
    const yeastN = parseNum(yeast);
    const fatN = parseNum(fat);
    const extrasN = parseNum(extras);
    const starterN = parseNum(starter);
    const starterHydrationN = parseNum(starterHydration);
    const values = [baseN, hydrationN, saltN, yeastN, fatN, extrasN, starterN, starterHydrationN];
    if (values.some((value) => value === null)) return { error: "empty" as const };
    if (values.some((value) => Number.isNaN(value))) return { error: "invalid" as const };
    if (
      (baseN as number) <= 0 ||
      (hydrationN as number) < 30 ||
      (hydrationN as number) > 130 ||
      (saltN as number) < 0 ||
      (saltN as number) > 6 ||
      (yeastN as number) < 0 ||
      (yeastN as number) > 10 ||
      (fatN as number) < 0 ||
      (fatN as number) > 40 ||
      (extrasN as number) < 0 ||
      (extrasN as number) > 50 ||
      (starterN as number) < 0 ||
      (starterN as number) > 60 ||
      (starterHydrationN as number) < 50 ||
      (starterHydrationN as number) > 150
    ) {
      return { error: "range" as const };
    }
    const factor = 100 + (hydrationN as number) + (saltN as number) + (yeastN as number) + (fatN as number) + (extrasN as number);
    const flour = mode === "flour" ? (baseN as number) : ((baseN as number) * 100) / factor;
    if (flour < 50 || flour > 20000) return { error: "size" as const };
    const water = (flour * (hydrationN as number)) / 100;
    const saltG = (flour * (saltN as number)) / 100;
    const yeastInstant = (flour * (yeastN as number)) / 100;
    const yeastG = yeastKind === "fresh" ? yeastInstant * 3 : yeastInstant;
    const fatG = (flour * (fatN as number)) / 100;
    const extrasG = (flour * (extrasN as number)) / 100;
    const starterG = (flour * (starterN as number)) / 100;
    const starterFlour = (starterG * 100) / (100 + (starterHydrationN as number));
    const starterWater = starterG - starterFlour;
    const flourAdd = flour - starterFlour;
    const waterAdd = water - starterWater;
    if (flourAdd < -0.05 || waterAdd < -0.05) return { error: "starter" as const };
    const total = flour + water + saltG + yeastInstant + fatG + extrasG;
    const band =
      (hydrationN as number) < 55
        ? "stiff"
        : (hydrationN as number) < 65
          ? "standard"
          : (hydrationN as number) < 75
            ? "artisan"
            : (hydrationN as number) < 85
              ? "wet"
              : "veryWet";
    return {
      error: null,
      flour,
      water,
      saltG,
      yeastG,
      fatG,
      extrasG,
      starterG,
      starterFlour,
      starterWater,
      flourAdd: Math.max(0, flourAdd),
      waterAdd: Math.max(0, waterAdd),
      total,
      band,
      hydration: hydrationN as number,
    };
  }, [base, extras, fat, hydration, mode, salt, starter, starterHydration, yeast, yeastKind]);

  const rows =
    result.error === null
      ? [
          [copy.totalFlour, result.flour],
          [copy.flourStarter, result.starterFlour],
          [copy.flourAdd, result.flourAdd],
          [copy.waterTotal, result.water],
          [copy.waterStarter, result.starterWater],
          [copy.waterAdd, result.waterAdd],
          [copy.starterOut, result.starterG],
          [copy.saltOut, result.saltG],
          [copy.yeastOut, result.yeastG],
          [copy.fatOut, result.fatG],
          [copy.extrasOut, result.extrasG],
          [copy.total, result.total],
        ]
      : [];

  async function onCopy() {
    if (result.error) return;
    const lines = rows.map(([label, grams]) => `${label}: ${formatGrams(grams as number, locale)} g`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function onReset() {
    setMode("flour");
    setBase("500");
    setYeastKind("instant");
    applyPreset("sandwich");
    setCopied(false);
  }

  const errorText =
    result.error === "empty"
      ? copy.empty
      : result.error === "invalid"
        ? copy.invalid
        : result.error === "range"
          ? copy.range
          : result.error === "size"
            ? copy.size
            : result.error === "starter"
              ? copy.starterFit
              : "";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.mode}</span>
            <select className={inputClass} value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
              <option value="flour">{copy.flourMode}</option>
              <option value="dough">{copy.doughMode}</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{mode === "flour" ? copy.flour : copy.dough}</span>
            <input className={inputClass} inputMode="decimal" value={base} onChange={(event) => setBase(event.target.value)} />
          </label>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`${buttonClass} ${presetId === preset.id ? "border-primary bg-muted" : ""}`}
                onClick={() => applyPreset(preset.id)}
              >
                {presetLabels[preset.id]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.hydration}</span>
            <input className={inputClass} inputMode="decimal" value={hydration} onChange={(event) => setHydration(event.target.value)} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.salt}</span>
            <input className={inputClass} inputMode="decimal" value={salt} onChange={(event) => setSalt(event.target.value)} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.yeast}</span>
            <input className={inputClass} inputMode="decimal" value={yeast} onChange={(event) => setYeast(event.target.value)} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.yeastKind}</span>
            <select className={inputClass} value={yeastKind} onChange={(event) => setYeastKind(event.target.value as YeastKind)}>
              <option value="instant">{copy.instant}</option>
              <option value="fresh">{copy.fresh}</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.fat}</span>
            <input className={inputClass} inputMode="decimal" value={fat} onChange={(event) => setFat(event.target.value)} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.extras}</span>
            <input className={inputClass} inputMode="decimal" value={extras} onChange={(event) => setExtras(event.target.value)} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.starter}</span>
            <input className={inputClass} inputMode="decimal" value={starter} onChange={(event) => setStarter(event.target.value)} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.starterHydration}</span>
            <input className={inputClass} inputMode="decimal" value={starterHydration} onChange={(event) => setStarterHydration(event.target.value)} />
          </label>
        </div>
        <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={onReset}>
          {copy.reset}
        </button>
      </section>
      <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {result.error ? (
          <p className="text-sm text-muted-foreground">{errorText}</p>
        ) : (
          <>
            <dl className="divide-y rounded-xl border">
              {rows.map(([label, grams]) => (
                <div key={String(label)} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium tabular-nums">{formatGrams(grams as number, locale)} g</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm">
              <span className="text-muted-foreground">{copy.band}: </span>
              {copy.bands[result.band as keyof typeof copy.bands]} ({formatPct(result.hydration, locale)}%)
            </p>
            <p className="text-sm text-muted-foreground">{result.starterG > 0 ? copy.starterNote : copy.note}</p>
            {yeastKind === "fresh" ? <p className="text-sm text-muted-foreground">{copy.freshNote}</p> : null}
            <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={onCopy}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
