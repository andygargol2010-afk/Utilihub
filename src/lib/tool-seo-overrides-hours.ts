import type { ToolSeoOverride } from "./tool-seo-overrides";

/** ES+EN SEO for conversor-horas-decimal (hours-to-decimal converter). */
export const TOOL_SEO_OVERRIDES_HOURS: Record<string, ToolSeoOverride> = {
  "conversor-horas-decimal": {
    metaTitleEs: "Conversor de horas a decimal — Horas y minutos a decimal | UtiliHub",
    metaDescriptionEs:
      "Convertí horas y minutos a horas decimales para nóminas o control de tiempo. Gratis, en el navegador y sin registro.",
    about: [
      "This hours to decimal converter turns an hours-and-minutes time into the decimal format used by payroll and timesheet systems.",
      "Everything runs in your browser: no signup, no installation, and nothing is uploaded.",
    ],
    aboutEs: [
      "Este conversor transforma un tiempo en horas y minutos al formato decimal que usan los sistemas de nómina y control horario.",
      "Todo corre en el navegador: sin registro, sin instalación y sin subir nada a un servidor.",
    ],
    steps: [
      "Enter the hours and the minutes.",
      "Read the decimal hours result instantly.",
      "Copy or export the value for your timesheet.",
    ],
    stepsEs: [
      "Ingresá las horas y los minutos.",
      "Leé el resultado en horas decimales al instante.",
      "Copiá o exportá el valor para tu planilla de horas.",
    ],
    faq: [
      {
        q: "How does it work?",
        a: "Decimal hours = hours + (minutes / 60). Example: 2h 30m = 2.5.",
      },
      {
        q: "Why decimal hours?",
        a: "Common in payroll systems and time tracking software that expect decimal format.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se convierten horas y minutos a decimal?",
        a: "Horas decimales = horas + (minutos / 60). Ejemplo: 2 h 30 min = 2,5 horas decimales.",
      },
      {
        q: "¿Para qué sirve el formato decimal de horas?",
        a: "Es el formato habitual en nóminas, planillas de horas y software de control de tiempo que espera valores decimales.",
      },
    ],
  },
};
