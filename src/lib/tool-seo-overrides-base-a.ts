/** SEO overrides base A (security, tip, percentage). */

export type ToolSeoOverrideBase = {
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

export const TOOL_SEO_OVERRIDES_BASE_A: Record<string, ToolSeoOverrideBase> = {
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

  "generador-de-contrasenas": {
    metaTitle: "Password Generator — Strong Random Passwords | UtiliHub",
    metaTitleEs: "Generador de contraseñas seguras gratis | UtiliHub",
    metaDescription:
      "Generate strong random passwords in your browser. Control length, symbols, and character sets. Free, no signup.",
    metaDescriptionEs:
      "Generá contraseñas aleatorias fuertes en el navegador. Controlá longitud, símbolos y tipos de caracteres. Gratis, sin registro.",
    about: [
      "A password generator creates random strings so you do not rely on human-chosen patterns. You pick length and whether to include symbols, numbers, and mixed case.",
      "Generation happens locally. Copy the result into a password manager and enable 2FA where the site supports it.",
      "Never email yourself new passwords or reuse the same generated string on multiple important accounts.",
    ],
    aboutEs: [
      "Un generador crea cadenas al azar para no depender de patrones humanos. Elegís longitud y si incluir símbolos, números y mayúsculas/minúsculas.",
      "La generación es local. Copiá el resultado a un gestor de contraseñas y activá 2FA donde el sitio lo permita.",
      "No te envíes las claves por mail ni reutilices la misma cadena en varias cuentas importantes.",
    ],
    steps: [
      "Choose length and character options.",
      "Generate a password.",
      "Copy it to your password manager.",
      "Use a unique password per important site.",
    ],
    stepsEs: [
      "Elegí longitud y opciones de caracteres.",
      "Generá la contraseña.",
      "Copiala a tu gestor.",
      "Usá una distinta en cada sitio importante.",
    ],
    faq: [
      {
        q: "How long should a password be?",
        a: "For most accounts, 12–16+ random characters is a solid baseline. Critical accounts benefit from longer strings or a manager-generated secret.",
      },
      {
        q: "Are generated passwords stored?",
        a: "No. They exist only in your browser session until you copy or leave the page.",
      },
    ],
    faqEs: [
      {
        q: "¿De qué longitud?",
        a: "Para la mayoría de cuentas, 12–16+ caracteres al azar es un buen piso. Cuentas críticas conviene alargarlas o usar el secreto del gestor.",
      },
      {
        q: "¿Se guardan las contraseñas generadas?",
        a: "No. Solo existen en la sesión del navegador hasta que las copiás o salís de la página.",
      },
    ],
  },

  porcentaje: {
    metaTitle: "Percentage Calculator — Free Online | UtiliHub",
    metaTitleEs: "Calculadora de porcentajes gratis | UtiliHub",
    metaDescription:
      "Free percentage calculator for discounts, increases, and proportions. What is X% of Y, or what percent is A of B.",
    metaDescriptionEs:
      "Calculadora de porcentajes gratis: descuentos, aumentos y proporciones. Cuánto es el X% de Y, o qué % es A de B.",
    about: [
      "Percentage problems show up in discounts, tips, taxes, grades, and growth rates. This calculator handles common cases: finding a percent of a number, finding what percent one number is of another, and percent change.",
      "All math runs locally so you can check store prices, markups, or homework without a spreadsheet.",
      "Percent change is (new − old) / old. Be careful with the base: “20% off” applies to the original price, not to a price that was already discounted unless the offer says so.",
    ],
    aboutEs: [
      "Los porcentajes aparecen en descuentos, propinas, impuestos, notas y tasas de crecimiento. Esta calculadora cubre casos habituales: un % de un número, qué % es un valor de otro, y el cambio porcentual.",
      "El cálculo es local: precios, recargos o deberes sin planilla.",
      "El cambio porcentual es (nuevo − viejo) / viejo. Cuidado con la base: “20% off” se aplica al precio original, no a uno ya rebajado, salvo que la oferta diga otra cosa.",
    ],
    steps: [
      "Pick the mode you need (percent of, reverse percent, or change).",
      "Enter the numbers involved.",
      "Read the result and units (amount vs percentage points).",
      "Double-check the base amount for discounts and increases.",
    ],
    stepsEs: [
      "Elegí el modo (porcentaje de, porcentaje inverso o cambio).",
      "Ingresá los números.",
      "Leé el resultado y las unidades (monto vs puntos porcentuales).",
      "Revisá la base en descuentos y aumentos.",
    ],
    faq: [
      {
        q: "How do I calculate a discount?",
        a: "Multiply the original price by (1 − discount%). Example: $80 with 25% off → 80 × 0.75 = $60.",
      },
      {
        q: "Percent vs percentage points?",
        a: "If a rate goes from 10% to 12%, that is a rise of 2 percentage points, or a 20% relative increase.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calculo un descuento?",
        a: "Multiplicá el precio original por (1 − % de descuento). Ejemplo: $80 con 25% off → 80 × 0.75 = $60.",
      },
      {
        q: "¿Porcentaje o puntos porcentuales?",
        a: "Si una tasa pasa de 10% a 12%, sube 2 puntos porcentuales, o un 20% en términos relativos.",
      },
    ],
  },
};
