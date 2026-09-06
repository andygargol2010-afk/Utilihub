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
  console.log(JSON.stringify({ status: "skipped", reason: "No low-risk proposal" }));
  process.exit(0);
}
const fingerprint = payload.guardrails?.fingerprint || "unfingerprinted";
const branch = `agent/proposal/${fingerprint}`;
const title = `chore(agent): review low-risk improvement ${fingerprint}`;
const body = [
  "## Automated low-risk improvement proposal",
  "",
  "This Pull Request was created automatically from a deterministic audit proposal.",
  "It contains the review packet only; it does not modify application behavior or production settings.",
  "",
  `- **Risk:** ${proposal.risk}`,
  `- **Occurrences:** ${proposal.occurrences}`,
  `- **Title:** ${proposal.title}`,
  `- **Rationale:** ${proposal.rationale}`,
  `- **Likely files:** ${(proposal.likely_files || []).join(", ") || "To be determined during review"}`,
  `- **Suggested tests:** ${(proposal.proposed_tests || []).join("; ")}`,
  "",
  "A maintainer must review and implement any code change separately. No automatic merge is performed.",
].join("\n");
const packet = path.join(root, ".agent", "proposals", `${fingerprint}.md`);
await fs.mkdir(path.dirname(packet), { recursive: true });
await fs.writeFile(packet, `${body}\n`, { mode: 0o600 });
function git(...args) { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
try { git("show-ref", "--verify", `refs/remotes/origin/${branch}`); } catch { /* branch is new */ }
try { git("switch", "-c", branch); } catch { git("switch", branch); }
git("add", path.relative(root, packet));
try { git("commit", "-m", `chore(agent): record low-risk proposal ${fingerprint}`); } catch {
  console.log(JSON.stringify({ status: "skipped", reason: "Proposal already committed", branch }));
  process.exit(0);
}
git("push", "--set-upstream", "origin", branch);
let existing = "";
try { existing = execFileSync("gh", ["pr", "list", "--repo", repository, "--head", branch, "--json", "url", "--jq", ".[0].url"], { cwd: root, encoding: "utf8" }).trim(); } catch { /* gh unavailable */ }
if (existing) {
  console.log(JSON.stringify({ status: "exists", url: existing, branch }));
  process.exit(0);
}
const url = execFileSync("gh", ["pr", "create", "--repo", repository, "--base", "main", "--head", branch, "--title", title, "--body", body], { cwd: root, encoding: "utf8" }).trim();
 console.log(JSON.stringify({ status: "created", url, branch, fingerprint }));
