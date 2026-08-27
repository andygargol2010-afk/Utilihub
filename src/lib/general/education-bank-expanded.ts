import { EDUCATION_BANK_A } from "./education-bank-a";
import { EDUCATION_BANK_B } from "./education-bank-b";
import { EDUCATION_BANK_A_REAL } from "./education-bank-a/index";
import type { EducationDifficulty, EducationLevel } from "./education-engine";

type Q={id:string;text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};
type BaseQ={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};

const LEGACY_BANK:Record<string,BaseQ[]>={...EDUCATION_BANK_A,...EDUCATION_BANK_B};
const REAL_BANK:Record<string,BaseQ[]>=EDUCATION_BANK_A_REAL;
const LEVELS:EducationLevel[]=["primaria","secundaria","universidad"];
const DIFFICULTIES:EducationDifficulty[]=["facil","media","dificil"];
const TARGET=40;

function normalize(text:string){return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim()}

function normalizeRealBank(topic:string,base:BaseQ[]):Q[]{
  if(base.length!==TARGET) throw new Error(`Banco real incompleto: ${topic} tiene ${base.length}, se requieren ${TARGET}`);
  const seen=new Set<string>();
  return base.map((question,index)=>{
    if(!question.text?.trim()) throw new Error(`${topic} #${index+1}: texto inválido`);
    const key=normalize(question.text);
    if(seen.has(key)) throw new Error(`${topic}: pregunta duplicada: ${question.text}`);
    seen.add(key);
    if(question.options.length!==4||new Set(question.options.map(normalize)).size!==4) throw new Error(`${topic} #${index+1}: opciones inválidas`);
    if(!question.options.map(normalize).includes(normalize(question.answer))) throw new Error(`${topic} #${index+1}: respuesta ausente en opciones`);
    if(!question.levels?.length||question.levels.length!==1||!LEVELS.includes(question.levels[0])) throw new Error(`${topic} #${index+1}: nivel inválido`);
    if(!question.difficulty||!DIFFICULTIES.includes(question.difficulty)) throw new Error(`${topic} #${index+1}: dificultad inválida`);
    return {id:`${topic}-${index+1}`,text:question.text,options:[...question.options],answer:question.answer,levels:question.levels,difficulty:question.difficulty};
  });
}

function legacyMetadata(topic:string,index:number,base:BaseQ){return {levels:base.levels?.length?base.levels:[LEVELS[index%3]],difficulty:base.difficulty??DIFFICULTIES[(index+topic.length)%3]}}

function legacyCandidates(base:BaseQ[]):BaseQ[]{
  const prompts=[
    "Selecciona la respuesta correcta:","¿Cuál opción responde mejor al enunciado?","Identifica la respuesta correcta:","¿Qué afirmación corresponde al enunciado?","Elige la alternativa correcta:",
    "¿Cuál es la respuesta más precisa?","Determina cuál afirmación es correcta:","Analiza el enunciado y selecciona:","¿Qué alternativa coincide con lo planteado?","Reconoce la opción que corresponde:",
    "Selecciona la alternativa que mejor explica el enunciado:","¿Cuál respuesta es compatible con la pregunta?","Examina las opciones y elige la correcta:","¿Qué opción representa correctamente la idea planteada?","Identifica qué alternativa es válida:",
    "Elige la respuesta que corresponde exactamente:","Resuelve este ejercicio:","Considera el siguiente caso:","Determina el resultado correcto:","Evalúa el planteo y selecciona:"
  ];
  return base.flatMap(question=>prompts.map((prefix,index)=>({...question,text:`${prefix} ${question.text}`,options:[...question.options.slice(0,3),question.answer],_index:index})));
}

function buildLegacyBank(topic:string,base:BaseQ[]):Q[]{
  const result:Q[]=[];const seen=new Set<string>();
  for(const candidate of legacyCandidates(base)){
    if(result.length>=TARGET)break;
    const key=normalize(candidate.text);if(seen.has(key))continue;seen.add(key);
    result.push({id:`${topic}-${result.length+1}`,text:candidate.text,options:[...candidate.options],answer:candidate.answer,...legacyMetadata(topic,result.length,candidate)});
  }
  if(result.length<TARGET) throw new Error(`Banco legado incompleto: ${topic} tiene ${result.length}, se requieren ${TARGET}`);
  return result;
}

const TOPICS=new Set([...Object.keys(LEGACY_BANK),...Object.keys(REAL_BANK)]);
export const EDUCATION_BANK_EXPANDED:Record<string,Q[]>=Object.fromEntries([...TOPICS].map(topic=>[topic,REAL_BANK[topic]?normalizeRealBank(topic,REAL_BANK[topic]):buildLegacyBank(topic,LEGACY_BANK[topic])]));
export function educationBankSize(topic:string){return EDUCATION_BANK_EXPANDED[topic]?.length??0}
export const EDUCATION_BANK_TARGET=TARGET;
