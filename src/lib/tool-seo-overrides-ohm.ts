import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_OHM: Record<string, ToolSeoOverride> = {
  "ley-de-ohm": {
    metaTitle: "Ohm's Law Calculator — V = I × R, Volts Amps Ohms | UtiliHub",
    metaTitleEs: "Ley de Ohm — calculadora de voltios, amperios y ohmios | UtiliHub",
    metaDescription:
      "Ohm's law calculator: solve V = I × R for voltage, current, or resistance. Enter two known values in volts, amps, or ohms. Free in the browser.",
    metaDescriptionEs:
      "Calculadora de la ley de Ohm: resolvé V = I × R para tensión, corriente o resistencia. Ingresá dos valores en voltios, amperios u ohmios. Gratis en el navegador.",
    about: [
      "Ohm's law relates the three basic electrical quantities of a resistive circuit: V = I × R, with voltage in volts (V), current in amperes (A), and resistance in ohms (Ω).",
      "Enter any two of the three values and the tool solves the third: I = V / R, R = V / I, and V = I × R. Power follows as P = V × I in watts.",
      "The calculation runs locally in the browser and assumes an ohmic conductor: resistance stays constant with temperature, and AC reactance is out of scope.",
    ],
    aboutEs: [
      "La ley de Ohm relaciona las tres magnitudes eléctricas básicas de un circuito resistivo: V = I × R, con tensión en voltios (V), corriente en amperios (A) y resistencia en ohmios (Ω).",
      "Ingresá dos de los tres valores y la herramienta resuelve el tercero: I = V / R, R = V / I y V = I × R. La potencia sale como P = V × I en vatios.",
      "El cálculo corre localmente en el navegador y asume un conductor óhmico: la resistencia no cambia con la temperatura y no cubre reactancias de corriente alterna.",
    ],
    steps: [
      "Enter two of the three values: voltage (V), current (A), or resistance (Ω).",
      "The missing value and the power in watts update instantly.",
      "Copy the result. Nothing is uploaded to any server.",
    ],
    stepsEs: [
      "Ingresá dos de los tres valores: tensión (V), corriente (A) o resistencia (Ω).",
      "El valor que falta y la potencia en vatios se actualizan al instante.",
      "Copiá el resultado. No se sube nada a ningún servidor.",
    ],
    faq: [
      { q: "What is the formula of Ohm's law?", a: "V = I × R: voltage in volts equals current in amperes times resistance in ohms. Rearranged, I = V / R and R = V / I." },
      { q: "How do I calculate power from Ohm's law?", a: "P = V × I in watts. Combining with Ohm's law also gives P = I² × R and P = V² / R." },
      { q: "Does it work for AC circuits?", a: "Only for purely resistive loads. AC circuits with coils or capacitors need impedance, not just resistance." },
    ],
    faqEs: [
      { q: "¿Cuál es la fórmula de la ley de Ohm?", a: "V = I × R: la tensión en voltios es la corriente en amperios por la resistencia en ohmios. Despejado, I = V / R y R = V / I." },
      { q: "¿Cómo calculo la potencia con la ley de Ohm?", a: "P = V × I en vatios. Combinando con la ley de Ohm también sale P = I² × R y P = V² / R." },
      { q: "¿Sirve para corriente alterna?", a: "Solo para cargas puramente resistivas. Los circuitos de CA con bobinas o capacitores necesitan impedancia, no solo resistencia." },
    ],
  },
};
