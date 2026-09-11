import type { FinancialDefinition } from "./types";
import { financialValue, money, num, pct } from "./types";

const f = (key: string, label: string, defaultValue: number, unit = "") => ({ key, label, defaultValue, unit });

export const ADVANCED_FINANCIAL_TOOLS: FinancialDefinition[] = [
  {
    slug: "valoracion-dcf",
    fields: [
      f("fcf", "Current free cash flow", 100000, "$"),
      f("growth", "Annual growth", 8, "%"),
      f("wacc", "WACC", 10, "%"),
      f("terminalGrowth", "Terminal growth", 2, "%"),
      f("years", "Projection years", 5),
    ],
    calculate: (v) => {
      if (financialValue(v, "fcf") <= 0 || financialValue(v, "years") < 1 || financialValue(v, "wacc") <= financialValue(v, "terminalGrowth")) {
        throw Error("Cash flow must be positive, years at least 1, and WACC greater than terminal growth.");
      }
      const g = financialValue(v, "growth") / 100;
      const r = financialValue(v, "wacc") / 100;
      const tg = financialValue(v, "terminalGrowth") / 100;
      let pv = 0;
      for (let t = 1; t <= financialValue(v, "years"); t++) {
        pv += financialValue(v, "fcf") * Math.pow(1 + g, t) / Math.pow(1 + r, t);
      }
      const last = financialValue(v, "fcf") * Math.pow(1 + g, financialValue(v, "years"));
      const terminal = last * (1 + tg) / (r - tg);
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
  {
    slug: "calculadora-wacc",
    fields: [
      f("equity", "Equity value", 700000, "$"),
      f("debt", "Interest-bearing debt", 300000, "$"),
      f("re", "Cost of equity", 12, "%"),
      f("rd", "Cost of debt", 6, "%"),
      f("tax", "Tax rate", 25, "%"),
    ],
    calculate: (v) => {
      if (financialValue(v, "equity") < 0 || financialValue(v, "debt") < 0 || financialValue(v, "tax") < 0 || financialValue(v, "tax") > 100) {
        throw Error("Capital and debt must be non-negative and the tax rate must be between 0% and 100%.");
      }
      const total = financialValue(v, "equity") + financialValue(v, "debt");
      const we = total ? financialValue(v, "equity") / total : 0;
      const wd = total ? financialValue(v, "debt") / total : 0;
      const afterTax = financialValue(v, "rd") * (1 - financialValue(v, "tax") / 100);
      const wacc = we * financialValue(v, "re") + wd * afterTax;
      return [
        { label: "WACC", value: pct(wacc) },
        { label: "After-tax cost of debt", value: pct(afterTax) },
        { label: "Equity weight", value: pct(we * 100) },
        { label: "Debt weight", value: pct(wd * 100) },
      ];
    },
    note: "WACC combines the cost of equity and the after-tax cost of debt according to their market weights.",
  },
  {
    slug: "cobertura-del-servicio-de-la-deuda",
    fields: [
      f("ebitda", "EBITDA or operating cash flow", 120000, "$"),
      f("service", "Annual debt service", 80000, "$"),
      f("interest", "Annual interest", 20000, "$"),
    ],
    calculate: (v) => {
      const dscr = financialValue(v, "service") ? financialValue(v, "ebitda") / financialValue(v, "service") : Number.NaN;
      return [
        { label: "DSCR", value: Number.isFinite(dscr) ? `${num(dscr)}x` : "Undefined" },
        { label: "Interest coverage", value: financialValue(v, "interest") ? `${num(financialValue(v, "ebitda") / financialValue(v, "interest"))}x` : "Undefined" },
      ];
    },
    note: "A DSCR above 1x indicates that operating cash flow covers annual debt service. Acceptable thresholds depend on the lender and sector.",
  },
  {
    slug: "ciclo-de-conversion-de-efectivo",
    fields: [
      f("receivables", "Accounts receivable", 50000, "$"),
      f("inventory", "Inventory", 40000, "$"),
      f("payables", "Accounts payable", 30000, "$"),
      f("sales", "Annual sales", 500000, "$"),
      f("cogs", "Annual cost of sales", 300000, "$"),
    ],
    calculate: (v) => {
      const dso = financialValue(v, "sales") ? financialValue(v, "receivables") / financialValue(v, "sales") * 365 : 0;
      const dio = financialValue(v, "cogs") ? financialValue(v, "inventory") / financialValue(v, "cogs") * 365 : 0;
      const dpo = financialValue(v, "cogs") ? financialValue(v, "payables") / financialValue(v, "cogs") * 365 : 0;
      return [
        { label: "Days sales outstanding", value: `${num(dso)} days` },
        { label: "Days inventory outstanding", value: `${num(dio)} days` },
        { label: "Days payable outstanding", value: `${num(dpo)} days` },
        { label: "Cash conversion cycle", value: `${num(dso + dio - dpo)} days` },
      ];
    },
    note: "The cash conversion cycle estimates how many days cash stays tied up in operations before being recovered through collections.",
  },
  {
    slug: "apalancamiento-neto",
    fields: [
      f("debt", "Financial debt", 400000, "$"),
      f("cash", "Cash and equivalents", 50000, "$"),
      f("ebitda", "EBITDA", 100000, "$"),
      f("equity", "Equity", 800000, "$"),
    ],
    calculate: (v) => {
      const net = financialValue(v, "debt") - financialValue(v, "cash");
      return [
        { label: "Net debt", value: money(net) },
        { label: "Net debt / EBITDA", value: financialValue(v, "ebitda") ? num(net / financialValue(v, "ebitda")) : "Undefined" },
        { label: "Debt / equity", value: financialValue(v, "equity") ? num(financialValue(v, "debt") / financialValue(v, "equity")) : "Undefined" },
        { label: "Net debt / equity", value: financialValue(v, "equity") ? num(net / financialValue(v, "equity")) : "Undefined" },
      ];
    },
    note: "Leverage ratios are indicative metrics and should be compared with similar companies and applicable financial covenants.",
  },
  {
    slug: "calculadora-roic",
    fields: [
      f("nopat", "NOPAT", 80000, "$"),
      f("invested", "Invested capital", 500000, "$"),
      f("wacc", "WACC", 10, "%"),
    ],
    calculate: (v) => {
      const roic = financialValue(v, "invested") ? financialValue(v, "nopat") / financialValue(v, "invested") * 100 : Number.NaN;
      return [
        { label: "ROIC", value: Number.isFinite(roic) ? pct(roic) : "Undefined" },
        { label: "Value creation spread", value: Number.isFinite(roic) ? pct(roic - financialValue(v, "wacc")) : "Undefined" },
      ];
    },
    note: "ROIC compares NOPAT with invested capital. A positive spread versus WACC suggests value creation under these assumptions.",
  },
  {
    slug: "runway-y-burn-rate",
    fields: [
      f("cash", "Available cash", 200000, "$"),
      f("income", "Monthly income", 10000, "$"),
      f("expenses", "Monthly expenses", 25000, "$"),
      f("growth", "Monthly income growth", 2, "%"),
    ],
    calculate: (v) => {
      let cash = financialValue(v, "cash");
      let income = financialValue(v, "income");
      const expenses = financialValue(v, "expenses");
      let months = 0;
      while (cash > 0 && months < 240) {
        cash = cash + income - expenses;
        income *= 1 + financialValue(v, "growth") / 100;
        months++;
      }
      return [
        { label: "Estimated runway (months)", value: months >= 240 ? "More than 20 years" : String(months) },
        { label: "Ending cash for the horizon", value: money(cash) },
      ];
    },
    note: "Runway estimate with income growing at a constant monthly rate and constant monthly expenses. Does not model debt, taxes, or seasonality.",
  },
  {
    slug: "apalancamiento-operativo",
    fields: [
      f("price", "Price per unit", 50, "$"),
      f("variable", "Variable cost per unit", 20, "$"),
      f("fixed", "Fixed costs for the period", 30000, "$"),
      f("units", "Units sold", 2000),
    ],
    calculate: (v) => {
      if (financialValue(v, "price") <= financialValue(v, "variable") || financialValue(v, "units") <= 0) {
        throw Error("Price must exceed variable cost, and units must be greater than 0.");
      }
      const contrib = financialValue(v, "price") - financialValue(v, "variable");
      const breakEven = financialValue(v, "fixed") / contrib;
      const profit = contrib * financialValue(v, "units") - financialValue(v, "fixed");
      const dol = profit ? (contrib * financialValue(v, "units")) / profit : Number.NaN;
      return [
        { label: "Contribution margin", value: money(contrib) },
        { label: "Break-even point", value: `${num(breakEven)} units` },
        { label: "Operating profit", value: money(profit) },
        { label: "Operating leverage", value: Number.isFinite(dol) ? `${num(dol)}x` : "Undefined" },
      ];
    },
    note: "Operating leverage shows how much operating profit can change when sales change, due to the weight of fixed costs.",
  },
  {
    slug: "modelo-de-crecimiento-de-dividendos",
    fields: [
      f("dividend", "Annual dividend per share", 2, "$"),
      f("growth", "Expected growth", 4, "%"),
      f("required", "Required return", 10, "%"),
    ],
    calculate: (v) => {
      if (financialValue(v, "dividend") <= 0 || financialValue(v, "required") <= financialValue(v, "growth")) {
        throw Error("Dividend must be positive and required return must exceed expected growth.");
      }
      const next = financialValue(v, "dividend") * (1 + financialValue(v, "growth") / 100);
      const price = next / ((financialValue(v, "required") - financialValue(v, "growth")) / 100);
      return [
        { label: "Next expected dividend", value: money(next) },
        { label: "Theoretical value per share", value: money(price) },
        { label: "Growth margin", value: pct(financialValue(v, "required") - financialValue(v, "growth")) },
      ];
    },
    note: "Gordon growth model with constant growth. Highly sensitive to the gap between required return and growth.",
  },
  {
    slug: "margen-de-seguridad",
    fields: [
      f("sales", "Current sales", 200000, "$"),
      f("breakEven", "Break-even sales", 120000, "$"),
      f("target", "Target sales", 250000, "$"),
      f("margin", "Expected net margin", 15, "%"),
    ],
    calculate: (v) => {
      const sales = financialValue(v, "sales");
      const breakEven = financialValue(v, "breakEven");
      const target = financialValue(v, "target");
      const margin = financialValue(v, "margin") / 100;
      if (sales <= 0 || breakEven < 0 || target <= 0 || margin < 0 || margin > 1) throw Error("Sales must be positive and margin must be between 0% and 100%.");
      const safety = (sales - breakEven) / sales * 100;
      const targetProfit = target * margin;
      return [
        { label: "Current margin of safety", value: pct(safety) },
        { label: "Sales above break-even", value: money(sales - breakEven) },
        { label: "Profit at target sales", value: money(targetProfit) },
        { label: "Growth to target", value: pct((target / sales - 1) * 100) },
      ];
    },
    note: "The margin of safety estimates how far sales can fall before reaching break-even.",
  },
];
