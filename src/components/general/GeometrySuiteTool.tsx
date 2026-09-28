"use client";

import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

function fmt(n: number, d = 6) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(d).replace(/\.?0+$/, "");
}

type Card = { label: string; value: string; hint?: string };
type FieldSpec = { key: string; en: string; es: string; ph: string };

const DEG = Math.PI / 180;

const FIELDS: Record<string, FieldSpec[]> = {
  "formula-heron": [
    { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 3" },
    { key: "b", en: "Side b", es: "Lado b", ph: "e.g. 4" },
    { key: "c", en: "Side c", es: "Lado c", ph: "e.g. 5" },
  ],
  "triangulo-rectangulo": [
    { key: "a", en: "Leg a", es: "Cateto a", ph: "e.g. 3" },
    { key: "b", en: "Leg b", es: "Cateto b", ph: "e.g. 4" },
  ],
  "ley-de-senos": [
    { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 7" },
    { key: "A", en: "Angle A (°)", es: "Ángulo A (°)", ph: "e.g. 40" },
    { key: "b", en: "Side b (optional if B given)", es: "Lado b (opcional si das B)", ph: "e.g. 10" },
    { key: "B", en: "Angle B ° (optional if b given)", es: "Ángulo B ° (opcional si das b)", ph: "e.g. 60" },
  ],
  "ley-de-cosenos": [
    { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 5" },
    { key: "b", en: "Side b", es: "Lado b", ph: "e.g. 6" },
    { key: "cOrC", en: "Side c OR angle C (°)", es: "Lado c O ángulo C (°)", ph: "e.g. 7 or 60" },
  ],
  "distancia-dos-puntos": [
    { key: "x1", en: "x₁", es: "x₁", ph: "e.g. 0" },
    { key: "y1", en: "y₁", es: "y₁", ph: "e.g. 0" },
    { key: "x2", en: "x₂", es: "x₂", ph: "e.g. 3" },
    { key: "y2", en: "y₂", es: "y₂", ph: "e.g. 4" },
  ],
  "punto-medio": [
    { key: "x1", en: "x₁", es: "x₁", ph: "e.g. 0" },
    { key: "y1", en: "y₁", es: "y₁", ph: "e.g. 0" },
    { key: "x2", en: "x₂", es: "x₂", ph: "e.g. 4" },
    { key: "y2", en: "y₂", es: "y₂", ph: "e.g. 6" },
  ],
  "area-poligono-regular": [
    { key: "n", en: "Number of sides n", es: "Número de lados n", ph: "e.g. 6" },
    { key: "s", en: "Side length s", es: "Longitud del lado s", ph: "e.g. 4" },
  ],
  "area-elipse": [
    { key: "a", en: "Semi-axis a", es: "Semieje a", ph: "e.g. 5" },
    { key: "b", en: "Semi-axis b", es: "Semieje b", ph: "e.g. 3" },
  ],
};

function compute(slug: string, v: Record<string, number>, mode: string, es: boolean): Card[] {
  switch (slug) {
    case "formula-heron": {
      const { a, b, c } = v;
      if (a <= 0 || b <= 0 || c <= 0)
        throw new Error(es ? "Los lados deben ser positivos." : "Sides must be positive.");
      if (a + b <= c || a + c <= b || b + c <= a)
        throw new Error(es ? "No cumple la desigualdad triangular." : "Triangle inequality is not satisfied.");
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return [
        { label: es ? "Área" : "Area", value: fmt(area) },
        { label: es ? "Semiperímetro s" : "Semi-perimeter s", value: fmt(s) },
        { label: es ? "Perímetro" : "Perimeter", value: fmt(a + b + c) },
      ];
    }
    case "triangulo-rectangulo": {
      if (mode === "legs") {
        const { a, b } = v;
        if (a <= 0 || b <= 0) throw new Error(es ? "Los catetos deben ser positivos." : "Legs must be positive.");
        const c = Math.hypot(a, b);
        const area = (a * b) / 2;
        const angA = (Math.atan(a / b) * 180) / Math.PI;
        const angB = 90 - angA;
        return [
          { label: es ? "Hipotenusa c" : "Hypotenuse c", value: fmt(c) },
          { label: es ? "Área" : "Area", value: fmt(area) },
          { label: es ? "Ángulo opuesto a a" : "Angle opposite a", value: `${fmt(angA)}°` },
          { label: es ? "Ángulo opuesto a b" : "Angle opposite b", value: `${fmt(angB)}°` },
        ];
      }
      const leg = v.a;
      const hyp = v.b;
      if (leg <= 0 || hyp <= 0) throw new Error(es ? "Valores deben ser positivos." : "Values must be positive.");
      if (leg >= hyp) throw new Error(es ? "El cateto debe ser menor que la hipotenusa." : "Leg must be shorter than hypotenuse.");
      const other = Math.sqrt(hyp * hyp - leg * leg);
      const area = (leg * other) / 2;
      const angOppLeg = (Math.asin(leg / hyp) * 180) / Math.PI;
      return [
        { label: es ? "Otro cateto" : "Other leg", value: fmt(other) },
        { label: es ? "Área" : "Area", value: fmt(area) },
        { label: es ? "Ángulo opuesto al cateto dado" : "Angle opposite given leg", value: `${fmt(angOppLeg)}°` },
        { label: es ? "Ángulo restante" : "Remaining acute angle", value: `${fmt(90 - angOppLeg)}°` },
      ];
    }
    case "ley-de-senos": {
      const a = v.a;
      const A = v.A;
      const b = v.b;
      const B = v.B;
      if (!(a > 0) || !(A > 0 && A < 180))
        throw new Error(es ? "Lado a y ángulo A (0–180°) son obligatorios." : "Side a and angle A (0–180°) are required.");
      const sinA = Math.sin(A * DEG);
      if (Math.abs(sinA) < 1e-15) throw new Error(es ? "sin(A) es ~0; revisá el ángulo." : "sin(A) is ~0; check the angle.");

      if (Number.isFinite(b) && b > 0 && !(Number.isFinite(B) && B > 0)) {
        const ratio = a / sinA;
        const sinB = b / ratio;
        if (sinB > 1 + 1e-9) throw new Error(es ? "No hay triángulo: b es demasiado largo." : "No triangle: b is too long.");
        const clamped = Math.min(1, Math.max(-1, sinB));
        const B1 = (Math.asin(clamped) * 180) / Math.PI;
        const B2 = 180 - B1;
        const cards: Card[] = [
          { label: es ? "Ángulo B (principal)" : "Angle B (principal)", value: `${fmt(B1)}°` },
          { label: "a / sin(A)", value: fmt(ratio) },
        ];
        if (B2 > 0 && B2 < 180 && Math.abs(B2 - B1) > 1e-6 && A + B2 < 180) {
          cards.push({ label: es ? "Ángulo B (alternativo SSA)" : "Angle B (SSA alternate)", value: `${fmt(B2)}°` });
        }
        return cards;
      }
      if (Number.isFinite(B) && B > 0 && B < 180) {
        const ratio = a / sinA;
        const sideB = ratio * Math.sin(B * DEG);
        return [
          { label: es ? "Lado b" : "Side b", value: fmt(sideB) },
          { label: "a / sin(A)", value: fmt(ratio) },
          { label: es ? "Ángulo restante estimado C" : "Estimated remaining angle C", value: `${fmt(180 - A - B)}°` },
        ];
      }
      throw new Error(es ? "Indicá lado b o ángulo B además de a y A." : "Provide side b or angle B in addition to a and A.");
    }
    case "ley-de-cosenos": {
      const { a, b, cOrC } = v;
      if (a <= 0 || b <= 0) throw new Error(es ? "Los lados a y b deben ser positivos." : "Sides a and b must be positive.");
      if (mode === "side") {
        const C = cOrC;
        if (!(C > 0 && C < 180)) throw new Error(es ? "El ángulo C debe estar entre 0° y 180°." : "Angle C must be between 0° and 180°.");
        const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * DEG));
        return [
          { label: es ? "Lado c" : "Side c", value: fmt(c) },
          { label: es ? "Perímetro" : "Perimeter", value: fmt(a + b + c) },
        ];
      }
      const c = cOrC;
      if (c <= 0) throw new Error(es ? "El lado c debe ser positivo." : "Side c must be positive.");
      if (a + b <= c || a + c <= b || b + c <= a)
        throw new Error(es ? "No cumple la desigualdad triangular." : "Triangle inequality is not satisfied.");
      const cosC = (a * a + b * b - c * c) / (2 * a * b);
      const clamped = Math.min(1, Math.max(-1, cosC));
      const C = (Math.acos(clamped) * 180) / Math.PI;
      return [
        { label: es ? "Ángulo C" : "Angle C", value: `${fmt(C)}°` },
        { label: "cos(C)", value: fmt(clamped) },
      ];
    }
    case "distancia-dos-puntos": {
      const { x1, y1, x2, y2 } = v;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy);
      return [
        { label: es ? "Distancia" : "Distance", value: fmt(dist) },
        { label: "Δx", value: fmt(dx) },
        { label: "Δy", value: fmt(dy) },
      ];
    }
    case "punto-medio": {
      const { x1, y1, x2, y2 } = v;
      return [
        { label: es ? "Punto medio x" : "Midpoint x", value: fmt((x1 + x2) / 2) },
        { label: es ? "Punto medio y" : "Midpoint y", value: fmt((y1 + y2) / 2) },
        { label: es ? "Coordenada" : "Coordinate", value: `(${fmt((x1 + x2) / 2)}, ${fmt((y1 + y2) / 2)})` },
      ];
    }
    case "area-poligono-regular": {
      const n = v.n;
      const s = v.s;
      if (!Number.isInteger(n) || n < 3)
        throw new Error(es ? "n debe ser un entero ≥ 3." : "n must be an integer ≥ 3.");
      if (s <= 0) throw new Error(es ? "El lado debe ser positivo." : "Side length must be positive.");
      const area = (n * s * s) / (4 * Math.tan(Math.PI / n));
      const perimeter = n * s;
      const apothem = s / (2 * Math.tan(Math.PI / n));
      return [
        { label: es ? "Área" : "Area", value: fmt(area) },
        { label: es ? "Perímetro" : "Perimeter", value: fmt(perimeter) },
        { label: es ? "Apotema" : "Apothem", value: fmt(apothem) },
      ];
    }
    case "area-elipse": {
      const { a, b } = v;
      if (a <= 0 || b <= 0) throw new Error(es ? "Los semiejes deben ser positivos." : "Semi-axes must be positive.");
      const area = Math.PI * a * b;
      return [
        { label: es ? "Área" : "Area", value: fmt(area) },
        { label: es ? "Si fuera círculo (r=a)" : "If it were a circle (r=a)", value: fmt(Math.PI * a * a) },
      ];
    }
    default:
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
  }
}

function formulaHint(slug: string, mode: string): string {
  const map: Record<string, string> = {
    "formula-heron": "Area = √[s(s−a)(s−b)(s−c)], s = (a+b+c)/2",
    "triangulo-rectangulo":
      mode === "legs" ? "c = √(a² + b²), angles via atan" : "other leg = √(c² − leg²)",
    "ley-de-senos": "a / sin(A) = b / sin(B) = c / sin(C)",
    "ley-de-cosenos":
      mode === "side" ? "c² = a² + b² − 2ab cos(C)" : "cos(C) = (a² + b² − c²) / (2ab)",
    "distancia-dos-puntos": "d = √[(x₂−x₁)² + (y₂−y₁)²]",
    "punto-medio": "M = ((x₁+x₂)/2, (y₁+y₂)/2)",
    "area-poligono-regular": "Area = (n·s²) / (4·tan(π/n))",
    "area-elipse": "Area = π·a·b",
  };
  return map[slug] ?? "";
}

export function GeometrySuiteTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const slug = tool.slug;
  const fields = FIELDS[slug] ?? [];
  const needsMode = slug === "triangulo-rectangulo" || slug === "ley-de-cosenos";

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""])),
  );
  const [mode, setMode] = useState(slug === "ley-de-cosenos" ? "side" : "legs");
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const visibleFields = useMemo(() => {
    if (slug === "triangulo-rectangulo") {
      if (mode === "legs") return fields;
      return [
        { key: "a", en: "Known leg", es: "Cateto conocido", ph: "e.g. 3" },
        { key: "b", en: "Hypotenuse", es: "Hipotenusa", ph: "e.g. 5" },
      ];
    }
    if (slug === "ley-de-cosenos") {
      return [
        { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 5" },
        { key: "b", en: "Side b", es: "Lado b", ph: "e.g. 6" },
        mode === "side"
          ? { key: "cOrC", en: "Angle C (°)", es: "Ángulo C (°)", ph: "e.g. 60" }
          : { key: "cOrC", en: "Side c", es: "Lado c", ph: "e.g. 7" },
      ];
    }
    return fields;
  }, [slug, mode, fields]);

  const hint = useMemo(() => formulaHint(slug, mode), [slug, mode]);

  const run = () => {
    try {
      setError("");
      const nums: Record<string, number> = {};
      for (const f of visibleFields) {
        const raw = values[f.key] ?? "";
        if (slug === "ley-de-senos" && (f.key === "b" || f.key === "B") && raw.trim() === "") {
          nums[f.key] = NaN;
          continue;
        }
        const n = parse(raw);
        if (!Number.isFinite(n))
          throw new Error(es ? "Completá los campos requeridos con números válidos." : "Fill required fields with valid numbers.");
        nums[f.key] = n;
      }
      setCards(compute(slug, nums, mode, es));
    } catch (e) {
      setCards(null);
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular." : "Could not calculate.");
    }
  };

  if (!fields.length) {
    return <p className="text-sm text-muted-foreground">{es ? "Configuración incompleta." : "Missing configuration."}</p>;
  }

  return (
    <div className="space-y-5">
      {needsMode && (
        <div className="flex flex-wrap gap-2">
          {slug === "triangulo-rectangulo" && (
            <>
              <button
                type="button"
                onClick={() => setMode("legs")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "legs" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Dos catetos" : "Two legs"}
              </button>
              <button
                type="button"
                onClick={() => setMode("leg-hyp")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "leg-hyp" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Cateto + hipotenusa" : "Leg + hypotenuse"}
              </button>
            </>
          )}
          {slug === "ley-de-cosenos" && (
            <>
              <button
                type="button"
                onClick={() => setMode("side")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "side" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Hallar lado c" : "Find side c"}
              </button>
              <button
                type="button"
                onClick={() => setMode("angle")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "angle" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Hallar ángulo C" : "Find angle C"}
              </button>
            </>
          )}
        </div>
      )}

      <div className={`grid gap-4 ${visibleFields.length > 3 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
        {visibleFields.map((f) => (
          <label key={f.key} className="space-y-1.5">
            <span className="text-sm font-semibold">{es ? f.es : f.en}</span>
            <input
              type="number"
              inputMode="decimal"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.ph}
              className="h-12 w-full rounded-xl border border-border bg-background px-3 text-base"
            />
          </label>
        ))}
      </div>

      {hint && (
        <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
          {es ? "Fórmula" : "Formula"}: {hint}
        </p>
      )}

      <button
        type="button"
        onClick={run}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm"
      >
        {es ? "Calcular" : "Calculate"}
      </button>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {cards && (
        <div className={`grid gap-3 ${cards.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-surface/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className="mt-1 break-all font-mono text-xl font-semibold tabular-nums">{c.value}</p>
              {c.hint && <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
