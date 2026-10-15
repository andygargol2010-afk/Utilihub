import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-zonas-frecuencia-cardiaca",
  "Heart Rate Zone Calculator",
  "ciencia",
  "calculator",
  "Calculate heart rate training zones from age or max heart rate. Instant results for cardio workouts.",
  [
    "heart rate zone calculator",
    "calculate heart rate zones",
    "karvonen formula",
    "calculadora zonas frecuencia cardiaca",
    "zonas de entrenamiento cardio",
    "frecuencia cardíaca máxima",
  ],
  {
    title: "Heart Rate Zone Calculator — Training zones by age | UtiliHub",
    description:
      "Free heart rate zone calculator. Enter age or max HR to get 5 training zones (warm-up, fat burn, cardio, threshold, peak). Based on % of max HR. Runs locally.",
  },
);
tool.faq.push(
  faq(
    "How are heart rate zones calculated?",
    "Zones use percentages of maximum heart rate (220 - age, or your measured max). Zone 1: 50-60%, Zone 2: 60-70%, Zone 3: 70-80%, Zone 4: 80-90%, Zone 5: 90-100%.",
  ),
);
tool.faq.push(
  faq(
    "What if I know my max heart rate?",
    "Enter your measured max HR instead of age for more accurate zones. The tool prioritizes the max HR input when provided.",
  ),
);

export const HEART_RATE_ZONE_TOOLS = [tool];
