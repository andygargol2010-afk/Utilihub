import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { buildVcard, VCARD_SAMPLE, type VcardInput } from "@/lib/general/vcard";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EMPTY: VcardInput = {
  fullName: "",
  org: "",
  title: "",
  email: "",
  phone: "",
  url: "",
  street: "",
  city: "",
  region: "",
  postal: "",
  country: "",
  note: "",
};

export function VcardTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [form, setForm] = useState<VcardInput>(VCARD_SAMPLE);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildVcard(form), [form]);

  function setField(key: keyof VcardInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const statusText = (() => {
    if (result.status === "empty") return es ? "El nombre es obligatorio." : "Full name is required.";
    if (result.status === "invalid" && result.error === "email") return es ? "El email no es válido." : "Email is not valid.";
    if (result.status === "invalid" && result.error === "url") return es ? "La URL debe empezar con http:// o https://." : "URL must start with http:// or https://.";
    if (result.status === "invalid") return es ? "El teléfono necesita al menos 6 dígitos." : "Phone needs at least 6 digits.";
    return es ? "vCard 3.0 listo" : "vCard 3.0 ready";
  })();

  async function copy() {
    if (result.status !== "ok" || !result.card) return;
    try {
      await navigator.clipboard.writeText(result.card);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    if (result.status !== "ok" || !result.card) return;
    const blob = new Blob([result.card], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contact.vcf";
    link.click();
    URL.revokeObjectURL(url);
  }

  const fields: { key: keyof VcardInput; label: string; inputMode?: "email" | "tel" | "url" }[] = [
    { key: "fullName", label: es ? "Nombre completo" : "Full name" },
    { key: "org", label: es ? "Organización" : "Organization" },
    { key: "title", label: es ? "Cargo" : "Title" },
    { key: "email", label: "Email", inputMode: "email" },
    { key: "phone", label: es ? "Teléfono" : "Phone", inputMode: "tel" },
    { key: "url", label: "URL", inputMode: "url" },
    { key: "street", label: es ? "Calle" : "Street" },
    { key: "city", label: es ? "Ciudad" : "City" },
    { key: "region", label: es ? "Región" : "Region" },
    { key: "postal", label: es ? "Código postal" : "Postal code" },
    { key: "country", label: es ? "País" : "Country" },
    { key: "note", label: es ? "Nota" : "Note" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="block space-y-1 text-sm">
            <span>{field.label}</span>
            <input
              className={inputClass}
              inputMode={field.inputMode}
              autoComplete="off"
              spellCheck={false}
              value={form[field.key]}
              onChange={(event) => setField(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setForm(VCARD_SAMPLE)}>
          {es ? "Ejemplo" : "Sample"}
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={download}>
          {es ? "Descargar .vcf" : "Download .vcf"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setForm(EMPTY)}>
          {es ? "Restablecer" : "Reset"}
        </button>
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{statusText}</p>
        {result.status === "ok" && result.card ? (
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs">{result.card}</pre>
        ) : null}
      </div>
    </div>
  );
}
