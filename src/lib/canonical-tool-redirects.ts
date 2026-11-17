/**
 * Duplicate tools consolidated into one canonical URL (301s live in vercel.json).
 * The old tool stays in the catalog so ALL_TOOLS is unchanged, but internal links
 * and the sitemap point at the canonical tool instead.
 */
export const CANONICAL_TOOL_REDIRECTS: Record<string, { en: string; es: string; enSlug: string; esSlug: string }> = {
  imc: {
    en: "/tools/bmi-calculator",
    es: "/es/herramientas/calculadora-imc",
    enSlug: "bmi-calculator",
    esSlug: "calculadora-imc",
  },
  "tiempo-lectura": {
    en: "/tools/reading-time-calculator",
    es: "/es/herramientas/calculadora-tiempo-de-lectura",
    enSlug: "reading-time-calculator",
    esSlug: "calculadora-tiempo-de-lectura",
  },
  // The "generador-codigo-qr" UI only drew a row of squares and its PNG button was a stub; the
  // working QR generator lives at the same English URL, so the Spanish duplicate 301s to it.
  "generador-codigo-qr": {
    en: "/tools/qr-code-generator",
    es: "/es/herramientas/generador-qr",
    enSlug: "qr-code-generator",
    esSlug: "generador-qr",
  },
  // Duplicate catalog tools that shared one English URL (route slug collisions) while each
  // had its own Spanish page. Kept: the tool with the most own guide text; the others 301 to it.
  "calculadora-relacion-aspecto": { en: "/tools/aspect-ratio-calculator", es: "/es/herramientas/relacion-aspecto", enSlug: "aspect-ratio-calculator", esSlug: "relacion-aspecto" },
  "contador-caracteres": { en: "/tools/character-counter", es: "/es/herramientas/contador-de-caracteres", enSlug: "character-counter", esSlug: "contador-de-caracteres" },
  "coste-km-viaje": { en: "/tools/cost-per-kilometer", es: "/es/herramientas/coste-km", enSlug: "cost-per-kilometer", esSlug: "coste-km" },
  "generador-gradiente-css": { en: "/tools/css-gradient-generator", es: "/es/herramientas/generador-gradiente", enSlug: "css-gradient-generator", esSlug: "generador-gradiente" },
  "calculadora-raiz-cubica": { en: "/tools/cube-root-calculator", es: "/es/herramientas/raiz-cubica", enSlug: "cube-root-calculator", esSlug: "raiz-cubica" },
  "lanzador-de-dados": { en: "/tools/dice-roller", es: "/es/herramientas/generador-dados", enSlug: "dice-roller", esSlug: "generador-dados" },
  "calculadora-costo-electricidad": { en: "/tools/electricity-cost-calculator", es: "/es/herramientas/calculadora-costo-kwh", enSlug: "electricity-cost-calculator", esSlug: "calculadora-costo-kwh" },
  "calculadora-area-elipse": { en: "/tools/ellipse-area-calculator", es: "/es/herramientas/area-elipse", enSlug: "ellipse-area-calculator", esSlug: "area-elipse" },
  "coste-combustible-viaje": { en: "/tools/fuel-cost", es: "/es/herramientas/combustible-viaje", enSlug: "fuel-cost", esSlug: "combustible-viaje" },
  "calculadora-gpa": { en: "/tools/gpa-calculator", es: "/es/herramientas/gpa", enSlug: "gpa-calculator", esSlug: "gpa" },
  "conversion-gramos-tazas": { en: "/tools/grams-to-cups", es: "/es/herramientas/gramos-tazas", enSlug: "grams-to-cups", esSlug: "gramos-tazas" },
  "tarifa-hora": { en: "/tools/hourly-rate", es: "/es/herramientas/tarifa-horaria", enSlug: "hourly-rate", esSlug: "tarifa-horaria" },
  "calculadora-peso-saludable": { en: "/tools/ideal-weight-calculator", es: "/es/herramientas/peso-ideal", enSlug: "ideal-weight-calculator", esSlug: "peso-ideal" },
  "calculadora-peso-ideal": { en: "/tools/ideal-weight-calculator", es: "/es/herramientas/peso-ideal", enSlug: "ideal-weight-calculator", esSlug: "peso-ideal" },
  "jwt-decoder": { en: "/tools/jwt-decoder", es: "/es/herramientas/decodificador-jwt", enSlug: "jwt-decoder", esSlug: "decodificador-jwt" },
  "conversor-longitud": { en: "/tools/length-converter", es: "/es/herramientas/conversor-de-longitud", enSlug: "length-converter", esSlug: "conversor-de-longitud" },
  "contador-lineas": { en: "/tools/line-counter", es: "/es/herramientas/contador-de-lineas", enSlug: "line-counter", esSlug: "contador-de-lineas" },
  "markdown-tabla": { en: "/tools/markdown-table-generator", es: "/es/herramientas/generador-tabla-markdown", enSlug: "markdown-table-generator", esSlug: "generador-tabla-markdown" },
  "codigo-morse": { en: "/tools/morse-code-translator", es: "/es/herramientas/traductor-morse", enSlug: "morse-code-translator", esSlug: "traductor-morse" },
  "conversor-mpg-l100km": { en: "/tools/mpg-to-l-100km-converter", es: "/es/herramientas/mpg-a-litros", enSlug: "mpg-to-l-100km-converter", esSlug: "mpg-a-litros" },
  "contador-parrafos": { en: "/tools/paragraph-counter", es: "/es/herramientas/contador-de-parrafos", enSlug: "paragraph-counter", esSlug: "contador-de-parrafos" },
  "generador-password": { en: "/tools/password-generator", es: "/es/herramientas/generador-de-contrasenas", enSlug: "password-generator", esSlug: "generador-de-contrasenas" },
  "calculadora-diferencia-porcentual": { en: "/tools/percentage-difference-calculator", es: "/es/herramientas/diferencia-porcentual", enSlug: "percentage-difference-calculator", esSlug: "diferencia-porcentual" },
  "generador-numeros": { en: "/tools/random-number-generator", es: "/es/herramientas/generador-numero-aleatorio", enSlug: "random-number-generator", esSlug: "generador-numero-aleatorio" },
  "escalador-receta": { en: "/tools/recipe-scaler", es: "/es/herramientas/escalador-recetas", enSlug: "recipe-scaler", esSlug: "escalador-recetas" },
  "contador-oraciones": { en: "/tools/sentence-counter", es: "/es/herramientas/contador-de-frases", enSlug: "sentence-counter", esSlug: "contador-de-frases" },
  "calculadora-interes-simple-alt": { en: "/tools/simple-interest-calculator", es: "/es/herramientas/calculadora-interes-simple", enSlug: "simple-interest-calculator", esSlug: "calculadora-interes-simple" },
  "calculadora-ciclo-sueno": { en: "/tools/sleep-cycle-calculator", es: "/es/herramientas/calculadora-ciclos-sueno-90", enSlug: "sleep-cycle-calculator", esSlug: "calculadora-ciclos-sueno-90" },
  "ciclos-sueno": { en: "/tools/sleep-cycle-calculator", es: "/es/herramientas/calculadora-ciclos-sueno-90", enSlug: "sleep-cycle-calculator", esSlug: "calculadora-ciclos-sueno-90" },
  "generador-slug": { en: "/tools/slug-generator", es: "/es/herramientas/slug-generator", enSlug: "slug-generator", esSlug: "slug-generator" },
  "cronometro-productividad": { en: "/tools/stopwatch", es: "/es/herramientas/cronometro", enSlug: "stopwatch", esSlug: "cronometro" },
  "conversor-de-temperatura": { en: "/tools/temperature-converter", es: "/es/herramientas/conversor-temperatura", enSlug: "temperature-converter", esSlug: "conversor-temperatura" },
  "conversor-texto-caso": { en: "/tools/text-case-converter", es: "/es/herramientas/convertidor-casos-texto", enSlug: "text-case-converter", esSlug: "convertidor-casos-texto" },
  "conversor-zonas-horarias": { en: "/tools/timezone-converter", es: "/es/herramientas/conversor-zona-horaria", enSlug: "timezone-converter", esSlug: "conversor-zona-horaria" },
  "distancia-viaje-calculadora": { en: "/tools/travel-distance", es: "/es/herramientas/distancia-viaje", enSlug: "travel-distance", esSlug: "distancia-viaje" },
  "calculadora-area-triangulo-alt": { en: "/tools/triangle-area-calculator", es: "/es/herramientas/calculadora-area-triangulo", enSlug: "triangle-area-calculator", esSlug: "calculadora-area-triangulo" },
  "calculadora-precio-por-unidad": { en: "/tools/unit-price-calculator", es: "/es/herramientas/calculadora-precio-unitario", enSlug: "unit-price-calculator", esSlug: "calculadora-precio-unitario" },
  "generador-uuid": { en: "/tools/uuid-generator", es: "/es/herramientas/uuid-generator", enSlug: "uuid-generator", esSlug: "uuid-generator" },
  "calculadora-consumo-agua": { en: "/tools/water-consumption-calculator", es: "/es/herramientas/consumo-agua", enSlug: "water-consumption-calculator", esSlug: "consumo-agua" },
  "conversor-peso": { en: "/tools/weight-converter", es: "/es/herramientas/conversor-de-peso", enSlug: "weight-converter", esSlug: "conversor-de-peso" },
  "contador-palabras": { en: "/tools/word-counter", es: "/es/herramientas/contador-de-palabras", enSlug: "word-counter", esSlug: "contador-de-palabras" },
  "contador-frecuencia-palabras": { en: "/tools/word-frequency-counter", es: "/es/herramientas/frecuencia-palabras", enSlug: "word-frequency-counter", esSlug: "frecuencia-palabras" },
  "calculadora-propina": { en: "/tools/tip-calculator", es: "/es/herramientas/propina", enSlug: "tip-calculator", esSlug: "propina" },
  "calculadora-porcentaje-aumento": { en: "/tools/percentage-increase-calculator", es: "/es/herramientas/porcentaje-aumento", enSlug: "percentage-increase-calculator", esSlug: "porcentaje-aumento" },
};

export const isRedirectedToolSlug = (slug: string) => Object.hasOwn(CANONICAL_TOOL_REDIRECTS, slug);
