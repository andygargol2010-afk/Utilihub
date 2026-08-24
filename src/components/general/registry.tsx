import type {ReactNode} from "react";
import {GENERAL_TOOLS} from "@/lib/general";
import {GeneralTool} from "./GeneralTool";
import {MathTool} from "./MathTool";
const STATS=new Set(["promedio","mediana","rango","varianza","desviacion-estandar"]);
export const GENERAL_TOOL_UI:Record<string,()=>ReactNode>=Object.fromEntries(GENERAL_TOOLS.map(tool=>[tool.slug,()=>STATS.has(tool.slug)?<MathTool tool={tool}/>:<GeneralTool tool={tool}/>]));
