import type { ReactNode } from "react";
import { AdvancedCalculator } from "./AdvancedCalculator";
import { INVESTMENT_TOOLS } from "@/lib/financial/investment";
import { LOAN_TOOLS } from "@/lib/financial/loans";
import { SAVINGS_TOOLS } from "@/lib/financial/savings";
import { INFLATION_TOOLS } from "@/lib/financial/inflation";
import { MARKET_TOOLS } from "@/lib/financial/market";
import { PORTFOLIO_TOOLS } from "@/lib/financial/portfolio";
import { RETIREMENT_TOOLS } from "@/lib/financial/retirement";
import { FIXED_INCOME_TOOLS } from "@/lib/financial/fixed-income";
import { TAX_TOOLS } from "@/lib/financial/tax";

const definitions=[...INVESTMENT_TOOLS,...LOAN_TOOLS,...SAVINGS_TOOLS,...INFLATION_TOOLS,...MARKET_TOOLS,...PORTFOLIO_TOOLS,...RETIREMENT_TOOLS,...FIXED_INCOME_TOOLS,...TAX_TOOLS];
export const ADVANCED_FINANCIAL_UI:Record<string,()=>ReactNode>=Object.fromEntries(definitions.map((definition)=>[definition.slug,()=> <AdvancedCalculator definition={definition}/>]));
