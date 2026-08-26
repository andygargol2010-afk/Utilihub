export type EducationLevel="primaria"|"secundaria"|"universidad";
export type EducationDifficulty="facil"|"media"|"dificil";
export type GeneratedQuestion={text:string;options:string[];answer:number};

type Q={text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};
import { EDUCATION_BANK_EXPANDED } from "./education-bank-expanded";
const BANK:Record<string,Q[]> = EDUCATION_BANK_EXPANDED;
const MAX_QUESTIONS=20;

function shuffle<T>(items:T[]){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function uniqueQuestions(items:Q[]):Q[]{const seen=new Set<string>();const out:Q[]=[];for(const item of items){const key=item.text.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");if(seen.has(key))continue;seen.add(key);out.push(item)}return out}

/**
 * Selects the requested amount without repeating questions. The requested
 * difficulty is always given priority, followed by the requested level.
 * This makes changing difficulty/level materially change the generated test
 * while still allowing up to 20 questions when a single filter has fewer
 * than 20 matching entries.
 */
function selectQuestions(bank:Q[],level:EducationLevel,difficulty:EducationDifficulty,total:number){
  const preferred=shuffle(bank.filter(q=>q.difficulty===difficulty && q.levels.includes(level)));
  const difficultyMatches=shuffle(bank.filter(q=>q.difficulty===difficulty && !preferred.includes(q)));
  const levelMatches=shuffle(bank.filter(q=>q.difficulty!==difficulty && q.levels.includes(level) && !preferred.includes(q)));
  const remainder=shuffle(bank.filter(q=>!preferred.includes(q)&&!difficultyMatches.includes(q)&&!levelMatches.includes(q)));
  const ordered=[...preferred,...difficultyMatches,...levelMatches,...remainder];
  return uniqueQuestions(ordered).slice(0,total);
}

export function generateEducationTest(topic:string,level:EducationLevel,difficulty:EducationDifficulty,count:number):GeneratedQuestion[]{
  const bank=uniqueQuestions(BANK[topic]??[]);
  if(!bank.length)return[];
  const requested=Math.trunc(Number(count));
  const total=Math.max(1,Math.min(MAX_QUESTIONS,Number.isFinite(requested)&&requested>0?requested:10));
  const selected=selectQuestions(bank,level,difficulty,Math.min(total,bank.length));
  return selected.map(source=>{const options=shuffle(source.options);return{text:source.text,options,answer:options.indexOf(source.answer)}});
}

export const EDUCATION_MAX_QUESTIONS=MAX_QUESTIONS;
