import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-asistencia",
  "Attendance Percentage Calculator",
  "educacion",
  "calculator",
  "Calculate attendance percentage for classes or meetings.",
  [
    "attendance percentage calculator",
    "class attendance percentage",
    "calculadora porcentaje asistencia",
    "porcentaje de asistencia clases",
  ],
  {
    title: "Attendance Percentage Calculator | UtiliHub",
    description: "Free attendance percentage calculator. Total classes and attended. Browser-only.",
    summaryEs: "Calcula el porcentaje de asistencia a clases o reuniones.",
  },
);

export const ATTENDANCE_PERCENTAGE_CALCULATOR_TOOLS = [tool];
