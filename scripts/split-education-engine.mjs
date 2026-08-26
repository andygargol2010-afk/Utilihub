import fs from "node:fs";

const enginePath = "src/lib/general/education-engine.ts";
const bankAPath = "src/lib/general/education-bank-a.ts";
const bankBPath = "src/lib/general/education-bank-b.ts";

const source = fs.readFileSync(enginePath, "utf8");
if (!source.includes("const BANK:Record<string,Q[]>= {")) {
  console.log("Education engine already split; nothing to do.");
  process.exit(0);
}

const bankStart = source.indexOf("const BANK:Record<string,Q[]>= {");
const openBrace = source.indexOf("{", bankStart);
let depth = 0;
let closeBrace = -1;
for (let i = openBrace; i < source.length; i++) {
  const ch = source[i];
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) {
      closeBrace = i;
      break;
    }
  }
}
if (closeBrace < 0) throw new Error("No se pudo localizar el cierre del BANK.");

const bankBody = source.slice(openBrace + 1, closeBrace);
const entries = [];
let current = "";
depth = 0;
for (const ch of bankBody) {
  if (ch === "[" || ch === "{" || ch === "(") depth++;
  if (ch === "]" || ch === "}" || ch === ")") depth--;
  if (ch === "," && depth === 0) {
    if (current.trim()) entries.push(current.trim());
    current = "";
  } else {
    current += ch;
  }
}
if (current.trim()) entries.push(current.trim());
if (entries.length < 4) throw new Error(`Banco inesperadamente pequeño: ${entries.length} entradas.`);

const midpoint = Math.ceil(entries.length / 2);
const renderBank = (name, items) => `import type { EducationDifficulty, EducationLevel } from "./education-engine";\n\ntype Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};\nconst q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});\n\nexport const ${name}:Record<string,Q[]>={\n${items.map((entry) => ` ${entry},`).join("\n")}\n};\n`;

fs.writeFileSync(bankAPath, renderBank("EDUCATION_BANK_A", entries.slice(0, midpoint)));
fs.writeFileSync(bankBPath, renderBank("EDUCATION_BANK_B", entries.slice(midpoint)));

const typesStart = source.indexOf('type Q={');
const shuffleStart = source.indexOf('function shuffle<T,>(items:T[])');
if (typesStart < 0 || shuffleStart < 0 || shuffleStart < closeBrace) throw new Error("No se pudieron localizar las secciones del motor.");
const tail = source.slice(shuffleStart);
const engine = `export type EducationLevel="primaria"|"secundaria"|"universidad";\nexport type EducationDifficulty="facil"|"media"|"dificil";\nexport type GeneratedQuestion={text:string;options:string[];answer:number};\n\nimport { EDUCATION_BANK_A } from "./education-bank-a";\nimport { EDUCATION_BANK_B } from "./education-bank-b";\n\ntype Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};\nconst BANK:Record<string,Q[]>={...EDUCATION_BANK_A,...EDUCATION_BANK_B};\n\n${tail}`;
fs.writeFileSync(enginePath, engine);
console.log(`Education engine split: ${entries.length} topics -> ${midpoint}/${entries.length-midpoint}.`);
