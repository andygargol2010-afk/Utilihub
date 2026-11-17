/**
 * Written guide shown on each category hub (/category/<slug> and /es/categoria/<slug>).
 * The tool list on those pages is rendered after hydration, so this is the hub's own text in
 * the server HTML. `picks` are internal slugs of tools in the category that have their own
 * guide content; they are linked from the hub.
 */
export type CategoryGuide = {
  en: string[];
  es: string[];
  picks: string[];
};

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  matematicas: {
    en: [
      "The math tools cover the calculations that come up most in school, work and everyday decisions: percentages and percentage change, the rule of three, fractions, averages (arithmetic, harmonic and geometric), roots, powers and Roman numerals. Each calculator shows the result as soon as the inputs are valid, and the guides of the main ones explain the formula so the answer can be checked by hand.",
      "A practical tip: when two tools seem to answer the same question, read their guides. A percentage increase and a percentage of a total use different reference values, and confusing them is the most common source of wrong results.",
    ],
    es: [
      "Las herramientas de matemáticas cubren los cálculos que más aparecen en la escuela, el trabajo y las decisiones de todos los días: porcentajes y variación porcentual, regla de tres, fracciones, medias (aritmética, armónica y geométrica), raíces, potencias y números romanos. Cada calculadora muestra el resultado apenas los datos son válidos, y las guías de las principales explican la fórmula para poder comprobarlo a mano.",
      "Un consejo práctico: cuando dos herramientas parecen responder lo mismo, conviene leer su guía. Un aumento porcentual y un porcentaje de un total usan valores de referencia distintos, y confundirlos es la causa más común de resultados equivocados.",
    ],
    picks: ["porcentaje", "regla-de-tres", "porcentaje-aumento", "calculadora-media-armonica", "numeros-romanos", "porcentaje-hasta-meta"],
  },
  texto: {
    en: [
      "The text tools clean, transform and measure writing: word and syllable counts, reading time, case conversion, subtitle offsets, Markdown tables, and translators for Morse code, braille and the NATO phonetic alphabet. They work on the text pasted into the page, which never leaves the browser.",
      "They are useful for editors checking length limits, teachers preparing exercises, developers formatting documentation and anyone who needs to fix a subtitle file that is out of sync with its video.",
    ],
    es: [
      "Las herramientas de texto limpian, transforman y miden lo que se escribe: conteo de palabras y sílabas, tiempo de lectura, cambio de mayúsculas, desfase de subtítulos, tablas Markdown y traductores a código Morse, braille y alfabeto fonético OTAN. Trabajan sobre el texto pegado en la página, que nunca sale del navegador.",
      "Sirven a quien edita y necesita respetar un límite de extensión, a docentes que preparan ejercicios, a quien documenta código y a cualquiera que tenga que corregir un archivo de subtítulos desfasado respecto del video.",
    ],
    picks: ["contador-silabas", "convertidor-casos-texto", "desfase-srt", "generador-tabla-markdown", "traductor-morse", "validador-isbn"],
  },
  desarrollo: {
    en: [
      "The developer tools handle the small, repetitive jobs of web work: formatting and validating JSON, Base64 and URL encoding, decoding JWTs, building cron expressions, converting chmod permissions and generating robots.txt, .gitignore, Open Graph tags and PWA manifests.",
      "Everything runs locally, which matters when the input is a token, a configuration file or private data: nothing is sent to a server. Generated files are plain text that can be copied straight into a project.",
    ],
    es: [
      "Las herramientas de desarrollo resuelven las tareas chicas y repetitivas del trabajo web: formatear y validar JSON, codificar en Base64 y URL, decodificar JWT, armar expresiones cron, convertir permisos chmod y generar robots.txt, .gitignore, etiquetas Open Graph y manifiestos PWA.",
      "Todo se ejecuta en el navegador, algo importante cuando lo que se pega es un token, un archivo de configuración o datos privados: nada se envía a un servidor. Los archivos generados son texto plano que se copia directo al proyecto.",
    ],
    picks: ["decodificador-jwt", "generador-cron", "conversor-permisos-chmod", "generador-robots-txt", "json-a-typescript", "generador-open-graph"],
  },
  conversiones: {
    en: [
      "The converters translate a value between units without losing precision: weight, temperature, volume, fuel economy, shoe sizes, musical keys and tempo. Conversions use exact definitions where they exist (one pound is exactly 0.45359237 kg) and say so in the guide.",
      "Several of them include reference tables for the most common values, so the usual figures can be checked without typing anything.",
    ],
    es: [
      "Los conversores pasan un valor de una unidad a otra sin perder precisión: peso, temperatura, volumen, consumo de combustible, talles de calzado, tonalidades musicales y tempo. Las conversiones usan las definiciones exactas cuando existen (una libra equivale exactamente a 0,45359237 kg) y lo indican en la guía.",
      "Varios incluyen tablas de referencia con los valores más comunes, para consultar las cifras habituales sin escribir nada.",
    ],
    picks: ["conversor-temperatura", "conversor-kg-libras", "conversor-onzas-gramos", "mpg-a-litros", "conversor-tallas-zapatos", "transportador-acordes"],
  },
  fechas: {
    en: [
      "The date and time tools answer questions that are easy to get wrong by counting on a calendar: exact age in years, months and days, the number of days between two dates, ISO week numbers, ISO 8601 durations, Unix timestamps and estimated due dates.",
      "They account for leap years and month lengths, which is where counting by hand usually goes wrong.",
    ],
    es: [
      "Las herramientas de fechas y tiempo responden preguntas en las que es fácil equivocarse contando en el calendario: edad exacta en años, meses y días, días entre dos fechas, número de semana ISO, duraciones ISO 8601, marcas de tiempo Unix y fecha probable de parto.",
      "Tienen en cuenta los años bisiestos y el largo de cada mes, que es donde suele fallar la cuenta a mano.",
    ],
    picks: ["edad-exacta", "calculadora-de-fechas", "conversor-semana-iso", "conversor-timestamp-unix", "generador-duracion-iso", "fecha-parto"],
  },
  generadores: {
    en: [
      "The generators create things that would otherwise need a separate app: QR codes for links and text, sortable unique identifiers (ULID), and random values for games, raffles and tests.",
      "Identifiers and random values are created in the browser with its cryptographic random generator, so nothing is stored on a server.",
    ],
    es: [
      "Los generadores crean cosas que de otro modo requerirían una aplicación aparte: códigos QR para enlaces y textos, identificadores únicos ordenables (ULID) y valores aleatorios para juegos, sorteos y pruebas.",
      "Los identificadores y valores aleatorios se crean en el navegador con su generador aleatorio criptográfico, así que nada queda guardado en un servidor.",
    ],
    picks: ["generador-qr", "generador-ulid"],
  },
  diseno: {
    en: [
      "The design and color tools help with decisions that affect how a screen looks and reads: WCAG contrast between text and background, OKLCH and hex color conversion, fluid font sizes with CSS clamp(), aspect ratios and screen pixel density.",
      "The contrast checker reports the AA and AAA thresholds of the accessibility guidelines, which is the quickest way to find out whether a color pair is readable for people with low vision.",
    ],
    es: [
      "Las herramientas de diseño y color ayudan con decisiones que afectan cómo se ve y se lee una pantalla: contraste WCAG entre texto y fondo, conversión entre OKLCH y hexadecimal, tamaños de letra fluidos con CSS clamp(), relaciones de aspecto y densidad de píxeles.",
      "El verificador de contraste informa los umbrales AA y AAA de las pautas de accesibilidad, la forma más rápida de saber si una combinación de colores es legible para personas con baja visión.",
    ],
    picks: ["validador-contraste", "convertidor-oklch", "generador-css-clamp", "relacion-aspecto", "ppi-pantalla", "modelador-3d"],
  },
  "herramientas-avanzadas": {
    en: [
      "The advanced tools are full applications that run in the browser: a 3D house modeler to sketch rooms, walls and furniture, and PixeliHub, a pixel art studio with layers, palettes and sprite sheet export.",
      "They need no account or installation. Their interfaces are richer than a single calculator, so each one includes its own guide and examples to get started.",
    ],
    es: [
      "Las herramientas avanzadas son aplicaciones completas que funcionan en el navegador: un modelador de casas 3D para bocetar ambientes, paredes y muebles, y PixeliHub, un estudio de pixel art con capas, paletas y exportación de hojas de sprites.",
      "No piden cuenta ni instalación. Sus interfaces son más completas que una calculadora, por eso cada una incluye su guía y ejemplos para empezar.",
    ],
    picks: ["modelador-casas-3d", "pixelihub"],
  },
  seguridad: {
    en: [
      "The security tools check and generate the pieces of everyday digital hygiene: password strength and entropy, secure random passwords, Luhn check digits for card and ID numbers, and security.txt files for websites.",
      "Passwords typed into these tools are analyzed in the browser and never transmitted. The entropy tools express strength in bits, a more objective measure than a weak or strong label.",
    ],
    es: [
      "Las herramientas de seguridad revisan y generan las piezas de la higiene digital de todos los días: fortaleza y entropía de contraseñas, contraseñas aleatorias seguras, dígitos de control Luhn para tarjetas y documentos, y archivos security.txt para sitios web.",
      "Las contraseñas que se escriben en estas herramientas se analizan en el navegador y nunca se transmiten. Las herramientas de entropía expresan la fortaleza en bits, una medida más objetiva que una etiqueta de débil o fuerte.",
    ],
    picks: ["password-strength", "generador-de-contrasenas", "estimador-entropia-contrasena", "analizador-entropia", "validador-luhn", "generador-security-txt"],
  },
  ciencia: {
    en: [
      "The science tools apply the formulas of physics, electricity and weather to real numbers: Ohm's law and electrical power, work and energy, resistor color codes, dew point, heat index and wind chill.",
      "The guides state the formula behind each result. The heat index, for example, uses the US National Weather Service regression and switches to its simpler formula below 80 °F (about 27 °C), and the tool tells which one it used.",
    ],
    es: [
      "Las herramientas de ciencia aplican las fórmulas de física, electricidad y meteorología a números reales: ley de Ohm y potencia eléctrica, trabajo y energía, código de colores de resistencias, punto de rocío, índice de calor y sensación térmica por viento.",
      "Las guías indican la fórmula de cada resultado. El índice de calor, por ejemplo, usa la regresión del Servicio Meteorológico de Estados Unidos y pasa a su fórmula simple por debajo de 80 °F (unos 27 °C), y la herramienta indica cuál usó.",
    ],
    picks: ["ley-de-ohm", "potencia-electrica", "decodificador-bandas-resistencia", "calculadora-punto-rocio", "calculadora-sensacion-termica", "calculadora-trabajo"],
  },
  productividad: {
    en: [
      "The productivity tools turn small organizational chores into one step: the real cost of a meeting, decimal hours for timesheets, calendar invitations (.ics), contact cards (vCard), WhatsApp chat links and sleep cycle planning.",
      "Files they generate open in standard calendar and contact apps, so the result can be sent or imported right away.",
    ],
    es: [
      "Las herramientas de productividad convierten tareas chicas de organización en un solo paso: el costo real de una reunión, horas en formato decimal para planillas, invitaciones de calendario (.ics), tarjetas de contacto (vCard), enlaces de chat de WhatsApp y planificación de ciclos de sueño.",
      "Los archivos que generan se abren en las aplicaciones habituales de calendario y contactos, así que el resultado se puede enviar o importar enseguida.",
    ],
    picks: ["coste-reunion", "conversor-horas-decimal", "generador-ics", "generador-vcard", "generador-enlace-whatsapp", "ciclos-sueno"],
  },
  educacion: {
    en: [
      "The education tools support studying and teaching: grade point average, attendance percentage, APA 7 citations and quiz builders for primary, secondary and university subjects.",
      "The citation generator follows the APA 7 rules for the most common source types and shows the reference ready to paste into a bibliography.",
    ],
    es: [
      "Las herramientas de educación acompañan el estudio y la enseñanza: promedio de calificaciones, porcentaje de asistencia, citas en formato APA 7 y generadores de cuestionarios para materias de primaria, secundaria y universidad.",
      "El generador de citas sigue las reglas de APA 7 para los tipos de fuente más comunes y muestra la referencia lista para pegar en la bibliografía.",
    ],
    picks: ["generador-cita-apa", "gpa", "calculadora-porcentaje-asistencia"],
  },
  cocina: {
    en: [
      "The cooking tools solve the conversions and ratios that recipes leave out: tablespoons to milliliters, oven to air fryer times, baker's percentages, yeast types, dough water temperature and rice to water ratios.",
      "They are written for home cooks, and their guides explain the rule behind each conversion so the same adjustment can be made next time without the calculator.",
    ],
    es: [
      "Las herramientas de cocina resuelven las conversiones y proporciones que las recetas no explican: cucharadas a mililitros, tiempos de horno a freidora de aire, porcentaje panadero, tipos de levadura, temperatura del agua de la masa y proporción de arroz y agua.",
      "Están pensadas para la cocina de casa, y sus guías explican la regla de cada conversión para poder hacer el mismo ajuste la próxima vez sin calculadora.",
    ],
    picks: ["conversion-cucharadas-ml", "conversor-freidora-aire", "calculadora-porcentaje-panadero", "conversor-levadura", "temperatura-agua-masa", "calculadora-arroz"],
  },
  viajes: {
    en: [
      "The travel tools help plan a trip before leaving: the Schengen 90/180-day rule, fuel use and cost for a route, a sleep schedule to reduce jet lag and conversion between coordinate formats.",
      "The Schengen calculator counts the days in any rolling 180-day window, the rule border officers apply. Its result is an estimate to plan with, not legal advice.",
    ],
    es: [
      "Las herramientas de viajes ayudan a planificar antes de salir: la regla Schengen de 90 días en 180, el consumo y el costo de combustible de un recorrido, un plan de sueño para reducir el jet lag y la conversión entre formatos de coordenadas.",
      "La calculadora Schengen cuenta los días en cualquier ventana móvil de 180 días, que es la regla que aplican los controles fronterizos. Su resultado es una estimación para planificar, no asesoramiento legal.",
    ],
    picks: ["calculadora-schengen", "consumo-viaje", "planificador-jet-lag", "conversor-coordenadas"],
  },
  hogar: {
    en: [
      "The home tools estimate materials before a renovation or garden project: paint, wallpaper rolls, tile adhesive and grout, deck boards, fences, gravel and mulch, caulk and rainwater collection.",
      "The material calculators add a waste margin for cuts and breakage, which helps avoid both a second trip to the store and paying for too many leftovers.",
    ],
    es: [
      "Las herramientas de hogar calculan materiales antes de una reforma o un trabajo de jardín: pintura, rollos de papel pintado, adhesivo y pastina para baldosas, tablas de deck, cercos, grava y mantillo, sellador y recolección de agua de lluvia.",
      "Las calculadoras de materiales suman un margen de desperdicio por cortes y roturas, para evitar tanto un segundo viaje a la tienda como pagar demasiados sobrantes.",
    ],
    picks: ["calculadora-papel-pintado", "calculadora-adhesivo-baldosas", "calculadora-junta-baldosas", "calculadora-deck", "calculadora-valla", "calculadora-agua-lluvia"],
  },
  utilidades: {
    en: [
      "The utilities are quick checks and calculations for everyday paperwork: IBAN and EAN validation, Spanish DNI and NIE letters, Chilean RUT, removing VAT from a price, splitting a bill with the tip, and periodic growth.",
      "The validators run the official check-digit algorithms, so a typo in an account or product number shows up before it causes a failed payment.",
    ],
    es: [
      "Las utilidades son verificaciones y cálculos rápidos para trámites de todos los días: validación de IBAN y EAN, letra del DNI y NIE españoles, RUT chileno, quitar el IVA de un precio, dividir una cuenta con propina y crecimiento periódico.",
      "Los validadores aplican los algoritmos oficiales de dígito de control, así que un error de tipeo en una cuenta o un código de producto aparece antes de causar un pago rechazado.",
    ],
    picks: ["validador-iban", "validador-ean", "letra-dni-nie", "validador-rut-chile", "quitar-iva", "propina-y-cuenta-compartida"],
  },
  salud: {
    en: [
      "The health tools are estimators for common personal metrics: body mass index and sleep cycles based on the typical 90-minute cycle.",
      "They are informative only. The guides explain what each number means and where it falls short (BMI, for instance, does not distinguish muscle from fat), and they do not replace advice from a health professional.",
    ],
    es: [
      "Las herramientas de salud son estimadores de métricas personales habituales: índice de masa corporal y ciclos de sueño basados en el ciclo típico de 90 minutos.",
      "Son solo informativas. Las guías explican qué significa cada número y cuáles son sus límites (el IMC, por ejemplo, no distingue músculo de grasa), y no reemplazan la consulta con un profesional de la salud.",
    ],
    picks: ["calculadora-imc", "calculadora-ciclos-sueno-90"],
  },
};
