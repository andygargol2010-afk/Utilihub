import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_COORDINATES: Record<string, ToolSeoOverride> = {
  "conversor-coordenadas": {
    metaTitle: "Decimal Degrees to DMS Converter — Lat/Lon | UtiliHub",
    metaTitleEs: "Conversor de coordenadas decimales a grados, minutos y segundos | UtiliHub",
    metaDescription:
      "Convert latitude and longitude between decimal degrees and DMS. 40.4168, -3.7038 is 40° 25' 0.48\" N, 3° 42' 13.68\" W. Local, no signup.",
    metaDescriptionEs:
      "Convertí latitud y longitud entre grados decimales y DMS. 40.4168, -3.7038 es 40° 25' 0.48\" N, 3° 42' 13.68\" O. Local, sin registro.",
    about: [
      "Decimal degrees are a signed number. DMS splits the same angle into degrees, minutes (1/60) and seconds (1/3600), plus a hemisphere.",
      "South and west are negative in decimal form. This converter writes N/S and E/W instead of a minus sign.",
      "Minutes or seconds of 60 or more are rejected. Latitude above 90 or longitude above 180 is rejected. Empty fields do not invent a point.",
    ],
    aboutEs: [
      "Los grados decimales son un número con signo. DMS parte el mismo ángulo en grados, minutos (1/60) y segundos (1/3600), más el hemisferio.",
      "Sur y oeste son negativos en decimal. Este conversor escribe N/S y E/O en lugar del signo menos.",
      "Minutos o segundos de 60 o más se rechazan. Latitud mayor a 90 o longitud mayor a 180 se rechaza. Vacío no inventa un punto.",
    ],
    steps: [
      "Paste decimal latitude and longitude, or enter degrees, minutes, and seconds.",
      "Read the other format. Seconds are rounded to two decimals.",
      "Copy the pair. Nothing is uploaded.",
    ],
    stepsEs: [
      "Pegá latitud y longitud decimales, o escribí grados, minutos y segundos.",
      "Leé el otro formato. Los segundos se redondean a dos decimales.",
      "Copiá el par. No se sube nada.",
    ],
    faq: [
      { q: "What is 40.4168, -3.7038 in DMS?", a: "40° 25' 0.48\" N, 3° 42' 13.68\" W. That is central Madrid." },
      { q: "How do I convert 41° 24' 12.20\" N, 2° 10' 26.50\" E back?", a: "41.403389, 2.174028. North and east stay positive." },
      { q: "Why is 60 minutes rejected?", a: "A minute only runs from 0 to 59. 60 minutes is the next degree, so the field is invalid instead of silently carrying." },
    ],
    faqEs: [
      { q: "¿Qué es 40.4168, -3.7038 en DMS?", a: "40° 25' 0.48\" N, 3° 42' 13.68\" O. Es el centro de Madrid." },
      { q: "¿Cómo vuelvo 41° 24' 12.20\" N, 2° 10' 26.50\" E a decimal?", a: "41.403389, 2.174028. Norte y este quedan positivos." },
      { q: "¿Por qué se rechazan 60 minutos?", a: "Un minuto va de 0 a 59. 60 minutos es el grado siguiente, así que el campo es inválido en vez de arrastrar en silencio." },
    ],
  },
};
