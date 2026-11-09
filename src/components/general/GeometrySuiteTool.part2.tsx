"use client";
// Part 2 of 3 — split from GeometrySuiteTool.tsx on 2026-11-04. Edit here; GeometrySuiteTool.tsx re-exports.
import { type Card, fmt, DEG } from "./GeometrySuiteTool.part1";

export function compute(slug: string, v: Record<string, number>, mode: string, es: boolean): Card[] {
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
