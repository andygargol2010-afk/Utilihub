import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { WHATSAPP_SAMPLE_MESSAGE, WHATSAPP_SAMPLE_NUMBER, buildWhatsAppLink } from "@/lib/general/whatsapp-link";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function WhatsAppLinkTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [number, setNumber] = useState(WHATSAPP_SAMPLE_NUMBER);
  const [message, setMessage] = useState(WHATSAPP_SAMPLE_MESSAGE);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildWhatsAppLink(number, message), [number, message]);

  async function copyResult() {
    if (result.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const status =
    result.status === "empty"
      ? es
        ? "El número está vacío. No se inventa un enlace."
        : "The number is empty. No link is invented."
      : result.error === "local"
        ? es
          ? "El 0 o 00 inicial es un prefijo local. No se inventa un código de país."
          : "A leading 0 or 00 is a local trunk prefix. No country code is invented."
        : result.error === "digits"
          ? es
            ? "Dejá solo el + y dígitos. No se inventa un enlace."
            : "Keep the plus and digits only. No link is invented."
          : result.error === "length"
            ? es
              ? "El número, con código de país, debe tener entre 8 y 15 dígitos."
              : "The number, with country code, must be 8 to 15 digits."
            : result.error === "message"
              ? es
                ? "El mensaje pasa de 500 caracteres. No se recorta."
                : "The message is over 500 characters. It is not truncated."
              : es
                ? "Enlace listo. No se abrió WhatsApp."
                : "Link ready. WhatsApp was not opened.";

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número con código de país" : "Number with country code"}</span>
        <input
          className={fieldClass}
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          inputMode="tel"
          autoComplete="off"
          spellCheck={false}
          placeholder="+1 415 555 2671"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Mensaje (opcional)" : "Message (optional)"}</span>
        <textarea
          className={fieldClass}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          placeholder={es ? "Hola" : "Hello"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setNumber(WHATSAPP_SAMPLE_NUMBER);
            setMessage(WHATSAPP_SAMPLE_MESSAGE);
          }}
        >
          {es ? "Ejemplo" : "Example"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setNumber("5491155551234");
            setMessage("");
          }}
        >
          {es ? "Sin mensaje" : "No message"}
        </button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={result.status !== "ok"}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setNumber("");
            setMessage("");
          }}
        >
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{status}</p>
        {result.status === "ok" ? <p className="mt-3 break-all font-mono text-base">{result.url}</p> : null}
      </div>
    </div>
  );
}
