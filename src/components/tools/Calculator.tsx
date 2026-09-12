import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/units";

type Op = "+" | "-" | "×" | "÷" | "%";
function apply(a: number, b: number, op: Op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "×") return a * b;
  if (op === "÷") return b === 0 ? NaN : a / b;
  return (a * b) / 100;
}

export default function Calculator({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  const dec = es ? "," : ".";
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const value = () => Number(display.replace(",", "."));
  const digit = (d: string) => {
    setDisplay((p) => {
      if (fresh) return d === dec ? `0${dec}` : d;
      if (d === dec && (p.includes(",") || p.includes("."))) return p;
      if (p === "0" && d !== dec) return d;
      return p + d;
    });
    setFresh(false);
  };
  const choose = (next: Op) => {
    const cur = value();
    if (acc !== null && op && !fresh) setAcc(apply(acc, cur, op));
    else setAcc(cur);
    setOp(next);
    setFresh(true);
  };
  const equals = () => {
    if (acc === null || !op) return;
    const cur = value();
    const result = apply(acc, cur, op);
    setHistory((h) => [`${formatNumber(acc)} ${op} ${formatNumber(cur)} = ${formatNumber(result)}`, ...h].slice(0, 8));
    setDisplay(Number.isFinite(result) ? String(result).replace(".", dec) : "Error");
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
  const back = () => setDisplay((p) => (p.length <= 1 ? "0" : p.slice(0, -1)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) digit(e.key);
      else if (e.key === "," || e.key === ".") digit(dec);
      else if (["+", "-", "*", "/", "%"].includes(e.key)) {
        e.preventDefault();
        choose(e.key === "*" ? "×" : e.key === "/" ? "÷" : (e.key as Op));
      } else if (e.key === "Enter" || e.key === "=") equals();
      else if (e.key === "Backspace") back();
      else if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const keys = ["C", "⌫", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", dec];
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
      <div>
        <output aria-live="polite" className="block overflow-x-auto rounded-xl bg-surface px-4 py-6 text-right font-mono text-3xl font-semibold">
          {display}
          <span className="ml-2 text-base text-muted-foreground">{op ?? ""}</span>
        </output>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {keys.map((k) => (
            <Button
              key={k}
              type="button"
              variant={["C", "⌫", "%"].includes(k) ? "outline" : ["÷", "×", "-", "+"].includes(k) ? "secondary" : "default"}
              onClick={() => (k === "C" ? clear() : k === "⌫" ? back() : ["%", "÷", "×", "-", "+"].includes(k) ? choose(k as Op) : digit(k))}
              className="h-14 text-lg"
            >
              {k}
            </Button>
          ))}
          <Button type="button" onClick={equals} className="col-span-2 h-14 text-lg">
            =
          </Button>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface/60 p-4">
        <h3 className="text-sm font-semibold">{es ? "Historial" : "History"}</h3>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">{es ? "Aún no hay operaciones." : "No operations yet."}</p>
        ) : (
          <ul className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">
            {history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
