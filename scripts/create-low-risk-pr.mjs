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
let payload;
try { payload = JSON.parse(await fs.readFile(proposalPath, "utf8")); } catch {
  console.log(JSON.stringify({ status: "skipped", reason: "No proposal report available" }));
  process.exit(0);
}
const proposal = (payload.proposals || []).find((item) => item.risk === "low");
if (!proposal) {
  console.log(JSON.stringify({ status: "skipped", reason: "No real low-risk worker proposal" }));
  process.exit(0);
}
const changedFiles = execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .map((line) => line.slice(3).trim())
  .filter((file) => file && !file.startsWith(".agent/") && file !== "node_modules");
if (changedFiles.length === 0) {
  console.log(JSON.stringify({ status: "skipped", reason: "No worker code change to preview" }));
  process.exit(0);
}
const fingerprint = payload.guardrails?.fingerprint || "unfingerprinted";
const branch = `agent/proposal/${fingerprint}`;
const title = `chore(agent): review low-risk improvement ${fingerprint}`;
const body = [
  "## Automated low-risk worker proposal",
  "",
  "This Pull Request was created automatically from a deterministic worker proposal.",
  "It contains the proposed worker change for Preview review; it never merges or promotes production automatically.",
  "",
  `- **Risk:** ${proposal.risk}`,
  `- **Occurrences:** ${proposal.occurrences}`,
  `- **Title:** ${proposal.title}`,
  `- **Rationale:** ${proposal.rationale}`,
  `- **Likely files:** ${(proposal.likely_files || []).join(", ") || "To be determined during implementation"}`,
  `- **Changed files:** ${changedFiles.join(", ")}`,
  `- **Suggested tests:** ${(proposal.proposed_tests || []).join("; ")}`,
  "",
  "A maintainer must review the Preview and merge manually. No automatic production promotion is performed.",
].join("\n");
const packet = path.join(root, ".agent", "proposals", `${fingerprint}.md`);
await fs.mkdir(path.dirname(packet), { recursive: true });
await fs.writeFile(packet, `${body}\n`, { mode: 0o600 });
function git(...args) { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
function gh(...args) { return execFileSync("gh", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
let existing = "";
try { existing = gh("pr", "list", "--repo", repository, "--head", branch, "--state", "open", "--json", "url", "--jq", ".[0].url"); } catch { /* gh unavailable */ }
if (existing) {
  console.log(JSON.stringify({ status: "exists", url: existing, branch }));
  process.exit(0);
}
try { git("switch", "-c", branch); } catch { git("switch", branch); }
git("add", path.relative(root, packet));
try { git("commit", "-m", `chore(agent): record low-risk proposal ${fingerprint}`); } catch {
  console.log(JSON.stringify({ status: "skipped", reason: "Proposal packet already committed", branch }));
  process.exit(0);
}
git("push", "--set-upstream", "origin", branch);
const url = gh("pr", "create", "--repo", repository, "--base", "main", "--head", branch, "--title", title, "--body", body);
console.log(JSON.stringify({ status: "created", url, branch, fingerprint }));
