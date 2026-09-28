/** SEO-growth overrides part b1. */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_B1: Record<string, ToolSeoOverrideGrowth> = {
  "ciclos-sueno": {
    metaTitle: "Sleep Cycle Calculator — 90-Minute Bedtimes | UtiliHub",
    metaTitleEs: "Calculadora de ciclos de sueño (90 minutos) | UtiliHub",
    metaDescription:
      "Work backward from a wake-up time to suggested bedtimes on 90-minute sleep cycles, with a short wind-down buffer.",
    metaDescriptionEs:
      "A partir de la hora de despertar, sugerí horarios para dormir en ciclos de 90 minutos, con un margen breve para conciliar el sueño.",
    about: [
      "Many popular sleep guides group rest into ~90-minute cycles. Waking near the end of a cycle can feel easier than waking mid-cycle.",
      "This calculator subtracts whole cycles plus a short fall-asleep buffer from your target wake time.",
      "Individual sleep architecture varies. Use the times as experiments, not rigid medical rules.",
    ],
    aboutEs: [
      "Muchas guías agrupan el sueño en ciclos de ~90 minutos. Despertar cerca del final de un ciclo suele sentirse mejor que a mitad del ciclo.",
      "La calculadora resta ciclos enteros más un margen breve para quedarte dormido desde la hora de despertar.",
      "La arquitectura del sueño varía. Usá los horarios como prueba, no como regla médica rígida.",
    ],
    steps: [
      "Enter wake-up time as HH:MM.",
      "Review suggested bedtimes for 3–6 cycles.",
      "Pick the slot that fits your evening and test it for a few nights.",
    ],
    stepsEs: [
      "Ingresá la hora de despertar como HH:MM.",
      "Revisá horarios sugeridos para 3–6 ciclos.",
      "Elegí el que encaje en tu noche y probalo unos días.",
    ],
    faq: [
      {
        q: "Why include a 15-minute buffer?",
        a: "Most people need a few minutes to fall asleep; pure cycle math without a buffer is often too optimistic.",
      },
      {
        q: "Naps?",
        a: "Short naps are a different pattern. This tool targets overnight timing relative to a fixed wake time.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué 15 minutos de margen?",
        a: "Casi todos tardan unos minutos en dormirse; la cuenta pura de ciclos suele ser demasiado optimista.",
      },
      {
        q: "¿Siestas?",
        a: "Las siestas cortas son otro patrón. Esta tool apunta al horario nocturno respecto de una hora fija de despertar.",
      },
    ],
  },

  "validador-luhn": {
    metaTitle: "Luhn Algorithm Checker — Check Digit Validator | UtiliHub",
    metaTitleEs: "Validador del algoritmo de Luhn | UtiliHub",
    metaDescription:
      "Validate a digit sequence with the Luhn (mod 10) check digit algorithm. Local only—does not contact payment networks.",
    metaDescriptionEs:
      "Validá una secuencia de dígitos con el algoritmo de Luhn (módulo 10). Solo local: no contacta redes de pago.",
    about: [
      "The Luhn algorithm detects simple typos in identification numbers. Many card numbers and IMEIs use a check digit based on it.",
      "A passing Luhn check does not prove a number is issued, funded, or authorized—only that the checksum matches.",
      "All validation runs locally. Do not enter live card data on untrusted devices.",
    ],
    aboutEs: [
      "El algoritmo de Luhn detecta errores de tipeo en números de identificación. Muchas tarjetas e IMEI usan un dígito de control basado en él.",
      "Pasar Luhn no prueba que el número esté emitido, con fondos o autorizado: solo que el checksum coincide.",
      "Toda la validación es local. No ingreses datos de tarjetas reales en dispositivos no confiables.",
    ],
    steps: [
      "Enter digits only (spaces are ignored).",
      "Run the Luhn check.",
      "Use the result as a format check, not as payment authorization.",
    ],
    stepsEs: [
      "Ingresá solo dígitos (los espacios se ignoran).",
      "Ejecutá la verificación Luhn.",
      "Usá el resultado como control de formato, no como autorización de pago.",
    ],
    faq: [
      {
        q: "Why did a real-looking number fail?",
        a: "Random digits fail about 90% of the time. Only sequences designed with a valid check digit pass.",
      },
      {
        q: "Is this PCI compliant storage?",
        a: "No storage occurs in the tool itself, but your environment still must follow your own security policies.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué falla un número “realista”?",
        a: "Dígitos al azar fallan ~90% de las veces. Solo pasan secuencias diseñadas con dígito de control válido.",
      },
      {
        q: "¿Es almacenamiento PCI?",
        a: "La tool no guarda datos, pero tu entorno debe cumplir tus propias políticas de seguridad.",
      },
    ],
  },
};
