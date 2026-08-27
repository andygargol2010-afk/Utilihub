import fs from "node:fs/promises";
import { build } from "esbuild";

const entry = "src/lib/general/education-engine.ts";
const outfile = ".education-engine.test.mjs";

await build({ entryPoints: [entry], bundle: true, platform: "node", format: "esm", outfile, logLevel: "silent" });

try {
  const engine = await import(`../${outfile}?t=${Date.now()}`);
  const generate = engine.generateEducationTest;
  if (typeof generate !== "function") throw new Error("generateEducationTest no está exportada");

  const topic = "aritmetica";
  const level = "secundaria";
  const tests = [[5, "facil"], [10, "media"], [20, "dificil"]];
  const results = tests.map(([count, difficulty]) => generate(topic, level, difficulty, count));

  for (const [index, [count]] of tests.entries()) {
    const result = results[index];
    if (result.length !== count) throw new Error(`${topic}: se solicitaron ${count} preguntas y se obtuvieron ${result.length}`);
    const unique = new Set(result.map((q) => q.text.trim().toLowerCase()));
    if (unique.size !== result.length) throw new Error(`${topic}: el test contiene preguntas repetidas`);
    for (const question of result) {
      if (question.options.length !== 4 || question.answer < 0 || question.answer > 3) throw new Error(`${topic}: pregunta con opciones/respuesta inválidas`);
    }
  }

  const easy = new Set(results[0].map((q) => q.text));
  const medium = new Set(results[1].map((q) => q.text));
  if (results[0].length === results[1].length && [...easy].every((text) => medium.has(text)) && results[0].length < 20) {
    throw new Error(`${topic}: cambiar la dificultad no modifica la selección cuando debería hacerlo`);
  }

  console.log("Education runtime OK: 5/10/20 preguntas, sin duplicados y filtros de dificultad operativos.");
} finally {
  await fs.rm(outfile, { force: true });
}
