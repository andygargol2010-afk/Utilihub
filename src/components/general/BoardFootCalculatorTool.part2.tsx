// Part 2 of 3 — split from BoardFootCalculatorTool.tsx on 2026-11-04. Edit here; BoardFootCalculatorTool.tsx re-exports.

export type Unit = "in" | "mm";
export type Basis = "actual" | "nominal";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const IN_PER_MM = 1 / 25.4;
export const FT_PER_M = 3.280839895;
export const M3_PER_BF = 0.002359737;

export type SizePreset = {
  id: string;
  label: string;
  labelEs: string;
  nominalT: number;
  nominalW: number;
  actualT: number;
  actualW: number;
};

export const SIZES: SizePreset[] = [
  { id: "2x4", label: "2×4", labelEs: "2×4", nominalT: 2, nominalW: 4, actualT: 1.5, actualW: 3.5 },
  { id: "2x6", label: "2×6", labelEs: "2×6", nominalT: 2, nominalW: 6, actualT: 1.5, actualW: 5.5 },
  { id: "2x8", label: "2×8", labelEs: "2×8", nominalT: 2, nominalW: 8, actualT: 1.5, actualW: 7.25 },
  { id: "2x10", label: "2×10", labelEs: "2×10", nominalT: 2, nominalW: 10, actualT: 1.5, actualW: 9.25 },
  { id: "2x12", label: "2×12", labelEs: "2×12", nominalT: 2, nominalW: 12, actualT: 1.5, actualW: 11.25 },
  { id: "4x4", label: "4×4", labelEs: "4×4", nominalT: 4, nominalW: 4, actualT: 3.5, actualW: 3.5 },
  { id: "1x6", label: "1×6", labelEs: "1×6", nominalT: 1, nominalW: 6, actualT: 0.75, actualW: 5.5 },
  { id: "1x8", label: "1×8", labelEs: "1×8", nominalT: 1, nominalW: 8, actualT: 0.75, actualW: 7.25 },
];

export type Row = { id: string; label: string; thickness: string; width: string; length: string; qty: string };

export function uid() {
  return Math.random().toString(36).slice(2, 8);
}

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

export function blankRow(partial?: Partial<Row>): Row {
  return {
    id: uid(),
    label: partial?.label ?? "",
    thickness: partial?.thickness ?? "",
    width: partial?.width ?? "",
    length: partial?.length ?? "",
    qty: partial?.qty ?? "1",
  };
}

export const PRESET_ROWS: Record<string, { unit: Unit; basis: Basis; waste: string; rows: Omit<Row, "id">[] }> = {
  studs: {
    unit: "in",
    basis: "actual",
    waste: "10",
    rows: [{ label: "2x4 studs", thickness: "1.5", width: "3.5", length: "8", qty: "20" }],
  },
  joists: {
    unit: "in",
    basis: "nominal",
    waste: "10",
    rows: [{ label: "2x8 joists", thickness: "2", width: "8", length: "12", qty: "10" }],
  },
  posts: {
    unit: "in",
    basis: "actual",
    waste: "5",
    rows: [{ label: "4x4 posts", thickness: "3.5", width: "3.5", length: "8", qty: "6" }],
  },
  metric: {
    unit: "mm",
    basis: "actual",
    waste: "10",
    rows: [{ label: "estante", thickness: "20", width: "200", length: "1.8", qty: "4" }],
  },
};
