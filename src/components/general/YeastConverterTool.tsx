import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type YeastKind = "instant" | "active" | "fresh" | "osmo";
type Unit = "g" | "tsp" | "packet";
type PresetId = "packet" | "tsp" | "cube25" | "cube42" | "active10";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

/** Weight relative to 1 g instant. Active dry is 25% more; fresh is triple. */
const FACTOR: Record<YeastKind, number> = {
  instant: 1,
  active: 1.25,
  fresh: 3,
  osmo: 1,
};

const GRAMS_PER_TSP: Partial<Record<YeastKind, number>> = {
  instant: 3.1,
  active: 2.8,
  osmo: 3.1,
};

const PACKET_G = 7;
const KINDS: YeastKind[] = ["instant", "active", "fresh", "osmo"];

function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatAmount(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
    minimumFractionDigits: 0,
  }).format(value);
}

export function YeastConverterTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [kind, setKind] = useState<YeastKind>("instant");
  const [unit, setUnit] = useState<Unit>("g");
  const [amount, setAmount] = useState("7");
  const [presetId, setPresetId] = useState<PresetId>("packet");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Convertí la levadura que tenés a instantánea, seca activa, fresca u osmotolerante. La fresca no se mide en cucharaditas.",
        have: "Levadura que tenés",
        instant: "Instantánea",
        active: "Seca activa",
        fresh: "Fresca",
        osmo: "Osmotolerante",
        unit: "Unidad",
        grams: "Gramos",
        tsp: "Cucharaditas",
        packet: "Sobres de 7 g",
        amount: "Cantidad",
        presets: "Presets",
        packetPreset: "1 sobre",
        tspPreset: "1 cucharadita",
        cube25: "Cubo 25 g",
        cube42: "Cubo 42 g",
        active10: "10 g seca",
        result: "Equivalencias",
        source: "Origen",
        packets: "Sobres de 7 g",
        teaspoons: "Cucharaditas aprox.",
        copyBtn: "Copiar equivalencias",
        copied: "Copiado",
        reset: "Restablecer",
        note: "Pesá el tipo que vas a usar. Las cucharaditas son volumen aproximado y un sobre son 7 g.",
        freshNote: "La levadura fresca se pide al triple de la instantánea. No la conviertas desde cucharaditas.",
        osmoNote: "La osmotolerante pesa igual que la instantánea. Sirve para masas con más de un 10% de azúcar.",
        empty: "Completá la cantidad para ver las equivalencias.",
        invalid: "Usá un número válido mayor que cero. Los decimales pueden llevar coma o punto.",
        tspFresh: "La levadura fresca no se convierte desde cucharaditas. Cambiá a gramos o a otro tipo.",
        range: "La cantidad equivalente de instantánea tiene que quedar entre 0,1 g y 2 kg.",
      }
    : {
        help: "Convert the yeast you have into instant, active dry, fresh, or osmotolerant yeast. Fresh yeast is not measured in teaspoons.",
        have: "Yeast you have",
        instant: "Instant",
        active: "Active dry",
        fresh: "Fresh",
        osmo: "Osmotolerant",
        unit: "Unit",
        grams: "Grams",
        tsp: "Teaspoons",
        packet: "7 g packets",
        amount: "Amount",
        presets: "Presets",
        packetPreset: "1 packet",
        tspPreset: "1 teaspoon",
        cube25: "25 g cube",
        cube42: "42 g cube",
        active10: "10 g active",
        result: "Equivalents",
        source: "Source",
        packets: "7 g packets",
        teaspoons: "Approx. teaspoons",
        copyBtn: "Copy equivalents",
        copied: "Copied",
        reset: "Reset",
        note: "Weigh the type you will use. Teaspoons are approximate volume and a packet is 7 g.",
        freshNote: "Fresh yeast is called for at three times the instant weight. Do not convert it from teaspoons.",
        osmoNote: "Osmotolerant yeast weighs the same as instant. Use it for doughs above about 10% sugar.",
        empty: "Enter an amount to see the equivalents.",
        invalid: "Use a valid number greater than zero. Decimals can use a comma or a dot.",
        tspFresh: "Fresh yeast cannot be converted from teaspoons. Switch to grams or another type.",
        range: "The instant-equivalent amount must land between 0.1 g and 2 kg.",
      };

  const kindLabel: Record<YeastKind, string> = {
    instant: copy.instant,
    active: copy.active,
    fresh: copy.fresh,
    osmo: copy.osmo,
  };

  function applyPreset(id: PresetId) {
    setPresetId(id);
    if (id === "packet") {
      setKind("instant");
      setUnit("packet");
      setAmount("1");
    } else if (id === "tsp") {
      setKind("instant");
      setUnit("tsp");
      setAmount("1");
    } else if (id === "cube25") {
      setKind("fresh");
      setUnit("g");
      setAmount("25");
    } else if (id === "cube42") {
      setKind("fresh");
      setUnit("g");
      setAmount("42");
    } else {
      setKind("active");
      setUnit("g");
      setAmount("10");
    }
  }

  const result = useMemo(() => {
    const amountN = parseNum(amount);
    if (amountN === null) return { error: "empty" as const };
    if (Number.isNaN(amountN) || amountN <= 0) return { error: "invalid" as const };
    if (unit === "tsp" && kind === "fresh") return { error: "tspFresh" as const };
    const grams =
      unit === "g" ? amountN : unit === "packet" ? amountN * PACKET_G : amountN * (GRAMS_PER_TSP[kind] as number);
    const instant = grams / FACTOR[kind];
    if (instant < 0.1 || instant > 2000) return { error: "range" as const };
    const rows = KINDS.map((target) => {
      const gramsOut = instant * FACTOR[target];
      const tsp = GRAMS_PER_TSP[target] ? gramsOut / (GRAMS_PER_TSP[target] as number) : null;
      return {
        target,
        gramsOut,
        packets: gramsOut / PACKET_G,
        tsp,
      };
    });
    return { error: null, instant, rows, sourceGrams: grams };
  }, [amount, kind, unit]);

  async function onCopy() {
    if (result.error) return;
    const lines = [
      `${copy.source}: ${formatAmount(result.sourceGrams, locale)} g ${kindLabel[kind]}`,
      ...result.rows.map((row) => `${kindLabel[row.target]}: ${formatAmount(row.gramsOut, locale)} g`),
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function onReset() {
    setCopied(false);
    applyPreset("packet");
  }

  const errorText =
    result.error === "empty"
      ? copy.empty
      : result.error === "invalid"
        ? copy.invalid
        : result.error === "tspFresh"
          ? copy.tspFresh
          : result.error === "range"
            ? copy.range
            : "";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(
              [
                ["packet", copy.packetPreset],
                ["tsp", copy.tspPreset],
                ["cube25", copy.cube25],
                ["cube42", copy.cube42],
                ["active10", copy.active10],
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
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.have}</span>
            <select
              className={inputClass}
              value={kind}
              onChange={(event) => {
                const next = event.target.value as YeastKind;
                setKind(next);
                if (next === "fresh" && unit === "tsp") setUnit("g");
              }}
            >
              {KINDS.map((item) => (
                <option key={item} value={item}>
                  {kindLabel[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{copy.unit}</span>
            <select
              className={inputClass}
              value={unit}
              onChange={(event) => setUnit(event.target.value as Unit)}
            >
              <option value="g">{copy.grams}</option>
              <option value="tsp" disabled={kind === "fresh"}>
                {copy.tsp}
              </option>
              <option value="packet">{copy.packet}</option>
            </select>
          </label>
          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="text-muted-foreground">{copy.amount}</span>
            <input
              className={inputClass}
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
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
              {result.rows.map((row) => (
                <div key={row.target} className="space-y-1 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">{kindLabel[row.target]}</dt>
                    <dd className="font-medium tabular-nums">{formatAmount(row.gramsOut, locale)} g</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-muted-foreground">
                    <span>{copy.packets}</span>
                    <span className="tabular-nums">{formatAmount(row.packets, locale)}</span>
                  </div>
                  {row.tsp !== null ? (
                    <div className="flex items-center justify-between gap-3 text-muted-foreground">
                      <span>{copy.teaspoons}</span>
                      <span className="tabular-nums">{formatAmount(row.tsp, locale)}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted-foreground">{copy.note}</p>
            {kind === "fresh" ? <p className="text-sm text-muted-foreground">{copy.freshNote}</p> : null}
            {kind === "osmo" || result.rows.some((row) => row.target === "osmo") ? (
              <p className="text-sm text-muted-foreground">{copy.osmoNote}</p>
            ) : null}
            <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={onCopy}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
