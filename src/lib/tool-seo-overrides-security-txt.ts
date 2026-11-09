import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SECURITY_TXT: Record<string, ToolSeoOverride> = {
  "generador-security-txt": {
    metaTitle: "security.txt Generator — RFC 9116 Contact and Expires | UtiliHub",
    metaTitleEs: "Generador de security.txt — Contact y Expires RFC 9116 | UtiliHub",
    metaDescription:
      "Generate a security.txt with a mailto or https Contact and a future Expires date. Add policy, hiring, and canonical URLs. Nothing is uploaded.",
    metaDescriptionEs:
      "Generá un security.txt con Contact mailto o https y una fecha Expires futura. Sumá política, empleo y URL canónica. No se sube nada.",
    about: [
      "security.txt (RFC 9116) tells researchers how to report a vulnerability. It belongs at https://example.com/.well-known/security.txt.",
      "Contact is required and must be a mailto, https, or tel URI. Expires must be a future UTC timestamp so abandoned files stop being trusted.",
      "Optional Encryption, Policy, Hiring, Acknowledgments, and Canonical fields must be https URLs. The file is built locally.",
    ],
    aboutEs: [
      "security.txt (RFC 9116) indica cómo reportar una vulnerabilidad. Se publica en https://ejemplo.com/.well-known/security.txt.",
      "Contact es obligatorio y debe ser un URI mailto, https o tel. Expires tiene que ser una marca UTC futura para que un archivo abandonado deje de ser confiable.",
      "Encryption, Policy, Hiring, Acknowledgments y Canonical son opcionales y deben ser URLs https. El archivo se arma en el navegador.",
    ],
    steps: [
      "Enter a Contact (mailto:security@example.com) and a future Expires date.",
      "Add optional https policy, hiring, or canonical URLs.",
      "Copy or download security.txt. Upload it yourself to /.well-known/.",
    ],
    stepsEs: [
      "Ingresá un Contact (mailto:security@ejemplo.com) y una fecha Expires futura.",
      "Sumá URLs https opcionales de política, empleo o canónica.",
      "Copiá o descargá security.txt. Subilo vos a /.well-known/.",
    ],
    faq: [
      { q: "Where does security.txt go?", a: "Publish it at https://your-domain/.well-known/security.txt. A copy at /security.txt is only a fallback." },
      { q: "Why must Expires be in the future?", a: "RFC 9116 says consumers should ignore a file after Expires so an abandoned contact is not trusted forever." },
      { q: "Is this the same as robots.txt?", a: "No. robots.txt controls crawlers. security.txt publishes a vulnerability-disclosure contact." },
    ],
    faqEs: [
      { q: "¿Dónde va security.txt?", a: "Publicálo en https://tu-dominio/.well-known/security.txt. Una copia en /security.txt es solo respaldo." },
      { q: "¿Por qué Expires tiene que ser futura?", a: "El RFC 9116 pide ignorar el archivo después de Expires para no confiar siempre en un contacto abandonado." },
      { q: "¿Es lo mismo que robots.txt?", a: "No. robots.txt controla rastreadores. security.txt publica el contacto para divulgar vulnerabilidades." },
    ],
  },
};
