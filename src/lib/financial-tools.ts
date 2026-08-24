import { FINANCIAL_CATALOG } from "./financial/catalog";
export type { FinancialMeta as FinancialTool } from "./financial/catalog";
export const FINANCIAL_TOOLS=FINANCIAL_CATALOG.map((tool)=>({...tool,category:"finanzas" as const}));
export const financialToolBySlug=(slug:string)=>FINANCIAL_TOOLS.find((tool)=>tool.slug===slug);
