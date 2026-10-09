import { makeTool } from "./types";

/** Gap: robots.txt and security.txt write site files. This writes a .gitignore from fixed stacks only. */
export const GITIGNORE_TOOLS = [
  makeTool(
    "generador-gitignore",
    "Gitignore generator",
    "desarrollo",
    "generator",
    "Build a .gitignore from Node, Python, macOS, VS Code, and Next.js stacks without uploading the file.",
    [
      "gitignore generator",
      "create gitignore",
      "node gitignore",
      "python gitignore",
      "generador gitignore",
      "crear gitignore",
      "gitignore node",
      "gitignore python",
    ],
    {
      mode: "gitignore",
      title: "Gitignore Generator — Node, Python, macOS | UtiliHub",
      description:
        "Create a .gitignore from Node, Python, macOS, VS Code, and Next.js stacks. Duplicate lines collapse. An empty selection does not invent a file. Runs locally.",
    },
  ),
];
