/** Unique SEO for percentage-suite calculators — no generic templates. */

export type ToolSeoOverridePercent = {
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

export const TOOL_SEO_OVERRIDES_PERCENT: Record<string, ToolSeoOverridePercent> = {
  "porcentaje-aumento": {
    metaTitle: "Percentage Increase Calculator — From Old to New Value | UtiliHub",
    metaTitleEs: "Calculadora de aumento porcentual — de valor inicial a final | UtiliHub",
    metaDescription:
      "Calculate percentage increase between two numbers: ((new − old) ÷ old) × 100. Free, instant, no signup.",
    metaDescriptionEs:
      "Calculá el aumento porcentual entre dos números: ((nuevo − inicial) ÷ inicial) × 100. Gratis, al instante, sin registro.",
    about: [
      "Percentage increase measures relative growth from a baseline. From 80 to 100 is +25%, not +20 points on a 100 scale.",
      "Marketers, analysts, and students use it for KPIs, prices, and scores whenever the starting value is the reference.",
      "The tool also shows absolute change and the growth multiplier so you can cross-check the percent.",
    ],
    aboutEs: [
      "El aumento porcentual mide el crecimiento relativo respecto a un punto de partida. De 80 a 100 es +25%, no +20 puntos.",
      "Sirve para KPIs, precios y notas cuando el valor inicial es la referencia.",
      "También muestra el cambio absoluto y el factor de crecimiento para contrastar el porcentaje.",
    ],
    steps: [
      "Enter the initial value and the new value.",
      "Calculate to get the percentage increase.",
      "Use the absolute change card if you also need the raw difference.",
    ],
    stepsEs: [
      "Ingresá el valor inicial y el valor nuevo.",
      "Calculá para obtener el aumento porcentual.",
      "Usá la tarjeta de diferencia absoluta si también necesitás el cambio en unidades.",
    ],
    faq: [
      { q: "Percentage increase vs percentage points?", a: "Points are the arithmetic gap between two percents. Increase is relative to the starting amount." },
      { q: "Why is zero baseline invalid?", a: "Dividing by zero is undefined. Report an absolute change instead." },
    ],
    faqEs: [
      { q: "¿Aumento porcentual o puntos porcentuales?", a: "Los puntos son la resta entre dos porcentajes. El aumento es relativo al valor inicial." },
      { q: "¿Por qué no sirve un inicial en cero?", a: "Dividir por cero no está definido. Informá el cambio absoluto." },
    ],
  },
  "porcentaje-disminucion": {
    metaTitle: "Percentage Decrease Calculator — Relative Drop From Baseline | UtiliHub",
    metaTitleEs: "Calculadora de disminución porcentual — caída relativa | UtiliHub",
    metaDescription:
      "Find percentage decrease from an original value to a lower one. Free online relative-drop calculator.",
    metaDescriptionEs:
      "Obtené la disminución porcentual desde un valor original a uno menor. Calculadora online gratis.",
    about: [
      "Percentage decrease answers how large a cut is relative to where you started — standard for discounts and losses.",
      "A fall from 200 to 150 is a 25% decrease. The absolute loss is 50 units.",
      "If the second value is higher, the signed result turns negative; switch framing to percentage increase.",
    ],
    aboutEs: [
      "La disminución porcentual indica qué tan grande fue el recorte respecto al punto de partida.",
      "Bajar de 200 a 150 es una caída del 25%. La pérdida absoluta es 50 unidades.",
      "Si el segundo valor es mayor, el signo se invierte: conviene usar la calculadora de aumento.",
    ],
    steps: [
      "Enter the original value and the value after the drop.",
      "Calculate the percentage decrease.",
      "Check units lost for the absolute interpretation.",
    ],
    stepsEs: [
      "Ingresá el valor original y el valor después de la baja.",
      "Calculá la disminución porcentual.",
      "Revisá las unidades perdidas para la lectura absoluta.",
    ],
    faq: [
      { q: "Same as sale discount tools?", a: "Discount tools often apply a known % to a price. Here you recover the % from two observed amounts." },
      { q: "Weight-loss example?", a: "Yes — use starting weight and current weight as the two inputs." },
    ],
    faqEs: [
      { q: "¿Es igual a una calculadora de descuento?", a: "Las de descuento suelen aplicar un % conocido al precio. Aquí recuperás el % a partir de dos montos." },
      { q: "¿Sirve para pérdida de peso?", a: "Sí: peso inicial y peso actual como entradas." },
    ],
  },
  "diferencia-porcentual": {
    metaTitle: "Percentage Difference Calculator — Symmetric Comparison | UtiliHub",
    metaTitleEs: "Calculadora de diferencia porcentual — comparación simétrica | UtiliHub",
    metaDescription:
      "Symmetric percentage difference of two values versus their average. Free peer-comparison tool.",
    metaDescriptionEs:
      "Diferencia porcentual simétrica entre dos valores respecto a su promedio. Herramienta gratis.",
    about: [
      "Percentage difference treats both numbers as peers by dividing the gap by their midpoint.",
      "Swapping A and B does not change the result — unlike percentage change, which needs a baseline.",
      "Use it for lab replicates, competing quotes, or any pair without a clear “before” value.",
    ],
    aboutEs: [
      "La diferencia porcentual trata ambos números como pares al dividir la brecha por el punto medio.",
      "Intercambiar A y B no cambia el resultado, a diferencia del cambio porcentual.",
      "Útil en réplicas de laboratorio, cotizaciones rivales o pares sin un “antes” claro.",
    ],
    steps: [
      "Enter value A and value B.",
      "Calculate to get the percentage difference.",
      "Prefer percentage change if one value is the official baseline.",
    ],
    stepsEs: [
      "Ingresá el valor A y el valor B.",
      "Calculá la diferencia porcentual.",
      "Preferí el cambio porcentual si uno de los valores es la base oficial.",
    ],
    faq: [
      { q: "Why the average in the denominator?", a: "The midpoint keeps the measure symmetric for unordered pairs." },
      { q: "Both zero?", a: "Undefined — there is no scale to compare." },
    ],
    faqEs: [
      { q: "¿Por qué el promedio en el denominador?", a: "El punto medio mantiene la medida simétrica para pares sin orden." },
      { q: "¿Ambos en cero?", a: "Indefinido: no hay escala para comparar." },
    ],
  },
  "porcentaje-de-porcentaje": {
    metaTitle: "Percent of a Percent Calculator — Multiply Two Rates | UtiliHub",
    metaTitleEs: "Calculadora porcentaje de un porcentaje — producto de tasas | UtiliHub",
    metaDescription:
      "What is 30% of 40%? Multiply percentage rates correctly (result: 12%). Free stacked-percent tool.",
    metaDescriptionEs:
      "¿Cuánto es 30% de 40%? Multiplicá tasas porcentuales bien (resultado: 12%). Herramienta gratis.",
    about: [
      "Stacked percentages multiply as decimals: 30% of 40% is 0.12 of the whole, written 12%.",
      "People often add rates by mistake (30+40=70). This calculator prevents that error.",
      "An example card scales the combined rate onto a base of 1000 for intuition.",
    ],
    aboutEs: [
      "Los porcentajes encadenados se multiplican en decimal: 30% de 40% es 0,12 del total (12%).",
      "Es habitual sumar por error (30+40=70). Esta calculadora evita ese fallo.",
      "Una tarjeta de ejemplo aplica la tasa combinada sobre una base de 1000.",
    ],
    steps: [
      "Enter the first percent and the second percent.",
      "Calculate the combined percent of the whole.",
      "Use the example-on-1000 card to sanity-check magnitude.",
    ],
    stepsEs: [
      "Ingresá el primer y el segundo porcentaje.",
      "Calculá el porcentaje combinado del total.",
      "Usá el ejemplo sobre 1000 para validar la magnitud.",
    ],
    faq: [
      { q: "Compound interest?", a: "No — this multiplies two static rates, not growth over periods." },
      { q: "Does order matter?", a: "No for the product of two rates." },
    ],
    faqEs: [
      { q: "¿Es interés compuesto?", a: "No: multiplica dos tasas fijas, no un crecimiento por periodos." },
      { q: "¿Importa el orden?", a: "No para el producto de dos tasas." },
    ],
  },
  "porcentaje-hasta-meta": {
    metaTitle: "Percent to Goal Calculator — Progress & Remaining | UtiliHub",
    metaTitleEs: "Calculadora porcentaje de meta — progreso y restante | UtiliHub",
    metaDescription:
      "Track progress toward a target: percent complete, percent left, and units still needed. Free goal tracker math.",
    metaDescriptionEs:
      "Seguí el progreso hacia una meta: % completo, % que falta y unidades por alcanzar. Gratis.",
    about: [
      "Goal progress is current divided by target, shown as a percent. Remaining units are target minus current when positive.",
      "Fundraising thermometers, sales quotas, and savings goals all use this framing.",
      "Overshooting the goal reports progress above 100% so you can see excess clearly.",
    ],
    aboutEs: [
      "El progreso es actual ÷ meta, en porcentaje. Las unidades restantes son meta − actual cuando es positivo.",
      "Recaudaciones, cuotas de ventas y metas de ahorro usan este enfoque.",
      "Si te pasás de la meta, el progreso supera el 100% para ver el excedente.",
    ],
    steps: [
      "Enter current amount and goal amount.",
      "Calculate progress and remaining.",
      "Adjust inputs as the real-world total updates.",
    ],
    stepsEs: [
      "Ingresá la cantidad actual y la meta.",
      "Calculá progreso y restante.",
      "Actualizá las entradas cuando cambie el total real.",
    ],
    faq: [
      { q: "Zero goal?", a: "Not allowed — pick a positive target." },
      { q: "Negative current?", a: "Mathematically allowed; unusual for most progress UIs." },
    ],
    faqEs: [
      { q: "¿Meta en cero?", a: "No permitido: elegí una meta positiva." },
      { q: "¿Actual negativo?", a: "Válido matemáticamente; raro en barras de progreso." },
    ],
  },
  "fraccion-a-porcentaje": {
    metaTitle: "Fraction to Percent Calculator — a/b → % | UtiliHub",
    metaTitleEs: "Calculadora fracción a porcentaje — a/b → % | UtiliHub",
    metaDescription:
      "Convert any fraction to a percentage: (numerator ÷ denominator) × 100. Free fraction-to-percent tool.",
    metaDescriptionEs:
      "Convertí cualquier fracción a porcentaje: (numerador ÷ denominador) × 100. Gratis.",
    about: [
      "Fractions map to percents by dividing and scaling by 100 — 3/4 is 75%, 5/4 is 125%.",
      "Teachers and students use this bridge between ratio form and the percent language of reports.",
      "Denominator zero is rejected; improper fractions are fully supported.",
    ],
    aboutEs: [
      "Las fracciones pasan a porcentaje dividiendo y multiplicando por 100: 3/4 es 75%, 5/4 es 125%.",
      "Une la forma de razón con el lenguaje porcentual de informes y exámenes.",
      "Denominador cero se rechaza; las fracciones impropias están soportadas.",
    ],
    steps: [
      "Enter numerator and denominator.",
      "Calculate the percentage and decimal.",
      "Simplify offline if you need lowest terms.",
    ],
    stepsEs: [
      "Ingresá numerador y denominador.",
      "Calculá el porcentaje y el decimal.",
      "Simplificá aparte si necesitás términos mínimos.",
    ],
    faq: [
      { q: "Decimals in the fraction?", a: "Yes — non-integer parts are accepted in either field." },
      { q: "Mixed numbers?", a: "Convert to an improper fraction first (1 1/2 → 3/2)." },
    ],
    faqEs: [
      { q: "¿Decimales en la fracción?", a: "Sí: se aceptan partes no enteras en ambos campos." },
      { q: "¿Números mixtos?", a: "Pasá primero a fracción impropia (1 1/2 → 3/2)." },
    ],
  },
  "tiempo-duplicacion": {
    metaTitle: "Doubling Time Calculator — Growth Rate to Periods | UtiliHub",
    metaTitleEs: "Calculadora de tiempo de duplicación — tasa a periodos | UtiliHub",
    metaDescription:
      "Exact doubling time from a constant growth rate: ln(2)/ln(1+r/100). Includes rule-of-72 comparison.",
    metaDescriptionEs:
      "Tiempo de duplicación exacto con tasa constante: ln(2)/ln(1+r/100). Incluye comparación con la regla del 72.",
    about: [
      "Doubling time asks how many periods until a quantity multiplies by two at a steady percent rate.",
      "The exact formula uses natural logs; the rule of 72 is a fast mental estimate shown alongside.",
      "The period unit must match how the rate was measured (per year, per month, etc.).",
    ],
    aboutEs: [
      "El tiempo de duplicación pregunta cuántos periodos faltan para multiplicar por dos a una tasa constante.",
      "La fórmula exacta usa logaritmos naturales; la regla del 72 es la estimación rápida que mostramos al lado.",
      "La unidad del periodo debe coincidir con cómo mediste la tasa (año, mes, etc.).",
    ],
    steps: [
      "Enter growth rate as percent per period.",
      "Calculate periods to double.",
      "Compare with the rule-of-72 approximation.",
    ],
    stepsEs: [
      "Ingresá la tasa de crecimiento en % por periodo.",
      "Calculá los periodos para duplicar.",
      "Compará con la aproximación de la regla del 72.",
    ],
    faq: [
      { q: "Rule of 72 accuracy?", a: "It is close for mid-single-digit rates; this tool’s log formula is exact under constant growth." },
      { q: "Negative rates?", a: "Decline has no doubling time — the rate must be positive." },
    ],
    faqEs: [
      { q: "¿Qué tan precisa es la regla del 72?", a: "Aproxima bien en tasas de un dígito medio; la fórmula logarítmica es exacta con crecimiento constante." },
      { q: "¿Tasas negativas?", a: "La caída no tiene tiempo de duplicación: la tasa debe ser positiva." },
    ],
  },
  "markup-vs-margen": {
    metaTitle: "Markup vs Margin Converter — Cost Markup ↔ Price Margin | UtiliHub",
    metaTitleEs: "Conversor markup vs margen — sobre costo ↔ sobre precio | UtiliHub",
    metaDescription:
      "Convert markup on cost to margin on selling price and back. Avoid the classic 50% markup ≠ 50% margin error.",
    metaDescriptionEs:
      "Convertí markup sobre costo a margen sobre precio de venta y viceversa. Evitá el error clásico 50% ≠ 50%.",
    about: [
      "Markup divides profit by cost; margin divides profit by selling price. They only match at 0%.",
      "A 50% markup equals a 33.33% margin. Teams that mix the terms misprice products.",
      "Toggle the input mode to convert whichever figure you were given.",
    ],
    aboutEs: [
      "El markup divide la ganancia por el costo; el margen, por el precio de venta. Solo coinciden en 0%.",
      "Un markup del 50% equivale a un margen del 33,33%. Mezclar términos desordena el precio.",
      "Cambiá el modo de entrada según el dato que te hayan pasado.",
    ],
    steps: [
      "Select whether you know markup % or margin %.",
      "Enter that percentage.",
      "Read the equivalent value on the other definition.",
    ],
    stepsEs: [
      "Elegí si conocés el markup % o el margen %.",
      "Ingresá ese porcentaje.",
      "Leé el valor equivalente en la otra definición.",
    ],
    faq: [
      { q: "Which do retailers use?", a: "Financial reporting usually focuses on margin; purchasing talks often start from markup." },
      { q: "Margin near 100%?", a: "Markup grows without bound as margin approaches 100% (cost near zero)." },
    ],
    faqEs: [
      { q: "¿Qué usan los comercios?", a: "Los reportes financieros suelen hablar de margen; las compras, de markup." },
      { q: "¿Margen cerca de 100%?", a: "El markup crece sin techo cuando el margen se acerca a 100% (costo casi cero)." },
    ],
  },
};
