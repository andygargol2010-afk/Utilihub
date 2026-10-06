import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CRON: Record<string, ToolSeoOverride> = {
  "generador-cron": {
    metaTitle: "Cron Expression Generator — Explain and Preview Runs | UtiliHub",
    metaTitleEs: "Generador de expresiones cron — explicar y previsualizar | UtiliHub",
    metaDescription:
      "Build a 5-field cron expression in the browser. Explains each field and lists the next local runs. Day and weekday use Vixie OR when both are set.",
    metaDescriptionEs:
      "Armá una expresión cron de 5 campos en el navegador. Explica cada campo y lista las próximas ejecuciones locales. Día y semana usan OR de Vixie si ambos están fijados.",
    about: [
      "A standard crontab line has five fields: minute, hour, day of month, month, and day of week.",
      "The generator previews the next five matches in your local timezone without uploading the schedule.",
    ],
    aboutEs: [
      "Una línea crontab estándar tiene cinco campos: minuto, hora, día del mes, mes y día de la semana.",
      "El generador muestra las próximas cinco coincidencias en tu zona local sin subir el horario.",
    ],
    steps: [
      "Enter five fields or load a preset. Empty, negative, and NaN tokens are rejected; 0 is valid for minute, hour, and Sunday.",
      "Load every 15 minutes, weekdays at 08:30, or hourly.",
      "Read the field summary and the next local runs. If both day fields are set, matching uses OR.",
      "Copy the expression or reset. Nothing is uploaded.",
    ],
    stepsEs: [
      "Ingresá cinco campos o cargá un preset. Vacío, negativo y NaN se rechazan; 0 vale para minuto, hora y domingo.",
      "Cargá cada 15 minutos, días de semana a las 08:30 u horario.",
      "Leé el resumen y las próximas ejecuciones locales. Si ambos días están fijados, la coincidencia usa OR.",
      "Copiá la expresión o reiniciá. No se sube nada.",
    ],
    faq: [
      {
        q: "What does */15 * * * * run next after 12:07?",
        a: "Every 15 minutes: 12:15, 12:30, 12:45, 13:00, and 13:15 local. The step starts at minute 0, so 0, 15, 30, and 45.",
      },
      {
        q: "What does 30 8 * * 1-5 mean on a Tuesday after 09:00?",
        a: "Weekdays at 08:30. The next run is Wednesday 08:30, then Thursday, Friday, and the following Monday. Saturday and Sunday are skipped.",
      },
      {
        q: "Which formula and units are used?",
        a: "Fields are minute 0–59, hour 0–23, day of month 1–31, month 1–12, weekday 0–7 (0 and 7 are Sunday). There is no SI unit. If both day fields are restricted, Vixie crontab uses OR.",
      },
      {
        q: "What happens with empty, zero, negative, or NaN?",
        a: "Any empty field is an error. Minute 0 and hour 0 are valid. A leading minus, NaN, or a step of 0 is invalid. Six-field cron with seconds is not accepted.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué ejecuta */15 * * * * después de las 12:07?",
        a: "Cada 15 minutos: 12:15, 12:30, 12:45, 13:00 y 13:15 local. El paso arranca en el minuto 0, así que 0, 15, 30 y 45.",
      },
      {
        q: "¿Qué significa 30 8 * * 1-5 un martes después de las 09:00?",
        a: "Días de semana a las 08:30. La próxima es el miércoles 08:30, luego jueves, viernes y el lunes siguiente. Sábado y domingo se saltean.",
      },
      {
        q: "¿Qué fórmula y unidades se usan?",
        a: "Campos: minuto 0–59, hora 0–23, día del mes 1–31, mes 1–12, día de semana 0–7 (0 y 7 son domingo). No hay unidad SI. Si ambos días están restringidos, crontab Vixie usa OR.",
      },
      {
        q: "¿Qué pasa con vacío, cero, negativo o NaN?",
        a: "Cualquier campo vacío es un error. Minuto 0 y hora 0 son válidos. Un menos inicial, NaN o un paso 0 son inválidos. No se acepta cron de 6 campos con segundos.",
      },
    ],
  },
};
