import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RAINWATER: Record<string, ToolSeoOverride> = {
  "calculadora-agua-lluvia": {
    metaTitle: "Rainwater Harvesting Calculator | UtiliHub",
    metaTitleEs: "Calculadora de agua de lluvia | UtiliHub",
    metaDescription:
      "Estimate litres a roof collects from a storm or a year. Runoff coefficient, first flush, barrels, and gallons. Free, in the browser.",
    metaDescriptionEs:
      "Estimá los litros que recoge un techo en una tormenta o en el año. Coeficiente, primer lavado, tanques y galones. Gratis, en el navegador.",
    about: [
      "One millimetre of rain on one square metre is one litre. Collected volume is roof area times rainfall depth times a runoff coefficient, then minus an optional first-flush diversion. The gutter calculator orders sections and hangers; the roof calculator orders shingles. This one sizes the tank.",
      "A metal shed of 18 m² in a 20 mm storm at 0.90 runoff captures 324 litres before first flush — about two 200 L barrels if you round up. The same roof at 800 mm a year is about 12,960 litres, a planning figure for irrigation, not a weather forecast. Tile and asphalt roofs lose more to absorption and splash, so their presets use 0.75–0.80.",
      "Storm volume answers “will this barrel overflow on Saturday?” Annual volume answers “how much can the roof supply over a year?” If you enter litres used per day, the tool divides the storm capture by that rate and shows days covered. Gallons are US gallons (litres × 0.264172). Barrel count rounds up so the tank is not short.",
      "Coefficients are planning values: metal near 0.90, asphalt shingle near 0.80, clay tile near 0.75. First flush is a fixed litre diversion for the dirty start of a storm, not a filter model. Nothing is uploaded. Empty values, areas outside 0.5–5,000 m², rainfall outside 0.1–4,000 mm, and coefficients outside 0.30–1 are rejected.",
    ],
    aboutEs: [
      "Un milímetro de lluvia sobre un metro cuadrado es un litro. El volumen recogido es el área del techo por la altura de lluvia por un coeficiente de escorrentía, menos un desvío opcional de primer lavado. La calculadora de canalones pide tramos y soportes; la de tejado pide tejas. Esta dimensiona el tanque.",
      "Un cobertizo de chapa de 18 m² con 20 mm de tormenta y coeficiente 0,90 recoge 324 litros antes del primer lavado: unos dos tanques de 200 L si se redondea hacia arriba. El mismo techo con 800 mm al año son unos 12.960 litros, una cifra de planificación para riego, no un pronóstico. Teja y asfalto pierden más por absorción y salpicadura; sus presets usan 0,75–0,80.",
      "El volumen de tormenta responde si el tanque se desborda el sábado. El anual responde cuánto puede aportar el techo en el año. Si cargás litros por día, la tool divide la captación de la tormenta por ese ritmo y muestra días cubiertos. Los galones son de EE.UU. (litros × 0,264172). Los tanques se redondean hacia arriba.",
      "Los coeficientes son de planificación: chapa cerca de 0,90, teja asfáltica cerca de 0,80, teja cerámica cerca de 0,75. El primer lavado es un desvío fijo en litros del arranque sucio, no un modelo de filtro. No se sube nada. Se rechazan vacíos, áreas fuera de 0,5–5.000 m², lluvia fuera de 0,1–4.000 mm y coeficientes fuera de 0,30–1.",
    ],
    steps: [
      "Pick a roof preset or enter the catchment area in square metres.",
      "Set storm rainfall and annual rainfall in millimetres, plus the runoff coefficient.",
      "Optional: first-flush litres, barrel size, and daily irrigation use.",
      "Read storm and annual litres, gallons, barrels, and days covered, then copy the estimate.",
    ],
    stepsEs: [
      "Elegí un preset de techo o cargá el área de captación en metros cuadrados.",
      "Definí la lluvia de la tormenta y la anual en milímetros, más el coeficiente de escorrentía.",
      "Opcional: litros de primer lavado, tamaño del tanque y riego diario.",
      "Leé litros de tormenta y del año, galones, tanques y días cubiertos, y copiá la estimación.",
    ],
    faq: [
      {
        q: "How many litres does 1 mm of rain collect?",
        a: "One millimetre over one square metre is one litre before losses. Multiply area (m²) by rainfall (mm) by the runoff coefficient, then subtract first flush.",
      },
      {
        q: "What runoff coefficient should I use?",
        a: "Metal is often about 0.90, asphalt shingles about 0.80, and clay tile about 0.75. Use the supplier or local guide if you have one. The tool does not model wind-driven loss.",
      },
      {
        q: "Is annual rainfall the same as a design storm?",
        a: "No. Storm millimetres size the barrel for one event. Annual millimetres estimate a year of supply. A 25 mm storm and 650 mm a year are separate inputs.",
      },
      {
        q: "Does first flush change the barrel count?",
        a: "Yes. First flush is subtracted from the storm volume before barrels are rounded up. It is a fixed litre allowance, not a timed diverter.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Area, rainfall, and tank size stay on your device. The result is a planning estimate, not a plumbing design or a forecast.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántos litros recoge 1 mm de lluvia?",
        a: "Un milímetro sobre un metro cuadrado es un litro antes de pérdidas. Multiplicá el área (m²) por la lluvia (mm) por el coeficiente y restá el primer lavado.",
      },
      {
        q: "¿Qué coeficiente de escorrentía uso?",
        a: "La chapa suele estar cerca de 0,90, la teja asfáltica cerca de 0,80 y la teja cerámica cerca de 0,75. Si tenés ficha local, usala. La tool no modela pérdida por viento.",
      },
      {
        q: "¿La lluvia anual es lo mismo que la tormenta de diseño?",
        a: "No. Los milímetros de tormenta dimensionan el tanque para un evento. Los anuales estiman el aporte del año. Una tormenta de 25 mm y 650 mm al año son entradas distintas.",
      },
      {
        q: "¿El primer lavado cambia la cantidad de tanques?",
        a: "Sí. Se resta del volumen de la tormenta antes de redondear los tanques hacia arriba. Es un cupo fijo en litros, no un desviador temporizado.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. El área, la lluvia y el tamaño del tanque quedan en tu dispositivo. El resultado es una estimación de planificación, no un diseño de plomería ni un pronóstico.",
      },
    ],
  },
};