import {useState}from"react";
import type {GeneralTool}from"@/lib/general/types";

const HTTP:Record<string,string>={"200":"OK","201":"Created","204":"No Content","301":"Moved Permanently","302":"Found","304":"Not Modified","400":"Bad Request","401":"Unauthorized","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","409":"Conflict","422":"Unprocessable Content","429":"Too Many Requests","500":"Internal Server Error","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout"};
const MIME:Record<string,string>={html:"text/html",css:"text/css",js:"text/javascript",json:"application/json",xml:"application/xml",txt:"text/plain",csv:"text/csv",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",svg:"image/svg+xml",pdf:"application/pdf",zip:"application/zip",mp3:"audio/mpeg",mp4:"video/mp4"};
const slugify=(text:string)=>text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const minify=(text:string)=>text.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s+/g," ").replace(/\s*([{}:;,])\s*/g,"$1").trim();

export function DevelopmentTool({tool}:{tool:GeneralTool}){
 const[input,setInput]=useState("");const[secondary,setSecondary]=useState("");const[out,setOut]=useState("");
 const run=()=>{try{let result="";switch(tool.slug){
  case"json-formatter":result=JSON.stringify(JSON.parse(input),null,2);break;
  case"json-validator":JSON.parse(input);result="JSON válido.";break;
  case"json-minifier":result=JSON.stringify(JSON.parse(input));break;
  case"json-a-csv":{const data=JSON.parse(input);if(!Array.isArray(data)||!data.length||typeof data[0]!=="object")throw new Error("Introduce un array JSON de objetos.");const keys=[...new Set(data.flatMap(item=>Object.keys(item)))];const esc=(v:unknown)=>`"${String(v??"").replace(/"/g,'""')}"`;result=[keys.map(esc).join(","),...data.map(row=>keys.map(key=>esc(row[key])).join(","))].join("\n");break}
  case"json-a-yaml":{const data=JSON.parse(input);const render=(value:unknown,indent=0):string=>{const pad=" ".repeat(indent);if(Array.isArray(value))return value.map(item=>`${pad}- ${typeof item==="object"&&item!==null?`\n${render(item,indent+2)}`:String(item)}`).join("\n");if(typeof value==="object"&&value!==null)return Object.entries(value).map(([key,val])=>`${pad}${key}: ${typeof val==="object"&&val!==null?`\n${render(val,indent+2)}`:String(val)}`).join("\n");return String(value)};result=render(data);break}
  case"base64-encode":result=btoa(unescape(encodeURIComponent(input)));break;
  case"base64-decode":result=decodeURIComponent(escape(atob(input)));break;
  case"url-encode":result=encodeURIComponent(input);break;
  case"url-decode":result=decodeURIComponent(input);break;
  case"html-encode":result=input.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");break;
  case"html-decode":{const el=document.createElement("textarea");el.innerHTML=input;result=el.value;break}
  case"uuid-generator":result=crypto.randomUUID();break;
  case"random-id-generator":result=crypto.randomUUID().replace(/-/g,"").slice(0,12);break;
  case"timestamp-generator":{const date=new Date(input);if(Number.isNaN(date.getTime()))throw new Error("Introduce una fecha válida.");result=String(Math.floor(date.getTime()/1000));break}
  case"timestamp-to-date":{const timestamp=Number(input);if(!Number.isFinite(timestamp))throw new Error("Introduce un timestamp válido.");result=new Date(timestamp*1000).toLocaleString("es-AR");break}
  case"http-status":result=HTTP[input.trim()]??"Código HTTP no encontrado en la tabla básica.";break;
  case"mime-types":result=MIME[input.trim().toLowerCase().replace(/^\./,"")]??"Extensión no encontrada en la tabla básica.";break;
  case"regex-tester":{const match=input.match(new RegExp(secondary,"g"));result=match?`Coincidencias (${match.length}):\n${match.join("\n")}`:"Sin coincidencias.";break}
  case"regex-escape":result=input.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");break;
  case"slug-generator":result=slugify(input);break;
  case"html-minifier":result=minify(input);break;
  case"css-minifier":result=minify(input);break;
  case"javascript-minifier":result=input.replace(/\/\/.*$/gm,"").replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s+/g," ").trim();break;
  default:result="Herramienta de desarrollo no implementada.";
 }setOut(result)}catch(error){setOut(error instanceof Error?`Error: ${error.message}`:"Error al procesar la entrada.")}};
 const dual=["regex-tester"].includes(tool.slug);
 return <div className="space-y-4"><label className="block space-y-2"><span className="text-sm font-semibold">{tool.slug==="timestamp-generator"?"Fecha y hora":tool.slug==="timestamp-to-date"?"Timestamp Unix":"Entrada"}</span><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={tool.slug==="http-status"?"Ej.: 404":tool.slug==="mime-types"?"Ej.: json":"Introduce el contenido aquí…"} className="min-h-32 w-full rounded-xl border bg-background p-4 font-mono text-sm"/></label>{dual&&<label className="block space-y-2"><span className="text-sm font-semibold">Expresión regular</span><input value={secondary} onChange={e=>setSecondary(e.target.value)} placeholder="Ej.: \\b\w+\\b" className="h-11 w-full rounded-xl border bg-background px-3 font-mono"/></label>}<button type="button" onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>{out&&<output className="block max-h-96 overflow-auto whitespace-pre-wrap break-all rounded-xl border bg-muted/30 p-4 font-mono text-sm">{out}</output>}</div>;
}
