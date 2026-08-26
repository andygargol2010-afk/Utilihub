export type EducationLevel="primaria"|"secundaria"|"universidad";
export type EducationDifficulty="facil"|"media"|"dificil";
export type GeneratedQuestion={text:string;options:string[];answer:number};

type Q={text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};
import { EDUCATION_BANK_EXPANDED } from "./education-bank-expanded";
const BANK:Record<string,Q[]> = EDUCATION_BANK_EXPANDED;
const MAX_QUESTIONS=20;

function shuffle<T>(items:T[]){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function profileScore(item:Q,level:EducationLevel,difficulty:EducationDifficulty){return (item.levels.includes(level)?2:0)+(item.difficulty===difficulty?2:0)}
function uniqueQuestions(items:Q[]):Q[]{const seen=new Set<string>();const out:Q[]=[];for(const item of items){const key=item.text.trim().toLocaleLowerCase();if(seen.has(key))continue;seen.add(key);out.push(item)}return out}

export function generateEducationTest(topic:string,level:EducationLevel,difficulty:EducationDifficulty,count:number):GeneratedQuestion[]{
  const bank=uniqueQuestions(BANK[topic]??[]);
  if(!bank.length)return[];
  const requested=Math.trunc(Number(count));
  const total=Math.max(1,Math.min(MAX_QUESTIONS,Number.isFinite(requested)&&requested>0?requested:10));
  const ranked=shuffle(bank).sort((a,b)=>profileScore(b,level,difficulty)-profileScore(a,level,difficulty));
  const selected=ranked.slice(0,Math.min(total,ranked.length));
  return selected.map(source=>{const options=shuffle(source.options);return{text:source.text,options,answer:options.indexOf(source.answer)}});
}

export const EDUCATION_MAX_QUESTIONS=MAX_QUESTIONS;
