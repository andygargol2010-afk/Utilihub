export type EducationLevel="primaria"|"secundaria"|"universidad";
export type EducationDifficulty="facil"|"media"|"dificil";
export type GeneratedQuestion={text:string;options:string[];answer:number};

type Q={text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};
import { EDUCATION_BANK_EXPANDED } from "./education-bank-expanded";
const BANK:Record<string,Q[]> = EDUCATION_BANK_EXPANDED;

function shuffle<T>(items:T[]){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function profileScore(item:Q,level:EducationLevel,difficulty:EducationDifficulty){return (item.levels.includes(level)?2:0)+(item.difficulty===difficulty?2:0)}

export function generateEducationTest(topic:string,level:EducationLevel,difficulty:EducationDifficulty,count:number):GeneratedQuestion[]{
  const bank=BANK[topic]??[];
  if(!bank.length)return[];
  const total=Math.max(1,Math.min(50,Math.trunc(Number(count))||10));
  const ranked=shuffle(bank).sort((a,b)=>profileScore(b,level,difficulty)-profileScore(a,level,difficulty));
  const selected:Q[]=[];
  for(const question of ranked){
    if(selected.length>=total)break;
    selected.push(question);
  }
  if(selected.length<total){
    const remaining=shuffle(bank.filter(question=>!selected.includes(question)));
    for(const question of remaining){
      if(selected.length>=total)break;
      selected.push(question);
    }
  }
  const result=selected.slice(0,total);
  return result.map(source=>{
    const options=shuffle(source.options);
    return {text:source.text,options,answer:options.indexOf(source.answer)};
  });
}
