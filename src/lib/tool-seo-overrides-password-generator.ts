import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_PASSWORD_GENERATOR: Record<string, ToolSeoOverride> = {
  "generador-contrasena": {
    metaTitle: "Password Generator — Strong random passwords online | UtiliHub",
    metaTitleEs: "Generador de contraseñas — Contraseñas aleatorias seguras | UtiliHub",
    metaDescription:
      "Generate strong random passwords with customizable length, uppercase, numbers, and symbols. Exclude look-alike characters. Uses crypto.getRandomValues and runs entirely in your browser.",
    metaDescriptionEs:
      "Generá contraseñas aleatorias seguras con largo personalizable, mayúsculas, números y símbolos. Excluí caracteres parecidos. Usa crypto.getRandomValues y corre por completo en tu navegador.",
    about: [
      "Passwords are built with window.crypto.getRandomValues, not Math.random, so every character is a cryptographically secure pick.",
      "Length runs from 8 to 64 characters and you can toggle uppercase, lowercase, numbers, and symbols independently.",
      "Exclude similar removes look-alike characters (I, l, 1, 0, O) to avoid transcription mistakes.",
      "Nothing leaves the browser: there is no account, no logging, and no network call.",
    ],
    aboutEs: [
      "Las contraseñas se generan con window.crypto.getRandomValues, no con Math.random, así que cada carácter es una elección criptográficamente segura.",
      "El largo va de 8 a 64 caracteres y podés activar mayúsculas, minúsculas, números y símbolos por separado.",
      "Excluir similares quita los caracteres parecidos (I, l, 1, 0, O) para evitar errores al copiar a mano.",
      "Nada sale de tu navegador: sin cuenta, sin registro y sin llamadas de red.",
    ],
    steps: [
      "Set the length with the slider (8 to 64) and pick the character sets you want.",
      "Keep exclude similar on if you will read or copy the password by hand.",
      "Copy the password with one click, or regenerate until you like the result.",
    ],
    stepsEs: [
      "Elegí el largo con el control (8 a 64) y marcá los conjuntos de caracteres que quieras.",
      "Dejá activado excluir similares si vas a leer o copiar la contraseña a mano.",
      "Copiá la contraseña con un clic, o regenerá hasta que te guste el resultado.",
    ],
    faq: [
      {
        q: "Are the generated passwords secure?",
        a: "Yes. Each character comes from window.crypto.getRandomValues, a cryptographically secure random source, unlike Math.random().",
      },
      {
        q: "How long should my password be?",
        a: "At least 16 characters with mixed case, numbers, and symbols is a strong default. A random 16-character password over the full set has roughly 100 bits of entropy.",
      },
      {
        q: "What does exclude similar do?",
        a: "It removes characters that are easy to confuse when reading: uppercase I, lowercase l, digit 1, digit 0, and uppercase O.",
      },
      {
        q: "Is my password sent anywhere?",
        a: "No. Generation happens entirely in your browser and the password is never uploaded or stored.",
      },
    ],
    faqEs: [
      {
        q: "¿Son seguras las contraseñas generadas?",
        a: "Sí. Cada carácter sale de window.crypto.getRandomValues, una fuente aleatoria criptográficamente segura, a diferencia de Math.random().",
      },
      {
        q: "¿Qué largo debería tener mi contraseña?",
        a: "Al menos 16 caracteres con mayúsculas, números y símbolos es un buen valor por defecto. Una contraseña aleatoria de 16 caracteres sobre el conjunto completo tiene unos 100 bits de entropía.",
      },
      {
        q: "¿Qué hace excluir similares?",
        a: "Quita los caracteres fáciles de confundir al leer: I mayúscula, l minúscula, el dígito 1, el dígito 0 y la O mayúscula.",
      },
      {
        q: "¿Se envía mi contraseña a algún servidor?",
        a: "No. La generación ocurre por completo en tu navegador y la contraseña nunca se sube ni se guarda.",
      },
    ],
  },
};
