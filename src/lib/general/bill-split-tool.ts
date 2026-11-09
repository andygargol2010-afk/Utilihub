import { makeTool, faq } from "./types";

const tool = makeTool(
  "dividir-cuenta",
  "Bill Split Calculator",
  "utilidades",
  "calculator",
  "Split a restaurant or group bill fairly among people, including optional tip and rounding.",
  [
    "bill split calculator",
    "split the bill",
    "divide check",
    "dividir cuenta",
    "repartir cuenta entre amigos",
    "calculadora dividir cuenta",
  ],
  {
    title: "Bill Split Calculator — Divide the Check with Tip | UtiliHub",
    description:
      "Free bill splitter. Enter total, tip percentage, number of people, and optional rounding. Instant per-person amount. Runs locally in the browser.",
  },
);
tool.faq.push(
  faq(
    "How does the tip work?",
    "Tip is calculated as a percentage of the pre-tip total. You can set 0% for no tip or any positive percentage.",
  ),
);
tool.faq.push(
  faq(
    "What does rounding do?",
    "Optional rounding makes each share cleaner (to nearest cent, 0.50, or 1.00). The difference is absorbed so the sum still matches the final total as closely as possible.",
  ),
);

export const BILL_SPLIT_TOOLS = [tool];
