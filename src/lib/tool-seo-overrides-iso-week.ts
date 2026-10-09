import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ISO_WEEK: Record<string, ToolSeoOverride> = {
  "conversor-semana-iso": {
    metaTitle: "ISO Week Converter — Date to 2020-W53-5 | UtiliHub",
    metaTitleEs: "Conversor de semana ISO — fecha a 2020-W53-5 | UtiliHub",
    metaDescription:
      "Convert a calendar date to an ISO 8601 week and an ISO week back to a date. Empty input and a week the year does not have do not invent a date. Runs in the browser.",
    metaDescriptionEs:
      "Convertí una fecha a semana ISO 8601 y una semana ISO a fecha. Una entrada vacía o una semana que el año no tiene no inventan una fecha. Corre en el navegador.",
    about: [
      "ISO weeks start on Monday. Week 1 is the week that contains the first Thursday of the calendar year.",
      "A date near New Year can belong to the previous or next ISO week-year. 2021-01-01 is 2020-W53-5.",
      "Week 53 is accepted only when that week exists. The tool does not invent a date for 2019-W53.",
    ],
    aboutEs: [
      "La semana ISO empieza el lunes. La semana 1 es la que contiene el primer jueves del año calendario.",
      "Una fecha cerca de Año Nuevo puede caer en el año-semana anterior o siguiente. 2021-01-01 es 2020-W53-5.",
      "La semana 53 se acepta solo si existe. La herramienta no inventa una fecha para 2019-W53.",
    ],
    steps: [
      "Enter 2021-01-01 or use the date example.",
      "Or enter 2024-W01-1 to get the Monday of that week.",
      "Copy the result. Reset clears both fields.",
    ],
    stepsEs: [
      "Ingresá 2021-01-01 o usá el ejemplo de fecha.",
      "O ingresá 2024-W01-1 para obtener el lunes de esa semana.",
      "Copiá el resultado. Reiniciar vacía los dos campos.",
    ],
    faq: [
      {
        q: "What ISO week is 2021-01-01?",
        a: "2020-W53-5. Friday 1 January 2021 belongs to ISO week 53 of 2020.",
      },
      {
        q: "What date is 2024-W01-1?",
        a: "2024-01-01. That week starts on Monday 1 January 2024.",
      },
      {
        q: "Why is 2019-W53-1 rejected?",
        a: "2019 has 52 ISO weeks. The tool does not invent a date for a week the year does not have.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué semana ISO es 2021-01-01?",
        a: "2020-W53-5. El viernes 1 de enero de 2021 pertenece a la semana ISO 53 de 2020.",
      },
      {
        q: "¿Qué fecha es 2024-W01-1?",
        a: "2024-01-01. Esa semana empieza el lunes 1 de enero de 2024.",
      },
      {
        q: "¿Por qué se rechaza 2019-W53-1?",
        a: "2019 tiene 52 semanas ISO. La herramienta no inventa una fecha para una semana que el año no tiene.",
      },
    ],
  },
};
