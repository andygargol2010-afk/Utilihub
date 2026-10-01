import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_OVERTIME: Record<string, ToolSeoOverride> = {
  "calculadora-horas-extra": {
    metaTitle: "Overtime Pay Calculator — Time and a Half | UtiliHub",
    metaTitleEs: "Calculadora de horas extra — pago y multiplicador | UtiliHub",
    metaDescription:
      "Calculate regular pay, overtime pay, and total pay from hourly rate, regular hours, overtime hours, and a 1.5x or 2x multiplier. Free in the browser.",
    metaDescriptionEs:
      "Calculá el pago regular, el pago de horas extra y el total a partir del valor hora, las horas normales, las horas extra y un multiplicador 1,5x o 2x. Gratis en el navegador.",
    about: [
      "Enter an hourly rate, regular hours, and overtime hours. The tool multiplies overtime hours by the rate and the multiplier (1.5 for time-and-a-half, 2 for double time).",
      "Results stay in the browser. This is an estimate: contracts, daily thresholds, and local labor rules can change what counts as overtime.",
    ],
    aboutEs: [
      "Ingresá el valor hora, las horas normales y las horas extra. La herramienta multiplica las horas extra por el valor hora y por el multiplicador (1,5 para tiempo y medio, 2 para doble).",
      "El cálculo queda en el navegador. Es una estimación: el convenio, el umbral diario y la normativa local pueden cambiar qué cuenta como hora extra.",
    ],
    steps: [
      "Enter the hourly rate and the currency label you want on the result.",
      "Enter regular hours and overtime hours. Use a comma or a dot for decimals.",
      "Choose 1.5x, 2x, or a custom multiplier, then review regular pay, overtime pay, and total.",
    ],
    stepsEs: [
      "Ingresá el valor hora y la etiqueta de moneda que querés ver en el resultado.",
      "Ingresá horas normales y horas extra. Podés usar coma o punto para los decimales.",
      "Elegí 1,5x, 2x o un multiplicador propio y revisá pago regular, pago extra y total.",
    ],
    faq: [
      {
        q: "What multiplier should I use?",
        a: "1.5 is the common time-and-a-half default. Use 2 for double time, or type the factor from your contract.",
      },
      {
        q: "Does this apply labor-law thresholds?",
        a: "No. You enter the hours that already count as overtime. The tool does not decide weekly or daily limits.",
      },
      {
        q: "Is the result stored?",
        a: "No. Calculation runs locally in the browser and is not uploaded.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué multiplicador uso?",
        a: "1,5 es el valor habitual de tiempo y medio. Usá 2 para doble hora, o el factor de tu contrato.",
      },
      {
        q: "¿Aplica topes legales de horas extra?",
        a: "No. Vos ingresás las horas que ya cuentan como extra. La herramienta no decide umbrales diarios o semanales.",
      },
      {
        q: "¿Se guarda el resultado?",
        a: "No. El cálculo corre en el navegador y no se sube a un servidor.",
      },
    ],
  },
};
