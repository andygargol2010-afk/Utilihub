import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_POWER: Record<string, ToolSeoOverride> = {
  "potencia-electrica": {
    metaTitle: "Electrical Power Calculator — Watts from Volts and Amps | UtiliHub",
    metaTitleEs: "Potencia eléctrica — calculadora de vatios, voltios y amperios | UtiliHub",
    metaDescription:
      "Electrical power calculator: enter voltage in volts and current in amps to get P = V × I in watts instantly. Free, in the browser, no signup.",
    metaDescriptionEs:
      "Calculadora de potencia eléctrica: ingresá la tensión en voltios y la corriente en amperios para obtener P = V × I en vatios al instante. Gratis en el navegador.",
    about: [
      "Electrical power is the rate at which a circuit converts electrical energy: P = V × I, with power in watts (W), voltage in volts (V), and current in amperes (A).",
      "Enter the voltage and the current; the calculator returns the power in watts. Combined with Ohm's law you can also derive P = I² × R and P = V² / R for a resistive load.",
      "The calculation runs locally in your browser and assumes direct current or purely resistive AC loads; power factor corrections are out of scope.",
    ],
    aboutEs: [
      "La potencia eléctrica es la rapidez con la que un circuito convierte energía eléctrica: P = V × I, con potencia en vatios (W), tensión en voltios (V) y corriente en amperios (A).",
      "Ingresá la tensión y la corriente; la calculadora devuelve la potencia en vatios. Combinado con la ley de Ohm también podés obtener P = I² × R y P = V² / R para una carga resistiva.",
      "El cálculo corre localmente en el navegador y asume corriente continua o cargas de CA puramente resistivas; el factor de potencia está fuera del alcance.",
    ],
    steps: [
      "Enter the voltage in volts (V).",
      "Enter the current in amperes (A).",
      "The power in watts (P = V × I) appears instantly. Nothing is uploaded to any server.",
    ],
    stepsEs: [
      "Ingresá la tensión en voltios (V).",
      "Ingresá la corriente en amperios (A).",
      "La potencia en vatios (P = V × I) aparece al instante. No se sube nada a ningún servidor.",
    ],
    faq: [
      { q: "What is the formula for electrical power?", a: "P = V × I: power in watts equals voltage in volts times current in amperes. With resistance you can also use P = I² × R or P = V² / R." },
      { q: "How many watts is 230 V at 10 A?", a: "P = 230 V × 10 A = 2,300 W, i.e. 2.3 kW." },
      { q: "Does it work for AC appliances?", a: "It gives the apparent power for resistive loads (heaters, incandescent lamps). Motors and reactive loads also need the power factor: P = V × I × cos(φ)." },
    ],
    faqEs: [
      { q: "¿Cuál es la fórmula de la potencia eléctrica?", a: "P = V × I: la potencia en vatios es la tensión en voltios por la corriente en amperios. Con resistencia también podés usar P = I² × R o P = V² / R." },
      { q: "¿Cuántos vatios son 230 V con 10 A?", a: "P = 230 V × 10 A = 2300 W, es decir 2,3 kW." },
      { q: "¿Sirve para aparatos de corriente alterna?", a: "Da la potencia de cargas resistivas (estufas, lámparas incandescentes). Motores y cargas reactivas necesitan además el factor de potencia: P = V × I × cos(φ)." },
    ],
  },
};
