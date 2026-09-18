import { useEffect, useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

type FieldDef =
  | { kind: "number" | "text" | "textarea"; label: string; placeholder?: string }
  | { kind: "select"; label: string; options: { value: string; label: string }[] };

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

const inputClass = "h-11 w-full rounded-xl border bg-background px-3";
const selectClass = "h-11 w-full rounded-xl border bg-background px-3";

function sexOptions(es: boolean) {
  return [
    { value: "1", label: es ? "Hombre" : "Male" },
    { value: "2", label: es ? "Mujer" : "Female" },
  ];
}

function activityOptions(es: boolean) {
  return [
    { value: "1.2", label: es ? "Sedentario (1.2)" : "Sedentary (1.2)" },
    { value: "1.375", label: es ? "Ligero (1.375)" : "Light (1.375)" },
    { value: "1.55", label: es ? "Moderado (1.55)" : "Moderate (1.55)" },
    { value: "1.725", label: es ? "Activo (1.725)" : "Active (1.725)" },
    { value: "1.9", label: es ? "Muy activo (1.9)" : "Very active (1.9)" },
  ];
}

function buildFields(slug: string, es: boolean): { title: string; btn: string; fields: FieldDef[] } {
  const calc = es ? "Calcular" : "Calculate";
  switch (slug) {
    case "imc":
      return {
        title: es ? "Calculadora de IMC" : "BMI calculator",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Peso (kg)" : "Weight (kg)" },
          { kind: "number", label: es ? "Altura (cm)" : "Height (cm)" },
        ],
      };
    case "bmr-tdee":
      return {
        title: es ? "BMR y TDEE" : "BMR & TDEE",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Peso (kg)" : "Weight (kg)" },
          { kind: "number", label: es ? "Altura (cm)" : "Height (cm)" },
          { kind: "number", label: es ? "Edad" : "Age" },
          { kind: "select", label: es ? "Sexo" : "Sex", options: sexOptions(es) },
          { kind: "select", label: es ? "Nivel de actividad" : "Activity level", options: activityOptions(es) },
        ],
      };
    case "gpa":
      return {
        title: es ? "Calculadora de GPA" : "GPA calculator",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Nota" : "Grade" },
          { kind: "number", label: es ? "Créditos" : "Credits" },
          { kind: "number", label: es ? "Nota 2 (opc.)" : "Grade 2 (opt.)" },
          { kind: "number", label: es ? "Créditos 2 (opc.)" : "Credits 2 (opt.)" },
        ],
      };
    case "generador-qr":
      return {
        title: es ? "Generador de QR" : "QR generator",
        btn: es ? "Generar" : "Generate",
        fields: [{ kind: "textarea", label: es ? "Texto o URL" : "Text or URL" }],
      };
    case "jwt-decoder":
      return {
        title: es ? "Decodificador JWT" : "JWT decoder",
        btn: es ? "Decodificar" : "Decode",
        fields: [{ kind: "textarea", label: es ? "Token JWT" : "JWT token" }],
      };
    case "numeros-romanos":
      return {
        title: es ? "Números romanos" : "Roman numerals",
        btn: es ? "Convertir" : "Convert",
        fields: [
          { kind: "text", label: es ? "Número o romano" : "Number or Roman" },
          {
            kind: "select",
            label: es ? "Dirección" : "Direction",
            options: [
              { value: "to-roman", label: es ? "Árabe → romano" : "Arabic → Roman" },
              { value: "to-arabic", label: es ? "Romano → árabe" : "Roman → Arabic" },
            ],
          },
        ],
      };
    case "fracciones":
      return {
        title: es ? "Fracciones" : "Fractions",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Numerador A" : "Numerator A" },
          { kind: "number", label: es ? "Denominador A" : "Denominator A" },
          { kind: "number", label: es ? "Numerador B" : "Numerator B" },
          { kind: "number", label: es ? "Denominador B" : "Denominator B" },
          {
            kind: "select",
            label: es ? "Operación" : "Operation",
            options: [
              { value: "add", label: es ? "Sumar" : "Add" },
              { value: "sub", label: es ? "Restar" : "Subtract" },
              { value: "mul", label: es ? "Multiplicar" : "Multiply" },
              { value: "div", label: es ? "Dividir" : "Divide" },
            ],
          },
        ],
      };
    case "relacion-aspecto":
      return {
        title: es ? "Relación de aspecto" : "Aspect ratio",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Ancho (px)" : "Width (px)" },
          { kind: "number", label: es ? "Alto (px)" : "Height (px)" },
        ],
      };
    case "peso-ideal":
      return {
        title: es ? "Peso ideal" : "Ideal weight",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Altura (cm)" : "Height (cm)" },
          { kind: "select", label: es ? "Sexo" : "Sex", options: sexOptions(es) },
        ],
      };
    case "fecha-parto":
      return {
        title: es ? "Fecha de parto" : "Due date",
        btn: calc,
        fields: [{ kind: "text", label: es ? "Fecha FUM (AAAA-MM-DD)" : "LMP date (YYYY-MM-DD)", placeholder: "2026-01-15" }],
      };
    case "ciclos-sueno":
      return {
        title: es ? "Ciclos de sueño" : "Sleep cycles",
        btn: calc,
        fields: [{ kind: "text", label: es ? "Hora de despertar (HH:MM)" : "Wake time (HH:MM)", placeholder: "07:00" }],
      };
    case "pago-tarjeta-credito":
      return {
        title: es ? "Pago de tarjeta" : "Card payoff",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Saldo" : "Balance" },
          { kind: "number", label: es ? "Tasa anual %" : "APR %" },
          { kind: "number", label: es ? "Pago mensual" : "Monthly payment" },
        ],
      };
    case "cron-generator":
      return {
        title: es ? "Ayuda cron" : "Cron helper",
        btn: es ? "Generar" : "Generate",
        fields: [
          {
            kind: "select",
            label: es ? "Plantilla" : "Preset",
            options: [
              { value: "hourly", label: es ? "Cada hora" : "Every hour" },
              { value: "daily", label: es ? "Todos los días a medianoche" : "Every day at midnight" },
              { value: "monday9", label: es ? "Lunes a las 9:00" : "Mondays at 09:00" },
              { value: "every15", label: es ? "Cada 15 minutos" : "Every 15 minutes" },
            ],
          },
        ],
      };
    case "calculadora-subnet":
      return {
        title: es ? "Subnet / CIDR" : "Subnet / CIDR",
        btn: calc,
        fields: [
          { kind: "text", label: "IP", placeholder: "192.168.1.10" },
          { kind: "number", label: es ? "Prefijo CIDR" : "CIDR prefix", placeholder: "24" },
        ],
      };
    case "tiempo-lectura":
      return {
        title: es ? "Tiempo de lectura" : "Reading time",
        btn: calc,
        fields: [
          { kind: "textarea", label: es ? "Texto o nº de palabras" : "Text or word count" },
          { kind: "number", label: es ? "PPM (defecto 200)" : "WPM (default 200)", placeholder: "200" },
        ],
      };
    case "validador-luhn":
      return {
        title: es ? "Validador Luhn" : "Luhn validator",
        btn: es ? "Validar" : "Validate",
        fields: [{ kind: "text", label: es ? "Número (solo dígitos)" : "Number (digits only)" }],
      };
    case "punto-equilibrio-unidades":
      return {
        title: es ? "Punto de equilibrio" : "Break-even units",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Costos fijos" : "Fixed costs" },
          { kind: "number", label: es ? "Precio unitario" : "Price per unit" },
          { kind: "number", label: es ? "Costo variable unitario" : "Variable cost per unit" },
        ],
      };
    case "mpg-a-litros":
      return {
        title: es ? "MPG ↔ L/100 km" : "MPG ↔ L/100 km",
        btn: es ? "Convertir" : "Convert",
        fields: [
          { kind: "number", label: es ? "Valor" : "Value" },
          {
            kind: "select",
            label: es ? "Conversión" : "Conversion",
            options: [
              { value: "mpg-to-l", label: "MPG → L/100 km" },
              { value: "l-to-mpg", label: "L/100 km → MPG" },
            ],
          },
        ],
      };
    case "ppi-pantalla":
      return {
        title: es ? "PPI de pantalla" : "Screen PPI",
        btn: calc,
        fields: [
          { kind: "number", label: es ? "Ancho px" : "Width px" },
          { kind: "number", label: es ? "Alto px" : "Height px" },
          { kind: "number", label: es ? "Diagonal (pulgadas)" : "Diagonal (inches)" },
        ],
      };
    case "crecimiento-periodico":
      return {
        title: es ? "Crecimiento periódico" : "Periodic growth",
        btn: es ? "Proyectar" : "Project",
        fields: [
          { kind: "number", label: es ? "Aporte" : "Contribution" },
          {
            kind: "select",
            label: es ? "Frecuencia" : "Frequency",
            options: [
              { value: "day", label: es ? "Diario" : "Daily" },
              { value: "week", label: es ? "Semanal" : "Weekly" },
            ],
          },
          { kind: "number", label: es ? "Años" : "Years" },
          { kind: "number", label: es ? "Saldo inicial" : "Starting balance", placeholder: "0" },
        ],
      };
    default:
      return { title: "", btn: calc, fields: [{ kind: "text", label: es ? "Entrada" : "Input" }] };
  }
}

export function SeoGrowthTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const meta = useMemo(() => buildFields(tool.slug, es), [tool.slug, es]);
  const [values, setValues] = useState<string[]>(() =>
    meta.fields.map((f) => (f.kind === "select" ? f.options[0]!.value : "")),
  );
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
      switch (tool.slug) {
        case "imc": {
          const w = n(v[0]!), hCm = n(v[1]!);
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
          const w = n(v[0]!), h = n(v[1]!), age = n(v[2]!), sex = n(v[3] || "1"), act = n(v[4] || "1.55");
          if (!(w > 0 && h > 0 && age > 0)) throw new Error("Enter the required values.");
          const bmr = sex === 2 ? 10 * w + 6.25 * h - 5 * age - 161 : 10 * w + 6.25 * h - 5 * age + 5;
          const factor = act >= 1.2 && act <= 1.9 ? act : 1.55;
          result = `BMR: ${bmr.toFixed(0)} kcal\nTDEE: ${(bmr * factor).toFixed(0)} kcal`;
          break;
        }
        case "gpa": {
          const g1 = n(v[0]!), c1 = n(v[1]!), g2 = n(v[2] || "0"), c2 = n(v[3] || "0");
          if (!(c1 > 0)) throw new Error("Credits must be positive.");
          const totalC = c1 + (c2 > 0 ? c2 : 0);
          const pts = g1 * c1 + (c2 > 0 ? g2 * c2 : 0);
          result = `GPA: ${(pts / totalC).toFixed(3)}\n${es ? "Créditos" : "Credits"}: ${totalC}`;
          break;
        }
        case "generador-qr": {
          const payload = (v[0] || "").trim();
          if (!payload) throw new Error("Enter the required values.");
          setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`);
          result = es
            ? "Código QR generado abajo. (La imagen se solicita a un servicio externo.)"
            : "QR code generated below. (Image is requested from an external service.)";
          break;
        }
        case "jwt-decoder": {
          const token = (v[0] || "").trim();
          const parts = token.split(".");
          if (parts.length < 2) throw new Error("Invalid JWT.");
          result = `Header:\n${JSON.stringify(b64urlToJson(parts[0]!), null, 2)}\n\nPayload:\n${JSON.stringify(b64urlToJson(parts[1]!), null, 2)}`;
          break;
        }
        case "numeros-romanos": {
          const mode = v[1] || "to-roman";
          if (mode === "to-arabic") result = `${es ? "Árabe" : "Arabic"}: ${fromRoman(v[0] || "")}`;
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
          result = `${es ? "Ratio" : "Ratio"}: ${Math.round(w) / g}:${Math.round(h) / g}\n${(w / h).toFixed(4)}`;
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
          const raw = (v[0] || "").trim();
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
          const m = (v[0] || "").trim().match(/^(\d{1,2}):(\d{2})$/);
          if (!m) throw new Error("Enter the required values.");
          const h = Number(m[1]), min = Number(m[2]);
          if (h > 23 || min > 59) throw new Error("Enter the required values.");
          const times: string[] = [];
          for (let cycles = 6; cycles >= 3; cycles--) {
            let total = h * 60 + min - cycles * 90 - 15;
            if (total < 0) total += 24 * 60;
            const hh = Math.floor(total / 60) % 24;
            const mm = total % 60;
            times.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} (${cycles} ${es ? "ciclos" : "cycles"})`);
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
          const p = v[0] || "hourly";
          const presets: Record<string, [string, string]> = {
            hourly: ["0 * * * *", es ? "Cada hora en el minuto 0" : "Every hour at minute 0"],
            daily: ["0 0 * * *", es ? "Todos los días a medianoche" : "Every day at midnight"],
            monday9: ["0 9 * * 1", es ? "Lunes a las 9:00" : "Mondays at 09:00"],
            every15: ["*/15 * * * *", es ? "Cada 15 minutos" : "Every 15 minutes"],
          };
          const [expr, desc] = presets[p] ?? presets.hourly!;
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
        case "validador-luhn": {
          result = luhnOk(v[0] || "") ? (es ? "Válido (Luhn OK)" : "Valid (Luhn OK)") : es ? "No válido" : "Invalid";
          break;
        }
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
          result = mode === "l-to-mpg"
            ? `${val} L/100km ≈ ${(235.214583 / val).toFixed(2)} MPG (US)`
            : `${val} MPG ≈ ${(235.214583 / val).toFixed(2)} L/100km`;
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
          const span =
            field.kind === "textarea" || (meta.fields.length === 1 && field.kind !== "select")
              ? "sm:col-span-2"
              : "";
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
                <textarea
                  className="min-h-[88px] w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  value={values[i] ?? ""}
                  onChange={(e) => setAt(i, e.target.value)}
                />
              ) : (
                <input
                  type={field.kind === "number" ? "number" : "text"}
                  className={inputClass}
                  value={values[i] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setAt(i, e.target.value)}
                />
              )}
            </label>
          );
        })}
      </div>
      <button type="button" onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">
        {meta.btn}
      </button>
      {out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm">{out}</output>}
      {qrUrl && (
        <div className="flex justify-center rounded-xl border bg-card p-4">
          <img src={qrUrl} alt="QR" width={220} height={220} className="rounded-lg" loading="lazy" />
        </div>
      )}
    </div>
  );
}
