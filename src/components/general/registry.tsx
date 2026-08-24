import type {ReactNode} from "react";
import {GENERAL_TOOLS} from "@/lib/general";
import {GeneralTool} from "./GeneralTool";
export const GENERAL_TOOL_UI:Record<string,()=>ReactNode>=Object.fromEntries(GENERAL_TOOLS.map(tool=>[tool.slug,()=> <GeneralTool tool={tool}/>]));
