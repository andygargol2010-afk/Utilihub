import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ACCELERATION: Record<string, ToolSeoOverride> = {
  "calculadora-aceleracion": {
    metaTitle: "Acceleration Calculator — Δv over time in m/s² or ft/s² | UtiliHub",
    metaTitleEs: "Calculadora de aceleración — Δv y tiempo, en m/s² o ft/s² | UtiliHub",
    metaDescription:
      "Free acceleration calculator: a = (vf − vi) / t. Enter initial velocity, final velocity and time to get acceleration in m/s² or ft/s², with the conversion shown. Runs in your browser.",
    metaDescriptionEs:
      "Calculadora de aceleración gratis: a = (vf − vi) / t. Ingresá velocidad inicial, velocidad final y tiempo y obtené la aceleración en m/s² o ft/s², con la conversión incluida. En el navegador, sin registro.",
    about: [
      "Acceleration is the change in velocity per unit of time: a = (vf − vi) / t, where vf is the final velocity, vi the initial velocity, and t the elapsed time in seconds. The velocities and the result must use the same unit system: m/s and seconds give m/s², ft/s and seconds give ft/s².",
      "Example: a car going from 0 to 20 m/s in 5 s accelerates at (20 − 0) / 5 = 4 m/s². Braking from 10 m/s to a stop in 2 s gives (0 − 10) / 2 = −5 m/s²; the negative sign means deceleration. The tool also shows the result converted to the other system (1 m/s² ≈ 3.28084 ft/s²).",
      "The result is average acceleration over the interval. If the velocity changed unevenly, this is the mean value, not the instantaneous peak. Time must be greater than zero: with t = 0 the quotient is undefined and the tool shows a warning instead of dividing by zero.",
    ],
    aboutEs: [
      "La aceleración es el cambio de velocidad por unidad de tiempo: a = (vf − vi) / t, donde vf es la velocidad final, vi la inicial y t el tiempo transcurrido en segundos. Las velocidades y el resultado usan el mismo sistema de unidades: m/s y segundos dan m/s², ft/s y segundos dan ft/s².",
      "Ejemplo: un auto que pasa de 0 a 20 m/s en 5 s acelera a (20 − 0) / 5 = 4 m/s². Frenar de 10 m/s a 0 en 2 s da (0 − 10) / 2 = −5 m/s²; el signo negativo indica desaceleración. La herramienta también muestra el resultado convertido al otro sistema (1 m/s² ≈ 3,28084 ft/s²).",
      "El resultado es la aceleración media del intervalo. Si la velocidad cambió de forma irregular, es el valor medio, no el pico instantáneo. El tiempo debe ser mayor que cero: con t = 0 el cociente no está definido y la herramienta muestra un aviso en lugar de dividir por cero.",
    ],
    steps: [
      "Choose metric (m/s, m/s²) or imperial (ft/s, ft/s²).",
      "Enter the initial velocity, the final velocity, and the time in seconds.",
      "Read the acceleration in the chosen unit and its conversion to the other system.",
      "Use Copy result to clipboard, or Reset to return to the default values.",
    ],
    stepsEs: [
      "Elegí métrico (m/s, m/s²) o imperial (ft/s, ft/s²).",
      "Ingresá la velocidad inicial, la velocidad final y el tiempo en segundos.",
      "Leé la aceleración en la unidad elegida y su conversión al otro sistema.",
      "Usá Copiar resultado para el portapapeles, o Reiniciar para volver a los valores por defecto.",
    ],
    faq: [
      {
        q: "What is the formula for acceleration?",
        a: "a = (vf − vi) / t: final velocity minus initial velocity, divided by the time in seconds. With consistent units, m/s and s give m/s² and ft/s and s give ft/s².",
      },
      {
        q: "What does a negative acceleration mean?",
        a: "That the object is slowing down (deceleration) in the direction of motion. For example, going from 10 m/s to 0 in 2 s gives −5 m/s².",
      },
      {
        q: "What happens if time is zero?",
        a: "Acceleration is undefined because you would divide by zero. The tool shows a warning and asks for a time greater than 0.",
      },
      {
        q: "How do I convert m/s² to ft/s²?",
        a: "Multiply by 3.28084 (1 m/s² ≈ 3.28084 ft/s²). The tool shows both values at once, so no manual conversion is needed.",
      },
      {
        q: "Is this average or instantaneous acceleration?",
        a: "Average: it uses the total velocity change over the whole interval. Instantaneous acceleration would need the velocity profile over time.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuál es la fórmula de la aceleración?",
        a: "a = (vf − vi) / t: velocidad final menos velocidad inicial, dividido por el tiempo en segundos. Con unidades consistentes, m/s y s dan m/s², y ft/s y s dan ft/s².",
      },
      {
        q: "¿Qué significa una aceleración negativa?",
        a: "Que el objeto está frenando (desaceleración) en la dirección del movimiento. Por ejemplo, pasar de 10 m/s a 0 en 2 s da −5 m/s².",
      },
      {
        q: "¿Qué pasa si el tiempo es cero?",
        a: "La aceleración no está definida porque sería una división por cero. La herramienta muestra un aviso y pide un tiempo mayor que 0.",
      },
      {
        q: "¿Cómo convierto m/s² a ft/s²?",
        a: "Multiplicá por 3,28084 (1 m/s² ≈ 3,28084 ft/s²). La herramienta muestra ambos valores a la vez, así que no hace falta convertir a mano.",
      },
      {
        q: "¿Es aceleración media o instantánea?",
        a: "Media: usa el cambio total de velocidad en todo el intervalo. La aceleración instantánea necesitaría el perfil de velocidad en el tiempo.",
      },
    ],
  },
};
