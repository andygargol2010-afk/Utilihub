import {useMemo,useState} from "react";
import type {GeneralTool} from "@/lib/general/types";

type Question={text:string;answer:string};
const shuffle=<T,>(items:T[])=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
export function EducationTool({tool}:{tool:GeneralTool}){
 const [level,setLevel]=useState("secundaria"),[difficulty,setDifficulty]=useState("media"),[count,setCount]=useState("10"),[question,setQuestion]=useState(""),[answer,setAnswer]=useState(""),[questions,setQuestions]=useState<Question[]>([]),[generated,setGenerated]=useState<Question[]>([]);
 const add=()=>{if(!question.trim()||!answer.trim())return;setQuestions(q=>[...q,{text:question.trim(),answer:answer.trim()}]);setQuestion("");setAnswer("")};
 const create=()=>setGenerated(shuffle(questions).slice(0,Math.max(1,Math.min(50,Number(count)||10))));
 const subject=String(tool.config?.subject??""),topic=String(tool.config?.topic??"").replaceAll("-"," ");
 const title=useMemo(()=>`${subject} · ${topic}`,[subject,topic]);
 return <div className="space-y-5">
  <div className="rounded-xl border bg-muted/30 p-4"><p className="font-semibold">{title}</p><p className="text-sm text-muted-foreground">Creador especializado para primaria, secundaria y universidad. Agrega tus preguntas y UtiliHub las ordena aleatoriamente para formar el test.</p></div>
  <div className="grid gap-4 sm:grid-cols-3">
   <label className="space-y-1"><span className="text-sm font-medium">Nivel</span><select value={level} onChange={e=>setLevel(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="primaria">Primaria</option><option value="secundaria">Secundaria</option><option value="universidad">Universidad</option></select></label>
   <label className="space-y-1"><span className="text-sm font-medium">Dificultad</span><select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="facil">Fácil</option><option value="media">Media</option><option value="dificil">Difícil</option></select></label>
   <label className="space-y-1"><span className="text-sm font-medium">Preguntas</span><input type="number" min="1" max="50" value={count} onChange={e=>setCount(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3"/></label>
  </div>
  <div className="grid gap-4 md:grid-cols-2"><label className="space-y-1"><span className="text-sm font-medium">Pregunta</span><textarea value={question} onChange={e=>setQuestion(e.target.value)} className="min-h-24 w-full rounded-xl border bg-background p-3" placeholder="Escribe una pregunta…"/></label><label className="space-y-1"><span className="text-sm font-medium">Respuesta correcta</span><textarea value={answer} onChange={e=>setAnswer(e.target.value)} className="min-h-24 w-full rounded-xl border bg-background p-3" placeholder="Escribe la respuesta…"/></label></div>
  <div className="flex flex-wrap gap-2"><button onClick={add} className="rounded-xl border px-4 py-2 font-semibold">Añadir pregunta</button><button onClick={create} disabled={!questions.length} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-50">Crear test</button></div>
  <p className="text-sm text-muted-foreground">Banco actual: {questions.length} preguntas · {level} · dificultad {difficulty}.</p>
  {generated.length>0&&<div className="space-y-3 rounded-xl border p-4"><h3 className="font-bold">Test generado</h3>{generated.map((q,i)=><div key={`${q.text}-${i}`} className="rounded-lg bg-muted/30 p-3"><p><strong>{i+1}.</strong> {q.text}</p><details className="mt-2"><summary className="cursor-pointer text-sm font-medium">Ver respuesta</summary><p className="mt-1 text-sm">{q.answer}</p></details></div>)}</div>}
 </div>
}
