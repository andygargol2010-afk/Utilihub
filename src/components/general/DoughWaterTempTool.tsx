import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "C" | "F";
type PresetId = "hand" | "stand" | "spiral" | "us78";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function toF(c: number) {
  return (c * 9) / 5 + 32;
}

function toC(f: number) {
  return ((f - 32) * 5) / 9;
}

function formatTemp(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}

export function DoughWaterTempTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("C");
  const [ddt, setDdt] = useState("24");
  const [flour, setFlour] = useState("21");
  const [room, setRoom] = useState("22");
  const [usePreferment, setUsePreferment] = useState(false);
  const [preferment, setPreferment] = useState("23");
  const [friction, setFriction] = useState("6");
  const [presetId, setPresetId] = useState<PresetId>("stand");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Calculá a qué temperatura tiene que estar el agua para llegar a la temperatura deseada de la masa, según harina, ambiente, prefermento y fricción.",
        presets: "Presets",
        hand: "A mano",
        stand: "Amasadora",
        spiral: "Espiral",
        us78: "78°F sandwich",
        unit: "Unidad",
        celsius: "Celsius",
        fahrenheit: "Fahrenheit",
        ddt: "Temperatura deseada de la masa",
        flour: "Temperatura de la harina",
        room: "Temperatura ambiente",
        prefermentToggle: "Incluir prefermento",
        preferment: "Temperatura del prefermento",
        friction: "Factor de fricción",
        result: "Agua de amasado",
        factors: "Factores",
        straight: "Masa directa (3)",
        levain: "Con prefermento (4)",
        copyBtn: "Copiar nota de amasado",
        copied: "Copiado",
        reset: "Restablecer",
        ice: "El agua queda muy fría. Enfriá harina o prefermento, o reemplazá parte del agua por hielo. Esta tool no calcula el peso del hielo.",
        warm: "El agua queda por encima de unos 40°C / 105°F. Puede estresar la levadura comercial.",
        ok: "Usá agua a esta temperatura al empezar el amasado. La fricción es una estimación: medila en una masa real y ajustala.",
        empty: "Completá todas las temperaturas para calcular el agua.",
        invalid: "Usá números válidos. Los decimales pueden llevar coma o punto.",
        range: "Las temperaturas tienen que quedar entre −10°C y 50°C (14°F y 122°F). La fricción, entre 0 y 20°C (0 y 36°F).",
        waterRange: "El agua calculada queda fuera de −5°C a 60°C. Revisá la DDT o la fricción.",
      }
    : {
        help: "Find the water temperature that lands the dough on your target, from flour, room, preferment, and mixer friction.",
        presets: "Presets",
        hand: "Hand mix",
        stand: "Stand mixer",
        spiral: "Spiral",
        us78: "78°F sandwich",
        unit: "Unit",
        celsius: "Celsius",
        fahrenheit: "Fahrenheit",
        ddt: "Desired dough temperature",
        flour: "Flour temperature",
        room: "Room temperature",
        prefermentToggle: "Include preferment",
        preferment: "Preferment temperature",
        friction: "Friction factor",
        result: "Mix water",
        factors: "Factors",
        straight: "Straight dough (3)",
        levain: "With preferment (4)",
        copyBtn: "Copy mix note",
        copied: "Copied",
        reset: "Reset",
        ice: "The water is very cold. Chill the flour or preferment, or replace part of the water with ice. This tool does not calculate ice weight.",
        warm: "The water is above about 40°C / 105°F. That can stress commercial yeast.",
        ok: "Use water at this temperature when mixing starts. Friction is an estimate: measure it on a real dough and adjust.",
        empty: "Fill in every temperature to calculate the water.",
        invalid: "Use valid numbers. Decimals can use a comma or a dot.",
        range: "Temperatures must land between −10°C and 50°C (14°F and 122°F). Friction must be from 0 to 20°C (0 to 36°F).",
        waterRange: "The calculated water is outside −5°C to 60°C. Check the DDT or the friction factor.",
      };

  function applyPreset(id: PresetId) {
    setPresetId(id);
    setCopied(false);
    if (id === "hand") {
      setUnit("C");
      setDdt("24");
      setFlour("21");
      setRoom("22");
      setUsePreferment(false);
      setFriction("0");
    } else if (id === "stand") {
      setUnit("C");
      setDdt("24");
      setFlour("21");
      setRoom("22");
      setUsePreferment(false);
      setFriction("6");
    } else if (id === "spiral") {
      setUnit("C");
      setDdt("26");
      setFlour("22");
      setRoom("24");
      setUsePreferment(true);
      setPreferment("24");
      setFriction("10");
    } else {
      setUnit("F");
      setDdt("78");
      setFlour("70");
      setRoom("72");
      setUsePreferment(false);
      setFriction("22");
    }
  }

  function switchUnit(next: Unit) {
    if (next === unit) return;
    const convert = next === "F" ? toF : toC;
    const convertField = (value: string) => {
      const n = parseNum(value);
      return n === null || Number.isNaN(n) ? value : formatTemp(convert(n), locale);
    };
    setDdt(convertField(ddt));
    setFlour(convertField(flour));
    setRoom(convertField(room));
    setPreferment(convertField(preferment));
    setFriction(convertField(friction));
    setUnit(next);
    setPresetId("stand");
  }

  const result = useMemo(() => {
    const fields = [ddt, flour, room, friction, ...(usePreferment ? [preferment] : [])];
    const parsed = fields.map(parseNum);
    if (parsed.some((n) => n === null)) return { error: "empty" as const };
    if (parsed.some((n) => Number.isNaN(n))) return { error: "invalid" as const };
    const [ddtN, flourN, roomN, frictionN, prefermentN] = parsed as number[];
    const min = unit === "C" ? -10 : 14;
    const max = unit === "C" ? 50 : 122;
    const frictionMax = unit === "C" ? 20 : 36;
    if (
      [ddtN, flourN, roomN, ...(usePreferment ? [prefermentN] : [])].some((n) => n < min || n > max) ||
      frictionN < 0 ||
      frictionN > frictionMax
    ) {
      return { error: "range" as const };
    }
    const factors = usePreferment ? 4 : 3;
    const sum = flourN + roomN + frictionN + (usePreferment ? prefermentN : 0);
    const water = ddtN * factors - sum;
    const waterC = unit === "C" ? water : toC(water);
    if (waterC < -5 || waterC > 60) return { error: "waterRange" as const };
    return { error: null, water, waterC, factors, sum };
  }, [ddt, flour, friction, preferment, room, unit, usePreferment]);

  async function onCopy() {
    if (result.error) return;
    const mark = unit === "C" ? "°C" : "°F";
    const lines = [
      `${copy.ddt}: ${ddt} ${mark}`,
      `${copy.flour}: ${flour} ${mark}`,
      `${copy.room}: ${room} ${mark}`,
      usePreferment ? `${copy.preferment}: ${preferment} ${mark}` : copy.straight,
      `${copy.friction}: ${friction} ${mark}`,
      `${copy.result}: ${formatTemp(result.water, locale)} ${mark}`,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const errorText =
    result.error === "empty"
      ? copy.empty
      : result.error === "invalid"
        ? copy.invalid
        : result.error === "range"
          ? copy.range
          : result.error === "waterRange"
            ? copy.waterRange
            : "";
  const note = result.error
    ? ""
    : result.waterC < 4
      ? copy.ice
      : result.waterC > 40
        ? copy.warm
        : copy.ok;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["hand", copy.hand],
                ["stand", copy.stand],
                ["spiral", copy.spiral],
                ["us78", copy.us78],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`${buttonClass} ${presetId === id ? "border-primary bg-muted" : ""}`}
                onClick={() => applyPreset(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="text-muted-foreground">{copy.unit}</span>
            <select className={inputClass} value={unit} onChange={(event) => switchUnit(event.target.value as Unit)}>
              <option value="C">{copy.celsius}</option>
              <option value="F">{copy.fahrenheit}</option>
            </select>
          </label>
          {(
            [
              [copy.ddt, ddt, setDdt],
              [copy.flour, flour, setFlour],
              [copy.room, room, setRoom],
              [copy.friction, friction, setFriction],
            ] as const
          ).map(([label, value, setter]) => (
            <label key={label} className="space-y-1 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <input
                className={inputClass}
                inputMode="decimal"
                value={value}
                onChange={(event) => setter(event.target.value)}
              />
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={usePreferment}
              onChange={(event) => setUsePreferment(event.target.checked)}
            />
            <span>{copy.prefermentToggle}</span>
          </label>
          {usePreferment ? (
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-muted-foreground">{copy.preferment}</span>
              <input
                className={inputClass}
                inputMode="decimal"
                value={preferment}
                onChange={(event) => setPreferment(event.target.value)}
              />
            </label>
          ) : null}
        </div>
        <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={() => applyPreset("stand")}>
          {copy.reset}
        </button>
      </section>
      <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {result.error ? (
          <p className="text-sm text-muted-foreground">{errorText}</p>
        ) : (
          <>
            <p className="text-3xl font-semibold tabular-nums">
              {formatTemp(result.water, locale)}
              {unit === "C" ? "°C" : "°F"}
            </p>
            <dl className="divide-y rounded-xl border text-sm">
              <div className="flex items-center justify-between gap-3 px-3 py-2">
                <dt className="text-muted-foreground">{copy.factors}</dt>
                <dd className="font-medium">{usePreferment ? copy.levain : copy.straight}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2">
                <dt className="text-muted-foreground">{copy.friction}</dt>
                <dd className="tabular-nums">
                  {friction}
                  {unit === "C" ? "°C" : "°F"}
                </dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">{note}</p>
            <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={onCopy}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
