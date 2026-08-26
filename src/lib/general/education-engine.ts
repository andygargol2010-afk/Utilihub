export type EducationLevel="primaria"|"secundaria"|"universidad";
export type EducationDifficulty="facil"|"media"|"dificil";
export type GeneratedQuestion={text:string;options:string[];answer:number};

import { EDUCATION_BANK_A } from "./education-bank-a";
import { EDUCATION_BANK_B } from "./education-bank-b";

type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
const BANK:Record<string,Q[]>={...EDUCATION_BANK_A,...EDUCATION_BANK_B};

function shuffle<T>(items:T[]){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const UNIVERSITY_TOPICS=new Set(["calculo","epistemologia","filosofia-politica","historia-filosofia","logica","microeconomia","macroeconomia","mercados","finanzas-basicas","economia-internacional","algoritmos","programacion","bases-datos","redes","seguridad-digital","fisica-moderna","equilibrio","organica","estequiometria"]);
const PRIMARY_TOPICS=new Set(["aritmetica","geometria","gramatica","ortografia","comprension","antiguedad","mapas","relieve","clima","poblacion","materia","ambiente","metodo-cientifico"]);
function defaultLevel(topic:string,index:number):EducationLevel[]{if(UNIVERSITY_TOPICS.has(topic))return index%3===0?["universidad"]:["secundaria","universidad"];if(PRIMARY_TOPICS.has(topic))return index%3===0?["primaria"]:["primaria","secundaria"];return index%3===0?["secundaria"]:["primaria","secundaria","universidad"]}
function defaultDifficulty(index:number,level:EducationLevel):EducationDifficulty{if(level==="universidad")return index%3===0?"media":"dificil";if(level==="primaria")return index%3===0?"facil":"media";return index%2===0?"media":"dificil"}
function decorateBank(topic:string,bank:Q[]):Q[]{return bank.map((item,index)=>{const levels=item.levels??defaultLevel(topic,index);return{...item,levels,difficulty:item.difficulty??defaultDifficulty(index,levels[0])}})}
export function generateEducationTest(topic:string,level:EducationLevel,difficulty:EducationDifficulty,count:number):GeneratedQuestion[]{const bank=decorateBank(topic,BANK[topic]??[]);if(!bank.length)return[];const total=Math.max(1,Math.min(50,Math.trunc(Number(count))||10));const exact=bank.filter(item=>item.levels?.includes(level)&&item.difficulty===difficulty);const sameLevel=bank.filter(item=>item.levels?.includes(level));const sameDifficulty=bank.filter(item=>item.difficulty===difficulty);const pool=exact.length?exact:sameLevel.length?sameLevel:sameDifficulty.length?sameDifficulty:bank;const shuffled=shuffle(pool);const selected=shuffled.length>=total?shuffled.slice(0,total):Array.from({length:total},(_,i)=>shuffled[i%shuffled.length]);return selected.map(source=>{const options=shuffle(source.options);return{text:source.text,options,answer:options.indexOf(source.answer)}})}
