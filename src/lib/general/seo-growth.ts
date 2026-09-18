import { makeTool } from "./types";

/** High-SEO growth tools (blocks 1–2). Local browser math only. */
const t = (
  slug: string,
  name: string,
  category: string,
  kind: string,
  summary: string,
  keywords: string[] = [],
) =>
  makeTool(slug, name, category, kind, summary, keywords, {
    mode: "seo-growth",
  });

export const SEO_GROWTH_TOOLS = [
  t("imc", "BMI calculator", "ciencia", "number", "Calculate body mass index from height and weight.", [
    "bmi",
    "body mass index",
    "imc",
    "calculadora imc",
  ]),
  t("bmr-tdee", "BMR and TDEE calculator", "ciencia", "number", "Estimate basal metabolic rate and daily calorie needs.", [
    "bmr",
    "tdee",
    "calorie calculator",
    "mifflin",
  ]),
  t("gpa", "GPA calculator", "educacion", "number", "Calculate grade point average from grades and credits.", [
    "gpa calculator",
    "grade point average",
    "college gpa",
  ]),
  t("generador-qr", "QR code generator", "generadores", "generator", "Generate a QR code from any text or URL in the browser.", [
    "qr code",
    "qr generator",
    "generador qr",
  ]),
  t("jwt-decoder", "JWT decoder", "desarrollo", "code", "Decode a JWT header and payload without verifying the signature.", [
    "jwt decode",
    "json web token",
    "jwt debugger",
  ]),
  t("numeros-romanos", "Roman numerals converter", "matematicas", "number", "Convert between Arabic numbers and Roman numerals.", [
    "roman numerals",
    "números romanos",
    "roman converter",
  ]),
  t("fracciones", "Fraction calculator", "matematicas", "number", "Add, subtract, multiply, or divide two fractions and simplify.", [
    "fraction calculator",
    "add fractions",
    "calculadora fracciones",
  ]),
  t("relacion-aspecto", "Aspect ratio calculator", "diseno", "number", "Compute aspect ratio and missing side from width and height.", [
    "aspect ratio",
    "16:9",
    "relación de aspecto",
  ]),
  t("peso-ideal", "Ideal weight calculator", "ciencia", "number", "Estimate ideal body weight ranges from height and sex.", [
    "ideal weight",
    "peso ideal",
    "devine formula",
  ]),
  t("fecha-parto", "Pregnancy due date calculator", "fechas", "date", "Estimate due date from last menstrual period or conception date.", [
    "due date",
    "pregnancy calculator",
    "fecha de parto",
  ]),
  t("ciclos-sueno", "Sleep cycle calculator", "productividad", "timer", "Plan wake-up times based on 90-minute sleep cycles.", [
    "sleep calculator",
    "sleep cycle",
    "ciclos de sueño",
  ]),
  t("pago-tarjeta-credito", "Credit card payoff calculator", "utilidades", "number", "Estimate months and interest to pay off a credit card balance.", [
    "credit card payoff",
    "card debt calculator",
    "pago tarjeta",
  ]),
  t("cron-generator", "Cron expression helper", "desarrollo", "code", "Build and explain common cron schedules.", [
    "cron expression",
    "cron generator",
    "crontab",
  ]),
  t("calculadora-subnet", "Subnet calculator", "desarrollo", "code", "Calculate network address, broadcast, and host range from CIDR.", [
    "subnet calculator",
    "cidr",
    "ip calculator",
  ]),
  t("tiempo-lectura", "Reading time estimator", "texto", "text", "Estimate reading time from word count or pasted text.", [
    "reading time",
    "tiempo de lectura",
    "words per minute",
  ]),
  t("validador-luhn", "Luhn check digit validator", "seguridad", "number", "Validate a number sequence with the Luhn algorithm (local only).",
    ["luhn", "check digit", "card validation"]),
  t("punto-equilibrio-unidades", "Break-even units calculator", "utilidades", "number", "Find units to sell to cover fixed and variable costs.", [
    "break even",
    "punto de equilibrio",
    "units to break even",
  ]),
  t("mpg-a-litros", "MPG to L/100km converter", "conversiones", "converter", "Convert fuel economy between MPG and liters per 100 km.", [
    "mpg to l/100km",
    "fuel economy",
    "consumo combustible",
  ]),
  t("ppi-pantalla", "Screen PPI calculator", "diseno", "number", "Calculate pixels per inch from resolution and diagonal size.", [
    "ppi calculator",
    "pixel density",
    "screen ppi",
  ]),
  t("crecimiento-periodico", "Periodic growth calculator", "utilidades", "number", "Project savings if you add a fixed amount every day or week.", [
    "daily savings",
    "weekly savings",
    "crecimiento periodico",
  ]),
];
