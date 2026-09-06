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
const documentationPath = path.join(root, "src", "components", "ToolDocumentation.tsx");
const dailyQuota = 12;
const specs = [
  ["calculadora-propina-compartida", "Calculadora de propina compartida", "Calcula propina, total y reparto equitativo de una cuenta entre varias personas.", ["propina", "cuenta", "repartir", "restaurante"], "productividad"],
  ["generador-nombres-archivos", "Generador de nombres de archivos", "Normaliza títulos y crea nombres de archivos consistentes para proyectos digitales.", ["nombres", "archivos", "slug", "organizacion"], "productividad"],
  ["contador-tiempo-lectura", "Contador de tiempo de lectura", "Estima los minutos necesarios para leer un texto según la velocidad seleccionada.", ["lectura", "tiempo", "palabras", "estimador"], "productividad"],
  ["formateador-lista-comas", "Formateador de listas", "Convierte listas separadas por saltos de línea en una secuencia limpia y reutilizable.", ["lista", "formato", "texto", "productividad"], "productividad"],
  ["calculadora-descanso", "Calculadora de descanso", "Calcula una hora recomendada de descanso a partir de la hora de inicio y duración.", ["descanso", "horario", "tiempo", "bienestar"], "productividad"],
  ["generador-meta-description", "Generador de meta description", "Prepara una meta description concisa a partir de un texto para mejorar su presentación SEO.", ["seo", "meta", "description", "marketing"], "desarrollo"],
  ["contador-caracteres-seo", "Contador de caracteres SEO", "Comprueba la longitud de títulos y descripciones para resultados de búsqueda.", ["seo", "caracteres", "titulo", "descripcion"], "desarrollo"],
  ["limpiador-json-texto", "Limpiador de JSON", "Limpia y normaliza texto JSON para facilitar su revisión y reutilización.", ["json", "texto", "desarrollo", "formato"], "desarrollo"],
  ["generador-utms", "Generador de enlaces UTM", "Construye enlaces UTM consistentes para medir campañas y contenidos digitales.", ["utm", "marketing", "enlaces", "analitica"], "desarrollo"],
  ["calculadora-iva-inversa", "Calculadora de IVA inversa", "Obtiene el precio base y el impuesto desde un total que ya incluye IVA.", ["iva", "impuestos", "precio", "finanzas"], "finanzas"],
  ["convertidor-minutos-decimales", "Convertidor de minutos decimales", "Convierte horas y minutos a horas decimales para registros y presupuestos.", ["minutos", "horas", "decimal", "conversion"], "conversiones"],
  ["calculadora-punto-equilibrio", "Calculadora de punto de equilibrio", "Estima las unidades necesarias para cubrir costes fijos y variables.", ["punto equilibrio", "costes", "ventas", "negocio"], "finanzas"],
].map(([slug, name, summary, keywords, category]) => ({ slug, name, summary, keywords, category }));
const visualImprovements = [
  { id: "seo-invisible-accordion", description: "Añade un acordeón SEO Invisible con intención de búsqueda y palabras clave del catálogo.", apply: (source) => source.includes("data-seo-invisible") ? source : source.replace("    </div>\n  </details>;", '      <details data-seo-invisible className="rounded-lg border border-border/60 px-3 py-2"><summary className="cursor-pointer text-xs font-semibold text-muted-foreground">SEO Invisible</summary><p className="mt-2 text-xs leading-5 text-muted-foreground">Contenido semántico ampliado para ayudar a los buscadores a interpretar esta utilidad.</p></details>\n    </div>\n  </details>;') },
  { id: "documentation-accessibility", description: "Mejora la accesibilidad del acordeón documental con una etiqueta explícita.", apply: (source) => source.replace('<details className="mt-10 border-t border-border/70 pt-3">', '<details aria-label="Documentación y preguntas frecuentes" className="mt-10 border-t border-border/70 pt-3">') },
];
const read = async (file, fallback = "") => { try { return await fs.readFile(file, "utf8"); } catch { return fallback; } };
const readJson = async (file, fallback) => { try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return fallback; } };
const writeJson = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 }); };
const today = new Date().toISOString().slice(0, 10);
await fs.mkdir(path.dirname(generatedPath), { recursive: true });
await fs.mkdir(reportRoot, { recursive: true });
let state = await readJson(path.join(stateRoot, "innovator-daily.json"), { date: today, cycles: 0, tools_created: 0, improvements_created: 0 });
if (state.date !== today) state = { date: today, cycles: 0, tools_created: 0, improvements_created: 0 };
const source = await read(generatedPath, 'import { makeTool } from "./types";\n\nexport const INNOVATOR_TOOLS = [\n];\n');
const used = new Set([...source.matchAll(/makeTool\(["']([^"']+)["']/g)].map((match) => match[1]));
const registry = await read(registryPath);
const contextFingerprint = crypto.createHash("sha256").update(registry).digest("hex").slice(0, 16);
const cycleId = `innovator-${Date.now()}`;
const mode = state.cycles % 2 === 0 ? "new_tool" : "visual_micro_improvement";
const report = { schema_version: 2, cycle_id: cycleId, worker: "innovator", status: "completed", mode, timestamp: new Date().toISOString(), context: { source: "src/components/general/registry.tsx", latest_successful_tools: 5, fingerprint: contextFingerprint }, quota: { daily_limit: dailyQuota, tools_created_today: state.tools_created }, validations: { catalog: "pending", build: "pending", playwright: "not_available", vision: "not_available" }, files_changed: [], risks: [], errors: [], next_action: "Validate the change and create an isolated worker PR." };
let proposal = null;
if (mode === "new_tool" && state.tools_created < dailyQuota) {
  const candidate = specs.find((spec) => !used.has(spec.slug));
  if (candidate) {
    let nextSource = source;
    const line = `  makeTool(${JSON.stringify(candidate.slug)}, ${JSON.stringify(candidate.name)}, ${JSON.stringify(candidate.category)}, "text", ${JSON.stringify(candidate.summary)}, ${JSON.stringify(candidate.keywords)}),\n`;
    nextSource = nextSource.replace(/(export const INNOVATOR_TOOLS = \[\n)/, `$1${line}`);
    await fs.writeFile(generatedPath, nextSource);
    let index = await read(generalIndexPath);
    if (!index.includes('import { INNOVATOR_TOOLS } from "./innovator-tools";')) index = `import { INNOVATOR_TOOLS } from "./innovator-tools";\n${index}`;
    if (!index.includes("...INNOVATOR_TOOLS")) index = index.replace("export const GENERAL_TOOLS = [", "export const GENERAL_TOOLS = [\n  ...INNOVATOR_TOOLS,");
    await fs.writeFile(generalIndexPath, index);
    state.tools_created += 1;
    report.tool_name = candidate.name; report.slug = candidate.slug; report.keywords = candidate.keywords;
    report.files_changed = ["src/lib/general/innovator-tools.ts", "src/lib/general/index.ts"];
    proposal = { title: `add ${candidate.name}`, rationale: "Deterministic local tool generated from the Innovator backlog and existing UI contract." };
  }
} else if (mode === "visual_micro_improvement") {
  let documentation = await read(documentationPath);
  const improvement = visualImprovements.find((item) => !documentation.includes(item.id === "seo-invisible-accordion" ? "data-seo-invisible" : "aria-label=\"Documentación y preguntas frecuentes\""));
  if (improvement) {
    const updated = improvement.apply(documentation);
    if (updated !== documentation) {
      await fs.writeFile(documentationPath, updated);
      report.improvement = improvement.id; report.files_changed = ["src/components/ToolDocumentation.tsx"];
      proposal = { title: `apply ${improvement.id}`, rationale: improvement.description };
      state.improvements_created += 1;
    }
  }
}
state.cycles += 1;
report.quota = { daily_limit: dailyQuota, tools_created_today: state.tools_created, improvements_created_today: state.improvements_created, cycle_number: state.cycles };
report.status = report.files_changed.length ? "completed" : "backlog_exhausted";
report.next_action = report.files_changed.length ? "Validate catalog and build; create worker PR and await green Preview checks." : "No pending change in this alternating mode; preserve repository and continue next cycle.";
await writeJson(path.join(stateRoot, "innovator-daily.json"), { ...state, date: today, updated_at: new Date().toISOString() });
await writeJson(path.join(reportRoot, `${cycleId}-innovator.json`), report);
await writeJson(path.join(reportRoot, "improvement-proposals.json"), { generated_at: new Date().toISOString(), guardrails: { fingerprint: cycleId, source: "innovator-cycle", risk: "low" }, proposals: proposal ? [{ ...proposal, risk: "low", occurrences: 1, proposed_tests: ["npm run validate:catalog", "npm run lint", "npm run build"] }] : [] });
console.log(JSON.stringify(report, null, 2));
