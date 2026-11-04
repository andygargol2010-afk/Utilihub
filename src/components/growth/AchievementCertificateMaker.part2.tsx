// Part 2 of 3 — split from AchievementCertificateMaker.tsx on 2026-11-04. Edit here; AchievementCertificateMaker.tsx re-exports.

export type TemplateId = "classic" | "modern" | "playful";
export type ColorId = "navy" | "gold" | "emerald" | "rose" | "slate";

export const TEMPLATES: { id: TemplateId; name: { en: string; es: string } }[] = [
  { id: "classic", name: { en: "Classic Diploma", es: "Diploma Clásico" } },
  { id: "modern", name: { en: "Modern Badge", es: "Insignia Moderna" } },
  { id: "playful", name: { en: "Playful Award", es: "Premio Divertido" } },
];

export const COLORS: { id: ColorId; label: { en: string; es: string }; primary: string; accent: string; bg: string }[] = [
  { id: "navy", label: { en: "Navy", es: "Azul marino" }, primary: "#1e3a8a", accent: "#d4af37", bg: "#f8fafc" },
  { id: "gold", label: { en: "Gold", es: "Dorado" }, primary: "#92400e", accent: "#fbbf24", bg: "#fffbeb" },
  { id: "emerald", label: { en: "Emerald", es: "Esmeralda" }, primary: "#065f46", accent: "#34d399", bg: "#ecfdf5" },
  { id: "rose", label: { en: "Rose", es: "Rosa" }, primary: "#9f1239", accent: "#fb7185", bg: "#fff1f2" },
  { id: "slate", label: { en: "Slate", es: "Pizarra" }, primary: "#0f172a", accent: "#64748b", bg: "#f1f5f9" },
];

export const PRESETS = [
  { id: "course", label: { en: "Course Complete", es: "Curso Completado" }, title: { en: "Successfully Completed Training", es: "Completó la Capacitación" }, message: { en: "For outstanding participation and mastery of the material.", es: "Por su destacada participación y dominio del material." } },
  { id: "mvp", label: { en: "Team MVP", es: "MVP del Equipo" }, title: { en: "Most Valuable Player", es: "Jugador Más Valioso" }, message: { en: "Recognized for exceptional contribution to the team.", es: "Reconocido por su contribución excepcional al equipo." } },
  { id: "milestone", label: { en: "Milestone", es: "Hito Alcanzado" }, title: { en: "Reached Important Milestone", es: "Alcanzó un Hito Importante" }, message: { en: "Celebrating this significant achievement.", es: "Celebrando este logro significativo." } },
];
