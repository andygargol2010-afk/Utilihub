import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { buildSecurityTxt, SECURITY_TXT_SAMPLE, type SecurityTxtInput } from "@/lib/general/security-txt";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EMPTY: SecurityTxtInput = {
  contact: "",
  expires: "",
  encryption: "",
  acknowledgments: "",
  languages: "",
  canonical: "",
  policy: "",
  hiring: "",
};

export function SecurityTxtTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [form, setForm] = useState<SecurityTxtInput>(SECURITY_TXT_SAMPLE);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildSecurityTxt(form), [form]);

  function setField(key: keyof SecurityTxtInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const statusText = (() => {
    if (result.status === "empty") return es ? "Contact es obligatorio." : "Contact is required.";
    if (result.status === "invalid" && result.error === "contact") {
      return es ? "Contact debe ser mailto:, https:// o tel:+…" : "Contact must be mailto:, https://, or tel:+…";
    }
    if (result.status === "invalid" && result.error === "expires") {
      return es ? "Expires tiene que ser una fecha UTC futura." : "Expires must be a future UTC date.";
    }
    if (result.status === "invalid") {
      return es ? "Las URLs opcionales deben ser https y los idiomas, códigos como en o es." : "Optional URLs must be https, and languages must be codes like en or es.";
    }
    return es ? "security.txt listo" : "security.txt ready";
  })();

  async function copy() {
    if (result.status !== "ok" || !result.file) return;
    try {
      await navigator.clipboard.writeText(result.file);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    if (result.status !== "ok" || !result.file) return;
    const blob = new Blob([result.file], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "security.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  const fields: { key: keyof SecurityTxtInput; label: string }[] = [
    { key: "contact", label: "Contact" },
    { key: "expires", label: "Expires" },
    { key: "encryption", label: "Encryption" },
    { key: "acknowledgments", label: "Acknowledgments" },
    { key: "languages", label: es ? "Idiomas" : "Languages" },
    { key: "canonical", label: "Canonical" },
    { key: "policy", label: "Policy" },
    { key: "hiring", label: "Hiring" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="block space-y-1 text-sm">
            <span>{field.label}</span>
            <input
              className={inputClass}
              autoComplete="off"
              spellCheck={false}
              value={form[field.key]}
              onChange={(event) => setField(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setForm(SECURITY_TXT_SAMPLE)}>
          {es ? "Ejemplo" : "Sample"}
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={download}>
          {es ? "Descargar security.txt" : "Download security.txt"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setForm(EMPTY)}>
          {es ? "Restablecer" : "Reset"}
        </button>
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{statusText}</p>
        {result.status === "ok" && result.file ? (
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs">{result.file}</pre>
        ) : null}
      </div>
    </div>
  );
}
