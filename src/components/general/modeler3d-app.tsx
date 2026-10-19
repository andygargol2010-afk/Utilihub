import type { GeneralTool } from "@/lib/general/types";
import { HouseModeler3D } from "./HouseModeler3D";

/**
 * Full 3D modeler entry — uses the complete HouseModeler3D implementation.
 * (modeler3d-studio depended on missing modeler3d-core; this restores a working path.)
 */
export function Modeler3DApp(props: { tool: GeneralTool; locale?: "en" | "es" }) {
  return <HouseModeler3D {...props} />;
}
