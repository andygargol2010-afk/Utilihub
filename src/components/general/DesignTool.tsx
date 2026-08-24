import {useMemo,useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

const hex=(value:string)=>value.trim().replace(/^#/,'');
const validHex=(value:string)=>/^[0-9a-fA-F]{6}$/.test(hex(value));
const toRgb=(value:string)=>{const h=hex(value);if(!validHex(value))return null;return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}};
const luminance=(value:string)=>{const rgb=toRgb(value);if(!rgb)return null;return[rgb.r,rgb.g,rgb.b].map(v=>{const x=v/255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4}).reduce((a,v,i)=>a+[.2126,.7152,.0722][i]*v,0)};
const contrast=(a:string,b:string)=>{const x=luminance(a),y=luminance(b);if(x===null||y===null)return null;const hi=Math.max(x,y),lo=Math.min(x,y);return(hi+.05)/(lo+.05)};

export function DesignTool({tool}:{tool:GeneralTool}){
 const [a,setA]=useState("#2563eb"),[b,setB]=useState("#ffffff"),[value,setValue]=useState("#2563eb"),[out,setOut]=useState("");
 const result=useMemo(()=>{const c=contrast(a,b);if(tool.slug==="contraste-wcag"&&c!==null)return`Contraste: ${c.toFixed(2)}:1 · WCAG AA ${c>=4.5?"cumple texto normal":"no cumple texto normal"}`;return out},[a,b,out,tool.slug]);
 const process=()=>{
  if(tool.slug==="selector-color"){const rgb=toRgb(value);if(!rgb){setOut("Introduce un HEX válido de 6 dígitos.");return}setOut(`HEX: #${hex(value).toUpperCase()} · RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`);return}
  if(tool.slug==="contraste-wcag"){if(contrast(a,b)===null)setOut("Introduce dos colores HEX válidos.");return}
  if(tool.slug==="generador-paleta"){const base=toRgb(value);if(!base){setOut("Introduce un HEX válido.");return}const variants=[.2,.4,.6].map(f=>[base.r,base.g,base.b].map(v=>Math.round(v+(255-v)*f)).map(v=>v.toString(16).padStart(2,"0")).join(""));setOut([hex(value),...variants].map(x=>`#${x.toUpperCase()}`).join("\n"));return}
  if(tool.slug==="generador-gradiente")setOut(`background: linear-gradient(135deg, ${a}, ${b});`);
  else if(tool.slug==="generador-sombra-css")setOut(`box-shadow: 0 8px 24px ${a}66;`);
  else if(tool.slug==="generador-border-radius")setOut("border-radius: 16px;");
  else if(tool.slug==="css-text-shadow")setOut(`text-shadow: 2px 2px 4px ${a}88;`);
  else if(tool.slug==="css-filter")setOut("filter: brightness(1.05) contrast(1.1) saturate(1.1);");
  else if(tool.slug==="css-grid-generator")setOut("display: grid;\ngrid-template-columns: repeat(3, minmax(0, 1fr));\ngap: 16px;");
  else if(tool.slug==="escala-tipografica")setOut("16px → 20px → 25px → 31px → 39px (ratio 1.25)");
  else setOut("Introduce los valores y procesa la herramienta.");
 };
 return <div className="space-y-4">
  <div className="grid gap-4 sm:grid-cols-2">
   <label className="space-y-1"><span className="text-sm font-medium">Color principal</span><input value={a} onChange={e=>setA(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" placeholder="#2563eb"/></label>
   <label className="space-y-1"><span className="text-sm font-medium">Color secundario</span><input value={b} onChange={e=>setB(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" placeholder="#ffffff"/></label>
  </div>
  {tool.slug==="selector-color"||tool.slug==="generador-paleta"?<label className="space-y-1 block"><span className="text-sm font-medium">Color HEX</span><input value={value} onChange={e=>setValue(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" placeholder="#2563eb"/></label>:null}
  <button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={process}>Generar / calcular</button>
  {result&&<output className="block whitespace-pre-wrap break-all rounded-xl border bg-muted/30 p-4">{result}</output>}
 </div>
}
