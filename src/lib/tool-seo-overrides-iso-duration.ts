import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ISO_DURATION: Record<string, ToolSeoOverride> = {
  "generador-duracion-iso": {
    metaTitle: "ISO 8601 Duration Builder — P1Y2M3DT4H | UtiliHub",
    metaTitleEs: "Generador de duración ISO 8601 — P1Y2M3DT4H | UtiliHub",
    metaDescription:
      "Build an ISO 8601 duration from years, months, weeks, days, hours, minutes, and seconds. Weeks cannot mix with Y/M/D.",
    metaDescriptionEs:
      "Armá una duración ISO 8601 con años, meses, semanas, días, horas, minutos y segundos. Las semanas no se mezclan con A/M/D.",
    about: [
      "An ISO 8601 duration looks like P1Y2M3DT4H30M. The date part sits after P; the time part sits after T.",
      "Weeks use PnW and must not be combined with years, months, or days. Two weeks is P2W, not P2WT0S.",
      "Zero components are omitted. All zeros become P0D. A negative component is rejected instead of emitting -P.",
    ],
    aboutEs: [
      "Una duración ISO 8601 se ve como P1Y2M3DT4H30M. La parte de fecha va después de P; la de tiempo, después de T.",
      "Las semanas usan PnW y no se combinan con años, meses o días. Dos semanas es P2W, no P2WT0S.",
      "Los componentes en cero se omiten. Todo en cero da P0D. Un componente negativo se rechaza en lugar de emitir -P.",
    ],
    steps: [
      "Enter whole years, months, weeks, days, hours, minutes, and seconds. Blank counts as 0 if another field has a value.",
      "Load a preset for a 90-minute meeting, a 2-week sprint, or a 1Y2M3DT4H lease.",
      "Read the ISO string and the approximate second count (365.2425 days/year, 30.436875 days/month).",
      "Copy the duration or reset. Nothing is uploaded.",
    ],
    stepsEs: [
      "Ingresá años, meses, semanas, días, horas, minutos y segundos enteros. Vacío cuenta como 0 si otro campo tiene valor.",
      "Cargá un preset de reunión de 90 minutos, sprint de 2 semanas o alquiler 1Y2M3DT4H.",
      "Leé la cadena ISO y el conteo aproximado de segundos (365.2425 días/año, 30.436875 días/mes).",
      "Copiá la duración o reiniciá. No se sube nada.",
    ],
    faq: [
      {
        q: "What is 1 year, 2 months, 3 days, and 4 hours?",
        a: "P1Y2M3DT4H. Zero minutes and seconds are omitted. The approximate second count uses 1×365.2425×86400 + 2×30.436875×86400 + 3×86400 + 4×3600.",
      },
      {
        q: "What is 2 weeks, or 1 hour and 30 minutes?",
        a: "Two weeks is P2W (14×86400 = 1,209,600 s). One hour and 30 minutes is PT1H30M (5400 s), with no date part before T.",
      },
      {
        q: "Why can't weeks mix with days?",
        a: "ISO 8601-1 puts the week designator in the date part and does not combine it with Y, M, or D. P2W14D is invalid here; use P2W or P14D.",
      },
      {
        q: "What happens with empty, zero, negative, or NaN?",
        a: "All blank fields are an error. All zeros become P0D. A minus sign, text, or a fraction is rejected. Each component must be an integer from 0 to 9999.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuánto es 1 año, 2 meses, 3 días y 4 horas?",
        a: "P1Y2M3DT4H. Minutos y segundos en cero se omiten. El conteo aproximado usa 1×365.2425×86400 + 2×30.436875×86400 + 3×86400 + 4×3600.",
      },
      {
        q: "¿Cuánto es 2 semanas, o 1 hora y 30 minutos?",
        a: "Dos semanas es P2W (14×86400 = 1.209.600 s). Una hora y 30 minutos es PT1H30M (5400 s), sin parte de fecha antes de T.",
      },
      {
        q: "¿Por qué las semanas no se mezclan con días?",
        a: "ISO 8601-1 pone el designador de semana en la parte de fecha y no lo combina con Y, M o D. P2W14D es inválido aquí; usá P2W o P14D.",
      },
      {
        q: "¿Qué pasa con vacío, cero, negativo o NaN?",
        a: "Todos los campos vacíos son un error. Todo en cero da P0D. Un signo menos, texto o una fracción se rechaza. Cada componente debe ser un entero de 0 a 9999.",
      },
    ],
  },
};
