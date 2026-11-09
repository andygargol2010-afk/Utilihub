// TOOL_SEO_OVERRIDES_BASE_A part 2 — split out of ../tool-seo-overrides-base-a.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBase } from "../tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_A_2: Record<string, ToolSeoOverrideBase> = {
  "generador-de-contrasenas": {
    metaTitle: "Password Generator — Strong Random Passwords | UtiliHub",
    metaTitleEs: "Generador de contraseñas seguras gratis | UtiliHub",
    metaDescription:
      "Generate strong random passwords in your browser. Control length, symbols, and character sets. Free, no signup.",
    metaDescriptionEs:
      "Generá contraseñas aleatorias fuertes en el navegador. Controlá longitud, símbolos y tipos de caracteres. Gratis, sin registro.",
    about: [
      "A password generator creates random strings so you do not rely on human-chosen patterns. You pick length and whether to include symbols, numbers, and mixed case.",
      "Generation happens locally. Copy the result into a password manager and enable 2FA where the site supports it.",
      "Never email yourself new passwords or reuse the same generated string on multiple important accounts.",
    ],
    aboutEs: [
      "Un generador crea cadenas al azar para no depender de patrones humanos. Elegís longitud y si incluir símbolos, números y mayúsculas/minúsculas.",
      "La generación es local. Copiá el resultado a un gestor de contraseñas y activá 2FA donde el sitio lo permita.",
      "No te envíes las claves por mail ni reutilices la misma cadena en varias cuentas importantes.",
    ],
    steps: [
      "Choose length and character options.",
      "Generate a password.",
      "Copy it to your password manager.",
      "Use a unique password per important site.",
    ],
    stepsEs: [
      "Elegí longitud y opciones de caracteres.",
      "Generá la contraseña.",
      "Copiala a tu gestor.",
      "Usá una distinta en cada sitio importante.",
    ],
    faq: [
      {
        q: "How long should a password be?",
        a: "For most accounts, 12–16+ random characters is a solid baseline. Critical accounts benefit from longer strings or a manager-generated secret.",
      },
      {
        q: "Are generated passwords stored?",
        a: "No. They exist only in your browser session until you copy or leave the page.",
      },
    ],
    faqEs: [
      {
        q: "¿De qué longitud?",
        a: "Para la mayoría de cuentas, 12–16+ caracteres al azar es un buen piso. Cuentas críticas conviene alargarlas o usar el secreto del gestor.",
      },
      {
        q: "¿Se guardan las contraseñas generadas?",
        a: "No. Solo existen en la sesión del navegador hasta que las copiás o salís de la página.",
      },
    ],
  },

  porcentaje: {
    metaTitle: "Percentage Calculator — What is X% of Y? Free | UtiliHub",
    metaTitleEs: "Calculadora de porcentajes online gratis | UtiliHub",
    metaDescription:
      "Calculate percentages instantly: X% of Y, what percent A is of B, and percent change. Free, no signup — in your browser.",
    metaDescriptionEs:
      "Calculá porcentajes al instante: el X% de Y, qué % es A de B y el cambio porcentual. Gratis, sin registro, en el navegador.",
    about: [
      "Percentage problems show up in discounts, tips, taxes, grades, and growth rates. This calculator handles common cases: finding a percent of a number, finding what percent one number is of another, and percent change.",
      "All math runs locally so you can check store prices, markups, or homework without a spreadsheet.",
      "Percent change is (new − old) / old. Be careful with the base: “20% off” applies to the original price, not to a price that was already discounted unless the offer says so.",
    ],
    aboutEs: [
      "Los porcentajes aparecen en descuentos, propinas, impuestos, notas y tasas de crecimiento. Esta calculadora cubre casos habituales: un % de un número, qué % es un valor de otro, y el cambio porcentual.",
      "El cálculo es local: precios, recargos o deberes sin planilla.",
      "El cambio porcentual es (nuevo − viejo) / viejo. Cuidado con la base: “20% off” se aplica al precio original, no a uno ya rebajado, salvo que la oferta diga otra cosa.",
    ],
    steps: [
      "Pick the mode you need (percent of, reverse percent, or change).",
      "Enter the numbers involved.",
      "Read the result and units (amount vs percentage points).",
      "Double-check the base amount for discounts and increases.",
    ],
    stepsEs: [
      "Elegí el modo (porcentaje de, porcentaje inverso o cambio).",
      "Ingresá los números.",
      "Leé el resultado y las unidades (monto vs puntos porcentuales).",
      "Revisá la base en descuentos y aumentos.",
    ],
    faq: [
      {
        q: "How do I calculate a discount?",
        a: "Multiply the original price by (1 − discount%). Example: $80 with 25% off → 80 × 0.75 = $60.",
      },
      {
        q: "Percent vs percentage points?",
        a: "If a rate goes from 10% to 12%, that is a rise of 2 percentage points, or a 20% relative increase.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calculo un descuento?",
        a: "Multiplicá el precio original por (1 − % de descuento). Ejemplo: $80 con 25% off → 80 × 0.75 = $60.",
      },
      {
        q: "¿Porcentaje o puntos porcentuales?",
        a: "Si una tasa pasa de 10% a 12%, sube 2 puntos porcentuales, o un 20% en términos relativos.",
      },
    ],
  },
};
