import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function BodyFatCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("75");
  const [neckCm, setNeckCm] = useState("38");
  const [waistCm, setWaistCm] = useState("85");
  const [hipCm, setHipCm] = useState("95");
  const [copied, setCopied] = useState(false);

  const h = parseFloat(heightCm) || 0;
  const w = parseFloat(weightKg) || 0;
  const n = parseFloat(neckCm) || 0;
  const wa = parseFloat(waistCm) || 0;
  const hi = parseFloat(hipCm) || 0;
  const a = parseFloat(age) || 30;

  const heightIn = h / 2.54;
  const neckIn = n / 2.54;
  const waistIn = wa / 2.54;
  const hipIn = hi / 2.54;

  let navy = 0;
  if (sex === "male" && waistIn > neckIn && heightIn > 0) {
    navy = 86.010 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
  } else if (sex === "female" && wa + hi > n && heightIn > 0) {
    navy = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
  }
  navy = Math.max(0, Math.min(60, navy));

  const bmi = h > 0 ? w / Math.pow(h / 100, 2) : 0;
  const sexNum = sex === "male" ? 1 : 0;
  const bmiBf = bmi > 0 ? 1.2 * bmi + 0.23 * a - 10.8 * sexNum - 5.4 : 0;
  const bmiBfClamped = Math.max(0, Math.min(60, bmiBf));

  async function copy() {
    const text = es
      ? `Sexo: ${sex === "male" ? "Hombre" : "Mujer"}\nAltura: ${h} cm\nNavy: ${navy.toFixed(1)}%\nBMI est.: ${bmiBfClamped.toFixed(1)}%`
      : `Sex: ${sex}\nHeight: ${h} cm\nNavy: ${navy.toFixed(1)}%\nBMI est.: ${bmiBfClamped.toFixed(1)}%`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setSex("male");
    setAge("30");
    setHeightCm("175");
    setWeightKg("75");
    setNeckCm("38");
    setWaistCm("85");
    setHipCm("95");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Porcentaje de grasa estimado" : "Estimated body fat percentage"}</p>
        <p className="text-lg font-medium">Navy: {navy.toFixed(1)}%</p>
        <p className="text-lg font-medium">{es ? "Estimación BMI" : "BMI estimate"}: {bmiBfClamped.toFixed(1)}%</p>
        {navy === 0 && <p className="text-sm text-amber-600">{es ? "Medidas incompletas o inconsistentes." : "Incomplete or inconsistent measurements."}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Sexo" : "Sex"}</span>
          <select value={sex} onChange={(e) => setSex(e.target.value)} className={fieldClass}>
            <option value="male">{es ? "Hombre" : "Male"}</option>
            <option value="female">{es ? "Mujer" : "Female"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Edad" : "Age"}</span>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} min="15" max="100" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={fieldClass} step="any" min="100" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
          <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className={fieldClass} step="any" min="30" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cuello (cm)" : "Neck (cm)"}</span>
          <input type="number" value={neckCm} onChange={(e) => setNeckCm(e.target.value)} className={fieldClass} step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cintura (cm)" : "Waist (cm)"}</span>
          <input type="number" value={waistCm} onChange={(e) => setWaistCm(e.target.value)} className={fieldClass} step="any" />
        </label>
        {sex === "female" && (
          <label className="block space-y-2 text-sm sm:col-span-2">
            <span className="font-medium">{es ? "Cadera (cm)" : "Hip (cm)"}</span>
            <input type="number" value={hipCm} onChange={(e) => setHipCm(e.target.value)} className={fieldClass} step="any" />
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultados" : "Copy results"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
