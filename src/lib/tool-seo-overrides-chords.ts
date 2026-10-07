import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CHORDS: Record<string, ToolSeoOverride> = {
  "transportador-acordes": {
    metaTitle: "Chord Transposer — Move a Chart by Semitones | UtiliHub",
    metaTitleEs: "Transportador de acordes — semitonos y cejilla | UtiliHub",
    metaDescription:
      "Transpose chords like C G Am F up 2 to D A Bm G. Slash bass, sharps or flats, capo hint, and Do-Re-Mi. Free in the browser.",
    metaDescriptionEs:
      "Transportá acordes: C G Am F sube 2 a D A Bm G. Bajo con barra, sostenidos o bemoles, cejilla y Do-Re-Mi. Gratis en el navegador.",
    about: [
      "Shift every chord symbol in a chart by a number of semitones. Qualities such as m, maj7, sus4, and add9 stay attached to the root.",
      "A slash bass moves with the chord: Eb/G down 1 with flats becomes D/Gb. German H is treated as B.",
      "Capo hint: the same original shapes sound the transposed key with a capo on the matching fret (0–11). Empty charts stay blank. Tokens that are not chords are left as written.",
    ],
    aboutEs: [
      "Desplazá cada cifrado de una progresión por semitonos. La calidad (m, maj7, sus4, add9) se queda en la tónica.",
      "El bajo después de la barra también se mueve: Eb/G baja 1 con bemoles queda D/Gb. La H alemana se lee como Si.",
      "La cejilla indica en qué traste suenan las formas originales en el tono nuevo (0–11). Vacío no convierte. Lo que no es un acorde se deja igual.",
    ],
    steps: [
      "Paste a chart such as C G Am F or Bbmaj7 Eb/G.",
      "Set the semitone shift, spelling (sharps or flats), and letter or Do-Re-Mi output.",
      "Copy the transposed chart. Use the capo fret if you want to keep the original shapes.",
    ],
    stepsEs: [
      "Pegá una progresión como C G Am F o Bbmaj7 Eb/G.",
      "Elegí los semitonos, bemoles o sostenidos, y salida en letras o Do-Re-Mi.",
      "Copiá el resultado. La cejilla sirve si querés dejar las formas originales.",
    ],
    faq: [
      { q: "How do I transpose C G Am F up 2 semitones?", a: "It becomes D A Bm G with sharps. A capo on fret 2 lets you keep the C shapes." },
      { q: "Does the bass note after a slash move?", a: "Yes. Eb/G down one semitone is D/F# with sharps, or D/Gb if you prefer flats." },
      { q: "Can I type Spanish note names?", a: "Yes. Do, Re, Mi, Fa, Sol, La, and Si are accepted, including Do# and Sib. N.C. and plain numbers stay unchanged." },
    ],
    faqEs: [
      { q: "¿Cómo subo C G Am F dos semitonos?", a: "Queda D A Bm G con sostenidos. Con cejilla en el traste 2 podés seguir con las formas de C." },
      { q: "¿El bajo después de la barra también cambia?", a: "Sí. Eb/G baja un semitono a D/F# con sostenidos, o D/Gb si preferís bemoles." },
      { q: "¿Acepta Do Re Mi?", a: "Sí. Do, Re, Mi, Fa, Sol, La y Si, con Do# o Sib. N.C. y los números sueltos no se tocan." },
    ],
  },
};
