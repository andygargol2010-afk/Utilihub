import fs from "node:fs/promises";

const files = ["src/lib/general/education-bank-a.ts", "src/lib/general/education-bank-b.ts"];
const levels = new Set(["primaria", "secundaria", "universidad"]);
const difficulties = new Set(["facil", "media", "dificil"]);

function normalize(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

for (const file of files) {
  const source = await fs.readFile(file, "utf8");
  const topicBlocks = source.split(/\n (?=(?:\"[^\"]+\"|[A-Za-z0-9_-]+):\[)/).slice(1);
  if (!topicBlocks.length) throw new Error(`${file}: no se encontraron temas`);
  let total = 0;
  for (const block of topicBlocks) {
    const questions = [...block.matchAll(/q\((\"(?:\\.|[^\"\\])*\"),\[([^\]]+)\],(\"(?:\\.|[^\"\\])*\"),\[(\"(?:\\.|[^\"\\])*\")\],(\"(?:\\.|[^\"\\])*\")\)/g)];
    if (questions.length !== 20) throw new Error(`${file}: un banco no contiene exactamente 20 preguntas (encontradas ${questions.length})`);
    const seen = new Set();
    for (const match of questions) {
      const text = JSON.parse(match[1]);
      const answer = JSON.parse(match[3]);
      const level = JSON.parse(match[4]);
      const difficulty = JSON.parse(match[5]);
      const key = normalize(text);
      if (seen.has(key)) throw new Error(`${file}: pregunta duplicada: ${text}`);
      seen.add(key);
      if (!levels.has(level)) throw new Error(`${file}: nivel inválido: ${level}`);
      if (!difficulties.has(difficulty)) throw new Error(`${file}: dificultad inválida: ${difficulty}`);
      const options = match[2].split(/\s*,\s*/).map(value => JSON.parse(value));
      if (options.length !== 4 || new Set(options.map(normalize)).size !== 4) throw new Error(`${file}: opciones inválidas en ${text}`);
      if (!options.map(normalize).includes(normalize(answer))) throw new Error(`${file}: respuesta ausente en opciones: ${text}`);
    }
    total += questions.length;
  }
  console.log(`${file}: ${total} preguntas verificadas.`);
}

console.log("Education bank validator OK.");
