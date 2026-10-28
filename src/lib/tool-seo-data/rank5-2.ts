// TOOL_SEO_OVERRIDES_RANK5 part 2 — split out of ../tool-seo-overrides-rank5.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RANK5_2: Record<string, ToolSeoOverride> = {
  "contador-de-palabras": {
    metaTitle: "Word Counter Online — Characters, Sentences & Reading Time | UtiliHub",
    metaTitleEs: "Contador de palabras online — caracteres, oraciones y tiempo de lectura | UtiliHub",
    metaDescription:
      "Count words, characters (with/without spaces), sentences and paragraphs live. Free word counter, no signup, private in your browser.",
    metaDescriptionEs:
      "Contá palabras, caracteres (con y sin espacios), oraciones y párrafos al instante. Contador de palabras gratis, sin registro, privado en el navegador.",
    about: [
      "A word counter measures words, characters, sentences and paragraphs as you type or paste. Useful for essays, posts, SEO drafts and character limits.",
      "Reading-time estimates often assume about 200 words per minute for adult silent reading — adjust expectations for technical text.",
      "Counting is local: your draft is not uploaded for this tool.",
    ],
    aboutEs: [
      "Un contador de palabras mide palabras, caracteres, oraciones y párrafos mientras escribís o pegás texto. Sirve para trabajos, publicaciones, borradores SEO y límites de caracteres.",
      "El tiempo de lectura estimado suele usar unas 200 palabras por minuto en lectura silenciosa adulta; en texto técnico puede ser más lento.",
      "El conteo es local: tu texto no se sube a un servidor en esta herramienta.",
    ],
    steps: [
      "Paste or type your text.",
      "Read live word and character counts.",
      "Edit until you hit the limit you need.",
    ],
    stepsEs: [
      "Pegá o escribí tu texto.",
      "Mirá el conteo de palabras y caracteres en vivo.",
      "Editá hasta llegar al límite que necesitás.",
    ],
    faq: [
      {
        q: "How does a word counter count words?",
        a: "Usually any sequence of characters separated by spaces or line breaks counts as one word.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. Analysis runs in your browser only.",
      },
      {
        q: "Characters with or without spaces?",
        a: "Most counters show both so you can match platform rules.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo contar palabras de un texto online?",
        a: "Pegá el texto en el contador: las palabras se separan por espacios o saltos de línea y el total se actualiza al instante.",
      },
      {
        q: "¿El contador de palabras es gratis y sin registro?",
        a: "Sí. Funciona en el navegador sin crear cuenta ni instalar nada.",
      },
      {
        q: "¿Se sube mi texto?",
        a: "No. El análisis es solo local en tu dispositivo.",
      },
      {
        q: "¿Cuenta caracteres con o sin espacios?",
        a: "Muestra ambos, para que puedas ajustarte al límite de cada plataforma o editorial.",
      },
    ],
  },

  "porcentaje-hasta-meta": {
    metaTitle: "Percent Complete Calculator — Progress to Goal | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje de avance online — % de meta y restante | UtiliHub",
    metaDescription:
      "How far are you toward a goal? Get percent complete, percent left and units remaining. Free progress calculator, no signup.",
    metaDescriptionEs:
      "¿Qué porcentaje de la meta llevás? Calculá el % de avance, el % que falta y las unidades restantes. Ideal para ventas, ahorro y proyectos. Gratis.",
    about: [
      "Percent to goal (progress %) is current ÷ target × 100. Remaining units are max(target − current, 0).",
      "Use the same unit for current and target (money, tasks, km). Over 100% means you already beat the goal.",
      "Common for sales quotas, fundraising, savings and project completion.",
    ],
    aboutEs: [
      "El porcentaje de avance responde: ¿qué tanto de mi objetivo ya cumplí? Fórmula: (actual ÷ meta) × 100.",
      "Ejemplo: meta 10.000 y vas 4.200 → 42% de avance; faltan 5.800 (58%).",
      "Sirve para cuotas de ventas, recaudaciones, ahorro, proyectos o cualquier “qué porcentaje llevo”.",
      "Si superás la meta, el avance pasa de 100% y el restante queda en 0.",
    ],
    steps: [
      "Enter current amount and goal amount.",
      "Read percent complete and remaining.",
      "Update current as real progress changes.",
    ],
    stepsEs: [
      "Ingresá lo ya logrado (actual) y la meta total.",
      "Leé el % de avance, unidades que faltan y % pendiente.",
      "Actualizá el actual cuando cambie el progreso real.",
    ],
    faq: [
      {
        q: "How do I calculate percent complete?",
        a: "Divide current by target and multiply by 100. Example: 175 of 500 → 35%.",
      },
      {
        q: "How much is left to the goal?",
        a: "In units: target − current. In percent: 100 − progress %.",
      },
      {
        q: "What if current exceeds the goal?",
        a: "Progress shows above 100%; remaining units are treated as zero.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo sacar el porcentaje de avance?",
        a: "Dividí lo ejecutado entre el total y multiplicá por 100: % = (actual ÷ meta) × 100. Ejemplo: 175 de 500 → 35%.",
      },
      {
        q: "¿Cómo calcular cuánto falta para la meta?",
        a: "En unidades: meta − actual. En porcentaje: 100 − % de avance.",
      },
      {
        q: "¿Qué es el porcentaje hasta la meta?",
        a: "Es el mismo concepto que porcentaje de avance: cuánto del objetivo ya está cubierto, en %.",
      },
      {
        q: "¿Sirve para metas de ventas o ahorro?",
        a: "Sí. Usá la misma unidad (pesos, unidades vendidas, etc.) en actual y meta.",
      },
    ],
  },

};
