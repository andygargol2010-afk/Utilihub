import type { FinancialDefinition } from "./types";
import { money, num, pct, financialValue } from "./types";

const f = (key: string, label: string, defaultValue: number, unit = "") => ({
  key,
  label,
  defaultValue,
  unit,
});

const futureDca = (
  initial: number,
  monthly: number,
  annualRate: number,
  months: number,
) => {
  const r = annualRate / 100 / 12;
  if (months <= 0) return initial;
  if (r === 0) return initial + monthly * months;
  const factor = Math.pow(1 + r, months);
  return initial * factor + monthly * (factor - 1) / r;
};

export const INVESTMENT_TOOLS: FinancialDefinition[] = [
  {
    slug: "cagr",
    fields: [
      f("start", "Initial capital", 10000, "$"),
      f("end", "Final value", 15000, "$"),
      f("years", "Years", 5),
    ],
    calculate: (v) => {
      if (financialValue(v, "start") <= 0 || financialValue(v, "end") <= 0 || financialValue(v, "years") <= 0) {
        throw Error("Capitals and years must be greater than 0.");
      }
      const r = Math.pow(financialValue(v, "end") / financialValue(v, "start"), 1 / financialValue(v, "years")) - 1;
      return [
        { label: "CAGR", value: pct(r * 100) },
        { label: "Gain", value: money(financialValue(v, "end") - financialValue(v, "start")) },
      ];
    },
  },
  {
    slug: "roi",
    fields: [
      f("cost", "Initial cost", 10000, "$"),
      f("end", "Final value", 12500, "$"),
      f("fees", "Additional costs", 0, "$"),
    ],
    calculate: (v) => {
      if (financialValue(v, "cost") <= 0) throw Error("Initial cost must be greater than 0.");
      const roi = ((financialValue(v, "end") - financialValue(v, "cost") - financialValue(v, "fees")) / financialValue(v, "cost")) * 100;
      return [
        { label: "ROI", value: pct(roi) },
        { label: "Net profit", value: money(financialValue(v, "end") - financialValue(v, "cost") - financialValue(v, "fees")) },
      ];
    },
  },
  {
    slug: "rentabilidad-anualizada",
    fields: [
      f("start", "Initial capital", 10000, "$"),
      f("end", "Final capital", 12000, "$"),
      f("days", "Days invested", 365),
    ],
    calculate: (v) => {
      if (financialValue(v, "start") <= 0 || financialValue(v, "end") <= 0 || financialValue(v, "days") <= 0) {
        throw Error("Capitals and days must be greater than 0.");
      }
      const r = (Math.pow(financialValue(v, "end") / financialValue(v, "start"), 365 / financialValue(v, "days")) - 1) * 100;
      return [{ label: "Annualized return", value: pct(r) }];
    },
  },
  {
    slug: "punto-equilibrio-inversion",
    fields: [
      f("cost", "Invested capital", 10000, "$"),
      f("fees", "Total costs", 100, "$"),
      f("price", "Current price per unit", 50, "$"),
      f("units", "Units", 200),
    ],
    calculate: (v) => {
      if (financialValue(v, "units") <= 0 || financialValue(v, "price") <= 0) {
        throw Error("Price and units must be greater than 0.");
      }
      const target = financialValue(v, "cost") + financialValue(v, "fees");
      const current = financialValue(v, "price") * financialValue(v, "units");
      return [
        { label: "Value needed to recover costs", value: money(target) },
        { label: "Break-even price per unit", value: money(target / financialValue(v, "units")) },
        { label: "Required increase", value: pct((target / current - 1) * 100) },
      ];
    },
  },
  {
    slug: "drawdown",
    fields: [
      f("peak", "Historical high", 100, "$"),
      f("trough", "Subsequent low", 80, "$"),
    ],
    calculate: (v) => {
      if (financialValue(v, "peak") <= 0 || financialValue(v, "trough") < 0) {
        throw Error("Maximum must be greater than 0 and minimum cannot be negative.");
      }
      return [
        { label: "Drawdown", value: pct((financialValue(v, "trough") / financialValue(v, "peak") - 1) * 100) },
        { label: "Loss", value: money(financialValue(v, "peak") - financialValue(v, "trough")) },
      ];
    },
  },
  {
    slug: "precio-medio-de-compra",
    fields: [
      f("q1", "Purchase quantity 1", 100),
      f("p1", "Purchase price 1", 20, "$"),
      f("q2", "Purchase quantity 2", 50),
      f("p2", "Purchase price 2", 15, "$"),
      f("q3", "Purchase quantity 3", 0),
      f("p3", "Purchase price 3", 15, "$"),
    ],
    calculate: (v) => {
      const q = financialValue(v, "q1") + financialValue(v, "q2") + financialValue(v, "q3");
      if (q <= 0) throw Error("Total quantity must be greater than 0.");
      const total = financialValue(v, "q1") * financialValue(v, "p1") + financialValue(v, "q2") * financialValue(v, "p2") + financialValue(v, "q3") * financialValue(v, "p3");
      return [
        { label: "Total quantity", value: num(q) },
        { label: "Total cost", value: money(total) },
        { label: "Average price", value: money(total / q) },
      ];
    },
  },
  {
    slug: "dca",
    fields: [
      f("initial", "Initial capital", 1000, "$"),
      f("monthly", "Monthly contribution", 300, "$"),
      f("rate", "Estimated annual return", 8, "%"),
      f("years", "Years", 10),
    ],
    calculate: (v) => {
      if (financialValue(v, "years") < 0) throw Error("Years cannot be negative.");
      const n = Math.floor(financialValue(v, "years") * 12);
      const fv = futureDca(financialValue(v, "initial"), financialValue(v, "monthly"), financialValue(v, "rate"), n);
      const contributed = financialValue(v, "initial") + financialValue(v, "monthly") * n;
      return [
        { label: "Projected capital", value: money(fv) },
        { label: "Total contributed", value: money(contributed) },
        { label: "Growth", value: money(fv - contributed) },
      ];
    },
  },
  {
    slug: "riesgo-beneficio",
    fields: [
      f("entry", "Entry", 100, "$"),
      f("stop", "Stop", 95, "$"),
      f("target", "Target", 115, "$"),
    ],
    calculate: (v) => {
      const risk = financialValue(v, "entry") - financialValue(v, "stop");
      const reward = financialValue(v, "target") - financialValue(v, "entry");
      if (risk <= 0) throw Error("Stop must be below entry for a long position.");
      if (reward < 0) throw Error("Target must be above entry.");
      return [
        { label: "Risk", value: money(risk) },
        { label: "Potential reward", value: money(reward) },
        { label: "Risk/reward ratio", value: `1:${money(reward / risk)}` },
      ];
    },
  },
  {
    slug: "tamano-de-posicion",
    fields: [
      f("capital", "Capital", 10000, "$"),
      f("risk", "Maximum risk", 1, "%"),
      f("entry", "Entry", 50, "$"),
      f("stop", "Stop", 47, "$"),
    ],
    calculate: (v) => {
      if (financialValue(v, "capital") <= 0 || financialValue(v, "risk") <= 0 || financialValue(v, "entry") <= financialValue(v, "stop") || financialValue(v, "stop") < 0) {
        throw Error("Capital and risk must be positive; entry must be greater than stop.");
      }
      const risk = financialValue(v, "capital") * financialValue(v, "risk") / 100;
      const per = financialValue(v, "entry") - financialValue(v, "stop");
      return [
        { label: "Maximum risk", value: money(risk) },
        { label: "Risk per unit", value: money(per) },
        { label: "Position size", value: num(Math.floor(risk / per)) },
      ];
    },
  },
  {
    slug: "rebalanceo-de-cartera",
    fields: [
      f("portfolio", "Portfolio value", 10000, "$"),
      f("current", "Current weight", 70, "%"),
      f("target", "Target weight", 60, "%"),
    ],
    calculate: (v) => {
      if (financialValue(v, "portfolio") < 0 || financialValue(v, "current") < 0 || financialValue(v, "target") < 0 || financialValue(v, "current") > 100 || financialValue(v, "target") > 100) {
        throw Error("Portfolio and weights must be valid.");
      }
      const current = financialValue(v, "portfolio") * financialValue(v, "current") / 100;
      const target = financialValue(v, "portfolio") * financialValue(v, "target") / 100;
      return [
        { label: "Current value", value: money(current) },
        { label: "Target value", value: money(target) },
        { label: "Buy/sell", value: money(target - current) },
      ];
    },
  },
  {
    slug: "asignacion-de-cartera",
    fields: [
      f("stocks", "Stocks", 60, "%"),
      f("bonds", "Bonds", 30, "%"),
      f("cash", "Cash", 10, "%"),
    ],
    calculate: (v) => {
      const total = financialValue(v, "stocks") + financialValue(v, "bonds") + financialValue(v, "cash");
      return [
        { label: "Total allocation", value: pct(total) },
        { label: "Status", value: Math.abs(total - 100) < 0.01 ? "OK" : "Must sum to 100%" },
      ];
    },
  },
  {
    slug: "rentabilidad-real",
    fields: [
      f("nominal", "Nominal return", 10, "%"),
      f("inflation", "Inflation", 4, "%"),
    ],
    calculate: (v) => {
      if (financialValue(v, "inflation") <= -100) throw Error("Inflation must be greater than -100%.");
      const r = ((1 + financialValue(v, "nominal") / 100) / (1 + financialValue(v, "inflation") / 100) - 1) * 100;
      return [{ label: "Real return", value: pct(r) }];
    },
  },
  {
    slug: "comparador-de-inversiones",
    fields: [
      f("a", "Final capital A", 12000, "$"),
      f("b", "Final capital B", 13500, "$"),
      f("initial", "Initial common capital", 10000, "$"),
    ],
    calculate: (v) => {
      if (financialValue(v, "initial") <= 0) throw Error("Initial capital must be greater than 0.");
      return [
        { label: "Return A", value: pct((financialValue(v, "a") / financialValue(v, "initial") - 1) * 100) },
        { label: "Return B", value: pct((financialValue(v, "b") / financialValue(v, "initial") - 1) * 100) },
        { label: "Best result", value: financialValue(v, "a") > financialValue(v, "b") ? "Investment A" : financialValue(v, "a") < financialValue(v, "b") ? "Investment B" : "Tie" },
      ];
    },
  },
];
