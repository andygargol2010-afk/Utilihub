import { makeTool } from "./types";

/** Gap: Base64 decode exists; a JWT is three base64url parts and is not verified here. */
export const JWT_TOOLS = [
  makeTool(
    "decodificador-jwt",
    "JWT decoder",
    "desarrollo",
    "converter",
    "Decode a JWT header and payload without verifying the signature.",
    [
      "jwt decoder",
      "decode jwt payload",
      "decodificar jwt",
      "ver payload jwt",
      "jwt exp claim",
    ],
    {
      mode: "jwt",
      title: "JWT Decoder — Header and Payload, No Verify | UtiliHub",
      description:
        "Decode a JSON Web Token header and payload in the browser. The jwt.io sample iat is 2018-01-18T01:30:22Z. Signature is never verified.",
    },
  ),
];
