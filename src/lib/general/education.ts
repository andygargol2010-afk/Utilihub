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

const SUBJECT_ES: Record<string, string> = {
  matematicas: "Matemáticas",
  lengua: "Lengua y literatura",
  fisica: "Física",
  quimica: "Química",
  biologia: "Biología",
  historia: "Historia",
  geografia: "Geografía",
  ingles: "Inglés",
  informatica: "Informática",
  economia: "Economía",
  filosofia: "Filosofía",
  "ciencias-naturales": "Ciencias naturales",
};

// Spanish topic titles with correct accents, used in summaryEs (user-facing ES copy).
const TOPIC_ES: Record<string, string> = {
  aritmetica: "Aritmética",
  algebra: "Álgebra",
  geometria: "Geometría",
  calculo: "Cálculo",
  estadistica: "Estadística",
  gramatica: "Gramática",
  ortografia: "Ortografía",
  comprension: "Comprensión",
  literatura: "Literatura",
  redaccion: "Redacción",
  mecanica: "Mecánica",
  energia: "Energía",
  electricidad: "Electricidad",
  ondas: "Ondas",
  "fisica-moderna": "Física moderna",
  atomos: "Átomos",
  estequiometria: "Estequiometría",
  organica: "Orgánica",
  equilibrio: "Equilibrio",
  "quimica-general": "Química general",
  celula: "Célula",
  genetica: "Genética",
  evolucion: "Evolución",
  ecologia: "Ecología",
  anatomia: "Anatomía",
  antiguedad: "Antigüedad",
  "edad-media": "Edad Media",
  "edad-moderna": "Edad Moderna",
  "edad-contemporanea": "Edad Contemporánea",
  "historia-argentina": "Historia Argentina",
  mapas: "Mapas",
  relieve: "Relieve",
  clima: "Clima",
  poblacion: "Población",
  "geografia-economica": "Geografía económica",
  vocabulario: "Vocabulario",
  "gramatica-ingles": "Gramática inglesa",
  reading: "Reading",
  verbos: "Verbos",
  writing: "Writing",
  algoritmos: "Algoritmos",
  programacion: "Programación",
  "bases-datos": "Bases de datos",
  redes: "Redes",
  "seguridad-digital": "Seguridad digital",
  microeconomia: "Microeconomía",
  macroeconomia: "Macroeconomía",
  mercados: "Mercados",
  "finanzas-basicas": "Finanzas básicas",
  "economia-internacional": "Economía internacional",
  logica: "Lógica",
  etica: "Ética",
  epistemologia: "Epistemología",
  "filosofia-politica": "Filosofía política",
  "historia-filosofia": "Historia de la filosofía",
  materia: "Materia",
  tierra: "Tierra",
  ambiente: "Ambiente",
  "metodo-cientifico": "Método científico",
};

export const EDUCATION_TOOLS=EDUCATION_SUBJECTS.flatMap(([subject,name,topics])=>topics.map(topic=>{
  const topicTitle = title(topic);
  const topicTitleEs = TOPIC_ES[topic] || topicTitle;
  const subjectEs = SUBJECT_ES[subject] || name;
  const summaryEs = `Creá cuestionarios personalizados de ${subjectEs} sobre ${topicTitleEs} para primaria, secundaria o universidad.`;
  return makeTool(`test-${subject}-${topic}`,`Quiz builder: ${name} — ${topicTitle}`,"educacion","education-test",`Create custom ${name} quizzes on ${topicTitle} for primary, secondary, or university.`,["quiz","exam","education",subject,topic,"primary","secondary","university"],{subject,topic,levels:["primary","secondary","university"],difficulty:["easy","medium","hard"], summaryEs});
}));
export const EDUCATION_CATEGORIES=[{slug:"educacion",name:"Education",title:"Educational quiz builders | UtiliHub",description:"Quiz builders for primary, secondary, and university across 12 subjects.",intro:"Create quizzes by subject and topic, choose level and difficulty, and generate a ready-to-take assessment."}];
