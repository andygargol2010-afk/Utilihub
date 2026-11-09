import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_JWT: Record<string, ToolSeoOverride> = {
  "decodificador-jwt": {
    metaTitle: "JWT Decoder — Header and Payload, No Verify | UtiliHub",
    metaTitleEs: "Decodificador JWT: header y payload, sin verificar | UtiliHub",
    metaDescription:
      "Decode a JSON Web Token header and payload in the browser. The jwt.io sample iat is 2018-01-18T01:30:22Z. Signature is never verified.",
    metaDescriptionEs:
      "Decodificá el header y el payload de un JWT en el navegador. El iat del ejemplo de jwt.io es 2018-01-18T01:30:22Z. La firma no se verifica.",
    about: [
      "A JWT is three base64url segments separated by dots: header, payload, and signature. This tool reads the first two as JSON.",
      "It does not verify HS256, RS256, or any other signature, and it does not send the token anywhere. A decoded payload is not proof the token is authentic.",
      "exp, iat, and nbf are NumericDate seconds, not milliseconds. An empty signature or alg none is shown as a warning, not as a valid signed token.",
    ],
    aboutEs: [
      "Un JWT son tres segmentos base64url separados por puntos: header, payload y firma. Esta tool lee los dos primeros como JSON.",
      "No verifica HS256, RS256 ni ninguna otra firma, y no envía el token. Un payload decodificado no prueba que el token sea auténtico.",
      "exp, iat y nbf son segundos NumericDate, no milisegundos. Una firma vacía o alg none se muestra como aviso, no como token firmado válido.",
    ],
    steps: [
      "Paste a JWT with two dots, or load an example.",
      "Read the header, payload, and claim times.",
      "Copy the payload. The signature is displayed only and never checked.",
    ],
    stepsEs: [
      "Pegá un JWT con dos puntos, o cargá un ejemplo.",
      "Leé el header, el payload y las fechas de los claims.",
      "Copiá el payload. La firma solo se muestra y no se comprueba.",
    ],
    faq: [
      { q: "What is the iat of the jwt.io sample?", a: "1516239022 seconds, which is 2018-01-18T01:30:22Z. The header alg is HS256 and the payload name is John Doe." },
      { q: "Does this verify the signature?", a: "No. The third segment is shown and ignored. Use your server or a trusted library with the real secret or public key to verify." },
      { q: "Why does a two-part token fail?", a: "A compact JWT needs header, payload, and signature segments. Two segments is not a JWT. An empty third segment is accepted and flagged as unsigned." },
    ],
    faqEs: [
      { q: "¿Cuál es el iat del ejemplo de jwt.io?", a: "1516239022 segundos, o sea 2018-01-18T01:30:22Z. El alg del header es HS256 y el nombre del payload es John Doe." },
      { q: "¿Esto verifica la firma?", a: "No. El tercer segmento se muestra y se ignora. Verificá en el servidor o con una librería de confianza y la clave real." },
      { q: "¿Por qué falla un token de dos partes?", a: "Un JWT compacto necesita header, payload y firma. Dos segmentos no son un JWT. Un tercer segmento vacío se acepta y se marca como no firmado." },
    ],
  },
};
