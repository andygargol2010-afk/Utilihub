/** SEO-growth overrides part a2 (aspect ratio, ideal weight, due date). */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A2: Record<string, ToolSeoOverrideGrowth> = {
  "relacion-aspecto": {
    metaTitle: "Aspect Ratio Calculator — Simplify Width × Height | UtiliHub",
    metaTitleEs: "Calculadora de relación de aspecto | UtiliHub",
    metaDescription:
      "Reduce pixel dimensions to the simplest ratio (e.g. 1920×1080 → 16:9) and show the decimal aspect.",
    metaDescriptionEs:
      "Reducí dimensiones en píxeles a la razón más simple (p. ej. 1920×1080 → 16:9) y el aspecto decimal.",
    about: [
      "Aspect ratio is width divided by height. Designers and video editors talk about 16:9, 4:3, 1:1, and 9:16 vertical.",
      "We simplify integer sides with the GCD so 1280×720 becomes 16:9, matching common video standards.",
      "Cropping to a new ratio changes composition; this tool only describes the ratio of the numbers you enter.",
    ],
    aboutEs: [
      "La relación de aspecto es ancho entre alto. En diseño y video se habla de 16:9, 4:3, 1:1 y 9:16 vertical.",
      "Simplificamos enteros con el MCD: 1280×720 pasa a 16:9, el estándar de video más común.",
      "Recortar a otra ratio cambia la composición; esta tool solo describe la razón de los números que ingresás.",
    ],
    steps: [
      "Enter width and height in pixels.",
      "Calculate the reduced ratio and decimal value.",
      "Match the ratio when exporting video or designing frames.",
    ],
    stepsEs: [
      "Ingresá ancho y alto en píxeles.",
      "Calculá la razón reducida y el valor decimal.",
      "Usá esa ratio al exportar video o diseñar marcos.",
    ],
    faq: [
      {
        q: "Non-integer sizes?",
        a: "Enter whole pixels for a clean ratio; fractional CSS sizes still have an effective aspect as width/height.",
      },
      {
        q: "Letterboxing?",
        a: "If content and frame ratios differ, black bars appear. Match ratios or crop to avoid them.",
      },
    ],
    faqEs: [
      {
        q: "¿Tamaños no enteros?",
        a: "Para una razón limpia usá píxeles enteros; en CSS el aspecto efectivo sigue siendo ancho/alto.",
      },
      {
        q: "¿Letterbox?",
        a: "Si el contenido y el marco tienen distinta ratio aparecen bandas. Igualá ratios o recortá.",
      },
    ],
  },

  "peso-ideal": {
    metaTitle: "Ideal Weight Calculator — Devine & Hamwi | UtiliHub",
    metaTitleEs: "Calculadora de peso ideal (Devine y Hamwi) | UtiliHub",
    metaDescription:
      "Estimate ideal body weight with Devine and Hamwi formulas from height and sex. Screening aid only—not medical advice.",
    metaDescriptionEs:
      "Estimá el peso ideal con fórmulas de Devine y Hamwi según altura y sexo. Solo orientación, no consejo médico.",
    about: [
      "Ideal body weight formulas such as Devine and Hamwi estimate a reference weight from height and sex for adult populations.",
      "They are historical screening tools, not personalized targets. Muscle mass, age, and health conditions change what is healthy for an individual.",
      "Use results as a conversation starter with a clinician, not as a diet prescription.",
    ],
    aboutEs: [
      "Fórmulas como Devine y Hamwi estiman un peso de referencia a partir de la altura y el sexo en adultos.",
      "Son herramientas de cribado históricas, no objetivos personalizados. Músculo, edad y salud cambian lo sano para cada persona.",
      "Usá el resultado como punto de partida con un profesional, no como prescripción de dieta.",
    ],
    steps: [
      "Enter height and select sex for the formula variant.",
      "Read the estimated ideal weight range.",
      "Discuss with a qualified professional before changing diet or training.",
    ],
    stepsEs: [
      "Ingresá la altura y el sexo para la variante de la fórmula.",
      "Leé el rango de peso ideal estimado.",
      "Consultá con un profesional antes de cambiar dieta o entrenamiento.",
    ],
    faq: [
      {
        q: "Is one formula better?",
        a: "Different formulas give slightly different numbers; think of ideal weight as a band, not a single target.",
      },
      {
        q: "Children?",
        a: "Adult formulas do not apply to pediatric growth curves.",
      },
    ],
    faqEs: [
      {
        q: "¿Una fórmula es mejor?",
        a: "Dan números algo distintos; pensá el “peso ideal” como una franja estimada.",
      },
      {
        q: "¿Niños?",
        a: "Estas fórmulas de adultos no sirven para curvas de crecimiento pediátricas.",
      },
    ],
  },

  "fecha-parto": {
    metaTitle: "Due Date Calculator — Naegele from LMP | UtiliHub",
    metaTitleEs: "Calculadora de fecha de parto (regla de Naegele) | UtiliHub",
    metaDescription:
      "Estimate the due date from the first day of the last menstrual period by adding 280 days (Naegele’s rule).",
    metaDescriptionEs:
      "Estimá la fecha probable de parto desde el primer día de la última menstruación sumando 280 días (regla de Naegele).",
    about: [
      "Naegele’s rule approximates the estimated due date (EDD) as about 280 days after the first day of the last menstrual period (LMP).",
      "Ultrasound dating can revise the EDD. Cycle length, ovulation timing, and medical history all affect accuracy.",
      "This is a calendar helper only—not prenatal care. Confirm dates with a qualified clinician.",
    ],
    aboutEs: [
      "La regla de Naegele aproxima la fecha probable de parto (FPP) como unos 280 días después del primer día de la última menstruación (FUM).",
      "La ecografía puede corregir la FPP. La duración del ciclo, la ovulación y la historia clínica influyen en la precisión.",
      "Es solo una ayuda de calendario, no control prenatal. Confirmá fechas con un profesional de la salud.",
    ],
    steps: [
      "Enter the LMP date as YYYY-MM-DD.",
      "Calculate the estimated due date (+280 days).",
      "Bring the estimate to your care provider for confirmation.",
    ],
    stepsEs: [
      "Ingresá la FUM como AAAA-MM-DD.",
      "Calculá la FPP estimada (+280 días).",
      "Llevá la estimación a tu profesional de salud para confirmarla.",
    ],
    faq: [
      {
        q: "What if cycles are irregular?",
        a: "LMP-based dates are less reliable; ultrasound is usually preferred for dating.",
      },
      {
        q: "Conception date instead?",
        a: "If you know conception timing, clinicians may date from that event rather than LMP—this tool follows the LMP+280 convention.",
      },
    ],
    faqEs: [
      {
        q: "¿Ciclos irregulares?",
        a: "Las fechas por FUM son menos fiables; suele preferirse la ecografía para datar.",
      },
      {
        q: "¿Fecha de concepción?",
        a: "Si se conoce la concepción, el equipo médico puede datar desde ahí; esta tool sigue FUM+280.",
      },
    ],
  },
};
