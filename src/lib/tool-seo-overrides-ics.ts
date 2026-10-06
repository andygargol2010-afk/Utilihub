import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ICS: Record<string, ToolSeoOverride> = {
  "generador-ics": {
    metaTitle: "ICS Event Generator — Download a Calendar File | UtiliHub",
    metaTitleEs: "Generador ICS — descargá un evento de calendario | UtiliHub",
    metaDescription:
      "Build an .ics file with all-day exclusive end dates, floating or UTC times, a weekly COUNT, and an optional display alarm. Free, in the browser.",
    metaDescriptionEs:
      "Armá un .ics con fin exclusivo en todo el día, hora flotante o UTC, COUNT semanal y aviso opcional. Gratis, en el navegador.",
    about: [
      "An all-day event uses VALUE=DATE. DTEND is exclusive: a one-day event on 2026-10-06 ends on 2026-10-07.",
      "Timed events are floating local stamps (20261006T090000) or UTC stamps with a Z (20261006T090000Z). This tool does not emit a VTIMEZONE block.",
      "Weekly repeats use RRULE:FREQ=WEEKLY;COUNT=n, where n is the total occurrences including the first. COUNT 1 omits the rule.",
    ],
    aboutEs: [
      "Un evento de todo el día usa VALUE=DATE. DTEND es exclusivo: un día el 2026-10-06 termina el 2026-10-07.",
      "Los eventos con hora usan sello flotante (20261006T090000) o UTC con Z (20261006T090000Z). Esta herramienta no emite un bloque VTIMEZONE.",
      "La repetición semanal usa RRULE:FREQ=WEEKLY;COUNT=n, donde n incluye la primera ocurrencia. COUNT 1 omite la regla.",
    ],
    steps: [
      "Enter a title, dates, and either all-day or start/end times.",
      "Choose floating or UTC, a weekly count from 1 to 52, and an optional reminder in minutes.",
      "Copy or download the .ics file. Import it into Apple Calendar, Google Calendar, or Outlook.",
      "Reset or load a preset. Nothing is uploaded.",
    ],
    stepsEs: [
      "Escribí un título, las fechas y todo el día o las horas de inicio y fin.",
      "Elegí flotante o UTC, repeticiones de 1 a 52 y un aviso opcional en minutos.",
      "Copiá o descargá el .ics. Importalo en Apple Calendar, Google Calendar u Outlook.",
      "Reiniciá o cargá un preset. No se sube nada.",
    ],
    faq: [
      {
        q: "What does a one-day all-day event look like?",
        a: "Launch day on 2026-10-06 uses DTSTART;VALUE=DATE:20261006 and DTEND;VALUE=DATE:20261007. The end date is exclusive, so the event occupies one calendar day.",
      },
      {
        q: "How is a timed meeting written?",
        a: "Product review on 2026-10-06 from 09:00 to 10:30 floating is DTSTART:20261006T090000 and DTEND:20261006T103000. UTC mode adds Z to both stamps.",
      },
      {
        q: "What does weekly count mean?",
        a: "COUNT=4 means four weekly occurrences, not four extra weeks. COUNT=1 writes no RRULE. Zero, a negative number, or text is rejected.",
      },
      {
        q: "What if the title is empty or the end is before the start?",
        a: "An empty title, an invalid date, NaN, or an end that is not after the start blocks the file. A reminder must be 0 to 10080 minutes or blank.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo queda un evento de un día entero?",
        a: "El día de lanzamiento del 2026-10-06 usa DTSTART;VALUE=DATE:20261006 y DTEND;VALUE=DATE:20261007. El fin es exclusivo, así que ocupa un solo día.",
      },
      {
        q: "¿Cómo se escribe una reunión con hora?",
        a: "La revisión del 2026-10-06 de 09:00 a 10:30 flotante es DTSTART:20261006T090000 y DTEND:20261006T103000. El modo UTC agrega Z a ambos sellos.",
      },
      {
        q: "¿Qué significa el conteo semanal?",
        a: "COUNT=4 son cuatro ocurrencias semanales, no cuatro semanas extra. COUNT=1 no escribe RRULE. Cero, un negativo o texto se rechazan.",
      },
      {
        q: "¿Qué pasa si el título está vacío o el fin es anterior?",
        a: "Un título vacío, una fecha inválida, NaN o un fin que no es posterior al inicio no genera el archivo. El aviso debe ser de 0 a 10080 minutos o quedar vacío.",
      },
    ],
  },
};
