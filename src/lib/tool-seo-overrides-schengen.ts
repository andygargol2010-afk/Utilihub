import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SCHENGEN: Record<string, ToolSeoOverride> = {
  "calculadora-schengen": {
    metaTitle: "Schengen 90/180 Calculator — Days Left | UtiliHub",
    metaTitleEs: "Calculadora Schengen 90/180 — días restantes | UtiliHub",
    metaDescription:
      "Count days used and days left under the Schengen 90-in-180 short-stay rule. Overlapping stays count once. Free, in the browser.",
    metaDescriptionEs:
      "Contá días usados y días restantes con la regla Schengen de 90 en 180. Las estancias solapadas cuentan una sola vez. Gratis, en el navegador.",
    about: [
      "The short-stay rule allows 90 days of presence in any rolling 180-day window across the Schengen area. The window ends on the reference date and starts 179 days earlier, so it covers 180 calendar days.",
      "Entry and exit both count. A stay from 1 Jan to 10 Jan is 10 days. Overlapping stays count once for each calendar day. Days after the reference date are ignored until you move the reference forward.",
      "Remaining days are 90 minus days used in that window, floored at 0. Overstay is days used above 90. This is a planning count, not a border decision or a visa check.",
    ],
    aboutEs: [
      "La regla de corta estancia permite 90 días de presencia en cualquier ventana móvil de 180 días en el espacio Schengen. La ventana termina en la fecha de referencia y empieza 179 días antes: son 180 días de calendario.",
      "Entrada y salida cuentan. Una estancia del 1 al 10 de enero son 10 días. Las estancias que se solapan cuentan una vez por día. Los días posteriores a la referencia no entran hasta que movés esa fecha.",
      "Los días restantes son 90 menos los usados en esa ventana, con mínimo 0. El exceso es lo usado por encima de 90. Es un conteo para planificar, no una decisión de frontera ni un control de visado.",
    ],
    steps: [
      "Set the reference date, usually today or a planned exit.",
      "Add each stay with entry and exit. Both dates count.",
      "Read days used, days left, and the first date a day drops out of the window.",
      "Copy the summary. Nothing is uploaded.",
    ],
    stepsEs: [
      "Elegí la fecha de referencia, normalmente hoy o la salida prevista.",
      "Agregá cada estancia con entrada y salida. Las dos fechas cuentan.",
      "Leé días usados, días restantes y la primera fecha en que sale un día de la ventana.",
      "Copiá el resumen. No se sube nada.",
    ],
    faq: [
      {
        q: "How many days is 1 Jan to 10 Jan?",
        a: "10 days. The formula is inclusive: exit minus entry in days, plus 1. On a reference date of 10 Jan 2026 the window is 14 Jul 2025–10 Jan 2026, used days are 10, and 80 remain.",
      },
      {
        q: "When is the 90-day allowance used up?",
        a: "A stay from 1 Jan 2026 to 31 Mar 2026 is 31+28+31 = 90 days. On 31 Mar 2026 the window uses 90 days and 0 remain. One more presence day in that window is an overstay.",
      },
      {
        q: "Do overlapping trips count twice?",
        a: "No. Each calendar day inside the 180-day window counts once, even if two stays cover it. A 1–20 Jan stay plus a 15–25 Jan stay is 25 unique days, not 31.",
      },
      {
        q: "What if a date is empty or the exit is before entry?",
        a: "The tool shows an error and does not invent a count. A blank reference date, an invalid day such as 2026-02-31, or a negative stay length is rejected. Zero stays means no presence: 0 used and 90 left.",
      },
      {
        q: "Is this an official border result?",
        a: "No. It applies the published 90-in-180 day count locally. It does not check passport stamps, long-stay permits, or country exceptions. Confirm with official sources before you travel.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántos días son del 1 al 10 de enero?",
        a: "10 días. La fórmula es inclusiva: salida menos entrada, más 1. Con referencia 10 ene 2026 la ventana es 14 jul 2025–10 ene 2026, se usan 10 días y quedan 80.",
      },
      {
        q: "¿Cuándo se agotan los 90 días?",
        a: "Una estancia del 1 ene 2026 al 31 mar 2026 es 31+28+31 = 90 días. El 31 mar 2026 la ventana usa 90 y quedan 0. Un día más de presencia en esa ventana es exceso.",
      },
      {
        q: "¿Los viajes solapados cuentan dos veces?",
        a: "No. Cada día de calendario dentro de la ventana de 180 cuenta una vez, aunque lo cubran dos estancias. Del 1 al 20 ene más del 15 al 25 ene son 25 días únicos, no 31.",
      },
      {
        q: "¿Qué pasa si una fecha está vacía o la salida es anterior?",
        a: "La herramienta muestra un error y no inventa un conteo. Una referencia vacía, un día inválido como 2026-02-31 o una estancia negativa se rechazan. Sin estancias no hay presencia: 0 usados y 90 restantes.",
      },
      {
        q: "¿Es un resultado oficial de frontera?",
        a: "No. Aplica en local el conteo publicado de 90 en 180. No revisa sellos, permisos de larga duración ni excepciones por país. Confirmá con fuentes oficiales antes de viajar.",
      },
    ],
  },
};
