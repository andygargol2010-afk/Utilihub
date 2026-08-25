import {useMemo,useState} from "react";
import type {GeneralTool} from "@/lib/general/types";
import {generateBySlug} from "@/lib/general/generator-engine";

const words=(s:string)=>s.trim()?s.trim().split(/\s+/):[];
const tokens=(s:string)=>s.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const toWords=(s:string)=>tokens(s).map(x=>x.toLowerCase());
const kebab=(s:string)=>toWords(s).join("-");
const snake=(s:string)=>toWords(s).join("_");
const camel=(s:string)=>{const w=toWords(s);return w.length?w[0]+w.slice(1).map(x=>x[0].toUpperCase()+x.slice(1)).join(""):""};
const pascal=(s:string)=>toWords(s).map(x=>x[0].toUpperCase()+x.slice(1)).join("");
const escapeHtml=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
const processText=(slug:string,text:string):string=>{
  switch(slug){
    case "contador-de-caracteres": return `Caracteres: ${text.length} · Sin espacios: ${text.replace(/\s/g,"").length}`;
    case "contador-de-lineas": return `Líneas: ${text?text.split(/\r?\n/).length:0}`;
    case "contador-de-frases": return `Frases: ${text.trim()?text.trim().split(/[.!?]+(?:\s+|$)/).filter(Boolean).length:0}`;
    case "contador-de-parrafos": return `Párrafos: ${text.trim()?text.split(/\n\s*\n/).filter(p=>p.trim()).length:0}`;
    case "mayusculas": return text.toUpperCase();
    case "minusculas": return text.toLowerCase();
    case "capitalizar": return text.replace(/(^|[.!?]\s+)(\p{L})/gu,(_,p,c)=>p+c.toUpperCase());
    case "camel-case": return camel(text);
    case "pascal-case": return pascal(text);
    case "snake-case": return snake(text);
    case "kebab-case": return kebab(text);
    case "quitar-espacios": return text.replace(/\s+/g," ").trim();
    case "lineas-unicas": return [...new Set(text.split(/\r?\n/))].join("\n");
    case "ordenar-lineas": return text.split(/\r?\n/).sort((a,b)=>a.localeCompare(b)).join("\n");
    case "invertir-texto": return [...text].reverse().join("");
    case "extraer-numeros": return text.match(/[-+]?\d+(?:[.,]\d+)?/g)?.join("\n")??"";
    case "extraer-emails": return text.match(/[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+/g)?.join("\n")??"";
    case "extraer-urls": return text.match(/https?:\/\/[^\s<]+/g)?.join("\n")??"";
    case "limpiar-texto": return text.replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\r\n/g,"\n").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();
    case "texto-a-lista": return text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).join(", ");
    case "lista-a-texto": return text.split(",").map(x=>x.trim()).filter(Boolean).join("\n");
    case "markdown-tabla": {const rows=text.split(/\r?\n/).map(r=>r.split("\t"));if(!rows.length||!rows[0].length)return"";return `| ${rows[0].join(" | ")} |\n| ${rows[0].map(()=>"---").join(" | ")} |\n${rows.slice(1).map(r=>`| ${r.join(" | ")} |`).join("\n")}`;}
    case "markdown-a-html": return escapeHtml(text).replace(/^### (.+)$/gm,"<h3>$1</h3>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");
    case "html-a-texto": {const doc=new DOMParser().parseFromString(text,"text/html");return doc.body.textContent??"";}
    case "checklist": return text.split(/\r?\n/).map(x=>`- [ ] ${x}`).join("\n");
    case "buscar-reemplazar": return text;
    default: throw new Error(`Herramienta de texto sin implementación específica: ${slug}`);
  }
};

export function TextTool({tool}:{tool:GeneralTool}){
  const [text,setText]=useState(""); const [replacement,setReplacement]=useState(""); const [out,setOut]=useState(""); const [copied,setCopied]=useState(false);
  const count=useMemo(()=>({words:words(text).length,chars:text.length,lines:text?text.split(/\r?\n/).length:0}),[text]);
  const run=()=>{try{if(tool.slug==="lorem-ipsum")setOut(generateBySlug(tool.slug));else if(tool.slug==="buscar-reemplazar"){setOut(text.replaceAll(replacement,""));}else if(tool.slug==="diferencia-textos"){setOut(processText("contador-de-caracteres",text));}else setOut(processText(tool.slug,text));}catch(error){setOut(error instanceof Error?error.message:"No se pudo procesar el texto.")}};
  const copy=async()=>{await navigator.clipboard.writeText(out);setCopied(true);window.setTimeout(()=>setCopied(false),1000)};
  return <div className="space-y-4"><label className="block text-sm font-semibold">Texto de entrada<textarea value={text} onChange={e=>setText(e.target.value)} className="mt-2 min-h-48 w-full rounded-xl border border-border bg-background p-4" placeholder="Escribe o pega aquí…"/></label>{tool.slug==="buscar-reemplazar"&&<label className="block text-sm font-semibold">Texto a buscar/reemplazar<input value={replacement} onChange={e=>setReplacement(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3"/></label>}<div className="flex flex-wrap gap-2"><button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>{out&&<button onClick={copy} className="rounded-xl border px-4 py-2">{copied?"Copiado":"Copiar"}</button>}</div><p className="text-xs text-muted-foreground">{count.words} palabras · {count.chars} caracteres · {count.lines} líneas</p>{out&&<output className="block whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4">{out}</output>}</div>;
}
