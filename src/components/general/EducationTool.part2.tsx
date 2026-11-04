// Part 2 of 3 — split from EducationTool.tsx on 2026-11-04. Edit here; EducationTool.tsx re-exports.
import { EDUCATION_SUBJECTS, educationTopicTitle } from "@/lib/general/education";
import { type EducationDifficulty } from "@/lib/general/education-engine";

export const DIFFICULTIES: Array<[EducationDifficulty, string]> = [
  ["facil", "Easy"],
  ["media", "Medium"],
  ["dificil", "Hard"],
];
export const ES_LEVELS: Record<string, string> = { Primary: "Primaria", Secondary: "Secundaria", University: "Universidad" };
export const ES_DIFFICULTIES: Record<string, string> = { Easy: "Fácil", Medium: "Media", Hard: "Difícil" };

/** Map tool config topic → question-bank key (subject-aware for collisions like energia). */
export function resolveBankTopic(subjectSlug: string, topicSlug: string): string {
  if (subjectSlug === "fisica" && topicSlug === "energia") return "energia-fisica";
  if (subjectSlug === "ciencias-naturales" && topicSlug === "energia") return "energia-naturales";
  return topicSlug;
}

export function subjectDisplayName(subjectSlug: string, locale: "en" | "es"): string {
  const row = EDUCATION_SUBJECTS.find(([slug]) => slug === subjectSlug);
  if (!row) return educationTopicTitle(subjectSlug);
  if (locale === "es") {
    const esNames: Record<string, string> = {
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
    return esNames[subjectSlug] ?? educationTopicTitle(subjectSlug);
  }
  return row[1];
}
