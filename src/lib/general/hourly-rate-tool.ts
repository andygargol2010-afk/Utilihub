import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tarifa-horaria",
  "Hourly Rate Calculator",
  "productividad",
  "calculator",
  "Convert annual salary to hourly rate or calculate annual from hourly pay. Instant results with custom hours and weeks.",
  [
    "hourly rate calculator",
    "salary to hourly",
    "annual to hourly rate",
    "calculadora tarifa horaria",
    "salario a hora",
    "sueldo anual a por hora",
  ],
  {
    title: "Hourly Rate Calculator — Annual Salary to Hourly Pay | UtiliHub",
    description:
      "Free hourly rate calculator. Convert annual salary to hourly wage or reverse, with custom work hours per week and weeks per year. Instant browser calculation.",
  },
);
tool.faq.push(
  faq(
    "How is the hourly rate calculated?",
    "Hourly rate = annual salary / (hours per week × weeks per year). Default is 40 hours × 52 weeks = 2080 hours/year.",
  ),
);
tool.faq.push(
  faq(
    "What if I work part-time or have unpaid time off?",
    "Adjust the hours per week and weeks per year to match your actual paid work schedule for a more accurate rate.",
  ),
);

export const HOURLY_RATE_TOOLS = [tool];
