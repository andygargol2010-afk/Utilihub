import type { ComponentType, ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import { GeneralTool } from "./GeneralTool";
import { GeneratorTool } from "./GeneratorTool";
import { MathTool } from "./MathTool";
import { DesignTool } from "./DesignTool";
import { SecurityTool } from "./SecurityTool";
import { TimeTool } from "./TimeTool";
import { ConverterTool } from "./ConverterTool";
import { ScienceTool } from "./ScienceTool";
import { FormulaTool } from "./FormulaTool";
import { EducationTool } from "./EducationTool";
import { DevAdvancedTool } from "./DevAdvancedTool";
import { TextTool } from "./TextTool";
import { MaintenanceTool } from "./MaintenanceTool";
import { MultimediaAdvancedTool } from "./MultimediaAdvancedTool";
import type { GeneralTool as CatalogTool } from "@/lib/general/types";

type ToolComponent = ComponentType<{ tool: CatalogTool }>;
type UiRule = { category?: string; kind?: string; priority?: number; component: ToolComponent };

const UI_RULES: readonly UiRule[] = [
  { category: "educacion", priority: 2, component: EducationTool },
  { category: "desarrollo", priority: 0, component: GeneralTool },
  { category: "desarrollo", kind: "dev-advanced", priority: 2, component: DevAdvancedTool },
  { category: "diseno", priority: 2, component: DesignTool },
  { category: "seguridad", priority: 2, component: SecurityTool },
  { category: "ciencia", priority: 2, component: ScienceTool },
  { category: "conversiones", priority: 2, component: ConverterTool },
  { category: "texto", priority: 2, component: TextTool },
  { category: "matematicas", kind: "stats", priority: 2, component: MathTool },
  { category: "matematicas", kind: "number", priority: 2, component: FormulaTool },
  { category: "fechas", priority: 2, component: TimeTool },
  { category: "productividad", priority: 0, component: GeneralTool },
  { category: "generadores", kind: "image", priority: 2, component: MultimediaAdvancedTool },
  { category: "generadores", kind: "pdf", priority: 2, component: MultimediaAdvancedTool },
  { kind: "timer", priority: 1, component: TimeTool },
  { kind: "generator", priority: 1, component: GeneratorTool },
  { kind: "text", priority: 1, component: GeneralTool },
  { kind: "code", priority: 1, component: GeneralTool },
  { kind: "encode", priority: 1, component: GeneralTool },
  { kind: "maintenance", priority: 1, component: MaintenanceTool },
];

const duplicateSlugs = GENERAL_TOOLS.reduce<string[]>((duplicates, tool, index, tools) => {
  if (tools.findIndex((candidate) => candidate.slug === tool.slug) !== index && !duplicates.includes(tool.slug)) {
    duplicates.push(tool.slug);
  }
  return duplicates;
}, []);

if (duplicateSlugs.length > 0) {
  throw new Error(`GENERAL_TOOLS contiene slugs duplicados: ${duplicateSlugs.join(", ")}`);
}

const matchingRules = (tool: CatalogTool): UiRule[] =>
  UI_RULES.filter(
    (rule) =>
      (rule.category === undefined || rule.category === tool.category) &&
      (rule.kind === undefined || rule.kind === tool.kind),
  );

const resolveToolUi = (tool: CatalogTool): ToolComponent => {
  const matches = matchingRules(tool);
  if (matches.length === 0) {
    throw new Error(`GENERAL_TOOL_UI sin implementación explícita para slug "${tool.slug}" (category="${tool.category}", kind="${tool.kind}")`);
  }

  const specificityScore = (rule: UiRule) =>
    (Number(rule.category !== undefined) + Number(rule.kind !== undefined)) * 10 + (rule.priority ?? 0);
  const maxScore = Math.max(...matches.map(specificityScore));
  const bestMatches = matches.filter((rule) => specificityScore(rule) === maxScore);

  if (bestMatches.length !== 1) {
    throw new Error(`GENERAL_TOOL_UI ambiguo para slug "${tool.slug}": ${bestMatches.length} reglas con igual prioridad estructural`);
  }

  return bestMatches[0].component;
};

const resolvedComponents = new Map<string, ToolComponent>();
for (const tool of GENERAL_TOOLS) {
  if (!tool.slug.trim()) throw new Error("GENERAL_TOOLS contiene una herramienta con slug vacío");
  if (!tool.name.trim()) throw new Error(`Herramienta "${tool.slug}" sin nombre`);
  if (!tool.category.trim()) throw new Error(`Herramienta "${tool.slug}" sin categoría`);
  if (!tool.kind.trim()) throw new Error(`Herramienta "${tool.slug}" sin kind`);
  resolvedComponents.set(tool.slug, resolveToolUi(tool));
}

export const GENERAL_TOOL_UI: Record<string, () => ReactNode> = Object.fromEntries(
  GENERAL_TOOLS.map((tool) => {
    const Component = resolvedComponents.get(tool.slug);
    if (!Component) throw new Error(`GENERAL_TOOL_UI no pudo resolver "${tool.slug}"`);
    return [tool.slug, () => <Component tool={tool} />];
  }),
) as Record<string, () => ReactNode>;

const missingGeneralUi = GENERAL_TOOLS.filter((tool) => typeof GENERAL_TOOL_UI[tool.slug] !== "function");
if (missingGeneralUi.length > 0) {
  throw new Error(`GENERAL_TOOL_UI incompleto: ${missingGeneralUi.map((tool) => tool.slug).join(", ")}`);
}
