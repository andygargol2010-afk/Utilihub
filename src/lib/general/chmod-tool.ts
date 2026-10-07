import { makeTool } from "./types";

/** Gap: cron explains schedules, not file mode bits. Local octal/symbolic chmod map. */
export const CHMOD_TOOLS = [
  makeTool(
    "conversor-permisos-chmod",
    "Chmod permission converter",
    "desarrollo",
    "text",
    "Convert Unix file permissions between octal and symbolic rwx, including setuid, setgid, and sticky.",
    [
      "chmod calculator",
      "symbolic to octal permissions",
      "755 to rwxr-xr-x",
      "conversor chmod",
      "permisos unix octal a simbolico",
      "calculadora permisos rwx",
    ],
    {
      mode: "chmod",
      title: "Chmod Permission Converter — Octal and Symbolic rwx | UtiliHub",
      description:
        "Convert Unix permissions between octal and symbolic rwx, with setuid, setgid, and sticky. Local only. Free in the browser.",
    },
  ),
];
