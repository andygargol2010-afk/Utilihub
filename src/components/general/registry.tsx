import type { ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import { GeneralTool } from "./GeneralTool";
import { ConfiguredTool } from "./ConfiguredTool";
import { AdvancedCalculatorTool } from "./AdvancedCalculatorTool";
import { AdvancedDateTool } from "./AdvancedDateTool";
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
import { SequenceTool } from "./SequenceTool";
import { PowerRootTool } from "./PowerRootTool";
import { NormalDistributionTool } from "./NormalDistributionTool";
import { PoissonTool } from "./PoissonTool";
import { DocumentTool } from "./DocumentTool";
import { UtilityAdvancedTool } from "./UtilityAdvancedTool";

const buildRegistry = (locale: "en" | "es"): Record<string, () => ReactNode> => Object.fromEntries(
  GENERAL_TOOLS.map((tool) => [tool.slug, () => {
    if (tool.slug === "secuencias") return <SequenceTool tool={tool} locale={locale} />;
    if (tool.slug === "potencias-y-raices") return <PowerRootTool tool={tool} locale={locale} />;
    if (tool.slug === "distribucion-normal") return <NormalDistributionTool tool={tool} locale={locale} />;
    if (tool.slug === "distribucion-poisson") return <PoissonTool tool={tool} locale={locale} />;
    if (tool.config?.mode === "document") return <DocumentTool tool={tool} locale={locale} />;
    if (tool.category === "utilidades" && tool.kind === "formula") return <UtilityAdvancedTool tool={tool} locale={locale} />;
    if (tool.config?.mode === "date") return <AdvancedDateTool tool={tool} locale={locale} />;
    if (tool.config?.mode === "advanced" && tool.config?.operation) return <AdvancedCalculatorTool tool={tool} locale={locale} />;
    if (tool.config?.operation) return <ConfiguredTool tool={tool} locale={locale} />;
    if (tool.category === "desarrollo") return <DevTool tool={tool} locale={locale} />;
    if (tool.kind === "image" || tool.kind === "pdf") return <MediaTool tool={tool} locale={locale} />;
    if (tool.kind === "generator") return <GeneratorTool tool={tool} locale={locale} />;
    if (tool.kind === "text") return <TextTool tool={tool} locale={locale} />;
    if (tool.kind === "time") return <TimeTool tool={tool} locale={locale} />;
    if (tool.kind === "education-test" || tool.category === "educacion") return <EducationTool tool={tool} locale={locale} />;
    if (tool.category === "diseno") return <DesignTool tool={tool} locale={locale} />;
    if (tool.category === "seguridad") return <SecurityTool tool={tool} locale={locale} />;
    if (tool.category === "ciencia") return <ScienceTool tool={tool} locale={locale} />;
    if (tool.category === "conversiones") return <ConverterTool tool={tool} locale={locale} />;
    if (tool.kind === "stats") return <MathTool tool={tool} locale={locale} />;
    if (tool.kind === "number") return <FormulaTool tool={tool} locale={locale} />;
    if (tool.category === "fechas") return <TimeTool tool={tool} locale={locale} />;
    return <GeneralTool tool={tool} locale={locale} />;
  }])
);

export const GENERAL_TOOL_UI = buildRegistry("en");
export const GENERAL_TOOL_UI_ES = buildRegistry("es");
