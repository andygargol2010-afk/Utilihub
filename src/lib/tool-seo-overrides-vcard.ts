import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_VCARD: Record<string, ToolSeoOverride> = {
  "generador-vcard": {
    metaTitle: "vCard Generator — Download a .vcf Contact | UtiliHub",
    metaTitleEs: "Generador de vCard — descargar contacto .vcf | UtiliHub",
    metaDescription:
      "Type Ana Pérez and +5491112345678 to download a vCard 3.0 file. Commas in the name are escaped. Nothing is uploaded.",
    metaDescriptionEs:
      "Escribí Ana Pérez y +5491112345678 para descargar un vCard 3.0. Las comas del nombre se escapan. Nada se sube.",
    about: [
      "A vCard 3.0 file is the contact format phones and mail apps import as .vcf.",
      "The ICS generator builds a calendar event. This only builds a person card: name, org, email, phone, URL, address, and note.",
      "Commas, semicolons, and line breaks are escaped so the card still parses. Empty names, bad emails, and bare URLs stop before a fake file.",
    ],
    aboutEs: [
      "Un archivo vCard 3.0 es el formato de contacto que teléfonos y correo importan como .vcf.",
      "El generador ICS arma un evento de calendario. Esto solo arma una ficha de persona: nombre, organización, email, teléfono, URL, dirección y nota.",
      "Comas, punto y coma y saltos de línea se escapan para que la ficha siga parseando. Nombre vacío, email inválido y URL sin http se detienen antes de un archivo falso.",
    ],
    steps: [
      "Type a full name. Add email, phone, org, or address only if you need them.",
      "Read the vCard preview. A comma in the name appears as \\,.",
      "Copy the text or download the .vcf. Reset clears the form.",
    ],
    stepsEs: [
      "Escribí el nombre completo. Sumá email, teléfono, organización o dirección solo si los necesitás.",
      "Leé la vista previa. Una coma en el nombre aparece como \\,.",
      "Copiá el texto o descargá el .vcf. Restablecer limpia el formulario.",
    ],
    faq: [
      { q: "What does Ana Pérez and +5491112345678 produce?", a: "A vCard 3.0 with FN:Ana Pérez and TEL;TYPE=CELL:+5491112345678. You can copy it or download contact.vcf." },
      { q: "How is a comma in the name saved?", a: "Pérez, Ana is written as FN:Pérez\\, Ana so the comma is not treated as a field separator." },
      { q: "Why is an empty name rejected?", a: "FN is required in vCard 3.0. A card without a name would fail import, so the tool does not emit one." },
    ],
    faqEs: [
      { q: "¿Qué produce Ana Pérez y +5491112345678?", a: "Un vCard 3.0 con FN:Ana Pérez y TEL;TYPE=CELL:+5491112345678. Se puede copiar o descargar contact.vcf." },
      { q: "¿Cómo se guarda una coma en el nombre?", a: "Pérez, Ana se escribe FN:Pérez\\, Ana para que la coma no se lea como separador de campo." },
      { q: "¿Por qué se rechaza un nombre vacío?", a: "FN es obligatorio en vCard 3.0. Una ficha sin nombre fallaría al importar, así que no se emite." },
    ],
  },
};
