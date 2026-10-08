import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RUT_CHILE: Record<string, ToolSeoOverride> = {
  "validador-rut-chile": {
    metaTitle: "Chilean RUT Validator — Check Digit and K | UtiliHub",
    metaTitleEs: "Validador de RUT chileno — dígito verificador y K | UtiliHub",
    metaDescription:
      "Check a Chilean RUT or calculate the missing digit. 12.345.678-5 is valid. The series 2–7 can yield K. Formatted locally, nothing uploaded.",
    metaDescriptionEs:
      "Verificá un RUT chileno o calculá el dígito que falta. 12.345.678-5 es válido. La serie 2–7 puede dar K. Se formatea en el navegador, sin subir nada.",
    about: [
      "A Chilean RUT (rol único tributario) is a body of 7 or 8 digits plus a check digit from 0 to 9 or K.",
      "The digit uses weights 2 through 7 from the right, then 11 minus the sum modulo 11. 11 becomes 0 and 10 becomes K.",
      "This is not the Spanish DNI letter or the Argentine CUIT. Dots and the dash are formatting only.",
    ],
    aboutEs: [
      "El RUT chileno es un cuerpo de 7 u 8 dígitos más un verificador de 0 a 9 o K.",
      "El dígito usa pesos 2 a 7 desde la derecha y luego 11 menos el resto módulo 11. 11 pasa a 0 y 10 pasa a K.",
      "No es la letra del DNI español ni el CUIT argentino. Los puntos y el guion son solo formato.",
    ],
    steps: [
      "Paste a RUT with or without dots, such as 12345678-5 or 12.345.678-5.",
      "Leave the check digit off to calculate it, or include it to verify.",
      "Copy the formatted RUT. A mismatch shows the expected digit.",
    ],
    stepsEs: [
      "Pegá un RUT con o sin puntos, por ejemplo 12345678-5 o 12.345.678-5.",
      "Omití el verificador para calcularlo, o incluilo para comprobarlo.",
      "Copiá el RUT formateado. Si no coincide, se muestra el dígito esperado.",
    ],
    faq: [
      { q: "Why can the check digit be K?", a: "When 11 minus the modulo is 10, Chilean RUT uses the letter K instead of a number." },
      { q: "Is 12.345.678-5 valid?", a: "Yes. The body 12345678 has check digit 5. 11.111.111-1 is also valid." },
      { q: "Does this look up the person at the SII?", a: "No. It only checks the local modulo-11 digit. It does not query the Chilean tax service." },
    ],
    faqEs: [
      { q: "¿Por qué el verificador puede ser K?", a: "Cuando 11 menos el módulo da 10, el RUT chileno usa la letra K en lugar de un número." },
      { q: "¿12.345.678-5 es válido?", a: "Sí. El cuerpo 12345678 tiene verificador 5. 11.111.111-1 también es válido." },
      { q: "¿Consulta a la persona en el SII?", a: "No. Solo comprueba el dígito módulo 11 en el navegador. No consulta al Servicio de Impuestos Internos." },
    ],
  },
};
