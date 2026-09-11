import type { FinancialDefinition } from "./types";
import { financialValue, money, num, pct } from "./types";

const f = (key: string, label: string, defaultValue: number, unit = "") => ({
  key,
  label,
  defaultValue,
  unit,
});

export const ADVANCED_FINANCIAL_TOOLS: FinancialDefinition[] = [
  {
    slug: "dcf-simple",
    fields: [
      f("fcf", "Free cash flow", 100000, "$"),
      f("wacc", "WACC", 10, "%"),
      f("growth", "Terminal growth", 2, "%"),
      f("years", "Projection years", 5),
    ],
    calculate: (v) => {
      if (financialValue(v, "fcf") <= 0 || financialValue(v, "years") < 1 || financialValue(v, "wacc") <= financialValue(v, "growth")) {
        throw Error("Cash flow must be positive, years at least 1, and WACC greater than terminal growth.");
      }
      const g = financialValue(v, "growth") / 100;
      const r = financialValue(v, "wacc") / 100;
      let pv = 0;
      for (let t = 1; t <= financialValue(v, "years"); t++) {
        pv += financialValue(v, "fcf") * Math.pow(1 + g, t) / Math.pow(1 + r, t);
      }
      const terminal = financialValue(v, "fcf") * Math.pow(1 + g, financialValue(v, "years") + 1) / (r - g);
      const terminalPv = terminal / Math.pow(1 + r, financialValue(v, "years"));
      return [
        { label: "Present value of cash flows", value: money(pv) },
        { label: "Present terminal value", value: money(terminalPv) },
        { label: "Estimated enterprise value", value: money(pv + terminalPv) },
        { label: "Terminal value weight", value: pct((terminalPv / (pv + terminalPv)) * 100) },
      ];
    },
    note: "Simplified DCF model: uses free cash flow, WACC, and constant terminal growth. Does not replace a full financial model or professional valuation.",
  },
];
