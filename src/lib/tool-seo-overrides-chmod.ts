import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CHMOD: Record<string, ToolSeoOverride> = {
  "conversor-permisos-chmod": {
    metaTitle: "Chmod Calculator — Octal to rwx and Symbolic | UtiliHub",
    metaTitleEs: "Conversor chmod — octal a rwx y simbólico | UtiliHub",
    metaDescription:
      "Convert chmod modes between octal and symbolic rwx. 755 is rwxr-xr-x. 1777 keeps the sticky bit. Free in the browser.",
    metaDescriptionEs:
      "Convertí permisos chmod entre octal y rwx simbólico. 755 es rwxr-xr-x. 1777 conserva el sticky bit. Gratis en el navegador.",
    about: [
      "Map a Unix file mode between a 3- or 4-digit octal and the 9-character symbolic form, including setuid, setgid, and the sticky bit.",
      "755 becomes rwxr-xr-x: owner read/write/execute, group and others read/execute. 640 becomes rw-r-----.",
      "1777 becomes rwxrwxrwt. Empty input stays blank. Digits 8 or 9, and broken rwx strings, are rejected.",
    ],
    aboutEs: [
      "Pasá un modo Unix entre octal de 3 o 4 dígitos y la forma simbólica de 9 caracteres, con setuid, setgid y sticky bit.",
      "755 pasa a rwxr-xr-x: dueño lee, escribe y ejecuta; grupo y otros leen y ejecutan. 640 pasa a rw-r-----.",
      "1777 pasa a rwxrwxrwt. Vacío no convierte. Los dígitos 8 o 9 y un rwx roto se rechazan.",
    ],
    steps: [
      "Type an octal mode such as 755, a symbolic string such as rwxr-xr-x, or an assignment such as u=rwx,g=rx,o=rx.",
      "Use a preset to check 755, 640, or the sticky 1777 directory.",
      "Copy the octal and symbolic pair. This does not change files on a server.",
    ],
    stepsEs: [
      "Escribí un octal como 755, un simbólico como rwxr-xr-x, o una asignación como u=rwx,g=rx,o=rx.",
      "Usá un preset para revisar 755, 640 o el directorio sticky 1777.",
      "Copiá el par octal y simbólico. Esto no cambia archivos en un servidor.",
    ],
    faq: [
      { q: "What does chmod 755 mean?", a: "755 is rwxr-xr-x. The owner can read, write, and execute. Group and others can read and execute, but not write." },
      { q: "How do I write a sticky directory?", a: "1777 is rwxrwxrwt. The leading 1 is the sticky bit, so only the owner can delete a file inside even if others can write." },
      { q: "What is rejected?", a: "Empty input does not convert. 888 and any digit above 7 fail. A symbolic string must be nine rwx characters, with s/S or t/T only in the execute slots." },
      { q: "Does this run chmod on my computer?", a: "No. It only translates the mode bits in the browser. It does not touch a filesystem." },
    ],
    faqEs: [
      { q: "¿Qué significa chmod 755?", a: "755 es rwxr-xr-x. El dueño lee, escribe y ejecuta. Grupo y otros leen y ejecutan, pero no escriben." },
      { q: "¿Cómo se escribe un directorio sticky?", a: "1777 es rwxrwxrwt. El 1 inicial es el sticky bit: aunque otros escriban, solo el dueño borra un archivo adentro." },
      { q: "¿Qué se rechaza?", a: "Vacío no convierte. 888 y cualquier dígito mayor que 7 fallan. El simbólico tiene que tener nueve caracteres rwx, con s/S o t/T solo en el lugar de ejecutar." },
      { q: "¿Esto ejecuta chmod en mi equipo?", a: "No. Solo traduce los bits en el navegador. No toca un sistema de archivos." },
    ],
  },
};
