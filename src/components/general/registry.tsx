import type {ComponentType,ReactNode} from "react";
import {GENERAL_TOOLS} from "@/lib/general";
import {GeneralTool} from "./GeneralTool";
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
import type {GeneralTool} from "@/lib/general/types";

type ToolComponent=ComponentType<{tool:GeneralTool}>;

const resolveToolUi=(tool:GeneralTool):ToolComponent=>{
  if(tool.category==="educacion")return EducationTool;
  if(tool.category==="desarrollo"&&tool.kind==="dev-advanced")return DevAdvancedTool;
  if(tool.category==="diseno")return DesignTool;
  if(tool.category==="seguridad")return SecurityTool;
  if(tool.category==="ciencia")return ScienceTool;
  if(tool.category==="conversiones")return ConverterTool;
  if(tool.category==="texto")return TextTool;
  if(tool.category==="matematicas"&&tool.kind==="stats")return MathTool;
  if(tool.category==="matematicas"&&tool.kind==="number")return FormulaTool;
  if(tool.category==="fechas")return TimeTool;
  if(tool.kind==="timer")return TimeTool;
  if(tool.kind==="generator")return GeneralTool;
  if(tool.kind==="text"&&tool.category!=="texto")return GeneralTool;
  if(tool.kind==="code"||tool.kind==="encode")return GeneralTool;
  return MaintenanceTool;
};

export const GENERAL_TOOL_UI:Record<string,()=>ReactNode>=Object.fromEntries(
  GENERAL_TOOLS.map(tool=>[tool.slug,()=>{const Component=resolveToolUi(tool);return <Component tool={tool}/>;}])
);

const missingGeneralUi=GENERAL_TOOLS.filter(tool=>typeof GENERAL_TOOL_UI[tool.slug]!=="function");
if(missingGeneralUi.length>0){throw new Error(`GENERAL_TOOL_UI incompleto: ${missingGeneralUi.map(tool=>tool.slug).join(", ")}`);}
