import { makeTool } from "./types";

export const EDUCATION_SUBJECTS = [
 ["matematicas","Matemáticas",["aritmetica","algebra","geometria","calculo","estadistica"]],
 ["lengua","Lengua y literatura",["gramatica","ortografia","comprension","literatura","redaccion"]],
 ["fisica","Física",["mecanica","energia","electricidad","ondas","fisica-moderna"]],
 ["quimica","Química",["atomos","estequiometria","organica","equilibrio","quimica-general"]],
 ["biologia","Biología",["celula","genetica","evolucion","ecologia","anatomia"]],
 ["historia","Historia",["antiguedad","edad-media","edad-moderna","edad-contemporanea","historia-argentina"]],
 ["geografia","Geografía",["mapas","relieve","clima","poblacion","geografia-economica"]],
 ["ingles","Inglés",["vocabulario","gramatica-ingles","reading","verbos","writing"]],
 ["informatica","Informática",["algoritmos","programacion","bases-datos","redes","seguridad-digital"]],
 ["economia","Economía",["microeconomia","macroeconomia","mercados","finanzas-basicas","economia-internacional"]],
 ["filosofia","Filosofía",["logica","etica","epistemologia","filosofia-politica","historia-filosofia"]],
 ["ciencias-naturales","Ciencias naturales",["materia","energia","tierra","ambiente","metodo-cientifico"]],
] as const;

const title=(s:string)=>s.replaceAll("-"," ").replace(/(^| )\w/g,c=>c.toUpperCase());
export const educationTopicTitle = title;
export const EDUCATION_TOOLS=EDUCATION_SUBJECTS.flatMap(([subject,name,topics])=>topics.map(topic=>makeTool(`test-${subject}-${topic}`,`Creador de tests: ${name} — ${title(topic)}`,"educacion","education-test",`Crea tests personalizados de ${name} sobre ${title(topic)} para primaria, secundaria o universidad.`,["test","examen","educacion",subject,topic,"primaria","secundaria","universidad"],{subject,topic,levels:["primaria","secundaria","universidad"],difficulty:["facil","media","dificil"]})));
export const EDUCATION_CATEGORIES=[{slug:"educacion",name:"Educación",title:"Creadores de tests educativos | UtiliHub",description:"Creadores de tests para primaria, secundaria y universidad en 12 materias.",intro:"Crea cuestionarios por materia y tema, selecciona nivel y dificultad, y genera una evaluación lista para resolver."}];
