import {useMemo,useState} from "react";
import type {GeneralTool} from "@/lib/general/types";
import {generateEducationTest,type EducationDifficulty,type EducationLevel} from "@/lib/general/education-engine";

export function EducationTool({tool}:{tool:GeneralTool}){
 const [level,setLevel]=useState<EducationLevel>("secundaria");
 const [difficulty,setDifficulty]=useState<EducationDifficulty>("media");
 const [count,setCount]=useState("10");
 const [generated,setGenerated]=useState<ReturnType<typeof generateEducationTest>>([]);
 const [submitted,setSubmitted]=useState<Record<number,number>>({});
 const subject=String(tool.config?.subject??"");
 const topic=String(tool.config?.topic??"").replaceAll("-"," ");
 const title=useMemo(()=>`${subject} · ${topic}`,[subject,topic]);
 const generate=()=>{setGenerated(generateEducationTest(String(tool.config?.topic??""),level,difficulty,Number(count)));setSubmitted({});window.scrollTo({top:0,behavior:"smooth"})};
 const score=generated.reduce((n,q,i)=>n+(submitted[i]===q.answer?1:0),0);
 return <div className="space-y-5">
  <div className="rounded-xl border bg-muted/30 p-4"><p className="font-semibold">{title}</p><p className="text-sm text-muted-foreground">Configura el nivel, dificultad y cantidad. UtiliHub genera automáticamente el test; no tienes que escribir las preguntas.</p></div>
  <div className="grid gap-4 sm:grid-cols-3">
   <label className="space-y-1"><span className="text-sm font-medium">Nivel educativo</span><select value={level} onChange={e=>setLevel(e.target.value as EducationLevel)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="primaria">Primaria</option><option value="secundaria">Secundaria</option><option value="universidad">Universidad</option></select></label>
   <label className="space-y-1"><span className="text-sm font-medium">Dificultad</span><select value={difficulty} onChange={e=>setDifficulty(e.target.value as EducationDifficulty)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="facil">Fácil</option><option value="media">Media</option><option value="dificil">Difícil</option></select></label>
   <label className="space-y-1"><span className="text-sm font-medium">Cantidad de preguntas</span><input type="number" min="1" max="50" value={count} onChange={e=>setCount(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label>
  </div>
  <button onClick={generate} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground">Generar test</button>
  {generated.length>0&&<div className="space-y-4 rounded-xl border p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-bold">Test generado</h3><span className="text-sm text-muted-foreground">{score}/{generated.length} correctas</span></div>{generated.map((q,i)=><fieldset key={`${q.text}-${i}`} className="rounded-xl border p-4"><legend className="px-1 text-sm font-bold">Pregunta {i+1}</legend><p className="mb-3">{q.text}</p><div className="space-y-2">{q.options.map((option,j)=><label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"><input type="radio" name={`question-${i}`} checked={submitted[i]===j} onChange={()=>setSubmitted(s=>({...s,[i]:j}))}/><span>{option}</span></label>)}</div>{submitted[i]!==undefined&&<p className={submitted[i]===q.answer?"mt-3 text-sm font-semibold":"mt-3 text-sm font-semibold"}>{submitted[i]===q.answer?"✓ Correcta":"✗ Incorrecta"}</p>}</fieldset>)}</div>}
 </div>
}
