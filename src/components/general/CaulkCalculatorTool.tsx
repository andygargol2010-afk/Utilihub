import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import type { Locale } from "@/lib/i18n/locale";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function formatNum(value: number, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

type Unit = "m" | "ft";
type Mode = "length" | "openings";
type Profile = "fillet" | "butt";
type Tube = "300" | "310" | "299" | "600";

type Preset = {
  id: string;
  unit: Unit;
  mode: Mode;
  length: string;
  count: string;
  openingW: string;
  openingH: string;
  beadW: string;
  beadD: string;
  profile: Profile;
  tube: Tube;
  waste: string;
};

const PRESETS: Preset[] = [
  { id: "bath", unit: "m", mode: "length", length: "8", count: "1", openingW: "0.8", openingH: "1.2", beadW: "5", beadD: "5", profile: "fillet", tube: "300", waste: "10" },
  { id: "windows", unit: "m", mode: "openings", length: "12", count: "4", openingW: "1.2", openingH: "1.4", beadW: "6", beadD: "6", profile: "fillet", tube: "310", waste: "15" },
  { id: "counter", unit: "ft", mode: "length", length: "20", count: "1", openingW: "3", openingH: "4", beadW: "0.25", beadD: "0.25", profile: "fillet", tube: "299", waste: "10" },
  { id: "exterior", unit: "m", mode: "length", length: "15", count: "2", openingW: "0.9", openingH: "2.1", beadW: "10", beadD: "8", profile: "butt", tube: "600", waste: "15" },
];

const TUBE_ML: Record<Tube, number> = { "300": 300, "310": 310, "299": 299, "600": 600 };

export function CaulkCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [unit, setUnit] = useState<Unit>("m");
  const [mode, setMode] = useState<Mode>("length");
  const [length, setLength] = useState("8");
  const [count, setCount] = useState("1");
  const [openingW, setOpeningW] = useState("0.8");
  const [openingH, setOpeningH] = useState("1.2");
  const [beadW, setBeadW] = useState("5");
  const [beadD, setBeadD] = useState("5");
  const [profile, setProfile] = useState<Profile>("fillet");
  const [tube, setTube] = useState<Tube>("300");
  const [wastePct, setWastePct] = useState("10");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = es
    ? {
        help: "Estimá tubos de silicona, acrílico o poliuretano a partir del largo de junta y del cordón. El filete de esquina usa la mitad del rectángulo; la junta a tope usa el rectángulo completo.",
        presets: "Presets",
        bath: "Baño",
        windows: "Ventanas",
        counter: "Mesada",
        exterior: "Exterior",
        unit: "Unidades",
        meters: "Metros",
        feet: "Pies",
        mode: "Junta",
        total: "Largo total",
        openings: "Aberturas",
        length: unit === "m" ? "Largo de junta (m)" : "Largo de junta (ft)",
        count: "Cantidad de aberturas",
        openingW: unit === "m" ? "Ancho de abertura (m)" : "Ancho de abertura (ft)",
        openingH: unit === "m" ? "Alto de abertura (m)" : "Alto de abertura (ft)",
        beadW: unit === "m" ? "Ancho del cordón (mm)" : "Ancho del cordón (in)",
        beadD: unit === "m" ? "Profundidad del cordón (mm)" : "Profundidad del cordón (in)",
        profile: "Perfil",
        fillet: "Filete (esquina)",
        butt: "Junta a tope",
        tube: "Tubo",
        t300: "Cartucho 300 ml",
        t310: "Cartucho 310 ml",
        t299: "Cartucho 10,1 oz",
        t600: "Salchicha 600 ml",
        waste: "Desperdicio (%)",
        price: "Precio por tubo (opcional)",
        result: "Pedido",
        joint: "Largo de junta",
        volume: "Volumen neto",
        orderVol: "Volumen con desperdicio",
        perTube: "Cobertura de un tubo",
        tubes: "Tubos a pedir",
        leftover: "Sellador sobrante",
        cost: "Costo de tubos",
        note: "El redondeo compra tubos enteros. No incluye fondo de junta, imprimación ni cinta. No es la calculadora de zócalos ni la de pintura.",
        copyBtn: "Copiar pedido",
        copied: "Copiado",
        reset: "Restablecer",
        errLength: "El largo de junta tiene que estar entre 0,2 y 500 m (o el equivalente en pies).",
        errBead: unit === "m" ? "El cordón tiene que medir entre 2 y 30 mm." : "El cordón tiene que medir entre 0,08 y 1,18 in.",
        errWaste: "El desperdicio tiene que estar entre 0 y 40%.",
        errOpen: "Cada abertura tiene que medir entre 0,2 y 6 m de lado, y la cantidad entre 1 y 80.",
      }
    : {
        help: "Estimate silicone, acrylic, or polyurethane tubes from joint length and bead size. A corner fillet uses half the rectangle; a butt joint uses the full rectangle.",
        presets: "Presets",
        bath: "Bathroom",
        windows: "Windows",
        counter: "Counter",
        exterior: "Exterior",
        unit: "Units",
        meters: "Meters",
        feet: "Feet",
        mode: "Joint",
        total: "Total length",
        openings: "Openings",
        length: unit === "m" ? "Joint length (m)" : "Joint length (ft)",
        count: "Number of openings",
        openingW: unit === "m" ? "Opening width (m)" : "Opening width (ft)",
        openingH: unit === "m" ? "Opening height (m)" : "Opening height (ft)",
        beadW: unit === "m" ? "Bead width (mm)" : "Bead width (in)",
        beadD: unit === "m" ? "Bead depth (mm)" : "Bead depth (in)",
        profile: "Profile",
        fillet: "Fillet (corner)",
        butt: "Butt joint",
        tube: "Tube",
        t300: "300 ml cartridge",
        t310: "310 ml cartridge",
        t299: "10.1 oz cartridge",
        t600: "600 ml sausage",
        waste: "Waste (%)",
        price: "Price per tube (optional)",
        result: "Order",
        joint: "Joint length",
        volume: "Net volume",
        orderVol: "Volume with waste",
        perTube: "Coverage of one tube",
        tubes: "Tubes to order",
        leftover: "Leftover sealant",
        cost: "Tube cost",
        note: "Rounding buys whole tubes. Backer rod, primer, and tape are not included. This is not the baseboard or paint calculator.",
        copyBtn: "Copy order",
        copied: "Copied",
        reset: "Reset",
        errLength: "Joint length must be between 0.2 and 500 m (or the foot equivalent).",
        errBead: unit === "m" ? "Bead size must be between 2 and 30 mm." : "Bead size must be between 0.08 and 1.18 in.",
        errWaste: "Waste must be between 0 and 40%.",
        errOpen: "Each opening side must be between 0.2 and 6 m, and the count between 1 and 80.",
      };

  const result = useMemo(() => {
    const waste = parseNum(wastePct);
    const bw = parseNum(beadW);
    const bd = parseNum(beadD);
    const toM = unit === "ft" ? 0.3048 : 1;
    let lengthM: number | null = null;
    if (mode === "length") {
      const raw = parseNum(length);
      lengthM = raw == null ? null : raw * toM;
    } else {
      const n = parseNum(count);
      const w = parseNum(openingW);
      const h = parseNum(openingH);
      if (n == null || w == null || h == null || n < 1 || n > 80 || w * toM < 0.2 || h * toM < 0.2 || w * toM > 6 || h * toM > 6) {
        return { error: copy.errOpen };
      }
      lengthM = n * 2 * (w + h) * toM;
    }
    if (lengthM == null || lengthM < 0.2 || lengthM > 500) return { error: copy.errLength };
    const beadMm = unit === "ft" ? 25.4 : 1;
    if (bw == null || bd == null || bw * beadMm < 2 || bd * beadMm < 2 || bw * beadMm > 30 || bd * beadMm > 30) return { error: copy.errBead };
    if (waste == null || waste < 0 || waste > 40) return { error: copy.errWaste };
    const factor = profile === "fillet" ? 0.5 : 1;
    const volumeMl = lengthM * 1000 * (bw * beadMm) * (bd * beadMm) * factor / 1000;
    const orderMl = volumeMl * (1 + waste / 100);
    const tubeMl = TUBE_ML[tube];
    const tubes = Math.ceil(orderMl / tubeMl - 1e-9);
    const leftover = tubes * tubeMl - orderMl;
    const coverageM = tubeMl / ((bw * beadMm) * (bd * beadMm) * factor / 1000);
    const unitPrice = parseNum(price);
    const lengthUnit = unit === "m" ? "m" : "ft";
    const lengthShown = lengthM / toM;
    const coverageShown = coverageM / toM;
    return {
      lengthShown,
      lengthUnit,
      volumeMl,
      orderMl,
      tubes,
      leftover,
      coverageShown,
      cost: unitPrice != null && unitPrice >= 0 ? tubes * unitPrice : null,
    };
  }, [beadD, beadW, copy.errBead, copy.errLength, copy.errOpen, copy.errWaste, count, length, mode, openingH, openingW, price, profile, tube, unit, wastePct]);

  function applyPreset(preset: Preset) {
    setUnit(preset.unit);
    setMode(preset.mode);
    setLength(preset.length);
    setCount(preset.count);
    setOpeningW(preset.openingW);
    setOpeningH(preset.openingH);
    setBeadW(preset.beadW);
    setBeadD(preset.beadD);
    setProfile(preset.profile);
    setTube(preset.tube);
    setWastePct(preset.waste);
    setCopied(false);
  }

  function reset() {
    applyPreset(PRESETS[0]);
    setPrice("");
  }

  async function copyResult() {
    if ("error" in result) return;
    const tubeLabel = tube === "299" ? (es ? "10,1 oz" : "10.1 oz") : `${TUBE_ML[tube]} ml`;
    const text = es
      ? `Silicona: ${result.tubes} tubos de ${tubeLabel}, junta ${formatNum(result.lengthShown)} ${result.lengthUnit}, sobrante ${formatNum(result.leftover, 0)} ml.`
      : `Sealant: ${result.tubes} tubes of ${tubeLabel}, joint ${formatNum(result.lengthShown)} ${result.lengthUnit}, leftover ${formatNum(result.leftover, 0)} ml.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const presetLabel = (id: string) =>
    id === "bath" ? copy.bath : id === "windows" ? copy.windows : id === "counter" ? copy.counter : copy.exterior;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <form className="grid gap-3 rounded-2xl border bg-card p-4" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.presets}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className={buttonClass} onClick={() => applyPreset(preset)}>
                {presetLabel(preset.id)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.unit}
            <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
              <option value="m">{copy.meters}</option>
              <option value="ft">{copy.feet}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.mode}
            <select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="length">{copy.total}</option>
              <option value="openings">{copy.openings}</option>
            </select>
          </label>
        </div>
        {mode === "length" ? (
          <label className="grid gap-1 text-sm">
            {copy.length}
            <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
          </label>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm">
              {copy.count}
              <input className={inputClass} inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.openingW}
              <input className={inputClass} inputMode="decimal" value={openingW} onChange={(e) => setOpeningW(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              {copy.openingH}
              <input className={inputClass} inputMode="decimal" value={openingH} onChange={(e) => setOpeningH(e.target.value)} />
            </label>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.beadW}
            <input className={inputClass} inputMode="decimal" value={beadW} onChange={(e) => setBeadW(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.beadD}
            <input className={inputClass} inputMode="decimal" value={beadD} onChange={(e) => setBeadD(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.profile}
            <select className={inputClass} value={profile} onChange={(e) => setProfile(e.target.value as Profile)}>
              <option value="fillet">{copy.fillet}</option>
              <option value="butt">{copy.butt}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            {copy.tube}
            <select className={inputClass} value={tube} onChange={(e) => setTube(e.target.value as Tube)}>
              <option value="300">{copy.t300}</option>
              <option value="310">{copy.t310}</option>
              <option value="299">{copy.t299}</option>
              <option value="600">{copy.t600}</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            {copy.waste}
            <input className={inputClass} inputMode="decimal" value={wastePct} onChange={(e) => setWastePct(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            {copy.price}
            <input className={inputClass} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
          </label>
        </div>
        <button type="button" className={`${buttonClass} w-full sm:w-auto`} onClick={reset}>
          {copy.reset}
        </button>
      </form>
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{copy.result}</h2>
        {"error" in result ? (
          <p className="mt-3 text-sm text-destructive">{result.error}</p>
        ) : (
          <>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.joint}</dt>
                <dd className="font-medium">{formatNum(result.lengthShown)} {result.lengthUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.volume}</dt>
                <dd className="font-medium">{formatNum(result.volumeMl, 0)} ml</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.orderVol}</dt>
                <dd className="font-medium">{formatNum(result.orderMl, 0)} ml</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.perTube}</dt>
                <dd className="font-medium">{formatNum(result.coverageShown)} {result.lengthUnit}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.tubes}</dt>
                <dd className="font-medium">{result.tubes}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{copy.leftover}</dt>
                <dd className="font-medium">{formatNum(result.leftover, 0)} ml</dd>
              </div>
              {result.cost != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{copy.cost}</dt>
                  <dd className="font-medium">{formatNum(result.cost)}</dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">{copy.note}</p>
            <button type="button" className={`${buttonClass} mt-4 w-full sm:w-auto`} onClick={copyResult}>
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
