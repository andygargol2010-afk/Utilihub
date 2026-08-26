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
import { LocalUtilityTool } from "./LocalUtilityTool";

const STATS = new Set(["promedio", "mediana", "moda", "rango", "varianza", "desviacion-estandar", "percentil", "cuartiles", "z-score", "correlacion", "covarianza"]);
const FORMULAS = new Set(["porcentaje", "regla-de-tres", "probabilidad", "combinaciones", "permutaciones", "factorial", "potencias-y-raices", "logaritmos", "notacion-cientifica", "mcd-mcm", "secuencias", "bases-numericas", "porciones-receta", "hidratacion-masa", "coste-comida", "propina-viaje", "consumo-combustible", "coste-km", "divisor-gastos", "propina", "distancia-viaje", "combustible-viaje", "escalador-recetas", "cafe", "horno"]);
const TIMERS = new Set(["cronometro", "cuenta-regresiva", "pomodoro", "temporizador", "temporizador-cocina"]);
const LOCAL_CATEGORIES = new Set(["archivos-documentos", "redes-internet", "imagenes", "audio-video", "geografia-mapas"]);

export const GENERAL_TOOL_UI: Record<string, () => ReactNode> = Object.fromEntries(
  GENERAL_TOOLS.map((tool) => [tool.slug, () => {
    if (LOCAL_CATEGORIES.has(tool.category)) return <LocalUtilityTool tool={tool} />;
    if (tool.kind === "generator") return <GeneratorTool tool={tool} />;
    if (tool.kind === "text") return <TextTool tool={tool} />;
    if (tool.category === "educacion") return <EducationTool tool={tool} />;
    if (tool.category === "diseno") return <DesignTool tool={tool} />;
    if (tool.category === "seguridad") return <SecurityTool tool={tool} />;
    if (tool.category === "ciencia") return <ScienceTool tool={tool} />;
    if (tool.category === "conversiones") return <ConverterTool tool={tool} />;
    if (tool.category === "fechas" || TIMERS.has(tool.slug)) return <TimeTool tool={tool} />;
    if (STATS.has(tool.slug)) return <MathTool tool={tool} />;
    if (FORMULAS.has(tool.slug)) return <FormulaTool tool={tool} />;
    return <GeneralTool tool={tool} />;
  }])
);
