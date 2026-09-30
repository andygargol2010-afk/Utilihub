import type { GeneralTool } from "@/lib/general/types";
import { Modeler3DStudio } from "./modeler3d-studio";

/** Full 3D modeler — implementation in modeler3d-studio (keeps entry small). */
export function Modeler3DApp(props: { tool: GeneralTool; locale?: "en" | "es" }) {
  return <Modeler3DStudio {...props} />;
}
