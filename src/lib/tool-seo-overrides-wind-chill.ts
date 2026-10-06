import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_WIND_CHILL: Record<string, ToolSeoOverride> = {
  "calculadora-enfriamiento-viento": {
    metaTitle: "Wind Chill Calculator — NWS Formula in °F or °C | UtiliHub",
    metaTitleEs: "Calculadora de wind chill — fórmula NWS en °C o °F | UtiliHub",
    metaDescription:
      "Calculate NWS 2001 wind chill from air temperature and wind speed in °C or °F and km/h or mph, with calm-wind and frostbite notes.",
    metaDescriptionEs:
      "Calculá el wind chill NWS 2001 con temperatura y viento en °C o °F y km/h o mph, con nota de viento calmo y bandas de congelación.",
    about: [
      "Wind chill is not heat index. Heat index uses temperature and humidity in hot weather. This tool uses the NWS 2001 cold-wind formula.",
      "The formula is 35.74 + 0.6215T − 35.75V^0.16 + 0.4275T·V^0.16, with T in °F and V in mph. Celsius and km/h are converted first.",
      "The formula applies only when air is at or below 50°F and wind is at least 3 mph. Otherwise the result equals the air temperature.",
    ],
    aboutEs: [
      "El wind chill no es el índice de calor. El índice de calor usa temperatura y humedad en clima cálido. Esta herramienta usa la fórmula NWS 2001 de viento frío.",
      "La fórmula es 35.74 + 0.6215T − 35.75V^0.16 + 0.4275T·V^0.16, con T en °F y V en mph. °C y km/h se convierten antes.",
      "La fórmula aplica solo si el aire está a 50°F o menos y el viento es de al menos 3 mph. Si no, el resultado es la temperatura del aire.",
    ],
    steps: [
      "Enter air temperature and choose °C or °F.",
      "Enter wind speed and choose km/h or mph.",
      "Read wind chill in both units, the formula note, and the NWS frostbite band.",
      "Copy the summary, load a preset, or reset. Nothing is uploaded.",
    ],
    stepsEs: [
      "Ingresá la temperatura del aire y elegí °C o °F.",
      "Ingresá el viento y elegí km/h o mph.",
      "Leé el wind chill en ambas unidades, la nota de fórmula y la banda NWS de congelación.",
      "Copiá el resumen, cargá un preset o reiniciá. No se sube nada.",
    ],
    faq: [
      {
        q: "What is 0°F at 15 mph?",
        a: "The NWS formula gives about −19.4°F (−28.5°C). V^0.16 for 15 mph is about 1.542, so 35.74 − 35.75×1.542 ≈ −19.4.",
      },
      {
        q: "What is 0°C at 20 km/h?",
        a: "0°C is 32°F and 20 km/h is about 12.4 mph. The same formula gives about 22.6°F, or −5.2°C.",
      },
      {
        q: "Why is calm wind or warm air unchanged?",
        a: "Below 3 mph or above 50°F the NWS 2001 formula is outside its range, so wind chill equals air temperature. Zero wind is calm. A negative wind speed is rejected.",
      },
      {
        q: "What happens with an empty field or NaN?",
        a: "An empty temperature or wind, text, or a non-finite value blocks the result. Wind cannot be negative. Temperature is limited to −80 through 60 in the selected unit.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuánto es 0°F con 15 mph?",
        a: "La fórmula NWS da unos −19.4°F (−28.5°C). V^0.16 de 15 mph es cerca de 1.542, así que 35.74 − 35.75×1.542 ≈ −19.4.",
      },
      {
        q: "¿Cuánto es 0°C con 20 km/h?",
        a: "0°C son 32°F y 20 km/h son unos 12.4 mph. La misma fórmula da unos 22.6°F, o −5.2°C.",
      },
      {
        q: "¿Por qué el viento calmo o el aire templado no cambian?",
        a: "Por debajo de 3 mph o por encima de 50°F la fórmula NWS 2001 está fuera de rango, así que el wind chill es la temperatura del aire. Viento cero es calmo. Un viento negativo se rechaza.",
      },
      {
        q: "¿Qué pasa con un campo vacío o NaN?",
        a: "Temperatura o viento vacíos, texto o un valor no finito no dan resultado. El viento no puede ser negativo. La temperatura va de −80 a 60 en la unidad elegida.",
      },
    ],
  },
};