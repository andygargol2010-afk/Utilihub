import type {ComponentType,ReactNode} from "react";
import {GENERAL_TOOLS} from "@/lib/general";
import {GeneralTool} from "./GeneralTool";
import {GeneratorTool} from "./GeneratorTool";
import {MathTool} from "./MathTool";
import {DesignTool} from "./DesignTool";
import {SecurityTool} from "./SecurityTool";
import {TimeTool} from "./TimeTool";
import {ConverterTool} from "./ConverterTool";
import {ScienceTool} from "./ScienceTool";
import {FormulaTool} from "./FormulaTool";
import {EducationTool} from "./EducationTool";
import {DevAdvancedTool} from "./DevAdvancedTool";
import {TextTool} from "./TextTool";
import {MaintenanceTool} from "./MaintenanceTool";
import {MultimediaAdvancedTool} from "./MultimediaAdvancedTool";
import type {GeneralTool as CatalogTool} from "@/lib/general/types";

type ToolComponent=ComponentType<{tool:CatalogTool}>;
type UiRule={category:string;kind?:string;component:ToolComponent};

const UI_RULES:readonly UiRule[]=[
  {category:"educacion",component:EducationTool},
  {category:"desarrollo",kind:"dev-advanced",component:DevAdvancedTool},
  {category:"diseno",component:DesignTool},
  {category:"seguridad",component:SecurityTool},
  {category:"ciencia",component:ScienceTool},
  {category:"conversiones",component:ConverterTool},
  {category:"texto",component:TextTool},
  {category:"matematicas",kind:"stats",component:MathTool},
  {category:"matematicas",kind:"number",component:FormulaTool},
  {category:"fechas",component:TimeTool},
  {category:"generadores",kind:"image",component:MultimediaAdvancedTool},
  {category:"generadores",kind:"pdf",component:MultimediaAdvancedTool},
  {kind:"timer",component:TimeTool},
  {kind:"generator",component:GeneratorTool},
  {kind:"text",component:GeneralTool},
  {kind:"code",component:GeneralTool},
  {kind:"encode",component:GeneralTool},
  {kind:"maintenance",component:MaintenanceTool},
];

const duplicateSlugs=GENERAL_TOOLS.reduce<string[]>((duplicates,tool,index,tools)=>{
  if(tools.findIndex(candidate=>candidate.slug===tool.slug)!==index&&!duplicates.includes(tool.slug))duplicates.push(tool.slug);
  return duplicates;
},[]);

if(duplicateSlugs.length>0){
  throw new Error(`GENERAL_TOOLS contiene slugs duplicados: ${duplicateSlugs.join(", ")}`);
}

const resolveToolUi=(tool:CatalogTool):ToolComponent=>{
  const exactRule=UI_RULES.find(rule=>rule.category===tool.category&&rule.kind===tool.kind);
  const categoryRule=UI_RULES.find(rule=>rule.category===tool.category&&rule.kind===undefined);
  const kindRule=UI_RULES.find(rule=>rule.kind===tool.kind&&rule.category===undefined);
  const Component=exactRule?.component??categoryRule?.component??kindRule?.component;

  if(!Component){
    throw new Error(`GENERAL_TOOL_UI sin implementación explícita para slug "${tool.slug}" (category="${tool.category}", kind="${tool.kind}")`);
  }
  return Component;
};

const resolvedComponents=new Map<string,ToolComponent>();
for(const tool of GENERAL_TOOLS){
  if(!tool.slug.trim())throw new Error("GENERAL_TOOLS contiene una herramienta con slug vacío");
  if(!tool.name.trim())throw new Error(`Herramienta "${tool.slug}" sin nombre`);
  if(!tool.category.trim())throw new Error(`Herramienta "${tool.slug}" sin categoría`);
  if(!tool.kind.trim())throw new Error(`Herramienta "${tool.slug}" sin kind`);
  resolvedComponents.set(tool.slug,resolveToolUi(tool));
}

export const GENERAL_TOOL_UI:Record<string,()=>ReactNode>=Object.fromEntries(
  GENERAL_TOOLS.map(tool=>{
    const Component=resolvedComponents.get(tool.slug);
    if(!Component)throw new Error(`GENERAL_TOOL_UI no pudo resolver "${tool.slug}"`);
    return [tool.slug,()=> <Component tool={tool}/>];
  }),
) as Record<string,()=>ReactNode>;

const missingGeneralUi=GENERAL_TOOLS.filter(tool=>typeof GENERAL_TOOL_UI[tool.slug]!=="function");
if(missingGeneralUi.length>0){
  throw new Error(`GENERAL_TOOL_UI incompleto: ${missingGeneralUi.map(tool=>tool.slug).join(", ")}`);
}
