// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GAP_2, split from gap-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GAP_2_PART2: Record<string, ToolSeoOverride> = {  "csv-a-json": {
    metaTitle: "CSV to JSON Converter — Tables to Objects | UtiliHub",
    metaTitleEs: "Conversor CSV a JSON — Tablas a objetos | UtiliHub",
    metaDescription: "Convert CSV tables to JSON arrays of objects in the browser. Handles quoted fields. Free and private.",
    metaDescriptionEs: "Convertí tablas CSV a arrays JSON de objetos en el navegador. Soporta campos entre comillas. Gratis y privado.",
    about: [
      "Paste a CSV with a header row. Each following row becomes a JSON object keyed by column names.",
      "Quoted fields with commas are supported.",
    ],
    aboutEs: [
      "Pegá un CSV con fila de encabezados. Cada fila siguiente se convierte en un objeto JSON con esas claves.",
      "Se admiten campos entre comillas con comas.",
    ],
    steps: ["Paste CSV including headers.", "Press Process.", "Copy the JSON array."],
    stepsEs: ["Pegá el CSV con encabezados.", "Pulsá Procesar.", "Copiá el array JSON."],
    faq: [
      { q: "What if a row has fewer columns?", a: "Missing cells become empty strings." },
      { q: "Is data uploaded?", a: "No — conversion is local." },
    ],
    faqEs: [
      { q: "¿Y si una fila tiene menos columnas?", a: "Las celdas faltantes quedan como cadenas vacías." },
      { q: "¿Se suben los datos?", a: "No — la conversión es local." },
    ],
  },  "qr-wifi": {
    metaTitle: "WiFi QR Code Generator — SSID & Password | UtiliHub",
    metaTitleEs: "Generador de QR WiFi — SSID y contraseña | UtiliHub",
    metaDescription: "Generate a scannable WiFi QR code with SSID, WPA/WEP, and password. Share network access without typing.",
    metaDescriptionEs: "Generá un QR WiFi escaneable con SSID, WPA/WEP y contraseña. Compartí la red sin escribir la clave.",
    about: [
      "Enter network name, security type, and password. The tool builds the standard WIFI: payload and renders a QR image.",
      "Guests scan the code to join without typing credentials.",
    ],
    aboutEs: [
      "Ingresá el nombre de la red, el tipo de seguridad y la contraseña. Se arma el payload WIFI: y se muestra un QR.",
      "Los invitados escanean el código para unirse sin tipear la clave.",
    ],
    steps: ["Enter SSID.", "Choose security (WPA, WEP, or none).", "Enter password if needed and generate."],
    stepsEs: ["Ingresá el SSID.", "Elegí seguridad (WPA, WEP o ninguna).", "Ingresá la contraseña si hace falta y generá."],
    faq: [
      { q: "Where is the QR image from?", a: "The payload is built locally; the PNG is requested from a public QR API for display." },
      { q: "Is the password stored?", a: "No. It only appears in the QR payload you generate in-session." },
    ],
    faqEs: [
      { q: "¿De dónde sale la imagen del QR?", a: "El payload se arma en local; el PNG se pide a una API pública de QR solo para mostrarlo." },
      { q: "¿Se guarda la contraseña?", a: "No. Solo aparece en el payload del QR que generás en la sesión." },
    ],
  },
};
