import fs from "node:fs/promises";
import { build } from "esbuild";

const outfile = ".education-bank-validator.mjs";
await build({ entryPoints: ["src/lib/general/education-bank-expanded.ts"], bundle: true, platform: "node", format: "esm", outfile, logLevel: "silent" });

function normalize(value){return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim()}
try {
  const module = await import(`../${outfile}?t=${Date.now()}`);
  const banks = module.EDUCATION_BANK_EXPANDED;
  if (!banks || typeof banks !== "object") throw new Error("EDUCATION_BANK_EXPANDED no está disponible");
  const levels = new Set(["primaria","secundaria","universidad"]);
  const difficulties = new Set(["facil","media","dificil"]);
  const topics = Object.keys(banks);
  if (!topics.length) throw new Error("No se encontraron temas educativos");
  for (const [topic, questions] of Object.entries(banks)) {
    if (!Array.isArray(questions) || questions.length !== 20) throw new Error(`${topic}: se esperaban exactamente 20 preguntas y hay ${questions?.length ?? 0}`);
    const seen = new Set();
    for (const [index,q] of questions.entries()) {
      if (!q || typeof q.text !== "string" || !q.text.trim()) throw new Error(`${topic} #${index+1}: texto inválido`);
      const key=normalize(q.text);
      if(seen.has(key)) throw new Error(`${topic}: pregunta duplicada: ${q.text}`);
      seen.add(key);
      if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options.map(normalize)).size!==4) throw new Error(`${topic} #${index+1}: opciones inválidas`);
      if(!q.options.map(normalize).includes(normalize(q.answer))) throw new Error(`${topic} #${index+1}: respuesta ausente en opciones`);
      if(!Array.isArray(q.levels)||q.levels.length!==1||!levels.has(q.levels[0])) throw new Error(`${topic} #${index+1}: nivel inválido`);
      if(!difficulties.has(q.difficulty)) throw new Error(`${topic} #${index+1}: dificultad inválida`);
    }
  }
  console.log(`Education bank validator OK: ${topics.length} temas, ${topics.length*20} preguntas únicas.`);
} finally { await fs.rm(outfile,{force:true}); }
