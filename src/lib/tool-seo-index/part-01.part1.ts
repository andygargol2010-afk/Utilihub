// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_PART_01, split from part-01.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_BASE_A } from "../tool-seo-overrides-base-a";
import { TOOL_SEO_OVERRIDES_BASE_A2 } from "../tool-seo-overrides-base-a2";
import { TOOL_SEO_OVERRIDES_BASE_B } from "../tool-seo-overrides-base-b";
import { TOOL_SEO_OVERRIDES_BLOCK3 } from "../tool-seo-overrides-block3";
import { TOOL_SEO_OVERRIDES_BLOCK4 } from "../tool-seo-overrides-block4";
import { TOOL_SEO_OVERRIDES_GROWTH } from "../tool-seo-overrides-growth";
import { TOOL_SEO_OVERRIDES_GROWTH_A } from "../tool-seo-overrides-growth-a";
import { TOOL_SEO_OVERRIDES_GROWTH_A2 } from "../tool-seo-overrides-growth-a2";
import { TOOL_SEO_OVERRIDES_GROWTH_B1 } from "../tool-seo-overrides-growth-b1";

export const TOOL_SEO_OVERRIDES_PART_01_PART1: Record<string, ToolSeoOverride> = {  ...(TOOL_SEO_OVERRIDES_BASE_A as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_BASE_A2 as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_BASE_B as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_BLOCK3 as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_BLOCK4 as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GROWTH as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GROWTH_A as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GROWTH_A2 as Record<string, ToolSeoOverride>),  ...(TOOL_SEO_OVERRIDES_GROWTH_B1 as Record<string, ToolSeoOverride>),
  "calculadora-ciclos-sueno-90": {
    metaTitle: "Sleep Cycle Calculator — 90-Minute Bedtime & Wake Time | UtiliHub",
    metaTitleEs: "Calculadora de ciclos de sueño de 90 minutos — hora de acostarse | UtiliHub",
    metaDescription:
      "Free sleep cycle calculator. Find the best bedtime or wake-up time using 90-minute sleep cycles, with a 15-minute fall-asleep buffer. Runs in your browser.",
    metaDescriptionEs:
      "Calculadora de ciclos de sueño gratis: calculá a qué hora acostarte o despertarte con ciclos de 90 minutos y margen de 15 para dormirte. Sin registro, en tu navegador.",
    about: [
      "A full sleep cycle lasts about 90 minutes and includes light sleep, deep sleep, and REM. Waking up at the end of a cycle, rather than in the middle of deep sleep, makes you feel more rested.",
      "This calculator works in two directions: given your wake-up time it suggests bedtimes, and given your bedtime it suggests wake-up times. It adds a 15-minute buffer for falling asleep.",
    ],
    aboutEs: [
      "Un ciclo de sueño completo dura unos 90 minutos e incluye sueño ligero, profundo y REM. Despertar al final de un ciclo, y no en pleno sueño profundo, hace que te sientas más descansado.",
      "Esta calculadora funciona en ambas direcciones: dada tu hora de despertar sugiere horas de acostarse, y dada tu hora de acostarte sugiere horas de despertar. Suma 15 minutos de margen para quedarte dormido.",
    ],
    steps: [
      "Choose the mode: you have a wake-up time or you have a bedtime.",
      "Enter that time and how many 90-minute cycles you want (4 to 6 is the usual recommendation).",
      "Read the suggested time; it already includes the 15-minute fall-asleep buffer.",
    ],
    stepsEs: [
      "Elegí el modo: tenés hora de despertar o tenés hora de acostarte.",
      "Ingresá esa hora y cuántos ciclos de 90 minutos querés dormir (4 a 6 es lo habitual).",
      "Leé la hora sugerida; ya incluye los 15 minutos de margen para dormirse.",
    ],
    faq: [
      {
        q: "What is a sleep cycle?",
        a: "A typical sleep cycle lasts about 90 minutes and includes light sleep, deep sleep, and REM. Waking at the end of a cycle feels more refreshed.",
      },
      {
        q: "Why add 15 minutes?",
        a: "Most people take about 15 minutes to fall asleep. The calculator includes this buffer.",
      },
      {
        q: "How many cycles should I sleep?",
        a: "Adults usually do well with 5 to 6 cycles (7.5 to 9 hours in bed). 4 cycles is a short night, not a habit.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es un ciclo de sueño?",
        a: "Un ciclo típico dura unos 90 minutos e incluye sueño ligero, profundo y REM. Despertar al final de un ciclo se siente más descansado.",
      },
      {
        q: "¿Por qué se suman 15 minutos?",
        a: "La mayoría de la gente tarda unos 15 minutos en quedarse dormida. La calculadora incluye ese margen.",
      },
      {
        q: "¿Cuántos ciclos conviene dormir?",
        a: "En adultos suele funcionar bien dormir 5 o 6 ciclos (7,5 a 9 horas en la cama). 4 ciclos es una noche corta, no un hábito.",
      },
    ],
  },
  "calculadora-cuota-prestamo": {
    metaTitle: "Loan Payment Calculator — Monthly EMI & Interest | UtiliHub",
    metaTitleEs: "Calculadora de cuota de préstamo — cuota mensual e interés | UtiliHub",
    metaDescription:
      "Free loan payment calculator. Enter principal, annual interest rate, and term in months to get the monthly payment (EMI), total interest, and total amount. Runs in your browser.",
    metaDescriptionEs:
      "Calculadora de cuota de préstamo gratis: ingresá capital, tasa de interés anual y plazo en meses para obtener la cuota mensual, el interés total y el monto total. En tu navegador, sin registro.",
    about: [
      "The monthly payment of a fixed-rate loan is calculated with the amortisation formula EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r the monthly rate (annual rate divided by 12 and by 100), and n the number of months.",
      "Besides the monthly payment, the tool reports the total interest paid over the life of the loan and the total amount repaid, so you can compare offers beyond the advertised rate.",
    ],
    aboutEs: [
      "La cuota mensual de un préstamo a tasa fija se calcula con la fórmula de amortización EMI = P × r × (1+r)^n / ((1+r)^n − 1), donde P es el capital, r la tasa mensual (la anual dividida por 12 y por 100) y n la cantidad de meses.",
      "Además de la cuota, la herramienta muestra el interés total pagado durante la vida del préstamo y el monto total a devolver, para comparar ofertas más allá de la tasa publicada.",
    ],
    steps: [
      "Enter the loan principal (the amount you borrow).",
      "Enter the annual interest rate and the term in months.",
      "Read the monthly payment, total interest, and total amount; the calculation runs in your browser.",
    ],
    stepsEs: [
      "Ingresá el capital del préstamo (el monto que pedís).",
      "Ingresá la tasa de interés anual y el plazo en meses.",
      "Leé la cuota mensual, el interés total y el monto total; el cálculo se hace en tu navegador.",
    ],
    faq: [
      {
        q: "How is the monthly payment calculated?",
        a: "With the amortisation formula EMI = P × r × (1+r)^n / ((1+r)^n − 1). Example: $10,000 at 12% annual for 12 months gives a monthly payment of about $888.49.",
      },
      {
        q: "What happens if the rate is 0%?",
        a: "With a 0% rate the formula divides by zero, so the payment is simply the principal divided by the number of months, with no interest.",
      },
      {
        q: "Does it include fees or insurance?",
        a: "No. It models principal and interest only. Origination fees, insurance, or taxes are not included in the calculated payment.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cuota mensual?",
        a: "Con la fórmula de amortización EMI = P × r × (1+r)^n / ((1+r)^n − 1). Ejemplo: $10.000 al 12% anual a 12 meses da una cuota de unos $888,49.",
      },
      {
        q: "¿Qué pasa si la tasa es 0%?",
        a: "Con tasa 0% la fórmula divide por cero, así que la cuota es simplemente el capital dividido por la cantidad de meses, sin interés.",
      },
      {
        q: "¿Incluye seguros o comisiones?",
        a: "No. Solo calcula capital e interés. Gastos de origen, seguros o impuestos no están incluidos en la cuota calculada.",
      },
    ],
  },
};