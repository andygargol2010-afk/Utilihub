import { useEffect, useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { runGapSeo } from "@/lib/general/gap-seo-ops";
import { type Locale } from "./SeoGrowthTool.part1";
import { buildFields, n, b64urlToJson, fromRoman, toRoman, gcd, formatLocalYmd, ipToInt, intToIp, luhnOk, esErr, selectClass, inputClass } from "./SeoGrowthTool.part2";

export function SeoGrowthTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const meta = useMemo(() => buildFields(tool.slug, es), [tool.slug, es]);
  const [values, setValues] = useState<string[]>(() => meta.fields.map((f) => (f.kind === "select" ? f.options[0]!.value : "")));
  const [out, setOut] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    setValues(meta.fields.map((f) => (f.kind === "select" ? f.options[0]!.value : "")));
    setOut("");
    setQrUrl("");
  }, [tool.slug, meta.fields]);

  const setAt = (i: number, v: string) => setValues((prev) => prev.map((x, j) => (j === i ? v : x)));

  const run = () => {
    try {
      setQrUrl("");
      const v = values;
      let result = "";
      const gap = runGapSeo(tool.slug, v, es);
      if (gap) {
        result = gap.result;
        if (gap.qrPayload) {
          setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(gap.qrPayload)}`);
        }
      } else switch (tool.slug) {
        case "imc": {
          const w = n(v[0]!), hCm = n(v[1]!);
          if (!(w > 0 && hCm > 0)) throw new Error("Height and weight must be positive.");
          const h = hCm / 100;
          const bmi = w / (h * h);
          let cat = bmi < 18.5 ? (es ? "Bajo peso" : "Underweight") : bmi < 25 ? (es ? "Normal" : "Normal") : bmi < 30 ? (es ? "Sobrepeso" : "Overweight") : es ? "Obesidad" : "Obesity";
          result = `BMI / IMC: ${bmi.toFixed(1)}\n${es ? "Categoría" : "Category"}: ${cat}`;
          break;
        }
        case "bmr-tdee": {
          const w = n(v[0]!), h = n(v[1]!), age = n(v[2]!), sex = n(v[3] || "1"), act = n(v[4] || "1.55");
          if (!(w > 0 && h > 0 && age > 0)) throw new Error("Enter the required values.");
          const bmr = sex === 2 ? 10 * w + 6.25 * h - 5 * age - 161 : 10 * w + 6.25 * h - 5 * age + 5;
          const factor = act >= 1.2 && act <= 1.9 ? act : 1.55;
          result = `BMR: ${bmr.toFixed(0)} kcal\nTDEE: ${(bmr * factor).toFixed(0)} kcal`;
          break;
        }
        case "generador-qr": {
          const payload = (v[0] || "").trim();
          if (!payload) throw new Error("Enter the required values.");
          setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`);
          result = es ? "Código QR generado abajo. (La imagen se solicita a un servicio externo.)" : "QR code generated below. (Image is requested from an external service.)";
          break;
        }
        case "jwt-decoder": {
          const parts = (v[0] || "").trim().split(".");
          if (parts.length < 2) throw new Error("Invalid JWT.");
          result = `Header:\n${JSON.stringify(b64urlToJson(parts[0]!), null, 2)}\n\nPayload:\n${JSON.stringify(b64urlToJson(parts[1]!), null, 2)}`;
          break;
        }
        case "numeros-romanos": {
          if ((v[1] || "to-roman") === "to-arabic") result = `${es ? "Árabe" : "Arabic"}: ${fromRoman(v[0] || "")}`;
          else {
            const num = Math.round(n(v[0] || ""));
            if (!Number.isFinite(num)) throw new Error("Enter the required values.");
            result = `${es ? "Romano" : "Roman"}: ${toRoman(num)}`;
          }
          break;
        }
        case "fracciones": {
          const n1 = n(v[0]!), d1 = n(v[1]!), n2 = n(v[2]!), d2 = n(v[3]!), op = v[4] || "add";
          if (!d1 || !d2) throw new Error("Denominator cannot be 0.");
          let num = 0, den = 1;
          if (op === "add") { num = n1 * d2 + n2 * d1; den = d1 * d2; }
          else if (op === "sub") { num = n1 * d2 - n2 * d1; den = d1 * d2; }
          else if (op === "mul") { num = n1 * n2; den = d1 * d2; }
          else { if (!n2) throw new Error("Denominator cannot be 0."); num = n1 * d2; den = d1 * n2; }
          const g = gcd(num, den); num /= g; den /= g;
          if (den < 0) { num = -num; den = -den; }
          result = `${es ? "Resultado" : "Result"}: ${num}/${den} (${(num / den).toFixed(6)})`;
          break;
        }
        case "relacion-aspecto": {
          const w = n(v[0]!), h = n(v[1]!);
          if (!(w > 0 && h > 0)) throw new Error("Enter the required values.");
          const g = gcd(Math.round(w), Math.round(h));
          result = `Ratio: ${Math.round(w) / g}:${Math.round(h) / g}\n${(w / h).toFixed(4)}`;
          break;
        }
        case "peso-ideal": {
          const hCm = n(v[0]!), sex = n(v[1] || "1");
          if (!(hCm > 0)) throw new Error("Enter the required values.");
          const inches = hCm / 2.54;
          const idealKg = (sex === 2 ? 45.5 : 50) + 0.91 * (hCm - 152.4);
          const hamwi = (sex === 2 ? 45.5 : 48) + 2.3 * Math.max(0, inches - 60) * 0.453592;
          result = `Devine: ${idealKg.toFixed(1)} kg\nHamwi ≈ ${hamwi.toFixed(1)} kg`;
          break;
        }
        case "fecha-parto": {
          const m = (v[0] || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!m) throw new Error("Enter the required values.");
          const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
          const due = new Date(dt);
          due.setDate(due.getDate() + 280);
          result = `${es ? "FPP estimada" : "Estimated due date"}: ${formatLocalYmd(due)}`;
          break;
        }
        case "ciclos-sueno": {
          const m = (v[0] || "").trim().match(/^(\d{1,2}):(\d{2})$/);
          if (!m) throw new Error("Enter the required values.");
          const h = Number(m[1]), min = Number(m[2]);
          if (h > 23 || min > 59) throw new Error("Enter the required values.");
          const times: string[] = [];
          for (let cycles = 6; cycles >= 3; cycles--) {
            let total = h * 60 + min - cycles * 90 - 15;
            if (total < 0) total += 24 * 60;
            times.push(`${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")} (${cycles} ${es ? "ciclos" : "cycles"})`);
          }
          result = (es ? "Horas de dormir sugeridas:\n" : "Suggested bedtimes:\n") + times.join("\n");
          break;
        }
        case "pago-tarjeta-credito": {
          const bal = n(v[0]!), apr = n(v[1]!), pay = n(v[2]!);
          if (!(bal > 0 && pay > 0)) throw new Error("Balance and payment must be positive.");
          const r = apr / 100 / 12;
          if (r > 0 && pay <= bal * r) throw new Error("Payment too low to cover interest.");
          let b0 = bal, months = 0, interest = 0;
          while (b0 > 0.005 && months < 600) {
            const i = r > 0 ? b0 * r : 0;
            interest += i;
            const due = b0 + i;
            const applied = Math.min(pay, due);
            b0 = due - applied;
            months++;
            if (applied < pay && b0 <= 0.005) break;
          }
          result = `${es ? "Meses" : "Months"}: ${months}\n${es ? "Interés total" : "Total interest"}: ${interest.toFixed(2)}`;
          break;
        }
        case "cron-generator": {
          const presets: Record<string, [string, string]> = {
            hourly: ["0 * * * *", es ? "Cada hora en el minuto 0" : "Every hour at minute 0"],
            daily: ["0 0 * * *", es ? "Todos los días a medianoche" : "Every day at midnight"],
            monday9: ["0 9 * * 1", es ? "Lunes a las 9:00" : "Mondays at 09:00"],
            every15: ["*/15 * * * *", es ? "Cada 15 minutos" : "Every 15 minutes"],
          };
          const [expr, desc] = presets[v[0] || "hourly"] ?? presets.hourly!;
          result = `Cron: ${expr}\n${desc}`;
          break;
        }
        case "calculadora-subnet": {
          const prefix = Math.round(n(v[1]!));
          if (prefix < 0 || prefix > 32) throw new Error("CIDR must be 0–32.");
          const ipInt = ipToInt((v[0] || "").trim());
          const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
          const network = (ipInt & mask) >>> 0;
          const broadcast = (network | (~mask >>> 0)) >>> 0;
          const hosts = prefix >= 31 ? 0 : broadcast - network - 1;
          result = `${es ? "Red" : "Network"}: ${intToIp(network)}/${prefix}\nBroadcast: ${intToIp(broadcast)}\nHosts: ${hosts}\nMask: ${intToIp(mask)}`;
          break;
        }
        case "tiempo-lectura": {
          const raw = (v[0] || "").trim();
          if (!raw) throw new Error("Enter the required values.");
          const wpm = n(v[1] || "200") || 200;
          const words = /^\d+$/.test(raw) ? n(raw) : raw.split(/\s+/).filter(Boolean).length;
          const mins = words / wpm;
          result = `${es ? "Palabras" : "Words"}: ${words}\n${es ? "Tiempo" : "Time"}: ${mins < 1 ? `${Math.ceil(mins * 60)} s` : `${mins.toFixed(1)} min`}`;
          break;
        }
        case "validador-luhn":
          result = luhnOk(v[0] || "") ? (es ? "Válido (Luhn OK)" : "Valid (Luhn OK)") : es ? "No válido" : "Invalid";
          break;
        case "punto-equilibrio-unidades": {
          const fixed = n(v[0]!), price = n(v[1]!), variable = n(v[2]!);
          const margin = price - variable;
          if (!(margin > 0)) throw new Error("Fixed costs and margin must work.");
          const units = fixed / margin;
          result = `${es ? "Unidades de equilibrio" : "Break-even units"}: ${Math.ceil(units)} (${units.toFixed(2)})`;
          break;
        }
        case "mpg-a-litros": {
          const val = n(v[0]!), mode = v[1] || "mpg-to-l";
          if (!(val > 0)) throw new Error("Enter the required values.");
          result = mode === "l-to-mpg" ? `${val} L/100km ≈ ${(235.214583 / val).toFixed(2)} MPG (US)` : `${val} MPG ≈ ${(235.214583 / val).toFixed(2)} L/100km`;
          break;
        }
        case "ppi-pantalla": {
          const w = n(v[0]!), h = n(v[1]!), diag = n(v[2]!);
          if (!(w > 0 && h > 0 && diag > 0)) throw new Error("Enter the required values.");
          result = `PPI: ${(Math.sqrt(w * w + h * h) / diag).toFixed(1)}`;
          break;
        }
        case "crecimiento-periodico": {
          const contrib = n(v[0]!), freq = v[1] || "day", years = n(v[2]!), start = n(v[3] || "0");
          if (!(contrib >= 0 && years > 0)) throw new Error("Enter the required values.");
          const periods = freq === "week" ? years * 52 : years * 365;
          result = `${es ? "Total proyectado" : "Projected total"}: ${(start + contrib * periods).toFixed(2)}\n${es ? "Aportes" : "Contributions"}: ${periods}`;
          break;
        }
        default:
          result = es ? "Herramienta no configurada." : "Tool not configured.";
      }
      setOut(result);
    } catch (e) {
      setOut(esErr(e instanceof Error ? e.message : "Invalid input.", es));
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{meta.title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {meta.fields.map((field, i) => {
          const span = field.kind === "textarea" || (meta.fields.length === 1 && field.kind !== "select") ? "sm:col-span-2" : "";
          return (
            <label key={`${field.label}-${i}`} className={`space-y-1 ${span}`}>
              <span className="text-sm font-medium">{field.label}</span>
              {field.kind === "select" ? (
                <select className={selectClass} value={values[i] ?? field.options[0]!.value} onChange={(e) => setAt(i, e.target.value)}>
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : field.kind === "textarea" ? (
                <textarea className="min-h-[88px] w-full rounded-xl border bg-background px-3 py-2 text-sm" value={values[i] ?? ""} onChange={(e) => setAt(i, e.target.value)} />
              ) : (
                <input type={field.kind === "number" ? "number" : "text"} className={inputClass} value={values[i] ?? ""} placeholder={field.placeholder} onChange={(e) => setAt(i, e.target.value)} />
              )}
            </label>
          );
        })}
      </div>
      <button type="button" onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">{meta.btn}</button>
      {out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm">{out}</output>}
      {qrUrl && (
        <div className="flex justify-center rounded-xl border bg-card p-4">
          <img src={qrUrl} alt="QR" width={220} height={220} className="rounded-lg" loading="lazy" />
        </div>
      )}
    </div>
  );
}
