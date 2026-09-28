/** Unique SEO for matrix-binary suite. */

export type ToolSeoOverrideMatrix = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_MATRIX: Record<string, ToolSeoOverrideMatrix> = {
  "matriz-2x2": {
    metaTitle: "2×2 Matrix Determinant & Inverse Calculator | UtiliHub",
    metaTitleEs: "Calculadora determinante e inversa de matriz 2×2 | UtiliHub",
    metaDescription: "det(A)=ad−bc and the inverse of a 2×2 matrix when invertible. Free linear-algebra helper.",
    metaDescriptionEs: "det(A)=ad−bc y la inversa de una matriz 2×2 cuando es invertible. Ayuda de álgebra lineal gratis.",
    about: [
      "The determinant of [[a,b],[c,d]] is ad−bc.",
      "When det≠0 the inverse is (1/det)·[[d,−b],[−c,a]].",
      "Singular matrices have no inverse.",
    ],
    aboutEs: [
      "El determinante de [[a,b],[c,d]] es ad−bc.",
      "Si det≠0 la inversa es (1/det)·[[d,−b],[−c,a]].",
      "Las matrices singulares no tienen inversa.",
    ],
    steps: ["Enter the four entries a,b,c,d.", "Read det(A).", "If invertible, read A⁻¹."],
    stepsEs: ["Ingresá las cuatro entradas a,b,c,d.", "Leé det(A).", "Si es invertible, leé A⁻¹."],
    faq: [
      { q: "det = 0?", a: "The matrix is singular — no inverse." },
      { q: "3×3?", a: "Not in this tool; specialized for 2×2." },
    ],
    faqEs: [
      { q: "¿det = 0?", a: "La matriz es singular: no hay inversa." },
      { q: "¿3×3?", a: "No en esta tool; solo 2×2." },
    ],
  },
  "bases-numericas": {
    metaTitle: "Binary Decimal Hex Converter | UtiliHub",
    metaTitleEs: "Conversor binario decimal hexadecimal | UtiliHub",
    metaDescription: "Convert non-negative integers between binary, decimal, and hexadecimal bases.",
    metaDescriptionEs: "Convertí enteros no negativos entre bases binaria, decimal y hexadecimal.",
    about: [
      "Programmers constantly move between base 2, 10, and 16.",
      "Enter a value in any base; the tool shows all three.",
      "Hex digits are 0-9 and A-F.",
    ],
    aboutEs: [
      "Los programadores alternan constantemente entre bases 2, 10 y 16.",
      "Ingresá un valor en cualquier base; se muestran las tres.",
      "Los dígitos hex son 0-9 y A-F.",
    ],
    steps: ["Select the input base.", "Enter the value.", "Read decimal, binary, and hex."],
    stepsEs: ["Seleccioná la base de entrada.", "Ingresá el valor.", "Leé decimal, binario y hex."],
    faq: [
      { q: "Negatives?", a: "This version focuses on non-negative integers." },
      { q: "Max size?", a: "Limited to JavaScript safe integers." },
    ],
    faqEs: [
      { q: "¿Negativos?", a: "Esta versión apunta a enteros no negativos." },
      { q: "¿Tamaño máximo?", a: "Limitado a enteros seguros de JavaScript." },
    ],
  },
  "bitwise": {
    metaTitle: "Bitwise AND OR XOR Calculator | UtiliHub",
    metaTitleEs: "Calculadora AND OR XOR bit a bit | UtiliHub",
    metaDescription: "Compute integer bitwise AND, OR, and XOR with binary hints. Free bit-ops tool.",
    metaDescriptionEs: "Calculá AND, OR y XOR bit a bit de enteros con pistas en binario. Tool gratis.",
    about: [
      "Bitwise operators manipulate individual bits of integers.",
      "AND, OR, and XOR are the three fundamental binary bit ops.",
      "Useful for flags, masks, and systems programming exercises.",
    ],
    aboutEs: [
      "Los operadores bit a bit manipulan bits individuales de enteros.",
      "AND, OR y XOR son las tres operaciones binarias fundamentales.",
      "Útiles para flags, máscaras y ejercicios de sistemas.",
    ],
    steps: ["Enter integers a and b.", "Calculate AND, OR, XOR.", "Read decimal results and binary hints."],
    stepsEs: ["Ingresá enteros a y b.", "Calculá AND, OR, XOR.", "Leé resultados en decimal y pistas en binario."],
    faq: [
      { q: "NOT operator?", a: "Depends on word width; not included here." },
      { q: "Shifts?", a: "Not in this version." },
    ],
    faqEs: [
      { q: "¿Operador NOT?", a: "Depende del ancho de palabra; no está aquí." },
      { q: "¿Desplazamientos?", a: "No en esta versión." },
    ],
  },
};
