import {useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

const names=["Alex","Sofía","Mateo","Valentina","Lucas","Emma","Nicolás","Martina","Leo","Julia","Tomás","Camila"];
const adjectives=["rápido","azul","solar","digital","noble","curioso","pixel","verde","orbital","simple"];
const nouns=["lince","nube","cometa","robot","zorro","atlas","río","faro","código","búho"];
const randomInt=(min:number,max:number)=>Math.floor(Math.random()*(max-min+1))+min;
const randomChars=(length:number,alphabet:string)=>Array.from({length},()=>alphabet[randomInt(0,alphabet.length-1)]).join("");

export function GeneratorTool({tool}:{tool:GeneralTool}){
 const[amount,setAmount]=useState("1");const[min,setMin]=useState("1");const[max,setMax]=useState("100");const[length,setLength]=useState("8");const[items,setItems]=useState("");const[out,setOut]=useState("");
 const generate=()=>{const count=Math.max(1,Math.min(100,Math.trunc(Number(amount)||1)));const len=Math.max(1,Math.min(128,Math.trunc(Number(length)||8)));let result:string[]=[];
  switch(tool.slug){
   case"generador-numeros":{const lo=Math.min(Number(min)||0,Number(max)||100),hi=Math.max(Number(min)||0,Number(max)||100);result=Array.from({length:count},()=>String(randomInt(lo,hi)));break}
   case"generador-dados":{const sides=Math.max(2,Math.min(100,Math.trunc(Number(max)||6)));result=Array.from({length:count},()=>String(randomInt(1,sides)));break}
   case"generador-nombres":result=Array.from({length:count},()=>names[randomInt(0,names.length-1)]);break;
   case"generador-usuarios":result=Array.from({length:count},()=>`${adjectives[randomInt(0,adjectives.length-1)]}_${nouns[randomInt(0,nouns.length-1)]}${randomInt(1,999)}`);break;
   case"generador-pin":result=Array.from({length:count},()=>randomChars(len,"0123456789"));break;
   case"generador-codigos":result=Array.from({length:count},()=>randomChars(len,"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"));break;
   case"datos-prueba":result=Array.from({length:count},(_,i)=>JSON.stringify({id:`test-${Date.now()}-${i+1}`,name:names[randomInt(0,names.length-1)],value:randomInt(1,1000)}));break;
   case"sorteo":{const values=items.split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean);result=values.length?[values[randomInt(0,values.length-1)]]:["Introduce al menos un elemento."];break}
   case"lista-aleatoria":{const values=items.split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean);result=[...values].sort(()=>Math.random()-.5);break}
   case"uuid-generator":result=Array.from({length:count},()=>crypto.randomUUID());break;
   case"random-id-generator":result=Array.from({length:count},()=>randomChars(len,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"));break;
   default:result=["Generador no implementado."];
  }
  setOut(result.join("\n"));
 };
 const listInput=tool.slug==="sorteo"||tool.slug==="lista-aleatoria";
 return <div className="space-y-4">
  {listInput?<label className="block space-y-2"><span className="text-sm font-semibold">Elementos</span><textarea value={items} onChange={e=>setItems(e.target.value)} placeholder="Uno por línea o separados por comas" className="min-h-32 w-full rounded-xl border bg-background p-4"/></label>:<div className="grid gap-4 sm:grid-cols-2">
   {tool.slug!=="generador-nombres"&&tool.slug!=="generador-usuarios"&&<label className="space-y-1"><span className="text-sm font-medium">Cantidad</span><input type="number" min="1" max="100" value={amount} onChange={e=>setAmount(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label>}
   {tool.slug==="generador-numeros"&&<><label className="space-y-1"><span className="text-sm font-medium">Mínimo</span><input type="number" value={min} onChange={e=>setMin(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label><label className="space-y-1"><span className="text-sm font-medium">Máximo</span><input type="number" value={max} onChange={e=>setMax(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label></>}
   {tool.slug==="generador-dados"&&<label className="space-y-1"><span className="text-sm font-medium">Caras del dado</span><input type="number" min="2" max="100" value={max} onChange={e=>setMax(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label>}
   {!["generador-nombres","generador-usuarios","generador-numeros","generador-dados"].includes(tool.slug)&&<label className="space-y-1"><span className="text-sm font-medium">Longitud</span><input type="number" min="1" max="128" value={length} onChange={e=>setLength(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label>}
  </div>}
  <button type="button" onClick={generate} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Generar</button>
  {out&&<output className="block max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-xl border bg-muted/30 p-4 font-mono text-sm">{out}</output>}
 </div>;
}
