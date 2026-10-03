import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_STAIR: Record<string, ToolSeoOverride> = {
  "calculadora-escalera": {
    metaTitle: "Stair calculator — rise, run, stringer",
    metaTitleEs: "Calculadora de escaleras — peldaños y zanca",
    metaDescription:
      "Calculate riser count, tread depth, total run, stringer length, and angle from floor-to-floor height. Blondel comfort check. Runs locally.",
    metaDescriptionEs:
      "Calculá cantidad de contrahuellas, huella, desarrollo, longitud de zanca y ángulo según la altura entre pisos. Control de Blondel. Local.",
    about: [
      "This stair calculator sizes a single straight flight. Enter the floor-to-floor rise and a target riser; it rounds to a whole number of risers and shows the actual riser height, total run, stringer length, and slope angle.",
      "For a typical floor-to-floor stair the number of treads is one less than the number of risers, because the upper floor is the last landing. Switch to “treads equal risers” when you are counting a deck or a flight that includes the top tread in the run.",
      "Comfort uses Blondel’s rule: twice the riser plus the tread should land near 63 cm, usually acceptable between 60 and 65 cm. A 17–18 cm riser with a 27–29 cm tread is a common residential target. The stringer length is the hypotenuse of total rise and total run.",
      "It is a planning aid, not a code certificate. Local rules for max riser, min tread, nosing, headroom, and handrails differ. It does not draw winders, landings mid-flight, or spiral stairs, and it ignores nosing overlap.",
    ],
    aboutEs: [
      "Esta calculadora dimensiona un tramo recto. Cargá la altura entre pisos y una contrahuella objetivo; redondea a un número entero de contrahuellas y muestra la altura real, el desarrollo, la longitud de zanca y el ángulo.",
      "En una escalera de piso a piso, las huellas suelen ser una menos que las contrahuellas, porque el piso superior es el último descanso. Usá “huellas = contrahuellas” en un deck o cuando el desarrollo incluye la huella superior.",
      "La comodidad sigue la regla de Blondel: dos veces la contrahuella más la huella cerca de 63 cm, aceptable en general entre 60 y 65 cm. Una contrahuella de 17–18 cm con huella de 27–29 cm es un objetivo habitual en vivienda. La zanca es la hipotenusa del desnivel y del desarrollo.",
      "Sirve para planear, no para certificar normativa. Los máximos de contrahuella, mínimos de huella, vuelo, altura libre y barandas cambian según el lugar. No dibuja compensadas, descansos intermedios ni caracol, y no descuenta el vuelo de la huella.",
    ],
    steps: [
      "Enter the floor-to-floor rise in centimeters and a target riser.",
      "Set the tread depth and whether treads equal risers or risers minus one.",
      "Apply a preset if you want a comfortable house flight, a 2.7 m floor, or a steeper attic.",
      "Read riser count, actual riser, total run, stringer length, angle, and the Blondel check.",
      "Copy the summary before buying stringers or marking the layout.",
    ],
    stepsEs: [
      "Ingresá el desnivel entre pisos en centímetros y la contrahuella objetivo.",
      "Definí la huella y si las huellas igualan a las contrahuellas o son una menos.",
      "Usá un preset para una escalera cómoda, un piso de 2,7 m o un altillo más empinado.",
      "Leé cantidad de contrahuellas, altura real, desarrollo, zanca, ángulo y el control de Blondel.",
      "Copiá el resumen antes de comprar zancas o marcar el replanteo.",
    ],
    faq: [
      {
        q: "How is the number of steps calculated?",
        a: "Riser count is the floor-to-floor rise divided by the target riser, rounded to the nearest whole number (minimum 1). Actual riser height is total rise divided by that count, so every riser is equal.",
      },
      {
        q: "Why are there fewer treads than risers?",
        a: "On a straight flight between two floors the top floor is the last landing, so treads = risers − 1. Choose the other mode if your run includes a top tread, as on many decks.",
      },
      {
        q: "What is the Blondel rule?",
        a: "2 × riser + tread ≈ 63 cm. The tool flags values outside 60–65 cm as less comfortable. It is a proportion check, not a building-code pass.",
      },
      {
        q: "Does this replace the local stair code?",
        a: "No. Many codes cap residential risers around 18–20 cm and ask for treads of at least 25–28 cm, plus headroom and handrails. Confirm the rule that applies to your project.",
      },
      {
        q: "Is the layout uploaded?",
        a: "No. Rise, tread, and the result stay in the browser. Nothing is sent to a server.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de peldaños?",
        a: "Las contrahuellas son el desnivel dividido por la contrahuella objetivo, redondeado al entero más cercano (mínimo 1). La altura real es el desnivel total dividido por esa cantidad, así todas quedan iguales.",
      },
      {
        q: "¿Por qué hay menos huellas que contrahuellas?",
        a: "En un tramo de piso a piso el piso de arriba es el último descanso, así que huellas = contrahuellas − 1. Elegí el otro modo si el desarrollo incluye la huella superior, como en muchos decks.",
      },
      {
        q: "¿Qué es la regla de Blondel?",
        a: "2 × contrahuella + huella ≈ 63 cm. La herramienta marca fuera de 60–65 cm como menos cómodo. Es un control de proporción, no un aprobado de código.",
      },
      {
        q: "¿Reemplaza la normativa local?",
        a: "No. Muchas normas limitan la contrahuella residencial a unos 18–20 cm y piden huellas de al menos 25–28 cm, más altura libre y baranda. Confirmá la regla de tu obra.",
      },
      {
        q: "¿Se sube el replanteo?",
        a: "No. El desnivel, la huella y el resultado quedan en el navegador. No se envían a un servidor.",
      },
    ],
  },
};
