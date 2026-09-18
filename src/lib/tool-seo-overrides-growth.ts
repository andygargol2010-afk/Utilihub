/** Unique SEO for SEO-growth tools (imc, gpa, jwt, etc.). Avoid generic makeTool defaults. */

export type ToolSeoOverrideGrowth = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_GROWTH: Record<string, ToolSeoOverrideGrowth> = {
  imc: {
    metaTitle: "BMI Calculator — Body Mass Index Online | UtiliHub",
    metaTitleEs: "Calculadora de IMC (índice de masa corporal) | UtiliHub",
    metaDescription:
      "Calculate BMI from weight (kg) and height (cm). See underweight, normal, overweight, or obesity categories. Free, private.",
    metaDescriptionEs:
      "Calculá el IMC con peso (kg) y altura (cm). Categorías: bajo peso, normal, sobrepeso u obesidad. Gratis y privado.",
    about: [
      "Body mass index (BMI) is weight in kilograms divided by height in meters squared. It is a screening number, not a full health diagnosis.",
      "This calculator uses the standard WHO adult cut-offs: under 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30+ obesity.",
      "Athletes and older adults can have misleading BMI because muscle and fat distribution differ. Use the result as a starting point, not medical advice.",
    ],
    aboutEs: [
      "El índice de masa corporal (IMC) es el peso en kilogramos dividido por la altura en metros al cuadrado. Es un indicador de cribado, no un diagnóstico.",
      "Usamos los umbrales habituales de la OMS en adultos: menos de 18,5 bajo peso; 18,5–24,9 normal; 25–29,9 sobrepeso; 30 o más obesidad.",
      "En deportistas o personas mayores el IMC puede engañar por la masa muscular. Tomalo como orientación, no como consejo médico.",
    ],
    steps: [
      "Enter weight in kilograms and height in centimeters.",
      "Calculate to get BMI and the category label.",
      "Compare with related tools such as ideal weight if you need more context.",
    ],
    stepsEs: [
      "Ingresá peso en kg y altura en cm.",
      "Calculá para ver el IMC y la categoría.",
      "Si querés más contexto, usá también la calculadora de peso ideal.",
    ],
    faq: [
      {
        q: "Is BMI the same for men and women?",
        a: "The formula is the same. Interpretation categories are usually shared for adults; individual health still depends on many other factors.",
      },
      {
        q: "Do you store my weight?",
        a: "No. The calculation runs in your browser and is not sent to a server for this tool.",
      },
    ],
    faqEs: [
      {
        q: "¿El IMC es igual para hombres y mujeres?",
        a: "La fórmula es la misma. Las categorías de adultos suelen compartirse; la salud individual depende de muchos más factores.",
      },
      {
        q: "¿Guardan mi peso?",
        a: "No. El cálculo corre en tu navegador y no se envía a un servidor en esta herramienta.",
      },
    ],
  },

  "bmr-tdee": {
    metaTitle: "BMR & TDEE Calculator — Mifflin-St Jeor | UtiliHub",
    metaTitleEs: "Calculadora BMR y TDEE (Mifflin-St Jeor) | UtiliHub",
    metaDescription:
      "Estimate basal metabolic rate (BMR) and total daily energy expenditure (TDEE) with Mifflin-St Jeor and an activity factor.",
    metaDescriptionEs:
      "Estimá la tasa metabólica basal (BMR) y el gasto energético diario (TDEE) con Mifflin-St Jeor y un factor de actividad.",
    about: [
      "BMR is an estimate of calories burned at rest. TDEE multiplies BMR by an activity factor (roughly 1.2 sedentary to 1.9 very active).",
      "We use the Mifflin-St Jeor equations, which are widely used for adults: different constants for male and female estimates.",
      "These numbers are planning aids for diet or training logs—not prescriptions. Illness, medication, and body composition can change real needs.",
    ],
    aboutEs: [
      "El BMR estima calorías en reposo. El TDEE multiplica el BMR por un factor de actividad (aprox. 1,2 sedentario a 1,9 muy activo).",
      "Usamos las ecuaciones de Mifflin-St Jeor, habituales en adultos, con constantes distintas según el sexo indicado.",
      "Son ayudas de planificación, no prescripciones. Enfermedad, medicación y composición corporal cambian la necesidad real.",
    ],
    steps: [
      "Enter weight, height, age, sex code, and activity factor.",
      "Read BMR and TDEE in kcal.",
      "Adjust intake targets only with professional guidance when needed.",
    ],
    stepsEs: [
      "Ingresá peso, altura, edad, código de sexo y factor de actividad.",
      "Leé BMR y TDEE en kcal.",
      "Ajustá objetivos de ingesta solo con criterio profesional cuando haga falta.",
    ],
    faq: [
      {
        q: "What activity factor should I use?",
        a: "Common ranges: 1.2 desk job, ~1.55 moderate exercise, up toward 1.75–1.9 for hard training. Pick the closest match.",
      },
      {
        q: "Harris-Benedict vs Mifflin?",
        a: "Mifflin-St Jeor is often preferred for modern adult populations; this tool uses Mifflin.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué factor de actividad uso?",
        a: "Rangos habituales: 1,2 trabajo de escritorio, ~1,55 ejercicio moderado, hasta 1,75–1,9 con entrenamiento duro.",
      },
      {
        q: "¿Harris-Benedict o Mifflin?",
        a: "Mifflin-St Jeor suele preferirse en poblaciones adultas actuales; esta tool usa Mifflin.",
      },
    ],
  },

  gpa: {
    metaTitle: "GPA Calculator — Weighted Grade Point Average | UtiliHub",
    metaTitleEs: "Calculadora de GPA (promedio ponderado) | UtiliHub",
    metaDescription:
      "Compute a credit-weighted GPA from grades and credit hours. Supports a second course entry for quick multi-class averages.",
    metaDescriptionEs:
      "Calculá un GPA ponderado por créditos a partir de notas y horas de crédito. Incluye una segunda materia para promedios rápidos.",
    about: [
      "GPA is usually the sum of (grade × credits) divided by total credits. Scales differ by school (4.0, 5.0, or 0–10); enter grades in the scale your institution uses.",
      "This tool weights each course by its credits so a 4-credit class counts more than a 1-credit seminar.",
      "Always confirm your registrar’s rounding rules—some schools truncate, others round to two or three decimals.",
    ],
    aboutEs: [
      "El GPA suele ser la suma de (nota × créditos) dividida por el total de créditos. La escala depende de la institución (4.0, 5.0 o 0–10).",
      "Esta herramienta pondera cada materia por sus créditos para que un curso de 4 créditos pese más que uno de 1.",
      "Confirmá las reglas de redondeo de tu facultad: algunas truncan y otras redondean a dos o tres decimales.",
    ],
    steps: [
      "Enter grade and credits for each course (optional second pair).",
      "Calculate the weighted GPA.",
      "Compare with your official transcript if numbers differ slightly due to rounding.",
    ],
    stepsEs: [
      "Ingresá nota y créditos de cada materia (segundo par opcional).",
      "Calculá el GPA ponderado.",
      "Compará con el historial oficial si hay pequeñas diferencias de redondeo.",
    ],
    faq: [
      {
        q: "Can I mix 4.0 and percentage grades?",
        a: "No—convert everything to one scale first, or the average is meaningless.",
      },
      {
        q: "Pass/fail courses?",
        a: "Usually excluded from GPA. Only graded courses with credits should be entered here.",
      },
    ],
    faqEs: [
      {
        q: "¿Puedo mezclar escala 4.0 y porcentajes?",
        a: "No: convertí todo a una sola escala primero o el promedio no tiene sentido.",
      },
      {
        q: "¿Cursos aprobado/desaprobado?",
        a: "Suelen quedar fuera del GPA. Solo ingresá materias con nota y créditos.",
      },
    ],
  },

  "generador-qr": {
    metaTitle: "QR Code Generator — Free Text & URL QR | UtiliHub",
    metaTitleEs: "Generador de código QR gratis (texto y URL) | UtiliHub",
    metaDescription:
      "Create a QR code from a URL, Wi‑Fi hint, or plain text. Download-ready image for print and screens.",
    metaDescriptionEs:
      "Creá un código QR a partir de una URL, texto o dato simple. Imagen lista para imprimir o mostrar en pantalla.",
    about: [
      "QR codes store a short string—usually a link, phone number, or plain message—that phones can open with the camera.",
      "Keep payloads short for reliable scanning. Very long URLs or dense text need larger printed size and good contrast.",
      "This generator produces an image you can screenshot or save. For production packaging, test scan distance and print resolution.",
    ],
    aboutEs: [
      "Un código QR guarda una cadena corta—suele ser un enlace, teléfono o mensaje—que el celular abre con la cámara.",
      "Mantené el contenido corto para un escaneo fiable. URLs largas necesitan más tamaño impreso y buen contraste.",
      "El generador produce una imagen que podés guardar. En packaging de producto, probá distancia de lectura y resolución de impresión.",
    ],
    steps: [
      "Paste the text or URL to encode.",
      "Generate the QR image.",
      "Save or print and test with a phone camera.",
    ],
    stepsEs: [
      "Pegá el texto o la URL a codificar.",
      "Generá la imagen QR.",
      "Guardá o imprimí y probá con la cámara del celular.",
    ],
    faq: [
      {
        q: "Dynamic vs static QR?",
        a: "This tool builds a static code for the text you enter. Redirect analytics need a short-link service in front of the URL.",
      },
      {
        q: "Wi‑Fi QR format?",
        a: "Many phones accept WIFI:T:WPA;S:NetworkName;P:password;; as the payload—enter that string if you need a join code.",
      },
    ],
    faqEs: [
      {
        q: "¿QR dinámico o estático?",
        a: "Esta tool genera un código estático con el texto que ingresás. Analítica de redirección requiere un acortador delante de la URL.",
      },
      {
        q: "¿Formato Wi‑Fi?",
        a: "Muchos celulares aceptan WIFI:T:WPA;S:NombreRed;P:clave;; como contenido—usá esa cadena si querés un código para unirse a la red.",
      },
    ],
  },

  "jwt-decoder": {
    metaTitle: "JWT Decoder — Inspect Header & Payload | UtiliHub",
    metaTitleEs: "Decodificador JWT — header y payload | UtiliHub",
    metaDescription:
      "Decode a JSON Web Token to view header and payload claims. Does not verify signatures—for debugging only.",
    metaDescriptionEs:
      "Decodificá un JSON Web Token para ver claims del header y del payload. No verifica firmas: solo depuración.",
    about: [
      "A JWT has three Base64URL parts: header, payload, and signature. This tool decodes the first two so you can inspect claims like sub, exp, and iss.",
      "Signature verification is intentionally omitted. Never paste production secrets or assume a decoded token is trusted.",
      "Decoding happens in the browser. Treat tokens as sensitive: they can include personal data in the payload.",
    ],
    aboutEs: [
      "Un JWT tiene tres partes Base64URL: header, payload y firma. Esta tool decodifica las dos primeras para inspeccionar claims como sub, exp e iss.",
      "La verificación de firma se omite a propósito. No pegues secretos de producción ni asumas que un token decodificado es de confianza.",
      "La decodificación ocurre en el navegador. Tratá los tokens como sensibles: el payload puede incluir datos personales.",
    ],
    steps: [
      "Paste the full JWT string.",
      "Decode header and payload JSON.",
      "Check exp/nbf times and scopes—verify the signature in your backend, not here.",
    ],
    stepsEs: [
      "Pegá el JWT completo.",
      "Decodificá el JSON de header y payload.",
      "Revisá exp/nbf y scopes—verificá la firma en tu backend, no aquí.",
    ],
    faq: [
      {
        q: "Why is the signature not checked?",
        a: "Verification needs the issuer’s secret or public key. A public page must not imply that a decoded token is authentic.",
      },
      {
        q: "Invalid token errors?",
        a: "Usually a truncated string, missing dots, or non-JSON after decode. Copy the token again without line breaks.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué no se verifica la firma?",
        a: "Hace falta el secreto o la clave pública del emisor. Una página pública no debe sugerir que el token decodificado es auténtico.",
      },
      {
        q: "¿Error de token inválido?",
        a: "Suele ser una cadena cortada, sin puntos, o no-JSON al decodificar. Volvé a copiar el token sin saltos de línea.",
      },
    ],
  },

  "numeros-romanos": {
    metaTitle: "Roman Numerals Converter — Arabic ↔ Roman | UtiliHub",
    metaTitleEs: "Conversor de números romanos ↔ arábigos | UtiliHub",
    metaDescription:
      "Convert integers 1–3999 to Roman numerals and back. Supports subtractive notation (IV, IX, XL, CM).",
    metaDescriptionEs:
      "Convertí enteros 1–3999 a números romanos y viceversa. Notación sustractiva (IV, IX, XL, CM).",
    about: [
      "Classical Roman numerals use I, V, X, L, C, D, and M. Subtractive pairs like IV (4) and CM (900) keep strings shorter.",
      "This converter covers 1 through 3999, the usual range for clocks, outlines, and historical dates without overline notation.",
      "Unicode “Roman” characters in some fonts are different symbols—this tool uses plain ASCII letters I–M.",
    ],
    aboutEs: [
      "Los números romanos clásicos usan I, V, X, L, C, D y M. Pares sustractivos como IV (4) y CM (900) acortan la escritura.",
      "El conversor cubre del 1 al 3999, el rango habitual en relojes, índices y fechas históricas sin notación con barra.",
      "Algunas fuentes usan caracteres Unicode distintos; aquí se usan letras ASCII I–M.",
    ],
    steps: [
      "Enter an Arabic number or a Roman string.",
      "Choose mode (to Roman or to Arabic).",
      "Read the conversion result.",
    ],
    stepsEs: [
      "Ingresá un número arábigo o una cadena romana.",
      "Elegí el modo (a romano o a arábigo).",
      "Leé el resultado de la conversión.",
    ],
    faq: [
      {
        q: "Why stop at 3999?",
        a: "Larger values traditionally need overlines or other marks not standardized in plain text.",
      },
      {
        q: "Is IIII valid for 4?",
        a: "Clocks sometimes use IIII, but standard written form is IV. This tool follows the standard subtractive form.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué hasta 3999?",
        a: "Valores mayores suelen requerir barras u otras marcas poco estables en texto plano.",
      },
      {
        q: "¿IIII vale para el 4?",
        a: "En relojes a veces se usa IIII, pero la forma escrita estándar es IV. Esta tool sigue la forma sustractiva.",
      },
    ],
  },

  fracciones: {
    metaTitle: "Fraction Calculator — Add Subtract Multiply Divide | UtiliHub",
    metaTitleEs: "Calculadora de fracciones — suma resta producto cociente | UtiliHub",
    metaDescription:
      "Add, subtract, multiply, or divide two fractions and simplify the result to lowest terms.",
    metaDescriptionEs:
      "Sumá, restá, multiplicá o dividí dos fracciones y simplificá el resultado a términos mínimos.",
    about: [
      "Fraction arithmetic uses common denominators for addition/subtraction and cross-multiplication rules for products and quotients.",
      "Results are reduced with the greatest common divisor so 2/4 becomes 1/2 automatically.",
      "Useful for homework checks, recipe scaling, and quick ratios without a full CAS.",
    ],
    aboutEs: [
      "La aritmética de fracciones usa denominadores comunes en suma/resta y reglas de producto y cociente.",
      "El resultado se reduce con el máximo común divisor: 2/4 pasa a 1/2.",
      "Sirve para deberes, recetas y ratios rápidos sin un sistema algebraico completo.",
    ],
    steps: [
      "Enter numerators and denominators for both fractions.",
      "Choose the operation code (add, subtract, multiply, divide).",
      "Read the simplified fraction and decimal form.",
    ],
    stepsEs: [
      "Ingresá numeradores y denominadores de ambas fracciones.",
      "Elegí la operación (suma, resta, producto, división).",
      "Leé la fracción simplificada y su forma decimal.",
    ],
    faq: [
      {
        q: "Zero denominators?",
        a: "They are rejected. A fraction must have a non-zero denominator.",
      },
      {
        q: "Mixed numbers?",
        a: "Convert mixed numbers to improper fractions first (e.g. 1 1/2 → 3/2).",
      },
    ],
    faqEs: [
      {
        q: "¿Denominador cero?",
        a: "Se rechaza. Toda fracción necesita denominador distinto de cero.",
      },
      {
        q: "¿Números mixtos?",
        a: "Convertí primero a fracción impropia (p. ej. 1 1/2 → 3/2).",
      },
    ],
  },

  "relacion-aspecto": {
    metaTitle: "Aspect Ratio Calculator — Simplify Width × Height | UtiliHub",
    metaTitleEs: "Calculadora de relación de aspecto | UtiliHub",
    metaDescription:
      "Reduce pixel dimensions to the simplest ratio (e.g. 1920×1080 → 16:9) and show the decimal aspect.",
    metaDescriptionEs:
      "Reducí dimensiones en píxeles a la razón más simple (p. ej. 1920×1080 → 16:9) y el aspecto decimal.",
    about: [
      "Aspect ratio is width divided by height. Designers and video editors talk about 16:9, 4:3, 1:1, and 9:16 vertical.",
      "We simplify integer sides with the GCD so 1280×720 becomes 16:9, matching common video standards.",
      "Cropping to a new ratio changes composition; this tool only describes the ratio of the numbers you enter.",
    ],
    aboutEs: [
      "La relación de aspecto es ancho entre alto. En diseño y video se habla de 16:9, 4:3, 1:1 y 9:16 vertical.",
      "Simplificamos enteros con el MCD: 1280×720 pasa a 16:9, el estándar de video más común.",
      "Recortar a otra ratio cambia la composición; esta tool solo describe la razón de los números que ingresás.",
    ],
    steps: [
      "Enter width and height in pixels.",
      "Calculate the reduced ratio and decimal value.",
      "Match the ratio when exporting video or designing frames.",
    ],
    stepsEs: [
      "Ingresá ancho y alto en píxeles.",
      "Calculá la razón reducida y el valor decimal.",
      "Usá esa ratio al exportar video o diseñar marcos.",
    ],
    faq: [
      {
        q: "Non-integer sizes?",
        a: "Enter whole pixels for a clean ratio; fractional CSS sizes still have an effective aspect as width/height.",
      },
      {
        q: "Letterboxing?",
        a: "If content and frame ratios differ, black bars appear. Match ratios or crop to avoid them.",
      },
    ],
    faqEs: [
      {
        q: "¿Tamaños no enteros?",
        a: "Para una razón limpia usá píxeles enteros; en CSS el aspecto efectivo sigue siendo ancho/alto.",
      },
      {
        q: "¿Letterbox?",
        a: "Si el contenido y el marco tienen distinta ratio aparecen bandas. Igualá ratios o recortá.",
      },
    ],
  },

  "peso-ideal": {
    metaTitle: "Ideal Weight Calculator — Devine & Hamwi | UtiliHub",
    metaTitleEs: "Calculadora de peso ideal (Devine y Hamwi) | UtiliHub",
    metaDescription:
      "Estimate ideal body weight from height and sex using Devine and Hamwi formulas. Screening aid only.",
    metaDescriptionEs:
      "Estimá el peso ideal según altura y sexo con las fórmulas de Devine y Hamwi. Solo orientación.",
    about: [
      "Ideal-weight formulas were built for dosing and insurance tables, not as a single “correct” body weight for everyone.",
      "Devine and Hamwi start from a baseline weight at a reference height and add kilograms per inch above that height, with different baselines by sex.",
      "Frame size, muscle, and medical context matter more than any single formula. Pair with BMI for a broader picture.",
    ],
    aboutEs: [
      "Las fórmulas de peso ideal nacieron para dosis y tablas de seguros, no como un único peso “correcto” para todos.",
      "Devine y Hamwi parten de un peso base a una altura de referencia y suman kg por pulgada por encima, con bases distintas según el sexo.",
      "La complexión, el músculo y el contexto médico importan más que una sola fórmula. Combiná con el IMC para una visión más amplia.",
    ],
    steps: [
      "Enter height in cm and sex code.",
      "Read Devine and approximate Hamwi estimates in kg.",
      "Treat results as ranges for discussion, not targets without a clinician.",
    ],
    stepsEs: [
      "Ingresá altura en cm y código de sexo.",
      "Leé las estimaciones Devine y Hamwi en kg.",
      "Tomá los resultados como rangos de conversación, no como metas sin criterio clínico.",
    ],
    faq: [
      {
        q: "Why two formulas?",
        a: "They use slightly different baselines; showing both underlines that “ideal weight” is an estimate band.",
      },
      {
        q: "Children?",
        a: "These adult formulas are not appropriate for pediatric growth charts.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué dos fórmulas?",
        a: "Usan bases un poco distintas; mostrar ambas deja claro que el “peso ideal” es una franja estimada.",
      },
      {
        q: "¿Niños?",
        a: "Estas fórmulas de adultos no sirven para curvas de crecimiento pediátricas.",
      },
    ],
  },

  "fecha-parto": {
    metaTitle: "Due Date Calculator — Naegele from LMP | UtiliHub",
    metaTitleEs: "Calculadora de fecha de parto (regla de Naegele) | UtiliHub",
    metaDescription:
      "Estimate the due date from the first day of the last menstrual period by adding 280 days (Naegele’s rule).",
    metaDescriptionEs:
      "Estimá la fecha probable de parto desde el primer día de la última menstruación sumando 280 días (regla de Naegele).",
    about: [
      "Naegele’s rule approximates the estimated due date (EDD) as about 280 days after the first day of the last menstrual period (LMP).",
      "Ultrasound dating can revise the EDD. Cycle length, ovulation timing, and medical history all affect accuracy.",
      "This is a calendar helper only—not prenatal care. Confirm dates with a qualified clinician.",
    ],
    aboutEs: [
      "La regla de Naegele aproxima la fecha probable de parto (FPP) como unos 280 días después del primer día de la última menstruación (FUM).",
      "La ecografía puede corregir la FPP. La duración del ciclo, la ovulación y la historia clínica influyen en la precisión.",
      "Es solo una ayuda de calendario, no control prenatal. Confirmá fechas con un profesional de la salud.",
    ],
    steps: [
      "Enter the LMP date as YYYY-MM-DD.",
      "Calculate the estimated due date (+280 days).",
      "Bring the estimate to your care provider for confirmation.",
    ],
    stepsEs: [
      "Ingresá la FUM como AAAA-MM-DD.",
      "Calculá la FPP estimada (+280 días).",
      "Llevá la estimación a tu profesional de salud para confirmarla.",
    ],
    faq: [
      {
        q: "What if cycles are irregular?",
        a: "LMP-based dates are less reliable; ultrasound is usually preferred for dating.",
      },
      {
        q: "Conception date instead?",
        a: "If you know conception timing, clinicians may date from that event rather than LMP—this tool follows the LMP+280 convention.",
      },
    ],
    faqEs: [
      {
        q: "¿Ciclos irregulares?",
        a: "Las fechas por FUM son menos fiables; suele preferirse la ecografía para datar.",
      },
      {
        q: "¿Fecha de concepción?",
        a: "Si se conoce la concepción, el equipo médico puede datar desde ahí; esta tool sigue FUM+280.",
      },
    ],
  },

  "ciclos-sueno": {
    metaTitle: "Sleep Cycle Calculator — 90-Minute Bedtimes | UtiliHub",
    metaTitleEs: "Calculadora de ciclos de sueño (90 minutos) | UtiliHub",
    metaDescription:
      "Work backward from a wake-up time to suggested bedtimes on 90-minute sleep cycles, with a short wind-down buffer.",
    metaDescriptionEs:
      "A partir de la hora de despertar, sugerí horarios para dormir en ciclos de 90 minutos, con un margen breve para conciliar el sueño.",
    about: [
      "Many popular sleep guides group rest into ~90-minute cycles. Waking near the end of a cycle can feel easier than waking mid-cycle.",
      "This calculator subtracts whole cycles plus a short fall-asleep buffer from your target wake time.",
      "Individual sleep architecture varies. Use the times as experiments, not rigid medical rules.",
    ],
    aboutEs: [
      "Muchas guías agrupan el sueño en ciclos de ~90 minutos. Despertar cerca del final de un ciclo suele sentirse mejor que a mitad del ciclo.",
      "La calculadora resta ciclos enteros más un margen breve para quedarte dormido desde la hora de despertar.",
      "La arquitectura del sueño varía. Usá los horarios como prueba, no como regla médica rígida.",
    ],
    steps: [
      "Enter wake-up time as HH:MM.",
      "Review suggested bedtimes for 3–6 cycles.",
      "Pick the slot that fits your evening and test it for a few nights.",
    ],
    stepsEs: [
      "Ingresá la hora de despertar como HH:MM.",
      "Revisá horarios sugeridos para 3–6 ciclos.",
      "Elegí el que encaje en tu noche y probalo unos días.",
    ],
    faq: [
      {
        q: "Why include a 15-minute buffer?",
        a: "Most people need a few minutes to fall asleep; pure cycle math without a buffer is often too optimistic.",
      },
      {
        q: "Naps?",
        a: "Short naps are a different pattern. This tool targets overnight timing relative to a fixed wake time.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué 15 minutos de margen?",
        a: "Casi todos tardan unos minutos en dormirse; la cuenta pura de ciclos suele ser demasiado optimista.",
      },
      {
        q: "¿Siestas?",
        a: "Las siestas cortas son otro patrón. Esta tool apunta al horario nocturno respecto de una hora fija de despertar.",
      },
    ],
  },

  "pago-tarjeta-credito": {
    metaTitle: "Credit Card Payoff Calculator — Months & Interest | UtiliHub",
    metaTitleEs: "Calculadora de pago de tarjeta de crédito | UtiliHub",
    metaDescription:
      "Estimate how many months and how much interest you pay to clear a revolving balance at a fixed monthly payment and APR.",
    metaDescriptionEs:
      "Estimá en cuántos meses y con cuánto interés cancelás un saldo rotativo con pago mensual fijo y tasa anual.",
    about: [
      "Credit cards charge interest on revolving balances. A fixed payment must exceed the monthly interest or the balance never falls.",
      "We simulate month-by-month interest accrual and payments until the balance is cleared (or a safety month cap is hit).",
      "Fees, promotional rates, and minimum-payment rules differ by issuer—treat the output as a planning model.",
    ],
    aboutEs: [
      "Las tarjetas cobran interés sobre el saldo rotativo. El pago fijo debe superar el interés mensual o el saldo no baja.",
      "Simulamos mes a mes el interés y los pagos hasta liquidar el saldo (o alcanzar un tope de seguridad de meses).",
      "Comisiones, tasas promocionales y mínimos varían por emisor: tomá el resultado como modelo de planificación.",
    ],
    steps: [
      "Enter current balance, annual rate %, and monthly payment.",
      "Calculate months to payoff and total interest.",
      "Try a higher payment to see interest saved.",
    ],
    stepsEs: [
      "Ingresá saldo, tasa anual % y pago mensual.",
      "Calculá meses hasta cancelar e interés total.",
      "Probá un pago mayor para ver el interés ahorrado.",
    ],
    faq: [
      {
        q: "Payment too low error?",
        a: "If the payment is less than or equal to the first month’s interest, the balance grows. Raise the payment.",
      },
      {
        q: "Daily vs monthly compounding?",
        a: "This model uses a simple monthly rate (APR/12). Card statements may use daily balances; results can differ slightly.",
      },
    ],
    faqEs: [
      {
        q: "¿Error de pago demasiado bajo?",
        a: "Si el pago es menor o igual al interés del primer mes, el saldo crece. Subí el pago.",
      },
      {
        q: "¿Interés diario o mensual?",
        a: "El modelo usa tasa mensual simple (TEA/12). Los resúmenes pueden usar saldo diario; puede haber pequeñas diferencias.",
      },
    ],
  },

  "cron-generator": {
    metaTitle: "Cron Expression Helper — Common Schedules | UtiliHub",
    metaTitleEs: "Ayuda de expresiones cron — horarios comunes | UtiliHub",
    metaDescription:
      "Generate common five-field cron expressions: hourly, daily, weekly, and every 15 minutes—with plain-language descriptions.",
    metaDescriptionEs:
      "Generá expresiones cron de cinco campos habituales: cada hora, diario, semanal y cada 15 minutos—con descripción en lenguaje claro.",
    about: [
      "Classic cron uses five fields: minute, hour, day of month, month, and day of week. Schedulers like crontab and many CI systems share this shape.",
      "Presets cover frequent cases so you avoid off-by-one mistakes when writing expressions by hand.",
      "Always confirm your runtime’s timezone and whether Sunday is 0 or 7—platforms differ.",
    ],
    aboutEs: [
      "El cron clásico usa cinco campos: minuto, hora, día del mes, mes y día de la semana. Crontab y muchos CI comparten esa forma.",
      "Los presets cubren casos frecuentes para evitar errores al escribir a mano.",
      "Confirmá la zona horaria del runtime y si el domingo es 0 o 7: las plataformas difieren.",
    ],
    steps: [
      "Pick a preset code (hourly, daily, Monday 9am, every 15 minutes).",
      "Copy the cron expression.",
      "Paste into crontab or your scheduler and test.",
    ],
    stepsEs: [
      "Elegí un preset (cada hora, diario, lunes 9am, cada 15 min).",
      "Copiá la expresión cron.",
      "Pegala en crontab o tu programador y probá.",
    ],
    faq: [
      {
        q: "Six-field cron?",
        a: "Some systems add seconds as a sixth field. These presets are the traditional five-field form.",
      },
      {
        q: "Day-of-week vs day-of-month?",
        a: "When both are restricted, behavior depends on the daemon (OR vs AND). Prefer simple presets when unsure.",
      },
    ],
    faqEs: [
      {
        q: "¿Cron de seis campos?",
        a: "Algunos sistemas agregan segundos. Estos presets son la forma tradicional de cinco campos.",
      },
      {
        q: "¿Día de semana y día del mes?",
        a: "Si ambos están restringidos, el comportamiento depende del demonio (OR vs AND). Preferí presets simples si dudás.",
      },
    ],
  },

  "calculadora-subnet": {
    metaTitle: "Subnet Calculator — CIDR Network & Broadcast | UtiliHub",
    metaTitleEs: "Calculadora de subred CIDR — red y broadcast | UtiliHub",
    metaDescription:
      "From an IPv4 address and CIDR prefix, compute network, broadcast, host count, and subnet mask.",
    metaDescriptionEs:
      "A partir de una IPv4 y un prefijo CIDR, calculá red, broadcast, cantidad de hosts y máscara de subred.",
    about: [
      "CIDR notation (e.g. 192.168.1.10/24) pairs an address with a prefix length that defines the network mask.",
      "We derive network address, broadcast, usable host count, and dotted mask using standard 32-bit arithmetic.",
      "IPv6 is not covered here. Double-check lab ranges before applying changes on production routers.",
    ],
    aboutEs: [
      "La notación CIDR (p. ej. 192.168.1.10/24) une una dirección con un prefijo que define la máscara de red.",
      "Obtenemos dirección de red, broadcast, hosts utilizables y máscara en decimal con aritmética de 32 bits.",
      "IPv6 no está cubierto. Verificá rangos de laboratorio antes de cambiar routers en producción.",
    ],
    steps: [
      "Enter IPv4 and prefix length (0–32).",
      "Calculate network, broadcast, hosts, and mask.",
      "Use the network/mask pair in routing or DHCP scope design.",
    ],
    stepsEs: [
      "Ingresá IPv4 y longitud de prefijo (0–32).",
      "Calculá red, broadcast, hosts y máscara.",
      "Usá el par red/máscara en enrutamiento o scopes DHCP.",
    ],
    faq: [
      {
        q: "/31 and /32 host counts?",
        a: "Point-to-point /31 and host routes /32 have special host counting rules; this tool reports 0 usable hosts for prefix ≥ 31.",
      },
      {
        q: "Private ranges?",
        a: "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 are private. The calculator does not restrict them.",
      },
    ],
    faqEs: [
      {
        q: "¿Hosts en /31 y /32?",
        a: "Los enlaces punto a punto /31 y las rutas de host /32 tienen reglas especiales; aquí se reportan 0 hosts utilizables si el prefijo ≥ 31.",
      },
      {
        q: "¿Rangos privados?",
        a: "10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16 son privados. La calculadora no los bloquea.",
      },
    ],
  },

  "tiempo-lectura": {
    metaTitle: "Reading Time Calculator — Words to Minutes | UtiliHub",
    metaTitleEs: "Calculadora de tiempo de lectura | UtiliHub",
    metaDescription:
      "Estimate how long a passage takes to read from word count or pasted text, using a customizable words-per-minute rate.",
    metaDescriptionEs:
      "Estimá cuánto tarda un texto en leerse según palabras o texto pegado, con palabras por minuto configurables.",
    about: [
      "Reading-time widgets usually divide word count by a speed such as 200–250 words per minute for adult silent reading.",
      "Paste full text or enter a raw word count. Adjust WPM for technical material (slower) or skimming (faster).",
      "Screen density, language, and images change real duration—this is a planning estimate for blogs and docs.",
    ],
    aboutEs: [
      "Los widgets de tiempo de lectura dividen las palabras por una velocidad típica de 200–250 ppm en lectura silenciosa adulta.",
      "Pegá el texto o un número de palabras. Bajá el PPM en material técnico y subilo si solo se hojea.",
      "Pantalla, idioma e imágenes cambian la duración real: es una estimación para blogs y documentación.",
    ],
    steps: [
      "Paste text or enter a word count.",
      "Optionally set words per minute (default 200).",
      "Read the estimated duration.",
    ],
    stepsEs: [
      "Pegá texto o un número de palabras.",
      "Opcionalmente definí palabras por minuto (200 por defecto).",
      "Leé la duración estimada.",
    ],
    faq: [
      {
        q: "Spoken vs silent rate?",
        a: "Speaking is often ~130–150 WPM. Use a lower rate if the content will be read aloud.",
      },
      {
        q: "Markdown and code?",
        a: "Word split is whitespace-based; dense code may count differently than prose.",
      },
    ],
    faqEs: [
      {
        q: "¿Lectura en voz alta?",
        a: "Hablar suele ir a ~130–150 ppm. Usá una tasa menor si el contenido se lee en voz alta.",
      },
      {
        q: "¿Markdown y código?",
        a: "El conteo separa por espacios; el código denso puede contar distinto que la prosa.",
      },
    ],
  },

  "validador-luhn": {
    metaTitle: "Luhn Algorithm Checker — Check Digit Validator | UtiliHub",
    metaTitleEs: "Validador del algoritmo de Luhn | UtiliHub",
    metaDescription:
      "Validate a digit sequence with the Luhn (mod 10) check digit algorithm. Local only—does not contact payment networks.",
    metaDescriptionEs:
      "Validá una secuencia de dígitos con el algoritmo de Luhn (módulo 10). Solo local: no contacta redes de pago.",
    about: [
      "The Luhn algorithm detects simple typos in identification numbers. Many card numbers and IMEIs use a check digit based on it.",
      "A passing Luhn check does not prove a number is issued, funded, or authorized—only that the checksum matches.",
      "All validation runs locally. Do not enter live card data on untrusted devices.",
    ],
    aboutEs: [
      "El algoritmo de Luhn detecta errores de tipeo en números de identificación. Muchas tarjetas e IMEI usan un dígito de control basado en él.",
      "Pasar Luhn no prueba que el número esté emitido, con fondos o autorizado: solo que el checksum coincide.",
      "Toda la validación es local. No ingreses datos de tarjetas reales en dispositivos no confiables.",
    ],
    steps: [
      "Enter digits only (spaces are ignored).",
      "Run the Luhn check.",
      "Use the result as a format check, not as payment authorization.",
    ],
    stepsEs: [
      "Ingresá solo dígitos (los espacios se ignoran).",
      "Ejecutá la verificación Luhn.",
      "Usá el resultado como control de formato, no como autorización de pago.",
    ],
    faq: [
      {
        q: "Why did a real-looking number fail?",
        a: "Random digits fail about 90% of the time. Only sequences designed with a valid check digit pass.",
      },
      {
        q: "Is this PCI compliant storage?",
        a: "No storage occurs in the tool itself, but your environment still must follow your own security policies.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué falla un número “realista”?",
        a: "Dígitos al azar fallan ~90% de las veces. Solo pasan secuencias diseñadas con dígito de control válido.",
      },
      {
        q: "¿Es almacenamiento PCI?",
        a: "La tool no guarda datos, pero tu entorno debe cumplir tus propias políticas de seguridad.",
      },
    ],
  },

  "punto-equilibrio-unidades": {
    metaTitle: "Break-Even Units Calculator — Fixed vs Variable Cost | UtiliHub",
    metaTitleEs: "Calculadora de punto de equilibrio en unidades | UtiliHub",
    metaDescription:
      "Find how many units you must sell to cover fixed costs given price and variable cost per unit.",
    metaDescriptionEs:
      "Calculá cuántas unidades debés vender para cubrir costos fijos dado el precio y el costo variable unitario.",
    about: [
      "Break-even units equal fixed costs divided by contribution margin (price minus variable cost per unit).",
      "If margin is zero or negative, there is no finite break-even—each sale loses money on variable cost alone.",
      "This unit model is simpler than full investment break-even tools; it focuses on quantity planning for a single product.",
    ],
    aboutEs: [
      "Las unidades de equilibrio son costos fijos divididos por el margen de contribución (precio menos costo variable unitario).",
      "Si el margen es cero o negativo no hay equilibrio finito: cada venta pierde solo por el costo variable.",
      "Este modelo de unidades es más simple que el break-even de inversión: apunta a planificar cantidad de un producto.",
    ],
    steps: [
      "Enter fixed costs, selling price, and variable cost per unit.",
      "Calculate break-even units (rounded up for whole units).",
      "Stress-test with lower prices or higher fixed costs.",
    ],
    stepsEs: [
      "Ingresá costos fijos, precio de venta y costo variable unitario.",
      "Calculá las unidades de equilibrio (redondeo hacia arriba).",
      "Probá escenarios con menor precio o mayores fijos.",
    ],
    faq: [
      {
        q: "Taxes and inventory?",
        a: "Not included. Extend the model in a spreadsheet if tax or stock constraints matter.",
      },
      {
        q: "Multiple products?",
        a: "Use a weighted average margin or separate break-evens per product line.",
      },
    ],
    faqEs: [
      {
        q: "¿Impuestos e inventario?",
        a: "No están incluidos. Extendé el modelo en una planilla si importan.",
      },
      {
        q: "¿Varios productos?",
        a: "Usá un margen promedio ponderado o un equilibrio por línea de producto.",
      },
    ],
  },

  "mpg-a-litros": {
    metaTitle: "MPG to L/100km Converter — Fuel Economy | UtiliHub",
    metaTitleEs: "Conversor MPG ↔ L/100 km — consumo de combustible | UtiliHub",
    metaDescription:
      "Convert US miles per gallon to liters per 100 kilometers and the reverse for vehicle fuel economy labels.",
    metaDescriptionEs:
      "Convertí millas por galón (EE.UU.) a litros cada 100 km y al revés, para etiquetas de consumo de vehículos.",
    about: [
      "US fuel economy is often stated in MPG; many other regions use L/100 km. The values are inverse-related, not a linear scale.",
      "We use the standard factor ≈ 235.215 to convert between US MPG and L/100 km.",
      "Imperial (UK) gallons differ from US gallons—this tool uses the US definition common on many online specs.",
    ],
    aboutEs: [
      "En EE.UU. el consumo suele ir en MPG; en otras regiones en L/100 km. Son magnitudes inversas, no una escala lineal.",
      "Usamos el factor estándar ≈ 235,215 entre MPG (EE.UU.) y L/100 km.",
      "El galón imperial (UK) no es el de EE.UU.: esta tool usa la definición estadounidense.",
    ],
    steps: [
      "Enter the fuel-economy value.",
      "Choose direction: MPG→L/100 or L/100→MPG.",
      "Read the converted figure for comparison shopping.",
    ],
    stepsEs: [
      "Ingresá el valor de consumo.",
      "Elegí dirección: MPG→L/100 o L/100→MPG.",
      "Leé la cifra convertida para comparar vehículos.",
    ],
    faq: [
      {
        q: "Higher MPG or lower L/100?",
        a: "Both mean better efficiency. 30 MPG is more efficient than 20 MPG; 6 L/100 is more efficient than 9 L/100.",
      },
      {
        q: "City vs highway?",
        a: "Labels often split cycles. Convert each rating separately.",
      },
    ],
    faqEs: [
      {
        q: "¿Más MPG o menos L/100?",
        a: "Ambos indican mejor eficiencia. 30 MPG es mejor que 20; 6 L/100 es mejor que 9.",
      },
      {
        q: "¿Ciudad o ruta?",
        a: "Las etiquetas suelen separar ciclos. Convertí cada valor por separado.",
      },
    ],
  },

  "ppi-pantalla": {
    metaTitle: "PPI Calculator — Pixels Per Inch from Diagonal | UtiliHub",
    metaTitleEs: "Calculadora de PPI de pantalla | UtiliHub",
    metaDescription:
      "Compute screen pixel density (PPI) from resolution width, height, and diagonal size in inches.",
    metaDescriptionEs:
      "Calculá la densidad de píxeles (PPI) a partir de la resolución y la diagonal en pulgadas.",
    about: [
      "Pixels per inch measures how densely pixels are packed on a diagonal-specified panel. Higher PPI generally looks sharper at the same viewing distance.",
      "PPI = √(width² + height²) / diagonal_inches using the resolution’s pixel counts.",
      "Marketing “Retina” claims depend on viewing distance; use PPI as a neutral comparison between monitors and phones.",
    ],
    aboutEs: [
      "Los píxeles por pulgada miden qué tan juntos están los píxeles en un panel definido por su diagonal. Más PPI suele verse más nítido a igual distancia.",
      "PPI = √(ancho² + alto²) / diagonal_en_pulgadas usando la resolución en píxeles.",
      "Las promesas tipo “Retina” dependen de la distancia de visionado; usá el PPI como comparación neutral entre monitores y celulares.",
    ],
    steps: [
      "Enter width px, height px, and diagonal inches.",
      "Calculate PPI.",
      "Compare panels before buying or designing UI assets.",
    ],
    stepsEs: [
      "Ingresá ancho px, alto px y diagonal en pulgadas.",
      "Calculá el PPI.",
      "Compará paneles antes de comprar o diseñar assets de UI.",
    ],
    faq: [
      {
        q: "Logical vs physical pixels?",
        a: "Use the panel’s native resolution, not CSS CSS-px after scaling, for hardware PPI.",
      },
      {
        q: "Ultrawide screens?",
        a: "The same formula applies; extreme aspect ratios still use the pixel diagonal over the stated inch size.",
      },
    ],
    faqEs: [
      {
        q: "¿Píxeles lógicos o físicos?",
        a: "Usá la resolución nativa del panel, no los CSS-px tras el escalado, para el PPI de hardware.",
      },
      {
        q: "¿Pantallas ultrawide?",
        a: "Vale la misma fórmula; ratios extremos siguen usando la diagonal en píxeles sobre las pulgadas indicadas.",
      },
    ],
  },

  "crecimiento-periodico": {
    metaTitle: "Periodic Savings Calculator — Daily or Weekly Adds | UtiliHub",
    metaTitleEs: "Calculadora de ahorro periódico (diario o semanal) | UtiliHub",
    metaDescription:
      "Project a simple total if you add a fixed amount every day or every week for a number of years, plus a starting balance.",
    metaDescriptionEs:
      "Proyectá un total simple si sumás un monto fijo cada día o cada semana durante varios años, más un saldo inicial.",
    about: [
      "This model is linear contribution math: start + contribution × number of periods. It does not apply compound interest (use the compound-interest tool for that).",
      "Daily mode uses 365 periods per year; weekly mode uses 52. Leap days and exact calendar weeks are ignored for simplicity.",
      "Good for “what if I put aside $X a day” planning before you layer returns or inflation.",
    ],
    aboutEs: [
      "El modelo es lineal: inicio + aporte × cantidad de períodos. No aplica interés compuesto (para eso está la tool de interés compuesto).",
      "El modo diario usa 365 períodos por año; el semanal, 52. Se ignoran años bisiestos y semanas exactas por simplicidad.",
      "Sirve para planear “¿y si aparto $X al día?” antes de sumar rendimientos o inflación.",
    ],
    steps: [
      "Enter contribution, frequency, years, and optional starting balance.",
      "Project the total contributions and end balance.",
      "Compare with compound-interest tools if you earn a return.",
    ],
    stepsEs: [
      "Ingresá aporte, frecuencia, años y saldo inicial opcional.",
      "Proyectá aportes totales y saldo final.",
      "Compará con herramientas de interés compuesto si hay rendimiento.",
    ],
    faq: [
      {
        q: "Why not compound here?",
        a: "Keeping contributions separate from returns avoids mixing two questions. Stack tools when you need both.",
      },
      {
        q: "Monthly contributions?",
        a: "Approximate with weekly or scale the daily amount; a dedicated monthly compound tool covers rate-based growth.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué sin interés compuesto?",
        a: "Separar aportes de rendimientos evita mezclar dos preguntas. Combiná tools cuando necesites ambas.",
      },
      {
        q: "¿Aportes mensuales?",
        a: "Aproximá con semanal o escalá el monto diario; una tool de compuesto mensual cubre el crecimiento con tasa.",
      },
    ],
  },
};
