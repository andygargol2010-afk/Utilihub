#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const reportsDir = path.join(root, ".agent", "reports");
const output = path.join(reportsDir, "improvement-proposals.json");
const now = new Date().toISOString();

async function readReports() {
  let entries = [];
  try { entries = await fs.readdir(reportsDir, { withFileTypes: true }); } catch { return []; }
  const reports = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json") || entry.name === path.basename(output)) continue;
    try {
      const value = JSON.parse(await fs.readFile(path.join(reportsDir, entry.name), "utf8"));
      if (value && typeof value === "object") reports.push(value);
    } catch { /* Ignore corrupt historical reports; record them as unavailable below. */ }
  }
  return reports;
}
function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}
function evidence(report) {
  return [
    ...(Array.isArray(report.errors) ? report.errors : []),
    report.blocked_reason,
  ].filter(Boolean).map(normalize);
}
function suggestion(key, occurrences, reports) {
  const common = { occurrences, source_cycle_ids: reports.map((r) => r.cycle_id).filter(Boolean), status: "awaiting_human_review", automatic_code_change: false };
  if (key.includes("nivel inválido") || key.includes("nivel invalido")) return { ...common, title: "Centralizar validación de niveles educativos", rationale: "El validador repite incompatibilidades de niveles; un contrato compartido evitaría divergencias.", likely_files: ["scripts/validate-education-banks.mjs", "src/lib/education"], proposed_tests: ["validar niveles permitidos por esquema", "rechazar bancos con niveles ausentes o múltiples"] };
  if (key.includes("npm ci") || key.includes("lock file") || key.includes("desincroniz")) return { ...common, risk: "low", title: "Detectar sincronización package-lock antes de CI", rationale: "La instalación limpia falla antes de las validaciones cuando el lockfile queda desactualizado.", likely_files: ["package.json", "package-lock.json", ".github/workflows"], proposed_tests: ["npm ci sobre checkout limpio", "comparar package.json y lockfile en CI"] };
  if (key.includes("eslint") || key.includes("lint")) return { ...common, risk: "low", title: "Consolidar configuración lint", rationale: "Los fallos de lint deben señalar configuración o código sin desactivar reglas.", likely_files: ["eslint.config.js", "scripts"], proposed_tests: ["npm run lint", "verificar que no existan supresiones globales"] };
  return { ...common, risk: "medium", title: `Investigar patrón recurrente: ${key.slice(0, 100)}`, rationale: "El mismo síntoma aparece en reportes históricos y merece una refactorización pequeña y demostrable.", likely_files: [], proposed_tests: ["reproducir el fallo", "validar lint, tests y build"] };
}
const reports = await readReports();
const occurrences = new Map();
for (const report of reports) for (const item of evidence(report)) occurrences.set(item, (occurrences.get(item) ?? 0) + 1);
const proposals = [...occurrences.entries()]
  .filter(([, count]) => count >= 1)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 20)
  .map(([key, count]) => suggestion(key, count, reports.filter((r) => evidence(r).includes(key))));
const payload = {
  schema_version: 1,
  generated_at: now,
  repository: "andygargol2010-afk/Utilihub",
  source: "local .agent/reports JSON",
  historical_reports: reports.length,
  proposals,
  guardrails: {
    deterministic: true,
    automatic_code_change: false,
    requires_human_review: true,
    max_proposals: 20,
    no_secrets_loaded: true,
    fingerprint: createHash("sha256").update(JSON.stringify(proposals)).digest("hex").slice(0, 16),
  },
};
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
console.log(JSON.stringify({ output: path.relative(root, output), historical_reports: reports.length, proposals: proposals.length, status: "awaiting_human_review" }, null, 2));
