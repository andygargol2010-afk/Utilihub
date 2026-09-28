/** SEO-growth overrides part a. */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A: Record<string, ToolSeoOverrideGrowth> = {
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
};
