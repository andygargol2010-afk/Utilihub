import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_MEETING: Record<string, ToolSeoOverride> = {
  "coste-reunion": {
    metaTitle: "Meeting Cost Calculator — Salary Time | UtiliHub",
    metaTitleEs: "Calculadora de coste de reunión — salario | UtiliHub",
    metaDescription:
      "Estimate a meeting cost from attendees, hourly rates, duration, and weekly or monthly recurrence. Optional loaded-cost multiplier. Free in the browser.",
    metaDescriptionEs:
      "Estimá el coste de una reunión con asistentes, valor hora, duración y recurrencia semanal o mensual. Multiplicador de coste cargado opcional. Gratis en el navegador.",
    about: [
      "A meeting cost is the sum of each attendee's hourly rate multiplied by the length of the meeting. With one shared rate, that is attendees × rate × hours.",
      "Use it before recurring standups, planning sessions, or all-hands. A 30-minute weekly sync with eight people is not eight times thirty minutes of calendar time: it is that many paid hours, fifty-two times a year.",
      "The loaded-cost multiplier (often 1.2 to 1.4) is optional. It approximates benefits and overhead on top of base salary. Leave it at 1 if you only want wage cost.",
      "Results are an estimate. They ignore context switching, preparation, and local labor rules. Nothing is uploaded: the math runs in the browser.",
    ],
    aboutEs: [
      "El coste de una reunión es la suma del valor hora de cada asistente por la duración. Con una tarifa común, es asistentes × valor hora × horas.",
      "Sirve antes de un daily, una planning o un all-hands. Una sync de 30 minutos con ocho personas no son solo treinta minutos de calendario: son esas horas pagas, cincuenta y dos veces al año si es semanal.",
      "El multiplicador de coste cargado (suele estar entre 1,2 y 1,4) es opcional. Aproxima beneficios y overhead sobre el salario base. Dejalo en 1 si solo querés el coste salarial.",
      "Es una estimación. No incluye el cambio de contexto, la preparación ni la normativa laboral. No se sube nada: el cálculo corre en el navegador.",
    ],
    steps: [
      "Pick a duration preset or enter hours and minutes.",
      "Enter how many people share the same hourly rate, or switch to individual rates.",
      "Choose once, weekly, biweekly, or monthly, and an optional loaded-cost multiplier.",
      "Read this meeting's cost, the yearly total if it repeats, and copy the summary.",
    ],
    stepsEs: [
      "Elegí un preset de duración o ingresá horas y minutos.",
      "Indicá cuántas personas comparten el mismo valor hora, o pasá a tarifas individuales.",
      "Elegí una vez, semanal, quincenal o mensual, y un multiplicador de coste cargado si aplica.",
      "Revisá el coste de esta reunión, el total anual si se repite, y copiá el resumen.",
    ],
    faq: [
      {
        q: "How is the meeting cost calculated?",
        a: "Cost = total hourly rate of attendees × duration in hours × loaded-cost multiplier. Yearly cost multiplies that by 52 (weekly), 26 (biweekly), or 12 (monthly).",
      },
      {
        q: "Should I use base salary or a loaded rate?",
        a: "Base salary uses a multiplier of 1. A loaded multiplier of about 1.3 is a rough stand-in for benefits and overhead, not a payroll figure.",
      },
      {
        q: "Does this replace the overtime calculator?",
        a: "No. Overtime prices extra hours for one worker. This prices calendar time across a group, including a recurring yearly total.",
      },
      {
        q: "Are the rates uploaded?",
        a: "No. Rates and attendee counts stay in the browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el coste de la reunión?",
        a: "Coste = valor hora total de los asistentes × duración en horas × multiplicador de coste cargado. El anual multiplica eso por 52 (semanal), 26 (quincenal) o 12 (mensual).",
      },
      {
        q: "¿Uso el salario base o un coste cargado?",
        a: "El salario base usa multiplicador 1. Un 1,3 aproximado cubre beneficios y overhead, no es una liquidación de nómina.",
      },
      {
        q: "¿Reemplaza a la calculadora de horas extra?",
        a: "No. Las horas extra valoran el tiempo extra de una persona. Esta valora el tiempo de calendario de un grupo, con total anual si se repite.",
      },
      {
        q: "¿Se envían las tarifas?",
        a: "No. Tarifas y asistentes se quedan en el navegador.",
      },
    ],
  },
};
