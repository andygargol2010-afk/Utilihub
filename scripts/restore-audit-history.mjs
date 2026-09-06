#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const reportsDir = path.join(root, ".agent", "reports");
const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY || "andygargol2010-afk/Utilihub";
const runId = process.env.GITHUB_RUN_ID;
const workflow = process.env.GITHUB_WORKFLOW_FILE || "autonomous-audit.yml";

if (!token || !runId) {
  console.log(JSON.stringify({ status: "skipped", reason: "GitHub Actions context unavailable" }));
  process.exit(0);
}

async function github(endpoint, options = {}) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28", ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  return response;
}

const runs = await (await github(`/repos/${repository}/actions/workflows/${encodeURIComponent(workflow)}/runs?status=success&per_page=20`)).json();
const previous = runs.workflow_runs.find((run) => String(run.id) !== String(runId));
if (!previous) {
  console.log(JSON.stringify({ status: "empty", reason: "No previous successful audit run" }));
  process.exit(0);
}
const artifacts = await (await github(`/repos/${repository}/actions/runs/${previous.id}/artifacts?per_page=100`)).json();
const artifact = artifacts.artifacts.find((item) => item.name.startsWith("utilihub-audit-") && !item.expired);
if (!artifact) {
  console.log(JSON.stringify({ status: "empty", reason: "Previous run has no usable audit artifact", run_id: previous.id }));
  process.exit(0);
}
const zip = await github(`/repos/${repository}/actions/artifacts/${artifact.id}/zip`);
const buffer = Buffer.from(await zip.arrayBuffer());
const temp = path.join(root, ".agent", `history-${artifact.id}.zip`);
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(temp, buffer, { mode: 0o600 });
await execFileAsync("unzip", ["-o", temp, "-d", root]);
await fs.rm(temp, { force: true });
console.log(JSON.stringify({ status: "restored", run_id: previous.id, artifact: artifact.name }));
