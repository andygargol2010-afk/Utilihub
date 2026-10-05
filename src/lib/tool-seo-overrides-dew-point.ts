import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_DEW_POINT: Record<string, ToolSeoOverride> = {
  "calculadora-punto-rocio": {
    metaTitle: "Dew Point Calculator from Humidity | UtiliHub",
    metaTitleEs: "Calculadora de punto de rocío | UtiliHub",
    metaDescription:
      "Calculate dew point from air temperature and relative humidity. Celsius or Fahrenheit, with the spread and a comfort band. Free, in the browser.",
    metaDescriptionEs:
      "Calculá el punto de rocío con temperatura y humedad relativa. En Celsius o Fahrenheit, con la diferencia y una banda de confort. Gratis, en el navegador.",
    about: [
      "Enter the air temperature in Celsius or Fahrenheit and the relative humidity. The dew point is the temperature at which that air would become saturated if it cooled at constant pressure and moisture. The tool uses the August–Roche–Magnus approximation: γ = ln(RH/100) + (a·T)/(b+T), then Td = b·γ/(a−γ), with a = 17.625 and b = 243.04 °C (Alduchov and Eskridge). Temperature is converted to Celsius before the formula and back to the scale you chose.",
      "A room at 22 °C and 45% relative humidity has a dew point near 9.5 °C, a spread of about 12.5 °C, which most indoor guides treat as comfortable. The same 22 °C at 70% humidity raises the dew point to about 16 °C and starts to feel humid. At 30 °C and 70% humidity the dew point is near 24 °C: the air is close to saturation and surfaces only a little cooler than the room can fog. A 5 °C night at 90% humidity has a dew point near 3.5 °C; if the ground cools below that, dew is likely.",
      "Comfort bands follow common HVAC planning ranges on the dew point, not a medical scale: under 10 °C dry, 10–16 °C comfortable, 16–18 °C slightly humid, 18–21 °C muggy, 21–24 °C very humid, and above 24 °C oppressive. The spread (air temperature minus dew point) is the margin before condensation. Below 0 °C the result is still a dew point over liquid water, not the frost point over ice, which uses different saturation constants.",
      "Nothing is uploaded. Empty values, temperatures outside −40 to 60 °C, and humidity outside 1–100% are rejected. The heat-index tool estimates how hot the air feels. The scientific temperature tool only converts scales. This one answers when moisture would condense.",
    ],
    aboutEs: [
      "Ingresá la temperatura del aire en Celsius o Fahrenheit y la humedad relativa. El punto de rocío es la temperatura a la que ese aire se saturaría si se enfriara a presión y humedad absoluta constantes. La tool usa la aproximación de August–Roche–Magnus: γ = ln(HR/100) + (a·T)/(b+T), luego Td = b·γ/(a−γ), con a = 17,625 y b = 243,04 °C (Alduchov y Eskridge). La temperatura se pasa a Celsius antes de la fórmula y se devuelve a la escala elegida.",
      "Un ambiente a 22 °C y 45% de humedad relativa tiene un punto de rocío cerca de 9,5 °C y una diferencia de unos 12,5 °C, que la mayoría de las guías de interior tratan como confortable. Los mismos 22 °C al 70% suben el punto de rocío a unos 16 °C y el aire empieza a sentirse húmedo. A 30 °C y 70% el punto de rocío queda cerca de 24 °C: el aire está casi saturado y una superficie apenas más fría puede empañarse. Una noche de 5 °C al 90% tiene un punto de rocío cerca de 3,5 °C; si el suelo baja de eso, es probable el rocío.",
      "Las bandas de confort siguen rangos habituales de climatización sobre el punto de rocío, no una escala médica: menos de 10 °C seco, 10–16 °C confortable, 16–18 °C algo húmedo, 18–21 °C bochornoso, 21–24 °C muy húmedo y más de 24 °C opresivo. La diferencia (temperatura del aire menos punto de rocío) es el margen antes de la condensación. Bajo 0 °C el resultado sigue siendo el punto de rocío sobre agua líquida, no el punto de escarcha sobre hielo, que usa otras constantes de saturación.",
      "No se sube nada. Se rechazan valores vacíos, temperaturas fuera de −40 a 60 °C y humedad fuera de 1–100%. La tool de sensación térmica estima cómo se siente el calor. La de temperatura científica solo convierte escalas. Esta responde cuándo condensaría la humedad.",
    ],
    steps: [
      "Choose Celsius or Fahrenheit.",
      "Enter the air temperature and the relative humidity, or pick a preset.",
      "Read the dew point, the spread, and the comfort band.",
      "Copy the result if you need it for a note or a weather log.",
    ],
    stepsEs: [
      "Elegí Celsius o Fahrenheit.",
      "Cargá la temperatura del aire y la humedad relativa, o usá un preset.",
      "Leé el punto de rocío, la diferencia y la banda de confort.",
      "Copiá el resultado si lo necesitás para una nota o un registro del clima.",
    ],
    faq: [
      {
        q: "How is the dew point calculated?",
        a: "With the August–Roche–Magnus formula: γ = ln(RH/100) + (17.625·T)/(243.04+T), then Td = 243.04·γ/(17.625−γ), with T and Td in °C. Fahrenheit inputs are converted first.",
      },
      {
        q: "Is dew point the same as humidity?",
        a: "No. Relative humidity is a percentage of saturation at the current temperature. Dew point is a temperature. The same 50% humidity means a much higher dew point on a hot day than on a cool one.",
      },
      {
        q: "Does a dew point below freezing mean frost?",
        a: "Not exactly. This formula is the dew point over liquid water. The frost point over ice uses different constants, so treat a sub-zero result as a condensation guide, not a frost forecast.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Temperature and humidity stay on your device. The bands are planning labels for comfort and condensation, not a weather forecast.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el punto de rocío?",
        a: "Con la fórmula de August–Roche–Magnus: γ = ln(HR/100) + (17,625·T)/(243,04+T), luego Td = 243,04·γ/(17,625−γ), con T y Td en °C. Si ingresás Fahrenheit, se convierte antes.",
      },
      {
        q: "¿El punto de rocío es lo mismo que la humedad?",
        a: "No. La humedad relativa es un porcentaje de saturación a la temperatura actual. El punto de rocío es una temperatura. El mismo 50% implica un punto de rocío mucho más alto en un día caluroso que en uno fresco.",
      },
      {
        q: "¿Un punto de rocío bajo cero significa escarcha?",
        a: "No exactamente. Esta fórmula es el punto de rocío sobre agua líquida. El punto de escarcha sobre hielo usa otras constantes, así que un resultado bajo cero es una guía de condensación, no un pronóstico de helada.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. La temperatura y la humedad quedan en tu dispositivo. Las bandas son etiquetas de planificación para confort y condensación, no un pronóstico.",
      },
    ],
  },
};
