import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { subnetFromCidr } from "@/lib/general/subnet";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const PRESETS = [
  { id: "lan", value: "192.168.1.10/24", labelEn: "LAN /24", labelEs: "LAN /24" },
  { id: "link", value: "10.0.0.5/30", labelEn: "Link /30", labelEs: "Enlace /30" },
  { id: "p2p", value: "172.16.5.20/31", labelEn: "Point-to-point /31", labelEs: "Punto a punto /31" },
];

export function SubnetTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState(PRESETS[0].value);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => subnetFromCidr(value), [value]);

  const rows = result.status === "ok"
    ? [
        [es ? "Dirección" : "Address", result.address],
        [es ? "Prefijo" : "Prefix", `/${result.prefix}`],
        [es ? "Máscara" : "Mask", result.mask],
        ["Wildcard", result.wildcard],
        [es ? "Red" : "Network", result.network],
        ["Broadcast", result.broadcast],
        [es ? "Primer host" : "First host", result.firstHost],
        [es ? "Último host" : "Last host", result.lastHost],
        [es ? "Direcciones" : "Addresses", result.total],
        [es ? "Hosts útiles" : "Usable hosts", result.usable],
      ]
    : [];

  const note = result.note === "p2p"
    ? (es ? "RFC 3021: las dos direcciones son hosts." : "RFC 3021: both addresses are hosts.")
    : result.note === "host"
      ? (es ? "/32: un solo host." : "/32: a single host.")
      : result.note === "normal"
        ? (es ? "Se reservan red y broadcast." : "Network and broadcast are reserved.")
        : "";

  const summary = rows.map(([label, item]) => `${label}: ${item}`).join("\n");

  async function copyResult() {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  const status = result.status === "empty"
    ? (es ? "Escribí una dirección y un prefijo." : "Enter an address and a prefix.")
    : result.status === "invalid"
      ? (es ? "CIDR IPv4 no válido. Ejemplo: 192.168.1.10/24." : "Invalid IPv4 CIDR. Example: 192.168.1.10/24.")
      : (es ? "Subred calculada." : "Subnet calculated.");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" className={buttonClass} onClick={() => setValue(preset.value)}>
            {es ? preset.labelEs : preset.labelEn}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => setValue("")}>
          {es ? "Limpiar" : "Reset"}
        </button>
      </div>
      <label className="block space-y-1 text-sm">
        <span>{es ? "Dirección IPv4 / prefijo" : "IPv4 address / prefix"}</span>
        <input
          className={fieldClass}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="decimal"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="192.168.1.10/24"
        />
      </label>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? (
        <div className="rounded-xl border p-4 space-y-3">
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rows.map(([label, item]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="font-medium break-all">{item}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted-foreground">{note}</p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
