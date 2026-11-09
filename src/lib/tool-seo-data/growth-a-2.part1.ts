// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_A_2, split from growth-a-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A_2_PART1: Record<string, ToolSeoOverrideGrowth> = {  "jwt-decoder": {
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
};
