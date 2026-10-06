import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ISBN: Record<string, ToolSeoOverride> = {
  "validador-isbn": {
    metaTitle: "ISBN Validator — Check Digit and 10/13 Convert | UtiliHub",
    metaTitleEs: "Validador ISBN — dígito de control y 10/13 | UtiliHub",
    metaDescription:
      "Validate ISBN-10 and ISBN-13 check digits, convert 978 forms, and hyphenate English groups 0 and 1. Free, in the browser.",
    metaDescriptionEs:
      "Validá el dígito de control de ISBN-10 e ISBN-13, convertí formas 978 y separá los grupos ingleses 0 y 1. Gratis, en el navegador.",
    about: [
      "ISBN-13 uses a mod-10 check. For the first 12 digits, weights alternate 1 and 3. The check digit is (10 − (sum mod 10)) mod 10.",
      "ISBN-10 uses a mod-11 check on the first 9 digits, weighted 10 down to 2. A remainder of 10 is written X. Hyphens and spaces do not count.",
      "A 978 ISBN-13 converts to ISBN-10 by dropping 978, keeping the next 9 digits, and recalculating the mod-11 check. 979 forms have no ISBN-10 equivalent.",
    ],
    aboutEs: [
      "El ISBN-13 usa un control módulo 10. En los primeros 12 dígitos los pesos alternan 1 y 3. El dígito es (10 − (suma mod 10)) mod 10.",
      "El ISBN-10 usa un control módulo 11 sobre los primeros 9 dígitos, con pesos de 10 a 2. Si el resto es 10 se escribe X. Los guiones y espacios no cuentan.",
      "Un ISBN-13 con prefijo 978 pasa a ISBN-10 quitando 978, conservando los 9 dígitos siguientes y recalculando el control módulo 11. El prefijo 979 no tiene ISBN-10.",
    ],
    steps: [
      "Paste an ISBN-10 or ISBN-13. Hyphens and spaces are optional.",
      "Read whether the check digit matches, and the expected digit if it does not.",
      "Copy the compact form, the converted 978 pair, or the hyphenated English-group form.",
      "Reset or load a preset. Nothing is uploaded.",
    ],
    stepsEs: [
      "Pegá un ISBN-10 o ISBN-13. Los guiones y espacios son opcionales.",
      "Mirá si el dígito de control coincide y cuál era el esperado si no.",
      "Copiá la forma compacta, el par 978 convertido o la forma con guiones del grupo inglés.",
      "Reiniciá o cargá un preset. No se sube nada.",
    ],
    faq: [
      {
        q: "Is 978-0-306-40615-7 valid?",
        a: "Yes. Compact 9780306406157. The first 12 digits with weights 1,3,1,3… sum to 93. 93 mod 10 is 3, so the check digit is (10−3) mod 10 = 7. The ISBN-10 form is 0306406152.",
      },
      {
        q: "How is the ISBN-10 check digit calculated?",
        a: "For 030640615 the weighted sum is 0×10+3×9+0×8+6×7+4×6+0×5+6×4+1×3+5×2 = 130. 130 mod 11 is 9, and (11−9) mod 11 is 2. The full ISBN-10 is 0-306-40615-2.",
      },
      {
        q: "What if the check digit is wrong?",
        a: "9780306406158 fails: the formula still expects 7. The tool marks it invalid and shows the corrected ISBN-13 9780306406157. It does not treat a wrong digit as valid.",
      },
      {
        q: "What about empty, X, or the wrong length?",
        a: "An empty field is an error. X is allowed only as the ISBN-10 check digit. 9 or 11 characters, a negative sign, or a 979 number with X are rejected. Zero is not a special ISBN; 0000000000000 fails the 978/979 prefix check.",
      },
    ],
    faqEs: [
      {
        q: "¿Es válido 978-0-306-40615-7?",
        a: "Sí. Compacto 9780306406157. Los primeros 12 dígitos con pesos 1,3,1,3… suman 93. 93 mod 10 es 3, así que el control es (10−3) mod 10 = 7. La forma ISBN-10 es 0306406152.",
      },
      {
        q: "¿Cómo se calcula el dígito de ISBN-10?",
        a: "Para 030640615 la suma ponderada es 0×10+3×9+0×8+6×7+4×6+0×5+6×4+1×3+5×2 = 130. 130 mod 11 es 9, y (11−9) mod 11 es 2. El ISBN-10 completo es 0-306-40615-2.",
      },
      {
        q: "¿Qué pasa si el dígito de control está mal?",
        a: "9780306406158 falla: la fórmula sigue esperando 7. La herramienta lo marca inválido y muestra el ISBN-13 corregido 9780306406157. No da por válido un dígito incorrecto.",
      },
      {
        q: "¿Y si está vacío, trae X o la longitud no cierra?",
        a: "Un campo vacío es un error. X solo vale como control de ISBN-10. 9 u 11 caracteres, un signo menos o un 979 con X se rechazan. Cero no es un ISBN especial: 0000000000000 falla el prefijo 978/979.",
      },
    ],
  },
};
