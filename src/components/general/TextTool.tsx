import {useState}from"react";
import type {GeneralTool}from"@/lib/general/types";
const words=(text:string)=>text.trim()?text.trim().split(/\s+/):[];
const tokens=(text:string)=>words(text).map(word=>word.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9]+/g," ").trim()).filter(Boolean);
const cases=(text:string,kind:"camel"|"pascal"|"snake"|"kebab")=>{const parts=tokens(text).map(part=>part.toLowerCase());if(kind==="snake")return parts.join("_");if(kind==="kebab")return parts.join("-");const joined=parts.map((part,index)=>index===0&&kind==="camel"?part:part.charAt(0).toUpperCase()+part.slice(1)).join("");return joined};

export function TextTool({tool}:{tool:GeneralTool}){
 const[input,setInput]=useState("");const[secondary,setSecondary]=useState("");const[out,setOut]=useState("");
 const run=()=>{let result="";switch(tool.slug){
  case"contador-de-caracteres":result=`Con espacios: ${input.length}\nSin espacios: ${input.replace(/\s/g,"").length}`;break;
  case"contador-de-lineas":result=`Líneas: ${input?input.split(/\r?\n/).length:0}`;break;
  case"contador-de-frases":result=`Frases: ${input.split(/[.!?]+/).map(x=>x.trim()).filter(Boolean).length}`;break;
  case"contador-de-parrafos":result=`Párrafos: ${input.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean).length}`;break;
  case"mayusculas":result=input.toUpperCase();break;case"minusculas":result=input.toLowerCase();break;
  case"capitalizar":result=input.toLowerCase().replace(/(^|\s)(\S)/g,(_,space,char)=>space+char.toUpperCase());break;
  case"camel-case":result=cases(input,"camel");break;case"pascal-case":result=cases(input,"pascal");break;case"snake-case":result=cases(input,"snake");break;case"kebab-case":result=cases(input,"kebab");break;
  case"quitar-espacios":result=input.replace(/\s+/g," ").trim();break;case"lineas-unicas":result=[...new Set(input.split(/\r?\n/))].join("\n");break;case"ordenar-lineas":result=input.split(/\r?\n/).sort((a,b)=>a.localeCompare(b)).join("\n");break;case"invertir-texto":result=[...input].reverse().join("");break;
  case"buscar-reemplazar":result=input.split(secondary).join(arguments[0]??"");break;
  case"extraer-numeros":result=(input.match(/[-+]?\d+(?:[.,]\d+)?/g)??[]).join("\n");break;case"extraer-emails":result=(input.match(/[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}/g)??[]).join("\n");break;case"extraer-urls":result=(input.match(/https?:\/\/[^\s<]+/g)??[]).join("\n");break;
  case"limpiar-texto":result=input.replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g," ").trim();break;case"texto-a-lista":result=input.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).join(", ");break;case"lista-a-texto":result=input.split(/[,;]+/).map(x=>x.trim()).filter(Boolean).join("\n");break;
  case"lorem-ipsum":result=Array.from({length:Math.max(1,Math.min(20,Number(secondary)||3))},()=>"Lorem ipsum dolor sit amet, consectetur adipiscing elit.").join(" ");break;
  case"diferencia-textos":result=input===secondary?"Los textos son iguales.":`Texto A: ${input.length} caracteres\nTexto B: ${secondary.length} caracteres\n${input===secondary?"Sin diferencias":"Los textos son diferentes."}`;break;
  case"markdown-tabla":{const rows=input.split(/\r?\n/).filter(Boolean).map(row=>row.split("\t"));if(!rows.length){result="";break}result=`| ${rows[0].join(" | ")} |\n| ${rows[0].map(()=>"---").join(" | ")} |\n${rows.slice(1).map(row=>`| ${row.join(" | ")} |`).join("\n")}`;break}
  case"markdown-a-html":result=input.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");break;
  case"html-a-texto":{const el=document.createElement("div");el.innerHTML=input;result=el.textContent??"";break}
  default:result="Herramienta de texto no implementada.";
 }setOut(result)};
 const needsSecond=["buscar-reemplazar","diferencia-textos","regex-tester"].includes(tool.slug);
 return <div className="space-y-4"><label className="block space-y-2"><span className="text-sm font-semibold">Texto de entrada</span><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Escribe o pega aquí…" className="min-h-40 w-full rounded-xl border bg-background p-4"/></label>{needsSecond&&<label className="block space-y-2"><span className="text-sm font-semibold">{tool.slug==="buscar-reemplazar"?"Texto de reemplazo":"Segundo texto"}</span><textarea value={secondary} onChange={e=>setSecondary(e.target.value)} className="min-h-24 w-full rounded-xl border bg-background p-4"/></label>}<button type="button" onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>{out&&<output className="block max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4">{out}</output>}</div>;
}
