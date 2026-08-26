import fs from "node:fs/promises";

const MODEL_URL = "https://models.github.ai/inference/chat/completions";
const MODEL = "openai/gpt-4.1";
const ROOT = "src/lib/general";
const files = ["education-bank-a.ts", "education-bank-b.ts"];
const levels = ["primaria", "secundaria", "universidad"];
const difficulties = ["facil", "media", "dificil"];

function extractTopics(source) {
  const match = source.match(/export const EDUCATION_BANK_[AB]:Record<string,Q\[]>={(.*)\n};/s);
  if (!match) throw new Error("No se pudo localizar el catálogo del banco");
  const topics = [];
  const re = /(?:^|,\s*)([A-Za-z0-9_-]+|"[^"]+"):\[/g;
  let m;
  while ((m = re.exec(match[1]))) topics.push(m[1].replace(/^"|"$/g, ""));
  return [...new Set(topics)];
}

function normalize(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

async function callModel(topic, existing) {
  const prompt = {
    model: MODEL,
    temperature: 0.45,
    max_tokens: 12000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Eres un editor pedagógico. Genera preguntas de opción múltiple factualmente correctas, independientes entre sí y adecuadas al tema. No reformules la misma pregunta. No uses plantillas cosméticas ni cambies solo números. Cada pregunta debe evaluar un concepto, hecho, procedimiento o aplicación diferente. Devuelve SOLO JSON válido."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Crear exactamente 20 preguntas nuevas para este tema.",
          topic,
          distribution: "Asigna niveles entre primaria, secundaria y universidad y dificultades entre facil, media y dificil de forma equilibrada. Cada pregunta debe tener exactamente un nivel y una dificultad.",
          schema: {
            questions: [{
              text: "pregunta en español",
              options: ["opción A", "opción B", "opción C", "opción D"],
              answer: "una de las cuatro opciones exactamente",
              levels: ["primaria"],
              difficulty: "facil"
            }]
          },
          forbidden: existing
        })
      }
    ]
  };

  const response = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json"
    },
    body: JSON.stringify(prompt)
  });
  if (!response.ok) throw new Error(`GitHub Models ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Respuesta vacía para ${topic}`);
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed.questions)) throw new Error(`Respuesta sin questions para ${topic}`);
  return parsed.questions;
}

function validateQuestions(topic, questions) {
  if (questions.length !== 20) throw new Error(`${topic}: se esperaban 20 preguntas y llegaron ${questions.length}`);
  const seen = new Set();
  for (const [index, q] of questions.entries()) {
    if (!q || typeof q.text !== "string" || !q.text.trim()) throw new Error(`${topic} #${index + 1}: texto inválido`);
    const key = normalize(q.text);
    if (seen.has(key)) throw new Error(`${topic}: pregunta duplicada #${index + 1}`);
    seen.add(key);
    if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error(`${topic} #${index + 1}: deben existir 4 opciones`);
    const opts = q.options.map(normalize);
    if (new Set(opts).size !== 4) throw new Error(`${topic} #${index + 1}: opciones duplicadas`);
    if (typeof q.answer !== "string" || !opts.includes(normalize(q.answer))) throw new Error(`${topic} #${index + 1}: respuesta no pertenece a las opciones`);
    if (!Array.isArray(q.levels) || q.levels.length !== 1 || !levels.includes(q.levels[0])) throw new Error(`${topic} #${index + 1}: nivel inválido`);
    if (!difficulties.includes(q.difficulty)) throw new Error(`${topic} #${index + 1}: dificultad inválida`);
  }
}

function escapeTs(s) {
  return JSON.stringify(s);
}

function render(bankName, topics, all) {
  const lines = [
    'import type { EducationDifficulty, EducationLevel } from "./education-engine";',
    '',
    'type Q={text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};',
    'const q=(text:string,options:string[],answer:string,levels:EducationLevel[],difficulty:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});',
    '',
    `export const EDUCATION_BANK_${bankName}:Record<string,Q[]>={`
  ];
  for (const topic of topics) {
    lines.push(` ${JSON.stringify(topic)}:[`);
    for (const item of all[topic]) {
      lines.push(`  q(${escapeTs(item.text)},[${item.options.map(escapeTs).join(",")}],${escapeTs(item.answer)},[${escapeTs(item.levels[0])}],${escapeTs(item.difficulty)}),`);
    }
    lines.push(" ],");
  }
  lines.push("};", "");
  return lines.join("\n");
}

const generated = {};
for (const file of files) {
  const source = await fs.readFile(`${ROOT}/${file}`, "utf8");
  const topics = extractTopics(source);
  const bank = {};
  for (const topic of topics) {
    const existing = source.slice(0, 12000);
    let questions = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        questions = await callModel(topic, existing);
        validateQuestions(topic, questions);
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
    bank[topic] = questions;
    console.log(`${file}: ${topic}: 20 preguntas verificadas`);
  }
  generated[file] = bank;
}

await fs.writeFile(`${ROOT}/education-bank-a.ts`, render("A", Object.keys(generated["education-bank-a.ts"]), generated["education-bank-a.ts"]), "utf8");
await fs.writeFile(`${ROOT}/education-bank-b.ts`, render("B", Object.keys(generated["education-bank-b.ts"]), generated["education-bank-b.ts"]), "utf8");
console.log("Todos los bancos fueron generados con 20 preguntas independientes por tema.");
