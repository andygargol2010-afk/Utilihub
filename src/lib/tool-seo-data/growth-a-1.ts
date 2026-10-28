// TOOL_SEO_OVERRIDES_GROWTH_A part 1 — split out of ../tool-seo-overrides-growth-a.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A_1: Record<string, ToolSeoOverrideGrowth> = {
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

};
