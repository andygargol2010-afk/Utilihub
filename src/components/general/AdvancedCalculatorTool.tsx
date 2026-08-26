import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Cfg = { operation: string; fields: string[]; mode?: string };
const nums = (s: string) => s.split(/[;,\s]+/).map(Number).filter(Number.isFinite);
const one = (s: string) => nums(s);
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const sdPop = (a: number[]) => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };

function calculate(op: string, v: number[][]): string {
  const a = v[0] ?? [], b = v[1] ?? [], c = v[2] ?? [], d = v[3] ?? [], e = v[4] ?? [];
  const A = a[0], B = b[0], C = c[0], D = d[0], E = e[0];
  const fixed = 6.02214076e23;
  switch (op) {
    case "mad": { if (!a.length) throw Error("Introduce al menos un dato."); const m = mean(a); return `${mean(a.map(x => Math.abs(x - m)))}`; }
    case "cv": { if (!a.length) throw Error("Introduce al menos un dato."); const m = mean(a); if (!m) throw Error("La media no puede ser 0."); return `${sdPop(a) / Math.abs(m) * 100}%`; }
    case "percent-error": if (!B) throw Error("El valor aceptado no puede ser 0."); return `${Math.abs(A - B) / Math.abs(B) * 100}%`;
    case "absolute-error": return `${Math.abs(A - B)}`;
    case "relative-error": if (!B) throw Error("El valor de referencia no puede ser 0."); return `${Math.abs(A - B) / Math.abs(B)}`;
    case "weighted-mean": if (a.length !== b.length || !a.length || b.reduce((x,y)=>x+y,0)===0) throw Error("Valores y pesos deben tener la misma longitud y peso total distinto de 0."); return `${a.reduce((s,x,i)=>s+x*b[i],0)/b.reduce((s,x)=>s+x,0)}`;
    case "harmonic-mean": if (!a.length || a.some(x=>x===0)) throw Error("Introduce datos no nulos."); return `${a.length / a.reduce((s,x)=>s+1/x,0)}`;
    case "geometric-mean": if (!a.length || a.some(x=>x<=0)) throw Error("La media geométrica requiere valores positivos."); return `${Math.exp(mean(a.map(Math.log)))}`;
    case "conditional": if (!B) throw Error("P(B) no puede ser 0."); return `${A / B}`;
    case "bayes": { const pB = A * B + (1 - A) * C; if (!pB) throw Error("P(B) no puede ser 0."); return `${A * B / pB}`; }
    case "binomial": { const n=Math.trunc(A), k=Math.trunc(B), p=C; if(n<0||k<0||k>n||p<0||p>1) throw Error("Revisa n, k y p."); let comb=1; for(let i=1;i<=k;i++) comb*= (n-k+i)/i; return `${comb*p**k*(1-p)**(n-k)}`; }
    case "normal": { if(C<=0) throw Error("La desviación estándar debe ser mayor que 0."); const z=(A-B)/C; return `${0.5*(1+erf(z/Math.SQRT2))}`; }
    case "poisson": { if(A<0||C<=0) throw Error("k debe ser ≥ 0 y λ > 0."); let fact=1; for(let i=2;i<=Math.trunc(A);i++) fact*=i; return `${Math.exp(-C)*C**Math.trunc(A)/fact}`; }
    case "t-score": if(C<=0) throw Error("La desviación estándar debe ser mayor que 0."); return `${(A-B)/C}`;
    case "confidence": if(C<=0||D<=0) throw Error("Usa n y z mayores que 0."); return `${B - D*A/Math.sqrt(C)} a ${B + D*A/Math.sqrt(C)}`;
    case "sample-size": { if(B<=0||C<=0||A<=0||C>1) throw Error("Usa z, margen y proporción válidos."); return `${Math.ceil(A*A*C*(1-C)/(B*B))}`; }
    case "relative-frequency": if(!B) throw Error("El total no puede ser 0."); return `${A/B}`;
    case "cumulative-frequency": { if(!a.length) throw Error("Introduce frecuencias."); let s=0; return a.map(x=>(s+=x)).join(", "); }
    case "class-width": if(C<=0) throw Error("El número de clases debe ser mayor que 0."); return `${(B-A)/C}`;
    case "linear-interpolation": if(B===C) throw Error("x1 y x2 deben ser diferentes."); return `${D+(A-B)*(E-D)/(C-B)}`;
    case "momentum": return `${A*B} kg·m/s`;
    case "impulse": return `${A*B} N·s`;
    case "mechanical-energy": return `${0.5*A*B*B+A*C*D} J`;
    case "mechanical-power": if(B===0) throw Error("El tiempo no puede ser 0."); return `${A/B} W`;
    case "torque": return `${A*B} N·m`;
    case "friction-coefficient": if(B===0) throw Error("La fuerza normal no puede ser 0."); return `${A/B}`;
    case "centripetal-force": if(C<=0) throw Error("El radio debe ser mayor que 0."); return `${A*B*B/C} N`;
    case "centripetal-acceleration": if(B<=0) throw Error("El radio debe ser mayor que 0."); return `${A*A/B} m/s²`;
    case "free-fall": if(A<0||B<=0) throw Error("Altura ≥ 0 y gravedad > 0."); return `${Math.sqrt(2*A/B)} s`;
    case "vertical-throw": if(B<=0) throw Error("La gravedad debe ser mayor que 0."); return `${A*A/(2*B)} m`;
    case "projectile-range": if(C<=0) throw Error("La gravedad debe ser mayor que 0."); return `${A*A*Math.sin(2*B*Math.PI/180)/C} m`;
    case "pendulum": if(A<=0||B<=0) throw Error("Longitud y gravedad deben ser mayores que 0."); return `${2*Math.PI*Math.sqrt(A/B)} s`;
    case "spring-period": if(A<=0||B<=0) throw Error("Masa y constante elástica deben ser mayores que 0."); return `${2*Math.PI*Math.sqrt(A/B)} s`;
    case "spring-energy": return `${0.5*A*B*B} J`;
    case "hydrostatic-pressure": return `${A*B*C} Pa`;
    case "buoyancy": return `${A*B*C} N`;
    case "sensible-heat": return `${A*B*C} J`;
    case "latent-heat": return `${A*B} J`;
    case "thermal-expansion": return `${A*B*C} m`;
    case "efficiency": if(B===0) throw Error("La energía de entrada no puede ser 0."); return `${A/B*100}%`;
    case "molarity": if(B<=0) throw Error("El volumen debe ser mayor que 0."); return `${A/B} mol/L`;
    case "molality": if(B<=0) throw Error("La masa de solvente debe ser mayor que 0."); return `${A/B} mol/kg`;
    case "normality": if(B<=0) throw Error("El volumen debe ser mayor que 0."); return `${A/B} eq/L`;
    case "mole-fraction": if(B<=0) throw Error("Los moles totales deben ser mayores que 0."); return `${A/B}`;
    case "mass-percent": if(B===0) throw Error("La masa de solución no puede ser 0."); return `${A/B*100}%`;
    case "volume-percent": if(B===0) throw Error("El volumen de solución no puede ser 0."); return `${A/B*100}%`;
    case "moles": if(B<=0) throw Error("La masa molar debe ser mayor que 0."); return `${A/B} mol`;
    case "molecules": return `${A*fixed} moléculas`;
    case "atoms": return `${A*fixed*B} átomos`;
    case "stoichiometry": return `${A*B} mol de producto; ${A*B*C} g si la masa molar del producto es C`;
    default: throw Error("Operación no disponible.");
  }
}
function erf(x:number){const s=x<0?-1:1; x=Math.abs(x); const t=1/(1+0.3275911*x); const y=1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x); return s*y;}

export function AdvancedCalculatorTool({tool}:{tool:GeneralTool}) {
  const cfg=(tool.config??{}) as Partial<Cfg>; const fields=Array.isArray(cfg.fields)?cfg.fields:[];
  const [values,setValues]=useState<string[]>(fields.map(()=>"")); const [out,setOut]=useState("");
  const run=()=>{try{const parsed=values.map(one); if(parsed.some((x,i)=>!x.length && cfg.operation!=="cumulative-frequency" && cfg.operation!=="mad" && cfg.operation!=="harmonic-mean" && cfg.operation!=="geometric-mean" && cfg.operation!=="weighted-mean")) throw Error("Completa todos los campos."); setOut(calculate(String(cfg.operation),parsed));}catch(e){setOut(e instanceof Error?e.message:"Entrada inválida.")}};
  return <div className="space-y-4"><p className="text-sm text-muted-foreground">Puedes separar listas con comas o espacios.</p><div className="grid gap-4 sm:grid-cols-2">{fields.map((label,i)=><label key={`${label}-${i}`} className="space-y-1"><span className="text-sm font-medium">{label}</span><input type="text" inputMode="decimal" value={values[i]??""} onChange={e=>setValues(v=>v.map((x,j)=>j===i?e.target.value:x))} className="h-11 w-full rounded-xl border bg-background px-3" placeholder="Introduce un valor" /></label>)}</div><button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>{out&&<output className="block rounded-xl border bg-muted/30 p-4">{out}</output>}</div>;
}
