#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const proposalPath = path.join(root, ".agent", "reports", "improvement-proposals.json");
const repository = process.env.GITHUB_REPOSITORY || "andygargol2010-afk/Utilihub";
const event = process.env.GITHUB_EVENT_NAME || "local";
const allowedEvents = new Set(["schedule", "workflow_dispatch"]);
if (!allowedEvents.has(event)) {
  console.log(JSON.stringify({ status: "skipped", reason: "Automatic PRs run only from scheduled or manual audits", event }));
  process.exit(0);
}

let payload = { proposals: [], guardrails: {} };
try { payload = JSON.parse(await fs.readFile(proposalPath, "utf8")); } catch { /* Use the safe audit-preview fallback. */ }

const proposal = (payload.proposals || []).find((item) => item.risk === "low");
const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
const fingerprint = proposal ? (payload.guardrails?.fingerprint || "unfingerprinted") : `audit-${date}`;
const branch = `agent/proposal/${fingerprint}`;
const synthetic = !proposal;
const selected = proposal || {
  risk: "low",
  occurrences: 0,
  title: "Verificar Preview diario de UtiliHub",
  rationale: "No hubo una propuesta de código low-risk; este PR seguro permite verificar que el despliegue Preview y sus checks siguen operativos.",
  likely_files: [".agent/proposals/"],
  proposed_tests: ["npm run lint", "npm run validate:catalog", "npm run build"],
};
const title = synthetic ? `chore(agent): daily audit preview ${date}` : `chore(agent): review low-risk improvement ${fingerprint}`;
const body = [
  synthetic ? "## Automated daily audit Preview" : "## Automated low-risk improvement proposal",
  "",
  synthetic
    ? "This safe, non-functional Pull Request exists to trigger a Vercel Preview and verify the autonomous audit path."
    : "This Pull Request was created automatically from a deterministic audit proposal.",
  "It does not modify application behavior or production settings.",
  "",
  `- **Risk:** ${selected.risk}`,
  `- **Occurrences:** ${selected.occurrences}`,
  `- **Title:** ${selected.title}`,
  `- **Rationale:** ${selected.rationale}`,
  `- **Likely files:** ${(selected.likely_files || []).join(", ")}`,
  `- **Suggested tests:** ${(selected.proposed_tests || []).join("; ")}`,
  "",
  "Review and merge remain manual. No automatic merge or production promotion is performed.",
].join("\n");

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}
function gh(...args) {
  return execFileSync("gh", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

let existing = "";
try { existing = gh("pr", "list", "--repo", repository, "--head", branch, "--state", "open", "--json", "url", "--jq", ".[0].url"); } catch { /* gh unavailable */ }
if (existing) {
  console.log(JSON.stringify({ status: "exists", url: existing, branch, synthetic }));
  process.exit(0);
}

const packet = path.join(root, ".agent", "proposals", `${fingerprint}.md`);
await fs.mkdir(path.dirname(packet), { recursive: true });
await fs.writeFile(packet, `${body}\n`, { mode: 0o600 });
git("switch", "-c", branch);
git("add", path.relative(root, packet));
try { git("commit", "-m", synthetic ? `chore(agent): daily audit preview ${date}` : `chore(agent): record low-risk proposal ${fingerprint}`); } catch {
  console.log(JSON.stringify({ status: "skipped", reason: "Proposal packet already committed", branch }));
  process.exit(0);
}
git("push", "--set-upstream", "origin", branch);
const url = gh("pr", "create", "--repo", repository, "--base", "main", "--head", branch, "--title", title, "--body", body);
console.log(JSON.stringify({ status: "created", url, branch, fingerprint, synthetic }));
