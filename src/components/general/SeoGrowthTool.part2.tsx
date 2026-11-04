// Part 2 of 3 — split from SeoGrowthTool.tsx on 2026-11-04. Edit here; SeoGrowthTool.tsx re-exports.
import { buildGapSeoFields } from "@/lib/general/gap-seo-ops";

export type FieldDef =
  | { kind: "number" | "text" | "textarea"; label: string; placeholder?: string }
  | { kind: "select"; label: string; options: { value: string; label: string }[] };

export function n(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) throw new Error("Use an integer from 1 to 3999.");
  const map: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
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

export function fromRoman(s: string): number {
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

export function b64urlToJson(part: string): unknown {
  const pad = part.length % 4 === 0 ? "" : "=".repeat(4 - (part.length % 4));
  const b64 = (part + pad).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  try {
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return JSON.parse(new TextDecoder("utf-8", { fatal: false }).decode(bytes));
  } catch {
    return JSON.parse(binary);
  }
}

export function luhnOk(digits: string): boolean {
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

export function ipToInt(ip: string): number {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) throw new Error("Invalid IPv4.");
  return ((p[0]! << 24) >>> 0) + (p[1]! << 16) + (p[2]! << 8) + p[3]!;
}

export function intToIp(n0: number): string {
  return [(n0 >>> 24) & 255, (n0 >>> 16) & 255, (n0 >>> 8) & 255, n0 & 255].join(".");
}

export function formatLocalYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const esErr = (m: string, es: boolean) => {
  if (!es) return m;
  return ({
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
  }[m] ?? m);
};

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3";
export const selectClass = "h-11 w-full rounded-xl border bg-background px-3";

export function sexOptions(es: boolean) {
  return [
    { value: "1", label: es ? "Hombre" : "Male" },
    { value: "2", label: es ? "Mujer" : "Female" },
  ];
}

export function activityOptions(es: boolean) {
  return [
    { value: "1.2", label: es ? "Sedentario (1.2)" : "Sedentary (1.2)" },
    { value: "1.375", label: es ? "Ligero (1.375)" : "Light (1.375)" },
    { value: "1.55", label: es ? "Moderado (1.55)" : "Moderate (1.55)" },
    { value: "1.725", label: es ? "Activo (1.725)" : "Active (1.725)" },
    { value: "1.9", label: es ? "Muy activo (1.9)" : "Very active (1.9)" },
  ];
}

export function buildFields(slug: string, es: boolean): { title: string; btn: string; fields: FieldDef[] } {
  const gap = buildGapSeoFields(slug, es);
  if (gap) return gap;
  const calc = es ? "Calcular" : "Calculate";
  switch (slug) {
    case "imc":
      return { title: es ? "Calculadora de IMC" : "BMI calculator", btn: calc, fields: [{ kind: "number", label: es ? "Peso (kg)" : "Weight (kg)" }, { kind: "number", label: es ? "Altura (cm)" : "Height (cm)" }] };
    case "bmr-tdee":
      return { title: es ? "BMR y TDEE" : "BMR & TDEE", btn: calc, fields: [{ kind: "number", label: es ? "Peso (kg)" : "Weight (kg)" }, { kind: "number", label: es ? "Altura (cm)" : "Height (cm)" }, { kind: "number", label: es ? "Edad" : "Age" }, { kind: "select", label: es ? "Sexo" : "Sex", options: sexOptions(es) }, { kind: "select", label: es ? "Nivel de actividad" : "Activity level", options: activityOptions(es) }] };
    case "gpa":
      return { title: es ? "Calculadora de GPA" : "GPA calculator", btn: calc, fields: [] };
    case "generador-qr":
      return { title: es ? "Generador de QR" : "QR generator", btn: es ? "Generar" : "Generate", fields: [{ kind: "textarea", label: es ? "Texto o URL" : "Text or URL" }] };
    case "jwt-decoder":
      return { title: es ? "Decodificador JWT" : "JWT decoder", btn: es ? "Decodificar" : "Decode", fields: [{ kind: "textarea", label: es ? "Token JWT" : "JWT token" }] };
    case "numeros-romanos":
      return { title: es ? "Números romanos" : "Roman numerals", btn: es ? "Convertir" : "Convert", fields: [{ kind: "text", label: es ? "Número o romano" : "Number or Roman" }, { kind: "select", label: es ? "Dirección" : "Direction", options: [{ value: "to-roman", label: es ? "Árabe → romano" : "Arabic → Roman" }, { value: "to-arabic", label: es ? "Romano → árabe" : "Roman → Arabic" }] }] };
    case "fracciones":
      return { title: es ? "Fracciones" : "Fractions", btn: calc, fields: [{ kind: "number", label: es ? "Numerador A" : "Numerator A" }, { kind: "number", label: es ? "Denominador A" : "Denominator A" }, { kind: "number", label: es ? "Numerador B" : "Numerator B" }, { kind: "number", label: es ? "Denominador B" : "Denominator B" }, { kind: "select", label: es ? "Operación" : "Operation", options: [{ value: "add", label: es ? "Sumar" : "Add" }, { value: "sub", label: es ? "Restar" : "Subtract" }, { value: "mul", label: es ? "Multiplicar" : "Multiply" }, { value: "div", label: es ? "Dividir" : "Divide" }] }] };
    case "relacion-aspecto":
      return { title: es ? "Relación de aspecto" : "Aspect ratio", btn: calc, fields: [{ kind: "number", label: es ? "Ancho (px)" : "Width (px)" }, { kind: "number", label: es ? "Alto (px)" : "Height (px)" }] };
    case "peso-ideal":
      return { title: es ? "Peso ideal" : "Ideal weight", btn: calc, fields: [{ kind: "number", label: es ? "Altura (cm)" : "Height (cm)" }, { kind: "select", label: es ? "Sexo" : "Sex", options: sexOptions(es) }] };
    case "fecha-parto":
      return { title: es ? "Fecha de parto" : "Due date", btn: calc, fields: [{ kind: "text", label: es ? "Fecha FUM (AAAA-MM-DD)" : "LMP date (YYYY-MM-DD)", placeholder: "2026-01-15" }] };
    case "ciclos-sueno":
      return { title: es ? "Ciclos de sueño" : "Sleep cycles", btn: calc, fields: [{ kind: "text", label: es ? "Hora de despertar (HH:MM)" : "Wake time (HH:MM)", placeholder: "07:00" }] };
    case "pago-tarjeta-credito":
      return { title: es ? "Pago de tarjeta" : "Card payoff", btn: calc, fields: [{ kind: "number", label: es ? "Saldo" : "Balance" }, { kind: "number", label: es ? "Tasa anual %" : "APR %" }, { kind: "number", label: es ? "Pago mensual" : "Monthly payment" }] };
    case "cron-generator":
      return { title: es ? "Ayuda cron" : "Cron helper", btn: es ? "Generar" : "Generate", fields: [{ kind: "select", label: es ? "Plantilla" : "Preset", options: [{ value: "hourly", label: es ? "Cada hora" : "Every hour" }, { value: "daily", label: es ? "Todos los días a medianoche" : "Every day at midnight" }, { value: "monday9", label: es ? "Lunes a las 9:00" : "Mondays at 09:00" }, { value: "every15", label: es ? "Cada 15 minutos" : "Every 15 minutes" }] }] };
    case "calculadora-subnet":
      return { title: es ? "Subnet / CIDR" : "Subnet / CIDR", btn: calc, fields: [{ kind: "text", label: "IP", placeholder: "192.168.1.10" }, { kind: "number", label: es ? "Prefijo CIDR" : "CIDR prefix", placeholder: "24" }] };
    case "tiempo-lectura":
      return { title: es ? "Tiempo de lectura" : "Reading time", btn: calc, fields: [{ kind: "textarea", label: es ? "Texto o nº de palabras" : "Text or word count" }, { kind: "number", label: es ? "PPM (defecto 200)" : "WPM (default 200)", placeholder: "200" }] };
    case "validador-luhn":
      return { title: es ? "Validador Luhn" : "Luhn validator", btn: es ? "Validar" : "Validate", fields: [{ kind: "text", label: es ? "Número (solo dígitos)" : "Number (digits only)" }] };
    case "punto-equilibrio-unidades":
      return { title: es ? "Punto de equilibrio" : "Break-even units", btn: calc, fields: [{ kind: "number", label: es ? "Costos fijos" : "Fixed costs" }, { kind: "number", label: es ? "Precio unitario" : "Price per unit" }, { kind: "number", label: es ? "Costo variable unitario" : "Variable cost per unit" }] };
    case "mpg-a-litros":
      return { title: es ? "MPG ↔ L/100 km" : "MPG ↔ L/100 km", btn: es ? "Convertir" : "Convert", fields: [{ kind: "number", label: es ? "Valor" : "Value" }, { kind: "select", label: es ? "Conversión" : "Conversion", options: [{ value: "mpg-to-l", label: "MPG → L/100 km" }, { value: "l-to-mpg", label: "L/100 km → MPG" }] }] };
    case "ppi-pantalla":
      return { title: es ? "PPI de pantalla" : "Screen PPI", btn: calc, fields: [{ kind: "number", label: es ? "Ancho px" : "Width px" }, { kind: "number", label: es ? "Alto px" : "Height px" }, { kind: "number", label: es ? "Diagonal (pulgadas)" : "Diagonal (inches)" }] };
    case "crecimiento-periodico":
      return { title: es ? "Crecimiento periódico" : "Periodic growth", btn: es ? "Proyectar" : "Project", fields: [{ kind: "number", label: es ? "Aporte" : "Contribution" }, { kind: "select", label: es ? "Frecuencia" : "Frequency", options: [{ value: "day", label: es ? "Diario" : "Daily" }, { value: "week", label: es ? "Semanal" : "Weekly" }] }, { kind: "number", label: es ? "Años" : "Years" }, { kind: "number", label: es ? "Saldo inicial" : "Starting balance", placeholder: "0" }] };
    default:
      return { title: "", btn: calc, fields: [{ kind: "text", label: es ? "Entrada" : "Input" }] };
  }
}
