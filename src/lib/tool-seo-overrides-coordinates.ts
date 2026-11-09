import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_COORDINATES: Record<string, ToolSeoOverride> = {
  "conversor-coordenadas": {
    metaTitle: "Coordinate Converter — Decimal Degrees to DMS Lat/Lon | UtiliHub",
    metaTitleEs: "Conversor de coordenadas — decimal a grados, minutos y segundos | UtiliHub",
    metaDescription:
      "Free coordinate converter: latitude/longitude between decimal degrees and DMS. Example: 40.4168, -3.7038 → 40° 25' 0.48\" N. Runs in your browser.",
    metaDescriptionEs:
      "Conversor de coordenadas gratis: latitud y longitud entre grados decimales y DMS. Ejemplo: 40.4168, -3.7038 → 40° 25' 0.48\" N. En el navegador, sin registro.",
    about: [
      "A coordinate converter turns the same map point between decimal degrees (one signed number per axis) and DMS — degrees, minutes (1/60 of a degree), and seconds (1/3600), plus N/S and E/W.",
      "In decimal form, south and west are negative. In DMS this tool shows a hemisphere letter instead of a minus sign. Minutes and seconds must stay below 60; latitude cannot exceed 90 or longitude 180.",
      "Example: Madrid 40.4168, -3.7038 becomes about 40° 25' 0.48\" N, 3° 42' 13.68\" W. Barcelona DMS 41° 24' 12.20\" N, 2° 10' 26.50\" E converts back to about 41.403389, 2.174028.",
      "Conversion runs only in your browser. Nothing is uploaded. Useful for GIS paste-ins, GPS readouts, and map APIs that expect one format or the other.",
    ],
    aboutEs: [
      "Un conversor de coordenadas pasa el mismo punto del mapa entre grados decimales (un número con signo por eje) y DMS: grados, minutos (1/60 de grado) y segundos (1/3600), más N/S y E/O.",
      "En decimal, sur y oeste son negativos. En DMS esta herramienta muestra el hemisferio en letra. Los minutos y segundos deben ser menores que 60; la latitud no puede pasar de 90 ni la longitud de 180.",
      "Ejemplo: Madrid 40.4168, -3.7038 ≈ 40° 25' 0.48\" N, 3° 42' 13.68\" O. Barcelona en DMS 41° 24' 12.20\" N, 2° 10' 26.50\" E vuelve a ≈ 41.403389, 2.174028.",
      "El cálculo es local en el navegador. Sirve para pegar en GIS, lecturas GPS y APIs de mapas que piden un formato u otro.",
    ],
    steps: [
      "Choose Decimal → DMS or DMS → decimal.",
      "Enter latitude and longitude (or degrees, minutes, seconds and hemisphere).",
      "Read the other format; seconds are rounded to two decimals.",
      "Copy the pair. Try the Madrid or Barcelona presets to verify.",
    ],
    stepsEs: [
      "Elegí Decimal → DMS o DMS → decimal.",
      "Ingresá latitud y longitud (o grados, minutos, segundos y hemisferio).",
      "Leé el otro formato; los segundos se redondean a dos decimales.",
      "Copiá el par. Probá los presets Madrid o Barcelona para verificar.",
    ],
    faq: [
      {
        q: "How do I convert decimal degrees to DMS?",
        a: "Degrees = integer part of the absolute value. Minutes = integer part of (fraction × 60). Seconds = the remaining fraction × 60. Attach N/S or E/W from the sign.",
      },
      {
        q: "What is 40.4168, -3.7038 in DMS?",
        a: "About 40° 25' 0.48\" N, 3° 42' 13.68\" W — central Madrid.",
      },
      {
        q: "How do I convert 41° 24' 12.20\" N, 2° 10' 26.50\" E to decimal?",
        a: "decimal = degrees + minutes/60 + seconds/3600, then apply sign (S/W negative). Result ≈ 41.403389, 2.174028.",
      },
      {
        q: "Why are 60 minutes rejected?",
        a: "Valid minutes are 0–59. Sixty minutes is the next whole degree; the field is invalid instead of silently carrying over.",
      },
      {
        q: "Is this coordinate converter free?",
        a: "Yes. It runs in your browser with no account and no upload.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo paso de grados decimales a DMS?",
        a: "Grados = parte entera del valor absoluto. Minutos = parte entera de (fracción × 60). Segundos = el resto × 60. El signo define N/S o E/O.",
      },
      {
        q: "¿Qué es 40.4168, -3.7038 en DMS?",
        a: "Aprox. 40° 25' 0.48\" N, 3° 42' 13.68\" O — centro de Madrid.",
      },
      {
        q: "¿Cómo vuelvo 41° 24' 12.20\" N, 2° 10' 26.50\" E a decimal?",
        a: "decimal = grados + minutos/60 + segundos/3600 y luego el signo (S/O negativos). Resultado ≈ 41.403389, 2.174028.",
      },
      {
        q: "¿Por qué se rechazan 60 minutos?",
        a: "Los minutos válidos van de 0 a 59. Sesenta minutos serían el grado siguiente; el campo queda inválido en vez de arrastrar en silencio.",
      },
      {
        q: "¿Hay conversor de coordenadas online gratis?",
        a: "Sí. Esta herramienta convierte en el navegador sin registro ni subida de datos.",
      },
    ],
  },
};
