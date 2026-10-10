import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_UNIX_TIMESTAMP: Record<string, ToolSeoOverride> = {
  "conversor-timestamp-unix": {
    metaTitle: "Unix Timestamp Converter — Current epoch to local date | UtiliHub",
    metaTitleEs: "Conversor de timestamp Unix — Epoch actual a fecha local | UtiliHub",
    metaDescription:
      "Convert Unix timestamps (seconds or milliseconds) to local dates and back. Shows current time. Invalid input is rejected. Runs in the browser.",
    metaDescriptionEs:
      "Convertí timestamps Unix (segundos o milisegundos) a fechas locales y viceversa. Muestra la hora actual. Entrada inválida se rechaza. Corre en el navegador.",
    about: [
      "Unix timestamps count seconds (or milliseconds) since 1970-01-01 UTC.",
      "Values under about 1e12 are treated as seconds; larger as milliseconds.",
      "Results use the browser's local timezone.",
    ],
    aboutEs: [
      "Los timestamps Unix cuentan segundos (o milisegundos) desde el 1 de enero de 1970 UTC.",
      "Valores menores a ~1e12 se tratan como segundos; mayores como milisegundos.",
      "Los resultados usan la zona horaria local del navegador.",
    ],
    steps: [
      "Enter a timestamp or a date, or use the examples / Now.",
      "See the converted value and copy it.",
      "Reset clears the fields.",
    ],
    stepsEs: [
      "Ingresá un timestamp o una fecha, o usá los ejemplos / Ahora.",
      "Mira el valor convertido y copialo.",
      "Reiniciar limpia los campos.",
    ],
    faq: [
      {
        q: "What is a Unix timestamp?",
        a: "Seconds (or milliseconds) since 1970-01-01 00:00:00 UTC.",
      },
      {
        q: "Does it handle milliseconds?",
        a: "Yes. Numbers larger than about 1 trillion are treated as milliseconds.",
      },
      {
        q: "Is the date in my local timezone?",
        a: "Yes. toLocaleString and datetime-local use the browser's local time.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es un timestamp Unix?",
        a: "Segundos (o milisegundos) desde el 1 de enero de 1970 00:00:00 UTC.",
      },
      {
        q: "¿Maneja milisegundos?",
        a: "Sí. Números mayores a ~1 billón se tratan como milisegundos.",
      },
      {
        q: "¿La fecha está en mi zona horaria local?",
        a: "Sí. toLocaleString y datetime-local usan la hora local del navegador.",
      },
    ],
  },
};
