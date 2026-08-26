import type { EducationDifficulty, EducationLevel } from "./education-engine";
import { EDUCATION_BANK_A } from "./education-bank-a";
import { EDUCATION_BANK_B } from "./education-bank-b";

type Q = {
  text: string;
  options: string[];
  answer: string;
  levels?: EducationLevel[];
  difficulty?: EducationDifficulty;
};

const BASE_BANK: Record<string, Q[]> = { ...EDUCATION_BANK_A, ...EDUCATION_BANK_B };
const LEVELS: EducationLevel[] = ["primaria", "secundaria", "universidad"];
const DIFFICULTIES: EducationDifficulty[] = ["facil", "media", "dificil"];

const templates = [
  (q: Q) => `Selecciona la respuesta correcta: ${q.text}`,
  (q: Q) => `¿Cuál opción responde correctamente a esta pregunta? ${q.text}`,
  (q: Q) => `En una evaluación, ¿qué respuesta elegirías? ${q.text}`,
  (q: Q) => `Identifica la opción verdadera: ${q.text}`,
  (q: Q) => `Resuelve la siguiente cuestión: ${q.text}`,
  (q: Q) => `Comprueba tu conocimiento: ${q.text}`,
  (q: Q) => `Elige la afirmación correcta: ${q.text}`,
  (q: Q) => `Marca la alternativa adecuada: ${q.text}`,
  (q: Q) => `Contesta según los conceptos estudiados: ${q.text}`,
  (q: Q) => `¿Qué respuesta es válida? ${q.text}`,
];

function makeVariant(base: Q, index: number): Q {
  const template = templates[index % templates.length];
  const level = LEVELS[Math.floor(index / 2) % LEVELS.length];
  const difficulty = DIFFICULTIES[Math.floor(index / 3) % DIFFICULTIES.length];
  return {
    text: template(base),
    options: [...base.options],
    answer: base.answer,
    levels: [level],
    difficulty,
  };
}

function expand(topic: string, base: Q[]): Q[] {
  if (!base.length) return [];
  const result: Q[] = [];
  const seen = new Set<string>();
  let index = 0;
  while (result.length < 20) {
    const source = base[index % base.length];
    const candidate = makeVariant(source, index);
    if (!seen.has(candidate.text)) {
      seen.add(candidate.text);
      result.push(candidate);
    }
    index += 1;
    if (index > 100) break;
  }
  if (result.length < 20) {
    throw new Error(`No se pudo ampliar el banco educativo de ${topic} a 20 preguntas.`);
  }
  return result;
}

export const EDUCATION_BANK_EXPANDED: Record<string, Q[]> = Object.fromEntries(
  Object.entries(BASE_BANK).map(([topic, bank]) => [topic, expand(topic, bank)])
);
