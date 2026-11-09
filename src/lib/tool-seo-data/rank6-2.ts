// TOOL_SEO_OVERRIDES_RANK6 part 2 — split out of ../tool-seo-overrides-rank6.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RANK6_2: Record<string, ToolSeoOverride> = {
  "generador-de-contrasenas": {
    metaTitle: "Password Generator Free — Strong Random Passwords Online | UtiliHub",
    metaTitleEs: "Generador de contraseñas seguras online gratis — aleatorias | UtiliHub",
    metaDescription:
      "Create strong random passwords in your browser. Choose length, symbols and character sets. Free password generator, nothing uploaded.",
    metaDescriptionEs:
      "Creá contraseñas aleatorias fuertes en el navegador. Elegí longitud, símbolos y tipos de caracteres. Generador gratis; no se sube nada.",
    about: [
      "A password generator builds random strings so you avoid human patterns. Prefer long unique passwords stored in a password manager.",
      "This tool uses the browser’s cryptographic randomness (crypto.getRandomValues). Generation is local — the password is not sent to a server.",
      "Enable 2FA where available and never reuse the same password on important accounts.",
    ],
    aboutEs: [
      "Un generador de contraseñas arma cadenas al azar para evitar patrones humanos. Preferí claves largas y únicas guardadas en un gestor.",
      "Esta herramienta usa aleatoriedad criptográfica del navegador (crypto.getRandomValues). La generación es local: la clave no se envía a un servidor.",
      "Activá 2FA donde exista y no reutilices la misma contraseña en cuentas importantes.",
    ],
    steps: [
      "Set length and character options.",
      "Generate a password.",
      "Copy it into your password manager.",
    ],
    stepsEs: [
      "Definí longitud y opciones de caracteres.",
      "Generá la contraseña.",
      "Copiala a tu gestor de contraseñas.",
    ],
    faq: [
      {
        q: "How long should a password be?",
        a: "12–16+ random characters is a solid baseline for most accounts; critical ones can go longer.",
      },
      {
        q: "Are generated passwords stored online?",
        a: "No. They only exist in your browser session until you copy or leave the page.",
      },
      {
        q: "Is this password generator free?",
        a: "Yes. No signup and no upload of the generated string.",
      },
    ],
    faqEs: [
      {
        q: "¿De qué longitud debe ser una contraseña segura?",
        a: "12–16+ caracteres aleatorios es un buen piso para la mayoría; en cuentas críticas, más largo aún.",
      },
      {
        q: "¿Se guardan las contraseñas generadas?",
        a: "No. Solo existen en la sesión del navegador hasta que las copiás o salís de la página.",
      },
      {
        q: "¿Hay generador de contraseñas online gratis?",
        a: "Sí. Este genera claves fuertes en el navegador, sin registro y sin subir datos.",
      },
      {
        q: "¿Puedo evitar caracteres confusos?",
        a: "Sí, si la herramienta ofrece excluir símbolos ambiguos (0/O, 1/l, etc.).",
      },
    ],
  },

  "calculadora-de-porcentajes": {
    metaTitle: "Percentage Calculator – Of, Change & Discount | UtiliHub",
    metaTitleEs: "Calculadora de porcentajes online gratis — de un monto, cambio y descuento | UtiliHub",
    metaDescription:
      "Find % of a number, what % X is of Y, and % change or discount. Free percentage calculator with clear formulas, no signup.",
    metaDescriptionEs:
      "Calculá el porcentaje de un número, qué % es X de Y, y el cambio o descuento porcentual. Calculadora de porcentajes gratis, sin registro.",
    about: [
      "A percentage is a part per hundred. “15% of 240” means 240 × 15 ÷ 100 = 36.",
      "Common cases: percentage of an amount, ratio as a percent, and percentage change between two values (including discounts).",
      "All results update in the browser; enter decimals as needed.",
    ],
    aboutEs: [
      "Un porcentaje es una parte por cada cien. “El 15% de 240” es 240 × 15 ÷ 100 = 36.",
      "Casos habituales: porcentaje de un monto, qué porcentaje representa un valor de otro, y cambio porcentual entre dos cifras (incluye descuentos).",
      "Los resultados se actualizan en el navegador; podés usar decimales.",
    ],
    steps: [
      "Choose the calculation type.",
      "Enter the two numbers.",
      "Read the result and formula.",
    ],
    stepsEs: [
      "Elegí el tipo de cálculo.",
      "Ingresá los dos números.",
      "Leé el resultado y la fórmula.",
    ],
    faq: [
      {
        q: "How do I calculate a percentage of a number?",
        a: "Multiply the number by the percent and divide by 100. Example: 20% of 50 = 10.",
      },
      {
        q: "How do I calculate a discount?",
        a: "Use percentage change from original to sale price, or apply the discount rate to the original price.",
      },
      {
        q: "How do I remove tax from a price?",
        a: "Divide the tax-inclusive price by (1 + rate). With 21% VAT: price ÷ 1.21.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calcular el porcentaje de un número?",
        a: "Multiplicá el número por el porcentaje y dividí por 100. Ejemplo: 20% de 50 = 10.",
      },
      {
        q: "¿Cómo calcular un descuento?",
        a: "Usá el cambio porcentual entre precio original y final, o aplicá el % de descuento al precio original.",
      },
      {
        q: "¿Cómo sacar el IVA de un precio?",
        a: "Dividí el precio con impuesto por (1 + tasa). Con IVA 21%: precio ÷ 1,21.",
      },
      {
        q: "¿Hay calculadora de porcentajes online gratis?",
        a: "Sí. Esta resuelve % de un monto, proporción y cambio, sin registro.",
      },
    ],
  },

};
