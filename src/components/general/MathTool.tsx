import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";
import {calculateStatistics,parseNumberList} from "@/lib/general/statistics-engine";

const TWO_SERIES=new Set(["correlacion","covarianza"]);
const PARAMETER=new Set(["percentil","z-score"]);

export function MathTool({tool}:{tool:GeneralTool}){
 const[raw,setRaw]=useState("");
 const[secondary,setSecondary]=useState("");
 const[parameter,setParameter]=useState("50");
 const[sample,setSample]=useState(false);
 const[out,setOut]=useState<{label:string;value:string}[]>([]);
 const needsTwo=TWO_SERIES.has(tool.slug);
 const needsParameter=PARAMETER.has(tool.slug);
 const calculate=()=>setOut(calculateStatistics(tool.slug,parseNumberList(raw),needsTwo?parseNumberList(secondary):[],Number(parameter.replace(",",".")),sample));
 return <div className="space-y-4">
  <label className="block space-y-2"><span className="text-sm font-semibold">Lista de números</span><textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Ej.: 5, 10, 15, 20" className="min-h-28 w-full rounded-xl border border-border bg-background p-4"/><span className="block text-xs text-muted-foreground">Separa los valores con comas, punto y coma o saltos de línea.</span></label>
  {needsTwo&&<label className="block space-y-2"><span className="text-sm font-semibold">Segunda serie de números</span><textarea value={secondary} onChange={e=>setSecondary(e.target.value)} placeholder="Ej.: 8, 12, 18, 21" className="min-h-28 w-full rounded-xl border border-border bg-background p-4"/><span className="block text-xs text-muted-foreground">Debe contener la misma cantidad de valores que la primera serie.</span></label>}
  {needsParameter&&<label className="block space-y-2"><span className="text-sm font-semibold">{tool.slug==="percentil"?"Percentil (0–100)":"Valor a convertir en Z-score"}</span><input type="number" value={parameter} onChange={e=>setParameter(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3"/></label>}
  {(tool.slug==="varianza"||tool.slug==="desviacion-estandar"||tool.slug==="covarianza")&&<label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={sample} onChange={e=>setSample(e.target.checked)} className="size-4"/> Usar fórmula muestral (n−1)</label>}
  <button type="button" onClick={calculate} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>
  {out.length>0&&<div className="grid gap-3 sm:grid-cols-2">{out.map(result=><output key={result.label} className="block rounded-xl border border-border bg-muted/30 p-4"><span className="block text-xs font-semibold text-muted-foreground">{result.label}</span><strong className="mt-1 block text-lg">{result.value}</strong></output>)}</div>}
 </div>;
}
