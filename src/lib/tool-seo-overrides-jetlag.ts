import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_JETLAG: Record<string, ToolSeoOverride> = {
  "planificador-jet-lag": {
    metaTitle: "Jet Lag Sleep Schedule — East or West Bedtime Shift | UtiliHub",
    metaTitleEs: "Plan de sueño para jet lag — adelantar o atrasar la cama | UtiliHub",
    metaDescription:
      "Plan pre-trip bedtimes from the UTC offset gap. New York −5 to London 0 is +5 h east: 23:00, 22:00, 21:00, 20:00 over 3 days at 1 h/day.",
    metaDescriptionEs:
      "Armá horarios de cama antes del vuelo con el desfase UTC. Nueva York −5 a Londres 0 son +5 h al este: 23:00, 22:00, 21:00 y 20:00 en 3 días a 1 h/día.",
    about: [
      "The signed shift is destination UTC minus origin UTC, folded into (−12, 12]. A positive value means the destination clock is ahead, so bedtimes move earlier.",
      "This is not the existing hour-difference subtractor and not a flight-duration tool. It emits a day-by-day bedtime on the origin clock, capped per day.",
    ],
    aboutEs: [
      "El desfase es UTC destino menos UTC origen, plegado a (−12, 12]. Si es positivo, el reloj de destino va adelantado y la cama se mueve más temprano.",
      "No es la resta de horas que ya existe ni la duración de vuelo. Devuelve la hora de cama día a día en el reloj de origen, con un tope diario.",
    ],
    steps: [
      "Enter origin and destination UTC offsets in hours, usual bedtime as HH:MM, and days before departure. Empty fields stay invalid.",
      "Set the east and west daily caps. East advances sleep; west delays it. Copy the plan or reset to clear the form.",
    ],
    stepsEs: [
      "Cargá offsets UTC de origen y destino en horas, la hora de cama HH:MM y los días antes de salir. Un campo vacío no calcula.",
      "Definí el tope diario al este y al oeste. Al este se adelanta; al oeste se atrasa. Copiá el plan o reiniciá para vaciar.",
    ],
    faq: [
      {
        q: "What bedtime plan is New York (−5) to London (0) in 3 days?",
        a: "Shift = 0 − (−5) = +5 h east. At 1 h/day from 23:00 the nights are 23:00, 22:00, 21:00, and 20:00. Two hours remain for arrival.",
      },
      {
        q: "What about New York (−5) to Los Angeles (−8) in 2 days?",
        a: "Shift = −8 − (−5) = −3 h west. At 1.5 h/day from 23:00 the nights are 23:00, 00:30, and 02:00. The 3 h shift is complete.",
      },
      {
        q: "Which formula and units are used?",
        a: "shift_h = fold(dest_UTC − origin_UTC) into (−12, 12]. Bedtime moves −shift for east and +shift for west, at most the daily cap in hours. Offsets are hours; bedtime is local HH:MM.",
      },
      {
        q: "What happens with empty input, 0, a negative day count, or NaN?",
        a: "Empty or NaN offsets do not build a plan. A 0 h shift keeps the usual bedtime. Negative days are rejected. A minus offset such as −5 is a valid UTC hour, not an error.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué plan da Nueva York (−5) a Londres (0) en 3 días?",
        a: "Desfase = 0 − (−5) = +5 h al este. A 1 h/día desde las 23:00 las noches son 23:00, 22:00, 21:00 y 20:00. Quedan 2 h para el arribo.",
      },
      {
        q: "¿Y Nueva York (−5) a Los Ángeles (−8) en 2 días?",
        a: "Desfase = −8 − (−5) = −3 h al oeste. A 1,5 h/día desde las 23:00 las noches son 23:00, 00:30 y 02:00. El desfase de 3 h queda cubierto.",
      },
      {
        q: "¿Qué fórmula y unidades se usan?",
        a: "desfase_h = plegar(UTC_destino − UTC_origen) a (−12, 12]. La cama se adelanta si es este y se atrasa si es oeste, como máximo el tope diario en horas. Los offsets son horas; la cama es HH:MM local.",
      },
      {
        q: "¿Qué pasa con vacío, 0, días negativos o NaN?",
        a: "Offsets vacíos o NaN no arman el plan. Un desfase de 0 h deja la hora habitual. Los días negativos se rechazan. Un offset negativo como −5 es una hora UTC válida, no un error.",
      },
    ],
  },
};
