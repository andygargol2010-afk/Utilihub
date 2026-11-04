// Part 2 of 3 — split from home-catalog.tsx on 2026-11-04. Edit here; home-catalog.tsx re-exports.
import { SpanishToolSearch } from "@/components/SpanishToolSearch";
import { ToolSearch } from "@/components/ToolSearch";
import { ALL_TOOLS } from "@/lib/all-tools";
import { QUICK_TOOL_SLUGS } from "./home-catalog.part1";

/** Short ES blurbs for home category cards (catalog descriptions are English-only). */
export const CATEGORY_BLURB_ES: Record<string, string> = {
  finanzas: "Inversiones, préstamos, ahorro e inflación.",
  matematicas: "Cálculos, porcentajes, geometría y estadística.",
  texto: "Contar, limpiar, transformar y analizar texto.",
  desarrollo: "JSON, Base64, hashes, IDs y utilidades para devs.",
  conversiones: "Unidades, color, divisas y más conversiones.",
  fechas: "Diferencias de fechas, edades y temporizadores.",
  generadores: "Contraseñas, UUID, QR y datos aleatorios.",
  diseno: "Colores, contraste, paletas y modelado.",
  "herramientas-avanzadas": "PixeliHub, modeladores 3D y utilidades avanzadas.",
  seguridad: "Contraseñas, hashes y validadores.",
  ciencia: "Física, química y simulaciones.",
  productividad: "Temporizadores, fechas y organización.",
  educacion: "Práctica y ejercicios de estudio.",
  cocina: "Recetas, porciones y conversiones de cocina.",
  viajes: "Combustible, divisas y planificación.",
  hogar: "Pintura, materiales y cálculos del hogar.",
  utilidades: "Utilidades prácticas del día a día.",
};

/** Short PT blurbs for home category cards. */
export const CATEGORY_BLURB_PT: Record<string, string> = {
  finanzas: "Investimentos, empréstimos, poupança e inflação.",
  matematicas: "Cálculos, porcentagens, geometria e estatística.",
  texto: "Contar, limpar, transformar e analisar texto.",
  desarrollo: "JSON, Base64, hashes, IDs e utilitários para devs.",
  conversiones: "Unidades, cor, moedas e mais conversões.",
  fechas: "Diferenças de datas, idades e temporizadores.",
  generadores: "Senhas, UUID, QR e dados aleatórios.",
  diseno: "Cores, contraste, paletas e modelagem.",
  "herramientas-avanzadas": "PixeliHub, modeladores 3D e utilitários avançados.",
  seguridad: "Senhas, hashes e validadores.",
  ciencia: "Física, química e simulações.",
  produtividade: "Temporizadores, datas e organização.",
  educacion: "Prática e exercícios de estudo.",
  cocina: "Receitas, porções e conversões de cozinha.",
  viajes: "Combustível, moedas e planejamento.",
  hogar: "Pintura, materiais e cálculos do lar.",
  utilidades: "Utilitários práticos do dia a dia.",
};

export function categoryHrefEs(slug: string) {
  if (slug === "finanzas") return "/es/finanzas";
  return `/es/categoria/${slug}`;
}

export function categoryHrefPt(slug: string) {
  if (slug === "finanzas") return "/pt/financas";
  return `/pt/categoria/${slug}`;
}

export function quickTools() {
  return QUICK_TOOL_SLUGS.map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug)).filter(
    (tool): tool is (typeof ALL_TOOLS)[number] => Boolean(tool),
  );
}

/** Count badge in the hero card. Catalog stays out of the home route chunk. */
export function HomeToolCount({ locale }: { locale: "en" | "es" | "pt" }) {
  const label = locale === "es" ? `${ALL_TOOLS.length} herramientas` : locale === "pt" ? `${ALL_TOOLS.length} ferramentas` : `${ALL_TOOLS.length} tools`;
  return <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">{label}</span>;
}

export function HomeSearch({ locale }: { locale: "en" | "es" | "pt" }) {
  return locale === "es" || locale === "pt" ? <SpanishToolSearch compactHome /> : <ToolSearch compactHome />;
}
