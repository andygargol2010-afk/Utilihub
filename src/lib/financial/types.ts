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

const format = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
export const money = (n: number) => Number.isFinite(n) ? format.format(n) : "Resultado no válido";
export const pct = (n: number) => Number.isFinite(n) ? `${format.format(n)} %` : "Resultado no válido";
export const num = (n: number) => money(n);
