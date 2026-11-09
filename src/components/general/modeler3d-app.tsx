import type { GeneralTool } from "@/lib/general/types";
import { Modeler3DStudio } from "./modeler3d-studio";

/**
 * Generic 3D modeler entry (shapes, materials, export).
 * House modeling lives on modelador-casas-3d → HouseModeler3D via registry-3d.
 */
export function Modeler3DApp(props: { tool: GeneralTool; locale?: "en" | "es" }) {
  return <Modeler3DStudio {...props} />;
}
