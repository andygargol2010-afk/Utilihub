"use client";
// Part 2 of 3 — split from AlgebraAdvancedTool.tsx on 2026-11-04. Edit here; AlgebraAdvancedTool.tsx re-exports.
import { type Card, fmt, polyTerm } from "./AlgebraAdvancedTool.part1";

export function compute(slug: string, v: Record<string, number>, es: boolean): Card[] {
  switch (slug) {
    case "formula-cuadratica": {
      const { a, b, c } = v;
      if (a === 0) throw new Error(es ? "a no puede ser 0 (no es cuadrática)." : "a cannot be 0 (not quadratic).");
      const disc = b * b - 4 * a * c;
      const twoA = 2 * a;
      if (disc > 0) {
        const s = Math.sqrt(disc);
        return [
          { label: es ? "Raíz x₁" : "Root x₁", value: fmt((-b + s) / twoA) },
          { label: es ? "Raíz x₂" : "Root x₂", value: fmt((-b - s) / twoA) },
          { label: es ? "Discriminante" : "Discriminant", value: fmt(disc), hint: es ? "Dos raíces reales distintas" : "Two distinct real roots" },
        ];
      }
      if (disc === 0) {
        return [
          { label: es ? "Raíz (doble)" : "Root (repeated)", value: fmt(-b / twoA) },
          { label: es ? "Discriminante" : "Discriminant", value: "0", hint: es ? "Una raíz real repetida" : "One repeated real root" },
        ];
      }
      const s = Math.sqrt(-disc);
      const real = fmt(-b / twoA);
      const imag = fmt(s / Math.abs(twoA));
      return [
        { label: es ? "Raíz x₁" : "Root x₁", value: `${real} + ${imag}i` },
        { label: es ? "Raíz x₂" : "Root x₂", value: `${real} − ${imag}i` },
        { label: es ? "Discriminante" : "Discriminant", value: fmt(disc), hint: es ? "Raíces complejas conjugadas" : "Complex conjugate roots" },
      ];
    }
    case "discriminante": {
      const { a, b, c } = v;
      if (a === 0) throw new Error(es ? "a no puede ser 0." : "a cannot be 0.");
      const disc = b * b - 4 * a * c;
      let nature: string;
      if (disc > 0) nature = es ? "Dos raíces reales distintas" : "Two distinct real roots";
      else if (disc === 0) nature = es ? "Una raíz real repetida" : "One repeated real root";
      else nature = es ? "Sin raíces reales (complejas)" : "No real roots (complex)";
      return [
        { label: "Δ = b² − 4ac", value: fmt(disc) },
        { label: es ? "Naturaleza" : "Nature", value: nature },
      ];
    }
    case "completar-cuadrado": {
      const { a, b, c } = v;
      if (a === 0) throw new Error(es ? "a no puede ser 0." : "a cannot be 0.");
      const h = -b / (2 * a);
      const k = c - (b * b) / (4 * a);
      const hStr = fmt(h);
      const kStr = fmt(k);
      const aStr = fmt(a);
      const form =
        Math.abs(a - 1) < 1e-12
          ? `(x − (${hStr}))² + (${kStr})`
          : `${aStr}(x − (${hStr}))² + (${kStr})`;
      return [
        { label: es ? "Forma vértice" : "Vertex form", value: form },
        { label: es ? "Vértice (h, k)" : "Vertex (h, k)", value: `(${hStr}, ${kStr})` },
        {
          label: es ? "Extremo" : "Extremum",
          value: a > 0 ? (es ? "Mínimo" : "Minimum") : es ? "Máximo" : "Maximum",
        },
      ];
    }
    case "sistema-ecuaciones-2x2": {
      const { a1, b1, c1, a2, b2, c2 } = v;
      const det = a1 * b2 - a2 * b1;
      const detX = c1 * b2 - c2 * b1;
      const detY = a1 * c2 - a2 * c1;
      if (Math.abs(det) < 1e-12) {
        if (Math.abs(detX) < 1e-12 && Math.abs(detY) < 1e-12) {
          return [{ label: es ? "Resultado" : "Result", value: es ? "Infinitas soluciones (misma recta)" : "Infinite solutions (same line)" }];
        }
        return [{ label: es ? "Resultado" : "Result", value: es ? "Sin solución (paralelas)" : "No solution (parallel lines)" }];
      }
      return [
        { label: "x", value: fmt(detX / det) },
        { label: "y", value: fmt(detY / det) },
        { label: es ? "Determinante" : "Determinant", value: fmt(det) },
      ];
    }
    case "foil-binomios": {
      const { a, b, c, d } = v;
      const A = a * c;
      const B = a * d + b * c;
      const C = b * d;
      let poly = polyTerm(A, "x²", true);
      poly += polyTerm(B, "x", false);
      poly += polyTerm(C, "", false);
      return [
        { label: es ? "Expandido" : "Expanded", value: poly || "0" },
        { label: "A (x²)", value: fmt(A) },
        { label: "B (x)", value: fmt(B) },
        { label: "C", value: fmt(C) },
      ];
    }
    case "factorizar-trinomio": {
      const { b, c } = v;
      if (!Number.isInteger(b) || !Number.isInteger(c)) {
        throw new Error(es ? "Esta versión busca factores enteros: usá enteros para b y c." : "This version seeks integer factors: use integers for b and c.");
      }
      const B = b;
      const C = c;
      let found: [number, number] | null = null;
      const limit = Math.max(Math.abs(C), Math.abs(B), 1);
      for (let p = -limit; p <= limit; p++) {
        if (p === 0 && C !== 0) continue;
        if (p !== 0 && C % p !== 0) continue;
        const q = p === 0 ? C : C / p;
        if (p + q === B) {
          found = [p, q];
          break;
        }
      }
      if (!found) {
        return [{ label: es ? "Resultado" : "Result", value: es ? "No hay factores enteros" : "No integer factor pair found" }];
      }
      const [p, q] = found;
      const term = (n: number) => (n >= 0 ? `(x + ${n})` : `(x − ${Math.abs(n)})`);
      return [
        { label: es ? "Factores" : "Factors", value: `${term(p)}${term(q)}` },
        { label: "p + q", value: fmt(p + q), hint: "b" },
        { label: "p × q", value: fmt(p * q), hint: "c" },
      ];
    }
    case "pendiente-dos-puntos": {
      const { x1, y1, x2, y2 } = v;
      if (x1 === x2) {
        return [
          { label: es ? "Pendiente" : "Slope", value: es ? "Indefinida" : "Undefined" },
          { label: es ? "Recta" : "Line", value: `x = ${fmt(x1)}`, hint: es ? "Vertical" : "Vertical" },
        ];
      }
      const m = (y2 - y1) / (x2 - x1);
      const intercept = y1 - m * x1;
      const pointSlope = `y − ${fmt(y1)} = ${fmt(m)}(x − ${fmt(x1)})`;
      const slopeInt = `y = ${fmt(m)}x ${intercept >= 0 ? "+" : "−"} ${fmt(Math.abs(intercept))}`;
      return [
        { label: es ? "Pendiente m" : "Slope m", value: fmt(m) },
        { label: es ? "Punto-pendiente" : "Point-slope", value: pointSlope },
        { label: es ? "Pendiente-ordenada" : "Slope-intercept", value: slopeInt },
      ];
    }
    default:
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
  }
}
