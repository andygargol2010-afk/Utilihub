import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function n(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) throw new Error("Use an integer from 1 to 3999.");
  const map: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let n0 = num;
  let out = "";
  for (const [v, s] of map) {
    while (n0 >= v) {
      out += s;
      n0 -= v;
    }
  }
  return out;
}

function fromRoman(s: string): number {
  const t = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(t)) throw new Error("Invalid Roman numeral.");
  const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < t.length; i++) {
    const cur = val[t[i]!]!;
    const next = val[t[i + 1]!] ?? 0;
    total += cur < next ? -cur : cur;
  }
  if (total < 1 || total > 3999) throw new Error("Out of range.");
  return total;
}

function b64urlToJson(part: string): unknown {
  const pad = part.length % 4 === 0 ? "" : "=".repeat(4 - (part.length % 4));
  const b64 = (part + pad).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  try {
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return JSON.parse(text);
  } catch {
    return JSON.parse(binary);
  }
}

function luhnOk(digits: string): boolean {
  const s = digits.replace(/\D/g, "");
  if (s.length < 2) return false;
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = Number(s[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function ipToInt(ip: string): number {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) throw new Error("Invalid IPv4.");
  return ((p[0]! << 24) >>> 0) + (p[1]! << 16) + (p[2]! << 8) + p[3]!;
}

function intToIp(n0: number): string {
  return [(n0 >>> 24) & 255, (n0 >>> 16) & 255, (n0 >>> 8) & 255, n0 & 255].join(".");
}

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const esErr = (m: string, es: boolean) => {
  if (!es) return m;
  return (
    {
      "Enter the required values.": "Introduce los valores requeridos.",
      "Invalid input.": "Entrada no válida.",
      "Use an integer from 1 to 3999.": "Usa un entero de 1 a 3999.",
      "Invalid Roman numeral.": "Número romano no válido.",
      "Out of range.": "Fuera de rango.",
      "Invalid JWT.": "JWT no válido.",
      "Invalid IPv4.": "IPv4 no válido.",
      "CIDR must be 0–32.": "El CIDR debe estar entre 0 y 32.",
      "Height and weight must be positive.": "Altura y peso deben ser positivos.",
      "Credits must be positive.": "Los créditos deben ser positivos.",
      "Denominator cannot be 0.": "El denominador no puede ser 0.",
      "Balance and payment must be positive.": "Saldo y pago deben ser positivos.",
      "Payment too low to cover interest.": "El pago es demasiado bajo para cubrir el interés.",
      "Fixed costs and margin must work.": "Costos fijos y margen deben ser coherentes.",
    }[m] ?? m
  );
};

export function SeoGrowthTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const labels = useMemo(() => {
    const L: Record<string, { title: string; fields: string[]; btn: string }> = {
      imc: {
        title: es ? "Calculadora de IMC" : "BMI calculator",
        fields: es ? ["Peso (kg)", "Altura (cm)"] : ["Weight (kg)", "Height (cm)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "bmr-tdee": {
        title: es ? "BMR y TDEE" : "BMR & TDEE",
        fields: es
          ? ["Peso (kg)", "Altura (cm)", "Edad", "Sexo (1=hombre 2=mujer)", "Actividad (1.2–1.9)"]
          : ["Weight (kg)", "Height (cm)", "Age", "Sex (1=male 2=female)", "Activity (1.2–1.9)"],
        btn: es ? "Calcular" : "Calculate",
      },
      gpa: {
        title: es ? "Calculadora de GPA" : "GPA calculator",
        fields: es
          ? ["Nota", "Créditos", "Nota 2 (opc)", "Créditos 2 (opc)"]
          : ["Grade", "Credits", "Grade 2 (opt)", "Credits 2 (opt)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "generador-qr": {
        title: es ? "Generador de QR" : "QR generator",
        fields: es ? ["Texto o URL"] : ["Text or URL"],
        btn: es ? "Generar" : "Generate",
      },
      "jwt-decoder": {
        title: es ? "Decodificador JWT" : "JWT decoder",
        fields: es ? ["Token JWT"] : ["JWT token"],
        btn: es ? "Decodificar" : "Decode",
      },
      "numeros-romanos": {
        title: es ? "Números romanos" : "Roman numerals",
        fields: es
          ? ["Número o romano", "Modo (1=a romano 2=a arábigo)"]
          : ["Number or Roman", "Mode (1=to Roman 2=to Arabic)"],
        btn: es ? "Convertir" : "Convert",
      },
      fracciones: {
        title: es ? "Fracciones" : "Fractions",
        fields: es
          ? ["Numerador A", "Denominador A", "Numerador B", "Denominador B", "Op (1+ 2- 3× 4÷)"]
          : ["Numerator A", "Denominator A", "Numerator B", "Denominator B", "Op (1+ 2- 3× 4÷)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "relacion-aspecto": {
        title: es ? "Relación de aspecto" : "Aspect ratio",
        fields: es ? ["Ancho (px)", "Alto (px)"] : ["Width (px)", "Height (px)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "peso-ideal": {
        title: es ? "Peso ideal" : "Ideal weight",
        fields: es ? ["Altura (cm)", "Sexo (1=hombre 2=mujer)"] : ["Height (cm)", "Sex (1=male 2=female)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "fecha-parto": {
        title: es ? "Fecha de parto" : "Due date",
        fields: es ? ["Fecha FUM (AAAA-MM-DD)"] : ["LMP date (YYYY-MM-DD)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "ciclos-sueno": {
        title: es ? "Ciclos de sueño" : "Sleep cycles",
        fields: es ? ["Hora de despertar (HH:MM)"] : ["Wake time (HH:MM)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "pago-tarjeta-credito": {
        title: es ? "Pago de tarjeta" : "Card payoff",
        fields: es ? ["Saldo", "Tasa anual %", "Pago mensual"] : ["Balance", "APR %", "Monthly payment"],
        btn: es ? "Calcular" : "Calculate",
      },
      "cron-generator": {
        title: es ? "Ayuda cron" : "Cron helper",
        fields: es
          ? ["Preset (1=cada hora 2=diario 3=lunes 9am 4=cada 15 min)"]
          : ["Preset (1=hourly 2=daily 3=Mon 9am 4=every 15m)"],
        btn: es ? "Generar" : "Generate",
      },
      "calculadora-subnet": {
        title: es ? "Subnet / CIDR" : "Subnet / CIDR",
        fields: es ? ["IP", "Prefijo CIDR (ej. 24)"] : ["IP", "CIDR prefix (e.g. 24)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "tiempo-lectura": {
        title: es ? "Tiempo de lectura" : "Reading time",
        fields: es ? ["Texto o nº de palabras", "PPM (defecto 200)"] : ["Text or word count", "WPM (default 200)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "validador-luhn": {
        title: es ? "Validador Luhn" : "Luhn validator",
        fields: es ? ["Número (solo dígitos)"] : ["Number (digits only)"],
        btn: es ? "Validar" : "Validate",
      },
      "punto-equilibrio-unidades": {
        title: es ? "Punto de equilibrio" : "Break-even units",
        fields: es
          ? ["Costos fijos", "Precio unitario", "Costo variable unitario"]
          : ["Fixed costs", "Price per unit", "Variable cost per unit"],
        btn: es ? "Calcular" : "Calculate",
      },
      "mpg-a-litros": {
        title: es ? "MPG ↔ L/100 km" : "MPG ↔ L/100 km",
        fields: es ? ["Valor", "Modo (1=MPG→L/100 2=L/100→MPG)"] : ["Value", "Mode (1=MPG→L/100 2=L/100→MPG)"],
        btn: es ? "Convertir" : "Convert",
      },
      "ppi-pantalla": {
        title: es ? "PPI de pantalla" : "Screen PPI",
        fields: es ? ["Ancho px", "Alto px", "Diagonal (pulgadas)"] : ["Width px", "Height px", "Diagonal (inches)"],
        btn: es ? "Calcular" : "Calculate",
      },
      "crecimiento-periodico": {
        title: es ? "Crecimiento periódico" : "Periodic growth",
        fields: es
          ? ["Aporte", "Frecuencia (1=día 2=semana)", "Años", "Saldo inicial"]
          : ["Contribution", "Frequency (1=day 2=week)", "Years", "Starting balance"],
        btn: es ? "Proyectar" : "Project",
      },
    };
    return L[tool.slug] ?? { title: tool.name, fields: ["Input"], btn: es ? "Calcular" : "Calculate" };
  }, [tool.slug, es]);

  const run = () => {
    try {
      setQrUrl("");
      let result = "";
      switch (tool.slug) {
        case "imc": {
          const w = n(a),
            hCm = n(b);
          if (!(w > 0 && hCm > 0)) throw new Error("Height and weight must be positive.");
          const h = hCm / 100;
          const bmi = w / (h * h);
          let cat = "";
          if (bmi < 18.5) cat = es ? "Bajo peso" : "Underweight";
          else if (bmi < 25) cat = es ? "Normal" : "Normal";
          else if (bmi < 30) cat = es ? "Sobrepeso" : "Overweight";
          else cat = es ? "Obesidad" : "Obesity";
          result = `BMI / IMC: ${bmi.toFixed(1)}\n${es ? "Categoría" : "Category"}: ${cat}`;
          break;
        }
        case "bmr-tdee": {
          const w = n(a),
            h = n(b),
            age = n(c),
            sex = n(d || "1"),
            act = n(text || "1.55");
          if (!(w > 0 && h > 0 && age > 0)) throw new Error("Enter the required values.");
          const bmr = sex === 2 ? 10 * w + 6.25 * h - 5 * age - 161 : 10 * w + 6.25 * h - 5 * age + 5;
          const factor = act >= 1.2 && act <= 1.9 ? act : 1.55;
          result = `BMR: ${bmr.toFixed(0)} kcal\nTDEE: ${(bmr * factor).toFixed(0)} kcal`;
          break;
        }
        case "gpa": {
          const g1 = n(a),
            c1 = n(b),
            g2 = n(c || "0"),
            c2 = n(d || "0");
          if (!(c1 > 0)) throw new Error("Credits must be positive.");
          const totalC = c1 + (c2 > 0 ? c2 : 0);
          const pts = g1 * c1 + (c2 > 0 ? g2 * c2 : 0);
          result = `GPA: ${(pts / totalC).toFixed(3)}\n${es ? "Créditos" : "Credits"}: ${totalC}`;
          break;
        }
        case "generador-qr": {
          const payload = (text || a).trim();
          if (!payload) throw new Error("Enter the required values.");
          // External image API (no npm dep). Payload is sent to api.qrserver.com.
          setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`);
          result = es
            ? "Código QR generado abajo. (La imagen se solicita a un servicio externo.)"
            : "QR code generated below. (Image is requested from an external service.)";
          break;
        }
        case "jwt-decoder": {
          const token = (text || a).trim();
          const parts = token.split(".");
          if (parts.length < 2) throw new Error("Invalid JWT.");
          const header = b64urlToJson(parts[0]!);
          const payload = b64urlToJson(parts[1]!);
          result = `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}`;
          break;
        }
        case "numeros-romanos": {
          const mode = n(b || "1");
          if (mode === 2) result = `${es ? "Árabe" : "Arabic"}: ${fromRoman(a)}`;
          else {
            const num = Math.round(n(a));
            if (!Number.isFinite(num)) throw new Error("Enter the required values.");
            result = `${es ? "Romano" : "Roman"}: ${toRoman(num)}`;
          }
          break;
        }
        case "fracciones": {
          const n1 = n(a),
            d1 = n(b),
            n2 = n(c),
            d2 = n(d),
            op = n(text || "1");
          if (!d1 || !d2) throw new Error("Denominator cannot be 0.");
          let num = 0,
            den = 1;
          if (op === 1) {
            num = n1 * d2 + n2 * d1;
            den = d1 * d2;
          } else if (op === 2) {
            num = n1 * d2 - n2 * d1;
            den = d1 * d2;
          } else if (op === 3) {
            num = n1 * n2;
            den = d1 * d2;
          } else {
            if (!n2) throw new Error("Denominator cannot be 0.");
            num = n1 * d2;
            den = d1 * n2;
          }
          const g = gcd(num, den);
          num /= g;
          den /= g;
          if (den < 0) {
            num = -num;
            den = -den;
          }
          result = `${es ? "Resultado" : "Result"}: ${num}/${den} (${(num / den).toFixed(6)})`;
          break;
        }
        case "relacion-aspecto": {
          const w = n(a),
            h = n(b);
          if (!(w > 0 && h > 0)) throw new Error("Enter the required values.");
          const g = gcd(Math.round(w), Math.round(h));
          result = `${es ? "Ratio" : "Ratio"}: ${Math.round(w) / g}:${Math.round(h) / g}\n${(w / h).toFixed(4)}`;
          break;
        }
        case "peso-ideal": {
          const hCm = n(a),
            sex = n(b || "1");
          if (!(hCm > 0)) throw new Error("Enter the required values.");
          const inches = hCm / 2.54;
          const idealKg = (sex === 2 ? 45.5 : 50) + 0.91 * (hCm - 152.4);
          const hamwi = (sex === 2 ? 45.5 : 48) + 2.3 * Math.max(0, inches - 60) * 0.453592;
          result = `Devine: ${idealKg.toFixed(1)} kg\nHamwi ≈ ${hamwi.toFixed(1)} kg`;
          break;
        }
        case "fecha-parto": {
          const raw = (a || text).trim();
          const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!m) throw new Error("Enter the required values.");
          const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
          if (Number.isNaN(dt.getTime())) throw new Error("Enter the required values.");
          const due = new Date(dt);
          due.setDate(due.getDate() + 280);
          result = `${es ? "FPP estimada" : "Estimated due date"}: ${formatLocalYmd(due)}`;
          break;
        }
        case "ciclos-sueno": {
          const m = (a || text).trim().match(/^(\d{1,2}):(\d{2})$/);
          if (!m) throw new Error("Enter the required values.");
          const h = Number(m[1]);
          const min = Number(m[2]);
          if (h > 23 || min > 59) throw new Error("Enter the required values.");
          const times: string[] = [];
          for (let cycles = 6; cycles >= 3; cycles--) {
            let total = h * 60 + min - cycles * 90 - 15;
            if (total < 0) total += 24 * 60;
            const hh = Math.floor(total / 60) % 24;
            const mm = total % 60;
            times.push(
              `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} (${cycles} ${es ? "ciclos" : "cycles"})`,
            );
          }
          result = (es ? "Horas de dormir sugeridas:\n" : "Suggested bedtimes:\n") + times.join("\n");
          break;
        }
        case "pago-tarjeta-credito": {
          const bal = n(a),
            apr = n(b),
            pay = n(c);
          if (!(bal > 0 && pay > 0)) throw new Error("Balance and payment must be positive.");
          const r = apr / 100 / 12;
          if (r > 0 && pay <= bal * r) throw new Error("Payment too low to cover interest.");
          let b0 = bal,
            months = 0,
            interest = 0;
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
          const p = n(a || "1");
          const presets: Record<number, [string, string]> = {
            1: ["0 * * * *", es ? "Cada hora en el minuto 0" : "Every hour at minute 0"],
            2: ["0 0 * * *", es ? "Todos los días a medianoche" : "Every day at midnight"],
            3: ["0 9 * * 1", es ? "Lunes a las 9:00" : "Mondays at 09:00"],
            4: ["*/15 * * * *", es ? "Cada 15 minutos" : "Every 15 minutes"],
          };
          const [expr, desc] = presets[p] ?? presets[1]!;
          result = `Cron: ${expr}\n${desc}`;
          break;
        }
        case "calculadora-subnet": {
          const prefix = Math.round(n(b));
          if (prefix < 0 || prefix > 32) throw new Error("CIDR must be 0–32.");
          const ipInt = ipToInt(a.trim());
          const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
          const network = (ipInt & mask) >>> 0;
          const broadcast = (network | (~mask >>> 0)) >>> 0;
          const hosts = prefix >= 31 ? 0 : broadcast - network - 1;
          result = `${es ? "Red" : "Network"}: ${intToIp(network)}/${prefix}\nBroadcast: ${intToIp(broadcast)}\nHosts: ${hosts}\nMask: ${intToIp(mask)}`;
          break;
        }
        case "tiempo-lectura": {
          const raw = (text || a).trim();
          if (!raw) throw new Error("Enter the required values.");
          const wpm = n(b || "200") || 200;
          const words = /^\d+$/.test(raw) ? n(raw) : raw.split(/\s+/).filter(Boolean).length;
          const mins = words / wpm;
          result = `${es ? "Palabras" : "Words"}: ${words}\n${es ? "Tiempo" : "Time"}: ${mins < 1 ? `${Math.ceil(mins * 60)} s` : `${mins.toFixed(1)} min`}`;
          break;
        }
        case "validador-luhn": {
          result = luhnOk(a || text) ? (es ? "Válido (Luhn OK)" : "Valid (Luhn OK)") : es ? "No válido" : "Invalid";
          break;
        }
        case "punto-equilibrio-unidades": {
          const fixed = n(a),
            price = n(b),
            variable = n(c);
          const margin = price - variable;
          if (!(margin > 0)) throw new Error("Fixed costs and margin must work.");
          const units = fixed / margin;
          result = `${es ? "Unidades de equilibrio" : "Break-even units"}: ${Math.ceil(units)} (${units.toFixed(2)})`;
          break;
        }
        case "mpg-a-litros": {
          const v = n(a),
            mode = n(b || "1");
          if (!(v > 0)) throw new Error("Enter the required values.");
          result =
            mode === 2
              ? `${v} L/100km ≈ ${(235.214583 / v).toFixed(2)} MPG (US)`
              : `${v} MPG ≈ ${(235.214583 / v).toFixed(2)} L/100km`;
          break;
        }
        case "ppi-pantalla": {
          const w = n(a),
            h = n(b),
            diag = n(c);
          if (!(w > 0 && h > 0 && diag > 0)) throw new Error("Enter the required values.");
          result = `PPI: ${(Math.sqrt(w * w + h * h) / diag).toFixed(1)}`;
          break;
        }
        case "crecimiento-periodico": {
          const contrib = n(a),
            freq = n(b || "1"),
            years = n(c),
            start = n(d || "0");
          if (!(contrib >= 0 && years > 0)) throw new Error("Enter the required values.");
          const periods = freq === 2 ? years * 52 : years * 365;
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

  const fieldCount = labels.fields.length;
  /** Single textarea tools (no secondary numeric field in the same row). */
  const textOnly = ["generador-qr", "jwt-decoder", "fecha-parto", "ciclos-sueno", "validador-luhn"].includes(
    tool.slug,
  );
  const readingTime = tool.slug === "tiempo-lectura";

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{labels.title}</p>
      {textOnly ? (
        <label className="block space-y-1">
          <span className="text-sm font-medium">{labels.fields[0]}</span>
          <textarea
            className="min-h-[88px] w-full rounded-xl border bg-background px-3 py-2 text-sm"
            value={text || a}
            onChange={(e) => {
              setText(e.target.value);
              setA(e.target.value);
            }}
          />
        </label>
      ) : readingTime ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">{labels.fields[0]}</span>
            <textarea
              className="min-h-[88px] w-full rounded-xl border bg-background px-3 py-2 text-sm"
              value={text || a}
              onChange={(e) => {
                setText(e.target.value);
                setA(e.target.value);
              }}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">{labels.fields[1]}</span>
            <input
              className="h-11 w-full rounded-xl border bg-background px-3"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="200"
            />
          </label>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {labels.fields.slice(0, 4).map((label, idx) => {
            const setters = [setA, setB, setC, setD];
            const values = [a, b, c, d];
            return (
              <label key={label} className="space-y-1">
                <span className="text-sm font-medium">{label}</span>
                <input
                  className="h-11 w-full rounded-xl border bg-background px-3"
                  value={values[idx] ?? ""}
                  onChange={(e) => setters[idx]?.(e.target.value)}
                />
              </label>
            );
          })}
          {fieldCount > 4 && (
            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm font-medium">{labels.fields[4]}</span>
              <input className="h-11 w-full rounded-xl border bg-background px-3" value={text} onChange={(e) => setText(e.target.value)} />
            </label>
          )}
        </div>
      )}
      <button type="button" onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">
        {labels.btn}
      </button>
      {out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm">{out}</output>}
      {qrUrl && (
        <div className="flex justify-center rounded-xl border bg-card p-4">
          <img src={qrUrl} alt="QR" width={220} height={220} className="rounded-lg" />
        </div>
      )}
    </div>
  );
}
