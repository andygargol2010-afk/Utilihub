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

const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
export const money = (n: number) => Number.isFinite(n) ? format.format(n) : "Invalid result";
export const pct = (n: number) => Number.isFinite(n) ? `${format.format(n)} %` : "Invalid result";
export const num = (n: number) => money(n);
export const financialValue = (values: Record<string, number>, key: string): number => {
  const value = values[key] ?? Number.NaN;
  if (!Number.isFinite(value)) throw Error(`The value «${key}» is not valid.`);
  return value;
};
