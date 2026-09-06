#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const agentRoot = path.join(root, ".agent");
const stateRoot = path.join(agentRoot, "state");
const lockRoot = path.join(agentRoot, "locks");
const reportRoot = path.join(agentRoot, "reports");
const quarantineRoot = path.join(agentRoot, "quarantine");
const configPath = path.join(agentRoot, "config.json");
const lockPath = path.join(lockRoot, "repository.lock");
const workers = ["technical", "innovator", "retention", "curator"];
const now = () => new Date().toISOString();
const workerKey = (worker) => ({ technical: "a", innovator: "b", retention: "c", curator: "d" })[worker];

async function ensureRuntime() {
  await Promise.all([stateRoot, lockRoot, reportRoot, path.join(agentRoot, "logs"), quarantineRoot].map((p) => fsp.mkdir(p, { recursive: true })));
}
async function readJson(file, fallback) { try { return JSON.parse(await fsp.readFile(file, "utf8")); } catch { return fallback; } }
async function writeJson(file, value) { await fsp.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 }); }
function command(name, args = []) {
  const result = spawnSync(name, args, { cwd: root, encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
  return { ok: result.status === 0, output: (result.stdout || "").trim(), error: (result.stderr || "").trim(), status: result.status };
}
function git(...args) { return command("git", args); }
async function acquireLock(cycleId, worker) {
  const payload = { cycle_id: cycleId, worker, pid: process.pid, acquired_at: now(), expires_at: new Date(Date.now() + 30 * 60_000).toISOString() };
  try {
    const handle = await fsp.open(lockPath, "wx", 0o600);
    await handle.writeFile(`${JSON.stringify(payload, null, 2)}\n`); await handle.close(); return { acquired: true, payload };
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const existing = await readJson(lockPath, null);
    if (existing?.expires_at && Date.parse(existing.expires_at) < Date.now()) {
      try { await fsp.rename(lockPath, `${lockPath}.stale-${Date.now()}`); return acquireLock(cycleId, worker); } catch { /* another process won */ }
    }
    return { acquired: false, existing };
  }
}
async function releaseLock(cycleId) { const existing = await readJson(lockPath, null); if (existing?.cycle_id === cycleId && existing?.pid === process.pid) await fsp.rm(lockPath, { force: true }); }
function baseReport(cycleId, worker, status, nextAction) {
  return {
    schema_version: 2, cycle_id: cycleId, timestamp_start: now(), timestamp_end: now(), worker, status,
    repository: "andygargol2010-afk/Utilihub", base_branch: "main", work_branch: git("branch", "--show-current").output || null,
    commit: git("rev-parse", "HEAD").output || null, pull_request: null, preview_url: null,
    task_type: `${worker}_cycle`, tool_name: null, keywords: [], topic: null, new_questions: 0, retention_progress_percent: 0,
    files_inspected: [], files_changed: [], quarantined_files: [], attempts_by_file: {},
    validations: { lint: "not_run", catalog: "not_run", catalog_tests: "not_run", build: "not_run", playwright: "not_available", vision: "not_available", vercel: "not_checked" },
    risks: [], errors: [], blocked_reason: null, next_action: nextAction,
  };
}
async function runWorker(worker, cycleId) {
  const report = baseReport(cycleId, worker, "completed", "Review the report and create a PR only for approved real code changes.");
  report.files_inspected = [".agent/config.json", "package.json", ".github/workflows", "src/lib/all-tools.ts", "src/lib/education"];
  if (worker === "technical") {
    report.task_type = "technical_error_resolution";
    report.validations.lint = command("npm", ["run", "lint"]).ok ? "passed" : "failed";
    report.risks.push("Technical worker is audit-first; it does not mutate shared main.");
  } else if (worker === "innovator") {
    report.task_type = "seo_and_product_expansion";
    const catalog = command("npm", ["run", "validate:catalog"]); report.validations.catalog = catalog.ok ? "passed" : "failed";
    report.risks.push("Innovator requires a dedicated implementation cycle before changing product or SEO files.");
  } else if (worker === "retention") {
    report.task_type = "retention_sequence";
    const markers = ["retention-history.done", "retention-tabs.done", "retention-streaks.done"];
    report.retention_progress_percent = markers.filter((file) => fs.existsSync(path.join(stateRoot, file))).length / markers.length * 100;
    report.next_action = report.retention_progress_percent < 100 ? "Implement the next retention module in sequence on an isolated branch." : "Retention sequence complete; manager may schedule technical SEO micro-improvements.";
  } else if (worker === "curator") {
    report.task_type = "education_audit_and_generation_gate";
    const validator = path.join(root, "scripts", "validate-education-banks.mjs");
    if (fs.existsSync(validator)) { const result = command("node", [validator]); report.validations.education = result.ok ? "passed" : "failed"; if (!result.ok) report.errors.push(result.error || result.output); }
    report.risks.push("Content generation is gated until an approved model credential and an isolated implementation branch exist.");
  }
  await writeJson(path.join(reportRoot, `${cycleId}-${worker}.json`), report);
  await writeJson(path.join(stateRoot, `worker-${workerKey(worker)}-state.json`), { worker, last_cycle_id: cycleId, last_status: report.status, updated_at: now(), last_report: path.relative(root, path.join(reportRoot, `${cycleId}-${worker}.json`)) });
  return report;
}
async function status() {
  await ensureRuntime(); const config = await readJson(configPath, {}); const lock = await readJson(lockPath, null); const state = {};
  for (const worker of workers) state[worker] = await readJson(path.join(stateRoot, `worker-${workerKey(worker)}-state.json`), null);
  console.log(JSON.stringify({ repository: "andygargol2010-afk/Utilihub", branch: git("branch", "--show-current").output, config, lock, workers: state }, null, 2));
}
async function main() {
  await ensureRuntime(); const commandName = process.argv[2] || "status"; if (commandName === "status") return status();
  if (commandName !== "run") throw new Error("Uso: node scripts/agent-system.mjs status|run [worker]");
  const requested = process.argv[3] || "manager"; const cycleId = `cycle-${new Date().toISOString().replaceAll(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const lock = await acquireLock(cycleId, requested); if (!lock.acquired) { console.log(JSON.stringify({ cycle_id: cycleId, status: "blocked", blocked_reason: "repository lock is active", owner: lock.existing }, null, 2)); process.exitCode = 2; return; }
  try {
    const targets = requested === "manager" ? workers : [requested]; if (!targets.every((w) => workers.includes(w))) throw new Error(`Worker inválido: ${requested}`);
    const reports = []; for (const worker of targets) reports.push(await runWorker(worker, cycleId));
    const manager = baseReport(cycleId, "manager", "awaiting_human_review", "Review reports; any mutation must occur on a dedicated branch and pass validation before PR creation.");
    manager.files_inspected = targets.flatMap((worker) => [`${cycleId}-${worker}.json`]); manager.next_action = "If a worker has a real approved change, create an agent/* branch, validate, and open a PR for Preview review.";
    await writeJson(path.join(reportRoot, `${cycleId}-manager.json`), manager); console.log(JSON.stringify({ cycle_id: cycleId, reports: reports.map((r) => ({ worker: r.worker, status: r.status })) }, null, 2));
  } finally { await releaseLock(cycleId); }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
