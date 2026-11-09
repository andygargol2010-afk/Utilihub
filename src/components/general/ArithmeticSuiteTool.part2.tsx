"use client";
// Part 2 of 3 — split from ArithmeticSuiteTool.tsx on 2026-11-04. Edit here; ArithmeticSuiteTool.tsx re-exports.
import { type Card, parse, factorize, isPrime, nextPrime, fmt, countSigFigs, roundSigFigs } from "./ArithmeticSuiteTool.part1";

export function compute(slug: string, a: string, b: string, es: boolean): Card[] {
  switch (slug) {
    case "factorizacion-prima": {
      const n = parse(a);
      if (!Number.isInteger(n) || n < 2)
        throw new Error(es ? "Ingresá un entero ≥ 2." : "Enter an integer ≥ 2.");
      if (n > 1e12) throw new Error(es ? "Número demasiado grande para el navegador." : "Number too large for the browser.");
      const factors = factorize(n);
      const parts: string[] = [];
      for (const [p, e] of factors) {
        parts.push(e === 1 ? String(p) : `${p}^${e}`);
      }
      const product = parts.join(" × ");
      return [
        { label: es ? "Factores primos" : "Prime factors", value: product },
        { label: es ? "Cantidad de primos distintos" : "Distinct primes", value: String(factors.size) },
        { label: es ? "Verificación" : "Check", value: `${n} = ${product}` },
      ];
    }
    case "es-primo": {
      const n = parse(a);
      if (!Number.isInteger(n)) throw new Error(es ? "Ingresá un entero." : "Enter an integer.");
      if (Math.abs(n) > 1e12) throw new Error(es ? "Número demasiado grande." : "Number too large.");
      const abs = Math.abs(n);
      let status: string;
      if (abs <= 1) status = es ? "Ni primo ni compuesto" : "Neither prime nor composite";
      else if (isPrime(abs)) status = es ? "Primo" : "Prime";
      else status = es ? "Compuesto" : "Composite";
      const nextGt = isPrime(abs) ? nextPrime(abs + 1) : nextPrime(abs);
      return [
        { label: es ? "Estado" : "Status", value: status },
        { label: es ? "Siguiente primo ≥ |n|" : "Next prime ≥ |n|", value: String(nextPrime(abs)) },
        { label: es ? "Siguiente primo > |n|" : "Next prime > |n|", value: String(nextGt) },
      ];
    }
    case "raiz-cubica": {
      const x = parse(a);
      if (!Number.isFinite(x)) throw new Error(es ? "Número inválido." : "Invalid number.");
      const root = Math.cbrt(x);
      return [
        { label: es ? "Raíz cúbica" : "Cube root", value: fmt(root) },
        { label: es ? "Verificación (root³)" : "Check (root³)", value: fmt(root * root * root) },
      ];
    }
    case "division-larga": {
      const dividend = parse(a);
      const divisor = parse(b);
      if (!Number.isFinite(dividend) || !Number.isFinite(divisor))
        throw new Error(es ? "Ingresá números válidos." : "Enter valid numbers.");
      if (divisor === 0) throw new Error(es ? "El divisor no puede ser 0." : "Divisor cannot be 0.");
      if (!Number.isInteger(dividend) || !Number.isInteger(divisor))
        throw new Error(es ? "Esta versión usa enteros." : "This version uses integers.");
      const q = Math.trunc(dividend / divisor);
      const r = dividend - q * divisor;
      return [
        { label: es ? "Cociente" : "Quotient", value: String(q) },
        { label: es ? "Resto" : "Remainder", value: String(r) },
        { label: es ? "Comprobación" : "Check", value: `${dividend} = ${q} × ${divisor} + ${r}` },
      ];
    }
    case "cifras-significativas": {
      if (!a.trim()) throw new Error(es ? "Ingresá un número." : "Enter a number.");
      const count = countSigFigs(a);
      if (count < 1) throw new Error(es ? "No se detectaron cifras significativas." : "No significant figures detected.");
      const n = parse(a);
      if (!Number.isFinite(n)) throw new Error(es ? "Número inválido." : "Invalid number.");
      const cards: Card[] = [{ label: es ? "Cifras significativas" : "Significant figures", value: String(count) }];
      if (b.trim()) {
        const sig = parse(b);
        if (!Number.isInteger(sig) || sig < 1 || sig > 15)
          throw new Error(es ? "Las cifras objetivo deben ser un entero entre 1 y 15." : "Target sig figs must be an integer from 1 to 15.");
        cards.push({ label: es ? "Redondeado" : "Rounded", value: fmt(roundSigFigs(n, sig), sig + 2) });
      }
      return cards;
    }
    case "orden-de-magnitud": {
      const x = parse(a);
      if (!(x > 0)) throw new Error(es ? "Ingresá un número positivo." : "Enter a positive number.");
      const log10 = Math.log10(x);
      const floor = Math.floor(log10 + 1e-15);
      const nearest = Math.round(log10);
      return [
        { label: "log₁₀(x)", value: fmt(log10) },
        { label: es ? "Orden (piso)" : "Order (floor)", value: `10^${floor}` },
        { label: es ? "Potencia más cercana" : "Nearest power", value: `10^${nearest}` },
      ];
    }
    default:
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
  }
}

export function crossMultiply(vals: Record<string, number>, unknown: string, es: boolean): Card[] {
  const { a, b, c, d } = vals;
  const need = (k: string) => {
    if (!Number.isFinite(vals[k]!))
      throw new Error(es ? "Completá los tres valores conocidos." : "Fill the three known values.");
  };
  if (unknown === "d") {
    need("a"); need("b"); need("c");
    if (a === 0) throw new Error(es ? "a no puede ser 0 al despejar d." : "a cannot be 0 when solving for d.");
    const dSol = (b * c) / a;
    return [
      { label: "d", value: fmt(dSol) },
      { label: es ? "Proporción" : "Proportion", value: `${fmt(a)}/${fmt(b)} = ${fmt(c)}/${fmt(dSol)}` },
    ];
  }
  if (unknown === "c") {
    need("a"); need("b"); need("d");
    if (b === 0) throw new Error(es ? "b no puede ser 0." : "b cannot be 0.");
    const cSol = (a * d) / b;
    return [
      { label: "c", value: fmt(cSol) },
      { label: es ? "Proporción" : "Proportion", value: `${fmt(a)}/${fmt(b)} = ${fmt(cSol)}/${fmt(d)}` },
    ];
  }
  if (unknown === "b") {
    need("a"); need("c"); need("d");
    if (c === 0) throw new Error(es ? "c no puede ser 0." : "c cannot be 0.");
    const bSol = (a * d) / c;
    return [
      { label: "b", value: fmt(bSol) },
      { label: es ? "Proporción" : "Proportion", value: `${fmt(a)}/${fmt(bSol)} = ${fmt(c)}/${fmt(d)}` },
    ];
  }
  need("b"); need("c"); need("d");
  if (d === 0) throw new Error(es ? "d no puede ser 0." : "d cannot be 0.");
  const aSol = (b * c) / d;
  return [
    { label: "a", value: fmt(aSol) },
    { label: es ? "Proporción" : "Proportion", value: `${fmt(aSol)}/${fmt(b)} = ${fmt(c)}/${fmt(d)}` },
  ];
}
