// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_B2, split from tool-seo-overrides-growth-b2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_B2_PART2: Record<string, ToolSeoOverrideGrowth> = {
  "cron-generator": {
    metaTitle: "Cron Expression Helper — Common Schedules | UtiliHub",
    metaTitleEs: "Ayuda de expresiones cron — horarios habituales | UtiliHub",
    metaDescription:
      "Build or decode common cron expressions for every minute, hour, day, or weekday schedules. Free, in-browser.",
    metaDescriptionEs:
      "Armá o interpretá expresiones cron habituales: cada minuto, hora, día o días de la semana. Gratis, en el navegador.",
    about: [
      "Cron strings define when jobs run on Unix-style schedulers. Fields usually cover minute, hour, day of month, month, and day of week.",
      "This helper focuses on common patterns (hourly, daily, weekdays) so you can copy a working expression quickly.",
      "Syntax differs slightly between crontab, systemd timers, and cloud schedulers—always verify against your runtime docs.",
    ],
    aboutEs: [
      "Las cadenas cron definen cuándo corren tareas en planificadores tipo Unix. Los campos cubren minuto, hora, día del mes, mes y día de la semana.",
      "Esta ayuda se centra en patrones habituales (cada hora, diario, días hábiles) para copiar una expresión usable.",
      "La sintaxis varía entre crontab, systemd y planificadores en la nube: verificá la documentación de tu runtime.",
    ],
    steps: [
      "Choose a schedule pattern or enter fields.",
      "Copy the generated cron expression.",
      "Test it in your scheduler’s dry-run or next-run preview if available.",
    ],
    stepsEs: [
      "Elegí un patrón o completá los campos.",
      "Copiá la expresión cron generada.",
      "Probalá en el dry-run o vista previa de tu planificador si existe.",
    ],
    faq: [
      {
        q: "Five vs six fields?",
        a: "Classic crontab uses five fields. Some systems add a seconds field at the front—check which your tool expects.",
      },
      {
        q: "Timezone?",
        a: "Cron usually follows the host timezone. Cloud jobs often need an explicit TZ setting.",
      },
    ],
    faqEs: [
      {
        q: "¿Cinco o seis campos?",
        a: "El crontab clásico usa cinco. Algunos sistemas agregan segundos al inicio: confirmá qué espera tu herramienta.",
      },
      {
        q: "¿Zona horaria?",
        a: "Cron suele seguir la TZ del host. En la nube a menudo hay que definir TZ explícita.",
      },
    ],
  },
};
