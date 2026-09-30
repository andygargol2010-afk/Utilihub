import type { ToolSeoOverride } from "./tool-seo-overrides";

/** High-traffic legacy/core tools (calculator, etc.). */
export const TOOL_SEO_OVERRIDES_CORE: Record<string, ToolSeoOverride> = {
  calculadora: {
    metaTitle: "Online Calculator — Add, Subtract, Multiply, Divide | UtiliHub",
    metaTitleEs: "Calculadora online gratis — sumar, restar, multiplicar | UtiliHub",
    metaDescription:
      "Free online calculator with keyboard support, history, and basic arithmetic. No signup; runs in your browser.",
    metaDescriptionEs:
      "Calculadora online gratis con teclado, historial y operaciones básicas. Sin registro; funciona en el navegador.",
    about: [
      "A simple four-operation calculator for everyday math: add, subtract, multiply, and divide.",
      "Use the on-screen pad or your keyboard. History stays in the session until you reload.",
    ],
    aboutEs: [
      "Calculadora de cuatro operaciones para el día a día: sumar, restar, multiplicar y dividir.",
      "Usá el teclado en pantalla o el del dispositivo. El historial dura hasta recargar la página.",
    ],
    steps: [
      "Enter the first number.",
      "Choose an operation and the second number.",
      "Press equals to see the result.",
    ],
    stepsEs: [
      "Ingresá el primer número.",
      "Elegí la operación y el segundo número.",
      "Pulsá igual para ver el resultado.",
    ],
    faq: [
      { q: "Do I need an account?", a: "No. The calculator works in the browser with no signup." },
      { q: "Is data uploaded?", a: "No. Arithmetic runs locally on your device." },
    ],
    faqEs: [
      { q: "¿Necesito cuenta?", a: "No. Funciona en el navegador sin registro." },
      { q: "¿Se suben datos?", a: "No. El cálculo es local en tu dispositivo." },
    ],
  },
};
