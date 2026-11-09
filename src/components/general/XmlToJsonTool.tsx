import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base font-mono text-sm";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function xmlToJson(xml: Document | Element): any {
  const obj: any = {};
  if (xml.nodeType === 1) { // Element
    if (xml.attributes.length > 0) {
      for (let i = 0; i < xml.attributes.length; i++) {
        const attr = xml.attributes.item(i)!;
        obj[`@${attr.nodeName}`] = attr.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // Text
    const text = xml.nodeValue?.trim();
    if (text) return text;
    return null;
  }
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i)!;
      const nodeName = item.nodeName;
      const child = xmlToJson(item as any);
      if (child === null || child === undefined) continue;
      if (obj[nodeName] === undefined) {
        obj[nodeName] = child;
      } else {
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(child);
      }
    }
  }
  return obj;
}

export function XmlToJsonTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [xml, setXml] = useState("<root><item id=\"1\">Hello</item><item id=\"2\">World</item></root>");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml.trim(), "text/xml");
      const error = doc.querySelector("parsererror");
      if (error) return { json: "", error: es ? "XML inválido" : "Invalid XML" };
      const jsonObj = xmlToJson(doc.documentElement);
      return { json: JSON.stringify(jsonObj, null, 2), error: "" };
    } catch (e) {
      return { json: "", error: es ? "Error al convertir" : "Conversion error" };
    }
  }, [xml, es]);

  async function copy() {
    if (!result.json) return;
    try {
      await navigator.clipboard.writeText(result.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setXml("<root><item id=\"1\">Hello</item><item id=\"2\">World</item></root>");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "XML" : "XML"}</span>
          <textarea
            value={xml}
            onChange={(e) => setXml(e.target.value)}
            rows={10}
            className={fieldClass}
            placeholder={es ? "Pega tu XML aquí" : "Paste XML here"}
          />
        </label>
        <div className="space-y-2 text-sm">
          <span className="font-medium">{es ? "JSON" : "JSON"}</span>
          <pre className="h-[240px] overflow-auto rounded-xl border bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap">
            {result.error || result.json || (es ? "Resultado" : "Result")}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result.json}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar JSON" : "Copy JSON"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
