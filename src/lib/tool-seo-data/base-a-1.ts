// TOOL_SEO_OVERRIDES_BASE_A part 1 — split out of ../tool-seo-overrides-base-a.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBase } from "../tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_A_1: Record<string, ToolSeoOverrideBase> = {
  "propina-y-cuenta-compartida": {
    metaTitle: "Tip Calculator — Split the Bill Online | UtiliHub",
    metaTitleEs: "Calculadora de propina y cuenta compartida | UtiliHub",
    metaDescription:
      "Free tip calculator and bill splitter. Add tip percent, divide by number of people, see total and per person. No signup.",
    metaDescriptionEs:
      "Calculadora de propina gratis. Sumá el porcentaje, dividí por personas y mirá el total por cabeza. Sin registro.",
    about: [
      "A tip calculator turns a restaurant or service bill into a clear total and a fair split. You enter the bill amount, choose a tip percentage, and optionally how many people are paying.",
      "Useful defaults vary by country and service quality (often 10–20%). This tool does the arithmetic in your browser so you can adjust the percent or party size before you pay.",
      "It does not include tax rules for every region—if tax is already on the bill, tip on the amount your group agrees on (pre-tax or post-tax) and use the result as a guide.",
    ],
    aboutEs: [
      "Una calculadora de propina convierte la cuenta en un total claro y un reparto justo. Ingresás el monto, elegís el porcentaje y, si querés, cuántas personas pagan.",
      "Los usos habituales van del 10 al 20% según el país y el servicio. La cuenta se hace en tu navegador para que ajustes el % o el grupo antes de pagar.",
      "No aplica impuestos de cada región: si el tax ya está en la cuenta, propiná sobre el monto que acuerden y usá el resultado como guía.",
    ],
    steps: [
      "Enter the bill total.",
      "Choose a tip percentage (or try a few).",
      "Set how many people share the bill.",
      "Read total with tip and amount per person.",
    ],
    stepsEs: [
      "Ingresá el total de la cuenta.",
      "Elegí el porcentaje de propina (o probá varios).",
      "Indicá cuántas personas comparten la cuenta.",
      "Leé el total con propina y el monto por persona.",
    ],
    faq: [
      {
        q: "Should I tip on tax?",
        a: "Customs differ. Some people tip on the pre-tax subtotal; others on the final total. Agree with your group and enter that base amount here.",
      },
      {
        q: "What if one person ordered more?",
        a: "This tool splits evenly. For uneven shares, calculate a personal subtotal first, then run the tip on that amount.",
      },
    ],
    faqEs: [
      {
        q: "¿Propina sobre el impuesto?",
        a: "Depende de la costumbre. Algunos propinan sobre el subtotal sin tax; otros sobre el total final. Acordalo en el grupo e ingresá esa base acá.",
      },
      {
        q: "¿Y si uno consumió más?",
        a: "Esta herramienta reparte en partes iguales. Si el consumo fue desigual, calculá un subtotal personal y después la propina sobre ese monto.",
      },
    ],
  },

  "calculadora-propina-impuesto": {
    metaTitleEs: "Calculadora de propina e impuesto — total de la cuenta | UtiliHub",
    metaDescriptionEs:
      "Calculá la propina, el impuesto y el total a pagar a partir del subtotal, el % de impuesto y el % de propina. Gratis, en el navegador, sin registro.",
    about: [],
    steps: [],
    faq: [],
    faqEs: [
      {
        q: "¿Cómo se calculan la propina y el impuesto?",
        a: "Impuesto = subtotal × (% de impuesto ÷ 100). Propina = (subtotal + impuesto) × (% de propina ÷ 100). El total es la suma de los tres.",
      },
      {
        q: "¿Sobre qué base se aplica la propina?",
        a: "Por defecto se aplica sobre el monto con impuesto incluido (subtotal + impuesto). Ajustá los porcentajes si preferís propinar sobre el subtotal sin impuesto.",
      },
      {
        q: "¿La calculadora de propina e impuesto es gratis?",
        a: "Sí. Funciona en el navegador sin registro y no sube ningún dato a un servidor.",
      },
    ],
  },

  "password-strength": {
    metaTitle: "Password Strength Checker — Free Online | UtiliHub",
    metaTitleEs: "Analizador de fortaleza de contraseña | UtiliHub",
    metaDescription:
      "Check password strength in your browser: length, character variety, and approximate entropy. Nothing is uploaded.",
    metaDescriptionEs:
      "Revisá la fortaleza de tu contraseña en el navegador: longitud, variedad de caracteres y entropía aproximada. Nada se sube.",
    about: [
      "A strong password is long and unpredictable. Strength checkers estimate how hard it would be to guess or brute-force a string from length and character classes (lower, upper, digits, symbols).",
      "This tool evaluates the password you type locally. It does not send the value to a server and does not check against breach databases—use a reputable password manager for that.",
      "Aim for length first (12+ characters is a practical baseline for many accounts), then mix character types. Avoid single dictionary words and reused passwords across sites.",
    ],
    aboutEs: [
      "Una contraseña fuerte es larga y difícil de adivinar. Los analizadores estiman el esfuerzo de fuerza bruta según longitud y clases de caracteres (minúsculas, mayúsculas, números, símbolos).",
      "Esta herramienta evalúa lo que escribís en local. No envía el valor a un servidor ni consulta filtraciones: para eso usá un gestor de contraseñas de confianza.",
      "Priorizá la longitud (12+ caracteres es un piso razonable en muchas cuentas) y después la variedad. Evitá una sola palabra del diccionario y reutilizar la misma clave en todos lados.",
    ],
    steps: [
      "Type or paste the password you want to evaluate.",
      "Review length, diversity signals, and the strength estimate.",
      "Improve the password (longer, less predictable) until you are satisfied.",
      "Store it in a password manager instead of reusing it.",
    ],
    stepsEs: [
      "Escribí o pegá la contraseña a evaluar.",
      "Revisá longitud, variedad y la estimación de fortaleza.",
      "Mejorala (más larga, menos predecible) hasta quedar conforme.",
      "Guardala en un gestor en lugar de reutilizarla.",
    ],
    faq: [
      {
        q: "Is my password sent to UtiliHub?",
        a: "No. The check runs in your browser. For maximum privacy, avoid testing production passwords on any shared device.",
      },
      {
        q: "Why is a long passphrase better than a short complex password?",
        a: "Length multiplies the search space. A memorable multi-word passphrase often beats a short string with a few symbols.",
      },
    ],
    faqEs: [
      {
        q: "¿Se envía mi contraseña a UtiliHub?",
        a: "No. El análisis corre en tu navegador. Por privacidad, evitá probar claves reales en dispositivos compartidos.",
      },
      {
        q: "¿Por qué una frase larga es mejor que una clave corta “compleja”?",
        a: "La longitud multiplica el espacio de búsqueda. Una passphrase de varias palabras suele superar a una cadena corta con un par de símbolos.",
      },
    ],
  },

};
