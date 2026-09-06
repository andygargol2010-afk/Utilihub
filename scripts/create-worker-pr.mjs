#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const proposalPath = path.join(root, ".agent", "reports", "improvement-proposals.json");
const repository = process.env.GITHUB_REPOSITORY || "andygargol2010-afk/Utilihub";
const event = process.env.GITHUB_EVENT_NAME || "local";
if (!["schedule", "workflow_dispatch"].includes(event)) {
  console.log(JSON.stringify({ status: "skipped", reason: "Worker PRs run only from scheduled or manual worker cycles", event }));
  process.exit(0);
}
let payload;
try { payload = JSON.parse(await fs.readFile(proposalPath, "utf8")); } catch {
  console.log(JSON.stringify({ status: "skipped", reason: "No proposal report available" }));
  process.exit(0);
}
const proposal = payload.proposals?.[0];
if (!proposal) {
  console.log(JSON.stringify({ status: "skipped", reason: "No worker proposal" }));
  process.exit(0);
}
const changedFiles = execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" })
  .split("\n").map((line) => line.slice(3).trim())
  .filter((file) => file && !file.startsWith(".agent/") && file !== "node_modules");
if (changedFiles.length === 0) {
  console.log(JSON.stringify({ status: "skipped", reason: "No worker code change to promote" }));
  process.exit(0);
}
const fingerprint = payload.guardrails?.fingerprint || `cycle-${Date.now()}`;
const branch = `agent/worker/${fingerprint}`;
const title = `chore(worker): ${proposal.title || "apply worker change"}`;
const body = [
  "<!-- WORKER_GENERATED_PR -->",
  "## Automated worker change",
  "",
  "This Pull Request was created by a scheduled UtiliHub worker.",
  "After all repository checks and the Vercel Preview pass, the worker merge policy may promote it automatically to `main`.",
  "",
  `- **Worker risk:** ${proposal.risk || "unclassified"}`,
  `- **Occurrences:** ${proposal.occurrences || 0}`,
  `- **Proposal:** ${proposal.title || "not specified"}`,
  `- **Rationale:** ${proposal.rationale || "not specified"}`,
  `- **Changed files:** ${changedFiles.join(", ")}`,
  `- **Suggested tests:** ${(proposal.proposed_tests || []).join("; ")}`,
  "",
  "This PR is generated only from the worker branch. Human-authored PRs are excluded from automatic merging.",
].join("\n");
const packet = path.join(root, ".agent", "proposals", `${fingerprint}.md`);
await fs.mkdir(path.dirname(packet), { recursive: true });
await fs.writeFile(packet, `${body}\n`, { mode: 0o600 });
function run(name, args) { return execFileSync(name, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
let existing = "";
try { existing = run("gh", ["pr", "list", "--repo", repository, "--head", branch, "--state", "open", "--json", "url", "--jq", ".[0].url"]); } catch { /* continue */ }
if (existing) { console.log(JSON.stringify({ status: "exists", url: existing, branch })); process.exit(0); }
try { run("git", ["switch", "-c", branch]); } catch { run("git", ["switch", branch]); }
run("git", ["add", path.relative(root, packet), ...changedFiles]);
run("git", ["commit", "-m", title]);
run("git", ["push", "--set-upstream", "origin", branch]);
const url = run("gh", ["pr", "create", "--repo", repository, "--base", "main", "--head", branch, "--title", title, "--body", body]);
console.log(JSON.stringify({ status: "created", url, branch, fingerprint }));
