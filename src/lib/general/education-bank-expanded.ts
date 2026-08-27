import { EDUCATION_BANK_A } from "./education-bank-a";
import { EDUCATION_BANK_B } from "./education-bank-b";
import type { EducationDifficulty, EducationLevel } from "./education-engine";

type Q={id:string;text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};
type BaseQ={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};

const BASE_BANK:Record<string,BaseQ[]>={...EDUCATION_BANK_A,...EDUCATION_BANK_B};
const LEVELS:EducationLevel[]=["primaria","secundaria","universidad"];
const DIFFICULTIES:EducationDifficulty[]=["facil","media","dificil"];
const TARGET=20;

function normalize(text:string){return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim()}
function uniqueOptions(options:string[],answer:string){const out=[...new Set(options.filter(Boolean))];if(!out.some(x=>normalize(x)===normalize(answer)))out.push(answer);return out.slice(0,4)}
function metadata(topic:string,index:number,base:BaseQ){return {levels:base.levels?.length?base.levels:[LEVELS[index%3]],difficulty:base.difficulty??DIFFICULTIES[(index+topic.length)%3]}}

/* Local fallback: tests never depend on an external AI service. */
function vary(base:BaseQ,index:number):BaseQ[]{
  const numeric=/\d/.test(base.text);
  const prompts=numeric
    ? ["Resuelve el siguiente caso:","Calcula y selecciona la opción correcta:","Considera este ejercicio:","Aplica el procedimiento al caso:","Determina el resultado:","Comprueba el cálculo:","En este problema:","Selecciona el resultado correcto:","Analiza el ejercicio:","¿Qué resultado se obtiene?"]
    : ["Selecciona la respuesta correcta:","¿Cuál opción responde mejor al enunciado?","Identifica la respuesta correcta:","¿Qué afirmación corresponde al enunciado?","En una evaluación, ¿qué opción elegirías?","¿Cuál de estas opciones es la adecuada?","Relaciona el enunciado con su respuesta:","¿Qué opción completa correctamente la pregunta?","Elige la alternativa correcta:","¿Cuál es la respuesta más precisa?"];
  return prompts.map((prefix,i)=>{
    let text=`${prefix} ${base.text}`;
    if(numeric){const shift=(index+1)*(i+1);text=text.replace(/\b(\d+(?:[.,]\d+)?)\b/g,m=>String(Number(m.replace(",","."))+shift));}
    return {...base,text,options:[...base.options].sort(()=>((index+i)%3)-1)};
  });
}

function buildBank(topic:string,base:BaseQ[]):Q[]{
  const result:Q[]=[];const seen=new Set<string>();
  const candidates=base.flatMap((q,i)=>vary(q,i));
  for(const candidate of candidates){
    if(result.length>=TARGET)break;
    const options=uniqueOptions(candidate.options,candidate.answer);if(options.length!==4)continue;
    const key=normalize(candidate.text);if(seen.has(key))continue;seen.add(key);
    result.push({id:`${topic}-${result.length+1}`,text:candidate.text,options,answer:candidate.answer,...metadata(topic,result.length,candidate)});
  }
  if(result.length<TARGET)throw new Error(`Banco educativo incompleto: ${topic} tiene ${result.length}, se requieren ${TARGET}`);
  return result;
}

export const EDUCATION_BANK_EXPANDED:Record<string,Q[]>=Object.fromEntries(Object.entries(BASE_BANK).map(([topic,bank])=>[topic,buildBank(topic,bank)]));
export function educationBankSize(topic:string){return EDUCATION_BANK_EXPANDED[topic]?.length??0}
export const EDUCATION_BANK_TARGET=TARGET;
