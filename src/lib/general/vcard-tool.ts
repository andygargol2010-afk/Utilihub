import { makeTool } from "./types";

/** Gap: ICS builds a calendar file. This builds a local vCard 3.0 contact, with RFC escaping. */
export const VCARD_TOOLS = [
  makeTool(
    "generador-vcard",
    "vCard contact generator",
    "productividad",
    "generator",
    "Build a .vcf contact card in the browser, escape commas, and copy or download it.",
    [
      "vcard generator",
      "vcf generator",
      "create vcard online",
      "download vcf contact",
      "generador vcard",
      "generador de contacto vcf",
      "crear tarjeta vcard",
      "descargar vcf",
    ],
    {
      mode: "vcard-generator",
      title: "vCard Generator — Download a .vcf Contact | UtiliHub",
      description:
        "Type Ana Pérez and +5491112345678 to download a vCard 3.0 file. Commas in the name are escaped. Nothing is uploaded.",
    },
  ),
];
