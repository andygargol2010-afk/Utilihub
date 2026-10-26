import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-frecuencia-cardiaca-objetivo",
  "Target Heart Rate Calculator",
  "salud",
  "calculator",
  "Calculate target heart rate for exercise using the 220 - age formula.",
  [
    "target heart rate calculator",
    "training heart rate",
    "calculadora frecuencia cardiaca objetivo",
    "fc objetivo entrenamiento",
    "heart rate zone",
  ],
  {
    title: "Target Heart Rate Calculator | UtiliHub",
    description: "Free target heart rate calculator for workouts. Age and intensity based. Browser-only.",
    summaryEs: "Calcula la frecuencia cardíaca objetivo para entrenamiento (fórmula 220 - edad).",
  },
);

export const TARGET_HEART_RATE_CALCULATOR_TOOLS = [tool];
