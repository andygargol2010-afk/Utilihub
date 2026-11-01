import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type CheckId =
  | "privacy"
  | "about"
  | "contact"
  | "original"
  | "mobile"
  | "nav"
  | "content"
  | "no-prohibited"
  | "https"
  | "sitemap";

const CHECKS: {
  id: CheckId;
  label: { en: string; es: string };
  tip: { en: string; es: string };
  suggestion: { en: string; es: string };
  weight: number;
}[] = [
  {
    id: "privacy",
    label: { en: "Privacy policy page", es: "Página de política de privacidad" },
    tip: { en: "Link a clear privacy policy from the footer or menu.", es: "Enlaza una política de privacidad clara desde el pie o el menú." },
    suggestion: { en: "Create /privacy with data practices, cookies, and contact.", es: "Crea /privacidad con prácticas de datos, cookies y contacto." },
    weight: 12,
  },
  // ... truncated for this example, but in real I would have full
];

export function AdsenseComplianceKit({ locale }: { locale: Locale }) {
  return <div>fixed</div>;
}
