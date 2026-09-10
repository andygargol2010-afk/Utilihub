import { makeTool } from "./types";

export const EDUCATION_SUBJECTS = [
 ["matematicas","Mathematics",["aritmetica","algebra","geometria","calculo","estadistica"]],
 ["lengua","Language and literature",["gramatica","ortografia","comprension","literatura","redaccion"]],
 ["fisica","Physics",["mecanica","energia","electricidad","ondas","fisica-moderna"]],
 ["quimica","Chemistry",["atomos","estequiometria","organica","equilibrio","quimica-general"]],
 ["biologia","Biology",["celula","genetica","evolucion","ecologia","anatomia"]],
 ["historia","History",["antiguedad","edad-media","edad-moderna","edad-contemporanea","historia-argentina"]],
 ["geografia","Geography",["mapas","relieve","clima","poblacion","geografia-economica"]],
 ["ingles","English",["vocabulario","gramatica-ingles","reading","verbos","writing"]],
 ["informatica","Computer science",["algoritmos","programacion","bases-datos","redes","seguridad-digital"]],
 ["economia","Economics",["microeconomia","macroeconomia","mercados","finanzas-basicas","economia-internacional"]],
 ["filosofia","Philosophy",["logica","etica","epistemologia","filosofia-politica","historia-filosofia"]],
 ["ciencias-naturales","Natural sciences",["materia","energia","tierra","ambiente","metodo-cientifico"]],
] as const;

const title=(s:string)=>s.replaceAll("-"," ").replace(/(^| )\w/g,c=>c.toUpperCase());
export const educationTopicTitle = title;
export const EDUCATION_TOOLS=EDUCATION_SUBJECTS.flatMap(([subject,name,topics])=>topics.map(topic=>makeTool(`test-${subject}-${topic}`,`Quiz builder: ${name} — ${title(topic)}`,"educacion","education-test",`Create custom ${name} quizzes on ${title(topic)} for primary, secondary, or university.`,["quiz","exam","education",subject,topic,"primary","secondary","university"],{subject,topic,levels:["primary","secondary","university"],difficulty:["easy","medium","hard"]})));
export const EDUCATION_CATEGORIES=[{slug:"educacion",name:"Education",title:"Educational quiz builders | UtiliHub",description:"Quiz builders for primary, secondary, and university across 12 subjects.",intro:"Create quizzes by subject and topic, choose level and difficulty, and generate a ready-to-take assessment."}];
