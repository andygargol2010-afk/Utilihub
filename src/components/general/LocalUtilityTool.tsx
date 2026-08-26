import {useMemo,useState} from "react";
import type {GeneralTool as Tool} from "@/lib/general/types";
import {runFiles} from "@/lib/general/files-extra";
import {runNetwork} from "@/lib/general/network-extra";
import {runImages} from "@/lib/general/images-extra";
import {runAV} from "@/lib/general/av-extra";
import {runGeo} from "@/lib/general/geo-extra";

type Field={key:string;label:string;type?:"text"|"number"|"file";placeholder?:string};
type Config={operation:string;fields:string[]};
type Result={text:string;download?:{blob:Blob;filename:string}};
const LABELS:Record<string,string>={text:"Entrada",format:"Final de línea",filename:"Nombre de archivo",base:"URL base",file:"Archivo",dpi:"DPI",factor:"Factor",radius:"Radio",widthCm:"Ancho (cm)",heightCm:"Alto (cm)",bitrate:"Bitrate (kb/s)",duration:"Duración (s)",sizeMB:"Tamaño (MB)",sampleRate:"Frecuencia (Hz)",bits:"Bits por muestra",channels:"Canales",fps:"FPS",timecode:"Timecode",frames:"Frames",width:"Ancho (px)",height:"Alto (px)",scale:"Escala",lat:"Latitud",lon:"Longitud",lat1:"Latitud 1",lon1:"Longitud 1",lat2:"Latitud 2",lon2:"Longitud 2",lat3:"Latitud 3",lon3:"Longitud 3",distanceKm:"Distancia (km)",bearing:"Rumbo (°)",precision:"Precisión",meters:"Metros",latitude:"Latitud de referencia",value:"Valor",unit:"Unidad"};
const PLACEHOLDERS:Record<string,string>={text:"Escribe o pega aquí…",filename:"archivo.txt",format:"LF",base:"https://ejemplo.com/ruta/",dpi:"300",factor:"1",radius:"4",widthCm:"10",heightCm:"10",bitrate:"128",duration:"60",sizeMB:"10",sampleRate:"48000",bits:"16",channels:"2",fps:"30",timecode:"00:00:10:12",frames:"300",width:"1920",height:"1080",scale:"0.5",lat:"-34.6037",lon:"-58.3816",lat1:"-34.6037",lon1:"-58.3816",lat2:"-34.61",lon2:"-58.37",lat3:"-34.60",lon3:"-58.39",distanceKm:"10",bearing:"90",precision:"7",meters:"1000",latitude:"-34.6",value:"10",unit:"nm"};
const NUMBER_FIELDS=new Set(["dpi","factor","radius","widthCm","heightCm","bitrate","duration","sizeMB","sampleRate","bits","channels","fps","frames","width","height","scale","lat","lon","lat1","lon1","lat2","lon2","lat3","lon3","distanceKm","bearing","precision","meters","latitude","value"]);
function fieldsFor(tool:Tool):Field[]{const c=(tool.config||{}) as Partial<Config>;return (c.fields||["text"]).map(key=>({key,label:LABELS[key]||key,type:key==="file"?"file":NUMBER_FIELDS.has(key)?"number":"text",placeholder:PLACEHOLDERS[key]||""}));}

export function LocalUtilityTool({tool}:{tool:Tool}){
 const fields=useMemo(()=>fieldsFor(tool),[tool]);
 const [values,setValues]=useState<Record<string,string>>({});
 const [file,setFile]=useState<File>();
 const [result,setResult]=useState<Result>();
 const [busy,setBusy]=useState(false);
 const [copied,setCopied]=useState(false);
 const c=(tool.config||{}) as Partial<Config>;
 const set=(key:string,value:string)=>setValues(v=>({...v,[key]:value}));
 const run=async()=>{setBusy(true);try{let r:Result;if(tool.category==="archivos-documentos")r=await runFiles(c.operation||"",values,file);else if(tool.category==="redes-internet")r=runNetwork(c.operation||"",values);else if(tool.category==="imagenes")r=await runImages(c.operation||"",values,file);else if(tool.category==="audio-video")r=await runAV(c.operation||"",values,file);else r=runGeo(c.operation||"",values);setResult(r);}catch(e){setResult({text:e instanceof Error?e.message:"No se pudo ejecutar la herramienta."});}finally{setBusy(false)}};
 const copy=async()=>{if(!result?.text)return;try{if(!navigator.clipboard?.writeText)throw new Error("El navegador no permite copiar automáticamente.");await navigator.clipboard.writeText(result.text);setCopied(true);setTimeout(()=>setCopied(false),1000);}catch(e){setResult(r=>r?{...r,text:`${r.text}\n\nNo se pudo copiar: ${e instanceof Error?e.message:"permiso de portapapeles no disponible."}`}:{text:"No se pudo copiar."});}};
 const download=()=>{if(!result?.download)return;const url=URL.createObjectURL(result.download.blob);const a=document.createElement("a");a.href=url;a.download=result.download.filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const accept=tool.category==="imagenes"?"image/*":tool.category==="audio-video"?"audio/*,video/*":tool.category==="archivos-documentos"?"*/*":undefined;
 const singleText=fields.length===1&&fields[0].key==="text";
 return <div className="space-y-4">
  {singleText?<label className="block space-y-1"><span className="text-sm font-medium">{LABELS.text}</span><textarea value={values.text||""} onChange={e=>set("text",e.target.value)} placeholder={PLACEHOLDERS.text} className="min-h-40 w-full rounded-xl border bg-background p-4"/></label>:<div className="grid gap-4 sm:grid-cols-2">{fields.map(field=><label key={field.key} className="space-y-1"><span className="text-sm font-medium">{field.label}</span>{field.type==="file"?<input type="file" accept={accept} onChange={e=>setFile(e.target.files?.[0])} className="block h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm"/>:field.key==="format"?<select value={values.format||"LF"} onChange={e=>set("format",e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"><option>LF</option><option>CRLF</option><option>CR</option></select>:field.key==="unit"?<select value={values.unit||"nm"} onChange={e=>set("unit",e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="nm">Millas náuticas → km</option><option value="km">Kilómetros → millas náuticas</option></select>:<input type={field.type||"text"} value={values[field.key]||""} onChange={e=>set(field.key,e.target.value)} placeholder={field.placeholder} className="h-11 w-full rounded-xl border bg-background px-3"/>}</label>)}</div>}
  <div className="flex flex-wrap gap-2"><button onClick={run} disabled={busy} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-60">{busy?"Procesando…":"Procesar"}</button>{result?.text&&<button onClick={copy} className="rounded-xl border px-4 py-2">{copied?"Copiado":"Copiar"}</button>}{result?.download&&<button onClick={download} className="rounded-xl border px-4 py-2">Descargar</button>}</div>
  {result?.text&&<output className="block max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4 text-sm">{result.text}</output>}
 </div>;
}
