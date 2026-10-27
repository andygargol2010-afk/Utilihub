import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-horas-decimal",
  "Hours to Decimal Converter",
  "productividad",
  "converter",
  "Convert hours and minutes to decimal hours for payroll or time tracking.",
  [
    "hours to decimal",
    "convert hours minutes to decimal",
    "conversor horas a decimal",
    "horas y minutos a decimal",
    "decimal hours calculator",
  ],
  {
    title: "Hours to Decimal Converter | Payroll Time | UtiliHub",
    description: "Free hours and minutes to decimal hours converter. Instant result for timesheets. Browser-only.",
    summaryEs: "Convierte horas y minutos a horas decimales para nóminas o seguimiento de tiempo.",
  },
);
tool.faq.push(
  faq(
    "How does it work?",
    "Decimal hours = hours + (minutes / 60). Example: 2h 30m = 2.5.",
  ),
  faq(
    "Why decimal hours?",
    "Common in payroll systems and time tracking software that expect decimal format.",
  ),
);

export const HOURS_TO_DECIMAL_TOOLS = [tool];
