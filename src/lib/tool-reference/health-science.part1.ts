// Part 1 of 3 — entries of DEW_POINT_REFERENCE, split from health-science.ts on 2026-11-04. Add new entries in the smallest part.

export const DEW_POINT_REFERENCE_PART1 = {  formula: {
    title: { en: "Dew point formula (Magnus)", es: "Fórmula del punto de rocío (Magnus)" },
    lines: [
      {
        en: "γ = ln(RH ÷ 100) + (17.625 × T) ÷ (243.04 + T)",
        es: "γ = ln(HR ÷ 100) + (17,625 × T) ÷ (243,04 + T)",
      },
      { en: "Dew point Td = 243.04 × γ ÷ (17.625 − γ)", es: "Punto de rocío Td = 243,04 × γ ÷ (17,625 − γ)" },
      {
        en: "T is air temperature in °C and RH is relative humidity in %. Valid over liquid water; below 0 °C it is not the frost point.",
        es: "T es la temperatura del aire en °C y HR la humedad relativa en %. Vale sobre agua líquida; bajo 0 °C no es el punto de escarcha.",
      },
    ],
  },
};
