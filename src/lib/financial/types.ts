export type FinancialField = {
  key: string;
  label: string;
  unit?: string;
  min?: number;
  step?: number;
  defaultValue: number;
};

export type FinancialResult = { label: string; value: string };

export type FinancialDefinition = {
  slug: string;
  fields: FinancialField[];
  calculate: (values: Record<string, number>) => FinancialResult[];
  note?: string;
};

export const money = (n: number) => new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(Number.isFinite(n) ? n : 0);
export const pct = (n: number) => `${money(n)} %`;
export const num = (n: number) => money(n);
