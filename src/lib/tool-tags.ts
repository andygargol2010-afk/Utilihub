import type { CatalogTool } from "./all-tools";

/** Curated intent tags — short, user-meaningful filters (not generic SEO spam). */
export type IntentTag = {
  id: string;
  label: string;
  labelEs: string;
  /** Match against normalized slug + name + keywords + kind */
  match: (hay: string) => boolean;
};

function has(...parts: string[]) {
  return (hay: string) => parts.some((p) => hay.includes(p));
}

function hasAll(...parts: string[]) {
  return (hay: string) => parts.every((p) => hay.includes(p));
}

/**
 * Global + per-category intent tags.
 * Order matters for UI: first matching tags shown first.
 */
export const INTENT_TAGS: IntentTag[] = [
  // Finance
  { id: "loans", label: "Loans", labelEs: "Préstamos", match: has("loan", "prestamo", "amortiz", "mortgage", "hipotec", "deuda", "debt service", "dscr") },
  { id: "investing", label: "Investing", labelEs: "Inversión", match: has("invest", "roi", "cagr", "return", "rentabilidad", "dividend", "dca", "monte carlo", "payback", "drawdown", "posicion", "position size", "risk/reward", "riesgo") },
  { id: "savings", label: "Savings", labelEs: "Ahorro", match: has("saving", "ahorro", "emergency fund", "fondo de emergencia") },
  { id: "inflation", label: "Inflation", labelEs: "Inflación", match: has("inflat", "purchasing power", "poder adquisitivo", "salario real", "real return", "rentabilidad real") },
  { id: "portfolio", label: "Portfolio", labelEs: "Cartera", match: has("portfolio", "cartera", "rebalance", "allocation", "asignacion", "diversif", "concentracion", "wacc", "roic") },
  { id: "retirement", label: "Retirement", labelEs: "Jubilación", match: has("retire", "jubil", "fire", "withdrawal", "retiro") },
  { id: "bonds", label: "Bonds", labelEs: "Bonos", match: has("bond", "bono", "yield to maturity", "ytm", "duration", "duracion") },
  { id: "tax-income", label: "Tax & income", labelEs: "Impuestos", match: has("tax", "impuesto", "salary", "salario", "neto") },
  { id: "compound", label: "Compound interest", labelEs: "Interés compuesto", match: has("compound", "interes compuesto", "interes-compuesto") },

  // Math / stats
  { id: "statistics", label: "Statistics", labelEs: "Estadística", match: has("stat", "average", "promedio", "median", "mediana", "moda", "variance", "varianza", "deviation", "desviacion", "percentile", "percentil", "quartile", "cuartil", "correlation", "correlacion", "z-score", "covariance") },
  { id: "geometry", label: "Geometry", labelEs: "Geometría", match: has("area", "volume", "volumen", "perimeter", "perimetro", "triangle", "triangulo", "circle", "circulo", "sphere", "esfera", "geometry", "geometr") },
  { id: "algebra", label: "Algebra", labelEs: "Álgebra", match: has("equation", "ecuacion", "quadratic", "cuadratic", "algebra", "polynomial", "polinomio") },
  { id: "percentages", label: "Percentages", labelEs: "Porcentajes", match: has("percent", "porcent", "discount", "descuento", "rule of three", "regla de tres") },

  // Text
  { id: "text-transform", label: "Transform text", labelEs: "Transformar texto", match: has("case", "upper", "lower", "slug", "reverse", "trim", "clean", "limpiar", "remove", "replace") },
  { id: "text-count", label: "Count & analyze", labelEs: "Contar texto", match: has("count", "contador", "word count", "character", "reading time", "lectura") },
  { id: "diff-compare", label: "Compare", labelEs: "Comparar", match: has("diff", "compare", "compar", "similarity") },

  // Developer
  { id: "encode", label: "Encode / decode", labelEs: "Codificar", match: has("base64", "url-encode", "url-decode", "html-encode", "html-decode", "encode", "decode") },
  { id: "json-data", label: "JSON & data", labelEs: "JSON y datos", match: has("json", "yaml", "csv", "xml") },
  { id: "hash-crypto", label: "Hash & crypto", labelEs: "Hash", match: has("hash", "md5", "sha", "hmac", "bcrypt") },
  { id: "ids-tokens", label: "IDs & tokens", labelEs: "IDs y tokens", match: has("uuid", "token", "random id", "guid") },
  { id: "regex", label: "Regex", labelEs: "Regex", match: has("regex", "regexp", "regular expression") },

  // Converters
  { id: "units", label: "Units", labelEs: "Unidades", match: has("unit", "unidad", "length", "longitud", "weight", "peso", "temperature", "temperatura", "speed", "velocidad", "area converter", "volume converter") },
  { id: "color", label: "Color", labelEs: "Color", match: has("color", "hex", "rgb", "hsl", "palette", "contrast", "gradient") },
  { id: "currency", label: "Currency", labelEs: "Divisas", match: has("currency", "divisa", "exchange", "forex") },

  // Time
  { id: "date-calc", label: "Date math", labelEs: "Fechas", match: has("date", "fecha", "age", "edad", "deadline", "plazo", "duration", "duracion", "interval", "timezone", "zona horaria", "timestamp") },
  { id: "timers", label: "Timers", labelEs: "Temporizadores", match: has("timer", "countdown", "pomodoro", "stopwatch", "cronometro") },

  // Generators / security
  { id: "password", label: "Passwords", labelEs: "Contraseñas", match: has("password", "contrasena", "passphrase", "strength") },
  { id: "random-gen", label: "Random generators", labelEs: "Aleatorios", match: has("random", "generator", "generador", "uuid", "lorem") },

  // Science
  { id: "physics", label: "Physics", labelEs: "Física", match: has("physics", "fisica", "force", "fuerza", "velocity", "acceleration", "energy", "energia", "ohm", "voltage", "corriente", "power", "potencia") },
  { id: "chemistry", label: "Chemistry", labelEs: "Química", match: has("chem", "quimica", "molar", "mole", "ph", "atom", "element") },

  // Lifestyle practical
  { id: "cooking", label: "Cooking", labelEs: "Cocina", match: has("recipe", "receta", "cook", "cocina", "ingredient", "ingrediente", "oven", "horno") },
  { id: "travel", label: "Travel", labelEs: "Viajes", match: has("travel", "viaje", "fuel", "combustible", "flight", "vuelo", "trip") },
  { id: "home", label: "Home", labelEs: "Hogar", match: has("home", "hogar", "rent", "alquiler", "utility", "consumo", "paint", "pintura", "tile") },
  { id: "quiz", label: "Quizzes", labelEs: "Cuestionarios", match: has("quiz", "test", "exam", "examen", "practice", "practica") },
];

/** Which intent tags to surface when browsing a given category (internal slug). */
export const CATEGORY_FACETS: Record<string, string[]> = {
  finanzas: ["loans", "investing", "savings", "inflation", "portfolio", "retirement", "bonds", "tax-income", "compound"],
  matematicas: ["statistics", "geometry", "algebra", "percentages"],
  texto: ["text-transform", "text-count", "diff-compare"],
  desarrollo: ["encode", "json-data", "hash-crypto", "ids-tokens", "regex"],
  conversiones: ["units", "color", "currency", "encode"],
  fechas: ["date-calc", "timers"],
  generadores: ["random-gen", "password", "ids-tokens"],
  diseno: ["color"],
  seguridad: ["password", "hash-crypto", "encode"],
  ciencia: ["physics", "chemistry"],
  productividad: ["timers", "date-calc"],
  educacion: ["quiz", "algebra", "statistics", "geometry"],
  cocina: ["cooking", "units"],
  viajes: ["travel", "currency", "units"],
  hogar: ["home", "units"],
  utilidades: ["units", "percentages", "date-calc"],
};

/** Global chips on /tools when no category is selected — high-intent cross-cutting. */
export const GLOBAL_FACETS = [
  "loans",
  "investing",
  "savings",
  "percentages",
  "statistics",
  "encode",
  "json-data",
  "password",
  "units",
  "color",
  "date-calc",
  "cooking",
  "quiz",
];

function toolHaystack(tool: {
  slug: string;
  name: string;
  keywords?: string[];
  kind?: string;
  summary?: string;
  category?: string;
}): string {
  return [tool.slug, tool.name, tool.kind, tool.summary, ...(tool.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const tagCache = new WeakMap<object, string[]>();

export function tagsForTool(tool: {
  slug: string;
  name: string;
  keywords?: string[];
  kind?: string;
  summary?: string;
  category?: string;
}): string[] {
  const cached = tagCache.get(tool as object);
  if (cached) return cached;
  const hay = toolHaystack(tool);
  const ids = INTENT_TAGS.filter((t) => t.match(hay)).map((t) => t.id);
  tagCache.set(tool as object, ids);
  return ids;
}

export function toolMatchesTag(
  tool: {
    slug: string;
    name: string;
    keywords?: string[];
    kind?: string;
    summary?: string;
  },
  tagId: string,
): boolean {
  return tagsForTool(tool).includes(tagId);
}

export function facetsForCategory(categorySlug: string | "all", locale: "en" | "es" = "en") {
  const ids =
    categorySlug === "all" || !categorySlug
      ? GLOBAL_FACETS
      : CATEGORY_FACETS[categorySlug] ?? GLOBAL_FACETS;
  return ids
    .map((id) => INTENT_TAGS.find((t) => t.id === id))
    .filter((t): t is IntentTag => Boolean(t))
    .map((t) => ({
      id: t.id,
      label: locale === "es" ? t.labelEs : t.label,
    }));
}

/** Count how many tools in a list match each facet (for hiding empty chips). */
export function facetsWithCounts(
  tools: CatalogTool[] | Array<{ slug: string; name: string; keywords?: string[]; kind?: string; summary?: string }>,
  categorySlug: string | "all",
  locale: "en" | "es" = "en",
) {
  return facetsForCategory(categorySlug, locale)
    .map((facet) => ({
      ...facet,
      count: tools.filter((t) => toolMatchesTag(t, facet.id)).length,
    }))
    .filter((f) => f.count > 0);
}
