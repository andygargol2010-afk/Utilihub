/** Unique SEO for explog-suite calculators. */

export type ToolSeoOverrideExplog = {
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

export const TOOL_SEO_OVERRIDES_EXPLOG: Record<string, ToolSeoOverrideExplog> = {
  "cambio-de-base": {
    metaTitle: "Change of Base Logarithm Calculator | UtiliHub",
    metaTitleEs: "Calculadora cambio de base logarítmica | UtiliHub",
    metaDescription: "Evaluate log_b(x) with the change-of-base formula ln(x)/ln(b). Free logarithm tool.",
    metaDescriptionEs: "Evaluá log_b(x) con la fórmula de cambio de base ln(x)/ln(b). Herramienta gratis.",
    about: [
      "Any logarithm can be rewritten in another base via log_b(x)=log_k(x)/log_k(b).",
      "This tool uses natural logs internally for numerical stability.",
      "Requires positive x and base b ≠ 1.",
    ],
    aboutEs: [
      "Cualquier logaritmo se reescribe en otra base con log_b(x)=log_k(x)/log_k(b).",
      "Usamos logaritmos naturales internamente por estabilidad numérica.",
      "Requiere x positivo y base b ≠ 1.",
    ],
    steps: ["Enter x > 0 and base b > 0, b ≠ 1.", "Calculate log_b(x).", "Compare with the ln ratio card."],
    stepsEs: ["Ingresá x > 0 y base b > 0, b ≠ 1.", "Calculá log_b(x).", "Compará con la tarjeta del cociente ln."],
    faq: [
      { q: "Common log?", a: "Set base 10." },
      { q: "Natural log?", a: "Set base e ≈ 2.71828, or use the ln tool." },
    ],
    faqEs: [
      { q: "¿Log común?", a: "Usá base 10." },
      { q: "¿Log natural?", a: "Usá base e ≈ 2.71828, o la tool de ln." },
    ],
  },
  "logaritmo-natural": {
    metaTitle: "Natural Log & eˣ Calculator — ln and exp | UtiliHub",
    metaTitleEs: "Calculadora ln y eˣ — logaritmo natural y exponencial | UtiliHub",
    metaDescription: "Compute ln(x) and eˣ with a clean toggle. Free natural log and exponential tool.",
    metaDescriptionEs: "Calculá ln(x) y eˣ con un interruptor simple. Tool gratis de log natural y exponencial.",
    about: [
      "ln is the logarithm base e; exp is its inverse function.",
      "Toggle between ln and eˣ on the same page.",
      "ln requires x > 0; exp accepts any real x.",
    ],
    aboutEs: [
      "ln es el logaritmo en base e; exp es su función inversa.",
      "Alterná entre ln y eˣ en la misma página.",
      "ln requiere x > 0; exp acepta cualquier real.",
    ],
    steps: ["Choose ln or exp.", "Enter x.", "Read the result."],
    stepsEs: ["Elegí ln o exp.", "Ingresá x.", "Leé el resultado."],
    faq: [
      { q: "Value of e?", a: "Approximately 2.718281828…" },
      { q: "ln(1)?", a: "Always 0." },
    ],
    faqEs: [
      { q: "¿Valor de e?", a: "Aproximadamente 2.718281828…" },
      { q: "¿ln(1)?", a: "Siempre 0." },
    ],
  },
  "crecimiento-exponencial": {
    metaTitle: "Exponential Growth & Decay Calculator — A₀e^{kt} | UtiliHub",
    metaTitleEs: "Calculadora crecimiento y decaimiento exponencial — A₀e^{kt} | UtiliHub",
    metaDescription: "Evaluate continuous growth or decay A(t)=A₀e^{kt}. Positive k grows; negative k decays.",
    metaDescriptionEs: "Evaluá crecimiento o decaimiento continuo A(t)=A₀e^{kt}. k positivo crece; k negativo decae.",
    about: [
      "The continuous model A(t)=A₀e^{kt} appears in finance, biology, and physics.",
      "Sign of k selects growth versus decay.",
      "For discrete compounding use (1+r)^t instead.",
    ],
    aboutEs: [
      "El modelo continuo A(t)=A₀e^{kt} aparece en finanzas, biología y física.",
      "El signo de k elige crecimiento o decaimiento.",
      "Para interés compuesto discreto usá (1+r)^t.",
    ],
    steps: ["Enter A₀, k, and t.", "Calculate A(t).", "Read whether the model is growth or decay."],
    stepsEs: ["Ingresá A₀, k y t.", "Calculá A(t).", "Leé si el modelo es crecimiento o decaimiento."],
    faq: [
      { q: "Half-life?", a: "k = −ln(2)/half-life for exponential decay." },
      { q: "Units of k and t?", a: "Must match (e.g. per year and years)." },
    ],
    faqEs: [
      { q: "¿Vida media?", a: "k = −ln(2)/vida_media para decaimiento exponencial." },
      { q: "¿Unidades de k y t?", a: "Deben coincidir (p. ej. por año y años)." },
    ],
  },
};
