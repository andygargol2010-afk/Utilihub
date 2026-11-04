// Part 1 of 3 — split from gap-seo-ops.ts on 2026-11-04. Edit here; gap-seo-ops.ts re-exports.

/** Field builders + runners for gap seo-growth tools (WiFi QR, CUIT). */

export function buildGapSeoFields(
  slug: string,
  es: boolean,
): { title: string; btn: string; fields: Array<
  | { kind: "number" | "text" | "textarea"; label: string; placeholder?: string }
  | { kind: "select"; label: string; options: { value: string; label: string }[] }
> } | null {
  if (slug === "qr-wifi") {
    return {
      title: es ? "Generador de QR WiFi" : "WiFi QR generator",
      btn: es ? "Generar" : "Generate",
      fields: [
        { kind: "text" as const, label: "SSID", placeholder: es ? "Nombre de la red" : "Network name" },
        {
          kind: "select" as const,
          label: es ? "Seguridad" : "Security",
          options: [
            { value: "WPA", label: "WPA/WPA2" },
            { value: "WEP", label: "WEP" },
            { value: "nopass", label: es ? "Sin contraseña" : "No password" },
          ],
        },
        { kind: "text" as const, label: es ? "Contraseña" : "Password", placeholder: es ? "Opcional si la red no tiene contraseña" : "Optional if no password" },
      ],
    };
  }
  if (slug === "validador-iban") {
    return {
      title: es ? "Validador IBAN" : "IBAN validator",
      btn: es ? "Validar" : "Validate",
      fields: [{ kind: "text" as const, label: "IBAN", placeholder: es ? "ES91 2100 …" : "GB82 WEST …" }],
    };
  }
  if (slug === "validador-cuit") {
    return {
      title: es ? "Validador CUIT/CUIL" : "CUIT/CUIL validator",
      btn: es ? "Validar" : "Validate",
      fields: [{ kind: "text" as const, label: es ? "CUIT o CUIL" : "CUIT or CUIL" }],
    };
  }
  return null;
}


export const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
  BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, EG: 29,
  ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28,
  HR: 21, HU: 28, IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20,
  LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19,
  MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
  RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26, UA: 29,
  VA: 22, VG: 24, XK: 20,
};
