import {GENERAL_CATEGORIES} from "./catalog";
import {MATH_TOOLS} from "./math";
import {TEXT_TOOLS} from "./text";
import {DEV_TOOLS} from "./dev";
import {CONVERTER_TOOLS} from "./converters";
import {TIME_TOOLS} from "./time";
import {MISC_TOOLS} from "./misc";
import {SCIENCE_TOOLS} from "./science";
import {PRODUCTIVITY_TOOLS} from "./productivity";
import {MEDIA_TOOLS} from "./media";
import {LIFESTYLE_TOOLS} from "./lifestyle";
import {EDUCATION_TOOLS} from "./education";

export {GENERAL_CATEGORIES};

const TOOL_GROUPS=[
  MATH_TOOLS,
  TEXT_TOOLS,
  DEV_TOOLS,
  CONVERTER_TOOLS,
  TIME_TOOLS,
  MISC_TOOLS,
  SCIENCE_TOOLS,
  PRODUCTIVITY_TOOLS,
  MEDIA_TOOLS,
  LIFESTYLE_TOOLS,
  EDUCATION_TOOLS,
] as const;

const duplicateSlugs=TOOL_GROUPS
  .flat()
  .reduce<string[]>((duplicates,tool,index,tools)=>{
    if(tools.findIndex(candidate=>candidate.slug===tool.slug)!==index&&!duplicates.includes(tool.slug)){
      duplicates.push(tool.slug);
    }
    return duplicates;
  },[]);

if(duplicateSlugs.length>0){
  throw new Error(`Catálogo general con slugs duplicados: ${duplicateSlugs.join(", ")}`);
}

export const GENERAL_TOOLS=TOOL_GROUPS.flat();
