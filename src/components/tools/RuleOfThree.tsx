import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNumber, parseNumber } from "@/lib/units";

export default function RuleOfThree() {
  const [inverse, setInverse] = useState(false), [a, setA] = useState("3"), [b, setB] = useState("12"), [c, setC] = useState("7");
  const na = parseNumber(a), nb = parseNumber(b), nc = parseNumber(c);
  const valid = [na, nb, nc].every(Number.isFinite) && na !== 0 && (!inverse || nc !== 0);
  const x = valid ? (inverse ? na * nb / nc : nb * nc / na) : NaN;
  const formula = inverse ? "X = A × B ÷ C" : "X = B × C ÷ A";

  return <div className="space-y-6">
    <div className="flex flex-wrap gap-2"><Button type="button" variant={!inverse ? "default" : "outline"} onClick={() => setInverse(false)}>Proporción directa</Button><Button type="button" variant={inverse ? "default" : "outline"} onClick={() => setInverse(true)}>Proporción inversa</Button></div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2"><Label htmlFor="r3-a">A</Label><Input id="r3-a" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="r3-b">B (corresponde a A)</Label><Input id="r3-b" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="r3-c">C</Label><Input id="r3-c" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} /></div>
    </div>
    <div className="rounded-xl bg-surface p-5" aria-live="polite">
      <p className="text-sm text-muted-foreground">{valid ? `Si ${formatNumber(na)} → ${formatNumber(nb)}, entonces ${formatNumber(nc)} → X` : "Revisa los valores introducidos."}</p>
      <p className="mt-1 font-mono text-3xl font-semibold">X = {Number.isFinite(x) ? formatNumber(x, 6) : "—"}</p>
      <p className="mt-2 text-sm text-muted-foreground">Fórmula: {formula}</p>
    </div>
    <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground">
      <p className="font-semibold text-foreground">¿Directa o inversa?</p>
      <p className="mt-1">Usa la directa cuando ambas magnitudes aumentan o disminuyen juntas. Usa la inversa cuando una aumenta mientras la otra disminuye, manteniendo la proporción.</p>
      {inverse && <p className="mt-2">Ejemplo: si más trabajadores reducen proporcionalmente los días necesarios, la relación puede modelarse como inversa.</p>}
    </div>
  </div>;
}
