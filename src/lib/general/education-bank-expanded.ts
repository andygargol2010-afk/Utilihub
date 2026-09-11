import { EDUCATION_BANK_A } from "./education-bank-a";
import { EDUCATION_BANK_B } from "./education-bank-b";
import { EDUCATION_BANK_A_REAL } from "./education-bank-a/index";
import { MAPAS } from "./education-bank-b-real";
import { EDUCATION_BANK_RELIEVE } from "./education-bank-b-relieve";
import type { EducationDifficulty, EducationLevel } from "./education-engine";

type Q={id:string;text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};
type BaseQ={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};

const LEGACY_BANK:Record<string,BaseQ[]>={...EDUCATION_BANK_A,...EDUCATION_BANK_B};
const REAL_BANK:Record<string,BaseQ[]>={...EDUCATION_BANK_A_REAL,mapas:MAPAS,relieve:EDUCATION_BANK_RELIEVE};
const LEVELS:EducationLevel[]=["primaria","secundaria","universidad"];
const DIFFICULTIES:EducationDifficulty[]=["facil","media","dificil"];
const TARGET=40;

function normalize(text:string){return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim()}

function normalizeRealBank(topic:string,base:BaseQ[]):Q[]{
  if(base.length!==TARGET) throw new Error(`Real bank incomplete: ${topic} has ${base.length}, required ${TARGET}`);
  const seen=new Set<string>();
  return base.map((question,index)=>{
    if(!question.text?.trim()) throw new Error(`${topic} #${index+1}: invalid text`);
    const key=normalize(question.text);
    if(seen.has(key)) throw new Error(`${topic}: duplicate question: ${question.text}`);
    seen.add(key);
    if(question.options.length!==4||new Set(question.options.map(normalize)).size!==4) throw new Error(`${topic} #${index+1}: invalid options`);
    if(!question.options.map(normalize).includes(normalize(question.answer))) throw new Error(`${topic} #${index+1}: answer missing from options`);
    if(!question.levels?.length||question.levels.length!==1||!LEVELS.includes(question.levels[0])) throw new Error(`${topic} #${index+1}: invalid level`);
    if(!question.difficulty||!DIFFICULTIES.includes(question.difficulty)) throw new Error(`${topic} #${index+1}: invalid difficulty`);
    return {id:`${topic}-${index+1}`,text:question.text,options:[...question.options],answer:question.answer,levels:question.levels,difficulty:question.difficulty};
  });
}

function legacyMetadata(topic:string,index:number,base:BaseQ){return {levels:base.levels?.length?base.levels:[LEVELS[index%3]],difficulty:base.difficulty??DIFFICULTIES[(index+topic.length)%3]}}

function legacyCandidates(base:BaseQ[]):BaseQ[]{
  const prompts=[
    "Select the correct answer:","Which option best answers the statement?","Identify the correct answer:","Which statement matches the prompt?","Choose the correct alternative:",
    "Which is the most precise answer?","Determine which statement is correct:","Analyze the prompt and select:","Which alternative matches what is asked?","Recognize the matching option:",
    "Select the alternative that best explains the prompt:","Which answer is compatible with the question?","Examine the options and choose the correct one:","Which option correctly represents the idea stated?","Identify which alternative is valid:",
    "Choose the answer that matches exactly:","Solve this exercise:","Consider the following case:","Determine the correct result:","Evaluate the setup and select:"
  ];
  return base.flatMap(question=>prompts.map(prefix=>({...question,text:`${prefix} ${question.text}`,options:[...question.options]})));
}

function buildLegacyBank(topic:string,base:BaseQ[]):Q[]{
  const result:Q[]=[];const seen=new Set<string>();
  for(const candidate of legacyCandidates(base)){
    if(result.length>=TARGET)break;
    const key=normalize(candidate.text);if(seen.has(key))continue;seen.add(key);
    if(candidate.options.length!==4||new Set(candidate.options.map(normalize)).size!==4) throw new Error(`${topic}: invalid options in legacy bank`);
    if(!candidate.options.map(normalize).includes(normalize(candidate.answer))) throw new Error(`${topic}: answer missing in legacy bank`);
    result.push({id:`${topic}-${result.length+1}`,text:candidate.text,options:[...candidate.options],answer:candidate.answer,...legacyMetadata(topic,result.length,candidate)});
  }
  if(result.length<TARGET) throw new Error(`Legacy bank incomplete: ${topic} has ${result.length}, required ${TARGET}`);
  return result;
}

const TOPICS=new Set([...Object.keys(LEGACY_BANK),...Object.keys(REAL_BANK)]);
export const EDUCATION_BANK_EXPANDED:Record<string,Q[]>=Object.fromEntries([...TOPICS].map(topic=>[topic,REAL_BANK[topic]?normalizeRealBank(topic,REAL_BANK[topic]):buildLegacyBank(topic,LEGACY_BANK[topic])]));
export function educationBankSize(topic:string){return EDUCATION_BANK_EXPANDED[topic]?.length??0}
export const EDUCATION_BANK_TARGET=TARGET;
