import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_LUHN: Record<string, ToolSeoOverride> = {
  "validador-luhn": {
    metaTitle: "Luhn Check Digit Validator — Local Card Checksum | UtiliHub",
    metaTitleEs: "Validador Luhn: dígito de control local, sin subir datos | UtiliHub",
    metaDescription:
      "Paste 4111 1111 1111 1111 and see a valid Visa checksum. A flipped last digit shows the expected check digit. Nothing is uploaded.",
    metaDescriptionEs:
      "Pegá 4111 1111 1111 1111 y ves un checksum Visa válido. Un último dígito cambiado muestra el dígito de control esperado. No se sube nada.",
    about: [
      "Luhn doubles every second digit from the right and asks the sum to end in 0. Cards, some IMEI strings, and test numbers use it.",
      "ISBN and IBAN already check their own digits. This stays on the Luhn rule, names Visa, Mastercard, or Amex when the prefix matches, and writes the expected check digit.",
      "Letters, a single digit, or more than 19 digits stop before a false valid. The number never leaves the browser.",
    ],
    aboutEs: [
      "Luhn duplica un dígito de cada dos desde la derecha y pide que la suma termine en 0. Lo usan tarjetas, algunos IMEI y números de prueba.",
      "ISBN e IBAN ya revisan sus propios dígitos. Esto se queda en la regla Luhn, nombra Visa, Mastercard o Amex si el prefijo coincide y escribe el dígito de control esperado.",
      "Letras, un solo dígito o más de 19 dígitos se detienen antes de un falso válido. El número no sale del navegador.",
    ],
    steps: [
      "Paste a digit string. Spaces and dashes are ignored.",
      "Read valid or invalid, the brand guess, and the expected check digit.",
      "Copy the summary or reset to the Visa sample.",
    ],
    stepsEs: [
      "Pegá una cadena de dígitos. Se ignoran espacios y guiones.",
      "Leé válido o inválido, la marca estimada y el dígito de control esperado.",
      "Copiá el resumen o restablecé la muestra Visa.",
    ],
    faq: [
      { q: "Is 4111 1111 1111 1111 valid?", a: "Yes. It is a 16-digit Visa test number. The Luhn sum ends in 0 and the check digit is 1." },
      { q: "What does 4111 1111 1111 1112 show?", a: "Invalid. The expected check digit is 1, the typed check digit is 2, and the remainder is not 0." },
      { q: "Does this charge a card or store the number?", a: "No. It only runs the checksum in the browser. It is not a payment form and it does not prove the account exists." },
    ],
    faqEs: [
      { q: "¿4111 1111 1111 1111 es válido?", a: "Sí. Es un número de prueba Visa de 16 dígitos. La suma Luhn termina en 0 y el dígito de control es 1." },
      { q: "¿Qué muestra 4111 1111 1111 1112?", a: "Inválido. El dígito de control esperado es 1, el escrito es 2 y el resto no es 0." },
      { q: "¿Cobra la tarjeta o guarda el número?", a: "No. Solo calcula el checksum en el navegador. No es un formulario de pago y no prueba que la cuenta exista." },
    ],
  },
};
