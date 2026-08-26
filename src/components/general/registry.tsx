import type { ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import { GeneralTool } from "./GeneralTool";
import { MathTool } from "./MathTool";
import { DesignTool } from "./DesignTool";
import { SecurityTool } from "./SecurityTool";
import { TimeTool } from "./TimeTool";
import { ConverterTool } from "./ConverterTool";
import { ScienceTool } from "./ScienceTool";
import { FormulaTool } from "./FormulaTool";
import { EducationTool } from "./EducationTool";
import { GeneratorTool } from "./GeneratorTool";
import { TextTool } from "./TextTool";
import { DevTool } from "./DevTool";
import { MediaTool } from "./MediaTool";

export const GENERAL_TOOL_UI: Record<string, () => ReactNode> = Object.fromEntries(
  GENERAL_TOOLS.map((tool) => [tool.slug, () => {
    if (tool.category === "desarrollo") return <DevTool tool={tool} />;
    if (tool.kind === "image" || tool.kind === "pdf") return <MediaTool tool={tool} />;
    if (tool.kind === "generator") return <GeneratorTool tool={tool} />;
    if (tool.kind === "text") return <TextTool tool={tool} />;
    if (tool.kind === "time") return <TimeTool tool={tool} />;
    if (tool.kind === "education-test" || tool.category === "educacion") return <EducationTool tool={tool} />;
    if (tool.category === "diseno") return <DesignTool tool={tool} />;
    if (tool.category === "seguridad") return <SecurityTool tool={tool} />;
    if (tool.category === "ciencia") return <ScienceTool tool={tool} />;
    if (tool.category === "conversiones") return <ConverterTool tool={tool} />;
    if (tool.kind === "stats") return <MathTool tool={tool} />;
    if (tool.kind === "number") return <FormulaTool tool={tool} />;
    if (tool.category === "fechas") return <TimeTool tool={tool} />;
    return <GeneralTool tool={tool} />;
  }])
);
