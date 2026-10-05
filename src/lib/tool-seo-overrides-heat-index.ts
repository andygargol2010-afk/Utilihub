import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_HEAT_INDEX: Record<string, ToolSeoOverride> = {
  "calculadora-sensacion-termica": {
    metaTitle: "Heat Index and Wind Chill Calculator | UtiliHub",
    metaTitleEs: "Calculadora de sensación térmica | UtiliHub",
    metaDescription:
      "Calculate heat index from temperature and humidity, or wind chill from wind speed. Celsius or Fahrenheit. Free, in the browser.",
    metaDescriptionEs:
      "Calculá el índice de calor con humedad o el wind chill con viento. En Celsius o Fahrenheit. Gratis, en el navegador.",
    about: [
      "Enter air temperature in Celsius or Fahrenheit, then choose heat index or wind chill. Heat index uses the U.S. National Weather Service Rothfusz regression when the simple estimate is at least 80 °F, with the low-humidity and high-humidity adjustments. Below that, it uses the NWS simple formula. Wind chill uses the 2001 NWS equation: 35.74 + 0.6215T − 35.75V^0.16 + 0.4275TV^0.16, with T in °F and V in mph.",
      "A 32 °C afternoon at 70% relative humidity is about 90 °F and 70% humidity, which lands near 40 °C feels-like on the heat index (extreme caution). The same air at 40% humidity feels closer to the thermometer. A 0 °C reading with a 20 km/h wind is about 32 °F and 12 mph, which the wind-chill equation puts a few degrees below freezing. At −15 °C and 40 km/h the feels-like value drops into the frostbite planning band.",
      "Presets cover a humid afternoon, extreme heat, a cold breeze, and severe cold. Heat-index bands follow the NWS chart: caution from 80 °F, extreme caution from 90 °F, danger from 103 °F, and extreme danger from 125 °F. Wind-chill frostbite times are planning approximations (about 30, 10, and 5 minutes), not a medical forecast. The heat index is intended around 80 °F and 40% humidity or higher; wind chill is intended at or below 50 °F with wind of at least 3 mph. Outside those ranges the tool still shows a number and marks it as a guide.",
      "Nothing is uploaded. Empty values, temperatures outside −60 to 55 °C, humidity outside 0–100%, and wind above 150 km/h are rejected. The scientific temperature tool converts Celsius, Fahrenheit, and Kelvin. This one only estimates how hot or cold the air feels.",
    ],
    aboutEs: [
      "Ingresá la temperatura del aire en Celsius o Fahrenheit y elegí índice de calor o wind chill. El índice de calor usa la regresión Rothfusz del NWS cuando la estimación simple llega a 80 °F, con los ajustes de humedad baja y alta. Por debajo usa la fórmula simple del NWS. El wind chill usa la ecuación NWS 2001: 35,74 + 0,6215T − 35,75V^0,16 + 0,4275TV^0,16, con T en °F y V en mph.",
      "Una tarde de 32 °C con 70% de humedad relativa equivale a unos 90 °F y 70% de humedad, y el índice de calor queda cerca de 40 °C de sensación (precaución extrema). El mismo aire con 40% de humedad se acerca más al termómetro. Un aire de 0 °C con 20 km/h de viento es unos 32 °F y 12 mph, y la ecuación deja la sensación unos grados bajo cero. A −15 °C y 40 km/h el valor cae en la banda de planificación de congelación.",
      "Los presets cubren una tarde húmeda, calor extremo, frío con brisa y frío severo. Las bandas de calor siguen la tabla del NWS: precaución desde 80 °F, precaución extrema desde 90 °F, peligro desde 103 °F y peligro extremo desde 125 °F. Los tiempos de congelación son aproximaciones de planificación (unos 30, 10 y 5 minutos), no un pronóstico médico. El índice de calor está pensado cerca de 80 °F y 40% de humedad o más; el wind chill, a 50 °F o menos y con viento de al menos 3 mph. Fuera de eso la tool igual muestra un número y lo marca como orientativo.",
      "No se sube nada. Se rechazan valores vacíos, temperaturas fuera de −60 a 55 °C, humedad fuera de 0–100% y viento por encima de 150 km/h. La tool de temperatura científica convierte Celsius, Fahrenheit y Kelvin. Esta solo estima cómo se siente el aire.",
    ],
    steps: [
      "Choose heat index or wind chill, and Celsius or Fahrenheit.",
      "Enter the air temperature and either relative humidity or wind speed.",
      "Use a preset if you want a worked example before changing the numbers.",
      "Read the feels-like value, the difference from the air, and the planning band, then copy the result.",
    ],
    stepsEs: [
      "Elegí índice de calor o wind chill, y Celsius o Fahrenheit.",
      "Cargá la temperatura del aire y la humedad relativa o la velocidad del viento.",
      "Usá un preset si querés un ejemplo resuelto antes de cambiar los números.",
      "Leé la sensación térmica, la diferencia con el aire y la banda de planificación, y copiá el resultado.",
    ],
    faq: [
      {
        q: "How is the heat index calculated?",
        a: "Above a simple estimate of 80 °F, it uses the NWS Rothfusz regression on temperature in °F and relative humidity, plus the official low-humidity and high-humidity adjustments. Below 80 °F it uses the NWS simple average formula.",
      },
      {
        q: "How is wind chill calculated?",
        a: "Wind chill (°F) = 35.74 + 0.6215T − 35.75V^0.16 + 0.4275TV^0.16, with wind in mph. Under 3 mph the tool reports the air temperature, because the equation is not defined for calm air.",
      },
      {
        q: "Is this the same as humidex?",
        a: "No. Humidex is the Canadian index. This tool uses the U.S. NWS heat index and the 2001 NWS wind-chill equation. The numbers are close in hot humid weather, but they are not interchangeable.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Temperature, humidity, and wind stay on your device. The bands are planning labels, not a medical or forecast service.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el índice de calor?",
        a: "Si la estimación simple llega a 80 °F, usa la regresión Rothfusz del NWS con temperatura en °F y humedad relativa, más los ajustes oficiales de humedad baja y alta. Por debajo de 80 °F usa la fórmula simple del NWS.",
      },
      {
        q: "¿Cómo se calcula el wind chill?",
        a: "Wind chill (°F) = 35,74 + 0,6215T − 35,75V^0,16 + 0,4275TV^0,16, con el viento en mph. Con menos de 3 mph la tool muestra la temperatura del aire, porque la ecuación no está definida en calma.",
      },
      {
        q: "¿Es lo mismo que el humidex?",
        a: "No. El humidex es el índice canadiense. Esta tool usa el índice de calor del NWS de Estados Unidos y la ecuación de wind chill de 2001. En calor húmedo se parecen, pero no son intercambiables.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. La temperatura, la humedad y el viento quedan en tu dispositivo. Las bandas son etiquetas de planificación, no un servicio médico ni un pronóstico.",
      },
    ],
  },
};
