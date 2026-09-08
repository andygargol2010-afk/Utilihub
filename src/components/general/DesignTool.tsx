import {useMemo,useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

const hex=(value:string)=>value.trim().replace(/^#/,'');
const validHex=(value:string)=>/^[0-9a-fA-F]{6}$/.test(hex(value));
const toRgb=(value:string)=>{const h=hex(value);if(!validHex(value))return null;return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}};
const luminance=(value:string)=>{const rgb=toRgb(value);if(!rgb)return null;return[rgb.r,rgb.g,rgb.b].map(v=>{const x=v/255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4}).reduce((a,v,i)=>a+[.2126,.7152,.0722][i]*v,0)};
const contrast=(a:string,b:string)=>{const x=luminance(a),y=luminance(b);if(x===null||y===null)return null;const hi=Math.max(x,y),lo=Math.min(x,y);return(hi+.05)/(lo+.05)};
const rgbHex=(rgb:{r:number;g:number;b:number})=>`#${[rgb.r,rgb.g,rgb.b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("").toUpperCase()}`;
const hsl=(value:string)=>{const rgb=toRgb(value);if(!rgb)return null;const r=rgb.r/255,g=rgb.g/255,b=rgb.b/255,max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2,d=max-min;let h=0,s=0;if(d){s=l>.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4}}return {h:Math.round(h*60),s:Math.round(s*100),l:Math.round(l*100),rgb}};

export function DesignTool({tool}:{tool:GeneralTool}){
 const [a,setA]=useState("#2563eb"),[b,setB]=useState("#ffffff"),[value,setValue]=useState("#2563eb"),[out,setOut]=useState("");
 const result=useMemo(()=>{const c=contrast(a,b);if(tool.slug==="contraste-wcag"&&c!==null)return`Contraste: ${c.toFixed(2)}:1 · WCAG AA ${c>=4.5?"cumple texto normal":"no cumple texto normal"}`;return out},[a,b,out,tool.slug]);
 const process=()=>{
  if(tool.slug==="selector-color"){const rgb=toRgb(value);if(!rgb){setOut("Introduce un HEX válido de 6 dígitos.");return}setOut(`HEX: #${hex(value).toUpperCase()} · RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`);return}
  if(tool.slug==="contraste-wcag"){if(contrast(a,b)===null)setOut("Introduce dos colores HEX válidos.");return}
  if(tool.slug==="generador-paleta"){const base=toRgb(value);if(!base){setOut("Introduce un HEX válido.");return}const variants=[.2,.4,.6].map(f=>[base.r,base.g,base.b].map(v=>Math.round(v+(255-v)*f)).map(v=>v.toString(16).padStart(2,"0")).join(""));setOut([hex(value),...variants].map(x=>`#${x.toUpperCase()}`).join("\n"));return}
  if(tool.slug==="paleta-monocromatica"){const base=toRgb(a);if(!base){setOut("Introduce un HEX válido.");return}setOut([-.35,-.18,0,.18,.35].map(f=>rgbHex({r:base.r+(f<0?base.r*f:(255-base.r)*f),g:base.g+(f<0?base.g*f:(255-base.g)*f),b:base.b+(f<0?base.b*f:(255-base.b)*f)})).join("\n"));return}
  if(tool.slug==="mezclador-de-colores"){const x=toRgb(a),y=toRgb(b);if(!x||!y){setOut("Introduce dos colores HEX válidos.");return}setOut(`Color mezclado: ${rgbHex({r:(x.r+y.r)/2,g:(x.g+y.g)/2,b:(x.b+y.b)/2})}`);return}
  if(tool.slug==="hex-a-hsl-avanzado"){const result=hsl(a);if(!result){setOut("Introduce un HEX válido de 6 dígitos.");return}setOut(`HEX: ${rgbHex(result.rgb)}\nRGB: ${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b}\nHSL: ${result.h}°, ${result.s}%, ${result.l}%`);return}
  if(tool.slug==="paleta-complementaria"){const result=hsl(a);if(!result){setOut("Introduce un HEX válido.");return}const complement=(result.h+180)%360;setOut(`Color base: ${rgbHex(result.rgb)}\nMatiz complementario: ${complement}°\nUsa HSL(${complement}, ${result.s}%, ${result.l}%) para el complemento.`);return}
  if(tool.slug==="generador-gradiente")setOut(`background: linear-gradient(135deg, ${a}, ${b});`);
  else if(tool.slug==="generador-sombra-css")setOut(`box-shadow: 0 8px 24px ${a}66;`);
  else if(tool.slug==="generador-border-radius")setOut("border-radius: 16px;");
  else if(tool.slug==="css-text-shadow")setOut(`text-shadow: 2px 2px 4px ${a}88;`);
  else if(tool.slug==="css-filter")setOut("filter: brightness(1.05) contrast(1.1) saturate(1.1);");
  else if(tool.slug==="css-grid-generator")setOut("display: grid;\ngrid-template-columns: repeat(3, minmax(0, 1fr));\ngap: 16px;");
  else if(tool.slug==="escala-tipografica")setOut("16px → 20px → 25px → 31px → 39px (ratio 1.25)");
  else if(tool.slug==="generador-css-clamp")setOut("font-size: clamp(1rem, 0.875rem + 1vw, 1.5rem);");
  else if(tool.slug==="sistema-espaciado")setOut(":root { --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px; --space-6: 32px; }");
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
