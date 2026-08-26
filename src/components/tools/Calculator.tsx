import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/units";

type Op = "+" | "-" | "×" | "÷";

function apply(a: number, b: number, op: Op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "×") return a * b;
  return b === 0 ? NaN : a / b;
}

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const value = () => Number(display.replace(",", "."));
  const appendDigit = (d: string) => {
    setDisplay((current) => {
      if (fresh) return d === "," ? "0," : d;
      if (d === "," && current.includes(",")) return current;
      return current === "0" && d !== "," ? d : current + d;
    });
    setFresh(false);
  };

  const choose = (next: Op) => {
    const current = value();
    if (!Number.isFinite(current)) return;
    if (acc !== null && op && !fresh) setAcc(apply(acc, current, op));
    else setAcc(current);
    setOp(next);
    setFresh(true);
  };

  const percentage = () => {
    const current = value();
    if (!Number.isFinite(current)) return;
    const result = acc !== null && op ? acc * current / 100 : current / 100;
    setDisplay(String(result).replace(".", ","));
    setFresh(false);
  };

  const toggleSign = () => {
    if (display === "0") return;
    setDisplay((current) => current.startsWith("-") ? current.slice(1) : `-${current}`);
  };

  const equals = () => {
    if (acc === null || !op) return;
    const current = value();
    if (!Number.isFinite(current)) return;
    const result = apply(acc, current, op);
    const expression = `${formatNumber(acc)} ${op} ${formatNumber(current)}`;
    setHistory((items) => [`${expression} = ${Number.isFinite(result) ? formatNumber(result) : "Error"}`, ...items].slice(0, 10));
    setDisplay(Number.isFinite(result) ? String(result).replace(".", ",") : "Error");
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const clear = () => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const back = () => {
    setDisplay((current) => current.length <= 1 || (current.length === 2 && current.startsWith("-")) ? "0" : current.slice(0, -1));
    setFresh(false);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) appendDigit(event.key);
      else if (event.key === "," || event.key === ".") appendDigit(",");
      else if (["+", "-", "*", "/"].includes(event.key)) {
        event.preventDefault();
        choose(event.key === "*" ? "×" : event.key === "/" ? "÷" : event.key as Op);
      } else if (event.key === "%") percentage();
      else if (event.key === "Enter" || event.key === "=") equals();
      else if (event.key === "Backspace") back();
      else if (event.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const keys = useMemo(() => ["C", "⌫", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "±", "0", ","], []);

  return <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
    <div>
      <output aria-label="Resultado de la calculadora" aria-live="polite" className="block overflow-x-auto rounded-xl bg-surface px-4 py-6 text-right font-mono text-3xl font-semibold">
        {display}<span className="ml-2 text-base text-muted-foreground">{op ?? ""}</span>
      </output>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {keys.map((key) => <Button key={key} type="button" variant={["C", "⌫", "%", "±"].includes(key) ? "outline" : ["÷", "×", "-", "+"].includes(key) ? "secondary" : "default"} onClick={() => key === "C" ? clear() : key === "⌫" ? back() : key === "%" ? percentage() : key === "±" ? toggleSign() : ["÷", "×", "-", "+"].includes(key) ? choose(key as Op) : appendDigit(key)} className="h-14 text-lg">{key}</Button>)}
        <Button type="button" onClick={equals} className="col-span-2 h-14 text-lg">=</Button>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">Admite teclado, decimales con coma o punto, porcentajes, cambio de signo y operaciones encadenadas. Todo el cálculo se realiza localmente.</p>
    </div>
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">Historial</h3><button type="button" onClick={() => setHistory([])} disabled={!history.length} className="text-xs font-medium text-primary disabled:opacity-40">Limpiar</button></div>
      {history.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Aún no hay operaciones.</p> : <ul className="mt-2 space-y-2 font-mono text-xs text-muted-foreground">{history.map((item, index) => <li key={`${item}-${index}`} className="border-b border-border/60 pb-2">{item}</li>)}</ul>}
    </div>
  </div>;
}
