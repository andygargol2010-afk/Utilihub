export type GitignoreStackId = "node" | "python" | "macos" | "vscode" | "next";

export type GitignoreResult =
  | { status: "empty"; output: null; issue: "empty"; lines: [] }
  | { status: "ok"; output: string; issue: null; lines: string[] };

export const GITIGNORE_STACKS: ReadonlyArray<{
  id: GitignoreStackId;
  lines: readonly string[];
}> = [
  { id: "node", lines: ["node_modules/", "dist/", "*.log", ".env", ".env.*"] },
  { id: "python", lines: ["__pycache__/", "*.py[cod]", ".venv/", "venv/", ".pytest_cache/"] },
  { id: "macos", lines: [".DS_Store", ".AppleDouble"] },
  { id: "vscode", lines: [".vscode/"] },
  { id: "next", lines: [".next/", "out/"] },
];

const STACK_BY_ID = new Map(GITIGNORE_STACKS.map((stack) => [stack.id, stack]));

function cleanCustom(extra: string): string[] {
  return extra
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.length <= 200 && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(line))
    .slice(0, 40);
}

export function buildGitignore(
  selected: readonly GitignoreStackId[],
  extra: string,
  comments: boolean,
): GitignoreResult {
  const lines: string[] = [];
  const seen = new Set<string>();
  const push = (line: string) => {
    if (seen.has(line)) return;
    seen.add(line);
    lines.push(line);
  };

  if (comments) push("# Generated locally. Nothing is uploaded.");
  for (const id of GITIGNORE_STACKS.map((stack) => stack.id)) {
    if (!selected.includes(id)) continue;
    const stack = STACK_BY_ID.get(id);
    if (!stack) continue;
    if (comments) push(`# ${id}`);
    for (const line of stack.lines) push(line);
  }
  for (const line of cleanCustom(extra)) push(line);

  const patterns = lines.filter((line) => !line.startsWith("#"));
  if (patterns.length === 0) return { status: "empty", output: null, issue: "empty", lines: [] };
  return { status: "ok", output: lines.join("\n") + "\n", issue: null, lines: patterns };
}
