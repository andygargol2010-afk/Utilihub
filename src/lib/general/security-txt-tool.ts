import { makeTool } from "./types";

/** Gap: robots.txt controls crawlers. This writes an RFC 9116 security.txt disclosure file. */
export const SECURITY_TXT_TOOLS = [
  makeTool(
    "generador-security-txt",
    "security.txt generator",
    "seguridad",
    "generator",
    "Build a security.txt with Contact and a future Expires, plus optional policy and hiring URLs.",
    [
      "security.txt generator",
      "well-known security.txt",
      "vulnerability disclosure file",
      "rfc 9116 generator",
      "generador security.txt",
      "archivo security.txt",
      "divulgacion de vulnerabilidades",
      "contacto de seguridad web",
    ],
    {
      mode: "security-txt-generator",
      title: "security.txt Generator — RFC 9116 Disclosure File | UtiliHub",
      description:
        "Write a security.txt with a mailto or https Contact and a future Expires date. Optional policy, hiring, and canonical URLs stay in the browser.",
    },
  ),
];
