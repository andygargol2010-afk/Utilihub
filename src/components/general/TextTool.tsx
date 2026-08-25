import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { generateBySlug } from "@/lib/general/generator-engine";

const words = (value: string): string[] => value.trim() ? value.trim().split(/\s+/) : [];
const tokens = (value: string): string[] => value.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const toWords = (value: string): string[] => tokens(value).map((item) => item.toLowerCase());
const toKebab = (value: string): string => toWords(value).join("-");
const toSnake = (value: string): string => toWords(value).join("_");
const toCamel = (value: string): string => {
  const parts = toWords(value);
  return parts.length ? parts[0] + parts.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("") : "";
};
const toPascal = (value: string): string => toWords(value).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
const escapeHtml = (value: string): string => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

const extractUrls = (text: string): string[] => {
  const matches = text.match(/https?:\/\/[^\s<>"']+/gi) ?? [];
  return [...new Set(matches.map((url) => url.replace(/[),.;!?]+$/g, "")))];
};

const processText = (slug: string, text: string): string => {
  if (!slug.trim()) throw new Error("No se puede procesar texto sin un slug de herramienta.");
  switch (slug) {
    case "contador-de-caracteres": return `Caracteres Unicode: ${[...text].length} · Unidades UTF-16: ${text.length} · Sin espacios: ${[...text].filter((character) => !/\s/u.test(character)).length}`;
    case "contador-de-lineas": return `Líneas: ${text ? text.split(/\r\n|\r|\n/).length : 0}`;
    case "contador-de-frases": return `Frases: ${text.trim() ? text.trim().split(/[.!?]+(?:\s+|$)/).filter(Boolean).length : 0}`;
    case "contador-de-parrafos": return `Párrafos: ${text.trim() ? text.split(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)/).filter((paragraph) => paragraph.trim()).length : 0}`;
    case "mayusculas": return text.toUpperCase();
    case "minusculas": return text.toLowerCase();
    case "capitalizar": return text.replace(/(^|[.!?]\s+)(\p{L})/gu, (_match, prefix: string, character: string) => prefix + character.toUpperCase());
    case "camel-case": return toCamel(text);
    case "pascal-case": return toPascal(text);
    case "snake-case": return toSnake(text);
    case "kebab-case": return toKebab(text);
    case "quitar-espacios": return text.replace(/\s+/g, " ").trim();
    case "lineas-unicas": return [...new Set(text.split(/\r\n|\r|\n/))].join("\n");
    case "ordenar-lineas": return text.split(/\r\n|\r|\n/).sort((a, b) => a.localeCompare(b)).join("\n");
    case "invertir-texto": return [...text].reverse().join("");
    case "extraer-numeros": return text.match(/[-+]?\d+(?:[.,]\d+)?/g)?.join("\n") ?? "No se encontraron números.";
    case "extraer-emails": return [...new Set(text.match(/[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+/g) ?? [])].join("\n");
    case "extraer-urls": return extractUrls(text).join("\n") || "No se encontraron URLs HTTP/HTTPS.";
    case "limpiar-texto": return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\r\n|\r/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    case "texto-a-lista": return text.split(/\r\n|\r|\n/).map((item) => item.trim()).filter(Boolean).join(", ");
    case "lista-a-texto": return text.split(",").map((item) => item.trim()).filter(Boolean).join("\n");
    case "markdown-tabla": {
      const rows = text.split(/\r\n|\r|\n/).filter((row) => row.length > 0).map((row) => row.split("\t"));
      if (!rows.length) throw new Error("Introduce al menos una fila separada por tabulaciones.");
      const width = rows[0].length;
      if (width === 0 || rows.some((row) => row.length !== width)) throw new Error("La tabla Markdown contiene filas con distinta cantidad de columnas.");
      return `| ${rows[0].join(" | ")} |\n| ${rows[0].map(() => "---").join(" | ")} |\n${rows.slice(1).map((row) => `| ${row.join(" | ")} |`).join("\n")}`;
    }
    case "markdown-a-html": return escapeHtml(text).replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");
    case "html-a-texto": {
      const document = new DOMParser().parseFromString(text, "text/html");
      return document.body.textContent ?? "";
    }
    case "checklist": return text.split(/\r\n|\r|\n/).filter((item) => item.trim()).map((item) => `- [ ] ${item}`).join("\n");
    default: throw new Error(`Herramienta de texto sin implementación específica: ${slug}`);
  }
};

const diffLines = (first: string, second: string): string => {
  const a = first.split(/\r\n|\r|\n");
  const b = second.split(/\r\n|\r|\n");
  const max = Math.max(a.length, b.length);
  return Array.from({ length: max }, (_, index) => a[index] === b[index] ? `  ${a[index] ?? ""}` : `- ${a[index] ?? ""}\n+ ${b[index] ?? ""}`).join("\n");
};

export function TextTool({ tool }: { tool: GeneralTool }) {
  const [text, setText] = useState("");
  const [secondary, setSecondary] = useState("");
  const [replacement, setReplacement] = useState("");
  const [out, setOut] = useState("");
  const [copied, setCopied] = useState(false);
  const count = useMemo(() => ({ words: words(text).length, chars: [...text].length, lines: text ? text.split(/\r\n|\r|\n/).length : 0 }), [text]);

  const run = () => {
    try {
      if (tool.slug === "lorem-ipsum") setOut(generateBySlug(tool.slug));
      else if (tool.slug === "buscar-reemplazar") {
        if (!secondary) throw new Error("Introduce el texto que deseas buscar.");
        setOut(text.split(secondary).join(replacement));
      } else if (tool.slug === "diferencia-textos") setOut(diffLines(text, secondary));
      else setOut(processText(tool.slug, text));
    } catch (error) {
      setOut(error instanceof Error ? error.message : "No se pudo procesar el texto.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      setOut("No se pudo copiar el resultado en este navegador.");
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">Texto de entrada<textarea value={text} onChange={(event) => setText(event.target.value)} className="mt-2 min-h-48 w-full rounded-xl border border-border bg-background p-4" placeholder="Escribe o pega aquí…" /></label>
      {tool.slug === "buscar-reemplazar" && <label className="block text-sm font-semibold">Texto a buscar<input value={secondary} onChange={(event) => setSecondary(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>}
      {tool.slug === "buscar-reemplazar" && <label className="block text-sm font-semibold">Texto de reemplazo<input value={replacement} onChange={(event) => setReplacement(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>}
      {tool.slug === "diferencia-textos" && <label className="block text-sm font-semibold">Segundo texto<textarea value={secondary} onChange={(event) => setSecondary(event.target.value)} className="mt-2 min-h-32 w-full rounded-xl border border-border bg-background p-4" /></label>}
      <div className="flex flex-wrap gap-2"><button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>{out && <button onClick={copy} className="rounded-xl border px-4 py-2">{copied ? "Copiado" : "Copiar"}</button>}</div>
      <p className="text-xs text-muted-foreground">{count.words} palabras · {count.chars} caracteres Unicode · {count.lines} líneas</p>
      {out && <output aria-live="polite" className="block whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4">{out}</output>}
    </div>
  );
}
