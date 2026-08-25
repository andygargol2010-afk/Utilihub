import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

const values=(s:string)=>s.split(/[\n,;]+/).map(x=>Number(x.trim().replace(",","."))).filter(Number.isFinite);
const factorial=(n:number)=>{if(!Number.isInteger(n)||n<0||n>170)throw new Error("El factorial requiere un entero entre 0 y 170.");let r=1;for(let i=2;i<=n;i++)r*=i;return r};
const gcd=(a:number,b:number)=>{let x=Math.abs(Math.trunc(a)),y=Math.abs(Math.trunc(b));while(y){const t=x%y;x=y;y=t}return x};
const calculate=(slug:string,xs:number[]):string=>{
  if(xs.length===0)throw new Error("Introduce uno o varios números.");
  const sum=xs.reduce((a,b)=>a+b,0),mean=sum/xs.length;
  switch(slug){
    case "promedio": return `Promedio: ${mean}`;
    case "mediana": {const a=[...xs].sort((a,b)=>a-b),m=Math.floor(a.length/2);return `Mediana: ${a.length%2?a[m]:(a[m-1]+a[m])/2}`;}
    case "moda": {const counts=new Map<number,number>();xs.forEach(x=>counts.set(x,(counts.get(x)??0)+1));const max=Math.max(...counts.values());return max===1?"Moda: no existe una moda única.":`Moda: ${[...counts.entries()].filter(([,n])=>n===max).map(([v])=>v).join(", ")}`;}
    case "rango": {const a=[...xs].sort((a,b)=>a-b);return `Rango: ${a[a.length-1]-a[0]}`;}
    case "varianza": return `Varianza: ${xs.reduce((a,x)=>a+(x-mean)**2,0)/xs.length}`;
    case "desviacion-estandar": return `Desviación estándar: ${Math.sqrt(xs.reduce((a,x)=>a+(x-mean)**2,0)/xs.length)}`;
    case "percentil": {if(xs.length<2)throw new Error("El percentil requiere al menos dos valores y un percentil entre 0 y 100.");const p=xs[xs.length-1];const a=[...xs].sort((u,v)=>u-v);const i=(p/100)*(a.length-1),lo=Math.floor(i),hi=Math.ceil(i);return `Percentil ${p}: ${a[lo]+(a[hi]-a[lo])*(i-lo)}`;}
    case "cuartiles": {const a=[...xs].sort((u,v)=>u-v),q=(p:number)=>{const i=p*(a.length-1),lo=Math.floor(i),hi=Math.ceil(i);return a[lo]+(a[hi]-a[lo])*(i-lo)};return `Q1: ${q(.25)} · Mediana: ${q(.5)} · Q3: ${q(.75)}`;}
    case "z-score": {if(xs.length<2)throw new Error("El Z-score requiere al menos dos valores.");const v=xs[0],sd=Math.sqrt(xs.reduce((a,x)=>a+(x-mean)**2,0)/xs.length);if(sd===0)throw new Error("No se puede calcular Z-score con desviación estándar cero.");return `Z-score de ${v}: ${(v-mean)/sd}`;}
    case "correlacion": {if(xs.length%2!==0||xs.length<4)throw new Error("Correlación requiere dos series con la misma cantidad de valores. Introduce ambas series consecutivamente.");const n=xs.length/2,a=xs.slice(0,n),b=xs.slice(n),ma=a.reduce((u,v)=>u+v,0)/n,mb=b.reduce((u,v)=>u+v,0)/n;const num=a.reduce((u,v,i)=>u+(v-ma)*(b[i]-mb),0),den=Math.sqrt(a.reduce((u,v)=>u+(v-ma)**2,0)*b.reduce((u,v,i)=>u+(v-mb)**2,0));if(den===0)throw new Error("No se puede calcular correlación con una serie constante.");return `Correlación: ${num/den}`;}
    case "covarianza": {if(xs.length%2!==0||xs.length<4)throw new Error("Covarianza requiere dos series con la misma cantidad de valores.");const n=xs.length/2,a=xs.slice(0,n),b=xs.slice(n),ma=a.reduce((u,v)=>u+v,0)/n,mb=b.reduce((u,v)=>u+v,0)/n;return `Covarianza: ${a.reduce((u,v,i)=>u+(v-ma)*(b[i]-mb),0)/n}`;}
    default: throw new Error(`Herramienta matemática sin implementación específica: ${slug}`);
  }
};

export function MathTool({tool}:{tool:GeneralTool}){const[raw,setRaw]=useState("");const[out,setOut]=useState("");const calculate=()=>{try{setOut(calculate(tool.slug,values(raw)))}catch(error){setOut(error instanceof Error?error.message:"No se pudo calcular el resultado.")}};return <div className="space-y-4"><label className="block text-sm font-semibold">Lista de números<textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Ejemplo: 5, 10, 15, 20" className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background p-4"/></label><p className="text-xs text-muted-foreground">Para correlación/covarianza introduce primero la serie A y después la serie B, con igual cantidad de valores.</p><button onClick={calculate} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>{out&&<output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 font-medium">{out}</output>}</div>}
