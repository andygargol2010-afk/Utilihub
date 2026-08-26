import { useEffect, useMemo, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { generateEducationTest, type EducationDifficulty, type EducationLevel } from "@/lib/general/education-engine";
import { useDailyStreak } from "@/hooks/use-daily-streak";

const LEVELS: Array<[EducationLevel,string]> = [["primaria","Primaria"],["secundaria","Secundaria"],["universidad","Universidad"]];
const DIFFICULTIES: Array<[EducationDifficulty,string]> = [["facil","Fácil"],["media","Media"],["dificil","Difícil"]];

export function EducationTool({ tool }: { tool: GeneralTool }) {
  const [level,setLevel]=useState<EducationLevel>("secundaria");
  const [difficulty,setDifficulty]=useState<EducationDifficulty>("media");
  const [count,setCount]=useState("10");
  const [challenge,setChallenge]=useState(false);
  const [mode,setMode]=useState<"global"|"question">("global");
  const [seconds,setSeconds]=useState("60");
  const [generated,setGenerated]=useState<ReturnType<typeof generateEducationTest>>([]);
  const [submitted,setSubmitted]=useState<Record<number,number>>({});
  const [current,setCurrent]=useState(0);
  const [remaining,setRemaining]=useState(0);
  const [completed,setCompleted]=useState(false);
  const [timedOut,setTimedOut]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const started=useRef<number|null>(null);
  const deadline=useRef<number|null>(null);
  const {streak,recordActivity}=useDailyStreak();
  const subject=String(tool.config?.subject??"");
  const rawTopic=String(tool.config?.topic??"");
  const topic=rawTopic.replaceAll("-"," ");
  const bankTopic=subject==="Ciencias naturales"&&rawTopic==="energia"?"energia-naturales":rawTopic;
  const title=useMemo(()=>`${subject} · ${topic}`,[subject,topic]);
  const finish=(timeout=false)=>{if(completed)return;const t=started.current;setElapsed(t?Math.max(1,Math.round((Date.now()-t)/1000)):0);setTimedOut(timeout);setCompleted(true);deadline.current=null;recordActivity();};
  const generate=()=>{const n=Math.max(1,Math.min(20,Number.parseInt(count,10)||10));setCount(String(n));const next=generateEducationTest(bankTopic,level,difficulty,n);setGenerated(next);setSubmitted({});setCurrent(0);setCompleted(false);setTimedOut(false);setElapsed(0);started.current=Date.now();const limit=Math.max(5,Math.min(3600,Number(seconds)||60));deadline.current=challenge?Date.now()+limit*1000:null;setRemaining(challenge?limit:0);};
  useEffect(()=>{if(!challenge||mode!=="global"||!generated.length||completed||!deadline.current)return;const id=window.setInterval(()=>{const d=deadline.current;if(!d)return;const n=Math.max(0,Math.ceil((d-Date.now())/1000));setRemaining(n);if(n===0)finish(true);},250);return()=>clearInterval(id);},[challenge,mode,generated.length,completed]);
  useEffect(()=>{if(!challenge||mode!=="question"||!generated.length||completed)return;const limit=Math.max(5,Math.min(3600,Number(seconds)||60));deadline.current=Date.now()+limit*1000;setRemaining(limit);const id=window.setInterval(()=>{const d=deadline.current;if(!d)return;const n=Math.max(0,Math.ceil((d-Date.now())/1000));setRemaining(n);if(n===0)finish(true);},250);return()=>clearInterval(id);},[current,mode,challenge,generated.length,completed,seconds]);
  const score=generated.reduce((n,q,i)=>n+(submitted[i]===q.answer?1:0),0);
  const answered=Object.keys(submitted).filter(k=>submitted[Number(k)]>=0).length;
  const progress=generated.length?Math.round(answered/generated.length*100):0;
  const question=generated[current];
  const speed=elapsed?Math.round(answered/elapsed*60):0;
  return <div className="space-y-5">
    <div className="rounded-xl border bg-muted/30 p-4"><p className="font-semibold">{title}</p><p className="text-sm text-muted-foreground">Elige nivel, dificultad y cantidad. Puedes crear tests de hasta 20 preguntas distintas.</p></div>
    <div className="grid gap-4 md:grid-cols-3">
      <fieldset className="space-y-2"><legend className="text-sm font-medium">Nivel educativo</legend><div className="grid gap-2">{LEVELS.map(([value,label])=><button key={value} type="button" aria-pressed={level===value} onClick={()=>setLevel(value)} className={`rounded-xl border px-3 py-2 text-left font-medium ${level===value?"border-primary bg-primary/10 text-primary":"bg-background hover:bg-muted"}`}>{label}</button>)}</div></fieldset>
      <fieldset className="space-y-2"><legend className="text-sm font-medium">Dificultad</legend><div className="grid gap-2">{DIFFICULTIES.map(([value,label])=><button key={value} type="button" aria-pressed={difficulty===value} onClick={()=>setDifficulty(value)} className={`rounded-xl border px-3 py-2 text-left font-medium ${difficulty===value?"border-primary bg-primary/10 text-primary":"bg-background hover:bg-muted"}`}>{label}</button>)}</div></fieldset>
      <label className="space-y-2"><span className="text-sm font-medium">Cantidad de preguntas</span><input type="number" min="1" max="20" step="1" inputMode="numeric" value={count} onChange={e=>setCount(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/><span className="text-xs text-muted-foreground">Hasta 20 preguntas por test.</span></label>
    </div>
    <div className="rounded-xl border bg-muted/20 p-4 text-sm"><span className="font-semibold">Configuración:</span> {LEVELS.find(x=>x[0]===level)?.[1]} · {DIFFICULTIES.find(x=>x[0]===difficulty)?.[1]} · {count||"0"} preguntas</div>
    <div className="rounded-xl border p-4 space-y-4"><label className="flex items-center gap-3"><input type="checkbox" checked={challenge} onChange={e=>setChallenge(e.target.checked)}/><span className="font-semibold">Modo desafío contrarreloj</span></label>{challenge&&<div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1"><span className="text-sm font-medium">Tiempo</span><select value={mode} onChange={e=>setMode(e.target.value as "global"|"question")} className="h-11 w-full rounded-xl border bg-background px-3"><option value="global">Por test</option><option value="question">Por pregunta</option></select></label><label className="space-y-1"><span className="text-sm font-medium">Segundos</span><input type="number" min="5" max="3600" value={seconds} onChange={e=>setSeconds(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label></div>}</div>
    <button type="button" onClick={generate} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground">Generar test</button>
    {generated.length>0&&<div className="space-y-4 rounded-xl border p-4"><div className="flex justify-between gap-3"><div><h3 className="font-bold">Test generado</h3><p className="text-sm text-muted-foreground">Pregunta {current+1} de {generated.length} · {answered} respondidas</p></div><div className="text-right"><span className="text-sm font-semibold">{progress}%</span>{challenge&&!completed&&<p className="text-xs font-bold text-primary">⏱ {remaining}s</p>}<p className="text-xs text-muted-foreground">🔥 {streak} días</p></div></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:`${progress}%`}}/></div>{!completed&&question&&<fieldset className="rounded-xl border p-4"><legend className="px-1 text-sm font-bold">Pregunta {current+1}</legend><p className="mb-3">{question.text}</p><div className="space-y-2">{question.options.map((option,j)=><label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"><input type="radio" name={`question-${current}`} checked={submitted[current]===j} onChange={()=>setSubmitted(s=>({...s,[current]:j}))}/><span>{option}</span></label>)}</div><div className="mt-4 flex justify-between gap-2"><button type="button" disabled={current===0} onClick={()=>setCurrent(i=>Math.max(0,i-1))} className="rounded-lg border px-4 py-2 disabled:opacity-40">Anterior</button>{current<generated.length-1?<button type="button" onClick={()=>setCurrent(i=>i+1)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Siguiente</button>:<button type="button" onClick={()=>finish(false)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Finalizar test</button>}</div></fieldset>}{completed&&<div className="rounded-xl bg-muted/40 p-5 text-center"><p className="text-2xl font-black">{score}/{generated.length}</p><p className="font-semibold">Test finalizado</p><p className="mt-2 text-sm text-muted-foreground">{challenge?`Velocidad: ${speed} respuestas/min · ${elapsed}s${timedOut?" · Tiempo agotado":""}.`:"Puedes generar otro test cuando quieras."}</p></div>}</div>}
  </div>;
}
