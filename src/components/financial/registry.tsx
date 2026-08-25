import type { ReactNode } from "react";
import CompoundInterest from "./CompoundInterest";
import LoanPayment from "./LoanPayment";
import InvestmentReturn from "./InvestmentReturn";
import SavingsGoal from "./SavingsGoal";
import Inflation from "./Inflation";
import { ADVANCED_FINANCIAL_UI } from "./advanced-registry";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";

export const FINANCIAL_UI:Record<string,()=>ReactNode>={
  "interes-compuesto":()=> <CompoundInterest/>,
  "cuota-de-prestamo":()=> <LoanPayment/>,
  "rentabilidad-de-inversion":()=> <InvestmentReturn/>,
  "objetivo-de-ahorro":()=> <SavingsGoal/>,
  "inflacion-y-poder-adquisitivo":()=> <Inflation/>,
  ...ADVANCED_FINANCIAL_UI,
};

const missingFinancialUi = FINANCIAL_TOOLS.filter((tool) => !FINANCIAL_UI[tool.slug]).map((tool) => tool.slug);
if (missingFinancialUi.length > 0) {
  throw new Error(`Financial catalog contains tools without UI: ${missingFinancialUi.join(", ")}`);
}
