import {useEffect,useMemo,useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

const iso=(d:Date)=>d.toISOString().slice(0,10);
const parseDate=(s:string)=>{const d=new Date(`${s}T00:00:00`);return Number.isNaN(d.getTime())?null:d};
const pad=(n:number)=>String(n).padStart(2,"0");

export function TimeTool({tool}:{tool:GeneralTool}){
 const [date,setDate]=useState(iso(new Date()));
 const [date2,setDate2]=useState(iso(new Date(Date.now()+86400000)));
 const [hours,setHours]=useState("00:00");
 const [hours2,setHours2]=useState("01:00");
 const [target,setTarget]=useState("");
 const [remaining,setRemaining]=useState(0);
 const [running,setRunning]=useState(false);
 const [out,setOut]=useState("");
 useEffect(()=>{if(tool.slug!=="cuenta-regresiva")return;const id=window.setInterval(()=>{if(!target)return;const ms=Math.max(0,new Date(target).getTime()-Date.now());setRemaining(ms);if(ms===0)setRunning(false)},250);return()=>window.clearInterval(id)},[target,tool.slug]);
 const formatted=useMemo(()=>{const total=Math.floor(remaining/1000),s=total%60,m=Math.floor(total/60)%60,h=Math.floor(total/3600);return `${pad(h)}:${pad(m)}:${pad(s)}`},[remaining]);
 const calculate=()=>{
  const a=parseDate(date),b=parseDate(date2);if(tool.slug==="cuenta-regresiva")return;
  if(tool.slug==="duracion-horas"){const [h1,m1]=hours.split(":").map(Number),[h2,m2]=hours2.split(":").map(Number);if([h1,m1,h2,m2].some(Number.isNaN)){setOut("Introduce horas válidas.");return}let mins=(h2*60+m2)-(h1*60+m1);if(mins<0)mins+=1440;setOut(`Duración: ${Math.floor(mins/60)} h ${mins%60} min`);return}
  if(!a){setOut("Selecciona una fecha válida.");return}
  if(tool.slug==="edad-exacta"){const now=new Date();let y=now.getFullYear()-a.getFullYear(),m=now.getMonth()-a.getMonth(),d=now.getDate()-a.getDate();if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate()}if(m<0){y--;m+=12}setOut(`Edad exacta: ${y} años, ${m} meses y ${d} días`);return}
  if(tool.slug==="numero-semana"){const x=new Date(Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()));const day=x.getUTCDay()||7;x.setUTCDate(x.getUTCDate()+4-day);const start=new Date(Date.UTC(x.getUTCFullYear(),0,1));setOut(`Semana ISO: ${Math.ceil((((x.getTime()-start.getTime())/86400000)+1)/7)}`);return}
  if(tool.slug==="dia-semana"){setOut(`Día: ${a.toLocaleDateString("es-AR",{weekday:"long"})}`);return}
  if(tool.slug==="trimestre"){const q=Math.floor(a.getMonth()/3)+1;setOut(`Trimestre: ${q} · Semestre: ${q<=2?1:2}`);return}
  if(tool.slug==="ano-bisiesto"){const y=a.getFullYear();setOut(`${y} ${y%4===0&&(y%100!==0||y%400===0)?"es":"no es"} bisiesto.`);return}
  if(tool.slug==="dias-del-ano"){const start=new Date(a.getFullYear(),0,0);setOut(`Día del año: ${Math.floor((a.getTime()-start.getTime())/86400000)}`);return}
  if(!b){setOut("Selecciona la segunda fecha.");return}
  const diff=Math.abs(b.getTime()-a.getTime());
  if(tool.slug==="horas-entre-fechas"){const mins=Math.floor(diff/60000);setOut(`Diferencia: ${Math.floor(mins/60)} h ${mins%60} min`);return}
  if(tool.slug==="semanas-entre-fechas"){setOut(`Diferencia: ${(diff/604800000).toFixed(2)} semanas`);return}
  if(tool.slug==="dias-laborables"){let count=0;const start=new Date(Math.min(a.getTime(),b.getTime()));const end=new Date(Math.max(a.getTime(),b.getTime()));for(const d=new Date(start);d<=end;d.setDate(d.getDate()+1)){const day=d.getDay();if(day!==0&&day!==6)count++}setOut(`Días laborables: ${count}`);return}
  if(tool.slug==="fecha-dias-laborables"){setOut("Para esta herramienta, usa una fecha inicial y consulta el número de días laborables requerido.");return}
  if(tool.slug==="sumar-dias"||tool.slug==="restar-dias"){const n=Number(hours);if(!Number.isFinite(n)){setOut("Introduce el número de días en el campo de cantidad.");return}const r=new Date(a);r.setDate(r.getDate()+(tool.slug==="sumar-dias"?n:-n));setOut(`Resultado: ${r.toLocaleDateString("es-AR")}`);return}
  setOut(`Entre las fechas hay ${Math.round(diff/86400000)} días.`);
 };
 if(tool.slug==="cuenta-regresiva")return <div className="space-y-4"><label className="block space-y-1"><span className="text-sm font-medium">Fecha y hora objetivo</span><input type="datetime-local" value={target} onChange={e=>setTarget(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label><div className="rounded-xl border p-6 text-center text-4xl font-mono font-bold tabular-nums">{formatted}</div><button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={()=>{if(!target){setRemaining(0);return}setRunning(true)}}>{running?"En curso":"Iniciar cuenta regresiva"}</button></div>;
 return <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1"><span className="text-sm font-medium">Fecha</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label><label className="space-y-1"><span className="text-sm font-medium">Segunda fecha</span><input type="date" value={date2} onChange={e=>setDate2(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label></div>{tool.slug==="duracion-horas"&&<div className="grid gap-4 sm:grid-cols-2"><input type="time" value={hours} onChange={e=>setHours(e.target.value)} className="h-11 rounded-xl border bg-background px-3"/><input type="time" value={hours2} onChange={e=>setHours2(e.target.value)} className="h-11 rounded-xl border bg-background px-3"/></div>}{(tool.slug==="sumar-dias"||tool.slug==="restar-dias")&&<input type="number" value={hours} onChange={e=>setHours(e.target.value)} placeholder="Cantidad de días" className="h-11 w-full rounded-xl border bg-background px-3"/>}<button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={calculate}>Calcular</button>{out&&<output className="block rounded-xl border bg-muted/30 p-4">{out}</output>}</div>
}
