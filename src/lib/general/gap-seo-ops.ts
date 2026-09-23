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
        { kind: "text" as const, label: es ? "Contraseña" : "Password", placeholder: es ? "Opcional si sin contraseña" : "Optional if no password" },
      ],
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

export function runGapSeo(
  slug: string,
  values: string[],
  es: boolean,
): { result: string; qrPayload?: string } | null {
  if (slug === "qr-wifi") {
    const ssid = (values[0] || "").trim();
    const type = (values[1] || "WPA").trim();
    const pass = (values[2] || "").trim();
    if (!ssid) throw new Error(es ? "Ingresá el SSID." : "Enter the SSID.");
    if (type !== "nopass" && !pass) throw new Error(es ? "Ingresá la contraseña." : "Enter the password.");
    const esc = (s: string) => s.replace(/([\\;,\"])/g, "\\$1");
    const payload =
      type === "nopass" ? `WIFI:T:nopass;S:${esc(ssid)};;` : `WIFI:T:${type};S:${esc(ssid)};P:${esc(pass)};;`;
    return {
      result: es
        ? `Payload:\n${payload}\n\nCódigo QR generado abajo.`
        : `Payload:\n${payload}\n\nQR code generated below.`,
      qrPayload: payload,
    };
  }
  if (slug === "validador-cuit") {
    const raw = (values[0] || "").replace(/\D/g, "");
    if (raw.length !== 11) {
      throw new Error(es ? "El CUIT/CUIL debe tener 11 dígitos." : "CUIT/CUIL must have 11 digits.");
    }
    const types = new Set(["20", "23", "24", "27", "30", "33", "34"]);
    const prefix = raw.slice(0, 2);
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(raw[i]) * weights[i]!;
    const mod = 11 - (sum % 11);
    const check = mod === 11 ? 0 : mod === 10 ? 9 : mod;
    const ok = check === Number(raw[10]);
    const formatted = `${raw.slice(0, 2)}-${raw.slice(2, 10)}-${raw[10]}`;
    const typeNote = types.has(prefix)
      ? es
        ? `Prefijo ${prefix} válido (tipo habitual).`
        : `Prefix ${prefix} is a common type.`
      : es
        ? `Prefijo ${prefix}: no es un tipo habitual (20, 23, 24, 27, 30, 33, 34).`
        : `Prefix ${prefix} is not a common type (20, 23, 24, 27, 30, 33, 34).`;
    if (ok) {
      return {
        result: es
          ? `Válido ✓\nFormato: ${formatted}\n${typeNote}\nDígito verificador correcto.`
          : `Valid ✓\nFormat: ${formatted}\n${typeNote}\nCheck digit OK.`,
      };
    }
    return {
      result: es
        ? `Inválido ✗\nFormato: ${formatted}\n${typeNote}\nDígito verificador esperado: ${check}, recibido: ${raw[10]}.`
        : `Invalid ✗\nFormat: ${formatted}\n${typeNote}\nExpected check digit: ${check}, got: ${raw[10]}.`,
    };
  }
  return null;
}
