import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";
import {calculateMath} from "@/lib/general/math-engine";

type Field={label:string;unit:string;placeholder:string};
const defs:Record<string,Field[]>={
 porcentaje:[{label:"Valor base",unit:"unidad",placeholder:"200"},{label:"Porcentaje",unit:"%",placeholder:"15"}],
 "regla-de-tres":[{label:"Valor A",unit:"unidad",placeholder:"5"},{label:"Valor B",unit:"unidad",placeholder:"10"},{label:"Valor C",unit:"unidad",placeholder:"8"}],
 probabilidad:[{label:"Casos favorables",unit:"casos",placeholder:"3"},{label:"Casos posibles",unit:"casos",placeholder:"10"}],
 combinaciones:[{label:"Total de elementos (n)",unit:"elementos",placeholder:"10"},{label:"Elementos elegidos (r)",unit:"elementos",placeholder:"3"}],
 permutaciones:[{label:"Total de elementos (n)",unit:"elementos",placeholder:"10"},{label:"Elementos elegidos (r)",unit:"elementos",placeholder:"3"}],
 factorial:[{label:"Número",unit:"entero",placeholder:"5"}],
 "potencias-y-raices":[{label:"Base",unit:"valor",placeholder:"2"},{label:"Exponente",unit:"valor",placeholder:"3"}],
 logaritmos:[{label:"Número",unit:"valor",placeholder:"100"},{label:"Base",unit:"base",placeholder:"10"}],
 "notacion-cientifica":[{label:"Número",unit:"valor",placeholder:"123000"}],
 "mcd-mcm":[{label:"Primer entero",unit:"entero",placeholder:"12"},{label:"Segundo entero",unit:"entero",placeholder:"18"}],
 secuencias:[{label:"Primer término",unit:"valor",placeholder:"2"},{label:"Diferencia / razón",unit:"valor",placeholder:"3"},{label:"Número de término",unit:"nº",placeholder:"10"}],
 "bases-numericas":[{label:"Número",unit:"valor",placeholder:"1010"},{label:"Base de origen",unit:"base",placeholder:"2"},{label:"Base destino",unit:"base",placeholder:"16"}]
};
const parse=(value:string)=>Number(value.replace(",","."));

export function MathFormulaTool({tool}:{tool:GeneralTool}){
 const fields=defs[tool.slug];
 const[values,setValues]=useState<string[]>(()=>fields.map(()=>""));
 const[mode,setMode]=useState<"aritmetica"|"geometrica">("aritmetica");
 const[out,setOut]=useState<{label:string;value:string}[]>([]);
 const calculate=()=>{
  const parsed=values.map(parse);
  if(parsed.some(value=>!Number.isFinite(value))){setOut([{label:"Error",value:"Completa todos los valores."}]);return}
  setOut(calculateMath(tool.slug,parsed,{mode,targetBase:parsed[2]}));
 };
 return <div className="space-y-4">
  <div className="grid gap-4 sm:grid-cols-2">{fields.map((field,index)=><label key={field.label} className="space-y-1"><span className="text-sm font-medium">{field.label}</span><div className="flex"><input type="number" inputMode="decimal" value={values[index]??""} onChange={e=>setValues(current=>current.map((value,i)=>i===index?e.target.value:value))} placeholder={`Ej.: ${field.placeholder}`} className="h-11 min-w-0 flex-1 rounded-l-xl border bg-background px-3"/><span className="flex h-11 items-center rounded-r-xl border border-l-0 bg-muted px-3 text-xs font-medium">{field.unit}</span></div></label>)}</div>
  {tool.slug==="secuencias"&&<label className="block space-y-1"><span className="text-sm font-medium">Tipo de secuencia</span><select value={mode} onChange={e=>setMode(e.target.value as "aritmetica"|"geometrica")} className="h-11 w-full rounded-xl border bg-background px-3"><option value="aritmetica">Aritmética</option><option value="geometrica">Geométrica</option></select></label>}
  <button type="button" onClick={calculate} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>
  {out.length>0&&<div className="grid gap-3 sm:grid-cols-2">{out.map(result=><output key={result.label} className="block rounded-xl border bg-muted/30 p-4"><span className="block text-xs font-semibold text-muted-foreground">{result.label}</span><strong className="mt-1 block text-lg">{result.value}</strong></output>)}</div>}
 </div>;
}
