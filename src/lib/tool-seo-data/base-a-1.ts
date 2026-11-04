// TOOL_SEO_OVERRIDES_BASE_A part 1 — split out of ../tool-seo-overrides-base-a.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBase } from "../tool-seo-overrides-base-a";
import { TOOL_SEO_OVERRIDES_BASE_A_1_PART1 } from "./base-a-1.part1";
import { TOOL_SEO_OVERRIDES_BASE_A_1_PART2 } from "./base-a-1.part2";


export const TOOL_SEO_OVERRIDES_BASE_A_1: Record<string, ToolSeoOverrideBase> = {
  ...TOOL_SEO_OVERRIDES_BASE_A_1_PART1,
  ...TOOL_SEO_OVERRIDES_BASE_A_1_PART2,

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
