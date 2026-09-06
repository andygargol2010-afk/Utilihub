#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const stateRoot = path.join(root, ".agent", "state");
const reportRoot = path.join(root, ".agent", "reports");
const generatedPath = path.join(root, "src", "lib", "general", "innovator-tools.ts");
const generalIndexPath = path.join(root, "src", "lib", "general", "index.ts");
const registryPath = path.join(root, "src", "components", "general", "registry.tsx");
const dailyQuota = 12;

const specs = [
  { slug: "calculadora-propina-compartida", name: "Calculadora de propina compartida", summary: "Calcula propina, total y reparto equitativo de una cuenta entre varias personas.", keywords: ["propina", "cuenta", "repartir", "restaurante"], category: "productividad" },
  { slug: "generador-nombres-archivos", name: "Generador de nombres de archivos", summary: "Normaliza títulos y crea nombres de archivos consistentes para proyectos digitales.", keywords: ["nombres", "archivos", "slug", "organizacion"], category: "productividad" },
  { slug: "contador-tiempo-lectura", name: "Contador de tiempo de lectura", summary: "Estima los minutos necesarios para leer un texto según la velocidad seleccionada.", keywords: ["lectura", "tiempo", "palabras", "estimador"], category: "productividad" },
  { slug: "formateador-lista-comas", name: "Formateador de listas", summary: "Convierte listas separadas por saltos de línea en una secuencia limpia y reutilizable.", keywords: ["lista", "formato", "texto", "productividad"], category: "productividad" },
  { slug: "calculadora-descanso", name: "Calculadora de descanso", summary: "Calcula una hora recomendada de descanso a partir de la hora de inicio y duración.", keywords: ["descanso", "horario", "tiempo", "bienestar"], category: "productividad" },
  { slug: "generador-meta-description", name: "Generador de meta description", summary: "Prepara una meta description concisa a partir de un texto para mejorar su presentación SEO.", keywords: ["seo", "meta", "description", "marketing"], category: "desarrollo" },
  { slug: "contador-caracteres-seo", name: "Contador de caracteres SEO", summary: "Comprueba la longitud de títulos y descripciones para resultados de búsqueda.", keywords: ["seo", "caracteres", "titulo", "descripcion"], category: "desarrollo" },
  { slug: "limpiador-json-texto", name: "Limpiador de JSON", summary: "Limpia y normaliza texto JSON para facilitar su revisión y reutilización.", keywords: ["json", "texto", "desarrollo", "formato"], category: "desarrollo" },
  { slug: "generador-utms", name: "Generador de enlaces UTM", summary: "Construye enlaces UTM consistentes para medir campañas y contenidos digitales.", keywords: ["utm", "marketing", "enlaces", "analitica"], category: "desarrollo" },
  { slug: "calculadora-iva-inversa", name: "Calculadora de IVA inversa", summary: "Obtiene el precio base y el impuesto desde un total que ya incluye IVA.", keywords: ["iva", "impuestos", "precio", "finanzas"], category: "finanzas" },
  { slug: "convertidor-minutos-decimales", name: "Convertidor de minutos decimales", summary: "Convierte horas y minutos a horas decimales para registros y presupuestos.", keywords: ["minutos", "horas", "decimal", "conversion"], category: "conversiones" },
  { slug: "calculadora-punto-equilibrio", name: "Calculadora de punto de equilibrio", summary: "Estima las unidades necesarias para cubrir costes fijos y variables.", keywords: ["punto equilibrio", "costes", "ventas", "negocio"], category: "finanzas" },
];

const read = async (file, fallback = "") => { try { return await fs.readFile(file, "utf8"); } catch { return fallback; } };
const readJson = async (file, fallback) => { try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return fallback; } };
const writeJson = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 }); };
const today = new Date().toISOString().slice(0, 10);

await fs.mkdir(path.dirname(generatedPath), { recursive: true });
await fs.mkdir(reportRoot, { recursive: true });
let source = await read(generatedPath, 'import { makeTool } from "./types";\n\nexport const INNOVATOR_TOOLS = [\n];\n');
const used = new Set([...source.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]));
let daily = await readJson(path.join(stateRoot, "innovator-daily.json"), { date: today, tools_created: 0 });
if (daily.date !== today) daily = { date: today, tools_created: 0 };
const registry = await read(registryPath);
const contextFingerprint = crypto.createHash("sha256").update(registry).digest("hex").slice(0, 16);
const cycleId = `innovator-${Date.now()}`;
const candidate = specs.find((spec) => !used.has(spec.slug));
const report = {
  schema_version: 2, cycle_id: cycleId, worker: "innovator", status: "completed", mode: "new_tool",
  timestamp: new Date().toISOString(), tool_name: candidate?.name ?? null, slug: candidate?.slug ?? null,
  keywords: candidate?.keywords ?? [], topic: candidate?.summary ?? null, new_questions: 0,
  context: { source: "src/components/general/registry.tsx", latest_successful_tools: 5, fingerprint: contextFingerprint },
  quota: { daily_limit: dailyQuota, created_today_before_cycle: daily.tools_created, created_today_after_cycle: daily.tools_created + (candidate ? 1 : 0) },
  external_credentials_required: false, validations: { catalog: "pending", build: "pending", playwright: "not_available", vision: "not_available" },
  files_changed: [], risks: [], errors: [], next_action: "Validate catalog and build; create an agent/worker PR for the generated tool."
};

if (!candidate || daily.tools_created >= dailyQuota) {
  report.status = "quota_or_backlog_exhausted";
  report.mode = "visual_micro_improvement_pending";
  report.next_action = "No new tool is available in this daily quota; schedule a visual micro-improvement cycle.";
} else {
  const line = `  makeTool(${JSON.stringify(candidate.slug)}, ${JSON.stringify(candidate.name)}, ${JSON.stringify(candidate.category)}, "text", ${JSON.stringify(candidate.summary)}, ${JSON.stringify(candidate.keywords)}),\n`;
  source = source.replace(/(export const INNOVATOR_TOOLS = \[\n)/, `$1${line}`);
  await fs.writeFile(generatedPath, source);
  let index = await read(generalIndexPath);
  if (!index.includes('import { INNOVATOR_TOOLS } from "./innovator-tools";')) {
    index = `import { INNOVATOR_TOOLS } from "./innovator-tools";\n${index}`;
  }
  if (!index.includes("...INNOVATOR_TOOLS")) index = index.replace("export const GENERAL_TOOLS = [", "export const GENERAL_TOOLS = [\n  ...INNOVATOR_TOOLS,");
  await fs.writeFile(generalIndexPath, index);
  daily.tools_created += 1;
  report.files_changed = ["src/lib/general/innovator-tools.ts", "src/lib/general/index.ts"];
  report.validations.catalog = "pending";
}
await writeJson(path.join(stateRoot, "innovator-daily.json"), { ...daily, date: today, updated_at: new Date().toISOString() });
await writeJson(path.join(reportRoot, `${cycleId}-innovator.json`), report);
await writeJson(path.join(reportRoot, "improvement-proposals.json"), {
  generated_at: new Date().toISOString(), guardrails: { fingerprint: cycleId, source: "innovator-cycle", risk: "low" },
  proposals: candidate && daily.tools_created <= dailyQuota ? [{ title: `add ${candidate.name}`, risk: "low", occurrences: 1, rationale: "Deterministic local tool generated from the Innovator backlog with existing UI contracts.", proposed_tests: ["npm run validate:catalog", "npm run build"] }] : []
});
console.log(JSON.stringify(report, null, 2));
