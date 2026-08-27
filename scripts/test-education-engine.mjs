import fs from "node:fs/promises";

const files = ["src/lib/general/education-bank-a.ts", "src/lib/general/education-bank-b.ts"];
const levels = new Set(["primaria", "secundaria", "universidad"]);
const difficulties = new Set(["facil", "media", "dificil"]);
const MAX = 20;

function normalize(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function parseString(value) {
  return JSON.parse(value);
}

for (const file of files) {
  const source = await fs.readFile(file, "utf8");
  const topicRe = /(?:^|,\s*)([A-Za-z0-9_-]+|"[^"]+"):\[([\s\S]*?)\n \],/g;
  let topicCount = 0;
  let topicMatch;

  while ((topicMatch = topicRe.exec(source))) {
    topicCount++;
    const topic = topicMatch[1].replace(/^"|"$/g, "");
    const body = topicMatch[2];
    const questions = [...body.matchAll(/q\(("(?:\\.|[^"\\])*")\s*,\s*\[((?:"(?:\\.|[^"\\])*"\s*,?\s*)+)\]\s*,\s*("(?:\\.|[^"\\])*")\s*,\s*\[("(?:\\.|[^"\\])*")\]\s*,\s*("(?:\\.|[^"\\])*")\)/g)];

    if (questions.length !== MAX) {
      throw new Error(`${file}:${topic}: expected ${MAX} questions, found ${questions.length}`);
    }

    const seen = new Set();
    const levelCounts = new Map([...levels].map((value) => [value, 0]));
    const difficultyCounts = new Map([...difficulties].map((value) => [value, 0]));

    for (const match of questions) {
      const text = parseString(match[1]);
      const options = [...match[2].matchAll(/"(?:\\.|[^"\\])*"/g)].map((m) => parseString(m[0]));
      const answer = parseString(match[3]);
      const level = parseString(match[4]);
      const difficulty = parseString(match[5]);
      const key = normalize(text);

      if (seen.has(key)) throw new Error(`${file}:${topic}: duplicate question: ${text}`);
      seen.add(key);
      if (options.length !== 4 || new Set(options.map(normalize)).size !== 4) throw new Error(`${file}:${topic}: invalid options`);
      if (!options.map(normalize).includes(normalize(answer))) throw new Error(`${file}:${topic}: answer is not an option`);
      if (!levels.has(level)) throw new Error(`${file}:${topic}: invalid level ${level}`);
      if (!difficulties.has(difficulty)) throw new Error(`${file}:${topic}: invalid difficulty ${difficulty}`);
      levelCounts.set(level, levelCounts.get(level) + 1);
      difficultyCounts.set(difficulty, difficultyCounts.get(difficulty) + 1);
    }

    for (const [level, count] of levelCounts) {
      if (count < 4) throw new Error(`${file}:${topic}: level ${level} has only ${count} questions; configuration would not be meaningfully varied`);
    }
    for (const [difficulty, count] of difficultyCounts) {
      if (count < 4) throw new Error(`${file}:${topic}: difficulty ${difficulty} has only ${count} questions; configuration would not be meaningfully varied`);
    }
  }

  if (!topicCount) throw new Error(`${file}: no topics found`);
  console.log(`${file}: ${topicCount} topics satisfy the 20-question configurable-selection contract.`);
}

console.log("Education engine contract OK: 20 unique questions, balanced levels/difficulties, and valid options.");
